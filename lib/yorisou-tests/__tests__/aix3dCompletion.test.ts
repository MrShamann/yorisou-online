// AIX-3D-1 — launch-surface completion contracts (source-based + runtime).
// Scope: LINE continuity (Part A), editorial/trust reskin (Part B), English
// Option B (Part D), /insights consolidation (Part E). Per-test-flow reskins and
// the full 34-route crawl are the agreed 3D-2 follow-up and are not asserted here.
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { surfaceFamily, isImmersive } from "@/app/lib/publicSurface";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");
const has = (p: string) => existsSync(join(root, p));
const VAGUE = ["準備中", "関心の段階", "育てている層"] as const;

// ── Part E — /insights consolidated to the canonical understand entry ──
for (const [f, target] of [
  ["app/insights/page.tsx", "/tests"],
  ["app/en/insights/page.tsx", "/en"],
] as const) {
  const src = read(f);
  assert.ok(src.includes("redirect(") && src.includes(`"${target}"`), `${f}: redirects to ${target}`);
}

// ── Part A — LINE mini-app as a continuity channel (not the whole product) ──
const line = read("app/line/mini-app/page.tsx");
assert.ok(line.includes("BrandLockup"), "line: uses the shared BrandLockup (nestle mark)");
assert.ok(!line.includes("tsuru-logo") && !line.includes("yorisou-logo-primary"), "line: no crane / raster logo");
for (const v of VAGUE) assert.ok(!line.includes(v), `line: no vague status "${v}"`);
assert.ok(line.includes('href="/saved"') && line.includes('href="/reports"'), "line: links back into 残す・戻る (saved + reports)");
assert.ok(!/最近の診断/.test(line), "line: no 診断 self-description (past checks are チェック)");

// ── Part B — /support + /en/support render inside the branded editorial shell ──
const appShell = read("app/components/AppShell.tsx");
assert.ok(!appShell.includes('"/support"') && !appShell.includes('"/en/support"'), "support routes removed from AppShell suppression");
const supportWorkspace = read("app/components/SupportWorkspace.tsx");
assert.ok(supportWorkspace.includes("EditorialShell"), "SupportWorkspace: uses the editorial shell");
assert.ok(supportWorkspace.includes("/admin-entry/reset"), "SupportWorkspace: reset/access helper preserved");

// ── Part B/D — editorial trust + English pages on the shared editorial system ──
const EDITORIAL_PAGES = [
  "app/privacy/page.tsx",
  "app/terms/page.tsx",
  "app/company/page.tsx",
  "app/contact/page.tsx",
  "app/reset-password/page.tsx",
  "app/en/page.tsx",
  "app/en/about/page.tsx",
  "app/en/contact/page.tsx",
  "app/en/privacy/page.tsx",
  "app/en/legal/page.tsx",
  "app/en/partners/page.tsx",
];
for (const f of EDITORIAL_PAGES) {
  assert.ok(has(f), `${f} exists`);
  const src = read(f);
  assert.ok(src.includes("EditorialShell"), `${f}: uses EditorialShell`);
  assert.ok(!src.includes("tsuru-logo") && !src.includes("yorisou-logo-primary"), `${f}: no crane / raster logo`);
  assert.ok(!src.includes("MvpCard") && !src.includes("MvpSection") && !src.includes("MvpPill"), `${f}: legacy MvpSurface removed`);
  for (const v of VAGUE) assert.ok(!src.includes(v), `${f}: no vague status "${v}"`);
}

// English legal routes to the authoritative Japanese documents, honestly.
const enLegal = read("app/en/legal/page.tsx");
assert.ok(enLegal.includes("/terms") && enLegal.includes("/privacy"), "en/legal: links canonical JA terms + privacy");
const enPrivacy = read("app/en/privacy/page.tsx");
assert.ok(enPrivacy.includes("/privacy"), "en/privacy: points to the authoritative JA policy");

// ── Part D — English Option B routes resolve to the editorial (light) surface ──
const surface = read("app/lib/publicSurface.ts");
assert.ok(surface.includes("EN_EDITORIAL_EXACT"), "publicSurface: EN editorial set present");
for (const r of ["/en", "/en/about", "/en/contact", "/en/privacy", "/en/legal", "/en/partners"]) {
  assert.equal(surfaceFamily(r), "editorial", `${r} resolves to editorial`);
  assert.equal(isImmersive(r), false, `${r} is not immersive (light shell)`);
}
// Japanese immersive product routes are unchanged.
for (const r of ["/", "/tests", "/reports", "/experiences", "/co-design"]) {
  assert.equal(isImmersive(r), true, `${r} stays immersive`);
}

// ── Part D — the English nav points at the supported English routes ──
const header = read("app/components/SiteHeader.tsx");
for (const href of ["/en/about", "/en/partners", "/en/contact", "/en/privacy", "/en/legal"]) {
  assert.ok(header.includes(`href: "${href}"`), `header EN nav includes ${href}`);
}
assert.ok(header.includes("isImmersive(pathname)"), "header tone resolves from the actual path (fixes EN dark/light mismatch)");

console.log("AIX-3D-1 completion contract checks passed");
