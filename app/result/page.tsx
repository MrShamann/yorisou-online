import type { Metadata } from "next";

import CanonicalResultSurface from "@/app/components/CanonicalResultSurface";
import DteEventTracker from "@/app/components/DteEventTracker";
import { buildPublicResultIdentity } from "@/lib/result/public-result-identity";
import {
  buildResultLabSnapshot,
  getCanonicalPersonaOptions,
} from "@/lib/result/rendering-contract-adapter";
import { buildDynamicTestContinuationHref } from "@/lib/dynamicTestEngineSession";
import { getResultVisualAssetResolution } from "@/lib/server/resultVisualAssetRegistry";
import { getDynamicTestCompletionRecord } from "@/lib/server/dynamicTestCompletionStore";
import { getCanonicalPublicPersonaShell } from "@/lib/yorisou/dte/public-persona-shell";
import { resolveOracleLineForResult } from "@/lib/yorisou/dte/oracle/oracle-line-result-resolver";

export const metadata: Metadata = {
  title: "結果 | Yorisou",
  description: "完了した結果をひと目で受け取り、次の一歩まで迷わず開けるページです。",
  alternates: {
    canonical: "/result",
  },
  robots: {
    index: false,
    follow: true,
  },
};

type SearchParams = Promise<{
  completionId?: string;
  persona?: string;
  unlock?: string;
}>;

export default async function ResultPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const completionId = typeof params.completionId === "string" ? params.completionId : "";
  const requestedPersonaId = typeof params.persona === "string" ? params.persona : "";
  const unlockTarget = typeof params.unlock === "string" ? params.unlock : "";
  const completion = completionId ? await getDynamicTestCompletionRecord(completionId) : null;
  const renderAt = new Date().getTime();
  const personaOptions = getCanonicalPersonaOptions();
  const fallbackPersonaId = personaOptions[0]?.personaId || "P01";
  const hasRenderableResult = Boolean(completion) || Boolean(requestedPersonaId);
  const personaId = completion?.personaId || requestedPersonaId || fallbackPersonaId;
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
  const shareViewSearchParams = new URLSearchParams();
  shareViewSearchParams.set("personaId", personaId);
  if (completion?.id || completionId) {
    shareViewSearchParams.set("completionId", completion?.id || completionId || "");
  }
  const shareViewHref = `/result/share?${shareViewSearchParams.toString()}`;
  const personaShell = getCanonicalPublicPersonaShell(personaId);
  const currentModeKey = completion?.currentModeKey || null;
  const currentModeLabel = completion?.currentModeLabelJa || null;
  const oracleResolution = resolveOracleLineForResult({
    personaId,
    currentMode: currentModeLabel,
    resultSource: completion ? "live" : "fallback",
  });
  const oracleRecord = completion ? oracleResolution.oracleRecord : null;

  return (
    <>
      {completion && unlockTarget === "deep_report" ? (
        <DteEventTracker
          event="unlock_succeeded"
          completionId={completion?.id || null}
          personaId={completion?.personaId || null}
          sessionId={completion?.sessionId || null}
          locale="ja"
          branchId="yorisou_dte"
          sourceBranchId="yorisou_dte"
          visibilityPolicy="public"
          crossBranchAccessPolicy="explicit_bridge"
          unlockTarget="deep_report"
          triggerKey="result_unlock:success"
          source="result"
          surface="result"
          action="view"
          enabled={true}
        />
      ) : null}
      <DteEventTracker
        event="result_revealed"
        completionId={completion ? completion.id || null : null}
        personaId={completion ? completion.personaId || null : null}
        sessionId={completion ? completion.sessionId || null : null}
        locale="ja"
        durationMs={completion && completion.completedAt ? Math.max(0, renderAt - new Date(completion.completedAt).getTime()) : null}
        branchId="yorisou_dte"
        sourceBranchId="yorisou_dte"
        visibilityPolicy="public"
        crossBranchAccessPolicy="explicit_bridge"
        variantId={snapshot.payload?.subobjects?.analytics_metadata?.variant_id || null}
        variantKey="result_primary_v1"
        triggerKey="result_primary:view"
        source="result"
        surface="result"
        action="view"
        enabled={Boolean(completion)}
        publicResultLabel={publicIdentity.publicResultLabelJa}
        resultVariantIds={snapshot.payload?.subobjects?.analytics_metadata?.variant_id ? [snapshot.payload?.subobjects?.analytics_metadata?.variant_id] : null}
        shareCardVariant={snapshot.payload?.subobjects?.analytics_metadata?.variant_id || null}
      />
      <CanonicalResultSurface
        locale="ja"
        snapshot={snapshot}
        publicIdentity={publicIdentity}
        visualAssetPack={visualAssetResolution.pack}
        nextStepHref={
          completion
            ? buildDynamicTestContinuationHref({
                locale: "ja",
                completionId: completion?.id || completionId,
                openedAt: renderAt,
              })
            : undefined
        }
        nextStepLabel={completion ? publicIdentity.stepCopy.resultPrimaryCtaJa : undefined}
        nextStepHint={completion ? publicIdentity.stepCopy.resultPrimaryHintJa : undefined}
        shareViewHref={shareViewHref}
        personaShell={personaShell}
        currentModeKey={currentModeKey}
        currentModeLabel={currentModeLabel}
        oracleRecord={oracleRecord}
        showFallbackOracle={hasRenderableResult}
      />
    </>
  );
}
