import { createFoundationId, nowIso } from "@/lib/server/foundation/ids";
import { getAiAssistHooksForChannel } from "@/lib/server/foundation/aiAssistHooks";
import { privacyAuditService } from "@/lib/server/foundation/privacyService";
import type { BindingState, Channel, Conversation, MessageEvent, Source } from "@/lib/server/foundation/schema";
import { getFoundationRecord, listConversations, listMessageEvents, putFoundationRecord } from "@/lib/server/foundation/store";
import { supportCaseService } from "@/lib/server/foundation/supportCaseService";
import type { ConsultationRecord, LineWebhookEventRecord } from "@/lib/server/yorisouData";

function makeExternalKey(input: { channel: Channel; identityKey: string }) {
  return `${input.channel}:${input.identityKey}`;
}

export class TimelineService {
  async getConversationById(conversationId: string) {
    return getFoundationRecord<Conversation>("conversations", conversationId);
  }

  async ensureConversation(input: {
    userProfileId: string | null;
    authIdentityId: string | null;
    channel: Channel;
    source: Source;
    bindingState: BindingState;
    externalIdentityKey: string;
    externalIdentityKeyHint?: string | null;
    subject?: string | null;
  }) {
    const conversations = await listConversations();
    const timestamp = nowIso();
    const existing =
      conversations.find((entry) => entry.externalIdentityKey === input.externalIdentityKey) ||
      conversations.find(
        (entry) =>
          entry.channel === input.channel &&
          entry.userProfileId === input.userProfileId &&
          entry.authIdentityId === input.authIdentityId &&
          entry.conversationStatus === "active",
      ) ||
      null;

    if (existing) {
      const updated: Conversation = {
        ...existing,
        userProfileId: input.userProfileId ?? existing.userProfileId,
        authIdentityId: input.authIdentityId ?? existing.authIdentityId,
        subject: input.subject ?? existing.subject,
        bindingState: input.bindingState,
        latestActivityAt: timestamp,
        updatedAt: timestamp,
      };
      await putFoundationRecord("conversations", updated.conversationId, updated);
      return updated;
    }

    const conversation: Conversation = {
      conversationId: createFoundationId("conv"),
      userProfileId: input.userProfileId,
      authIdentityId: input.authIdentityId,
      supportCaseId: null,
      channel: input.channel,
      source: input.source,
      bindingState: input.bindingState,
      externalIdentityKey: input.externalIdentityKey,
      externalIdentityKeyHint: input.externalIdentityKeyHint || null,
      subject: input.subject || null,
      conversationStatus: "active",
      latestMessageEventId: null,
      latestActivityAt: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await putFoundationRecord("conversations", conversation.conversationId, conversation);
    return conversation;
  }

  async putMessageEvent(messageEvent: MessageEvent) {
    await putFoundationRecord("message-events", messageEvent.messageEventId, messageEvent);

    if (messageEvent.conversationId) {
      const conversation = await this.getConversationById(messageEvent.conversationId);

      if (conversation) {
        await putFoundationRecord("conversations", conversation.conversationId, {
          ...conversation,
          latestMessageEventId: messageEvent.messageEventId,
          latestActivityAt: messageEvent.recordedAt,
          updatedAt: messageEvent.updatedAt,
        });
      }
    }

    await privacyAuditService.recordAudit({
      actorType: "system",
      actorUserProfileId: messageEvent.userProfileId,
      actorAuthIdentityId: messageEvent.authIdentityId,
      action: "timeline.write",
      resourceType: "message_event",
      resourceId: messageEvent.messageEventId,
      channel: messageEvent.channel,
      source: messageEvent.source,
      bindingState: messageEvent.bindingState,
      summary: `Recorded ${messageEvent.channel} ${messageEvent.eventType} event`,
      metadata: {
        conversationId: messageEvent.conversationId,
        supportCaseId: messageEvent.supportCaseId,
      },
    });

    return messageEvent;
  }

  async recordSupportConsultationEvent(input: {
    consultation: ConsultationRecord;
    userProfileId: string | null;
  }) {
    const channel: Channel = "support_internal";
    const bindingState: BindingState = input.userProfileId ? "bound" : "unbound";
    const externalIdentityKey = input.userProfileId
      ? makeExternalKey({ channel, identityKey: `user:${input.userProfileId}` })
      : makeExternalKey({ channel, identityKey: `session:${input.consultation.sessionId}` });
    const conversation = await this.ensureConversation({
      userProfileId: input.userProfileId,
      authIdentityId: null,
      channel,
      source: "ai_advisor",
      bindingState,
      externalIdentityKey,
      subject: input.consultation.recommendedCategory,
    });
    const supportCase = await supportCaseService.ensureCase({
      userProfileId: input.userProfileId,
      authIdentityId: null,
      conversationId: conversation.conversationId,
      channel,
      source: "ai_advisor",
      bindingState,
      title: input.consultation.recommendedCategory,
      summary: input.consultation.summary,
    });
    const recordedAt = input.consultation.createdAt;
    const messageEvent: MessageEvent = {
      messageEventId: createFoundationId("mevt"),
      conversationId: conversation.conversationId,
      supportCaseId: supportCase.supportCaseId,
      userProfileId: input.userProfileId,
      authIdentityId: null,
      channel,
      source: "ai_advisor",
      direction: "system",
      bindingState,
      eventType: "note",
      messageType: "consultation_summary",
      externalIdentityKey,
      externalEventId: input.consultation.id,
      externalMessageId: null,
      replyTokenPresent: false,
      replyStatus: "not_applicable",
      replyErrorCode: null,
      deliveryMode: null,
      isRedelivery: false,
      sourceType: "consultation",
      contentText: `${input.consultation.recommendedCategory}\n${input.consultation.summary}`,
      contentPayloadRef: input.consultation.id,
      occurredAt: input.consultation.createdAt,
      recordedAt,
      aiAssist: getAiAssistHooksForChannel(channel),
      createdAt: recordedAt,
      updatedAt: recordedAt,
    };

    const created = await this.putMessageEvent(messageEvent);
    await putFoundationRecord("conversations", conversation.conversationId, {
      ...conversation,
      supportCaseId: supportCase.supportCaseId,
      latestMessageEventId: created.messageEventId,
      latestActivityAt: recordedAt,
      updatedAt: recordedAt,
    });
    await putFoundationRecord("support-cases", supportCase.supportCaseId, {
      ...supportCase,
      latestMessageEventId: created.messageEventId,
      latestActivityAt: recordedAt,
      updatedAt: recordedAt,
    });
    return created;
  }

  async recordLineWebhookEvent(input: {
    event: LineWebhookEventRecord;
    authIdentityId: string | null;
    userProfileId: string | null;
  }) {
    const bindingState: BindingState = input.userProfileId ? "bound" : "unbound";
    const lineUserKey = input.event.lineUserId || input.event.id;
    const externalIdentityKey = makeExternalKey({ channel: "line", identityKey: lineUserKey });
    const conversation = await this.ensureConversation({
      userProfileId: input.userProfileId,
      authIdentityId: input.authIdentityId,
      channel: "line",
      source: "line_webhook",
      bindingState,
      externalIdentityKey,
      externalIdentityKeyHint: input.event.lineUserId || null,
      subject: input.event.eventType,
    });
    const supportCase = await supportCaseService.ensureCase({
      userProfileId: input.userProfileId,
      authIdentityId: input.authIdentityId,
      conversationId: conversation.conversationId,
      channel: "line",
      source: "line_webhook",
      bindingState,
      title: input.event.eventType === "follow" ? "LINE follow-up" : "LINE interaction",
      summary: input.event.messageText || input.event.postbackData || input.event.eventType,
      latestMessageEventId: input.event.id,
    });
    const messageEvent: MessageEvent = {
      messageEventId: input.event.id || createFoundationId("mevt"),
      conversationId: conversation.conversationId,
      supportCaseId: supportCase.supportCaseId,
      userProfileId: input.userProfileId,
      authIdentityId: input.authIdentityId,
      channel: "line",
      source: "line_webhook",
      direction: "inbound",
      bindingState,
      eventType: input.event.eventType as MessageEvent["eventType"],
      messageType: input.event.messageType,
      externalIdentityKey,
      externalEventId: input.event.webhookEventId,
      externalMessageId: null,
      replyTokenPresent: input.event.replyTokenPresent,
      replyStatus: input.event.replyStatus,
      replyErrorCode: input.event.replyError,
      deliveryMode: input.event.deliveryMode,
      isRedelivery: input.event.isRedelivery,
      sourceType: input.event.sourceType,
      contentText: input.event.messageText,
      contentPayloadRef: input.event.postbackData,
      occurredAt: input.event.eventTimestamp,
      recordedAt: input.event.receivedAt,
      aiAssist: getAiAssistHooksForChannel("line"),
      createdAt: input.event.receivedAt,
      updatedAt: input.event.receivedAt,
    };

    const created = await this.putMessageEvent(messageEvent);
    await putFoundationRecord("conversations", conversation.conversationId, {
      ...conversation,
      supportCaseId: supportCase.supportCaseId,
      latestMessageEventId: created.messageEventId,
      latestActivityAt: created.recordedAt,
      updatedAt: created.updatedAt,
    });
    await putFoundationRecord("support-cases", supportCase.supportCaseId, {
      ...supportCase,
      latestMessageEventId: created.messageEventId,
      latestActivityAt: created.recordedAt,
      updatedAt: created.updatedAt,
    });
    return created;
  }

  async listTimelineByUserProfileId(userProfileId: string) {
    const events = await listMessageEvents();
    return events.filter((entry) => entry.userProfileId === userProfileId);
  }

  async listTimelineByAuthIdentityId(authIdentityId: string) {
    const events = await listMessageEvents();
    return events.filter((entry) => entry.authIdentityId === authIdentityId);
  }

  async listTimelineByExternalIdentityKey(externalIdentityKey: string) {
    const events = await listMessageEvents();
    return events.filter((entry) => entry.externalIdentityKey === externalIdentityKey);
  }

  async getLatestActivitySummary(input: { userProfileId?: string; authIdentityId?: string }) {
    const events = input.userProfileId
      ? await this.listTimelineByUserProfileId(input.userProfileId)
      : input.authIdentityId
        ? await this.listTimelineByAuthIdentityId(input.authIdentityId)
        : [];
    const latest = events[0] || null;

    if (!latest) {
      return null;
    }

    return {
      latestMessageEventId: latest.messageEventId,
      latestActivityAt: latest.recordedAt,
      latestChannel: latest.channel,
      latestEventType: latest.eventType,
      latestBindingState: latest.bindingState,
    };
  }
}

export const timelineService = new TimelineService();
