#!/usr/bin/env bash
# POR-1 — deletion resume engine + account mutation fence verification in an ISOLATED DISPOSABLE
# local Postgres database (never hosted, never production).
#
# Run: DATABASE_URL=postgres://...@localhost:5432/yorisou_por1_test bash tests/por1/postgres-integration.sh
#
# WHAT MAKES THIS A PROOF RATHER THAN A HOPEFUL RUN.
#
# The properties under test are concurrency properties, and a concurrency test that relies on one
# session being slower than another proves only that it was slower that time. So the genuinely
# concurrent cases here are driven through TWO PERSISTENT SESSIONS WITH AN EXPLICIT LATCH: session A
# opens a transaction and stops, the harness observes that it has stopped, and only then is session B
# released into the contended path. Nothing sleeps waiting for a race to happen.
#
# The grace-period cases use the INJECTED CLOCK (`yorisou.deletion_clock_skew_seconds`) rather than
# 180 seconds of real waiting. A test that takes three minutes is a test that gets deleted.
set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then echo "DATABASE_URL is required" >&2; exit 1; fi
if [[ "$DATABASE_URL" == *"supabase.co"* || "$DATABASE_URL" != *"@localhost:"* || "$DATABASE_URL" != *"yorisou_por1_test"* ]]; then
  echo "Refusing non-ephemeral database target" >&2; exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c 'create extension if not exists pgcrypto;'
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$; do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$; do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "alter role service_role bypassrls;"

for f in 202607300003_por1_account_deletion_lifecycle \
         202607300004_por1_account_mutation_fence \
         202607300005_por1_deletion_resume_engine; do
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$ROOT/supabase/preview-only-migrations/$f.sql"
done
# Idempotence: re-applying the new migration must succeed without error.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$ROOT/supabase/preview-only-migrations/202607300005_por1_deletion_resume_engine.sql"

# ─────────────────────────────────────────────────────────────────────────────
# Single-session assertions.
# ─────────────────────────────────────────────────────────────────────────────
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -At <<'SQL'
create or replace function assert_true(value boolean, message text) returns void language plpgsql as $$
begin if not value then raise exception 'assertion failed: %', message; end if; end $$;
grant execute on function assert_true(boolean,text) to service_role;

-- Deterministic executor tokens. Length matters: the claim refuses anything under 32 chars.
create or replace function tok(label text) returns text language sql immutable as $$
  select encode(sha256(convert_to('por1-test-token:'||label,'utf8')),'hex') $$;

-- ── Privilege posture ───────────────────────────────────────────────────────
select assert_true((select relrowsecurity and relforcerowsecurity from pg_class where relname='yorisou_account_deletion_manifests'),'manifest RLS enabled and forced');
select assert_true(not has_table_privilege('anon','public.yorisou_account_deletion_manifests','select'),'anon manifest read denied');
select assert_true(not has_table_privilege('authenticated','public.yorisou_account_deletion_manifests','select'),'authenticated manifest read denied');
select assert_true(not has_table_privilege('service_role','public.yorisou_account_deletion_manifests','insert'),'service-role direct manifest INSERT denied');
select assert_true(has_function_privilege('service_role','public.yorisou_account_deletion_complete_step(text,text,integer,text,text,jsonb)','execute'),'service-role complete_step allowed');
select assert_true(not has_function_privilege('anon','public.yorisou_account_deletion_complete_step(text,text,integer,text,text,jsonb)','execute'),'anon complete_step denied');
select assert_true(not has_function_privilege('authenticated','public.yorisou_account_deletion_executor_claim(text,text,integer)','execute'),'authenticated claim denied');

-- ── The cursor vocabulary is exactly the nine required stages ───────────────
select assert_true((select count(*)=9 from (values
  ('mutation_draining'),('lock_marker'),('session_revocation'),('database_erasure'),
  ('storage_erasure'),('identity_erasure'),('verifying'),('finalizing'),('completed')) v(s)
  where public.yorisou_account_deletion_stage_rank(v.s) is not null),'nine ranked stages');
