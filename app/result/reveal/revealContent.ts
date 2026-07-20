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

// CPV1 WS-A1 — DEFECT + CORRECTION (retained as internal evidence, §A1.5).
//
// Original defect: the 120Q result exposed a low/medium "確からしさ" (confidence)
// band, and the "low" copy claimed "回答数がまだ少ないため" ("because too few
// answers were supplied"). Since the band defaulted to "low", a visitor who
// answered ALL 120 questions was told their completion was incomplete/uncertain.
//
// Correction (Founder-approved P0 presentation only — no scoring/logic change):
//  1. a valid 120/120 completion is presented as COMPLETE;
//  2. the "too few answers" text is removed;
//  3. low/medium/high confidence bands are NOT exposed until a validated
//     confidence model is separately approved;
//  4. we show method version + completion status + interpretation limits instead.
//
// CONFIDENCE_COPY is retained here (unused by any surface) purely as internal
// evidence of the original defect; do NOT reintroduce it into the UI.
/** @deprecated CPV1 WS-A1: confidence bands are not exposed until a validated model is approved. */
export const CONFIDENCE_COPY_DEPRECATED_DO_NOT_DISPLAY: Record<"low" | "medium", { label: string; note: string }> = {
  low: {
    label: "確からしさ: ひかえめ",
    note: "回答数がまだ少ないため、いまの見え方は「仮の輪郭」です。日をおいて受け直すと、輪郭が変わることがあります。",
  },
  medium: {
    label: "確からしさ: 中くらい",
    note: "いまの回答からは一貫した傾向が見えていますが、あなたのすべてを表すものではありません。",
  },
};

// The replacement presentation: completion status + method version, no band.
export const COMPLETION_COPY = {
  methodVersion: "いま色 公開割り当て v0.1（120問）",
  statusComplete: "この結果は、120問すべての回答をもとにしています（回答完了）。",
  methodNote:
    "今の傾向をやわらかく整理したものです。確からしさの数値評価（信頼度バンド）は、妥当性が確認できるまで表示していません。",
} as const;

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
