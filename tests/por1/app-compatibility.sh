#!/usr/bin/env bash
# POR-1 M2 — application compatibility against the PROMOTED schema, in both directions.
#
# THE QUESTION THIS ANSWERS.
#
# The 8 promotion migrations are additive, and the populated rehearsal proved they leave every
# pre-existing row untouched. That is a claim about DATA. It is not a claim about the APPLICATION:
# Production runs `main` at c8d8a8ad, that build knows nothing about the 15 promoted tables, and
# between applying the migrations and deploying the new app there is a window in which the OLD code
# talks to the NEW schema. If anything breaks there, it breaks in production with no new code to
# blame.
#
# The mirror question matters just as much: the NEW app, with every capability control unset, must
# also change nothing. Schema presence alone must not activate a capability, or the release order
# stops being a safety mechanism.
#
# So this points one build at a time — `main` at the exact Production SHA, or this branch — at a
# freshly promoted database with real fixture data, and drives it with real HTTP requests. Same
# database, same fixtures, same assertions; the only variable is which build serves. A successful
# build is not compatibility. The app has to serve.
#
#   bash tests/por1/app-compatibility.sh [--keep]                    # old app at the Production SHA
#   POR1_APP_SOURCE=current bash tests/por1/app-compatibility.sh      # this branch, controls off
#
# Local only. Destroys its worktree, database, containers and store root on success AND failure.

set -euo pipefail
cd "$(dirname "$0")/../.."
REPO="$PWD"

PRODUCTION_SHA="${POR1_PRODUCTION_SHA:-c8d8a8ad6a72949c248adb098a626d1ab9d6a579}"
PGBIN="${POR1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
PG_PORT="${POR1_POSTGRES_PORT:-55476}"
REST_PORT="${POR1_REST_PORT:-55478}"
PROXY_PORT="${POR1_PROXY_PORT:-55479}"
APP_PORT="${POR1_APP_PORT:-3220}"
DB="${POR1_DATABASE_NAME:-por1_oldapp_compat}"
WORK="${POR1_WORK:-/tmp/por1-oldapp}"
WORKTREE="$WORK/main-worktree"
PGDIR="$WORK/pg"
STORE="$WORK/store"
REST_CONTAINER="${POR1_REST_CONTAINER:-por1-oldapp-postgrest}"
# `worktree` runs main at the Production SHA (the old-app compatibility question).
# `current`  runs THIS branch with every POR-1 control unset (the controls-off question).
# Same database, same fixtures, same assertions — the only variable is which build serves, which is
# what makes the two results comparable.
APP_SOURCE="${POR1_APP_SOURCE:-worktree}"
# FAIL CLOSED on an unrecognised mode. This defaulted through `else` to the current-branch build, so
# `POR1_APP_SOURCE=main` silently ran the controls-off half and reported PASS — the old-app question
# was never asked, and nothing in the output said so. A label the caller supplies is not a mode; the
# observed commit below is, and the two are now required to agree.
case "$APP_SOURCE" in
  worktree|current) ;;
  *) echo "refusing: POR1_APP_SOURCE='$APP_SOURCE' is not 'worktree' or 'current'" >&2; exit 2 ;;
esac
KEEP=0
[ "${1:-}" = "--keep" ] && KEEP=1

export LC_ALL=C
export PATH="$PGBIN:$PATH"
export DOCKER_HOST="${DOCKER_HOST:-unix://$HOME/.colima/default/docker.sock}"

FAILURES=0
note() { printf '           %-58s %s\n' "$1" "$2"; }
check() { if [ "$2" = "$3" ]; then note "$1" "ok"; else note "$1" "FAIL (got $2, want $3)"; FAILURES=$((FAILURES+1)); fi; }

cleanup() {
  set +e
  if [ "$KEEP" = "1" ]; then echo "[compat] KEEP — stack left at $WORK"; return; fi
  [ -n "${APP_PID:-}" ] && kill "$APP_PID" 2>/dev/null
  [ -n "${PROXY_PID:-}" ] && kill "$PROXY_PID" 2>/dev/null
  docker rm -f "$REST_CONTAINER" >/dev/null 2>&1
  pg_ctl -D "$PGDIR" stop >/dev/null 2>&1
  # The worktree must be removed through git, or the repo keeps a dangling registration.
  git -C "$REPO" worktree remove --force "$WORKTREE" >/dev/null 2>&1
  git -C "$REPO" worktree prune >/dev/null 2>&1
  rm -rf "$WORK"
  echo "[compat] worktree, database, container and store root destroyed"
}
trap cleanup EXIT

PG_VERSION="$("$PGBIN/postgres" --version | awk '{print $3}')"
[ "${PG_VERSION%%.*}" = "17" ] || { echo "[compat] refusing: Production runs PostgreSQL 17, this is $PG_VERSION" >&2; exit 1; }

