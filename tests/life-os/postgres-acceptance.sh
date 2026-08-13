#!/usr/bin/env bash
# OSF-1 — Life OS Phase 1 database acceptance, against a real PostgreSQL.
#
# WHY THIS IS SELF-CONTAINED.
#
# The repository's four `postgres-integration.sh` harnesses each require a DATABASE_URL pointing at a
# local database the operator created first. That is fine for a harness someone runs while working on
# that subsystem, and useless as the acceptance evidence for a package: "the tests pass if you set up
# a database" is not a result. So this builds its own throwaway cluster with initdb, applies the real
# migrations, runs the checks and destroys the cluster — same approach as tests/por1/*.sh, which run
# today on this machine with no Docker and no Supabase.
#
# It also means the erasure check below is real. Account deletion is asserted by INSERTING rows for
# two people, running POR-1's actual erasure body, and looking at what is left — not by grepping the
# migration for table names.
#
#   bash tests/life-os/postgres-acceptance.sh

set -euo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${OSF1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
PORT="${OSF1_POSTGRES_PORT:-55583}"
WORK="${OSF1_WORK:-/tmp/osf1-acceptance}"
export LC_ALL=C PATH="$PGBIN:$PATH"

FAILURES=0
cleanup() { set +e; pg_ctl -D "$WORK/pg" stop >/dev/null 2>&1; rm -rf "$WORK"; }
trap cleanup EXIT
pass() { printf '  ok   %s\n' "$1"; }
fail() { printf '  FAIL %s  %s\n' "$1" "${2:-}"; FAILURES=$((FAILURES+1)); }

MAJOR="$("$PGBIN/postgres" --version | awk '{print $3}' | cut -d. -f1)"
case "$MAJOR" in
  16|17) : ;;
  *) echo "refusing: need PostgreSQL 16 or 17 (Production runs 17); found $MAJOR" >&2; exit 1 ;;
esac

rm -rf "$WORK"; mkdir -p "$WORK/pg"
initdb -D "$WORK/pg" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
pg_ctl -D "$WORK/pg" -o "-p $PORT -c unix_socket_directories=''" -l "$WORK/pg/log" start >/dev/null
sleep 1

DSN="postgres://postgres@localhost:$PORT/osf1"
createdb -h localhost -p "$PORT" -U postgres osf1
Q() { psql "$DSN" -t -A -X -q "$@"; }

Q -c "
  create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";
  do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;
  grant usage on schema public to anon, authenticated, service_role;" >/dev/null

