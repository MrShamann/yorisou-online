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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const returnTo = safeRedirectPath(url.searchParams.get("returnTo"), "/support#line-connect");
  const locale = url.searchParams.get("locale") === "en" ? "en" : "ja";

  const viewer = await getViewerContext();

  if (!viewer.account) {
    const loginPath = locale === "ja" ? "/login" : "/en/login";
    return NextResponse.redirect(new URL(`${loginPath}?next=${encodeURIComponent(returnTo)}`, request.url), { status: 303 });
  }

  if (!isLineLoginConfigured()) {
    return NextResponse.redirect(new URL(`${returnTo.split("#")[0]}?line_error=not_configured#line-connect`, request.url), {
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
