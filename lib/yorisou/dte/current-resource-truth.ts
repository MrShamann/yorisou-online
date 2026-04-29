import {
  assertPersonaAnnexACompleteness,
  getPersonaAnnexARow,
  isYorisouPublicSign,
  YORISOU_PERSONA_ANNEX_A_ROWS,
  YORISOU_PERSONA_ANNEX_A_VERSION,
} from "@/lib/yorisou/dte/persona-annex-a";

export const CURRENT_TRUTH_VERSION = YORISOU_PERSONA_ANNEX_A_VERSION;

export const CURRENT_TRUTH_COUNTS = {
  questionsPerSession: 33,
  dimensions: 21,
  personas: 31,
  answerOptions: 5,
} as const;

export const CURRENT_TRUTH_RUNTIME = {
  liveRuntime: "Vercel",
  productSurface: "LINE-first/mobile-first DTE",
  websiteRole: "secondary explanation/trust/SEO",
  outwardFacingAgent: "Yorisou Companion / Growth Agent",
  openClawRole: "internal execution/orchestration only",
  hermesRole: "internal_sidecar_readonly",
} as const;

export const CURRENT_TRUTH_SHELL_SOURCE = "persona-annex-a" as const;

export const CURRENT_TRUTH_SUPERSEDED_SOURCES = [
  "old Japanese Myth Persona Naming System",
  "final-naming lock",
  "風岐-style public naming if not Annex A",
  "freeform sign labels such as 朝の立ち上がり型",
] as const;

export const CURRENT_TRUTH_PUBLIC_SIGN_REGEX = /^[先受]・[表秘]・[柔刃]・[走組]$/;

export function getCurrentTruthPersonaRow(personaId: string) {
  return getPersonaAnnexARow(personaId);
}

export function getCurrentTruthPersonaRows() {
  return YORISOU_PERSONA_ANNEX_A_ROWS;
}

export function assertCurrentResourceTruthCompleteness() {
  const annex = assertPersonaAnnexACompleteness();
  return {
    version: CURRENT_TRUTH_VERSION,
    counts: CURRENT_TRUTH_COUNTS,
    runtime: CURRENT_TRUTH_RUNTIME,
    personaShellSource: CURRENT_TRUTH_SHELL_SOURCE,
    publicSignGrammar: CURRENT_TRUTH_PUBLIC_SIGN_REGEX.source,
    rows: annex.rows,
    rowCount: annex.rowCount,
    invalidSignsCount: annex.invalidSignsCount,
    p01: annex.p01,
    p02: annex.p02,
    p07: annex.p07,
    p09: annex.p09,
    p11: annex.p11,
  };
}

export { isYorisouPublicSign };
