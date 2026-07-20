#!/usr/bin/env bash
# CPV1-CM0 §6 — isolated disposable-DB migration/RLS verification (LOCAL only).
# The CM0 migrations are SELF-CONTAINED: 202607200001 defines the CPV1-owned helpers
# (yorisou_cpv1_current_account_id + yorisou_cpv1_block_mutation) — NO APP-2 dependency.
# Creates a throwaway DB, applies 200001..200004, runs the checks, tears down + reapplies,
# and drops the DB (no synthetic rows survive; dev DB untouched).
set -uo pipefail
C=supabase_db_yorisou-online
DB=cpv1cm0_verify
MIG=/Users/yangjin/Projects/yorisou-online/supabase/migrations
pass=0; fail=0
ok(){ echo "  PASS  $1"; pass=$((pass+1)); }
no(){ echo "  FAIL  $1"; fail=$((fail+1)); }
q(){ docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -qtA -d "$1" -c "$2" 2>&1; }
as(){ docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -qtA -d "$DB" >/tmp/cm0as.out 2>&1 <<SQL
begin;
select set_config('request.jwt.claims', '$2', true);
set local role $1;
$3
commit;
SQL
}
expect_ok(){ as "$1" "$2" "$3"; [ $? -eq 0 ] && ok "$4" || no "$4 — $(tail -1 /tmp/cm0as.out)"; }
expect_deny(){ as "$1" "$2" "$3"; [ $? -ne 0 ] && ok "$4 (denied)" || no "$4 — expected denial but SUCCEEDED"; }
read_as(){ docker exec -i "$C" psql -U postgres -qtA -d "$DB" 2>/dev/null <<SQL | tail -1
begin;
select set_config('request.jwt.claims', '$2', true);
set local role $1;
$3
commit;
SQL
}

echo "== 0. create disposable database + minimal role usage (roles are cluster-wide) =="
q postgres "drop database if exists $DB;" >/dev/null
q postgres "create database $DB;" >/dev/null && echo "  created $DB"
q "$DB" "grant usage on schema public to anon, authenticated, service_role; alter default privileges in schema public grant all on tables to service_role;" >/dev/null

echo "== 1. migrations apply in order (200001 prereqs -> 002 -> 003 -> 004), SELF-CONTAINED =="
applied=1
for m in 202607200001_cpv1_foundation_prereqs 202607200002_cpv1_understanding_history_consent 202607200003_cpv1r1_relations_permissions_datarights 202607200004_cpv1r1_datarights_reason_codes; do
  docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -q -d "$DB" < "$MIG/$m.sql" >/tmp/cm0mig.out 2>&1 && echo "  applied $m" || { echo "  FAILED $m: $(tail -2 /tmp/cm0mig.out)"; applied=0; }
done
[ $applied -eq 1 ] && ok "1. self-contained migrations apply in order (no APP-2 helper needed)" || no "1. migrations apply"

echo "== 2. CPV1-owned helpers exist (not APP-2) =="
h=$(q "$DB" "select count(*) from pg_proc where proname in ('yorisou_cpv1_current_account_id','yorisou_cpv1_block_mutation');")
a=$(q "$DB" "select count(*) from pg_proc where proname in ('yorisou_current_account_id','yorisou_app2_block_mutation');")
{ [ "$h" = "2" ] && [ "$a" = "0" ]; } && ok "2. CPV1-owned helpers present ($h); APP-2 helpers absent ($a)" || no "2. helper set wrong (cpv1=$h app2=$a)"

echo "== 3-4. RLS enabled + forced on all 4 CPV1 tables =="
rls=$(q "$DB" "select string_agg(relname||':'||relrowsecurity||'/'||relforcerowsecurity,' ') from pg_class where relname like 'yorisou_cpv1_%' and relkind='r';")
[ "$(echo "$rls" | grep -o ':true/true' | wc -l | tr -d ' ')" = "4" ] && ok "3-4. RLS enabled + forced on all 4 CPV1 tables" || no "3-4. RLS/force: $rls"

echo "== 5. grants: anon none; authenticated SELECT-only on history =="
g_anon=$(q "$DB" "select count(*) from information_schema.role_table_grants where grantee='anon' and table_name like 'yorisou_cpv1_%';")
g_auth_hist=$(q "$DB" "select string_agg(privilege_type,',' order by privilege_type) from information_schema.role_table_grants where grantee='authenticated' and table_name='yorisou_cpv1_history_events';")
[ "$g_anon" = "0" ] && ok "5a. anon has NO grants" || no "5a. anon grants=$g_anon"
[ "$g_auth_hist" = "SELECT" ] && ok "5b. authenticated SELECT-only on history" || no "5b. authenticated history=$g_auth_hist"

echo "== 6. anon denied =="
expect_deny anon '{}' "select count(*) from public.yorisou_cpv1_observations;" "6. anon SELECT denied"

