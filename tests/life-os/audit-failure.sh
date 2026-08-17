#!/usr/bin/env bash
# OSF-1 §10 — transactional audit failure, proven for EVERY action that claims the class.
#
#   bash tests/life-os/audit-failure.sh
#
# WHAT THIS PROVES THAT GATE 3 DOES NOT.
#
# Gate 3 forces the audit insert to fail for TWO of the seven transactional actions —
# reflection.created and memory.confirmed — as one stage of a migration rehearsal. Seven actions
# carry the class in AUDIT_DELIVERY_CLASS, and the five it never touched are the ones where the
# argument for the class is strongest: a delete whose audit row IS the receipt, an update that
# destroys the previous sentence, and the three permission changes.
#
# "It is the same code path" is not evidence. Each of these RPCs decides FOR ITSELF whether to write
# the audit row and where in its body to do it, and two of them (delete, update) write it
# CONDITIONALLY on `found`. A conditional audit is exactly where a mutation can commit with no
# record: get the condition wrong and the row is gone with nothing to show it ever existed.
#
# THE SHAPE OF EACH CASE. Eight properties, in order, for all seven:
#
#   1. the audit insert is forced to fail        5. with the fault removed the same call succeeds
#   2. the RPC fails                             6. the retry succeeds
#   3. the domain mutation is rolled back        7. exactly ONE intended domain result exists
#   4. no audit row exists                       8. no duplicate audit event from the failed attempt
#
# NON-VACUITY IS CHECKED, NOT ASSUMED. Three ways this test could pass while proving nothing, each
# closed below:
#
#   - The call could fail for the wrong reason (a signature mismatch fails identically to a rolled
#     back audit). Every failure is CAPTURED and matched against `osf1_forced_audit_failure`.
#   - The precondition could be absent, making "the row did not change" trivially true. Every case
#     asserts its precondition before arming the fault.
#   - The fault could be breaking the whole database rather than the audit table. Stage 0 proves a
#     non-audit write still succeeds while the fault is armed.
#
# The fault is a trigger on the audit table plus a flag row, so arming and disarming it is a DML
# statement rather than DDL — nothing here is ever part of a migration, and the cluster is thrown
# away at exit.

set -euo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${OSF1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
PORT="${OSF1_AUDIT_FAILURE_PORT:-55594}"
WORK="${OSF1_AUDIT_FAILURE_WORK:-/tmp/osf1-audit-failure}"
export LC_ALL=C PATH="$PGBIN:$PATH"

FAILURES=0
CHECKS=0
cleanup() { set +e; pg_ctl -D "$WORK/pg" stop -m immediate >/dev/null 2>&1; rm -rf "$WORK"; }
trap cleanup EXIT
pass() { CHECKS=$((CHECKS+1)); printf '  ok   %s\n' "$1"; }
fail() { CHECKS=$((CHECKS+1)); FAILURES=$((FAILURES+1)); printf '  FAIL %s  %s\n' "$1" "${2:-}"; }

MAJOR="$("$PGBIN/postgres" --version | awk '{print $3}' | cut -d. -f1)"
case "$MAJOR" in
  16|17) : ;;
  *) echo "refusing: need PostgreSQL 16 or 17 (Production runs 17); found $MAJOR" >&2; exit 1 ;;
esac
rm -rf "$WORK"; mkdir -p "$WORK/pg"
initdb -D "$WORK/pg" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
pg_ctl -D "$WORK/pg" -o "-p $PORT -c listen_addresses='127.0.0.1' -c unix_socket_directories=''" \
  -l "$WORK/pg/log" start >/dev/null
sleep 1
createdb -h 127.0.0.1 -p "$PORT" -U postgres osf1_audit_failure
DSN="postgres://postgres@127.0.0.1:$PORT/osf1_audit_failure"
Q() { psql "$DSN" -t -A -X -q "$@"; }

echo "[audit-failure] 1/4 disposable cluster and the OSF-1 lineage (PostgreSQL $MAJOR)"
Q -c "
  create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";
  do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role anon nologin; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated nologin; exception when duplicate_object then null; end \$\$;
  grant usage on schema public to anon, authenticated, service_role;" >/dev/null
