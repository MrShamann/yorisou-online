// Every corporate route x every published locale, as the site actually serves them.
export const ROUTES = ["/", "/ventures", "/mirai-move", "/kakari", "/chigamo", "/about", "/build-with-us", "/company", "/contact"];
export const LOCALES = ["ja","en","ar","de","es","fr","hi","id","it","ko","ms","nl","pl","pt","ru","th","tr","uk","vi","zh-CN","zh-TW"];
export const BASE = process.env.BASE ?? "http://localhost:3111";
export function url(route, locale) {
  return locale === "ja" ? `${BASE}${route}` : `${BASE}${route}?lang=${encodeURIComponent(locale)}`;
}
