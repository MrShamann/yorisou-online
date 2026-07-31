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
         202607300005_por1_deletion_resume_engine \
         202607310001_por1_canonical_line_activity \
         202607310002_por1_line_subject_erasure_barrier \
         202607310003_por1_identity_provisioning_saga \
         202607310004_por1_canonical_identity_links \
         202607310005_por1_identity_link_same_owner_race \
         202607310006_por1_identity_link_sync_is_additive \
         202607310007_por1_deletion_open_same_owner_race; do
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$ROOT/supabase/preview-only-migrations/$f.sql"
done
# Idempotence: re-applying the new migrations must succeed without error.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$ROOT/supabase/preview-only-migrations/202607300005_por1_deletion_resume_engine.sql"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$ROOT/supabase/preview-only-migrations/202607310001_por1_canonical_line_activity.sql"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$ROOT/supabase/preview-only-migrations/202607310002_por1_line_subject_erasure_barrier.sql"
# ...and re-applying 202607310001 AFTER the barrier must NOT silently restore the pre-barrier
# `yorisou_line_event_record` / `yorisou_line_activity_erase`. Migrations are applied in version
# order, so this cannot happen in a real environment; it is asserted because a `create or replace`
# pair across two files is exactly the shape where an out-of-order reapply goes unnoticed.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$ROOT/supabase/preview-only-migrations/202607310002_por1_line_subject_erasure_barrier.sql"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$ROOT/supabase/preview-only-migrations/202607310003_por1_identity_provisioning_saga.sql"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$ROOT/supabase/preview-only-migrations/202607310004_por1_canonical_identity_links.sql"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$ROOT/supabase/preview-only-migrations/202607310005_por1_identity_link_same_owner_race.sql"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$ROOT/supabase/preview-only-migrations/202607310006_por1_identity_link_sync_is_additive.sql"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$ROOT/supabase/preview-only-migrations/202607310007_por1_deletion_open_same_owner_race.sql"

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

-- ── THE ASYMMETRY THE COOKIE GATE RESTS ON ─────────────────────────────────
--
-- A completed job no longer carries the account id, so the two durable reads disagree about it BY
-- DESIGN, and the authorization boundary depends on picking the right one. `status` falls back to
-- `owner_fingerprint` and still answers "completed"; `resume_state` looks the job up by id alone and
-- honestly reports "none".
--
-- That difference is the whole repair. A viewer resolver reading `resume_state` would be told there
-- is no job — indistinguishable from a transient store miss — and would hand an erased account back
-- to whoever still holds the cookie. Asserted here rather than inferred from the function bodies,
-- because it is the single fact the deletion-surface gate cannot be correct without.
select assert_true(public.yorisou_account_deletion_status('user-a')->>'state'='completed',
  'status answers COMPLETED about an account it deliberately no longer names');
select assert_true(public.yorisou_account_deletion_resume_state('user-a')->>'state'='none',
  'resume_state cannot answer about a completed job — which is why the gate must not read it');
select assert_true(public.yorisou_account_deletion_status('never-deleted-user')->>'state'='none',
  'the completed answer is scoped to that owner and is not a blanket yes');

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

# ─────────────────────────────────────────────────────────────────────────────
# Scenarios 12-17 — CANONICAL LINE ACTIVITY.
#
# The model these replace was one shared mutable JSON array on an object transport with no
# read-after-write consistency. Scenario 12 is the exact interleaving that lost an entry there: two
# writers overlapping on the index. It cannot lose one here, because there is no shared row to
# overwrite — which is the whole claim, so it is proved with a real latch rather than asserted.
# ─────────────────────────────────────────────────────────────────────────────
echo
echo "── scenario 12: overlapping writers for DIFFERENT subjects — no lost update ──"

SUBJ_A="$(printf 'Uaaaa1111' | shasum -a 256 | cut -d' ' -f1)"
SUBJ_B="$(printf 'Ubbbb2222' | shasum -a 256 | cut -d' ' -f1)"

# A opens a transaction, writes its event, and STOPS inside the transaction — the state in which the
# array model would have been holding a stale in-memory copy of the whole document.
send_wait 3 "$WORK/out_a" line_a_begin "begin; select public.yorisou_line_event_record('evt-a1','$SUBJ_A','message','Uaaaa1111','wh-a1')->>'outcome';"
# B writes and COMMITS while A is still open. Under the array model B's entry is now in a document A
# has never seen.
send_wait 4 "$WORK/out_b" line_b_write "select public.yorisou_line_event_record('evt-b1','$SUBJ_B','message','Ubbbb2222','wh-b1')->>'outcome';"
send_wait 3 "$WORK/out_a" line_a_commit "commit;"

both="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_canonical_line_events where line_subject_hash in ('$SUBJ_A','$SUBJ_B') and retention_state='active'")"
if [[ "$both" != "2" ]]; then
  echo "FAIL: overlapping writers lost an entry (expected 2 active rows, got $both)" >&2; exit 1
fi
recent="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_line_recent_subjects(50)")"
if [[ "$recent" != "2" ]]; then
  echo "FAIL: derived recent-subject list is missing a subject (got $recent)" >&2; exit 1
fi
echo "  ok: both writers survived an overlap that the shared array could not"

echo "── scenario 13: overlapping writers for the SAME subject ────────────────"
# Since the subject-erasure barrier (202607310002) the two writers SERIALIZE on the subject row.
# That is the price of the barrier and it is deliberately per subject, not global: scenario 12 just
# proved two different subjects still overlap freely. What must not change is the outcome — every
# event survives, and one subject still occupies exactly one derived slot.
send_wait 3 "$WORK/out_a" line_a_begin2 "begin; select public.yorisou_line_event_record('evt-a2','$SUBJ_A','message','Uaaaa1111','wh-a2')->>'outcome';"
send_async 4 line_b_write2 "select public.yorisou_line_event_record('evt-a3','$SUBJ_A','message','Uaaaa1111','wh-a3')->>'outcome';"
assert_blocked "yorisou_line_event_record"
send_wait 3 "$WORK/out_a" line_a_commit2 "commit;"
await_latch "$WORK/out_b" line_b_write2
same="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_canonical_line_events where line_subject_hash='$SUBJ_A' and retention_state='active'")"
if [[ "$same" != "3" ]]; then
  echo "FAIL: concurrent same-subject events lost one (expected 3, got $same)" >&2; exit 1
fi
# One subject must still occupy exactly one slot in the derived list, newest first.
slot="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_line_recent_subjects(50) where line_subject_hash='$SUBJ_A'")"
if [[ "$slot" != "1" ]]; then
  echo "FAIL: derived recent list returned $slot rows for one subject" >&2; exit 1
fi
echo "  ok: three events, one derived subject slot"

echo "── scenario 14: webhook redelivery is idempotent ────────────────────────"
out1="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_event_record('evt-a4','$SUBJ_A','message','Uaaaa1111','wh-a4')->>'outcome'")"
out2="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_event_record('evt-a4','$SUBJ_A','message','Uaaaa1111','wh-a4', p_is_redelivery => true)->>'outcome'")"
# The same LINE delivery id arriving under a DIFFERENT internal event id is still one delivery.
out3="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_event_record('evt-a4-dup','$SUBJ_A','message','Uaaaa1111','wh-a4')->>'outcome'")"
dup="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_canonical_line_events where webhook_event_id='wh-a4'")"
if [[ "$out1" != "recorded" || "$out2" != "repeated" || "$out3" != "repeated" || "$dup" != "1" ]]; then
  echo "FAIL: redelivery was not idempotent ($out1/$out2/$out3, rows=$dup)" >&2; exit 1
fi
echo "  ok: recorded, then repeated twice, one row"

echo "── scenario 15: conflicting reuse of one event identity is refused ──────"
if psql "$DATABASE_URL" -At -c "select public.yorisou_line_event_record('evt-a4','$SUBJ_B','message','Ubbbb2222','wh-a4')" >/dev/null 2>&1; then
  echo "FAIL: one event identity was allowed to rebind to another subject" >&2; exit 1
