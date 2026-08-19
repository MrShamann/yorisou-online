// CPR-1 — SERVER-SIDE env gate for the connection.core + comparison.core surfaces (pair invites,
// the pair view, and the つながる navigation entry). Same shape and reasons as the SHR-1, DD-1 and
// OSF-1 gates: pure over server-only env, composed with viewer facts at the route layer, never
// client-side hiding.
//
// THE DEFAULT IS DISABLED. Production activation is its own explicit server-side switch
// (`YORISOU_CONNECTION_PUBLIC_ENABLED=true`) — a Founder act, absent by default, set nowhere by
// the package that introduces it. It is deliberately NOT the Founder/Admin pilot mechanism: a pair
// has two participants, and the second one will not be Founder or Admin.
//
//   production      : CLOSED unless YORISOU_CONNECTION_PUBLIC_ENABLED is exactly "true".
//   unknown context : CLOSED (fail-closed).
//   vercel preview  : CLOSED unless the exact dev flag `connection_pair_preview` is set.
//   local / test    : OPEN, for implementation acceptance.
//
// TWO SCHEMA READINESS DECLARATIONS, NOT ONE. connection.core and comparison.core are separate
// capabilities with separate owned data, so each has its own operator declaration. A pair
// ACCEPTANCE writes both families and therefore requires both; an operator who has declared only
// one gets a closed surface rather than a half-written pair.

import { deploymentContext, isDevFlagEnabled } from "@/lib/cpv1/deploymentContext";

/** The dev flag that opens the pair flow on Vercel Preview. Absent by default. */
export const CONNECTION_PREVIEW_FLAG = "connection_pair_preview";

/** The explicit production enable switch. A Founder act; never set by code or CI. */
export const CONNECTION_PUBLIC_ENABLED_ENV = "YORISOU_CONNECTION_PUBLIC_ENABLED";

/** Operator declaration that the CPR-1 connection tables exist in this deployment's database. */
export const CONNECTION_SCHEMA_READY_ENV = "YORISOU_CONNECTION_SCHEMA_READY";

/** Operator declaration that the CPR-1 comparison table exists in this deployment's database. */
export const COMPARISON_SCHEMA_READY_ENV = "YORISOU_COMPARISON_SCHEMA_READY";

export type ConnectionAccess =
  | { allowed: true; reason: "trusted_local" | "trusted_test" | "preview_flag_on" | "production_enabled" }
  | { allowed: false; reason: "denied_production" | "denied_unknown_context" | "denied_flag_off" };

export function connectionCoreAccess(env: Record<string, string | undefined> = process.env): ConnectionAccess {
  const context = deploymentContext(env);
  if (context === "local") return { allowed: true, reason: "trusted_local" };
  if (context === "test") return { allowed: true, reason: "trusted_test" };
  if (context === "vercel_preview") {
    if (isDevFlagEnabled(CONNECTION_PREVIEW_FLAG, env)) return { allowed: true, reason: "preview_flag_on" };
    return { allowed: false, reason: "denied_flag_off" };
  }
  if (context === "production") {
    if ((env[CONNECTION_PUBLIC_ENABLED_ENV] ?? "").trim().toLowerCase() === "true") {
      return { allowed: true, reason: "production_enabled" };
    }
    return { allowed: false, reason: "denied_production" };
  }
  return { allowed: false, reason: "denied_unknown_context" };
}

/** Whether the operator has declared the CPR-1 connection tables applied. Not a feature switch. */
export function connectionSchemaReady(env: Record<string, string | undefined> = process.env): boolean {
  return (env[CONNECTION_SCHEMA_READY_ENV] ?? "").trim().toLowerCase() === "true";
}

/** Whether the operator has declared the CPR-1 comparison table applied. Not a feature switch. */
export function comparisonSchemaReady(env: Record<string, string | undefined> = process.env): boolean {
  return (env[COMPARISON_SCHEMA_READY_ENV] ?? "").trim().toLowerCase() === "true";
}

/**
 * The one question every connection surface asks. Pair acceptance writes a pair AND a comparison
 * in one transaction, so both declarations are required — there is no useful half-ready state.
 */
export function connectionOperational(env: Record<string, string | undefined> = process.env): boolean {
  return connectionCoreAccess(env).allowed && connectionSchemaReady(env) && comparisonSchemaReady(env);
}

/**
 * Whether the P5 derivative lifecycle exists in this database, which is what decides whether
 * assessment erasure must route through the erase-with-derivatives seam. Deliberately independent
 * of the feature gate: a deployment that ran the migration and then switched the feature OFF still
 * has pairs in its tables, and erasing a source must still clear them.
 */
export function connectionDerivativeSchemaReady(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return connectionSchemaReady(env) && comparisonSchemaReady(env);
}
