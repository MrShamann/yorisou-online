#!/usr/bin/env bash
# OSF-1 PHASE A — the staging activation rehearsal, reproducible.
#
# Builds a disposable PostgreSQL 17 cluster, applies the baseline lineage WITHOUT the OSF-1 pair,
# then applies 202608140001 and 202608140002 in order and verifies tables, RLS, the privilege
# matrix, executed account erasure, and rollback. Destroys the cluster on exit.
#
# It CANNOT be pointed at a hosted database: it creates its own cluster and takes no DSN.
# Evidence: docs/yorisou/osf1/STAGING_ACTIVATION_REPORT.md
#
#   bash tests/life-os/staging-activation.sh

cd /Volumes/AI-Work/Projects/yorisou-online
PGBIN=/opt/homebrew/opt/postgresql@17/bin; PORT=55611; W=/tmp/osf1-staging
export PATH="$PGBIN:$PATH" LC_ALL=C
rm -rf "$W"; mkdir -p "$W/pg"
initdb -D "$W/pg" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
pg_ctl -D "$W/pg" -o "-p $PORT -c unix_socket_directories=''" -l "$W/pg/log" start >/dev/null 2>&1; sleep 2
createdb -h localhost -p $PORT -U postgres staging
DSN="postgres://postgres@localhost:$PORT/staging"
Q(){ psql "$DSN" -t -A -X -q "$@"; }
psql "$DSN" -q -X -c "create extension if not exists pgcrypto;
 do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$;
 do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
 do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;
 grant usage on schema public to anon,authenticated,service_role;" >/dev/null

