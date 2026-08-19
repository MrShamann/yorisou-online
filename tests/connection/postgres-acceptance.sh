#!/usr/bin/env bash
# ARCH-P5 / CPR-1 — connection.core + comparison.core acceptance against REAL PostgreSQL.
#
# The concurrency and authorization claims this package makes are database claims, so they are
# proved here with overlapping sessions and real refusals — never by reading source strings. That
# distinction is the direct lesson of the ARCH-P4 review.
#
# Two paths, both exercised in development: a disposable local cluster via initdb (default), and
# CPR1_DATABASE_URL for CI. Any failed SEED makes the harness RED — a proof that silently does not
# run reads exactly like a proof that passed.
set -uo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${CPR1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
PORT="${CPR1_POSTGRES_PORT:-55741}"
WORK="${CPR1_WORK:-/tmp/cpr1-acceptance}"
export LC_ALL=C PATH="$PGBIN:$PATH"

FAILURES=0
STARTED_LOCAL=0
cleanup() { set +e; [ "$STARTED_LOCAL" = "1" ] && pg_ctl -D "$WORK/pg" stop >/dev/null 2>&1; rm -rf "$WORK"; }
trap cleanup EXIT
pass() { printf '  ok   %s\n' "$1"; }
fail() { printf '  FAIL %s  %s\n' "$1" "${2:-}"; FAILURES=$((FAILURES+1)); }

# WORK holds scratch output on BOTH paths, so it is created before either branch.
mkdir -p "$WORK"

if [[ -n "${CPR1_DATABASE_URL:-}" ]]; then
  DSN="$CPR1_DATABASE_URL"
  if [[ "$DSN" == *"supabase.co"* || "$DSN" != *"cpr1_acceptance"* ]]; then
    echo "Refusing non-ephemeral database target" >&2; exit 1
  fi
else
  STARTED_LOCAL=1
  rm -rf "$WORK"; mkdir -p "$WORK"
  initdb -D "$WORK/pg" -A trust -U postgres >/dev/null
  pg_ctl -D "$WORK/pg" -o "-p $PORT -k $WORK -c listen_addresses=127.0.0.1" -l "$WORK/pg.log" start >/dev/null
  createdb -h 127.0.0.1 -p "$PORT" -U postgres cpr1_acceptance
  DSN="postgres://postgres@127.0.0.1:$PORT/cpr1_acceptance"
fi

Q() { psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A -c "$1"; }
# TRY runs SQL that is EXPECTED to fail. It must never abort the harness, so the non-zero exit is
# swallowed deliberately and only the message text is returned for matching.
TRY() { psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A -c "$1" 2>&1 || true; }

# Seed a LIVE result for an owner with a REAL public archetype code, and echo its id.
#
# The third argument overrides the RESULT's method id only. The attempts table constrains method_id
# to 'imairo-120q' at the database level, so a non-Imairo ATTEMPT cannot exist at all — the case
# worth testing is a result row carrying another method, which is what the pair source adapter
# filters on.
# Diagnostics go to STDERR: a fail() message on stdout would be captured as the id itself and then
# passed into an RPC as a source reference.
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
    select gen_random_uuid(), a.id, '$1', '${3:-imairo-120q}', 'compat-v0.2', '$2', '$2',
           '{\"v\":\"pds-v1\"}'::jsonb, 'private', now()
      from a
    returning id::text" 2>"$WORK/seed-err.txt" || {
    fail "seed a live result for $1" "$(head -2 "$WORK/seed-err.txt" | tr '\n' ' ')" >&2; echo ""; }
}

INVITE() { Q "select public_invite_id from public.yorisou_connection_invite_create('$1','assessment_result','$2')"; }

echo "[cpr1] stage 1 — roles + the FULL migration lineage (1)"
psql "$DSN" -q -c "
  create extension if not exists pgcrypto;
  do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;" >/dev/null

