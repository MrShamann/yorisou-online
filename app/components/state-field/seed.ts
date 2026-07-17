// State Field seeds (AIX-1) — maps ONLY public-safe identifiers to field
// parameters. Inputs are limited to: the 24 public result codes (already used
// in public URLs), the overlay id, the confidence band, or a named entry
// intention. Raw answers, private profile data, and numeric confidence values
// must never reach this module.

import { hashSeed, type FieldParams, type FieldPaletteStop } from "./engine";

// Quiet Computational Nature palette — warm ivory base handled by the page;
// nodes use deep forest, muted sage, and a restrained iridescent pair
// (teal-light / amber-light) that must stay low-alpha.
const FOREST = "rgba(23,59,53,0.6)";
const SAGE = "rgba(105,151,130,0.55)";
const TEAL_LIGHT = "rgba(96,148,141,0.42)";
const AMBER_LIGHT = "rgba(225,184,130,0.4)";
const MOSS = "rgba(66,90,83,0.5)";

// Palette family per public clan prefix. All six stay inside the approved
// tones; the mix ratio is the only thing that varies.
const CLAN_PALETTES: Record<string, FieldPaletteStop[]> = {
  MS: [
    { color: SAGE, weight: 4 },
    { color: TEAL_LIGHT, weight: 3 },
    { color: FOREST, weight: 2 },
  ],
  EM: [
    { color: AMBER_LIGHT, weight: 4 },
    { color: FOREST, weight: 3 },
    { color: SAGE, weight: 2 },
  ],
  IR: [
    { color: TEAL_LIGHT, weight: 4 },
    { color: SAGE, weight: 3 },
    { color: AMBER_LIGHT, weight: 1 },
  ],
  CD: [
    { color: FOREST, weight: 4 },
    { color: MOSS, weight: 3 },
    { color: SAGE, weight: 2 },
  ],
  TD: [
    { color: AMBER_LIGHT, weight: 3 },
    { color: MOSS, weight: 3 },
    { color: TEAL_LIGHT, weight: 2 },
  ],
  WL: [
    { color: MOSS, weight: 4 },
    { color: SAGE, weight: 3 },
    { color: TEAL_LIGHT, weight: 2 },
  ],
};

const NEUTRAL_PALETTE: FieldPaletteStop[] = [
  { color: SAGE, weight: 4 },
  { color: FOREST, weight: 3 },
  { color: TEAL_LIGHT, weight: 2 },
  { color: AMBER_LIGHT, weight: 1 },
];

const LINE_COLOR = "rgba(105,151,130,0.16)";

const CLAN_FAMILY: Record<string, number> = { MS: 5, EM: 0, IR: 2, CD: 1, TD: 4, WL: 3 };

export type PublicSignatureContext = {
  resultId?: string | null;
  overlayId?: string | null;
  confidenceBand?: string | null;
};

/**
 * Deterministic State Signature parameters from a public-safe result context.
 * Same context -> same parameters -> same visual, across sessions and
 * surfaces (result page, share card).
 */
export function signatureParams(context: PublicSignatureContext, nodeCount = 72): FieldParams {
  const code = (context.resultId ?? "").toUpperCase();
  const clan = code.slice(0, 2);
  const palette = CLAN_PALETTES[clan] ?? NEUTRAL_PALETTE;
  const family = CLAN_FAMILY[clan] ?? 5;
  const seedInput = `yorisou-signature:${code}:${context.overlayId ?? ""}:${context.confidenceBand ?? ""}`;
  const seed = hashSeed(seedInput);
  return {
    seed,
    nodeCount,
    palette,
    lineColor: LINE_COLOR,
    // suffix letters give each of the 4 types inside a clan its own cohesion
    // and tempo, so the 24 signatures stay visually distinct.
    cohesion: 0.55 + (hashSeed(`c:${code}`) % 40) / 100,
    tempo: 0.35 + (hashSeed(`t:${code}:${context.overlayId ?? ""}`) % 45) / 100,
    family,
  };
}

/**
 * Palette adaptation for dark share surfaces: same structure/arrangement,
 * lifted luminance so the signature stays visible on deep forest ground.
 */
export function onDarkPalette(palette: FieldPaletteStop[]): FieldPaletteStop[] {
  const lift: Record<string, string> = {
    [FOREST]: "rgba(214,232,224,0.75)",
    [SAGE]: "rgba(186,214,199,0.72)",
    [TEAL_LIGHT]: "rgba(168,214,206,0.66)",
    [AMBER_LIGHT]: "rgba(238,209,168,0.62)",
    [MOSS]: "rgba(196,214,205,0.6)",
  };
  return palette.map((stop) => ({ color: lift[stop.color] ?? stop.color, weight: stop.weight }));
}

export const ON_DARK_LINE_COLOR = "rgba(210,228,219,0.22)";

export type EntryIntention =
  | "current-state"
  | "relationship-distance"
  | "work-life-rhythm"
  | "continue-previous"
  | "discover-next";

const INTENTION_FAMILY: Record<EntryIntention, number> = {
  "current-state": 5,
  "relationship-distance": 1,
  "work-life-rhythm": 3,
  "continue-previous": 4,
  "discover-next": 2,
};

/** Ambient field parameters for entry surfaces, keyed by intention only. */
export function intentionParams(intention: EntryIntention | null, nodeCount = 72): FieldParams {
  const key = intention ?? "current-state";
  return {
    seed: hashSeed(`yorisou-intention:${key}`),
    nodeCount,
    palette: NEUTRAL_PALETTE,
    lineColor: LINE_COLOR,
    cohesion: intention ? 0.72 : 0.5,
    tempo: 0.5,
    family: INTENTION_FAMILY[key],
  };
}
