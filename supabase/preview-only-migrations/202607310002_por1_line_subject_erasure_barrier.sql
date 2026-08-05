-- ═════════════════════════════════════════════════════════════════════════════
-- POR-1 — LINE SUBJECT ERASURE BARRIER.
--
-- WHY THIS EXISTS.
--
-- `202607310001` replaced the shared mutable recent-subject array with one row per event, and it is
-- correct about everything it claims. It protects redelivery of an EXISTING event, reuse of an
-- EXISTING event identity, and replay against an event-level tombstone.
--
-- It does not protect the case that actually matters after a deletion:
--
--     account deleted → every event row for that subject tombstoned
--     LINE delivers a BRAND-NEW event id for the SAME subject
--     the record RPC finds no existing row, so it INSERTS an active one
--
-- The deleted person's activity is live again. Nothing was overwritten and no constraint was
-- violated; the model simply had no place to record that the SUBJECT is gone. An event tombstone
-- is not a subject tombstone. Erasure was a property of rows that happened to exist at deletion
-- time, and LINE decides when the next event id exists — so the guarantee depended on a third party
-- not sending anything again.
--
-- THE BARRIER.
--
--   • A subject-state registry keyed by `line_subject_hash`, `active | erased`, strongly consistent
--     and permanent. `erased` is terminal.
--   • Every event record LOCKS that row FIRST and reads the authoritative state under the lock. The
--     subject row — not the event row — is the serialization point for event-versus-erasure, which
--     is what makes "a new event id" and "a completed deletion" a decidable order rather than a
--     race. Two subjects still never contend: the lock is per subject.
--   • Erasure transitions the subject, THEN content-clears its existing rows, in one transaction. A
--     row that does not exist yet is covered by the state, not by the sweep.
--   • Erasing a subject that has never been seen still creates an `erased` row. A LINE-bound account
--     deleted before its first webhook is exactly as protected as one deleted after its thousandth.
--
-- WHAT AN ERASED SUBJECT STORES. The hash, the terminal state, an optional owner fingerprint, and
-- timestamps. No raw LINE id — the registry is keyed by digest and never carries the identifier it
-- is a digest of, so the barrier cannot outlive the person as a way to recognise them.
--
-- WHAT AN ERASED SUBJECT DOES *NOT* DO. It does not re-open. A future legitimate reactivation would
-- be a separately governed operation with its own authorization; recording an event is not that
-- operation and must never become it by accident.
-- ═════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. The subject-state registry.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_canonical_line_subjects (
  line_subject_hash  text primary key,
  state              text not null default 'active',
  owner_fingerprint  text,
  erased_at          timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'yorisou_canonical_line_subjects_state_check') then
    alter table public.yorisou_canonical_line_subjects
      add constraint yorisou_canonical_line_subjects_state_check
      check (state in ('active', 'erased'));
  end if;

  -- Addressed by digest, always. A raw LINE id (`U` + 32 hex) does not match, so this is also the
  -- guard against a caller passing the identifier itself.
  if not exists (select 1 from pg_constraint where conname = 'yorisou_canonical_line_subjects_digest_check') then
    alter table public.yorisou_canonical_line_subjects
      add constraint yorisou_canonical_line_subjects_digest_check
      check (line_subject_hash ~ '^[0-9a-f]{64}$');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'yorisou_canonical_line_subjects_owner_digest_check') then
    alter table public.yorisou_canonical_line_subjects
      add constraint yorisou_canonical_line_subjects_owner_digest_check
      check (owner_fingerprint is null or owner_fingerprint ~ '^[0-9a-f]{64}$');
  end if;

  -- An erased subject must carry the timestamp that makes it auditable. Enforced here rather than
  -- trusted to the erase RPC, for the same reason the event tombstone's emptiness is.
  if not exists (select 1 from pg_constraint where conname = 'yorisou_canonical_line_subjects_erased_stamp_check') then
    alter table public.yorisou_canonical_line_subjects
      add constraint yorisou_canonical_line_subjects_erased_stamp_check
      check (state = 'active' or erased_at is not null);
  end if;
end $$;

create index if not exists yorisou_canonical_line_subjects_owner_idx
  on public.yorisou_canonical_line_subjects (owner_fingerprint)
  where owner_fingerprint is not null;

create index if not exists yorisou_canonical_line_subjects_state_idx
  on public.yorisou_canonical_line_subjects (state);

