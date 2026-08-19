-- SHR-1 — sharing.core ShareObjects (formal Imairo Result Card sharing).
--
-- THREE tables + FOUR RPCs + the account-erasure plan re-emitted with the two new families.
-- Additive only: no existing table, row, or RPC is modified.
--
-- THE INVARIANTS, AND WHY THEY LIVE IN SQL RATHER THAN IN APPLICATION ORDER.
--
-- A first version of this migration enforced the sharing lifecycle with application-level ordering
-- and a pre-INSERT existence check. Controller review showed that is not enforcement: two
-- concurrent transactions both pass an existence check, and a revoke that commits before an
-- unrelated erase leaves a window in which a fresh link is published against a source that is
-- about to disappear. Ordering in one process is not a concurrency guarantee, so each invariant
-- below is now a database fact.
--
--   1. ONE ACTIVE LINK per (owner, source_family, source_ref, template_ref) — the partial unique
--      index deliberately EXCLUDES payload_digest. Including it let two different-digest publishes
--      both insert. Identical-digest retries stay idempotent by returning the existing row.
--   2. PUBLISH AND SOURCE ERASURE ARE SERIALIZED by a transaction-level advisory lock keyed on
--      source_family + source_ref. Both paths take the same lock, so they cannot interleave.
--   3. AN ERASED SOURCE CAN NEVER BE PUBLISHED AGAIN. The erasure transaction writes a tombstone
--      that publish checks while holding the lock — this is what closes the race rather than
--      narrowing it. sharing.core learns only "this source ref is erased"; it never reads
--      assessment content.
--   4. OWNER SCOPING IS IN THE MUTATION BOUNDARY. Source revocation takes an owner and filters on
--      it, so knowing another person's private result id cannot darken their public link.
--   5. IMMUTABLE PAYLOAD — no UPDATE path to public_payload exists; revocation is a timestamp.
--   6. PUBLISH/REVOKE AUDIT IS TRANSACTIONAL and append-only, carrying no owner, source or payload.
--
-- Privilege matrix (repository discipline, unchanged):
--   public/anon/authenticated : NO access
--   service_role              : bounded SELECT only
--   mutation                  : SECURITY DEFINER RPCs exclusively
--
-- ROLLBACK:
--   drop function if exists public.yorisou_assessment_result_erase_with_shares(uuid, text);
--   drop function if exists public.yorisou_share_objects_revoke_by_source(text, text, text);
--   drop function if exists public.yorisou_share_object_revoke(text, uuid);
--   drop function if exists public.yorisou_share_object_publish(text, text, text, text, text, text, text, jsonb, text);
--   drop table if exists public.yorisou_share_source_erasures;
--   drop table if exists public.yorisou_share_audit_events;
--   drop table if exists public.yorisou_share_objects;
--   -- then re-apply 202608180001's erasure block verbatim to restore the previous plan.

begin;

create extension if not exists pgcrypto;

create table if not exists public.yorisou_share_objects (
  id uuid primary key default gen_random_uuid(),
  owner_account_id text not null
    constraint yorisou_share_objects_owner_chk check (length(owner_account_id) between 1 and 200),
  public_id uuid not null default gen_random_uuid(),
  card_family text not null
    constraint yorisou_share_objects_family_chk check (length(card_family) between 1 and 100),
  source_family text not null
    constraint yorisou_share_objects_source_family_chk check (length(source_family) between 1 and 100),
  source_ref text not null
    constraint yorisou_share_objects_source_ref_chk check (length(source_ref) between 1 and 200),
  template_ref text not null
    constraint yorisou_share_objects_template_chk check (length(template_ref) between 1 and 120),
  template_version text not null
    constraint yorisou_share_objects_template_version_chk check (length(template_version) between 1 and 40),
  payload_version text not null
    constraint yorisou_share_objects_payload_version_chk check (length(payload_version) between 1 and 60),
  public_payload jsonb not null,
  payload_digest text not null
    constraint yorisou_share_objects_digest_chk check (payload_digest ~ '^[0-9a-f]{64}$'),
  published_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint yorisou_share_objects_public_id_unique unique (public_id)
);

-- INVARIANT 1. Digest is deliberately NOT part of the key: one active link per owner/source/
-- template, whatever the content.
create unique index if not exists yorisou_share_objects_active_identity
  on public.yorisou_share_objects (owner_account_id, source_family, source_ref, template_ref)
  where revoked_at is null;

create index if not exists yorisou_share_objects_source
  on public.yorisou_share_objects (source_family, source_ref);

alter table public.yorisou_share_objects enable row level security;

