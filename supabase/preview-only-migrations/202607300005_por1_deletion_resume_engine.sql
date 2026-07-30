-- ═════════════════════════════════════════════════════════════════════════════
-- POR-1 — THE DELETION RESUME ENGINE. PREVIEW_ONLY (promoted separately).
--
-- WHY THIS EXISTS.
--
-- 202607300003 gave deletion a durable state machine and 202607300004 gave it a fence. Both were
-- necessary and neither was sufficient, because two things were still true:
--
--   1. `execution_cursor` was WRITTEN and never READ. A retry after `failed_retryable` walked back
--      to `locked` from wherever it had reached, re-ran session revocation, and re-entered stages
--      that had already run. The cursor's own comment called it "the last stage that completed",
--      while the orchestrator wrote it as "the stage we just entered". A field with two meanings is
--      a field with none.
--
--   2. Nothing made the executor single-writer. Two confirm/retry requests arriving together each
--      read the state, each believed it was the only run, and each drove the same saga. The state
--      machine rejects an ILLEGAL transition but happily accepts the same LEGAL one twice.
--
-- So this migration replaces inference with authority.
--
-- THE CURSOR HAS EXACTLY ONE MEANING:
--
--     execution_cursor = THE NEXT STAGE THAT MUST EXECUTE
--
-- Not the last one that finished; not something derived from the state string. A retryable failure
-- PRESERVES it, and a retry executes it directly. `failed_retryable` becomes what it always should
-- have been — a note about the previous attempt, never an instruction about where to resume.
--
-- THE EXECUTOR IS A SINGLE WRITER. A bounded claim (token hash + generation + expiry) is required
-- to move the cursor at all, and every step transition validates ownership, generation, the expected
-- current cursor, the legal next cursor, the mutation-lease invariant and irreversibility TOGETHER,
-- in one statement, under a row lock. Two concurrent runs cannot execute the same stage because only
-- one of them holds the claim, and the loser is told so rather than proceeding in parallel.
--
-- IRREVERSIBILITY IS A RECORDED FACT. `irreversible_started_at` is set exactly once, at the moment
-- the mutation gate is proven closed and drained and before the first destructive action. After
-- that: cancellation is denied, the cursor cannot move backwards, and no retry can clear it.
--
-- THE MANIFEST MAKES LATER STAGES POSSIBLE. Erasure destroys the record that names everything the
-- account owns, so the identifiers needed after that point are frozen into a bounded, immutable
-- manifest BEFORE the crossing. Later stages read the manifest; they never reread the deleted
-- account. Hashes and stable ids only — no raw password, cookie, email or LINE id.
--
-- Content-free by construction throughout: ids, hashes, bounded codes, counts and timestamps.
-- ═════════════════════════════════════════════════════════════════════════════

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. THE CURSOR, RESTATED.
--
--    The 202607300004 constraint encoded the old vocabulary and the old meaning. It is replaced
--    rather than extended, because leaving the old values legal would leave the old meaning legal.
--    Two stages that were previously implicit become explicit: `lock_marker` (the account hold) and
--    `session_revocation` (the first destructive act) were both hidden inside "locked", which is
--    precisely why a retry could replay them.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.yorisou_account_deletion_jobs
  drop constraint if exists yorisou_account_deletion_jobs_cursor_check;

-- Existing in-flight Preview jobs carry the OLD vocabulary. They are translated conservatively:
-- forward to the next stage that must run, and never back through a stage that writes identity.
-- `locked` becomes `session_revocation`, not `lock_marker` — the hold has already been placed, and
-- re-placing it is the read-modify-upsert that resurrected an erased account once already.
update public.yorisou_account_deletion_jobs
   set execution_cursor = case execution_cursor
         when 'identity_verified' then 'mutation_draining'
         when 'mutation_draining' then 'mutation_draining'
         when 'locked'            then 'session_revocation'
         when 'database_erasure'  then 'database_erasure'
         when 'storage_erasure'   then 'storage_erasure'
         when 'identity_erasure'  then 'identity_erasure'
         when 'verifying'         then 'verifying'
         else execution_cursor
       end
 where execution_cursor is not null;

alter table public.yorisou_account_deletion_jobs
  add constraint yorisou_account_deletion_jobs_cursor_check
  check (execution_cursor is null or execution_cursor in (
    'mutation_draining','lock_marker','session_revocation','database_erasure',
    'storage_erasure','identity_erasure','verifying','finalizing','completed'
  ));

comment on column public.yorisou_account_deletion_jobs.execution_cursor is
  'THE NEXT STAGE THAT MUST EXECUTE. Not the last completed one, and never inferred from the state '
  'string. A retryable failure preserves it; a retry executes it directly.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. THE EXECUTOR CLAIM.
