import { NextResponse } from "next/server";

// POR-1 — bounded deletion status.
//
// Returns a state and whether cancellation is still possible. It deliberately carries no table
// names, object keys, email, session ids or raw account id: a status endpoint that explains
// exactly what remains is an inventory of the person's data, and after finalization the account id
// itself no longer exists in the record — only a one-way fingerprint.

import { getDeletionSurfaceViewerContext } from "@/lib/server/yorisouAuth";
import { readDeletionStatus } from "@/lib/server/accountDeletionOrchestrator";
import { deletionHasCompleted } from "@/lib/server/accountDeletionAuthority";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const viewer = await getDeletionSurfaceViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  // A COMPLETED DELETION IS ANSWERED BY NOBODY, however the account came to resolve.
  //
  // The viewer resolver already refuses a cookie that names an erased account, so in the ordinary
  // case this never fires. It exists for the case the resolver cannot see: the object store serving
  // a stale copy of a record that has in fact been deleted. The durable job is strongly consistent
  // and the store is not, so the job is what this surface believes — and it is checked here, on the
  // route, rather than left implicit in the resolver, because "an erased identity is never answered"
  // is this endpoint's contract and not a side effect of someone else's.
  if (await deletionHasCompleted(accountId)) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

  const status = await readDeletionStatus(accountId);
  if (!status) return NextResponse.json({ state: null, cancellable: false }, { status: 200 });

  return NextResponse.json(
    {
      state: status.state,
      cancellable: !status.irreversible,
      // A bounded failure CLASS only. The underlying code can name internal tables.
      failed: status.state === "failed_retryable" || status.state === "failed_terminal",
      retryable: status.state === "failed_retryable",
    },
    { status: 200 },
  );
}
