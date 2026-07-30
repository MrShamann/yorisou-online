-- UX-2 / CPC-1 — Preview-only synthetic acceptance-data cleanup.
--
-- PREVIEW ONLY (yorisou-preview / nbltsbonsnbpfptihomc). NEVER run against Production.
--
-- This script deliberately uses the SAME governed erasure path as the runtime
-- (yorisou_assessment_result_erase) rather than a weaker maintenance shortcut. It does NOT
-- disable the append-only trigger globally: the earlier version did, which taught a weaker
-- deletion pattern than the product itself enforces.
--
-- Runtime user-facing deletion is TRUE erasure (answers, responses, result identifiers and owner
-- linkage removed, content-free tombstone retained) — not a soft delete.

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. FAIL-CLOSED TARGET GUARD.
--
-- "Verify the project ref before executing" was a comment asking a human to be careful, which is
-- not a guard at all: a paste into the wrong console would have erased real records. The CPC-1
-- attempt/result tables are PREVIEW_ONLY by construction, so their ABSENCE proves this is not the
-- Preview database, and this script refuses to run. Production has no such tables (verified
-- read-only: 12 migrations, 42 tables, yorisou_assessment_* absent).
-- ─────────────────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_tables
     where schemaname = 'public'
       and tablename in ('yorisou_assessment_attempts', 'yorisou_assessment_results')
     having count(*) = 2
  ) then
    raise exception 'refusing to run: the CPC-1 PREVIEW_ONLY tables are absent — this is not the Preview database';
  end if;
end $$;

do $$
declare
  r record;
  -- Every entry_source an acceptance run can produce. The browser-driven lifecycle walks the REAL
  -- /check-in and LINE surfaces, so it writes the PRODUCT's own sources ('open-testing',
  -- 'line-mini-app', 'user_restarted') — faking a synthetic marker there would mean the acceptance
  -- test no longer exercises the real entry path. Preview holds no real users, and the guard above
  -- makes running this anywhere else impossible, so these sources are in scope here and only here.
  synthetic_sources text[] := array[
    'test','chain','gate','gate4','restart',        -- earlier harness markers
    'ux2-acceptance',                               -- fixtures.ts FIXTURE_ENTRY_SOURCE
    'cpc1-diagnosis',                               -- direct API/RPC diagnosis during a train
    'open-testing','line-mini-app','user_restarted' -- real product sources, driven by the harness
  ];
begin
  -- 1. Erase synthetic RESULTS through the governed owner-scoped path.
  for r in
    select res.id, res.owner_account_id
      from public.yorisou_assessment_results res
      join public.yorisou_assessment_attempts att on att.id = res.attempt_id
     where res.deleted_at is null
       and (res.owner_account_id like 'acct_test%'
            or res.owner_account_id like 'acct_g%'
            or att.entry_source = any(synthetic_sources))
  loop
    perform public.yorisou_assessment_result_erase(r.id, r.owner_account_id);
  end loop;

  -- 2. Abandon any synthetic attempts that never produced a result (governed RPC, not raw DML).
  --    yorisou_attempt_abandon only accepts status='in_progress' by design, so this cannot reach
  --    completed journeys — step 2b handles those.
  for r in
    select att.id, att.claim_token_hash, att.owner_account_id
      from public.yorisou_assessment_attempts att
     where att.status = 'in_progress'
       and (att.entry_source = any(synthetic_sources)
            or att.owner_account_id like 'acct_test%'
            or att.owner_account_id like 'acct_g%')
  loop
    perform public.yorisou_attempt_abandon(r.id, r.claim_token_hash, r.owner_account_id, 'erased');
  end loop;

  -- 2b. ANONYMOUS COMPLETED synthetic journeys — housekeeping, NOT the runtime deletion pattern.
  --
  -- No governed path can reach these, and that is correct product behaviour, not a defect:
  -- yorisou_assessment_result_erase is owner-scoped (an anonymous row has no owner to authorise
  -- erasure) and yorisou_attempt_abandon only accepts in_progress. A real anonymous result is
  -- either CLAIMED — after which its owner can erase it, which the hosted erasure gate proves —
  -- or it EXPIRES. Neither applies to a fixture row nobody will ever claim.
  --
  -- So these synthetic rows are physically removed. This is deliberately NOT presented as the
  -- product's deletion semantics: it leaves no tombstone because there is no person whose
  -- erasure right is being honoured — only harness residue in a Preview database.
  for r in
    select res.id
      from public.yorisou_assessment_results res
      join public.yorisou_assessment_attempts att on att.id = res.attempt_id
     where res.owner_account_id is null
       and att.owner_account_id is null
       and att.entry_source = any(synthetic_sources)
  loop
    -- Responses are append-only outside an erasure context; honour that same guard here rather
    -- than disabling the trigger.
    perform set_config('yorisou.erasure_context', r.id::text, true);
    delete from public.yorisou_interpretation_responses where result_row_id = r.id;
    perform set_config('yorisou.erasure_context', '', true);
    delete from public.yorisou_assessment_results where id = r.id;
  end loop;

  -- The now result-free anonymous attempt shells still hold their answers, so remove them too.
  delete from public.yorisou_assessment_attempts att
   where att.owner_account_id is null
     and att.entry_source = any(synthetic_sources)
     and not exists (select 1 from public.yorisou_assessment_results res where res.attempt_id = att.id);
end $$;

-- 3. Remove the now content-free synthetic tombstone + attempt shells. These rows hold no user
--    content at this point (step 1 erased results, step 2 cleared attempt answers), so this is
--    housekeeping, not deletion of data.
delete from public.yorisou_assessment_attempts
 where status = 'abandoned'
   and answered_count = 0
   and (entry_source is null
        or entry_source in ('test','chain','gate','gate4','restart','ux2-acceptance','cpc1-diagnosis',
                            'open-testing','line-mini-app','user_restarted','erased'));

-- 4. Proof of cleanup. Every count must be 0 except erased_tombstones, which the frozen erasure
--    contract REQUIRES to survive (content-free: no answers, no result identifiers, no owner).
select
  (select count(*) from public.yorisou_assessment_attempts)                            as attempts_remaining,
  (select count(*) from public.yorisou_assessment_results where deleted_at is null)     as live_results,
  (select count(*) from public.yorisou_assessment_results where deleted_at is not null) as erased_tombstones,
  (select count(*) from public.yorisou_interpretation_responses)                        as responses,
  (select count(*) from public.yorisou_recommendation_sets)                             as recommendation_sets,
  (select count(*) from public.yorisou_recommendation_items)                            as recommendation_items,
  (select count(*) from public.yorisou_recommendation_actions)                          as recommendation_actions,
  (select count(*) from public.yorisou_assessment_results
    where deleted_at is not null
      and (result_id is not null or owner_account_id is not null or dimension_output <> '{}'::jsonb))
                                                                                       as unsafe_tombstones;
