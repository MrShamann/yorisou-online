#!/usr/bin/env bash
# DCI-1.1 — daily-check-in migration/RLS/RPC verification in an ISOLATED DISPOSABLE
# local Postgres database (never hosted, never production).
# Run: DATABASE_URL=postgres://...@localhost:5432/yorisou_daily_check_in_test npm run test:daily-check-in:db
set -euo pipefail
if [[ -z "${DATABASE_URL:-}" ]]; then echo "DATABASE_URL is required" >&2; exit 1; fi
if [[ "$DATABASE_URL" == *"supabase.co"* || "$DATABASE_URL" != *"@localhost:"* || "$DATABASE_URL" != *"yorisou_daily_check_in_test"* ]]; then echo "Refusing non-ephemeral database target" >&2; exit 1; fi
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c 'create extension if not exists pgcrypto;'
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$; do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$; do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;"
# Prerequisite (clean-main CM0 helper) then the DCI migration, in order.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "alter role service_role bypassrls;" # Supabase parity: hosted service_role carries BYPASSRLS; write denial rests on grants (privilege check precedes RLS)
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607200001_cpv1_foundation_prereqs.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607200005_dci1_daily_state_records.sql
# Idempotence: re-apply must succeed without error.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607200005_dci1_daily_state_records.sql

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
create or replace function assert_true(value boolean, message text) returns void language plpgsql as $$ begin if not value then raise exception 'assertion failed: %', message; end if; end $$;
grant execute on function assert_true(boolean,text) to service_role;

-- §4 Privilege matrix: DIRECT_USER_DENY + service_role SELECT ONLY --------------
select assert_true((select count(*)=3 from pg_tables where schemaname='public' and tablename like 'yorisou_daily_state_%'),'three daily tables exist');
select assert_true((select bool_and(relrowsecurity) from pg_class where relname in ('yorisou_daily_state_records','yorisou_daily_state_record_versions','yorisou_daily_state_history_events')),'RLS enabled on all three');
select assert_true((select count(*)=0 from pg_policies where schemaname='public' and tablename like 'yorisou_daily_state_%'),'no user policies (deny-all direct access family)');
select assert_true(not has_table_privilege('public','public.yorisou_daily_state_records','select'),'PUBLIC records read denied');
select assert_true(not has_table_privilege('anon','public.yorisou_daily_state_records','select'),'anon records read denied');
select assert_true(not has_table_privilege('authenticated','public.yorisou_daily_state_records','select'),'authenticated direct read denied');
select assert_true(has_table_privilege('service_role','public.yorisou_daily_state_records','select'),'service-role read allowed');
select assert_true(not has_table_privilege('service_role','public.yorisou_daily_state_records','insert'),'service-role direct INSERT records denied');
select assert_true(not has_table_privilege('service_role','public.yorisou_daily_state_records','update'),'service-role direct UPDATE records denied');
select assert_true(not has_table_privilege('service_role','public.yorisou_daily_state_records','delete'),'service-role direct DELETE records denied');
select assert_true(not has_table_privilege('service_role','public.yorisou_daily_state_record_versions','insert'),'service-role direct INSERT versions denied');
select assert_true(not has_table_privilege('service_role','public.yorisou_daily_state_record_versions','update'),'service-role direct UPDATE versions denied');
select assert_true(not has_table_privilege('service_role','public.yorisou_daily_state_record_versions','delete'),'service-role direct DELETE versions denied');
select assert_true(not has_table_privilege('service_role','public.yorisou_daily_state_history_events','insert'),'service-role direct INSERT events denied');
select assert_true(not has_table_privilege('service_role','public.yorisou_daily_state_history_events','update'),'service-role direct UPDATE events denied');
select assert_true(not has_table_privilege('service_role','public.yorisou_daily_state_history_events','delete'),'service-role direct DELETE events denied');
select assert_true(not has_function_privilege('public','public.yorisou_daily_record_create(text,text,text,text,timestamptz,date,text,integer,jsonb,text,text)','execute'),'PUBLIC create RPC denied');
select assert_true(not has_function_privilege('anon','public.yorisou_daily_record_create(text,text,text,text,timestamptz,date,text,integer,jsonb,text,text)','execute'),'anon create RPC denied');
select assert_true(not has_function_privilege('authenticated','public.yorisou_daily_record_correct(text,date,timestamptz,jsonb,text,text,text)','execute'),'authenticated correct RPC denied');
select assert_true(has_function_privilege('service_role','public.yorisou_daily_record_delete(text,date,text)','execute'),'service-role delete RPC allowed');
select assert_true((select bool_and(p.proconfig @> array['search_path=public']) from pg_proc p where p.proname like 'yorisou_daily_record_%'),'fixed RPC search_path');
select assert_true((select count(*)=0 from information_schema.columns where table_name='yorisou_daily_state_history_events' and column_name in ('state','memo')),'history events carry no state/memo columns');

