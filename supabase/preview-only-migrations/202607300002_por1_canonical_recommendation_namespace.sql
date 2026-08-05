-- POR-1 — PREVIEW_ONLY forward-only corrective migration.
--
-- Moves the CPC-1 recommendation family out of the legacy namespace.
--
-- WHY: `yorisou_recommendation_{sets,items,actions}` already exist in PRODUCTION from legacy
-- migration 202607110003 (the governed recommendation graph) with a COMPLETELY DIFFERENT shape and
-- REAL DATA, and both consumers ship in one application. Promoting the CPC-1 chain as-is would have
-- silently no-opped `create table if not exists` against the legacy tables, reported a green
-- migration ledger, and left every canonical recommendation path failing at runtime on missing
-- columns. See docs/ux2r/06_POR1_MIGRATION_PROMOTION_ARCHAEOLOGY.md.
--
-- This migration is FORWARD-ONLY and does not amend any already-applied migration file: the applied
-- Preview history stays byte-identical and checksum-stable. A fresh chain therefore creates the
-- pre-rename names in 202607280004..07 and arrives at the canonical names here, deterministically.
--
-- The LEGACY family is never touched by this migration. It is Production's, it holds real rows, and
-- it keeps serving the legacy recommendation graph.

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. SHAPE GUARD — fail loudly rather than rename something unexpected.
--
-- Renaming is only correct if these tables are the CPC-1 family. If a legacy-shaped or MIXED table
-- is present, this database is not what the migration assumes and a rename would corrupt it.
-- ─────────────────────────────────────────────────────────────────────────────
do $por1$
declare
  v_missing text;
  v_legacy  text;
begin
  -- Required CPC-1 columns must all be present.
  select string_agg(x.t || '.' || x.c, ', ')
    into v_missing
    from (values
      ('yorisou_recommendation_sets','result_row_id'),
      ('yorisou_recommendation_sets','eligibility_basis'),
      ('yorisou_recommendation_sets','lifecycle_state'),
      ('yorisou_recommendation_items','set_id'),
      ('yorisou_recommendation_items','recommendation_key'),
      ('yorisou_recommendation_items','result_row_id'),
      ('yorisou_recommendation_actions','item_id'),
      ('yorisou_recommendation_actions','intent_nonce'),
      ('yorisou_recommendation_actions','sequence_no')
    ) as x(t,c)
   where not exists (
     select 1 from information_schema.columns
      where table_schema = 'public' and table_name = x.t and column_name = x.c);

  if v_missing is not null then
    raise exception 'POR-1 rename aborted: expected CPC-1 columns are absent (%). This database does not hold the CPC-1 recommendation family.', v_missing;
  end if;

  -- No legacy column may be present: that would mean the two families were merged.
  select string_agg(x.t || '.' || x.c, ', ')
    into v_legacy
    from (values
      ('yorisou_recommendation_sets','request_key'),
      ('yorisou_recommendation_sets','project_id'),
      ('yorisou_recommendation_items','recommendation_set_id'),
      ('yorisou_recommendation_items','resource_id'),
      ('yorisou_recommendation_actions','idempotency_key'),
      ('yorisou_recommendation_actions','recommendation_item_id')
    ) as x(t,c)
   where exists (
     select 1 from information_schema.columns
      where table_schema = 'public' and table_name = x.t and column_name = x.c);

  if v_legacy is not null then
    raise exception 'POR-1 rename aborted: LEGACY columns found on the CPC-1 tables (%). The two schema families have been merged and must be separated by hand.', v_legacy;
  end if;

  -- The canonical names must not already exist under a different definition.
  if exists (select 1 from pg_tables where schemaname='public' and tablename='yorisou_canonical_recommendation_sets') then
    raise exception 'POR-1 rename aborted: yorisou_canonical_recommendation_sets already exists.';
  end if;
