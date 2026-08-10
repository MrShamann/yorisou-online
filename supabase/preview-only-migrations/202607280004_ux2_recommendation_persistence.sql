-- UX-2R / CPC-1 — the canonical recommendation / action / feedback graph.
--
-- SCOPE: PREVIEW_ONLY (yorisou-preview / nbltsbonsnbpfptihomc). NEVER Production.
--
-- WHY: the product's value loop is understand → recommend → try → reflect → adapt → return. Until
-- now only the first step was persisted. Recommendations were generated from a free-text state word
-- and lived nowhere, so "helpful", "not for me" and "I tried it" evaporated on refresh, nothing
-- could be recovered after sign-in, and erasure had nothing downstream to erase — while the
-- deletion copy already promised it did.
--
-- EVERY row here is owner-scoped and hangs off the canonical assessment result. The eligibility
-- basis is stored, not inferred, so a record can always answer "which answer of mine authorized
-- this?" — which is what makes later permission withdrawal legible rather than retroactive.

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Recommendation set — one materialization for one canonical result.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_recommendation_sets (
  id uuid primary key default gen_random_uuid(),
  result_row_id uuid not null references public.yorisou_assessment_results(id) on delete cascade,
  owner_account_id text not null,
  -- Provenance of the decision to recommend at all.
  accepted_result_id text not null,
  original_result_id text,
  eligibility_basis text not null check (eligibility_basis in ('confirmed','corrected')),
  content_version text not null,
  source_surface text not null check (source_surface in ('result','recommendations','graph','private_state','line')),
  generated_at timestamptz not null default now(),
  lifecycle_state text not null default 'active' check (lifecycle_state in ('active','superseded','withdrawn')),
  created_at timestamptz not null default now()
);

