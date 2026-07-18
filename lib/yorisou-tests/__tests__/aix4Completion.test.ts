// AIX-4 — product-first experience unification + share system contracts (source + runtime).
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { surfaceFamily, isDarkSurface } from "@/app/lib/publicSurface";
import { resolveShareCard, buildShareImagePath, SHARE_FORMATS } from "@/app/lib/share/shareCard";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");
const has = (p: string) => existsSync(join(root, p));

// ── Design-system tokens (one system, intentional modes) ────────────────────
const css = read("app/globals.css");
for (const t of ["--yr-surface", "--yr-panel", "--yr-panel-2", "--yr-text", "--yr-text-mut", "--yr-text-faint", "--yr-accent", "--yr-accent-text", "--yr-accent-ink", "--yr-hair"]) {
  assert.ok(css.includes(t), `semantic token ${t} defined`);
}
assert.ok(css.includes(".yr-focus"), "Product-Focus mode class defined");
// dark tokens apply to both immersive (.aix2) and focus (.yr-focus)
assert.ok(/\.yr-focus,\s*\.aix2\s*\{/.test(css) || css.includes(".yr-focus,\n.aix2"), "dark tokens cover immersive + focus");

// ── Route-family: the test flows are the dark Product-Focus surface ─────────
for (const r of ["/tests/c02", "/tests/relationship-fatigue", "/tests/love-distance", "/tests/local-life", "/tests/work-rhythm", "/tests/name-impression"]) {
  assert.equal(surfaceFamily(r), "understand", `${r} is understand`);
  assert.equal(isDarkSurface(r), true, `${r} is dark (Product-Focus)`);
}

// ── Theme-aware shared components (token-driven, no hardcoded light) ─────────
const SHARED = [
  "app/components/YorisouCompanionCard.tsx",
  "app/components/YorisouRecommendationSlot.tsx",
  "app/components/ResultConversionCommunity.tsx",
  "app/tests/c02/C02PrivateSave.tsx",
  "app/tests/relationship-fatigue/PrivateSaveAndNext.tsx",
];
for (const f of SHARED) {
  const src = read(f);
  assert.ok(src.includes("var(--yr-"), `${f}: uses semantic tokens`);
  // no ungoverned hardcoded-light surfaces (bg-white / warm-cream) that would clash on dark
  assert.ok(!/bg-white(\/|"|\s|\])/.test(src), `${f}: no hardcoded bg-white`);
  assert.ok(!/#FFF9F2|#FBFAF6|#FCFAF6/.test(src), `${f}: no hardcoded cream ground`);
}
// surface-* global utilities are token-driven so they adapt to the mode.
assert.ok(/\.surface-panel\s*\{[^}]*var\(--yr-panel\)/.test(css.replace(/\n/g, " ")), "surface-panel is token-driven");

// ── Real share-card system ──────────────────────────────────────────────────
assert.ok(has("app/lib/share/shareCard.ts"), "share model exists");
assert.ok(has("app/api/share/card/route.tsx"), "share-image route exists");
assert.ok(has("app/components/share/ShareResultActions.tsx"), "share UI exists");
const route = read("app/api/share/card/route.tsx");
assert.ok(route.includes("ImageResponse"), "share route uses ImageResponse");
for (const [fmt, dim] of Object.entries(SHARE_FORMATS)) {
  assert.ok(dim.width > 0 && dim.height > 0, `format ${fmt} has dimensions`);
}
assert.deepEqual(SHARE_FORMATS.square, { width: 1080, height: 1080 }, "square 1080²");
assert.deepEqual(SHARE_FORMATS.story, { width: 1080, height: 1920 }, "story 1080×1920");
assert.deepEqual(SHARE_FORMATS.og, { width: 1200, height: 630 }, "og 1200×630");

// deterministic + public-safe model
const a = resolveShareCard({ testLabel: "テスト", title: "静かな橋", line: "今の状態から", traits: ["a", "b", "c", "d"], seed: "x" });
const b = resolveShareCard({ testLabel: "テスト", title: "静かな橋", line: "今の状態から", traits: ["a", "b", "c", "d"], seed: "x" });
assert.equal(buildShareImagePath(a, "square"), buildShareImagePath(b, "square"), "deterministic image path");
assert.equal(a.traits.length, 3, "traits capped at 3 (public-safe)");
// private-looking content is stripped
const leak = resolveShareCard({ testLabel: "t", title: 'answers={"q1":"a"}', line: "payloadKey abc", traits: ["user@x.com"], seed: "s" });
assert.ok(!leak.title.includes("answers"), "raw answers stripped from title");
assert.ok(!leak.line.includes("payloadKey"), "payload key stripped from line");
assert.equal(leak.traits.length, 0, "email-like trait stripped");
// share URL is same-site only
const ext = resolveShareCard({ testLabel: "t", title: "x", url: "https://evil.example.com/x", seed: "s" });
assert.ok(ext.url.startsWith("https://yorisou.online"), "share url forced to canonical origin");

// ── Share coverage across all retained result types (one architecture) ──────
const SHARE_SURFACES = [
  "app/tests/_components/SpecAssessmentFlow.tsx", // C02/F01/F02
  "app/tests/relationship-fatigue/RelationshipFatigueFlow.tsx",
  "app/tests/love-distance/LoveDistanceFlow.tsx",
  "app/tests/local-life/LocalLifeFlow.tsx",
  "app/tests/work-rhythm/WorkRhythmFlow.tsx",
  "app/tests/name-impression/NameImpressionFlow.tsx",
  "app/result/page.tsx", // imairo 120Q
];
for (const f of SHARE_SURFACES) {
  assert.ok(read(f).includes("ShareResultActions"), `${f}: wired to the shared share system`);
}

// ── Product-first homepage ──────────────────────────────────────────────────
const home = read("app/page.tsx");
assert.ok(home.includes("プラットフォーム"), "homepage leads with the platform");
assert.ok(home.includes("次の選択"), "platform-level headline");
assert.ok(home.includes("yr-systemmap"), "six-domain system map is in the composition");
assert.ok(!/120問[^。]{0,4}<\/h1>/.test(home), "no 120問 at hero-headline level");
for (const id of ["understand", "keep", "discover", "deepen", "connect", "improve"]) {
  assert.ok(home.includes(`id: "${id}"`), `homepage has domain ${id}`);
}
assert.ok(home.includes("openGraph"), "homepage has OG metadata");

console.log("AIX-4 completion contract checks passed");
