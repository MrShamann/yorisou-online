#!/usr/bin/env bash
# OSF-1 §15/§16 — INTERNAL access end-to-end, and the kill-switch rehearsal.
#
# TWO THINGS NOTHING ELSE PROVES.
#
# 1. INTERNAL is the state that lets a Founder/Admin reach the Life OS in TRUE PRODUCTION while
#    everyone else gets the same 404 the feature gives when it is off. Until now that path existed
#    only in unit and source assertions — no test had ever signed two different people in and
#    checked that one gets the product and the other cannot tell it exists.
#
# 2. The kill switch has never been fired. Release & Acceptance Gates v1.0 §3.4 requires a LIVE test
#    before exposure, and a switch that has only been reasoned about is not a switch. This measures
#    what disabling actually requires — no restart, a process restart, or a redeploy — rather than
#    asserting a comfortable answer.
#
# The stack runs with VERCEL_ENV=production, so lifeOsAccess() denies on the env path and the ONLY
# way in is lifeOsInternalAccess() over a validated session. That is the real production code path,
# not a test bypass.
#
#   bash tests/life-os/internal-access.sh

set -euo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${OSF1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
POSTGREST="${OSF1_POSTGREST_BIN:-/opt/homebrew/bin/postgrest}"
# Ports of this harness's own, distinct from tests/daily-check-in/fullstack-local.sh (55446/55448/
# 55449/3200) and tests/life-os/postgres-acceptance.sh (55583), so the two can run side by side.
PG_PORT="${OSF1_INT_PG_PORT:-55631}"
REST_PORT="${OSF1_INT_REST_PORT:-55632}"
PROXY_PORT="${OSF1_INT_PROXY_PORT:-55633}"
APP_PORT="${OSF1_INT_APP_PORT:-3231}"
WORK="${OSF1_INT_WORK:-/tmp/osf1-internal}"
DB=osf1_life_internal
export LC_ALL=C PATH="$PGBIN:$PATH"

# Nothing may survive this script — not a cluster, not a listener, not a directory. Every stage
# registers what it started before the next one runs, so an exit anywhere tears down what exists.
#
# Each background listener is disowned as soon as its PID is recorded. The PID is what teardown uses,
# so nothing is lost — but bash otherwise announces `Terminated: 15` and the whole node -e source of
# whichever job it reaps, printed AFTER the PASS line, where it reads as a failure in a harness whose
# output is meant to be one line per stage.
cleanup() {
  set +e
  if [ "${OSF1_INT_KEEP:-}" = "1" ]; then echo "[osf1-internal] KEEP=1 — stack left running for debugging"; return; fi
  [ -n "${STORE_PID:-}" ] && kill "$STORE_PID" 2>/dev/null
  [ -n "${APP_PID:-}" ] && kill "$APP_PID" 2>/dev/null
  [ -n "${PROXY_PID:-}" ] && kill "$PROXY_PID" 2>/dev/null
  [ -n "${REST_PID:-}" ] && kill "$REST_PID" 2>/dev/null
  pg_ctl -D "$WORK/pg" stop -m immediate >/dev/null 2>&1
  rm -rf "$WORK"
  echo "[osf1-internal] disposable stack torn down"
}

# THE PRE-FLIGHT REFUSALS COME BEFORE THE TRAP IS ARMED, AND THAT ORDER IS THE POINT.
#
# cleanup ends in `rm -rf "$WORK"`, and $WORK is a fixed path — the same one the run that is still
# holding these ports is using. With the trap armed first, refusing to start because another stack is
# up would immediately delete that stack's cluster directory out from under its live processes: this
# script would answer "something else is running" by breaking it. Nothing below has been started yet,
# so there is nothing to tear down if a check refuses, and the trap goes up once there is.
busy() { lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }
for port in "$PG_PORT" "$REST_PORT" "$PROXY_PORT" "$APP_PORT"; do
  # A run whose parent was killed outright never reaches the trap, so the previous stack can still be
  # listening. Refusing is right — attaching to it would run the accessibility gate against a
  # database and a build from some earlier working tree — but the operator needs to be told what to
  # remove rather than left to work out which four processes are stale.
  busy "$port" && {
    echo "[osf1-internal] port $port is busy. If a previous run was interrupted, its stack is still up:" >&2
    echo "[osf1-internal]   pkill -f 'next start -p $APP_PORT'; pkill -f postgrest" >&2
    echo "[osf1-internal]   $PGBIN/pg_ctl -D $WORK/pg stop -m immediate; rm -rf $WORK" >&2
    exit 1
  }
done
[ -x "$POSTGREST" ] || { echo "[osf1-internal] no postgrest binary at $POSTGREST (set OSF1_POSTGREST_BIN)" >&2; exit 1; }

# From here on this script owns $WORK and the four ports, so an exit anywhere must tear them down.
trap cleanup EXIT

# ── 1. Database ──────────────────────────────────────────────────────────────
# LC_ALL=C and --no-locale are mandatory, not tidiness: initdb inherits the operator's locale and
# fails on this machine without them. Same setup as tests/life-os/postgres-acceptance.sh.
echo "[osf1-internal] 1/7 disposable PostgreSQL cluster"
MAJOR="$("$PGBIN/postgres" --version | awk '{print $3}' | cut -d. -f1)"
case "$MAJOR" in
  16|17) : ;;
  *) echo "[osf1-internal] refusing: need PostgreSQL 16 or 17 (Production runs 17); found $MAJOR" >&2; exit 1 ;;
