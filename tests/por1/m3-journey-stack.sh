#!/usr/bin/env bash
# POR-1 M3 — the stack Principal C's journey runs against.
#
# Promoted schema, the four capabilities ON, the four readiness facts ON, and one owning application
# process. This is the only configuration in which the canonical paths are live, so it is the only
# one in which the journey means anything.
#
#   bash tests/por1/m3-journey-stack.sh [--keep]

set -euo pipefail
cd "$(dirname "$0")/../.."
REPO="$PWD"

PGBIN="${POR1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
PG_PORT="${POR1_POSTGRES_PORT:-55526}"
REST_PORT="${POR1_REST_PORT:-55528}"
PROXY_PORT="${POR1_PROXY_PORT:-55529}"
APP_PORT="${POR1_APP_PORT:-3240}"
DB="${POR1_DATABASE_NAME:-por1_m3_journey}"
WORK="${POR1_WORK:-/tmp/por1-m3}"
PGDIR="$WORK/pg"
STORE="$WORK/store"
# Mode-0600, outside the repository, destroyed by the cleanup trap below.
HANDOFF="$WORK/.principal-c-handoff.json"
REST_CONTAINER="${POR1_REST_CONTAINER:-por1-m3-postgrest}"
# ── SHARED OBJECT STORE ───────────────────────────────────────────────────────
#
# The deletion saga's session_revocation stage writes through the shared store. Without one the
# executor now refuses BEFORE the irreversible boundary (which is correct), and erasure can never be
# proven on this stack. MinIO gives the real `s3-compatible` adapter a real networked service, so the
# erasure path runs through production code rather than a double.
MINIO_CONTAINER="${POR1_MINIO_CONTAINER:-por1-m3-minio}"
MINIO_PORT="${POR1_MINIO_PORT:-55531}"
MINIO_BUCKET="${POR1_MINIO_BUCKET:-por1-m3-identity}"
# Random per run, passed only through process environment, never written to tracked evidence.
MINIO_ACCESS_KEY="por1$(head -c 12 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 12)"
MINIO_SECRET_KEY="$(head -c 32 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 32)"
KEEP=0
[ "${1:-}" = "--keep" ] && KEEP=1

export LC_ALL=C
export PATH="$PGBIN:$PATH"
export DOCKER_HOST="${DOCKER_HOST:-unix://$HOME/.colima/default/docker.sock}"

cleanup() {
  set +e
  if [ "$KEEP" = "1" ]; then echo "[m3] KEEP — stack left at $WORK (db $DB on $PG_PORT, app $APP_PORT)"; return; fi
  [ -n "${APP_PID:-}" ] && kill "$APP_PID" 2>/dev/null
  [ -n "${PROXY_PID:-}" ] && kill "$PROXY_PID" 2>/dev/null
  docker rm -f "$REST_CONTAINER" >/dev/null 2>&1
  docker rm -f "$MINIO_CONTAINER" >/dev/null 2>&1
  pg_ctl -D "$PGDIR" stop >/dev/null 2>&1
  rm -f "$HANDOFF"
  rm -rf "$WORK"
  echo "[m3] stack destroyed (credential handoff removed)"
}
trap cleanup EXIT

PG_VERSION="$("$PGBIN/postgres" --version | awk '{print $3}')"
[ "${PG_VERSION%%.*}" = "17" ] || { echo "[m3] refusing: Production runs PostgreSQL 17, this is $PG_VERSION" >&2; exit 1; }

