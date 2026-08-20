#!/usr/bin/env bash
# OSF-1 §4/§5 — merged timeline keyset pagination against a real PostgreSQL + PostgREST.
#
# Harder than the memory cursor and it fails differently. Four sources are each asked for limit+1
# rows after the SAME (created_at, id) position and then merged and cut. A mistake does not error —
# it silently drops whichever kind fell on the boundary, which no unit test can see and no person
# can notice, because they never knew the row was there.
#
# The seed deliberately creates ties ACROSS kinds at one timestamp, so the id tie-break is exercised
# by rows from different tables rather than only within one.
#
#   bash tests/life-os/timeline-pagination.sh

set -euo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${OSF1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
POSTGREST="${OSF1_POSTGREST_BIN:-/opt/homebrew/bin/postgrest}"
PG_PORT="${OSF1_TL_PG_PORT:-55621}"
REST_PORT="${OSF1_TL_REST_PORT:-55622}"
PROXY_PORT="${OSF1_TL_PROXY_PORT:-55623}"
WORK="${OSF1_TL_WORK:-/tmp/osf1-tl}"
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
echo "[timeline] applying the migration lineage"
for f in supabase/migrations/*.sql; do
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null 2>&1 || true
done

# HOSTED-PARITY GRANT. Supabase gives the service role broad table access; a disposable cluster only
# has what the migrations grant, and the pre-OSF-1 yorisou_experience_cards grants nothing. Without
# this the experience query returns 403, pageOf swallows it, and the timeline silently omits an
# entire kind — which is exactly what the first run of this harness caught. Gate 3 remains the
# authority on grants; this line only makes the stack resemble the one the app really talks to.
Q -c "grant select on all tables in schema public to service_role;" >/dev/null

# An optional hook for harnesses that reuse this stack and need writes the OSF-1 reader never makes.
# Deliberately a parameter rather than a broader default grant: widening service_role across the
# board would also make the CNT-1 projection index writable, and "the index is RPC-only" is a
# property other suites prove by attempting exactly that write and expecting 403.
if [ -n "${OSF1_TL_EXTRA_SQL:-}" ]; then
  Q -c "$OSF1_TL_EXTRA_SQL" >/dev/null
  echo "[timeline] applied caller-supplied grants"
fi

# A mixed timeline: states, directions, light reflections, deep reflections and experiences, with a
# deliberate cluster sharing ONE timestamp across DIFFERENT kinds so the tie-break is exercised
# between tables and not merely inside one.
# A FIXED timestamp, not now()-derived. Each psql statement commits separately, so now() differs
# between them and the "shared timestamp" cluster silently would not form — which the guard below
# caught on the first run.
TS="timestamptz '2026-08-01 12:00:00+00'"
Q -c "insert into public.yorisou_current_state_records (owner_account_id, state_tags, source, created_at)
      select 'acct_tl', array['steady'], 'manual', timestamptz '2026-08-01 12:00:00+00' - (g||' minutes')::interval from generate_series(1,6) g;
      insert into public.yorisou_current_state_records (owner_account_id, state_tags, source, created_at)
      select 'acct_tl', array['steady'], 'manual', $TS from generate_series(1,2) g;
      insert into public.yorisou_goals (owner_account_id, title, created_at)
      select 'acct_tl', 'むかいたい方向'||g, timestamptz '2026-08-01 12:00:00+00' - (g||' minutes')::interval from generate_series(7,10) g;
      insert into public.yorisou_goals (owner_account_id, title, created_at)
      values ('acct_tl', 'おなじ時刻の方向', $TS);
      insert into public.yorisou_life_reflections (owner_account_id, mode, what_happened, created_at)
      select 'acct_tl', 'light', 'かるい振り返り'||g, timestamptz '2026-08-01 12:00:00+00' - (g||' minutes')::interval from generate_series(11,15) g;
      insert into public.yorisou_life_reflections (owner_account_id, mode, what_happened, created_at)
      select 'acct_tl', 'postmortem', 'じっくり'||g, timestamptz '2026-08-01 12:00:00+00' - (g||' minutes')::interval from generate_series(16,18) g;
      insert into public.yorisou_life_reflections (owner_account_id, mode, what_happened, created_at)
      values ('acct_tl', 'postmortem', 'おなじ時刻のじっくり', $TS);
      insert into public.yorisou_experience_cards
        (owner_account_id, situation, action_tried, perceived_outcome, visibility, created_at)
      select 'acct_tl', 'できごと'||g, '行動', '結果', 'PRIVATE', timestamptz '2026-08-01 12:00:00+00' - (g||' minutes')::interval
      from generate_series(19,22) g;
      insert into public.yorisou_experience_cards
        (owner_account_id, situation, action_tried, perceived_outcome, visibility, created_at)
      values ('acct_tl', 'おなじ時刻のできごと', '行動', '結果', 'PRIVATE', $TS);
      -- The timeline excludes withdrawn and soft-deleted cards, and nothing was seeding either, so
      -- that exclusion was never actually exercised here. EXPECTED below already discounts them.
      insert into public.yorisou_experience_cards
        (owner_account_id, situation, action_tried, perceived_outcome, visibility, created_at, withdrawn_at)
      values ('acct_tl', 'とりさげたできごと', '行動', '結果', 'PRIVATE', $TS, $TS);
      insert into public.yorisou_experience_cards
        (owner_account_id, situation, action_tried, perceived_outcome, visibility, created_at, deleted_at, withdrawn_at)
      values ('acct_tl', 'けしたできごと', '行動', '結果', 'PRIVATE', $TS, $TS, $TS);" >/dev/null

# A second account, so the cross-user assertion is not vacuous.
Q -c "insert into public.yorisou_current_state_records (owner_account_id, state_tags, source)
      values ('acct_tl_other', array['steady'], 'manual');
      insert into public.yorisou_life_reflections (owner_account_id, mode, what_happened)
      values ('acct_tl_other', 'light', 'ほかの人の記録');" >/dev/null

EXPECTED=$(Q -c "select
   (select count(*) from public.yorisou_current_state_records where owner_account_id='acct_tl')
 + (select count(*) from public.yorisou_goals where owner_account_id='acct_tl')
 + (select count(*) from public.yorisou_life_reflections where owner_account_id='acct_tl')
 + (select count(*) from public.yorisou_experience_cards where owner_account_id='acct_tl'
    and deleted_at is null and withdrawn_at is null);")
TIES=$(Q -c "select count(*) from (
   select created_at from public.yorisou_current_state_records where owner_account_id='acct_tl'
   union all select created_at from public.yorisou_goals where owner_account_id='acct_tl'
   union all select created_at from public.yorisou_life_reflections where owner_account_id='acct_tl'
   union all select created_at from public.yorisou_experience_cards where owner_account_id='acct_tl') t
 where created_at = $TS;")
echo "[timeline] seeded $EXPECTED entries for acct_tl, $TIES of them sharing one timestamp across kinds"
[ "$TIES" -ge 4 ] || { echo "[timeline] the cross-kind tie cluster did not form" >&2; exit 1; }

# Generated rather than literal: gitleaks reads a fixed 32-hex tail as a secret, and it is right to.
SECRET="osf1-page-probe-$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'))")"
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
    "http://127.0.0.1:$REST_PORT/yorisou_life_reflections?select=id&limit=1" || true)
  [ "$READY" = "200" ] && break
  sleep 1
done
[ "$READY" = "200" ] || { echo "[timeline] PostgREST not healthy (got $READY)" >&2; tail -20 "$WORK/pgrst.log" >&2; exit 1; }
echo "[timeline] PostgREST healthy"

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
    "http://127.0.0.1:$PROXY_PORT/rest/v1/yorisou_life_reflections?select=id&limit=1" || true)
  [ "$PROXY_READY" = "200" ] && break
  sleep 1
done
[ "$PROXY_READY" = "200" ] || { echo "[timeline] prefix proxy not healthy (got $PROXY_READY)" >&2; exit 1; }
echo "[timeline] walking every page through the real store"

SUPABASE_URL="http://127.0.0.1:$PROXY_PORT" SUPABASE_SERVICE_ROLE_KEY="$KEY" \
  OSF1_TL_EXPECTED="$EXPECTED" node --conditions=react-server --import tsx "${OSF1_TL_RUNNER:-tests/life-os/timeline-pagination.ts}"
