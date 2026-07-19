-- APP-2 WS-D — Full-service backend schema (guest→account migration, adaptation
-- persistence, normalized feedback, service incidents, review queues, sensitive
-- admin access logs, readiness aggregates).
--
-- Governance: ADDITIVE ONLY. Creates NEW tables/functions/views in the `public`
-- schema; no existing YORISOU table is altered or dropped, and no existing row
-- is modified. Everything is designed for LOCAL Supabase verification of RLS,
-- grants, user-isolation, admin least-privilege, and append-only audit.
--
-- Identity model: user-owned rows are scoped by `account_id`, matched in RLS to
-- the caller's app account identity, resolved as
--   coalesce(auth.jwt() ->> 'app_account_id', auth.uid()::text).
-- The anon role is denied on every table here. Admin-only tables have NO
-- authenticated policy — they are reachable only by the server via service_role
-- after it performs its own admin authorization (least privilege).
--
-- Append-only audit tables (migration events, review-queue events, admin access
-- logs) carry a mutation-block trigger so UPDATE/DELETE/TRUNCATE are rejected
-- for EVERY role, including service_role — they are truly immutable.
--
-- Rollback (non-destructive) — drop in dependency order:
--   drop view if exists public.yorisou_service_readiness_overview;
--   drop view if exists public.yorisou_review_queue_summary;
--   drop view if exists public.yorisou_migration_funnel;
--   drop view if exists public.yorisou_family_report_coverage;
--   drop function if exists public.log_yorisou_admin_access(text,text,text,text,text,text,boolean,text);
--   drop function if exists public.transition_yorisou_review_item(uuid,text,text,text,text);
--   drop function if exists public.enqueue_yorisou_review_item(text,text,text,text,text,text);
--   drop function if exists public.transition_yorisou_guest_migration_job(uuid,text,text,text,text);
--   drop function if exists public.create_yorisou_guest_migration_job(text,text,text,text,text);
--   drop trigger  if exists yorisou_admin_access_logs_no_mutate on public.yorisou_admin_access_logs;
--   drop trigger  if exists yorisou_review_queue_events_no_mutate on public.yorisou_review_queue_events;
--   drop trigger  if exists yorisou_guest_migration_events_no_mutate on public.yorisou_guest_migration_events;
--   drop function if exists public.yorisou_app2_block_mutation();
--   drop table if exists public.yorisou_admin_access_logs;
--   drop table if exists public.yorisou_review_queue_events;
--   drop table if exists public.yorisou_review_queue_items;
--   drop table if exists public.yorisou_service_incidents;
--   drop table if exists public.yorisou_service_feedback;
--   drop table if exists public.yorisou_adaptation_state;
--   drop table if exists public.yorisou_guest_migration_events;
--   drop table if exists public.yorisou_guest_migration_jobs;

-- ─────────────────────────────────────────────────────────────────────────
-- 0. Shared helpers
-- ─────────────────────────────────────────────────────────────────────────

-- Current app account identity for RLS. Works with real Supabase auth (sub) and
-- with a custom app_account_id claim; null for anon (which is then denied).
create or replace function public.yorisou_current_account_id()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'app_account_id',
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )
$$;
comment on function public.yorisou_current_account_id() is
  'APP-2 RLS helper: resolves the caller''s app account id from JWT claims (app_account_id, else sub). Null for anon.';

-- Append-only guard: reject UPDATE/DELETE/TRUNCATE on immutable audit tables.
create or replace function public.yorisou_app2_block_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'append_only: % on % is not permitted', tg_op, tg_table_name;
  return null;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────
