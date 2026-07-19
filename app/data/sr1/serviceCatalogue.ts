// SR-1 — governed service catalogue.
//
// One public-safe support-item model. Every item is a REAL in-product action,
// reading, guided experience, or existing verified destination. There are NO
// fabricated suppliers, products, events, testimonials, or availability claims,
// and placement is never for sale (§13). Where no verified external service
// exists, the catalogue uses an in-product action / reflection / report /
// guided experience instead of an empty placeholder.

export type ServiceItemType =
  | "small_action"
  | "reflection"
  | "report"
  | "guided_experience"
  | "public_resource"
  | "return_action";

export type ServiceItemStatus = "current" | "prototype";

export type ServiceItem = {
  id: string;
  title: string;
  type: ServiceItemType;
  description: string;
  whyMayFit: string; // default reason; a plan may override with a result-specific reason
  eligibilityTags: string[]; // result families / needs this fits
  availability: ServiceItemStatus;
  source: string; // provenance
  privacy: "device-local" | "public-safe" | "account";
  href: string; // internal route only
  external: boolean;
  estimatedTime: string;
  locale: "ja";
  reviewState: "published";
};

// Real items only. Destinations are existing, working routes.
export const SR1_SERVICE_CATALOGUE: readonly ServiceItem[] = [
  {
    id: "grounding-reflection",
    title: "2分の振り返り",
    type: "guided_experience",
    description: "考え込まずに、今の気持ちの置き場所を見つける短い振り返り。",
    whyMayFit: "その場でできて、今の状態を少し言葉にできます。",
    eligibilityTags: ["imairo", "relationship-fatigue", "love-distance", "work-rhythm", "local-life", "name-impression", "shift-mood", "where-to-start", "organize-self"],
    availability: "current",
    source: "in-product guided experience (SR-1)",
    privacy: "device-local",
    href: "/experiences/guided/grounding-reflection",
    external: false,
    estimatedTime: "約2分",
    locale: "ja",
    reviewState: "published",
  },
  {
    id: "self-understanding-report",
    title: "自己理解レポートを読む",
    type: "report",
    description: "今の状態を、無料結果より少し具体的に読み直す読みもの。",
    whyMayFit: "結果のあと、もう少し深く自分の動き方を読みたいときに。",
    eligibilityTags: ["imairo"],
    availability: "current",
    source: "content/yorisou/reports/self-understanding",
    privacy: "public-safe",
    href: "/reports",
    external: false,
    estimatedTime: "約5分",
    locale: "ja",
    reviewState: "published",
  },
  {
    id: "recommendations-next",
    title: "今のあなたに合うヒントを見る",
    type: "small_action",
    description: "今の状態に合う、理由つきの次の一歩を少しだけ見つける。",
    whyMayFit: "次に試しやすい選択肢を、理由つきで受け取れます。表示順は買えません。",
    eligibilityTags: ["imairo", "relationship-fatigue", "love-distance", "work-rhythm", "local-life", "find-fit"],
    availability: "current",
    source: "recommendation next-actions (deterministic)",
    privacy: "device-local",
    href: "/recommendations",
    external: false,
    estimatedTime: "約1分",
    locale: "ja",
    reviewState: "published",
  },
  {
    id: "relationship-fatigue-check",
    title: "人間関係の疲れチェック",
    type: "small_action",
    description: "会う・返す・合わせるのどこに負担が出ているかを整理する。",
    whyMayFit: "人との距離感が気になるときに、今の負担のかかり方を見られます。",
    eligibilityTags: ["imairo", "relationship-distance", "love-distance"],
    availability: "current",
    source: "app/tests/relationship-fatigue",
    privacy: "device-local",
    href: "/tests/relationship-fatigue",
    external: false,
    estimatedTime: "約3〜5分",
    locale: "ja",
    reviewState: "published",
  },
  {
    id: "work-rhythm-check",
    title: "仕事のリズムチェック",
    type: "small_action",
    description: "集中しやすい環境や疲れやすいペースを軽く整理する。",
    whyMayFit: "仕事や生活のリズムを整えたいときに。",
    eligibilityTags: ["imairo", "work-life-rhythm"],
    availability: "current",
    source: "app/tests/work-rhythm",
    privacy: "device-local",
    href: "/tests/work-rhythm",
    external: false,
    estimatedTime: "約2〜3分",
    locale: "ja",
    reviewState: "published",
  },
  {
    id: "save-and-return",
    title: "この端末に残して、あとで戻る",
    type: "return_action",
    description: "今の結果をこの端末に保存し、いつでも続きから戻れるようにする。",
    whyMayFit: "続けかたはあなたが選べます。保存はこの端末だけ、いつでも削除できます。",
    eligibilityTags: ["imairo", "relationship-fatigue", "love-distance", "work-rhythm", "local-life", "name-impression"],
    availability: "current",
    source: "device-local save (SR-1)",
    privacy: "device-local",
    href: "/my-yorisou",
    external: false,
    estimatedTime: "すぐ",
    locale: "ja",
    reviewState: "published",
  },
  {
    id: "local-life-check",
    title: "暮らしの関心チェック",
    type: "small_action",
    description: "生活リズムや小さな次の一歩を、今の関心として整理する。",
    whyMayFit: "暮らしの中の小さな次の一歩を見つけたいときに。",
    eligibilityTags: ["imairo", "work-life-rhythm", "local-life"],
    availability: "current",
    source: "app/tests/local-life",
    privacy: "device-local",
    href: "/tests/local-life",
    external: false,
    estimatedTime: "約2分",
    locale: "ja",
    reviewState: "published",
  },
] as const;

const BY_ID = new Map(SR1_SERVICE_CATALOGUE.map((item) => [item.id, item]));

export function getServiceItem(id: string): ServiceItem | undefined {
  return BY_ID.get(id);
}

export function serviceItemsForTag(tag: string): ServiceItem[] {
  return SR1_SERVICE_CATALOGUE.filter((item) => item.eligibilityTags.includes(tag));
}
