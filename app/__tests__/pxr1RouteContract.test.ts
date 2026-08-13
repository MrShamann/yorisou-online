// PXR-1 — the route contract.
//
// `/check-in` has already meant two different products in this codebase's life: a short current-state
// interaction, and then the 120-question いま色テスト. That drift is the defect these tests exist to
// stop repeating.
//
// The rule being pinned: a route that keeps returning 200 while showing a DIFFERENT product is still
// a compatibility break — arguably worse than a 404, because nothing tells the person that what they
// saved is gone. Every shared link, saved link and LINE return pointing at `/check-in` was created
// with the 120Q in mind, so `/check-in` must keep delivering the 120Q.
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APP = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string) => readFileSync(join(APP, p), "utf8");
const code = (p: string) => read(p).replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");

test("legacy /check-in redirects to the 120Q, preserving the semantic contract", async () => {
  const legacy = code("check-in/page.tsx");
  assert.match(legacy, /redirect\(/, "it must redirect, not render something else");
  assert.ok(
    !legacy.includes("/today/check-in"),
    "the legacy route must NEVER silently become the new lightweight product",
  );

  // The destination is asserted by RESOLVING it, not by grepping for the literal path. The route
  // delegates to the shared resolver so the preserved-parameter allowlist lives next to the builder
  // that emits those parameters; a string match here would have to be relaxed to accommodate that
  // and would stop proving anything. Full compatibility coverage:
  // lib/server/__tests__/miniAppEntryRouting.test.ts
  const { resolveLegacyCheckInRedirect } = await import("../../lib/server/miniAppEntryRouting");
  assert.equal(resolveLegacyCheckInRedirect({}), "/tests/ima-iro");
  assert.match(
    resolveLegacyCheckInRedirect({ entry_source: "line-mini-app" }),
    /^\/tests\/ima-iro\?/,
    "LINE entry context must survive the redirect, not be discarded",
  );
});

test("the 120Q Deep Dive owns its own canonical route", () => {
  const page = code("tests/ima-iro/page.tsx");
  assert.match(page, /MiniTestFlow/, "the 120Q flow lives here now");
  assert.match(read("tests/ima-iro/page.tsx"), /いま色テスト/, "the approved test name is unchanged");
});

test("the lightweight interaction lives at /today/check-in and does not claim the legacy path", () => {
  const page = code("today/check-in/page.tsx");
  assert.match(read("today/check-in/page.tsx"), /今の気配を見る/);
  assert.ok(!page.includes('href="/check-in"'), "it must not link back into the legacy path");
});

test("PXR-1 invents no new assessment methodology", () => {
  const page = code("today/check-in/page.tsx");
  for (const f of ["questionBank", "scoringMaster", "assignPublicArchetype"]) {
    assert.ok(!page.includes(f), `the shell must not import scoring: ${f}`);
  }
});

test("the four consumer tabs are the locked IA, each pointing at a real route", () => {
  const nav = read("components/MobileBottomNav.tsx");
  for (const label of ["今日", "気づく", "探す", "わたし"]) {
    assert.ok(nav.includes(`"${label}"`), `missing tab: ${label}`);
  }
  // The pre-PXR-1 labels must be gone, not merely supplemented.
  for (const old of ["ホーム", "今を知る", "おすすめ", "わたしの今"]) {
    assert.ok(!nav.includes(`"${old}"`), `stale tab label still present: ${old}`);
  }
  for (const href of ['href: "/"', 'href: "/notice"', 'href: "/explore"', 'href: "/me"']) {
    assert.ok(nav.includes(href), `missing destination: ${href}`);
  }
  // One navigation system, not two.
  assert.ok(!nav.includes('href: "/tests"'), "気づく owns the depth ladder, /tests is not a tab");
});

test("desktop and mobile navigation agree on the SAME information architecture", () => {
  // Caught by 1440 QA: the header still carried the pre-PXR-1 labels while the bottom nav had the
  // new ones. Two navigations disagreeing is worse than either being wrong alone — the same person
  // gets a different mental model depending on their window width.
  const header = read("components/AppHeader.tsx");
  const nav = read("components/MobileBottomNav.tsx");
  for (const label of ["気づく", "探す", "わたし"]) {
    assert.ok(header.includes(`"${label}"`), `desktop header missing: ${label}`);
    assert.ok(nav.includes(`"${label}"`), `bottom nav missing: ${label}`);
  }
  for (const stale of ["今を知る", "おすすめ", "わたしの今", "体験を見つける"]) {
    assert.ok(!header.includes(`"${stale}"`), `stale desktop label: ${stale}`);
  }
  for (const href of ['"/notice"', '"/explore"', '"/me"']) {
    assert.ok(header.includes(href), `desktop header missing destination: ${href}`);
    assert.ok(nav.includes(href), `bottom nav missing destination: ${href}`);
  }
});

test("no surface claims the いま色テスト is 24 questions", () => {
  // The CTA on /about was re-pointed at the 120Q while the paragraph beside it still said
  // 「まずは24問チェックから」, and the site-wide fallback title in app/layout.tsx said the same thing
  // on every page that does not set its own metadata. A number that survives its own correction is
  // exactly what a grep-shaped assertion is for.
  //
  // 24問 remains CORRECT for the relationship-fatigue check, which really is 24 questions, so the
  // rule is scoped rather than absolute: a file may say 24問 only if it is about that test.
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === "__tests__") continue;
        walk(full);
        continue;
      }
      if (!/\.tsx?$/.test(entry.name)) continue;
      const src = readFileSync(full, "utf8");
      if (!src.includes("24問")) continue;
      const relative = full.slice(APP.length + 1);
      // Exempt by path as well as by content: the relationship-fatigue route's own page names the
      // count without naming the test, because the directory already does.
      if (relative.includes("relationship-fatigue") || src.includes("relationship-fatigue")) continue;
      offenders.push(relative);
    }
  };
  walk(APP);
  assert.deepEqual(offenders, [], "these claim a 24-question いま色テスト; it has 120");
});

