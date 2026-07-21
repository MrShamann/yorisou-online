-- YV-1 — yorisou-values「いま大事にしたいことチェック」private scored-assessment persistence.
--
-- PERSISTENCE DECISION (YV-1 §13): merged-main storage cannot represent a scored
-- values assessment truthfully — yorisou_test_results is result-shaped with a
-- CHECK-constrained test_id and single-active-row idempotency (no 48-answer
-- provenance, no append-only version history, no retake-as-distinct-record, no
-- content-erasing deletion). A dedicated additive design (mirroring the accepted
-- DCI-1.2 pattern) provides:
--   values assessment          (current record per retake; provenance + result)
--   values assessment version  (append-only content history; corrections)
--   values assessment event    (append-only content-free audit/tombstone)
--
-- ACCESS ARCHITECTURE (mirrors DCI-1.2):
--   DIRECT_USER_DENY + SERVER_REPOSITORY_OWNER_SCOPE + RPC_ONLY_DATABASE_MUTATION
-- RLS enabled; NO authenticated-user policies (app auth is cookie-based; no user
-- JWT reaches PostgREST). Direct table access: public/anon/authenticated = none;
-- service_role = SELECT ONLY. ALL mutation goes through bounded SECURITY DEFINER
-- RPCs owned by the migration owner.
--
-- RETAKE / CORRECTION (§14): a retake creates a DISTINCT assessment record
-- (longitudinal history preserved). An answer correction on an existing record
-- creates a new VERSION (recomputed deterministically; prior versions preserved
-- until governed deletion). User confirmation (confirmed/not_quite/skipped) is a
-- separate field and never rewrites the computed result.
--
-- DELETION (§13): governed PRIVATE-CONTENT ERASURE — version content rows + the
-- current record row + prior created/corrected events are removed; ONE content-
-- free tombstone remains (record id, owner ref, method id, version count,
-- deletion time, reason code, retention_expires_at = 12 months). No answers,
-- result copy or recommendation tags survive in audit data. The 12-month expiry
-- is a GATED IMPLEMENTATION CANDIDATE — no hosted migration, NO purge schedule.
--
-- LOCAL DISPOSABLE-DATABASE VERIFICATION ONLY — no hosted/production apply.
--
-- ROLLBACK CLASSIFICATION: LOCAL_DISPOSABLE_SCHEMA_ROLLBACK (structurally
--   destructive in a disposable local/test database only; NOT a production
--   rollback). Rollback (disposable local DB only):
--     drop function if exists public.yorisou_values_tombstone_purge_expired(integer);
--     drop function if exists public.yorisou_values_assessment_delete(text, uuid);
--     drop function if exists public.yorisou_values_assessment_set_confirmation(text, uuid, text, text, text, text, text, text, text);
--     drop function if exists public.yorisou_values_assessment_correct(text, uuid, jsonb, text, boolean, text, text, text, text, text, text);
--     drop function if exists public.yorisou_values_assessment_create(text, text, text, text, text, jsonb, text, boolean, text, text, text);
--     drop table if exists public.yorisou_values_assessment_events;
--     drop table if exists public.yorisou_values_assessment_versions;
--     drop table if exists public.yorisou_values_assessments;
--     drop function if exists public.yorisou_values_block_mutation();

create extension if not exists pgcrypto;

