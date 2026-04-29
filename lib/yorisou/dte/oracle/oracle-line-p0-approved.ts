import { CURRENT_TRUTH_VERSION } from "@/lib/yorisou/dte/current-resource-truth";
import { getPersonaAnnexARow } from "@/lib/yorisou/dte/persona-annex-a";
import {
  buildOracleLinePromptHash,
  buildOracleLineScores,
  normalizeOracleLineText,
  ORACLE_LINE_VERSION,
  type OracleLineRecord,
} from "@/lib/yorisou/dte/oracle/oracle-line-types";

type OracleSeedBlueprint = {
  personaId: "P01" | "P07" | "P09" | "P11" | "P19";
  currentMode: string;
  oracleLine: string;
  interpretation: string;
  lifeMapping: string;
  smallAdjustment: string;
  symbolField: string;
  freeResultPreview: string;
  paidExpansionSeed: string;
};

const P0_SEED_APPROVED_AT = "2026-04-26T00:00:00.000Z";

const BLUEPRINTS: OracleSeedBlueprint[] = [
  {
    personaId: "P01",
    currentMode: "静観",
    oracleLine: "返す前に一拍置くと、相手の熱を受けすぎずに済む。",
    interpretation: "受け取りの速さを少し緩めると、会話が自分の温度で読める。",
    lifeMapping: "LINEの既読直後や朝の返信で効きやすい。",
    smallAdjustment: "最初の一文を短くしてから送る。",
    symbolField: "一拍の余白",
    freeResultPreview: "少し遅れて返すと、輪郭がきれいに残る。",
    paidExpansionSeed: "受け取り / 返し / 逃がし の3場面で整理する。",
  },
  {
    personaId: "P01",
    currentMode: "過敏",
    oracleLine: "気配が強い日は、席を少しゆるめてから返すと疲れにくい。",
    interpretation: "先に反応しすぎるより、空気をひと呼吸だけ通すほうが安定する。",
    lifeMapping: "通知が続く日や、短い往復が重なる会話で効く。",
    smallAdjustment: "一度画面を閉じてから返す。",
    symbolField: "ゆるめた席",
    freeResultPreview: "反射で返さず、呼吸をはさんでから動く。",
    paidExpansionSeed: "過敏 / 受け流し / 再接続の切り方を深く見る。",
  },
  {
    personaId: "P01",
    currentMode: "ひらき",
    oracleLine: "受け取る幅を少し広げると、相手との距離がなめらかに縮む。",
    interpretation: "閉じすぎず、広げすぎずの間にいると、返し方が自然になる。",
    lifeMapping: "朝の連絡、雑談の入口、少し親しい相手とのやり取りに合う。",
    smallAdjustment: "文末に一語だけ余白を残す。",
    symbolField: "やわらかな開き",
    freeResultPreview: "少し開くと、返事の形が柔らかくなる。",
    paidExpansionSeed: "ひらき / 距離の調整 / 返しの自然さを分けて読む。",
  },
  {
    personaId: "P07",
    currentMode: "直断",
    oracleLine: "迷っている空気が長いなら、結論を先に出すほうが場は落ち着く。",
    interpretation: "曖昧さを引き延ばすより、線を引くほうが楽になる場面がある。",
    lifeMapping: "会議前の確認、手順のすり合わせ、LINEの要点整理で使いやすい。",
    smallAdjustment: "最初に結論を一行だけ置く。",
    symbolField: "結論の先出し",
    freeResultPreview: "霧のまま続けるより、先に切るほうが整う。",
    paidExpansionSeed: "直断 / 要点の順番 / 断ち切る位置を見分ける。",
  },
  {
    personaId: "P07",
    currentMode: "切開",
    oracleLine: "論点を二つに分けるだけで、霧はかなり薄くなる。",
    interpretation: "一気に片づけず、分けて見せると相手も追いやすい。",
    lifeMapping: "説明が長くなる場面や、誤解をほどきたい会話に向く。",
    smallAdjustment: "話を二項目までに切る。",
    symbolField: "二つに分ける線",
    freeResultPreview: "分けるほど、余計な濁りは薄くなる。",
    paidExpansionSeed: "切開 / 情報の整理 / 相手の追いやすさを深読みする。",
  },
  {
    personaId: "P07",
    currentMode: "留保",
    oracleLine: "まだ詰めないほうがいい時は、言い切らず余白を残す。",
    interpretation: "切る強さだけでなく、置いておく強さもこの型の一部。",
    lifeMapping: "判断前の保留、急がない返答、様子見の連絡に合う。",
    smallAdjustment: "結論を少し遅らせる。",
    symbolField: "残す余白",
    freeResultPreview: "切るだけが正解ではないときの、静かな置き方。",
    paidExpansionSeed: "留保 / 保留の線 / どこで待つかを整理する。",
  },
  {
    personaId: "P09",
    currentMode: "蓄圧",
    oracleLine: "我慢が長い日は、先に短く切り上げるだけで爆発を避けやすい。",
    interpretation: "ため続ける前に、小さく終えるクセを入れると負担が減る。",
    lifeMapping: "返事をためがちな日、頼まれごとが重なる日に効く。",
    smallAdjustment: "会話を一度、区切って席を外す。",
    symbolField: "早めの切り上げ",
    freeResultPreview: "長く抱えず、短く切るだけで熱は下がる。",
    paidExpansionSeed: "蓄圧 / ため込み / 爆発前の逃がし方を読む。",
  },
  {
    personaId: "P09",
    currentMode: "我慢",
    oracleLine: "飲み込む前に、一回だけ言葉にして温度を下げる。",
    interpretation: "黙る前の短い言語化が、あとでの言いすぎを減らす。",
    lifeMapping: "家族への返し、仕事の依頼、気をつかった会話で使いやすい。",
    smallAdjustment: "一言だけ先に出す。",
    symbolField: "短い言語化",
    freeResultPreview: "飲み込む前に出す一言が、圧を下げる。",
    paidExpansionSeed: "我慢 / 先の一言 / 温度の逃がし方を深読みする。",
  },
  {
    personaId: "P09",
    currentMode: "噴出",
    oracleLine: "限界の前に席を外すと、あとで言いすぎにくい。",
    interpretation: "出る直前に少し離れるだけで、相手も自分も守りやすい。",
    lifeMapping: "返答が荒くなりそうな日や、疲れがたまった夕方に向く。",
    smallAdjustment: "返す前に手元を置く。",
    symbolField: "席を外す線",
    freeResultPreview: "噴きそうな時こそ、先に距離を作る。",
    paidExpansionSeed: "噴出 / 離席 / 言いすぎ回避の型を分ける。",
  },
  {
    personaId: "P11",
    currentMode: "設計",
    oracleLine: "先に並べると、途中の迷いがかなり減る。",
    interpretation: "頭の中だけで回すより、順番を外に出すと動きが軽い。",
    lifeMapping: "予定づくり、家の段取り、朝の支度に効きやすい。",
    smallAdjustment: "やることを3つまでに並べる。",
    symbolField: "並ぶ順番",
    freeResultPreview: "順番が見えると、動きはずっと軽くなる。",
    paidExpansionSeed: "設計 / 手順の外化 / 迷いの減らし方を読む。",
  },
  {
    personaId: "P11",
    currentMode: "整列",
    oracleLine: "順番が見えている日は、手を動かす速度まで整いやすい。",
    interpretation: "整列は見た目だけでなく、気持ちの摩擦も減らす。",
    lifeMapping: "締切前、片付け、持ち物の確認でそのまま効く。",
    smallAdjustment: "先に置き場所を決める。",
    symbolField: "揃う置き場",
    freeResultPreview: "整列できると、慌てずに進める。",
    paidExpansionSeed: "整列 / 摩擦の削減 / 実務の手触りを深める。",
  },
  {
    personaId: "P11",
    currentMode: "実装",
    oracleLine: "考えを置く場所が決まると、動くほうに切り替えやすい。",
    interpretation: "考える段階と動く段階を分けると、実務が止まりにくい。",
    lifeMapping: "片付けの着手、仕事の初手、連絡の切り出しに向く。",
    smallAdjustment: "着手の最初だけを決める。",
    symbolField: "置き場所",
    freeResultPreview: "考えを置けると、行動に移りやすい。",
    paidExpansionSeed: "実装 / 着手の最初 / 実務の移し方を読む。",
  },
  {
    personaId: "P19",
    currentMode: "確認",
    oracleLine: "大丈夫の確認が先に取れると、動き出しが早くなる。",
    interpretation: "安心の土台が見えると、次の一歩がずっと軽い。",
    lifeMapping: "待ち合わせ前、家族の予定、初めての場所で効きやすい。",
    smallAdjustment: "一度だけ確かめてから進む。",
    symbolField: "確認のひと呼吸",
    freeResultPreview: "大丈夫が見えると、足が前に出やすい。",
    paidExpansionSeed: "確認 / 安心の土台 / 動き出しの前提を深読む。",
  },
  {
    personaId: "P19",
    currentMode: "密着",
    oracleLine: "距離が少し縮むだけで、安心がぐっと増える。",
    interpretation: "近さがそのまま安心に変わるので、無理に広げなくていい。",
    lifeMapping: "親しい相手との会話、隣に人がいる場面、帰宅後に効く。",
    smallAdjustment: "相手に合わせて半歩寄る。",
    symbolField: "半歩の近さ",
    freeResultPreview: "少し近いだけで、落ち着きが増す。",
    paidExpansionSeed: "密着 / 近さの安心 / 距離の調整を分けて読む。",
  },
  {
    personaId: "P19",
    currentMode: "不安",
    oracleLine: "先の見通しが少ない日は、選ぶ前に一回だけ確かめる。",
    interpretation: "不安そのものを消すより、確認の回数を1回だけ増やすと動ける。",
    lifeMapping: "予定変更、返答待ち、初対面の流れで効く。",
    smallAdjustment: "選択肢を二つまでに絞る。",
    symbolField: "一回だけの確認",
    freeResultPreview: "不安の日は、確認を増やしすぎずひと呼吸置く。",
    paidExpansionSeed: "不安 / 確認の回数 / 迷いの扱いを深める。",
  },
];

