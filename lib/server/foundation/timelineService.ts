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

function buildSupportWorkspaceTitle(input: {
  locale: "ja" | "en";
  scenario: string;
  issueType: string;
  currentTopic?: string | null;
}) {
  if (input.currentTopic?.trim()) {
    return input.currentTopic.trim();
  }

  const labels = {
    mobility_anxiety: input.locale === "en" ? "Mobility anxiety support" : "移動不安の相談",
    family_mobility_support: input.locale === "en" ? "Family mobility support" : "家族の移動支援相談",
    product_guidance: input.locale === "en" ? "Mobility solution guidance" : "支援手段の比較相談",
    consultation_booking: input.locale === "en" ? "Consultation follow-up" : "継続相談の整理",
    institutional_inquiry: input.locale === "en" ? "Institutional support inquiry" : "地域・施設からの相談",
  } as const;

  return labels[input.issueType as keyof typeof labels] || input.scenario || (input.locale === "en" ? "Support workspace" : "サポート相談");
}

function buildSupportWorkspaceSummary(input: {
  userMessage: string;
  assistantMessage?: string;
}) {
  const user = input.userMessage.trim().replace(/\s+/g, " ").slice(0, 240);
  const assistant = input.assistantMessage?.trim().replace(/\s+/g, " ").slice(0, 240) || "";

  if (assistant) {
    return `${user}\n---\n${assistant}`;
  }

  return user;
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

  async ensureSupportWorkspaceContext(input: {
    sessionId: string;
    locale: "ja" | "en";
    userProfileId: string | null;
    authIdentityId: string | null;
    currentTopic?: string | null;
    scenario: string;
    issueType: string;
    latestUserMessage: string;
    latestAssistantMessage?: string;
  }) {
    const channel: Channel = "support_web";
    const source: Source = "support_workspace";
    const bindingState: BindingState = input.userProfileId ? "bound" : "unbound";
    const externalIdentityKey = input.userProfileId
      ? makeExternalKey({ channel, identityKey: `user:${input.userProfileId}` })
      : makeExternalKey({ channel, identityKey: `session:${input.sessionId}` });
    const title = buildSupportWorkspaceTitle({
      locale: input.locale,
      scenario: input.scenario,
      issueType: input.issueType,
      currentTopic: input.currentTopic,
    });
    const summary = buildSupportWorkspaceSummary({
      userMessage: input.latestUserMessage,
      assistantMessage: input.latestAssistantMessage,
    });

    const conversation = await this.ensureConversation({
      userProfileId: input.userProfileId,
      authIdentityId: input.authIdentityId,
      channel,
      source,
      bindingState,
      externalIdentityKey,
      externalIdentityKeyHint: input.userProfileId || input.sessionId,
      subject: title,
    });
    const supportCase = await supportCaseService.ensureCase({
      userProfileId: input.userProfileId,
      authIdentityId: input.authIdentityId,
      conversationId: conversation.conversationId,
      channel,
      source,
      bindingState,
      title,
      summary,
    });

    if (conversation.supportCaseId !== supportCase.supportCaseId) {
      await putFoundationRecord("conversations", conversation.conversationId, {
        ...conversation,
        supportCaseId: supportCase.supportCaseId,
        latestActivityAt: nowIso(),
        updatedAt: nowIso(),
      });
    }

    return {
      conversationId: conversation.conversationId,
      supportCaseId: supportCase.supportCaseId,
      userProfileId: input.userProfileId,
      authIdentityId: input.authIdentityId,
      channel,
      source,
      bindingState,
      externalIdentityKey,
      externalIdentityKeyHint: input.userProfileId || input.sessionId,
      title,
    };
  }

  async recordSupportWorkspaceMessage(input: {
    context: Awaited<ReturnType<TimelineService["ensureSupportWorkspaceContext"]>>;
    direction: "inbound" | "outbound";
    contentText: string;
    occurredAt?: string;
    recordedAt?: string;
    replyStatus?: MessageEvent["replyStatus"];
  }) {
    const timestamp = input.recordedAt || nowIso();
    const messageEvent: MessageEvent = {
      messageEventId: createFoundationId("mevt"),
      conversationId: input.context.conversationId,
      supportCaseId: input.context.supportCaseId,
      userProfileId: input.context.userProfileId,
      authIdentityId: input.context.authIdentityId,
      channel: input.context.channel,
      source: input.context.source,
      direction: input.direction,
      bindingState: input.context.bindingState,
      eventType: "message",
      messageType: "text",
      externalIdentityKey: input.context.externalIdentityKey,
      externalEventId: null,
      externalMessageId: null,
      replyTokenPresent: false,
      replyStatus: input.replyStatus || (input.direction === "outbound" ? "sent" : "not_applicable"),
      replyErrorCode: null,
      deliveryMode: "web",
      isRedelivery: false,
      sourceType: "support_chat",
      contentText: input.contentText,
      contentPayloadRef: null,
      occurredAt: input.occurredAt || timestamp,
      recordedAt: timestamp,
      aiAssist: getAiAssistHooksForChannel("support_web"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const created = await this.putMessageEvent(messageEvent);
    const supportCase = await supportCaseService.getById(input.context.supportCaseId);

    if (supportCase) {
      await putFoundationRecord("support-cases", supportCase.supportCaseId, {
        ...supportCase,
        latestMessageEventId: created.messageEventId,
        latestActivityAt: created.recordedAt,
        updatedAt: created.updatedAt,
      });
    }

    return created;
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
