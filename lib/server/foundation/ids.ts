import { createHash, randomBytes } from "crypto";

export type FoundationEntityPrefix =
  | "uprofile"
  | "conv"
  | "mevt"
  | "scase"
  | "consent"
  | "audit";

export function nowIso() {
  return new Date().toISOString();
}

export function createFoundationId(prefix: FoundationEntityPrefix) {
  return `${prefix}_${Date.now()}_${randomBytes(6).toString("hex")}`;
}

export function createHashedKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export const LINE_PLACEHOLDER_EMAIL_DOMAIN = "line.yorisou.local.invalid";

export function createDeterministicPlaceholderEmail(lineUserId: string) {
  const digest = createHashedKey(`line-placeholder:${lineUserId}`).slice(0, 16);
  return `line+${digest}@${LINE_PLACEHOLDER_EMAIL_DOMAIN}`;
}

export function isPlaceholderEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  const normalized = email.trim().toLowerCase();
  return normalized.startsWith("line+") && normalized.endsWith(`@${LINE_PLACEHOLDER_EMAIL_DOMAIN}`);
}

export function createIpHash(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return createHashedKey(value.trim());
}
