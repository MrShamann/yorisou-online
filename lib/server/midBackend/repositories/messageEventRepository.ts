import { findLineWebhookEventById, listLineWebhookEvents } from "@/lib/server/yorisouData";
import { mapLineWebhookEventToMessageEvent } from "@/lib/server/midBackend/adapters/lineWebhookEventAdapter";
import type { MessageEventRepository } from "@/lib/server/midBackend/contracts";
import { createAuthIdentityId } from "@/lib/server/midBackend/utils";

export class LegacyBackedMessageEventRepository implements MessageEventRepository {
  async getById(messageEventId: string) {
    const record = await findLineWebhookEventById(messageEventId);
    return record ? mapLineWebhookEventToMessageEvent(record) : null;
  }

  async getByProviderEventId(providerEventId: string) {
    const records = await listLineWebhookEvents();
    const record = records.find((entry) => entry.webhookEventId === providerEventId) || null;
    return record ? mapLineWebhookEventToMessageEvent(record) : null;
  }

  async listByUserProfileId(userProfileId: string) {
    const records = await listLineWebhookEvents();
    return records
      .filter((entry) => entry.accountId === userProfileId)
      .map(mapLineWebhookEventToMessageEvent);
  }

  async listByAuthIdentityId(authIdentityId: string) {
    const records = await listLineWebhookEvents();

    return records
      .filter((entry) => entry.lineUserId && createAuthIdentityId("line", entry.lineUserId) === authIdentityId)
      .map(mapLineWebhookEventToMessageEvent);
  }
}

export const messageEventRepository = new LegacyBackedMessageEventRepository();
