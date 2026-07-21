// PPR-1 — Production PRIVATE-pilot gate contract (node:assert under tsx).
// Verifies the pure gate truth table, exact-token flag parsing, cross-gate
// independence (Preview gate denies production; pilot gate denies preview), and
// that the module carries no admin identifiers or secrets.
// Run: node --import tsx lib/cpv1/__tests__/productionPilot.test.ts

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  parseProductionPilotFlags,
  isProductionPilotFlagEnabled,
  cpv1ProductionPilotAccess,
  PRODUCTION_PILOT_FLAGS,
} from "../productionPilot";
import { dailyCheckInAccess } from "../../yorisou/methods/daily-check-in/access";
import { yorisouValuesAccess } from "../../yorisou/methods/yorisou-values/access";

let passed = 0;
function check(label: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`  ✓ ${label}`);
}

const DCI = "dci_daily_check_in_private_pilot";
const YV = "yorisou_values_private_pilot";
const BOTH = `${DCI},${YV}`;

// Env fixtures. deploymentContext reads VERCEL_ENV first, so VERCEL_ENV="production"
// yields "production" regardless of the ambient NODE_ENV=test.
const prod = (flags: string) => ({ VERCEL_ENV: "production", YORISOU_PRIVATE_PILOT_FLAGS: flags });
const preview = (flags: string) => ({ VERCEL_ENV: "preview", YORISOU_PRIVATE_PILOT_FLAGS: flags });
const test = (flags: string) => ({ NODE_ENV: "test", YORISOU_PRIVATE_PILOT_FLAGS: flags });
const local = (flags: string) => ({ YORISOU_LOCAL_DEV: "1", YORISOU_PRIVATE_PILOT_FLAGS: flags });
const unknownCtx = (flags: string) => ({ YORISOU_PRIVATE_PILOT_FLAGS: flags }); // no marker → unknown

console.log("PPR-1 — Production private-pilot gate");

// ── Flag parsing: EXACT tokens only ────────────────────────────────────────────
check("parse: exact tokens accepted; unknown/true/1/typos dropped", () => {
  assert.deepEqual([...parseProductionPilotFlags({ YORISOU_PRIVATE_PILOT_FLAGS: BOTH })].sort(), [DCI, YV].sort());
  assert.deepEqual([...parseProductionPilotFlags({ YORISOU_PRIVATE_PILOT_FLAGS: "" })], []);
  assert.deepEqual([...parseProductionPilotFlags({})], []);
  assert.deepEqual([...parseProductionPilotFlags({ YORISOU_PRIVATE_PILOT_FLAGS: "true,1,dci_daily_check_in_privatepilot,yorisou_values" })], []);
  assert.deepEqual([...parseProductionPilotFlags({ YORISOU_PRIVATE_PILOT_FLAGS: ` ${DCI} , bogus ` })], [DCI]);
});

// ── Flag enablement is production-only ─────────────────────────────────────────
check("flag enabled ONLY in production (never local/test/preview/unknown)", () => {
  assert.equal(isProductionPilotFlagEnabled(DCI, prod(BOTH)), true);
  assert.equal(isProductionPilotFlagEnabled(YV, prod(BOTH)), true);
  assert.equal(isProductionPilotFlagEnabled(DCI, prod(YV)), false); // wrong flag only
  assert.equal(isProductionPilotFlagEnabled(DCI, prod("")), false); // flag off
  assert.equal(isProductionPilotFlagEnabled(DCI, preview(BOTH)), false);
  assert.equal(isProductionPilotFlagEnabled(DCI, test(BOTH)), false);
  assert.equal(isProductionPilotFlagEnabled(DCI, local(BOTH)), false);
  assert.equal(isProductionPilotFlagEnabled(DCI, unknownCtx(BOTH)), false);
});

const ALL = (env: Record<string, string | undefined>, requiredFlag = DCI, over: Partial<{ authenticated: boolean; isFounderAdmin: boolean; routeAuthorized: boolean }> = {}) =>
  cpv1ProductionPilotAccess({ authenticated: true, isFounderAdmin: true, routeAuthorized: true, requiredFlag, env, ...over });

// ── The five-condition truth table ─────────────────────────────────────────────
check("ALLOWED only when production + exact flag + authenticated + admin + routeAuthorized", () => {
  const d = ALL(prod(BOTH));
  assert.equal(d.allowed, true);
  assert.equal(d.reason, "allowed");
  assert.equal(d.context, "production");
  assert.equal(ALL(prod(BOTH), YV).allowed, true);
});

check("every non-production context denies (even with flag+auth+admin) → denied_not_production", () => {
  for (const env of [preview(BOTH), test(BOTH), local(BOTH), unknownCtx(BOTH)]) {
    const d = ALL(env);
    assert.equal(d.allowed, false);
    assert.equal(d.reason, "denied_not_production");
  }
});