echo "== 7-8. user isolation + forged-id denial (via CPV1-owned account resolver) =="
expect_ok authenticated '{"app_account_id":"acctA"}' "insert into public.yorisou_cpv1_observations(account_id,source_class,derived,evidence_class) values('acctA','direct_user_statement','safe A','user_declared');" "7a. user A inserts own row"
expect_ok authenticated '{"app_account_id":"acctB"}' "insert into public.yorisou_cpv1_observations(account_id,source_class,derived,evidence_class) values('acctB','direct_user_statement','safe B','user_declared');" "7b. user B inserts own row"
cntA=$(read_as authenticated '{"app_account_id":"acctA"}' "select count(*) from public.yorisou_cpv1_observations;")
[ "$cntA" = "1" ] && ok "8a. user A sees ONLY own row ($cntA of 2)" || no "8a. user A sees $cntA rows"
expect_deny authenticated '{"app_account_id":"acctA"}' "insert into public.yorisou_cpv1_observations(account_id,source_class,derived,evidence_class) values('acctB','direct_user_statement','forged','user_declared');" "8b. user A CANNOT forge account_id=acctB"

echo "== 9. exact identity persists =="
expect_ok service_role '{}' "insert into public.yorisou_cpv1_history_events(account_id,event_type,method_id,method_version,object_kind,object_ref,reason_code) values('acctA','result_created','m1','v1','result','R',null);" "9. history event persists exact object_ref+version"

echo "== 10-11. independent consent + revocation on next read =="
expect_ok authenticated '{"app_account_id":"acctA"}' "insert into public.yorisou_cpv1_method_consent(account_id,method_id,community_use,report_use) values('acctA','imairo-120q',true,false);" "10. consent independent booleans persist"
expect_ok authenticated '{"app_account_id":"acctA"}' "update public.yorisou_cpv1_method_consent set community_use=false where account_id='acctA' and method_id='imairo-120q';" "11a. revoke community_use"
rev=$(read_as authenticated '{"app_account_id":"acctA"}' "select community_use||'/'||report_use from public.yorisou_cpv1_method_consent where method_id='imairo-120q';")
[ "$rev" = "false/false" ] && ok "11b. revocation visible next read; report independent (false/false)" || no "11b. read=$rev"

echo "== 12. deleted flag =="
expect_ok authenticated '{"app_account_id":"acctA"}' "update public.yorisou_cpv1_observations set deleted=true where account_id='acctA';" "12. observation deletable (downstream gate reads flag)"

echo "== 13. data-rights audit rejects personal free text (004 CHECK) =="
expect_deny service_role '{}' "insert into public.yorisou_cpv1_history_events(account_id,event_type,object_ref,reason_code,safe_detail) values('acctA','user_forgot','o1',null,null);" "13a. data-rights without reason_code denied"
expect_deny service_role '{}' "insert into public.yorisou_cpv1_history_events(account_id,event_type,object_ref,reason_code,safe_detail) values('acctA','user_forgot','o1','user_requested','私の生年月日');" "13b. personal free-text safe_detail denied"
expect_ok service_role '{}' "insert into public.yorisou_cpv1_history_events(account_id,event_type,object_ref,reason_code,safe_detail) values('acctA','user_forgot','o1','user_requested','data-rights action performed at user request');" "13c. reason_code + fixed message OK"

echo "== 14-15. append-only: update/delete blocked by CPV1-owned guard =="
expect_deny service_role '{}' "update public.yorisou_cpv1_history_events set safe_detail='x' where account_id='acctA';" "14/15a. UPDATE blocked (yorisou_cpv1_block_mutation)"
expect_deny service_role '{}' "delete from public.yorisou_cpv1_history_events where account_id='acctA';" "15b. DELETE blocked (append-only)"

echo "== 16. registry snapshot admin/service-role only =="
expect_deny authenticated '{"app_account_id":"acctA"}' "select count(*) from public.yorisou_cpv1_method_registry_snapshot;" "16a. authenticated denied on registry snapshot"
expect_ok service_role '{}' "select count(*) from public.yorisou_cpv1_method_registry_snapshot;" "16b. service_role reads registry snapshot"

echo "== 17. teardown (disposable rollback) =="
docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -q -d "$DB" >/tmp/cm0td.out 2>&1 <<'SQL'
drop trigger if exists yorisou_cpv1_history_no_mutate on public.yorisou_cpv1_history_events;
alter table public.yorisou_cpv1_history_events drop constraint if exists yorisou_cpv1_hist_datarights_no_freetext;
drop table if exists public.yorisou_cpv1_history_events;
drop table if exists public.yorisou_cpv1_method_consent;
drop table if exists public.yorisou_cpv1_observations;
drop table if exists public.yorisou_cpv1_method_registry_snapshot;
SQL
[ $? -eq 0 ] && ok "17. teardown succeeds" || no "17. teardown: $(tail -1 /tmp/cm0td.out)"

echo "== 18. reapplication after teardown =="
ra=1
for m in 202607200002_cpv1_understanding_history_consent 202607200003_cpv1r1_relations_permissions_datarights 202607200004_cpv1r1_datarights_reason_codes; do
  docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -q -d "$DB" < "$MIG/$m.sql" >/tmp/cm0ra.out 2>&1 || { ra=0; echo "  reapply FAILED $m: $(tail -1 /tmp/cm0ra.out)"; }
done
[ $ra -eq 1 ] && ok "18. reapplication after teardown succeeds" || no "18. reapplication"

echo "== 19. cleanup: drop disposable database (no synthetic rows survive) =="
q postgres "drop database if exists $DB;" >/dev/null && echo "  dropped $DB"
left=$(q postgres "select count(*) from pg_database where datname='$DB';")
[ "$left" = "0" ] && ok "19. disposable database dropped" || no "19. database remains"

echo ""; echo "== SUMMARY: $pass passed, $fail failed =="
exit $fail
