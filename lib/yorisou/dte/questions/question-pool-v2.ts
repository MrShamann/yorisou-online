import { CANONICAL_DTE_DIMENSIONS } from "@/lib/yorisou/dte/dimensions";
import type { QuestionPoolMetadata, QuestionPoolOptionInput, QuestionPoolSessionOrderItem, QuestionPoolSourceQuestion } from "./question-pool-types";

type ScenarioPack = {
  key: string;
  family: string;
  familyByDimension?: Partial<Record<string, string>>;
  sessionPosition: string;
  toneDepth: string;
  personaHints: string[];
  questionSuffix: string;
  questionSuffixByDimension?: Partial<Record<string, string>>;
  helperSuffix: string;
  helperSuffixByDimension?: Partial<Record<string, string>>;
  optionSet: QuestionPoolOptionInput[];
};

type DimensionBlueprint = {
  dimensionId: string;
  dimensionLabel: string;
  sceneIntro: string;
  calibrationNotes: string;
  packKeys: string[];
  personaHints: string[];
};

const METADATA: QuestionPoolMetadata = {
  session_id: "yorisou_dte_question_pool_v2_session",
  date: "2026-04-26",
};

export const QUESTION_POOL_V2_CORE_DIMENSION_ORDER = [
  "D09",
  "D16",
  "D04",
  "D15",
  "D07",
  "D20",
  "D11",
  "D03",
  "D14",
  "D12",
  "D05",
  "D19",
  "D01",
  "D18",
  "D06",
  "D10",
  "D02",
  "D13",
  "D17",
  "D08",
  "D21",
] as const;

