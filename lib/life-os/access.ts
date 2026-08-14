// OSF-1 — SERVER-SIDE route/feature gate for the Life OS Phase 1 surfaces.
//
// Enforced in every page AND in the API route AND separately on every mutation. Client-only hiding is
// never the gate; a person who types /life into the address bar hits the same check as everyone else.
//
// WHY THIS EXISTS AT ALL. The activation audit found OSF-1 was the only closed surface in this
// repository that shipped without one. Every comparable slice — `dailyCheckInAccess`,
// `yorisouValuesAccess`, `pilotRouteAccess` — fails closed in production, so the Founder can merge
// the code and decide about exposure separately. Without an equivalent, merge and deploy were the
// same event: the moment this branch reached production, /life was live for every signed-in account
// with no lever to hold it back. That is the gap this closes.
//
// Pure module, following the deploymentContext.ts precedent: every input is server-only env
// (VERCEL_ENV and YORISOU_CPV1_DEV_FLAGS are not NEXT_PUBLIC_), so a client bundle sees an empty env
// and this fails closed there too. Unit-testable with literals, no I/O.
//
// THE DEFAULT IS DISABLED.
//   production      : CLOSED. No env var is added by this package; the route 404s.
//   unknown context : CLOSED (fail-closed, per lib/cpv1/deploymentContext.ts).
//   vercel preview  : CLOSED unless the exact dev flag `osf1_life_os_preview` is present.
//   local / test    : OPEN, for implementation acceptance.
//
// THE MUTATION GATE IS SEPARATE FROM THE READ GATE, and deliberately so. Reads degrade to an empty
// state when the database has no Life OS tables; writes cannot degrade — they fail, and a person who
// typed a reflection loses it. So `lifeOsMutationAllowed` additionally requires the schema-ready
// declaration, which is how POR-1 already separates "the code is deployed" from "the migration has
// run" (YORISOU_POR1_*_SCHEMA_READY). Until 202608140001 is applied and the flag set, the Life OS
// accepts no writes anywhere — which is what makes deploying this code to an un-migrated database
// safe rather than merely unlikely to be noticed.

import { deploymentContext, isDevFlagEnabled } from "@/lib/cpv1/deploymentContext";
import { isProductionPilotFlagEnabled } from "@/lib/cpv1/productionPilot";

export type LifeOsAccess =
  | { allowed: true; reason: "trusted_local" | "trusted_test" | "preview_flag_on" }
  | { allowed: false; reason: "denied_production" | "denied_unknown_context" | "denied_flag_off" };

/** The dev flag that opens the Life OS on Vercel Preview. Absent by default. */
export const LIFE_OS_PREVIEW_FLAG = "osf1_life_os_preview";

/**
 * The declaration that 202608140001 has been applied to the database this deployment talks to.
 *
 * Named the same way as POR-1's schema-readiness variables because it means the same thing and
 * should be recognisable as the same kind of statement: an operator asserting, out of band, that the
 * migration ran. It is not a capability switch and must never be set to open a feature — setting it
 * while the migration has not run re-creates exactly the failure it exists to prevent.
 */
export const LIFE_OS_SCHEMA_READY_ENV = "YORISOU_OSF1_LIFE_OS_SCHEMA_READY";

/** Read/route access. Governs whether the surfaces exist at all. */
export function lifeOsAccess(env: Record<string, string | undefined> = process.env): LifeOsAccess {
  const context = deploymentContext(env);
  if (context === "local") return { allowed: true, reason: "trusted_local" };
  if (context === "test") return { allowed: true, reason: "trusted_test" };
  if (context === "vercel_preview") {
    if (isDevFlagEnabled(LIFE_OS_PREVIEW_FLAG, env)) return { allowed: true, reason: "preview_flag_on" };
    return { allowed: false, reason: "denied_flag_off" };
  }
  if (context === "production") return { allowed: false, reason: "denied_production" };
  return { allowed: false, reason: "denied_unknown_context" };
}

export type LifeOsMutationAccess =
  | { allowed: true; reason: "schema_ready" }
  | { allowed: false; reason: "denied_route_closed" | "denied_schema_not_ready" };

