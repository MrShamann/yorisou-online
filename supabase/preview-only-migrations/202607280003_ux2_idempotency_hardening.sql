-- UX-2R / CPC-1 — hardening the interpretation idempotency guard.
--
-- SCOPE: PREVIEW_ONLY (yorisou-preview / nbltsbonsnbpfptihomc). NEVER Production.
--
-- Two real gaps in 202607280002:
--
--  1. INCOMPLETE CONFLICT COMPARISON. Only response_type and corrected_result_id were compared, so
--     a replay carrying the same nonce and type but a DIFFERENT reason_code (or source) was
--     silently answered with the stored row. The caller believed its reason had been recorded; it
--     had not. A conflict must be reported, not absorbed.
--
--  2. CONCURRENT REPLAY RETURNED AN ERROR. The check was select-then-insert with no handling for
--     two identical requests racing: both passed the select, the second hit the unique index and
--     surfaced as a server error. A duplicate submit — a double tap, or a retry landing beside the
--     original — should be indistinguishable from a single one.
--
-- Both are fixed by comparing the full payload and by catching unique_violation, re-reading the
-- winning row, and applying the same comparison to it.

begin;

create or replace function public.yorisou_interpretation_respond(
  p_result_row_id uuid, p_owner_account_id text, p_response_type text,
  p_corrected_result_id text default null, p_reason_code text default null,
  p_source text default 'web', p_intent_nonce uuid default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_owner text; v_deleted timestamptz; v_prev uuid; v_id uuid; v_permit boolean;
        v_existing public.yorisou_interpretation_responses%rowtype;
begin
  select r.owner_account_id, r.deleted_at into v_owner, v_deleted
    from public.yorisou_assessment_results r where r.id = p_result_row_id;
  if not found then raise exception 'result_not_found'; end if;
  if v_deleted is not null then raise exception 'result_erased'; end if;
  if v_owner is null or v_owner <> p_owner_account_id then raise exception 'result_not_owned'; end if;

  -- FULL payload comparison: every field the caller can influence takes part, so "same nonce" can
  -- never quietly mean "close enough".
  if p_intent_nonce is not null then
    select * into v_existing from public.yorisou_interpretation_responses
     where result_row_id = p_result_row_id
       and owner_account_id = p_owner_account_id
       and intent_nonce = p_intent_nonce;
    if found then
      if v_existing.response_type      is distinct from p_response_type
         or v_existing.corrected_result_id is distinct from p_corrected_result_id
         or v_existing.reason_code     is distinct from p_reason_code
         or v_existing.source          is distinct from p_source then
        raise exception 'interpretation_intent_conflict';
      end if;
      return v_existing.id;
    end if;
  end if;

  select id into v_prev from public.yorisou_interpretation_responses
   where result_row_id = p_result_row_id order by created_at desc limit 1;

  v_permit := p_response_type in ('confirmed','corrected');

  begin
    insert into public.yorisou_interpretation_responses
      (result_row_id, owner_account_id, response_type, corrected_result_id, reason_code,
       supersedes_response_id, recommendation_use_permitted, continuity_use_permitted, source,
       intent_nonce)
    values
      (p_result_row_id, p_owner_account_id, p_response_type, p_corrected_result_id, p_reason_code,
       v_prev, v_permit, v_permit, p_source, p_intent_nonce)
    returning id into v_id;
  exception when unique_violation then
    -- A concurrent request with the same nonce won the race. Read ITS row and treat this call as a
    -- replay: identical payload returns the winner's id, a differing one is a genuine conflict.
    select * into v_existing from public.yorisou_interpretation_responses
     where result_row_id = p_result_row_id
       and owner_account_id = p_owner_account_id
       and intent_nonce = p_intent_nonce;
    if not found then raise; end if;   -- some other unique constraint: do not mask it
    if v_existing.response_type      is distinct from p_response_type
       or v_existing.corrected_result_id is distinct from p_corrected_result_id
       or v_existing.reason_code     is distinct from p_reason_code
       or v_existing.source          is distinct from p_source then
      raise exception 'interpretation_intent_conflict';
    end if;
    return v_existing.id;
  end;

  return v_id;
end;
$$;

revoke all on function public.yorisou_interpretation_respond(uuid, text, text, text, text, text, uuid)
  from public, anon, authenticated;
grant execute on function public.yorisou_interpretation_respond(uuid, text, text, text, text, text, uuid)
  to service_role;

commit;
