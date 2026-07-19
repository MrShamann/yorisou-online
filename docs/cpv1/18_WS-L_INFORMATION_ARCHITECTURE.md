# WS-L — Information Architecture

**Program:** YORISOU Complete Platform V1 (CPV1) · **Branch:** `feat/cpv1-integrated-platform`
**Workstream:** L (Information architecture) · **Maturity:** `ARCHITECTURE_CPV1` + partial `IMPLEMENTED_CPV1`
**Brand vision:** 人を、ひとつの答えに閉じ込めない。 · **Brand line:** ひとつの見方で、あなたを決めない。

WS-L is the *map*, not a feature. It defines one coherent structure so a first-time
stranger and a long-time user share the same mental model: what YORISOU is, how many
ways of seeing are used, why those ways stay separate, what happens after a result, and
what the person controls. It never leads with a diagnosis and never exposes an
engineering term as navigation.

---

## 1. Purpose

Give the whole platform a single, legible information architecture that:

- explains YORISOU **on the first screen**, without a login and without a test first;
- names every top-level place in **human, non-diagnostic** language (JP + EN), never in
  engineering terms (`method registry`, `adapter`, `observation`, `synthesis`, `scope`);
- makes the source-separated loop navigable —
  `understand → continuity → Companion → community → recommendation → reports → archive`;
- distinguishes, truthfully, the sections that are **already shipped** (`LIVE_APP2`) from
  those that are **governed design only** (`ARCHITECTURE_CPV1`), so nothing architecture-
  only is presented as a working or "coming soon" public feature;
- guarantees no dead-end: every valid state has a readable next action.

Non-goals (explicit): no Persona rooms, no fixed-identity taxonomy, no test catalogue as
the front door, no fortune-telling marketplace, no social feed, no diagnosis-first hero,
no navigation label that is an internal data-model name.

## 2. Maturity

`ARCHITECTURE_CPV1` for the IA contract as a whole; **partial `IMPLEMENTED_CPV1`** for the
sections whose routes already exist on the APP-2 baseline.

| IA layer | Maturity | Backed by |
|---|---|---|
| Sitemap + navigation contract (§4) | `ARCHITECTURE_CPV1` | this doc |
| Home first-screen explainer (§5) | `IMPLEMENTED_CPV1` (copy/layout), extends `/` `LIVE_APP2` | `app/page.tsx` (home) |
| Understand Me / Methods & Reflection | `LIVE_APP2` | `app/tests`, `app/tests/[testId]`, `app/result`, `app/progress` |
| My YORISOU | `LIVE_APP2` | `app/my-yorisou` |
| Recommendations & Actions | `LIVE_APP2` route + `CONTRACT_CPV1` envelope (WS-I) | `app/recommendations`, `app/saved`, `app/support` |
| Reports & History | `LIVE_APP2` route + `CONTRACT_CPV1` (WS-J/WS-F) | `app/reports/*`, `app/result` |
| Privacy / Memory / Visibility | `LIVE_APP2` route + `CONTRACT_CPV1` model | `app/privacy`, `app/private-state`; `lib/cpv1/consent.ts`, `understanding.ts` |
| Account & Settings | `LIVE_APP2` | `app/login`, `app/register`, account surfaces |
| Companion | `ARCHITECTURE_CPV1` (dev-flag preview) | WS-G; `cpv1_companion_preview` |
| Community | `ARCHITECTURE_CPV1` (dev-flag preview) | WS-H; `cpv1_community_preview` |
| Life Archive | `ARCHITECTURE_CPV1` (dev-flag preview) | WS-K; `cpv1_archive_legacy_preview` |
| Legacy Settings | `ARCHITECTURE_CPV1` + `LEGAL_BLOCKED` | WS-K; no public activation |

The four architecture-only sections have **no public route** in this program and appear
only behind private dev flags (`lib/cpv1/flags.ts`) in local/Preview — never as public
"coming soon" nav items.

## 3. Where WS-L sits

WS-L does not compute anything; it *arranges* the surfaces the other workstreams own. It
inherits their governance verbatim: the rights gate (WS-B/C), source separation (WS-D),
consent (WS-E), history (WS-F), and the recommendation priority order (WS-I). If a
workstream is blocked, WS-L reflects that honestly in the map rather than papering over
it with a live-looking entry.

## 4. The information architecture (twelve places)

Top-level sections, in loop order. Each row gives the human label (never an internal
term), the real route (or "no public route"), and maturity.

