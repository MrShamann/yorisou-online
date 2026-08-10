-- POR-1 — governed account erasure across the append-only families.
--
-- PRODUCTION_LINEAGE. Forward-only. Inert while the deletion executor is off.
--
-- WHAT M4 FOUND.
--
-- With a real object store in the stack the deletion saga finally reached `database_erasure` and
-- failed:
--
--     append_only: DELETE on yorisou_daily_state_history_events is not permitted
--
-- `yorisou_account_deletion_erase_database` names every owner-linked family — M1 verified that — but
-- naming is not deleting. Six tables refuse DELETE through append-only triggers, two of them inside
-- the 26-family deletion contract. `erase_database` is one function, so a single trigger raise
-- aborts the whole transaction and NOTHING is erased. Total rather than partial, which is the safe
-- direction and still a failure.
--
-- THE FOUNDER DECISION THIS IMPLEMENTS.
--
--     GOVERNED_ERASURE_DELETE + CONTENT_FREE_TOMBSTONE
--
-- Append-only is a guarantee about the ORDINARY application path: history is never rewritten, so a
-- record of what someone reported cannot be silently altered. It was never a promise to keep a
-- person's content after they asked to be deleted. So the original rows are physically removed and a
-- new, content-free tombstone records that a deletion happened.
--
-- Explicitly NOT chosen, and each for a reason:
--
--     in-place de-identification   an UPDATE on an append-only row is the exact rewrite the trigger
--                                  exists to prevent, and it leaves altered remnants of the content
--     excluding these families     "it is append-only" is not a privacy basis for keeping content
--     a general trigger bypass     a bypass reachable from ordinary code is a larger hole than the
--                                  one it closes
--
-- WHAT THIS MIGRATION DOES NOT DO.
--
--   - it does not weaken UPDATE, DELETE or TRUNCATE on any ordinary path
--   - it does not touch `yorisou_candidate_events`, which is classified separately below
--   - it does not schedule any purge
--   - it creates no general-purpose erasure function

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. AN OWNER-FREE TOMBSTONE HAS TO BE REPRESENTABLE.
--
--    Both event tables declare `owner_account_id text not null`, and the Founder decision is that an
--    account-deletion tombstone must not retain the owner. Dropping NOT NULL outright would let an
--    ORDINARY event be written with no owner, which weakens a guarantee nobody asked to weaken.
--
--    So the column becomes nullable and a shape constraint restores the rule for every row that is
--    not a tombstone — the same pattern `yorisou_account_deletion_jobs_owner_shape` already uses.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.yorisou_daily_state_history_events alter column owner_account_id drop not null;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'yorisou_daily_state_history_events_owner_shape') then
    alter table public.yorisou_daily_state_history_events
      add constraint yorisou_daily_state_history_events_owner_shape
      check (owner_account_id is not null or event_type = 'deleted');
  end if;
end $$;