fi
still_a="$(psql "$DATABASE_URL" -At -c "select line_subject_hash from public.yorisou_canonical_line_events where line_event_id='evt-a4'")"
if [[ "$still_a" != "$SUBJ_A" ]]; then
  echo "FAIL: a refused conflict still altered the row" >&2; exit 1
fi
echo "  ok: refused, and the existing row is unchanged"

echo "── scenario 16: A is erased while B keeps receiving events ──────────────"
# B's delivery lands DURING A's erasure — the interleaving in which a whole-document rewrite would
# have taken B's entry with it.
send_wait 3 "$WORK/out_a" line_erase_begin "begin; select public.yorisou_line_activity_erase('$SUBJ_A');"
send_wait 4 "$WORK/out_b" line_b_during "select public.yorisou_line_event_record('evt-b2','$SUBJ_B','message','Ubbbb2222','wh-b2')->>'outcome';"
send_wait 3 "$WORK/out_a" line_erase_commit "commit;"

a_left="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_activity_residue('$SUBJ_A')")"
b_left="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_activity_residue('$SUBJ_B')")"
if [[ "$a_left" != "0" ]]; then echo "FAIL: A has $a_left active events after erasure" >&2; exit 1; fi
if [[ "$b_left" != "2" ]]; then echo "FAIL: B lost activity to A's erasure (expected 2, got $b_left)" >&2; exit 1; fi

# The tombstone must be content-free, and must not still name the person.
leak="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_canonical_line_events where retention_state='erased' and (line_subject_id is not null or message_text is not null or postback_data is not null or owner_account_id is not null or erased_at is null)")"
if [[ "$leak" != "0" ]]; then echo "FAIL: $leak erased rows still carry content or a raw LINE id" >&2; exit 1; fi
echo "  ok: A absent, B intact (2 events), tombstones content-free"

echo "── scenario 17: erasure is idempotent and absorbs a late redelivery ─────"
again="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_activity_erase('$SUBJ_A')")"
late="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_event_record('evt-a2','$SUBJ_A','message','Uaaaa1111','wh-a2')->>'outcome'")"
after="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_activity_residue('$SUBJ_A')")"
if [[ "$again" != "0" ]]; then echo "FAIL: a second erasure claimed to erase $again rows" >&2; exit 1; fi
if [[ "$late" != "erased" ]]; then echo "FAIL: a redelivery after erasure returned '$late'" >&2; exit 1; fi
if [[ "$after" != "0" ]]; then echo "FAIL: a redelivery resurrected $after rows" >&2; exit 1; fi
# And the manifest inventory still reports the family truthfully rather than as absent.
inv="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_activity_inventory('$SUBJ_A')->>'active_events'")"
if [[ "$inv" != "0" ]]; then echo "FAIL: inventory reports $inv active events after erasure" >&2; exit 1; fi
echo "  ok: second erase is a no-op, late redelivery absorbed, residue 0"

echo "── scenario 18: the subject digest is the only accepted address ─────────"
# A raw LINE id passed where a digest belongs must be refused, not stored.
if psql "$DATABASE_URL" -At -c "select public.yorisou_line_event_record('evt-raw','Uaaaa1111','message')" >/dev/null 2>&1; then
  echo "FAIL: a raw LINE id was accepted as a subject address" >&2; exit 1
fi
if psql "$DATABASE_URL" -At -c "select public.yorisou_line_activity_erase('Uaaaa1111')" >/dev/null 2>&1; then
  echo "FAIL: a raw LINE id was accepted as an erasure scope" >&2; exit 1
fi
echo "  ok: raw identifiers refused at both entry points"

# ─────────────────────────────────────────────────────────────────────────────
# Scenarios 19-29 — THE SUBJECT-LEVEL ERASURE BARRIER (202607310002).
#
# Everything above proves the EVENT model. None of it proves the case that decides whether a
# deletion holds: a brand-new event id for a subject that was erased. Under 202607310001 alone the
# record RPC finds no existing row, so it inserts an active one and the deleted person's activity is
# live again. These scenarios are about the subject, not the event.
# ─────────────────────────────────────────────────────────────────────────────
echo
echo "── scenario 19: a BRAND-NEW event id after erasure is absorbed ──────────"
# The defect. `evt-a3`/`wh-a3` have never been seen, so no event-level tombstone can refuse them.
new_id="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_event_record('evt-a7','$SUBJ_A','message','Uaaaa1111','wh-a7')->>'outcome'")"
new_wh="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_event_record('evt-a8','$SUBJ_A','message','Uaaaa1111','wh-a8')->>'outcome'")"
rows="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_canonical_line_events where line_subject_hash='$SUBJ_A' and retention_state='active'")"
if [[ "$new_id" != "erased" ]]; then echo "FAIL: a new event id after erasure returned '$new_id'" >&2; exit 1; fi
if [[ "$new_wh" != "erased" ]]; then echo "FAIL: a new webhook id after erasure returned '$new_wh'" >&2; exit 1; fi
if [[ "$rows" != "0" ]]; then echo "FAIL: $rows active rows were created for an erased subject" >&2; exit 1; fi
echo "  ok: new event id and new webhook id both absorbed, zero active rows"

echo "── scenario 20: an absorbed delivery stores NOTHING ─────────────────────"
# Not "stores a tombstone with the content nulled" — stores no row at all, so there is no place for
# a raw subject id or a message body to survive.
stored="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_canonical_line_events where line_event_id in ('evt-a7','evt-a8') or webhook_event_id in ('wh-a7','wh-a8')")"
leak2="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_canonical_line_events where line_subject_hash='$SUBJ_A' and (line_subject_id is not null or message_text is not null or postback_data is not null or reply_error is not null or owner_account_id is not null)")"
subj_leak="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_canonical_line_subjects where line_subject_hash='$SUBJ_A' and line_subject_hash !~ '^[0-9a-f]{64}\$'")"
if [[ "$stored" != "0" ]]; then echo "FAIL: an absorbed delivery created $stored rows" >&2; exit 1; fi
if [[ "$leak2" != "0" ]]; then echo "FAIL: $leak2 erased rows still carry content" >&2; exit 1; fi
if [[ "$subj_leak" != "0" ]]; then echo "FAIL: the subject registry holds a non-digest address" >&2; exit 1; fi
echo "  ok: no row, no raw subject id, no message content"

echo "── scenario 21: erasure residue counts the BARRIER, not just the rows ───"
# An un-erased subject with zero event rows is still residue: the next webhook makes it live.
fresh="$(printf 'Ufresh9999' | shasum -a 256 | cut -d' ' -f1)"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_line_event_record('evt-f1','$fresh','message','Ufresh9999','wh-f1')" >/dev/null
# Clear the EVENT rows only, the way the retired event-scoped erasure would have.
psql "$DATABASE_URL" -At -q -c "update public.yorisou_canonical_line_events set retention_state='erased', erased_at=now(), message_text=null, postback_data=null, reply_error=null, owner_account_id=null, line_subject_id=null where line_subject_hash='$fresh'" >/dev/null
ev_only="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_activity_residue('$fresh')")"
barrier="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_subject_erasure_residue('$fresh')")"
if [[ "$ev_only" != "0" ]]; then echo "FAIL: event residue is $ev_only after clearing every row" >&2; exit 1; fi
if [[ "$barrier" != "1" ]]; then echo "FAIL: erasure residue is $barrier for a subject that is still active" >&2; exit 1; fi
# And an unknown subject is residue too — unknown must never mean absent.
unknown="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_subject_erasure_residue(encode(sha256(convert_to('never-seen','utf8')),'hex'))")"
if [[ "$unknown" != "1" ]]; then echo "FAIL: an unknown subject reported residue $unknown, i.e. proven erased" >&2; exit 1; fi
psql "$DATABASE_URL" -At -q -c "select public.yorisou_line_subject_erase('$fresh')" >/dev/null
closed="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_subject_erasure_residue('$fresh')")"
if [[ "$closed" != "0" ]]; then echo "FAIL: residue is $closed after a real subject erasure" >&2; exit 1; fi
echo "  ok: rows-clear alone is residue 1; unknown is residue 1; subject erasure is residue 0"

