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
RID=$(Q -c "select public.yorisou_osf1_reflection_create('$A', '$XID', null, 'postmortem', '説明がうまくいかなかった',
              null, null, '翌日に話せた', 'まず書き出す', 'ちゃんと伝えたかった', '相手の状況は知らなかった',
              '黙るか、その場で聞き返すか', 'その場では黙った', '空気を壊したくなかった', '先に書くと落ち着く');")
[ -n "$RID" ] && pass "created a reflection with all seven answers" || fail "reflection" "no id"
ONLY=$(Q -c "select public.yorisou_osf1_reflection_create('$A', null, null, 'light', '書いておきたいことがあった', null, null, null, null);")
[ -n "$ONLY" ] && pass "a reflection with only the first answer is accepted" || fail "partial reflection" "refused"
if Q -c "select public.yorisou_osf1_reflection_create('$A', null, null, 'light', '   ', null, null, null, null);" >/dev/null 2>&1; then
  fail "reflection" "an empty first answer was accepted"
else
  pass "an empty first answer is refused"
fi

# PERMISSION BOUNDARY: B may not attach a reflection to A's experience.
if Q -c "select public.yorisou_osf1_reflection_create('$B', '$XID', null, 'light', 'のぞき見', null, null, null, null);" >/dev/null 2>&1; then
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
BRID=$(Q -c "select public.yorisou_osf1_reflection_create('$B', null, null, 'light', 'べつの人の記録', null, null, null, null);")
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

# ── 12. ACTIVATION PACKAGE: audit trail, five-question reflection, cross-user isolation ─────
echo "[osf1] audit trail"
AUD=$(Q -c "select public.yorisou_osf1_audit_write('$A','yorisou.life.goal.created','goal',null,'user_created','{}'::jsonb);")
[ -n "$AUD" ] && pass "an audit event is written" || fail "audit" "no id returned"
FP=$(Q -c "select actor_fingerprint from public.yorisou_life_os_audit_events where id='$AUD';")
EXPECT=$(Q -c "select encode(sha256(convert_to('$A','utf8')),'hex');")
[ "$FP" = "$EXPECT" ] && pass "the actor is stored as a fingerprint, not an account id" || fail "audit fingerprint" "mismatch"
RAW=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where actor_fingerprint = '$A';")
[ "$RAW" = "0" ] && pass "the raw account id appears nowhere in the audit table" || fail "audit" "raw id stored"
# Append-only: the trigger must refuse both.
if Q -c "update public.yorisou_life_os_audit_events set reason='changed' where id='$AUD';" >/dev/null 2>&1; then
  fail "audit append-only" "an audit row was UPDATEd"; else pass "an audit row cannot be updated"; fi
if Q -c "delete from public.yorisou_life_os_audit_events where id='$AUD';" >/dev/null 2>&1; then
  fail "audit append-only" "an audit row was DELETEd"; else pass "an audit row cannot be deleted"; fi
# The action namespace is constrained by the database, not only by TypeScript.
if Q -c "select public.yorisou_osf1_audit_write('$A','yorisou.exp.landing_viewed','goal',null,'x','{}'::jsonb);" >/dev/null 2>&1; then
  fail "audit namespace" "a canonical yorisou.exp.* event was accepted"; else pass "the canonical yorisou.exp.* namespace is refused"; fi
# Privilege matrix, same shape as the rest.
RLS=$(Q -c "select relrowsecurity from pg_class where relname='yorisou_life_os_audit_events' and relnamespace='public'::regnamespace;")
[ "$RLS" = "t" ] && pass "yorisou_life_os_audit_events: RLS enabled" || fail "audit RLS" "got $RLS"
for r in anon authenticated; do
  H=$(Q -c "select has_table_privilege('$r','public.yorisou_life_os_audit_events','select');")
  [ "$H" = "f" ] || fail "audit privileges" "$r can select"
done
pass "anon/authenticated cannot read the audit table"