select assert_true(public.yorisou_account_deletion_stage_rank('locked') is null,'the old "locked" cursor value is gone');

-- ── The expanded closed operation set ───────────────────────────────────────
do $$
declare c text; v_gen int;
begin
  insert into public.yorisou_account_mutation_gates(owner_account_id) values ('op-probe') on conflict do nothing;
  select generation into v_gen from public.yorisou_account_mutation_gates where owner_account_id='op-probe';
  foreach c in array array['support_profile_update','password_update','line_binding','account_profile_update',
                           'identity_mirror_sync','session_identity_upgrade','account_recovery',
                           'account_registration','line_primary_provisioning','password_reset_issue',
                           'session_account_binding','foundation_profile_update','foundation_identity_binding'] loop
    insert into public.yorisou_account_mutation_leases(owner_account_id,gate_generation,operation_code,expires_at)
    values ('op-probe', v_gen, c, now()+interval '30 seconds');
  end loop;
  perform assert_true((select count(*)=13 from public.yorisou_account_mutation_leases where owner_account_id='op-probe'),'all 13 operation codes accepted');
end $$;
do $$ begin
  insert into public.yorisou_account_mutation_leases(owner_account_id,gate_generation,operation_code,expires_at)
  values ('op-probe',1,'whatever_i_like',now()+interval '30 seconds');
  raise exception 'arbitrary operation code accepted';
exception when check_violation then null; end $$;
delete from public.yorisou_account_mutation_leases where owner_account_id='op-probe';
delete from public.yorisou_account_mutation_gates where owner_account_id='op-probe';

-- ── The retired bypass ──────────────────────────────────────────────────────
do $$ begin
  perform public.yorisou_account_deletion_mark_cursor('anyone','database_erasure',true);
  raise exception 'retired mark_cursor still moved the cursor';
exception when others then
  if position('mark_cursor_retired' in sqlerrm)=0 then raise; end if; end $$;
SQL

# ─────────────────────────────────────────────────────────────────────────────
# Fixture: user A (to be deleted) and user B (must be untouched).
# ─────────────────────────────────────────────────────────────────────────────
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -At <<'SQL'
select public.yorisou_account_deletion_open('user-a');
select public.yorisou_account_deletion_open('user-b');
select public.yorisou_account_deletion_advance('user-a','identity_verified');

-- Opening the job alone must NOT set the cursor; reaching identity_verified must.
select assert_true((select execution_cursor is null from public.yorisou_account_deletion_jobs where owner_account_id='user-b'),'unverified job has no cursor');
select assert_true((select execution_cursor='mutation_draining' from public.yorisou_account_deletion_jobs where owner_account_id='user-a'),'verified job starts at mutation_draining');
SQL

echo "── scenario 4/7: dual executors, stale generation, release ─────────────"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -At <<'SQL'
-- 4. TWO DELETION EXECUTORS AGAINST THE SAME JOB.
select assert_true((public.yorisou_account_deletion_executor_claim('user-a',tok('exec1'),90)->>'claimed')::boolean,'executor 1 claims');
select assert_true((public.yorisou_account_deletion_executor_claim('user-a',tok('exec2'),90)->>'claimed')::boolean is false,'executor 2 refused while claim is live');
select assert_true(public.yorisou_account_deletion_executor_claim('user-a',tok('exec2'),90)->>'reason'='executor_already_claimed','refusal is named, not silent');

-- 7a. A step presented with a STALE GENERATION is refused even by the right token.
do $$ begin
  perform public.yorisou_account_deletion_complete_step('user-a',tok('exec1'),0,'mutation_draining','lock_marker');
  raise exception 'stale generation accepted';
exception when others then if position('stale_generation' in sqlerrm)=0 then raise; end if; end $$;

-- 7b. A step from a non-owner is refused.
do $$ begin
  perform public.yorisou_account_deletion_complete_step('user-a',tok('exec2'),1,'mutation_draining','lock_marker');
  raise exception 'non-owner step accepted';
exception when others then if position('not_owner' in sqlerrm)=0 then raise; end if; end $$;

