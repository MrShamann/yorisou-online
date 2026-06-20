export const MODULE_VERSION = "relationship_fatigue_mvp_v0_1" as const;

export type Dimension =
  | "D1_CURRENT_ENERGY"
  | "D2_EMOTIONAL_CLARITY"
  | "D3_RELATIONSHIP_DISTANCE"
  | "D4_DECISION_POSTURE"
  | "D5_RECOVERY_STYLE"
  | "D6_NEXT_STEP_READINESS";

export type ArchetypeId =
  | "RF_REPLY_LOAD"
  | "RF_BOUNDARY_RESET"
  | "RF_SOCIAL_ENERGY_DRAIN"
  | "RF_AIR_READING_COMPARISON"
  | "RF_SMALL_CIRCLE_RECOVERY"
  | "RF_SMALL_ADJUSTMENT_READY"
  | "RF_MIXED_OVERLAP";

export type Tag = { dim: Dimension; pts: number };

export type RFOption = {
  id: string;
  label: string;
  tags: readonly Tag[];
};

export type RFQuestion = {
  id: string;
  section: string;
  prompt: string;
  options: readonly RFOption[];
};

export type Archetype = {
  id: ArchetypeId;
  name: string;
  title: string;
  body: string;
  insight: string;
  fatigueScene: string;
  boundaryHint: string;
  recoveryHint: string;
  nextStep: string;
  reportTeaser: string;
};

