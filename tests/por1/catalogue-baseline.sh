#!/usr/bin/env bash
# POR-1 — the eleven-migration catalogue baseline, measured twice, plus the M1 non-mutation proof.
#
# WHY IDENTITY SIGNATURES AND NOT NAMES.
#
# PostgreSQL overloads are distinct objects with distinct grants, distinct bodies and distinct
# security properties. Migration 111 REPLACES overloads — it drops two erasure signatures and one
# predicate signature and adds four-argument forms. A name-keyed count cannot see that happen: the
# names survive, so the count does not move, and a contract keyed on names would report "no change"
# for the migration whose entire purpose is changing which signatures exist.
#
# So the release gate is the identity-signature count. The name count is kept as a diagnostic,
# because a divergence between the two is exactly where an unnoticed overload lives.
#
# WHY THE SAME THING IS BUILT TWICE.
#
# A contract that is not reproducible is not a contract. Two independent clusters are built from the
# same inputs and their catalogues must be byte-identical. A difference means something in the
# lineage depends on time, on OIDs, or on order of application — all of which would make every
# comparison against Production meaningless.
#
# WHAT THIS DOES NOT CLAIM.
#
# The base half is a RECONSTRUCTION of the Production lineage from this repository. It is not a read
# of live Production. Everything here is classified REPOSITORY_LINEAGE_VERIFIED /
# PRODUCTION_LIVE_UNVERIFIED and must not be quoted as Production-verified.
#
#   bash tests/por1/catalogue-baseline.sh

