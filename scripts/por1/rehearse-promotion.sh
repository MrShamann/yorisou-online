#!/usr/bin/env bash
# POR-1 M2 — apply the Production lineage to a DESTROYED-AND-RECREATED local database.
#
# WHY IT DROPS THE DATABASE EVERY TIME.
#
# A rehearsal that runs against whatever was left behind by the previous rehearsal proves only that
# the migrations are idempotent against one particular half-applied state. The question this has to
# answer is different: does a Production database that has never seen POR-1 end up with exactly the
# promoted contract. That question only has an answer from empty.
#
# It creates the Supabase platform roles (anon, authenticated, service_role) first, because the
# promotion's grant blocks are role-conditional — without them every `revoke`/`grant` would be
# skipped and the security assertions would pass by never running.
#
#   scripts/por1/rehearse-promotion.sh [--db <name>] [--keep]
#
# Local only. Refuses any target that is not localhost.

set -euo pipefail

DB="yorisou_por1_rehearsal"
KEEP=0
# Production and Preview both run PostgreSQL 17.6. A rehearsal on 16 is not the same rehearsal: it
# renders `pg_get_constraintdef` differently, which surfaced immediately as a false contract
# mismatch, and it would differ in ways that do NOT announce themselves too. The whole point of
# rehearsing is that the thing rehearsed is the thing shipped.
PGBIN="${POR1_PG_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
PORT="${POR1_PG_PORT:-5433}"
while [ $# -gt 0 ]; do
  case "$1" in
    --db) DB="$2"; shift 2 ;;
    --keep) KEEP=1; shift ;;
    --port) PORT="$2"; shift 2 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

export LC_ALL=C
export PGHOST=localhost
export PGPORT="${PORT}"
[ -d "${PGBIN}" ] && export PATH="${PGBIN}:${PATH}"
PSQL="psql -v ON_ERROR_STOP=1 -q"

server_major="$(psql -d postgres -t -A -c "select split_part(current_setting('server_version'), '.', 1);" 2>/dev/null || true)"
if [ "${server_major}" != "17" ]; then
  echo "refusing to rehearse on PostgreSQL major '${server_major:-unknown}' — Production runs 17" >&2
  echo "start one with: pg_ctl -D /opt/homebrew/var/postgresql@17 -o '-p ${PORT}' start" >&2
  exit 1
fi
echo "  server: $(psql -d postgres -t -A -c "select current_setting('server_version');")"

if [ "${PGHOST}" != "localhost" ] && [ "${PGHOST}" != "127.0.0.1" ]; then
  echo "refusing to run against a non-local host: ${PGHOST}" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

echo "── destroying and recreating ${DB} ────────────────────────────────────────"
$PSQL -d postgres -c "drop database if exists ${DB} with (force);"
$PSQL -d postgres -c "create database ${DB};"

# The platform roles. Supabase provides these; a bare PostgreSQL does not, and their absence would
# silently turn every security assertion in the promotion set into a no-op.
for role in anon authenticated service_role; do
  $PSQL -d postgres -c "do \$\$ begin if not exists (select 1 from pg_roles where rolname='${role}') then create role ${role} nologin; end if; end \$\$;"
done
$PSQL -d "${DB}" -c "create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";"
$PSQL -d "${DB}" -c "grant usage on schema public to anon, authenticated, service_role;"

applied=0
echo
echo "── PRODUCTION BASELINE — the 12 migrations Production already has ─────────"
for f in supabase/migrations/*.sql; do
  base="$(basename "$f")"
  # Below the cohort, not merely outside it: a migration numbered after 202608010111 is not part of
  # the baseline POR-1 is promoted onto, and CPR-1 depends on 202608010105.
  [ "$(echo "$base" | cut -c1-12)" -lt 202608010101 ] || continue
  printf '  %-64s' "$base"
  $PSQL -d "${DB}" -f "$f" >/dev/null
  echo "ok"
  applied=$((applied + 1))
done
echo "  baseline migrations applied: ${applied}"

echo
echo "── PROMOTION — the POR-1 Production lineage ───────────────────────────────"
promoted=0
for f in supabase/migrations/2026080101*.sql; do
  [ -e "$f" ] || { echo "  no promotion migrations found"; exit 1; }
  printf '  %-64s' "$(basename "$f")"
  $PSQL -d "${DB}" -f "$f" >/dev/null
  echo "ok"
  promoted=$((promoted + 1))
done
echo "  promotion migrations applied: ${promoted}"

echo
echo "── SHAPE ──────────────────────────────────────────────────────────────────"
$PSQL -d "${DB}" -t -A -F' ' -c "
  select 'tables', count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relkind='r'
  union all select 'yorisou_functions', count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.prokind='f' and p.proname like 'yorisou_%'
  union all select 'rls_forced', count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relkind='r' and c.relrowsecurity and c.relforcerowsecurity
  union all select 'anon_executable_definer', count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname like 'yorisou_%' and p.prosecdef
      and has_function_privilege('anon', p.oid, 'EXECUTE')
  order by 1;" | sed 's/^/  /'

if [ "${KEEP}" -eq 0 ]; then
  echo
  echo "── destroying ${DB} ───────────────────────────────────────────────────────"
  $PSQL -d postgres -c "drop database if exists ${DB} with (force);"
else
  echo
  echo "  kept: ${DB}"
fi
