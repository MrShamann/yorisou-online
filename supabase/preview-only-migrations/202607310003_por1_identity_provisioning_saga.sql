-- ═════════════════════════════════════════════════════════════════════════════
-- POR-1 — IDENTITY PROVISIONING SAGA.
--
-- WHY THIS EXISTS.
--
-- `app/api/auth/register/route.ts` has TWO false-success paths, and both end in a 200:
--
--     if (!deterministicPrincipal.ok) { console.error(...) }      ← logged, then continues
--     catch (foundationError)         { console.error(...) }      ← logged, then continues
--
-- After either one the route binds a session, sets authenticated cookies and returns success. A 200
-- from registration is therefore not a statement that the account exists in canonical form; it is a
-- statement that the legacy record was written and that we tried the rest. The person is logged in
-- as a principal with no UserProfile and no email AuthIdentity — able to hold a session, unable to
-- be found by the identity graph — and nothing in the product will ever notice, because the one
-- moment that could have noticed reported success.
--
-- Repairing the swallow alone is not enough. Once the response is honest, the failure becomes a
-- 5xx on a multi-write operation with no record of how far it got, so a retry either duplicates the
-- account or gives up. The honest answer and the resumable one have to arrive together.
--
-- THE SAGA.
--
--   • ONE durable row per registration INTENT, keyed by a digest of the normalized email. A retry of
--     the same registration finds the same saga; it does not open a second one and cannot create a
--     second account. "One normalized email → one active principal" is therefore the PRIMARY KEY,
--     not a check someone remembered to write.
--   • ONE authoritative cursor, meaning exactly what the deletion engine's means: THE NEXT STEP THAT
--     MUST EXECUTE. Not "the last step that completed" — a field with two meanings is a field with
--     none, and that ambiguity is what let a deletion replay a stage it had already performed.
--   • SINGLE WRITER, by the same bounded claim the deletion executor uses: token hash, generation,
--     expiry. Two concurrent registration requests cannot drive one saga; the second is told so.
--   • Every transition validates SIX things in one statement under a row lock: executor ownership,
--     executor generation, the expected current cursor, a legal next cursor, the state's terminality,
--     and the account binding's immutability.
--
-- WHAT IT STORES. A digest of the email, the account id while it lives, a content-free owner
-- fingerprint, a session fingerprint, a bounded failure class and operational timestamps. No raw
-- password, no cookie, no request body, no email address, no provider secret. The failure class is a
-- closed enum precisely so a future caller cannot use it as a place to put a message.
--
-- WHAT IT IS NOT. It is not an authorization to write. Provisioning still runs under the account
-- mutation fence, which is what makes "registration racing deletion" a decided order rather than a
-- race — this saga records WHERE a registration got to, and the fence decides WHETHER it may write.
-- ═════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Cursor and state vocabulary.
--
--    Ranked, and movement is restricted to exactly one step forward. A saga that failed at
--    verification must not resume from session binding: re-binding a session is a write, and
--    replaying a write is how a resumable process becomes a duplicating one.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_provisioning_stage_rank(p_stage text)
returns integer language sql immutable set search_path = public as $$
  select case p_stage
    when 'account_creation'   then 1
    when 'canonical_identity' then 2
    when 'session_binding'    then 3
    when 'verification'       then 4
    when 'finalizing'         then 5
    when 'completed'          then 6
    else null end;
$$;

