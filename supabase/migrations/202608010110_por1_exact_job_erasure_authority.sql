-- POR-1 — bind governed erasure to the EXACT executing job.
--
-- PRODUCTION_LINEAGE. Forward-only. Inert while the deletion executor is off.
--
-- THE GAP THIS CLOSES.
--
-- 202608010109 made the append-only families erasable under a governed context, and proved the
-- context cannot be forged. It left one thing unbound: `yorisou_account_deletion_erase_database`
-- took an OWNER and rediscovered a job from it, while the trigger authorization read a job id out of
-- a transaction-local setting. Two lookups, no guarantee they resolved the same row, and neither
-- looked at the job's STATE or at who was driving it.
--
-- `owner_account_id` is UNIQUE, so the owner lookup was not ambiguous — but "unambiguous" is a
-- weaker property than "the job this executor is actually running". These remained unproven:
--
--     a job sitting at cursor=database_erasure in a TERMINAL state (cancelled, completed,
--       failed_terminal, legal_hold) — a stale cursor is not authority
--     a job whose executor claim has EXPIRED, so nobody is driving it
--     a job held by a DIFFERENT live executor
--     a manifest belonging to some other job
--     a caller invoking the owner-level function outside the orchestrator's own job
--
-- So the erasure function now takes the job id the executor already holds, locks that row, and
-- validates it. The trigger resolves the same locked job through the same setting, and every check
-- is re-derived from durable state rather than from the caller's word.

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. THE SHARED PREDICATE.
--
--    One definition, consulted by both the erasure function and the trigger, so the two can never
--    drift into disagreeing about what "authorised" means.
--
--    `stable` rather than `immutable`: it reads tables, and a planner that cached it across the
--    transaction would be answering about a job state that no longer holds.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_erasure_job_valid(
  p_job_id uuid,
  p_owner_account_id text
) returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_job public.yorisou_account_deletion_jobs%rowtype;
begin
  if p_job_id is null or p_owner_account_id is null then return false; end if;

  select * into v_job from public.yorisou_account_deletion_jobs where id = p_job_id;
  if not found then return false; end if;

  -- The job must be THIS person's. A valid context for one account must never reach another's rows.
  if v_job.owner_account_id is distinct from p_owner_account_id then return false; end if;

  -- STATE, not just cursor. A cancelled or completed job can still carry `database_erasure` in its
  -- cursor column — that is a record of where it once was, not permission to destroy anything now.
  -- Only a job actively at the erasure stage, or one resuming after a retryable failure, may proceed.
  if v_job.state not in ('database_erasure', 'failed_retryable') then return false; end if;

  -- The frozen manifest must belong to THIS job. Another job's manifest describes another scope.
  if not exists (
    select 1 from public.yorisou_account_deletion_manifests where job_id = v_job.id
  ) then return false; end if;

  if v_job.irreversible_started_at is null then return false; end if;
  if v_job.execution_cursor is distinct from 'database_erasure' then return false; end if;

  -- SOMEONE MUST BE DRIVING IT. The executor claim is what says a run is in progress; an expired
  -- claim means the previous executor is gone and a governed reclaim has to happen first. Without
  -- this, an abandoned job left at the erasure stage would stay permanently armed.
  if v_job.executor_token_hash is null then return false; end if;
  if v_job.executor_expires_at is null or v_job.executor_expires_at <= now() then return false; end if;

  return true;
end;
$$;

revoke all on function public.yorisou_account_erasure_job_valid(uuid, text) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.yorisou_account_erasure_job_valid(uuid, text) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.yorisou_account_erasure_job_valid(uuid, text) from authenticated;
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. The trigger's view of it: same predicate, resolved from the transaction-local job id.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_erasure_authorized(p_owner_account_id text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_raw text := coalesce(current_setting('yorisou.account_erasure_job_id', true), '');
  v_job_id uuid;
begin
  if v_raw = '' then return false; end if;
  begin
    v_job_id := v_raw::uuid;
  exception when invalid_text_representation then
    return false;   -- the setting is not even a job id
  end;
  return public.yorisou_account_erasure_job_valid(v_job_id, p_owner_account_id);
end;
$$;

-- The unchanged erasure body, renamed. It is now reachable only through the authority wrapper below,
-- so there is no owner-only entry point that skips validation.
create or replace function public.yorisou_account_deletion_erase_database_unchecked(p_owner_account_id text)
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