-- 7c. After RELEASE the job is claimable again, and the released token is dead.
select assert_true(public.yorisou_account_deletion_executor_release('user-a',tok('exec1'),1),'executor 1 releases');
select assert_true((public.yorisou_account_deletion_executor_claim('user-a',tok('exec2'),90)->>'claimed')::boolean,'executor 2 claims after release');
do $$ begin
  perform public.yorisou_account_deletion_complete_step('user-a',tok('exec1'),1,'mutation_draining','lock_marker');
  raise exception 'released token replayed successfully';
exception when others then if position('not_owner' in sqlerrm)=0 and position('stale_generation' in sqlerrm)=0 then raise; end if; end $$;
-- Hand the job back to exec1 for the rest of the run.
select public.yorisou_account_deletion_executor_release('user-a',tok('exec2'),2);
select assert_true((public.yorisou_account_deletion_executor_claim('user-a',tok('exec1'),90)->>'claimed')::boolean,'exec1 reclaims (generation 3)');
SQL

echo "── scenario 1/2/3: stale writers versus deletion ───────────────────────"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -At <<'SQL'
-- Three stale writers, each on a different real write path, each holding a lease taken BEFORE the
-- deletion started — the exact shape of the bug: read under a lease, deletion begins, stale write.
select public.yorisou_account_mutation_begin('user-a','account_profile_update',30);      -- 1. account
select public.yorisou_account_mutation_begin('user-a','foundation_profile_update',30);   -- 2. foundation
select public.yorisou_account_mutation_begin('user-a','session_account_binding',30);     -- 3. session

-- Deletion cannot proceed: three writers are still inside.
select assert_true((public.yorisou_account_deletion_drain_gate('user-a',tok('exec1'),3)->>'drained')::boolean is false,'drain blocked by three live writers');
select assert_true((public.yorisou_account_deletion_drain_gate('user-a',tok('exec1'),3)->>'activeLeases')::int=3,'all three counted');
select assert_true(public.yorisou_account_deletion_drain_gate('user-a',tok('exec1'),3)->>'gateState'='draining','gate is draining, not closed');

-- 6a. LEASE DENIAL DURING DRAINING. New writers are refused the moment the gate closes to them.
do $$ begin
  perform public.yorisou_account_mutation_begin('user-a','password_update',30);
  raise exception 'new lease granted during draining';
exception when others then if position('denied_gate_draining' in sqlerrm)=0 then raise; end if; end $$;

-- The crossing is refused while writers remain — this is the invariant, stated as a step.
do $$ begin
  perform public.yorisou_account_deletion_complete_step('user-a',tok('exec1'),3,'mutation_draining','lock_marker');
  raise exception 'crossed the irreversible boundary with live writers';
exception when others then
  -- Either refusal is correct and both are the same invariant: with writers still inside, the gate
  -- is `draining` rather than `closed`, so the closed check fires before the drained count does.
  if position('gate_not_closed' in sqlerrm)=0 and position('gate_not_drained' in sqlerrm)=0 then raise; end if; end $$;

-- The in-flight writers finish — the fence lets them, which is what makes it sound.
do $$ declare l record; begin
  for l in select id from public.yorisou_account_mutation_leases where owner_account_id='user-a' and released_at is null and drained_at is null loop
    perform public.yorisou_account_mutation_release(l.id);
  end loop;
end $$;
select assert_true((public.yorisou_account_deletion_drain_gate('user-a',tok('exec1'),3)->>'drained')::boolean,'gate drains once valid pre-close writers finish');

-- 7d. A RELEASED lease cannot be replayed into blocking the gate again.
select assert_true((public.yorisou_account_deletion_drain_gate('user-a',tok('exec1'),3)->>'activeLeases')::int=0,'released leases stay released');

-- 6b. LEASE DENIAL WHEN CLOSED.
do $$ begin
  perform public.yorisou_account_mutation_begin('user-a','account_recovery',30);
  raise exception 'lease granted against a closed gate';
exception when others then if position('denied_gate_closed' in sqlerrm)=0 then raise; end if; end $$;
SQL