-- 1. Current assessment record (one per retake — retakes are distinct rows).
create table if not exists public.yorisou_values_assessments (
  id uuid primary key default gen_random_uuid(),
  owner_account_id text not null,
  method_id text not null default 'yorisou-values'
    constraint yorisou_values_assessments_method_chk check (method_id = 'yorisou-values'),
  method_version text not null,
  bank_version text not null,
  scoring_version text not null,
  result_schema_version text not null,
  bank_content_hash text not null,
  answers jsonb not null, -- { itemId: "A" | "B" } — private (P1)
  result_id text not null, -- VAL_R_* or VAL_R_MIXED
  is_mixed boolean not null default false,
  confirmation text not null default 'skipped'
    constraint yorisou_values_assessments_confirmation_chk check (confirmation in ('confirmed', 'not_quite', 'skipped')),
  current_version integer not null default 1
    constraint yorisou_values_assessments_version_chk check (current_version >= 1),
  produced_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists yorisou_values_assessments_owner_recent
  on public.yorisou_values_assessments (owner_account_id, produced_at desc);

-- 2. Append-only version history (corrections; erased in full by deletion).
create table if not exists public.yorisou_values_assessment_versions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.yorisou_values_assessments (id),
  version integer not null
    constraint yorisou_values_assessment_versions_version_chk check (version >= 1),
  answers jsonb not null,
  result_id text not null,
  is_mixed boolean not null default false,
  confirmation text not null default 'skipped',
  reason_code text not null
    constraint yorisou_values_assessment_versions_reason_chk
    check (reason_code in ('initial', 'user_correction')),
  produced_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint yorisou_values_assessment_versions_unique unique (assessment_id, version)
);

