// PPR-1 — Production PRIVATE-pilot gate (Founder/Admin-only), SEPARATE from the
// Preview dev-flag gate. INVOKE FROM SERVER CONTEXT ONLY. This module is pure —
// every input is a parameter; it holds NO Founder/Admin identifiers and no secrets
// — so it is unit-testable. Callers MUST resolve `authenticated` / `isFounderAdmin`
// / `routeAuthorized` server-side and must never ship those values, the decision,
// or the flag env to the browser.
//
// This gate is DISTINCT from `cpv1PreviewAccess()` and from `dailyCheckInAccess()`/
// `yorisouValuesAccess()`:
//   • The Preview gates authorize NON-production contexts (local/test/vercel_preview)
//     under YORISOU_CPV1_DEV_FLAGS. They ALWAYS deny production and unknown.
//   • This Production-pilot gate authorizes ONLY true `production`, under a SEPARATE
//     env var (YORISOU_PRIVATE_PILOT_FLAGS) and separate exact tokens, and only for
//     an authenticated Founder/Admin on an authorized route. It denies every
//     non-production context (local/test/vercel_preview/unknown).
// There is NO fallback or ambiguity between the two gates: production is served only
// by this gate; non-production only by the Preview gates.
//
// Public method availability is UNCHANGED by this gate: a private Production pilot is
// not public activation. The Method Registry continues to report these methods as
// non-public regardless of this flag.

import { deploymentContext, type DeploymentContext } from "./deploymentContext";

// A minimal env shape (process.env is assignable). Kept loose for unit tests.
type EnvLike = Record<string, string | undefined>;

// The Production private-pilot flags — EXACT tokens only (11A.4-style). Unknown
// values, `true`, `1`, typos and client parameters must NEVER authorize access.
export const PRODUCTION_PILOT_FLAGS = [
  "dci_daily_check_in_private_pilot", // DCI private Production pilot (Founder/Admin only)
  "yorisou_values_private_pilot", // YV private Production pilot (Founder/Admin only)
] as const;
export type ProductionPilotFlag = (typeof PRODUCTION_PILOT_FLAGS)[number];

// Parse YORISOU_PRIVATE_PILOT_FLAGS into the set of EXACT known tokens present.
// Unknown/garbage tokens are dropped (never authorize).
export function parseProductionPilotFlags(env: EnvLike = process.env): Set<ProductionPilotFlag> {
  const raw = (env.YORISOU_PRIVATE_PILOT_FLAGS || "").trim();
  const out = new Set<ProductionPilotFlag>();
  if (!raw) return out;
  const known = new Set<string>(PRODUCTION_PILOT_FLAGS);
  for (const tok of raw.split(",").map((t) => t.trim()).filter(Boolean)) {
    if (known.has(tok)) out.add(tok as ProductionPilotFlag);
  }
  return out;
}

// A private-pilot flag is enabled ONLY in true production. In every other context
// (local/test/vercel_preview/unknown) it is false regardless of the env var, so the
// Production pilot can never be turned on outside production.
export function isProductionPilotFlagEnabled(flag: ProductionPilotFlag, env: EnvLike = process.env): boolean {
  if (deploymentContext(env) !== "production") return false;
  return parseProductionPilotFlags(env).has(flag);
}

export interface ProductionPilotAccessInput {
  authenticated: boolean; // resolved server-side from the validated session
  isFounderAdmin: boolean; // resolved server-side from the admin authorization
  routeAuthorized: boolean; // the surface's own server-side route authorization
  requiredFlag: ProductionPilotFlag; // the EXACT flag this surface requires
  env?: EnvLike; // injectable for tests
}

export type ProductionPilotReason =
  | "allowed"
  | "denied_not_production"
  | "denied_flag_off"
  | "denied_unauthenticated"
  | "denied_not_admin"
  | "denied_route_unauthorized";

export interface ProductionPilotDecision {
  allowed: boolean;
  context: DeploymentContext;
  reason: ProductionPilotReason;
}

// Allowed ONLY when ALL hold: context is true production, the EXACT required flag is
// enabled, the caller is authenticated, is a Founder/Admin, and the route is
// authorized. Short-circuits in a fixed order; production+flag-off, wrong flag,
// anonymous, non-admin and route-unauthorized all deny — as do local/test/preview/
// unknown (denied_not_production).
export function cpv1ProductionPilotAccess(input: ProductionPilotAccessInput): ProductionPilotDecision {
  const env = input.env ?? process.env;
  const context = deploymentContext(env);
  if (context !== "production") return { allowed: false, context, reason: "denied_not_production" };
  if (!isProductionPilotFlagEnabled(input.requiredFlag, env)) return { allowed: false, context, reason: "denied_flag_off" };
  if (!input.authenticated) return { allowed: false, context, reason: "denied_unauthenticated" };
  if (!input.isFounderAdmin) return { allowed: false, context, reason: "denied_not_admin" };
  if (!input.routeAuthorized) return { allowed: false, context, reason: "denied_route_unauthorized" };
  return { allowed: true, context, reason: "allowed" };
}
