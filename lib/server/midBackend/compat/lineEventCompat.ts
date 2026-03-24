import type { LineWebhookEventRecord } from "@/lib/server/yorisouData";
import type { MessageEventSnapshot } from "@/lib/server/midBackend/services/messageEventReadService";

// Transitional display-only mapping from canonical LINE message-event reads
// back into the minimal legacy LineWebhookEventRecord shape still expected by
// support workspace helpers. This must not be used for write paths or
// decision-sensitive auth/token logic.
export function mapMessageEventSnapshotToLegacyLineWebhookEvent(
  snapshot: MessageEventSnapshot | null,
): LineWebhookEventRecord | null {
  if (!snapshot) {
    return null;
  }

  return {
    id: snapshot.messageEventId,
    accountId: snapshot.userProfileId,
    lineUserId: null,
    sourceType: snapshot.sourceType,
    eventType: snapshot.eventType,
    messageType: snapshot.messageType,
    messageText: snapshot.contentText,
    postbackData: null,
    replyTokenPresent: snapshot.providerReplyTokenPresent,
    replyStatus: snapshot.replyStatus === "not_applicable" ? "not_attempted" : snapshot.replyStatus,
    replyError: snapshot.replyErrorCode,
    webhookEventId: snapshot.providerEventId,
    deliveryMode: null,
    isRedelivery: snapshot.providerRedelivery,
    eventTimestamp: snapshot.occurredAt,
    receivedAt: snapshot.recordedAt,
  };
}
