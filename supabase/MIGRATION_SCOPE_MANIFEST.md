# Migration Scope Manifest

**Authoritative, machine-readable classification of every YORISOU migration by execution scope.**

This manifest is the single source of truth for which migrations belong to the Production migration
lineage and which are local/disposable-only. It is enforced in CI by
[`scripts/validate-migration-scope.mjs`](../scripts/validate-migration-scope.mjs).

## Scopes

- **`PRODUCTION_LINEAGE`** — a real Production migration. MUST live under `supabase/migrations/`. The
  Supabase CLI compares these timestamps against `supabase_migrations.schema_migrations`.
- **`LOCAL_ONLY`** — verified against a disposable local/test database only; **never** applied to Production
  or Preview. MUST live under `supabase/local-only-migrations/`. MUST NOT sit in `supabase/migrations/`
  (or the CLI would forever report it as a pending Production migration).
- **`PREVIEW_ONLY`** — reserved: Preview-only migration. MUST live under `supabase/preview-only-migrations/`.
  (None today.)

## Why this file exists

Four CPV1 migrations (`202607200001`–`202607200004`) explicitly declared *"LOCAL Supabase verification only
— never production"* yet were stored in the canonical `supabase/migrations/` directory. That caused
`supabase migration list` / `db push --dry-run` against Production to perpetually treat them as pending. They
were moved to `supabase/local-only-migrations/cpv1/` and this manifest + guard prevent recurrence.

## Remote-history reconciliation status (read-only, informational)

Production (`yorisou-production` `krxizslnksorwhepyijs`) `schema_migrations` currently records **7** versions
(through `202607110003`). The five `PRODUCTION_LINEAGE` migrations dated after it
(`202607120001`, `202607160001`, `202607160002`, `202607200005`, `202607210001`) are **applied-but-untracked**
(their objects exist in Production; their history rows are absent). Reconciling those history rows is a
separate, Founder-authorized Production operation — **not** part of this repository correction. The four
`LOCAL_ONLY` CPV1 versions have **no** objects in Production and must never enter that repair cohort.

## Manifest (machine-readable)

The guard parses the single fenced `json` block below. `sha256` is the digest of the file at `path`.