-- §4 DIRECT WRITES UNDER SET ROLE service_role MUST ALL FAIL --------------------
set role service_role;
do $$ begin insert into public.yorisou_daily_state_records(owner_account_id,method_version,schema_version,ack_version,produced_at,entry_local_date,timezone,state,ack_id) values('x','v','v','v',now(),'2026-07-20','Asia/Tokyo','{}','A'); raise exception 'direct INSERT records accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin update public.yorisou_daily_state_records set memo='x'; raise exception 'direct UPDATE records accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin delete from public.yorisou_daily_state_records; raise exception 'direct DELETE records accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin insert into public.yorisou_daily_state_record_versions(record_id,version,produced_at,state,ack_id,reason_code) values(gen_random_uuid(),1,now(),'{}','A','initial'); raise exception 'direct INSERT versions accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin update public.yorisou_daily_state_record_versions set memo='x'; raise exception 'direct UPDATE versions accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin delete from public.yorisou_daily_state_record_versions; raise exception 'direct DELETE versions accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin insert into public.yorisou_daily_state_history_events(record_id,owner_account_id,event_type,version,reason_code) values(gen_random_uuid(),'x','created',1,'initial'); raise exception 'direct INSERT events accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin update public.yorisou_daily_state_history_events set version=99; raise exception 'direct UPDATE events accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin delete from public.yorisou_daily_state_history_events; raise exception 'direct DELETE events accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin truncate public.yorisou_daily_state_records; raise exception 'TRUNCATE records accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin truncate public.yorisou_daily_state_record_versions; raise exception 'TRUNCATE versions accepted'; exception when insufficient_privilege then null; end $$;
do $$ begin truncate public.yorisou_daily_state_history_events; raise exception 'TRUNCATE events accepted'; exception when insufficient_privilege then null; end $$;

-- §4 RPC operations SUCCEED for service_role -------------------------------------
select assert_true((select public.yorisou_daily_record_create('owner-a','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2','2026-07-20T03:00:00Z',(timezone('Asia/Tokyo', now()))::date,'Asia/Tokyo',540,'{"kokoro_tenki":"ame","kyou_hoshii":"yasumi"}'::jsonb,'きょうのメモ','ACK_RAIN')) is not null,'RPC create as service_role succeeds');
select assert_true((select public.yorisou_daily_record_correct('owner-a',(timezone('Asia/Tokyo', now()))::date,now(),'{"kokoro_tenki":"kumori"}'::jsonb,null,'ACK_NEUTRAL','user_correction'))=2,'RPC correct as service_role succeeds (v2)');
reset role;

