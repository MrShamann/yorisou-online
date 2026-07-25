// SR-1 — Personalized Support Plan (deterministic, public-safe).
//
// After any completed understanding flow, this turns a public-safe result into a
// structured plan: what we understood, one primary "what may help now", a
// prioritized "what may help next", why each appeared, and user controls. It is
// PUBLIC-SAFE (only public result label + up to three public traits + a
// current-state note; never raw answers, notes, or scoring internals) and
// DETERMINISTIC (same input → same plan; no opaque classifier). It reuses the
// governed service catalogue (real routes only) so no valid family can produce
// an empty plan or a dead-end (§11, §12).

import {
  getServiceItem,
  type ServiceItem,
  type ServiceItemStatus,
  type ServiceItemType,
} from "@/app/data/sr1/serviceCatalogue";

export type SupportPlanFamily =
  | "imairo"
  | "c02"
  | "f01"
  | "f02"
  | "relationship-fatigue"
  | "love-distance"
  | "local-life"
  | "work-rhythm"
  | "name-impression";

export const SUPPORT_PLAN_FAMILIES: readonly SupportPlanFamily[] = [
  "imairo",
  "c02",
  "f01",
  "f02",
  "relationship-fatigue",
  "love-distance",
  "local-life",
  "work-rhythm",
  "name-impression",
];

export type SupportPlanInput = {
  family: SupportPlanFamily;
  resultLabel?: string; // public display label (e.g. archetype nickname)
  traits?: string[]; // public-safe trait chips
  confidence?: "low" | "medium";
  reportHref?: string | null; // a deeper reading if one exists for this result
  resultPath?: string; // canonical path to re-open the result
};

export type SupportPlanItem = {
  itemId: string;
  title: string;
  type: ServiceItemType;
  href: string;
  estimatedTime: string;
  why: string;
  status: ServiceItemStatus;
};

export type SupportPlan = {
  family: SupportPlanFamily;
  whatWeUnderstood: {
    line: string;
    traits: string[];
    confidenceNote: string;
    boundary: string;
  };
  whatMayHelpNow: SupportPlanItem;
  whatMayHelpNext: SupportPlanItem[];
  whyThese: string;
  controls: string[];
};

// User controls that map to guest-journey feedback signals (§11.5). Only signals
// backed by truthful device-local persistence are offered.
export const SUPPORT_PLAN_CONTROLS = ["保存", "試してみる", "役に立った", "今は違う", "後で見る", "もう表示しない"] as const;

const BOUNDARY = "これは診断ではなく、今の状態のやわらかい整理です。良い・悪いを決めるものではありません。";

type FamilyConfig = {
  understanding: (label?: string) => string;
  primary: string; // catalogue item id
  next: string[]; // catalogue item ids, prioritized
  whyThese: string;
};

// Per-family plan shape. Every config yields a primary + a prioritized next set
// that always includes at least one immediate action or reading, one experience,
// and the save/return action — so coverage is guaranteed for every family.
const FAMILY: Record<SupportPlanFamily, FamilyConfig> = {
  imairo: {
    understanding: (label) =>
      label
        ? `あなたのいま色は「${label}」。今の動き方が、やわらかく表れています。`
        : "今の動き方を、公開できる範囲でやわらかく整理しました。",
    primary: "self-understanding-report",
    next: ["recommendations-next", "grounding-reflection", "save-and-return"],
    whyThese: "今の結果と、続けて読める・試せるものをつなげています。合わなければ調整できます。",
  },
  c02: {
    understanding: () => "今のわたしの状態を、いくつかの角度から整理しました。",
    primary: "grounding-reflection",
    next: ["recommendations-next", "save-and-return"],
    whyThese: "結果を受け取ったあと、その場でできる一歩と、続けかたをつなげています。",
  },
  f01: {
    understanding: () => "向いている働き方の方向を、今の状態から整理しました。",
    primary: "work-rhythm-check",
    next: ["recommendations-next", "grounding-reflection", "save-and-return"],
    whyThese: "働き方のテーマから、もう少し具体的なリズムと次の一歩へつなげています。",
  },
  f02: {
    understanding: () => "合いやすい職場環境の方向を、今の状態から整理しました。",
    primary: "work-rhythm-check",
    next: ["recommendations-next", "grounding-reflection", "save-and-return"],
    whyThese: "環境のテーマから、今のリズムと次の一歩へつなげています。",
  },
  "relationship-fatigue": {
    understanding: () => "今の人間関係で、負担のかかり方が見えてきました。",
    primary: "grounding-reflection",
    next: ["recommendations-next", "save-and-return"],
    whyThese: "距離感のテーマに合わせて、その場でできる一歩と続けかたをつなげています。",
  },
  "love-distance": {
    understanding: () => "近づき方と自分のペースの間の、あなたらしい距離感が見えてきました。",
    primary: "grounding-reflection",
    next: ["recommendations-next", "save-and-return"],
    whyThese: "関係のリズムに合わせて、その場でできる一歩と続けかたをつなげています。",
  },
  "local-life": {
    understanding: () => "今の暮らしの関心テーマが、いくつか見えてきました。",
    primary: "recommendations-next",
    next: ["grounding-reflection", "save-and-return"],
    whyThese: "今の関心から、次に受け取りやすい案内と続けかたをつなげています。",
  },
  "work-rhythm": {
    understanding: () => "集中しやすい環境と、疲れやすいペースが見えてきました。",
    primary: "grounding-reflection",
    next: ["local-life-check", "recommendations-next", "save-and-return"],
    whyThese: "今のリズムから、暮らしのテーマや次の一歩へつなげています。",
  },
  "name-impression": {
    understanding: () => "名前から受ける印象を通して、自分らしさの見え方を整理しました。",
    primary: "grounding-reflection",
    next: ["recommendations-next", "save-and-return"],
    whyThese: "見え方のテーマから、その場でできる一歩と続けかたをつなげています。",
  },
};

