import { NextResponse } from "next/server";

import { buildAutonomousRecommendationPackage } from "@/lib/server/relationship-intelligence/recommendation-orchestrator";
import { ensureOpenTestingAnonymousSession, listRecommendationSignalsForAnonymousSession, OPEN_TESTING_SESSION_COOKIE } from "@/lib/server/relationship-intelligence/service";
import { isRecommendationMode, isRecommendationSignalSource, isRecommendationSignalTestId, type RecommendationSignalSource } from "@/lib/server/relationship-intelligence/types";

const MAX_STRING_LENGTH = 120;
const MAX_PATH_LENGTH = 200;

function asString(value: unknown, maxLength = MAX_STRING_LENGTH) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.length <= maxLength ? trimmed : null;
}

function defaultSourceForTest(testId: string): RecommendationSignalSource {
  switch (testId) {
    case "love-distance":
      return "love_distance_flow";
    case "work-rhythm":
      return "work_rhythm_flow";
    case "name-impression":
      return "name_impression_flow";
    case "local-life":
      return "local_life_flow";
    default:
      return "tests_page";
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const testId = asString(body.testId);
    const mode = asString(body.mode);
    const source = asString(body.source);
    const resultId = asString(body.resultId);
    const pagePath = asString(body.pagePath, MAX_PATH_LENGTH);

    if (!testId) {
      return NextResponse.json({ ok: false, error: "missing_test_id" }, { status: 400 });
    }
    if (!isRecommendationSignalTestId(testId)) {
      return NextResponse.json({ ok: false, error: "invalid_test_id" }, { status: 400 });
    }
    if (!mode) {
      return NextResponse.json({ ok: false, error: "missing_recommendation_mode" }, { status: 400 });
    }
    if (!isRecommendationMode(mode)) {
      return NextResponse.json({ ok: false, error: "invalid_recommendation_mode" }, { status: 400 });
    }
    if (source && !isRecommendationSignalSource(source)) {
      return NextResponse.json({ ok: false, error: "invalid_signal_source" }, { status: 400 });
    }
    const resolvedSource: RecommendationSignalSource =
      source && isRecommendationSignalSource(source) ? source : defaultSourceForTest(testId);

    const session = await ensureOpenTestingAnonymousSession({
      source: resolvedSource,
      route: pagePath,
    });
    const recentSignals = await listRecommendationSignalsForAnonymousSession(session.record.anonymousSessionId);
    const recommendationPackage = buildAutonomousRecommendationPackage({
      testId,
      resultId,
      source: resolvedSource,
      pagePath,
      mode,
      recentSignals,
    });

    const response = NextResponse.json({
      ok: true,
      package: recommendationPackage,
    });
    response.cookies.set(OPEN_TESTING_SESSION_COOKIE, session.record.anonymousSessionId, {
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
