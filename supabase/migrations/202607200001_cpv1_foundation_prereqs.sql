-- CPV1-CM0 — clean-main CPV1 foundation PREREQUISITES (self-contained).
--
-- The CPV1 schema on the stacked branch depended on APP-2 helpers
-- (public.yorisou_current_account_id / public.yorisou_app2_block_mutation) that do
-- NOT exist on clean production `main`. To make the CPV1 foundation independently
-- buildable from clean `main` WITHOUT inheriting APP-2, this migration defines
-- CPV1-OWNED equivalents with distinct names (so there is no collision if APP-2
-- ever lands separately). Additive; LOCAL Supabase verification only — never
-- production.
--
-- ROLLBACK CLASSIFICATION: LOCAL_DISPOSABLE_SCHEMA_ROLLBACK (structurally destructive
--   in a disposable local/test database only; NOT a production rollback; no production
--   migration is authorized). Rollback (disposable local DB only):
--     drop function if exists public.yorisou_cpv1_block_mutation();
--     drop function if exists public.yorisou_cpv1_current_account_id();

-- gen_random_uuid() for uuid primary keys.
create extension if not exists pgcrypto;

-- CPV1 RLS helper: resolves the caller's app account id from JWT claims
-- (app_account_id, else sub). Null for anon (which is then denied by RLS).
create or replace function public.yorisou_cpv1_current_account_id()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'app_account_id',
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )
$$;
comment on function public.yorisou_cpv1_current_account_id() is
  'CPV1-CM0 RLS helper (self-contained; not APP-2): resolves caller app account id from JWT claims. Null for anon.';

-- CPV1 append-only guard: reject UPDATE/DELETE/TRUNCATE on immutable audit tables.
create or replace function public.yorisou_cpv1_block_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'append_only: % on % is not permitted', tg_op, tg_table_name;
  return null;
end;
$$;
comment on function public.yorisou_cpv1_block_mutation() is
  'CPV1-CM0 append-only guard (self-contained; not APP-2). Blocks mutation of immutable CPV1 audit tables.';
