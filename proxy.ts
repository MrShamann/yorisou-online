import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const localeCookie = "yorisou_locale";
const localeHeader = "x-yorisou-locale";
const pathnameHeader = "x-yorisou-pathname";

export function proxy(request: NextRequest) {
  const locale = request.nextUrl.pathname.startsWith("/en") ? "en" : "ja";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(localeHeader, locale);
  requestHeaders.set(pathnameHeader, request.nextUrl.pathname);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.cookies.set(localeCookie, locale, {
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
