# CORP-P2 — Creative Direction Brief

**Package:** CORP-P2 · **Date:** 2026-08-24 · **Direction:** Quiet infrastructure / living signal ·
**Surface:** six Preview-only routes under `/prototype/corporate`.

## 1. The problem this design has to solve

A corporate portfolio site for a company whose products are **both unfinished** and whose legal
identity is **not yet verifiable**. Most corporate templates are built to project scale — logos,
metrics, testimonials, a confident hero. Yorisou has none of those and must not fake them.

So the design decision underneath everything: **make honesty legible rather than apologetic.** A
site that says "in development" in a designed, deliberate way reads as disciplined. The same site
with a hedging tone reads as unfinished. The difference is entirely craft.

## 2. Direction: Quiet infrastructure / living signal

**Quiet infrastructure** — the page behaves like a well-drawn schematic: hairlines, a fixed rhythm,
one accent used as signal, and space that is structural rather than decorative. Nothing pulses for
attention.

**Living signal** — one small piece of the composition is alive: the terminal node on each route
diagram settles in once. It says the system is running, without a dashboard or an animation loop.

## 3. Five-second hierarchy

Every route resolves in this order, and the type scale enforces it:

1. **What kind of company** — the thesis, at the largest size on the page.
2. **In what fields** — the two hero chips name モビリティ and 行政手続き before any scroll, and link
   straight to each business.
3. **What state each business is in** — the stage label sits directly under the product name,
   before the description, so a reader cannot absorb the pitch without the caveat.

The homepage's first viewport therefore lands all three CORP-P2 requirements — product company,
complexity between people and systems, two concrete distinct businesses — without a metric or a
capability claim.

## 4. Making the two products distinct

The mandate forbids interchangeable cards. Four separate devices keep them apart:

| Device | Mirai Move | Kakari |
|---|---|---|
| Ground | `--c-ground` (cool white) | `--c-ground-alt` (mineral) — alternating bands |
| Field line | 日本のモビリティ領域 ／ miraimove.com | 行政手続き・書類 ／ 多言語 |
| Stage | 公開サイト稼働中／プラットフォーム機能は開発中 | 開発中（一般公開前） |
| Route diagram | actors it connects — 行政・自治体 → 企業 → 地域の現場 → パートナー | steps it supports — 調べる → 書類をそろえる → 作成する → 提出する |

The diagrams are the sharpest separator: one maps a **network of parties**, the other a **sequence of
steps**. They cannot be read as the same product.

Each also has its own full route, its own H1, and a cross-link to the other — never a side-by-side
grid.

## 5. The boundary block

Kakari's professional boundary and Mirai Move's development status are governance requirements, not
disclaimers. They are rendered in a bordered block with the accent rule and a bold heading — the same
visual weight as the description above them. Putting them in small grey text at the bottom would
technically satisfy the rule and defeat its purpose.

## 6. Designed pending states

`/company` and `/contact` are blocked. They are not empty pages and not apologies. Each renders:

- the blocker identifier in monospace (`COMPANY_REGISTRATION_SOURCE_REQUIRED`,
  `VERIFIED_CORPORATE_CONTACT_REQUIRED`) — legible to a reader, actionable for the Founder;
- a headline stating the position;
- the reason, in plain language;
- for `/company`, the list of field names awaiting verification.

`/contact` deliberately has **no form**. A form with no verified destination collects messages that
go nowhere, which is worse than an honest absence.

## 7. Palette and type

| Token | Value | Role |
|---|---|---|
| `--c-ground` | `#fbfaf6` | Cool white base |
| `--c-ground-alt` | `#f4f2ec` | Alternating band |
| `--c-ink` | `#0c0e0d` | Near-black, headings and body |
| `--c-ink-soft` | `#3a403c` | Secondary body — 10.16:1 |
| `--c-muted` | `#5a605c` | Tertiary — 6.16:1 |
| `--c-mineral` | `#686e69` | Lightest text — 5.00:1 / 4.66:1 |
| `--c-accent` | `#2f6b5e` | Existing jade/teal. **Signal only** — rules, nodes, focus, links. Never a fill |

`--c-mineral` was `#8b918c` in Phase 1 and measured 3.08:1 — a real AA failure on 14 nodes. It was
darkened, not exempted.

Japanese-first typography: Noto Sans JP with Hiragino/Yu Gothic fallbacks, body leading **2.00**
(requirement ≥ 1.8), measure capped at 34–36em, `letter-spacing: 0.02em`.

## 8. Motion

One 320ms entry reveal and one 900ms node settle, both inside
`@media (prefers-reduced-motion: no-preference)` so `reduce` removes them entirely — verified as **0
animated elements across all six routes**. Phase 1's infinite pulse was replaced: perpetual motion is
a WCAG 2.2.2 problem and made audits non-deterministic.

## 9. Navigation

Phase 1 hid the nav below 768px, which was survivable with one route and unacceptable with six. The
nav now **wraps** rather than disappearing, every route is reachable at 320px, and the header is
static on mobile so it never eats a short viewport, becoming sticky at ≥768px. A skip link precedes
it. Links are plain anchors — fully keyboard-operable with no JavaScript.

## 10. Explicitly rejected

Generic SaaS card grids · glassmorphism · decorative gradients · AI/neural imagery · stock office
photography · fake dashboards · AI-purple · abstract orbs · counters or metrics · testimonials ·
three identical feature cards · any single treatment that would merge the two products.
