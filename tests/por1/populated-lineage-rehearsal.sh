#!/usr/bin/env bash
# POR-1 M2 — the populated Production-lineage rehearsal.
#
# WHAT THIS ANSWERS THAT M1 COULD NOT.
#
# M1 proved the 8 promotion migrations apply to an EMPTY Production baseline and produce exactly the
# promoted contract. That is necessary and it is not the question a release has to answer. Production
# is not empty. It holds real rows in 26 account-owner-linked families, and the promotion runs
# straight through them.
#
# So this builds a Production-shaped database, populates two unrelated principals across every
# owner-linked family the checked-in Production contract names, records exactly what is there, runs
# the promotion, and records it again. The claim under test is that NOTHING about the existing data
# changed — not a row, not an owner, not an ordering.
#
# Fully disposable: its own initdb cluster on its own port, destroyed on exit. It never touches the
# developer's PostgreSQL instances and never contacts a hosted database.
#
#   bash tests/por1/populated-lineage-rehearsal.sh [--keep]

set -euo pipefail
cd "$(dirname "$0")/../.."

PG_PORT="${POR1_REHEARSAL_PORT:-55452}"
PGBIN="${POR1_PG_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
WORK="${POR1_REHEARSAL_WORK:-/tmp/por1-populated-rehearsal}"
PGDIR="$WORK/pg"
DB=por1_populated
KEEP=0
[ "${1:-}" = "--keep" ] && KEEP=1

export LC_ALL=C
export PATH="$PGBIN:$PATH"

cleanup() {
  set +e
  if [ "$KEEP" = "1" ]; then echo "[rehearsal] KEEP — stack left at port $PG_PORT ($WORK)"; return; fi
  pg_ctl -D "$PGDIR" stop >/dev/null 2>&1
  rm -rf "$WORK"
  echo "[rehearsal] disposable cluster destroyed"
}
trap cleanup EXIT

major="$("$PGBIN/postgres" --version | sed -E 's/.* ([0-9]+)\..*/\1/')"
if [ "$major" != "17" ]; then
  echo "refusing: Production runs PostgreSQL 17, this is $major" >&2
  exit 1
fi
if lsof -nP -iTCP:$PG_PORT -sTCP:LISTEN >/dev/null 2>&1; then
  echo "port $PG_PORT is busy — stop the other instance first" >&2
  exit 1
fi

echo "[rehearsal] 1/8 disposable PostgreSQL $("$PGBIN/postgres" --version | awk '{print $3}')"
rm -rf "$WORK"; mkdir -p "$PGDIR"
initdb -D "$PGDIR" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
pg_ctl -D "$PGDIR" -o "-p $PG_PORT -c unix_socket_directories=''" -l "$PGDIR/log" start >/dev/null
sleep 1
createdb -h localhost -p "$PG_PORT" -U postgres "$DB"
export DATABASE_URL="postgres://postgres@localhost:$PG_PORT/$DB"
PSQL="psql $DATABASE_URL -v ON_ERROR_STOP=1 -q -X"

# Supabase parity. `service_role` carries BYPASSRLS on the hosted platform, so write denial rests on
# GRANTS rather than on RLS — creating it without BYPASSRLS here would make the rehearsal prove a
# protection Production does not actually have.
$PSQL -c "create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";"
$PSQL -c "do \$\$ begin create role service_role bypassrls; exception when duplicate_object then null; end \$\$;
          do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
          do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;
          alter role service_role bypassrls;
          grant usage on schema public to anon, authenticated, service_role;"

