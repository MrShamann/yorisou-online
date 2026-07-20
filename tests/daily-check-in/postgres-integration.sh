#!/usr/bin/env bash
# DCI-1 — daily-check-in migration/RLS verification in an ISOLATED DISPOSABLE
# local Postgres database (never hosted, never production).
# Run: DATABASE_URL=postgres://...@localhost:5432/yorisou_daily_check_in_test npm run test:daily-check-in:db
set -euo pipefail
if [[ -z "${DATABASE_URL:-}" ]]; then echo "DATABASE_URL is required" >&2; exit 1; fi
if [[ "$DATABASE_URL" == *"supabase.co"* || "$DATABASE_URL" != *"@localhost:"* || "$DATABASE_URL" != *"yorisou_daily_check_in_test"* ]]; then echo "Refusing non-ephemeral database target" >&2; exit 1; fi
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c 'create extension if not exists pgcrypto;'
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "do \$\$ begin create role service_role; exception when duplicate_object then null; end \$\$; do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$; do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;"
# Prerequisite (clean-main CM0 helper) then the DCI-1 migration, in order.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607200001_cpv1_foundation_prereqs.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607200005_dci1_daily_state_records.sql
# Idempotence: re-apply must succeed without error.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607200005_dci1_daily_state_records.sql

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 <<'SQL'
create or replace function assert_true(value boolean, message text) returns void language plpgsql as $$ begin if not value then raise exception 'assertion failed: %', message; end if; end $$;

-- Schema + privacy posture -----------------------------------------------------
select assert_true((select count(*)=3 from pg_tables where schemaname='public' and tablename like 'yorisou_daily_state_%'),'three daily tables exist');
select assert_true((select bool_and(relrowsecurity) from pg_class where relname in ('yorisou_daily_state_records','yorisou_daily_state_record_versions','yorisou_daily_state_history_events')),'RLS enabled on all three');
select assert_true((select count(*)=0 from pg_policies where schemaname='public' and tablename like 'yorisou_daily_state_%'),'no user policies (service-role only family)');
select assert_true(not has_table_privilege('public','public.yorisou_daily_state_records','select'),'PUBLIC records read denied');
select assert_true(not has_table_privilege('anon','public.yorisou_daily_state_records','select'),'anon records read denied');
select assert_true(not has_table_privilege('authenticated','public.yorisou_daily_state_records','select'),'authenticated direct read denied');
select assert_true(not has_table_privilege('anon','public.yorisou_daily_state_records','insert'),'anon records write denied');
select assert_true(not has_table_privilege('anon','public.yorisou_daily_state_record_versions','select'),'anon versions read denied');
select assert_true(not has_table_privilege('anon','public.yorisou_daily_state_history_events','select'),'anon events read denied');
select assert_true(has_table_privilege('service_role','public.yorisou_daily_state_records','select'),'service-role read allowed');
select assert_true(not has_function_privilege('public','public.yorisou_daily_record_create(text,text,text,text,timestamptz,date,text,integer,jsonb,text,text)','execute'),'PUBLIC create RPC denied');
select assert_true(not has_function_privilege('anon','public.yorisou_daily_record_create(text,text,text,text,timestamptz,date,text,integer,jsonb,text,text)','execute'),'anon create RPC denied');
select assert_true(not has_function_privilege('authenticated','public.yorisou_daily_record_correct(text,date,timestamptz,jsonb,text,text,text)','execute'),'authenticated correct RPC denied');
select assert_true(has_function_privilege('service_role','public.yorisou_daily_record_delete(text,date,text)','execute'),'service-role delete RPC allowed');
select assert_true((select bool_and(p.proconfig @> array['search_path=public']) from pg_proc p where p.proname like 'yorisou_daily_record_%'),'fixed RPC search_path');
-- Tombstone/audit table structurally carries NO content: no state, no memo column.
select assert_true((select count(*)=0 from information_schema.columns where table_name='yorisou_daily_state_history_events' and column_name in ('state','memo')),'history events carry no state/memo columns');

-- Owner create → record + version 1 + created event -----------------------------
select assert_true((select public.yorisou_daily_record_create('owner-a','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2','2026-07-20T03:00:00Z','2026-07-20','Asia/Tokyo',540,'{"kokoro_tenki":"ame","karada_juden":null,"atama_yohaku":null,"hito_kyori":null,"kyou_hoshii":"yasumi"}'::jsonb,'きょうのメモ','ACK_RAIN')) is not null,'create returns record id');
select assert_true((select count(*)=1 from yorisou_daily_state_records where owner_account_id='owner-a' and entry_local_date='2026-07-20' and deleted_at is null),'one visible record');
select assert_true((select count(*)=1 from yorisou_daily_state_record_versions v join yorisou_daily_state_records r on r.id=v.record_id where r.owner_account_id='owner-a' and v.version=1 and v.reason_code='initial'),'version 1 written');
select assert_true((select count(*)=1 from yorisou_daily_state_history_events where owner_account_id='owner-a' and event_type='created' and version=1),'created event written');

-- Idempotent retry: duplicate same-day create raises daily_record_exists --------
do $$ begin perform public.yorisou_daily_record_create('owner-a','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2','2026-07-20T04:00:00Z','2026-07-20','Asia/Tokyo',540,'{"kokoro_tenki":"hare"}'::jsonb,null,'ACK_SUNNY'); raise exception 'duplicate create accepted'; exception when others then if position('daily_record_exists' in sqlerrm)=0 then raise; end if; end $$;

