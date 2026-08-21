# UX-1 — AI-Native Visual Direction Record

> **Living Understanding Field / 生きている理解の場**
> Founder decision `YORISOU_UX1_AI_NATIVE_VISUAL_DIRECTION_RECOVERY_AUTHORIZED`.
> This record defines only what the four prototype surfaces need. It is **not** a general design system.

## 1. Design thesis

YORISOU is not a test site that also stores results. It is **a place where a person's current
understanding is put down, kept, and moved** — by them.

The whole direction rests on one claim that must be *visible*, not written:

> **The reading is placed in a field, and when the person says "that's a bit off", the field
> visibly re-settles around what they said.**

Everything else follows. If that single interaction is removed, the direction is just another
pretty test site — which is exactly what the audit found today.

## 2. Why this replaces what exists

The audit (`UX1_VISUAL_TRUTH_AUDIT.md`) found three structural failures: a generic SaaS hero with a
semantically-empty AI orb (V1–V3), two unrelated visual systems in one product (C1–C2), and a result
surface that leads with a personality poster and offers **no correction at all** (R1–R3). The
direction answers each: the first screen *shows the artifact*, one register system governs every
surface, and correction is the centre of the result — not an afterthought.

## 3. User emotional objective

Calm, unhurried, and **not judged**. The person should feel: *this is a description of my current
period that I can move, not a verdict about who I am.*

## 4. Public vs private visual language (the privacy signal)

Two registers, applied consistently. **The register change is the privacy signal** — it is never
decorative.

| | **Open** register | **Private** register |
|---|---|---|
| Used for | Home, intent entry | The reading, わたしの今 |
| Ground | Warm Ivory `--yorisou-color-surface-bg` | Ink Plum `--yorisou-color-deep-950` |
| Meaning | "anyone may look at this" | "this belongs to you alone" |
| Text | Neutral-800 on ivory | White ≥ 0.82α on ink |

A person can tell whether they are in their own layer *without reading a label*.

## 5. Composition

**Mobile (390×844, primary target).** One column. The field renders first at a size that fits with
its caption; the reading follows. Controls ≥ 44px. No hover-only meaning. No horizontal scroll.

**Tablet (768×1024).** Single column at a comfortable measure — deliberately not a stretched phone
layout; the field is allowed to grow and the reading panels get a wider measure.

**Desktop (1440×900).** A genuine two-column workspace: the **field on the left stays put**
(`lg:sticky`) while the reading, its qualifications and its controls scroll on the right. This is
the thing a desktop can do that a phone cannot — you watch the field move *while* you correct the
reading. Max width 1240px, never a centred 600px mobile column.

## 6. Typography, spacing, colour

- **Type:** Noto Sans JP (already loaded). Display 26–34px, tight tracking (−0.01em), leading 1.3–1.35.
  Body 13–15px at leading 1.8–1.9 for comfortable Japanese. **No serif** — the legacy serif belongs to
  the editorial idiom being replaced.
- **Spacing:** the existing `--yorisou-space-*` scale; generous vertical rhythm, section gaps 32–48px.
- **Colour responsibilities:** Iris Violet `--primary-*` = structure and the field itself.
  Mint `--accent-*` = **the current reading and confirmation only** (so the eye always knows where
  "now" is). Ink Plum = the private layer. Neutrals = text and edges. No colour is decorative.
- **Depth:** one low-intensity violet-grey shadow (`--yorisou-shadow-card`) plus the field's own
  radial gradient. No glassmorphism, no glow blobs.

## 7. The field (the one visual)

`app/prototype/ux1/_lib/UnderstandingField.tsx`, pure SVG + CSS.

| Element | Meaning |
|---|---|
| Centre ring | **The person.** Not a result, not a type. |
| Perimeter arcs | **Method lenses.** Length/weight = how much that lens currently informs the field; dimmed = not available. |
| Bright mint mark | **The current reading's position.** |
| Dashed trail | **History** — where the reading has been. |
| Field gradient | The extent of what is currently understood. |

Deliberately **not** a star map centred on a type (audit R2): the centre is the person, and the
result is a *position that can move*.

## 8. Motion vocabulary

Motion is allowed only where it carries meaning. In this prototype exactly one animation exists:

**Correction → re-settle.** The mark transitions to its new position over `--yorisou-motion-result`
(600ms) on the shared ease. Nothing loops, nothing floats, nothing pulses.

Reduced motion: the transition is dropped entirely and the mark jumps — the meaning survives, the
movement doesn't. Implemented by subscribing to `prefers-reduced-motion`, not by a CSS-only guess.

## 9. AI presence model

The AI is **the thing that places the reading, and that yields to correction**. It is not a
character, not a chat box, not a "thinking" animation.

- No simulated processing (the audit's V5 anti-pattern is deleted, not restyled).
- No sentience language, no proactive messaging, no notifications.
- Every statement carries its **source** (`回答から` / `記録から` / `あなたの訂正から` / `プロトタイプ表現`).
- Confidence is a **band in words**, never a percentage or score.
- The person's correction **outranks** the system's reading, and the UI says so.

## 10. Representations

| Concept | How it is shown |
|---|---|
| Method source | Named lens chip on the reading + a distinct arc on the field |
| Current state | Position of the mark; the name is a **period** (「〜時期」), never a type |
| Correction | Alternatives → mark moves → source becomes `あなたの訂正から` → suggestions change |
| History | Dashed trail + a dated list ending in "いま" |
| Recommendation reason | Every suggestion states **why**, tied to the current position; max 2; explicitly optional |
| Privacy / visibility | Register change + "まだどこにも残っていません" + a save toggle that can be undone |
| Memory | One checkbox in わたしの今; unchecking states plainly that nothing is kept |
| Companion | One opt-in line, labelled `PROTOTYPE_VISUAL_DIRECTION_ONLY`, explicitly not running |

## 11. Empty / loading / error

Nothing on these surfaces fetches, so there are no spinners to fake. The genuine "empty" state is
**"どれも違う"**: the reading is withdrawn, the field keeps no mark, and the copy says so without
penalty or nudging. That is the honest empty state for this product.

## 12. Prohibited in this direction

Purple/blue AI gradient heroes · glowing orbs as "AI" · particles · glassmorphism · uniform card
grids · oversized empty marketing headings · a centred mobile column on desktop · fake neural
graphics · robots · mascots · constellations of a "type" · wellness illustrations · dense admin
dashboards · decorative Japanese motifs · stock therapy photography · any simulated AI processing.

## 13. Scope boundary

**Prototype-only:** the synthetic reading/trajectory/suggestions, the Companion line, the correction
alternatives, and the `/prototype/ux1/*` routes themselves.

**Can become production system later:** the two registers, the field component, the source-chip +
certainty-band + "what this does not mean" grammar (already governed in `revealContent.ts`), the
period-not-type naming (already true in YV), intent-first entry, and the reasoned-suggestion pattern.

**Explicitly not built here:** a general design system, a dark-mode theme, a semantic token bridge, a
shared Button/Card library. Those are UX-2 work and are deliberately out of scope (§10 of the brief).
