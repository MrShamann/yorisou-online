# CORP-v1.2R3 — signature hook, logo integration, AI-native refoundation

Continues CORP-v1.2R2.1 from `0de5ca3`. Preview only. Not merged. Production, DNS, consumer Today,
120Q and PR #127 all untouched.

## Preflight

Local HEAD, `origin` branch head and PR #156 head were all `0de5ca3` — no concurrent writer this
time, unlike R2.1, where another package's `/company` correction had landed locally. Lock free and
acquired. Working tree clean apart from the two protected untracked files.

## The logo

Found by Spotlight: `mdfind` for a Yorisou-named image located the Founder's folder under
`Documents/Jinyang/Jinyang2026/…` (the "Jin Yang 2026" folder the package described). An identical
copy sits in `Downloads` — same sha256, so no version ambiguity.

| | |
|---|---|
| Candidates | 2 — byte-identical (`cmp` clean), so effectively one asset |
| Chosen | `Yorisou Logo.png` |
| Format / size | PNG, **1254 × 1254**, 473 KB, alpha channel present |
| sha256 | `2618c7b9cc0c2b28eb61db7b657f9033…` |
| Vector original | **None.** No `.svg`, `.ai`, `.eps` or `.pdf` exists anywhere under the Yorisou folder |
| Repo location | `public/brand/yorisou-logo.png` |

The Founder's private filesystem path is deliberately not recorded here.

**Verified before use, not assumed.** The background is genuinely transparent (all four corners
RGBA 0,0,0,0; 4677 of 5476 sampled pixels fully transparent), so it composites on any surface. The
palette measured out as deep navy → blue `#003090` → pale blue `#c0d8f0`.

**It is a stacked square lockup** — symbol above wordmark above tagline 人と技術が、未来をつくる。 above
the strapline AI-NATIVE VENTURE FOUNDRY. That has one hard consequence: rendered 56px tall, the
wordmark band is only ~11px. §1.3 forbids cropping, so a compact horizontal header mark cannot be
derived. **I built one and then deleted it** — cropping the symbol out of the lockup is standard
brand practice but the instruction is explicit, so the header is sized around the artwork instead.

Integrated at: header (46px, sized so symbol and wordmark both read), homepage signature, footer.
Not used as a favicon — no logomark-only variant exists and one may not be manufactured. The dark
navy wordmark means the asset belongs on light surfaces; the surrounding surfaces were designed for
that rather than the artwork being recoloured.

**The mark's own geometry informed the system, without touching the mark.** Its Y is built from two
crossing ribbons carrying a node-and-line network — the same vocabulary the Foundry field already
speaks. That is why the signature reads as one idea rather than a logo dropped onto a page.

## What the benchmark actually taught

Full teardown in `CORP_V12R3_SIGNATURE_BENCHMARK.md`. Three findings:

1. **Every one of the five gives ONE object most of the viewport** — full-bleed, or cropped by the
   edge, never a figure seated politely inside the same container as everything else.
2. **Meaning is complete at frame zero.** Linear's UI and Anthropic's headline both read in a still
   screenshot. Motion reinforces; it never withholds.
3. **The proof is whatever they honestly have** — product for Linear and Vercel, imagery for Scale
   and OpenAI, typographic restraint for Anthropic.

And the corollary specific to this company: **Yorisou has no product screenshot it can honestly show
and no photography it should use.** So the only honest equivalent of "show the thing" is to show the
formation system itself, at the size the others give their product.

## Why R2.1 still felt conventional

- **No object owned the viewport.** A 50/50 split with the system figure inside a card, inside the
  same 1240px container as every other section.
- **Meaning was time-gated.** ~11s for the hero loop, ~32s for the explainer. A visitor who looked
  for three seconds saw signals appearing and left before evidence, venture, team or company
  arrived — the most important sentence was delivered last.
- **Uniform rhythm.** Hero → Band → Cards → Band → Cards at one width with one spacing rule.

## The signature

One visual idea, now specific to Yorisou:

> **A Japanese editorial column stating what the company does, with the formation system running
> full-bleed off the opposite edge, and the three ventures being formed pinned on a rail directly
> beneath it.**

Composition, at frame zero and with no animation at all:

- the real lockup;
- the hook 「構造の課題を、会社にする。」 at up to 54px — the one line a three-second visitor reads;
- the longer thesis as support;
- the participation CTA;
- the Foundry object, dark, **overshooting the viewport edge by 48px** (measured) and clipped by the
  section — the deliberate container break;