-- INVARIANT 3. The tombstone. Owner-linked (so it joins the erasure plan) and content-free beyond
-- the opaque source reference it retires.
create table if not exists public.yorisou_share_source_erasures (
  id uuid primary key default gen_random_uuid(),
  owner_account_id text not null
    constraint yorisou_share_source_erasures_owner_chk check (length(owner_account_id) between 1 and 200),
  source_family text not null,
  source_ref text not null,
  erased_at timestamptz not null default now(),
  constraint yorisou_share_source_erasures_identity unique (source_family, source_ref)
);

alter table public.yorisou_share_source_erasures enable row level security;

create table if not exists public.yorisou_share_audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_fingerprint text not null
    constraint yorisou_share_audit_actor_chk check (actor_fingerprint ~ '^[0-9a-f]{64}$'),
  event_type text not null
    constraint yorisou_share_audit_type_chk check (event_type in ('published', 'revoked')),
  share_ref uuid not null,
  occurred_at timestamptz not null default now()
);

alter table public.yorisou_share_audit_events enable row level security;

create or replace function public.yorisou_share_audit_block_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'share_audit_append_only';
end;
$$;

drop trigger if exists yorisou_share_audit_events_no_mutate on public.yorisou_share_audit_events;
create trigger yorisou_share_audit_events_no_mutate
  before update or delete on public.yorisou_share_audit_events
  for each row execute function public.yorisou_share_audit_block_mutation();

-- The one lock every source-scoped mutation takes. Keyed on the source identity so unrelated
-- sources never contend.
create or replace function public.yorisou_share_source_lock(p_source_family text, p_source_ref text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(p_source_family || ':' || p_source_ref, 0));
end;
$$;

do $roles$
begin
  execute 'revoke all on table public.yorisou_share_objects, public.yorisou_share_audit_events, public.yorisou_share_source_erasures from public';
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table public.yorisou_share_objects, public.yorisou_share_audit_events, public.yorisou_share_source_erasures from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table public.yorisou_share_objects, public.yorisou_share_audit_events, public.yorisou_share_source_erasures from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'revoke all on table public.yorisou_share_objects, public.yorisou_share_audit_events, public.yorisou_share_source_erasures from service_role';
    execute 'grant select on table public.yorisou_share_objects to service_role';
    execute 'grant select on table public.yorisou_share_audit_events to service_role';
    execute 'grant select on table public.yorisou_share_source_erasures to service_role';
  end if;
end
$roles$;

