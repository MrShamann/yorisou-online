-- APP-2 — LOCAL Supabase verification (RLS · grants · user-isolation ·
-- admin least-privilege · append-only audit · idempotency). Run against LOCAL
-- Supabase ONLY:
--   psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=0 -f docs/app2/LOCAL_SUPABASE_VERIFICATION.sql
-- Each check RAISEs 'PASS: …' or 'FAIL: …'. Zero FAIL lines ⇒ verified.

\set ON_ERROR_ROLLBACK on

-- ── 1. Schema present ──────────────────────────────────────────────────────
do $$
begin
  if to_regclass('public.yorisou_guest_migration_jobs') is null
     or to_regclass('public.yorisou_admin_access_logs') is null
     or to_regclass('public.yorisou_review_queue_items') is null then
    raise notice 'FAIL: app2 tables missing';
  else
    raise notice 'PASS: app2 schema present';
  end if;
end $$;

-- ── 2. Idempotent migration-job creation (same key ⇒ same job, one event) ───
do $$
declare a uuid; b uuid; n integer;
begin
  a := (public.create_yorisou_guest_migration_job('verif-idem-1', 'acct_verif', 'g1', 'device_local', '2')).id;
  b := (public.create_yorisou_guest_migration_job('verif-idem-1', 'acct_verif', 'g1', 'device_local', '2')).id;
  select count(*) into n from public.yorisou_guest_migration_events
    where job_id = a and event_type = 'created';
  if a = b and n = 1 then
    raise notice 'PASS: idempotent create (same id, single created event)';
  else
    raise notice 'FAIL: idempotency broken a=% b=% created_events=%', a, b, n;
  end if;
end $$;

-- ── 3. Guarded transition + audit trail ────────────────────────────────────
do $$
declare j uuid; ev integer;
begin
  j := (public.create_yorisou_guest_migration_job('verif-trans-1', 'acct_verif', 'g2', 'device_local', '1')).id;
  perform public.transition_yorisou_guest_migration_job(j, 'running', 'started', null, 'go');
  perform public.transition_yorisou_guest_migration_job(j, 'succeeded', 'succeeded', null, 'done');
  select count(*) into ev from public.yorisou_guest_migration_events where job_id = j;
  if ev >= 3 then
    raise notice 'PASS: transition audit trail (% events)', ev;
  else
    raise notice 'FAIL: transition audit incomplete (% events)', ev;
  end if;
end $$;

-- ── 4. Illegal transition rejected ─────────────────────────────────────────
do $$
declare j uuid;
begin
  j := (public.create_yorisou_guest_migration_job('verif-illegal-1', 'acct_verif', 'g3', 'device_local', '0')).id;
  begin
    perform public.transition_yorisou_guest_migration_job(j, 'succeeded', 'succeeded', null, 'skip');
    raise notice 'FAIL: illegal pending->succeeded was allowed';
  exception when others then
    raise notice 'PASS: illegal transition rejected (%)', sqlerrm;
  end;
end $$;

-- ── 5. Append-only audit: UPDATE/DELETE blocked for everyone ────────────────
do $$
declare j uuid;
begin
  j := (public.create_yorisou_guest_migration_job('verif-append-1', 'acct_verif', 'g4', 'device_local', '0')).id;
  begin
    update public.yorisou_guest_migration_events set detail = 'tampered' where job_id = j;
    raise notice 'FAIL: audit UPDATE succeeded';
  exception when others then
    raise notice 'PASS: audit UPDATE blocked (%)', sqlerrm;
  end;
  begin
    delete from public.yorisou_guest_migration_events where job_id = j;
    raise notice 'FAIL: audit DELETE succeeded';
  exception when others then
    raise notice 'PASS: audit DELETE blocked (%)', sqlerrm;
  end;
end $$;

-- ── 6. Admin access logging: allowed AND denied both recorded ──────────────
do $$
declare denied integer;
begin
  perform public.log_yorisou_admin_access('founder_x', 'founder', 'review_queue', 'read', 'item:abc', '/admin/queues', true, 'allowed');
  perform public.log_yorisou_admin_access('anon', 'anonymous', 'review_queue', 'read', null, '/admin/queues', false, 'denied_unauthenticated');
  select count(*) into denied from public.yorisou_admin_access_logs where allowed = false;
  if denied >= 1 then
    raise notice 'PASS: denied admin access is logged (% denied rows)', denied;
  else
    raise notice 'FAIL: denied admin access not logged';
  end if;