function toPlanItem(item: ServiceItem, why: string): SupportPlanItem {
  return {
    itemId: item.id,
    title: item.title,
    type: item.type,
    href: item.href,
    estimatedTime: item.estimatedTime,
    why,
    status: item.availability,
  };
}

// A guaranteed non-empty fallback item so a plan is never empty even if a config
// referenced a missing id (defensive; the configs above all reference real ids).
function fallbackItem(): SupportPlanItem {
  const grounding = getServiceItem("grounding-reflection");
  if (grounding) return toPlanItem(grounding, "今の気持ちの置き場所を、その場で見つけられます。");
  return {
    itemId: "grounding-reflection",
    title: "2分の振り返り",
    type: "guided_experience",
    href: "/experiences/guided/grounding-reflection",
    estimatedTime: "約2分",
    why: "今の気持ちの置き場所を、その場で見つけられます。",
    status: "current",
  };
}

export function buildSupportPlan(input: SupportPlanInput): SupportPlan {
  const config = FAMILY[input.family] ?? FAMILY.imairo;
  const traits = (input.traits ?? []).filter((t) => typeof t === "string" && t.trim()).slice(0, 3);

  // Primary — for imairo, prefer the deeper report only when one truly exists.
  let primaryId = config.primary;
  if (input.family === "imairo" && !input.reportHref) {
    primaryId = "recommendations-next";
  }
  const primaryItem = getServiceItem(primaryId);
  const primary = primaryItem
    ? toPlanItem(
        // when the primary is the report and we have a specific report href, use it
        primaryId === "self-understanding-report" && input.reportHref
          ? { ...primaryItem, href: input.reportHref }
          : primaryItem,
        primaryItem.whyMayFit,
      )
    : fallbackItem();

  const nextIds = config.next.filter((id) => id !== primaryId);
  const next: SupportPlanItem[] = nextIds
    .map((id) => {
      const item = getServiceItem(id);
      return item ? toPlanItem(item, item.whyMayFit) : null;
    })
    .filter((x): x is SupportPlanItem => Boolean(x));

  // Guarantee the save/return action is always present.
  if (!next.some((i) => i.itemId === "save-and-return") && primary.itemId !== "save-and-return") {
    const save = getServiceItem("save-and-return");
    if (save) next.push(toPlanItem(save, save.whyMayFit));
  }

  // CPV1 WS-A1: confidence bands are not exposed until a validated model is
  // approved, so this note is band-independent (no "はっきり/ゆるやか" implication).
  const confidenceNote =
    "今の傾向をやわらかく整理したものです。時期や状況によって変わることがあります。";

  return {
    family: input.family,
    whatWeUnderstood: {
      line: config.understanding(input.resultLabel),
      traits,
      confidenceNote,
      boundary: BOUNDARY,
    },
    whatMayHelpNow: primary,
    whatMayHelpNext: next,
    whyThese: config.whyThese,
    controls: [...SUPPORT_PLAN_CONTROLS],
  };
}