function seedRecordFromBlueprint(blueprint: OracleSeedBlueprint): OracleLineRecord {
  const row = getPersonaAnnexARow(blueprint.personaId);
  if (!row) {
    throw new Error(`Missing Annex A row for ${blueprint.personaId}`);
  }

  const oracleLine = normalizeOracleLineText(blueprint.oracleLine);
  const interpretation = normalizeOracleLineText(blueprint.interpretation);
  const lifeMapping = normalizeOracleLineText(blueprint.lifeMapping);
  const smallAdjustment = normalizeOracleLineText(blueprint.smallAdjustment);
  const freeResultPreview = normalizeOracleLineText(blueprint.freeResultPreview);
  const paidExpansionSeed = normalizeOracleLineText(blueprint.paidExpansionSeed);
  const scores = buildOracleLineScores({
    oracleLine,
    interpretation,
    lifeMapping,
    smallAdjustment,
    freeResultPreview,
    paidExpansionSeed,
  });

  return {
    oracleId: `${blueprint.personaId}:${blueprint.currentMode}`,
    version: ORACLE_LINE_VERSION,
    status: "live",
    personaId: blueprint.personaId,
    officialPublicPersonaName: row.officialPublicPersonaName,
    structuralWorkingName: row.structuralWorkingName,
    socialHandle: row.socialHandle,
    functionalSubtitle: row.functionalSubtitle,
    publicSign: row.publicSign,
    currentMode: blueprint.currentMode,
    mythCrestMotifCandidate: row.mythCrestMotifCandidate,
    oracleLine,
    interpretation,
    lifeMapping,
    smallAdjustment,
    symbolField: normalizeOracleLineText(blueprint.symbolField),
    freeResultPreview,
    paidExpansionSeed,
    riskNote: row.riskNote,
    languageFitScore: scores.languageFitScore,
    cultureFitScore: scores.cultureFitScore,
    mobileReadabilityScore: scores.mobileReadabilityScore,
    aftertasteScore: scores.aftertasteScore,
    religiousRiskScore: scores.religiousRiskScore,
    fortuneTellingRiskScore: scores.fortuneTellingRiskScore,
    approvalState: "approved_public",
    reviewedBy: "board/p0-seed",
    approvedAt: P0_SEED_APPROVED_AT,
    createdByAgent: "OpenClaw Oracle Line Runner",
    createdAt: P0_SEED_APPROVED_AT,
    updatedAt: P0_SEED_APPROVED_AT,
    sourceVersion: CURRENT_TRUTH_VERSION,
    promptHash: buildOracleLinePromptHash({
      personaId: blueprint.personaId,
      currentMode: blueprint.currentMode,
      oracleLine,
      interpretation,
      lifeMapping,
      smallAdjustment,
    }),
    exposureCount: 0,
    recentUseCount: 0,
    cooldownReason: null,
    retiredReason: null,
  };
}

export const ORACLE_LINE_P0_APPROVED_RECORDS: readonly OracleLineRecord[] = BLUEPRINTS.map(seedRecordFromBlueprint);

