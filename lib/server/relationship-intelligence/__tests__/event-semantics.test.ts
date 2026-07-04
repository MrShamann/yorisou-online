import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

async function readJsonBody(response: Response) {
  return (await response.json()) as Record<string, unknown>;
}

export async function runRelationshipIntelligenceEventSemanticsValidationTest() {
  const tempDir = path.join(os.tmpdir(), "yorisou-relationship-intelligence-event-semantics");
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });
  process.env.YORISOU_RELATIONSHIP_DATA_DIR = tempDir;

  const [{ POST: postOpenTestingEvent }, { POST: postReportEvent }, { POST: postRelationshipActivation }, service] =
    await Promise.all([
      import("@/app/api/open-testing/events/route"),
      import("@/app/api/open-testing/report-events/route"),
      import("@/app/api/open-testing/relationship/activate/route"),
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

  const afterInvalidDashboard = await service.getOpenTestingDashboardSnapshot();
  assert.deepEqual(afterInvalidDashboard.funnelSummary, {});
  assert.deepEqual(afterInvalidDashboard.reportInterest, {});
  assert.equal(afterInvalidDashboard.relationshipSummary.activeLineRelationships, 0);

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

  const afterValidDashboard = await service.getOpenTestingDashboardSnapshot();
  assert.equal(afterValidDashboard.funnelSummary.open_testing_viewed, 1);
  assert.equal(afterValidDashboard.funnelSummary.report_intent_clicked, 1);
  assert.equal(afterValidDashboard.reportInterest.intent_clicked, 1);

  const openTestingPageSource = fs.readFileSync(path.join(process.cwd(), "app/open-testing/page.tsx"), "utf8");
  const resultPageSource = fs.readFileSync(path.join(process.cwd(), "app/result/page.tsx"), "utf8");
  const reportPreviewSource = fs.readFileSync(path.join(process.cwd(), "app/report-preview/page.tsx"), "utf8");
  const fullReportPageSource = fs.readFileSync(
    path.join(process.cwd(), "app/reports/self-understanding/[publicCode]/page.tsx"),
    "utf8",
  );
  const lineAuthStartSource = fs.readFileSync(path.join(process.cwd(), "app/api/line/auth/start/route.ts"), "utf8");
  const contactRouteSource = fs.readFileSync(path.join(process.cwd(), "app/api/contact/route.ts"), "utf8");

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
    contactRouteSource.indexOf("await storeFeedbackSubmission") > contactRouteSource.indexOf("if (!resendResponse.ok)"),
    true,
  );

  return {
    tempDir,
    validFunnelEvents: afterValidDashboard.funnelSummary,
    validReportInterest: afterValidDashboard.reportInterest,
  };
}