export const RF_QUESTIONS: readonly RFQuestion[] = [
  // Section 1: 今の負担を見る
  {
    id: "RF_Q01", section: "今の負担を見る",
    prompt: "最近、人と会ったあとに残りやすい感覚は？",
    options: [
      { id: "RF_Q01_A", label: "楽しかったけれど、あとでどっと疲れる", tags: [{dim:"D1_CURRENT_ENERGY",pts:3},{dim:"D5_RECOVERY_STYLE",pts:1}] },
      { id: "RF_Q01_B", label: "会う前から少し気が重い", tags: [{dim:"D1_CURRENT_ENERGY",pts:3},{dim:"D2_EMOTIONAL_CLARITY",pts:1}] },
      { id: "RF_Q01_C", label: "相手に合わせすぎた感じが残る", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3},{dim:"D1_CURRENT_ENERGY",pts:1}] },
      { id: "RF_Q01_D", label: "特に疲れは少ない", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  {
    id: "RF_Q02", section: "今の負担を見る",
    prompt: "返信がたまったとき、近い反応は？",
    options: [
      { id: "RF_Q02_A", label: "返さなきゃと思って重くなる", tags: [{dim:"D4_DECISION_POSTURE",pts:3},{dim:"D1_CURRENT_ENERGY",pts:1}] },
      { id: "RF_Q02_B", label: "内容を考えすぎる", tags: [{dim:"D4_DECISION_POSTURE",pts:3},{dim:"D2_EMOTIONAL_CLARITY",pts:1}] },
      { id: "RF_Q02_C", label: "後回しにして、さらに気になる", tags: [{dim:"D4_DECISION_POSTURE",pts:3}] },
      { id: "RF_Q02_D", label: "短く返せれば大丈夫", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  {
    id: "RF_Q03", section: "今の負担を見る",
    prompt: "誘いを断るとき、今の自分は？",
    options: [
      { id: "RF_Q03_A", label: "理由をたくさん考える", tags: [{dim:"D4_DECISION_POSTURE",pts:3}] },
      { id: "RF_Q03_B", label: "相手の反応が気になる", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3},{dim:"D2_EMOTIONAL_CLARITY",pts:1}] },
      { id: "RF_Q03_C", label: "断れずに行くことが多い", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3},{dim:"D1_CURRENT_ENERGY",pts:1}] },
      { id: "RF_Q03_D", label: "無理なら断れる方", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  {
    id: "RF_Q04", section: "今の負担を見る",
    prompt: "会話で疲れやすいのは？",
    options: [
      { id: "RF_Q04_A", label: "相手の気分を読もうとするとき", tags: [{dim:"D2_EMOTIONAL_CLARITY",pts:3},{dim:"D1_CURRENT_ENERGY",pts:1}] },
      { id: "RF_Q04_B", label: "自分の話を出すタイミングを探すとき", tags: [{dim:"D2_EMOTIONAL_CLARITY",pts:3},{dim:"D3_RELATIONSHIP_DISTANCE",pts:1}] },
      { id: "RF_Q04_C", label: "盛り上げようとするとき", tags: [{dim:"D1_CURRENT_ENERGY",pts:3}] },
      { id: "RF_Q04_D", label: "長時間続くとき", tags: [{dim:"D5_RECOVERY_STYLE",pts:3}] },
    ],
  },
  {
    id: "RF_Q05", section: "今の負担を見る",
    prompt: "SNSを見たあと、感じやすいことは？",
    options: [
      { id: "RF_Q05_A", label: "自分だけ遅れている気がする", tags: [{dim:"D2_EMOTIONAL_CLARITY",pts:3}] },
      { id: "RF_Q05_B", label: "人の近況で頭がいっぱいになる", tags: [{dim:"D1_CURRENT_ENERGY",pts:3},{dim:"D2_EMOTIONAL_CLARITY",pts:1}] },
      { id: "RF_Q05_C", label: "見なければよかったと思う", tags: [{dim:"D5_RECOVERY_STYLE",pts:3}] },
      { id: "RF_Q05_D", label: "情報を絞れば大丈夫", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  {
    id: "RF_Q06", section: "今の負担を見る",
    prompt: "人間関係で今ほしいものは？",
    options: [
      { id: "RF_Q06_A", label: "少し距離を置く時間", tags: [{dim:"D5_RECOVERY_STYLE",pts:3},{dim:"D3_RELATIONSHIP_DISTANCE",pts:1}] },
      { id: "RF_Q06_B", label: "気を使わない会話", tags: [{dim:"D5_RECOVERY_STYLE",pts:3}] },
      { id: "RF_Q06_C", label: "断っても大丈夫な安心感", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3}] },
      { id: "RF_Q06_D", label: "新しい関係のきっかけ", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  {
    id: "RF_Q07", section: "今の負担を見る",
    prompt: "頼まれごとが重なったとき、しやすいことは？",
    options: [
      { id: "RF_Q07_A", label: "自分の予定を後回しにする", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3},{dim:"D1_CURRENT_ENERGY",pts:1}] },
      { id: "RF_Q07_B", label: "できると言ってから苦しくなる", tags: [{dim:"D4_DECISION_POSTURE",pts:3},{dim:"D3_RELATIONSHIP_DISTANCE",pts:1}] },
      { id: "RF_Q07_C", label: "優先順位が分からなくなる", tags: [{dim:"D4_DECISION_POSTURE",pts:3},{dim:"D2_EMOTIONAL_CLARITY",pts:1}] },
      { id: "RF_Q07_D", label: "一度整理して返事したい", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2},{dim:"D4_DECISION_POSTURE",pts:1}] },
    ],
  },
  {
    id: "RF_Q08", section: "今の負担を見る",
    prompt: "人との距離を取るとき、気になるのは？",
    options: [
      { id: "RF_Q08_A", label: "嫌われないか", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3},{dim:"D2_EMOTIONAL_CLARITY",pts:1}] },
      { id: "RF_Q08_B", label: "冷たいと思われないか", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3}] },
      { id: "RF_Q08_C", label: "説明しないといけないか", tags: [{dim:"D4_DECISION_POSTURE",pts:3}] },
      { id: "RF_Q08_D", label: "あまり気にならない", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  // Section 2: 距離と返事の重さを見る
  {
    id: "RF_Q09", section: "距離と返事の重さを見る",
    prompt: "最近、楽に話せる相手は？",
    options: [
      { id: "RF_Q09_A", label: "かなり限られている", tags: [{dim:"D5_RECOVERY_STYLE",pts:3},{dim:"D3_RELATIONSHIP_DISTANCE",pts:1}] },
      { id: "RF_Q09_B", label: "少人数ならいる", tags: [{dim:"D5_RECOVERY_STYLE",pts:3}] },
      { id: "RF_Q09_C", label: "話せるけれど疲れも残る", tags: [{dim:"D1_CURRENT_ENERGY",pts:3}] },
      { id: "RF_Q09_D", label: "比較的いる", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  {
    id: "RF_Q10", section: "距離と返事の重さを見る",
    prompt: "人に合わせたあと、自分に戻るために必要なのは？",
    options: [
      { id: "RF_Q10_A", label: "静かな時間", tags: [{dim:"D5_RECOVERY_STYLE",pts:3}] },
      { id: "RF_Q10_B", label: "短いメモや整理", tags: [{dim:"D2_EMOTIONAL_CLARITY",pts:2},{dim:"D6_NEXT_STEP_READINESS",pts:1}] },
      { id: "RF_Q10_C", label: "寝る・休む", tags: [{dim:"D5_RECOVERY_STYLE",pts:3},{dim:"D1_CURRENT_ENERGY",pts:1}] },
      { id: "RF_Q10_D", label: "次の予定を減らす", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3},{dim:"D5_RECOVERY_STYLE",pts:1}] },
    ],
  },
  {
    id: "RF_Q11", section: "距離と返事の重さを見る",
    prompt: "今の人間関係に近い言葉は？",
    options: [
      { id: "RF_Q11_A", label: "少し詰まっている", tags: [{dim:"D2_EMOTIONAL_CLARITY",pts:3},{dim:"D1_CURRENT_ENERGY",pts:1}] },
      { id: "RF_Q11_B", label: "返事が重い", tags: [{dim:"D4_DECISION_POSTURE",pts:3}] },
      { id: "RF_Q11_C", label: "距離を整えたい", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3}] },
      { id: "RF_Q11_D", label: "小さく整えられそう", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  {
    id: "RF_Q12", section: "距離と返事の重さを見る",
    prompt: "このチェックで知りたいことは？",
    options: [
      { id: "RF_Q12_A", label: "疲れの原因", tags: [{dim:"D2_EMOTIONAL_CLARITY",pts:3}] },
      { id: "RF_Q12_B", label: "休み方", tags: [{dim:"D5_RECOVERY_STYLE",pts:3}] },
      { id: "RF_Q12_C", label: "距離の取り方", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3}] },
      { id: "RF_Q12_D", label: "断り方のヒント", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2},{dim:"D4_DECISION_POSTURE",pts:1}] },
    ],
  },
  {
    id: "RF_Q13", section: "距離と返事の重さを見る",
    prompt: "予定が入ったとき、最初に感じやすいことは？",
    options: [
      { id: "RF_Q13_A", label: "楽しみより先に疲れを想像する", tags: [{dim:"D1_CURRENT_ENERGY",pts:3}] },
      { id: "RF_Q13_B", label: "誰が来るかで気持ちが変わる", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3}] },
      { id: "RF_Q13_C", label: "行く前から返事を後悔しやすい", tags: [{dim:"D4_DECISION_POSTURE",pts:3}] },
      { id: "RF_Q13_D", label: "内容によっては前向きになれる", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  {
    id: "RF_Q14", section: "距離と返事の重さを見る",
    prompt: "グループの中で疲れやすい瞬間は？",
    options: [
      { id: "RF_Q14_A", label: "空気を読み続けるとき", tags: [{dim:"D1_CURRENT_ENERGY",pts:3},{dim:"D2_EMOTIONAL_CLARITY",pts:1}] },
      { id: "RF_Q14_B", label: "話す量を合わせようとするとき", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3}] },
      { id: "RF_Q14_C", label: "反応を求められるとき", tags: [{dim:"D4_DECISION_POSTURE",pts:3}] },
      { id: "RF_Q14_D", label: "途中で抜けにくいとき", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3},{dim:"D5_RECOVERY_STYLE",pts:1}] },
    ],
  },
  {
    id: "RF_Q15", section: "距離と返事の重さを見る",
    prompt: "今、いちばん軽くしたいものは？",
    options: [
      { id: "RF_Q15_A", label: "返信の量", tags: [{dim:"D4_DECISION_POSTURE",pts:3}] },
      { id: "RF_Q15_B", label: "予定の数", tags: [{dim:"D5_RECOVERY_STYLE",pts:3}] },
      { id: "RF_Q15_C", label: "気づかいの量", tags: [{dim:"D1_CURRENT_ENERGY",pts:3}] },
      { id: "RF_Q15_D", label: "断りにくさ", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3},{dim:"D6_NEXT_STEP_READINESS",pts:1}] },
    ],
  },
  {
    id: "RF_Q16", section: "距離と返事の重さを見る",
    prompt: "人に頼ることについて、今の自分は？",
    options: [
      { id: "RF_Q16_A", label: "頼りたいけれど迷う", tags: [{dim:"D2_EMOTIONAL_CLARITY",pts:3}] },
      { id: "RF_Q16_B", label: "迷惑ではないか気になる", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3}] },
      { id: "RF_Q16_C", label: "一人で抱えがち", tags: [{dim:"D1_CURRENT_ENERGY",pts:3}] },
      { id: "RF_Q16_D", label: "相手を選べば話せる", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  // Section 3: 回復しやすい形を見る
  {
    id: "RF_Q17", section: "回復しやすい形を見る",
    prompt: "回復しやすい関わり方は？",
    options: [
      { id: "RF_Q17_A", label: "短くても本音で話せること", tags: [{dim:"D5_RECOVERY_STYLE",pts:3}] },
      { id: "RF_Q17_B", label: "返事を急かされないこと", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3}] },
      { id: "RF_Q17_C", label: "会う予定が詰まりすぎないこと", tags: [{dim:"D5_RECOVERY_STYLE",pts:3}] },
      { id: "RF_Q17_D", label: "小さく近況を共有できること", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  {
    id: "RF_Q18", section: "回復しやすい形を見る",
    prompt: "このあと試せそうな小さなことは？",
    options: [
      { id: "RF_Q18_A", label: "返事をひとつ短くする", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:3},{dim:"D4_DECISION_POSTURE",pts:1}] },
      { id: "RF_Q18_B", label: "予定をひとつ増やさない", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:3},{dim:"D5_RECOVERY_STYLE",pts:1}] },
      { id: "RF_Q18_C", label: "SNSを見る時間を少し減らす", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:3},{dim:"D2_EMOTIONAL_CLARITY",pts:1}] },
      { id: "RF_Q18_D", label: "今日は休むことを優先する", tags: [{dim:"D5_RECOVERY_STYLE",pts:3}] },
    ],
  },
  {
    id: "RF_Q19", section: "回復しやすい形を見る",
    prompt: "「少し距離を置きたい」と感じるとき、近い理由は？",
    options: [
      { id: "RF_Q19_A", label: "自分の気持ちを戻したい", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3},{dim:"D5_RECOVERY_STYLE",pts:1}] },
      { id: "RF_Q19_B", label: "相手に合わせすぎた", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3},{dim:"D1_CURRENT_ENERGY",pts:1}] },
      { id: "RF_Q19_C", label: "言葉にする前に整理したい", tags: [{dim:"D2_EMOTIONAL_CLARITY",pts:3}] },
      { id: "RF_Q19_D", label: "今は距離を置くほどではない", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  {
    id: "RF_Q20", section: "回復しやすい形を見る",
    prompt: "断る・返す・予定を決める前に、あると助かるものは？",
    options: [
      { id: "RF_Q20_A", label: "考える時間", tags: [{dim:"D4_DECISION_POSTURE",pts:3}] },
      { id: "RF_Q20_B", label: "短く伝える言葉", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:3},{dim:"D4_DECISION_POSTURE",pts:1}] },
      { id: "RF_Q20_C", label: "相手にどう思われるかを手放す余裕", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3}] },
      { id: "RF_Q20_D", label: "自分の予定を見直す時間", tags: [{dim:"D5_RECOVERY_STYLE",pts:2},{dim:"D4_DECISION_POSTURE",pts:1}] },
    ],
  },
  {
    id: "RF_Q21", section: "回復しやすい形を見る",
    prompt: "人と関わる前後で、自分のエネルギーは？",
    options: [
      { id: "RF_Q21_A", label: "会う前から減っていることがある", tags: [{dim:"D1_CURRENT_ENERGY",pts:3}] },
      { id: "RF_Q21_B", label: "会っている間は大丈夫で、あとから減る", tags: [{dim:"D1_CURRENT_ENERGY",pts:3},{dim:"D5_RECOVERY_STYLE",pts:1}] },
      { id: "RF_Q21_C", label: "相手や場によって大きく変わる", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:2},{dim:"D2_EMOTIONAL_CLARITY",pts:1}] },
      { id: "RF_Q21_D", label: "比較的保てている", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  {
    id: "RF_Q22", section: "回復しやすい形を見る",
    prompt: "疲れている理由を考えるとき、近いのは？",
    options: [
      { id: "RF_Q22_A", label: "ひとつに絞れない", tags: [{dim:"D2_EMOTIONAL_CLARITY",pts:3}] },
      { id: "RF_Q22_B", label: "相手より、自分の余白が足りない気がする", tags: [{dim:"D5_RECOVERY_STYLE",pts:3}] },
      { id: "RF_Q22_C", label: "断れなかったことが残る", tags: [{dim:"D3_RELATIONSHIP_DISTANCE",pts:3}] },
      { id: "RF_Q22_D", label: "軽くできる部分は見えている", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:2}] },
    ],
  },
  {
    id: "RF_Q23", section: "回復しやすい形を見る",
    prompt: "疲れた日の夜に、いちばん助かるのは？",
    options: [
      { id: "RF_Q23_A", label: "誰にも返さなくていい時間", tags: [{dim:"D5_RECOVERY_STYLE",pts:3},{dim:"D4_DECISION_POSTURE",pts:1}] },
      { id: "RF_Q23_B", label: "短く気持ちを書き出すこと", tags: [{dim:"D2_EMOTIONAL_CLARITY",pts:3}] },
      { id: "RF_Q23_C", label: "安心できる相手と少し話すこと", tags: [{dim:"D5_RECOVERY_STYLE",pts:3}] },
      { id: "RF_Q23_D", label: "明日の予定を少し軽くすること", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:3}] },
    ],
  },
  {
    id: "RF_Q24", section: "回復しやすい形を見る",
    prompt: "今の自分に一番やさしい次の一歩は？",
    options: [
      { id: "RF_Q24_A", label: "返事を急がない", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:3},{dim:"D4_DECISION_POSTURE",pts:1}] },
      { id: "RF_Q24_B", label: "予定を少し減らす", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:3},{dim:"D5_RECOVERY_STYLE",pts:1}] },
      { id: "RF_Q24_C", label: "気持ちを一行だけ書く", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:3},{dim:"D2_EMOTIONAL_CLARITY",pts:1}] },
      { id: "RF_Q24_D", label: "信頼できる人に短く話す", tags: [{dim:"D6_NEXT_STEP_READINESS",pts:3},{dim:"D5_RECOVERY_STYLE",pts:1}] },
    ],
  },
];