const PACKS: Record<string, ScenarioPack> = {
  morning_start: {
    key: "morning_start",
    family: "朝の立ち上がり",
    sessionPosition: "opener",
    toneDepth: "light_plus",
    personaHints: ["朝型", "初速重視", "段取り型"],
    questionSuffix: "朝いちで、いちばん近いのは？",
    helperSuffix: "朝の立ち上がり方に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "水を飲んで、すぐ動く", signal: "即起動" },
      { id: "B", label: "通知だけ先に見る", signal: "確認起動" },
      { id: "C", label: "予定を見てから体を起こす", signal: "段取り確認" },
      { id: "D", label: "おはようだけ送ってから始める", signal: "対話起動" },
      { id: "E", label: "今日は少しゆっくり始める", signal: "低速開始" },
    ],
  },
  line_delay: {
    key: "line_delay",
    family: "LINEの返事の間",
    familyByDimension: {
      D01: "朝の既読の間",
      D02: "出発前の既読",
      D09: "会話の温度差",
      D10: "家族LINEのひと呼吸",
      D12: "夜の既読の間",
      D13: "予定ズレ後の返事",
      D18: "距離を測る既読",
      D20: "先送り前の既読",
      D21: "様子見の既読",
    },
    sessionPosition: "middle",
    toneDepth: "light",
    personaHints: ["LINE重視", "温度感重視", "気配読み"],
    questionSuffix: "既読のまま少し止まったら、どう返す？",
    questionSuffixByDimension: {
      D01: "朝いちの既読、どう返す？",
      D02: "出発前に既読がついたら、どう返す？",
      D09: "少し重い空気のLINEが来たら、どう返す？",
      D10: "家族から一声だけ来たら、どう返す？",
      D12: "夜に返事を置くなら、どう返す？",
      D13: "予定が動いたあと、どう返す？",
      D18: "少し距離を測り直したいとき、どう返す？",
      D20: "今決めるか迷うとき、既読のあとどう返す？",
      D21: "動くか様子を見るか迷うとき、既読のあとどう返す？",
    },
    helperSuffix: "LINEの間合いに、いちばん近いものを直感で1つ。",
    helperSuffixByDimension: {
      D01: "朝の返事の間合いに、いちばん近いものを直感で1つ。",
      D02: "出発前の返し方に、いちばん近いものを直感で1つ。",
      D09: "重い空気の返し方に、いちばん近いものを直感で1つ。",
      D10: "家族への返し方に、いちばん近いものを直感で1つ。",
      D12: "夜の返事の置き方に、いちばん近いものを直感で1つ。",
      D13: "予定が動いたあとの返し方に、いちばん近いものを直感で1つ。",
      D18: "距離を測り直す返し方に、いちばん近いものを直感で1つ。",
      D20: "決める前の返し方に、いちばん近いものを直感で1つ。",
      D21: "様子見の返し方に、いちばん近いものを直感で1つ。",
    },
    optionSet: [
      { id: "A", label: "短く返す", signal: "短文返信" },
      { id: "B", label: "少し寝かせる", signal: "時間調整" },
      { id: "C", label: "スタンプで返す", signal: "軽い返答" },
      { id: "D", label: "話題を少しずらす", signal: "転調" },
      { id: "E", label: "今日は返さない", signal: "静観" },
    ],
  },
  group_atmosphere: {
    key: "group_atmosphere",
    family: "場の空気",
    sessionPosition: "middle",
    toneDepth: "light_plus",
    personaHints: ["空気読み", "場調整", "慎重型"],
    questionSuffix: "場の空気が少し重いとき、まず何をする？",
    helperSuffix: "場の入り方に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "空気に合わせる", signal: "同調" },
      { id: "B", label: "必要なことだけ言う", signal: "要点先行" },
      { id: "C", label: "少し引いて様子を見る", signal: "距離調整" },
      { id: "D", label: "誰かの表情を先に見る", signal: "観察" },
      { id: "E", label: "黙って待つ", signal: "静観" },
    ],
  },
  hierarchy_senpai: {
    key: "hierarchy_senpai",
    family: "先輩後輩の間",
    sessionPosition: "middle",
    toneDepth: "sharp",
    personaHints: ["上下関係", "礼儀型", "間合い型"],
    questionSuffix: "先輩や後輩の前では、どこから入る？",
    helperSuffix: "先輩後輩の間合いに、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "先に礼をする", signal: "礼先行" },
      { id: "B", label: "少しやわらかく入る", signal: "緩衝" },
      { id: "C", label: "相手を立てて話す", signal: "立てる" },
      { id: "D", label: "距離を少し保つ", signal: "距離維持" },
      { id: "E", label: "無理に踏み込まない", signal: "静観" },
    ],
  },
  work_pressure: {
    key: "work_pressure",
    family: "仕事の圧",
    sessionPosition: "middle",
    toneDepth: "light_plus",
    personaHints: ["実務型", "締切意識", "手順型"],
    questionSuffix: "締切や段取りが詰まったら、最初にどうする？",
    helperSuffix: "仕事の圧がかかった時の最初の一手に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "順番を組み直す", signal: "再配列" },
      { id: "B", label: "重いところから先にやる", signal: "先重視" },
      { id: "C", label: "誰かに相談する", signal: "相談" },
      { id: "D", label: "細かく切って進める", signal: "分解" },
      { id: "E", label: "今日は軽くする", signal: "負荷調整" },
    ],
  },
  friend_closeness: {
    key: "friend_closeness",
    family: "友だちとの距離",
    sessionPosition: "middle",
    toneDepth: "light",
    personaHints: ["友だち重視", "関係調整", "温度管理"],
    questionSuffix: "友だちとの距離を少し測りたい日は、どう動く？",
    helperSuffix: "友だちとの距離感に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "すぐ会う", signal: "即会い" },
      { id: "B", label: "短く返す", signal: "軽返答" },
      { id: "C", label: "少し間を置く", signal: "温度調整" },
      { id: "D", label: "相手に合わせる", signal: "歩調合わせ" },
      { id: "E", label: "今日は静かにする", signal: "静観" },
    ],
  },
  money_reciprocity: {
    key: "money_reciprocity",
    family: "お金と割り勘",
    sessionPosition: "middle",
    toneDepth: "light_plus",
    personaHints: ["金額感覚", "公平感覚", "気配り型"],
    questionSuffix: "お金や割り勘の場面で、いちばん気になるのは？",
    helperSuffix: "割り勘の温度に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "きっちり合わせる", signal: "均等" },
      { id: "B", label: "端数を少し気にする", signal: "端数意識" },
      { id: "C", label: "相手の負担を見る", signal: "相手配慮" },
      { id: "D", label: "今日は自分が多めに出す", signal: "多め負担" },
      { id: "E", label: "あとで調整する", signal: "後調整" },
    ],
  },
  dinner_exit: {
    key: "dinner_exit",
    family: "飲み会の抜け方",
    sessionPosition: "middle",
    toneDepth: "light_plus",
    personaHints: ["社交", "抜け時感覚", "余韻管理"],
    questionSuffix: "飲み会や夕飯を、どこで切り上げる？",
    helperSuffix: "抜け時の感覚に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "流れのいい所で帰る", signal: "流れ切り上げ" },
      { id: "B", label: "挨拶してから抜ける", signal: "礼を残す" },
      { id: "C", label: "余韻を見てから帰る", signal: "余白確認" },
      { id: "D", label: "誰かに合わせる", signal: "同伴" },
      { id: "E", label: "今日は最後までいる", signal: "居残り" },
    ],
  },
  solitude_reset: {
    key: "solitude_reset",
    family: "ひとりの回復",
    sessionPosition: "middle",
    toneDepth: "quiet",
    personaHints: ["ひとり時間", "回復優先", "静けさ重視"],
    questionSuffix: "ひとりに戻ったあと、いちばん回復するのは？",
    helperSuffix: "静けさの戻し方に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "静かに座る", signal: "静座" },
      { id: "B", label: "温かいものを飲む", signal: "温飲" },
      { id: "C", label: "スマホを置く", signal: "遮断" },
      { id: "D", label: "軽く片付ける", signal: "整頓" },
      { id: "E", label: "誰かに少し話す", signal: "通話" },
    ],
  },
  embarrassment_recovery: {
    key: "embarrassment_recovery",
    family: "恥ずかしさのあと",
    sessionPosition: "middle",
    toneDepth: "sharp",
    personaHints: ["照れ", "立て直し", "切替型"],
    questionSuffix: "少し刺さったあと、どう呼吸を戻す？",
    helperSuffix: "気まずさの余韻からの戻り方に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "すぐ忘れる", signal: "切替" },
      { id: "B", label: "人に少し話す", signal: "共有" },
      { id: "C", label: "深呼吸して切り替える", signal: "自己調整" },
      { id: "D", label: "ひとりで整理する", signal: "内省" },
      { id: "E", label: "今日は引きずる", signal: "持ち越し" },
    ],
  },
  choice_overload: {
    key: "choice_overload",
    family: "迷いの整理",
    familyByDimension: {
      D02: "玄関での保留",
      D04: "買い物前の選択",
      D06: "片付け前の整理",
      D13: "予定ズレ後の選択",
      D14: "気まずさの整理",
      D18: "距離を整える選択",
      D19: "安心前の選択",
      D20: "決めどきの保留",
      D21: "一歩手前の選択",
    },
    sessionPosition: "middle",
    toneDepth: "light_plus",
    personaHints: ["選択疲れ", "優先付け", "軽量化"],
    questionSuffix: "候補が並んだら、まず何を先に外す？",
    questionSuffixByDimension: {
      D02: "玄関で「行くか、やめるか」で足が止まったとき、最初に何を外す？",
      D04: "スーパーで、カゴの前に候補が並んだら、最初に何を外す？",
      D06: "片付けを始める前に、候補が並んだら、最初に何を外す？",
      D13: "予定が少し動いたあと、候補が並んだら、最初に何を外す？",
      D14: "少し刺さった日のあと、候補が並んだら、最初に何を外す？",
      D18: "距離を少し測り直したい日に、候補が並んだら、最初に何を外す？",
      D19: "安心材料を先に集めたいとき、候補が並んだら、最初に何を外す？",
      D20: "先送りするか、今決めるかで止まったとき、最初に何を外す？",
      D21: "動くか様子を見るか迷うとき、候補が並んだら、最初に何を外す？",
    },
    helperSuffix: "選ぶ圧がかかったときの軽くし方に、いちばん近いものを直感で1つ。",
    helperSuffixByDimension: {
      D02: "玄関での保留のほどき方に、いちばん近いものを直感で1つ。",
      D04: "買い物前の選び方に、いちばん近いものを直感で1つ。",
      D06: "片付け前の選び方に、いちばん近いものを直感で1つ。",
      D13: "予定ズレ後の選び方に、いちばん近いものを直感で1つ。",
      D14: "気まずさの整理の仕方に、いちばん近いものを直感で1つ。",
      D18: "距離を整える選び方に、いちばん近いものを直感で1つ。",
      D19: "安心前の選び方に、いちばん近いものを直感で1つ。",
      D20: "決めどきの保留のほどき方に、いちばん近いものを直感で1つ。",
      D21: "一歩手前の選び方に、いちばん近いものを直感で1つ。",
    },
    optionSet: [
      { id: "A", label: "一番軽い候補から外す", signal: "軽量化" },
      { id: "B", label: "数字や条件で比べる", signal: "条件比較" },
      { id: "C", label: "人に聞いてから残す", signal: "相談決定" },
      { id: "D", label: "ひとつだけ試して残す", signal: "試行選択" },
      { id: "E", label: "今日は決めずに置く", signal: "持ち越し" },
    ],
  },
  travel_disruption: {
    key: "travel_disruption",
    family: "移動のズレ",
    familyByDimension: {
      D02: "玄関前の遅れ",
      D03: "通院後の動線",
      D13: "予定が動いた朝",
      D20: "遅れそうな移動",
    },
    sessionPosition: "middle",
    toneDepth: "light",
    personaHints: ["移動調整", "遅延耐性", "段取り変化"],
    questionSuffix: "予定や移動が少しずれたら、まず何を守る？",
    questionSuffixByDimension: {
      D02: "玄関で持ち物と時間が少し押し合うとき、まず何を守る？",
      D03: "通院のあとに買い物へ回る日、まず何を守る？",
      D13: "決めていた予定が少し動いた朝、まず何を守る？",
      D20: "電車が少し遅れそうな朝、まず何を守る？",
    },
    helperSuffix: "ズレたときの守り方に、いちばん近いものを直感で1つ。",
    helperSuffixByDimension: {
      D02: "玄関前のズレへの守り方に、いちばん近いものを直感で1つ。",
      D03: "通院後の動線の守り方に、いちばん近いものを直感で1つ。",
      D13: "予定が動いた朝の守り方に、いちばん近いものを直感で1つ。",
      D20: "遅れそうな朝の守り方に、いちばん近いものを直感で1つ。",
    },
    optionSet: [
      { id: "A", label: "時間を守る", signal: "時間優先" },
      { id: "B", label: "乗り換えを見直す", signal: "経路調整" },
      { id: "C", label: "荷物を軽くする", signal: "荷物軽量" },
      { id: "D", label: "連絡を先に入れる", signal: "先連絡" },
      { id: "E", label: "今日は別日に切り替える", signal: "延期" },
    ],
  },
  self_presentation: {
    key: "self_presentation",
    family: "見せ方の温度",
    sessionPosition: "middle",
    toneDepth: "witty",
    personaHints: ["見せ方", "写真", "投稿", "印象調整"],
    questionSuffix: "人に見せる自分を少し整えるなら、どこから？",
    helperSuffix: "見せ方の温度に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "服を整える", signal: "外見" },
      { id: "B", label: "言い方を整える", signal: "言葉" },
      { id: "C", label: "表情を整える", signal: "表情" },
      { id: "D", label: "写真や投稿を整える", signal: "発信" },
      { id: "E", label: "あまり盛らない", signal: "控えめ" },
    ],
  },
  support_receive: {
    key: "support_receive",
    family: "ねぎらいの受け取り方",
    familyByDimension: {
      D07: "帰り際のねぎらい",
      D11: "ひとり戻りの受け取り",
      D13: "予定ズレ後の声かけ",
      D14: "落ち込み後のひと言",
      D15: "仕事終わりのねぎらい",
      D18: "距離を戻す気づかい",
      D19: "安心前の気づかい",
    },
    sessionPosition: "middle",
    toneDepth: "quiet_returning",
    personaHints: ["受け取り方", "気づかい", "やわらかい境界"],
    questionSuffix: "やさしく気にかけられたとき、どう受ける？",
    questionSuffixByDimension: {
      D07: "帰り際に『今日助かった』と軽く言われたとき、どう受ける？",
      D11: "人と会ったあと、ひとりに戻ったところで『無理しないでね』と来たら、どう受ける？",
      D13: "予定が少し動いたあとに『大丈夫？』と気にかけられたら、どう受ける？",
      D14: "少し刺さった日の帰り道で、やさしく声をかけられたら、どう受ける？",
      D15: "仕事と家事が同時に押した日の帰り際に『今日助かった』と言われたら、どう受ける？",
      D18: "人との距離を少し測り直したい日に、やさしく気にかけられたら、どう受ける？",
      D19: "安心できる材料を先に集めたいときに、気にかけられたら、どう受ける？",
    },
    helperSuffix: "支えを受けるときの温度に、いちばん近いものを直感で1つ。",
    helperSuffixByDimension: {
      D07: "そのひと言の受け取り方に、いちばん近いものを直感で1つ。",
      D11: "ひとりに戻るときの受け取り方に、いちばん近いものを直感で1つ。",
      D13: "予定が動いたあとでの受け取り方に、いちばん近いものを直感で1つ。",
      D14: "落ち込み後の受け取り方に、いちばん近いものを直感で1つ。",
      D15: "仕事終わりの受け取り方に、いちばん近いものを直感で1つ。",
      D18: "距離を戻すときの受け取り方に、いちばん近いものを直感で1つ。",
      D19: "安心前の受け取り方に、いちばん近いものを直感で1つ。",
    },
    optionSet: [
      { id: "A", label: "素直に『助かった』と返す", signal: "素直受け" },
      { id: "B", label: "笑って流しておく", signal: "照れ流し" },
      { id: "C", label: "先にお礼を返す", signal: "感謝先行" },
      { id: "D", label: "あとで一人で噛む", signal: "後で味わう" },
      { id: "E", label: "少しだけ距離を置く", signal: "緩衝" },
    ],
  },
  quiet_ambition: {
    key: "quiet_ambition",
    family: "静かな上昇",
    sessionPosition: "closer",
    toneDepth: "light_plus",
    personaHints: ["静かな向上", "継続型", "内側の推進"],
    questionSuffix: "静かに進めたいことがある夜、どれが近い？",
    helperSuffix: "自分のペースを守る進め方に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "毎日少し進める", signal: "積み上げ" },
      { id: "B", label: "人に言わず進める", signal: "秘匿進行" },
      { id: "C", label: "期限だけ決める", signal: "期限固定" },
      { id: "D", label: "気が向く日に動く", signal: "気分駆動" },
      { id: "E", label: "いまは温める", signal: "温存" },
    ],
  },
  family_obligation: {
    key: "family_obligation",
    family: "家族への一声",
    sessionPosition: "middle",
    toneDepth: "light_plus",
    personaHints: ["家族相談", "生活調整", "身内優先"],
    questionSuffix: "家族に一声入れる場面なら、いちばん近いのは？",
    helperSuffix: "家の中での相談の出し方に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "先に相談する", signal: "先相談" },
      { id: "B", label: "要点だけ伝える", signal: "要点" },
      { id: "C", label: "相手の都合を聞く", signal: "都合確認" },
      { id: "D", label: "あとでまとめて話す", signal: "後話" },
      { id: "E", label: "今回は自分で決める", signal: "自決" },
    ],
  },
  shopping_priority: {
    key: "shopping_priority",
    family: "買い物の優先付け",
    sessionPosition: "middle",
    toneDepth: "light",
    personaHints: ["生活実務", "買い物", "優先順"],
    questionSuffix: "スーパーで、先にカゴに入れたくなるのは？",
    helperSuffix: "買い物の優先順に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "今日すぐ使うもの", signal: "即日使用" },
      { id: "B", label: "足りないもの", signal: "不足補充" },
      { id: "C", label: "気分が上がるもの", signal: "気分優先" },
      { id: "D", label: "家族向けのもの", signal: "家族配慮" },
      { id: "E", label: "今回は見送る", signal: "見送り" },
    ],
  },
  rain_move: {
    key: "rain_move",
    family: "雨の日の移動",
    sessionPosition: "middle",
    toneDepth: "light",
    personaHints: ["天候調整", "慎重型", "負担回避"],
    questionSuffix: "雨の日の外出で、いちばん気になるのは？",
    helperSuffix: "雨の日の気がかりに、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "足元", signal: "滑り注意" },
      { id: "B", label: "荷物", signal: "荷物負担" },
      { id: "C", label: "傘で手がふさがること", signal: "手塞がり" },
      { id: "D", label: "帰りやすさ", signal: "撤収優先" },
      { id: "E", label: "今日は出ない", signal: "回避" },
    ],
  },
  tidying: {
    key: "tidying",
    family: "片付けと収納",
    sessionPosition: "middle",
    toneDepth: "light_plus",
    personaHints: ["整理", "視界", "置き場"],
    questionSuffix: "片付けを始めるなら、いちばん自然なのは？",
    helperSuffix: "片付けの最初の一手に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "見える場所から消す", signal: "視界整理" },
      { id: "B", label: "使う順に並べる", signal: "順番整備" },
      { id: "C", label: "収納場所を先に決める", signal: "場所先決め" },
      { id: "D", label: "人に見られる前に整える", signal: "対人整え" },
      { id: "E", label: "今日は半分だけやる", signal: "部分完了" },
    ],
  },
  home_safety: {
    key: "home_safety",
    family: "家の中の安全確認",
    sessionPosition: "middle",
    toneDepth: "light_plus",
    personaHints: ["安全優先", "先回り", "慎重型"],
    questionSuffix: "家の中で先に気になるのは？",
    helperSuffix: "家の中の安全に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "床のすべり", signal: "床注意" },
      { id: "B", label: "段差やマット", signal: "段差注意" },
      { id: "C", label: "手すりや支え", signal: "支え確認" },
      { id: "D", label: "夜の暗さ", signal: "照明注意" },
      { id: "E", label: "ひとまず現状維持", signal: "現状維持" },
    ],
  },
  threshold_step: {
    key: "threshold_step",
    family: "段差・階段・玄関",
    sessionPosition: "middle",
    toneDepth: "light",
    personaHints: ["段差", "慎重型", "現実調整"],
    questionSuffix: "出入りでいちばん引っかかるのは？",
    helperSuffix: "玄関まわりの引っかかりに、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "玄関の上がり下がり", signal: "玄関段差" },
      { id: "B", label: "階段の上り下り", signal: "階段負荷" },
      { id: "C", label: "ドアの開け閉め", signal: "動作負担" },
      { id: "D", label: "荷物を持ったまま動くこと", signal: "荷物同時" },
      { id: "E", label: "今日は出入り回数を減らしたい", signal: "回数抑制" },
    ],
  },
  plan_change: {
    key: "plan_change",
    family: "予定変更への耐性",
    sessionPosition: "middle",
    toneDepth: "light_plus",
    personaHints: ["予定変更", "柔軟性", "調整型"],
    questionSuffix: "予定がずれたら、最初に整えるのは？",
    helperSuffix: "ずれた瞬間の組み直し方に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "すぐ組み直す", signal: "即調整" },
      { id: "B", label: "前後を見直す", signal: "前後確認" },
      { id: "C", label: "人に一言入れる", signal: "連絡先行" },
      { id: "D", label: "少し様子を見る", signal: "静観" },
      { id: "E", label: "今日は切り替える", signal: "切替" },
    ],
  },
  reward_choice: {
    key: "reward_choice",
    family: "小さなご褒美",
    sessionPosition: "closer",
    toneDepth: "light_plus",
    personaHints: ["ご褒美", "気分転換", "自分ケア"],
    questionSuffix: "小さなご褒美をひとつ選ぶとき、いちばん近いのは？",
    helperSuffix: "ご褒美の選び方に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "おいしいものを少し食べる", signal: "食のご褒美" },
      { id: "B", label: "早めにひとり時間を取る", signal: "余白ご褒美" },
      { id: "C", label: "好きな音楽を流す", signal: "音のご褒美" },
      { id: "D", label: "何もしない時間を作る", signal: "休息ご褒美" },
      { id: "E", label: "今日はご褒美なしで寝る", signal: "省エネ" },
    ],
  },
  weekend_flow: {
    key: "weekend_flow",
    family: "週末の過ごし方",
    sessionPosition: "closer",
    toneDepth: "light",
    personaHints: ["週末感覚", "余白重視", "気分転換"],
    questionSuffix: "週末の空気として、いちばん近いのは？",
    helperSuffix: "いつもの週末の動き方に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "予定を少し入れる", signal: "軽い予定" },
      { id: "B", label: "家で整える", signal: "家整え" },
      { id: "C", label: "近場で気分転換する", signal: "近場転換" },
      { id: "D", label: "友だちと会う", signal: "対人週末" },
      { id: "E", label: "流れに任せる", signal: "流動" },
    ],
  },
  reassurance: {
    key: "reassurance",
    family: "安心材料の集め方",
    sessionPosition: "middle",
    toneDepth: "quiet",
    personaHints: ["確認型", "備え重視", "安心優先"],
    questionSuffix: "安心できる材料を先に集めたいとき、どうする？",
    helperSuffix: "安心の集め方に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "確認メモを見返す", signal: "再確認" },
      { id: "B", label: "一回だけ人に聞く", signal: "単発確認" },
      { id: "C", label: "余裕を多めに取る", signal: "バッファ" },
      { id: "D", label: "代替案を持つ", signal: "予備案" },
      { id: "E", label: "十分ならそのまま進む", signal: "即進行" },
    ],
  },
  delay_decision: {
    key: "delay_decision",
    family: "先送り/決断の癖",
    sessionPosition: "middle",
    toneDepth: "light_plus",
    personaHints: ["保留管理", "慎重型", "判断の癖"],
    questionSuffix: "先送りするか、今決めるかで手が止まるとき、どうする？",
    helperSuffix: "決める前の止まり方に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "今すぐ決める", signal: "即決" },
      { id: "B", label: "少しだけ置く", signal: "短期保留" },
      { id: "C", label: "人に聞いてから決める", signal: "相談決定" },
      { id: "D", label: "紙やメモに残す", signal: "外部化" },
      { id: "E", label: "今日は決めない", signal: "完全保留" },
    ],
  },
  move_vs_watch: {
    key: "move_vs_watch",
    family: "動く vs 様子を見る",
    sessionPosition: "middle",
    toneDepth: "light_plus",
    personaHints: ["行動派", "様子見", "判断保留"],
    questionSuffix: "動くか、もう少し様子を見るか迷うとき、どっち寄り？",
    helperSuffix: "動くか様子を見るかの間合いに、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "すぐ動く", signal: "即動" },
      { id: "B", label: "少し様子を見る", signal: "短観察" },
      { id: "C", label: "誰かの反応を待つ", signal: "反応待ち" },
      { id: "D", label: "小さく試してみる", signal: "試行" },
      { id: "E", label: "今日は見送る", signal: "保留" },
    ],
  },
  evening_energy: {
    key: "evening_energy",
    family: "夜の気力",
    sessionPosition: "closer",
    toneDepth: "quiet_returning",
    personaHints: ["夜型", "残り気力", "省エネ"],
    questionSuffix: "夜の残り電池がまだあるなら、どこに使う？",
    helperSuffix: "夜の残り方に、いちばん近いものを直感で1つ。",
    optionSet: [
      { id: "A", label: "もう少し家事を進める", signal: "夜稼働" },
      { id: "B", label: "必要な連絡だけ返す", signal: "要点返答" },
      { id: "C", label: "先に休みモードに入る", signal: "休息先行" },
      { id: "D", label: "明日の準備だけする", signal: "前倒し準備" },
      { id: "E", label: "今日はもう止める", signal: "完全停止" },
    ],
  },
};

