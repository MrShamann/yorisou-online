# YORISOU Complete Platform V1 — Integrated Preview Build Program

**Branch:** `feat/cpv1-integrated-platform` (stacked on `feat/aix-1-ai-native-experience` @ `8483333`).
**Not** targeting `main`. No merge, no production deploy/migration/secrets, no real
payment, no external supplier contact, no public method activation without rights
clearance, no public Digital Legacy. Claude Code sole executor; Codex excluded.

Production remains UNCHANGED at `main @ 70da80a`. PR #113 (APP-2) remains OPEN and
unchanged as the protected baseline; this program is a stacked continuation.

---

## 1. What YORISOU is (product spine)

One integrated loop, source-separated, user-controlled:

`multi-method human-understanding → private continuity → Companion → community →
recommendation & action → feedback → longitudinal learning → Life Archive & Legacy`.

Brand vision: **人を、ひとつの答えに閉じ込めない。**
Brand line: **ひとつの見方で、あなたを決めない。**

It is NOT a Persona platform, a test catalogue, a fortune-telling marketplace, a
fixed-identity system, a generic chatbot, a social feed, or a public prototype
catalogue. No 31 Personas, no Persona rooms, no fixed user taxonomy.

## 2. The rights gate is the load-bearing constraint (§8, §22)

Every method that presents third-party tradition, instrument, calculation, or
artwork is **rights-gated**. Per the authorization:

- "Found online" is NOT a valid rights route.
- Do NOT copy third-party questions, scoring tables, modern report text,
  translations, websites, software code, datasets, astrology interpretations,
  Tarot artwork, or branded terminology.
- Big Five requires licence + source validation; MBTI is import / official
  handoff / formally-licensed only; no embedded unlicensed instrument.
- No external method appears on a public route until: logic complete + rights
  pass + original/licensed content + privacy review + tests + Founder activation.
- Rights-incomplete modules live ONLY behind private dev flags — never as public
  "coming soon" items.

**Consequence for this build:** the external method universe (Zi Wei Dou Shu, Ba
Zi, Cheng Gu, I Ching, Five Elements, Chinese Zodiac, astrology, Tarot, numerology,
Big Five, MBTI, …) cannot be truthfully rights-cleared or original-content-authored
inside this program. Those modules are delivered as **governed registry entries with
every maturity dimension recorded unmet separately** — implementation `not_started`,
content `not_authored`, privacy `not_reviewed`, tests `not_run`, rights
`review_required`, Founder gate closed, public route unavailable — real governance, NO
fabricated calculation logic or interpretation content, NO public route. Rights is only
ONE of the unmet dimensions; the external universe is unbuilt, not merely rights-blocked.
This is the correct behaviour under §25 ("record the exact blocker; keep it off public
routes; continue all other workstreams; do not substitute fabricated content"), and it is
why the honest program outcome is
`CPV1_PARTIAL_9_METHODS_ACTIVE_EXTERNAL_UNBUILT_MULTI_DIMENSION_BLOCKED`.

## 3. Maturity taxonomy (used in the capability matrix)

Every capability is tagged with exactly one maturity level so nothing is over-claimed:

| Level | Meaning |
|---|---|
| `LIVE_APP2` | Already shipped on the APP-2 baseline (PR #113); preserved here. |
| `IMPLEMENTED_CPV1` | New in CPV1: real code, wired, contract-tested, local-verified. |
| `CONTRACT_CPV1` | Real typed contract + model + tests, not yet a full public surface. |
| `ARCHITECTURE_CPV1` | Governed design spec only (as the authorization requires for it). |
| `gated` (multi-dimension) | Registered but NOT publicly activatable: the actual `methodActivationState` value when ANY maturity dimension is unmet (implementation/content/privacy/tests/rights/route/deployment/Founder/public-availability — R1.1A adds independent deployment evidence). For external methods, ALL are unmet — not just rights. There is no single `rights_blocked` activation state. |
| `LEGAL_BLOCKED` | Blocked on legal/jurisdiction review (e.g. real Legacy activation). |
| `FOUNDER_GATED` | Built but requires an explicit Founder activation to go public. |

Nothing rights-blocked or architecture-only is presented as a public, functional,
or "coming soon" surface.

## 4. Workstream map

| WS | Scope | Primary maturity |
|---|---|---|
| A | P0 current-product corrections (120/120 completion, badges, report nav, responsive, LINE truthfulness) | `IMPLEMENTED_CPV1` |
| B | Method Registry + Method/Content Rights Registry + activation gate | `IMPLEMENTED_CPV1` |
| C | Method-adapter contract + method universe registration | originals: **9 `implemented_route_verified`** (route on production `main`, NOT Founder-activated ⇒ 0 `public_active`) + 3 unbuilt (`gated`, implementation `not_started`); external: **15 `gated`** — implementation `not_started` · content `not_authored` · privacy `not_reviewed` · tests `not_run` · rights `review_required` (multi-dimension, not merely rights) |
| D | Source-separated understanding model (no universal score) | `CONTRACT_CPV1` (backend types + tests; no wired UI) |
| E | Method-level consent + sensitive inputs | `CONTRACT_CPV1` |
| F | Longitudinal history events | `CONTRACT_CPV1` |
| G | Living Companion (Quiet Guide / AI Friend / AI Pet) | `ARCHITECTURE_CPV1` |
| H | Community surfaces | `ARCHITECTURE_CPV1` |
| I | Recommendations & actions | `CONTRACT_CPV1` (extends APP-2/SR-1) |
| J | Reports & sharing | `CONTRACT_CPV1` (extends APP-2 reports) |
| K | Life Archive & Legacy | `ARCHITECTURE_CPV1` + `LEGAL_BLOCKED` (no prod activation) |
| L | Information architecture | `ARCHITECTURE_CPV1` + partial `IMPLEMENTED_CPV1` |
| M | Responsive web + installed app | `IMPLEMENTED_CPV1` (with A4) |
| N | Founder/Admin aggregate surfaces | `CONTRACT_CPV1` (extends APP-2 dashboards) |

## 5. Data & environment (§21)

Local Supabase (Colima) + isolated Preview-compatible dev infra only. All schema
reversible, least-privilege, RLS-protected, audited, deletion-aware, export-aware,
consent-aware, source-versioned. No production migration, no production secrets, no
production user data. Synthetic fixtures only in tests/evidence — never presented as
real community activity or customer evidence.

## 6. Deliverable layout

- `docs/cpv1/` — this doc + workstream specs + registries (human-readable) + capability matrix.
- `lib/cpv1/` — real code: registries, adapter contract, understanding model, consent, history, flags.
- `app/data/cpv1/` — method + rights registry data.
- `supabase/migrations/` — CPV1 local schema (reversible/RLS).
- `lib/yorisou-tests/__tests__/cpv1Completion.test.ts` — contract suite.
- `evidence/cpv1-integrated-platform/` — evidence tree (on the evidence branch).

See `01_RIGHTS_GATE_AND_METHOD_UNIVERSE.md` and `90_CPV1_CAPABILITY_MATRIX.md`.