echo "── manifest freeze and the crossing ────────────────────────────────────"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -At <<'SQL'
-- Nothing may cross without a manifest: every stage after the crossing depends on one.
do $$ begin
  perform public.yorisou_account_deletion_complete_step('user-a',tok('exec1'),3,'mutation_draining','lock_marker');
  raise exception 'crossed without a manifest';
exception when others then if position('manifest_missing' in sqlerrm)=0 then raise; end if; end $$;

select public.yorisou_account_deletion_manifest_put('user-a',tok('exec1'),3, jsonb_build_object(
  'primaryAccountKey','phase1/accounts/by-id/user-a.json',
  'emailLookupKey','phase1/accounts/by-email/deadbeef.json',
  'lineLookupKey','phase1/accounts/by-line-user/cafebabe.json',
  'sessionIds', jsonb_build_array('sess-1','sess-2'),
  'passwordResetHashes', jsonb_build_array('prh-1'),
  'consultationIds', jsonb_build_array('cons-1'),
  'lineEventIds', jsonb_build_array('levt-1'),
  'recentSubjectFingerprints', jsonb_build_array('rsf-1'),
  'foundationUserProfileId','up-1',
  'foundationAuthIdentityIds', jsonb_build_array('ai-email','ai-line'),
  'supportConversationIds', jsonb_build_array('conv-1')));

-- The manifest holds no raw secret material. Checked by KEY NAME and by shape, not by a keyword
-- sweep of the whole document: `passwordResetHashes` legitimately contains the word "password", and
-- an assertion that trips on it is an assertion that gets loosened until it means nothing.
do $$
declare v jsonb; k text;
begin
  select payload into v from public.yorisou_account_deletion_manifests m
    join public.yorisou_account_deletion_jobs j on j.id=m.job_id where j.owner_account_id='user-a';
  foreach k in array array['password','passwordHash','cookie','sessionCookie','email','rawEmail','lineUserId','token'] loop
    perform assert_true(not (v ? k), 'manifest must not carry a raw "'||k||'" field');
  end loop;
  -- No raw address anywhere: the email is present only as the hashed lookup KEY.
  perform assert_true(position('@' in v::text) = 0, 'manifest holds no raw email address');
  perform assert_true(v->>'emailLookupKey' like 'phase1/accounts/by-email/%', 'email appears only as a hashed lookup key');
  perform assert_true(v->>'lineLookupKey'  like 'phase1/accounts/by-line-user/%', 'LINE id appears only as a hashed lookup key');
end $$;

-- IMMUTABLE: a second write is a no-op, never an overwrite.
select public.yorisou_account_deletion_manifest_put('user-a',tok('exec1'),3, jsonb_build_object('primaryAccountKey','phase1/accounts/by-id/ATTACKER.json'));
select assert_true((select payload->>'primaryAccountKey'='phase1/accounts/by-id/user-a.json' from public.yorisou_account_deletion_manifests m join public.yorisou_account_deletion_jobs j on j.id=m.job_id where j.owner_account_id='user-a'),'manifest cannot be redirected');

-- THE CROSSING.
select assert_true((public.yorisou_account_deletion_complete_step('user-a',tok('exec1'),3,'mutation_draining','lock_marker')->>'irreversible')::boolean,'crossing records irreversibility');
select assert_true((select irreversible_started_at is not null and state='locked' from public.yorisou_account_deletion_jobs where owner_account_id='user-a'),'irreversible_started_at set, state follows the cursor');

-- Past the crossing the manifest is frozen even to the owning executor.
do $$ begin
  perform public.yorisou_account_deletion_manifest_put('user-a',tok('exec1'),3,'{"primaryAccountKey":"x"}'::jsonb);
  raise exception 'manifest written after the crossing';
exception when others then if position('manifest_frozen' in sqlerrm)=0 then raise; end if; end $$;

-- Cancellation is denied, and denied by the RECORDED FACT rather than by a state string.
do $$ begin
  perform public.yorisou_account_deletion_advance('user-a','cancelled');
  raise exception 'cancelled after the irreversible boundary';
