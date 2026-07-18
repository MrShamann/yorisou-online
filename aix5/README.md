# AIX-5 — Value Proposition & Whole-App Experience Reset (Founder review evidence)

**Package:** AIX-5 · **PR:** #113 (OPEN, unmerged) · **Feature branch:** `feat/aix-1-ai-native-experience`
**Baseline:** production main @ `70da80a` (UNCHANGED — no merge / deploy / migration in this package)
**Status:** `AIX_5_VALUE_PROPOSITION_AND_WHOLE_APP_EXPERIENCE_PREVIEW_READY`

AIX-4 was Founder-**rejected for merge** on a *strategic* (not merely visual) failure: the value
proposition was not clearly defined across the product; YORISOU could still be read as a sophisticated
test website; understanding was not connected to continuing support; six domains read as categories, not
one system; some copy/CTA language was inconsistent; share content was not aligned with the final
proposition. AIX-5 resets the value proposition, experience architecture, homepage narrative and
whole-app copy/CTA coherence around ONE product truth:

> **YORISOU understands the person in order to provide continuing, personalized support beyond the
> initial check.**

## Founder-frozen value proposition (binding)

- **Main proposition:** 今のあなたを知り、これからを一緒に選ぶ。
- **Product definition:** YORISOUは、あなたの状態・変化・好みを理解し、必要な情報・体験・サービス・つながりを、必要なときに届けるAI-native伴走プラットフォームです。
- **Role of the check:** チェックは、あなたを理解するための最初の入口のひとつです。
- **Core architecture:** the loop — Understand → Remember → Recommend → Try → Reflect → Adapt → Return (not the test).
- **CTA hierarchy:** Primary `今の自分から始める` (→ /check-in) · Secondary `YORISOUでできることを見る` (→ /#system). The check never carries hero weight.

## What changed (this package)

| Area | Change |
| --- | --- |
| Homepage (`app/page.tsx`) | Hero = the frozen platform promise; understanding→support model section (`#how`, `.yr-flow` 入力→理解→支援 + learning loop); six-domains reframed as one continuous flow; CTA hierarchy; OG/meta |
| Root metadata (`app/layout.tsx`) | Site title/description lead with the AI-native accompaniment platform, not "24問チェック" / "セルフリフレクションサービス" |
| About (`app/about/page.tsx`) | Reset from defensive "テストで終わるサービスではありません" / "状態理解プラットフォーム" to the positive accompaniment proposition + the loop |
| CTA coherence | Global header + editorial pages (methodology, privacy, reports, co-design, partners) aligned to the frozen primary/secondary labels |
| Share content | Card tagline = frozen proposition; current-state marker ("今の状態"); **production-placeholder prohibition** — dev tokens (test/demo/…) resolve to a polished generic YORISOU card, never a leaked token |
| Strategy artifacts | `docs/aix5/` — VALUE_PROPOSITION_FREEZE, EXPERIENCE_ARCHITECTURE, WHOLE_APP_COHERENCE_AUDIT, DESIGN_SYSTEM_FREEZE |
| Contract | `test:aix5` — encodes the proposition, the understanding→support model, CTA hierarchy, whole-app coherence, and the share/placeholder rules |

Protected boundaries UNCHANGED: questions/answers/scoring/weighting/activation, result IDs, protected copy,
methodology & recommendation logic, privacy semantics, personas, LINE identity, auth, DB/migrations,
candidate intake, payments, consent. YRR-1 (reveal aria-hidden+inert) and RTR-1 (private save) preserved.

## Validation battery (all green)

| Gate | Result |
| --- | --- |
| `tsc --noEmit` | 0 errors |
| `eslint .` | 0 errors, 7 pre-existing warnings (baseline) |
| `next build` | success (all routes compiled) |
| Contracts | test:aix3, aix3b, aix3c, aix3d, aix3d2, aix4, **aix5** — all pass |
| Logic suites | result-reveal, state-field, depth-field, imairo-snapshot, c02, relationship-fatigue — all pass |
| Playwright | aix2-experience (24, desktop+mobile), result-reveal-a11y/YRR-1 (6), result-private-save/RTR-1 (7), yorisou-smoke — all pass |
| axe (wcag2a+aa) | 0 violations across 11 AIX-5 routes |
| gitleaks | staged clean; no secret in any changed file |

## Evidence matrix (26 items)

| # | File | Evidences | Founder concern addressed |
| --- | --- | --- | --- |
| 01 | 01-home-hero-desktop.jpg | Hero = platform promise, check as one entry, correct CTAs | #1 value prop, #2 not-a-test |
| 02 | 02-home-full-desktop.jpg | Whole homepage narrative top-to-bottom | #1, #4 |
| 03 | 03-home-understanding-support.jpg | 入力→理解→支援 model + learning loop (the mechanism) | #3 understanding→support |
| 04 | 04-home-six-domain-map.jpg | Six domains as ONE connected system | #4 one system |
| 05 | 05-home-mobile.jpg | Mobile homepage coherence | #1, #5 |
| 06 | 06-about.jpg | /about reset to accompaniment proposition + the loop | #1, #2, #3 |
| 07 | 07-methodology.jpg | Editorial coherence + CTA hierarchy | #5 coherence |
| 08 | 08-privacy.jpg | Editorial coherence + CTA hierarchy | #5 |
| 09 | 09-tests-catalogue.jpg | Check framed as entry inside the system (dark product) | #2 not-a-test |
| 10 | 10-check-in.jpg | Entry flow within the product system | #2 |
| 11 | 11-result-reveal.jpg | Result → continuing next step (YRR-1 preserved) | #3 |
| 12 | 12-result-share.jpg | Share surface aligned to proposition | #6 share |
| 13 | 13-reports.jpg | Deepen domain surface | #3, #4 |
| 14 | 14-recommendations.jpg | Discover domain — reasoned, not a marketplace | #3, #4 |
| 15 | 15-co-design.jpg | Improve/育てる domain | #4 |
| 16 | 16-partners.jpg | Separate partner pathway, coherent CTA | #4, #5 |
| 17 | 17-experiences.jpg | Connect/つながる domain | #3, #4 |
| 18 | 18-line-mini-app.jpg | LINE continuity context (light) | #5 |
| 19 | 19-saved.jpg | Keep/残す・戻る continuity | #3 accompaniment |
| 20 | 20-share-card-square.png | Real result card — proposition tagline + current-state marker | #6 share |
| 21 | 21-share-card-story.png | Story format card | #6 |
| 22 | 22-share-card-og.png | OG format card | #6 |
| 23 | 23-share-card-generic-fallback.png | Placeholder input → polished generic card, **no dev-token leak** | #6, placeholder prohibition |
| 24 | 24-share-card-en-current-state.png | EN card, current-state language | #6 |
| 25 | 25-about-mobile.jpg | /about mobile coherence | #1, #5 |
| 26 | 26-methodology-mobile.jpg | Editorial mobile coherence | #5 |

## Governance

PR #113 remains OPEN and unmerged. Production is UNCHANGED at main @ `70da80a`. No git-history rewrite,
force-push, or amend. This is a founder-review preview only — not approved for merge.
