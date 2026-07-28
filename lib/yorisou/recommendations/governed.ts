// UX-2R / CPC-1 — the governed recommendation catalogue.
//
// Deterministic and finite by construction. No external provider, no generated prose, no numeric
// confidence presented as fact. The same accepted result always yields the same set, which is what
// makes a recommendation auditable rather than merely plausible.
//
// Governance requires every recommendation to be explainable: WHY it appeared, WHAT kind of thing
// it is, that it is OPTIONAL, what its LIMITS are, and whether anyone paid for it to be there. A
// recommendation a person cannot interrogate is indistinguishable from an instruction, and this
// product must never give instructions about someone's inner life.
//
// The copy here is ordinary supportive Japanese, not clinical or diagnostic language.

export const GOVERNED_RECOMMENDATION_CONTENT_VERSION = "grc-v1" as const;

export type GovernedSourceClass =
  | "yorisou_internal"
  | "public_information"
  | "partner_nonpaid"
  | "partner_sponsored";

export type GovernedCommercialStatus = "none" | "disclosed_sponsored" | "disclosed_affiliate";

export type GovernedRecommendation = {
  recommendationKey: string;
  title: string;
  /** Why this appeared, in plain language the person can check against their own sense. */
  reason: string;
  objectType: "resource" | "experience_card" | "internal_route";
  sourceClass: GovernedSourceClass;
  commercialStatus: GovernedCommercialStatus;
  /** What this is NOT. Always shown; never collapsed into a footnote. */
  limitations: string;
  internalRoute?: string;
};

// A small shared pool. Every entry is YORISOU-internal and non-commercial today; the fields exist
// so that a future partner entry cannot be added without declaring its classification.
const CATALOGUE: GovernedRecommendation[] = [
  {
    recommendationKey: "pause_small",
    title: "ひと呼吸おく時間を、今日だけ決めてみる",
    reason: "いまの結果には、少し早く動きがちな傾向が出ていました。",
    objectType: "experience_card",
    sourceClass: "yorisou_internal",
    commercialStatus: "none",
    limitations: "医療・心理の助言ではありません。合わないと感じたら、やらなくて構いません。",
  },
  {
    recommendationKey: "name_one_thing",
    title: "気になっていることを、ひとつだけ書き出す",
    reason: "いまは考えが重なりやすい時期として整理されています。",
    objectType: "experience_card",
    sourceClass: "yorisou_internal",
    commercialStatus: "none",
    limitations: "書き出した内容はあなたの端末の外に送られません。効果を保証するものでもありません。",
  },
  {
    recommendationKey: "distance_check",
    title: "人との距離のとり方を、いまの自分に合わせて見直す",
    reason: "人との関わり方に、いまの状態が出やすいと整理されています。",
    objectType: "internal_route",
    sourceClass: "yorisou_internal",
    commercialStatus: "none",
    limitations: "相手のいる話なので、ここでの整理がそのまま答えになるとは限りません。",
    internalRoute: "/support",
  },
  {
    recommendationKey: "revisit_later",
    title: "しばらくしてから、もう一度いまの状態をみる",
    reason: "状態は変わるものなので、いまの結果を固定しないための入口です。",
    objectType: "internal_route",
    sourceClass: "yorisou_internal",
    commercialStatus: "none",
    limitations: "変化を必ず捉えられるわけではありません。気が向いたときで十分です。",
    internalRoute: "/check-in",
  },
  {
    recommendationKey: "rest_first",
    title: "やることを増やす前に、減らせるものを探す",
    reason: "いまは負荷が高めに出ているため、足すより減らす方向を先に置いています。",
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
 * Deterministic selection: the same accepted result always produces the same three, in the same
 * order. A stable hash of the result code chooses the starting offset, so different results get
 * different sets without any randomness — reproducibility is what lets a recommendation be
 * explained after the fact.
 */
export function buildGovernedRecommendationItems(acceptedResultId: string) {
  let hash = 0;
  for (const ch of acceptedResultId) hash = (hash * 31 + ch.charCodeAt(0)) % 100003;

  const picked: GovernedRecommendation[] = [];
  for (let i = 0; i < 3; i += 1) {
    picked.push(CATALOGUE[(hash + i) % CATALOGUE.length]);
  }

  return picked.map((r) => ({
    recommendationKey: r.recommendationKey,
    objectType: r.objectType,
    sourceClass: r.sourceClass,
    commercialStatus: r.commercialStatus,
    reasonCode: r.recommendationKey,
    limitationsCode: r.recommendationKey,
  }));
}
