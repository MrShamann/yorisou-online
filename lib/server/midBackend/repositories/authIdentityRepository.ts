import { foundationAuthIdentityRepository } from "@/lib/server/foundation/repositories";
import type { AuthIdentityRepository } from "@/lib/server/midBackend/contracts";
import type { AuthIdentity as CanonicalAuthIdentity } from "@/lib/server/foundation/schema";
import type { AuthIdentity as MidBackendAuthIdentity } from "@/lib/server/midBackend/types";

function mapCanonicalAuthIdentity(identity: CanonicalAuthIdentity): MidBackendAuthIdentity {
  return {
    authIdentityId: identity.authIdentityId,
    identityType: identity.identityType,
    identityKeyHash: identity.identityKeyHash,
    identityKeyHint: identity.identityKeyHint,
    userProfileId: identity.userProfileId,
    identityStatus:
      identity.identityStatus === "pending" || identity.identityStatus === "conflicted"
        ? "pending_verification"
        : identity.identityStatus,
    emailNormalized: identity.emailNormalized,
    passwordHashPresent: identity.passwordHashPresent,
    lineUserId: identity.lineUserId,
    lineIdTokenSubject: identity.lineIdTokenSubject,
    linePictureUrl: identity.linePictureUrl,
    lineConnectedAt: identity.lineConnectedAt,
    firstSeenAt: identity.firstSeenAt,
    lastSeenAt: identity.lastSeenAt,
    createdAt: identity.createdAt,
    updatedAt: identity.updatedAt,
  } as const;
}

export class CanonicalAuthIdentityRepository implements AuthIdentityRepository {
  async getById(authIdentityId: string) {
    const identity = await foundationAuthIdentityRepository.getById(authIdentityId);
    return identity ? mapCanonicalAuthIdentity(identity) : null;
  }

  async getByEmail(emailNormalized: string) {
    const identity = await foundationAuthIdentityRepository.getByEmail(emailNormalized);
    return identity ? mapCanonicalAuthIdentity(identity) : null;
  }

  async getByLineUserId(lineUserId: string) {
    const identity = await foundationAuthIdentityRepository.getByLineUserId(lineUserId);
    return identity ? mapCanonicalAuthIdentity(identity) : null;
  }

  async listByUserProfileId(userProfileId: string) {
    const identities = await foundationAuthIdentityRepository.listByUserProfileId(userProfileId);
    return identities.map(mapCanonicalAuthIdentity);
  }
}

export const authIdentityRepository = new CanonicalAuthIdentityRepository();
