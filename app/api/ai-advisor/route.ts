import { NextResponse } from "next/server";

import { generateAdvisorRecommendation, type AdvisorAnswers, type Locale } from "@/lib/ai/yorisouAdvisor";
import { identityFoundationService } from "@/lib/server/foundation/identityService";
import { timelineService } from "@/lib/server/foundation/timelineService";
import { findAccountById } from "@/lib/server/yorisouData";
import { createConsultation } from "@/lib/server/yorisouData";
import {
  getViewerContext,
  ensureViewerSession,
  setViewerSessionCookie,
  withSessionPrincipalLandingShadow,
  type ViewerContext,
} from "@/lib/server/yorisouAuth";
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

function getLegacyViewerAccount(viewer: ViewerContext) {
  return viewer.legacyAccount || viewer.account;
}

export function resolveAiAdvisorViewerAuthority(viewer: ViewerContext) {
  const legacyAccount = getLegacyViewerAccount(viewer);

  if (!legacyAccount) {
    return {
      effectiveLegacyAccountId: null,
      consultationOwnerIds: [] as string[],
      consultationOwnerTargetId: null,
      hasAuthenticatedViewer: false,
      principalMatched: false,
      legacyMatched: false,
      matchedBy: "none" as const,
    };
  }

  const principalCandidates = [
    viewer.principal?.legacyAccountId || null,
    viewer.principal?.userProfileId || null,
  ].filter((entry): entry is string => Boolean(entry));
  const principalMatched = principalCandidates.includes(legacyAccount.id);

  if (viewer.principal && !principalMatched) {
    console.warn("ai advisor viewer authority falling back to legacy account despite principal mismatch", {
      legacyAccountId: legacyAccount.id,
      principalCandidates,
      principalId: viewer.principal.userProfileId,
    });
  }

  return {
    effectiveLegacyAccountId: legacyAccount.id,
    consultationOwnerIds: Array.from(new Set([legacyAccount.id, viewer.principal?.userProfileId || null].filter((entry): entry is string => Boolean(entry)))),
    consultationOwnerTargetId: principalMatched && viewer.principal?.userProfileId ? viewer.principal.userProfileId : legacyAccount.id,
    hasAuthenticatedViewer: true,
    principalMatched,
    legacyMatched: true,
    matchedBy: principalMatched ? "principal" : "legacy",
  } as const;
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
    const viewerAuthority = resolveAiAdvisorViewerAuthority(viewer);
    const session = viewer.session || (await ensureViewerSession());
    const consultation = await createConsultation({
      sessionId: session.id,
      userId: viewerAuthority.effectiveLegacyAccountId,
      ownerTargetId: viewerAuthority.consultationOwnerTargetId,
      locale,
      recommendation,
      answerLabels: getAnswerLabels(payload.answers, locale),
    });

    const response = NextResponse.json({
      success: true,
      recommendation,
      consultationId: consultation.id,
    });
    const legacyAccount = getLegacyViewerAccount(viewer);
    if (legacyAccount && viewerAuthority.hasAuthenticatedViewer) {
      try {
        await identityFoundationService.ensureCanonicalUserForAccount(legacyAccount, "ai_advisor");
      } catch (foundationError) {
        console.error("advisor foundation user sync error:", foundationError);
      }
    }
    try {
      await timelineService.recordSupportConsultationEvent({
        consultation,
        userProfileId: viewerAuthority.consultationOwnerTargetId,
      });
    } catch (foundationError) {
      console.error("advisor foundation timeline error:", foundationError);
    }
    const sessionForCookie = await withSessionPrincipalLandingShadow(
      { ...session, userId: viewerAuthority.effectiveLegacyAccountId },
      {
        legacyAccount:
          legacyAccount ||
          (viewerAuthority.effectiveLegacyAccountId ? await findAccountById(viewerAuthority.effectiveLegacyAccountId) : null),
        source: "session_upgrade",
      },
    );
    setViewerSessionCookie(response, sessionForCookie);
    return response;
  } catch (error) {
    console.error("AI advisor route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
