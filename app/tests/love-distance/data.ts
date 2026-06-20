export const MODULE_VERSION = "love_distance_mvp_v0_1" as const;

export type Dimension =
  | "L1_SELF_CLARITY"
  | "L2_DISTANCE_PRESSURE"
  | "L3_WAITING_LOAD"
  | "L4_COMMUNICATION_READINESS"
  | "L5_BOUNDARY_STABILITY"
  | "L6_RECOVERY_ORIENTATION";

export type ArchetypeId =
  | "LD_WAITING_OVERLOAD"
  | "LD_TOO_CLOSE_TOO_FAST"
  | "LD_GENTLE_DISTANCE_NEEDED"
  | "LD_UNSPOKEN_FEELINGS"
  | "LD_BOUNDARY_REBUILD"
  | "LD_READY_FOR_SMALL_CONVERSATION"
  | "LD_MIXED_UNSETTLED";

export type Tag = { dim: Dimension | "repeated_check_signal" | "unsafe_pressure_signal"; pts: number };
export type LDOption = { id: string; label: string; tags: readonly Tag[] };
export type LDQuestion = { id: string; section: string; prompt: string; options: readonly LDOption[] };
export type Archetype = {
  id: ArchetypeId;
  name: string;
  title: string;
  body: string;
  insight: string;
  distanceHint: string;
  waitingHint: string;
  communicationHint: string;
  nextStep: string;
  reportTeaser: string;
};
export type AnswerMap = Record<string, string>;
export type DimScores = Record<Dimension, number>;
export type LDResult = {
  archetypeId: ArchetypeId;
  archetype: Archetype;
  scores: DimScores;
  repeatedCheckCount: number;
  unsafePressureCount: number;
};

const S1 = "セクション1：今の距離感を見る";
const S2 = "セクション2：待ち方と伝え方を見る";
const S3 = "セクション3：小さな次の一歩を見る";

