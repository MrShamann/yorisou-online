-- CNT-1 — continuity.core TimelineProjection (ARCH-P6).
--
-- WHAT THIS ADDS
--   TABLE      yorisou_continuity_projections
--   FUNCTIONS  yorisou_continuity_project            (upsert, terminal-invalidation-safe)
--              yorisou_continuity_invalidate_source  (owner-scoped, idempotent, terminal)
--              yorisou_continuity_invalidate_owner   (account erasure sweep)
--   TRIGGERS   yorisou_continuity_sync on the four source tables — transaction-owned propagation
--   BACKFILL   deterministic, idempotent population from the four live source families
--   PLAN       the account-erasure plan re-emitted with the new family
--
-- WHAT IT REPLACES
--   yorisou_account_deletion_erase_database_unchecked — re-emitted from 202608190001 with one
--   added plan entry. No other pre-existing body is touched.
--
-- THE PROJECTION IS AN INDEX, NOT A COPY.
--
-- The product timeline renders whole source records — situations, reflection bodies, goal
-- descriptions. A projection that stored display text would have to copy private payload to keep
-- rendering identical, and copying private payload into a derived table is exactly what the
-- projection rule forbids. So this table stores WHICH source, WHEN, and WHICH sub-view, and the
-- reader hydrates records from their own stores by id. There is no label column, no body column,
-- and no place to put one.
--
-- TERMINAL INVALIDATION IS A DATABASE FACT.
--
-- The whole point of P6 is that a projection cannot outlive its source. If invalidation were a
-- boolean an ordinary upsert could flip back, and a delayed writer would resurrect a deleted
-- moment. So `invalidated_at` is write-once: the upsert RPC refuses to clear it and refuses to
-- touch an invalidated row at all. A stale writer is a no-op, not a resurrection.
--
-- GLOBAL LOCK ORDER
--   Derived from the merged P4/P5/POR-1 bodies, projections are inserted LAST among derivatives:
--
--     POR-1 gate -> assessment SOURCE LOCKS (sorted) -> INVITATION rows -> PAIR rows
--       -> COMPARISON rows -> share seam -> canonical source erasure -> CONTINUITY PROJECTION rows
--
--   PROJECTIONS MOVED TO LAST WHEN PROPAGATION BECAME A TRIGGER, and that is not cosmetic. An
--   ordinary write now takes its source row and then, inside the same transaction, its projection
--   row. Erasure must walk the same way or the two paths form a cycle: writer holds source and
--   wants projection while erasure holds projection and wants source. Sources first, index last,
--   everywhere. Projections remain a leaf — nothing waits on them — and they are keyed by
--   (owner, family, ref), so two owners never contend.
--
-- EXISTING DATA
--   A deterministic backfill runs at the end of this migration. It reads only id/owner/created_at
--   (plus reflection mode) from the four live sources, skips rows the timeline already excludes
--   (deleted/withdrawn experiences), and is idempotent via ON CONFLICT DO NOTHING. Re-running the
--   migration cannot duplicate a moment and cannot revive an invalidated one.
--
-- PRIVILEGES
--   public/anon/authenticated : NO access
--   service_role              : bounded SELECT + EXECUTE on the three RPCs
--
-- ROLLBACK CONTRACT
--   1. RESTORE yorisou_account_deletion_erase_database_unchecked to the body the lineage defined
--      BEFORE CNT-1 — that is, the body 202608190001 establishes. CNT-1 differs from it by exactly
--      one added plan entry, ['yorisou_continuity_projections','owner_account_id'], which is last;
--      there is no other difference to undo.
--
--      Re-applying the 202608190001 FILE does restore that body, and has no other effect. But it is
--      NOT a complete rollback on its own, because it leaves every CNT-1 object standing:
--        - the projection table   public.yorisou_continuity_projections
--        - the three RPCs         yorisou_continuity_project / _invalidate_source / _invalidate_owner
--        - the four sync triggers yorisou_continuity_sync_trg on the source tables
--      A complete rollback is therefore two separate acts: restore the function body (this step),
--      and remove the CNT-1 objects (steps 2 and 3 below).
--
--      Rolling CNT-1 back does NOT roll back P5. Verified: after the full sequence the connection
--      and comparison objects are all still present, and account erasure continues to work.
--   2. drop trigger if exists yorisou_continuity_sync_trg on public.yorisou_current_state_records;
--      ... and on yorisou_goals, yorisou_life_reflections, yorisou_experience_cards;
--      drop function if exists public.yorisou_continuity_sync();
--      drop function if exists public.yorisou_continuity_invalidate_owner(text);
--      drop function if exists public.yorisou_continuity_invalidate_source(text, text, text);
--      drop function if exists public.yorisou_continuity_project(text, text, text, timestamptz, text);
--   3. drop table if exists public.yorisou_continuity_projections;
--      This destroys the index only; no source record is affected, and the timeline reader must be
--      reverted to direct aggregation in the same change or it will read an absent table.
--   4. Leave YORISOU_CONTINUITY_SCHEMA_READY unset.
--   Never executed as part of shipping.

