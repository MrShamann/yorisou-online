-- POR-1 — opening a deletion job is a SELECT-then-INSERT, and the index is the serialization point.
--
-- PREVIEW_ONLY. Forward-only: `202607300003` is applied and immutable, so the function is redefined
-- here rather than edited there.
--
-- THE DEFECT.
--
-- `yorisou_account_deletion_open` looks the job up by owner and inserts when it finds none:
--
--     select id, state into v_id, v_state from ... where owner_account_id = p_owner_account_id;
--     if found then ... return v_id; end if;
--     insert into ... values (p_owner_account_id, ...);
--
-- `select ... for update` cannot lock a row that does not exist yet, and this select does not even
-- ask for a lock. Two concurrent confirms for one person therefore BOTH find nothing — each other's
-- insert is uncommitted and invisible — and both insert. `owner_account_id` is UNIQUE, so the loser
-- gets a raw `23505`, which reaches the confirm route as an unclassified error and is answered 500.
--
-- Observed hosted: the second executor answered 500 while the first deletion was succeeding. The
-- acceptance property asserts an adversary must be ANSWERED, not faulted, and that is why.
--
-- THIS IS THE SAME SHAPE, FOR THE FOURTH TIME IN THIS PACKAGE — `identity_link` (202607310005) was
-- the third. Every one of them is a read-then-write against a unique index where the read cannot
-- see an uncommitted sibling. The index is the only thing that can serialize them, so the repair is
-- always the same: let it, then INTERPRET what it says.
--
-- NOT `on conflict do nothing`. That would swallow the outcome instead of reading it, and the two
-- outcomes are not the same: a concurrent open by the SAME owner is a no-op that must return the
-- winner's job, while a legal-hold or terminally-failed job must still refuse. `do nothing` returns
-- no row and the caller cannot tell those apart.

create or replace function public.yorisou_account_deletion_open(p_owner_account_id text)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_state text;
begin
  if p_owner_account_id is null or char_length(p_owner_account_id) = 0 then
    raise exception 'account_deletion_owner_required';
  end if;

  select id, state into v_id, v_state
    from public.yorisou_account_deletion_jobs
   where owner_account_id = p_owner_account_id
   for update;

  if found then
    if v_state = 'legal_hold'      then raise exception 'account_deletion_legal_hold'; end if;
    if v_state = 'failed_terminal' then raise exception 'account_deletion_failed_terminal'; end if;
    -- A cancelled job may be reopened; anything else in flight is simply returned.
    if v_state = 'cancelled' then
      update public.yorisou_account_deletion_jobs
         set state='requested', cancelled_at=null, last_error_code=null, updated_at=now()
       where id = v_id;
    end if;
    return v_id;
  end if;

  begin
    insert into public.yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint)
    values (p_owner_account_id, public.yorisou_account_deletion_fingerprint(p_owner_account_id))
    returning id into v_id;

    insert into public.yorisou_account_deletion_audit (job_id, stage, outcome)
    values (v_id, 'requested', 'ok');
    return v_id;
  exception when unique_violation then
    -- The index serialized us. Re-read under a lock: by now the winner has committed, so this is a
    -- genuine read of their row and not a second guess at the race.
    select id, state into v_id, v_state
      from public.yorisou_account_deletion_jobs
     where owner_account_id = p_owner_account_id
     for update;

    if not found then
      -- A unique violation with no surviving row means the winner's transaction rolled back after
      -- claiming the key. Nothing can be returned honestly, and inventing a job would be worse.
      raise exception 'account_deletion_open_lost_race';
    end if;

    -- The refusals are not skipped just because we arrived here the hard way.
    if v_state = 'legal_hold'      then raise exception 'account_deletion_legal_hold'; end if;
    if v_state = 'failed_terminal' then raise exception 'account_deletion_failed_terminal'; end if;
    if v_state = 'cancelled' then
      update public.yorisou_account_deletion_jobs
         set state='requested', cancelled_at=null, last_error_code=null, updated_at=now()
       where id = v_id;
    end if;

    -- No second audit row. The winner already recorded `requested`; a duplicate would read as two
    -- people asking to be deleted.
    return v_id;
  end;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Asserted against the LIVE definition, not against this file. A `create or replace` that lost to a
-- later out-of-order reapply would otherwise pass silently.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare v_src text;
begin
  select pg_get_functiondef(p.oid) into v_src
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname = 'yorisou_account_deletion_open';

  if v_src is null then
    raise exception 'POR-1: yorisou_account_deletion_open is missing after the open-race repair';
  end if;

  if position('unique_violation' in v_src) = 0 then
    raise exception 'POR-1: yorisou_account_deletion_open no longer interprets the unique violation';
  end if;

  if position('for update' in v_src) = 0 then
    raise exception 'POR-1: yorisou_account_deletion_open no longer locks the row it found';
  end if;

  -- The constraint this repair listens to. If a future change drops the uniqueness, the
  -- `unique_violation` branch becomes unreachable and one owner can hold two deletion jobs —
  -- silently, because nothing would raise.
  if not exists (
    select 1
      from pg_constraint c
      join pg_class t on t.oid = c.conrelid
     where t.relname = 'yorisou_account_deletion_jobs'
       and c.contype = 'u'
  ) then
    raise exception 'POR-1: the deletion-job owner uniqueness constraint is missing';
  end if;
end $$;

-- Grants: service_role only, exactly as every other governed mutation path.
do $$ begin
  if exists (select 1 from pg_roles where rolname='anon') then
    revoke all on function public.yorisou_account_deletion_open(text) from anon;
  end if;
  if exists (select 1 from pg_roles where rolname='authenticated') then
    revoke all on function public.yorisou_account_deletion_open(text) from authenticated;
  end if;
  grant execute on function public.yorisou_account_deletion_open(text) to service_role;
end $$;
