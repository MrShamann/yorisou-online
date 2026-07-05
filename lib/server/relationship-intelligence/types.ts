export type RelationshipChannel = "line" | "web";
export type RelationshipUserStatus = "anonymous" | "relationship_active" | "inactive" | "blocked";
export type RelationshipIdentityProvider = "line" | "web";
export type RelationshipIdentityStatus = "active" | "blocked" | "unknown";
export type DiagnosisSessionStatus = "started" | "completed" | "abandoned";
export type FeedbackSubmissionStatus = "received" | "reviewed" | "archived";
export type FeedbackEmailDeliveryStatus = "not_requested" | "pending" | "sent" | "failed";
export type RelationshipStatusValue = "active" | "paused" | "stopped" | "blocked";
export type MessageLogStatus = "queued" | "sent" | "failed" | "skipped";
export type ReportEventType = "preview_viewed" | "intent_clicked" | "full_viewed" | "downloaded";
export type RecommendationSignalType =
  | "test_started"
  | "test_completed"
  | "recommendation_package_shown"
  | "recommendation_action_clicked"
  | "recommendation_interest_clicked"
  | "report_interest_clicked"
  | "select_interest_clicked"
  | "design_interest_clicked"
  | "community_interest_clicked"
  | "local_life_interest_clicked"
  | "line_save_interest_clicked"
  | "related_test_clicked";
export type RecommendationSignalSource =
  | "tests_page"
  | "open_testing_page"
  | "love_distance_flow"
  | "work_rhythm_flow"
  | "name_impression_flow"
  | "local_life_flow"
  | "result_page"
  | "report_preview_page"
  | "full_report_page";
export type RecommendationInterestId =
  | "report-preview"
  | "line-save"
  | "related-test"
  | "select-info"
  | "design-interest"
  | "community-interest"
  | "local-life-interest";
export type RecommendationActionId =
  | "report-preview-sample"
  | "line-save-entry"
  | "select-hint"
  | "design-interest-entry"
  | "community-interest-entry"
  | "local-life-signal-entry"
  | "test-love-distance"
  | "test-work-rhythm"
  | "test-name-impression"
  | "test-local-life"
  | "open-testing-guide";
export type RecommendationActionRole = "primary" | "secondary" | "suppressed";
export type RecommendationSignalTestId =
  | "current-state"
  | "love-distance"
  | "work-rhythm"
  | "name-impression"
  | "local-life";
export type RecommendationMode =
  | "immediate_result"
  | "return_session"
  | "line_save"
  | "local_life_inquiry"
  | "select_design_interest";
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

export const RECOMMENDATION_SIGNAL_TYPES = [
  "test_started",
  "test_completed",
  "recommendation_package_shown",
  "recommendation_action_clicked",
  "recommendation_interest_clicked",
  "report_interest_clicked",
  "select_interest_clicked",
  "design_interest_clicked",
  "community_interest_clicked",
  "local_life_interest_clicked",
  "line_save_interest_clicked",
  "related_test_clicked",
] as const satisfies readonly RecommendationSignalType[];

export const RECOMMENDATION_SIGNAL_SOURCES = [
  "tests_page",
  "open_testing_page",
  "love_distance_flow",
  "work_rhythm_flow",
  "name_impression_flow",
  "local_life_flow",
  "result_page",
  "report_preview_page",
  "full_report_page",
] as const satisfies readonly RecommendationSignalSource[];

export const RECOMMENDATION_INTEREST_IDS = [
  "report-preview",
  "line-save",
  "related-test",
  "select-info",
  "design-interest",
  "community-interest",
  "local-life-interest",
] as const satisfies readonly RecommendationInterestId[];

export const RECOMMENDATION_ACTION_IDS = [
  "report-preview-sample",
  "line-save-entry",
  "select-hint",
  "design-interest-entry",
  "community-interest-entry",
  "local-life-signal-entry",
  "test-love-distance",
  "test-work-rhythm",
  "test-name-impression",
  "test-local-life",
  "open-testing-guide",
] as const satisfies readonly RecommendationActionId[];

export const RECOMMENDATION_ACTION_ROLES = [
  "primary",
  "secondary",
  "suppressed",
] as const satisfies readonly RecommendationActionRole[];

export const RECOMMENDATION_SIGNAL_TEST_IDS = [
  "current-state",
  "love-distance",
  "work-rhythm",
  "name-impression",
  "local-life",
] as const satisfies readonly RecommendationSignalTestId[];

export const RECOMMENDATION_MODES = [
  "immediate_result",
  "return_session",
  "line_save",
  "local_life_inquiry",
  "select_design_interest",
] as const satisfies readonly RecommendationMode[];

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

export const FEEDBACK_SUBMISSION_STATUSES = [
  "received",
  "reviewed",
  "archived",
] as const satisfies readonly FeedbackSubmissionStatus[];

