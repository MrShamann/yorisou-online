import { NextResponse } from "next/server";
import { createAccountDeletionRequest } from "@/lib/server/testResults";
import { getViewerContext } from "@/lib/server/yorisouAuth";
export async function POST(request: Request) { const viewer = await getViewerContext(); const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id; if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 }); const body = await request.json().catch(() => ({})) as { note?: unknown }; const record = await createAccountDeletionRequest(ownerAccountId, typeof body.note === "string" ? body.note : undefined); return NextResponse.json({ request: record }, { status: 201 }); }
