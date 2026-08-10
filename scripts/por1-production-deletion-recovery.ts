// POR-1 — OPERATOR-ONLY Production deletion-incident recovery.
//
// NOT A PRODUCT PATH. Not importable from any Next.js route, no HTTP surface, no endpoint, no cron,
// no schedule, no worker, no autonomous trigger. It runs when a human runs it, and only then.
//
// WHY IT EXISTS. The 2026-08-10 Production promotion left two synthetic `.invalid` accounts stranded
// past the irreversible boundary: sessions revoked, mutation gate closed, data NOT erased, and no
// product path to finish because the only retry is a re-POST of `deletion-confirm` from a session
// those accounts can no longer obtain. Public deletion intake is disabled
// (`YORISOU_POR1_ACCOUNT_DELETION_EXECUTOR=off`) and must stay that way while they are cleaned up.
//
// HOW IT IS SAFE.
//   • DRY RUN BY DEFAULT. Destruction requires --execute AND an explicit --max-candidates ceiling.
//   • It hard-guards the governed Production project and REFUSES Preview or any unknown project.
//   • It takes no table name, no object key, no email, no account id, no job id from the CLI. The
//     candidate set is DERIVED.
//   • It never issues a DELETE and never touches an account object. Its only destructive engine is
//     `executeDeletion()` — the same governed saga the product uses.
//   • It never opens a job. Only jobs that ALREADY crossed the boundary are resumable, which is what
//     lets it work while the public capability is off (see accountErasureAuthorityRollout).
//   • Unknown or non-synthetic candidates are reported, untouched, and exit non-zero.
//
// It is deliberately NOT run against Production by the package that introduced it.

import { createHash } from "node:crypto";

import { executeDeletion } from "../lib/server/accountDeletionOrchestrator";
import {
  classifyIncidentCandidate,
  selectIncidentCandidates,
  type IncidentCandidateRow,
} from "../lib/server/por1ProductionIncidentRecovery";

/** The governed Production project. Anything else is refused. */
const PRODUCTION_PROJECT_REF = "krxizslnksorwhepyijs";
/** Named so the refusal can be explicit rather than "not production". */
const PREVIEW_PROJECT_REF = "nbltsbonsnbpfptihomc";

const FORBIDDEN_FLAGS = ["--table", "--object-key", "--email", "--account-id", "--job-id", "--owner"];

const argv = process.argv.slice(2);
const EXECUTE = argv.includes("--execute");

function fail(message: string): never {
  console.error(`refusing to run: ${message}`);
  process.exit(1);
}

function maxCandidates(): number | null {
  const flag = argv.find((a) => a.startsWith("--max-candidates="));
  if (!flag) return null;
  const value = Number(flag.split("=")[1]);
  if (!Number.isInteger(value) || value < 0) fail("--max-candidates must be a non-negative integer");
  return value;
}

function assertProductionOnly(): string {
  for (const flag of FORBIDDEN_FLAGS) {
    if (argv.some((a) => a.startsWith(flag))) {
      fail(`${flag} is not accepted — candidates are DERIVED, never supplied`);
    }
  }
  const url = process.env.SUPABASE_URL ?? "";
  if (url.includes(PREVIEW_PROJECT_REF)) {
    fail(`SUPABASE_URL is the PREVIEW project (${PREVIEW_PROJECT_REF}); this tool is Production-only`);
  }
  if (!url.includes(PRODUCTION_PROJECT_REF)) {
    fail(`SUPABASE_URL is not the governed Production project (${PRODUCTION_PROJECT_REF})`);
  }
  return PRODUCTION_PROJECT_REF;
}

const fingerprint = (value: string) => createHash("sha256").update(value).digest("hex").slice(0, 12);

async function rest(path: string): Promise<unknown[]> {
  const url = process.env.SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key) fail("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  if (!response.ok) fail(`read failed: ${response.status}`);
  return (await response.json()) as unknown[];
}

/**
 * Derive the candidate population.
 *
 * Bounded by the incident SHAPE, not by an identifier anyone typed: a job that is failed_retryable,
 * parked at database_erasure, past the boundary, and still naming its owner.
 */