check("production denies: flag off / wrong flag / anonymous / non-admin / route-unauthorized", () => {
  assert.equal(ALL(prod("")).reason, "denied_flag_off");
  assert.equal(ALL(prod(YV), DCI).reason, "denied_flag_off"); // required DCI but only YV on
  assert.equal(ALL(prod(BOTH), DCI, { authenticated: false }).reason, "denied_unauthenticated");
  assert.equal(ALL(prod(BOTH), DCI, { isFounderAdmin: false }).reason, "denied_not_admin");
  assert.equal(ALL(prod(BOTH), DCI, { routeAuthorized: false }).reason, "denied_route_unauthorized");
  for (const r of ["denied_flag_off", "denied_unauthenticated", "denied_not_admin", "denied_route_unauthorized"]) {
    // none of these are allowed
    void r;
  }
  assert.equal(ALL(prod("")).allowed, false);
  assert.equal(ALL(prod(BOTH), DCI, { authenticated: false }).allowed, false);
});

// ── Cross-gate independence (no ambiguity/fallback between the two gates) ───────
check("Preview gate DENIES production (unchanged) — pilot gate is the only production path", () => {
  assert.equal(dailyCheckInAccess(prod(BOTH)).allowed, false);
  assert.equal(dailyCheckInAccess(prod(BOTH)).reason, "denied_production");
  assert.equal(yorisouValuesAccess(prod(BOTH)).allowed, false);
  assert.equal(yorisouValuesAccess(prod(BOTH)).reason, "denied_production");
});

check("Production pilot gate DENIES preview (even with the private-pilot flag set)", () => {
  assert.equal(ALL(preview(BOTH)).allowed, false);
  assert.equal(ALL(preview(BOTH)).reason, "denied_not_production");
});

check("Preview flag env does NOT enable the production pilot, and vice versa", () => {
  // A preview-flag env with NO private-pilot flag: pilot denies on production (flag off).
  assert.equal(ALL({ VERCEL_ENV: "production", YORISOU_CPV1_DEV_FLAGS: "dci_daily_check_in_preview,yorisou_values_preview" }).reason, "denied_flag_off");
});

// ── No admin identifiers / secrets baked into the module ───────────────────────
check("productionPilot.ts contains no admin email / secret material", () => {
  const src = readFileSync(fileURLToPath(new URL("../productionPilot.ts", import.meta.url)), "utf8");
  assert.ok(!/@gmail\.com|@yorisou|jy\.edward|shigeru/i.test(src), "no admin identifiers");
  assert.ok(!/eyJ[A-Za-z0-9_-]{10,}|service_role|SUPABASE_SERVICE/i.test(src), "no secret material");
  assert.equal(PRODUCTION_PILOT_FLAGS.length, 2);
});

// ── Route/API wiring: every pilot surface enforces via the server resolver ──────
const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const routeFile = (p: string) => readFileSync(`${repoRoot}${p}`, "utf8");
const DCI_ROUTES = [
  "app/tests/daily-check-in/page.tsx",
  "app/api/tests/daily-check-in/records/route.ts",
  "app/api/tests/daily-check-in/records/[date]/route.ts",
];
const YV_ROUTES = [
  "app/tests/yorisou-values/page.tsx",
  "app/api/tests/yorisou-values/assessments/route.ts",
  "app/api/tests/yorisou-values/assessments/[id]/route.ts",
  "app/api/tests/yorisou-values/score/route.ts",
];

check("every DCI route/API enforces via resolveDailyCheckInRouteAccess (no bare Preview-gate call)", () => {
  for (const p of DCI_ROUTES) {
    const src = routeFile(p);
    assert.ok(src.includes("resolveDailyCheckInRouteAccess"), `${p} must call the pilot resolver`);
    assert.ok(!/\bdailyCheckInAccess\s*\(\s*\)/.test(src), `${p} must not call the bare Preview gate`);
  }
});

check("every YV route/API (incl. anonymous score) enforces via resolveYorisouValuesRouteAccess", () => {
  for (const p of YV_ROUTES) {
    const src = routeFile(p);
    assert.ok(src.includes("resolveYorisouValuesRouteAccess"), `${p} must call the pilot resolver`);
    assert.ok(!/\byorisouValuesAccess\s*\(\s*\)/.test(src), `${p} must not call the bare Preview gate`);
  }
});

check("pilot resolver denies production unless Founder/Admin (source: production path resolves admin)", () => {
  const src = routeFile("lib/cpv1/pilotRouteAccess.ts");
  assert.ok(src.includes("viewerHasAdminAccess"), "resolver must resolve Founder/Admin server-side");
  assert.ok(src.includes("cpv1ProductionPilotAccess"), "resolver must use the production-pilot gate");
  assert.ok(/deploymentContext\(\)\s*===\s*"production"/.test(src), "production path is context-gated");
});

console.log(`\nPPR-1 production private-pilot gate: ${passed} checks passed.`);
