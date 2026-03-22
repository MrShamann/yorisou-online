import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

import {
  assignSessionConsultationsToUser,
  createSession,
  deleteSession,
  findAccountById,
  findSessionById,
  getLatestLineWebhookEventForAccount,
  listConsultationsForViewer,
  upsertAccountRecord,
  touchSession,
  type AccountRecord,
  type LineWebhookEventRecord,
  type SessionRecord,
} from "@/lib/server/yorisouData";

export const SESSION_COOKIE = "yorisou_session";
export const ACCOUNT_COOKIE = "yorisou_account";

type SessionCookiePayload = {
  id: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ViewerContext = {
  session: SessionRecord | null;
  account: AccountRecord | null;
};

const AUTH_COOKIE_SECRET = process.env.YORISOU_AUTH_COOKIE_SECRET || "yorisou-phase1-auth-cookie-secret";
const AUTH_COOKIE_KEY = createHash("sha256").update(AUTH_COOKIE_SECRET).digest();

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

function encodeSessionCookie(session: SessionCookiePayload) {
  return encryptCookieValue(JSON.stringify(session));
}

function decodeSessionCookie(value: string | undefined) {
  if (!value) {
    return null;
  }

  const decoded = decryptCookieValue(value);
  if (!decoded) {
    return null;
  }

  try {
    return JSON.parse(decoded) as SessionCookiePayload;
  } catch {
    return null;
  }
}

function encodeAccountCookie(account: AccountRecord) {
  return encryptCookieValue(JSON.stringify(account));
}

function decodeAccountCookie(value: string | undefined) {
  if (!value) {
    return null;
  }

  const decoded = decryptCookieValue(value);
  if (!decoded) {
    return null;
  }

  try {
    return JSON.parse(decoded) as AccountRecord;
  } catch {
    return null;
  }
}

function createSyntheticSession(payload: SessionCookiePayload): SessionRecord {
  return {
    id: payload.id,
    userId: payload.userId,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
  };
}

export function readAccountCookieFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const accountValue = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${ACCOUNT_COOKIE}=`))
    ?.split("=")
    .slice(1)
    .join("=");
  return decodeAccountCookie(accountValue);
}

export function setViewerSessionCookie(response: NextResponse, session: SessionRecord) {
  response.cookies.set(SESSION_COOKIE, encodeSessionCookie(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
}

export function setViewerAccountCookie(response: NextResponse, account: AccountRecord) {
  response.cookies.set(ACCOUNT_COOKIE, encodeAccountCookie(account), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 180,
  });
}

export async function getViewerContext(): Promise<ViewerContext> {
  const cookieStore = await cookies();
  const rawSessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  const sessionCookie = decodeSessionCookie(rawSessionValue);
  const accountCookie = decodeAccountCookie(cookieStore.get(ACCOUNT_COOKIE)?.value);

  if (sessionCookie) {
    const storedSession = await findSessionById(sessionCookie.id);
    const session = storedSession
      ? ((await touchSession(sessionCookie.id, sessionCookie.userId)) || storedSession)
      : createSyntheticSession(sessionCookie);

    const accountFromStore = session.userId ? await findAccountById(session.userId) : null;
    const account =
      accountFromStore ||
      (accountCookie && session.userId && accountCookie.id === session.userId ? accountCookie : null);

    return { session, account };
  }

  if (!rawSessionValue) {
    return { session: null, account: null };
  }

  const session = await findSessionById(rawSessionValue);

  if (!session) {
    return { session: null, account: null };
  }

  await touchSession(session.id);
  const account = session.userId ? await findAccountById(session.userId) : null;
  return { session, account };
}

export async function ensureViewerSession() {
  const cookieStore = await cookies();
  const rawSessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  const sessionCookie = decodeSessionCookie(rawSessionValue);

  if (sessionCookie) {
    const session = await findSessionById(sessionCookie.id);
    if (session) {
      await touchSession(session.id, sessionCookie.userId);
      return session;
    }
    return createSyntheticSession(sessionCookie);
  }

  if (rawSessionValue) {
    const session = await findSessionById(rawSessionValue);
    if (session) {
      await touchSession(session.id);
      return session;
    }
  }

  return createSession(null);
}

export async function bindSessionToUser(sessionId: string, userId: string) {
  await touchSession(sessionId, userId);
  await assignSessionConsultationsToUser(sessionId, userId);
}

export async function clearViewerSession() {
  const cookieStore = await cookies();
  const rawSessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  const sessionCookie = decodeSessionCookie(rawSessionValue);
  const sessionId = sessionCookie?.id || rawSessionValue;
  if (sessionId) {
    await deleteSession(sessionId);
  }
}

export async function restoreAccountFromCookie(account: AccountRecord | null) {
  if (!account) {
    return null;
  }

  await upsertAccountRecord(account);
  return account;
}

export async function getSupportWorkspaceData(locale: "ja" | "en") {
  const viewer = await getViewerContext();
  const consultations = await listConsultationsForViewer({
    userId: viewer.account?.id || null,
    sessionId: viewer.session?.id || null,
    locale,
  });
  const latestLineEvent: LineWebhookEventRecord | null = viewer.account
    ? await getLatestLineWebhookEventForAccount(viewer.account.id)
    : null;

  return {
    ...viewer,
    consultations,
    latestLineEvent,
  };
}

export type SupportWorkspaceData = Awaited<ReturnType<typeof getSupportWorkspaceData>>;