exception when others then if position('irreversible' in sqlerrm)=0 then raise; end if; end $$;
SQL

echo "── scenario 5: crash after every external action, before the cursor moves ──"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -At <<'SQL'
-- The saga's whole promise is that a crash between "the external thing happened" and "we wrote that
-- down" is survivable. Walked stage by stage: record a retryable error, re-claim, and prove the
-- cursor still names the stage that must run — never an earlier one.
do $$
declare
  v_stages text[] := array['lock_marker','session_revocation','database_erasure','storage_erasure','identity_erasure','verifying','finalizing'];
  v_next   text[] := array['session_revocation','database_erasure','storage_erasure','identity_erasure','verifying','finalizing','completed'];
  v_i int; v_gen int; v_claim jsonb;
begin
  for v_i in 1 .. array_length(v_stages,1) loop
    select executor_generation into v_gen from public.yorisou_account_deletion_jobs where owner_account_id='user-a';

    -- CRASH: the external action ran, the cursor advance did not.
    perform public.yorisou_account_deletion_record_retryable_error('user-a',tok('exec1'),v_gen,'crash_at_'||v_stages[v_i]);
    perform assert_true((select execution_cursor = v_stages[v_i] and state='failed_retryable'
                           from public.yorisou_account_deletion_jobs where owner_account_id='user-a'),
                        'retryable failure PRESERVES the cursor at '||v_stages[v_i]);

    -- RESUME: a fresh claim resumes AT the cursor. It must not walk back to `locked`, and it must
    -- not infer a stage from `failed_retryable`.
    perform public.yorisou_account_deletion_executor_release('user-a',tok('exec1'),v_gen);
    v_claim := public.yorisou_account_deletion_executor_claim('user-a',tok('exec1'),90);
    perform assert_true(v_claim->>'cursor' = v_stages[v_i], 'retry resumes AT '||v_stages[v_i]);
    perform assert_true((v_claim->>'irreversible')::boolean, 'retry cannot clear irreversibility');

    -- A retry may not replay an earlier stage even with a valid claim.
    if v_i > 1 then
      begin
        perform public.yorisou_account_deletion_complete_step('user-a',tok('exec1'),(v_claim->>'generation')::int, v_stages[v_i-1], v_stages[v_i]);
        raise exception 'replayed an earlier identity-writing stage';
      exception when others then
        if position('cursor_mismatch' in sqlerrm)=0 then raise; end if;
      end;
    end if;

    -- The last stage is finalization, which is its own atomic operation.
    exit when v_stages[v_i] = 'finalizing';
    perform public.yorisou_account_deletion_complete_step('user-a',tok('exec1'),(v_claim->>'generation')::int, v_stages[v_i], v_next[v_i]);
  end loop;
end $$;

select assert_true((select execution_cursor='finalizing' from public.yorisou_account_deletion_jobs where owner_account_id='user-a'),'walked to finalizing, one stage at a time');

-- Monotonic: no backward move and no skip, at any point.
do $$ declare v_gen int; begin
  select executor_generation into v_gen from public.yorisou_account_deletion_jobs where owner_account_id='user-a';
  begin
    perform public.yorisou_account_deletion_complete_step('user-a',tok('exec1'),v_gen,'finalizing','database_erasure');
    raise exception 'cursor moved backwards';
  exception when others then if position('illegal_cursor' in sqlerrm)=0 then raise; end if; end;
end $$;
do $$ declare v_gen int; begin
  select executor_generation into v_gen from public.yorisou_account_deletion_jobs where owner_account_id='user-a';
  begin
    -- A skip would mark work done that never ran.
    perform public.yorisou_account_deletion_complete_step('user-a',tok('exec1'),v_gen,'verifying','completed');
    raise exception 'cursor skipped a stage';
  exception when others then if position('cursor_mismatch' in sqlerrm)=0 and position('illegal_cursor' in sqlerrm)=0 then raise; end if; end;
end $$;
SQL

