-- OSF-1 PHASE B — the Life OS audit trail.
--
-- WHY A NEW TABLE, AND WHY NONE OF THE EXISTING ONES WOULD DO.
--
-- Governance requires it. `annex/PRODUCTION_DATA_MODEL_AUTHORITY.md` §Conventions: "ALL mutations
-- emit an `audit_event`", and the 18-entity model names audit_event with fields
-- (actor, action, entity_ref, reason, at). `Yorisou_Technical_Architecture_v0.4.0.md`: "audit_event
-- infrastructure is append-only." Today the Life OS emits nothing: lib/server/lifeOs/store.ts —
-- the sole write path for all five tables — contains no event or audit write of any kind.
--
-- Every existing candidate is a category error, checked individually:
--   yorisou_experience_events      event_type is a closed 13-value CHECK about experience cards, and
--                                  experience_id is `on delete cascade` — an audit row that dies
--                                  with its subject is not an append-only trace.
--   yorisou_account_deletion_audit job_id is NOT NULL referencing a deletion job; a life-OS
--                                  mutation has no deletion job to attach to.
--   agent_runtime_* / yorisou_ai_runs   provider and task ledgers (tokens, cost, latency), not
--                                  consent-mutation audit.
-- Reusing any of them would mean altering a Production CHECK constraint to smuggle in a foreign
-- vocabulary. So: a dedicated table, with no cascading foreign key to anything it audits.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- THE ERASURE DECISION, STATED RATHER THAN ASSUMED
-- ─────────────────────────────────────────────────────────────────────────────
--
-- The annex says audit_event is "pseudonymized at account deletion" — pseudonymized, NOT deleted.
-- Every other OSF-1 table is hard-deleted by the POR-1 plan. Those two rules cannot both apply to
-- one table, so this migration resolves it in the only direction that needs no exception:
--
--   THIS TABLE NEVER STORES AN ACCOUNT ID. It stores `actor_fingerprint`, the sha256 of the owner
--   account id — the same construction POR-1 already uses for yorisou_account_deletion_jobs.
--   owner_fingerprint. There is therefore nothing to pseudonymize at deletion, because nothing was
--   ever identified; the trace survives, as an append-only ops record must, and account deletion
--   leaves no personal data behind in it.
--
-- Consequence, deliberate: this table is NOT registered in the erasure plan and does not need to be.
-- It carries no column in the erasure guard's OWNER_COLUMNS list, so the guard will not flag it —
-- and this comment is the written justification for why that is correct rather than an oversight.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- EVENT NAMES ARE NOT CANONICAL-DICTIONARY EVENTS
-- ─────────────────────────────────────────────────────────────────────────────
--
-- `annex/ARCHITECTURE_TO_CODE_MAPPING_AUTHORITY.md` fixes a 15-event canonical dictionary namespaced
-- `yorisou.exp.*`, with IDs "FIXED, never derived from labels" and "New events only via Change
-- Management v1.0". Inventing life-OS entries in that namespace would be a change-managed act.
--
-- So these live in their own namespace, `yorisou.life.*`, and are OPERATIONAL AUDIT — not product
-- analytics, not funnel events, not the canonical dictionary. Promoting any of them into
-- `yorisou.exp.*` requires Change Management v1.0 and is explicitly out of scope here.
--
-- RETENTION IS NOT SET HERE. The annex proposes 24 months for audit_event and says plainly that
-- "Retention values are proposals pending Edward's retention approval", and retention schedules are
-- among Edward's sole non-delegable rights. This table therefore carries NO retention column and no
-- purge function: nothing in this migration decides how long a row lives.
--
-- ROLLBACK:
--   drop function if exists public.yorisou_osf1_audit_write(text, text, text, uuid, text, jsonb);
--   drop table if exists public.yorisou_life_os_audit_events;

create extension if not exists pgcrypto;

