import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { listRelationshipRecords } from "@/lib/server/relationship-intelligence/store";
import type { RecommendationSignalRecord } from "@/lib/server/relationship-intelligence/types";

async function readJsonBody(response: Response) {
  return (await response.json()) as Record<string, unknown>;
}

export async function runRelationshipIntelligenceEventSemanticsValidationTest() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "yorisou-relationship-intelligence-event-semantics-"));
  process.env.YORISOU_RELATIONSHIP_DATA_DIR = tempDir;

  const [
    { POST: postOpenTestingEvent },
    { POST: postReportEvent },
    { POST: postRelationshipActivation },
    { POST: postRecommendationSignal },
    service,
  ] =
    await Promise.all([
      import("@/app/api/open-testing/events/route"),
      import("@/app/api/open-testing/report-events/route"),
      import("@/app/api/open-testing/relationship/activate/route"),
      import("@/app/api/open-testing/signals/route"),
      import("@/lib/server/relationship-intelligence/service"),
    ]);

  const invalidOpenTesting = await postOpenTestingEvent(
    new Request("http://localhost/api/open-testing/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName: "totally_fake_event", route: "/open-testing" }),
    }),
  );
  assert.equal(invalidOpenTesting.status, 400);
  assert.equal((await readJsonBody(invalidOpenTesting)).error, "invalid_event_name");

  const invalidReport = await postReportEvent(
    new Request("http://localhost/api/open-testing/report-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "totally_fake_report_event",
        reportType: "self-understanding-v0.2.1",
        route: "/report-preview",
      }),
    }),
  );
  assert.equal(invalidReport.status, 400);
  assert.equal((await readJsonBody(invalidReport)).error, "invalid_report_event_type");

  const invalidActivation = await postRelationshipActivation(
    new Request("http://localhost/api/open-testing/relationship/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "totally_fake_activation_source",
        route: "/line/mini-app",
      }),
    }),
  );
  assert.equal(invalidActivation.status, 400);
  assert.equal((await readJsonBody(invalidActivation)).error, "invalid_activation_source");

  const invalidSignalSource = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "totally_fake_signal_source",
        signalType: "recommendation_interest_clicked",
        testId: "work-rhythm",
        pagePath: "/tests",
      }),
    }),
  );
  assert.equal(invalidSignalSource.status, 400);
  assert.equal((await readJsonBody(invalidSignalSource)).error, "invalid_signal_source");

  const invalidSignalType = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "tests_page",
        signalType: "totally_fake_signal_type",
        testId: "work-rhythm",
        pagePath: "/tests",
      }),
    }),
  );
  assert.equal(invalidSignalType.status, 400);
  assert.equal((await readJsonBody(invalidSignalType)).error, "invalid_signal_type");

  const invalidSignalTestId = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "tests_page",
        signalType: "recommendation_interest_clicked",
        testId: "totally_fake_test",
        pagePath: "/tests",
      }),
    }),
  );
  assert.equal(invalidSignalTestId.status, 400);
  assert.equal((await readJsonBody(invalidSignalTestId)).error, "invalid_test_id");

  const invalidSignalInterest = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "tests_page",
        signalType: "recommendation_interest_clicked",
        testId: "work-rhythm",
        interestId: "totally_fake_interest",
        pagePath: "/tests",
      }),
    }),
  );
  assert.equal(invalidSignalInterest.status, 400);
  assert.equal((await readJsonBody(invalidSignalInterest)).error, "invalid_interest_id");

  const invalidSignalActionId = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "work_rhythm_flow",
        signalType: "recommendation_action_clicked",
        testId: "work-rhythm",
        actionId: "totally_fake_action",
        actionRole: "primary",
        recommendationMode: "immediate_result",
        pagePath: "/tests/work-rhythm",
      }),
    }),
  );
  assert.equal(invalidSignalActionId.status, 400);
  assert.equal((await readJsonBody(invalidSignalActionId)).error, "invalid_action_id");

  const invalidSignalMode = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "work_rhythm_flow",
        signalType: "recommendation_action_clicked",
        testId: "work-rhythm",
        actionId: "report-preview-sample",
        actionRole: "primary",
        recommendationMode: "totally_fake_mode",
        pagePath: "/tests/work-rhythm",
      }),
    }),
  );
  assert.equal(invalidSignalMode.status, 400);
  assert.equal((await readJsonBody(invalidSignalMode)).error, "invalid_recommendation_mode");

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

  const invalidSignalNoteType = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "tests_page",
        signalType: "recommendation_interest_clicked",
        testId: "work-rhythm",
        pagePath: "/tests",
        note: { unexpected: true },
      }),
    }),
  );
  assert.equal(invalidSignalNoteType.status, 400);
  assert.equal((await readJsonBody(invalidSignalNoteType)).error, "invalid_note");

  const invalidCompanionSignalSource = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "tests_page",
        signalType: "companion_card_viewed",
        testId: "work-rhythm",
        companionArchetypeId: "sleepy-penguin",
        pagePath: "/tests",
      }),
    }),
  );
  assert.equal(invalidCompanionSignalSource.status, 400);
  assert.equal((await readJsonBody(invalidCompanionSignalSource)).error, "invalid_signal_source");

  const invalidCompanionArchetype = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "companion_card",
        signalType: "companion_card_viewed",
        testId: "work-rhythm",
        companionArchetypeId: "totally_fake_companion",
        pagePath: "/tests/work-rhythm",
      }),
    }),
  );
  assert.equal(invalidCompanionArchetype.status, 400);
  assert.equal((await readJsonBody(invalidCompanionArchetype)).error, "invalid_companion_archetype_id");

  const invalidCompanionOption = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "companion_card",
        signalType: "companion_question_answered",
        testId: "work-rhythm",
        companionArchetypeId: "sleepy-penguin",
        companionOptionId: "totally_fake_option",
        pagePath: "/tests/work-rhythm",
      }),
    }),
  );
  assert.equal(invalidCompanionOption.status, 400);
  assert.equal((await readJsonBody(invalidCompanionOption)).error, "invalid_companion_option_id");

  const invalidCompanionIntent = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "line_mini_app",
        signalType: "companion_subscription_interest_clicked",
        testId: "current-state",
        companionArchetypeId: "rain-bird",
        companionIntentType: "totally_fake_intent",
        pagePath: "/line/mini-app",
      }),
    }),
  );
  assert.equal(invalidCompanionIntent.status, 400);
  assert.equal((await readJsonBody(invalidCompanionIntent)).error, "invalid_companion_intent_type");

  const invalidCompanionNotNowMissingArchetype = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "line_mini_app",
        signalType: "companion_subscription_not_now_clicked",
        testId: "current-state",
        companionIntentType: "free_only_for_now",
        pagePath: "/line/mini-app",
      }),
    }),
  );
  assert.equal(invalidCompanionNotNowMissingArchetype.status, 400);
  assert.equal(
    (await readJsonBody(invalidCompanionNotNowMissingArchetype)).error,
    "invalid_companion_archetype_id",
  );

  const invalidCompanionNotNowArchetype = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "line_mini_app",
        signalType: "companion_subscription_not_now_clicked",
        testId: "current-state",
        companionArchetypeId: "totally_fake_companion",
        companionIntentType: "free_only_for_now",
        pagePath: "/line/mini-app",
      }),
    }),
  );
  assert.equal(invalidCompanionNotNowArchetype.status, 400);
  assert.equal((await readJsonBody(invalidCompanionNotNowArchetype)).error, "invalid_companion_archetype_id");

  const afterInvalidDashboard = await service.getOpenTestingDashboardSnapshot();
  assert.deepEqual(afterInvalidDashboard.funnelSummary, {});
  assert.equal(afterInvalidDashboard.reportInterest.intent_clicked, undefined);
  assert.deepEqual(afterInvalidDashboard.reportInterest.conversions, {
    previewToIntent: null,
    intentToFull: null,
    fullToDownload: null,
  });
  assert.equal(afterInvalidDashboard.relationshipSummary.activeLineRelationships, 0);
  assert.equal(afterInvalidDashboard.recommendationSignals.totalSignals, 0);

  const validOpenTesting = await postOpenTestingEvent(
    new Request("http://localhost/api/open-testing/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "open_testing_viewed",
        route: "/open-testing",
        source: "validation-test",
        entrySource: "test-suite",
      }),
    }),
  );
  assert.equal(validOpenTesting.status, 200);

  const validReport = await postReportEvent(
    new Request("http://localhost/api/open-testing/report-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "intent_clicked",
        reportType: "self-understanding-v0.2.1",
        route: "/report-preview",
        source: "validation-test",
        entrySource: "test-suite",
        resultId: "EM-AK",
      }),
    }),
  );
  assert.equal(validReport.status, 200);

  const validSignal = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "tests_page",
        signalType: "select_interest_clicked",
        testId: "work-rhythm",
        interestId: "select-info",
        pagePath: "/tests",
      }),
    }),
  );
  assert.equal(validSignal.status, 200);

  const validSignalWithoutNote = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "tests_page",
        signalType: "test_started",
        testId: "work-rhythm",
        pagePath: "/tests/work-rhythm",
      }),
    }),
  );
  assert.equal(validSignalWithoutNote.status, 200);

  const validSignalWithShortNote = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "work_rhythm_flow",
        signalType: "test_completed",
        testId: "work-rhythm",
        pagePath: "/tests/work-rhythm",
        note: "朝に集中しやすいです",
      }),
    }),
  );
  assert.equal(validSignalWithShortNote.status, 200);

  const validSignalWithPaddedNote = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "work_rhythm_flow",
        signalType: "report_interest_clicked",
        testId: "work-rhythm",
        pagePath: "/tests/work-rhythm",
        note: "  夜は考えすぎやすい  ",
      }),
    }),
  );
  assert.equal(validSignalWithPaddedNote.status, 200);

  const validSignalWithBlankNote = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "work_rhythm_flow",
        signalType: "related_test_clicked",
        testId: "work-rhythm",
        pagePath: "/tests/work-rhythm",
        note: "   ",
      }),
    }),
  );
  assert.equal(validSignalWithBlankNote.status, 200);

  const validRecommendationShown = await postRecommendationSignal(
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
  assert.equal(validRecommendationShown.status, 200);

  const validReturnSurface = await postRecommendationSignal(
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
  assert.equal(validReturnSurface.status, 200);

  const validReturnShown = await postRecommendationSignal(
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
  assert.equal(validReturnShown.status, 200);

  const validReturnClicked = await postRecommendationSignal(
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
  assert.equal(validReturnClicked.status, 200);

  const validCompanionCardViewed = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "companion_card",
        signalType: "companion_card_viewed",
        testId: "work-rhythm",
        resultId: "steady-planner",
        companionArchetypeId: "sleepy-penguin",
        pagePath: "/tests/work-rhythm",
      }),
    }),
  );
  assert.equal(validCompanionCardViewed.status, 200);

  const validCompanionReturnBlock = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "line_mini_app",
        signalType: "companion_return_block_viewed",
        testId: "current-state",
        companionArchetypeId: "rain-bird",
        recommendationMode: "return_session",
        pagePath: "/line/mini-app",
        note: "少し戻り先を見たいです",
      }),
    }),
  );
  assert.equal(validCompanionReturnBlock.status, 200);

  const validCompanionQuestionAnswered = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "companion_card",
        signalType: "companion_question_answered",
        testId: "name-impression",
        companionArchetypeId: "thread-cat",
        companionOptionId: "sort_lightly",
        pagePath: "/tests/name-impression",
        note: "  いったん軽くほどきたい  ",
      }),
    }),
  );
  assert.equal(validCompanionQuestionAnswered.status, 200);

  const validCompanionOptionClicked = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "line_mini_app",
        signalType: "companion_option_clicked",
        testId: "current-state",
        companionArchetypeId: "rain-bird",
        companionOptionId: "look_only_today",
        recommendationMode: "return_session",
        pagePath: "/line/mini-app",
        note: "   ",
      }),
    }),
  );
  assert.equal(validCompanionOptionClicked.status, 200);

  const validCompanionSubscriptionInterest = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "line_mini_app",
        signalType: "companion_subscription_interest_clicked",
        testId: "current-state",
        companionArchetypeId: "rain-bird",
        companionIntentType: "weekly_reflection_interest",
        recommendationMode: "return_session",
        pagePath: "/line/mini-app",
      }),
    }),
  );
  assert.equal(validCompanionSubscriptionInterest.status, 200);

  const validCompanionSubscriptionNotNow = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "line_mini_app",
        signalType: "companion_subscription_not_now_clicked",
        testId: "current-state",
        companionArchetypeId: "rain-bird",
        companionIntentType: "free_only_for_now",
        recommendationMode: "return_session",
        pagePath: "/line/mini-app",
      }),
    }),
  );
  assert.equal(validCompanionSubscriptionNotNow.status, 200);

  const recommendationSignalsBeforeOversized = await listRelationshipRecords<RecommendationSignalRecord>(
    "recommendation-signals",
  );

  const invalidSignalOversizedNote = await postRecommendationSignal(
    new Request("http://localhost/api/open-testing/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "work_rhythm_flow",
        signalType: "line_save_interest_clicked",
        testId: "work-rhythm",
        pagePath: "/tests/work-rhythm",
        note: "x".repeat(501),
      }),
    }),
  );
  assert.equal(invalidSignalOversizedNote.status, 400);
  assert.equal((await readJsonBody(invalidSignalOversizedNote)).error, "invalid_note");

  const recommendationSignalsAfterOversized = await listRelationshipRecords<RecommendationSignalRecord>(
    "recommendation-signals",
  );
  assert.equal(recommendationSignalsAfterOversized.length, recommendationSignalsBeforeOversized.length);

  const signalsByType = new Map(
    recommendationSignalsAfterOversized.map((record) => [record.signalType, record] as const),
  );
  assert.equal(signalsByType.get("test_started")?.note ?? null, null);
  assert.equal(signalsByType.get("test_completed")?.note, "朝に集中しやすいです");
  assert.equal(signalsByType.get("report_interest_clicked")?.note, "夜は考えすぎやすい");
  assert.equal(signalsByType.get("related_test_clicked")?.note ?? null, null);
  assert.equal(signalsByType.get("companion_card_viewed")?.companionArchetypeId, "sleepy-penguin");
  assert.equal(signalsByType.get("companion_card_viewed")?.note ?? null, null);
  assert.equal(signalsByType.get("companion_return_block_viewed")?.note, "少し戻り先を見たいです");
  assert.equal(signalsByType.get("companion_question_answered")?.companionOptionId, "sort_lightly");
  assert.equal(signalsByType.get("companion_question_answered")?.note, "いったん軽くほどきたい");
  assert.equal(signalsByType.get("companion_option_clicked")?.note ?? null, null);
  assert.equal(
    signalsByType.get("companion_subscription_interest_clicked")?.companionIntentType,
    "weekly_reflection_interest",
  );
  assert.equal(
    signalsByType.get("companion_subscription_not_now_clicked")?.companionArchetypeId,
    "rain-bird",
  );
  assert.equal(
    signalsByType.get("companion_subscription_not_now_clicked")?.companionIntentType,
    "free_only_for_now",
  );

  const afterValidDashboard = await service.getOpenTestingDashboardSnapshot();
  assert.equal(afterValidDashboard.funnelSummary.open_testing_viewed, 1);
  assert.equal(afterValidDashboard.funnelSummary.report_intent_clicked, 1);
  assert.equal(afterValidDashboard.reportInterest.intent_clicked, 1);
  assert.equal(afterValidDashboard.recommendationSignals.totalSignals, 15);
  assert.equal(afterValidDashboard.recommendationSignals.byType.select_interest_clicked, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.test_started, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.test_completed, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.report_interest_clicked, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.related_test_clicked, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.recommendation_package_shown, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.return_surface_viewed, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.return_recommendation_shown, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.return_recommendation_clicked, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.companion_card_viewed, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.companion_return_block_viewed, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.companion_question_answered, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.companion_option_clicked, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.companion_subscription_interest_clicked, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.companion_subscription_not_now_clicked, 1);
  assert.equal(afterValidDashboard.recommendationSignals.interestCounts.select, 1);
  assert.equal(afterValidDashboard.recommendationOrchestrator.packagesShown, 1);
  assert.equal(afterValidDashboard.returnLoop.surfaceViews, 1);
  assert.equal(afterValidDashboard.returnLoop.packagesShown, 1);
  assert.equal(afterValidDashboard.returnLoop.actionClicks, 1);
  assert.equal(afterValidDashboard.companion.cardViews, 1);
  assert.equal(afterValidDashboard.companion.returnBlockViews, 1);
  assert.equal(afterValidDashboard.companion.questionAnswers, 1);
  assert.equal(afterValidDashboard.companion.optionClicks, 1);
  assert.equal(afterValidDashboard.companion.subscriptionInterestClicks, 1);
  assert.equal(afterValidDashboard.companion.subscriptionNotNowClicks, 1);
  assert.equal(afterValidDashboard.companion.archetypeDistribution["sleepy-penguin"], 1);
  assert.equal(afterValidDashboard.companion.archetypeDistribution["rain-bird"], 1);

  const openTestingPageSource = fs.readFileSync(path.join(process.cwd(), "app/open-testing/page.tsx"), "utf8");
  const resultPageSource = fs.readFileSync(path.join(process.cwd(), "app/result/page.tsx"), "utf8");
  const reportPreviewSource = fs.readFileSync(path.join(process.cwd(), "app/report-preview/page.tsx"), "utf8");
  const fullReportPageSource = fs.readFileSync(
    path.join(process.cwd(), "app/reports/self-understanding/[publicCode]/page.tsx"),
    "utf8",
  );
  const lineMiniAppSource = fs.readFileSync(path.join(process.cwd(), "app/line/mini-app/page.tsx"), "utf8");
  const lineAuthStartSource = fs.readFileSync(path.join(process.cwd(), "app/api/line/auth/start/route.ts"), "utf8");
  const contactRouteSource = fs.readFileSync(path.join(process.cwd(), "app/api/contact/route.ts"), "utf8");
  const signalRouteSource = fs.readFileSync(path.join(process.cwd(), "app/api/open-testing/signals/route.ts"), "utf8");

  assert.equal(openTestingPageSource.includes('eventName: "contact_feedback_submitted"'), false);
  assert.equal(openTestingPageSource.includes('eventName: "result_viewed"'), false);
  assert.equal(openTestingPageSource.includes('eventType: "full_viewed"'), false);
  assert.equal(openTestingPageSource.includes('eventType: "intent_clicked"'), true);
  assert.equal(resultPageSource.includes('eventType: "full_viewed"'), false);
  assert.equal(resultPageSource.includes('eventType: "intent_clicked"'), true);
  assert.equal(reportPreviewSource.includes('eventType: "full_viewed"'), false);
  assert.equal(reportPreviewSource.includes('eventName: "result_viewed"'), false);
  assert.equal(reportPreviewSource.includes('eventType: "intent_clicked"'), true);
  assert.equal(fullReportPageSource.includes('eventType="full_viewed"'), true);
  assert.equal(lineMiniAppSource.includes('signalType: "return_surface_viewed"'), true);
  assert.equal(lineAuthStartSource.includes('eventName: "line_save_clicked"'), false);
  assert.equal(
    contactRouteSource.indexOf("await storeFeedbackSubmission") < contactRouteSource.indexOf("if (!resendResponse.ok)"),
    true,
  );
  assert.equal(signalRouteSource.includes("invalid_signal_type"), true);
  assert.equal(signalRouteSource.includes("invalid_interest_id"), true);
  assert.equal(signalRouteSource.includes("invalid_action_id"), true);
  assert.equal(signalRouteSource.includes("invalid_recommendation_mode"), true);
  assert.equal(signalRouteSource.includes("invalid_note"), true);
  assert.equal(signalRouteSource.includes("invalid_companion_archetype_id"), true);
  assert.equal(signalRouteSource.includes("invalid_companion_option_id"), true);
  assert.equal(signalRouteSource.includes("invalid_companion_intent_type"), true);

  return {
    tempDir,
    validFunnelEvents: afterValidDashboard.funnelSummary,
    validReportInterest: afterValidDashboard.reportInterest,
    validRecommendationSignals: afterValidDashboard.recommendationSignals,
  };
}
