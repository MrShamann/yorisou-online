# PPR-1 Completion Phase 1 — close pre-activation prerequisites

> **Founder authorization:** `YORISOU_PPR_1_COMPLETION_PHASE_1_AUTHORIZED`.
> One bounded PR closing repository-side prerequisites for the dormant DCI + Yorisou Values private
> Production pilot. **This package does not authorize activation.** No Production mutation, no
> migration-history repair, no flag set, no Founder/Admin acceptance.

- **Starting main:** `7c37ca1e21e27690027cb3ee04b90e52a264abdc`
- **Branch:** `feat/ppr-1-completion-phase-1`
- **Prior accepted state:** `YORISOU_PPR_1R_NOT_READY`

**Preflight note (not caused by this package):** `main` is unchanged at `7c37ca1` and the PPR-1 private-pilot
gate is intact. The prompt's expected protected-PR heads are stale: unrelated 2026-07-24/25 sessions merged
PR #114 into PR #113's branch (`feat/aix-1-ai-native-experience`, merge commit `06e4190`) and advanced PR
#113's head to `06e4190`. This package does not touch PR #113 or PR #114 and has no material conflict (main
and this package's scope are unaffected).

## WS-A — DCI full-stack timezone TEST-ONLY defect fixed (`DCI_DATE_FAILURE_TEST_ONLY_CLOSED`)