| # | Section (JP / EN nav label) | Route | Maturity |
|---|---|---|---|
| 1 | ホーム / **Home** | `/` | `LIVE_APP2` + `IMPLEMENTED_CPV1` first screen |
| 2 | あなたを知る / **Understand Me** | `/start`, `/tests` | `LIVE_APP2` |
| 3 | 方法とふりかえり / **Methods & Reflection** | `/tests/[testId]`, `/result`, `/progress` | `LIVE_APP2` (+ WS-F cadence `CONTRACT_CPV1`) |
| 4 | マイよりそう / **My YORISOU** | `/my-yorisou` | `LIVE_APP2` |
| 5 | よりそい相手 / **Companion** | no public route | `ARCHITECTURE_CPV1` |
| 6 | みんなの声 / **Community** | no public route | `ARCHITECTURE_CPV1` |
| 7 | おすすめと次の一歩 / **Recommendations & Actions** | `/recommendations`, `/saved`, `/support` | `LIVE_APP2` + WS-I `CONTRACT_CPV1` |
| 8 | レポートと記録 / **Reports & History** | `/reports/*`, `/result` | `LIVE_APP2` + WS-J/WS-F `CONTRACT_CPV1` |
| 9 | ライフアーカイブ / **Life Archive** | no public route | `ARCHITECTURE_CPV1` |
| 10 | 受け継ぎの設定 / **Legacy Settings** | no public route | `ARCHITECTURE_CPV1` + `LEGAL_BLOCKED` |
| 11 | プライバシー・記憶・公開範囲 / **Privacy · Memory · Visibility** | `/privacy`, `/private-state` | `LIVE_APP2` + `CONTRACT_CPV1` |
| 12 | アカウント・設定 / **Account & Settings** | `/login`, `/register`, account | `LIVE_APP2` |

**Navigation rules.**
- Primary nav shows only sections with a real, permitted surface for the current user;
  architecture-only sections (5, 6, 9, 10) are **absent** from public nav — not greyed,
  not "coming soon". They surface only in dev-flag preview.
- Labels are human and calm; the words 診断 (diagnosis) / タイプ判定 (type verdict) never
  appear as a section name. Internal model names (observation, synthesis, scope, adapter)
  never appear in the UI.
- Every section resolves to at least one readable action; no valid state dead-ends
  (mirrors WS-I `no_action_safe_fallback`).

## 5. Home first screen — the seven required explanations

The first viewport of `/` (no login, no test first, no fortune hook) MUST make seven
things legible. Below: each required point, its intent, and a JP copy *example* (not
fixed final copy). Diagnosis-first phrasing is prohibited; the hero states the vision,
not a verdict.

| # | Must explain | JP example copy | Grounded in |
|---|---|---|---|
| 1 | **What YORISOU is** | 「よりそいオンラインは、あなたを“ひとつの答え”に閉じ込めないための場所です。」 | Brand vision; §1 product spine |
| 2 | **How multiple methods are used** | 「いくつもの見方（心理・現在の状態・ふりかえりなど）から、あなたを立体的に見ていきます。」 | WS-C/WS-D multi-method loop |
| 3 | **Methods stay source-separated** | 「それぞれの見方は別々のまま。ひとつの点数に混ぜません。」 | `NO_UNIVERSAL_SCORE` (`lib/cpv1/understanding.ts`) |
| 4 | **What happens after a result** | 「結果は終わりではなく入口。あなたが確かめ・直し・断れます。」 | `ConfirmationState`; `ALL_USER_DATA_RIGHTS` (`consent.ts`) |
| 5 | **How Companion + community continue** | 「その後も“よりそい相手”とみんなの声が、静かに続きを支えます。」（*準備中の構想*） | WS-G / WS-H `ARCHITECTURE_CPV1` |
| 6 | **What the user controls** | 「記憶・公開範囲・共有は、いつでもあなたが決められます。」 | `PrivacyScope`, `MethodConsent` (`understanding.ts`, `consent.ts`) |
| 7 | **The primary next action** | 「まずは1つ、あなたを知ることから。」→ [はじめる] | primary CTA → `/start` |

Rules for the first screen:
- Point 5 must be framed as **direction, not a live feature** (e.g. a quiet "構想" note),
  because Companion/Community are `ARCHITECTURE_CPV1`; it must not read as an available
  service or a "coming soon" sign-up.
- Exactly **one** primary CTA (point 7). Secondary links (learn-more, methodology) are
  visually subordinate; no competing fortune/quiz hook.
- The hero leads with the brand line ひとつの見方で、あなたを決めない。 — never a
  type/score/diagnosis claim.
- No fabricated social proof, no invented user counts, no fake "others chose".

## 6. Data / contract model (references real code)

WS-L stores no user data of its own; it references the governed models:

- **Source separation surfaced, never merged** — any section that shows cross-method
  material renders `synthesizeThemes` (agreement / mixed / contradictory / temporary),
  never an averaged number (`NO_UNIVERSAL_SCORE`, `lib/cpv1/understanding.ts`).
- **Visibility labels map to `PrivacyScope`** — the "公開範囲" controls in §11 correspond to
  `device_local | account_private | companion_permitted | recommendation_permitted |
  public_safe` (`lib/cpv1/understanding.ts`), shown in human words, never the enum.
