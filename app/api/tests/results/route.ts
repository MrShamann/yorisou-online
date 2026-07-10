import { NextResponse } from "next/server";
import { listSavedTestResultsForOwner } from "@/lib/server/testResults";
import { getViewerContext } from "@/lib/server/yorisouAuth";
export async function GET() { const viewer = await getViewerContext(); const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id; if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 }); return NextResponse.json({ results: await listSavedTestResultsForOwner(ownerAccountId) }); }