export const RF_ARCHETYPES: Record<ArchetypeId, Archetype> = {
  RF_REPLY_LOAD: {
    id: "RF_REPLY_LOAD",
    name: "返信で疲れが出やすいタイプ",
    title: "返信で疲れが出やすいタイプ",
    body: "返したい気持ちはあっても、内容やタイミングを考えるうちに、少し重くなりやすい状態です。",
    insight: "返信そのものより、「どう返せばちょうどいいか」を考える負担が大きくなっている可能性があります。短く返す、あとで返す、返さない時間を決めるなど、小さなルールが助けになります。",
    fatigueScene: "返信の内容やタイミングを考えているとき",
    boundaryHint: "今は、すぐに決めるより「どこまでなら無理なく関われるか」を見直すことが助けになりそうです。",
    recoveryHint: "返信より前に、少しだけ自分の時間を置いてみましょう。",
    nextStep: "今日は返事をひとつ短くしても大丈夫です。",
    reportTeaser: "返信の重さ、予定の決め方、返す前に疲れやすい場面を整理します。",
  },
  RF_BOUNDARY_RESET: {
    id: "RF_BOUNDARY_RESET",
    name: "距離を整えたいタイプ",
    title: "距離を整えたいタイプ",
    body: "人との関係を大切にしたいからこそ、今は少し余白をつくることが助けになりそうです。",
    insight: "断ることや距離を置くことが、相手を否定することのように感じやすい時期かもしれません。今は関係の結論より、自分の余白を守る言葉を持つことが大切です。",
    fatigueScene: "断るかどうか、距離を取るかどうかを迷っているとき",
    boundaryHint: "今は、すぐに決めるより「どこまでなら無理なく関われるか」を見直すことが助けになりそうです。",
    recoveryHint: "距離を置くことは、関係を終わらせることとは違います。",
    nextStep: "次の予定を増やす前に、一度持ち帰る言葉を用意してみましょう。",
    reportTeaser: "断りにくさ、距離の取り方、残したい関係を自分だけの言葉で整理します。",
  },
  RF_SOCIAL_ENERGY_DRAIN: {
    id: "RF_SOCIAL_ENERGY_DRAIN",
    name: "気づかいで消耗しやすいタイプ",
    title: "気づかいで消耗しやすいタイプ",
    body: "場の空気や相手の反応を見ているうちに、自分のエネルギーが減りやすい状態です。",
    insight: "会っている間は平気に見えても、あとから疲れが出やすいかもしれません。人と会う予定のあとに、何もしない時間を先に置くと戻りやすくなります。",
    fatigueScene: "場の空気や相手の反応を読み続けているとき",
    boundaryHint: "今は、すぐに決めるより「どこまでなら無理なく関われるか」を見直すことが助けになりそうです。",
    recoveryHint: "会ったあとに10分だけ何もしない時間を置いてみましょう。",
    nextStep: "会ったあとに10分だけ何もしない時間を置いてみましょう。",
    reportTeaser: "気づかいで減りやすいエネルギーと、戻りやすい休み方を整理します。",
  },
  RF_AIR_READING_COMPARISON: {
    id: "RF_AIR_READING_COMPARISON",
    name: "空気読み・比較で疲れやすいタイプ",
    title: "空気読み・比較で疲れやすいタイプ",
    body: "人の反応や近況が頭に残り、自分のペースが見えにくくなりやすい状態です。",
    insight: "疲れの中心は、会うことそのものより、あとから考え続ける時間にあるかもしれません。見たもの・聞いたこと・比べたことを一度外に出すと整理しやすくなります。",
    fatigueScene: "人の反応や近況が頭に残り続けているとき",
    boundaryHint: "今は、すぐに決めるより「どこまでなら無理なく関われるか」を見直すことが助けになりそうです。",
    recoveryHint: "SNSを見る時間を少し短くして、気持ちの戻り方を観察してみましょう。",
    nextStep: "SNSを見る時間を少し短くして、気持ちの戻り方を観察してみましょう。",
    reportTeaser: "比較や空気読みで残る疲れを、短い言葉に分けて整理します。",
  },
  RF_SMALL_CIRCLE_RECOVERY: {
    id: "RF_SMALL_CIRCLE_RECOVERY",
    name: "少人数で回復しやすいタイプ",
    title: "少人数で回復しやすいタイプ",
    body: "広く関わるより、安心できる少数の関係や静かな時間で整いやすい状態です。",
    insight: "今は人間関係を広げるより、安心して戻れる場所を少し守る方が合っているかもしれません。関わる量を減らすことは、関係を否定することとは違います。",
    fatigueScene: "広い人間関係の中で気を使い続けているとき",
    boundaryHint: "関わる量を減らすことは、関係を否定することとは違います。",
    recoveryHint: "今週は、気を使わない相手か、ひとり時間を一つだけ優先してみましょう。",
    nextStep: "今週は、気を使わない相手か、ひとり時間を一つだけ優先してみましょう。",
    reportTeaser: "回復しやすい距離、少人数の関係、休み方のパターンを整理します。",
  },
  RF_SMALL_ADJUSTMENT_READY: {
    id: "RF_SMALL_ADJUSTMENT_READY",
    name: "小さく整えられるタイプ",
    title: "小さく整えられるタイプ",
    body: "今の負担を全部変えなくても、ひとつ軽くするだけで戻りやすい状態です。",
    insight: "大きく変えるより、返信・予定・SNS・ひとり時間のうち一つだけ軽くすることが合いそうです。今のあなたには、小さく選び直す力が残っています。",
    fatigueScene: "いくつかの負担が重なって見えているとき",
    boundaryHint: "今は、すぐに決めるより「どこまでなら無理なく関われるか」を見直すことが助けになりそうです。",
    recoveryHint: "大きく変えなくても、ひとつだけ軽くすることから始められます。",
    nextStep: "返信・予定・SNSのうち、一つだけ軽くしてみましょう。",
    reportTeaser: "今できる小さな調整と、続けやすい回復行動を整理します。",
  },
  RF_MIXED_OVERLAP: {
    id: "RF_MIXED_OVERLAP",
    name: "負担がいくつか重なっているタイプ",
    title: "負担がいくつか重なっているタイプ",
    body: "ひとつに決めるより、今はいくつかの疲れが重なって見えています。",
    insight: "返信、予定、気づかい、比較、休む時間の少なさが少しずつ重なっている可能性があります。今は原因をひとつに決めるより、いちばん軽くできる場所を選ぶことから始めてみましょう。",
    fatigueScene: "いくつかの負担が同時に重なって感じられるとき",
    boundaryHint: "今は、すぐに決めるより「どこまでなら無理なく関われるか」を見直すことが助けになりそうです。",
    recoveryHint: "今日は原因を決めきらず、いちばん軽くできそうなものを一つ選んでみましょう。",
    nextStep: "今日は原因を決めきらず、いちばん軽くできそうなものを一つ選んでみましょう。",
    reportTeaser: "重なっている負担を、返信・予定・距離・回復に分けて整理します。",
  },
};