alter table public.yorisou_values_assessment_events alter column owner_account_id drop not null;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'yorisou_values_assessment_events_owner_shape') then
    alter table public.yorisou_values_assessment_events
      add constraint yorisou_values_assessment_events_owner_shape
      check (owner_account_id is not null or event_type = 'deleted');
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. THE AUTHORIZATION THE TRIGGER ACTUALLY TRUSTS.
--
--    A transaction-local setting is a signal, not an authorization. `set_config` is reachable from
--    any SQL a role can execute, so a trigger that accepts `current_setting(...) = 'on'` and asks
--    nothing else has a bypass with no lock on it.
--
--    This function is the lock. The setting names a deletion JOB, and every clause below re-derives
--    from durable state whether that job is genuinely mid-erasure for this owner right now:
--
--      the job exists and belongs to this owner
--      a manifest was FROZEN — so the scope of the deletion was fixed before anything was destroyed
--      the irreversible boundary was crossed — the person is committed, not browsing
--      the cursor is exactly `database_erasure` — not before it, not after it
--
--    Forging the setting therefore accomplishes nothing without a real, active, mid-erasure job.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_erasure_authorized(p_owner_account_id text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_job_id text := coalesce(current_setting('yorisou.account_erasure_job_id', true), '');
  v_job    public.yorisou_account_deletion_jobs%rowtype;
begin
  if v_job_id = '' or p_owner_account_id is null then return false; end if;

  begin
    select * into v_job from public.yorisou_account_deletion_jobs where id = v_job_id::uuid;
  exception when invalid_text_representation then
    return false;   -- the setting is not even a job id
  end;
  if not found then return false; end if;

  -- The job must be THIS person's. A valid context for one account must never authorise deleting
  -- another account's rows.
  if v_job.owner_account_id is distinct from p_owner_account_id then return false; end if;

  -- Frozen manifest: the scope was fixed while the account still existed.
  if not exists (select 1 from public.yorisou_account_deletion_manifests where job_id = v_job.id) then
    return false;
  end if;

  -- Past the point of no return, and at the erasure stage specifically.
  if v_job.irreversible_started_at is null then return false; end if;
  if v_job.execution_cursor is distinct from 'database_erasure' then return false; end if;

  return true;
end;
$$;

revoke all on function public.yorisou_account_erasure_authorized(text) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.yorisou_account_erasure_authorized(text) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.yorisou_account_erasure_authorized(text) from authenticated;
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. THE TRIGGERS.
--
--    Two accepted contexts, deliberately distinct:
--
--      yorisou.dci_governed_erase / yorisou.values_governed_erase — the EXISTING single-record
--        delete path, where the account survives and there is no deletion job to validate against.
--        Left exactly as it was; re-litigating it is not this migration's job.
--
--      yorisou.account_erasure_job_id — the NEW account-deletion path, validated in full by
--        `yorisou_account_erasure_authorized`.
--
--    Everything else still raises. UPDATE and TRUNCATE are never permitted by either context.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_dci_block_mutation()
returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE' and current_setting('yorisou.dci_governed_erase', true) = 'on' then
    return old;   -- existing single-record governed delete
  end if;
  -- Account erasure. `old.owner_account_id` is the row's own owner, so the check is per row: a
  -- context for one account cannot carry another account's rows out with it.
  if tg_op = 'DELETE' and public.yorisou_account_erasure_authorized(old.owner_account_id) then
    return old;
  end if;
  raise exception 'append_only: % on % is not permitted', tg_op, tg_table_name;
end;
$$;

create or replace function public.yorisou_values_block_mutation()
returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE' and current_setting('yorisou.values_governed_erase', true) = 'on' then
    return old;
  end if;
  if tg_op = 'DELETE' and public.yorisou_account_erasure_authorized(old.owner_account_id) then
    return old;
  end if;
  raise exception 'append_only: % on % is not permitted', tg_op, tg_table_name;
end;
$$;

-- The version tables carry no owner column of their own; ownership is reachable only through the
-- parent. `erase_database` deletes them by an EXISTS on the parent, so the row-level check resolves
-- the owner the same way rather than trusting the context alone.
create or replace function public.yorisou_dci_block_version_mutation()
returns trigger language plpgsql as $$
declare v_owner text;
begin
  if tg_op = 'DELETE' and current_setting('yorisou.dci_governed_erase', true) = 'on' then
    return old;
  end if;
  if tg_op = 'DELETE' then
    select r.owner_account_id into v_owner
      from public.yorisou_daily_state_records r where r.id = old.record_id;
    if v_owner is not null and public.yorisou_account_erasure_authorized(v_owner) then
      return old;
    end if;
  end if;
  raise exception 'append_only: % on % is not permitted', tg_op, tg_table_name;
end;
$$;

create or replace function public.yorisou_values_block_version_mutation()
returns trigger language plpgsql as $$
declare v_owner text;
begin
  if tg_op = 'DELETE' and current_setting('yorisou.values_governed_erase', true) = 'on' then
    return old;
  end if;
  if tg_op = 'DELETE' then
    select a.owner_account_id into v_owner
      from public.yorisou_values_assessments a where a.id = old.assessment_id;
    if v_owner is not null and public.yorisou_account_erasure_authorized(v_owner) then
      return old;
    end if;
  end if;
  raise exception 'append_only: % on % is not permitted', tg_op, tg_table_name;
end;
$$;

-- Point the version tables at their own guards. The DELETE/UPDATE trigger is replaced; the TRUNCATE
-- guard is untouched, because TRUNCATE is never permitted by any context.
drop trigger if exists yorisou_daily_state_record_versions_no_mutate on public.yorisou_daily_state_record_versions;
create trigger yorisou_daily_state_record_versions_no_mutate
  before delete or update on public.yorisou_daily_state_record_versions
  for each row execute function public.yorisou_dci_block_version_mutation();

drop trigger if exists yorisou_values_versions_no_mutate on public.yorisou_values_assessment_versions;
create trigger yorisou_values_versions_no_mutate
  before delete or update on public.yorisou_values_assessment_versions
  for each row execute function public.yorisou_values_block_version_mutation();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. THE ERASURE ITSELF.
--
--    `erase_database` gains the context and the tombstones. Order matters and is the contract:
--    content is removed FIRST, tombstones are written AFTER, and both happen inside the single
--    transaction the caller already wraps — so a failure anywhere rolls back to "nothing deleted,
--    no tombstone", never to "content gone, no record" or "record written, content still there".
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_erase_append_only_families(
  p_owner_account_id text,
  p_job_id uuid
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_counts jsonb := '{}'::jsonb;
  v_count  bigint;
  v_rec    record;
  v_tombstones int := 0;
begin
  -- The context is set here and nowhere else in the application. It names the job, and the trigger
  -- re-derives every fact from that job rather than believing the setting.
  perform set_config('yorisou.account_erasure_job_id', p_job_id::text, true);

  -- ── DCI ────────────────────────────────────────────────────────────────────
  if to_regclass('public.yorisou_daily_state_records') is not null then
    -- Remember which records existed, so a tombstone can reference one after it is gone.
    create temporary table if not exists _por1_dci_erased (record_id uuid) on commit drop;
    delete from _por1_dci_erased;
    insert into _por1_dci_erased (record_id)
      select id from public.yorisou_daily_state_records where owner_account_id = p_owner_account_id;

    if to_regclass('public.yorisou_daily_state_record_versions') is not null then
      delete from public.yorisou_daily_state_record_versions v
       where exists (select 1 from _por1_dci_erased e where e.record_id = v.record_id);
      get diagnostics v_count = row_count;
      v_counts := v_counts || jsonb_build_object('yorisou_daily_state_record_versions', v_count);
    end if;

    if to_regclass('public.yorisou_daily_state_history_events') is not null then
      delete from public.yorisou_daily_state_history_events
       where owner_account_id = p_owner_account_id;
      get diagnostics v_count = row_count;
      v_counts := v_counts || jsonb_build_object('yorisou_daily_state_history_events_content', v_count);

      -- ONE content-free tombstone per erased record. No owner, no state, no memo, no reason text —
      -- an opaque record reference, the fact of deletion, and when it stops being kept.
      for v_rec in select record_id from _por1_dci_erased loop
        insert into public.yorisou_daily_state_history_events
          (record_id, owner_account_id, event_type, version, reason_code, retention_expires_at)
        values (v_rec.record_id, null, 'deleted', 0, 'user_deleted', now() + interval '12 months');
        v_tombstones := v_tombstones + 1;
      end loop;
    end if;
  end if;

  -- ── YV ─────────────────────────────────────────────────────────────────────
  if to_regclass('public.yorisou_values_assessments') is not null then
    create temporary table if not exists _por1_yv_erased (assessment_id uuid) on commit drop;
    delete from _por1_yv_erased;
    insert into _por1_yv_erased (assessment_id)
      select id from public.yorisou_values_assessments where owner_account_id = p_owner_account_id;

    if to_regclass('public.yorisou_values_assessment_versions') is not null then
      delete from public.yorisou_values_assessment_versions v
       where exists (select 1 from _por1_yv_erased e where e.assessment_id = v.assessment_id);
      get diagnostics v_count = row_count;
      v_counts := v_counts || jsonb_build_object('yorisou_values_assessment_versions', v_count);
    end if;

    if to_regclass('public.yorisou_values_assessment_events') is not null then
      delete from public.yorisou_values_assessment_events
       where owner_account_id = p_owner_account_id;
      get diagnostics v_count = row_count;
      v_counts := v_counts || jsonb_build_object('yorisou_values_assessment_events_content', v_count);

      for v_rec in select assessment_id from _por1_yv_erased loop
        insert into public.yorisou_values_assessment_events
          (assessment_id, owner_account_id, event_type, version, reason_code, retention_expires_at)
        values (v_rec.assessment_id, null, 'deleted', 0, 'user_deleted', now() + interval '12 months');
        v_tombstones := v_tombstones + 1;
      end loop;
    end if;
  end if;

  return v_counts || jsonb_build_object('content_free_tombstones', v_tombstones);
end;
$$;

revoke all on function public.yorisou_account_erase_append_only_families(text, uuid) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.yorisou_account_erase_append_only_families(text, uuid) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.yorisou_account_erase_append_only_families(text, uuid) from authenticated;
  end if;
  -- Deliberately NOT granted to service_role. It is an internal step of the erasure saga, not an
  -- entry point — the same reasoning that keeps `yorisou_line_subject_lock` unreachable.
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. WIRE IT INTO THE SAGA.
--
--    `erase_database` already deletes these families through its declarative plan, where the trigger
--    refuses. The append-only families are now handled first, by the function above, and the plan
--    entries become no-ops because their rows are already gone.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare v_src text;
begin
  select pg_get_functiondef(p.oid) into v_src
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname = 'yorisou_account_deletion_erase_database';
  if v_src is null then
    raise exception 'POR-1: yorisou_account_deletion_erase_database is missing; apply the deletion lifecycle first';
  end if;
end $$;

-- The saga's erasure step, replaced so the append-only families are handled inside the SAME
-- transaction. Splitting it into a second RPC would give up the all-or-nothing property that made
-- the original failure safe.
create or replace function public.yorisou_account_deletion_erase_database(p_owner_account_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_id       uuid;
  v_plan     text[][] := array[
    -- identity-linked tables, owner column. Legacy AND canonical families both appear: a person's
    -- deletion must not depend on which generation of the product created the row.
    ['yorisou_test_results','owner_account_id'],
    ['yorisou_ai_reflections','owner_account_id'],
    ['yorisou_ai_runs','owner_account_id'],
    ['yorisou_daily_state_history_events','owner_account_id'],
    ['yorisou_daily_state_record_versions','record_id_owner_indirect'],   -- handled via parent below
    ['yorisou_daily_state_records','owner_account_id'],
    ['yorisou_values_assessment_events','owner_account_id'],
    ['yorisou_values_assessment_versions','assessment_id_owner_indirect'],-- handled via parent below
    ['yorisou_values_assessments','owner_account_id'],
    ['yorisou_private_check_in_plans','owner_account_id'],
    ['yorisou_private_memory_items','owner_account_id'],
    ['yorisou_private_recommendations','owner_account_id'],
    ['yorisou_experience_cards','owner_account_id'],
    ['yorisou_experience_consents','owner_account_id'],
    ['yorisou_experience_invites','owner_account_id'],
    ['yorisou_experience_revisions','owner_account_id'],
    ['yorisou_experience_visibility_events','owner_account_id'],
    ['yorisou_experience_events','actor_account_id'],
    ['yorisou_experience_interactions','actor_account_id'],
    ['yorisou_experience_moderation_events','actor_account_id'],
    ['yorisou_experience_reports','reporter_account_id'],
    ['yorisou_experience_blocks','blocker_account_id'],
    ['yorisou_experience_blocks','blocked_owner_account_id'],
    ['yorisou_recommendation_events','owner_account_id'],
    ['yorisou_recommendation_reports','owner_account_id'],
    ['yorisou_recommendation_returns','owner_account_id'],
    ['yorisou_recommendation_actions','owner_account_id'],
    ['yorisou_recommendation_sets','owner_account_id'],
    ['yorisou_canonical_recommendation_actions','owner_account_id'],
    ['yorisou_canonical_recommendation_items','owner_account_id'],
    ['yorisou_canonical_recommendation_sets','owner_account_id'],
    ['yorisou_account_deletion_requests','owner_account_id']
  ];
  v_i        integer;
  v_table    text;
  v_column   text;
  v_count    bigint;
  v_counts   jsonb := '{}'::jsonb;
  v_result   record;
begin
  select id into v_id from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id;
  if not found then raise exception 'account_deletion_job_not_found'; end if;

  -- 5.0 APPEND-ONLY FAMILIES FIRST.
  --
  -- These refuse DELETE on the ordinary path, which is what M4 hit: one trigger raise aborted the
  -- whole statement and none of the 26 families were erased. They are handled here, inside the same
  -- transaction, so the ordering guarantee holds — content removed, then tombstones written, and any
  -- failure rolls back to "nothing deleted, no tombstone".
  v_counts := v_counts || public.yorisou_account_erase_append_only_families(p_owner_account_id, v_id);

  -- 5.1 Canonical RESULTS go through the governed owner-scoped erasure, which clears the
  --     reconstructable content and leaves the contractual content-free tombstone. Deleting them
  --     outright here would quietly weaken the erasure contract the product publishes.
  if to_regclass('public.yorisou_assessment_results') is not null then
    v_count := 0;
    for v_result in
      select id from public.yorisou_assessment_results
       where owner_account_id = p_owner_account_id and deleted_at is null
    loop
      perform public.yorisou_assessment_result_erase(v_result.id, p_owner_account_id);
      v_count := v_count + 1;
    end loop;
    v_counts := v_counts || jsonb_build_object('yorisou_assessment_results_erased', v_count);
  end if;

  -- 5.2 Attempts hold the raw answers; they are removed, not tombstoned.
  if to_regclass('public.yorisou_assessment_attempts') is not null then
    delete from public.yorisou_assessment_attempts where owner_account_id = p_owner_account_id;
    get diagnostics v_count = row_count;
    v_counts := v_counts || jsonb_build_object('yorisou_assessment_attempts', v_count);
  end if;

  -- 5.3 Child rows whose ownership is only reachable through a parent.
  if to_regclass('public.yorisou_daily_state_record_versions') is not null
     and to_regclass('public.yorisou_daily_state_records') is not null then
    delete from public.yorisou_daily_state_record_versions v
     where exists (select 1 from public.yorisou_daily_state_records r
                    where r.id = v.record_id and r.owner_account_id = p_owner_account_id);
    get diagnostics v_count = row_count;
    v_counts := v_counts || jsonb_build_object('yorisou_daily_state_record_versions', v_count);
  end if;

  if to_regclass('public.yorisou_values_assessment_versions') is not null
     and to_regclass('public.yorisou_values_assessments') is not null then
    delete from public.yorisou_values_assessment_versions v
     where exists (select 1 from public.yorisou_values_assessments a
                    where a.id = v.assessment_id and a.owner_account_id = p_owner_account_id);
    get diagnostics v_count = row_count;
    v_counts := v_counts || jsonb_build_object('yorisou_values_assessment_versions', v_count);
  end if;

  -- 5.4 The declarative plan.
  for v_i in 1 .. array_length(v_plan, 1) loop
    v_table  := v_plan[v_i][1];
    v_column := v_plan[v_i][2];
    if v_column like '%_owner_indirect' then continue; end if;   -- handled above
    if to_regclass('public.' || v_table) is null then
      v_counts := v_counts || jsonb_build_object(v_table, 'absent');
      continue;
    end if;
    if not exists (select 1 from information_schema.columns
                    where table_schema='public' and table_name=v_table and column_name=v_column) then
      v_counts := v_counts || jsonb_build_object(v_table, 'column_absent');
      continue;
    end if;
    execute format('delete from public.%I where %I = $1', v_table, v_column) using p_owner_account_id;
    get diagnostics v_count = row_count;
    v_counts := v_counts || jsonb_build_object(
      case when v_counts ? v_table then v_table || ':' || v_column else v_table end, v_count);
  end loop;

  insert into public.yorisou_account_deletion_audit (job_id, stage, outcome, detail)
  values (v_id, 'database_erasure', 'ok', jsonb_build_object('counts', v_counts));

  return v_counts;
end;
$$;

comment on function public.yorisou_account_erase_append_only_families(text, uuid) is
  'POR-1 governed account erasure for append-only families. Deletes content, then writes one content-free tombstone per erased source record. Called only by the deletion saga.';

commit;
