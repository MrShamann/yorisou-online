# Production Migration Lineage Reconciliation

> **Founder authorization:** `YORISOU_MIGRATION_LINEAGE_RECONCILIATION_AUTHORIZED`.
> Repository-only root-cause correction. **No Production mutation, no migration-history repair, no
> private-pilot activation.** One bounded PR (`feat/migration-lineage-reconciliation → main`), Founder merge.

- **Starting main:** `8b2b23ffca217ad774f2e6b1fa5ee7959c832f7d`
- **Prior accepted state:** `YORISOU_PPR_1_FINAL_COMPLETION_BLOCKED` (blocked on this exact drift).

## Root cause

The Supabase CLI compares the timestamps of files in `supabase/migrations/` against the remote
`supabase_migrations.schema_migrations` history. Four CPV1 migrations that explicitly declare **"LOCAL
Supabase verification only — never production"** were nonetheless stored in that canonical Production
directory. As a result, Production `migration list` / `db push --dry-run` perpetually reported them as
pending Production migrations — conflating a repository-organization error with a genuine Production
migration-history gap.

## The nine-version discrepancy

Remote `schema_migrations` records **7** versions (through `202607110003`). The repository's Production
directory held **16**. The 9 local-not-remote versions classify as follows (Production object state verified
read-only via the Supabase Management API against `yorisou-production` `krxizslnksorwhepyijs`; no private row
content inspected):

| # | version / name | introduced | declared scope | Production object state | remote history | classification | corrective action |
|---|---|---|---|---|---|---|---|
| 1 | `202607120001` relationship_fatigue_results | #105 | Production (no local-only marker) | `yorisou_test_results` present; `RELATIONSHIP-FATIGUE` admitted by `test_id` CHECK | absent | **APPLIED_AND_UNTRACKED** | future history repair |
| 2 | `202607160001` imairo_public_result_snapshot | #111 | Production | `snapshot_context` column present; `test_id` CHECK admits `C02/F01/F02/RELATIONSHIP-FATIGUE/IMAIRO-120Q` | absent | **APPLIED_AND_UNTRACKED** | future history repair |
| 3 | `202607160002` candidate_intake_foundation | #112 | Production | all four `yorisou_candidate_{organizations,offerings,submissions,events}` present | absent | **APPLIED_AND_UNTRACKED** | future history repair |
| 4 | `202607200001` cpv1_foundation_prereqs | #115 | **LOCAL_ONLY** ("never production") | **absent** (`yorisou_cpv1_current_account_id()` / `yorisou_cpv1_block_mutation()` not present) | n/a | **LOCAL_ONLY_NOT_IN_PRODUCTION_LINEAGE** | move out of `supabase/migrations/` |
| 5 | `202607200002` cpv1_understanding_history_consent | #115 | **LOCAL_ONLY** | **absent** (`yorisou_cpv1_method_registry_snapshot`/`_observations`/`_method_consent`/`_history_events` not present; 0 `yorisou_cpv1%` tables) | n/a | **LOCAL_ONLY_NOT_IN_PRODUCTION_LINEAGE** | move out |
| 6 | `202607200003` cpv1r1_relations_permissions_datarights | #115 | **LOCAL_ONLY** | **absent** | n/a | **LOCAL_ONLY_NOT_IN_PRODUCTION_LINEAGE** | move out |
| 7 | `202607200004` cpv1r1_datarights_reason_codes | #115 | **LOCAL_ONLY** | **absent** | n/a | **LOCAL_ONLY_NOT_IN_PRODUCTION_LINEAGE** | move out |
| 8 | `202607200005` dci1_daily_state_records | #118 | Production | 3 DCI tables present, RLS-on, 0 policies, SECURITY DEFINER RPCs, append-only triggers, 0 rows | absent | **APPLIED_AND_UNTRACKED** | future history repair |
| 9 | `202607210001` yv1_values_assessments | #119 | Production | 3 YV tables present, RLS-on, 0 policies, SECURITY DEFINER RPCs, append-only triggers, 0 rows | absent | **APPLIED_AND_UNTRACKED** | future history repair |

The seven versions already present in remote history (`202607100001`–`202607110003`) are
`PRODUCTION_LINEAGE`, tracked, and require no action.

