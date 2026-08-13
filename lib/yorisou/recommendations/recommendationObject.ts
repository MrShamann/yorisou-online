// PXR-1 — the recommendation object.
//
// ONE shape for every "here is something you could do next", wherever it appears: 今日, 探す,
// わたし, the Result. Before this, each surface invented its own card and its own justification
// sentence, so whether an offer was honest depended on which file it lived in.
//
// THE RULE THIS ENCODES: an offer may only claim the evidence it was actually handed.
//
// The reason is not a string a caller writes. It is a CLASS, derived from evidence, and the
// disclosure sentence is looked up from a frozen map. A caller that wants to say "because of your
// check-in" must pass the check-in. Pass nothing and the object degrades to GENERAL_DISCOVERY and
// says so — it does not quietly keep the flattering reason.
//
// This is the same discipline as `governed.ts`, which refuses to let a hash license a claim about a
// person. That module governs WHAT may be offered from the assessment catalogue; this one governs
// WHY any offer is on screen. They compose: a governed catalogue entry becomes a recommendation
// object by being given evidence, or by being honestly labelled as having none.
//
// COPY_REFINEMENT_REQUIRED — the Japanese below is minimal, neutral, and structurally correct. It
// is written to be true, not final. Yorisou Agent refinement is expected; the CLASSES are not
// copy and must not drift.

export const RECOMMENDATION_OBJECT_VERSION = "pxr1-recommendation-v1" as const;

/**
 * Why this is on screen. Ordered from most to least personal.
 *
 * There is deliberately no class meaning "because we think you are X". Yorisou does not infer
 * traits to recommend from, so no reason class can express one.
 */
export type RecommendationReasonClass =
  | "BASED_ON_CURRENT_CHECKIN"
  | "BASED_ON_RECENT_RESULT"
  | "BASED_ON_EXPLICIT_INTEREST"
  | "EDITORIAL_FALLBACK"
  | "GENERAL_DISCOVERY";

/**
 * What the caller actually holds. Each variant carries the specific facts its class is allowed to
 * cite, so a reason can never be more specific than its evidence.
 */
export type RecommendationEvidence =
  | { kind: "current_checkin"; intentLabel: string; capturedAt: string }
  | { kind: "recent_result"; resultLabel: string; savedAt: string }
  | { kind: "explicit_interest"; interestLabel: string }
  | { kind: "editorial" }
  | { kind: "none" };

/** The disclosure behind なぜこれ？. Frozen: never assembled, never caller-supplied. */
export const REASON_DISCLOSURE: Record<RecommendationReasonClass, string> = {
  BASED_ON_CURRENT_CHECKIN:
    "さきほどの短いチェックインで、あなたが選んだ内容にもとづいて表示しています。あなたの状態を判断したものではありません。",
  BASED_ON_RECENT_RESULT:
    "この端末に保存されている直近の結果にもとづいて表示しています。結果が変われば、ここに出るものも変わります。",
  BASED_ON_EXPLICIT_INTEREST:
    "あなたが「気になる」として選んだテーマにもとづいて表示しています。ほかの情報は使っていません。",
  EDITORIAL_FALLBACK:
    "よりそうがあらかじめ用意している内容から表示しています。あなたのデータは使っていません。",
  GENERAL_DISCOVERY:
    "まだあなたについて分かっていることがないため、はじめての方にも合う内容を表示しています。",
};

/** The one-line attribution shown on the card itself, above the fold of the disclosure. */
export const REASON_SUMMARY: Record<RecommendationReasonClass, string> = {
  BASED_ON_CURRENT_CHECKIN: "今日えらんだ内容から",
  BASED_ON_RECENT_RESULT: "保存されている結果から",
  BASED_ON_EXPLICIT_INTEREST: "気になると選んだテーマから",
  EDITORIAL_FALLBACK: "よりそうが用意した内容",
  GENERAL_DISCOVERY: "はじめての方に",
};

export type RecommendationObject = {
  version: typeof RECOMMENDATION_OBJECT_VERSION;
  /** Stable across renders and across sessions — 保存する and 今は違う key off this. */
  id: string;
  title: string;
  body: string;
  href: string;
  ctaLabel: string;
  reasonClass: RecommendationReasonClass;
  /** Short attribution for the card. */
  reasonSummary: string;
  /** Full sentence revealed by なぜこれ？. */
  reasonDisclosure: string;
  /**
   * The concrete fact the class rests on, when there is one — e.g. 「少し休みたい」. Null for the
   * two impersonal classes, because there is nothing personal to name.
   */
  evidenceDetail: string | null;
  /** What this offer cannot do. Present on every object; an offer with no stated limit is a claim. */
  limitations: string;
};

type BuildInput = {
  id: string;
  title: string;
  body: string;
  href: string;
  ctaLabel: string;
  limitations: string;
  evidence: RecommendationEvidence;
};

/**
 * Derive the class from evidence, degrading when the evidence is not actually there.
 *
 * The empty-string checks are the point of this function. A surface that reads a local record and
 * gets a partial or cleared one would otherwise pass `{ kind: "current_checkin", intentLabel: "" }`
 * and produce a card claiming personalization it cannot show. Degrading to GENERAL_DISCOVERY is
 * the honest failure: the offer still appears, its justification stops overclaiming.
 */
export function classifyRecommendationEvidence(
  evidence: RecommendationEvidence,
): { reasonClass: RecommendationReasonClass; evidenceDetail: string | null } {
  switch (evidence.kind) {
    case "current_checkin":
      if (!evidence.intentLabel.trim() || !evidence.capturedAt.trim()) break;
      return { reasonClass: "BASED_ON_CURRENT_CHECKIN", evidenceDetail: evidence.intentLabel };
    case "recent_result":
      if (!evidence.resultLabel.trim() || !evidence.savedAt.trim()) break;
      return { reasonClass: "BASED_ON_RECENT_RESULT", evidenceDetail: evidence.resultLabel };
    case "explicit_interest":
      if (!evidence.interestLabel.trim()) break;
      return { reasonClass: "BASED_ON_EXPLICIT_INTEREST", evidenceDetail: evidence.interestLabel };
    case "editorial":
      return { reasonClass: "EDITORIAL_FALLBACK", evidenceDetail: null };
    case "none":
      break;
  }
  return { reasonClass: "GENERAL_DISCOVERY", evidenceDetail: null };
}

/**
 * Build a recommendation object.
 *
 * There is no parameter for the reason text, by design. Every path to the sentence a person reads
 * runs through `REASON_DISCLOSURE`, so the set of things Yorisou can claim about why something was
 * shown is finite, reviewable, and identical on every surface.
 */
export function buildRecommendationObject(input: BuildInput): RecommendationObject {
  const { reasonClass, evidenceDetail } = classifyRecommendationEvidence(input.evidence);
  return {
    version: RECOMMENDATION_OBJECT_VERSION,
    id: input.id,
    title: input.title,
    body: input.body,
    href: input.href,
    ctaLabel: input.ctaLabel,
    reasonClass,
    reasonSummary: REASON_SUMMARY[reasonClass],
    reasonDisclosure: REASON_DISCLOSURE[reasonClass],
    evidenceDetail,
    limitations: input.limitations,
  };
}

/** True when the object rests on something the person did, rather than on editorial defaults. */
export function isPersonalRecommendation(object: RecommendationObject): boolean {
  return (
    object.reasonClass === "BASED_ON_CURRENT_CHECKIN" ||
    object.reasonClass === "BASED_ON_RECENT_RESULT" ||
    object.reasonClass === "BASED_ON_EXPLICIT_INTEREST"
  );
}
