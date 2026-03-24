import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

import type { AccountRecord, SessionRecord } from "@/lib/server/yorisouData";

export const LINE_AUTH_COOKIE = "yorisou_line_auth";

type LineAuthCookiePayload = {
  accountId: string | null;
  sessionId: string | null;
  state: string;
  nonce: string;
  returnTo: string;
  locale: "ja" | "en";
  createdAt: string;
};

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
  returnTo: string;
  locale: "ja" | "en";
}) {
  return {
    accountId: input.account?.id || null,
    sessionId: input.session?.id || null,
    state: createLineAuthState(input.locale),
    nonce: randomBytes(16).toString("hex"),
    returnTo: input.returnTo,
    locale: input.locale,
    createdAt: new Date().toISOString(),
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
  return url.toString();
}

export function isLineLoginConfigured() {
  return Boolean(process.env.LINE_CHANNEL_ID && process.env.LINE_CHANNEL_SECRET && process.env.LINE_REDIRECT_URI);
}

export function isLineMessagingConfigured() {
  return Boolean(process.env.LINE_CHANNEL_SECRET && process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN);
}

export function getLineMessagingConfigStatus() {
  return {
    loginConfigured: isLineLoginConfigured(),
    messagingConfigured: isLineMessagingConfigured(),
    channelSecretPresent: Boolean(process.env.LINE_CHANNEL_SECRET),
    channelAccessTokenPresent: Boolean(process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN),
  };
}

export async function exchangeLineAuthorizationCode(input: { code: string }) {
  const channelId = process.env.LINE_CHANNEL_ID;
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
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

export function verifyLineWebhookSignature(input: { body: string; signature: string | null }) {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;

  if (!channelSecret || !input.signature) {
    return false;
  }

  const expected = createHmac("sha256", channelSecret).update(input.body, "utf8").digest("base64");
  const actualBuffer = Buffer.from(input.signature);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
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
