#!/usr/bin/env bash
# YV-1 — yorisou-values migration/RLS/RPC verification in an ISOLATED DISPOSABLE
# local Postgres database (never hosted, never production).
# Run: DATABASE_URL=postgres://...@localhost:5432/yorisou_values_test npm run test:yorisou-values:db
set -euo pipefail
if [[ -z "${DATABASE_URL:-}" ]]; then echo "DATABASE_URL is required" >&2; exit 1; fi
if [[ "$DATABASE_URL" == *"supabase.co"* || "$DATABASE_URL" != *"@localhost:"* || "$DATABASE_URL" != *"yorisou_values_test"* ]]; then echo "Refusing non-ephemeral database target" >&2; exit 1; fi
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c 'create extension if not exists pgcrypto;'
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$; do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$; do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;"
# Supabase parity: hosted service_role carries BYPASSRLS; write denial rests on grants.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "alter role service_role bypassrls;"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607210001_yv1_values_assessments.sql
# Idempotence: re-apply must succeed without error.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607210001_yv1_values_assessments.sql

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
create or replace function assert_true(value boolean, message text) returns void language plpgsql as $$ begin if not value then raise exception 'assertion failed: %', message; end if; end $$;
grant execute on function assert_true(boolean,text) to service_role;

-- Privilege matrix: DIRECT_USER_DENY + service_role SELECT ONLY -----------------
select assert_true((select count(*)=3 from pg_tables where schemaname='public' and tablename like 'yorisou_values_assessment%'),'three values tables exist');
select assert_true((select bool_and(relrowsecurity) from pg_class where relname in ('yorisou_values_assessments','yorisou_values_assessment_versions','yorisou_values_assessment_events')),'RLS enabled on all three');
select assert_true((select count(*)=0 from pg_policies where schemaname='public' and tablename like 'yorisou_values_assessment%'),'no user policies (deny-all direct access)');
select assert_true(not has_table_privilege('anon','public.yorisou_values_assessments','select'),'anon read denied');
select assert_true(not has_table_privilege('authenticated','public.yorisou_values_assessments','select'),'authenticated direct read denied');
select assert_true(has_table_privilege('service_role','public.yorisou_values_assessments','select'),'service-role read allowed');
select assert_true(not has_table_privilege('service_role','public.yorisou_values_assessments','insert'),'service-role direct INSERT records denied');
select assert_true(not has_table_privilege('service_role','public.yorisou_values_assessments','update'),'service-role direct UPDATE records denied');
select assert_true(not has_table_privilege('service_role','public.yorisou_values_assessments','delete'),'service-role direct DELETE records denied');
select assert_true(not has_table_privilege('service_role','public.yorisou_values_assessment_versions','insert'),'service-role direct INSERT versions denied');
select assert_true(not has_table_privilege('service_role','public.yorisou_values_assessment_events','insert'),'service-role direct INSERT events denied');
select assert_true(has_function_privilege('service_role','public.yorisou_values_assessment_create(text,text,text,text,text,jsonb,text,boolean,text,text,text)','execute'),'service-role create RPC allowed');
select assert_true(not has_function_privilege('anon','public.yorisou_values_assessment_create(text,text,text,text,text,jsonb,text,boolean,text,text,text)','execute'),'anon create RPC denied');
select assert_true(not has_function_privilege('authenticated','public.yorisou_values_assessment_delete(text,uuid)','execute'),'authenticated delete RPC denied');
select assert_true((select bool_and(p.proconfig @> array['search_path=public']) from pg_proc p where p.proname like 'yorisou_values_%'),'fixed RPC search_path');
select assert_true((select count(*)=0 from information_schema.columns where table_name='yorisou_values_assessment_events' and column_name in ('answers','result_id')),'events carry no answers/result content');

-- Direct writes under SET ROLE service_role MUST ALL FAIL -----------------------
set role service_role;
do $$ begin insert into public.yorisou_values_assessments(owner_account_id,method_version,bank_version,scoring_version,result_schema_version,bank_content_hash,answers,result_id,produced_at) values('x','v','v','v','v','h','{}','VAL_R_ANSHIN',now()); raise exception 'direct INSERT accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin update public.yorisou_values_assessments set result_id='x'; raise exception 'direct UPDATE accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin delete from public.yorisou_values_assessments; raise exception 'direct DELETE accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin insert into public.yorisou_values_assessment_versions(assessment_id,version,answers,result_id,reason_code,produced_at) values(gen_random_uuid(),1,'{}','VAL_R_ANSHIN','initial',now()); raise exception 'direct version INSERT accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin insert into public.yorisou_values_assessment_events(assessment_id,owner_account_id,event_type,version,reason_code) values(gen_random_uuid(),'x','created',1,'initial'); raise exception 'direct event INSERT accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin truncate public.yorisou_values_assessments; raise exception 'TRUNCATE accepted'; exception when insufficient_privilege then null; end $$;