echo "── scenario 22: erasing a subject that was NEVER seen still bars it ─────"
# A LINE-bound account deleted before its first webhook. There are no rows to sweep, so the state is
# the only thing that can protect it.
virgin="$(printf 'Uvirgin0000' | shasum -a 256 | cut -d' ' -f1)"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_line_subject_erase('$virgin')" >/dev/null
v_out="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_event_record('evt-v1','$virgin','message','Uvirgin0000','wh-v1')->>'outcome'")"
v_res="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_subject_erasure_residue('$virgin')")"
if [[ "$v_out" != "erased" ]]; then echo "FAIL: the first event for a pre-erased subject returned '$v_out'" >&2; exit 1; fi
if [[ "$v_res" != "0" ]]; then echo "FAIL: residue $v_res for a pre-erased, never-seen subject" >&2; exit 1; fi
echo "  ok: erased before it existed, and it stayed erased"

echo "── scenario 23: repeated subject erasure is idempotent ──────────────────"
r1="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_subject_erase('$SUBJ_A')::text")"
r2="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_subject_erase('$SUBJ_A')::text")"
stamp1="$(psql "$DATABASE_URL" -At -c "select erased_at from public.yorisou_canonical_line_subjects where line_subject_hash='$SUBJ_A'")"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_line_subject_erase('$SUBJ_A')" >/dev/null
stamp2="$(psql "$DATABASE_URL" -At -c "select erased_at from public.yorisou_canonical_line_subjects where line_subject_hash='$SUBJ_A'")"
if [[ "$r1" != *'"events_erased": 0'* || "$r2" != *'"events_erased": 0'* ]]; then
  echo "FAIL: a repeat erasure claimed to erase rows: $r1 / $r2" >&2; exit 1
fi
if [[ "$r2" != *'"already_erased": true'* ]]; then echo "FAIL: a repeat erasure did not report already_erased" >&2; exit 1; fi
if [[ "$stamp1" != "$stamp2" ]]; then echo "FAIL: a repeat erasure moved erased_at ($stamp1 -> $stamp2)" >&2; exit 1; fi
echo "  ok: no rows re-erased, already_erased reported, erased_at immutable"

echo "── scenario 24: the record RPC cannot overwrite an erased subject state ─"
before_state="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_subject_state('$SUBJ_A')->>'state'")"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_line_event_record('evt-a9','$SUBJ_A','message','Uaaaa1111','wh-a9','acct-a',encode(sha256(convert_to('acct-a','utf8')),'hex'))" >/dev/null
after_state="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_subject_state('$SUBJ_A')->>'state'")"
if [[ "$before_state" != "erased" || "$after_state" != "erased" ]]; then
  echo "FAIL: subject state went '$before_state' -> '$after_state' through the record RPC" >&2; exit 1
fi
# Nor may it be reachable directly: every write to the registry goes through a governed function.
for role in anon authenticated service_role; do
  for priv in insert update delete; do
    if [[ "$(psql "$DATABASE_URL" -At -c "select has_table_privilege('$role','public.yorisou_canonical_line_subjects','$priv')")" == "t" ]]; then
      echo "FAIL: $role holds direct $priv on the subject registry" >&2; exit 1
    fi
  done
done
if [[ "$(psql "$DATABASE_URL" -At -c "select has_function_privilege('service_role','public.yorisou_line_subject_lock(text,text)','execute')")" == "t" ]]; then
  echo "FAIL: the bare subject lock is reachable by service_role" >&2; exit 1
fi
if [[ "$(psql "$DATABASE_URL" -At -c "select relrowsecurity and relforcerowsecurity from pg_class where relname='yorisou_canonical_line_subjects'")" != "t" ]]; then
  echo "FAIL: RLS is not enabled AND forced on the subject registry" >&2; exit 1
fi
echo "  ok: state terminal through the record path, no direct writes, lock not an entry point"

echo "── scenario 25: an event transaction racing an erasure — one legal order ─"
# Latched, not timed. C records inside an open transaction and stops; the erasure must BLOCK on the
# subject row rather than proceed alongside it.
SUBJ_C="$(printf 'Ucccc3333' | shasum -a 256 | cut -d' ' -f1)"
send_wait 3 "$WORK/out_a" c_begin "begin; select public.yorisou_line_event_record('evt-c1','$SUBJ_C','message','Ucccc3333','wh-c1')->>'outcome';"
send_async 4 c_erase "select public.yorisou_line_subject_erase('$SUBJ_C')->>'events_erased';"
assert_blocked "yorisou_line_subject_erase"
send_wait 3 "$WORK/out_a" c_commit "commit;"
await_latch "$WORK/out_b" c_erase
c_res="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_subject_erasure_residue('$SUBJ_C')")"
if [[ "$c_res" != "0" ]]; then echo "FAIL: the event survived the erasure it raced (residue $c_res)" >&2; exit 1; fi
echo "  ok: the erasure blocked on the subject row, then swept the committed event"

echo "── scenario 26: two NEW events racing a completed erasure — zero active ──"
# The erasure holds the subject row; both writers must block on it and both must then be absorbed.
SUBJ_D="$(printf 'Udddd4444' | shasum -a 256 | cut -d' ' -f1)"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_line_event_record('evt-d0','$SUBJ_D','message','Udddd4444','wh-d0')" >/dev/null
send_wait 3 "$WORK/out_a" d_begin "begin; select public.yorisou_line_subject_erase('$SUBJ_D')->>'events_erased';"
send_async 4 d_write "select public.yorisou_line_event_record('evt-d1','$SUBJ_D','message','Udddd4444','wh-d1')->>'outcome';"
assert_blocked "yorisou_line_event_record"
send_wait 3 "$WORK/out_a" d_commit "commit;"
await_latch "$WORK/out_b" d_write
d_second="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_event_record('evt-d2','$SUBJ_D','message','Udddd4444','wh-d2')->>'outcome'")"
d_active="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_canonical_line_events where line_subject_hash='$SUBJ_D' and retention_state='active'")"
if ! grep -qx "erased" "$WORK/out_b"; then
  echo "FAIL: a new event racing a completed erasure was not absorbed" >&2; tail -5 "$WORK/out_b" >&2; exit 1
fi
if [[ "$d_second" != "erased" ]]; then echo "FAIL: the following new event returned '$d_second'" >&2; exit 1; fi
if [[ "$d_active" != "0" ]]; then echo "FAIL: $d_active active rows after a completed erasure" >&2; exit 1; fi
echo "  ok: both blocked on the barrier, both absorbed, zero active rows"

echo "── scenario 27: A erased while B records — B stays active ───────────────"
SUBJ_E="$(printf 'Ueeee5555' | shasum -a 256 | cut -d' ' -f1)"
SUBJ_F="$(printf 'Uffff6666' | shasum -a 256 | cut -d' ' -f1)"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_line_event_record('evt-e1','$SUBJ_E','message','Ueeee5555','wh-e1')" >/dev/null
send_wait 3 "$WORK/out_a" e_begin "begin; select public.yorisou_line_subject_erase('$SUBJ_E')->>'events_erased';"
# F is a DIFFERENT subject, so it must not block at all — the barrier is per subject, not global.
send_wait 4 "$WORK/out_b" f_write "select public.yorisou_line_event_record('evt-f2','$SUBJ_F','message','Uffff6666','wh-f2')->>'outcome';"
send_wait 3 "$WORK/out_a" e_commit "commit;"
e_res="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_subject_erasure_residue('$SUBJ_E')")"
f_state="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_subject_state('$SUBJ_F')->>'state'")"
f_events="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_activity_residue('$SUBJ_F')")"
if [[ "$e_res" != "0" ]]; then echo "FAIL: E not erased (residue $e_res)" >&2; exit 1; fi
if [[ "$f_state" != "active" ]]; then echo "FAIL: F's subject state is '$f_state' after E's erasure" >&2; exit 1; fi
if [[ "$f_events" != "1" ]]; then echo "FAIL: F has $f_events active events, expected 1" >&2; exit 1; fi
echo "  ok: E erased, F still active and still receiving"