create table if not exists public.yorisou_life_os_audit_events (
  id uuid primary key default gen_random_uuid(),
  -- sha256 of the owner account id. NEVER the id itself. See the erasure decision above.
  actor_fingerprint text not null
    constraint yorisou_life_os_audit_events_actor_chk check (actor_fingerprint ~ '^[0-9a-f]{64}$'),
  -- `yorisou.life.<domain>.<verb>` — its own namespace, not the canonical dictionary.
  action text not null
    constraint yorisou_life_os_audit_events_action_chk
    check (action ~ '^yorisou\.life\.[a-z_]+\.[a-z_]+$'),
  entity_kind text not null
    constraint yorisou_life_os_audit_events_entity_chk
    check (entity_kind in ('user_context','current_state','goal','reflection','memory','experience','assistant')),
  -- The row acted on, when there is one. NO foreign key: an audit trace must outlive its subject,
  -- and a cascading FK would delete the evidence along with the thing it is evidence about.
  entity_ref uuid,
  -- A bounded reason code, never free text and never user content.
  reason text not null
    constraint yorisou_life_os_audit_events_reason_chk check (length(reason) between 1 and 64),
  -- Bounded, content-free metadata: counts, enum values, outcome codes. The application layer is
  -- responsible for never putting user text here; the size cap is the backstop.
  detail jsonb not null default '{}'::jsonb
    constraint yorisou_life_os_audit_events_detail_chk
    check (jsonb_typeof(detail) = 'object' and pg_column_size(detail) <= 2048),
  created_at timestamptz not null default now()
);
create index if not exists yorisou_life_os_audit_events_actor_recent
  on public.yorisou_life_os_audit_events (actor_fingerprint, created_at desc);
create index if not exists yorisou_life_os_audit_events_action_recent
  on public.yorisou_life_os_audit_events (action, created_at desc);

-- APPEND-ONLY, enforced. The architecture doc's word is "append-only"; a trace that can be edited
-- or deleted by the thing it audits is not one.
create or replace function public.yorisou_life_os_audit_block_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'append_only: % on % is not permitted', tg_op, tg_table_name;
end;
$$;
drop trigger if exists yorisou_life_os_audit_events_no_mutate on public.yorisou_life_os_audit_events;
create trigger yorisou_life_os_audit_events_no_mutate
  before update or delete on public.yorisou_life_os_audit_events
  for each row execute function public.yorisou_life_os_audit_block_mutation();
drop trigger if exists yorisou_life_os_audit_events_no_truncate on public.yorisou_life_os_audit_events;
create trigger yorisou_life_os_audit_events_no_truncate
  before truncate on public.yorisou_life_os_audit_events
  for each statement execute function public.yorisou_life_os_audit_block_mutation();

-- Privilege matrix, the same shape as every other OSF-1 table:
--   public/anon/authenticated : nothing
--   service_role              : SELECT only
--   writes                    : the SECURITY DEFINER RPC below, exclusively
alter table public.yorisou_life_os_audit_events enable row level security;
revoke all on table public.yorisou_life_os_audit_events from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table public.yorisou_life_os_audit_events from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table public.yorisou_life_os_audit_events from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'revoke all on table public.yorisou_life_os_audit_events from service_role';
    execute 'grant select on table public.yorisou_life_os_audit_events to service_role';
  end if;
end $$;

-- The only write path. Takes the RAW owner id and fingerprints it HERE, so no caller can store an
-- account id by mistake and no caller has to remember to hash.
create or replace function public.yorisou_osf1_audit_write(
  p_owner_account_id text,
  p_action text,
  p_entity_kind text,
  p_entity_ref uuid,
  p_reason text,
  p_detail jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'osf1_audit_owner_required';
  end if;
  insert into public.yorisou_life_os_audit_events
    (actor_fingerprint, action, entity_kind, entity_ref, reason, detail)
  values
    (encode(sha256(convert_to(p_owner_account_id, 'utf8')), 'hex'),
     p_action, p_entity_kind, p_entity_ref, p_reason, coalesce(p_detail, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end;
$$;

revoke all on function public.yorisou_osf1_audit_write(text, text, text, uuid, text, jsonb) from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on function public.yorisou_osf1_audit_write(text, text, text, uuid, text, jsonb) from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on function public.yorisou_osf1_audit_write(text, text, text, uuid, text, jsonb) from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.yorisou_osf1_audit_write(text, text, text, uuid, text, jsonb) to service_role';
  end if;
end $$;

comment on table public.yorisou_life_os_audit_events is
  'OSF-1: append-only Life OS operational audit. Stores actor_fingerprint (sha256 of the account id), NEVER the id — so account deletion leaves no personal data here and no erasure-plan entry is required. Event names are yorisou.life.*, NOT the canonical yorisou.exp.* dictionary. No retention policy is set: that is Edward''s sole decision.';