export const LD_QUESTIONS: readonly LDQuestion[] = [
  {
    id: "LD_Q01",
    section: S1,
    prompt: "気になる人との距離が近づいたとき、今の自分に近いのは？",
    options: [
      { id: "a", label: "うれしいけれど、少し構えてしまう", tags: [{ dim: "L2_DISTANCE_PRESSURE", pts: 3 }, { dim: "L1_SELF_CLARITY", pts: 1 }] },
      { id: "b", label: "もっと知りたくなる", tags: [{ dim: "L4_COMMUNICATION_READINESS", pts: 2 }] },
      { id: "c", label: "相手のペースに合わせやすい", tags: [{ dim: "L2_DISTANCE_PRESSURE", pts: 3 }, { dim: "L5_BOUNDARY_STABILITY", pts: 1 }] },
      { id: "d", label: "一度、自分の気持ちを確認したい", tags: [{ dim: "L1_SELF_CLARITY", pts: 3 }, { dim: "L6_RECOVERY_ORIENTATION", pts: 1 }] },
    ],
  },
  {
    id: "LD_Q02",
    section: S1,
    prompt: "返信を待っている時間、起こりやすいことは？",
    options: [
      { id: "a", label: "何度も画面を見てしまう", tags: [{ dim: "L3_WAITING_LOAD", pts: 3 }, { dim: "repeated_check_signal", pts: 1 }] },
      { id: "b", label: "相手の事情を考えすぎる", tags: [{ dim: "L3_WAITING_LOAD", pts: 3 }, { dim: "L1_SELF_CLARITY", pts: 1 }] },
      { id: "c", label: "自分の時間に戻れる", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 2 }, { dim: "L6_RECOVERY_ORIENTATION", pts: 1 }] },
      { id: "d", label: "返事の内容より温度感が気になる", tags: [{ dim: "L3_WAITING_LOAD", pts: 3 }, { dim: "L2_DISTANCE_PRESSURE", pts: 1 }] },
    ],
  },
  {
    id: "LD_Q03",
    section: S1,
    prompt: "今の気持ちを言葉にするとしたら？",
    options: [
      { id: "a", label: "近づきたいけれど、少し不安", tags: [{ dim: "L1_SELF_CLARITY", pts: 3 }, { dim: "L2_DISTANCE_PRESSURE", pts: 1 }] },
      { id: "b", label: "待っている時間が重い", tags: [{ dim: "L3_WAITING_LOAD", pts: 3 }] },
      { id: "c", label: "相手より先に、自分を整えたい", tags: [{ dim: "L6_RECOVERY_ORIENTATION", pts: 3 }] },
      { id: "d", label: "今はまだ決めきれない", tags: [{ dim: "L1_SELF_CLARITY", pts: 3 }] },
    ],
  },
  {
    id: "LD_Q04",
    section: S1,
    prompt: "相手の予定や返事に合わせすぎたあと、感じやすいのは？",
    options: [
      { id: "a", label: "少し疲れた", tags: [{ dim: "L2_DISTANCE_PRESSURE", pts: 3 }, { dim: "L6_RECOVERY_ORIENTATION", pts: 1 }] },
      { id: "b", label: "嫌われていないか気になる", tags: [{ dim: "L3_WAITING_LOAD", pts: 3 }] },
      { id: "c", label: "自分のペースが分からなくなる", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 3 }, { dim: "L1_SELF_CLARITY", pts: 1 }] },
      { id: "d", label: "次は少し余白を持ちたい", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 2 }, { dim: "L6_RECOVERY_ORIENTATION", pts: 1 }] },
    ],
  },
  {
    id: "LD_Q05",
    section: S1,
    prompt: "距離が近すぎるかも、と感じるのはどんなとき？",
    options: [
      { id: "a", label: "返事や予定が中心になっているとき", tags: [{ dim: "L2_DISTANCE_PRESSURE", pts: 3 }, { dim: "L3_WAITING_LOAD", pts: 1 }] },
      { id: "b", label: "自分の時間が減っているとき", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 3 }] },
      { id: "c", label: "気持ちを急いで決めようとしているとき", tags: [{ dim: "L1_SELF_CLARITY", pts: 2 }, { dim: "L2_DISTANCE_PRESSURE", pts: 1 }] },
      { id: "d", label: "近すぎるとはあまり感じない", tags: [{ dim: "L4_COMMUNICATION_READINESS", pts: 2 }] },
    ],
  },
  {
    id: "LD_Q06",
    section: S1,
    prompt: "気持ちが揺れたとき、落ち着きやすいのは？",
    options: [
      { id: "a", label: "少し時間を置く", tags: [{ dim: "L6_RECOVERY_ORIENTATION", pts: 3 }] },
      { id: "b", label: "短くメモする", tags: [{ dim: "L1_SELF_CLARITY", pts: 2 }, { dim: "L6_RECOVERY_ORIENTATION", pts: 1 }] },
      { id: "c", label: "信頼できる人に少し話す", tags: [{ dim: "L6_RECOVERY_ORIENTATION", pts: 3 }] },
      { id: "d", label: "すぐ相手に確認したくなる", tags: [{ dim: "L3_WAITING_LOAD", pts: 3 }, { dim: "repeated_check_signal", pts: 1 }] },
    ],
  },
  {
    id: "LD_Q07",
    section: S2,
    prompt: "何かを伝える前に、あると助かるものは？",
    options: [
      { id: "a", label: "自分の気持ちを一文にする時間", tags: [{ dim: "L1_SELF_CLARITY", pts: 3 }, { dim: "L4_COMMUNICATION_READINESS", pts: 1 }] },
      { id: "b", label: "相手の反応を考えすぎない余白", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 3 }] },
      { id: "c", label: "今すぐ送らない選択肢", tags: [{ dim: "L6_RECOVERY_ORIENTATION", pts: 3 }] },
      { id: "d", label: "短く伝える言葉", tags: [{ dim: "L4_COMMUNICATION_READINESS", pts: 3 }] },
    ],
  },
  {
    id: "LD_Q08",
    section: S2,
    prompt: "相手からの反応が読めないとき、近い反応は？",
    options: [
      { id: "a", label: "理由を探し続けてしまう", tags: [{ dim: "L3_WAITING_LOAD", pts: 3 }, { dim: "repeated_check_signal", pts: 1 }] },
      { id: "b", label: "少し距離を置いて整えたい", tags: [{ dim: "L6_RECOVERY_ORIENTATION", pts: 3 }] },
      { id: "c", label: "自分の予定に戻るようにする", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 2 }, { dim: "L6_RECOVERY_ORIENTATION", pts: 1 }] },
      { id: "d", label: "相手に何度も確認したくなる", tags: [{ dim: "L3_WAITING_LOAD", pts: 3 }, { dim: "unsafe_pressure_signal", pts: 1 }] },
    ],
  },
  {
    id: "LD_Q09",
    section: S2,
    prompt: "今、整理したいのはどれに近い？",
    options: [
      { id: "a", label: "自分がどれくらい近づきたいか", tags: [{ dim: "L1_SELF_CLARITY", pts: 3 }] },
      { id: "b", label: "待っている間の不安", tags: [{ dim: "L3_WAITING_LOAD", pts: 3 }] },
      { id: "c", label: "自分のペースの守り方", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 3 }] },
      { id: "d", label: "伝える前に整えること", tags: [{ dim: "L4_COMMUNICATION_READINESS", pts: 3 }] },
    ],
  },
  {
    id: "LD_Q10",
    section: S2,
    prompt: "連絡したい気持ちが強いとき、今の自分に必要なのは？",
    options: [
      { id: "a", label: "送る前に少し時間を置く", tags: [{ dim: "L6_RECOVERY_ORIENTATION", pts: 3 }, { dim: "L5_BOUNDARY_STABILITY", pts: 1 }] },
      { id: "b", label: "言いたいことを短くする", tags: [{ dim: "L4_COMMUNICATION_READINESS", pts: 3 }] },
      { id: "c", label: "相手の反応で一日を決めないこと", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 3 }] },
      { id: "d", label: "何度も送って確認したい", tags: [{ dim: "L3_WAITING_LOAD", pts: 3 }, { dim: "unsafe_pressure_signal", pts: 1 }] },
    ],
  },
  {
    id: "LD_Q11",
    section: S2,
    prompt: "伝えるなら、今いちばん安全そうなのは？",
    options: [
      { id: "a", label: "気持ちを全部ではなく少しだけ伝える", tags: [{ dim: "L4_COMMUNICATION_READINESS", pts: 3 }] },
      { id: "b", label: "今日は送らず、明日見直す", tags: [{ dim: "L6_RECOVERY_ORIENTATION", pts: 3 }] },
      { id: "c", label: "相手に答えを急がせない言い方にする", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 3 }, { dim: "L4_COMMUNICATION_READINESS", pts: 1 }] },
      { id: "d", label: "まだ言葉にしない", tags: [{ dim: "L1_SELF_CLARITY", pts: 2 }, { dim: "L6_RECOVERY_ORIENTATION", pts: 1 }] },
    ],
  },
  {
    id: "LD_Q12",
    section: S2,
    prompt: "近づきたい気持ちと、自分の余白のバランスは？",
    options: [
      { id: "a", label: "近づきたい気持ちが強く、余白が少ない", tags: [{ dim: "L2_DISTANCE_PRESSURE", pts: 3 }] },
      { id: "b", label: "余白はほしいけれど、離れるのも不安", tags: [{ dim: "L2_DISTANCE_PRESSURE", pts: 3 }, { dim: "L3_WAITING_LOAD", pts: 1 }] },
      { id: "c", label: "少しずつなら近づける", tags: [{ dim: "L4_COMMUNICATION_READINESS", pts: 2 }] },
      { id: "d", label: "今は自分のペースを優先したい", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 3 }] },
    ],
  },
  {
    id: "LD_Q13",
    section: S3,
    prompt: "今、いちばん避けたいことは？",
    options: [
      { id: "a", label: "不安なまま急いで送ること", tags: [{ dim: "L6_RECOVERY_ORIENTATION", pts: 3 }] },
      { id: "b", label: "相手の反応だけで自分を決めること", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 3 }] },
      { id: "c", label: "気持ちを押し込めすぎること", tags: [{ dim: "L1_SELF_CLARITY", pts: 3 }] },
      { id: "d", label: "同じことを何度も確認すること", tags: [{ dim: "L3_WAITING_LOAD", pts: 3 }, { dim: "repeated_check_signal", pts: 1 }] },
    ],
  },
  {
    id: "LD_Q14",
    section: S3,
    prompt: "自分の気持ちを一言にするとしたら？",
    options: [
      { id: "a", label: "近づきたい", tags: [{ dim: "L1_SELF_CLARITY", pts: 2 }, { dim: "L4_COMMUNICATION_READINESS", pts: 1 }] },
      { id: "b", label: "待つのが少し重い", tags: [{ dim: "L3_WAITING_LOAD", pts: 3 }] },
      { id: "c", label: "急がず整えたい", tags: [{ dim: "L6_RECOVERY_ORIENTATION", pts: 3 }] },
      { id: "d", label: "距離を見直したい", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 3 }] },
    ],
  },
  {
    id: "LD_Q15",
    section: S3,
    prompt: "次にできそうな小さな選択肢は？",
    options: [
      { id: "a", label: "今日は送らず、気持ちをメモする", tags: [{ dim: "L6_RECOVERY_ORIENTATION", pts: 3 }, { dim: "L1_SELF_CLARITY", pts: 1 }] },
      { id: "b", label: "短い言葉で伝える", tags: [{ dim: "L4_COMMUNICATION_READINESS", pts: 3 }] },
      { id: "c", label: "相手の返事を待つ時間を決める", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 3 }] },
      { id: "d", label: "自分の予定に戻る", tags: [{ dim: "L6_RECOVERY_ORIENTATION", pts: 3 }] },
    ],
  },
  {
    id: "LD_Q16",
    section: S3,
    prompt: "自分の安心を守るために、今できそうなのは？",
    options: [
      { id: "a", label: "確認したい気持ちを少し置く", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 3 }] },
      { id: "b", label: "相手の反応を急がせない", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 3 }, { dim: "L4_COMMUNICATION_READINESS", pts: 1 }] },
      { id: "c", label: "自分の時間を一つ入れる", tags: [{ dim: "L6_RECOVERY_ORIENTATION", pts: 3 }] },
      { id: "d", label: "何度も連絡して安心したい", tags: [{ dim: "L3_WAITING_LOAD", pts: 3 }, { dim: "unsafe_pressure_signal", pts: 1 }] },
    ],
  },
  {
    id: "LD_Q17",
    section: S3,
    prompt: "今の距離感に近い言葉は？",
    options: [
      { id: "a", label: "近づきたいけれど、少し待ちたい", tags: [{ dim: "L2_DISTANCE_PRESSURE", pts: 3 }, { dim: "L6_RECOVERY_ORIENTATION", pts: 1 }] },
      { id: "b", label: "近づく速さが少し早い", tags: [{ dim: "L2_DISTANCE_PRESSURE", pts: 3 }] },
      { id: "c", label: "言えない気持ちが残っている", tags: [{ dim: "L1_SELF_CLARITY", pts: 3 }, { dim: "L4_COMMUNICATION_READINESS", pts: 1 }] },
      { id: "d", label: "小さく話せる準備はある", tags: [{ dim: "L4_COMMUNICATION_READINESS", pts: 3 }] },
    ],
  },
  {
    id: "LD_Q18",
    section: S3,
    prompt: "このチェックのあと、いちばん大切にしたいことは？",
    options: [
      { id: "a", label: "すぐ答えを出さない", tags: [{ dim: "L6_RECOVERY_ORIENTATION", pts: 3 }] },
      { id: "b", label: "自分の気持ちを短く整理する", tags: [{ dim: "L1_SELF_CLARITY", pts: 3 }] },
      { id: "c", label: "相手を急がせない距離を保つ", tags: [{ dim: "L5_BOUNDARY_STABILITY", pts: 3 }] },
      { id: "d", label: "小さく伝える準備をする", tags: [{ dim: "L4_COMMUNICATION_READINESS", pts: 3 }] },
    ],
  },
];

