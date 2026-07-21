#!/usr/bin/env bash
# YV-1 §17 — authenticated FULL-STACK local acceptance (single documented command):
#   bash tests/daily-check-in/fullstack-local.sh
#
# Brings up a fully DISPOSABLE local stack — PostgreSQL (ephemeral initdb) +
# PostgREST (locally-present supabase/postgrest image) + the real Next.js app
# (production build) with an isolated auth file-store — runs the authenticated
# browser acceptance (tests/smoke/yorisou-values-fullstack.spec.ts) through the
# REAL route → auth/session layer → API handlers → server repository → PostgREST
# REST/RPC → migrated database, then tears everything down. No hosted database is
# contacted; no hosted migration is applied; all test data is removed.
set -euo pipefail
cd "$(dirname "$0")/../.."

PG_PORT=55446
REST_PORT=55448
PROXY_PORT=55449   # strips the Supabase-style /rest/v1 prefix for raw PostgREST
APP_PORT=3200
WORK="${YV_FULLSTACK_WORK:-/tmp/yv1-fullstack}"
PGDIR="$WORK/pg"
DATADIR="$WORK/auth-store"
PGBIN=/opt/homebrew/opt/postgresql@16/bin
DB=yorisou_values_test
REST_CONTAINER=yv1-postgrest

cleanup() {
  set +e
  if [[ "${YV_FULLSTACK_KEEP:-}" == "1" ]]; then echo "[fullstack] KEEP=1 — stack left running for debugging"; return; fi
  [[ -n "${APP_PID:-}" ]] && kill "$APP_PID" 2>/dev/null
  [[ -n "${PROXY_PID:-}" ]] && kill "$PROXY_PID" 2>/dev/null
  docker rm -f "$REST_CONTAINER" >/dev/null 2>&1
  LC_ALL=C "$PGBIN/pg_ctl" -D "$PGDIR" stop >/dev/null 2>&1
  rm -rf "$WORK"
  echo "[fullstack] disposable stack torn down; all test data removed"
}
trap cleanup EXIT

echo "[fullstack] 1/6 disposable PostgreSQL"
rm -rf "$WORK"; mkdir -p "$PGDIR" "$DATADIR"
LC_ALL=C "$PGBIN/initdb" -D "$PGDIR" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
# Disposable + local-only: listen on all interfaces so the PostgREST container
# (colima VM) can reach it; trust auth is acceptable for an ephemeral test DB.
echo "host all all 0.0.0.0/0 trust" >> "$PGDIR/pg_hba.conf"
# Refuse to run if anything else already listens on the disposable port.
if lsof -nP -iTCP:$PG_PORT -sTCP:LISTEN >/dev/null 2>&1; then echo "[fullstack] port $PG_PORT busy — stop the other instance first"; exit 1; fi
LC_ALL=C "$PGBIN/pg_ctl" -D "$PGDIR" -o "-p $PG_PORT -c listen_addresses='*' -c unix_socket_directories=''" -l "$PGDIR/log" start >/dev/null
sleep 1
"$PGBIN/createdb" -h localhost -p $PG_PORT -U postgres "$DB"
export DATABASE_URL="postgres://postgres@localhost:$PG_PORT/$DB"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c 'create extension if not exists pgcrypto;'
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "do \$\$ begin create role service_role bypassrls; exception when duplicate_object then null; end \$\$; do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$; do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -c "alter role service_role bypassrls;" # Supabase parity: hosted service_role carries BYPASSRLS; write denial rests on grants (privilege check precedes RLS)
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/migrations/202607210001_yv1_values_assessments.sql

echo "[fullstack] 2/6 PostgREST (service-role JWT)"
JWT_SECRET="yv1-local-fullstack-secret-$(date +%s)-0123456789abcdef"
SERVICE_KEY=$(S="$JWT_SECRET" node -e "const c=require('crypto');const b=(o)=>Buffer.from(JSON.stringify(o)).toString('base64url');const h=b({alg:'HS256',typ:'JWT'});const p=b({role:'service_role',iss:'yv1-local',exp:Math.floor(Date.now()/1000)+86400});const s=c.createHmac('sha256',process.env.S).update(h+'.'+p).digest('base64url');console.log(h+'.'+p+'.'+s)")
docker rm -f "$REST_CONTAINER" >/dev/null 2>&1 || true
docker run -d --name "$REST_CONTAINER" --add-host=host.docker.internal:host-gateway \
  -p $REST_PORT:3000 \
  -e PGRST_DB_URI="postgres://postgres@host.docker.internal:$PG_PORT/$DB" \
  -e PGRST_DB_SCHEMAS=public \
  -e PGRST_DB_ANON_ROLE=anon \
  -e PGRST_JWT_SECRET="$JWT_SECRET" \
  public.ecr.aws/supabase/postgrest:v14.13 >/dev/null
REST_CHECK=""
for i in $(seq 1 60); do
  REST_CHECK=$(curl -s -o /dev/null -w '%{http_code}' -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" "http://localhost:$REST_PORT/yorisou_values_assessments?select=id&limit=1" || true)
  [[ "$REST_CHECK" == "200" ]] && break
  sleep 1
done
if [[ "$REST_CHECK" != "200" ]]; then echo "[fullstack] PostgREST not healthy (got $REST_CHECK)"; docker logs "$REST_CONTAINER" | tail -20; exit 1; fi
echo "[fullstack] PostgREST healthy (service-role read 200, schema cache loaded)"

echo "[fullstack] 2b/6 /rest/v1 prefix proxy (raw PostgREST serves at root)"
node -e "
const http=require('http');
http.createServer((req,res)=>{
  const path=req.url.replace(/^\/rest\/v1/,'')||'/';
  const up=http.request({host:'localhost',port:$REST_PORT,path,method:req.method,headers:req.headers},(u)=>{res.writeHead(u.statusCode,u.headers);u.pipe(res);});
  up.on('error',()=>{res.writeHead(502);res.end();});
  req.pipe(up);
}).listen($PROXY_PORT);
" > "$WORK/proxy.log" 2>&1 &
PROXY_PID=$!
sleep 1

echo "[fullstack] 3/6 production build"
npm run build >/dev/null 2>&1

echo "[fullstack] 4/6 app server (test context, isolated auth store)"
YORISOU_CI_TEST=1 \
SUPABASE_URL="http://localhost:$PROXY_PORT" \
SUPABASE_SERVICE_ROLE_KEY="$SERVICE_KEY" \
YORISOU_DATA_DIR="$DATADIR" \
YORISOU_AUTH_COOKIE_SECRET="yv1-local-cookie-secret-0123456789abcdef0123456789abcdef" \
npx next start -p $APP_PORT > "$WORK/app.log" 2>&1 &
APP_PID=$!
for i in $(seq 1 60); do
  if curl -s -o /dev/null "http://localhost:$APP_PORT/"; then break; fi
  sleep 1
done

echo "[fullstack] 5/6 authenticated browser acceptance"
YV_FULLSTACK=1 \
YV_REST_URL="http://localhost:$REST_PORT" \
YV_SERVICE_KEY="$SERVICE_KEY" \
PLAYWRIGHT_BASE_URL="http://localhost:$APP_PORT" \
npx playwright test tests/smoke/yorisou-values-fullstack.spec.ts --project=desktop

echo "[fullstack] 6/6 PASSED — teardown follows"
