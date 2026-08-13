// PXR-1 — LINE mini-app entry compatibility.
//
// The regression these tests exist to stop: `/check-in` was reduced to a bare
// `redirect("/tests/ima-iro")`, which dropped the query string. Every LINE mini-app link already in
// the wild carries `source` / `entry_source` / `nav` / `v`, and the 120Q runtime reads them to set
// `isMiniAppEntry`. That flag is not cosmetic — it decides whether completion navigates straight to
// `/result` (LINE) or through `/report-loading` (web). So the route kept returning 200 and kept
// showing the right product, while quietly changing how the journey ends for every LINE visitor.
//
// A 200 that behaves differently is the same class of break as a 200 that shows a different
// product, and it is harder to notice.
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  CANONICAL_ASSESSMENT_PATH,
  GOVERNED_MINI_APP_HANDOFF_PARAMS,
  LINE_MINI_APP_NAV_VERSION,
  buildMiniAppCheckInHandoffHref,
  preserveGovernedHandoffParams,
  resolveLegacyCheckInRedirect,
} from "../miniAppEntryRouting";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..", "..");
const read = (p: string) => readFileSync(join(REPO, p), "utf8");
const stripComments = (s: string) => s.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");

/** Exactly what the governed builder emits for a LINE mini-app entry. */
const FULL_LINE_ENTRY = {
  source: "line",
  entry_source: "line-mini-app",
  nav: "hard",
  v: LINE_MINI_APP_NAV_VERSION,
  session_context_flags: "returning,consented",
  line_status: "linked",
  line_error: "none",
  line_friendship: "friend",
};

test("new Japanese LINE entries point straight at the canonical 120Q", () => {
  const href = buildMiniAppCheckInHandoffHref({ locale: "ja", searchParams: {} });
  const [path] = href.split("?");
  assert.equal(path, CANONICAL_ASSESSMENT_PATH, "no new link should be minted at the legacy path");
  assert.equal(path, "/tests/ima-iro");
  assert.ok(!href.startsWith("/check-in"), "the legacy path is for inbound links only");
});

test("the Japanese handoff still carries the entry context it always did", () => {
  const href = buildMiniAppCheckInHandoffHref({ locale: "ja", searchParams: FULL_LINE_ENTRY });
  const query = new URLSearchParams(href.split("?")[1] ?? "");
  assert.equal(query.get("source"), "line");
  assert.equal(query.get("entry_source"), "line-mini-app");
  assert.equal(query.get("nav"), "hard");
  assert.equal(query.get("v"), LINE_MINI_APP_NAV_VERSION);
  assert.equal(query.get("session_context_flags"), "returning,consented");
  assert.equal(query.get("line_status"), "linked");
  assert.equal(query.get("line_error"), "none");
  assert.equal(query.get("line_friendship"), "friend");
});

test("English routing is unchanged", () => {
  // There is no English light interaction and no approved English copy for one, so re-pointing the
  // English entry would be a product decision, not a compatibility fix.
  const href = buildMiniAppCheckInHandoffHref({ locale: "en", searchParams: {} });
  assert.ok(href.startsWith("/en/check-in"), `English entry moved: ${href}`);
});

test("the builder cannot emit a parameter the legacy route does not carry", () => {
  // The drift guard. If someone adds a field to the handoff and forgets the legacy allowlist, the
  // new field would be silently dropped on every inbound link — so that mistake fails here instead.
  const href = buildMiniAppCheckInHandoffHref({ locale: "ja", searchParams: FULL_LINE_ENTRY });
  const emitted = [...new URLSearchParams(href.split("?")[1] ?? "").keys()];
  assert.ok(emitted.length > 0);
  for (const key of emitted) {
    assert.ok(
      (GOVERNED_MINI_APP_HANDOFF_PARAMS as readonly string[]).includes(key),
      `builder emits "${key}" but the legacy route would not preserve it`,
    );
  }
});

