import { findAccountById, listAccounts } from "@/lib/server/yorisouData";
import { mapAccountRecordToUserProfile } from "@/lib/server/midBackend/adapters/accountRecordAdapter";
import type { UserProfileRepository } from "@/lib/server/midBackend/contracts";

export class LegacyBackedUserProfileRepository implements UserProfileRepository {
  async getById(userProfileId: string) {
    const account = await findAccountById(userProfileId);
    return account ? mapAccountRecordToUserProfile(account) : null;
  }

  async listByIds(userProfileIds: string[]) {
    if (!userProfileIds.length) {
      return [];
    }

    const wanted = new Set(userProfileIds);
    const accounts = await listAccounts();
    return accounts.filter((account) => wanted.has(account.id)).map(mapAccountRecordToUserProfile);
  }
}

export const userProfileRepository = new LegacyBackedUserProfileRepository();