esac
rm -rf "$WORK"; mkdir -p "$WORK/pg" "$WORK/auth-store"
initdb -D "$WORK/pg" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
pg_ctl -D "$WORK/pg" -o "-p $PG_PORT -c listen_addresses='127.0.0.1' -c unix_socket_directories=''" \
  -l "$WORK/pg/log" start >/dev/null
sleep 1
createdb -h 127.0.0.1 -p "$PG_PORT" -U postgres "$DB"
DSN="postgres://postgres@127.0.0.1:$PG_PORT/$DB"

# The three Supabase roles. The migrations grant to them but do not create them, and service_role
# carries BYPASSRLS for hosted parity — write denial rests on the grants (a privilege check precedes
# RLS), which is what tests/life-os/postgres-acceptance.sh §7 asserts.
#
# SERVICE_ROLE ALSO NEEDS THE GRANTS HOSTED SUPABASE MAKES AND NO MIGRATION REPEATS. Supabase's own
# bootstrap hands service_role every table in `public`; the migrations were written against that and
# so grant nothing themselves for the older verticals. yorisou_experience_cards,
# yorisou_experience_revisions and yorisou_experience_events are all in that group, and without this
# /api/life/experiences answers 500 `experience_store_failed:403` — a PostgREST permission denial,
# reported by a harness that had otherwise come up clean.
#
# DEFAULT PRIVILEGES, NOT A BLANKET GRANT AFTER THE FACT. The Life OS tables REVOKE from service_role
# and grant SELECT back (202608140001 §, 202608150001), so a `grant all on all tables` run after the
# migrations would hand back exactly the INSERT the migration took away — and this harness would then
# accept a direct-write bug that production refuses. A default privilege is applied at CREATE and a
# later REVOKE in the same migration still wins; the check after stage 2 proves it on every run.
#
# anon and authenticated get nothing beyond USAGE, deliberately. The app authenticates as
# service_role for every call, and leaving those two unprivileged keeps this cluster from satisfying
# a check that depends on their denial.
psql "$DSN" -q -X -v ON_ERROR_STOP=1 -c "
  create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";
  do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role anon nologin; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated nologin; exception when duplicate_object then null; end \$\$;
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to service_role;
  alter default privileges in schema public grant all on sequences to service_role;" >/dev/null

