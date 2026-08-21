// UX-1 — AI-native visual direction prototype ("Living Understanding Field").
//
// VISUAL_DIRECTION_PROTOTYPE / NOT_CURRENT_PRODUCTION_CAPABILITY.
//
// Every capability label below is taken from the governed CPV1 method registry
// truth (lib/cpv1/methods.ts → methodActivationState), so the prototype can never
// present a planned method as live. Any *state* shown on these surfaces is
// explicitly synthetic prototype state — it is never read from, or written to,
// Production. No governed result copy, taxonomy, scoring or question content is
// imported or restated here.

export type LensStatus =
  | "active_public" // route verified on production main; usable today
  | "active_private_pilot" // implemented, Founder/Admin private pilot only
  | "not_available"; // gated — NOT usable, shown only as an honest boundary

export type SourceClass =
  | "answers" // derived from the person's own answers
  | "recorded_state" // recorded by the person over time
  | "user_correction" // stated by the person themselves
  | "prototype_concept"; // prototype-only, not a live capability

export const SOURCE_LABEL: Record<SourceClass, string> = {
  answers: "回答から",
  recorded_state: "記録から",
  user_correction: "あなたの訂正から",
  prototype_concept: "プロトタイプ表現",
};

/** A method shown as a distinct "lens" on the field. Status is registry truth. */
export type Lens = {
  id: string;
  nameJa: string;
  /** what this lens looks at, in ordinary Japanese */
  looksAtJa: string;
  status: LensStatus;
  /** minutes, only when honestly known */
  minutes: number | null;
  /** what kind of result it produces */
  producesJa: string;
  /** angle on the field, degrees (deterministic layout) */
  angle: number;
  /** distance from centre 0..1 — how much this lens currently informs the field */
  weight: number;
  loginRequired: boolean;
  privateByDefault: boolean;
};

/**
 * Registry truth (lib/cpv1/methods.ts, 2026-07-27):
 *   implemented_route_verified → imairo-120q, c02-current-state, relationship-fatigue-24q,
 *     f01-work-fit, f02-workplace-fit, love-distance, work-rhythm, local-life, name-impression
 *   implemented_private       → daily-check-in, yorisou-values   (Founder/Admin private pilot)
 *   gated                     → 17 further methods (never presented as usable)
 */
export const LENSES: Lens[] = [
  {
    id: "imairo-120q",
    nameJa: "いま色テスト（120問）",
    looksAtJa: "いまの動き方をひと通り見る",
    status: "active_public",
    minutes: 15,
    producesJa: "いまの傾向のよび名と、ひとつの気づき",
    angle: 198,
    weight: 0.86,
    loginRequired: false,
    privateByDefault: true,
  },
  {
    id: "c02-current-state",
    nameJa: "今のわたしチェック",
    looksAtJa: "いまの状態を短く確かめる",
    status: "active_public",
    minutes: 5,
    producesJa: "いまの状態の要約",
    angle: 258,
    weight: 0.62,
    loginRequired: false,
    privateByDefault: true,
  },
  {
    id: "daily-check-in",
    nameJa: "きょうの空模様",
    looksAtJa: "その日の調子をひとことで残す",
    status: "active_private_pilot",
    minutes: 1,
    producesJa: "点数ではなく、きょうのひとこと",
    angle: 318,
    weight: 0.71,
    loginRequired: true,
    privateByDefault: true,
  },
  {
    id: "yorisou-values",
    nameJa: "いま大事にしたいことチェック",
    looksAtJa: "いまの優先順位を見てみる",
    status: "active_private_pilot",
    minutes: 8,
    producesJa: "「〜時期」という、いまの置き方",
    angle: 18,
    weight: 0.93,
    loginRequired: true,
    privateByDefault: true,
  },
  {
    id: "relationship-fatigue-24q",
    nameJa: "人間関係の疲れチェック",
    looksAtJa: "人との距離のとり方を見る",
    status: "active_public",
    minutes: 6,
    producesJa: "いまの距離感の傾向",
    angle: 78,
    weight: 0.48,
    loginRequired: false,
    privateByDefault: true,
  },
  {
    id: "f01-work-fit",
    nameJa: "向いている働き方",
    looksAtJa: "働き方の相性を見る",
    status: "active_public",
    minutes: 7,
    producesJa: "働き方の傾向",
    angle: 138,
    weight: 0.35,
    loginRequired: false,
    privateByDefault: true,
  },
];

/** Intent-first entry (Surface 2). Intents are ordinary language, not a catalog. */
export type Intent = {
  id: string;
  labelJa: string;
  subJa: string;
  lensIds: string[];
};

