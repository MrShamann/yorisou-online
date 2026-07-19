// AIX-2 — Depth Field seeds. Maps ONLY public-safe identifiers to field
// parameters + a luminous dark palette. Inputs: the 24 public result codes,
// overlay id, confidence band, or a named entry intention. No raw answers,
// no private data, no numeric confidence ever reach this module.

import { hashSeed } from "../state-field/engine";
import type { DepthParams } from "./engine";

// Luminous "Living Intelligence" palette (RGB 0..1 for WebGL; hex mirror for SVG).
export type FieldColor = { rgb: [number, number, number]; hex: string; weight: number };

const JADE: FieldColor = { rgb: [0.22, 0.87, 0.66], hex: "#38DEA9", weight: 4 };
const JADE_DEEP: FieldColor = { rgb: [0.11, 0.62, 0.5], hex: "#1C9E80", weight: 3 };
const MINT: FieldColor = { rgb: [0.5, 0.95, 0.8], hex: "#80F2CC", weight: 2 };
const AMBER: FieldColor = { rgb: [0.91, 0.69, 0.36], hex: "#E7B15C", weight: 2 };
const CORAL: FieldColor = { rgb: [0.94, 0.53, 0.42], hex: "#F0876A", weight: 1 };
const SKY: FieldColor = { rgb: [0.42, 0.74, 0.86], hex: "#6BBCDB", weight: 2 };

const CLAN_PALETTES: Record<string, FieldColor[]> = {
  MS: [JADE, MINT, JADE_DEEP, SKY],
  EM: [AMBER, JADE, CORAL, JADE_DEEP],
  IR: [SKY, JADE, MINT, JADE_DEEP],
  CD: [JADE_DEEP, JADE, MINT, SKY],
  TD: [AMBER, CORAL, JADE, JADE_DEEP],
  WL: [JADE_DEEP, MINT, JADE, SKY],
};

const NEUTRAL_PALETTE: FieldColor[] = [JADE, JADE_DEEP, MINT, AMBER, SKY];

const CLAN_FAMILY: Record<string, number> = { MS: 5, EM: 0, IR: 2, CD: 1, TD: 4, WL: 3 };

export type PublicSignatureContext = {
  resultId?: string | null;
  overlayId?: string | null;
  confidenceBand?: string | null;
};

export function paletteFor(context: PublicSignatureContext): FieldColor[] {
  const clan = (context.resultId ?? "").toUpperCase().slice(0, 2);
  return CLAN_PALETTES[clan] ?? NEUTRAL_PALETTE;
}

export function signatureDepthParams(context: PublicSignatureContext, count = 260): DepthParams {
  const code = (context.resultId ?? "").toUpperCase();
  const clan = code.slice(0, 2);
  const seed = hashSeed(`yorisou-depth:${code}:${context.overlayId ?? ""}:${context.confidenceBand ?? ""}`);
  return {
    seed,
    count,
    paletteSize: (CLAN_PALETTES[clan] ?? NEUTRAL_PALETTE).length,
    cohesion: 0.55 + (hashSeed(`c:${code}`) % 40) / 100,
    tempo: 0.35 + (hashSeed(`t:${code}:${context.overlayId ?? ""}`) % 45) / 100,
    family: CLAN_FAMILY[clan] ?? 5,
  };
}

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

export function intentionPalette(): FieldColor[] {
  return NEUTRAL_PALETTE;
}

export function intentionDepthParams(intention: EntryIntention | null, count = 300): DepthParams {
  const key = intention ?? "current-state";
  return {
    seed: hashSeed(`yorisou-depth-intention:${key}`),
    count,
    paletteSize: NEUTRAL_PALETTE.length,
    cohesion: intention ? 0.72 : 0.5,
    tempo: 0.5,
    family: INTENTION_FAMILY[key],
  };
}
