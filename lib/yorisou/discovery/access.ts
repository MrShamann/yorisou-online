// DD-1 — SERVER-SIDE env gate for the Daily Discovery surfaces (今日のひとつ).
//
// Same shape and same reasons as lib/life-os/access.ts: a pure module over server-only env, so a
// client bundle sees an empty env and fails closed; every page, API route and navigation check
// composes THIS gate with viewer facts server-side, and client-only hiding is never the gate.
//
// THE DEFAULT IS DISABLED.
//   production      : CLOSED here. The only production path is the Founder/Admin private pilot
//                     (exact token `discovery_daily_symbols_private_pilot` through the existing
//                     PPR-1 mechanism), resolved with viewer facts in pilotRouteAccess — a pure
//                     env check cannot and must not answer it.
//   unknown context : CLOSED (fail-closed).
//   vercel preview  : CLOSED unless the exact dev flag `discovery_daily_symbols_preview` is set.
//   local / test    : OPEN, for implementation acceptance.
//
// SCHEMA READINESS IS SEPARATE, exactly as OSF-1/POR-1 separate "code is deployed" from "the
// migration has run": no discovery mutation is attempted until an operator declares the schema
// applied, so a person is never handed a CTA that ends in a database error.

import { deploymentContext, isDevFlagEnabled } from "@/lib/cpv1/deploymentContext";

/** The dev flag that opens Daily Discovery on Vercel Preview. Absent by default. */
export const DISCOVERY_PREVIEW_FLAG = "discovery_daily_symbols_preview";

/** The production private-pilot token (Founder/Admin only, true production, via PPR-1). */
export const DISCOVERY_PRIVATE_PILOT_FLAG = "discovery_daily_symbols_private_pilot";

/** Operator declaration that the DD-1 migration has been applied to this deployment's database. */
export const DISCOVERY_SCHEMA_READY_ENV = "YORISOU_DISCOVERY_SCHEMA_READY";

export type DiscoveryAccess =
  | { allowed: true; reason: "trusted_local" | "trusted_test" | "preview_flag_on" }
  | { allowed: false; reason: "denied_production" | "denied_unknown_context" | "denied_flag_off" };

/** Read/route access from the ENVIRONMENT alone. Production is always denied here (see header). */
export function discoveryAccess(env: Record<string, string | undefined> = process.env): DiscoveryAccess {
  const context = deploymentContext(env);
  if (context === "local") return { allowed: true, reason: "trusted_local" };
  if (context === "test") return { allowed: true, reason: "trusted_test" };
  if (context === "vercel_preview") {
    if (isDevFlagEnabled(DISCOVERY_PREVIEW_FLAG, env)) return { allowed: true, reason: "preview_flag_on" };
    return { allowed: false, reason: "denied_flag_off" };
  }
  if (context === "production") return { allowed: false, reason: "denied_production" };
  return { allowed: false, reason: "denied_unknown_context" };
}

/**
 * Whether the operator has declared the discovery schema applied. Not a feature switch: setting it
 * without running the migration re-creates exactly the failure it exists to prevent.
 */
export function discoverySchemaReady(env: Record<string, string | undefined> = process.env): boolean {
  return (env[DISCOVERY_SCHEMA_READY_ENV] ?? "").trim().toLowerCase() === "true";
}
