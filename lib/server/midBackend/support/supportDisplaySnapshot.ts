import type { AccountRecord, AccountRole, LineWebhookEventRecord, SupportProfile } from "@/lib/server/yorisouData";
import { defaultSupportProfile } from "@/lib/server/yorisouData";
import { mapMessageEventSnapshotToLegacyLineWebhookEvent } from "@/lib/server/midBackend/compat/lineEventCompat";
import { identityReadService, type UserIdentitySnapshot } from "@/lib/server/midBackend/services/identityReadService";
import { messageEventReadService } from "@/lib/server/midBackend/services/messageEventReadService";

export type SupportDisplaySnapshot = {
  userIdentitySnapshot: Awaited<ReturnType<typeof identityReadService.getUserIdentitySnapshot>> | null;
  latestLineMessageEventSnapshot: Awaited<
    ReturnType<typeof messageEventReadService.getLineMessageEventSnapshot>
  > | null;
  supportProfile: SupportProfile | null;
  readModelSource: "canonical_first" | "fallback_account";
  supportProfileSource: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  lineBindingStatusSource: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  preferencesStorageSource: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  readFallbackActive: boolean;
  account: AccountRecord | null;
  latestLineEvent: LineWebhookEventRecord | null;
};

function isAccountRole(value: string): value is AccountRole {
  return value === "self" || value === "family" || value === "facility";
}

function buildCanonicalFirstSupportAccount(
  snapshot: UserIdentitySnapshot | null,
  fallback: AccountRecord | null,
): {
  account: AccountRecord | null;
  supportProfile: SupportProfile | null;
  readModelSource: "canonical_first" | "fallback_account";
  supportProfileSource: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  lineBindingStatusSource: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  preferencesStorageSource: "canonical" | "compatibility_mirror" | "legacy_fallback" | "unresolved";
  readFallbackActive: boolean;
} {
  if (!snapshot?.userProfile) {
    return {
      account: fallback,
      supportProfile: fallback?.supportProfile || null,
      readModelSource: "fallback_account",
      supportProfileSource: fallback ? "legacy_fallback" : "unresolved",
      lineBindingStatusSource: fallback ? "legacy_fallback" : "unresolved",
      preferencesStorageSource: fallback ? "legacy_fallback" : "unresolved",
      readFallbackActive: true,
    };
  }

  const emailIdentity = snapshot.authIdentities.find((entry) => entry.identityType === "email_password") || null;
  const lineIdentity = snapshot.authIdentities.find((entry) => entry.identityType === "line") || null;
  const fallbackSupportProfile = fallback?.supportProfile || defaultSupportProfile();
  const lineBindingStatusSource = lineIdentity?.userProfileId
    ? "canonical"
    : fallback
      ? "compatibility_mirror"
      : "unresolved";
  const supportProfile: SupportProfile = {
    ...fallbackSupportProfile,
    lineBindingStatus: lineIdentity?.userProfileId
      ? "connected"
      : fallbackSupportProfile.lineBindingStatus === "registered"
        ? "registered"
        : "not_connected",
    lineDisplayName: snapshot.userProfile.lineDisplayName || fallbackSupportProfile.lineDisplayName,
    lineNotificationsEnabled: snapshot.userProfile.lineNotificationsEnabled,
    familyContactName: snapshot.userProfile.familyContactName,
    familyContactRelation: snapshot.userProfile.familyContactRelation,
    familyContactMethod: snapshot.userProfile.familyContactMethod,
    familyContactValue: snapshot.userProfile.familyContactValue,
    familyShareNote: snapshot.userProfile.familyShareNote,
  };

  const safeRole = isAccountRole(snapshot.userProfile.role) ? snapshot.userProfile.role : fallback?.role || "family";
  const compatibilityAccount: AccountRecord = {
    ...(fallback || {
      id: snapshot.userProfile.userProfileId,
      name: snapshot.userProfile.displayName,
      email: "",
      passwordHash: "",
      city: snapshot.userProfile.city,
      role: safeRole,
      createdAt: snapshot.userProfile.createdAt,
      updatedAt: snapshot.userProfile.updatedAt,
      supportProfile,
    }),
    id: snapshot.userProfile.userProfileId,
    name: snapshot.userProfile.displayName,
    email: emailIdentity?.emailNormalized || fallback?.email || "",
    city: snapshot.userProfile.city,
    role: safeRole,
    updatedAt: snapshot.userProfile.updatedAt,
    lineUserId: lineIdentity?.lineUserId || fallback?.lineUserId,
    supportProfile,
  };

  return {
    account: compatibilityAccount,
    supportProfile,
    readModelSource: "canonical_first",
    supportProfileSource: "canonical",
    lineBindingStatusSource,
    preferencesStorageSource: "canonical",
    readFallbackActive: lineBindingStatusSource !== "canonical",
  };
}

// Transitional support/display-only read assembly for canonical snapshots.
// This must not be used for auth, token, binding, or write-path logic.
export async function getSupportDisplaySnapshot(input: {
  userProfileId: string | null;
  fallbackAccount: AccountRecord | null;
}): Promise<SupportDisplaySnapshot> {
  if (!input.userProfileId || !input.fallbackAccount) {
    return {
      userIdentitySnapshot: null,
      latestLineMessageEventSnapshot: null,
      supportProfile: input.fallbackAccount?.supportProfile || null,
      readModelSource: "fallback_account",
      supportProfileSource: input.fallbackAccount ? "legacy_fallback" : "unresolved",
      lineBindingStatusSource: input.fallbackAccount ? "legacy_fallback" : "unresolved",
      preferencesStorageSource: input.fallbackAccount ? "legacy_fallback" : "unresolved",
      readFallbackActive: true,
      account: input.fallbackAccount,
      latestLineEvent: null,
    };
  }

  const [userIdentitySnapshot, latestLineMessageEventSnapshot] = await Promise.all([
    identityReadService.getUserIdentitySnapshot(input.userProfileId),
    messageEventReadService
      .listMessageEventsByUserProfileId(input.userProfileId)
      .then((entries) => entries[0] || null),
  ]);

  const supportDisplay = buildCanonicalFirstSupportAccount(userIdentitySnapshot, input.fallbackAccount);

  return {
    userIdentitySnapshot,
    latestLineMessageEventSnapshot,
    supportProfile: supportDisplay.supportProfile,
    readModelSource: supportDisplay.readModelSource,
    supportProfileSource: supportDisplay.supportProfileSource,
    lineBindingStatusSource: supportDisplay.lineBindingStatusSource,
    preferencesStorageSource: supportDisplay.preferencesStorageSource,
    readFallbackActive: supportDisplay.readFallbackActive,
    account: supportDisplay.account,
    latestLineEvent: mapMessageEventSnapshotToLegacyLineWebhookEvent(latestLineMessageEventSnapshot),
  };
}
