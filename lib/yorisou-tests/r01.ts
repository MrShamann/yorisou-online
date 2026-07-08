import { r01FutariRenaiAishoShindanV13 } from "./generated/R01_futari_renai_aisho_shindan_v1_3";
import type {
  RelationshipPairResolvedResult,
  RelationshipPairRuntime,
  TestCatalogEntry,
} from "./types";

const dimensionLabels = Object.fromEntries(
  r01FutariRenaiAishoShindanV13.dimensions.map((dimension) => [dimension.id, dimension.label]),
) as Record<string, string>;

export const r01CatalogEntry: TestCatalogEntry = {
  slug: "r01",
  testId: "R01",
  title: "ふたり恋愛相性診断",
  description: "連絡の温度、近づくペース、話し合い方を、ふたりそれぞれの回答からやさしく見直す入口です。",
  estimatedTime: "約6〜9分",
  category: "恋愛・関係",
  boundaryNote: "運命・結婚・別れを決めるものではありません。ふたりの距離感や安心の作り方を見直すための公開リフレクションです。",
  ctaLabel: "ふたりでチェックする",
  route: "/tests/r01",
  status: "available",
};

export const r01Runtime: RelationshipPairRuntime = {
  slug: "r01",
  testId: "R01",
  title: "ふたり恋愛相性診断",
  introTitle: "ふたりの「合う・合わない」より、\n続きやすいリズムを見てみる。",
  introDescription:
    "連絡の頻度、近づくペース、話し合い方、ひとり時間。ふたりの答えを並べることで、温度差そのものを責め合いの材料にせず、安心の作り方をやさしく整理します。",
  estimatedTime: r01CatalogEntry.estimatedTime,
  questionCountTotal: r01FutariRenaiAishoShindanV13.question_count_total,
  questionCountPerPerson: r01FutariRenaiAishoShindanV13.question_count_per_person,
  participants: [
    { id: "A", label_jp: "ひとり目", intro_jp: "まずは、あなたの感覚に近いほうを軽く選んでください。" },
    { id: "B", label_jp: "ふたり目", intro_jp: "次は、相手の人にも同じ 30 問を答えてもらいます。" },
  ],
  dimensions: r01FutariRenaiAishoShindanV13.dimensions,
  questions: r01FutariRenaiAishoShindanV13.questions,
  resultTypes: r01FutariRenaiAishoShindanV13.result_types,
  tieBreakOrder: r01FutariRenaiAishoShindanV13.assignment_rules.tie_break_order,
  fallbackResultId: r01FutariRenaiAishoShindanV13.assignment_rules.fallback_result,
  boundaryNote:
    "これは恋愛の結論を決めるものではありません。相性を断定するのではなく、ふたりの距離感や関係リズムを振り返るためのチェックです。片方の答えを責める材料として表示することはありません。",
  reportTeaserLabel: "もっと深く読む",
  relatedRoutes: [
    { href: "/tests/c02", label: "今のわたしチェックを見る" },
    { href: "/tests/f02", label: "職場環境フィット診断を見る" },
    { href: "/tests/r04", label: "名前相性チェックを見る" },
  ],
};

function scoreParticipant(
  answers: Record<string, string>,
  person: "A" | "B",
): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const question of r01Runtime.questions) {
    if (question.person !== person) continue;
    const selected = answers[question.id];
    if (!selected) continue;
    const option = question.options.find((candidate) => candidate.label === selected);
    if (!option) continue;
    for (const [dimension, value] of Object.entries(option.score)) {
      totals[dimension] = (totals[dimension] ?? 0) + value;
    }
  }

  return totals;
}

function rankGaps(gaps: Record<string, number>) {
  return Object.entries(dimensionLabels)
    .map(([id, label]) => ({ id, label, gap: gaps[id] ?? 0 }))
    .sort((left, right) => right.gap - left.gap);
}

function confidenceFromGaps(triggerDims: readonly string[], gaps: Record<string, number>) {
  const targetGaps = triggerDims
    .filter((dimension) => dimension !== "balanced")
    .map((dimension) => gaps[dimension] ?? 0);
  const averageGap =
    targetGaps.length > 0
      ? targetGaps.reduce((sum, value) => sum + value, 0) / targetGaps.length
      : Object.values(gaps).reduce((sum, value) => sum + value, 0) / Math.max(Object.keys(gaps).length, 1);

  if (averageGap >= 3) return "low";
  if (averageGap >= 1.6) return "medium";
  return "high";
}

export function resolveR01Result(
  answersA: Record<string, string>,
  answersB: Record<string, string>,
): RelationshipPairResolvedResult {
  const totalsA = scoreParticipant(answersA, "A");
  const totalsB = scoreParticipant(answersB, "B");
  const averages: Record<string, number> = {};
  const gaps: Record<string, number> = {};

  for (const dimension of r01Runtime.dimensions) {
    const left = totalsA[dimension.id] ?? 0;
    const right = totalsB[dimension.id] ?? 0;
    averages[dimension.id] = (left + right) / 2;
    gaps[dimension.id] = Math.abs(left - right);
  }

  const rankedGaps = rankGaps(gaps);
  const highGapCount = rankedGaps.filter((entry) => entry.gap >= 3).length;
  const severeGapCount = rankedGaps.filter((entry) => entry.gap >= 4).length;

  const scored = r01Runtime.resultTypes.map((resultType) => {
    if (resultType.id === r01Runtime.fallbackResultId) {
      const averageStrength =
        Object.values(averages).reduce((sum, value) => sum + Math.max(value, 0), 0) /
        Math.max(Object.keys(averages).length, 1);
      return {
        resultType,
        score: averageStrength + highGapCount * 1.1 + severeGapCount * 0.6,
      };
    }

    const dims = resultType.dims.filter((dimension) => dimension in averages);
    const triggerScore = dims.reduce((sum, dimension) => sum + (averages[dimension] ?? 0), 0);
    const gapPenalty = dims.reduce((sum, dimension) => sum + (gaps[dimension] ?? 0) * 0.85, 0);
    const smoothBonus = dims.reduce((sum, dimension) => sum + Math.max(0, 2 - (gaps[dimension] ?? 0)) * 0.2, 0);

    return {
      resultType,
      score: triggerScore - gapPenalty + smoothBonus - Math.max(0, highGapCount - 1) * 0.2,
    };
  });

  scored.sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    return (
      r01Runtime.tieBreakOrder.indexOf(left.resultType.id) -
      r01Runtime.tieBreakOrder.indexOf(right.resultType.id)
    );
  });

  const chosen = scored[0]?.resultType ?? r01Runtime.resultTypes[0];
  const alignedLabels =
    chosen.id === r01Runtime.fallbackResultId
      ? Object.entries(averages)
          .sort((left, right) => right[1] - left[1])
          .slice(0, 2)
          .map(([dimension]) => dimensionLabels[dimension])
      : chosen.dims.map((dimension) => dimensionLabels[dimension]).filter(Boolean);
  const topGap = rankedGaps[0];
  const gapLabel = topGap && topGap.gap >= 2 ? topGap.label : null;
  const confidence = confidenceFromGaps(chosen.dims, gaps);

  return {
    resultId: chosen.id,
    title: chosen.name,
    summary: chosen.summary,
    bullets: chosen.bullets,
    reportTeaser: chosen.report,
    confidence,
    alignedLabels,
    gapLabel,
    gapSummary: gapLabel
      ? `とくに「${gapLabel}」は差が出やすい軸です。どちらが正しいかではなく、心地いい頻度や言い方を先に言葉にしておくと、すれ違いが blame になりにくくなります。`
      : null,
  };
}