--
--    Bounded on purpose. A claim that never expires turns one crashed worker into a permanently
--    undeletable account; a claim with no generation lets a worker that stalled past its expiry
--    wake up and write as though it were still current. Both are covered: expiry frees the job, and
--    the generation bump makes the stale holder's next call fail rather than succeed late.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.yorisou_account_deletion_jobs
  add column if not exists executor_token_hash  text,
  add column if not exists executor_generation  integer not null default 0,
  add column if not exists executor_claimed_at  timestamptz,
  add column if not exists executor_expires_at  timestamptz;

do $$
begin
  if not exists (select 1 from pg_constraint
                  where conname = 'yorisou_account_deletion_jobs_executor_shape') then
    alter table public.yorisou_account_deletion_jobs
      add constraint yorisou_account_deletion_jobs_executor_shape
      check (
        executor_generation >= 0
        and (executor_token_hash is null or char_length(executor_token_hash) between 32 and 128)
      );
  end if;
end $$;

comment on column public.yorisou_account_deletion_jobs.executor_token_hash is
  'sha256 of the executor token. The raw token never leaves the running process, so a leaked row '
  'cannot be replayed as a claim.';
comment on column public.yorisou_account_deletion_jobs.executor_generation is
  'Bumped on every claim. A step from an older generation is refused, so a worker that stalled past '
  'its expiry cannot write late.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. THE INJECTED CLOCK.
--
--    Two of the required proofs are about the EXECUTION GRACE — that an expired-but-in-grace lease
--    still blocks, and that the same lease drains once the grace has passed. Proving those by
--    sleeping 180 real seconds is not a proof, it is a delay that happens to pass; it would also be
--    the slowest test in the suite and the first one anybody deleted.
--
--    So time is injectable, through a session-local setting that defaults to zero and is bounded.
--    Nothing in the application sets it. Reaching it at all requires service_role, which can already
--    do anything this function could be abused to do.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_mutation_clock()
returns timestamptz language plpgsql stable set search_path = public as $$
declare v_raw text; v_skew interval;
begin
  v_raw := current_setting('yorisou.deletion_clock_skew_seconds', true);
  if v_raw is null or v_raw = '' then return now(); end if;
  v_skew := make_interval(secs => least(greatest(v_raw::numeric, 0), 86400));
  return now() + v_skew;
end;
$$;

comment on function public.yorisou_account_mutation_clock() is
  'now(), plus a bounded session-local skew used ONLY by the grace-period proofs. Unset in every '
  'deployed environment, so it is exactly now().';

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. THE EXPANDED OPERATION CODE SET.
--
--    The fence only covers what it can name. The original seven codes were the paths known at the
--    time; the audit that followed found six more places where an account-linked write happens —
--    registration, LINE primary provisioning, password-reset issuance, session binding, and the two
--    foundation write paths. A write with no code cannot take a lease, and a write that cannot take
--    a lease is a hole in the fence exactly its own width.
--
--    Still a CLOSED set. An arbitrary string here would turn a bounded audit into free text and let
--    a new caller invent a code instead of being reviewed into the list.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.yorisou_account_mutation_leases
  drop constraint if exists yorisou_account_mutation_leases_operation_code_check;

alter table public.yorisou_account_mutation_leases
  add constraint yorisou_account_mutation_leases_operation_code_check
  check (operation_code in (
    'support_profile_update','password_update','line_binding',
    'account_profile_update','identity_mirror_sync',
    'session_identity_upgrade','account_recovery',
    'account_registration','line_primary_provisioning','password_reset_issue',
    'session_account_binding','foundation_profile_update','foundation_identity_binding'
  ));

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. THE DURABLE TARGET MANIFEST.
--
--    Written once, before the crossing, and never updated. After the primary identity is gone there
--    is nothing left to enumerate FROM — a later stage that tried to reread the account would find
--    nothing and would report "nothing to erase", which is indistinguishable from success and is the
--    most dangerous possible failure mode for a deletion.
--
--    Bounded and hash-only. Keys and stable ids are enough to delete by; a raw password, cookie,
--    email address or LINE id is not needed and is therefore not kept.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_account_deletion_manifests (
  job_id       uuid primary key references public.yorisou_account_deletion_jobs(id) on delete cascade,
  contract_version text not null default 'por1-manifest-v1',
  payload      jsonb not null,
  created_at   timestamptz not null default now(),
  constraint yorisou_account_deletion_manifests_bounded
    check (pg_column_size(payload) <= 65536)
);