echo "── scenario 10/11: verification writes nothing; user B untouched ───────"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -At <<'SQL'
-- 10. VERIFICATION PERFORMS NO IDENTITY WRITE. The database residue check is a pure read: proven by
--     snapshotting every governed table around it rather than by reading the function and believing
--     it. A verification that repaired what it found would be a verification that can never fail.
do $$
declare v_before text; v_after text;
begin
  select md5(string_agg(x,'|' order by x)) into v_before from (
    select j.id::text||j.state||coalesce(j.execution_cursor,'')||coalesce(j.owner_account_id,'')||j.executor_generation::text as x
      from public.yorisou_account_deletion_jobs j
    union all select g.owner_account_id||g.gate_state||g.generation::text from public.yorisou_account_mutation_gates g
    union all select l.id::text||l.operation_code from public.yorisou_account_mutation_leases l
    union all select m.job_id::text||m.payload::text from public.yorisou_account_deletion_manifests m) s;

  perform public.yorisou_account_deletion_verify_database('user-a');

  select md5(string_agg(x,'|' order by x)) into v_after from (
    select j.id::text||j.state||coalesce(j.execution_cursor,'')||coalesce(j.owner_account_id,'')||j.executor_generation::text as x
      from public.yorisou_account_deletion_jobs j
    union all select g.owner_account_id||g.gate_state||g.generation::text from public.yorisou_account_mutation_gates g
    union all select l.id::text||l.operation_code from public.yorisou_account_mutation_leases l
    union all select m.job_id::text||m.payload::text from public.yorisou_account_deletion_manifests m) s;

  perform assert_true(v_before = v_after, 'verification wrote nothing');
end $$;

-- FINALIZE, as one atomic act: verify, complete, and stop naming the person.
select assert_true((public.yorisou_account_deletion_finalize_step('user-a',tok('exec1'),
  (select executor_generation from public.yorisou_account_deletion_jobs where owner_account_id='user-a'))->>'completed')::boolean,'finalize completes');
select assert_true((select count(*)=1 from public.yorisou_account_deletion_jobs where owner_account_id is null and state='completed' and execution_cursor='completed'),'completed job holds a fingerprint, not an id');
select assert_true((select count(*)=0 from public.yorisou_account_deletion_jobs where owner_account_id='user-a'),'user A is no longer named');

-- 6c. LEASE DENIAL WHEN COMPLETED — through the fingerprint, because the id is gone.
do $$ begin
  perform public.yorisou_account_mutation_begin('user-a','account_profile_update',30);
  raise exception 'lease granted to a deleted account';
exception when others then if position('denied_deleted' in sqlerrm)=0 then raise; end if; end $$;

-- The manifest survives the loss of the id, which is the entire reason it exists.
select assert_true(public.yorisou_account_deletion_manifest_for_owner('user-a')->>'primaryAccountKey'='phase1/accounts/by-id/user-a.json','manifest still reachable after the id is gone');

-- 11. USER B REMAINS UNCHANGED.
select assert_true((select state='requested' and execution_cursor is null and executor_generation=0 and irreversible_started_at is null
                      from public.yorisou_account_deletion_jobs where owner_account_id='user-b'),'user B untouched');
select assert_true((select count(*)=0 from public.yorisou_account_mutation_gates where owner_account_id='user-b'),'user B has no gate');
select assert_true(public.yorisou_account_mutation_begin('user-b','support_profile_update',30)->>'leaseId' is not null,'user B can still write');
SQL

echo "── scenario 8/9: the execution grace, on an injected clock ─────────────"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -At <<'SQL'
-- A worker can die between taking a lease and writing. Expiry alone is therefore NOT proof that no
-- write can still land, so an unreleased lease is abandoned only after a grace longer than the
-- platform's maximum request duration. Both sides of that boundary are proven here, on the injected
-- clock — waiting out 180 real seconds would prove the same thing three minutes more slowly.
select public.yorisou_account_deletion_open('user-c');
select public.yorisou_account_deletion_advance('user-c','identity_verified');
select public.yorisou_account_deletion_executor_claim('user-c',tok('execC'),90);

