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
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const APP = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string) => readFileSync(join(APP, p), "utf8");
const code = (p: string) => read(p).replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");

test("legacy /check-in redirects to the 120Q, preserving the semantic contract", () => {
  const legacy = code("check-in/page.tsx");
  assert.match(legacy, /redirect\(/, "it must redirect, not render something else");
  assert.match(legacy, /\/tests\/ima-iro/, "it must land on the 120Q, not the new light interaction");
  assert.ok(
    !legacy.includes("/today/check-in"),
    "the legacy route must NEVER silently become the new lightweight product",
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

test("気づく orders depth shortest-first, so the 120Q is not the entry", () => {
  const notice = read("notice/page.tsx");
  const light = notice.indexOf("/today/check-in");
  const deep = notice.indexOf("/tests/ima-iro");
  assert.ok(light > 0 && deep > 0, "both rungs must be present");
  assert.ok(light < deep, "the 1-2 minute interaction must precede the 120Q Deep Dive");
});
