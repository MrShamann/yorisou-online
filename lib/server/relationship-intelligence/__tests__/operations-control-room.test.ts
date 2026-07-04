import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { listRelationshipRecords, putRelationshipRecord } from "@/lib/server/relationship-intelligence/store";
import type { FeedbackSubmission, MessageLog, RelationshipStatusRecord } from "@/lib/server/relationship-intelligence/types";

async function readJsonBody(response: Response) {
  return (await response.json()) as Record<string, unknown>;
}

export async function runRelationshipIntelligenceOperationsControlRoomValidationTest() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "yorisou-relationship-intelligence-operations-control-room-"));
  process.env.YORISOU_RELATIONSHIP_DATA_DIR = tempDir;
  delete process.env.YORISOU_SHARED_STORE_BUCKET;
  delete process.env.YORISOU_SHARED_STORE_REGION;
  process.env.RESEND_API_KEY = "test_resend_key";
  process.env.CONTACT_TO_EMAIL = "ops@example.com";
  process.env.CONTACT_FROM_EMAIL = "noreply@example.com";

  const originalFetch = global.fetch;

  try {
    const [{ POST: postContact }, { POST: postFeedback }, service] = await Promise.all([
      import("@/app/api/contact/route"),
      import("@/app/api/open-testing/feedback/route"),
      import("@/lib/server/relationship-intelligence/service"),
    ]);

    global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      void input;
      void init;
      return new Response("simulated resend failure", {
        status: 502,
      });
    }) as typeof global.fetch;

    const failedDeliveryResponse = await postContact(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Review User",
          organizationType: "個人ユーザー",
          email: "review@example.com",
          inquiryType: "公開テストの感想・不具合報告",
          message: "公開テストの確認用メッセージです。十分な長さがあります。",
          topic: "open-testing-contact",
          routeContext: "/contact?topic=open-testing",
          metadata: {
            __pr68_review_test: true,
          },
        }),
      }),
    );
    assert.equal(failedDeliveryResponse.status, 200);
    const failedDeliveryPayload = await readJsonBody(failedDeliveryResponse);
    assert.equal(failedDeliveryPayload.success, true);
    assert.equal(failedDeliveryPayload.deliveryStatus, "failed");

    const afterDeliveryFailure = await service.getOpenTestingDashboardSnapshot();
    assert.equal(afterDeliveryFailure.dataQuality.excludedTestFeedbackSubmissions, 1);
    assert.equal(afterDeliveryFailure.feedbackInbox[0]?.emailDeliveryStatus, "failed");
    assert.equal(afterDeliveryFailure.feedbackInbox[0]?.status, "received");

    const feedbackResponse = await postFeedback(
      new Request("http://localhost/api/open-testing/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: "result-feedback",
          message: "結果の見え方についてのレビュー用メモです。",
          routeContext: "/report-preview?resultId=EM-AK",
          resultId: "EM-AK",
          overlayId: "balancing",
          confidence: "low",
          metadata: {
            __review_test: true,
          },
        }),
      }),
    );
    assert.equal(feedbackResponse.status, 200);

    const feedbackRecords = await listRelationshipRecords<FeedbackSubmission>("feedback-submissions");
    const createdFeedback = feedbackRecords.find((entry) => entry.topic === "result-feedback");
    assert.equal(createdFeedback?.emailDeliveryStatus, "not_requested");

    const routeSource = fs.readFileSync(
      path.join(process.cwd(), "app/api/dashboard/open-testing/feedback/status/route.ts"),
      "utf8",
    );
    assert.equal(routeSource.includes("invalid_feedback_status"), true);
    assert.equal(routeSource.includes("isFeedbackSubmissionStatus"), true);

    const activeRelationship = await putRelationshipRecord<RelationshipStatusRecord>(
      "relationship-statuses",
      "relationship_active_review",
      {
        id: "relationship_active_review",
        userProfileId: "user_active",
        channel: "line",
        authIdentityId: "line:user_active",
        status: "active",
        activationSource: "line_save_clicked",
        activatedAt: "2026-05-01T00:00:00.000Z",
        lastInteractionAt: "2026-05-01T00:00:00.000Z",
        stopReason: null,
      },
    );
    await putRelationshipRecord("relationship-statuses", "relationship_paused_review", {
      ...activeRelationship,
      id: "relationship_paused_review",
      userProfileId: "user_paused",
      status: "paused",
    });
    await putRelationshipRecord("relationship-statuses", "relationship_stopped_review", {
      ...activeRelationship,
      id: "relationship_stopped_review",
      userProfileId: "user_stopped",
      status: "stopped",
      stopReason: "manual_test_stop",
    });
    await putRelationshipRecord("relationship-statuses", "relationship_blocked_review", {
      ...activeRelationship,
      id: "relationship_blocked_review",
      userProfileId: "user_blocked",
      status: "blocked",
      stopReason: "manual_test_block",
    });

    await service.recordOpenTestingEvent({
      eventName: "test_completed",
      anonymousSessionId: "asess_user_active",
      userProfileId: "user_active",
      route: "/check-in",
      source: "validation-test",
      entrySource: "test-suite",
      resultId: "EM-AK",
      overlayId: "balancing",
      confidence: "low",
      metadata: {
        live_candidate: true,
      },
    });

    const followUpSnapshot = await service.evaluateOpenTestingFollowUps({ createLogs: true });
    assert.equal(followUpSnapshot.providerMode, "SEND_DISABLED_NO_PROVIDER");
    assert.equal(followUpSnapshot.summary.candidateCount > 0, true);
    assert.equal(followUpSnapshot.summary.skippedCount > 0, true);
    assert.equal(
      followUpSnapshot.candidates.some((entry) => entry.userProfileId === "user_active" && entry.status === "skipped"),
      true,
    );
    assert.equal(
      followUpSnapshot.skippedRelationships.some((entry) => entry.userProfileId === "user_paused" && entry.reason === "relationship_paused"),
      true,
    );
    assert.equal(
      followUpSnapshot.skippedRelationships.some((entry) => entry.userProfileId === "user_stopped" && entry.reason === "relationship_stopped"),
      true,
    );
    assert.equal(
      followUpSnapshot.skippedRelationships.some((entry) => entry.userProfileId === "user_blocked" && entry.reason === "relationship_blocked"),
      true,
    );

    const messageLogs = await listRelationshipRecords<MessageLog>("message-logs");
    assert.equal(messageLogs.some((entry) => entry.userProfileId === "user_active" && entry.status === "skipped"), true);

    const dashboardSnapshot = await service.getOpenTestingDashboardSnapshot();
    assert.equal(dashboardSnapshot.dataQuality.defaultMode, "exclude_marked_tests");
    assert.equal(dashboardSnapshot.feedbackInbox.some((entry) => entry.isTest), true);
    assert.equal(dashboardSnapshot.feedbackRecent.length, 0);

    return {
      tempDir,
      excludedTestFeedback: dashboardSnapshot.dataQuality.excludedTestFeedbackSubmissions,
      followUpProviderMode: followUpSnapshot.providerMode,
      queuedOrSkippedLogs: messageLogs.length,
    };
  } finally {
    global.fetch = originalFetch;
  }
}
