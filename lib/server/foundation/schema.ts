export type FoundationLocale = "ja" | "en";

export type Channel = "email" | "line" | "support_web" | "support_internal" | "admin" | "system";
export type Source =
  | "email_password"
  | "line_login"
  | "line_webhook"
  | "support_workspace"
  | "ai_advisor"
  | "admin_console"
  | "system";
export type Direction = "inbound" | "outbound" | "system";
export type BindingState = "bound" | "unbound";
export type UserProfileStatus = "active" | "merged" | "suspended" | "deleted";
export type AuthIdentityType = "email_password" | "line";
export type AuthIdentityStatus = "active" | "unbound" | "pending" | "conflicted" | "revoked" | "merged";
export type ConversationStatus = "active" | "closed" | "archived";
export type MessageEventType = "message" | "follow" | "unfollow" | "postback" | "note" | "delivery";
export type ReplyStatus = "not_attempted" | "sent" | "failed" | "not_applicable";
export type SupportCaseStatus = "new" | "open" | "pending" | "resolved";
export type ConsentType = "account_registration" | "line_identity_binding" | "line_primary_login" | "email_identity_attachment";
export type AuditActorType = "user" | "admin" | "system";
export type AuditAction =
  | "identity.bind"
  | "identity.merge"
  | "identity.line_primary_login"
  | "identity.email_register"
  | "identity.email_attach"
  | "password.change"
  | "support.view_sensitive"
  | "admin.view_sensitive"
  | "support_case.status_update"
  | "message.send"
  | "timeline.write";
export type SyncStatus = "live" | "legacy_compat" | "stale";
export type SensitivityLevel = "ordinary" | "sensitive" | "system";

export type AiAssistHooks = {
  templateReplySlot: string | null;
  draftReplySlot: string | null;
  knowledgeReferenceSlot: string | null;
};

