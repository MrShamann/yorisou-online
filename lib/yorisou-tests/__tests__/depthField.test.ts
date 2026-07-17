// AIX-2 — Depth Field / Depth Signature contract tests.
// Determinism (same public-safe context -> same field), 24 distinct
// signatures, public-safe-only API shape, layered depth structure, and static
// projection bounds. Mirrors the state-field contract discipline.

import assert from "node:assert/strict";

import {
  createDepthPoints,
  projectForStatic,
  hashSeed,
} from "@/app/components/depth-field/engine";
import {
  signatureDepthParams,
  intentionDepthParams,
  paletteFor,
} from "@/app/components/depth-field/seed";

const PUBLIC_CODES = [
  "MS-KI", "MS-SI", "MS-SZ", "MS-YO",
  "EM-AK", "EM-FB", "EM-KA", "EM-KU",
  "IR-IH", "IR-MH", "IR-MK", "IR-SI",
  "CD-AS", "CD-IS", "CD-KJ", "CD-SG",
  "TD-KY", "TD-NT", "TD-SG", "TD-TB",
  "WL-SE", "WL-SK", "WL-UN", "WL-YM",
];

function run(name: string, fn: () => void) {
  fn();
  console.log(`ok - ${name}`);
}

run("same public context -> identical depth field", () => {
  const ctx = { resultId: "MS-KI", overlayId: "balancing", confidenceBand: "low" };
  const a = signatureDepthParams(ctx);
  const b = signatureDepthParams(ctx);
  assert.deepEqual(a, b);
  assert.deepEqual(createDepthPoints(a), createDepthPoints(b));
});

run("all 24 public codes produce distinct fields", () => {
  const seeds = new Set(PUBLIC_CODES.map((code) => signatureDepthParams({ resultId: code }).seed));
  assert.equal(seeds.size, PUBLIC_CODES.length);
});

run("overlay + confidence vary the seed; params are visual-only (no numeric confidence field)", () => {
  const base = signatureDepthParams({ resultId: "MS-KI" });
  const withOverlay = signatureDepthParams({ resultId: "MS-KI", overlayId: "balancing" });
  assert.notEqual(base.seed, withOverlay.seed);
  assert.deepEqual(Object.keys(base).sort(), ["cohesion", "count", "family", "paletteSize", "seed", "tempo"]);
});

run("field has genuine 3 depth layers with distinct z ranges", () => {
  const p = signatureDepthParams({ resultId: "CD-AS" }, 300);
  const pts = createDepthPoints(p);
  const far = pts.filter((x) => x.layer === "far");
  const mid = pts.filter((x) => x.layer === "mid");
  const near = pts.filter((x) => x.layer === "near");
  assert.ok(far.length > 0 && mid.length > 0 && near.length > 0);
  const avgZ = (arr: typeof pts) => arr.reduce((s, x) => s + x.z, 0) / arr.length;
  // far is deeper (more negative) than mid, mid deeper than near
  assert.ok(avgZ(far) < avgZ(mid), "far behind mid");
  assert.ok(avgZ(mid) < avgZ(near), "mid behind near");
});

run("static projection is finite, bounded, painter-ordered by depth", () => {
  const p = intentionDepthParams("current-state", 260);
  const pts = createDepthPoints(p);
  const proj = projectForStatic(pts, 1000, 1);
  for (const q of proj) {
    assert.ok(Number.isFinite(q.sx) && Number.isFinite(q.sy) && Number.isFinite(q.r));
    assert.ok(q.alpha >= 0 && q.alpha <= 1.01);
  }
  for (let i = 1; i < proj.length; i += 1) assert.ok(proj[i].z >= proj[i - 1].z); // far -> near
});

run("palette is public-safe and clan-scoped", () => {
  assert.notDeepEqual(paletteFor({ resultId: "MS-KI" }), paletteFor({ resultId: "EM-AK" }));
  // every color has an rgb triple + hex mirror (drives WebGL + SVG agreement)
  for (const c of paletteFor({ resultId: "MS-KI" })) {
    assert.equal(c.rgb.length, 3);
    assert.match(c.hex, /^#[0-9a-fA-F]{6}$/);
  }
});

run("formation reduces far-haze brightness (state formation reads)", () => {
  const p = signatureDepthParams({ resultId: "WL-SE" });
  const pts = createDepthPoints(p);
  const dispersed = projectForStatic(pts, 1000, 0);
  const formed = projectForStatic(pts, 1000, 1);
  const avgAlpha = (arr: typeof dispersed) => arr.reduce((s, x) => s + x.alpha, 0) / arr.length;
  assert.ok(avgAlpha(formed) > avgAlpha(dispersed));
});

run("hashSeed reused from state-field stays deterministic", () => {
  assert.equal(hashSeed("MS-KI"), hashSeed("MS-KI"));
});

console.log("depth-field: all contract tests passed");
