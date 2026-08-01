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
$PSQL -f tests/por1/fixture-override-registry.sql >/dev/null
for principal in por1a por1b; do
  $PSQL -v principal="$principal" -f tests/por1/seed-owner-linked-families.sql >/dev/null
  # Declared domain overrides run AFTER the generic pass: they need the generically-seeded
  # recommendation set, and they build the graph the generic seeder is not allowed to guess at.
  $PSQL -v principal="$principal" -f tests/por1/fixture-overrides.sql >/dev/null
done
$PSQL -t -A -F' ' -c "
  select principal, count(*) filter (where seeded_rows > 0) as seeded,
         count(*) filter (where seeded_rows = 0) as failed
    from por1_fixture.seeded group by principal order by principal;" | sed 's/^/           /'
# The two counts are kept APART on purpose. An owner-linked contract family that could not be
# populated is a hole in the erasure proof. A supporting table that could not be populated is a
# fixture limitation with no bearing on the contract — conflating them either hides the first or
# makes the gate cry wolf about the second.
OWNER_FAILED=$($PSQL -t -A -c "select count(*) from por1_fixture.seeded where seeded_rows = 0 and owner_column <> '';")
SUPPORT_FAILED=$($PSQL -t -A -c "select count(*) from por1_fixture.seeded where seeded_rows = 0 and owner_column = '';")
if [ "$OWNER_FAILED" != "0" ]; then
  echo "           *** OWNER-LINKED families the fixture could not populate:"
  $PSQL -t -A -F' :: ' -c "select distinct table_name, skipped_reason from por1_fixture.seeded where seeded_rows = 0 and owner_column <> '' order by 1;" | sed 's/^/             /'
fi
if [ "$SUPPORT_FAILED" != "0" ]; then
  echo "           supporting (non-owner-linked) tables not populated — classified, not fatal:"
  $PSQL -t -A -F' :: ' -c "select distinct table_name, skipped_reason from por1_fixture.seeded where seeded_rows = 0 and owner_column = '' order by 1;" | sed 's/^/             /'
fi

