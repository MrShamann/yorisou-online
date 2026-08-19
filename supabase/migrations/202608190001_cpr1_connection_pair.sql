-- CPR-1 — connection.core + comparison.core (Imairo pair 「ふたりのImairo」).
--
-- THREE tables + ONE product-specific source adapter + SIX RPCs + the account-erasure plan
-- re-emitted with the new families. Additive only: no existing table, row, RPC or migration is
-- modified. In particular the merged ARCH-P4 sharing lifecycle is REUSED, not rewritten.
--
-- THE INVARIANTS, AND WHY THEY LIVE IN SQL.
--
-- ARCH-P4 review established the rule this migration is written to: application-level ordering is
-- not a concurrency guarantee, and an authorization check that lives only in the process can be
-- raced. P5 creates a SECOND derivative of an assessment result — a pair comparison — so every
-- lifecycle fact below is a database fact.
--
--   1. ONE OPEN INVITATION per (inviter, source). A partial unique index, so a retried create
--      returns the existing link instead of scattering live invitations a person must remember to
--      cancel.
--   2. ONE PAIR PER INVITATION. `pair_id` on the invitation is unique, and acceptance is
--      serialized by a lock on the invitation row. Two concurrent acceptors cannot both win.
--   3. ACCEPTANCE AND SOURCE ERASURE ARE SERIALIZED by the SAME transaction-level advisory lock
--      ARCH-P4 introduced (`yorisou_share_source_lock`). Acceptance touches two sources, so it
--      takes BOTH locks IN SORTED ORDER — two simultaneous acceptances involving the same pair of
--      sources in opposite directions would otherwise deadlock.
--   4. AN ERASED SOURCE CAN NEVER JOIN A PAIR. Acceptance checks the ARCH-P4 erasure tombstone
--      while holding the lock. This closes the race rather than narrowing it.
--   5. AUTHORIZATION IS IN THE MUTATION BOUNDARY. Create verifies the inviter owns a live source;
--      accept verifies the acceptor owns the supplied live source and is not the inviter; cancel is
--      inviter-only; dissolve is participant-only. A guessed id grants nothing anywhere.
--   6. CONSENT IS NOT ACCESS. No function here returns one participant's account id, source
--      reference, answers, state, reflection or memory to the other. The comparison stores only the
--      already-public result code each side contributed.
--   7. AUDIT IS TRANSACTIONAL, append-only, and content-free.
--
-- Privilege matrix (repository discipline, unchanged):
--   public/anon/authenticated : NO access
--   service_role              : bounded SELECT only
--   mutation                  : SECURITY DEFINER RPCs exclusively
--
-- ROLLBACK:
--   drop function if exists public.yorisou_assessment_result_erase_with_derivatives(uuid, text);
--   drop function if exists public.yorisou_connection_pair_dissolve(text, uuid);
--   drop function if exists public.yorisou_connection_invite_accept(uuid, text, text);
--   drop function if exists public.yorisou_connection_invite_cancel(text, uuid);
--   drop function if exists public.yorisou_connection_invite_create(text, text, text);
--   drop function if exists public.yorisou_imairo_pair_live_source(text, text);
--   drop table if exists public.yorisou_connection_audit_events;
--   drop table if exists public.yorisou_pair_comparisons;
--   drop table if exists public.yorisou_connection_invitations;
--   drop table if exists public.yorisou_connection_pairs;
--   -- then re-apply 202608180002's erasure block verbatim to restore the previous plan.

begin;

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────────
-- connection.core owned data
-- ─────────────────────────────────────────────────────────────────────────────

