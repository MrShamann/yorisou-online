import questionBankJson from "@/data/yorisou/120q-question-bank.generated.json";
import scoringMasterJson from "@/data/yorisou/120q-scoring-master.generated.json";
import { aggregateInternal120QSelections } from "@/lib/yorisou/scoring/aggregator";
import { mapUserAnswersToOptionScores } from "@/lib/yorisou/scoring/mapper";
import type {
  ConfidenceBand,
  DimensionCode,
  OptionId,
  OptionScore,
  Question,
  QuestionId,
  ReviewRouting,
  SafetyRoutingSummary,
  ScoringInput,
  SensitivityHandling,
  SignalStrength,
  SubdimensionCode,
  VariantType,
} from "@/lib/yorisou/scoring/types";

export type CurrentStateQuestionOption = {
  id: OptionId;
  label: string;
};

export type CurrentStateQuestion = {
  id: QuestionId;
  prompt: string;
  options: CurrentStateQuestionOption[];
  dimensionCode: DimensionCode;
  subdimensionCode: SubdimensionCode;
  variantType: VariantType;
  format: "A-E";
};

export type CurrentStateAnswerMap = Record<QuestionId, OptionId | undefined>;

type PlaceholderResult = {
  id: string;
  internalCode: "RESULT_TAXONOMY_NOT_APPROVED";
  publicName: "RESULT_TAXONOMY_NOT_APPROVED";
  recognitionLine: "RESULT_TAXONOMY_NOT_APPROVED";
  recognitionHook: "RESULT_TAXONOMY_NOT_APPROVED";
  summary: ["RESULT_TAXONOMY_NOT_APPROVED"];
  currentTendencyTitle: "RESULT_TAXONOMY_NOT_APPROVED";
  currentTendencyBody: "RESULT_TAXONOMY_NOT_APPROVED";
  dailyPatternTitle: "RESULT_TAXONOMY_NOT_APPROVED";
  dailyPattern: "RESULT_TAXONOMY_NOT_APPROVED";
  frictionTitle: "RESULT_TAXONOMY_NOT_APPROVED";
  frictionPoint: "RESULT_TAXONOMY_NOT_APPROVED";
  nextStepTitle: "RESULT_TAXONOMY_NOT_APPROVED";
  nextStep: ["RESULT_TAXONOMY_NOT_APPROVED", "RESULT_TAXONOMY_NOT_APPROVED"];
  shareLine: "RESULT_TAXONOMY_NOT_APPROVED";
  reportPreviewBridge: "RESULT_TAXONOMY_NOT_APPROVED";
  traitChips: [
    "RESULT_TAXONOMY_NOT_APPROVED",
    "INTERNAL_ONLY",
    "120Q",
  ];
  shortSummary: "RESULT_TAXONOMY_NOT_APPROVED";
};

type PlaceholderOverlay = {
  id: string;
  publicLabel: "RESULT_TAXONOMY_NOT_APPROVED";
  publicLine: "RESULT_TAXONOMY_NOT_APPROVED";
  body: "RESULT_TAXONOMY_NOT_APPROVED";
  lightNextAction: "RESULT_TAXONOMY_NOT_APPROVED";
  resultSheetLine: "RESULT_TAXONOMY_NOT_APPROVED";
  nextStepCue: "RESULT_TAXONOMY_NOT_APPROVED";
  privateLine: "RESULT_TAXONOMY_NOT_APPROVED";
};

export type CurrentStateResult = PlaceholderResult;
export type CurrentStateOverlay = PlaceholderOverlay;

export type CurrentStateStoredResultPayload = {
  payloadKey: string;
  resultId: string;
  overlayId: string;
  confidenceBand: "low" | "medium";
  answerCount: number;
  completionState: "completed";
  validationStatus: "validated";
  scoredAt: string;
  questionIds: QuestionId[];
  optionIds: OptionId[];
  groupedDimensionCounts: Record<string, number>;
  groupedSubdimensionCounts: Record<string, number>;
  primarySignalCounts: Record<string, number>;
  signalStrengthSummary: Record<SignalStrength, number>;
  confidenceBandSummary: Record<ConfidenceBand, number>;
  sensitivitySummary: Record<SensitivityHandling, number>;
  reviewRoutingSummary: Record<ReviewRouting, number>;
  safetyRoutingSummary: SafetyRoutingSummary;
  containmentWarnings: string[];
  rawScoringDataStored: false;
  resultTaxonomyStatus: "RESULT_TAXONOMY_NOT_APPROVED";
};

type CurrentStateScoredResult = {
  resultId: string;
  overlayId: string;
  confidenceBand: "low" | "medium";
  confidenceCue: "RESULT_TAXONOMY_NOT_APPROVED";
  answerCount: number;
  payloadKey: string;
  scoringOutput: ReturnType<typeof aggregateInternal120QSelections>;
};

const RESULT_STORAGE_PREFIX = "yorisou.120q.result.v1:";
const LAST_RESULT_STORAGE_KEY = "yorisou.120q.lastResult.v1";

