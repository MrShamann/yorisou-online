# CORP-v1.3.1 — brand asset register

Supersedes the provenance model in `CORP_V13_BRAND_SYSTEM.md`. That document's palette, contrast and
YORISOU-artwork sections remain accurate; its rule that **every value must come from the brand's own
pre-existing canonical source** does not, and is replaced here.

## Why the old rule was replaced

v1.3's rule was: *"every brand value here is read from that brand's own canonical source; nothing is
invented to fill a gap."* That was correct while no Founder brand decision existed — it is what
stopped a colour being invented for a venture that had none.

It had also started producing a false result. It left Kakari and Chigamo permanently unmarked, and it
left Mirai Move represented by a coloured square **while its real logo already existed** on the
Founder's machine and in Mirai Move's own repository. A rule that forbids using a real asset because
no rule-shaped path to it had been written down is a rule that has outlived its purpose.

**The Founder is itself an authorised brand source for this corporate surface.** Provenance is now
typed rather than assumed. What has not changed: nothing is invented, and no value exists without a
recorded source.

## Provenance kinds

| Kind | Meaning |
|---|---|
| `EXISTING_OFFICIAL_ASSET` | Artwork the Founder supplied, used as supplied. |
| `PROJECT_CANONICAL_BRAND` | Read from that project's own repository or product source. |
| `FOUNDER_BRAND_DECISION` | A Founder decision about this corporate surface. |
| `FOUNDER_APPROVED_CORPORATE_COMARK` | A mark approved for the corporate site that the venture's own product does **not** adopt. Scope is the boundary. |
| `FOUNDER_APPROVED_NEW_VENTURE_MARK` | A mark created for a venture that had none. |

The registry is `app/_corporate/brand.ts`. The guard is `tests/corporate-p5r2/brandSystem.test.ts`,
which does not take the registry's word for anything: it hashes the artwork, decodes the PNG to
confirm each declared colour is actually in it, and fails if a mark's provenance kind is not one of
the five above or its source string is empty.

---

## YORISOU

| | |
|---|---|
| Asset | `public/brand/yorisou-logo.png` — 1254×1254, transparent, `sha256 2618c7b9…` |
| Provenance | `EXISTING_OFFICIAL_ASSET` |
| Used at | header, homepage signature, footer, Open Graph and Twitter cards |
| Rule | unmodified: never cropped, recoloured, redrawn, stretched, or replaced by a text wordmark |

### The symbol derivative — new in v1.3.1

v1.3 shipped the whole stacked lockup as the favicon and recorded honestly that at 32px only a blue
smudge read, because cropping was forbidden. **The Founder has now authorised a narrowly scoped
derivative: the symbol area only, for favicon and app-icon use.**

It is a pure crop. The band was found from the artwork's own alpha profile — rows **161–786** form
one contiguous content band, cleanly separated from the wordmark band that begins at row **844** — so
the boundary is measured, not eyeballed. Crop box `(111, 161, 1119, 787)`, yielding 1008×626.

Geometry, colours and proportions are untouched. Nothing is redrawn, simplified, recoloured or
re-proportioned.

| File | Size | Use |
|---|---|---|
| `public/brand/yorisou-symbol.png` | 1008×626 | the extracted symbol, transparent |
| `app/favicon.ico` | 16/32/48/64/128/256 | browser tab, multi-resolution so the browser picks rather than downscales |
| `app/icon.png` | 512×512 | high-DPI icon contexts |
| `app/apple-icon.png` | 180×180 | home screen; inset to 0.80 because Apple masks the corners |

The symbol sits on the site's own paper ground (`#fbfaf6`) rather than on transparency: the wordmark
ink is near-navy, and a transparent icon would disappear into dark browser chrome.

**Verified by looking, at 16, 32, 48 and 64px:** the Y ribbon reads as a distinct mark at every size,
including 16. The full lockup remains the mark for the site itself and for share cards.

The purple consumer-product heart (`#6C4CFF`, formerly `app/icon.svg`) is gone from the corporate
browser identity, and a guard asserts no stale icon convention file returns.

---

## Mirai Move — `PROJECT_CANONICAL_BRAND`

**The venture already had a logo, and the corporate site was not using it.**

The Founder's original is `Miraimove logo.png` — PNG, 1254×1254, **no alpha**, ~95% flat `#F8F8F8`
padding, `sha256 c7d62d96…`. Three byte-identical copies exist on the Founder's machine. No vector
original was found anywhere searched (the Founder directories, both project trees, and both Founder
decks, whose archives contain no media at all). Stated as *not found*, not as *does not exist*: the
search keyed on the name.

**The corporate site derives nothing.** Mirai Move's own repository already carries a committed,
documented brand kit built from that exact source — cropped to the artwork bounds, background keyed
to transparency with un-premultiplied edges so it does not halo on dark, resized with Lanczos, and
nothing redrawn or recoloured. Its own `public/brand/README.md` records the same source hash. Taking
that asset rather than re-deriving one keeps a single canonical Mirai Move identity across both sites.

| File | Size | sha256 |
|---|---|---|
| `public/brand/ventures/mirai-move-mark.png` | 542×245, transparent | `108e085b…` |
| `public/brand/ventures/mirai-move-lockup.png` | 799×407, transparent | `6457927c…` |

The 1254×1254 source is deliberately **not** shipped: with no alpha it would render as a white box on
any non-white surface.

### A stale value corrected