export const LD_ARCHETYPES: Record<ArchetypeId, Archetype> = {
  LD_WAITING_OVERLOAD: {
    id: "LD_WAITING_OVERLOAD",
    name: "待つ時間が重くなりやすいタイプ",
    title: "待つ時間が重くなりやすいタイプ",
    body: "返事を待つ時間に気持ちが持っていかれやすい状態です。今は答えを急ぐより、自分の時間に戻る工夫が助けになりそうです。",
    insight: "待っている間、相手の反応を考える時間が長くなっているかもしれません。今見ているのは待つ時間の中で起きるあなた自身の負担です。",
    distanceHint: "返事が来るまでの間、自分の時間に一度戻る練習が助けになります。",
    waitingHint: "返事を見る時間を一度だけ決めると、待つ間の揺れが少し落ち着きやすくなります。",
    communicationHint: "伝える前に、今の気持ちを一文だけ書いてみることで言葉が整いやすくなります。",
    nextStep: "返事を見る時間を一度だけ決めて、それ以外の時間は自分の予定に戻ってみましょう。",
    reportTeaser: "待っている時間の重さと、自分の安心を戻す小さな方法を整理します。",
  },
  LD_TOO_CLOSE_TOO_FAST: {
    id: "LD_TOO_CLOSE_TOO_FAST",
    name: "近づく速さを見直したいタイプ",
    title: "近づく速さを見直したいタイプ",
    body: "近づきたい気持ちがある一方で、自分の余白が少し減りやすい状態です。",
    insight: "今は気持ちを弱める必要はありません。ただ、近づく速さを少しだけ整えることで、自分の安心を保ちやすくなります。",
    distanceHint: "近づきたい気持ちと自分の余白を、同時に大切にできる距離を見つけましょう。",
    waitingHint: "返事の速さより、自分のペースを一つ先に置くことで余白が戻りやすくなります。",
    communicationHint: "次の連絡や予定を決める前に、自分の時間を一つ先に置いてみましょう。",
    nextStep: "次の連絡や予定を決める前に、自分の時間を一つ先に置いてみましょう。",
    reportTeaser: "近づきたい気持ちと、自分の余白を両方守る距離感を整理します。",
  },
  LD_GENTLE_DISTANCE_NEEDED: {
    id: "LD_GENTLE_DISTANCE_NEEDED",
    name: "やさしい距離を置きたいタイプ",
    title: "やさしい距離を置きたいタイプ",
    body: "今はすぐに答えを出すより、少し落ち着いてから自分の気持ちを見た方がよさそうです。",
    insight: "距離を置くことは、相手を否定することとは限りません。今は、急いで動く前に自分の気持ちを戻す時間が必要なのかもしれません。",
    distanceHint: "今は近づく・離れるを決めるより、自分の気持ちを整える時間を優先しましょう。",
    waitingHint: "待つ負担より、今日は自分の安心を一つ取り戻すことが先になりそうです。",
    communicationHint: "送る前に一晩置いてみることで、言葉が少し落ち着きやすくなります。",
    nextStep: "今日は送らず、明日もう一度読み返すための一文を書いてみましょう。",
    reportTeaser: "行動する前に整えたい気持ちと、やさしい距離の取り方を整理します。",
  },
  LD_UNSPOKEN_FEELINGS: {
    id: "LD_UNSPOKEN_FEELINGS",
    name: "言葉にする前で止まっているタイプ",
    title: "言葉にする前で止まっているタイプ",
    body: "伝えたいことはありそうですが、今はまだ言葉を整えている途中の状態です。",
    insight: "気持ちを全部伝える前に、一文だけにしてみると扱いやすくなります。今必要なのは、相手に答えを出させる言葉ではなく、自分の感覚を丁寧に置く言葉です。",
    distanceHint: "近づきたい気持ちは本物ですが、言葉にするタイミングを少し整えると動きやすくなります。",
    waitingHint: "今は答えを待つより、自分の言葉を整えることに集中するとよさそうです。",
    communicationHint: "送る前提ではなく、まずは自分用に一文だけ書いてみましょう。",
    nextStep: "送る前提ではなく、まずは自分用に一文だけ書いてみましょう。",
    reportTeaser: "伝える前に整えたい気持ちと、急がない言葉の作り方を整理します。",
  },
  LD_BOUNDARY_REBUILD: {
    id: "LD_BOUNDARY_REBUILD",
    name: "自分の境界線を戻したいタイプ",
    title: "自分の境界線を戻したいタイプ",
    body: "相手との距離を考える前に、自分の時間や安心を少し戻すことが大切になりそうです。",
    insight: "相手に合わせることが続くと、自分のペースが見えにくくなります。今は、関係より「自分の生活に戻る感覚」を取り戻すことが先かもしれません。",
    distanceHint: "相手との距離より、自分の時間と安心を先に取り戻すことが助けになります。",
    waitingHint: "返事を待つより、自分の予定や好きなことに一度戻ることが安心を取り戻す入口です。",
    communicationHint: "伝える前に、自分の余白を一つ確保してから言葉を考えましょう。",
    nextStep: "相手の予定を考える前に、自分の予定を一つ入れてみましょう。",
    reportTeaser: "相手との距離より先に、自分の境界線を戻すヒントを整理します。",
  },
  LD_READY_FOR_SMALL_CONVERSATION: {
    id: "LD_READY_FOR_SMALL_CONVERSATION",
    name: "小さく話す準備があるタイプ",
    title: "小さく話す準備があるタイプ",
    body: "大きな結論ではなく、短い言葉なら少し伝えられそうな状態です。",
    insight: "今は、答えを求める言葉より、気持ちを少し共有する言葉が合いそうです。相手の反応を急がせない形にすると、自分の安心も守りやすくなります。",
    distanceHint: "今は大きな一歩より、短い言葉で少しだけ近づく方が自分の安心を保ちやすいです。",
    waitingHint: "返事を急がせない短い伝え方をすると、待つ負担も少し軽くなります。",
    communicationHint: "送るなら、相手に答えを急がせない短い一文にしてみましょう。",
    nextStep: "送るなら、相手に答えを急がせない短い一文にしてみましょう。",
    reportTeaser: "小さく伝える言葉と、相手を急がせない距離感を整理します。",
  },
  LD_MIXED_UNSETTLED: {
    id: "LD_MIXED_UNSETTLED",
    name: "いくつかの気持ちが重なっているタイプ",
    title: "いくつかの気持ちが重なっているタイプ",
    body: "今は、近づきたい気持ち、待つ負担、自分の余白が少しずつ重なっているようです。",
    insight: "ひとつの答えにまとめるより、今日は「近づきたい」「待つのが重い」「自分を戻したい」を分けて見る方がよさそうです。",
    distanceHint: "今は一つの距離感に決めるより、気持ちが重なっていることを認めるだけで十分です。",
    waitingHint: "待つ負担・近づきたさ・余白の必要性が重なっているので、今日は一つだけ整理できれば十分です。",
    communicationHint: "関係の答えを出さず、自分の気持ちを一文だけ書いてみましょう。",
    nextStep: "関係の答えを出さず、自分の気持ちを一文だけ書いてみましょう。",
    reportTeaser: "重なっている気持ちを、距離・待ち方・伝え方に分けて整理します。",
  },
};

