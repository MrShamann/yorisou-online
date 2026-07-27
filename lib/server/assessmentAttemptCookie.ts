import "server-only";
// UX-2 / ICP-1 — the anonymous attempt credential.
//
// The claim token is held in an httpOnly, sameSite=lax cookie — never in the URL, never in
// localStorage, never in a query parameter. This satisfies the package requirement that raw
// sensitive state must not appear in URL parameters, and keeps the token out of reach of page
// scripts. The database stores only sha256(token).

import type { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const ATTEMPT_COOKIE = "yorisou_attempt";

export type AttemptCookiePayload = { attemptId: string; token: string };

export function serializeAttemptCookie(payload: AttemptCookiePayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function parseAttemptCookie(raw: string | undefined | null): AttemptCookiePayload | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as AttemptCookiePayload;
    if (typeof parsed?.attemptId !== "string" || typeof parsed?.token !== "string") return null;
    if (!parsed.attemptId || !parsed.token) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function readAttemptCookie(): Promise<AttemptCookiePayload | null> {
  const store = await cookies();
  return parseAttemptCookie(store.get(ATTEMPT_COOKIE)?.value);
}

export function setAttemptCookie(response: NextResponse, payload: AttemptCookiePayload) {
  response.cookies.set(ATTEMPT_COOKIE, serializeAttemptCookie(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 72, // matches the attempt TTL
  });
}

export function clearAttemptCookie(response: NextResponse) {
  response.cookies.set(ATTEMPT_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
}
