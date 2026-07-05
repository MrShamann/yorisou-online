import { NextResponse } from "next/server";

import { OPEN_TESTING_SESSION_COOKIE, recordRecommendationSignal } from "@/lib/server/relationship-intelligence/service";
import {
  isCompanionArchetypeId,
  isCompanionIntentType,
  isCompanionOptionId,
  isRecommendationActionId,
  isRecommendationActionRole,
  isRecommendationInterestId,
  isRecommendationMode,
  isRecommendationSignalSource,
  isRecommendationSignalTestId,
  isRecommendationSignalType,
} from "@/lib/server/relationship-intelligence/types";

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function sanitizeNote(value: unknown) {
  if (value === undefined || value === null) {
    return { ok: true as const, note: null };
  }

  if (typeof value !== "string") {
    return { ok: false as const };
  }

  const note = value.trim();

  if (!note) {
    return { ok: true as const, note: null };
  }

  if (note.length > 500) {
    return { ok: false as const };
  }

  return { ok: true as const, note };
}

function asMetadata(value: unknown) {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const normalized: Record<string, string | number | boolean | null> = {};

  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean" || raw === null) {
      normalized[key] = raw;
    }
  }

  return normalized;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const source = asString(body.source);
    const signalType = asString(body.signalType);
    const testId = asString(body.testId);
    const interestId = asString(body.interestId);
    const actionId = asString(body.actionId);
    const actionRole = asString(body.actionRole);
    const recommendationMode = asString(body.recommendationMode);
    const companionArchetypeId = asString(body.companionArchetypeId);
    const companionOptionId = asString(body.companionOptionId);
    const companionIntentType = asString(body.companionIntentType);

    if (!source) {
      return NextResponse.json({ ok: false, error: "missing_signal_source" }, { status: 400 });
    }
    if (!isRecommendationSignalSource(source)) {
      return NextResponse.json({ ok: false, error: "invalid_signal_source" }, { status: 400 });
    }
    if (!signalType) {
      return NextResponse.json({ ok: false, error: "missing_signal_type" }, { status: 400 });
    }
    if (!isRecommendationSignalType(signalType)) {
      return NextResponse.json({ ok: false, error: "invalid_signal_type" }, { status: 400 });
    }
    if (testId && !isRecommendationSignalTestId(testId)) {
      return NextResponse.json({ ok: false, error: "invalid_test_id" }, { status: 400 });
    }
    if (interestId && !isRecommendationInterestId(interestId)) {
      return NextResponse.json({ ok: false, error: "invalid_interest_id" }, { status: 400 });
    }
    if (actionId && !isRecommendationActionId(actionId)) {
      return NextResponse.json({ ok: false, error: "invalid_action_id" }, { status: 400 });
    }
    if (actionRole && !isRecommendationActionRole(actionRole)) {
      return NextResponse.json({ ok: false, error: "invalid_action_role" }, { status: 400 });
    }
    if (recommendationMode && !isRecommendationMode(recommendationMode)) {
      return NextResponse.json({ ok: false, error: "invalid_recommendation_mode" }, { status: 400 });
    }
    const isCompanionSignal = signalType.startsWith("companion_");
    if (isCompanionSignal && source !== "companion_card" && source !== "line_mini_app") {
      return NextResponse.json({ ok: false, error: "invalid_signal_source" }, { status: 400 });
    }
    if (companionArchetypeId && !isCompanionArchetypeId(companionArchetypeId)) {
      return NextResponse.json({ ok: false, error: "invalid_companion_archetype_id" }, { status: 400 });
    }
    if (companionOptionId && !isCompanionOptionId(companionOptionId)) {
      return NextResponse.json({ ok: false, error: "invalid_companion_option_id" }, { status: 400 });
    }
    if (companionIntentType && !isCompanionIntentType(companionIntentType)) {
      return NextResponse.json({ ok: false, error: "invalid_companion_intent_type" }, { status: 400 });
    }
    if (
      (
        signalType === "recommendation_package_shown" ||
        signalType === "recommendation_action_clicked" ||
        signalType === "return_recommendation_shown" ||
        signalType === "return_recommendation_clicked"
      ) &&
      (!actionId || !actionRole || !recommendationMode)
    ) {
      return NextResponse.json({ ok: false, error: "missing_recommendation_tracking_fields" }, { status: 400 });
    }
    if (isCompanionSignal && !companionArchetypeId) {
      return NextResponse.json({ ok: false, error: "invalid_companion_archetype_id" }, { status: 400 });
    }
    if (
      (signalType === "companion_question_answered" || signalType === "companion_option_clicked") &&
      !companionOptionId
    ) {
      return NextResponse.json({ ok: false, error: "missing_companion_fields" }, { status: 400 });
    }
    if (
      (signalType === "companion_subscription_interest_clicked" || signalType === "companion_subscription_not_now_clicked") &&
      !companionIntentType
    ) {
      return NextResponse.json({ ok: false, error: "missing_companion_fields" }, { status: 400 });
    }

    const sanitizedNote = sanitizeNote(body.note);
    if (!sanitizedNote.ok) {
      return NextResponse.json({ ok: false, error: "invalid_note" }, { status: 400 });
    }

    const validatedTestId = testId && isRecommendationSignalTestId(testId) ? testId : null;
    const validatedInterestId = interestId && isRecommendationInterestId(interestId) ? interestId : null;
    const validatedActionId = actionId && isRecommendationActionId(actionId) ? actionId : null;
    const validatedActionRole = actionRole && isRecommendationActionRole(actionRole) ? actionRole : null;
    const validatedRecommendationMode = recommendationMode && isRecommendationMode(recommendationMode) ? recommendationMode : null;

    const result = await recordRecommendationSignal({
      source,
      signalType,
      testId: validatedTestId,
      resultId: asString(body.resultId),
      interestId: validatedInterestId,
      actionId: validatedActionId,
      actionRole: validatedActionRole,
      recommendationMode: validatedRecommendationMode,
      companionArchetypeId: companionArchetypeId && isCompanionArchetypeId(companionArchetypeId) ? companionArchetypeId : null,
      companionOptionId: companionOptionId && isCompanionOptionId(companionOptionId) ? companionOptionId : null,
      companionIntentType:
        companionIntentType && isCompanionIntentType(companionIntentType) ? companionIntentType : null,
      note: sanitizedNote.note,
      pagePath: asString(body.pagePath),
      metadata: asMetadata(body.metadata),
    });

    const response = NextResponse.json({
      ok: true,
      signalId: result.record.id,
      status: "received",
    });
    response.cookies.set(OPEN_TESTING_SESSION_COOKIE, result.session.record.anonymousSessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "unexpected_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
