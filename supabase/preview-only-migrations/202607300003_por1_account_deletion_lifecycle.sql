-- POR-1 Workstream A — governed account-deletion lifecycle. PREVIEW_ONLY (promoted separately).
--
-- The product previously had `yorisou_account_deletion_requests`, which recorded that someone had
-- ASKED to be deleted and then did nothing. This migration adds the durable saga and the executor
-- that actually erases the account, so "delete my account" stops being a promise and becomes a
-- mechanism.
--
-- Design notes that matter:
--   • The job is DURABLE. A browser close, a lambda timeout or a process restart must not lose a
--     deletion in flight, so every stage boundary is persisted and the executor is resumable.
--   • The plan is DECLARATIVE and executed with a `to_regclass` guard, because the identity-linked
--     table set differs per environment (Preview holds a subset of Production's). A table that is
--     absent is recorded as skipped — never silently treated as erased.
--   • Results are ERASED through the existing owner-scoped contract (content-free tombstone), not
--     deleted, because the frozen erasure contract requires the tombstone to survive. Everything
--     else identity-linked is removed outright.
--   • The audit is content-free by construction: bounded per-table counts and stage names only.
--   • On COMPLETED the raw account id is replaced by a one-way fingerprint, so replay protection
--     survives without retaining the identifier of a person who asked to be forgotten.

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. The durable saga.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_account_deletion_jobs (
  id                  uuid primary key default gen_random_uuid(),
  owner_account_id    text unique,
  owner_fingerprint   text not null,
  state               text not null default 'requested'
                        check (state in ('requested','identity_verified','locked','database_erasure',
                                         'storage_erasure','identity_erasure','verifying','completed',
                                         'failed_retryable','failed_terminal','cancelled','legal_hold')),
  contract_version    text not null default 'por1-v1',
  attempt_count       integer not null default 0 check (attempt_count >= 0),
  last_error_code     text check (last_error_code is null or char_length(last_error_code) <= 80),
  legal_hold_reason   text check (legal_hold_reason is null or char_length(legal_hold_reason) <= 200),
  requested_at        timestamptz not null default now(),
  verified_at         timestamptz,
  locked_at           timestamptz,
  completed_at        timestamptz,
  cancelled_at        timestamptz,
  updated_at          timestamptz not null default now(),
  -- A live job must still know whose account it is; a finished one must not.
  constraint yorisou_account_deletion_jobs_owner_shape check (
    (state = 'completed' and owner_account_id is null)
    or (state <> 'completed' and owner_account_id is not null)
  )
);

create index if not exists yorisou_account_deletion_jobs_state_idx
  on public.yorisou_account_deletion_jobs (state);
create index if not exists yorisou_account_deletion_jobs_fingerprint_idx
  on public.yorisou_account_deletion_jobs (owner_fingerprint);

create table if not exists public.yorisou_account_deletion_audit (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references public.yorisou_account_deletion_jobs(id) on delete cascade,
  stage       text not null check (char_length(stage) between 1 and 60),
  outcome     text not null check (outcome in ('ok','skipped','failed')),
  -- Bounded counts and table names ONLY. Never a row, an answer, an email or a token.
  detail      jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  constraint yorisou_account_deletion_audit_detail_is_bounded
    check (pg_column_size(detail) <= 4096)
);

create index if not exists yorisou_account_deletion_audit_job_idx
  on public.yorisou_account_deletion_audit (job_id, created_at);

alter table public.yorisou_account_deletion_jobs  enable row level security;
alter table public.yorisou_account_deletion_jobs  force row level security;
alter table public.yorisou_account_deletion_audit enable row level security;
alter table public.yorisou_account_deletion_audit force row level security;

revoke all on table public.yorisou_account_deletion_jobs  from public;
revoke all on table public.yorisou_account_deletion_audit from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname='anon') then
    revoke all on table public.yorisou_account_deletion_jobs  from anon;
    revoke all on table public.yorisou_account_deletion_audit from anon;
  end if;
  if exists (select 1 from pg_roles where rolname='authenticated') then
    revoke all on table public.yorisou_account_deletion_jobs  from authenticated;
    revoke all on table public.yorisou_account_deletion_audit from authenticated;
  end if;
  if exists (select 1 from pg_roles where rolname='service_role') then
    grant select on table public.yorisou_account_deletion_jobs  to service_role;
    grant select on table public.yorisou_account_deletion_audit to service_role;
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Fingerprint. One-way, so a completed job proves "this account was deleted" without holding
--    the account id. Salted with a fixed contract label rather than a secret: the goal is
--    irreversibility of casual lookup and stable replay detection, not key management.
-- ─────────────────────────────────────────────────────────────────────────────
-- Uses the built-in sha256() rather than pgcrypto's digest(): these functions pin
-- `search_path = public`, and Supabase installs pgcrypto into `extensions`, so digest() would not
-- resolve. sha256() lives in pg_catalog and is always reachable.
create or replace function public.yorisou_account_deletion_fingerprint(p_owner_account_id text)
returns text language sql immutable set search_path = public as $$
  select encode(sha256(convert_to('yorisou-account-deletion-v1:' || coalesce(p_owner_account_id, ''), 'utf8')), 'hex');
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Open (or resume) a deletion job. Idempotent: asking twice returns the same job.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_open(p_owner_account_id text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_state text;
begin
  if p_owner_account_id is null or char_length(p_owner_account_id) = 0 then
    raise exception 'account_deletion_owner_required';
  end if;

  select id, state into v_id, v_state
    from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id;

  if found then
    if v_state = 'legal_hold'    then raise exception 'account_deletion_legal_hold'; end if;
    if v_state = 'failed_terminal' then raise exception 'account_deletion_failed_terminal'; end if;
    -- A cancelled job may be reopened; anything else in flight is simply returned.
    if v_state = 'cancelled' then
      update public.yorisou_account_deletion_jobs
         set state='requested', cancelled_at=null, last_error_code=null, updated_at=now()
       where id = v_id;
    end if;
    return v_id;
  end if;

  insert into public.yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint)
  values (p_owner_account_id, public.yorisou_account_deletion_fingerprint(p_owner_account_id))
  returning id into v_id;

  insert into public.yorisou_account_deletion_audit (job_id, stage, outcome)
  values (v_id, 'requested', 'ok');
  return v_id;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Guarded transition. Illegal jumps are rejected rather than silently accepted, so a bug in the
