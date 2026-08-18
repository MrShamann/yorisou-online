import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { resolveDiscoveryRouteAccess } from "@/lib/cpv1/pilotRouteAccess";
import { discoverySchemaReady } from "@/lib/yorisou/discovery/access";
import { completeTodaysDiscovery } from "@/lib/server/platform/discoveryCore/service";
import { discoveryRepository } from "@/lib/server/discovery/store";
import { DAILY_SYMBOLS_DEFINITION } from "@/packs/yorisou/daily-symbols/pack";

export const dynamic = "force-dynamic";

// DD-1 — the ONE discovery mutation: complete today's draw for the authenticated owner, or return
// the day's canonical result unchanged. THE REQUEST BODY IS NEVER READ: result id, pack identity,
// version, date and timezone are server-derived, so a client cannot select any of them. Route
// concealment mirrors the pilot surfaces — a closed gate answers 404, revealing nothing.
export async function POST() {
  const gate = await resolveDiscoveryRouteAccess();
  if (!gate.allowed) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = gate.viewer ?? (await getViewerContext());
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  // Route open but migration not declared applied: refuse up front with a named 503, before any
  // persistence is attempted (the OSF-1 not-accepting-entries discipline).
  if (!discoverySchemaReady()) {
    return NextResponse.json({ error: "discovery_not_accepting_entries" }, { status: 503 });
  }
  try {
    const session = await completeTodaysDiscovery({
      ownerAccountId,
      definition: DAILY_SYMBOLS_DEFINITION,
      repository: discoveryRepository,
    });
    return NextResponse.json({ result_id: session.result_id, local_date: session.local_date });
  } catch {
    // Named store errors stay server-side; the person gets one honest, content-free failure.
    return NextResponse.json({ error: "discovery_unavailable" }, { status: 503 });
  }
}