-- §7 Correction semantics ---------------------------------------------------------
select assert_true((select current_version=2 and state->>'kokoro_tenki'='kumori' from yorisou_daily_state_records where owner_account_id='owner-a'),'visible record updated to v2');
select assert_true((select produced_at='2026-07-20T03:00:00Z'::timestamptz from yorisou_daily_state_records where owner_account_id='owner-a'),'record INITIAL produced_at never overwritten by correction');
select assert_true((select count(*)=2 from yorisou_daily_state_record_versions v join yorisou_daily_state_records r on r.id=v.record_id where r.owner_account_id='owner-a'),'both versions preserved');
select assert_true((select v.state->>'kokoro_tenki'='ame' and v.memo='きょうのメモ' from yorisou_daily_state_record_versions v join yorisou_daily_state_records r on r.id=v.record_id where r.owner_account_id='owner-a' and v.version=1),'version 1 content untouched');
select assert_true((select v.produced_at > r.produced_at from yorisou_daily_state_record_versions v join yorisou_daily_state_records r on r.id=v.record_id where r.owner_account_id='owner-a' and v.version=2),'version 2 carries its own later server timestamp');
select assert_true((select count(*)=1 from yorisou_daily_state_history_events where owner_account_id='owner-a' and event_type='corrected' and version=2),'corrected event written');
-- Correction window: a record whose local date is already in the past is rejected.
select public.yorisou_daily_record_create('owner-past','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2','2026-07-01T03:00:00Z','2026-07-01','Asia/Tokyo',540,'{"kokoro_tenki":"hare"}'::jsonb,null,'ACK_SUNNY');
do $$ begin perform public.yorisou_daily_record_correct('owner-past','2026-07-01',now(),'{"kokoro_tenki":"ame"}'::jsonb,null,'ACK_RAIN','user_correction'); raise exception 'past-date correction accepted'; exception when others then if position('daily_record_correction_window_closed' in sqlerrm)=0 then raise; end if; end $$;
do $$ begin perform public.yorisou_daily_record_correct('owner-a',(timezone('Asia/Tokyo', now()))::date,now(),'{}'::jsonb,null,'ACK_NEUTRAL','free_text_reason'); raise exception 'invalid reason accepted'; exception when others then if position('daily_record_invalid_reason' in sqlerrm)=0 then raise; end if; end $$;
do $$ begin perform public.yorisou_daily_record_correct('owner-b',(timezone('Asia/Tokyo', now()))::date,now(),'{}'::jsonb,null,'ACK_NEUTRAL','user_correction'); raise exception 'cross-owner correction accepted'; exception when others then if position('daily_record_not_found' in sqlerrm)=0 then raise; end if; end $$;

-- Append-only protection while the record exists ----------------------------------
do $$ begin update yorisou_daily_state_record_versions set memo='overwrite' where version=1; raise exception 'version mutation accepted'; exception when others then if position('append_only' in sqlerrm)=0 then raise; end if; end $$;
do $$ begin delete from yorisou_daily_state_record_versions where version=1; raise exception 'ungoverned version delete accepted'; exception when others then if position('append_only' in sqlerrm)=0 then raise; end if; end $$;
do $$ begin update yorisou_daily_state_history_events set event_type='created' where event_type='corrected'; raise exception 'event mutation accepted'; exception when others then if position('append_only' in sqlerrm)=0 then raise; end if; end $$;

-- §8 Governed deletion = PRIVATE-CONTENT ERASURE ----------------------------------
select assert_true((select public.yorisou_daily_record_delete('owner-a',(timezone('Asia/Tokyo', now()))::date,'owner')),'delete succeeds');
select assert_true((select count(*)=0 from yorisou_daily_state_records where owner_account_id='owner-a'),'no current record row remains after deletion');
select assert_true((select count(*)=0 from yorisou_daily_state_record_versions v join yorisou_daily_state_history_events e on e.record_id=v.record_id where e.owner_account_id='owner-a' and e.event_type='deleted'),'NO version content rows survive deletion (no raw state, no memo)');
select assert_true((select count(*)=1 from yorisou_daily_state_history_events where owner_account_id='owner-a' and event_type='deleted' and reason_code='user_deleted' and retention_expires_at is not null and retention_expires_at > now() + interval '11 months'),'content-free tombstone with 12-month retention expiry');
select assert_true((select public.yorisou_daily_record_delete('owner-a',(timezone('Asia/Tokyo', now()))::date,'owner'))=false,'second delete is a no-op (false)');
select assert_true((select public.yorisou_daily_record_create('owner-a','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2',now(),(timezone('Asia/Tokyo', now()))::date,'Asia/Tokyo',540,'{"kokoro_tenki":"hare"}'::jsonb,null,'ACK_SUNNY')) is not null,'re-create after erasure allowed');
-- Whole-database sweep: after erasing owner-erase's record, its raw content exists NOWHERE.
select public.yorisou_daily_record_create('owner-erase','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2',now(),(timezone('Asia/Tokyo', now()))::date,'Asia/Tokyo',540,'{"kokoro_tenki":"kaze","atama_yohaku":"guruguru"}'::jsonb,'ぜったいに残らないメモ','ACK_WIND');
select public.yorisou_daily_record_delete('owner-erase',(timezone('Asia/Tokyo', now()))::date,'owner');
select assert_true((select count(*)=0 from yorisou_daily_state_records where state::text like '%ぜったいに残らないメモ%' or memo like '%ぜったいに残らないメモ%'),'erased memo absent from records');
select assert_true((select count(*)=0 from yorisou_daily_state_record_versions where state::text like '%ぜったいに残らないメモ%' or memo like '%ぜったいに残らないメモ%'),'erased memo absent from versions');
select assert_true((select count(*)=0 from yorisou_daily_state_records where owner_account_id='owner-erase'),'erased record row gone');
select assert_true((select count(*)=1 from yorisou_daily_state_history_events where owner_account_id='owner-erase' and event_type='deleted'),'only the tombstone event remains');

