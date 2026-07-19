// CPV1-R1 §10 — trusted deployment-context + reusable server-side Preview access.
//
// INVOKE FROM SERVER CONTEXT ONLY. This module is pure (every input is a
// parameter; it holds NO Founder/Admin identifiers and no secrets), so it is
// unit-testable — but callers MUST resolve `authenticated` / `isFounderAdmin` /
// `routeAuthorized` server-side (e.g. via requireAdminRequestViewer) and must not
// ship those values or the decision to the browser. The flag env
// (YORISOU_CPV1_DEV_FLAGS, VERCEL_ENV) is server-only (not NEXT_PUBLIC_), so it is
// empty in client bundles and this gate defaults to denied there.
//
// The old flag model denied every flag whenever NODE_ENV === "production". That is
// not a truthful Preview model: Vercel Preview normally runs a PRODUCTION-mode
// framework build, so NODE_ENV is "production" there too. Instead we derive the
// deployment context from TRUSTED server-side signals (never client input / query
// params), and gate sensitive CPV1 Preview surfaces behind a full authorization
// decision. TRUE production is always denied regardless of configured flags.
//
// This module is server-only: Founder/Admin identity and the decision never reach
// browser code.

export type DeploymentContext = "local" | "test" | "vercel_preview" | "production";

// A minimal env shape (process.env is assignable to this). Kept loose so the
// derivation is unit-testable with plain literals.
type EnvLike = Record<string, string | undefined>;

// Derived ONLY from server-side environment. Client input / query params are never
// consulted, so a forged client environment cannot change the context.
export function deploymentContext(env: EnvLike = process.env): DeploymentContext {
  // Vercel sets VERCEL_ENV = "production" | "preview" | "development" on the server.
  const vercelEnv = (env.VERCEL_ENV || "").trim();
  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return "vercel_preview";
  // Automated test contexts.
  if (env.NODE_ENV === "test" || env.YORISOU_CI_TEST === "1" || env.VITEST) return "test";
  // A local `next start`/`next dev` has NODE_ENV production/development but NO
  // Vercel production marker — that is a LOCAL context, not production.
  return "local";
}

export function isProductionDeployment(env: EnvLike = process.env): boolean {
  return deploymentContext(env) === "production";
}

// Is the server-side CPV1 preview flag configured for this deployment? Reads a
// server-only env var; production is never considered flag-enabled.
export function cpv1PreviewFlagEnabled(env: EnvLike = process.env): boolean {
  if (deploymentContext(env) === "production") return false;
  const raw = (env.YORISOU_CPV1_DEV_FLAGS || "").trim();
  return raw.length > 0;
}

export type PreviewAccessInput = {
  authenticated: boolean; // resolved server-side from the session
  isFounderAdmin: boolean; // resolved server-side from admin authorization
  routeAuthorized: boolean; // the surface's own server-side route authorization
  env?: EnvLike; // injectable for tests
};

export type PreviewAccessDecision = {
  allowed: boolean;
  context: DeploymentContext;
  reason:
    | "allowed"
    | "denied_production"
    | "denied_flag_off"
    | "denied_unauthenticated"
    | "denied_not_admin"
    | "denied_route_unauthorized";
};

// The single, reusable authorization decision for EVERY sensitive CPV1 preview
// surface. Allowed ONLY when ALL hold:
//   1. non-production deployment context (trusted, server-side);
//   2. server-side CPV1 flag enabled;
//   3. authenticated identity;
//   4. Founder/Admin authorization;
//   5. the surface's server-side route authorization.
// TRUE production is denied even if a flag is somehow set. An unguessable Preview
// URL is never sufficient — direct access without these still denies.
export function cpv1PreviewAccess(input: PreviewAccessInput): PreviewAccessDecision {
  const env = input.env ?? process.env;
  const context = deploymentContext(env);
  if (context === "production") return { allowed: false, context, reason: "denied_production" };
  if (!cpv1PreviewFlagEnabled(env)) return { allowed: false, context, reason: "denied_flag_off" };
  if (!input.authenticated) return { allowed: false, context, reason: "denied_unauthenticated" };
  if (!input.isFounderAdmin) return { allowed: false, context, reason: "denied_not_admin" };
  if (!input.routeAuthorized) return { allowed: false, context, reason: "denied_route_unauthorized" };
  return { allowed: true, context, reason: "allowed" };
}
