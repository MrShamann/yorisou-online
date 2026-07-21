// YV-1 — minimal channel-neutral SCORED method runtime boundary.
//
// This is a bounded, method-specific scored runtime — NOT a generalized scored
// engine for all YORISOU methods and NOT the complete Dynamic Test Engine. It is
// independent from the DCI `recorded_state` runtime (lib/yorisou/method-runtime/
// recordedState.ts): it supports exactly one MTF-1.3 execution model (`scored`)
// and rejects every other model explicitly. It contains no recorded_state logic,
// no persona logic, no cross-method scoring, no LINE logic and no route-specific
// business logic. A future method-orchestration layer may compose this boundary
// without it pretending to be the whole engine.

export type ScoredPairItem = {
  itemId: string;
  pair: readonly [string, string];
  choiceA: { dimension: string };
  choiceB: { dimension: string };
};

// The channel-neutral definition a scored method hands to the runtime.
export type ScoredMethodDefinition = {
  methodId: string;
  methodVersion: string;
  executionModel: string; // only "scored" is executable by this boundary
  bankVersion: string;
  scoringVersion: string;
  resultSchemaVersion: string;
  bankContentHash: string;
  dimensionOrder: readonly string[]; // canonical declaration order (tie-break)
  dimensionAppearances: Readonly<Record<string, number>>;
  items: readonly ScoredPairItem[];
  requiredAnsweredItems: number;
  mixedThreshold: number;
};

// answers: itemId -> "A" | "B" (the SELECTED side). The runtime reads the
// dimension attached to the selected canonical choice, never the A/B position.
export type ScoredAnswers = Record<string, "A" | "B">;

export type ScoredRuntimeValidationError = {
  code:
    | "unsupported_execution_model"
    | "bank_hash_mismatch"
    | "unknown_item"
    | "duplicate_item"
    | "unknown_side"
    | "unknown_dimension";
  message: string;
};

export type ScoredProvenance = {
  kind: "scored";
  bankVersion: string;
  scoringVersion: string;
  methodVersion: string;
  deterministic: true;
};

// Internal (server-private) numeric detail — NEVER surfaced to the user.
export type ScoredInternalScores = {
  wins: Readonly<Record<string, number>>;
  winRate: Readonly<Record<string, number>>; // wins / appearances
  orderedByWinRate: readonly string[]; // desc, ties resolved by declaration order
};

export type ScoredResultEnvelope = {
  resultVariant: "ArchetypeResult";
  methodId: string;
  execution: "scored" | "insufficient_coverage";
  answeredCount: number;
  remaining: number;
  // Present only when execution === "scored":
  primaryDimension: string | null;
  secondaryDimension: string | null;
  isMixed: boolean;
  closeSet: readonly string[]; // Mixed close set (declaration order) or []
  provenance: ScoredProvenance;
  confirmation: { required: true };
  // internal is stripped by the API layer before any user-facing response.
  internal: ScoredInternalScores | null;
};

export type ScoredExecution =
  | { ok: true; envelope: ScoredResultEnvelope }
  | { ok: false; errors: ScoredRuntimeValidationError[] };

// Execute a scored assessment deterministically. Answer order and A/B side order
// never affect the outcome (scoring reads dimensions, not sides).
export function executeScored(
  definition: ScoredMethodDefinition,
  answers: ScoredAnswers,
  bankHash: string,
): ScoredExecution {
  const errors: ScoredRuntimeValidationError[] = [];
  if (definition.executionModel !== "scored") {
    return { ok: false, errors: [{ code: "unsupported_execution_model", message: `this runtime boundary executes only scored (got: ${definition.executionModel})` }] };
  }
  if (bankHash !== definition.bankContentHash) {
    return { ok: false, errors: [{ code: "bank_hash_mismatch", message: "bank content hash mismatch — saved answers are invalidated by a canonical change" }] };
  }

  const itemById = new Map(definition.items.map((i) => [i.itemId, i]));
  const knownDimensions = new Set(definition.dimensionOrder);
  const seen = new Set<string>();
  const wins: Record<string, number> = Object.fromEntries(definition.dimensionOrder.map((d) => [d, 0]));

  for (const [itemId, side] of Object.entries(answers)) {
    const item = itemById.get(itemId);
    if (!item) {
      errors.push({ code: "unknown_item", message: `unknown item: ${itemId}` });
      continue;
    }
    if (seen.has(itemId)) {
      errors.push({ code: "duplicate_item", message: `duplicate item: ${itemId}` });
      continue;
    }
    seen.add(itemId);
    if (side !== "A" && side !== "B") {
      errors.push({ code: "unknown_side", message: `unknown side for ${itemId}: ${String(side)}` });
      continue;
    }
    const dimension = side === "A" ? item.choiceA.dimension : item.choiceB.dimension;
    if (!knownDimensions.has(dimension)) {
      errors.push({ code: "unknown_dimension", message: `unknown dimension for ${itemId}: ${dimension}` });
      continue;
    }
    wins[dimension] += 1;
  }
  if (errors.length) return { ok: false, errors };

  const answeredCount = seen.size;
  const provenance: ScoredProvenance = {
    kind: "scored",
    bankVersion: definition.bankVersion,
    scoringVersion: definition.scoringVersion,
    methodVersion: definition.methodVersion,
    deterministic: true,
  };

  // Coverage: a canonical result requires ALL required items. 0..N-1 →
  // insufficient_coverage (no primary/secondary/Mixed, no imputation).
  if (answeredCount < definition.requiredAnsweredItems) {
    return {
      ok: true,
      envelope: {
        resultVariant: "ArchetypeResult",
        methodId: definition.methodId,
        execution: "insufficient_coverage",
        answeredCount,
        remaining: definition.requiredAnsweredItems - answeredCount,
        primaryDimension: null,
        secondaryDimension: null,
        isMixed: false,
        closeSet: [],
        provenance,
        confirmation: { required: true },
        internal: null,
      },
    };
  }

  // Pairwise win-rate: dimensionScore = wins / canonical appearances.
  const winRate: Record<string, number> = {};
  for (const d of definition.dimensionOrder) {
    const appearances = definition.dimensionAppearances[d] ?? 0;
    winRate[d] = appearances > 0 ? wins[d] / appearances : 0;
  }
  // Order by win-rate desc; ties resolved by canonical declaration order.
  const declIndex = new Map(definition.dimensionOrder.map((d, i) => [d, i]));
  const orderedByWinRate = [...definition.dimensionOrder].sort((a, b) => {
    const diff = winRate[b] - winRate[a];
    if (Math.abs(diff) > 1e-12) return diff > 0 ? 1 : -1;
    return (declIndex.get(a) ?? 0) - (declIndex.get(b) ?? 0);
  });

  const top1 = orderedByWinRate[0];
  const top2 = orderedByWinRate[1];
  const isMixed = winRate[top1] - winRate[top2] < definition.mixedThreshold;
  // Mixed close set: every dimension within the threshold of the top, in
  // declaration order.
  const closeSet = isMixed
    ? definition.dimensionOrder.filter((d) => winRate[top1] - winRate[d] < definition.mixedThreshold)
    : [];

  return {
    ok: true,
    envelope: {
      resultVariant: "ArchetypeResult",
      methodId: definition.methodId,
      execution: "scored",
      answeredCount,
      remaining: 0,
      primaryDimension: isMixed ? null : top1,
      secondaryDimension: isMixed ? null : top2,
      isMixed,
      closeSet,
      provenance,
      confirmation: { required: true },
      internal: { wins, winRate, orderedByWinRate },
    },
  };
}
