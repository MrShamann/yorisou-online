-- Capability Package 4: private, owner-scoped AI reflections.  This migration
-- deliberately contains no user-facing policies: only the server role may
-- access these tables, and application routes enforce the owner boundary.
create table public.yorisou_ai_runtime_controls (
  singleton boolean primary key default true check (singleton),
  global_enabled boolean not null default false,
  reflection_enabled boolean not null default false,
  mistral_enabled boolean not null default false,
  openrouter_enabled boolean not null default false,
  daily_budget_cents integer not null default 0 check (daily_budget_cents between 0 and 10000),
  reflection_budget_cents integer not null default 0 check (reflection_budget_cents between 0 and 1000),
  updated_at timestamptz not null default now()
);
insert into public.yorisou_ai_runtime_controls(singleton) values (true) on conflict do nothing;

create table public.yorisou_ai_runs (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  owner_account_id text not null check (char_length(owner_account_id) between 1 and 200),
  saved_result_id uuid not null references public.yorisou_test_results(id) on delete cascade,
  task_id uuid unique references public.agent_runtime_tasks(id) on delete cascade,
  workflow_type text not null check (workflow_type in ('test_result_reflection','private_state_summary','next_step_recommendation','check_in_plan_generation','private_memory_update','reflection_feedback_processing')),
  workflow_version text not null,
  input_hash text not null check (input_hash ~ '^[a-f0-9]{64}$'),
  provider text,
  model text,
  status text not null default 'queued' check (status in ('queued','running','completed','failed','withdrawn')),
  prompt_version text not null,
  data_minimized boolean not null default true,
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  estimated_cost_cents integer not null default 0 check (estimated_cost_cents >= 0),
  latency_ms integer check (latency_ms is null or latency_ms >= 0),
  error_class text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(owner_account_id, saved_result_id, workflow_type, workflow_version, input_hash)
);

create table public.yorisou_ai_reflections (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  owner_account_id text not null check (char_length(owner_account_id) between 1 and 200),
  saved_result_id uuid not null references public.yorisou_test_results(id) on delete cascade,
  run_id uuid unique not null references public.yorisou_ai_runs(id) on delete cascade,
  workflow_version text not null,
  provider text not null,
  model text not null,
  content jsonb not null check (octet_length(content::text) <= 24000),
  withdrawn_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.yorisou_private_memory_items (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  owner_account_id text not null check (char_length(owner_account_id) between 1 and 200),
  saved_result_id uuid references public.yorisou_test_results(id) on delete cascade,
  reflection_id uuid references public.yorisou_ai_reflections(id) on delete cascade,
  memory_type text not null check (memory_type in ('user_note','selected_reflection','saved_recommendation','tried_action','helpfulness_outcome','interaction_preference','check_in_preference','user_correction','forgetting_event')),
  source_type text not null check (source_type in ('user_statement','deterministic_fact','ai_summary','ai_inference','user_confirmed_inference')),
  content text not null check (char_length(content) between 1 and 2000),
  permitted_uses text[] not null default array['private_state']::text[],
  visibility text not null default 'owner_only' check (visibility = 'owner_only'),
  confidence numeric(3,2) check (confidence is null or confidence between 0 and 1),
  corrected_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.yorisou_private_recommendations (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  owner_account_id text not null check (char_length(owner_account_id) between 1 and 200),
  saved_result_id uuid not null references public.yorisou_test_results(id) on delete cascade,
  reflection_id uuid references public.yorisou_ai_reflections(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  description text not null check (char_length(description) between 1 and 1000),
  reason text not null check (char_length(reason) between 1 and 1000),
  category text not null check (category in ('reflection','action','environment','communication','rest')),
  status text not null default 'new' check (status in ('new','saved','try','tried','helpful','not_relevant','hidden')),
  commercial boolean not null default false check (commercial = false),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.yorisou_private_check_in_plans (
  id uuid primary key default gen_random_uuid(),
  project_id text not null default 'yorisou' check (project_id = 'yorisou'),
  owner_account_id text not null check (char_length(owner_account_id) between 1 and 200),
  saved_result_id uuid references public.yorisou_test_results(id) on delete cascade,
  suggested_for timestamptz,
  return_path text not null check (return_path ~ '^/(saved|private-state)(/|$)'),
  status text not null default 'active' check (status in ('active','completed','cancelled')),
  created_at timestamptz not null default now()
);

create index yorisou_ai_runs_owner_idx on public.yorisou_ai_runs(owner_account_id, created_at desc);
create index yorisou_ai_reflections_owner_idx on public.yorisou_ai_reflections(owner_account_id, created_at desc) where withdrawn_at is null and deleted_at is null;
create index yorisou_private_memory_owner_idx on public.yorisou_private_memory_items(owner_account_id, created_at desc) where deleted_at is null;
create index yorisou_private_recommendations_owner_idx on public.yorisou_private_recommendations(owner_account_id, created_at desc);

alter table public.yorisou_ai_runtime_controls enable row level security;
alter table public.yorisou_ai_runs enable row level security;
alter table public.yorisou_ai_reflections enable row level security;
alter table public.yorisou_private_memory_items enable row level security;
alter table public.yorisou_private_recommendations enable row level security;
alter table public.yorisou_private_check_in_plans enable row level security;
revoke all on table public.yorisou_ai_runtime_controls, public.yorisou_ai_runs, public.yorisou_ai_reflections, public.yorisou_private_memory_items, public.yorisou_private_recommendations, public.yorisou_private_check_in_plans from public;

-- Runtime functions remain inaccessible to public/anon/authenticated. The
-- deployment service role is intentionally the only executable principal.
grant execute on function public.promote_yorisou_agent_runtime_tasks(integer) to service_role;
grant execute on function public.recover_stale_yorisou_agent_runtime_tasks() to service_role;
grant execute on function public.claim_yorisou_agent_runtime_tasks(text,integer,integer) to service_role;

create function public.claim_yorisou_agent_runtime_task(p_task_id uuid, p_worker_id text, p_lease_seconds integer default 60)
returns setof public.agent_runtime_tasks language plpgsql security definer set search_path=public as $$
begin
  if p_worker_id !~ '^[A-Za-z0-9._:-]{1,128}$' or p_lease_seconds not between 1 and 300 then
    raise exception 'invalid claim input';
  end if;
  return query update public.agent_runtime_tasks
    set status='claimed', claimed_by=p_worker_id, claimed_at=now(), lease_expires_at=now()+make_interval(secs=>p_lease_seconds), attempt_count=attempt_count+1
    where id=p_task_id and project_id='yorisou' and status='ready' and available_at<=now()
    returning public.agent_runtime_tasks.*;
end $$;
revoke all on function public.claim_yorisou_agent_runtime_task(uuid,text,integer) from public;
do $$ begin
  if exists(select 1 from pg_roles where rolname='anon') then execute 'revoke all on function public.claim_yorisou_agent_runtime_task(uuid,text,integer) from anon'; end if;
  if exists(select 1 from pg_roles where rolname='authenticated') then execute 'revoke all on function public.claim_yorisou_agent_runtime_task(uuid,text,integer) from authenticated'; end if;
end $$;
grant execute on function public.claim_yorisou_agent_runtime_task(uuid,text,integer) to service_role;