async function readCandidates(): Promise<IncidentCandidateRow[]> {
  const columns =
    "id,owner_account_id,state,execution_cursor,irreversible_started_at,executor_expires_at";
  const jobs = (await rest(
    `yorisou_account_deletion_jobs?state=eq.failed_retryable` +
      `&execution_cursor=eq.database_erasure` +
      `&irreversible_started_at=not.is.null` +
      `&owner_account_id=not.is.null&select=${columns}`,
  )) as Array<Record<string, unknown>>;

  const rows: IncidentCandidateRow[] = [];
  for (const job of jobs) {
    const jobId = String(job.id);
    const ownerAccountId = job.owner_account_id === null ? null : String(job.owner_account_id);

    const manifests = await rest(
      `yorisou_account_deletion_manifests?job_id=eq.${encodeURIComponent(jobId)}&select=job_id`,
    );

    // The address is resolved from the identity link registry, never from a CLI argument. If it
    // cannot be resolved the candidate stays UNPROVEN and will be refused.
    let ownerEmail: string | null = null;
    if (ownerAccountId) {
      const links = (await rest(
        `yorisou_canonical_identity_links?owner_account_id=eq.${encodeURIComponent(ownerAccountId)}` +
          `&link_kind=eq.email&select=link_subject`,
      )) as Array<Record<string, unknown>>;
      const subject = links[0]?.link_subject;
      ownerEmail = typeof subject === "string" ? subject : null;
    }

    const expires = job.executor_expires_at ? Date.parse(String(job.executor_expires_at)) : NaN;

    rows.push({
      jobFingerprint: fingerprint(jobId),
      state: job.state === null ? null : String(job.state),
      executionCursor: job.execution_cursor === null ? null : String(job.execution_cursor),
      irreversible: job.irreversible_started_at !== null,
      manifestPresent: manifests.length > 0,
      ownerNamed: ownerAccountId !== null,
      executorLeaseLive: Number.isFinite(expires) && expires > Date.now(),
      ownerEmail,
    });
    // The account id is kept out of the reported row on purpose; it is carried separately.
    (rows[rows.length - 1] as IncidentCandidateRow & { __ownerAccountId?: string }).__ownerAccountId =
      ownerAccountId ?? undefined;
  }
  return rows;
}

async function main() {
  const project = assertProductionOnly();
  const ceiling = maxCandidates();
  const rows = await readCandidates();

  const selection = selectIncidentCandidates(rows, { maxCandidates: ceiling ?? -1 });

  console.log(
    JSON.stringify({
      mode: EXECUTE ? "execute" : "dry-run",
      project,
      candidatesScanned: rows.length,
      resumable: selection.resumable.length,
      revisit: selection.revisit.length,
      refused: selection.refused.length,
      ceiling,
      safeToExecute: selection.safeToExecute,
      blockReason: selection.blockReason,
    }),
  );

  for (const row of selection.resumable) {
    console.log(`  RESUMABLE  ${row.jobFingerprint}  ${classifyIncidentCandidate(row).action}`);
  }
  for (const item of selection.revisit) {
    console.log(`  REVISIT    ${item.row.jobFingerprint}  ${item.reason}`);
  }
  for (const item of selection.refused) {
    console.error(`  REFUSED    ${item.row.jobFingerprint}  ${item.reason} — LEFT UNTOUCHED`);
  }

  if (!EXECUTE) {
    console.log(`(dry-run: no destructive operation — pass --execute --max-candidates=<n> to resume)`);
    // A refusal is still a finding even in a dry run.
    process.exit(selection.refused.length > 0 ? 1 : 0);
  }

  if (ceiling === null) fail("--execute requires an explicit --max-candidates=<n> from the dry run");
  if (!selection.safeToExecute) fail(`population changed since review: ${selection.blockReason}`);

  let completed = 0;
  const unresolved: string[] = [];
  for (const row of selection.resumable) {
    const ownerAccountId = (row as IncidentCandidateRow & { __ownerAccountId?: string })
      .__ownerAccountId;
    if (!ownerAccountId) {
      unresolved.push(`${row.jobFingerprint}:owner_unresolved`);
      continue;
    }
    // THE ONLY DESTRUCTIVE ENGINE. No direct erasure adapter, no DELETE, no object removal.
    const outcome = await executeDeletion(ownerAccountId);
    if (outcome.outcome === "completed") {
      completed += 1;
      console.log(`  RESUMED    ${row.jobFingerprint}  completed`);
    } else {
      unresolved.push(`${row.jobFingerprint}:${outcome.outcome}:${outcome.errorCode ?? ""}`);
      console.error(`  UNRESOLVED ${row.jobFingerprint}  ${outcome.outcome} ${outcome.errorCode ?? ""}`);
    }
  }

  console.log(JSON.stringify({ completed, unresolved: unresolved.length }));
  if (unresolved.length > 0 || selection.refused.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "unknown");
  process.exit(1);
});
