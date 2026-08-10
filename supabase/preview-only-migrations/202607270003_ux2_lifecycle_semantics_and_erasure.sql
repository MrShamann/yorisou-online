-- UX-2 / ICP-1 — continuation quality gate: lifecycle semantics, expiry enforcement, true erasure
-- and database defence-in-depth.
--
-- SCOPE: PREVIEW_ONLY (yorisou-preview / nbltsbonsnbpfptihomc). NEVER Production.
--
-- WHY: the first cut of this spine made three claims the data did not support.
--   1. Expiry was checked only at claim time, so an expired anonymous attempt was still writable
--      and completable.
--   2. DEFERRED and UNANSWERED behaved like acceptance — they kept recommendation/continuity
--      permission and kept presenting the original result as accepted understanding. "Later"
--      is not consent.
--   3. Deletion returned erased:true while the answers, the attempt row and every interpretation
--      response survived. That is not erasure.
-- This migration makes the database enforce the semantics the API claims.

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. DEFENCE IN DEPTH — lifecycle invariants the app must not be able to violate.
-- ─────────────────────────────────────────────────────────────────────────────
-- A CHECK constraint may not contain a subquery, so key counting goes through an
-- IMMUTABLE helper (jsonb objects are finite and the count is deterministic).
create or replace function public.yorisou_jsonb_object_length(p jsonb)
returns integer language sql immutable strict as $fn$
  select count(*)::integer from jsonb_object_keys(p);
$fn$;

alter table public.yorisou_assessment_attempts
  drop constraint if exists yorisou_assessment_attempts_count_matches_answers;
alter table public.yorisou_assessment_attempts
  add constraint yorisou_assessment_attempts_count_matches_answers
  check (answered_count = public.yorisou_jsonb_object_length(answers));

alter table public.yorisou_assessment_attempts
  drop constraint if exists yorisou_assessment_attempts_count_within_required;
alter table public.yorisou_assessment_attempts
  add constraint yorisou_assessment_attempts_count_within_required
  check (answered_count <= required_count);

-- A completed attempt must actually have full coverage.
alter table public.yorisou_assessment_attempts
  drop constraint if exists yorisou_assessment_attempts_completed_requires_coverage;
alter table public.yorisou_assessment_attempts
  add constraint yorisou_assessment_attempts_completed_requires_coverage
  check (status <> 'completed' or answered_count = required_count);

-- Supersession may never cross results.
create or replace function public.yorisou_interpretation_supersedes_same_result()
returns trigger language plpgsql as $$
declare v_other uuid;
begin
  if new.supersedes_response_id is null then return new; end if;
  select result_row_id into v_other from public.yorisou_interpretation_responses
   where id = new.supersedes_response_id;
  if v_other is null or v_other <> new.result_row_id then
    raise exception 'response_supersession_cross_result';
  end if;
  return new;
end;
$$;
drop trigger if exists yorisou_interpretation_supersedes_guard on public.yorisou_interpretation_responses;
create trigger yorisou_interpretation_supersedes_guard
  before insert on public.yorisou_interpretation_responses
  for each row execute function public.yorisou_interpretation_supersedes_same_result();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. EXPIRY ENFORCED ON EVERY ANONYMOUS WRITE (not only at claim).
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_attempt_save_progress(
  p_attempt_id uuid, p_claim_token_hash text, p_owner_account_id text,
  p_answers jsonb, p_answered_count integer
) returns integer
language plpgsql security definer set search_path = public as $$
declare v_rows integer;
begin
  update public.yorisou_assessment_attempts a
     set answers = p_answers, answered_count = p_answered_count, updated_at = now()
   where a.id = p_attempt_id
     and a.status = 'in_progress'
     and (
       (a.owner_account_id is null and a.claim_token_hash is not null
        and a.claim_token_hash = p_claim_token_hash
        and (a.expires_at is null or a.expires_at > now()))   -- expiry enforced here
       or (a.owner_account_id is not null and a.owner_account_id = p_owner_account_id)
     );
  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    -- Distinguish expiry so the UI can explain it rather than showing a generic failure.
    if exists (select 1 from public.yorisou_assessment_attempts a
                where a.id = p_attempt_id and a.owner_account_id is null
                  and a.expires_at is not null and a.expires_at <= now()) then
      raise exception 'attempt_expired';
    end if;
    raise exception 'attempt_not_found_or_not_writable';
  end if;
  return p_answered_count;
end;
$$;

