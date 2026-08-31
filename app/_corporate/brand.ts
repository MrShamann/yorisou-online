/**
 * CORP-v1.3 — the brand system, in one place, with provenance on every value.
 *
 * WHY THIS FILE EXISTS. Until now the corporate site had a logo (added in v1.2R3) and three venture
 * names set as plain text, and the two had nothing to do with each other: the artwork is deep navy
 * and blue, the site's accent was a jade green chosen before any logo existed, and the ventures had
 * no visual identity at all. Four brands appeared on the same screen with no system connecting them.
 *
 * THE RULE THIS FILE ENFORCES. **Every brand value here is read from that brand's own canonical
 * source.** Nothing is chosen to look good, and nothing is invented to fill a gap. Where a brand has
 * no canonical source, the field is `null` and the site renders the absence rather than a
 * plausible-looking substitute — which is why Chigamo has no colour.
 *
 * Sources, all verified 2026-08-31:
 *
 * - YORISOU     the Founder's artwork, `public/brand/yorisou-logo.png`. The palette below is
 *               SAMPLED from its pixels, not eyeballed. The artwork is used unmodified everywhere:
 *               never cropped, never recoloured, never redrawn, never replaced by a text wordmark.
 * - Mirai Move  its own repository's canonical brand module, which defines the name, the Japanese
 *               slogan and the mobility-teal accent, and whose own Open Graph card is a wordmark and
 *               a teal dot — so the dot is that venture's own device, not one invented here.
 * - Kakari      its own product shell defines the accent, and its own localisation glossary states
 *               "ASCII wordmark only. Never transliterated" — a rule enforced in its CI and in
 *               `tests/corporate-p5r2/corporateClaims.test.ts` here.
 * - Chigamo     NO canonical source exists. Not a repository, not a registry entry, nothing in this
 *               repo. Claim ledger row C-12 records it as THESIS. It therefore gets no accent and no
 *               device, and the site draws it as an open outline. The absence is the honest signal.
 */

/** The Founder's artwork. Intrinsic size and hash are recorded so a substitution is detectable. */
export const YORISOU_ARTWORK = {
  src: "/brand/yorisou-logo.png",
  width: 1254,
  height: 1254,
  sha256: "2618c7b9cc0c2b28eb61db7b657f9033c9371075eb6f7d2a7c9ddb8de76b06ef",
  /** Stacked square lockup: symbol over wordmark over strapline. There is no horizontal variant. */
  lockup: "stacked-square",
  /** No vector original exists. Recorded so nobody re-searches for one, and so the gap stays visible. */
  vectorOriginal: null,
} as const;

/**
 * Sampled from the artwork. Each value is the centre of a real pixel cluster in the PNG; the
 * sampling is re-run and asserted in `tests/corporate-p5r2/brandSystem.test.ts`, so if the artwork
 * is ever replaced with one of a different palette, the guard fails instead of the site drifting.
 */
export const YORISOU_PALETTE = {
  /** The wordmark ink — the artwork's dominant opaque colour. */
  ink: "#061133",
  /** The symbol's core blue. Carries the accent on light surfaces. */
  signal: "#0c3c9c",
  /** The mid blue of the ribbon gradient. */
  signal2: "#1854b4",
  /** The bright highlight and the accent dot. Carries the accent on the dark system surface. */
  signalOnDark: "#3c9cf0",
  /** The pale ribbon, used as a wash. */
  wash: "#cce4fc",
} as const;

/**
 * The strapline is part of the artwork itself — the Founder set it inside the lockup, so it is a
 * Founder-authored brand line rather than site copy someone here wrote. The site says it in the
 * reader's language while the artwork keeps saying it in Japanese, which is why the translated
 * form lives in `chrome.footerTagline` in all 21 locales rather than being hardcoded here.
 */
export const YORISOU_STRAPLINE_JA = "人と技術が、未来をつくる。";

/** Also set inside the lockup, in Latin capitals, in every locale's artwork. */
export const YORISOU_DESCRIPTOR = "AI-NATIVE VENTURE FOUNDRY";

export type VentureBrand = {
  /** ASCII wordmark. Never transliterated in any locale — see the claim guard. */
  readonly name: string;
  /**
   * That venture's own accent colour, or `null` where the venture has no canonical brand source.
   * Decorative only: the name and the stage are always rendered as text beside it, so nothing is
   * communicated by hue alone and the 3:1 non-text contrast floor is the applicable bar.
   */
  readonly accent: string | null;
  /** Where the value above was read from. Empty string is not acceptable; `null` accent needs a reason. */
  readonly source: string;
};

export const VENTURE_BRAND: Record<string, VentureBrand> = {
  "/mirai-move": {
    name: "Mirai Move",
    accent: "#0e9f9a",
    source: "Mirai Move's own repository: brand module (mobility teal) and its own OG card device.",
  },
  "/kakari": {
    name: "Kakari",
    accent: "#a63e2d",
    source: "Kakari's own product shell accent, plus its localisation glossary (ASCII wordmark only).",
  },
  "/chigamo": {
    name: "Chigamo",
    accent: null,
    source:
      "No canonical source exists — no repository, no registry entry, nothing in this repo. " +
      "Claim ledger C-12 records it as THESIS, so no colour may be assigned to it.",
  },
};

/**
 * What each venture IS, publicly — the distinction the venture COUNT has to respect.
 *
 * `building` means there is a built system to point at. `concept` means there is a hypothesis and
 * nothing else. Both are read from the same evidence as `ventureState.ts`, and the site derives its
 * counts from here rather than from a sentence written twenty-one times.
 */
export type VentureClass = "building" | "concept";

export const VENTURE_CLASS: Record<string, VentureClass> = {
  /** Public site live; research system runs unattended. Ledger C-10, C-26, C-27. */
  "/mirai-move": "building",
  /** Web and mobile surfaces built; private-testing MVP, zero users. Ledger C-11, C-28. */
  "/kakari": "building",
  /** Hypothesis only; nothing tested. Ledger C-12. */
  "/chigamo": "concept",
};

/** How many ventures are actually being built, and how many are still only an idea. */
export function ventureCounts(): { building: number; concept: number; total: number } {
  const values = Object.values(VENTURE_CLASS);
  const building = values.filter((v) => v === "building").length;
  const concept = values.filter((v) => v === "concept").length;
  return { building, concept, total: values.length };
}

/** Look a venture's brand up by its ASCII wordmark, which is stable and is what the views carry. */
export function ventureBrandByName(name: string): VentureBrand | null {
  for (const b of Object.values(VENTURE_BRAND)) if (b.name === name) return b;
  return null;
}
