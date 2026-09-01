/**
 * CORP-v1.4 — the multilingual requirements, measured in a real browser.
 *
 * The defect this exists for was invisible to every other gate: the site rendered all 21 locales
 * perfectly and the route sweep passed 189/189, because a sweep requests locales by URL. What was
 * broken was the only control a visitor actually has — the selector — and it had no test at all.
 */
import { chromium } from "playwright";
import { LOCALES, url } from "./routes.mjs";

const BASE = process.env.BASE ?? "http://localhost:3111";
const fails = [];
const b = await chromium.launch();

// ── 1. the selector offers every locale, and switching keeps the page ────────────────────────
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/ventures`, { waitUntil: "load" });
  await p.click("[aria-haspopup='dialog']");
  await p.waitForSelector("[role='dialog']");
  const offered = await p.$$eval("[role='dialog'] a[hreflang]", (as) =>
    as.map((a) => ({ code: a.getAttribute("hreflang"), href: a.getAttribute("href"), text: a.textContent.trim(), dir: a.getAttribute("dir") })));
  console.log(`selector offers ${offered.length} locales`);
  if (offered.length !== 21) fails.push(`selector offers ${offered.length}, expected 21`);

  const missing = LOCALES.filter((c) => !offered.some((o) => o.code === c));
  if (missing.length) fails.push(`selector is missing: ${missing.join(", ")}`);

  // Every option must return to /ventures, not to the home page.
  const strays = offered.filter((o) => !o.href.startsWith("/ventures"));
  if (strays.length) fails.push(`switching language leaves the page: ${strays.map((s) => `${s.code}->${s.href}`).join(", ")}`);

  const ar = offered.find((o) => o.code === "ar");
  if (ar?.dir !== "rtl") fails.push(`Arabic option is not marked rtl (got ${ar?.dir})`);

  // Search must work for someone who cannot read Japanese.
  await p.fill("[role='dialog'] input[type='search']", "한국");
  const found = await p.$$eval("[role='dialog'] a[hreflang]", (as) => as.map((a) => a.getAttribute("hreflang")));
  if (!found.includes("ko")) fails.push(`searching a native name did not find it (got ${found.join(",")})`);
  console.log(`search "한국" -> ${found.join(",")}`);
  await ctx.close();
}

// ── 2. every locale actually renders the CURRENT corporate site ──────────────────────────────
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  let ok = 0;
  for (const code of LOCALES) {
    await p.goto(url("/", code), { waitUntil: "load" });
    const seen = await p.evaluate(() => ({
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      // the v1.4 sections must exist in every language
      portfolio: !!document.querySelector("#portfolio"),
      // the venture marks are the v1.3.1 brand system, which must survive
      marks: document.querySelectorAll("[class*='__ventureMark']").length,
      canonical: document.querySelector("link[rel=canonical]")?.getAttribute("href") ?? "",
      // a historical surface would carry the retired consumer thesis
      retired: document.body.innerText.includes("次のよりそい"),
    }));
    const problems = [];
    if (seen.lang !== code) problems.push(`lang=${seen.lang}`);
    if (seen.dir !== (code === "ar" ? "rtl" : "ltr")) problems.push(`dir=${seen.dir}`);
    if (!seen.portfolio) problems.push("no portfolio section");
    if (seen.marks < 3) problems.push(`${seen.marks} venture marks`);
    // Next.js resolves the root path against metadataBase without a trailing slash. Either form is
    // the same URL; what matters is that it carries no ?lang= and points at the clean path.
    if (!/^https:\/\/yorisou\.online\/?$/.test(seen.canonical)) problems.push(`canonical=${seen.canonical}`);
    if (seen.retired) problems.push("retired consumer thesis present");
    if (problems.length) fails.push(`${code}: ${problems.join(" | ")}`); else ok++;
  }
  console.log(`locales serving the current corporate site: ${ok}/${LOCALES.length}`);
  await ctx.close();
}

// ── 3. no historical language surface is presented as the corporate site ─────────────────────
{
  const res = await fetch(`${BASE}/en`, { redirect: "follow" });
  const html = await res.text();
  const noindex = /<meta name="robots"[^>]*noindex/i.test(html);
  const corporateShell = /site-module__[A-Za-z0-9]+__root/.test(
    html.replace(/self\.__next_f\.push\([\s\S]*?\)<\/script>/g, ""),
  );
  console.log(`/en -> ${res.status} noindex=${noindex} corporate-shell=${corporateShell}`);
  if (!noindex) fails.push("/en (archived consumer product) is not noindex");
  if (corporateShell) fails.push("/en renders the corporate shell");
}

await b.close();
console.log(fails.length ? `\nFAILURES:\n${fails.join("\n")}` : "\nALL LOCALE ACCESS CHECKS PASS");
if (fails.length) process.exit(1);
