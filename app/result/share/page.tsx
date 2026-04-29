import type { Metadata } from "next";

import ResultShareCard from "@/app/components/ResultShareCard";
import { buildPublicResultIdentity } from "@/lib/result/public-result-identity";
import { buildResultLabSnapshot, getCanonicalPersonaOptions } from "@/lib/result/rendering-contract-adapter";
import { resolveDynamicTestRevealContext } from "@/lib/dynamicTestEngineSession";
import { getResultVisualAssetResolution } from "@/lib/server/resultVisualAssetRegistry";
import { getViewerContext } from "@/lib/server/yorisouAuth";
import { getDynamicTestCompletionRecord } from "@/lib/server/dynamicTestCompletionStore";
import { getCanonicalPublicPersonaShell, resolveCanonicalPublicPersonaModeLabel } from "@/lib/yorisou/dte/public-persona-shell";

export const metadata: Metadata = {
  title: "結果を共有 | Yorisou",
  description: "Yorisouの診断結果を、LINEやSNSでそのまま見せやすい公開カードです。",
  alternates: {
    canonical: "/result/share",
  },
};

type SearchParams = Promise<{
  completionId?: string;
  personaId?: string;
}>;

export default async function ResultSharePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const completionId = typeof params.completionId === "string" ? params.completionId : "";
  const requestedPersonaId = typeof params.personaId === "string" ? params.personaId : "";
  const viewer = await getViewerContext();
  const completion = completionId ? await getDynamicTestCompletionRecord(completionId) : null;
  const personaOptions = getCanonicalPersonaOptions();
  const fallbackPersonaId = requestedPersonaId || personaOptions[0]?.personaId || "P01";
  const truth = resolveDynamicTestRevealContext({
    locale: "ja",
    completionId,
    completion,
    session: viewer.session,
    fallbackPersonaId,
  });
  const personaId = truth.personaId;
  const snapshot = buildResultLabSnapshot({
    personaId,
    scenario: truth.source !== "invalid" ? "result_ready" : "invalid_or_missing_payload",
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

  return (
    <ResultShareCard
      locale="ja"
      identity={publicIdentity}
      pack={visualAssetResolution.pack}
      personaShell={personaShell}
      currentModeLabel={currentModeLabel}
    />
  );
}
