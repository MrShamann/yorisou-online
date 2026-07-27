# UX-1 — Visual Truth Audit

> **Founder authorization:** `YORISOU_UX1_AI_NATIVE_VISUAL_DIRECTION_RECOVERY_AUTHORIZED`.
> Branch `feat/ux1-ai-native-visual-direction` from `c8d8a8ad6a72949c248adb098a626d1ab9d6a579`.
> **Grounded in rendered pixels**, not in written summaries: 20 screenshots of live Production
> (`https://yorisou.online`) at 1440×900 and 390×844, captured 2026-07-27 via Playwright and viewed.
> Evidence: [`qa/ux1-ai-native-visual-direction/before/`](../../../qa/ux1-ai-native-visual-direction/before).

## 1. What was inspected

| # | Surface | Route | Desktop | Mobile | Status |
|---|---|---|---|---|---|
| 1 | Home | `/` | ✅ + full-page | ✅ | 200 |
| 2 | Entry catalog | `/tests` | ✅ + full-page | ✅ | 200 |
| 3 | Login | `/login` | ✅ | ✅ | 200 |
| 4 | Register | `/register` | ✅ | ✅ | 200 |
| 5 | About / trust | `/about` | ✅ + full-page | ✅ | 200 |
| 6 | Recommendations | `/recommendations/graph` | ✅ | ✅ | 200 |
| 7 | Experiences | `/experiences` | ✅ | ✅ | 200 |
| 8 | Saved (continuity) | `/saved` | ✅ + full-page | ✅ | 200 |

**Not visually inspected in Production, and why (disclosed):** `/tests/daily-check-in` and
`/tests/yorisou-values` are the Founder/Admin **private pilot** and correctly return **404** to
everyone else. Rendering them would have required re-granting `YORISOU_ADMIN_EMAILS` — a Production
environment mutation this package explicitly forbids. They were audited from source instead
(`app/tests/yorisou-values/*`, `app/tests/daily-check-in/*`), and that source audit is what informs
the Result/Continuity findings below. `/result` requires a completed test session, so it too was
audited from source (`app/result/*`). **PR #113 Preview archaeology was not performed** — see §6.

## 2. Route reality

`find app -name page.tsx` → **111 routes**. This is the structural backdrop: the product has spread
across a very large surface area with at least three competing visual idioms.

## 3. Capability truth (the guardrail for any prototype)

From the governed registry `lib/cpv1/methods.ts` (`methodActivationState`, evidence-gated):

| Activation state | Count | Methods |
|---|---|---|
| `implemented_route_verified` | **9** | imairo-120q, c02-current-state, relationship-fatigue-24q, f01-work-fit, f02-workplace-fit, love-distance, work-rhythm, local-life, name-impression |
| `implemented_private` | **2** | daily-check-in, yorisou-values (Founder/Admin private pilot) |
| `gated` | **17** | 紫微斗数, 四柱推命, 称骨, 易経, 五行, 生肖, 姓名, 占星術, タロット, 数秘術, 夢, シンボルカード, 色, Big Five, MBTI, 動機, ふり返り |
| **`publicRoute: available`** | **0** | *no method has passed the full 10-condition public activation* |

**Consequence for UX-1:** any surface that implies "many methods, all live" is false. The prototype
must show the 11 real ones with honest per-method status and must present the 17 as an explicit
boundary, never as a teaser.

## 4. Findings

Severity: **CRITICAL** (contradicts the product thesis) · **HIGH** · **MEDIUM** · **LOW**.

### 4.1 First screen — visual

| # | Finding | Sev |
|---|---|---|
| V1 | **Textbook two-column SaaS hero**: left kicker + H1 + subhead + two pills, right decorative visual. The single most generic pattern available; nothing about it is YORISOU-specific. (`home-desktop.png`) | CRITICAL |
| V2 | **The "AI" visual is a semantically empty purple orb** — a glowing sphere with an orbit ring and three floating chips (`aria-hidden`). It signals "AI" as decoration and shows nothing the product actually produces. This is the "gradient-and-sparkle AI branding" anti-pattern. | CRITICAL |
| V3 | **The product is asserted, never demonstrated.** The first screen contains no artifact — no real reading, no sample question, no private state. What YORISOU *is* appears only as a tagline plus a negative disclaimer (「診断や占いではありません」). | CRITICAL |
| V4 | **Uniform card rows below the fold**: a 5-up numbered 体験の流れ strip and a 6-up できること grid, every card identical in shape and weight. Two consecutive uniform grids = "prettier test website". | HIGH |
| V5 | **A faux AI-thinking panel** (dark panel with static status dots mimicking processing) simulates machine activity that is not occurring. | HIGH |
| V6 | Primary CTA hard-links to one narrow test (`/tests/relationship-fatigue`) that isn't even in the published catalog, contradicting the broad headline. | MEDIUM |

### 4.2 Cross-surface coherence

