// Design-only canonical read models for future consultation/support/timeline
// adoption. These types are non-operative and must not change live route or
// storage behavior until a dedicated read adapter layer is introduced.

export type ConsultationArtifactReadModel = {
  consultationId: string;
  sessionId: string;
  userProfileId: string | null;
  locale: "ja" | "en";
  createdAt: string;
  recommendation: {
    recommendedCategory: string;
    secondaryRecommendation: string;
    summary: string;
    suggestedNextAction: string;
  };
  answerLabels: Record<string, string>;
  leadSubmitted: boolean;
  leadPresent: boolean;
};

export type SupportCaseReadModel = {
  supportCaseId: string;
  userProfileId: string | null;
  primaryAuthIdentityId: string | null;
  sourceType: "consultation" | "line" | "web_support";
  status: "open" | "pending_user" | "pending_internal" | "resolved" | "closed";
  summary: string;
  latestRecommendationCategory: string | null;
  latestSuggestedNextAction: string | null;
  consultationIds: string[];
  latestTimelineEntryAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SupportTimelineEntryReadModel = {
  supportTimelineEntryId: string;
  userProfileId: string | null;
  authIdentityId: string | null;
  supportCaseId: string | null;
  sourceType: "consultation" | "line_message" | "system_note";
  sourceRecordId: string;
  direction: "inbound" | "outbound" | "system";
  entryType:
    | "consultation_created"
    | "consultation_lead_submitted"
    | "line_follow"
    | "line_unfollow"
    | "line_message"
    | "line_postback"
    | "note";
  title: string;
  bodyText: string | null;
  occurredAt: string | null;
  recordedAt: string;
};
