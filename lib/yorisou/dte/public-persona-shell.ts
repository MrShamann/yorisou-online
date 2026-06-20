import { type CurrentModeKey } from "@/lib/yorisou/dte/result-stability";
import { CANONICAL_PERSONAS, getCanonicalPersona } from "@/lib/yorisou/dte/personas";
import { getPersonaAnnexARow, isYorisouPublicSign } from "@/lib/yorisou/dte/persona-annex-a";

export type CanonicalPublicPersonaShell = {
  personaId: string;
  structuralWorkingName: string;
  officialPublicPersonaName: string;
  socialHandle: string;
  functionalSubtitle: string;
  publicSign: string;
  currentModeVariants: Array<{ key: CurrentModeKey; labelJa: string; labelEn: string }>;
  neighboringPersonaCandidates: string[];
  mythCrestMotifCandidate: string;
  shareCardHookDirection: string;
  riskNote: string;
};

function buildCurrentModeVariants(personaId: string) {
  const labels = getPersonaAnnexARow(personaId)?.currentModeVariants || getPersonaAnnexARow("P01")!.currentModeVariants;
  const keys: CurrentModeKey[] = ["active", "steady", "guarded"];
  return labels.map((labelJa, index) => ({
    key: keys[index] || "steady",
    labelJa,
    labelEn: labelJa,
  }));
}

export function resolveCanonicalPublicPersonaModeLabel(
  personaShell: CanonicalPublicPersonaShell | null,
  currentModeKey: CurrentModeKey | string | null | undefined,
  fallbackLabel: string | null | undefined,
) {
  if (!personaShell) {
    return fallbackLabel || null;
  }

  const variant = personaShell.currentModeVariants.find((entry) => entry.key === currentModeKey);
  if (variant?.labelJa) {
    return variant.labelJa;
  }

  return fallbackLabel || personaShell.currentModeVariants[1]?.labelJa || null;
}

function buildPublicPersonaShell(personaId: string): CanonicalPublicPersonaShell {
  const annex = getPersonaAnnexARow(personaId) || getPersonaAnnexARow("P01")!;
  const persona = getCanonicalPersona(personaId) || getCanonicalPersona("P01")!;
  const currentModeVariants = buildCurrentModeVariants(personaId);

  return {
    personaId,
    structuralWorkingName: annex.structuralWorkingName,
    officialPublicPersonaName: annex.officialPublicPersonaName,
    socialHandle: annex.socialHandle,
    functionalSubtitle: annex.functionalSubtitle,
    publicSign: isYorisouPublicSign(annex.publicSign) ? annex.publicSign : "受・秘・柔・組",
    currentModeVariants,
    neighboringPersonaCandidates: annex.neighboringPersonaCandidates.length > 0 ? annex.neighboringPersonaCandidates : persona.closestNeighborPersonas,
    mythCrestMotifCandidate: annex.mythCrestMotifCandidate,
    shareCardHookDirection: annex.shareCardHookDirection,
    riskNote: annex.riskNote,
  };
}

export const CANONICAL_PUBLIC_PERSONA_SHELLS = CANONICAL_PERSONAS.map((persona) => buildPublicPersonaShell(persona.personaId));

export function getCanonicalPublicPersonaShell(personaId: string) {
  return CANONICAL_PUBLIC_PERSONA_SHELLS.find((entry) => entry.personaId === personaId) || CANONICAL_PUBLIC_PERSONA_SHELLS[0];
}
