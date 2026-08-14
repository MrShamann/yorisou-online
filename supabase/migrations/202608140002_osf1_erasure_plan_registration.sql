-- OSF-1 — register the Phase 1 life-OS tables with the governed account-erasure plan.
--
-- PRODUCTION_LINEAGE. Forward-only. Inert while the deletion executor is off.
--
-- WHY THIS MIGRATION HAS TO EXIST.
--
-- POR-1 erasure does not discover tables. `yorisou_account_deletion_erase_database_unchecked`
-- carries a hardcoded `v_plan text[][]` and deletes exactly what that array names; a table it does
-- not name is silently skipped, and the job still reports `outcome = ok`. So a new owner-linked
-- table added by any package survives account deletion unless someone remembers to edit this array.
-- Adding the five OSF-1 tables to it is not an optimisation — without it, a person who deletes their
-- account keeps a current-state history, their goals, their reflections and their memories on the
-- server, while being told the deletion succeeded.
--
-- WHAT CHANGED, EXACTLY.
--
-- The function body below is 202608010110's body with five entries added to `v_plan` and nothing
-- else touched: same authority wrapper, same append-only handling, same canonical-result erase loop,
-- same audit row. The `_owner_indirect` sentinels, the `to_regclass` absent-table skip and the
-- `information_schema.columns` column-absent skip are unchanged, which is what makes this safe to
-- apply before or after 202608140001 — if the OSF-1 tables do not exist yet, they record as
-- `absent` instead of raising.
--
-- The permanent guard against this class of defect is
-- lib/server/__tests__/osf1ErasureCoverage.test.ts, which reads both this file and every migration
-- on disk and fails when an owner-linked table is not registered here.
--
-- ROLLBACK: re-apply 202608010110 verbatim. That restores the previous plan array; it removes no
-- data and drops no object.

begin;

create or replace function public.yorisou_account_deletion_erase_database_unchecked(p_owner_account_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_id       uuid;
  v_plan     text[][] := array[
    -- identity-linked tables, owner column. Legacy AND canonical families both appear: a person's
    -- deletion must not depend on which generation of the product created the row.
    -- OSF-1 life-OS families FIRST: yorisou_life_reflections and yorisou_explicit_memories carry
    -- foreign keys into yorisou_experience_cards and yorisou_goals, so they are removed before the
    -- rows they reference. The FKs are `on delete set null`, so ordering is not strictly required
    -- for correctness — it is here so the counts read in the order a person would expect.
    ['yorisou_explicit_memories','owner_account_id'],
    ['yorisou_life_reflections','owner_account_id'],
    ['yorisou_current_state_records','owner_account_id'],
    ['yorisou_goals','owner_account_id'],
    ['yorisou_user_contexts','owner_account_id'],
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

revoke all on function public.yorisou_account_deletion_erase_database_unchecked(text) from public;

commit;
