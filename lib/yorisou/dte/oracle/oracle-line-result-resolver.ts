import { getCurrentTruthPersonaRow } from "@/lib/yorisou/dte/current-resource-truth";
import { getOracleLineLiveRecord } from "@/lib/yorisou/dte/oracle/oracle-line-registry";
import type { OracleLineRecord } from "@/lib/yorisou/dte/oracle/oracle-line-types";

export type OracleLineResultSource = "live" | "fallback" | "share" | "continue" | "return";

export type ResolveOracleLineForResultInput = {
  personaId: string;
  currentMode: string | null;
  resultSource?: OracleLineResultSource;
};

export type ResolveOracleLineForResultOutput = {
  oracleRecord: OracleLineRecord | null;
  oracleEligible: boolean;
  reason:
    | "live_record_found"
    | "no_current_mode"
    | "invalid_annex_row"
    | "invalid_current_mode"
    | "no_live_record"
    | "fallback_shell";
  personaId: string;
  currentMode: string | null;
};

export function resolveOracleLineForResult(input: ResolveOracleLineForResultInput): ResolveOracleLineForResultOutput {
  const annexRow = getCurrentTruthPersonaRow(input.personaId);
  if (!annexRow) {
    return {
      oracleRecord: null,
      oracleEligible: false,
      reason: "invalid_annex_row",
      personaId: input.personaId,
      currentMode: input.currentMode,
    };
  }

  if (!input.currentMode) {
    return {
      oracleRecord: null,
      oracleEligible: false,
      reason: input.resultSource === "fallback" ? "fallback_shell" : "no_current_mode",
      personaId: input.personaId,
      currentMode: null,
    };
  }

  if (!annexRow.currentModeVariants.includes(input.currentMode)) {
    return {
      oracleRecord: null,
      oracleEligible: false,
      reason: "invalid_current_mode",
      personaId: input.personaId,
      currentMode: input.currentMode,
    };
  }

  const oracleRecord = getOracleLineLiveRecord(input.personaId, input.currentMode);
  if (!oracleRecord) {
    return {
      oracleRecord: null,
      oracleEligible: false,
      reason: "no_live_record",
      personaId: input.personaId,
      currentMode: input.currentMode,
    };
  }

  return {
    oracleRecord,
    oracleEligible: true,
    reason: input.resultSource === "fallback" ? "fallback_shell" : "live_record_found",
    personaId: input.personaId,
    currentMode: input.currentMode,
  };
}
