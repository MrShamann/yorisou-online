/**
 * CORP-v1.3.1 — the brand system, in one place, with typed provenance on every value.
 *
 * WHAT CHANGED FROM v1.3, AND WHY THE OLD RULE WAS WRONG.
 *
 * v1.3 said: "every brand value here is read from that brand's own canonical source; nothing is
 * invented to fill a gap." That was the right rule while no Founder brand decision existed — it is
 * what kept a jade accent from being invented for a venture with no identity. It is now stale, and
 * it was actively producing a false result: it left Kakari and Chigamo permanently unmarked and
 * left Mirai Move represented by a coloured square while its real logo sat on the Founder's disk.
 *
 * **The Founder is itself an authorised brand source for this corporate surface.** So provenance is
 * now TYPED rather than assumed, and every value says which kind of authority it rests on. What has
 * not changed: nothing is invented, and no value may exist without a source.
 */

/**
 * Where a brand value's authority comes from. Every value in this file carries one.
 *
 * - `EXISTING_OFFICIAL_ASSET`            artwork the Founder supplied, used as supplied.
 * - `PROJECT_CANONICAL_BRAND`            read from that project's own repository or product source.
 * - `FOUNDER_BRAND_DECISION`             a Founder decision about this corporate surface.
 * - `FOUNDER_APPROVED_CORPORATE_COMARK`  a mark approved for the corporate site that the venture's
 *                                        own product does NOT adopt. Scope is the boundary.
 * - `FOUNDER_APPROVED_NEW_VENTURE_MARK`  a mark created for a venture that had none.
 */
export type BrandProvenance =
  | "EXISTING_OFFICIAL_ASSET"
  | "PROJECT_CANONICAL_BRAND"
  | "FOUNDER_BRAND_DECISION"
  | "FOUNDER_APPROVED_CORPORATE_COMARK"
  | "FOUNDER_APPROVED_NEW_VENTURE_MARK";

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
  provenance: "EXISTING_OFFICIAL_ASSET" as BrandProvenance,
} as const;

/**
 * CORP-v1.3.1 — the symbol, extracted for the browser.
 *
 * v1.3 shipped the whole stacked lockup as the favicon and recorded that at 32px only a blue smudge
 * read, because cropping the artwork was forbidden. The Founder has now authorised a NARROW
 * derivative: the symbol area only, for favicon and app-icon use.
 *
 * It is a pure crop. The band was found from the artwork's own alpha profile — rows 161 to 786 are
 * one contiguous content band, cleanly separated from the wordmark band that begins at row 844 — so
 * the boundary is measured, not eyeballed. Geometry, colours and proportions are untouched: nothing
 * is redrawn, simplified, recoloured, or re-proportioned. The full lockup remains the mark for the
 * header, the homepage signature, the footer and the share cards.
 */
