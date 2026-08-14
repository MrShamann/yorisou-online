-- OSF-1 PHASE C — the five-question reflection flow.
--
-- WHAT CHANGES, AND WHY IT IS A CHANGE RATHER THAN A BUILD.
--
-- 202608140001 shipped a SEVEN-question flow over eight columns. The activation package specifies a
-- FIVE-question flow with different wording. Mapping the package's five onto what exists:
--
--   1 何がありましたか？          -> what_happened   (exists; wording differs from 「何が起きましたか」)
--   2 その時どう感じましたか？     -> felt            *** NO COLUMN EXISTS — added here ***
--   3 何を試しましたか？          -> tried           *** NO COLUMN EXISTS — added here ***
--   4 何が起きましたか？          -> what_followed   (exists)
--   5 次に活かせることはありますか？ -> next_time       (exists)
--
-- Only questions 2 and 3 had nowhere to go. The nearest existing columns are NOT substitutes:
-- mood/energy live on yorisou_current_state_records, a different record about a different moment;
-- and `decision_made` stores 「決めたこと」, which is not 「試したこと」 — the product's word for what
-- someone tried is action_tried, and that is on the experience card.
--
-- THE THREE ORPHANED COLUMNS. goal_at_the_time, information_at_hand and why are no longer asked by
-- the flow. They are KEPT, nullable and unused, and NOT dropped:
--   * no row exists anywhere (both prior migrations are unapplied), so nothing is lost either way;
--   * dropping them would be a destructive change bought for nothing;
--   * and a later package may reinstate the fuller flow, which is cheaper against a column that
--     still exists than against one that was removed and must be re-added to a live table.
-- what_learned is also no longer a separate screen: package question 5 covers it and next_time
-- together, so next_time is the column the flow writes and what_learned stays nullable.
--
-- Additive only: two nullable text columns. Every existing row (there are none) stays valid.
--
-- ROLLBACK:
--   alter table public.yorisou_life_reflections drop column if exists tried;
--   alter table public.yorisou_life_reflections drop column if exists felt;

alter table public.yorisou_life_reflections
  add column if not exists felt text;
alter table public.yorisou_life_reflections
  add column if not exists tried text;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'yorisou_life_reflections_felt_chk') then
    alter table public.yorisou_life_reflections
      add constraint yorisou_life_reflections_felt_chk check (felt is null or length(felt) <= 2000);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'yorisou_life_reflections_tried_chk') then
    alter table public.yorisou_life_reflections
      add constraint yorisou_life_reflections_tried_chk check (tried is null or length(tried) <= 2000);
  end if;
end $$;

-- The create RPC gains the two answers. New signature; the old one is dropped so there is exactly
-- one way to write a reflection.
drop function if exists public.yorisou_osf1_reflection_create(text, uuid, text, text, text, text, text, text, text, text);

create or replace function public.yorisou_osf1_reflection_create(
  p_owner_account_id text,
  p_experience_id uuid,
  p_what_happened text,
  p_felt text,
  p_tried text,
  p_what_followed text,
  p_next_time text,
  p_goal_at_the_time text default null,
  p_information_at_hand text default null,
  p_decision_made text default null,
  p_why text default null,
  p_what_learned text default null
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
  if p_experience_id is not null then
    if not exists (
      select 1 from public.yorisou_experience_cards
       where id = p_experience_id and owner_account_id = p_owner_account_id
    ) then
      raise exception 'osf1_experience_not_owned';
    end if;
  end if;
  insert into public.yorisou_life_reflections
    (owner_account_id, experience_id, what_happened, felt, tried, what_followed, next_time,
     goal_at_the_time, information_at_hand, decision_made, why, what_learned)
  values
    (p_owner_account_id, p_experience_id, btrim(p_what_happened),
     nullif(btrim(coalesce(p_felt, '')), ''),
     nullif(btrim(coalesce(p_tried, '')), ''),
     nullif(btrim(coalesce(p_what_followed, '')), ''),
     nullif(btrim(coalesce(p_next_time, '')), ''),
     nullif(btrim(coalesce(p_goal_at_the_time, '')), ''),
     nullif(btrim(coalesce(p_information_at_hand, '')), ''),
     nullif(btrim(coalesce(p_decision_made, '')), ''),
     nullif(btrim(coalesce(p_why, '')), ''),
     nullif(btrim(coalesce(p_what_learned, '')), ''))
  returning id into v_id;
  return v_id;
end;
$$;

do $$
declare v_sig text := 'public.yorisou_osf1_reflection_create(text, uuid, text, text, text, text, text, text, text, text, text, text)';
begin
  execute 'revoke all on function ' || v_sig || ' from public';
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on function ' || v_sig || ' from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on function ' || v_sig || ' from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function ' || v_sig || ' to service_role';
  end if;
end $$;
