// AIX-1 — State Field / State Signature contract tests.
//
// Verifies: (1) determinism — same public-safe context always produces the
// same field; (2) distinctness — the 24 public codes produce 24 distinct
// signatures; (3) formation math stays bounded; (4) the seed module only
// consumes public-safe identifiers (API-shape guard).

import assert from "node:assert/strict";

import {
  createFieldNodes,
  fieldLinks,
  fieldPointsAt,
  hashSeed,
  mulberry32,
} from "@/app/components/state-field/engine";
import {
  intentionParams,
  signatureParams,
} from "@/app/components/state-field/seed";

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

run("PRNG and hash are deterministic", () => {
  const a = mulberry32(12345);
  const b = mulberry32(12345);
  for (let i = 0; i < 100; i += 1) assert.equal(a(), b());
  assert.equal(hashSeed("MS-KI"), hashSeed("MS-KI"));
  assert.notEqual(hashSeed("MS-KI"), hashSeed("MS-SI"));
});

run("same public context -> identical field (State Signature determinism)", () => {
  const ctx = { resultId: "MS-KI", overlayId: "balancing", confidenceBand: "low" };
  const p1 = signatureParams(ctx);
  const p2 = signatureParams(ctx);
  assert.deepEqual(p1, p2);
  const n1 = createFieldNodes(p1);
  const n2 = createFieldNodes(p2);
  assert.deepEqual(n1, n2);
  const f1 = fieldPointsAt(n1, p1.seed, 0, 1);
  const f2 = fieldPointsAt(n2, p2.seed, 0, 1);
  assert.deepEqual(f1, f2);
});

run("all 24 public codes produce distinct signatures", () => {
  const seeds = new Set(PUBLIC_CODES.map((code) => signatureParams({ resultId: code }).seed));
  assert.equal(seeds.size, PUBLIC_CODES.length);
  // clans should differ in arrangement family or palette mix
  const msParams = signatureParams({ resultId: "MS-KI" });
  const emParams = signatureParams({ resultId: "EM-AK" });
  assert.notDeepEqual(msParams.palette, emParams.palette);
});

run("overlay and confidence vary the signature without leaking values", () => {
  const base = signatureParams({ resultId: "MS-KI" });
  const withOverlay = signatureParams({ resultId: "MS-KI", overlayId: "balancing" });
  assert.notEqual(base.seed, withOverlay.seed);
  // parameters are visual controls only — no numeric confidence field exists
  const keys = Object.keys(base).sort();
  assert.deepEqual(keys, ["cohesion", "family", "lineColor", "nodeCount", "palette", "seed", "tempo"]);
});

run("formation is bounded and monotonic toward the formed arrangement", () => {
  const params = signatureParams({ resultId: "CD-AS" });
  const nodes = createFieldNodes(params);
  const formed = fieldPointsAt(nodes, params.seed, 0, 1);
  const dispersed = fieldPointsAt(nodes, params.seed, 0, 0);
  const mid = fieldPointsAt(nodes, params.seed, 0, 0.5);
  for (const pts of [formed, dispersed, mid]) {
    for (const p of pts) {
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
      assert.ok(p.alpha >= 0 && p.alpha <= 1.01);
    }
  }
  // mid formation should sit between dispersed and formed on average
  const avgDx = (a: typeof formed, b: typeof formed) =>
    a.reduce((s, p, i) => s + Math.hypot(p.x - b[i].x, p.y - b[i].y), 0) / a.length;
  assert.ok(avgDx(mid, formed) < avgDx(dispersed, formed));
});

run("links are capped (field stays quiet)", () => {
  const params = intentionParams("current-state", 90);
  const nodes = createFieldNodes(params);
  const pts = fieldPointsAt(nodes, params.seed, 3, 1);
  assert.ok(fieldLinks(pts).length <= 60);
});

run("intention seeds are stable and named-only", () => {
  assert.deepEqual(intentionParams("discover-next"), intentionParams("discover-next"));
  assert.notEqual(intentionParams("current-state").seed, intentionParams("work-life-rhythm").seed);
});

console.log("state-field: all contract tests passed");
