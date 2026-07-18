# AIX-3D-1 — Launch Surface Completion (Pass 1 of the split AIX-3D)

Founder-review evidence for **AIX-3D-1**, the first fully-validated pass of the
AIX-3D launch-surface work. Per the founder decision, AIX-3D was split into:

- **AIX-3D-1 (this pass):** LINE continuity + editorial/trust reskin + English
  Option B + `/insights` consolidation — implemented, fully validated, evidenced.
- **AIX-3D-2 (documented follow-up):** per-test-flow reskins for every
  catalogued/obsolete `/tests/*` route, the full 34-route crawl, and the 34-shot
  evidence set.

**Status:** `VERIFIED_PARTIAL` — 3D-1 is complete and green; 3D-2 remains.
Production is untouched (`main` @ `70da80a`); PR #113 stays open and unmerged.

Feature commit: `feat/aix-1-ai-native-experience` (AIX-3D-1).

## Shots

| # | File | Route | What it shows |
|---|------|-------|---------------|
| 01 | `01-line-mini-app.jpg` | `/line/mini-app` (mobile) | Part A — shared BrandLockup (nestle mark, no crane), "LINEで続ける" continuity badge, links back into 残す・戻る (`/saved`, `/reports`), honest roadmap line (no 準備中), AA-contrast labels |
| 02 | `02-support.jpg` | `/support` | Part B — access helper on the shared editorial shell (header/footer/brand), reset + login/register/founder-entry preserved |
| 03 | `03-privacy.jpg` | `/privacy` | Part B — privacy on EditorialShell (storage/consent meaning preserved) |
| 04 | `04-terms.jpg` | `/terms` | Part B — 13 legal sections preserved verbatim on EditorialShell |
| 05 | `05-company.jpg` | `/company` | Part B — legal company disclosure on EditorialShell |
| 06 | `06-contact.jpg` | `/contact` | Part B — contact + topic separation on EditorialShell (ContactForm preserved) |
| 07 | `07-reset-password.jpg` | `/reset-password` | Part B — token flow wrapped in EditorialShell (PasswordResetForm preserved) |
| 08 | `08-en.jpg` | `/en` | Part D — English Option B overview; **light editorial header** (fixes the prior dark-header-over-light-EN mismatch); honest Japanese-first framing |
| 09 | `09-en-about.jpg` | `/en/about` | Part D — English About on EditorialShell |
| 10 | `10-en-contact.jpg` | `/en/contact` | Part D — English Contact on EditorialShell (ContactForm `locale="en"`) |
| 11 | `11-en-privacy.jpg` | `/en/privacy` | Part D — new English privacy summary → authoritative JA policy |
| 12 | `12-en-legal.jpg` | `/en/legal` | Part D — English legal index routing to the authoritative JA terms + privacy |
| 13 | `13-en-partners.jpg` | `/en/partners` | Part D — English partners overview (no pay-to-rank, no fabricated partners) |
| 14 | `14-en-support.jpg` | `/en/support` | Part B/D — English support on the shared editorial shell |

`/insights` and `/en/insights` are consolidations (redirect to `/tests` and `/en`
respectively) and are verified by contract + a live `307` redirect, not by a shot.

## Validation (all green on the committed build)

- `tsc --noEmit` — 0 errors
- `eslint` — 0 errors (7 pre-existing warnings in untouched files)
- `next build` — success, all routes present
- Contracts — `test:aix3`, `test:aix3b`, `test:aix3c`, **`test:aix3d` (new)** + logic
  suites (`result-reveal`, `state-field`, `depth-field`, `imairo-snapshot`, `c02`,
  `relationship-fatigue`) — all pass
- Playwright `aix2-experience` smoke — **24/24** (JA home / entry / 120Q flow /
  result reveal / depth signature / 診断 policy / no-leak preserved)
- axe-core (wcag2a + wcag2aa) — **0 serious/critical** across all 14 routes above
- gitleaks — no leaks

## Protected boundaries (unchanged)

Question bank/activation, scoring, taxonomy, personas, protected result/report copy,
methodology, result IDs, LINE identity/linking, auth, DB/migrations, candidate intake,
recommendation ranking, payments, consent. YRR-1 (reveal inert/aria) and RTR-1
(private save) preserved. No fabricated users/products/orders/suppliers/testimonials.
No new external LINE integration. No secrets exposed.