alter table public.yorisou_account_deletion_manifests enable row level security;
alter table public.yorisou_account_deletion_manifests force row level security;
revoke all on table public.yorisou_account_deletion_manifests from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname='anon') then
    revoke all on table public.yorisou_account_deletion_manifests from anon; end if;
  if exists (select 1 from pg_roles where rolname='authenticated') then
    revoke all on table public.yorisou_account_deletion_manifests from authenticated; end if;
  if exists (select 1 from pg_roles where rolname='service_role') then
    grant select on table public.yorisou_account_deletion_manifests to service_role; end if;
end $$;

comment on table public.yorisou_account_deletion_manifests is
  'Frozen before irreversibility. Every stage after identity erasure reads this instead of the '
  'account record, which by then does not exist.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. STAGE ORDER.
--
--    One place, one ordering. Every legality question below reduces to integer arithmetic on this
--    function, so "is that transition legal?" cannot be answered differently in two callers.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_stage_rank(p_stage text)
returns integer language sql immutable set search_path = public as $$
  select case p_stage
    when 'mutation_draining'  then 1
    when 'lock_marker'        then 2
    when 'session_revocation' then 3
    when 'database_erasure'   then 4
    when 'storage_erasure'    then 5
    when 'identity_erasure'   then 6
    when 'verifying'          then 7
    when 'finalizing'         then 8
    when 'completed'          then 9
    else null
  end;
$$;

-- The stage at which the account stops being writable and starts being destroyed. Everything from
-- here on requires a proven-drained gate.
create or replace function public.yorisou_account_deletion_irreversible_rank()
returns integer language sql immutable as $$ select 2 $$;   -- lock_marker

-- The coarse saga state implied by a cursor. `state` predates the cursor and is still what the
-- fence, the authentication lock and the status surface read, so the two are moved together and
-- can never disagree.
create or replace function public.yorisou_account_deletion_state_for_cursor(p_cursor text)
returns text language sql immutable set search_path = public as $$
  select case p_cursor
    when 'mutation_draining'  then 'identity_verified'
    when 'lock_marker'        then 'locked'
    when 'session_revocation' then 'locked'
    when 'database_erasure'   then 'database_erasure'
    when 'storage_erasure'    then 'storage_erasure'
    when 'identity_erasure'   then 'identity_erasure'
    when 'verifying'          then 'verifying'
    when 'finalizing'         then 'verifying'
    when 'completed'          then 'completed'
    else null
  end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. CLAIM.
