-- OSF-1 PHASE 1 COMPLETION — one migration, because the alternative is broken.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- WHY EVERYTHING IS IN ONE FILE
-- ─────────────────────────────────────────────────────────────────────────────
--
-- Four separate requirements land on the SAME three functions: the postmortem needs a new answer
-- column and the reflection mode, the memory vocabulary gains `lesson`, memory gains an edit path,
-- and the audit write for three of those mutations must become TRANSACTIONAL.
--
-- PostgreSQL overloads by signature. `create or replace function` with a different parameter list
-- creates a SECOND function rather than replacing the first, and every grant in this project is a
-- hardcoded signature string (202608140001 §9, 202608150002). Split across two migrations, the
-- second one would leave the first one's overload alive, un-granted, and audit-less — and
-- PostgREST would dispatch to whichever overload happens to match the JSON key set it is sent.
-- So: one file, every affected function dropped by its exact old signature and recreated once.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- 1. THE POSTMORTEM'S MISSING QUESTION
-- ─────────────────────────────────────────────────────────────────────────────
--
-- The completion package fixes the deep postmortem at seven questions:
--
--   1 What happened?                          -> what_happened       (exists)
--   2 What was your goal?                     -> goal_at_the_time    (exists)
--   3 What did you know at that time?         -> information_at_hand (exists)
--   4 What options did you have?              -> options_considered  *** NO COLUMN — added here ***
--   5 What decision did you make?             -> decision_made       (exists)
--   6 What happened afterward?                -> what_followed       (exists)
--   7 What will you do differently next time? -> next_time           (exists)
--
-- Only question 4 had nowhere to go, and nothing existing is a substitute: `decision_made` is what
-- was chosen, not what was available to choose from. Recording the options is the whole mechanism by
-- which a postmortem separates a decision from its outcome — a choice can only be judged against the
-- alternatives that existed at the time, not against what happened afterwards.
--
-- `why` and `what_learned` are no longer asked by either flow. They are KEPT, nullable and unused,
-- for the same reason 202608150002 kept its orphans: rows written by the earlier flow still hold
-- them, and dropping a column deletes what somebody wrote.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- 2. `mode` — A COLUMN, BECAUSE THE AUDIT ROW WAS LYING
-- ─────────────────────────────────────────────────────────────────────────────
--
-- The reflection mode was previously carried only as an audit `reason`, and it never arrived:
-- parseReflectionInput() returns only the answer fields, so `input.mode` was always undefined and
-- EVERY reflection — including every postmortem — was audited as `light`. Storing the mode on the
-- row fixes it at the source and makes it recoverable, which the audit trail alone never was:
-- an abandoned postmortem and a light reflection are byte-identical across the answer columns.
--
-- Existing rows default to 'light'. That is correct rather than convenient: the deep flow has never
-- been applied to any database, so no row that exists anywhere was written by it.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- 3. TRANSACTIONAL AUDIT — THE TRADE-OFF, STATED
-- ─────────────────────────────────────────────────────────────────────────────
--
-- docs/yorisou/osf1/OSF1_AUDIT_DELIVERY_CLASSES.md recorded that three events REQUIRE transactional
-- delivery and that implementing it needed a Founder decision, because it reverses a trade-off. The
-- completion package makes that decision: memory creation, memory deletion and reflection
-- persistence are transactional.
--
-- What that means concretely, so nobody is surprised by it later: the audit insert now happens
-- INSIDE the same transaction as the mutation. If the audit table is unavailable, THE MUTATION
-- FAILS. A person can lose a reflection because the audit trail could not be written. That is the
-- deliberate choice — for these three actions the record of what happened is judged as important as
-- the thing itself, most sharply for deletion, where after a hard delete the audit row is the only
-- remaining evidence the memory ever existed.
--
-- Everything else stays best-effort and is written by the application after the fact.
--
-- The delete audit is CONDITIONAL ON `found`. Auditing an unmatched delete would let anyone
-- manufacture a `memory.deleted` record for an id they do not own, simply by asking for it.
--
-- ─────────────────────────────────────────────────────────────────────────────
-- 4. MEMORY EDIT
-- ─────────────────────────────────────────────────────────────────────────────
--
-- A memory can now be edited, and editing re-confirms. The digest of the NEW sentence must be
-- supplied and must match what gets stored, exactly as at creation — because an edit replaces the
-- sentence the person agreed to, so it needs the same act of agreement. There is deliberately no
-- way to edit `memory_type`, `source`, or any subject link: those are what the memory IS, and
-- changing them would silently turn one memory into a different one under the same id.
--
-- RETENTION_POLICY_TBD is unchanged by this migration. No retention period is set or assumed.
--
-- ROLLBACK — and it must drop EVERY function this file created, by its exact new signature.
--
-- This is not defensive tidiness. 202608140001 §8 and 202608150002 re-create their functions with
-- `create or replace` and the OLD parameter lists, which in PostgreSQL ADDS an overload rather than
-- replacing anything. If the new signatures are still present when they run, each name ends up with
-- two live, granted bodies — one of which writes no audit row — and PostgREST dispatches to
-- whichever matches the JSON key set it is sent. That is precisely the state the top of this file
-- argues must never exist, and tests/life-os/postgres-acceptance.sh asserts against.
--
-- The column drops come LAST for the same reason: PostgreSQL does not track a plpgsql body's
-- dependency on a column, so dropping `mode` while a function that inserts into it survives would
-- succeed silently and break every reflection save instead of restoring service.
--
--   begin;
--   drop function if exists public.yorisou_osf1_reflection_create(text, uuid, text, text, text, text, text, text, text, text, text, text, text, text, jsonb);
--   drop function if exists public.yorisou_osf1_memory_confirm(text, text, text, text, text, boolean, uuid, uuid, uuid, jsonb);
--   drop function if exists public.yorisou_osf1_memory_delete(text, uuid, jsonb);
--   drop function if exists public.yorisou_osf1_memory_update(text, uuid, text, text, jsonb);
--   -- then re-apply 202608140001 §8 and §9 and 202608150002 to restore the previous bodies AND their
--   -- grants; only after that, and only if the columns are genuinely unwanted:
--   alter table public.yorisou_life_reflections drop column if exists options_considered;
--   alter table public.yorisou_life_reflections drop column if exists mode;
--   commit;
--
--   Both column drops are LOSSY: they delete what somebody wrote. The added columns are otherwise
--   inert and can be left in place, which is the safer rollback.
--
-- Afterwards, re-run the overload check before anything writes:
--   select proname, count(*) from pg_proc where proname like 'yorisou_osf1_%' group by 1 having count(*) > 1;

