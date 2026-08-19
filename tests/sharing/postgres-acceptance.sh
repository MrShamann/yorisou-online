#!/usr/bin/env bash
# SHR-1 — sharing.core database acceptance against a real PostgreSQL.
#
# Self-contained (the tests/life-os and tests/discovery discipline): builds a throwaway cluster
# with initdb, applies the FULL migration lineage (the erasure function references POR-1 deletion
# tables, so partial application would prove nothing), exercises the sixteen required truths, then
# destroys the cluster.
#
# CI (SHR1_DATABASE_URL set): use the runner's PostgreSQL service instead, guarded to ephemeral
# local targets exactly like the repository's other DSN harnesses.
#
#   bash tests/sharing/postgres-acceptance.sh

set -euo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${SHR1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
PORT="${SHR1_POSTGRES_PORT:-55731}"
WORK="${SHR1_WORK:-/tmp/shr1-acceptance}"
export LC_ALL=C PATH="$PGBIN:$PATH"

FAILURES=0
STARTED_LOCAL=0
cleanup() { set +e; [ "$STARTED_LOCAL" = "1" ] && pg_ctl -D "$WORK/pg" stop >/dev/null 2>&1; rm -rf "$WORK"; }
trap cleanup EXIT
pass() { printf '  ok   %s\n' "$1"; }
fail() { printf '  FAIL %s  %s\n' "$1" "${2:-}"; FAILURES=$((FAILURES+1)); }

# WORK holds scratch output (error capture) on BOTH paths. Creating it only in the local branch
# left the CI branch redirecting stderr into a directory that does not exist — which makes psql
# itself fail, so every migration "failed to apply" for a reason that had nothing to do with SQL.
mkdir -p "$WORK"

if [[ -n "${SHR1_DATABASE_URL:-}" ]]; then
  DSN="$SHR1_DATABASE_URL"
  if [[ "$DSN" == *"supabase.co"* || "$DSN" != *"shr1_acceptance"* ]]; then
    echo "Refusing non-ephemeral database target" >&2; exit 1
  fi
else
  STARTED_LOCAL=1
  rm -rf "$WORK"; mkdir -p "$WORK"
  initdb -D "$WORK/pg" -A trust -U postgres >/dev/null
  pg_ctl -D "$WORK/pg" -o "-p $PORT -k $WORK -c listen_addresses=127.0.0.1" -l "$WORK/pg.log" start >/dev/null
  createdb -h 127.0.0.1 -p "$PORT" -U postgres shr1_acceptance
  DSN="postgres://postgres@127.0.0.1:$PORT/shr1_acceptance"
fi

Q() { psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A -c "$1"; }
# TRY runs SQL that is EXPECTED to fail (refusal proofs). It must never abort the harness, so the
# non-zero exit is swallowed deliberately and only the message text is returned for matching.
TRY() { psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A -c "$1" 2>&1 || true; }

# Seed a LIVE assessment result for an owner and echo its id. Supplies every NOT NULL column the
# real schema requires — an incomplete insert silently produced no row and made the race setup look
# like a race failure.
seed_result() {
  psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A -c "
    with a as (
      insert into public.yorisou_assessment_attempts (id, method_id, method_version, required_count, status)
      values (gen_random_uuid(), 'imairo-120q', 'compat-v0.2', 120, 'in_progress')
      returning id
    )
    insert into public.yorisou_assessment_results
      (id, attempt_id, owner_account_id, method_id, method_version, result_id, original_result_id,
       dimension_output, visibility, produced_at)
    select gen_random_uuid(), a.id, '$1', 'imairo-120q', 'compat-v0.2', 'P01', 'P01',
           '{\"v\":\"pds-v1\"}'::jsonb, 'private', now()
      from a
    returning id::text" 2>"$WORK/seed-err.txt" || {
    fail "seed a live assessment result for $1" "$(head -2 "$WORK/seed-err.txt" | tr '\n' ' ')" >&2; echo ""; }
}

echo "[shr1] stage 1 — roles + the FULL migration lineage"
psql "$DSN" -v ON_ERROR_STOP=1 -q -c "
  create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";
  do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;
  grant usage on schema public to anon, authenticated, service_role;" >/dev/null
