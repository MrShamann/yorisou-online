-- YORISOU identity marker — legacy → singleton forward conversion.
--
-- ⚠️ POST-MERGE GUARDED LOCAL MAINTENANCE. DO NOT run during PR review, and do
-- not run unguarded. The live dedicated local DB currently carries the earlier
-- (legacy) marker shape (`project text primary key`); this script converts it to
-- the singleton contract. Run ONLY after full target verification, e.g.:
--
--   node scripts/yorisou-local-db.mjs e2e -- \
--     psql "$YORISOU_LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f supabase/local-identity-marker-conversion.sql
--
-- Behaviour:
--   * no-op if the table is already singleton-shaped;
--   * verifies the legacy table contains EXACTLY one row identifying
--     'yorisou-online' before converting;
--   * transactional; REFUSES any conflict (no overwrite, no guesswork).
begin;
do $$
declare
  v_has_singleton boolean;
  v_total integer;
  v_conflicting integer;
begin
  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'yorisou_local_project_identity'
      and column_name = 'singleton'
  ) into v_has_singleton;

  if v_has_singleton then
    raise notice 'identity marker already singleton-shaped; nothing to convert';
    return;
  end if;

  select count(*) into v_total from public.yorisou_local_project_identity;
  select count(*) into v_conflicting
    from public.yorisou_local_project_identity
    where project is distinct from 'yorisou-online';

  if v_total <> 1 or v_conflicting > 0 then
    raise exception
      'CONFLICTING_LOCAL_IDENTITY_MARKER: % row(s), % conflicting — conversion refused; forensic remediation required',
      v_total, v_conflicting;
  end if;

  alter table public.yorisou_local_project_identity
    rename to yorisou_local_project_identity_legacy;

  create table public.yorisou_local_project_identity (
    singleton boolean primary key default true check (singleton = true),
    project text not null check (project = 'yorisou-online'),
    created_at timestamptz not null default now()
  );

  insert into public.yorisou_local_project_identity (project)
    select project from public.yorisou_local_project_identity_legacy;

  drop table public.yorisou_local_project_identity_legacy;
end $$;
commit;