const DIMENSIONS: DimensionBlueprint[] = CANONICAL_DTE_DIMENSIONS.map((dimension) => ({
  dimensionId: dimension.dimensionId,
  dimensionLabel: dimension.nameJa,
  sceneIntro: {
    D01: "朝いちで気持ちがまだ立ち上がりきっていないとき",
    D02: "玄関で持ち物と時間が少し押し合うとき",
    D03: "通院のあとに、そのまま買い物へ回るとき",
    D04: "スーパーで、カゴに何を先に入れるか迷うとき",
    D05: "雨が降って、外へ出るか少し止まるか迷うとき",
    D06: "見える場所が少し散らかって、片付けを始めるか迷うとき",
    D07: "家の中の小さな危なさが目につくとき",
    D08: "玄関や階段みたいな段差をまたぐとき",
    D09: "既読や返事の間で、LINEの温度を測るとき",
    D10: "家族に一声だけ相談したいことがあるとき",
    D11: "人と会ったあと、ひとりに戻りたいとき",
    D12: "夜になって、もうどこまで動けるか見えるとき",
    D13: "決めていた予定が少し動いたとき",
    D14: "小さく失敗した日を、そのまま引きずりたくないとき",
    D15: "仕事と家事が同時に押してくるとき",
    D16: "いつもの週末をどう過ごすか決めるとき",
    D17: "小さなご褒美をひとつ選ぶとき",
    D18: "人との距離を、少しだけ測り直したいとき",
    D19: "安心できる材料を先に集めたいとき",
    D20: "先送りするか、今決めるかで手が止まるとき",
    D21: "動くか、もう少し様子を見るか迷うとき",
  }[dimension.dimensionId] || `${dimension.nameJa}の場面で`,
  calibrationNotes: dimension.scoringNotes,
  packKeys: {
    D01: ["morning_start", "line_delay", "choice_overload", "self_presentation", "solitude_reset", "quiet_ambition"],
    D02: ["threshold_step", "plan_change", "family_obligation", "line_delay", "choice_overload", "travel_disruption"],
    D03: ["travel_disruption", "shopping_priority", "family_obligation", "work_pressure", "reward_choice", "plan_change"],
    D04: ["shopping_priority", "money_reciprocity", "choice_overload", "reward_choice", "family_obligation", "quiet_ambition"],
    D05: ["rain_move", "travel_disruption", "choice_overload", "solitude_reset", "plan_change", "reward_choice"],
    D06: ["tidying", "home_safety", "choice_overload", "quiet_ambition", "solitude_reset", "work_pressure"],
    D07: ["home_safety", "threshold_step", "solitude_reset", "support_receive", "reassurance", "family_obligation"],
    D08: ["threshold_step", "travel_disruption", "rain_move", "home_safety", "choice_overload", "support_receive"],
    D09: ["line_delay", "group_atmosphere", "friend_closeness", "support_receive", "choice_overload", "self_presentation"],
    D10: ["family_obligation", "support_receive", "line_delay", "choice_overload", "money_reciprocity", "plan_change"],
    D11: ["solitude_reset", "support_receive", "reward_choice", "quiet_ambition", "evening_energy", "embarrassment_recovery"],
    D12: ["evening_energy", "solitude_reset", "reward_choice", "line_delay", "support_receive", "quiet_ambition"],
    D13: ["plan_change", "travel_disruption", "choice_overload", "line_delay", "support_receive", "reassurance"],
    D14: ["embarrassment_recovery", "solitude_reset", "reward_choice", "support_receive", "choice_overload", "quiet_ambition"],
    D15: ["work_pressure", "choice_overload", "plan_change", "evening_energy", "tidying", "support_receive"],
    D16: ["weekend_flow", "reward_choice", "solitude_reset", "friend_closeness", "plan_change", "self_presentation"],
    D17: ["reward_choice", "money_reciprocity", "self_presentation", "quiet_ambition", "choice_overload", "support_receive"],
    D18: ["group_atmosphere", "line_delay", "friend_closeness", "self_presentation", "support_receive", "choice_overload"],
    D19: ["reassurance", "support_receive", "plan_change", "choice_overload", "family_obligation", "quiet_ambition"],
    D20: ["choice_overload", "plan_change", "delay_decision", "quiet_ambition", "line_delay", "travel_disruption"],
    D21: ["move_vs_watch", "choice_overload", "plan_change", "work_pressure", "line_delay", "delay_decision"],
  }[dimension.dimensionId] || ["choice_overload", "support_receive", "plan_change", "quiet_ambition", "solitude_reset", "reward_choice"],
  personaHints: {
    D01: ["朝型", "初速重視", "段取り型"],
    D02: ["段取り型", "現実調整", "忘れ物回避"],
    D03: ["実務型", "切替型", "体力優先"],
    D04: ["生活実務", "気分回復", "優先順重視"],
    D05: ["慎重型", "負担回避", "天候調整"],
    D06: ["整理型", "見た目整え", "置き場重視"],
    D07: ["安全優先", "先回り", "慎重型"],
    D08: ["慎重型", "現実調整", "移動感覚"],
    D09: ["LINE重視", "温度感重視", "気配読み"],
    D10: ["家族相談", "生活調整", "身内優先"],
    D11: ["ひとり時間", "回復優先", "静けさ重視"],
    D12: ["夜型", "残り気力", "省エネ"],
    D13: ["予定変更", "柔軟性", "調整型"],
    D14: ["照れ", "立て直し", "切替型"],
    D15: ["実務型", "並行処理", "段取り型"],
    D16: ["週末感覚", "余白重視", "気分転換"],
    D17: ["ご褒美", "気分転換", "自分ケア"],
    D18: ["距離感", "空気読み", "境界調整"],
    D19: ["安心材料", "確認型", "備え重視"],
    D20: ["決断癖", "保留管理", "慎重型"],
    D21: ["行動派", "様子見", "判断保留"],
  }[dimension.dimensionId] || ["生活実務", "気配読み", "調整型"],
}));