# ── 2. Migrations ────────────────────────────────────────────────────────────
echo "[osf1-internal] 2/7 migrations in lineage order"
for f in supabase/migrations/*.sql; do
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null 2>"$WORK/migrate.err" || {
    echo "[osf1-internal] FAILED applying $(basename "$f")" >&2
    head -5 "$WORK/migrate.err" >&2
    exit 1
  }
done
# The default privileges above must not have widened what the migrations narrowed. Every Life OS
# mutation goes through a SECURITY DEFINER RPC precisely because service_role cannot write these
# tables directly; a cluster where it can would let a direct-write regression pass here and fail in
# production, which is the one way this harness could become actively misleading.
WIDENED=$(psql "$DSN" -t -A -X -c "
  select count(*) from (values ('yorisou_user_contexts'),('yorisou_current_state_records'),
                               ('yorisou_goals'),('yorisou_life_reflections'),
                               ('yorisou_explicit_memories'),('yorisou_life_os_audit_events')) as t(name)
   where has_table_privilege('service_role','public.'||name,'insert');")
[ "$WIDENED" = "0" ] || {
  echo "[osf1-internal] refusing: service_role can INSERT into $WIDENED Life OS table(s) — this cluster is more permissive than production" >&2
  exit 1
}

# ── 3. PostgREST ─────────────────────────────────────────────────────────────
# The service-role key the app carries is an HS256 JWT with `role: service_role`, signed with the
# secret PostgREST validates against — the same shape as a hosted Supabase key, minted here in node
# so the harness adds no dependency. PostgREST refuses a secret under 32 characters.
echo "[osf1-internal] 3/7 PostgREST with a generated service-role JWT"
JWT_SECRET="osf1-internal-$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'))")"
SERVICE_KEY=$(S="$JWT_SECRET" node -e "const c=require('crypto');const b=(o)=>Buffer.from(JSON.stringify(o)).toString('base64url');const h=b({alg:'HS256',typ:'JWT'});const p=b({role:'service_role',iss:'osf1-internal',exp:Math.floor(Date.now()/1000)+86400});const s=c.createHmac('sha256',process.env.S).update(h+'.'+p).digest('base64url');console.log(h+'.'+p+'.'+s)")
cat > "$WORK/postgrest.conf" <<EOF
db-uri = "$DSN"
db-schemas = "public"
db-anon-role = "anon"
jwt-secret = "$JWT_SECRET"
server-host = "127.0.0.1"
server-port = $REST_PORT
db-pool = 6
EOF
"$POSTGREST" "$WORK/postgrest.conf" > "$WORK/postgrest.log" 2>&1 &
REST_PID=$!
disown "$REST_PID" 2>/dev/null || true
REST_CHECK=""
for _ in $(seq 1 60); do
  REST_CHECK=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $SERVICE_KEY" \
    "http://127.0.0.1:$REST_PORT/yorisou_life_reflections?select=id&limit=1" || true)
  [ "$REST_CHECK" = "200" ] && break
  sleep 1
done
[ "$REST_CHECK" = "200" ] || {
  echo "[osf1-internal] PostgREST not healthy (got $REST_CHECK)" >&2
  tail -20 "$WORK/postgrest.log" >&2
  exit 1
}

# ── 4. The /rest/v1 prefix ───────────────────────────────────────────────────
# lib/server/lifeOs/store.ts fetches `${SUPABASE_URL}/rest/v1/<path>`; raw PostgREST serves at the
# root. So SUPABASE_URL points at this proxy, which strips the prefix — the same two-line shim
# tests/daily-check-in/fullstack-local.sh uses, and the reason the app needs no test-only branch.
echo "[osf1-internal] 4/7 /rest/v1 prefix proxy"
node -e "
const http=require('http');
http.createServer((req,res)=>{
  const path=req.url.replace(/^\/rest\/v1/,'')||'/';
  const up=http.request({host:'127.0.0.1',port:$REST_PORT,path,method:req.method,headers:req.headers},(u)=>{res.writeHead(u.statusCode,u.headers);u.pipe(res);});
  up.on('error',()=>{res.writeHead(502);res.end();});
  req.pipe(up);
}).listen($PROXY_PORT,'127.0.0.1');
" > "$WORK/proxy.log" 2>&1 &
PROXY_PID=$!
disown "$PROXY_PID" 2>/dev/null || true
PROXY_CHECK=""
for _ in $(seq 1 20); do
  PROXY_CHECK=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $SERVICE_KEY" \
    "http://127.0.0.1:$PROXY_PORT/rest/v1/yorisou_life_reflections?select=id&limit=1" || true)
  [ "$PROXY_CHECK" = "200" ] && break
  sleep 1
done
[ "$PROXY_CHECK" = "200" ] || { echo "[osf1-internal] prefix proxy not healthy (got $PROXY_CHECK)" >&2; exit 1; }


# ── 5. Build ─────────────────────────────────────────────────────────────────
echo "[osf1-internal] 5/8 production build"
if [ "${OSF1_INT_REUSE_BUILD:-}" = "1" ]; then
  [ -f .next/BUILD_ID ] || { echo "[osf1-internal] REUSE_BUILD=1 but no .next/BUILD_ID" >&2; exit 1; }
  echo "[osf1-internal]     REUSE_BUILD=1 — reusing the existing .next"
else
  npm run build > "$WORK/build.log" 2>&1 || { echo "[osf1-internal] build failed" >&2; tail -30 "$WORK/build.log" >&2; exit 1; }
fi

# THE POR-1 SCHEMA-READY FLAGS, and why they belong here.
#
# In a production context registration goes through POR-1 canonical identity provisioning, which is
# gated on schema-readiness declarations — the same shape as the Life OS flag. Without them
# `ensureDeterministicEmailPrincipalForAccount` returns ok:false and registration answers 503 with
# `canonical_identity_failed`, which is what the previous attempt hit and mis-attributed to the object
# store. The declarations are TRUE here: stage 2 applied every migration in the lineage. This mirrors
# tests/por1/m3-journey-stack.sh, which established the contract.
#
# A REAL DISPOSABLE S3-COMPATIBLE STORE.
#
# `s3-compatible` is production architecture, not a test affordance — Supabase Storage's S3 gateway is
# the real user of that mode. A production deployment context is the only way to exercise INTERNAL,
# and in that context sharedStoreBoundary.ts correctly refuses to run with no store. So the rehearsal
# needs a store the auth layer can genuinely write to and read back.
#
# An earlier attempt used a stub that answered every request with static XML: the app booted and
# registration then returned 503, because a store that accepts writes and returns nothing is not a
# store. tests/life-os/disposable-s3.mjs is the real four-verb implementation, on loopback, in one
# disposable directory, killed with the rest of the stack. No production code is weakened and no
# test-only branch is added to any route.
STORE_PORT="${OSF1_INT_STORE_PORT:-55634}"
STORE_BUCKET="osf1-internal-rehearsal"
node tests/life-os/disposable-s3.mjs "$STORE_PORT" "$WORK/s3" > "$WORK/store.log" 2>&1 &
STORE_PID=$!
disown "$STORE_PID" 2>/dev/null || true
STORE_READY=""
for _ in $(seq 1 30); do
  STORE_READY=$(curl -s -o /dev/null -w '%{http_code}' -X PUT --data 'ok' \
    "http://127.0.0.1:$STORE_PORT/$STORE_BUCKET/healthcheck" || true)
  [ "$STORE_READY" = "200" ] && break
  sleep 1
done
[ "$STORE_READY" = "200" ] || { echo "[osf1-internal] disposable S3 not healthy (got $STORE_READY)" >&2; tail -5 "$WORK/store.log" >&2; exit 1; }
# Round-trip verified, not assumed: a store that accepts a write and cannot return it is the exact
# failure that produced the 503 last time.
BACK=$(curl -s "http://127.0.0.1:$STORE_PORT/$STORE_BUCKET/healthcheck")
[ "$BACK" = "ok" ] || { echo "[osf1-internal] disposable S3 did not return what it stored" >&2; exit 1; }
echo "[osf1-internal] disposable S3-compatible store healthy (write + read round-trip)"

FOUNDER_EMAIL="founder+osf1@yorisou.online"
NORMAL_EMAIL="normal+osf1@yorisou.online"
PASSWORD="Osf1-Internal-Str0ng!"
# GENERATED, not literal. These are throwaway values for one disposable run; writing them into the
# file makes them look like credentials to any scanner, and the changed-content secret gate is right
# to refuse that rather than try to judge intent.
COOKIE_SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
STORE_ACCESS_KEY="$(node -e "console.log(require('crypto').randomBytes(12).toString('hex'))")"
STORE_ACCESS_TOKEN="$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'))")"
FAILURES=0
pass() { printf '  ok   %s\n' "$1"; }
fail() { printf '  FAIL %s  %s\n' "$1" "${2:-}"; FAILURES=$((FAILURES+1)); }

# start_app <pilot-flags>  — the ONLY thing that varies between the two runs is the flag string.
start_app() {
  VERCEL_ENV=production \
  YORISOU_SHARED_STORE_BUCKET="$STORE_BUCKET" \
  YORISOU_SHARED_STORE_ENDPOINT=http://127.0.0.1:$STORE_PORT \
  YORISOU_SHARED_STORE_ACCESS_KEY_ID="$STORE_ACCESS_KEY" \
  YORISOU_SHARED_STORE_SECRET_ACCESS_KEY="$STORE_ACCESS_TOKEN" \
  YORISOU_SHARED_STORE_FORCE_PATH_STYLE=true \
  YORISOU_SHARED_STORE_REGION=us-east-1 \
  YORISOU_POR1_CANONICAL_CORE=on \
  YORISOU_POR1_CANONICAL_RECOMMENDATIONS=on \
  YORISOU_POR1_LINE_CANONICAL_RETURN=on \
  YORISOU_POR1_ACCOUNT_DELETION_EXECUTOR=on \
  YORISOU_POR1_ACCOUNT_MUTATION_FENCE_SCHEMA_READY=on \
  YORISOU_POR1_CANONICAL_IDENTITY_LINKS_SCHEMA_READY=on \
  YORISOU_POR1_CANONICAL_LINE_ACTIVITY_SCHEMA_READY=on \
  YORISOU_POR1_IDENTITY_PROVISIONING_SCHEMA_READY=on \
  YORISOU_POR1_ACCOUNT_ERASURE_AUTHORITY_SCHEMA_READY=on \
  YORISOU_PRIVATE_PILOT_FLAGS="$1" \
  YORISOU_ADMIN_EMAILS="$FOUNDER_EMAIL" \
  YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true \
  SUPABASE_URL="http://127.0.0.1:$PROXY_PORT" \
  SUPABASE_SERVICE_ROLE_KEY="$SERVICE_KEY" \
  YORISOU_DATA_DIR="$WORK/auth-store" \
  YORISOU_AUTH_COOKIE_SECRET="$COOKIE_SECRET" \
  npx next start -p "$APP_PORT" >> "$WORK/app.log" 2>&1 &
  APP_PID=$!
  disown "$APP_PID" 2>/dev/null || true
  for _ in $(seq 1 90); do
    curl -s -o /dev/null "http://127.0.0.1:$APP_PORT/" && break
    sleep 1
  done
}
stop_app() { [ -n "${APP_PID:-}" ] && kill "$APP_PID" 2>/dev/null; sleep 2; APP_PID=""; }

# register <email> <jar>  — through the REAL auth layer, so the session is a real session.
register() {
  curl -s -c "$2" -o /dev/null -w '%{http_code}' -X POST \
    -H 'Content-Type: application/json' \
    -d "{\"name\":\"osf1\",\"email\":\"$1\",\"password\":\"$PASSWORD\",\"city\":\"Tokyo\",\"role\":\"self\"}" \
    "http://127.0.0.1:$APP_PORT/api/auth/register"
}
code() { curl -s -b "$2" -o /dev/null -w '%{http_code}' "http://127.0.0.1:$APP_PORT$1"; }
body() { curl -s -b "$2" "http://127.0.0.1:$APP_PORT$1"; }

# ── 6. INTERNAL enabled ──────────────────────────────────────────────────────
echo "[osf1-internal] 6/8 INTERNAL enabled — founder vs ordinary account"
start_app "osf1_life_os_internal"
# ABORT, do not continue, if either account cannot be created.
#
# Everything below distinguishes a founder from an ordinary account. With no session at all BOTH get
# 404, so every "ordinary account is refused" assertion would pass while proving nothing — the most
# dangerous shape a test can take. An earlier run of this harness did exactly that, and the fix is to
# make the precondition fatal rather than to read past it.
R=$(register "$FOUNDER_EMAIL" "$WORK/founder.jar")
case "$R" in
  200|201) pass "founder account registered" ;;
  *)
    echo "  BLOCKED registration returned $R — no session can be created in a production context" >&2
    echo "  Every assertion below would be vacuous without one. See the blocker note in" >&2
    echo "  docs/yorisou/osf1/PHASE1_INTERNAL_BETA_READINESS.md." >&2
    tail -12 "$WORK/app.log" >&2
    # DIAGNOSTIC, so the blocker is described precisely rather than by its symptom. Which foundation
    # rows the provisioning managed to create tells us where in the canonical-identity chain it stops.
    echo "  --- foundation state after the failed attempt ---" >&2
    for t in yorisou_accounts user_profiles auth_identities yorisou_identity_provisioning_sagas; do
      C=$(psql "$DSN" -t -A -X -c "select count(*) from public.$t;" 2>/dev/null || echo "n/a")
      echo "    $t: $C" >&2
    done
    exit 2
    ;;
esac
R=$(register "$NORMAL_EMAIL" "$WORK/normal.jar")
case "$R" in 200|201) pass "ordinary account registered" ;; *) echo "  BLOCKED ordinary registration $R" >&2; exit 2 ;; esac

# The founder reaches the product.
for path in /life /life/timeline /life/reflect "/life/reflect?mode=postmortem" /life/goals /life/experience /life/memories; do
  C=$(code "$path" "$WORK/founder.jar")
  [ "$C" = "200" ] && pass "founder: $path opens" || fail "founder $path" "got $C"
done
C=$(code "/api/life/timeline" "$WORK/founder.jar")
[ "$C" = "200" ] && pass "founder: the read API answers" || fail "founder api" "got $C"
# A permitted write, through the real endpoint.
W=$(curl -s -b "$WORK/founder.jar" -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' \
      -d '{"title":"内部ベータの方向"}' "http://127.0.0.1:$APP_PORT/api/life/goals")
case "$W" in 200|201) pass "founder: a permitted write succeeds" ;; *) fail "founder write" "got $W" ;; esac
# Navigation is visible to the founder.
body "/me" "$WORK/founder.jar" | grep -q 'href="/life"' \
  && pass "founder: the Life entry point is in the navigation" || fail "founder nav" "no /life link"

# The ordinary account cannot tell the feature exists.
for path in /life /life/timeline /life/memories; do
  C=$(code "$path" "$WORK/normal.jar")
  [ "$C" = "404" ] && pass "ordinary account: $path is 404" || fail "normal $path" "got $C"
done
for path in /api/life/timeline /api/life/memories /api/life/goals; do
  C=$(code "$path" "$WORK/normal.jar")
  [ "$C" = "404" ] && pass "ordinary account: $path API is 404" || fail "normal api $path" "got $C"
done
W=$(curl -s -b "$WORK/normal.jar" -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' \
      -d '{"title":"通らないはず"}' "http://127.0.0.1:$APP_PORT/api/life/goals")
[ "$W" = "404" ] && pass "ordinary account: a write is refused with the same 404" || fail "normal write" "got $W"
body "/me" "$WORK/normal.jar" | grep -q 'href="/life"' \
  && fail "nav leak" "the ordinary account sees a Life link" \
  || pass "ordinary account: no Life link anywhere in the navigation"

# ── 7. Bypass attempts ───────────────────────────────────────────────────────
# Every one of these is a way an ordinary caller might try to claim authority. None may work.
echo "[osf1-internal] 7/8 bypass attempts"
C=$(code "/life?role=admin" "$WORK/normal.jar")
[ "$C" = "404" ] && pass "a role query parameter grants nothing" || fail "bypass query" "got $C"
C=$(code "/api/life/timeline?isFounderAdmin=true&role=service_role" "$WORK/normal.jar")
[ "$C" = "404" ] && pass "role query parameters on the API grant nothing" || fail "bypass api query" "got $C"
W=$(curl -s -b "$WORK/normal.jar" -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' \
      -d '{"title":"x","role":"admin","isFounderAdmin":true,"owner_account_id":"someone-else"}' \
      "http://127.0.0.1:$APP_PORT/api/life/goals")
[ "$W" = "404" ] && pass "a role claim in the body grants nothing" || fail "bypass body" "got $W"
W=$(curl -s -o /dev/null -w '%{http_code}' -H 'x-admin: true' -H 'x-yorisou-role: admin' \
      "http://127.0.0.1:$APP_PORT/api/life/timeline")
[ "$W" = "404" ] && pass "admin headers grant nothing" || fail "bypass header" "got $W"
W=$(curl -s -o /dev/null -w '%{http_code}' -H 'Cookie: yorisou_account=forged; yorisou_session=forged' \
      "http://127.0.0.1:$APP_PORT/api/life/timeline")
[ "$W" = "404" ] && pass "a forged cookie grants nothing" || fail "bypass cookie" "got $W"
C=$(code "/api/life/timeline" "/dev/null")
[ "$C" = "404" ] && pass "an unauthenticated direct API call is refused" || fail "bypass anon" "got $C"

# ── 8. KILL SWITCH, measured ─────────────────────────────────────────────────
echo "[osf1-internal] 8/9 kill-switch rehearsal"
# FIRST: change the environment WITHOUT touching the process, and see whether the running server
# notices. This is the measurement the runbook depends on, and guessing it would be worse than not
# testing it at all.
export YORISOU_PRIVATE_PILOT_FLAGS=""
C=$(code "/life" "$WORK/founder.jar")
if [ "$C" = "200" ]; then
  pass "MEASURED: editing the environment does NOT affect the running process — a restart is required"
  KILL_CLASS="restart_required"
else
  pass "MEASURED: the running process picked up the environment change without a restart"
  KILL_CLASS="no_restart"
fi

# NOW fire the switch the way an operator actually would: remove the flag and restart.
stop_app
start_app ""
for path in /life /life/timeline /life/memories; do
  C=$(code "$path" "$WORK/founder.jar")
  [ "$C" = "404" ] && pass "after the kill switch: founder gets 404 on $path" || fail "kill $path" "got $C"
done
C=$(code "/api/life/timeline" "$WORK/founder.jar")
[ "$C" = "404" ] && pass "after the kill switch: the read API is closed to the founder" || fail "kill api" "got $C"
W=$(curl -s -b "$WORK/founder.jar" -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' \
      -d '{"title":"閉じたあと"}' "http://127.0.0.1:$APP_PORT/api/life/goals")
[ "$W" = "404" ] && pass "after the kill switch: writes are closed to the founder" || fail "kill write" "got $W"
body "/me" "$WORK/founder.jar" | grep -q 'href="/life"' \
  && fail "kill nav" "the Life link survived the kill switch" \
  || pass "after the kill switch: the navigation entry disappears"

# The session is untouched — the person is still signed in, the FEATURE is closed. If this failed it
# would mean the kill switch signs people out, which is a different and much worse event.
C=$(code "/me" "$WORK/founder.jar")
[ "$C" = "200" ] && pass "the kill switch closes the feature without signing anyone out" || fail "kill session" "got $C"

echo
# ── 9. RESTORE, and prove recovery is clean ──────────────────────────────────
#
# A kill switch nobody can undo is an outage, not a switch. This also proves the cycle destroyed
# nothing: the goal written while INTERNAL was on must still be there afterwards.
echo "[osf1-internal] 9/9 restore INTERNAL and verify recovery"
GOALS_BEFORE=$(psql "$DSN" -t -A -X -c "select count(*) from public.yorisou_goals;")
stop_app
start_app "osf1_life_os_internal"
for path in /life /life/timeline /life/memories; do
  C=$(code "$path" "$WORK/founder.jar")
  [ "$C" = "200" ] && pass "after restore: founder reaches $path again" || fail "restore $path" "got $C"
done
C=$(code "/api/life/timeline" "$WORK/founder.jar")
[ "$C" = "200" ] && pass "after restore: the read API answers again" || fail "restore api" "got $C"
body "/me" "$WORK/founder.jar" | grep -q 'href="/life"' \
  && pass "after restore: the navigation entry returns" || fail "restore nav" "no /life link"
# The ordinary account must STILL be refused — restoring the feature must not widen it.
C=$(code "/life" "$WORK/normal.jar")
[ "$C" = "404" ] && pass "after restore: the ordinary account is still refused" || fail "restore leak" "got $C"

GOALS_AFTER=$(psql "$DSN" -t -A -X -c "select count(*) from public.yorisou_goals;")
[ "$GOALS_BEFORE" = "$GOALS_AFTER" ] \
  && pass "the switch cycle destroyed no data ($GOALS_AFTER rows before and after)" \
  || fail "data loss" "$GOALS_BEFORE -> $GOALS_AFTER"
# And cycling the switch must not have duplicated the write that happened while it was on.
DUPES=$(psql "$DSN" -t -A -X -c "select count(*) from public.yorisou_goals where title='内部ベータの方向';")
[ "$DUPES" = "1" ] && pass "cycling the switch created no duplicate mutation" || fail "duplicate" "$DUPES copies"

if [ "$FAILURES" -gt 0 ]; then echo "--- app log (last 25) ---"; tail -25 "$WORK/app.log"; fi
echo "[osf1-internal] kill-switch recovery class: $KILL_CLASS"
if [ "$FAILURES" -eq 0 ]; then echo "[osf1-internal] PASS"; else echo "[osf1-internal] FAIL ($FAILURES)"; exit 1; fi
