export const ORACLE_LINE_BATCH_POLICY_VERSION = "v1-2026-04-26" as const;

export const ORACLE_LINE_P0_LIVE_PERSONA_IDS = ["P01", "P07", "P09", "P11", "P19"] as const;

export const ORACLE_LINE_P1_LIVE_PERSONA_IDS = ["P02", "P03", "P05", "P08", "P10", "P13", "P15", "P17", "P20", "P29"] as const;

export const ORACLE_LINE_P2_HOLD_PERSONA_IDS = ["P12", "P14", "P16", "P18", "P22", "P23", "P24", "P25", "P26", "P28", "P31"] as const;

export const ORACLE_LINE_P3_SENSITIVE_PERSONA_IDS = ["P04", "P06", "P21", "P27", "P30"] as const;

export const ORACLE_LINE_P0_LIVE_SET = new Set(ORACLE_LINE_P0_LIVE_PERSONA_IDS);
export const ORACLE_LINE_P1_LIVE_SET = new Set(ORACLE_LINE_P1_LIVE_PERSONA_IDS);
export const ORACLE_LINE_P2_HOLD_SET = new Set(ORACLE_LINE_P2_HOLD_PERSONA_IDS);
export const ORACLE_LINE_P3_SENSITIVE_SET = new Set(ORACLE_LINE_P3_SENSITIVE_PERSONA_IDS);

export type OracleLineBatchTier = "P0" | "P1" | "P2" | "P3";

export function isOracleLinePersonaInSet(set: ReadonlySet<string>, personaId: string) {
  return set.has(personaId);
}

export function getOracleLineBatchTier(personaId: string): OracleLineBatchTier {
  if (isOracleLinePersonaInSet(ORACLE_LINE_P0_LIVE_SET, personaId)) {
    return "P0";
  }
  if (isOracleLinePersonaInSet(ORACLE_LINE_P1_LIVE_SET, personaId)) {
    return "P1";
  }
  if (isOracleLinePersonaInSet(ORACLE_LINE_P3_SENSITIVE_SET, personaId)) {
    return "P3";
  }
  if (isOracleLinePersonaInSet(ORACLE_LINE_P2_HOLD_SET, personaId)) {
    return "P2";
  }
  return "P2";
}

export function isOracleLineLiveBatchPersona(personaId: string) {
  return isOracleLinePersonaInSet(ORACLE_LINE_P0_LIVE_SET, personaId) ||
    isOracleLinePersonaInSet(ORACLE_LINE_P1_LIVE_SET, personaId);
}