export const INTENTS: Intent[] = [
  { id: "now", labelJa: "今の自分を知る", subJa: "まとまった時間で、ひと通り見てみる", lensIds: ["imairo-120q", "c02-current-state"] },
  { id: "daily", labelJa: "日々の状態を見つめる", subJa: "1分だけ、きょうを残す", lensIds: ["daily-check-in"] },
  { id: "values", labelJa: "大切にしているものを知る", subJa: "いまの優先順位を確かめる", lensIds: ["yorisou-values"] },
  { id: "relation", labelJa: "関係や距離感を考える", subJa: "人との距離のとり方を見る", lensIds: ["relationship-fatigue-24q"] },
  { id: "next", labelJa: "次の一歩を探す", subJa: "いまの状態に近いところから、小さく選ぶ", lensIds: ["f01-work-fit", "c02-current-state"] },
];

/** Honest boundary for the 17 registry-gated methods. Never shown as usable. */
export const NOT_AVAILABLE_NOTE_JA =
  "占い・伝統的な手法（紫微斗数、四柱推命、タロットなど17件）は登録だけされていて、まだ使えません。内容も判断も用意していないので、ここには出しません。";

// ── Synthetic prototype state (Surface 3 / 4) ────────────────────────────────
// Clearly synthetic. Not a real person, not Production data, never persisted.

export type FieldPoint = { x: number; y: number };

/** The current reading, expressed as a PERIOD (not a fixed type). */
export type Reading = {
  /** period-style name — deliberately "〜時期", never a personality label */
  periodJa: string;
  /** one-line recognition, prototype copy (governed result copy is NOT reused) */
  recognitionJa: string;
  /** which lens produced this reading */
  lensId: string;
  source: SourceClass;
  /** honest, non-numeric confidence band */
  certaintyJa: string;
  /** what this reading does NOT mean */
  notMeaningJa: string;
  /** field position this reading corresponds to */
  position: FieldPoint;
};

export const READING_PRIMARY: Reading = {
  periodJa: "見通しを確かめたい時期",
  recognitionJa: "先が読めることを、いまは少し多めに確かめておきたい。そんな置き方が続いています。",
  lensId: "yorisou-values",
  source: "answers",
  certaintyJa: "確からしさ: ひかえめ（いまの回答から見える、仮の輪郭です）",
  notMeaningJa: "慎重な性格だ、という意味ではありません。時期や環境が変われば、この置き方も変わります。",
  position: { x: 0.31, y: 0.38 },
};

/** After the person says "少し違う" — the field reorganizes to this reading. */
export const READING_CORRECTED: Reading = {
  periodJa: "あたたかさを近くに置きたい時期",
  recognitionJa: "見通しよりも、近くの人との距離のほうを、いまは確かめておきたい。",
  lensId: "yorisou-values",
  source: "user_correction",
  certaintyJa: "確からしさ: あなたの訂正が最優先（あなたが言い直した内容を、そのまま置いています）",
  notMeaningJa: "前の読みが間違いだった、という意味ではありません。いまの置き方が動いた、というだけです。",
  position: { x: 0.66, y: 0.57 },
};

/** History = trajectory, oldest → newest. Synthetic. */
export const TRAJECTORY: { labelJa: string; whenJa: string; position: FieldPoint }[] = [
  { labelJa: "整える手前だった頃", whenJa: "3か月前", position: { x: 0.72, y: 0.24 } },
  { labelJa: "少しペースを戻した頃", whenJa: "6週間前", position: { x: 0.52, y: 0.3 } },
  { labelJa: "見通しを確かめたい時期", whenJa: "先週", position: { x: 0.31, y: 0.38 } },
];

/** Recommendations must state WHY, from the current field position. */
export type Suggestion = { titleJa: string; whyJa: string; source: SourceClass; optional: true };

export const SUGGESTIONS_FOR: Record<string, Suggestion[]> = {
  primary: [
    {
      titleJa: "今週の予定を、ひとつだけ先に決めておく",
      whyJa: "「見通しを確かめたい」がいま強めに出ているため、先が見える小さな予定が合いやすいかもしれません。",
      source: "answers",
      optional: true,
    },
    {
      titleJa: "きょうの空模様を1分だけ残す",
      whyJa: "続けて残しておくと、この置き方が続くのか、動くのかが見えてきます。",
      source: "recorded_state",
      optional: true,
    },
  ],
  corrected: [
    {
      titleJa: "近くの人に、短い連絡をひとつ",
      whyJa: "あなたが「あたたかさを近くに置きたい」と言い直したので、そちらに合わせて置き直しました。",
      source: "user_correction",
      optional: true,
    },
    {
      titleJa: "きょうの空模様を1分だけ残す",
      whyJa: "続けて残しておくと、この置き方が続くのか、動くのかが見えてきます。",
      source: "recorded_state",
      optional: true,
    },
  ],
};

export const PROTOTYPE_BANNER_JA =
  "これは方向性を確かめるためのプロトタイプです。表示されている状態はすべて架空のもので、実際のデータではありません。";
