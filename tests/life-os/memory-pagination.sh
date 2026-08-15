#!/usr/bin/env bash
# OSF-1 §9 — memory pagination against a real PostgreSQL + PostgREST.
#
# The cursor is a PostgREST `or=(created_at.lt.X,and(created_at.eq.X,id.lt.Y))` filter. Whether that
# string means what it is intended to mean is a fact about PostgREST, and no unit test can establish
# it. Nothing else in the suite reaches page two, so a broken filter would look identical to a working
# one right up until someone confirmed their twenty-sixth memory and it vanished.
#
# The seed deliberately gives FIVE rows an identical created_at, so the id tiebreak in the cursor is
# exercised rather than assumed. Without ties, a cursor that ignored the id would pass.
#
#   bash tests/life-os/memory-pagination.sh

set -euo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${OSF1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
POSTGREST="${OSF1_POSTGREST_BIN:-/opt/homebrew/bin/postgrest}"
PG_PORT="${OSF1_PAGE_PG_PORT:-55611}"
REST_PORT="${OSF1_PAGE_REST_PORT:-55612}"
PROXY_PORT="${OSF1_PAGE_PROXY_PORT:-55613}"
WORK="${OSF1_PAGE_WORK:-/tmp/osf1-page}"
export LC_ALL=C PATH="$PGBIN:$PATH"

cleanup() {
  set +e
  [ -n "${PROXY_PID:-}" ] && kill "$PROXY_PID" 2>/dev/null
  [ -n "${REST_PID:-}" ] && kill "$REST_PID" 2>/dev/null
  pg_ctl -D "$WORK/pg" stop -m immediate >/dev/null 2>&1
  rm -rf "$WORK"
}
trap cleanup EXIT

[ -x "$POSTGREST" ] || { echo "no postgrest binary at $POSTGREST (set OSF1_POSTGREST_BIN)" >&2; exit 1; }

rm -rf "$WORK"; mkdir -p "$WORK/pg"
initdb -D "$WORK/pg" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
pg_ctl -D "$WORK/pg" -o "-p $PG_PORT -c unix_socket_directories=''" -l "$WORK/pg/log" start >/dev/null
sleep 1
DSN="postgres://postgres@localhost:$PG_PORT/osf1"
createdb -h localhost -p "$PG_PORT" -U postgres osf1
Q() { psql "$DSN" -t -A -X -q "$@"; }

Q -c "create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";
  do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;
  grant usage on schema public to anon, authenticated, service_role;" >/dev/null
echo "[page] applying the migration lineage"
for f in supabase/migrations/*.sql; do
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null 2>&1 || true
done

# 30 memories; the first five share one created_at so the id tiebreak is genuinely exercised.
Q -c "insert into public.yorisou_explicit_memories
        (owner_account_id, memory_type, content, source, user_confirmed, confirmation_digest, created_at)
      select 'acct_p','lesson','m'||g,'user_statement',true,
             encode(sha256(convert_to('m'||g,'utf8')),'hex'),
             now() - (case when g <= 5 then interval '0' else (g||' minutes')::interval end)
      from generate_series(1,30) g;" >/dev/null
TIES=$(Q -c "select count(*) from public.yorisou_explicit_memories where owner_account_id='acct_p'
             and created_at=(select max(created_at) from public.yorisou_explicit_memories where owner_account_id='acct_p');")
echo "[page] seeded 30 memories, $TIES of them sharing the newest timestamp"

SECRET="osf1-page-probe-0123456789abcdef0123456789abcdef"
KEY=$(S="$SECRET" node -e "const c=require('crypto');const b=o=>Buffer.from(JSON.stringify(o)).toString('base64url');const h=b({alg:'HS256',typ:'JWT'});const p=b({role:'service_role',exp:Math.floor(Date.now()/1000)+3600});console.log(h+'.'+p+'.'+c.createHmac('sha256',process.env.S).update(h+'.'+p).digest('base64url'))")
cat > "$WORK/pgrst.conf" <<EOF
db-uri = "$DSN"
db-schemas = "public"
db-anon-role = "anon"
jwt-secret = "$SECRET"
server-host = "127.0.0.1"
server-port = $REST_PORT
EOF
"$POSTGREST" "$WORK/pgrst.conf" > "$WORK/pgrst.log" 2>&1 &
REST_PID=$!
READY=""
for _ in $(seq 1 40); do
  READY=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $KEY" \
    "http://127.0.0.1:$REST_PORT/yorisou_explicit_memories?select=id&limit=1" || true)
  [ "$READY" = "200" ] && break
  sleep 1
done
[ "$READY" = "200" ] || { echo "[page] PostgREST not healthy (got $READY)" >&2; tail -20 "$WORK/pgrst.log" >&2; exit 1; }
echo "[page] PostgREST healthy"

# store.ts fetches ${SUPABASE_URL}/rest/v1/<path>; raw PostgREST serves at the root. The same
# two-line prefix shim tests/life-os/fullstack-a11y.sh uses, and the reason the app needs no
# test-only branch in its data layer.
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
PROXY_READY=""
for _ in $(seq 1 20); do
  PROXY_READY=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $KEY" \
    "http://127.0.0.1:$PROXY_PORT/rest/v1/yorisou_explicit_memories?select=id&limit=1" || true)
  [ "$PROXY_READY" = "200" ] && break
  sleep 1
done
[ "$PROXY_READY" = "200" ] || { echo "[page] prefix proxy not healthy (got $PROXY_READY)" >&2; exit 1; }
echo "[page] walking every page through the real store"

SUPABASE_URL="http://127.0.0.1:$PROXY_PORT" SUPABASE_SERVICE_ROLE_KEY="$KEY" \
  node --conditions=react-server --import tsx tests/life-os/memory-pagination.ts
