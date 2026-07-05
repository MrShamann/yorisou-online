import { randomBytes } from "crypto";

import { getRecommendationActionDefinition, type RecommendationActionType } from "@/app/data/yorisouRecommendationActions";
import type { RecommendationProductLayer, RecommendationRiskBoundary } from "@/app/data/yorisouRecommendationGraph";
import type {
  RecommendationActionId,
  RecommendationActionRole,
  RecommendationInterestId,
  RecommendationMode,
  RecommendationSignalRecord,
  RecommendationSignalSource,
  RecommendationSignalTestId,
  RecommendationSignalType,
} from "@/lib/server/relationship-intelligence/types";

const MAX_SECONDARY_ACTIONS = 3;

export type RecommendationConfidence = "low" | "emerging" | "strong";

export type RecommendationPackageAction = {
  actionId: RecommendationActionId;
  title: string;
  description: string;
  href: string;
  actionType: RecommendationActionType;
  productLayer: RecommendationProductLayer;
  riskBoundary: RecommendationRiskBoundary;
  legacyInterestId: RecommendationInterestId | null;
  legacySignalType: RecommendationSignalType | null;
  relatedTestId: RecommendationSignalTestId | null;
};

export type RecommendationSuppressedAction = RecommendationPackageAction & {
  reason: string;
};

export type RecommendationTrackingPayload = {
  packageId: string;
  source: RecommendationSignalSource;
  testId: RecommendationSignalTestId;
  resultId: string | null;
  recommendationMode: RecommendationMode;
  confidence: RecommendationConfidence;
  pagePath: string | null;
};

export type RecommendationPackage = {
  packageId: string;
  source: RecommendationSignalSource;
  testId: RecommendationSignalTestId;
  resultId: string | null;
  primaryAction: RecommendationPackageAction;
  secondaryActions: RecommendationPackageAction[];
  suppressedActions: RecommendationSuppressedAction[];
  riskBoundary: RecommendationRiskBoundary;
  explanation: string;
  trackingPayload: RecommendationTrackingPayload;
  generatedAt: string;
  confidence: RecommendationConfidence;
  recommendationMode: RecommendationMode;
};

export type RecommendationOrchestratorInput = {
  testId: RecommendationSignalTestId;
  resultId?: string | null;
  source: RecommendationSignalSource;
  pagePath?: string | null;
  mode: RecommendationMode;
  recentSignals?: RecommendationSignalRecord[];
};

type SessionProfile = {
  completedTests: Set<RecommendationSignalTestId>;
  shownActionCounts: Map<RecommendationActionId, number>;
  clickedActionCounts: Map<RecommendationActionId, number>;
  layerInterestCounts: Map<RecommendationProductLayer, number>;
  hasLineSaveIntent: boolean;
  hasReportInterest: boolean;
  confidence: RecommendationConfidence;
};

function createPackageId() {
  return `recpkg_${Date.now()}_${randomBytes(5).toString("hex")}`;
}

function nowIso() {
  return new Date().toISOString();
}

function incrementCount<K>(map: Map<K, number>, key: K) {
  map.set(key, (map.get(key) || 0) + 1);
}

function asRecommendationLayer(interestId: RecommendationInterestId | null): RecommendationProductLayer | null {
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
    default:
      return null;
  }
}

function actionToPublicShape(actionId: RecommendationActionId, input: RecommendationOrchestratorInput): RecommendationPackageAction {
  const definition = getRecommendationActionDefinition(actionId);
  return {
    actionId,
    title: definition.title,
    description: definition.description,
    href: definition.buildHref({
      testId: input.testId,
      resultId: input.resultId || null,
      mode: input.mode,
    }),
    actionType: definition.actionType,
    productLayer: definition.productLayer,
    riskBoundary: definition.riskBoundary,
    legacyInterestId: definition.legacyInterestId || null,
    legacySignalType: definition.legacySignalType || null,
    relatedTestId: definition.relatedTestId || null,
  };
}