function buildQuestionQuestionStem(dimension: DimensionBlueprint, pack: ScenarioPack) {
  return `${dimension.sceneIntro}。${pack.questionSuffixByDimension?.[dimension.dimensionId] || pack.questionSuffix}`;
}

function buildQuestionHelperText(_dimension: DimensionBlueprint, pack: ScenarioPack) {
  return pack.helperSuffixByDimension?.[_dimension.dimensionId] || pack.helperSuffix;
}

function resolvePackFamily(dimensionId: string, pack: ScenarioPack) {
  return pack.familyByDimension?.[dimensionId] || pack.family;
}

function buildQuestionId(dimensionId: string, packKey: string, index: number) {
  return `V2-${dimensionId}-${String(index + 1).padStart(2, "0")}-${packKey.slice(0, 2).toUpperCase()}`;
}

export function buildQuestionPoolV2() {
  const items: QuestionPoolSourceQuestion[] = [];
  const sessionOrder: QuestionPoolSessionOrderItem[] = [];

  for (const dimension of DIMENSIONS) {
    const packKeys = dimension.packKeys;
    for (const [index, packKey] of packKeys.entries()) {
      const pack = PACKS[packKey];
      if (!pack) {
        throw new Error(`missing_pack_definition:${packKey}`);
      }
      const candidateId = buildQuestionId(dimension.dimensionId, pack.key, index);
      const question = buildQuestionQuestionStem(dimension, pack);
      const helperText = buildQuestionHelperText(dimension, pack);
      items.push({
        candidate_id: candidateId,
        dimension_id: dimension.dimensionId,
        dimension_label: dimension.dimensionLabel,
        pool: "live_rotation",
        scenario_family: resolvePackFamily(dimension.dimensionId, pack),
        session_position: pack.sessionPosition,
        tone_depth: pack.toneDepth,
        persona_fit_hint: [...new Set([...dimension.personaHints, ...pack.personaHints])],
        question,
        helper_text: helperText,
        options: pack.optionSet.map((option) => ({ ...option })),
        calibration_notes: `${dimension.calibrationNotes} / ${pack.key}`,
      });
      sessionOrder.push({
        q: sessionOrder.length + 1,
        item_id: candidateId,
        dimension_id: dimension.dimensionId,
      });
    }
  }

  return {
    metadata: METADATA,
    items,
    sessionOrder,
    dimensionBlueprints: DIMENSIONS,
    packs: PACKS,
  };
}

export const QUESTION_POOL_V2 = buildQuestionPoolV2();
export const QUESTION_POOL_V2_ITEMS = QUESTION_POOL_V2.items;
export const QUESTION_POOL_V2_SESSION_ORDER = QUESTION_POOL_V2.sessionOrder;
export const QUESTION_POOL_V2_METADATA = QUESTION_POOL_V2.metadata;
export const QUESTION_POOL_V2_DIMENSIONS = QUESTION_POOL_V2.dimensionBlueprints;
export const QUESTION_POOL_V2_PACKS = QUESTION_POOL_V2.packs;