alter table public.yorisou_canonical_line_subjects enable row level security;
alter table public.yorisou_canonical_line_subjects force row level security;

do $$
begin
  revoke all on table public.yorisou_canonical_line_subjects from public;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table public.yorisou_canonical_line_subjects from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table public.yorisou_canonical_line_subjects from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant select on table public.yorisou_canonical_line_subjects to service_role';
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Backfill. Every subject already carrying events becomes a registry row, and one whose events
--    are ALL tombstoned is recorded as erased rather than active — otherwise applying this barrier
--    would quietly re-open every subject deleted before it existed.
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.yorisou_canonical_line_subjects (line_subject_hash, state, owner_fingerprint, erased_at)
select e.line_subject_hash,
       case when count(*) filter (where e.retention_state = 'active') > 0 then 'active' else 'erased' end,
       max(e.owner_fingerprint),
       case when count(*) filter (where e.retention_state = 'active') > 0 then null else max(e.erased_at) end
  from public.yorisou_canonical_line_events e
 group by e.line_subject_hash
on conflict (line_subject_hash) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. The lock-or-create primitive.
--
--    `insert ... on conflict do nothing` then `select ... for update` rather than one upsert,
--    because an upsert that touches the row on every event would take a write lock on a hot row for
--    a read that usually changes nothing. The re-select after a lost insert race is not optional:
--    `on conflict do nothing` returns no row, and proceeding without the lock is the whole bug.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_line_subject_lock(
  p_line_subject_hash text,
  p_owner_fingerprint text default null
) returns public.yorisou_canonical_line_subjects
language plpgsql security definer set search_path = public as $$
declare v_subject public.yorisou_canonical_line_subjects%rowtype;
begin
  if p_line_subject_hash is null or p_line_subject_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'line_subject_hash_must_be_sha256_hex';
  end if;

  for i in 1..2 loop
    select * into v_subject
      from public.yorisou_canonical_line_subjects
     where line_subject_hash = p_line_subject_hash
       for update;
    if found then
      return v_subject;
    end if;

    begin
      insert into public.yorisou_canonical_line_subjects (line_subject_hash, owner_fingerprint)
      values (p_line_subject_hash, p_owner_fingerprint);
    exception when unique_violation then
      -- A concurrent inserter won. Loop once more; the select will now find and LOCK its row, which
      -- is what makes the two callers serial instead of both proceeding on an unlocked subject.
      null;
    end;
  end loop;

  select * into v_subject
    from public.yorisou_canonical_line_subjects
   where line_subject_hash = p_line_subject_hash
     for update;
  if not found then
    raise exception 'line_subject_state_unavailable';
  end if;
  return v_subject;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Recording, re-defined on top of the barrier.