revoke all on function public.yorisou_account_deletion_erase_database_unchecked(text) from public;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. THE ERASURE FUNCTION LOCKS AND VALIDATES ITS JOB.
--
--    `owner_account_id` is UNIQUE and is non-null for every job that has not completed, so an owner
--    resolves to exactly one job — the ambiguity a job id would remove does not exist here. What DID
--    matter, and was missing, is that the lookup was unlocked and unvalidated: no `FOR UPDATE`, no
--    state check, no look at whether any executor was actually driving the job.
--
--    So the resolution now happens under a row lock, in the same function that then sets the
--    transaction-local context from that same locked row. The trigger resolves the identical job.
--
--    An exact-job overload is also provided for the orchestrator to adopt once the executor claim
--    carries its job id; today the claim does not return one, and inventing a second lookup to
--    manufacture the argument would add a divergence rather than remove one.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_erase_database(
  p_job_id uuid,
  p_owner_account_id text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_job public.yorisou_account_deletion_jobs%rowtype;
begin
  -- FOR UPDATE: what is validated below and what is deleted afterwards must be one consistent job.
  -- Without the lock a concurrent cancel, or a claim expiring, could land between the two.
  select * into v_job from public.yorisou_account_deletion_jobs where id = p_job_id for update;
  if not found then raise exception 'account_deletion_job_not_found'; end if;

  if not public.yorisou_account_erasure_job_valid(p_job_id, p_owner_account_id) then
    -- One bounded code. Naming the failing clause would tell an unauthorised caller which part of
    -- the authority to forge next.
    raise exception 'account_deletion_erase_not_authorized';
  end if;

  perform set_config('yorisou.account_erasure_job_id', p_job_id::text, true);
  return public.yorisou_account_deletion_erase_database_unchecked(p_owner_account_id);
end;
$$;

-- The owner-taking entry point the orchestrator calls. It resolves the single job UNDER A LOCK and
-- delegates to the exact-job form, so both paths run the same authority check.
create or replace function public.yorisou_account_deletion_erase_database(p_owner_account_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_job_id uuid;
begin
  select id into v_job_id from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id
   for update;
  if not found then raise exception 'account_deletion_job_not_found'; end if;
  return public.yorisou_account_deletion_erase_database(v_job_id, p_owner_account_id);
end;
$$;

revoke all on function public.yorisou_account_deletion_erase_database(uuid, text) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.yorisou_account_deletion_erase_database(uuid, text) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.yorisou_account_deletion_erase_database(uuid, text) from authenticated;
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.yorisou_account_deletion_erase_database(uuid, text) to service_role;
  end if;
end $$;

comment on function public.yorisou_account_erasure_job_valid(uuid, text) is
  'POR-1: is this EXACT job authorised to erase this owner right now? Validates ownership, state, frozen manifest, irreversible crossing, cursor and a LIVE executor claim. A stale cursor alone is never authority.';

-- ── THE CLAIM MUST NAME THE JOB ──────────────────────────────────────────────
--
-- Owner-only rediscovery is the gap this migration closes, and closing it in SQL alone is not
-- enough: the application still has to be ABLE to name the job it claimed. The claim is the only
-- moment an executor learns which job it is driving, so the claim payload is where the identity
-- has to come from. Everything else is the executor guessing, and a guess by owner is precisely
-- the rediscovery being eliminated.
--
-- Additive only — existing fields keep their names and meanings, so an older client that ignores
-- job_id behaves exactly as before and falls back to the owner-only entry point, which still locks
-- and still validates.
create or replace function public.yorisou_account_deletion_executor_claim(
  p_owner_account_id text, p_token_hash text, p_ttl_seconds integer default 90
) returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare v_job public.yorisou_account_deletion_jobs%rowtype; v_cursor text;
begin
  if p_owner_account_id is null or char_length(p_owner_account_id) = 0 then
    raise exception 'account_deletion_owner_required';
  end if;
  if p_token_hash is null or char_length(p_token_hash) < 32 then
    raise exception 'account_deletion_executor_token_required';
  end if;
  if p_ttl_seconds is null or p_ttl_seconds < 5 or p_ttl_seconds > 600 then
    raise exception 'account_deletion_executor_ttl_out_of_range';
  end if;

  select * into v_job from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id for update;
  if not found then raise exception 'account_deletion_job_not_found'; end if;

  if v_job.state in ('completed','cancelled','failed_terminal','legal_hold') then
    raise exception 'account_deletion_not_claimable_%', v_job.state;
  end if;

  if v_job.executor_token_hash is not null
     and v_job.executor_token_hash <> p_token_hash
     and v_job.executor_expires_at is not null
     and v_job.executor_expires_at > now() then
    return jsonb_build_object(
      'claimed', false,
      'reason', 'executor_already_claimed',
      'generation', v_job.executor_generation,
      'cursor', v_job.execution_cursor,
      'irreversible', v_job.irreversible_started_at is not null
    );
  end if;

  v_cursor := coalesce(v_job.execution_cursor, 'mutation_draining');

  update public.yorisou_account_deletion_jobs
     set executor_token_hash = p_token_hash,
         executor_generation = executor_generation + 1,
         executor_claimed_at = now(),
         executor_expires_at = now() + make_interval(secs => p_ttl_seconds),
         execution_cursor    = v_cursor,
         updated_at          = now()
   where id = v_job.id
  returning * into v_job;

  return jsonb_build_object(
    'claimed', true,
    'job_id', v_job.id,
    'generation', v_job.executor_generation,
    'cursor', v_job.execution_cursor,
    'state', v_job.state,
    'irreversible', v_job.irreversible_started_at is not null,
    'attemptCount', v_job.attempt_count
  );
end;
$$;

revoke all on function public.yorisou_account_deletion_executor_claim(text, text, integer) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.yorisou_account_deletion_executor_claim(text, text, integer) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.yorisou_account_deletion_executor_claim(text, text, integer) from authenticated;
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.yorisou_account_deletion_executor_claim(text, text, integer) to service_role;
  end if;
end $$;

commit;
