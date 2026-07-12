import { NextResponse } from "next/server";
import { createSavedTestResult } from "@/lib/server/testResults";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import {
  RF_SCORING_VERSION,
  RF_TEST_ID,
  RF_TEST_VERSION,
  relationshipFatigueStateTag,
  resolveRelationshipFatigueSavedResult,
  validateRelationshipFatigueAnswers,
} from "@/lib/yorisou-tests/relationshipFatigue";

export async function POST(request: Request) {
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  try {
    const body = (await request.json()) as { answers?: unknown };
    const validation = validateRelationshipFatigueAnswers(body.answers);
    if (!validation.ok) return NextResponse.json({ error: validation.code, message: validation.message }, { status: 400 });
    const { rf, saved } = resolveRelationshipFatigueSavedResult(validation.answers);
    const record = await createSavedTestResult({
      ownerAccountId,
      definition: { testId: RF_TEST_ID, version: RF_TEST_VERSION, scoringVersion: RF_SCORING_VERSION },
      answers: validation.answers,
      result: saved,
    });
    return NextResponse.json(
      { saved: record, stateTag: relationshipFatigueStateTag(rf.archetypeId) },
      { status: 201 },
    );
  } catch (error) {
    console.error("relationship-fatigue result save failed", { message: error instanceof Error ? error.message : "unknown" });
    return NextResponse.json({ error: "test_save_failed" }, { status: 500 });
  }
}