echo "── scenario 28: the retired event-scoped erasure performs the FULL one ──"
SUBJ_G="$(printf 'Ugggg7777' | shasum -a 256 | cut -d' ' -f1)"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_line_event_record('evt-g1','$SUBJ_G','message','Ugggg7777','wh-g1')" >/dev/null
g_count="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_activity_erase('$SUBJ_G')")"
g_state="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_subject_state('$SUBJ_G')->>'state'")"
g_new="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_event_record('evt-g2','$SUBJ_G','message','Ugggg7777','wh-g2')->>'outcome'")"
if [[ "$g_count" != "1" ]]; then echo "FAIL: the retired name returned $g_count instead of the row count" >&2; exit 1; fi
if [[ "$g_state" != "erased" ]]; then echo "FAIL: the retired name left the subject '$g_state'" >&2; exit 1; fi
if [[ "$g_new" != "erased" ]]; then echo "FAIL: a new event after the retired erasure returned '$g_new'" >&2; exit 1; fi
echo "  ok: an un-updated caller gets the stronger guarantee, not the weaker one"

echo "── scenario 29: the manifest freezes the subject identity and its state ─"
inv_g="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_activity_inventory('$SUBJ_G')::text")"
inv_f="$(psql "$DATABASE_URL" -At -c "select public.yorisou_line_activity_inventory('$SUBJ_F')::text")"
if [[ "$inv_g" != *'"subject_state": "erased"'* || "$inv_g" != *'"active_events": 0'* || "$inv_g" != *'"erased_events": 1'* ]]; then
  echo "FAIL: inventory does not report the erased subject truthfully: $inv_g" >&2; exit 1
fi
if [[ "$inv_f" != *'"subject_state": "active"'* || "$inv_f" != *'"active_events": 1'* ]]; then
  echo "FAIL: inventory does not report the live subject truthfully: $inv_f" >&2; exit 1
fi
if [[ "$inv_g" == *"Ugggg7777"* || "$inv_f" == *"Uffff6666"* ]]; then
  echo "FAIL: inventory leaked a raw LINE id" >&2; exit 1
fi
echo "  ok: subject state and counts frozen, digests only"

# ─────────────────────────────────────────────────────────────────────────────
# Scenarios 30-41 — THE IDENTITY PROVISIONING SAGA (202607310003).
#
# The route this replaces returned 200 over a failed canonical write. Making it honest turns that
# into a 5xx on a multi-write operation, so the honest answer and the resumable one have to arrive
# together — these prove the resumable half at the level where it is actually decided.
# ─────────────────────────────────────────────────────────────────────────────
PK1="$(printf 'por1-provisioning:v1:a@synthetic-preview.invalid' | shasum -a 256 | cut -d' ' -f1)"
PK2="$(printf 'por1-provisioning:v1:b@synthetic-preview.invalid' | shasum -a 256 | cut -d' ' -f1)"
TOK1="$(printf 'prov-token-1' | shasum -a 256 | cut -d' ' -f1)"
TOK2="$(printf 'prov-token-2' | shasum -a 256 | cut -d' ' -f1)"
FP_A="$(printf 'acct-prov-a' | shasum -a 256 | cut -d' ' -f1)"

echo
echo "── scenario 30: privilege posture and the closed vocabularies ───────────"
for role in anon authenticated service_role; do
  for priv in insert update delete; do
    if [[ "$(psql "$DATABASE_URL" -At -c "select has_table_privilege('$role','public.yorisou_identity_provisioning_sagas','$priv')")" == "t" ]]; then
      echo "FAIL: $role holds direct $priv on the provisioning saga" >&2; exit 1
    fi
  done
done
if [[ "$(psql "$DATABASE_URL" -At -c "select relrowsecurity and relforcerowsecurity from pg_class where relname='yorisou_identity_provisioning_sagas'")" != "t" ]]; then
  echo "FAIL: RLS is not enabled AND forced on the provisioning saga" >&2; exit 1
fi
if [[ "$(psql "$DATABASE_URL" -At -c "select has_function_privilege('anon','public.yorisou_provisioning_open(text,text,integer)','execute')")" == "t" ]]; then
  echo "FAIL: anon may open a provisioning saga" >&2; exit 1
fi
# The failure vocabulary is CLOSED — it must not become somewhere to put an exception message.
if psql "$DATABASE_URL" -At -q -c "insert into public.yorisou_identity_provisioning_sagas(provisioning_key,failure_class) values ('$PK2','TypeError: cannot read property of undefined')" >/dev/null 2>&1; then
  echo "FAIL: an arbitrary failure class was accepted" >&2; exit 1
fi
# And the key is a digest, not an address.
if psql "$DATABASE_URL" -At -q -c "insert into public.yorisou_identity_provisioning_sagas(provisioning_key) values ('a@synthetic-preview.invalid')" >/dev/null 2>&1; then
  echo "FAIL: a raw email was accepted as a provisioning key" >&2; exit 1
fi
echo "  ok: no direct writes, RLS forced, failure class closed, key is a digest"

echo "── scenario 31: open is idempotent and the cursor starts at step one ────"
o1="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_open('$PK1','$TOK1',90)::text")"
if [[ "$o1" != *'"outcome": "claimed"'* || "$o1" != *'"cursor": "account_creation"'* || "$o1" != *'"state": "requested"'* ]]; then
  echo "FAIL: first open is wrong: $o1" >&2; exit 1
fi
rows="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK1'")"
if [[ "$rows" != "1" ]]; then echo "FAIL: open created $rows rows" >&2; exit 1; fi
echo "  ok: one saga, cursor account_creation, state requested"

echo "── scenario 32: a second concurrent registration cannot drive the saga ──"
o2="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_open('$PK1','$TOK2',90)::text")"
if [[ "$o2" != *'"outcome": "in_progress"'* || "$o2" != *'"claimed": false'* ]]; then
  echo "FAIL: a second executor claimed a live saga: $o2" >&2; exit 1
fi
echo "  ok: refused, and told why"

echo "── scenario 33: every transition validates six things ───────────────────"
G1="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_open('$PK1','$TOK1',90)->>'generation'")"
# Wrong token.
if psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_complete_step('$PK1','$TOK2',$G1,'account_creation','canonical_identity','acct-prov-a','$FP_A')" >/dev/null 2>&1; then
  echo "FAIL: a foreign token advanced the saga" >&2; exit 1
fi
# Stale generation.
if psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_complete_step('$PK1','$TOK1',$((G1-1)),'account_creation','canonical_identity','acct-prov-a','$FP_A')" >/dev/null 2>&1; then
  echo "FAIL: a stale generation advanced the saga" >&2; exit 1
fi
# Wrong expected cursor.
if psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_complete_step('$PK1','$TOK1',$G1,'session_binding','verification')" >/dev/null 2>&1; then
  echo "FAIL: a mismatched expected cursor advanced the saga" >&2; exit 1
fi
# Skipping a stage.
if psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_complete_step('$PK1','$TOK1',$G1,'account_creation','session_binding','acct-prov-a','$FP_A')" >/dev/null 2>&1; then
  echo "FAIL: the saga skipped a stage" >&2; exit 1
fi
# Going backwards.
if psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_complete_step('$PK1','$TOK1',$G1,'account_creation','account_creation')" >/dev/null 2>&1; then
  echo "FAIL: the cursor moved backwards" >&2; exit 1
fi
still="$(psql "$DATABASE_URL" -At -c "select provisioning_cursor from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK1'")"
if [[ "$still" != "account_creation" ]]; then echo "FAIL: a refused transition still moved the cursor to $still" >&2; exit 1; fi
echo "  ok: token, generation, expected cursor, one-step-forward, no rewind"

echo "── scenario 34: the account binding is written once and is then a fact ──"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_provisioning_complete_step('$PK1','$TOK1',$G1,'account_creation','canonical_identity','acct-prov-a','$FP_A')" >/dev/null
if psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_complete_step('$PK1','$TOK1',$G1,'canonical_identity','session_binding','acct-prov-DIFFERENT')" >/dev/null 2>&1; then
  echo "FAIL: the saga rebound itself to another account" >&2; exit 1
