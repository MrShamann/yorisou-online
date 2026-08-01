// POR-1 WS8 — retire the accumulated Preview synthetic identities THROUGH THE GOVERNED PATH.
//
// Every acceptance run before this package left a `@synthetic-preview.invalid` account behind.
// Removing them with hand-written deletes would prove nothing and would quietly establish a second
// erasure path — the exact thing the deletion adapter exists to prevent. So this drives the same
// saga and the same narrow identity adapter the product drives, and it is bounded three ways:
//
//   • it refuses to run against anything but the Preview database;
//   • it will only touch accounts whose email ends in the synthetic suffix;
//   • it takes no account id, key or table name from anywhere — the list is derived, not supplied.
//
// It is idempotent: an account already erased is simply absent on the next pass.

import {
  executeDeletion,
  openDeletionJob,
  advanceToIdentityVerified,
  readDeletionStatus,
} from "../lib/server/accountDeletionOrchestrator";
import { readDeletionManifest } from "../lib/server/accountDeletionExecutor";
import { listAccounts } from "../lib/server/yorisouData";
import { partitionPreviewIdentities } from "../lib/server/previewSyntheticClassifier";
import {
  accountAbsenceIsExpected,
  classifyRecoverableDeletionJob,
  type DeletionJobFacts,
} from "../lib/server/deletionJobRecovery";

const PREVIEW_PROJECT_REF = "nbltsbonsnbpfptihomc";

// WS-G — THE SUFFIX WAS NOT THE POPULATION.
//
// This matched `@synthetic-preview.invalid` only. The acceptance and contention work in this package
// also created 109 accounts on `@example.com`, so a run reported success while leaving all of them
// behind — and the idempotency proof ("the second run removed nothing") would have been true for
// entirely the wrong reason.
//
// The obvious widening is the dangerous one: two unrelated operator scripts in this repository
// create `shadow-*@example.com` and `switch-*@example.com`, and a domain-only rule would destroy
// them as collateral. Membership is decided by `classifyPreviewSyntheticIdentity`, which requires
// the reserved domain AND the generated local-part shape, and everything else is reported as
// unknown and left strictly alone.

/**
 * Destructive work requires an explicit flag. The default is a dry run, because the failure mode of
 * a cleanup tool that defaults to deleting is unrecoverable and the failure mode of one that
 * defaults to reporting is an inconvenience.
 */
const MODE = process.argv.includes("--execute")
  ? "execute"
  : process.argv.includes("--verify-only")
    ? "verify-only"
    : "dry-run";

/**
 * A ceiling the OPERATOR states, from the dry run they just read.
 *
 * A share-based ceiling would be wrong here and worth saying why: this is an ISOLATED Preview whose
 * population is legitimately ~100% synthetic, so "refuse if most of it matches" would block every
 * real cleanup and teach whoever hits it to remove the guard.
 *
 * What is actually worth catching is the population not being what the tool thinks it is — a Preview
 * restored from elsewhere, a misdirected credential, a classifier that started matching more than it
 * should. So `--execute` requires `--max-candidates=<n>`, the operator supplies the number the
 * dry run reported, and a larger candidate set fails closed. It is a count, never an identifier:
 * nothing about WHICH accounts are deleted can be supplied from outside.
 */
function requiredCandidateCeiling(): number {
  const flag = process.argv.find((arg) => arg.startsWith("--max-candidates="));
  if (!flag) {
    throw new Error(
      "refusing to run: --execute requires --max-candidates=<n>. Run the dry run first and pass " +
        "the candidate count it reported.",
    );
  }
  const value = Number.parseInt(flag.slice("--max-candidates=".length), 10);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error("refusing to run: --max-candidates must be a non-negative integer");
  }
  return value;
}

function assertPreviewOnly() {
  const url = process.env.SUPABASE_URL ?? "";
  if (!url.includes(PREVIEW_PROJECT_REF)) {
    throw new Error(
      `refusing to run: SUPABASE_URL is not the Preview project (${PREVIEW_PROJECT_REF}). ` +
        "This script erases accounts and must never be pointed at Production.",
    );
  }
}

/**
 * Durable jobs that still name an owner — the candidate source an account scan cannot see.
 *
 * Read straight from PostgREST rather than through an RPC: this is an operator query for jobs by
 * state, and the governed RPCs are all keyed by an owner id the caller is supposed to already know.
 * That is exactly the assumption that made these orphans invisible.
 */
