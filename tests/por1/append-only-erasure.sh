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
# MIGRATIONS ARE APPLIED IN CANONICAL LINEAGE ORDER. THAT IS NOT A DETAIL.
#
# This loop used to skip the POR-1 `2026080101*` cohort and replay it at the very end, after every
# later migration. That was invisible for as long as nothing downstream depended on the cohort, and
# it broke the moment one did: CPR-1 (202608190001) references yorisou_account_mutation_leases, which
# 202608010105 creates, so replaying the cohort last made CPR-1 fail with
#
#     ERROR: relation "public.yorisou_account_mutation_leases" does not exist
#
# and — because the old loop discarded stderr and `set -e` killed the run before its first echo — the
# whole harness exited silently with no output at all. A gate that dies before saying anything is
# worse than a red one, so failures are now reported rather than swallowed.
#
# The grant the cohort needs is kept at exactly the point it always occupied: immediately before the
# first cohort migration. Nothing about what this file tests has changed; only the order it builds
# the database in, which is now the same order Production applies.
APPLIED_ORDER=()
GRANTED_BEFORE_COHORT=0
for f in supabase/migrations/*.sql; do
  b="$(basename "$f")"
  case "$b" in
    2026080101*)
      if [ "$GRANTED_BEFORE_COHORT" = "0" ]; then
        $Q -q -c "grant all on all tables in schema public to service_role; grant all on all sequences in schema public to service_role;" >/dev/null
        GRANTED_BEFORE_COHORT=1
      fi
      ;;
  esac
  if ! $Q -q -f "$f" >/dev/null 2>"$WORK/apply.err"; then
    echo "[ao] MIGRATION FAILED TO APPLY: $b" >&2
    grep -oE 'ERROR.*' "$WORK/apply.err" | head -2 >&2
    exit 1
  fi
  APPLIED_ORDER+=("$b")
done
[ "$GRANTED_BEFORE_COHORT" = "1" ] || { echo "[ao] the POR-1 cohort vanished from the lineage" >&2; exit 1; }

# REGRESSION GUARD — the order this harness applied must BE the canonical lineage order.
#
# Without this, any future reintroduction of a skip-and-replay shortcut goes unnoticed until some
# later migration happens to depend on a deferred one. Comparing the recorded order against the
# sorted listing makes that class of defect fail here, immediately, instead of years downstream.
CANONICAL_ORDER=()
while IFS= read -r line; do CANONICAL_ORDER+=("$line"); done < <(ls supabase/migrations/*.sql | xargs -n1 basename | sort)
if [ "${APPLIED_ORDER[*]}" != "${CANONICAL_ORDER[*]}" ]; then
  echo "[ao] MIGRATIONS WERE NOT APPLIED IN CANONICAL LINEAGE ORDER" >&2
  diff <(printf '%s\n' "${APPLIED_ORDER[@]}") <(printf '%s\n' "${CANONICAL_ORDER[@]}") | head -10 >&2
  exit 1
fi
echo "[ao] ${#APPLIED_ORDER[@]} migrations applied in canonical lineage order on PostgreSQL $("$PGBIN/postgres" --version | awk '{print $3}')"

$Q -q -f tests/por1/fixture-override-registry.sql >/dev/null 2>&1
for p in por1a por1b por1p; do
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

# B's baseline, taken before ANY control runs. B is the bystander: nothing in this suite — no denied
# mutation, no exact-job case, no erasure — may change a single one of its rows. Capturing it here
# rather than at the end is what makes the assertion mean "unchanged by everything above".
B_BASE=$($Q -c "select count(*) from yorisou_daily_state_history_events where owner_account_id='por1b';")
B_FP_BASE=$($Q -c "select coalesce(md5(string_agg(t::text, ',' order by t::text)),'(empty)') from yorisou_daily_state_history_events t where owner_account_id='por1b';")
[ "$B_BASE" -gt 0 ] || fail "PRECONDITION B baseline" "B must start with rows or preservation proves nothing"

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
$Q -q -c "update yorisou_account_deletion_jobs set executor_token_hash=repeat('d',64), executor_expires_at=now()+interval '5 minutes' where id='$JOB_A';" >/dev/null
$Q -q -c "insert into yorisou_account_deletion_manifests (job_id, payload) values ('$JOB_A','{}'::jsonb);" >/dev/null
denied "A's FULLY VALID context deleting B's row" \
  "select count(*) from yorisou_daily_state_history_events where owner_account_id='por1b';" \
  "select set_config('yorisou.account_erasure_job_id','$JOB_A',true); delete from yorisou_daily_state_history_events where owner_account_id='por1b';"
denied "A's valid context, unscoped DELETE" \
  "select count(*) from yorisou_daily_state_history_events where owner_account_id='por1b';" \
  "select set_config('yorisou.account_erasure_job_id','$JOB_A',true); delete from yorisou_daily_state_history_events;"

echo "[ao] 3b/4 EXECUTOR-BOUND AUTHORITY — a live claim held by someone else is not authority"
# Every job below sits at cursor=database_erasure, with its own frozen manifest and the irreversible
# boundary crossed. What differs is the job STATE and the CALLER'S proof of the executor claim. That
# proof is the whole subject: 110 asked only whether a claim existed, which let a second worker erase
# under a claim it did not hold, and let a superseded generation land after a reclaim.
TOK_A=$(printf 'a%.0s' $(seq 1 64))   # the claim actually recorded on the job
TOK_X=$(printf 'x%.0s' $(seq 1 64))   # a different live executor's token, same length
setup_job() {  # owner, state, claim(live|expired|none), [token], [generation]
  local owner="$1" state="$2" claim="$3" tok="${4:-$TOK_A}" gen="${5:-7}"
  $Q -q -c "delete from yorisou_account_deletion_manifests where job_id in (select id from yorisou_account_deletion_jobs where owner_account_id='$owner');
            delete from yorisou_account_deletion_jobs where owner_account_id='$owner';" >/dev/null
  local jid
  jid=$($Q -q -c "insert into yorisou_account_deletion_jobs
     (owner_account_id, owner_fingerprint, state, execution_cursor, irreversible_started_at,
      executor_token_hash, executor_generation, executor_expires_at)
   values ('$owner', repeat('b',64), '$state', 'database_erasure', now(),
      case when '$claim'='none' then null else '$tok' end, $gen,
      case when '$claim'='live' then now() + interval '5 minutes'
           when '$claim'='expired' then now() - interval '5 minutes' else null end)
   returning id;")
  $Q -q -c "insert into yorisou_account_deletion_manifests (job_id, payload) values ('$jid','{}'::jsonb);" >/dev/null
  echo "$jid"
}
# The three context values the erasure RPC sets after locking and validating. A control forges them
# directly, which is the strongest position an attacker who already has database access can occupy.
ctx() { echo "select set_config('yorisou.account_erasure_job_id','$1',true), set_config('yorisou.account_erasure_executor_token_hash','$2',true), set_config('yorisou.account_erasure_executor_generation','$3',true);"; }
B_PRE="select count(*) from yorisou_daily_state_history_events where owner_account_id='por1b';"
DEL_B="delete from yorisou_daily_state_history_events where owner_account_id='por1b';"

# ── job state and lease ──────────────────────────────────────────────────────
for case in "completed|live|a COMPLETED job at the erasure cursor" \
            "cancelled|live|a CANCELLED job at the erasure cursor" \
            "failed_terminal|live|a FAILED_TERMINAL job at the erasure cursor" \
            "legal_hold|live|a job under LEGAL HOLD" \
            "requested|live|a job that never reached erasure" \
            "database_erasure|expired|an EXPIRED executor claim" \
            "database_erasure|none|NO executor claim at all"
do
  IFS='|' read -r st cl label <<< "$case"
  # `completed` requires a null owner by constraint, so those states are exercised where legal.
  JID=$(setup_job "por1b" "$st" "$cl" 2>/dev/null) || { printf '  ok   %s (state not representable with an owner — constraint already forbids it)\n' "$label"; continue; }
  denied "$label" "$B_PRE"  "$(ctx "$JID" "$TOK_A" 7) $DEL_B"
done

# ── the executor identity itself ─────────────────────────────────────────────
JID_B=$(setup_job "por1b" "database_erasure" "live")
OTHER=$($Q -q -c "insert into yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint, state, execution_cursor, irreversible_started_at, executor_token_hash, executor_generation, executor_expires_at) values ('por1o', repeat('o',64),'database_erasure','database_erasure',now(),'$TOK_X',7,now()+interval '5 minutes') returning id;")
$Q -q -c "insert into yorisou_account_deletion_manifests (job_id,payload) values ('$OTHER','{}'::jsonb);" >/dev/null

denied "correct job and owner, WRONG executor token"          "$B_PRE"  "$(ctx "$JID_B" "$TOK_X" 7) $DEL_B"
denied "correct job and owner, STALE generation"              "$B_PRE"  "$(ctx "$JID_B" "$TOK_A" 6) $DEL_B"
denied "correct job and owner, a FUTURE generation"           "$B_PRE"  "$(ctx "$JID_B" "$TOK_A" 8) $DEL_B"
denied "a DIFFERENT live executor's token and generation"     "$B_PRE"  "$(ctx "$JID_B" "$TOK_X" 7) $DEL_B"
denied "a WRONG job id with otherwise correct credentials"    "$B_PRE"  "$(ctx "$OTHER" "$TOK_X" 7) $DEL_B"
denied "the job id ALONE, as 110 would have accepted"         "$B_PRE"  "select set_config('yorisou.account_erasure_job_id','$JID_B',true); $DEL_B"
denied "token and generation but NO job id"                   "$B_PRE"  "select set_config('yorisou.account_erasure_executor_token_hash','$TOK_A',true), set_config('yorisou.account_erasure_executor_generation','7',true); $DEL_B"
denied "a released claim (token cleared on the job)"          "$B_PRE"  "update yorisou_account_deletion_jobs set executor_token_hash=null where id='$JID_B'; $(ctx "$JID_B" "$TOK_A" 7) $DEL_B"
denied "a valid job, but the manifest belongs to ANOTHER job" "$B_PRE"  "delete from yorisou_account_deletion_manifests where job_id='$JID_B'; $(ctx "$JID_B" "$TOK_A" 7) $DEL_B"

for cur in "mutation_draining|the cursor is BEFORE database_erasure" "verifying|the cursor is PAST database_erasure"; do
  IFS='|' read -r c label <<< "$cur"
  $Q -q -c "update yorisou_account_deletion_jobs set execution_cursor='$c' where id='$JID_B';" >/dev/null
  denied "$label" "$B_PRE" "$(ctx "$JID_B" "$TOK_A" 7) $DEL_B"
done
$Q -q -c "update yorisou_account_deletion_jobs set execution_cursor='database_erasure', irreversible_started_at=null where id='$JID_B';" >/dev/null
denied "the irreversible boundary was never crossed" "$B_PRE" "$(ctx "$JID_B" "$TOK_A" 7) $DEL_B"

# The permitted case CONSUMES the rows it deletes, so it runs against a DEDICATED principal. Every
# case above is a denial and leaves B intact; this one would not. Pointing it at B would leave the
# end-of-suite preservation assertion comparing 0 to 0 — vacuously green, the exact failure mode this
# suite exists to refuse.
JID_P=$(setup_job "por1p" "database_erasure" "live")
P_PRE="select count(*) from yorisou_daily_state_history_events where owner_account_id='por1p';"
permitted "the exact job AND the exact live claim CAN erase" "$P_PRE"  "$(ctx "$JID_P" "$TOK_A" 7) delete from yorisou_daily_state_history_events where owner_account_id='por1p';"

echo "[ao] 3c/4 the weaker entry points are GONE, not merely revoked"
for sig in "yorisou_account_deletion_erase_database(text)" \
           "yorisou_account_deletion_erase_database(uuid,text)" \
           "yorisou_account_erasure_job_valid(uuid,text)"
do
  n=$($Q -c "select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname||'('||pg_get_function_identity_arguments(p.oid)||')' = replace('$sig',',',', ');")
  [ "${n:-1}" = "0" ] && pass "$sig no longer exists" || fail "$sig" "still present ($n)"
done
# service_role is the role the application connects as. The unchecked body must be unreachable by it.
for fn in "yorisou_account_deletion_erase_database_unchecked(text)" "yorisou_account_erase_append_only_families(text,uuid)"; do
  g=$($Q -c "select coalesce(has_function_privilege('service_role','public.$fn','execute')::text,'?');" 2>/dev/null)
  [ "$g" = "false" ] && pass "service_role cannot execute $fn" || fail "$fn" "service_role EXECUTE = $g"
done
g=$($Q -c "select has_function_privilege('service_role','public.yorisou_account_deletion_erase_database(uuid,text,text,integer)','execute')::text;")
[ "$g" = "true" ] && pass "service_role CAN execute the claim-bound signature" || fail "claim-bound grant" "$g"

$Q -q -c "delete from yorisou_account_deletion_manifests where job_id in (select id from yorisou_account_deletion_jobs where owner_account_id in ('por1b','por1o')); delete from yorisou_account_deletion_jobs where owner_account_id in ('por1b','por1o');" >/dev/null

echo "[ao] 4/4 the governed erasure itself"
JID_A=$(setup_job "por1a" "database_erasure" "live")
A_HIST=$($Q -c "select count(*) from yorisou_daily_state_history_events where owner_account_id='por1a';")
A_YV=$($Q -c "select count(*) from yorisou_values_assessment_events where owner_account_id='por1a';")

[ "$A_HIST" -gt 0 ] && [ "$A_YV" -gt 0 ] || fail "PRECONDITION erasure" "A must have content before it can be proven erased"
ERASE="select public.yorisou_account_deletion_erase_database('$JID_A','por1a','$TOK_A',7);"
$Q -q -c "$ERASE" >/dev/null 2>&1 \
  && pass "the claim-bound erase_database completed" \
  || fail "erase_database" "$($Q -c "$ERASE" 2>&1 | grep -oE 'ERROR.*' | head -1)"

for check in \
  "A daily-state history content|select count(*) from yorisou_daily_state_history_events where owner_account_id='por1a';|0" \
  "A daily-state versions|select count(*) from yorisou_daily_state_record_versions v where exists (select 1 from yorisou_daily_state_records r where r.id=v.record_id and r.owner_account_id='por1a');|0" \
  "A values events content|select count(*) from yorisou_values_assessment_events where owner_account_id='por1a';|0" \
  "A values versions|select count(*) from yorisou_values_assessment_versions v where exists (select 1 from yorisou_values_assessments a where a.id=v.assessment_id and a.owner_account_id='por1a');|0" \
  "B daily-state history preserved|select count(*) from yorisou_daily_state_history_events where owner_account_id='por1b';|$B_BASE"
do
  IFS='|' read -r label query want <<< "$check"
  got=$($Q -c "$query")
  [ "$got" = "$want" ] && pass "$label ($want)" || fail "$label" "expected $want, got $got"
done

B_FP_NOW=$($Q -c "select coalesce(md5(string_agg(t::text, ',' order by t::text)),'(empty)') from yorisou_daily_state_history_events t where owner_account_id='por1b';")
[ "$B_FP_NOW" = "$B_FP_BASE" ] && pass "B's full-content fingerprint is unchanged" || fail "B fingerprint" "changed"

echo "[ao] the content-free tombstones"
TOMBS=$($Q -c "select count(*) from yorisou_daily_state_history_events where owner_account_id is null and event_type='deleted';")
[ "$TOMBS" -gt 0 ] && pass "a tombstone was written ($TOMBS)" || fail "tombstone" "none written"
BAD=$($Q -c "select count(*) from yorisou_daily_state_history_events where event_type='deleted' and owner_account_id is null and (version <> 0 or reason_code <> 'user_deleted' or retention_expires_at is null);")
[ "$BAD" = "0" ] && pass "every tombstone is content-free with a retention bound" || fail "tombstone contract" "$BAD violating row(s)"

echo
if [ "$FAILURES" = "0" ]; then echo "[ao] PASS"; else echo "[ao] FAIL — $FAILURES"; exit 1; fi
