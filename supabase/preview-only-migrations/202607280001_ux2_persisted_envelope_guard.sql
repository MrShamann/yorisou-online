-- CPC-1 Wave A — database-level guard for the canonical persisted result envelope.
-- SCOPE: PREVIEW_ONLY (yorisou-preview / nbltsbonsnbpfptihomc). NEVER Production.
--
-- The safe envelope must not depend on caller discipline. The completion RPC now refuses any
-- dimension_output that is not exactly {"v":"pds-v1"}, so an application regression cannot
-- reintroduce reconstructable scoring rows into live storage.
begin;

create or replace function public.yorisou_attempt_complete(
  p_attempt_id uuid, p_claim_token_hash text, p_owner_account_id text,
  p_answers jsonb, p_answered_count integer, p_result_id text, p_overlay_id text,
  p_dimension_output jsonb, p_scoring_version text, p_result_schema_version text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_attempt public.yorisou_assessment_attempts%rowtype; v_existing uuid; v_result_row uuid;
begin
  -- CANONICAL ENVELOPE GUARD: exactly one key, exactly the approved version.
  if p_dimension_output is null
     or jsonb_typeof(p_dimension_output) <> 'object'
     or (select count(*) from jsonb_object_keys(p_dimension_output)) <> 1
     or p_dimension_output->>'v' is distinct from 'pds-v1' then
    raise exception 'assessment_persisted_envelope_invalid';
  end if;

  select * into v_attempt from public.yorisou_assessment_attempts a
   where a.id = p_attempt_id
     and (
       (a.owner_account_id is null and a.claim_token_hash is not null and a.claim_token_hash = p_claim_token_hash)
       or (a.owner_account_id is not null and a.owner_account_id = p_owner_account_id)
     )
   for update;
  if not found then raise exception 'attempt_not_found_or_not_writable'; end if;

  select r.id into v_existing from public.yorisou_assessment_results r where r.attempt_id = p_attempt_id;
  if v_existing is not null then return v_existing; end if;

  if v_attempt.owner_account_id is null
     and v_attempt.expires_at is not null and v_attempt.expires_at <= now() then
    raise exception 'attempt_expired';
  end if;
  if p_answered_count < v_attempt.required_count then raise exception 'attempt_incomplete_coverage'; end if;

  update public.yorisou_assessment_attempts
     set answers = p_answers, answered_count = p_answered_count,
         status = 'completed', completed_at = now(), updated_at = now()
   where id = p_attempt_id;

  insert into public.yorisou_assessment_results
    (attempt_id, owner_account_id, method_id, method_version, scoring_version,
     result_schema_version, result_id, overlay_id, dimension_output, original_result_id)
  values
    (p_attempt_id, v_attempt.owner_account_id, v_attempt.method_id, v_attempt.method_version,
     p_scoring_version, p_result_schema_version, p_result_id, p_overlay_id,
     p_dimension_output, p_result_id)
  returning id into v_result_row;
  return v_result_row;
end;
$$;

commit;
