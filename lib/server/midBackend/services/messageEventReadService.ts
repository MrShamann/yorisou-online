import { messageEventRepository } from "@/lib/server/midBackend/repositories/messageEventRepository";

export type MessageEventSnapshot = {
  messageEventId: string;
  userProfileId: string | null;
  authIdentityId: string | null;
  channel: "web" | "email" | "line" | "support_internal";
  direction: "inbound" | "outbound" | "system";
  eventType: "message" | "follow" | "unfollow" | "postback" | "delivery" | "note";
  messageType: string | null;
  sourceType: string | null;
  contentText: string | null;
  providerEventId: string | null;
  providerReplyTokenPresent: boolean;
  providerRedelivery: boolean;
  replyStatus: "not_attempted" | "sent" | "failed" | "not_applicable";
  replyErrorCode: string | null;
  occurredAt: string | null;
  recordedAt: string;
  bindingState: "bound" | "unbound";
};

function toMessageEventSnapshot(
  event: Awaited<ReturnType<typeof messageEventRepository.getById>>,
): MessageEventSnapshot | null {
  if (!event) {
    return null;
  }

  return {
    messageEventId: event.messageEventId,
    userProfileId: event.userProfileId,
    authIdentityId: event.authIdentityId,
    channel: event.channel,
    direction: event.direction,
    eventType: event.eventType,
    messageType: event.messageType,
    sourceType: event.sourceType,
    contentText: event.contentText,
    providerEventId: event.providerEventId,
    providerReplyTokenPresent: event.providerReplyTokenPresent,
    providerRedelivery: event.providerRedelivery,
    replyStatus: event.replyStatus,
    replyErrorCode: event.replyErrorCode,
    occurredAt: event.occurredAt,
    recordedAt: event.recordedAt,
    bindingState: event.userProfileId ? "bound" : "unbound",
  };
}

export class MessageEventReadService {
  async getMessageEventById(messageEventId: string) {
    return toMessageEventSnapshot(await messageEventRepository.getById(messageEventId));
  }

  async getMessageEventByProviderEventId(providerEventId: string) {
    return toMessageEventSnapshot(await messageEventRepository.getByProviderEventId(providerEventId));
  }

  async listMessageEventsByUserProfileId(userProfileId: string) {
    const events = await messageEventRepository.listByUserProfileId(userProfileId);
    return events.map((event) => toMessageEventSnapshot(event)).filter((entry): entry is MessageEventSnapshot => Boolean(entry));
  }

  async listMessageEventsByAuthIdentityId(authIdentityId: string) {
    const events = await messageEventRepository.listByAuthIdentityId(authIdentityId);
    return events.map((event) => toMessageEventSnapshot(event)).filter((entry): entry is MessageEventSnapshot => Boolean(entry));
  }

  async getLineMessageEventSnapshot(input: { messageEventId?: string; providerEventId?: string }) {
    if (input.messageEventId) {
      return this.getMessageEventById(input.messageEventId);
    }

    if (input.providerEventId) {
      return this.getMessageEventByProviderEventId(input.providerEventId);
    }

    return null;
  }
}

export const messageEventReadService = new MessageEventReadService();
