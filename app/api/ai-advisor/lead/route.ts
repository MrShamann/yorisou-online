import { NextResponse } from "next/server";

import type { AdvisorAnswers, AdvisorRecommendation, Locale } from "@/lib/ai/yorisouAdvisor";
import { appendAdvisorEntry, createAdvisorEntry, type AdvisorLead } from "@/lib/yorisouAdvisorStorage";

type LeadRequest = {
  locale?: Locale;
  answers?: Partial<AdvisorAnswers>;
  recommendation?: AdvisorRecommendation;
  lead?: Partial<AdvisorLead>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidLead(lead: Partial<AdvisorLead> | undefined): lead is AdvisorLead {
  if (!lead) {
    return false;
  }

  return Boolean(
    lead.name?.trim() &&
      lead.phone?.trim() &&
      lead.email?.trim() &&
      EMAIL_PATTERN.test(lead.email.trim()) &&
      lead.city?.trim() &&
      (lead.preferredContactMethod === "phone" || lead.preferredContactMethod === "email" || lead.preferredContactMethod === "either") &&
      (lead.interestedInTestRide === "yes" || lead.interestedInTestRide === "no") &&
      typeof lead.additionalNotes === "string"
  );
}

function isRecommendation(value: AdvisorRecommendation | undefined): value is AdvisorRecommendation {
  return Boolean(
    value &&
      value.recommendedCategory &&
      value.secondaryRecommendation &&
      Array.isArray(value.whyItFits) &&
      Array.isArray(value.cautionPoints) &&
      typeof value.suggestedNextAction === "string" &&
      typeof value.summary === "string" &&
      value.scoreBreakdown
  );
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadRequest;

    if (!payload.answers || !payload.recommendation || !payload.lead) {
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    if (!isValidLead(payload.lead) || !isRecommendation(payload.recommendation)) {
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    const entry = createAdvisorEntry({
      locale: payload.locale === "en" ? "en" : "ja",
      answers: payload.answers as AdvisorAnswers,
      recommendation: payload.recommendation,
      lead: {
        ...payload.lead,
        name: payload.lead.name.trim(),
        phone: payload.lead.phone.trim(),
        email: payload.lead.email.trim(),
        city: payload.lead.city.trim(),
        additionalNotes: payload.lead.additionalNotes.trim(),
      },
    });

    await appendAdvisorEntry(entry);

    return NextResponse.json({ success: true, entryId: entry.id });
  } catch (error) {
    console.error("AI advisor lead route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
