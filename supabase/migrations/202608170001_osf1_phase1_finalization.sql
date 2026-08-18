-- OSF-1 PHASE 1 FINALIZATION — the state↔reflection reference and the memory lifecycle.
--
-- ONE FILE, for the reason 202608160001 gives at length: these two requirements both re-create
-- `yorisou_osf1_reflection_create`, PostgreSQL overloads by signature, and every grant in this
-- project is a hardcoded signature string. Split across two migrations, the second leaves the
-- first's overload alive, un-granted and audit-less, and PostgREST dispatches to whichever matches
-- the JSON key set it is sent.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- 1. STATE ↔ REFLECTION — A REFERENCE, AND DELIBERATELY NOTHING MORE
-- ─────────────────────────────────────────────────────────────────────────────
--
-- `current_state_record_id` records ONE fact: this reflection was written in relation to that
-- recorded state, because the person said so.
--
-- It does NOT mean the state caused the reflection. Nothing infers it, nothing back-fills it,
-- nothing derives it from timing, and no code may read it as a causal claim. That distinction is
-- the whole reason this is a nullable column on an existing table rather than an edge in a
-- relationship structure: an edge invites traversal, and traversal invites inference.
--
-- THIS IS NOT A LIFE GRAPH. It is a second optional foreign key alongside `experience_id`, which
-- has existed since 202608140001 with exactly the same meaning and the same restraint. No
-- relationships table is created, and none may be: tests/../osf1Activation.test.ts fails on any
-- 2026081*/2026082* migration creating a table whose name contains relationship|edge|graph|link.
--
-- `on delete set null`: deleting a check-in must not delete the reflection someone wrote near it.
-- Existing rows are NOT back-filled. A link nobody chose is not a link.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- 2. MEMORY LIFECYCLE — FOUR VERBS, BECAUSE THE GOVERNANCE NAMES FOUR
-- ─────────────────────────────────────────────────────────────────────────────
--
-- `Yorisou_Personal_Archive_and_Memory_Governance_v1.0.md` §3.2: "Users can always: view state,
-- correct, suppress, revoke, delete — each with visible confirmation and (for deletion) a receipt."
--
-- Five verbs, of which the product had three (view, correct, delete). `suppress` and `revoke` are
-- listed SEPARATELY from `delete`, so neither may be implemented as an alias for it. Reading the
-- distinction the way the governance uses it:
--
--   ACTIVE     confirmed and eligible for every governed use.
--   SUPPRESSED stored, visible to the person, and excluded from retrieval and personalization.
--              REVERSIBLE — this is the "not right now" state.
--   REVOKED    the person has withdrawn authorization for the memory to be used at all. The row is
--              retained so the withdrawal itself is a fact the product can honour and prove, but it
--              is TERMINAL: revoke cannot be undone from the product. Anything else would make
--              "withdrawn" a setting rather than a decision.
--   (deleted)  not a state — the row is gone. The receipt is what remains.
--
-- WHY REVOKE IS NOT DELETE. If it were, the governance would not list both, and a person who wants
-- the product to stop using something would be forced to destroy it to say so. Keeping them
-- separate is what lets someone say "stop using this" without also saying "forget it happened".
--
-- THE DELETION RECEIPT NEEDS NO NEW TABLE. Deletion is a hard delete, so a receipt stored on the
-- row would die with it. `yorisou_life_os_audit_events` already records `memory.deleted` inside the
-- deletion's own transaction, append-only, with the entity id, the memory type and the timestamp,
-- keyed by the sha256 of the account id. That row IS the receipt; this migration adds the
-- owner-scoped read path that lets a person be shown their own. A second receipt table would be a
-- second source of truth for the same fact.
--
-- RETENTION_POLICY_TBD is unchanged. No period is set or assumed.
--
-- ROLLBACK — drop by exact NEW signature first, then re-apply 202608160001 §3 and §7 to restore the
-- previous reflection RPC and its grant. The column drops are LOSSY and come last, if at all:
--
--   begin;
--   drop function if exists public.yorisou_osf1_reflection_create(text, uuid, uuid, text, text, text, text, text, text, text, text, text, text, text, text, jsonb);
--   drop function if exists public.yorisou_osf1_memory_set_lifecycle(text, uuid, text, jsonb);
--   drop function if exists public.yorisou_osf1_memory_receipts(text, integer);
--   -- re-apply 202608160001 (§3 recreates the 15-arg reflection RPC and §7 its grants), then only
--   -- if the columns are genuinely unwanted:
--   alter table public.yorisou_life_reflections drop column if exists current_state_record_id;
--   alter table public.yorisou_explicit_memories drop column if exists lifecycle_state;
--   alter table public.yorisou_explicit_memories drop column if exists lifecycle_changed_at;
--   commit;

