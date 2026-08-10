-- POR-1 M1-A — seven SECURITY DEFINER functions were executable by `anon`.
--
-- PREVIEW_ONLY. Forward-only. Found by comparing the live grant catalogue against the promotion
-- contract instead of trusting the migrations that wrote it.
--
-- WHAT WAS WRONG.
--
-- `has_function_privilege('anon', oid, 'EXECUTE')` was TRUE for these, all SECURITY DEFINER:
--
--     yorisou_identity_links_erase(text)                     ← erases an owner's canonical links
--     yorisou_identity_links_sync(text, text, jsonb)         ← writes them
--     yorisou_identity_links_retire(text, text, text)        ← retires one
--     yorisou_identity_link_owner(text, text)                ← link digest  → owner account id
--     yorisou_identity_links_for_owner(text)                 ← owner account id → links
--     yorisou_identity_links_residue(text)                   ← probes by owner fingerprint
--     yorisou_account_deletion_terminal_deidentify(text,text)← forces a terminal de-identification
--
-- PostgREST publishes `public` schema functions as `POST /rest/v1/rpc/<name>`, and the anon key is
-- public by construction. So each of these was an unauthenticated caller away from erasing, writing
-- or disclosing canonical identity for any account id it could name. The de-identification path is
-- guarded internally and would refuse most inputs, but it should never have been reachable to try.
--
-- TWO INDEPENDENT ROOT CAUSES, which is why one fix would not have been enough.
--
-- 1. `202607310004_por1_canonical_identity_links.sql` contains NO function grant statement at all.
--    Its grant block covers only the table. `CREATE FUNCTION` grants EXECUTE to PUBLIC by default,
--    so the six identity-link functions simply kept that default. The migration is not wrong about
--    anything it says — it is silent, and silence here defaults to open.
--
-- 2. `202607310008_por1_terminal_deidentification.sql` — mine — revoked from `anon` and from
--    `authenticated` and granted `service_role`, which reads exactly like the correct block. It is
--    not. REVOKING FROM A ROLE DOES NOT REMOVE A PRIVILEGE THE ROLE HOLDS THROUGH PUBLIC. Both
--    revokes succeeded, changed nothing, and reported success. The privilege was never held by
--    `anon` directly; it was held by PUBLIC, and `anon` inherited it.
--
-- The other 64 promoted functions were never exposed: their migrations revoke `from public` FIRST,
-- which is the only order that works. This restores that one pattern everywhere.
--
-- WHAT IS DELIBERATELY LEFT ALONE.
--
-- `yorisou_line_subject_lock` keeps EXECUTE for nobody but its owner. 202607310002 states the
-- reason — it is a building block that takes a row lock, not an entry point — and that is a design
-- decision, not an omission. It is asserted below so a future blanket "grant service_role
-- everything" cannot quietly undo it.
--
-- `yorisou_dci_block_mutation` and `yorisou_values_block_mutation` are also PUBLIC-executable, and
-- are NOT touched here: they already exist in Production with exactly this shape, so they belong to
-- the legacy lineage rather than to this promotion. They are SECURITY INVOKER trigger guards whose
-- entire body raises, so calling one directly accomplishes nothing. Recorded, not silently bundled
-- into a POR-1 change.

do $$
declare
  r record;
  v_fixed int := 0;
begin
  -- The exposed set, plus the three promoted SECURITY INVOKER helpers. The helpers are not an
  -- attack surface, but leaving them PUBLIC would keep the "is this function reachable?" question
  -- alive for every reader of the contract, and a uniform rule is worth more than a debate per
  -- function.
  for r in
    select p.oid,
           'public.' || quote_ident(p.proname) || '(' ||
             pg_get_function_identity_arguments(p.oid) || ')' as sig
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname in (
         'yorisou_identity_links_erase',
         'yorisou_identity_links_sync',
         'yorisou_identity_links_retire',
         'yorisou_identity_link_owner',
         'yorisou_identity_links_for_owner',
         'yorisou_identity_links_residue',
         'yorisou_account_deletion_terminal_deidentify',
         'yorisou_interpretation_responses_append_only',
         'yorisou_interpretation_supersedes_same_result',
         'yorisou_jsonb_object_length'
       )
  loop
    -- PUBLIC FIRST. This is the whole repair: with PUBLIC still holding EXECUTE, the two revokes
    -- below are the no-ops that produced defect 2.
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
    v_fixed := v_fixed + 1;
  end loop;

  if v_fixed <> 10 then
    raise exception 'POR-1: expected to repair 10 functions, repaired %', v_fixed;
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Asserted against the LIVE privilege catalogue, not against the statements above.
--
-- `has_function_privilege` resolves inheritance, so it answers the question the two ineffective
-- revokes could not: can `anon` actually call this, by any path.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
declare
  v_exposed text;
  v_missing text;
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    select string_agg(p.proname, ', ' order by p.proname) into v_exposed
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname like 'yorisou_%'
       and p.prosecdef
       and has_function_privilege('anon', p.oid, 'EXECUTE');
    if v_exposed is not null then
      raise exception 'POR-1: SECURITY DEFINER function(s) still executable by anon: %', v_exposed;
    end if;
  end if;

  -- Every promoted function except the deliberate building block must be callable by the role the
  -- application actually connects as — a repair that locks the product out is not a repair.
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    select string_agg(p.proname, ', ' order by p.proname) into v_missing
      from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname like 'yorisou_%'
       and p.proname <> 'yorisou_line_subject_lock'
       and not has_function_privilege('service_role', p.oid, 'EXECUTE');
    if v_missing is not null then
      raise exception 'POR-1: function(s) not executable by service_role: %', v_missing;
    end if;

    -- And the building block stays a building block.
    if exists (
      select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = 'yorisou_line_subject_lock'
         and has_function_privilege('service_role', p.oid, 'EXECUTE')
    ) then
      raise exception 'POR-1: yorisou_line_subject_lock is an internal lock helper and must not be an entry point';
    end if;
  end if;
end $$;
