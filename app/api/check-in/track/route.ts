import { NextResponse } from "next/server";

import { recordDteLaunchEvent } from "@/lib/server/dteLaunchEventStore";

export const runtime = "nodejs";

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const event = asString(body.event);
    if (!event) {
      return NextResponse.json({ ok: false, error: "missing_event" }, { status: 400 });
    }

    const record = await recordDteLaunchEvent({
      event,
      completionId: asString(body.completionId),
      personaId: asString(body.personaId),
      sessionId: asString(body.sessionId),
      userId: asString(body.userId),
      locale: asString(body.locale) === "en" ? "en" : "ja",
      entrySource: asString(body.entrySource),
      testVersion: asString(body.testVersion),
      questionPosition: asNumber(body.questionPosition),
      questionId: asString(body.questionId),
      totalQuestionsAnswered: asNumber(body.totalQuestionsAnswered),
      completionTimestamp: asString(body.completionTimestamp),
      publicResultLabel: asString(body.publicResultLabel),
      resultVariantIds: Array.isArray(body.resultVariantIds) ? body.resultVariantIds.map((item) => asString(item)).filter(Boolean) as string[] : null,
      shareSurface: asString(body.shareSurface),
      shareCardVariant: asString(body.shareCardVariant),
      paywallVariant: asString(body.paywallVariant),
      unlockTarget: asString(body.unlockTarget),
      returnSurface: asString(body.returnSurface),
      daysSinceCompletion: asNumber(body.daysSinceCompletion),
      durationMs: asNumber(body.durationMs),
      branchId: asString(body.branchId) as "yorisou_dte" | "hinata_support" | "website_brand" | "operator_admin" | "synthetic_branch_lab" | null,
      sourceBranchId: asString(body.sourceBranchId) as "yorisou_dte" | "hinata_support" | "website_brand" | "operator_admin" | "synthetic_branch_lab" | null,
      visibilityPolicy: asString(body.visibilityPolicy) as "public" | "branch_internal" | "internal" | null,
      crossBranchAccessPolicy: asString(body.crossBranchAccessPolicy) as "same_branch_only" | "explicit_bridge" | "read_only_archive" | null,
      variantId: asString(body.variantId),
      variantKey: asString(body.variantKey),
      triggerKey: asString(body.triggerKey),
      triggerContext: body.triggerContext && typeof body.triggerContext === "object" ? (body.triggerContext as Record<string, string | number | boolean | null>) : null,
      resultKey: asString(body.resultKey),
      source: asString(body.source),
      surface: asString(body.surface),
      action: asString(body.action),
      questionIndex: asNumber(body.questionIndex),
      followUpIndex: asNumber(body.followUpIndex),
      unitType: asString(body.unitType),
      status: asString(body.status),
      reason: asString(body.reason),
      viewportClass: asString(body.viewportClass),
    });

    return NextResponse.json({ ok: true, event: record.payload.event, id: record.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