-- ── 1. Columns ───────────────────────────────────────────────────────────────

alter table public.yorisou_life_reflections
  add column if not exists current_state_record_id uuid
  references public.yorisou_current_state_records (id) on delete set null;

comment on column public.yorisou_life_reflections.current_state_record_id is
  'OPTIONAL, USER-CHOSEN. Records that this reflection was written in relation to that state record. NOT a causal claim, never inferred, never back-filled. Not a Life Graph edge.';

alter table public.yorisou_explicit_memories
  add column if not exists lifecycle_state text not null default 'active';
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'yorisou_explicit_memories_lifecycle_chk') then
    alter table public.yorisou_explicit_memories
      add constraint yorisou_explicit_memories_lifecycle_chk
      check (lifecycle_state in ('active', 'suppressed', 'revoked'));
  end if;
end $$;
alter table public.yorisou_explicit_memories
  add column if not exists lifecycle_changed_at timestamptz;

comment on column public.yorisou_explicit_memories.lifecycle_state is
  'active | suppressed | revoked. suppressed is reversible and excluded from retrieval; revoked is a TERMINAL withdrawal of authorization and is not an alias for delete — Memory Governance v1.0 §3.2 lists suppress, revoke and delete as three separate rights.';

-- Retrieval reads active rows constantly; the partial index keeps that path cheap without indexing
-- the states that are excluded from it.
create index if not exists yorisou_explicit_memories_active_recent
  on public.yorisou_explicit_memories (owner_account_id, created_at desc)
  where lifecycle_state = 'active';

-- ── 2. Reflection create — plus the optional state reference ─────────────────

drop function if exists public.yorisou_osf1_reflection_create(
  text, uuid, text, text, text, text, text, text, text, text, text, text, text, text, jsonb);

