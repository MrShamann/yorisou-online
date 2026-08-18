-- DD-1 — Daily Discovery sessions (今日のひとつ foundation).
--
-- ONE new personal table + ONE atomic idempotent completion RPC + the account-erasure plan
-- re-emitted with the new family. Additive only: no existing table, row, or RPC is modified.
--
-- THE INVARIANT THIS SCHEMA CARRIES: one canonical discovery result per owner per pack calendar
-- day, decided by the FIRST writer. The unique constraint is the truth; the RPC's
-- insert-if-absent + select-canonical makes retries and concurrent requests converge on that first
-- row instead of erroring or forking. There is no update path and no reroll path — neither exists
-- as an RPC, so neither can exist as behavior.
--
-- Privilege matrix (DCI-1/OSF-1 discipline, applied unchanged):
--   public/anon/authenticated : NO access
--   service_role              : SELECT only on the table
--   mutation                  : the SECURITY DEFINER RPC exclusively
--
-- ROLLBACK:
--   drop function if exists public.yorisou_discovery_session_complete(text, date, text, text, text, text, text, timestamptz);
--   drop table if exists public.yorisou_discovery_sessions;
--   -- then re-apply 202608140002 verbatim to restore the previous erasure plan (removes no data).

begin;

create extension if not exists pgcrypto;

create table if not exists public.yorisou_discovery_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_account_id text not null
    constraint yorisou_discovery_sessions_owner_chk check (length(owner_account_id) between 1 and 200),
  local_date date not null,
  calendar_timezone text not null
    constraint yorisou_discovery_sessions_tz_chk check (length(calendar_timezone) between 1 and 64),
  pack_id text not null
    constraint yorisou_discovery_sessions_pack_chk check (length(pack_id) between 1 and 100),
  pack_version text not null
    constraint yorisou_discovery_sessions_pack_version_chk check (length(pack_version) between 1 and 40),
  pattern_family text not null
    constraint yorisou_discovery_sessions_family_chk check (pattern_family in
      ('symbol_draw', 'visual_choice', 'binary_choice', 'three_question', 'mini_story', 'seasonal')),
  result_id text not null
    constraint yorisou_discovery_sessions_result_chk check (length(result_id) between 1 and 100),
  completed_at timestamptz not null,
  created_at timestamptz not null default now(),
  -- THE one-per-day truth: owner + pack calendar day. First writer wins, forever.
  constraint yorisou_discovery_sessions_owner_day_pack unique (owner_account_id, local_date, pack_id)
);

-- Recent-result reads (cooldown) are owner+pack scoped, newest day first, bounded.
create index if not exists yorisou_discovery_sessions_owner_pack_recent
  on public.yorisou_discovery_sessions (owner_account_id, pack_id, local_date desc);

alter table public.yorisou_discovery_sessions enable row level security;

revoke all on table public.yorisou_discovery_sessions from public;
do $roles$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table public.yorisou_discovery_sessions from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table public.yorisou_discovery_sessions from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'revoke all on table public.yorisou_discovery_sessions from service_role';
    execute 'grant select on table public.yorisou_discovery_sessions to service_role';
  end if;
end
$roles$;

-- Atomic idempotent completion. Insert-if-absent, then return the CANONICAL row for that day —
-- the first writer's row, never the retry's. No update path exists.
create or replace function public.yorisou_discovery_session_complete(
  p_owner_account_id text,
  p_local_date date,
  p_calendar_timezone text,
  p_pack_id text,
  p_pack_version text,
  p_pattern_family text,
  p_result_id text,
  p_completed_at timestamptz
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row jsonb;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'discovery_invalid_owner';
  end if;
  if p_result_id is null or length(p_result_id) = 0 then
    raise exception 'discovery_invalid_result';
  end if;

  insert into public.yorisou_discovery_sessions
    (owner_account_id, local_date, calendar_timezone, pack_id, pack_version, pattern_family, result_id, completed_at)
  values
    (p_owner_account_id, p_local_date, p_calendar_timezone, p_pack_id, p_pack_version, p_pattern_family, p_result_id, p_completed_at)
  on conflict on constraint yorisou_discovery_sessions_owner_day_pack do nothing;

  select to_jsonb(t) - 'owner_account_id' into v_row
    from (
      select id, local_date, pack_id, pack_version, pattern_family, result_id, completed_at
        from public.yorisou_discovery_sessions
       where owner_account_id = p_owner_account_id
         and local_date = p_local_date
         and pack_id = p_pack_id
    ) t;

  if v_row is null then
    raise exception 'discovery_completion_not_persisted';
  end if;
  return v_row;
end;
$$;

revoke all on function public.yorisou_discovery_session_complete(text, date, text, text, text, text, text, timestamptz) from public;
do $fnroles$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on function public.yorisou_discovery_session_complete(text, date, text, text, text, text, text, timestamptz) from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on function public.yorisou_discovery_session_complete(text, date, text, text, text, text, text, timestamptz) from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.yorisou_discovery_session_complete(text, date, text, text, text, text, text, timestamptz) to service_role';
  end if;
end
$fnroles$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Account-erasure plan, re-emitted VERBATIM from 202608140002 with exactly one added family.
-- A new personal data family joins the declarative plan in the same change that creates it —
-- that rule is a test (test:osf1-erasure-coverage), not a hope.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.yorisou_account_deletion_erase_database_unchecked(p_owner_account_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_id       uuid;
  v_plan     text[][] := array[
    -- DD-1 Daily Discovery (202608180001): symbolic discovery sessions are owner-linked
    -- personal rows and erase like every other family. Added here by re-emitting the plan verbatim
    -- plus this one entry — the erasure-coverage test reads the LAST shipped v_plan.
    ['yorisou_discovery_sessions', 'owner_account_id'],
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
