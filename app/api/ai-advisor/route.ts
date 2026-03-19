import { NextResponse } from "next/server";

import { generateAdvisorRecommendation, type AdvisorAnswers, type Locale } from "@/lib/ai/yorisouAdvisor";

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

    return NextResponse.json({
      success: true,
      recommendation,
    });
  } catch (error) {
    console.error("AI advisor route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
