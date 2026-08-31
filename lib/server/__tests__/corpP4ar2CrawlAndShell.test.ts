import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  isCrawlable,
  parseRobots,
  ruleMatches,
  serialiseRobots,
} from "@/lib/corporate/robotsTxt";
import {
  CORPORATE_BLOCKED,
  CORPORATE_INDEXABLE,
  CONSUMER_ROUTES,
  classify,
  crawlDisposition,
  isCrawlAllowed,
  isSitemapEligible,
  routeLifecycle,
  shellOwner,
  sitemapDisposition,
} from "@/lib/corporate/routePolicy";

/**
 * CORP-P4AR2 — deterministic tests for the three defects CORP-P4AR1 left open.
 *
 * Every test here fails against 29fce73. The robots tests fail because three of four Allow rules
 * were unanchored there; the shell tests fail because `app/global-not-found.tsx` did not exist; the
 * vocabulary tests fail because the groups were named `*_NOINDEX` and `crawlDisposition`,
 * `sitemapDisposition` and `routeLifecycle` were not exported.
 *
 * They are written against the SERIALISED robots.txt rather than against `isCrawlAllowed()`. A test
 * that asks the policy module whether a path is allowed will agree with the policy module whatever
 * the rules say — which is precisely why CORP-P4AR1's suite passed while `/mirai-move-old` was
 * crawlable.
 */

const RULES = parseRobots(serialiseRobots(robots() as never));
const ROOT = process.cwd();

// ── 1-6: the unanchored-Allow leak ───────────────────────────────────────────

test("1. every Allow rule in the rendered robots.txt is anchored with $", () => {
  const allows = RULES.filter((r) => r.type === "allow");
  // CORP-v1.3: derived from the policy, not a magic number. The EXACT crawlable list is pinned once,
  // in corpP4ar1RoutePolicy.test.ts — duplicating the count here only made both go stale together
  // while proving nothing extra. What this test is actually for is the anchoring, below.
  assert.equal(allows.length, CORPORATE_INDEXABLE.length, "one Allow rule per indexable route");
  const unanchored = allows.filter((r) => !r.path.endsWith("$")).map((r) => r.path);
  assert.deepEqual(unanchored, [], `unanchored Allow rules re-open a whole subtree: ${unanchored}`);
});

test("2. every indexable corporate route is crawlable", () => {
  for (const p of CORPORATE_INDEXABLE) {
    assert.equal(isCrawlable(RULES, p), true, `${p} must be crawlable`);
  }
});

test("3. sibling paths that merely SHARE A PREFIX with an allowed route are blocked", () => {
  // The exact defect: `Allow: /mirai-move` (no $) is a prefix rule, and at 12 characters it beats
  // the 1-character `Disallow: /`, so all of these were crawlable at 29fce73.
  for (const p of [
    "/mirai-move-old",
    "/mirai-move-2",
    "/mirai-movement",
    "/kakari-preview",
    "/kakari-internal",
    "/about-old",
    "/about-us-draft",
  ]) {
    assert.equal(isCrawlable(RULES, p), false, `${p} must NOT be crawlable`);
  }
});

test("4. descendants of an allowed route are blocked", () => {
  for (const p of [
    "/mirai-move/anything",
    "/mirai-move/draft/internal",
    "/kakari/pricing",
    "/about/team",
    "/about/team/founder",
  ]) {
    assert.equal(isCrawlable(RULES, p), false, `${p} must NOT be crawlable`);
  }
});

test("5. allowing the root does not allow the tree beneath it", () => {
  assert.equal(isCrawlable(RULES, "/"), true);
  for (const p of ["/me", "/login", "/tests", "/admin", "/api/health", "/anything-at-all"]) {
    assert.equal(isCrawlable(RULES, p), false, p);
  }
});

test("6. default-deny: a path in no list at all is blocked", () => {
  for (const p of ["/an-entirely-unknown-path", "/x/y/z", "/future-route", "/2026-campaign"]) {
    assert.equal(isCrawlable(RULES, p), false, p);
  }
});

// ── 7-9: the matcher itself is not vacuous ───────────────────────────────────

test("7. the matcher implements prefix, anchor and wildcard semantics", () => {
  // Unanchored is a prefix rule...
  assert.equal(ruleMatches("/mirai-move", "/mirai-move-old"), true);
  assert.equal(ruleMatches("/mirai-move", "/mirai-move/x"), true);
  // ...anchored is not.
  assert.equal(ruleMatches("/mirai-move$", "/mirai-move-old"), false);
  assert.equal(ruleMatches("/mirai-move$", "/mirai-move/x"), false);
  assert.equal(ruleMatches("/mirai-move$", "/mirai-move"), true);
  // `*` spans separators.
  assert.equal(ruleMatches("/a*d", "/abc/d"), true);
});