test("/about's action and its prose describe the same product", () => {
  const about = read("about/page.tsx");
  assert.ok(!about.includes("24問"), "the body must not contradict the CTA it sits beside");
  assert.match(about, /href="\/tests\/ima-iro"/, "the CTA opens the canonical 120Q");
  // 「短く」 belongs to /today/check-in. Promising it above a button that opens 120 questions is the
  // same broken promise in words rather than in routing.
  assert.ok(
    !/短くふり返ってみる/.test(about),
    "a short-look-back promise must not introduce the 120Q",
  );
});

test("nothing offers a light re-look by sending the person into the 120Q", () => {
  // The locked semantics make "/check-in" a redirect to the 120Q. Any surface that offers a SHORT
  // interaction must therefore name "/today/check-in" explicitly — otherwise the wording promises
  // two minutes and the route delivers 120 questions.
  const governed = readFileSync(
    join(APP, "..", "lib/yorisou/recommendations/governed.ts"),
    "utf8",
  ).replace(/\/\/[^\n]*/g, " ");
  assert.ok(!/internalRoute:\s*"\/check-in"/.test(governed), "no catalogue entry may point at the legacy path");
  assert.match(governed, /internalRoute:\s*"\/today\/check-in"/, "the light re-look points at the light interaction");
});

test("product chrome is suppressed INSIDE a flow and present on the outcome", () => {
  // Two defects this pins, both found by walking the surfaces rather than reading the diff:
  //   • the Result suppressed the whole shell, so 保存 and 発見 were offered on a screen with no way
  //     back into the product except in-page links;
  //   • moving the 120Q from /check-in to its own route silently handed a 120-question assessment a
  //     bottom tab bar, because suppression was keyed to the old path.
  const shell = code("components/AppShell.tsx");
  assert.ok(shell.includes('"/tests/ima-iro"'), "a running assessment must not render the tab bar");
  assert.ok(shell.includes('"/report-loading"'), "loading steps stay chrome-free");
  assert.ok(!shell.includes('"/result"'), "the Result is an outcome and keeps the product navigation");
});

test("気づく orders depth shortest-first, so the 120Q is not the entry", () => {
  const notice = read("notice/page.tsx");
  const light = notice.indexOf("/today/check-in");
  const deep = notice.indexOf("/tests/ima-iro");
  assert.ok(light > 0 && deep > 0, "both rungs must be present");
  assert.ok(light < deep, "the 1-2 minute interaction must precede the 120Q Deep Dive");
});
