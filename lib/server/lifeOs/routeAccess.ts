import "server-only";

// OSF-1 §14/§15 — THE authoritative Life OS access resolver.
//
// ─────────────────────────────────────────────────────────────────────────────
// WHY THIS EXISTS
// ─────────────────────────────────────────────────────────────────────────────
//
// `lifeOsActivationState()` has named four states since the activation package: OFF, INTERNAL,
// PREVIEW, PUBLIC. Only two of them did anything. Every surface gated on `lifeOsAccess()`, a pure
// env function that returns `denied_production` in true production unconditionally — so with the
// INTERNAL pilot flag set and an authenticated Founder present, `/life` still 404'd. INTERNAL was
// indistinguishable from OFF, and `lifeOsInternalAccess()` had zero call sites outside its own test.
//
// The reason the gap existed is real rather than careless: INTERNAL cannot be decided from the
// environment alone. It needs the caller's authenticated Founder/Admin facts, and `lifeOsAccess()`
// is deliberately a pure, synchronous, client-safe module. So the answer is not to widen that
// function — it is to compose it, server-side, with the viewer, exactly as PPR-1 already does for
// the DCI/YV production pilots in lib/cpv1/pilotRouteAccess.ts. That module is the precedent this
// one follows on purpose: a second, differently-shaped answer to "may this person see the pilot?"
// is how two gates drift into two policies.
//
// ─────────────────────────────────────────────────────────────────────────────
// THE ORDER, WHICH IS A SECURITY PROPERTY AND NOT A STYLE CHOICE
// ─────────────────────────────────────────────────────────────────────────────
//
// The environment is consulted BEFORE the session, always. When the state is OFF, this returns
// denied without ever resolving a viewer — so a closed deployment answers identically for a
// signed-in and a signed-out caller and reveals nothing about who is asking. Only INTERNAL and the
// non-production states get as far as reading a cookie, because only they can be answered with one.
//
// PUBLIC is not reachable from here. `lifeOsActivationState()` can name it so the machine is
// complete and testable, but nothing in this codebase returns it, and this resolver treats any state
// it does not explicitly allow as denied. Reaching PUBLIC is a Gate 5 act, not a code path.

import { getViewerContext, type ViewerContext } from "@/lib/server/yorisouAuth";
import { viewerHasAdminAccess } from "@/lib/server/foundation/access";
import {
  lifeOsAccess,
  lifeOsActivationState,
  lifeOsInternalAccess,
  LIFE_OS_SCHEMA_READY_ENV,
  type LifeOsActivationState,
} from "@/lib/life-os/access";
import { deploymentContext } from "@/lib/cpv1/deploymentContext";

export type LifeOsDenialReason =
  | "off"
  | "not_authenticated"
  | "not_founder_admin"
  | "preview_flag_off"
  | "unknown_context";

export type LifeOsRouteResolution =
  | { allowed: true; state: LifeOsActivationState; viewer: ViewerContext; accountId: string | null }
  | { allowed: false; state: LifeOsActivationState; reason: LifeOsDenialReason; viewer: null; accountId: null };

const DENY = (state: LifeOsActivationState, reason: LifeOsDenialReason): LifeOsRouteResolution => ({
  allowed: false,
  state,
  reason,
  viewer: null,
  accountId: null,
});

/**
 * The one function every page, API route, mutation path and navigation check must use.
 *
 * Returns the resolved viewer when allowed, so callers do not resolve it a second time and cannot
 * accidentally scope data to a different identity than the one that passed the gate.
 */
export async function resolveLifeOsRouteAccess(): Promise<LifeOsRouteResolution> {
  const state = lifeOsActivationState();

  // TRUE PRODUCTION. The env gate denies production outright, so INTERNAL is the only way in, and
  // it is decided by the person rather than the deployment.
  if (deploymentContext() === "production") {
    if (state !== "INTERNAL") return DENY(state, "off");
    const viewer = await getViewerContext();
    const authenticated = Boolean(viewer.account?.id || viewer.legacyAccount?.id);
    // Founder/Admin comes from the validated session through the existing server-side mechanism —
    // never a query parameter, a body field, a header, an unvalidated cookie, or an email guess.
    // There is no role claim a caller can supply, because no code here reads one.
    const isFounderAdmin = authenticated && viewerHasAdminAccess(viewer).allowed;
    const decision = lifeOsInternalAccess({ authenticated, isFounderAdmin });
    if (!decision.allowed) {
      return DENY(state, decision.reason === "not_authenticated" ? "not_authenticated" : "not_founder_admin");
    }
    return {
      allowed: true,
      state,
      viewer,
      accountId: viewer.account?.id || viewer.legacyAccount?.id || null,
    };
  }

  // NON-PRODUCTION. The existing env gate governs, unchanged: local and test are open, Vercel
  // Preview needs the exact dev flag, and an unknown context fails closed.
  const env = lifeOsAccess();
  if (!env.allowed) {
    return DENY(state, env.reason === "denied_unknown_context" ? "unknown_context" : "preview_flag_off");
  }
  const viewer = await getViewerContext();
  return {
    allowed: true,
    state,
    viewer,
    accountId: viewer.account?.id || viewer.legacyAccount?.id || null,
  };
}

export type LifeOsMutationResolution =
  | { allowed: true; accountId: string }
  | { allowed: false; reason: LifeOsDenialReason | "schema_not_ready" | "not_authenticated" };

/**
 * Write access. Strictly narrower than read access, and narrower in two independent ways: the route
 * must be open to this person, AND the operator must have declared the migration applied.
 *
 * Reads degrade to an empty state against a database with no Life OS tables. Writes cannot degrade —
 * they fail, and a person who typed a reflection loses it. So the schema declaration is required
 * before a single character of a request body is accepted.
 */
export async function resolveLifeOsMutationAccess(
  resolution?: LifeOsRouteResolution,
): Promise<LifeOsMutationResolution> {
  const route = resolution ?? (await resolveLifeOsRouteAccess());
  if (!route.allowed) return { allowed: false, reason: route.reason };
  if (!route.accountId) return { allowed: false, reason: "not_authenticated" };
  const declared = (process.env[LIFE_OS_SCHEMA_READY_ENV] ?? "").trim().toLowerCase();
  if (declared !== "true") return { allowed: false, reason: "schema_not_ready" };
  return { allowed: true, accountId: route.accountId };
}

/**
 * Navigation visibility. A separate name because the question is different: not "may this request
 * proceed" but "should this person be shown that the Life OS exists at all".
 *
 * It is the SAME decision underneath, deliberately. A navigation check with its own logic is how a
 * link appears for someone the route will then refuse — which both leaks that the feature exists and
 * hands them a dead end.
 */
export async function lifeOsVisibleInNavigation(): Promise<boolean> {
  return (await resolveLifeOsRouteAccess()).allowed;
}
