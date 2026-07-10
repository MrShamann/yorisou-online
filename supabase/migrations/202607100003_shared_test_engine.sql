-- Extend the existing private C02 result store for the bounded production
-- registry (C02, F01 and F02). Existing C02 rows remain valid.
alter table public.yorisou_test_results
  drop constraint if exists yorisou_test_results_test_id_check,
  drop constraint if exists yorisou_test_results_test_version_check,
  drop constraint if exists yorisou_test_results_scoring_version_check,
  add constraint yorisou_test_results_test_id_check check (test_id in ('C02', 'F01', 'F02')),
  add constraint yorisou_test_results_test_version_check check (test_version = 'v1.0'),
  add constraint yorisou_test_results_scoring_version_check check (scoring_version in ('c02-rule-based-v1', 'yorisou-rule-based-v1')),
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by text;

create index if not exists yorisou_test_results_active_owner_created_idx
  on public.yorisou_test_results (owner_account_id, created_at desc)
  where deleted_at is null;

create table public.yorisou_account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  owner_account_id text not null unique check (char_length(owner_account_id) between 1 and 200),
  status text not null default 'requested' check (status in ('requested', 'processing', 'completed', 'rejected')),
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  requester_note text check (requester_note is null or char_length(requester_note) <= 500)
);

alter table public.yorisou_account_deletion_requests enable row level security;
revoke all on table public.yorisou_account_deletion_requests from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname='anon') then revoke all on table public.yorisou_account_deletion_requests from anon; end if;
  if exists (select 1 from pg_roles where rolname='authenticated') then revoke all on table public.yorisou_account_deletion_requests from authenticated; end if;
end $$;
