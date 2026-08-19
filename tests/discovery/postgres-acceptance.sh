#!/usr/bin/env bash
# DD-1 — Daily Discovery database acceptance, against a real PostgreSQL.
#
# Self-contained on purpose (the tests/life-os/postgres-acceptance.sh discipline): builds a
# throwaway cluster with initdb, applies the real DD-1 migration, proves the schema truths the
# package requires — table, RLS, owner scope, grants, RPC-only mutation, the one-per-owner/day/pack
# invariant, idempotent completion, first-writer-wins under a competing write, and REAL account
# erasure of discovery rows by the actual shipped erasure function — then destroys the cluster.
#
# CI (DD1_DATABASE_URL set): use the runner's PostgreSQL service instead of initdb, guarded to
# ephemeral local targets exactly like the repository's other DSN harnesses.
#
#   bash tests/discovery/postgres-acceptance.sh

set -euo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${DD1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
PORT="${DD1_POSTGRES_PORT:-55719}"
WORK="${DD1_WORK:-/tmp/dd1-acceptance}"
export LC_ALL=C PATH="$PGBIN:$PATH"

FAILURES=0
STARTED_LOCAL=0
cleanup() { set +e; [ "$STARTED_LOCAL" = "1" ] && pg_ctl -D "$WORK/pg" stop >/dev/null 2>&1; rm -rf "$WORK"; }
trap cleanup EXIT
pass() { printf '  ok   %s\n' "$1"; }
fail() { printf '  FAIL %s  %s\n' "$1" "${2:-}"; FAILURES=$((FAILURES+1)); }

mkdir -p "$WORK"
# WORK holds scratch output on BOTH paths. Creating it only in the local branch left the CI branch
# redirecting stderr into a nonexistent directory, which makes psql fail for a reason unrelated to
# SQL. Latent here; it bit the SHR-1 harness in CI, so it is closed in both.
mkdir -p "$WORK"

if [[ -n "${DD1_DATABASE_URL:-}" ]]; then
  DSN="$DD1_DATABASE_URL"
  if [[ "$DSN" == *"supabase.co"* || "$DSN" != *"dd1_acceptance"* ]]; then
    echo "Refusing non-ephemeral database target" >&2; exit 1
  fi
else
  STARTED_LOCAL=1
  rm -rf "$WORK/pg"
  initdb -D "$WORK/pg" -A trust -U postgres >/dev/null
  pg_ctl -D "$WORK/pg" -o "-p $PORT -k $WORK -c listen_addresses=127.0.0.1" -l "$WORK/pg.log" start >/dev/null
  createdb -h 127.0.0.1 -p "$PORT" -U postgres dd1_acceptance
  DSN="postgres://postgres@127.0.0.1:$PORT/dd1_acceptance"
fi

Q() { psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A -c "$1"; }
QF() { psql "$DSN" -v ON_ERROR_STOP=1 -q -f "$1" >/dev/null; }

echo "[dd1] stage 1 — roles + the FULL migration lineage (erasure must run against the true schema)"
psql "$DSN" -v ON_ERROR_STOP=1 -q -c "
  create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";
  do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;
  grant usage on schema public to anon, authenticated, service_role;" >/dev/null
APPLY_FAILURES=0
for f in supabase/migrations/*.sql; do
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null 2>"$WORK/dd1-err.txt" \
    || { fail "apply $(basename "$f")" "$(head -2 "$WORK/dd1-err.txt" | tr '\n' ' ')"; APPLY_FAILURES=$((APPLY_FAILURES+1)); }
done
# Honest, and fail fast: announcing success unconditionally lets a broken apply masquerade as a
# mysterious missing table several stages later.
if [ "$APPLY_FAILURES" -gt 0 ]; then
  echo "[dd1] FAIL — $APPLY_FAILURES migration(s) did not apply; later stages would be meaningless"
  exit 1
fi
pass "applied the full lineage including 202608180001_dd1_daily_discovery_sessions.sql"
QF supabase/migrations/202608180001_dd1_daily_discovery_sessions.sql && pass "re-apply is idempotent"

echo "[dd1] stage 2 — schema truths"
[ "$(Q "select count(*) from pg_tables where schemaname='public' and tablename='yorisou_discovery_sessions'")" = "1" ] \
  && pass "table exists" || fail "table exists"
[ "$(Q "select relrowsecurity from pg_class where relname='yorisou_discovery_sessions'")" = "t" ] \
  && pass "RLS enabled" || fail "RLS enabled"
[ "$(Q "select count(*) from pg_policies where schemaname='public' and tablename='yorisou_discovery_sessions'")" = "0" ] \
  && pass "no user policies (deny-all direct family)" || fail "no user policies"
[ "$(Q "select has_table_privilege('anon','public.yorisou_discovery_sessions','select')")" = "f" ] \
  && pass "anon read denied" || fail "anon read denied"
[ "$(Q "select has_table_privilege('authenticated','public.yorisou_discovery_sessions','select')")" = "f" ] \
  && pass "authenticated read denied" || fail "authenticated read denied"
[ "$(Q "select has_table_privilege('service_role','public.yorisou_discovery_sessions','select')")" = "t" ] \
  && pass "service_role SELECT allowed" || fail "service_role SELECT"
for priv in insert update delete; do
  [ "$(Q "select has_table_privilege('service_role','public.yorisou_discovery_sessions','$priv')")" = "f" ] \
    && pass "service_role direct $priv denied (RPC-only mutation)" || fail "service_role $priv denied"
done
SIG="public.yorisou_discovery_session_complete(text,date,text,text,text,text,text,timestamptz)"
[ "$(Q "select has_function_privilege('anon','$SIG','execute')")" = "f" ] && pass "anon RPC denied" || fail "anon RPC denied"
[ "$(Q "select has_function_privilege('authenticated','$SIG','execute')")" = "f" ] && pass "authenticated RPC denied" || fail "authenticated RPC denied"
[ "$(Q "select has_function_privilege('service_role','$SIG','execute')")" = "t" ] && pass "service_role RPC allowed" || fail "service_role RPC allowed"
[ "$(Q "select proconfig @> array['search_path=public'] from pg_proc where proname='yorisou_discovery_session_complete'")" = "t" ] \
  && pass "fixed RPC search_path" || fail "fixed RPC search_path"

echo "[dd1] stage 3 — one per owner/day/pack, idempotent, first writer wins"
R1=$(Q "select public.yorisou_discovery_session_complete('owner-a','2026-08-18','Asia/Tokyo','pack.x','0.1.0','symbol_draw','light','2026-08-18T03:00:00Z')->>'result_id'")
[ "$R1" = "light" ] && pass "first completion persists" || fail "first completion" "$R1"
R2=$(Q "select public.yorisou_discovery_session_complete('owner-a','2026-08-18','Asia/Tokyo','pack.x','0.1.0','symbol_draw','light','2026-08-18T03:05:00Z')->>'result_id'")
[ "$R2" = "light" ] && pass "retry returns the same canonical result" || fail "retry idempotent" "$R2"
R3=$(Q "select public.yorisou_discovery_session_complete('owner-a','2026-08-18','Asia/Tokyo','pack.x','0.1.0','symbol_draw','stone','2026-08-18T03:06:00Z')->>'result_id'")
[ "$R3" = "light" ] && pass "competing write cannot overwrite: first writer wins" || fail "first writer wins" "$R3"
[ "$(Q "select count(*) from public.yorisou_discovery_sessions where owner_account_id='owner-a'")" = "1" ] \
  && pass "exactly one row for the day" || fail "one row per day"
Q "select public.yorisou_discovery_session_complete('owner-a','2026-08-19','Asia/Tokyo','pack.x','0.1.0','symbol_draw','stone','2026-08-19T03:00:00Z')" >/dev/null
[ "$(Q "select count(*) from public.yorisou_discovery_sessions where owner_account_id='owner-a'")" = "2" ] \
  && pass "a new day creates a new row" || fail "new day new row"
[ "$(Q "select (public.yorisou_discovery_session_complete('owner-a','2026-08-19','Asia/Tokyo','pack.x','0.1.0','symbol_draw','stone','2026-08-19T03:00:00Z')) ? 'owner_account_id'")" = "f" ] \
  && pass "RPC return carries no owner_account_id" || fail "RPC return owner-free"

echo "[dd1] stage 4 — account erasure includes discovery rows"
Q "select public.yorisou_discovery_session_complete('owner-b','2026-08-18','Asia/Tokyo','pack.x','0.1.0','symbol_draw','wave','2026-08-18T04:00:00Z')" >/dev/null
# The shipped erasure is executor-claim-bound: it refuses without a deletion JOB for the owner.
# Seed the job exactly as the life-os acceptance harness does, then run the REAL function body.
Q "insert into public.yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint)
   values ('owner-a', encode(sha256(convert_to('owner-a','utf8')),'hex'))" >/dev/null
Q "select public.yorisou_account_deletion_erase_database_unchecked('owner-a')" >/dev/null
[ "$(Q "select count(*) from public.yorisou_discovery_sessions where owner_account_id='owner-a'")" = "0" ] \
  && pass "erasure removes the owner's discovery rows" || fail "erasure removes rows"
[ "$(Q "select count(*) from public.yorisou_discovery_sessions where owner_account_id='owner-b'")" = "1" ] \
  && pass "erasure touches ONLY the requested owner" || fail "erasure scoped to owner"

echo
if [ "$FAILURES" -gt 0 ]; then echo "[dd1] FAIL ($FAILURES)"; exit 1; fi
echo "[dd1] PASS"
