import { CANONICAL_PERSONA_IDS, getCanonicalPersona } from "@/lib/yorisou/dte/personas";
import { normalizeCanonicalAnswerOptionId } from "@/lib/yorisou/dte/answer-options";
import type { CanonicalQuestionObject } from "@/lib/dteQuestionRuntime";

export type CurrentModeKey = "steady" | "guarded" | "active";

export type CurrentModeVariant = {
  key: CurrentModeKey;
  labelJa: string;
  labelEn: string;
};

export type DteResultComputation = {
  personaId: string;
  neighboringPersonaIds: string[];
  currentMode: CurrentModeVariant;
  driftRisk: boolean;
  dimensionScores: Record<string, number>;
  personaScoreboard: Array<{ personaId: string; score: number }>;
};

const CHOICE_VALUE: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, E: 5 };
const SHORT_CYCLE_MS = 48 * 60 * 60 * 1000;

export const CURRENT_MODE_VARIANTS: Record<CurrentModeKey, CurrentModeVariant> = {
  guarded: { key: "guarded", labelJa: "整え寄り", labelEn: "Guarded" },
  steady: { key: "steady", labelJa: "ふだん寄り", labelEn: "Steady" },
  active: { key: "active", labelJa: "動き寄り", labelEn: "Active" },
};

function getPersonaIndex(personaId: string) {
  return CANONICAL_PERSONA_IDS.indexOf(personaId);
}

function personaDistance(leftPersonaId: string, rightPersonaId: string) {
  const left = getPersonaIndex(leftPersonaId);
  const right = getPersonaIndex(rightPersonaId);
  if (left < 0 || right < 0 || CANONICAL_PERSONA_IDS.length === 0) {
    return Number.POSITIVE_INFINITY;
  }
  const raw = Math.abs(left - right);
  return Math.min(raw, CANONICAL_PERSONA_IDS.length - raw);
}

function isShortCycle(previousCompletedAt?: string | null) {
  if (!previousCompletedAt) {
    return false;
  }
  const timestamp = new Date(previousCompletedAt).getTime();
  return Number.isFinite(timestamp) && Math.max(0, Date.now() - timestamp) <= SHORT_CYCLE_MS;
}

function buildDimensionScores(answers: Record<string, string | undefined>, questionLookup: Map<string, CanonicalQuestionObject>) {
  const dimensionBuckets = new Map<string, { total: number; count: number }>();

  for (const [questionId, rawAnswer] of Object.entries(answers)) {
    const question = questionLookup.get(questionId);
    if (!question) {
      continue;
    }
    const choice = normalizeCanonicalAnswerOptionId(rawAnswer);
    const rawValue = CHOICE_VALUE[choice] || 3;
    const signal = Math.abs(rawValue - 3) + 1;
    const weight = question.question_number && question.question_number <= 21 ? 1.1 : 0.95;
    const bucket = dimensionBuckets.get(question.dimension_id) || { total: 0, count: 0 };
    bucket.total += signal * weight;
    bucket.count += 1;
    dimensionBuckets.set(question.dimension_id, bucket);
  }

  return Object.fromEntries(
    [...dimensionBuckets.entries()].map(([dimensionId, bucket]) => [dimensionId, Number((bucket.total / Math.max(1, bucket.count)).toFixed(3))]),
  );
}

function deriveCurrentMode(answers: Record<string, string | undefined>): CurrentModeVariant {
  const numericAnswers = Object.values(answers)
    .map((value) => CHOICE_VALUE[normalizeCanonicalAnswerOptionId(value)] || 3)
    .filter((value) => Number.isFinite(value));
  const average = numericAnswers.length ? numericAnswers.reduce((sum, value) => sum + value, 0) / numericAnswers.length : 3;
  if (average <= 2.4) {
    return CURRENT_MODE_VARIANTS.guarded;
  }
  if (average >= 3.7) {
    return CURRENT_MODE_VARIANTS.active;
  }
  return CURRENT_MODE_VARIANTS.steady;
}

function scorePersona(personaId: string, dimensionScores: Record<string, number>) {
  const persona = getCanonicalPersona(personaId);
  if (!persona) {
    return 0;
  }
  const coreScore = persona.coreDefiningDimensions.reduce((sum, dimensionId) => sum + (dimensionScores[dimensionId] || 0) * 2.25, 0);
  const secondaryScore = persona.secondaryDimensions.reduce((sum, dimensionId) => sum + (dimensionScores[dimensionId] || 0) * 1.1, 0);
  return Number((coreScore + secondaryScore).toFixed(3));
}

export function deriveDteResultComputation(
  answers: Record<string, string | undefined>,
  questionLookup: Map<string, CanonicalQuestionObject>,
  input?: {
    previousPersonaId?: string | null;
    previousCompletedAt?: string | null;
  },
): DteResultComputation {
  const dimensionScores = buildDimensionScores(answers, questionLookup);
  const personaScoreboard = CANONICAL_PERSONA_IDS.map((personaId) => ({
    personaId,
    score: scorePersona(personaId, dimensionScores),
  })).sort((left, right) => right.score - left.score);

  let primaryPersonaId = personaScoreboard[0]?.personaId || "P01";
  const previousPersonaId = input?.previousPersonaId || null;
  const previousPersona = previousPersonaId ? getCanonicalPersona(previousPersonaId) : null;
  const previousScore = previousPersonaId ? personaScoreboard.find((entry) => entry.personaId === previousPersonaId)?.score || 0 : 0;
  const leadingScore = personaScoreboard[0]?.score || 0;
  const longDistanceJump = previousPersonaId ? personaDistance(previousPersonaId, primaryPersonaId) >= 4 : false;
  const withinStabilityWindow = isShortCycle(input?.previousCompletedAt);

  if (previousPersonaId && previousPersona && withinStabilityWindow) {
    const previousIsNeighbor =
      previousPersona.closestNeighborPersonas.includes(primaryPersonaId) || getCanonicalPersona(primaryPersonaId)?.closestNeighborPersonas.includes(previousPersonaId) || false;
    const scoreMargin = leadingScore - previousScore;
    if ((previousIsNeighbor && scoreMargin < 0.55) || (longDistanceJump && scoreMargin < 1.25)) {
      primaryPersonaId = previousPersonaId;
    }
  }

  const primaryPersona = getCanonicalPersona(primaryPersonaId);
  const neighboringPersonaIds = [
    ...(primaryPersona?.closestNeighborPersonas || []),
    ...personaScoreboard.map((entry) => entry.personaId).filter((personaId) => personaId !== primaryPersonaId),
  ].filter((personaId, index, collection) => collection.indexOf(personaId) === index && personaId !== primaryPersonaId).slice(0, 3);

  return {
    personaId: primaryPersonaId,
    neighboringPersonaIds,
    currentMode: deriveCurrentMode(answers),
    driftRisk: Boolean(previousPersonaId && primaryPersonaId !== previousPersonaId && longDistanceJump),
    dimensionScores,
    personaScoreboard: personaScoreboard.slice(0, 8),
  };
}

