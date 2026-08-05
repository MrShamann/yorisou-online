-- UX-2 / ICP-1 — public-assessment attempt, persisted result, and interpretation response.
--
-- SCOPE: PREVIEW_ONLY. This migration is applied to the isolated Preview project
--   (yorisou-preview / nbltsbonsnbpfptihomc) ONLY. It is NOT part of the Production
--   migration lineage and MUST NOT be applied to yorisou-production. The migration-scope
--   guard (scripts/validate-migration-scope.mjs) enforces its directory.
--
-- WHY THIS EXISTS (UX-2 §8 archaeology, evidence in docs/ux2/UX2_DATA_AND_CONTRACT_TRUTH.md):
--   The public 120Q journey is client-side and ephemeral end to end — answers live in React
--   useState with no resume, scoring runs entirely in the browser with no API route, the result
--   identity is carried in the URL query string, /result is stateless-by-URL and cannot render a
--   persisted result, and the single server write is an auth-gated SNAPSHOT with answers={}.
--   There is no attempt entity anywhere. This migration adds the missing persistence spine so the
--   real public entry can carry a genuine journey: start -> resume -> complete -> persisted result
--   -> confirm/correct/reject/defer -> claim after auth -> return.
--
-- PROTECTED ASSETS ARE NOT TOUCHED. The 990-question asset, the question banks, the scoring
--   model, the 8-dimension / 24-subdimension logic, imairo-public-assignment-v0.1, the 24 public
--   result assignments and all governed result copy remain byte-identical and are NOT stored here.
--   This schema stores only: the user's own answer state, the RESULT IDENTIFIER produced by the
--   existing governed assignment, the computed dimension output needed to render, and the user's
--   own responses. Governed copy is resolved at render time from the existing taxonomy modules.
--
-- ACCESS ARCHITECTURE (mirrors the accepted DCI-1.2 / YV-1 pattern):
--   DIRECT_USER_DENY + SERVER_REPOSITORY_OWNER_SCOPE + RPC_ONLY_DATABASE_MUTATION
--   RLS enabled on every table. NO authenticated-user policies: application auth is cookie-based
--   and no user JWT ever reaches PostgREST. Direct table access for public/anon/authenticated =
--   NONE. service_role = SELECT ONLY. ALL mutation flows through bounded SECURITY DEFINER RPCs.
--
-- OWNERSHIP MODEL (UX-2 Priority 4 — anonymous value before forced registration):
--   An attempt starts ANONYMOUS. Ownership is proven by a claim secret that the server never
--   stores in cleartext: only sha256(token) is persisted. After authentication the attempt and its
--   result are CLAIMED by the account. A claim is single-use (the hash is cleared), expires, and
--   can never re-target an attempt that already has an owner — so one user can never claim
--   another user's attempt.
--
-- ROLLBACK CLASSIFICATION: PREVIEW_DISPOSABLE_SCHEMA_ROLLBACK (structurally destructive in the
--   isolated Preview project only; NOT a Production rollback — this never enters Production).
--   Compensating rollback (Preview only) is provided in the paired *_rollback.sql file.

begin;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. ATTEMPT — the missing entity. Anonymous-capable, resumable, claimable.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_assessment_attempts (
  id                    uuid primary key default gen_random_uuid(),
  method_id             text        not null check (method_id in ('imairo-120q')),
  method_version        text        not null,
  -- Ownership: NULL while anonymous; set exactly once at claim time.
  owner_account_id      text        null,
  -- sha256 of the single-use claim token. Cleared when claimed or abandoned.
  claim_token_hash      text        null,
  status                text        not null default 'in_progress'
                          check (status in ('in_progress','completed','abandoned')),
  -- The user's own answers. Never governed content: {questionId: optionId}.
  answers               jsonb       not null default '{}'::jsonb,
  answered_count        integer     not null default 0 check (answered_count >= 0),
  required_count        integer     not null check (required_count > 0),
  entry_source          text        null,
  started_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  completed_at          timestamptz null,
  claimed_at            timestamptz null,
  -- Anonymous attempts expire; claimed attempts do not.
  expires_at            timestamptz null,
  constraint yorisou_assessment_attempts_completed_consistency
    check ((status = 'completed') = (completed_at is not null)),
  constraint yorisou_assessment_attempts_claim_consistency
    check ((owner_account_id is null) = (claimed_at is null))
);

create index if not exists yorisou_assessment_attempts_owner_idx
  on public.yorisou_assessment_attempts (owner_account_id, started_at desc)
  where owner_account_id is not null;
