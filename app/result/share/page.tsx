import type { Metadata } from "next";

import DteEventTracker from "@/app/components/DteEventTracker";
import ResultShareCard from "@/app/components/ResultShareCard";
import ResultShareActions from "@/app/components/ResultShareActions";
import { buildPublicResultIdentity } from "@/lib/result/public-result-identity";
import { buildResultLabSnapshot, getCanonicalPersonaOptions } from "@/lib/result/rendering-contract-adapter";
import { buildResultShareMessaging } from "@/lib/result/share-messaging";
import { buildResultSharePreviewMetadata } from "@/lib/result/share-preview-metadata";
import { getResultVisualAssetResolution } from "@/lib/server/resultVisualAssetRegistry";
import { getDynamicTestCompletionRecord } from "@/lib/server/dynamicTestCompletionStore";
import { getCanonicalPublicPersonaShell, resolveCanonicalPublicPersonaModeLabel } from "@/lib/yorisou/dte/public-persona-shell";

type SearchParams = Promise<{
  completionId?: string;
  personaId?: string;
}>;

function getPublicShareUrl(personaId: string) {
  const safePersonaId = personaId.trim() || "P01";
  return `/result/share?personaId=${encodeURIComponent(safePersonaId)}`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const params = (await searchParams) || {};
  const requestedPersonaId = typeof params.personaId === "string" ? params.personaId : "";
  const completionId = typeof params.completionId === "string" ? params.completionId : "";
  const completion = completionId ? await getDynamicTestCompletionRecord(completionId) : null;
  const personaOptions = getCanonicalPersonaOptions();
  const fallbackPersonaId = requestedPersonaId || personaOptions[0]?.personaId || "P01";
  const personaId = completion?.personaId || fallbackPersonaId;
  const snapshot = buildResultLabSnapshot({
    personaId,
    scenario: completion || requestedPersonaId ? "result_ready" : "invalid_or_missing_payload",
    surfaceMode: "primary",
    sessionMode: "anonymous",
    versionMode: "valid",
  });
  const publicIdentity = buildPublicResultIdentity({
    personaId,
    payload: snapshot.payload,
    sourceResultLabel: snapshot.payload?.final_locked_label_jp,
    sourceResultSummary: snapshot.payload?.final_locked_subtitle_jp || snapshot.payload?.share_card_result.share_card_summary || null,
    sourceShareLine: snapshot.payload?.share_card_result.share_card_line_jp || null,
    sourceTeaserLine: snapshot.payload?.teaser_result.teaser_line_jp || null,
    sourcePaywallTease: snapshot.payload?.deep_report_stub.deep_report_intro_jp || null,
  });
  const personaShell = getCanonicalPublicPersonaShell(personaId);
  return buildResultSharePreviewMetadata({
    personaName: publicIdentity.publicResultLabelJa || personaShell?.officialPublicPersonaName || "Yorisou",
    socialHandle: publicIdentity.shareSocialHookJa || publicIdentity.shareSendLineJa || personaShell?.socialHandle || publicIdentity.shareLineJa || "",
    publicUrl: getPublicShareUrl(personaId),
    canonicalUrl: getPublicShareUrl(personaId),
    imageUrl: `/result/share/opengraph-image?personaId=${encodeURIComponent(personaId)}`,
  });
}

export default async function ResultSharePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const completionId = typeof params.completionId === "string" ? params.completionId : "";
  const requestedPersonaId = typeof params.personaId === "string" ? params.personaId : "";
  const completion = completionId ? await getDynamicTestCompletionRecord(completionId) : null;
  const personaOptions = getCanonicalPersonaOptions();
  const fallbackPersonaId = requestedPersonaId || personaOptions[0]?.personaId || "P01";
  const personaId = completion?.personaId || fallbackPersonaId;
  const hasRenderableResult = Boolean(completion) || Boolean(requestedPersonaId);
  const snapshot = buildResultLabSnapshot({
    personaId,
    scenario: hasRenderableResult ? "result_ready" : "invalid_or_missing_payload",
    surfaceMode: "primary",
    sessionMode: "anonymous",
    versionMode: "valid",
  });
  const publicIdentity = buildPublicResultIdentity({
    personaId,
    payload: snapshot.payload,
    sourceResultLabel: snapshot.payload?.final_locked_label_jp,
    sourceResultSummary: snapshot.payload?.final_locked_subtitle_jp || snapshot.payload?.share_card_result.share_card_summary || null,
    sourceShareLine: snapshot.payload?.share_card_result.share_card_line_jp || null,
    sourceTeaserLine: snapshot.payload?.teaser_result.teaser_line_jp || null,
    sourcePaywallTease: snapshot.payload?.deep_report_stub.deep_report_intro_jp || null,
  });
  const visualAssetResolution = await getResultVisualAssetResolution({
    personaId,
    surfaceTarget: "result_first_screen",
    mythArchetypeLabel: publicIdentity.mythArchetypeLabelJa,
    contemporaryLabel: publicIdentity.contemporarySocialLabelJa,
    functionalSubtitle: publicIdentity.functionalSubtitleJa,
    hookLine: publicIdentity.hookLineJa,
    traitChips: publicIdentity.traitChipsJa,
  });
  const personaShell = getCanonicalPublicPersonaShell(personaId);
  const currentModeLabel = resolveCanonicalPublicPersonaModeLabel(personaShell, completion?.currentModeKey || null, completion?.currentModeLabelJa || null);
  const shareViewSearchParams = new URLSearchParams();
  shareViewSearchParams.set("personaId", personaId);
  const shareViewHref = `/result/share?${shareViewSearchParams.toString()}`;
  const shareHref = shareViewHref;
  const shareMessaging = buildResultShareMessaging({
    locale: "ja",
    publicResultName: publicIdentity.publicResultLabelJa || personaShell?.officialPublicPersonaName || "Yorisou",
    socialLine: publicIdentity.shareLineJa || publicIdentity.shareSendLineJa || "",
    ctaLine: "あなたは今、どの寄り添い方？",
  });

  return (
    <>
      <DteEventTracker
        event="share_page_opened"
        completionId={completion?.id || completionId || null}
        personaId={personaId}
        sessionId={completion?.sessionId || null}
        locale="ja"
        shareSurface="result_share_page"
        source="result"
        surface="result"
        action="open"
        branchId="yorisou_dte"
        sourceBranchId="yorisou_dte"
        visibilityPolicy="public"
        crossBranchAccessPolicy="explicit_bridge"
        enabled={Boolean(completion || personaId)}
      />
      <ResultShareCard
        locale="ja"
        identity={publicIdentity}
        pack={visualAssetResolution.pack}
        personaShell={personaShell}
        currentModeLabel={currentModeLabel}
      />
      <div className="mx-auto max-w-md px-4 pb-6 pt-3">
        <ResultShareActions
          locale="ja"
          shareUrl={shareHref}
          shareTitle={shareMessaging.shareTitle}
          shareText={shareMessaging.shareText}
          completionId={completion?.id || completionId || null}
          personaId={personaId}
          shareSurface="result_share_page"
          shareCardUrl={shareViewHref}
        />
      </div>
    </>
  );
}