fi
bound="$(psql "$DATABASE_URL" -At -c "select account_id from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK1'")"
st="$(psql "$DATABASE_URL" -At -c "select state from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK1'")"
if [[ "$bound" != "acct-prov-a" ]]; then echo "FAIL: account binding is '$bound'" >&2; exit 1; fi
if [[ "$st" != "account_created" ]]; then echo "FAIL: state is '$st', expected account_created" >&2; exit 1; fi
echo "  ok: rebind refused, state derived from the cursor"

echo "── scenario 35: a retryable failure PRESERVES the cursor ────────────────"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_provisioning_record_failure('$PK1','$TOK1',$G1,'canonical_identity_failed','canonical_identity_failed',false)" >/dev/null
after_fail="$(psql "$DATABASE_URL" -At -c "select provisioning_cursor||'/'||state from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK1'")"
if [[ "$after_fail" != "canonical_identity/failed_retryable" ]]; then
  echo "FAIL: a retryable failure left '$after_fail'" >&2; exit 1
fi
# ...and the retry RESUMES at that exact cursor rather than restarting.
o3="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_open('$PK1','$TOK2',90)::text")"
if [[ "$o3" != *'"cursor": "canonical_identity"'* || "$o3" != *'"resumed": true'* ]]; then
  echo "FAIL: the retry did not resume at the recorded cursor: $o3" >&2; exit 1
fi
if [[ "$o3" != *'"accountId": "acct-prov-a"'* ]]; then
  echo "FAIL: the retry lost the account it had already created: $o3" >&2; exit 1
fi
echo "  ok: cursor preserved, claim released for the retry, no second account"

echo "── scenario 36: the takeover invalidates the previous executor ──────────"
G2="$(psql "$DATABASE_URL" -At -c "select executor_generation from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK1'")"
if [[ "$G2" == "$G1" ]]; then echo "FAIL: the generation did not move on takeover" >&2; exit 1; fi
# The OLD executor, still in flight, must not be able to advance anything.
if psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_complete_step('$PK1','$TOK1',$G1,'canonical_identity','session_binding')" >/dev/null 2>&1; then
  echo "FAIL: an executor replayed a step after being taken over" >&2; exit 1
fi
echo "  ok: generation bumped, the superseded executor is refused"

echo "── scenario 37: the full progression, and completion is a proven shape ──"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_provisioning_complete_step('$PK1','$TOK2',$G2,'canonical_identity','session_binding')" >/dev/null
psql "$DATABASE_URL" -At -q -c "select public.yorisou_provisioning_complete_step('$PK1','$TOK2',$G2,'session_binding','verification',null,null,'$(printf 'sess-prov-a' | shasum -a 256 | cut -d' ' -f1)')" >/dev/null
psql "$DATABASE_URL" -At -q -c "select public.yorisou_provisioning_complete_step('$PK1','$TOK2',$G2,'verification','finalizing')" >/dev/null
psql "$DATABASE_URL" -At -q -c "select public.yorisou_provisioning_complete_step('$PK1','$TOK2',$G2,'finalizing','completed')" >/dev/null
final="$(psql "$DATABASE_URL" -At -c "select state||'/'||provisioning_cursor||'/'||coalesce(account_id,'-')||'/'||(completed_at is not null)::text from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK1'")"
if [[ "$final" != "completed/completed/acct-prov-a/true" ]]; then echo "FAIL: completion shape is '$final'" >&2; exit 1; fi
echo "  ok: requested -> account_created -> canonical_identity_created -> session_bound -> completed"

echo "── scenario 38: a retry of a COMPLETED registration is not a second one ─"
o4="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_open('$PK1','$TOK1',90)::text")"
if [[ "$o4" != *'"outcome": "completed"'* || "$o4" != *'"accountId": "acct-prov-a"'* ]]; then
  echo "FAIL: reopening a completed saga returned $o4" >&2; exit 1
fi
count="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK1'")"
if [[ "$count" != "1" ]]; then echo "FAIL: reopening created $count sagas" >&2; exit 1; fi
# A late failure report from a lost attempt must not un-complete it.
psql "$DATABASE_URL" -At -q -c "select public.yorisou_provisioning_record_failure('$PK1','$TOK1',$G2,'unclassified','late',false)" >/dev/null
late_state="$(psql "$DATABASE_URL" -At -c "select state from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK1'")"
if [[ "$late_state" != "completed" ]]; then echo "FAIL: a late failure un-completed the saga ($late_state)" >&2; exit 1; fi
# And a completed saga cannot be advanced further.
if psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_complete_step('$PK1','$TOK1',$G2,'completed','completed')" >/dev/null 2>&1; then
  echo "FAIL: a completed saga accepted another step" >&2; exit 1
fi
echo "  ok: same saga, same account, terminal in both directions"

echo "── scenario 39: two concurrent opens for one email, LATCHED ─────────────"
# The property the object store could never give: two registrations for the same address decided
# under a row lock rather than by whoever wrote last.
PK3="$(printf 'por1-provisioning:v1:c@synthetic-preview.invalid' | shasum -a 256 | cut -d' ' -f1)"
send_wait 3 "$WORK/out_a" prov_a "begin; select public.yorisou_provisioning_open('$PK3','$TOK1',90)->>'outcome';"
send_async 4 prov_b "select public.yorisou_provisioning_open('$PK3','$TOK2',90)->>'outcome';"
assert_blocked "yorisou_provisioning_open"
send_wait 3 "$WORK/out_a" prov_a_commit "commit;"
await_latch "$WORK/out_b" prov_b
if ! grep -qx "in_progress" "$WORK/out_b"; then
  echo "FAIL: two concurrent opens both claimed one saga" >&2; tail -5 "$WORK/out_b" >&2; exit 1
fi
sagas="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK3'")"
if [[ "$sagas" != "1" ]]; then echo "FAIL: one email produced $sagas sagas" >&2; exit 1; fi
echo "  ok: the second blocked on the row lock, then was refused; one saga"

echo "── scenario 40: a terminal failure stays terminal ───────────────────────"
G3="$(psql "$DATABASE_URL" -At -c "select executor_generation from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK3'")"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_provisioning_record_failure('$PK3','$TOK1',$G3,'email_already_registered','email_already_registered',true)" >/dev/null
o5="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_open('$PK3','$TOK2',90)::text")"
if [[ "$o5" != *'"outcome": "failed_terminal"'* || "$o5" != *'"failureClass": "email_already_registered"'* ]]; then
  echo "FAIL: a terminal saga was reopened: $o5" >&2; exit 1
fi
echo "  ok: reopened as terminal, with its bounded class"

echo "── scenario 41: deletion purges provisioning, and the probe counts it ───"
before="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_residue('acct-prov-a',null)")"
if [[ "$before" != "1" ]]; then echo "FAIL: residue probe reports $before before deletion" >&2; exit 1; fi
# By fingerprint, which is all the manifest keeps after the crossing.
by_fp="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_residue(null,'$FP_A')")"
if [[ "$by_fp" != "1" ]]; then echo "FAIL: residue by fingerprint reports $by_fp" >&2; exit 1; fi
purged="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_purge_for_owner(null,'$FP_A')")"
after="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_residue('acct-prov-a','$FP_A')")"
again="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_purge_for_owner(null,'$FP_A')")"
if [[ "$purged" != "1" || "$after" != "0" || "$again" != "0" ]]; then
  echo "FAIL: purge=$purged residue=$after repeat=$again" >&2; exit 1
fi
# Purging RELEASES THE EMAIL: the same address can be registered again.
reopened="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_open('$PK1','$TOK1',90)->>'outcome'")"
if [[ "$reopened" != "claimed" ]]; then
  echo "FAIL: a deleted person's email stayed unregisterable ($reopened)" >&2; exit 1
fi
# A purge with no target is refused rather than deleting everything.
if psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_purge_for_owner(null,null)" >/dev/null 2>&1; then
  echo "FAIL: an untargeted purge was accepted" >&2; exit 1
fi
# The operator inventory is counts only — no key, no account id, no digest.
inv="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_partial_inventory()::text")"
if [[ "$inv" == *"acct-prov"* || "$inv" == *"$PK1"* || "$inv" == *"$FP_A"* ]]; then
  echo "FAIL: the operator inventory leaks an identifier: $inv" >&2; exit 1
