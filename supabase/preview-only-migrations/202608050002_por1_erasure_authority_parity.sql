-- POR-1 — bring the post-P111 erasure AUTHORITY into the Preview lineage.
--
-- PREVIEW_ONLY. Forward-only. Idempotent.
--
-- WHY THIS EXISTS.
--
-- The exact-SHA hosted acceptance at 108c939 failed one test:
--
--     accountDeletion.spec.ts › POR-1 account deletion lifecycle
--       deletion must complete; stopped at {"error":"deletion_failed"}  — 500
--
-- The application calls the four-argument erasure entry point that 202608010110/111 establish:
--
--     yorisou_account_deletion_erase_database(uuid, text, text, integer)
--
-- Preview only ever had the owner-only `erase_database(text)`, because 109/110/111 are
-- PRODUCTION_LINEAGE and were never applied here. The RPC could not resolve, so the route answered
-- 500. A lineage parity gap, not an application defect.
--
-- WHY NOT JUST RUN 109/110/111 HERE.
--
-- They are Production-lineage migrations carrying Production-only assumptions, and replaying them
-- would mix two histories and leave a Preview state no PREVIEW_ONLY manifest could rebuild. This
-- migration instead establishes the same *authority contract* against live Preview truth, under
-- explicit existence checks.
--
-- WHAT LIVE PREVIEW ACTUALLY HAS (measured before writing this, not assumed):
--
--   * the full deletion lifecycle: jobs, manifests, claim/renew/release, gates, cursor, finalize
--   * the owner-only erase_database(text), whose body is SUBSET-AWARE — it guards every family with
--     to_regclass and handles the two version tables through their parents. That body is the thing
--     worth keeping; it is preserved here as the internal unchecked implementation.
--   * the DCI and YV append-only families ARE present, with no_mutate/no_truncate triggers on
--     daily_state_record_versions, daily_state_history_events, values_assessment_versions and
--     values_assessment_events. So this is the "families present" path: without the governed
--     exception those triggers refuse the erasure, which is exactly the M4 defect 202608010109 was
--     written to resolve.
--   * yorisou_candidate_events is ABSENT in Preview (it carries no user identity and is classified
--     NOT_APPLICABLE_TO_ACCOUNT_ERASURE), so nothing here references it.
--
-- WHAT THIS ESTABLISHES.
--
--   ct_eq                          constant-time text comparison
--   erasure_job_valid(4)           the full authority predicate — exact job, owner, token, generation
--   erasure_authorized(1)          re-derives that authority from durable state for a row's owner
--   erase_database_unchecked(1)    the preserved Preview body, callable by NOBODY
--   erase_database(4)              the only external entry point, service_role only
--   the weak signatures            ABSENT, not merely revoked
--   the append-only triggers       permit a DELETE only while a real erasure is in progress FOR THAT
--                                  ROW'S OWNER, and go on refusing every ordinary mutation
--
-- A transaction-local setting is a SIGNAL, not an authorization: `set_config` is reachable from any
-- SQL a role can run. Nothing here trusts it. `erasure_authorized` re-derives from durable state —
-- job ownership, frozen manifest, irreversible boundary crossed, cursor exactly `database_erasure`,
-- and the caller holding THIS claim at THIS generation, unexpired.

-- ── 1. constant-time comparison ─────────────────────────────────────────────