- the NOW-FORMING rail: Mirai Move, Kakari, Chigamo with their own Japanese lines and real stages,
  **fully inside the fold at 1440, 1280 and 900** (measured).

Three container breaks in total — the bleeding panel, the edge-anchored rail, and the asymmetric
34%/66% split. Not more.

## Motion: ~11s → 3.4s, and nothing waits

The field was inverted rather than sped up. **Every element is drawn at its final state at frame
zero**; the 3.4s loop only pulses jade along the chain to confirm the reading order. Reduced motion
simply stops, and because nothing was ever hidden, nothing is lost — the frame-zero screenshot and
the reduced-motion render are the same picture.

## The 30-second explainer, demoted

It opened `/about` and then repeated five of the same stage bodies as cards directly underneath —
the duplicated wall the brief forbids. It now sits **sixth of seven sections**, after the stages,
independence, Asterion, economics and ventures content. The homepage states the company at frame
zero, so nobody needs to watch anything.

## Footer tagline — audited and replaced

It still carried the pre-v1.2 line 人と社会のあいだに、次のよりそいをつくる。, which pulls the company
back toward consumer positioning. Replaced with the v1.2 hook across all 21 locales, without
changing any locale's publication status. Verified by DOM inspection that the old line is no longer
visible on `/`, `/about` or `/company` — a raw-HTML grep still finds it in RSC flight data for an
unused module, which is not rendered output.

## Defects found by looking, and fixed

The screenshot loop caught three things tests did not:

1. **The venture rail fell below the fold.** The hero was too tall; the whole point of the rail is
   that it is visible without scrolling. Logo, hook and padding retuned against the rendered 1440×900
   frame until the rail sat inside it — verified by measurement, not by eye.
2. **The dark panel did not reach the edge.** It read as one more card with a margin. Now measured
   at −48px past the viewport edge at 1440, 1280 and 900.
3. **The supporting sentence was cut off mid-clause** — I had rendered `h.lead[0]`, only the first
   line of a two-line array. The block was removed entirely; hook plus thesis is the stronger
   hierarchy anyway.

A fourth came from the responsive gate after it was sharpened: at 430/390/375 the hook and lead ran
to the exact viewport edge, because the grid pads only its inline-start so the panel can bleed. The
brand column now carries its own end padding.

## The responsive gate was corrected, not relaxed

The gate reported 42 failures — all of them the deliberate bleed. Rather than raise a threshold, the
check now ignores elements an `overflow: hidden` ancestor clips **and separately asserts that no
text element is cut off**. That immediately surfaced the real mobile defect above, which the blunter
version had buried among 42 false positives.

## Performance

3-run medians, same method and machine as R2.1:

| | R2.1 | R3 |
|---|---|---|
| ja Home | 87 | **88** (88, 88, 90) |
| ar Home | 86 | **89** (89, 88, 89) |
| ja Company | 89 | **87** (90, 87, 87) |
| Accessibility | 100 | **100** |
| Best practices | 100 | **100** |

R3 adds a logo image and a larger hero and lands in the same band — the differences are inside the
run-to-run spread. The ~90 target is still not met on the median, unchanged from R2.1, and it is
reported that way rather than by quoting the run that hit 90. The logo is served through
`next/image`, so the 473 KB original is resized and re-encoded rather than shipped.

## Validation

189/189 route × locale · 23/23 guards · tsc clean · eslint 0 on corporate code · build passes ·
**axe 0 violations across 56 combinations** · **responsive 0 issues across 210 combinations** ·
reduced motion and keyboard clean · 0 internal tokens across 189 rendered pages · consumer
regression 7/7 · 404 intact.

A fifth defect surfaced at the very end: the Arabic shared-capability label reached the canvas edge
at 375px, the longest of the 21 strings. Insetting the label fixed it in every locale without moving
the rule it names — verified across all seven viewports in both ja and ar.

## Residual

- Performance median ~87–89, below 90. Should be measured on the CDN, not this laptop.
- No vector logo and no logomark-only variant exists, so the header is sized around a square lockup
  and there is no favicon integration.
- Consumer Today / ARCH-P3 unchanged. `js-yaml` unchanged. Contact still blocked. 19 locales remain
  `preview_only`.
