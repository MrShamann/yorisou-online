// YV-1.1 — PURE (no server-only) contract helpers shared by the API layer and
// tests. Kept free of `server-only` so the node contract suite can exercise the
// provenance gate directly for EACH stale field, and free of Next imports so it
// can be reused anywhere.

import { YORISOU_VALUES_DEFINITION, YORISOU_VALUES_BANK_HASH } from "./definition.generated";

// The single source of the expected provenance every stored record and every
// mutation must match. Fail closed on any drift (YV-C2). YV-1.2 (YV-C6): the
// method IDENTITY (`methodId`) is one of the SIX fields — the DB CHECK constraint
// on method_id is not a substitute for the explicit six-field contract.
export const CANONICAL_VALUES_PROVENANCE = {
  methodId: YORISOU_VALUES_DEFINITION.methodId,
  methodVersion: YORISOU_VALUES_DEFINITION.methodVersion,
  bankVersion: YORISOU_VALUES_DEFINITION.bankVersion,
  scoringVersion: YORISOU_VALUES_DEFINITION.scoringVersion,
  resultSchemaVersion: YORISOU_VALUES_DEFINITION.resultSchemaVersion,
  bankContentHash: YORISOU_VALUES_BANK_HASH,
} as const;

// True only when ALL SIX provenance fields on the stored record still match the
// current canonical definition (method_id included). A stale record is never
// reinterpreted under a changed definition; it stays deletable.
export function recordProvenanceMatchesCanonical(record: {
  method_id: string;
  method_version: string;
  bank_version: string;
  scoring_version: string;
  result_schema_version: string;
  bank_content_hash: string;
}): boolean {
  return (
    record.method_id === CANONICAL_VALUES_PROVENANCE.methodId &&
    record.method_version === CANONICAL_VALUES_PROVENANCE.methodVersion &&
    record.bank_version === CANONICAL_VALUES_PROVENANCE.bankVersion &&
    record.scoring_version === CANONICAL_VALUES_PROVENANCE.scoringVersion &&
    record.result_schema_version === CANONICAL_VALUES_PROVENANCE.resultSchemaVersion &&
    record.bank_content_hash === CANONICAL_VALUES_PROVENANCE.bankContentHash
  );
}

// YV-C4: strict top-level contract — return the first key outside the allowlist
// (or null). Callers reject any request carrying an unknown/typo field.
export function firstUnknownKey(body: Record<string, unknown>, allowed: readonly string[]): string | null {
  for (const key of Object.keys(body)) {
    if (!allowed.includes(key)) return key;
  }
  return null;
}
