create table public.yorisou_line_oauth_states (
  state text primary key check (char_length(state) between 20 and 200),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index yorisou_line_oauth_states_expiry_idx on public.yorisou_line_oauth_states (expires_at);
alter table public.yorisou_line_oauth_states enable row level security;
revoke all on table public.yorisou_line_oauth_states from public;
do $$ begin
  if exists (select 1 from pg_roles where rolname='anon') then revoke all on table public.yorisou_line_oauth_states from anon; end if;
  if exists (select 1 from pg_roles where rolname='authenticated') then revoke all on table public.yorisou_line_oauth_states from authenticated; end if;
end $$;
