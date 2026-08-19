// PRODUCT PACK — yorisou.imairo pair adapter 「ふたりのImairo」, adapter yorisou.imairo/pair v1.
//
// Yorisou product IP: the mapping from two EXISTING approved public Imairo result assignments to
// the five humane comparison families. This pack owns the pair copy and nothing else — no
// scoring, no questions, no result calculation, no persistence, no methodology.
//
// WHAT IT READS. Only the approved PUBLIC archetype assignment for a result code: nickname, clan,
// secondary badge. It never sees raw answers, dimension scores, confidence, payloadKey, accepted
// or corrected interpretation, reflection, state or memory — the same protected boundary the
// ARCH-P4 share pack observes, for the same reason.
//
// DELIBERATELY MODEST. There is no 576-combination compatibility matrix and no hidden pair score.
// The adapter distinguishes exactly three honest situations — the same result, the same clan with
// a different result, and different clans — and speaks tentatively about each. Richer approved
// pair copy can replace these templates later WITHOUT touching comparison.core, which is the
// architectural point of putting them here.
//
// THE LANGUAGE RULE IS ENFORCED, NOT JUST DOCUMENTED. `assertNoForbiddenPairLanguage` refuses any
// line carrying compatibility-percentage, soulmate, destiny or perfect-match vocabulary, and every
// line this adapter produces is passed through it before the view is returned. Copy that violates
// the product promise fails loudly at build time rather than reaching a reader.

import {
  COMPARISON_OUTPUT_FAMILIES,
  type ComparisonAdapter,
  type ComparisonInputReference,
  type ComparisonView,
} from "@/lib/platform/comparisonCore";
import { findPublicArchetypeByCode } from "@/lib/yorisou/public-result/taxonomy";

export const IMAIRO_PAIR_ADAPTER_REF = "yorisou.imairo/pair";
export const IMAIRO_PAIR_ADAPTER_VERSION = "1.0.0";
/** The reference family a pair side must carry — the same source family ARCH-P4 publishes from. */
export const IMAIRO_PAIR_REFERENCE_FAMILY = "assessment_result";

/** Consumer title and the mandatory framing shown above every pair view. */
export const IMAIRO_PAIR_TITLE = "ふたりのImairo";
export const IMAIRO_PAIR_SAFETY_FRAMING =
  "相性の良し悪しを決めるものではありません。ふたりの結果を並べて、似ているところと違うところを話すためのものです。";

/** The five presentation labels, in canonical family order. */
export const IMAIRO_PAIR_FAMILY_LABELS: Record<(typeof COMPARISON_OUTPUT_FAMILIES)[number], string> = {
  similarities: "似ているところ",
  differences: "ちがうところ",
  possible_complementarity: "違いが活きるかもしれないところ",
  possible_friction: "すれ違いやすいかもしれないところ",
  shared_question: "ふたりで話してみる問い",
};

/**
 * Vocabulary that must never appear in pair copy. Determinism and ranking are the product risk
 * here, not rudeness: "運命の相手" and "92%" both tell two people something about their
 * relationship that a 120-question snapshot cannot know.
 */
export const IMAIRO_PAIR_FORBIDDEN_PHRASES = [
  "相性",
  "ソウルメイト",
  "soulmate",
  "運命の相手",
  "運命",
  "宿命",
  "ベストマッチ",
  "best match",
  "perfect match",
  "パーフェクトマッチ",
  "完璧",
  "destined",
  "必ず",
  "絶対",
  "診断",
  "占い",
] as const;

/** Refuse any line that carries a percentage or a forbidden relationship claim. */
export function assertNoForbiddenPairLanguage(line: string): void {
  // Any digit followed by a percent sign, in either width — a compatibility score in disguise.
  if (/[0-9０-９]\s*[%％]/.test(line)) throw new Error("imairo_pair_forbidden_percentage");
  const lowered = line.toLowerCase();
  for (const phrase of IMAIRO_PAIR_FORBIDDEN_PHRASES) {
    if (lowered.includes(phrase.toLowerCase())) {
      throw new Error(`imairo_pair_forbidden_language:${phrase}`);
    }
  }
}