begin;

create table if not exists public.yorisou_continuity_projections (
  id uuid primary key default gen_random_uuid(),
  owner_account_id text not null check (length(owner_account_id) between 1 and 200),
  source_family text not null
    check (source_family in ('current_state', 'goal', 'reflection', 'experience')),
  -- COLLATE "C" IS THE SORT KEY, NOT A STYLE CHOICE. source_ref holds the source's uuid as text and
  -- is the timeline's tie-break. The legacy reader broke ties on the uuid column itself, so the two
  -- orders must agree exactly or a cursor minted by one skips or repeats rows for the other. Text
  -- and uuid ordering happen to agree under en_US.UTF-8 today, but that is a property of the
  -- deployment's collation rather than of the data. Pinned to C, the comparison is byte order,
  -- which matches uuid byte order for canonical lowercase hex on every database this ever runs on.
  source_ref text collate "C" not null check (length(source_ref) between 1 and 200),
  occurred_at timestamptz not null,
  -- Sub-view within a family. Only `reflection` uses it today (light / postmortem), because one
  -- source table drives two consumer filters and the index must answer that without opening rows.
  variant text check (variant is null or length(variant) between 1 and 40),
  invalidated_at timestamptz,
  created_at timestamptz not null default now(),
  constraint yorisou_continuity_projections_identity
    unique (owner_account_id, source_family, source_ref)
);

-- Newest-first paging, live rows only. The (occurred_at, source_ref) pair is the sort key the
-- timeline already uses, so the index matches the read exactly.
create index if not exists yorisou_continuity_projections_live_page
  on public.yorisou_continuity_projections (owner_account_id, occurred_at desc, source_ref desc)
  where invalidated_at is null;

alter table public.yorisou_continuity_projections enable row level security;