export const FEEDBACK_EMAIL_DELIVERY_STATUSES = [
  "not_requested",
  "pending",
  "sent",
  "failed",
] as const satisfies readonly FeedbackEmailDeliveryStatus[];

const reportEventTypeSet = new Set<string>(REPORT_EVENT_TYPES);
const recommendationSignalTypeSet = new Set<string>(RECOMMENDATION_SIGNAL_TYPES);
const recommendationSignalSourceSet = new Set<string>(RECOMMENDATION_SIGNAL_SOURCES);
const recommendationInterestIdSet = new Set<string>(RECOMMENDATION_INTEREST_IDS);
const recommendationActionIdSet = new Set<string>(RECOMMENDATION_ACTION_IDS);
const recommendationActionRoleSet = new Set<string>(RECOMMENDATION_ACTION_ROLES);
const recommendationSignalTestIdSet = new Set<string>(RECOMMENDATION_SIGNAL_TEST_IDS);
const recommendationModeSet = new Set<string>(RECOMMENDATION_MODES);
const relationshipActivationSourceSet = new Set<string>(RELATIONSHIP_ACTIVATION_SOURCES);
const openTestingEventNameSet = new Set<string>(OPEN_TESTING_EVENT_NAMES);
const feedbackSubmissionStatusSet = new Set<string>(FEEDBACK_SUBMISSION_STATUSES);
const feedbackEmailDeliveryStatusSet = new Set<string>(FEEDBACK_EMAIL_DELIVERY_STATUSES);

export function isReportEventType(value: unknown): value is ReportEventType {
  return typeof value === "string" && reportEventTypeSet.has(value);
}

export function isRecommendationSignalType(value: unknown): value is RecommendationSignalType {
  return typeof value === "string" && recommendationSignalTypeSet.has(value);
}

export function isRecommendationSignalSource(value: unknown): value is RecommendationSignalSource {
  return typeof value === "string" && recommendationSignalSourceSet.has(value);
}

export function isRecommendationInterestId(value: unknown): value is RecommendationInterestId {
  return typeof value === "string" && recommendationInterestIdSet.has(value);
}

export function isRecommendationActionId(value: unknown): value is RecommendationActionId {
  return typeof value === "string" && recommendationActionIdSet.has(value);
}

export function isRecommendationActionRole(value: unknown): value is RecommendationActionRole {
  return typeof value === "string" && recommendationActionRoleSet.has(value);
}

export function isRecommendationSignalTestId(value: unknown): value is RecommendationSignalTestId {
  return typeof value === "string" && recommendationSignalTestIdSet.has(value);
}

export function isRecommendationMode(value: unknown): value is RecommendationMode {
  return typeof value === "string" && recommendationModeSet.has(value);
}

export function isRelationshipActivationSource(value: unknown): value is RelationshipActivationSource {
  return typeof value === "string" && relationshipActivationSourceSet.has(value);
}

export function isOpenTestingEventName(value: unknown): value is OpenTestingEventName {
  return typeof value === "string" && openTestingEventNameSet.has(value);
}

export function isFeedbackSubmissionStatus(value: unknown): value is FeedbackSubmissionStatus {
  return typeof value === "string" && feedbackSubmissionStatusSet.has(value);
}

export function isFeedbackEmailDeliveryStatus(value: unknown): value is FeedbackEmailDeliveryStatus {
  return typeof value === "string" && feedbackEmailDeliveryStatusSet.has(value);
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
  metadataJson: Record<string, string | number | boolean | null>;
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
  emailDeliveryStatus: FeedbackEmailDeliveryStatus;
  emailDeliveryError: string | null;
  emailLastAttemptedAt: string | null;
  metadataJson: Record<string, string | number | boolean | null>;
  reviewedAt: string | null;
  archivedAt: string | null;
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

export type RecommendationSignalRecord = {
  id: string;
  anonymousSessionId: string;
  userProfileId: string | null;
  authIdentityId: string | null;
  source: RecommendationSignalSource;
  signalType: RecommendationSignalType;
  testId: RecommendationSignalTestId | null;
  resultId: string | null;
  interestId: RecommendationInterestId | null;
  actionId: RecommendationActionId | null;
  actionRole: RecommendationActionRole | null;
  recommendationMode: RecommendationMode | null;
  note: string | null;
  pagePath: string | null;
  metadataJson: Record<string, string | number | boolean | null>;
  createdAt: string;
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
  | "recommendation-signals"
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

export type RecommendationSignalInput = {
  source: RecommendationSignalSource;
  signalType: RecommendationSignalType;
  anonymousSessionId?: string | null;
  userProfileId?: string | null;
  authIdentityId?: string | null;
  testId?: RecommendationSignalTestId | null;
  resultId?: string | null;
  interestId?: RecommendationInterestId | null;
  actionId?: RecommendationActionId | null;
  actionRole?: RecommendationActionRole | null;
  recommendationMode?: RecommendationMode | null;
  note?: string | null;
  pagePath?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
};