const PLACEHOLDER_RESULT: CurrentStateResult = {
  id: "RESULT_TAXONOMY_NOT_APPROVED",
  internalCode: "RESULT_TAXONOMY_NOT_APPROVED",
  publicName: "RESULT_TAXONOMY_NOT_APPROVED",
  recognitionLine: "RESULT_TAXONOMY_NOT_APPROVED",
  recognitionHook: "RESULT_TAXONOMY_NOT_APPROVED",
  summary: ["RESULT_TAXONOMY_NOT_APPROVED"],
  currentTendencyTitle: "RESULT_TAXONOMY_NOT_APPROVED",
  currentTendencyBody: "RESULT_TAXONOMY_NOT_APPROVED",
  dailyPatternTitle: "RESULT_TAXONOMY_NOT_APPROVED",
  dailyPattern: "RESULT_TAXONOMY_NOT_APPROVED",
  frictionTitle: "RESULT_TAXONOMY_NOT_APPROVED",
  frictionPoint: "RESULT_TAXONOMY_NOT_APPROVED",
  nextStepTitle: "RESULT_TAXONOMY_NOT_APPROVED",
  nextStep: ["RESULT_TAXONOMY_NOT_APPROVED", "RESULT_TAXONOMY_NOT_APPROVED"],
  shareLine: "RESULT_TAXONOMY_NOT_APPROVED",
  reportPreviewBridge: "RESULT_TAXONOMY_NOT_APPROVED",
  traitChips: [
    "RESULT_TAXONOMY_NOT_APPROVED",
    "INTERNAL_ONLY",
    "120Q",
  ],
  shortSummary: "RESULT_TAXONOMY_NOT_APPROVED",
};

const PLACEHOLDER_OVERLAY: CurrentStateOverlay = {
  id: "RESULT_TAXONOMY_NOT_APPROVED",
  publicLabel: "RESULT_TAXONOMY_NOT_APPROVED",
  publicLine: "RESULT_TAXONOMY_NOT_APPROVED",
  body: "RESULT_TAXONOMY_NOT_APPROVED",
  lightNextAction: "RESULT_TAXONOMY_NOT_APPROVED",
  resultSheetLine: "RESULT_TAXONOMY_NOT_APPROVED",
  nextStepCue: "RESULT_TAXONOMY_NOT_APPROVED",
  privateLine: "RESULT_TAXONOMY_NOT_APPROVED",
};

const questionBank = (questionBankJson as Array<{
  questionId: QuestionId;
  dimensionCode: DimensionCode;
  subdimensionCode: SubdimensionCode;
  variantType: VariantType;
  prompt: string;
  options: Array<{ id: OptionId; label: string }>;
}>).map(
  (question) =>
    ({
      questionId: question.questionId,
      dimensionCode: question.dimensionCode,
      subdimensionCode: question.subdimensionCode,
      variantType: question.variantType,
      eligibilityFor24Q: "derived_only",
      eligibilityFor72Q: "derived_only",
      eligibilityFor120Q: true,
      rotationGroup: question.subdimensionCode,
      prompt: question.prompt,
      options: question.options.map((option) => ({
        id: option.id,
        text: option.label,
      })),
      scoringIntent: "canonical_internal_runtime",
      riskFlags: [],
      reportTags: [],
      recommendationTags: [],
      whyThisQuestionWorks: "canonical_internal_runtime",
    }) satisfies Question,
);
const scoringMaster = scoringMasterJson as Array<
  Omit<OptionScore, "sourceRow">
>;

export const currentStateQuestions: CurrentStateQuestion[] = questionBank.map((question) => ({
  id: question.questionId,
  prompt: question.prompt,
  options: question.options.map((option) => ({
    id: option.id,
    label: option.text,
  })),
  dimensionCode: question.dimensionCode,
  subdimensionCode: question.subdimensionCode,
  variantType: question.variantType,
  format: "A-E",
}));

export const currentStateCheckV1 = {
  testId: "current_state_check_v120",
  testName: "今の状態チェック",
  estimatedMinutes: 12,
  requiredAnswerCount: currentStateQuestions.length,
  dimensions: [] as Array<{ id: string; displayName: string }>,
  questions: currentStateQuestions,
  results: [PLACEHOLDER_RESULT],
  fallbackResult: PLACEHOLDER_RESULT,
  overlays: [PLACEHOLDER_OVERLAY],
  scoring: {
    fallbackResultId: PLACEHOLDER_RESULT.id,
    confidenceCap: "placeholder-only",
    resultStoragePrefix: RESULT_STORAGE_PREFIX,
  },
} as const;

type QuizData = typeof currentStateCheckV1;

export const currentStateResults = currentStateCheckV1.results;
export const currentStateFallbackResult = currentStateCheckV1.fallbackResult;
export const currentStateOverlays = currentStateCheckV1.overlays;

export function getCurrentStateQuestion(questionId: string) {
  return currentStateCheckV1.questions.find((question) => question.id === questionId) ?? null;
}

export function getCurrentStateResult(resultId: string | null | undefined) {
  void resultId;
  return PLACEHOLDER_RESULT;
}

export function getCurrentStateOverlay(overlayId: string | null | undefined) {
  void overlayId;
  return PLACEHOLDER_OVERLAY;
}

