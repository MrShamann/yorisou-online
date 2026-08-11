// POR-1 — OPERATOR-ONLY Production deletion-incident recovery.
//
// NOT A PRODUCT PATH. Not importable from any Next.js route, no HTTP surface, no endpoint, no cron,
// no schedule, no worker, no autonomous trigger. It runs when a human runs it, and only then.
//
// WHY IT EXISTS. The 2026-08-10 Production promotion left two release-check accounts stranded past
// the irreversible boundary: sessions revoked, mutation gate closed, data NOT erased, and no product
// path to finish because the only retry is a re-POST of `deletion-confirm` from a session those
// accounts can no longer obtain. Public deletion intake is disabled
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
// WHAT THE EXECUTABLE PATH USED TO GET WRONG.
// It resolved the owner's address from `yorisou_canonical_identity_links.link_subject` and matched
// it against an address pattern. That column does not exist — the registry stores `link_digest`, a
// sha256, and never the plaintext subject — so the read returned nothing and every candidate was
// refused as unproven. The column name was only the visible half of the defect. The rule underneath
// it asked an address whether an account was synthetic, and an address cannot answer that: the
// pattern it matched was preserved nowhere in Production, only in a unit fixture written by the
// commit that introduced the rule.
//
// So the address is no longer resolved at all. Membership is proven from what the database wrote
// while the release check ran — the account's own `account_registration` mutation lease, the job's
// `requested_at`, the contract-versioned manifest, a live re-inventory, and the declared release
// window (see por1SyntheticMembershipEvidence). The identity registry is still read, and still has
// to agree, but it is read for `link_digest` and `owner_fingerprint` and used for CONCORDANCE: it
// proves this is the same account the evidence describes. It is never asked to prove the account was
// not a person.
//
// It is deliberately NOT run against Production by the package that introduced it.

import { createHash } from "node:crypto";

import { buildDeletionManifest } from "../lib/server/accountIdentityDeletion";
import { executeDeletion } from "../lib/server/accountDeletionOrchestrator";
import { emailIdentityDigest, identityOwnerFingerprint } from "../lib/server/canonicalIdentityLinks";
import {
  classifyIncidentCandidate,
  isUnroutableReservedAddress,
  selectIncidentCandidates,
  type IncidentCandidateRow,
} from "../lib/server/por1ProductionIncidentRecovery";
import {
  countManifestDomainArtifacts,
  readManifestCanonicalIdentityLinkCount,
  type ReleaseCheckWindow,
} from "../lib/server/por1SyntheticMembershipEvidence";
import { findAccountById, normalizeEmail } from "../lib/server/yorisouData";

/** The governed Production project. Anything else is refused. */
const PRODUCTION_PROJECT_REF = "krxizslnksorwhepyijs";
/** Named so the refusal can be explicit rather than "not production". */
const PREVIEW_PROJECT_REF = "nbltsbonsnbpfptihomc";

const FORBIDDEN_FLAGS = ["--table", "--object-key", "--email", "--account-id", "--job-id", "--owner"];

/** The lease operation that records an account being provisioned. */
const REGISTRATION_OPERATION_CODE = "account_registration";

const argv = process.argv.slice(2);
const EXECUTE = argv.includes("--execute");

function fail(message: string): never {
  console.error(`refusing to run: ${message}`);
  process.exit(1);
}

function flagValue(name: string): string | null {
  const flag = argv.find((a) => a.startsWith(`${name}=`));
  return flag ? flag.slice(name.length + 1) : null;
}

function maxCandidates(): number | null {
  const raw = flagValue("--max-candidates");
  if (raw === null) return null;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) fail("--max-candidates must be a non-negative integer");
  return value;
}

/**
 * The release-check window, stated by the operator from the deployment record.
 *
 * Required in DRY RUN TOO. A dry run whose rule differs from the executed rule is not a review of
 * anything. Both bounds must parse; the module bounds how wide the window may be, so declaring one
 * can only ever narrow the population.
 */