--    orchestrator cannot mark a job COMPLETED without the work having happened.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_advance(
  p_owner_account_id text, p_to text, p_error_code text default null
) returns text language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_from text; v_ok boolean;
begin
  select id, state into v_id, v_from
    from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id
   for update;
  if not found then raise exception 'account_deletion_job_not_found'; end if;

  v_ok := case
    when p_to = 'identity_verified' then v_from in ('requested','failed_retryable')
    when p_to = 'locked'            then v_from in ('identity_verified','failed_retryable')
    when p_to = 'database_erasure'  then v_from in ('locked','failed_retryable','database_erasure')
    when p_to = 'storage_erasure'   then v_from in ('database_erasure','failed_retryable','storage_erasure')
    when p_to = 'identity_erasure'  then v_from in ('storage_erasure','failed_retryable','identity_erasure')
    when p_to = 'verifying'         then v_from in ('identity_erasure','failed_retryable','verifying')
    when p_to = 'failed_retryable'  then v_from not in ('completed','cancelled','failed_terminal','legal_hold')
    when p_to = 'failed_terminal'   then v_from not in ('completed','cancelled')
    when p_to = 'cancelled'         then v_from in ('requested','identity_verified')  -- never mid-erasure
    when p_to = 'legal_hold'        then v_from in ('requested','identity_verified','locked')
    else false
  end;

  if not v_ok then
    raise exception 'account_deletion_illegal_transition_%_to_%', v_from, p_to;
  end if;

  update public.yorisou_account_deletion_jobs
     set state           = p_to,
         verified_at     = case when p_to='identity_verified' then now() else verified_at end,
         locked_at       = case when p_to='locked'            then now() else locked_at   end,
         cancelled_at    = case when p_to='cancelled'         then now() else cancelled_at end,
         last_error_code = case when p_to like 'failed%' then left(coalesce(p_error_code,'unknown'), 80) else null end,
         attempt_count   = case when p_to like 'failed%' then attempt_count + 1 else attempt_count end,
         updated_at      = now()
   where id = v_id;

  insert into public.yorisou_account_deletion_audit (job_id, stage, outcome, detail)
  values (v_id, p_to, case when p_to like 'failed%' then 'failed' else 'ok' end,
          jsonb_build_object('from', v_from));
  return p_to;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. THE DATABASE ERASURE EXECUTOR.