async function listOwnerNamedJobs(): Promise<Array<DeletionJobFacts & { ownerAccountId: string }>> {
  const url = process.env.SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");

  const response = await fetch(
    `${url}/rest/v1/yorisou_account_deletion_jobs` +
      `?select=owner_account_id,state,execution_cursor,irreversible_started_at,executor_token_hash,executor_expires_at` +
      `&owner_account_id=not.is.null`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  );
  if (!response.ok) throw new Error(`deletion_job_listing_failed:${response.status}`);

  const rows = (await response.json()) as Array<{
    owner_account_id: string;
    state: string;
    execution_cursor: string | null;
    irreversible_started_at: string | null;
    executor_token_hash: string | null;
    executor_expires_at: string | null;
  }>;

  const now = Date.now();
  const jobs = [];
  for (const row of rows) {
    // A manifest read per job, because "past the crossing without one" is the single shape
    // automation must refuse and it cannot be inferred from the job row alone.
    const manifest = await readDeletionManifest(row.owner_account_id).catch(() => null);
    jobs.push({
      ownerAccountId: row.owner_account_id,
      state: row.state,
      cursor: row.execution_cursor,
      irreversible: row.irreversible_started_at !== null,
      hasManifest: manifest !== null,
      // A claim only counts while it is still live; an expired one is not contention.
      executorHeld:
        row.executor_token_hash !== null &&
        row.executor_expires_at !== null &&
        Date.parse(row.executor_expires_at) > now,
    });
  }
  return jobs;
}

