-- UX-2R / CPC-1 §1.2 — SERVER-ENFORCED exactly-once interpretation responses.
--
-- SCOPE: PREVIEW_ONLY (yorisou-preview / nbltsbonsnbpfptihomc). NEVER Production.
--
-- WHY: the pending-intent nonce lived only in the browser's sessionStorage and was never sent to
-- the server. Reading and deleting a browser value once proves the BROWSER cannot replay it; it
-- proves nothing about the business action. The real failure it left open:
--
--     client POSTs the response  ->  server appends the row  ->  network drops the reply
--     -> browser shows an error  ->  intent already deleted  ->  user retries
--     -> a SECOND response is appended for the same intended action
--
-- Because responses are append-only, that duplicate is permanent. Exactly-once has to be enforced
-- where the write happens.
--
-- The idempotency key is scoped to (result_row_id, owner_account_id, intent_nonce): a nonce
-- belonging to one person can never satisfy another person's request, and the same nonce against a
-- different result is a different key rather than a silent cross-result match.

begin;

alter table public.yorisou_interpretation_responses
  add column if not exists intent_nonce uuid;

-- Partial unique index: rows without a nonce (already-authenticated direct responses) are
-- unaffected, and the constraint applies exactly where an intent was replayed.
drop index if exists yorisou_interpretation_responses_intent_idem;
create unique index yorisou_interpretation_responses_intent_idem
  on public.yorisou_interpretation_responses (result_row_id, owner_account_id, intent_nonce)
  where intent_nonce is not null;

-- ─────────────────────────────────────────────────────────────────────────────
-- Idempotent respond. A retry with the SAME nonce returns the original response id rather than
-- appending another. A retry with the same nonce but a CONFLICTING payload is rejected outright:
-- silently returning the first response would hide the fact that the caller asked for something
-- different from what is stored.
-- ─────────────────────────────────────────────────────────────────────────────
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

  -- Replay check happens BEFORE any write, and is owner- and result-scoped by the index above.
  if p_intent_nonce is not null then
    select * into v_existing from public.yorisou_interpretation_responses
     where result_row_id = p_result_row_id
       and owner_account_id = p_owner_account_id
       and intent_nonce = p_intent_nonce;
    if found then
      if v_existing.response_type is distinct from p_response_type
         or v_existing.corrected_result_id is distinct from p_corrected_result_id then
        raise exception 'interpretation_intent_conflict';
      end if;
      return v_existing.id;   -- the original response, not a second one
    end if;
  end if;

  select id into v_prev from public.yorisou_interpretation_responses
   where result_row_id = p_result_row_id order by created_at desc limit 1;

  -- ONLY an explicit confirmation or correction permits downstream use.
  v_permit := p_response_type in ('confirmed','corrected');

  insert into public.yorisou_interpretation_responses
    (result_row_id, owner_account_id, response_type, corrected_result_id, reason_code,
     supersedes_response_id, recommendation_use_permitted, continuity_use_permitted, source,
     intent_nonce)
  values
    (p_result_row_id, p_owner_account_id, p_response_type, p_corrected_result_id, p_reason_code,
     v_prev, v_permit, v_permit, p_source, p_intent_nonce)
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.yorisou_interpretation_respond(uuid, text, text, text, text, text, uuid)
  from public, anon, authenticated;
grant execute on function public.yorisou_interpretation_respond(uuid, text, text, text, text, text, uuid)
  to service_role;

-- ─────────────────────────────────────────────────────────────────────────────
-- Erasure already DELETES every interpretation response for the result, which removes the stored
-- nonces with them. Nothing further is required for this column — but state it explicitly so a
-- future change to erasure cannot quietly leave idempotency keys behind as a correlatable trail.
-- ─────────────────────────────────────────────────────────────────────────────
comment on column public.yorisou_interpretation_responses.intent_nonce is
  'Client-supplied idempotency nonce. Removed by yorisou_assessment_result_erase together with the response row; must never survive erasure.';

commit;
