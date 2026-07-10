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
