-- CIF-1: Candidate Intake Foundation (non-public, governance-controlled).
--
-- Purpose: an INTERNAL, admin-only record of candidate organizations and
-- candidate offerings that MAY LATER be considered — through separately
-- authorized workflows — for YORISOU resources, recommendations, or tests.
--
-- This migration is a FOUNDATION ONLY. It does NOT implement, imply, or enable:
-- supplier self-service, public submission, recommendation eligibility or
-- ranking, market/concept/prototype testing, purchase intent, waitlist,
-- preorder, payment, autonomous discovery/outreach, or cross-project data
-- sharing. `accepted_for_evaluation` NEVER means approved / verified /
-- endorsed / safe / recommendation-eligible / commercially accepted.
--
-- Additive only: creates four NEW tables + one controlled-transition function.
-- No existing YORISOU table is altered or dropped.
--
-- Rollback (non-destructive): drop in dependency order —
--   drop function if exists public.create_yorisou_candidate_submission(uuid,uuid,text,text,text,text,text,text,text,text,text,text,text,timestamptz,text,text,text);
--   drop function if exists public.create_yorisou_candidate_offering(uuid,text,text,text,text,text,text,uuid,text,text);
--   drop function if exists public.create_yorisou_candidate_organization(text,text,text,text,text,text,text,text,text,text);
--   drop function if exists public.transition_yorisou_candidate_submission(uuid,text,text,text,text);
--   drop trigger if exists yorisou_candidate_events_no_update_delete on public.yorisou_candidate_events;
--   drop trigger if exists yorisou_candidate_events_no_truncate on public.yorisou_candidate_events;
--   drop function if exists public.yorisou_candidate_events_block_mutation();
--   drop table if exists public.yorisou_candidate_events;
--   drop table if exists public.yorisou_candidate_submissions;
--   drop table if exists public.yorisou_candidate_offerings;
--   drop table if exists public.yorisou_candidate_organizations;
-- No existing rows anywhere are modified by this migration.