-- ONE TRANSACTION, like 202608140002. Every statement below either lands or none does.
--
-- Without it a partial apply is genuinely dangerous rather than merely incomplete: the grant block is
-- LAST, so a failure between creating the four SECURITY DEFINER functions and revoking PUBLIC on
-- them would leave functions that run as their owner executable by every role — including anon.
begin;

-- ── 1. Columns ───────────────────────────────────────────────────────────────

alter table public.yorisou_life_reflections
  add column if not exists options_considered text;
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'yorisou_life_reflections_options_chk'
  ) then
    alter table public.yorisou_life_reflections
      add constraint yorisou_life_reflections_options_chk
      check (options_considered is null or length(options_considered) <= 2000);
  end if;
end $$;

alter table public.yorisou_life_reflections
  add column if not exists mode text not null default 'light';
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'yorisou_life_reflections_mode_chk'
  ) then
    alter table public.yorisou_life_reflections
      add constraint yorisou_life_reflections_mode_chk check (mode in ('light', 'postmortem'));
  end if;
end $$;

comment on column public.yorisou_life_reflections.mode is
  'Which flow wrote this row: light (5 questions) or postmortem (7). Stored because the two are otherwise indistinguishable — an abandoned postmortem and a light reflection have the same non-null columns.';
comment on column public.yorisou_life_reflections.options_considered is
  'Postmortem question 4: what options existed at the time. A decision can only be judged against the alternatives that were actually available.';

-- `lesson` completes the memory vocabulary. A lesson is not a preference, a goal, an experience or
-- a reflection: it is what someone concluded, which is the one kind of memory a reflection most
-- often produces and the one the flow could not previously store.
alter table public.yorisou_explicit_memories
  drop constraint if exists yorisou_explicit_memories_type_chk;