function releaseWindow(): ReleaseCheckWindow {
  const startedAt = flagValue("--release-window-start");
  const endedAt = flagValue("--release-window-end");
  if (!startedAt || !endedAt) {
    fail(
      "--release-window-start=<iso8601> and --release-window-end=<iso8601> are required — " +
        "membership is proven against the release-check window, not assumed",
    );
  }
  if (!Number.isFinite(Date.parse(startedAt)) || !Number.isFinite(Date.parse(endedAt))) {
    fail("--release-window-start and --release-window-end must be parseable ISO-8601 instants");
  }
  return { startedAt, endedAt };
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

/** A single row, or null when the read returned nothing. Never throws on an empty result. */
function firstRow(rows: unknown[]): Record<string, unknown> | null {
  const row = rows[0];
  return row && typeof row === "object" ? (row as Record<string, unknown>) : null;
}

function textOrNull(value: unknown): string | null {
  return typeof value === "string" && value !== "" ? value : null;
}

/**
 * Derive the candidate population.
 *
 * Bounded by the incident SHAPE, not by an identifier anyone typed: a job that is failed_retryable,
 * parked at database_erasure, past the boundary, and still naming its owner. Everything else about a
 * candidate is then read, never supplied.
 */
async function readCandidates(window: ReleaseCheckWindow): Promise<IncidentCandidateRow[]> {
  const columns =
    "id,owner_account_id,state,execution_cursor,irreversible_started_at,executor_expires_at,requested_at";
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

    const manifests = (await rest(
      `yorisou_account_deletion_manifests?job_id=eq.${encodeURIComponent(jobId)}&select=job_id,payload`,
    )) as Array<Record<string, unknown>>;
    const manifestRow = firstRow(manifests);
    const manifestPresent = manifestRow !== null;

    // ── Class B inputs. Persisted execution truth, no identity value involved. ──────────────────
    let registrationLeaseAt: string | null = null;
    let liveDomainArtifactCount: number | null = null;

    // ── Classes C, D, E inputs. Concordance, read only after the shape already matched. ─────────
    let authoritativeAccountPresent = false;
    let accountIdMatchesOwner = false;
    let emailDigestConcordant = false;
    let ownerFingerprintConcordant = false;
    let ownerAddressUnroutable: boolean | null = null;

    if (ownerAccountId) {
      const owner = encodeURIComponent(ownerAccountId);

      const leases = await rest(
        `yorisou_account_mutation_leases?owner_account_id=eq.${owner}` +
          `&operation_code=eq.${REGISTRATION_OPERATION_CODE}` +
          `&select=issued_at&order=issued_at.asc&limit=1`,
      );
      registrationLeaseAt = textOrNull(firstRow(leases)?.issued_at);

      // The canonical email link. `link_digest` and `owner_fingerprint` — the columns that exist.
      // The plaintext subject is not stored, is not read, and is not needed.
      const links = await rest(
        `yorisou_canonical_identity_links?owner_account_id=eq.${owner}` +
          `&link_kind=eq.email&link_state=eq.active&select=link_digest,owner_fingerprint`,
      );
      const link = firstRow(links);
      const linkDigest = textOrNull(link?.link_digest);
      const linkOwnerFingerprint = textOrNull(link?.owner_fingerprint);

      // The authoritative account read — the established path, which carries its own per-read
      // cache-defeating nonce so this is the current object and not a cached predecessor.
      const account = await findAccountById(ownerAccountId);
      authoritativeAccountPresent = account !== null;
      if (account) {
        accountIdMatchesOwner = account.id === ownerAccountId;
        ownerAddressUnroutable = isUnroutableReservedAddress(account.email ?? null);
        if (linkDigest && account.email) {
          emailDigestConcordant = emailIdentityDigest(normalizeEmail(account.email)) === linkDigest;
        }
        if (linkOwnerFingerprint) {
          ownerFingerprintConcordant =
            identityOwnerFingerprint(ownerAccountId) === linkOwnerFingerprint;
        }

        // Re-inventory the account NOW with the product's own manifest builder, rather than trusting
        // the frozen payload alone. Read-only, and it uses the same shape, so one counter answers
        // both. A manifest that was right at the boundary is not evidence about the present.
        liveDomainArtifactCount = countManifestDomainArtifacts(
          await buildDeletionManifest(ownerAccountId),
        );
      }
    }

    const expires = job.executor_expires_at ? Date.parse(String(job.executor_expires_at)) : NaN;

    rows.push({
      jobFingerprint: fingerprint(jobId),
      state: job.state === null ? null : String(job.state),
      executionCursor: job.execution_cursor === null ? null : String(job.execution_cursor),
      irreversible: job.irreversible_started_at !== null,
      manifestPresent,
      ownerNamed: ownerAccountId !== null,
      executorLeaseLive: Number.isFinite(expires) && expires > Date.now(),
      membership: {
        registrationLeaseAt,
        deletionRequestedAt: textOrNull(job.requested_at),
        manifestPresent,
        manifestDomainArtifactCount: manifestRow
          ? countManifestDomainArtifacts(manifestRow.payload)
          : null,
        manifestCanonicalIdentityLinkCount: manifestRow
          ? readManifestCanonicalIdentityLinkCount(manifestRow.payload)
          : null,
        liveDomainArtifactCount,
        releaseWindow: window,
      },
      authoritativeAccountPresent,
      accountIdMatchesOwner,
      emailDigestConcordant,
      ownerFingerprintConcordant,
      ownerAddressUnroutable,
    });
    // The account id is kept out of the reported row on purpose; it is carried separately.
    (rows[rows.length - 1] as IncidentCandidateRow & { __ownerAccountId?: string }).__ownerAccountId =
      ownerAccountId ?? undefined;
  }
  return rows;
}

async function main() {
  const project = assertProductionOnly();
  const window = releaseWindow();
  const ceiling = maxCandidates();
  const rows = await readCandidates(window);

  const selection = selectIncidentCandidates(rows, { maxCandidates: ceiling ?? -1 });

  console.log(
    JSON.stringify({
      mode: EXECUTE ? "execute" : "dry-run",
      project,
      releaseWindow: window,
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
