export type QuestionId = `Q${number}${number}${number}`;

export type OptionId = "A" | "B" | "C" | "D" | "E";

export const DIMENSION_CODES = ["AR", "BD", "CL", "DR", "EL", "RP", "SD", "SO"] as const;
export type DimensionCode = (typeof DIMENSION_CODES)[number];

export const SUBDIMENSION_CODES = [
  "AR_CONTINUATION",
  "AR_RESTART",
  "AR_STARTABILITY",
  "BD_HOLDING_RESPONSE",
  "BD_ROLE_DISTANCE",
  "BD_TAKING_ON_TOO_MUCH",
  "CL_CRITERIA",
  "CL_EXPLANATION_PRESSURE",
  "CL_OPTION_LOAD",
  "DR_ROUTINE_ANCHOR",
  "DR_STARTING_POINT",
  "DR_TRANSITION",
  "EL_AFTER_EFFECT",
  "EL_INNER_WEIGHT",
  "EL_TENSION",
  "RP_RECOVERY_NEED",
  "RP_RESET_METHOD",
  "RP_RESTORATION_TRIGGER",
  "SD_ATMOSPHERE_READING",
  "SD_REPLY_PRESSURE",
  "SD_RETURNABLE_DISTANCE",
  "SO_FEEDBACK_OPENNESS",
  "SO_NAMING_PATTERN",
  "SO_NOTICING_STATE",
] as const;
export type SubdimensionCode = (typeof SUBDIMENSION_CODES)[number];

export const VARIANT_TYPES = [
  "core_behavior",
  "recovery_adjustment",
  "reflection_revisit",
  "scenario_pressure",
  "social_contextual",
] as const;
export type VariantType = (typeof VARIANT_TYPES)[number];

export const CONFIDENCE_BANDS = ["L", "M", "H"] as const;
export type ConfidenceBand = (typeof CONFIDENCE_BANDS)[number];

export const SENSITIVITY_HANDLING_VALUES = [
  "public_safe",
  "private_low",
  "private_medium",
  "private_high",
] as const;
export type SensitivityHandling = (typeof SENSITIVITY_HANDLING_VALUES)[number];

export const REVIEW_ROUTING_VALUES = [
  "none",
  "needs_review",
  "needs_human_review_sensitive",
] as const;
export type ReviewRouting = (typeof REVIEW_ROUTING_VALUES)[number];

export const CROSS_FAMILY_HANDLING_VALUES = [
  "native_source_contribution",
  "modifier_only",
  "source_bounded_cross_family_primary",
] as const;
export type CrossFamilyHandling = (typeof CROSS_FAMILY_HANDLING_VALUES)[number];

export const SIGNAL_STRENGTH_VALUES = [0, 1, 2, 3] as const;
export type SignalStrength = (typeof SIGNAL_STRENGTH_VALUES)[number];

export const FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL =
  "FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL" as const;

export type Option = {
  id: OptionId;
  text: string;
};

export type BoundaryMetadata = {
  answerData?: string;
  resultUse?: string;
  shareUse?: string;
  questionSurface?: string;
};

export type Question = {
  questionId: QuestionId;
  dimensionCode: DimensionCode;
  subdimensionCode: SubdimensionCode;
  variantType: VariantType;
  eligibilityFor24Q: string;
  eligibilityFor72Q: string;
  eligibilityFor120Q: boolean;
  rotationGroup: string;
  prompt: string;
  options: Option[];
  scoringIntent: string;
  riskFlags: string[];
  reportTags: string[];
  recommendationTags: string[];
  publicPrivateBoundary?: string;
  boundaryMetadata?: BoundaryMetadata;
  whyThisQuestionWorks: string;
};

export type CanonicalScoringRowRaw = {
  questionId: QuestionId;
  optionId: OptionId;
  dimensionCode: DimensionCode;
  subdimensionCode: SubdimensionCode;
  variantType: VariantType;
  primarySignal: string;
  secondarySignals: string;
  primaryAxisContribution: string;
  secondaryAxisModifiers: string;
  signalStrength: string;
  confidenceBand: ConfidenceBand;
  sensitivityHandling: SensitivityHandling;
  reviewRouting: ReviewRouting;
  crossFamilyHandling: CrossFamilyHandling;
  safetyNotes: string;
  correctionNotes: string;
};

export type OptionScore = {
  questionId: QuestionId;
  optionId: OptionId;
  dimensionCode: DimensionCode;
  subdimensionCode: SubdimensionCode;
  variantType: VariantType;
  primarySignal: string;
  secondarySignals: string[];
  primaryAxisContribution: string;
  secondaryAxisModifiers: string;
  signalStrength: SignalStrength;
  confidenceBand: ConfidenceBand;
  sensitivityHandling: SensitivityHandling;
  reviewRouting: ReviewRouting;
  crossFamilyHandling: CrossFamilyHandling;
  safetyNotes: string[];
  correctionNotes: string;
  sourceRow: CanonicalScoringRowRaw;
};

export type UserAnswer = {
  questionId: QuestionId;
  optionId: OptionId;
};

export type ScoringInput = {
  answers: UserAnswer[];
};

export type SafetyRoutingSummary = {
  sensitivityCounts: Record<SensitivityHandling, number>;
  reviewRoutingCounts: Record<ReviewRouting, number>;
  highSensitivityRows: OptionScore[];
  warnings: string[];
};

export type ScoringOutput = {
  selectedRows: OptionScore[];
  groupedByDimension: Record<DimensionCode, OptionScore[]>;
  groupedBySubdimension: Record<SubdimensionCode, OptionScore[]>;
  groupedByPrimarySignal: Record<string, OptionScore[]>;
  signalStrengthSummary: Record<SignalStrength, number>;
  confidenceBandSummary: Record<ConfidenceBand, number>;
  sensitivitySummary: Record<SensitivityHandling, number>;
  reviewRoutingSummary: Record<ReviewRouting, number>;
  safetyRoutingSummary: SafetyRoutingSummary;
  internalWarnings: string[];
  formulaStatus: typeof FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL;
};

export type QuestionBankValidationReport = {
  questionCount: number;
  uniqueQuestionCount: number;
  questionIds: QuestionId[];
};

export type ScoringMasterValidationReport = {
  rowCount: number;
  questionCount: number;
  duplicateKeys: string[];
};
