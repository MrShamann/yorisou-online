import assert from "node:assert/strict";
import test from "node:test";

/**
 * CORP-P4AR2R1 — the dynamic-404 CONTRACT, expressed as an executable requirement.
 *
 * READ THIS BEFORE RUNNING. These tests describe the contract the Founder mandate requires for
 * invalid dynamic routes. On Next.js 16.2.10 the contract CANNOT currently be satisfied, and these
 * tests are expected to FAIL. That is deliberate: the failure is the record of an open defect, not
 * a broken test. Deleting or relaxing them would re-hide exactly what CORP-P4AR2 falsely reported as
 * resolved.
 *
 * They require a production build served on CORP_P4AR2R1_BASE_URL (default http://localhost:4321).
 * Without a server they SKIP rather than pass, so an absent server can never be mistaken for a pass.
 *
 * The framework mechanism is recorded in
 * docs/yorisou/corporate/CORP_P4AR2R1_DYNAMIC_404_FRAMEWORK_BLOCK.md: `notFound()` raised during a
 * DYNAMIC render is served by `getErrorRSCPayload` in app-render.js, which emits
 * `<html id="__next_error__"><head/><body/></html>` — an empty seed document — and defers the 404 UI
 * to the client. The branch that server-renders a real not-found boundary
 * (`findPrerenderHTTPErrorBoundaryTree`) exists only on the PRERENDER path and only under
 * `experimental.cacheComponents`. Reproduced in a minimal stock Next.js 16.2.10 app with none of
 * this repository's code.
 */

const BASE = process.env.CORP_P4AR2R1_BASE_URL ?? "http://localhost:4321";

/** The seven invalid dynamic routes named by the mandate: malformed and well-formed-unknown. */
const INVALID_DYNAMIC_ROUTES = [
  "/share/not-a-uuid",
  "/share/00000000-0000-0000-0000-000000000000",
  "/connect/invite/not-a-uuid",
  "/connect/invite/00000000-0000-0000-0000-000000000000",
  "/connect/pair/not-a-uuid",
  "/connect/pair/00000000-0000-0000-0000-000000000000",
  "/reports/self-understanding/bogus",
];

/** Routes whose corporate 404 already renders correctly; these guard against regression. */
const ROUTER_LEVEL_404 = ["/an-entirely-unknown-path", "/insights/does-not-exist", "/nope"];

type Probe = { status: number; html: string; scriptless: string; title: string | null };

async function probe(path: string): Promise<Probe | null> {
  let res: Response;
  try {
    res = await fetch(BASE + path, { redirect: "manual" });
  } catch {
    return null;
  }
  const html = await res.text();
  return {
    status: res.status,
    html,
    scriptless: html.replace(/<script[\s\S]*?<\/script>/g, ""),
    title: /<title>(.*?)<\/title>/.exec(html)?.[1] ?? null,
  };
}

function count(html: string, tag: string): number {
  return (html.match(new RegExp(`<${tag}[\\s>]`, "g")) ?? []).length;
}

async function requireServer(t: { skip: (m: string) => void }): Promise<boolean> {
  const up = await probe("/");
  if (!up) {
    t.skip(`no server on ${BASE} — start a production build first; SKIPPED, not passed`);
    return false;
  }
  return true;
}

for (const route of INVALID_DYNAMIC_ROUTES) {
  test(`CONTRACT: ${route} must render the corporate 404 in the raw HTTP response`, async (t) => {
    if (!(await requireServer(t))) return;
    const r = await probe(route);
    assert.ok(r, "no response");

    assert.equal(r.status, 404, "status must be 404");

    // The heart of the contract: the 404 must exist in the SERVER-RENDERED HTML, before any
    // JavaScript. Hydration is not sufficient — a crawler and a no-JS client never run it.
    assert.ok(
      !r.html.includes("__next_error__"),
      "Next.js internal error document served instead of the corporate 404",
    );
    assert.ok(
      r.scriptless.includes("お探しのページは"),
      "corporate 404 text absent from the scriptless server-rendered HTML",
    );
    assert.equal(r.title, "ページが見つかりません — Yorisou", "wrong title");
    assert.match(r.html, /<meta name="robots"[^>]*noindex/i, "404 must be noindex");

    // Exactly one shell, and it must be the corporate one.
    assert.equal(count(r.scriptless, "header"), 1, "expected exactly 1 header");
    assert.equal(count(r.scriptless, "footer"), 1, "expected exactly 1 footer");
    assert.equal(count(r.scriptless, "main"), 1, "expected exactly 1 main");
    assert.equal(count(r.scriptless, "h1"), 1, "expected exactly 1 h1");
    for (const consumerLabel of ["気づく", "探す", "わたし"]) {
      assert.ok(!r.scriptless.includes(consumerLabel), `consumer chrome leaked: ${consumerLabel}`);
    }
    assert.ok(!r.scriptless.includes("pb-[74px]"), "consumer bottom-nav padding leaked");
  });
}

test("CONCEALMENT: malformed and well-formed-unknown ids are indistinguishable", async (t) => {
  if (!(await requireServer(t))) return;
  const pairs: [string, string][] = [
    ["/share/not-a-uuid", "/share/00000000-0000-0000-0000-000000000000"],
    ["/connect/invite/not-a-uuid", "/connect/invite/00000000-0000-0000-0000-000000000000"],
    ["/connect/pair/not-a-uuid", "/connect/pair/00000000-0000-0000-0000-000000000000"],
  ];
  for (const [malformed, unknown] of pairs) {
    const a = await probe(malformed);
    const b = await probe(unknown);
    assert.ok(a && b);
    assert.equal(a.status, b.status, `${malformed} and ${unknown} differ in status`);
    assert.equal(
      a.scriptless.length === 0,
      b.scriptless.length === 0,
      `${malformed} and ${unknown} differ in whether a body was rendered`,
    );
    // Neither may explain WHY it failed.
    for (const r of [a, b]) {
      for (const leak of ["revoked", "expired", "not found in", "invalid id", "unauthorized"]) {
        assert.ok(!r.scriptless.toLowerCase().includes(leak), `failure reason leaked: ${leak}`);
      }
    }
  }
});

test("REGRESSION: router-level 404s still render the corporate 404 server-side", async (t) => {
  if (!(await requireServer(t))) return;
  for (const route of ROUTER_LEVEL_404) {
    const r = await probe(route);
    assert.ok(r, route);
    assert.equal(r.status, 404, route);
    assert.ok(!r.html.includes("__next_error__"), `${route} regressed to the internal error doc`);
    assert.ok(r.scriptless.includes("お探しのページは"), `${route} lost its server-rendered 404`);
    assert.equal(count(r.scriptless, "header"), 1, route);
    assert.equal(count(r.scriptless, "footer"), 1, route);
  }
});

test("REGRESSION: robots.txt keeps exactly four anchored Allow rules", async (t) => {
  if (!(await requireServer(t))) return;
  const res = await fetch(BASE + "/robots.txt");
  const txt = await res.text();
  const allows = [...txt.matchAll(/^Allow:\s*(\S+)/gm)].map((m) => m[1]);
  assert.deepEqual(allows, ["/$", "/mirai-move$", "/kakari$", "/about$"]);
  assert.match(txt, /^Disallow:\s*\/$/m, "default-deny must remain");
});

test("REGRESSION: sitemap contains exactly the four corporate URLs", async (t) => {
  if (!(await requireServer(t))) return;
  const res = await fetch(BASE + "/sitemap.xml");
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  assert.deepEqual(locs.sort(), ["/", "/about", "/kakari", "/mirai-move"]);
});
