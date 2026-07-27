-- UX-2 / ICP-1 — compensating rollback for the Preview-only assessment persistence spine.
-- SCOPE: PREVIEW_ONLY (yorisou-preview / nbltsbonsnbpfptihomc). NEVER run against Production.
-- CLASSIFICATION: PREVIEW_DISPOSABLE_SCHEMA_ROLLBACK — structurally destructive in the isolated
-- Preview project only. This schema never enters Production, so this is not a Production rollback.
begin;
drop function if exists public.yorisou_assessment_result_delete(uuid, text);
drop function if exists public.yorisou_interpretation_respond(uuid, text, text, text, text, text);
drop function if exists public.yorisou_attempt_claim(uuid, text, text);
drop function if exists public.yorisou_attempt_complete(uuid, text, text, jsonb, integer, text, text, jsonb, text, text);
drop function if exists public.yorisou_attempt_save_progress(uuid, text, text, jsonb, integer);
drop function if exists public.yorisou_attempt_start(text, text, integer, text, text, integer);
drop trigger if exists yorisou_interpretation_responses_no_update on public.yorisou_interpretation_responses;
drop function if exists public.yorisou_interpretation_responses_append_only();
drop table if exists public.yorisou_interpretation_responses;
drop table if exists public.yorisou_assessment_results;
drop table if exists public.yorisou_assessment_attempts;
commit;
