import { authIdentityRepository } from "@/lib/server/midBackend/repositories/authIdentityRepository";
import { userProfileRepository } from "@/lib/server/midBackend/repositories/userProfileRepository";

export type AuthIdentitySummary = {
  authIdentityId: string;
  identityType: "email_password" | "line";
  identityStatus: "active" | "unbound" | "revoked" | "merged" | "pending_verification";
  userProfileId: string | null;
  emailNormalized: string | null;
  lineUserId: string | null;
  identityKeyHint: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserProfileSummary = {
  userProfileId: string;
  displayName: string;
  city: string;
  role: string;
  profileStatus: "active" | "merged" | "suspended" | "deleted";
  lineDisplayName: string;
  lineNotificationsEnabled: boolean;
  familyContactName: string;
  familyContactRelation: string;
  familyContactMethod: string;
  familyContactValue: string;
  familyShareNote: string;
  createdAt: string;
  updatedAt: string;
};

export type UserIdentitySnapshot = {
  userProfile: UserProfileSummary | null;
  authIdentities: AuthIdentitySummary[];
};

export type LineBindingStateSnapshot = {
  lineUserId: string;
  authIdentity: AuthIdentitySummary | null;
  userProfile: UserProfileSummary | null;
  bindingState: "bound" | "unbound";
};

function toUserProfileSummary(
  profile: Awaited<ReturnType<typeof userProfileRepository.getById>>,
): UserProfileSummary | null {
  if (!profile) {
    return null;
  }

  return {
    userProfileId: profile.userProfileId,
    displayName: profile.displayName,
    city: profile.city,
    role: profile.role,
    profileStatus: profile.profileStatus,
    lineDisplayName: profile.lineDisplayName,
    lineNotificationsEnabled: profile.lineNotificationsEnabled,
    familyContactName: profile.familyContactName,
    familyContactRelation: profile.familyContactRelation,
    familyContactMethod: profile.familyContactMethod,
    familyContactValue: profile.familyContactValue,
    familyShareNote: profile.familyShareNote,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

function toAuthIdentitySummary(
  identity: Awaited<ReturnType<typeof authIdentityRepository.getById>>,
): AuthIdentitySummary | null {
  if (!identity) {
    return null;
  }

  return {
    authIdentityId: identity.authIdentityId,
    identityType: identity.identityType,
    identityStatus: identity.identityStatus,
    userProfileId: identity.userProfileId,
    emailNormalized: identity.emailNormalized,
    lineUserId: identity.lineUserId,
    identityKeyHint: identity.identityKeyHint,
    createdAt: identity.createdAt,
    updatedAt: identity.updatedAt,
  };
}

export class IdentityReadService {
  async getUserProfileById(userProfileId: string) {
    return toUserProfileSummary(await userProfileRepository.getById(userProfileId));
  }

  async getAuthIdentityByEmail(emailNormalized: string) {
    return toAuthIdentitySummary(await authIdentityRepository.getByEmail(emailNormalized));
  }

  async getAuthIdentityByLineUserId(lineUserId: string) {
    return toAuthIdentitySummary(await authIdentityRepository.getByLineUserId(lineUserId));
  }

  async listAuthIdentitiesByUserProfileId(userProfileId: string) {
    const identities = await authIdentityRepository.listByUserProfileId(userProfileId);
    return identities.map((identity) => toAuthIdentitySummary(identity)).filter((entry): entry is AuthIdentitySummary => Boolean(entry));
  }

  async getUserIdentitySnapshot(userProfileId: string): Promise<UserIdentitySnapshot> {
    const [userProfile, authIdentities] = await Promise.all([
      this.getUserProfileById(userProfileId),
      this.listAuthIdentitiesByUserProfileId(userProfileId),
    ]);

    return {
      userProfile,
      authIdentities,
    };
  }

  async resolveLineBindingState(lineUserId: string): Promise<LineBindingStateSnapshot> {
    const authIdentity = await this.getAuthIdentityByLineUserId(lineUserId);
    const userProfile = authIdentity?.userProfileId ? await this.getUserProfileById(authIdentity.userProfileId) : null;

    return {
      lineUserId,
      authIdentity,
      userProfile,
      bindingState: authIdentity?.userProfileId ? "bound" : "unbound",
    };
  }
}

export const identityReadService = new IdentityReadService();
