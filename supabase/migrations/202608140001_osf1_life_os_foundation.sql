-- OSF-1 — YORISOU OS Foundation Phase 1 (Life OS Foundation MVP).
--
-- WHAT THIS ADDS, AND WHY IT IS NOT A DUPLICATE OF WHAT ALREADY EXISTS
--
-- Phase 1 names six entities. Two of them already exist in built form and are REUSED, not rebuilt:
--
--   Experience — public.yorisou_experience_cards (202607110002) is a complete, Production-tracked
--     vertical with revisions, consents, invites, reports, blocks and moderation. Phase 1 adds the
--     two fields it genuinely lacks (title, lesson) to that table. It does NOT create a second
--     experience table.
--   AI reflection on a saved test result — public.yorisou_ai_reflections (202607110001) stays as it
--     is. Phase 1's Reflection is a DIFFERENT thing: a user-authored guided reflection, written by
--     the person, about something that happened. Both are called "reflection" in English; they are
--     not the same record and are deliberately not merged.
--
-- Four are genuinely absent and are created here: user context, current-state record, goal, and
-- the user-authored reflection. Explicit memory is created here too — see the note on its table.
--
-- WHAT THIS DELIBERATELY DOES NOT TOUCH
--
-- public.yorisou_daily_state_records (DCI-1) is a bounded private-pilot domain under
-- `resources/governance/current/annex/PRODUCTION_DATA_MODEL_AUTHORITY.md` §"Bounded Private
-- Method-State Pilot Schema Authority". That annex states the six DCI/YV tables are "not a
-- general-purpose memory subsystem" and that "any future conversion of DCI/YV state into another
-- domain requires explicit user action and a separately authorized package". Phase 1's
-- current-state record therefore does not read, extend, alias or migrate DCI-1 rows. Nothing in
-- this migration backfills any existing user data into any table it creates — the cross-cutting
-- hard rule ("no existing user data is ever reinterpreted as memory or consent") is satisfied
-- structurally, because every table below starts empty and only accepts rows created by a live
-- user action.
--
-- ACCESS ARCHITECTURE — the DCI-1.1 model, unchanged:
--   DIRECT_USER_DENY + SERVER_REPOSITORY_OWNER_SCOPE + RPC_ONLY_DATABASE_MUTATION
-- RLS is ENABLED on every table. There are intentionally no authenticated-user policies: app auth
-- is cookie-based and no user JWT ever reaches PostgREST. Direct table access is
-- public/anon/authenticated = none, service_role = SELECT ONLY. Every write goes through a bounded
-- SECURITY DEFINER RPC, so application code holding the service-role key cannot insert, update or
-- delete any row here directly.
--
-- ERASURE: these tables carry owner_account_id and are erased at account deletion. That is NOT
-- automatic — POR-1's erasure plan is a hardcoded array, so a table it does not name survives
-- account deletion. Migration 202608140002 adds every table below to that plan, and
-- lib/server/__tests__/osf1ErasureCoverage.test.ts fails if a future owner-linked table is added
-- without being registered.
--
-- ROLLBACK (see docs/product/YORISOU_OS_FOUNDATION_PHASE1.md §Rollback):
--   drop function if exists public.yorisou_osf1_memory_delete(text, uuid);
--   drop function if exists public.yorisou_osf1_memory_confirm(text, text, text, text, text, boolean, uuid, uuid, uuid);
--   drop function if exists public.yorisou_osf1_reflection_create(text, uuid, text, text, text, text, text, text, text, text);
--   drop function if exists public.yorisou_osf1_goal_set_status(text, uuid, text);
--   drop function if exists public.yorisou_osf1_goal_create(text, text, text);
--   drop function if exists public.yorisou_osf1_current_state_set_reflection(text, uuid, text);
--   drop function if exists public.yorisou_osf1_current_state_create(text, text[], text, text, text, text, text);
--   drop function if exists public.yorisou_osf1_user_context_upsert(text, text, text, text, jsonb);
--   drop function if exists public.yorisou_osf1_state_vocabulary();
--   drop table if exists public.yorisou_explicit_memories;
--   drop table if exists public.yorisou_life_reflections;
--   drop table if exists public.yorisou_goals;
--   drop table if exists public.yorisou_current_state_records;
--   drop table if exists public.yorisou_user_contexts;
--   alter table public.yorisou_experience_cards drop constraint if exists yorisou_experience_cards_shared_context_chk;
--   -- restoring the NOT NULLs requires no PRIVATE card to hold a null in them; see §Rollback in the doc
--   alter table public.yorisou_experience_cards drop column if exists lesson;
--   alter table public.yorisou_experience_cards drop column if exists title;

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. UserContext — the settings a person chooses for themselves.
--
-- This is a preferences record, not a profile. Nothing writes to it except the person: there is no
-- inference path, no derived field, and no "learned" value. preferences_json is bounded in size and
-- its keys are checked against an allowlist in the RPC, so it cannot quietly become a behavioural
-- profile store.
create table if not exists public.yorisou_user_contexts (
  id uuid primary key default gen_random_uuid(),
  owner_account_id text not null,
  language text not null default 'ja'
    constraint yorisou_user_contexts_language_chk check (language in ('ja', 'en')),
  region text
    constraint yorisou_user_contexts_region_chk check (region is null or length(region) between 1 and 64),
  timezone text not null default 'Asia/Tokyo'
    constraint yorisou_user_contexts_timezone_chk check (length(timezone) between 1 and 64),
  preferences_json jsonb not null default '{}'::jsonb
    constraint yorisou_user_contexts_preferences_chk
    check (jsonb_typeof(preferences_json) = 'object' and pg_column_size(preferences_json) <= 4096),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint yorisou_user_contexts_owner_unique unique (owner_account_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. CurrentStateRecord — "how things are right now", as the person described it.
--
-- state_tags is a BOUNDED vocabulary, not free text, and it is validated in the RPC against the
-- same option ids the Today check-in already uses (lib/yorisou/today/currentStateCheckIn.ts). A
-- bounded vocabulary is the reason this record cannot accumulate into a judgement: there is no
-- score, no streak, no counter, and no field that any inference reads.
--
-- Unlike DCI-1 this is NOT one-row-per-day: a person may check in more than once, and an earlier
-- entry is never overwritten or re-bucketed by a later one.
--
-- ─── THE BOUNDARY THAT MATTERS MOST: THIS IS NOT AN IMAIRO RESULT ───
--
--   CurrentStateRecord = TEMPORAL DAILY USER STATE.
--     What the person said about right now, in their own bounded words, at one moment. Nothing
--     computed it. It carries no method id, no method version, no scoring version, no dimension, no
--     archetype and no persona. It expires from relevance on its own — tomorrow's answer does not
--     correct today's, it is simply a different day.
--
--   Imairo Result = METHODOLOGY ASSESSMENT OUTPUT.
--     Produced by the 120-question pipeline (app/tests/ima-iro/currentStateCheckV1.ts), carrying
--     method identity, a scoring version and a named result, stored in
--     public.yorisou_assessment_results / public.yorisou_test_results under its own governed
--     acceptance, correction and tombstoned-erasure contract (lib/server/canonicalPrivateState.ts,
--     lib/server/assessmentAttemptStore.ts).
--
-- THE TWO ARE NEVER CONVERTED IN EITHER DIRECTION. No column here holds a result id. No scoring code
-- reads this table. Nothing in this migration writes to, reads from, or backfills either assessment
-- table. A future change that lets one become the other — "show the person's state on the result
-- page", "seed a check-in from their last result" — is a methodology change and needs its own
-- Founder authorization, because it would let a two-tap answer be read as a 120-question finding, or
-- a 120-question finding be silently rewritten by a tap.
--
-- NAMING COLLISION, ON PURPOSE AND WORTH KNOWING. The `reflection` column below is the THIRD distinct
-- thing this schema calls a reflection, and it is the smallest of them:
--   * THIS column          — an optional free-text note the person adds to one check-in.
--   * yorisou_life_reflections — the seven-question guided reflection they write about an event.
--   * yorisou_ai_reflections   — AI-generated commentary on a saved TEST RESULT (202607110001).
-- They share a word and nothing else. None reads another.
create table if not exists public.yorisou_current_state_records (
  id uuid primary key default gen_random_uuid(),
  owner_account_id text not null,
  state_tags text[] not null
    constraint yorisou_current_state_records_tags_chk
    check (array_length(state_tags, 1) between 1 and 5),
  mood text
    constraint yorisou_current_state_records_mood_chk
    check (mood is null or mood in ('calm', 'unsettled', 'heavy', 'tired', 'bright', 'unsure')),
  energy text
    constraint yorisou_current_state_records_energy_chk
    check (energy is null or energy in ('low', 'steady', 'high')),
  situation text
    constraint yorisou_current_state_records_situation_chk
    check (situation is null or length(situation) between 1 and 500),
  reflection text
    constraint yorisou_current_state_records_reflection_chk
    check (reflection is null or length(reflection) between 1 and 1000),
  source text not null
    constraint yorisou_current_state_records_source_chk
    check (source in ('today_check_in', 'manual')),
  created_at timestamptz not null default now()
);
create index if not exists yorisou_current_state_records_owner_recent
  on public.yorisou_current_state_records (owner_account_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Goal — a direction the person wants to hold, not a task with a deadline.
--
-- The status vocabulary is deliberate. There is no "failed" and no "overdue", because the approved
-- writing rules prohibit goal-setting language that pressures commitment
-- (docs/report-main-state-mode-writing-rules-v0.2.md) and require "an orienting direction (not a
-- goal list)" (docs/report-generation-quality-gate-v0.2.md). 'released' is 手放す — deciding to let
-- something go is a legitimate outcome here, not an abandonment.
--
-- There is no progress field, no percentage, no due date and no reminder. Adding one would turn
-- this table into the pressure device the doctrine forbids.
create table if not exists public.yorisou_goals (
  id uuid primary key default gen_random_uuid(),
  owner_account_id text not null,
  title text not null
    constraint yorisou_goals_title_chk check (length(title) between 1 and 120),
  description text
    constraint yorisou_goals_description_chk check (description is null or length(description) <= 1000),
  status text not null default 'active'
    constraint yorisou_goals_status_chk check (status in ('active', 'paused', 'achieved', 'released')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists yorisou_goals_owner_recent
  on public.yorisou_goals (owner_account_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Reflection — the user-authored guided reflection (seven questions).
--
-- Column ↔ question mapping, fixed and 1:1 (see docs/product/YORISOU_OS_FOUNDATION_PHASE1.md):
--   1 何が起きましたか                      → what_happened      (required)
--   2 そのとき何を望んでいましたか            → goal_at_the_time
--   3 そのとき何がわかっていましたか          → information_at_hand
--   4 どんな選択をしましたか / なぜ           → decision_made / why
--   5 そのあと何が起きましたか                → what_followed
--   6 そこから何に気づきましたか              → what_learned
--   7 次に同じことがあったら                  → next_time
--
-- Only the first is required. A reflection a person abandoned halfway is still theirs to keep, and
-- demanding all seven answers would make the calm flow into a form.
--
-- experience_id is `on delete set null`: deleting an experience must not silently delete the
-- reflection someone wrote about it.
create table if not exists public.yorisou_life_reflections (
  id uuid primary key default gen_random_uuid(),
  owner_account_id text not null,
  experience_id uuid references public.yorisou_experience_cards (id) on delete set null,
  what_happened text not null
    constraint yorisou_life_reflections_what_happened_chk check (length(what_happened) between 1 and 2000),
  goal_at_the_time text
    constraint yorisou_life_reflections_goal_chk check (goal_at_the_time is null or length(goal_at_the_time) <= 2000),
  information_at_hand text
    constraint yorisou_life_reflections_information_chk check (information_at_hand is null or length(information_at_hand) <= 2000),
  decision_made text
    constraint yorisou_life_reflections_decision_chk check (decision_made is null or length(decision_made) <= 2000),
  why text
    constraint yorisou_life_reflections_why_chk check (why is null or length(why) <= 2000),
  what_followed text
    constraint yorisou_life_reflections_followed_chk check (what_followed is null or length(what_followed) <= 2000),
  what_learned text
    constraint yorisou_life_reflections_learned_chk check (what_learned is null or length(what_learned) <= 2000),
  next_time text
    constraint yorisou_life_reflections_next_time_chk check (next_time is null or length(next_time) <= 2000),
  created_at timestamptz not null default now()
);
create index if not exists yorisou_life_reflections_owner_recent
  on public.yorisou_life_reflections (owner_account_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Memory — explicit, user-confirmed only.
--
-- Why a new table rather than public.yorisou_private_memory_items: that table is the private-AI
-- subsystem's memory, anchored to a saved TEST RESULT (saved_result_id / reflection_id) with a
-- nine-value type vocabulary about test-result interactions. Phase 1's memory is anchored to the
-- life-OS entities above. Widening one table to cover both would mean adding four type values and
-- three foreign keys to a Production table whose meaning is "private AI notes about a test result"
-- — which is how a store stops meaning anything. The two remain separate and neither reads the
-- other.
--
-- THE CONFIRMATION GUARANTEE IS STRUCTURAL, NOT PROCEDURAL.
--
-- `check (user_confirmed = true)` means an unconfirmed memory cannot exist in this table — not
-- "should not", cannot. There is no pending state and no candidate row: a suggestion the person has
-- not confirmed lives only in the response body they are looking at, and is gone if they close the
-- page. That satisfies "no automatic persistence" at the storage layer, where it cannot be
-- forgotten by a later caller.
--
-- confirmation_digest is the sha256 of the content string the client rendered in the confirmation
-- dialog. The RPC recomputes it from the content being stored and rejects a mismatch.
--
-- BE PRECISE ABOUT WHAT THAT BUYS. The digest is unkeyed and the same caller supplies both the
-- content and the digest, so it does NOT prove a person saw the sentence — no value a client sends
-- can prove that. It rules out the accident: a candidate mutated between render and save, a stale
-- candidate replayed against edited text, a caller that saves a different field from the one it
-- displayed. The load-bearing guarantee is the check constraint above, which makes an unconfirmed
-- row impossible regardless of what any caller claims.
create table if not exists public.yorisou_explicit_memories (
  id uuid primary key default gen_random_uuid(),
  owner_account_id text not null,
  memory_type text not null
    constraint yorisou_explicit_memories_type_chk
    check (memory_type in ('preference', 'goal', 'experience', 'reflection')),
  content text not null
    constraint yorisou_explicit_memories_content_chk check (length(content) between 1 and 2000),
  source text not null
    constraint yorisou_explicit_memories_source_chk
    check (source in ('user_statement', 'user_confirmed_ai_suggestion')),
  user_confirmed boolean not null default false
    constraint yorisou_explicit_memories_confirmed_chk check (user_confirmed = true),
  confirmation_digest text not null
    constraint yorisou_explicit_memories_digest_chk check (confirmation_digest ~ '^[0-9a-f]{64}$'),
  subject_goal_id uuid references public.yorisou_goals (id) on delete set null,
  subject_experience_id uuid references public.yorisou_experience_cards (id) on delete set null,
  subject_reflection_id uuid references public.yorisou_life_reflections (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists yorisou_explicit_memories_owner_recent
  on public.yorisou_explicit_memories (owner_account_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Experience — two additive columns on the EXISTING table.
--
-- action_taken and outcome in the Phase 1 spec are the existing action_tried and perceived_outcome.
-- Only title and lesson are genuinely new. Both are nullable, so every existing row stays valid.
alter table public.yorisou_experience_cards
  add column if not exists title text;
alter table public.yorisou_experience_cards
  add column if not exists lesson text;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'yorisou_experience_cards_title_chk') then
    alter table public.yorisou_experience_cards
      add constraint yorisou_experience_cards_title_chk
      check (title is null or length(title) between 1 and 120);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'yorisou_experience_cards_lesson_chk') then
    alter table public.yorisou_experience_cards
      add constraint yorisou_experience_cards_lesson_chk
      check (lesson is null or length(lesson) <= 1000);
  end if;
end $$;

-- The four sharing-context columns become required-WHEN-SHARED rather than always-required.
--
-- state_context, limitations, may_fit and may_not_fit exist so that a stranger reading someone
-- else's account of what helped them cannot mistake it for advice. They are the safety contract of
-- the community surface. A PRIVATE card has no reader but its author, and requiring someone to write
-- 「誰には合わないか」 before they may keep a note for themselves asks them to annotate their own
-- memory for an audience that does not exist.
--
-- So the NOT NULL becomes a conditional check. Every existing row satisfies it: they are all
-- non-null today, and the shared branch is exactly the old requirement. Nothing about what a SHARED
-- card must contain is relaxed.
alter table public.yorisou_experience_cards alter column state_context drop not null;
alter table public.yorisou_experience_cards alter column limitations drop not null;
alter table public.yorisou_experience_cards alter column may_fit drop not null;
alter table public.yorisou_experience_cards alter column may_not_fit drop not null;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'yorisou_experience_cards_shared_context_chk') then
    alter table public.yorisou_experience_cards
      add constraint yorisou_experience_cards_shared_context_chk
      check (
        visibility = 'PRIVATE'
        or (state_context is not null and limitations is not null
            and may_fit is not null and may_not_fit is not null)
      );
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Privilege matrix (DCI-1.1 §4, applied unchanged).
--      public/anon/authenticated : NO access
--      service_role              : SELECT ONLY
--      mutation                  : SECURITY DEFINER RPCs exclusively
alter table public.yorisou_user_contexts enable row level security;
alter table public.yorisou_current_state_records enable row level security;
alter table public.yorisou_goals enable row level security;
alter table public.yorisou_life_reflections enable row level security;
alter table public.yorisou_explicit_memories enable row level security;

revoke all on table
  public.yorisou_user_contexts,
  public.yorisou_current_state_records,
  public.yorisou_goals,
  public.yorisou_life_reflections,
  public.yorisou_explicit_memories
from public;

do $$
declare
  v_tables text := 'public.yorisou_user_contexts, public.yorisou_current_state_records, '
                || 'public.yorisou_goals, public.yorisou_life_reflections, '
                || 'public.yorisou_explicit_memories';
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table ' || v_tables || ' from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table ' || v_tables || ' from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'revoke all on table ' || v_tables || ' from service_role';
    execute 'grant select on table ' || v_tables || ' to service_role';
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. Mutation RPCs. Every one is SECURITY DEFINER, owner-scoped, and validates its own inputs in
--    the database — not only in the API route — so a future caller cannot widen the contract by
--    forgetting a check.

-- The bounded state vocabulary, kept in one place. Mirrors the option ids in
-- lib/yorisou/today/currentStateCheckIn.ts; lib/server/__tests__/osf1Contract.test.ts fails
-- if the two drift apart.
create or replace function public.yorisou_osf1_state_vocabulary()
returns text[]
language sql
immutable
as $$
  select array[
    'unsettled', 'busy-mind', 'heavy', 'steady', 'unsure',
    'rest', 'sort-out', 'shift', 'understand', 'undecided'
  ];
$$;

create or replace function public.yorisou_osf1_user_context_upsert(
  p_owner_account_id text,
  p_language text,
  p_region text,
  p_timezone text,
  p_preferences_json jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_key text;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'osf1_owner_required';
  end if;
  if p_preferences_json is not null then
    -- Allowlist. preferences_json holds display choices the person made, and nothing else; an
    -- unknown key is refused rather than stored, so this cannot drift into a profile.
    for v_key in select jsonb_object_keys(p_preferences_json) loop
      if v_key not in ('reduced_motion', 'text_size', 'quiet_hours', 'default_visibility') then
        raise exception 'osf1_preference_key_not_allowed:%', v_key;
      end if;
    end loop;
  end if;
  insert into public.yorisou_user_contexts
    (owner_account_id, language, region, timezone, preferences_json)
  values
    (p_owner_account_id,
     coalesce(p_language, 'ja'),
     p_region,
     coalesce(p_timezone, 'Asia/Tokyo'),
     coalesce(p_preferences_json, '{}'::jsonb))
  on conflict (owner_account_id) do update
    set language = coalesce(excluded.language, public.yorisou_user_contexts.language),
        region = excluded.region,
        timezone = coalesce(excluded.timezone, public.yorisou_user_contexts.timezone),
        preferences_json = excluded.preferences_json,
        updated_at = now()
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.yorisou_osf1_current_state_create(
  p_owner_account_id text,
  p_state_tags text[],
  p_mood text,
  p_energy text,
  p_situation text,
  p_reflection text,
  p_source text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_tag text;
  v_vocabulary text[] := public.yorisou_osf1_state_vocabulary();
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'osf1_owner_required';
  end if;
  if p_state_tags is null or array_length(p_state_tags, 1) is null then
    raise exception 'osf1_state_tags_required';
  end if;
  foreach v_tag in array p_state_tags loop
    if not (v_tag = any (v_vocabulary)) then
      raise exception 'osf1_state_tag_not_recognised:%', v_tag;
    end if;
  end loop;
  if (select count(distinct t) from unnest(p_state_tags) t) <> array_length(p_state_tags, 1) then
    raise exception 'osf1_state_tags_duplicated';
  end if;
  insert into public.yorisou_current_state_records
    (owner_account_id, state_tags, mood, energy, situation, reflection, source)
  values
    (p_owner_account_id, p_state_tags, p_mood, p_energy,
     nullif(btrim(coalesce(p_situation, '')), ''),
     nullif(btrim(coalesce(p_reflection, '')), ''),
     coalesce(p_source, 'manual'))
  returning id into v_id;
  return v_id;
end;
$$;

-- The optional note a person adds AFTER the two bounded check-in questions.
--
-- Write-once, not an edit: it may only be set while `reflection` is null. The check-in flow asks
-- nothing and requires nothing (see lib/yorisou/today/currentStateCheckIn.ts on why free text is not
-- part of the questions themselves), so this exists to let someone add a line if they want to — not
-- to make the record editable afterwards, which would make the timestamp a lie.
create or replace function public.yorisou_osf1_current_state_set_reflection(
  p_owner_account_id text,
  p_record_id uuid,
  p_reflection text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reflection text;
begin
  v_reflection := nullif(btrim(coalesce(p_reflection, '')), '');
  if v_reflection is null then
    raise exception 'osf1_reflection_text_required';
  end if;
  update public.yorisou_current_state_records
     set reflection = v_reflection
   where id = p_record_id
     and owner_account_id = p_owner_account_id
     and reflection is null;
  return found;
end;
$$;

create or replace function public.yorisou_osf1_goal_create(
  p_owner_account_id text,
  p_title text,
  p_description text
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
    raise exception 'osf1_owner_required';
  end if;
  if nullif(btrim(coalesce(p_title, '')), '') is null then
    raise exception 'osf1_goal_title_required';
  end if;
  insert into public.yorisou_goals (owner_account_id, title, description)
  values (p_owner_account_id, btrim(p_title), nullif(btrim(coalesce(p_description, '')), ''))
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.yorisou_osf1_goal_set_status(
  p_owner_account_id text,
  p_goal_id uuid,
  p_status text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_status not in ('active', 'paused', 'achieved', 'released') then
    raise exception 'osf1_goal_status_invalid';
  end if;
  update public.yorisou_goals
     set status = p_status, updated_at = now()
   where id = p_goal_id and owner_account_id = p_owner_account_id;
  return found;
end;
$$;

create or replace function public.yorisou_osf1_reflection_create(
  p_owner_account_id text,
  p_experience_id uuid,
  p_what_happened text,
  p_goal_at_the_time text,
  p_information_at_hand text,
  p_decision_made text,
  p_why text,
  p_what_followed text,
  p_what_learned text,
  p_next_time text
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
    raise exception 'osf1_owner_required';
  end if;
  if nullif(btrim(coalesce(p_what_happened, '')), '') is null then
    raise exception 'osf1_reflection_what_happened_required';
  end if;
  -- A reflection may only be attached to an experience the same person owns. Without this check a
  -- caller could link their reflection to someone else's card and learn that the id exists.
  if p_experience_id is not null then
    if not exists (
      select 1 from public.yorisou_experience_cards
       where id = p_experience_id and owner_account_id = p_owner_account_id
    ) then
      raise exception 'osf1_experience_not_owned';
    end if;
  end if;
  insert into public.yorisou_life_reflections
    (owner_account_id, experience_id, what_happened, goal_at_the_time, information_at_hand,
     decision_made, why, what_followed, what_learned, next_time)
  values
    (p_owner_account_id, p_experience_id, btrim(p_what_happened),
     nullif(btrim(coalesce(p_goal_at_the_time, '')), ''),
     nullif(btrim(coalesce(p_information_at_hand, '')), ''),
     nullif(btrim(coalesce(p_decision_made, '')), ''),
     nullif(btrim(coalesce(p_why, '')), ''),
     nullif(btrim(coalesce(p_what_followed, '')), ''),
     nullif(btrim(coalesce(p_what_learned, '')), ''),
     nullif(btrim(coalesce(p_next_time, '')), ''))
  returning id into v_id;
  return v_id;
end;
$$;

-- MEMORY CONFIRM — the only way a memory row can come into existence.
--
-- There is no create-without-confirm counterpart, on purpose. p_user_confirmed is not a flag that
-- gets stored; it is a precondition that must be true for the function to proceed at all, and the
-- digest must match the content being stored. Both are checked here rather than in the API route,
-- because the route is one caller and this is the contract.
create or replace function public.yorisou_osf1_memory_confirm(
  p_owner_account_id text,
  p_memory_type text,
  p_content text,
  p_source text,
  p_confirmation_digest text,
  p_user_confirmed boolean,
  p_subject_goal_id uuid,
  p_subject_experience_id uuid,
  p_subject_reflection_id uuid
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
  if p_memory_type not in ('preference', 'goal', 'experience', 'reflection') then
    raise exception 'osf1_memory_type_invalid';
  end if;
  if p_source not in ('user_statement', 'user_confirmed_ai_suggestion') then
    raise exception 'osf1_memory_source_invalid';
  end if;
  v_content := nullif(btrim(coalesce(p_content, '')), '');
  if v_content is null then
    raise exception 'osf1_memory_content_required';
  end if;
  -- The person confirmed a specific sentence. Recomputing the digest here means the sentence that
  -- gets stored is the sentence they read.
  -- Built-in sha256(bytea), matching 202608010106; pgcrypto's digest() is not used because on
  -- Supabase it lives in the `extensions` schema and would not resolve under `search_path = public`.
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
  return v_id;
end;
$$;

-- A person can always remove their own memory. Deletion is a hard delete: there is no hidden copy.
create or replace function public.yorisou_osf1_memory_delete(
  p_owner_account_id text,
  p_memory_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.yorisou_explicit_memories
   where id = p_memory_id and owner_account_id = p_owner_account_id;
  return found;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. RPC permissions: service-role execute only for every MUTATION rpc.
--
-- yorisou_osf1_state_vocabulary() is deliberately absent from the list below and keeps the default
-- PUBLIC EXECUTE. It is `immutable`, takes no argument, touches no table and returns a constant
-- array of ten option ids that are already shipped to every browser in lib/life-os/contract.ts.
-- Naming the exception here rather than letting the section header imply a stricter rule than the
-- code enforces.
do $$
declare
  v_signatures text[] := array[
    'public.yorisou_osf1_user_context_upsert(text, text, text, text, jsonb)',
    'public.yorisou_osf1_current_state_create(text, text[], text, text, text, text, text)',
    'public.yorisou_osf1_current_state_set_reflection(text, uuid, text)',
    'public.yorisou_osf1_goal_create(text, text, text)',
    'public.yorisou_osf1_goal_set_status(text, uuid, text)',
    'public.yorisou_osf1_reflection_create(text, uuid, text, text, text, text, text, text, text, text)',
    'public.yorisou_osf1_memory_confirm(text, text, text, text, text, boolean, uuid, uuid, uuid)',
    'public.yorisou_osf1_memory_delete(text, uuid)'
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

comment on table public.yorisou_user_contexts is
  'OSF-1: user-chosen context (language, region, timezone, display preferences). Never inferred; no derived or learned field. DIRECT_USER_DENY + RPC_ONLY_DATABASE_MUTATION.';
comment on table public.yorisou_current_state_records is
  'OSF-1: TEMPORAL DAILY USER STATE — what the person said about right now. NOT an Imairo/methodology assessment output: no method id, no scoring version, no archetype; yorisou_assessment_results holds those and the two are never converted in either direction. Bounded state vocabulary; no score, streak or counter. Distinct also from the DCI-1 private-pilot domain, which it never reads or converts.';
comment on table public.yorisou_goals is
  'OSF-1: a direction the person chose to hold. No progress, deadline or reminder field, per the approved writing rules on goal-setting pressure.';
comment on table public.yorisou_life_reflections is
  'OSF-1: user-authored guided reflection (7 questions, only the first required). Distinct from yorisou_ai_reflections, which is AI-generated commentary on a saved test result.';
comment on table public.yorisou_explicit_memories is
  'OSF-1: explicit memory. check (user_confirmed = true) makes an unconfirmed row structurally impossible; unconfirmed suggestions are never persisted in any form.';
