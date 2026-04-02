import type { AuditLog, AuthIdentity, ConsentLog, Conversation, MessageEvent, SupportCase, UserProfile } from "@/lib/server/foundation/schema";
import { createAuthIdentityId } from "@/lib/server/midBackend/utils";
import {
  deleteFoundationRecord,
  getFoundationRecord,
  getFoundationIndexRecord,
  listAuditLogs,
  listAuthIdentities,
  listConsentLogs,
  listConversations,
  listMessageEvents,
  listSupportCases,
  listUserProfiles,
  putFoundationIndexRecord,
  putFoundationRecord,
} from "@/lib/server/foundation/store";

type ConversationExternalIdentityIndex = {
  externalIdentityKey: string;
  conversationId: string;
  updatedAt: string;
};

type SupportCaseConversationIndex = {
  conversationId: string;
  supportCaseId: string;
  updatedAt: string;
};

type ConversationMessageEventsIndex = {
  conversationId: string;
  messageEventIds: string[];
  latestRecordedAt: string;
  updatedAt: string;
};

function requireNonEmptyString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`foundation_repository_invalid_${field}`);
  }
}

function requireCanonicalTimestamps(record: { createdAt?: unknown; updatedAt?: unknown }) {
  requireNonEmptyString(record.createdAt, "createdAt");
  requireNonEmptyString(record.updatedAt, "updatedAt");
}

function requireCanonicalRouting(record: { source?: unknown; channel?: unknown; bindingState?: unknown }) {
  requireNonEmptyString(record.source, "source");
  requireNonEmptyString(record.channel, "channel");
  requireNonEmptyString(record.bindingState, "bindingState");
}

function validateUserProfile(record: UserProfile) {
  requireNonEmptyString(record.userProfileId, "userProfileId");
  requireCanonicalTimestamps(record);
  requireCanonicalRouting(record);
}

function validateAuthIdentity(record: AuthIdentity) {
  requireNonEmptyString(record.authIdentityId, "authIdentityId");
  requireCanonicalTimestamps(record);
  requireCanonicalRouting(record);
  requireNonEmptyString(record.identityType, "identityType");
  requireNonEmptyString(record.identityStatus, "identityStatus");
}

function validateConversation(record: Conversation) {
  requireNonEmptyString(record.conversationId, "conversationId");
  requireCanonicalTimestamps(record);
  requireCanonicalRouting(record);
  requireNonEmptyString(record.externalIdentityKey, "externalIdentityKey");
  requireNonEmptyString(record.latestActivityAt, "latestActivityAt");
}

function validateMessageEvent(record: MessageEvent) {
  requireNonEmptyString(record.messageEventId, "messageEventId");
  requireCanonicalTimestamps(record);
  requireCanonicalRouting(record);
  requireNonEmptyString(record.direction, "direction");
  requireNonEmptyString(record.eventType, "eventType");
  requireNonEmptyString(record.recordedAt, "recordedAt");
}

function validateSupportCase(record: SupportCase) {
  requireNonEmptyString(record.supportCaseId, "supportCaseId");
  requireCanonicalTimestamps(record);
  requireCanonicalRouting(record);
  requireNonEmptyString(record.status, "status");
  requireNonEmptyString(record.title, "title");
  requireNonEmptyString(record.latestActivityAt, "latestActivityAt");
}

function validateConsentLog(record: ConsentLog) {
  requireNonEmptyString(record.consentLogId, "consentLogId");
  requireCanonicalTimestamps(record);
  requireCanonicalRouting(record);
  requireNonEmptyString(record.policyVersion, "policyVersion");
  requireNonEmptyString(record.consentType, "consentType");
  requireNonEmptyString(record.timestamp, "timestamp");
}

function validateAuditLog(record: AuditLog) {
  requireNonEmptyString(record.auditLogId, "auditLogId");
  requireCanonicalTimestamps(record);
  requireCanonicalRouting(record);
  requireNonEmptyString(record.actorType, "actorType");
  requireNonEmptyString(record.action, "action");
  requireNonEmptyString(record.resourceType, "resourceType");
  requireNonEmptyString(record.summary, "summary");
}

export const foundationUserProfileRepository = {
  async getById(userProfileId: string) {
    return getFoundationRecord<UserProfile>("user-profiles", userProfileId);
  },
  async getByLegacyAccountId(legacyAccountId: string) {
    const entries = await listUserProfiles();
    return entries.find((entry) => entry.legacyAccountId === legacyAccountId) || null;
  },
  async list() {
    return listUserProfiles();
  },
  async listByIds(userProfileIds: string[]) {
    const wanted = new Set(userProfileIds);
    const entries = await listUserProfiles();
    return entries.filter((entry) => wanted.has(entry.userProfileId));
  },
  async save(record: UserProfile) {
    validateUserProfile(record);
    await putFoundationRecord("user-profiles", record.userProfileId, record);
    return record;
  },
} as const;