-- A lease that is already expired, but only just.
insert into public.yorisou_account_mutation_gates(owner_account_id) values ('user-c') on conflict do nothing;
insert into public.yorisou_account_mutation_leases(owner_account_id,gate_generation,operation_code,expires_at)
select 'user-c', generation, 'password_update', now() - interval '5 seconds'
  from public.yorisou_account_mutation_gates where owner_account_id='user-c';

-- 8. EXPIRED, INSIDE THE GRACE: still blocking. The process may still be running.
select assert_true((public.yorisou_account_deletion_drain_gate('user-c',tok('execC'),1)->>'drained')::boolean is false,'expired lease inside grace still blocks');
select assert_true((public.yorisou_account_deletion_drain_gate('user-c',tok('execC'),1)->>'activeLeases')::int=1,'expired-in-grace lease is still counted');

-- Just short of the full grace: still blocking. (grace is 180s; the lease expired 5s ago)
set "yorisou.deletion_clock_skew_seconds" = '170';
select assert_true((public.yorisou_account_deletion_drain_gate('user-c',tok('execC'),1)->>'drained')::boolean is false,'still blocking at 175s of a 180s grace');

-- 9. PAST THE GRACE: drains.
set "yorisou.deletion_clock_skew_seconds" = '200';
select assert_true((public.yorisou_account_deletion_drain_gate('user-c',tok('execC'),1)->>'drained')::boolean,'expired lease drains once the grace has passed');
reset "yorisou.deletion_clock_skew_seconds";

-- 7e. A DRAINED lease cannot be replayed into blocking the gate again.
select assert_true((public.yorisou_account_deletion_drain_gate('user-c',tok('execC'),1)->>'activeLeases')::int=0,'drained leases stay drained');
SQL

# ─────────────────────────────────────────────────────────────────────────────
# TRUE CONCURRENCY, WITH AN EXPLICIT LATCH.
#
# Two persistent sessions. Session A opens a transaction and stops inside it; the harness OBSERVES
# that it has stopped; only then is session B released into the contended path. B blocks on the row
# lock rather than racing for it, and the assertion is about what B is told when A commits — not
# about who happened to arrive first.
# ─────────────────────────────────────────────────────────────────────────────
echo "── scenario 4b: two executors contending on the same row, latched ──────"

mkfifo "$WORK/in_a" "$WORK/in_b"
psql "$DATABASE_URL" -q -At -f - < "$WORK/in_a" > "$WORK/out_a" 2>&1 &
PID_A=$!
psql "$DATABASE_URL" -q -At -f - < "$WORK/in_b" > "$WORK/out_b" 2>&1 &
PID_B=$!
exec 3> "$WORK/in_a"
exec 4> "$WORK/in_b"

# Send SQL to a session and BLOCK until its sentinel appears. This is the latch: the harness never
# proceeds on the assumption that a statement has finished.
send_wait() {  # send_wait <fd> <out-file> <tag> <sql>
  local fd="$1" out="$2" tag="$3" sql="$4" waited=0
  printf '%s\n\\echo LATCH_%s\n' "$sql" "$tag" >&"$fd"
  while ! grep -q "LATCH_${tag}" "$out" 2>/dev/null; do
    sleep 0.05; waited=$((waited+1))
    if [[ $waited -gt 400 ]]; then echo "FAIL: session did not reach latch $tag" >&2; exit 1; fi
  done
}
# Send WITHOUT waiting — used only for the statement that is EXPECTED to block on a row lock.
send_async() { printf '%s\n\\echo LATCH_%s\n' "$3" "$2" >&"$1"; }
await_latch() {
  local out="$1" tag="$2" waited=0
  while ! grep -q "LATCH_${tag}" "$out" 2>/dev/null; do
    sleep 0.05; waited=$((waited+1))
    if [[ $waited -gt 400 ]]; then echo "FAIL: session did not reach latch $tag" >&2; exit 1; fi
  done
}
# Prove a session is genuinely BLOCKED rather than merely slow: ask Postgres, which knows.
assert_blocked() {  # assert_blocked <pid-tag-query-fragment>
  local waited=0
  while [[ $waited -lt 200 ]]; do
    if [[ "$(psql "$DATABASE_URL" -At -c "select count(*) from pg_stat_activity where wait_event_type='Lock' and query like '%$1%'")" == "1" ]]; then
      return 0
    fi
    sleep 0.05; waited=$((waited+1))
  done
  echo "FAIL: expected a session blocked on a row lock for '$1'" >&2; exit 1
}