const DIMS: Dimension[] = [
  "L1_SELF_CLARITY",
  "L2_DISTANCE_PRESSURE",
  "L3_WAITING_LOAD",
  "L4_COMMUNICATION_READINESS",
  "L5_BOUNDARY_STABILITY",
  "L6_RECOVERY_ORIENTATION",
];

export function computeLDResult(answers: AnswerMap): LDResult {
  const scores: DimScores = {
    L1_SELF_CLARITY: 0,
    L2_DISTANCE_PRESSURE: 0,
    L3_WAITING_LOAD: 0,
    L4_COMMUNICATION_READINESS: 0,
    L5_BOUNDARY_STABILITY: 0,
    L6_RECOVERY_ORIENTATION: 0,
  };
  let repeatedCheckCount = 0;
  let unsafePressureCount = 0;

  // Build option lookup
  const optLookup = new Map<string, LDOption>();
  for (const q of LD_QUESTIONS) {
    for (const o of q.options) {
      optLookup.set(`${q.id}:${o.id}`, o);
    }
  }

  for (const [qid, oid] of Object.entries(answers)) {
    const opt = optLookup.get(`${qid}:${oid}`);
    if (!opt) continue;
    for (const tag of opt.tags) {
      if (tag.dim === "repeated_check_signal") {
        repeatedCheckCount += tag.pts;
      } else if (tag.dim === "unsafe_pressure_signal") {
        unsafePressureCount += tag.pts;
      } else {
        scores[tag.dim as Dimension] += tag.pts;
      }
    }
  }

  // Sort dims by score descending
  const sorted = [...DIMS].sort((a, b) => scores[b] - scores[a]);
  const top = scores[sorted[0]];

  // Clustered check: top 3 within 8% of top → MIXED
  const within8 = sorted.filter((d) => top - scores[d] <= top * 0.08);
  if (within8.length >= 3) {
    return { archetypeId: "LD_MIXED_UNSETTLED", archetype: LD_ARCHETYPES.LD_MIXED_UNSETTLED, scores, repeatedCheckCount, unsafePressureCount };
  }

  // Dominant dim → archetype mapping
  const dominant = sorted[0];
  const second = sorted[1];

  let archetypeId: ArchetypeId;

  if (dominant === "L3_WAITING_LOAD") {
    archetypeId = "LD_WAITING_OVERLOAD";
  } else if (dominant === "L2_DISTANCE_PRESSURE" && scores["L5_BOUNDARY_STABILITY"] < scores["L2_DISTANCE_PRESSURE"] * 0.6) {
    archetypeId = "LD_TOO_CLOSE_TOO_FAST";
  } else if (dominant === "L6_RECOVERY_ORIENTATION") {
    archetypeId = "LD_GENTLE_DISTANCE_NEEDED";
  } else if (dominant === "L1_SELF_CLARITY") {
    archetypeId = "LD_UNSPOKEN_FEELINGS";
  } else if (dominant === "L5_BOUNDARY_STABILITY") {
    // L5 vs L4 tie-break: boundary wins
    archetypeId = "LD_BOUNDARY_REBUILD";
  } else if (dominant === "L4_COMMUNICATION_READINESS") {
    archetypeId = "LD_READY_FOR_SMALL_CONVERSATION";
  } else if (dominant === "L2_DISTANCE_PRESSURE") {
    // L2 high but L5 not low — treat as boundary rebuild
    archetypeId = "LD_BOUNDARY_REBUILD";
  } else {
    archetypeId = "LD_MIXED_UNSETTLED";
  }

  // L3 tie-break: if L3 ties with action-ready dim, choose waiting overload
  if (archetypeId !== "LD_WAITING_OVERLOAD" && second === "L3_WAITING_LOAD") {
    const gap = scores[dominant] - scores["L3_WAITING_LOAD"];
    if (gap <= 2) {
      archetypeId = "LD_WAITING_OVERLOAD";
    }
  }

  // L6 within 5% of top: note (already handled via L6 dominant path above)

  return {
    archetypeId,
    archetype: LD_ARCHETYPES[archetypeId],
    scores,
    repeatedCheckCount,
    unsafePressureCount,
  };
}