echo "[osf1] five-question reflection"
R5=$(Q -c "select public.yorisou_osf1_reflection_create('$B',null,null,'light','あったこと','感じたこと','試したこと','そのあと','次に活かせること');")
[ -n "$R5" ] && pass "a five-answer reflection is created" || fail "reflection" "no id"
FELT=$(Q -c "select felt from public.yorisou_life_reflections where id='$R5';")
TRIED=$(Q -c "select tried from public.yorisou_life_reflections where id='$R5';")
[ "$FELT" = "感じたこと" ] && pass "felt is stored" || fail "felt" "got '$FELT'"
[ "$TRIED" = "試したこと" ] && pass "tried is stored" || fail "tried" "got '$TRIED'"
ORPHAN=$(Q -c "select coalesce(goal_at_the_time,'')||coalesce(information_at_hand,'')||coalesce(why,'') from public.yorisou_life_reflections where id='$R5';")
[ -z "$ORPHAN" ] && pass "the retained columns stay null and are not written by the five-question flow" || fail "retained columns" "got '$ORPHAN'"

# The deep postmortem is the SECOND mode, not a removed one: same table, same RPC, the four
# decision columns written and felt/tried left null. If a future change drops the postmortem
# parameters from the RPC, this call fails and the mode is provably gone.
RP=$(Q -c "select public.yorisou_osf1_reflection_create('$B',null,null,'postmortem','あったこと',null,null,'そのあと',null,'そのときの目標','手元にあった情報',null,'決めたこと','その理由','学んだこと');")
[ -n "$RP" ] && pass "a seven-answer postmortem reflection is created" || fail "postmortem" "no id"
DEEP=$(Q -c "select coalesce(goal_at_the_time,'')||'|'||coalesce(information_at_hand,'')||'|'||coalesce(decision_made,'')||'|'||coalesce(why,'')||'|'||coalesce(what_learned,'') from public.yorisou_life_reflections where id='$RP';")
[ "$DEEP" = "そのときの目標|手元にあった情報|決めたこと|その理由|学んだこと" ] \
  && pass "the postmortem stores what was known and what was decided, separately from the outcome" \
  || fail "postmortem columns" "got '$DEEP'"
LIGHTONLY=$(Q -c "select coalesce(felt,'')||coalesce(tried,'') from public.yorisou_life_reflections where id='$RP';")
[ -z "$LIGHTONLY" ] && pass "the postmortem leaves the light-only columns null" || fail "postmortem" "got '$LIGHTONLY'"
BOTH=$(Q -c "select count(*) from public.yorisou_life_reflections where id in ('$R5','$RP');")
[ "$BOTH" = "2" ] && pass "both modes persist to the one table — no second reflection table exists" || fail "reflection storage" "got $BOTH"

echo "[osf1] cross-user isolation — user A must not reach user B"
C='osf1-owner-c-iso'
CS=$(Q -c "select public.yorisou_osf1_current_state_create('$C', array['steady'], null,null,null,null,'manual');")
CG=$(Q -c "select public.yorisou_osf1_goal_create('$C','Cの方向',null);")
CR=$(Q -c "select public.yorisou_osf1_reflection_create('$C',null,null,'light','Cの記録',null,null,null,null);")
CD=$(Q -c "select encode(sha256(convert_to('Cの記憶','utf8')),'hex');")
CM=$(Q -c "select public.yorisou_osf1_memory_confirm('$C','preference','Cの記憶','user_statement','$CD',true,null,null,null);")
# Every owner-scoped mutation must refuse when the owner is someone else.
X=$(Q -c "select public.yorisou_osf1_goal_set_status('$B','$CG','paused');")
[ "$X" = "f" ] && pass "B cannot change C's goal status" || fail "isolation goal" "got $X"
X=$(Q -c "select public.yorisou_osf1_memory_delete('$B','$CM');")
[ "$X" = "f" ] && pass "B cannot delete C's memory" || fail "isolation memory" "got $X"
X=$(Q -c "select public.yorisou_osf1_current_state_set_reflection('$B','$CS','のぞき見');")
[ "$X" = "f" ] && pass "B cannot annotate C's state record" || fail "isolation state" "got $X"
if Q -c "select public.yorisou_osf1_memory_confirm('$B','reflection','x','user_statement','$(Q -c "select encode(sha256(convert_to('x','utf8')),'hex');")',true,null,null,'$CR');" >/dev/null 2>&1; then
  fail "isolation reflection subject" "B attached a memory to C's reflection"; else pass "B cannot reference C's reflection as a memory subject"; fi
# And C's rows are all still there.
LEFT=$(Q -c "select (select count(*) from yorisou_current_state_records where owner_account_id='$C')+(select count(*) from yorisou_goals where owner_account_id='$C')+(select count(*) from yorisou_life_reflections where owner_account_id='$C')+(select count(*) from yorisou_explicit_memories where owner_account_id='$C');")
[ "$LEFT" = "4" ] && pass "C's four records are untouched by every attempt" || fail "isolation" "C has $LEFT of 4"

