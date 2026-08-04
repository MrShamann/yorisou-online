#!/usr/bin/env bash
# POR-1 — governed account erasure across the append-only families.
#
# THE FOUNDER DECISION UNDER TEST
#
#     GOVERNED_ERASURE_DELETE + CONTENT_FREE_TOMBSTONE
#
# Append-only guarantees the ORDINARY path: history is never rewritten. It was never a promise to
# keep a person's content after they asked to be deleted. So content rows are physically removed and
# a new, content-free tombstone records that a deletion happened.
#
# WHY EVERY NEGATIVE CONTROL ASSERTS ROWS EXISTED FIRST.
#
# A `BEFORE DELETE ... FOR EACH ROW` trigger only fires per row. A DELETE matching nothing succeeds
# silently, so a control run against an empty table PASSES WITHOUT TESTING ANYTHING. That happened
# twice while building this — two "the guard was bypassed!" results were both zero-row artifacts, and
# one "the guard held" result was equally worthless. Vacuity in either direction is the failure mode
# here, so `expect_rows` guards every case.
#
#   bash tests/por1/append-only-erasure.sh

set -euo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${POR1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
PORT="${POR1_POSTGRES_PORT:-55556}"
WORK="${POR1_WORK:-/tmp/por1-append-only}"
DB=por1_append_only
export LC_ALL=C PATH="$PGBIN:$PATH"

FAILURES=0
cleanup() { set +e; pg_ctl -D "$WORK/pg" stop >/dev/null 2>&1; rm -rf "$WORK"; }
trap cleanup EXIT

[ "$("$PGBIN/postgres" --version | awk '{print $3}' | cut -d. -f1)" = "17" ] || { echo "refusing: Production runs PostgreSQL 17" >&2; exit 1; }

rm -rf "$WORK"; mkdir -p "$WORK/pg"
initdb -D "$WORK/pg" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
pg_ctl -D "$WORK/pg" -o "-p $PORT -c unix_socket_directories=''" -l "$WORK/pg/log" start >/dev/null
sleep 1
createdb -h localhost -p "$PORT" -U postgres "$DB"
D="postgres://postgres@localhost:$PORT/$DB"
Q="psql $D -t -A -X -v ON_ERROR_STOP=1"

$Q -q -c "create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";
  do \$\$ begin create role service_role bypassrls; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;
  grant usage on schema public to anon, authenticated, service_role;" >/dev/null
for f in supabase/migrations/*.sql; do
  case "$(basename "$f")" in 2026080101*) continue ;; esac
  $Q -q -f "$f" >/dev/null 2>&1
done
$Q -q -c "grant all on all tables in schema public to service_role; grant all on all sequences in schema public to service_role;" >/dev/null
for f in supabase/migrations/2026080101*.sql; do $Q -q -f "$f" >/dev/null; done
echo "[ao] 21 migrations applied on PostgreSQL $("$PGBIN/postgres" --version | awk '{print $3}')"

$Q -q -f tests/por1/fixture-override-registry.sql >/dev/null 2>&1
for p in por1a por1b; do
  $Q -q -v principal="$p" -f tests/por1/seed-owner-linked-families.sql >/dev/null 2>&1
  $Q -q -v principal="$p" -f tests/por1/fixture-overrides.sql >/dev/null 2>&1
done

pass() { printf '  ok   %s\n' "$1"; }
fail() { printf '  FAIL %s  %s\n' "$1" "${2:-}"; FAILURES=$((FAILURES+1)); }

# THE ANTI-VACUITY GUARD. A control that runs against zero rows proves nothing in either direction.
expect_rows() {
  local label="$1" query="$2" n
  n=$($Q -c "$query")
  [ "${n:-0}" -gt 0 ] || { fail "PRECONDITION $label" "expected rows, found ${n:-0} — the control below would be vacuous"; return 1; }
  return 0
}

denied() {
  local label="$1" precondition="$2" sql="$3"
  expect_rows "$label" "$precondition" || return
  if $Q -q -c "$sql" >/dev/null 2>&1; then fail "$label" "the mutation was ACCEPTED"; else pass "$label"; fi
}

permitted() {
  local label="$1" precondition="$2" sql="$3"
  expect_rows "$label" "$precondition" || return
  if $Q -q -c "$sql" >/dev/null 2>&1; then pass "$label"; else fail "$label" "the mutation was DENIED"; fi
}

echo "[ao] 1/4 the ordinary path stays append-only"
denied "direct DELETE on daily-state history" \
  "select count(*) from yorisou_daily_state_history_events where owner_account_id='por1b';" \
  "delete from yorisou_daily_state_history_events where owner_account_id='por1b';"
denied "direct UPDATE on daily-state history" \
  "select count(*) from yorisou_daily_state_history_events where owner_account_id='por1b';" \
  "update yorisou_daily_state_history_events set version=99 where owner_account_id='por1b';"
denied "direct DELETE on values events" \
  "select count(*) from yorisou_values_assessment_events where owner_account_id='por1b';" \
  "delete from yorisou_values_assessment_events where owner_account_id='por1b';"
denied "direct UPDATE on values events" \
  "select count(*) from yorisou_values_assessment_events where owner_account_id='por1b';" \
  "update yorisou_values_assessment_events set version=99 where owner_account_id='por1b';"
denied "TRUNCATE daily-state history" \
  "select count(*) from yorisou_daily_state_history_events where owner_account_id='por1b';" \
  "truncate yorisou_daily_state_history_events;"

echo "[ao] 2/4 a forged context accomplishes nothing"
JOB_B=$($Q -q -c "insert into yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint, state, execution_cursor, irreversible_started_at) values ('por1b', repeat('b',64), 'requested', null, null) returning id;")
PRE="select count(*) from yorisou_daily_state_history_events where owner_account_id='por1b';"
denied "a random uuid naming no job" "$PRE" \
  "select set_config('yorisou.account_erasure_job_id', gen_random_uuid()::text, true); delete from yorisou_daily_state_history_events where owner_account_id='por1b';"
denied "a setting that is not even a uuid" "$PRE" \
  "select set_config('yorisou.account_erasure_job_id','not-a-uuid',true); delete from yorisou_daily_state_history_events where owner_account_id='por1b';"
denied "a real job that has NOT crossed" "$PRE" \
  "select set_config('yorisou.account_erasure_job_id','$JOB_B',true); delete from yorisou_daily_state_history_events where owner_account_id='por1b';"
$Q -q -c "update yorisou_account_deletion_jobs set irreversible_started_at=now(), execution_cursor='session_revocation' where id='$JOB_B';" >/dev/null
denied "crossed, but the cursor is not database_erasure" "$PRE" \
  "select set_config('yorisou.account_erasure_job_id','$JOB_B',true); delete from yorisou_daily_state_history_events where owner_account_id='por1b';"
$Q -q -c "update yorisou_account_deletion_jobs set execution_cursor='database_erasure' where id='$JOB_B';" >/dev/null
denied "right cursor, but NO frozen manifest" "$PRE" \
  "select set_config('yorisou.account_erasure_job_id','$JOB_B',true); delete from yorisou_daily_state_history_events where owner_account_id='por1b';"

echo "[ao] 3/4 scope isolation — a valid context reaches only its own owner"
JOB_A=$($Q -q -c "insert into yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint, state, execution_cursor, irreversible_started_at) values ('por1a', repeat('a',64), 'database_erasure', 'database_erasure', now()) returning id;")
$Q -q -c "insert into yorisou_account_deletion_manifests (job_id, payload) values ('$JOB_A','{}'::jsonb);" >/dev/null
denied "A's FULLY VALID context deleting B's row" \
  "select count(*) from yorisou_daily_state_history_events where owner_account_id='por1b';" \
  "select set_config('yorisou.account_erasure_job_id','$JOB_A',true); delete from yorisou_daily_state_history_events where owner_account_id='por1b';"
denied "A's valid context, unscoped DELETE" \
  "select count(*) from yorisou_daily_state_history_events where owner_account_id='por1b';" \
  "select set_config('yorisou.account_erasure_job_id','$JOB_A',true); delete from yorisou_daily_state_history_events;"

echo "[ao] 4/4 the governed erasure itself"
A_HIST=$($Q -c "select count(*) from yorisou_daily_state_history_events where owner_account_id='por1a';")
A_YV=$($Q -c "select count(*) from yorisou_values_assessment_events where owner_account_id='por1a';")
B_HIST=$($Q -c "select count(*) from yorisou_daily_state_history_events where owner_account_id='por1b';")
[ "$A_HIST" -gt 0 ] && [ "$A_YV" -gt 0 ] || fail "PRECONDITION erasure" "A must have content before it can be proven erased"
$Q -q -c "select public.yorisou_account_deletion_erase_database('por1a');" >/dev/null 2>&1 \
  && pass "erase_database completed (it raised append_only before this contract existed)" \
  || fail "erase_database" "$($Q -c "select public.yorisou_account_deletion_erase_database('por1a');" 2>&1 | grep -oE 'ERROR.*' | head -1)"

for check in \
  "A daily-state history content|select count(*) from yorisou_daily_state_history_events where owner_account_id='por1a';|0" \
  "A daily-state versions|select count(*) from yorisou_daily_state_record_versions v where exists (select 1 from yorisou_daily_state_records r where r.id=v.record_id and r.owner_account_id='por1a');|0" \
  "A values events content|select count(*) from yorisou_values_assessment_events where owner_account_id='por1a';|0" \
  "A values versions|select count(*) from yorisou_values_assessment_versions v where exists (select 1 from yorisou_values_assessments a where a.id=v.assessment_id and a.owner_account_id='por1a');|0" \
  "B daily-state history preserved|select count(*) from yorisou_daily_state_history_events where owner_account_id='por1b';|$B_HIST"
do
  IFS='|' read -r label query want <<< "$check"
  got=$($Q -c "$query")
  [ "$got" = "$want" ] && pass "$label ($want)" || fail "$label" "expected $want, got $got"
done

echo "[ao] the content-free tombstones"
TOMBS=$($Q -c "select count(*) from yorisou_daily_state_history_events where owner_account_id is null and event_type='deleted';")
[ "$TOMBS" -gt 0 ] && pass "a tombstone was written ($TOMBS)" || fail "tombstone" "none written"
BAD=$($Q -c "select count(*) from yorisou_daily_state_history_events where event_type='deleted' and owner_account_id is null and (version <> 0 or reason_code <> 'user_deleted' or retention_expires_at is null);")
[ "$BAD" = "0" ] && pass "every tombstone is content-free with a retention bound" || fail "tombstone contract" "$BAD violating row(s)"

echo
if [ "$FAILURES" = "0" ]; then echo "[ao] PASS"; else echo "[ao] FAIL — $FAILURES"; exit 1; fi