-- ─────────────────────────────────────────────────────────────────────────
-- 1. Candidate organizations (the governed source entity)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_candidate_organizations (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  source_type text not null check (source_type in (
    'external_supplier', 'creator', 'institution', 'partner',
    'founder_sourced', 'agent_discovered', 'internal_project', 'other'
  )),
  display_name text not null check (char_length(display_name) between 1 and 300),
  external_domain text check (external_domain is null or char_length(external_domain) <= 253),
  -- Governed external identifier / URL used ONLY for duplicate detection.
  external_ref text check (external_ref is null or char_length(external_ref) <= 500),
  -- Commercial/relationship provenance. NEVER used to boost eligibility/ranking
  -- (this package does not touch the recommendation engine at all).
  commercial_relationship text not null default 'unknown_review' check (commercial_relationship in (
    'none', 'sponsored', 'affiliate', 'paid_evaluation', 'partner',
    'internal_owned', 'related_party', 'unknown_review'
  )),
  -- Internal-project link stores ONLY a governed identifier + disclosures.
  -- It must never create shared accounts / customer data / cross-project reads.
  related_project_ref text check (related_project_ref is null or char_length(related_project_ref) <= 200),
  conflict_of_interest_disclosure text check (conflict_of_interest_disclosure is null or char_length(conflict_of_interest_disclosure) <= 2000),
  notes text check (notes is null or char_length(notes) <= 4000),
  lifecycle_status text not null default 'active' check (lifecycle_status in ('active', 'archived')),
  created_by text not null check (char_length(created_by) between 1 and 200),
  created_by_type text not null default 'admin' check (created_by_type in ('founder', 'staff', 'admin', 'agent', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.yorisou_candidate_organizations is
  'CIF-1 internal candidate organizations. Admin/service-role only. Not public, not recommendation-eligible.';
create index if not exists yorisou_candidate_orgs_domain_idx on public.yorisou_candidate_organizations (project_id, external_domain) where external_domain is not null;
create index if not exists yorisou_candidate_orgs_ref_idx on public.yorisou_candidate_organizations (project_id, external_ref) where external_ref is not null;
create index if not exists yorisou_candidate_orgs_name_idx on public.yorisou_candidate_organizations (project_id, lower(display_name));
create index if not exists yorisou_candidate_orgs_source_idx on public.yorisou_candidate_organizations (project_id, source_type, lifecycle_status);

-- ─────────────────────────────────────────────────────────────────────────
-- 2. Candidate offerings (product / service / resource / content / … )
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_candidate_offerings (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  organization_id uuid not null references public.yorisou_candidate_organizations (id) on delete restrict,
  offering_type text not null check (offering_type in (
    'product', 'service', 'resource', 'content', 'experience',
    'concept', 'prototype', 'other'
  )),
  title text not null check (char_length(title) between 1 and 300),
  summary text check (summary is null or char_length(summary) <= 4000),
  external_url text check (external_url is null or char_length(external_url) <= 1000),
  external_ref text check (external_ref is null or char_length(external_ref) <= 500),
  -- Multiple versions of one offering are preserved as distinct rows chained
  -- via supersedes_offering_id (never overwrite an earlier version).
  version_label text check (version_label is null or char_length(version_label) <= 120),
  supersedes_offering_id uuid references public.yorisou_candidate_offerings (id) on delete set null,
  lifecycle_status text not null default 'active' check (lifecycle_status in ('active', 'archived')),
  created_by text not null check (char_length(created_by) between 1 and 200),
  created_by_type text not null default 'admin' check (created_by_type in ('founder', 'staff', 'admin', 'agent', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.yorisou_candidate_offerings is
  'CIF-1 internal candidate offerings. Admin/service-role only. Versions preserved via supersedes_offering_id.';
create index if not exists yorisou_candidate_offerings_org_idx on public.yorisou_candidate_offerings (organization_id, lifecycle_status);
create index if not exists yorisou_candidate_offerings_ref_idx on public.yorisou_candidate_offerings (project_id, external_ref) where external_ref is not null;
create index if not exists yorisou_candidate_offerings_supersedes_idx on public.yorisou_candidate_offerings (supersedes_offering_id) where supersedes_offering_id is not null;

-- ─────────────────────────────────────────────────────────────────────────
-- 3. Candidate submissions (one referral / founder entry / agent record)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_candidate_submissions (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  organization_id uuid not null references public.yorisou_candidate_organizations (id) on delete restrict,
  offering_id uuid references public.yorisou_candidate_offerings (id) on delete set null,
  submission_channel text not null check (submission_channel in (
    'founder_manual', 'internal_research', 'agent_assisted', 'partner_referral',
    'external_supplier', 'creator', 'internal_project', 'other'
  )),
  submitter_type text not null check (submitter_type in (
    'founder', 'staff', 'agent', 'external_supplier', 'creator', 'partner', 'internal_project', 'other'
  )),
  -- Governed identifier reference for the submitter (NOT raw PII beyond consent).
  submitter_ref text check (submitter_ref is null or char_length(submitter_ref) <= 200),
  provenance text not null check (char_length(provenance) between 1 and 1000),
  commercial_relationship text not null default 'unknown_review' check (commercial_relationship in (
    'none', 'sponsored', 'affiliate', 'paid_evaluation', 'partner',
    'internal_owned', 'related_party', 'unknown_review'
  )),
  related_project_disclosure text check (related_project_disclosure is null or char_length(related_project_disclosure) <= 2000),
  conflict_of_interest_disclosure text check (conflict_of_interest_disclosure is null or char_length(conflict_of_interest_disclosure) <= 2000),
  -- Consent + retention. Contact info is stored ONLY when consent is recorded,
  -- kept minimal, and always paired with a retention category/deadline.
  consent_status text not null default 'not_required' check (consent_status in ('not_required', 'pending', 'recorded', 'withdrawn')),
  consent_reference text check (consent_reference is null or char_length(consent_reference) <= 200),
  contact_info text check (contact_info is null or char_length(contact_info) <= 500),
  retention_category text not null default 'standard' check (retention_category in ('transient', 'standard', 'extended', 'legal_hold')),
  retention_deadline timestamptz,
  external_ref text check (external_ref is null or char_length(external_ref) <= 500),
  -- Governed submission lifecycle. accepted_for_evaluation != approved/verified/
  -- endorsed/safe/recommendation-eligible/commercially-accepted.
  status text not null default 'draft' check (status in (
    'draft', 'submitted', 'under_review', 'needs_information',
    'accepted_for_evaluation', 'rejected', 'withdrawn', 'archived'
  )),
  status_reason text check (status_reason is null or char_length(status_reason) <= 2000),
  -- Contact info may only exist once consent is recorded (privacy invariant).
  constraint yorisou_candidate_submissions_contact_consent_chk
    check (contact_info is null or consent_status = 'recorded'),
  created_by text not null check (char_length(created_by) between 1 and 200),
  created_by_type text not null default 'admin' check (created_by_type in ('founder', 'staff', 'admin', 'agent', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.yorisou_candidate_submissions is
  'CIF-1 internal candidate submissions. Admin/service-role only. accepted_for_evaluation is NOT approval/verification/endorsement/recommendation-eligibility.';
create index if not exists yorisou_candidate_submissions_org_idx on public.yorisou_candidate_submissions (organization_id, created_at desc);
create index if not exists yorisou_candidate_submissions_offering_idx on public.yorisou_candidate_submissions (offering_id) where offering_id is not null;
create index if not exists yorisou_candidate_submissions_status_idx on public.yorisou_candidate_submissions (project_id, status, created_at desc);
create index if not exists yorisou_candidate_submissions_ref_idx on public.yorisou_candidate_submissions (project_id, external_ref) where external_ref is not null;

-- ─────────────────────────────────────────────────────────────────────────
-- 4. Candidate events (append-oriented audit history)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_candidate_events (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  submission_id uuid references public.yorisou_candidate_submissions (id) on delete set null,
  organization_id uuid references public.yorisou_candidate_organizations (id) on delete set null,
  offering_id uuid references public.yorisou_candidate_offerings (id) on delete set null,
  event_type text not null check (event_type in (
    'created', 'updated', 'status_changed', 'withdrawn', 'rejected',
    'archived', 'material_change', 'review_note'
  )),
  actor text not null check (char_length(actor) between 1 and 200),
  actor_type text not null default 'admin' check (actor_type in ('founder', 'staff', 'admin', 'agent', 'system')),
  reason text check (reason is null or char_length(reason) <= 2000),
  previous_state text check (previous_state is null or char_length(previous_state) <= 60),
  new_state text check (new_state is null or char_length(new_state) <= 60),
  metadata jsonb check (metadata is null or jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);
comment on table public.yorisou_candidate_events is
  'CIF-1 append-oriented audit history. Admin/service-role only. Never silently erased on withdrawal/archival.';
create index if not exists yorisou_candidate_events_submission_idx on public.yorisou_candidate_events (submission_id, created_at desc);
create index if not exists yorisou_candidate_events_org_idx on public.yorisou_candidate_events (organization_id, created_at desc) where organization_id is not null;
create index if not exists yorisou_candidate_events_offering_idx on public.yorisou_candidate_events (offering_id, created_at desc) where offering_id is not null;

-- ─────────────────────────────────────────────────────────────────────────
-- 5. Privacy posture: RLS on, all direct grants revoked (service-role only).
-- ─────────────────────────────────────────────────────────────────────────
alter table public.yorisou_candidate_organizations enable row level security;
alter table public.yorisou_candidate_offerings enable row level security;
alter table public.yorisou_candidate_submissions enable row level security;
alter table public.yorisou_candidate_events enable row level security;

revoke all on table
  public.yorisou_candidate_organizations,
  public.yorisou_candidate_offerings,
  public.yorisou_candidate_submissions,
  public.yorisou_candidate_events
from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table public.yorisou_candidate_organizations, public.yorisou_candidate_offerings, public.yorisou_candidate_submissions, public.yorisou_candidate_events from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table public.yorisou_candidate_organizations, public.yorisou_candidate_offerings, public.yorisou_candidate_submissions, public.yorisou_candidate_events from authenticated';
  end if;
end $$;

-- No RLS policies are created: with RLS enabled and no policy, non-superuser
-- non-owner roles (anon/authenticated) are default-denied on every row.
-- All access is exclusively via the server-side service-role repository, which
-- checks admin authorization before every operation.

-- ─────────────────────────────────────────────────────────────────────────
-- 6. Controlled submission state machine (atomic transition + audit event).
-- Enforces allowed transitions and a mandatory reason for material decisions.
-- Resubmission after withdrawn/rejected is a NEW submission (history preserved),
-- so no transition leaves withdrawn/rejected back into active states.
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.transition_yorisou_candidate_submission(
  p_submission_id uuid,
  p_actor text,
  p_actor_type text,
  p_to_status text,
  p_reason text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_from text;
  v_allowed boolean := false;
  v_reason_required boolean;
begin
  if p_actor is null or char_length(p_actor) not between 1 and 200 then
    raise exception 'cif1_invalid_actor';
  end if;
  if p_actor_type not in ('founder', 'staff', 'admin', 'agent', 'system') then
    raise exception 'cif1_invalid_actor_type';
  end if;
  if p_to_status not in ('draft','submitted','under_review','needs_information','accepted_for_evaluation','rejected','withdrawn','archived') then
    raise exception 'cif1_invalid_target_status';
  end if;

  select status into v_from from public.yorisou_candidate_submissions where id = p_submission_id for update;
  if v_from is null then
    raise exception 'cif1_submission_not_found';
  end if;

  -- Allowed transition map.
  v_allowed := case
    when v_from = 'draft' and p_to_status in ('submitted','withdrawn','archived') then true
    when v_from = 'submitted' and p_to_status in ('under_review','needs_information','withdrawn','archived') then true
    when v_from = 'under_review' and p_to_status in ('needs_information','accepted_for_evaluation','rejected','withdrawn','archived') then true
    when v_from = 'needs_information' and p_to_status in ('under_review','submitted','withdrawn','archived') then true
    when v_from = 'accepted_for_evaluation' and p_to_status in ('archived','withdrawn') then true
    when v_from = 'rejected' and p_to_status in ('archived') then true
    when v_from = 'withdrawn' and p_to_status in ('archived') then true
    else false
  end;

  if not v_allowed then
    raise exception 'cif1_invalid_transition:% ->%', v_from, p_to_status;
  end if;

  -- Mandatory reason for material review decisions.
  v_reason_required := p_to_status in ('needs_information','accepted_for_evaluation','rejected','withdrawn','archived');
  if v_reason_required and (p_reason is null or char_length(btrim(p_reason)) = 0) then
    raise exception 'cif1_reason_required_for:%', p_to_status;
  end if;

  update public.yorisou_candidate_submissions
    set status = p_to_status,
        status_reason = p_reason,
        updated_at = now()
    where id = p_submission_id;

  insert into public.yorisou_candidate_events (
    project_id, submission_id, organization_id, offering_id, event_type,
    actor, actor_type, reason, previous_state, new_state
  )
  select 'yorisou', s.id, s.organization_id, s.offering_id,
    case p_to_status
      when 'withdrawn' then 'withdrawn'
      when 'rejected' then 'rejected'
      when 'archived' then 'archived'
      else 'status_changed'
    end,
    p_actor, p_actor_type, p_reason, v_from, p_to_status
  from public.yorisou_candidate_submissions s where s.id = p_submission_id;

  return p_submission_id;
end $$;

revoke all on function public.transition_yorisou_candidate_submission(uuid, text, text, text, text) from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on function public.transition_yorisou_candidate_submission(uuid, text, text, text, text) from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on function public.transition_yorisou_candidate_submission(uuid, text, text, text, text) from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.transition_yorisou_candidate_submission(uuid, text, text, text, text) to service_role';
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────
-- 7. CIF-1A: atomic creation. A governed object and its `created` audit event
-- are inserted in ONE transaction (the function body). If the event insert
-- fails, the object insert is rolled back — an object can never exist without
-- its creation event. These security-definer RPCs are the ONLY creation path
-- (direct INSERT is revoked from service_role in section 9), so there is no
-- retained path where the object commits while the event fails separately.
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.create_yorisou_candidate_organization(
  p_source_type text,
  p_display_name text,
  p_external_domain text,
  p_external_ref text,
  p_commercial_relationship text,
  p_related_project_ref text,
  p_conflict_of_interest_disclosure text,
  p_notes text,
  p_actor text,
  p_actor_type text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare v_row public.yorisou_candidate_organizations;
begin
  insert into public.yorisou_candidate_organizations (
    source_type, display_name, external_domain, external_ref,
    commercial_relationship, related_project_ref, conflict_of_interest_disclosure,
    notes, created_by, created_by_type
  ) values (
    p_source_type, p_display_name, p_external_domain, p_external_ref,
    coalesce(p_commercial_relationship, 'unknown_review'), p_related_project_ref,
    p_conflict_of_interest_disclosure, p_notes, p_actor, coalesce(p_actor_type, 'admin')
  ) returning * into v_row;

  insert into public.yorisou_candidate_events (project_id, organization_id, event_type, actor, actor_type, new_state)
    values ('yorisou', v_row.id, 'created', p_actor, coalesce(p_actor_type, 'admin'), 'active');

  return to_jsonb(v_row);
end $$;

create or replace function public.create_yorisou_candidate_offering(
  p_organization_id uuid,
  p_offering_type text,
  p_title text,
  p_summary text,
  p_external_url text,
  p_external_ref text,
  p_version_label text,
  p_supersedes_offering_id uuid,
  p_actor text,
  p_actor_type text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare v_row public.yorisou_candidate_offerings;
begin
  insert into public.yorisou_candidate_offerings (
    organization_id, offering_type, title, summary, external_url, external_ref,
    version_label, supersedes_offering_id, created_by, created_by_type
  ) values (
    p_organization_id, p_offering_type, p_title, p_summary, p_external_url, p_external_ref,
    p_version_label, p_supersedes_offering_id, p_actor, coalesce(p_actor_type, 'admin')
  ) returning * into v_row;

  insert into public.yorisou_candidate_events (project_id, organization_id, offering_id, event_type, actor, actor_type, new_state)
    values ('yorisou', v_row.organization_id, v_row.id, 'created', p_actor, coalesce(p_actor_type, 'admin'), 'active');

  return to_jsonb(v_row);
end $$;

create or replace function public.create_yorisou_candidate_submission(
  p_organization_id uuid,
  p_offering_id uuid,
  p_submission_channel text,
  p_submitter_type text,
  p_submitter_ref text,
  p_provenance text,
  p_commercial_relationship text,
  p_related_project_disclosure text,
  p_conflict_of_interest_disclosure text,
  p_consent_status text,
  p_consent_reference text,
  p_contact_info text,
  p_retention_category text,
  p_retention_deadline timestamptz,
  p_external_ref text,
  p_actor text,
  p_actor_type text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare v_row public.yorisou_candidate_submissions;
begin
  insert into public.yorisou_candidate_submissions (
    organization_id, offering_id, submission_channel, submitter_type, submitter_ref,
    provenance, commercial_relationship, related_project_disclosure,
    conflict_of_interest_disclosure, consent_status, consent_reference, contact_info,
    retention_category, retention_deadline, external_ref, created_by, created_by_type
  ) values (
    p_organization_id, p_offering_id, p_submission_channel, p_submitter_type, p_submitter_ref,
    p_provenance, coalesce(p_commercial_relationship, 'unknown_review'), p_related_project_disclosure,
    p_conflict_of_interest_disclosure, coalesce(p_consent_status, 'not_required'), p_consent_reference,
    p_contact_info, coalesce(p_retention_category, 'standard'), p_retention_deadline, p_external_ref,
    p_actor, coalesce(p_actor_type, 'admin')
  ) returning * into v_row;

  insert into public.yorisou_candidate_events (project_id, submission_id, organization_id, offering_id, event_type, actor, actor_type, new_state)
    values ('yorisou', v_row.id, v_row.organization_id, v_row.offering_id, 'created', p_actor, coalesce(p_actor_type, 'admin'), 'draft');

  return to_jsonb(v_row);
end $$;

-- ─────────────────────────────────────────────────────────────────────────
-- 8. CIF-1A: audit events are append-only. UPDATE/DELETE/TRUNCATE are blocked
-- for everyone (including the table owner and any definer path) by triggers.
-- INSERT remains allowed (used only by the security-definer functions above
-- and the transition function). A future retention/legal-erasure mechanism, if
-- ever needed, is deliberately left to a separately authorized package.
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_candidate_events_block_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'cif1_candidate_events_are_append_only';
end $$;

drop trigger if exists yorisou_candidate_events_no_update_delete on public.yorisou_candidate_events;
create trigger yorisou_candidate_events_no_update_delete
  before update or delete on public.yorisou_candidate_events
  for each row execute function public.yorisou_candidate_events_block_mutation();

drop trigger if exists yorisou_candidate_events_no_truncate on public.yorisou_candidate_events;
create trigger yorisou_candidate_events_no_truncate
  before truncate on public.yorisou_candidate_events
  for each statement execute function public.yorisou_candidate_events_block_mutation();

-- ─────────────────────────────────────────────────────────────────────────
-- 9. CIF-1A: explicit service-role application permission model.
-- Direct REST path is READ-ONLY on all candidate tables; object creation is
-- only via the atomic RPCs (section 7); audit events are insert-only via the
-- governed functions and immutable (section 8). This removes the non-atomic
-- direct-INSERT path and denies UPDATE/DELETE/TRUNCATE on the audit log.
-- ─────────────────────────────────────────────────────────────────────────
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    -- Objects: read-only for the direct path; creation only through atomic RPCs.
    execute 'revoke insert, update, delete, truncate on public.yorisou_candidate_organizations, public.yorisou_candidate_offerings, public.yorisou_candidate_submissions from service_role';
    execute 'grant select on public.yorisou_candidate_organizations, public.yorisou_candidate_offerings, public.yorisou_candidate_submissions to service_role';
    -- Audit events: read-only for the direct path; append-only via functions.
    execute 'revoke insert, update, delete, truncate on public.yorisou_candidate_events from service_role';
    execute 'grant select on public.yorisou_candidate_events to service_role';
    -- Governed creation RPCs are executable by the application role.
    execute 'grant execute on function public.create_yorisou_candidate_organization(text,text,text,text,text,text,text,text,text,text) to service_role';
    execute 'grant execute on function public.create_yorisou_candidate_offering(uuid,text,text,text,text,text,text,uuid,text,text) to service_role';
    execute 'grant execute on function public.create_yorisou_candidate_submission(uuid,uuid,text,text,text,text,text,text,text,text,text,text,text,timestamptz,text,text,text) to service_role';
  end if;
end $$;

revoke all on function public.create_yorisou_candidate_organization(text,text,text,text,text,text,text,text,text,text) from public;
revoke all on function public.create_yorisou_candidate_offering(uuid,text,text,text,text,text,text,uuid,text,text) from public;
revoke all on function public.create_yorisou_candidate_submission(uuid,uuid,text,text,text,text,text,text,text,text,text,text,text,timestamptz,text,text,text) from public;