| # | Finding | Sev |
|---|---|---|
| C1 | **Two unrelated visual systems ship side by side.** Home = violet `#6C4CFF` + sans + pills + glow. `/tests` = deep-green `#173B35` + large serif + editorial panels. Same session, two different products. (`home-desktop.png` vs `tests-desktop.png`) | CRITICAL |
| C2 | **Two token systems coexist in `globals.css`**: a legacy warm-ivory/sage/deep-green set driving most component classes, and the newer `--yorisou-color-*` AI-native layer. No semantic bridge, so components silently belong to one world or the other. | HIGH |
| C3 | **No shared Button/Card primitive.** Buttons are either legacy `.btn` CSS or ad-hoc inline Tailwind pills, duplicated per surface. | MEDIUM |
| C4 | `/check-in` is a **third** entry idiom (its own naming, chromeless shell). | MEDIUM |

### 4.3 Result & continuity (source-audited)

| # | Finding | Sev |
|---|---|---|
| R1 | `/result` leads with a **giant serif nickname + clan label** — a personality poster at the top of the hierarchy, despite a genuinely careful governed body underneath (evidence → limits → privacy). The identity claim arrives *before* its qualifications. | CRITICAL |
| R2 | `TraitConstellation` renders **a star-map centred on "your type"** — the strongest fixed-identity signal in the product, directly opposing state-not-identity. | HIGH |
| R3 | **`/result` has no confirm/correct at all.** Save and share exist; "is this right? / a bit off" exists only inside the YV flow. The single most AI-native control is missing from the main result surface. | CRITICAL |
| R4 | **Continuity is fragmented across three places**: `/saved` (device-local card pile), `/private-state` ("わたしの今", a flat stack of sections), and per-method history. There is no one place where "what is understood about me now" lives. | HIGH |
| R5 | `/saved` in the empty state is **a page of empty boxes** with no sense of a trajectory. | MEDIUM |

**Genuinely strong, must be preserved:** the governed source-typed chips (回答から / タイプ解釈 / このテストの限界), the honest non-numeric confidence band, the explicit "what this does not mean", the privacy panel, YV's period framing (「〜時期」) and its correction prompt, and DCI's refusal to produce any score. **YV is the best-aligned existing model in the product** and became the template for the prototype's reading.

### 4.4 Mobile / desktop

| # | Finding | Sev |
|---|---|---|
| M1 | Mobile home is calm and the 4-tab bottom nav is good — **reusable**. | — |
| M2 | Mobile home is **4571px tall** (5.4 screens) for one proposition; the orb occupies a full screen of it. | MEDIUM |
| D1 | Desktop is **a wide container holding mobile-shaped content** — full-width card rows, no workspace, no secondary column, no comparison capability. | HIGH |
| D2 | `/recommendations/graph` desktop is **~1136px tall with almost nothing in it**. | MEDIUM |

### 4.5 Japanese copy

| # | Finding | Sev |
|---|---|---|
| J1 | Positioning is defined defensively (what it is *not*) before it is defined positively. | HIGH |
| J2 | Nav labels are internal-model words (今を知る / おすすめ / 体験を見つける / わたしの今) rather than user intents. | MEDIUM |
| J3 | Disclaimer density on `/tests` is high enough to read as caution rather than care. | LOW |

### 4.6 Capability honesty

| # | Finding | Sev |
|---|---|---|
| T1 | `/tests` shows a "この先にある層" row including コミュニティ and マッチング — **concepts with no active implementation**, presented as adjacent layers. | HIGH |
| T2 | The catalog surfaces 3 tests while the registry holds 9 route-verified + 2 private-pilot; the public story and the registry truth do not match. | MEDIUM |

## 5. Reusable vs discard

**Reuse:** `--yorisou-color-*` / radius / space / shadow / motion tokens · `YorisouLogo` / `YorisouSymbol` ·
`AppHeader` · `MobileBottomNav` · the governed source-chip + limits + privacy grammar · YV's period
framing and correction prompt · DCI's no-score acknowledgement · `/prototype/*` + `ProtoShell` convention.

**Discard for this direction:** the semantic-empty orb hero · the faux AI-thinking panel · uniform
5-up/6-up card grids · the legacy warm-sage/deep-green token set on product surfaces · the `/tests`
serif "catalog" idiom · the type-centred star map · unimplemented "coming layers" teasers.

## 6. Honest limitations of this audit

- **PR #113 Preview was not visually inspected.** Its Vercel Preview is not reachable, and running its
  head locally would have meant standing up a stale, conflicted branch for archaeology whose findings
  are already covered by the source audit of the same surfaces on `main`. Recorded as **not performed**
  rather than implied. PR #113 was not modified, merged, rebased or cherry-picked.
- **DCI/YV/result Production pages were audited from source, not pixels**, because rendering them would
  have required a forbidden Production env mutation (§1).
- Screenshot heuristics (card counts, gradient counts) are indicative; every CRITICAL/HIGH finding above
  was confirmed by looking at the image or reading the component.
