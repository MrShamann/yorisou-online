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
-- CLOSING THE OWNED-SOURCE SET: assessment ownership-creating mutations join the
-- POR-1 account mutation fence
-- ─────────────────────────────────────────────────────────────────────────────

-- WHY THIS IS HERE, IN A CONNECTION MIGRATION.
--
-- Account erasure below enumerates every live assessment source the account owns, locks them all,
-- and then destroys their derivatives. That is only sound if the set cannot GROW after the
-- enumeration. Two canonical assessment mutations could grow it, and neither was fenced:
--
--   yorisou_attempt_claim     — reassigns an ANONYMOUS attempt and its result to an account
--   yorisou_attempt_complete  — inserts a NEW persisted result for an account-owned attempt
--
-- Reproduced on a real cluster: a claim issued while an account deletion was in flight left the
-- DELETED account owning a live attempt and a live assessment result. So "all currently-owned
-- sources are locked" did not mean "all sources this account can own before the transaction ends",
-- and the ARCH-P5 lifecycle claim was not actually closed.
--
-- The fix uses the mechanism POR-1 already has rather than inventing a second one: an account
-- mutation lease. Deletion closes the gate and drains outstanding leases before irreversible work,
-- so once it has done that no new owned source can appear.
--
-- LOCK ORDER, and it matters: the POR-1 GATE is taken BEFORE the attempt row, never after.
-- Deletion closes the gate first and touches attempts later; reversing that here would build a
-- gate/attempt cycle of exactly the kind the previous three rounds were about.
--
-- Neither function's assessment semantics change: no scoring, no result envelope, no taxonomy, no
-- idempotency behaviour, no anonymous/token path. The merged migration that defines them is NOT
-- edited; these replace the bodies in the lineage.

-- The lease vocabulary is a CLOSED list, and it stays closed: the existing thirteen tokens are
-- re-stated verbatim and exactly two are added.
do $ops$
begin
  if exists (select 1 from pg_constraint
              where conname = 'yorisou_account_mutation_leases_operation_code_check'
                and conrelid = 'public.yorisou_account_mutation_leases'::regclass) then
    alter table public.yorisou_account_mutation_leases
      drop constraint yorisou_account_mutation_leases_operation_code_check;
  end if;
  alter table public.yorisou_account_mutation_leases
    add constraint yorisou_account_mutation_leases_operation_code_check
    check (operation_code = any (array[
      'support_profile_update'::text, 'password_update'::text, 'line_binding'::text,
      'account_profile_update'::text, 'identity_mirror_sync'::text, 'session_identity_upgrade'::text,
      'account_recovery'::text, 'account_registration'::text, 'line_primary_provisioning'::text,
      'password_reset_issue'::text, 'session_account_binding'::text, 'foundation_profile_update'::text,
      'foundation_identity_binding'::text,
      -- CPR-1: the two ownership-creating assessment mutations.
      'assessment_attempt_claim'::text, 'assessment_attempt_complete'::text
    ]));
end
$ops$;

