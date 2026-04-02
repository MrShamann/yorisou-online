import { findAccountById, listAccounts, listConsultations, listLineWebhookEvents, listRecentLineWebhookSubjects } from "@/lib/server/yorisouData";
import { identityFoundationService } from "@/lib/server/foundation/identityService";
import { privacyAuditService } from "@/lib/server/foundation/privacyService";
import {
  foundationAuthIdentityRepository,
  foundationSupportCaseRepository,
  foundationUserProfileRepository,
} from "@/lib/server/foundation/repositories";
import { getFoundationStoreStatus } from "@/lib/server/foundation/store";
import { timelineService } from "@/lib/server/foundation/timelineService";
import type { AuditLog, AuthIdentity, ConsentLog, SupportCase, UserProfile } from "@/lib/server/foundation/schema";

export class AdminFoundationService {
  async listRecentLineWebhookSubjects(limit = 10) {
    const events = await listRecentLineWebhookSubjects(limit);

    return Promise.all(
      events.map(async (event) => {
        const baseEvent = {
          eventId: event.eventId,
          webhookEventId: event.webhookEventId,
          lineUserId: event.lineUserId,
          accountId: event.accountId,
          eventType: event.eventType,
          messageType: event.messageType,
          messageText: event.messageText,
          postbackData: event.postbackData,
          receivedAt: event.receivedAt,
          eventTimestamp: event.eventTimestamp,
        };

        try {
          const lineUserId = event.lineUserId;
          const [lineSnapshot, timelineBundle] = await Promise.all([
            identityFoundationService.getUserByLineProviderSubject(lineUserId),
            timelineService.getUnifiedTimelineByLineSubject(lineUserId),
          ]);

          return {
            ...baseEvent,
            canonical: {
              source: timelineBundle.source,
              authIdentityId: lineSnapshot.identity?.authIdentityId || null,
              userProfileId: lineSnapshot.userProfile?.userProfileId || null,
              bindingState: lineSnapshot.bindingState,
              conversationCount: timelineBundle.conversations.length,
              eventCount: timelineBundle.events.length,
              supportCaseCount: timelineBundle.supportCases.length,
              latestConversationId: timelineBundle.conversations[0]?.conversationId || null,
              latestSupportCaseId: timelineBundle.supportCases[0]?.supportCaseId || null,
            },
            canonicalError: null,
          };
        } catch (error) {
          return {
            ...baseEvent,
            canonical: null,
            canonicalError: error instanceof Error ? error.message : "recent_line_webhook_subject_resolution_failed",
          };
        }
      }),
    );
  }

  async ensureLegacyBackfillForAccounts() {
    const accounts = await listAccounts();
    await Promise.all(accounts.map((account) => identityFoundationService.ensureCanonicalUserForAccount(account, account.lineUserId ? "line_login" : "email_password")));
    return accounts;
  }

  async getUserList(query?: string) {
    await this.ensureLegacyBackfillForAccounts();
    const profiles = (await foundationUserProfileRepository.list()).filter((entry): entry is UserProfile => Boolean(entry));
    const normalizedQuery = query?.trim().toLowerCase() || "";

    if (!normalizedQuery) {
      return profiles;
    }

    const identities = (await foundationAuthIdentityRepository.list()).filter((entry): entry is AuthIdentity => Boolean(entry));
    return profiles.filter((profile) => {
      const profileMatch =
        profile.profile.displayName.toLowerCase().includes(normalizedQuery) ||
        profile.profile.city.toLowerCase().includes(normalizedQuery) ||
        profile.userProfileId.toLowerCase().includes(normalizedQuery);

      if (profileMatch) {
        return true;
      }

      return identities.some(
        (identity) =>
          identity.userProfileId === profile.userProfileId &&
          (identity.emailNormalized?.includes(normalizedQuery) ||
            identity.lineUserId?.toLowerCase().includes(normalizedQuery) ||
            identity.identityKeyHint?.toLowerCase().includes(normalizedQuery)),
      );
    });
  }