- **Consent surfaced per method** — the Methods & Reflection and Privacy sections read
  `MethodConsent` (`lib/cpv1/consent.ts`); sensitive/birth-data families are session-only
  by default and never expose a community toggle unless `canShareToCommunity` allows it.
- **History is the spine of §8** — Reports & History reads append-only `HistoryEvent` /
  `buildChangeView` (`lib/cpv1/history.ts`); nothing is rewritten in place.
- **Dev-flag gating for architecture-only sections** — sections 5/6/9/10 render only when
  `isDevFlagOn(...)` (`lib/cpv1/flags.ts`) in local/Preview; production returns nothing.
- **Rights gate upstream of every method entry** — the Methods section lists only methods
  whose registry + rights record permit a public surface (`rights.ts`, `methods.ts`);
  rights-blocked methods are absent from public nav, not shown as "coming soon".

## 7. Governance & prohibitions

- **No diagnosis-first IA.** No section, hero, or nav label frames the product as a
  verdict, type, or score. 診断・タイプ判定・総合点 never appear as navigation.
- **No engineering-term navigation.** Internal model names (registry, adapter,
  observation, synthesis, privacy scope, downstream) never surface as UI labels.
- **No architecture-only section on a public route.** Companion, Community, Life Archive,
  Legacy Settings have no public entry and no public "coming soon" item; dev-flag only.
- **No universal score anywhere in the IA.** Cross-method views show separated sources.
- **No fabricated content.** No fake users, counts, testimonials, prices, or inventory in
  any section, including the home hero.
- **Rights gate honored in the map.** A rights-blocked method never appears as browsable.
- **Legacy stays legally blocked.** Section 10 is design-only; no public Digital Legacy
  activation in this program (`LEGAL_BLOCKED`).
- **No dead-ends.** Every valid state offers a readable next action.

## 8. Privacy / consent touchpoints

- **Visibility is a first-class place (§11), not buried in settings.** A person can reach
  記憶・公開範囲 in one hop and see, per item, its `PrivacyScope` in plain words.
- **Full user rights reachable from every data-bearing section** — confirm · correct ·
  reject · hide · forget · delete · export · revoke_downstream (`ALL_USER_DATA_RIGHTS`,
  `lib/cpv1/consent.ts`) are never more than one action away from the item they act on.
- **Consent is per method, surfaced where the method lives** (§3 Methods & Reflection),
  defaulting to the safe posture (`defaultConsent`); community sharing stays off unless
  explicitly enabled.
- **No personal data in URLs.** Section routes carry no sensitive query parameters; result
  and report links use safe references only (consistent with WS-J share governance).
- **Home requires no login and collects nothing** to explain the product.

## 9. Acceptance criteria

- [ ] Home first screen renders all seven §5 explanations above the fold, login-free, with
      exactly one primary CTA and no diagnosis-first / fortune hook.
- [ ] Point 5 (Companion + community) reads as direction/構想, never as an available or
      "coming soon" service.
- [ ] Primary nav contains only sections with a real permitted surface; sections 5, 6, 9,
      10 are absent from public nav and appear only under their dev flags.
- [ ] No nav label or section title uses 診断 / タイプ判定 / 総合点 or an internal model term.
- [ ] Every cross-method view in the IA renders separated sources (`synthesizeThemes`),
      never an averaged score.
- [ ] Visibility (§11) is reachable in one hop and shows each item's `PrivacyScope` in
      human language; user data rights are one action from the item.
- [ ] Every section resolves to at least one readable next action (no dead-end).
- [ ] Architecture-only sections return nothing in production (`isDevFlagOn` false).
- [ ] The maturity table (§2/§4) matches the actual route inventory; no `ARCHITECTURE_CPV1`
      section is presented as functional.

## 10. Open blockers

- **Companion / Community / Life Archive / Legacy are `ARCHITECTURE_CPV1`** (WS-G/H/K):
  present in the map, absent from public nav, dev-flag preview only. They become nav
  entries only after their own workstreams ship and (for Legacy) legal clearance.
- **Legacy Settings is additionally `LEGAL_BLOCKED`** — no public Digital Legacy activation
  in this Preview program; the section is design + settings-shape only.
- **Home first-screen copy is example, not final.** Final JP microcopy needs Founder /
  brand review before any public change; this doc fixes the *structure*, not the wording.
- **Recommendations & Reports sections depend on downstream CONTRACT_CPV1 work** (WS-I/J):
  the routes are live (`LIVE_APP2`) but the full CPV1 provenance/synthesis envelopes are
  contract-level, so those sections are truthful today only within APP-2 scope.
- **Rights-blocked methods** (WS-C `RIGHTS_BLOCKED`) remain excluded from the browsable
  method surface until rights + privacy review + Founder activation; the IA must not add
  them to public nav before then.
