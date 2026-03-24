import { passwordResetTokenRepository } from "@/lib/server/midBackend/repositories/passwordResetTokenRepository";

export type PasswordResetTokenSnapshot = {
  passwordResetTokenId: string;
  userProfileId: string;
  authIdentityId: string | null;
  emailNormalized: string;
  tokenHash: string;
  status: "active" | "used" | "expired" | "invalid";
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
  isUsable: boolean;
};

function toPasswordResetTokenSnapshot(
  token: Awaited<ReturnType<typeof passwordResetTokenRepository.getByTokenHash>>,
): PasswordResetTokenSnapshot | null {
  if (!token) {
    return null;
  }

  return {
    passwordResetTokenId: token.passwordResetTokenId,
    userProfileId: token.userProfileId,
    authIdentityId: token.authIdentityId,
    emailNormalized: token.emailNormalized,
    tokenHash: token.tokenHash,
    status: token.status,
    createdAt: token.createdAt,
    expiresAt: token.expiresAt,
    usedAt: token.usedAt,
    isUsable: token.status === "active",
  };
}

export class PasswordResetReadService {
  async getPasswordResetTokenByRawToken(token: string) {
    return toPasswordResetTokenSnapshot(await passwordResetTokenRepository.getByRawToken(token));
  }

  async getPasswordResetTokenByHash(tokenHash: string) {
    return toPasswordResetTokenSnapshot(await passwordResetTokenRepository.getByTokenHash(tokenHash));
  }

  async getPasswordResetSnapshot(input: { rawToken?: string; tokenHash?: string }) {
    if (input.rawToken) {
      return this.getPasswordResetTokenByRawToken(input.rawToken);
    }

    if (input.tokenHash) {
      return this.getPasswordResetTokenByHash(input.tokenHash);
    }

    return null;
  }
}

export const passwordResetReadService = new PasswordResetReadService();
