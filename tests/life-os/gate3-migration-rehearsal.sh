#!/usr/bin/env bash
# OSF-1 GATE 3 — migration readiness rehearsal for the whole OSF-1 lineage.
#
# WHAT THIS PROVES THAT tests/life-os/postgres-acceptance.sh DOES NOT.
#
# The acceptance harness proves the lineage APPLIES and that the resulting schema behaves. It has
# never once executed the REVERSE path. Every OSF-1 migration carries a ROLLBACK comment, and until
# now every one of them was an untested assertion — a procedure nobody had run, written by someone
# who was not going to be the one running it at 3am. Gate 3 cannot honestly pass on that.
#
# So this rehearses the full cycle the gate actually asks for:
#
#   baseline (pre-OSF-1 schema)
#     -> apply the OSF-1 lineage in order
#     -> validate
#     -> execute the documented ROLLBACK of 202608160001
#     -> validate the rolled-back state still works
#     -> RE-APPLY
#     -> validate again, identically
#
# The re-apply step is the one that catches the interesting class of defect. A rollback that leaves
# a stale function overload, a dropped constraint that is not recreated, or a column the re-apply
# assumes is absent will pass a one-way test and fail here.
#
#   bash tests/life-os/gate3-migration-rehearsal.sh

set -euo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${OSF1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
PORT="${OSF1_POSTGRES_PORT:-55591}"
WORK="${OSF1_WORK:-/tmp/osf1-gate3}"
export LC_ALL=C PATH="$PGBIN:$PATH"

FAILURES=0
cleanup() { set +e; pg_ctl -D "$WORK/pg" stop >/dev/null 2>&1; rm -rf "$WORK"; }
trap cleanup EXIT
pass() { printf '  ok   %s\n' "$1"; }
fail() { printf '  FAIL %s  %s\n' "$1" "${2:-}"; FAILURES=$((FAILURES+1)); }

# The OSF-1 lineage, in order. Derived from the repository rather than hardcoded prose, so a new
# OSF-1 migration cannot be silently excluded from the gate.
OSF1_MIGRATIONS=$(ls supabase/migrations/*osf1*.sql | sort)
BASELINE_MIGRATIONS=$(ls supabase/migrations/*.sql | sort | grep -v "osf1")

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
  cleanup() { :; }
  trap - EXIT
  echo "[gate3] using the supplied disposable database"
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
  echo "[gate3] built a throwaway cluster (PostgreSQL $MAJOR)"
fi
mkdir -p "$WORK"
Q() { psql "$DSN" -t -A -X -q "$@"; }
APPLY() { psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f "$1" >/dev/null 2>"$WORK/err.txt"; }

Q -c "
  create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";
  do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;
  grant usage on schema public to anon, authenticated, service_role;" >/dev/null

# ── STAGE 1: baseline, WITHOUT any OSF-1 migration ───────────────────────────
#
# Applying the pre-OSF-1 lineage on its own is itself a compatibility assertion: it proves the OSF-1
# migrations are genuinely additive and that nothing earlier depends on them.
echo "[gate3] stage 1 — baseline schema (pre-OSF-1)"
for f in $BASELINE_MIGRATIONS; do
  APPLY "$f" || fail "baseline apply $(basename "$f")" "$(head -2 "$WORK/err.txt" | tr '\n' ' ')"
done
BASE_EXP=$(Q -c "select count(*) from information_schema.tables where table_name='yorisou_experience_cards';")
[ "$BASE_EXP" = "1" ] && pass "the pre-OSF-1 baseline stands on its own" || fail "baseline" "experience cards missing"
LIFE_BEFORE=$(Q -c "select count(*) from information_schema.tables where table_name like 'yorisou_life%' or table_name='yorisou_explicit_memories';")
[ "$LIFE_BEFORE" = "0" ] && pass "no Life OS table exists before the OSF-1 lineage" || fail "baseline" "found $LIFE_BEFORE"

# Seed a pre-OSF-1 experience card. Everything after this must leave it untouched — this row is the
# standing proof that the old /experiences surface survives the whole cycle.
# NOTE the four sharing-context columns. On the BASELINE they are NOT NULL for every card, which is
# precisely what 202608140001 relaxes to required-when-shared. Seeding a baseline-valid row here is
# what makes the later "still intact" assertions meaningful: this row predates the relaxation.
Q -c "insert into public.yorisou_experience_cards
        (owner_account_id, situation, action_tried, perceived_outcome, visibility,
         state_context, limitations, may_fit, may_not_fit)
      values ('acct_legacy','古い状況','古い行動','古い結果','PRIVATE',
              'いまの状況','限界','合うかも','合わないかも');" >/dev/null
LEGACY_ID=$(Q -c "select id from public.yorisou_experience_cards where owner_account_id='acct_legacy';")
[ -n "$LEGACY_ID" ] && pass "seeded a pre-OSF-1 experience card" || fail "seed" "no id"

# ── STAGE 2: apply the OSF-1 lineage ─────────────────────────────────────────
echo "[gate3] stage 2 — apply the OSF-1 lineage in order"
for f in $OSF1_MIGRATIONS; do
  APPLY "$f" && pass "applied $(basename "$f")" \
    || fail "apply $(basename "$f")" "$(head -2 "$WORK/err.txt" | tr '\n' ' ')"
done

# ── The validation block, run identically after apply and after re-apply ─────
validate() {
  local phase="$1"

  # D1. No duplicate RPC overload. A surviving overload is dispatchable by PostgREST and, for the
  # audit-carrying functions, would be a write path with no audit row.
  local dupes
  dupes=$(Q -c "select coalesce(string_agg(proname||'x'||c,','),'') from (
                  select proname, count(*) c from pg_proc p
                  join pg_namespace n on n.oid=p.pronamespace and n.nspname='public'
                  where proname like 'yorisou_osf1_%' group by proname having count(*)>1) s;")
  [ -z "$dupes" ] && pass "$phase: no duplicate RPC overload" || fail "$phase overloads" "$dupes"

  # D2. No PUBLIC EXECUTE on any SECURITY DEFINER mutation RPC. A definer function executable by
  # PUBLIC is a privilege escalation: it runs as its owner for anyone who can reach PostgREST.
  local pub
  pub=$(Q -c "select coalesce(string_agg(p.proname,','),'') from pg_proc p
              join pg_namespace n on n.oid=p.pronamespace and n.nspname='public'
              where p.proname like 'yorisou_osf1_%' and p.prosecdef
                and p.proname <> 'yorisou_osf1_state_vocabulary'
                and has_function_privilege('public', p.oid, 'execute');")
  [ -z "$pub" ] && pass "$phase: no PUBLIC EXECUTE on a SECURITY DEFINER mutation RPC" \
                || fail "$phase PUBLIC EXECUTE" "$pub"

  # D3. anon and authenticated hold no execute on those same functions.
  local leaked=""
  for role in anon authenticated; do
    local got
    got=$(Q -c "select coalesce(string_agg(p.proname,','),'') from pg_proc p
                join pg_namespace n on n.oid=p.pronamespace and n.nspname='public'
                where p.proname like 'yorisou_osf1_%' and p.prosecdef
                  and p.proname <> 'yorisou_osf1_state_vocabulary'
                  and has_function_privilege('$role', p.oid, 'execute');")
    [ -n "$got" ] && leaked="$leaked $role:$got"
  done
  [ -z "$leaked" ] && pass "$phase: anon/authenticated cannot execute any OSF-1 mutation RPC" \
                   || fail "$phase role grants" "$leaked"

  # D4. service_role CAN execute them — the grants match the intended signatures rather than merely
  # denying everyone. A revoke-everything migration would pass D2/D3 and break the product.
  local missing=""
  for fn in yorisou_osf1_reflection_create yorisou_osf1_memory_confirm \
            yorisou_osf1_memory_delete yorisou_osf1_memory_update; do
    local ok
    ok=$(Q -c "select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
               and n.nspname='public' where p.proname='$fn'
               and has_function_privilege('service_role', p.oid, 'execute');")
    [ "$ok" = "1" ] || missing="$missing $fn"
  done
  [ -z "$missing" ] && pass "$phase: service_role holds execute on every OSF-1 mutation RPC" \
                    || fail "$phase service_role grants" "$missing"

  # D5. RLS enabled on every Life OS table.
  local norls
  norls=$(Q -c "select coalesce(string_agg(relname,','),'') from pg_class
                where relnamespace='public'::regnamespace and relkind='r'
                  and (relname like 'yorisou_life%' or relname in
                       ('yorisou_explicit_memories','yorisou_goals','yorisou_user_contexts',
                        'yorisou_current_state_records'))
                  and not relrowsecurity;")
  [ -z "$norls" ] && pass "$phase: RLS enabled on every Life OS table" || fail "$phase RLS" "$norls"

  # D6. The pre-OSF-1 experience card is untouched and the old surface still works.
  local legacy
  legacy=$(Q -c "select situation from public.yorisou_experience_cards where id='$LEGACY_ID';")
  [ "$legacy" = "古い状況" ] && pass "$phase: the pre-OSF-1 experience card is intact" \
                            || fail "$phase legacy card" "got '$legacy'"
  Q -c "insert into public.yorisou_experience_cards
          (owner_account_id, situation, action_tried, perceived_outcome, visibility,
           state_context, limitations, may_fit, may_not_fit)
        values ('acct_legacy2','新しい状況','行動','結果','PRIVATE',
                'いまの状況','限界','合うかも','合わないかも');" >/dev/null 2>&1 \
    && pass "$phase: the old /experiences write path still operates" \
    || fail "$phase legacy write" "insert refused"
  Q -c "delete from public.yorisou_experience_cards where owner_account_id='acct_legacy2';" >/dev/null

  # D7. Memory constraints hold: unconfirmed is impossible, and the type vocabulary is enforced.
  if Q -c "insert into public.yorisou_explicit_memories
             (owner_account_id, memory_type, content, source, user_confirmed, confirmation_digest)
           values ('acct_x','preference','x','user_statement',false,repeat('a',64));" >/dev/null 2>&1; then
    fail "$phase memory constraint" "an unconfirmed memory was stored"
  else
    pass "$phase: an unconfirmed memory is impossible at the schema level"
  fi
}

echo "[gate3] stage 3 — validate the applied lineage"
validate "applied"

# ── Transactional audit rollback, proven by forcing the audit insert to fail ─
#
# The claim under test is that the audit insert shares the mutation's transaction. The only honest
# way to test it is to make the audit insert fail and then look for the domain row. A trigger that
# raises on the audit table is the smallest way to do that without touching the RPC.
echo "[gate3] stage 4 — transactional audit rollback"
Q -c "create or replace function public.gate3_break_audit() returns trigger language plpgsql as \$\$
      begin raise exception 'gate3_forced_audit_failure'; end \$\$;
      create trigger gate3_break before insert on public.yorisou_life_os_audit_events
      for each row execute function public.gate3_break_audit();" >/dev/null

BEFORE=$(Q -c "select count(*) from public.yorisou_life_reflections where owner_account_id='acct_tx';")
if Q -c "select public.yorisou_osf1_reflection_create('acct_tx',null,'light','あったこと',null,null,null,null);" >/dev/null 2>&1; then
  fail "transactional audit" "the reflection was created even though the audit insert failed"
else
  AFTER=$(Q -c "select count(*) from public.yorisou_life_reflections where owner_account_id='acct_tx';")
  [ "$BEFORE" = "$AFTER" ] && pass "a failed audit insert ROLLS BACK the reflection ($AFTER rows)" \
                           || fail "transactional audit" "reflection survived: $BEFORE -> $AFTER"
fi

DIGEST=$(Q -c "select encode(sha256(convert_to('覚えておきたいこと','utf8')),'hex');")
if Q -c "select public.yorisou_osf1_memory_confirm('acct_tx','lesson','覚えておきたいこと','user_statement','$DIGEST',true,null,null,null);" >/dev/null 2>&1; then
  fail "transactional audit" "the memory was created even though the audit insert failed"
else
  M=$(Q -c "select count(*) from public.yorisou_explicit_memories where owner_account_id='acct_tx';")
  [ "$M" = "0" ] && pass "a failed audit insert ROLLS BACK the memory" || fail "transactional audit" "$M rows"
fi

Q -c "drop trigger gate3_break on public.yorisou_life_os_audit_events; drop function public.gate3_break_audit();" >/dev/null
# And with the audit healthy again, the same call must succeed — otherwise the test above proved
# only that the function is broken.
OK_ID=$(Q -c "select public.yorisou_osf1_reflection_create('acct_tx',null,'postmortem','あったこと',null,null,null,null);" 2>/dev/null)
[ -n "$OK_ID" ] && pass "with the audit healthy, the same mutation succeeds" || fail "control" "still failing"
AUD=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where entity_ref='$OK_ID' and action='yorisou.life.reflection.created';")
[ "$AUD" = "1" ] && pass "exactly one audit row accompanies the successful mutation" || fail "audit count" "$AUD"

# ── STAGE 5: the documented ROLLBACK of 202608160001 ─────────────────────────
#
# Executed verbatim from that migration's own ROLLBACK block, minus the two LOSSY column drops which
# it explicitly marks as the unsafe option. If this fails, the documented procedure is wrong.
echo "[gate3] stage 5 — execute the documented rollback of 202608160001"
Q -c "begin;
  drop function if exists public.yorisou_osf1_reflection_create(text, uuid, text, text, text, text, text, text, text, text, text, text, text, text, jsonb);
  drop function if exists public.yorisou_osf1_memory_confirm(text, text, text, text, text, boolean, uuid, uuid, uuid, jsonb);
  drop function if exists public.yorisou_osf1_memory_delete(text, uuid, jsonb);
  drop function if exists public.yorisou_osf1_memory_update(text, uuid, text, text, jsonb);
  commit;" >/dev/null 2>"$WORK/err.txt" \
  && pass "the documented rollback executes cleanly" \
  || fail "rollback" "$(head -2 "$WORK/err.txt" | tr '\n' ' ')"

GONE=$(Q -c "select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace
             and n.nspname='public' where p.proname in
             ('yorisou_osf1_reflection_create','yorisou_osf1_memory_confirm',
              'yorisou_osf1_memory_delete','yorisou_osf1_memory_update');")
[ "$GONE" = "0" ] && pass "rollback removed every function it created — no orphan left behind" \
                  || fail "rollback" "$GONE function(s) survived"

# The rolled-back state must still serve the pre-OSF-1 product. This is what a real rollback is for.
LEG=$(Q -c "select situation from public.yorisou_experience_cards where id='$LEGACY_ID';")
[ "$LEG" = "古い状況" ] && pass "after rollback the pre-OSF-1 experience card is still intact" \
                       || fail "rollback" "legacy card damaged"
# And the data written before the rollback survives it — a rollback of FUNCTIONS must not lose ROWS.
KEPT=$(Q -c "select count(*) from public.yorisou_life_reflections where id='$OK_ID';")
[ "$KEPT" = "1" ] && pass "rows written before the rollback survive it" || fail "rollback" "data lost"
MODE=$(Q -c "select mode from public.yorisou_life_reflections where id='$OK_ID';")
[ "$MODE" = "postmortem" ] && pass "the stored mode survives the rollback" || fail "rollback" "mode='$MODE'"

# ── STAGE 6: RE-APPLY ────────────────────────────────────────────────────────
#
# The step that catches what a one-way test cannot: a re-apply onto a partially-reversed schema.
echo "[gate3] stage 6 — re-apply 202608160001 onto the rolled-back schema"
APPLY supabase/migrations/202608160001_osf1_phase1_completion.sql \
  && pass "202608160001 re-applies onto the rolled-back schema" \
  || fail "re-apply" "$(head -3 "$WORK/err.txt" | tr '\n' ' ')"

echo "[gate3] stage 7 — validate the re-applied lineage (identical checks)"
validate "re-applied"

# The re-applied schema must actually work, not merely exist.
RE_ID=$(Q -c "select public.yorisou_osf1_reflection_create('acct_tx2',null,'postmortem','再適用後',null,null,null,null,null,null,'選択肢');" 2>/dev/null)
[ -n "$RE_ID" ] && pass "the re-applied RPC creates a reflection" || fail "re-apply" "RPC unusable"
OPT=$(Q -c "select options_considered from public.yorisou_life_reflections where id='$RE_ID';")
[ "$OPT" = "選択肢" ] && pass "options_considered round-trips after re-apply" || fail "re-apply" "got '$OPT'"
RE_AUD=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where entity_ref='$RE_ID';")
[ "$RE_AUD" = "1" ] && pass "transactional audit still fires after re-apply" || fail "re-apply audit" "$RE_AUD"

# ── STAGE 8: account erasure still operates across the whole cycle ───────────
echo "[gate3] stage 8 — account erasure after the full cycle"
ERASE_FN=$(Q -c "select count(*) from pg_proc where proname='yorisou_account_deletion_erase_database_unchecked';")
if [ "$ERASE_FN" = "1" ]; then
  # POR-1's erasure is job-scoped: calling it without an existing deletion job raises
  # account_deletion_job_not_found. That is a correctness property of POR-1 (erasure is never a
  # standalone verb), so the job is created first — exactly as the acceptance harness does.
  Q -c "insert into public.yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint)
        values ('acct_tx2', encode(sha256(convert_to('acct_tx2','utf8')),'hex'));" >/dev/null
  Q -c "select public.yorisou_account_deletion_erase_database_unchecked('acct_tx2');" >/dev/null 2>"$WORK/erase.txt" \
    || fail "erasure" "$(head -2 "$WORK/erase.txt" | tr '\n' ' ')"
  LEFT=$(Q -c "select count(*) from public.yorisou_life_reflections where owner_account_id='acct_tx2';")
  [ "$LEFT" = "0" ] && pass "erasure removes Life OS rows after the apply/rollback/re-apply cycle" \
                    || fail "erasure" "$LEFT row(s) survived"
  # The audit trace must SURVIVE erasure — it stores a fingerprint, never an account id.
  TRACE=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where entity_ref='$RE_ID';")
  [ "$TRACE" = "1" ] && pass "the audit trace survives erasure, holding no account id" \
                     || fail "erasure" "audit trace destroyed"
  RAW=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where actor_fingerprint='acct_tx2';")
  [ "$RAW" = "0" ] && pass "no raw account id was ever stored in the audit table" || fail "erasure" "raw id present"
else
  fail "erasure" "the POR-1 erasure function is absent from this lineage"
fi

echo
if [ "$FAILURES" -eq 0 ]; then echo "[gate3] PASS"; else echo "[gate3] FAIL ($FAILURES)"; exit 1; fi
