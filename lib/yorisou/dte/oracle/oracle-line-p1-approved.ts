import { buildOracleLineMatrixRecordsForPersona } from "@/lib/yorisou/dte/oracle/oracle-line-matrix";
import { ORACLE_LINE_P1_LIVE_PERSONA_IDS } from "@/lib/yorisou/dte/oracle/oracle-line-batch-policy";
import type { OracleLineRecord } from "@/lib/yorisou/dte/oracle/oracle-line-types";

const P1_APPROVED_AT = "2026-04-26T00:00:00.000Z";

export const ORACLE_LINE_P1_APPROVED_RECORDS: readonly OracleLineRecord[] = ORACLE_LINE_P1_LIVE_PERSONA_IDS.flatMap((personaId) =>
  buildOracleLineMatrixRecordsForPersona(personaId).map((record) => ({
    ...record,
    status: "live",
    approvalState: "approved_public",
    reviewedBy: "board/p1-batch",
    approvedAt: P1_APPROVED_AT,
    createdAt: P1_APPROVED_AT,
    updatedAt: P1_APPROVED_AT,
  })),
);