send_wait 3 "$WORK/out_a" a_setup "select public.yorisou_account_deletion_open('user-d'); select public.yorisou_account_deletion_advance('user-d','identity_verified');"
send_wait 3 "$WORK/out_a" a_claim "select public.yorisou_account_deletion_executor_claim('user-d', encode(sha256(convert_to('por1-test-token:execD1','utf8')),'hex'), 90)->>'claimed';"

# A opens a transaction and takes the job's row lock, then STOPS. The harness confirms it has stopped.
send_wait 3 "$WORK/out_a" a_hold "begin; select executor_generation from public.yorisou_account_deletion_jobs where owner_account_id='user-d' for update;"

# B now tries to claim the SAME job. It must BLOCK on A's row lock, not proceed alongside it.
send_async 4 b_claim "select public.yorisou_account_deletion_executor_claim('user-d', encode(sha256(convert_to('por1-test-token:execD2','utf8')),'hex'), 90)->>'claimed';"
assert_blocked "yorisou_account_deletion_executor_claim"

# Only now does A commit. B is released into a world where A's claim is already a fact.
send_wait 3 "$WORK/out_a" a_commit "commit;"
await_latch "$WORK/out_b" b_claim

if ! grep -qx "false" "$WORK/out_b"; then
  echo "FAIL: second executor was allowed to claim a job already held" >&2
  cat "$WORK/out_b" >&2; exit 1
fi
echo "  ok: contending executor blocked on the row lock, then refused"

# The same latch, applied to the step itself: two executors must never EXECUTE one stage together.
send_wait 3 "$WORK/out_a" a_prep "select public.yorisou_account_mutation_begin('user-d','account_profile_update',30); select public.yorisou_account_mutation_release((select id from public.yorisou_account_mutation_leases where owner_account_id='user-d')); select public.yorisou_account_deletion_drain_gate('user-d', encode(sha256(convert_to('por1-test-token:execD1','utf8')),'hex'), 1)->>'drained'; select public.yorisou_account_deletion_manifest_put('user-d', encode(sha256(convert_to('por1-test-token:execD1','utf8')),'hex'), 1, '{\"primaryAccountKey\":\"phase1/accounts/by-id/user-d.json\"}'::jsonb);"
send_wait 3 "$WORK/out_a" a_hold2 "begin; select public.yorisou_account_deletion_complete_step('user-d', encode(sha256(convert_to('por1-test-token:execD1','utf8')),'hex'), 1, 'mutation_draining','lock_marker')->>'cursor';"

# B, holding the SAME token and generation, attempts the SAME step. It blocks; then it is refused,
# because by the time it runs the cursor has already moved past what it expected.
send_async 4 b_step "select public.yorisou_account_deletion_complete_step('user-d', encode(sha256(convert_to('por1-test-token:execD1','utf8')),'hex'), 1, 'mutation_draining','lock_marker')->>'cursor';"
assert_blocked "yorisou_account_deletion_complete_step"
send_wait 3 "$WORK/out_a" a_commit2 "commit;"
await_latch "$WORK/out_b" b_step

if ! grep -q "cursor_mismatch" "$WORK/out_b"; then
  echo "FAIL: two executors executed the same stage" >&2
  cat "$WORK/out_b" >&2; exit 1
fi
echo "  ok: duplicate step blocked, then refused on the expected-cursor check"

printf '\\q\n' >&3; printf '\\q\n' >&4
exec 3>&-; exec 4>&-
wait "$PID_A" 2>/dev/null || true
wait "$PID_B" 2>/dev/null || true

echo
echo "POR-1 deletion resume engine + mutation fence: ALL ASSERTIONS PASSED"