async function main() {
  assertPreviewOnly();

  const accounts = await listAccounts();
  const { synthetic, unknown } = partitionPreviewIdentities(accounts);

  const byFamily: Record<string, number> = {};
  for (const account of synthetic) byFamily[account.family] = (byFamily[account.family] ?? 0) + 1;

  // ── THE SECOND CANDIDATE SOURCE ────────────────────────────────────────────
  //
  // Everything above is derived from surviving ACCOUNTS, and that is sound only until
  // `identity_erasure` removes one. After that a failed job leaves satellites with nothing left to
  // enumerate them, and this tool used to report "nothing to clean" over an ACTIVE identity link,
  // owner-linked sessions, LINE lookups and a UserProfile.
  //
  // The durable job outlives the account by design and the manifest is frozen before the crossing,
  // so the job is a first-class candidate source rather than a detail of an account that is gone.
  const ownerNamedJobs = await listOwnerNamedJobs();
  const jobDispositions = ownerNamedJobs.map((job) => ({ job, ...classifyRecoverableDeletionJob(job) }));

  const byJobClass: Record<string, number> = {};
  for (const d of jobDispositions) byJobClass[d.classification] = (byJobClass[d.classification] ?? 0) + 1;

  const syntheticIds = new Set(synthetic.map((a) => a.id));
  const resumableJobs = jobDispositions.filter((d) => d.resumable && !syntheticIds.has(d.job.ownerAccountId));
  const escalate = jobDispositions.filter((d) => d.needsHuman);
  const revisit = jobDispositions.filter((d) => d.revisit);

  // Bounded and non-PII: counts, families, and truncated ids. Never an email.
  console.log(
    JSON.stringify({
      mode: MODE,
      project: PREVIEW_PROJECT_REF,
      scanned: accounts.length,
      syntheticCandidates: synthetic.length,
      byFamily,
      unknownPreserved: unknown.length,
      unknownReasons: unknown.reduce<Record<string, number>>((acc, u) => {
        acc[u.reason] = (acc[u.reason] ?? 0) + 1;
        return acc;
      }, {}),
      ownerNamedJobs: ownerNamedJobs.length,
      byJobClass,
      jobDerivedCandidates: resumableJobs.length,
      needsHuman: escalate.length,
      awaitingLiveClaim: revisit.length,
    }),
  );

  // Escalations are printed, never skipped — a job automation refuses is the one most likely to be
  // forgotten. Bounded labels only.
  for (const d of escalate) {
    console.error(
      `  NEEDS HUMAN ${d.job.ownerAccountId.slice(0, 8)}… — ${d.classification} ` +
        `(cursor=${d.job.cursor ?? "null"}, manifest=${d.job.hasManifest})`,
    );
  }

  if (MODE !== "execute") {
    console.log(`(${MODE}: no destructive operation performed — pass --execute to delete)`);
    return;
  }

  if (synthetic.length === 0 && resumableJobs.length === 0) {
    // "Nothing to clean" is only meaningful now that BOTH sources are empty. It used to be reported
    // while a dozen half-finished deletions sat in the database, because only one source was asked.
    console.log(
      JSON.stringify({
        completed: 0,
        unresolved: 0,
        note: "nothing to clean",
        sourcesChecked: ["surviving_accounts", "durable_owner_named_jobs"],
        needsHuman: escalate.length,
      }),
    );
    if (escalate.length > 0) process.exit(1);
    return;
  }

  const ceiling = requiredCandidateCeiling();
  if (synthetic.length > ceiling) {
    // Fail CLOSED. More candidates than the operator saw means the population moved under them.
    throw new Error(
      `refusing to run: ${synthetic.length} candidates exceeds the stated ceiling of ${ceiling}. ` +
        "Re-run the dry run and confirm the target before proceeding.",
    );
  }

  let completed = 0;
  const unresolved: Array<{ account: string; outcome: string; code?: string }> = [];

  // BULK CLEANUP IS NOT THE PRODUCT PATH, AND THE TRANSPORT NOTICES.
  //
  // Each erasure is dozens of round-trips against the isolated Preview store and database. Run back
  // to back over a hundred accounts, the failure rate climbed from near zero to most of the batch —
  // `fetch failed` and executor claims left by an interrupted pass. Neither is a product defect and
  // neither should be retried inside the saga, which is deliberately single-attempt per invocation.
  //
  // So the OPERATOR loop paces itself and gives a lapsed claim time to expire. This changes nothing
  // about how a real deletion runs; it only stops a bulk sweep from being its own adversary.
  const PACE_MS = 400;
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  for (const account of synthetic) {
    await sleep(PACE_MS);
    // Never log the email — it is the only personal field these records carry, synthetic or not.
    const label = `${account.id.slice(0, 8)}…`;

    try {
      const existing = await readDeletionStatus(account.id);
      if (existing?.state === "completed") {
        completed += 1;
        continue;
      }

      const needsOpening = !existing || existing.state === "cancelled";
      if (needsOpening) await openDeletionJob(account.id);
      if (needsOpening || existing?.state === "requested") {
        await advanceToIdentityVerified(account.id);
      }

      const result = await executeDeletion(account.id);
      if (result.outcome === "completed") {
        completed += 1;
        console.log(`  deleted ${label}`);
      } else {
        unresolved.push({ account: label, outcome: result.outcome, code: result.errorCode });
        console.error(`  UNRESOLVED ${label} — ${result.outcome} (${result.errorCode})`);
      }
    } catch (error) {
      const code = error instanceof Error ? error.message : "unknown";
      unresolved.push({ account: label, outcome: "threw", code });
      console.error(`  THREW ${label} — ${code}`);
    }
  }

  // ── RESUME THE JOB-DERIVED CANDIDATES ──────────────────────────────────────
  //
  // `executeDeletion` resumes from the durable cursor against the FROZEN manifest and never
  // re-derives targets from surviving objects — which is exactly why it still works when the account
  // is already gone. No new deletion path is introduced here; the governed saga is simply pointed at
  // work it had already started.
  let resumed = 0;
  for (const d of resumableJobs) {
    await sleep(PACE_MS);
    const label = `${d.job.ownerAccountId.slice(0, 8)}…`;
    const expected = accountAbsenceIsExpected(d.job.cursor) ? " (account absent by design)" : "";
    try {
      const result = await executeDeletion(d.job.ownerAccountId);
      if (result.outcome === "completed") {
        resumed += 1;
        console.log(`  resumed ${label} — ${d.classification}${expected}`);
      } else {
        unresolved.push({ account: label, outcome: result.outcome, code: result.errorCode });
        console.error(`  UNRESOLVED ${label} — ${d.classification} ${result.outcome} (${result.errorCode})`);
      }
    } catch (error) {
      const code = error instanceof Error ? error.message : "unknown";
      unresolved.push({ account: label, outcome: "threw", code });
      console.error(`  THREW ${label} — ${d.classification} ${code}`);
    }
  }

  console.log(
    JSON.stringify({
      completed,
      resumed,
      unresolved: unresolved.length,
      needsHuman: escalate.length,
      awaitingLiveClaim: revisit.length,
    }),
  );
  // A job automation refused is not a pass. Escalations fail the run so they cannot be mistaken for
  // a clean sweep.
  if (escalate.length > 0) process.exit(1);
  // A partial run is reported as a failure. "Mostly cleaned up" is not a state anyone should
  // discover later from a stale record.
  if (unresolved.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "unknown");
  process.exit(1);
});
