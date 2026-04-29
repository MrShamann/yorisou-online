import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

import { getBranchDefaultReturnPath, resolveBranchContext, validateBranchRedirectTarget, type BranchId } from "@/lib/server/branchRegistry";
import type { AccountRecord, SessionRecord } from "@/lib/server/yorisouData";

export const LINE_AUTH_COOKIE = "yorisou_line_auth";
const MAX_PENDING_LINE_AUTH_STATES = 6;

type LineAuthCookiePayload = {
  accountId: string | null;
  sessionId: string | null;
  branchId: BranchId;
  state: string;
  nonce: string;
  intent: "login" | "register" | "support";
  returnTo: string;
  successRedirect: string;
  failureRedirect: string;
  locale: "ja" | "en";
  createdAt: string;
  sourceBranchId: BranchId | null;
  visibilityPolicy: "public" | "branch_internal" | "internal";
  crossBranchAccessPolicy: "same_branch_only" | "explicit_bridge" | "read_only_archive";
};

export type LineFriendshipStatus = "friend" | "not_friend" | "unknown";

type LineIdTokenPayload = {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nonce?: string;
  name?: string;
  picture?: string;
};

const AUTH_COOKIE_SECRET = process.env.YORISOU_AUTH_COOKIE_SECRET || "yorisou-phase1-auth-cookie-secret";
const AUTH_COOKIE_KEY = createHash("sha256").update(AUTH_COOKIE_SECRET).digest();
const DEFAULT_SCOPE = "openid profile";
const DEFAULT_LINE_OFFICIAL_ACCOUNT_ID = "@247rinzu";

function getLineLoginChannelSecret() {
  return process.env.LINE_LOGIN_CHANNEL_SECRET || process.env.LINE_CHANNEL_SECRET || null;
}

function getLineMessagingChannelSecret() {
  return process.env.LINE_MESSAGING_CHANNEL_SECRET || process.env.LINE_CHANNEL_SECRET || null;
}

function getLineOfficialAccountId() {
  const raw =
    process.env.LINE_OFFICIAL_ACCOUNT_ID ||
    process.env.LINE_OFFICIAL_ACCOUNT_BASIC_ID ||
    DEFAULT_LINE_OFFICIAL_ACCOUNT_ID;

  return raw.startsWith("@") ? raw : `@${raw}`;
}

export function getLineOfficialAccountUrls() {
  const accountId = getLineOfficialAccountId();
  const defaultUrl = `https://line.me/R/ti/p/${encodeURIComponent(accountId)}`;

  return {
    accountId,
    addFriendUrl: process.env.LINE_OFFICIAL_ACCOUNT_ADD_FRIEND_URL || defaultUrl,
    chatUrl: process.env.LINE_OFFICIAL_ACCOUNT_CHAT_URL || defaultUrl,
  };
}

function resolveLineBotPrompt(intent: LineAuthCookiePayload["intent"]) {
  if (intent === "login") {
    return "normal";
  }

  return "aggressive";
}

function createLineAuthState(locale: "ja" | "en") {
  return `${locale}.${randomBytes(16).toString("hex")}`;
}

