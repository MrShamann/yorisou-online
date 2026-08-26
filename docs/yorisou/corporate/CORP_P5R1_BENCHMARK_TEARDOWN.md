# CORP-P5R1 — International benchmark teardown

**Method:** each site was rendered in headless Chromium at 1440×1000 (and 390×844 where reachable),
screenshotted, and interrogated for computed design facts — background colour, hero type scale and
weight, canvas/SVG/video counts, gradient and blur counts, running animations, absolutely-positioned
and z-indexed element counts, and dominant large-surface colours. **Screenshots were then opened and
looked at.** Nothing here is from memory.

Raw data: `test-results/corp-p5r1/benchmarks/raw.json` · screenshots: same directory ·
contact sheet: `benchmarks/contact-sheet.png`.

**Accessibility of sources:** all six were reachable. Linear and Scale initially timed out at 35s on
`domcontentloaded`; both were re-fetched successfully with a 60s `commit` wait. No observation below
is inferred for an unreachable site.

## Measured facts

| Company | Page bg | Hero size/weight | canvas | svg | video | gradients | blurred | running anims | z-indexed | Dominant large surfaces |
|---|---|---|---|---|---|---|---|---|---|---|
| Palantir | `#ffffff` | 80px / 400 | 0 | 14 | **6** | 0 | **109** | **39** | **151** | `#f3f3f3`, `rgba(0,0,0,.5)` |
| Vercel | `#fafafa` | 64px / 400 | 1 | 45 | 0 | 7 | 6 | 0 | 32 | `#fafafa`, `#ffffff`, `#171717` |
| Linear | **`#08090a`** | 64px / 510 | 0 | **180** | 0 | 32 | 13 | **103** | 9 | `#0f1011`, `#08090a`, accent `#5e6ad2` |
| Scale AI | `#ffffff` | **116px** / 400 | 1 | 35 | 0 | 3 | 0 | 0 | 69 | `#ffffff`, `#f2f2f2`, `#000000` |
| Anthropic | `#faf9f5` | 60.9px / **700** | 0 | 44 | 0 | **0** | **0** | **0** | 123 | `#141413`, `#e3dacc`, `#f0eee6` |
| OpenAI | `#ffffff` | no `h1` | 0 | 37 | 0 | 0 | 4 | 0 | 20 | `rgba(0,0,0,.12)`, `#ffffff` |

Typefaces observed: Palantir *Alliance No.1/No.2*; Vercel *Geist Sans / Geist Mono*; Linear
*Inter Variable / Berkeley Mono*; Scale *aeonik*; Anthropic *Anthropic Serif / Anthropic Sans*;
OpenAI *OpenAI Sans*. **Every one uses a proprietary or deliberately-chosen typeface.**

## The finding that reframes the brief

**Five of six are LIGHT-background sites. Only Linear is dark.** "AI-native means dark" is not
supported by the evidence.

More precisely, and visible only by looking at the screenshots rather than the numbers: the dominant
pattern is **a light editorial field with a DARK COMPUTATIONAL SURFACE inset into it as a distinct
object**.

- **Palantir** — white chrome; the hero is a dark, extremely dense product panel (an ontology UI on a
  laptop) with the headline set in white *over* it. 109 blurred elements and 151 z-indexed elements:
  a deep, layered stack.
- **Scale AI** — white chrome; a full-bleed near-black hero panel with centred white type.
- **Anthropic** — warm paper `#faf9f5`; a near-black inset panel sits directly below the editorial
  hero. Zero gradients, zero blur, **zero animations**: authority carried entirely by typography.
- **Vercel** — near-white; dark `#171717` surfaces used as discrete objects, plus one small canvas
  dot-matrix glyph.
- **Linear** — the exception. Fully dark, and it earns it by showing a real product surface.
- **OpenAI** — white, with a centred input affordance and dark imagery panels below.

The dark surface **is the system**. The light field **is the human/editorial layer**. That is exactly
YORISOU's 人 / 仕組み thesis, arrived at independently by six companies solving the same problem.

## Per-company teardown