export const foundationAuthIdentityRepository = {
  async getById(authIdentityId: string) {
    return getFoundationRecord<AuthIdentity>("auth-identities", authIdentityId);
  },
  async getByEmail(emailNormalized: string) {
    const normalized = emailNormalized.trim().toLowerCase();
    return getFoundationRecord<AuthIdentity>("auth-identities", createAuthIdentityId("email_password", normalized));
  },
  async getByLineUserId(lineUserId: string) {
    return getFoundationRecord<AuthIdentity>("auth-identities", createAuthIdentityId("line", lineUserId));
  },
  async getByExternalIdentityKey(externalIdentityKey: string) {
    if (externalIdentityKey.startsWith("line:")) {
      return this.getByLineUserId(externalIdentityKey.slice("line:".length));
    }

    if (externalIdentityKey.startsWith("email:")) {
      return this.getByEmail(externalIdentityKey.slice("email:".length));
    }

    const entries = await listAuthIdentities();
    return entries.find((entry) => entry.externalIdentityKey === externalIdentityKey) || null;
  },
  async list() {
    return listAuthIdentities();
  },
  async listByUserProfileId(userProfileId: string) {
    const entries = await listAuthIdentities();
    return entries.filter((entry) => entry.userProfileId === userProfileId);
  },
  async listUnbound() {
    const entries = await listAuthIdentities();
    return entries.filter((entry) => entry.bindingState === "unbound" || !entry.userProfileId);
  },
  async save(record: AuthIdentity) {
    validateAuthIdentity(record);
    await putFoundationRecord("auth-identities", record.authIdentityId, record);
    return record;
  },
  async delete(authIdentityId: string) {
    await deleteFoundationRecord("auth-identities", authIdentityId);
  },
} as const;

export const foundationConversationRepository = {
  async getById(conversationId: string) {
    return getFoundationRecord<Conversation>("conversations", conversationId);
  },
  async getByExternalIdentityKey(externalIdentityKey: string) {
    const index = await getFoundationIndexRecord<ConversationExternalIdentityIndex>(
      "conversation-by-external-identity",
      externalIdentityKey,
    );

    if (!index?.conversationId) {
      return null;
    }

    return getFoundationRecord<Conversation>("conversations", index.conversationId);
  },
  async list() {
    return listConversations();
  },
  async listByUserProfileId(userProfileId: string) {
    const entries = await listConversations();
    return entries.filter((entry) => entry.userProfileId === userProfileId);
  },
  async listByAuthIdentityId(authIdentityId: string) {
    const entries = await listConversations();
    return entries.filter((entry) => entry.authIdentityId === authIdentityId);
  },
  async listByExternalIdentityKey(externalIdentityKey: string) {
    const entry = await this.getByExternalIdentityKey(externalIdentityKey);
    return entry ? [entry] : [];
  },
  async listUnboundByExternalIdentityKey(externalIdentityKey: string) {
    const entry = await this.getByExternalIdentityKey(externalIdentityKey);
    if (!entry || (entry.userProfileId && entry.bindingState !== "unbound")) {
      return [];
    }
    return [entry];
  },
  async findByExternalIdentityKey(externalIdentityKey: string) {
    return this.getByExternalIdentityKey(externalIdentityKey);
  },
  async save(record: Conversation) {
    validateConversation(record);
    await putFoundationRecord("conversations", record.conversationId, record);
    await putFoundationIndexRecord("conversation-by-external-identity", record.externalIdentityKey, {
      externalIdentityKey: record.externalIdentityKey,
      conversationId: record.conversationId,
      updatedAt: record.updatedAt,
    } satisfies ConversationExternalIdentityIndex);
    return record;
  },
} as const;

