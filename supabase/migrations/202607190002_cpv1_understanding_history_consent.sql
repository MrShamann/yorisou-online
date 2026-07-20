-- CPV1 WS-D/E/F — local Supabase schema for source-separated understanding,
-- append-only longitudinal history, and method-level consent.
--
-- Governance: ADDITIVE ONLY; reversible; RLS user-isolated; append-only audit on
-- history; consent-aware; source-versioned. LOCAL Supabase verification only —
-- never production. Depends on public.yorisou_current_account_id() from
-- migration 202607190001 (APP-2).
--
-- ROLLBACK CLASSIFICATION: LOCAL_DISPOSABLE_SCHEMA_ROLLBACK (structurally + data destructive).
--   Dropping these tables DESTROYS all rows they hold. Safe ONLY in an isolated
--   disposable local/test database; NOT approved for any persistent environment; no
--   production migration authorized. A persistent environment would require a
--   separately approved, data-preserving forward correction. Rollback (disposable
--   local DB only):
--   drop trigger if exists yorisou_cpv1_history_no_mutate on public.yorisou_cpv1_history_events;
--   drop table if exists public.yorisou_cpv1_history_events;
--   drop table if exists public.yorisou_cpv1_method_consent;
--   drop table if exists public.yorisou_cpv1_observations;
--   drop table if exists public.yorisou_cpv1_method_registry_snapshot;

-- ── 1. Method registry snapshot (admin/readiness; no user data) ──────────────
create table if not exists public.yorisou_cpv1_method_registry_snapshot (
  method_id text primary key,
  name_ja text not null,
  family text not null,
  rights_route text not null,
  activation_state text not null check (activation_state in (
    'public_active', 'implemented_private', 'rights_blocked', 'contract_only', 'retired'
  )),
  dev_flagged boolean not null default true,
  method_version text not null,
  updated_at timestamptz not null default now()
);
comment on table public.yorisou_cpv1_method_registry_snapshot is
  'CPV1 method registry snapshot for admin readiness. No user data. Admin/service-role only.';

-- ── 2. Source-separated understanding observations (user-owned) ──────────────
create table if not exists public.yorisou_cpv1_observations (
  id uuid primary key default gen_random_uuid(),
  account_id text not null check (char_length(account_id) between 1 and 200),
  source_class text not null check (source_class in (
    'verified_user_fact','direct_user_statement','current_state_answer','yorisou_original_result',
    'psychology_preference_reflection','licensed_framework_result','imported_external_result',
    'chinese_cultural_interpretation','symbolic_reflection','behavioral_feedback','historical_state',
    'ai_synthesis','user_confirmation','user_correction','user_rejection'
  )),
  method_id text,
  method_version text,
  derived text not null check (char_length(derived) <= 2000), -- safe summary, never raw answers
  evidence_class text not null check (evidence_class in ('user_declared','method_derived','behavioral','inferred','imported')),
  confirmation text not null default 'unreviewed' check (confirmation in ('unreviewed','confirmed','corrected','rejected')),
  user_correction text,
  privacy text not null default 'account_private' check (privacy in (
    'device_local','account_private','companion_permitted','recommendation_permitted','public_safe'
  )),
  permitted_downstream text[] not null default '{}',
  freshness_at timestamptz not null default now(),
  deleted boolean not null default false,
  created_at timestamptz not null default now()
);
comment on table public.yorisou_cpv1_observations is
  'CPV1 WS-D source-separated observations. No universal score. RLS user-isolated. Safe summaries only.';
create index if not exists yorisou_cpv1_obs_account_idx on public.yorisou_cpv1_observations (account_id, source_class, deleted);

