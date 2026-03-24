import { getPasswordResetTokenRecord, listPasswordResetTokens } from "@/lib/server/yorisouData";
import { mapPasswordResetTokenRecordToView } from "@/lib/server/midBackend/adapters/passwordResetTokenAdapter";
import type { PasswordResetTokenRepository } from "@/lib/server/midBackend/contracts";

export class LegacyBackedPasswordResetTokenRepository implements PasswordResetTokenRepository {
  async getByRawToken(token: string) {
    const record = await getPasswordResetTokenRecord(token);
    return record ? mapPasswordResetTokenRecordToView(record) : null;
  }

  async getByTokenHash(tokenHash: string) {
    const records = await listPasswordResetTokens();
    const record = records.find((entry) => entry.tokenHash === tokenHash) || null;
    return record ? mapPasswordResetTokenRecordToView(record) : null;
  }

  async listByUserProfileId(userProfileId: string) {
    const records = await listPasswordResetTokens();
    return records
      .filter((entry) => entry.accountId === userProfileId)
      .map(mapPasswordResetTokenRecordToView);
  }
}

export const passwordResetTokenRepository = new LegacyBackedPasswordResetTokenRepository();
