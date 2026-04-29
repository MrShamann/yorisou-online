import { getCurrentTruthPersonaRows } from "@/lib/yorisou/dte/current-resource-truth";
import { createCandidate } from "@/lib/yorisou/dte/oracle/oracle-line-workflow";
import { type OracleLineApprovalState, type OracleLineRecord, type OracleLineStatus } from "@/lib/yorisou/dte/oracle/oracle-line-types";
import {
  getOracleLineBatchTier,
  isOracleLinePersonaInSet,
  ORACLE_LINE_P0_LIVE_SET,
  ORACLE_LINE_P1_LIVE_SET,
  ORACLE_LINE_P2_HOLD_SET,
  ORACLE_LINE_P3_SENSITIVE_SET,
} from "@/lib/yorisou/dte/oracle/oracle-line-batch-policy";

export const ORACLE_LINE_SCENE_BANK = [
  { tag: "line_reply", family: "LINE/message rhythm", phrase: "LINEの返し方" },
  { tag: "group_chat", family: "group atmosphere / reading the air", phrase: "グループの空気" },
  { tag: "senpai_kohai", family: "senpai/kohai or hierarchy", phrase: "先輩や後輩への一言" },
  { tag: "work_pressure", family: "work/school pressure", phrase: "仕事や学校の締切前" },
  { tag: "friend_distance", family: "friendship / closeness", phrase: "友だちとの距離" },
  { tag: "family_support", family: "family / support", phrase: "家族の相談" },
  { tag: "money_boundary", family: "money / boundary", phrase: "お金の境目" },
  { tag: "nomikai", family: "nomikai / social event", phrase: "飲み会や集まり" },
  { tag: "solitude", family: "solitude / reset", phrase: "ひとり時間" },
  { tag: "criticism", family: "criticism / embarrassment", phrase: "指摘や気まずさ" },
  { tag: "decision", family: "everyday decision", phrase: "その場の選び方" },
  { tag: "travel", family: "travel / plan deviation", phrase: "移動中の予定変更" },
  { tag: "support", family: "emotional support", phrase: "気持ちを支える場面" },
  { tag: "posting", family: "self-presentation / posting", phrase: "SNSに出すかどうか" },
  { tag: "self_growth", family: "quiet ambition / self-growth", phrase: "静かな自己更新" },
] as const;

export const ORACLE_LINE_ADJUSTMENT_BANK = [
  "最初の一文を短くする",
  "一回だけ確かめてから返す",
  "選択肢を二つまでに絞る",
  "相手に合わせて半歩寄る",
  "結論を先に置く",
  "返す前に画面を一度閉じる",
  "やることを3つまでに並べる",
  "席を少し外してから戻る",
] as const;

export type OracleLineMatrixTier = "live" | "approved_internal" | "screened";

export type BuildOracleLineMatrixRecordInput = {
  personaId: string;
  personaIndex: number;
  currentMode: string;
  modeIndex: number;
  status?: OracleLineStatus;
  approvalState?: OracleLineApprovalState;
  createdByAgent?: string;
};

function getMatrixTier(personaId: string): OracleLineMatrixTier {
  if (isOracleLinePersonaInSet(ORACLE_LINE_P0_LIVE_SET, personaId)) {
    return "live";
  }
  if (isOracleLinePersonaInSet(ORACLE_LINE_P1_LIVE_SET, personaId)) {
    return "live";
  }
  if (isOracleLinePersonaInSet(ORACLE_LINE_P3_SENSITIVE_SET, personaId)) {
    return "screened";
  }
  if (isOracleLinePersonaInSet(ORACLE_LINE_P2_HOLD_SET, personaId)) {
    return "approved_internal";
  }
  return "approved_internal";
}

export function buildOracleLineMatrixRecord(input: BuildOracleLineMatrixRecordInput): OracleLineRecord {
  const row = getCurrentTruthPersonaRows()[input.personaIndex];
  if (!row || row.personaId !== input.personaId) {
    throw new Error(`Annex A row mismatch for ${input.personaId}`);
  }

  const scene = ORACLE_LINE_SCENE_BANK[(input.personaIndex * 3 + input.modeIndex) % ORACLE_LINE_SCENE_BANK.length];
  const adjustment = ORACLE_LINE_ADJUSTMENT_BANK[(input.personaIndex + input.modeIndex) % ORACLE_LINE_ADJUSTMENT_BANK.length];
  const tier = getMatrixTier(row.personaId);
  const currentMode = input.currentMode;
  const oracleLine = `${row.officialPublicPersonaName}の${currentMode}は、${scene.phrase}の場面で空気に出やすい。`;
  const interpretation = `${row.socialHandle}の特徴は、${scene.phrase}の中で${adjustment}に寄せると扱いやすい。`;
  const lifeMapping = `${scene.phrase}では、まず${adjustment}を一つ入れると整いやすい。`;
  const smallAdjustment = adjustment;
  const symbolField = `${scene.tag} / ${input.modeIndex + 1}`;
  const freeResultPreview = `${scene.phrase}の手つきが少し見やすくなる。`;
  const paidExpansionSeed = `${scene.family} / ${currentMode} / ${row.publicSign} を分けて読む。`;

  const base = createCandidate(
    {
      personaId: row.personaId,
      currentMode,
      oracleLine,
      interpretation,
      lifeMapping,
      smallAdjustment,
      symbolField,
      freeResultPreview,
      paidExpansionSeed,
      riskNote: row.riskNote,
    },
    {
      createdByAgent: input.createdByAgent || "OpenClaw Oracle Line Runner",
      status: input.status || (tier === "live" ? "live" : tier === "approved_internal" ? "approved_internal" : "screened"),
      approvalState: input.approvalState || (tier === "live" ? "approved_public" : tier === "approved_internal" ? "approved_internal" : "review"),
    },
  );

  return base;
}

export function buildOracleLineMatrixRecordsForPersona(personaId: string) {
  const rows = getCurrentTruthPersonaRows();
  const personaIndex = rows.findIndex((row) => row.personaId === personaId);
  if (personaIndex < 0) {
    throw new Error(`Missing persona row for ${personaId}`);
  }
  const row = rows[personaIndex];
  return row.currentModeVariants.map((currentMode, modeIndex) =>
    buildOracleLineMatrixRecord({
      personaId,
      personaIndex,
      currentMode,
      modeIndex,
    }),
  );
}

export function buildOracleLineFullMatrixRecords() {
  const rows = getCurrentTruthPersonaRows();
  return rows.flatMap((row, personaIndex) =>
    row.currentModeVariants.map((currentMode, modeIndex) =>
      buildOracleLineMatrixRecord({
        personaId: row.personaId,
        personaIndex,
        currentMode,
        modeIndex,
      }),
    ),
  );
}

export function classifyOracleLineMatrixRecord(personaId: string) {
  return getOracleLineBatchTier(personaId);
}
