import { NextResponse } from "next/server";
import { createSavedImairoSnapshotForOwner } from "@/lib/server/testResults";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import { buildImairoResultSnapshot } from "@/lib/yorisou/public-result/snapshot";

// RTR-1: private current-state snapshot of the public IMAIRO-120Q result.
// Auth-gated (401 before any store access); snapshot content is rebuilt
// server-side from the approved taxonomy — the client only sends the
// public route context, never result text.
export async function POST(request: Request) {
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  try {
    const body = (await request.json().catch(() => null)) as { resultId?: unknown; overlayId?: unknown; confidence?: unknown; payloadKey?: unknown } | null;
    const resultId = typeof body?.resultId === "string" ? body.resultId : null;
    const snapshot = buildImairoResultSnapshot({
      resultId,
      overlayId: typeof body?.overlayId === "string" ? body.overlayId : null,
      confidenceBand: body?.confidence === "medium" ? "medium" : "low",
      payloadKey: typeof body?.payloadKey === "string" ? body.payloadKey : null,
    });
    if (!snapshot) return NextResponse.json({ error: "unknown_result" }, { status: 404 });
    const { record, reused } = await createSavedImairoSnapshotForOwner(ownerAccountId, snapshot);
    return NextResponse.json(
      { saved: record, stateTag: snapshot.stateTag, reused },
      { status: reused ? 200 : 201 },
    );
  } catch (error) {
    console.error("imairo snapshot save failed", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "test_save_failed" }, { status: 500 });
  }
}
