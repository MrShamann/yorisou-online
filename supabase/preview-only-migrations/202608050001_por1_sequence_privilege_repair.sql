-- POR-1 — two sequences were usable by `anon` and `authenticated` in Preview.
--
-- PREVIEW_ONLY. Forward-only. Found the same way 202608010001 was: by comparing the live grant
-- catalogue against the promotion contract instead of trusting the migrations that wrote it.
--
-- WHAT WAS WRONG.
--
--     public.yorisou_interpretation_responses_seq
--     public.yorisou_recommendation_actions_seq
--
-- Both carried `anon=rwU/postgres` and `authenticated=rwU/postgres` in their ACL — USAGE, SELECT
-- and UPDATE, held DIRECTLY rather than through PUBLIC (`has_sequence_privilege('public', …)` is
-- false for both). USAGE is `nextval`: a caller can advance the sequence. UPDATE is `setval`: a
-- caller can move it anywhere, including backwards, onto values a later insert will then collide
-- with. Neither role has any business touching either.
--
-- WHERE THE GRANT CAME FROM.
--
-- No migration granted it. Supabase projects carry
--
--     alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
--
-- so `create sequence` in `public` hands all three roles everything, and the Preview lineage that
-- created these two sequences carried no privilege block to undo it. This is the sequence-shaped
-- twin of the function-privilege defect: the same mechanism, a different object class. It is also
-- why a migration that simply omits a grant block is not neutral — the platform has already decided.
--
-- WHAT THIS ESTABLISHES.
--
-- Exactly the end state the promotion set defines for Production in 202608010101 and 202608010102:
-- nothing for PUBLIC, `anon` or `authenticated`; `usage, select` for `service_role` and no more.
-- UPDATE is deliberately not restored — `setval` appears only inside one-time backfill migrations
-- (202607280005, 202607280007), which run as the owner, never in application code.
--
-- WHAT IT DOES NOT DO.
--
-- It does not alter a sequence value, restart a sequence, change ownership, or touch a single row.
-- Privileges only. Re-running it is a no-op, and it is role-conditional so a database without the
-- Supabase platform roles applies it cleanly.

do $$
declare
  v_seq text;
begin
  foreach v_seq in array array[
    'public.yorisou_interpretation_responses_seq',
    'public.yorisou_recommendation_actions_seq'
  ] loop
    -- Absent in a database that never ran the lineage that creates them; skip rather than fail.
    if to_regclass(v_seq) is null then
      raise notice 'POR-1: % is absent; skipping', v_seq;
      continue;
    end if;

    -- PUBLIC FIRST. A revoke from `anon` is a no-op while the privilege is held through PUBLIC, and
    -- it reports success either way — the failure mode that shipped seven executable SECURITY
    -- DEFINER functions into Preview before 202608010001 caught them.
    execute format('revoke all on sequence %s from public', v_seq);

    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on sequence %s from anon', v_seq);
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute format('revoke all on sequence %s from authenticated', v_seq);
    end if;

    -- Normalize service_role rather than adding to whatever it already held: revoke, then grant
    -- exactly the two privileges the promotion contract names. Otherwise the inherited UPDATE
    -- survives and Preview still would not match Production's intended end state.
    if exists (select 1 from pg_roles where rolname = 'service_role') then
      execute format('revoke all on sequence %s from service_role', v_seq);
      execute format('grant usage, select on sequence %s to service_role', v_seq);
    end if;
  end loop;
end $$;

-- Assert the end state in the same transaction that established it. A privilege migration that does
-- not verify its own result is how the original defect survived: every statement above succeeds
-- whether or not it changed anything.
do $$
declare
  v_seq text;
  v_bad text;
begin
  foreach v_seq in array array[
    'public.yorisou_interpretation_responses_seq',
    'public.yorisou_recommendation_actions_seq'
  ] loop
    if to_regclass(v_seq) is null then continue; end if;

    if has_sequence_privilege('public', v_seq, 'USAGE')
       or has_sequence_privilege('public', v_seq, 'SELECT')
       or has_sequence_privilege('public', v_seq, 'UPDATE') then
      raise exception 'POR-1: PUBLIC still holds a privilege on %', v_seq;
    end if;

    foreach v_bad in array array['anon', 'authenticated'] loop
      if exists (select 1 from pg_roles where rolname = v_bad) then
        if has_sequence_privilege(v_bad, v_seq, 'USAGE')
           or has_sequence_privilege(v_bad, v_seq, 'SELECT')
           or has_sequence_privilege(v_bad, v_seq, 'UPDATE') then
          raise exception 'POR-1: % still holds a privilege on %', v_bad, v_seq;
        end if;
      end if;
    end loop;

    if exists (select 1 from pg_roles where rolname = 'service_role') then
      if not has_sequence_privilege('service_role', v_seq, 'USAGE')
         or not has_sequence_privilege('service_role', v_seq, 'SELECT') then
        raise exception 'POR-1: service_role lost required usage/select on %', v_seq;
      end if;
      if has_sequence_privilege('service_role', v_seq, 'UPDATE') then
        raise exception 'POR-1: service_role retains UPDATE (setval) on %', v_seq;
      end if;
    end if;
  end loop;
end $$;
