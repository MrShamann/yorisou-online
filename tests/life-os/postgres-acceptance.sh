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

# TWO WAYS TO GET A DATABASE, AND THE REASON FOR BOTH.
#
# LOCAL (default): build a throwaway cluster with initdb. Zero setup, which is what makes this
# runnable as evidence rather than as an aspiration.
#
# CI (OSF1_DATABASE_URL set): use the runner's PostgreSQL service container. GitHub's runners have
# no Homebrew PostgreSQL and initdb'ing one per job would be slow and brittle, so the harness takes
# a DSN instead — the same shape as the repository's four postgres-integration.sh harnesses.
#
# The guard on the supplied DSN is deliberately the same three-clause shape those four use: it must
# not be a Supabase host, it must be localhost, and it must name this harness's own database. A
# harness that can be pointed at a real database by setting one variable is a harness that will
# eventually be pointed at one.
if [ -n "${OSF1_DATABASE_URL:-}" ]; then
  case "$OSF1_DATABASE_URL" in
    *supabase.co*) echo "refusing: OSF1_DATABASE_URL points at a Supabase host" >&2; exit 1 ;;
  esac
  case "$OSF1_DATABASE_URL" in
    *@localhost:*|*@127.0.0.1:*) : ;;
    *) echo "refusing: OSF1_DATABASE_URL is not a local database" >&2; exit 1 ;;
  esac
  case "$OSF1_DATABASE_URL" in
    *osf1_acceptance*) : ;;
    *) echo "refusing: OSF1_DATABASE_URL must name the disposable database osf1_acceptance" >&2; exit 1 ;;
  esac
  DSN="$OSF1_DATABASE_URL"
  cleanup() { :; }   # the runner disposes of its own service container
  trap - EXIT
  MAJOR="$(psql "$DSN" -t -A -X -c 'show server_version;' | cut -d. -f1)"
  case "$MAJOR" in
    16|17) : ;;
    *) echo "refusing: need PostgreSQL 16 or 17 (Production runs 17); found $MAJOR" >&2; exit 1 ;;
  esac
  echo "[osf1] using the supplied disposable database (PostgreSQL $MAJOR)"
else
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
  echo "[osf1] built a throwaway cluster (PostgreSQL $MAJOR)"
fi
mkdir -p "$WORK"
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