-- The consent context. Two participants, each with the reference THEY granted. There is
-- deliberately no "owner" of a pair: both people are equals, and either may end it.
create table if not exists public.yorisou_connection_pairs (
  id uuid primary key default gen_random_uuid(),
  pair_public_id uuid not null unique default gen_random_uuid(),
  reference_family text not null
    check (reference_family = 'assessment_result'),
  participant_a_account_id text not null
    check (length(participant_a_account_id) between 1 and 200),
  participant_a_reference_ref text not null
    check (length(participant_a_reference_ref) between 1 and 200),
  participant_b_account_id text not null
    check (length(participant_b_account_id) between 1 and 200),
  participant_b_reference_ref text not null
    check (length(participant_b_reference_ref) between 1 and 200),
  status text not null default 'active' check (status in ('active', 'dissolved')),
  created_at timestamptz not null default now(),
  dissolved_at timestamptz,
  -- A pair is between two DIFFERENT people, and the same source cannot be both sides.
  constraint yorisou_connection_pairs_distinct_participants
    check (participant_a_account_id <> participant_b_account_id),
  constraint yorisou_connection_pairs_distinct_sources
    check (participant_a_reference_ref <> participant_b_reference_ref),
  constraint yorisou_connection_pairs_dissolved_consistency
    check ((status = 'dissolved') = (dissolved_at is not null))
);

create index if not exists yorisou_connection_pairs_participant_a
  on public.yorisou_connection_pairs (participant_a_account_id) where status = 'active';
create index if not exists yorisou_connection_pairs_participant_b
  on public.yorisou_connection_pairs (participant_b_account_id) where status = 'active';
create index if not exists yorisou_connection_pairs_source_a
  on public.yorisou_connection_pairs (participant_a_reference_ref);
create index if not exists yorisou_connection_pairs_source_b
  on public.yorisou_connection_pairs (participant_b_reference_ref);

alter table public.yorisou_connection_pairs enable row level security;

create table if not exists public.yorisou_connection_invitations (
  id uuid primary key default gen_random_uuid(),
  public_invite_id uuid not null unique default gen_random_uuid(),
  inviter_account_id text not null
    check (length(inviter_account_id) between 1 and 200),
  reference_family text not null
    check (reference_family = 'assessment_result'),
  reference_ref text not null
    check (length(reference_ref) between 1 and 200),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'cancelled')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  accepted_by_account_id text
    check (accepted_by_account_id is null or length(accepted_by_account_id) between 1 and 200),
  accepted_at timestamptz,
  cancelled_at timestamptz,
  pair_id uuid unique references public.yorisou_connection_pairs (id) on delete set null,
  constraint yorisou_connection_invitations_accept_consistency
    check ((status = 'accepted') = (accepted_at is not null)
       and (status = 'accepted') = (accepted_by_account_id is not null)),
  constraint yorisou_connection_invitations_cancel_consistency
    check ((status = 'cancelled') = (cancelled_at is not null)),
  -- Nobody pairs with themselves: that would be consent theatre, not consent.
  constraint yorisou_connection_invitations_no_self_accept
    check (accepted_by_account_id is null or accepted_by_account_id <> inviter_account_id)
);

-- INVARIANT 1. One OPEN invitation per inviter+source. Expiry is not part of the key: an expired
-- pending row still blocks a duplicate until it is cancelled or accepted, which is what makes the
-- create path idempotent rather than merely usually-idempotent.
create unique index if not exists yorisou_connection_invitations_open_identity
  on public.yorisou_connection_invitations (inviter_account_id, reference_family, reference_ref)
  where status = 'pending';

create index if not exists yorisou_connection_invitations_source
  on public.yorisou_connection_invitations (reference_family, reference_ref);
create index if not exists yorisou_connection_invitations_acceptor
  on public.yorisou_connection_invitations (accepted_by_account_id)
  where accepted_by_account_id is not null;

alter table public.yorisou_connection_invitations enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- comparison.core owned data
-- ─────────────────────────────────────────────────────────────────────────────

