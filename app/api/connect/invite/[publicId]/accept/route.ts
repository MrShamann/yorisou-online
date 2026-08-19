import { NextResponse } from "next/server";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { connectionOperational } from "@/lib/yorisou/connection/access";
import { acceptInvitation } from "@/lib/server/platform/connectionCore/service";
import { connectionRepository } from "@/lib/server/connection/store";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Context = { params: Promise<{ publicId: string }> };

// CPR-1 — THE consent boundary. Accepting creates the pair and its comparison in ONE database
// transaction that holds both assessment source locks.
//
// The caller names their OWN result. That claim is never trusted: the mutation verifies the
// account owns that live Imairo row, that they are not the inviter, that the invitation is still
// pending and unexpired, and that neither source has been erased — all while holding the locks, so
// none of it can be raced by a concurrent second acceptor, a cancel, or a source deletion.
//
// A repeat by the SAME acceptor returns the same pair rather than creating a second one.
export async function POST(request: Request, context: Context) {
  if (!connectionOperational()) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const { publicId } = await context.params;
  if (!UUID_RE.test(publicId)) return NextResponse.json({ error: "not_found" }, { status: 404 });

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
    const outcome = await acceptInvitation(
      { publicInviteId: publicId, acceptorRef: accountId, acceptorReferenceRef: resultRowId },
      connectionRepository,
    );
    return NextResponse.json({
      pair_public_id: outcome.pair.pair_public_id,
      pair_path: `/connect/pair/${outcome.pair.pair_public_id}`,
      reused: outcome.reused,
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "connection_acceptor_source_unavailable" || code === "connection_same_source_forbidden") {
      // The one refusal the person can actually act on: their own chosen result is not usable.
      return NextResponse.json({ error: "connection_acceptor_source_unavailable" }, { status: 422 });
    }
    if (code === "connection_self_accept_forbidden") {
      return NextResponse.json({ error: "connection_self_accept_forbidden" }, { status: 409 });
    }
    if (
      code === "connection_invitation_unavailable" ||
      code === "connection_source_erased" ||
      code === "connection_inviter_source_unavailable"
    ) {
      // Everything about the OTHER person's side collapses into one answer: this invitation can no
      // longer be accepted. Distinguishing "cancelled" from "their result was deleted" would leak
      // the inviter's private lifecycle to whoever holds the link.
      return NextResponse.json({ error: "connection_invitation_unavailable" }, { status: 409 });
    }
    return NextResponse.json({ error: "connection_unavailable" }, { status: 503 });
  }
}
