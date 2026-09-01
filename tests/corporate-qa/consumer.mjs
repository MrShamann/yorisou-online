/**
 * Consumer regression. The corporate package must not change the live product's surface.
 * Checked by fetching, not by reasoning about imports.
 */
const BASE = process.env.BASE ?? "http://localhost:3111";
/**
 * [path, expected html lang, expects the shared consumer header]
 *
 * `/tests/ima-iro` is the 120-question flow. It deliberately renders with no site header — a
 * focused test surface with its own metadata — so requiring one there was a defect in this check,
 * not in the page.
 */
const CASES = [
  ["/en", "en", true],
  ["/en/about", "en", true],
  ["/notice", "ja", true],
  ["/tests", "ja", true],
  ["/tests/ima-iro", "ja", false],
  /*
   * CORP-v1.3.1 — the restored consumer home.
   *
   * The apex cutover moved the company to "/", so Today lives at /today. This is the case that would
   * have caught the shell defect: before "/today" was added to CONSUMER_ROUTES, shellOwner("/today")
   * returned CORPORATE and the page rendered with no header, footer or tab bar while every route
   * test stayed green.
   */
  ["/today", "ja", true],
  ["/legal", "ja", true],
  ["/privacy", "ja", true],
];
let ok = 0; const bad = [];
for (const [path, lang, expectChrome] of CASES) {
  const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const html = await res.text();
  const gotLang = html.match(/<html[^>]*lang="([^"]*)"/)?.[1];
  // The consumer shell must still own these pages: the corporate p5r2 shell must not be RENDERED.
  //
  // The RSC flight payload is stripped first. An earlier version of this check read the whole
  // response and reported all seven consumer routes as corporate-shelled — it was matching the
  // serialised not-found subtree inside `self.__next_f.push(...)`, which is data the client may
  // never render, not markup on the page. Measured directly: /en renders the consumer header and
  // footer and contains zero corporate shell classes outside the payload.
  const rendered = html.replace(/self\.__next_f\.push\([\s\S]*?\)<\/script>/g, "");
  const corporateShell = /site-module__[A-Za-z0-9]+__root/.test(rendered);
  const consumerChrome = /<header[^>]*sticky/.test(rendered);
  const problems = [];
  if (res.status !== 200) problems.push(`status ${res.status}`);
  if (gotLang !== lang) problems.push(`lang ${gotLang} (expected ${lang})`);
  if (corporateShell) problems.push("corporate shell mounted on a consumer route");
  if (expectChrome && !consumerChrome) problems.push("consumer chrome missing");
  if (!expectChrome && consumerChrome) problems.push("unexpected consumer chrome on a focused flow");
  if (problems.length) bad.push(`${path}: ${problems.join(" | ")}`); else ok++;
}
console.log(`consumer regression ${ok}/${CASES.length}`);
if (bad.length) { console.log(bad.join("\n")); process.exit(1); }
