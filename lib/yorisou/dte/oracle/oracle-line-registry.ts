import { assertCurrentResourceTruthCompleteness } from "@/lib/yorisou/dte/current-resource-truth";
import { getPersonaAnnexARow } from "@/lib/yorisou/dte/persona-annex-a";
import { ORACLE_LINE_P0_APPROVED_RECORDS } from "@/lib/yorisou/dte/oracle/oracle-line-p0-approved";
import { ORACLE_LINE_P1_APPROVED_RECORDS } from "@/lib/yorisou/dte/oracle/oracle-line-p1-approved";
import {
  ORACLE_LINE_BANNED_PATTERNS,
  ORACLE_LINE_PUBLIC_SIGN_REGEX,
  ORACLE_LINE_VERSION,
  type OracleLineRecord,
} from "@/lib/yorisou/dte/oracle/oracle-line-types";

export const ORACLE_LINE_REGISTRY_SOURCE = "persona-annex-a" as const;

export function getOracleLineSeedRecords() {
  return [...ORACLE_LINE_P0_APPROVED_RECORDS, ...ORACLE_LINE_P1_APPROVED_RECORDS];
}

export function getOracleLineLiveRecords() {
  return getOracleLineSeedRecords().filter((record) => record.status === "live" && record.approvalState === "approved_public");
}

export function getOracleLineRecordsForPersona(personaId: string) {
  return getOracleLineSeedRecords().filter((record) => record.personaId === personaId);
}

export function getOracleLineLiveRecord(personaId: string, currentMode?: string | null) {
  const exactMatch = getOracleLineLiveRecords().find((record) => record.personaId === personaId && (!currentMode || record.currentMode === currentMode));
  if (exactMatch) {
    return exactMatch;
  }
  return getOracleLineLiveRecords().find((record) => record.personaId === personaId) || null;
}

export function assertOracleLineRegistryCompleteness() {
  const currentTruth = assertCurrentResourceTruthCompleteness();
  const records = getOracleLineSeedRecords();
  const liveRecords = getOracleLineLiveRecords();
  const personaIds = new Set(records.map((record) => record.personaId));
  const personaModeKeys = new Set(records.map((record) => `${record.personaId}:${record.currentMode}`));
  const invalidRecords: Array<{ oracleId: string; issues: string[] }> = [];

  for (const record of records) {
    const annexRow = getPersonaAnnexARow(record.personaId);
    const issues: string[] = [];
    if (!annexRow) {
      issues.push("missing_annex_row");
    } else {
      if (record.officialPublicPersonaName !== annexRow.officialPublicPersonaName) issues.push("official_public_persona_name_mismatch");
      if (record.socialHandle !== annexRow.socialHandle) issues.push("social_handle_mismatch");
      if (record.functionalSubtitle !== annexRow.functionalSubtitle) issues.push("functional_subtitle_mismatch");
      if (record.publicSign !== annexRow.publicSign) issues.push("public_sign_mismatch");
      if (!annexRow.currentModeVariants.includes(record.currentMode)) issues.push("current_mode_mismatch");
      if (record.mythCrestMotifCandidate !== annexRow.mythCrestMotifCandidate) issues.push("myth_motif_mismatch");
      if (record.riskNote !== annexRow.riskNote) issues.push("risk_note_mismatch");
    }

    if (!ORACLE_LINE_PUBLIC_SIGN_REGEX.test(record.publicSign)) {
      issues.push("invalid_public_sign_grammar");
    }

    const joined = `${record.oracleLine}${record.interpretation}${record.lifeMapping}${record.smallAdjustment}${record.freeResultPreview}${record.paidExpansionSeed}`;
    if (ORACLE_LINE_BANNED_PATTERNS.some((pattern) => joined.includes(pattern))) {
      issues.push("banned_pattern_present");
    }

    if (record.sourceVersion !== currentTruth.version) {
      issues.push("source_version_mismatch");
    }
    if (record.status !== "live") {
      issues.push("seed_not_live");
    }
    if (record.approvalState !== "approved_public") {
      issues.push("seed_not_approved_public");
    }

    if (issues.length > 0) {
      invalidRecords.push({ oracleId: record.oracleId, issues });
    }
  }

  const personaCounts = [...personaIds].reduce<Record<string, number>>((acc, personaId) => {
    acc[personaId] = records.filter((record) => record.personaId === personaId).length;
    return acc;
  }, {});

  return {
    version: ORACLE_LINE_VERSION,
    registrySource: ORACLE_LINE_REGISTRY_SOURCE,
    totalRecords: records.length,
    liveRecordCount: liveRecords.length,
    personaCount: personaIds.size,
    personaModeCount: personaModeKeys.size,
    personaCounts,
    invalidRecords,
    currentTruthVersion: currentTruth.version,
    sourceVersionMatches: records.every((record) => record.sourceVersion === currentTruth.version),
  };
}

export type OracleLineRegistrySummary = ReturnType<typeof assertOracleLineRegistryCompleteness>;

export function getOracleLineRegistrySummary(): OracleLineRegistrySummary {
  return assertOracleLineRegistryCompleteness();
}

export function isApprovedPublicOrLiveOracleLine(record: Pick<OracleLineRecord, "status" | "approvalState">) {
  return (record.status === "live" || record.status === "approved_public") && record.approvalState === "approved_public";
}