**Root cause (test-only, not runtime):** `app/tests/daily-check-in/DailyCheckInFlow.tsx` derives one browser
timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`) and uses it for **both** create and history
read. The authenticated full-stack test created through the UI in that browser timezone (UTC on CI) but read
history with a **hardcoded `Asia/Tokyo`**, so `entryLocalDate` (UTC date) and `history.today` (JST date) were
computed in different zones and diverged by one calendar day across the 15:00–24:00 UTC (00:00–09:00 JST)
window. The product runtime is timezone-consistent; this was purely a test inconsistency.

**Fix:** `tests/smoke/daily-check-in-fullstack.spec.ts` now reads history in the **same browser timezone** it
created in (`page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone …)`), so create tz == read
tz. The explicit `Pacific/*` and `Asia/Tokyo` API-contract timezone tests (where the timezone is intentionally
the subject) are **retained unchanged**.

**Regression (wall-clock independent):** `lib/yorisou/methods/daily-check-in/__tests__/dailyCheckIn.test.ts`
adds a check proving, at fixed boundary instants (`15:30Z`, `23:59:30Z`, `02:00Z`) across four zones (UTC,
Asia/Tokyo, Pacific/Kiritimati, Pacific/Honolulu), that `entryLocalDate === today` for a single timezone, and
documenting that cross-zone comparison diverges by one day (the old defect). DCI unit contract: **46 checks**.

**No runtime date code changed:** `DailyCheckInFlow.tsx`, `browserTimezone()`, `serverTimeIdentity()`,
`localDateForInstant()`, the DCI API, record identity, correction window, migration SQL, and DCI canonical
content are all untouched. Proof: `git diff main -- app lib/yorisou/methods/daily-check-in/runtimeDefinition.ts
lib/yorisou/method-runtime/recordedState.ts supabase/migrations` contains no date-logic change (only test files
+ governance + docs change in this package).

## WS-B — Governed private-pilot schema authority (GOVERNED-DOCUMENT amendment)

Change class **GOVERNED-DOCUMENT** (Change Management §3). Amended
`resources/governance/current/annex/PRODUCTION_DATA_MODEL_AUTHORITY.md` **v1.0 → v1.1**, adding the section
*Bounded Private Method-State Pilot Schema Authority* for the six existing dormant DCI/YV tables
(`yorisou_daily_state_records`/`_record_versions`/`_history_events`,
`yorisou_values_assessments`/`_assessment_versions`/`_assessment_events`). It states: domain status (bounded
private pilot; not public activation; not catalog/nav/sitemap; not a memory subsystem); **no reinterpretation**
(not memory_candidate/confirmed_memory/consent/companion memory; no reinterpretation of existing user data);
identity/access (account-scoped, RLS mandatory, public/anon/authenticated direct access prohibited,
service_role server-path reads only, cross-account prohibited, anonymous scoring/persistence prohibited in
Production); mutation model (SECURITY DEFINER RPCs only, append-only history, deletion erases private content
leaving only a content-free tombstone); pilot boundary (Founder/Admin-only after a separate activation
decision; this annex sets no flag and authorizes no release/acceptance; public activation closed); and the
existing-Production truth (tables already dormant, RLS-enabled, 0 rows at PPR-1R, migration-history
reconciliation incomplete and separately governed). **The core 18-entity model is unchanged.**

- **Pack version:** v0.4.0 → **v0.4.1** (README/RESOURCE_MANIFEST titles, `governance-checksums.json`
  packageVersion + provenance, `governanceResources.ts` metadata literals, `governanceActivation.test.ts`
  packageVersion assertion). No filenames renamed.
- **Archive:** prior v1.0 annex preserved byte-for-byte at
  `resources/governance/archive/annex-production-data-model-authority/v1.0/` (sha256 `c0a3abfe…`) + ARCHIVE_NOTE.
- **Regenerated:** `SHA256SUMS.txt` (33 lines, self-check clean) and `governance-checksums.json` (34 entries) —
  only the 4 changed files' hashes differ (README, RESOURCE_MANIFEST, annex/PDMA, SHA256SUMS.txt).
- **Integrity gate:** `npm run test:agent-runtime` → status ok; 34 files; positive fixture + **24 tamper
  negatives** pass; activation (loader 34 / checksums 34 / SHA256SUMS 33 / annexes 4) green; Founder/agent
  authority + Package A/B–G/production-release invariants intact.
- **Change record:** `resources/governance/evidence/governed-document-amendment/2026-07-26/PPR1_COMPLETION_PDMA_AMENDMENT.md`.

## WS-C — Migration-history reconciliation: FUTURE repair PLAN ONLY (not executed)

The two DCI/YV migrations were historically applied to Production by direct managed SQL execution, so the
schema objects exist but the versions are **not recorded** in `supabase_migrations.schema_migrations`. This
package **prepares** the official repair procedure and **executes nothing**.

### Files (unchanged; applied historically)

| # | file | sha256 |
|---|---|---|
| 1 | `supabase/migrations/202607200005_dci1_daily_state_records.sql` | `fb130d49e2417f04377ec055a942a0602716bd112dddcda9a2162976593908b0` |
| 2 | `supabase/migrations/202607210001_yv1_values_assessments.sql` | `1f76f01e050a9c19eb156a45c556f943ae9f9b76e1fc3fa9658723b8051f004f` |

### Hard target guard (MUST pass before any command)

Linked project **must** be `yorisou-production` ref **`krxizslnksorwhepyijs`**. **Reject and stop** on
`nbltsbonsnbpfptihomc` (Preview), any Mirai Move project, any KAKARI project, any unknown project, or any local
Supabase project.

### Pre-repair verification (all read-only; a future authorized package must confirm)

1. `supabase link` target = project name `yorisou-production`, ref `krxizslnksorwhepyijs`.
2. Both migration file checksums equal the table above.
3. All six DCI/YV tables exist.
4. Expected RPCs (`yorisou_daily_record_create/correct/delete`, `yorisou_daily_tombstone_purge_expired`,
   `yorisou_values_assessment_create/correct/set_confirmation/delete`, `yorisou_values_tombstone_purge_expired`)
   and append-only triggers exist and are enabled.
5. RLS enabled on all six tables.
6. Grants = `service_role` SELECT only (no anon/authenticated/PUBLIC).
7. No unexpected user policy (0 policies).
8. Versions `202607200005` and `202607210001` are currently **absent** from `schema_migrations`.
9. No unrelated missing migration would be silently repaired (inspect the full `migration list` diff first).
10. Record a read-only schema snapshot and the `migration list` output **before** repair.

### Official repair commands (future authorized package only — DO NOT RUN HERE)

```bash
# 0. Confirm the linked target is krxizslnksorwhepyijs (hard guard) — abort otherwise.
supabase migration list --linked

# 1. Mark the two versions applied — in exact timestamp order. Repair updates migration-history
#    METADATA ONLY; it executes NO schema SQL and alters NO table rows.
supabase migration repair 202607200005 --status applied --linked
supabase migration repair 202607210001 --status applied --linked

# 2. Re-list to confirm both versions now recorded, in order.
supabase migration list --linked

# 3. Dry-run ONLY — must report no pending changes for the DCI/YV objects. Any unexpected
#    dry-run output is a BLOCKER (do not push).
supabase db push --dry-run
```

### Rules the future package must honor

- Use the **official** `supabase migration repair` command. Do **not** hand-write `INSERT`/`UPDATE` against
  `supabase_migrations.schema_migrations`. Do **not** rerun the migration SQL (objects already exist).
- Repair changes migration-tracking metadata only; it must not execute schema SQL or alter table rows.
- Repair in exact timestamp order (`202607200005` then `202607210001`).
- `db push` stays **dry-run** during verification; unexpected dry-run output is a blocker.
- Any unrelated migration-history discrepancy requires separate Founder review, not silent repair.

## Repository scope (this package)

Changed files are limited to: the DCI full-stack test + DCI unit test; the amended annex + pack-version
identity fields (README, RESOURCE_MANIFEST) + regenerated SHA256SUMS + runtime governance-checksums.json /
governanceResources.ts / governanceActivation.test.ts; the governance archive + amendment evidence; and this
evidence doc. **No DCI/YV runtime code, private-pilot gate, Production API authorization, migration SQL,
public navigation/homepage/catalog/sitemap, method-registry activation, authentication, shared-store, Vercel
or Supabase configuration was modified.**

## Security — gitleaks false-positive on a governance checksum (corrected, not weakened)

The CPV1-CM0 hard secret-scan gate (`gitleaks detect … origin/main..HEAD`) initially failed with one
finding: rule `generic-api-key` matched the **SHA-256 checksum** of the amended annex in
`lib/server/agent-runtime/governance-checksums.json` — the entry key
`annex/PRODUCTION_DATA_MODEL_AUTHORITY.md` contains the substring "**AUTH**ORITY" (an `auth` keyword) and
the new digest's entropy crossed gitleaks' threshold. It is a public-document checksum, not a secret (the
prior digest happened to fall below the threshold, which is why `main` passed). The repo had no gitleaks
config, so a minimal `.gitleaks.toml` was added that **`[extend] useDefault = true`** (keeps every default
rule) and allowlists **only** the two governance integrity checksum manifests
(`governance-checksums.json`, `SHA256SUMS.txt`). Verified locally with gitleaks v8.18.4: the diff scan now
reports **no leaks**, and default rules remain active (a private-key probe is still flagged). This does not
weaken secret detection anywhere else in the tree.

## Validation

_(Local validation, remote CI, and the read-only Production non-mutation check are recorded below as they
complete.)_

### Local (this branch)

tsc clean · eslint 0 errors · `next build` success · DCI **46** · YV **27** · CPV1 **62** · production-pilot
**12** · shared-store **15** · DCI canonical generator in-sync · governance integrity gate
(`test:agent-runtime`) ok (34 files, positive + 24 tamper-negatives, activation loader 34 / checksums 34 /
SHA256SUMS 33 / annexes 4) · changed-content secret scan (gitleaks v8.18.4, extended default rules) **clean**
· no Production ref in executable product code (the target ref appears only in this WS-C repair plan).
