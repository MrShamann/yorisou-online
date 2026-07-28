-- UX-2R / CPC-1 — deterministic "latest response" ordering.
--
-- SCOPE: PREVIEW_ONLY (yorisou-preview / nbltsbonsnbpfptihomc). NEVER Production.
--
-- FOUND WHILE PROVING the recommendation graph: two interpretation responses written inside one
-- transaction share an identical `created_at`, because the column defaults to now(), which is the
-- TRANSACTION timestamp. Every consumer of "the latest response" — the eligibility function and
-- deriveCurrentUnderstanding alike — orders by created_at desc and so picks arbitrarily between
-- them. In the proof a `corrected` response was written after a `deferred` one and the deferred
-- row won, withholding permission the person had just granted.
--
-- This is not only a test artefact. Any batched or replayed write path can produce two responses in
-- one transaction, and the person's most recent answer must always be the one that counts.
--
-- Fix: a monotonic sequence column. clock_timestamp() would also differ within a transaction, but
-- an integer sequence is unambiguous under clock adjustment too, and ordering on it is exact.

begin;

create sequence if not exists public.yorisou_interpretation_responses_seq;

alter table public.yorisou_interpretation_responses
  add column if not exists sequence_no bigint;

-- Backfill in created_at order so existing history keeps its meaning.
update public.yorisou_interpretation_responses r
   set sequence_no = s.rn
  from (select id, row_number() over (order by created_at, id) rn
          from public.yorisou_interpretation_responses) s
 where r.id = s.id and r.sequence_no is null;

select setval('public.yorisou_interpretation_responses_seq',
              coalesce((select max(sequence_no) from public.yorisou_interpretation_responses), 0) + 1,
              false);

alter table public.yorisou_interpretation_responses
  alter column sequence_no set default nextval('public.yorisou_interpretation_responses_seq');
alter table public.yorisou_interpretation_responses
  alter column sequence_no set not null;

create index if not exists yorisou_interpretation_responses_latest
  on public.yorisou_interpretation_responses (result_row_id, sequence_no desc);

-- Eligibility now orders on the sequence, so the newest answer always wins.
create or replace function public.yorisou_recommendation_eligibility(
  p_result_row_id uuid, p_owner_account_id text
) returns table (accepted_result_id text, original_result_id text, basis text)
language plpgsql security definer set search_path = public as $$
declare v_res public.yorisou_assessment_results%rowtype; v_resp public.yorisou_interpretation_responses%rowtype;
begin
  select * into v_res from public.yorisou_assessment_results
   where id = p_result_row_id and owner_account_id = p_owner_account_id and deleted_at is null;
  if not found then raise exception 'result_not_found'; end if;

  if v_res.dimension_output is null
     or (select count(*) from jsonb_object_keys(v_res.dimension_output)) <> 1
     or v_res.dimension_output->>'v' is distinct from 'pds-v1' then
    raise exception 'result_envelope_invalid';
  end if;

  select * into v_resp from public.yorisou_interpretation_responses
   where result_row_id = p_result_row_id order by sequence_no desc limit 1;
  if not found then raise exception 'recommendation_not_permitted'; end if;
  if v_resp.response_type not in ('confirmed','corrected') then raise exception 'recommendation_not_permitted'; end if;
  if v_resp.recommendation_use_permitted is not true then raise exception 'recommendation_not_permitted'; end if;

  accepted_result_id := case when v_resp.response_type = 'corrected'
                             then v_resp.corrected_result_id else v_res.result_id end;
  if accepted_result_id is null then raise exception 'recommendation_not_permitted'; end if;
  original_result_id := v_res.original_result_id;
  basis := v_resp.response_type;
  return next;
end;
$$;

-- Supersession must also follow the sequence, not the timestamp.
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
   where result_row_id = p_result_row_id order by sequence_no desc limit 1;

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
    select * into v_existing from public.yorisou_interpretation_responses
     where result_row_id = p_result_row_id
       and owner_account_id = p_owner_account_id
       and intent_nonce = p_intent_nonce;
    if not found then raise; end if;
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

commit;