-- Constraints ----------------------------------------------------------------------
do $$ begin perform public.yorisou_daily_record_create('owner-c','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2',now(),(timezone('Asia/Tokyo', now()))::date,'Asia/Tokyo',540,'{"kokoro_tenki":"hare"}'::jsonb,repeat('あ',141),'ACK_SUNNY'); raise exception 'memo length accepted'; exception when check_violation then null; end $$;
do $$ begin perform public.yorisou_daily_record_create('','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2',now(),(timezone('Asia/Tokyo', now()))::date,'Asia/Tokyo',540,'{}'::jsonb,null,'ACK_NEUTRAL'); raise exception 'empty owner accepted'; exception when others then if position('daily_record_owner_required' in sqlerrm)=0 then raise; end if; end $$;
do $$ begin perform public.yorisou_daily_record_create('owner-a','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2',now(),(timezone('Asia/Tokyo', now()))::date,'Asia/Tokyo',540,'{"kokoro_tenki":"hare"}'::jsonb,null,'ACK_SUNNY'); raise exception 'duplicate create accepted'; exception when others then if position('daily_record_exists' in sqlerrm)=0 then raise; end if; end $$;

-- Second-owner isolation (data level) -----------------------------------------------
select assert_true((select public.yorisou_daily_record_create('owner-b','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2',now(),(timezone('Asia/Tokyo', now()))::date,'Asia/Tokyo',540,'{"kokoro_tenki":"kumori"}'::jsonb,null,'ACK_NEUTRAL')) is not null,'second owner same date allowed');

drop function assert_true(boolean,text);
SQL

# §7 Concurrency: two simultaneous corrections serialize (FOR UPDATE); version
# increments exactly once each.
TODAY=$(psql "$DATABASE_URL" -tA -c "select (timezone('Asia/Tokyo', now()))::date")
psql "$DATABASE_URL" -q -c "select public.yorisou_daily_record_correct('owner-b','$TODAY',now(),'{\"kokoro_tenki\":\"hare\"}'::jsonb,null,'ACK_SUNNY','user_correction')" &
psql "$DATABASE_URL" -q -c "select public.yorisou_daily_record_correct('owner-b','$TODAY',now(),'{\"kokoro_tenki\":\"ame\"}'::jsonb,null,'ACK_RAIN','user_correction')" &
wait
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
create or replace function assert_true(value boolean, message text) returns void language plpgsql as $$ begin if not value then raise exception 'assertion failed: %', message; end if; end $$;
select assert_true((select current_version=3 from yorisou_daily_state_records where owner_account_id='owner-b'),'concurrent corrections serialized to exactly v3');
select assert_true((select count(*)=3 from yorisou_daily_state_record_versions v join yorisou_daily_state_records r on r.id=v.record_id where r.owner_account_id='owner-b'),'three distinct version rows (1..3)');
drop function assert_true(boolean,text);
SQL

# Rollback/cleanup proof (disposable local DB only — LOCAL_DISPOSABLE_SCHEMA_ROLLBACK)
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
create or replace function assert_true(value boolean, message text) returns void language plpgsql as $$ begin if not value then raise exception 'assertion failed: %', message; end if; end $$;
drop function if exists public.yorisou_daily_record_delete(text, date, text);
drop function if exists public.yorisou_daily_record_correct(text, date, timestamptz, jsonb, text, text, text);
drop function if exists public.yorisou_daily_record_create(text, text, text, text, timestamptz, date, text, integer, jsonb, text, text);
drop table if exists public.yorisou_daily_state_history_events;
drop table if exists public.yorisou_daily_state_record_versions;
drop table if exists public.yorisou_daily_state_records;
drop function if exists public.yorisou_dci_block_mutation();
select assert_true((select count(*)=0 from pg_tables where schemaname='public' and tablename like 'yorisou_daily_state_%'),'rollback removes all daily tables (disposable DB)');
drop function assert_true(boolean,text);
SQL

echo "DCI-1.1 daily-check-in postgres integration: ALL CHECKS PASSED (disposable local DB)"