--
-- Declarative plan + `to_regclass` guard, so the same function is correct in Preview (subset of
-- tables) and in Production (full set) without either environment lying about what it erased.
-- Returns bounded per-table counts for the audit; never returns content.
-- ─────────────────────────────────────────────────────────────────────────────
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Verification. The job may only complete when the database genuinely holds nothing
--    owner-readable for this account. This is what stops "COMPLETED" from being a claim.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_verify_database(p_owner_account_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tables text[] := array[
    'yorisou_test_results','yorisou_ai_reflections','yorisou_ai_runs',
    'yorisou_daily_state_records','yorisou_values_assessments',
    'yorisou_private_check_in_plans','yorisou_private_memory_items','yorisou_private_recommendations',
    'yorisou_experience_cards','yorisou_recommendation_sets','yorisou_recommendation_actions',
    'yorisou_canonical_recommendation_sets','yorisou_canonical_recommendation_items',
    'yorisou_canonical_recommendation_actions','yorisou_assessment_attempts',
    'yorisou_account_deletion_requests'
  ];
  v_t text; v_n bigint; v_left jsonb := '{}'::jsonb;
begin
  foreach v_t in array v_tables loop
    if to_regclass('public.' || v_t) is null then continue; end if;
    execute format('select count(*) from public.%I where owner_account_id = $1', v_t)
      into v_n using p_owner_account_id;
    if v_n > 0 then v_left := v_left || jsonb_build_object(v_t, v_n); end if;
  end loop;

  -- Results may survive ONLY as content-free tombstones, and a tombstone has no owner by contract.
  if to_regclass('public.yorisou_assessment_results') is not null then
    select count(*) into v_n from public.yorisou_assessment_results
     where owner_account_id = p_owner_account_id;
    if v_n > 0 then v_left := v_left || jsonb_build_object('yorisou_assessment_results_owned', v_n); end if;
  end if;

  return v_left;   -- '{}' means clean
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Finalize. Verifies first, then drops the account id in favour of the fingerprint.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_finalize(p_owner_account_id text)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_state text; v_left jsonb;
begin
  select id, state into v_id, v_state from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id for update;
  if not found then raise exception 'account_deletion_job_not_found'; end if;
  if v_state <> 'verifying' then raise exception 'account_deletion_not_verifying'; end if;

  v_left := public.yorisou_account_deletion_verify_database(p_owner_account_id);
  if v_left <> '{}'::jsonb then
    update public.yorisou_account_deletion_jobs
       set state='failed_retryable', last_error_code='verification_residue',
           attempt_count=attempt_count+1, updated_at=now()
     where id = v_id;
    insert into public.yorisou_account_deletion_audit (job_id, stage, outcome, detail)
    values (v_id, 'verifying', 'failed', jsonb_build_object('residue', v_left));
    return false;
  end if;

  update public.yorisou_account_deletion_jobs
     set state='completed', owner_account_id=null, completed_at=now(), updated_at=now()
   where id = v_id;
  insert into public.yorisou_account_deletion_audit (job_id, stage, outcome)
  values (v_id, 'completed', 'ok');
  return true;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. Status read (used by the UI and by replay/idempotency checks).
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_status(p_owner_account_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v jsonb;
begin
  select jsonb_build_object('state', state, 'requestedAt', requested_at, 'attemptCount', attempt_count,
                            'lastErrorCode', last_error_code, 'contractVersion', contract_version)
    into v from public.yorisou_account_deletion_jobs where owner_account_id = p_owner_account_id;
  if v is null then
    -- A completed job no longer carries the id; the fingerprint proves the deletion happened.
    select jsonb_build_object('state', state, 'completedAt', completed_at, 'contractVersion', contract_version)
      into v from public.yorisou_account_deletion_jobs
     where owner_fingerprint = public.yorisou_account_deletion_fingerprint(p_owner_account_id)
       and state = 'completed' limit 1;
  end if;
  return coalesce(v, jsonb_build_object('state', 'none'));
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Grants — service_role only, exactly like every other governed mutation path.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure::text as sig
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname='public' and p.proname like 'yorisou_account_deletion_%'
  loop
    execute format('revoke all on function %s from public', r.sig);
    if exists (select 1 from pg_roles where rolname='anon') then
      execute format('revoke all on function %s from anon', r.sig); end if;
    if exists (select 1 from pg_roles where rolname='authenticated') then
      execute format('revoke all on function %s from authenticated', r.sig); end if;
    if exists (select 1 from pg_roles where rolname='service_role') then
      execute format('grant execute on function %s to service_role', r.sig); end if;
  end loop;
end $$;

commit;