function encryptCookieValue(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", AUTH_COOKIE_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

function decryptCookieValue(value: string) {
  try {
    const buffer = Buffer.from(value, "base64url");
    if (buffer.length <= 28) {
      return null;
    }

    const iv = buffer.subarray(0, 12);
    const tag = buffer.subarray(12, 28);
    const encrypted = buffer.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", AUTH_COOKIE_KEY, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

export function createLineAuthCookiePayload(input: {
  account: AccountRecord | null;
  session: SessionRecord | null;
  intent: "login" | "register" | "support";
  branchId?: BranchId | null;
  returnTo: string;
  successRedirect: string;
  failureRedirect: string;
  locale: "ja" | "en";
}) {
  const branch = resolveBranchContext({
    branchId: input.branchId,
    returnTo: input.returnTo,
    intent: input.intent,
    fallbackBranchId: "website_brand",
  });
  const defaultReturn = getBranchDefaultReturnPath(branch.branchId, input.locale);
  return {
    accountId: input.account?.id || null,
    sessionId: input.session?.id || null,
    branchId: branch.branchId,
    state: createLineAuthState(input.locale),
    nonce: randomBytes(16).toString("hex"),
    intent: input.intent,
    returnTo: validateBranchRedirectTarget(branch.branchId, input.returnTo, defaultReturn),
    successRedirect: validateBranchRedirectTarget(branch.branchId, input.successRedirect, defaultReturn),
    failureRedirect: validateBranchRedirectTarget(branch.branchId, input.failureRedirect, defaultReturn),
    locale: input.locale,
    createdAt: new Date().toISOString(),
    sourceBranchId: branch.sourceBranchId,
    visibilityPolicy: branch.visibilityPolicy,
    crossBranchAccessPolicy: branch.crossBranchAccessPolicy,
  } satisfies LineAuthCookiePayload;
}

export function inferLineLocaleFromState(state: string | null | undefined) {
  if (typeof state !== "string") {
    return null;
  }

  if (state.startsWith("en.")) {
    return "en" as const;
  }

  if (state.startsWith("ja.")) {
    return "ja" as const;
  }

  return null;
}

export function encodeLineAuthCookie(payload: LineAuthCookiePayload) {
  return encryptCookieValue(JSON.stringify(payload));
}

export function decodeLineAuthCookie(value: string | undefined) {
  if (!value) {
    return null;
  }

  const decoded = decryptCookieValue(value);
  if (!decoded) {
    return null;
  }

  try {
    return JSON.parse(decoded) as LineAuthCookiePayload;
  } catch {
    return null;
  }
}

export function decodeLineAuthCookieEntries(value: string | undefined) {
  const raw = value ? decryptCookieValue(value) : null;
  if (!raw) {
    return [] as LineAuthCookiePayload[];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((entry): entry is LineAuthCookiePayload => Boolean(entry && typeof entry === "object"));
    }
    if (parsed && typeof parsed === "object") {
      return [parsed as LineAuthCookiePayload];
    }
  } catch {
    return [] as LineAuthCookiePayload[];
  }

  return [] as LineAuthCookiePayload[];
}

export function encodeLineAuthCookieEntries(entries: LineAuthCookiePayload[]) {
  return encryptCookieValue(JSON.stringify(entries.slice(-MAX_PENDING_LINE_AUTH_STATES)));
}

export function upsertLineAuthCookieEntry(
  existingEntries: LineAuthCookiePayload[],
  payload: LineAuthCookiePayload,
) {
  const nextEntries = existingEntries.filter((entry) => entry.state !== payload.state);
  nextEntries.push(payload);
  return nextEntries.slice(-MAX_PENDING_LINE_AUTH_STATES);
}

export function buildLineAuthorizeUrl(payload: LineAuthCookiePayload) {
  const channelId = process.env.LINE_CHANNEL_ID;
  const redirectUri = process.env.LINE_REDIRECT_URI;
  const scope = process.env.LINE_SCOPE || DEFAULT_SCOPE;

  if (!channelId || !redirectUri) {
    throw new Error("line_not_configured");
  }

  const url = new URL("https://access.line.me/oauth2/v2.1/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", channelId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", payload.state);
  url.searchParams.set("scope", scope);
  url.searchParams.set("nonce", payload.nonce);
  url.searchParams.set("bot_prompt", resolveLineBotPrompt(payload.intent));
  return url.toString();
}

export function isLineLoginConfigured() {
  return Boolean(process.env.LINE_CHANNEL_ID && getLineLoginChannelSecret() && process.env.LINE_REDIRECT_URI);
}

export function isLineMessagingConfigured() {
  return Boolean(getLineMessagingChannelSecret() && process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN);
}

export async function downloadLineMessageContent(input: { messageId: string }) {
  const channelAccessToken = process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN;

  if (!channelAccessToken) {
    throw new Error("line_messaging_not_configured");
  }

  const response = await fetch(`https://api-data.line.me/v2/bot/message/${encodeURIComponent(input.messageId)}/content`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${channelAccessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`line_message_content_failed:${response.status}:${errorText.slice(0, 120)}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") || "audio/m4a";

  return {
    audioBase64: buffer.toString("base64"),
    mimeType: contentType,
    fileName: input.messageId,
  };
}

export function getLineMessagingConfigStatus() {
  return {
    loginConfigured: isLineLoginConfigured(),
    messagingConfigured: isLineMessagingConfigured(),
    loginChannelSecretPresent: Boolean(getLineLoginChannelSecret()),
    messagingChannelSecretPresent: Boolean(getLineMessagingChannelSecret()),
    channelSecretPresent: Boolean(getLineMessagingChannelSecret()),
    channelAccessTokenPresent: Boolean(process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN),
  };
}

export async function exchangeLineAuthorizationCode(input: { code: string }) {
  const channelId = process.env.LINE_CHANNEL_ID;
  const channelSecret = getLineLoginChannelSecret();
  const redirectUri = process.env.LINE_REDIRECT_URI;

  if (!channelId || !channelSecret || !redirectUri) {
    throw new Error("line_not_configured");
  }

  const response = await fetch("https://api.line.me/oauth2/v2.1/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: input.code,
      redirect_uri: redirectUri,
      client_id: channelId,
      client_secret: channelSecret,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("line_token_exchange_failed");
  }

  return (await response.json()) as {
    access_token?: string;
    id_token?: string;
    scope?: string;
    token_type?: string;
    expires_in?: number;
  };
}

function decodeJwtPayload(token: string): LineIdTokenPayload | null {
  const segments = token.split(".");
  if (segments.length !== 3) {
    return null;
  }

  try {
    const payload = Buffer.from(segments[1], "base64url").toString("utf8");
    return JSON.parse(payload) as LineIdTokenPayload;
  } catch {
    return null;
  }
}

export function verifyLineIdToken(input: { idToken: string; nonce: string }) {
  const channelId = process.env.LINE_CHANNEL_ID;
  const payload = decodeJwtPayload(input.idToken);

  if (!channelId || !payload) {
    throw new Error("line_id_token_invalid");
  }

  const audienceOk = Array.isArray(payload.aud) ? payload.aud.includes(channelId) : payload.aud === channelId;
  const issuerOk = payload.iss === "https://access.line.me";
  const nonceOk = payload.nonce === input.nonce;
  const expOk = typeof payload.exp === "number" && payload.exp * 1000 > Date.now();

  if (!audienceOk || !issuerOk || !nonceOk || !expOk || !payload.sub) {
    throw new Error("line_id_token_invalid");
  }

  return payload;
}

export async function fetchLineProfile(accessToken: string) {
  const response = await fetch("https://api.line.me/v2/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("line_profile_fetch_failed");
  }

  return (await response.json()) as {
    userId?: string;
    displayName?: string;
    pictureUrl?: string;
  };
}

export async function fetchLineFriendshipStatus(accessToken: string) {
  const response = await fetch("https://api.line.me/friendship/v1/status", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("line_friendship_status_failed");
  }

  const payload = (await response.json()) as {
    friendFlag?: boolean;
  };

  return {
    status: payload.friendFlag === true ? ("friend" as const) : ("not_friend" as const),
    source: "api" as const,
  };
}

export function verifyLineWebhookSignature(input: { body: string; signature: string | null }) {
  const channelSecrets = [
    { source: "LINE_MESSAGING_CHANNEL_SECRET", value: process.env.LINE_MESSAGING_CHANNEL_SECRET },
    { source: "LINE_CHANNEL_SECRET", value: process.env.LINE_CHANNEL_SECRET },
    { source: "LINE_LOGIN_CHANNEL_SECRET", value: process.env.LINE_LOGIN_CHANNEL_SECRET },
  ].filter((entry): entry is { source: string; value: string } => Boolean(entry.value && entry.value.trim()));

  if (channelSecrets.length === 0 || !input.signature) {
    return false;
  }

  const actualBuffer = Buffer.from(input.signature);

  return channelSecrets.some((entry) => {
    const expected = createHmac("sha256", entry.value).update(input.body, "utf8").digest("base64");
    const expectedBuffer = Buffer.from(expected);

    if (actualBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(actualBuffer, expectedBuffer);
  });
}

export function getLineWebhookSignatureDebugStatus(input: { body: string; signature: string | null }) {
  const channelSecrets = [
    { source: "LINE_MESSAGING_CHANNEL_SECRET", value: process.env.LINE_MESSAGING_CHANNEL_SECRET },
    { source: "LINE_CHANNEL_SECRET", value: process.env.LINE_CHANNEL_SECRET },
    { source: "LINE_LOGIN_CHANNEL_SECRET", value: process.env.LINE_LOGIN_CHANNEL_SECRET },
  ].filter((entry): entry is { source: string; value: string } => Boolean(entry.value && entry.value.trim()));

  if (!input.signature) {
    return {
      signaturePresent: false,
      candidateSecretSources: channelSecrets.map((entry) => entry.source),
      matchedSecretSource: null as string | null,
    };
  }

  const actualBuffer = Buffer.from(input.signature);
  let matchedSecretSource: string | null = null;

  for (const entry of channelSecrets) {
    const expected = createHmac("sha256", entry.value).update(input.body, "utf8").digest("base64");
    const expectedBuffer = Buffer.from(expected);

    if (actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)) {
      matchedSecretSource = entry.source;
      break;
    }
  }

  return {
    signaturePresent: true,
    candidateSecretSources: channelSecrets.map((entry) => entry.source),
    matchedSecretSource,
  };
}

export async function sendLineReplyMessage(input: { replyToken: string; text: string }) {
  const channelAccessToken = process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN;

  if (!channelAccessToken) {
    return { ok: false as const, reason: "not_configured" as const, status: null };
  }

  const response = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${channelAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      replyToken: input.replyToken,
      messages: [
        {
          type: "text",
          text: input.text,
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      ok: false as const,
      reason: "reply_failed" as const,
      status: response.status,
      errorText,
    };
  }

  return { ok: true as const, status: response.status };
}
