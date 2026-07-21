// PPR-1 — SERVER-ONLY route access resolver for the DCI/YV private Production pilot.
// This is the single place that composes the two independent gates for a request:
//   • NON-production (local / test / vercel_preview): the existing Preview gate
//     (dailyCheckInAccess / yorisouValuesAccess) governs visibility, UNCHANGED. The
//     viewer is resolved so downstream owner-scoping / anonymous behavior is exactly
//     as before (anonymous → still 401 on the persisted APIs; anonymous score still
//     works on Preview).
//   • production: the Preview gate denies (denied_production), so ONLY the Production
//     private-pilot gate applies — allowed solely for an authenticated Founder/Admin
//     with the exact private-pilot flag on. Everyone else resolves to NOT allowed,
//     and the caller returns a route-concealing 404.
// There is no fallback between the gates; production is served only by the pilot gate.
//
// Founder/Admin identity is resolved via the existing server-side mechanism
// (viewerHasAdminAccess over the validated session) — never from query params,
// client state, unvalidated cookies, email guessing, route secrecy or Preview creds.
// Neither the decision nor any Founder/Admin identifier is returned to the browser.

import { getViewerContext, type ViewerContext } from "@/lib/server/yorisouAuth";
import { viewerHasAdminAccess } from "@/lib/server/foundation/access";
import { dailyCheckInAccess } from "@/lib/yorisou/methods/daily-check-in/access";
import { yorisouValuesAccess } from "@/lib/yorisou/methods/yorisou-values/access";
import { deploymentContext } from "./deploymentContext";
import { cpv1ProductionPilotAccess, type ProductionPilotFlag } from "./productionPilot";

export interface PilotRouteResolution {
  allowed: boolean;
  // Resolved viewer when allowed (used for owner-scoping). Null when denied.
  viewer: ViewerContext | null;
}

async function resolve(previewAllowed: boolean, requiredFlag: ProductionPilotFlag): Promise<PilotRouteResolution> {
  if (deploymentContext() === "production") {
    // Production: ONLY the Founder/Admin private-pilot path (Preview gate denies prod).
    const viewer = await getViewerContext();
    const authenticated = Boolean(viewer.account?.id || viewer.legacyAccount?.id);
    const isFounderAdmin = authenticated && viewerHasAdminAccess(viewer).allowed;
    const decision = cpv1ProductionPilotAccess({
      authenticated,
      isFounderAdmin,
      routeAuthorized: true, // this surface owns the exact requiredFlag it passes
      requiredFlag,
    });
    return { allowed: decision.allowed, viewer: decision.allowed ? viewer : null };
  }
  // Non-production: existing Preview/dev gate governs visibility (unchanged).
  if (!previewAllowed) return { allowed: false, viewer: null };
  const viewer = await getViewerContext();
  return { allowed: true, viewer };
}

export function resolveDailyCheckInRouteAccess(): Promise<PilotRouteResolution> {
  return resolve(dailyCheckInAccess().allowed, "dci_daily_check_in_private_pilot");
}

export function resolveYorisouValuesRouteAccess(): Promise<PilotRouteResolution> {
  return resolve(yorisouValuesAccess().allowed, "yorisou_values_private_pilot");
}