-- The derived comparison. It stores the two ALREADY-PUBLIC result codes and the adapter version —
-- never rendered copy, never private source content. The rendered five families are a pure
-- function of these inputs, computed per reader so each participant reads their own side first.
--
-- The public codes are still result-derived content, so source erasure CLEARS them (see the
-- erase-with-derivatives seam): a deleted result must not survive as a hidden copy here.
create table if not exists public.yorisou_pair_comparisons (
  id uuid primary key default gen_random_uuid(),
  pair_id uuid not null unique references public.yorisou_connection_pairs (id) on delete cascade,
  adapter_ref text not null check (length(adapter_ref) between 1 and 120),
  adapter_version text not null check (length(adapter_version) between 1 and 40),
  reference_family text not null check (reference_family = 'assessment_result'),
  side_a_public_reference text check (side_a_public_reference is null or length(side_a_public_reference) between 1 and 40),
  side_b_public_reference text check (side_b_public_reference is null or length(side_b_public_reference) between 1 and 40),
  created_at timestamptz not null default now(),
  invalidated_at timestamptz,
  -- An invalidated comparison must not retain the result-derived codes.
  constraint yorisou_pair_comparisons_invalidated_is_empty
    check (invalidated_at is null
           or (side_a_public_reference is null and side_b_public_reference is null))
);

alter table public.yorisou_pair_comparisons enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- Content-free append-only audit
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.yorisou_connection_audit_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null
    check (event_type in ('connection_invited', 'connection_accepted', 'connection_cancelled',
                          'connection_dissolved', 'comparison_created', 'comparison_invalidated')),
  -- A sha256 fingerprint of the actor, never the account id itself.
  actor_fingerprint text not null check (actor_fingerprint ~ '^[a-f0-9]{64}$'),
  -- Opaque public id of the affected object. Public ids are already non-private by design.
  object_public_ref uuid,
  occurred_at timestamptz not null default now()
);

alter table public.yorisou_connection_audit_events enable row level security;

create or replace function public.yorisou_connection_audit_block_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'connection_audit_is_append_only';
end;
$$;

drop trigger if exists yorisou_connection_audit_events_no_mutate on public.yorisou_connection_audit_events;
create trigger yorisou_connection_audit_events_no_mutate
  before update or delete on public.yorisou_connection_audit_events
  for each row execute function public.yorisou_connection_audit_block_mutation();

-- ─────────────────────────────────────────────────────────────────────────────
-- The ONE place assessment knowledge enters connection/comparison
-- ─────────────────────────────────────────────────────────────────────────────

-- PRODUCT-SPECIFIC ADAPTER, named as such. connection.core and comparison.core must not know the
-- assessment tables; this function is the single, small, explicitly Imairo-shaped bridge that does.
-- It answers exactly one question — "does this account own this LIVE Imairo result, and what is its
-- public code?" — and returns null for every other situation, including a result that exists but
-- belongs to someone else. A guessed row id therefore reveals nothing and grants nothing.
create or replace function public.yorisou_imairo_pair_live_source(
  p_account_id text,
  p_reference_ref text
)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_code text;
begin
  if p_account_id is null or p_reference_ref is null then return null; end if;
  -- A non-uuid reference is a malformed caller, not a lookup: refuse without touching the table.
  if p_reference_ref !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return null;
  end if;
  select r.result_id into v_code
    from public.yorisou_assessment_results r
   where r.id = p_reference_ref::uuid
     and r.owner_account_id = p_account_id
     and r.deleted_at is null
     and r.method_id = 'imairo-120q'
     and r.result_id is not null;
  return v_code;
end;
$$;

