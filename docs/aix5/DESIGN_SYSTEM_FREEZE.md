# AIX-5 — Design System Freeze

One YORISOU design system, three product modes + LINE context, all sharing the
BrandLockup, type family, spacing rhythm, shape language, CTA hierarchy and the
semantic `--yr-*` color system. This freezes the AIX-4 foundation and adds the
AIX-5 value-proposition and share-content rules.

## Product visual principles

Calm, spatial, "Living Intelligence." Dark for the product (understanding is an
intimate, focused act); light only for trust/editorial. Motion communicates
state/causality (never decoration). Density low; typography and negative space
carry hierarchy. The check is never the visual hero; the accompaniment loop is.

## Route modes

- **Product Immersive (dark, WebGL):** `/`, product-domain entrances,
  `/recommendations`, `/experiences`, `/co-design`, `/partners`, `/reports`,
  `/saved`, `/private-state`, `/tests` catalogue.
- **Product Focus (dark, no WebGL):** test details, question flows, results,
  share, focused actions (`.yr-focus`).
- **Editorial (light):** `/about`, `/methodology`, `/contact`, `/privacy`,
  `/terms`, `/legal`, `/company`, `/support`, bounded English info. A deliberate
  YORISOU mode (shared BrandLockup + tokens), not the previous website.
- **LINE Context (light):** `/line/mini-app` only.

## Semantic tokens (`--yr-*`)

`--yr-surface · --yr-surface-2 · --yr-panel · --yr-panel-2 · --yr-panel-soft ·
--yr-text · --yr-text-mut · --yr-text-faint · --yr-kicker · --yr-hair · --yr-hair-2
· --yr-accent · --yr-accent-text · --yr-accent-ink · --yr-accent-soft · --amber ·
--coral`. Light by default (`:root`); dark on `.yr-focus` + `.aix2`. Shared
components consume only tokens → one code path per mode.

## Typography · spacing · radius · buttons · cards · motion

- **Type:** `aix2-serif` / `display-serif` for display; sans body; `aix2-eyebrow`
  / `yr-kicker` for kickers. One scale across modes.
- **Spacing:** container `min(1160px, 100vw-32px)`; band rhythm via `.aix2-band`.
- **Radius:** single scale (`--r 18px` / `--r-sm 12px` / pill).
- **Buttons:** `aix2-btn` (dark) / `yr-btn` (token) / `btn` (editorial) —
  primary = accent fill, ghost = hairline; one hierarchy (see CTA below).
- **Cards/panels:** `.yr-panel` / `.aix2-panel` / `.aix2-glass` / `.surface-panel`
  (token-driven). No `MvpCard` wall.
- **Motion:** `aix2-rise` / `MotionReveal` reveals; WebGL depth is lazy + absent
  under `prefers-reduced-motion`; every animation has a reduced-motion path.

## Share-card system (AIX-5)

Generated `ImageResponse` in three formats (square 1080² / story 1080×1920 /
OG 1200×630) with BrandMark + the **AIX-5 proposition** tagline. Public-safe
model only. **No placeholder output** (`test`/`demo`/empty chips) — invalid or
incomplete input returns a polished generic YORISOU card. Current-state language
("今の状態", not a fixed type).

## Illustration / 3D use

WebGL depth field on immersive hero surfaces only (lazy, reduced-motion-safe).
No stock illustration; BrandMark is the only mark (crane retired).

## CTA hierarchy (frozen — see VALUE_PROPOSITION_FREEZE)

Primary = begin from current state · Secondary = explore what YORISOU provides ·
Continuity = save/return/LINE · Discovery = recommendations/reports/experiences ·
Participation = feedback/co-design/partners. Never equal weight.

## Prohibited legacy patterns (rendered-output banned on launch-product routes)

old crane logo · old cream-green landing style · serif-dominant product hierarchy
· `MvpCard` wall · `frontstage-*` product styling · standalone per-route button
systems · old header/footer · ungoverned hardcoded palettes · old
result-conversion panels · mismatched mobile shell · unrelated error/empty/loading
states. Editorial pages may be light but must use this system.
