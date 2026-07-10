-- C02 private result records. This migration is additive and intentionally
-- separate from the inactive Agent Runtime tables.
create table public.yorisou_test_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null default gen_random_uuid(),
  owner_account_id text not null check (char_length(owner_account_id) between 1 and 200),
  test_id text not null check (test_id = 'C02'),
  test_version text not null check (test_version = 'v1.0'),
  scoring_version text not null check (scoring_version = 'c02-rule-based-v1'),
  result_id text not null check (char_length(result_id) between 1 and 120),
  result_title text not null check (char_length(result_title) between 1 and 240),
  public_summary text not null check (char_length(public_summary) between 1 and 2000),
  score_summary jsonb not null check (jsonb_typeof(score_summary) = 'object'),
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index yorisou_test_results_owner_created_idx
  on public.yorisou_test_results (owner_account_id, created_at desc);

alter table public.yorisou_test_results enable row level security;

-- All access is mediated by a server-only service-role repository, which checks
-- the encrypted YORISOU session owner before each read or write.
revoke all on table public.yorisou_test_results from public;
revoke all on table public.yorisou_test_results from anon;
revoke all on table public.yorisou_test_results from authenticated;

create or replace function public.set_yorisou_test_result_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_yorisou_test_result_updated_at() from public;
revoke all on function public.set_yorisou_test_result_updated_at() from anon;
revoke all on function public.set_yorisou_test_result_updated_at() from authenticated;

create trigger yorisou_test_results_updated_at
before update on public.yorisou_test_results
for each row execute function public.set_yorisou_test_result_updated_at();
