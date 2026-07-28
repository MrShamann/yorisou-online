// CPC-1 Wave A — bounded projection of the PERSISTED dimension output into a renderable shape.
//
// Contract 02: governed result COPY is resolved from the protected taxonomy by the persisted
// resultId (that is what EvidencePanel/ConstellationPanel already do correctly and must keep
// doing). This module is the separate, missing surface: the server-computed dimensional signal
// that was stored at completion and until now had no rendering at all.
//
// PURE by design and deliberately free of `server-only` — it touches no database, secret or
// request context — so the node contract suite can exercise it directly. This mirrors the existing
// lib/yorisou/methods/yorisou-values/contract.ts pattern.
//
// Rules: shape-validated; malformed input yields null so the caller omits the section; never
// substituted from URL or local data; no raw answers; no internal win-rate numerics exposed.

export type SupportingSignal = { key: string; label: string; weight: number };
export type SupportingSignals = { signals: SupportingSignal[]; complete: boolean };

// Japanese labels for the governed subdimension keys. Unknown keys are dropped rather than
// rendered raw, so an internal identifier can never leak into the interface.
const SUBDIMENSION_LABELS: Record<string, string> = {
  anshin: "見通しの安心", pace: "自分のペース", tsunagari: "つながりの温度",
  seicho: "のびしろの手応え", yakuwari: "役に立つ実感", totonoi: "暮らしの整い",
  jikkan: "心が動く瞬間",
};

const MAX_SIGNALS = 5;

function labelFor(key: string): string | null {
  if (SUBDIMENSION_LABELS[key]) return SUBDIMENSION_LABELS[key];
  // Accept a governed "dimension.subdimension" form by taking the leading dimension.
  const head = key.split(".")[0];
  return SUBDIMENSION_LABELS[head] ?? null;
}

/**
 * Project persisted `dimension_output` into at most MAX_SIGNALS labelled signals.
 * Returns null when the payload is absent or malformed — the caller must then omit the section.
 */
export function buildSupportingSignals(dimensionOutput: Record<string, unknown> | null): SupportingSignals | null {
  if (!dimensionOutput || typeof dimensionOutput !== "object") return null;

  const grouped = (dimensionOutput as { groupedBySubdimension?: unknown }).groupedBySubdimension;
  if (!grouped || typeof grouped !== "object" || Array.isArray(grouped)) return null;

  const entries: SupportingSignal[] = [];
  for (const [key, raw] of Object.entries(grouped as Record<string, unknown>)) {
    // Accept either a bare count or an object carrying a count-like field.
    const value =
      typeof raw === "number"
        ? raw
        : raw && typeof raw === "object" && typeof (raw as { count?: unknown }).count === "number"
          ? (raw as { count: number }).count
          : null;
    if (value === null || !Number.isFinite(value) || value < 0) continue;
    const label = labelFor(key);
    if (!label) continue;
    entries.push({ key, label, weight: value });
  }
  if (entries.length === 0) return null;

  const max = Math.max(...entries.map((e) => e.weight));
  if (max <= 0) return null;

  const signals = entries
    .sort((a, b) => b.weight - a.weight)
    .slice(0, MAX_SIGNALS)
    // Normalise to a 0–1 relative share. Internal absolute scores are never exposed.
    .map((e) => ({ ...e, weight: Math.round((e.weight / max) * 100) / 100 }));

  const status = (dimensionOutput as { formulaStatus?: unknown }).formulaStatus;
  return { signals, complete: status === "complete" || status === null || status === undefined };
}
