import { createFoundationId, nowIso } from "@/lib/server/foundation/ids";
import { createEmptyAiAssistHooks, getAiAssistHooksForChannel } from "@/lib/server/foundation/aiAssistHooks";
import { foundationSupportCaseRepository } from "@/lib/server/foundation/repositories";
import type { BindingState, Channel, Source, SupportCase, SupportCaseStatus } from "@/lib/server/foundation/schema";
import { privacyAuditService } from "@/lib/server/foundation/privacyService";

export class SupportCaseService {
  async getById(supportCaseId: string) {
    return foundationSupportCaseRepository.getById(supportCaseId);
  }

  async getLatestByUserProfileId(userProfileId: string) {
    const cases = await foundationSupportCaseRepository.listByUserProfileId(userProfileId);
    return cases.find((entry) => entry.userProfileId === userProfileId) || null;
  }

  async listByUserProfileId(userProfileId: string) {
    return foundationSupportCaseRepository.listByUserProfileId(userProfileId);
  }

  async listByAuthIdentityId(authIdentityId: string) {
    return foundationSupportCaseRepository.listByAuthIdentityId(authIdentityId);
  }

  async ensureCase(input: {
    userProfileId: string | null;
    authIdentityId: string | null;
    conversationId: string | null;
    channel: Channel;
    source: Source;
    bindingState: BindingState;
    title: string;
    summary?: string | null;
    latestMessageEventId?: string | null;
  }) {
    let existing: SupportCase | null = null;

    if (input.conversationId) {
      try {
        existing = await foundationSupportCaseRepository.getByConversationId(input.conversationId);
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown_support_case_lookup_error";
        throw new Error(`support_case_lookup_failed:${message}`);
      }
    }
    const timestamp = nowIso();

    if (existing) {
      const updated: SupportCase = {
        ...existing,
        userProfileId: input.userProfileId ?? existing.userProfileId,
        authIdentityId: input.authIdentityId ?? existing.authIdentityId,
        conversationId: input.conversationId ?? existing.conversationId,
        latestMessageEventId: input.latestMessageEventId ?? existing.latestMessageEventId,
        summary: input.summary ?? existing.summary,
        latestActivityAt: timestamp,
        bindingState: input.bindingState,
        updatedAt: timestamp,
      };
      try {
        await foundationSupportCaseRepository.save(updated);
      } catch (error) {
        const message = error instanceof Error ? error.message : "unknown_support_case_update_error";
        throw new Error(`support_case_update_failed:${message}`);
      }
      return updated;
    }

    const supportCase: SupportCase = {
      supportCaseId: createFoundationId("scase"),
      userProfileId: input.userProfileId,
      authIdentityId: input.authIdentityId,
      conversationId: input.conversationId,
      latestMessageEventId: input.latestMessageEventId || null,
      status: "new",
      bindingState: input.bindingState,
      source: input.source,
      channel: input.channel,
      title: input.title,
      summary: input.summary || null,
      latestActivityAt: timestamp,
      aiAssist: getAiAssistHooksForChannel(input.channel) || createEmptyAiAssistHooks(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    try {
      await foundationSupportCaseRepository.save(supportCase);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown_support_case_create_error";
      throw new Error(`support_case_create_failed:${message}`);
    }
    return supportCase;
  }

  async updateStatus(input: {
    supportCaseId: string;
    status: SupportCaseStatus;
    actorUserProfileId: string | null;
    actorAuthIdentityId: string | null;
  }) {
    const supportCase = await this.getById(input.supportCaseId);

    if (!supportCase) {
      return null;
    }

    const updated: SupportCase = {
      ...supportCase,
      status: input.status,
      latestActivityAt: nowIso(),
      updatedAt: nowIso(),
    };
    await foundationSupportCaseRepository.save(updated);
    await privacyAuditService.recordAudit({
      actorType: input.actorUserProfileId ? "admin" : "system",
      actorUserProfileId: input.actorUserProfileId,
      actorAuthIdentityId: input.actorAuthIdentityId,
      action: "support_case.status_update",
      resourceType: "support_case",
      resourceId: updated.supportCaseId,
      channel: updated.channel,
      source: "admin_console",
      bindingState: updated.bindingState,
      summary: `Updated support case status to ${input.status}`,
      metadata: {
        supportCaseId: updated.supportCaseId,
        status: input.status,
      },
    });
    return updated;
  }
}

export const supportCaseService = new SupportCaseService();