for f in supabase/migrations/*.sql; do
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null 2>"$WORK/err.txt" || {
    echo "[audit-failure] FAILED applying $(basename "$f")" >&2; head -5 "$WORK/err.txt" >&2; exit 1; }
done

# ── The set under test, derived from the SOURCE rather than listed here ───────
#
# AUDIT_DELIVERY_CLASS in lib/server/lifeOs/audit.ts is the declaration of which actions are
# transactional. Reading it here is what stops this harness and the code from drifting: adding an
# eighth transactional action without a case below makes this stage fail rather than silently
# leaving the new action unproven.
echo "[audit-failure] 2/4 the transactional set, read from lib/server/lifeOs/audit.ts"
DECLARED=$(node --input-type=module -e "
  const src = await import('node:fs').then((fs) => fs.readFileSync('lib/server/lifeOs/audit.ts','utf8'));
  const body = src.slice(src.indexOf('AUDIT_DELIVERY_CLASS'));
  const block = body.slice(body.indexOf('{'), body.indexOf('};'));
  const found = [...block.matchAll(/\"(yorisou\.[a-z.]+)\":\s*\"transactional\"/g)].map((m) => m[1]);
  console.log(found.sort().join(' '));
")
COVERED="yorisou.life.memory.confirmed yorisou.life.memory.deleted yorisou.life.memory.restored yorisou.life.memory.revoked yorisou.life.memory.suppressed yorisou.life.memory.updated yorisou.life.reflection.created"
if [ "$DECLARED" = "$COVERED" ]; then
  pass "the seven transactional actions declared in code are exactly the seven proven below"
else
  fail "transactional set drift" "code declares [$DECLARED]"
  echo "         this harness covers  [$COVERED]" >&2
fi

# ── The fault ────────────────────────────────────────────────────────────────
Q -c "
  create table public._osf1_fault (enabled boolean not null);
  insert into public._osf1_fault values (false);
  create function public._osf1_audit_fault() returns trigger language plpgsql as \$\$
  begin
    if (select enabled from public._osf1_fault limit 1) then
      raise exception 'osf1_forced_audit_failure';
    end if;
    return new;
  end \$\$;
  create trigger _osf1_audit_fault before insert on public.yorisou_life_os_audit_events
    for each row execute function public._osf1_audit_fault();" >/dev/null
ARM()    { Q -c "update public._osf1_fault set enabled = true;"  >/dev/null; }
DISARM() { Q -c "update public._osf1_fault set enabled = false;" >/dev/null; }

# Run one SQL expression, capturing stdout AND stderr. Returns 0 on success.
TRY() { psql "$DSN" -t -A -X -q -c "$1" >"$WORK/out.txt" 2>&1; }

# `TRY` failed for the RIGHT reason — the forced audit failure and nothing else.
FORCED() {
  if grep -q "osf1_forced_audit_failure" "$WORK/out.txt"; then return 0; fi
  return 1
}

OWNER=acct_audit_fail

# ── Stage 0: the fault is scoped to the audit table ──────────────────────────
#
# Without this the entire harness could be measuring "the database refuses everything", and every
# rollback assertion below would hold for the wrong reason.
echo "[audit-failure] 3/4 fault scope control"
ARM
if TRY "insert into public.yorisou_current_state_records (owner_account_id, state_tags, mood, energy, source)
        values ('$OWNER', array['steady'], 'calm', 'steady', 'manual');"; then
  pass "with the fault armed, a NON-audit write still succeeds — the fault is scoped to the audit table"
else
  fail "fault scope" "a non-audit write also failed: $(head -2 "$WORK/out.txt" | tr '\n' ' ')"
fi
if TRY "select public.yorisou_osf1_audit_write('$OWNER','yorisou.life.state.created','current_state',null,'x','{}'::jsonb);"; then
  fail "fault scope" "the audit write succeeded while the fault was armed — the fault is not working"
else
  FORCED && pass "with the fault armed, an audit write fails with osf1_forced_audit_failure" \
         || fail "fault scope" "audit write failed for the wrong reason: $(head -2 "$WORK/out.txt" | tr '\n' ' ')"
fi
DISARM

echo "[audit-failure] 4/4 the seven transactional actions"

# ═════════════════════════════════════════════════════════════════════════════
# 1. yorisou.life.reflection.created
# ═════════════════════════════════════════════════════════════════════════════
echo "  -- reflection.created"
MARK="ref-$(date +%s)-$RANDOM"
BEFORE=$(Q -c "select count(*) from public.yorisou_life_reflections where owner_account_id='$OWNER';")
# The precondition the header promises for every case: this owner has no reflection carrying this mark,
# so "exactly one afterwards" cannot be satisfied by something that was already there.
PRE=$(Q -c "select count(*) from public.yorisou_life_reflections where owner_account_id='$OWNER' and what_happened='$MARK';")
[ "$PRE" = "0" ] && pass "reflection.created: the precondition holds — no reflection carries this mark yet" \
                 || fail "reflection.created precondition" "$PRE rows already exist"
ARM
if TRY "select public.yorisou_osf1_reflection_create('$OWNER',null,null,'postmortem','$MARK',null,null,null,null);"; then
  fail "reflection.created" "the reflection was created even though the audit insert failed"
else
  FORCED && pass "reflection.created: the RPC fails with the forced audit failure" \
         || fail "reflection.created" "wrong failure: $(head -2 "$WORK/out.txt" | tr '\n' ' ')"
fi
AFTER=$(Q -c "select count(*) from public.yorisou_life_reflections where owner_account_id='$OWNER';")
[ "$BEFORE" = "$AFTER" ] && pass "reflection.created: the reflection is rolled back ($AFTER rows)" \
                         || fail "reflection.created rollback" "$BEFORE -> $AFTER"
DISARM
# ── WHY THIS CHECK IS HERE AND NOT THREE LINES EARLIER ───────────────────────
#
# It used to run while the fault was ARMED, and while armed NO audit row can exist for any reason
# whatsoever — the trigger refuses every insert. So "no audit row exists after the failed attempt" was
# true by construction and could not tell a rolled-back mutation from a mutation that committed with no
# audit row, which is the entire distinction the harness exists to make. An adversarial review counted
# six assertions with this defect. Run AFTER disarming and BEFORE the retry, the audit table is writable
# again and an orphan row from the failed attempt would be visible.
N=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where reason='postmortem' and action='yorisou.life.reflection.created';")
[ "$N" = "0" ] && pass "reflection.created: no orphan audit row survived the failed attempt (fault disarmed)" \
               || fail "reflection.created audit" "$N rows"
# 5+6. The retry. Same call, nothing else changed.
ID=$(Q -c "select public.yorisou_osf1_reflection_create('$OWNER',null,null,'postmortem','$MARK',null,null,null,null);" 2>/dev/null)
[ -n "$ID" ] && pass "reflection.created: the retry succeeds once the fault is removed" \
             || fail "reflection.created retry" "still failing"
ROWS=$(Q -c "select count(*) from public.yorisou_life_reflections where owner_account_id='$OWNER' and what_happened='$MARK';")
[ "$ROWS" = "1" ] && pass "reflection.created: exactly ONE reflection exists after failure + retry" \
                  || fail "reflection.created duplicate" "$ROWS rows"
EV=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where entity_ref='$ID' and action='yorisou.life.reflection.created';")
[ "$EV" = "1" ] && pass "reflection.created: exactly ONE audit event — the failed attempt left none" \
                || fail "reflection.created audit duplicate" "$EV rows"

# ═════════════════════════════════════════════════════════════════════════════
# 2. yorisou.life.memory.confirmed
# ═════════════════════════════════════════════════════════════════════════════
echo "  -- memory.confirmed"
CONTENT="覚えておきたいこと-$RANDOM"
DIGEST=$(Q -c "select encode(sha256(convert_to('$CONTENT','utf8')),'hex');")
MBEFORE=$(Q -c "select count(*) from public.yorisou_explicit_memories where owner_account_id='$OWNER';")
PRE=$(Q -c "select count(*) from public.yorisou_explicit_memories where owner_account_id='$OWNER' and content='$CONTENT';")
[ "$PRE" = "0" ] && pass "memory.confirmed: the precondition holds — no memory carries this sentence yet" \
                 || fail "memory.confirmed precondition" "$PRE rows already exist"
ARM
if TRY "select public.yorisou_osf1_memory_confirm('$OWNER','lesson','$CONTENT','user_statement','$DIGEST',true,null,null,null);"; then
  fail "memory.confirmed" "the memory was created even though the audit insert failed"
else
  FORCED && pass "memory.confirmed: the RPC fails with the forced audit failure" \
         || fail "memory.confirmed" "wrong failure: $(head -2 "$WORK/out.txt" | tr '\n' ' ')"
fi
MAFTER=$(Q -c "select count(*) from public.yorisou_explicit_memories where owner_account_id='$OWNER';")
[ "$MBEFORE" = "$MAFTER" ] && pass "memory.confirmed: the memory is rolled back ($MAFTER rows)" \
                           || fail "memory.confirmed rollback" "$MBEFORE -> $MAFTER"
DISARM
# THE ORPHAN CHECK memory.confirmed DID NOT HAVE. It is one of the two consent-critical actions and it
# was the only transactional action with no "no audit row" assertion at all — the terminal count below
# is scoped to the id the RETRY produced, so an orphan row written under the rolled-back id would have
# been invisible to it. Counted by action, after disarming, before the retry.
CONF_ORPHAN=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where action='yorisou.life.memory.confirmed';")
[ "$CONF_ORPHAN" = "0" ] && pass "memory.confirmed: no orphan audit row survived the failed attempt (fault disarmed)" \
                         || fail "memory.confirmed orphan audit" "$CONF_ORPHAN rows"
MEM=$(Q -c "select public.yorisou_osf1_memory_confirm('$OWNER','lesson','$CONTENT','user_statement','$DIGEST',true,null,null,null);" 2>/dev/null)
[ -n "$MEM" ] && pass "memory.confirmed: the retry succeeds once the fault is removed" \
             || fail "memory.confirmed retry" "still failing"
ROWS=$(Q -c "select count(*) from public.yorisou_explicit_memories where owner_account_id='$OWNER' and content='$CONTENT';")
[ "$ROWS" = "1" ] && pass "memory.confirmed: exactly ONE memory exists after failure + retry" \
                  || fail "memory.confirmed duplicate" "$ROWS rows"
EV=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where entity_ref='$MEM' and action='yorisou.life.memory.confirmed';")
[ "$EV" = "1" ] && pass "memory.confirmed: exactly ONE audit event" || fail "memory.confirmed audit" "$EV rows"

# ═════════════════════════════════════════════════════════════════════════════
# 3. yorisou.life.memory.updated  — conditional audit, so the condition matters
# ═════════════════════════════════════════════════════════════════════════════
echo "  -- memory.updated"
NEWCONTENT="書き直したこと-$RANDOM"
NEWDIGEST=$(Q -c "select encode(sha256(convert_to('$NEWCONTENT','utf8')),'hex');")
ORIGINAL=$(Q -c "select content from public.yorisou_explicit_memories where id='$MEM';")
[ "$ORIGINAL" = "$CONTENT" ] && pass "memory.updated: the precondition holds — the memory exists with its original sentence" \
                             || fail "memory.updated precondition" "got '$ORIGINAL'"
ARM
if TRY "select public.yorisou_osf1_memory_update('$OWNER','$MEM','$NEWCONTENT','$NEWDIGEST');"; then
  fail "memory.updated" "the edit committed even though the audit insert failed"
else
  FORCED && pass "memory.updated: the RPC fails with the forced audit failure" \
         || fail "memory.updated" "wrong failure: $(head -2 "$WORK/out.txt" | tr '\n' ' ')"
fi
# THE ASSERTION THIS CASE EXISTS FOR. An edit that commits with no audit row destroys the previous
# sentence and leaves nothing recording that it was ever different.
STILL=$(Q -c "select content from public.yorisou_explicit_memories where id='$MEM';")
[ "$STILL" = "$CONTENT" ] && pass "memory.updated: the ORIGINAL sentence survives — the edit is rolled back" \
                          || fail "memory.updated rollback" "content is now '$STILL'"
DISARM
N=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where entity_ref='$MEM' and action='yorisou.life.memory.updated';")
[ "$N" = "0" ] && pass "memory.updated: no orphan audit row survived the failed attempt (fault disarmed)" \
               || fail "memory.updated audit" "$N rows"
OK=$(Q -c "select public.yorisou_osf1_memory_update('$OWNER','$MEM','$NEWCONTENT','$NEWDIGEST');" 2>/dev/null)
[ "$OK" = "t" ] && pass "memory.updated: the retry succeeds once the fault is removed" || fail "memory.updated retry" "returned '$OK'"
STILL=$(Q -c "select content from public.yorisou_explicit_memories where id='$MEM';")
[ "$STILL" = "$NEWCONTENT" ] && pass "memory.updated: after the retry the memory holds exactly the new sentence" \
                             || fail "memory.updated result" "'$STILL'"
EV=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where entity_ref='$MEM' and action='yorisou.life.memory.updated';")
[ "$EV" = "1" ] && pass "memory.updated: exactly ONE audit event — the failed attempt left none" \
                || fail "memory.updated audit duplicate" "$EV rows"

# ═════════════════════════════════════════════════════════════════════════════
# 4-6. The three permission changes, through yorisou_osf1_memory_set_lifecycle
# ═════════════════════════════════════════════════════════════════════════════
# Each is a distinct action with a distinct precondition, so each is run as its own case rather than
# looped: `restored` is only reachable FROM suppressed, and `revoked` is terminal.
lifecycle_case() {
  local label="$1" next="$2" action="$3" expect_before="$4"
  echo "  -- $action"
  local before
  before=$(Q -c "select lifecycle_state from public.yorisou_explicit_memories where id='$MEM';")
  [ "$before" = "$expect_before" ] && pass "$label: the precondition holds (lifecycle_state = $before)" \
                                   || fail "$label precondition" "expected $expect_before, got $before"
  ARM
  if TRY "select public.yorisou_osf1_memory_set_lifecycle('$OWNER','$MEM','$next');"; then
    fail "$label" "the lifecycle change committed even though the audit insert failed"
  else
    FORCED && pass "$label: the RPC fails with the forced audit failure" \
           || fail "$label" "wrong failure: $(head -2 "$WORK/out.txt" | tr '\n' ' ')"
  fi
  local still
  still=$(Q -c "select lifecycle_state from public.yorisou_explicit_memories where id='$MEM';")
  [ "$still" = "$expect_before" ] && pass "$label: the lifecycle state is rolled back (still $still)" \
                                  || fail "$label rollback" "state is now '$still'"
  DISARM
  # After disarming, so the absence means the mutation rolled back rather than meaning the trigger was
  # still refusing every insert. See the long note on the reflection case.
  local n
  n=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where entity_ref='$MEM' and action='$action';")
  [ "$n" = "0" ] && pass "$label: no orphan audit row survived the failed attempt (fault disarmed)" \
                 || fail "$label audit" "$n rows"
  local ok
  ok=$(Q -c "select public.yorisou_osf1_memory_set_lifecycle('$OWNER','$MEM','$next');" 2>/dev/null)
  [ "$ok" = "t" ] && pass "$label: the retry succeeds once the fault is removed" || fail "$label retry" "returned '$ok'"
  still=$(Q -c "select lifecycle_state from public.yorisou_explicit_memories where id='$MEM';")
  [ "$still" = "$next" ] && pass "$label: after the retry the state is exactly $next" || fail "$label result" "'$still'"
  local ev
  ev=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where entity_ref='$MEM' and action='$action';")
  [ "$ev" = "1" ] && pass "$label: exactly ONE audit event — the failed attempt left none" \
                  || fail "$label audit duplicate" "$ev rows"
}
lifecycle_case "memory.suppressed" suppressed yorisou.life.memory.suppressed active
lifecycle_case "memory.restored"   active     yorisou.life.memory.restored   suppressed
lifecycle_case "memory.revoked"    revoked    yorisou.life.memory.revoked    active

# ═════════════════════════════════════════════════════════════════════════════
# 7. yorisou.life.memory.deleted — and the receipt, which IS this audit row
# ═════════════════════════════════════════════════════════════════════════════
echo "  -- memory.deleted"
EXISTS=$(Q -c "select count(*) from public.yorisou_explicit_memories where id='$MEM';")
[ "$EXISTS" = "1" ] && pass "memory.deleted: the precondition holds — the memory is there to delete" \
                    || fail "memory.deleted precondition" "$EXISTS rows"
RECEIPTS_BEFORE=$(Q -c "select count(*) from public.yorisou_osf1_memory_receipts('$OWNER');")
ARM
if TRY "select public.yorisou_osf1_memory_delete('$OWNER','$MEM');"; then
  fail "memory.deleted" "the delete committed even though the audit insert failed"
else
  FORCED && pass "memory.deleted: the RPC fails with the forced audit failure" \
         || fail "memory.deleted" "wrong failure: $(head -2 "$WORK/out.txt" | tr '\n' ' ')"
fi
# THE ASSERTION THIS CASE EXISTS FOR. A delete that commits with no audit row is the one case where
# the data AND its only trace are both gone: the product could not answer "did you delete my
# memory?" at all.
STILL=$(Q -c "select count(*) from public.yorisou_explicit_memories where id='$MEM';")
[ "$STILL" = "1" ] && pass "memory.deleted: the memory SURVIVES — the delete is rolled back" \
                   || fail "memory.deleted rollback" "the memory is gone with no audit row"
# §11 invariant: a FAILED delete must not be able to produce a receipt.
DISARM
# AFTER DISARMING. A receipt is READ FROM the audit trail (yorisou_osf1_memory_receipts selects
# memory.deleted events), so while the fault was armed no receipt could exist for any reason and this
# equality was guaranteed. Disarmed, it means what it says.
RECEIPTS_MID=$(Q -c "select count(*) from public.yorisou_osf1_memory_receipts('$OWNER');")
[ "$RECEIPTS_MID" = "$RECEIPTS_BEFORE" ] && pass "memory.deleted: the failed delete produced NO deletion receipt (fault disarmed)" \
                                         || fail "memory.deleted receipt" "$RECEIPTS_BEFORE -> $RECEIPTS_MID"
OK=$(Q -c "select public.yorisou_osf1_memory_delete('$OWNER','$MEM');" 2>/dev/null)
[ "$OK" = "t" ] && pass "memory.deleted: the retry succeeds once the fault is removed" || fail "memory.deleted retry" "returned '$OK'"
GONE=$(Q -c "select count(*) from public.yorisou_explicit_memories where id='$MEM';")
[ "$GONE" = "0" ] && pass "memory.deleted: after the retry the memory is gone" || fail "memory.deleted result" "$GONE rows"
EV=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where entity_ref='$MEM' and action='yorisou.life.memory.deleted';")
[ "$EV" = "1" ] && pass "memory.deleted: exactly ONE audit event — the failed attempt left none" \
                || fail "memory.deleted audit duplicate" "$EV rows"
RECEIPTS_AFTER=$(Q -c "select count(*) from public.yorisou_osf1_memory_receipts('$OWNER') where memory_id='$MEM';")
[ "$RECEIPTS_AFTER" = "1" ] && pass "memory.deleted: exactly ONE receipt — the retry did not duplicate it" \
                            || fail "memory.deleted receipt duplicate" "$RECEIPTS_AFTER receipts"
# The receipt is content-free. It is the audit row, and the audit row never held the sentence.
# BOTH free-text-capable columns. This inspected only `detail`; `reason` is the other one a sentence
# could occupy, and the invariant the document credits to this check covers the whole row.
LEAK=$(Q -c "select count(*) from public.yorisou_life_os_audit_events
              where entity_ref='$MEM'
                and (detail::text like '%$NEWCONTENT%' or reason like '%$NEWCONTENT%'
                     or detail::text like '%$CONTENT%' or reason like '%$CONTENT%');")
[ "$LEAK" = "0" ] && pass "memory.deleted: neither detail nor reason carries any memory content" \
                  || fail "receipt leak" "$LEAK rows"

# An unmatched delete must not manufacture a receipt either — the same invariant, from the other
# side. Nothing was removed, so nothing may be recorded as removed.
BOGUS_BEFORE=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where action='yorisou.life.memory.deleted';")
Q -c "select public.yorisou_osf1_memory_delete('$OWNER','00000000-0000-0000-0000-000000000000');" >/dev/null 2>&1
BOGUS_AFTER=$(Q -c "select count(*) from public.yorisou_life_os_audit_events where action='yorisou.life.memory.deleted';")
[ "$BOGUS_BEFORE" = "$BOGUS_AFTER" ] && pass "an unmatched delete records NO deletion event" \
                                     || fail "phantom receipt" "$BOGUS_BEFORE -> $BOGUS_AFTER"

echo
if [ "$FAILURES" -eq 0 ]; then
  echo "[audit-failure] PASS — $CHECKS assertions, all seven transactional actions roll back, retry cleanly, and audit exactly once"
else
  echo "[audit-failure] FAIL — $FAILURES of $CHECKS assertions failed"
  exit 1
fi
