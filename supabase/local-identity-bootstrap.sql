-- YORISOU local project identity marker (cross-project isolation).
-- Local-environment metadata ONLY — not product schema, not a business record.
-- scripts/verify-local-supabase-target.mjs (full mode) requires this to equal
-- 'yorisou-online' before any migration/reset/restore/seed/E2E may proceed.
create table if not exists public.yorisou_local_project_identity (
  project text primary key,
  created_at timestamptz not null default now()
);
insert into public.yorisou_local_project_identity(project)
values ('yorisou-online') on conflict do nothing;
