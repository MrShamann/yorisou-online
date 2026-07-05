import { TEST_THEME_BY_ID } from "@/app/data/yorisouQuestionSets";
import {
  YORISOU_RECOMMENDATION_GRAPH_RULES,
  type RecommendationConfidenceTier,
  type RecommendationOpportunityCategory,
  type RecommendationProductLayer,
  type RecommendationReviewStatus,
  type RecommendationRiskBoundary,
} from "@/app/data/yorisouRecommendationGraph";
import { isMarkedTestMetadata } from "@/lib/server/relationship-intelligence/markers";
import type { RecommendationSignalRecord, RecommendationSignalTestId } from "@/lib/server/relationship-intelligence/types";

const NOTE_EXCERPT_LIMIT = 120;
const FOUNDER_INTELLIGENCE_EXCLUDED_SIGNAL_TYPES = new Set([
  "recommendation_package_shown",
  "recommendation_action_clicked",
  "return_surface_viewed",
  "return_recommendation_shown",
  "return_recommendation_clicked",
]);

function countBy(values: string[]) {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

function sortByNewest<T extends { createdAt: string }>(records: T[]) {
  return [...records].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

function trimNote(note: string | null | undefined) {
  if (!note) {
    return null;
  }

  const trimmed = note.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function excerptNote(note: string | null | undefined) {
  const trimmed = trimNote(note);
  if (!trimmed) {
    return null;
  }

  return trimmed.length <= NOTE_EXCERPT_LIMIT ? trimmed : `${trimmed.slice(0, NOTE_EXCERPT_LIMIT - 1)}…`;
}

function deriveConfidence(base: RecommendationConfidenceTier, count: number): RecommendationConfidenceTier {
  if (count >= 4) {
    return "strong";
  }
  if (count >= 2) {
    return base === "low" ? "emerging" : base;
  }
  return base;
}

function deriveReviewStatus(input: {
  base: RecommendationReviewStatus;
  count: number;
  riskBoundary: RecommendationRiskBoundary;
  opportunityCategory: RecommendationOpportunityCategory;
}) {
  if (input.riskBoundary === "clinical_or_fortune_boundary") {
    return "blocked_by_risk" as const;
  }
  if (input.base === "watch" && input.count <= 1) {
    return "watch" as const;
  }
  if (input.count >= 2 || input.base === "founder_review_candidate") {
    return "founder_review_candidate" as const;
  }
  if (input.opportunityCategory === "no_action_yet") {
    return "watch" as const;
  }
  return "needs_more_signal" as const;
}

function buildCandidateKey(input: {
  productLayer: RecommendationProductLayer;
  opportunityCategory: RecommendationOpportunityCategory;
  testId: string | null;
  interestId: string | null;
  resultId: string | null;
}) {
  return [input.productLayer, input.opportunityCategory, input.testId || input.interestId || "general", input.resultId || "none"].join(":");
}

function classifySignal(signal: RecommendationSignalRecord) {
  const matches = YORISOU_RECOMMENDATION_GRAPH_RULES.filter((rule) => {
    if (rule.signalType && rule.signalType !== signal.signalType) {
      return false;
    }
    if (rule.testId && rule.testId !== signal.testId) {
      return false;
    }
    if (rule.interestId && rule.interestId !== signal.interestId) {
      return false;
    }
    if (rule.source && rule.source !== signal.source) {
      return false;
    }
    if (rule.resultId && rule.resultId !== signal.resultId) {
      return false;
    }
    return true;
  });

  return (
    [...matches].sort((a, b) => {
      const score = (rule: (typeof matches)[number]) =>
        Number(Boolean(rule.resultId)) +
        Number(Boolean(rule.interestId)) +
        Number(Boolean(rule.testId)) +
        Number(Boolean(rule.source)) +
        Number(Boolean(rule.signalType));
      return score(b) - score(a);
    })[0] || null
  );
}

function buildStaleAreas(realSignals: RecommendationSignalRecord[]) {
  const countsByTest = countBy(realSignals.map((entry) => entry.testId || "unknown"));
  const areas = (Object.keys(TEST_THEME_BY_ID) as RecommendationSignalTestId[]).map((testId) => {
    const count = countsByTest[testId] || 0;
    return {
      testId,
      label: TEST_THEME_BY_ID[testId],
      count,
      status: count === 0 ? "no_signal_yet" : count === 1 ? "low_signal" : "active",
    };
  });

  return areas.filter((entry) => entry.status !== "active");
}

export function buildRecommendationSignalIntelligence(signals: RecommendationSignalRecord[]) {
  const realSignals = signals.filter(
    (entry) =>
      !isMarkedTestMetadata(entry.metadataJson) &&
      !FOUNDER_INTELLIGENCE_EXCLUDED_SIGNAL_TYPES.has(entry.signalType),
  );
  const excludedSignals = signals.filter((entry) => isMarkedTestMetadata(entry.metadataJson));
  const recentRealSignals = sortByNewest(realSignals);
  const classifiedSignals = recentRealSignals
    .map((signal) => {
      const rule = classifySignal(signal);
      return rule ? { signal, rule } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const candidates = new Map<
    string,
    {
      key: string;
      title: string;
      productLayer: RecommendationProductLayer;
      opportunityCategory: RecommendationOpportunityCategory;
      confidenceTier: RecommendationConfidenceTier;
      reviewStatus: RecommendationReviewStatus;
      riskBoundary: RecommendationRiskBoundary;
      recommendedFounderAction: string;
      why: string;
      count: number;
      testIds: Set<string>;
      signalTypes: Set<string>;
      interestIds: Set<string>;
      sampleNotes: Set<string>;
      firstSeenAt: string;
      lastSeenAt: string;
    }
  >();

  for (const { signal, rule } of classifiedSignals) {
    const key = buildCandidateKey({
      productLayer: rule.productLayer,
      opportunityCategory: rule.opportunityCategory,
      testId: signal.testId,
      interestId: signal.interestId,
      resultId: signal.resultId,
    });
    const existing = candidates.get(key);
    const noteExcerpt = excerptNote(signal.note);

    if (!existing) {
      candidates.set(key, {
        key,
        title: signal.resultId ? `${rule.title} · ${signal.resultId}` : rule.title,
        productLayer: rule.productLayer,
        opportunityCategory: rule.opportunityCategory,
        confidenceTier: rule.defaultConfidenceTier,
        reviewStatus: rule.defaultReviewStatus,
        riskBoundary: rule.riskBoundary,
        recommendedFounderAction: rule.recommendedFounderAction,
        why: rule.why,
        count: 1,
        testIds: new Set(signal.testId ? [signal.testId] : []),
        signalTypes: new Set([signal.signalType]),
        interestIds: new Set(signal.interestId ? [signal.interestId] : []),
        sampleNotes: new Set(noteExcerpt ? [noteExcerpt] : []),
        firstSeenAt: signal.createdAt,
        lastSeenAt: signal.createdAt,
      });
      continue;
    }

    existing.count += 1;
    existing.testIds.add(signal.testId || "unknown");
    existing.signalTypes.add(signal.signalType);
    if (signal.interestId) {
      existing.interestIds.add(signal.interestId);
    }
    if (noteExcerpt) {
      existing.sampleNotes.add(noteExcerpt);
    }
    if (Date.parse(signal.createdAt) < Date.parse(existing.firstSeenAt)) {
      existing.firstSeenAt = signal.createdAt;
    }
    if (Date.parse(signal.createdAt) > Date.parse(existing.lastSeenAt)) {
      existing.lastSeenAt = signal.createdAt;
    }
  }

  const founderReviewCandidates = [...candidates.values()]
    .map((entry) => ({
      key: entry.key,
      title: entry.title,
      productLayer: entry.productLayer,
      opportunityCategory: entry.opportunityCategory,
      confidenceTier: deriveConfidence(entry.confidenceTier, entry.count),
      reviewStatus: deriveReviewStatus({
        base: entry.reviewStatus,
        count: entry.count,
        riskBoundary: entry.riskBoundary,
        opportunityCategory: entry.opportunityCategory,
      }),
      riskBoundary: entry.riskBoundary,
      recommendedFounderAction: entry.recommendedFounderAction,
      why: entry.why,
      count: entry.count,
      testIds: [...entry.testIds].filter((value) => value !== "unknown"),
      signalTypes: [...entry.signalTypes],
      interestIds: [...entry.interestIds],
      noteExcerpts: [...entry.sampleNotes].slice(0, 2),
      firstSeenAt: entry.firstSeenAt,
      lastSeenAt: entry.lastSeenAt,
    }))
    .sort((a, b) => {
      const score = { strong: 3, emerging: 2, low: 1 };
      return score[b.confidenceTier] - score[a.confidenceTier] || b.count - a.count || Date.parse(b.lastSeenAt) - Date.parse(a.lastSeenAt);
    });

  const meaningfulRecentSignals = classifiedSignals.slice(0, 12).map(({ signal, rule }) => ({
    id: signal.id,
    title: rule.title,
    productLayer: rule.productLayer,
    opportunityCategory: rule.opportunityCategory,
    riskBoundary: rule.riskBoundary,
    signalType: signal.signalType,
    testId: signal.testId,
    interestId: signal.interestId,
    resultId: signal.resultId,
    createdAt: signal.createdAt,
    noteExcerpt: excerptNote(signal.note),
  }));

  const byTestId = countBy(realSignals.map((entry) => entry.testId || "unknown"));
  const bySignalType = countBy(realSignals.map((entry) => entry.signalType));
  const byInterestId = countBy(realSignals.map((entry) => entry.interestId || "none"));
  const byProductLayer = countBy(classifiedSignals.map((entry) => entry.rule.productLayer));
  const byOpportunityCategory = countBy(classifiedSignals.map((entry) => entry.rule.opportunityCategory));
  const topTestEntries = Object.entries(byTestId)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([testId, count]) => ({ testId, label: TEST_THEME_BY_ID[testId as RecommendationSignalTestId] || testId, count }));

  return {
    totals: {
      totalSignals: realSignals.length,
      excludedSignals: excludedSignals.length,
      meaningfulClassifiedSignals: classifiedSignals.length,
    },
    counts: {
      byTestId,
      bySignalType,
      byInterestId,
      byProductLayer,
      byOpportunityCategory,
    },
    topTestEntries,
    founderReviewCandidates: founderReviewCandidates.slice(0, 10),
    localLifeCandidates: founderReviewCandidates.filter((entry) => entry.productLayer === "local_life").slice(0, 6),
    publicValueCandidates: founderReviewCandidates.filter((entry) => entry.productLayer === "public_value").slice(0, 6),
    riskWarnings: founderReviewCandidates
      .filter((entry) => entry.riskBoundary !== "normal")
      .map((entry) => ({
        key: entry.key,
        title: entry.title,
        riskBoundary: entry.riskBoundary,
        count: entry.count,
      }))
      .slice(0, 8),
    recentMeaningfulSignals: meaningfulRecentSignals,
    staleAreas: buildStaleAreas(realSignals),
  };
}
