import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { buildRecommendationMemoryBase } from "@/lib/server/relationship-intelligence/recommendation-memory";
import { buildAutonomousRecommendationPackage } from "@/lib/server/relationship-intelligence/recommendation-orchestrator";
import type { RecommendationSignalRecord } from "@/lib/server/relationship-intelligence/types";

async function readJsonBody(response: Response) {
  return (await response.json()) as Record<string, unknown>;
}

function buildSignal(overrides: Partial<RecommendationSignalRecord>): RecommendationSignalRecord {
  return {
    id: "signal_test",
    anonymousSessionId: "asess_test",
    userProfileId: null,
    authIdentityId: null,
    source: "work_rhythm_flow",
    signalType: "test_completed",
    testId: "work-rhythm",
    resultId: "steady-planner",
    interestId: null,
    actionId: null,
    actionRole: null,
    recommendationMode: null,
    note: null,
    pagePath: "/tests/work-rhythm",
    metadataJson: {},
    createdAt: "2026-07-05T00:00:00.000Z",
    ...overrides,
  };
}

export async function runRecommendationOrchestratorValidationTest() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "yorisou-recommendation-orchestrator-"));
  process.env.YORISOU_RELATIONSHIP_DATA_DIR = tempDir;

  const [{ POST: postRecommendationPackage }, { POST: postRecommendationSignal }] = await Promise.all([
    import("@/app/api/open-testing/recommendations/route"),
    import("@/app/api/open-testing/signals/route"),
  ]);

  const workRhythmPackage = buildAutonomousRecommendationPackage({
    testId: "work-rhythm",
    resultId: "steady-planner",
    source: "work_rhythm_flow",
    pagePath: "/tests/work-rhythm",
    mode: "immediate_result",
    recentSignals: [],
  });
  assert.equal(workRhythmPackage.primaryAction.actionId, "report-preview-sample");
  assert.equal(workRhythmPackage.secondaryActions.length <= 3, true);
  assert.equal(workRhythmPackage.suppressedActions.some((entry) => entry.actionId === "design-interest-entry"), true);

  const nameImpressionPackage = buildAutonomousRecommendationPackage({
    testId: "name-impression",
    resultId: "spacious",
    source: "name_impression_flow",
    pagePath: "/tests/name-impression",
    mode: "immediate_result",
    recentSignals: [],
  });
  const visibleNameActions = [
    nameImpressionPackage.primaryAction,
    ...nameImpressionPackage.secondaryActions,
    ...nameImpressionPackage.suppressedActions,
  ];
  assert.equal(visibleNameActions.some((entry) => /運命|相性/u.test(entry.title)), false);
  assert.equal(visibleNameActions.some((entry) => /運命|相性/u.test(entry.description)), false);

  const localLifePackage = buildAutonomousRecommendationPackage({
    testId: "local-life",
    resultId: "移動の困りごと",
    source: "local_life_flow",
    pagePath: "/tests/local-life",
    mode: "local_life_inquiry",
    recentSignals: [],
  });
  assert.equal(localLifePackage.primaryAction.actionId, "local-life-signal-entry");
  assert.equal(localLifePackage.suppressedActions.some((entry) => entry.actionId === "design-interest-entry"), true);
  assert.equal(
    [localLifePackage.primaryAction, ...localLifePackage.secondaryActions].every(
      (entry) => entry.actionType !== "send_design_interest",
    ),
    true,
  );

  const repeatedSuppressionPackage = buildAutonomousRecommendationPackage({
    testId: "work-rhythm",
    resultId: "short-burst",
    source: "work_rhythm_flow",
    pagePath: "/tests/work-rhythm",
    mode: "return_session",
    recentSignals: [
      buildSignal({
        signalType: "recommendation_action_clicked",
        actionId: "line-save-entry",
        actionRole: "secondary",
        recommendationMode: "immediate_result",
      }),
    ],
  });
  assert.equal(
    [repeatedSuppressionPackage.primaryAction, ...repeatedSuppressionPackage.secondaryActions].some(
      (entry) => entry.actionId === "line-save-entry",
    ),
    false,
  );

  const noMemoryReturnPackage = buildAutonomousRecommendationPackage({
    testId: "current-state",
    source: "line_mini_app",
    pagePath: "/line/mini-app",
    mode: "return_session",
    recentSignals: [],
  });
  assert.equal(["report-preview-sample", "test-work-rhythm", "open-testing-guide"].includes(noMemoryReturnPackage.primaryAction.actionId), true);
  assert.equal(noMemoryReturnPackage.secondaryActions.length <= 3, true);

  const returnClickSuppressionPackage = buildAutonomousRecommendationPackage({
    testId: "current-state",
    source: "line_mini_app",
    pagePath: "/line/mini-app",
    mode: "return_session",
    recentSignals: [
      buildSignal({
        source: "line_mini_app",
        signalType: "return_recommendation_clicked",
        testId: "current-state",
        actionId: "report-preview-sample",
        actionRole: "primary",
        recommendationMode: "return_session",
        pagePath: "/line/mini-app",
      }),
    ],
  });
  assert.notEqual(returnClickSuppressionPackage.primaryAction.actionId, "report-preview-sample");
  assert.equal(
    returnClickSuppressionPackage.suppressedActions.some(
      (entry) => entry.actionId === "report-preview-sample" && entry.reason === "already_clicked_recently",
    ),
    true,
  );

  const workRhythmReturnSignals = [
    buildSignal({
      signalType: "test_completed",
      testId: "work-rhythm",
      resultId: "steady-planner",
    }),
    buildSignal({
      signalType: "report_interest_clicked",
      testId: "work-rhythm",
      pagePath: "/tests/work-rhythm",
    }),
  ];
  const workRhythmReturnPackage = buildAutonomousRecommendationPackage({
    testId: "current-state",
    source: "line_mini_app",
    pagePath: "/line/mini-app",
    mode: "return_session",
    recentSignals: workRhythmReturnSignals,
  });
  const workRhythmReturnActionIds = [
    workRhythmReturnPackage.primaryAction.actionId,
    ...workRhythmReturnPackage.secondaryActions.map((entry) => entry.actionId),
  ];
  const workRhythmReturnSuppressed = workRhythmReturnPackage.suppressedActions.map((entry) => ({
    actionId: entry.actionId,
    reason: entry.reason,
  }));
  assert.equal(workRhythmReturnActionIds.includes("test-work-rhythm"), false);
  assert.equal(workRhythmReturnActionIds.includes("report-preview-sample"), false);
  assert.deepEqual(workRhythmReturnSuppressed, [
    { actionId: "test-work-rhythm", reason: "already_completed_recently" },
    { actionId: "report-preview-sample", reason: "report_preview_already_used_recently" },
  ]);

  const localLifeReturnPackage = buildAutonomousRecommendationPackage({
    testId: "current-state",
    source: "line_mini_app",
    pagePath: "/line/mini-app",
    mode: "return_session",
    recentSignals: [
      buildSignal({
        source: "local_life_flow",
        signalType: "test_completed",
        testId: "local-life",
        resultId: "移動の困りごと",
        pagePath: "/tests/local-life",
      }),
      buildSignal({
        source: "local_life_flow",
        signalType: "local_life_interest_clicked",
        testId: "local-life",
        interestId: "local-life-interest",
        pagePath: "/tests/local-life",
      }),
    ],
  });
  const localLifeReturnActions = [
    localLifeReturnPackage.primaryAction,
    ...localLifeReturnPackage.secondaryActions,
  ];
  assert.equal(localLifeReturnPackage.primaryAction.actionId, "local-life-signal-entry");
  assert.equal(localLifeReturnActions.every((entry) => entry.actionType !== "send_design_interest"), true);

  const returnMemory = buildRecommendationMemoryBase(workRhythmReturnSignals, "asess_return");
  assert.equal(returnMemory.anonymousSessionId, "asess_return");
  assert.equal(returnMemory.recentTests.includes("work-rhythm"), true);
  assert.equal("note" in (returnMemory as unknown as Record<string, unknown>), false);

  const protectedDominantMemory = buildRecommendationMemoryBase(
    [
      buildSignal({
        signalType: "test_completed",
        testId: "work-rhythm",
        pagePath: "/tests/work-rhythm",
      }),
      buildSignal({
        source: "line_mini_app",
        signalType: "return_recommendation_clicked",
        testId: "current-state",
        actionId: "report-preview-sample",
        actionRole: "primary",
        recommendationMode: "return_session",
        pagePath: "/line/mini-app",
        createdAt: "2026-07-05T00:00:02.000Z",
      }),
    ],
    "asess_return",
  );
  assert.equal(protectedDominantMemory.dominantTestId, "work-rhythm");
  assert.equal(protectedDominantMemory.recentTests[0], "work-rhythm");

  const telemetryOnlyMemory = buildRecommendationMemoryBase(
    [
      buildSignal({
        source: "line_mini_app",
        signalType: "return_surface_viewed",
        testId: "current-state",
        recommendationMode: "return_session",
        pagePath: "/line/mini-app",
      }),
      buildSignal({
        source: "line_mini_app",
        signalType: "return_recommendation_clicked",
        testId: "current-state",
        actionId: "report-preview-sample",
        actionRole: "primary",
        recommendationMode: "return_session",
        pagePath: "/line/mini-app",
        createdAt: "2026-07-05T00:00:01.000Z",
      }),
    ],
    "asess_return",
  );
  assert.equal(telemetryOnlyMemory.memoryState, "no_memory");
  assert.equal(telemetryOnlyMemory.dominantTestId, null);
  assert.deepEqual(telemetryOnlyMemory.recentTests, []);

  const validRecommendationResponse = await postRecommendationPackage(
    new Request("http://localhost/api/open-testing/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testId: "work-rhythm",
        resultId: "steady-planner",
        source: "work_rhythm_flow",
        pagePath: "/tests/work-rhythm",
        mode: "immediate_result",
      }),
    }),
  );
  assert.equal(validRecommendationResponse.status, 200);
  const validRecommendationBody = await readJsonBody(validRecommendationResponse);
  assert.equal(validRecommendationBody.ok, true);
  assert.equal(typeof validRecommendationBody.package, "object");
  assert.equal(typeof validRecommendationBody.memory, "object");

  const validReturnRecommendationResponse = await postRecommendationPackage(
    new Request("http://localhost/api/open-testing/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "return_session",
        source: "line_mini_app",
        pagePath: "/line/mini-app",
      }),
    }),
  );
  assert.equal(validReturnRecommendationResponse.status, 200);
  const validReturnRecommendationBody = await readJsonBody(validReturnRecommendationResponse);
  assert.equal(validReturnRecommendationBody.ok, true);
  assert.equal((validReturnRecommendationBody.memory as Record<string, unknown>).memoryState, "no_memory");

  const invalidTestIdResponse = await postRecommendationPackage(
    new Request("http://localhost/api/open-testing/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testId: "not-a-real-test",
        mode: "immediate_result",
      }),
    }),
  );
  assert.equal(invalidTestIdResponse.status, 400);
  assert.equal((await readJsonBody(invalidTestIdResponse)).error, "invalid_test_id");

  const invalidModeResponse = await postRecommendationPackage(
    new Request("http://localhost/api/open-testing/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testId: "work-rhythm",
        mode: "not-a-real-mode",
      }),
    }),
  );
  assert.equal(invalidModeResponse.status, 400);
  assert.equal((await readJsonBody(invalidModeResponse)).error, "invalid_recommendation_mode");

  const validShownSignal = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "work_rhythm_flow",
        signalType: "recommendation_package_shown",
        testId: "work-rhythm",
        resultId: "steady-planner",
        actionId: "report-preview-sample",
        actionRole: "primary",
        recommendationMode: "immediate_result",
        pagePath: "/tests/work-rhythm",
      }),
    }),
  );
  assert.equal(validShownSignal.status, 200);

  const validReturnSurfaceSignal = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "line_mini_app",
        signalType: "return_surface_viewed",
        testId: "current-state",
        recommendationMode: "return_session",
        pagePath: "/line/mini-app",
      }),
    }),
  );
  assert.equal(validReturnSurfaceSignal.status, 200);

  const validReturnShownSignal = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "line_mini_app",
        signalType: "return_recommendation_shown",
        testId: "current-state",
        actionId: "report-preview-sample",
        actionRole: "primary",
        recommendationMode: "return_session",
        pagePath: "/line/mini-app",
      }),
    }),
  );
  assert.equal(validReturnShownSignal.status, 200);

  const validReturnClickedSignal = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "line_mini_app",
        signalType: "return_recommendation_clicked",
        testId: "current-state",
        actionId: "report-preview-sample",
        actionRole: "primary",
        recommendationMode: "return_session",
        pagePath: "/line/mini-app",
      }),
    }),
  );
  assert.equal(validReturnClickedSignal.status, 200);

  const invalidActionIdSignal = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "work_rhythm_flow",
        signalType: "recommendation_action_clicked",
        testId: "work-rhythm",
        resultId: "steady-planner",
        actionId: "not-a-real-action",
        actionRole: "primary",
        recommendationMode: "immediate_result",
        pagePath: "/tests/work-rhythm",
      }),
    }),
  );
  assert.equal(invalidActionIdSignal.status, 400);
  assert.equal((await readJsonBody(invalidActionIdSignal)).error, "invalid_action_id");

  const invalidReturnSignal = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "line_mini_app",
        signalType: "return_recommendation_clicked",
        testId: "current-state",
        actionRole: "primary",
        recommendationMode: "return_session",
        pagePath: "/line/mini-app",
      }),
    }),
  );
  assert.equal(invalidReturnSignal.status, 400);

  return {
    tempDir,
    workRhythmPrimaryAction: workRhythmPackage.primaryAction.actionId,
    localLifePrimaryAction: localLifePackage.primaryAction.actionId,
    repeatedSuppression: repeatedSuppressionPackage.suppressedActions.map((entry) => entry.actionId),
    returnPrimaryAction: noMemoryReturnPackage.primaryAction.actionId,
  };
}
