-- ═════════════════════════════════════════════════════════════════════════════
-- POR-1 — THE ACCOUNT MUTATION FENCE.
--
-- WHY THIS EXISTS.
--
-- Account identity lives in an object store; the decision to delete lives in this database. Those
-- are two systems, and nothing sequenced writes between them. A hosted bisection showed it exactly:
-- serially a deletion completes, but with two concurrent workers the primary account record comes
-- back after erasure and the saga refuses to finalize. A request had loaded the account before the
-- deletion started and wrote its stale copy afterwards.
--
-- A pre-write check on the deletion state does NOT fix this. It moves the race:
--
--     request A: reads state, sees no deletion
--     request B: closes the deletion, erases the account
--     request A: writes the account it read earlier   ← resurrected
--
-- So the fix cannot be a check. It has to be a fence, and the fence has to live where the ordering
-- can actually be decided — in the database, under row locks.
--
-- THE MODEL.
--
--   • Every ordinary account write takes a short LEASE first, and holds it across its whole
--     read-transform-write window. A lease is refused once a deletion has begun.
--   • Deletion does not erase anything until it has CLOSED the gate to new leases and DRAINED the
--     leases already outstanding. Draining is what makes the fence sound: an in-flight writer is
--     allowed to finish, and only then does erasure start.
--   • A worker can die holding a lease. Expiry alone is not proof that no write can still land, so
--     an unreleased lease is only abandoned after an execution grace longer than the platform's
--     maximum request duration.
--   • The gate carries a GENERATION so a lease issued before a close can never authorise a write
--     after it.
--
-- Content-free by construction: no email, no LINE id, no password, no cookie, no request body.
-- Only an owner id, a state, a generation, a bounded operation code and timestamps.
-- ═════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Durable execution cursor on the deletion job.
--
--    `failed_retryable` alone cannot say WHERE a run failed, so a retry could not tell "we never
--    locked" from "we were half-way through erasure". That ambiguity is what let a retry walk back
--    through a step that writes identity. The cursor records the last stage that completed, and
--    `irreversible_started_at` records the crossing as a FACT rather than something inferred from a
--    state string.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.yorisou_account_deletion_jobs
  add column if not exists execution_cursor text,
  add column if not exists irreversible_started_at timestamptz,
  add column if not exists mutation_gate_closed_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'yorisou_account_deletion_jobs_cursor_check'
  ) then
    alter table public.yorisou_account_deletion_jobs
      add constraint yorisou_account_deletion_jobs_cursor_check
      check (execution_cursor is null or execution_cursor in (
        'identity_verified','mutation_draining','locked','database_erasure',
        'storage_erasure','identity_erasure','verifying'
      ));
  end if;
end $$;

comment on column public.yorisou_account_deletion_jobs.execution_cursor is
  'Last stage that completed. A retry resumes from here; it never walks back through a stage that writes identity.';
comment on column public.yorisou_account_deletion_jobs.irreversible_started_at is
  'Set once, when erasure begins. The authority for "irreversible" — never inferred from the state string.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. The gate. One per account.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_account_mutation_gates (
  owner_account_id  text primary key,
  gate_state        text not null default 'open'
                      check (gate_state in ('open','draining','closed','completed')),
  -- Bumped on every close. A lease bound to an older generation is dead on arrival, so a lease
  -- issued microseconds before a close can never authorise a write after it.
  generation        integer not null default 1 check (generation > 0),
  owner_fingerprint text,
  closed_at         timestamptz,
  completed_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists yorisou_account_mutation_gates_state_idx
  on public.yorisou_account_mutation_gates (gate_state);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Leases. Bounded, content-free, and short.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_account_mutation_leases (
  id                uuid primary key default gen_random_uuid(),
  owner_account_id  text not null,
  gate_generation   integer not null,
  -- A closed set. An arbitrary string here would turn the audit into free text.
  operation_code    text not null
                      check (operation_code in (
                        'support_profile_update','password_update','line_binding',
                        'account_profile_update','identity_mirror_sync',
                        'session_identity_upgrade','account_recovery'
                      )),
  request_nonce_hash text,
  issued_at         timestamptz not null default now(),
  expires_at        timestamptz not null,
  released_at       timestamptz,
  drained_at        timestamptz
);

