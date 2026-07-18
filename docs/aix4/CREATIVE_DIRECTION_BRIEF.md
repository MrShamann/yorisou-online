# AIX-4 — Creative Direction Brief (Product-First Experience Unification)

Produced with the `premium-ui-ux-creative-director` + `ai-native-product-architect`
+ `design-taste-frontend` skills. This is the binding design decision for AIX-4;
implementation follows it.

## Design read

Reading this as: **a state-to-life reflective platform for Japanese consumers**,
with an **AI-native "Living Intelligence" language**, leaning toward **one dark
product system with intentional light editorial pages**, unified by semantic
tokens and the nestle BrandLockup. The check is one recommended first step, not
the brand.

## The one system — three intentional modes

All three modes share the BrandLockup, type scale, radius scale, jade accent,
motion language, and a single **semantic token layer** (`--yr-*`). The difference
between modes is intentional and recognizably one brand.

1. **Product-Immersive (dark).** Homepage, `/tests` catalogue, `/result`,
   `/recommendations`, `/reports`, `/saved`, `/private-state`, `/experiences`,
   `/co-design`, `/partners`. Full dark "Living Intelligence" with WebGL depth on
   hero surfaces (existing `.aix2`).

2. **Product-Focus (dark, quieter).** Test detail, question flow, result-in-flow,
   focused actions. Same dark ground as immersive, **without** the heavy WebGL
   depth — a calm, focused dark surface so it is unmistakably the same product as
   the catalogue, just quieter for concentration. **This replaces the AIX-3D light
   Understand surface** (Founder Finding A).

3. **Editorial-Light.** `/about`, `/methodology`, `/contact`, `/privacy`,
   `/terms`, `/legal`, `/support`, `/company`, and the consolidated English info
   pages. Calm branded light (existing `.aix3-editorial`).

**LINE context** (`/line/mini-app`) stays a light continuity surface — but now via
the same semantic tokens (`.yr-line` mode), so the shared components render there
correctly too.

## Semantic token layer (`--yr-*`)

Mode classes set the tokens; shared components consume only tokens, so one code
path renders correctly in every mode (Founder Finding A / §6):

`--yr-surface · --yr-surface-2 · --yr-panel · --yr-panel-2 · --yr-text ·
--yr-text-mut · --yr-text-faint · --yr-hair · --yr-hair-2 · --yr-accent ·
--yr-accent-text · --yr-accent-ink · --yr-on-panel`

Set by `.yr-focus` (dark), `.yr-editorial` / `.yr-line` (light). Behaviour, data,
tracking, recommendation logic and privacy in the shared components are unchanged;
only presentation moves to tokens.

## Homepage (Founder Finding C)

Lead with the platform, not the test. Headline conveys *今の状態から、次の選択まで* +
the six-domain loop (理解する・残す・戻る・見つける・深める・つながる・育てる); state-based
primary CTA; explore-the-system secondary CTA; free/no-login as a subtle note (not
"120問" at hero level). The six-domain **system map** is part of the first-page
composition (spatial connected field), not buried below the fold.

## Share system (Founder Finding B)

A real generated **image** share-card system (square 1080², story 1080×1920, OG
1200×630) from a public-safe share model, one shared architecture across all
retained result types, with `navigator.share({files})` + graceful fallbacks and
dynamic OG metadata. Replaces the screenshot-only page.

## Gates

WCAG 2.2 AA on every mode + generated cards; `prefers-reduced-motion` path;
Three.js stays lazy; share-image generation server-side/deterministic; graceful
fallbacks for no-JS / no-WebGL / native-share-unavailable.