-- ── 3. Method-level consent (user-owned) ─────────────────────────────────────
create table if not exists public.yorisou_cpv1_method_consent (
  account_id text not null check (char_length(account_id) between 1 and 200),
  method_id text not null,
  retention text not null default 'session_only' check (retention in ('session_only','device_local','account_saved')),
  save_acknowledged boolean not null default false,
  raw_location_minimized boolean not null default true,
  derived_provenance text,
  companion_use boolean not null default false,
  recommendation_use boolean not null default false,
  community_use boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (account_id, method_id)
);
comment on table public.yorisou_cpv1_method_consent is
  'CPV1 WS-E method-level consent. Birth-data methods default session_only; community_use default false. RLS user-isolated.';

-- ── 4. Append-only longitudinal history (immutable) ──────────────────────────
create table if not exists public.yorisou_cpv1_history_events (
  id uuid primary key default gen_random_uuid(),
  account_id text not null check (char_length(account_id) between 1 and 200),
  event_type text not null check (event_type in (
    'method_completed','result_created','user_confirmed','user_corrected','user_rejected',
    'reflection_recorded','action_saved','action_tried','action_completed','marked_helpful',
    'marked_not_helpful','hidden','not_for_me','companion_interaction','community_participation','recommendation_outcome'
  )),
  method_id text,
  method_version text,
  object_ref text,
  safe_detail text check (safe_detail is null or char_length(safe_detail) <= 1000),
  supersedes_version text, -- version-preserving: prior version recorded, never overwritten
  created_at timestamptz not null default now()
);
comment on table public.yorisou_cpv1_history_events is
  'CPV1 WS-F append-only, version-preserving history. Immutable (no silent rewrite). RLS user-isolated.';
create index if not exists yorisou_cpv1_hist_account_idx on public.yorisou_cpv1_history_events (account_id, created_at);

-- Reuse the APP-2 append-only guard on history.
create trigger yorisou_cpv1_history_no_mutate
  before update or delete or truncate on public.yorisou_cpv1_history_events
  for each statement execute function public.yorisou_app2_block_mutation();

-- ── 5. RLS ───────────────────────────────────────────────────────────────────
alter table public.yorisou_cpv1_method_registry_snapshot enable row level security;
alter table public.yorisou_cpv1_observations enable row level security;
alter table public.yorisou_cpv1_method_consent enable row level security;
alter table public.yorisou_cpv1_history_events enable row level security;
alter table public.yorisou_cpv1_method_registry_snapshot force row level security;
alter table public.yorisou_cpv1_observations force row level security;
alter table public.yorisou_cpv1_method_consent force row level security;
alter table public.yorisou_cpv1_history_events force row level security;

-- User-owned tables: authenticated may access ONLY their own account rows.
create policy cpv1_obs_owner_all on public.yorisou_cpv1_observations
  for all to authenticated
  using (account_id = public.yorisou_current_account_id())
  with check (account_id = public.yorisou_current_account_id());
create policy cpv1_consent_owner_all on public.yorisou_cpv1_method_consent
  for all to authenticated
  using (account_id = public.yorisou_current_account_id())
  with check (account_id = public.yorisou_current_account_id());
create policy cpv1_history_owner_select on public.yorisou_cpv1_history_events
  for select to authenticated
  using (account_id = public.yorisou_current_account_id());
-- Registry snapshot is admin/service-role only: no anon/authenticated policy.

-- ── 6. Grants ────────────────────────────────────────────────────────────────
revoke all on public.yorisou_cpv1_method_registry_snapshot from anon, authenticated;
revoke all on public.yorisou_cpv1_observations from anon;
revoke all on public.yorisou_cpv1_method_consent from anon;
revoke all on public.yorisou_cpv1_history_events from anon;
grant select, insert, update, delete on public.yorisou_cpv1_observations to authenticated;
grant select, insert, update, delete on public.yorisou_cpv1_method_consent to authenticated;
grant select on public.yorisou_cpv1_history_events to authenticated;
grant select, insert, update, delete on public.yorisou_cpv1_method_registry_snapshot to service_role;
grant select, insert, update, delete on public.yorisou_cpv1_observations to service_role;
grant select, insert, update, delete on public.yorisou_cpv1_method_consent to service_role;
grant select, insert on public.yorisou_cpv1_history_events to service_role;