export const foundationMessageEventRepository = {
  async getById(messageEventId: string) {
    return getFoundationRecord<MessageEvent>("message-events", messageEventId);
  },
  async list() {
    return listMessageEvents();
  },
  async listByConversationId(conversationId: string) {
    const index = await getFoundationIndexRecord<ConversationMessageEventsIndex>(
      "message-events-by-conversation",
      conversationId,
    );

    if (!index?.messageEventIds?.length) {
      return [];
    }

    const entries = await Promise.all(index.messageEventIds.map((messageEventId) => this.getById(messageEventId)));
    return entries.flatMap((entry) => (entry ? [entry] : []));
  },
  async listByUserProfileId(userProfileId: string) {
    const entries = await listMessageEvents();
    return entries.filter((entry) => entry.userProfileId === userProfileId);
  },
  async listByAuthIdentityId(authIdentityId: string) {
    const entries = await listMessageEvents();
    return entries.filter((entry) => entry.authIdentityId === authIdentityId);
  },
  async listByExternalIdentityKey(externalIdentityKey: string) {
    const conversation = await foundationConversationRepository.getByExternalIdentityKey(externalIdentityKey);

    if (!conversation) {
      return [];
    }

    return this.listByConversationId(conversation.conversationId);
  },
  async listUnboundByExternalIdentityKey(externalIdentityKey: string) {
    const conversation = await foundationConversationRepository.getByExternalIdentityKey(externalIdentityKey);

    if (!conversation || (conversation.userProfileId && conversation.bindingState !== "unbound")) {
      return [];
    }

    return this.listByConversationId(conversation.conversationId);
  },
  async getByExternalEventId(externalEventId: string) {
    const entries = await listMessageEvents();
    return entries.find((entry) => entry.externalEventId === externalEventId) || null;
  },
  async save(record: MessageEvent) {
    validateMessageEvent(record);
    await putFoundationRecord("message-events", record.messageEventId, record);

    if (record.conversationId) {
      const existingIndex = await getFoundationIndexRecord<ConversationMessageEventsIndex>(
        "message-events-by-conversation",
        record.conversationId,
      );
      const messageEventIds = Array.from(new Set([...(existingIndex?.messageEventIds || []), record.messageEventId]));

      await putFoundationIndexRecord("message-events-by-conversation", record.conversationId, {
        conversationId: record.conversationId,
        messageEventIds,
        latestRecordedAt: record.recordedAt,
        updatedAt: record.updatedAt,
      } satisfies ConversationMessageEventsIndex);
    }

    return record;
  },
} as const;

export const foundationSupportCaseRepository = {
  async getById(supportCaseId: string) {
    return getFoundationRecord<SupportCase>("support-cases", supportCaseId);
  },
  async getByConversationId(conversationId: string) {
    const index = await getFoundationIndexRecord<SupportCaseConversationIndex>(
      "support-case-by-conversation",
      conversationId,
    );

    if (!index?.supportCaseId) {
      return null;
    }

    return getFoundationRecord<SupportCase>("support-cases", index.supportCaseId);
  },
  async list() {
    return listSupportCases();
  },
  async listByUserProfileId(userProfileId: string) {
    const entries = await listSupportCases();
    return entries.filter((entry) => entry.userProfileId === userProfileId);
  },
  async listByAuthIdentityId(authIdentityId: string) {
    const entries = await listSupportCases();
    return entries.filter((entry) => entry.authIdentityId === authIdentityId);
  },
  async listByConversationId(conversationId: string) {
    const entry = await this.getByConversationId(conversationId);
    return entry ? [entry] : [];
  },
  async listByConversationIds(conversationIds: string[]) {
    if (!conversationIds.length) {
      return [];
    }
    const entries = await Promise.all(conversationIds.map((conversationId) => this.getByConversationId(conversationId)));
    return entries.flatMap((entry) => (entry ? [entry] : []));
  },
  async listUnboundByAuthIdentityId(authIdentityId: string) {
    const entries = await listSupportCases();
    return entries.filter((entry) => entry.authIdentityId === authIdentityId && (!entry.userProfileId || entry.bindingState === "unbound"));
  },
  async save(record: SupportCase) {
    validateSupportCase(record);
    await putFoundationRecord("support-cases", record.supportCaseId, record);

    if (record.conversationId) {
      await putFoundationIndexRecord("support-case-by-conversation", record.conversationId, {
        conversationId: record.conversationId,
        supportCaseId: record.supportCaseId,
        updatedAt: record.updatedAt,
      } satisfies SupportCaseConversationIndex);
    }

    return record;
  },
} as const;

export const foundationConsentLogRepository = {
  async list() {
    return listConsentLogs();
  },
  async listByUserProfileId(userProfileId: string) {
    const entries = await listConsentLogs();
    return entries.filter((entry) => entry.userProfileId === userProfileId);
  },
  async save(record: ConsentLog) {
    validateConsentLog(record);
    await putFoundationRecord("consent-logs", record.consentLogId, record);
    return record;
  },
} as const;

export const foundationAuditLogRepository = {
  async list() {
    return listAuditLogs();
  },
  async listByActorUserProfileId(actorUserProfileId: string) {
    const entries = await listAuditLogs();
    return entries.filter((entry) => entry.actorUserProfileId === actorUserProfileId);
  },
  async listByActorAuthIdentityId(actorAuthIdentityId: string) {
    const entries = await listAuditLogs();
    return entries.filter((entry) => entry.actorAuthIdentityId === actorAuthIdentityId);
  },
  async listByAction(action: AuditLog["action"]) {
    const entries = await listAuditLogs();
    return entries.filter((entry) => entry.action === action);
  },
  async listByResource(resourceType: AuditLog["resourceType"], resourceId: string) {
    const entries = await listAuditLogs();
    return entries.filter((entry) => entry.resourceType === resourceType && entry.resourceId === resourceId);
  },
  async save(record: AuditLog) {
    validateAuditLog(record);
    await putFoundationRecord("audit-logs", record.auditLogId, record);
    return record;
  },
} as const;
