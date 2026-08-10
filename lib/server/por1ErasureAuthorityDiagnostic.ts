// POR-1 — internal, boolean-only diagnostics for a governed erasure authority refusal.
//
// THE PROBLEM THIS SOLVES, AND THE ONE IT MUST NOT CREATE.
//
// `yorisou_account_deletion_erase_database` answers every failing authority clause with ONE code:
// `account_deletion_erase_not_authorized`. That opacity is deliberate and correct — naming the
// clause would tell an unauthorised caller which part of the authority to forge next, so a wrong
// token, a stale generation and a missing manifest must be indistinguishable from outside.
//
// But during the 2026-08-10 Production incident that same opacity meant the operator could not tell
// WHY two deletions refused, and the masked error code had already thrown away even the fact that a
// refusal had happened. Opacity to an attacker is a security property; opacity to the operator is
// just an outage you cannot end.
//
// So the SQL is not weakened. Instead the server re-derives the individual invariants itself, from
// its own privileged read, and records them as BOOLEANS.
//
// WHAT MAY LEAVE THIS MODULE. Booleans. That is the entire contract, and it is enforced by
// construction below: the returned object is assembled field by field from comparisons, so there is
// no path by which an id, a token, a hash, a generation number, an email, a session or an object key
// can appear in it. `toBoundedLogRecord` re-coerces every field with `Boolean()` as a second,
// independent guarantee for the thing that actually gets logged.
//
// This is INTERNAL. It is never returned in an HTTP response and there is no endpoint for it.

/** Every invariant `yorisou_account_erasure_job_valid` checks, as independent booleans. */
export type ErasureAuthorityFacts = {
  jobExists: boolean;
  ownerMatches: boolean;
  stateAllowed: boolean;
  manifestExists: boolean;
  irreversibleStarted: boolean;
  cursorMatches: boolean;
  tokenPresent: boolean;
  tokenMatches: boolean;
  generationMatches: boolean;
  leaseLive: boolean;
};

export const ERASURE_AUTHORITY_FACT_KEYS: ReadonlyArray<keyof ErasureAuthorityFacts> = [
  "jobExists",
  "ownerMatches",
  "stateAllowed",
  "manifestExists",
  "irreversibleStarted",
  "cursorMatches",
  "tokenPresent",
  "tokenMatches",
  "generationMatches",
  "leaseLive",
];

/** The row shape this module needs. Values are consumed for COMPARISON ONLY, never echoed. */
export type ErasureAuthorityJobRow = {
  ownerAccountId: string | null;
  state: string | null;
  executionCursor: string | null;
  irreversibleStartedAt: string | null;
  executorTokenHash: string | null;
  executorGeneration: number | null;
  executorExpiresAt: string | null;
  manifestPresent: boolean;
};

export type ErasureAuthorityExpectation = {
  ownerAccountId: string;
  executorTokenHash: string;
  executorGeneration: number;
};

const STATES_ALLOWING_ERASURE = new Set(["database_erasure", "failed_retryable"]);

/**
 * Constant-time-ish string comparison, mirroring the database's `yorisou_ct_eq`.
 *
 * The token hash is not a secret an attacker submits here — this runs after the database already
 * refused — but comparing it in variable time would still be a needless timing signal, and matching
 * the SQL's own semantics keeps the two verdicts explainable against each other.
 */
function constantTimeEquals(a: string | null, b: string | null): boolean {
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Derive the facts. `row === null` means the job could not be read at all, which is itself the first
 * fact and makes every downstream one false rather than unknown.
 */
export function deriveErasureAuthorityFacts(
  row: ErasureAuthorityJobRow | null,
  expected: ErasureAuthorityExpectation,
  now: Date,
): ErasureAuthorityFacts {
  if (!row) {
    return {
      jobExists: false,
      ownerMatches: false,
      stateAllowed: false,
      manifestExists: false,
      irreversibleStarted: false,
      cursorMatches: false,
      tokenPresent: false,
      tokenMatches: false,
      generationMatches: false,
      leaseLive: false,
    };
  }

  const expiresAt = row.executorExpiresAt ? Date.parse(row.executorExpiresAt) : NaN;

  return {
    jobExists: true,
    ownerMatches: row.ownerAccountId !== null && row.ownerAccountId === expected.ownerAccountId,
    stateAllowed: row.state !== null && STATES_ALLOWING_ERASURE.has(row.state),
    manifestExists: row.manifestPresent === true,
    irreversibleStarted: row.irreversibleStartedAt !== null,
    cursorMatches: row.executionCursor === "database_erasure",
    tokenPresent: row.executorTokenHash !== null,
    tokenMatches: constantTimeEquals(row.executorTokenHash, expected.executorTokenHash),
    generationMatches:
      row.executorGeneration !== null && row.executorGeneration === expected.executorGeneration,
    leaseLive: Number.isFinite(expiresAt) && expiresAt > now.getTime(),
  };
}

/** The first invariant that failed, for a one-line operator signal. Null when all hold. */
export function firstFailingErasureInvariant(
  facts: ErasureAuthorityFacts,
): keyof ErasureAuthorityFacts | null {
  for (const key of ERASURE_AUTHORITY_FACT_KEYS) if (!facts[key]) return key;
  return null;
}

/**
 * The exact object that may be logged.
 *
 * Every value is re-coerced with `Boolean()` and every key is taken from the fixed allowlist, so a
 * future field added to `ErasureAuthorityFacts` cannot leak a non-boolean by being forgotten here.
 */
export function toBoundedLogRecord(facts: ErasureAuthorityFacts): Record<string, boolean | string> {
  const record: Record<string, boolean | string> = {};
  for (const key of ERASURE_AUTHORITY_FACT_KEYS) record[key] = Boolean(facts[key]);
  const failing = firstFailingErasureInvariant(facts);
  if (failing) record.firstFailingInvariant = failing;
  return record;
}
