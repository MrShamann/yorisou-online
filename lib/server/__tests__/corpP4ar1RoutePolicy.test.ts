import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  CORPORATE_BLOCKED,
  CORPORATE_INDEXABLE,
  CONSUMER_ROUTES,
  classify,
  isCrawlAllowed,
  isSitemapEligible,
  shellOwner,
} from "@/lib/corporate/routePolicy";

/**
 * CORP-P4AR1 — deterministic policy tests.
 *
 * Every assertion here fails against 9f0e8ff, where shell ownership was a pathname allowlist and the
 * robots list named roughly twenty of 135 page routes. These pin the two properties that CORP-P4A
 * got wrong: an UNKNOWN path must belong to the corporate shell, and a route omitted from every list
 * must be blocked rather than exposed.
 */

// ── the defect that produced the double-shell 404 ────────────────────────────

test("an unknown path belongs to the corporate shell, never the consumer shell", () => {
  for (const p of [
    "/an-entirely-unknown-path",
    "/nope",
    "/a/b/c/d",
    "/tests-not-a-real-route",
    "/company-x",
  ]) {
    assert.equal(classify(p), "UNKNOWN", p);
    assert.equal(shellOwner(p), "CORPORATE", p);
  }
});

test("unknown paths fail safe: excluded from the sitemap and not indexable", () => {
  for (const p of ["/an-entirely-unknown-path", "/whatever", "/x/y"]) {
    assert.equal(isSitemapEligible(p), false, p);
    assert.equal(isCrawlAllowed(p), false, p);
  }
});

test("null and empty pathnames resolve to the corporate shell", () => {
  assert.equal(shellOwner(null), "CORPORATE");
  assert.equal(shellOwner(undefined), "CORPORATE");
  assert.equal(shellOwner(""), "CORPORATE");
});

// ── known consumer routes keep their shell ───────────────────────────────────

test("retained consumer routes are still owned by the consumer shell", () => {
  for (const p of [
    "/me",
    "/tests",
    "/result",
    "/saved",
    "/login",
    "/check-in",
    "/recommendations",
    "/reports/sample",
    "/notice",
    "/explore",
  ]) {
    assert.equal(shellOwner(p), "CONSUMER", p);
  }
});

// ── exact vs descendant must share one policy ────────────────────────────────

test("exact and descendant forms of a legacy path share the same policy", () => {
  const pairs: [string, string][] = [
    ["/tests", "/tests/c02"],
    ["/line", "/line/mini-app"],
    ["/share", "/share/example"],
    ["/reports", "/reports/sample"],
    ["/admin", "/admin/users"],
    ["/prototype", "/prototype/corporate"],
  ];
  for (const [exact, child] of pairs) {
    // CRAWL policy must be identical across the namespace.
    assert.equal(classify(exact), classify(child), `${exact} vs ${child}`);
    assert.equal(isCrawlAllowed(exact), false, exact);
    assert.equal(isCrawlAllowed(child), false, child);
    assert.equal(isSitemapEligible(exact), false, exact);
    assert.equal(isSitemapEligible(child), false, child);
  }
});

test("an unknown child of a consumer namespace still gets the corporate shell", () => {
  // The deeper form of the double-shell defect: /tests exists, /tests/nonexistent does not. If shell
  // ownership followed the namespace, the consumer chrome would wrap the corporate 404 one level
  // down. Crawl policy stays namespace-wide; shell ownership follows the resolved route.
  for (const p of ["/tests/nonexistent", "/line/nope", "/reports/not-real", "/me/xyz"]) {
    assert.equal(shellOwner(p), "CORPORATE", p);
    assert.equal(isCrawlAllowed(p), false, p);
  }
  // ...while the real pages keep their consumer shell.
  assert.equal(shellOwner("/tests"), "CONSUMER");
  assert.equal(shellOwner("/line/mini-app"), "CONSUMER");
  assert.equal(shellOwner("/reports/sample"), "CONSUMER");
});

test("a trailing slash never changes the outcome", () => {
  for (const p of ["/tests", "/line", "/about", "/company"]) {
    assert.equal(classify(p), classify(`${p}/`), p);
  }
});

// ── indexability is closed by default ────────────────────────────────────────