alter table public.yorisou_explicit_memories
  add constraint yorisou_explicit_memories_type_chk
  check (memory_type in ('preference', 'goal', 'experience', 'reflection', 'lesson'));

-- ── 2. Old signatures, dropped by exact arity ────────────────────────────────
--
-- Dropped, not replaced. See the header: a differing parameter list would create an overload.

drop function if exists public.yorisou_osf1_reflection_create(
  text, uuid, text, text, text, text, text, text, text, text, text, text);
drop function if exists public.yorisou_osf1_memory_confirm(
  text, text, text, text, text, boolean, uuid, uuid, uuid);
drop function if exists public.yorisou_osf1_memory_delete(text, uuid);

-- ── 3. Reflection create — mode, options, transactional audit ────────────────

create or replace function public.yorisou_osf1_reflection_create(
  p_owner_account_id text,
  p_experience_id uuid,
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
  insert into public.yorisou_life_reflections
    (owner_account_id, experience_id, mode, what_happened, felt, tried, what_followed, next_time,
     goal_at_the_time, information_at_hand, options_considered, decision_made, why, what_learned)
  values
    (p_owner_account_id, p_experience_id, v_mode, btrim(p_what_happened),
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
  -- TRANSACTIONAL. Same transaction as the insert above: if this raises, the reflection is not
  -- written. The reason code is the mode, which is exactly the fact the audit row exists to carry.
  perform public.yorisou_osf1_audit_write(
    p_owner_account_id, 'yorisou.life.reflection.created', 'reflection', v_id, v_mode,
    coalesce(p_audit_detail, '{}'::jsonb));
  return v_id;
end;
$$;

-- ── 4. Memory confirm — lesson, transactional audit ──────────────────────────

create or replace function public.yorisou_osf1_memory_confirm(
  p_owner_account_id text,
  p_memory_type text,
  p_content text,
  p_source text,
  p_confirmation_digest text,
  p_user_confirmed boolean,
  p_subject_goal_id uuid,
  p_subject_experience_id uuid,
  p_subject_reflection_id uuid,
  p_audit_detail jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_content text;
  v_digest text;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'osf1_owner_required';
  end if;
  if p_user_confirmed is distinct from true then
    raise exception 'osf1_memory_requires_confirmation';
  end if;
  if p_memory_type not in ('preference', 'goal', 'experience', 'reflection', 'lesson') then
    raise exception 'osf1_memory_type_invalid';
  end if;
  if p_source not in ('user_statement', 'user_confirmed_ai_suggestion') then
    raise exception 'osf1_memory_source_invalid';
  end if;
  v_content := nullif(btrim(coalesce(p_content, '')), '');
  if v_content is null then
    raise exception 'osf1_memory_content_required';
  end if;
  v_digest := encode(sha256(convert_to(v_content, 'utf8')), 'hex');
  if p_confirmation_digest is distinct from v_digest then
    raise exception 'osf1_memory_confirmation_mismatch';
  end if;
  if p_subject_goal_id is not null and not exists (
    select 1 from public.yorisou_goals where id = p_subject_goal_id and owner_account_id = p_owner_account_id
  ) then
    raise exception 'osf1_subject_not_owned';
  end if;
  if p_subject_experience_id is not null and not exists (
    select 1 from public.yorisou_experience_cards where id = p_subject_experience_id and owner_account_id = p_owner_account_id
  ) then
    raise exception 'osf1_subject_not_owned';
  end if;
  if p_subject_reflection_id is not null and not exists (
    select 1 from public.yorisou_life_reflections where id = p_subject_reflection_id and owner_account_id = p_owner_account_id
  ) then
    raise exception 'osf1_subject_not_owned';
  end if;
  insert into public.yorisou_explicit_memories
    (owner_account_id, memory_type, content, source, user_confirmed, confirmation_digest,
     subject_goal_id, subject_experience_id, subject_reflection_id)
  values
    (p_owner_account_id, p_memory_type, v_content, p_source, true, v_digest,
     p_subject_goal_id, p_subject_experience_id, p_subject_reflection_id)
  returning id into v_id;
  -- TRANSACTIONAL. Confirming a memory is a consent act; the audit row is the record of the
  -- agreement, and consent governance requires an event for every consent-relevant mutation.
  perform public.yorisou_osf1_audit_write(
    p_owner_account_id, 'yorisou.life.memory.confirmed', 'memory', v_id, p_source,
    coalesce(p_audit_detail, '{}'::jsonb) || jsonb_build_object('memory_type', p_memory_type));
  return v_id;
end;
$$;

-- ── 5. Memory delete — transactional audit, conditional on a real deletion ───

create or replace function public.yorisou_osf1_memory_delete(
  p_owner_account_id text,
  p_memory_id uuid,
  p_audit_detail jsonb default '{}'::jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_type text;
  v_deleted boolean;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'osf1_owner_required';
  end if;
  delete from public.yorisou_explicit_memories
   where id = p_memory_id and owner_account_id = p_owner_account_id
   returning memory_type into v_type;
  v_deleted := found;
  -- CONDITIONAL, and that is the point. Auditing an unmatched delete would let anyone manufacture a
  -- `memory.deleted` record for an id they do not own just by asking for it — the audit table is
  -- append-only, so a false entry could never be removed.
  if v_deleted then
    -- TRANSACTIONAL. After a hard delete this row is the ONLY evidence the memory existed or that
    -- the person asked for it to go. It stores the memory TYPE, never the content: the trace must
    -- not resurrect what the deletion removed.
    perform public.yorisou_osf1_audit_write(
      p_owner_account_id, 'yorisou.life.memory.deleted', 'memory', p_memory_id, 'user_requested',
      coalesce(p_audit_detail, '{}'::jsonb) || jsonb_build_object('memory_type', v_type));
  end if;
  return v_deleted;
end;
$$;

-- ── 6. Memory update — edit with re-confirmation ─────────────────────────────

create or replace function public.yorisou_osf1_memory_update(
  p_owner_account_id text,
  p_memory_id uuid,
  p_content text,
  p_confirmation_digest text,
  p_audit_detail jsonb default '{}'::jsonb
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_content text;
  v_digest text;
  v_updated boolean;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'osf1_owner_required';
  end if;
  v_content := nullif(btrim(coalesce(p_content, '')), '');
  if v_content is null then
    raise exception 'osf1_memory_content_required';
  end if;
  -- An edit REPLACES the sentence the person agreed to, so it needs the same act of agreement the
  -- original required. Same construction as memory_confirm: the digest is recomputed here, over the
  -- bytes that will actually be stored.
  v_digest := encode(sha256(convert_to(v_content, 'utf8')), 'hex');
  if p_confirmation_digest is distinct from v_digest then
    raise exception 'osf1_memory_confirmation_mismatch';
  end if;
  -- memory_type, source and every subject link are deliberately not updatable: they are what the
  -- memory IS. Changing them under a stable id would turn one memory into a different one.
  update public.yorisou_explicit_memories
     set content = v_content,
         confirmation_digest = v_digest,
         updated_at = now()
   where id = p_memory_id and owner_account_id = p_owner_account_id;
  v_updated := found;
  if v_updated then
    -- TRANSACTIONAL, on the same reasoning as deletion: an edit destroys the previous sentence, and
    -- afterwards nothing else records that it was ever different.
    perform public.yorisou_osf1_audit_write(
      p_owner_account_id, 'yorisou.life.memory.updated', 'memory', p_memory_id, 'user_edited',
      coalesce(p_audit_detail, '{}'::jsonb));
  end if;
  return v_updated;
end;
$$;

-- ── 7. Grants — every new signature, service_role only ───────────────────────

do $$
declare
  v_signatures text[] := array[
    'public.yorisou_osf1_reflection_create(text, uuid, text, text, text, text, text, text, text, text, text, text, text, text, jsonb)',
    'public.yorisou_osf1_memory_confirm(text, text, text, text, text, boolean, uuid, uuid, uuid, jsonb)',
    'public.yorisou_osf1_memory_delete(text, uuid, jsonb)',
    'public.yorisou_osf1_memory_update(text, uuid, text, text, jsonb)'
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

commit;