create or replace function public.yorisou_attempt_complete(
  p_attempt_id uuid, p_claim_token_hash text, p_owner_account_id text,
  p_answers jsonb, p_answered_count integer, p_result_id text, p_overlay_id text,
  p_dimension_output jsonb, p_scoring_version text, p_result_schema_version text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_attempt public.yorisou_assessment_attempts%rowtype; v_existing uuid; v_result_row uuid;
begin
  select * into v_attempt from public.yorisou_assessment_attempts a
   where a.id = p_attempt_id
     and (
       (a.owner_account_id is null and a.claim_token_hash is not null and a.claim_token_hash = p_claim_token_hash)
       or (a.owner_account_id is not null and a.owner_account_id = p_owner_account_id)
     )
   for update;
  if not found then raise exception 'attempt_not_found_or_not_writable'; end if;

  -- Idempotent: an already-completed attempt returns its existing result.
  select r.id into v_existing from public.yorisou_assessment_results r where r.attempt_id = p_attempt_id;
  if v_existing is not null then return v_existing; end if;

  -- Expiry enforced for anonymous completion too.
  if v_attempt.owner_account_id is null
     and v_attempt.expires_at is not null and v_attempt.expires_at <= now() then
    raise exception 'attempt_expired';
  end if;
  if p_answered_count < v_attempt.required_count then raise exception 'attempt_incomplete_coverage'; end if;

  update public.yorisou_assessment_attempts
     set answers = p_answers, answered_count = p_answered_count,
         status = 'completed', completed_at = now(), updated_at = now()
   where id = p_attempt_id;

  insert into public.yorisou_assessment_results
    (attempt_id, owner_account_id, method_id, method_version, scoring_version,
     result_schema_version, result_id, overlay_id, dimension_output, original_result_id)
  values
    (p_attempt_id, v_attempt.owner_account_id, v_attempt.method_id, v_attempt.method_version,
     p_scoring_version, p_result_schema_version, p_result_id, p_overlay_id,
     coalesce(p_dimension_output,'{}'::jsonb), p_result_id)
  returning id into v_result_row;
  return v_result_row;
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. DEFERRED IS NOT CONSENT. Only confirmed/corrected permit downstream use.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_interpretation_respond(
  p_result_row_id uuid, p_owner_account_id text, p_response_type text,
  p_corrected_result_id text default null, p_reason_code text default null, p_source text default 'web'
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_owner text; v_deleted timestamptz; v_prev uuid; v_id uuid; v_permit boolean;
begin
  select r.owner_account_id, r.deleted_at into v_owner, v_deleted
    from public.yorisou_assessment_results r where r.id = p_result_row_id;
  if not found then raise exception 'result_not_found'; end if;
  -- An erased result can never receive new responses.
  if v_deleted is not null then raise exception 'result_erased'; end if;
  if v_owner is null or v_owner <> p_owner_account_id then raise exception 'result_not_owned'; end if;

  select id into v_prev from public.yorisou_interpretation_responses
   where result_row_id = p_result_row_id order by created_at desc limit 1;

  -- ONLY an explicit confirmation or correction permits downstream use.
  -- rejected AND deferred both withhold it; silence never grants it.
  v_permit := p_response_type in ('confirmed','corrected');

  insert into public.yorisou_interpretation_responses
    (result_row_id, owner_account_id, response_type, corrected_result_id, reason_code,
     supersedes_response_id, recommendation_use_permitted, continuity_use_permitted, source)
  values
    (p_result_row_id, p_owner_account_id, p_response_type, p_corrected_result_id, p_reason_code,
     v_prev, v_permit, v_permit, p_source)
  returning id into v_id;
  return v_id;
end;
$$;

-- The append-only rule stands for every ordinary mutation, but must not become an excuse to
-- retain user content forever. It yields ONLY to the governed erasure of one specific result.
create or replace function public.yorisou_interpretation_responses_append_only()
returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE'
     and coalesce(current_setting('yorisou.erasure_context', true), '') = old.result_row_id::text then
    return old;  -- governed erasure of exactly this result
  end if;
  raise exception 'yorisou_interpretation_responses_is_append_only';
end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. TRUE ERASURE (Option A). A narrow, audited exception to append-only — never a
--    global trigger disable, never an unrestricted cleanup function in runtime.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_assessment_result_erase(
  p_result_row_id uuid, p_owner_account_id text
) returns boolean
language plpgsql security definer set search_path = public as $$
declare v_attempt uuid; v_rows integer;
begin
  select attempt_id into v_attempt from public.yorisou_assessment_results
   where id = p_result_row_id and owner_account_id = p_owner_account_id and deleted_at is null;
  if not found then return false; end if;

  -- Interpretation responses hold user reason/correction content: erase them. The append-only
  -- trigger is bypassed ONLY inside this owner-scoped, single-result erasure function, via a
  -- transaction-local setting the trigger itself checks. No global trigger disable, and no
  -- unrestricted cleanup function is reachable at runtime.
  perform set_config('yorisou.erasure_context', p_result_row_id::text, true);
  delete from public.yorisou_interpretation_responses where result_row_id = p_result_row_id;
  perform set_config('yorisou.erasure_context', '', true);

  -- Erase the result content, keeping a content-free tombstone row.
  update public.yorisou_assessment_results
     set deleted_at = now(), dimension_output = '{}'::jsonb, overlay_id = null
   where id = p_result_row_id;
  get diagnostics v_rows = row_count;

  -- Erase the raw answers and spend the claim credential on the originating attempt.
  update public.yorisou_assessment_attempts
     set answers = '{}'::jsonb, answered_count = 0, claim_token_hash = null,
         status = 'abandoned', completed_at = null, updated_at = now()
   where id = v_attempt;

  return v_rows > 0;
end;
$$;

revoke all on function public.yorisou_assessment_result_erase(uuid, text) from public, anon, authenticated;
grant execute on function public.yorisou_assessment_result_erase(uuid, text) to service_role;

commit;
