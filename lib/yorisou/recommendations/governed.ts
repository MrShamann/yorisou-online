// UX-2R / CPC-1 — the governed recommendation catalogue.
//
// CORRECTED after review. The first version hashed the accepted result to pick three entries and
// then displayed entry-specific claims — "少し早く動きがちな傾向", "考えが重なりやすい時期",
// "負荷が高め". Determinism made the SELECTION reproducible; it did nothing to make those claims
// TRUE. A hash cannot license a statement about a person's tendencies, and asserting one anyway is
// the fabricated-inference failure this product exists to avoid.
//
// The reason a recommendation appears must now be traceable to governed content. Where the
// approved taxonomy supports a result-specific mapping, that mapping is stated explicitly below.
// Where it does not — which is currently everywhere, because no such mapping has been approved —
// the reason falls back to something that asserts nothing about the person beyond the fact they
// confirmed a result. That fallback is deliberately dull. A dull true sentence is worth more than
// an evocative invented one.
//
// Determinism is retained for auditability: the same accepted result always yields the same set.

export const GOVERNED_RECOMMENDATION_CONTENT_VERSION = "grc-v2" as const;

export type GovernedSourceClass =
  | "yorisou_internal"
  | "public_information"
  | "partner_nonpaid"
  | "partner_sponsored";

export type GovernedCommercialStatus = "none" | "disclosed_sponsored" | "disclosed_affiliate";

export type GovernedRecommendation = {
  recommendationKey: string;
  title: string;
  objectType: "resource" | "experience_card" | "internal_route";
  sourceClass: GovernedSourceClass;
  commercialStatus: GovernedCommercialStatus;
  limitations: string;
  internalRoute?: string;
};

/**
 * Result-specific reason mappings.
 *
 * EMPTY BY DESIGN. Populating it requires methodology authority to state which governed taxonomy
 * content supports which recommendation, and no such authorization exists. Until then every reason
 * comes from the conservative fallback, and nothing claims a trait.
 *
 * Shape, so a future approved mapping has somewhere correct to land:
 *   "MS-KI": { pause_small: "…governed Japanese reason derived from approved MS-KI content…" }
 */
export const GOVERNED_RESULT_REASON_MAP: Record<string, Record<string, string>> = {};

/**
 * The conservative reason. It states only what is demonstrably true: the person confirmed a
 * result, and this is offered as a low-cost option. No tendency, no state, no inference.
 */
export const CONSERVATIVE_REASON =
  "あなたが確認した今の結果から、負担の少ない選択肢として表示しています。特定の傾向があると判断したものではありません。";

/** Every catalogue entry describes only ITSELF. None describes the reader. */
const CATALOGUE: GovernedRecommendation[] = [
  {
    recommendationKey: "pause_small",
    title: "ひと呼吸おく時間を、今日だけ決めてみる",
    objectType: "experience_card",
    sourceClass: "yorisou_internal",
    commercialStatus: "none",
    limitations: "医療・心理の助言ではありません。合わないと感じたら、やらなくて構いません。",
  },
  {
    recommendationKey: "name_one_thing",
    title: "気になっていることを、ひとつだけ書き出す",
    objectType: "experience_card",
    sourceClass: "yorisou_internal",
    commercialStatus: "none",
    limitations: "書き出した内容はあなたの端末の外に送られません。効果を保証するものでもありません。",
  },
  {
    recommendationKey: "distance_check",
    title: "人との距離のとり方を、いまの自分に合わせて見直す",
    objectType: "internal_route",
    sourceClass: "yorisou_internal",
    commercialStatus: "none",
    limitations: "相手のいる話なので、ここでの整理がそのまま答えになるとは限りません。",
    internalRoute: "/support",
  },
  {
    recommendationKey: "revisit_later",
    title: "しばらくしてから、もう一度いまの状態をみる",
    objectType: "internal_route",
    sourceClass: "yorisou_internal",
    commercialStatus: "none",
    limitations: "変化を必ず捉えられるわけではありません。気が向いたときで十分です。",
    internalRoute: "/check-in",
  },
  {
    recommendationKey: "rest_first",
    title: "やることを増やす前に、減らせるものを探す",
    objectType: "experience_card",
    sourceClass: "yorisou_internal",
    commercialStatus: "none",
    limitations: "状況によっては減らせないこともあります。無理に当てはめないでください。",
  },
];

const BY_KEY = new Map(CATALOGUE.map((r) => [r.recommendationKey, r]));

export function findGovernedRecommendation(key: string): GovernedRecommendation | null {
  return BY_KEY.get(key) ?? null;
}

/**
 * Resolve the displayed reason.
 *
 * An approved result-specific reason wins; otherwise the conservative one. A reason is NEVER
 * synthesised from the recommendation's own content, which is how the previous version ended up
 * asserting things about the reader.
 */
export function resolveGovernedReason(acceptedResultId: string, recommendationKey: string): string {
  return GOVERNED_RESULT_REASON_MAP[acceptedResultId]?.[recommendationKey] ?? CONSERVATIVE_REASON;
}

/** True when the reason shown is a governed result-specific one rather than the fallback. */
export function hasGovernedResultMapping(acceptedResultId: string, recommendationKey: string) {
  return Boolean(GOVERNED_RESULT_REASON_MAP[acceptedResultId]?.[recommendationKey]);
}

/**
 * Deterministic selection — the same accepted result always yields the same three, in the same
 * order, so a set can be explained after the fact. Selection is reproducible; it is NOT evidence
 * about the person, and the reason copy no longer pretends otherwise.
 */
export function buildGovernedRecommendationItems(acceptedResultId: string) {
  let hash = 0;
  for (const ch of acceptedResultId) hash = (hash * 31 + ch.charCodeAt(0)) % 100003;

  const picked: GovernedRecommendation[] = [];
  for (let i = 0; i < 3; i += 1) picked.push(CATALOGUE[(hash + i) % CATALOGUE.length]);

  return picked.map((r) => ({
    recommendationKey: r.recommendationKey,
    objectType: r.objectType,
    sourceClass: r.sourceClass,
    commercialStatus: r.commercialStatus,
    reasonCode: r.recommendationKey,
    limitationsCode: r.recommendationKey,
  }));
}