echo "[osf1] applying every migration in lineage order"
for f in supabase/migrations/*.sql; do
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null 2>"$WORK/err.txt" \
    || fail "apply $(basename "$f")" "$(head -2 "$WORK/err.txt" | tr '\n' ' ')"
done
pass "all migrations applied"

A='osf1-owner-a'
B='osf1-owner-b'

# ── 1. CurrentStateRecord ────────────────────────────────────────────────────
echo "[osf1] current state"
SID=$(Q -c "select public.yorisou_osf1_current_state_create('$A', array['heavy','rest'], 'tired', 'low', null, null, 'today_check_in');")
[ -n "$SID" ] && pass "created a current-state record" || fail "current state" "no id returned"
N=$(Q -c "select count(*) from public.yorisou_current_state_records where owner_account_id='$A';")
[ "$N" = "1" ] && pass "one row for the owner" || fail "current state count" "got $N"

# The bounded vocabulary is enforced in the database, not only in the API route.
if Q -c "select public.yorisou_osf1_current_state_create('$A', array['definitely-burnt-out'], null, null, null, null, 'manual');" >/dev/null 2>&1; then
  fail "state vocabulary" "an unrecognised tag was accepted"
else
  pass "an unrecognised state tag is refused"
fi

# Write-once note.
Q -c "select public.yorisou_osf1_current_state_set_reflection('$A', '$SID', '  きょうは早めに休む  ');" >/dev/null
NOTE=$(Q -c "select reflection from public.yorisou_current_state_records where id='$SID';")
[ "$NOTE" = "きょうは早めに休む" ] && pass "the optional note is stored, trimmed" || fail "note" "got '$NOTE'"
SECOND=$(Q -c "select public.yorisou_osf1_current_state_set_reflection('$A', '$SID', 'いや、やっぱり');")
[ "$SECOND" = "f" ] && pass "a second note is refused (write-once)" || fail "note overwrite" "got $SECOND"

# ── 2. Goal ──────────────────────────────────────────────────────────────────
echo "[osf1] goal"
GID=$(Q -c "select public.yorisou_osf1_goal_create('$A', '  ひとりの時間をつくる  ', null);")
TITLE=$(Q -c "select title from public.yorisou_goals where id='$GID';")
[ "$TITLE" = "ひとりの時間をつくる" ] && pass "created a goal, trimmed" || fail "goal" "got '$TITLE'"
STATUS=$(Q -c "select status from public.yorisou_goals where id='$GID';")
[ "$STATUS" = "active" ] && pass "a new goal starts active" || fail "goal status" "got $STATUS"
Q -c "select public.yorisou_osf1_goal_set_status('$A', '$GID', 'released');" >/dev/null
STATUS=$(Q -c "select status from public.yorisou_goals where id='$GID';")
[ "$STATUS" = "released" ] && pass "手放した is a reachable outcome" || fail "goal status" "got $STATUS"
# There is no failure state, by design.
if Q -c "select public.yorisou_osf1_goal_set_status('$A', '$GID', 'failed');" >/dev/null 2>&1; then
  fail "goal status vocabulary" "'failed' was accepted"
else
  pass "'failed' is not a status a goal can have"
fi

# ── 3. Experience (the EXISTING card table, plus the two new columns) ────────
echo "[osf1] experience"
XID=$(Q -c "insert into public.yorisou_experience_cards
              (project_id, owner_account_id, title, situation, action_tried, perceived_outcome, lesson, visibility)
            values ('yorisou', '$A', '会議のあと', '説明がうまくいかなかった', '一度メモに書き出した',
                    '次の日に落ち着いて話せた', '先に書くと落ち着く', 'PRIVATE')
            returning id;")
[ -n "$XID" ] && pass "created an experience on the existing card table" || fail "experience" "insert failed"
COLS=$(Q -c "select count(*) from information_schema.columns
              where table_schema='public' and table_name='yorisou_experience_cards'
                and column_name in ('title','lesson');")
[ "$COLS" = "2" ] && pass "title and lesson exist on yorisou_experience_cards" || fail "experience columns" "got $COLS"
DUP=$(Q -c "select count(*) from information_schema.tables
             where table_schema='public' and table_name in
               ('yorisou_experiences','yorisou_life_experiences','yorisou_osf1_experiences');")
[ "$DUP" = "0" ] && pass "no second experience table was created" || fail "duplicate experience table" "found $DUP"

# ── 4. Reflection ────────────────────────────────────────────────────────────
echo "[osf1] reflection"
RID=$(Q -c "select public.yorisou_osf1_reflection_create('$A', '$XID', '説明がうまくいかなかった',
              'ちゃんと伝えたかった', '相手の状況は知らなかった', 'その場では黙った', '空気を壊したくなかった',
              '翌日に話せた', '先に書くと落ち着く', 'まず書き出す');")
[ -n "$RID" ] && pass "created a reflection with all seven answers" || fail "reflection" "no id"
ONLY=$(Q -c "select public.yorisou_osf1_reflection_create('$A', null, '書いておきたいことがあった', null, null, null, null, null, null, null);")
[ -n "$ONLY" ] && pass "a reflection with only the first answer is accepted" || fail "partial reflection" "refused"
if Q -c "select public.yorisou_osf1_reflection_create('$A', null, '   ', null, null, null, null, null, null, null);" >/dev/null 2>&1; then
  fail "reflection" "an empty first answer was accepted"
else
  pass "an empty first answer is refused"
fi

# PERMISSION BOUNDARY: B may not attach a reflection to A's experience.
if Q -c "select public.yorisou_osf1_reflection_create('$B', '$XID', 'のぞき見', null, null, null, null, null, null, null);" >/dev/null 2>&1; then
  fail "cross-owner reflection" "B attached a reflection to A's experience"
else
  pass "a reflection cannot reference another person's experience"
fi

# ── 5. Memory — confirmation is structural ───────────────────────────────────
echo "[osf1] memory"
CONTENT='先に書き出すと落ち着く'
DIGEST=$(Q -c "select encode(sha256(convert_to('$CONTENT','utf8')),'hex');")
MID=$(Q -c "select public.yorisou_osf1_memory_confirm('$A','reflection','$CONTENT','user_confirmed_ai_suggestion','$DIGEST',true,null,null,'$RID');")
[ -n "$MID" ] && pass "a confirmed memory is stored" || fail "memory confirm" "no id"

if Q -c "select public.yorisou_osf1_memory_confirm('$A','reflection','$CONTENT','user_statement','$DIGEST',false,null,null,null);" >/dev/null 2>&1; then
  fail "memory without confirmation" "it was stored"
else
  pass "confirmed=false is refused"
fi
if Q -c "select public.yorisou_osf1_memory_confirm('$A','reflection','$CONTENT','user_statement',null,null,null,null,null);" >/dev/null 2>&1; then
  fail "memory with null confirmation" "it was stored"
else
  pass "confirmed=null is refused"
fi
# Shown one sentence, saved another.
WRONG=$(Q -c "select encode(sha256(convert_to('まったくちがう文','utf8')),'hex');")
if Q -c "select public.yorisou_osf1_memory_confirm('$A','reflection','$CONTENT','user_statement','$WRONG',true,null,null,null);" >/dev/null 2>&1; then
  fail "digest mismatch" "content that did not match the confirmed digest was stored"
else
  pass "a digest that does not match the content is refused"
fi
# The check constraint, reached directly — the guarantee does not depend on the RPC.
if Q -c "insert into public.yorisou_explicit_memories
           (owner_account_id, memory_type, content, source, user_confirmed, confirmation_digest)
         values ('$A','preference','x','user_statement',false,'$DIGEST');" >/dev/null 2>&1; then
  fail "unconfirmed row" "a direct insert with user_confirmed=false succeeded"
else
  pass "an unconfirmed memory row cannot exist even by direct insert"
fi
# B cannot point a memory at A's reflection.
BDIGEST=$(Q -c "select encode(sha256(convert_to('のぞき見','utf8')),'hex');")
if Q -c "select public.yorisou_osf1_memory_confirm('$B','reflection','のぞき見','user_statement','$BDIGEST',true,null,null,'$RID');" >/dev/null 2>&1; then
  fail "cross-owner memory subject" "B referenced A's reflection"
else
  pass "a memory cannot reference another person's reflection"
fi
DEL=$(Q -c "select public.yorisou_osf1_memory_delete('$A','$MID');")
[ "$DEL" = "t" ] && pass "a memory can be deleted by its owner" || fail "memory delete" "got $DEL"
GONE=$(Q -c "select count(*) from public.yorisou_explicit_memories where id='$MID';")
[ "$GONE" = "0" ] && pass "deletion is a hard delete, not a hidden row" || fail "memory delete" "$GONE rows remain"

# ── 6. UserContext ───────────────────────────────────────────────────────────
echo "[osf1] user context"
Q -c "select public.yorisou_osf1_user_context_upsert('$A','ja','Tokyo','Asia/Tokyo','{\"text_size\":\"large\"}'::jsonb);" >/dev/null
Q -c "select public.yorisou_osf1_user_context_upsert('$A','en',null,'Europe/Berlin','{}'::jsonb);" >/dev/null
ROWS=$(Q -c "select count(*) from public.yorisou_user_contexts where owner_account_id='$A';")
[ "$ROWS" = "1" ] && pass "upsert keeps exactly one context per person" || fail "context rows" "got $ROWS"
LANG=$(Q -c "select language from public.yorisou_user_contexts where owner_account_id='$A';")
[ "$LANG" = "en" ] && pass "the second upsert updated in place" || fail "context language" "got $LANG"
if Q -c "select public.yorisou_osf1_user_context_upsert('$A','ja',null,null,'{\"engagement_score\":0.9}'::jsonb);" >/dev/null 2>&1; then
  fail "preference allowlist" "an unknown preference key was stored"
else
  pass "an unknown preference key is refused, not stored"
fi

# ── 7. Privilege matrix ──────────────────────────────────────────────────────
echo "[osf1] privileges"
for t in yorisou_user_contexts yorisou_current_state_records yorisou_goals yorisou_life_reflections yorisou_explicit_memories; do
  RLS=$(Q -c "select relrowsecurity from pg_class where relname='$t' and relnamespace='public'::regnamespace;")
  [ "$RLS" = "t" ] && pass "$t: RLS enabled" || fail "$t RLS" "got $RLS"
  for role in anon authenticated; do
    for priv in select insert update delete; do
      HAS=$(Q -c "select has_table_privilege('$role','public.$t','$priv');")
      [ "$HAS" = "f" ] || fail "$t: $role has $priv" "expected none"
    done
  done
  SEL=$(Q -c "select has_table_privilege('service_role','public.$t','select');")
  [ "$SEL" = "t" ] || fail "$t: service_role cannot select" "expected select"
  for priv in insert update delete; do
    HAS=$(Q -c "select has_table_privilege('service_role','public.$t','$priv');")
    [ "$HAS" = "f" ] || fail "$t: service_role has $priv" "mutation must go through the RPCs"
  done
done
pass "public/anon/authenticated denied; service_role reads only"

for fn in yorisou_osf1_memory_confirm yorisou_osf1_goal_create yorisou_osf1_current_state_create; do
  for role in anon authenticated; do
    HAS=$(Q -c "select count(*) from pg_proc p where p.proname='$fn'
                  and has_function_privilege('$role', p.oid, 'execute');")
    [ "$HAS" = "0" ] || fail "$fn executable by $role" "expected none"
  done
done
pass "the mutation RPCs are not executable by anon or authenticated"

# ── 8. Account erasure, executed for real ────────────────────────────────────
echo "[osf1] account erasure"
# Give B a full set too, so "erased" can be distinguished from "was never there".
BSID=$(Q -c "select public.yorisou_osf1_current_state_create('$B', array['steady'], null, null, null, null, 'manual');")
BGID=$(Q -c "select public.yorisou_osf1_goal_create('$B','べつの人の方向',null);")
BRID=$(Q -c "select public.yorisou_osf1_reflection_create('$B', null, 'べつの人の記録', null, null, null, null, null, null, null);")
BMD=$(Q -c "select encode(sha256(convert_to('べつの人の記憶','utf8')),'hex');")
Q -c "select public.yorisou_osf1_memory_confirm('$B','preference','べつの人の記憶','user_statement','$BMD',true,null,null,null);" >/dev/null
Q -c "select public.yorisou_osf1_user_context_upsert('$B','ja',null,null,'{}'::jsonb);" >/dev/null
# A needs a live memory again to prove erasure removes it.
Q -c "select public.yorisou_osf1_memory_confirm('$A','reflection','$CONTENT','user_statement','$DIGEST',true,null,null,null);" >/dev/null

BEFORE_A=$(Q -c "select
  (select count(*) from public.yorisou_current_state_records where owner_account_id='$A')
+ (select count(*) from public.yorisou_goals where owner_account_id='$A')
+ (select count(*) from public.yorisou_life_reflections where owner_account_id='$A')
+ (select count(*) from public.yorisou_explicit_memories where owner_account_id='$A')
+ (select count(*) from public.yorisou_user_contexts where owner_account_id='$A');")
[ "$BEFORE_A" -gt 0 ] && pass "A has $BEFORE_A life-OS rows before deletion" \
  || fail "PRECONDITION erasure" "nothing to erase — the check would be vacuous"

Q -c "insert into public.yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint)
      values ('$A', encode(sha256(convert_to('$A','utf8')),'hex'));" >/dev/null
Q -c "select public.yorisou_account_deletion_erase_database_unchecked('$A');" >/dev/null 2>"$WORK/erase.txt" \
  || fail "erasure" "$(head -3 "$WORK/erase.txt" | tr '\n' ' ')"

AFTER_A=$(Q -c "select
  (select count(*) from public.yorisou_current_state_records where owner_account_id='$A')
+ (select count(*) from public.yorisou_goals where owner_account_id='$A')
+ (select count(*) from public.yorisou_life_reflections where owner_account_id='$A')
+ (select count(*) from public.yorisou_explicit_memories where owner_account_id='$A')
+ (select count(*) from public.yorisou_user_contexts where owner_account_id='$A');")
[ "$AFTER_A" = "0" ] && pass "every life-OS row for A is gone after account erasure" \
  || fail "erasure" "$AFTER_A rows survived — a deleted account kept private records"

AFTER_B=$(Q -c "select
  (select count(*) from public.yorisou_current_state_records where owner_account_id='$B')
+ (select count(*) from public.yorisou_goals where owner_account_id='$B')
+ (select count(*) from public.yorisou_life_reflections where owner_account_id='$B')
+ (select count(*) from public.yorisou_explicit_memories where owner_account_id='$B')
+ (select count(*) from public.yorisou_user_contexts where owner_account_id='$B');")
[ "$AFTER_B" = "5" ] && pass "B's five rows are untouched" || fail "erasure blast radius" "B has $AFTER_B of 5"
: "$BSID $BGID $BRID"

echo
[ "$FAILURES" = "0" ] && echo "[osf1] PASS" || { echo "[osf1] FAIL — $FAILURES"; exit 1; }