create index if not exists yorisou_assessment_attempts_claim_idx
  on public.yorisou_assessment_attempts (claim_token_hash)
  where claim_token_hash is not null;
create index if not exists yorisou_assessment_attempts_expiry_idx
  on public.yorisou_assessment_attempts (expires_at)
  where expires_at is not null and owner_account_id is null;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. RESULT — immutable, server-produced, addressable by a stable id.
--    This is what makes /result renderable from persisted identity instead of a URL.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_assessment_results (
  id                    uuid primary key default gen_random_uuid(),
  attempt_id            uuid        not null references public.yorisou_assessment_attempts (id) on delete cascade,
  owner_account_id      text        null,
  method_id             text        not null,
  method_version        text        not null,
  scoring_version       text        not null,
  result_schema_version text        not null,
  -- The PROTECTED result identifier produced by the existing governed assignment.
  -- The governed copy for this identifier is NOT stored — it is resolved at render time.
  result_id             text        not null,
  overlay_id            text        null,
  -- Computed dimension output required for rendering (no governed prose).
  dimension_output      jsonb       not null default '{}'::jsonb,
  -- The ORIGINAL immutable machine result. A user correction never rewrites this.
  original_result_id    text        not null,
  visibility            text        not null default 'private'
                          check (visibility in ('private','link_shared')),
  produced_at           timestamptz not null default now(),
  deleted_at            timestamptz null,
  -- One live result per attempt (a retake is a NEW attempt, preserving longitudinal history).
  constraint yorisou_assessment_results_attempt_unique unique (attempt_id)
);

create index if not exists yorisou_assessment_results_owner_idx
  on public.yorisou_assessment_results (owner_account_id, produced_at desc)
  where owner_account_id is not null and deleted_at is null;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. INTERPRETATION RESPONSE — append-only. CONFIRMED / CORRECTED / REJECTED / DEFERRED
--    as genuinely distinct persisted events (UX-2 Priority 5).
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_interpretation_responses (
  id                     uuid        primary key default gen_random_uuid(),
  result_row_id          uuid        not null references public.yorisou_assessment_results (id) on delete cascade,
  owner_account_id       text        not null,
  response_type          text        not null
                           check (response_type in ('confirmed','corrected','rejected','deferred')),
  -- Bounded correction only: a governed result identifier the user says fits better.
  -- Free personal text is intentionally NOT accepted here.
  corrected_result_id    text        null,
  reason_code            text        null
                           check (reason_code is null or reason_code in
                             ('not_me_now','partly_true','changed_recently','wrong_emphasis','other_bounded')),
  -- Supersession: a later response supersedes an earlier one without deleting it.
  supersedes_response_id uuid        null references public.yorisou_interpretation_responses (id),
  -- Permissions. A REJECTED interpretation must stop influencing downstream systems by default.
  recommendation_use_permitted boolean not null default true,
  continuity_use_permitted     boolean not null default true,
  source                 text        not null default 'web'
                           check (source in ('web','line','import')),
  created_at             timestamptz not null default now(),
  -- A correction MUST carry a corrected identifier; the other types must not.
  constraint yorisou_interpretation_responses_correction_shape
    check ((response_type = 'corrected') = (corrected_result_id is not null))
);

create index if not exists yorisou_interpretation_responses_result_idx
  on public.yorisou_interpretation_responses (result_row_id, created_at desc);
create index if not exists yorisou_interpretation_responses_owner_idx
  on public.yorisou_interpretation_responses (owner_account_id, created_at desc);

-- Append-only enforcement: responses are never updated or deleted in place.
create or replace function public.yorisou_interpretation_responses_append_only()
returns trigger
language plpgsql
as $$
begin
  raise exception 'yorisou_interpretation_responses_is_append_only';
end;
$$;

drop trigger if exists yorisou_interpretation_responses_no_update on public.yorisou_interpretation_responses;
create trigger yorisou_interpretation_responses_no_update
  before update or delete on public.yorisou_interpretation_responses
  for each row execute function public.yorisou_interpretation_responses_append_only();

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. RLS + GRANTS — direct user deny; service_role read-only; RPC-only mutation.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.yorisou_assessment_attempts       enable row level security;
alter table public.yorisou_assessment_results        enable row level security;
alter table public.yorisou_interpretation_responses  enable row level security;

alter table public.yorisou_assessment_attempts       force row level security;
alter table public.yorisou_assessment_results        force row level security;
alter table public.yorisou_interpretation_responses  force row level security;