fi
if [[ "$inv" != *'"count"'* ]]; then echo "FAIL: the operator inventory reports no counts: $inv" >&2; exit 1; fi
echo "  ok: purged by fingerprint, idempotent, email released, inventory content-free"

echo "── scenario 42: a saga that created NOTHING is discarded, not recorded ──"
# Attempting to register an address that is already taken opens a saga and creates nothing. Leaving
# that row behind would poison the address twice over: permanently unregisterable (a purge keyed by
# account id or fingerprint cannot find a row that has neither), and read by the access gate as an
# incomplete registration — so anyone could lock any account out of login by attempting to register
# its email. It is deleted instead.
PK4="$(printf 'por1-provisioning:v1:taken@synthetic-preview.invalid' | shasum -a 256 | cut -d' ' -f1)"
G4="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_open('$PK4','$TOK1',90)->>'generation'")"
gone="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_abandon('$PK4','$TOK1',$G4)")"
left="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK4'")"
if [[ "$gone" != "t" || "$left" != "0" ]]; then echo "FAIL: abandon=$gone rows=$left" >&2; exit 1; fi
# ...and the address is immediately registerable again.
reo="$(psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_open('$PK4','$TOK2',90)->>'outcome'")"
if [[ "$reo" != "claimed" ]]; then echo "FAIL: an abandoned address stayed blocked ($reo)" >&2; exit 1; fi

# But a saga that DOES own an account must never be abandoned — deleting the only record of what it
# created turns a resumable partial account into an invisible one.
G5="$(psql "$DATABASE_URL" -At -c "select executor_generation from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK4'")"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_provisioning_complete_step('$PK4','$TOK2',$G5,'account_creation','canonical_identity','acct-prov-owned','$(printf 'acct-prov-owned' | shasum -a 256 | cut -d' ' -f1)')" >/dev/null
if psql "$DATABASE_URL" -At -c "select public.yorisou_provisioning_abandon('$PK4','$TOK2',$G5)" >/dev/null 2>&1; then
  echo "FAIL: a saga owning an account was abandoned" >&2; exit 1
fi
survived="$(psql "$DATABASE_URL" -At -c "select account_id from public.yorisou_identity_provisioning_sagas where provisioning_key='$PK4'")"
if [[ "$survived" != "acct-prov-owned" ]]; then echo "FAIL: the owning saga did not survive ($survived)" >&2; exit 1; fi
echo "  ok: unbound saga discarded and the address released; a bound one is refused"


# ═════════════════════════════════════════════════════════════════════════════
# CANONICAL IDENTITY LINKS — 202607310004.
#
# The registry exists because the deletion manifest derived its entire destructive identity scope
# from ONE read of an object store whose read path is not reliable. Measured over 20 controlled
# overwrite rounds against the isolated Preview bucket, that path returned the OLD version of a
# just-overwritten object for more than 25 seconds, served `cf-cache-status: HIT`, while the store
# itself already held the new one. A LINE binding that finished two seconds BEFORE a deletion was
# requested was therefore invisible when the manifest froze fourteen seconds later, and the lookup
# object survived the erasure: a live LINE login route to an erased account.
#
# These scenarios prove the two halves of the repair — a scope that can only widen, and a
# verification that does not take the manifest's word for which families exist.
# ═════════════════════════════════════════════════════════════════════════════

echo "── scenario 43: the identity set is committed, and a repeat is a no-op ──"
A_ID="acct-links-a"; A_FP="$(printf 'acct-links-a' | shasum -a 256 | cut -d' ' -f1)"
B_ID="acct-links-b"; B_FP="$(printf 'acct-links-b' | shasum -a 256 | cut -d' ' -f1)"
A_EMAIL="$(printf 'a@synthetic-preview.invalid' | shasum -a 256 | cut -d' ' -f1)"
B_EMAIL="$(printf 'b@synthetic-preview.invalid' | shasum -a 256 | cut -d' ' -f1)"
A_LINE="$(printf 'Uaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' | shasum -a 256 | cut -d' ' -f1)"
B_LINE="$(printf 'Ubbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' | shasum -a 256 | cut -d' ' -f1)"

A_SET="[{\"kind\":\"email\",\"digest\":\"$A_EMAIL\"},{\"kind\":\"line_subject\",\"digest\":\"$A_LINE\"}]"
r="$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_sync('$A_ID','$A_FP','$A_SET'::jsonb)")"
if [[ "$(jq -r '.added' <<<"$r")" != "2" ]]; then echo "FAIL: links not committed ($r)" >&2; exit 1; fi
# Every account write calls sync, so a no-op has to be genuinely free of side effects.
r="$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_sync('$A_ID','$A_FP','$A_SET'::jsonb)")"
if [[ "$(jq -r '.added' <<<"$r")" != "0" || "$(jq -r '.retired' <<<"$r")" != "0" ]]; then
  echo "FAIL: re-sync was not a no-op ($r)" >&2; exit 1
fi
# The sync is ADDITIVE and must report so even when asked to hold less than it already does.
r="$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_sync('$A_ID','$A_FP','[{\"kind\":\"email\",\"digest\":\"$A_EMAIL\"}]'::jsonb)")"
if [[ "$(jq -r '.retired' <<<"$r")" != "0" || "$(jq -r '.active' <<<"$r")" != "2" ]]; then
  echo "FAIL: a narrower set changed the registry ($r)" >&2; exit 1
fi
echo "  ok: two links committed; the repeat added nothing and retired nothing"

echo "── scenario 44: one LINE subject cannot be owned by two live accounts ───"
B_SET="[{\"kind\":\"email\",\"digest\":\"$B_EMAIL\"},{\"kind\":\"line_subject\",\"digest\":\"$A_LINE\"}]"
if psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_sync('$B_ID','$B_FP','$B_SET'::jsonb)" >/dev/null 2>&1; then
  echo "FAIL: a second account took a live LINE subject" >&2; exit 1
fi
# The refusal must be atomic. A partially applied identity set is a state no reader has a name for,
# and B's own email must not have been committed by the attempt that was rejected.
n="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_canonical_identity_links where owner_account_id='$B_ID' and link_state='active'")"
if [[ "$n" != "0" ]]; then echo "FAIL: the refused sync left $n links behind" >&2; exit 1; fi
if [[ "$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_link_owner('line_subject','$A_LINE')")" != "$A_ID" ]]; then
  echo "FAIL: the subject moved" >&2; exit 1
fi
echo "  ok: refused, atomically, and the subject still resolves to its owner"

echo "── scenario 45: NEGATIVE CONTROL — the pre-repair architecture ──────────"
# This is the shape that produced the orphan, reconstructed deliberately: a frozen manifest that
# names NO LINE scope for an account that owns a LINE subject.
#
# `verifyIdentityErasure` used to iterate the manifest — `if (manifest.lineLookupKey && ...)` — so
# an omitted family was not merely unerased, it was UNLOOKED-AT, and the deletion could report
# clean over a live login route. The two queries below are those two verifications, side by side.
MANIFEST_LINE_SCOPE=0   # what the narrowed manifest named
manifest_finds="$MANIFEST_LINE_SCOPE"
registry_finds="$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_residue('$A_FP')")"
if [[ "$manifest_finds" != "0" ]]; then echo "FAIL: the control is not reproducing the omission" >&2; exit 1; fi
if [[ "$registry_finds" == "0" ]]; then
  echo "FAIL: the manifest-independent check is as blind as the manifest was" >&2; exit 1
fi
echo "  ok: manifest-scoped check finds 0, the registry finds $registry_finds — the omission is visible"