type Assignment = NonNullable<ReturnType<typeof findPublicArchetypeByCode>>;

/**
 * The adapter reads `public_reference` — the already-public Imairo result code — and NOTHING else.
 * It deliberately never touches `reference_ref`, the private row reference, so no private id can
 * reach a rendered line even by mistake.
 */
function assignmentFor(side: ComparisonInputReference): Assignment {
  const assignment = findPublicArchetypeByCode(side.public_reference);
  if (!assignment) throw new Error("imairo_pair_unassigned_result");
  return assignment;
}

function similarities(a: Assignment, b: Assignment): string[] {
  if (a.publicCode === b.publicCode) {
    return [
      `今の結果では、ふたりとも「${a.nickname}」でした。`,
      `${a.clanJapanese}のタイプとして、近い動き方が出ているようです。`,
    ];
  }
  if (a.clanJapanese === b.clanJapanese) {
    return [
      `今の結果では、ふたりとも${a.clanJapanese}のタイプでした。`,
      "土台になっている動き方が、似て見えることがあります。",
    ];
  }
  return ["今の結果では、はっきり重なる部分は出ていません。話すなかで見つかることもあります。"];
}

function differences(a: Assignment, b: Assignment): string[] {
  if (a.publicCode === b.publicCode) {
    return ["今の結果の上では、大きな違いは出ていません。同じ結果でも、感じ方は違うことがあります。"];
  }
  const lines = [`あなたは「${a.nickname}」、相手は「${b.nickname}」でした。`];
  if (a.clanJapanese !== b.clanJapanese) {
    lines.push(`${a.clanJapanese}のタイプと${b.clanJapanese}のタイプで、今の出方が違って見えます。`);
  } else {
    lines.push(`同じ${a.clanJapanese}のタイプでも、${a.secondaryBadge}と${b.secondaryBadge}で表れ方が違います。`);
  }
  return lines;
}

function possibleComplementarity(a: Assignment, b: Assignment): string[] {
  if (a.publicCode === b.publicCode) {
    return ["同じ動き方だからこそ、言わなくても伝わることがあるかもしれません。"];
  }
  return [
    `${a.secondaryBadge}と${b.secondaryBadge}は、場面によって助け合うことがあるかもしれません。`,
    "片方が動きにくいときに、もう片方のやり方が役に立つことがあります。",
  ];
}

function possibleFriction(a: Assignment, b: Assignment): string[] {
  if (a.publicCode === b.publicCode) {
    return ["似ているぶん、同じところで同時に止まってしまうことがあるかもしれません。"];
  }
  return [
    "テンポや優先するものが違うと、すれ違って見えることがあるかもしれません。",
    "どちらかが間違っているわけではなく、今の出方が違うだけのことがあります。",
  ];
}

function sharedQuestion(a: Assignment, b: Assignment): string {
  if (a.publicCode === b.publicCode) {
    return "同じ結果になったけれど、最近しんどかった場面は同じでしたか？";
  }
  return "最近、相手のやり方に助けられたのはどんな場面でしたか？";
}

/** The adapter comparison.core consumes. Every produced line passes the language guard first. */
export const imairoPairAdapter: ComparisonAdapter = {
  adapter_ref: IMAIRO_PAIR_ADAPTER_REF,
  adapter_version: IMAIRO_PAIR_ADAPTER_VERSION,
  reference_family: IMAIRO_PAIR_REFERENCE_FAMILY,
  build(sideA: ComparisonInputReference, sideB: ComparisonInputReference): ComparisonView {
    const a = assignmentFor(sideA);
    const b = assignmentFor(sideB);
    const view: ComparisonView = {
      similarities: similarities(a, b),
      differences: differences(a, b),
      possible_complementarity: possibleComplementarity(a, b),
      possible_friction: possibleFriction(a, b),
      shared_question: sharedQuestion(a, b),
    };
    for (const family of COMPARISON_OUTPUT_FAMILIES) {
      const value = view[family];
      const lines = typeof value === "string" ? [value] : value;
      for (const line of lines) assertNoForbiddenPairLanguage(line);
    }
    return view;
  },
};