end
$por1$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. RENAME the tables. Row identity, PK values and FK relationships are preserved —
--    ALTER TABLE ... RENAME rewrites no data and re-points dependent constraints automatically.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.yorisou_recommendation_sets    rename to yorisou_canonical_recommendation_sets;
alter table public.yorisou_recommendation_items   rename to yorisou_canonical_recommendation_items;
alter table public.yorisou_recommendation_actions rename to yorisou_canonical_recommendation_actions;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. RENAME constraints and indexes so no object still advertises the legacy family name.
--    Purely cosmetic for behaviour, load-bearing for the CI guard in §15 and for anyone reading a
--    Production schema dump later.
-- ─────────────────────────────────────────────────────────────────────────────
do $por1$
declare r record; v_new text;
begin
  for r in
    select conname, conrelid::regclass::text as tbl
      from pg_constraint
     where conrelid::regclass::text like 'yorisou_canonical_recommendation%'
       and conname like 'yorisou_recommendation%'
  loop
    v_new := replace(r.conname, 'yorisou_recommendation', 'yorisou_canonical_recommendation');
    execute format('alter table public.%I rename constraint %I to %I', r.tbl, r.conname, v_new);
  end loop;

  for r in
    select indexname, tablename
      from pg_indexes
     where schemaname = 'public'
       and tablename like 'yorisou_canonical_recommendation%'
       and indexname like 'yorisou_recommendation%'
  loop
    v_new := replace(r.indexname, 'yorisou_recommendation', 'yorisou_canonical_recommendation');
    execute format('alter index public.%I rename to %I', r.indexname, v_new);
  end loop;