/**
 * Write access. Strictly narrower than read access: the route may be open while writes are refused.
 *
 * A refusal here is a clean, named 503 from the API, not a PostgREST error surfaced as a 500 — the
 * person is told the feature is not accepting entries yet, before they have typed anything into a
 * seven-question flow.
 */
export function lifeOsMutationAccess(
  env: Record<string, string | undefined> = process.env,
): LifeOsMutationAccess {
  if (!lifeOsAccess(env).allowed) return { allowed: false, reason: "denied_route_closed" };
  const declared = (env[LIFE_OS_SCHEMA_READY_ENV] ?? "").trim().toLowerCase();
  if (declared !== "true") return { allowed: false, reason: "denied_schema_not_ready" };
  return { allowed: true, reason: "schema_ready" };
}

// ─────────────────────────────────────────────────────────────────────────────
// THE FOUR ACTIVATION STATES
// ─────────────────────────────────────────────────────────────────────────────
//
//   OFF      the default, everywhere. Routes 404, no write is attempted.
//   INTERNAL true production, Founder/Admin ONLY. Uses the EXISTING production-pilot
//            gate (lib/cpv1/productionPilot.ts, token `osf1_life_os_internal`) rather than
//            widening lifeOsAccess — because that module already encodes the rule that a
//            production pilot is not public activation, and duplicating it here would create a
//            second, weaker answer to the same question.
//   PREVIEW  non-production only, dev flag `osf1_life_os_preview`. What lifeOsAccess already did.
//   PUBLIC   everyone. NOT IMPLEMENTED, and deliberately not implementable from this module:
//            reaching it is a Gate 5 event (staged rollout plan, kill switches tested LIVE,
//            consent-comprehension copy verified verbatim, Founder acceptance recorded).
//            `lifeOsActivationState` can NAME it so the state machine is complete and testable,
//            but no environment variable in this codebase returns it. Adding one is a Founder act.
//
// WHY THE STATE IS SEPARATE FROM `lifeOsAccess`. Every existing call site reads `.allowed` as a
// boolean and must keep failing closed for any state it does not recognise. So the state function
// is additive: it REPORTS which state is in effect, and `lifeOsAccess` remains the single
// authority on whether the non-production routes open. INTERNAL is answered by its own function
// because it needs the caller's authenticated Founder/Admin facts, which a pure env check cannot
// see.

export type LifeOsActivationState = "OFF" | "INTERNAL" | "PREVIEW" | "PUBLIC";

/**
 * Which activation state the environment describes.
 *
 * Reports INTERNAL when true production carries the pilot token — but INTERNAL still requires the
 * caller to prove an authenticated Founder/Admin through `lifeOsInternalAccess`. A state of
 * INTERNAL is a statement about the environment, never about the person.
 */
export function lifeOsActivationState(
  env: Record<string, string | undefined> = process.env,
): LifeOsActivationState {
  // PUBLIC is unreachable by construction: nothing sets it. Named so the machine is complete.
  if (isProductionPilotFlagEnabled("osf1_life_os_internal", env)) return "INTERNAL";
  if (lifeOsAccess(env).allowed) return "PREVIEW";
  return "OFF";
}

export type LifeOsInternalDecision =
  | { allowed: true; reason: "internal_founder_admin" }
  | { allowed: false; reason: "not_production" | "flag_off" | "not_authenticated" | "not_founder_admin" };

/**
 * INTERNAL access, in true production only, for an authenticated Founder/Admin.
 *
 * The caller resolves `authenticated` and `isFounderAdmin` server-side and passes them in — this
 * module holds no identifiers, exactly as productionPilot.ts requires of its callers.
 */
export function lifeOsInternalAccess(
  input: { authenticated: boolean; isFounderAdmin: boolean },
  env: Record<string, string | undefined> = process.env,
): LifeOsInternalDecision {
  if (deploymentContext(env) !== "production") return { allowed: false, reason: "not_production" };
  if (!isProductionPilotFlagEnabled("osf1_life_os_internal", env)) return { allowed: false, reason: "flag_off" };
  if (!input.authenticated) return { allowed: false, reason: "not_authenticated" };
  if (!input.isFounderAdmin) return { allowed: false, reason: "not_founder_admin" };
  return { allowed: true, reason: "internal_founder_admin" };
}