-- PROJECT. Idempotent by identity. An invalidated row is LEFT ALONE — this is the anti-resurrection
-- rule, and it lives here rather than in TypeScript because a delayed writer is exactly the caller
-- that will not have run the TypeScript.
create or replace function public.yorisou_continuity_project(
  p_owner_account_id text,
  p_source_family text,
  p_source_ref text,
  p_occurred_at timestamptz,
  p_variant text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare v_invalidated timestamptz; v_found boolean := false;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'continuity_owner_required';
  end if;
  if p_source_ref is null or length(p_source_ref) = 0 then
    raise exception 'continuity_source_ref_required';
  end if;

  select invalidated_at into v_invalidated
    from public.yorisou_continuity_projections
   where owner_account_id = p_owner_account_id
     and source_family = p_source_family
     and source_ref = p_source_ref
   for update;
  v_found := found;

  if v_found and v_invalidated is not null then
    -- Terminal. A stale or replayed writer changes nothing.
    return false;
  end if;

  if v_found then
    update public.yorisou_continuity_projections
       set occurred_at = p_occurred_at, variant = p_variant
     where owner_account_id = p_owner_account_id
       and source_family = p_source_family
       and source_ref = p_source_ref;
    return true;
  end if;

  insert into public.yorisou_continuity_projections
    (owner_account_id, source_family, source_ref, occurred_at, variant)
  values (p_owner_account_id, p_source_family, p_source_ref, p_occurred_at, p_variant)
  on conflict (owner_account_id, source_family, source_ref) do nothing;
  return true;
end;
$$;

-- INVALIDATE ONE SOURCE. Owner-scoped: knowing another person's source reference must never blank
-- their timeline — the ARCH-P4 revoke-by-source lesson, applied up front. Idempotent and terminal.
create or replace function public.yorisou_continuity_invalidate_source(
  p_owner_account_id text,
  p_source_family text,
  p_source_ref text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare v_n integer;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'continuity_owner_required';
  end if;
  update public.yorisou_continuity_projections
     set invalidated_at = now()
   where owner_account_id = p_owner_account_id
     and source_family = p_source_family
     and source_ref = p_source_ref
     and invalidated_at is null;
  get diagnostics v_n = row_count;
  return v_n;
end;
$$;

-- ACCOUNT SWEEP. Used by the erasure body before the declarative plan removes the rows outright;
-- keeping it explicit means a partial failure still leaves nothing readable.
create or replace function public.yorisou_continuity_invalidate_owner(p_owner_account_id text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare v_n integer;
begin
  update public.yorisou_continuity_projections
     set invalidated_at = now()
   where owner_account_id = p_owner_account_id and invalidated_at is null;
  get diagnostics v_n = row_count;
  return v_n;
end;
$$;

do $fnroles$
declare v_sig text;
begin
  foreach v_sig in array array[
    'public.yorisou_continuity_project(text, text, text, timestamptz, text)',
    'public.yorisou_continuity_invalidate_source(text, text, text)',
    'public.yorisou_continuity_invalidate_owner(text)'
  ] loop
    execute 'revoke all on function ' || v_sig || ' from public';
    if exists (select 1 from pg_roles where rolname='anon') then execute 'revoke all on function ' || v_sig || ' from anon'; end if;
    if exists (select 1 from pg_roles where rolname='authenticated') then execute 'revoke all on function ' || v_sig || ' from authenticated'; end if;
    if exists (select 1 from pg_roles where rolname='service_role') then execute 'grant execute on function ' || v_sig || ' to service_role'; end if;
  end loop;
  execute 'revoke all on table public.yorisou_continuity_projections from public';
  if exists (select 1 from pg_roles where rolname='anon') then execute 'revoke all on table public.yorisou_continuity_projections from anon'; end if;
  if exists (select 1 from pg_roles where rolname='authenticated') then execute 'revoke all on table public.yorisou_continuity_projections from authenticated'; end if;
  if exists (select 1 from pg_roles where rolname='service_role') then execute 'grant select on table public.yorisou_continuity_projections to service_role'; end if;
end
$fnroles$;

-- ─────────────────────────────────────────────────────────────────────────────
-- BACKFILL — deterministic and idempotent.
-- Reads ONLY identity/time/mode. No body, no situation, no reflection text.
-- ─────────────────────────────────────────────────────────────────────────────
do $backfill$
begin
  if to_regclass('public.yorisou_current_state_records') is not null then
    insert into public.yorisou_continuity_projections (owner_account_id, source_family, source_ref, occurred_at, variant)
    select r.owner_account_id, 'current_state', r.id::text, r.created_at, null
      from public.yorisou_current_state_records r
     where r.owner_account_id is not null
    on conflict (owner_account_id, source_family, source_ref) do nothing;
  end if;

  if to_regclass('public.yorisou_goals') is not null then
    insert into public.yorisou_continuity_projections (owner_account_id, source_family, source_ref, occurred_at, variant)
    select g.owner_account_id, 'goal', g.id::text, g.created_at, null
      from public.yorisou_goals g
     where g.owner_account_id is not null
    on conflict (owner_account_id, source_family, source_ref) do nothing;
  end if;

  if to_regclass('public.yorisou_life_reflections') is not null then
    insert into public.yorisou_continuity_projections (owner_account_id, source_family, source_ref, occurred_at, variant)
    select f.owner_account_id, 'reflection', f.id::text, f.created_at, f.mode
      from public.yorisou_life_reflections f
     where f.owner_account_id is not null
    on conflict (owner_account_id, source_family, source_ref) do nothing;
  end if;

  -- The timeline already excludes deleted/withdrawn experience cards; the backfill must not
  -- resurrect them into the index.
  if to_regclass('public.yorisou_experience_cards') is not null then
    insert into public.yorisou_continuity_projections (owner_account_id, source_family, source_ref, occurred_at, variant)
    select e.owner_account_id, 'experience', e.id::text, e.created_at, null
      from public.yorisou_experience_cards e
     where e.owner_account_id is not null
       and e.deleted_at is null
       and e.withdrawn_at is null
    on conflict (owner_account_id, source_family, source_ref) do nothing;
  end if;
end
$backfill$;

-- ────────────────────────────────────────────────────────────────────────────
-- PROPAGATION — the running product produces projections, and cannot opt out.
-- ────────────────────────────────────────────────────────────────────────────
--
-- WHY A TRIGGER RATHER THAN A CALL IN THE STORE.
--
-- Propagation had to be atomic with the source write. The repository writes every source through a
-- SECURITY DEFINER RPC over PostgREST, so a store-level "create, then project" would be two HTTP
-- transactions: a crash between them leaves a source with no moment, and no amount of application
-- retry makes that atomic — it only makes the divergence window smaller. An AFTER trigger runs
-- inside the source's own transaction. If the source commits, the moment exists; if it rolls back,
-- neither does. That is the actual guarantee, not an approximation of one.
--
-- It also closes the bypass. Any writer of these four tables projects — the OSF-1 RPCs, the
-- experience-card PostgREST writes, a migration, a future path nobody has written yet. A store-level
-- hook would only cover the callers that remembered to use it.
--
-- FIELDS ARE READ THROUGH to_jsonb RATHER THAN new.<column>. The four tables do not share a shape:
-- only reflections have `mode`, only experience cards have `deleted_at`/`withdrawn_at`. One generic
-- function over a jsonb view of the row avoids four near-identical bodies drifting apart.
create or replace function public.yorisou_continuity_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_family  text;
  v_row     jsonb;
  v_owner   text;
  v_ref     text;
  v_variant text;
begin
  case tg_table_name
    when 'yorisou_current_state_records' then v_family := 'current_state';
    when 'yorisou_goals'                 then v_family := 'goal';
    when 'yorisou_life_reflections'      then v_family := 'reflection';
    when 'yorisou_experience_cards'      then v_family := 'experience';
    else return null;
  end case;

  v_row   := to_jsonb(case when tg_op = 'DELETE' then old else new end);
  v_owner := v_row->>'owner_account_id';
  v_ref   := v_row->>'id';
  if v_owner is null or v_ref is null then return null; end if;

  -- A destroyed source takes its moment with it. Terminal, because no path in this product restores
  -- one: `deleted_at` and `withdrawn_at` are only ever set, never cleared, and moderation "restore"
  -- returns moderation_status alone. If that ever changes, terminal invalidation becomes the wrong
  -- model for the reversible path and this branch has to change with it — which is why a test
  -- asserts the absence of a restore path rather than leaving the assumption implicit.
  if tg_op = 'DELETE'
     or (v_row ? 'deleted_at'   and v_row->>'deleted_at'   is not null)
     or (v_row ? 'withdrawn_at' and v_row->>'withdrawn_at' is not null) then
    perform public.yorisou_continuity_invalidate_source(v_owner, v_family, v_ref);
    return null;
  end if;

  v_variant := v_row->>'mode';
  perform public.yorisou_continuity_project(
    v_owner, v_family, v_ref, (v_row->>'created_at')::timestamptz, v_variant);
  return null;
end;
$$;

revoke all on function public.yorisou_continuity_sync() from public;

do $wire$
declare v_table text;
begin
  foreach v_table in array array[
    'yorisou_current_state_records',
    'yorisou_goals',
    'yorisou_life_reflections',
    'yorisou_experience_cards'
  ] loop
    if to_regclass('public.' || v_table) is not null then
      execute format('drop trigger if exists yorisou_continuity_sync_trg on public.%I', v_table);
      execute format(
        'create trigger yorisou_continuity_sync_trg after insert or update or delete on public.%I '
        'for each row execute function public.yorisou_continuity_sync()', v_table);
    end if;
  end loop;
end
$wire$;

-- ────────────────────────────────────────────────────────────────────────────
-- Account-erasure plan, re-emitted from 202608190001 with the continuity family.
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
