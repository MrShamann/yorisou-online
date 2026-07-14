// Package 9 — source-type grammar + safety copy for the result reveal.
// Pure content module (server-safe). Japanese-only external copy; warm,
// non-medical, no certainty claims. Confidence stays the model's honest band.

export type SourceType =
  | "ANSWER_DERIVED"
  | "RULE_BASED_INTERPRETATION"
  | "AI_GENERATED_INTERPRETATION"
  | "USER_CONFIRMED"
  | "OPTIONAL_NEXT_ACTION"
  | "LIMITATION";

export const SOURCE_LABEL: Record<SourceType, string> = {
  ANSWER_DERIVED: "回答から",
  RULE_BASED_INTERPRETATION: "タイプ解釈",
  AI_GENERATED_INTERPRETATION: "AI解釈",
  USER_CONFIRMED: "あなたの操作",
  OPTIONAL_NEXT_ACTION: "任意の一歩",
  LIMITATION: "このテストの限界",
};

export const CONFIDENCE_COPY: Record<"low" | "medium", { label: string; note: string }> = {
  low: {
    label: "確からしさ: ひかえめ",
    note: "回答数がまだ少ないため、いまの見え方は「仮の輪郭」です。日をおいて受け直すと、輪郭が変わることがあります。",
  },
  medium: {
    label: "確からしさ: 中くらい",
    note: "いまの回答からは一貫した傾向が見えていますが、あなたのすべてを表すものではありません。",
  },
};

export const LIMITATION_COPY = [
  "この結果は「いまのあなたの動き方の一面」を、回答をもとにやわらかく整理したものです。",
  "診断や医療的な評価ではありません。良い・悪いを決めるものでもありません。",
  "時期や環境によって結果は変わります。変わることは自然なことです。",
] as const;

export const AI_UNAVAILABLE_COPY =
  "このページの解釈は、回答とタイプの対応ルールから作られています。AIによる追加の読みときは現在このページにはありません。";

export const PRIVACY_COPY = [
  "この結果ページは、あなたのリンクを知っている人だけが見られます。自動で公開されることはありません。",
  "回答の内容そのものは、このページには表示されません。",
  "保存もLINE連携も、あなたが選んだときだけ行われます。",
] as const;

export const DECLINE_ALL_COPY = "今日はここまでにする(何もしなくて大丈夫です)";
