import { findAccountById, listAccounts, listLineWebhookEvents, listConsultations } from "@/lib/server/yorisouData";
import { identityFoundationService } from "@/lib/server/foundation/identityService";
import { privacyAuditService } from "@/lib/server/foundation/privacyService";
import { listAuthIdentities, listSupportCases, listUserProfiles, getFoundationStoreStatus } from "@/lib/server/foundation/store";
import { timelineService } from "@/lib/server/foundation/timelineService";
import type { AuditLog, AuthIdentity, ConsentLog, SupportCase, UserProfile } from "@/lib/server/foundation/schema";

export class AdminFoundationService {
  async ensureLegacyBackfillForAccounts() {
    const accounts = await listAccounts();
    await Promise.all(accounts.map((account) => identityFoundationService.ensureCanonicalUserForAccount(account, account.lineUserId ? "line_login" : "email_password")));
    return accounts;
  }

  async getUserList(query?: string) {
    await this.ensureLegacyBackfillForAccounts();
    const profiles = (await listUserProfiles()).filter((entry): entry is UserProfile => Boolean(entry));
    const normalizedQuery = query?.trim().toLowerCase() || "";

    if (!normalizedQuery) {
      return profiles;
    }

    const identities = (await listAuthIdentities()).filter((entry): entry is AuthIdentity => Boolean(entry));
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
    const [profile, identities, timeline, supportCases, recentConsent, latestSummary] = await Promise.all([
      identityFoundationService.getUserProfileById(userProfileId),
      identityFoundationService.getAuthIdentitiesByUserProfileId(userProfileId),
      timelineService.listTimelineByUserProfileId(userProfileId),
      (await listSupportCases()).filter((entry): entry is SupportCase => Boolean(entry)).filter((entry) => entry.userProfileId === userProfileId),
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
      timeline,
      supportCases,
      recentConsent: recentConsent.filter((entry): entry is ConsentLog => Boolean(entry)).filter((entry) => entry.userProfileId === userProfileId),
      latestSummary,
      legacyAccount: account,
      recentLegacyConsultations,
      recentLegacyLineEvents,
    };
  }

  async getDashboardSummary() {
    await this.ensureLegacyBackfillForAccounts();
    const [profiles, supportCases, auditEntries, identities] = await Promise.all([
      listUserProfiles(),
      listSupportCases(),
      privacyAuditService.listRecentAuditEntries(20),
      listAuthIdentities(),
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