-- The state is DERIVED from the cursor, never set independently. Two fields that must agree are two
-- fields that will eventually disagree; here the public state is a function of the private cursor.
create or replace function public.yorisou_provisioning_state_for_cursor(p_cursor text)
returns text language sql immutable set search_path = public as $$
  select case p_cursor
    when 'account_creation'   then 'requested'
    when 'canonical_identity' then 'account_created'
    when 'session_binding'    then 'canonical_identity_created'
    -- Verification is READ-ONLY, so reaching it changes nothing about what exists: both it and
    -- finalizing describe a saga whose session is bound and whose completeness is unproven.
    when 'verification'       then 'session_bound'
    when 'finalizing'         then 'session_bound'
    when 'completed'          then 'completed'
    else null end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. The saga table.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_identity_provisioning_sagas (
  -- sha256('por1-provisioning:v1:' || normalized email). The intent identity, derived by the SERVER
  -- from a normalized value — never from a client-supplied idempotency field, which an attacker
  -- chooses and a broken client repeats.
  provisioning_key     text primary key,
  account_id           text unique,
  owner_fingerprint    text,
  session_fingerprint  text,
  state                text not null default 'requested',
  provisioning_cursor  text not null default 'account_creation',
  contract_version     text not null default 'por1-v1',
  attempt_count        integer not null default 0 check (attempt_count >= 0),
  failure_class        text,
  last_error_code      text check (last_error_code is null or char_length(last_error_code) <= 80),
  executor_token_hash  text,
  executor_generation  integer not null default 0,
  executor_claimed_at  timestamptz,
  executor_expires_at  timestamptz,
  requested_at         timestamptz not null default now(),
  completed_at         timestamptz,
  updated_at           timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'yorisou_provisioning_key_digest_check') then
    alter table public.yorisou_identity_provisioning_sagas
      add constraint yorisou_provisioning_key_digest_check
      check (provisioning_key ~ '^[0-9a-f]{64}$');
  end if;

  -- Fingerprints, not identifiers. A raw email or session id would not match.
  if not exists (select 1 from pg_constraint where conname = 'yorisou_provisioning_owner_digest_check') then
    alter table public.yorisou_identity_provisioning_sagas
      add constraint yorisou_provisioning_owner_digest_check
      check (owner_fingerprint is null or owner_fingerprint ~ '^[0-9a-f]{64}$');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'yorisou_provisioning_session_digest_check') then
    alter table public.yorisou_identity_provisioning_sagas
      add constraint yorisou_provisioning_session_digest_check
      check (session_fingerprint is null or session_fingerprint ~ '^[0-9a-f]{64}$');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'yorisou_provisioning_state_check') then
    alter table public.yorisou_identity_provisioning_sagas
      add constraint yorisou_provisioning_state_check
      check (state in ('requested','account_created','canonical_identity_created','session_bound',
                       'completed','failed_retryable','failed_terminal'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'yorisou_provisioning_cursor_check') then
    alter table public.yorisou_identity_provisioning_sagas
      add constraint yorisou_provisioning_cursor_check
      check (public.yorisou_provisioning_stage_rank(provisioning_cursor) is not null);
  end if;

  -- A CLOSED failure vocabulary. Deliberately an enum and not free text: a failure field that
  -- accepts anything becomes the place a future caller writes an exception message, and an exception
  -- message is where the email address ends up.
  if not exists (select 1 from pg_constraint where conname = 'yorisou_provisioning_failure_class_check') then
    alter table public.yorisou_identity_provisioning_sagas
      add constraint yorisou_provisioning_failure_class_check
      check (failure_class is null or failure_class in (
        'account_write_failed',
        'email_already_registered',
        'canonical_identity_failed',
        'foundation_transport_failed',
        'session_binding_failed',
        'verification_incomplete',
        'mutation_fence_denied',
        'account_absent_after_creation',
        'executor_lost',
        'unclassified'
      ));
  end if;

  -- A completed saga names an account and has nowhere left to go.
  if not exists (select 1 from pg_constraint where conname = 'yorisou_provisioning_completed_shape_check') then
    alter table public.yorisou_identity_provisioning_sagas
      add constraint yorisou_provisioning_completed_shape_check
      check (
        state <> 'completed'
        or (provisioning_cursor = 'completed' and account_id is not null
            and owner_fingerprint is not null and completed_at is not null)
      );
  end if;

  -- Past account creation the account id is a FACT. Enforced here because the one way this saga
  -- could create two accounts is by forgetting which one it already made.
  if not exists (select 1 from pg_constraint where conname = 'yorisou_provisioning_account_bound_check') then
    alter table public.yorisou_identity_provisioning_sagas
      add constraint yorisou_provisioning_account_bound_check
      check (
        public.yorisou_provisioning_stage_rank(provisioning_cursor) < 2
        or state in ('failed_terminal')
        or account_id is not null
      );
  end if;
end $$;

create index if not exists yorisou_provisioning_state_idx
  on public.yorisou_identity_provisioning_sagas (state);
create index if not exists yorisou_provisioning_cursor_idx
  on public.yorisou_identity_provisioning_sagas (provisioning_cursor);
create index if not exists yorisou_provisioning_owner_idx
  on public.yorisou_identity_provisioning_sagas (owner_fingerprint)
  where owner_fingerprint is not null;

alter table public.yorisou_identity_provisioning_sagas enable row level security;
alter table public.yorisou_identity_provisioning_sagas force row level security;

do $$
begin
  revoke all on table public.yorisou_identity_provisioning_sagas from public;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table public.yorisou_identity_provisioning_sagas from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table public.yorisou_identity_provisioning_sagas from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant select on table public.yorisou_identity_provisioning_sagas to service_role';
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Open or resume, and CLAIM.
--
--    The single entry point. It returns everything the executor needs to decide what to do next and
--    nothing it does not: the cursor, the generation, the account id if one exists, and whether it
--    holds the claim. It never returns the email digest back to the caller that supplied it.
--
--    An expired claim is TAKEN OVER rather than waited for, and the generation is bumped on EVERY
--    claim — including a re-claim by the same token. A token is not a generation: a step still
--    in flight from a previous claim must fail even when the same process retries.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_provisioning_open(
  p_provisioning_key text,
  p_token_hash       text,
  p_ttl_seconds      integer default 90
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_saga   public.yorisou_identity_provisioning_sagas%rowtype;
  v_locked boolean := false;
begin
  if p_provisioning_key is null or p_provisioning_key !~ '^[0-9a-f]{64}$' then
    raise exception 'provisioning_key_must_be_sha256_hex';
  end if;
  if p_token_hash is null or char_length(p_token_hash) < 32 then
    raise exception 'provisioning_executor_token_required';
  end if;
  if p_ttl_seconds is null or p_ttl_seconds < 5 or p_ttl_seconds > 600 then
    raise exception 'provisioning_executor_ttl_out_of_range';
  end if;

  -- Lock-or-create. The re-select after a lost insert race is not optional: `on conflict` returns no
  -- row, and proceeding without the lock is how two requests both believe they opened the saga.
  for i in 1..2 loop
    select * into v_saga from public.yorisou_identity_provisioning_sagas
     where provisioning_key = p_provisioning_key for update;
    if found then v_locked := true; exit; end if;
    begin
      insert into public.yorisou_identity_provisioning_sagas (provisioning_key) values (p_provisioning_key);
    exception when unique_violation then
      null;  -- a concurrent opener won; loop once more and LOCK its row
    end;
  end loop;
  if not v_locked then raise exception 'provisioning_saga_unavailable'; end if;

  -- Already done. A retry of a registration that succeeded is not a second registration; it is the
  -- same one, and it is finished. This is what makes "the response was lost" resolvable.
  if v_saga.state = 'completed' then
    return jsonb_build_object(
      'outcome', 'completed', 'claimed', false,
      'cursor', v_saga.provisioning_cursor, 'state', v_saga.state,
      'generation', v_saga.executor_generation, 'accountId', v_saga.account_id
    );
  end if;

  if v_saga.state = 'failed_terminal' then
    return jsonb_build_object(
      'outcome', 'failed_terminal', 'claimed', false,
      'cursor', v_saga.provisioning_cursor, 'state', v_saga.state,
      'failureClass', v_saga.failure_class, 'accountId', v_saga.account_id
    );
  end if;

  -- Someone else is driving and their claim has not lapsed. Two concurrent registrations for one
  -- email do not both proceed; the second is told the truth about why it is waiting.
  if v_saga.executor_token_hash is not null
     and v_saga.executor_token_hash <> p_token_hash
     and v_saga.executor_expires_at is not null
     and v_saga.executor_expires_at > now() then
    return jsonb_build_object(
      'outcome', 'in_progress', 'claimed', false,
      'cursor', v_saga.provisioning_cursor, 'state', v_saga.state,
      'generation', v_saga.executor_generation
    );
  end if;

  update public.yorisou_identity_provisioning_sagas
     set executor_token_hash = p_token_hash,
         executor_generation = v_saga.executor_generation + 1,
         executor_claimed_at = now(),
         executor_expires_at = now() + make_interval(secs => p_ttl_seconds),
         attempt_count       = v_saga.attempt_count + 1,
         -- A retryable failure is a note about the PREVIOUS attempt, never an instruction about
         -- where to start. The cursor is deliberately untouched.
         state               = case when v_saga.state = 'failed_retryable'
                                    then public.yorisou_provisioning_state_for_cursor(v_saga.provisioning_cursor)
                                    else v_saga.state end,
         updated_at          = now()
   where provisioning_key = p_provisioning_key;

  return jsonb_build_object(
    'outcome', 'claimed', 'claimed', true,
    'cursor', v_saga.provisioning_cursor,
    'state', public.yorisou_provisioning_state_for_cursor(v_saga.provisioning_cursor),
    'generation', v_saga.executor_generation + 1,
    'accountId', v_saga.account_id,
    'attemptCount', v_saga.attempt_count + 1,
    'resumed', v_saga.provisioning_cursor <> 'account_creation'
  );
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Advance exactly one stage.
--
--    Six validations, one statement, one row lock. `p_expected_cursor` is what makes two concurrent
--    executors safe: the second one's expectation no longer matches, so it is refused rather than
--    repeating a completed stage.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_provisioning_complete_step(
  p_provisioning_key    text,
  p_token_hash          text,
  p_generation          integer,
  p_expected_cursor     text,
  p_next_cursor         text,
  p_account_id          text default null,
  p_owner_fingerprint   text default null,
  p_session_fingerprint text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_saga public.yorisou_identity_provisioning_sagas%rowtype;
  v_next_state text;
begin
  select * into v_saga from public.yorisou_identity_provisioning_sagas
   where provisioning_key = p_provisioning_key for update;
  if not found then raise exception 'provisioning_saga_not_found'; end if;

  if v_saga.state in ('completed','failed_terminal') then
    raise exception 'provisioning_terminal_%', v_saga.state;
  end if;
  if v_saga.executor_token_hash is distinct from p_token_hash then
    raise exception 'provisioning_executor_mismatch';
  end if;
  if v_saga.executor_generation is distinct from p_generation then
    raise exception 'provisioning_executor_generation_stale';
  end if;
  if v_saga.provisioning_cursor is distinct from p_expected_cursor then
    raise exception 'provisioning_cursor_mismatch';
  end if;
  if public.yorisou_provisioning_stage_rank(p_next_cursor)
     is distinct from public.yorisou_provisioning_stage_rank(p_expected_cursor) + 1 then
    raise exception 'provisioning_cursor_illegal_transition';
  end if;

  -- The account binding is written once and is then immutable. A saga that changed which account it
  -- belonged to could bind a session to one account and complete another.
  if p_account_id is not null and v_saga.account_id is not null
     and v_saga.account_id is distinct from p_account_id then
    raise exception 'provisioning_account_rebind_refused';
  end if;

  v_next_state := public.yorisou_provisioning_state_for_cursor(p_next_cursor);

  update public.yorisou_identity_provisioning_sagas
     set provisioning_cursor = p_next_cursor,
         state               = v_next_state,
         account_id          = coalesce(v_saga.account_id, p_account_id),
         owner_fingerprint   = coalesce(v_saga.owner_fingerprint, p_owner_fingerprint),
         session_fingerprint = coalesce(p_session_fingerprint, v_saga.session_fingerprint),
         failure_class       = null,
         last_error_code     = null,
         completed_at        = case when v_next_state = 'completed' then now() else v_saga.completed_at end,
         updated_at          = now()
   where provisioning_key = p_provisioning_key;

  return jsonb_build_object(
    'cursor', p_next_cursor, 'state', v_next_state,
    'accountId', coalesce(v_saga.account_id, p_account_id)
  );
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Record a failure. The cursor is PRESERVED, deliberately.
--
--    `failed_retryable` says what happened last time. It does not say where to resume — that is the
--    cursor's job, and the two must never be confused. This is the exact rule the deletion engine
--    arrived at, for the exact reason: inferring a resume point from a failure state is what let a
--    run that failed at verification walk back through a stage that writes identity.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_provisioning_record_failure(
  p_provisioning_key text,
  p_token_hash       text,
  p_generation       integer,
  p_failure_class    text,
  p_error_code       text default null,
  p_terminal         boolean default false
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_saga public.yorisou_identity_provisioning_sagas%rowtype;
begin
  select * into v_saga from public.yorisou_identity_provisioning_sagas
   where provisioning_key = p_provisioning_key for update;
  if not found then raise exception 'provisioning_saga_not_found'; end if;
  if v_saga.state = 'completed' then
    -- A completed provisioning cannot be un-completed by a late failure report from a lost attempt.
    return jsonb_build_object('state', v_saga.state, 'cursor', v_saga.provisioning_cursor);
  end if;
  if v_saga.executor_token_hash is distinct from p_token_hash
     or v_saga.executor_generation is distinct from p_generation then
    raise exception 'provisioning_executor_mismatch';
  end if;

  update public.yorisou_identity_provisioning_sagas
     set state           = case when p_terminal then 'failed_terminal' else 'failed_retryable' end,
         failure_class   = p_failure_class,
         last_error_code = left(coalesce(p_error_code, ''), 80),
         -- Released, so the retry does not have to outlive the TTL to take over.
         executor_token_hash = null,
         executor_expires_at = null,
         updated_at      = now()
   where provisioning_key = p_provisioning_key;

  return jsonb_build_object(
    'state', case when p_terminal then 'failed_terminal' else 'failed_retryable' end,
    'cursor', v_saga.provisioning_cursor
  );
end $$;

-- Abandon a saga that never created anything.
--
-- The case: someone attempts to register an address that is ALREADY registered. The saga opened,
-- created nothing, and has no account bound. Recording that as `failed_terminal` and leaving the row
-- behind would be two bugs at once — it would make that address permanently unregisterable even
-- after the real owner deletes their account, and it would leave a row that the access gate reads as
-- "this email has an incomplete registration".
--
-- Refuses when an account IS bound. A saga past account creation owns something, and deleting the
-- only record of what it owns is how a partial account becomes invisible instead of resumable.
create or replace function public.yorisou_provisioning_abandon(
  p_provisioning_key text,
  p_token_hash       text,
  p_generation       integer
) returns boolean language plpgsql security definer set search_path = public as $$
declare v_saga public.yorisou_identity_provisioning_sagas%rowtype; v_rows int;
begin
  select * into v_saga from public.yorisou_identity_provisioning_sagas
   where provisioning_key = p_provisioning_key for update;
  if not found then return false; end if;
  if v_saga.account_id is not null then
    raise exception 'provisioning_abandon_refused_account_bound';
  end if;
  if v_saga.executor_token_hash is distinct from p_token_hash
     or v_saga.executor_generation is distinct from p_generation then
    raise exception 'provisioning_executor_mismatch';
  end if;

  delete from public.yorisou_identity_provisioning_sagas
   where provisioning_key = p_provisioning_key and account_id is null;
  get diagnostics v_rows = row_count;
  return v_rows > 0;
end $$;

-- Release the claim without moving the cursor — the ordinary end of an attempt that neither
-- completed nor failed (a process shutting down cleanly).
create or replace function public.yorisou_provisioning_release(
  p_provisioning_key text,
  p_token_hash       text,
  p_generation       integer
) returns boolean language plpgsql security definer set search_path = public as $$
declare v_rows int;
begin
  update public.yorisou_identity_provisioning_sagas
     set executor_token_hash = null, executor_expires_at = null, updated_at = now()
   where provisioning_key = p_provisioning_key
     and executor_token_hash = p_token_hash
     and executor_generation = p_generation
     and state not in ('completed','failed_terminal');
  get diagnostics v_rows = row_count;
  return v_rows > 0;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Reads. Bounded, content-free, and never an account-existence oracle: every one of these is
--    service-role only and none is reachable from a request path.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_provisioning_status(p_provisioning_key text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'found', count(*) > 0,
    'state', max(state), 'cursor', max(provisioning_cursor),
    'accountId', max(account_id), 'failureClass', max(failure_class),
    'attemptCount', max(attempt_count), 'generation', max(executor_generation)
  )
  from public.yorisou_identity_provisioning_sagas
  where provisioning_key = p_provisioning_key;
$$;

-- Operator audit. Counts only — how many partial identities exist and why. No key, no account id,
-- no digest: an operator needs to know that eleven registrations are stuck at canonical identity,
-- not which eleven people they are.
create or replace function public.yorisou_provisioning_partial_inventory()
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) from (
    select state, provisioning_cursor as cursor, failure_class, count(*)::int as count
      from public.yorisou_identity_provisioning_sagas
     where state <> 'completed'
     group by state, provisioning_cursor, failure_class
     order by state, provisioning_cursor, failure_class
  ) t;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Deletion integration.
--
--    A partial provisioning row is account-linked state, so governed account deletion must remove
--    it. Two addresses, because both are needed: by account id while the account still exists, and
--    by owner fingerprint afterwards — the deletion job drops the raw id at the crossing, and the
--    manifest keeps only the fingerprint.
--
--    Removing the row also releases the email. A person who deletes their account must be able to
--    register again; leaving a completed saga behind would make the email permanently unusable, and
--    a saga row keyed by an email digest that outlives the account is itself residue.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_provisioning_purge_for_owner(
  p_account_id        text default null,
  p_owner_fingerprint text default null
) returns int language plpgsql security definer set search_path = public as $$
declare v_rows int;
begin
  if p_account_id is null and p_owner_fingerprint is null then
    raise exception 'provisioning_purge_target_required';
  end if;
  delete from public.yorisou_identity_provisioning_sagas
   where (p_account_id is not null and account_id = p_account_id)
      or (p_owner_fingerprint is not null and owner_fingerprint = p_owner_fingerprint);
  get diagnostics v_rows = row_count;
  return v_rows;
end $$;

-- Residue probe for deletion verification. Counted, never inferred from absence in a stale read.
create or replace function public.yorisou_provisioning_residue(
  p_account_id        text default null,
  p_owner_fingerprint text default null
) returns int language sql stable security definer set search_path = public as $$
  select count(*)::int from public.yorisou_identity_provisioning_sagas
   where (p_account_id is not null and account_id = p_account_id)
      or (p_owner_fingerprint is not null and owner_fingerprint = p_owner_fingerprint);
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
         'yorisou_provisioning_stage_rank',
         'yorisou_provisioning_state_for_cursor',
         'yorisou_provisioning_open',
         'yorisou_provisioning_complete_step',
         'yorisou_provisioning_record_failure',
         'yorisou_provisioning_release',
         'yorisou_provisioning_abandon',
         'yorisou_provisioning_status',
         'yorisou_provisioning_partial_inventory',
         'yorisou_provisioning_purge_for_owner',
         'yorisou_provisioning_residue'
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
-- 9. Post-condition.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare v_missing text;
begin
  if to_regclass('public.yorisou_identity_provisioning_sagas') is null then
    raise exception 'POR-1: yorisou_identity_provisioning_sagas was not created';
  end if;

  select string_agg(want, ', ') into v_missing
    from unnest(array[
      'yorisou_provisioning_stage_rank','yorisou_provisioning_state_for_cursor',
      'yorisou_provisioning_open','yorisou_provisioning_complete_step',
      'yorisou_provisioning_record_failure','yorisou_provisioning_release',
      'yorisou_provisioning_abandon',
      'yorisou_provisioning_status','yorisou_provisioning_partial_inventory',
      'yorisou_provisioning_purge_for_owner','yorisou_provisioning_residue'
    ]) as want
   where not exists (
     select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = want
   );
  if v_missing is not null then
    raise exception 'POR-1: identity provisioning functions missing: %', v_missing;
  end if;

  if not exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relname = 'yorisou_identity_provisioning_sagas'
       and c.relrowsecurity and c.relforcerowsecurity
  ) then
    raise exception 'POR-1: RLS is not enabled AND forced on yorisou_identity_provisioning_sagas';
  end if;

  -- Every cursor must map to a state, or a legal transition could land the saga in a state that no
  -- consumer knows how to read.
  if exists (
    select 1 from unnest(array['account_creation','canonical_identity','session_binding',
                               'verification','finalizing','completed']) c
     where public.yorisou_provisioning_state_for_cursor(c) is null
  ) then
    raise exception 'POR-1: a provisioning cursor has no state mapping';
  end if;
end $$;
