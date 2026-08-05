import { NextResponse } from "next/server";

// POR-1 — cancellation, permitted only before the irreversible boundary.
//
// After erasure begins there is nothing left to cancel, and reporting success would tell someone
// their data still exists when it does not. Refusing is the honest answer.

import { getDeletionSurfaceViewerContext } from "@/lib/server/yorisouAuth";
import { cancelDeletion, readDeletionStatus } from "@/lib/server/accountDeletionOrchestrator";
import { deletionHasCompleted } from "@/lib/server/accountDeletionAuthority";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const viewer = await getDeletionSurfaceViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  // Same rule as the status surface, for the same reason: once the deletion has completed there is
  // no identity here to answer, and `deletion_not_cancellable, state: completed` would be a small
  // but real oracle — it confirms an account existed and was erased. Unlike confirm, cancel carries
  // no completion signal the client needs, so it simply refuses.
  if (await deletionHasCompleted(accountId)) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

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