echo "[rehearsal] 2/8 Production baseline — the 12 migrations Production already has"
baseline=0
for f in supabase/migrations/*.sql; do
  case "$(basename "$f")" in 2026080101*) continue ;; esac
  $PSQL -f "$f" >/dev/null
  baseline=$((baseline + 1))
done
echo "           applied: $baseline"

echo "[rehearsal] 3/8 seeding Principal A and Principal B across every owner-linked family"
for principal in por1a por1b; do
  $PSQL -v principal="$principal" -f tests/por1/seed-owner-linked-families.sql >/dev/null
done
$PSQL -t -A -F' ' -c "
  select principal, count(*) filter (where seeded_rows > 0) as seeded,
         count(*) filter (where seeded_rows = 0) as failed
    from por1_fixture.seeded group by principal order by principal;" | sed 's/^/           /'
FAILED=$($PSQL -t -A -c "select count(*) from por1_fixture.seeded where seeded_rows = 0;")
if [ "$FAILED" != "0" ]; then
  echo "           families the fixture could not populate:"
  $PSQL -t -A -F' :: ' -c "select distinct table_name, skipped_reason from por1_fixture.seeded where seeded_rows = 0 order by 1;" | sed 's/^/             /'
fi

# COVERAGE AGAINST THE CONTRACT, not against what the scan happened to find.
#
# Reporting "23 families seeded" is not the same claim as "every family in the Production contract
# was seeded", and the difference is exactly where an erasure proof goes wrong: a family nobody
# populated produces a zero after-count that reads identically to a family that was erased.
node -e '
  const fs = require("fs");
  const contract = JSON.parse(fs.readFileSync("supabase/contracts/por1-production-owner-linked-families.json", "utf8"));
  fs.writeFileSync(process.argv[1], contract.families.join("\n") + "\n");
' "$WORK/contract-families.txt"
$PSQL -t -A -c "select distinct table_name from por1_fixture.seeded where seeded_rows > 0 order by 1;" > "$WORK/seeded-families.txt"
UNSEEDED=$(comm -23 <(sort "$WORK/contract-families.txt") <(sort "$WORK/seeded-families.txt"))
UNSEEDED_N=$(printf '%s' "$UNSEEDED" | grep -c . || true)
echo "           contract families: $(wc -l < "$WORK/contract-families.txt" | tr -d ' ')  seeded: $(wc -l < "$WORK/seeded-families.txt" | tr -d ' ')  unseeded: $UNSEEDED_N"
if [ "$UNSEEDED_N" != "0" ]; then
  echo "           *** CONTRACT FAMILIES WITH NO FIXTURE ROW:"
  printf '%s\n' "$UNSEEDED" | sed 's/^/             /'
fi

echo "[rehearsal] 4/8 pre-promotion manifest"
manifest() {
  psql "$DATABASE_URL" -t -A -X -F'|' -c "
    select c.relname,
           (xpath('/row/c/text()',
              query_to_xml(format('select count(*) as c from public.%I', c.relname), false, true, '')))[1]::text::int
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relkind = 'r' and c.relname like 'yorisou%'
     order by c.relname;"
}
manifest > "$WORK/pre.txt"
echo "           tables recorded: $(wc -l < "$WORK/pre.txt" | tr -d ' ')  rows: $(awk -F'|' '{s+=$2} END{print s}' "$WORK/pre.txt")"

# A row-count manifest alone would miss an in-place rewrite. Structural hashes over every owner-linked
# family's full contents catch a changed value, a reassigned owner, or a reordered sequence.
fingerprint() {
  psql "$DATABASE_URL" -t -A -X -F'|' -c "
    select s.table_name,
           md5((xpath('/row/c/text()',
             query_to_xml(format('select coalesce(string_agg(t::text, chr(10) order by t::text), ''(empty)'') as c from public.%I t', s.table_name),
                          false, true, '')))[1]::text)
      from (select distinct table_name from por1_fixture.seeded) s
     order by s.table_name;"
}
fingerprint > "$WORK/pre-fingerprint.txt"

echo "[rehearsal] 5/8 applying the 8 promotion migrations onto POPULATED data"
promoted=0
for f in supabase/migrations/2026080101*.sql; do
  printf '           %-62s' "$(basename "$f")"
  $PSQL -f "$f" >/dev/null
  echo "ok"
  promoted=$((promoted + 1))
done

echo "[rehearsal] 6/8 post-promotion manifest and comparison"
manifest > "$WORK/post.txt"
fingerprint > "$WORK/post-fingerprint.txt"

# Promotion ADDS tables, so the pre-existing set must be a prefix-compatible subset: every table that
# existed before must still exist with the same count and the same contents.
CHANGED=0
while IFS='|' read -r t before; do
  after=$(grep -E "^${t}\|" "$WORK/post.txt" | head -1 | cut -d'|' -f2)
  if [ -z "$after" ]; then echo "           *** TABLE DISAPPEARED: $t"; CHANGED=$((CHANGED+1));
  elif [ "$before" != "$after" ]; then echo "           *** ROW COUNT CHANGED: $t  $before -> $after"; CHANGED=$((CHANGED+1)); fi
done < "$WORK/pre.txt"

if ! diff -q "$WORK/pre-fingerprint.txt" "$WORK/post-fingerprint.txt" >/dev/null; then
  echo "           *** CONTENT FINGERPRINT CHANGED:"
  diff "$WORK/pre-fingerprint.txt" "$WORK/post-fingerprint.txt" | sed 's/^/             /'
  CHANGED=$((CHANGED+1))
fi
echo "           pre-existing tables unchanged: $([ "$CHANGED" = "0" ] && echo YES || echo "NO ($CHANGED difference(s))")"

echo "[rehearsal] 7/8 promoted contract and effective privileges"
node scripts/por1/extract-catalogue.mjs --dsn "$DATABASE_URL" --out "$WORK/catalogue.json" >/dev/null
node scripts/por1/verify-promoted-contract.mjs --catalogue "$WORK/catalogue.json" | tail -2 | sed 's/^/           /'

$PSQL -t -A -F' ' -c "
  select 'anon_executable_definer', count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname like 'yorisou_%' and p.prosecdef
      and has_function_privilege('anon', p.oid, 'EXECUTE')
  union all select 'authenticated_executable_definer', count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname like 'yorisou_%' and p.prosecdef
      and has_function_privilege('authenticated', p.oid, 'EXECUTE')
  union all select 'public_executable_definer', count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname like 'yorisou_%' and p.prosecdef
      and has_function_privilege('public', p.oid, 'EXECUTE')
  union all select 'rls_forced_promoted', count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relkind='r' and c.relrowsecurity and c.relforcerowsecurity
  order by 1;" | sed 's/^/           /'

echo "[rehearsal] 8/8 result"
if [ "$CHANGED" = "0" ] && [ "$FAILED" = "0" ] && [ "$UNSEEDED_N" = "0" ]; then
  echo "           PASS — every contract family populated; populated promotion left every pre-existing row untouched"
else
  echo "           FAIL — $CHANGED data difference(s), $FAILED unpopulated family/families, $UNSEEDED_N contract family/families with no fixture row"
  exit 1
fi