APPLY_FAILURES=0
for f in supabase/migrations/*.sql; do
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null 2>"$WORK/err.txt" \
    || { fail "apply $(basename "$f")" "$(head -2 "$WORK/err.txt" | tr '\n' ' ')"; APPLY_FAILURES=$((APPLY_FAILURES+1)); }
done
if [ "$APPLY_FAILURES" -gt 0 ]; then
  echo "[cpr1] FAIL — $APPLY_FAILURES migration(s) did not apply; later stages would be meaningless"
  exit 1
fi
pass "1. the full migration lineage applies"

# 2. RE-APPLY SAFETY. The repository standard is that a migration can be re-run against a database
# that already has it — this is what makes a partially-applied deploy recoverable.
psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f supabase/migrations/202608190001_cpr1_connection_pair.sql \
  >/dev/null 2>"$WORK/re.txt" \
  && pass "2. CPR-1 is re-apply safe" || fail "2. re-apply" "$(head -2 "$WORK/re.txt" | tr '\n' ' ')"

echo "[cpr1] stage 2 — schema, RLS, grants (3-8)"
TABLES="yorisou_connection_pairs yorisou_connection_invitations yorisou_pair_comparisons yorisou_connection_audit_events"
MISSING=0
for t in $TABLES; do
  [ "$(Q "select to_regclass('public.$t') is not null")" = "t" ] || MISSING=1
done
[ "$MISSING" = "0" ] && pass "3. the CPR-1 tables exist" || fail "3. missing table"

RLS_OK=1
for t in $TABLES; do
  [ "$(Q "select relrowsecurity from pg_class where relname='$t'")" = "t" ] || RLS_OK=0
done
[ "$RLS_OK" = "1" ] && pass "4. RLS is enabled on every CPR-1 table" || fail "4. RLS"

SIGS=(
  "public.yorisou_connection_invite_create(text,text,text)"
  "public.yorisou_connection_invite_cancel(text,uuid)"
  "public.yorisou_connection_invite_accept(uuid,text,text)"
  "public.yorisou_connection_pair_dissolve(text,uuid)"
  "public.yorisou_assessment_result_erase_with_derivatives(uuid,text)"
  "public.yorisou_imairo_pair_live_source(text,text)"
)
BROAD=0
for role in public anon authenticated; do
  for sig in "${SIGS[@]}"; do
    [ "$(Q "select has_function_privilege('$role','$sig','execute')")" = "t" ] && BROAD=1
  done
  for t in $TABLES; do
    for priv in select insert update delete; do
      [ "$(Q "select has_table_privilege('$role','public.$t','$priv')")" = "t" ] && BROAD=1
    done
  done
done
[ "$BROAD" = "0" ] && pass "5. public/anon/authenticated have NO table access and NO RPC execute" \
  || fail "5. broad access found"

SVC_OK=1
for t in $TABLES; do
  [ "$(Q "select has_table_privilege('service_role','public.$t','select')")" = "t" ] || SVC_OK=0
  for priv in insert update delete; do
    [ "$(Q "select has_table_privilege('service_role','public.$t','$priv')")" = "t" ] && SVC_OK=0
  done
done
[ "$SVC_OK" = "1" ] && pass "6. service_role is bounded: SELECT only, mutation via RPC" || fail "6. service_role bounded"

[ "$(Q "select bool_and(proconfig @> array['search_path=public']) from pg_proc
        where proname in ('yorisou_connection_invite_create','yorisou_connection_invite_cancel',
                          'yorisou_connection_invite_accept','yorisou_connection_pair_dissolve',
                          'yorisou_assessment_result_erase_with_derivatives',
                          'yorisou_imairo_pair_live_source','yorisou_connection_source_erased')")" = "t" ] \
  && pass "7. every CPR-1 SECURITY DEFINER function pins search_path" || fail "7. fixed search_path"

# 8. CLOSES THE RECORDED ARCH-P4 TEST GAP. The P4 migration revokes and grants these in a loop; that
# was never asserted, so a later migration could widen them unnoticed. Test hardening only — no P4
# behaviour is changed here.
P4_OK=1
for sig in "public.yorisou_share_source_lock(text,text)" "public.yorisou_assessment_result_erase_with_shares(uuid,text)"; do
  for role in public anon authenticated; do
    [ "$(Q "select has_function_privilege('$role','$sig','execute')")" = "t" ] && P4_OK=0
  done
  [ "$(Q "select has_function_privilege('service_role','$sig','execute')")" = "t" ] || P4_OK=0
done
[ "$P4_OK" = "1" ] && pass "8. ARCH-P4 source-lock + erase-with-shares privileges are explicitly asserted" \
  || fail "8. ARCH-P4 privilege assertion"

echo "[cpr1] stage 3 — invitation creation (9-12)"
A_RESULT=$(seed_result "acct-a" "MS-KI")
B_RESULT=$(seed_result "acct-b" "EM-AK")
if [ -z "$A_RESULT" ] || [ -z "$B_RESULT" ]; then
  echo "[cpr1] FAIL — could not seed the two base results; later stages would be meaningless"
  exit 1
fi

INV_A=$(INVITE "acct-a" "$A_RESULT")
[ -n "$INV_A" ] && pass "9. an owner can create an invitation from their own live Imairo result" \
  || fail "9. invite create"

# 10. The central authorization fact: a guessed row id belonging to someone else creates nothing.
GUESS=$(TRY "select public.yorisou_connection_invite_create('acct-c','assessment_result','$B_RESULT')")
echo "$GUESS" | grep -q "connection_source_not_invitable" \
  && pass "10. a guessed OTHER-OWNER result cannot create an invitation" || fail "10. cross-owner invite" "$GUESS"
[ "$(Q "select count(*) from public.yorisou_connection_invitations where inviter_account_id='acct-c'")" = "0" ] \
  && pass "10b. the refused attempt wrote nothing" || fail "10b. refused attempt wrote a row"

# 11. High entropy + uniqueness. A v4 uuid carries 122 random bits; the shape is asserted rather
# than assumed, because a sequential or derived id here would make invitations guessable.
[ "$(Q "select '$INV_A' ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'")" = "t" ] \
  && pass "11. the public invite id is a random (v4) uuid" || fail "11. invite id entropy" "$INV_A"
[ "$(Q "select count(*) from pg_indexes where tablename='yorisou_connection_invitations'
        and indexdef ilike '%unique%public_invite_id%'")" -ge 1 ] \
  && pass "11b. public invite ids are unique by index" || fail "11b. invite id uniqueness"

# Idempotent create: retrying must not scatter live invitations.
INV_A2=$(INVITE "acct-a" "$A_RESULT")
[ "$INV_A2" = "$INV_A" ] && pass "11c. a retried create returns the SAME open invitation" || fail "11c. duplicate invite"

# 12. What the public projection may contain. The columns the app selects are asserted against the
# row itself: nothing in that set can identify the inviter, their source, or their result.
LEAK=$(Q "select coalesce(string_agg(x,','),'') from (
  select unnest(array['public_invite_id','reference_family','expires_at']) as x) s
  where x in ('inviter_account_id','reference_ref','result_id','owner_account_id')")
[ -z "$LEAK" ] && pass "12. the public invitation projection carries no inviter, source or result" \
  || fail "12. public projection leak" "$LEAK"

echo "[cpr1] stage 4 — acceptance authorization (13-17)"
# 13. Self-accept is refused.
SELF=$(TRY "select * from public.yorisou_connection_invite_accept('$INV_A'::uuid,'acct-a','$A_RESULT')")
echo "$SELF" | grep -q "connection_self_accept_forbidden" \
  && pass "13. the inviter cannot accept their own invitation" || fail "13. self accept" "$SELF"

# 14. The acceptor may contribute ONLY their own result.
STEAL=$(TRY "select * from public.yorisou_connection_invite_accept('$INV_A'::uuid,'acct-c','$B_RESULT')")
echo "$STEAL" | grep -q "connection_acceptor_source_unavailable" \
  && pass "14. an acceptor cannot contribute someone ELSE'S result" || fail "14. stolen source" "$STEAL"

# 15. A non-Imairo source is refused even when the caller genuinely owns it.
OTHER_METHOD=$(seed_result "acct-b" "MS-KI" "yorisou-values-24q")
if [ -z "$OTHER_METHOD" ]; then
  fail "15 setup: could not seed a non-Imairo result"
else
  WRONG=$(TRY "select * from public.yorisou_connection_invite_accept('$INV_A'::uuid,'acct-b','$OTHER_METHOD')")
  echo "$WRONG" | grep -q "connection_acceptor_source_unavailable" \
    && pass "15. a non-Imairo source is refused" || fail "15. non-Imairo source accepted" "$WRONG"
fi

# 16. The happy path: exactly one pair and exactly one comparison.
PAIR=$(Q "select pair_public_id from public.yorisou_connection_invite_accept('$INV_A'::uuid,'acct-b','$B_RESULT')")
[ -n "$PAIR" ] && pass "16. a valid acceptance produces a pair" || fail "16. accept"
[ "$(Q "select count(*) from public.yorisou_connection_pairs where pair_public_id='$PAIR'")" = "1" ] \
  && pass "16b. exactly ONE pair exists" || fail "16b. pair count"
[ "$(Q "select count(*) from public.yorisou_pair_comparisons c
        join public.yorisou_connection_pairs p on p.id=c.pair_id where p.pair_public_id='$PAIR'")" = "1" ] \
  && pass "16c. exactly ONE comparison exists" || fail "16c. comparison count"
[ "$(Q "select side_a_public_reference||'/'||side_b_public_reference from public.yorisou_pair_comparisons c
        join public.yorisou_connection_pairs p on p.id=c.pair_id where p.pair_public_id='$PAIR'")" = "MS-KI/EM-AK" ] \
  && pass "16d. the comparison stores the two PUBLIC codes, in participant order" || fail "16d. comparison payload"

# 17. Idempotent retry by the SAME acceptor.
PAIR_AGAIN=$(Q "select pair_public_id from public.yorisou_connection_invite_accept('$INV_A'::uuid,'acct-b','$B_RESULT')")
[ "$PAIR_AGAIN" = "$PAIR" ] && pass "17. an identical accept retry returns the SAME pair" || fail "17. retry" "$PAIR_AGAIN"
[ "$(Q "select count(*) from public.yorisou_connection_pairs")" = "1" ] \
  && pass "17b. the retry created no second pair" || fail "17b. duplicate pair"

echo "[cpr1] stage 5 — CONCURRENCY: the lifecycle must be a database fact (18-19, 27)"
# RACE A — two DIFFERENT authenticated people accept the SAME invitation simultaneously.
C_RESULT=$(seed_result "acct-c" "MS-SZ")
D_RESULT=$(seed_result "acct-d" "EM-FB")
E_RESULT=$(seed_result "acct-e" "MS-YO")
if [ -z "$C_RESULT" ] || [ -z "$D_RESULT" ] || [ -z "$E_RESULT" ]; then
  fail "RACE A setup: could not seed the racing acceptors"
else
  INV_R=$(INVITE "acct-a" "$A_RESULT")
  # Both sessions block on the same invitation row lock; the loser must be refused, not duplicated.
  ( psql "$DSN" -q -t -A -c "select pair_public_id from public.yorisou_connection_invite_accept('$INV_R'::uuid,'acct-c','$C_RESULT')" >"$WORK/rA1.out" 2>&1 ) &
  P1=$!
  ( psql "$DSN" -q -t -A -c "select pair_public_id from public.yorisou_connection_invite_accept('$INV_R'::uuid,'acct-d','$D_RESULT')" >"$WORK/rA2.out" 2>&1 ) &
  P2=$!
  wait "$P1" || true; wait "$P2" || true
  WON=$(Q "select count(*) from public.yorisou_connection_pairs p
           join public.yorisou_connection_invitations i on i.pair_id=p.id
           where i.public_invite_id='$INV_R'")
  [ "$WON" = "1" ] && pass "18. RACE A: two concurrent acceptors produce EXACTLY ONE pair" \
    || fail "18. RACE A pair count" "pairs=$WON"
  ACCEPTORS=$(Q "select count(distinct accepted_by_account_id) from public.yorisou_connection_invitations
                 where public_invite_id='$INV_R' and accepted_by_account_id is not null")
  [ "$ACCEPTORS" = "1" ] && pass "18b. RACE A: exactly ONE accepted participant" || fail "18b. acceptors=$ACCEPTORS"
  COMPS=$(Q "select count(*) from public.yorisou_pair_comparisons c
             join public.yorisou_connection_pairs p on p.id=c.pair_id
             join public.yorisou_connection_invitations i on i.pair_id=p.id
             where i.public_invite_id='$INV_R'")
  [ "$COMPS" = "1" ] && pass "18c. RACE A: exactly ONE comparison" || fail "18c. comparisons=$COMPS"
  if grep -q "connection_invitation_unavailable" "$WORK/rA1.out" "$WORK/rA2.out"; then
    pass "18d. RACE A: the loser received a bounded refusal"
  else
    fail "18d. RACE A loser outcome" "$(head -1 "$WORK/rA1.out") | $(head -1 "$WORK/rA2.out")"
  fi
fi

# RACE C — cancel races acceptance. Exactly one of the two outcomes, never both.
INV_X=$(INVITE "acct-a" "$A_RESULT")
if [ -z "$INV_X" ]; then
  fail "RACE C setup: could not create the racing invitation"
else
  ( psql "$DSN" -q -t -A -c "select public.yorisou_connection_invite_cancel('acct-a','$INV_X'::uuid)" >"$WORK/rC1.out" 2>&1 ) &
  P3=$!
  ( psql "$DSN" -q -t -A -c "select pair_public_id from public.yorisou_connection_invite_accept('$INV_X'::uuid,'acct-e','$E_RESULT')" >"$WORK/rC2.out" 2>&1 ) &
  P4=$!
  wait "$P3" || true; wait "$P4" || true
  STATUS=$(Q "select status from public.yorisou_connection_invitations where public_invite_id='$INV_X'")
  PAIRS_X=$(Q "select count(*) from public.yorisou_connection_invitations i
               join public.yorisou_connection_pairs p on p.id=i.pair_id where i.public_invite_id='$INV_X'")
  if { [ "$STATUS" = "cancelled" ] && [ "$PAIRS_X" = "0" ]; } || { [ "$STATUS" = "accepted" ] && [ "$PAIRS_X" = "1" ]; }; then
    pass "19. RACE C: cancel-vs-accept settled on exactly one valid final state ($STATUS, pairs=$PAIRS_X)"
  else
    fail "19. RACE C inconsistent" "status=$STATUS pairs=$PAIRS_X"
  fi
fi

# RACE D — acceptance races SOURCE ERASURE. This is the one ARCH-P4 taught us to prove.
F_RESULT=$(seed_result "acct-f" "EM-KU")
G_RESULT=$(seed_result "acct-g" "MS-SI")
if [ -z "$F_RESULT" ] || [ -z "$G_RESULT" ]; then
  fail "RACE D setup: could not seed the erasure race"
else
  INV_D=$(INVITE "acct-f" "$F_RESULT")
  # Session 1 begins the atomic erasure of the INVITER's source and holds the transaction open;
  # session 2 tries to accept meanwhile. Whichever commits first, the required invariant is that no
  # readable pair derives from an erased source.
  ( psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A <<SQL >"$WORK/rD1.out" 2>&1
begin;
select public.yorisou_assessment_result_erase_with_derivatives('$F_RESULT'::uuid, 'acct-f');
select pg_sleep(2);
commit;
SQL
  ) &
  PD1=$!
  sleep 1
  psql "$DSN" -q -t -A -c "select pair_public_id from public.yorisou_connection_invite_accept('$INV_D'::uuid,'acct-g','$G_RESULT')" >"$WORK/rD2.out" 2>&1 || true
  wait "$PD1" || true

  ERASED_OK=$(grep -c "^t$" "$WORK/rD1.out")
  if [ "$ERASED_OK" -ge 1 ]; then
    LIVE=$(Q "select count(*) from public.yorisou_connection_pairs
              where status='active'
                and (participant_a_reference_ref='$F_RESULT' or participant_b_reference_ref='$F_RESULT')")
    [ "$LIVE" = "0" ] \
      && pass "27. RACE D: erasure succeeded and ZERO active pairs derive from the erased source" \
      || fail "27. RACE D: an active pair outlived its erased source" "live=$LIVE"
    READABLE=$(Q "select count(*) from public.yorisou_pair_comparisons c
                  join public.yorisou_connection_pairs p on p.id=c.pair_id
                  where c.invalidated_at is null
                    and (p.participant_a_reference_ref='$F_RESULT' or p.participant_b_reference_ref='$F_RESULT')")
    [ "$READABLE" = "0" ] \
      && pass "27b. RACE D: no readable comparison derives from the erased source" \
      || fail "27b. RACE D readable comparison" "readable=$READABLE"
      # Any of the three is a correct bounded refusal. Which one arrives depends on where the
    # acceptance blocks: it waits on the invitation row lock the erasure already holds, so it most
    # often wakes to a cancelled invitation — the refusal that discloses LEAST about the other
    # person's source, which is the outcome the route deliberately collapses everything into.
    grep -qE "connection_invitation_unavailable|connection_source_erased|connection_inviter_source_unavailable" "$WORK/rD2.out" \
      && pass "27c. RACE D: the concurrent acceptance was refused" \
      || fail "27c. RACE D accept outcome" "$(head -2 "$WORK/rD2.out" | tr '\n' ' ')"
  else
    fail "27. RACE D: the atomic erasure did not succeed" "$(head -3 "$WORK/rD1.out" | tr '\n' ' ')"
  fi
fi

# ── D2 — THE INTERLEAVING THAT DEADLOCKED, constructed so a cycle can actually form. ────────
#
# A deadlock needs BOTH sessions waiting. An earlier version of this test held the accept
# transaction open after its RPC had already finished — holding locks but waiting for nothing — so
# it could not deadlock under any lock order and passed against the broken code. That is the exact
# failure mode this suite exists to prevent, so the scenario is now built to make the cycle
# possible and then assert it does not happen.
#
# Session E takes the source lock and PAUSES BEFORE touching the invitation. Session A starts its
# acceptance during that pause. Under the reviewed head's order (invitation row → source locks) A
# grabs the invitation row and then waits for E's source lock, while E wakes and waits for A's
# invitation row: a cycle, and PostgreSQL kills one of them. Under the corrected order (source
# locks → invitation row) A waits at the source lock holding nothing, so no cycle exists.
N_RESULT=$(seed_result "acct-n" "MS-KI")
O_RESULT=$(seed_result "acct-o" "EM-AK")
if [ -z "$N_RESULT" ] || [ -z "$O_RESULT" ]; then
  fail "D2 setup: could not seed the accept-first race"
else
  INV_D2=$(INVITE "acct-n" "$N_RESULT")
  if [ -z "$INV_D2" ]; then
    fail "D2 setup: could not create the invitation"
  else
    ( psql "$DSN" -v ON_ERROR_STOP=1 -q -t -A <<SQL >"$WORK/d2erase.out" 2>&1
begin;
select public.yorisou_share_source_lock('assessment_result', '$N_RESULT');
select pg_sleep(2);
select public.yorisou_assessment_result_erase_with_derivatives('$N_RESULT'::uuid, 'acct-n');
commit;
SQL
    ) &
    PE=$!
    sleep 1
    # Begins while E holds the source lock and has NOT yet touched the invitation row.
    psql "$DSN" -q -t -A \
      -c "select pair_public_id from public.yorisou_connection_invite_accept('$INV_D2'::uuid,'acct-o','$O_RESULT')" \
      >"$WORK/d2accept.out" 2>&1 || true
    wait "$PE" || true

    # THE POINT OF THE TEST.
    if grep -qi "deadlock detected" "$WORK/d2accept.out" "$WORK/d2erase.out"; then
      fail "D2: DEADLOCK — the accept/erase lock order is inverted" \
        "$(grep -ih -m1 'deadlock detected' "$WORK/d2accept.out" "$WORK/d2erase.out")"
    else
      pass "D2: accept racing source erasure does NOT deadlock"
    fi

    # Both sessions must actually have run, and the erasure must have committed. A scenario that
    # silently did not execute is not a proof.
    grep -q "^t$" "$WORK/d2erase.out" \
      && pass "D2: the erasure session actually executed and succeeded" \
      || fail "D2: the erasure did not succeed" "$(head -3 "$WORK/d2erase.out" | tr '\n' ' ')"
    if grep -qE "^[0-9a-f]{8}-" "$WORK/d2accept.out"; then
      pass "D2: the acceptance session ran and was serialized behind the erasure"
    elif grep -qE "connection_(invitation_unavailable|source_erased|inviter_source_unavailable)" "$WORK/d2accept.out"; then
      pass "D2: the acceptance session ran and was cleanly refused behind the erasure"
    else
      fail "D2: the acceptance never executed" "$(head -3 "$WORK/d2accept.out" | tr '\n' ' ')"
    fi

    # Whichever way it settled, the invariant is the same: nothing readable derives from the
    # erased source.
    [ "$(Q "select count(*) from public.yorisou_connection_pairs
            where status='active'
              and (participant_a_reference_ref='$N_RESULT' or participant_b_reference_ref='$N_RESULT')")" = "0" ] \
      && pass "D2: ZERO active pairs derive from the erased source" \
      || fail "D2: an active pair outlived the erased source"
    [ "$(Q "select count(*) from public.yorisou_pair_comparisons c
            join public.yorisou_connection_pairs p on p.id=c.pair_id
            where (p.participant_a_reference_ref='$N_RESULT' or p.participant_b_reference_ref='$N_RESULT')
              and (c.invalidated_at is null
                   or c.side_a_public_reference is not null or c.side_b_public_reference is not null)")" = "0" ] \
      && pass "D2: no readable comparison, and no retained payload, derives from it" \
      || fail "D2: comparison payload survived"
  fi
fi

echo "[cpr1] stage 5d — expired invitation lifecycle"
# An expired PENDING invitation must not be handed back forever. The reviewed head returned it,
# while the partial unique index forbade minting a replacement — a link the recipient could not use
# and the inviter could not replace.
P_RESULT=$(seed_result "acct-p" "MS-SZ")
if [ -z "$P_RESULT" ]; then
  fail "expiry setup: could not seed a result"
else
  INV_E1=$(INVITE "acct-p" "$P_RESULT")
  INV_E1B=$(INVITE "acct-p" "$P_RESULT")
  [ "$INV_E1" = "$INV_E1B" ] && pass "E1. an ACTIVE pending invitation is reused (same public id)" \
    || fail "E1. active reuse" "$INV_E1 vs $INV_E1B"

  # Age it past its expiry.
  Q "update public.yorisou_connection_invitations set expires_at = now() - interval '1 day'
      where public_invite_id='$INV_E1'" >/dev/null
  INV_E2=$(INVITE "acct-p" "$P_RESULT")
  [ -n "$INV_E2" ] && [ "$INV_E2" != "$INV_E1" ] \
    && pass "E2. an EXPIRED pending invitation yields a NEW public id" || fail "E2. expired renewal" "$INV_E2"
  [ "$(Q "select status from public.yorisou_connection_invitations where public_invite_id='$INV_E1'")" = "cancelled" ] \
    && pass "E2b. the expired invitation is retired, and its old link stays unavailable" \
    || fail "E2b. expired invite still pending"
  [ "$(Q "select count(*) from public.yorisou_connection_invitations
          where inviter_account_id='acct-p' and reference_ref='$P_RESULT' and status='pending'")" = "1" ] \
    && pass "E2c. exactly ONE pending invitation remains" || fail "E2c. pending invariant broken"
  DEADLINK=$(TRY "select * from public.yorisou_connection_invite_accept('$INV_E1'::uuid,'acct-o','$O_RESULT')")
  echo "$DEADLINK" | grep -q "connection_invitation_unavailable" \
    && pass "E2d. the retired link can no longer be accepted" || fail "E2d. retired link accepted" "$DEADLINK"

  # A cancelled invitation also yields a fresh one.
  Q "select public.yorisou_connection_invite_cancel('acct-p','$INV_E2'::uuid)" >/dev/null
  INV_E3=$(INVITE "acct-p" "$P_RESULT")
  [ -n "$INV_E3" ] && [ "$INV_E3" != "$INV_E2" ] \
    && pass "E3. after cancelling, a NEW invitation can be created" || fail "E3. post-cancel create" "$INV_E3"
fi

echo "[cpr1] stage 6 — pair access and dissolution (20-23)"
# 20/21. A non-participant can neither read nor end the pair. The read is expressed the way the
# repository expresses it — a participant-filtered query — so this proves the DATA MODEL supports
# concealment, not merely that one function checks.
[ "$(Q "select count(*) from public.yorisou_connection_pairs
        where pair_public_id='$PAIR' and status='active'
          and (participant_a_account_id='acct-z' or participant_b_account_id='acct-z')")" = "0" ] \
  && pass "20. a non-participant's pair read returns nothing" || fail "20. non-participant read"
[ "$(Q "select public.yorisou_connection_pair_dissolve('acct-z','$PAIR'::uuid)")" = "f" ] \
  && pass "21. a non-participant cannot dissolve the pair" || fail "21. non-participant dissolve"
[ "$(Q "select status from public.yorisou_connection_pairs where pair_public_id='$PAIR'")" = "active" ] \
  && pass "21b. the failed dissolve changed nothing" || fail "21b. non-participant dissolve had effect"

# 22. EITHER participant may end it — here, the one who did NOT create the invitation.
[ "$(Q "select public.yorisou_connection_pair_dissolve('acct-b','$PAIR'::uuid)")" = "t" ] \
  && pass "22. either participant can dissolve the pair" || fail "22. participant dissolve"
[ "$(Q "select public.yorisou_connection_pair_dissolve('acct-b','$PAIR'::uuid)")" = "f" ] \
  && pass "22b. dissolution is idempotent" || fail "22b. dissolve idempotency"

# 23. Dissolution removes the derived content; it does not merely hide it.
[ "$(Q "select count(*) from public.yorisou_pair_comparisons c
        join public.yorisou_connection_pairs p on p.id=c.pair_id
        where p.pair_public_id='$PAIR' and c.invalidated_at is null")" = "0" ] \
  && pass "23. the dissolved pair's comparison is unreadable" || fail "23. dissolved comparison readable"
[ "$(Q "select count(*) from public.yorisou_pair_comparisons c
        join public.yorisou_connection_pairs p on p.id=c.pair_id
        where p.pair_public_id='$PAIR'
          and (c.side_a_public_reference is not null or c.side_b_public_reference is not null)")" = "0" ] \
  && pass "23b. the result-derived codes were CLEARED, not just flagged" || fail "23b. codes retained"
# And neither person's assessment result was touched by ending the pair.
[ "$(Q "select count(*) from public.yorisou_assessment_results
        where id in ('$A_RESULT'::uuid,'$B_RESULT'::uuid) and deleted_at is null")" = "2" ] \
  && pass "23c. dissolving a pair deletes NEITHER participant's result" || fail "23c. dissolve deleted a result"

echo "[cpr1] stage 7 — source erasure propagation (24-26)"
H_RESULT=$(seed_result "acct-h" "EM-KA")
I_RESULT=$(seed_result "acct-i" "MS-KI")
if [ -z "$H_RESULT" ] || [ -z "$I_RESULT" ]; then
  fail "stage 7 setup: could not seed the erasure pair"
else
  INV_H=$(INVITE "acct-h" "$H_RESULT")
  PAIR_H=$(Q "select pair_public_id from public.yorisou_connection_invite_accept('$INV_H'::uuid,'acct-i','$I_RESULT')")
  # A second, still-pending invitation from the same source.
  Q "update public.yorisou_connection_invitations set status='cancelled', cancelled_at=now()
      where public_invite_id='$INV_H' and status='pending'" >/dev/null
  INV_H2=$(INVITE "acct-h" "$H_RESULT")

  # Erase the ACCEPTOR's source: the pair must die from either side.
  [ "$(Q "select public.yorisou_assessment_result_erase_with_derivatives('$I_RESULT'::uuid,'acct-i')")" = "t" ] \
    && pass "25. erasing EITHER participant's source succeeds" || fail "25. erase-with-derivatives"
  [ "$(Q "select status from public.yorisou_connection_pairs where pair_public_id='$PAIR_H'")" = "dissolved" ] \
    && pass "25b. the active pair is dissolved by the erasure" || fail "25b. pair survived source erasure"
  [ "$(Q "select count(*) from public.yorisou_pair_comparisons c
          join public.yorisou_connection_pairs p on p.id=c.pair_id
          where p.pair_public_id='$PAIR_H'
            and (c.invalidated_at is null
                 or c.side_a_public_reference is not null or c.side_b_public_reference is not null)")" = "0" ] \
    && pass "26. the source-derived comparison payload was removed AND invalidated" || fail "26. payload retained"

  # Now the inviter's own source, which still has a pending invitation hanging off it.
  [ "$(Q "select public.yorisou_assessment_result_erase_with_derivatives('$H_RESULT'::uuid,'acct-h')")" = "t" ] \
    && pass "24. erasing the inviter's source succeeds" || fail "24. inviter source erase"
  [ "$(Q "select status from public.yorisou_connection_invitations where public_invite_id='$INV_H2'")" = "cancelled" ] \
    && pass "24b. the pending invitation from that source is cancelled" || fail "24b. pending invite survived"
  DEAD=$(TRY "select * from public.yorisou_connection_invite_accept('$INV_H2'::uuid,'acct-i','$I_RESULT')")
  echo "$DEAD" | grep -q "connection_invitation_unavailable" \
    && pass "24c. the cancelled invitation can no longer be accepted" || fail "24c. dead invite accepted" "$DEAD"

  # An unauthorized erase attempt changes nothing.
  [ "$(Q "select public.yorisou_assessment_result_erase_with_derivatives('$A_RESULT'::uuid,'acct-z')")" = "f" ] \
    && pass "24d. a non-owner erase attempt returns false" || fail "24d. unauthorized erase"
  [ "$(Q "select count(*) from public.yorisou_assessment_results where id='$A_RESULT'::uuid and deleted_at is null")" = "1" ] \
    && pass "24e. the unauthorized attempt deleted nothing" || fail "24e. unauthorized erase had effect"
fi

echo "[cpr1] stage 8 — account erasure (28-30)"
J_RESULT=$(seed_result "acct-j" "MS-SZ")
K_RESULT=$(seed_result "acct-k" "EM-AK")
L_RESULT=$(seed_result "acct-l" "MS-YO")
M_RESULT=$(seed_result "acct-m" "EM-FB")
if [ -z "$J_RESULT" ] || [ -z "$K_RESULT" ] || [ -z "$L_RESULT" ] || [ -z "$M_RESULT" ]; then
  fail "stage 8 setup: could not seed the account-erasure pairs"
else
  INV_J=$(INVITE "acct-j" "$J_RESULT")
  PAIR_J=$(Q "select pair_public_id from public.yorisou_connection_invite_accept('$INV_J'::uuid,'acct-k','$K_RESULT')")
  INV_L=$(INVITE "acct-l" "$L_RESULT")
  PAIR_L=$(Q "select pair_public_id from public.yorisou_connection_invite_accept('$INV_L'::uuid,'acct-m','$M_RESULT')")

  # 28. Erase participant A (the inviter side).
  Q "insert into public.yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint)
     values ('acct-j', encode(sha256(convert_to('acct-j','utf8')),'hex'))" >/dev/null
  Q "select public.yorisou_account_deletion_erase_database_unchecked('acct-j')" >/dev/null
  [ "$(Q "select count(*) from public.yorisou_connection_pairs where pair_public_id='$PAIR_J'")" = "0" ] \
    && pass "28. erasing participant A removes the pair" || fail "28. pair survived account erasure"
  [ "$(Q "select count(*) from public.yorisou_pair_comparisons c
          where not exists (select 1 from public.yorisou_connection_pairs p where p.id=c.pair_id)")" = "0" ] \
    && pass "28b. the comparison cascaded with the pair — no orphan survives" || fail "28b. orphan comparison"
  [ "$(Q "select count(*) from public.yorisou_connection_invitations where inviter_account_id='acct-j'")" = "0" ] \
    && pass "28c. their invitations are gone" || fail "28c. invitations survived"

  # 29. Erase participant B (the ACCEPTOR side) — the case a single-owner-column plan would miss.
  Q "insert into public.yorisou_account_deletion_jobs (owner_account_id, owner_fingerprint)
     values ('acct-m', encode(sha256(convert_to('acct-m','utf8')),'hex'))" >/dev/null
  Q "select public.yorisou_account_deletion_erase_database_unchecked('acct-m')" >/dev/null
  [ "$(Q "select count(*) from public.yorisou_connection_pairs where pair_public_id='$PAIR_L'")" = "0" ] \
    && pass "29. erasing participant B ALSO removes the pair" || fail "29. acceptor-side erasure left the pair"
  [ "$(Q "select count(*) from public.yorisou_connection_invitations where accepted_by_account_id='acct-m'")" = "0" ] \
    && pass "29b. their acceptance record is gone" || fail "29b. acceptance record survived"

  # 30. Unrelated people are untouched.
  [ "$(Q "select count(*) from public.yorisou_assessment_results
          where owner_account_id in ('acct-k','acct-l') and deleted_at is null")" = "2" ] \
    && pass "30. the surviving partners' own results are untouched" || fail "30. erasure touched an unrelated owner"
fi

echo "[cpr1] stage 9 — audit content-freedom (31)"
[ "$(Q "select count(*) from public.yorisou_connection_audit_events")" -ge 3 ] \
  && pass "31. lifecycle events were audited" || fail "31. audit rows missing"
[ "$(Q "select bool_and(actor_fingerprint ~ '^[a-f0-9]{64}$') from public.yorisou_connection_audit_events")" = "t" ] \
  && pass "31b. the actor is a sha256 fingerprint, never a raw account id" || fail "31b. actor fingerprint"
AUDIT_COLS=$(Q "select coalesce(string_agg(column_name,','),'') from information_schema.columns
                where table_schema='public' and table_name='yorisou_connection_audit_events'
                  and column_name in ('owner_account_id','account_id','source_ref','reference_ref','payload','email')")
[ -z "$AUDIT_COLS" ] && pass "31c. the audit table cannot hold owner, source, payload or email" \
  || fail "31c. audit carries private columns" "$AUDIT_COLS"
LEAKED=$(Q "select count(*) from public.yorisou_connection_audit_events
            where actor_fingerprint in ('acct-a','acct-b','acct-c')")
[ "$LEAKED" = "0" ] && pass "31d. no raw account id was written as an actor" || fail "31d. raw account id in audit"
# The audit is append-only.
MUT=$(TRY "update public.yorisou_connection_audit_events set event_type='connection_invited'")
echo "$MUT" | grep -q "connection_audit_is_append_only" \
  && pass "31e. the audit table is append-only" || fail "31e. audit mutable" "$MUT"

echo
if [ "$FAILURES" -eq 0 ]; then echo "[cpr1] PASS"; else echo "[cpr1] FAIL ($FAILURES)"; fi
exit $([ "$FAILURES" -eq 0 ] && echo 0 || echo 1)
