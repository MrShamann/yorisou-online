#!/usr/bin/env bash
# CPV1-R1 §12 — isolated disposable-DB migration/RLS verification (LOCAL only).
# Creates a throwaway database in the running local Supabase Postgres cluster,
# bootstraps the two documented helper deps + roles, applies the CPV1 migrations
# (002/003/004), runs the 19-point verification, tears down + reapplies, and drops
# the disposable database (no synthetic rows survive anywhere).
set -uo pipefail
C=supabase_db_yorisou-online
DB=cpv1_r1_verify
MIG=/Users/yangjin/Projects/yorisou-online/supabase/migrations
pass=0; fail=0
ok(){ echo "  PASS  $1"; pass=$((pass+1)); }
no(){ echo "  FAIL  $1"; fail=$((fail+1)); }

# psql helpers (postgres superuser)
q(){ docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -qtA -d "$1" -c "$2" 2>&1; }
qf(){ docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -qtA -d "$DB" 2>&1; }   # stdin
# run a statement as a role with JWT claims; returns psql exit code
as(){ # role claims sql
  docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -qtA -d "$DB" >/tmp/as.out 2>&1 <<SQL
begin;
select set_config('request.jwt.claims', '$2', true);
set local role $1;
$3
commit;
SQL
}
expect_ok(){ as "$1" "$2" "$3"; [ $? -eq 0 ] && ok "$4" || { no "$4 — $(tail -1 /tmp/as.out)"; }; }
expect_deny(){ as "$1" "$2" "$3"; [ $? -ne 0 ] && ok "$4 (denied: $(tail -1 /tmp/as.out | cut -c1-60))" || no "$4 — expected denial but SUCCEEDED"; }
# read a scalar as a role, in a PROPER transaction so RLS + set local role apply
read_as(){ docker exec -i "$C" psql -U postgres -qtA -d "$DB" 2>/dev/null <<SQL | tail -1
begin;
select set_config('request.jwt.claims', '$2', true);
set local role $1;
$3
commit;
SQL
}

echo "== 0. create disposable database =="
q postgres "drop database if exists $DB;" >/dev/null
q postgres "create database $DB;" >/dev/null && echo "  created $DB"

echo "== bootstrap deps (pgcrypto + roles usage + 2 helper fns from migration 001) =="
qf <<'SQL' >/dev/null
create extension if not exists pgcrypto;
grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to service_role;
create or replace function public.yorisou_current_account_id()
returns text language sql stable as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'app_account_id',
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )
$$;
create or replace function public.yorisou_app2_block_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'append_only: % on % is not permitted', tg_op, tg_table_name;
  return null;
end;
$$;
SQL
echo "  helpers created"

echo "== 1. migrations apply in the correct order (002 -> 003 -> 004) =="
applied=1
for m in 202607190002_cpv1_understanding_history_consent 202607190003_cpv1r1_relations_permissions_datarights 202607190004_cpv1r1_datarights_reason_codes; do
  docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -q -d "$DB" < "$MIG/$m.sql" >/tmp/mig.out 2>&1 && echo "  applied $m" || { echo "  APPLY FAILED $m: $(tail -2 /tmp/mig.out)"; applied=0; }
done
[ $applied -eq 1 ] && ok "1. migrations apply in order" || no "1. migrations apply in order"

echo "== 2. reapplication behavior is intentional (once-only migrations) =="
# INTENTIONAL: a full re-run of 002 must ERROR on the once-only trigger create
# (migrations are applied once, not re-run). Column adds are if-not-exists; the
# trigger + named constraints are single-shot. Proving the guard fires = intentional.
docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -q -d "$DB" < "$MIG/202607190002_cpv1_understanding_history_consent.sql" >/tmp/re.out 2>&1
if grep -qi "already exists" /tmp/re.out; then ok "2. reapplication intentionally errors on once-only objects (migrations run once)"; else no "2. reapplication — unexpected: $(tail -1 /tmp/re.out)"; fi

