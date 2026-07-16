-- RTR-1: admit the IMAIRO-120Q public-result snapshot into the existing
-- private result store, and record snapshot provenance.
--
-- Additive only:
--   * widens the three registry check constraints (also admitting the
--     RELATIONSHIP-FATIGUE values that app/api/tests/relationship-fatigue
--     has written since PR #104 — closes the repo/DB constraint drift);
--   * adds one nullable jsonb column for snapshot provenance/source-type
--     classification. No data is modified or deleted.
--
-- Rollback (non-destructive): re-add the previous narrower constraints only
-- after verifying no rows use the widened values; `snapshot_context` can be
-- dropped with `alter table ... drop column snapshot_context` (private
-- provenance metadata only). Existing rows always remain valid.

alter table public.yorisou_test_results
  drop constraint if exists yorisou_test_results_test_id_check,
  drop constraint if exists yorisou_test_results_test_version_check,
  drop constraint if exists yorisou_test_results_scoring_version_check,
  add constraint yorisou_test_results_test_id_check
    check (test_id in ('C02', 'F01', 'F02', 'RELATIONSHIP-FATIGUE', 'IMAIRO-120Q')),
  add constraint yorisou_test_results_test_version_check
    check (test_version in ('v1.0', 'v0.1', 'compat-v0.2')),
  add constraint yorisou_test_results_scoring_version_check
    check (scoring_version in (
      'c02-rule-based-v1',
      'yorisou-rule-based-v1',
      'relationship_fatigue_mvp_v0_1',
      'imairo-public-assignment-v0.1'
    )),
  add column if not exists snapshot_context jsonb
    check (snapshot_context is null or jsonb_typeof(snapshot_context) = 'object');

-- RLS posture is inherited and unchanged: RLS stays enabled, all grants stay
-- revoked from public/anon/authenticated; access remains exclusively through
-- the server-only service-role repository which scopes every query by
-- owner_account_id (lib/server/testResults.ts).
