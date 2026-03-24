import type { AccountRecord, AccountRole, SupportProfile } from "@/lib/server/yorisouData";
import { isPlaceholderEmail } from "@/lib/server/foundation/ids";
import type { UserIdentitySnapshot } from "@/lib/server/midBackend/services/identityReadService";

// Transitional display-only mapping from canonical user/profile reads back into
// the legacy AccountRecord shape still consumed by support workspace helpers.
// This must not be used for auth decisions, token logic, binding writes, or
// any storage-boundary write path.
export function mapUserIdentitySnapshotToLegacySupportAccount(
  snapshot: UserIdentitySnapshot | null,
  fallback: AccountRecord | null,
): AccountRecord | null {
  if (!fallback) {
    return null;
  }

  if (!snapshot?.userProfile) {
    return fallback;
  }

  const emailIdentity = snapshot.authIdentities.find((entry) => entry.identityType === "email_password") || null;
  const lineIdentity = snapshot.authIdentities.find((entry) => entry.identityType === "line") || null;
  const safeRole = isAccountRole(snapshot.userProfile.role) ? snapshot.userProfile.role : fallback.role;

  const supportProfile: SupportProfile = {
    ...fallback.supportProfile,
    lineDisplayName: snapshot.userProfile.lineDisplayName,
    lineNotificationsEnabled: snapshot.userProfile.lineNotificationsEnabled,
    familyContactName: snapshot.userProfile.familyContactName,
    familyContactRelation: snapshot.userProfile.familyContactRelation,
    familyContactMethod: snapshot.userProfile.familyContactMethod,
    familyContactValue: snapshot.userProfile.familyContactValue,
    familyShareNote: snapshot.userProfile.familyShareNote,
  };

  return {
    ...fallback,
    id: snapshot.userProfile.userProfileId,
    name: snapshot.userProfile.displayName,
    email: emailIdentity?.emailNormalized || (isPlaceholderEmail(fallback.email) ? "" : fallback.email),
    city: snapshot.userProfile.city,
    role: safeRole,
    updatedAt: snapshot.userProfile.updatedAt,
    lineUserId: lineIdentity?.lineUserId || fallback.lineUserId,
    supportProfile,
  };
}

function isAccountRole(value: string): value is AccountRole {
  return value === "self" || value === "family" || value === "facility";
}
