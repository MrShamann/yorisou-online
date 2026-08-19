import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { connectionOperational } from "@/lib/yorisou/connection/access";
import { createInvitation } from "@/lib/server/platform/connectionCore/service";
import { connectionRepository } from "@/lib/server/connection/store";
import { IMAIRO_PAIR_REFERENCE_FAMILY } from "@/packs/yorisou/imairo/pair";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// CPR-1 — create a pair invitation from a persisted Imairo result the caller owns.
//
// The client sends only its own result row id. Ownership is NOT taken from that claim: the
// database mutation re-resolves the row against the authenticated account and refuses if it is not
// theirs, not live, not Imairo, or has no assigned public result. A guessed id creates nothing.
//
// The response carries the opaque invite id and nothing derived from the source.
export async function POST(request: Request) {
  if (!connectionOperational()) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const resultRowId = typeof body.resultRowId === "string" ? body.resultRowId : "";
  if (!UUID_RE.test(resultRowId)) {
    return NextResponse.json({ error: "connection_input_invalid" }, { status: 422 });
  }

  try {
    const invitation = await createInvitation(
      {
        inviter_ref: accountId,
        reference_family: IMAIRO_PAIR_REFERENCE_FAMILY,
        reference_ref: resultRowId,
      },
      connectionRepository,
    );
    return NextResponse.json({
      public_invite_id: invitation.public_invite_id,
      invite_path: `/connect/invite/${invitation.public_invite_id}`,
      expires_at: invitation.expires_at,
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "connection_source_not_invitable" || code === "connection_source_erased") {
      // Concealed: "not yours" and "no longer exists" answer the same as "not usable".
      return NextResponse.json({ error: "connection_source_not_invitable" }, { status: 422 });
    }
    return NextResponse.json({ error: "connection_unavailable" }, { status: 503 });
  }
}
