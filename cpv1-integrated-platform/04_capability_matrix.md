# CPV1 — Capability Matrix (honest maturity ledger)

Every capability tagged with exactly one maturity level. Nothing rights-blocked or
architecture-only is presented as a public, functional, or "coming soon" surface.

Legend: `LIVE_APP2` shipped on the APP-2 baseline (preserved) · `IMPLEMENTED_CPV1`
new real code, wired + tested + local-verified · `CONTRACT_CPV1` real typed
contract + model + tests (not a full public surface) · `ARCHITECTURE_CPV1`
governed design spec only · `RIGHTS_BLOCKED` registered + gated on rights ·
`LEGAL_BLOCKED` gated on legal/jurisdiction · `FOUNDER_GATED` needs explicit
Founder activation.

## Workstreams

| WS | Capability | Maturity | Evidence |
|---|---|---|---|
| A1 | 120/120 completion presented complete; no "too few answers"; confidence bands withheld; version+status+limits shown | `IMPLEMENTED_CPV1` | `revealContent.ts`, `RevealSections.tsx`, cpv1 test A1 |
| A2 | 120Q route re-badged 120問 (was 24問); relationship-fatigue keeps 24問 | `IMPLEMENTED_CPV1` | `productCards.ts`, cpv1 test A2 |
| A3 | nine-family deeper reports reachable via the Deepen journey | `IMPLEMENTED_CPV1` | `app/reports/page.tsx`, cpv1 test A3 |
| A4/M | responsive: existing AIX-2..5 + APP-2 grids preserved; CPV1 adds responsive family-report grid; full per-surface desktop redesign | `IMPLEMENTED_CPV1` (targeted) + `ARCHITECTURE_CPV1` (full) | reports index grid; responsive screenshots (evidence) |
| A5 | LINE not described as live provider integration (app-side contract; handshake external) | `LIVE_APP2` (verified) | `lineCallbackContract.ts`, APP-2 evidence |
| B1 | Method Registry (full field set) | `IMPLEMENTED_CPV1` | `lib/cpv1/methods.ts`, cpv1 tests |
| B2 | Method/Content Rights Registry (governed routes) | `IMPLEMENTED_CPV1` | `lib/cpv1/rights.ts`, cpv1 tests |
| B3 | Public activation gate (logic+rights+privacy+tests+Founder) | `IMPLEMENTED_CPV1` | `methodPublicallyActivatable`, cpv1 tests |
| C (originals) | YORISOU-original assessments wired + public-active | `LIVE_APP2` + `IMPLEMENTED_CPV1` | registry `public_active`; shipped surfaces |
| C (external) | Zi Wei Dou Shu, Ba Zi, Cheng Gu, I Ching, Five Elements, Chinese Zodiac, name-hanzi, astrology, Tarot, numerology, dream, symbolic-cards, image-color, Big Five, MBTI | `RIGHTS_BLOCKED` | registry entries + `rightsReviewRequired`; off public routes; cpv1 tests |
| D | Source-separated understanding model (no universal score; AI-synthesis distinct) | `IMPLEMENTED_CPV1` / `CONTRACT_CPV1` | `lib/cpv1/understanding.ts` + local schema (6/6 PASS) |
| E | Method-level consent + sensitive inputs | `CONTRACT_CPV1` | `lib/cpv1/consent.ts` + local `yorisou_cpv1_method_consent` + spec 11 |
| F | Longitudinal history (append-only, version-preserving) | `CONTRACT_CPV1` | `lib/cpv1/history.ts` + local `yorisou_cpv1_history_events` (append-only PASS) + spec 12 |
| G | Living Companion (Quiet Guide / AI Friend / AI Pet) | `ARCHITECTURE_CPV1` | spec 13 |
| H | Community surfaces | `ARCHITECTURE_CPV1` | spec 14 |
| I | Recommendations & actions (finite, explainable, provenance) | `CONTRACT_CPV1` (extends APP-2/SR-1) | spec 15 + APP-2 recommendation graph |
| J | Reports & sharing (private→never auto-public) | `CONTRACT_CPV1` (extends APP-2 reports) | spec 16 + APP-2 family reports |
| K | Life Archive & Legacy | `ARCHITECTURE_CPV1` + `LEGAL_BLOCKED` | spec 17 (no prod activation; Legacy Companion architecture-only) |
| L | Information architecture | `ARCHITECTURE_CPV1` + partial `IMPLEMENTED_CPV1` | spec 18 + shipped home/reports/my-yorisou |
| N | Founder/Admin aggregate surfaces | `CONTRACT_CPV1` (extends APP-2 dashboards) | spec 19 + APP-2 dashboards |

## Environment distinction (§24)

| State | What it means here |
|---|---|
| production current | `main @ 70da80a` — UNCHANGED; nothing in this program touches it |
| PR #113 APP-2 | protected baseline; OPEN + unchanged |
| new CPV1 branch | `feat/cpv1-integrated-platform` — this program's stacked work (draft PR #114) |
| local-only | local Supabase (Colima) verification of D/E/F schema |
| Preview-only | Vercel PR preview of the CPV1 branch (ephemeral) |
| rights-blocked | the external method universe — off public routes, no fabricated content |
| legal-blocked | real post-death Legacy activation, source-grounded Memory Q&A production use |
| Founder-approval-blocked | public activation of any method + Companion/Community/Archive public surfaces |

## Why the honest program status is `CPV1_PARTIALLY_READY_WITH_EXPLICIT_RIGHTS_BLOCKERS`

The platform foundation (P0 corrections, method + rights registries, activation gate,
source-separated understanding, consent, history) is real, tested, and local-verified.
The continuity layers (Companion, Community, Archive/Legacy) are governed architecture,
and the external method universe is rights-blocked by design. No external method can be
truthfully rights-cleared or original-content-authored inside this program, so it cannot
reach `INTEGRATED_PREVIEW_READY` — the rights + legal + Founder-activation gates are the
remaining, correctly-recorded blockers.
