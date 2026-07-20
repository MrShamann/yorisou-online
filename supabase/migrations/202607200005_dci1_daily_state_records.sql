-- DCI-1/DCI-1.1 — daily-check-in「きょうの空模様」private recorded-state persistence.
--
-- AMENDED IN PLACE by DCI-1.1 (permitted: this migration has never been applied to
-- any hosted or shared environment; local disposable databases only).
--
-- PERSISTENCE DECISION (DCI-1 §12): yorisou_test_results is NOT reused — forcing a
-- per-day versioned state record into it would require fake answers/result fields,
-- destructive updates and has no entry-local-date identity.
--
-- ACCESS ARCHITECTURE (DCI-1.1 §4 — truthful description):
--   DIRECT_USER_DENY + SERVER_REPOSITORY_OWNER_SCOPE + RPC_ONLY_DATABASE_MUTATION
-- RLS is ENABLED on every table; there are intentionally NO authenticated-user
-- policies (app auth is cookie-based; no user JWT reaches PostgREST). Direct table
-- access: public/anon/authenticated = none; service_role = SELECT ONLY (the server
-- repository's read path). ALL mutation goes through bounded SECURITY DEFINER RPCs
-- owned by the migration owner — application code holding the service-role key
-- CANNOT insert/update/delete/truncate any DCI table directly (DCI-C1 closed).
--
-- CORRECTION CONTRACT (DCI-1.1 §7): record identity = entryLocalDate + timezone +
-- INITIAL produced_at (never re-bucketed, never overwritten by corrections); each
-- version row carries its own server-side produced_at; corrections are accepted
-- only while the server's now() in the record's stored timezone is still the
-- record's entry_local_date (enforced HERE, not only in the API/UI).
--
-- DELETION CONTRACT (DCI-1.1 §8): the user deletion RPC performs governed PRIVATE-
-- CONTENT ERASURE, not indefinite soft hiding: version content rows are deleted,
-- the current record row is deleted, and only a content-free tombstone event
-- remains (record id, owner ref, method id, last version count, deletion time,
-- bounded reason code, retention expiry). Append-only protection applies while the
-- record exists; the governed erase path is the single, flagged exception.
--
-- LOCAL DISPOSABLE-DATABASE VERIFICATION ONLY — no hosted/production apply is
-- authorized.
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
--     drop function if exists public.yorisou_dci_block_mutation();

create extension if not exists pgcrypto;

-- 1. Current visible record: ONE visible entry per (owner, entryLocalDate).
--    produced_at is the INITIAL creation instant (record identity; corrections
--    never overwrite it — version rows carry their own timestamps).
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
  updated_at timestamptz not null default now()
);

create unique index if not exists yorisou_daily_state_records_owner_date_visible
  on public.yorisou_daily_state_records (owner_account_id, entry_local_date);
create index if not exists yorisou_daily_state_records_owner_recent
  on public.yorisou_daily_state_records (owner_account_id, entry_local_date desc);

