// AIX-3C — core product-domain completion contracts (source-based).
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");
const has = (p: string) => existsSync(join(root, p));
const VAGUE = ["準備中", "関心の段階", "育てている層"] as const;

// Route-family: the new domain routes are immersive (dark shell).
const surface = read("app/lib/publicSurface.ts");
for (const r of ["/reports", "/experiences", "/co-design", "/saved", "/private-state"]) {
  assert.ok(surface.includes(`"${r}"`), `publicSurface immersive includes ${r}`);
}

// Domain pages exist and use the immersive product shell (no legacy MvpSurface / crane / vague status).
const DOMAIN_FILES = [
  "app/reports/page.tsx",
  "app/co-design/page.tsx",
  "app/recommendations/view.tsx", // powers /recommendations/graph
  "app/experiences/view.tsx",
  "app/saved/SavedResultView.tsx",
  "app/saved/SavedTestList.tsx",
  "app/private-state/view.tsx",
  "app/reports/self-understanding/[publicCode]/page.tsx",
];
for (const f of DOMAIN_FILES) {
  assert.ok(has(f), `${f} exists`);
  const src = read(f);
  assert.ok(src.includes('"aix2"') || src.includes("aix2-band") || src.includes("aix2-glass") || src.includes("aix2-panel"), `${f}: uses the immersive product surface`);
  assert.ok(!src.includes("MvpCard") && !src.includes("MvpSection") && !src.includes("MvpPill") && !src.includes("MvpActionLink"), `${f}: legacy MvpSurface removed`);
  assert.ok(!src.includes("tsuru-logo"), `${f}: no crane`);
  for (const v of VAGUE) assert.ok(!src.includes(v), `${f}: no vague status "${v}"`);
}

// /co-design + /reports are real new pages (not redirect/missing).
for (const f of ["app/co-design/page.tsx", "app/reports/page.tsx"]) {
  const src = read(f);
  assert.ok(!src.includes("redirect("), `${f}: real page, not a redirect stub`);
}

// Navigation points 深める/つながる/育てる at real pages (no homepage hash).
const header = read("app/components/SiteHeader.tsx");
for (const [href, label] of [["/reports", "深める"], ["/experiences", "つながる"], ["/co-design", "育てる"]] as const) {
  assert.ok(header.includes(`href: "${href}", label: "${label}"`), `nav ${label} -> ${href}`);
}
assert.ok(!/href: "\/#(deepen|connect|improve)"/.test(header), "no primary nav hash links for domains");

// Homepage service map cues point at real domain pages.
const home = read("app/page.tsx");
for (const href of ["/saved", "/reports", "/experiences", "/co-design"]) {
  assert.ok(home.includes(`cueHref: "${href}"`), `home service map -> ${href}`);
}

// Keep domain: device-local clear control + storage truthfulness; RTR-1 save flow preserved.
const saveState = read("app/result/saveState.ts");
assert.ok(saveState.includes("clearSavedResultRecord") && saveState.includes("saveResultRecord"), "saveState: clear control added, save preserved");
const savedView = read("app/saved/SavedResultView.tsx");
assert.ok(savedView.includes("clearSavedResultRecord") && savedView.includes("この端末"), "saved: clear control + device-local storage truthfulness");

// Co-design: individual vs partner separation + no pay-to-rank + no false commerce.
const cod = read("app/co-design/page.tsx");
assert.ok(cod.includes("/partners"), "co-design links the partner pathway");
assert.ok(cod.includes("表示順は買えません"), "co-design: no pay-to-rank");
assert.ok(cod.includes("公開の出品・決済・先行販売は行いません"), "co-design: no false commerce");

// Experiences: private-by-default + optional participation; recommendation graph explains why-shown.
const exp = read("app/experiences/view.tsx");
assert.ok(exp.includes("非公開が既定") || exp.includes("PRIVATE"), "experiences: private by default");
const graph = read("app/recommendations/view.tsx");
assert.ok(graph.includes("なぜ") || graph.includes("つながり"), "graph: why-shown explanation");
assert.ok(graph.includes("キーボード"), "graph: keyboard note");

console.log("AIX-3C completion contract checks passed");