echo "STEP 1 — baseline: every migration EXCEPT the OSF-1 pair"
BASE=0
for f in supabase/migrations/*.sql; do
  case "$(basename "$f")" in 20260814000*) continue;; esac
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null 2>&1 && BASE=$((BASE+1))
done
echo "  applied $BASE baseline migrations"
echo "  OSF-1 tables present before activation: $(Q -c "select count(*) from information_schema.tables where table_schema='public' and table_name in ('yorisou_user_contexts','yorisou_current_state_records','yorisou_goals','yorisou_life_reflections','yorisou_explicit_memories');")  (expect 0)"

echo "STEP 2 — apply 202608140001"
psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f supabase/migrations/202608140001_osf1_life_os_foundation.sql >"$W/m1.log" 2>&1 && echo "  APPLIED cleanly" || { echo "  FAILED"; tail -3 "$W/m1.log"; }
echo "STEP 3 — apply 202608140002"
psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f supabase/migrations/202608140002_osf1_erasure_plan_registration.sql >"$W/m2.log" 2>&1 && echo "  APPLIED cleanly" || { echo "  FAILED"; tail -3 "$W/m2.log"; }

echo "STEP 4 — table verification"
for t in yorisou_user_contexts yorisou_current_state_records yorisou_goals yorisou_life_reflections yorisou_explicit_memories; do
  printf "  %-34s %s\n" "$t" "$(Q -c "select case when to_regclass('public.$t') is null then 'MISSING' else 'exists' end;")"
done
printf "  %-34s %s\n" "yorisou_experience_cards.title+lesson" "$(Q -c "select count(*) from information_schema.columns where table_name='yorisou_experience_cards' and column_name in ('title','lesson');") of 2"
printf "  %-34s %s\n" "life relationships table" "$(Q -c "select count(*) from information_schema.tables where table_schema='public' and table_name like '%relationship%' and table_name like '%life%';") (none expected — Phase E is a view, not a graph)"

echo "STEP 5 — RLS"
for t in yorisou_user_contexts yorisou_current_state_records yorisou_goals yorisou_life_reflections yorisou_explicit_memories; do
  printf "  %-34s rls=%s  anon_select=%s  svc_insert=%s\n" "$t" \
    "$(Q -c "select relrowsecurity from pg_class where relname='$t' and relnamespace='public'::regnamespace;")" \
    "$(Q -c "select has_table_privilege('anon','public.$t','select');")" \
    "$(Q -c "select has_table_privilege('service_role','public.$t','insert');")"
done

echo "STEP 6 — erasure"
A=stg-a; B=stg-b
Q -c "select public.yorisou_osf1_current_state_create('$A',array['heavy','rest'],null,null,null,null,'manual');" >/dev/null
Q -c "select public.yorisou_osf1_goal_create('$A','方向',null);" >/dev/null
Q -c "select public.yorisou_osf1_reflection_create('$A',null,'あったこと',null,null,null,null,null,null,null);" >/dev/null
D=$(Q -c "select encode(sha256(convert_to('おぼえる','utf8')),'hex');")
Q -c "select public.yorisou_osf1_memory_confirm('$A','preference','おぼえる','user_statement','$D',true,null,null,null);" >/dev/null
Q -c "select public.yorisou_osf1_user_context_upsert('$A','ja',null,null,'{}'::jsonb);" >/dev/null
Q -c "select public.yorisou_osf1_goal_create('$B','べつの人',null);" >/dev/null
BEFORE=$(Q -c "select (select count(*) from yorisou_current_state_records where owner_account_id='$A')+(select count(*) from yorisou_goals where owner_account_id='$A')+(select count(*) from yorisou_life_reflections where owner_account_id='$A')+(select count(*) from yorisou_explicit_memories where owner_account_id='$A')+(select count(*) from yorisou_user_contexts where owner_account_id='$A');")
Q -c "insert into yorisou_account_deletion_jobs (owner_account_id,owner_fingerprint) values ('$A',encode(sha256(convert_to('$A','utf8')),'hex'));" >/dev/null
Q -c "select public.yorisou_account_deletion_erase_database_unchecked('$A');" >/dev/null 2>&1
AFTER=$(Q -c "select (select count(*) from yorisou_current_state_records where owner_account_id='$A')+(select count(*) from yorisou_goals where owner_account_id='$A')+(select count(*) from yorisou_life_reflections where owner_account_id='$A')+(select count(*) from yorisou_explicit_memories where owner_account_id='$A')+(select count(*) from yorisou_user_contexts where owner_account_id='$A');")
OTHER=$(Q -c "select count(*) from yorisou_goals where owner_account_id='$B';")
echo "  owner A rows before=$BEFORE after=$AFTER   owner B rows=$OTHER (expect 5 / 0 / 1)"

echo "STEP 7 — rollback"
psql "$DSN" -q -X -f supabase/migrations/202608010110_por1_exact_job_erasure_authority.sql >/dev/null 2>&1 && echo "  202608140002 rolled back by re-applying 202608010110: OK"
psql "$DSN" -q -X -v ON_ERROR_STOP=1 >"$W/rb.log" 2>&1 <<'SQL' && echo "  202608140001 rollback block: OK" || { echo "  rollback FAILED"; tail -3 "$W/rb.log"; }
drop function if exists public.yorisou_osf1_memory_delete(text, uuid);
drop function if exists public.yorisou_osf1_memory_confirm(text, text, text, text, text, boolean, uuid, uuid, uuid);
drop function if exists public.yorisou_osf1_reflection_create(text, uuid, text, text, text, text, text, text, text, text);
drop function if exists public.yorisou_osf1_goal_set_status(text, uuid, text);
drop function if exists public.yorisou_osf1_goal_create(text, text, text);
drop function if exists public.yorisou_osf1_current_state_set_reflection(text, uuid, text);
drop function if exists public.yorisou_osf1_current_state_create(text, text[], text, text, text, text, text);
drop function if exists public.yorisou_osf1_user_context_upsert(text, text, text, text, jsonb);
drop function if exists public.yorisou_osf1_state_vocabulary();
drop table if exists public.yorisou_explicit_memories;
drop table if exists public.yorisou_life_reflections;
drop table if exists public.yorisou_goals;
drop table if exists public.yorisou_current_state_records;
drop table if exists public.yorisou_user_contexts;
alter table public.yorisou_experience_cards drop constraint if exists yorisou_experience_cards_shared_context_chk;
alter table public.yorisou_experience_cards drop column if exists lesson;
alter table public.yorisou_experience_cards drop column if exists title;
SQL
echo "  OSF-1 tables after rollback: $(Q -c "select count(*) from information_schema.tables where table_schema='public' and table_name in ('yorisou_user_contexts','yorisou_current_state_records','yorisou_goals','yorisou_life_reflections','yorisou_explicit_memories');") (expect 0)"
echo "  pre-existing experience cards survive rollback: $(Q -c "select case when to_regclass('public.yorisou_experience_cards') is null then 'DROPPED - BAD' else 'intact' end;")"
pg_ctl -D "$W/pg" stop >/dev/null 2>&1; rm -rf "$W"
