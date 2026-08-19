import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { sharingOperational } from "@/lib/yorisou/sharing/access";
import { revokeShare } from "@/lib/server/platform/sharingCore/service";
import { sharingRepository } from "@/lib/server/sharing/store";

export const dynamic = "force-dynamic";

const PUBLIC_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

type Context = { params: Promise<{ publicId: string }> };

// SHR-1 — owner revoke. Idempotent and concealed: a non-owner, a nonexistent id, and an
// already-revoked object all answer identically (404), so the endpoint is not an existence oracle.
// A successful revoke writes its transactional audit row inside the RPC.
export async function POST(_request: Request, context: Context) {
  if (!sharingOperational()) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const { publicId } = await context.params;
  if (!PUBLIC_ID_RE.test(publicId)) return NextResponse.json({ error: "not_found" }, { status: 404 });

  try {
    const revoked = await revokeShare(ownerAccountId, publicId, sharingRepository);
    if (!revoked) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "share_unavailable" }, { status: 503 });
  }
}
