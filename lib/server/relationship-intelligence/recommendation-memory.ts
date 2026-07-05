import { getRecommendationActionDefinition } from "@/app/data/yorisouRecommendationActions";
import type { RecommendationProductLayer, RecommendationRiskBoundary } from "@/app/data/yorisouRecommendationGraph";
import type {
  RecommendationActionId,
  RecommendationConfidence,
  RecommendationInterestId,
  RecommendationMode,
  RecommendationSignalRecord,
  RecommendationSignalTestId,
} from "@/lib/server/relationship-intelligence/types";

export type RecommendationMemoryState = "no_memory" | "light" | "active";

export type RecommendationMemorySummary = {
  anonymousSessionId: string | null;
  recentTests: RecommendationSignalTestId[];
  recentInterests: RecommendationInterestId[];
  repeatedInterestLayers: Array<{
    layer: RecommendationProductLayer;
    count: number;
  }>;
  lastPrimaryAction: RecommendationActionId | null;
  clickedActions: RecommendationActionId[];
  suppressedActions: RecommendationActionId[];
  returnRecommendedMode: RecommendationMode;
  nextBestReturnAction: RecommendationActionId | null;
  secondaryReturnActions: RecommendationActionId[];
  riskBoundary: RecommendationRiskBoundary;
  confidence: RecommendationConfidence;
  staleSignals: boolean;
  generatedAt: string;
  dominantTestId: RecommendationSignalTestId | null;
  memoryState: RecommendationMemoryState;
  recentSignalCount: number;
  lineSaveUsed: boolean;
  repeatedReportInterest: boolean;
  repeatedSelectInterest: boolean;
  repeatedDesignInterest: boolean;
  repeatedCommunityInterest: boolean;
  repeatedLocalLifeInterest: boolean;
};

function nowIso() {
  return new Date().toISOString();
}

function incrementCount<K>(map: Map<K, number>, key: K) {
  map.set(key, (map.get(key) || 0) + 1);
}

function uniqueOrdered<T>(values: T[]) {
  return [...new Set(values)];
}

function toInterestLayer(interestId: RecommendationInterestId): RecommendationProductLayer {
  switch (interestId) {
    case "report-preview":
      return "report";
    case "line-save":
      return "line_companion";
    case "select-info":
      return "select";
    case "design-interest":
      return "design";
    case "community-interest":
      return "community";
    case "local-life-interest":
      return "local_life";
    case "related-test":
      return "content_resource";
  }
}

function deriveConfidence(signalCount: number, repeatedLayers: number, clickedActions: number, recentTests: number): RecommendationConfidence {
  if (repeatedLayers > 0 || clickedActions >= 2 || recentTests >= 2) {
    return "strong";
  }
  if (signalCount >= 2 || clickedActions >= 1 || recentTests >= 1) {
    return "emerging";
  }
  return "low";
}

function deriveMemoryState(signalCount: number, clickedActions: number, recentTests: number): RecommendationMemoryState {
  if (signalCount === 0) {
    return "no_memory";
  }
  if (clickedActions >= 1 || recentTests >= 2 || signalCount >= 4) {
    return "active";
  }
  return "light";
}

export function buildRecommendationMemoryBase(
  signals: RecommendationSignalRecord[],
  anonymousSessionId?: string | null,
): RecommendationMemorySummary {
  const recentSignals = [...signals]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 40);
  const layerCounts = new Map<RecommendationProductLayer, number>();
  const testCounts = new Map<RecommendationSignalTestId, number>();

  for (const signal of recentSignals) {
    if (signal.actionId && (signal.signalType === "recommendation_action_clicked" || signal.signalType === "return_recommendation_clicked")) {
      incrementCount(layerCounts, getRecommendationActionDefinition(signal.actionId).productLayer);
    }

    if (signal.interestId) {
      incrementCount(layerCounts, toInterestLayer(signal.interestId));
    }

    if (signal.testId) {
      incrementCount(testCounts, signal.testId);
    }
  }

  const recentTests = uniqueOrdered(
    recentSignals
      .map((signal) => signal.testId)
      .filter((value): value is RecommendationSignalTestId => Boolean(value)),
  ).slice(0, 4);
  const recentInterests = uniqueOrdered(
    recentSignals
      .map((signal) => signal.interestId)
      .filter((value): value is RecommendationInterestId => Boolean(value)),
  ).slice(0, 5);
  const clickedActions = uniqueOrdered(
    recentSignals
      .filter((signal) => signal.actionId && (signal.signalType === "recommendation_action_clicked" || signal.signalType === "return_recommendation_clicked"))
      .map((signal) => signal.actionId as RecommendationActionId),
  ).slice(0, 6);
  const suppressedActions = uniqueOrdered(
    recentSignals
      .filter(
        (signal) =>
          signal.actionId &&
          signal.actionRole === "suppressed" &&
          (signal.signalType === "recommendation_package_shown" || signal.signalType === "return_recommendation_shown"),
      )
      .map((signal) => signal.actionId as RecommendationActionId),
  ).slice(0, 6);
  const lastPrimaryAction =
    recentSignals.find(
      (signal) =>
        signal.actionId &&
        signal.actionRole === "primary" &&
        (signal.signalType === "recommendation_package_shown" || signal.signalType === "return_recommendation_shown"),
    )?.actionId || null;
  const repeatedInterestLayers = Object.entries(Object.fromEntries(layerCounts))
    .filter(([, count]) => count >= 2)
    .map(([layer, count]) => ({ layer: layer as RecommendationProductLayer, count }))
    .sort((a, b) => b.count - a.count);
  const dominantTestId =
    [...testCounts.entries()].sort((a, b) => b[1] - a[1] || recentTests.indexOf(a[0]) - recentTests.indexOf(b[0]))[0]?.[0] ||
    null;
  const lastSignalAt = recentSignals[0]?.createdAt ? Date.parse(recentSignals[0].createdAt) : null;
  const staleSignals = lastSignalAt == null ? true : Date.now() - lastSignalAt > 1000 * 60 * 60 * 24 * 14;
  const repeatedReportInterest = (layerCounts.get("report") || 0) >= 2;
  const repeatedSelectInterest = (layerCounts.get("select") || 0) >= 2;
  const repeatedDesignInterest = (layerCounts.get("design") || 0) >= 2;
  const repeatedCommunityInterest = (layerCounts.get("community") || 0) >= 2;
  const repeatedLocalLifeInterest = (layerCounts.get("local_life") || 0) >= 2;

  return {
    anonymousSessionId: anonymousSessionId || recentSignals[0]?.anonymousSessionId || null,
    recentTests,
    recentInterests,
    repeatedInterestLayers,
    lastPrimaryAction,
    clickedActions,
    suppressedActions,
    returnRecommendedMode: "return_session",
    nextBestReturnAction: null,
    secondaryReturnActions: [],
    riskBoundary: "normal",
    confidence: deriveConfidence(recentSignals.length, repeatedInterestLayers.length, clickedActions.length, recentTests.length),
    staleSignals,
    generatedAt: nowIso(),
    dominantTestId,
    memoryState: deriveMemoryState(recentSignals.length, clickedActions.length, recentTests.length),
    recentSignalCount: recentSignals.length,
    lineSaveUsed:
      recentSignals.some((signal) => signal.signalType === "line_save_interest_clicked") ||
      clickedActions.includes("line-save-entry"),
    repeatedReportInterest,
    repeatedSelectInterest,
    repeatedDesignInterest,
    repeatedCommunityInterest,
    repeatedLocalLifeInterest,
  };
}
