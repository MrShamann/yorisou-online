# SR-1 — Stranger-Ready End-to-End Service (Founder review evidence)

**Package:** SR-1 · **PR:** #113 (OPEN, unmerged) · **Feature branch:** `feat/aix-1-ai-native-experience` @ `fae0040`
**Baseline:** production main @ `70da80a` (UNCHANGED — no merge / deploy / migration / prod secrets)
**Status:** `VERIFIED_PARTIAL` — the anonymous-first, device-local stranger spine is built and
verified; the server-backed journeys that require production provisioning (§25-prohibited) are
documented as concrete external blockers, not claimed complete.

## What SR-1 delivers (built + verified)
A first-time visitor can now enter YORISOU and receive a coherent, useful, personalized service
**without login, on this device**:
- **Service router `/start`** — begins from ordinary needs (not test names) → a real destination
  with why / time / what-you-receive / data-stays-on-device / login-optional + alternatives.
  Homepage hero + global header route here. Deterministic (`lib/sr1/serviceRouter.ts`).
- **Guest journey continuity** (`lib/sr1/guestJourney.ts`) — public-safe device-local state (no
  raw answers/PII). Wires the previously **dead** anonymous device-local save onto `/result`, so
  `/saved` and `/my-yorisou` are truthfully populated (the old false promise is now true).
- **Personal Support Home `/my-yorisou`** — the continuing centre: current state · what matters
  now · one suggested next step · continue · saved & tried · return & control. Honest empty state.
- **Personalized Support Plan** (`lib/sr1/supportPlan.ts`) — deterministic, public-safe, complete
  for all 9 result families (interpretation + primary + prioritized next + save/return + feedback).
  Rendered on `/result`; reused by the hub. No family can dead-end.
- **Guided experiences** (`/experiences/guided/[slug]`) — 3 anonymous, completable, device-local
  reflection experiences (start → complete → reflect → feedback → save/return; honest boundary).
- **Recovery system** — `/recommendations` no-result first-visit block, `/private-state` 401 →
  honest login recovery (not a misleading transient error).
- **Truthfulness fixes** — removed the fabricated "🔒 残り12章" locked-content from `/reports/sample`
  (§30); deleted dead code (`yorisouTests`, `LocalResultSave`, `LocalFeedbackConsent`).

A real React #185 infinite-render bug (unstable `useSyncExternalStore` snapshot) was found via
browser verification and fixed.

## Validation (all green @ `fae0040`)
tsc 0 · eslint 0 errors (7 pre-existing warnings) · `next build` ok · contracts test:aix3/3b/3c/
3d/3d2/4/5 + **test:sr1** + logic suites (result-reveal / state-field / depth-field /
imairo-snapshot / c02 / relationship-fatigue) · Playwright: full smoke incl. **SR-1 stranger
16/16 (desktop+mobile)**, YRR-1 6/6, RTR-1 7/7 preserved · **axe wcag2a+aa 0 violations** on 9
SR-1 routes · gitleaks staged clean. YRR-1 + RTR-1 intact.

## Stranger Acceptance Scenarios (§27) — honest status
| # | Scenario | Status | Evidence |
|---|---|---|---|
| 1 | Zero-context mobile visitor understands + routes from an ordinary need (no login) | ✅ verified | 01,02,03,04,15 + spec S1 |
| 2 | Refuses the full test → completable guided experience | ✅ verified | 09,10,11 + spec S2 |
| 3 | Full 120Q → result → support plan → save → explore/share | ✅ core verified (device-local); recommendation-graph sub-step is env-gated but a working device-local alternative exists | 05,06,07 + spec S3 |
| 4 | Focused-concern visitor → relevant support plan + guided experience + feedback | ⚠️ partial — the plan model + guided experiences cover all families and surface via `/my-yorisou`; `SupportPlanView` is wired on imairo `/result` but **not yet on the 5 focused-flow result surfaces** (unblocked follow-up) | coverage matrix + test:sr1 |
| 5 | Anonymous return → saved state → resume → clear | ✅ verified | 07,08 + spec S3 (return+clear) |
| 6 | Guest upgrades to account / LINE, keeps result | ⛔ **blocked (§25)** — requires provisioned account/LINE backend (Supabase/S3/LINE); recovery states + RTR-1 pending-save bridge are in place | audit §E |
| 7 | Recommendation unavailable → safe alternative, no dead end | ✅ verified | 12 + spec S7 |
| 8 | Network/API failure recovery | ⚠️ partial — recovery UI verified (401 → recovery block); real-backend failure E2E needs the backend | 13 + spec + audit §E |
| 9 | Shared-result visitor sees no private data | ✅ verified | spec S9 |
| 10 | Accessibility (keyboard, reduced motion, contrast) | ✅ verified | spec S10 + axe 0 |
| 11 | Founder operations (aggregate funnel, coverage gaps, feedback queue) | ⚠️ partial — real observability surfaces already exist; two PII access-logging fixes + a coverage/dead-end view are **documented, not built** (touch sensitive admin code + need the DB to verify) | audit §B/§E |
| 12 | Unsupported browser (no WebGL / no JS) | ✅ verified | 15 + spec S12 |

**8 of 12 fully verified; 3 blocked by the §25 production-provisioning prohibition (6, and the
real-backend halves of 8/11); 1 unblocked-but-incomplete (4 — focused-flow result-surface wiring)
+ the admin readiness surface.** Because the no-partial gate (§32) requires all 12, the truthful
status is **VERIFIED_PARTIAL**. SR-1 does NOT claim full Stranger-Ready.

## Evidence index (16 shots)
01 home hero (CTA→/start) · 02 /start needs · 03 /start pace · 04 /start destination card ·
05 /result support plan · 06 /result plan actions (device-local save) · 07 /my-yorisou populated ·
08 /my-yorisou empty · 09 guided intro · 10 guided step · 11 guided done (feedback) ·
12 /recommendations first-visit recovery · 13 /private-state 401 login recovery ·
14 /reports/sample (no fabricated lock) · 15 /start mobile · 16 /my-yorisou mobile.

## Remaining (documented, not claimed)
- **Env provisioning (blocks 6/8/11 real-backend E2E):** Supabase, shared-S3 store, Resend, LINE
  channels, LLM key, explicit `YORISOU_ADMIN_EMAILS` — a separate launch-environment task (§25
  forbids SR-1 from provisioning them).
- **Unblocked follow-ups:** wire `SupportPlanView` onto the 5 focused-flow result surfaces (S4);
  C02/F01/F02 anonymous device-local save parity; the admin service-readiness view + the two PII
  access-logging fixes (§23); 120Q in-progress persistence/resume; per-result relationship-fatigue/
  love-distance reports (or relabel as samples).

## Governance
PR #113 remains OPEN and unmerged. Production is UNCHANGED at main @ `70da80a`. No git-history
rewrite/force-push/amend. Codex not involved. Preview only — not approved for merge.
