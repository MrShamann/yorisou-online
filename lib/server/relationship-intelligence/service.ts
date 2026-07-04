import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { identityFoundationService } from "@/lib/server/foundation/identityService";
import { getLineMessagingConfigStatus } from "@/lib/server/yorisouLine";
import { getRelationshipRecord, getRelationshipStoreStatus, listRelationshipRecords, putRelationshipRecord } from "@/lib/server/relationship-intelligence/store";
import type {
  AnonymousSessionRecord,
  DiagnosisResult,
  DiagnosisSession,
  FeedbackSubmission,
  FollowUpRuleDefinition,
  FunnelEvent,
  MessageLog,
  OpenTestingEventInput,
  RelationshipActivationSource,
  RelationshipAuthIdentity,
  RelationshipStatusRecord,
  RelationshipUserProfile,
  ReportEvent,
  ReportEventType,
} from "@/lib/server/relationship-intelligence/types";

export const OPEN_TESTING_SESSION_COOKIE = "yorisou_open_testing_session";

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(6).toString("hex")}`;
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeLanguage(value: string | null | undefined) {
  return value === "en" ? "en" : "ja";
}

async function readOpenTestingSessionCookie() {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(OPEN_TESTING_SESSION_COOKIE)?.value || null;
  } catch {
    return null;
  }
}

function sanitizeMetadata(value: Record<string, unknown> | undefined) {
  const normalized: Record<string, string | number | boolean | null> = {};

  for (const [key, raw] of Object.entries(value || {})) {
    if (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean" || raw === null) {
      normalized[key] = raw;
    }
  }

  return normalized;
}

const TEST_MARKER_KEYS = [
  "__review_test",
  "__post_merge_review_test",
  "__local_smoke_test",
  "__pr68_review_test",
] as const;

function isMarkedTestMetadata(metadata: Record<string, string | number | boolean | null> | undefined) {
  return TEST_MARKER_KEYS.some((key) => Boolean(metadata?.[key]));
}

function sortByNewest<T extends { createdAt: string }>(records: T[]) {
  return [...records].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

function lastSeenFromRecords(records: Array<{ createdAt: string }>) {
  const latest = sortByNewest(records)[0];
  return latest?.createdAt || null;
}

function buildResultSnapshot(input: { resultId: string | null; overlayId: string | null; confidence: string | null }) {
  return {
    resultId: input.resultId,
    overlayId: input.overlayId,
    confidence: input.confidence,
  } satisfies Record<string, unknown>;
}

async function resolveCanonicalIdentityForViewer() {
  const viewer = await getViewerContext();

  if (viewer.account?.lineUserId) {
    const lineIdentity = await identityFoundationService.getAuthIdentityByLineUserId(viewer.account.lineUserId);
    if (lineIdentity) {
      return {
        userProfileId: lineIdentity.userProfileId,
        authIdentityId: lineIdentity.authIdentityId,
      };
    }
  }

  if (viewer.account?.email) {
    const emailIdentity = await identityFoundationService.getAuthIdentityByEmail(viewer.account.email);
    if (emailIdentity) {
      return {
        userProfileId: emailIdentity.userProfileId,
        authIdentityId: emailIdentity.authIdentityId,
      };
    }
  }

  return {
    userProfileId: viewer.account?.id || null,
    authIdentityId: null,
  };
}

export async function ensureOpenTestingAnonymousSession(input: {
  source?: string | null;
  entrySource?: string | null;
  route?: string | null;
  preferredSessionId?: string | null;
}) {
  const existingId = (await readOpenTestingSessionCookie()) || input.preferredSessionId || null;
  const timestamp = nowIso();
  const identity = await resolveCanonicalIdentityForViewer();
  let record = existingId ? await getRelationshipRecord<AnonymousSessionRecord>("anonymous-sessions", existingId) : null;

  if (!record) {
    record = {
      anonymousSessionId: existingId || createId("asess"),
      userProfileId: identity.userProfileId,
      authIdentityId: identity.authIdentityId,
      source: input.source || null,
      entrySource: input.entrySource || null,
      route: input.route || null,
      createdAt: timestamp,
      lastSeenAt: timestamp,
    };
  } else {
    record = {
      ...record,
      userProfileId: record.userProfileId || identity.userProfileId,
      authIdentityId: record.authIdentityId || identity.authIdentityId,
      source: input.source ?? record.source,
      entrySource: input.entrySource ?? record.entrySource,
      route: input.route ?? record.route,
      lastSeenAt: timestamp,
    };
  }

  await putRelationshipRecord("anonymous-sessions", record.anonymousSessionId, record);

  return {
    record,
    shouldSetCookie: existingId !== record.anonymousSessionId,
  };
}

async function findLatestDiagnosisSession(anonymousSessionId: string) {
  const sessions = await listRelationshipRecords<DiagnosisSession>("diagnosis-sessions");
  return (
    sessions
      .filter((entry) => entry.anonymousSessionId === anonymousSessionId)
      .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))[0] || null
  );
}

async function upsertDiagnosisSession(input: {
  anonymousSessionId: string;
  userProfileId: string | null;
  source: string | null;
  entrySource: string | null;
  testVersion: string | null;
  eventName: OpenTestingEventInput["eventName"];
}) {
  const latest = await findLatestDiagnosisSession(input.anonymousSessionId);
  const timestamp = nowIso();

  if (!latest || input.eventName === "test_started") {
    const created: DiagnosisSession = {
      id: createId("diag_session"),
      anonymousSessionId: input.anonymousSessionId,
      userProfileId: input.userProfileId,
      source: input.source,
      entrySource: input.entrySource,
      testVersion: input.testVersion,
      status: input.eventName === "test_completed" ? "completed" : "started",
      startedAt: timestamp,
      completedAt: input.eventName === "test_completed" ? timestamp : null,
    };
    await putRelationshipRecord("diagnosis-sessions", created.id, created);
    return created;
  }

  const updated: DiagnosisSession = {
    ...latest,
    userProfileId: latest.userProfileId || input.userProfileId,
    source: latest.source || input.source,
    entrySource: latest.entrySource || input.entrySource,
    testVersion: latest.testVersion || input.testVersion,
    status: input.eventName === "test_completed" ? "completed" : latest.status,
    completedAt: input.eventName === "test_completed" ? timestamp : latest.completedAt,
  };
  await putRelationshipRecord("diagnosis-sessions", updated.id, updated);
  return updated;
}

async function maybeRecordDiagnosisResult(input: {
  diagnosisSessionId: string | null;
  userProfileId: string | null;
  resultId: string | null;
  overlayId: string | null;
  confidence: string | null;
}) {
  if (!input.resultId) {
    return null;
  }

  const existingRecords = await listRelationshipRecords<DiagnosisResult>("diagnosis-results");
  const existing =
    existingRecords.find(
      (entry) =>
        entry.diagnosisSessionId === input.diagnosisSessionId &&
        entry.resultId === input.resultId &&
        entry.overlayId === input.overlayId,
    ) || null;

  if (existing) {
    return existing;
  }

  const created: DiagnosisResult = {
    id: createId("diag_result"),
    diagnosisSessionId: input.diagnosisSessionId,
    userProfileId: input.userProfileId,
    resultId: input.resultId,
    overlayId: input.overlayId,
    confidence: input.confidence,
    dimensionScoresJson: null,
    publicResultSnapshotJson: buildResultSnapshot(input),
    createdAt: nowIso(),
  };
  await putRelationshipRecord("diagnosis-results", created.id, created);
  return created;
}

export async function recordOpenTestingEvent(input: OpenTestingEventInput) {
  const session = await ensureOpenTestingAnonymousSession({
    source: input.source,
    entrySource: input.entrySource,
    route: input.route,
    preferredSessionId: input.anonymousSessionId,
  });
  const event: FunnelEvent = {
    id: createId("funnel"),
    anonymousSessionId: session.record.anonymousSessionId,
    userProfileId: input.userProfileId ?? session.record.userProfileId,
    authIdentityId: input.authIdentityId ?? session.record.authIdentityId,
    eventName: input.eventName,
    route: input.route || null,
    source: input.source || null,
    entrySource: input.entrySource || null,
    resultId: input.resultId || null,
    overlayId: input.overlayId || null,
    confidence: input.confidence || null,
    reportType: input.reportType || null,
    metadataJson: sanitizeMetadata(input.metadata),
    createdAt: nowIso(),
  };
  await putRelationshipRecord("funnel-events", event.id, event);

  if (input.eventName === "test_started" || input.eventName === "question_answered" || input.eventName === "test_completed") {
    const diagnosisSession = await upsertDiagnosisSession({
      anonymousSessionId: session.record.anonymousSessionId,
      userProfileId: input.userProfileId ?? session.record.userProfileId,
      source: input.source || null,
      entrySource: input.entrySource || null,
      testVersion: input.testVersion || null,
      eventName: input.eventName,
    });

    if (input.eventName === "test_completed") {
      await maybeRecordDiagnosisResult({
        diagnosisSessionId: diagnosisSession.id,
        userProfileId: diagnosisSession.userProfileId,
        resultId: input.resultId || null,
        overlayId: input.overlayId || null,
        confidence: input.confidence || null,
      });
    }
  }

  if (input.eventName === "result_generated" || input.eventName === "result_viewed") {
    const diagnosisSession = await findLatestDiagnosisSession(session.record.anonymousSessionId);
    await maybeRecordDiagnosisResult({
      diagnosisSessionId: diagnosisSession?.id || null,
      userProfileId: input.userProfileId ?? session.record.userProfileId,
      resultId: input.resultId || null,
      overlayId: input.overlayId || null,
      confidence: input.confidence || null,
    });
  }

  return { event, session };
}

export async function recordReportEvent(input: {
  eventType: ReportEventType;
  route?: string | null;
  source?: string | null;
  entrySource?: string | null;
  resultId?: string | null;
  overlayId?: string | null;
  confidence?: string | null;
  reportType: string;
  metadata?: Record<string, unknown>;
}) {
  const session = await ensureOpenTestingAnonymousSession({
    source: input.source,
    entrySource: input.entrySource,
    route: input.route,
  });
  const record: ReportEvent = {
    id: createId("report_event"),
    anonymousSessionId: session.record.anonymousSessionId,
    userProfileId: session.record.userProfileId,
    resultId: input.resultId || null,
    overlayId: input.overlayId || null,
    confidence: input.confidence || null,
    reportType: input.reportType,
    eventType: input.eventType,
    route: input.route || null,
    metadataJson: sanitizeMetadata(input.metadata),
    createdAt: nowIso(),
  };
  await putRelationshipRecord("report-events", record.id, record);

  const eventName =
    input.eventType === "preview_viewed"
      ? "report_preview_viewed"
      : input.eventType === "intent_clicked"
        ? "report_intent_clicked"
        : input.eventType === "full_viewed"
          ? "full_report_viewed"
          : "report_downloaded";

  await recordOpenTestingEvent({
    eventName,
    anonymousSessionId: session.record.anonymousSessionId,
    userProfileId: session.record.userProfileId,
    authIdentityId: session.record.authIdentityId,
    route: input.route,
    source: input.source,
    entrySource: input.entrySource,
    resultId: input.resultId,
    overlayId: input.overlayId,
    confidence: input.confidence,
    reportType: input.reportType,
    metadata: sanitizeMetadata(input.metadata),
  });

  return { record, session };
}

export async function storeFeedbackSubmission(input: {
  topic: string;
  routeContext?: string | null;
  resultId?: string | null;
  overlayId?: string | null;
  confidence?: string | null;
  message: string;
  contactEmail?: string | null;
  lineUserId?: string | null;
  source?: string | null;
  entrySource?: string | null;
  metadata?: Record<string, unknown>;
  emailDeliveryStatus?: FeedbackSubmission["emailDeliveryStatus"];
  emailDeliveryError?: string | null;
}) {
  const session = await ensureOpenTestingAnonymousSession({
    source: input.source,
    entrySource: input.entrySource,
    route: input.routeContext,
  });
  const sanitizedMetadata = sanitizeMetadata(input.metadata);
  const createdAt = nowIso();
  const record: FeedbackSubmission = {
    id: createId("feedback"),
    anonymousSessionId: session.record.anonymousSessionId,
    userProfileId: session.record.userProfileId,
    authIdentityId: session.record.authIdentityId,
    topic: input.topic,
    routeContext: input.routeContext || null,
    resultId: input.resultId || null,
    overlayId: input.overlayId || null,
    confidence: input.confidence || null,
    message: input.message,
    contactEmail: input.contactEmail || null,
    lineUserId: input.lineUserId || null,
    status: "received",
    emailDeliveryStatus: input.emailDeliveryStatus || "not_requested",
    emailDeliveryError: input.emailDeliveryError || null,
    emailLastAttemptedAt:
      input.emailDeliveryStatus && input.emailDeliveryStatus !== "not_requested" ? createdAt : null,
    metadataJson: sanitizedMetadata,
    reviewedAt: null,
    archivedAt: null,
    createdAt,
  };
  await putRelationshipRecord("feedback-submissions", record.id, record);

  await recordOpenTestingEvent({
    eventName: input.topic === "result-feedback" ? "result_feedback_submitted" : "contact_feedback_submitted",
    anonymousSessionId: session.record.anonymousSessionId,
    userProfileId: session.record.userProfileId,
    authIdentityId: session.record.authIdentityId,
    route: input.routeContext,
    source: input.source,
    entrySource: input.entrySource,
    resultId: input.resultId,
    overlayId: input.overlayId,
    confidence: input.confidence,
    metadata: {
      topic: input.topic,
      hasContactEmail: Boolean(input.contactEmail),
      hasLineContext: Boolean(input.lineUserId),
      ...sanitizedMetadata,
    },
  });

  return { record, session };
}

export async function updateFeedbackSubmissionStatus(input: {
  feedbackId: string;
  status: FeedbackSubmission["status"];
}) {
  const existing = await getRelationshipRecord<FeedbackSubmission>("feedback-submissions", input.feedbackId);

  if (!existing) {
    throw new Error("feedback_not_found");
  }

  const timestamp = nowIso();
  const updated: FeedbackSubmission = {
    ...existing,
    status: input.status,
    reviewedAt: input.status === "reviewed" ? timestamp : input.status === "received" ? null : existing.reviewedAt,
    archivedAt: input.status === "archived" ? timestamp : input.status === "received" ? null : existing.archivedAt,
  };
  await putRelationshipRecord("feedback-submissions", updated.id, updated);
  return updated;
}

export async function updateFeedbackEmailDeliveryStatus(input: {
  feedbackId: string;
  status: FeedbackSubmission["emailDeliveryStatus"];
  error?: string | null;
}) {
  const existing = await getRelationshipRecord<FeedbackSubmission>("feedback-submissions", input.feedbackId);

  if (!existing) {
    throw new Error("feedback_not_found");
  }

  const updated: FeedbackSubmission = {
    ...existing,
    emailDeliveryStatus: input.status,
    emailDeliveryError: input.status === "failed" ? input.error || "delivery_failed" : null,
    emailLastAttemptedAt: input.status === "not_requested" ? existing.emailLastAttemptedAt : nowIso(),
  };
  await putRelationshipRecord("feedback-submissions", updated.id, updated);
  return updated;
}

export async function upsertRelationshipMirrorUser(input: {
  userProfileId: string;
  authIdentityId: string | null;
  provider: "line" | "web";
  providerUserId: string;
  displayName: string | null;
  locale?: string | null;
}) {
  const timestamp = nowIso();
  const existingUser = await getRelationshipRecord<RelationshipUserProfile>("relationship-user-profiles", input.userProfileId);
  const userRecord: RelationshipUserProfile = {
    id: input.userProfileId,
    displayName: input.displayName || existingUser?.displayName || null,
    language: normalizeLanguage(input.locale),
    region: existingUser?.region || null,
    status: "relationship_active",
    createdAt: existingUser?.createdAt || timestamp,
    lastSeenAt: timestamp,
  };
  await putRelationshipRecord("relationship-user-profiles", userRecord.id, userRecord);

  const identityId = input.authIdentityId || `${input.provider}:${hashValue(input.providerUserId).slice(0, 16)}`;
  const existingIdentity = await getRelationshipRecord<RelationshipAuthIdentity>("relationship-auth-identities", identityId);
  const identityRecord: RelationshipAuthIdentity = {
    id: identityId,
    userProfileId: input.userProfileId,
    provider: input.provider,
    providerUserId: input.providerUserId,
    displayName: input.displayName || existingIdentity?.displayName || null,
    linkedAt: existingIdentity?.linkedAt || timestamp,
    lastSeenAt: timestamp,
    status: "active",
  };
  await putRelationshipRecord("relationship-auth-identities", identityRecord.id, identityRecord);

  return { userRecord, identityRecord };
}

export async function activateRelationship(input: {
  source: RelationshipActivationSource;
  lineUserId?: string | null;
  lineDisplayName?: string | null;
  lineAuthIdentityId?: string | null;
  userProfileId?: string | null;
  route?: string | null;
  entrySource?: string | null;
  sourceLabel?: string | null;
}) {
  const session = await ensureOpenTestingAnonymousSession({
    source: input.sourceLabel || input.source,
    entrySource: input.entrySource,
    route: input.route,
  });

  let resolvedUserProfileId = input.userProfileId || session.record.userProfileId;
  let resolvedAuthIdentityId = input.lineAuthIdentityId || session.record.authIdentityId;

  if (input.lineUserId) {
    const lineIdentity = await identityFoundationService.getAuthIdentityByLineUserId(input.lineUserId);
    if (lineIdentity?.userProfileId) {
      resolvedUserProfileId = lineIdentity.userProfileId;
      resolvedAuthIdentityId = lineIdentity.authIdentityId;
    }
  }

  if (!resolvedUserProfileId || !input.lineUserId) {
    return {
      ok: false as const,
      reason: "missing_identity_context" as const,
      session,
    };
  }

  const { userRecord, identityRecord } = await upsertRelationshipMirrorUser({
    userProfileId: resolvedUserProfileId,
    authIdentityId: resolvedAuthIdentityId,
    provider: "line",
    providerUserId: input.lineUserId,
    displayName: input.lineDisplayName || null,
  });

  const existingStatus =
    (await listRelationshipRecords<RelationshipStatusRecord>("relationship-statuses")).find(
      (entry) => entry.userProfileId === resolvedUserProfileId && entry.channel === "line",
    ) || null;
  const timestamp = nowIso();
  const relationshipStatus: RelationshipStatusRecord = {
    id: existingStatus?.id || createId("relationship"),
    userProfileId: resolvedUserProfileId,
    channel: "line",
    authIdentityId: identityRecord.id,
    status: existingStatus?.status === "blocked" ? "blocked" : "active",
    activationSource: input.source,
    activatedAt: existingStatus?.activatedAt || timestamp,
    lastInteractionAt: timestamp,
    stopReason: existingStatus?.stopReason || null,
  };
  await putRelationshipRecord("relationship-statuses", relationshipStatus.id, relationshipStatus);

  await recordOpenTestingEvent({
    eventName: "line_relationship_activated",
    anonymousSessionId: session.record.anonymousSessionId,
    userProfileId: resolvedUserProfileId,
    authIdentityId: identityRecord.id,
    route: input.route,
    source: input.sourceLabel || input.source,
    entrySource: input.entrySource,
    metadata: {
      activationSource: input.source,
    },
  });

  const updatedSession: AnonymousSessionRecord = {
    ...session.record,
    userProfileId: resolvedUserProfileId,
    authIdentityId: identityRecord.id,
    lastSeenAt: timestamp,
  };
  await putRelationshipRecord("anonymous-sessions", updatedSession.anonymousSessionId, updatedSession);

  return {
    ok: true as const,
    session: { ...session, record: updatedSession },
    userRecord,
    identityRecord,
    relationshipStatus,
  };
}

export async function updateRelationshipStatusForLineUser(input: {
  lineUserId: string;
  status: RelationshipStatusRecord["status"];
  stopReason?: string | null;
}) {
  const lineIdentity = await identityFoundationService.getAuthIdentityByLineUserId(input.lineUserId);
  if (!lineIdentity?.userProfileId) {
    return null;
  }

  const statuses = await listRelationshipRecords<RelationshipStatusRecord>("relationship-statuses");
  const existing = statuses.find((entry) => entry.userProfileId === lineIdentity.userProfileId && entry.channel === "line");
  if (!existing) {
    return null;
  }

  const updated: RelationshipStatusRecord = {
    ...existing,
    status: input.status,
    stopReason: input.stopReason || existing.stopReason,
    lastInteractionAt: nowIso(),
  };
  await putRelationshipRecord("relationship-statuses", updated.id, updated);
  return updated;
}

export const followUpRules = [
  {
    id: "result_saved_confirmation",
    label: "結果保存確認",
    description: "Relationship activation soon after result completion.",
    channel: "line",
    thresholdHours: 0,
    templateId: "line_result_saved_confirmation_v1",
  },
  {
    id: "report_preview_prompt",
    label: "プレビュー案内",
    description: "Result viewed but preview not viewed after 24h.",
    channel: "line",
    thresholdHours: 24,
    templateId: "line_report_preview_prompt_v1",
  },
  {
    id: "full_report_prompt",
    label: "全文案内",
    description: "Preview viewed but full report not viewed after 48h.",
    channel: "line",
    thresholdHours: 48,
    templateId: "line_full_report_prompt_v1",
  },
  {
    id: "feedback_request",
    label: "感想依頼",
    description: "Test completed but no feedback after 24h.",
    channel: "line",
    thresholdHours: 24,
    templateId: "line_feedback_request_v1",
  },
  {
    id: "monthly_checkin",
    label: "月次チェックイン",
    description: "Active relationship older than 30 days without recent activity.",
    channel: "line",
    thresholdHours: 24 * 30,
    templateId: "line_monthly_checkin_v1",
  },
] satisfies readonly FollowUpRuleDefinition[];

function withinHours(timestamp: string, hours: number) {
  return (Date.now() - Date.parse(timestamp)) / (1000 * 60 * 60) <= hours;
}

function hasFrequencyCapacity(logs: MessageLog[]) {
  const activeLogs = logs.filter((entry) => entry.status === "queued" || entry.status === "sent");
  const last24 = activeLogs.filter((entry) => withinHours(entry.createdAt, 24)).length;
  const last7d = activeLogs.filter((entry) => withinHours(entry.createdAt, 24 * 7)).length;
  const last30d = activeLogs.filter((entry) => withinHours(entry.createdAt, 24 * 30)).length;
  return last24 < 1 && last7d < 2 && last30d < 4;
}

export async function evaluateOpenTestingFollowUps(input?: { userProfileId?: string | null; createLogs?: boolean }) {
  const [relationships, funnelEvents, reportEvents, feedback, messageLogs] = await Promise.all([
    listRelationshipRecords<RelationshipStatusRecord>("relationship-statuses"),
    listRelationshipRecords<FunnelEvent>("funnel-events"),
    listRelationshipRecords<ReportEvent>("report-events"),
    listRelationshipRecords<FeedbackSubmission>("feedback-submissions"),
    listRelationshipRecords<MessageLog>("message-logs"),
  ]);
  const lineConfig = getLineMessagingConfigStatus();
  const sendDisabled = !lineConfig.messagingConfigured;
  const candidates: Array<{
    userProfileId: string;
    ruleId: FollowUpRuleDefinition["id"];
    templateId: string;
    status: MessageLog["status"];
    skipReason: string | null;
  }> = [];
  const skippedRelationships: Array<{
    userProfileId: string;
    status: RelationshipStatusRecord["status"];
    reason: string;
  }> = [];

  for (const relationship of relationships) {
    if (input?.userProfileId && input.userProfileId !== relationship.userProfileId) {
      continue;
    }
    if (relationship.channel !== "line") {
      skippedRelationships.push({
        userProfileId: relationship.userProfileId,
        status: relationship.status,
        reason: "non_line_channel",
      });
      continue;
    }
    if (relationship.status !== "active") {
      skippedRelationships.push({
        userProfileId: relationship.userProfileId,
        status: relationship.status,
        reason: `relationship_${relationship.status}`,
      });
      continue;
    }

    const userLogs = messageLogs.filter((entry) => entry.userProfileId === relationship.userProfileId);
    if (!hasFrequencyCapacity(userLogs)) {
      skippedRelationships.push({
        userProfileId: relationship.userProfileId,
        status: relationship.status,
        reason: "frequency_cap_reached",
      });
      continue;
    }

    const userFunnel = funnelEvents.filter((entry) => entry.userProfileId === relationship.userProfileId);
    const userReportEvents = reportEvents.filter((entry) => entry.userProfileId === relationship.userProfileId);
    const userFeedback = feedback.filter((entry) => entry.userProfileId === relationship.userProfileId);

    const completed = userFunnel.find((entry) => entry.eventName === "test_completed");
    const previewViewed = userReportEvents.find((entry) => entry.eventType === "preview_viewed");
    const fullViewed = userReportEvents.find((entry) => entry.eventType === "full_viewed");
    const activated = userFunnel.find((entry) => entry.eventName === "line_relationship_activated");

    for (const rule of followUpRules) {
      if (userLogs.some((entry) => entry.ruleId === rule.id && withinHours(entry.createdAt, Math.max(rule.thresholdHours, 24)))) {
        continue;
      }

      let eligible = false;

      if (rule.id === "result_saved_confirmation") {
        eligible = Boolean(activated && completed && withinHours(activated.createdAt, 12));
      } else if (rule.id === "report_preview_prompt") {
        eligible = Boolean(completed && !previewViewed && !withinHours(completed.createdAt, 24));
      } else if (rule.id === "full_report_prompt") {
        eligible = Boolean(previewViewed && !fullViewed && !withinHours(previewViewed.createdAt, 48));
      } else if (rule.id === "feedback_request") {
        eligible = Boolean(completed && userFeedback.length === 0 && !withinHours(completed.createdAt, 24));
      } else if (rule.id === "monthly_checkin") {
        eligible = !withinHours(relationship.lastInteractionAt, 24 * 30);
      }

      if (!eligible) {
        continue;
      }

      candidates.push({
        userProfileId: relationship.userProfileId,
        ruleId: rule.id,
        templateId: rule.templateId,
        status: sendDisabled ? "skipped" : "queued",
        skipReason: sendDisabled ? "SEND_DISABLED_NO_PROVIDER" : null,
      });
    }
  }

  const createdLogs: MessageLog[] = [];
  if (input?.createLogs) {
    await Promise.all(
      candidates.map(async (candidate) => {
        const record: MessageLog = {
          id: createId("message_log"),
          userProfileId: candidate.userProfileId,
          authIdentityId: null,
          channel: "line",
          messageType: "template_follow_up",
          ruleId: candidate.ruleId,
          templateId: candidate.templateId,
          status: candidate.status,
          skipReason: candidate.skipReason,
          sentAt: candidate.status === "sent" ? nowIso() : null,
          createdAt: nowIso(),
        };
        await putRelationshipRecord("message-logs", record.id, record);
        createdLogs.push(record);
      }),
    );
  }

  const queuedCount = candidates.filter((entry) => entry.status === "queued").length;
  const skippedCount = candidates.filter((entry) => entry.status === "skipped").length;

  return {
    providerMode: sendDisabled ? "SEND_DISABLED_NO_PROVIDER" : "READY_TO_QUEUE",
    rules: followUpRules,
    candidates,
    skippedRelationships,
    summary: {
      candidateCount: candidates.length,
      queuedCount,
      skippedCount,
      activeRelationshipCount: relationships.filter((entry) => entry.channel === "line" && entry.status === "active").length,
    },
    createdLogs,
    frequencyCaps: {
      maxPer24Hours: 1,
      maxPer7Days: 2,
      maxPer30Days: 4,
    },
  };
}

function countBy(values: string[]): Record<string, number> {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export async function getOpenTestingDashboardSnapshot() {
  const [funnelEvents, reportEvents, feedback, relationshipStatuses, messageLogs] = await Promise.all([
    listRelationshipRecords<FunnelEvent>("funnel-events"),
    listRelationshipRecords<ReportEvent>("report-events"),
    listRelationshipRecords<FeedbackSubmission>("feedback-submissions"),
    listRelationshipRecords<RelationshipStatusRecord>("relationship-statuses"),
    listRelationshipRecords<MessageLog>("message-logs"),
  ]);
  const store = getRelationshipStoreStatus();
  const lineConfig = getLineMessagingConfigStatus();
  const realFunnelEvents = funnelEvents.filter((entry) => !isMarkedTestMetadata(entry.metadataJson));
  const realReportEvents = reportEvents.filter((entry) => !isMarkedTestMetadata(entry.metadataJson));
  const realFeedback = feedback.filter((entry) => !isMarkedTestMetadata(entry.metadataJson));
  const testFunnelEvents = funnelEvents.filter((entry) => isMarkedTestMetadata(entry.metadataJson));
  const testReportEvents = reportEvents.filter((entry) => isMarkedTestMetadata(entry.metadataJson));
  const testFeedback = feedback.filter((entry) => isMarkedTestMetadata(entry.metadataJson));
  const funnelSummary = countBy(realFunnelEvents.map((entry) => entry.eventName));
  const reportInterestSummary = countBy(realReportEvents.map((entry) => entry.eventType));
  const messageSummary = countBy(messageLogs.map((entry) => entry.status));
  const resultComboCounts = countBy(
    realFunnelEvents
      .filter((entry) => entry.resultId || entry.overlayId || entry.confidence)
      .map((entry) => `${entry.resultId || "unknown"} / ${entry.overlayId || "unknown"} / ${entry.confidence || "unknown"}`),
  );
  const latestFunnelEvents = sortByNewest(realFunnelEvents);
  const latestReportEvents = sortByNewest(realReportEvents);
  const latestFeedback = sortByNewest(feedback);
  const latestMessageLogs = sortByNewest(messageLogs);
  const latestRelationshipStatuses = [...relationshipStatuses].sort(
    (a, b) => Date.parse(b.lastInteractionAt) - Date.parse(a.lastInteractionAt),
  );
  const resultDistribution = {
    resultId: countBy(realFunnelEvents.map((entry) => entry.resultId || "unknown")),
    overlayId: countBy(realFunnelEvents.map((entry) => entry.overlayId || "unknown")),
    confidence: countBy(realFunnelEvents.map((entry) => entry.confidence || "unknown")),
  };
  const executive = {
    openTestingViews: funnelSummary.open_testing_viewed || 0,
    testStarts: funnelSummary.test_started || 0,
    testCompletions: funnelSummary.test_completed || 0,
    completionRate:
      (funnelSummary.test_started || 0) > 0
        ? Number((((funnelSummary.test_completed || 0) / (funnelSummary.test_started || 0)) * 100).toFixed(1))
        : null,
    resultViews: funnelSummary.result_viewed || 0,
    reportPreviewViews: reportInterestSummary.preview_viewed || 0,
    fullReportViews: reportInterestSummary.full_viewed || 0,
    feedbackCount: realFeedback.length,
    activeLineRelationships: relationshipStatuses.filter((entry) => entry.channel === "line" && entry.status === "active").length,
    queuedFollowUps: messageSummary.queued || 0,
    skippedFollowUps: messageSummary.skipped || 0,
    sentFollowUps: messageSummary.sent || 0,
  };
  const funnelSteps = [
    ["open_testing_viewed", "Open testing viewed"],
    ["open_testing_start_clicked", "Open testing start clicked"],
    ["test_started", "Test started"],
    ["test_completed", "Test completed"],
    ["result_viewed", "Result viewed"],
    ["report_preview_viewed", "Report preview viewed"],
    ["report_intent_clicked", "Full report intent clicked"],
    ["full_report_viewed", "Full report viewed"],
    ["contact_feedback_submitted", "Feedback submitted"],
  ] as const;
  const funnelTable = funnelSteps.map(([eventName, label], index) => {
    const currentCount = funnelSummary[eventName] || 0;
    const previousCount = index > 0 ? funnelSummary[funnelSteps[index - 1][0]] || 0 : 0;
    return {
      eventName,
      label,
      count: currentCount,
      lastSeen: lastSeenFromRecords(realFunnelEvents.filter((entry) => entry.eventName === eventName)),
      conversionFromPrior:
        index > 0 && previousCount > 0 ? Number(((currentCount / previousCount) * 100).toFixed(1)) : null,
    };
  });
  const feedbackInbox = latestFeedback.slice(0, 40).map((entry) => ({
    ...entry,
    isTest: isMarkedTestMetadata(entry.metadataJson),
  }));
  const reportInterest: Record<string, number> & {
    conversions: {
      previewToIntent: number | null;
      intentToFull: number | null;
      fullToDownload: number | null;
    };
  } = Object.assign({}, reportInterestSummary, {
    conversions: {
      previewToIntent:
        (reportInterestSummary.preview_viewed || 0) > 0
          ? Number((((reportInterestSummary.intent_clicked || 0) / (reportInterestSummary.preview_viewed || 0)) * 100).toFixed(1))
          : null,
      intentToFull:
        (reportInterestSummary.intent_clicked || 0) > 0
          ? Number((((reportInterestSummary.full_viewed || 0) / (reportInterestSummary.intent_clicked || 0)) * 100).toFixed(1))
          : null,
      fullToDownload:
        (reportInterestSummary.full_viewed || 0) > 0
          ? Number((((reportInterestSummary.downloaded || 0) / (reportInterestSummary.full_viewed || 0)) * 100).toFixed(1))
          : null,
    },
  });
  const relationshipDetails = latestRelationshipStatuses.slice(0, 25).map((relationship) => {
    const userFunnel = realFunnelEvents.filter((entry) => entry.userProfileId === relationship.userProfileId);
    const userReports = realReportEvents.filter((entry) => entry.userProfileId === relationship.userProfileId);
    const userFeedback = feedback.filter((entry) => entry.userProfileId === relationship.userProfileId);
    const userMessages = messageLogs.filter((entry) => entry.userProfileId === relationship.userProfileId);
    const latestResultEvent = sortByNewest(
      userFunnel.filter((entry) => entry.resultId || entry.overlayId || entry.confidence),
    )[0];

    return {
      userProfileId: relationship.userProfileId,
      relationshipStatus: relationship.status,
      channel: relationship.channel,
      authIdentityId: relationship.authIdentityId,
      activationSource: relationship.activationSource,
      activatedAt: relationship.activatedAt,
      lastSeenAt: relationship.lastInteractionAt,
      stopReason: relationship.stopReason,
      resultActivityCount: userFunnel.filter((entry) => entry.eventName === "result_viewed").length,
      reportActivityCount: userReports.length,
      feedbackCount: userFeedback.length,
      messageLogSummary: countBy(userMessages.map((entry) => entry.status)),
      latestResultSnapshot: latestResultEvent
        ? {
            resultId: latestResultEvent.resultId,
            overlayId: latestResultEvent.overlayId,
            confidence: latestResultEvent.confidence,
          }
        : null,
    };
  });

  return {
    store,
    dataQuality: {
      defaultMode: "exclude_marked_tests",
      testMarkers: TEST_MARKER_KEYS,
      totalFunnelEvents: funnelEvents.length,
      excludedTestFunnelEvents: testFunnelEvents.length,
      totalReportEvents: reportEvents.length,
      excludedTestReportEvents: testReportEvents.length,
      totalFeedbackSubmissions: feedback.length,
      excludedTestFeedbackSubmissions: testFeedback.length,
      invalidRejectedCountAvailable: false,
      invalidRejectedCount: null,
      lastEventAt:
        lastSeenFromRecords([...funnelEvents, ...reportEvents, ...feedback, ...messageLogs]) ||
        latestRelationshipStatuses[0]?.lastInteractionAt ||
        null,
      storeMode: store.mode,
      storagePath: store.dataDir,
      followUpSendMode: lineConfig.messagingConfigured ? "READY_TO_QUEUE" : "SEND_DISABLED_NO_PROVIDER",
    },
    executive,
    funnelSummary,
    funnelTable,
    resultDistribution,
    resultIntelligence: {
      resultId: resultDistribution.resultId,
      overlayId: resultDistribution.overlayId,
      confidence: resultDistribution.confidence,
      topResultReportCombos: Object.entries(resultComboCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([key, count]) => ({ key, count })),
    },
    reportInterest,
    feedbackRecent: sortByNewest(realFeedback).slice(0, 20),
    feedbackInbox,
    relationshipSummary: {
      activeLineRelationships: relationshipStatuses.filter((entry) => entry.channel === "line" && entry.status === "active").length,
      pausedCount: relationshipStatuses.filter((entry) => entry.status === "paused").length,
      stoppedCount: relationshipStatuses.filter((entry) => entry.status === "stopped").length,
      blockedCount: relationshipStatuses.filter((entry) => entry.status === "blocked").length,
      recentActivations: latestFunnelEvents
        .filter((entry) => entry.eventName === "line_relationship_activated")
        .slice(0, 10),
      recentStops: latestRelationshipStatuses.filter((entry) => entry.status === "stopped").slice(0, 10),
    },
    relationshipDetails,
    followUpOperations: {
      providerMode: lineConfig.messagingConfigured ? "READY_TO_QUEUE" : "SEND_DISABLED_NO_PROVIDER",
      recentLogs: latestMessageLogs.slice(0, 20),
      counts: {
        queued: messageSummary.queued || 0,
        skipped: messageSummary.skipped || 0,
        sent: messageSummary.sent || 0,
        failed: messageSummary.failed || 0,
      },
      frequencyCaps: {
        maxPer24Hours: 1,
        maxPer7Days: 2,
        maxPer30Days: 4,
      },
    },
    recentActivity: {
      funnel: latestFunnelEvents.slice(0, 20),
      report: latestReportEvents.slice(0, 20),
      feedback: latestFeedback.slice(0, 10),
      relationships: latestRelationshipStatuses.slice(0, 10),
      messages: latestMessageLogs.slice(0, 10),
    },
  };
}
