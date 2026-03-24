import { findAccountByEmail, findAccountById, findAccountByLineUserId, listAccounts } from "@/lib/server/yorisouData";
import { deriveAuthIdentitiesFromAccount } from "@/lib/server/midBackend/adapters/accountRecordAdapter";
import type { AuthIdentityRepository } from "@/lib/server/midBackend/contracts";

export class LegacyBackedAuthIdentityRepository implements AuthIdentityRepository {
  async getById(authIdentityId: string) {
    const accounts = await listAccounts();

    for (const account of accounts) {
      const identity = deriveAuthIdentitiesFromAccount(account).find((entry) => entry.authIdentityId === authIdentityId);

      if (identity) {
        return identity;
      }
    }

    return null;
  }

  async getByEmail(emailNormalized: string) {
    const account = await findAccountByEmail(emailNormalized.trim().toLowerCase());

    if (!account) {
      return null;
    }

    return deriveAuthIdentitiesFromAccount(account).find((identity) => identity.identityType === "email_password") || null;
  }

  async getByLineUserId(lineUserId: string) {
    const account = await findAccountByLineUserId(lineUserId);

    if (!account) {
      return null;
    }

    return deriveAuthIdentitiesFromAccount(account).find((identity) => identity.identityType === "line") || null;
  }

  async listByUserProfileId(userProfileId: string) {
    const account = await findAccountById(userProfileId);
    return account ? deriveAuthIdentitiesFromAccount(account) : [];
  }
}

export const authIdentityRepository = new LegacyBackedAuthIdentityRepository();