export type UserProfile = {
  userProfileId: string;
  legacyAccountId: string | null;
  profileStatus: UserProfileStatus;
  bindingState: "bound";
  source: Source;
  channel: Channel;
  profile: {
    displayName: string;
    primaryLocale: FoundationLocale | null;
    city: string;
    role: string;
    lineDisplayName: string;
    lineNotificationsEnabled: boolean;
  };
  sensitiveProfile: {
    familyContactName: string;
    familyContactRelation: string;
    familyContactMethod: string;
    familyContactValue: string;
    familyShareNote: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type AuthIdentity = {
  authIdentityId: string;
  identityType: AuthIdentityType;
  identityStatus: AuthIdentityStatus;
  bindingState: BindingState;
  userProfileId: string | null;
  legacyAccountId: string | null;
  identityKeyHash: string;
  identityKeyHint: string | null;
  externalIdentityKey: string;
  externalIdentityKeyHint: string | null;
  emailNormalized: string | null;
  passwordHashPresent: boolean;
  lineUserId: string | null;
  lineIdTokenSubject: string | null;
  linePictureUrl: string | null;
  lineConnectedAt: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  lastBoundAt: string | null;
  source: Source;
  channel: Channel;
  createdAt: string;
  updatedAt: string;
};

export type Conversation = {
  conversationId: string;
  userProfileId: string | null;
  authIdentityId: string | null;
  supportCaseId: string | null;
  channel: Channel;
  source: Source;
  bindingState: BindingState;
  externalIdentityKey: string;
  externalIdentityKeyHint: string | null;
  subject: string | null;
  conversationStatus: ConversationStatus;
  latestMessageEventId: string | null;
  latestActivityAt: string;
  createdAt: string;
  updatedAt: string;
};

export type MessageEvent = {
  messageEventId: string;
  conversationId: string | null;
  supportCaseId: string | null;
  userProfileId: string | null;
  authIdentityId: string | null;
  channel: Channel;
  source: Source;
  direction: Direction;
  bindingState: BindingState;
  eventType: MessageEventType;
  messageType: string | null;
  externalIdentityKey: string | null;
  externalEventId: string | null;
  externalMessageId: string | null;
  replyTokenPresent: boolean;
  replyStatus: ReplyStatus;
  replyErrorCode: string | null;
  deliveryMode: string | null;
  isRedelivery: boolean;
  sourceType: string | null;
  contentText: string | null;
  contentPayloadRef: string | null;
  occurredAt: string | null;
  recordedAt: string;
  aiAssist: AiAssistHooks;
  createdAt: string;
  updatedAt: string;
};

export type SupportCase = {
  supportCaseId: string;
  userProfileId: string | null;
  authIdentityId: string | null;
  conversationId: string | null;
  latestMessageEventId: string | null;
  status: SupportCaseStatus;
  bindingState: BindingState;
  source: Source;
  channel: Channel;
  title: string;
  summary: string | null;
  latestActivityAt: string;
  aiAssist: AiAssistHooks;
  createdAt: string;
  updatedAt: string;
};

export type ConsentLog = {
  consentLogId: string;
  userProfileId: string | null;
  authIdentityId: string | null;
  policyVersion: string;
  consentType: ConsentType;
  channel: Channel;
  source: Source;
  bindingState: BindingState;
  timestamp: string;
  metadata: Record<string, string | boolean | null>;
  createdAt: string;
  updatedAt: string;
};

export type AuditLog = {
  auditLogId: string;
  actorType: AuditActorType;
  actorUserProfileId: string | null;
  actorAuthIdentityId: string | null;
  action: AuditAction;
  resourceType: "user_profile" | "auth_identity" | "conversation" | "message_event" | "support_case" | "consent_log" | "admin_view";
  resourceId: string | null;
  channel: Channel;
  source: Source;
  bindingState: BindingState;
  containsSensitiveAccess: boolean;
  summary: string;
  ipHash: string | null;
  metadata: Record<string, string | boolean | null>;
  createdAt: string;
  updatedAt: string;
};

export const USER_PROFILE_FIELD_DEFINITIONS = [
  { field: "legacyAccountId", sensitivity: "system" },
  { field: "profile.displayName", sensitivity: "ordinary" },
  { field: "profile.primaryLocale", sensitivity: "ordinary" },
  { field: "profile.city", sensitivity: "ordinary" },
  { field: "profile.role", sensitivity: "ordinary" },
  { field: "profile.lineDisplayName", sensitivity: "ordinary" },
  { field: "profile.lineNotificationsEnabled", sensitivity: "ordinary" },
  { field: "sensitiveProfile.familyContactName", sensitivity: "sensitive" },
  { field: "sensitiveProfile.familyContactRelation", sensitivity: "sensitive" },
  { field: "sensitiveProfile.familyContactMethod", sensitivity: "sensitive" },
  { field: "sensitiveProfile.familyContactValue", sensitivity: "sensitive" },
  { field: "sensitiveProfile.familyShareNote", sensitivity: "sensitive" },
] satisfies Array<{ field: string; sensitivity: SensitivityLevel }>;

export const AUTH_IDENTITY_FIELD_DEFINITIONS = [
  { field: "identityType", sensitivity: "system" },
  { field: "identityKeyHash", sensitivity: "sensitive" },
  { field: "identityKeyHint", sensitivity: "ordinary" },
  { field: "externalIdentityKey", sensitivity: "sensitive" },
  { field: "externalIdentityKeyHint", sensitivity: "ordinary" },
  { field: "emailNormalized", sensitivity: "sensitive" },
  { field: "lineUserId", sensitivity: "sensitive" },
  { field: "lineIdTokenSubject", sensitivity: "sensitive" },
  { field: "linePictureUrl", sensitivity: "ordinary" },
] satisfies Array<{ field: string; sensitivity: SensitivityLevel }>;

export const MESSAGE_EVENT_FIELD_DEFINITIONS = [
  { field: "channel", sensitivity: "system" },
  { field: "source", sensitivity: "system" },
  { field: "direction", sensitivity: "system" },
  { field: "bindingState", sensitivity: "system" },
  { field: "externalIdentityKey", sensitivity: "sensitive" },
  { field: "externalEventId", sensitivity: "ordinary" },
  { field: "contentText", sensitivity: "sensitive" },
  { field: "contentPayloadRef", sensitivity: "sensitive" },
] satisfies Array<{ field: string; sensitivity: SensitivityLevel }>;

export const SUPPORT_CASE_FIELD_DEFINITIONS = [
  { field: "status", sensitivity: "system" },
  { field: "title", sensitivity: "ordinary" },
  { field: "summary", sensitivity: "sensitive" },
  { field: "aiAssist.templateReplySlot", sensitivity: "system" },
  { field: "aiAssist.draftReplySlot", sensitivity: "system" },
  { field: "aiAssist.knowledgeReferenceSlot", sensitivity: "system" },
] satisfies Array<{ field: string; sensitivity: SensitivityLevel }>;

export const CONSENT_LOG_FIELD_DEFINITIONS = [
  { field: "policyVersion", sensitivity: "system" },
  { field: "consentType", sensitivity: "system" },
  { field: "channel", sensitivity: "system" },
  { field: "source", sensitivity: "system" },
] satisfies Array<{ field: string; sensitivity: SensitivityLevel }>;

export const AUDIT_LOG_FIELD_DEFINITIONS = [
  { field: "action", sensitivity: "system" },
  { field: "resourceType", sensitivity: "system" },
  { field: "containsSensitiveAccess", sensitivity: "system" },
  { field: "ipHash", sensitivity: "sensitive" },
] satisfies Array<{ field: string; sensitivity: SensitivityLevel }>;

export type CanonicalFoundationEntityDefinition = {
  entity: "UserProfile" | "AuthIdentity" | "Conversation" | "MessageEvent" | "SupportCase" | "ConsentLog" | "AuditLog";
  collection:
    | "user-profiles"
    | "auth-identities"
    | "conversations"
    | "message-events"
    | "support-cases"
    | "consent-logs"
    | "audit-logs";
  primaryKey: string;
  sortKey: string;
  ownership: {
    primaryOwner: "Identity" | "CRM" | "Messaging" | "Privacy" | "Support Operations";
    supportingOwners: Array<"Identity" | "CRM" | "Messaging" | "Privacy" | "Support Operations">;
  };
  relationships: Array<{
    field: string;
    references:
      | "UserProfile"
      | "AuthIdentity"
      | "Conversation"
      | "MessageEvent"
      | "SupportCase"
      | "ConsentLog"
      | "AuditLog";
    cardinality: "one" | "many" | "optional";
  }>;
  queryPatterns: string[];
};

export const CANONICAL_FOUNDATION_MODEL = [
  {
    entity: "UserProfile",
    collection: "user-profiles",
    primaryKey: "userProfileId",
    sortKey: "createdAt",
    ownership: {
      primaryOwner: "Identity",
      supportingOwners: ["CRM", "Support Operations", "Privacy"],
    },
    relationships: [
      { field: "legacyAccountId", references: "UserProfile", cardinality: "optional" },
      { field: "userProfileId", references: "AuthIdentity", cardinality: "many" },
      { field: "userProfileId", references: "Conversation", cardinality: "many" },
      { field: "userProfileId", references: "MessageEvent", cardinality: "many" },
      { field: "userProfileId", references: "SupportCase", cardinality: "many" },
      { field: "userProfileId", references: "ConsentLog", cardinality: "many" },
      { field: "actorUserProfileId", references: "AuditLog", cardinality: "many" },
    ],
    queryPatterns: [
      "Lookup by userProfileId",
      "Lookup by legacyAccountId",
      "Load latest support cases, timeline, and consent state for a user",
    ],
  },
  {
    entity: "AuthIdentity",
    collection: "auth-identities",
    primaryKey: "authIdentityId",
    sortKey: "createdAt",
    ownership: {
      primaryOwner: "Identity",
      supportingOwners: ["Privacy", "Support Operations"],
    },
    relationships: [
      { field: "userProfileId", references: "UserProfile", cardinality: "optional" },
      { field: "authIdentityId", references: "Conversation", cardinality: "many" },
      { field: "authIdentityId", references: "MessageEvent", cardinality: "many" },
      { field: "authIdentityId", references: "SupportCase", cardinality: "many" },
      { field: "authIdentityId", references: "ConsentLog", cardinality: "many" },
      { field: "actorAuthIdentityId", references: "AuditLog", cardinality: "many" },
    ],
    queryPatterns: [
      "Lookup by authIdentityId",
      "Lookup by normalized email",
      "Lookup by lineUserId",
      "Find all identities bound to a canonical user",
    ],
  },
  {
    entity: "Conversation",
    collection: "conversations",
    primaryKey: "conversationId",
    sortKey: "latestActivityAt",
    ownership: {
      primaryOwner: "Messaging",
      supportingOwners: ["CRM", "Support Operations", "Identity"],
    },
    relationships: [
      { field: "userProfileId", references: "UserProfile", cardinality: "optional" },
      { field: "authIdentityId", references: "AuthIdentity", cardinality: "optional" },
      { field: "supportCaseId", references: "SupportCase", cardinality: "optional" },
      { field: "latestMessageEventId", references: "MessageEvent", cardinality: "optional" },
    ],
    queryPatterns: [
      "Lookup active conversation by externalIdentityKey",
      "List recent conversations by userProfileId",
      "Resume support workspace continuity by session or bound user",
    ],
  },
  {
    entity: "MessageEvent",
    collection: "message-events",
    primaryKey: "messageEventId",
    sortKey: "recordedAt",
    ownership: {
      primaryOwner: "Messaging",
      supportingOwners: ["CRM", "Support Operations", "Privacy"],
    },
    relationships: [
      { field: "conversationId", references: "Conversation", cardinality: "optional" },
      { field: "supportCaseId", references: "SupportCase", cardinality: "optional" },
      { field: "userProfileId", references: "UserProfile", cardinality: "optional" },
      { field: "authIdentityId", references: "AuthIdentity", cardinality: "optional" },
    ],
    queryPatterns: [
      "Load conversation timeline ordered by recordedAt",
      "Load all events tied to a supportCaseId",
      "Audit inbound/outbound support interactions by channel and source",
    ],
  },
  {
    entity: "SupportCase",
    collection: "support-cases",
    primaryKey: "supportCaseId",
    sortKey: "latestActivityAt",
    ownership: {
      primaryOwner: "Support Operations",
      supportingOwners: ["CRM", "Messaging", "Identity"],
    },
    relationships: [
      { field: "userProfileId", references: "UserProfile", cardinality: "optional" },
      { field: "authIdentityId", references: "AuthIdentity", cardinality: "optional" },
      { field: "conversationId", references: "Conversation", cardinality: "optional" },
      { field: "latestMessageEventId", references: "MessageEvent", cardinality: "optional" },
    ],
    queryPatterns: [
      "Find open case by conversationId",
      "List latest cases by userProfileId",
      "Track ongoing support state, summary, and operator handoff context",
    ],
  },
  {
    entity: "ConsentLog",
    collection: "consent-logs",
    primaryKey: "consentLogId",
    sortKey: "timestamp",
    ownership: {
      primaryOwner: "Privacy",
      supportingOwners: ["Identity", "Support Operations"],
    },
    relationships: [
      { field: "userProfileId", references: "UserProfile", cardinality: "optional" },
      { field: "authIdentityId", references: "AuthIdentity", cardinality: "optional" },
    ],
    queryPatterns: [
      "List recent consent state for a user",
      "Audit policy acceptance by consentType and policyVersion",
    ],
  },
  {
    entity: "AuditLog",
    collection: "audit-logs",
    primaryKey: "auditLogId",
    sortKey: "createdAt",
    ownership: {
      primaryOwner: "Privacy",
      supportingOwners: ["Identity", "Messaging", "Support Operations", "CRM"],
    },
    relationships: [
      { field: "actorUserProfileId", references: "UserProfile", cardinality: "optional" },
      { field: "actorAuthIdentityId", references: "AuthIdentity", cardinality: "optional" },
    ],
    queryPatterns: [
      "Audit sensitive access and timeline writes",
      "Trace actions on a resourceId across admin and system actors",
    ],
  },
] satisfies CanonicalFoundationEntityDefinition[];
