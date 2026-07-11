import { NextResponse } from "next/server";
import { generateReflection } from "@/lib/server/privateAi";
import { getViewerContext } from "@/lib/server/yorisouAuth";

export async function POST(request: Request) {
  const viewer = await getViewerContext(); const accountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const body = await request.json().catch(() => null) as { savedResultId?: unknown } | null;
  if (!body || typeof body.savedResultId !== "string") return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  try { const result = await generateReflection(accountId, body.savedResultId); return NextResponse.json(result, { status: result.deduplicated ? 200 : 201 }); }
  catch (error) { const code = error instanceof Error ? error.message : "reflection_failed"; const status = ["saved_result_not_found", "unsupported_result"].includes(code) ? 404 : code === "workflow_disabled" ? 503 : 422; return NextResponse.json({ error: code }, { status }); }
}