-- PUBLISH. Takes the source lock FIRST, so it cannot interleave with source erasure or with
-- another publish for the same source. Refuses an erased source, refuses a different-digest
-- publish while a link is active, and returns the canonical row for an identical retry.
create or replace function public.yorisou_share_object_publish(
  p_owner_account_id text,
  p_card_family text,
  p_source_family text,
  p_source_ref text,
  p_template_ref text,
  p_template_version text,
  p_payload_version text,
  p_public_payload jsonb,
  p_payload_digest text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.yorisou_share_objects%rowtype;
  v_reused boolean := false;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'share_invalid_owner';
  end if;
  if p_public_payload is null or jsonb_typeof(p_public_payload) <> 'object' then
    raise exception 'share_invalid_payload';
  end if;

  perform public.yorisou_share_source_lock(p_source_family, p_source_ref);

  if exists (
    select 1 from public.yorisou_share_source_erasures
     where source_family = p_source_family and source_ref = p_source_ref
  ) then
    raise exception 'share_source_erased';
  end if;

  select * into v_row
    from public.yorisou_share_objects
   where owner_account_id = p_owner_account_id
     and source_family = p_source_family
     and source_ref = p_source_ref
     and template_ref = p_template_ref
     and revoked_at is null
   limit 1;

  if found then
    if v_row.payload_digest = p_payload_digest then
      v_reused := true;
    else
      raise exception 'share_active_exists';
    end if;
  else
    insert into public.yorisou_share_objects
      (owner_account_id, card_family, source_family, source_ref, template_ref, template_version,
       payload_version, public_payload, payload_digest)
    values
      (p_owner_account_id, p_card_family, p_source_family, p_source_ref, p_template_ref,
       p_template_version, p_payload_version, p_public_payload, p_payload_digest)
    returning * into v_row;

    insert into public.yorisou_share_audit_events (actor_fingerprint, event_type, share_ref)
    values (encode(sha256(convert_to(p_owner_account_id, 'utf8')), 'hex'), 'published', v_row.id);
  end if;

  return jsonb_build_object(
    'public_id', v_row.public_id,
    'card_family', v_row.card_family,
    'template_version', v_row.template_version,
    'published_at', v_row.published_at,
    'reused', v_reused
  );
end;
$$;

create or replace function public.yorisou_share_object_revoke(
  p_owner_account_id text,
  p_public_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.yorisou_share_objects%rowtype;
begin
  select * into v_row
    from public.yorisou_share_objects
   where public_id = p_public_id
     and owner_account_id = p_owner_account_id
     and revoked_at is null
   limit 1
   for update;

  if not found then
    return false;
  end if;

  update public.yorisou_share_objects set revoked_at = now() where id = v_row.id;

  insert into public.yorisou_share_audit_events (actor_fingerprint, event_type, share_ref)
  values (encode(sha256(convert_to(p_owner_account_id, 'utf8')), 'hex'), 'revoked', v_row.id);

  return true;
end;
$$;

-- INVARIANT 4. Source revocation is OWNER-SCOPED at the mutation boundary. Without the owner
-- predicate here, knowing another person's private source id was enough to darken their link.
create or replace function public.yorisou_share_objects_revoke_by_source(
  p_owner_account_id text,
  p_source_family text,
  p_source_ref text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  v_row record;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'share_invalid_owner';
  end if;

  perform public.yorisou_share_source_lock(p_source_family, p_source_ref);

  for v_row in
    select id from public.yorisou_share_objects
     where owner_account_id = p_owner_account_id
       and source_family = p_source_family
       and source_ref = p_source_ref
       and revoked_at is null
     for update
  loop
    update public.yorisou_share_objects set revoked_at = now() where id = v_row.id;
    insert into public.yorisou_share_audit_events (actor_fingerprint, event_type, share_ref)
    values (encode(sha256(convert_to(p_owner_account_id, 'utf8')), 'hex'), 'revoked', v_row.id);
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

-- INVARIANT 2 + 3. THE authoritative source-erasure seam for a persisted assessment result:
-- owner verification, derivative revocation, tombstone and the canonical erasure all happen in ONE
-- transaction while holding the source lock. Publish cannot slip in between, and if the canonical
-- erasure does not succeed the whole transaction rolls back — no half-erased source, no darkened
-- link for a result that still exists.
--
-- It calls the EXISTING canonical erasure function; it does not reimplement or alter assessment
-- semantics, scoring, taxonomy or interpretation.
create or replace function public.yorisou_assessment_result_erase_with_shares(
  p_result_row_id uuid,
  p_owner_account_id text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_source_family constant text := 'assessment_result';
  v_source_ref text := p_result_row_id::text;
  v_erased boolean;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'share_invalid_owner';
  end if;

  perform public.yorisou_share_source_lock(v_source_family, v_source_ref);

  -- Authorization BEFORE any side effect: a caller who does not own this live result changes
  -- nothing at all — not their shares, not anyone else's.
  perform 1 from public.yorisou_assessment_results
   where id = p_result_row_id
     and owner_account_id = p_owner_account_id
     and deleted_at is null;
  if not found then
    return false;
  end if;

  perform public.yorisou_share_objects_revoke_by_source(p_owner_account_id, v_source_family, v_source_ref);

  insert into public.yorisou_share_source_erasures (owner_account_id, source_family, source_ref)
  values (p_owner_account_id, v_source_family, v_source_ref)
  on conflict (source_family, source_ref) do nothing;

  v_erased := public.yorisou_assessment_result_erase(p_result_row_id, p_owner_account_id);
  if not v_erased then
    -- Roll back the revocations and the tombstone: the source still exists, so its links must too.
    raise exception 'share_source_erasure_failed';
  end if;

  return true;
end;
$$;

do $fnroles$
declare
  v_sig text;
begin
  foreach v_sig in array array[
    'public.yorisou_share_object_publish(text, text, text, text, text, text, text, jsonb, text)',
    'public.yorisou_share_object_revoke(text, uuid)',
    'public.yorisou_share_objects_revoke_by_source(text, text, text)',
    'public.yorisou_assessment_result_erase_with_shares(uuid, text)',
    'public.yorisou_share_source_lock(text, text)'
  ] loop
    execute 'revoke all on function ' || v_sig || ' from public';
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute 'revoke all on function ' || v_sig || ' from anon';
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute 'revoke all on function ' || v_sig || ' from authenticated';
    end if;
    if exists (select 1 from pg_roles where rolname = 'service_role') then
      execute 'grant execute on function ' || v_sig || ' to service_role';
    end if;
  end loop;
end
$fnroles$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Account-erasure plan, re-emitted VERBATIM from 202608180001 with the two new families.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.yorisou_account_deletion_erase_database_unchecked(p_owner_account_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_id       uuid;
  v_plan     text[][] := array[
    -- SHR-1 sharing.core (202608180002): published derivatives and the source-erasure
    -- tombstones are both owner-linked; they die with the account, so every public deep link
    -- goes dark and no stale tombstone keeps a private source reference alive.
    ['yorisou_share_objects', 'owner_account_id'],
    ['yorisou_share_source_erasures', 'owner_account_id'],
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