`brand.ts` recorded Mirai Move's accent as `#0e9f9a` "mobility teal", sourced to "Mirai Move's own
repository". That citation was wrong, though not in the way it first looked:
`--color-mobility-teal: #0e9f9a` is still declared in that repo and is **never overridden** — it is
dead, referenced by nothing on `origin/main`. What *is* overridden is `--accent`, which a later
`:root` block resets to copper. The corrected record is **`#8e5330`**, and it is supporting data
only: the mark now carries the identity, and the site paints no venture accent.

---

## Kakari — `FOUNDER_APPROVED_CORPORATE_COMARK`

Kakari has no standalone logo. **The Founder decided the corporate site presents it as 「係 / Kakari」.**

係 is the identity character: 亻 (a person) carrying 系 (a thread) — responsibility and handoff, in
the character's own anatomy. It is set above a **terminal rule**, which is Kakari's own signature:
its system diagram is an ordered descent down a rail that stops at a full-width rule, the point where
a procedure hands off to a qualified human.

### Why the character is set and not drawn

A first version constructed 係 from monoline paths on a grid. Rendered beside the real character it
was malformed — the 亻 read as a lollipop and the 幺 coils as a zigzag — and a malformed kanji is
worse for a Japanese-market brand than no mark at all. **It was discarded.**

The character is therefore *set*, in the corporate site's own Japanese stack, at a weight and optical
size chosen for this slot; the design work is the composition, not a traced glyph. No font is bundled
or redistributed — it is the same platform stack the whole corporate surface already uses.

Four compositions were built and compared at 16, 20, 24, 40 and 110px on both grounds: the character
alone, in a hairline square field, beside a procedure rail with a node, and above a terminal rule.
The field crowded the glyph and cost legibility; the rail read as a stray tick at small sizes. The
terminal rule keeps the glyph full-size at every size and gives it structure. **Selected.**

`public/brand/ventures/kakari-mark.svg` · rendered inline by `app/_corporate/p5r2/VentureMark.tsx` so
it inherits `currentColor` and the Japanese stack.

### Scope — this is the boundary, and it is enforced

- The **Kakari application** keeps the ASCII `Kakari` wordmark. Nothing about it changed.
- カカリ, 卡卡里 and every other reading remain **banned everywhere**. The claim guard's
  `brand-transliteration` rule is **byte-identical** to v1.3 — it never matched bare 係, so the
  co-mark needed no exception and none was granted. Adding one would have weakened the ban for no gain.
- A guard asserts 係 appears in the corporate brand component and **never beside the wordmark in
  translated copy**, where it would become a locale-specific rendering of the name.
- One contradiction was removed: `localeCompleteness.test.ts`'s allow-list contained `かかり`, which
  the claim guard bans outright. It was unreachable, so removing it changes no outcome — it closes a
  loophole that would have opened the moment someone added the string it said was fine.

---

## Chigamo — `FOUNDER_APPROVED_NEW_VENTURE_MARK`

v1.3 drew Chigamo as an empty square and recorded the absence as the honest signal. **The Founder has
authorised a mark, so the absence is no longer the truth about its identity.**

### The three concepts, and why two were rejected

All three were built as SVGs and judged by rendering them at 18–24px on both grounds.

| | Concept | Verdict |
|---|---|---|
| **A** | Convergent context — three arcs closing on a point, from the existing `ContextField` | **Rejected.** At 24px a fuzzy swirl, and it reads as a **wifi indicator** — adjacent to the forbidden radar. |
| **B** | Three aligning — brackets arriving from three directions onto one solid point | **Selected.** Crisp and deliberate at 18px; orthogonal, which is the corporate system's own geometry. |
| **C** | Local threshold — a ground line, a dashed reach arc, a standing node | **Rejected.** Collapses to a smudge at 24px and reads as a **speedometer**. |

B was then refined through four arrangements. A four-corner variant was rejected as a **camera focus
box** — legible, but a generic UI idiom rather than an identity. The selected form is two shoulders
and a stem closing on a solid centre.

**The idea comes from the venture's own words:** information about a place only becomes yours when
three things line up — 「位置と、時間と、その人が置かれている状況。この三つが揃ってはじめて『自分に関係が
ある』と分かる情報があります。」

**Deliberately not:** map pin, compass, globe, radar sweep, sparkle, chat bubble.

**Family relationship, not a copy:** the two shoulders and a stem echo the YORISOU Y, but YORISOU's Y
is a soft ribbon closing into a lemniscate and this is hard brackets on a grid.

`public/brand/ventures/chigamo-mark.svg` · monochrome `currentColor`.

### A logo is not a product

Chigamo remains **concept stage**. It stays at Foundry stage 1, stays counted apart from the two
ventures in build, and **still has no brand colour** — the mark is monochrome, because a colour would
be an identity nobody has approved. Claim ledger C-12 is unaffected. A guard pins all four of these.

---

## Where the marks are used

The three marks occupy the **same slot** on every surface — home rail, home venture section, the
Ventures index, venture detail heroes, How We Build, and the footer.

Sized by **height**, never by a fixed box: the Mirai Move logo is 2.2:1 and the two glyph marks are
square, so a common width would squash one of them. Nothing is distorted; the raster keeps its
intrinsic ratio and the SVGs keep their square viewBox. 26px hero · 20px card · 15px compact.

`tests/corporate-qa/brandpaint.mjs` measures the rendered result: **84 marks across 18 pages**, each
resolving to the right asset, each drawn mark monochrome, and zero pre-logo colours painted anywhere.

One trap that check had to avoid: the venture name must be read from the wordmark element, not from
the row's `textContent`. Kakari's co-mark puts a 係 inside the row, so `textContent` is `"係Kakari"` —
a lookup keyed on that would have missed every venture and reported clean while verifying nothing.
