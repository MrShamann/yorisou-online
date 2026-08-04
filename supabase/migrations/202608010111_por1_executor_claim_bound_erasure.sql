-- POR-1 — the exact job was not enough: the caller must own the job's CURRENT executor claim.
--
-- WHAT 110 CLOSED, AND WHAT IT LEFT OPEN.
--
-- Migration 110 bound erasure to an exact job id and revalidated that job under a row lock. That
-- removed authority-by-owner. But the claim clause it added asked only whether SOME claim existed
-- and had not expired. It never asked whether the CALLER was the holder of that claim.
--
-- So three real races stayed open, and none of them are prevented by owner_account_id being unique:
--
--   worker A holds a live claim; worker B knows the owner and the job id, and calls erasure anyway.
--     B's call satisfied "a claim exists and is unexpired" — A's claim.
--
--   a claim is reclaimed and the generation increments; a call issued under the OLD generation is
--     still in flight and lands afterwards. The token still matches. The claim is still live. The
--     caller is a worker that has already been superseded.
--
--   code that never claimed at all reaches the owner-only overload, which had no claim argument to
--     check and so could not have checked one.
--
-- The job is exact. The executor was not. This migration makes the executor exact too, by requiring
-- the caller to present the job's current executor_token_hash AND its current executor_generation.
--
-- WHY GENERATION AS WELL AS TOKEN.
--
-- A token alone is insufficient because a re-claim by the SAME worker keeps the token and bumps the
-- generation — that is deliberate in 106, so that a step still in flight from an earlier claim
-- cannot land. Checking only the token would readmit exactly the request that bump exists to reject.
-- A generation alone is insufficient because it is a small integer any caller can guess.
--
-- WHAT IS DELIBERATELY REMOVED.
--
-- The owner-only and (job, owner) erasure entry points are DROPPED, not merely revoked. They cannot
-- prove executor authority — they have no argument to prove it with — and leaving an irreversible
-- capability reachable through a weaker signature makes the strong one decorative. The prior
-- rationale that an older client might fall back to them does not hold: no old client runs an
-- account-deletion executor in Production, so no compatibility path needs irreversible deletion.

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. A comparison that does not leak its answer through timing.
-- ─────────────────────────────────────────────────────────────────────────────
--
-- The values compared are already digests, not raw secrets, and an attacker who can call this
-- function can also call it a great many times. Postgres has no built-in constant-time compare, so
-- this one accumulates the whole difference and never exits early. Length is compared directly:
-- these are fixed-width hex digests, so a length is not information about the value.
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

revoke all on function public.yorisou_ct_eq(text, text) from public;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. The full authority predicate: exact job AND exact executor.
-- ─────────────────────────────────────────────────────────────────────────────
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

  -- The job is the right job, for the right owner, in a state where erasing is the correct next act.
  if v_job.owner_account_id is distinct from p_owner_account_id then return false; end if;
  if v_job.state not in ('database_erasure', 'failed_retryable') then return false; end if;

  -- Its own frozen manifest — a manifest belonging to a different job proves nothing about this one.
  if not exists (
    select 1 from public.yorisou_account_deletion_manifests where job_id = v_job.id
  ) then return false; end if;

  -- The decision to destroy has already been taken and recorded, and the cursor says destruction of
  -- the database is the stage actually in progress. A cursor parked anywhere else is not permission.
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

revoke all on function public.yorisou_account_erasure_job_valid(uuid, text, text, integer) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.yorisou_account_erasure_job_valid(uuid, text, text, integer) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.yorisou_account_erasure_job_valid(uuid, text, text, integer) from authenticated;
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. The trigger's view: the same predicate, from transaction-local context.
-- ─────────────────────────────────────────────────────────────────────────────
--
-- The append-only triggers run BELOW the erasure RPC and must reach the same verdict. They read the
-- three context values the RPC set after it locked and validated the job. Forging the job id alone
-- is now insufficient; so is forging the job id with a wrong token or a superseded generation.
--
-- The token in context is a hash, not a raw executor secret. It is still never logged, returned, or
-- written to evidence.
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

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. The one externally callable erasure entry point.
-- ─────────────────────────────────────────────────────────────────────────────
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

revoke all on function public.yorisou_account_deletion_erase_database(uuid, text, text, integer) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.yorisou_account_deletion_erase_database(uuid, text, text, integer) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.yorisou_account_deletion_erase_database(uuid, text, text, integer) from authenticated;
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    grant execute on function public.yorisou_account_deletion_erase_database(uuid, text, text, integer) to service_role;
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Remove every weaker way in.
-- ─────────────────────────────────────────────────────────────────────────────
--
-- Dropped, not revoked. A revoked function is one GRANT away from being live again, and these two
-- signatures CANNOT be made safe — neither takes an executor token, so neither can prove the caller
-- holds the claim. The two-argument predicate goes with them for the same reason: it returns true
-- for a request that the four-argument predicate refuses.
drop function if exists public.yorisou_account_deletion_erase_database(text);
drop function if exists public.yorisou_account_deletion_erase_database(uuid, text);
drop function if exists public.yorisou_account_erasure_job_valid(uuid, text);

-- The unchecked body survives, because the validated wrapper needs something to call. It must not be
-- reachable from outside — including by service_role, which is the role the application connects as.
revoke all on function public.yorisou_account_deletion_erase_database_unchecked(text) from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function public.yorisou_account_deletion_erase_database_unchecked(text) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    revoke all on function public.yorisou_account_deletion_erase_database_unchecked(text) from authenticated;
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    revoke all on function public.yorisou_account_deletion_erase_database_unchecked(text) from service_role;
  end if;
end $$;

-- Same treatment for the family-erasure helper: it is an internal step of the validated path.
do $$ begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    revoke all on function public.yorisou_account_erase_append_only_families(text, uuid) from service_role;
  end if;
end $$;

comment on function public.yorisou_account_deletion_erase_database(uuid, text, text, integer) is
  'POR-1: the ONLY externally callable database erasure. Requires the exact job AND the caller to hold that job''s current executor claim — token hash and generation both. A live claim held by someone else is not authority.';
comment on function public.yorisou_ct_eq(text, text) is
  'POR-1: equality without early exit, for comparing executor token digests.';

commit;