-- CLAIM, re-emitted. Identical semantics; the lease is acquired FIRST.
create or replace function public.yorisou_attempt_claim(
  p_attempt_id uuid,
  p_claim_token_hash text,
  p_owner_account_id text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.yorisou_assessment_attempts%rowtype;
  v_result uuid;
  v_lease uuid;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'claim_owner_required';
  end if;

  -- POR-1 GATE BEFORE THE ATTEMPT ROW. This raises the existing bounded account-mutation denials
  -- (deleted / erasing / gate_closed) and therefore fails closed: an anonymous result can never be
  -- assigned to an account whose deletion has begun.
  v_lease := (public.yorisou_account_mutation_begin(p_owner_account_id, 'assessment_attempt_claim', 30)->>'leaseId')::uuid;

  select * into v_attempt from public.yorisou_assessment_attempts a
   where a.id = p_attempt_id for update;
  if not found then raise exception 'attempt_not_found'; end if;

  -- Already claimed by this same account -> idempotent success.
  if v_attempt.owner_account_id is not null then
    if v_attempt.owner_account_id = p_owner_account_id then
      select r.id into v_result from public.yorisou_assessment_results r where r.attempt_id = p_attempt_id;
      perform public.yorisou_account_mutation_release(v_lease);
      return v_result;
    end if;
    raise exception 'attempt_already_claimed_by_another_owner';
  end if;

  if v_attempt.claim_token_hash is null or v_attempt.claim_token_hash <> p_claim_token_hash then
    raise exception 'claim_token_invalid';
  end if;
  if v_attempt.expires_at is not null and v_attempt.expires_at < now() then
    raise exception 'claim_token_expired';
  end if;

  update public.yorisou_assessment_attempts
     set owner_account_id = p_owner_account_id,
         claimed_at       = now(),
         claim_token_hash = null,   -- single use
         expires_at       = null,   -- claimed attempts do not expire
         updated_at       = now()
   where id = p_attempt_id;

  update public.yorisou_assessment_results
     set owner_account_id = p_owner_account_id
   where attempt_id = p_attempt_id
  returning id into v_result;

  -- Released on success only. Any raise above rolls the whole transaction back, lease included, so
  -- a failure cannot strand an active lease that deletion would then wait on forever.
  perform public.yorisou_account_mutation_release(v_lease);
  return v_result;
end;
$$;

-- COMPLETE, re-emitted. Identical semantics, including the anonymous/token-only path, which takes
-- NO lease because there is no account to fence.
create or replace function public.yorisou_attempt_complete(
  p_attempt_id uuid,
  p_claim_token_hash text,
  p_owner_account_id text,
  p_answers jsonb,
  p_answered_count integer,
  p_result_id text,
  p_overlay_id text,
  p_dimension_output jsonb,
  p_scoring_version text,
  p_result_schema_version text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.yorisou_assessment_attempts%rowtype;
  v_existing uuid;
  v_result_row uuid;
  v_lease uuid;
begin
  -- CANONICAL ENVELOPE GUARD: exactly one key, exactly the approved version.
  if p_dimension_output is null
     or jsonb_typeof(p_dimension_output) <> 'object'
     or (select count(*) from jsonb_object_keys(p_dimension_output)) <> 1
     or p_dimension_output->>'v' is distinct from 'pds-v1' then
    raise exception 'assessment_persisted_envelope_invalid';
  end if;

  -- POR-1 GATE BEFORE THE ATTEMPT ROW, for the account-bound path only. A completion creates a NEW
  -- owned result, which is exactly the growth account erasure must not see after its snapshot.
  if p_owner_account_id is not null and length(p_owner_account_id) > 0 then
    v_lease := (public.yorisou_account_mutation_begin(p_owner_account_id, 'assessment_attempt_complete', 30)->>'leaseId')::uuid;
  end if;

  select * into v_attempt from public.yorisou_assessment_attempts a
   where a.id = p_attempt_id
     and (
       (a.owner_account_id is null and a.claim_token_hash is not null and a.claim_token_hash = p_claim_token_hash)
       or (a.owner_account_id is not null and a.owner_account_id = p_owner_account_id)
     )
   for update;
  if not found then raise exception 'attempt_not_found_or_not_writable'; end if;

  select r.id into v_existing from public.yorisou_assessment_results r where r.attempt_id = p_attempt_id;
  if v_existing is not null then
    if v_lease is not null then perform public.yorisou_account_mutation_release(v_lease); end if;
    return v_existing;
  end if;

  if v_attempt.owner_account_id is null
     and v_attempt.expires_at is not null and v_attempt.expires_at <= now() then
    raise exception 'attempt_expired';
  end if;
  if p_answered_count < v_attempt.required_count then raise exception 'attempt_incomplete_coverage'; end if;

  update public.yorisou_assessment_attempts
     set answers = p_answers, answered_count = p_answered_count,
         status = 'completed', completed_at = now(), updated_at = now()
   where id = p_attempt_id;

  insert into public.yorisou_assessment_results
    (attempt_id, owner_account_id, method_id, method_version, scoring_version,
     result_schema_version, result_id, overlay_id, dimension_output, original_result_id)
  values
    (p_attempt_id, v_attempt.owner_account_id, v_attempt.method_id, v_attempt.method_version,
     p_scoring_version, p_result_schema_version, p_result_id, p_overlay_id,
     p_dimension_output, p_result_id)
  returning id into v_result_row;

  if v_lease is not null then perform public.yorisou_account_mutation_release(v_lease); end if;
  return v_result_row;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Assessment-source liveness, and the ARCH-P4 publish RPC re-emitted to use it
-- ─────────────────────────────────────────────────────────────────────────────

-- Is this assessment source still a live row owned by this account?
--
-- ASSESSMENT-GENERIC ON PURPOSE. It knows the assessment table and nothing else — no method id, no
-- taxonomy, no scoring, no product. sharing.core may ask "is the thing I am about to publish from
-- still there and still theirs" without learning what the thing means.
create or replace function public.yorisou_assessment_source_live(
  p_source_ref text,
  p_owner_account_id text
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if p_source_ref is null or p_owner_account_id is null then return false; end if;
  if p_source_ref !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    return false;
  end if;
  return exists (
    select 1 from public.yorisou_assessment_results
     where id = p_source_ref::uuid
       and owner_account_id = p_owner_account_id
       and deleted_at is null
  );
end;
$$;

-- ARCH-P4 PUBLISH, RE-EMITTED WITH ONE ADDED DATABASE INVARIANT. The merged P4 migration file is
-- NOT touched; this replaces the function body in the lineage.
--
-- WHY IT IS NEEDED HERE. P4 refuses a publish whose source carries an erasure tombstone. Account
-- erasure legitimately DELETES those tombstones — they are owner-linked personal rows, and keeping
-- them forever would mean retaining a deleted person's private source references forever. So once
-- account erasure holds the source lock, a publish that built its candidate BEFORE the deletion
-- can wait on that lock, wake after the account is gone, find no tombstone, and resurrect the
-- deleted person's card. The tombstone answers "was this source erased"; it cannot answer "does
-- this source still exist", and after an account erasure that is the only question that matters.
--
-- So the publish now revalidates LIVENESS AND OWNERSHIP in the database, under the lock, after the
-- tombstone check. Every other P4 behaviour is preserved exactly.
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

  -- THE NEW INVARIANT. One bounded refusal for deleted, unowned and nonexistent alike: the caller
  -- must not learn which, and an application-side pre-read cannot substitute because the whole
  -- problem is that its read happened before this lock was granted.
  if p_source_family = 'assessment_result'
     and not public.yorisou_assessment_source_live(p_source_ref, p_owner_account_id) then
    raise exception 'share_source_unavailable';
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

  -- PAIR BEFORE COMPARISON — the same global order the source-erasure seam follows. This function
  -- takes no source lock (a participant ending their own pair has nothing to do with either
  -- assessment source), so the ONLY thing preventing a cycle with source erasure is that both
  -- paths touch these two tables in the same direction. Reversing either one reintroduces a
  -- deadlock that no advisory lock can protect against.
  --
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
  v_pair_ids uuid[];
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

  -- PAIR ROWS BEFORE COMPARISON ROWS, and this order is not cosmetic.
  --
  -- The previous version invalidated comparisons FIRST and then dissolved the pairs, while
  -- `yorisou_connection_pair_dissolve` does the opposite — pair, then comparison. Dissolve takes no
  -- source lock, so the source-lock ordering fixed elsewhere cannot protect this path, and the two
  -- formed a second real cycle:
  --
  --     dissolve holds pair row,       waits for comparison row
  --     erase    holds comparison row, waits for pair row        => deadlock detected
  --
  -- Every pair-lifecycle mutation in this file now takes PAIR before COMPARISON, so the whole
  -- lifecycle has one global order:
  --
  --     SOURCE LOCK(S) → INVITATION ROW(S) → PAIR ROW(S) → COMPARISON ROW(S) → downstream erasure
  --
  -- The affected pairs are locked explicitly and IN ID ORDER first. Ordering matters because a
  -- source can appear in several pairs, and two erasures touching overlapping sets in different
  -- orders would deadlock against each other.
  select array_agg(id order by id) into v_pair_ids
    from (
      select id from public.yorisou_connection_pairs
       where status = 'active'
         and (participant_a_reference_ref = v_ref or participant_b_reference_ref = v_ref)
       order by id
       for update
    ) locked;

  if v_pair_ids is not null and array_length(v_pair_ids, 1) > 0 then
    update public.yorisou_connection_pairs
       set status = 'dissolved', dissolved_at = now()
     where id = any (v_pair_ids);

    update public.yorisou_pair_comparisons
       set invalidated_at = now(), side_a_public_reference = null, side_b_public_reference = null
     where pair_id = any (v_pair_ids)
       and invalidated_at is null;
  end if;

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
    'public.yorisou_assessment_source_live(text, text)',
    'public.yorisou_attempt_claim(uuid, text, text)',
    'public.yorisou_attempt_complete(uuid, text, text, jsonb, integer, text, text, jsonb, text, text)',
    'public.yorisou_share_object_publish(text, text, text, text, text, text, text, jsonb, text)',
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