--
--    Refused while another executor's claim is live. Granted when there is no claim, when the
--    previous one has expired, or when the SAME executor re-presents its token — a worker that
--    retries inside its own claim is not a second writer.
--
--    Claiming also ADOPTS the job: a job that has never run gets its cursor initialised to the first
--    stage, so the cursor is authoritative from the very first step rather than from the second.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_executor_claim(
  p_owner_account_id text,
  p_token_hash       text,
  p_ttl_seconds      integer default 90
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_job public.yorisou_account_deletion_jobs%rowtype; v_cursor text;
begin
  if p_owner_account_id is null or char_length(p_owner_account_id) = 0 then
    raise exception 'account_deletion_owner_required';
  end if;
  if p_token_hash is null or char_length(p_token_hash) < 32 then
    raise exception 'account_deletion_executor_token_required';
  end if;
  if p_ttl_seconds is null or p_ttl_seconds < 5 or p_ttl_seconds > 600 then
    raise exception 'account_deletion_executor_ttl_out_of_range';
  end if;

  select * into v_job from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id for update;
  if not found then raise exception 'account_deletion_job_not_found'; end if;

  if v_job.state in ('completed','cancelled','failed_terminal','legal_hold') then
    raise exception 'account_deletion_not_claimable_%', v_job.state;
  end if;

  -- Someone else is driving, and their claim has not lapsed.
  if v_job.executor_token_hash is not null
     and v_job.executor_token_hash <> p_token_hash
     and v_job.executor_expires_at is not null
     and v_job.executor_expires_at > now() then
    return jsonb_build_object(
      'claimed', false,
      'reason', 'executor_already_claimed',
      'generation', v_job.executor_generation,
      'cursor', v_job.execution_cursor,
      'irreversible', v_job.irreversible_started_at is not null
    );
  end if;

  -- First run of a job that has only been opened and verified.
  v_cursor := coalesce(v_job.execution_cursor, 'mutation_draining');

  update public.yorisou_account_deletion_jobs
     set executor_token_hash = p_token_hash,
         -- Bumped on EVERY claim, including a re-claim by the same executor: a token is not a
         -- generation, and a stale in-flight step from an earlier claim must fail even when the
         -- worker that issued it is the one claiming now.
         executor_generation = executor_generation + 1,
         executor_claimed_at = now(),
         executor_expires_at = now() + make_interval(secs => p_ttl_seconds),
         execution_cursor    = v_cursor,
         updated_at          = now()
   where id = v_job.id
  returning * into v_job;

  return jsonb_build_object(
    'claimed', true,
    'generation', v_job.executor_generation,
    'cursor', v_job.execution_cursor,
    'state', v_job.state,
    'irreversible', v_job.irreversible_started_at is not null,
    'attemptCount', v_job.attempt_count
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. RENEW / RELEASE.
--
--    Renew exists because a long erasure must not lose its claim to its own slowness. Release exists
--    so a finished or failed run frees the job immediately rather than after the TTL — a person
--    retrying should not have to wait out a lease held by a request that already returned.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_executor_renew(
  p_owner_account_id text, p_token_hash text, p_generation integer, p_ttl_seconds integer default 90
) returns boolean language plpgsql security definer set search_path = public as $$
declare v_rows integer;
begin
  if p_ttl_seconds is null or p_ttl_seconds < 5 or p_ttl_seconds > 600 then
    raise exception 'account_deletion_executor_ttl_out_of_range';
  end if;
  update public.yorisou_account_deletion_jobs
     set executor_expires_at = now() + make_interval(secs => p_ttl_seconds), updated_at = now()
   where owner_account_id = p_owner_account_id
     and executor_token_hash = p_token_hash
     and executor_generation = p_generation
     and executor_expires_at > now();
  get diagnostics v_rows = row_count;
  return v_rows = 1;
end;
$$;

create or replace function public.yorisou_account_deletion_executor_release(
  p_owner_account_id text, p_token_hash text, p_generation integer
) returns boolean language plpgsql security definer set search_path = public as $$
declare v_rows integer;
begin
  -- The generation is NOT bumped here. Releasing is giving the job back, not invalidating the next
  -- holder before they exist; the bump belongs to the claim.
  update public.yorisou_account_deletion_jobs
     set executor_token_hash = null, executor_expires_at = null, updated_at = now()
   where owner_account_id = p_owner_account_id
     and executor_token_hash = p_token_hash
     and executor_generation = p_generation;
  get diagnostics v_rows = row_count;
  return v_rows = 1;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. THE SHARED GUARD.
--
--    Every cursor-moving operation asks the same four questions, so they are asked in ONE place.
--    Locks the row and returns it; the caller then writes under that lock.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_require_executor(
  p_owner_account_id text, p_token_hash text, p_generation integer
) returns public.yorisou_account_deletion_jobs
language plpgsql security definer set search_path = public as $$
declare v_job public.yorisou_account_deletion_jobs%rowtype;
begin
  select * into v_job from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id for update;
  if not found then raise exception 'account_deletion_job_not_found'; end if;

  if v_job.executor_token_hash is null or v_job.executor_token_hash <> p_token_hash then
    raise exception 'account_deletion_executor_not_owner';
  end if;
  if v_job.executor_generation <> p_generation then
    raise exception 'account_deletion_executor_stale_generation';
  end if;
  if v_job.executor_expires_at is null or v_job.executor_expires_at <= now() then
    raise exception 'account_deletion_executor_lease_expired';
  end if;
  return v_job;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. DRAIN AND CLOSE, UNDER THE CLAIM.
--
--     202607300004 could close the gate for anybody who asked. Now only the owning executor may,
--     and the abandonment comparison runs against the injectable clock so the grace can be proven
--     rather than waited out.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_drain_gate(
  p_owner_account_id text, p_token_hash text, p_generation integer
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_job public.yorisou_account_deletion_jobs%rowtype;
        v_gate public.yorisou_account_mutation_gates%rowtype;
        v_active integer;
begin
  v_job := public.yorisou_account_deletion_require_executor(p_owner_account_id, p_token_hash, p_generation);

  insert into public.yorisou_account_mutation_gates (owner_account_id)
  values (p_owner_account_id) on conflict (owner_account_id) do nothing;

  select * into v_gate from public.yorisou_account_mutation_gates
   where owner_account_id = p_owner_account_id for update;

  if v_gate.gate_state = 'open' then
    update public.yorisou_account_mutation_gates
       set gate_state = 'draining', generation = generation + 1, updated_at = now()
     where owner_account_id = p_owner_account_id
    returning * into v_gate;
  end if;

  -- Abandon ONLY what cannot still be executing: expired PLUS the full execution grace. An expired
  -- lease inside the grace still blocks, because expiry proves the TTL elapsed, not that the process
  -- holding it has stopped running.
  update public.yorisou_account_mutation_leases
     set drained_at = now()
   where owner_account_id = p_owner_account_id
     and released_at is null
     and drained_at is null
     and expires_at + public.yorisou_account_mutation_execution_grace()
         < public.yorisou_account_mutation_clock();

  select count(*) into v_active from public.yorisou_account_mutation_leases
   where owner_account_id = p_owner_account_id
     and released_at is null and drained_at is null;

  if v_active = 0 and v_gate.gate_state = 'draining' then
    update public.yorisou_account_mutation_gates
       set gate_state = 'closed', closed_at = now(), updated_at = now()
     where owner_account_id = p_owner_account_id
    returning * into v_gate;
  end if;

  if v_gate.gate_state = 'closed' and v_active = 0 then
    update public.yorisou_account_deletion_jobs
       set mutation_gate_closed_at = coalesce(mutation_gate_closed_at, now()), updated_at = now()
     where id = v_job.id;
  end if;

  return jsonb_build_object(
    'gateState',  v_gate.gate_state,
    'generation', v_gate.generation,
    'activeLeases', v_active,
    'drained', v_active = 0 and v_gate.gate_state = 'closed'
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. FREEZE THE MANIFEST.
--
--     Only before the crossing, and only once. A manifest that could be rewritten mid-erasure would
--     be a way to redirect a deletion at a different account.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_manifest_put(
  p_owner_account_id text, p_token_hash text, p_generation integer, p_payload jsonb
) returns boolean language plpgsql security definer set search_path = public as $$
declare v_job public.yorisou_account_deletion_jobs%rowtype;
begin
  v_job := public.yorisou_account_deletion_require_executor(p_owner_account_id, p_token_hash, p_generation);

  if v_job.irreversible_started_at is not null then
    raise exception 'account_deletion_manifest_frozen';
  end if;
  if p_payload is null or jsonb_typeof(p_payload) <> 'object' then
    raise exception 'account_deletion_manifest_invalid';
  end if;

  insert into public.yorisou_account_deletion_manifests (job_id, payload)
  values (v_job.id, p_payload)
  on conflict (job_id) do nothing;   -- immutable: a second write is a no-op, never an overwrite
  return true;
end;
$$;

create or replace function public.yorisou_account_deletion_manifest_get(p_job_id uuid)
returns jsonb language sql security definer stable set search_path = public as $$
  select payload from public.yorisou_account_deletion_manifests where job_id = p_job_id;
$$;

-- A manifest is still reachable after the account id is gone: by then the fingerprint is the only
-- name the job has.
create or replace function public.yorisou_account_deletion_manifest_for_owner(p_owner_account_id text)
returns jsonb language sql security definer stable set search_path = public as $$
  select m.payload
    from public.yorisou_account_deletion_manifests m
    join public.yorisou_account_deletion_jobs j on j.id = m.job_id
   where j.owner_account_id = p_owner_account_id
      or j.owner_fingerprint = public.yorisou_account_deletion_fingerprint(p_owner_account_id)
   limit 1;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. COMPLETE A STEP. THE ONLY WAY THE CURSOR MOVES FORWARD.
--
--     Six invariants, one statement, one row lock:
--
--       executor ownership     — the caller holds the claim
--       executor generation    — the claim is the current one, not a stale revival
--       expected current cursor— the caller executed the stage the job is actually on
--       legal next cursor      — exactly one stage forward; never backwards, never a skip
--       mutation-lease         — past the crossing, the gate is closed and no lease is outstanding
--       irreversible invariant — set once at the crossing, never cleared, never re-set
--
--     `p_expected_cursor` is what makes two concurrent runs safe even in the impossible case where
--     both somehow hold a claim: the second one's expectation no longer matches, and it is refused
--     rather than executing the same stage again.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_complete_step(
  p_owner_account_id text,
  p_token_hash       text,
  p_generation       integer,
  p_expected_cursor  text,
  p_next_cursor      text,
  p_detail           jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_job     public.yorisou_account_deletion_jobs%rowtype;
  v_from    integer;
  v_to      integer;
  v_gate    public.yorisou_account_mutation_gates%rowtype;
  v_active  integer;
  v_crossing boolean;
  v_state   text;
begin
  v_job := public.yorisou_account_deletion_require_executor(p_owner_account_id, p_token_hash, p_generation);

  if v_job.execution_cursor is distinct from p_expected_cursor then
    raise exception 'account_deletion_cursor_mismatch_expected_%_actual_%',
      p_expected_cursor, coalesce(v_job.execution_cursor, 'null');
  end if;

  v_from := public.yorisou_account_deletion_stage_rank(p_expected_cursor);
  v_to   := public.yorisou_account_deletion_stage_rank(p_next_cursor);
  if v_from is null or v_to is null then
    raise exception 'account_deletion_unknown_stage';
  end if;
  -- Exactly one forward. A skip would mark work done that never ran; a backward move would replay a
  -- stage that has already written — which is how an erased identity came back.
  if v_to <> v_from + 1 then
    raise exception 'account_deletion_illegal_cursor_%_to_%', p_expected_cursor, p_next_cursor;
  end if;

  v_crossing := v_to >= public.yorisou_account_deletion_irreversible_rank();

  -- THE MUTATION-LEASE INVARIANT. Anything at or past the crossing requires a gate that is closed
  -- with nothing outstanding — re-checked at EVERY step, not just at the crossing, because a lease
  -- taken after the close would otherwise sit unnoticed alongside a running erasure.
  if v_crossing then
    select * into v_gate from public.yorisou_account_mutation_gates
     where owner_account_id = p_owner_account_id;
    if not found or v_gate.gate_state not in ('closed','completed') then
      raise exception 'account_deletion_gate_not_closed';
    end if;
    select count(*) into v_active from public.yorisou_account_mutation_leases
     where owner_account_id = p_owner_account_id
       and released_at is null and drained_at is null;
    if v_active > 0 then
      raise exception 'account_deletion_gate_not_drained_%', v_active;
    end if;
  end if;

  -- The crossing itself also demands the manifest, because every stage after it depends on one.
  if v_to = public.yorisou_account_deletion_irreversible_rank() then
    if not exists (select 1 from public.yorisou_account_deletion_manifests where job_id = v_job.id) then
      raise exception 'account_deletion_manifest_missing';
    end if;
  end if;

  v_state := public.yorisou_account_deletion_state_for_cursor(p_next_cursor);

  update public.yorisou_account_deletion_jobs
     set execution_cursor = p_next_cursor,
         -- Set ONCE, at the crossing. `coalesce` is the whole guarantee: no later step and no retry
         -- can move it, and nothing can clear it.
         irreversible_started_at = case
           when v_crossing then coalesce(irreversible_started_at, now())
           else irreversible_started_at end,
         state = coalesce(v_state, state),
         locked_at = case when p_next_cursor = 'lock_marker' then coalesce(locked_at, now()) else locked_at end,
         -- A successful step clears the previous attempt's error. The attempt COUNT is kept: it is
         -- the history of the job, not the status of this run.
         last_error_code = null,
         updated_at = now()
   where id = v_job.id
  returning * into v_job;

  insert into public.yorisou_account_deletion_audit (job_id, stage, outcome, detail)
  values (v_job.id, p_next_cursor, 'ok',
          jsonb_build_object('from', p_expected_cursor, 'generation', p_generation)
          || coalesce(p_detail, '{}'::jsonb));

  return jsonb_build_object(
    'cursor', v_job.execution_cursor,
    'state', v_job.state,
    'irreversible', v_job.irreversible_started_at is not null
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 13. RECORD A RETRYABLE ERROR — WITHOUT MOVING THE CURSOR.
--
--     This is the correction that the whole migration exists for. The old path advanced the STATE to
--     `failed_retryable`, and the retry then inferred a resume point from that state — which is how
--     a run that failed at verification restarted from `locked`. Here the cursor is deliberately
--     untouched: the next attempt executes exactly the stage that failed.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_record_retryable_error(
  p_owner_account_id text, p_token_hash text, p_generation integer, p_error_code text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_job public.yorisou_account_deletion_jobs%rowtype;
begin
  v_job := public.yorisou_account_deletion_require_executor(p_owner_account_id, p_token_hash, p_generation);

  update public.yorisou_account_deletion_jobs
     set state           = 'failed_retryable',
         last_error_code = left(coalesce(p_error_code, 'unknown'), 80),
         attempt_count   = attempt_count + 1,
         -- execution_cursor is NOT touched. That is the point.
         updated_at      = now()
   where id = v_job.id
  returning * into v_job;

  insert into public.yorisou_account_deletion_audit (job_id, stage, outcome, detail)
  values (v_job.id, coalesce(v_job.execution_cursor, 'unknown'), 'failed',
          jsonb_build_object('retryable', true, 'generation', p_generation));

  return jsonb_build_object(
    'cursor', v_job.execution_cursor,
    'attemptCount', v_job.attempt_count,
    'irreversible', v_job.irreversible_started_at is not null
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 14. FINALIZE, AS A CURSOR STEP.
--
--     Finalization has to be one atomic act. 202607300003's `finalize` nulls `owner_account_id`,
--     which is the key every other operation looks the job up by — so a separate "now move the
--     cursor" call afterwards could not find the row it had just finished. Verification, the state
--     change, the cursor move and the loss of the identifier therefore happen together or not at all.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_finalize_step(
  p_owner_account_id text, p_token_hash text, p_generation integer
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_job public.yorisou_account_deletion_jobs%rowtype; v_left jsonb;
begin
  v_job := public.yorisou_account_deletion_require_executor(p_owner_account_id, p_token_hash, p_generation);

  if v_job.execution_cursor is distinct from 'finalizing' then
    raise exception 'account_deletion_cursor_mismatch_expected_finalizing_actual_%',
      coalesce(v_job.execution_cursor, 'null');
  end if;

  v_left := public.yorisou_account_deletion_verify_database(p_owner_account_id);
  if v_left <> '{}'::jsonb then
    update public.yorisou_account_deletion_jobs
       set state='failed_retryable', last_error_code='verification_residue',
           attempt_count = attempt_count + 1, updated_at = now()
     where id = v_job.id;      -- cursor preserved: the retry re-runs finalizing, nothing earlier
    insert into public.yorisou_account_deletion_audit (job_id, stage, outcome, detail)
    values (v_job.id, 'finalizing', 'failed', jsonb_build_object('residue', v_left));
    return jsonb_build_object('completed', false, 'residue', v_left);
  end if;

  update public.yorisou_account_deletion_jobs
     set state = 'completed',
         execution_cursor = 'completed',
         owner_account_id = null,
         completed_at = now(),
         executor_token_hash = null,
         executor_expires_at = null,
         updated_at = now()
   where id = v_job.id;

  insert into public.yorisou_account_deletion_audit (job_id, stage, outcome)
  values (v_job.id, 'completed', 'ok');

  return jsonb_build_object('completed', true);
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 15. RESUME VIEW. What a retry needs, in one read.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_resume_state(p_owner_account_id text)
returns jsonb language plpgsql security definer stable set search_path = public as $$
declare v_job public.yorisou_account_deletion_jobs%rowtype; v_now timestamptz := now();
begin
  select * into v_job from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id;
  if not found then return jsonb_build_object('state', 'none'); end if;

  return jsonb_build_object(
    'state', v_job.state,
    'cursor', v_job.execution_cursor,
    'irreversible', v_job.irreversible_started_at is not null,
    'attemptCount', v_job.attempt_count,
    'lastErrorCode', v_job.last_error_code,
    'executorHeld', v_job.executor_token_hash is not null
                    and v_job.executor_expires_at is not null
                    and v_job.executor_expires_at > v_now,
    'executorGeneration', v_job.executor_generation,
    'hasManifest', exists (select 1 from public.yorisou_account_deletion_manifests where job_id = v_job.id)
  );
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 16. CLOSE THE OLD DOOR.
--
--     `yorisou_account_deletion_advance` can still move a job through the erasure states, which
--     would bypass every invariant above. Once the engine owns a job (its cursor is set), advance is
--     restricted to the outcomes the engine does not own: failure, cancellation and legal hold. And
--     cancellation past the crossing is refused outright — there is nothing left to cancel, and
--     saying otherwise would tell someone their data still exists when it does not.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_advance(
  p_owner_account_id text, p_to text, p_error_code text default null
) returns text language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_from text; v_cursor text; v_irreversible timestamptz; v_ok boolean;
begin
  select id, state, execution_cursor, irreversible_started_at
    into v_id, v_from, v_cursor, v_irreversible
    from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id
   for update;
  if not found then raise exception 'account_deletion_job_not_found'; end if;

  -- The engine owns forward motion. Anything else is a bypass, and a bypass is how the invariants
  -- above become decorative.
  if v_cursor is not null
     and p_to not in ('failed_retryable','failed_terminal','cancelled','legal_hold') then
    raise exception 'account_deletion_advance_superseded_by_cursor';
  end if;

  if p_to = 'cancelled' and v_irreversible is not null then
    raise exception 'account_deletion_irreversible';
  end if;

  v_ok := case
    when p_to = 'identity_verified' then v_from in ('requested','failed_retryable')
    when p_to = 'locked'            then v_from in ('identity_verified','failed_retryable')
    when p_to = 'database_erasure'  then v_from in ('locked','failed_retryable','database_erasure')
    when p_to = 'storage_erasure'   then v_from in ('database_erasure','failed_retryable','storage_erasure')
    when p_to = 'identity_erasure'  then v_from in ('storage_erasure','failed_retryable','identity_erasure')
    when p_to = 'verifying'         then v_from in ('identity_erasure','failed_retryable','verifying')
    when p_to = 'failed_retryable'  then v_from not in ('completed','cancelled','failed_terminal','legal_hold')
    when p_to = 'failed_terminal'   then v_from not in ('completed','cancelled')
    when p_to = 'cancelled'         then v_from in ('requested','identity_verified')
    when p_to = 'legal_hold'        then v_from in ('requested','identity_verified','locked')
    else false
  end;

  if not v_ok then
    raise exception 'account_deletion_illegal_transition_%_to_%', v_from, p_to;
  end if;

  update public.yorisou_account_deletion_jobs
     set state           = p_to,
         verified_at     = case when p_to='identity_verified' then now() else verified_at end,
         locked_at       = case when p_to='locked'            then now() else locked_at   end,
         cancelled_at    = case when p_to='cancelled'         then now() else cancelled_at end,
         -- Reaching `identity_verified` is the moment the engine takes over, so the cursor is
         -- initialised here rather than on first claim. A job with a cursor is a job the engine owns.
         execution_cursor = case
           when p_to = 'identity_verified' then coalesce(execution_cursor, 'mutation_draining')
           else execution_cursor end,
         last_error_code = case when p_to like 'failed%' then left(coalesce(p_error_code,'unknown'), 80) else null end,
         attempt_count   = case when p_to like 'failed%' then attempt_count + 1 else attempt_count end,
         updated_at      = now()
   where id = v_id;

  insert into public.yorisou_account_deletion_audit (job_id, stage, outcome, detail)
  values (v_id, p_to, case when p_to like 'failed%' then 'failed' else 'ok' end,
          jsonb_build_object('from', v_from));
  return p_to;
end;
$$;

-- `mark_cursor` was 202607300004's unguarded cursor writer: no executor, no expected value, no
-- legality check. Leaving it callable would leave a way to move the cursor around every invariant in
-- section 12, so it is retired in place rather than left as a loaded footgun. Retired, not dropped —
-- dropping it would break the applied migration's grant loop on re-run.
create or replace function public.yorisou_account_deletion_mark_cursor(
  p_owner_account_id text, p_cursor text, p_irreversible boolean default false
) returns text language plpgsql security definer set search_path = public as $$
begin
  raise exception 'account_deletion_mark_cursor_retired_use_complete_step';
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 17. THE LEASE GATE, RESTATED AGAINST THE CURSOR.
--
--     202607300004 denied a lease on a list of state strings. The cursor is now the authority, so
--     the denial follows it — otherwise a job sitting in `failed_retryable` mid-erasure would look
--     "not in an erasing state" and a lease would be granted against a half-deleted account.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_mutation_begin(
  p_owner_account_id text,
  p_operation_code   text,
  p_ttl_seconds      integer default 30,
  p_request_nonce_hash text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_gate  public.yorisou_account_mutation_gates%rowtype;
  v_job   public.yorisou_account_deletion_jobs%rowtype;
  v_lease uuid;
begin
  if p_owner_account_id is null or char_length(p_owner_account_id) = 0 then
    raise exception 'account_mutation_owner_required';
  end if;
  if p_ttl_seconds is null or p_ttl_seconds < 1 or p_ttl_seconds > 120 then
    raise exception 'account_mutation_ttl_out_of_range';
  end if;

  select * into v_job from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id
      or owner_fingerprint = public.yorisou_account_deletion_fingerprint(p_owner_account_id)
   limit 1;

  if found then
    if v_job.state = 'completed' then
      raise exception 'account_mutation_denied_deleted';
    end if;
    -- The recorded FACT first — it survives any state string, including `failed_retryable`.
    if v_job.irreversible_started_at is not null then
      raise exception 'account_mutation_denied_erasing';
    end if;
    if v_job.execution_cursor is not null
       and public.yorisou_account_deletion_stage_rank(v_job.execution_cursor)
           >= public.yorisou_account_deletion_irreversible_rank() then
      raise exception 'account_mutation_denied_erasing';
    end if;
    if v_job.state in ('locked','database_erasure','storage_erasure','identity_erasure','verifying') then
      raise exception 'account_mutation_denied_erasing';
    end if;
  end if;

  insert into public.yorisou_account_mutation_gates (owner_account_id)
  values (p_owner_account_id) on conflict (owner_account_id) do nothing;

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
-- 18. Grants — service_role only, exactly as every other governed mutation path.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare r record;
begin
  for r in
    select p.oid::regprocedure::text as sig
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and (p.proname like 'yorisou_account_deletion_%' or p.proname like 'yorisou_account_mutation%')
  loop
    execute format('revoke all on function %s from public', r.sig);
    if exists (select 1 from pg_roles where rolname='anon') then
      execute format('revoke all on function %s from anon', r.sig); end if;
    if exists (select 1 from pg_roles where rolname='authenticated') then
      execute format('revoke all on function %s from authenticated', r.sig); end if;
    if exists (select 1 from pg_roles where rolname='service_role') then
      execute format('grant execute on function %s to service_role', r.sig); end if;
  end loop;
end $$;

commit;