--
--    Identical to `202607310001` in every accepted respect — three distinguishable outcomes,
--    idempotency as a constraint, identity reuse refused — with the subject state consulted FIRST,
--    under its lock.
--
--    An erased subject returns `erased` and writes NOTHING. Not a tombstone row either: a row would
--    be a place to put content, and there is no content worth keeping about a delivery to someone
--    who no longer exists. Idempotency of the refusal is free, because the refusal is derived from
--    the subject state rather than from a record of the event.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_line_event_record(
  p_line_event_id       text,
  p_line_subject_hash   text,
  p_event_type          text,
  p_line_subject_id     text default null,
  p_webhook_event_id    text default null,
  p_owner_account_id    text default null,
  p_owner_fingerprint   text default null,
  p_source_type         text default null,
  p_message_type        text default null,
  p_message_text        text default null,
  p_postback_data       text default null,
  p_delivery_mode       text default null,
  p_is_redelivery       boolean default false,
  p_reply_token_present boolean default false,
  p_reply_status        text default 'not_attempted',
  p_reply_error         text default null,
  p_event_timestamp     timestamptz default null,
  p_received_at         timestamptz default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_subject  public.yorisou_canonical_line_subjects%rowtype;
  v_existing public.yorisou_canonical_line_events%rowtype;
  v_received timestamptz := coalesce(p_received_at, now());
begin
  if p_line_event_id is null or length(trim(p_line_event_id)) = 0 then
    raise exception 'line_event_id_required';
  end if;
  if p_line_subject_hash is null or p_line_subject_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'line_subject_hash_must_be_sha256_hex';
  end if;

  -- THE BARRIER. Locking the subject before touching any event row is what serializes a brand-new
  -- event id against a completed erasure. Without it the two transactions never contend, because
  -- they address different rows, and both succeed.
  v_subject := public.yorisou_line_subject_lock(p_line_subject_hash, p_owner_fingerprint);

  if v_subject.state = 'erased' then
    -- Absorbed. No row, no raw subject id, no message text, no postback data, no reply error.
    return jsonb_build_object('outcome', 'erased', 'line_event_id', p_line_event_id);
  end if;

  select * into v_existing
    from public.yorisou_canonical_line_events
   where line_event_id = p_line_event_id
     for update;

  if not found and p_webhook_event_id is not null then
    select * into v_existing
      from public.yorisou_canonical_line_events
     where webhook_event_id = p_webhook_event_id
       for update;
  end if;

  if found then
    if v_existing.line_subject_hash is distinct from p_line_subject_hash then
      raise exception 'line_event_identity_conflict';
    end if;

    if v_existing.retention_state = 'erased' then
      return jsonb_build_object('outcome', 'erased', 'line_event_id', v_existing.line_event_id);
    end if;

    update public.yorisou_canonical_line_events
       set reply_status        = coalesce(p_reply_status, reply_status),
           reply_error         = p_reply_error,
           reply_token_present = coalesce(p_reply_token_present, reply_token_present),
           message_text        = coalesce(p_message_text, message_text),
           is_redelivery       = is_redelivery or coalesce(p_is_redelivery, false),
           owner_account_id    = coalesce(p_owner_account_id, owner_account_id),
           owner_fingerprint   = coalesce(p_owner_fingerprint, owner_fingerprint),
           line_subject_id     = coalesce(p_line_subject_id, line_subject_id),
           updated_at          = now()
     where line_event_id = v_existing.line_event_id;

    if p_owner_fingerprint is not null and v_subject.owner_fingerprint is distinct from p_owner_fingerprint then
      update public.yorisou_canonical_line_subjects
         set owner_fingerprint = p_owner_fingerprint, updated_at = now()
       where line_subject_hash = p_line_subject_hash;
    end if;

    return jsonb_build_object('outcome', 'repeated', 'line_event_id', v_existing.line_event_id);
  end if;

  -- The handler is scoped to the INSERT alone rather than to the whole function. A plpgsql exception
  -- block is a subtransaction, and rolling the whole body back would also roll back the subject row
  -- this transaction may have just created — discarding the barrier's state to report a duplicate.
  begin
    insert into public.yorisou_canonical_line_events (
      line_event_id, webhook_event_id, line_subject_hash, line_subject_id, owner_account_id, owner_fingerprint,
      source_type, event_type, message_type, message_text, postback_data, delivery_mode,
      is_redelivery, reply_token_present, reply_status, reply_error, event_timestamp, received_at
    ) values (
      p_line_event_id, p_webhook_event_id, p_line_subject_hash, p_line_subject_id, p_owner_account_id, p_owner_fingerprint,
      p_source_type, p_event_type, p_message_type, p_message_text, p_postback_data, p_delivery_mode,
      coalesce(p_is_redelivery, false), coalesce(p_reply_token_present, false),
      coalesce(p_reply_status, 'not_attempted'), p_reply_error, p_event_timestamp, v_received
    );
  exception
    when unique_violation then
      -- Lost the insert race on `webhook_event_id`. The winner wrote the same event, so this is a
      -- repeat, not a failure — but only if it is genuinely the same subject.
      if exists (
        select 1 from public.yorisou_canonical_line_events
         where webhook_event_id = p_webhook_event_id
           and line_subject_hash is distinct from p_line_subject_hash
      ) then
        raise exception 'line_event_identity_conflict';
      end if;
      return jsonb_build_object('outcome', 'repeated', 'line_event_id', p_line_event_id);
  end;

  if p_owner_fingerprint is not null and v_subject.owner_fingerprint is distinct from p_owner_fingerprint then
    update public.yorisou_canonical_line_subjects
       set owner_fingerprint = p_owner_fingerprint, updated_at = now()
     where line_subject_hash = p_line_subject_hash;
  end if;

  return jsonb_build_object('outcome', 'recorded', 'line_event_id', p_line_event_id);
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Subject erasure — the authoritative deletion operation.
--
--    Order matters and is not interchangeable: transition the SUBJECT first, then sweep its rows.
--    Sweeping first would leave a window in which the rows are clear but the subject is still
--    active, and a concurrent record in that window inserts a live row into a subject that is about
--    to be declared erased. Both statements are in one transaction under the subject lock, so no
--    other writer observes either order — but the code states the safe one so a future edit that
--    splits the transaction is wrong in an obvious way rather than a subtle one.
--
--    Returns bounded counts only. Never content, never a raw identifier.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_line_subject_erase(
  p_line_subject_hash text,
  p_owner_fingerprint text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_subject   public.yorisou_canonical_line_subjects%rowtype;
  v_erased    int;
  v_residue   int;
  v_already   boolean;
begin
  v_subject := public.yorisou_line_subject_lock(p_line_subject_hash, p_owner_fingerprint);
  v_already := v_subject.state = 'erased';

  update public.yorisou_canonical_line_subjects
     set state             = 'erased',
         erased_at         = coalesce(erased_at, now()),
         owner_fingerprint = coalesce(p_owner_fingerprint, owner_fingerprint),
         updated_at        = now()
   where line_subject_hash = p_line_subject_hash;

  update public.yorisou_canonical_line_events
     set retention_state   = 'erased',
         erased_at         = now(),
         message_text      = null,
         postback_data     = null,
         reply_error       = null,
         owner_account_id  = null,
         line_subject_id   = null,
         owner_fingerprint = coalesce(p_owner_fingerprint, owner_fingerprint),
         updated_at        = now()
   where line_subject_hash = p_line_subject_hash
     and retention_state = 'active';

  get diagnostics v_erased = row_count;

  select count(*)::int into v_residue
    from public.yorisou_canonical_line_events
   where line_subject_hash = p_line_subject_hash
     and retention_state = 'active';

  if v_residue <> 0 then
    -- Unreachable under the subject lock; asserted because a deletion that reports success over
    -- residue is the one failure mode this whole family exists to prevent.
    raise exception 'line_subject_erasure_residue';
  end if;

  return jsonb_build_object(
    'subject_state', 'erased',
    'events_erased', v_erased,
    'active_residue', 0,
    'already_erased', v_already
  );
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. `yorisou_line_activity_erase` — RETIRED IN PLACE, not left callable.
--
--    Its event-only semantics are now a strictly weaker operation that would leave the subject
--    active, so keeping the name reachable would leave a way to perform the exact erasure this
--    migration exists to forbid. It delegates rather than raising: a caller that has not been
--    updated gets the STRONGER guarantee, never the weaker one. The return type is unchanged
--    (`int`, the number of event rows cleared) so no existing caller misreads the result.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_line_activity_erase(
  p_line_subject_hash text,
  p_owner_fingerprint text default null
) returns int language plpgsql security definer set search_path = public as $$
declare v_result jsonb;
begin
  v_result := public.yorisou_line_subject_erase(p_line_subject_hash, p_owner_fingerprint);
  return (v_result ->> 'events_erased')::int;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Verification.
--
--    `yorisou_line_activity_residue` keeps its exact meaning — the number of ACTIVE EVENT ROWS —
--    because it is also how the harness counts a living subject's activity, and a count that
--    silently included a barrier flag would be a count of two different things.
--
--    Deletion verification needs the stronger question, so it gets its own function. An un-erased
--    subject IS residue even with zero event rows: the activity becomes live again the moment LINE
--    sends the next event, which is precisely the hole this migration closes. A MISSING registry row
--    counts as residue too — "we never recorded a subject state" is not evidence of erasure, and
--    unknown must never mean absent.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_line_subject_erasure_residue(p_line_subject_hash text)
returns int language sql stable security definer set search_path = public as $$
  select (
    (select count(*)::int
       from public.yorisou_canonical_line_events
      where line_subject_hash = p_line_subject_hash and retention_state = 'active')
    +
    (select case when exists (
        select 1 from public.yorisou_canonical_line_subjects
         where line_subject_hash = p_line_subject_hash and state = 'erased')
      then 0 else 1 end)
  );
$$;

create or replace function public.yorisou_line_subject_state(p_line_subject_hash text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'subject_hash', p_line_subject_hash,
    'state', coalesce((select s.state from public.yorisou_canonical_line_subjects s
                        where s.line_subject_hash = p_line_subject_hash), 'unknown'),
    'owner_fingerprint', (select s.owner_fingerprint from public.yorisou_canonical_line_subjects s
                           where s.line_subject_hash = p_line_subject_hash),
    'erased_at', (select s.erased_at from public.yorisou_canonical_line_subjects s
                   where s.line_subject_hash = p_line_subject_hash)
  );
$$;

-- The manifest inventory, frozen before the irreversible crossing, now freezes the subject identity
-- and its state alongside the event counts.
create or replace function public.yorisou_line_activity_inventory(p_line_subject_hash text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'subject_hash', p_line_subject_hash,
    'subject_state', coalesce((select s.state from public.yorisou_canonical_line_subjects s
                                where s.line_subject_hash = p_line_subject_hash), 'unknown'),
    'owner_fingerprint', (select s.owner_fingerprint from public.yorisou_canonical_line_subjects s
                           where s.line_subject_hash = p_line_subject_hash),
    'active_events', (select count(*)::int from public.yorisou_canonical_line_events e
                       where e.line_subject_hash = p_line_subject_hash and e.retention_state = 'active'),
    'erased_events', (select count(*)::int from public.yorisou_canonical_line_events e
                       where e.line_subject_hash = p_line_subject_hash and e.retention_state = 'erased'),
    'latest_received_at', (select max(e.received_at) from public.yorisou_canonical_line_events e
                            where e.line_subject_hash = p_line_subject_hash and e.retention_state = 'active')
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. Grants. Service role only; nothing reachable from anon/authenticated.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare r record;
begin
  for r in
    select format('public.%I(%s)', p.proname, pg_get_function_identity_arguments(p.oid)) as sig
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname in (
         'yorisou_line_subject_erase',
         'yorisou_line_subject_state',
         'yorisou_line_subject_erasure_residue',
         'yorisou_line_event_record',
         'yorisou_line_activity_erase',
         'yorisou_line_activity_inventory'
       )
  loop
    execute format('revoke all on function %s from public', r.sig);
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on function %s from anon', r.sig);
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute format('revoke all on function %s from authenticated', r.sig);
    end if;
    if exists (select 1 from pg_roles where rolname = 'service_role') then
      execute format('grant execute on function %s to service_role', r.sig);
    end if;
  end loop;
end $$;

-- `yorisou_line_subject_lock` is a building block, not an entry point: it takes a row lock and
-- returns without deciding anything, so a caller reaching it directly would hold the barrier's lock
-- with none of the logic that justifies holding it. Revoked from every role. Its SECURITY DEFINER
-- callers still reach it, because they execute as the owner.
do $$
declare r record; v_role record;
begin
  for r in
    select format('public.%I(%s)', p.proname, pg_get_function_identity_arguments(p.oid)) as sig
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname = 'yorisou_line_subject_lock'
  loop
    execute format('revoke all on function %s from public', r.sig);
    for v_role in select rolname from pg_roles where rolname in ('anon', 'authenticated', 'service_role') loop
      execute format('revoke all on function %s from %I', r.sig, v_role.rolname);
    end loop;
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Post-condition. The migration verifies its own work rather than assuming it.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare v_missing text;
begin
  if to_regclass('public.yorisou_canonical_line_subjects') is null then
    raise exception 'POR-1: yorisou_canonical_line_subjects was not created';
  end if;

  select string_agg(want, ', ') into v_missing
    from unnest(array[
      'yorisou_line_subject_lock','yorisou_line_subject_erase','yorisou_line_subject_state',
      'yorisou_line_subject_erasure_residue','yorisou_line_event_record',
      'yorisou_line_activity_erase','yorisou_line_activity_inventory'
    ]) as want
   where not exists (
     select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = want
   );

  if v_missing is not null then
    raise exception 'POR-1: LINE subject barrier functions missing: %', v_missing;
  end if;

  if not exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relname = 'yorisou_canonical_line_subjects'
       and c.relrowsecurity and c.relforcerowsecurity
  ) then
    raise exception 'POR-1: RLS is not enabled AND forced on yorisou_canonical_line_subjects';
  end if;

  -- The backfill must not have left an all-tombstoned subject marked active.
  if exists (
    select 1
      from public.yorisou_canonical_line_subjects s
     where s.state = 'active'
       and exists (select 1 from public.yorisou_canonical_line_events e
                    where e.line_subject_hash = s.line_subject_hash)
       and not exists (select 1 from public.yorisou_canonical_line_events e
                        where e.line_subject_hash = s.line_subject_hash and e.retention_state = 'active')
  ) then
    raise exception 'POR-1: backfill left a fully tombstoned subject in the active state';
  end if;
end $$;
