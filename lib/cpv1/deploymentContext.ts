// CPV1-R1 §10 (+ R1 Part-B 11A.3 fail-closed context, 11A.4 exact-flag) —
// trusted deployment-context + reusable server-side Preview access.
//
// INVOKE FROM SERVER CONTEXT ONLY. This module is pure (every input is a
// parameter; it holds NO Founder/Admin identifiers and no secrets), so it is
// unit-testable — but callers MUST resolve `authenticated` / `isFounderAdmin` /
// `routeAuthorized` server-side and must not ship those values or the decision to
// the browser. The flag env (YORISOU_CPV1_DEV_FLAGS, VERCEL_ENV) is server-only
// (not NEXT_PUBLIC_), so it is empty in client bundles and this gate defaults to
// denied there.
//
// This module is the SINGLE interpretation of deployment context AND CPV1 dev
// flags (11A.4): flags.ts delegates here, so there are never two flag readings.
//
// 11A.3 — the context FAILS CLOSED. Only an explicit trusted marker (Vercel's own
// preview/production/development signal, an automated-test marker, or the explicit
// YORISOU_LOCAL_DEV local-dev marker) yields a known context. Anything else —
// unknown hosted env, misconfigured Vercel, a CI runner without markers, a future
// self-hosted production — is `unknown`, and `unknown` (like `production`) ALWAYS
// denies sensitive CPV1 access.

export type DeploymentContext = "local" | "test" | "vercel_preview" | "production" | "unknown";

// The CPV1 private-development flags (single definition; re-exported by flags.ts).
export type Cpv1DevFlag =
  | "cpv1_method_universe_preview" // show rights-blocked method registry in dev tools only
  | "cpv1_understanding_model_ui" // source-separated understanding surfaces (dev)
  | "cpv1_companion_preview" // Companion architecture preview (dev)
  | "cpv1_community_preview" // community architecture preview (dev)
  | "cpv1_archive_legacy_preview"; // Archive/Legacy architecture preview (dev)

export const CPV1_DEV_FLAGS: readonly Cpv1DevFlag[] = [
  "cpv1_method_universe_preview",
  "cpv1_understanding_model_ui",
  "cpv1_companion_preview",
  "cpv1_community_preview",
  "cpv1_archive_legacy_preview",
];

// A minimal env shape (process.env is assignable to this). Kept loose so the
// derivation is unit-testable with plain literals.
type EnvLike = Record<string, string | undefined>;

// Derived ONLY from server-side environment. Client input / query params are never
// consulted, so a forged client environment cannot change the context. Fails closed
// to `unknown` (11A.3).
export function deploymentContext(env: EnvLike = process.env): DeploymentContext {
  // Vercel sets VERCEL_ENV = "production" | "preview" | "development" on the server.
  const vercelEnv = (env.VERCEL_ENV || "").trim();
  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return "vercel_preview";
  // Automated test contexts (explicit markers only).
  if (env.NODE_ENV === "test" || env.YORISOU_CI_TEST === "1" || env.VITEST) return "test";
  // Local development ONLY with an explicit trusted marker: Vercel's own dev
  // signal, a dev-mode build (NODE_ENV=development, set by `next dev` — never by
  // hosted production), or the deliberate YORISOU_LOCAL_DEV opt-in. A bare
  // `next start` with NODE_ENV=production and NO marker is NOT trusted as local —
  // it is `unknown` (fail closed).
  if (vercelEnv === "development" || env.NODE_ENV === "development" || env.YORISOU_LOCAL_DEV === "1") return "local";
  return "unknown"; // fail closed
}

export function isTrueProduction(env: EnvLike = process.env): boolean {
  return deploymentContext(env) === "production";
}

export function isProductionDeployment(env: EnvLike = process.env): boolean {
  return deploymentContext(env) === "production";
}

// 11A.4 — the SINGLE flag parser. Only EXACT known flag tokens count; any other
// token (an unknown flag, "false", "0", "1", "true", a typo) is ignored and never
// authorizes anything.
export function parseDevFlags(env: EnvLike = process.env): Set<Cpv1DevFlag> {
  const raw = (env.YORISOU_CPV1_DEV_FLAGS || "").trim();
  const out = new Set<Cpv1DevFlag>();
  if (!raw) return out;
  const known = new Set<string>(CPV1_DEV_FLAGS);
  for (const tok of raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)) {
    if (known.has(tok)) out.add(tok as Cpv1DevFlag);
  }
  return out;
}

// A specific flag is ENABLED only in a non-production, non-unknown context AND when
// that EXACT known flag is configured. This is the one function flags.ts wraps.
export function isDevFlagEnabled(flag: Cpv1DevFlag, env: EnvLike = process.env): boolean {
  const ctx = deploymentContext(env);
  if (ctx === "production" || ctx === "unknown") return false;
  return parseDevFlags(env).has(flag);
}

// Any known flag configured in a trusted non-production context (coarse "is any
// CPV1 preview surface enabled at all" check).
export function anyDevFlagEnabled(env: EnvLike = process.env): boolean {
  const ctx = deploymentContext(env);
  if (ctx === "production" || ctx === "unknown") return false;
  return parseDevFlags(env).size > 0;
}

export type PreviewAccessInput = {
  authenticated: boolean; // resolved server-side from the session
  isFounderAdmin: boolean; // resolved server-side from admin authorization
  routeAuthorized: boolean; // the surface's own server-side route authorization
  requiredFlag: Cpv1DevFlag; // 11A.4 — the EXACT flag this surface requires
  env?: EnvLike; // injectable for tests
};

export type PreviewAccessDecision = {
  allowed: boolean;
  context: DeploymentContext;
  reason:
    | "allowed"
    | "denied_production"
    | "denied_unknown_context"
    | "denied_flag_off"
    | "denied_unauthenticated"
    | "denied_not_admin"
    | "denied_route_unauthorized";
};

// The single, reusable authorization decision for EVERY sensitive CPV1 preview
// surface. Allowed ONLY when ALL hold:
//   1. a trusted, non-production, non-unknown deployment context (11A.3);
//   2. the EXACT required CPV1 flag is configured (11A.4);
//   3. authenticated identity;
//   4. Founder/Admin authorization;
//   5. the surface's server-side route authorization.
// TRUE production AND unknown contexts are denied even if a flag is somehow set. An
// unguessable Preview URL is never sufficient — direct access without these denies.
export function cpv1PreviewAccess(input: PreviewAccessInput): PreviewAccessDecision {
  const env = input.env ?? process.env;
  const context = deploymentContext(env);
  if (context === "production") return { allowed: false, context, reason: "denied_production" };
  if (context === "unknown") return { allowed: false, context, reason: "denied_unknown_context" };
  if (!isDevFlagEnabled(input.requiredFlag, env)) return { allowed: false, context, reason: "denied_flag_off" };
  if (!input.authenticated) return { allowed: false, context, reason: "denied_unauthenticated" };
  if (!input.isFounderAdmin) return { allowed: false, context, reason: "denied_not_admin" };
  if (!input.routeAuthorized) return { allowed: false, context, reason: "denied_route_unauthorized" };
  return { allowed: true, context, reason: "allowed" };
}
