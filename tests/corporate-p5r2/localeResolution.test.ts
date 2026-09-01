import assert from "node:assert/strict";
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { CORPORATE_BLOCKED, CORPORATE_INDEXABLE } from "../../lib/corporate/routePolicy";

/**
 * CORP-v1.3 — every corporate route must resolve its own locale.
 *
 * WHAT WENT WRONG. `proxy.ts` held a hand-written set of the six corporate paths that existed when
 * it was written. CORP-v1.2 added `/ventures`, `/chigamo` and `/build-with-us` and did not add them
 * to it. Those three routes then served correctly translated BODIES inside
 * `<html lang="ja" dir="ltr" data-script="Jpan">` for all twenty non-Japanese locales — sixty pages
 * on which an Arabic reader received Arabic text in a document declared Japanese and laid out
 * left-to-right. Nothing failed; the page looked translated.
 *
 * The list is now derived from the route policy, and these tests assert the derivation holds and
 * that the policy itself still matches the App Router filesystem. A future corporate route is
 * locale-resolved by construction.
 */

const ROOT = process.cwd();
const CORPORATE = [...CORPORATE_INDEXABLE, ...CORPORATE_BLOCKED];

/** Which App Router page directories render the corporate shell. Read, not remembered. */
function corporatePagesOnDisk(): string[] {
  const found: string[] = [];
  const appDir = join(ROOT, "app");
  for (const e of readdirSync(appDir)) {
    const dir = join(appDir, e);
    if (e.startsWith("_") || e.startsWith("(") || e.startsWith("[")) continue;
    if (!statSync(dir).isDirectory()) continue;
    const page = join(dir, "page.tsx");
    try {
      const src = readFileSync(page, "utf8");
      if (src.includes("_corporate/p5r2/Shell")) found.push(`/${e}`);
    } catch {
      /* no page file at this level */
    }
  }
  const root = readFileSync(join(appDir, "page.tsx"), "utf8");
  if (root.includes("_corporate/p5r2/Shell")) found.unshift("/");
  return found.sort();
}

test("proxy.ts no longer keeps its own list of corporate paths", () => {
  const src = readFileSync(join(ROOT, "proxy.ts"), "utf8");
  const decl = src.match(/const CORPORATE_PATHS = new Set<string>\(\[([^\]]*)\]\)/);
  assert.ok(decl, "CORPORATE_PATHS is no longer a Set derived from the route policy");
  assert.ok(
    decl[1].includes("CORPORATE_INDEXABLE") && decl[1].includes("CORPORATE_BLOCKED"),
    "CORPORATE_PATHS must be spread from the route policy, not written out again. A second list " +
      "is what caused three routes to lose their locale for a whole release.",
  );
  assert.ok(
    !/CORPORATE_PATHS = new Set\(\[\s*"/.test(src),
    "a hardcoded path literal is back in the proxy's corporate set",
  );
});

test("every corporate page on disk is in the route policy", () => {
  const onDisk = corporatePagesOnDisk();
  assert.ok(onDisk.length >= 9, `only found ${onDisk.length} corporate pages — the scan is blind`);
  const missing = onDisk.filter((r) => !CORPORATE.includes(r));
  assert.deepEqual(
    missing,
    [],
    `these corporate pages are in no policy list, so the proxy will not resolve their locale and ` +
      `robots.txt has no opinion about them: ${missing.join(", ")}`,
  );
});

test("the route policy lists no corporate route that does not exist", () => {
  const onDisk = corporatePagesOnDisk();
  const stale = CORPORATE.filter((r) => !onDisk.includes(r));
  assert.deepEqual(stale, [], `policy names routes with no corporate page: ${stale.join(", ")}`);
});