-- RPC operations succeed for service_role --------------------------------------
select assert_true((select public.yorisou_values_assessment_create('owner-a'::text,'values-v1.0'::text,'values-bank-v1.0'::text,'values-scoring-v1.0'::text,'values-result-v1.0'::text,'{"VAL_Q01":"A"}'::jsonb,'VAL_R_ANSHIN'::text,false,'skipped'::text,'919f1725'::text,'2026-07-21T00:00:00Z'::text)) is not null,'RPC create as service_role');
reset role;

-- Retake = distinct record; correction = new version; confirmation separate -----
select public.yorisou_values_assessment_create('owner-a'::text,'values-v1.0'::text,'values-bank-v1.0'::text,'values-scoring-v1.0'::text,'values-result-v1.0'::text,'{"VAL_Q01":"B"}'::jsonb,'VAL_R_PACE'::text,false,'skipped'::text,'919f1725'::text,'2026-07-21T01:00:00Z'::text);
select assert_true((select count(*)=2 from yorisou_values_assessments where owner_account_id='owner-a'),'retake creates a DISTINCT record (2 rows)');
-- correct the first record
do $$
declare v_id uuid;
begin
  select id into v_id from yorisou_values_assessments where owner_account_id='owner-a' and result_id='VAL_R_ANSHIN' limit 1;
  perform public.yorisou_values_assessment_correct('owner-a'::text, v_id, '{"VAL_Q01":"B"}'::jsonb, 'VAL_R_PACE'::text, false, 'confirmed'::text, 'user_correction'::text);
  perform assert_true((select current_version=2 and result_id='VAL_R_PACE' and confirmation='confirmed' from yorisou_values_assessments where id=v_id),'correction → v2, recomputed result, confirmation stored');
  perform assert_true((select count(*)=2 from yorisou_values_assessment_versions where assessment_id=v_id),'two version rows preserved');
  perform assert_true((select answers->>'VAL_Q01'='A' from yorisou_values_assessment_versions where assessment_id=v_id and version=1),'version 1 answers preserved');
end $$;
do $$ begin perform public.yorisou_values_assessment_correct('owner-a'::text, gen_random_uuid(), '{}'::jsonb, 'VAL_R_ANSHIN'::text, false, 'skipped'::text, 'bad_reason'::text); raise exception 'invalid reason accepted'; exception when others then if position('values_invalid_reason' in sqlerrm)=0 then raise; end if; end $$;
do $$ begin perform public.yorisou_values_assessment_correct('owner-b'::text, (select id from yorisou_values_assessments where owner_account_id='owner-a' limit 1), '{}'::jsonb, 'VAL_R_ANSHIN'::text, false, 'skipped'::text, 'user_correction'::text); raise exception 'cross-owner correction accepted'; exception when others then if position('values_record_not_found' in sqlerrm)=0 then raise; end if; end $$;

-- Append-only protection --------------------------------------------------------
do $$ begin update yorisou_values_assessment_versions set result_id='x' where version=1; raise exception 'version mutation accepted'; exception when others then if position('append_only' in sqlerrm)=0 then raise; end if; end $$;
do $$ begin delete from yorisou_values_assessment_versions where version=1; raise exception 'ungoverned version delete accepted'; exception when others then if position('append_only' in sqlerrm)=0 then raise; end if; end $$;

-- Deletion = content erasure + exactly one tombstone ----------------------------
do $$
declare v_id uuid;
begin
  select id into v_id from yorisou_values_assessments where owner_account_id='owner-a' and current_version=2 limit 1;
  perform assert_true((select count(*)>=2 from yorisou_values_assessment_events where assessment_id=v_id),'created+corrected events exist before deletion');
  perform assert_true(public.yorisou_values_assessment_delete('owner-a'::text, v_id),'delete succeeds');
  perform assert_true((select count(*)=0 from yorisou_values_assessments where id=v_id),'no record row remains');
  perform assert_true((select count(*)=0 from yorisou_values_assessment_versions where assessment_id=v_id),'no version rows remain (answers erased)');
  perform assert_true((select count(*)=1 from yorisou_values_assessment_events where assessment_id=v_id),'EXACTLY ONE retained row — the tombstone');
  perform assert_true((select event_type='deleted' and reason_code='user_deleted' and retention_expires_at > now() + interval '11 months' from yorisou_values_assessment_events where assessment_id=v_id),'content-free tombstone, 12-month expiry');
  perform assert_true(public.yorisou_values_assessment_delete('owner-a'::text, v_id)=false,'second delete is a no-op');