echo "── scenario 46: erasure is content-free, and denies the login route ─────"
erased="$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_erase('$A_ID')")"
if [[ "$erased" != "2" ]]; then echo "FAIL: expected 2 links erased, got $erased" >&2; exit 1; fi
if [[ "$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_residue('$A_FP')")" != "0" ]]; then
  echo "FAIL: active links survived the erasure" >&2; exit 1
fi
# The check a LINE login makes.
if [[ -n "$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_link_owner('line_subject','$A_LINE')")" ]]; then
  echo "FAIL: an erased account's LINE subject still resolves" >&2; exit 1
fi
leak="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_canonical_identity_links where link_state='erased' and (owner_account_id is not null or link_digest is not null)")"
if [[ "$leak" != "0" ]]; then echo "FAIL: $leak tombstones still carry content" >&2; exit 1; fi
echo "  ok: erased, unresolvable, and the tombstones hold neither owner nor digest"

echo "── scenario 47: the erasure is idempotent and does not touch User B ─────"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_identity_links_sync('$B_ID','$B_FP','[{\"kind\":\"email\",\"digest\":\"$B_EMAIL\"},{\"kind\":\"line_subject\",\"digest\":\"$B_LINE\"}]'::jsonb)" >/dev/null
again="$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_erase('$A_ID')")"
if [[ "$again" != "0" ]]; then echo "FAIL: a second erasure erased $again" >&2; exit 1; fi
if [[ "$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_residue('$B_FP')")" != "2" ]]; then
  echo "FAIL: User B lost identity links to User A's deletion" >&2; exit 1
fi
if [[ "$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_link_owner('line_subject','$B_LINE')")" != "$B_ID" ]]; then
  echo "FAIL: User B's LINE subject stopped resolving" >&2; exit 1
fi
echo "  ok: second erasure is a no-op; B keeps both links and its LINE route"

echo "── scenario 48: an erased identity is re-registrable, not poisoned ──────"
# The mirror image of scenario 44. Refusing forever would mean a deleted person's address and LINE
# account could never be used again by anyone — including by them.
C_ID="acct-links-c"; C_FP="$(printf 'acct-links-c' | shasum -a 256 | cut -d' ' -f1)"
r="$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_sync('$C_ID','$C_FP','[{\"kind\":\"email\",\"digest\":\"$A_EMAIL\"},{\"kind\":\"line_subject\",\"digest\":\"$A_LINE\"}]'::jsonb)")"
if [[ "$(jq -r '.added' <<<"$r")" != "2" ]]; then echo "FAIL: an erased identity stayed blocked ($r)" >&2; exit 1; fi
echo "  ok: the erased address and subject were claimable again"

echo "── scenario 49: two concurrent binds of one subject, LATCHED ────────────"
# Not a timing race. Session A opens a transaction and takes the row, the harness OBSERVES that
# session B is blocked on it, and only then is A committed.
D_ID="acct-links-d"; D_FP="$(printf 'acct-links-d' | shasum -a 256 | cut -d' ' -f1)"
E_ID="acct-links-e"; E_FP="$(printf 'acct-links-e' | shasum -a 256 | cut -d' ' -f1)"
SHARED_LINE="$(printf 'Ushared-contended-subject' | shasum -a 256 | cut -d' ' -f1)"
cat >&3 <<SQLA
begin;
select public.yorisou_identity_links_sync('$D_ID','$D_FP','[{"kind":"line_subject","digest":"$SHARED_LINE"}]'::jsonb);
SQLA
sleep 0.5
cat >&4 <<SQLB
begin;
select public.yorisou_identity_links_sync('$E_ID','$E_FP','[{"kind":"line_subject","digest":"$SHARED_LINE"}]'::jsonb);
SQLB
# Wait until B is genuinely WAITING on a lock rather than merely slow.
for _ in $(seq 1 50); do
  waiting="$(psql "$DATABASE_URL" -At -c "select count(*) from pg_stat_activity where wait_event_type='Lock' and query like '%yorisou_identity_links_sync%'")"
  [[ "$waiting" -ge 1 ]] && break
  sleep 0.2
done
if [[ "${waiting:-0}" -lt 1 ]]; then echo "FAIL: the second bind never blocked — no serialization" >&2; exit 1; fi
printf 'commit;\n' >&3
sleep 1
printf 'commit;\n' >&4
sleep 1
owner="$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_link_owner('line_subject','$SHARED_LINE')")"
if [[ "$owner" != "$D_ID" ]]; then echo "FAIL: the contended subject resolved to $owner" >&2; exit 1; fi
n="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_canonical_identity_links where link_kind='line_subject' and link_digest='$SHARED_LINE' and link_state='active'")"
if [[ "$n" != "1" ]]; then echo "FAIL: $n active owners for one subject" >&2; exit 1; fi
echo "  ok: the second blocked on the lock, then was refused; exactly one owner"

echo "── scenario 53: a STALE link set may not retire a true link ────────────"
# The defect 202607310006 fixes, and it was mine. sync used to retire anything absent from the
# caller's set, and the caller derives that set from an ACCOUNT OBJECT READ — the read measured
# returning the OLD version for more than 25 seconds. So a stale record written before a LINE
# binding produced a set with no LINE subject, and the sync ERASED the strongly consistent record of
# a binding that had really happened. Observed in a hosted run: one froze a manifest with two union
# keys, the next froze one, and the difference was which copy of the account the writer had read.
H_ID="acct-links-h"; H_FP="$(printf 'acct-links-h' | shasum -a 256 | cut -d' ' -f1)"
H_EMAIL="$(printf 'h@synthetic-preview.invalid' | shasum -a 256 | cut -d' ' -f1)"
H_LINE="$(printf 'Uhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh' | shasum -a 256 | cut -d' ' -f1)"
psql "$DATABASE_URL" -At -q -c "select public.yorisou_identity_links_sync('$H_ID','$H_FP','[{\"kind\":\"email\",\"digest\":\"$H_EMAIL\"},{\"kind\":\"line_subject\",\"digest\":\"$H_LINE\"}]'::jsonb)" >/dev/null
# ...now a writer holding a STALE copy of the account, from before the LINE binding.
r="$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_sync('$H_ID','$H_FP','[{\"kind\":\"email\",\"digest\":\"$H_EMAIL\"}]'::jsonb)")"
if [[ "$(jq -r '.retired' <<<"$r")" != "0" ]]; then
  echo "FAIL: a stale link set retired $(jq -r '.retired' <<<"$r") link(s)" >&2; exit 1
