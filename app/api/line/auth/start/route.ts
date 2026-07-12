import { NextResponse } from "next/server";

import { ensureViewerSession, getViewerContext, setViewerSessionCookie } from "@/lib/server/yorisouAuth";
import {
  LINE_AUTH_COOKIE,
  buildLineAuthorizeUrl,
  createLineAuthCookiePayload,
  decodeLineAuthCookieEntries,
  encodeLineAuthCookieEntries,
  isLineLoginConfigured,
  upsertLineAuthCookieEntry,
} from "@/lib/server/yorisouLine";
import { persistLineOAuthState } from "@/lib/server/lineOAuthStateStore";

function safeRedirectPath(value: string | null, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}

function buildPublicUrl(request: Request, path: string) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const proto = forwardedProto || (host?.includes("localhost") ? "http" : "https");

  if (host) {
    return new URL(path, `${proto}://${host}`);
  }

  return new URL(path, request.url);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") === "en" ? "en" : "ja";
  const intent = url.searchParams.get("intent") === "register" ? "register" : url.searchParams.get("intent") === "support" ? "support" : "login";
  const supportHref = locale === "en" ? "/en/support" : "/support";
  const loginHref = locale === "en" ? "/en/login#line-entry" : "/login#line-entry";
  const registerHref = locale === "en" ? "/en/register#line-entry" : "/register#line-entry";
  const returnTo = safeRedirectPath(url.searchParams.get("returnTo"), supportHref);
  const testReturn = /^\/tests\/(c02|f01|f02|relationship-fatigue)(?:\/return)?(?:\?.*)?$/.test(returnTo) || returnTo.startsWith("/saved/tests/") || returnTo.startsWith("/saved/c02/");
  const successRedirect = testReturn || intent === "support" ? returnTo : supportHref;
  const failureRedirect = testReturn ? returnTo : intent === "register" ? registerHref : intent === "support" ? supportHref : loginHref;

  const viewer = await getViewerContext();
  const session = viewer.session || (await ensureViewerSession());

  if (!isLineLoginConfigured()) {
    const failureBase = failureRedirect.split("#")[0];
    const failureHash = failureRedirect.includes("#") ? `#${failureRedirect.split("#")[1]}` : "";
    return NextResponse.redirect(buildPublicUrl(request, `${failureBase}?line_error=not_configured${failureHash}`), {
      status: 303,
    });
  }

  const payload = createLineAuthCookiePayload({
    account: viewer.account || viewer.legacyAccount,
    session,
    intent,
    returnTo,
    successRedirect,
    failureRedirect,
    locale,
    branchId: testReturn ? "yorisou_dte" : null,
  });
  const existingEntries = decodeLineAuthCookieEntries(request.headers.get("cookie")?.match(/(?:^|; )yorisou_line_auth=([^;]+)/)?.[1]);
  const nextEntries = upsertLineAuthCookieEntry(existingEntries, payload);
  await persistLineOAuthState(payload);

  const response = NextResponse.redirect(buildLineAuthorizeUrl(payload), { status: 303 });
  setViewerSessionCookie(response, { ...session, userId: viewer.account?.id || null });
  response.cookies.set(LINE_AUTH_COOKIE, encodeLineAuthCookieEntries(nextEntries), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
  });
  return response;
}
