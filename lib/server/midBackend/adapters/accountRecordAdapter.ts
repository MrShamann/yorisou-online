import type { AccountRecord } from "@/lib/server/yorisouData";
import { isPlaceholderEmail } from "@/lib/server/foundation/ids";
import type { AuthIdentity, UserProfile } from "@/lib/server/midBackend/types";
import { createAuthIdentityId, createIdentityKeyHash, getEmailIdentityHint, getLineIdentityHint } from "@/lib/server/midBackend/utils";

export function mapAccountRecordToUserProfile(account: AccountRecord): UserProfile {
  return {
    userProfileId: account.id,
    displayName: account.name,
    primaryLocale: null,
    city: account.city,
    role: account.role,
    profileStatus: "active",
    lineDisplayName: account.supportProfile.lineDisplayName || "",
    lineNotificationsEnabled: account.supportProfile.lineNotificationsEnabled,
    familyContactName: account.supportProfile.familyContactName || "",
    familyContactRelation: account.supportProfile.familyContactRelation || "",
    familyContactMethod: account.supportProfile.familyContactMethod || "",
    familyContactValue: account.supportProfile.familyContactValue || "",
    familyShareNote: account.supportProfile.familyShareNote || "",
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

export function deriveEmailAuthIdentity(account: AccountRecord): AuthIdentity | null {
  if (!account.email) {
    return null;
  }

  const emailNormalized = account.email.trim().toLowerCase();

  if (isPlaceholderEmail(emailNormalized)) {
    return null;
  }

  return {
    authIdentityId: createAuthIdentityId("email_password", emailNormalized),
    identityType: "email_password",
    identityKeyHash: createIdentityKeyHash(`email_password:${emailNormalized}`),
    identityKeyHint: getEmailIdentityHint(emailNormalized),
    userProfileId: account.id,
    identityStatus: "active",
    emailNormalized,
    passwordHashPresent: Boolean(account.passwordHash),
    lineUserId: null,
    lineIdTokenSubject: null,
    linePictureUrl: null,
    lineConnectedAt: null,
    firstSeenAt: account.createdAt,
    lastSeenAt: account.updatedAt,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
}

export function deriveLineAuthIdentity(account: AccountRecord): AuthIdentity | null {
  const lineUserId = account.lineUserId?.trim();

  if (!lineUserId) {
    return null;
  }

  return {
    authIdentityId: createAuthIdentityId("line", lineUserId),
    identityType: "line",
    identityKeyHash: createIdentityKeyHash(`line:${lineUserId}`),
    identityKeyHint: getLineIdentityHint(lineUserId),
    userProfileId: account.id,
    identityStatus: "active",
    emailNormalized: null,
    passwordHashPresent: false,
    lineUserId,
    lineIdTokenSubject: account.lineIdTokenSubject || lineUserId,
    linePictureUrl: account.linePictureUrl || null,
    lineConnectedAt: account.lineConnectedAt || null,
    firstSeenAt: account.lineConnectedAt || account.createdAt,
    lastSeenAt: account.updatedAt,
    createdAt: account.lineConnectedAt || account.createdAt,
    updatedAt: account.updatedAt,
  };
}

export function deriveAuthIdentitiesFromAccount(account: AccountRecord): AuthIdentity[] {
  return [deriveEmailAuthIdentity(account), deriveLineAuthIdentity(account)].filter((entry): entry is AuthIdentity => Boolean(entry));
}
