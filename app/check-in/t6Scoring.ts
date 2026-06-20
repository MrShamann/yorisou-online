import {
  T6_BASE_RESULTS,
  T6_FALLBACK_RESULT,
  T6_OVERLAYS,
  T6_OVERLAY_BY_ID,
  T6_RESULT_BY_ID,
} from "./t6ResultModel";
import type {
  T6AnswerMap,
  T6ConfidenceBand,
  T6DimensionCode,
  T6DimensionScore,
  T6OverlayId,
  T6Question,
  T6ScoredResult,
  T6StoredResultPayload,
} from "./t6Types";
import { T6_CURRENT_STATE_QUESTION_BANK } from "./t6QuestionBank";

export const T6_RESULT_STORAGE_PREFIX = "yorisou.t6.result.v1:";
export const T6_RESULT_LOOKUP_EVENT = "yorisou:t6-result-updated";
export const T6_CURRENT_STATE_RESULT_STORAGE_KEY = "yorisou.t6.lastResult.v1";

type ClusterProfile = {
  positive: Array<[T6DimensionCode, number]>;
  negative: Array<[T6DimensionCode, number]>;
  bias?: number;
};

const FIVE_POINT_FORWARD = new Set(["1", "2", "3", "4", "5"]);
const AB_VALUES = new Set(["A", "B", "3"]);

const CLUSTER_PROFILES: Record<string, ClusterProfile> = {
  steady_arranger: {
    positive: [
      ["structure_need", 1.25],
      ["direction_grip", 1.05],
      ["clarity_stability", 1.0],
    ],
    negative: [
      ["pace_orientation", 0.42],
      ["expression_style", 0.24],
    ],
  },
  quiet_integrator: {
    positive: [
      ["processing_style", 1.25],
      ["autonomy_preference", 1.02],
      ["clarity_stability", 0.98],
    ],
    negative: [
      ["expression_style", 0.24],
      ["reassurance_style", 0.2],
    ],
  },
  gentle_navigator: {
    positive: [
      ["reassurance_style", 1.08],
      ["distance_preference", 0.92],
      ["direction_grip", 0.66],
      ["expression_style", 0.34],
    ],
    negative: [
      ["pace_orientation", 0.32],
      ["support_preference", 0.2],
    ],
  },
  responsive_adjuster: {
    positive: [
      ["pace_orientation", 1.1],
      ["expression_style", 0.98],
      ["load_sensitivity", 0.88],
    ],
    negative: [
      ["structure_need", 0.42],
      ["direction_grip", 0.26],
    ],
  },
  deliberate_boundary_keeper: {
    positive: [
      ["distance_preference", 1.2],
      ["autonomy_preference", 1.0],
      ["processing_style", 0.8],
    ],
    negative: [
      ["reassurance_style", 0.3],
      ["expression_style", 0.24],
    ],
  },
  rebuilding_mover: {
    positive: [
      ["reset_mode", 1.2],
      ["load_sensitivity", 0.94],
      ["support_preference", 0.82],
    ],
    negative: [
      ["pace_orientation", 0.36],
      ["direction_grip", 0.28],
    ],
  },
};

