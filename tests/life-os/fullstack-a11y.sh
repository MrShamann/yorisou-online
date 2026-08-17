#!/usr/bin/env bash
# OSF-1 — AUTHENTICATED accessibility acceptance for the Life OS Phase 1 surfaces.
#
#   bash tests/life-os/fullstack-a11y.sh
#
# WHY THIS EXISTS.
#
# tests/smoke/osf1-life-a11y.spec.ts scans /life while signed OUT. Every Life OS page answers a
# signed-out visitor with SignInRequired — one heading, one paragraph, one link — so that run was
# scanning a sign-in notice and reporting it as the accessibility result for the product. It was
# green, and it was green about the wrong page. A gate that passes without ever reaching the surface
# it names is worse than no gate: it is a claim nobody will re-check.
#
# Reaching the real surfaces needs an account, and an account needs the whole stack: the encrypted
# session cookies, the API routes, the service-role PostgREST client and a migrated database. So this
# builds all of it, disposably, in one command — PostgreSQL from initdb, PostgREST from the Homebrew
# binary, the real Next.js app — seeds real records through the real /api/life/* endpoints, runs axe
# at both widths, and destroys everything.
#
# NO DOCKER. tests/daily-check-in/fullstack-local.sh runs PostgREST from a container; Docker is not
# running on the acceptance machine and requiring it would make this harness unrunnable exactly when
# it is needed. The local `postgrest` binary takes a config file and needs nothing else.
#
# THE SEEDING IS NOT DECORATION. An empty page hides most accessibility defects — no list, no status
# control, no dynamic region, nothing to label. The spec creates a current state, a goal, an
# experience, both reflection modes and two memories before it scans anything, so what axe sees is a
# populated product rather than five empty-state sentences.

set -euo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${OSF1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
POSTGREST="${OSF1_POSTGREST_BIN:-/opt/homebrew/bin/postgrest}"
# Ports of this harness's own, distinct from tests/daily-check-in/fullstack-local.sh (55446/55448/
# 55449/3200) and tests/life-os/postgres-acceptance.sh (55583), so the two can run side by side.
PG_PORT="${OSF1_A11Y_PG_PORT:-55591}"
REST_PORT="${OSF1_A11Y_REST_PORT:-55592}"
PROXY_PORT="${OSF1_A11Y_PROXY_PORT:-55593}"
APP_PORT="${OSF1_A11Y_APP_PORT:-3211}"
WORK="${OSF1_A11Y_WORK:-/tmp/osf1-a11y}"
DB=osf1_life_a11y
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
  if [ "${OSF1_A11Y_KEEP:-}" = "1" ]; then echo "[osf1-a11y] KEEP=1 — stack left running for debugging"; return; fi
  [ -n "${APP_PID:-}" ] && kill "$APP_PID" 2>/dev/null
  [ -n "${PROXY_PID:-}" ] && kill "$PROXY_PID" 2>/dev/null
  [ -n "${REST_PID:-}" ] && kill "$REST_PID" 2>/dev/null
  pg_ctl -D "$WORK/pg" stop -m immediate >/dev/null 2>&1
  rm -rf "$WORK"
  echo "[osf1-a11y] disposable stack torn down"
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
    echo "[osf1-a11y] port $port is busy. If a previous run was interrupted, its stack is still up:" >&2
    echo "[osf1-a11y]   pkill -f 'next start -p $APP_PORT'; pkill -f postgrest" >&2
    echo "[osf1-a11y]   $PGBIN/pg_ctl -D $WORK/pg stop -m immediate; rm -rf $WORK" >&2
    exit 1
  }
done
[ -x "$POSTGREST" ] || { echo "[osf1-a11y] no postgrest binary at $POSTGREST (set OSF1_POSTGREST_BIN)" >&2; exit 1; }

# From here on this script owns $WORK and the four ports, so an exit anywhere must tear them down.
trap cleanup EXIT