create index if not exists yorisou_recommendation_sets_owner
  on public.yorisou_recommendation_sets (owner_account_id, result_row_id, generated_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Recommendation item — bounded, governed, explainable.
--    reason/limitations/classification are NOT optional: a recommendation the person cannot
--    interrogate is indistinguishable from an instruction, which this product must never give.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_recommendation_items (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.yorisou_recommendation_sets(id) on delete cascade,
  owner_account_id text not null,
  result_row_id uuid not null references public.yorisou_assessment_results(id) on delete cascade,
  rank integer not null check (rank between 1 and 5),
  recommendation_key text not null,
  object_type text not null check (object_type in ('resource','experience_card','internal_route')),
  source_class text not null check (source_class in ('yorisou_internal','public_information','partner_nonpaid','partner_sponsored')),
  commercial_status text not null check (commercial_status in ('none','disclosed_sponsored','disclosed_affiliate')),
  reason_code text not null,
  limitations_code text not null,
  created_at timestamptz not null default now(),
  unique (set_id, rank),
  unique (set_id, recommendation_key)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Action / feedback — append-only signal history.
--    Kept append-only for the same reason interpretation responses are: "I found this helpful last
--    month and unhelpful now" is real information about a person changing, not a correction to be
--    overwritten.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_recommendation_actions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.yorisou_recommendation_items(id) on delete cascade,
  set_id uuid not null references public.yorisou_recommendation_sets(id) on delete cascade,
  result_row_id uuid not null references public.yorisou_assessment_results(id) on delete cascade,
  owner_account_id text not null,
  action text not null check (action in
    ('saved','try_intent','tried','helpful','not_helpful','not_relevant','hidden','reported','resource_opened')),
  source_surface text not null,
  intent_nonce uuid,
  created_at timestamptz not null default now()
);

create unique index if not exists yorisou_recommendation_actions_idem
  on public.yorisou_recommendation_actions (item_id, owner_account_id, intent_nonce)
  where intent_nonce is not null;

create index if not exists yorisou_recommendation_actions_owner
  on public.yorisou_recommendation_actions (owner_account_id, result_row_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. ACCESS ARCHITECTURE — identical to the rest of the spine.
--    RLS enabled AND forced; no grants to anon/authenticated; service_role SELECT-only;
--    every mutation through SECURITY DEFINER RPCs.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare t text;
begin
  foreach t in array array['yorisou_recommendation_sets','yorisou_recommendation_items','yorisou_recommendation_actions'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format('revoke all on public.%I from public, anon, authenticated, service_role', t);
    execute format('grant select on public.%I to service_role', t);
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. ELIGIBILITY, evaluated at the moment of every write.
--    A permission granted last week is not a permission now: if the person has since rejected or
--    deferred, generation and new signals must both stop.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_recommendation_eligibility(
  p_result_row_id uuid, p_owner_account_id text
) returns table (accepted_result_id text, original_result_id text, basis text)
language plpgsql security definer set search_path = public as $$
declare v_res public.yorisou_assessment_results%rowtype; v_resp public.yorisou_interpretation_responses%rowtype;
begin
  select * into v_res from public.yorisou_assessment_results
   where id = p_result_row_id and owner_account_id = p_owner_account_id and deleted_at is null;
  if not found then raise exception 'result_not_found'; end if;

  -- The strict live-envelope invariant applies here too: a row we would refuse to render is a row
  -- we must refuse to recommend from.
  if v_res.dimension_output is null
     or (select count(*) from jsonb_object_keys(v_res.dimension_output)) <> 1
     or v_res.dimension_output->>'v' is distinct from 'pds-v1' then
    raise exception 'result_envelope_invalid';
  end if;

  select * into v_resp from public.yorisou_interpretation_responses
   where result_row_id = p_result_row_id order by created_at desc limit 1;
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Materialize a set. Idempotent per (result, accepted result, content version) while the
--    permission still stands — reopening the page must not mint a new set each time.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_recommendation_materialize(
  p_result_row_id uuid, p_owner_account_id text, p_content_version text,
  p_source_surface text, p_items jsonb
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_e record; v_set uuid; v_item jsonb; v_rank integer := 0;
begin
  select * into v_e from public.yorisou_recommendation_eligibility(p_result_row_id, p_owner_account_id);

  select id into v_set from public.yorisou_recommendation_sets
   where result_row_id = p_result_row_id and owner_account_id = p_owner_account_id
     and accepted_result_id = v_e.accepted_result_id and content_version = p_content_version
     and lifecycle_state = 'active'
   order by generated_at desc limit 1;
  if v_set is not null then return v_set; end if;

  -- A change of accepted result supersedes earlier sets rather than deleting them: what was
  -- recommended under a previous self-understanding is part of the person's history.
  update public.yorisou_recommendation_sets set lifecycle_state = 'superseded'
   where result_row_id = p_result_row_id and owner_account_id = p_owner_account_id
     and lifecycle_state = 'active';

  insert into public.yorisou_recommendation_sets
    (result_row_id, owner_account_id, accepted_result_id, original_result_id,
     eligibility_basis, content_version, source_surface)
  values
    (p_result_row_id, p_owner_account_id, v_e.accepted_result_id, v_e.original_result_id,
     v_e.basis, p_content_version, p_source_surface)
  returning id into v_set;

  if jsonb_typeof(p_items) <> 'array' then raise exception 'recommendation_items_invalid'; end if;
  if jsonb_array_length(p_items) > 5 then raise exception 'recommendation_items_too_many'; end if;

  for v_item in select * from jsonb_array_elements(p_items) loop
    v_rank := v_rank + 1;
    insert into public.yorisou_recommendation_items
      (set_id, owner_account_id, result_row_id, rank, recommendation_key, object_type,
       source_class, commercial_status, reason_code, limitations_code)
    values
      (v_set, p_owner_account_id, p_result_row_id, v_rank,
       v_item->>'recommendationKey', v_item->>'objectType', v_item->>'sourceClass',
       coalesce(v_item->>'commercialStatus','none'), v_item->>'reasonCode', v_item->>'limitationsCode');
  end loop;

  return v_set;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Record a signal. Re-checks eligibility, so a later rejection stops NEW signals too.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_recommendation_act(
  p_item_id uuid, p_owner_account_id text, p_action text, p_source_surface text,
  p_intent_nonce uuid default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_item public.yorisou_recommendation_items%rowtype; v_id uuid; v_existing uuid;
begin
  select * into v_item from public.yorisou_recommendation_items
   where id = p_item_id and owner_account_id = p_owner_account_id;
  if not found then raise exception 'recommendation_item_not_found'; end if;

  -- Raises recommendation_not_permitted when consent has since been withdrawn.
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
    select id into v_id from public.yorisou_recommendation_actions
     where item_id = p_item_id and owner_account_id = p_owner_account_id and intent_nonce = p_intent_nonce;
    if v_id is null then raise; end if;
  end;
  return v_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. ERASURE EXTENDED — the deletion promise becomes true.
--    The UI already told people their recommendations and feedback would be removed. Until this
--    function existed, that was a claim the database did not support. Sets/items/actions cascade
--    from the result row, so removing the result removes the whole graph in ONE transaction.
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

  -- Recommendation graph first, while the owner linkage still exists to authorize it.
  delete from public.yorisou_recommendation_actions where result_row_id = p_result_row_id;
  delete from public.yorisou_recommendation_items  where result_row_id = p_result_row_id;
  delete from public.yorisou_recommendation_sets   where result_row_id = p_result_row_id;

  -- Interpretation responses carry corrections, reasons and idempotency nonces.
  perform set_config('yorisou.erasure_context', p_result_row_id::text, true);
  delete from public.yorisou_interpretation_responses where result_row_id = p_result_row_id;
  perform set_config('yorisou.erasure_context', '', true);

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

  update public.yorisou_assessment_attempts
     set answers = '{}'::jsonb, answered_count = 0, claim_token_hash = null,
         status = 'abandoned', completed_at = null, owner_account_id = null, claimed_at = null,
         expires_at = null, updated_at = now()
   where id = v_attempt;

  return v_rows > 0;
end;
$$;

revoke all on function public.yorisou_recommendation_eligibility(uuid, text) from public, anon, authenticated;
revoke all on function public.yorisou_recommendation_materialize(uuid, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.yorisou_recommendation_act(uuid, text, text, text, uuid) from public, anon, authenticated;
grant execute on function public.yorisou_recommendation_eligibility(uuid, text) to service_role;
grant execute on function public.yorisou_recommendation_materialize(uuid, text, text, text, jsonb) to service_role;
grant execute on function public.yorisou_recommendation_act(uuid, text, text, text, uuid) to service_role;

commit;
