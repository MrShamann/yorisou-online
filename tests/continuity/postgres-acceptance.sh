#!/usr/bin/env bash
# ARCH-P6 / CNT-1 — continuity.core projection acceptance against REAL PostgreSQL.
#
# P6's claim is that a projection cannot outlive its source. That is a database claim, so it is
# proved here with overlapping sessions and real refusals rather than unit fakes.
set -uo pipefail
cd "$(dirname "$0")/../.."
PGBIN="${CNT1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
PORT="${CNT1_POSTGRES_PORT:-55751}"
WORK="${CNT1_WORK:-/tmp/cnt1-acceptance}"
export LC_ALL=C PATH="$PGBIN:$PATH"
FAILURES=0; STARTED_LOCAL=0
cleanup(){ set +e; [ "$STARTED_LOCAL" = "1" ] && pg_ctl -D "$WORK/pg" stop >/dev/null 2>&1; rm -rf "$WORK"; }
trap cleanup EXIT
pass(){ printf '  ok   %s\n' "$1"; }
fail(){ printf '  FAIL %s  %s\n' "$1" "${2:-}"; FAILURES=$((FAILURES+1)); }
mkdir -p "$WORK"
if [[ -n "${CNT1_DATABASE_URL:-}" ]]; then
  DSN="$CNT1_DATABASE_URL"
  if [[ "$DSN" == *"supabase.co"* || "$DSN" != *"cnt1_acceptance"* ]]; then echo "Refusing non-ephemeral target" >&2; exit 1; fi
else
  STARTED_LOCAL=1; rm -rf "$WORK"; mkdir -p "$WORK"
  initdb -D "$WORK/pg" -A trust -U postgres >/dev/null
  pg_ctl -D "$WORK/pg" -o "-p $PORT -k $WORK -c listen_addresses=127.0.0.1 -c deadlock_timeout=300ms" -l "$WORK/pg.log" start >/dev/null
  createdb -h 127.0.0.1 -p "$PORT" -U postgres cnt1_acceptance
  DSN="postgres://postgres@127.0.0.1:$PORT/cnt1_acceptance"
fi
Q(){ psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A -c "$1"; }
TRY(){ psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A -c "$1" 2>&1 || true; }
WAIT_FILE(){ local f="$1" n=0; while [ ! -f "$f" ]; do n=$((n+1)); [ "$n" -gt 300 ] && return 1; sleep 0.1; done; }

echo "[cnt1] stage 1 — lineage + schema"
psql "$DSN" -q -c "create extension if not exists pgcrypto;
 do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$;
 do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
 do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;" >/dev/null