# ── 13. COMPLETION PACKAGE: the reflection mode is a column now ──────────────────────────────
#
# The mode used to be carried only as an audit `reason` that the application never actually set, so
# every postmortem was recorded as `light`. These assert the COLUMN — an abandoned postmortem and a
# light reflection are byte-identical across the answer columns, so nothing else can tell them apart.
echo "[osf1] reflection mode"
D='osf1-owner-d'
DLIGHT=$(Q -c "select public.yorisou_osf1_reflection_create('$D', null, null, 'light', 'かるく書いた', 'すこし疲れた', '早めに休んだ', 'よく眠れた', '次も早めに休む');")
MODE=$(Q -c "select mode from public.yorisou_life_reflections where id='$DLIGHT';")
[ "$MODE" = "light" ] && pass "a light reflection is stored as light" || fail "mode" "got '$MODE'"
DPOST=$(Q -c "select public.yorisou_osf1_reflection_create('$D', null, null, 'postmortem', 'ふりかえった', null, null,
                'そのあと落ち着いた', '次は先に伝える', 'そのときの目標', '手元にあった情報',
                '待つか、先に伝えるか', '待つことにした', null, null);")
MODE=$(Q -c "select mode from public.yorisou_life_reflections where id='$DPOST';")
[ "$MODE" = "postmortem" ] && pass "a postmortem reflection is stored as postmortem" || fail "mode" "got '$MODE'"
ERR=$(Q -c "select public.yorisou_osf1_reflection_create('$D', null, null, 'deep', 'ありえないモード', null, null, null, null);" 2>&1 >/dev/null || true)
case "$ERR" in
  *osf1_reflection_mode_invalid*) pass "an unknown mode raises osf1_reflection_mode_invalid" ;;
  *) fail "reflection mode" "expected osf1_reflection_mode_invalid, got: $(printf '%s' "$ERR" | head -1)" ;;
esac
# A caller that says nothing gets the light flow — the mode must never come out null or empty.
DNULL=$(Q -c "select public.yorisou_osf1_reflection_create('$D', null, null, null, 'モードを言わなかった', null, null, null, null);")
MODE=$(Q -c "select mode from public.yorisou_life_reflections where id='$DNULL';")
[ "$MODE" = "light" ] && pass "a null mode defaults to light" || fail "mode default" "got '$MODE'"
# The check constraint, reached directly — the vocabulary does not depend on the RPC.
if Q -c "insert into public.yorisou_life_reflections (owner_account_id, what_happened, mode)
         values ('$D', '直接書いた', 'deep');" >/dev/null 2>&1; then
  fail "mode constraint" "a direct insert stored an unknown mode"
else
  pass "an unknown mode cannot exist even by direct insert"
fi

# options_considered is the postmortem's one new answer. A decision can only be judged against the
# alternatives that existed at the time, so the light flow has no use for it and must leave it alone.
OPTS=$(Q -c "select options_considered from public.yorisou_life_reflections where id='$DPOST';")
[ "$OPTS" = "待つか、先に伝えるか" ] && pass "options_considered round-trips" || fail "options" "got '$OPTS'"
LIGHTOPTS=$(Q -c "select coalesce(options_considered,'(null)') from public.yorisou_life_reflections where id='$DLIGHT';")
[ "$LIGHTOPTS" = "(null)" ] && pass "the light flow leaves options_considered null" || fail "light options" "got '$LIGHTOPTS'"

# ── 14. COMPLETION PACKAGE: `lesson` joins the memory vocabulary ─────────────────────────────
#
# A lesson is what someone concluded: the kind of memory a reflection most often produces, and the
# one the flow previously had nowhere to put.
echo "[osf1] memory vocabulary"
LESSON='先に書き出してから話す'
LDIG=$(Q -c "select encode(sha256(convert_to('$LESSON','utf8')),'hex');")
LMID=$(Q -c "select public.yorisou_osf1_memory_confirm('$D','lesson','$LESSON','user_statement','$LDIG',true,null,null,null);")
TYPE=$(Q -c "select memory_type from public.yorisou_explicit_memories where id='$LMID';")
[ "$TYPE" = "lesson" ] && pass "'lesson' is accepted and stored as itself" || fail "lesson" "got '$TYPE'"
# Widening the vocabulary must not have opened it.
if Q -c "select public.yorisou_osf1_memory_confirm('$D','insight','$LESSON','user_statement','$LDIG',true,null,null,null);" >/dev/null 2>&1; then
  fail "memory vocabulary" "an unrecognised memory_type was accepted"
