import { mkdtemp, rm } from "fs/promises";
import os from "os";
import path from "path";

async function main() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "yorisou-foundation-repos-"));
  process.env.YORISOU_FOUNDATION_DATA_DIR = tempDir;
  process.env.YORISOU_SHARED_STORE_BUCKET = "";

  const {
    foundationUserProfileRepository,
    foundationAuthIdentityRepository,
    foundationConversationRepository,
    foundationMessageEventRepository,
    foundationSupportCaseRepository,
    foundationConsentLogRepository,
    foundationAuditLogRepository,
  } = await import("@/lib/server/foundation/repositories");
  const { identityFoundationService } = await import("@/lib/server/foundation/identityService");
  const { timelineService } = await import("@/lib/server/foundation/timelineService");
  const { supportCaseService } = await import("@/lib/server/foundation/supportCaseService");
  const { privacyAuditService } = await import("@/lib/server/foundation/privacyService");
  const { adminFoundationService } = await import("@/lib/server/foundation/adminService");
  const { defaultSupportProfile } = await import("@/lib/server/yorisouData");

  try {
    const createdAt = new Date().toISOString();
    const emailFirstAccount = {
      id: "uprofile_test_authoritative",
      name: "Canonical Test User",
      email: "foundation-test@example.com",
      passwordHash: "hashed_pw",
      city: "Tokyo",
      role: "family" as const,
      createdAt,
      updatedAt: createdAt,
      lineUserId: "",
      lineConnectedAt: "",
      linePictureUrl: "",
      lineIdTokenSubject: "",
      supportProfile: {
        ...defaultSupportProfile(),
        familyContactName: "Test Family",
      },
    };

    const profile = await identityFoundationService.ensureCanonicalUserForAccount(emailFirstAccount, "email_password");
    const identity = await identityFoundationService.getAuthIdentityByEmail(emailFirstAccount.email);

    if (!identity) {
      throw new Error("missing_email_identity");
    }

    const context = await timelineService.ensureSupportWorkspaceContext({
      sessionId: "session_foundation_validation",
      locale: "ja",
      userProfileId: profile.userProfileId,
      authIdentityId: identity.authIdentityId,
      scenario: "mobility_support",
      issueType: "family_mobility_support",
      currentTopic: "通院支援の相談",
      latestUserMessage: "親の通院の付き添い負担を整理したいです。",
      latestAssistantMessage: "状況を整理しながら支援方法を一緒に確認します。",
    });

    const inbound = await timelineService.recordSupportWorkspaceMessage({
      context,
      direction: "inbound",
      contentText: "親の通院の付き添い負担を整理したいです。",
    });
    const outbound = await timelineService.recordSupportWorkspaceMessage({
      context,
      direction: "outbound",
      contentText: "状況を整理しながら支援方法を一緒に確認します。",
    });

    await supportCaseService.updateStatus({
      supportCaseId: context.supportCaseId,
      status: "open",
      actorUserProfileId: profile.userProfileId,
      actorAuthIdentityId: identity.authIdentityId,
    });

    const consent = await privacyAuditService.recordConsent({
      userProfileId: profile.userProfileId,
      authIdentityId: identity.authIdentityId,
      consentType: "account_registration",
      channel: "email",
      source: "email_password",
      bindingState: "bound",
      metadata: { test: true },
    });
    const audit = await privacyAuditService.recordAudit({
      actorType: "user",
      actorUserProfileId: profile.userProfileId,
      actorAuthIdentityId: identity.authIdentityId,
      action: "timeline.write",
      resourceType: "message_event",
      resourceId: outbound.messageEventId,
      channel: "support_web",
      source: "support_workspace",
      bindingState: "bound",
      summary: "Validation timeline write audit",
      metadata: { test: true },
    });

    const [profileRead, identityRead, conversations, events, supportCases, consentLogs, auditLogs, history] = await Promise.all([
      foundationUserProfileRepository.getById(profile.userProfileId),
      foundationAuthIdentityRepository.getById(identity.authIdentityId),
      foundationConversationRepository.listByUserProfileId(profile.userProfileId),
      foundationMessageEventRepository.listByConversationId(context.conversationId),
      foundationSupportCaseRepository.listByUserProfileId(profile.userProfileId),
      foundationConsentLogRepository.listByUserProfileId(profile.userProfileId),
      foundationAuditLogRepository.listByAction("timeline.write"),
      timelineService.getSupportWorkspaceHistory({ sessionId: "session_foundation_validation", userProfileId: profile.userProfileId, limit: 10 }),
    ]);

    const result = {
      tempDir,
      profileRead: Boolean(profileRead),
      identityRead: Boolean(identityRead),
      conversationCount: conversations.length,
      eventCount: events.length,
      supportCaseCount: supportCases.length,
      consentCount: consentLogs.filter((entry) => entry.consentLogId === consent.consentLogId).length,
      auditCount: auditLogs.filter((entry) => entry.auditLogId === audit.auditLogId).length,
      historySource: history.source,
      latestSupportCaseStatus: supportCases[0]?.status || null,
      eventIds: [inbound.messageEventId, outbound.messageEventId],
    };

    const lineUnboundIdentity = await identityFoundationService.ensureUnboundLineIdentity({
      lineUserId: "U_test_line_unbound",
      lineDisplayName: "LINE Unbound User",
      source: "line_webhook",
    });

    await timelineService.recordLineWebhookEvent({
      event: {
        id: "line_evt_unbound_test_1",
        webhookEventId: "webhook_unbound_test_1",
        accountId: null,
        lineUserId: "U_test_line_unbound",
        eventType: "message",
        messageType: "text",
        messageText: "LINE から先に相談を始めました。",
        postbackData: null,
        replyTokenPresent: true,
        replyStatus: "not_attempted",
        replyError: null,
        deliveryMode: "reply",
        isRedelivery: false,
        sourceType: "line_message",
        eventTimestamp: createdAt,
        receivedAt: createdAt,
      },
      authIdentityId: lineUnboundIdentity.authIdentityId,
      userProfileId: null,
    });

    const unboundLineSnapshotBeforeBind = await identityFoundationService.getUnboundLineSubject("U_test_line_unbound");

    const bindLineResult = await identityFoundationService.bindLineIdentityToUserProfile({
      userProfileId: profile.userProfileId,
      lineUserId: "U_test_line_unbound",
      lineDisplayName: "LINE Unbound User",
      source: "line_login",
      actorUserProfileId: profile.userProfileId,
    });

    if (!bindLineResult.ok) {
      throw new Error(`line_bind_failed:${bindLineResult.reason}`);
    }

    const lineUserSnapshot = await identityFoundationService.getUserByLineProviderSubject("U_test_line_unbound");
    const unboundLineSnapshotAfterBind = await identityFoundationService.getUnboundLineSubject("U_test_line_unbound");

    const supportSessionId = "support_session_prebind_test";
    const unboundSupportContext = await timelineService.ensureSupportWorkspaceContext({
      sessionId: supportSessionId,
      locale: "ja",
      userProfileId: null,
      authIdentityId: null,
      scenario: "mobility_support",
      issueType: "family_mobility_support",
      currentTopic: "付き添いの継続相談",
      latestUserMessage: "ログイン前に相談を始めました。",
      latestAssistantMessage: "後から続けられるように整理します。",
    });

    await timelineService.recordSupportWorkspaceMessage({
      context: unboundSupportContext,
      direction: "inbound",
      contentText: "ログイン前に相談を始めました。",
    });
    await timelineService.recordSupportWorkspaceMessage({
      context: unboundSupportContext,
      direction: "outbound",
      contentText: "後から続けられるように整理します。",
    });

    const unboundSupportBeforeAttach = await identityFoundationService.getUnboundSupportSubject(supportSessionId);
    const supportSessionTimelineBundleBeforeAttach = await timelineService.getUnifiedTimelineBySupportSessionId(supportSessionId);
    const adminSupportSessionDetailBeforeAttach = await adminFoundationService.getTimelineSubjectDetail({ sessionId: supportSessionId });

    const attachSupportSessionResult = await identityFoundationService.attachSupportSessionToUserProfile({
      sessionId: supportSessionId,
      userProfileId: profile.userProfileId,
      authIdentityId: identity.authIdentityId,
      actorUserProfileId: profile.userProfileId,
      actorAuthIdentityId: identity.authIdentityId,
      source: "email_password",
    });

    const reboundSupportHistory = await timelineService.getSupportWorkspaceHistory({
      sessionId: supportSessionId,
      userProfileId: profile.userProfileId,
      limit: 10,
    });
    const unifiedUserEvents = await foundationMessageEventRepository.listByUserProfileId(profile.userProfileId);
    const mergeAudits = await foundationAuditLogRepository.listByAction("identity.merge");
    const [
      boundTimelineBundle,
      lineTimelineBundle,
      adminUserDetail,
      adminLineSubjectDetail,
    ] = await Promise.all([
      timelineService.getUnifiedTimelineByUserProfileId(profile.userProfileId),
      timelineService.getUnifiedTimelineByLineSubject("U_test_line_unbound"),
      adminFoundationService.getUserDetail(profile.userProfileId, {
        actorUserProfileId: profile.userProfileId,
        actorAuthIdentityId: identity.authIdentityId,
      }),
      adminFoundationService.getTimelineSubjectDetail({ lineUserId: "U_test_line_unbound" }),
    ]);

    console.log(JSON.stringify(result, null, 2));

    const integrationResult = {
      ...result,
      emailFirstBound: Boolean((await identityFoundationService.getUserByEmailIdentity(emailFirstAccount.email)).userProfile),
      lineUnboundEventsBeforeBind: unboundLineSnapshotBeforeBind?.events.length || 0,
      lineBoundAfterAttach: lineUserSnapshot.bindingState,
      lineUnboundRemainingAfterBind: unboundLineSnapshotAfterBind?.events.length || 0,
      supportUnboundEventsBeforeAttach: unboundSupportBeforeAttach?.events.length || 0,
      supportAttachConversationCount: attachSupportSessionResult.conversationCount,
      supportAttachMessageEventCount: attachSupportSessionResult.messageEventCount,
      reboundSupportHistorySource: reboundSupportHistory.source,
      reboundSupportConversationId: reboundSupportHistory.conversation?.conversationId || null,
      reboundSupportSupportCaseId: reboundSupportHistory.supportCase?.supportCaseId || null,
      unifiedUserEventCount: unifiedUserEvents.length,
      identityMergeAuditCount: mergeAudits.length,
      boundTimelineConversationCount: boundTimelineBundle.conversations.length,
      boundTimelineSupportCaseCount: boundTimelineBundle.supportCases.length,
      boundTimelineChannels: [...new Set(boundTimelineBundle.events.map((entry) => entry.channel))].sort(),
      lineTimelineSource: lineTimelineBundle.source,
      supportSessionTimelineSourceBeforeAttach: supportSessionTimelineBundleBeforeAttach.source,
      adminUserTimelineEventCount: adminUserDetail.timelineBundle.events.length,
      adminUserTimelineSupportCaseCount: adminUserDetail.timelineBundle.supportCases.length,
      adminLineSubjectSource: adminLineSubjectDetail?.timelineBundle.source || "none",
      adminSupportSessionSourceBeforeAttach: adminSupportSessionDetailBeforeAttach?.timelineBundle.source || "none",
    };

    console.log(JSON.stringify(integrationResult, null, 2));

    if (
      !result.profileRead ||
      !result.identityRead ||
      result.conversationCount < 1 ||
      result.eventCount < 2 ||
      result.supportCaseCount < 1 ||
      result.consentCount < 1 ||
      result.auditCount < 1 ||
      result.historySource !== "canonical" ||
      integrationResult.emailFirstBound !== true ||
      integrationResult.lineUnboundEventsBeforeBind < 1 ||
      integrationResult.lineBoundAfterAttach !== "bound" ||
      integrationResult.lineUnboundRemainingAfterBind !== 0 ||
      integrationResult.supportUnboundEventsBeforeAttach < 1 ||
      integrationResult.supportAttachConversationCount < 1 ||
      integrationResult.supportAttachMessageEventCount < 2 ||
      integrationResult.reboundSupportHistorySource !== "canonical" ||
      !integrationResult.reboundSupportConversationId ||
      !integrationResult.reboundSupportSupportCaseId ||
      integrationResult.unifiedUserEventCount < 4 ||
      integrationResult.identityMergeAuditCount < 2 ||
      integrationResult.boundTimelineConversationCount < 2 ||
      integrationResult.boundTimelineSupportCaseCount < 2 ||
      !integrationResult.boundTimelineChannels.includes("line") ||
      !integrationResult.boundTimelineChannels.includes("support_web") ||
      integrationResult.lineTimelineSource !== "canonical" ||
      integrationResult.supportSessionTimelineSourceBeforeAttach !== "canonical" ||
      integrationResult.adminUserTimelineEventCount < 4 ||
      integrationResult.adminUserTimelineSupportCaseCount < 2 ||
      integrationResult.adminLineSubjectSource !== "canonical" ||
      integrationResult.adminSupportSessionSourceBeforeAttach !== "canonical"
    ) {
      throw new Error("foundation_repository_validation_failed");
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