-- 3. Append-only audit/tombstone events — structurally NO answers, result copy or
--    recommendation content (id/version/timestamps/reason only).
create table if not exists public.yorisou_values_assessment_events (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null,
  owner_account_id text not null,
  event_type text not null
    constraint yorisou_values_assessment_events_type_chk
    -- YV-1.1 (YV-C1): confirmation_changed is distinct from corrected.
    check (event_type in ('created', 'corrected', 'confirmation_changed', 'deleted')),
  version integer not null,
  reason_code text not null
    constraint yorisou_values_assessment_events_reason_chk
    check (reason_code in ('initial', 'user_correction', 'user_confirmed', 'user_not_quite', 'user_skipped', 'user_deleted')),
  retention_expires_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists yorisou_values_assessment_events_record
  on public.yorisou_values_assessment_events (assessment_id, created_at);

-- Append-only guard: UPDATE/TRUNCATE never; DELETE only under the governed-erase
-- transaction-local flag set inside the deletion / purge RPCs.
create or replace function public.yorisou_values_block_mutation()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' and current_setting('yorisou.values_governed_erase', true) = 'on' then
    return old;
  end if;
  raise exception 'append_only: % on % is not permitted', tg_op, tg_table_name;
end;
$$;

drop trigger if exists yorisou_values_versions_no_mutate on public.yorisou_values_assessment_versions;
create trigger yorisou_values_versions_no_mutate
  before update or delete on public.yorisou_values_assessment_versions
  for each row execute function public.yorisou_values_block_mutation();
drop trigger if exists yorisou_values_versions_no_truncate on public.yorisou_values_assessment_versions;
create trigger yorisou_values_versions_no_truncate
  before truncate on public.yorisou_values_assessment_versions
  for each statement execute function public.yorisou_values_block_mutation();
drop trigger if exists yorisou_values_records_no_truncate on public.yorisou_values_assessments;
create trigger yorisou_values_records_no_truncate
  before truncate on public.yorisou_values_assessments
  for each statement execute function public.yorisou_values_block_mutation();
drop trigger if exists yorisou_values_events_no_mutate on public.yorisou_values_assessment_events;
create trigger yorisou_values_events_no_mutate
  before update or delete on public.yorisou_values_assessment_events
  for each row execute function public.yorisou_values_block_mutation();
drop trigger if exists yorisou_values_events_no_truncate on public.yorisou_values_assessment_events;
create trigger yorisou_values_events_no_truncate
  before truncate on public.yorisou_values_assessment_events
  for each statement execute function public.yorisou_values_block_mutation();

-- 4. Privilege matrix: public/anon/authenticated none; service_role SELECT ONLY.
alter table public.yorisou_values_assessments enable row level security;
alter table public.yorisou_values_assessment_versions enable row level security;
alter table public.yorisou_values_assessment_events enable row level security;
revoke all on table
  public.yorisou_values_assessments,
  public.yorisou_values_assessment_versions,
  public.yorisou_values_assessment_events
from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table public.yorisou_values_assessments, public.yorisou_values_assessment_versions, public.yorisou_values_assessment_events from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table public.yorisou_values_assessments, public.yorisou_values_assessment_versions, public.yorisou_values_assessment_events from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'revoke all on table public.yorisou_values_assessments, public.yorisou_values_assessment_versions, public.yorisou_values_assessment_events from service_role';
    execute 'grant select on table public.yorisou_values_assessments to service_role';
    execute 'grant select on table public.yorisou_values_assessment_versions to service_role';
    execute 'grant select on table public.yorisou_values_assessment_events to service_role';
  end if;
end $$;

-- 5. Atomic RPCs (SECURITY DEFINER; service-role execute only).

-- CREATE: a NEW assessment record (a retake is just another create) + version 1 +
-- created event. Provenance (method/bank/scoring/schema/hash) is stored.
create or replace function public.yorisou_values_assessment_create(
  p_owner_account_id text,
  p_method_version text,
  p_bank_version text,
  p_scoring_version text,
  p_result_schema_version text,
  p_answers jsonb,
  p_result_id text,
  p_is_mixed boolean,
  p_confirmation text,
  p_bank_content_hash text,
  p_produced_at text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_produced timestamptz := coalesce(p_produced_at::timestamptz, now());
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'values_owner_required';
  end if;
  insert into public.yorisou_values_assessments
    (owner_account_id, method_version, bank_version, scoring_version, result_schema_version,
     bank_content_hash, answers, result_id, is_mixed, confirmation, current_version, produced_at)
  values
    (p_owner_account_id, p_method_version, p_bank_version, p_scoring_version, p_result_schema_version,
     p_bank_content_hash, p_answers, p_result_id, coalesce(p_is_mixed, false), coalesce(p_confirmation, 'skipped'), 1, v_produced)
  returning id into v_id;
  insert into public.yorisou_values_assessment_versions
    (assessment_id, version, answers, result_id, is_mixed, confirmation, reason_code, produced_at)
  values (v_id, 1, p_answers, p_result_id, coalesce(p_is_mixed, false), coalesce(p_confirmation, 'skipped'), 'initial', v_produced);
  insert into public.yorisou_values_assessment_events
    (assessment_id, owner_account_id, event_type, version, reason_code)
  values (v_id, p_owner_account_id, 'created', 1, 'initial');
  return v_id;
end;
$$;

-- CORRECT (YV-1.1): ANSWER correction only — a genuine answer change recomputes
-- the result, increments current_version, appends a new version row and a single
-- corrected/user_correction event. YV-C2: the caller passes the CURRENT expected
-- provenance, which is re-verified against the LOCKED record inside this
-- transaction (no time-of-check/time-of-use gap). YV-C1: byte-equivalent answers
-- are rejected (values_no_answer_change) — confirmation-only changes use the
-- dedicated set_confirmation RPC. Confirmation is NOT written here.
create or replace function public.yorisou_values_assessment_correct(
  p_owner_account_id text,
  p_assessment_id uuid,
  p_answers jsonb,
  p_result_id text,
  p_is_mixed boolean,
  p_expected_method_id text,
  p_expected_method_version text,
  p_expected_bank_version text,
  p_expected_scoring_version text,
  p_expected_result_schema_version text,
  p_expected_bank_content_hash text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record public.yorisou_values_assessments%rowtype;
  v_next integer;
begin
  select * into v_record from public.yorisou_values_assessments
  where id = p_assessment_id and owner_account_id = p_owner_account_id
  for update;
  if not found then
    raise exception 'values_record_not_found';
  end if;
  -- YV-C2/YV-C6: all SIX provenance fields re-verified against the locked row
  -- (method_id included — the CHECK constraint is not a substitute for the
  -- explicit six-field mutation contract).
  if v_record.method_id <> p_expected_method_id
     or v_record.method_version <> p_expected_method_version
     or v_record.bank_version <> p_expected_bank_version
     or v_record.scoring_version <> p_expected_scoring_version
     or v_record.result_schema_version <> p_expected_result_schema_version
     or v_record.bank_content_hash <> p_expected_bank_content_hash then
    raise exception 'values_record_contract_version_mismatch';
  end if;
  -- YV-C1: reject a no-op answer correction (byte-equivalent answers).
  if v_record.answers = p_answers then
    raise exception 'values_no_answer_change';
  end if;
  v_next := v_record.current_version + 1;
  insert into public.yorisou_values_assessment_versions
    (assessment_id, version, answers, result_id, is_mixed, confirmation, reason_code, produced_at)
  values (p_assessment_id, v_next, p_answers, p_result_id, coalesce(p_is_mixed, false), v_record.confirmation, 'user_correction', now());
  update public.yorisou_values_assessments
  set answers = p_answers,
      result_id = p_result_id,
      is_mixed = coalesce(p_is_mixed, false),
      current_version = v_next,
      updated_at = now()
  where id = p_assessment_id;
  insert into public.yorisou_values_assessment_events
    (assessment_id, owner_account_id, event_type, version, reason_code)
  values (p_assessment_id, p_owner_account_id, 'corrected', v_next, 'user_correction');
  return v_next;
end;
$$;

-- SET CONFIRMATION (YV-1.1 YV-C1): confirmation-only mutation. Does NOT change
-- answers, does NOT recompute/replace the result, does NOT increment
-- current_version, does NOT create a version row, does NOT emit a corrected
-- event. Updates the confirmation state and appends ONE content-free
-- confirmation_changed event. YV-C2 provenance re-verified against the locked row.
create or replace function public.yorisou_values_assessment_set_confirmation(
  p_owner_account_id text,
  p_assessment_id uuid,
  p_confirmation text,
  p_expected_method_id text,
  p_expected_method_version text,
  p_expected_bank_version text,
  p_expected_scoring_version text,
  p_expected_result_schema_version text,
  p_expected_bank_content_hash text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record public.yorisou_values_assessments%rowtype;
  v_reason text;
begin
  if p_confirmation not in ('confirmed', 'not_quite', 'skipped') then
    raise exception 'values_invalid_confirmation';
  end if;
  select * into v_record from public.yorisou_values_assessments
  where id = p_assessment_id and owner_account_id = p_owner_account_id
  for update;
  if not found then
    raise exception 'values_record_not_found';
  end if;
  -- YV-C2/YV-C6: all SIX provenance fields re-verified against the locked row.
  if v_record.method_id <> p_expected_method_id
     or v_record.method_version <> p_expected_method_version
     or v_record.bank_version <> p_expected_bank_version
     or v_record.scoring_version <> p_expected_scoring_version
     or v_record.result_schema_version <> p_expected_result_schema_version
     or v_record.bank_content_hash <> p_expected_bank_content_hash then
    raise exception 'values_record_contract_version_mismatch';
  end if;
  -- YV-C8: idempotent — requesting the confirmation the record already holds is a
  -- truthful no-op success. No event is appended, updated_at is NOT bumped, no
  -- version change. Only a genuine state change emits ONE confirmation_changed event.
  if v_record.confirmation = p_confirmation then
    return p_confirmation;
  end if;
  v_reason := case p_confirmation
    when 'confirmed' then 'user_confirmed'
    when 'not_quite' then 'user_not_quite'
    else 'user_skipped'
  end;
  update public.yorisou_values_assessments
  set confirmation = p_confirmation, updated_at = now()
  where id = p_assessment_id;
  insert into public.yorisou_values_assessment_events
    (assessment_id, owner_account_id, event_type, version, reason_code)
  values (p_assessment_id, p_owner_account_id, 'confirmation_changed', v_record.current_version, v_reason);
  return p_confirmation;
end;
$$;

-- DELETE: governed private-content erasure — version rows + record row + prior
-- created/corrected events removed; ONE content-free tombstone remains.
create or replace function public.yorisou_values_assessment_delete(
  p_owner_account_id text,
  p_assessment_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record public.yorisou_values_assessments%rowtype;
begin
  select * into v_record from public.yorisou_values_assessments
  where id = p_assessment_id and owner_account_id = p_owner_account_id
  for update;
  if not found then
    return false;
  end if;
  perform set_config('yorisou.values_governed_erase', 'on', true);
  delete from public.yorisou_values_assessment_versions where assessment_id = v_record.id;
  delete from public.yorisou_values_assessments where id = v_record.id;
  delete from public.yorisou_values_assessment_events where assessment_id = v_record.id;
  perform set_config('yorisou.values_governed_erase', 'off', true);
  insert into public.yorisou_values_assessment_events
    (assessment_id, owner_account_id, event_type, version, reason_code, retention_expires_at)
  values (v_record.id, p_owner_account_id, 'deleted', v_record.current_version, 'user_deleted', now() + interval '12 months');
  return true;
end;
$$;

-- Bounded executable tombstone-expiry purge (gated candidate; no schedule).
create or replace function public.yorisou_values_tombstone_purge_expired(
  p_limit integer default 500
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  if p_limit is null or p_limit < 1 or p_limit > 5000 then
    raise exception 'values_purge_invalid_limit';
  end if;
  perform set_config('yorisou.values_governed_erase', 'on', true);
  with expired as (
    select id from public.yorisou_values_assessment_events
    where event_type = 'deleted' and retention_expires_at is not null and retention_expires_at <= now()
    order by retention_expires_at limit p_limit for update
  )
  delete from public.yorisou_values_assessment_events e using expired where e.id = expired.id;
  get diagnostics v_deleted = row_count;
  perform set_config('yorisou.values_governed_erase', 'off', true);
  return v_deleted;
end;
$$;

-- RPC permissions: service-role execute only.
revoke all on function public.yorisou_values_assessment_create(text, text, text, text, text, jsonb, text, boolean, text, text, text) from public;
revoke all on function public.yorisou_values_assessment_correct(text, uuid, jsonb, text, boolean, text, text, text, text, text, text) from public;
revoke all on function public.yorisou_values_assessment_set_confirmation(text, uuid, text, text, text, text, text, text, text) from public;
revoke all on function public.yorisou_values_assessment_delete(text, uuid) from public;
revoke all on function public.yorisou_values_tombstone_purge_expired(integer) from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on function public.yorisou_values_assessment_create(text, text, text, text, text, jsonb, text, boolean, text, text, text) from anon';
    execute 'revoke all on function public.yorisou_values_assessment_correct(text, uuid, jsonb, text, boolean, text, text, text, text, text, text) from anon';
    execute 'revoke all on function public.yorisou_values_assessment_set_confirmation(text, uuid, text, text, text, text, text, text, text) from anon';
    execute 'revoke all on function public.yorisou_values_assessment_delete(text, uuid) from anon';
    execute 'revoke all on function public.yorisou_values_tombstone_purge_expired(integer) from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on function public.yorisou_values_assessment_create(text, text, text, text, text, jsonb, text, boolean, text, text, text) from authenticated';
    execute 'revoke all on function public.yorisou_values_assessment_correct(text, uuid, jsonb, text, boolean, text, text, text, text, text, text) from authenticated';
    execute 'revoke all on function public.yorisou_values_assessment_set_confirmation(text, uuid, text, text, text, text, text, text, text) from authenticated';
    execute 'revoke all on function public.yorisou_values_assessment_delete(text, uuid) from authenticated';
    execute 'revoke all on function public.yorisou_values_tombstone_purge_expired(integer) from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.yorisou_values_assessment_create(text, text, text, text, text, jsonb, text, boolean, text, text, text) to service_role';
    execute 'grant execute on function public.yorisou_values_assessment_correct(text, uuid, jsonb, text, boolean, text, text, text, text, text, text) to service_role';
    execute 'grant execute on function public.yorisou_values_assessment_set_confirmation(text, uuid, text, text, text, text, text, text, text) to service_role';
    execute 'grant execute on function public.yorisou_values_assessment_delete(text, uuid) to service_role';
    execute 'grant execute on function public.yorisou_values_tombstone_purge_expired(integer) to service_role';
  end if;
end $$;

comment on table public.yorisou_values_assessments is
  'YV-1 yorisou-values: private scored assessment records (retakes are distinct rows). DIRECT_USER_DENY + SERVER_REPOSITORY_OWNER_SCOPE + RPC_ONLY_DATABASE_MUTATION; service_role reads only.';
comment on table public.yorisou_values_assessment_events is
  'YV-1: append-only audit/tombstone events. No answers, result copy or recommendation content. Deletion tombstones carry retention_expires_at (12 months; gated candidate — no purge schedule).';
