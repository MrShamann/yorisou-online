// Prototype fixture data only. Never written to production stores.

export type MoodId = "tired" | "flat" | "steady";

export const MOOD_CHOICES: {
  id: MoodId;
  label: string;
  hint: string;
}[] = [
  { id: "tired", label: "少し疲れている", hint: "人・予定・返信が重い" },
  { id: "flat", label: "どちらでもない", hint: "波はないが余白もない" },
  { id: "steady", label: "わりと整っている", hint: "小さく動けそう" },
];

export const MOOD_RESULTS: Record<
  MoodId,
  {
    stateName: string;
    interpretation: string;
    changeLine: string;
    nextAction: string;
    nextActionTime: string;
    tag: string;
  }
> = {
  tired: {
    stateName: "気づかいで消耗ぎみ",
    interpretation: "会うことより、あとから考え続ける時間にエネルギーが使われているようです。今日は「返さない時間」を先に決めると戻りやすくなります。",
    changeLine: "前回より「人との距離」の負担が少し増えています",
    nextAction: "今夜、返信を見ない30分をつくる",
    nextActionTime: "約30分",
    tag: "気づかいの疲れ",
  },
  flat: {
    stateName: "余白が足りない状態",
    interpretation: "大きな負担はない一方で、自分に戻る時間が薄くなっています。予定を足す前に、何もしない10分を置くのが合いそうです。",
    changeLine: "前回と大きな変化はありません",
    nextAction: "寝る前に10分、画面を見ない時間をつくる",
    nextActionTime: "約10分",
    tag: "余白がほしい",
  },
  steady: {
    stateName: "小さく動ける状態",
    interpretation: "土台は安定しています。今のうちに、気になっていたことを一つだけ軽く試すと、良い流れを保ちやすくなります。",
    changeLine: "前回より「次の一歩の準備」が上がっています",
    nextAction: "気になっていた場所へ、15分だけ行ってみる",
    nextActionTime: "約15分",
    tag: "小さく整えたい",
  },
};

export type FeedItemType = "experience" | "action" | "content" | "resource" | "local";

export const FEED_TYPE_META: Record<FeedItemType, { label: string; tint: string }> = {
  experience: { label: "みんなの体験", tint: "linear-gradient(135deg,#6C4CFF 0%,#8E75FF 100%)" },
  action: { label: "小さな行動", tint: "linear-gradient(135deg,#2A2057 0%,#4326C7 100%)" },
  content: { label: "読みもの", tint: "linear-gradient(135deg,#5836EB 0%,#6D8BFF 100%)" },
  resource: { label: "公的リソース", tint: "linear-gradient(135deg,#201842 0%,#2A2057 100%)" },
  local: { label: "近くの選択肢", tint: "linear-gradient(135deg,#17B8A8 0%,#2AD3C1 100%)" },
};

export type FeedItem = {
  id: string;
  type: FeedItemType;
  title: string;
  body: string;
  reason: string;
  source: string;
  timeCost: string;
  disclosure: string;
};

export const FEED_ITEMS: FeedItem[] = [
  {
    id: "f1",
    type: "experience",
    title: "返信を「夜だけまとめて」にしたら、昼の疲れが減った",
    body: "同じように気づかいで疲れやすい人の、匿名の体験です。",
    reason: "今の状態「気づかいの疲れ」に近い人の体験だから",
    source: "匿名の利用者",
    timeCost: "読むのに1分",
    disclosure: "個人の体験であり、効果を保証するものではありません。",
  },
  {
    id: "f2",
    type: "action",
    title: "今夜、通知を1時間だけ切る",
    body: "最初の一歩として、いちばん軽い形の「距離の取り方」です。",
    reason: "「返さない時間」を試したいと保存した人に合いやすいから",
    source: "YORISOUの提案",
    timeCost: "約1時間",
    disclosure: "YORISOUの案内です。任意の選択肢です。",
  },
  {
    id: "f3",
    type: "content",
    title: "「断る」を練習しない。予定を「持ち帰る」練習をする",
    body: "境界線を守る言い方を、短い読みものにしました。",
    reason: "保存した結果に「距離を整えたい」が含まれているから",
    source: "YORISOU編集",
    timeCost: "読むのに3分",
    disclosure: "YORISOUの案内です。任意の選択肢です。",
  },
  {
    id: "f4",
    type: "resource",
    title: "夜間・休日のこころの相談窓口（公的）",
    body: "つらさが続くとき、専門の相談先に無料でつながれます。",
    reason: "強い負担が続く人に、安全な選択肢を必ず並べているから",
    source: "公的機関",
    timeCost: "電話・チャット",
    disclosure: "公的・外部の公開情報です。利用条件はリンク先で確認してください。",
  },
  {
    id: "f5",
    type: "local",
    title: "近くの朝ヨガ（初回体験）",
    body: "体から整えたい週に。ひとり参加が多いクラスです。",
    reason: "「回復のかたち」に体を動かす選択肢を選んだことがあるから",
    source: "地域の教室",
    timeCost: "約60分",
    disclosure: "外部の有料サービスです。YORISOUに紹介料は発生しません。",
  },
];

export const TIMELINE_FIXTURE = [
  { date: "今日", state: "気づかいで消耗ぎみ", note: "返信を見ない30分を保存" },
  { date: "7月5日", state: "余白が足りない状態", note: "10分の画面オフを試した" },
  { date: "6月28日", state: "小さく動ける状態", note: "朝の散歩を記録" },
];

export const CAPTURE_CHIPS = [
  "断れずに予定を入れてしまった",
  "夜のSNSで疲れた",
  "返信を溜めてしまった",
  "ひとり時間が取れた",
];

export const CAPTURE_FOLLOWUPS = [
  {
    ack: "ありがとうございます。もう少しだけ教えてください。",
    question: "そのとき、何か試したことはありますか？",
    chips: ["通知を切った", "少し歩いた", "何もできなかった"],
  },
  {
    ack: "なるほど。最後にひとつだけ。",
    question: "やってみて、どう感じましたか？限界や条件があればそれも。",
    chips: ["少し楽になった", "変わらなかった", "夜は難しい"],
  },
];
