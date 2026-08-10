-- POR-1 WS-G-A — a failed deletion may stop naming the person, without ever claiming it succeeded.
--
-- PREVIEW_ONLY. Forward-only: 202607300003 is applied and immutable.
--
-- THE PROBLEM.
--
-- Six jobs are `failed_terminal` with `account_deletion_manifest_missing`: the account object was
-- already gone and no manifest had been frozen, so `executeDeletion` cannot prove what it would be
-- erasing and correctly refuses to continue. That refusal is right and is not weakened here.
--
-- But the job still carries `owner_account_id`. A person asked to be deleted, the deletion failed,
-- and the failure record keeps naming them — indefinitely, because the state machine had no legal
-- way to stop. The two options were to leave a name in the database forever or to pretend the
-- deletion completed. Both are wrong.
--
-- WHAT THIS ADDS.
--
-- One narrow terminal transition: drop the direct identity, keep the one-way fingerprint, keep the
-- bounded failure reason, and record that de-identification happened and why. The state stays
-- `failed_terminal`.
--
--     FAILED_TERMINAL_DEIDENTIFIED  is NOT  completed
--                                   is NOT  a successful erasure
--                                   is NOT  cancelled
--
-- It means exactly: the requested deletion could not be proven or continued, NO irreversible stage
-- was ever entered, and the failed audit record no longer holds direct identity.
--
-- WHY THE CONSTRAINT IS AMENDED RATHER THAN DROPPED.
--
-- `yorisou_account_deletion_jobs_owner_shape` permitted a null owner ONLY for `completed`. That
-- invariant is doing real work — it is what stops a live job from losing the id every operation
-- looks it up by. So it is not relaxed to "null is fine"; it is extended by exactly one case, and a
-- `failed_terminal` job that has NOT been de-identified must still name its owner.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. The de-identification record.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.yorisou_account_deletion_jobs
  add column if not exists terminal_deidentified_at timestamptz;

alter table public.yorisou_account_deletion_jobs
  add column if not exists terminal_deidentification_reason text;

do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'yorisou_account_deletion_jobs_terminal_deid_reason'
  ) then
    alter table public.yorisou_account_deletion_jobs
      add constraint yorisou_account_deletion_jobs_terminal_deid_reason check (
        terminal_deidentification_reason is null
        or terminal_deidentification_reason in ('manifest_missing_pre_irreversible')
      );
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. The owner-shape invariant, EXTENDED by exactly one case.
--
--    A live job must still know whose account it is. A finished one must not. "Finished" now has two
--    honest forms: a completed erasure, and a terminal failure whose identity has been minimised.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.yorisou_account_deletion_jobs
  drop constraint if exists yorisou_account_deletion_jobs_owner_shape;

