import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { connectionOperational } from "@/lib/yorisou/connection/access";
import { cancelInvitation } from "@/lib/server/platform/connectionCore/service";
import { connectionRepository } from "@/lib/server/connection/store";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Context = { params: Promise<{ publicId: string }> };

// CPR-1 — inviter-only cancel. Idempotent and concealed: a non-inviter, an unknown id and an
// already-closed invitation all answer identically, so the endpoint is not an existence oracle.
export async function POST(_request: Request, context: Context) {
  if (!connectionOperational()) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const { publicId } = await context.params;
  if (!UUID_RE.test(publicId)) return NextResponse.json({ error: "not_found" }, { status: 404 });

  try {
    const cancelled = await cancelInvitation(accountId, publicId, connectionRepository);
    if (!cancelled) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "connection_unavailable" }, { status: 503 });
  }
}
