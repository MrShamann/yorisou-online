export type T6DimensionCode =
  | "pace_orientation"
  | "load_sensitivity"
  | "clarity_stability"
  | "direction_grip"
  | "structure_need"
  | "autonomy_preference"
  | "processing_style"
  | "expression_style"
  | "distance_preference"
  | "reassurance_style"
  | "reset_mode"
  | "support_preference";

export type T6QuestionFormat = "5-point" | "AB";

export type T6QuestionSection =
  | "State Load"
  | "Clarity and Direction"
  | "Structure and Autonomy"
  | "Processing and Expression"
  | "Distance and Reassurance"
  | "Reset and Support";

export type T6AnswerValue = "1" | "2" | "3" | "4" | "5" | "A" | "B";

export type T6AnswerMap = Record<string, T6AnswerValue | undefined>;

export type T6QuestionOption = {
  id: T6AnswerValue;
  label: string;
  helper?: string;
};

export type T6Question = {
  id: string;
  section: T6QuestionSection;
  prompt: string;
  format: T6QuestionFormat;
  options: T6QuestionOption[];
  primaryDimension: T6DimensionCode;
  secondaryDimension: T6DimensionCode;
  direction: string;
  reverse: boolean;
  sensitivity: "low" | "medium" | "medium-low";
};

export type T6DimensionScore = {
  raw: number;
  normalized: number;
  minRaw: number;
  maxRaw: number;
  answeredCount: number;
};

export type T6ResultId =
  | "steady_arranger"
  | "quiet_integrator"
  | "gentle_navigator"
  | "responsive_adjuster"
  | "deliberate_boundary_keeper"
  | "rebuilding_mover"
  | "mixed_state_reader";

export type T6OverlayId = "gathering" | "strained" | "balancing" | "reopening";

export type T6ConfidenceBand = "low" | "medium";

export type T6ResultModel = {
  id: T6ResultId;
  internalCode: string;
  publicName: string;
  recognitionLine: string;
  recognitionHook: string;
  summary: string[];
  currentTendencyTitle?: string;
  currentTendencyBody?: string;
  dailyPatternTitle?: string;
  dailyPattern?: string;
  frictionTitle?: string;
  frictionPoint?: string;
  nextStepTitle?: string;
  nextStep: string[];
  shareLine: string;
  reportPreviewBridge?: string;
  traitChips: [string, string, string];
  shortSummary: string;
};

export type T6OverlayModel = {
  id: T6OverlayId;
  publicLabel: string;
  publicLine: string;
  body?: string;
  lightNextAction?: string;
  resultSheetLine: string;
  nextStepCue: string;
  privateLine: string;
};

export type T6ScoredResult = {
  resultId: T6ResultId;
  overlayId: T6OverlayId;
  confidenceBand: T6ConfidenceBand;
  confidenceCue: string;
  dimensionScores: Record<T6DimensionCode, T6DimensionScore>;
  answerCount: number;
  missingCount: number;
  resultScore: number;
  runnerUpScore: number;
  payloadKey: string;
};

export type T6StoredResultPayload = T6ScoredResult & {
  answers: T6AnswerMap;
  result: T6ResultModel;
  overlay: T6OverlayModel;
  scoredAt: string;
  dimensionRankings: Array<{ code: T6DimensionCode; score: number }>;
  clusterScores: Record<string, number>;
};
