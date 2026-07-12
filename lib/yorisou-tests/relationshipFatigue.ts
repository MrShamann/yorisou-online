import {
  MODULE_VERSION,
  RF_QUESTIONS,
  computeRFResult,
  type AnswerMap,
  type ArchetypeId,
  type Dimension,
  type RFResult,
} from "@/app/tests/relationship-fatigue/data";
import type { RankedDimension, RuleBasedResolvedResult } from "./types";

export const RF_TEST_ID = "RELATIONSHIP-FATIGUE";
export const RF_TEST_VERSION = "v0.1";
export const RF_SCORING_VERSION = MODULE_VERSION;

export const RF_DIMENSION_LABELS: Record<Dimension, string> = {
  D1_CURRENT_ENERGY: "今のエネルギー",
  D2_EMOTIONAL_CLARITY: "気持ちの整理",
  D3_RELATIONSHIP_DISTANCE: "人との距離",
  D4_DECISION_POSTURE: "返事と決めごと",
  D5_RECOVERY_STYLE: "回復のかたち",
  D6_NEXT_STEP_READINESS: "次の一歩の準備",
};

export const RF_STATE_TAGS: Record<ArchetypeId, string> = {
  RF_REPLY_LOAD: "返信の負担",
  RF_BOUNDARY_RESET: "距離を整えたい",
  RF_SOCIAL_ENERGY_DRAIN: "気づかいの疲れ",
  RF_AIR_READING_COMPARISON: "比較で疲れやすい",
  RF_SMALL_CIRCLE_RECOVERY: "少人数で回復したい",
  RF_SMALL_ADJUSTMENT_READY: "小さく整えたい",
  RF_MIXED_OVERLAP: "負担が重なっている",
};

export type RFAnswerValidation =
  | { ok: true; answers: AnswerMap }
  | { ok: false; code: "invalid_answers" | "incomplete_answers"; message: string };

export function validateRelationshipFatigueAnswers(input: unknown): RFAnswerValidation {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, code: "invalid_answers", message: "回答形式を確認できませんでした。" };
  }
  const answers = input as Record<string, unknown>;
  const questionIds = new Set(RF_QUESTIONS.map((question) => question.id));
  if (Object.keys(answers).length !== questionIds.size) {
    return { ok: false, code: "incomplete_answers", message: "すべての質問への回答が必要です。" };
  }
  const normalized: AnswerMap = {};
  for (const question of RF_QUESTIONS) {
    const answer = answers[question.id];
    if (typeof answer !== "string" || !question.options.some((option) => option.id === answer)) {
      return { ok: false, code: "invalid_answers", message: "回答内容を確認できませんでした。" };
    }
    normalized[question.id] = answer;
  }
  if (Object.keys(answers).some((id) => !questionIds.has(id))) {
    return { ok: false, code: "invalid_answers", message: "回答内容を確認できませんでした。" };
  }
  return { ok: true, answers: normalized };
}

export function resolveRelationshipFatigueSavedResult(answers: AnswerMap): {
  rf: RFResult;
  saved: RuleBasedResolvedResult;
} {
  const rf = computeRFResult(answers);
  const ranked: RankedDimension[] = (Object.entries(rf.scores) as [Dimension, number][])
    .map(([key, score]) => ({ key, score, label: RF_DIMENSION_LABELS[key] }))
    .sort((a, b) => b.score - a.score);
  return {
    rf,
    saved: {
      resultId: rf.archetypeId,
      title: rf.archetype.name,
      summary: rf.archetype.body,
      score: ranked[0]?.score ?? 0,
      topDimensions: ranked.slice(0, 3),
      lowDimension: ranked[ranked.length - 1] ?? null,
    },
  };
}

export function relationshipFatigueStateTag(archetypeId: ArchetypeId): string {
  return RF_STATE_TAGS[archetypeId] || "今の状態";
}