else
  pass "an unrecognised memory_type is still refused"
fi
if Q -c "insert into public.yorisou_explicit_memories
           (owner_account_id, memory_type, content, source, user_confirmed, confirmation_digest)
         values ('$D','insight','$LESSON','user_statement',true,'$LDIG');" >/dev/null 2>&1; then
  fail "memory vocabulary" "a direct insert stored an unrecognised memory_type"
else
  pass "the rewritten check constraint still refuses an unrecognised type by direct insert"
fi

# ── 15. COMPLETION PACKAGE: the audit row is written by the mutation itself ──────────────────
#
# Four mutations now write their own audit row instead of leaving it to the caller. E is a fresh
# owner, so every count below is scoped to a fingerprint with no other history: 1 means exactly one.
echo "[osf1] transactional audit"
E='osf1-owner-e'
EFP=$(Q -c "select encode(sha256(convert_to('$E','utf8')),'hex');")
ERID=$(Q -c "select public.yorisou_osf1_reflection_create('$E', null, null, 'light', 'Eの記録', null, null, null, null);")
N=$(Q -c "select count(*) from public.yorisou_life_os_audit_events
           where actor_fingerprint='$EFP' and action='yorisou.life.reflection.created'
             and entity_kind='reflection' and entity_ref='$ERID';")
[ "$N" = "1" ] && pass "reflection.created: one audit row, pointing at the reflection that was written" \
  || fail "reflection audit" "got $N"
# The reason code is the mode — the one fact the audit row exists to carry, and the one it used to
# get wrong for every postmortem ever written.
EPID=$(Q -c "select public.yorisou_osf1_reflection_create('$E', null, null, 'postmortem', 'Eのふりかえり', null, null, null, null);")
REASON=$(Q -c "select reason from public.yorisou_life_os_audit_events where entity_ref='$EPID';")
[ "$REASON" = "postmortem" ] && pass "a postmortem is audited as a postmortem, not as light" || fail "audit reason" "got '$REASON'"

ECONT='しずかな時間がいる'
EDIG=$(Q -c "select encode(sha256(convert_to('$ECONT','utf8')),'hex');")
EMID=$(Q -c "select public.yorisou_osf1_memory_confirm('$E','lesson','$ECONT','user_statement','$EDIG',true,null,null,null);")
N=$(Q -c "select count(*) from public.yorisou_life_os_audit_events
           where actor_fingerprint='$EFP' and action='yorisou.life.memory.confirmed'
             and entity_kind='memory' and entity_ref='$EMID';")
[ "$N" = "1" ] && pass "memory.confirmed: one audit row, pointing at the memory that was stored" \
  || fail "memory confirm audit" "got $N"

ENEXT='しずかな時間を先に決めておく'
ENDIG=$(Q -c "select encode(sha256(convert_to('$ENEXT','utf8')),'hex');")
UPD=$(Q -c "select public.yorisou_osf1_memory_update('$E','$EMID','$ENEXT','$ENDIG');")
[ "$UPD" = "t" ] && pass "an owner can edit their own memory" || fail "memory update" "got $UPD"
N=$(Q -c "select count(*) from public.yorisou_life_os_audit_events
           where actor_fingerprint='$EFP' and action='yorisou.life.memory.updated'
             and entity_kind='memory' and entity_ref='$EMID';")
[ "$N" = "1" ] && pass "memory.updated: one audit row for the memory that changed" || fail "memory update audit" "got $N"

DEL=$(Q -c "select public.yorisou_osf1_memory_delete('$E','$EMID');")
[ "$DEL" = "t" ] && pass "an owner can delete their own memory" || fail "memory delete" "got $DEL"
N=$(Q -c "select count(*) from public.yorisou_life_os_audit_events
           where actor_fingerprint='$EFP' and action='yorisou.life.memory.deleted'
             and entity_kind='memory' and entity_ref='$EMID';")
[ "$N" = "1" ] && pass "memory.deleted: one audit row for the memory that is now gone" || fail "memory delete audit" "got $N"
# After a hard delete the audit row is the only remaining evidence, so it has to outlive its subject.
GONE=$(Q -c "select count(*) from public.yorisou_explicit_memories where id='$EMID';")
[ "$GONE" = "0" ] && pass "the memory row is gone while its three audit rows remain" || fail "memory delete" "$GONE rows remain"
# The account id must not reach the audit table by any of the four new paths.
RAW=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where actor_fingerprint in ('$D','$E');")
[ "$RAW" = "0" ] && pass "the actor is the fingerprint on every new path, never the account id" || fail "audit fingerprint" "$RAW rows hold a raw id"
DETAIL=$(Q -c "select count(*) from public.yorisou_life_os_audit_events
                where entity_ref='$EMID' and detail->>'memory_type'='lesson';")
[ "$DETAIL" = "2" ] && pass "confirm and delete record the memory TYPE" || fail "audit detail" "got $DETAIL of 2"
# ...and never the sentence. A deletion trace that resurrects what the deletion removed is not one.
LEAK=$(Q -c "select count(*) from public.yorisou_life_os_audit_events
              where detail::text like '%$ECONT%' or detail::text like '%$ENEXT%';")
[ "$LEAK" = "0" ] && pass "no audit row carries the memory's text" || fail "audit leak" "$LEAK rows do"

# ── 16. COMPLETION PACKAGE: transactional PROVEN, by breaking the audit insert ───────────────
#
# "Transactional" means: if the audit row cannot be written, the mutation does not happen. Asserting
# that the call raised would prove only that something raised — it would pass just as happily if the
# row had been written and then left behind. So each check below looks at what SURVIVED.
#
# psql runs a multi-statement -c inside ONE transaction, which is what makes this work: the trigger,
# the mutation and the failed audit insert live or die together, and the CREATE TRIGGER is rolled
# back with them rather than leaking into every later assertion.
echo "[osf1] transactional audit — rollback"
F='osf1-owner-f'
# Runs one mutation with the audit insert deliberately broken, and asserts the break actually fired.
# Without that assertion "nothing survived" would also be satisfied by a mutation that never ran.
with_broken_audit() {
  BROKE=$(Q -c "create trigger osf1_audit_break before insert on public.yorisou_life_os_audit_events
                  for each row execute function public.yorisou_life_os_audit_block_mutation();
                $2" 2>&1 >/dev/null || true)
  case "$BROKE" in
    *append_only*) pass "$1: the audit insert failed, as arranged" ;;
    *) fail "$1" "the arranged audit failure never fired: $(printf '%s' "$BROKE" | head -1)" ;;
  esac
}
CANARY='ロールバックされるはずの記録'
with_broken_audit "reflection create" "select public.yorisou_osf1_reflection_create('$F', null, null, 'light', '$CANARY', null, null, null, null);"
LEFT=$(Q -c "select count(*) from public.yorisou_life_reflections where what_happened='$CANARY';")
[ "$LEFT" = "0" ] && pass "no reflection survived — it is not written when its audit row cannot be" \
  || fail "reflection rollback" "$LEFT rows survived a failed audit"
TRG=$(Q -c "select count(*) from pg_trigger where tgname='osf1_audit_break';")
[ "$TRG" = "0" ] && pass "the break trigger rolled back too, so nothing leaks into later checks" \
  || fail "rollback" "the break trigger survived"
# CONTROL: the identical call must succeed with the audit table working, or the check above is empty.
Q -c "select public.yorisou_osf1_reflection_create('$F', null, null, 'light', '$CANARY', null, null, null, null);" >/dev/null
LEFT=$(Q -c "select count(*) from public.yorisou_life_reflections where what_happened='$CANARY';")
[ "$LEFT" = "1" ] && pass "the same call persists once the audit table works (control holds)" || fail "control" "got $LEFT"

FCONT='保存されてはならない記憶'
FDIG=$(Q -c "select encode(sha256(convert_to('$FCONT','utf8')),'hex');")
with_broken_audit "memory confirm" "select public.yorisou_osf1_memory_confirm('$F','lesson','$FCONT','user_statement','$FDIG',true,null,null,null);"
LEFT=$(Q -c "select count(*) from public.yorisou_explicit_memories where owner_account_id='$F' and content='$FCONT';")
[ "$LEFT" = "0" ] && pass "no memory survived — a confirmation is not stored without its audit row" \
  || fail "memory confirm rollback" "$LEFT rows survived a failed audit"

# The sharpest case. After a hard delete the audit row is all that is left, so a delete whose audit
# row fails must not take the memory with it.
FKEEP='残らなければならない記憶'
FKDIG=$(Q -c "select encode(sha256(convert_to('$FKEEP','utf8')),'hex');")
FMID=$(Q -c "select public.yorisou_osf1_memory_confirm('$F','lesson','$FKEEP','user_statement','$FKDIG',true,null,null,null);")
with_broken_audit "memory delete" "select public.yorisou_osf1_memory_delete('$F','$FMID');"
STILL=$(Q -c "select count(*) from public.yorisou_explicit_memories where id='$FMID';")
[ "$STILL" = "1" ] && pass "the memory is still there — a deletion without its audit row does not happen" \
  || fail "memory delete rollback" "the memory was deleted with no audit row to show for it"
FNEW='書き換えられてはならない'
FNDIG=$(Q -c "select encode(sha256(convert_to('$FNEW','utf8')),'hex');")
with_broken_audit "memory update" "select public.yorisou_osf1_memory_update('$F','$FMID','$FNEW','$FNDIG');"
NOW=$(Q -c "select content from public.yorisou_explicit_memories where id='$FMID';")
[ "$NOW" = "$FKEEP" ] && pass "the sentence is unchanged — an edit without its audit row does not happen" \
  || fail "memory update rollback" "got '$NOW'"

# ── 17. COMPLETION PACKAGE: an edit replaces the sentence, so an edit re-confirms ────────────
echo "[osf1] memory edit"
G='osf1-owner-g'
GFIRST='はじめに書いた文'
GDIG=$(Q -c "select encode(sha256(convert_to('$GFIRST','utf8')),'hex');")
GMID=$(Q -c "select public.yorisou_osf1_memory_confirm('$G','lesson','$GFIRST','user_statement','$GDIG',true,null,null,null);")
GNEW='書きなおした文'
GNDIG=$(Q -c "select encode(sha256(convert_to('$GNEW','utf8')),'hex');")
UPD=$(Q -c "select public.yorisou_osf1_memory_update('$G','$GMID','$GNEW','$GNDIG');")
[ "$UPD" = "t" ] && pass "the owner's edit is applied" || fail "memory update" "got $UPD"
NOW=$(Q -c "select content from public.yorisou_explicit_memories where id='$GMID';")
[ "$NOW" = "$GNEW" ] && pass "the new sentence replaced the old one" || fail "memory update" "got '$NOW'"
MOVED=$(Q -c "select updated_at > created_at from public.yorisou_explicit_memories where id='$GMID';")
[ "$MOVED" = "t" ] && pass "updated_at moved past created_at" || fail "updated_at" "got $MOVED"
# The digest is recomputed over the bytes actually stored, exactly as at creation: an edit replaces
# what the person agreed to, so it needs the same act of agreement.
MATCHES=$(Q -c "select confirmation_digest = encode(sha256(convert_to(content,'utf8')),'hex')
                 from public.yorisou_explicit_memories where id='$GMID';")
[ "$MATCHES" = "t" ] && pass "the stored digest matches the stored sentence after the edit" || fail "digest" "got $MATCHES"
STALE=$(Q -c "select count(*) from public.yorisou_explicit_memories where id='$GMID' and confirmation_digest='$GDIG';")
[ "$STALE" = "0" ] && pass "the previous sentence's digest is not left behind on the row" || fail "digest" "the stale digest survived"
# Shown one sentence, saved another — refused on the edit path too.
ERR=$(Q -c "select public.yorisou_osf1_memory_update('$G','$GMID','べつの文','$GNDIG');" 2>&1 >/dev/null || true)
case "$ERR" in
  *osf1_memory_confirmation_mismatch*) pass "a digest that does not match the new content raises osf1_memory_confirmation_mismatch" ;;
  *) fail "edit digest" "expected osf1_memory_confirmation_mismatch, got: $(printf '%s' "$ERR" | head -1)" ;;
esac
NOW=$(Q -c "select content from public.yorisou_explicit_memories where id='$GMID';")
[ "$NOW" = "$GNEW" ] && pass "and the refused edit changed nothing" || fail "edit digest" "got '$NOW'"

# ── 18. COMPLETION PACKAGE: the new paths stop at the owner, and audit nothing when they do ──
echo "[osf1] cross-user isolation — the edit and delete paths"
TAKE='のっとり'
TDIG=$(Q -c "select encode(sha256(convert_to('$TAKE','utf8')),'hex');")
X=$(Q -c "select public.yorisou_osf1_memory_update('$B','$CM','$TAKE','$TDIG');")
[ "$X" = "f" ] && pass "B cannot edit C's memory" || fail "isolation memory update" "got $X"
CNOW=$(Q -c "select content from public.yorisou_explicit_memories where id='$CM';")
[ "$CNOW" = "Cの記憶" ] && pass "C's sentence is exactly as C left it" || fail "isolation memory update" "got '$CNOW'"
X=$(Q -c "select public.yorisou_osf1_memory_update('$F','$GMID','$TAKE','$TDIG');")
[ "$X" = "f" ] && pass "F cannot edit G's memory either" || fail "isolation memory update" "got $X"
# An unmatched mutation must audit NOTHING. The table is append-only, so a `memory.updated` or
# `memory.deleted` row manufactured against someone else's id could never be taken back out again.
#
# PRECONDITION first: G's own edit in section 17 did leave an audit row for this id, so a count of
# zero below means "the refused mutation wrote nothing" rather than "this query never finds a row".
# The matching proof for the delete shape is section 15, where a real deletion produced exactly one.
OWN=$(Q -c "select count(*) from public.yorisou_life_os_audit_events
             where entity_ref='$GMID' and action='yorisou.life.memory.updated';")
[ "$OWN" = "1" ] && pass "G's own edit did leave an audit row (precondition)" \
  || fail "PRECONDITION isolation audit" "expected 1, got $OWN — the checks below would be vacuous"
N=$(Q -c "select count(*) from public.yorisou_life_os_audit_events
           where entity_ref='$CM' and action='yorisou.life.memory.updated';")
[ "$N" = "0" ] && pass "the refused edit of C's memory wrote no audit row" || fail "isolation audit" "$N rows were written"
X=$(Q -c "select public.yorisou_osf1_memory_delete('$F','$GMID');")
[ "$X" = "f" ] && pass "F cannot delete G's memory" || fail "isolation memory delete" "got $X"
N=$(Q -c "select count(*) from public.yorisou_life_os_audit_events
           where entity_ref='$GMID' and action='yorisou.life.memory.deleted';")
[ "$N" = "0" ] && pass "and a delete that matched nothing wrote no audit row" || fail "isolation audit" "$N deletion records were manufactured"
STILL=$(Q -c "select count(*) from public.yorisou_explicit_memories where id='$GMID' and content='$GNEW';")
[ "$STILL" = "1" ] && pass "G's memory is still there, unedited" || fail "isolation" "G's memory did not survive"

# ── 19. COMPLETION PACKAGE: one function per name, and who may call it ───────────────────────
#
# Every affected function was DROPPED by its exact old signature and recreated once. A missed drop
# leaves an overload that PostgREST can dispatch to by JSON key set — and the old bodies have no
# audit write in them, so that mutation would happen with no trace and under no grant anyone
# reviewed. Counting pg_proc is the only way to see it.
echo "[osf1] function identity and grants"
for fn in yorisou_osf1_reflection_create yorisou_osf1_memory_confirm yorisou_osf1_memory_delete yorisou_osf1_memory_update; do
  N=$(Q -c "select count(*) from pg_proc
             where pronamespace='public'::regnamespace and proname='$fn';")
  [ "$N" = "1" ] && pass "$fn: exactly one function of that name" || fail "$fn overloads" "found $N"
  for role in anon authenticated; do
    HAS=$(Q -c "select count(*) from pg_proc p where p.pronamespace='public'::regnamespace and p.proname='$fn'
                  and has_function_privilege('$role', p.oid, 'execute');")
    [ "$HAS" = "0" ] || fail "$fn executable by $role" "expected none"
  done
  SVC=$(Q -c "select count(*) from pg_proc p where p.pronamespace='public'::regnamespace and p.proname='$fn'
                and has_function_privilege('service_role', p.oid, 'execute');")
  [ "$SVC" = "1" ] || fail "$fn not executable by service_role" "the one role that may call it cannot"
done
pass "the four completion RPCs are single-signature, denied to anon and authenticated, granted to service_role"

echo
[ "$FAILURES" = "0" ] && echo "[osf1] PASS" || { echo "[osf1] FAIL — $FAILURES"; exit 1; }