end $$;

-- ── 7. anon is denied on every app2 table ──────────────────────────────────
do $$
declare ok boolean := true; msg text := '';
begin
  set local role anon;
  begin perform 1 from public.yorisou_guest_migration_jobs limit 1; ok := false; msg := 'jobs'; exception when others then null; end;
  begin perform 1 from public.yorisou_admin_access_logs limit 1; ok := false; msg := msg||' logs'; exception when others then null; end;
  begin perform 1 from public.yorisou_review_queue_items limit 1; ok := false; msg := msg||' queue'; exception when others then null; end;
  reset role;
  if ok then raise notice 'PASS: anon denied on app2 tables';
  else raise notice 'FAIL: anon reached %', msg; end if;
end $$;

-- ── 8. User isolation: authenticated sees only its own account rows ─────────
do $$
declare seen_other integer; seen_own integer;
begin
  -- Seed two owners as service-role-equivalent (superuser bypasses RLS).
  insert into public.yorisou_service_feedback (account_id, item_id, signal)
    values ('iso_userA', 'grounding-reflection', 'useful'), ('iso_userB', 'work-rhythm-check', 'saved')
    on conflict do nothing;

  set local role authenticated;
  perform set_config('request.jwt.claims', '{"sub":"iso_userA","app_account_id":"iso_userA"}', true);
  select count(*) into seen_own   from public.yorisou_service_feedback where account_id = 'iso_userA';
  select count(*) into seen_other from public.yorisou_service_feedback where account_id = 'iso_userB';
  perform set_config('request.jwt.claims', '', true);
  reset role;

  if seen_own >= 1 and seen_other = 0 then
    raise notice 'PASS: user isolation (own=% other=%)', seen_own, seen_other;
  else
    raise notice 'FAIL: user isolation leaked (own=% other=%)', seen_own, seen_other;
  end if;
end $$;

-- ── 9. authenticated denied on admin tables (least privilege) ──────────────
do $$
declare leaked boolean := false;
begin
  set local role authenticated;
  perform set_config('request.jwt.claims', '{"sub":"iso_userA","app_account_id":"iso_userA"}', true);
  begin perform 1 from public.yorisou_admin_access_logs limit 1; leaked := true; exception when others then null; end;
  begin perform 1 from public.yorisou_service_incidents limit 1; leaked := true; exception when others then null; end;
  begin perform 1 from public.yorisou_review_queue_items limit 1; leaked := true; exception when others then null; end;
  perform set_config('request.jwt.claims', '', true);
  reset role;
  if leaked then raise notice 'FAIL: authenticated reached an admin table';
  else raise notice 'PASS: authenticated denied on admin tables'; end if;
end $$;

-- ── 10. Review-queue lifecycle + reopen produces audit ─────────────────────
do $$
declare it uuid; ev integer;
begin
  it := (public.enqueue_yorisou_review_item('line_callback_failure', 'medium', 'safe summary', 'evi:1', 'founder_x', 'seed')).id;
  perform public.transition_yorisou_review_item(it, 'reviewing', 'founder_x', null, 'triage');
  perform public.transition_yorisou_review_item(it, 'resolved', 'founder_x', 'fixed', 'done');
  perform public.transition_yorisou_review_item(it, 'reopened', 'founder_x', null, 'regressed');
  select count(*) into ev from public.yorisou_review_queue_events where item_id = it;
  if ev >= 4 then raise notice 'PASS: review lifecycle audit (% events)', ev;
  else raise notice 'FAIL: review lifecycle audit incomplete (% events)', ev; end if;
end $$;

-- ── 11. Readiness aggregate views expose counts (no raw rows) ───────────────
do $$
declare c integer;
begin
  select open_review_items into c from public.yorisou_service_readiness_overview;
  raise notice 'PASS: readiness overview readable (open_review_items=%)', c;
exception when others then
  raise notice 'FAIL: readiness overview error (%)', sqlerrm;
end $$;
