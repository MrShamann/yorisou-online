// AIX-3 — public product-completion contracts (§19). Source-based, CI-friendly.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");

const VAGUE = ["準備中", "関心の段階", "育てている層"] as const;

// 19.1 + 11 — public brand consistency: the shared shell uses the nestle
// BrandLockup and never the old crane logo.
for (const f of ["app/components/SiteHeader.tsx", "app/components/SiteFooter.tsx"]) {
  const src = read(f);
  assert.ok(src.includes("BrandLockup"), `${f}: uses BrandLockup`);
  assert.ok(!src.includes("tsuru-logo"), `${f}: no crane logo`);
}

// Centralized surface config exists and themes the completed immersive routes.
const surface = read("app/lib/publicSurface.ts");
for (const sym of ["surfaceFamily", "isImmersive", "normalizePath"]) {
  assert.ok(surface.includes(sym), `publicSurface exports ${sym}`);
}
for (const route of ["/recommendations", "/partners"]) {
  assert.ok(surface.includes(`"${route}"`), `publicSurface immersive includes ${route}`);
}

// 12 — navigation is the product-domain system (not a feature list).
const header = read("app/components/SiteHeader.tsx");
for (const label of ["理解する", "見つける", "深める", "つながる", "パートナー"]) {
  assert.ok(header.includes(label), `header nav has domain: ${label}`);
}
// EN language promise is not shown on the JA experience (gated to isEn only).
assert.ok(header.includes("isEn ?") && header.includes('日本語'), "EN switch gated to EN pages");

// 19.3 — positioning contract: the homepage says the check is an entry and the
// product continues into the service domains.
const home = read("app/page.tsx");
assert.ok(home.includes("テストで") && home.includes("入口"), "home: check is an entry, not the product");
for (const id of ["understand", "keep", "discover", "deepen", "connect", "improve"]) {
  assert.ok(home.includes(`id: "${id}"`), `home service-system map has domain: ${id}`);
}
assert.ok(home.includes("aix3-loop"), "home shows the platform loop");
assert.ok(home.includes("/partners"), "home separates the partner pathway");

// 19.4 — vague-status contract: homepage + primary nav carry no vague status.
for (const f of ["app/page.tsx", "app/components/SiteHeader.tsx"]) {
  const src = read(f);
  for (const v of VAGUE) assert.ok(!src.includes(v), `${f}: no vague status "${v}"`);
}

// 19.2 — public surface consistency on the rebuilt Discover route: no legacy
// light MvpSurface shell, no vague status; the immersive shell is used.
const rec = read("app/recommendations/page.tsx");
assert.ok(rec.includes('className="aix2"'), "recommendations uses the immersive shell");
assert.ok(!rec.includes("MvpCard") && !rec.includes("MvpSurface"), "recommendations dropped the legacy MvpSurface");
for (const v of VAGUE) assert.ok(!rec.includes(v), `recommendations: no vague status "${v}"`);
// recommendation logic preserved (fetch/signal path untouched here).
assert.ok(rec.includes("RecommendationSignalForm"), "recommendations keeps the signal form");
assert.ok(rec.includes("getTemporary120QResultCompatibility"), "recommendations keeps result compatibility");

// Partner page is a real destination (not a redirect stub).
const partners = read("app/partners/page.tsx");
assert.ok(partners.includes('className="aix2"') && !partners.includes("redirect("), "partners is a real immersive page");
assert.ok(partners.includes("pay-to-rank") || partners.includes("表示順は買えません"), "partners states no pay-to-rank");

console.log("AIX-3 completion contract checks passed");