end
$por1$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. RECREATE the functions against the canonical tables, under canonical names.
--
-- These bodies are the AUTHORITATIVE definitions read back from the Preview database with
-- pg_get_functiondef and mechanically re-pointed — not hand-transcribed — so the accumulated
-- semantics of 202607280004..07 survive the rename exactly.
--
-- yorisou_assessment_result_erase keeps its name (it belongs to the result family, not the
-- recommendation family) and only its recommendation references move.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.yorisou_canonical_recommendation_eligibility(p_result_row_id uuid, p_owner_account_id text)
 RETURNS TABLE(accepted_result_id text, original_result_id text, basis text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.yorisou_canonical_recommendation_materialize(p_result_row_id uuid, p_owner_account_id text, p_content_version text, p_source_surface text, p_items jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_e record; v_set uuid; v_item jsonb; v_rank integer := 0;
begin
  select * into v_e from public.yorisou_canonical_recommendation_eligibility(p_result_row_id, p_owner_account_id);

  select id into v_set from public.yorisou_canonical_recommendation_sets
   where result_row_id = p_result_row_id and owner_account_id = p_owner_account_id
     and accepted_result_id = v_e.accepted_result_id and content_version = p_content_version
     and lifecycle_state = 'active'
   order by generated_at desc limit 1;
  if v_set is not null then return v_set; end if;

  -- A change of accepted result supersedes earlier sets rather than deleting them: what was
  -- recommended under a previous self-understanding is part of the person's history.
  update public.yorisou_canonical_recommendation_sets set lifecycle_state = 'superseded'
   where result_row_id = p_result_row_id and owner_account_id = p_owner_account_id
     and lifecycle_state = 'active';

  insert into public.yorisou_canonical_recommendation_sets
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
    insert into public.yorisou_canonical_recommendation_items
      (set_id, owner_account_id, result_row_id, rank, recommendation_key, object_type,
       source_class, commercial_status, reason_code, limitations_code)
    values
      (v_set, p_owner_account_id, p_result_row_id, v_rank,
       v_item->>'recommendationKey', v_item->>'objectType', v_item->>'sourceClass',
       coalesce(v_item->>'commercialStatus','none'), v_item->>'reasonCode', v_item->>'limitationsCode');
  end loop;

  return v_set;
end;
$function$;

CREATE OR REPLACE FUNCTION public.yorisou_canonical_recommendation_act(p_item_id uuid, p_owner_account_id text, p_action text, p_source_surface text, p_intent_nonce uuid DEFAULT NULL::uuid, p_result_row_id uuid DEFAULT NULL::uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_item public.yorisou_canonical_recommendation_items%rowtype;
        v_set public.yorisou_canonical_recommendation_sets%rowtype;
        v_existing public.yorisou_canonical_recommendation_actions%rowtype; v_id uuid;
begin
  select * into v_item from public.yorisou_canonical_recommendation_items
   where id = p_item_id and owner_account_id = p_owner_account_id;
  if not found then raise exception 'recommendation_item_not_found'; end if;

  select * into v_set from public.yorisou_canonical_recommendation_sets
   where id = v_item.set_id and owner_account_id = p_owner_account_id;
  if not found then raise exception 'recommendation_item_not_found'; end if;

  if p_result_row_id is not null then
    if v_item.result_row_id is distinct from p_result_row_id
       or v_set.result_row_id is distinct from p_result_row_id then
      raise exception 'recommendation_item_not_found';   -- concealed
    end if;
  end if;

  perform public.yorisou_canonical_recommendation_eligibility(v_item.result_row_id, p_owner_account_id);

  if p_intent_nonce is not null then
    select * into v_existing from public.yorisou_canonical_recommendation_actions
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
    insert into public.yorisou_canonical_recommendation_actions
      (item_id, set_id, result_row_id, owner_account_id, action, source_surface, intent_nonce)
    values
      (p_item_id, v_item.set_id, v_item.result_row_id, p_owner_account_id, p_action,
       p_source_surface, p_intent_nonce)
    returning id into v_id;
  exception when unique_violation then
    -- Concurrent same-nonce request won. Re-read and apply the SAME comparison: a concurrent
    -- conflicting payload must not be absorbed just because it lost the race.
    select * into v_existing from public.yorisou_canonical_recommendation_actions
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
$function$;

CREATE OR REPLACE FUNCTION public.yorisou_assessment_result_erase(p_result_row_id uuid, p_owner_account_id text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare v_attempt uuid; v_rows integer;
begin
  select attempt_id into v_attempt from public.yorisou_assessment_results
   where id = p_result_row_id and owner_account_id = p_owner_account_id and deleted_at is null;
  if not found then return false; end if;

  -- Recommendation graph first, while the owner linkage still exists to authorize it.
  delete from public.yorisou_canonical_recommendation_actions where result_row_id = p_result_row_id;
  delete from public.yorisou_canonical_recommendation_items  where result_row_id = p_result_row_id;
  delete from public.yorisou_canonical_recommendation_sets   where result_row_id = p_result_row_id;

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
$function$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Grants. Same posture as the originals: service_role only, never anon/authenticated.
-- ─────────────────────────────────────────────────────────────────────────────
do $por1$
declare r record;
begin
  for r in
    select p.oid::regprocedure::text as sig
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname in ('yorisou_canonical_recommendation_eligibility',
                         'yorisou_canonical_recommendation_materialize',
                         'yorisou_canonical_recommendation_act')
  loop
    execute format('revoke all on function %s from public', r.sig);
    if exists (select 1 from pg_roles where rolname='anon') then
      execute format('revoke all on function %s from anon', r.sig);
    end if;
    if exists (select 1 from pg_roles where rolname='authenticated') then
      execute format('revoke all on function %s from authenticated', r.sig);
    end if;
    execute format('grant execute on function %s to service_role', r.sig);
  end loop;
end
$por1$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. DROP the superseded CPC-1 RPC names. Safe in the same transaction: the application adapter
--    that calls them is replaced in the same commit as this migration.
-- ─────────────────────────────────────────────────────────────────────────────
do $por1$
declare r record;
begin
  for r in
    select p.oid::regprocedure::text as sig
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname in ('yorisou_recommendation_eligibility',
                         'yorisou_recommendation_materialize',
                         'yorisou_recommendation_act')
  loop
    execute format('drop function if exists %s', r.sig);
  end loop;
end
$por1$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. POST-CONDITION — the migration proves its own outcome rather than assuming it.
-- ─────────────────────────────────────────────────────────────────────────────
do $por1$
declare v_left text;
begin
  select string_agg(tablename, ', ') into v_left
    from pg_tables
   where schemaname='public' and tablename in
     ('yorisou_recommendation_sets','yorisou_recommendation_items','yorisou_recommendation_actions');
  if v_left is not null then
    raise exception 'POR-1 post-condition failed: pre-rename CPC-1 tables still present (%)', v_left;
  end if;

  if (select count(*) from pg_tables where schemaname='public'
        and tablename in ('yorisou_canonical_recommendation_sets',
                          'yorisou_canonical_recommendation_items',
                          'yorisou_canonical_recommendation_actions')) <> 3 then
    raise exception 'POR-1 post-condition failed: the three canonical tables are not all present';
  end if;

  if exists (select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace
              where n.nspname='public' and p.proname in
                ('yorisou_recommendation_eligibility','yorisou_recommendation_materialize','yorisou_recommendation_act')) then
    raise exception 'POR-1 post-condition failed: a superseded CPC-1 recommendation RPC survives';
  end if;
end
$por1$;

commit;
