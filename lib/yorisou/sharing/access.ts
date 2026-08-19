// SHR-1 — SERVER-SIDE env gate for the formal sharing.core surfaces (ShareObject flow + public
// deep links). Same shape and reasons as the DD-1 and OSF-1 gates: pure over server-only env,
// composed with viewer facts at the route layer, never client-side hiding.
//
// THE DEFAULT IS DISABLED, and the production lever is deliberately NOT the Founder/Admin pilot
// mechanism: a public deep link must eventually be readable by recipients who are not Founder or
// Admin, so production activation is its own explicit server-side switch
// (`YORISOU_SHARING_PUBLIC_ENABLED=true`) — a Founder act, absent by default, set nowhere by the
// package that introduces it.
//
//   production      : CLOSED unless YORISOU_SHARING_PUBLIC_ENABLED is exactly "true".
//   unknown context : CLOSED (fail-closed).
//   vercel preview  : CLOSED unless the exact dev flag `sharing_core_preview` is set.
//   local / test    : OPEN, for implementation acceptance.
//
// SCHEMA READINESS IS SEPARATE, as everywhere else in this repository: no sharing table is touched
// (owner flows AND public reads) until an operator declares the SHR-1 migration applied, so no
// surface ever dead-ends into a database error.

import { deploymentContext, isDevFlagEnabled } from "@/lib/cpv1/deploymentContext";

/** The dev flag that opens the formal sharing flow on Vercel Preview. Absent by default. */
export const SHARING_PREVIEW_FLAG = "sharing_core_preview";

/** The explicit production enable switch. A Founder act; never set by code or CI. */
export const SHARING_PUBLIC_ENABLED_ENV = "YORISOU_SHARING_PUBLIC_ENABLED";

/** Operator declaration that the SHR-1 migration has been applied to this deployment's database. */
export const SHARING_SCHEMA_READY_ENV = "YORISOU_SHARING_SCHEMA_READY";

export type SharingAccess =
  | { allowed: true; reason: "trusted_local" | "trusted_test" | "preview_flag_on" | "production_enabled" }
  | { allowed: false; reason: "denied_production" | "denied_unknown_context" | "denied_flag_off" };

export function sharingCoreAccess(env: Record<string, string | undefined> = process.env): SharingAccess {
  const context = deploymentContext(env);
  if (context === "local") return { allowed: true, reason: "trusted_local" };
  if (context === "test") return { allowed: true, reason: "trusted_test" };
  if (context === "vercel_preview") {
    if (isDevFlagEnabled(SHARING_PREVIEW_FLAG, env)) return { allowed: true, reason: "preview_flag_on" };
    return { allowed: false, reason: "denied_flag_off" };
  }
  if (context === "production") {
    if ((env[SHARING_PUBLIC_ENABLED_ENV] ?? "").trim().toLowerCase() === "true") {
      return { allowed: true, reason: "production_enabled" };
    }
    return { allowed: false, reason: "denied_production" };
  }
  return { allowed: false, reason: "denied_unknown_context" };
}

/** Whether the operator has declared the SHR-1 migration applied. Not a feature switch. */
export function sharingSchemaReady(env: Record<string, string | undefined> = process.env): boolean {
  return (env[SHARING_SCHEMA_READY_ENV] ?? "").trim().toLowerCase() === "true";
}

/** The one question every sharing surface asks: may this deployment touch sharing at all? */
export function sharingOperational(env: Record<string, string | undefined> = process.env): boolean {
  return sharingCoreAccess(env).allowed && sharingSchemaReady(env);
}