test("legacy /check-in preserves the full LINE entry context", () => {
  const target = resolveLegacyCheckInRedirect(FULL_LINE_ENTRY);
  const [path, rawQuery] = target.split("?");
  assert.equal(path, CANONICAL_ASSESSMENT_PATH);

  const query = new URLSearchParams(rawQuery);
  // The three the runtime reads for isMiniAppEntry, plus the release marker.
  assert.equal(query.get("entry_source"), "line-mini-app");
  assert.equal(query.get("source"), "line");
  assert.equal(query.get("nav"), "hard");
  assert.equal(query.get("v"), LINE_MINI_APP_NAV_VERSION);
  // The optional session/LINE context fields the current handoff can emit.
  assert.equal(query.get("session_context_flags"), "returning,consented");
  assert.equal(query.get("line_status"), "linked");
  assert.equal(query.get("line_error"), "none");
  assert.equal(query.get("line_friendship"), "friend");
});

test("each isMiniAppEntry trigger survives on its own", () => {
  // The runtime treats any ONE of these as a LINE entry, so each has to survive independently —
  // an inbound link that carries only `nav=hard` is still a LINE entry.
  for (const [key, value] of [
    ["entry_source", "line-mini-app"],
    ["entry_source", "mini_app"],
    ["source", "line"],
    ["source", "mini_app"],
    ["nav", "hard"],
  ] as const) {
    const query = new URLSearchParams(resolveLegacyCheckInRedirect({ [key]: value }).split("?")[1] ?? "");
    assert.equal(query.get(key), value, `${key}=${value} was dropped`);
  }
});

test("unknown and untrusted query keys are not propagated", () => {
  // `/online-check-in` relays arbitrary parameters into this route, so a passthrough would make the
  // legacy path an open relay into the assessment.
  const target = resolveLegacyCheckInRedirect({
    entry_source: "line-mini-app",
    utm_campaign: "spam",
    redirect: "https://evil.example.com",
    returnTo: "//evil.example.com",
    result: "some-private-row-id",
    __proto__: "x",
  } as Record<string, string>);

  const query = new URLSearchParams(target.split("?")[1] ?? "");
  assert.equal(query.get("entry_source"), "line-mini-app");
  for (const key of ["utm_campaign", "redirect", "returnTo", "result", "__proto__"]) {
    assert.equal(query.get(key), null, `"${key}" must not survive the redirect`);
  }
});

test("an allowlisted key with a malformed value is dropped, not carried", () => {
  const target = resolveLegacyCheckInRedirect({
    entry_source: "line-mini-app",
    source: "line evil<script>",
    nav: "x".repeat(200),
    line_status: "ok",
  });
  const query = new URLSearchParams(target.split("?")[1] ?? "");
  assert.equal(query.get("entry_source"), "line-mini-app");
  assert.equal(query.get("line_status"), "ok");
  assert.equal(query.get("source"), null, "a value outside the accepted shape is dropped");
  assert.equal(query.get("nav"), null, "an over-long value is dropped");
});

test("repeats that agree are carried; only genuine disagreement is refused", () => {
  // LIFF appends the launch query onto an endpoint URL that may already carry the same parameters,
  // so `?nav=hard&nav=hard` is a real shape a real LINE link produces. An earlier version of this
  // module discarded EVERY array and a test here called that "refusing an ambiguous value" — which
  // demoted a genuine LINE visitor to the web completion path, i.e. reintroduced the exact defect
  // the module exists to prevent, inside the guard against it.
  const agreeing = new URLSearchParams(
    resolveLegacyCheckInRedirect({
      source: ["line", "line"],
      entry_source: ["line-mini-app", "line-mini-app"],
      nav: ["hard", "hard"],
    }).split("?")[1] ?? "",
  );
  assert.equal(agreeing.get("source"), "line", "identical repeats are not ambiguous");
  assert.equal(agreeing.get("entry_source"), "line-mini-app");
  assert.equal(agreeing.get("nav"), "hard");

  // Disagreement is still refused: picking a winner would be picking one on someone else's behalf.
  const conflicting = resolveLegacyCheckInRedirect({ entry_source: ["line-mini-app", "spoofed"] });
  const query = new URLSearchParams(conflicting.split("?")[1] ?? "");
  assert.equal(query.getAll("entry_source").length, 0, "a contradicted value must not be resolved");
  assert.ok(conflicting.startsWith("/tests/ima-iro"), "the destination is still the 120Q");

  // Unambiguous parameters alongside a contradicted one are unaffected.
  const mixed = new URLSearchParams(
    resolveLegacyCheckInRedirect({ entry_source: ["a", "b"], nav: "hard" }).split("?")[1] ?? "",
  );
  assert.equal(mixed.get("nav"), "hard");
  assert.equal(mixed.get("entry_source"), null);
});

