import { NextResponse } from "next/server";

// POR-1 — cancellation, permitted only before the irreversible boundary.
//
// After erasure begins there is nothing left to cancel, and reporting success would tell someone
// their data still exists when it does not. Refusing is the honest answer.

import { getDeletionSurfaceViewerContext } from "@/lib/server/yorisouAuth";
import { cancelDeletion, readDeletionStatus } from "@/lib/server/accountDeletionOrchestrator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const viewer = await getDeletionSurfaceViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const cancelled = await cancelDeletion(accountId);
  if (!cancelled) {
    const status = await readDeletionStatus(accountId);
    return NextResponse.json(
      { error: "deletion_not_cancellable", state: status?.state ?? null },
      { status: 409 },
    );
  }
  return NextResponse.json({ state: "cancelled" }, { status: 200 });
}
