-- CNT-1a — make the continuity index RPC-only on a hosted platform, not just on a bare cluster.
--
-- WHAT THIS FIXES, AND WHY IT NEEDED A SECOND MIGRATION.
--
-- 202608200001 revoked the projection index from public, anon and authenticated, then granted
-- SELECT to service_role. On a bare PostgreSQL that produces exactly what ARCH-P6 proves: the
-- index is readable by the server and mutable only through the three SECURITY DEFINER RPCs, which
-- is what makes terminal invalidation an invariant rather than a convention. The equivalence
-- harness demonstrates it by attempting a direct PATCH and getting 403.
--
-- A hosted Supabase project is not a bare cluster. It carries environment-level DEFAULT PRIVILEGES
-- that grant service_role ALL on new tables in `public`, and a `grant select` adds nothing to a
-- role that already holds everything. So the property held in every test and did NOT hold in
-- Production — verified after applying CNT-1 there:
--
--     svc_select=True  svc_insert=True  svc_update=True  svc_delete=True
--
-- A direct UPDATE clearing `invalidated_at` would resurrect a moment whose source is gone, which is
-- the single thing P6 exists to prevent.
--
-- 202608200001 IS NOT EDITED. It is applied, recorded, and its sha256 is registered; rewriting it
-- would break the checksum chain and rewrite history that other environments already ran. The
-- repair is append-only, which is the same discipline every other correction in this lineage
-- follows.
--
-- THE PATTERN IS SHR-1'S, not a new invention: revoke from service_role FIRST, then grant back only
-- what the server needs. 202608180002 does exactly this for the share tables, which is why they
-- report svc_insert=False in Production while the newer tables do not.
--
-- ROLLBACK
--   grant all on table public.yorisou_continuity_projections to service_role;
--   This restores the platform default. It does not restore correctness — the index becomes
--   directly writable again — so it is a rollback of last resort, not a routine one.

begin;

do $privileges$
begin
  -- Revoke FIRST. Without this the grant below is a no-op against a role the platform has already
  -- given everything to, which is precisely how this defect reached Production.
  execute 'revoke all on table public.yorisou_continuity_projections from public';
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table public.yorisou_continuity_projections from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table public.yorisou_continuity_projections from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'revoke all on table public.yorisou_continuity_projections from service_role';
    execute 'grant select on table public.yorisou_continuity_projections to service_role';
  end if;
end
$privileges$;

-- The index is a leaf with no sequence of its own (its id is a uuid default), so there is nothing
-- else to reclaim. Asserted rather than assumed, because a stray sequence grant would be a second
-- write path.
do $assert$
declare v_bad int;
begin
  select count(*) into v_bad
    from information_schema.columns
   where table_schema = 'public'
     and table_name = 'yorisou_continuity_projections'
     and column_default like 'nextval%';
  if v_bad > 0 then
    raise exception 'cnt1a_unexpected_sequence_backed_column';
  end if;
end
$assert$;

commit;