# HOSTED PARITY, AND IT IS THE POINT OF THIS LINE.
#
# A hosted Supabase project carries environment-level DEFAULT PRIVILEGES granting service_role ALL
# on new tables in `public`. A bare cluster does not. Without this the suite proved "the index is
# SELECT-only" against a shape Production does not have, and CNT-1 shipped with the index directly
# writable in Production while every test was green — a `grant select` adds nothing to a role that
# already holds everything.
#
# With it, check 5 below is a real assertion about the environment the product actually runs in.
psql "$DSN" -q -c "alter default privileges in schema public grant all on tables to service_role;" >/dev/null
AF=0
for f in supabase/migrations/*.sql; do
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null 2>"$WORK/e.txt" || { fail "apply $(basename "$f")" "$(head -2 "$WORK/e.txt"|tr '\n' ' ')"; AF=$((AF+1)); }
done
[ "$AF" -gt 0 ] && { echo "[cnt1] FAIL — lineage did not apply"; exit 1; }
pass "1. full migration lineage applies"
psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f supabase/migrations/202608200001_cnt1_continuity_projections.sql >/dev/null 2>&1 \
  && pass "2. CNT-1 is re-apply safe" || fail "2. re-apply"
[ "$(Q "select relrowsecurity from pg_class where relname='yorisou_continuity_projections'")" = "t" ] \
  && pass "3. RLS enabled" || fail "3. RLS"
BROAD=0
for r in public anon authenticated; do
  for p in select insert update delete; do
    [ "$(Q "select has_table_privilege('$r','public.yorisou_continuity_projections','$p')")" = "t" ] && BROAD=1
  done
  for s in "public.yorisou_continuity_project(text,text,text,timestamptz,text)" "public.yorisou_continuity_invalidate_source(text,text,text)" "public.yorisou_continuity_invalidate_owner(text)"; do
    [ "$(Q "select has_function_privilege('$r','$s','execute')")" = "t" ] && BROAD=1
  done
done
[ "$BROAD" = "0" ] && pass "4. public/anon/authenticated have NO access" || fail "4. broad access"
SVC=1
[ "$(Q "select has_table_privilege('service_role','public.yorisou_continuity_projections','select')")" = "t" ] || SVC=0
for p in insert update delete; do [ "$(Q "select has_table_privilege('service_role','public.yorisou_continuity_projections','$p')")" = "t" ] && SVC=0; done
[ "$SVC" = "1" ] && pass "5. service_role bounded: SELECT only, mutation via RPC" || fail "5. service_role"
COLS=$(Q "select coalesce(string_agg(column_name,','),'') from information_schema.columns
          where table_schema='public' and table_name='yorisou_continuity_projections'
            and column_name in ('label','title','body','situation','reflection','what_happened','description','answers','payload')")
[ -z "$COLS" ] && pass "6. the index carries NO source content column" || fail "6. private payload column" "$COLS"

echo "[cnt1] stage 2 — terminal invalidation (P6-D)"
Q "select public.yorisou_continuity_project('o1','current_state','s1',now(),null)" >/dev/null
[ "$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='o1' and invalidated_at is null")" = "1" ] \
  && pass "7. projection is live after project" || fail "7. project"
[ "$(Q "select public.yorisou_continuity_invalidate_source('o1','current_state','s1')")" = "1" ] \
  && pass "8. invalidation reports one transition" || fail "8. invalidate"
[ "$(Q "select public.yorisou_continuity_invalidate_source('o1','current_state','s1')")" = "0" ] \
  && pass "9. invalidation is idempotent" || fail "9. idempotent"
[ "$(Q "select public.yorisou_continuity_project('o1','current_state','s1',now(),null)")" = "f" ] \
  && pass "P6-D. a stale re-project is REFUSED after terminal invalidation" || fail "P6-D re-project accepted"
[ "$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='o1' and invalidated_at is null")" = "0" ] \
  && pass "P6-D. the moment stays unreadable — no resurrection" || fail "P6-D resurrection"

echo "[cnt1] stage 3 — owner isolation (P6-F)"
Q "select public.yorisou_continuity_project('oA','current_state','shared-ref',now(),null)" >/dev/null
Q "select public.yorisou_continuity_project('oB','current_state','shared-ref',now(),null)" >/dev/null
[ "$(Q "select public.yorisou_continuity_invalidate_source('oA','current_state','shared-ref')")" = "1" ] \
  && pass "P6-F. owner A's moment invalidates" || fail "P6-F invalidate A"
[ "$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='oB' and invalidated_at is null")" = "1" ] \
  && pass "P6-F. OWNER B'S IDENTICAL (family,ref) SURVIVES" || fail "P6-F cross-owner invalidation"
OWNERR=$(TRY "select public.yorisou_continuity_invalidate_source('','current_state','shared-ref')")
echo "$OWNERR" | grep -q "continuity_owner_required" \
  && pass "P6-F. an ownerless invalidation is refused" || fail "P6-F ownerless" "$OWNERR"

echo "[cnt1] stage 4 — reflection variant (P6-G)"
Q "select public.yorisou_continuity_project('o2','reflection','r-light',now(),'light')" >/dev/null
Q "select public.yorisou_continuity_project('o2','reflection','r-deep',now(),'postmortem')" >/dev/null
[ "$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='o2' and source_family='reflection'")" = "2" ] \
  && pass "P6-G. light and deep reflections are distinct moments" || fail "P6-G collapsed"
[ "$(Q "select variant from public.yorisou_continuity_projections where source_ref='r-deep'")" = "postmortem" ] \
  && pass "P6-G. the mode is preserved for the filter" || fail "P6-G variant lost"
Q "select public.yorisou_continuity_project('o2','reflection','r-light',now(),'light')" >/dev/null
[ "$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='o2' and source_ref='r-light'")" = "1" ] \
  && pass "P6-G. re-projecting the same reflection does not duplicate" || fail "P6-G duplicate"

echo "[cnt1] stage 5 — CONCURRENCY (P6-A, P6-E)"
Q "select public.yorisou_continuity_project('o3','goal','g1',now(),null)" >/dev/null
rm -f "$WORK/ready" "$WORK/release"
( psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A <<SQL >"$WORK/w.out" 2>&1
begin;
select public.yorisou_continuity_project('o3','goal','g1', now(), null);
\! touch $WORK/ready
\! bash -c 'n=0; while [ ! -f $WORK/release ]; do n=\$((n+1)); [ \$n -gt 600 ] && break; sleep 0.1; done'
commit;
SQL
) & WP=$!
if ! WAIT_FILE "$WORK/ready"; then fail "P6-A: writer never signalled READY"; touch "$WORK/release"; else
  pass "P6-A. writer holds an open projection transaction (deterministic marker)"
  ( psql "$DSN" -q -t -A -c "select public.yorisou_continuity_invalidate_source('o3','goal','g1')" >"$WORK/inv.out" 2>&1 ) & IP=$!
  sleep 1
  touch "$WORK/release"; wait "$WP" >/dev/null 2>&1; wait "$IP" >/dev/null 2>&1
  grep -qi "deadlock" "$WORK/w.out" "$WORK/inv.out" && fail "P6-A: deadlock" || pass "P6-A. no deadlock between projection write and invalidation"
  [ "$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='o3' and invalidated_at is null")" = "0" ] \
    && pass "P6-A. erasure wins: no live projection survives the source erase" || fail "P6-A projection outlived source"
  [ "$(Q "select public.yorisou_continuity_project('o3','goal','g1',now(),null)")" = "f" ] \
    && pass "P6-A. a later writer still cannot resurrect it" || fail "P6-A late resurrection"
fi
Q "select public.yorisou_continuity_project('o4','experience','e1',now(),null)" >/dev/null
( psql "$DSN" -q -t -A -c "select public.yorisou_continuity_invalidate_source('o4','experience','e1')" >"$WORK/i1.out" 2>&1 ) & A=$!
( psql "$DSN" -q -t -A -c "select public.yorisou_continuity_invalidate_source('o4','experience','e1')" >"$WORK/i2.out" 2>&1 ) & B=$!
wait "$A" >/dev/null 2>&1; wait "$B" >/dev/null 2>&1
grep -qi "deadlock" "$WORK/i1.out" "$WORK/i2.out" && fail "P6-E: deadlock" || pass "P6-E. concurrent invalidations do not deadlock"
TOT=$(( $(grep -c '^1$' "$WORK/i1.out") + $(grep -c '^1$' "$WORK/i2.out") ))
[ "$TOT" = "1" ] && pass "P6-E. exactly ONE path reports the transition — idempotent" || fail "P6-E transitions=$TOT"

echo "[cnt1] stage 6 — ERASE vs READ (P6-B)"
Q "select public.yorisou_continuity_project('o5','current_state','s5',now(),null)" >/dev/null
READ_BEFORE=$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='o5' and invalidated_at is null")
Q "select public.yorisou_continuity_invalidate_source('o5','current_state','s5')" >/dev/null
READ_AFTER=$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='o5' and invalidated_at is null")
[ "$READ_BEFORE" = "1" ] && [ "$READ_AFTER" = "0" ] \
  && pass "P6-B. a read starting AFTER the erasure commit cannot see the moment" \
  || fail "P6-B before=$READ_BEFORE after=$READ_AFTER"
echo "       (scope: READ COMMITTED — a snapshot taken before the commit may still see it; that is"
echo "        PostgreSQL semantics, not a P6 guarantee, and is stated rather than over-claimed.)"

echo "[cnt1] stage 7 — ACCOUNT ERASURE (P6-C)"
Q "select public.yorisou_continuity_project('o6','goal','g6',now(),null)" >/dev/null
Q "insert into public.yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint)
   values ('o6', encode(sha256(convert_to('o6','utf8')),'hex'))" >/dev/null
Q "select public.yorisou_account_deletion_erase_database_unchecked('o6')" >/dev/null
[ "$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='o6'")" = "0" ] \
  && pass "P6-C. account erasure removes every projection row for the account" || fail "P6-C projection survived account erasure"
[ "$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='oB' and invalidated_at is null")" = "1" ] \
  && pass "P6-C. an unrelated owner is untouched" || fail "P6-C erasure crossed owners"

echo "[cnt1] stage 8 — BACKFILL is idempotent and excludes what the timeline excludes"
SEED_LIVE=$(TRY "insert into public.yorisou_experience_cards (owner_account_id, situation, action_tried, perceived_outcome)
   values ('o7','s','a','p') returning 'seeded'")
SEED_DEL=$(TRY "insert into public.yorisou_experience_cards (owner_account_id, situation, action_tried, perceived_outcome, deleted_at)
   values ('o7','s','a','p', now()) returning 'seeded'")
if [ "$SEED_LIVE" != "seeded" ] || [ "$SEED_DEL" != "seeded" ]; then
  fail "8. backfill fixture did not seed" "live=$SEED_LIVE deleted=$SEED_DEL"
fi
psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f supabase/migrations/202608200001_cnt1_continuity_projections.sql >/dev/null 2>&1
LIVE_E=$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='o7' and source_family='experience'")
[ "$LIVE_E" = "1" ] \
  && pass "8. backfill projects the live experience and SKIPS the deleted one" || fail "8. backfill count=$LIVE_E"
psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f supabase/migrations/202608200001_cnt1_continuity_projections.sql >/dev/null 2>&1
[ "$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='o7'")" = "$LIVE_E" ] \
  && pass "8b. re-running the backfill does not duplicate" || fail "8b. backfill duplicated"

echo "[cnt1] stage 9 — PROPAGATION (P6-H): the running product produces projections"
SEED_STATE=$(Q "insert into public.yorisou_current_state_records (owner_account_id, state_tags, source)
   values ('o8', array['tired'], 'today_check_in') returning id")
SEED_GOAL=$(Q "insert into public.yorisou_goals (owner_account_id, title) values ('o8','go') returning id")
SEED_RL=$(Q "insert into public.yorisou_life_reflections (owner_account_id, mode, what_happened)
   values ('o8','light','w') returning id")
SEED_RP=$(Q "insert into public.yorisou_life_reflections (owner_account_id, mode, what_happened)
   values ('o8','postmortem','w') returning id")
SEED_EXP=$(Q "insert into public.yorisou_experience_cards (owner_account_id, situation, action_tried, perceived_outcome)
   values ('o8','s','a','p') returning id")
for pair in "current_state:$SEED_STATE" "goal:$SEED_GOAL" "reflection:$SEED_RL" "reflection:$SEED_RP" "experience:$SEED_EXP"; do
  fam="${pair%%:*}"; ref="${pair#*:}"
  n=$(Q "select count(*) from public.yorisou_continuity_projections
          where owner_account_id='o8' and source_family='$fam' and source_ref='$ref' and invalidated_at is null")
  [ "$n" = "1" ] && pass "P6-H. writing a $fam through the table produced its moment" \
                 || fail "P6-H $fam" "projections=$n — the source write did not propagate"
done
[ "$(Q "select variant from public.yorisou_continuity_projections where source_ref='$SEED_RP'")" = "postmortem" ] \
  && pass "P6-H. the reflection mode travelled with it" || fail "P6-H variant"
[ "$(Q "select occurred_at = (select created_at from public.yorisou_current_state_records where id='$SEED_STATE')
         from public.yorisou_continuity_projections where source_ref='$SEED_STATE'")" = "t" ] \
  && pass "P6-H. occurred_at IS the source created_at the timeline orders by" || fail "P6-H occurred_at drift"

echo "[cnt1] stage 10 — SOFT DELETE (P6-I): the timeline's own exclusions"
Q "update public.yorisou_experience_cards set withdrawn_at = now() where id='$SEED_EXP'" >/dev/null
[ "$(Q "select count(*) from public.yorisou_continuity_projections where source_ref='$SEED_EXP' and invalidated_at is null")" = "0" ] \
  && pass "P6-I. withdrawing an experience removes the moment" || fail "P6-I withdraw"
SEED_E2=$(Q "insert into public.yorisou_experience_cards (owner_account_id, situation, action_tried, perceived_outcome)
   values ('o8','s2','a','p') returning id")
Q "update public.yorisou_experience_cards set deleted_at = now(), withdrawn_at = now() where id='$SEED_E2'" >/dev/null
[ "$(Q "select count(*) from public.yorisou_continuity_projections where source_ref='$SEED_E2' and invalidated_at is null")" = "0" ] \
  && pass "P6-I. soft-deleting an experience removes the moment" || fail "P6-I soft delete"
Q "update public.yorisou_experience_cards set withdrawn_at = null, deleted_at = null where id='$SEED_E2'" >/dev/null
[ "$(Q "select count(*) from public.yorisou_continuity_projections where source_ref='$SEED_E2' and invalidated_at is null")" = "0" ] \
  && pass "P6-I. and clearing the flags does NOT bring it back — invalidation is terminal" \
  || fail "P6-I a soft-deleted moment came back"
echo "       (the product has no un-withdraw; archP6Continuity.test.ts fails if one is ever added,"
echo "        because terminal invalidation would then be the wrong model for that path.)"
Q "delete from public.yorisou_goals where id='$SEED_GOAL'" >/dev/null
[ "$(Q "select count(*) from public.yorisou_continuity_projections where source_ref='$SEED_GOAL' and invalidated_at is null")" = "0" ] \
  && pass "P6-I. a hard DELETE of a source invalidates its moment" || fail "P6-I hard delete"

echo "[cnt1] stage 11 — LOCK ORDER (P6-K): a live writer against a real account erasure"
Q "insert into public.yorisou_current_state_records (id, owner_account_id, state_tags, source)
   values ('11111111-1111-4111-8111-111111111111','oK', array['x'], 'today_check_in')" >/dev/null
Q "insert into public.yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint)
   values ('oK', encode(sha256(convert_to('oK','utf8')),'hex'))" >/dev/null
[ "$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='oK' and invalidated_at is null")" = "1" ] \
  && pass "P6-K. the writer's moment exists before the race" || fail "P6-K precondition"
rm -f "$WORK/kready" "$WORK/krelease"
( psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A <<SQL >"$WORK/kw.out" 2>&1
begin;
-- Hold the SOURCE row without touching the projection yet. An UPDATE would take both locks in one
-- statement and no interleaving would be possible; FOR UPDATE is what lets the two paths cross.
select 1 from public.yorisou_current_state_records where owner_account_id='oK' for update;
\! touch $WORK/kready
-- Wait until the eraser is genuinely BLOCKED, not merely running. The synchronising FACT is the
-- lock wait in pg_stat_activity; pg_sleep is only how often that fact is checked, which is why a
-- fixed sleep would not do — it would be a guess that happened to work on this machine.
do \$wait\$
begin
  for i in 1..1200 loop
    -- pg_stat_clear_snapshot IS THE WHOLE REASON THIS LOOP WORKS. Statistics views are cached for
    -- the life of a transaction (stats_fetch_consistency = cache), so a poll inside the writer's
    -- own open transaction re-reads the snapshot taken before the eraser ever started and reports
    -- "not blocked" forever. Without this line the race passed while proving nothing, which is what
    -- the eraser_blocked assertion below exists to catch.
    perform pg_stat_clear_snapshot();
    exit when exists (
      select 1 from pg_stat_activity
       where pid <> pg_backend_pid()
         and wait_event_type = 'Lock'
         and query ilike '%erase_database_unchecked%');
    perform pg_sleep(0.05);
  end loop;
end
\$wait\$;
select pg_stat_clear_snapshot();
select 'eraser_blocked=' || exists (
  select 1 from pg_stat_activity where pid <> pg_backend_pid()
    and wait_event_type='Lock' and query ilike '%erase_database_unchecked%')::text;
-- NOW reach for the projection, which under the old plan order the eraser already holds.
update public.yorisou_current_state_records set situation = 'raced' where owner_account_id='oK';
commit;
SQL
) & KW=$!
if ! WAIT_FILE "$WORK/kready"; then fail "P6-K: writer never signalled READY"; else
  ( psql "$DSN" -q -t -A -c "select public.yorisou_account_deletion_erase_database_unchecked('oK')" >"$WORK/ke.out" 2>&1 ) & KE=$!
  wait "$KW" >/dev/null 2>&1; wait "$KE" >/dev/null 2>&1
  grep -q "eraser_blocked=true" "$WORK/kw.out" \
    && pass "P6-K. the writer observed the eraser BLOCKED — the paths really did cross" \
    || fail "P6-K VACUOUS" "the eraser was never seen blocked; this race proved nothing"
  if grep -qi "deadlock" "$WORK/kw.out" "$WORK/ke.out"; then
    fail "P6-K DEADLOCK between a source write and account erasure" "$(grep -ohi 'deadlock[^\"]*' "$WORK/kw.out" "$WORK/ke.out" | head -1)"
  else
    pass "P6-K. NO DEADLOCK — both paths lock source-then-projection"
  fi
  [ "$(Q "select count(*) from public.yorisou_continuity_projections where owner_account_id='oK'")" = "0" ] \
    && pass "P6-K. erasure still won: not one projection row survives" || fail "P6-K projections survived erasure"
  [ "$(Q "select count(*) from public.yorisou_current_state_records where owner_account_id='oK'")" = "0" ] \
    && pass "P6-K. and neither does the source" || fail "P6-K source survived"
fi

echo
if [ "$FAILURES" -eq 0 ]; then echo "[cnt1] PASS"; else echo "[cnt1] FAIL ($FAILURES)"; fi
exit $([ "$FAILURES" -eq 0 ] && echo 0 || echo 1)
