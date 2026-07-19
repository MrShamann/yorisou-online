# APP-1 — Full Service + Installable Desktop PWA (Founder review evidence)

**Package:** APP-1 · **PR:** #113 (OPEN, unmerged) · **Feature branch:** `feat/aix-1-ai-native-experience`
**Baseline:** production main @ `70da80a` (UNCHANGED — no merge / deploy / migration / prod secrets)
**Status:** `APP_1_VERIFIED_PARTIAL_NOT_DESKTOP_READY` — the **installable desktop PWA (WS-H)** is built
and verified; the remaining service workstreams (nine-family reports + the Supabase-backed
operations) are documented, not claimed.

## Environment reality (§5)
The Supabase CLI is authenticated, but the **only YORISOU Supabase project is `yorisou-production`**,
which §5/§19 forbid touching (no production data/secrets/migration). **No isolated non-production
YORISOU project exists** (Option A unavailable); the other projects are different products
(mirai-move/kakari — no cross-contamination). Docker + Colima are absent (Homebrew present). So the
Supabase-backed workstreams (guest-to-account/LINE E2E, Founder dashboard/queues/access-logging) have
no isolated backend to build+verify against without either creating a **billable hosted project** on
the founder's account (a consequential external action deferred to explicit founder authorization) or a
**heavyweight Colima install**. The PWA + offline + install work is entirely backend-independent and
was completed here.

## Completed + verified — WS-H: installable YORISOU desktop PWA
- **Web App Manifest** (`public/manifest.webmanifest`): name **YORISOU**, short name よりそう, `display:
  standalone`, `start_url`/`scope: /`, theme+background `#0c0e0d`, 4 icons (192/512 + maskable), app
  shortcuts. Served as `application/manifest+json`.
- **Real brand-derived icons** (`public/icons/`): 192, 512, maskable 192/512, apple-touch 180, favicon
  32/16 — rendered from the approved **YORISOU nestle mark** (`BrandMark.tsx`) on the brand dark ground.
  **Not placeholders** (verified: PNG magic + byte size).
- **Service worker** (`public/sw.js`): offline-safe **public** shell only; **NEVER** caches `/api`,
  `/admin`, `/dashboard`, `/private-state`, `/saved`, auth, `/line/`, credentialed requests, or
  navigation HTML (privacy boundary §13). Navigation → network-first with a precached **public offline
  page** fallback; static assets cache-first. **User-controlled update** — never auto-`skipWaiting`
  (waits for the user; does not interrupt an active 120Q).
- **Install UX** (`PwaController.tsx`): standalone-aware (no CTA when already installed), small +
  dismissible, honest copy (optional, standalone window, device-local data stays local, removable).
- **Update UX**: calm banner, suppressed during an active 120Q, reload only after the user accepts.
  (Fixed a real bug found via testing: the initial SW `clients.claim()` must not trigger a reload.)
- **Offline recovery** (`app/offline/page.tsx`): public-safe, carries no server/private data.
- **macOS acceptance doc** (`docs/app1/MACOS_DESKTOP_INSTALLATION_AND_ACCEPTANCE.md`): exact install /
  standalone / Dock / persistence / uninstall / troubleshooting steps; honest about what is/is not
  delivered (no native binary / App Store / "already installed" claim).

## Validation (@ this commit)
tsc 0 · eslint 0 errors · `next build` ok · contracts aix3/4/5 + sr1 + sr2 + **app1** + logic suites ·
Playwright **APP-1 PWA 6/6** (installability, SW register/activate, real icons, standalone-reopen
continuity, offline recovery + privacy, user-controlled update) + aix2 smoke 12/12 + SR-1 stranger
16/16 + SR-2 4/4 + YRR-1 6/6 + RTR-1 7/7 (no regression) · **axe wcag2a+aa 0 violations** on /offline,
/, /my-yorisou · gitleaks staged clean.

## 20-scenario acceptance matrix (honest)
| # | Scenario | Status |
|---|---|---|
| 1,2,3,5,7,9,10,12 | anonymous stranger journey (entry/quick/120Q/result+plan/save/hub/recommendation-fallback/return/unsupported-browser) | ✅ verified (SR-1) |
| 4 | focused flow → support plan + save | ✅ verified (SR-2) |
| 6 | anonymous save | ✅ verified (SR-1/SR-2, all 9 families) |
| 8 | deeper report | ⚠️ imairo report is real+free; **9-family shared report architecture (WS-A) not built** this session |
| 11 | feedback | ✅ device-local verified; server queue/dashboard (WS-E/F) not built |
| 13 | 120Q interrupted resume | ✅ verified (SR-2) |
| 14 | guest-to-account migration retry (WS-B) | ⛔ needs isolated Supabase (unavailable) |
| 15 | adaptation (WS-D) | ⚠️ signals stored (SR-1); explainable reprioritization not built this session |
| 16 | Founder incident review (WS-E/F/G) | ⛔ needs isolated Supabase (unavailable) |
| **17** | **PWA installability** (manifest valid, SW active, standalone criteria, real icons) | ✅ **verified** |
| **18** | **standalone reopen** (guest continuity survives reopen) | ✅ **verified** |
| **19** | **offline recovery** (public shell, no private cache leak) | ✅ **verified** |
| **20** | **update preservation** (user-controlled, does not erase guest state / interrupt 120Q) | ✅ **verified** |

## Remaining (documented, not claimed)
- **WS-A** nine-family deeper reports — shared architecture + approved content (content-scale; backend-independent; unblocked follow-up).
- **WS-B/C/E/F/G + migrations/RLS/grants** — require an **isolated non-production Supabase** that does not exist for YORISOU here; creating one (billable, on the founder's account) or a Colima local stack are the options, both deferred. Application-side code + reversible migrations + deterministic/signed-callback/idempotency contracts are the buildable-without-live-DB parts.
- **WS-D** explainable adaptation — deterministic device-local reprioritization (unblocked follow-up).

Because §21 requires ALL workstreams + all 20 scenarios for `PREVIEW_READY`, and material application
work remains, the honest status is **`APP_1_VERIFIED_PARTIAL_NOT_DESKTOP_READY`**. The installable PWA
mechanism itself is complete and verified; the full service chain is not.

## Evidence index
01 — PWA app icon 512 (brand mark). 02 — maskable icon 512. 03 — offline recovery page.

## Governance
PR #113 OPEN and unmerged. Production UNCHANGED at main @ `70da80a`. No history rewrite/force-push/amend.
No Electron/Tauri, no native/App Store claim. **The Founder's final browser Install click is still
required** to install the app on the desktop. Codex not involved. Preview only.