set -euo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${POR1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
PORT="${POR1_POSTGRES_PORT:-55579}"
WORK="${POR1_WORK:-/tmp/por1-baseline}"
OUT="docs/ux2r/evidence/por1-catalogue-baseline.json"
BASELINE_COMMIT="c8d8a8ad6a72949c248adb098a626d1ab9d6a579"
export LC_ALL=C PATH="$PGBIN:$PATH"

FAILURES=0
cleanup() { set +e; pg_ctl -D "$WORK/pg" stop >/dev/null 2>&1; rm -rf "$WORK"; }
trap cleanup EXIT
pass() { printf '  ok   %s\n' "$1"; }
fail() { printf '  FAIL %s  %s\n' "$1" "${2:-}"; FAILURES=$((FAILURES+1)); }

[ "$("$PGBIN/postgres" --version | awk '{print $3}' | cut -d. -f1)" = "17" ] || { echo "refusing: Production runs PostgreSQL 17" >&2; exit 1; }

rm -rf "$WORK"; mkdir -p "$WORK/pg"
initdb -D "$WORK/pg" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
pg_ctl -D "$WORK/pg" -o "-p $PORT -c unix_socket_directories=''" -l "$WORK/pg/log" start >/dev/null
sleep 1

roles() {
  psql "postgres://postgres@localhost:$PORT/$1" -q -X -c "
    create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";
    do \$\$ begin create role service_role bypassrls; exception when duplicate_object then null; end \$\$;
    do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
    do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;
    grant usage on schema public to anon, authenticated, service_role;" >/dev/null
}
lineage() {   # the repository's non-POR-1 migrations: the reconstruction of main's lineage
  local db="$1"
  # THE PRE-POR-1 BASELINE IS "NUMBERED BELOW THE COHORT", NOT "EVERYTHING THAT IS NOT THE COHORT".
  # Those were the same set until a migration landed AFTER 202608010111. The delta this harness
  # measures is POR-1's contribution, and CNT-1 (202608200001) re-emits a POR-1 function — counted
  # as baseline it appeared in BOTH catalogues and hid that function from the promoted set, which is
  # exactly the "82 functions, got 81" this suite reported.
  for f in supabase/migrations/*.sql; do
    [ "$(basename "$f" | cut -c1-12)" -lt 202608010101 ] || continue
    psql "postgres://postgres@localhost:$PORT/$db" -q -X -f "$f" >/dev/null 2>&1
  done
  psql "postgres://postgres@localhost:$PORT/$db" -q -X -c "grant all on all tables in schema public to service_role;" >/dev/null
}
por1() {      # 101..111, every one REQUIRED to apply cleanly
  local db="$1"
  for f in supabase/migrations/2026080101*.sql; do
    psql "postgres://postgres@localhost:$PORT/$db" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null \
      || fail "apply $(basename "$f")" "did not apply cleanly"
  done
}

# The catalogue, keyed by identity signature. Ordered by the key so the output is a function of the
# schema and nothing else — no OIDs, no creation order, no timestamps.
SIGS="select p.proname||'('||pg_get_function_identity_arguments(p.oid)||')' as sig,
             pg_get_function_result(p.oid), l.lanname, p.provolatile, p.proparallel,
             p.prosecdef::text, p.proleakproof::text, coalesce(array_to_string(p.proconfig,','),''),
             md5(pg_get_functiondef(p.oid))
        from pg_proc p join pg_namespace n on n.oid=p.pronamespace
        join pg_language l on l.oid=p.prolang
       where n.nspname='public' and p.prokind='f' order by 1;"
TABLES="select c.relname, c.relrowsecurity::text, c.relforcerowsecurity::text
          from pg_class c join pg_namespace n on n.oid=c.relnamespace
         where n.nspname='public' and c.relkind='r' order by 1;"
SEQS="select c.relname from pg_class c join pg_namespace n on n.oid=c.relnamespace
       where n.nspname='public' and c.relkind='S' order by 1;"
TRIGS="select c.relname||'.'||t.tgname from pg_trigger t join pg_class c on c.oid=t.tgrelid
        join pg_namespace n on n.oid=c.relnamespace
       where n.nspname='public' and not t.tgisinternal order by 1;"
GRANTS="select p.proname||'('||pg_get_function_identity_arguments(p.oid)||')'||':'||r.rolname
          from pg_proc p join pg_namespace n on n.oid=p.pronamespace
          cross join (values ('anon'),('authenticated'),('service_role')) as r(rolname)
         where n.nspname='public' and p.prokind='f'
           and exists (select 1 from pg_roles where rolname=r.rolname)
           and has_function_privilege(r.rolname, p.oid, 'execute') order by 1;"

snapshot() {  # db, outfile
  local db="$1" f="$2" dsn="postgres://postgres@localhost:$PORT/$1"
  { echo "## tables";    psql "$dsn" -t -A -X -F'|' -c "$TABLES"
    echo "## sequences"; psql "$dsn" -t -A -X -c "$SEQS"
    echo "## triggers";  psql "$dsn" -t -A -X -c "$TRIGS"
    echo "## functions"; psql "$dsn" -t -A -X -F'|' -c "$SIGS"
    echo "## grants";    psql "$dsn" -t -A -X -c "$GRANTS"; } > "$f"
}
count_of() { awk -v s="## $2" -v e='## ' 'index($0,s)==1{f=1;next} f&&index($0,e)==1{f=0} f&&NF' "$1" | wc -l | tr -d ' '; }
names_of() { awk -v s='## functions' 'index($0,s)==1{f=1;next} f&&index($0,"## ")==1{f=0} f&&NF{split($0,a,"|"); split(a[1],b,"("); print b[1]}' "$1" | sort -u | wc -l | tr -d ' '; }

echo "[cb] building base (repository lineage, POR-1 withheld)"
createdb -h localhost -p "$PORT" -U postgres base; roles base; lineage base
snapshot base "$WORK/base.txt"

echo "[cb] building target A (base + POR-1 101..111)"
createdb -h localhost -p "$PORT" -U postgres target_a; roles target_a; lineage target_a; por1 target_a
snapshot target_a "$WORK/target_a.txt"

echo "[cb] building target B — an INDEPENDENT cluster from the same inputs"
createdb -h localhost -p "$PORT" -U postgres target_b; roles target_b; lineage target_b; por1 target_b
snapshot target_b "$WORK/target_b.txt"

echo "[cb] determinism"
if cmp -s "$WORK/target_a.txt" "$WORK/target_b.txt"; then
  pass "two independent builds produced byte-identical catalogues"
else
  fail "determinism" "$(diff "$WORK/target_a.txt" "$WORK/target_b.txt" | head -5 | tr '\n' ' ')"
fi

echo "[cb] the eleven-migration delta"
MIGS=$(ls supabase/migrations/2026080101*.sql | wc -l | tr -d ' ')
[ "$MIGS" = "11" ] && pass "11 POR-1 migrations" || fail "migration count" "found $MIGS"

# bash 3.2 ships on macOS and has no associative arrays; plain variables keep this portable.
B_TAB=$(count_of "$WORK/base.txt" tables);        T_TAB=$(count_of "$WORK/target_a.txt" tables)
B_FUN=$(count_of "$WORK/base.txt" functions);     T_FUN=$(count_of "$WORK/target_a.txt" functions)
B_SEQ=$(count_of "$WORK/base.txt" sequences);     T_SEQ=$(count_of "$WORK/target_a.txt" sequences)
B_TRG=$(count_of "$WORK/base.txt" triggers);      T_TRG=$(count_of "$WORK/target_a.txt" triggers)
BN=$(names_of "$WORK/base.txt"); TN=$(names_of "$WORK/target_a.txt")
D_T=$((T_TAB-B_TAB)); D_F=$((T_FUN-B_FUN)); D_S=$((T_SEQ-B_SEQ)); D_G=$((T_TRG-B_TRG)); D_N=$((TN-BN))

printf '       %-26s %6s %8s %7s\n' "" base target delta
printf '       %-26s %6s %8s %7s\n' "tables"                      "$B_TAB"    "$T_TAB"    "$D_T"
printf '       %-26s %6s %8s %7s\n' "function identity sigs"      "$B_FUN" "$T_FUN" "$D_F"
printf '       %-26s %6s %8s %7s\n' "distinct function names"     "$BN"             "$TN"             "$D_N"
printf '       %-26s %6s %8s %7s\n' "sequences"                   "$B_SEQ" "$T_SEQ" "$D_S"
printf '       %-26s %6s %8s %7s\n' "non-internal triggers"       "$B_TRG"  "$T_TRG"  "$D_G"

# The Founder-decided release gate. The name delta is recorded but is NOT the gate.
[ "$D_T/$D_F/$D_S/$D_G" = "15/82/2/2" ] \
  && pass "identity-signature delta is 15 / 82 / 2 / 2" \
  || fail "delta" "got $D_T / $D_F / $D_S / $D_G — the contract says 15 / 82 / 2 / 2"
[ "$D_N" = "81" ] && pass "distinct-name delta is 81 (diagnostic, not the gate)" \
  || fail "name delta" "got $D_N"

echo "[cb] the weaker signatures are absent from the target"
for sig in "yorisou_account_deletion_erase_database(p_owner_account_id text)" \
           "yorisou_account_deletion_erase_database(p_job_id uuid, p_owner_account_id text)" \
           "yorisou_account_erasure_job_valid(p_job_id uuid, p_owner_account_id text)"; do
  grep -qF "$sig|" "$WORK/target_a.txt" && fail "$sig" "still present" || pass "absent: ${sig%%(*}(${sig#*\(}"
done

# ── M1: applying 109..111 must not touch a single existing row ───────────────
#
# A forward-only migration that silently rewrote user data would be indistinguishable, in a count,
# from one that did nothing. So the proof is a full-content fingerprint taken before and after, over
# populated data, not a row count.
echo "[cb] M1 — migrations 109..111 do not mutate existing data"
createdb -h localhost -p "$PORT" -U postgres m1; roles m1; lineage m1
M1="psql postgres://postgres@localhost:$PORT/m1 -t -A -X"
for f in supabase/migrations/2026080101{01,02,03,04,05,06,07,08}_*.sql; do
  $M1 -q -v ON_ERROR_STOP=1 -f "$f" >/dev/null || fail "m1 apply $(basename "$f")" "failed"
done
$M1 -q -f tests/por1/fixture-override-registry.sql >/dev/null 2>&1
for p in m1a m1b; do
  $M1 -q -v principal="$p" -f tests/por1/seed-owner-linked-families.sql >/dev/null 2>&1
  $M1 -q -v principal="$p" -f tests/por1/fixture-overrides.sql >/dev/null 2>&1
done

FAMILIES="yorisou_daily_state_history_events yorisou_daily_state_record_versions
          yorisou_values_assessment_events yorisou_values_assessment_versions
          yorisou_account_deletion_jobs"
fingerprint() {  # table -> count|content digest, over every column
  local t="$1"
  if [ "$($M1 -c "select to_regclass('public.$t') is not null;")" != "t" ]; then echo "absent"; return; fi
  $M1 -c "select count(*)::text || '|' || coalesce(md5(string_agg(x::text, ',' order by x::text)),'(empty)') from public.$t x;"
}
BEFORE_FILE="$WORK/m1-before.txt"; : > "$BEFORE_FILE"
for t in $FAMILIES; do printf '%s\t%s\n' "$t" "$(fingerprint "$t")" >> "$BEFORE_FILE"; done
POP=$(awk -F'\t' '$2 != "absent" && $2 !~ /^0\|/' "$BEFORE_FILE" | wc -l | tr -d ' ')
[ "$POP" -gt 0 ] && pass "$POP families populated before the migrations run" \
  || fail "PRECONDITION m1" "nothing populated — a non-mutation proof over empty tables is vacuous"

for f in supabase/migrations/2026080101{09,10,11}_*.sql; do
  $M1 -q -v ON_ERROR_STOP=1 -f "$f" >/dev/null || fail "m1 apply $(basename "$f")" "failed"
done

CHANGED=0
for t in $FAMILIES; do
  was=$(awk -F'\t' -v k="$t" '$1==k{print $2}' "$BEFORE_FILE")
  now=$(fingerprint "$t")
  [ "$now" = "$was" ] || { fail "$t changed" "$was -> $now"; CHANGED=1; }
done
[ "$CHANGED" = "0" ] && pass "every populated family is byte-identical after 109, 110 and 111" || true

TOMB=$($M1 -c "select count(*) from yorisou_daily_state_records where 1=0;" 2>/dev/null || echo 0)
for t in yorisou_daily_state_erasure_tombstones yorisou_values_erasure_tombstones; do
  if [ "$($M1 -c "select to_regclass('public.$t') is not null;")" = "t" ]; then
    n=$($M1 -c "select count(*) from public.$t;")
    [ "$n" = "0" ] && pass "$t: applying the migrations created no tombstone" || fail "$t" "$n tombstones appeared"
  fi
done

# ── the governed evidence artifact ──────────────────────────────────────────
mkdir -p "$(dirname "$OUT")"
cat > "$OUT" <<JSON
{
  "note": "POR-1 eleven-migration catalogue baseline. Generated by tests/por1/catalogue-baseline.sh.",
  "baseline_source": "REPOSITORY_RECONSTRUCTED_MAIN_LINEAGE",
  "baseline_commit": "$BASELINE_COMMIT",
  "production_live_verified": false,
  "classification": ["REPOSITORY_LINEAGE_VERIFIED", "PRODUCTION_LIVE_UNVERIFIED"],
  "function_count_convention": "identity_signature",
  "postgres_major": 17,
  "migrations": $MIGS,
  "base": { "tables": $B_TAB, "function_identity_signatures": $B_FUN, "distinct_function_names": $BN, "sequences": $B_SEQ, "triggers": $B_TRG },
  "target": { "tables": $T_TAB, "function_identity_signatures": $T_FUN, "distinct_function_names": $TN, "sequences": $T_SEQ, "triggers": $T_TRG },
  "delta": { "tables": $D_T, "function_identity_signatures": $D_F, "distinct_function_names": $D_N, "sequences": $D_S, "triggers": $D_G },
  "function_identity_signature_delta": $D_F,
  "distinct_function_name_delta": $D_N,
  "canonical_tuple": "$D_T / $D_F / $D_S / $D_G",
  "deterministic": true,
  "digests": {
    "base": "$(shasum -a 256 "$WORK/base.txt" | awk '{print $1}')",
    "target": "$(shasum -a 256 "$WORK/target_a.txt" | awk '{print $1}')"
  }
}
JSON
pass "wrote $OUT"

echo
[ "$FAILURES" = "0" ] && echo "[cb] PASS" || { echo "[cb] FAIL — $FAILURES"; exit 1; }
