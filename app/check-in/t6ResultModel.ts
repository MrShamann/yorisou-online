import type { T6ConfidenceBand, T6OverlayModel, T6ResultModel } from "./t6Types";

export const T6_BASE_RESULTS: T6ResultModel[] = [
  {
    id: "steady_arranger",
    internalCode: "steady_arranger",
    publicName: "順番を整えて進む人",
    recognitionLine: "急に走り出すより、まず全体の順番が見えたときに、落ち着いて力を出しやすい人です。",
    recognitionHook: "「何から手をつけるか」が見えるだけで、気持ちも手も動きやすくなる。",
    summary: [
      "今のあなたは、勢いで突破するよりも、先に流れを整えてから進むほうが合いやすいタイミングです。",
      "頭の中に順番ができると、やることの重さが少し軽くなり、次の一歩を選びやすくなります。",
      "慎重すぎるというより、雑に始めるとあとで消耗しやすいからこそ、最初の見取り図を大事にしている状態です。",
    ],
    dailyPattern: "予定、仕事、家のことが重なったとき、いきなり片づけるよりも、紙に出す・並べる・優先順位をつけることで動き出しやすくなります。",
    frictionPoint: "一方で、順番が見えないまま急かされると、やる気がないわけではないのに手が止まりやすくなります。全部をきれいに整えてから始めようとして、始動が少し遅れることもあります。",
    nextStep: [
      "今日やることを3つだけにしぼり、上から順番をつけてみる。",
      "最初の10分だけ、準備ではなく実際に手を動かす時間にする。",
    ],
    shareLine: "順番が見えると、落ち着いて進めるタイプ。",
    traitChips: ["順番が見えると動きやすい", "準備で安心をつくる", "無理なく続けたい"],
    shortSummary: "visible order and calm pacing",
  },
  {
    id: "quiet_integrator",
    internalCode: "quiet_integrator",
    publicName: "内側で整えてから動く人",
    recognitionLine: "すぐ言葉にするより、一度自分の中で置いてみることで、ほんとうに言いたいことが見えやすい人です。",
    recognitionHook: "返事を急ぐより、少し静かな時間を置いたほうが、納得して動ける。",
    summary: [
      "今のあなたは、外に出す前に内側で整理する時間が助けになりやすい状態です。",
      "考えが遅いのではなく、細かい違和感や温度まで見てから動きたい。そのぶん、一度まとまるとぶれにくい判断ができます。",
      "まわりの速さに合わせすぎるより、自分の中で言葉が育つのを待つほうが、結果的に自然な動きになりやすいでしょう。",
    ],
    dailyPattern: "メッセージの返事、予定の判断、人とのやりとりで、即答よりも少し考える余白があると落ち着きます。ひとりでメモしたり、頭の中で何度か言い直したりしてから外に出すことが多そうです。",
    frictionPoint: "周囲のテンポが速いと、置いていかれるように感じたり、まだまとまっていない言葉を急いで出して疲れたりしやすいかもしれません。黙っている時間が、誤解されることもあります。",
    nextStep: [
      "返事に迷うものは、まず一文だけ下書きして寝かせる。",
      "今日の考えを、誰にも見せないメモに3行だけ置いてみる。",
    ],
    shareLine: "静かな時間を置くほど、自分の言葉で動けるタイプ。",
    traitChips: ["ひとりで整理しやすい", "納得してから動く", "静かな時間が助けになる"],
    shortSummary: "inner sorting and self-paced timing",
  },
  {
    id: "gentle_navigator",
    internalCode: "gentle_navigator",
    publicName: "空気を見ながら進む人",
    recognitionLine: "自分の気持ちだけで押し切るより、相手の温度や場の流れを見ながら進むほうが自然な人です。",
    recognitionHook: "人との間合いを見ながら、強く押さずに進める場所を探している。",
    summary: [
      "今のあなたは、場の空気や相手の反応を拾いながら、ちょうどいい進み方を探しやすい状態です。",
      "遠慮ばかりしているわけではありません。人との関係を壊さずに、自分の動ける道を見つけたい感覚が強く出ています。",
      "強い主張よりも、少しずつ温度を合わせる進め方が、今は負担が少ないかもしれません。",
    ],
    dailyPattern: "会話の中で相手の表情や言い方を見たり、予定を決めるときに相手の余裕を気にしたりしやすいでしょう。場に合わせて言葉を選べるぶん、調整役になりやすい面もあります。",
    frictionPoint: "相手を見すぎると、自分が本当はどうしたいのかが後回しになります。断りたいのにやわらかく包みすぎて、あとから疲れが出ることもありそうです。",
    nextStep: [
      "相手に合わせる前に、自分の希望を短く一つだけ書いておく。",
      "返事をするときは、できることと難しいことを一文ずつ分けて伝える。",
    ],
    shareLine: "場の温度を見ながら、ちょうどいい進み方を探すタイプ。",
    traitChips: ["空気を見て動く", "やさしく調整する", "距離感を大事にする"],
    shortSummary: "relational rhythm and gentle adjustment",
  },
  {
    id: "responsive_adjuster",
    internalCode: "responsive_adjuster",
    publicName: "流れに合わせて動き直す人",
    recognitionLine: "決めた通りに進めるより、その場の変化を見ながら動き方を変えるほうが合いやすい人です。",
    recognitionHook: "予定通りでなくても、流れを見て動き直す力がある。",
    summary: [
      "今のあなたは、細かく決め切るよりも、動きながら調整していくほうが力を出しやすい状態です。",
      "変化に弱いというより、変化を見つけるのが早い。だからこそ、最初の計画にしばられすぎると窮屈に感じやすいかもしれません。",
      "一度決めたことを守る力よりも、今は状況に合わせて戻す力が前に出ています。",
    ],
    dailyPattern: "予定変更、急な依頼、まわりの空気の変化に気づきやすく、必要ならその場でやり方を変えられます。考えるより先に小さく試して、感触を見てから整えることも多そうです。",
    frictionPoint: "反応が早いぶん、気づいたこと全部に対応しようとして疲れやすい面があります。まわりの変化を拾いすぎると、自分の本来のペースが見えにくくなることもあります。",
    nextStep: [
      "今日対応する変化と、明日でいい変化を分ける。",
      "動きながら決める予定には、途中で止まる5分を先に入れておく。",
    ],
    shareLine: "流れを見て、動きながら調整できるタイプ。",
    traitChips: ["変化に反応しやすい", "動きながら調整する", "流れを見て進む"],
    shortSummary: "adaptation and recalibration",
  },
  {
    id: "deliberate_boundary_keeper",
    internalCode: "deliberate_boundary_keeper",
    publicName: "自分の間を守って進む人",
    recognitionLine: "人と関わることは大事にしつつ、自分の間を残しておくことで落ち着いて動ける人です。",
    recognitionHook: "近づきすぎないことで、ちゃんと関わる余力を残している。",
    summary: [
      "今のあなたは、距離を詰めるよりも、自分の余白を保ったまま関わるほうが自然な状態です。",
      "冷たいわけでも、ひとりでいたいだけでもありません。自分のペースが守られていると、人との関係にも落ち着いて向き合いやすくなります。",
      "誰かに合わせ続けるより、必要な境界線を静かに持つことが、今の安定につながりそうです。",
    ],
    dailyPattern: "予定を詰めすぎず、返事や会う頻度にも少し余白があると落ち着きます。近い関係ほど、自分の時間や場所を確保してから向き合うほうが、やさしく関われることがあります。",
    frictionPoint: "距離を取りたい気持ちを説明しないままにすると、相手に伝わりにくいことがあります。逆に、無理に近づき続けると、あとで急に離れたくなるかもしれません。",
    nextStep: [
      "今週守りたい自分の時間を、先に予定として入れておく。",
      "断るときは理由を長くせず、できる代案を一つだけ添える。",
    ],
    shareLine: "自分の間を守ることで、落ち着いて関われるタイプ。",
    traitChips: ["自分の間を大事にする", "距離を整える", "ペースを守る"],
    shortSummary: "distance, timing, and protected rhythm",
  },
  {
    id: "rebuilding_mover",
    internalCode: "rebuilding_mover",
    publicName: "整え直して進む人",
    recognitionLine: "一気に前へ進むより、少し乱れたものを戻しながら、また動ける形をつくる人です。",
    recognitionHook: "止まったあとに、もう一度小さく立て直す力がある。",
    summary: [
      "今のあなたは、強く押し切るよりも、崩れたリズムを少しずつ戻しながら進むほうが合いやすい状態です。",
      "休んだり戻ったりすることは、後退ではありません。いま必要なのは、大きな決断よりも、また動けるだけの足場をつくることかもしれません。",
      "小さく戻す、少し片づける、ひとつ減らす。そうした地味な調整が、次の動きにつながりやすいでしょう。",
    ],
    dailyPattern: "疲れがたまったあと、予定が崩れたあと、気持ちが散らかったあとに、まず生活の小さな部分を整えると戻りやすくなります。完璧に立て直すより、使えるところから戻すのが合いそうです。",
    frictionPoint: "早く元に戻そうとすると、かえって負担が重くなります。できていない部分ばかりを見ると、ほんの少し戻せていることを見落としやすいかもしれません。",
    nextStep: [
      "今日戻すものを、睡眠・食事・机まわりのどれか一つにしぼる。",
      "できなかったことではなく、戻せたことを一行だけ残す。",
    ],
    shareLine: "小さく立て直しながら、また進める形をつくるタイプ。",
    traitChips: ["整え直して進む", "小さく戻す", "無理なく立て直す"],
    shortSummary: "reset rhythm and gradual return",
  },
];

