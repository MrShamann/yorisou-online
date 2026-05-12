import type { T6ConfidenceBand, T6OverlayModel, T6ResultModel } from "./t6Types";

export const T6_BASE_RESULTS: T6ResultModel[] = [
  {
    id: "steady_arranger",
    internalCode: "steady_arranger",
    publicName: "順番を整えて進む人",
    recognitionLine: "今のあなたは、勢いだけで進むより、順番や流れが見えたときに力を出しやすいようです。",
    traitChips: ["順番が見えると動きやすい", "無理なく続けたい", "整えてから進む"],
    shortSummary: "visible order and calm pacing",
  },
  {
    id: "quiet_integrator",
    internalCode: "quiet_integrator",
    publicName: "内側で整えてから動く人",
    recognitionLine: "今のあなたは、すぐに外へ出すより、自分の中で少し整理してから動くほうが合いやすいようです。",
    traitChips: ["ひとりで整理しやすい", "納得してから動く", "静かな時間が助けになる"],
    shortSummary: "inner sorting and self-paced timing",
  },
  {
    id: "gentle_navigator",
    internalCode: "gentle_navigator",
    publicName: "空気を見ながら進む人",
    recognitionLine: "今のあなたは、自分だけで押し切るより、まわりの流れや距離感を見ながら進むほうが自然に動きやすいようです。",
    traitChips: ["空気を見て動く", "やさしく調整する", "距離感を大事にする"],
    shortSummary: "relational rhythm and gentle adjustment",
  },
  {
    id: "responsive_adjuster",
    internalCode: "responsive_adjuster",
    publicName: "流れに合わせて動き直す人",
    recognitionLine: "今のあなたは、状況の変化を見ながら、その場で動き方を調整していくほうが合いやすいようです。",
    traitChips: ["変化に反応しやすい", "動きながら調整する", "流れを見て進む"],
    shortSummary: "adaptation and recalibration",
  },
  {
    id: "deliberate_boundary_keeper",
    internalCode: "deliberate_boundary_keeper",
    publicName: "自分の間を守って進む人",
    recognitionLine: "今のあなたは、近づきすぎるより、自分の間を保ちながら関わるほうが落ち着いて進みやすいようです。",
    traitChips: ["自分の間を大事にする", "距離を整える", "ペースを守る"],
    shortSummary: "distance, timing, and protected rhythm",
  },
  {
    id: "rebuilding_mover",
    internalCode: "rebuilding_mover",
    publicName: "整え直して進む人",
    recognitionLine: "今のあなたは、無理に押し切るより、少しずつ整え直しながら進むほうが合いやすいようです。",
    traitChips: ["整え直して進む", "小さく戻す", "無理なく立て直す"],
    shortSummary: "reset rhythm and gradual return",
  },
];

export const T6_FALLBACK_RESULT: T6ResultModel = {
  id: "mixed_state_reader",
  internalCode: "mixed_state_reader",
  publicName: "まだ形を決めすぎない人",
  recognitionLine: "今回の結果では、一つの型に決めすぎるより、いくつかの傾向が混ざって見えているようです。",
  traitChips: ["いくつかの流れがある", "今は決めすぎない", "少しずつ整理中"],
  shortSummary: "mixed signals and gentle retest",
};

export const T6_OVERLAYS: T6OverlayModel[] = [
  {
    id: "gathering",
    publicLabel: "整え中",
    publicLine: "今は、少し整えてから動きやすい状態です。",
    privateLine: "外へ大きく出る前に、自分の中で順番や感覚を集めている流れが見えます。",
  },
  {
    id: "strained",
    publicLabel: "負荷が出やすい時期",
    publicLine: "今は、急な切り替えや重なりに負荷を感じやすいかもしれません。",
    privateLine: "何かが大きく問題というより、重なりや切り替えが続くと、整う前に負荷が出やすい状態です。",
  },
  {
    id: "balancing",
    publicLabel: "バランスを取り直す時期",
    publicLine: "今は、進みたい気持ちと整えたい感覚が同時に出やすい状態です。",
    privateLine: "前に進む力はある一方で、整えずに進むことには少し負荷が出やすい流れです。",
  },
  {
    id: "reopening",
    publicLabel: "少し広げ直す時期",
    publicLine: "少しずつ、外に向けて動き直しやすい流れが出ています。",
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