alter table public.yorisou_account_deletion_jobs
  add constraint yorisou_account_deletion_jobs_owner_shape check (
    (owner_account_id is null) =
    (state = 'completed' or terminal_deidentified_at is not null)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. What a de-identified terminal record is ALLOWED to be.
--
--    This is the safety net behind the function: even a direct UPDATE cannot manufacture a
--    de-identified record for a job that got as far as destroying something, or for one that is not
--    terminally failed. The transition's eligibility rules are re-expressed here as a table
--    invariant so they cannot be bypassed.
-- ─────────────────────────────────────────────────────────────────────────────
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'yorisou_account_deletion_jobs_terminal_deid_shape'
  ) then
    alter table public.yorisou_account_deletion_jobs
      add constraint yorisou_account_deletion_jobs_terminal_deid_shape check (
        terminal_deidentified_at is null
        or (
          state = 'failed_terminal'
          and owner_account_id is null
          and irreversible_started_at is null
          and terminal_deidentification_reason is not null
          and owner_fingerprint is not null
        )
      );
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. The transition.
--
--    Eligibility is re-evaluated INSIDE the transaction under a row lock. A caller that decided a
--    job was eligible a moment ago is not trusted: the job may have been claimed, resumed, or moved
--    since, and this is the one operation that cannot be undone by re-running it.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_account_deletion_terminal_deidentify(
  p_owner_account_id text,
  p_reason text default 'manifest_missing_pre_irreversible'
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_job public.yorisou_account_deletion_jobs%rowtype;
  v_now timestamptz := now();
  v_has_manifest boolean;
  v_claim_live boolean;
begin
  if p_owner_account_id is null or char_length(p_owner_account_id) = 0 then
    raise exception 'account_deletion_owner_required';
  end if;

  select * into v_job from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id
   for update;

  if not found then
    -- Idempotent: a job already de-identified no longer carries the id, so there is nothing to find
    -- and nothing to do. Reporting this as an error would make a safe repeat look like a fault.
    return jsonb_build_object('deidentified', false, 'outcome', 'absent_or_already_deidentified');
  end if;

  -- ── ELIGIBILITY. Every clause refuses a DIFFERENT way of getting this wrong. ──

  -- Only a terminal failure. A completed job has its own de-identification; anything live is work
  -- in progress and must keep the id every operation looks it up by.
  if v_job.state is distinct from 'failed_terminal' then
    raise exception 'terminal_deidentify_refused_state_%', v_job.state;
  end if;

  -- NOTHING MAY HAVE BEEN DESTROYED. Past the crossing, the job is the only record of what was
  -- erased and for whom; minimising it there would destroy the audit trail of a real deletion.
  if v_job.irreversible_started_at is not null then
    raise exception 'terminal_deidentify_refused_irreversible';
  end if;

  -- The cursor is the second, independent witness to the same question. `irreversible_started_at`
  -- is the recorded fact; a cursor at or past the crossing would contradict it, and a contradiction
  -- is not something to resolve in favour of deleting identity.
  if v_job.execution_cursor is not null
     and public.yorisou_account_deletion_stage_rank(v_job.execution_cursor)
         >= public.yorisou_account_deletion_irreversible_rank() then
    raise exception 'terminal_deidentify_refused_cursor_%', v_job.execution_cursor;
  end if;

  -- A frozen manifest means the job CAN still be resumed, so it must be — resuming is strictly
  -- better than minimising a failure that did not have to be final.
  select exists (select 1 from public.yorisou_account_deletion_manifests where job_id = v_job.id)
    into v_has_manifest;
  if v_has_manifest then
    raise exception 'terminal_deidentify_refused_manifest_present';
  end if;

  -- Someone may be driving it right now.
  v_claim_live := v_job.executor_token_hash is not null
                  and v_job.executor_expires_at is not null
                  and v_job.executor_expires_at > v_now;
  if v_claim_live then
    raise exception 'terminal_deidentify_refused_executor_held';
  end if;

  if p_reason is distinct from 'manifest_missing_pre_irreversible' then
    raise exception 'terminal_deidentify_refused_reason_%', coalesce(p_reason, 'null');
  end if;

  -- ── THE MINIMISATION ────────────────────────────────────────────────────────
  --
  -- The fingerprint stays: it is one-way, it is what the replay and authentication checks already
  -- consult, and it lets this failure still be recognised without naming anyone. `last_error_code`
  -- stays because a failure record that cannot say why it failed is not an audit record.
  update public.yorisou_account_deletion_jobs
     set owner_account_id = null,
         executor_token_hash = null,
         executor_expires_at = null,
         terminal_deidentified_at = v_now,
         terminal_deidentification_reason = p_reason,
         updated_at = v_now
   where id = v_job.id;

  insert into public.yorisou_account_deletion_audit (job_id, stage, outcome, detail)
  values (v_job.id, 'terminal_deidentified', 'ok',
          jsonb_build_object('reason', p_reason, 'from_state', v_job.state));

  return jsonb_build_object('deidentified', true, 'outcome', 'terminal_deidentified');
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Grants — service_role only, exactly like every other governed mutation path.
-- ─────────────────────────────────────────────────────────────────────────────
do $$ begin
  if exists (select 1 from pg_roles where rolname='anon') then
    revoke all on function public.yorisou_account_deletion_terminal_deidentify(text,text) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname='authenticated') then
    revoke all on function public.yorisou_account_deletion_terminal_deidentify(text,text) from authenticated;
  end if;
  grant execute on function public.yorisou_account_deletion_terminal_deidentify(text,text) to service_role;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Asserted against the LIVE definitions, not against this file.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare v_src text;
begin
  select pg_get_functiondef(p.oid) into v_src
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname='public' and p.proname='yorisou_account_deletion_terminal_deidentify';
  if v_src is null then
    raise exception 'POR-1: terminal de-identification function is missing';
  end if;
  if position('irreversible_started_at is not null' in v_src) = 0 then
    raise exception 'POR-1: terminal de-identification no longer refuses a post-crossing job';
  end if;
  if position('for update' in v_src) = 0 then
    raise exception 'POR-1: terminal de-identification no longer locks the row it decides on';
  end if;

  -- The invariant that stops a direct UPDATE from manufacturing this state.
  if not exists (
    select 1 from pg_constraint where conname='yorisou_account_deletion_jobs_terminal_deid_shape'
  ) then
    raise exception 'POR-1: the terminal de-identification shape constraint is missing';
  end if;

  -- And the extended owner-shape rule: a terminal failure that has NOT been minimised must still
  -- name its owner, or the whole recovery model loses its join key.
  if not exists (
    select 1 from pg_constraint where conname='yorisou_account_deletion_jobs_owner_shape'
  ) then
    raise exception 'POR-1: the owner-shape constraint is missing';
  end if;
end $$;
