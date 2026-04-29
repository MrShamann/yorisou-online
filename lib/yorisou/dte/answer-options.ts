export const CANONICAL_ANSWER_OPTION_IDS = ["A", "B", "C", "D", "E"] as const;

export type CanonicalAnswerOptionId = (typeof CANONICAL_ANSWER_OPTION_IDS)[number];

export const CANONICAL_ANSWER_ARCHITECTURE = {
  optionCount: 5,
  optionIds: CANONICAL_ANSWER_OPTION_IDS,
  mobileTapTargetPx: 52,
  operatingRule: "5 fixed options only; never collapse or expand the public answer architecture.",
} as const;

export function isCanonicalAnswerOptionId(value: string | null | undefined): value is CanonicalAnswerOptionId {
  return CANONICAL_ANSWER_OPTION_IDS.includes((value || "") as CanonicalAnswerOptionId);
}

export function normalizeCanonicalAnswerOptionId(value: string | null | undefined): CanonicalAnswerOptionId {
  return isCanonicalAnswerOptionId(value) ? value : "C";
}