export const YORISOU_SYMBOL = {
  src: "/brand/yorisou-symbol.png",
  /** (left, top, right, bottom) in the artwork's own pixel space. */
  cropBox: [111, 161, 1119, 787] as const,
  width: 1008,
  height: 626,
  provenance: "FOUNDER_BRAND_DECISION" as BrandProvenance,
  note: "Founder-authorised symbol derivative for favicon and app icons. Crop only.",
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

export type VentureMark =
  | { readonly kind: "image"; readonly src: string; readonly width: number; readonly height: number }
  | { readonly kind: "svg"; readonly id: "kakari" | "chigamo" };

export type VentureBrand = {
  /** ASCII wordmark. Never transliterated in any locale — see the claim guard. */
  readonly name: string;
  /**
   * The venture's own mark, rendered in the shared venture slot on every surface.
   *
   * v1.3 had no marks at all: a 9px colour square stood in for each venture, and the one with no
   * colour got an empty square. All three now have a real mark, and the square is gone.
   */
  readonly mark: VentureMark;
  readonly markProvenance: BrandProvenance;
  /** Where the mark came from. Never empty. */
  readonly markSource: string;
  /**
   * A supporting brand colour, or `null` where the venture has none. It is NOT rendered as an
   * identity any more — the mark is. It stays recorded because it is a fact about the venture.
   */
  readonly accent: string | null;
  /** Where the accent above was read from. */
  readonly source: string;
};

export const VENTURE_BRAND: Record<string, VentureBrand> = {
  "/mirai-move": {
    name: "Mirai Move",
    /*
     * The real logo, at last. The Founder's original is `Miraimove logo.png` (1254x1254, sha256
     * c7d62d96…, NO alpha, ~95% flat #F8F8F8 padding) — three byte-identical copies exist on the
     * Founder's machine, and no vector original was found anywhere that was searched (the Founder
     * directories, both project trees, and both Founder decks, whose archives contain no media at
     * all). Stated as "not found", not as "does not exist": the search keyed on the name.
     *
     * The file used here is NOT derived by this repository. Mirai Move's own repository already
     * carries a committed, documented brand kit built from that exact source — cropped to the
     * artwork bounds, background keyed to transparency with un-premultiplied edges so it does not
     * halo on dark, resized with Lanczos, and nothing redrawn or recoloured. Its own
     * `public/brand/README.md` records the same source hash. Taking that asset rather than
     * re-deriving one keeps a single canonical Mirai Move identity across both sites.
     */
    mark: { kind: "image", src: "/brand/ventures/mirai-move-mark.png", width: 542, height: 245 },
    markProvenance: "PROJECT_CANONICAL_BRAND",
    markSource:
      "Mirai Move's own repository brand kit (public/brand/mirai-move-mark.png, sha256 108e085b…), " +
      "a documented technical derivative of the Founder original sha256 c7d62d96…",
    /*
     * CORRECTED IN v1.3.1. This said #0e9f9a "mobility teal", sourced to "Mirai Move's own
     * repository". That citation had gone stale, though not in the way it first appeared:
     * `--color-mobility-teal: #0e9f9a` is still declared in that repo's globals.css and is never
     * overridden — it is dead, referenced by nothing anywhere on origin/main. What IS overridden is
     * `--accent`, which a later `:root` block resets to the copper below. So teal was never the
     * effective accent this site should have been citing. The mark now carries the identity, so this
     * value is supporting data rather than something the site paints.
     */
    accent: "#8e5330",
    source:
      "Mirai Move's own globals.css on origin/main — the effective --accent after the second :root " +
      "block overrides the earlier mobility-teal declaration.",
  },
  "/kakari": {
    name: "Kakari",
    /*
     * FOUNDER DECISION: the corporate site presents Kakari as the co-mark 「係 / Kakari」. 係 is the
     * identity character — 亻 carrying 系, a person carrying a thread — and it is set above the
     * terminal rule that is Kakari's own diagram signature.
     *
     * SCOPE IS THE POINT. This is a CORPORATE co-mark. The Kakari application keeps the ASCII
     * `Kakari` wordmark, and its glossary's ban on カカリ and 卡卡里 is untouched and still enforced
     * here by the claim guard. The kanji is not a transliteration and not a translation: it is a
     * second mark the corporate surface is authorised to use, and the application is not.
     */
    mark: { kind: "svg", id: "kakari" },
    markProvenance: "FOUNDER_APPROVED_CORPORATE_COMARK",
    markSource:
      "Founder decision for the YORISOU corporate surface only. 係 set in the corporate site's own " +
      "Japanese stack above the terminal rule from Kakari's own ProcedureSystem diagram.",
    accent: "#a63e2d",
    source: "Kakari's own product shell accent (--u-accent in its unified shell).",
  },
  "/chigamo": {
    name: "Chigamo",
    /*
     * FOUNDER DECISION, SUPERSEDING v1.3. v1.3 drew Chigamo as an empty square because it had no
     * brand source, and recorded the absence as the honest signal. The Founder has now authorised a
     * mark, so the absence is no longer the truth about its identity.
     *
     * What has NOT changed is its EVIDENCE state. A logo is not a product: Chigamo is still concept
     * stage, still Foundry stage 1, still counted apart from the two ventures in build, and still
     * has no brand colour — the mark is monochrome, because a colour would be an identity nobody
     * has approved. Claim ledger C-12 is unaffected.
     */
    mark: { kind: "svg", id: "chigamo" },
    markProvenance: "FOUNDER_APPROVED_NEW_VENTURE_MARK",
    markSource:
      "Founder-authorised new mark, designed for this release: three brackets closing on one point, " +
      "from Chigamo's own thesis that place, time and situation must align. Monochrome.",
    accent: null,
    source:
      "No canonical colour source exists. Claim ledger C-12 records Chigamo as THESIS, so no colour " +
      "is assigned; the mark carries the identity and carries no hue.",
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
