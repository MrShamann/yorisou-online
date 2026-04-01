import { foundationUserProfileRepository } from "@/lib/server/foundation/repositories";
import type { UserProfileRepository } from "@/lib/server/midBackend/contracts";
import type { UserProfile as CanonicalUserProfile } from "@/lib/server/foundation/schema";

function mapCanonicalUserProfile(profile: CanonicalUserProfile) {
  return {
    userProfileId: profile.userProfileId,
    displayName: profile.profile.displayName,
    primaryLocale: profile.profile.primaryLocale,
    city: profile.profile.city,
    role: profile.profile.role,
    profileStatus: profile.profileStatus,
    lineDisplayName: profile.profile.lineDisplayName,
    lineNotificationsEnabled: profile.profile.lineNotificationsEnabled,
    familyContactName: profile.sensitiveProfile.familyContactName,
    familyContactRelation: profile.sensitiveProfile.familyContactRelation,
    familyContactMethod: profile.sensitiveProfile.familyContactMethod,
    familyContactValue: profile.sensitiveProfile.familyContactValue,
    familyShareNote: profile.sensitiveProfile.familyShareNote,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  } as const;
}

export class CanonicalUserProfileRepository implements UserProfileRepository {
  async getById(userProfileId: string) {
    const profile = await foundationUserProfileRepository.getById(userProfileId);
    return profile ? mapCanonicalUserProfile(profile) : null;
  }

  async listByIds(userProfileIds: string[]) {
    if (!userProfileIds.length) {
      return [];
    }

    const profiles = await foundationUserProfileRepository.listByIds(userProfileIds);
    return profiles.map(mapCanonicalUserProfile);
  }
}

export const userProfileRepository = new CanonicalUserProfileRepository();