create index if not exists yorisou_account_mutation_leases_active_idx
  on public.yorisou_account_mutation_leases (owner_account_id)
  where released_at is null and drained_at is null;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Access. Same posture as every other governed table: RLS on and forced, no grants to anon or
--    authenticated, and no direct writes even for service_role — only through the RPCs below.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.yorisou_account_mutation_gates  enable row level security;
alter table public.yorisou_account_mutation_gates  force row level security;
alter table public.yorisou_account_mutation_leases enable row level security;
alter table public.yorisou_account_mutation_leases force row level security;

do $$
declare t text;
begin
  foreach t in array array['yorisou_account_mutation_gates','yorisou_account_mutation_leases'] loop
    execute format('revoke all on table public.%I from public', t);
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on table public.%I from anon', t);
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute format('revoke all on table public.%I from authenticated', t);
    end if;
    if exists (select 1 from pg_roles where rolname = 'service_role') then
      execute format('grant select on table public.%I to service_role', t);
    end if;
  end loop;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. EXECUTION GRACE.
--
--    A worker can die between taking a lease and writing. Expiry is therefore NOT proof that no
--    write can still land — the process may still be running. The grace must exceed the longest a
--    request can legally execute on the platform; the deletion route is capped at 60s, so 180s is
--    three times the worst case and still bounded.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_mutation_execution_grace()
returns interval language sql immutable as $$ select interval '180 seconds' $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Take a lease.
--
--    Refuses whenever the account is not open for ordinary writes. The deletion job is consulted
--    directly rather than trusted from the caller, and a COMPLETED deletion is refused through the
--    fingerprint too — by then the raw account id is gone, so an id-keyed lookup alone would find
--    nothing and wrongly allow the write.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_mutation_begin(
  p_owner_account_id text,
  p_operation_code   text,
  p_ttl_seconds      integer default 30,
  p_request_nonce_hash text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_gate   public.yorisou_account_mutation_gates%rowtype;
  v_job    public.yorisou_account_deletion_jobs%rowtype;
  v_lease  uuid;
begin
  if p_owner_account_id is null or char_length(p_owner_account_id) = 0 then
    raise exception 'account_mutation_owner_required';
  end if;
  if p_ttl_seconds is null or p_ttl_seconds < 1 or p_ttl_seconds > 120 then
    raise exception 'account_mutation_ttl_out_of_range';
  end if;

  -- A completed deletion no longer carries the raw id, so check the fingerprint as well.
  select * into v_job from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id
      or owner_fingerprint = public.yorisou_account_deletion_fingerprint(p_owner_account_id)
   limit 1;

  if found then
    if v_job.state = 'completed' then
      raise exception 'account_mutation_denied_deleted';
    end if;
    if v_job.irreversible_started_at is not null then
      raise exception 'account_mutation_denied_erasing';
    end if;
    if v_job.state in ('locked','database_erasure','storage_erasure','identity_erasure','verifying') then
      raise exception 'account_mutation_denied_erasing';
    end if;
  end if;

  insert into public.yorisou_account_mutation_gates (owner_account_id)
  values (p_owner_account_id)
  on conflict (owner_account_id) do nothing;

  -- Row lock: the close below takes the same lock, so a begin and a close cannot interleave.
  select * into v_gate from public.yorisou_account_mutation_gates
   where owner_account_id = p_owner_account_id for update;

  if v_gate.gate_state <> 'open' then
    raise exception 'account_mutation_denied_gate_%', v_gate.gate_state;
  end if;

  insert into public.yorisou_account_mutation_leases
    (owner_account_id, gate_generation, operation_code, request_nonce_hash, expires_at)
  values
    (p_owner_account_id, v_gate.generation, p_operation_code, left(coalesce(p_request_nonce_hash,''), 64),
     now() + make_interval(secs => p_ttl_seconds))
  returning id into v_lease;

  return jsonb_build_object('leaseId', v_lease, 'generation', v_gate.generation);
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Release. Idempotent, and structurally unable to reopen anything.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_mutation_release(p_lease_id uuid)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  update public.yorisou_account_mutation_leases
     set released_at = coalesce(released_at, now())
   where id = p_lease_id;
  return found;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. Close the gate, then drain.
--
--    Two steps on purpose. Closing stops NEW writers immediately; draining waits for the ones
--    already inside. Erasure may not begin until both are true, which is the whole point: an
--    in-flight writer finishes before its target is destroyed, rather than after.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_close_mutation_gate(p_owner_account_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_gate public.yorisou_account_mutation_gates%rowtype; v_active integer;
begin
  insert into public.yorisou_account_mutation_gates (owner_account_id)
  values (p_owner_account_id)
  on conflict (owner_account_id) do nothing;

  select * into v_gate from public.yorisou_account_mutation_gates
   where owner_account_id = p_owner_account_id for update;

  if v_gate.gate_state = 'open' then
    update public.yorisou_account_mutation_gates
       set gate_state = 'draining', generation = generation + 1, updated_at = now()
     where owner_account_id = p_owner_account_id
    returning * into v_gate;
  end if;

  -- Abandon only what cannot still be executing: expired PLUS the execution grace.
  update public.yorisou_account_mutation_leases
     set drained_at = now()
   where owner_account_id = p_owner_account_id
     and released_at is null
     and drained_at is null
     and expires_at + public.yorisou_account_mutation_execution_grace() < now();

  select count(*) into v_active from public.yorisou_account_mutation_leases
   where owner_account_id = p_owner_account_id
     and released_at is null
     and drained_at is null;

  if v_active = 0 and v_gate.gate_state = 'draining' then
    update public.yorisou_account_mutation_gates
       set gate_state = 'closed', closed_at = now(), updated_at = now()
     where owner_account_id = p_owner_account_id
    returning * into v_gate;
  end if;

  return jsonb_build_object(
    'gateState', v_gate.gate_state,
    'generation', v_gate.generation,
    'activeLeases', v_active,
    'drained', v_active = 0 and v_gate.gate_state = 'closed'
  );
end;
$$;

create or replace function public.yorisou_account_deletion_mutation_gate_status(p_owner_account_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_state text; v_gen integer; v_active integer;
begin
  select gate_state, generation into v_state, v_gen
    from public.yorisou_account_mutation_gates where owner_account_id = p_owner_account_id;
  select count(*) into v_active from public.yorisou_account_mutation_leases
   where owner_account_id = p_owner_account_id and released_at is null and drained_at is null;
  return jsonb_build_object(
    'gateState', coalesce(v_state, 'open'),
    'generation', coalesce(v_gen, 1),
    'activeLeases', v_active
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Record the crossing, and the cursor.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_mark_cursor(
  p_owner_account_id text, p_cursor text, p_irreversible boolean default false
) returns text language plpgsql security definer set search_path = public as $$
begin
  update public.yorisou_account_deletion_jobs
     set execution_cursor = p_cursor,
         irreversible_started_at = case
           when p_irreversible then coalesce(irreversible_started_at, now())
           else irreversible_started_at end,
         mutation_gate_closed_at = case
           when p_cursor = 'locked' then coalesce(mutation_gate_closed_at, now())
           else mutation_gate_closed_at end,
         updated_at = now()
   where owner_account_id = p_owner_account_id;
  return p_cursor;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. At completion the gate stops naming a person, exactly like the deletion job.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_mutation_gate_finalize(p_owner_account_id text)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_fingerprint text;
begin
  v_fingerprint := public.yorisou_account_deletion_fingerprint(p_owner_account_id);
  delete from public.yorisou_account_mutation_leases where owner_account_id = p_owner_account_id;
  update public.yorisou_account_mutation_gates
     set gate_state = 'completed',
         completed_at = now(),
         owner_fingerprint = v_fingerprint,
         owner_account_id = v_fingerprint,
         updated_at = now()
   where owner_account_id = p_owner_account_id;
  return found;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. Grants — service_role only, matching every other governed mutation path.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure::text as sig
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and (p.proname like 'yorisou_account_mutation%'
            or p.proname in ('yorisou_account_deletion_close_mutation_gate',
                             'yorisou_account_deletion_mutation_gate_status',
                             'yorisou_account_deletion_mark_cursor'))
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
