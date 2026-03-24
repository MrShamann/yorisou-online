import type { LineWebhookEventRecord } from "@/lib/server/yorisouData";
import type { MessageEvent } from "@/lib/server/midBackend/types";
import { createAuthIdentityId } from "@/lib/server/midBackend/utils";

export function mapLineWebhookEventToMessageEvent(record: LineWebhookEventRecord): MessageEvent {
  const authIdentityId = record.lineUserId ? createAuthIdentityId("line", record.lineUserId) : null;

  return {
    messageEventId: record.id,
    conversationId: null,
    userProfileId: record.accountId,
    authIdentityId,
    channel: "line",
    direction: "inbound",
    eventType: record.eventType as MessageEvent["eventType"],
    messageType: record.messageType,
    providerEventId: record.webhookEventId,
    providerMessageId: null,
    providerReplyTokenPresent: record.replyTokenPresent,
    providerDeliveryMode: record.deliveryMode,
    providerRedelivery: record.isRedelivery,
    sourceType: record.sourceType,
    contentText: record.messageText,
    contentPayloadRef: record.postbackData,
    replyStatus: record.replyStatus,
    replyErrorCode: record.replyError,
    occurredAt: record.eventTimestamp,
    recordedAt: record.receivedAt,
    createdAt: record.receivedAt,
    updatedAt: record.receivedAt,
  };
}
