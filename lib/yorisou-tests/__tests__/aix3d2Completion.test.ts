// AIX-3D-2 — per-test-flow completion + final launch-route contracts (source + runtime).
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { surfaceFamily, isDarkSurface, isUnderstand } from "@/app/lib/publicSurface";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");
const has = (p: string) => existsSync(join(root, p));
const VAGUE = ["準備中", "関心の段階", "育てている層", "coming soon", "Coming Soon"] as const;

// ── Dispositions ─────────────────────────────────────────────────────────────
// Divination-adjacent, catalogue-absent routes are consolidated (redirect → /tests).
for (const r of ["r01", "r04", "s01"]) {
  const src = read(`app/tests/${r}/page.tsx`);
  assert.ok(src.includes("redirect(") && src.includes('"/tests"'), `/tests/${r} redirects to /tests`);
}
// Retained canonical test flows are real pages, not redirects.
const RETAINED = [
  "c02",
  "f01",
  "f02",
  "relationship-fatigue",
  "love-distance",
  "local-life",
  "work-rhythm",
  "name-impression",
] as const;
for (const r of RETAINED) {
  assert.ok(has(`app/tests/${r}/page.tsx`), `/tests/${r} exists`);
  assert.ok(!read(`app/tests/${r}/page.tsx`).includes("redirect("), `/tests/${r} is a real flow, not a redirect`);
}

// ── Understand route family ─────────────────────────────────────────────────
const surface = read("app/lib/publicSurface.ts");
assert.ok(surface.includes("UNDERSTAND_PREFIXES") && surface.includes('"understand"'), "publicSurface: understand family present");
for (const r of RETAINED) {
  assert.equal(surfaceFamily(`/tests/${r}`), "understand", `/tests/${r} resolves to understand`);
  assert.equal(isUnderstand(`/tests/${r}`), true, `/tests/${r} isUnderstand`);
  assert.equal(isDarkSurface(`/tests/${r}`), false, `/tests/${r} is light (branded-light Understand)`);
  assert.notEqual(surfaceFamily(`/tests/${r}`), "legacy", `no launch /tests route is legacy`);
}
// The catalogue itself stays immersive (the dark entry).
assert.equal(surfaceFamily("/tests"), "immersive", "/tests catalogue stays immersive");
// Return routes are also understand (not legacy).
for (const r of ["/tests/c02/return", "/tests/relationship-fatigue/return"]) {
  assert.equal(surfaceFamily(r), "understand", `${r} resolves to understand`);
}

// ── Shared Understand grammar + no stale test-only identity ─────────────────
assert.ok(has("app/tests/_components/UnderstandShell.tsx"), "shared UnderstandShell exists");
const understandShell = read("app/tests/_components/UnderstandShell.tsx");
assert.ok(understandShell.includes("#FBFAF6"), "UnderstandShell uses the shared light ground");
// Every retained flow uses the shared ground and drops the legacy frontstage / warm-cream gradient.
const FLOW_FILES = [
  "app/tests/_components/SpecAssessmentFlow.tsx",
  "app/tests/relationship-fatigue/RelationshipFatigueFlow.tsx",
  "app/tests/love-distance/LoveDistanceFlow.tsx",
  "app/tests/local-life/LocalLifeFlow.tsx",
  "app/tests/work-rhythm/WorkRhythmFlow.tsx",
  "app/tests/name-impression/NameImpressionFlow.tsx",
];
for (const f of FLOW_FILES) {
  const src = read(f);
  assert.ok(src.includes("#FBFAF6") || src.includes("UnderstandShell"), `${f}: shared Understand ground`);
  assert.ok(!src.includes("frontstage-page"), `${f}: no legacy frontstage-page shell`);
  assert.ok(!/linear-gradient\(180deg,_#FFF9F2/.test(src), `${f}: no stale warm-cream test palette`);
  assert.ok(!src.includes("tsuru-logo"), `${f}: no crane`);
  for (const v of VAGUE) assert.ok(!src.includes(v), `${f}: no vague status "${v}"`);
}

// ── Count accuracy (§10) — each real distinct count preserved, none stale ────
assert.match(read("app/tests/relationship-fatigue/RelationshipFatigueFlow.tsx"), /"24問"/, "RF states its real 24問");
assert.match(read("app/tests/love-distance/LoveDistanceFlow.tsx"), /"18問"/, "love-distance states its real 18問");
assert.match(read("app/tests/work-rhythm/WorkRhythmFlow.tsx"), /"6問"/, "work-rhythm states its real 6問");
assert.match(read("app/tests/name-impression/page.tsx"), /5問/, "name-impression states its real 5問 (metadata)");
// The 120Q imairo entry on the catalogue is not mislabelled as a smaller count.
const catalogue = read("app/tests/page.tsx");
assert.ok(catalogue.includes("120問") && !/いま色[^。]*24問/.test(catalogue), "catalogue: imairo is 120問, not a stale count");

console.log("AIX-3D-2 completion contract checks passed");