end $$;
-- whole-DB answer sweep
select public.yorisou_values_assessment_create('owner-erase'::text,'values-v1.0'::text,'values-bank-v1.0'::text,'values-scoring-v1.0'::text,'values-result-v1.0'::text,'{"VAL_Q42":"B"}'::jsonb,'VAL_R_JIKKAN'::text,false,'skipped'::text,'919f1725'::text,'2026-07-21T02:00:00Z'::text);
do $$ declare v_id uuid; begin select id into v_id from yorisou_values_assessments where owner_account_id='owner-erase' limit 1; perform public.yorisou_values_assessment_delete('owner-erase'::text, v_id); end $$;
select assert_true((select count(*)=0 from yorisou_values_assessments where owner_account_id='owner-erase'),'erased record gone');
select assert_true((select count(*)=0 from yorisou_values_assessment_versions v join yorisou_values_assessment_events e on e.assessment_id=v.assessment_id where e.owner_account_id='owner-erase'),'no versions survive erased owner');

-- Purge -------------------------------------------------------------------------
select assert_true(not has_function_privilege('anon','public.yorisou_values_tombstone_purge_expired(integer)','execute'),'anon purge denied');
select assert_true(has_function_privilege('service_role','public.yorisou_values_tombstone_purge_expired(integer)','execute'),'service-role purge allowed');
select assert_true((select public.yorisou_values_tombstone_purge_expired(500))=0,'pre-expiry purge returns zero');
insert into yorisou_values_assessment_events(assessment_id,owner_account_id,event_type,version,reason_code,retention_expires_at) values (gen_random_uuid(),'owner-purge','deleted',1,'user_deleted', now()-interval '1 day');
insert into yorisou_values_assessment_events(assessment_id,owner_account_id,event_type,version,reason_code,retention_expires_at) values (gen_random_uuid(),'owner-purge','deleted',1,'user_deleted', now()+interval '30 days');
do $$ begin perform public.yorisou_values_tombstone_purge_expired(0); raise exception 'zero limit accepted'; exception when others then if position('values_purge_invalid_limit' in sqlerrm)=0 then raise; end if; end $$;
select assert_true((select public.yorisou_values_tombstone_purge_expired(500))=1,'expired tombstone purged (count 1)');
select assert_true((select count(*)=1 from yorisou_values_assessment_events where owner_account_id='owner-purge'),'non-expired tombstone remains');

-- Second-owner isolation (data level) ------------------------------------------
select public.yorisou_values_assessment_create('owner-b'::text,'values-v1.0'::text,'values-bank-v1.0'::text,'values-scoring-v1.0'::text,'values-result-v1.0'::text,'{"VAL_Q01":"A"}'::jsonb,'VAL_R_ANSHIN'::text,false,'skipped'::text,'919f1725'::text,'2026-07-21T03:00:00Z'::text);
select assert_true((select count(*)=0 from yorisou_values_assessments where owner_account_id='owner-b' and result_id='VAL_R_PACE'),'owners never share rows');

drop function assert_true(boolean,text);
SQL

# Rollback/cleanup proof (disposable local DB only — LOCAL_DISPOSABLE_SCHEMA_ROLLBACK)
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
create or replace function assert_true(value boolean, message text) returns void language plpgsql as $$ begin if not value then raise exception 'assertion failed: %', message; end if; end $$;
drop function if exists public.yorisou_values_tombstone_purge_expired(integer);
drop function if exists public.yorisou_values_assessment_delete(text, uuid);
drop function if exists public.yorisou_values_assessment_correct(text, uuid, jsonb, text, boolean, text, text);
drop function if exists public.yorisou_values_assessment_create(text, text, text, text, text, jsonb, text, boolean, text, text, text);
drop table if exists public.yorisou_values_assessment_events;
drop table if exists public.yorisou_values_assessment_versions;
drop table if exists public.yorisou_values_assessments;
drop function if exists public.yorisou_values_block_mutation();
select assert_true((select count(*)=0 from pg_tables where schemaname='public' and tablename like 'yorisou_values_assessment%'),'rollback removes all values tables (disposable DB)');
drop function assert_true(boolean,text);
SQL

echo "YV-1 yorisou-values postgres integration: ALL CHECKS PASSED (disposable local DB)"
