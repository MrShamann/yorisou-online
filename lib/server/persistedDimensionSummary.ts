// CPC-1 Wave A — bounded persisted dimension summary (PersistedDimensionSummaryV1).
//
// PURE and free of `server-only` so the node contract suite exercises it directly (repo pattern:
// lib/yorisou/methods/yorisou-values/contract.ts).
//
// WHY THIS EXISTS — a real defect found in review:
// completion previously persisted `scoringOutput.groupedBySubdimension` verbatim, which is
// `Record<SubdimensionCode, OptionScore[]>`. Every OptionScore carries `questionId` AND `optionId`,
// so that payload could RECONSTRUCT THE USER'S ANSWER TRAIL. That contradicts contract 04
// ("no raw answers") and falsified the erasure guarantee, because erasing `answers` while keeping
// the scoring rows leaves the answers recoverable.
//
// This module reduces the governed scoring output to a bounded, versioned, non-reconstructable
// summary. It intentionally carries NO questionId, NO optionId, NO sourceRow, NO per-row data.

export const PERSISTED_DIMENSION_SUMMARY_VERSION = "pds-v1" as const;

export type PersistedDimensionSummaryV1 = {
  v: typeof PERSISTED_DIMENSION_SUMMARY_VERSION;
  /** Number of governed rows that contributed. Aggregate only. */
  answeredRows: number;
  /** Coverage completeness reported by the governed aggregator. */
  formulaStatus: string | null;
  /** Per-dimension contribution COUNTS only — never the rows themselves. */
  dimensionCounts: Record<string, number>;
};

type LooseRow = { dimensionCode?: unknown };

/**
 * Reduce governed scoring output to the bounded persisted summary.
 * Accepts the REAL shape: Record<SubdimensionCode, OptionScore[]>.
 */
export function buildPersistedDimensionSummary(scoringOutput: unknown): PersistedDimensionSummaryV1 {
  const out: PersistedDimensionSummaryV1 = {
    v: PERSISTED_DIMENSION_SUMMARY_VERSION,
    answeredRows: 0,
    formulaStatus: null,
    dimensionCounts: {},
  };
  if (!scoringOutput || typeof scoringOutput !== "object") return out;

  const status = (scoringOutput as { formulaStatus?: unknown }).formulaStatus;
  out.formulaStatus = typeof status === "string" ? status : null;

  const grouped = (scoringOutput as { groupedBySubdimension?: unknown }).groupedBySubdimension;
  if (!grouped || typeof grouped !== "object" || Array.isArray(grouped)) return out;

  for (const rows of Object.values(grouped as Record<string, unknown>)) {
    if (!Array.isArray(rows)) continue;
    for (const row of rows as LooseRow[]) {
      out.answeredRows += 1;
      const dim = typeof row?.dimensionCode === "string" ? row.dimensionCode : null;
      if (dim) out.dimensionCounts[dim] = (out.dimensionCounts[dim] ?? 0) + 1;
    }
  }
  return out;
}

/** Accept only the exact known version; anything else is treated as absent. */
export function readPersistedDimensionSummary(raw: unknown): PersistedDimensionSummaryV1 | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Partial<PersistedDimensionSummaryV1>;
  if (r.v !== PERSISTED_DIMENSION_SUMMARY_VERSION) return null;
  if (typeof r.answeredRows !== "number" || !Number.isFinite(r.answeredRows)) return null;
  if (!r.dimensionCounts || typeof r.dimensionCounts !== "object" || Array.isArray(r.dimensionCounts)) return null;
  return {
    v: PERSISTED_DIMENSION_SUMMARY_VERSION,
    answeredRows: r.answeredRows,
    formulaStatus: typeof r.formulaStatus === "string" ? r.formulaStatus : null,
    dimensionCounts: r.dimensionCounts as Record<string, number>,
  };
}

/** Forbidden keys that must never appear anywhere in a persisted payload. */
export const FORBIDDEN_PERSISTED_KEYS = [
  "questionId", "optionId", "sourceRow", "answers", "primarySignal",
  "secondarySignals", "primaryAxisContribution", "secondaryAxisModifiers",
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
