#!/usr/bin/env bash
set -euo pipefail
if [[ -z "${DATABASE_URL:-}" ]]; then echo "DATABASE_URL is required" >&2; exit 1; fi
if [[ "$DATABASE_URL" == *"supabase.co"* || "$DATABASE_URL" != *"@localhost:"* || "$DATABASE_URL" != *"yorisou_agent_runtime_test"* ]]; then echo "Refusing non-ephemeral database target" >&2; exit 1; fi
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c 'create extension if not exists pgcrypto;'
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607100001_agent_runtime_phase1.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607100002_c02_private_results.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607100003_shared_test_engine.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607100004_line_oauth_state_replay_protection.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
create or replace function assert_true(value boolean, message text) returns void language plpgsql as $$ begin if not value then raise exception 'assertion failed: %', message; end if; end $$;
select assert_true((select count(*)=5 from pg_tables where schemaname='public' and tablename like 'agent_runtime_%'),'five runtime tables');
select assert_true((select relrowsecurity from pg_class where oid='public.yorisou_test_results'::regclass),'C02 results RLS enabled');
select assert_true((select count(*)=0 from pg_policies where schemaname='public' and tablename='yorisou_test_results'),'C02 results have no public policy');
select assert_true(not has_table_privilege('public','public.yorisou_test_results','select'),'PUBLIC C02 read denied');
select assert_true((select relrowsecurity from pg_class where oid='public.yorisou_account_deletion_requests'::regclass),'deletion request RLS enabled');
select assert_true((select count(*)=0 from pg_policies where schemaname='public' and tablename='yorisou_account_deletion_requests'),'deletion request has no public policy');
select assert_true((select relrowsecurity from pg_class where oid='public.yorisou_line_oauth_states'::regclass),'LINE OAuth state RLS enabled');
select assert_true(not has_table_privilege('public','public.yorisou_line_oauth_states','select'),'PUBLIC LINE OAuth state read denied');
select assert_true((select relrowsecurity from pg_class where oid='public.agent_runtime_tasks'::regclass),'RLS enabled');
do $$ begin insert into agent_runtime_tasks(project_id,workflow_type,input_payload,data_classification,idempotency_key,correlation_id) values('mirai','x','{}','internal','bad-project','c'); raise exception 'project constraint missing'; exception when check_violation then null; end $$;
insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id,available_at) values('x','{}','internal','queued-due','c',now());
insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id,status,available_at) values('x','{}','internal','scheduled-later','c','scheduled',now()+interval '1 hour');
select assert_true(promote_yorisou_agent_runtime_tasks(1)=1,'bounded promotion');
select assert_true((select status='ready' from agent_runtime_tasks where idempotency_key='queued-due'),'queued promoted');
select assert_true((select status='scheduled' from agent_runtime_tasks where idempotency_key='scheduled-later'),'future scheduled not promoted');
select assert_true((select count(*) from claim_yorisou_agent_runtime_tasks('worker-1',60,1))=1,'ready claimed');
select assert_true((select claimed_by='worker-1' and claimed_at is not null and lease_expires_at is not null and attempt_count=1 from agent_runtime_tasks where idempotency_key='queued-due'),'lease ownership stored');
do $$ begin perform * from claim_yorisou_agent_runtime_tasks('',60,1); raise exception 'invalid worker accepted'; exception when others then if position('invalid claim input' in sqlerrm)=0 then raise; end if; end $$;
update agent_runtime_tasks set lease_expires_at=now()-interval '1 second' where idempotency_key='queued-due'; select assert_true(recover_stale_yorisou_agent_runtime_tasks()=1,'stale recovered'); select assert_true((select status='ready' and claimed_by is null and lease_expires_at is null from agent_runtime_tasks where idempotency_key='queued-due'),'ownership cleared');
do $$ begin update agent_runtime_tasks set status='completed' where idempotency_key='queued-due'; raise exception 'illegal transition accepted'; exception when others then if position('illegal transition' in sqlerrm)=0 then raise; end if; end $$;
select assert_true(not has_function_privilege('public','public.promote_yorisou_agent_runtime_tasks(integer)','execute'),'public promotion denied');
select assert_true((select count(*) from pg_policies where schemaname='public' and tablename like 'agent_runtime_%')=0,'no user policies');
drop function assert_true(boolean,text);
SQL
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
create or replace function assert_true(value boolean, message text) returns void language plpgsql as $$ begin if not value then raise exception 'assertion failed: %', message; end if; end $$;
-- Recovery contract: claimed -> ready, running -> retry_wait; terminal/non-expired work stays untouched.
insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id,status,claimed_by,claimed_at,lease_expires_at,attempt_count) values
('lease','{}','internal','lease-claimed-live','c','claimed','live',now(),now()+interval '1 hour',2),
('lease','{}','internal','lease-running-live','c','running','live',now(),now()+interval '1 hour',2),
('lease','{}','internal','lease-claimed-stale','c','claimed','stale',now()-interval '2 hours',now()-interval '1 hour',2),
('lease','{}','internal','lease-running-stale','c','running','stale',now()-interval '2 hours',now()-interval '1 hour',2),
('lease','{}','internal','lease-completed','c','completed',null,null,null,2),
('lease','{}','internal','lease-failed','c','failed',null,null,null,2),
('lease','{}','internal','lease-cancelled','c','cancelled',null,null,null,2),
('lease','{}','internal','lease-paused','c','paused',null,null,null,2),
('lease','{}','internal','lease-dead','c','dead_letter',null,null,null,2);
select assert_true(recover_stale_yorisou_agent_runtime_tasks()=2,'only stale leases recovered');
select assert_true((select status='ready' and claimed_by is null and claimed_at is null and lease_expires_at is null and attempt_count=2 from agent_runtime_tasks where idempotency_key='lease-claimed-stale'),'claimed stale reset');
select assert_true((select status='retry_wait' and claimed_by is null and claimed_at is null and lease_expires_at is null and attempt_count=2 from agent_runtime_tasks where idempotency_key='lease-running-stale'),'running stale retry');
select assert_true((select count(*)=0 from agent_runtime_tasks where idempotency_key in ('lease-claimed-live','lease-running-live') and status not in ('claimed','running')),'live leases preserved');
select assert_true((select count(*)=0 from agent_runtime_tasks where idempotency_key in ('lease-completed','lease-failed','lease-cancelled','lease-paused','lease-dead') and status not in ('completed','failed','cancelled','paused','dead_letter')),'terminal/non-running preserved');
insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id) values('refs','{}','internal','reference-task','corr-reference');
insert into agent_runtime_review_items(task_id,project_id,required_approver,reason) select id,'yorisou','edward','review' from agent_runtime_tasks where idempotency_key='reference-task';
select assert_true((select correlation_id='corr-reference' and project_id='yorisou' from agent_runtime_tasks where idempotency_key='reference-task'),'task identity preserved');
do $$ begin insert into agent_runtime_review_items(task_id,project_id,required_approver,reason) select id,'yorisou','other','bad' from agent_runtime_tasks where idempotency_key='reference-task'; raise exception 'approver accepted'; exception when check_violation then null; end $$;
do $$ begin insert into agent_runtime_review_items(task_id,project_id,required_approver,reason) select id,'yorisou','edward','duplicate' from agent_runtime_tasks where idempotency_key='reference-task'; raise exception 'duplicate accepted'; exception when unique_violation then null; end $$;
do $$ begin insert into agent_runtime_task_attempts(task_id,project_id,attempt_number,previous_status,next_status,actor,reason,correlation_id) values(gen_random_uuid(),'yorisou',1,'queued','ready','x','x','x'); raise exception 'attempt FK accepted'; exception when foreign_key_violation then null; end $$;
do $$ begin insert into agent_runtime_pause_records(task_id,project_id,actor,reason) values(gen_random_uuid(),'yorisou','x','x'); raise exception 'pause FK accepted'; exception when foreign_key_violation then null; end $$;
select assert_true((select count(*)=3 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('promote_yorisou_agent_runtime_tasks','recover_stale_yorisou_agent_runtime_tasks','claim_yorisou_agent_runtime_tasks') and p.proconfig @> array['search_path=public']),'fixed function search_path');
drop function assert_true(boolean,text);
SQL
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
create or replace function assert_true(value boolean, message text) returns void language plpgsql as $$ begin if not value then raise exception 'assertion failed: %', message; end if; end $$;
-- Timing: future work is not promoted; due scheduled/retry work is promoted in deterministic priority/id order.
insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id,status,available_at,scheduled_at,priority) values
('timing','{}','internal','scheduled-due','c','scheduled',now()-interval '1 minute',now()-interval '1 minute',2),
('timing','{}','internal','retry-due','c','retry_wait',now()-interval '1 minute',null,3),
('timing','{}','internal','retry-future','c','retry_wait',now()+interval '1 hour',null,1),
('timing','{}','internal','queued-future','c','queued',now()+interval '1 hour',null,1);
select assert_true(promote_yorisou_agent_runtime_tasks(2)=2,'promotion batch limit');
select assert_true((select status='ready' from agent_runtime_tasks where idempotency_key='scheduled-due'),'due scheduled ready');
select assert_true((select status='ready' from agent_runtime_tasks where idempotency_key='retry-due'),'due retry ready');
select assert_true((select status='retry_wait' from agent_runtime_tasks where idempotency_key='retry-future'),'future retry held');
select assert_true((select status='queued' from agent_runtime_tasks where idempotency_key='queued-future'),'future queued held');
-- Main and alternate state edges.
insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id,status) values('state','{}','internal','state-main','c','ready');
update agent_runtime_tasks set status='claimed',claimed_by='state-worker',claimed_at=now(),lease_expires_at=now()+interval '1 minute' where idempotency_key='state-main';
update agent_runtime_tasks set status='running' where idempotency_key='state-main'; update agent_runtime_tasks set status='completed' where idempotency_key='state-main';
select assert_true((select status='completed' from agent_runtime_tasks where idempotency_key='state-main'),'main path complete');
do $$ begin update agent_runtime_tasks set status='running' where idempotency_key='state-main'; raise exception 'terminal transition accepted'; exception when others then if position('illegal transition' in sqlerrm)=0 then raise; end if; end $$;
insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id,status) values('state','{}','internal','state-alt','c','ready');
update agent_runtime_tasks set status='claimed',claimed_by='state-worker',lease_expires_at=now()+interval '1 minute' where idempotency_key='state-alt'; update agent_runtime_tasks set status='running' where idempotency_key='state-alt'; update agent_runtime_tasks set status='waiting_for_review' where idempotency_key='state-alt'; update agent_runtime_tasks set status='ready' where idempotency_key='state-alt'; update agent_runtime_tasks set status='paused' where idempotency_key='state-alt'; update agent_runtime_tasks set status='ready' where idempotency_key='state-alt'; update agent_runtime_tasks set status='cancelled' where idempotency_key='state-alt';
select assert_true((select status='cancelled' from agent_runtime_tasks where idempotency_key='state-alt'),'alternate path complete');
do $$ begin update agent_runtime_tasks set status='completed' where idempotency_key='scheduled-due'; raise exception 'ready complete accepted'; exception when others then if position('illegal transition' in sqlerrm)=0 then raise; end if; end $$;
do $$ begin insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id,maximum_attempts) values('x','{}','internal','attempt-low','c',0); raise exception 'attempt low accepted'; exception when check_violation then null; end $$;
do $$ begin insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id,timeout_seconds) values('x','{}','internal','timeout-high','c',3601); raise exception 'timeout high accepted'; exception when check_violation then null; end $$;
do $$ begin insert into agent_runtime_artifacts(task_id,project_id,storage_uri,sha256,data_classification) values(gen_random_uuid(),'yorisou','x','bad','internal'); raise exception 'artifact sha accepted'; exception when check_violation or foreign_key_violation then null; end $$;
drop function assert_true(boolean,text);
SQL
# Two independent psql clients race to claim two explicit ready tasks. Each call is a separate DB session.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id,status) values ('concurrency','{}','internal','concurrent-a','c','ready'),('concurrency','{}','internal','concurrent-b','c','ready');"
psql "$DATABASE_URL" -Atqc "select id from claim_yorisou_agent_runtime_tasks('concurrent-worker-a',60,1);" > /tmp/agent-runtime-claim-a & a=$!
psql "$DATABASE_URL" -Atqc "select id from claim_yorisou_agent_runtime_tasks('concurrent-worker-b',60,1);" > /tmp/agent-runtime-claim-b & b=$!
wait "$a"; wait "$b"
test "$(cat /tmp/agent-runtime-claim-a)" != "$(cat /tmp/agent-runtime-claim-b)"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "do \$\$ begin insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id) values('x','{}','internal','queued-due','duplicate'); raise exception 'idempotency missing'; exception when unique_violation then null; end \$\$; do \$\$ begin insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id) values('x',jsonb_build_object('x',repeat('x',65537)),'internal','oversize','c'); raise exception 'payload limit missing'; exception when check_violation then null; end \$\$;"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
create or replace function assert_true(value boolean, message text) returns void language plpgsql as $$ begin if not value then raise exception 'assertion failed: %', message; end if; end $$;
insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id,status,claimed_by,claimed_at,lease_expires_at,attempt_count,maximum_attempts) values
('exhaust','{}','internal','exhausted-claimed','corr-exhaust','claimed','worker',now()-interval '2 hours',now()-interval '1 hour',3,3),
('exhaust','{}','internal','exhausted-running','corr-exhaust','running','worker',now()-interval '2 hours',now()-interval '1 hour',4,3);
select assert_true(recover_stale_yorisou_agent_runtime_tasks()=2,'exhausted tasks recovered');
select assert_true((select count(*)=2 from agent_runtime_tasks where idempotency_key like 'exhausted-%' and status='failed' and claimed_by is null and claimed_at is null and lease_expires_at is null and error_class='attempts_exhausted'),'exhaustion failed and fields cleared');
select assert_true((select count(*)=0 from agent_runtime_tasks where idempotency_key like 'exhausted-%' and status in ('ready','retry_wait','claimed','running')),'exhaustion never requeues');
update agent_runtime_tasks set status='dead_letter' where idempotency_key='exhausted-claimed';
select assert_true((select status='dead_letter' from agent_runtime_tasks where idempotency_key='exhausted-claimed'),'failed dead letter legal');
do $$ begin create role anon; exception when duplicate_object then null; end $$; do $$ begin create role authenticated; exception when duplicate_object then null; end $$;
select assert_true(not has_function_privilege('anon','public.claim_yorisou_agent_runtime_tasks(text,integer,integer)','execute'),'anon claim denied');
select assert_true(not has_function_privilege('anon','public.promote_yorisou_agent_runtime_tasks(integer)','execute'),'anon promote denied');
select assert_true(not has_function_privilege('authenticated','public.recover_stale_yorisou_agent_runtime_tasks()','execute'),'authenticated recover denied');
drop function assert_true(boolean,text);
SQL
