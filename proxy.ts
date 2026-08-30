import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { DEFAULT_LOCALE, resolveLocale } from "@/app/_corporate/i18n/locales";

const localeCookie = "yorisou_locale";
const localeHeader = "x-yorisou-locale";
const pathnameHeader = "x-yorisou-pathname";

/**
 * CORP-P5R2 — locale derivation.
 *
 * There are two locale regimes on this deployment and they must not be merged.
 *
 * LEGACY CONSUMER ROUTES keep pathname semantics exactly as before: `/en...` is English, everything
 * else is Japanese. Nothing about that behaviour changes here, and no query parameter is consulted
 * for those paths.
 *
 * THE SIX CORPORATE ROUTES resolve their locale from `?lang`, validated against the locale registry.
 * Previously only `?lang=en` on the exact path `/` was understood, so nineteen of the twenty-one
 * published locales served correctly translated bodies inside `<html lang="ja">` with no `dir` at
 * all — an Arabic page announced to assistive technology as Japanese and laid out left-to-right.
 * The registry is the single source of truth for which codes exist and which direction each takes,
 * so adding a locale needs no change here.
 *
 * Both the header AND the cookie are written on every matched request. `RootLayout` treats the
 * HEADER as authoritative and consults the cookie only when the header is absent, which is what
 * stops a stale cookie from an earlier visit forcing the wrong language onto a later page. Because
 * the pair is rewritten every time, locale is NON-STICKY: a later plain `/` returns to Japanese, so
 * choosing a language never silently becomes a persistent preference. Nothing is inferred from
 * browser language, IP, device or geography.
 */
const CORPORATE_PATHS = new Set([
  "/",
  "/mirai-move",
  "/kakari",
  "/about",
  "/company",
  "/contact",
]);

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const locale = CORPORATE_PATHS.has(pathname)
    ? resolveLocale(searchParams.get("lang") ?? undefined)
    : pathname.startsWith("/en")
      ? "en"
      : DEFAULT_LOCALE;
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