const SEGMENT_LABELS = [
  "はじまり方を見ています",
  "選び方を見ています",
  "距離感を見ています",
  "戻り方を見ています",
  "気づき方を見ています",
  "見直し方を見ています",
] as const;

const MILESTONE_LABELS = [
  "最初の流れを整理しています",
  "選び方の輪郭を見ています",
  "関わり方の傾向を見ています",
  "整え方の傾向を見ています",
  "受け取り方の傾向を見ています",
  "最後の確認をしています",
] as const;

export function getCurrentStateSegmentLabel(index: number) {
  const segmentIndex = Math.max(
    0,
    Math.min(SEGMENT_LABELS.length - 1, Math.floor(index / 20)),
  );
  return SEGMENT_LABELS[segmentIndex];
}

export function getCurrentStateMilestone(index: number) {
  const blockIndex = Math.max(
    0,
    Math.min(MILESTONE_LABELS.length - 1, Math.floor(index / 20)),
  );
  return MILESTONE_LABELS[blockIndex];
}

function createPayloadKey() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `yorisou-120q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toScoringInput(answers: CurrentStateAnswerMap): ScoringInput {
  const normalizedAnswers = currentStateQuestions.map((question) => {
    const optionId = answers[question.id];
    if (!optionId) {
      throw new Error(`Missing answer for ${question.id}`);
    }

    return {
      questionId: question.id,
      optionId,
    };
  });

  return { answers: normalizedAnswers };
}

function countBy<Key extends string>(items: Key[]) {
  return items.reduce<Record<string, number>>((accumulator, item) => {
    accumulator[item] = (accumulator[item] || 0) + 1;
    return accumulator;
  }, {});
}

export function scoreCurrentStateCheck(
  answers: CurrentStateAnswerMap,
): CurrentStateScoredResult {
  const input = toScoringInput(answers);
  const selectedRows = mapUserAnswersToOptionScores(
    input,
    questionBank,
    scoringMaster as OptionScore[],
  );
  const scoringOutput = aggregateInternal120QSelections(selectedRows);

  return {
    resultId: PLACEHOLDER_RESULT.id,
    overlayId: PLACEHOLDER_OVERLAY.id,
    confidenceBand: "low",
    confidenceCue: "RESULT_TAXONOMY_NOT_APPROVED",
    answerCount: input.answers.length,
    payloadKey: createPayloadKey(),
    scoringOutput,
  };
}

export function buildCurrentStateResultPayload(
  scoredResult: CurrentStateScoredResult,
  answers: CurrentStateAnswerMap,
): CurrentStateStoredResultPayload {
  const input = toScoringInput(answers);

  return {
    payloadKey: scoredResult.payloadKey,
    resultId: scoredResult.resultId,
    overlayId: scoredResult.overlayId,
    confidenceBand: scoredResult.confidenceBand,
    answerCount: scoredResult.answerCount,
    completionState: "completed",
    validationStatus: "validated",
    scoredAt: new Date().toISOString(),
    questionIds: input.answers.map((answer) => answer.questionId),
    optionIds: input.answers.map((answer) => answer.optionId),
    groupedDimensionCounts: countBy(
      scoredResult.scoringOutput.selectedRows.map((row) => row.dimensionCode),
    ),
    groupedSubdimensionCounts: countBy(
      scoredResult.scoringOutput.selectedRows.map((row) => row.subdimensionCode),
    ),
    primarySignalCounts: countBy(
      scoredResult.scoringOutput.selectedRows.map((row) => row.primarySignal),
    ),
    signalStrengthSummary: scoredResult.scoringOutput.signalStrengthSummary,
    confidenceBandSummary: scoredResult.scoringOutput.confidenceBandSummary,
    sensitivitySummary: scoredResult.scoringOutput.sensitivitySummary,
    reviewRoutingSummary: scoredResult.scoringOutput.reviewRoutingSummary,
    safetyRoutingSummary: scoredResult.scoringOutput.safetyRoutingSummary,
    containmentWarnings: scoredResult.scoringOutput.internalWarnings,
    rawScoringDataStored: false,
    resultTaxonomyStatus: "RESULT_TAXONOMY_NOT_APPROVED",
  };
}

export function saveCurrentStateResult(payload: CurrentStateStoredResultPayload) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    `${RESULT_STORAGE_PREFIX}${payload.payloadKey}`,
    JSON.stringify(payload),
  );
  window.localStorage.setItem(LAST_RESULT_STORAGE_KEY, payload.payloadKey);
}

export function readCurrentStateResult(payloadKey?: string | null) {
  if (typeof window === "undefined") {
    return null;
  }

  const resolvedKey =
    payloadKey || window.localStorage.getItem(LAST_RESULT_STORAGE_KEY) || "";
  if (!resolvedKey) {
    return null;
  }

  const raw = window.localStorage.getItem(`${RESULT_STORAGE_PREFIX}${resolvedKey}`);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CurrentStateStoredResultPayload;
  } catch {
    return null;
  }
}

export type CurrentStateCheckModel = QuizData;
