# YORISOU — Current Product State

*(Package 20, 2026-07-15 · verified at `main` @ `334a80570b488ae6f749e1c2cdd65ce52aad89fc` · provenance labels per the context-pack standard)*

## Lifecycle

| Fact | Value | Provenance |
|---|---|---|
| Status | **PAUSED** — no active writer, no active package | registry + lock (MACHINE_VERIFIED) |
| Branch / HEAD | `main` @ `334a8057` = `origin/main` (Package 9 result-reveal squash) | MACHINE_VERIFIED |
| **Production** | **LIVE and VERIFIED** — production commit `334a8057` on Vercel (`shigeru-naganos-projects/yorisou-online`), domain **https://yorisou.online** (Package 11 reconciliation) | RELEASE_REGISTRY (MACHINE_VERIFIED) |
| Auto-deploy policy | **MAIN_MERGE_AUTO_DEPLOYS_PRODUCTION** — founder policy: merging to `main` under a package's gates IS the release authorization; any push to `main` triggers a production deploy | founder decision (level 1), RELEASE_REGISTRY |
| Remote | `origin https://github.com/MrShamann/yorisou-online.git` | MACHINE_VERIFIED |
| Working tree | clean | MACHINE_VERIFIED |

## What exists (implemented and verified, not planned)

- **Active runtime question set: the verified 120-question bank** (`data/yorisou/120q-question-bank.generated.json`, 120 entries + scoring master) — contract-tested; result taxonomy and scoring algorithm are product identity and are not casually changed.
- **AI-native result reveal on `/result`** (Package 9): staged skippable reveal as progressive enhancement over fully server-rendered summary-first content; source-type grammar (回答から/タイプ解釈/限界, AI truthfully absent where absent); honest word-based confidence; server-SVG trait constellation with non-measurement caveat; limits + privacy panels; gentle declinable actions. LINE boundary untouched.
- **Dependency posture** (YSR-1): next 16.2.10 line; OSV 38→13, zero production HIGH/CRITICAL (remainder dev-only).
- **Operations corpus** (`docs/`, 40+ versioned files): volunteer-pilot consent flows, paid-report templates/workflows/quality rubrics, data-governance and non-use policies, admin tooling specs — the governing documents for consented pilot and paid-report operations.

## Founder-reported (not verifiable in this repository — labeled per standard)

- A **990-question bank** exists and is **content-complete but NOT activated**; the active runtime remains the verified 120-question set above. Activation would be a founder-authorized product change (taxonomy/scoring impact analysis required), not a content copy. (FOUNDER_REPORTED)

## Known limitations / open items

- **YRR-1 — DEFERRED_BY_FOUNDER, non-blocking, NOT fixed:** transient `aria-hidden-focus` on `/result` during the staged-reveal window (steady state clean). Package 12 was CANCELED_BEFORE_EXECUTION; revisit triggers recorded in `reports/PACKAGE_12_CANCELLATION_RECORD.md` (AI-Workspace). Do not classify as fixed.
- Historical branch `governance/v0.4.0-activation` disposition still open (founder).
- Dev-tooling OSV HIGHs (dev-only: flatted/minimatch/picomatch) queued as P3 refresh.
