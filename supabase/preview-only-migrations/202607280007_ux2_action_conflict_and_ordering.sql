-- UX-2R / CPC-1 — recommendation action conflict detection and stable ordering.
--
-- SCOPE: PREVIEW_ONLY (yorisou-preview / nbltsbonsnbpfptihomc). NEVER Production.
--
-- TWO DEFECTS, both the same shape as ones already fixed elsewhere in this spine — which is why
-- they are worth naming rather than quietly patching:
--
-- 1. SILENT PAYLOAD SUBSTITUTION. The action RPC returned the stored row for any repeated nonce
--    without comparing the payload. So:
--        nonce X + helpful      -> row written as `helpful`
--        nonce X + not_relevant -> returns the SAME row, client believes not_relevant succeeded
--    The person's screen would show "今は合わない" while the database held "役に立った". The
--    interpretation RPC was fixed for exactly this; the action RPC was not.
--
-- 2. AMBIGUOUS "LATEST". Actions ordered by created_at alone, and now() is the transaction
--    timestamp — so two feedback actions written together have no defined order, and "current
--    feedback" was whichever the database happened to return first. Same defect as the
--    interpretation ordering fix, in a different table.

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Monotonic ordering. A sequence is unambiguous under clock adjustment too, so "latest" is
--    exact rather than probable.
-- ─────────────────────────────────────────────────────────────────────────────
create sequence if not exists public.yorisou_recommendation_actions_seq;

alter table public.yorisou_recommendation_actions
  add column if not exists sequence_no bigint;

update public.yorisou_recommendation_actions a
   set sequence_no = s.rn
  from (select id, row_number() over (order by created_at, id) rn
          from public.yorisou_recommendation_actions) s
 where a.id = s.id and a.sequence_no is null;

select setval('public.yorisou_recommendation_actions_seq',
              coalesce((select max(sequence_no) from public.yorisou_recommendation_actions), 0) + 1,
              false);

alter table public.yorisou_recommendation_actions
  alter column sequence_no set default nextval('public.yorisou_recommendation_actions_seq');
alter table public.yorisou_recommendation_actions
  alter column sequence_no set not null;

create index if not exists yorisou_recommendation_actions_seq_idx
  on public.yorisou_recommendation_actions (item_id, sequence_no desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Full-payload conflict detection on both the pre-check and the concurrency recovery path.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_recommendation_act(
  p_item_id uuid, p_owner_account_id text, p_action text, p_source_surface text,
  p_intent_nonce uuid default null, p_result_row_id uuid default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_item public.yorisou_recommendation_items%rowtype;
        v_set public.yorisou_recommendation_sets%rowtype;
        v_existing public.yorisou_recommendation_actions%rowtype; v_id uuid;
begin
  select * into v_item from public.yorisou_recommendation_items
   where id = p_item_id and owner_account_id = p_owner_account_id;
  if not found then raise exception 'recommendation_item_not_found'; end if;

  select * into v_set from public.yorisou_recommendation_sets
   where id = v_item.set_id and owner_account_id = p_owner_account_id;
  if not found then raise exception 'recommendation_item_not_found'; end if;

  if p_result_row_id is not null then
    if v_item.result_row_id is distinct from p_result_row_id
       or v_set.result_row_id is distinct from p_result_row_id then
      raise exception 'recommendation_item_not_found';   -- concealed
    end if;
  end if;

  perform public.yorisou_recommendation_eligibility(v_item.result_row_id, p_owner_account_id);

  if p_intent_nonce is not null then
    select * into v_existing from public.yorisou_recommendation_actions
     where item_id = p_item_id and owner_account_id = p_owner_account_id
       and intent_nonce = p_intent_nonce;
    if found then
      -- A replay must be a replay of the SAME request. Returning the stored row for a different
      -- action would tell the caller their new choice succeeded when it was never recorded.
      if v_existing.action        is distinct from p_action
         or v_existing.source_surface is distinct from p_source_surface
         or v_existing.result_row_id  is distinct from v_item.result_row_id then
        raise exception 'recommendation_action_intent_conflict';
      end if;
      return v_existing.id;
    end if;
  end if;

  begin
    insert into public.yorisou_recommendation_actions
      (item_id, set_id, result_row_id, owner_account_id, action, source_surface, intent_nonce)
    values
      (p_item_id, v_item.set_id, v_item.result_row_id, p_owner_account_id, p_action,
       p_source_surface, p_intent_nonce)
    returning id into v_id;
  exception when unique_violation then
    -- Concurrent same-nonce request won. Re-read and apply the SAME comparison: a concurrent
    -- conflicting payload must not be absorbed just because it lost the race.
    select * into v_existing from public.yorisou_recommendation_actions
     where item_id = p_item_id and owner_account_id = p_owner_account_id
       and intent_nonce = p_intent_nonce;
    if not found then raise; end if;
    if v_existing.action        is distinct from p_action
       or v_existing.source_surface is distinct from p_source_surface
       or v_existing.result_row_id  is distinct from v_item.result_row_id then
      raise exception 'recommendation_action_intent_conflict';
    end if;
    return v_existing.id;
  end;

  return v_id;
end;
$$;

revoke all on function public.yorisou_recommendation_act(uuid, text, text, text, uuid, uuid)
  from public, anon, authenticated;
grant execute on function public.yorisou_recommendation_act(uuid, text, text, text, uuid, uuid)
  to service_role;

commit;
