import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { connectionOperational } from "@/lib/yorisou/connection/access";
import { dissolvePair } from "@/lib/server/platform/connectionCore/service";
import { connectionRepository } from "@/lib/server/connection/store";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Context = { params: Promise<{ pairId: string }> };

// CPR-1 — EITHER participant ends the pair, permanently. The mutation also empties the comparison
// of its result-derived codes, so ending a pair removes the derived content rather than hiding it.
//
// A non-participant receives the same 404 as an unknown pair: nobody learns that a pair exists by
// trying to end it.
export async function POST(_request: Request, context: Context) {
  if (!connectionOperational()) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const { pairId } = await context.params;
  if (!UUID_RE.test(pairId)) return NextResponse.json({ error: "not_found" }, { status: 404 });

  try {
    const dissolved = await dissolvePair(accountId, pairId, connectionRepository);
    if (!dissolved) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "connection_unavailable" }, { status: 503 });
  }
}
