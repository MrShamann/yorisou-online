import { createHash } from "crypto";

import type { AuthIdentityType, PasswordResetTokenStatus } from "@/lib/server/midBackend/types";

export function createIdentityKeyHash(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export function createAuthIdentityId(identityType: AuthIdentityType, rawValue: string) {
  return `authid_${identityType}_${createIdentityKeyHash(`${identityType}:${rawValue}`)}`;
}

export function getEmailIdentityHint(email: string) {
  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) {
    return null;
  }

  if (localPart.length === 1) {
    return `*@${domain}`;
  }

  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
}

export function getLineIdentityHint(lineUserId: string) {
  if (!lineUserId) {
    return null;
  }

  if (lineUserId.length <= 6) {
    return `${lineUserId.slice(0, 2)}***`;
  }

  return `${lineUserId.slice(0, 3)}***${lineUserId.slice(-3)}`;
}

export function getPasswordResetTokenStatus(input: {
  expiresAt: string;
  usedAt: string | null;
  now?: string;
}): PasswordResetTokenStatus {
  if (input.usedAt) {
    return "used";
  }

  const now = input.now || new Date().toISOString();

  if (input.expiresAt <= now) {
    return "expired";
  }

  return "active";
}
