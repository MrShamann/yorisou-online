-- ═════════════════════════════════════════════════════════════════════════════
-- POR-1 — CANONICAL LINE ACTIVITY.
--
-- WHY THIS EXISTS.
--
-- LINE activity was indexed by ONE object: `phase1/line-events/admin-recent-subjects.json`, a single
-- JSON array covering EVERY LINE subject, updated by read-modify-write, on an object transport with
-- no read-after-write consistency.
--
-- That is not a slow read. It is a lost update:
--
--     writer A: GET the array (stale copy, missing B's entry)
--     writer B: GET the array, PUT the array + B
--     writer A: PUT the array + A                      ← B's entry is gone
--
-- Retrying and waiting longer cannot remove it. Both writers succeeded; both were told they
-- succeeded; the document simply does not contain what the product believes it contains. Measured
-- visibility lag on this exact key was a DISTRIBUTION — 4.5s, 5.4s and 11s across three probes, and
-- ten consecutive one-second reads returning the previous version before the eleventh returned the
-- new one — so no window is large enough to be a repair.
--
-- It is also unusable as deletion evidence, which is the more serious half. Absence in a stale read
-- is indistinguishable from erasure. A deletion that proves itself by re-reading this array can
-- report a clean prune over data that is still there.
--
-- THE MODEL.
--
--   • ONE ROW PER EVENT, addressed by the event's own identity. Two subjects never touch the same
--     row, so there is no read-modify-write on shared state and nothing to lose.
--   • "Recent subjects" is DERIVED (`distinct on (line_subject_hash)`), not stored. A derived view
--     cannot drift from the events it summarises, and there is no second object to keep consistent.
--   • Idempotency is a CONSTRAINT, not a convention: a redelivery of the same webhook event lands on
--     the same row. Reuse of one event identity for a DIFFERENT subject is refused loudly rather
--     than silently rebinding someone else's activity.
--   • Deletion touches only the rows whose subject hash matches, so erasing one person cannot
--     rewrite another's — the structural defect that made the array's prune a whole-file rewrite.
--   • Erasure leaves a CONTENT-FREE TOMBSTONE rather than deleting the row. A deleted row would let
--     a redelivery arriving afterwards recreate the activity; a tombstone absorbs it.
--
-- ADDRESSING IS BY DIGEST. `line_subject_hash` — sha256 of the LINE user id — is the only thing
-- that keys, indexes, scopes an erasure or appears in audit output, so no code path needs the raw
-- identifier to erase, verify or count. The raw id survives in ONE ordinary column
-- (`line_subject_id`) because the admin timeline genuinely has to resolve a canonical identity from
-- it, and a digest cannot be reversed to do that. It is nulled by the tombstone, so it does not
-- outlive the person — which is more than the array it replaces ever managed.
--
-- Account ownership is carried both as an id (while the account lives) and as a content-free
-- fingerprint (which is what survives, and what deletion verification matches on).
-- ═════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. The events table.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_canonical_line_events (
  line_event_id        text primary key,
  webhook_event_id     text,
  line_subject_hash    text not null,
  line_subject_id      text,
  owner_account_id     text,
  owner_fingerprint    text,
  source_type          text,
  event_type           text not null,
  message_type         text,
  message_text         text,
  postback_data        text,
  delivery_mode        text,
  is_redelivery        boolean not null default false,
  reply_token_present  boolean not null default false,
  reply_status         text not null default 'not_attempted',
  reply_error          text,
  event_timestamp      timestamptz,
  received_at          timestamptz not null default now(),
  retention_state      text not null default 'active',
  erased_at            timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'yorisou_canonical_line_events_retention_check') then
    alter table public.yorisou_canonical_line_events
      add constraint yorisou_canonical_line_events_retention_check
      check (retention_state in ('active', 'erased'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'yorisou_canonical_line_events_reply_status_check') then
    alter table public.yorisou_canonical_line_events
      add constraint yorisou_canonical_line_events_reply_status_check
      check (reply_status in ('not_attempted', 'sent', 'failed'));
  end if;

  -- A tombstone must actually be content-free. This is the constraint rather than a code comment
  -- because the erase RPC is not the only thing that could ever write this row.
  if not exists (select 1 from pg_constraint where conname = 'yorisou_canonical_line_events_erased_is_empty_check') then
    alter table public.yorisou_canonical_line_events
      add constraint yorisou_canonical_line_events_erased_is_empty_check
      check (
        retention_state = 'active'
        or (message_text is null and postback_data is null and reply_error is null
            and owner_account_id is null and line_subject_id is null and erased_at is not null)
      );
  end if;

  -- The subject hash is a sha256 hex digest. A raw LINE id (`U` + 32 hex) would not match, so this
  -- is also the guard that a caller cannot pass the identifier itself by mistake.
  if not exists (select 1 from pg_constraint where conname = 'yorisou_canonical_line_events_subject_digest_check') then
    alter table public.yorisou_canonical_line_events
      add constraint yorisou_canonical_line_events_subject_digest_check
      check (line_subject_hash ~ '^[0-9a-f]{64}$');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'yorisou_canonical_line_events_owner_digest_check') then
    alter table public.yorisou_canonical_line_events
      add constraint yorisou_canonical_line_events_owner_digest_check
      check (owner_fingerprint is null or owner_fingerprint ~ '^[0-9a-f]{64}$');
  end if;
end $$;

-- The idempotency identity. LINE's own `webhookEventId` is unique per delivery; a redelivery
-- repeats it. Partial, because events seeded without one are legitimate.
create unique index if not exists yorisou_canonical_line_events_webhook_event_id_key
  on public.yorisou_canonical_line_events (webhook_event_id)
  where webhook_event_id is not null;

create index if not exists yorisou_canonical_line_events_subject_recent_idx
  on public.yorisou_canonical_line_events (line_subject_hash, received_at desc);

create index if not exists yorisou_canonical_line_events_owner_idx
  on public.yorisou_canonical_line_events (owner_fingerprint)
  where owner_fingerprint is not null;

create index if not exists yorisou_canonical_line_events_recent_idx
  on public.yorisou_canonical_line_events (received_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Access control. Service role reads; every write goes through a function.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.yorisou_canonical_line_events enable row level security;
alter table public.yorisou_canonical_line_events force row level security;

do $$
begin
  revoke all on table public.yorisou_canonical_line_events from public;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table public.yorisou_canonical_line_events from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table public.yorisou_canonical_line_events from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant select on table public.yorisou_canonical_line_events to service_role';
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Recording. Idempotent, and hostile to identity reuse.
--
--    Three outcomes, and they are deliberately distinguishable to the caller:
--      recorded  — a new row
--      repeated  — the same event again (redelivery, or a retry of our own write)
--      erased    — the subject has been deleted; the tombstone absorbs the delivery
--    A fourth case raises: the same event identity naming a DIFFERENT subject. Accepting that would
--    let one delivery rebind another person's activity, which is the exact class of bug this whole
--    table exists to make impossible.
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
  v_existing public.yorisou_canonical_line_events%rowtype;
  v_received timestamptz := coalesce(p_received_at, now());
begin
  if p_line_event_id is null or length(trim(p_line_event_id)) = 0 then
    raise exception 'line_event_id_required';
  end if;
  if p_line_subject_hash is null or p_line_subject_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'line_subject_hash_must_be_sha256_hex';
  end if;

  -- Take the row lock FIRST. Two concurrent deliveries of the same event, and a delivery racing an
  -- erasure, are both decided here rather than by whoever writes last.
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

    return jsonb_build_object('outcome', 'repeated', 'line_event_id', v_existing.line_event_id);
  end if;

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

  return jsonb_build_object('outcome', 'recorded', 'line_event_id', p_line_event_id);
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
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Reads. "Recent subjects" is derived, so it cannot drift from the events.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_line_recent_subjects(p_limit int default 10)
returns setof public.yorisou_canonical_line_events
language sql stable security definer set search_path = public as $$
  select * from (
    select distinct on (line_subject_hash) *
      from public.yorisou_canonical_line_events
     where retention_state = 'active'
     order by line_subject_hash, received_at desc, line_event_id desc
  ) latest
  order by received_at desc, line_event_id desc
  limit greatest(1, coalesce(p_limit, 10));
$$;

create or replace function public.yorisou_line_events_for_subject(
  p_line_subject_hash text,
  p_limit int default 100
) returns setof public.yorisou_canonical_line_events
language sql stable security definer set search_path = public as $$
  select * from public.yorisou_canonical_line_events
   where line_subject_hash = p_line_subject_hash
     and retention_state = 'active'
   order by received_at desc, line_event_id desc
   limit greatest(1, coalesce(p_limit, 100));
$$;

create or replace function public.yorisou_line_events_recent(p_limit int default 100)
returns setof public.yorisou_canonical_line_events
language sql stable security definer set search_path = public as $$
  select * from public.yorisou_canonical_line_events
   where retention_state = 'active'
   order by received_at desc, line_event_id desc
   limit greatest(1, coalesce(p_limit, 100));
$$;

create or replace function public.yorisou_line_events_for_owner(
  p_owner_fingerprint text,
  p_limit int default 100
) returns setof public.yorisou_canonical_line_events
language sql stable security definer set search_path = public as $$
  select * from public.yorisou_canonical_line_events
   where owner_fingerprint = p_owner_fingerprint
     and retention_state = 'active'
   order by received_at desc, line_event_id desc
   limit greatest(1, coalesce(p_limit, 100));
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Erasure — one subject, scoped by digest, idempotent, retryable.
--
--    Matched by `line_subject_hash` so the caller never needs the raw LINE id it is erasing, and
--    the deletion manifest never has to keep one. Rows belonging to anyone else are not in scope by
--    construction; there is no whole-document rewrite to get wrong.
--
--    `p_owner_fingerprint` is an OPTIONAL second predicate, not a replacement: unbound activity for
--    the same subject carries no owner and must still be erased with the person.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_line_activity_erase(
  p_line_subject_hash text,
  p_owner_fingerprint text default null
) returns int language plpgsql security definer set search_path = public as $$
declare v_erased int;
begin
  if p_line_subject_hash is null or p_line_subject_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'line_subject_hash_must_be_sha256_hex';
  end if;

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
  return v_erased;
end $$;

-- Residue probe used ONLY to verify erasure before finalization. A count, never content.
create or replace function public.yorisou_line_activity_residue(p_line_subject_hash text)
returns int language sql stable security definer set search_path = public as $$
  select count(*)::int from public.yorisou_canonical_line_events
   where line_subject_hash = p_line_subject_hash and retention_state = 'active';
$$;

-- Inventory for the durable deletion manifest, frozen before the irreversible crossing.
create or replace function public.yorisou_line_activity_inventory(p_line_subject_hash text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'subject_hash', p_line_subject_hash,
    'active_events', count(*) filter (where retention_state = 'active')::int,
    'erased_events', count(*) filter (where retention_state = 'erased')::int,
    'latest_received_at', max(received_at) filter (where retention_state = 'active')
  )
  from public.yorisou_canonical_line_events
  where line_subject_hash = p_line_subject_hash;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Function grants. Service role only; nothing reachable from anon/authenticated.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare r record;
begin
  for r in
    select format('public.%I(%s)', p.proname, pg_get_function_identity_arguments(p.oid)) as sig
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname in (
         'yorisou_line_event_record',
         'yorisou_line_recent_subjects',
         'yorisou_line_events_for_subject',
         'yorisou_line_events_recent',
         'yorisou_line_events_for_owner',
         'yorisou_line_activity_erase',
         'yorisou_line_activity_residue',
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Post-condition. The migration verifies its own work rather than assuming it.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare v_missing text;
begin
  if to_regclass('public.yorisou_canonical_line_events') is null then
    raise exception 'POR-1: yorisou_canonical_line_events was not created';
  end if;

  select string_agg(want, ', ') into v_missing
    from unnest(array[
      'yorisou_line_event_record','yorisou_line_recent_subjects',
      'yorisou_line_events_for_subject','yorisou_line_events_recent',
      'yorisou_line_events_for_owner','yorisou_line_activity_erase',
      'yorisou_line_activity_residue','yorisou_line_activity_inventory'
    ]) as want
   where not exists (
     select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = want
   );

  if v_missing is not null then
    raise exception 'POR-1: canonical LINE activity functions missing: %', v_missing;
  end if;

  if not exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relname = 'yorisou_canonical_line_events'
       and c.relrowsecurity and c.relforcerowsecurity
  ) then
    raise exception 'POR-1: RLS is not enabled AND forced on yorisou_canonical_line_events';
  end if;
end $$;