-- NOTE: Supabase default privileges grant ALL to service_role on new public tables.
-- Revoke from service_role FIRST, then re-grant SELECT only, so the architecture holds.
revoke all on public.yorisou_assessment_attempts      from public, anon, authenticated, service_role;
revoke all on public.yorisou_assessment_results       from public, anon, authenticated, service_role;
revoke all on public.yorisou_interpretation_responses from public, anon, authenticated, service_role;

grant select on public.yorisou_assessment_attempts      to service_role;
grant select on public.yorisou_assessment_results       to service_role;
grant select on public.yorisou_interpretation_responses to service_role;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. RPCs — the only mutation path.
-- ─────────────────────────────────────────────────────────────────────────────

-- 5.1 Start an anonymous attempt. Returns the attempt id.
create or replace function public.yorisou_attempt_start(
  p_method_id       text,
  p_method_version  text,
  p_required_count  integer,
  p_claim_token_hash text,
  p_entry_source    text default null,
  p_ttl_hours       integer default 72
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  if p_claim_token_hash is null or length(p_claim_token_hash) < 32 then
    raise exception 'attempt_claim_token_required';
  end if;
  insert into public.yorisou_assessment_attempts
    (method_id, method_version, required_count, claim_token_hash, entry_source, expires_at)
  values
    (p_method_id, p_method_version, p_required_count, p_claim_token_hash, p_entry_source,
     now() + make_interval(hours => greatest(1, p_ttl_hours)))
  returning id into v_id;
  return v_id;
end;
$$;

-- 5.2 Save progress. Token-scoped (anonymous) or owner-scoped (claimed). Idempotent.
create or replace function public.yorisou_attempt_save_progress(
  p_attempt_id       uuid,
  p_claim_token_hash text,
  p_owner_account_id text,
  p_answers          jsonb,
  p_answered_count   integer
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare v_rows integer;
begin
  update public.yorisou_assessment_attempts a
     set answers        = p_answers,
         answered_count = p_answered_count,
         updated_at     = now()
   where a.id = p_attempt_id
     and a.status = 'in_progress'
     and (
       (a.owner_account_id is null and a.claim_token_hash is not null and a.claim_token_hash = p_claim_token_hash)
       or (a.owner_account_id is not null and a.owner_account_id = p_owner_account_id)
     );
  get diagnostics v_rows = row_count;
  if v_rows = 0 then raise exception 'attempt_not_found_or_not_writable'; end if;
  return p_answered_count;
end;
$$;

-- 5.3 Complete the attempt AND persist the server-produced result atomically.
--     Idempotent: completing twice returns the same existing result id.
create or replace function public.yorisou_attempt_complete(
  p_attempt_id            uuid,
  p_claim_token_hash      text,
  p_owner_account_id      text,
  p_answers               jsonb,
  p_answered_count        integer,
  p_result_id             text,
  p_overlay_id            text,
  p_dimension_output      jsonb,
  p_scoring_version       text,
  p_result_schema_version text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_attempt public.yorisou_assessment_attempts%rowtype;
        v_existing uuid;
        v_result_row uuid;
begin
  select * into v_attempt from public.yorisou_assessment_attempts a
   where a.id = p_attempt_id
     and (
       (a.owner_account_id is null and a.claim_token_hash is not null and a.claim_token_hash = p_claim_token_hash)
       or (a.owner_account_id is not null and a.owner_account_id = p_owner_account_id)
     )
   for update;
  if not found then raise exception 'attempt_not_found_or_not_writable'; end if;

  -- Idempotency: an already-completed attempt returns its existing result.
  select r.id into v_existing from public.yorisou_assessment_results r where r.attempt_id = p_attempt_id;
  if v_existing is not null then return v_existing; end if;

  if p_answered_count < v_attempt.required_count then
    raise exception 'attempt_incomplete_coverage';
  end if;

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
     coalesce(p_dimension_output, '{}'::jsonb), p_result_id)
  returning id into v_result_row;

  return v_result_row;
end;
$$;

-- 5.4 Claim an anonymous attempt + its result for an authenticated account.
--     Single-use (hash cleared), expiry-checked, and can never re-target an owned attempt.
create or replace function public.yorisou_attempt_claim(
  p_attempt_id       uuid,
  p_claim_token_hash text,
  p_owner_account_id text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_attempt public.yorisou_assessment_attempts%rowtype;
        v_result uuid;
begin
  if p_owner_account_id is null or length(p_owner_account_id) = 0 then
    raise exception 'claim_owner_required';
  end if;

  select * into v_attempt from public.yorisou_assessment_attempts a
   where a.id = p_attempt_id for update;
  if not found then raise exception 'attempt_not_found'; end if;

  -- Already claimed by this same account -> idempotent success.
  if v_attempt.owner_account_id is not null then
    if v_attempt.owner_account_id = p_owner_account_id then
      select r.id into v_result from public.yorisou_assessment_results r where r.attempt_id = p_attempt_id;
      return v_result;
    end if;
    raise exception 'attempt_already_claimed_by_another_owner';
  end if;

  if v_attempt.claim_token_hash is null or v_attempt.claim_token_hash <> p_claim_token_hash then
    raise exception 'claim_token_invalid';
  end if;
  if v_attempt.expires_at is not null and v_attempt.expires_at < now() then
    raise exception 'claim_token_expired';
  end if;

  update public.yorisou_assessment_attempts
     set owner_account_id = p_owner_account_id,
         claimed_at       = now(),
         claim_token_hash = null,   -- single use
         expires_at       = null,   -- claimed attempts do not expire
         updated_at       = now()
   where id = p_attempt_id;

  update public.yorisou_assessment_results
     set owner_account_id = p_owner_account_id
   where attempt_id = p_attempt_id
  returning id into v_result;

  return v_result;
end;
$$;

-- 5.5 Record an interpretation response. Append-only; supersedes the previous one.
--     A rejection defaults to withdrawing downstream permissions.
create or replace function public.yorisou_interpretation_respond(
  p_result_row_id       uuid,
  p_owner_account_id    text,
  p_response_type       text,
  p_corrected_result_id text default null,
  p_reason_code         text default null,
  p_source              text default 'web'
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_owner text;
        v_prev  uuid;
        v_id    uuid;
        v_rec_ok boolean;
        v_cont_ok boolean;
begin
  select r.owner_account_id into v_owner
    from public.yorisou_assessment_results r
   where r.id = p_result_row_id and r.deleted_at is null;
  if not found then raise exception 'result_not_found'; end if;
  if v_owner is null or v_owner <> p_owner_account_id then
    raise exception 'result_not_owned';
  end if;

  select id into v_prev from public.yorisou_interpretation_responses
   where result_row_id = p_result_row_id order by created_at desc limit 1;

  -- A rejected interpretation stops influencing recommendations and continuity by default.
  v_rec_ok  := (p_response_type <> 'rejected');
  v_cont_ok := (p_response_type <> 'rejected');

  insert into public.yorisou_interpretation_responses
    (result_row_id, owner_account_id, response_type, corrected_result_id, reason_code,
     supersedes_response_id, recommendation_use_permitted, continuity_use_permitted, source)
  values
    (p_result_row_id, p_owner_account_id, p_response_type, p_corrected_result_id, p_reason_code,
     v_prev, v_rec_ok, v_cont_ok, p_source)
  returning id into v_id;

  return v_id;
end;
$$;

-- 5.6 Governed deletion of a persisted result (content erasure, tombstone-free cascade).
create or replace function public.yorisou_assessment_result_delete(
  p_result_row_id    uuid,
  p_owner_account_id text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare v_rows integer;
begin
  update public.yorisou_assessment_results
     set deleted_at = now(), dimension_output = '{}'::jsonb
   where id = p_result_row_id and owner_account_id = p_owner_account_id and deleted_at is null;
  get diagnostics v_rows = row_count;
  return v_rows > 0;
end;
$$;

-- RPC execution is service-role only (the Next.js server is the sole caller).
revoke all on function public.yorisou_attempt_start(text, text, integer, text, text, integer) from public, anon, authenticated;
revoke all on function public.yorisou_attempt_save_progress(uuid, text, text, jsonb, integer) from public, anon, authenticated;
revoke all on function public.yorisou_attempt_complete(uuid, text, text, jsonb, integer, text, text, jsonb, text, text) from public, anon, authenticated;
revoke all on function public.yorisou_attempt_claim(uuid, text, text) from public, anon, authenticated;
revoke all on function public.yorisou_interpretation_respond(uuid, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.yorisou_assessment_result_delete(uuid, text) from public, anon, authenticated;

grant execute on function public.yorisou_attempt_start(text, text, integer, text, text, integer) to service_role;
grant execute on function public.yorisou_attempt_save_progress(uuid, text, text, jsonb, integer) to service_role;
grant execute on function public.yorisou_attempt_complete(uuid, text, text, jsonb, integer, text, text, jsonb, text, text) to service_role;
grant execute on function public.yorisou_attempt_claim(uuid, text, text) to service_role;
grant execute on function public.yorisou_interpretation_respond(uuid, text, text, text, text, text) to service_role;
grant execute on function public.yorisou_assessment_result_delete(uuid, text) to service_role;

commit;