-- 2. Version history (content preserved per CPV1 history policy WHILE the record
--    exists; corrections create versions — no destructive overwrite). Erased in
--    full by the governed deletion RPC (DCI-1.1 §8).
create table if not exists public.yorisou_daily_state_record_versions (
  id uuid primary key default gen_random_uuid(),
  record_id uuid not null references public.yorisou_daily_state_records (id),
  version integer not null
    constraint yorisou_daily_state_record_versions_version_chk check (version >= 1),
  produced_at timestamptz not null, -- server-side instant of THIS version
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

-- 3. Append-only audit/history events — the governed tombstone layer. Structurally
--    carries NO state, NO option values, NO memo, NO acknowledgement copy, NO
--    recommendation tag. Retention: bounded audit metadata; deletion tombstones
--    carry retention_expires_at (12 months) after which the account-level
--    data-rights purge path removes them; no indefinite-retention claim is made.
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
  retention_expires_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists yorisou_daily_state_history_events_record
  on public.yorisou_daily_state_history_events (record_id, created_at);

-- DCI append-only guard: blocks UPDATE/DELETE/TRUNCATE except inside the governed
-- private-content-erasure path, which sets a TRANSACTION-LOCAL flag from within
-- the deletion RPC only. Application roles cannot reach the tables directly at
-- all (grants), so the flag is not an application-facing bypass.
create or replace function public.yorisou_dci_block_mutation()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' and current_setting('yorisou.dci_governed_erase', true) = 'on' then
    return old;
  end if;
  raise exception 'append_only: % on % is not permitted', tg_op, tg_table_name;
end;
$$;
comment on function public.yorisou_dci_block_mutation() is
  'DCI-1.1 append-only guard. DELETE allowed ONLY under the transaction-local governed-erase flag set by yorisou_daily_record_delete(); UPDATE/TRUNCATE never.';

-- Versions: UPDATE/TRUNCATE never; DELETE only via governed erase.
drop trigger if exists yorisou_daily_state_record_versions_no_mutate on public.yorisou_daily_state_record_versions;
create trigger yorisou_daily_state_record_versions_no_mutate
  before update or delete on public.yorisou_daily_state_record_versions
  for each row execute function public.yorisou_dci_block_mutation();
drop trigger if exists yorisou_daily_state_record_versions_no_truncate on public.yorisou_daily_state_record_versions;
create trigger yorisou_daily_state_record_versions_no_truncate
  before truncate on public.yorisou_daily_state_record_versions
  for each statement execute function public.yorisou_dci_block_mutation();
-- Records: content row is removed by governed erase; direct mutation is denied by
-- grants; the RPCs (owner-executed) perform the bounded update/delete.
drop trigger if exists yorisou_daily_state_records_no_truncate on public.yorisou_daily_state_records;
create trigger yorisou_daily_state_records_no_truncate
  before truncate on public.yorisou_daily_state_records
  for each statement execute function public.yorisou_dci_block_mutation();
-- Events: tombstones are immutable, forever (CPV1-CM0 absolute guard).
drop trigger if exists yorisou_daily_state_history_events_no_mutate on public.yorisou_daily_state_history_events;
create trigger yorisou_daily_state_history_events_no_mutate
  before update or delete on public.yorisou_daily_state_history_events
  for each row execute function public.yorisou_cpv1_block_mutation();
drop trigger if exists yorisou_daily_state_history_events_no_truncate on public.yorisou_daily_state_history_events;
create trigger yorisou_daily_state_history_events_no_truncate
  before truncate on public.yorisou_daily_state_history_events
  for each statement execute function public.yorisou_cpv1_block_mutation();

-- 4. Privilege matrix (DCI-1.1 §4):
--      public/anon/authenticated : NO access
--      service_role              : SELECT ONLY (server repository read path)
--      mutation                  : SECURITY DEFINER RPCs exclusively
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
    execute 'revoke all on table public.yorisou_daily_state_records, public.yorisou_daily_state_record_versions, public.yorisou_daily_state_history_events from service_role';
    execute 'grant select on table public.yorisou_daily_state_records to service_role';
    execute 'grant select on table public.yorisou_daily_state_record_versions to service_role';
    execute 'grant select on table public.yorisou_daily_state_history_events to service_role';
  end if;
end $$;

-- 5. Atomic RPCs (SECURITY DEFINER; service-role execute only). Record + version +
-- event mutate together or not at all; the definer-owner performs internal writes.

-- CREATE: new visible record for a local date + version 1 + 'created' event.
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

-- CORRECT: versioned same-day correction. The record's INITIAL produced_at and
-- local-date identity are NEVER overwritten; the new version carries the server
-- correction instant. Enforced in-database: corrections are accepted only while
-- now() in the record's stored timezone is still the record's entry_local_date.
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
  for update;
  if not found then
    raise exception 'daily_record_not_found';
  end if;
  if (timezone(v_record.timezone, now()))::date <> v_record.entry_local_date then
    raise exception 'daily_record_correction_window_closed';
  end if;
  v_next := v_record.current_version + 1;
  insert into public.yorisou_daily_state_record_versions
    (record_id, version, produced_at, state, memo, ack_id, reason_code)
  values (v_record.id, v_next, coalesce(p_produced_at, now()), p_state, p_memo, p_ack_id, 'user_correction');
  update public.yorisou_daily_state_records
  set state = p_state,
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

-- DELETE: governed PRIVATE-CONTENT ERASURE (DCI-1.1 §8). Removes all version
-- content rows and the current record row; appends ONE content-free tombstone
-- event (record id, owner ref, last version count, deletion time, bounded reason
-- code, retention expiry = 12 months → account-level data-rights purge path).
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
  for update;
  if not found then
    return false;
  end if;
  -- Transaction-local governed-erase flag: the ONLY path that may delete content.
  perform set_config('yorisou.dci_governed_erase', 'on', true);
  delete from public.yorisou_daily_state_record_versions where record_id = v_record.id;
  delete from public.yorisou_daily_state_records where id = v_record.id;
  perform set_config('yorisou.dci_governed_erase', 'off', true);
  insert into public.yorisou_daily_state_history_events
    (record_id, owner_account_id, event_type, version, reason_code, retention_expires_at)
  values (v_record.id, p_owner_account_id, 'deleted', v_record.current_version, 'user_deleted', now() + interval '12 months');
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
  'DCI-1.1 daily-check-in: current private state record per owner + entry local date. DIRECT_USER_DENY + SERVER_REPOSITORY_OWNER_SCOPE + RPC_ONLY_DATABASE_MUTATION; service_role reads only.';
comment on table public.yorisou_daily_state_record_versions is
  'DCI-1.1: version history (versioned corrections; append-only while the record exists; fully erased by governed user deletion).';
comment on table public.yorisou_daily_state_history_events is
  'DCI-1.1: append-only audit/tombstone events. No state/option/memo/ack-copy/tag content. Deletion tombstones carry retention_expires_at (12 months; purged via the account-level data-rights path).';
