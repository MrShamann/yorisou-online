import { foundationMessageEventRepository } from "@/lib/server/foundation/repositories";
import type { MessageEventRepository } from "@/lib/server/midBackend/contracts";
import type { MessageEvent as CanonicalMessageEvent } from "@/lib/server/foundation/schema";
import type { MessageEvent as MidBackendMessageEvent } from "@/lib/server/midBackend/types";

function mapCanonicalMessageEvent(event: CanonicalMessageEvent): MidBackendMessageEvent {
  return {
    messageEventId: event.messageEventId,
    conversationId: event.conversationId,
    userProfileId: event.userProfileId,
    authIdentityId: event.authIdentityId,
    channel: event.channel === "support_web" ? "web" : event.channel === "admin" || event.channel === "system" ? "support_internal" : event.channel,
    direction: event.direction,
    eventType: event.eventType,
    messageType: event.messageType,
    providerEventId: event.externalEventId,
    providerMessageId: event.externalMessageId,
    providerReplyTokenPresent: event.replyTokenPresent,
    providerDeliveryMode: event.deliveryMode,
    providerRedelivery: event.isRedelivery,
    sourceType: event.sourceType,
    contentText: event.contentText,
    contentPayloadRef: event.contentPayloadRef,
    replyStatus: event.replyStatus,
    replyErrorCode: event.replyErrorCode,
    occurredAt: event.occurredAt,
    recordedAt: event.recordedAt,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  } as const;
}

export class CanonicalMessageEventRepository implements MessageEventRepository {
  async getById(messageEventId: string) {
    const event = await foundationMessageEventRepository.getById(messageEventId);
    return event ? mapCanonicalMessageEvent(event) : null;
  }

  async getByProviderEventId(providerEventId: string) {
    const event = await foundationMessageEventRepository.getByExternalEventId(providerEventId);
    return event ? mapCanonicalMessageEvent(event) : null;
  }

  async listByUserProfileId(userProfileId: string) {
    const events = await foundationMessageEventRepository.listByUserProfileId(userProfileId);
    return events.map(mapCanonicalMessageEvent);
  }

  async listByAuthIdentityId(authIdentityId: string) {
    const events = await foundationMessageEventRepository.listByAuthIdentityId(authIdentityId);
    return events.map(mapCanonicalMessageEvent);
  }
}

export const messageEventRepository = new CanonicalMessageEventRepository();