# Every DECLARED override must have produced rows. An override that silently inserts nothing turns a
# missing family into a false green, which is the exact failure this whole gate exists to prevent.
OVERRIDE_EMPTY=$($PSQL -t -A -c "
  select count(*) from por1_fixture.override_registry o
   where not exists (select 1 from por1_fixture.seeded s
                      where s.table_name = o.table_name and s.seeded_rows > 0);")
echo "           declared overrides: $($PSQL -t -A -c 'select count(*) from por1_fixture.override_registry;')  empty: $OVERRIDE_EMPTY"

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

# ── NEGATIVE CONTROLS ───────────────────────────────────────────────────────
#
# A fixture that builds a legal graph proves the graph is buildable. It does NOT prove the database
# would have rejected an illegal one — and without that, "the fixture passed" says nothing about
# whether the invariants are real. Each control must fail for the INTENDED reason; a NOT NULL
# violation standing in for a cross-column check would be a false pass.
echo "[rehearsal] 8/9 negative controls"
neg() {
  local label="$1" want="$2" sql="$3"
  local err
  err=$(psql "$DATABASE_URL" -X -q -v ON_ERROR_STOP=1 -c "$sql" 2>&1 >/dev/null) && {
    echo "           *** $label WAS ACCEPTED — the invariant is not enforced"; NEG_FAIL=$((NEG_FAIL+1)); return; }
  if printf '%s' "$err" | grep -q "$want"; then
    echo "           rejected: $label"
  else
    echo "           *** $label rejected for the WRONG reason (wanted $want)"
    printf '%s\n' "$err" | head -2 | sed 's/^/             /'
    NEG_FAIL=$((NEG_FAIL+1))
  fi
}
NEG_FAIL=0
A_SET=$($PSQL -t -A -c "select id from public.yorisou_recommendation_sets where owner_account_id='por1a' order by created_at limit 1;")
B_ITEM=$($PSQL -t -A -c "select i.id from public.yorisou_recommendation_items i join public.yorisou_recommendation_sets s on s.id=i.recommendation_set_id where s.owner_account_id='por1b' limit 1;")
A_RES=$($PSQL -t -A -c "select id from public.yorisou_resources where title='por1-fixture-resource-por1a';")

# 1. The cross-column XOR itself — both sides set.
neg "item with BOTH resource_id and experience_id" "yorisou_recommendation_items_check" \
  "insert into public.yorisou_recommendation_items (project_id,recommendation_set_id,resource_id,experience_id,rank,object_type,reason,disclosure) select 'yorisou','$A_SET','$A_RES', (select id from public.yorisou_experience_cards limit 1), 4,'resource','neg','neg' where exists (select 1 from public.yorisou_experience_cards);"
# 2. and neither side set.
neg "item with NEITHER resource_id nor experience_id" "yorisou_recommendation_items_check" \
  "insert into public.yorisou_recommendation_items (project_id,recommendation_set_id,resource_id,experience_id,rank,object_type,reason,disclosure) values ('yorisou','$A_SET',null,null,5,'small_action','neg','neg');"
# 3. rank outside its declared range.
neg "item with rank outside 1..5" "rank_check" \
  "insert into public.yorisou_recommendation_items (project_id,recommendation_set_id,resource_id,rank,object_type,reason,disclosure) values ('yorisou','$A_SET','$A_RES',9,'resource','neg','neg');"
# 4. an idempotency key shorter than the contract allows.
neg "action with a too-short idempotency key" "idempotency_key_check" \
  "insert into public.yorisou_recommendation_actions (project_id,owner_account_id,recommendation_item_id,action,idempotency_key) values ('yorisou','por1a','$B_ITEM','viewed','short');"
# 5. a duplicate report for the same (owner, item).
neg "duplicate report for the same owner and item" "owner_account_id_recommendati.*_key" \
  "insert into public.yorisou_recommendation_reports (project_id,owner_account_id,recommendation_item_id,reason) select 'yorisou',owner_account_id,recommendation_item_id,'other' from public.yorisou_recommendation_reports where owner_account_id='por1a' limit 1;"

# 6. THE CROSS-PRINCIPAL PAIRING. The database does not forbid this — no constraint relates an
#    action's owner to its item's set owner — so it is the FIXTURE's assertion that must catch it.
#    Proving that assertion fires is what makes 26/26 coverage mean what it claims.
if $PSQL -c "insert into public.yorisou_recommendation_actions (project_id,owner_account_id,recommendation_item_id,action,idempotency_key) values ('yorisou','por1a','$B_ITEM','viewed','por1-neg-crossowner-key-01');" >/dev/null 2>&1; then
  if $PSQL -v principal=por1a -f tests/por1/fixture-overrides.sql >/dev/null 2>&1; then
    echo "           *** cross-principal action NOT caught by the fixture assertion"; NEG_FAIL=$((NEG_FAIL+1))
  else
    echo "           rejected: por1a action against por1b's item (fixture assertion)"
  fi
  $PSQL -c "delete from public.yorisou_recommendation_actions where idempotency_key='por1-neg-crossowner-key-01';" >/dev/null
else
  echo "           *** could not stage the cross-principal action"; NEG_FAIL=$((NEG_FAIL+1))
fi
echo "           negative controls failed: $NEG_FAIL"

echo "[rehearsal] 9/9 result"
if [ "$CHANGED" = "0" ] && [ "$OWNER_FAILED" = "0" ] && [ "$UNSEEDED_N" = "0" ] && [ "$OVERRIDE_EMPTY" = "0" ] && [ "$NEG_FAIL" = "0" ]; then
  echo "           PASS — 26/26 owner-linked contract families populated for both principals;"
  echo "                  populated promotion left every pre-existing row untouched"
  [ "$SUPPORT_FAILED" != "0" ] && echo "                  ($SUPPORT_FAILED supporting table(s) unpopulated and classified above)"
  exit 0
fi
echo "           FAIL — $CHANGED data difference(s) · $OWNER_FAILED owner-linked unpopulated · $UNSEEDED_N contract family/families with no fixture row · $OVERRIDE_EMPTY empty override(s) · $NEG_FAIL negative control(s)"
exit 1
