/**
 * CORP-v1.3.1 — where the consumer product's "home" is, now that `/` is the company.
 *
 * The apex cutover makes `yorisou.online/` the YORISOU corporate site. Every consumer surface that
 * linked to `"/"` meaning *the product home* would otherwise send a person mid-flow to the company's
 * front page: the mobile tab bar's first tab is literally labelled 今日, the app header's logo is
 * `aria-label="YORISOU ホーム"`, and several test flows and reports offer ホームへ戻る.
 *
 * That is the sharpest edge of this release, and it is not something a route policy can catch —
 * both `/` and `/today` resolve, so nothing 404s. It just silently lands the wrong audience on the
 * wrong site. So the destination lives in ONE constant, every consumer home link reads it, and
 * `tests/corporate-p5r2/consumerShellIntegrity.test.ts` fails if a literal `href="/"` comes back
 * into a consumer component, and `app/__tests__/pxr1RouteContract.test.ts` pins that the 今日 tab
 * reads this constant rather than any literal.
 *
 * Corporate surfaces are unaffected: they link to `/` because `/` genuinely is their home.
 */
export const CONSUMER_HOME = "/today";
