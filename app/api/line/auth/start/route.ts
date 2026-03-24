import { NextResponse } from "next/server";

import { ensureViewerSession, getViewerContext, setViewerSessionCookie, withSessionPrincipalLandingShadow } from "@/lib/server/yorisouAuth";
import {
  LINE_AUTH_COOKIE,
  buildLineAuthorizeUrl,
  createLineAuthCookiePayload,
  encodeLineAuthCookie,
  isLineLoginConfigured,
} from "@/lib/server/yorisouLine";

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
  const returnTo = safeRedirectPath(
    url.searchParams.get("returnTo"),
    locale === "en" ? "/en/support#line-connect" : "/support#line-connect",
  );

  const viewer = await getViewerContext();
  const session = viewer.session || (await ensureViewerSession());
  const sessionForCookie =
    viewer.legacyAccount || viewer.account
      ? await withSessionPrincipalLandingShadow(session, {
          legacyAccount: viewer.legacyAccount || viewer.account,
          source: "session_upgrade",
        })
      : session;

  if (!isLineLoginConfigured()) {
    return NextResponse.redirect(buildPublicUrl(request, `${returnTo.split("#")[0]}?line_error=not_configured#line-connect`), {
      status: 303,
    });
  }

  const payload = createLineAuthCookiePayload({
    account: viewer.account,
    session,
    returnTo,
    locale,
  });

  const response = NextResponse.redirect(buildLineAuthorizeUrl(payload), { status: 303 });
  setViewerSessionCookie(response, { ...sessionForCookie, userId: viewer.account?.id || null });
  response.cookies.set(LINE_AUTH_COOKIE, encodeLineAuthCookie(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
  });
  return response;
}