function buildSessionProfile(signals: RecommendationSignalRecord[], currentTestId: RecommendationSignalTestId): SessionProfile {
  const recentSignals = [...signals]
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 30);
  const completedTests = new Set<RecommendationSignalTestId>();
  const shownActionCounts = new Map<RecommendationActionId, number>();
  const clickedActionCounts = new Map<RecommendationActionId, number>();
  const layerInterestCounts = new Map<RecommendationProductLayer, number>();

  for (const signal of recentSignals) {
    if (signal.signalType === "test_completed" && signal.testId) {
      completedTests.add(signal.testId);
    }

    if (signal.signalType === "recommendation_package_shown" && signal.actionId) {
      incrementCount(shownActionCounts, signal.actionId);
    }

    if (signal.signalType === "recommendation_action_clicked" && signal.actionId) {
      incrementCount(clickedActionCounts, signal.actionId);
      const action = getRecommendationActionDefinition(signal.actionId);
      incrementCount(layerInterestCounts, action.productLayer);
    }

    const legacyLayer = asRecommendationLayer(signal.interestId || null);
    if (legacyLayer && signal.signalType.endsWith("_clicked")) {
      incrementCount(layerInterestCounts, legacyLayer);
    }
  }

  const crossTestCompletions = [...completedTests].filter((testId) => testId !== currentTestId).length;
  const totalActionClicks = [...clickedActionCounts.values()].reduce((sum, value) => sum + value, 0);
  const repeatedLayerInterest = [...layerInterestCounts.values()].some((value) => value >= 2);
  const confidence: RecommendationConfidence =
    crossTestCompletions >= 2 || totalActionClicks >= 3 || repeatedLayerInterest
      ? "strong"
      : crossTestCompletions >= 1 || totalActionClicks >= 1
        ? "emerging"
        : "low";

  return {
    completedTests,
    shownActionCounts,
    clickedActionCounts,
    layerInterestCounts,
    hasLineSaveIntent:
      recentSignals.some((entry) => entry.signalType === "line_save_interest_clicked") ||
      (clickedActionCounts.get("line-save-entry") || 0) > 0,
    hasReportInterest:
      recentSignals.some((entry) => entry.signalType === "report_interest_clicked") ||
      (clickedActionCounts.get("report-preview-sample") || 0) > 0,
    confidence,
  };
}

function getTestDefaultRiskBoundary(testId: RecommendationSignalTestId): RecommendationRiskBoundary {
  switch (testId) {
    case "local-life":
      return "care_welfare_mobility_boundary";
    case "love-distance":
      return "clinical_or_fortune_boundary";
    default:
      return "normal";
  }
}

function getBaseCandidates(input: RecommendationOrchestratorInput): RecommendationActionId[] {
  switch (input.testId) {
    case "work-rhythm":
      if (input.resultId === "social-drive") {
        return ["report-preview-sample", "community-interest-entry", "line-save-entry", "test-name-impression"];
      }
      if (input.resultId === "steady-planner") {
        return ["report-preview-sample", "design-interest-entry", "line-save-entry", "test-name-impression"];
      }
      if (input.resultId === "quiet-focus") {
        return ["report-preview-sample", "select-hint", "line-save-entry", "test-name-impression"];
      }
      return ["report-preview-sample", "select-hint", "line-save-entry", "test-name-impression"];
    case "name-impression":
      if (input.resultId === "straight") {
        return ["test-work-rhythm", "report-preview-sample", "line-save-entry", "select-hint"];
      }
      if (input.resultId === "steady") {
        return ["report-preview-sample", "community-interest-entry", "design-interest-entry", "line-save-entry"];
      }
      if (input.resultId === "spacious") {
        return ["test-love-distance", "report-preview-sample", "test-local-life", "line-save-entry"];
      }
      return ["report-preview-sample", "community-interest-entry", "line-save-entry", "test-love-distance"];
    case "love-distance":
      if (input.resultId === "LD_READY_FOR_SMALL_CONVERSATION") {
        return ["report-preview-sample", "line-save-entry", "test-name-impression", "community-interest-entry"];
      }
      return ["report-preview-sample", "test-name-impression", "line-save-entry", "test-work-rhythm"];
    case "local-life":
      if (input.resultId === "支え合いアイデアへの関心") {
        return ["local-life-signal-entry", "community-interest-entry", "design-interest-entry", "open-testing-guide"];
      }
      return ["local-life-signal-entry", "community-interest-entry", "open-testing-guide", "design-interest-entry"];
    default:
      return ["report-preview-sample", "line-save-entry", "test-work-rhythm", "open-testing-guide"];
  }
}