**No `UNAUTHORIZED_PRODUCTION_OBJECT_PRESENT` finding:** none of the four local-only CPV1 migrations' objects
exist in Production (`yorisou_cpv1%` table count = 0). They were never applied there.

> **Scope-marker precision.** DCI (`202607200005`) and YV (`202607210001`) mention "disposable local
> databases only" in their **rollback-classification** note, but neither declares "never production", and
> both **were** applied to Production in PPR-1 (Founder Option 4). The historical in-file comment on DCI
> ("never been applied to any hosted or shared environment") predates that application and is now stale; per
> the immutability rule the SQL bytes are **not** edited — this manifest/evidence carries the correction.

## Repository correction performed (this PR)

1. **Moved** the four `LOCAL_ONLY` CPV1 migrations from `supabase/migrations/` to
   `supabase/local-only-migrations/cpv1/` via `git mv` (byte-identical; checksums unchanged). Their SQL was
   **not** modified and they are **not** marked applied in any Production history.
2. **Updated every active-execution-path reference** to the new location:
   - `scripts/validate-cpv1-migrations.mjs` (`DIR` → relocated directory)
   - `lib/cpv1/__tests__/cpv1Contract.test.ts` (reads the two prereq/table files)
   - `.github/workflows/dci-1-ci.yml` (full-stack harness applies the CPV1 prereq before the DCI migration)
   - `tests/daily-check-in/postgres-integration.sh`, `tests/daily-check-in/fullstack-local.sh`
   - The YV harness needs no change (its migration is self-contained); `scripts/yorisou-local-db.mjs`
     already prohibits replaying `supabase/migrations`. Historical CM0 evidence docs
     (`docs/cpv1/evidence/cm0/*`) retain the original paths intentionally (historical records, not active
     execution paths).
3. **Added a permanent migration-scope guard**: `supabase/MIGRATION_SCOPE_MANIFEST.md` (machine-readable
   classification of all 16 migrations + checksums) enforced by `scripts/validate-migration-scope.mjs` via a
   dedicated `Migration Scope Guard` CI workflow. It fails on: local-only files under `supabase/migrations/`,
   unclassified/missing files, checksum drift, duplicate timestamps, scope↔directory disagreement, and strong
   local-only marker phrases in the Production directory.
4. **Production migration SQL kept immutable.** Recorded checksums (unchanged by this PR):

   | version | sha256 |
   |---|---|
   | 202607120001 | `ed0737e4c0246862f2d77220742128a853c118c6b93e1a763b12fd3a37a27e93` |
   | 202607160001 | `e2976dfcdd7f91271848f573b7de7f3d590b7b1b5650ddd8a7c158e9ee948f78` |
   | 202607160002 | `70ab2c28d77aaefac4d1c9563b95786c32b422e6167f35702a4793680eec3d7c` |
   | 202607200005 | `fb130d49e2417f04377ec055a942a0602716bd112dddcda9a2162976593908b0` |
   | 202607210001 | `1f76f01e050a9c19eb156a45c556f943ae9f9b76e1fc3fa9658723b8051f004f` |

## Expected post-merge Production migration list

After this correction merges, a Production `migration list` / `db push --dry-run` (run in a
connectivity-capable, separately-authorized package) will **no longer** propose the four local-only CPV1
versions (they are no longer in `supabase/migrations/`). The only remaining discrepancies will be the five
genuinely applied-but-untracked Production versions.

## Future Production repair cohort (prepared here; executed by a separate authorized package)

Repair **only** the five `APPLIED_AND_UNTRACKED` `PRODUCTION_LINEAGE` versions (mark applied):

`202607120001`, `202607160001`, `202607160002`, `202607200005`, `202607210001`

**Never** repair or apply the four `LOCAL_ONLY` CPV1 versions (`202607200001`–`202607200004`).

A future repair should still, per-version, confirm the object state at repair time and repair in exact
timestamp order.

## No Production mutation (this package)

Repository-only. All Supabase access this package was read-only (Management API SELECT). Verified at
authorship: `schema_migrations` unchanged (7 rows; the two DCI/YV versions still absent); schema fingerprint
`85c4641766220adbdd9580a6de5bcd6a` unchanged; DCI/YV row counts 0; Production root 200, DCI/YV routes 404
(pilot flag absent). No flag, env, Vercel, Auth, Storage, schema, or data change; the CLI was never linked.
No unresolved ambiguities.
