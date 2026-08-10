-- UX-2 / ICP-1 — final persistence correction gate: a genuinely content-free tombstone, and a
-- governed attempt-abandon rule for "start over".
--
-- SCOPE: PREVIEW_ONLY (yorisou-preview / nbltsbonsnbpfptihomc). NEVER Production.
--
-- WHY: the previous erasure cleared dimension_output and overlay_id but RETAINED result_id and
-- original_result_id. Those identifiers reveal the user's assessment outcome directly, so the row
-- was pseudonymised, not content-free — and calling it a tombstone was inaccurate. Separately,
-- "はじめからやり直す" created a new attempt while silently orphaning the previous in-progress
-- attempt and leaving its claim token live.

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Result identifiers must become NULLABLE so an erased row can actually drop them.
--    A lifecycle constraint keeps a LIVE row complete and an ERASED row empty.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.yorisou_assessment_results alter column result_id drop not null;
alter table public.yorisou_assessment_results alter column original_result_id drop not null;
alter table public.yorisou_assessment_results alter column scoring_version drop not null;
alter table public.yorisou_assessment_results alter column result_schema_version drop not null;

alter table public.yorisou_assessment_results
  drop constraint if exists yorisou_assessment_results_lifecycle_shape;
alter table public.yorisou_assessment_results
  add constraint yorisou_assessment_results_lifecycle_shape check (
    (deleted_at is null  and result_id is not null and original_result_id is not null)
    or
    -- ERASED: nothing reconstructable may remain.
    (deleted_at is not null
       and result_id is null
       and original_result_id is null
       and overlay_id is null
       and owner_account_id is null
       and dimension_output = '{}'::jsonb)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. TRUE content-free erasure.
--    Retained afterwards: opaque row id, opaque attempt id, method id/version (governed
--    provenance of WHICH method ran, which cannot reconstruct the outcome), produced_at and
--    deleted_at. Everything capable of reconstructing the user's result is removed.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_assessment_result_erase(
  p_result_row_id uuid, p_owner_account_id text
) returns boolean
language plpgsql security definer set search_path = public as $$
declare v_attempt uuid; v_rows integer;
begin
  select attempt_id into v_attempt from public.yorisou_assessment_results
   where id = p_result_row_id and owner_account_id = p_owner_account_id and deleted_at is null;
  if not found then return false; end if;

  -- Interpretation responses carry the user's corrections and reasons: remove them entirely.
  -- The append-only rule yields ONLY inside this owner-scoped, single-result transaction.
  perform set_config('yorisou.erasure_context', p_result_row_id::text, true);
  delete from public.yorisou_interpretation_responses where result_row_id = p_result_row_id;
  perform set_config('yorisou.erasure_context', '', true);

  -- Drop every field that could reconstruct the outcome, including the owner linkage.
  update public.yorisou_assessment_results
     set deleted_at            = now(),
         result_id             = null,
         original_result_id    = null,
         overlay_id            = null,
         dimension_output      = '{}'::jsonb,
         owner_account_id      = null,
         scoring_version       = null,
         result_schema_version = null
   where id = p_result_row_id;
  get diagnostics v_rows = row_count;

  -- Erase the raw answers and spend the claim credential on the originating attempt.
  update public.yorisou_assessment_attempts
     set answers = '{}'::jsonb, answered_count = 0, claim_token_hash = null,
         status = 'abandoned', completed_at = null, owner_account_id = null, claimed_at = null,
         expires_at = null, updated_at = now()
   where id = v_attempt;

  return v_rows > 0;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. GOVERNED ABANDON — the real rule behind "start over".
--    The previous attempt is explicitly closed, its answers erased and its claim token
--    invalidated, so it can never later be resumed, completed or claimed.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_attempt_abandon(
  p_attempt_id uuid, p_claim_token_hash text, p_owner_account_id text, p_reason text
) returns boolean
language plpgsql security definer set search_path = public as $$
declare v_rows integer;
begin
  if p_reason not in ('user_restarted','expired','erased') then
    raise exception 'attempt_abandon_reason_invalid';
  end if;
  update public.yorisou_assessment_attempts a
     set status = 'abandoned',
         answers = '{}'::jsonb,
         answered_count = 0,
         claim_token_hash = null,   -- the old credential can never be replayed
         completed_at = null,
         entry_source = p_reason,   -- bounded, non-identifying abandonment classification
         updated_at = now()
   where a.id = p_attempt_id
     and a.status = 'in_progress'
     and (
       (a.owner_account_id is null and a.claim_token_hash = p_claim_token_hash)
       or (a.owner_account_id is not null and a.owner_account_id = p_owner_account_id)
     );
  get diagnostics v_rows = row_count;
  return v_rows > 0;
end;
$$;

revoke all on function public.yorisou_attempt_abandon(uuid, text, text, text) from public, anon, authenticated;
grant execute on function public.yorisou_attempt_abandon(uuid, text, text, text) to service_role;

commit;
