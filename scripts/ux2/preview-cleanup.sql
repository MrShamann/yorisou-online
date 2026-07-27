-- UX-2 / ICP-1 — Preview-only synthetic data cleanup.
-- PREVIEW ONLY (yorisou-preview / nbltsbonsnbpfptihomc). NEVER run against Production.
--
-- Interpretation responses are append-only by trigger, which correctly blocks even the
-- FK cascade. Governed user-facing deletion is a SOFT delete (yorisou_assessment_result_delete
-- sets deleted_at and erases dimension_output) and never needs this. This script exists only to
-- remove SYNTHETIC acceptance data from the isolated Preview project.
begin;
alter table public.yorisou_interpretation_responses disable trigger yorisou_interpretation_responses_no_update;
delete from public.yorisou_interpretation_responses
 where owner_account_id like 'acct_test%' or owner_account_id like 'ux2synth%';
delete from public.yorisou_assessment_attempts
 where entry_source in ('test','chain','ux2-acceptance')
    or owner_account_id like 'acct_test%' or owner_account_id like 'ux2synth%';
alter table public.yorisou_interpretation_responses enable trigger yorisou_interpretation_responses_no_update;
commit;
