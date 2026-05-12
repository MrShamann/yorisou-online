import type { T6ConfidenceBand, T6OverlayModel, T6ResultModel } from "./t6Types";

export const T6_BASE_RESULTS: T6ResultModel[] = [
  {
    id: "steady_arranger",
    internalCode: "steady_arranger",
    publicName: "順番が見えると進める人",
    recognitionLine: "今は、勢いで押すよりも、やることの並びが見えると力を出しやすい状態です。整理してから進むことで、自分のペースを保ちやすくなります。",
    recognitionHook: "急がされるより、まず順番が見えるほうが動きやすい。",
    summary: [
      "今は、勢いで押すよりも、やることの並びが見えると力を出しやすい状態です。整理してから進むことで、自分のペースを保ちやすくなります。",
    ],
    currentTendencyTitle: "今の進み方",
    currentTendencyBody: "やることが多いときほど、まず全体を見てから動きたくなりやすいようです。先に流れが見えると、気持ちも少し落ち着きます。",
    dailyPatternTitle: "日常で出やすい動き",
    dailyPattern: "予定やタスクを頭の中で並べ直してから、ひとつずつ進めることが多そうです。急な変更より、少し準備できる時間があるほうが合っています。",
    frictionTitle: "つまずきやすいところ",
    frictionPoint: "何から手をつけるか見えないまま動かされると、力が分散しやすくなります。やる気の問題ではなく、順番が見えないことが負荷になりやすい状態です。",
    nextStepTitle: "小さく試すなら",
    nextStep: [
      "今日やることを、まず3つだけに絞る。",
      "最初に手をつけるものを一つだけ決める。",
    ],
    shareLine: "急がなくていい。順番が見えたら、ちゃんと進める。",
    reportPreviewBridge: "もう少し丁寧に読むと、どんな順番や環境だと動きやすいかまで見えやすくなります。",
    traitChips: ["順番で整う", "納得して進む", "見通し重視"],
    shortSummary: "visible order and calm pacing",
  },
  {
    id: "quiet_integrator",
    internalCode: "quiet_integrator",
    publicName: "ひとりの時間で整う人",
    recognitionLine: "すぐ言葉にするより、一度自分の中に置いてみることで、本当に言いたいことが見えやすくなります。ひとりの時間は逃げ場ではなく、整うための余白になりやすいようです。",
    recognitionHook: "返事を急ぐより、少し静かな時間を置いたほうが、納得して動きやすいようです。",
    summary: [
      "すぐ言葉にするより、一度自分の中に置いてみることで、本当に言いたいことが見えやすくなります。ひとりの時間は逃げ場ではなく、整うための余白になりやすいようです。",
    ],
    currentTendencyTitle: "今の整え方",
    currentTendencyBody: "すぐに答えを出すより、少し置いてからのほうが自分の感覚をつかみやすい状態です。時間をもらうことで、言葉が自然にまとまりやすくなります。",
    dailyPatternTitle: "日常で出やすい動き",
    dailyPattern: "話しながら決めるより、あとで一人になったときに「あれはこうだったかも」と見えてくることがありそうです。",
    frictionTitle: "つまずきやすいところ",
    frictionPoint: "その場ですぐ返すことを求められると、本当に思っていることより先に、無難な返事を選びやすくなるかもしれません。",
    nextStepTitle: "小さく試すなら",
    nextStep: [
      "すぐ返せないときは、「少し考えてから返すね」と置いてみる。",
      "あとで残った言葉を、短くメモしておく。",
    ],
    shareLine: "すぐ言えないんじゃなくて、言葉が育つまで少し時間がいる。",
    reportPreviewBridge: "もう少し丁寧に読むと、どんな余白があると自分の言葉に戻りやすいかまで見えやすくなります。",
    traitChips: ["静かに整理", "納得して動く", "言葉を育てる"],
    shortSummary: "inner sorting and self-paced timing",
  },
  {
    id: "gentle_navigator",
    internalCode: "gentle_navigator",
    publicName: "場の温度を見ながら進む人",
    recognitionLine: "今は、正しさだけで押し切るより、その場の空気や相手の受け取り方も見ながら進みやすい状態です。合わせる力がありますが、自分のペースを後回しにしすぎないことも大切です。",
    recognitionHook: "自分だけで進めるより、まわりの温度も見ながら動きたい。",
    summary: [
      "今は、正しさだけで押し切るより、その場の空気や相手の受け取り方も見ながら進みやすい状態です。合わせる力がありますが、自分のペースを後回しにしすぎないことも大切です。",
    ],
    currentTendencyTitle: "今の進み方",
    currentTendencyBody: "自分の気持ちだけでなく、まわりの反応も見ながら動きやすいようです。場が少し落ち着くと、自分も進みやすくなります。",
    dailyPatternTitle: "日常で出やすい動き",
    dailyPattern: "誰かが困っていそうなとき、先に気づいて言葉を選ぶことがありそうです。強く出るより、場の温度を整えながら進めるタイプです。",
    frictionTitle: "つまずきやすいところ",
    frictionPoint: "相手に合わせすぎると、自分が本当はどうしたいのかが後ろに下がりやすくなります。やさしさが、少し疲れに変わることもあります。",
    nextStepTitle: "小さく試すなら",
    nextStep: [
      "相手を見る前に、自分の希望を一つだけ確認する。",
      "「大丈夫」以外の言葉を、自分にも許してみる。",
    ],
    shareLine: "空気を読むのは、弱いからじゃない。場の温度を見ながら進んでいる。",
    reportPreviewBridge: "もう少し丁寧に読むと、合わせる力と自分のペースの境目が見えやすくなります。",
    traitChips: ["空気を見る", "温度を読む", "そっと調整"],
    shortSummary: "relational rhythm and gentle adjustment",
  },
  {
    id: "responsive_adjuster",
    internalCode: "responsive_adjuster",
    publicName: "流れを見ながら組み直す人",
    recognitionLine: "今は、決めた通りに進めるより、その場の変化を見ながら動き直す力が出やすい状態です。反応が早いぶん、後から少し疲れが残ることもあります。",
    recognitionHook: "予定どおりじゃなくても、流れを見てもう一度組み直せる。",
    summary: [
      "今は、決めた通りに進めるより、その場の変化を見ながら動き直す力が出やすい状態です。反応が早いぶん、後から少し疲れが残ることもあります。",
    ],
    currentTendencyTitle: "今の動き方",
    currentTendencyBody: "状況が変わったときに、止まるよりも一度動きながら調整しやすいようです。予定が変わっても、完全に崩れる前に別の形を探せます。",
    dailyPatternTitle: "日常で出やすい動き",
    dailyPattern: "会話や予定の流れを見て、「じゃあこうしよう」と切り替えることが多そうです。まわりから見ると対応が早く見えるかもしれません。",
    frictionTitle: "つまずきやすいところ",
    frictionPoint: "動き直せるぶん、自分の中で落ち着く前に次へ進んでしまうことがあります。あとから疲れに気づくこともありそうです。",
    nextStepTitle: "小さく試すなら",
    nextStep: [
      "切り替えたあとに、短く一息つく時間を置く。",
      "「今の変更で増えた負荷」を一つだけ確認する。",
    ],
    shareLine: "流れが変わっても、止まるより先に組み直している。",
    reportPreviewBridge: "もう少し丁寧に読むと、変化に強いところと、後から疲れやすいところの境目が見えやすくなります。",
    traitChips: ["組み直せる", "変化に反応", "流れを見る"],
    shortSummary: "adaptation and recalibration",
  },
  {
    id: "deliberate_boundary_keeper",
    internalCode: "deliberate_boundary_keeper",
    publicName: "自分の間を守れる人",
    recognitionLine: "今は、人や予定との距離を少し整えることで、自分らしく動きやすい状態です。無理に近づくより、安心できる間があるほうが、ちゃんと向き合いやすくなります。",
    recognitionHook: "近づかないんじゃなくて、自分の間を守ると落ち着いて向き合える。",
    summary: [
      "今は、人や予定との距離を少し整えることで、自分らしく動きやすい状態です。無理に近づくより、安心できる間があるほうが、ちゃんと向き合いやすくなります。",
    ],
    currentTendencyTitle: "今の距離感",
    currentTendencyBody: "近い関係でも、少し自分の時間や余白があるほうが落ち着きやすいようです。距離は拒否ではなく、整うためのスペースになりやすい状態です。",
    dailyPatternTitle: "日常で出やすい動き",
    dailyPattern: "すぐに返事をしたり、すぐ会ったりするより、自分のペースを確認してから関わるほうが合っていそうです。",
    frictionTitle: "つまずきやすいところ",
    frictionPoint: "距離を詰められすぎると、気持ちより先に守る反応が出やすくなるかもしれません。余白があるほうが、むしろやさしく向き合えます。",
    nextStepTitle: "小さく試すなら",
    nextStep: [
      "返事の前に、自分の余白がどれくらいあるか見る。",
      "近づく前に、安心できる距離を一つ決める。",
    ],
    shareLine: "距離を取るのは冷たいからじゃない。ちゃんと向き合うための間がいる。",
    reportPreviewBridge: "もう少し丁寧に読むと、どんな距離なら安心して関われるかが見えやすくなります。",
    traitChips: ["間を守る", "距離を整える", "自分のペース"],
    shortSummary: "distance, timing, and protected rhythm",
  },
  {
    id: "rebuilding_mover",
    internalCode: "rebuilding_mover",
    publicName: "整え直しながら進む人",
    recognitionLine: "今は、ずっと同じ勢いで進むより、途中で整え直しながら前に進むほうが合いやすい状態です。止まることも、戻ることも、進むための一部になりそうです。",
    recognitionHook: "一度止まっても、整え直せたらまた進める。",
    summary: [
      "今は、ずっと同じ勢いで進むより、途中で整え直しながら前に進むほうが合いやすい状態です。止まることも、戻ることも、進むための一部になりそうです。",
    ],
    currentTendencyTitle: "今の戻り方",
    currentTendencyBody: "無理に走り続けるより、一度立て直す時間があると動きやすくなりそうです。整え直すことで、次の一歩が見えやすくなります。",
    dailyPatternTitle: "日常で出やすい動き",
    dailyPattern: "予定が崩れたり、気持ちが散らかったりしたあとに、自分なりの戻し方を探すことが多そうです。小さく整えるほど、また動きやすくなります。",
    frictionTitle: "つまずきやすいところ",
    frictionPoint: "戻る時間を取れないまま進もうとすると、負荷が残りやすくなります。立て直しを後回しにすると、次の動きが重くなることもあります。",
    nextStepTitle: "小さく試すなら",
    nextStep: [
      "今日は「戻すための5分」を先に取ってみる。",
      "崩れたことより、戻しやすい形を一つ探す。",
    ],
    shareLine: "止まったら終わりじゃない。整え直せたら、また進める。",
    reportPreviewBridge: "もう少し丁寧に読むと、自分に合う戻り方と、無理なく続ける形が見えやすくなります。",
    traitChips: ["整え直す", "小さく戻る", "また進める"],
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
    publicLabel: "内側で整える時期",
    publicLine: "今は、外に広げる前に少し自分の中を整えやすい時期です。",
    body: "すぐ動くより、考えや気持ちを一度置いてみることで、次の一歩が見えやすくなりそうです。",
    lightNextAction: "今日は、急いで決めずに「今いちばん整えたいこと」を一つだけ見てみる。",
    resultSheetLine: "すぐ動くより、考えや気持ちを一度置いてみることで、次の一歩が見えやすくなりそうです。",
    nextStepCue: "今日は、急いで決めずに「今いちばん整えたいこと」を一つだけ見てみる。",
    privateLine: "すぐ動くより、考えや気持ちを一度置いてみることで、次の一歩が見えやすくなりそうです。",
  },
  {
    id: "strained",
    publicLabel: "少し負荷が重なる時期",
    publicLine: "今は、急な切り替えや重なりに少し疲れが残りやすいかもしれません。",
    body: "がんばれていないというより、いろいろな流れを同時に受け止めている状態に近そうです。まずは一つ減らすことが助けになります。",
    lightNextAction: "今日やらないことを、一つだけ決めてみる。",
    resultSheetLine: "がんばれていないというより、いろいろな流れを同時に受け止めている状態に近そうです。まずは一つ減らすことが助けになります。",
    nextStepCue: "今日やらないことを、一つだけ決めてみる。",
    privateLine: "がんばれていないというより、いろいろな流れを同時に受け止めている状態に近そうです。まずは一つ減らすことが助けになります。",
  },
  {
    id: "balancing",
    publicLabel: "進み方を調整する時期",
    publicLine: "今は、進みたい気持ちと整えたい感覚が同時に出やすい時期です。",
    body: "どちらか一つに決めるより、動くところと休ませるところを分けて見ると、今の流れが扱いやすくなりそうです。",
    lightNextAction: "進めることと、少し置くことを一つずつ分けてみる。",
    resultSheetLine: "どちらか一つに決めるより、動くところと休ませるところを分けて見ると、今の流れが扱いやすくなりそうです。",
    nextStepCue: "進めることと、少し置くことを一つずつ分けてみる。",
    privateLine: "どちらか一つに決めるより、動くところと休ませるところを分けて見ると、今の流れが扱いやすくなりそうです。",
  },
  {
    id: "reopening",
    publicLabel: "少しずつ外へ向かう時期",
    publicLine: "今は、無理に広げるより、小さく外へ向かいやすい時期です。",
    body: "いきなり大きく変えるより、少し連絡してみる、少し出てみる、少し試してみる。そのくらいの動きが合いやすそうです。",
    lightNextAction: "今日は、外へ向かう小さな一歩を一つだけ選んでみる。",
    resultSheetLine: "いきなり大きく変えるより、少し連絡してみる、少し出てみる、少し試してみる。そのくらいの動きが合いやすそうです。",
    nextStepCue: "今日は、外へ向かう小さな一歩を一つだけ選んでみる。",
    privateLine: "いきなり大きく変えるより、少し連絡してみる、少し出てみる、少し試してみる。そのくらいの動きが合いやすそうです。",
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
