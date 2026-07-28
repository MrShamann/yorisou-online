-- UX-2R / CPC-1 — bind every recommendation action to the canonical result it claims.
--
-- SCOPE: PREVIEW_ONLY (yorisou-preview / nbltsbonsnbpfptihomc). NEVER Production.
--
-- DEFECT: the API used `resultRowId` only to choose canonical mode; the mutation never received or
-- verified it. Someone owning results A and B could post `resultRowId = B` with an item belonging
-- to A, and the action would be written against A. No cross-user leak, but the canonical identity
-- contract said the two agree, and nothing enforced it — which is exactly the class of gap that
-- becomes a leak once a second person's row is involved.
--
-- The RPC now takes the claimed result and refuses when the item's own lineage disagrees, with the
-- SAME error the "item does not exist" path returns, so a mismatch cannot be used to probe which
-- items exist under which result.

begin;

create or replace function public.yorisou_recommendation_act(
  p_item_id uuid, p_owner_account_id text, p_action text, p_source_surface text,
  p_intent_nonce uuid default null, p_result_row_id uuid default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_item public.yorisou_recommendation_items%rowtype;
        v_set public.yorisou_recommendation_sets%rowtype; v_id uuid; v_existing uuid;
begin
  select * into v_item from public.yorisou_recommendation_items
   where id = p_item_id and owner_account_id = p_owner_account_id;
  if not found then raise exception 'recommendation_item_not_found'; end if;

  select * into v_set from public.yorisou_recommendation_sets
   where id = v_item.set_id and owner_account_id = p_owner_account_id;
  if not found then raise exception 'recommendation_item_not_found'; end if;

  -- item -> set -> result must equal the result the caller claims to be acting within.
  if p_result_row_id is not null then
    if v_item.result_row_id is distinct from p_result_row_id
       or v_set.result_row_id is distinct from p_result_row_id then
      raise exception 'recommendation_item_not_found';   -- concealed: never confirms the mismatch
    end if;
  end if;

  -- Present-tense consent: raises recommendation_not_permitted once withdrawn.
  perform public.yorisou_recommendation_eligibility(v_item.result_row_id, p_owner_account_id);

  if p_intent_nonce is not null then
    select id into v_existing from public.yorisou_recommendation_actions
     where item_id = p_item_id and owner_account_id = p_owner_account_id and intent_nonce = p_intent_nonce;
    if v_existing is not null then return v_existing; end if;
  end if;

  begin
    insert into public.yorisou_recommendation_actions
      (item_id, set_id, result_row_id, owner_account_id, action, source_surface, intent_nonce)
    values
      (p_item_id, v_item.set_id, v_item.result_row_id, p_owner_account_id, p_action,
       p_source_surface, p_intent_nonce)
    returning id into v_id;
  exception when unique_violation then
    -- Concurrent same-nonce request won the race; return its row so a retry is a replay.
    select id into v_id from public.yorisou_recommendation_actions
     where item_id = p_item_id and owner_account_id = p_owner_account_id and intent_nonce = p_intent_nonce;
    if v_id is null then raise; end if;
  end;
  return v_id;
end;
$$;

drop function if exists public.yorisou_recommendation_act(uuid, text, text, text, uuid);

revoke all on function public.yorisou_recommendation_act(uuid, text, text, text, uuid, uuid)
  from public, anon, authenticated;
grant execute on function public.yorisou_recommendation_act(uuid, text, text, text, uuid, uuid)
  to service_role;

commit;