export const T6_FALLBACK_RESULT: T6ResultModel = {
  id: "mixed_state_reader",
  internalCode: "mixed_state_reader",
  publicName: "まだ形を決めすぎない人",
  recognitionLine: "今回の結果では、ひとつの名前に急いで寄せるより、いくつかの動き方が混ざって見えています。",
  recognitionHook: "今は、ひとつに決める前の揺れも含めて見ておきたいタイミングです。",
  summary: [
    "答えの中に、複数の進み方が同じくらい出ています。",
    "これは悪い結果ではなく、今の生活や気分がまだ動いているというサインとして扱えます。",
    "今日は名前を決め切るより、もう一度別の日に見比べるほうが、自分の流れを受け取りやすいかもしれません。",
  ],
  dailyPattern: "日によって動きやすい形が変わったり、人や予定によって反応が変わったりしやすい状態です。",
  frictionPoint: "無理にひとつの説明にまとめようとすると、かえってしっくりこない部分が残りやすくなります。",
  nextStep: [
    "今日は一番近いと感じたチップだけを覚えておく。",
    "数日後にもう一度チェックして、変わった部分を見る。",
  ],
  shareLine: "今は、ひとつに決めすぎず見比べたいタイミング。",
  traitChips: ["いくつかの流れがある", "今は決めすぎない", "少しずつ整理中"],
  shortSummary: "mixed signals and gentle retest",
};