test("8. most-specific-rule-wins, with Allow winning an exact tie", () => {
  const rules = parseRobots("User-agent: *\nDisallow: /\nAllow: /x/y\n");
  assert.equal(isCrawlable(rules, "/x/y"), true, "longer Allow beats shorter Disallow");
  assert.equal(isCrawlable(rules, "/x"), false, "shorter path falls to Disallow");
  const tie = parseRobots("User-agent: *\nDisallow: /a\nAllow: /a\n");
  assert.equal(isCrawlable(tie, "/a"), true, "equal length ties resolve to Allow");
});

test("9. the parser reproduces the unanchored 29fce73 rules and shows them leaking", () => {
  // A direct regression witness: this IS the old rule set, and it demonstrably allowed the sibling.
  const old = parseRobots(
    "User-Agent: *\nAllow: /$\nAllow: /mirai-move\nAllow: /kakari\nAllow: /about\nDisallow: /\n",
  );
  assert.equal(isCrawlable(old, "/mirai-move-old"), true, "the old rules leaked; that is the defect");
  assert.equal(isCrawlable(old, "/about-old"), true);
  // ...and the current rules close it.
  assert.equal(isCrawlable(RULES, "/mirai-move-old"), false);
  assert.equal(isCrawlable(RULES, "/about-old"), false);
});

// ── 10-11: robots and sitemap cannot disagree ────────────────────────────────

test("10. every sitemap URL is crawlable, and nothing else is", () => {
  const urls = sitemap().map((e) => new URL(e.url).pathname);
  assert.equal(urls.length, CORPORATE_INDEXABLE.length);
  for (const p of urls) assert.equal(isCrawlable(RULES, p), true, `${p} is in the sitemap`);
  const crawlableConsumer = CONSUMER_ROUTES.filter((r) => isCrawlable(RULES, r));
  assert.deepEqual(crawlableConsumer, [], `consumer routes must not be crawlable: ${crawlableConsumer}`);
});

test("11. corporate routes blocked pending source are crawl-blocked and out of the sitemap", () => {
  for (const p of CORPORATE_BLOCKED) {
    assert.equal(isCrawlable(RULES, p), false, p);
    assert.equal(isSitemapEligible(p), false, p);
    assert.equal(routeLifecycle(p), "CORPORATE_BLOCKED_PENDING_SOURCE", p);
  }
});

// ── 12-14: 404 isolation is structural, not a pathname judgement ─────────────

test("12. the 404 renders as its own document, outside the root layout", () => {
  const gnf = path.join(ROOT, "app/global-not-found.tsx");
  assert.ok(fs.existsSync(gnf), "app/global-not-found.tsx must exist");
  const src = fs.readFileSync(gnf, "utf8");
  assert.match(src, /<html\b/, "it must own <html>");
  assert.match(src, /<body\b/, "it must own <body>");
});

test("12b. both 404 entry points render ONE shared body", () => {
  // Two entry points exist because Next.js uses two: the global document for the normal path, and
  // `not-found.tsx` for the internal-error path that dynamically rendered routes take. Measured:
  // dropping the second one made those routes serve the ROOT layout's consumer marketing title on a
  // 404. What must never happen is the two saying different things, so both are required to
  // delegate to the same component and to define no 404 markup of their own.
  const shared = path.join(ROOT, "app/_notFound/NotFoundBody.tsx");
  assert.ok(fs.existsSync(shared), "the shared 404 body must exist");
  for (const f of ["app/global-not-found.tsx", "app/not-found.tsx"]) {
    const raw = fs.readFileSync(path.join(ROOT, f), "utf8");
    const code = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    assert.match(code, /<NotFoundBody \/>/, `${f} must render the shared body`);
    assert.ok(!code.includes("CorporateShell"), `${f} must not restate the 404 markup`);
    assert.ok(!/<h1/.test(code), `${f} must not define its own heading`);
  }
  // Both must claim the same title, from the same constant.
  for (const f of ["app/global-not-found.tsx", "app/not-found.tsx"]) {
    assert.match(fs.readFileSync(path.join(ROOT, f), "utf8"), /title: NOT_FOUND_TITLE/, f);
  }
});

test("13. the 404 document cannot import the consumer shell", () => {
  const raw = ["app/global-not-found.tsx", "app/not-found.tsx", "app/_notFound/NotFoundBody.tsx"]
    .map((f) => fs.readFileSync(path.join(ROOT, f), "utf8"))
    .join("\n");
  // Strip comments first. The rationale comment NAMES AppShell in order to explain why the 404 is
  // no longer wrapped by it, and a check that cannot tell prose from code would forbid saying so.
  const code = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  for (const banned of ["AppShell", "AppHeader", "MobileBottomNav", "SiteFooter"]) {
    assert.ok(!code.includes(banned), `the 404 document must not reference ${banned} in code`);
  }
  // CORP-v1.3: the 404 moved OFF the frozen `prototype/corporate` shell and onto the live one, so
  // it stops presenting a company from two refoundations ago. The protection is unchanged — a
  // corporate shell must still be imported and rendered, and the consumer chrome above stays
  // banned; only the name of the corporate shell is different.
  assert.match(code, /import Shell(?:,| ).*p5r2\/Shell/, "the shared body imports the live corporate shell");
  assert.match(code, /<Shell\b/, "it renders the live corporate shell");
  assert.ok(
    !code.includes("prototype/corporate"),
    "the 404 is back on the frozen prototype shell, which shows a retired identity",
  );
  // And the check must be capable of failing: the stripper must not have eaten the whole file.
  assert.ok(code.includes("GlobalNotFound"), "comment stripping removed real code");
});