# ── 1. Database ──────────────────────────────────────────────────────────────
# LC_ALL=C and --no-locale are mandatory, not tidiness: initdb inherits the operator's locale and
# fails on this machine without them. Same setup as tests/life-os/postgres-acceptance.sh.
echo "[osf1-a11y] 1/7 disposable PostgreSQL cluster"
MAJOR="$("$PGBIN/postgres" --version | awk '{print $3}' | cut -d. -f1)"
case "$MAJOR" in
  16|17) : ;;
  *) echo "[osf1-a11y] refusing: need PostgreSQL 16 or 17 (Production runs 17); found $MAJOR" >&2; exit 1 ;;
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
echo "[osf1-a11y] 2/7 migrations in lineage order"
for f in supabase/migrations/*.sql; do
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null 2>"$WORK/migrate.err" || {
    echo "[osf1-a11y] FAILED applying $(basename "$f")" >&2
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
  echo "[osf1-a11y] refusing: service_role can INSERT into $WIDENED Life OS table(s) — this cluster is more permissive than production" >&2
  exit 1
}

# ── 3. PostgREST ─────────────────────────────────────────────────────────────
# The service-role key the app carries is an HS256 JWT with `role: service_role`, signed with the
# secret PostgREST validates against — the same shape as a hosted Supabase key, minted here in node
# so the harness adds no dependency. PostgREST refuses a secret under 32 characters.
echo "[osf1-a11y] 3/7 PostgREST with a generated service-role JWT"
JWT_SECRET="osf1-a11y-$(date +%s)-0123456789abcdef0123456789abcdef"
SERVICE_KEY=$(S="$JWT_SECRET" node -e "const c=require('crypto');const b=(o)=>Buffer.from(JSON.stringify(o)).toString('base64url');const h=b({alg:'HS256',typ:'JWT'});const p=b({role:'service_role',iss:'osf1-a11y',exp:Math.floor(Date.now()/1000)+86400});const s=c.createHmac('sha256',process.env.S).update(h+'.'+p).digest('base64url');console.log(h+'.'+p+'.'+s)")
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
  echo "[osf1-a11y] PostgREST not healthy (got $REST_CHECK)" >&2
  tail -20 "$WORK/postgrest.log" >&2
  exit 1
}

# ── 4. The /rest/v1 prefix ───────────────────────────────────────────────────
# lib/server/lifeOs/store.ts fetches `${SUPABASE_URL}/rest/v1/<path>`; raw PostgREST serves at the
# root. So SUPABASE_URL points at this proxy, which strips the prefix — the same two-line shim
# tests/daily-check-in/fullstack-local.sh uses, and the reason the app needs no test-only branch.
echo "[osf1-a11y] 4/7 /rest/v1 prefix proxy"
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
[ "$PROXY_CHECK" = "200" ] || { echo "[osf1-a11y] prefix proxy not healthy (got $PROXY_CHECK)" >&2; exit 1; }

# ── 5. Build ─────────────────────────────────────────────────────────────────
# A production build, not `next dev`: the dev server injects its own overlay and indicator into every
# page, and axe would scan those and report on Next.js rather than on this product.
echo "[osf1-a11y] 5/7 production build"
if [ "${OSF1_A11Y_REUSE_BUILD:-}" = "1" ]; then
  # REFUSE rather than fall back to building. Someone who sets this has decided not to spend a build
  # — often because another one is already running on the same machine, in which case `next build`
  # exits on its own lock and takes the whole run down at stage 5 having brought up four services
  # first. Saying so is more useful than doing the thing that was declined.
  [ -f .next/BUILD_ID ] || {
    echo "[osf1-a11y] REUSE_BUILD=1 but there is no .next/BUILD_ID to reuse — run npm run build first" >&2
    exit 1
  }
  echo "[osf1-a11y]     REUSE_BUILD=1 — reusing the existing .next (it may not match the working tree)"
else
  npm run build > "$WORK/build.log" 2>&1 || { echo "[osf1-a11y] build failed" >&2; tail -30 "$WORK/build.log" >&2; exit 1; }
fi

# ── 6. App ───────────────────────────────────────────────────────────────────
# THE EXACT VARIABLES THAT OPEN THE FEATURE, and nothing broader.
#
#   YORISOU_CI_TEST=1                       deploymentContext() -> "test", which lifeOsAccess()
#                                           answers `trusted_test`. `next start` runs with
#                                           NODE_ENV=production and no VERCEL_ENV, which is `unknown`
#                                           and fails closed — so without this the routes 404.
#   YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true  the separate declaration lifeOsMutationAccess() requires
#                                           before any write is accepted. It is true here because
#                                           stage 2 genuinely applied the migrations.
#
# lib/life-os/access.ts is not modified and not consulted differently: this is the ordinary trusted
# local/test path every other closed surface in the repository uses for acceptance.
echo "[osf1-a11y] 6/7 app server with the Life OS open for a trusted test context"
YORISOU_CI_TEST=1 \
YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true \
SUPABASE_URL="http://127.0.0.1:$PROXY_PORT" \
SUPABASE_SERVICE_ROLE_KEY="$SERVICE_KEY" \
YORISOU_DATA_DIR="$WORK/auth-store" \
YORISOU_AUTH_COOKIE_SECRET="osf1-a11y-cookie-secret-0123456789abcdef0123456789abcdef" \
npx next start -p "$APP_PORT" > "$WORK/app.log" 2>&1 &
APP_PID=$!
disown "$APP_PID" 2>/dev/null || true
APP_CHECK=""
for _ in $(seq 1 90); do
  APP_CHECK=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$APP_PORT/life" || true)
  [ "$APP_CHECK" = "200" ] && break
  sleep 1
done
# A 404 here is the feature gate, not a missing route — it means the env above did not open it, and
# the accessibility run would otherwise scan a not-found page and pass.
[ "$APP_CHECK" = "200" ] || {
  echo "[osf1-a11y] /life did not answer 200 (got $APP_CHECK) — the Life OS gate is closed or the app failed to start" >&2
  tail -30 "$WORK/app.log" >&2
  exit 1
}

# ── 7. The run ───────────────────────────────────────────────────────────────
#
# The spec is selectable because the stack is the expensive part and it is identical for every
# authenticated Life OS test. A third near-copy of two hundred lines of PostgreSQL + PostgREST +
# proxy + build + server would be three places to fix the next time one of them changes.
#
#   OSF1_STACK_SPEC=tests/smoke/osf1-life-reflection-e2e.spec.ts bash tests/life-os/fullstack-a11y.sh
#
# The database credentials are handed to the spec so an end-to-end test can verify what actually
# landed in PostgreSQL, rather than trusting the screen it just drove.
SPEC="${OSF1_STACK_SPEC:-tests/smoke/osf1-life-authenticated-a11y.spec.ts}"
echo "[osf1-a11y] 7/7 authenticated run — $SPEC"
OSF1_FULLSTACK_A11Y=1 \
PLAYWRIGHT_BASE_URL="http://127.0.0.1:$APP_PORT" \
OSF1_REST_URL="http://127.0.0.1:$PROXY_PORT" \
OSF1_SERVICE_KEY="$SERVICE_KEY" \
npx playwright test "$SPEC" --project=desktop

echo "[osf1-a11y] PASS — $SPEC; teardown follows"