export type AnswerMap = Record<string, string>;
export type DimScores = Record<Dimension, number>;

export type RFResult = {
  archetypeId: ArchetypeId;
  archetype: Archetype;
  scores: DimScores;
};

const ALL_DIMS: readonly Dimension[] = [
  "D1_CURRENT_ENERGY",
  "D2_EMOTIONAL_CLARITY",
  "D3_RELATIONSHIP_DISTANCE",
  "D4_DECISION_POSTURE",
  "D5_RECOVERY_STYLE",
  "D6_NEXT_STEP_READINESS",
];

const DIMENSION_TO_ARCHETYPE: Record<Dimension, ArchetypeId> = {
  D1_CURRENT_ENERGY: "RF_SOCIAL_ENERGY_DRAIN",
  D2_EMOTIONAL_CLARITY: "RF_AIR_READING_COMPARISON",
  D3_RELATIONSHIP_DISTANCE: "RF_BOUNDARY_RESET",
  D4_DECISION_POSTURE: "RF_REPLY_LOAD",
  D5_RECOVERY_STYLE: "RF_SMALL_CIRCLE_RECOVERY",
  D6_NEXT_STEP_READINESS: "RF_SMALL_ADJUSTMENT_READY",
};

export function computeRFResult(answers: AnswerMap): RFResult {
  const optionLookup: Record<string, readonly Tag[]> = {};
  for (const q of RF_QUESTIONS) {
    for (const opt of q.options) {
      optionLookup[opt.id] = opt.tags;
    }
  }

  const raw: DimScores = {
    D1_CURRENT_ENERGY: 0,
    D2_EMOTIONAL_CLARITY: 0,
    D3_RELATIONSHIP_DISTANCE: 0,
    D4_DECISION_POSTURE: 0,
    D5_RECOVERY_STYLE: 0,
    D6_NEXT_STEP_READINESS: 0,
  };

  for (const optId of Object.values(answers)) {
    const tags = optionLookup[optId];
    if (!tags) continue;
    for (const { dim, pts } of tags) {
      raw[dim] += pts;
    }
  }

  const sorted = [...ALL_DIMS].sort((a, b) => raw[b] - raw[a]);
  const topScore = raw[sorted[0]];
  const thirdScore = raw[sorted[2]] ?? 0;

  // Mixed: top 3 dimensions within 8% of top score
  const isMixed = topScore > 0 && (topScore - thirdScore) / topScore < 0.08;

  let archetypeId: ArchetypeId;

  if (isMixed) {
    archetypeId = "RF_MIXED_OVERLAP";
  } else {
    const topDim = sorted[0];
    // D5 tie-break: if D5 is within 5% of top (and not already top), prefer recovery
    const d5Score = raw["D5_RECOVERY_STYLE"];
    const d5NearTop =
      topDim !== "D5_RECOVERY_STYLE" &&
      topScore > 0 &&
      (topScore - d5Score) / topScore < 0.05;

    archetypeId = d5NearTop
      ? "RF_SMALL_CIRCLE_RECOVERY"
      : DIMENSION_TO_ARCHETYPE[topDim];
  }

  return { archetypeId, archetype: RF_ARCHETYPES[archetypeId], scores: raw };
}
