import { CURRENT_TRUTH_VERSION } from "@/lib/yorisou/dte/current-resource-truth";
import { getPersonaAnnexARow } from "@/lib/yorisou/dte/persona-annex-a";
import {
  buildOracleLinePromptHash,
  buildOracleLineScores,
  normalizeOracleLineText,
  type OracleLineApprovalState,
  type OracleLineRecord,
  type OracleLineStatus,
} from "@/lib/yorisou/dte/oracle/oracle-line-types";

type OracleLineBlueprintInput = {
  personaId: string;
  currentMode: string;
  oracleLine: string;
  interpretation: string;
  lifeMapping: string;
  smallAdjustment: string;
  symbolField: string;
  freeResultPreview: string;
  paidExpansionSeed: string;
  riskNote?: string | null;
};

export function createCandidate(input: OracleLineBlueprintInput, overrides: Partial<OracleLineRecord> = {}): OracleLineRecord {
  const row = getPersonaAnnexARow(input.personaId);
  if (!row) {
    throw new Error(`Missing Annex A row for ${input.personaId}`);
  }

  const oracleLine = normalizeOracleLineText(input.oracleLine);
  const interpretation = normalizeOracleLineText(input.interpretation);
  const lifeMapping = normalizeOracleLineText(input.lifeMapping);
  const smallAdjustment = normalizeOracleLineText(input.smallAdjustment);
  const freeResultPreview = normalizeOracleLineText(input.freeResultPreview);
  const paidExpansionSeed = normalizeOracleLineText(input.paidExpansionSeed);
  const scores = buildOracleLineScores({
    oracleLine,
    interpretation,
    lifeMapping,
    smallAdjustment,
    freeResultPreview,
    paidExpansionSeed,
  });
  const now = overrides.createdAt || new Date().toISOString();

  return {
    oracleId: overrides.oracleId || `${input.personaId}:${input.currentMode}:${buildOracleLinePromptHash({ personaId: input.personaId, currentMode: input.currentMode, oracleLine, interpretation, lifeMapping, smallAdjustment }).slice(0, 10)}`,
    version: overrides.version || "v1-2026-04-26",
    status: (overrides.status || "candidate") as OracleLineStatus,
    personaId: input.personaId,
    officialPublicPersonaName: row.officialPublicPersonaName,
    structuralWorkingName: row.structuralWorkingName,
    socialHandle: row.socialHandle,
    functionalSubtitle: row.functionalSubtitle,
    publicSign: row.publicSign,
    currentMode: input.currentMode,
    mythCrestMotifCandidate: row.mythCrestMotifCandidate,
    oracleLine,
    interpretation,
    lifeMapping,
    smallAdjustment,
    symbolField: normalizeOracleLineText(input.symbolField),
    freeResultPreview,
    paidExpansionSeed,
    riskNote: input.riskNote || row.riskNote,
    languageFitScore: overrides.languageFitScore ?? scores.languageFitScore,
    cultureFitScore: overrides.cultureFitScore ?? scores.cultureFitScore,
    mobileReadabilityScore: overrides.mobileReadabilityScore ?? scores.mobileReadabilityScore,
    aftertasteScore: overrides.aftertasteScore ?? scores.aftertasteScore,
    religiousRiskScore: overrides.religiousRiskScore ?? scores.religiousRiskScore,
    fortuneTellingRiskScore: overrides.fortuneTellingRiskScore ?? scores.fortuneTellingRiskScore,
    approvalState: (overrides.approvalState || "draft") as OracleLineApprovalState,
    reviewedBy: overrides.reviewedBy || null,
    approvedAt: overrides.approvedAt || null,
    createdByAgent: overrides.createdByAgent || "OpenClaw Oracle Line Runner",
    createdAt: now,
    updatedAt: overrides.updatedAt || now,
    sourceVersion: overrides.sourceVersion || CURRENT_TRUTH_VERSION,
    promptHash: overrides.promptHash || buildOracleLinePromptHash({
      personaId: input.personaId,
      currentMode: input.currentMode,
      oracleLine,
      interpretation,
      lifeMapping,
      smallAdjustment,
    }),
    exposureCount: overrides.exposureCount ?? 0,
    recentUseCount: overrides.recentUseCount ?? 0,
    cooldownReason: overrides.cooldownReason ?? null,
    retiredReason: overrides.retiredReason ?? null,
  };
}