const OVERLAY_PROFILES: Record<T6OverlayId, Array<[T6DimensionCode, number]>> = {
  gathering: [
    ["pace_orientation", -0.42],
    ["processing_style", 0.5],
    ["structure_need", 0.24],
    ["clarity_stability", 0.22],
    ["load_sensitivity", -0.1],
  ],
  strained: [
    ["load_sensitivity", 0.42],
    ["clarity_stability", -0.34],
    ["reset_mode", -0.24],
    ["direction_grip", -0.16],
  ],
  balancing: [
    ["pace_orientation", 0.12],
    ["load_sensitivity", 0.18],
    ["structure_need", -0.16],
    ["autonomy_preference", -0.16],
    ["clarity_stability", 0.16],
    ["direction_grip", 0.16],
  ],
  reopening: [
    ["direction_grip", 0.34],
    ["reset_mode", 0.34],
    ["pace_orientation", 0.12],
    ["support_preference", 0.16],
  ],
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function scoreFromAnswer(question: T6Question, answer: string | undefined): number | null {
  if (!answer) {
    return null;
  }

  if (question.format === "5-point") {
    return FIVE_POINT_FORWARD.has(answer) ? Number(answer) : null;
  }

  if (!AB_VALUES.has(answer)) {
    return null;
  }

  if (answer === "3") {
    return 3;
  }

  const selected = answer === "A" ? 1 : 5;
  return question.reverse ? 6 - selected : selected;
}

function createEmptyDimensionScore(): T6DimensionScore {
  return {
    raw: 0,
    normalized: 50,
    minRaw: 0,
    maxRaw: 0,
    answeredCount: 0,
  };
}

function updateDimensionScore(
  score: T6DimensionScore,
  value: number,
  weight: number,
) {
  score.raw += value * weight;
  score.minRaw += 1 * weight;
  score.maxRaw += 5 * weight;
  score.answeredCount += 1;
}

function normalizeDimensionScore(score: T6DimensionScore) {
  const span = score.maxRaw - score.minRaw;
  if (span <= 0) {
    score.normalized = 50;
    return score;
  }

  score.normalized = Math.round(clamp(((score.raw - score.minRaw) / span) * 100, 0, 100));
  return score;
}

function averageDimensionValue(scores: Record<T6DimensionCode, T6DimensionScore>, code: T6DimensionCode) {
  const score = scores[code];
  if (!score || score.answeredCount === 0) {
    return 3;
  }

  const span = score.maxRaw - score.minRaw;
  if (span <= 0) {
    return 3;
  }

  const rawRatio = (score.raw - score.minRaw) / span;
  return clamp(1 + rawRatio * 4, 1, 5);
}

function getQuestionContributionWeights(question: T6Question) {
  return [
    [question.primaryDimension, 1] as const,
    [question.secondaryDimension, 0.3] as const,
  ];
}

function scoreCluster(clusterId: string, dimensions: Record<T6DimensionCode, T6DimensionScore>) {
  const profile = CLUSTER_PROFILES[clusterId];
  let score = profile.bias ?? 0;

  for (const [dimension, weight] of profile.positive) {
    score += dimensions[dimension].normalized * weight;
  }

  for (const [dimension, weight] of profile.negative) {
    score -= dimensions[dimension].normalized * weight;
  }

  return Math.round(score);
}

function scoreOverlay(overlayId: T6OverlayId, dimensions: Record<T6DimensionCode, T6DimensionScore>) {
  const profile = OVERLAY_PROFILES[overlayId];
  let score = 0;

  for (const [dimension, weight] of profile) {
    score += dimensions[dimension].normalized * weight;
  }

  return Math.round(score);
}

function computeConfidenceBand(
  resultScore: number,
  runnerUpScore: number,
  missingCount: number,
): T6ConfidenceBand {
  const margin = resultScore - runnerUpScore;
  if (missingCount >= 5) {
    return "low";
  }

  if (margin >= 18 && missingCount <= 2) {
    return "medium";
  }

  if (margin >= 11 && missingCount <= 4) {
    return "medium";
  }

  return "low";
}

export function scoreCurrentStateCheck(answers: T6AnswerMap): T6ScoredResult {
  const dimensionScores: Record<T6DimensionCode, T6DimensionScore> = {
    pace_orientation: createEmptyDimensionScore(),
    load_sensitivity: createEmptyDimensionScore(),
    clarity_stability: createEmptyDimensionScore(),
    direction_grip: createEmptyDimensionScore(),
    structure_need: createEmptyDimensionScore(),
    autonomy_preference: createEmptyDimensionScore(),
    processing_style: createEmptyDimensionScore(),
    expression_style: createEmptyDimensionScore(),
    distance_preference: createEmptyDimensionScore(),
    reassurance_style: createEmptyDimensionScore(),
    reset_mode: createEmptyDimensionScore(),
    support_preference: createEmptyDimensionScore(),
  };

  const parsedAnswers: Array<{ question: T6Question; value: number }> = [];

  for (const question of T6_CURRENT_STATE_QUESTION_BANK) {
    const value = scoreFromAnswer(question, answers[question.id]);
    if (value === null) {
      continue;
    }

    parsedAnswers.push({ question, value });
    for (const [dimension, weight] of getQuestionContributionWeights(question)) {
      updateDimensionScore(dimensionScores[dimension], value, weight);
    }
  }

  const missingQuestions = T6_CURRENT_STATE_QUESTION_BANK.filter((question) => !answers[question.id]);
  const missingCount = missingQuestions.length;

  if (missingCount > 0 && missingCount <= 4) {
    for (const question of missingQuestions) {
      const estimatedValue = Math.round(
        clamp(
          (averageDimensionValue(dimensionScores, question.primaryDimension) +
            averageDimensionValue(dimensionScores, question.secondaryDimension)) /
            2,
          1,
          5,
        ),
      );

      for (const [dimension, weight] of getQuestionContributionWeights(question)) {
        updateDimensionScore(dimensionScores[dimension], estimatedValue, weight);
      }
    }
  }

  for (const score of Object.values(dimensionScores)) {
    normalizeDimensionScore(score);
  }

  const clusterScores = Object.fromEntries(
    T6_BASE_RESULTS.map((result) => [result.id, scoreCluster(result.id, dimensionScores)]),
  );

  const ranked = Object.entries(clusterScores).sort((a, b) => b[1] - a[1]);
  const topClusterId = (ranked[0]?.[0] as keyof typeof clusterScores | undefined) ?? "mixed_state_reader";
  const runnerUpScore = ranked[1]?.[1] ?? ranked[0]?.[1] ?? 0;
  const resultScore = ranked[0]?.[1] ?? 0;
  const shouldFallback = missingCount > 4 || resultScore - runnerUpScore < 8;
  const selectedResult = shouldFallback
    ? T6_FALLBACK_RESULT
    : T6_RESULT_BY_ID.get(String(topClusterId)) ?? T6_FALLBACK_RESULT;

  const overlayRankings = T6_OVERLAYS.map((overlay) => ({
    id: overlay.id,
    score: scoreOverlay(overlay.id, dimensionScores),
  })).sort((a, b) => b.score - a.score);

  const selectedOverlay = shouldFallback
    ? T6_OVERLAY_BY_ID.get("balancing") ?? T6_OVERLAY_BY_ID.get(overlayRankings[0]?.id ?? "balancing")!
    : T6_OVERLAY_BY_ID.get(overlayRankings[0]?.id ?? "balancing") ?? T6_OVERLAY_BY_ID.get("balancing")!;
  const confidenceBand = computeConfidenceBand(resultScore, runnerUpScore, missingCount);
  const payloadKey =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `t6-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    resultId: selectedResult.id,
    overlayId: selectedOverlay.id,
    confidenceBand,
    confidenceCue: "今見えている範囲の傾向です",
    dimensionScores,
    answerCount: parsedAnswers.length,
    missingCount,
    resultScore,
    runnerUpScore,
    payloadKey,
  };
}

export function buildStoredResultPayload(
  scoredResult: T6ScoredResult,
  answers: T6AnswerMap,
): T6StoredResultPayload {
  const result = T6_RESULT_BY_ID.get(scoredResult.resultId) ?? T6_FALLBACK_RESULT;
  const overlay = T6_OVERLAY_BY_ID.get(scoredResult.overlayId) ?? T6_OVERLAY_BY_ID.get("balancing")!;
  const dimensionRankings = Object.entries(scoredResult.dimensionScores)
    .map(([code, score]) => ({ code: code as T6DimensionCode, score: score.normalized }))
    .sort((a, b) => b.score - a.score);

  return {
    ...scoredResult,
    answers,
    result,
    overlay,
    scoredAt: new Date().toISOString(),
    dimensionRankings,
    clusterScores: Object.fromEntries(
      T6_BASE_RESULTS.map((candidate) => [
        candidate.id,
        scoreCluster(candidate.id, scoredResult.dimensionScores),
      ]),
    ),
  };
}

export function saveCurrentStateResultPayload(payload: T6StoredResultPayload) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(T6_RESULT_STORAGE_PREFIX + payload.payloadKey, JSON.stringify(payload));
  window.localStorage.setItem(T6_CURRENT_STATE_RESULT_STORAGE_KEY, payload.payloadKey);
  window.dispatchEvent(new Event(T6_RESULT_LOOKUP_EVENT));
}

export function readCurrentStateResultPayload(payloadKey?: string | null) {
  if (typeof window === "undefined") {
    return null;
  }

  const key = payloadKey || window.localStorage.getItem(T6_CURRENT_STATE_RESULT_STORAGE_KEY);
  if (!key) {
    return null;
  }

  const rawValue = window.localStorage.getItem(T6_RESULT_STORAGE_PREFIX + key);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T6StoredResultPayload;
  } catch {
    return null;
  }
}
