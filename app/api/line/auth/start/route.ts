import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/server/yorisouAuth";
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
  const returnTo = safeRedirectPath(url.searchParams.get("returnTo"), "/support#line-connect");
  const locale = url.searchParams.get("locale") === "en" ? "en" : "ja";

  const viewer = await getViewerContext();

  if (!viewer.account) {
    const loginPath = locale === "ja" ? "/login" : "/en/login";
    return NextResponse.redirect(buildPublicUrl(request, `${loginPath}?next=${encodeURIComponent(returnTo)}`), { status: 303 });
  }

  if (!isLineLoginConfigured()) {
    return NextResponse.redirect(buildPublicUrl(request, `${returnTo.split("#")[0]}?line_error=not_configured#line-connect`), {
      status: 303,
    });
  }

  const payload = createLineAuthCookiePayload({
    account: viewer.account,
    session: viewer.session,
    returnTo,
    locale,
  });

  const response = NextResponse.redirect(buildLineAuthorizeUrl(payload), { status: 303 });
  response.cookies.set(LINE_AUTH_COOKIE, encodeLineAuthCookie(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
  });
  return response;
}
