# UX-1 — Four-Surface Implementation Review

> Branch `feat/ux1-ai-native-visual-direction` · PR #125 (draft → ready) · base `c8d8a8ad`.
> Evidence: `qa/ux1-ai-native-visual-direction/after/`. Two correction rounds run, as the brief allows.

## 1. What was built, and where

| # | Surface | Route | Register |
|---|---|---|---|
| 1 | Home / Entry | `/prototype/ux1/home` | open (ivory) |
| 2 | Intent entry | `/prototype/ux1/understand` | open (ivory) |
| 3 | The reading | `/prototype/ux1/result` | **private (ink)** |
| 4 | Continuity | `/prototype/ux1/continuity` | **private (ink)** |

**Route choice (brief §11).** The four surfaces were built on the repository's own existing
`/prototype/*` convention rather than on the live routes. Reason: the real carriers are either
Founder/Admin-gated (`/tests/daily-check-in`, `/tests/yorisou-values`), governed-content surfaces
(`/result` and its taxonomy/copy), or require a completed session. Restyling them in place could not be
done without touching governed flows, which this package forbids. The prototype routes are **noindex**,
shell-suppressed, absent from navigation/catalog/sitemap, and **no existing file was modified** — the
entire diff is new files plus four evidence documents.

## 2. Correction rounds

**Round 1** — from the first real browser pass:

| Finding | Severity | Fix |
|---|---|---|
| `color-contrast` failure on the field caption in the private register (3.05:1, `#635c73` on `#0f0b1a`) | HIGH | Root cause was a design flaw, not a colour typo: the field component hardcoded a **light-surface** muted token, silently assuming a register. Made **register-agnostic** (`text-current opacity-70`), so it is correct in both. |
| Heading outline started `H2` before `H1` on home (the field precedes the page title in reading order) | MEDIUM | The field section is now labelled with `aria-label`; its visible label is a `<p>`. Outline is now `H1` first. |

**Round 2** — from viewing the rendered surfaces:

| Finding | Severity | Fix |
|---|---|---|
| **The person at the centre was a ~2.6px dot** — visually the weakest element on the surface, while carrying the direction's core claim ("you are the centre, not the result"). On the ink register it was nearly invisible. | HIGH (thesis-critical) | The centre now has real visual weight (halo + ring + solid core) and is **labelled 「あなた」**. The claim is now visible rather than asserted. |

No further rounds were run: the brief caps internal correction at two, and remaining observations
(§5) are judgment calls for the Founder, not defects.

## 3. Verification (real browser, built output)

Playwright + **axe-core 4.11.1**, against the production build served locally.

| Check | Result |
|---|---|
| axe WCAG 2.0/2.1/2.2 A+AA — 4 surfaces × 390/768/1440 | **0 violations, 0 serious, 0 critical** (12/12) |
| axe after the correction interaction | **0 serious / 0 critical** |
| HTTP status | 200 on all 12 |
| `noindex` | true on all four surfaces |
| Horizontal overflow | none at any viewport |
| **200% text zoom** (mobile) | **no overflow** on any of the four |
| Keyboard | 8 tabs, every stop labelled, `focusVisible` **true** on all 8 |
| Reduced motion | renders; correction still works; transition dropped |
| Unnamed controls / sub-44px buttons | 0 / 0 |
| `tsc --noEmit` · ESLint · production build | 0 errors · clean · succeeded |

**The signature interaction, measured (not asserted):** on 「少し違う」 → 「あたたかさを近くに置きたい時期」,
the reading changed (`見通しを確かめたい時期` → `あたたかさを近くに置きたい時期`), the field mark **moved**
(`translate(-102.6,-49.4)` → `translate(86.4,20.9)`), the source chip became 「あなたの訂正から」, the
suggestions and their reasons changed, and an `aria-live` region announced
「訂正を受け取り、読みと次の一歩を置き直しました。」 Screenshot: `after/result-desktop-corrected.png`.

## 4. Scores (1–5) against the brief's §16 gate

