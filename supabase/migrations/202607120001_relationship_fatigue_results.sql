-- Allow the relationship-fatigue return-loop slice (PR #104) to persist
-- private results. The shared-engine constraints only admitted C02/F01/F02,
-- so production saves for RELATIONSHIP-FATIGUE failed the insert check.
-- Additive widening only: every previously valid row stays valid.
alter table public.yorisou_test_results
  drop constraint if exists yorisou_test_results_test_id_check,
  drop constraint if exists yorisou_test_results_test_version_check,
  drop constraint if exists yorisou_test_results_scoring_version_check,
  add constraint yorisou_test_results_test_id_check
    check (test_id in ('C02', 'F01', 'F02', 'RELATIONSHIP-FATIGUE')),
  add constraint yorisou_test_results_test_version_check
    check (test_version in ('v1.0', 'v0.1')),
  add constraint yorisou_test_results_scoring_version_check
    check (scoring_version in ('c02-rule-based-v1', 'yorisou-rule-based-v1', 'relationship_fatigue_mvp_v0_1'));
