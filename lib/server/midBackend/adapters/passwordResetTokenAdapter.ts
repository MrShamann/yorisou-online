import type { PasswordResetTokenRecord } from "@/lib/server/yorisouData";
import type { PasswordResetTokenView } from "@/lib/server/midBackend/types";
import { createAuthIdentityId, getPasswordResetTokenStatus } from "@/lib/server/midBackend/utils";

export function mapPasswordResetTokenRecordToView(record: PasswordResetTokenRecord): PasswordResetTokenView {
  const emailNormalized = record.email.trim().toLowerCase();

  return {
    passwordResetTokenId: `prtok_${record.tokenHash}`,
    userProfileId: record.accountId,
    authIdentityId: createAuthIdentityId("email_password", emailNormalized),
    emailNormalized,
    tokenHash: record.tokenHash,
    status: getPasswordResetTokenStatus({
      expiresAt: record.expiresAt,
      usedAt: record.usedAt,
    }),
    createdAt: record.createdAt,
    expiresAt: record.expiresAt,
    usedAt: record.usedAt,
  };
}
