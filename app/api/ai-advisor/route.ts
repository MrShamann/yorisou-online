import { NextResponse } from "next/server";

import { generateAdvisorRecommendation, type AdvisorAnswers, type Locale } from "@/lib/ai/yorisouAdvisor";
import { createConsultation } from "@/lib/server/yorisouData";
import { getViewerContext, SESSION_COOKIE, ensureViewerSession } from "@/lib/server/yorisouAuth";
import { getAnswerLabels } from "@/lib/ai/yorisouAdvisor";

type AdvisorRequest = {
  locale?: Locale;
  answers?: Partial<AdvisorAnswers>;
};

const requiredAnswerKeys: Array<keyof AdvisorAnswers> = [
  "userType",
  "ageRange",
  "walkingAbility",
  "primaryScenario",
  "usageEnvironment",
  "needFoldable",
  "carTrunkFit",
  "useFrequency",
  "budgetRange",
  "safetyNote",
];

function isValidAnswers(answers: Partial<AdvisorAnswers> | undefined): answers is AdvisorAnswers {
  if (!answers) {
    return false;
  }

  return requiredAnswerKeys.every((key) => typeof answers[key] === "string");
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as AdvisorRequest;
    const locale = payload.locale === "en" ? "en" : "ja";

    if (!isValidAnswers(payload.answers)) {
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    const recommendation = await generateAdvisorRecommendation(payload.answers, locale);
    const viewer = await getViewerContext();
    const session = viewer.session || (await ensureViewerSession());
    const consultation = await createConsultation({
      sessionId: session.id,
      userId: viewer.account?.id || null,
      locale,
      recommendation,
      answerLabels: getAnswerLabels(payload.answers, locale),
    });

    const response = NextResponse.json({
      success: true,
      recommendation,
      consultationId: consultation.id,
    });
    response.cookies.set(SESSION_COOKIE, session.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error) {
    console.error("AI advisor route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
