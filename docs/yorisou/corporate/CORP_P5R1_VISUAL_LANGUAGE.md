# CORP-P5R1 — YORISOU visual language

**Working direction: QUIET INTELLIGENCE / LIVING SYSTEMS.** 80% restraint, 20% unmistakable
intelligence. Derived from the measured benchmark evidence in `CORP_P5R1_BENCHMARK_TEARDOWN.md`.

**The one-sentence system:** *a warm human field on one side, a dark system surface on the other, and
a seam between them where YORISOU does its work.* Everything below serves that sentence.

---

## A. Depth system

Five layers, each with a job. Nothing exists for decoration.

| Layer | Name | What it is | Why it exists |
|---|---|---|---|
| **0** | Environmental field | Very low-contrast lattice of hairlines and sparse points on the light ground | Establishes that there is a structured space, before any content. Never animates on its own |
| **1** | System topology | The dark computational surface: nodes, relations, routing, boundaries — SVG | Shows the system operating. The only layer that expresses relationship |
| **2** | Object surfaces | Opaque panels for projects, principles, states | Objects are things you can reason about; they must have edges |
| **3** | Editorial content | Japanese copy, thesis, headings, body | The protagonist. Always fully readable and selectable |
| **4** | Interaction / focus | Focus rings, hover emphasis, active relation highlight | The only layer that reacts to a person |

**Hard rules.** Layers 0 and 1 are `pointer-events: none` and `aria-hidden`. Layer 3 is never
occluded, never lower-contrast than AA, and never inside a canvas. Layer 4 must always be visible
against both the light field and the dark surface.

---

## B. Grid system

- **Measure:** editorial content max `1180px`; body measure capped at ~38em so Japanese stays readable.
- **Desktop (≥1024):** the seam sits at the optical centre. 人 material resolves left, 仕組み material
  right. The thesis is the one element permitted to cross.
- **Tablet (768–1023):** seam holds centre; the two sides stack but keep their left/right alignment
  cues so the metaphor survives.
- **Mobile (<768):** the seam becomes a **left rail**. This is the collapse that was already proven
  at 390 in the aida prototype. Topology simplifies — fewer nodes, larger targets — but is never
  removed, because that would make mobile a text page.
- **Safe gutters:** `clamp(20px, 5vw, 40px)`; decorative rail may sit outside the text gutter, content never.
- **Seam:** retained conceptually and re-executed. It is no longer a single 1px line; it is the
  boundary between the light field and the dark surface, and it carries the state dots.

---

## C. Light system

Light means **state**, never mood.

| Signal | Meaning | Expression |
|---|---|---|
| Jade `#2f6b5e` / on-dark `#6fb3a0` | Active relation | A relation or node currently carrying meaning |
| Jade filled dot | Resolved / settled state | A step that has completed |
| Jade rule, full width | **Boundary** | Where the system stops and a person takes over |
| Amber-neutral `#b08a4a` | Hand-off in progress | Used once, at the Kakari professional boundary |
| Unlit hairline | Latent structure | Exists, not currently active |

No glow, no bloom, no gradient used to mean "AI". Accent area is capped: no filled jade region
larger than a rule, a dot or a focus ring.

---

## D. Surface system

| Surface | Represents | Treatment |
|---|---|---|
| Light paper `#fbfaf6` | Human context, editorial | Default ground |
| Dark graphite `#0f1211` | System / computation | Inset object with a hard edge, never full-bleed on mobile |
| Hairline-bounded region | An object you can reason about | 1px rule, no shadow, no radius |
| Jade-ruled band | A boundary or handoff | Rule + label, always with text |

No glassmorphism. No shadows. No rounded cards. A surface is either paper or system; there is no
third material.

---

## E. Motion grammar — four primitives only

Every animation must be classifiable as exactly one. If it cannot be, it is deleted.

| Primitive | Meaning | Implementation |
|---|---|---|
| **SIGNAL** | Something becomes visible or relevant | Opacity + 4–8px rise, 420ms, on first intersection only. Never repeats |
| **CONNECT** | A meaningful relationship forms | An SVG relation draws from origin to target via `stroke-dashoffset`, 700ms, staggered by relation index |
| **RESOLVE** | Complexity becomes structured | Scattered points settle to their structured positions, 900ms, once |
| **HAND-OFF** | Responsibility transfers | A travelling dot crosses the boundary rule and stops at it, 1100ms, once |

**Constraints.** All are finite — no `infinite`, ever. All are scroll-*triggered*, never
scroll-*driven*: normal browser scroll is untouched, there is no scroll-jacking and no pointer trap.
Under `prefers-reduced-motion: reduce` every primitive resolves immediately to its **completed
state** — relations drawn, points settled, hand-off dot parked at the boundary. The field becomes a
meaningful static composition, never an empty one.

---

## F. AI visual grammar

AI is never drawn. It is **inferred from system behaviour**.

| Forbidden | Used instead |
|---|---|
| Brain, sparkle, robot, chat bubble, orb | **Context** — points cluster by the domain they belong to |
| Neural-network wallpaper | **Relationship** — relations exist only between entities that genuinely relate |
| Fake terminal / fake AI output | **Routing** — a signal enters, is classified, and leaves toward a destination |
| Live-looking dashboards | **State change** — latent → active → resolved, expressed by light |
| Capability claims | **Boundary** — the system visibly stops where a professional takes over |

**Truth constraint:** every entity in the field is one of the already-approved labels
(行政・自治体 / 企業 / 地域の現場 / パートナー, and Kakari's four procedure steps plus its
professional boundary). Nothing in the field is a metric, a count, a user, or a live reading.

---

## G. Humanity layer

Technology is not the protagonist.

- Japanese copy is the largest and highest-contrast thing on the page.
- Phrase-unit line breaking is treated as **brand**, not as a bug fix — it is the one typographic
  move none of the six benchmarks can make.
- Body leading stays ≥1.9; measure stays ≤38em.
- Pacing breathes: the page gets **calmer** toward the bottom, not busier.
- Boundaries and human responsibility are drawn as first-class objects, not disclaimers.
- The system field is quiet enough that a reader can ignore it entirely and still read the company.

---

## H. Narrative state machine

The field persists across the page and changes state; sections are not independent stacked bands.

| Section | Field state | Primitive |
|---|---|---|
| Thesis | Sparse points, latent relations | SIGNAL |
| Problem | Points fragment; distance becomes visible | CONNECT |
| Portfolio | Two distinct grammars organise the same field | RESOLVE (Mirai) / HAND-OFF (Kakari) |
| Approach | Constraints bound the field | RESOLVE |
| Company | Field settles, contrast drops, motion stops | RESOLVE (terminal) |

---

## I. What is deliberately NOT changed

Copy, thesis, narrative order, information architecture, portfolio composition, both product
positionings, company philosophy, claim discipline — all **locked** and carried verbatim from the
approved CORP-P5 content source. The five non-home corporate routes keep the CORP-P5 baseline
exactly.
