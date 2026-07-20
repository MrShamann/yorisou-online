-- DCI-1 — daily-check-in「きょうの空模様」private recorded-state persistence.
--
-- PERSISTENCE DECISION (DCI-1 §12): yorisou_test_results is NOT reused — forcing a
-- per-day versioned state record into it would require fake answers/result fields,
-- destructive updates (single-row idempotency, no version history) and has no
-- entry-local-date identity. This dedicated, additive design provides:
--   daily state record          (current visible entry per owner + local date)
--   daily state record version  (append-only content history; versioned corrections)
--   daily state history event   (append-only audit trail; NO state content, NO memo)
--
-- RLS posture follows the product-table family (202607100002): RLS enabled, ALL
-- direct grants revoked from public/anon/authenticated — access exclusively through
-- the server-only service-role repository, which enforces owner scoping in app code
-- (auth is the custom encrypted-cookie system; no user JWT reaches PostgREST).
-- Multi-row invariants (create / correct / delete) run through SECURITY DEFINER
-- RPCs so record + version + event stay atomic (CIF-1A precedent).
--
-- LOCAL DISPOSABLE-DATABASE VERIFICATION ONLY — no hosted/production apply is
-- authorized by DCI-1.
--
-- ROLLBACK CLASSIFICATION: LOCAL_DISPOSABLE_SCHEMA_ROLLBACK (structurally
--   destructive in a disposable local/test database only; NOT a production
--   rollback; no production migration has occurred). Rollback (disposable local
--   DB only):
--     drop function if exists public.yorisou_daily_record_delete(text, date, text);
--     drop function if exists public.yorisou_daily_record_correct(text, date, timestamptz, jsonb, text, text, text);
--     drop function if exists public.yorisou_daily_record_create(text, text, text, text, timestamptz, date, text, integer, jsonb, text, text);
--     drop table if exists public.yorisou_daily_state_history_events;
--     drop table if exists public.yorisou_daily_state_record_versions;
--     drop table if exists public.yorisou_daily_state_records;

create extension if not exists pgcrypto;