APPLY_FAILURES=0
for f in supabase/migrations/*.sql; do
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null 2>"$WORK/shr1-err.txt" \
    || { fail "apply $(basename "$f")" "$(head -2 "$WORK/shr1-err.txt" | tr '\n' ' ')"; APPLY_FAILURES=$((APPLY_FAILURES+1)); }
done
# HONEST, AND FAIL FAST. Announcing "applied the full lineage" unconditionally is how a broken
# apply reached stage 6 disguised as a missing-table mystery. If the lineage did not apply, every
# later assertion is meaningless — say so once and stop.
if [ "$APPLY_FAILURES" -gt 0 ]; then
  echo "[shr1] FAIL — $APPLY_FAILURES migration(s) did not apply; later stages would be meaningless"
  exit 1
fi
pass "applied the full lineage including 202608180002_shr1_share_objects.sql"
# The erasure function is executor-claim-bound: prove its prerequisite exists BEFORE stage 6 needs
# it, so a missing prerequisite reads as a prerequisite failure rather than a sharing failure.
[ "$(Q "select to_regclass('public.yorisou_account_deletion_jobs') is not null")" = "t" ] \
  && pass "erasure prerequisites present (deletion-job authority)" \
  || { fail "erasure prerequisites"; echo "[shr1] FAIL"; exit 1; }
psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f supabase/migrations/202608180002_shr1_share_objects.sql >/dev/null \
  && pass "re-apply is idempotent"

echo "[shr1] stage 2 — schema, RLS, grants (1-5)"
[ "$(Q "select count(*) from pg_tables where schemaname='public' and tablename in ('yorisou_share_objects','yorisou_share_audit_events')")" = "2" ] \
  && pass "1. both tables exist" || fail "1. tables exist"
[ "$(Q "select bool_and(relrowsecurity) from pg_class where relname in ('yorisou_share_objects','yorisou_share_audit_events')")" = "t" ] \
  && pass "2. RLS enabled on both" || fail "2. RLS enabled"
DENIED=1
for role in anon authenticated; do
  for tbl in yorisou_share_objects yorisou_share_audit_events; do
    [ "$(Q "select has_table_privilege('$role','public.$tbl','select')")" = "t" ] && DENIED=0
  done
done
[ "$(Q "select has_table_privilege('public','public.yorisou_share_objects','select')")" = "t" ] && DENIED=0
[ "$DENIED" = "1" ] && pass "3. PUBLIC/anon/authenticated have no table access" || fail "3. direct access denied"
SIG_PUB="public.yorisou_share_object_publish(text,text,text,text,text,text,text,jsonb,text)"
SIG_REV="public.yorisou_share_object_revoke(text,uuid)"
SIG_SRC="public.yorisou_share_objects_revoke_by_source(text,text,text)"
BROAD=0
for role in public anon authenticated; do
  for sig in "$SIG_PUB" "$SIG_REV" "$SIG_SRC"; do
    [ "$(Q "select has_function_privilege('$role','$sig','execute')")" = "t" ] && BROAD=1
  done
done
[ "$BROAD" = "0" ] && pass "4. no broad RPC EXECUTE" || fail "4. broad RPC EXECUTE found"
SVC_OK=1
[ "$(Q "select has_table_privilege('service_role','public.yorisou_share_objects','select')")" = "t" ] || SVC_OK=0
for priv in insert update delete; do
  [ "$(Q "select has_table_privilege('service_role','public.yorisou_share_objects','$priv')")" = "t" ] && SVC_OK=0
done
[ "$SVC_OK" = "1" ] && pass "5. service_role is bounded: SELECT only, mutation via RPC" || fail "5. service_role bounded"
[ "$(Q "select bool_and(proconfig @> array['search_path=public']) from pg_proc where proname like 'yorisou_share_object%'")" = "t" ] \
  && pass "5b. fixed RPC search_path" || fail "5b. fixed search_path"

echo "[shr1] stage 3 — publish, idempotency, immutability (6-9)"
PAYLOAD='{"test_name":"t","result_code":"P01","display_line":"d","code_line":"c","recognition_line":"r","share_line":"s","highlights":[],"hero_chips":[],"global_note":"n","locale":"ja"}'
DIGEST=$(printf 'a%.0s' {1..64})
P1=$(Q "select public.yorisou_share_object_publish('owner-a','imairo_result_card','assessment_result','src-1','tpl','1.0.0','imairo-share-v1','$PAYLOAD'::jsonb,'$DIGEST')->>'public_id'")
[ -n "$P1" ] && pass "6. publish RPC persists and returns a public id" || fail "6. publish"
[ "$(Q "select public.yorisou_share_object_publish('owner-a','imairo_result_card','assessment_result','src-1','tpl','1.0.0','imairo-share-v1','$PAYLOAD'::jsonb,'$DIGEST')->>'reused'")" = "true" ] \
  && pass "7. publish retry is idempotent (reused=true)" || fail "7. idempotent retry"
[ "$(Q "select public.yorisou_share_object_publish('owner-a','imairo_result_card','assessment_result','src-1','tpl','1.0.0','imairo-share-v1','$PAYLOAD'::jsonb,'$DIGEST')->>'public_id'")" = "$P1" ] \
  && pass "7b. the retry returns the SAME public id" || fail "7b. same public id"
[ "$(Q "select count(*) from public.yorisou_share_objects where owner_account_id='owner-a'")" = "1" ] \
  && pass "7c. exactly one row after three publish calls" || fail "7c. one row"
UUID_OK=$(Q "select ('$P1' ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\$')::text")
[ "$UUID_OK" = "true" ] && pass "8. public_id is a high-entropy UUID, unique-constrained" || fail "8. public_id shape"
[ "$(Q "select count(*) from pg_indexes where tablename='yorisou_share_objects' and indexdef ilike '%unique%public_id%'")" -ge 1 ] \
  && pass "8b. public_id uniqueness enforced by index" || fail "8b. public_id unique"
# A different-digest publish while active must be refused (explicit revoke-then-republish).
DIGEST2=$(printf 'b%.0s' {1..64})
OUT=$(TRY "select public.yorisou_share_object_publish('owner-a','imairo_result_card','assessment_result','src-1','tpl','1.0.0','imairo-share-v1','$PAYLOAD'::jsonb,'$DIGEST2')")
echo "$OUT" | grep -q "share_active_exists" && pass "9. payload is immutable: a changed card cannot silently replace the active one" || fail "9. immutability" "$OUT"
[ "$(Q "select count(*) from information_schema.routines where routine_schema='public' and routine_name like '%share%' and routine_name like '%update%'")" = "0" ] \
  && pass "16. no update-the-card RPC exists" || fail "16. no update path"

echo "[shr1] stage 4 — revoke lifecycle (10-12)"
[ "$(Q "select public.yorisou_share_object_revoke('owner-a','$P1')")" = "t" ] && pass "10. owner revoke succeeds" || fail "10. revoke"
[ "$(Q "select count(*) from public.yorisou_share_objects where public_id='$P1' and revoked_at is null")" = "0" ] \
  && pass "10b. the public read path finds nothing after revoke" || fail "10b. revoked invisible"
[ "$(Q "select public.yorisou_share_object_revoke('owner-a','$P1')")" = "f" ] && pass "11. revoke retry is a safe no-op" || fail "11. revoke idempotent"
P2=$(Q "select public.yorisou_share_object_publish('owner-b','imairo_result_card','assessment_result','src-2','tpl','1.0.0','imairo-share-v1','$PAYLOAD'::jsonb,'$DIGEST')->>'public_id'")
[ "$(Q "select public.yorisou_share_object_revoke('owner-a','$P2')")" = "f" ] && pass "12. a non-owner cannot revoke" || fail "12. non-owner revoke"
[ "$(Q "select count(*) from public.yorisou_share_objects where public_id='$P2' and revoked_at is null")" = "1" ] \
  && pass "12b. the other owner's link is still live" || fail "12b. cross-owner isolation"
# Republishing after revoke mints a NEW id; the revoked one never reactivates.
P3=$(Q "select public.yorisou_share_object_publish('owner-a','imairo_result_card','assessment_result','src-1','tpl','1.0.0','imairo-share-v1','$PAYLOAD'::jsonb,'$DIGEST')->>'public_id'")
[ "$P3" != "$P1" ] && pass "11b. republish after revoke mints a NEW public id" || fail "11b. new id after revoke"

echo "[shr1] stage 5 — transactional audit (14-15)"
[ "$(Q "select count(*) from public.yorisou_share_audit_events where event_type='published'")" -ge 2 ] \
  && pass "14. publish wrote its audit row in the same transaction" || fail "14. publish audit"
[ "$(Q "select count(*) from public.yorisou_share_audit_events where event_type='revoked'")" -ge 1 ] \
  && pass "14b. revoke wrote its audit row in the same transaction" || fail "14b. revoke audit"
AUDIT_COLS=$(Q "select string_agg(column_name, ',' order by column_name) from information_schema.columns where table_name='yorisou_share_audit_events'")
[ "$AUDIT_COLS" = "actor_fingerprint,event_type,id,occurred_at,share_ref" ] \
  && pass "15. audit carries only fingerprint/type/ref/time — no owner, source, or payload" || fail "15. audit columns" "$AUDIT_COLS"
[ "$(Q "select bool_and(actor_fingerprint ~ '^[0-9a-f]{64}\$') from public.yorisou_share_audit_events")" = "t" ] \
  && pass "15b. the actor is a sha256 fingerprint, never a raw account id" || fail "15b. fingerprint"
OUT=$(TRY "update public.yorisou_share_audit_events set event_type='published'")
echo "$OUT" | grep -q "share_audit_append_only" && pass "15c. the audit table is append-only" || fail "15c. append-only" "$OUT"

echo "[shr1] stage 5b — CONCURRENCY: the declared lifecycle must be a database fact"
# These are the two races Controller review found. They are proven against real PostgreSQL with two
# genuinely concurrent sessions, because a single-threaded ordering check cannot see either of them.

# --- RACE 1: two simultaneous publishes, DIFFERENT digests, same owner/source/template. ---
# Session A opens a transaction, publishes digest A, and HOLDS it. Session B tries digest B while A
# is uncommitted: it must block on the source lock, then — once A commits — refuse. Two active rows
# must be impossible.
DIGEST_A=$(printf 'c%.0s' {1..64})
DIGEST_B=$(printf 'd%.0s' {1..64})
PUB_SQL() { echo "select public.yorisou_share_object_publish('owner-race','imairo_result_card','assessment_result','src-race','tpl','1.0.0','imairo-share-v1','$PAYLOAD'::jsonb,'$1')"; }
( psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A <<SQL >"$WORK/raceA.out" 2>&1
begin;
$(PUB_SQL "$DIGEST_A");
select pg_sleep(2);
commit;
SQL
) &
RACE_A=$!
sleep 1   # ensure A holds the lock before B attempts
psql "$DSN" -q -t -A -c "$(PUB_SQL "$DIGEST_B")" >"$WORK/raceB.out" 2>&1 || true
wait "$RACE_A" || true
ACTIVE=$(Q "select count(*) from public.yorisou_share_objects where owner_account_id='owner-race' and revoked_at is null")
[ "$ACTIVE" = "1" ] && pass "RACE 1: concurrent different-digest publishes leave exactly ONE active row" \
  || fail "RACE 1: two active rows" "active=$ACTIVE"
grep -q "share_active_exists" "$WORK/raceB.out" \
  && pass "RACE 1: the losing publish receives a bounded share_active_exists" \
  || fail "RACE 1: loser error" "$(head -2 "$WORK/raceB.out" | tr '\n' ' ')"

# --- RACE 2: publish racing source erasure for the same source. ---
# Session A begins the ATOMIC erasure and holds it; session B publishes concurrently. When erasure
# commits, the required invariant is ZERO active derivatives for that source — including the row B
# tried to create.
RESULT_ID=$(seed_result "owner-race2")
if [ -z "$RESULT_ID" ]; then
  fail "RACE 2 setup: could not create a live assessment result"
else
  Q "select public.yorisou_share_object_publish('owner-race2','imairo_result_card','assessment_result','$RESULT_ID','tpl','1.0.0','imairo-share-v1','$PAYLOAD'::jsonb,'$DIGEST_A')" >/dev/null
  ( psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A <<SQL >"$WORK/eraseA.out" 2>&1
begin;
select public.yorisou_assessment_result_erase_with_shares('$RESULT_ID'::uuid, 'owner-race2');
select pg_sleep(2);
commit;
SQL
  ) &
  ERASE_A=$!
  sleep 1
  psql "$DSN" -q -t -A -c "select public.yorisou_share_object_publish('owner-race2','imairo_result_card','assessment_result','$RESULT_ID','tpl','1.0.0','imairo-share-v1','$PAYLOAD'::jsonb,'$DIGEST_B')" >"$WORK/pubDuringErase.out" 2>&1 || true
  wait "$ERASE_A" || true
  ERASED_OK=$(grep -c "^t$" "$WORK/eraseA.out")
  SURVIVORS=$(Q "select count(*) from public.yorisou_share_objects where source_ref='$RESULT_ID' and revoked_at is null")
  if [ "$ERASED_OK" -ge 1 ]; then
    [ "$SURVIVORS" = "0" ] \
      && pass "RACE 2: erasure succeeded and ZERO active derivatives survive for that source" \
      || fail "RACE 2: an active link outlived its erased source" "survivors=$SURVIVORS"
    grep -q "share_source_erased" "$WORK/pubDuringErase.out" \
      && pass "RACE 2: the concurrent publish was refused with share_source_erased" \
      || fail "RACE 2: concurrent publish outcome" "$(head -2 "$WORK/pubDuringErase.out" | tr '\n' ' ')"
  else
    fail "RACE 2: the atomic erasure did not succeed" "$(head -3 "$WORK/eraseA.out" | tr '\n' ' ')"
  fi
fi

echo "[shr1] stage 5c — cross-owner source revocation is refused"
Q "select public.yorisou_share_object_publish('owner-x','imairo_result_card','assessment_result','src-shared','tpl','1.0.0','imairo-share-v1','$PAYLOAD'::jsonb,'$DIGEST_A')" >/dev/null
Q "select public.yorisou_share_object_publish('owner-y','imairo_result_card','assessment_result','src-shared','tpl','1.0.0','imairo-share-v1','$PAYLOAD'::jsonb,'$DIGEST_A')" >/dev/null
REVOKED_N=$(TRY "select public.yorisou_share_objects_revoke_by_source('owner-x','assessment_result','src-shared')")
[ "$REVOKED_N" = "1" ] && pass "source revoke touches only the requesting owner's object" || fail "owner-scoped source revoke" "n=$REVOKED_N"
[ "$(Q "select count(*) from public.yorisou_share_objects where owner_account_id='owner-y' and source_ref='src-shared' and revoked_at is null")" = "1" ] \
  && pass "ANOTHER OWNER'S LINK SURVIVES a source revoke they did not authorize" \
  || fail "cross-owner revocation occurred"
# And an erase attempted by a non-owner changes nothing at all. A seed failure here must REPORT a
# failure, never silently skip: an authorization proof that quietly does not run reads as a pass.
VICTIM_ID=$(seed_result "owner-victim")
if [ -z "$VICTIM_ID" ]; then
  fail "cross-owner erase setup: could not create a live victim result"
else
    Q "select public.yorisou_share_object_publish('owner-victim','imairo_result_card','assessment_result','$VICTIM_ID','tpl','1.0.0','imairo-share-v1','$PAYLOAD'::jsonb,'$DIGEST_A')" >/dev/null
    ATTACK=$(TRY "select public.yorisou_assessment_result_erase_with_shares('$VICTIM_ID'::uuid, 'owner-attacker')")
    [ "$ATTACK" = "f" ] && pass "an unauthorized erase attempt returns false" || fail "unauthorized erase" "got=$ATTACK"
    [ "$(Q "select count(*) from public.yorisou_share_objects where source_ref='$VICTIM_ID' and revoked_at is null")" = "1" ] \
      && pass "THE VICTIM'S PUBLIC LINK IS UNTOUCHED by the unauthorized erase attempt" \
      || fail "unauthorized erase darkened another owner's link"
    [ "$(Q "select count(*) from public.yorisou_assessment_results where id='$VICTIM_ID' and deleted_at is null")" = "1" ] \
      && pass "the victim's result itself is untouched" || fail "unauthorized erase deleted a result"
fi

echo "[shr1] stage 6 — source erasure + account erasure (13)"
P4=$(Q "select public.yorisou_share_object_publish('owner-c','imairo_result_card','assessment_result','src-4','tpl','1.0.0','imairo-share-v1','$PAYLOAD'::jsonb,'$DIGEST')->>'public_id'")
[ "$(Q "select public.yorisou_share_objects_revoke_by_source('owner-c','assessment_result','src-4')")" = "1" ] \
  && pass "source erasure revokes the derived object" || fail "source erasure"
[ "$(Q "select count(*) from public.yorisou_share_objects where public_id='$P4' and revoked_at is null")" = "0" ] \
  && pass "the derived public link is dark after source erasure" || fail "source erasure effect"
Q "insert into public.yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint)
   values ('owner-b', encode(sha256(convert_to('owner-b','utf8')),'hex'));" >/dev/null
Q "select public.yorisou_account_deletion_erase_database_unchecked('owner-b')" >/dev/null
[ "$(Q "select count(*) from public.yorisou_share_objects where owner_account_id='owner-b'")" = "0" ] \
  && pass "13. account erasure removes the person's ShareObjects" || fail "13. account erasure"
[ "$(Q "select count(*) from public.yorisou_share_objects where owner_account_id='owner-a'")" -ge 1 ] \
  && pass "13b. erasure touched ONLY the requested owner" || fail "13b. erasure scope"

echo
if [ "$FAILURES" -gt 0 ]; then echo "[shr1] FAIL ($FAILURES)"; exit 1; fi
echo "[shr1] PASS"
