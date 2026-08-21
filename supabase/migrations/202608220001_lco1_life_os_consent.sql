-- LCO-1 — the Life OS consent record.
--
-- WHAT THIS IS FOR
--
-- Gate 5 requires that before someone first uses durable Life OS capability they are shown a
-- concise explanation, and that their acceptance is explicit, recorded, versioned, owner-scoped and
-- revocable. This table is that record and nothing else.
--
-- WHAT IT DELIBERATELY DOES NOT COLLECT.
--
-- No IP address, no user agent, no device fingerprint, no free text, no timestamp of anything the
-- person did other than answering this one question. Recording consent must not itself become a new
-- collection of personal data — that would be the surveillance version of asking permission. The
-- row is: which account, which version of the wording, when they said yes, and whether they later
-- withdrew.
--
-- WHY A VERSION RATHER THAN A BOOLEAN. The wording is the thing being consented to. If it changes
-- materially, a previous acceptance was to different words and must not silently carry over. A
-- version string makes "they accepted, but not this" representable; a boolean cannot.
--
-- RE-ACCEPTANCE IS ALLOWED, AND THAT IS NOT A LOOPHOLE. Someone who declines, or withdraws, and
-- later chooses again is making a new decision, and the product must be able to record it. What is
-- refused is the reverse: nothing here can accept on a person's behalf.
--
-- PRIVILEGES
--   public/anon/authenticated : NO access
--   service_role              : SELECT only; every write goes through the two RPCs
--
--   The revoke-from-service_role-FIRST ordering is not decoration. On hosted Supabase, default
--   privileges grant service_role ALL on new public tables, so a bare `grant select` leaves the
--   table writable — the defect CNT-1a had to repair after it reached Production. Same table shape,
--   same trap, avoided here up front.
--
-- ROLLBACK CONTRACT
--   1. Restore yorisou_account_deletion_erase_database_unchecked to the body 202608210001 leaves,
--      i.e. this file's plan minus the ['yorisou_life_os_consents','owner_account_id'] entry.
--   2. drop function if exists public.yorisou_life_os_consent_revoke(text);
--      drop function if exists public.yorisou_life_os_consent_record(text, text);
--   3. drop table if exists public.yorisou_life_os_consents;
--   4. Unset YORISOU_OSF1_LIFE_OS_AUTHENTICATED. Without the table the consent gate cannot be
--      satisfied, so the Life OS must be closed in the same change or every account is refused at
--      the first write.

begin;

