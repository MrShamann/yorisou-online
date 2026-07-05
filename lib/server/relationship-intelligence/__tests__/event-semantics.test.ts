import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

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

  const afterValidDashboard = await service.getOpenTestingDashboardSnapshot();
  assert.equal(afterValidDashboard.funnelSummary.open_testing_viewed, 1);
  assert.equal(afterValidDashboard.funnelSummary.report_intent_clicked, 1);
  assert.equal(afterValidDashboard.reportInterest.intent_clicked, 1);
  assert.equal(afterValidDashboard.recommendationSignals.totalSignals, 1);
  assert.equal(afterValidDashboard.recommendationSignals.byType.select_interest_clicked, 1);
  assert.equal(afterValidDashboard.recommendationSignals.interestCounts.select, 1);

  const openTestingPageSource = fs.readFileSync(path.join(process.cwd(), "app/open-testing/page.tsx"), "utf8");
  const resultPageSource = fs.readFileSync(path.join(process.cwd(), "app/result/page.tsx"), "utf8");
  const reportPreviewSource = fs.readFileSync(path.join(process.cwd(), "app/report-preview/page.tsx"), "utf8");
  const fullReportPageSource = fs.readFileSync(
    path.join(process.cwd(), "app/reports/self-understanding/[publicCode]/page.tsx"),
    "utf8",
  );
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
  assert.equal(lineAuthStartSource.includes('eventName: "line_save_clicked"'), false);
  assert.equal(
    contactRouteSource.indexOf("await storeFeedbackSubmission") < contactRouteSource.indexOf("if (!resendResponse.ok)"),
    true,
  );
  assert.equal(signalRouteSource.includes("invalid_signal_type"), true);
  assert.equal(signalRouteSource.includes("invalid_interest_id"), true);

  return {
    tempDir,
    validFunnelEvents: afterValidDashboard.funnelSummary,
    validReportInterest: afterValidDashboard.reportInterest,
    validRecommendationSignals: afterValidDashboard.recommendationSignals,
  };
}
