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
import { listAccounts } from "../lib/server/yorisouData";
import { partitionPreviewIdentities } from "../lib/server/previewSyntheticClassifier";

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

async function main() {
  assertPreviewOnly();

  const accounts = await listAccounts();
  const { synthetic, unknown } = partitionPreviewIdentities(accounts);

  const byFamily: Record<string, number> = {};
  for (const account of synthetic) byFamily[account.family] = (byFamily[account.family] ?? 0) + 1;

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
    }),
  );

  if (MODE !== "execute") {
    console.log(`(${MODE}: no destructive operation performed — pass --execute to delete)`);
    return;
  }

  if (synthetic.length === 0) {
    console.log(JSON.stringify({ completed: 0, unresolved: 0, note: "nothing to clean" }));
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

  console.log(JSON.stringify({ completed, unresolved: unresolved.length }));
  // A partial run is reported as a failure. "Mostly cleaned up" is not a state anyone should
  // discover later from a stale record.
  if (unresolved.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "unknown");
  process.exit(1);
});