| Category | Score | Note |
|---|---|---|
| First-screen clarity | **4** | The artifact is shown and labelled before anything is claimed. |
| User motivation | 4 | Low-pressure entry; "残すかどうかは、あとで" removes the usual account friction. |
| Visual trust | **5** | Source chips, worded certainty, explicit "what this does not mean", visible privacy register. |
| Japanese naturalness | 4 | Plain, unhurried, non-clinical; no translated-English structure. Native review still advisable. |
| Mobile usability | **4** | 1723–3148px pages, no overflow at 100% or 200%, ≥44px controls, no hover-only meaning. |
| Desktop composition | **4** | Genuine two-column workspace with a sticky field; not a centred mobile column. |
| Interaction rhythm | 4 | One meaningful animation; everything else is immediate. |
| AI-native usefulness | **5** | Correction outranks the system and visibly reorganises the field. |
| Continuity | 4 | Trajectory + corrections + memory control in one place. |
| Public/private clarity | **5** | Register change is the signal; reinforced in words. |
| Non-generic identity | 4 | No orb, no gradient hero, no uniform card grid, no star map. |
| Accessibility | **5** | 0 axe violations; keyboard, focus, reduced motion, 200% zoom all pass. |
| Performance | 4 | Pure SVG/CSS; no animation library, no 3D, no chart library, no new dependency. |
| Implementation consistency | 4 | One token set, one shell, one field component across all four. |

**Gate:** no category below 3; first-screen clarity 4; visual trust 5; mobile usability 4; AI-native
usefulness 5; public/private clarity 5; **no unresolved HIGH/CRITICAL trust issue; zero serious/critical axe.**
All §16 minimums are met.

## 5. Remaining weaknesses (honest, for the Founder)

1. **The field is calm to the point of being quiet.** It reads as considered rather than striking. That is
   a deliberate trade (clarity over spectacle) but it is a legitimate thing to push back on.
2. **Only one motion exists.** Correct by doctrine, but a Founder may want the *arrival* of a first
   reading to have its own moment.
3. **Japanese copy is prototype copy**, written for structure. It has not had a native editorial pass.
4. **Tablet is a wide single column**, deliberately — but it is the least designed of the three widths.
5. **The trajectory list is short and synthetic**; with a year of real history the visual density of the
   trail is unproven.
6. **`/tests/daily-check-in`, `/tests/yorisou-values` and `/result` were audited from source, not pixels**
   (Production gating; see the audit's §6). The direction's fit to those live flows is inferred.
7. **Not built, by scope:** dark-mode theming, a semantic token bridge, a shared Button/Card library.
   These are UX-2 work.

## 6. Trust / risk review (brief §4.4 checklist)

| Risk | Status |
|---|---|
| Clinical impression | **Clear** — no scores, no bands, no medical framing. |
| Over-diagnosis | **Clear** — one period-shaped reading, explicitly provisional. |
| Fixed-identity language | **Clear** — 「〜時期」 only; no type, no nickname, no star map. |
| Data-extraction feeling | **Clear** — nothing is stored until asked; save is reversible. |
| Unclear public/private | **Clear** — register + explicit wording. |
| Manipulative continuity | **Clear** — no streak, no nudge, no urgency; return is optional. |
| Fake AI presence | **Clear** — no simulated processing; the removed faux "thinking" panel was a named audit finding. |
| Emotional dependency | **Clear** — Companion is opt-in, silent, and labelled not-running. |
| Commercial pressure | **Clear** — nothing is sold. |
| Unclear memory behaviour | **Clear** — one control that states plainly what happens when off. |
| Misleading capability claims | **Clear** — statuses come from the governed registry; the 17 gated methods are shown as a boundary. |

## 7. AI-native acceptance (brief §17)

Demonstrated through interaction and composition, not paragraphs — **6 of 8** (four required):

1. ✅ Multiple methods as distinct lenses · 2. ✅ Current understanding dynamic, not fixed ·
3. ✅ **User correction reorganises the experience** · 4. ✅ History as continuity ·
5. ✅ Recommendation reason emerging from current state · 6. ✅ Memory and visibility under user control ·
7. ⚠️ Companion presence — present but deliberately inert and labelled ·
8. ✅ Public/private layers with different visual treatment.

It could **not** fairly be described as "a prettier test website", "a SaaS landing page", "a dashboard
with more gradients", "a card library", "a chatbot in the corner", "a personality poster", or "a static
report with animation".
