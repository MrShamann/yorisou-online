# CORP-v1.3 — the brand system

Four brands appear on this site. Until now only one of them had any visual identity, and it did not
agree with the site it was printed on. This records what each brand is, where every value came from,
and what is deliberately absent.

## The rule

**Every value is read from that brand's own canonical source. Nothing is chosen because it looks
right, and nothing is invented to fill a gap.** Where a brand has no source, the field is `null` and
the site draws the absence.

The registry is `app/_corporate/brand.ts`. The guard is
`tests/corporate-p5r2/brandSystem.test.ts`, which does not take the registry's word for anything: it
hashes the artwork, decodes the PNG, and fails if a declared colour is not actually in the image.

## YORISOU

| | |
|---|---|
| Artwork | `public/brand/yorisou-logo.png` — 1254×1254, transparent, `sha256 2618c7b9…` |
| Lockup | Stacked square: symbol over wordmark over strapline. **No horizontal variant, no vector original.** |
| Use | Unmodified. Never cropped, recoloured, redrawn, stretched, or replaced by a text wordmark. |
| Strapline | 「人と技術が、未来をつくる。」 — set by the Founder **inside the artwork** |
| Descriptor | "AI-NATIVE VENTURE FOUNDRY" — also inside the artwork |

### The palette, and why it changed

The artwork is deep navy and blue. The site's accent was **jade green**, chosen in CORP-P5R2, before
any logo existed. When R3 integrated the artwork, nobody reconciled the two — so the company's own
mark and the company's own site stated two different identities on the same screen, and the browser
tab stated a third.

Every value below is a **pixel cluster centre sampled from the artwork**:

| Token | Value | Read from | Contrast |
|---|---|---|---|
| `--brand-ink` | `#061133` | the wordmark ink; the artwork's dominant opaque colour | 17.70:1 on `--paper` |
| `--signal` | `#0c3c9c` | the symbol's core blue | 9.39:1 on `--paper` |
| `--signal-2` | `#1854b4` | the ribbon gradient's mid blue | 6.78:1 on `--paper` |
| `--signal-on-dark` | `#3c9cf0` | the bright highlight and the accent dot | 6.47:1 on `--sys` |
| `--signal-wash` | `#cce4fc` | the pale ribbon | surface only |

**This is a token change, not a redesign.** No element moved, no type changed, no composition was
touched: 41 references across four stylesheets and one component, plus the 404's own accent. It is
one commit to revert.

## Mirai Move

Accent `#0e9f9a`, from its own repository's canonical brand module (its "mobility teal"). Its own
Open Graph card sets a teal dot beside the wordmark, so the dot **is that venture's own device** and
is not one invented here. Japanese line 「地域の移動を、解決まで動かす。」, from the same source.

## Kakari

Accent `#a63e2d`, from its own product shell tokens. Its localisation glossary states "ASCII wordmark
only. Never transliterated (カカリ, 卡卡里)" and enforces that in its own CI; the same rule is enforced
here by the claim guard. Japanese line 「日本の手続きを、自分で進められるように。」

## Chigamo — deliberately unmarked

**Chigamo has no accent, no device and no typographic treatment, because it has no canonical source
of any kind.** No repository, no registry entry, nothing in this repo. Claim ledger C-12 records it
as THESIS.

Its mark is drawn as an **open outline**. Assigning it a colour would be inventing an identity for a
hypothesis, and three equally-branded ventures on a page is exactly the impression the venture count
correction exists to remove. The emptiness carries the meaning, and the guard asserts it stays empty:

```
exactly one venture has no canonical brand source, and it is Chigamo.
```

## Contrast rule for the venture accents

The accents are decorative squares. The wordmark and the stage are **always** rendered as text beside
them, so no meaning is carried by hue and the applicable bar is the 3:1 non-text floor — on both
surfaces, not just the flattering one:

| | on `--paper` | on `--sys` |
|---|---|---|
| Mirai Move `#0e9f9a` | 3.12:1 | 5.79:1 |
| Kakari `#a63e2d` | 6.01:1 | 3.01:1 |

Both clear 3:1 on both grounds. Asserted, not assumed.

## Browser-level identity

`app/icon.png`, `app/apple-icon.png`, `app/opengraph-image.png` and `app/twitter-image.png` are
generated from the artwork by **proportional scale onto the site's own paper ground** — no crop, no
recolour, no redraw. The previous `app/icon.svg` was the purple consumer-product heart (`#6C4CFF`)
and has been removed.

**Recorded limitation.** At 32px only the blue symbol reads; the wordmark below it does not. That is
a property of a stacked square lockup, and fixing it properly needs a logomark-only or vector
variant, which does not exist. Cropping the artwork to make one is forbidden. Shipping the real mark
illegibly small is still strictly better than shipping another product's mark legibly.
