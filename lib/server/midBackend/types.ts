export type AuthIdentityType = "email_password" | "line";

export type UserProfileStatus = "active" | "merged" | "suspended" | "deleted";

export type AuthIdentityStatus = "active" | "unbound" | "revoked" | "merged" | "pending_verification";

export type MessageChannel = "web" | "email" | "line" | "support_internal";

export type MessageDirection = "inbound" | "outbound" | "system";

export type MessageEventType = "message" | "follow" | "unfollow" | "postback" | "delivery" | "note";

export type ReplyStatus = "not_attempted" | "sent" | "failed" | "not_applicable";

export type PasswordResetTokenStatus = "active" | "used" | "expired" | "invalid";

export type UserProfile = {
  userProfileId: string;
  displayName: string;
  primaryLocale: "ja" | "en" | null;
  city: string;
  role: string;
  profileStatus: UserProfileStatus;
  lineDisplayName: string;
  lineNotificationsEnabled: boolean;
  familyContactName: string;
  familyContactRelation: string;
  familyContactMethod: string;
  familyContactValue: string;
  familyShareNote: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthIdentity = {
  authIdentityId: string;
  identityType: AuthIdentityType;
  identityKeyHash: string;
  identityKeyHint: string | null;
  userProfileId: string | null;
  identityStatus: AuthIdentityStatus;
  emailNormalized: string | null;
  passwordHashPresent: boolean;
  lineUserId: string | null;
  lineIdTokenSubject: string | null;
  linePictureUrl: string | null;
  lineConnectedAt: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
};

export type MessageEvent = {
  messageEventId: string;
  conversationId: string | null;
  userProfileId: string | null;
  authIdentityId: string | null;
  channel: MessageChannel;
  direction: MessageDirection;
  eventType: MessageEventType;
  messageType: string | null;
  providerEventId: string | null;
  providerMessageId: string | null;
  providerReplyTokenPresent: boolean;
  providerDeliveryMode: string | null;
  providerRedelivery: boolean;
  sourceType: string | null;
  contentText: string | null;
  contentPayloadRef: string | null;
  replyStatus: ReplyStatus;
  replyErrorCode: string | null;
  occurredAt: string | null;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type PasswordResetTokenView = {
  passwordResetTokenId: string;
  userProfileId: string;
  authIdentityId: string | null;
  emailNormalized: string;
  tokenHash: string;
  status: PasswordResetTokenStatus;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
};
