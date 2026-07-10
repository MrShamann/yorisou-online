#!/usr/bin/env bash
set -euo pipefail
if [[ -z "${DATABASE_URL:-}" ]]; then echo "DATABASE_URL is required" >&2; exit 1; fi
if [[ "$DATABASE_URL" == *"supabase.co"* || "$DATABASE_URL" != *"@localhost:"* || "$DATABASE_URL" != *"yorisou_agent_runtime_test"* ]]; then echo "Refusing non-ephemeral database target" >&2; exit 1; fi
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c 'create extension if not exists pgcrypto;'
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607100001_agent_runtime_phase1.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
create or replace function assert_true(value boolean, message text) returns void language plpgsql as $$ begin if not value then raise exception 'assertion failed: %', message; end if; end $$;
select assert_true((select count(*)=5 from pg_tables where schemaname='public' and tablename like 'agent_runtime_%'),'five runtime tables');
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
do $$ begin insert into agent_runtime_artifacts(task_id,project_id,storage_uri,sha256,data_classification) values(gen_random_uuid(),'yorisou','x','bad','internal'); raise exception 'artifact sha accepted'; exception when check_violation then null; exception when foreign_key_violation then null; end $$;
drop function assert_true(boolean,text);
SQL
# Two independent psql clients race to claim two explicit ready tasks. Each call is a separate DB session.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id,status) values ('concurrency','{}','internal','concurrent-a','c','ready'),('concurrency','{}','internal','concurrent-b','c','ready');"
psql "$DATABASE_URL" -Atqc "select id from claim_yorisou_agent_runtime_tasks('concurrent-worker-a',60,1);" > /tmp/agent-runtime-claim-a & a=$!
psql "$DATABASE_URL" -Atqc "select id from claim_yorisou_agent_runtime_tasks('concurrent-worker-b',60,1);" > /tmp/agent-runtime-claim-b & b=$!
wait "$a"; wait "$b"
test "$(cat /tmp/agent-runtime-claim-a)" != "$(cat /tmp/agent-runtime-claim-b)"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "do \$\$ begin insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id) values('x','{}','internal','queued-due','duplicate'); raise exception 'idempotency missing'; exception when unique_violation then null; end \$\$; do \$\$ begin insert into agent_runtime_tasks(workflow_type,input_payload,data_classification,idempotency_key,correlation_id) values('x',jsonb_build_object('x',repeat('x',65537)),'internal','oversize','c'); raise exception 'payload limit missing'; exception when check_violation then null; end \$\$;"
