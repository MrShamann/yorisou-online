import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const localeCookie = "yorisou_locale";
const localeHeader = "x-yorisou-locale";
const pathnameHeader = "x-yorisou-pathname";

/**
 * CORP-P5R1-AMD2 — locale derivation.
 *
 * Consumer semantics are unchanged: for every path, locale is still derived from the pathname, so
 * `/en...` stays English and everything else stays Japanese.
 *
 * The ONE addition is the corporate homepage. `/` renders English content when `?lang=en` is
 * present, but the document language was still coming from the pathname, so `/?lang=en` served an
 * English body inside `<html lang="ja">`. The homepage — and only the exact path `/` — now resolves
 * its locale from that parameter.
 *
 * Both the header AND the cookie are written for `/`, deliberately. `RootLayout` reads
 * `header === "en" || cookie === "en"`, so writing only the header would leave a stale `en` cookie
 * from an earlier `/en` visit forcing `<html lang="en">` onto the Japanese homepage. Overwriting
 * both on every `/` request makes the homepage deterministic and NON-STICKY: a later plain `/`
 * resets to `ja`, so choosing English never becomes a persistent preference and Japanese remains the
 * default. Nothing is inferred from browser language, IP, device or geography, and no query
 * parameter other than `lang` on the exact path `/` is interpreted.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const locale =
    pathname === "/"
      ? searchParams.get("lang") === "en"
        ? "en"
        : "ja"
      : pathname.startsWith("/en")
        ? "en"
        : "ja";
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