test("exactly four routes are indexable, and root is one of them", () => {
  assert.deepEqual([...CORPORATE_INDEXABLE], ["/", "/mirai-move", "/kakari", "/about"]);
  for (const p of CORPORATE_INDEXABLE) assert.equal(isCrawlAllowed(p), true, p);
  assert.equal(isCrawlAllowed("/"), true);
});

test("blocked corporate routes are never indexable or sitemap-eligible", () => {
  for (const p of CORPORATE_BLOCKED) {
    assert.equal(classify(p), "CORPORATE_CRAWL_BLOCKED", p);
    assert.equal(isCrawlAllowed(p), false, p);
    assert.equal(isSitemapEligible(p), false, p);
  }
});

test("allowing root does not make unmatched routes indexable", () => {
  // The CORP-P4A robots candidate used `Allow: /`, which reads as a prefix for the whole tree.
  for (const p of ["/ai-advisor", "/business", "/en", "/insights", "/privacy", "/terms", "/vision"]) {
    assert.equal(isCrawlAllowed(p), false, p);
    assert.equal(isSitemapEligible(p), false, p);
  }
});

test("legacy public routes CORP-P4A omitted are classified and blocked", () => {
  // These are the routes the previous Disallow list silently left crawlable.
  const omitted = [
    "/ai-advisor",
    "/business",
    "/concept",
    "/connect",
    "/en",
    "/experiences",
    "/explore",
    "/formal-check",
    "/insights",
    "/legal",
    "/methodology",
    "/notice",
    "/online-check-in",
    "/open-testing",
    "/partners",
    "/pilot",
    "/privacy",
    "/product",
    "/products",
    "/progress",
    "/recommendations",
    "/report-loading",
    "/report-preview",
    "/reservation-mobility-support",
    "/services",
    "/support",
    "/terms",
    "/vision",
  ];
  for (const p of omitted) {
    assert.notEqual(classify(p), "UNKNOWN", `${p} must be classified, not unknown`);
    assert.equal(isCrawlAllowed(p), false, p);
    assert.equal(isSitemapEligible(p), false, p);
  }
});

test("api routes are non-page and own no shell", () => {
  for (const p of ["/api", "/api/build-identity", "/api/life/consent"]) {
    assert.equal(classify(p), "API_NON_PAGE", p);
    assert.equal(shellOwner(p), "NONE", p);
    assert.equal(isSitemapEligible(p), false, p);
  }
});

test("dynamic routes inherit their parent classification", () => {
  assert.equal(classify("/admin/users/anything"), "ADMIN_INTERNAL_CRAWL_BLOCKED");
  assert.equal(classify("/connect/invite/abc123"), "PERSONAL_OR_AUTH_CRAWL_BLOCKED");
  assert.equal(classify("/reports/self-understanding/xyz"), "PERSONAL_OR_AUTH_CRAWL_BLOCKED");
});

// ── the census must stay honest ──────────────────────────────────────────────

test("CONSUMER_ROUTES matches the App Router filesystem", () => {
  // The route table is derived, not remembered. If someone adds a page and forgets the policy, this
  // fails — which is the only thing standing between a new route and silent exposure.
  const root = path.join(process.cwd(), "app");
  const found: string[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        if (["__tests__", "components", "lib", "data"].includes(e.name)) continue;
        walk(path.join(dir, e.name));
      } else if (/^page\.(tsx|ts|jsx)$/.test(e.name)) {
        const rel = path.relative(root, dir);
        const seg = rel === "" ? [] : rel.split(path.sep).filter((s) => !s.startsWith("("));
        found.push("/" + seg.join("/") === "/" ? "/" : "/" + seg.join("/"));
      }
    }
  };
  walk(root);

  const unclassified = found.filter((r) => classify(r) === "UNKNOWN");
  assert.deepEqual(unclassified, [], `every page route must be classified; unclassified: ${unclassified}`);

  const stale = CONSUMER_ROUTES.filter((r) => !found.includes(r));
  assert.deepEqual([...stale], [], `CONSUMER_ROUTES lists routes that no longer exist: ${stale}`);
});

test("no route is both indexable and consumer-owned", () => {
  for (const p of CORPORATE_INDEXABLE) {
    assert.equal(shellOwner(p), "CORPORATE", p);
  }
  for (const p of CONSUMER_ROUTES) {
    assert.equal(isCrawlAllowed(p), false, p);
    assert.equal(isSitemapEligible(p), false, p);
  }
});