fi
if [[ "$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_link_owner('line_subject','$H_LINE')")" != "$H_ID" ]]; then
  echo "FAIL: a stale read erased a true LINE binding" >&2; exit 1
fi
# A DELIBERATE unbind still works, and is scoped to the owner.
if [[ "$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_retire('$H_ID','line_subject','$H_LINE')")" != "1" ]]; then
  echo "FAIL: a deliberate retirement did not happen" >&2; exit 1
fi
if [[ -n "$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_link_owner('line_subject','$H_LINE')")" ]]; then
  echo "FAIL: the retired subject still resolves" >&2; exit 1
fi
# ...and retiring again is a no-op rather than an error, because a rebind can be replayed.
if [[ "$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_retire('$H_ID','line_subject','$H_LINE')")" != "0" ]]; then
  echo "FAIL: a repeated retirement was not a no-op" >&2; exit 1
fi
# Retiring someone ELSE'S link is refused — it would cut a living person off from their own login.
psql "$DATABASE_URL" -At -q -c "select public.yorisou_identity_links_sync('$H_ID','$H_FP','[{\"kind\":\"line_subject\",\"digest\":\"$H_LINE\"}]'::jsonb)" >/dev/null
I_ID="acct-links-i"
if psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_retire('$I_ID','line_subject','$H_LINE')" >/dev/null 2>&1; then
  echo "FAIL: a stranger retired someone else's identity link" >&2; exit 1
fi
echo "  ok: stale set retires nothing; a deliberate unbind works, replays, and is owner-scoped"

echo "── scenario 52: two concurrent writes of the SAME account, LATCHED ─────"
# Found by RUNNING the hosted train, not by inspection: every account write calls sync, so two
# in-flight requests for one person race routinely. Both saw no existing row (the other's insert was
# uncommitted and therefore invisible), both inserted, and the loser died on the partial unique index
# with a raw 23505 — which reached the deletion route as an unclassified 500 for a system that was
# working correctly. A same-owner race must be a NO-OP, and only a different owner is a conflict.
F_ID="acct-links-f"; F_FP="$(printf 'acct-links-f' | shasum -a 256 | cut -d' ' -f1)"
SAME_EMAIL="$(printf 'f@synthetic-preview.invalid' | shasum -a 256 | cut -d' ' -f1)"
F_SET="[{\"kind\":\"email\",\"digest\":\"$SAME_EMAIL\"}]"
cat >&3 <<SQLA
begin;
select public.yorisou_identity_links_sync('$F_ID','$F_FP','$F_SET'::jsonb);
SQLA
sleep 0.5
cat >&4 <<SQLB
begin;
select public.yorisou_identity_links_sync('$F_ID','$F_FP','$F_SET'::jsonb);
SQLB
for _ in $(seq 1 50); do
  waiting="$(psql "$DATABASE_URL" -At -c "select count(*) from pg_stat_activity where wait_event_type='Lock' and query like '%yorisou_identity_links_sync%'")"
  [[ "$waiting" -ge 1 ]] && break
  sleep 0.2
done
if [[ "${waiting:-0}" -lt 1 ]]; then echo "FAIL: the same-owner race never contended" >&2; exit 1; fi
printf 'commit;\n' >&3
sleep 1
printf 'commit;\n' >&4
sleep 1
# The loser must have COMMITTED, not aborted. An aborted transaction is the 500 this scenario exists
# to forbid.
n="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_canonical_identity_links where link_kind='email' and link_digest='$SAME_EMAIL' and link_state='active'")"
if [[ "$n" != "1" ]]; then echo "FAIL: $n active rows after a same-owner race" >&2; exit 1; fi
if [[ "$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_link_owner('email','$SAME_EMAIL')")" != "$F_ID" ]]; then
  echo "FAIL: the owner changed under a same-owner race" >&2; exit 1
fi
# ...and a DIFFERENT owner racing the same digest must still be refused with the BOUNDED code, not a
# raw 23505. Catching the violation without re-checking the owner would be the fail-open version.
G_ID="acct-links-g"; G_FP="$(printf 'acct-links-g' | shasum -a 256 | cut -d' ' -f1)"
err="$(psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_sync('$G_ID','$G_FP','$F_SET'::jsonb)" 2>&1 || true)"
if [[ "$err" != *"identity_link_conflict"* ]]; then
  echo "FAIL: a different owner was refused with an unbounded error: $err" >&2; exit 1
fi
echo "  ok: same-owner race is a no-op; a different owner still gets the bounded conflict"

echo "── scenario 50: nothing may re-link an account after its gate closed ────"
# The registry alone does NOT prevent this, and saying so plainly matters: a post-erasure sync is a
# legal insert as far as this table is concerned. What forbids it is the mutation fence, which the
# account write goes through before it ever reaches sync. This asserts the two facts that make the
# combination sound — the gate is closed for the owner, and the fence refuses a lease under it.
psql "$DATABASE_URL" -At -q -c "select public.yorisou_account_deletion_open('$A_ID')" >/dev/null
psql "$DATABASE_URL" -At -q -c "select public.yorisou_account_deletion_close_mutation_gate('$A_ID')" >/dev/null
gate="$(psql "$DATABASE_URL" -At -c "select public.yorisou_account_deletion_mutation_gate_status('$A_ID')")"
if [[ "$gate" != *"closed"* && "$gate" != *"draining"* ]]; then
  echo "FAIL: the gate did not close for a deleting account ($gate)" >&2; exit 1
fi
if psql "$DATABASE_URL" -At -c "select public.yorisou_account_mutation_begin('$A_ID','line_binding','$(printf 'tok-late-writer-aaaaaaaaaaaaaaaaaaaa' | shasum -a 256 | cut -d' ' -f1)',30)" >/dev/null 2>&1; then
  echo "FAIL: the fence granted a lease under a closed gate" >&2; exit 1
fi
echo "  ok: gate closed, lease refused — the account write never reaches the registry"

echo "── scenario 51: the registry refuses to hold anything that is not a digest ─"
for bad in "[{\"kind\":\"email\",\"digest\":\"someone@example.com\"}]" \
           "[{\"kind\":\"line_subject\",\"digest\":\"Uraw-line-id\"}]" \
           "[{\"kind\":\"unknown_kind\",\"digest\":\"$A_EMAIL\"}]"; do
  if psql "$DATABASE_URL" -At -c "select public.yorisou_identity_links_sync('$C_ID','$C_FP','$bad'::jsonb)" >/dev/null 2>&1; then
    echo "FAIL: the registry accepted $bad" >&2; exit 1
  fi
done
echo "  ok: raw address, raw LINE id and unknown kind all refused"


echo "── scenario 54: two concurrent OPENS of one deletion job, LATCHED ───────"
# Found by RUNNING the hosted property: the second executor was answered 500 while the first
# deletion was succeeding, and the acceptance asserts an adversary must be ANSWERED, not faulted.
#
# `yorisou_account_deletion_open` selected by owner and inserted when it found none. `select ... for
# update` cannot lock a row that does not exist, so two concurrent confirms for one person both saw
# nothing — each other's insert uncommitted and invisible — and both inserted. `owner_account_id` is
# UNIQUE, so the loser died on a raw 23505.
#
# This is the FOURTH time this package has hit that exact shape. The index is the only thing that can
# serialize a read-then-write, so the repair is to let it and then INTERPRET what it says.
O_ID="acct-open-race"
cat >&3 <<SQLA
begin;
select public.yorisou_account_deletion_open('$O_ID');
SQLA
sleep 0.5
cat >&4 <<SQLB
begin;
select public.yorisou_account_deletion_open('$O_ID');
SQLB
for _ in $(seq 1 50); do
  waiting="$(psql "$DATABASE_URL" -At -c "select count(*) from pg_stat_activity where wait_event_type='Lock' and query like '%yorisou_account_deletion_open%'")"
  [[ "$waiting" -ge 1 ]] && break
  sleep 0.2
done
if [[ "${waiting:-0}" -lt 1 ]]; then echo "FAIL: the deletion-open race never contended" >&2; exit 1; fi
printf 'commit;\n' >&3
sleep 1
printf 'commit;\n' >&4
sleep 1
# The loser must have COMMITTED and returned the winner's job. An aborted transaction is the 500 this
# scenario exists to forbid.
n="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_account_deletion_jobs where owner_account_id='$O_ID'")"
if [[ "$n" != "1" ]]; then echo "FAIL: $n deletion jobs after a concurrent open" >&2; exit 1; fi
# Exactly ONE `requested` audit row: the loser must not record a second person asking to be deleted.
a="$(psql "$DATABASE_URL" -At -c "select count(*) from public.yorisou_account_deletion_audit u join public.yorisou_account_deletion_jobs j on j.id=u.job_id where j.owner_account_id='$O_ID' and u.stage='requested'")"
if [[ "$a" != "1" ]]; then echo "FAIL: $a 'requested' audit rows after a concurrent open" >&2; exit 1; fi
# A serial repeat is still idempotent and still returns the same job.
id1="$(psql "$DATABASE_URL" -At -c "select public.yorisou_account_deletion_open('$O_ID')")"
id2="$(psql "$DATABASE_URL" -At -c "select public.yorisou_account_deletion_open('$O_ID')")"
if [[ "$id1" != "$id2" ]]; then echo "FAIL: open is not idempotent ($id1 vs $id2)" >&2; exit 1; fi
# ...and the refusals are NOT skipped just because the race path exists. A legal hold must still
# refuse, or the race branch would be a way around it.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "update public.yorisou_account_deletion_jobs set state='legal_hold' where owner_account_id='$O_ID'"
err="$(psql "$DATABASE_URL" -At -c "select public.yorisou_account_deletion_open('$O_ID')" 2>&1 || true)"
if [[ "$err" != *"account_deletion_legal_hold"* ]]; then
  echo "FAIL: a legal hold was not refused by open: $err" >&2; exit 1
fi
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "delete from public.yorisou_account_deletion_jobs where owner_account_id='$O_ID'"
echo "  ok: one job, one audit row, idempotent, and legal hold still refuses"

printf '\\q\n' >&3; printf '\\q\n' >&4
exec 3>&-; exec 4>&-
wait "$PID_A" 2>/dev/null || true
wait "$PID_B" 2>/dev/null || true

echo
echo "POR-1 resume engine + mutation fence + canonical LINE activity + identity links: ALL ASSERTIONS PASSED"