# ── 3b. Regression: a PRIVATE card written by /life/experience has a NULL state_context ──────
#
# Making state_context nullable is what let the audit's one BLOCKING defect exist:
# discoverExperiences read every own card's state_context with no null filter and called
# .replace on it, so /experiences 500'd for anyone who had used the new form. The fix is a
# `state_context=not.is.null` filter plus a null-tolerant tokeniser; this asserts the shape the
# filter depends on, so a future migration that re-forbids or re-permits nulls is noticed here.
echo "[osf1] private-card null state_context"
NULLC=$(Q -c "select count(*) from public.yorisou_experience_cards
               where owner_account_id='$A' and visibility='PRIVATE' and state_context is null;")
[ "$NULLC" = "1" ] && pass "a PRIVATE card legitimately holds a null state_context" \
  || fail "null state_context" "expected 1, got $NULLC — the discover null-filter assumption changed"
# The same query discoverExperiences issues, with the fix's filter applied: it must exclude that row.
FILTERED=$(Q -c "select count(*) from public.yorisou_experience_cards
                  where owner_account_id='$A' and deleted_at is null and state_context is not null;")
[ "$FILTERED" = "0" ] && pass "the discover own-state query excludes it, so nothing null reaches the tokeniser" \
  || fail "discover filter" "expected 0 rows, got $FILTERED"
# And a SHARED card still cannot be null — the constraint that keeps the community contract intact.
if Q -c "insert into public.yorisou_experience_cards
           (project_id, owner_account_id, situation, action_tried, perceived_outcome, visibility)
         values ('yorisou','$A','x','y','z','ANONYMOUS_SHARED');" >/dev/null 2>&1; then
  fail "shared card null context" "a SHARED card was accepted without state_context"
else
  pass "a SHARED card still requires the four sharing-context fields"
fi

# ── 3c. PATCH semantics: absent means untouched, clearing is explicit ────────
#
# updateExperience used to share payload() with create, so a patch that mentioned three fields wrote
# the other six to NULL — the caller never asked to erase them, it just did not name them. These
# assert the DATABASE shape the new updateBody() depends on: the three NOT NULL columns cannot be
# cleared at all, and the four sharing-context columns can only be null while the card is PRIVATE.
echo "[osf1] experience patch semantics"
for column in situation action_tried perceived_outcome; do
  NULLABLE=$(Q -c "select is_nullable from information_schema.columns
                    where table_schema='public' and table_name='yorisou_experience_cards'
                      and column_name='$column';")
  [ "$NULLABLE" = "NO" ] && pass "$column is NOT NULL — never clearable by any patch" \
    || fail "$column nullability" "expected NO, got $NULLABLE"
done
for column in state_context limitations may_fit may_not_fit title lesson; do
  NULLABLE=$(Q -c "select is_nullable from information_schema.columns
                    where table_schema='public' and table_name='yorisou_experience_cards'
                      and column_name='$column';")
  [ "$NULLABLE" = "YES" ] || fail "$column nullability" "expected YES, got $NULLABLE"
done
pass "the six clearable columns are nullable"
# Clearing a sharing-context field on a SHARED card must be impossible in the database too, not only
# in updateBody() — the application check is a better error message, not the guarantee.
if Q -c "update public.yorisou_experience_cards set state_context=null
          where id='$XID' and visibility='PRIVATE';" >/dev/null 2>&1 \
   && Q -c "update public.yorisou_experience_cards set visibility='ANONYMOUS_SHARED'
             where id='$XID';" >/dev/null 2>&1; then
  fail "shared context constraint" "a card with a null state_context was made shared"
else
  pass "a card cannot become shared while a sharing-context field is null"
fi

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

# ── 10. REGRESSION REPAIR: the insert shape must work on an UN-MIGRATED schema ───────────────
#
# The activation audit's one blocking defect: payload() named `title` and `lesson` on every insert,
# and those columns only exist after 202608140001. Against any database where it has not run —
# every environment at the time of writing — PostgREST rejected the whole statement, which broke the
# pre-existing /experiences surface as collateral. This builds a SECOND, deliberately un-migrated
# cluster and asserts the two insert shapes behave the way the repair requires.
echo "[osf1] migration-ordering safety (second, un-migrated database)"
PRE="${WORK}/pre"
mkdir -p "$PRE"
if [ -n "${OSF1_DATABASE_URL:-}" ]; then
  # CI: make a sibling database on the same server rather than a second cluster.
  psql "$DSN" -q -X -c "select 1" >/dev/null 2>&1
  PREDB="${DSN%/*}/osf1_acceptance_premigration"
  psql "$DSN" -q -X -c "drop database if exists osf1_acceptance_premigration;" >/dev/null 2>&1 || true
  psql "$DSN" -q -X -c "create database osf1_acceptance_premigration;" >/dev/null 2>&1 || true
else
  createdb -h localhost -p "$PORT" -U postgres osf1_pre >/dev/null 2>&1
  PREDB="postgres://postgres@localhost:$PORT/osf1_pre"
fi
psql "$PREDB" -q -X -c "
  create extension if not exists pgcrypto;
  do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;
  grant usage on schema public to anon, authenticated, service_role;" >/dev/null 2>&1
for f in supabase/migrations/*.sql; do
  case "$(basename "$f")" in 20260814000*) continue ;; esac      # the OSF-1 pair, deliberately withheld
  psql "$PREDB" -q -X -f "$f" >/dev/null 2>&1
done
PRECOLS=$(psql "$PREDB" -t -A -X -c "select count(*) from information_schema.columns where table_name='yorisou_experience_cards' and column_name in ('title','lesson');")
[ "$PRECOLS" = "0" ] && pass "the second database genuinely lacks title/lesson (precondition)" \
  || fail "precondition" "expected 0 columns, got $PRECOLS — the un-migrated case is not being tested"

# The shape payload() builds when NO title/lesson was supplied: must succeed here.
if psql "$PREDB" -q -X -c "insert into public.yorisou_experience_cards
     (project_id,owner_account_id,state_context,situation,action_tried,perceived_outcome,limitations,may_fit,may_not_fit,visibility)
   values ('yorisou','pre','s','sit','act','out','lim','fit','nofit','PRIVATE');" >/dev/null 2>&1; then
  pass "an experience card still saves on a database without the OSF-1 migration"
else
  fail "migration ordering" "the repaired insert shape STILL fails on an un-migrated schema"
fi
# And the shape that caused the outage must still be rejected there — proving the test has force.
if psql "$PREDB" -q -X -c "insert into public.yorisou_experience_cards
     (project_id,owner_account_id,state_context,situation,action_tried,perceived_outcome,limitations,may_fit,may_not_fit,title,lesson,visibility)
   values ('yorisou','pre','s','sit','act','out','lim','fit','nofit',null,null,'PRIVATE');" >/dev/null 2>&1; then
  fail "control" "naming title/lesson SUCCEEDED on an un-migrated schema — the control is broken"
else
  pass "naming title/lesson on an un-migrated schema still fails (control holds)"
fi

# ── 11. REGRESSION REPAIR: metadata and visibility-expansion invariants at the schema ─────────
echo "[osf1] update-path invariants"
# discoverExperiences requires moderation_status='published'; a shared card that keeps 'draft' is
# invisible to everyone. This asserts the value the repaired update path must write.
DRAFTED=$(Q -c "select count(*) from public.yorisou_experience_cards
                 where owner_account_id='$A' and visibility='PRIVATE' and moderation_status<>'draft';")
[ "$DRAFTED" = "0" ] && pass "PRIVATE cards carry moderation_status 'draft'" || fail "moderation_status" "got $DRAFTED unexpected"
# The check constraint still refuses a shared card missing its sharing-context fields, whatever the
# application does — the backstop behind the merged-row check in updateExperience.
#
# On a FRESH row: section 8 erased owner A's cards, so reusing $XID here would UPDATE zero rows and
# report success without testing anything. (It did exactly that on the first run of this block.)
CID=$(Q -c "insert into public.yorisou_experience_cards
              (project_id, owner_account_id, situation, action_tried, perceived_outcome, visibility)
            values ('yorisou','osf1-owner-c','sit','act','out','PRIVATE') returning id;")
[ -n "$CID" ] && pass "fresh PRIVATE card with null sharing context created (precondition)" \
  || fail "precondition" "could not create the fresh card"
if Q -c "update public.yorisou_experience_cards set visibility='ANONYMOUS_SHARED' where id='$CID';" >/dev/null 2>&1; then
  fail "shared-context constraint" "a PRIVATE card with null sharing context was widened to ANONYMOUS_SHARED"
else
  pass "the database refuses to widen a card that lacks its sharing-context fields"
fi
AFFECTED=$(Q -c "select count(*) from public.yorisou_experience_cards where id='$CID' and visibility='PRIVATE';")
[ "$AFFECTED" = "1" ] && pass "the card is still PRIVATE after the refused widening" \
  || fail "shared-context constraint" "the row is not where it should be ($AFFECTED)"

echo
[ "$FAILURES" = "0" ] && echo "[osf1] PASS" || { echo "[osf1] FAIL — $FAILURES"; exit 1; }
