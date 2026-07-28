// CPC-1 Wave A — the canonical persisted result envelope.
//
// PURE and free of `server-only` so the node contract suite exercises it directly (repo pattern:
// lib/yorisou/methods/yorisou-values/contract.ts).
//
// HISTORY AND ACCURATE FRAMING
// Completion originally persisted `scoringOutput.groupedBySubdimension` verbatim, i.e.
// Record<SubdimensionCode, OptionScore[]>, where each row carries questionId and optionId. That was
// a LIVE OVER-RETENTION defect: reconstructable answer information was kept for the lifetime of the
// row without an approved use. It was NOT an erasure failure — migration 202607270004's
// yorisou_assessment_result_erase already clears dimension_output to '{}', clears answers, and
// nulls the result identifiers and owner linkage, and a lifecycle constraint enforces that shape.
// Keep that distinction exact in all reporting.
//
// MINIMIZATION DECISION
// An intermediate version stored { answeredRows, formulaStatus, dimensionCounts }. Those carry
// essentially no user information: a completed 120Q always answers every item, formulaStatus is
// methodology metadata, and dimensionCode/subdimensionCode are FIXED properties of the question
// bank rather than user choices — so per-dimension counts mostly describe how the bank is
// structured, not what the person selected. With no governed public dimension projection, storing
// a user-looking summary that is really bank structure fails data minimization. The live envelope
// is therefore reduced to a version marker only. The user's actual outcome is carried by
// `result_id`; provenance is carried by the dedicated scoring_version / result_schema_version
// columns.

export const PERSISTED_RESULT_ENVELOPE_VERSION = "pds-v1" as const;

/** The ONLY payload shape permitted in yorisou_assessment_results.dimension_output. */
export type PersistedResultEnvelopeV1 = { v: typeof PERSISTED_RESULT_ENVELOPE_VERSION };

export function buildPersistedResultEnvelope(): PersistedResultEnvelopeV1 {
  return { v: PERSISTED_RESULT_ENVELOPE_VERSION };
}

/**
 * Strict reader. Returns the typed envelope or null — never an arbitrary object.
 * Rejects (does not sanitise) unknown versions, extra top-level fields, arrays and malformed input.
 */
export function readPersistedResultEnvelope(raw: unknown): PersistedResultEnvelopeV1 | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const keys = Object.keys(raw as Record<string, unknown>);
  // Exact shape: exactly one key, exactly the known version. Anything else is refused outright
  // rather than stripped-and-accepted, so a legacy raw payload can never be partially honoured.
  if (keys.length !== 1 || keys[0] !== "v") return null;
  if ((raw as { v?: unknown }).v !== PERSISTED_RESULT_ENVELOPE_VERSION) return null;
  return { v: PERSISTED_RESULT_ENVELOPE_VERSION };
}

/** Fields that must never appear anywhere in a persisted payload. */
export const FORBIDDEN_PERSISTED_KEYS = [
  "questionId", "optionId", "sourceRow", "answers", "primarySignal", "secondarySignals",
  "primaryAxisContribution", "secondaryAxisModifiers", "signalStrength", "groupedBySubdimension",
  "groupedByDimension", "groupedByPrimarySignal",
] as const;

export function containsForbiddenKey(value: unknown): string | null {
  const seen = new Set<unknown>();
  const walk = (v: unknown): string | null => {
    if (!v || typeof v !== "object" || seen.has(v)) return null;
    seen.add(v);
    if (Array.isArray(v)) { for (const i of v) { const h = walk(i); if (h) return h; } return null; }
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if ((FORBIDDEN_PERSISTED_KEYS as readonly string[]).includes(k)) return k;
      const hit = walk(val); if (hit) return hit;
    }
    return null;
  };
  return walk(value);
}