```json
[
  {"version":"202607100001","name":"agent_runtime_phase1","scope":"PRODUCTION_LINEAGE","path":"supabase/migrations/202607100001_agent_runtime_phase1.sql","sha256":"13bcf13a6388c7cc62d24f82cda573366a64af88d752cd2b296afdba75361b66","remote_history":"tracked","repair_cohort":false},
  {"version":"202607100002","name":"c02_private_results","scope":"PRODUCTION_LINEAGE","path":"supabase/migrations/202607100002_c02_private_results.sql","sha256":"06eec860cd65826a03fa152110cefe42adea4e65ba1620dd93bf60038adc62a3","remote_history":"tracked","repair_cohort":false},
  {"version":"202607100003","name":"shared_test_engine","scope":"PRODUCTION_LINEAGE","path":"supabase/migrations/202607100003_shared_test_engine.sql","sha256":"6b85f4d7cb44f457f8ab2f3a5e491db8e25eabba5a051186719da2352984c73d","remote_history":"tracked","repair_cohort":false},
  {"version":"202607100004","name":"line_oauth_state_replay_protection","scope":"PRODUCTION_LINEAGE","path":"supabase/migrations/202607100004_line_oauth_state_replay_protection.sql","sha256":"41e9ffd26b894702e6266244bd582860935a776e12d4ba59358a5c2aa10ff88c","remote_history":"tracked","repair_cohort":false},
  {"version":"202607110001","name":"private_ai_state_and_harness","scope":"PRODUCTION_LINEAGE","path":"supabase/migrations/202607110001_private_ai_state_and_harness.sql","sha256":"2ebbdf2175a54eee59a7f9ff6ed47af4d9c2f98df9db0c5460516c12f521d18f","remote_history":"tracked","repair_cohort":false},
  {"version":"202607110002","name":"experience_cards","scope":"PRODUCTION_LINEAGE","path":"supabase/migrations/202607110002_experience_cards.sql","sha256":"67037e127a799a3760f0337fe52e97ca71c02ab1f745ea0148b7bffbff533855","remote_history":"tracked","repair_cohort":false},
  {"version":"202607110003","name":"recommendation_graph","scope":"PRODUCTION_LINEAGE","path":"supabase/migrations/202607110003_recommendation_graph.sql","sha256":"4d2e67dd981c668fda52458a1d396cb34b65e99eadbbd07a7ab2db60f827f5d1","remote_history":"tracked","repair_cohort":false},
  {"version":"202607120001","name":"relationship_fatigue_results","scope":"PRODUCTION_LINEAGE","path":"supabase/migrations/202607120001_relationship_fatigue_results.sql","sha256":"ed0737e4c0246862f2d77220742128a853c118c6b93e1a763b12fd3a37a27e93","remote_history":"untracked","repair_cohort":true},
  {"version":"202607160001","name":"imairo_public_result_snapshot","scope":"PRODUCTION_LINEAGE","path":"supabase/migrations/202607160001_imairo_public_result_snapshot.sql","sha256":"e2976dfcdd7f91271848f573b7de7f3d590b7b1b5650ddd8a7c158e9ee948f78","remote_history":"untracked","repair_cohort":true},
  {"version":"202607160002","name":"candidate_intake_foundation","scope":"PRODUCTION_LINEAGE","path":"supabase/migrations/202607160002_candidate_intake_foundation.sql","sha256":"70ab2c28d77aaefac4d1c9563b95786c32b422e6167f35702a4793680eec3d7c","remote_history":"untracked","repair_cohort":true},
  {"version":"202607200005","name":"dci1_daily_state_records","scope":"PRODUCTION_LINEAGE","path":"supabase/migrations/202607200005_dci1_daily_state_records.sql","sha256":"fb130d49e2417f04377ec055a942a0602716bd112dddcda9a2162976593908b0","remote_history":"untracked","repair_cohort":true},
  {"version":"202607210001","name":"yv1_values_assessments","scope":"PRODUCTION_LINEAGE","path":"supabase/migrations/202607210001_yv1_values_assessments.sql","sha256":"1f76f01e050a9c19eb156a45c556f943ae9f9b76e1fc3fa9658723b8051f004f","remote_history":"untracked","repair_cohort":true},
  {"version":"202607200001","name":"cpv1_foundation_prereqs","scope":"LOCAL_ONLY","path":"supabase/local-only-migrations/cpv1/202607200001_cpv1_foundation_prereqs.sql","sha256":"2b0203b4d306ef2d5765fbc0908aaafd78c6f7c69b1e7b5b570f1fb9804e3ded","remote_history":"n/a","repair_cohort":false},
  {"version":"202607200002","name":"cpv1_understanding_history_consent","scope":"LOCAL_ONLY","path":"supabase/local-only-migrations/cpv1/202607200002_cpv1_understanding_history_consent.sql","sha256":"3f140c5909ae68cf0795000122e7b4c9193b381d0fe1005cc8a2f43b6eead76e","remote_history":"n/a","repair_cohort":false},
  {"version":"202607200003","name":"cpv1r1_relations_permissions_datarights","scope":"LOCAL_ONLY","path":"supabase/local-only-migrations/cpv1/202607200003_cpv1r1_relations_permissions_datarights.sql","sha256":"88a6c4518f2bce08912c8ede728a61241e1348960974f4a5ce5eef1f0f963ad5","remote_history":"n/a","repair_cohort":false},
  {"version":"202607270001","name":"ux2_assessment_attempt_result_response","scope":"PREVIEW_ONLY","path":"supabase/preview-only-migrations/202607270001_ux2_assessment_attempt_result_response.sql","sha256":"92634873c5a272b1acd955f7b375cc6247a38ddc0e087a128fdcf97c57c8fc63","remote_history":"preview_only","repair_cohort":false},
  {"version":"202607270002","name":"ux2_assessment_persistence_rollback","scope":"PREVIEW_ONLY","path":"supabase/preview-only-migrations/202607270002_ux2_assessment_persistence_rollback.sql","sha256":"a4a7a1d799d9bed297796b153057e93e7770cc638a20f6d65a6e46bbc615aebe","remote_history":"preview_only","repair_cohort":false},
  {"version":"202607270003","name":"ux2_lifecycle_semantics_and_erasure","scope":"PREVIEW_ONLY","path":"supabase/preview-only-migrations/202607270003_ux2_lifecycle_semantics_and_erasure.sql","sha256":"e6905524aa284bbe4d4a9f9c2f2f75bb1c7ba18ae6ae1c844c0bc20e2c64dcc7","remote_history":"preview_only","repair_cohort":false},
  {"version":"202607270004","name":"ux2_true_tombstone_and_abandon","scope":"PREVIEW_ONLY","path":"supabase/preview-only-migrations/202607270004_ux2_true_tombstone_and_abandon.sql","sha256":"5997e0d6df2725431ee82a30fa0c97274bf541cfba81cd30198b7bc0549a93c7","remote_history":"preview_only","repair_cohort":false},
  {"version":"202607280001","name":"ux2_persisted_envelope_guard","scope":"PREVIEW_ONLY","path":"supabase/preview-only-migrations/202607280001_ux2_persisted_envelope_guard.sql","sha256":"dd4331146915fbe1afc20b8f6cc20f65d2a4a3c25f0db4290e97cfc56a906c6e","remote_history":"preview_only","repair_cohort":false},
  {"version":"202607280002","name":"ux2_interpretation_idempotency","scope":"PREVIEW_ONLY","path":"supabase/preview-only-migrations/202607280002_ux2_interpretation_idempotency.sql","sha256":"8b77e263ce78a2d0a776f15213a5edce9b93be0bb9d52e7ac72185275824f157","remote_history":"preview_only","repair_cohort":false},
  {"version":"202607280003","name":"ux2_idempotency_hardening","scope":"PREVIEW_ONLY","path":"supabase/preview-only-migrations/202607280003_ux2_idempotency_hardening.sql","sha256":"495c7781bdf668271d1f260826aeb0958cdf82ccca834ff005a7e243b460415c","remote_history":"preview_only","repair_cohort":false},
  {"version":"202607280004","name":"ux2_recommendation_persistence","scope":"PREVIEW_ONLY","path":"supabase/preview-only-migrations/202607280004_ux2_recommendation_persistence.sql","sha256":"f4a796f6233f3290ae021e21439a6a31633933104991dd130cdd47231bea92ae","remote_history":"preview_only","repair_cohort":false},
  {"version":"202607280005","name":"ux2_response_ordering_determinism","scope":"PREVIEW_ONLY","path":"supabase/preview-only-migrations/202607280005_ux2_response_ordering_determinism.sql","sha256":"3a8378258a9abfa1c1980c05d7d3e43163f5540e33520e552223856c8e200ac3","remote_history":"preview_only","repair_cohort":false},
  {"version":"202607280006","name":"ux2_action_result_binding","scope":"PREVIEW_ONLY","path":"supabase/preview-only-migrations/202607280006_ux2_action_result_binding.sql","sha256":"f104d5f2fbf4fc1e6a2f97437a14d62f91da4ec23246acf065ee290b880856a4","remote_history":"preview_only","repair_cohort":false},
  {"version":"202607280007","name":"ux2_action_conflict_and_ordering","scope":"PREVIEW_ONLY","path":"supabase/preview-only-migrations/202607280007_ux2_action_conflict_and_ordering.sql","sha256":"9154bf3ed559ee86f31ebdf9aad3e02c29641e0120298fe16e96aced85bd58e1","remote_history":"preview_only","repair_cohort":false},
  {"version":"202607300001","name":"ux2_expired_credential_mint","scope":"PREVIEW_ONLY","path":"supabase/preview-only-migrations/202607300001_ux2_expired_credential_mint.sql","sha256":"822c2092edf8027cfc121feace6005241f9106bee11ac2c5330361d696883edc","remote_history":"preview_only","repair_cohort":false},
  {"version":"202607200004","name":"cpv1r1_datarights_reason_codes","scope":"LOCAL_ONLY","path":"supabase/local-only-migrations/cpv1/202607200004_cpv1r1_datarights_reason_codes.sql","sha256":"77144c259d326b7c0b9da31f0900e0c61bd56b4a11d3554d4d788ce756d15734","remote_history":"n/a","repair_cohort":false}
]
```