create or replace function public.yorisou_osf1_reflection_create(
  p_owner_account_id text,
  p_experience_id uuid,
  p_current_state_record_id uuid,
  p_mode text,
  p_what_happened text,
  p_felt text,
  p_tried text,
  p_what_followed text,
  p_next_time text,
  p_goal_at_the_time text default null,
  p_information_at_hand text default null,
  p_options_considered text default null,
  p_decision_made text default null,
  p_why text default null,
  p_what_learned text default null,
  p_audit_detail jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_mode text;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'osf1_owner_required';
  end if;
  v_mode := coalesce(nullif(btrim(coalesce(p_mode, '')), ''), 'light');
  if v_mode not in ('light', 'postmortem') then
    raise exception 'osf1_reflection_mode_invalid';
  end if;
  if nullif(btrim(coalesce(p_what_happened, '')), '') is null then
    raise exception 'osf1_reflection_what_happened_required';
  end if;
  if p_experience_id is not null then
    if not exists (
      select 1 from public.yorisou_experience_cards
       where id = p_experience_id and owner_account_id = p_owner_account_id
    ) then
      raise exception 'osf1_experience_not_owned';
    end if;
  end if;
  -- Same ownership shape as the experience link. A caller cannot reference someone else's state
  -- record, and the error does not distinguish "not yours" from "does not exist".
  if p_current_state_record_id is not null then
    if not exists (
      select 1 from public.yorisou_current_state_records
       where id = p_current_state_record_id and owner_account_id = p_owner_account_id
    ) then
      raise exception 'osf1_state_record_not_owned';
    end if;
  end if;
  insert into public.yorisou_life_reflections
    (owner_account_id, experience_id, current_state_record_id, mode, what_happened, felt, tried,
     what_followed, next_time, goal_at_the_time, information_at_hand, options_considered,
     decision_made, why, what_learned)
  values
    (p_owner_account_id, p_experience_id, p_current_state_record_id, v_mode, btrim(p_what_happened),
     nullif(btrim(coalesce(p_felt, '')), ''),
     nullif(btrim(coalesce(p_tried, '')), ''),
     nullif(btrim(coalesce(p_what_followed, '')), ''),
     nullif(btrim(coalesce(p_next_time, '')), ''),
     nullif(btrim(coalesce(p_goal_at_the_time, '')), ''),
     nullif(btrim(coalesce(p_information_at_hand, '')), ''),
     nullif(btrim(coalesce(p_options_considered, '')), ''),
     nullif(btrim(coalesce(p_decision_made, '')), ''),
     nullif(btrim(coalesce(p_why, '')), ''),
     nullif(btrim(coalesce(p_what_learned, '')), ''))
  returning id into v_id;
  perform public.yorisou_osf1_audit_write(
    p_owner_account_id, 'yorisou.life.reflection.created', 'reflection', v_id, v_mode,
    coalesce(p_audit_detail, '{}'::jsonb)
      || jsonb_build_object('about_state', p_current_state_record_id is not null));
  return v_id;
end;
$$;

-- ── 3. Memory lifecycle ──────────────────────────────────────────────────────

create or replace function public.yorisou_osf1_memory_set_lifecycle(
  p_owner_account_id text,
  p_memory_id uuid,
  p_next_state text,
  p_audit_detail jsonb default '{}'::jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current text;
  v_action text;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'osf1_owner_required';
  end if;
  if p_next_state not in ('active', 'suppressed', 'revoked') then
    raise exception 'osf1_memory_lifecycle_invalid';
  end if;

  select lifecycle_state into v_current
    from public.yorisou_explicit_memories
   where id = p_memory_id and owner_account_id = p_owner_account_id
   for update;
  -- Not found and not owned are the same answer, so this cannot be used to discover that someone
  -- else's id is real.
  if v_current is null then
    return false;
  end if;

  -- REVOKED IS TERMINAL. Withdrawing authorization is a decision, not a toggle; letting the product
  -- put a revoked memory back into use would make the withdrawal meaningless. Deleting it remains
  -- available, which is the only onward move a person needs.
  if v_current = 'revoked' and p_next_state <> 'revoked' then
    raise exception 'osf1_memory_revoked_is_final';
  end if;
  if v_current = p_next_state then
    return true;   -- idempotent: asking for the state it is already in is not an error
  end if;

  update public.yorisou_explicit_memories
     set lifecycle_state = p_next_state,
         lifecycle_changed_at = now(),
         updated_at = now()
   where id = p_memory_id and owner_account_id = p_owner_account_id;

  v_action := case p_next_state
                when 'suppressed' then 'yorisou.life.memory.suppressed'
                when 'revoked'    then 'yorisou.life.memory.revoked'
                else                   'yorisou.life.memory.restored'
              end;
  -- TRANSACTIONAL, on the same reasoning as confirmation and deletion: each of these changes what
  -- the product is permitted to do with something the person told it, and the record of that
  -- permission change must not be able to go missing separately from the change.
  perform public.yorisou_osf1_audit_write(
    p_owner_account_id, v_action, 'memory', p_memory_id, v_current,
    coalesce(p_audit_detail, '{}'::jsonb) || jsonb_build_object('to', p_next_state));
  return true;
end;
$$;

-- ── 4. Deletion receipts, read from the audit trail that already holds them ──
--
-- Owner-scoped by fingerprint, which is the only identifier the audit table stores. It returns
-- nothing but the fact of a deletion: when, which id, and what kind of memory it was. It cannot
-- return content, because the audit row never held any — that is the point of a receipt for a hard
-- delete.
create or replace function public.yorisou_osf1_memory_receipts(
  p_owner_account_id text,
  p_limit integer default 50
)
returns table (memory_id uuid, memory_type text, deleted_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select e.entity_ref,
         coalesce(e.detail ->> 'memory_type', 'unknown'),
         e.created_at
    from public.yorisou_life_os_audit_events e
   where e.action = 'yorisou.life.memory.deleted'
     and e.actor_fingerprint = encode(sha256(convert_to(p_owner_account_id, 'utf8')), 'hex')
   order by e.created_at desc
   limit greatest(1, least(coalesce(p_limit, 50), 200));
$$;

-- ── 5. Grants ────────────────────────────────────────────────────────────────

do $$
declare
  v_signatures text[] := array[
    'public.yorisou_osf1_reflection_create(text, uuid, uuid, text, text, text, text, text, text, text, text, text, text, text, text, jsonb)',
    'public.yorisou_osf1_memory_set_lifecycle(text, uuid, text, jsonb)',
    'public.yorisou_osf1_memory_receipts(text, integer)'
  ];
  v_signature text;
begin
  foreach v_signature in array v_signatures loop
    execute 'revoke all on function ' || v_signature || ' from public';
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute 'revoke all on function ' || v_signature || ' from anon';
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute 'revoke all on function ' || v_signature || ' from authenticated';
    end if;
    if exists (select 1 from pg_roles where rolname = 'service_role') then
      execute 'grant execute on function ' || v_signature || ' to service_role';
    end if;
  end loop;
end $$;