-- 1. Guest → account migration jobs (WS-E)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_guest_migration_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  -- Stable per migration attempt. UNIQUE ⇒ idempotency at the storage layer.
  idempotency_key text not null unique check (char_length(idempotency_key) between 8 and 200),
  account_id text not null check (char_length(account_id) between 1 and 200),
  -- Opaque, device-local journey reference. NEVER raw answers or PII.
  guest_ref text check (guest_ref is null or char_length(guest_ref) <= 200),
  status text not null default 'pending' check (status in (
    'pending', 'running', 'succeeded', 'failed', 'cancelled', 'compensated'
  )),
  -- What is being carried over (counts / provenance only, never content).
  provenance text not null default 'device_local' check (provenance in (
    'device_local', 'line_continuity', 'manual'
  )),
  saved_item_count integer not null default 0 check (saved_item_count >= 0),
  retry_count integer not null default 0 check (retry_count >= 0 and retry_count <= 50),
  last_error_code text check (last_error_code is null or char_length(last_error_code) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.yorisou_guest_migration_jobs is
  'APP-2 WS-E guest→account migration jobs. Idempotent by idempotency_key. User sees only own account rows; server writes via service_role.';
create index if not exists yorisou_gm_jobs_account_idx on public.yorisou_guest_migration_jobs (project_id, account_id, status);

create table if not exists public.yorisou_guest_migration_events (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.yorisou_guest_migration_jobs (id) on delete restrict,
  account_id text not null,
  event_type text not null check (event_type in (
    'created', 'started', 'succeeded', 'failed', 'cancelled', 'compensated', 'retried'
  )),
  from_status text,
  to_status text,
  detail text check (detail is null or char_length(detail) <= 1000),
  created_at timestamptz not null default now()
);
comment on table public.yorisou_guest_migration_events is
  'APP-2 WS-E append-only audit of migration job transitions. Immutable.';
create index if not exists yorisou_gm_events_job_idx on public.yorisou_guest_migration_events (job_id, created_at);

-- ─────────────────────────────────────────────────────────────────────────
-- 2. Adaptation persistence (WS-B account mirror)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_adaptation_state (
  account_id text primary key check (char_length(account_id) between 1 and 200),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  need text check (need is null or char_length(need) <= 60),
  pace text check (pace is null or pace in ('quick', 'deep')),
  last_result_family text check (last_result_family is null or char_length(last_result_family) <= 60),
  saved_item_ids text[] not null default '{}',
  tried_item_ids text[] not null default '{}',
  hidden_item_ids text[] not null default '{}',
  updated_at timestamptz not null default now()
);
comment on table public.yorisou_adaptation_state is
  'APP-2 WS-B account-side mirror of the device-local adaptation signals. No raw answers/PII. RLS user-isolated.';

-- ─────────────────────────────────────────────────────────────────────────
-- 3. Normalized feedback (WS-D)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_service_feedback (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  account_id text not null check (char_length(account_id) between 1 and 200),
  item_id text not null check (char_length(item_id) between 1 and 200),
  signal text not null check (signal in ('useful', 'not_now', 'tried', 'hide', 'saved')),
  created_at timestamptz not null default now()
);
comment on table public.yorisou_service_feedback is
  'APP-2 WS-D normalized coarse feedback. RLS user-isolated; aggregates feed readiness views.';
create index if not exists yorisou_feedback_account_idx on public.yorisou_service_feedback (project_id, account_id, item_id);
create index if not exists yorisou_feedback_item_idx on public.yorisou_service_feedback (project_id, item_id, signal);

-- ─────────────────────────────────────────────────────────────────────────
-- 4. Service incidents (WS-F/G)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_service_incidents (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  incident_type text not null check (char_length(incident_type) between 1 and 80),
  severity text not null default 'info' check (severity in ('info', 'low', 'medium', 'high', 'critical')),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved')),
  -- SAFE summary only — no raw answers, tokens, or PII.
  safe_summary text not null check (char_length(safe_summary) between 1 and 500),
  evidence_ref text check (evidence_ref is null or char_length(evidence_ref) <= 300),
  occurrence_count integer not null default 1 check (occurrence_count >= 1),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
comment on table public.yorisou_service_incidents is
  'APP-2 WS-F/G service incidents. Admin/service-role only. Safe summaries, no PII.';
create index if not exists yorisou_incidents_type_idx on public.yorisou_service_incidents (project_id, incident_type, status);

-- ─────────────────────────────────────────────────────────────────────────
-- 5. Review queue items + audit (WS-G)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_review_queue_items (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  queue_type text not null check (queue_type in (
    'content_report', 'safety_flag', 'failed_migration', 'adaptation_anomaly',
    'line_callback_failure', 'incident_followup', 'feedback_negative_cluster',
    'candidate_intake_review', 'access_denied_review', 'data_request'
  )),
  severity text not null default 'low' check (severity in ('low', 'medium', 'high', 'critical')),
  status text not null default 'open' check (status in (
    'open', 'reviewing', 'resolved', 'dismissed', 'reopened'
  )),
  safe_summary text not null check (char_length(safe_summary) between 1 and 500),
  evidence_ref text check (evidence_ref is null or char_length(evidence_ref) <= 300),
  occurrence_count integer not null default 1 check (occurrence_count >= 1),
  first_seen_at timestamptz not null default now(),
  last_occurrence_at timestamptz not null default now(),
  assigned_to text check (assigned_to is null or char_length(assigned_to) <= 200),
  resolution_note text check (resolution_note is null or char_length(resolution_note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.yorisou_review_queue_items is
  'APP-2 WS-G review queue (10 governed queue types). Admin/service-role only. Safe summaries, no PII.';
create index if not exists yorisou_review_items_queue_idx on public.yorisou_review_queue_items (project_id, queue_type, status, severity);

create table if not exists public.yorisou_review_queue_events (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.yorisou_review_queue_items (id) on delete restrict,
  event_type text not null check (event_type in (
    'created', 'assigned', 'status_changed', 'note_added', 'reopened'
  )),
  from_status text,
  to_status text,
  actor text not null check (char_length(actor) between 1 and 200),
  detail text check (detail is null or char_length(detail) <= 2000),
  created_at timestamptz not null default now()
);
comment on table public.yorisou_review_queue_events is
  'APP-2 WS-G append-only audit of review-queue lifecycle. Immutable.';
create index if not exists yorisou_review_events_item_idx on public.yorisou_review_queue_events (item_id, created_at);

-- ─────────────────────────────────────────────────────────────────────────
-- 6. Sensitive admin access logs (WS-H)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_admin_access_logs (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  actor text not null check (char_length(actor) between 1 and 200),
  actor_type text not null default 'admin' check (actor_type in ('founder', 'staff', 'admin', 'agent', 'system', 'anonymous', 'user')),
  scope text not null check (char_length(scope) between 1 and 120),
  action text not null check (char_length(action) between 1 and 120),
  -- Reference to the object touched — an id/route, NEVER the raw object/payload.
  safe_object_ref text check (safe_object_ref is null or char_length(safe_object_ref) <= 300),
  route text check (route is null or char_length(route) <= 300),
  allowed boolean not null,
  outcome text not null check (char_length(outcome) between 1 and 120),
  created_at timestamptz not null default now()
);
comment on table public.yorisou_admin_access_logs is
  'APP-2 WS-H append-only sensitive-admin access log. Records allowed AND denied access. No raw payload/PII. Immutable.';
create index if not exists yorisou_admin_logs_scope_idx on public.yorisou_admin_access_logs (project_id, scope, action, created_at);
create index if not exists yorisou_admin_logs_denied_idx on public.yorisou_admin_access_logs (project_id, allowed, created_at);

-- ─────────────────────────────────────────────────────────────────────────
-- 7. Append-only triggers on the three audit/log tables
-- ─────────────────────────────────────────────────────────────────────────
create trigger yorisou_guest_migration_events_no_mutate
  before update or delete or truncate on public.yorisou_guest_migration_events
  for each statement execute function public.yorisou_app2_block_mutation();
create trigger yorisou_review_queue_events_no_mutate
  before update or delete or truncate on public.yorisou_review_queue_events
  for each statement execute function public.yorisou_app2_block_mutation();
create trigger yorisou_admin_access_logs_no_mutate
  before update or delete or truncate on public.yorisou_admin_access_logs
  for each statement execute function public.yorisou_app2_block_mutation();

-- ─────────────────────────────────────────────────────────────────────────
-- 8. Row Level Security
-- ─────────────────────────────────────────────────────────────────────────
alter table public.yorisou_guest_migration_jobs enable row level security;
alter table public.yorisou_guest_migration_events enable row level security;
alter table public.yorisou_adaptation_state enable row level security;
alter table public.yorisou_service_feedback enable row level security;
alter table public.yorisou_service_incidents enable row level security;
alter table public.yorisou_review_queue_items enable row level security;
alter table public.yorisou_review_queue_events enable row level security;
alter table public.yorisou_admin_access_logs enable row level security;

-- Force RLS so even the table owner is subject to policies during local psql
-- verification (service_role still bypasses via BYPASSRLS).
alter table public.yorisou_guest_migration_jobs force row level security;
alter table public.yorisou_guest_migration_events force row level security;
alter table public.yorisou_adaptation_state force row level security;
alter table public.yorisou_service_feedback force row level security;
alter table public.yorisou_service_incidents force row level security;
alter table public.yorisou_review_queue_items force row level security;
alter table public.yorisou_review_queue_events force row level security;
alter table public.yorisou_admin_access_logs force row level security;

-- User-owned tables: authenticated may read/write ONLY their own account rows.
create policy gm_jobs_owner_select on public.yorisou_guest_migration_jobs
  for select to authenticated
  using (account_id = public.yorisou_current_account_id());
create policy gm_events_owner_select on public.yorisou_guest_migration_events
  for select to authenticated
  using (account_id = public.yorisou_current_account_id());
create policy adaptation_owner_all on public.yorisou_adaptation_state
  for all to authenticated
  using (account_id = public.yorisou_current_account_id())
  with check (account_id = public.yorisou_current_account_id());
create policy feedback_owner_select on public.yorisou_service_feedback
  for select to authenticated
  using (account_id = public.yorisou_current_account_id());
create policy feedback_owner_insert on public.yorisou_service_feedback
  for insert to authenticated
  with check (account_id = public.yorisou_current_account_id());

-- Admin-only tables: NO anon and NO authenticated policy ⇒ denied for both.
-- Reachable only by the server via service_role (RLS-bypassing), which performs
-- its own admin authorization. (No policy created on purpose = least privilege.)

-- ─────────────────────────────────────────────────────────────────────────
-- 9. Grants (defense in depth alongside RLS)
-- ─────────────────────────────────────────────────────────────────────────
-- anon: nothing here is ever anonymous.
revoke all on public.yorisou_guest_migration_jobs from anon;
revoke all on public.yorisou_guest_migration_events from anon;
revoke all on public.yorisou_adaptation_state from anon;
revoke all on public.yorisou_service_feedback from anon;
revoke all on public.yorisou_service_incidents from anon;
revoke all on public.yorisou_review_queue_items from anon;
revoke all on public.yorisou_review_queue_events from anon;
revoke all on public.yorisou_admin_access_logs from anon;

-- authenticated: only the user-owned tables, and only the needed verbs. No
-- access at all to admin tables (incidents, review queue/events, access logs).
grant select on public.yorisou_guest_migration_jobs to authenticated;
grant select on public.yorisou_guest_migration_events to authenticated;
grant select, insert, update on public.yorisou_adaptation_state to authenticated;
grant select, insert on public.yorisou_service_feedback to authenticated;
revoke all on public.yorisou_service_incidents from authenticated;
revoke all on public.yorisou_review_queue_items from authenticated;
revoke all on public.yorisou_review_queue_events from authenticated;
revoke all on public.yorisou_admin_access_logs from authenticated;

-- service_role: full DML (subject to append-only triggers on audit tables).
grant select, insert, update, delete on public.yorisou_guest_migration_jobs to service_role;
grant select, insert on public.yorisou_guest_migration_events to service_role;
grant select, insert, update, delete on public.yorisou_adaptation_state to service_role;
grant select, insert, update, delete on public.yorisou_service_feedback to service_role;
grant select, insert, update, delete on public.yorisou_service_incidents to service_role;
grant select, insert, update, delete on public.yorisou_review_queue_items to service_role;
grant select, insert on public.yorisou_review_queue_events to service_role;
grant select, insert on public.yorisou_admin_access_logs to service_role;

-- ─────────────────────────────────────────────────────────────────────────
-- 10. Atomic operations (SECURITY DEFINER; server calls via service_role)
-- ─────────────────────────────────────────────────────────────────────────

-- Idempotent job creation: same idempotency_key returns the SAME job and never
-- creates a duplicate or a second identity side-effect.
create or replace function public.create_yorisou_guest_migration_job(
  p_idempotency_key text,
  p_account_id text,
  p_guest_ref text,
  p_provenance text,
  p_saved_item_count text
)
returns public.yorisou_guest_migration_jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job public.yorisou_guest_migration_jobs;
  v_count integer := coalesce(nullif(p_saved_item_count, '')::integer, 0);
begin
  select * into v_job from public.yorisou_guest_migration_jobs
    where idempotency_key = p_idempotency_key;
  if found then
    return v_job;  -- idempotent: return existing, no new row, no new event
  end if;

  insert into public.yorisou_guest_migration_jobs
    (idempotency_key, account_id, guest_ref, provenance, saved_item_count)
  values
    (p_idempotency_key, p_account_id, p_guest_ref, coalesce(nullif(p_provenance, ''), 'device_local'), v_count)
  returning * into v_job;

  insert into public.yorisou_guest_migration_events
    (job_id, account_id, event_type, to_status, detail)
  values
    (v_job.id, v_job.account_id, 'created', 'pending', 'job created');

  return v_job;
end;
$$;

-- Guarded transition with allowed-transition enforcement + audit event.
create or replace function public.transition_yorisou_guest_migration_job(
  p_job_id uuid,
  p_to_status text,
  p_event_type text,
  p_error_code text,
  p_detail text
)
returns public.yorisou_guest_migration_jobs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job public.yorisou_guest_migration_jobs;
  v_from text;
  v_allowed boolean;
begin
  select * into v_job from public.yorisou_guest_migration_jobs where id = p_job_id for update;
  if not found then
    raise exception 'job_not_found';
  end if;
  v_from := v_job.status;

  v_allowed := case
    when v_from = 'pending'   and p_to_status in ('running', 'cancelled') then true
    when v_from = 'running'   and p_to_status in ('succeeded', 'failed', 'cancelled') then true
    when v_from = 'failed'    and p_to_status in ('running', 'compensated') then true
    else false
  end;
  if not v_allowed then
    raise exception 'illegal_transition:%->%', v_from, p_to_status;
  end if;

  update public.yorisou_guest_migration_jobs
    set status = p_to_status,
        last_error_code = case when p_to_status = 'failed' then p_error_code else last_error_code end,
        retry_count = case when p_event_type = 'retried' then retry_count + 1 else retry_count end,
        updated_at = now()
    where id = p_job_id
    returning * into v_job;

  insert into public.yorisou_guest_migration_events
    (job_id, account_id, event_type, from_status, to_status, detail)
  values
    (v_job.id, v_job.account_id, p_event_type, v_from, p_to_status, p_detail);

  return v_job;
end;
$$;

-- Enqueue / transition a review item with an audit event.
create or replace function public.enqueue_yorisou_review_item(
  p_queue_type text,
  p_severity text,
  p_safe_summary text,
  p_evidence_ref text,
  p_actor text,
  p_detail text
)
returns public.yorisou_review_queue_items
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item public.yorisou_review_queue_items;
begin
  insert into public.yorisou_review_queue_items
    (queue_type, severity, safe_summary, evidence_ref)
  values
    (p_queue_type, coalesce(nullif(p_severity, ''), 'low'), p_safe_summary, p_evidence_ref)
  returning * into v_item;

  insert into public.yorisou_review_queue_events
    (item_id, event_type, to_status, actor, detail)
  values
    (v_item.id, 'created', 'open', coalesce(nullif(p_actor, ''), 'system'), p_detail);

  return v_item;
end;
$$;

create or replace function public.transition_yorisou_review_item(
  p_item_id uuid,
  p_to_status text,
  p_actor text,
  p_resolution_note text,
  p_detail text
)
returns public.yorisou_review_queue_items
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item public.yorisou_review_queue_items;
  v_from text;
  v_allowed boolean;
begin
  select * into v_item from public.yorisou_review_queue_items where id = p_item_id for update;
  if not found then
    raise exception 'review_item_not_found';
  end if;
  v_from := v_item.status;

  v_allowed := case
    when v_from = 'open'      and p_to_status in ('reviewing', 'dismissed') then true
    when v_from = 'reviewing' and p_to_status in ('resolved', 'dismissed', 'open') then true
    when v_from = 'resolved'  and p_to_status in ('reopened') then true
    when v_from = 'dismissed' and p_to_status in ('reopened') then true
    when v_from = 'reopened'  and p_to_status in ('reviewing', 'resolved', 'dismissed') then true
    else false
  end;
  if not v_allowed then
    raise exception 'illegal_transition:%->%', v_from, p_to_status;
  end if;

  update public.yorisou_review_queue_items
    set status = p_to_status,
        resolution_note = coalesce(p_resolution_note, resolution_note),
        assigned_to = coalesce(nullif(p_actor, ''), assigned_to),
        updated_at = now()
    where id = p_item_id
    returning * into v_item;

  insert into public.yorisou_review_queue_events
    (item_id, event_type, from_status, to_status, actor, detail)
  values
    (v_item.id, case when p_to_status = 'reopened' then 'reopened' else 'status_changed' end,
     v_from, p_to_status, coalesce(nullif(p_actor, ''), 'system'), p_detail);

  return v_item;
end;
$$;

-- Append a sensitive-admin access log row (records allowed AND denied access).
create or replace function public.log_yorisou_admin_access(
  p_actor text,
  p_actor_type text,
  p_scope text,
  p_action text,
  p_safe_object_ref text,
  p_route text,
  p_allowed boolean,
  p_outcome text
)
returns public.yorisou_admin_access_logs
language plpgsql
security definer
set search_path = public
as $$
declare
  v_log public.yorisou_admin_access_logs;
begin
  insert into public.yorisou_admin_access_logs
    (actor, actor_type, scope, action, safe_object_ref, route, allowed, outcome)
  values
    (coalesce(nullif(p_actor, ''), 'unknown'),
     coalesce(nullif(p_actor_type, ''), 'admin'),
     p_scope, p_action, p_safe_object_ref, p_route, p_allowed,
     coalesce(nullif(p_outcome, ''), case when p_allowed then 'allowed' else 'denied' end))
  returning * into v_log;
  return v_log;
end;
$$;

-- Functions are invoked by the server via service_role only.
revoke all on function public.create_yorisou_guest_migration_job(text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.transition_yorisou_guest_migration_job(uuid,text,text,text,text) from public, anon, authenticated;
revoke all on function public.enqueue_yorisou_review_item(text,text,text,text,text,text) from public, anon, authenticated;
revoke all on function public.transition_yorisou_review_item(uuid,text,text,text,text) from public, anon, authenticated;
revoke all on function public.log_yorisou_admin_access(text,text,text,text,text,text,boolean,text) from public, anon, authenticated;
grant execute on function public.create_yorisou_guest_migration_job(text,text,text,text,text) to service_role;
grant execute on function public.transition_yorisou_guest_migration_job(uuid,text,text,text,text) to service_role;
grant execute on function public.enqueue_yorisou_review_item(text,text,text,text,text,text) to service_role;
grant execute on function public.transition_yorisou_review_item(uuid,text,text,text,text) to service_role;
grant execute on function public.log_yorisou_admin_access(text,text,text,text,text,text,boolean,text) to service_role;

-- ─────────────────────────────────────────────────────────────────────────
-- 11. Readiness aggregate views (WS-F) — aggregates ONLY, no raw answers/PII
-- ─────────────────────────────────────────────────────────────────────────
create or replace view public.yorisou_migration_funnel as
  select
    count(*) as total_jobs,
    count(*) filter (where status = 'succeeded') as succeeded,
    count(*) filter (where status = 'failed') as failed,
    count(*) filter (where status = 'cancelled') as cancelled,
    count(*) filter (where status = 'compensated') as compensated,
    count(*) filter (where status in ('pending', 'running')) as in_progress,
    coalesce(sum(retry_count), 0) as total_retries
  from public.yorisou_guest_migration_jobs;
comment on view public.yorisou_migration_funnel is 'APP-2 WS-F migration funnel aggregate. No PII.';

create or replace view public.yorisou_review_queue_summary as
  select queue_type, status, severity, count(*) as item_count
  from public.yorisou_review_queue_items
  group by queue_type, status, severity;
comment on view public.yorisou_review_queue_summary is 'APP-2 WS-F/G review-queue aggregate. No PII.';

create or replace view public.yorisou_service_readiness_overview as
  select
    (select count(*) from public.yorisou_service_incidents where status = 'open') as open_incidents,
    (select count(*) from public.yorisou_service_incidents where severity in ('high', 'critical') and status = 'open') as high_severity_open,
    (select count(*) from public.yorisou_review_queue_items where status in ('open', 'reviewing')) as open_review_items,
    (select count(*) from public.yorisou_guest_migration_jobs where status = 'failed') as failed_migrations,
    (select count(*) from public.yorisou_admin_access_logs where allowed = false) as denied_admin_access_events;
comment on view public.yorisou_service_readiness_overview is 'APP-2 WS-F readiness overview aggregate. No PII.';

-- Views run with the querying role''s privileges (security_invoker) so admin
-- aggregates are reachable only by service_role, never anon/authenticated.
alter view public.yorisou_migration_funnel set (security_invoker = true);
alter view public.yorisou_review_queue_summary set (security_invoker = true);
alter view public.yorisou_service_readiness_overview set (security_invoker = true);
revoke all on public.yorisou_migration_funnel from anon, authenticated;
revoke all on public.yorisou_review_queue_summary from anon, authenticated;
revoke all on public.yorisou_service_readiness_overview from anon, authenticated;
grant select on public.yorisou_migration_funnel to service_role;
grant select on public.yorisou_review_queue_summary to service_role;
grant select on public.yorisou_service_readiness_overview to service_role;