create or replace function public.yorisou_ct_eq(a text, b text)
returns boolean language plpgsql immutable as $$
declare v_diff int := 0; v_len int; i int;
begin
  if a is null or b is null then return false; end if;
  if length(a) <> length(b) then return false; end if;
  v_len := length(a);
  for i in 1..v_len loop
    v_diff := v_diff | (ascii(substr(a, i, 1)) # ascii(substr(b, i, 1)));
  end loop;
  return v_diff = 0;
end;
$$;

-- ── 2. the authority predicate ──────────────────────────────────────────────

create or replace function public.yorisou_account_erasure_job_valid(
  p_job_id uuid,
  p_owner_account_id text,
  p_executor_token_hash text,
  p_executor_generation integer
) returns boolean language plpgsql stable security definer set search_path = public as $$
declare v_job public.yorisou_account_deletion_jobs%rowtype;
begin
  if p_job_id is null or p_owner_account_id is null then return false; end if;
  if p_executor_token_hash is null or p_executor_generation is null then return false; end if;

  select * into v_job from public.yorisou_account_deletion_jobs where id = p_job_id;
  if not found then return false; end if;

  -- The right job, for the right owner, in a state where erasing is the correct next act.
  if v_job.owner_account_id is distinct from p_owner_account_id then return false; end if;
  if v_job.state not in ('database_erasure', 'failed_retryable') then return false; end if;

  -- Its OWN frozen manifest. A manifest belonging to another job proves nothing about this one.
  if not exists (
    select 1 from public.yorisou_account_deletion_manifests where job_id = v_job.id
  ) then return false; end if;

  -- The decision to destroy is already taken and recorded, and the cursor says database erasure is
  -- the stage actually in progress. A cursor parked anywhere else is not permission.
  if v_job.irreversible_started_at is null then return false; end if;
  if v_job.execution_cursor is distinct from 'database_erasure' then return false; end if;

  -- THE CALLER IS THE CLAIM HOLDER. Not "a claim exists" — this claim, this generation, still live.
  if v_job.executor_token_hash is null then return false; end if;
  if not public.yorisou_ct_eq(v_job.executor_token_hash, p_executor_token_hash) then return false; end if;
  if v_job.executor_generation is distinct from p_executor_generation then return false; end if;
  if v_job.executor_expires_at is null or v_job.executor_expires_at <= now() then return false; end if;

  return true;
end;
$$;

create or replace function public.yorisou_account_erasure_authorized(p_owner_account_id text)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_raw   text := coalesce(current_setting('yorisou.account_erasure_job_id', true), '');
  v_tok   text := coalesce(current_setting('yorisou.account_erasure_executor_token_hash', true), '');
  v_genr  text := coalesce(current_setting('yorisou.account_erasure_executor_generation', true), '');
  v_job_id uuid;
  v_gen    integer;
begin
  if v_raw = '' or v_tok = '' or v_genr = '' then return false; end if;
  begin
    v_job_id := v_raw::uuid;
    v_gen    := v_genr::integer;
  exception when invalid_text_representation then
    return false;   -- the context is not even shaped like an authority
  end;
  return public.yorisou_account_erasure_job_valid(v_job_id, p_owner_account_id, v_tok, v_gen);
end;
$$;

-- ── 3. preserve the Preview body as the internal implementation ─────────────
--
-- The live owner-only function is RENAMED, not rewritten: its subset-aware plan is what makes
-- erasure correct in an environment that does not have every Production family. The rename is
-- guarded — if the live body is not the body this migration was written against, it stops rather
-- than wrapping something unknown in an authority check.

do $$
declare
  v_oid oid;
  v_md5 text;
  k_expected constant text := '4ece4f3e670ef13b673d73fba0a9876c';
begin
  select p.oid into v_oid
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public'
     and p.proname = 'yorisou_account_deletion_erase_database'
     and pg_get_function_identity_arguments(p.oid) = 'p_owner_account_id text';

  if v_oid is null then
    -- Already converted by an earlier run of this migration, or never present.
    if to_regprocedure('public.yorisou_account_deletion_erase_database_unchecked(text)') is null then
      raise exception 'POR-1 parity: neither the weak erase_database(text) nor the unchecked implementation exists; refusing to invent one';
    end if;
    raise notice 'POR-1 parity: weak signature already converted; nothing to rename';
  else
    v_md5 := md5(pg_get_functiondef(v_oid));
    if v_md5 <> k_expected then
      raise exception 'POR-1 parity: live erase_database(text) body % does not match the reviewed baseline %; refusing to wrap an unknown definition', v_md5, k_expected;
    end if;

    if to_regprocedure('public.yorisou_account_deletion_erase_database_unchecked(text)') is not null then
      -- A previous partial run left both; drop the weak external one rather than colliding.
      execute 'drop function public.yorisou_account_deletion_erase_database(text)';
      raise notice 'POR-1 parity: unchecked implementation already present; dropped the weak external signature';
    else
      execute 'alter function public.yorisou_account_deletion_erase_database(text) rename to yorisou_account_deletion_erase_database_unchecked';
      raise notice 'POR-1 parity: preserved the Preview body as erase_database_unchecked(text)';
    end if;
  end if;
end $$;

-- ── 4. the only external entry point ────────────────────────────────────────

create or replace function public.yorisou_account_deletion_erase_database(
  p_job_id uuid,
  p_owner_account_id text,
  p_executor_token_hash text,
  p_executor_generation integer
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_job public.yorisou_account_deletion_jobs%rowtype;
begin
  -- FOR UPDATE first: what is validated and what is destroyed must be one consistent job. Without
  -- the lock a concurrent reclaim could bump the generation between the check and the delete.
  select * into v_job from public.yorisou_account_deletion_jobs where id = p_job_id for update;
  if not found then raise exception 'account_deletion_erase_not_authorized'; end if;

  if not public.yorisou_account_erasure_job_valid(
       p_job_id, p_owner_account_id, p_executor_token_hash, p_executor_generation) then
    -- ONE bounded code for every failing clause. Naming the clause would tell an unauthorised caller
    -- which part of the authority to forge next — wrong token and stale generation must be
    -- indistinguishable from a missing manifest.
    raise exception 'account_deletion_erase_not_authorized';
  end if;

  -- Only now, and only from validated values read out of the locked row.
  perform set_config('yorisou.account_erasure_job_id', p_job_id::text, true);
  perform set_config('yorisou.account_erasure_executor_token_hash', v_job.executor_token_hash, true);
  perform set_config('yorisou.account_erasure_executor_generation', v_job.executor_generation::text, true);

  return public.yorisou_account_deletion_erase_database_unchecked(p_owner_account_id);
end;
$$;

-- ── 4b. the executor claim must return the job id, and the rest of the contract ──
--
-- The application binds erasure to the EXACT job the claim returned; it refuses to run at all if the
-- claim comes back without `job_id` (`account_deletion_claim_without_job_id`), because rediscovering
-- "the job for this owner" at erasure time would be authority by coincidence. Preview's body predates
-- that, so it is brought to the final definition here — same signature, same behaviour on the refusal
-- path, with the full result the caller reads.

create or replace function public.yorisou_account_deletion_executor_claim(
  p_owner_account_id text, p_token_hash text, p_ttl_seconds integer default 90
) returns jsonb language plpgsql security definer set search_path to 'public' as $$
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

  v_cursor := coalesce(v_job.execution_cursor, 'mutation_draining');

  update public.yorisou_account_deletion_jobs
     set executor_token_hash = p_token_hash,
         executor_generation = executor_generation + 1,
         executor_claimed_at = now(),
         executor_expires_at = now() + make_interval(secs => p_ttl_seconds),
         execution_cursor    = v_cursor,
         updated_at          = now()
   where id = v_job.id
  returning * into v_job;

  return jsonb_build_object(
    'claimed', true,
    'job_id', v_job.id,
    'generation', v_job.executor_generation,
    'cursor', v_job.execution_cursor,
    'state', v_job.state,
    'irreversible', v_job.irreversible_started_at is not null,
    'attemptCount', v_job.attempt_count
  );
end;
$$;

-- ── 5. the weak external signatures must be ABSENT, not merely revoked ──────

drop function if exists public.yorisou_account_deletion_erase_database(text);
drop function if exists public.yorisou_account_deletion_erase_database(uuid, text);

-- ── 6. governed exception in the append-only families (the 109 behaviour) ───
--
-- Append-only guarantees the ORDINARY path; it was never a promise to keep content after someone
-- asked to be forgotten. These trigger functions now permit a DELETE only while a real erasure is in
-- progress FOR THAT ROW'S OWNER, re-derived from durable state — and refuse every other mutation
-- exactly as before. Rebuilt with `create or replace` against the live trigger functions, so no
-- trigger is dropped and no table is rewritten.

do $$
begin
  if to_regprocedure('public.yorisou_dci_block_mutation()') is not null then
    execute $fn$
      create or replace function public.yorisou_dci_block_mutation()
      returns trigger language plpgsql security definer set search_path = public as $body$
      declare v_owner text;
      begin
        if tg_op = 'DELETE' then
          -- Owner of the row being deleted. The version table carries it indirectly, through its parent.
          if tg_table_name = 'yorisou_daily_state_record_versions' then
            select r.owner_account_id into v_owner
              from public.yorisou_daily_state_records r where r.id = old.record_id;
          else
            begin
              v_owner := old.owner_account_id;
            exception when undefined_column then
              v_owner := null;
            end;
          end if;

          if v_owner is not null and public.yorisou_account_erasure_authorized(v_owner) then
            return old;   -- a governed erasure, for THIS owner, proven from durable state
          end if;
        end if;

        raise exception 'append_only: % on % is not permitted', tg_op, tg_table_name;
      end;
      $body$;
    $fn$;
  end if;

  if to_regprocedure('public.yorisou_values_block_mutation()') is not null then
    execute $fn$
      create or replace function public.yorisou_values_block_mutation()
      returns trigger language plpgsql security definer set search_path = public as $body$
      declare v_owner text;
      begin
        if tg_op = 'DELETE' then
          if tg_table_name = 'yorisou_values_assessment_versions' then
            select a.owner_account_id into v_owner
              from public.yorisou_values_assessments a where a.id = old.assessment_id;
          else
            begin
              v_owner := old.owner_account_id;
            exception when undefined_column then
              v_owner := null;
            end;
          end if;

          if v_owner is not null and public.yorisou_account_erasure_authorized(v_owner) then
            return old;
          end if;
        end if;

        raise exception 'append_only: % on % is not permitted', tg_op, tg_table_name;
      end;
      $body$;
    $fn$;
  end if;
end $$;

-- ── 7. privileges ───────────────────────────────────────────────────────────

do $$
declare
  v_sig text;
begin
  -- The internal implementation is reachable by NOBODY. Only the wrapper, which is SECURITY DEFINER
  -- and therefore runs as the owner, may call it.
  foreach v_sig in array array[
    'public.yorisou_account_deletion_erase_database_unchecked(p_owner_account_id text)',
    'public.yorisou_account_erasure_job_valid(p_job_id uuid, p_owner_account_id text, p_executor_token_hash text, p_executor_generation integer)',
    'public.yorisou_account_erasure_authorized(p_owner_account_id text)',
    'public.yorisou_ct_eq(a text, b text)'
  ] loop
    execute format('revoke all on function %s from public', v_sig);
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on function %s from anon', v_sig);
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute format('revoke all on function %s from authenticated', v_sig);
    end if;
    -- Supabase default privileges grant service_role EXECUTE directly on creation; omitting a grant
    -- is not the same as withholding one (the defect repaired in 202608010104).
    if exists (select 1 from pg_roles where rolname = 'service_role') then
      execute format('revoke all on function %s from service_role', v_sig);
    end if;
  end loop;

  -- The one external entry point.
  v_sig := 'public.yorisou_account_deletion_erase_database(p_job_id uuid, p_owner_account_id text, p_executor_token_hash text, p_executor_generation integer)';
  execute format('revoke all on function %s from public', v_sig);
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute format('revoke all on function %s from anon', v_sig);
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute format('revoke all on function %s from authenticated', v_sig);
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute format('grant execute on function %s to service_role', v_sig);
  end if;
end $$;

-- ── 8. assert the end state in the transaction that established it ──────────

do $$
declare v_strong oid;
begin
  v_strong := to_regprocedure('public.yorisou_account_deletion_erase_database(uuid,text,text,integer)');
  if v_strong is null then
    raise exception 'POR-1 parity: the four-argument erasure entry point is absent';
  end if;

  if to_regprocedure('public.yorisou_account_deletion_erase_database(text)') is not null then
    raise exception 'POR-1 parity: the owner-only erase signature still exists';
  end if;
  if to_regprocedure('public.yorisou_account_deletion_erase_database(uuid,text)') is not null then
    raise exception 'POR-1 parity: the (job, owner) erase signature still exists';
  end if;
  if to_regprocedure('public.yorisou_account_deletion_erase_database_unchecked(text)') is null then
    raise exception 'POR-1 parity: the internal implementation is absent';
  end if;
  if to_regprocedure('public.yorisou_account_erasure_job_valid(uuid,text,text,integer)') is null then
    raise exception 'POR-1 parity: the authority predicate is absent';
  end if;

  if exists (select 1 from pg_roles where rolname = 'service_role') then
    if not has_function_privilege('service_role', v_strong, 'EXECUTE') then
      raise exception 'POR-1 parity: service_role cannot execute the erasure entry point';
    end if;
    if has_function_privilege('service_role',
         to_regprocedure('public.yorisou_account_deletion_erase_database_unchecked(text)'), 'EXECUTE') then
      raise exception 'POR-1 parity: service_role can execute the UNCHECKED implementation';
    end if;
  end if;

  -- Nothing in the erasure family may be reachable by an unauthenticated or ordinary caller.
  -- PostgREST publishes public-schema functions as RPC under the anon key.
  if exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and (p.proname like 'yorisou_account_erasure%' or p.proname like 'yorisou_account_deletion_erase%')
       and (has_function_privilege('public', p.oid, 'EXECUTE')
            or (exists (select 1 from pg_roles where rolname='anon') and has_function_privilege('anon', p.oid, 'EXECUTE'))
            or (exists (select 1 from pg_roles where rolname='authenticated') and has_function_privilege('authenticated', p.oid, 'EXECUTE')))
       and p.oid <> v_strong
  ) then
    raise exception 'POR-1 parity: an erasure function is executable by PUBLIC, anon or authenticated';
  end if;
  if has_function_privilege('public', v_strong, 'EXECUTE') then
    raise exception 'POR-1 parity: the erasure entry point is executable by PUBLIC';
  end if;
end $$;
