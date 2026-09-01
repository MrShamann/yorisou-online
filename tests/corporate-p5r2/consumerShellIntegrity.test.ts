import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import test from "node:test";

import {
  CONSUMER_ROUTES,
  CORPORATE_BLOCKED,
  CORPORATE_INDEXABLE,
  isKnownPageRoute,
  shellOwner,
} from "../../lib/corporate/routePolicy";

/**
 * CORP-v1.3.1 — every consumer page must actually get the consumer shell.
 *
 * WHAT THIS CATCHES, AND WHY THE EXISTING TESTS DID NOT.
 *
 * `classify()` resolves a path through the prefix-tolerant NAMESPACES table, so `/today` counted as
 * a consumer namespace for CRAWL policy the moment the namespace existed. `isKnownPageRoute()` —
 * which is what `shellOwner()` gates on — tests `CONSUMER_ROUTES.includes(p)`, an EXACT match. So a
 * page added at a bare namespace parent (`/today`, and `/line` before it) was crawl-classified as
 * consumer and shell-classified as CORPORATE at the same time.
 *
 * The consequence is invisible to every existing check: nothing 404s, nothing classifies UNKNOWN,
 * no listed route is stale. The page simply renders with no AppHeader, no SiteFooter and no mobile
 * tab bar, because `AppShell` returns bare children for anything that is not exactly `CONSUMER`.
 * The restored Today surface would have shipped that way.
 *
 * This asserts the property that actually matters — a consumer page resolves to the consumer shell
 * — rather than the proxy properties the other two tests assert.
 */

const ROOT = process.cwd();
const APP = join(ROOT, "app");

/** Every page route on disk, with the shell its own source says it renders. */
function pagesOnDisk(): { route: string; corporate: boolean }[] {
  const out: { route: string; corporate: boolean }[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir)) {
      if (e.startsWith("_") || e === "node_modules") continue;
      const f = join(dir, e);
      if (!statSync(f).isDirectory()) continue;
      walk(f);
    }
    const page = join(dir, "page.tsx");
    try {
      const src = readFileSync(page, "utf8");
      const rel = relative(APP, dir).split(sep).join("/");
      out.push({ route: rel === "" ? "/" : `/${rel}`, corporate: src.includes("_corporate/p5r2/Shell") });
    } catch {
      /* no page at this level */
    }
  };
  walk(APP);
  return out;
}

test("the scan sees the App Router, not an empty directory", () => {
  const pages = pagesOnDisk();
  assert.ok(pages.length > 100, `only ${pages.length} pages found — the scan is blind`);
  assert.ok(pages.some((p) => p.route === "/"), "the root page was not found");
  assert.ok(pages.some((p) => p.route === "/today"), "the restored Today page was not found");
});

test("every consumer page on disk resolves to the CONSUMER shell", () => {
  const offences: string[] = [];
  for (const { route, corporate } of pagesOnDisk()) {
    if (corporate) continue;
    // Prototype pages are evidence surfaces and are shelled deliberately; they are not the product.
    if (route.startsWith("/prototype")) continue;
    // Dynamic segments are matched by pattern, not by literal path.
    if (route.includes("[")) continue;
    const owner = shellOwner(route);
    if (owner !== "CONSUMER") {
      offences.push(
        `${route}: shellOwner=${owner}, isKnownPageRoute=${isKnownPageRoute(route)} — this page ` +
          `renders with no consumer header, footer or tab bar`,
      );
    }
  }
  assert.deepEqual(
    offences,
    [],
    `consumer pages that would render unshelled. The usual cause is a page at a bare NAMESPACES ` +
      `parent that is not in CONSUMER_ROUTES:\n${offences.join("\n")}`,
  );
});

test("every corporate page on disk resolves to the CORPORATE shell", () => {
  const offences: string[] = [];
  for (const { route, corporate } of pagesOnDisk()) {
    if (!corporate) continue;
    if (shellOwner(route) !== "CORPORATE") offences.push(`${route}: shellOwner=${shellOwner(route)}`);
  }
  assert.deepEqual(offences, [], offences.join("\n"));
});

test("the restored Today surface is consumer-owned and stays out of the corporate lists", () => {
  assert.equal(shellOwner("/today"), "CONSUMER");
  assert.ok(CONSUMER_ROUTES.includes("/today"), "/today must be a listed consumer route");
  assert.ok(!CORPORATE_INDEXABLE.includes("/today"), "/today must never become a corporate route");
  assert.ok(!CORPORATE_BLOCKED.includes("/today"), "/today is consumer, not a blocked corporate route");
  for (const child of ["/today/check-in", "/today/discovery"]) {
    assert.equal(shellOwner(child), "CONSUMER", child);
  }
});

/**
 * The apex cutover's sharpest edge: `/` stopped being the consumer home and became the company.
 * A consumer surface that still links to `"/"` sends someone mid-flow to the corporate front page.
 * Nothing 404s, so no route test can see it — only this can.
 */
test("no consumer component links to the corporate apex as if it were the product home", () => {
  const offences: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir)) {
      const f = join(dir, e);
      if (statSync(f).isDirectory()) {
        if (["_corporate", "prototype", "_notFound"].includes(e)) continue;
        walk(f);
        continue;
      }
      if (!e.endsWith(".tsx")) continue;
      const src = readFileSync(f, "utf8");
      if (src.includes('href="/"')) offences.push(relative(ROOT, f));
    }
  };
  walk(APP);
  assert.deepEqual(
    offences,
    [],
    `these consumer files link to "/", which is now the YORISOU company site. Use CONSUMER_HOME ` +
      `from lib/consumerHome.ts:\n${offences.join("\n")}`,
  );
});