echo "[m3] 1/5 promoted database on PostgreSQL $PG_VERSION"
rm -rf "$WORK"; mkdir -p "$PGDIR" "$STORE"
initdb -D "$PGDIR" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
echo "host all all 0.0.0.0/0 trust" >> "$PGDIR/pg_hba.conf"
lsof -nP -iTCP:$PG_PORT -sTCP:LISTEN >/dev/null 2>&1 && { echo "[m3] port $PG_PORT busy"; exit 1; }
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
# THE BASELINE IS WHAT PRODUCTION HAD BEFORE POR-1: migrations numbered below the cohort. It used
# to be "everything that is not the cohort", which was the same set until a migration landed after
# 202608010111 — CPR-1 then depends on 202608010105 and could not apply as a "baseline" migration.
for f in supabase/migrations/*.sql; do
  [ "$(basename "$f" | cut -c1-12)" -lt 202608010101 ] || continue
  $PSQL -f "$f" >/dev/null
done
# Supabase platform parity for the legacy tables — see tests/por1/app-compatibility.sh for why.
$PSQL -c "grant all on all tables in schema public to service_role;
          grant all on all sequences in schema public to service_role;"
for f in supabase/migrations/2026080101*.sql; do $PSQL -f "$f" >/dev/null; done
# Then everything that came AFTER the promotion, in lineage order, so the stack this journey runs
# against is the schema the application actually talks to rather than a truncated one.
POST=0
for f in supabase/migrations/*.sql; do
  [ "$(basename "$f" | cut -c1-12)" -gt 202608010111 ] || continue
  $PSQL -v ON_ERROR_STOP=1 -f "$f" >/dev/null \
    || { echo "[m3] FATAL: $(basename "$f") did not apply" >&2; exit 1; }
  POST=$((POST + 1))
done
echo "           baseline + 11 promotion + $POST post-promotion migrations applied"

echo "[m3] 2/5 Principal A and B (so C's deletion can be measured against a bystander in M4)"
$PSQL -f tests/por1/fixture-override-registry.sql >/dev/null
for principal in por1a por1b; do
  $PSQL -v principal="$principal" -f tests/por1/seed-owner-linked-families.sql >/dev/null 2>&1
  $PSQL -v principal="$principal" -f tests/por1/fixture-overrides.sql >/dev/null 2>&1
done
echo "           owner-linked families seeded: $($PSQL -t -A -c "select count(distinct table_name) from por1_fixture.seeded where seeded_rows > 0 and owner_column <> '';")"

echo "[m3] 3/5 PostgREST"
JWT_SECRET="por1-m3-$(date +%s)-0123456789abcdef0123456789abcdef"
SERVICE_KEY=$(S="$JWT_SECRET" node -e "const c=require('crypto');const b=(o)=>Buffer.from(JSON.stringify(o)).toString('base64url');const h=b({alg:'HS256',typ:'JWT'});const p=b({role:'service_role',iss:'por1-m3',exp:Math.floor(Date.now()/1000)+86400});const s=c.createHmac('sha256',process.env.S).update(h+'.'+p).digest('base64url');console.log(h+'.'+p+'.'+s)")
docker rm -f "$REST_CONTAINER" >/dev/null 2>&1 || true
docker run -d --name "$REST_CONTAINER" --add-host=host.docker.internal:host-gateway \
  -p $REST_PORT:3000 \
  -e PGRST_DB_URI="postgres://postgres@host.docker.internal:$PG_PORT/$DB" \
  -e PGRST_DB_SCHEMAS=public -e PGRST_DB_ANON_ROLE=anon -e PGRST_JWT_SECRET="$JWT_SECRET" \
  public.ecr.aws/supabase/postgrest:v14.13 >/dev/null
REST_OK=""
for i in $(seq 1 60); do
  REST_OK=$(curl -s -o /dev/null -w '%{http_code}' -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" "http://localhost:$REST_PORT/yorisou_assessment_attempts?select=id&limit=1" || true)
  [ "$REST_OK" = "200" ] && break
  sleep 1
done
[ "$REST_OK" = "200" ] || { echo "[m3] PostgREST unhealthy ($REST_OK)"; docker logs "$REST_CONTAINER" 2>&1 | tail -10; exit 1; }
echo "           PostgREST healthy"

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

echo "[m3] 3b/5 shared object store (MinIO — the real s3-compatible adapter, not a double)"
docker rm -f "$MINIO_CONTAINER" >/dev/null 2>&1 || true
docker run -d --name "$MINIO_CONTAINER" -p "$MINIO_PORT:9000" \
  -e MINIO_ROOT_USER="$MINIO_ACCESS_KEY" -e MINIO_ROOT_PASSWORD="$MINIO_SECRET_KEY" \
  quay.io/minio/minio:latest server /data >/dev/null
MINIO_OK=""
for i in $(seq 1 60); do
  MINIO_OK=$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$MINIO_PORT/minio/health/live" || true)
  [ "$MINIO_OK" = "200" ] && break
  sleep 1
done
[ "$MINIO_OK" = "200" ] || { echo "[m3] MinIO unhealthy ($MINIO_OK)"; docker logs "$MINIO_CONTAINER" 2>&1 | tail -10; exit 1; }
# Create the bucket through the same S3 API the application will use.
docker run --rm --add-host=host.docker.internal:host-gateway --entrypoint sh quay.io/minio/mc:latest -c \
  "mc alias set por1 http://host.docker.internal:$MINIO_PORT '$MINIO_ACCESS_KEY' '$MINIO_SECRET_KEY' >/dev/null && \
   mc mb --ignore-existing por1/$MINIO_BUCKET >/dev/null" >/dev/null 2>&1 \
  || { echo "[m3] could not create bucket $MINIO_BUCKET"; exit 1; }
echo "           MinIO healthy · bucket $MINIO_BUCKET · endpoint localhost:$MINIO_PORT"

echo "[m3] 4/5 build and start with ALL capabilities and readiness ON"
npm run build > "$WORK/build.log" 2>&1 || { echo "[m3] build failed"; tail -20 "$WORK/build.log"; exit 1; }
YORISOU_CI_TEST=1 \
SUPABASE_URL="http://localhost:$PROXY_PORT" \
SUPABASE_SERVICE_ROLE_KEY="$SERVICE_KEY" \
YORISOU_DATA_DIR="$STORE" \
YORISOU_SHARED_STORE_ENDPOINT="http://localhost:$MINIO_PORT" \
YORISOU_SHARED_STORE_BUCKET="$MINIO_BUCKET" \
YORISOU_SHARED_STORE_ACCESS_KEY_ID="$MINIO_ACCESS_KEY" \
YORISOU_SHARED_STORE_SECRET_ACCESS_KEY="$MINIO_SECRET_KEY" \
YORISOU_SHARED_STORE_FORCE_PATH_STYLE=true \
YORISOU_SHARED_STORE_REGION=us-east-1 \
YORISOU_AUTH_COOKIE_SECRET="por1-m3-cookie-secret-0123456789abcdef0123456789abcdef" \
YORISOU_POR1_CANONICAL_CORE=on \
YORISOU_POR1_CANONICAL_RECOMMENDATIONS=on \
YORISOU_POR1_LINE_CANONICAL_RETURN=on \
YORISOU_POR1_ACCOUNT_DELETION_EXECUTOR=on \
YORISOU_POR1_ACCOUNT_MUTATION_FENCE_SCHEMA_READY=on \
YORISOU_POR1_CANONICAL_IDENTITY_LINKS_SCHEMA_READY=on \
YORISOU_POR1_CANONICAL_LINE_ACTIVITY_SCHEMA_READY=on \
YORISOU_POR1_IDENTITY_PROVISIONING_SCHEMA_READY=on \
npx next start -p $APP_PORT > "$WORK/app.log" 2>&1 &
APP_PID=$!
for i in $(seq 1 90); do curl -s -o /dev/null "http://localhost:$APP_PORT/" && break; sleep 1; done
curl -s -o /dev/null "http://localhost:$APP_PORT/" || { echo "[m3] app did not start"; tail -20 "$WORK/app.log"; exit 1; }
echo "           app serving on $APP_PORT (pid $APP_PID, build $(git rev-parse --short HEAD))"

echo "[m3] 5/5 Principal C journey"
POR1_HANDOFF_FILE="$HANDOFF" node tests/por1/principal-c-journey.mjs --base "http://localhost:$APP_PORT" --dsn "$DATABASE_URL"

if [ "${POR1_RUN_M4:-}" = "1" ]; then
  echo
  echo "[m4] erasure proof against the SAME populated stack"
  # M4 must run against the state M3 actually produced. Rebuilding it would mean proving erasure of
  # a fixture rather than of the person the journey created.
  OWNER=$(node -e "console.log(require('$HANDOFF').ownerAccountId)")
  EMAIL=$(node -e "console.log(require('$HANDOFF').email)")
  PW=$(node -e "console.log(require('$HANDOFF').password)")
  node tests/por1/m4-erasure-proof.mjs --base "http://localhost:$APP_PORT" --dsn "$DATABASE_URL" \
    --owner "$OWNER" --email "$EMAIL" --password "$PW"
fi