-- Whether an assessment source has already been erased (ARCH-P4 tombstone). Kept as its own tiny
-- function so both the create and accept paths ask the question identically.
create or replace function public.yorisou_connection_source_erased(p_reference_ref text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.yorisou_share_source_erasures
     where source_family = 'assessment_result' and source_ref = p_reference_ref
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Mutations
-- ─────────────────────────────────────────────────────────────────────────────

-- CREATE. Verifies ownership of a live source BEFORE inserting, takes the source lock so it cannot
-- interleave with that source's erasure, and returns the existing open invitation on a retry.
create or replace function public.yorisou_connection_invite_create(
  p_inviter_account_id text,
  p_reference_family text,
  p_reference_ref text
)
returns table (public_invite_id uuid, expires_at timestamptz, created_at timestamptz, reused boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.yorisou_connection_invitations%rowtype;
  v_code text;
  v_ttl constant interval := interval '7 days';
begin
  if p_inviter_account_id is null or length(p_inviter_account_id) = 0 then
    raise exception 'connection_invalid_inviter';
  end if;
  if p_reference_family is distinct from 'assessment_result' then
    raise exception 'connection_unsupported_reference_family';
  end if;

  perform public.yorisou_share_source_lock(p_reference_family, p_reference_ref);

  if public.yorisou_connection_source_erased(p_reference_ref) then
    raise exception 'connection_source_erased';
  end if;

  v_code := public.yorisou_imairo_pair_live_source(p_inviter_account_id, p_reference_ref);
  if v_code is null then
    -- Not owned, not live, not Imairo, or has no assigned public result. One refusal for all of
    -- them: distinguishing them would answer questions about other people's rows.
    raise exception 'connection_source_not_invitable';
  end if;

  -- EXPIRY IS PART OF THE IDENTITY QUESTION, AND LEAVING IT OUT CREATED A DEAD END.
  --
  -- The first version returned ANY row with status='pending', expired or not. Combined with the
  -- partial unique index — which deliberately excludes expiry so that a live invitation cannot be
  -- duplicated — that produced an invitation a person could neither use nor replace: on day 8 the
  -- recipient's link was refused as expired, while the inviter pressing "create" was handed that
  -- same dead id back forever.
  --
  -- So a STILL-OPEN invitation is reused, and an EXPIRED one is retired here, under the source lock
  -- already held, before a fresh invitation is minted. The old public id is never revived.
  select * into v_row from public.yorisou_connection_invitations
   where inviter_account_id = p_inviter_account_id
     and reference_family = p_reference_family
     and reference_ref = p_reference_ref
     and status = 'pending'
   for update;
  if found then
    if v_row.expires_at > now() then
      return query select v_row.public_invite_id, v_row.expires_at, v_row.created_at, true;
      return;
    end if;
    update public.yorisou_connection_invitations
       set status = 'cancelled', cancelled_at = now()
     where id = v_row.id;
    insert into public.yorisou_connection_audit_events (event_type, actor_fingerprint, object_public_ref)
    values ('connection_cancelled', encode(digest(p_inviter_account_id, 'sha256'), 'hex'), v_row.public_invite_id);
  end if;

  insert into public.yorisou_connection_invitations
    (inviter_account_id, reference_family, reference_ref, expires_at)
  values (p_inviter_account_id, p_reference_family, p_reference_ref, now() + v_ttl)
  returning * into v_row;

  insert into public.yorisou_connection_audit_events (event_type, actor_fingerprint, object_public_ref)
  values ('connection_invited', encode(digest(p_inviter_account_id, 'sha256'), 'hex'), v_row.public_invite_id);

  return query select v_row.public_invite_id, v_row.expires_at, v_row.created_at, false;
end;
$$;

-- CANCEL. Inviter only, idempotent.
create or replace function public.yorisou_connection_invite_cancel(
  p_inviter_account_id text,
  p_public_invite_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  update public.yorisou_connection_invitations
     set status = 'cancelled', cancelled_at = now()
   where public_invite_id = p_public_invite_id
     and inviter_account_id = p_inviter_account_id
     and status = 'pending'
  returning id into v_id;
  if v_id is null then return false; end if;

  insert into public.yorisou_connection_audit_events (event_type, actor_fingerprint, object_public_ref)
  values ('connection_cancelled', encode(digest(p_inviter_account_id, 'sha256'), 'hex'), p_public_invite_id);
  return true;
end;
$$;

-- ACCEPT. The critical mutation: everything below happens in ONE transaction.
--
-- LOCK ORDER IS THE WHOLE POINT, AND THE FIRST VERSION HAD IT BACKWARDS.
--
-- That version locked the invitation row FIRST and then took the assessment source locks. Source
-- erasure does the opposite — source lock, then UPDATE the pending invitations derived from it —
-- so the two paths formed a textbook cycle:
--
--     accept holds invitation row, waits for source lock
--     erase  holds source lock,    waits for invitation row      => deadlock detected
--
-- Controller review found it, and it reproduces on a real cluster in under a second. The original
-- RACE D test could not see it because it only ever started the erasure first, which is the safe
-- interleaving; the dangerous one is accept-first.
--
-- The global order is now, everywhere in this file:
--
--     SOURCE LOCK(S), in deterministic sorted order   →   INVITATION ROW   →   mutation
--
-- Learning WHICH sources to lock needs a read, so there is one NON-LOCKING lookup first. It is
-- used for exactly one thing: naming the two lock keys. Nothing is authorized from it. After the
-- locks are held the invitation is re-selected FOR UPDATE and EVERY fact is re-verified against
-- that authoritative row — including that its source reference is still the one we locked.
create or replace function public.yorisou_connection_invite_accept(
  p_public_invite_id uuid,
  p_acceptor_account_id text,
  p_acceptor_reference_ref text
)
returns table (pair_public_id uuid, reused boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_peek public.yorisou_connection_invitations%rowtype;
  v_inv public.yorisou_connection_invitations%rowtype;
  v_pair public.yorisou_connection_pairs%rowtype;
  v_inviter_code text;
  v_acceptor_code text;
  v_first text;
  v_second text;
begin
  if p_acceptor_account_id is null or length(p_acceptor_account_id) = 0 then
    raise exception 'connection_invalid_acceptor';
  end if;

  -- STEP 1 — NON-LOCKING PEEK. Its ONLY output is the source reference used to choose lock keys.
  -- It never authorizes anything: a row read here may be stale by the time the locks are held,
  -- which is exactly why step 4 re-reads under them.
  select * into v_peek from public.yorisou_connection_invitations
   where public_invite_id = p_public_invite_id;
  if not found then
    raise exception 'connection_invitation_unavailable';
  end if;
  -- Terminal states can be refused without locking; refusing is not authorizing.
  if v_peek.status = 'cancelled' then
    raise exception 'connection_invitation_unavailable';
  end if;

  -- STEP 2/3 — BOTH source locks, sorted. Sorted because two acceptances involving the same two
  -- sources from opposite directions would otherwise deadlock against each other.
  if v_peek.reference_ref <= p_acceptor_reference_ref then
    v_first := v_peek.reference_ref; v_second := p_acceptor_reference_ref;
  else
    v_first := p_acceptor_reference_ref; v_second := v_peek.reference_ref;
  end if;
  perform public.yorisou_share_source_lock('assessment_result', v_first);
  if v_second is distinct from v_first then
    perform public.yorisou_share_source_lock('assessment_result', v_second);
  end if;

  -- STEP 4 — THE AUTHORITATIVE READ. Everything from here is decided on this row, under the locks.
  select * into v_inv from public.yorisou_connection_invitations
   where public_invite_id = p_public_invite_id
   for update;
  if not found then
    raise exception 'connection_invitation_unavailable';
  end if;

  -- The source must still be the one whose lock we hold. Today reference_ref is immutable, so this
  -- cannot fire — it is here because the correctness of every lock below depends on it, and a
  -- future column that made it mutable must fail loudly rather than silently lock the wrong key.
  if v_inv.reference_ref is distinct from v_peek.reference_ref then
    raise exception 'connection_invitation_unavailable';
  end if;

  -- IDEMPOTENT RETRY: the same acceptor asking again gets the same pair, not a second one.
  if v_inv.status = 'accepted' then
    if v_inv.accepted_by_account_id = p_acceptor_account_id and v_inv.pair_id is not null then
      select * into v_pair from public.yorisou_connection_pairs where id = v_inv.pair_id;
      if found then
        return query select v_pair.pair_public_id, true;
        return;
      end if;
    end if;
    raise exception 'connection_invitation_unavailable';
  end if;

  if v_inv.status <> 'pending' or v_inv.expires_at <= now() then
    raise exception 'connection_invitation_unavailable';
  end if;
  if v_inv.inviter_account_id = p_acceptor_account_id then
    raise exception 'connection_self_accept_forbidden';
  end if;

  -- INVARIANT 4: an erased source can never join a pair.
  if public.yorisou_connection_source_erased(v_inv.reference_ref)
     or public.yorisou_connection_source_erased(p_acceptor_reference_ref) then
    raise exception 'connection_source_erased';
  end if;

  -- Both sides re-verified while holding the locks. The acceptor's reference is verified AGAINST
  -- THE ACCEPTOR: supplying someone else's row id yields null here and refuses the whole accept.
  v_inviter_code := public.yorisou_imairo_pair_live_source(v_inv.inviter_account_id, v_inv.reference_ref);
  if v_inviter_code is null then
    raise exception 'connection_inviter_source_unavailable';
  end if;
  v_acceptor_code := public.yorisou_imairo_pair_live_source(p_acceptor_account_id, p_acceptor_reference_ref);
  if v_acceptor_code is null then
    raise exception 'connection_acceptor_source_unavailable';
  end if;
  if v_inv.reference_ref = p_acceptor_reference_ref then
    raise exception 'connection_same_source_forbidden';
  end if;

  insert into public.yorisou_connection_pairs
    (reference_family, participant_a_account_id, participant_a_reference_ref,
     participant_b_account_id, participant_b_reference_ref)
  values ('assessment_result', v_inv.inviter_account_id, v_inv.reference_ref,
          p_acceptor_account_id, p_acceptor_reference_ref)
  returning * into v_pair;

  insert into public.yorisou_pair_comparisons
    (pair_id, adapter_ref, adapter_version, reference_family,
     side_a_public_reference, side_b_public_reference)
  values (v_pair.id, 'yorisou.imairo/pair', '1.0.0', 'assessment_result',
          v_inviter_code, v_acceptor_code);

  update public.yorisou_connection_invitations
     set status = 'accepted', accepted_at = now(),
         accepted_by_account_id = p_acceptor_account_id, pair_id = v_pair.id
   where id = v_inv.id;

  insert into public.yorisou_connection_audit_events (event_type, actor_fingerprint, object_public_ref)
  values ('connection_accepted', encode(digest(p_acceptor_account_id, 'sha256'), 'hex'), v_pair.pair_public_id),
         ('comparison_created', encode(digest(p_acceptor_account_id, 'sha256'), 'hex'), v_pair.pair_public_id);

  return query select v_pair.pair_public_id, false;
end;
$$;

-- DISSOLVE. EITHER participant, idempotent, irreversible. A non-participant changes nothing and
-- receives the same `false` as somebody dissolving an already-dissolved pair.
create or replace function public.yorisou_connection_pair_dissolve(
  p_viewer_account_id text,
  p_pair_public_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_viewer_account_id is null or length(p_viewer_account_id) = 0 then
    raise exception 'connection_invalid_viewer';
  end if;

  update public.yorisou_connection_pairs
     set status = 'dissolved', dissolved_at = now()
   where pair_public_id = p_pair_public_id
     and status = 'active'
     and (participant_a_account_id = p_viewer_account_id
          or participant_b_account_id = p_viewer_account_id)
  returning id into v_id;
  if v_id is null then return false; end if;

  -- The comparison becomes unreadable AND stops retaining the result-derived codes. Dissolving is
  -- a privacy act, not a visibility toggle.
  update public.yorisou_pair_comparisons
     set invalidated_at = now(), side_a_public_reference = null, side_b_public_reference = null
   where pair_id = v_id and invalidated_at is null;

  insert into public.yorisou_connection_audit_events (event_type, actor_fingerprint, object_public_ref)
  values ('connection_dissolved', encode(digest(p_viewer_account_id, 'sha256'), 'hex'), p_pair_public_id);
  return true;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Source erasure with ALL derivatives — the P5 authoritative seam
-- ─────────────────────────────────────────────────────────────────────────────

-- ARCH-P4 gave assessment erasure a share-aware seam. P5 adds a second derivative family, so the
-- authoritative seam moves out one layer: this function cancels invitations, dissolves pairs and
-- clears comparison payloads, and THEN delegates to the merged ARCH-P4 seam, which in turn
-- delegates to the canonical assessment erasure. Nothing is reimplemented; each layer still owns
-- its own derivative, and the whole thing is one transaction that rolls back together.
create or replace function public.yorisou_assessment_result_erase_with_derivatives(
  p_result_row_id uuid,
  p_owner_account_id text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_family constant text := 'assessment_result';
  v_ref text := p_result_row_id::text;
  v_erased boolean;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'connection_invalid_owner';
  end if;

  perform public.yorisou_share_source_lock(v_family, v_ref);

  -- Authorization BEFORE any side effect. A caller who does not own this live result changes
  -- nothing at all — not their pairs, and certainly not anyone else's.
  perform 1 from public.yorisou_assessment_results
   where id = p_result_row_id and owner_account_id = p_owner_account_id and deleted_at is null;
  if not found then
    return false;
  end if;

  -- Pending invitations derived from this source can never be accepted again.
  update public.yorisou_connection_invitations
     set status = 'cancelled', cancelled_at = now()
   where reference_family = v_family and reference_ref = v_ref and status = 'pending';

  -- Active pairs using this source on EITHER side are dissolved, and their comparisons are both
  -- invalidated and emptied of the result-derived codes.
  update public.yorisou_pair_comparisons c
     set invalidated_at = now(), side_a_public_reference = null, side_b_public_reference = null
   where c.invalidated_at is null
     and exists (select 1 from public.yorisou_connection_pairs p
                  where p.id = c.pair_id
                    and p.status = 'active'
                    and (p.participant_a_reference_ref = v_ref or p.participant_b_reference_ref = v_ref));

  update public.yorisou_connection_pairs
     set status = 'dissolved', dissolved_at = now()
   where status = 'active'
     and (participant_a_reference_ref = v_ref or participant_b_reference_ref = v_ref);

  -- Then the merged ARCH-P4 seam: share revocation, the tombstone, and the canonical erasure.
  v_erased := public.yorisou_assessment_result_erase_with_shares(p_result_row_id, p_owner_account_id);
  if not v_erased then
    -- Roll back the cancellations and dissolutions: the source still exists, so its pairs must too.
    raise exception 'connection_source_erasure_failed';
  end if;

  return true;
end;
$$;

do $fnroles$
declare
  v_sig text;
begin
  foreach v_sig in array array[
    'public.yorisou_imairo_pair_live_source(text, text)',
    'public.yorisou_connection_source_erased(text)',
    'public.yorisou_connection_invite_create(text, text, text)',
    'public.yorisou_connection_invite_cancel(text, uuid)',
    'public.yorisou_connection_invite_accept(uuid, text, text)',
    'public.yorisou_connection_pair_dissolve(text, uuid)',
    'public.yorisou_assessment_result_erase_with_derivatives(uuid, text)'
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

do $tblroles$
declare
  v_tbl text;
begin
  foreach v_tbl in array array[
    'public.yorisou_connection_pairs',
    'public.yorisou_connection_invitations',
    'public.yorisou_pair_comparisons',
    'public.yorisou_connection_audit_events'
  ] loop
    execute 'revoke all on table ' || v_tbl || ' from public';
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute 'revoke all on table ' || v_tbl || ' from anon';
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute 'revoke all on table ' || v_tbl || ' from authenticated';
    end if;
    if exists (select 1 from pg_roles where rolname = 'service_role') then
      execute 'grant select on table ' || v_tbl || ' to service_role';
    end if;
  end loop;
end
$tblroles$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Account-erasure plan, re-emitted VERBATIM from 202608180002 with the CPR-1 families.
-- ─────────────────────────────────────────────────────────────────────────────

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
