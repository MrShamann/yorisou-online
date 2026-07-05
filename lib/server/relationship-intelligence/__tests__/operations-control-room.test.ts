import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { listRelationshipRecords, putRelationshipRecord } from "@/lib/server/relationship-intelligence/store";
import type {
  FeedbackSubmission,
  MessageLog,
  RecommendationSignalRecord,
  RelationshipStatusRecord,
} from "@/lib/server/relationship-intelligence/types";

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
    assert.equal(dashboardSnapshot.founderSignalIntelligence.totals.totalSignals, 0);
    assert.equal(dashboardSnapshot.founderSignalIntelligence.founderReviewCandidates.length, 0);

    await putRelationshipRecord<RecommendationSignalRecord>("recommendation-signals", "signal_real_review", {
      id: "signal_real_review",
      anonymousSessionId: "asess_signal_real",
      userProfileId: "user_active",
      authIdentityId: null,
      source: "tests_page",
      signalType: "report_interest_clicked",
      testId: "work-rhythm",
      resultId: null,
      interestId: "report-preview",
      actionId: null,
      actionRole: null,
      recommendationMode: null,
      note: null,
      pagePath: "/tests",
      metadataJson: {},
      createdAt: "2026-05-01T00:00:00.000Z",
    });
    await putRelationshipRecord<RecommendationSignalRecord>("recommendation-signals", "signal_test_review", {
      id: "signal_test_review",
      anonymousSessionId: "asess_signal_test",
      userProfileId: null,
      authIdentityId: null,
      source: "tests_page",
      signalType: "design_interest_clicked",
      testId: "local-life",
      resultId: null,
      interestId: "design-interest",
      actionId: null,
      actionRole: null,
      recommendationMode: null,
      note: null,
      pagePath: "/tests",
      metadataJson: {
        __review_test: true,
      },
      createdAt: "2026-05-02T00:00:00.000Z",
    });
    await putRelationshipRecord<RecommendationSignalRecord>("recommendation-signals", "signal_design_review", {
      id: "signal_design_review",
      anonymousSessionId: "asess_signal_design",
      userProfileId: "user_active",
      authIdentityId: null,
      source: "report_preview_page",
      signalType: "design_interest_clicked",
      testId: "work-rhythm",
      resultId: "steady-planner",
      interestId: "design-interest",
      actionId: null,
      actionRole: null,
      recommendationMode: null,
      note: "  仕事の流れを整える道具や見せ方の案があると助かる。社内にも共有しやすいとよい。  ",
      pagePath: "/report-preview",
      metadataJson: {},
      createdAt: "2026-05-03T00:00:00.000Z",
    });
    await putRelationshipRecord<RecommendationSignalRecord>("recommendation-signals", "signal_local_life_review", {
      id: "signal_local_life_review",
      anonymousSessionId: "asess_signal_local_life",
      userProfileId: "user_local_life",
      authIdentityId: null,
      source: "local_life_flow",
      signalType: "test_completed",
      testId: "local-life",
      resultId: "支え合いアイデアへの関心",
      interestId: null,
      actionId: null,
      actionRole: null,
      recommendationMode: null,
      note: ` ${"暮らしの支え合いの案を知りたい。".repeat(12)} `,
      pagePath: "/tests/local-life",
      metadataJson: {},
      createdAt: "2026-05-04T00:00:00.000Z",
    });
    await putRelationshipRecord<RecommendationSignalRecord>("recommendation-signals", "signal_package_primary_review", {
      id: "signal_package_primary_review",
      anonymousSessionId: "asess_pkg_primary",
      userProfileId: "user_active",
      authIdentityId: null,
      source: "work_rhythm_flow",
      signalType: "recommendation_package_shown",
      testId: "work-rhythm",
      resultId: "steady-planner",
      interestId: null,
      actionId: "report-preview-sample",
      actionRole: "primary",
      recommendationMode: "immediate_result",
      note: null,
      pagePath: "/tests/work-rhythm",
      metadataJson: {},
      createdAt: "2026-05-05T00:00:00.000Z",
    });
    await putRelationshipRecord<RecommendationSignalRecord>("recommendation-signals", "signal_package_secondary_review", {
      id: "signal_package_secondary_review",
      anonymousSessionId: "asess_pkg_secondary",
      userProfileId: "user_active",
      authIdentityId: null,
      source: "work_rhythm_flow",
      signalType: "recommendation_package_shown",
      testId: "work-rhythm",
      resultId: "steady-planner",
      interestId: null,
      actionId: "design-interest-entry",
      actionRole: "suppressed",
      recommendationMode: "immediate_result",
      note: null,
      pagePath: "/tests/work-rhythm",
      metadataJson: {},
      createdAt: "2026-05-05T00:01:00.000Z",
    });
    await putRelationshipRecord<RecommendationSignalRecord>("recommendation-signals", "signal_package_click_review", {
      id: "signal_package_click_review",
      anonymousSessionId: "asess_pkg_click",
      userProfileId: "user_active",
      authIdentityId: null,
      source: "work_rhythm_flow",
      signalType: "recommendation_action_clicked",
      testId: "work-rhythm",
      resultId: "steady-planner",
      interestId: null,
      actionId: "report-preview-sample",
      actionRole: "primary",
      recommendationMode: "immediate_result",
      note: null,
      pagePath: "/tests/work-rhythm",
      metadataJson: {},
      createdAt: "2026-05-05T00:02:00.000Z",
    });
    await putRelationshipRecord<RecommendationSignalRecord>("recommendation-signals", "signal_return_surface_review", {
      id: "signal_return_surface_review",
      anonymousSessionId: "asess_return_surface",
      userProfileId: "user_active",
      authIdentityId: null,
      source: "line_mini_app",
      signalType: "return_surface_viewed",
      testId: "current-state",
      resultId: null,
      interestId: null,
      actionId: null,
      actionRole: null,
      recommendationMode: "return_session",
      note: null,
      pagePath: "/line/mini-app",
      metadataJson: {},
      createdAt: "2026-05-05T00:03:00.000Z",
    });
    await putRelationshipRecord<RecommendationSignalRecord>("recommendation-signals", "signal_return_shown_review", {
      id: "signal_return_shown_review",
      anonymousSessionId: "asess_return_shown",
      userProfileId: "user_active",
      authIdentityId: null,
      source: "line_mini_app",
      signalType: "return_recommendation_shown",
      testId: "current-state",
      resultId: null,
      interestId: null,
      actionId: "open-testing-guide",
      actionRole: "primary",
      recommendationMode: "return_session",
      note: null,
      pagePath: "/line/mini-app",
      metadataJson: {
        memoryState: "no_memory",
      },
      createdAt: "2026-05-05T00:04:00.000Z",
    });
    await putRelationshipRecord<RecommendationSignalRecord>("recommendation-signals", "signal_return_click_review", {
      id: "signal_return_click_review",
      anonymousSessionId: "asess_return_click",
      userProfileId: "user_active",
      authIdentityId: null,
      source: "line_mini_app",
      signalType: "return_recommendation_clicked",
      testId: "current-state",
      resultId: null,
      interestId: null,
      actionId: "test-work-rhythm",
      actionRole: "secondary",
      recommendationMode: "return_session",
      note: null,
      pagePath: "/line/mini-app",
      metadataJson: {
        memoryState: "light",
      },
      createdAt: "2026-05-05T00:05:00.000Z",
    });

    const recommendationDashboard = await service.getOpenTestingDashboardSnapshot();
    assert.equal(recommendationDashboard.recommendationSignals.totalSignals, 9);
    assert.equal(recommendationDashboard.recommendationSignals.byType.report_interest_clicked, 1);
    assert.equal(recommendationDashboard.recommendationSignals.byType.design_interest_clicked, 1);
    assert.equal(recommendationDashboard.recommendationSignals.byType.test_completed, 1);
    assert.equal(recommendationDashboard.recommendationSignals.byType.recommendation_package_shown, 2);
    assert.equal(recommendationDashboard.recommendationSignals.byType.recommendation_action_clicked, 1);
    assert.equal(recommendationDashboard.recommendationSignals.byType.return_surface_viewed, 1);
    assert.equal(recommendationDashboard.recommendationSignals.byType.return_recommendation_shown, 1);
    assert.equal(recommendationDashboard.recommendationSignals.byType.return_recommendation_clicked, 1);
    assert.equal(recommendationDashboard.recommendationSignals.interestCounts.report, 1);
    assert.equal(recommendationDashboard.recommendationSignals.interestCounts.design, 1);
    assert.equal(recommendationDashboard.dataQuality.totalRecommendationSignals, 10);
    assert.equal(recommendationDashboard.dataQuality.excludedTestRecommendationSignals, 1);
    assert.equal(recommendationDashboard.recommendationOrchestrator.packagesShown, 1);
    assert.equal(recommendationDashboard.recommendationOrchestrator.actionClicks, 1);
    assert.equal(recommendationDashboard.recommendationOrchestrator.shownByAction["report-preview-sample"], 1);
    assert.equal(recommendationDashboard.recommendationOrchestrator.clickedByAction["report-preview-sample"], 1);
    assert.equal(recommendationDashboard.recommendationOrchestrator.suppressedRiskyActionCounts.product_claim_boundary, 1);
    assert.equal(recommendationDashboard.returnLoop.surfaceViews, 1);
    assert.equal(recommendationDashboard.returnLoop.packagesShown, 1);
    assert.equal(recommendationDashboard.returnLoop.actionClicks, 1);
    assert.equal(recommendationDashboard.returnLoop.noMemoryFallbackShown, 1);
    assert.equal(recommendationDashboard.returnLoop.shownByAction["open-testing-guide"], 1);
    assert.equal(recommendationDashboard.returnLoop.clickedByAction["test-work-rhythm"], 1);
    assert.equal(recommendationDashboard.founderSignalIntelligence.totals.totalSignals, 3);
    assert.equal(recommendationDashboard.founderSignalIntelligence.totals.excludedSignals, 1);
    assert.equal(recommendationDashboard.founderSignalIntelligence.counts.byProductLayer.report, 1);
    assert.equal(recommendationDashboard.founderSignalIntelligence.counts.byProductLayer.design, 1);
    assert.equal(recommendationDashboard.founderSignalIntelligence.counts.byProductLayer.public_value, 1);
    assert.equal(recommendationDashboard.founderSignalIntelligence.counts.byOpportunityCategory.deepen_report, 1);
    assert.equal(recommendationDashboard.founderSignalIntelligence.counts.byOpportunityCategory.validate_design_candidate, 1);
    assert.equal(recommendationDashboard.founderSignalIntelligence.counts.byOpportunityCategory.public_value_memo_candidate, 1);
    assert.equal(recommendationDashboard.founderSignalIntelligence.topTestEntries[0]?.testId, "work-rhythm");
    assert.equal(recommendationDashboard.founderSignalIntelligence.localLifeCandidates.length, 0);
    assert.equal(recommendationDashboard.founderSignalIntelligence.publicValueCandidates.length, 1);
    assert.equal(recommendationDashboard.founderSignalIntelligence.riskWarnings.length >= 2, true);
    const designCandidate = recommendationDashboard.founderSignalIntelligence.founderReviewCandidates.find(
      (entry) => entry.productLayer === "design",
    );
    assert.equal(designCandidate?.riskBoundary, "product_claim_boundary");
    assert.equal(designCandidate?.reviewStatus, "founder_review_candidate");
    assert.equal(designCandidate?.noteExcerpts[0], "仕事の流れを整える道具や見せ方の案があると助かる。社内にも共有しやすいとよい。");
    const publicValueCandidate = recommendationDashboard.founderSignalIntelligence.founderReviewCandidates.find(
      (entry) => entry.productLayer === "public_value",
    );
    assert.equal(publicValueCandidate?.riskBoundary, "care_welfare_mobility_boundary");
    assert.equal(publicValueCandidate?.reviewStatus, "founder_review_candidate");
    assert.equal(publicValueCandidate?.title.includes("支え合いアイデアへの関心"), true);
    assert.equal((publicValueCandidate?.noteExcerpts[0]?.length || 0) <= 120, true);
    assert.equal(publicValueCandidate?.noteExcerpts[0]?.includes("…"), true);
    assert.equal(
      recommendationDashboard.founderSignalIntelligence.recentMeaningfulSignals.every(
        (entry) => !entry.noteExcerpt || entry.noteExcerpt.length <= 120,
      ),
      true,
    );
    assert.equal(recommendationDashboard.founderSignalIntelligence.staleAreas.some((entry) => entry.testId === "current-state"), true);

    return {
      tempDir,
      excludedTestFeedback: dashboardSnapshot.dataQuality.excludedTestFeedbackSubmissions,
      excludedTestRecommendationSignals: recommendationDashboard.dataQuality.excludedTestRecommendationSignals,
      followUpProviderMode: followUpSnapshot.providerMode,
      queuedOrSkippedLogs: messageLogs.length,
    };
  } finally {
    global.fetch = originalFetch;
  }
}
