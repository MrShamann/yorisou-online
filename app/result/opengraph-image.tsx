import { ImageResponse } from "next/og";

import { buildPublicResultIdentity } from "@/lib/result/public-result-identity";
import { getCanonicalPublicPersonaShell } from "@/lib/yorisou/dte/public-persona-shell";
import { renderResultSharePreviewImage } from "@/lib/result/share-preview-image";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type SearchParams = Promise<{
  completionId?: string;
  personaId?: string;
}>;

export default async function Image({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const requestedPersonaId = typeof params.personaId === "string" ? params.personaId : "";
  const personaId = requestedPersonaId || "P01";
  const personaShell = getCanonicalPublicPersonaShell(personaId);
  const publicIdentity = buildPublicResultIdentity({
    personaId,
    payload: null,
    sourceResultLabel: personaShell.officialPublicPersonaName,
    sourceResultSummary: personaShell.functionalSubtitle,
    sourceShareLine: personaShell.shareCardHookDirection,
    sourceTeaserLine: personaShell.shareCardHookDirection,
    sourcePaywallTease: personaShell.functionalSubtitle,
  });

  return new ImageResponse(
    renderResultSharePreviewImage({
      personaName: publicIdentity.publicResultLabelJa || personaShell?.officialPublicPersonaName || "Yorisou",
      socialLine: publicIdentity.shareSocialHookJa || publicIdentity.shareSendLineJa || personaShell?.socialHandle || publicIdentity.shareLineJa || "",
      subtitle: publicIdentity.publicSubtitleJa || personaShell?.functionalSubtitle || "",
      traitChips: publicIdentity.traitChipsJa || [],
      publicSign: personaShell?.publicSign || publicIdentity.shareCategoryTagJa || null,
      currentModeLabel: personaShell.currentModeVariants[1]?.labelJa || null,
      urlLabel: "yorisou.online/line/mini-app",
    }),
    size,
  );
}
