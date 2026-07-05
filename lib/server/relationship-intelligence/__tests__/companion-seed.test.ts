import assert from "node:assert/strict";

import { buildCompanionSeed } from "@/lib/yorisou/companion/companion-seed";
import type { RecommendationMemorySummary } from "@/lib/server/relationship-intelligence/recommendation-memory";

function buildMemorySummary(
  overrides: Partial<RecommendationMemorySummary> = {},
): RecommendationMemorySummary {
  return {
    anonymousSessionId: "asess_test",
    recentTests: ["work-rhythm"],
    recentInterests: [],
    repeatedInterestLayers: [],
    lastPrimaryAction: null,
    clickedActions: [],
    suppressedActions: [],
    returnRecommendedMode: "return_session",
    nextBestReturnAction: null,
    secondaryReturnActions: [],
    riskBoundary: "normal",
    confidence: "emerging",
    staleSignals: false,
    generatedAt: "2026-07-05T00:00:00.000Z",
    dominantTestId: "work-rhythm",
    memoryState: "light",
    recentSignalCount: 2,
    lineSaveUsed: false,
    repeatedReportInterest: false,
    repeatedSelectInterest: false,
    repeatedDesignInterest: false,
    repeatedCommunityInterest: false,
    repeatedLocalLifeInterest: false,
    ...overrides,
  };
}

export function runCompanionSeedValidationTest() {
  const workSeedA = buildCompanionSeed({
    testId: "work-rhythm",
    resultId: "steady-planner",
    source: "result_page",
  });
  const workSeedB = buildCompanionSeed({
    testId: "work-rhythm",
    resultId: "steady-planner",
    source: "result_page",
  });
  assert.equal(workSeedA.seedId, workSeedB.seedId);
  assert.equal(workSeedA.archetypeId, "sleepy-penguin");
  assert.equal(workSeedA.displayNameJa, "眠そうなペンギン");
  assert.equal(workSeedA.shortMessageJa.includes("急がず"), true);
  assert.equal(workSeedA.stateSummaryJa.includes("向いている職種"), false);
  assert.equal(workSeedA.riskBoundaryNote.includes("診断"), true);

  const fallbackSeed = buildCompanionSeed({
    testId: "current-state",
    source: "return_session",
    recommendationMemory: buildMemorySummary({
      recentTests: [],
      dominantTestId: null,
      memoryState: "no_memory",
      confidence: "low",
      recentSignalCount: 0,
    }),
  });
  assert.equal(fallbackSeed.isFallback, true);
  assert.equal(fallbackSeed.archetypeId, "rain-bird");
  assert.equal(fallbackSeed.subscriptionProbe, null);
  assert.equal(fallbackSeed.stateSummaryJa.includes("まだ相棒をつくる材料が少ない"), true);

  const nameSeed = buildCompanionSeed({
    testId: "name-impression",
    resultId: "mist-thread",
    source: "result_page",
  });
  assert.equal(nameSeed.archetypeId, "thread-cat");
  assert.equal(nameSeed.stateSummaryJa.includes("占い"), true);
  assert.equal(JSON.stringify(nameSeed).includes("運命"), false);
  assert.equal(JSON.stringify(nameSeed).includes("Aya"), false);

  const localLifeSeed = buildCompanionSeed({
    testId: "local-life",
    resultId: "support-ideas",
    source: "result_page",
  });
  assert.equal(localLifeSeed.archetypeId, "stone-turtle");
  assert.equal(localLifeSeed.stateSummaryJa.includes("サービスの約束ではなく"), true);
  assert.equal(localLifeSeed.riskBoundaryNote.includes("直接引き受けるサービスではありません"), true);

  const returnSeed = buildCompanionSeed({
    testId: "current-state",
    source: "return_session",
    recommendationMemory: buildMemorySummary({
      recentTests: ["work-rhythm", "local-life"],
      confidence: "strong",
      memoryState: "active",
      repeatedDesignInterest: true,
    }),
  });
  assert.equal(returnSeed.source, "return_session");
  assert.equal(returnSeed.confidence, "strong");
  assert.equal(returnSeed.subscriptionProbe?.show, true);
  assert.equal(returnSeed.subscriptionProbe?.choices.length, 3);
  assert.equal(returnSeed.boundedQuestion, "今いちばん近いのはどれですか？");

  return {
    status: "ok",
    deterministicSeedId: workSeedA.seedId,
    fallbackArchetype: fallbackSeed.archetypeId,
    returnProbeChoices: returnSeed.subscriptionProbe?.choices.length || 0,
  };
}