export function normalizeCandidate(record: OracleLineRecord) {
  const normalized = createCandidate(
    {
      personaId: record.personaId,
      currentMode: record.currentMode,
      oracleLine: record.oracleLine,
      interpretation: record.interpretation,
      lifeMapping: record.lifeMapping,
      smallAdjustment: record.smallAdjustment,
      symbolField: record.symbolField,
      freeResultPreview: record.freeResultPreview,
      paidExpansionSeed: record.paidExpansionSeed,
      riskNote: record.riskNote,
    },
    {
      ...record,
      version: record.version,
      status: record.status,
      approvalState: record.approvalState,
      createdAt: record.createdAt,
      updatedAt: new Date().toISOString(),
    },
  );
  return normalized;
}

export function screenCandidate(record: OracleLineRecord) {
  const next = normalizeCandidate(record);
  const riskPenalty = next.religiousRiskScore + next.fortuneTellingRiskScore;
  const score = next.languageFitScore + next.cultureFitScore + next.mobileReadabilityScore + next.aftertasteScore - riskPenalty;
  const status: OracleLineStatus = score >= 330 ? "screened" : "candidate";
  return {
    ...next,
    status,
    approvalState: "review" as OracleLineApprovalState,
    reviewedBy: next.reviewedBy || "oracle-screening-bot",
    updatedAt: new Date().toISOString(),
    exposureCount: next.exposureCount,
    recentUseCount: next.recentUseCount,
  };
}

export function rejectCandidate(record: OracleLineRecord, reason: string) {
  const next = normalizeCandidate(record);
  return {
    ...next,
    status: "rejected" as const,
    approvalState: "rejected" as const,
    reviewedBy: next.reviewedBy || "oracle-screening-bot",
    updatedAt: new Date().toISOString(),
    cooldownReason: null,
    retiredReason: reason,
  };
}

export function holdForManualReview(record: OracleLineRecord, reason: string) {
  const next = normalizeCandidate(record);
  return {
    ...next,
    status: "screened" as const,
    approvalState: "review" as const,
    reviewedBy: next.reviewedBy || "oracle-screening-bot",
    updatedAt: new Date().toISOString(),
    cooldownReason: reason,
  };
}

export function approveInternal(record: OracleLineRecord, reviewedBy = "oracle-reviewer") {
  const next = normalizeCandidate(record);
  return {
    ...next,
    status: "approved_internal" as const,
    approvalState: "approved_internal" as const,
    reviewedBy,
    approvedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function approvePublic(record: OracleLineRecord, reviewedBy = "oracle-reviewer") {
  const next = normalizeCandidate(record);
  return {
    ...next,
    status: "approved_public" as const,
    approvalState: "approved_public" as const,
    reviewedBy,
    approvedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function promoteToLive(record: OracleLineRecord, allowPublicPromotion = false) {
  if (!allowPublicPromotion) {
    throw new Error("oracle_public_promotion_requires_explicit_operator_approval");
  }

  const next = normalizeCandidate(record);
  return {
    ...next,
    status: "live" as const,
    approvalState: "approved_public" as const,
    reviewedBy: next.reviewedBy || "oracle-reviewer",
    approvedAt: next.approvedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function moveToCooldown(record: OracleLineRecord, reason: string) {
  const next = normalizeCandidate(record);
  return {
    ...next,
    status: "cooldown" as const,
    approvalState: "cooldown" as const,
    cooldownReason: reason,
    updatedAt: new Date().toISOString(),
  };
}

export function retireOracleLine(record: OracleLineRecord, reason: string) {
  const next = normalizeCandidate(record);
  return {
    ...next,
    status: "retired" as const,
    approvalState: "retired" as const,
    retiredReason: reason,
    updatedAt: new Date().toISOString(),
  };
}