create table if not exists public.yorisou_life_os_consents (
  owner_account_id text primary key check (length(owner_account_id) between 1 and 200),
  consent_version text not null check (length(consent_version) between 1 and 40),
  accepted_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.yorisou_life_os_consents enable row level security;

comment on table public.yorisou_life_os_consents is
  'LCO-1: which account accepted which version of the Life OS explanation, and whether they withdrew. No other personal data.';

-- RECORD. Idempotent by owner: accepting twice is one row, and accepting after a withdrawal is a
-- new decision that clears it.
create or replace function public.yorisou_life_os_consent_record(
  p_owner_account_id text,
  p_consent_version text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'life_os_consent_owner_required';
  end if;
  if p_consent_version is null or length(p_consent_version) = 0 then
    raise exception 'life_os_consent_version_required';
  end if;

  insert into public.yorisou_life_os_consents (owner_account_id, consent_version)
  values (p_owner_account_id, p_consent_version)
  on conflict (owner_account_id) do update
    set consent_version = excluded.consent_version,
        accepted_at = now(),
        revoked_at = null,
        updated_at = now();
  return true;
end;
$$;

-- WITHDRAW. Owner-scoped and idempotent. Returns how many rows transitioned so a caller can tell
-- "withdrawn just now" from "was already withdrawn" without reading the row back.
create or replace function public.yorisou_life_os_consent_revoke(p_owner_account_id text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare v_count integer;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'life_os_consent_owner_required';
  end if;
  update public.yorisou_life_os_consents
     set revoked_at = now(), updated_at = now()
   where owner_account_id = p_owner_account_id
     and revoked_at is null;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

do $privileges$
declare v_sig text;
begin
  foreach v_sig in array array[
    'public.yorisou_life_os_consent_record(text, text)',
    'public.yorisou_life_os_consent_revoke(text)'
  ] loop
    execute 'revoke all on function ' || v_sig || ' from public';
    if exists (select 1 from pg_roles where rolname='anon') then
      execute 'revoke all on function ' || v_sig || ' from anon'; end if;
    if exists (select 1 from pg_roles where rolname='authenticated') then
      execute 'revoke all on function ' || v_sig || ' from authenticated'; end if;
    if exists (select 1 from pg_roles where rolname='service_role') then
      execute 'grant execute on function ' || v_sig || ' to service_role'; end if;
  end loop;

  execute 'revoke all on table public.yorisou_life_os_consents from public';
  if exists (select 1 from pg_roles where rolname='anon') then
    execute 'revoke all on table public.yorisou_life_os_consents from anon'; end if;
  if exists (select 1 from pg_roles where rolname='authenticated') then
    execute 'revoke all on table public.yorisou_life_os_consents from authenticated'; end if;
  if exists (select 1 from pg_roles where rolname='service_role') then
    -- Revoke BEFORE granting. See the header: a hosted platform has already granted ALL.
    execute 'revoke all on table public.yorisou_life_os_consents from service_role';
    execute 'grant select on table public.yorisou_life_os_consents to service_role';
  end if;
end
$privileges$;


-- ────────────────────────────────────────────────────────────────────────────
-- Account-erasure plan, re-emitted from 202608200001 with the consent record.
--
-- Re-emitted rather than edited: 202608200001 is applied, recorded and checksummed in Production.
-- The ONLY difference is one added plan entry; everything else is that file's body verbatim, which
-- is why it is extracted programmatically rather than retyped.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public.yorisou_account_deletion_erase_database_unchecked(p_owner_account_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_id       uuid;
  v_plan     text[][] := array[
    -- CPR-1 connection.core + comparison.core (202608190001). A pair row belongs to TWO people, so
    -- the table appears TWICE with a different participant column — the same shape
    -- yorisou_experience_blocks already uses. Erasing EITHER participant removes the pair, and
    -- yorisou_pair_comparisons cascades from it (on delete cascade), so no comparison outlives the
    -- consent that created it. Invitations appear twice for the same reason: the inviter and, once
    -- accepted, the acceptor are both personally linked to the row.
    ['yorisou_connection_invitations', 'inviter_account_id'],
    ['yorisou_connection_invitations', 'accepted_by_account_id'],
    ['yorisou_connection_pairs', 'participant_a_account_id'],
    ['yorisou_connection_pairs', 'participant_b_account_id'],
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
    ['yorisou_account_deletion_requests','owner_account_id'],
    -- CNT-1 continuity.core (202608200001) IS DELIBERATELY LAST, AND THE ORDER IS LOAD-BEARING.
    --
    -- Every source write takes its source row first and its projection row second, because the
    -- projection is written by an AFTER trigger on the source. If erasure took projections first it
    -- would walk the opposite way and the two paths would deadlock under concurrency — the same
    -- inversion class the P5 rounds spent four rounds removing. Erasing sources first and the index
    -- last keeps every path pointing the same direction.
    --
    -- Deleting the source rows above already fired the trigger that invalidated these projections,
    -- so by the time this entry runs the moments are unreadable and this only reclaims the rows.
    -- There is no window where a projection outlives its source: the whole function is one
    -- transaction, so no other session observes any intermediate state.
    -- LCO-1 (202608220001): which version of the Life OS explanation this person accepted.
    -- Owner-linked, so it dies with the account. Placed before the continuity index so the
    -- index stays LAST — that ordering is what keeps every path locking source-then-index.
    ['yorisou_life_os_consents', 'owner_account_id'],
    ['yorisou_continuity_projections', 'owner_account_id']
  ];
  v_src        record;
  v_invite_ids uuid[];
  v_pair_ids   uuid[];
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

  -- 5.0a ACCOUNT ERASURE JOINS THE SOURCE LIFECYCLE LOCK PROTOCOL.
  --
  -- This is the last destructive path that stood outside the protocol, and it deadlocked because
  -- of it. Canonical result erasure UPDATEs the result row and holds that lock for the rest of the
  -- transaction, while the declarative plan deletes invitations and pairs much later. A concurrent
  -- single-source erasure walks the opposite way — invitation, pair, comparison, then the result:
  --
  --     account holds RESULT row,          waits for invitation/pair
  --     source  holds invitation/pair,     waits for RESULT row        => deadlock detected
  --
  -- One pending invitation is enough to build that cycle; no pair is required.
  --
  -- So every live assessment source this account owns is locked HERE, in sorted order, before any
  -- destructive work begins. Sorted because an account may own several results and two erasures
  -- taking overlapping sets in different orders would deadlock against each other. Taking ALL of
  -- them before touching ANY derivative is what makes the wait-for graph acyclic: a transaction
  -- that holds a pair row already holds every source lock it will ever need.
  --
  -- The locks are transaction-scoped and released on commit.
  for v_src in
    select r.id::text as ref
      from public.yorisou_assessment_results r
     where r.owner_account_id = p_owner_account_id
       and r.deleted_at is null
     order by r.id::text
  loop
    perform public.yorisou_share_source_lock('assessment_result', v_src.ref);
  end loop;

  -- 5.0b THE P5 DERIVATIVES, BEFORE the canonical result erase — same direction the single-source
  -- seam uses: INVITATION → PAIR → COMPARISON, then the result itself.
  --
  -- The declarative plan at 5.4 still names these families, and deliberately so: it is the
  -- contract the erasure-coverage guard reads, and leaving it is what keeps "every owner-linked
  -- table is registered" true. By the time it runs these deletes are no-ops.
  if to_regclass('public.yorisou_connection_invitations') is not null then
    -- DETERMINISTIC, like the pair rows. An ACCEPTED invitation names two people, so two accounts
    -- connected through several accepted invitations target the SAME rows — and their source locks
    -- do not serialize them, because they own different assessment sources. An unordered bulk
    -- DELETE leaves the row order to the planner, which is not a guarantee; one lucky concurrent
    -- run proves nothing.
    select array_agg(id order by id) into v_invite_ids
      from (
        select id from public.yorisou_connection_invitations
         where inviter_account_id = p_owner_account_id
            or accepted_by_account_id = p_owner_account_id
         order by id
         for update
      ) locked;
    if v_invite_ids is not null and array_length(v_invite_ids, 1) > 0 then
      delete from public.yorisou_connection_invitations where id = any (v_invite_ids);
    end if;
  end if;

  if to_regclass('public.yorisou_connection_pairs') is not null then
    -- Pair rows can be shared with an account that is ALSO being deleted, so they are locked in
    -- deterministic id order rather than in whatever order the planner returns them.
    select array_agg(id order by id) into v_pair_ids
      from (
        select id from public.yorisou_connection_pairs
         where participant_a_account_id = p_owner_account_id
            or participant_b_account_id = p_owner_account_id
         order by id
         for update
      ) locked;
    if v_pair_ids is not null and array_length(v_pair_ids, 1) > 0 then
      -- Comparisons cascade from the pair rows (on delete cascade), so deleting the pairs removes
      -- them; PAIR still precedes COMPARISON, exactly as everywhere else.
      delete from public.yorisou_connection_pairs where id = any (v_pair_ids);
    end if;
  end if;

  -- CONTINUITY PROJECTIONS ARE NOT SWEPT HERE ANY MORE. An earlier revision invalidated them
  -- before anything destructive, reasoning that a later failure would still leave nothing readable.
  -- That reasoning was wrong: this function is a single transaction, so a later failure rolls the
  -- invalidation back with everything else and the pre-sweep protected nothing. What it did do was
  -- take projection locks before source locks, inverting the order every ordinary write uses. It is
  -- gone; the plan's final entry erases the index after the sources it points at.

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
