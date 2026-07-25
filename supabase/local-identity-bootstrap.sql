-- YORISOU local project identity marker (cross-project isolation).
-- Local-environment metadata ONLY — not product schema, not a business record.
--
-- SINGLETON CONTRACT: exactly one row, whose project is exactly
-- 'yorisou-online'. The guard's full mode verifies count AND value (never an
-- unordered LIMIT 1). This bootstrap:
--   * creates the singleton-shaped table when absent;
--   * inserts the marker only into an EMPTY table;
--   * is idempotent when exactly one correct marker already exists
--     (either shape — a legacy-shaped correct marker is left untouched here and
--     converted by the separate guarded post-merge step);
--   * REFUSES — without overwriting or adding rows — if any conflicting, extra
--     or malformed marker exists. That state requires forensic remediation.
do $$
declare
  v_total integer;
  v_conflicting integer;
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'yorisou_local_project_identity'
  ) then
    create table public.yorisou_local_project_identity (
      singleton boolean primary key default true check (singleton = true),
      project text not null check (project = 'yorisou-online'),
      created_at timestamptz not null default now()
    );
  end if;

  select count(*) into v_total from public.yorisou_local_project_identity;
  select count(*) into v_conflicting
    from public.yorisou_local_project_identity
    where project is distinct from 'yorisou-online';

  if v_conflicting > 0 or v_total > 1 then
    raise exception
      'CONFLICTING_LOCAL_IDENTITY_MARKER: % row(s), % conflicting — refusing to overwrite or append; forensic remediation required',
      v_total, v_conflicting;
  end if;

  if v_total = 0 then
    insert into public.yorisou_local_project_identity (project) values ('yorisou-online');
  end if;
  -- exactly one correct row: idempotent no-op
end $$;
