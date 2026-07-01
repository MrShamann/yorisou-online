import type {
  FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL,
  OptionScore,
  SafetyRoutingSummary,
  SubdimensionCode,
} from "@/lib/yorisou/scoring/types";

export const PUBLIC_RESULT_MAPPING_VERSION = "imairo-public-assignment-v0.1" as const;
export const PUBLIC_RESULT_CURRENT_STATE_NOTE = "120Qから見た、今の動き方" as const;
export const PUBLIC_RESULT_PLACEHOLDER_CODE = "IMA-IRO-PLACEHOLDER" as const;

export type PublicResultAssignment = {
  publicCode: string;
  nickname: string;
  clanEnglish: string;
  clanJapanese: string;
  secondaryBadge: string;
  currentStateNote: typeof PUBLIC_RESULT_CURRENT_STATE_NOTE;
  mappingVersion: typeof PUBLIC_RESULT_MAPPING_VERSION;
};

export type PublicAssignmentAggregateInput = {
  answerCount: number;
  groupedBySubdimension: Record<SubdimensionCode, OptionScore[]>;
  groupedByPrimarySignal?: Record<string, OptionScore[]>;
  safetyRoutingSummary?: SafetyRoutingSummary;
  formulaStatus?: typeof FORMULA_DRAFT_REQUIRES_EDWARD_APPROVAL;
};

export type PublicResultAssignmentStatus =
  | "assigned"
  | "placeholder";

export type PublicResultResolution = {
  assignment: PublicResultAssignment | null;
  status: PublicResultAssignmentStatus;
};

export type PublicClanCode =
  | "Mist"
  | "Ember"
  | "Willow"
  | "Tide"
  | "Cedar"
  | "Iris";

export type PublicArchetypeDefinition = PublicResultAssignment & {
  clanCode: PublicClanCode;
};
