// YV-1 — SERVER-SIDE route/feature gate for the yorisou-values vertical slice.
// Enforced in the page AND every API route (client-only hiding is never the gate).
// Pure module (deploymentContext.ts precedent): every input is server-only env
// (VERCEL_ENV / YORISOU_CPV1_DEV_FLAGS are not NEXT_PUBLIC_), so a client bundle
// sees an empty env and this gate fails closed there; unit-testable with literals.
//
// Production: default CLOSED — no env var is added by this package; the route 404s.
// Unknown context: CLOSED (fail-closed). Local/test: open for acceptance.
// Vercel Preview: requires the exact dev flag `yorisou_values_preview` in
// YORISOU_CPV1_DEV_FLAGS (server-only). This package enables it in NO environment.

import { deploymentContext, isDevFlagEnabled } from "@/lib/cpv1/deploymentContext";

export type YorisouValuesAccess =
  | { allowed: true; reason: "trusted_local" | "trusted_test" | "preview_flag_on" }
  | { allowed: false; reason: "denied_production" | "denied_unknown_context" | "denied_flag_off" };

export function yorisouValuesAccess(env: Record<string, string | undefined> = process.env): YorisouValuesAccess {
  const context = deploymentContext(env);
  if (context === "local") return { allowed: true, reason: "trusted_local" };
  if (context === "test") return { allowed: true, reason: "trusted_test" };
  if (context === "vercel_preview") {
    if (isDevFlagEnabled("yorisou_values_preview", env)) return { allowed: true, reason: "preview_flag_on" };
    return { allowed: false, reason: "denied_flag_off" };
  }
  if (context === "production") return { allowed: false, reason: "denied_production" };
  return { allowed: false, reason: "denied_unknown_context" };
}