function explainPackage(input: RecommendationOrchestratorInput, confidence: RecommendationConfidence, riskBoundary: RecommendationRiskBoundary) {
  if (input.testId === "local-life") {
    return confidence === "low"
      ? "今の結果から見ると、まずは生活の声を安全に整理できる入口を優先しています。サービス提供の約束ではなく、関心や困りごとを送る入口だけを出しています。"
      : "この入口の次に試しやすいものとして、暮らしの声を送る導線を中心に、必要なら共創や案づくりの関心入口を添えています。";
  }

  if (riskBoundary === "clinical_or_fortune_boundary") {
    return "この入口の次に試しやすいものとして、関係の答えを断定しない範囲で、読みものや別角度の整理導線を優先しています。";
  }

  if (confidence === "low") {
    return "今の結果から見ると、もう少し整理しやすい入口を先に出しています。すぐに製品や案へ進めるより、読みものや関連テストから次を選べる形です。";
  }

  return "今の結果から見ると、無理なく続けやすい入口を優先しつつ、次に試せる候補を少しだけ広げています。";
}

function determineMode(primaryAction: RecommendationPackageAction, fallback: RecommendationMode): RecommendationMode {
  if (primaryAction.actionId === "line-save-entry") {
    return "line_save";
  }
  if (primaryAction.actionId === "local-life-signal-entry") {
    return "local_life_inquiry";
  }
  if (primaryAction.actionId === "select-hint" || primaryAction.actionId === "design-interest-entry") {
    return "select_design_interest";
  }
  return fallback;
}

function shouldSuppress(action: RecommendationPackageAction, input: RecommendationOrchestratorInput, profile: SessionProfile) {
  if (action.relatedTestId === input.testId) {
    return "current_test_repetition";
  }

  if (action.relatedTestId && profile.completedTests.has(action.relatedTestId)) {
    return "already_completed_recently";
  }

  if ((profile.clickedActionCounts.get(action.actionId) || 0) > 0) {
    return "already_clicked_recently";
  }

  if ((profile.shownActionCounts.get(action.actionId) || 0) >= 2) {
    return "already_shown_recently";
  }

  if (input.testId === "local-life" && action.productLayer === "select") {
    return "suppressed_local_life_boundary";
  }

  if (input.testId === "local-life" && action.productLayer === "design" && profile.confidence === "low") {
    return "needs_more_signal_before_product_suggestion";
  }

  if (profile.confidence === "low" && (action.productLayer === "select" || action.productLayer === "design")) {
    return "needs_more_signal_before_product_suggestion";
  }

  if (input.testId === "love-distance" && (action.productLayer === "select" || action.productLayer === "design" || action.productLayer === "local_life")) {
    return "suppressed_relationship_boundary";
  }

  if (action.actionId === "line-save-entry" && profile.hasLineSaveIntent) {
    return "line_save_already_used";
  }

  if (action.actionId === "report-preview-sample" && profile.hasReportInterest && input.mode === "return_session") {
    return "report_preview_already_used_recently";
  }

  return null;
}