-- 1. Current visible record: ONE visible entry per (owner, entryLocalDate).
create table if not exists public.yorisou_daily_state_records (
  id uuid primary key default gen_random_uuid(),
  owner_account_id text not null,
  method_id text not null default 'daily-check-in'
    constraint yorisou_daily_state_records_method_chk check (method_id = 'daily-check-in'),
  method_version text not null,
  schema_version text not null,
  ack_version text not null,
  produced_at timestamptz not null,
  entry_local_date date not null,
  timezone text not null
    constraint yorisou_daily_state_records_tz_chk check (length(timezone) between 1 and 64),
  utc_offset_minutes integer,
  state jsonb not null,
  memo text
    constraint yorisou_daily_state_records_memo_chk check (memo is null or length(memo) <= 140),
  ack_id text not null,
  current_version integer not null default 1
    constraint yorisou_daily_state_records_version_chk check (current_version >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by text
);

-- One VISIBLE entry per owner + local date (soft-deleted rows do not block a new
-- entry for that date; duplicate-date collisions resolve to the correction flow).
create unique index if not exists yorisou_daily_state_records_owner_date_visible
  on public.yorisou_daily_state_records (owner_account_id, entry_local_date)
  where deleted_at is null;
create index if not exists yorisou_daily_state_records_owner_recent
  on public.yorisou_daily_state_records (owner_account_id, entry_local_date desc);

-- 2. Append-only version history (content preserved per CPV1 history policy;
-- corrections create versions — no destructive overwrite, no silent replacement).
create table if not exists public.yorisou_daily_state_record_versions (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.yorisou_daily_state_records (id),
  version integer not null
    constraint yorisou_daily_state_record_versions_version_chk check (version >= 1),
  produced_at timestamptz not null,
  state jsonb not null,
  memo text
    constraint yorisou_daily_state_record_versions_memo_chk check (memo is null or length(memo) <= 140),
  ack_id text not null,
  reason_code text not null
    constraint yorisou_daily_state_record_versions_reason_chk
    check (reason_code in ('initial', 'user_correction')),
  created_at timestamptz not null default now(),
  constraint yorisou_daily_state_record_versions_unique unique (record_id, version)
);

-- 3. Append-only audit/history events — the governed tombstone layer. Deliberately
-- carries NO state content and NO memo columns (a tombstone never exposes content).
create table if not exists public.yorisou_daily_state_history_events (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null,
  owner_account_id text not null,
  event_type text not null
    constraint yorisou_daily_state_history_events_type_chk
    check (event_type in ('created', 'corrected', 'deleted')),
  version integer not null,
  reason_code text not null
    constraint yorisou_daily_state_history_events_reason_chk
    check (reason_code in ('initial', 'user_correction', 'user_deleted')),
  created_at timestamptz not null default now()
);
create index if not exists yorisou_daily_state_history_events_record
  on public.yorisou_daily_state_history_events (record_id, created_at);

-- Append-only guards (CPV1-CM0 helper — present on clean main via 202607200001).
drop trigger if exists yorisou_daily_state_record_versions_no_mutate on public.yorisou_daily_state_record_versions;
create trigger yorisou_daily_state_record_versions_no_mutate
  before update or delete on public.yorisou_daily_state_record_versions
  for each row execute function public.yorisou_cpv1_block_mutation();
drop trigger if exists yorisou_daily_state_record_versions_no_truncate on public.yorisou_daily_state_record_versions;
create trigger yorisou_daily_state_record_versions_no_truncate
  before truncate on public.yorisou_daily_state_record_versions
  for each statement execute function public.yorisou_cpv1_block_mutation();
drop trigger if exists yorisou_daily_state_history_events_no_mutate on public.yorisou_daily_state_history_events;
create trigger yorisou_daily_state_history_events_no_mutate
  before update or delete on public.yorisou_daily_state_history_events
  for each row execute function public.yorisou_cpv1_block_mutation();
drop trigger if exists yorisou_daily_state_history_events_no_truncate on public.yorisou_daily_state_history_events;
create trigger yorisou_daily_state_history_events_no_truncate
  before truncate on public.yorisou_daily_state_history_events
  for each statement execute function public.yorisou_cpv1_block_mutation();

-- 4. Privacy posture: RLS on; ALL direct access revoked; service-role only.
alter table public.yorisou_daily_state_records enable row level security;
alter table public.yorisou_daily_state_record_versions enable row level security;
alter table public.yorisou_daily_state_history_events enable row level security;
revoke all on table
  public.yorisou_daily_state_records,
  public.yorisou_daily_state_record_versions,
  public.yorisou_daily_state_history_events
from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table public.yorisou_daily_state_records, public.yorisou_daily_state_record_versions, public.yorisou_daily_state_history_events from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table public.yorisou_daily_state_records, public.yorisou_daily_state_record_versions, public.yorisou_daily_state_history_events from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant select, insert, update on table public.yorisou_daily_state_records to service_role';
    execute 'grant select, insert on table public.yorisou_daily_state_record_versions to service_role';
    execute 'grant select, insert on table public.yorisou_daily_state_history_events to service_role';
  end if;
end $$;

-- 5. Atomic RPCs (SECURITY DEFINER; service-role execute only). Record + version +
-- event mutate together or not at all.

-- CREATE: new visible record for a local date + version 1 + 'created' event.
-- Idempotent-safe: a visible record for the date raises 'daily_record_exists'
-- (the API converts this to the correction flow).
create or replace function public.yorisou_daily_record_create(
  p_owner_account_id text,
  p_method_version text,
  p_schema_version text,
  p_ack_version text,
  p_produced_at timestamptz,
  p_entry_local_date date,
  p_timezone text,
  p_utc_offset_minutes integer,
  p_state jsonb,
  p_memo text,
  p_ack_id text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record_id uuid;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'daily_record_owner_required';
  end if;
  if exists (
    select 1 from public.yorisou_daily_state_records
    where owner_account_id = p_owner_account_id
      and entry_local_date = p_entry_local_date
      and deleted_at is null
  ) then
    raise exception 'daily_record_exists';
  end if;
  insert into public.yorisou_daily_state_records
    (owner_account_id, method_version, schema_version, ack_version, produced_at,
     entry_local_date, timezone, utc_offset_minutes, state, memo, ack_id, current_version)
  values
    (p_owner_account_id, p_method_version, p_schema_version, p_ack_version, p_produced_at,
     p_entry_local_date, p_timezone, p_utc_offset_minutes, p_state, p_memo, p_ack_id, 1)
  returning id into v_record_id;
  insert into public.yorisou_daily_state_record_versions
    (record_id, version, produced_at, state, memo, ack_id, reason_code)
  values (v_record_id, 1, p_produced_at, p_state, p_memo, p_ack_id, 'initial');
  insert into public.yorisou_daily_state_history_events
    (record_id, owner_account_id, event_type, version, reason_code)
  values (v_record_id, p_owner_account_id, 'created', 1, 'initial');
  return v_record_id;
end;
$$;

-- CORRECT: versioned same-day correction. New version row (prior versions
-- PRESERVED); visible record updates atomically; 'corrected' event appended.
create or replace function public.yorisou_daily_record_correct(
  p_owner_account_id text,
  p_entry_local_date date,
  p_produced_at timestamptz,
  p_state jsonb,
  p_memo text,
  p_ack_id text,
  p_reason_code text default 'user_correction'
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record public.yorisou_daily_state_records%rowtype;
  v_next integer;
begin
  if p_reason_code <> 'user_correction' then
    raise exception 'daily_record_invalid_reason';
  end if;
  select * into v_record from public.yorisou_daily_state_records
  where owner_account_id = p_owner_account_id
    and entry_local_date = p_entry_local_date
    and deleted_at is null
  for update;
  if not found then
    raise exception 'daily_record_not_found';
  end if;
  v_next := v_record.current_version + 1;
  insert into public.yorisou_daily_state_record_versions
    (record_id, version, produced_at, state, memo, ack_id, reason_code)
  values (v_record.id, v_next, p_produced_at, p_state, p_memo, p_ack_id, 'user_correction');
  update public.yorisou_daily_state_records
  set produced_at = p_produced_at,
      state = p_state,
      memo = p_memo,
      ack_id = p_ack_id,
      current_version = v_next,
      updated_at = now()
  where id = v_record.id;
  insert into public.yorisou_daily_state_history_events
    (record_id, owner_account_id, event_type, version, reason_code)
  values (v_record.id, p_owner_account_id, 'corrected', v_next, 'user_correction');
  return v_next;
end;
$$;

-- DELETE: governed deletion — hides the record from user-visible history and
-- appends a content-free 'deleted' tombstone event. Version content remains in
-- the append-only history layer per CPV1 audit policy (never served to users);
-- physical purge belongs to the account-level data-rights flow, not this RPC.
create or replace function public.yorisou_daily_record_delete(
  p_owner_account_id text,
  p_entry_local_date date,
  p_deleted_by text default 'owner'
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record public.yorisou_daily_state_records%rowtype;
begin
  select * into v_record from public.yorisou_daily_state_records
  where owner_account_id = p_owner_account_id
    and entry_local_date = p_entry_local_date
    and deleted_at is null
  for update;
  if not found then
    return false;
  end if;
  update public.yorisou_daily_state_records
  set deleted_at = now(), deleted_by = p_deleted_by, updated_at = now()
  where id = v_record.id;
  insert into public.yorisou_daily_state_history_events
    (record_id, owner_account_id, event_type, version, reason_code)
  values (v_record.id, p_owner_account_id, 'deleted', v_record.current_version, 'user_deleted');
  return true;
end;
$$;

-- RPC permissions: service-role execute only.
revoke all on function public.yorisou_daily_record_create(text, text, text, text, timestamptz, date, text, integer, jsonb, text, text) from public;
revoke all on function public.yorisou_daily_record_correct(text, date, timestamptz, jsonb, text, text, text) from public;
revoke all on function public.yorisou_daily_record_delete(text, date, text) from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on function public.yorisou_daily_record_create(text, text, text, text, timestamptz, date, text, integer, jsonb, text, text) from anon';
    execute 'revoke all on function public.yorisou_daily_record_correct(text, date, timestamptz, jsonb, text, text, text) from anon';
    execute 'revoke all on function public.yorisou_daily_record_delete(text, date, text) from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on function public.yorisou_daily_record_create(text, text, text, text, timestamptz, date, text, integer, jsonb, text, text) from authenticated';
    execute 'revoke all on function public.yorisou_daily_record_correct(text, date, timestamptz, jsonb, text, text, text) from authenticated';
    execute 'revoke all on function public.yorisou_daily_record_delete(text, date, text) from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.yorisou_daily_record_create(text, text, text, text, timestamptz, date, text, integer, jsonb, text, text) to service_role';
    execute 'grant execute on function public.yorisou_daily_record_correct(text, date, timestamptz, jsonb, text, text, text) to service_role';
    execute 'grant execute on function public.yorisou_daily_record_delete(text, date, text) to service_role';
  end if;
end $$;

comment on table public.yorisou_daily_state_records is
  'DCI-1 daily-check-in: current visible private state record per owner + entry local date. Service-role only; owner scoping enforced in the server repository.';
comment on table public.yorisou_daily_state_record_versions is
  'DCI-1: append-only version history (versioned corrections; no destructive overwrite).';
comment on table public.yorisou_daily_state_history_events is
  'DCI-1: append-only audit/tombstone events. Carries NO state content and NO memo.';
