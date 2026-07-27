-- UX-2 / ICP-1 — Preview-only synthetic acceptance-data cleanup.
--
-- PREVIEW ONLY (yorisou-preview / nbltsbonsnbpfptihomc). NEVER run against Production.
-- Verify the project ref before executing.
--
-- This script deliberately uses the SAME governed erasure path as the runtime
-- (yorisou_assessment_result_erase) rather than a weaker maintenance shortcut. It does NOT
-- disable the append-only trigger globally: the earlier version did, which taught a weaker
-- deletion pattern than the product itself enforces.
--
-- Runtime user-facing deletion is TRUE erasure (answers, responses, result identifiers and owner
-- linkage removed, content-free tombstone retained) — not a soft delete.
do $$
declare r record;
begin
  -- 1. Erase synthetic RESULTS through the governed owner-scoped path.
  for r in
    select res.id, res.owner_account_id
      from public.yorisou_assessment_results res
      join public.yorisou_assessment_attempts att on att.id = res.attempt_id
     where res.deleted_at is null
       and (res.owner_account_id like 'acct_test%'
            or res.owner_account_id like 'acct_g%'
            or att.entry_source in ('test','chain','gate','gate4','ux2-acceptance','restart'))
  loop
    perform public.yorisou_assessment_result_erase(r.id, r.owner_account_id);
  end loop;

  -- 2. Abandon any synthetic attempts that never produced a result (governed RPC, not raw DML).
  for r in
    select att.id, att.claim_token_hash, att.owner_account_id
      from public.yorisou_assessment_attempts att
     where att.status = 'in_progress'
       and (att.entry_source in ('test','chain','gate','gate4','ux2-acceptance','restart')
            or att.owner_account_id like 'acct_test%'
            or att.owner_account_id like 'acct_g%')
  loop
    perform public.yorisou_attempt_abandon(r.id, r.claim_token_hash, r.owner_account_id, 'erased');
  end loop;
end $$;

-- 3. Remove the now content-free synthetic tombstone + attempt shells. These rows hold no user
--    content at this point (step 1 erased it), so this is housekeeping, not deletion of data.
delete from public.yorisou_assessment_attempts
 where status = 'abandoned'
   and answered_count = 0
   and entry_source in ('test','chain','gate','gate4','ux2-acceptance','restart','user_restarted','erased');