-- Versioned same-day correction: old version PRESERVED; visible updates atomically
select assert_true((select public.yorisou_daily_record_correct('owner-a','2026-07-20','2026-07-20T05:00:00Z','{"kokoro_tenki":"kumori","karada_juden":"maamaa","atama_yohaku":null,"hito_kyori":null,"kyou_hoshii":"yasumi"}'::jsonb,null,'ACK_NEED_YASUMI','user_correction'))=2,'correction returns version 2');
select assert_true((select current_version=2 and state->>'kokoro_tenki'='kumori' and memo is null from yorisou_daily_state_records where owner_account_id='owner-a' and entry_local_date='2026-07-20' and deleted_at is null),'visible record updated to v2');
select assert_true((select count(*)=2 from yorisou_daily_state_record_versions v join yorisou_daily_state_records r on r.id=v.record_id where r.owner_account_id='owner-a'),'both versions preserved');
select assert_true((select v.state->>'kokoro_tenki'='ame' and v.memo='きょうのメモ' from yorisou_daily_state_record_versions v join yorisou_daily_state_records r on r.id=v.record_id where r.owner_account_id='owner-a' and v.version=1),'version 1 content untouched');
select assert_true((select count(*)=1 from yorisou_daily_state_history_events where owner_account_id='owner-a' and event_type='corrected' and version=2),'corrected event written');
do $$ begin perform public.yorisou_daily_record_correct('owner-a','2026-07-20','2026-07-20T05:30:00Z','{}'::jsonb,null,'ACK_NEUTRAL','free_text_reason'); raise exception 'invalid reason accepted'; exception when others then if position('daily_record_invalid_reason' in sqlerrm)=0 then raise; end if; end $$;
do $$ begin perform public.yorisou_daily_record_correct('owner-b','2026-07-20','2026-07-20T05:30:00Z','{}'::jsonb,null,'ACK_NEUTRAL','user_correction'); raise exception 'cross-owner correction accepted'; exception when others then if position('daily_record_not_found' in sqlerrm)=0 then raise; end if; end $$;

-- Append-only protection ---------------------------------------------------------
do $$ begin update yorisou_daily_state_record_versions set memo='overwrite' where version=1; raise exception 'version mutation accepted'; exception when others then if position('append_only' in sqlerrm)=0 then raise; end if; end $$;
do $$ begin delete from yorisou_daily_state_record_versions where version=1; raise exception 'version delete accepted'; exception when others then if position('append_only' in sqlerrm)=0 then raise; end if; end $$;
do $$ begin update yorisou_daily_state_history_events set event_type='created' where event_type='corrected'; raise exception 'event mutation accepted'; exception when others then if position('append_only' in sqlerrm)=0 then raise; end if; end $$;

-- Governed deletion: hidden from visible history; content-free tombstone event ---
select assert_true((select public.yorisou_daily_record_delete('owner-a','2026-07-20','owner')),'delete succeeds');
select assert_true((select count(*)=0 from yorisou_daily_state_records where owner_account_id='owner-a' and entry_local_date='2026-07-20' and deleted_at is null),'record hidden from visible history');
select assert_true((select count(*)=1 from yorisou_daily_state_history_events where owner_account_id='owner-a' and event_type='deleted' and reason_code='user_deleted'),'tombstone event written');
select assert_true((select public.yorisou_daily_record_delete('owner-a','2026-07-20','owner'))=false,'second delete is a no-op (false)');
-- A NEW entry for the same local date is allowed after deletion (partial unique index).
select assert_true((select public.yorisou_daily_record_create('owner-a','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2','2026-07-20T06:00:00Z','2026-07-20','Asia/Tokyo',540,'{"kokoro_tenki":"hare"}'::jsonb,null,'ACK_SUNNY')) is not null,'re-create after delete allowed');

-- Constraints --------------------------------------------------------------------
do $$ begin insert into yorisou_daily_state_records(owner_account_id,method_id,method_version,schema_version,ack_version,produced_at,entry_local_date,timezone,state,ack_id) values('x','other-method','v','v','v',now(),'2026-07-20','Asia/Tokyo','{}','A'); raise exception 'method check missing'; exception when check_violation then null; end $$;
do $$ begin perform public.yorisou_daily_record_create('owner-c','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2','2026-07-20T03:00:00Z','2026-07-20','Asia/Tokyo',540,'{"kokoro_tenki":"hare"}'::jsonb,repeat('あ',141),'ACK_SUNNY'); raise exception 'memo length accepted'; exception when check_violation then null; end $$;
do $$ begin perform public.yorisou_daily_record_create('','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2','2026-07-20T03:00:00Z','2026-07-20','Asia/Tokyo',540,'{}'::jsonb,null,'ACK_NEUTRAL'); raise exception 'empty owner accepted'; exception when others then if position('daily_record_owner_required' in sqlerrm)=0 then raise; end if; end $$;

-- Second-user isolation (data level): rows are strictly per-owner ----------------
select assert_true((select public.yorisou_daily_record_create('owner-b','daily-check-in-v1.0','daily-state-schema-v1.1','daily-ack-v1.2','2026-07-20T03:00:00Z','2026-07-20','Asia/Tokyo',540,'{"kokoro_tenki":"kumori"}'::jsonb,null,'ACK_NEUTRAL')) is not null,'second owner same date allowed');
select assert_true((select count(*)=0 from yorisou_daily_state_records where owner_account_id='owner-b' and state->>'kokoro_tenki'='hare'),'owners never share rows');

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
select assert_true((select count(*)=0 from pg_tables where schemaname='public' and tablename like 'yorisou_daily_state_%'),'rollback removes all daily tables (disposable DB)');
drop function assert_true(boolean,text);
SQL

echo "DCI-1 daily-check-in postgres integration: ALL CHECKS PASSED (disposable local DB)"