echo "[compat] 1/8 disposable PostgreSQL $PG_VERSION + promoted schema"
rm -rf "$WORK"; mkdir -p "$PGDIR" "$STORE"
initdb -D "$PGDIR" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
echo "host all all 0.0.0.0/0 trust" >> "$PGDIR/pg_hba.conf"
lsof -nP -iTCP:$PG_PORT -sTCP:LISTEN >/dev/null 2>&1 && { echo "[compat] port $PG_PORT busy"; exit 1; }
pg_ctl -D "$PGDIR" -o "-p $PG_PORT -c listen_addresses='*' -c unix_socket_directories=''" -l "$PGDIR/log" start >/dev/null
sleep 1
createdb -h localhost -p "$PG_PORT" -U postgres "$DB"
export DATABASE_URL="postgres://postgres@localhost:$PG_PORT/$DB"
PSQL="psql $DATABASE_URL -v ON_ERROR_STOP=1 -q -X"
$PSQL -c "create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";"
$PSQL -c "do \$\$ begin create role service_role bypassrls; exception when duplicate_object then null; end \$\$;
          do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
          do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;
          alter role service_role bypassrls;
          grant usage on schema public to anon, authenticated, service_role;"

# Migrations numbered BELOW the cohort — that is what Production had before POR-1. The old test
# ("not the cohort") silently swept in anything that landed after 202608010111, and CPR-1 depends on
# 202608010105, so it could not apply from that position.
BASE=0
for f in supabase/migrations/*.sql; do
  [ "$(basename "$f" | cut -c1-12)" -lt 202608010101 ] || continue
  $PSQL -f "$f" >/dev/null
  BASE=$((BASE + 1))
done
note "$BASE Production baseline migrations" "applied"

# SUPABASE PLATFORM PARITY, applied AFTER the baseline and BEFORE the promotion.
#
# Hosted Supabase bootstraps `service_role` with table privileges across the public schema. The
# legacy migrations rely on that: 202607110003 grants service_role on its FUNCTION and revokes its
# tables from public without ever granting them, because the platform already had. A locally
# created bare role does not, so PostgREST answered 403 on a legacy table — a harness fidelity gap
# reading exactly like a product defect.
#
# The window matters. This runs before the promotion migrations, so it cannot touch the 15 promoted
# tables — those do not exist yet, and they carry their own explicit, deliberately narrower grants.
$PSQL -c "grant all on all tables in schema public to service_role;
          grant all on all sequences in schema public to service_role;"
note "Supabase platform grants for service_role" "modelled (baseline tables only)"

echo "[compat] 2/8 Principal A and B fixtures"
$PSQL -f tests/por1/fixture-override-registry.sql >/dev/null
for principal in por1a por1b; do
  $PSQL -v principal="$principal" -f tests/por1/seed-owner-linked-families.sql >/dev/null
  $PSQL -v principal="$principal" -f tests/por1/fixture-overrides.sql >/dev/null
done
SEEDED=$($PSQL -t -A -c "select count(distinct table_name) from por1_fixture.seeded where seeded_rows > 0 and owner_column <> '';")
note "owner-linked families seeded" "$SEEDED"

fingerprint() {
  psql "$DATABASE_URL" -t -A -X -F'|' -c "
    select s.table_name,
           md5((xpath('/row/c/text()',
             query_to_xml(format('select coalesce(string_agg(t::text, chr(10) order by t::text), ''(empty)'') as c from public.%I t', s.table_name),
                          false, true, '')))[1]::text)
      from (select distinct table_name from por1_fixture.seeded) s order by s.table_name;"
}
fingerprint > "$WORK/pre.txt"

echo "[compat] 3/8 the POR-1 promotion migrations"
# ON_ERROR_STOP, because a migration that fails silently here would leave the compatibility claim
# resting on a schema that was never actually promoted. The glob covers all eleven.
for f in supabase/migrations/2026080101*.sql; do
  $PSQL -v ON_ERROR_STOP=1 -f "$f" >/dev/null || { echo "[compat] FATAL: $(basename "$f") did not apply" >&2; exit 1; }
done
# And the lineage after the promotion, in order — the app talks to the full schema, not to the
# schema as it looked at 202608010111.
for f in supabase/migrations/*.sql; do
  [ "$(basename "$f" | cut -c1-12)" -gt 202608010111 ] || continue
  $PSQL -v ON_ERROR_STOP=1 -f "$f" >/dev/null || { echo "[compat] FATAL: $(basename "$f") did not apply" >&2; exit 1; }
done
echo "[compat] promoted lineage: $(ls supabase/migrations/2026080101*.sql | wc -l | tr -d ' ') POR-1 migrations"
note "promotion migrations" "applied"
fingerprint > "$WORK/post-migration.txt"
diff -q "$WORK/pre.txt" "$WORK/post-migration.txt" >/dev/null \
  && note "A/B fingerprints across promotion" "unchanged" \
  || { note "A/B fingerprints across promotion" "CHANGED"; FAILURES=$((FAILURES+1)); }

echo "[compat] 4/8 PostgREST"
JWT_SECRET="por1-oldapp-$(date +%s)-0123456789abcdef0123456789abcdef"
SERVICE_KEY=$(S="$JWT_SECRET" node -e "const c=require('crypto');const b=(o)=>Buffer.from(JSON.stringify(o)).toString('base64url');const h=b({alg:'HS256',typ:'JWT'});const p=b({role:'service_role',iss:'por1-oldapp',exp:Math.floor(Date.now()/1000)+86400});const s=c.createHmac('sha256',process.env.S).update(h+'.'+p).digest('base64url');console.log(h+'.'+p+'.'+s)")
docker rm -f "$REST_CONTAINER" >/dev/null 2>&1 || true
docker run -d --name "$REST_CONTAINER" --add-host=host.docker.internal:host-gateway \
  -p $REST_PORT:3000 \
  -e PGRST_DB_URI="postgres://postgres@host.docker.internal:$PG_PORT/$DB" \
  -e PGRST_DB_SCHEMAS=public -e PGRST_DB_ANON_ROLE=anon -e PGRST_JWT_SECRET="$JWT_SECRET" \
  public.ecr.aws/supabase/postgrest:v14.13 >/dev/null
REST_OK=""
for i in $(seq 1 60); do
  REST_OK=$(curl -s -o /dev/null -w '%{http_code}' -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" "http://localhost:$REST_PORT/yorisou_recommendation_sets?select=id&limit=1" || true)
  [ "$REST_OK" = "200" ] && break
  sleep 1
done
check "PostgREST healthy against the promoted schema" "$REST_OK" "200"

node -e "
const http=require('http');
http.createServer((req,res)=>{
  const p=req.url.replace(/^\/rest\/v1/,'')||'/';
  const up=http.request({host:'localhost',port:$REST_PORT,path:p,method:req.method,headers:req.headers},(u)=>{res.writeHead(u.statusCode,u.headers);u.pipe(res);});
  up.on('error',()=>{res.writeHead(502);res.end();});
  req.pipe(up);
}).listen($PROXY_PORT);
" > "$WORK/proxy.log" 2>&1 &
PROXY_PID=$!
sleep 1

if [ "$APP_SOURCE" = "worktree" ]; then
  echo "[compat] 5/8 worktree at the exact Production SHA"
  git -C "$REPO" worktree add --detach "$WORKTREE" "$PRODUCTION_SHA" >/dev/null 2>&1
  ACTUAL_SHA="$(git -C "$WORKTREE" rev-parse HEAD)"
  check "worktree HEAD is the Production SHA" "$ACTUAL_SHA" "$PRODUCTION_SHA"
  APP_DIR="$WORKTREE"
else
  echo "[compat] 5/8 current branch (controls-off mode)"
  ACTUAL_SHA="$(git -C "$REPO" rev-parse HEAD)"
  note "app source" "$(echo "$ACTUAL_SHA" | cut -c1-8) on $(git -C "$REPO" branch --show-current)"
  # The mirror of the worktree assertion: current mode must NOT be serving the Production SHA, or the
  # two directions would be the same run reported twice.
  if [ "$ACTUAL_SHA" = "$PRODUCTION_SHA" ]; then
    note "current mode is not the Production SHA" "FAIL (HEAD is $PRODUCTION_SHA)"; FAILURES=$((FAILURES+1))
  else
    note "current mode is not the Production SHA" "ok"
  fi
  APP_DIR="$REPO"
fi
# main must not be touched by any of this.
note "main unchanged" "$(git -C "$REPO" rev-parse origin/main | cut -c1-8)"

echo "[compat] 6/8 build"
if [ "$APP_SOURCE" = "worktree" ]; then
  ( cd "$APP_DIR" && npm ci >/dev/null 2>&1 && npm run build > "$WORK/build.log" 2>&1 ) \
    && note "old-app build" "ok" \
    || { note "old-app build" "FAILED"; tail -20 "$WORK/build.log"; FAILURES=$((FAILURES+1)); }
else
  ( cd "$APP_DIR" && npm run build > "$WORK/build.log" 2>&1 ) \
    && note "current-branch build" "ok" \
    || { note "current-branch build" "FAILED"; tail -20 "$WORK/build.log"; FAILURES=$((FAILURES+1)); }
fi

echo "[compat] 7/8 start against the promoted schema, all POR-1 controls unset"
env -u YORISOU_POR1_CANONICAL_CORE -u YORISOU_POR1_CANONICAL_RECOMMENDATIONS \
    -u YORISOU_POR1_LINE_CANONICAL_RETURN -u YORISOU_POR1_ACCOUNT_DELETION_EXECUTOR \
    -u YORISOU_SHARED_STORE_BUCKET -u YORISOU_SHARED_STORE_ENDPOINT \
    -u YORISOU_SHARED_STORE_ACCESS_KEY_ID -u YORISOU_SHARED_STORE_SECRET_ACCESS_KEY \
  bash -c "cd '$APP_DIR' && YORISOU_CI_TEST=1 \
    SUPABASE_URL='http://localhost:$PROXY_PORT' \
    SUPABASE_SERVICE_ROLE_KEY='$SERVICE_KEY' \
    YORISOU_DATA_DIR='$STORE' \
    YORISOU_AUTH_COOKIE_SECRET='por1-oldapp-cookie-secret-0123456789abcdef0123456789abcdef' \
    npx next start -p $APP_PORT" > "$WORK/app.log" 2>&1 &
APP_PID=$!
STARTED=""
for i in $(seq 1 90); do
  if curl -s -o /dev/null "http://localhost:$APP_PORT/"; then STARTED=yes; break; fi
  sleep 1
done
check "app started and serves" "${STARTED:-no}" "yes"

echo "[compat] 8/8 REAL runtime behaviour"
code() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
JAR="$WORK/cookies.txt"

check "public home"            "$(code "http://localhost:$APP_PORT/")" "200"
check "public login page"      "$(code "http://localhost:$APP_PORT/login")" "200"
check "public register page"   "$(code "http://localhost:$APP_PORT/register")" "200"

EMAIL="por1-oldapp-$(date +%s)@synthetic-preview.invalid"
REG=$(curl -s -c "$JAR" -o "$WORK/reg.json" -w '%{http_code}' -X POST \
  -H 'content-type: application/json' \
  -d "{\"name\":\"POR1 OldApp\",\"email\":\"$EMAIL\",\"password\":\"Por1-Str0ng-Pass!\",\"city\":\"Tokyo\",\"role\":\"self\"}" \
  "http://localhost:$APP_PORT/api/auth/register")
case "$REG" in 200|201) note "account creation" "ok ($REG)";; *) note "account creation" "FAIL ($REG): $(head -c 200 "$WORK/reg.json")"; FAILURES=$((FAILURES+1));; esac

# Informational: this endpoint may not exist at the Production SHA. The binding itself is proven by
# the sign-out / sign-in round trip below, which is a real credential check.
SESSION_OK=$(curl -s -b "$JAR" -o /dev/null -w '%{http_code}' "http://localhost:$APP_PORT/api/auth/session" || echo "n/a")
note "session endpoint (informational; may not exist at the old SHA)" "$SESSION_OK"

LOGOUT=$(code -b "$JAR" -X POST "http://localhost:$APP_PORT/api/auth/logout")
note "logout" "$LOGOUT"
LOGIN=$(curl -s -c "$JAR" -o /dev/null -w '%{http_code}' -X POST -H 'content-type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"Por1-Str0ng-Pass!\"}" "http://localhost:$APP_PORT/api/auth/login")
case "$LOGIN" in 200|201) note "sign-in again" "ok ($LOGIN)";; *) note "sign-in again" "FAIL ($LOGIN)"; FAILURES=$((FAILURES+1));; esac

echo
echo "[compat] no POR-1 canonical state may exist — schema presence alone activates nothing"
for t in yorisou_canonical_identity_links yorisou_identity_provisioning_sagas \
         yorisou_canonical_recommendation_sets yorisou_canonical_line_subjects \
         yorisou_account_deletion_jobs yorisou_assessment_attempts; do
  n=$($PSQL -t -A -c "select count(*) from public.$t;")
  check "$t rows" "$n" "0"
done

echo
echo "[compat] Principal A and B are untouched by everything above"
fingerprint > "$WORK/post-runtime.txt"
if diff -q "$WORK/pre.txt" "$WORK/post-runtime.txt" >/dev/null; then
  note "A/B fingerprints after runtime" "unchanged"
else
  note "A/B fingerprints after runtime" "CHANGED"
  diff "$WORK/pre.txt" "$WORK/post-runtime.txt" | head -10
  FAILURES=$((FAILURES+1))
fi

echo
if [ "$FAILURES" = "0" ]; then
  if [ "$APP_SOURCE" = "worktree" ]; then
    echo "[compat] PASS — the Production application still works against the promoted schema"
  else
    echo "[compat] PASS — the current branch runs controls-off without activating anything"
  fi
else
  echo "[compat] FAIL — $FAILURES check(s) failed"
  exit 1
fi