test("the builder and the legacy route agree on VALUES, not just on keys", () => {
  // They used to agree on which KEYS existed and disagree about which VALUES survived: the builder
  // copied the four optional context fields verbatim from arbitrary upstream input while the legacy
  // route validated them, so a value the builder happily minted onto a LINE link could be silently
  // dropped one redirect later. Both sides now run the same check, so anything the builder emits
  // survives the redirect by construction.
  const hostile = {
    session_context_flags: "returning consented",       // space
    line_status: "a|b",                                  // pipe
    line_error: "x".repeat(400),                         // over-long
    line_friendship: "友だち",                            // non-ASCII
  };

  const href = buildMiniAppCheckInHandoffHref({ locale: "ja", searchParams: hostile });
  const emitted = new URLSearchParams(href.split("?")[1] ?? "");
  const carried = preserveGovernedHandoffParams(hostile);

  for (const key of GOVERNED_MINI_APP_HANDOFF_PARAMS) {
    assert.equal(
      emitted.get(key),
      key === "source" || key === "entry_source" || key === "nav" || key === "v"
        ? emitted.get(key) // the four constants the builder always sets
        : carried.get(key),
      `builder and legacy route disagree about ${key}`,
    );
  }
  for (const key of ["session_context_flags", "line_status", "line_error", "line_friendship"]) {
    assert.equal(emitted.get(key), null, `${key} must not be minted if it cannot cross a redirect`);
  }
});

test("a bare /check-in still redirects cleanly, with no query and no loop", () => {
  assert.equal(resolveLegacyCheckInRedirect({}), CANONICAL_ASSESSMENT_PATH);
  assert.equal(resolveLegacyCheckInRedirect({ utm_source: "x" }), CANONICAL_ASSESSMENT_PATH);
});

test("no input can make the legacy route redirect to itself", () => {
  const attempts: Record<string, string>[] = [
    {},
    FULL_LINE_ENTRY,
    { entry_source: "line-mini-app" },
    { source: "/check-in" },
    { nav: "hard", v: LINE_MINI_APP_NAV_VERSION },
  ];
  for (const attempt of attempts) {
    const target = resolveLegacyCheckInRedirect(attempt);
    assert.ok(target.startsWith(`${CANONICAL_ASSESSMENT_PATH}`), target);
    assert.ok(!target.startsWith("/check-in"), `redirect loop: ${target}`);
  }
});

test("preserveGovernedHandoffParams is the single allowlist both sides use", () => {
  const preserved = preserveGovernedHandoffParams(FULL_LINE_ENTRY);
  assert.deepEqual(
    [...preserved.keys()].sort(),
    [...GOVERNED_MINI_APP_HANDOFF_PARAMS].sort(),
    "every governed parameter must round-trip",
  );
});

test("the legacy route actually uses the resolver, and the 120Q still reads the context", () => {
  const legacy = stripComments(read("app/check-in/page.tsx"));
  assert.match(legacy, /resolveLegacyCheckInRedirect/, "the route must not hand-roll its own target");
  assert.match(legacy, /redirect\(/);
  assert.match(legacy, /searchParams/, "the route must read the query it is asked to preserve");
  assert.ok(!legacy.includes("/today/check-in"), "the legacy path must never become the light flow");

  const flow = stripComments(read("app/tests/ima-iro/MiniTestFlow.tsx"));
  for (const probe of [
    'searchParams.get("entry_source") === "line-mini-app"',
    'searchParams.get("source") === "line"',
    'searchParams.get("nav") === "hard"',
  ]) {
    assert.ok(flow.includes(probe), `the 120Q runtime no longer detects: ${probe}`);
  }
  assert.match(flow, /isMiniAppEntry\s*\)\s*\{[\s\S]{0,200}window\.location\.assign/, "LINE completion path intact");
});
