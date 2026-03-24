import type { AuthIdentity, MessageEvent, PasswordResetTokenView, UserProfile } from "@/lib/server/midBackend/types";

export interface UserProfileRepository {
  getById(userProfileId: string): Promise<UserProfile | null>;
  listByIds(userProfileIds: string[]): Promise<UserProfile[]>;
}

export interface AuthIdentityRepository {
  getById(authIdentityId: string): Promise<AuthIdentity | null>;
  getByEmail(emailNormalized: string): Promise<AuthIdentity | null>;
  getByLineUserId(lineUserId: string): Promise<AuthIdentity | null>;
  listByUserProfileId(userProfileId: string): Promise<AuthIdentity[]>;
}

export interface MessageEventRepository {
  getById(messageEventId: string): Promise<MessageEvent | null>;
  getByProviderEventId(providerEventId: string): Promise<MessageEvent | null>;
  listByUserProfileId(userProfileId: string): Promise<MessageEvent[]>;
  listByAuthIdentityId(authIdentityId: string): Promise<MessageEvent[]>;
}

export interface PasswordResetTokenRepository {
  getByRawToken(token: string): Promise<PasswordResetTokenView | null>;
  getByTokenHash(tokenHash: string): Promise<PasswordResetTokenView | null>;
  listByUserProfileId(userProfileId: string): Promise<PasswordResetTokenView[]>;
}