| Dimension | Palantir | Vercel | Linear | Scale AI | Anthropic | OpenAI |
|---|---|---|---|---|---|---|
| Hero hierarchy | Type over dark product panel | Left type + small glyph + CTA | Type over layered product UI | Centred type on dark panel | Left editorial type, underlined | Centred input affordance |
| Typography | 80px light weight, custom | 64px light, Geist + mono | 64px @510, Inter + Berkeley Mono | 116px light, aeonik | 61px **bold**, serif + sans | Custom sans |
| Z-axis | **Deep** (151 z, 109 blur) | Moderate (32 z) | Deep, panel layering | Moderate (69 z) | Flat but layered panels (123 z) | Shallow |
| Background system | White + dark media | Near-white + dark objects | Dark field | White + dark panel | Warm paper + dark panel | White |
| Colour/light | Achromatic + UI colour inside the panel | Achromatic + 7 gradients | Dark + indigo `#5e6ad2` | Pure achromatic | Warm neutrals + near-black | Achromatic |
| Motion | **39 running** | 0 at load | **103 running** | 0 at load | **0** | 0 at load |
| System visualisation | Real product UI (video) | Dot-matrix glyph, SVG | Real product UI, 180 SVG | Diagrammatic SVG | SVG, no system diagram | SVG |
| AI representation | Dense decision UI | "Agentic Infrastructure" + lifecycle | "teams and agents" in product | "Reliable AI…decisions" | Editorial claim | Input box |
| Human/AI boundary | Operator at the console | Agent lifecycle steps | Agents inside a workspace | Evaluation/monitoring stages | Safety framing in copy | Prompt + response |
| Section transition | Scroll-linked panels | Discrete bands | Continuous dark field | Discrete bands | Discrete bands | Discrete bands |
| Portfolio treatment | Platform-differentiated | Product rows | One product, many surfaces | Solution categories | Model vs research split | Product tiles |
| Evidence/trust | Product density itself | **Customer logo wall** | Product screenshots | Named customers | Institutional framing | Scale of brand |
| Mobile | Panel simplifies, type shrinks | Stacks | Stacks, keeps dark field | Stacks | Stacks | Stacks |
| YORISOU should learn | Layered depth; dark system surface | Lifecycle as grammar; restraint | SVG as the system medium; motion tied to state | Achromatic confidence; huge type | Typographic authority; motion is optional | Human-scale calm |
| YORISOU must reject | Defense mood; 6 videos | **Logo wall**; dev-tool identity | Full dark; SaaS dashboard | Unprovable scale claims | Becoming a research paper | Chat-box-as-product |

## Ten transferable principles

Each states the mechanism, the fit, how we make it ours, and the risk.

**1. Light editorial field, dark computational surface.**
*Mechanism:* the system is a distinct dark object inside a light page. *Fit:* it IS 人 / 仕組み.
*Ours:* the dark surface is the seam's system side, carrying the topology; the light side stays
Japanese editorial paper `#fbfaf6`. *Risk:* two-tone can read as "template with a dark section" —
avoided by making the boundary between them semantic, not a band.

**2. SVG is the system medium, not canvas.**
*Mechanism:* Linear 180 SVGs, Vercel 45, Anthropic 44; only two sites use a canvas at all, both
trivially. *Fit:* SVG is accessible, inspectable, cheap, and degrades under reduced-motion.
*Ours:* the entire system field is SVG + CSS transforms. *Risk:* DOM bloat — capped node counts.

**3. Motion is optional, and its absence is not a weakness.**
*Mechanism:* Anthropic runs **zero** animations and reads as the most authoritative of the six.
*Fit:* YORISOU's claim discipline is restraint. *Ours:* four semantic primitives only; nothing
animates that does not mean something. *Risk:* motion-as-decoration; excluded by the grammar.

**4. Hero type is the largest object on the page.**
*Mechanism:* 61–116px heroes everywhere. *Fit:* the thesis is the company. *Ours:* Japanese phrase
units at a large scale, never fragmenting. *Risk:* CJK at display size breaks badly — already solved.

**5. Depth via layered opaque panels, not glass.**
*Mechanism:* Palantir/Linear stack real surfaces; blur is used for chrome, not for content.
*Fit:* honest layering. *Ours:* three opaque layers, no glassmorphism. *Risk:* a sea of glass cards.

**6. A single chromatic accent against an achromatic field.**
*Mechanism:* Linear indigo; Scale and Anthropic essentially achromatic. *Fit:* jade is already the
YORISOU signal. *Ours:* jade means state — active relation, boundary, handoff — never decoration.
*Risk:* accent inflation.

**7. Lifecycle as visual grammar.**
*Mechanism:* Vercel's prompt→reason→plan→act; Scale's operate→evaluate→monitor. *Fit:* Kakari is
already a bounded procedure. *Ours:* Kakari renders as a resolving procedure ending at a
first-class human boundary. *Risk:* implying automation we do not have.

**8. Topology as proof of seriousness.**
*Mechanism:* Palantir's density signals a real system. *Fit:* Mirai Move is genuinely a network.
*Ours:* an abstract relationship field built only from the four approved party labels. *Risk:*
fake data — nothing in the field is a metric, a count or a live reading.

**9. Proprietary type as identity.**
*Mechanism:* all six use a distinctive typeface. *Fit:* we cannot license one. *Ours:* the
identity comes from **Japanese phrase-unit composition** — a typographic move none of these six can
make. *Risk:* looking generic; mitigated by treating JP line breaking as brand.

**10. Trust without a logo wall.**
*Mechanism:* Vercel and Scale lean on customer names; we have none. *Fit:* our trust device is
stated maturity and visible boundaries. *Ours:* stage chips and the 士業 boundary as first-class
objects. *Risk:* none — this is the only honest option available.

## Explicitly rejected

Logo walls · customer names · metric counters · product screenshots or device mocks (both products
are pre-GA) · defense/militaristic mood · full-dark site · rainbow or purple "AI" gradients ·
robot/brain/sparkle iconography · chat-box-as-hero · terminal theatrics · scroll-jacking ·
generated illustration · stock imagery.
