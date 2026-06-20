import { createHash } from "node:crypto";

export const ORACLE_LINE_VERSION = "v1-2026-04-26" as const;

export type OracleLineStatus =
  | "draft"
  | "candidate"
  | "screened"
  | "approved_internal"
  | "approved_public"
  | "live"
  | "cooldown"
  | "retired"
  | "rejected";

export type OracleLineApprovalState =
  | "draft"
  | "review"
  | "approved_internal"
  | "approved_public"
  | "live"
  | "cooldown"
  | "retired"
  | "rejected";

export type OracleLineRecord = {
  oracleId: string;
  version: string;
  status: OracleLineStatus;
  personaId: string;
  officialPublicPersonaName: string;
  structuralWorkingName: string;
  socialHandle: string;
  functionalSubtitle: string;
  publicSign: string;
  currentMode: string;
  mythCrestMotifCandidate: string;
  oracleLine: string;
  interpretation: string;
  lifeMapping: string;
  smallAdjustment: string;
  symbolField: string;
  freeResultPreview: string;
  paidExpansionSeed: string;
  riskNote: string;
  languageFitScore: number;
  cultureFitScore: number;
  mobileReadabilityScore: number;
  aftertasteScore: number;
  religiousRiskScore: number;
  fortuneTellingRiskScore: number;
  approvalState: OracleLineApprovalState;
  reviewedBy: string | null;
  approvedAt: string | null;
  createdByAgent: string;
  createdAt: string;
  updatedAt: string;
  sourceVersion: string;
  promptHash: string;
  exposureCount: number;
  recentUseCount: number;
  cooldownReason: string | null;
  retiredReason: string | null;
};

export type OracleLineValidationIssue = {
  field: string;
  code: string;
  message: string;
};

export const ORACLE_LINE_PUBLIC_SIGN_REGEX = /^[先受]・[表秘]・[柔刃]・[走組]$/;
export const ORACLE_LINE_BANNED_PATTERNS = [
  "大吉",
  "吉",
  "凶",
  "上上",
  "下下",
  "運命",
  "神託",
  "霊験",
  "占い",
  "予言",
  "神様が",
  "仏様が",
  "神社による",
  "寺による",
  "診断結果として断定",
  "final_naming_lock",
  "風岐",
] as const;

function clampScore(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function normalizeOracleLineText(input: string) {
  return input
    .replace(/\s+/g, " ")
    .replace(/\u3000/g, " ")
    .replace(/^\s+|\s+$/g, "")
    .replace(/\s+([、。,.!?！？])/g, "$1");
}

export function isYorisouOraclePublicSign(value: string): value is string {
  return ORACLE_LINE_PUBLIC_SIGN_REGEX.test(value);
}

export function buildOracleLinePromptHash(
  input: Pick<OracleLineRecord, "personaId" | "currentMode" | "oracleLine" | "interpretation" | "lifeMapping" | "smallAdjustment">,
) {
  const source = `${input.personaId}|${input.currentMode}|${input.oracleLine}|${input.interpretation}|${input.lifeMapping}|${input.smallAdjustment}`;
  return createHash("sha256").update(source).digest("hex");
}

export function buildOracleLineScores(input: Pick<OracleLineRecord, "oracleLine" | "interpretation" | "lifeMapping" | "smallAdjustment" | "freeResultPreview" | "paidExpansionSeed">) {
  const totalLength =
    input.oracleLine.length +
    input.interpretation.length +
    input.lifeMapping.length +
    input.smallAdjustment.length +
    input.freeResultPreview.length +
    input.paidExpansionSeed.length;
  const bannedPatternCount = ORACLE_LINE_BANNED_PATTERNS.reduce((count, pattern) => {
    return count + Number(`${input.oracleLine}${input.interpretation}${input.lifeMapping}${input.smallAdjustment}${input.freeResultPreview}${input.paidExpansionSeed}`.includes(pattern));
  }, 0);
  const fortuneRisk = ORACLE_LINE_BANNED_PATTERNS.slice(0, 12).reduce((count, pattern) => {
    return count + Number(`${input.oracleLine}${input.interpretation}${input.lifeMapping}${input.smallAdjustment}${input.freeResultPreview}${input.paidExpansionSeed}`.includes(pattern));
  }, 0);
  const languageFitScore = clampScore(94 - Math.max(0, Math.floor((totalLength - 150) / 4)) - bannedPatternCount * 18);
  const cultureFitScore = clampScore(92 - bannedPatternCount * 18);
  const mobileReadabilityScore = clampScore(96 - Math.max(0, Math.floor((input.oracleLine.length - 30) * 1.4)) - Math.max(0, Math.floor((input.interpretation.length - 42) / 2)));
  const aftertasteScore = clampScore(88 + Math.min(8, Math.floor((input.freeResultPreview.length + input.smallAdjustment.length) / 18)));
  const religiousRiskScore = clampScore(bannedPatternCount * 15);
  const fortuneTellingRiskScore = clampScore(fortuneRisk * 16);

  return {
    languageFitScore,
    cultureFitScore,
    mobileReadabilityScore,
    aftertasteScore,
    religiousRiskScore,
    fortuneTellingRiskScore,
  };
}

export function validateOracleLineSafety(record: Pick<
  OracleLineRecord,
  "oracleLine" | "interpretation" | "lifeMapping" | "smallAdjustment" | "freeResultPreview" | "paidExpansionSeed" | "publicSign" | "officialPublicPersonaName" | "socialHandle" | "functionalSubtitle"
>) {
  const issues: OracleLineValidationIssue[] = [];
  const joined = `${record.oracleLine}\n${record.interpretation}\n${record.lifeMapping}\n${record.smallAdjustment}\n${record.freeResultPreview}\n${record.paidExpansionSeed}\n${record.officialPublicPersonaName}\n${record.socialHandle}\n${record.functionalSubtitle}\n${record.publicSign}`;

  if (!isYorisouOraclePublicSign(record.publicSign)) {
    issues.push({
      field: "publicSign",
      code: "invalid_public_sign",
      message: "Public sign must follow the four-cell grammar.",
    });
  }

  for (const banned of ORACLE_LINE_BANNED_PATTERNS) {
    if (joined.includes(banned)) {
      issues.push({
        field: "content",
        code: "banned_pattern",
        message: `Banned pattern detected: ${banned}`,
      });
    }
  }

  if (record.oracleLine.length > 72) {
    issues.push({
      field: "oracleLine",
      code: "oracle_line_too_long",
      message: "Oracle line should stay mobile-safe.",
    });
  }

  if (record.interpretation.length > 96) {
    issues.push({
      field: "interpretation",
      code: "interpretation_too_long",
      message: "Interpretation should stay compact.",
    });
  }

  if (record.lifeMapping.length > 96) {
    issues.push({
      field: "lifeMapping",
      code: "life_mapping_too_long",
      message: "Life mapping should stay compact.",
    });
  }

  if (record.smallAdjustment.length > 72) {
    issues.push({
      field: "smallAdjustment",
      code: "small_adjustment_too_long",
      message: "Small adjustment should stay compact.",
    });
  }

  return issues;
}
