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
  {
    "version": "202607100001",
    "name": "agent_runtime_phase1",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202607100001_agent_runtime_phase1.sql",
    "sha256": "13bcf13a6388c7cc62d24f82cda573366a64af88d752cd2b296afdba75361b66",
    "remote_history": "tracked",
    "repair_cohort": false
  },
  {
    "version": "202607100002",
    "name": "c02_private_results",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202607100002_c02_private_results.sql",
    "sha256": "06eec860cd65826a03fa152110cefe42adea4e65ba1620dd93bf60038adc62a3",
    "remote_history": "tracked",
    "repair_cohort": false
  },
  {
    "version": "202607100003",
    "name": "shared_test_engine",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202607100003_shared_test_engine.sql",
    "sha256": "6b85f4d7cb44f457f8ab2f3a5e491db8e25eabba5a051186719da2352984c73d",
    "remote_history": "tracked",
    "repair_cohort": false
  },
  {
    "version": "202607100004",
    "name": "line_oauth_state_replay_protection",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202607100004_line_oauth_state_replay_protection.sql",
    "sha256": "41e9ffd26b894702e6266244bd582860935a776e12d4ba59358a5c2aa10ff88c",
    "remote_history": "tracked",
    "repair_cohort": false
  },
  {
    "version": "202607110001",
    "name": "private_ai_state_and_harness",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202607110001_private_ai_state_and_harness.sql",
    "sha256": "2ebbdf2175a54eee59a7f9ff6ed47af4d9c2f98df9db0c5460516c12f521d18f",
    "remote_history": "tracked",
    "repair_cohort": false
  },
  {
    "version": "202607110002",
    "name": "experience_cards",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202607110002_experience_cards.sql",
    "sha256": "67037e127a799a3760f0337fe52e97ca71c02ab1f745ea0148b7bffbff533855",
    "remote_history": "tracked",
    "repair_cohort": false
  },
  {
    "version": "202607110003",
    "name": "recommendation_graph",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202607110003_recommendation_graph.sql",
    "sha256": "4d2e67dd981c668fda52458a1d396cb34b65e99eadbbd07a7ab2db60f827f5d1",
    "remote_history": "tracked",
    "repair_cohort": false
  },
  {
    "version": "202607120001",
    "name": "relationship_fatigue_results",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202607120001_relationship_fatigue_results.sql",
    "sha256": "ed0737e4c0246862f2d77220742128a853c118c6b93e1a763b12fd3a37a27e93",
    "remote_history": "untracked",
    "repair_cohort": true
  },
  {
    "version": "202607160001",
    "name": "imairo_public_result_snapshot",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202607160001_imairo_public_result_snapshot.sql",
    "sha256": "e2976dfcdd7f91271848f573b7de7f3d590b7b1b5650ddd8a7c158e9ee948f78",
    "remote_history": "untracked",
    "repair_cohort": true
  },
  {
    "version": "202607160002",
    "name": "candidate_intake_foundation",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202607160002_candidate_intake_foundation.sql",
    "sha256": "70ab2c28d77aaefac4d1c9563b95786c32b422e6167f35702a4793680eec3d7c",
    "remote_history": "untracked",
    "repair_cohort": true
  },
  {
    "version": "202607200001",
    "name": "cpv1_foundation_prereqs",
    "scope": "LOCAL_ONLY",
    "path": "supabase/local-only-migrations/cpv1/202607200001_cpv1_foundation_prereqs.sql",
    "sha256": "2b0203b4d306ef2d5765fbc0908aaafd78c6f7c69b1e7b5b570f1fb9804e3ded",
    "remote_history": "n/a",
    "repair_cohort": false
  },
  {
    "version": "202607200002",
    "name": "cpv1_understanding_history_consent",
    "scope": "LOCAL_ONLY",
    "path": "supabase/local-only-migrations/cpv1/202607200002_cpv1_understanding_history_consent.sql",
    "sha256": "3f140c5909ae68cf0795000122e7b4c9193b381d0fe1005cc8a2f43b6eead76e",
    "remote_history": "n/a",
    "repair_cohort": false
  },
  {
    "version": "202607200003",
    "name": "cpv1r1_relations_permissions_datarights",
    "scope": "LOCAL_ONLY",
    "path": "supabase/local-only-migrations/cpv1/202607200003_cpv1r1_relations_permissions_datarights.sql",
    "sha256": "88a6c4518f2bce08912c8ede728a61241e1348960974f4a5ce5eef1f0f963ad5",
    "remote_history": "n/a",
    "repair_cohort": false
  },
  {
    "version": "202607200004",
    "name": "cpv1r1_datarights_reason_codes",
    "scope": "LOCAL_ONLY",
    "path": "supabase/local-only-migrations/cpv1/202607200004_cpv1r1_datarights_reason_codes.sql",
    "sha256": "77144c259d326b7c0b9da31f0900e0c61bd56b4a11d3554d4d788ce756d15734",
    "remote_history": "n/a",
    "repair_cohort": false
  },
  {
    "version": "202607200005",
    "name": "dci1_daily_state_records",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202607200005_dci1_daily_state_records.sql",
    "sha256": "fb130d49e2417f04377ec055a942a0602716bd112dddcda9a2162976593908b0",
    "remote_history": "untracked",
    "repair_cohort": true
  },
  {
    "version": "202607210001",
    "name": "yv1_values_assessments",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202607210001_yv1_values_assessments.sql",
    "sha256": "1f76f01e050a9c19eb156a45c556f943ae9f9b76e1fc3fa9658723b8051f004f",
    "remote_history": "untracked",
    "repair_cohort": true
  },
  {
    "version": "202607270001",
    "name": "ux2_assessment_attempt_result_response",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607270001_ux2_assessment_attempt_result_response.sql",
    "sha256": "92634873c5a272b1acd955f7b375cc6247a38ddc0e087a128fdcf97c57c8fc63",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607270002",
    "name": "ux2_assessment_persistence_rollback",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607270002_ux2_assessment_persistence_rollback.sql",
    "sha256": "a4a7a1d799d9bed297796b153057e93e7770cc638a20f6d65a6e46bbc615aebe",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607270003",
    "name": "ux2_lifecycle_semantics_and_erasure",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607270003_ux2_lifecycle_semantics_and_erasure.sql",
    "sha256": "e6905524aa284bbe4d4a9f9c2f2f75bb1c7ba18ae6ae1c844c0bc20e2c64dcc7",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607270004",
    "name": "ux2_true_tombstone_and_abandon",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607270004_ux2_true_tombstone_and_abandon.sql",
    "sha256": "5997e0d6df2725431ee82a30fa0c97274bf541cfba81cd30198b7bc0549a93c7",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607280001",
    "name": "ux2_persisted_envelope_guard",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607280001_ux2_persisted_envelope_guard.sql",
    "sha256": "dd4331146915fbe1afc20b8f6cc20f65d2a4a3c25f0db4290e97cfc56a906c6e",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607280002",
    "name": "ux2_interpretation_idempotency",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607280002_ux2_interpretation_idempotency.sql",
    "sha256": "8b77e263ce78a2d0a776f15213a5edce9b93be0bb9d52e7ac72185275824f157",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607280003",
    "name": "ux2_idempotency_hardening",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607280003_ux2_idempotency_hardening.sql",
    "sha256": "495c7781bdf668271d1f260826aeb0958cdf82ccca834ff005a7e243b460415c",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607280004",
    "name": "ux2_recommendation_persistence",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607280004_ux2_recommendation_persistence.sql",
    "sha256": "f4a796f6233f3290ae021e21439a6a31633933104991dd130cdd47231bea92ae",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607280005",
    "name": "ux2_response_ordering_determinism",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607280005_ux2_response_ordering_determinism.sql",
    "sha256": "3a8378258a9abfa1c1980c05d7d3e43163f5540e33520e552223856c8e200ac3",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607280006",
    "name": "ux2_action_result_binding",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607280006_ux2_action_result_binding.sql",
    "sha256": "f104d5f2fbf4fc1e6a2f97437a14d62f91da4ec23246acf065ee290b880856a4",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607280007",
    "name": "ux2_action_conflict_and_ordering",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607280007_ux2_action_conflict_and_ordering.sql",
    "sha256": "9154bf3ed559ee86f31ebdf9aad3e02c29641e0120298fe16e96aced85bd58e1",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607300001",
    "name": "ux2_expired_credential_mint",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607300001_ux2_expired_credential_mint.sql",
    "sha256": "822c2092edf8027cfc121feace6005241f9106bee11ac2c5330361d696883edc",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607300002",
    "name": "por1_canonical_recommendation_namespace",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607300002_por1_canonical_recommendation_namespace.sql",
    "sha256": "a687b28a694728324b6f3d1b4d88a3c89104c33f4f11f9a7c8fa79957e18fc02",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607300003",
    "name": "por1_account_deletion_lifecycle",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607300003_por1_account_deletion_lifecycle.sql",
    "sha256": "a4e045703c685c94ff969c6e5e65180f74d87c25259a2c10f540155a4004619d",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607300004",
    "name": "por1_account_mutation_fence",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607300004_por1_account_mutation_fence.sql",
    "sha256": "93d2292de23d541df966568b34a102cb9d57eb857d0d1ffcfe76e74ab184f90d",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607300005",
    "name": "por1_deletion_resume_engine",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607300005_por1_deletion_resume_engine.sql",
    "sha256": "92a822cc865a0bc426773c1338a37df051137507c9acbf28b4d7c4699439d6e7",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607310001",
    "name": "por1_canonical_line_activity",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607310001_por1_canonical_line_activity.sql",
    "sha256": "2bb7e7cf483423735b2ff6c8507446b8dbdf193204fb309d5ea10d12a2ee1720",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607310002",
    "name": "por1_line_subject_erasure_barrier",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607310002_por1_line_subject_erasure_barrier.sql",
    "sha256": "f37cd6b0bb5edcf4d758de76bad3ef9138e18d5f1dac29492cf01a5a63dbde1b",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607310003",
    "name": "por1_identity_provisioning_saga",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607310003_por1_identity_provisioning_saga.sql",
    "sha256": "78a5f8957ddbd63c9aa668ae2cbe2db049c73e7ecb1429d2369eb9ed86106c56",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607310004",
    "name": "por1_canonical_identity_links",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607310004_por1_canonical_identity_links.sql",
    "sha256": "fe1028fea2c3fe5866d907a0f6e4b2cf52aae169de33e746dd5f3cb25498f7e5",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607310005",
    "name": "por1_identity_link_same_owner_race",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607310005_por1_identity_link_same_owner_race.sql",
    "sha256": "140c2f72f615ed5ca52fb47e6aa04bb0e5507e0e74a04ce6fb95dc8119481439",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607310006",
    "name": "por1_identity_link_sync_is_additive",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607310006_por1_identity_link_sync_is_additive.sql",
    "sha256": "4f4eda6a3cf721abc81dbf31b8366cc1c788c11d98370e7b729758cea9b326de",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607310007",
    "name": "por1_deletion_open_same_owner_race",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607310007_por1_deletion_open_same_owner_race.sql",
    "sha256": "c5eea15e04855218892079436279d54117363886cfa8570bd5a80d61847a0e19",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202607310008",
    "name": "por1_terminal_deidentification",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202607310008_por1_terminal_deidentification.sql",
    "sha256": "21d3419e900f6cbb12f84ed9d925b9e5165722e3a5ccfefed7b4d4751c2d00eb",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202608010001",
    "name": "por1_function_execute_privilege_repair",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202608010001_por1_function_execute_privilege_repair.sql",
    "sha256": "70c0b198d553093cbafbc132c26224863497b7da766cec9ba1531b6e3b13813d"
  },
  {
    "version": "202608050001",
    "name": "por1_sequence_privilege_repair",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202608050001_por1_sequence_privilege_repair.sql",
    "sha256": "bd0c9394c2c65c3ba476bc4285a5928e0780b7035441b31098850a1b12a3d0d2",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202608050002",
    "name": "por1_erasure_authority_parity",
    "scope": "PREVIEW_ONLY",
    "path": "supabase/preview-only-migrations/202608050002_por1_erasure_authority_parity.sql",
    "sha256": "8eeee75e138ebbf44dcdcd6db65875677f0ec8df63d993a1ac7e45712d4bb508",
    "remote_history": "preview_only",
    "repair_cohort": false
  },
  {
    "version": "202608010101",
    "name": "por1_canonical_assessment_and_interpretation",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202608010101_por1_canonical_assessment_and_interpretation.sql",
    "sha256": "8e6c6d7e6a840a923f27b38aa80e0c9458cf9bdb9bba40fabb384335dbcd7d40"
  },
  {
    "version": "202608010102",
    "name": "por1_canonical_recommendations",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202608010102_por1_canonical_recommendations.sql",
    "sha256": "a5389f9a28655df1997bf02e1072d55416756f1b295c2780a1ec7b0ac4d630d5"
  },
  {
    "version": "202608010103",
    "name": "por1_canonical_identity_and_provisioning",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202608010103_por1_canonical_identity_and_provisioning.sql",
    "sha256": "26d76ddf5f3211411d560cc285907b0a02ba2bb9548b456ffef263a4e1cc3103"
  },
  {
    "version": "202608010104",
    "name": "por1_canonical_line_activity",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202608010104_por1_canonical_line_activity.sql",
    "sha256": "12d293ee33aeec09275da8ac8707f93df9cbfda3fb42e9f6b6e8b5e8c20d15ba"
  },
  {
    "version": "202608010105",
    "name": "por1_account_mutation_fence",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202608010105_por1_account_mutation_fence.sql",
    "sha256": "22ce9b3d6e89b32d152bbd9226de6c90209b38329fd229a8c120989512f4c316"
  },
  {
    "version": "202608010106",
    "name": "por1_account_deletion_lifecycle",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202608010106_por1_account_deletion_lifecycle.sql",
    "sha256": "32d03b74fd7a66b19ba955255cb981b6bf69b940c4509a2808879d858f647d27"
  },
  {
    "version": "202608010107",
    "name": "por1_cross_domain_functions",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202608010107_por1_cross_domain_functions.sql",
    "sha256": "63ec403a7b7ed0bc167c57fa97f720f05ece5282870ec43678b9ac6bb012973d"
  },
  {
    "version": "202608010108",
    "name": "por1_promotion_contract_assertion",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202608010108_por1_promotion_contract_assertion.sql",
    "sha256": "03c0f287bcbbbc807ef379330250027fdfe4f9b9d3d1f8a42a6fac9abdc4174a"
  },
  {
    "version": "202608010109",
    "name": "por1_append_only_erasure_contract",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202608010109_por1_append_only_erasure_contract.sql",
    "sha256": "f53b5e13e5ca0dd8c7254de458e2cb29d563984f63b94e65b9d7e410c1da2a70"
  },
  {
    "version": "202608010110",
    "name": "por1_exact_job_erasure_authority",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202608010110_por1_exact_job_erasure_authority.sql",
    "sha256": "b4ed52158a095c97ae27ebf2fb7ed44be6bd3a4cd9b8005bad40ecb3905c5fb3"
  },
  {
    "version": "202608010111",
    "name": "por1_executor_claim_bound_erasure",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202608010111_por1_executor_claim_bound_erasure.sql",
    "sha256": "cc4abdbbbca2e6593d6714f3223c124209893128ff94330b095e21ca02acb8c6"
  },
  {
    "version": "202608140001",
    "name": "osf1_life_os_foundation",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202608140001_osf1_life_os_foundation.sql",
    "sha256": "22162a79708eabefa539534b56694de6586059f0578220c94941fbc992346ed7"
  },
  {
    "version": "202608140002",
    "name": "osf1_erasure_plan_registration",
    "scope": "PRODUCTION_LINEAGE",
    "path": "supabase/migrations/202608140002_osf1_erasure_plan_registration.sql",
    "sha256": "436ea2c7560e56df6951249ffbea5307a49a6340179d813caca5621a75a96c3c"
  }
]
```