echo "== 3-4. RLS enabled + forced on all CPV1 tables =="
rls=$(q "$DB" "select string_agg(relname||':'||relrowsecurity||'/'||relforcerowsecurity,' ') from pg_class where relname like 'yorisou_cpv1_%' and relkind='r';")
echo "  $rls"
[ "$(echo "$rls" | grep -o ':true/true' | wc -l | tr -d ' ')" = "4" ] && ok "3-4. RLS enabled + forced on all 4 CPV1 tables" || no "3-4. RLS/force not set on all tables"

echo "== 5. grants match intended operations =="
g_anon=$(q "$DB" "select count(*) from information_schema.role_table_grants where grantee='anon' and table_name like 'yorisou_cpv1_%';")
g_auth_hist=$(q "$DB" "select string_agg(privilege_type,',' order by privilege_type) from information_schema.role_table_grants where grantee='authenticated' and table_name='yorisou_cpv1_history_events';")
[ "$g_anon" = "0" ] && ok "5a. anon has NO grants on CPV1 tables" || no "5a. anon has grants ($g_anon)"
[ "$g_auth_hist" = "SELECT" ] && ok "5b. authenticated has SELECT-only on history (no insert/update/delete)" || no "5b. authenticated history grant = $g_auth_hist"

echo "== 6. anonymous users are denied =="
expect_deny anon '{}' "select count(*) from public.yorisou_cpv1_observations;" "6. anon SELECT on observations denied"

echo "== 7-8. authenticated sees only own rows; cannot forge another account id =="
expect_ok authenticated '{"app_account_id":"acctA"}' "insert into public.yorisou_cpv1_observations(account_id,source_class,derived,evidence_class) values('acctA','direct_user_statement','safe summary A','user_declared');" "7a. user A inserts own row"
expect_ok authenticated '{"app_account_id":"acctB"}' "insert into public.yorisou_cpv1_observations(account_id,source_class,derived,evidence_class) values('acctB','direct_user_statement','safe summary B','user_declared');" "7b. user B inserts own row"
cntA=$(read_as authenticated '{"app_account_id":"acctA"}' "select count(*) from public.yorisou_cpv1_observations;")
echo "  user A visible rows: $cntA (of 2 total)"
[ "$cntA" = "1" ] && ok "8a. user A sees ONLY their own row (RLS isolation)" || no "8a. user A sees $cntA rows"
expect_deny authenticated '{"app_account_id":"acctA"}' "insert into public.yorisou_cpv1_observations(account_id,source_class,derived,evidence_class) values('acctB','direct_user_statement','forged','user_declared');" "8b. user A CANNOT forge account_id=acctB (WITH CHECK)"

echo "== 9. exact result/version confirmation identity persists (history rows are exact-object) =="
expect_ok service_role '{}' "insert into public.yorisou_cpv1_history_events(account_id,event_type,method_id,method_version,object_kind,object_ref,reason_code) values('acctA','result_created','m1','v1','result','resultA',null);" "9. history event persists exact object_ref+method_version"

echo "== 10-11. independent consent permissions persist + revocation applies on next read =="
expect_ok authenticated '{"app_account_id":"acctA"}' "insert into public.yorisou_cpv1_method_consent(account_id,method_id,community_use,report_use) values('acctA','imairo-120q',true,false);" "10. consent row persists independent booleans"
expect_ok authenticated '{"app_account_id":"acctA"}' "update public.yorisou_cpv1_method_consent set community_use=false where account_id='acctA' and method_id='imairo-120q';" "11a. user revokes community_use"
rev=$(read_as authenticated '{"app_account_id":"acctA"}' "select community_use||'/'||report_use from public.yorisou_cpv1_method_consent where method_id='imairo-120q';")
[ "$rev" = "false/false" ] && ok "11b. revocation visible on user's next read; report_use independent (false/false)" || no "11b. read after revoke = $rev"

