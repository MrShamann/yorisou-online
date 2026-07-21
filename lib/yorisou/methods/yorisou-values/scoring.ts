// YV-1 — canonical result assembly for yorisou-values. Maps a scored runtime
// envelope to the canonical public/private result content. Internal win rates
// are NEVER included in the returned public/private payloads.

import { executeScored, type ScoredAnswers, type ScoredResultEnvelope } from "@/lib/yorisou/method-runtime/scored";
import { YORISOU_VALUES_RUNTIME_DEFINITION } from "./runtimeDefinition";
import { YORISOU_VALUES_BANK_HASH, YORISOU_VALUES_DEFINITION, type YorisouValuesResultId } from "./definition.generated";

const DEF = YORISOU_VALUES_DEFINITION;
type ResultRecord = (typeof DEF.results)[number];
type DimensionRecord = (typeof DEF.dimensions)[number];
const RESULT_BY_DIMENSION = new Map<string, ResultRecord>(DEF.results.filter((r) => r.primaryDimension).map((r) => [r.primaryDimension as string, r]));
const RESULT_BY_ID = new Map<string, ResultRecord>(DEF.results.map((r) => [r.resultId, r]));
const DIMENSION_BY_ID = new Map<string, DimensionRecord>(DEF.dimensions.map((d) => [d.dimensionId, d]));

export type YorisouValuesAssembled =
  | { execution: "insufficient_coverage"; remaining: number; answeredCount: number; insufficientCopyJa: string }
  | {
      execution: "scored";
      resultId: YorisouValuesResultId;
      isMixed: boolean;
      public: (typeof DEF.results)[number]["public"];
      private: (typeof DEF.results)[number]["private"];
      secondarySignal: { labelJa: string; dimensionId: string; nameJa: string } | null;
      closeSet: { labelJa: string; dimensions: { dimensionId: string; nameJa: string }[] } | null;
      provenance: ScoredResultEnvelope["provenance"];
      answeredCount: number;
    };

// Assemble the canonical result. `bankHash` defaults to the pinned artifact hash;
// callers may pass a stored hash to enforce provenance at read/resume time.
export function assembleYorisouValuesResult(answers: ScoredAnswers, bankHash: string = YORISOU_VALUES_BANK_HASH):
  | { ok: true; result: YorisouValuesAssembled }
  | { ok: false; codes: string[] } {
  const execution = executeScored(YORISOU_VALUES_RUNTIME_DEFINITION, answers, bankHash);
  if (!execution.ok) return { ok: false, codes: execution.errors.map((e) => e.code) };
  const env = execution.envelope;

  if (env.execution === "insufficient_coverage") {
    return {
      ok: true,
      result: {
        execution: "insufficient_coverage",
        remaining: env.remaining,
        answeredCount: env.answeredCount,
        insufficientCopyJa: DEF.scoring.insufficientCoverageCopyJa.replace("{remaining}", String(env.remaining)),
      },
    };
  }

  if (env.isMixed) {
    const mixed = RESULT_BY_ID.get("VAL_R_MIXED")!;
    return {
      ok: true,
      result: {
        execution: "scored",
        resultId: "VAL_R_MIXED",
        isMixed: true,
        public: mixed.public,
        private: mixed.private,
        secondarySignal: null,
        closeSet: {
          labelJa: DEF.secondarySignal.mixedCloseSetLabelJa,
          dimensions: env.closeSet.map((d) => ({ dimensionId: d, nameJa: DIMENSION_BY_ID.get(d)!.nameJa })),
        },
        provenance: env.provenance,
        answeredCount: env.answeredCount,
      },
    };
  }

  const primary = env.primaryDimension as string;
  const result = RESULT_BY_DIMENSION.get(primary)!;
  const secondary = env.secondaryDimension as string;
  return {
    ok: true,
    result: {
      execution: "scored",
      resultId: result.resultId,
      isMixed: false,
      public: result.public,
      private: result.private,
      secondarySignal: { labelJa: DEF.secondarySignal.labelJa, dimensionId: secondary, nameJa: DIMENSION_BY_ID.get(secondary)!.nameJa },
      closeSet: null,
      provenance: env.provenance,
      answeredCount: env.answeredCount,
    },
  };
}