export const T6_OVERLAYS: T6OverlayModel[] = [
  {
    id: "gathering",
    publicLabel: "整え中",
    publicLine: "今は、少し整えてから動きやすい状態です。",
    resultSheetLine: "まだ全部を決め切らなくて大丈夫です。手元のものを少し並べ直すだけでも、次の一歩が見えやすくなります。",
    nextStepCue: "大きく決めるより、小さく整理するところから始める。",
    privateLine: "外へ大きく出る前に、自分の中で順番や感覚を集めている流れが見えます。",
  },
  {
    id: "strained",
    publicLabel: "負荷が出やすい時期",
    publicLine: "今は、急な切り替えや重なりに負荷を感じやすいかもしれません。",
    resultSheetLine: "がんばりが足りないというより、受け止める量が少し重なっている時期です。今日は足すより減らすほうを先に見てもよさそうです。",
    nextStepCue: "重い判断を急がず、負荷を一つ減らす。",
    privateLine: "何かが大きく問題というより、重なりや切り替えが続くと、整う前に負荷が出やすい状態です。",
  },
  {
    id: "balancing",
    publicLabel: "バランスを取り直す時期",
    publicLine: "今は、進みたい気持ちと整えたい感覚が同時に出やすい状態です。",
    resultSheetLine: "前に進む力と、いったん整えたい感覚が並んでいます。どちらかを消すより、今週の配分を少し見直すのが合いそうです。",
    nextStepCue: "進める日と整える日を分けて、リズムを見直す。",
    privateLine: "前に進む力はある一方で、整えずに進むことには少し負荷が出やすい流れです。",
  },
  {
    id: "reopening",
    publicLabel: "少し広げ直す時期",
    publicLine: "少しずつ、外に向けて動き直しやすい流れが出ています。",
    resultSheetLine: "閉じていたものを、少し外へ向け直せる流れがあります。急に広げるより、負担の少ない接点を一つ試すくらいがちょうどよさそうです。",
    nextStepCue: "小さな連絡、短い外出、軽い相談のどれか一つを試す。",
    privateLine: "一度整えたものを、少しずつ外に向けて広げ直す流れが見えます。",
  },
];

export const T6_RESULT_BY_ID = new Map<string, T6ResultModel>(
  [...T6_BASE_RESULTS, T6_FALLBACK_RESULT].map((result) => [result.id, result]),
);

export const T6_OVERLAY_BY_ID = new Map<string, T6OverlayModel>(T6_OVERLAYS.map((overlay) => [overlay.id, overlay]));

export type T6PublicResultRouteContext = {
  resultId?: string | null;
  overlayId?: string | null;
  confidenceBand?: T6ConfidenceBand | null;
  payloadKey?: string | null;
};

export function buildT6PublicResultSearchParams(context: T6PublicResultRouteContext) {
  const params = new URLSearchParams();

  if (context.resultId) {
    params.set("resultId", context.resultId);
  }

  if (context.overlayId) {
    params.set("overlayId", context.overlayId);
  }

  if (context.confidenceBand) {
    params.set("confidence", context.confidenceBand);
  }

  if (context.payloadKey) {
    params.set("payloadKey", context.payloadKey);
  }

  return params.toString();
}

export function buildT6PublicResultHref(pathname: string, context: T6PublicResultRouteContext) {
  const query = buildT6PublicResultSearchParams(context);
  return query ? `${pathname}?${query}` : pathname;
}