  async getUserDetail(userProfileId: string, actor: { actorUserProfileId: string | null; actorAuthIdentityId: string | null }) {
    await this.ensureLegacyBackfillForAccounts();
    const [profile, identities, timelineBundle, recentConsent, latestSummary] = await Promise.all([
      identityFoundationService.getUserProfileById(userProfileId),
      identityFoundationService.getAuthIdentitiesByUserProfileId(userProfileId),
      timelineService.getUnifiedTimelineByUserProfileId(userProfileId),
      privacyAuditService.listRecentConsentEntries(10),
      timelineService.getLatestActivitySummary({ userProfileId }),
    ]);

    const account = await findAccountById(userProfileId);
    const recentLegacyConsultations = (await listConsultations()).filter((entry) => entry.userId === userProfileId).slice(0, 5);
    const recentLegacyLineEvents = (await listLineWebhookEvents()).filter((entry) => entry.accountId === userProfileId).slice(0, 5);

    await privacyAuditService.recordAudit({
      actorType: "admin",
      actorUserProfileId: actor.actorUserProfileId,
      actorAuthIdentityId: actor.actorAuthIdentityId,
      action: "admin.view_sensitive",
      resourceType: "user_profile",
      resourceId: userProfileId,
      channel: "admin",
      source: "admin_console",
      bindingState: "bound",
      containsSensitiveAccess: true,
      summary: "Admin viewed user detail with sensitive profile fields",
      metadata: {
        userProfileId,
      },
    });

    return {
      profile,
      identities,
      timeline: timelineBundle.events,
      timelineBundle,
      supportCases: timelineBundle.supportCases,
      recentConsent: recentConsent.filter((entry): entry is ConsentLog => Boolean(entry)).filter((entry) => entry.userProfileId === userProfileId),
      latestSummary,
      legacyAccount: account,
      recentLegacyConsultations,
      recentLegacyLineEvents,
    };
  }

  async getTimelineSubjectDetail(input: {
    userProfileId?: string | null;
    authIdentityId?: string | null;
    sessionId?: string | null;
    lineUserId?: string | null;
  }) {
    if (input.sessionId) {
      const timelineBundle = await timelineService.getUnifiedSupportWorkspaceTimelineBySessionId(input.sessionId);

      return {
        subjectType: "support_session" as const,
        profile: null,
        identities: [],
        timelineBundle,
      };
    }

    await this.ensureLegacyBackfillForAccounts();

    if (input.userProfileId) {
      const [profile, identities, timelineBundle] = await Promise.all([
        identityFoundationService.getUserProfileById(input.userProfileId),
        identityFoundationService.getAuthIdentitiesByUserProfileId(input.userProfileId),
        timelineService.getUnifiedTimelineByUserProfileId(input.userProfileId),
      ]);

      return {
        subjectType: "user_profile" as const,
        profile,
        identities,
        timelineBundle,
      };
    }

    if (input.authIdentityId) {
      const [identity, timelineBundle] = await Promise.all([
        identityFoundationService.getAuthIdentityById(input.authIdentityId),
        timelineService.getUnifiedTimelineByAuthIdentityId(input.authIdentityId),
      ]);
      const profile = identity?.userProfileId ? await identityFoundationService.getUserProfileById(identity.userProfileId) : null;

      return {
        subjectType: "auth_identity" as const,
        profile,
        identities: identity ? [identity] : [],
        timelineBundle,
      };
    }

    if (input.lineUserId) {
      const [lineSnapshot, timelineBundle] = await Promise.all([
        identityFoundationService.getUserByLineProviderSubject(input.lineUserId),
        timelineService.getUnifiedTimelineByLineSubject(input.lineUserId),
      ]);

      return {
        subjectType: "line_subject" as const,
        profile: lineSnapshot.userProfile,
        identities: lineSnapshot.identity ? [lineSnapshot.identity] : [],
        timelineBundle,
      };
    }

    return null;
  }

  async getDashboardSummary() {
    await this.ensureLegacyBackfillForAccounts();
    const [profiles, supportCases, auditEntries, identities] = await Promise.all([
      foundationUserProfileRepository.list(),
      foundationSupportCaseRepository.list(),
      privacyAuditService.listRecentAuditEntries(20),
      foundationAuthIdentityRepository.list(),
    ]);
    const safeProfiles = profiles.filter((entry): entry is UserProfile => Boolean(entry));
    const safeSupportCases = supportCases.filter((entry): entry is SupportCase => Boolean(entry));
    const safeAuditEntries = auditEntries.filter((entry): entry is AuditLog => Boolean(entry));
    const safeIdentities = identities.filter((entry): entry is AuthIdentity => Boolean(entry));

    const unboundIdentities = safeIdentities.filter((entry) => entry.bindingState === "unbound").slice(0, 10);
    const latestSyncStatus = {
      store: getFoundationStoreStatus(),
      latestProfileSyncAt: safeProfiles[0]?.updatedAt || null,
      latestCaseSyncAt: safeSupportCases[0]?.updatedAt || null,
      latestAuditAt: safeAuditEntries[0]?.createdAt || null,
      activeUserCount: safeProfiles.length,
      unboundIdentityCount: unboundIdentities.length,
    };

    return {
      latestUsers: safeProfiles.slice(0, 20),
      recentCases: safeSupportCases.slice(0, 20),
      recentAudit: safeAuditEntries,
      unboundIdentities,
      latestSyncStatus,
    };
  }
}

export const adminFoundationService = new AdminFoundationService();