test("14. the framework flag that makes global-not-found active is enabled", () => {
  const cfg = fs.readFileSync(path.join(ROOT, "next.config.ts"), "utf8");
  assert.match(
    cfg,
    /experimental:\s*\{[^}]*globalNotFound:\s*true/,
    "global-not-found is inert without experimental.globalNotFound",
  );
});

// ── 15-18: the vocabulary tells the truth ────────────────────────────────────

test("15. no route group claims to be a noindex directive", () => {
  const src = fs.readFileSync(path.join(ROOT, "lib/corporate/routePolicy.ts"), "utf8");
  const groups = [...src.matchAll(/\|\s*"([A-Z_]+)"/g)].map((m) => m[1]);
  assert.ok(groups.length > 5, "expected to find the RouteGroup union");
  const lying = groups.filter((g) => g.endsWith("_NOINDEX"));
  assert.deepEqual(
    lying,
    [],
    `robots.txt controls crawling, not indexing; these names claim otherwise: ${lying}`,
  );
});

test("16. crawl, sitemap, shell and lifecycle are four separate answers", () => {
  // /company: crawl-blocked, out of the sitemap, corporate-shelled, and NOT retired. If these were
  // one axis, a single value would have to carry all four, which is what `*_NOINDEX` implied.
  assert.equal(crawlDisposition("/company"), "CRAWL_BLOCKED");
  assert.equal(sitemapDisposition("/company"), "EXCLUDED_FROM_SITEMAP");
  assert.equal(shellOwner("/company"), "CORPORATE");
  assert.equal(routeLifecycle("/company"), "CORPORATE_BLOCKED_PENDING_SOURCE");
  // /tests: crawl-blocked but very much still a live consumer route.
  assert.equal(crawlDisposition("/tests"), "CRAWL_BLOCKED");
  assert.equal(shellOwner("/tests"), "CONSUMER");
  assert.equal(routeLifecycle("/tests"), "CONSUMER_RETAINED");
  // /api: crawl-blocked, owns no shell at all, and is not a page.
  assert.equal(shellOwner("/api/health"), "NONE");
  assert.equal(routeLifecycle("/api/health"), "NON_PAGE");
});

test("17. crawl disposition and the rendered rules agree on every known route", () => {
  const all = [...CORPORATE_INDEXABLE, ...CORPORATE_BLOCKED, ...CONSUMER_ROUTES];
  const disagree = all.filter((p) => isCrawlAllowed(p) !== isCrawlable(RULES, p));
  assert.deepEqual(disagree, [], `policy and robots.txt disagree on: ${disagree}`);
});

test("18. the policy module exports no function claiming to know rendered index directives", () => {
  const src = fs.readFileSync(path.join(ROOT, "lib/corporate/routePolicy.ts"), "utf8");
  const exported = [...src.matchAll(/export function (\w+)/g)].map((m) => m[1]);
  const overclaiming = exported.filter((n) => /^is(Indexable|Noindex)$|Indexab/.test(n));
    assert.deepEqual(
    overclaiming,
    [],
    `a rendered index directive must be measured, not derived from a pathname: ${overclaiming}`,
  );
  assert.ok(exported.includes("crawlDisposition"));
  assert.ok(exported.includes("sitemapDisposition"));
  assert.ok(exported.includes("routeLifecycle"));
});

test("19. classification is still total: no page route is UNKNOWN", () => {
  const appRoot = path.join(ROOT, "app");
  const found: string[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (["__tests__", "components", "lib", "data"].includes(e.name)) continue;
        walk(path.join(dir, e.name));
      } else if (/^page\.(tsx|ts|jsx)$/.test(e.name)) {
        const rel = path.relative(appRoot, dir);
        const seg = rel === "" ? [] : rel.split(path.sep).filter((s) => !s.startsWith("("));
        found.push("/" + seg.join("/") === "/" ? "/" : "/" + seg.join("/"));
      }
    }
  };
  walk(appRoot);
  const unclassified = found.filter((r) => classify(r) === "UNKNOWN");
  assert.deepEqual(unclassified, [], `unclassified: ${unclassified}`);
  assert.ok(found.length >= 130, `expected ~135 page routes, found ${found.length}`);
});
