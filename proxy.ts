import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { DEFAULT_LOCALE, resolveLocale } from "@/app/_corporate/i18n/locales";
import { CORPORATE_BLOCKED, CORPORATE_INDEXABLE } from "@/lib/corporate/routePolicy";

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
 * THE CORPORATE ROUTES resolve their locale from `?lang`, validated against the locale registry.
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
/**
 * CORP-v1.3 — DERIVED, not listed.
 *
 * This was a hand-maintained set of the six corporate paths that existed when it was written.
 * CORP-v1.2 then added `/ventures`, `/chigamo` and `/build-with-us` and did not add them here, so
 * for those three routes `?lang=` was never read: the BODY came out correctly translated, because
 * each page resolves its own locale from the query, while the DOCUMENT stayed
 * `<html lang="ja" dir="ltr" data-script="Jpan">`. An Arabic reader on /ventures got Arabic text in
 * a document announced to assistive technology as Japanese, with a left-to-right base direction and
 * Japanese script tuning — the exact failure the comment above says was fixed, reintroduced on three
 * routes by a list that could go stale.
 *
 * It now comes from the route policy, which is itself checked against the App Router filesystem. A
 * corporate route cannot be added without being locale-resolved, because there is no second list to
 * forget. `corporateLocaleResolution.test.ts` asserts the two agree.
 */
const CORPORATE_PATHS = new Set<string>([...CORPORATE_INDEXABLE, ...CORPORATE_BLOCKED]);

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
