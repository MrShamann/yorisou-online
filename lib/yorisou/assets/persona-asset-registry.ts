import { CANONICAL_PUBLIC_PERSONA_SHELLS } from "@/lib/yorisou/dte/public-persona-shell";
import type { PersonaAssetRecord } from "./persona-asset-types";

function buildFallbackRecord(personaId: string, officialPublicPersonaName: string): PersonaAssetRecord {
  return {
    personaId,
    officialPublicPersonaName,
    portraitPath: null,
    crestPath: null,
    resultHeroPath: null,
    shareAccentPath: null,
    oracleMotifPath: null,
    videoThumbnailPath: null,
    status: "placeholder",
    source: "fallback_css",
    aspectRatio: "4:5",
    mobileSafe: true,
    riskNote: "A quiet visual frame keeps the result visually settled.",
  };
}

export const PERSONA_ASSET_REGISTRY: PersonaAssetRecord[] = CANONICAL_PUBLIC_PERSONA_SHELLS.map((shell) =>
  buildFallbackRecord(shell.personaId, shell.officialPublicPersonaName),
);

export function getPersonaAssetRecord(personaId: string | null | undefined) {
  return PERSONA_ASSET_REGISTRY.find((record) => record.personaId === personaId) || PERSONA_ASSET_REGISTRY[0] || null;
}

export function countPersonaAssetStatuses() {
  return PERSONA_ASSET_REGISTRY.reduce(
    (acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      acc.source[record.source] = (acc.source[record.source] || 0) + 1;
      return acc;
    },
    {
      missing: 0,
      placeholder: 0,
      approved_static: 0,
      needs_review: 0,
      source: {
        manual_upload: 0,
        generated_candidate: 0,
        fallback_css: 0,
      },
    } as {
      missing: number;
      placeholder: number;
      approved_static: number;
      needs_review: number;
      source: Record<"manual_upload" | "generated_candidate" | "fallback_css", number>;
    },
  );
}