function rankScore(action: RecommendationPackageAction, input: RecommendationOrchestratorInput, profile: SessionProfile) {
  let score = 0;

  if (action.actionId === "report-preview-sample") score += 6;
  if (action.actionId === "line-save-entry") score += 4;
  if (action.productLayer === "community") score += 3;
  if (action.productLayer === "select" || action.productLayer === "design") score += profile.confidence === "strong" ? 5 : 1;
  if (action.actionType === "start_related_test") score += profile.confidence === "low" ? 5 : 2;
  if (input.testId === "local-life" && action.actionId === "local-life-signal-entry") score += 8;
  if (input.testId === "name-impression" && action.actionId === "test-work-rhythm" && input.resultId === "straight") score += 4;
  if (input.testId === "work-rhythm" && action.actionId === "community-interest-entry" && input.resultId === "social-drive") score += 4;
  if (input.testId === "work-rhythm" && action.actionId === "design-interest-entry" && input.resultId === "steady-planner") score += 3;
  if (input.testId === "love-distance" && action.actionType === "start_related_test") score += 3;
  if ((profile.layerInterestCounts.get(action.productLayer) || 0) > 0) score += 2;

  return score;
}

export function buildAutonomousRecommendationPackage(input: RecommendationOrchestratorInput): RecommendationPackage {
  const profile = buildSessionProfile(input.recentSignals || [], input.testId);
  const candidateIds = getBaseCandidates(input);
  const candidateActions = candidateIds.map((actionId) => actionToPublicShape(actionId, input));
  const suppressedActions: RecommendationSuppressedAction[] = [];
  const safeActions: RecommendationPackageAction[] = [];

  for (const action of candidateActions) {
    const suppressedReason = shouldSuppress(action, input, profile);
    if (suppressedReason) {
      suppressedActions.push({ ...action, reason: suppressedReason });
      continue;
    }
    safeActions.push(action);
  }

  const rankedActions = safeActions.sort((a, b) => rankScore(b, input, profile) - rankScore(a, input, profile));
  const primaryAction =
    rankedActions[0] ||
    actionToPublicShape(input.testId === "local-life" ? "open-testing-guide" : "report-preview-sample", input);
  const secondaryActions = rankedActions
    .slice(1, 1 + MAX_SECONDARY_ACTIONS)
    .filter((action) => action.actionId !== primaryAction.actionId);
  const riskBoundary =
    [primaryAction, ...secondaryActions, ...suppressedActions].find((entry) => entry.riskBoundary !== "normal")?.riskBoundary ||
    getTestDefaultRiskBoundary(input.testId);
  const recommendationMode = determineMode(primaryAction, input.mode);
  const packageId = createPackageId();
  const generatedAt = nowIso();
  const explanation = explainPackage(input, profile.confidence, riskBoundary);

  return {
    packageId,
    source: input.source,
    testId: input.testId,
    resultId: input.resultId || null,
    primaryAction,
    secondaryActions,
    suppressedActions,
    riskBoundary,
    explanation,
    trackingPayload: {
      packageId,
      source: input.source,
      testId: input.testId,
      resultId: input.resultId || null,
      recommendationMode,
      confidence: profile.confidence,
      pagePath: input.pagePath || null,
    },
    generatedAt,
    confidence: profile.confidence,
    recommendationMode,
  };
}

export function buildRecommendationRoleSignals(
  input: RecommendationPackage,
  role: RecommendationActionRole,
  actions: RecommendationPackageAction[],
) {
  return actions.map((action) => ({
    source: input.source,
    signalType: "recommendation_package_shown" as const,
    testId: input.testId,
    resultId: input.resultId,
    actionId: action.actionId,
    actionRole: role,
    recommendationMode: input.recommendationMode,
    pagePath: input.trackingPayload.pagePath,
    metadata: {
      productLayer: action.productLayer,
      actionType: action.actionType,
      confidence: input.confidence,
      packageId: input.packageId,
    },
  }));
}
