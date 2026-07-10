import { NextResponse } from "next/server";

import { getC02SavedResultForOwner } from "@/lib/server/c02Results";
import { getViewerContext } from "@/lib/server/yorisouAuth";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id || null;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const { id } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  try {
    const saved = await getC02SavedResultForOwner(id, ownerAccountId);
    if (!saved) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "c02_retrieval_failed";
    console.error("c02 result retrieval failed", { message });
    return NextResponse.json({ error: "c02_retrieval_failed" }, { status: 500 });
  }
}