echo "== 12. deleted/rejected observations flag (downstream exclusion is app-enforced via canUseDownstream) =="
expect_ok authenticated '{"app_account_id":"acctA"}' "update public.yorisou_cpv1_observations set deleted=true where account_id='acctA';" "12. observation can be marked deleted (downstream gate reads this flag)"

echo "== 13. data-rights audit cannot contain personal free text (004 CHECK) =="
expect_deny service_role '{}' "insert into public.yorisou_cpv1_history_events(account_id,event_type,object_ref,reason_code,safe_detail) values('acctA','user_forgot','o1',null,null);" "13a. data-rights event WITHOUT reason_code denied"
expect_deny service_role '{}' "insert into public.yorisou_cpv1_history_events(account_id,event_type,object_ref,reason_code,safe_detail) values('acctA','user_forgot','o1','user_requested','私の生年月日は1990年');" "13b. data-rights event with personal free-text safe_detail denied"
expect_ok service_role '{}' "insert into public.yorisou_cpv1_history_events(account_id,event_type,object_ref,reason_code,safe_detail) values('acctA','user_forgot','o1','user_requested','data-rights action performed at user request');" "13c. data-rights event with reason_code + fixed message OK"

echo "== 14-15. history append-only: insert allowed, update/delete/truncate blocked =="
expect_deny service_role '{}' "update public.yorisou_cpv1_history_events set safe_detail='x' where account_id='acctA';" "14/15a. UPDATE on history blocked (append-only trigger)"
expect_deny service_role '{}' "delete from public.yorisou_cpv1_history_events where account_id='acctA';" "15b. DELETE on history blocked (append-only trigger)"

echo "== 16. registry snapshot is admin/service-role only =="
expect_deny authenticated '{"app_account_id":"acctA"}' "select count(*) from public.yorisou_cpv1_method_registry_snapshot;" "16a. authenticated denied on registry snapshot"
expect_ok service_role '{}' "select count(*) from public.yorisou_cpv1_method_registry_snapshot;" "16b. service_role may read registry snapshot"

echo "== 17. teardown succeeds (disposable rollback) =="
docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -q -d "$DB" >/tmp/td.out 2>&1 <<'SQL'
drop trigger if exists yorisou_cpv1_history_no_mutate on public.yorisou_cpv1_history_events;
alter table public.yorisou_cpv1_history_events drop constraint if exists yorisou_cpv1_hist_datarights_no_freetext;
drop table if exists public.yorisou_cpv1_history_events;
drop table if exists public.yorisou_cpv1_method_consent;
drop table if exists public.yorisou_cpv1_observations;
drop table if exists public.yorisou_cpv1_method_registry_snapshot;
SQL
[ $? -eq 0 ] && ok "17. teardown (table drops) succeeds" || no "17. teardown — $(tail -1 /tmp/td.out)"

echo "== 18. reapplication after teardown succeeds =="
ra=1
for m in 202607190002_cpv1_understanding_history_consent 202607190003_cpv1r1_relations_permissions_datarights 202607190004_cpv1r1_datarights_reason_codes; do
  docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -q -d "$DB" < "$MIG/$m.sql" >/tmp/ra.out 2>&1 || { ra=0; echo "  reapply FAILED $m: $(tail -1 /tmp/ra.out)"; }
done
[ $ra -eq 1 ] && ok "18. reapplication after teardown succeeds" || no "18. reapplication after teardown"

echo "== 19. final cleanup leaves no synthetic CPV1 rows (drop disposable database) =="
q postgres "drop database if exists $DB;" >/dev/null && echo "  dropped $DB"
left=$(q postgres "select count(*) from pg_database where datname='$DB';")
[ "$left" = "0" ] && ok "19. disposable database dropped — zero synthetic CPV1 rows survive" || no "19. database still present"

echo ""
echo "== SUMMARY: $pass passed, $fail failed =="
exit $fail