import type {
  NamePairRuntime,
  RankedDimension,
  ResultRule,
  RuleBasedResolvedResult,
  RuleBasedResultType,
  RuleBasedRuntime,
  WeightedOption,
  WeightedQuestion,
} from "./types";

export function getOptionId(option: WeightedOption): string {
  return option.key ?? option.id ?? "";
}

export function getOptionLabel(option: WeightedOption): string {
  return option.label_jp ?? option.label ?? getOptionId(option);
}

export function scoreWeightedAnswers(
  questions: readonly WeightedQuestion[],
  answers: Record<string, string>,
): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const question of questions) {
    const answerId = answers[question.id];
    if (!answerId) continue;
    const option = question.options.find((candidate) => getOptionId(candidate) === answerId);
    if (!option?.weights) continue;
    for (const [dimension, value] of Object.entries(option.weights)) {
      totals[dimension] = (totals[dimension] ?? 0) + (value ?? 0);
    }
  }

  return totals;
}

export function rankDimensions(
  totals: Record<string, number>,
  labels: Record<string, string>,
): RankedDimension[] {
  return Object.keys(labels)
    .map((key) => ({
      key,
      score: totals[key] ?? 0,
      label: labels[key],
    }))
    .sort((left, right) => right.score - left.score);
}

function getResultTypeId(resultType: RuleBasedResultType): string {
  return resultType.id ?? resultType.result_type_id ?? "";
}

function getResultTitle(resultType: RuleBasedResultType): string {
  return resultType.display_name_jp ?? resultType.name_jp ?? getResultTypeId(resultType);
}

function getResultSummary(resultType: RuleBasedResultType): string {
  return resultType.public_summary_jp ?? resultType.share_card_line_jp ?? `${getResultTitle(resultType)}タイプ`;
}

function scoreRule(rule: ResultRule, totals: Record<string, number>): number {
  const primary = (rule.primary_trigger_dimensions ?? []).reduce(
    (sum, dimension) => sum + (totals[dimension] ?? 0) * 3,
    0,
  );
  const secondary = (rule.secondary_trigger_dimensions ?? []).reduce(
    (sum, dimension) => sum + (totals[dimension] ?? 0) * 1.5,
    0,
  );
  return primary + secondary;
}

export function resolveRuleBasedResult(
  runtime: RuleBasedRuntime,
  answers: Record<string, string>,
): RuleBasedResolvedResult {
  const totals = scoreWeightedAnswers(runtime.questions, answers);
  const ranked = rankDimensions(totals, runtime.dimensionLabels);
  const lowDimension = [...ranked].reverse().find((dimension) => dimension.score !== ranked[0]?.score) ?? null;

  const scoredRules = Object.entries(runtime.resultRules).map(([resultId, rule]) => ({
    resultId,
    rule,
    score: scoreRule(rule, totals),
  }));
  scoredRules.sort((left, right) => right.score - left.score);

  let chosen = scoredRules[0];
  const second = scoredRules[1];
  if (
    chosen?.rule.low_confidence_fallback &&
    second &&
    Math.abs(chosen.score - second.score) < 3
  ) {
    const fallbackId = chosen.rule.low_confidence_fallback;
    const fallbackRule = runtime.resultRules[fallbackId];
    if (fallbackRule) {
      chosen = {
        resultId: fallbackId,
        rule: fallbackRule,
        score: scoreRule(fallbackRule, totals),
      };
    }
  }

  const resultType =
    runtime.resultTypes.find((candidate) => getResultTypeId(candidate) === chosen?.resultId) ??
    runtime.resultTypes[0];

  return {
    resultId: getResultTypeId(resultType),
    title: getResultTitle(resultType),
    summary: getResultSummary(resultType),
    score: Math.max(...Object.values(totals), 0),
    topDimensions: ranked.slice(0, 3),
    lowDimension,
  };
}

export function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function pickSeededIndex(seed: string, poolLength: number, offset = 0): number {
  if (poolLength === 0) return 0;
  return (hashString(seed) + offset) % poolLength;
}

export function buildTrendLines(result: RuleBasedResolvedResult): string[] {
  return result.topDimensions
    .filter((dimension) => dimension.score !== 0)
    .slice(0, 3)
    .map((dimension, index) => {
      if (index === 0) {
        return `今は「${dimension.label}」が前に出やすいタイミングです。`;
      }
      if (index === 1) {
        return `「${dimension.label}」を意識すると、動き方や選び方の輪郭が見えやすくなります。`;
      }
      return `「${dimension.label}」も、今のペースや受け取り方に静かに関わっています。`;
    });
}

export function buildFrictionLine(result: RuleBasedResolvedResult): string {
  if (!result.lowDimension) {
    return "今日は、大きく決めるよりも、無理なく続けられる条件を確かめる使い方が向いています。";
  }
  return `一方で「${result.lowDimension.label}」まわりでは、無理や引っかかりが出やすいかもしれません。`;
}

export function buildNamePairOffset(
  runtime: NamePairRuntime,
  answers: Record<string, string>,
): number {
  return runtime.optionalQuestions.reduce((sum, question, questionIndex) => {
    const answerId = answers[question.id];
    if (!answerId) return sum;
    const optionIndex = question.options.findIndex((option) => option.key === answerId);
    return sum + Math.max(optionIndex, 0) + questionIndex;
  }, 0);
}
