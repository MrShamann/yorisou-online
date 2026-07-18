// AIX-3B — public-route consolidation contracts (source-based; the completed subset).
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");
const VAGUE = ["準備中", "関心の段階", "育てている層"] as const;

// Route-family system extended with the continuity + report families + disposition type.
const surface = read("app/lib/publicSurface.ts");
for (const fam of ["continuity", "report", "editorial", "immersive", "focus"]) {
  assert.ok(surface.includes(`"${fam}"`), `publicSurface family: ${fam}`);
}
assert.ok(surface.includes("RouteDisposition"), "publicSurface exports RouteDisposition for the manifest");

// Shared editorial system exists.
const shell = read("app/components/aix3/EditorialShell.tsx");
assert.ok(shell.includes("EditorialShell") && shell.includes("aix3-editorial-page"), "EditorialShell surface present");

// Reskinned trust routes use the editorial system, belong to the platform, drop legacy shells + crane.
for (const f of ["app/about/page.tsx", "app/methodology/page.tsx"]) {
  const src = read(f);
  assert.ok(src.includes("EditorialShell"), `${f}: uses the shared editorial system`);
  assert.ok(!src.includes("MvpCard") && !src.includes("MvpSection") && !src.includes('from "../components/Hero"'), `${f}: legacy shell removed`);
  assert.ok(!src.includes("tsuru-logo"), `${f}: no crane`);
  for (const v of VAGUE) assert.ok(!src.includes(v), `${f}: no vague status "${v}"`);
  // platform framing (not a test-only page) + non-clinical boundary preserved
  assert.ok(src.includes("プラットフォーム") || src.includes("/#system"), `${f}: platform framing`);
  assert.ok(src.includes("診断") && src.includes("ではありません"), `${f}: non-clinical statement preserved`);
  // stale "24問" corrected to the current product
  assert.ok(!src.includes("24問"), `${f}: stale 24問 corrected`);
}

// About establishes the six-domain continuation (test = entry, not the whole product).
const about = read("app/about/page.tsx");
assert.ok(about.includes("テストで終わる") || about.includes("入口"), "about: check is an entry");
for (const d of ["残す", "見つける", "深める", "つながる", "育てる"]) {
  assert.ok(about.includes(d), `about mentions domain continuation: ${d}`);
}

console.log("AIX-3B completion contract checks passed");
