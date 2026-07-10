import { NextResponse } from "next/server";
import { createSavedTestResult } from "@/lib/server/testResults";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import { getProductionTestDefinition, resolveProductionTestResult, validateTestAnswers } from "@/lib/yorisou-tests/engine";

export async function POST(request: Request, context: { params: Promise<{ testId: string }> }) {
  const { testId } = await context.params;
  const definition = getProductionTestDefinition(testId);
  if (!definition) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext(); const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  try {
    const body = (await request.json()) as { answers?: unknown }; const validation = validateTestAnswers(definition, body.answers);
    if (!validation.ok) return NextResponse.json({ error: validation.code, message: validation.message }, { status: 400 });
    const saved = await createSavedTestResult({ ownerAccountId, definition, answers: validation.answers, result: resolveProductionTestResult(definition, validation.answers) });
    return NextResponse.json({ saved }, { status: 201 });
  } catch (error) { console.error("test result save failed", { testId, message: error instanceof Error ? error.message : "unknown" }); return NextResponse.json({ error: "test_save_failed" }, { status: 500 }); }
}
