import { NextResponse } from "next/server";

import type { AdvisorAnswers, AdvisorRecommendation, Locale } from "@/lib/ai/yorisouAdvisor";
import type { AdvisorLead } from "@/lib/yorisouAdvisorStorage";
import { attachLeadToConsultation, findConsultationForViewer } from "@/lib/server/yorisouData";
import { getViewerContext } from "@/lib/server/yorisouAuth";

type LeadRequest = {
  locale?: Locale;
  answers?: Partial<AdvisorAnswers>;
  recommendation?: AdvisorRecommendation;
  lead?: Partial<AdvisorLead>;
  consultationId?: string;
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
    const viewer = await getViewerContext();

    if (!payload.answers || !payload.recommendation || !payload.lead || !payload.consultationId) {
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    if (!isValidLead(payload.lead) || !isRecommendation(payload.recommendation)) {
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    const consultation = await findConsultationForViewer({
      consultationId: payload.consultationId,
      userId: viewer.account?.id || null,
      sessionId: viewer.session?.id || null,
    });

    if (!consultation) {
      return NextResponse.json({ success: false, error: "consultation_not_found" }, { status: 404 });
    }

    await attachLeadToConsultation({
      consultationId: consultation.id,
      userId: viewer.account?.id || null,
      lead: {
        ...payload.lead,
        name: payload.lead.name.trim(),
        phone: payload.lead.phone.trim(),
        email: payload.lead.email.trim(),
        city: payload.lead.city.trim(),
        additionalNotes: payload.lead.additionalNotes.trim(),
      },
    });

    return NextResponse.json({ success: true, entryId: consultation.id });
  } catch (error) {
    console.error("AI advisor lead route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
