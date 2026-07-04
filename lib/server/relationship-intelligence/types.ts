export type RelationshipChannel = "line" | "web";
export type RelationshipUserStatus = "anonymous" | "relationship_active" | "inactive" | "blocked";
export type RelationshipIdentityProvider = "line" | "web";
export type RelationshipIdentityStatus = "active" | "blocked" | "unknown";
export type DiagnosisSessionStatus = "started" | "completed" | "abandoned";
export type FeedbackSubmissionStatus = "new" | "reviewed" | "archived";
export type RelationshipStatusValue = "active" | "paused" | "stopped" | "blocked";
export type MessageLogStatus = "queued" | "sent" | "failed" | "skipped";
export type ReportEventType = "preview_viewed" | "intent_clicked" | "full_viewed" | "downloaded";
export type RelationshipActivationSource =
  | "line_mini_app_entry"
  | "line_login_callback"
  | "line_webhook"
  | "line_save_clicked"
  | "feedback_with_line_context";

export type OpenTestingEventName =
  | "open_testing_viewed"
  | "open_testing_start_clicked"
  | "test_started"
  | "question_answered"
  | "test_completed"
  | "result_generated"
  | "result_viewed"
  | "result_feedback_submitted"
  | "report_preview_viewed"
  | "report_intent_clicked"
  | "full_report_viewed"
  | "report_downloaded"
  | "contact_feedback_submitted"
  | "line_entry_opened"
  | "line_save_clicked"
  | "line_relationship_activated";

export const REPORT_EVENT_TYPES = [
  "preview_viewed",
  "intent_clicked",
  "full_viewed",
  "downloaded",
] as const satisfies readonly ReportEventType[];

export const RELATIONSHIP_ACTIVATION_SOURCES = [
  "line_mini_app_entry",
  "line_login_callback",
  "line_webhook",
  "line_save_clicked",
  "feedback_with_line_context",
] as const satisfies readonly RelationshipActivationSource[];

export const OPEN_TESTING_EVENT_NAMES = [
  "open_testing_viewed",
  "open_testing_start_clicked",
  "test_started",
  "question_answered",
  "test_completed",
  "result_generated",
  "result_viewed",
  "result_feedback_submitted",
  "report_preview_viewed",
  "report_intent_clicked",
  "full_report_viewed",
  "report_downloaded",
  "contact_feedback_submitted",
  "line_entry_opened",
  "line_save_clicked",
  "line_relationship_activated",
] as const satisfies readonly OpenTestingEventName[];

const reportEventTypeSet = new Set<string>(REPORT_EVENT_TYPES);
const relationshipActivationSourceSet = new Set<string>(RELATIONSHIP_ACTIVATION_SOURCES);
const openTestingEventNameSet = new Set<string>(OPEN_TESTING_EVENT_NAMES);

export function isReportEventType(value: unknown): value is ReportEventType {
  return typeof value === "string" && reportEventTypeSet.has(value);
}

export function isRelationshipActivationSource(value: unknown): value is RelationshipActivationSource {
  return typeof value === "string" && relationshipActivationSourceSet.has(value);
}

export function isOpenTestingEventName(value: unknown): value is OpenTestingEventName {
  return typeof value === "string" && openTestingEventNameSet.has(value);
}

export type AnonymousSessionRecord = {
  anonymousSessionId: string;
  userProfileId: string | null;
  authIdentityId: string | null;
  source: string | null;
  entrySource: string | null;
  route: string | null;
  createdAt: string;
  lastSeenAt: string;
};

export type RelationshipUserProfile = {
  id: string;
  displayName: string | null;
  language: "ja" | "en";
  region: string | null;
  status: RelationshipUserStatus;
  createdAt: string;
  lastSeenAt: string;
};

export type RelationshipAuthIdentity = {
  id: string;
  userProfileId: string;
  provider: RelationshipIdentityProvider;
  providerUserId: string;
  displayName: string | null;
  linkedAt: string;
  lastSeenAt: string;
  status: RelationshipIdentityStatus;
};

export type DiagnosisSession = {
  id: string;
  anonymousSessionId: string;
  userProfileId: string | null;
  source: string | null;
  entrySource: string | null;
  testVersion: string | null;
  status: DiagnosisSessionStatus;
  startedAt: string;
  completedAt: string | null;
};

export type DiagnosisResult = {
  id: string;
  diagnosisSessionId: string | null;
  userProfileId: string | null;
  resultId: string;
  overlayId: string | null;
  confidence: string | null;
  dimensionScoresJson: Record<string, number> | null;
  publicResultSnapshotJson: Record<string, unknown> | null;
  createdAt: string;
};

export type FunnelEvent = {
  id: string;
  anonymousSessionId: string;
  userProfileId: string | null;
  authIdentityId: string | null;
  eventName: OpenTestingEventName;
  route: string | null;
  source: string | null;
  entrySource: string | null;
  resultId: string | null;
  overlayId: string | null;
  confidence: string | null;
  reportType: string | null;
  metadataJson: Record<string, string | number | boolean | null>;
  createdAt: string;
};

export type ReportEvent = {
  id: string;
  anonymousSessionId: string;
  userProfileId: string | null;
  resultId: string | null;
  overlayId: string | null;
  confidence: string | null;
  reportType: string;
  eventType: ReportEventType;
  route: string | null;
  createdAt: string;
};

export type FeedbackSubmission = {
  id: string;
  anonymousSessionId: string;
  userProfileId: string | null;
  authIdentityId: string | null;
  topic: string;
  routeContext: string | null;
  resultId: string | null;
  overlayId: string | null;
  confidence: string | null;
  message: string;
  contactEmail: string | null;
  lineUserId: string | null;
  status: FeedbackSubmissionStatus;
  createdAt: string;
};

export type RelationshipStatusRecord = {
  id: string;
  userProfileId: string;
  channel: RelationshipChannel;
  authIdentityId: string | null;
  status: RelationshipStatusValue;
  activationSource: RelationshipActivationSource;
  activatedAt: string;
  lastInteractionAt: string;
  stopReason: string | null;
};

export type FollowUpRuleId =
  | "result_saved_confirmation"
  | "report_preview_prompt"
  | "full_report_prompt"
  | "feedback_request"
  | "monthly_checkin";

export type FollowUpRuleDefinition = {
  id: FollowUpRuleId;
  label: string;
  description: string;
  channel: "line";
  thresholdHours: number;
  templateId: string;
};

export type MessageLog = {
  id: string;
  userProfileId: string;
  authIdentityId: string | null;
  channel: "line";
  messageType: string;
  ruleId: FollowUpRuleId;
  templateId: string;
  status: MessageLogStatus;
  skipReason: string | null;
  sentAt: string | null;
  createdAt: string;
};

export type RelationshipCollection =
  | "anonymous-sessions"
  | "relationship-user-profiles"
  | "relationship-auth-identities"
  | "diagnosis-sessions"
  | "diagnosis-results"
  | "funnel-events"
  | "report-events"
  | "feedback-submissions"
  | "relationship-statuses"
  | "message-logs";

export type OpenTestingEventInput = {
  eventName: OpenTestingEventName;
  anonymousSessionId: string;
  userProfileId?: string | null;
  authIdentityId?: string | null;
  route?: string | null;
  source?: string | null;
  entrySource?: string | null;
  resultId?: string | null;
  overlayId?: string | null;
  confidence?: string | null;
  reportType?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
  testVersion?: string | null;
};
