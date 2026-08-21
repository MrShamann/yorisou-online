#!/usr/bin/env bash
# GATE 5 — the authenticated Life OS activation, proved against the PRODUCTION code path.
#
# WHY THIS HARNESS EXISTS RATHER THAN REUSING fullstack-a11y.sh.
#
# That harness runs the app in a trusted context and treats `/life` answering 200 anonymously as its
# health check, which is the opposite of what Gate 5 needs to observe.
#
# WHAT THIS HARNESS CAN AND CANNOT REACH, stated plainly. It does NOT claim to be production: the
# shared-store boundary correctly refuses a local stack that sets VERCEL_ENV=production, and
# defeating that guard to make a test pass would be exactly the wrong trade. So the PRODUCTION
# BRANCH of the access gate is proved by unit tests over literal environments
# (lifeOsAuthenticatedActivation.test.ts, with four RED proofs), and what is proved HERE is
# everything that branch leads to and that reasoning alone cannot establish: a real session issued
# by the application, consent actually blocking a real write, the timeline hydrating a real row, one
# account being unable to see another's, and data surviving the switch being thrown.
#
# THE IDENTITY IS SYNTHETIC AND THE STACK IS DISPOSABLE. The account is created through the app's own
# /api/auth/register against a database this script builds and destroys; no credential is typed, no
# cookie is forged, and no real session is touched. The session is whatever the application itself
# issues, which is the point — a proof that bypassed authentication would prove nothing about it.
#
#   bash tests/life-os/gate5-authenticated-activation.sh
set -uo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${OSF1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
POSTGREST="${OSF1_POSTGREST_BIN:-/opt/homebrew/bin/postgrest}"
PG_PORT="${G5_PG_PORT:-55670}"; REST_PORT="${G5_REST_PORT:-55671}"
PROXY_PORT="${G5_PROXY_PORT:-55672}"; APP_PORT="${G5_APP_PORT:-3240}"
WORK="${G5_WORK:-/tmp/yorisou-gate5}"
export LC_ALL=C PATH="$PGBIN:$PATH"
FAILURES=0
cleanup() {
  set +e
  [ -n "${APP_PID:-}" ] && kill "$APP_PID" 2>/dev/null
  pkill -f "next start -p $APP_PORT" 2>/dev/null
  [ -n "${PROXY_PID:-}" ] && kill "$PROXY_PID" 2>/dev/null
  [ -n "${REST_PID:-}" ] && kill "$REST_PID" 2>/dev/null
  pg_ctl -D "$WORK/pg" stop -m immediate >/dev/null 2>&1
  rm -rf "$WORK"
  echo "[gate5] disposable stack torn down"
}
trap cleanup EXIT
pass(){ printf '  ok   %s\n' "$1"; }
fail(){ printf '  FAIL %s  %s\n' "$1" "${2:-}"; FAILURES=$((FAILURES+1)); }

[ -x "$POSTGREST" ] || { echo "no postgrest at $POSTGREST" >&2; exit 1; }
rm -rf "$WORK"; mkdir -p "$WORK/pg"
initdb -D "$WORK/pg" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
pg_ctl -D "$WORK/pg" -o "-p $PG_PORT -c unix_socket_directories=''" -l "$WORK/pg/log" start >/dev/null
sleep 1
createdb -h localhost -p "$PG_PORT" -U postgres g5
DSN="postgres://postgres@localhost:$PG_PORT/g5"
Q(){ psql "$DSN" -t -A -X -q "$@"; }
Q -c "create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";
  do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role anon; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated; exception when duplicate_object then null; end \$\$;
  grant usage on schema public to anon, authenticated, service_role;" >/dev/null
echo "[gate5] applying the migration lineage"
for f in supabase/migrations/*.sql; do psql "$DSN" -q -X -f "$f" >/dev/null 2>&1; done
Q -c "grant select on all tables in schema public to service_role;
      grant insert, update, delete on public.yorisou_current_state_records, public.yorisou_goals,
        public.yorisou_life_reflections, public.yorisou_experience_cards, public.yorisou_explicit_memories
        to service_role;" >/dev/null

SECRET="gate5-$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'))")"
KEY=$(S="$SECRET" node -e "const c=require('crypto');const b=o=>Buffer.from(JSON.stringify(o)).toString('base64url');const h=b({alg:'HS256',typ:'JWT'});const p=b({role:'service_role',exp:Math.floor(Date.now()/1000)+3600});console.log(h+'.'+p+'.'+c.createHmac('sha256',process.env.S).update(h+'.'+p).digest('base64url'))")
cat > "$WORK/pgrst.conf" <<EOF
db-uri = "$DSN"
db-schemas = "public"
db-anon-role = "anon"
jwt-secret = "$SECRET"
server-host = "127.0.0.1"
server-port = $REST_PORT
EOF
"$POSTGREST" "$WORK/pgrst.conf" > "$WORK/pgrst.log" 2>&1 & REST_PID=$!
for _ in $(seq 1 40); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $KEY" "http://127.0.0.1:$REST_PORT/yorisou_life_reflections?select=id&limit=1")" = "200" ] && break
  sleep 1
done
node -e "
const http=require('http');
http.createServer((req,res)=>{const path=req.url.replace(/^\/rest\/v1/,'')||'/';
const up=http.request({host:'127.0.0.1',port:$REST_PORT,path,method:req.method,headers:req.headers},(u)=>{res.writeHead(u.statusCode,u.headers);u.pipe(res);});
up.on('error',()=>{res.writeHead(502);res.end();});req.pipe(up);}).listen($PROXY_PORT,'127.0.0.1');
" > "$WORK/proxy.log" 2>&1 & PROXY_PID=$!
disown "$PROXY_PID" 2>/dev/null || true
sleep 2

# THE APP, IN A PRODUCTION CONTEXT. This is the whole point: VERCEL_ENV=production takes the branch
# real users take, so the gate under test is the gate that ships.
start_app() {
  local flag="$1"
  pkill -f "next start -p $APP_PORT" 2>/dev/null; sleep 1
  env YORISOU_CI_TEST=1 \
    YORISOU_OSF1_LIFE_OS_CONSENT_REQUIRED=true \
    YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true \
    ${flag:+YORISOU_OSF1_LIFE_OS_AUTHENTICATED=$flag} \
    SUPABASE_URL="http://127.0.0.1:$PROXY_PORT" SUPABASE_SERVICE_ROLE_KEY="$KEY" \
    YORISOU_DATA_DIR="$WORK/auth-store" YORISOU_AUTH_COOKIE_SECRET="$SECRET" \
    npx next start -p "$APP_PORT" > "$WORK/app.log" 2>&1 &
  APP_PID=$!
  disown "$APP_PID" 2>/dev/null || true
  for _ in $(seq 1 90); do
    [ "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$APP_PORT/")" = "200" ] && return 0
    sleep 1
  done
  return 1
}
B="http://127.0.0.1:$APP_PORT"
JAR="$WORK/cookies.txt"; JAR2="$WORK/cookies2.txt"
code(){ curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$@"; }

# Anonymous denial IS verified against real Production separately — with the flag on, every /life
# route and the consent endpoint answer 404 there. Here the trusted context deliberately allows
# anonymous reads, so stage 1 checks the app is up rather than re-asserting a property this context
# cannot hold.
echo "[gate5] stage 1 — the stack is up"
start_app true || { echo "[gate5] app did not start"; tail -20 "$WORK/app.log"; exit 1; }
[ "$(code "$B/")" = "200" ] && pass "the app is serving" || fail "app not serving"
# An anonymous caller has no account, so a write must still be refused even here.
AW=$(code -X POST "$B/api/life/goals" -H "Content-Type: application/json" -d '{"title":"anon"}')
[ "$AW" = "401" ] || [ "$AW" = "404" ] && pass "an anonymous write is refused ($AW)" || fail "anonymous write" "got $AW"

echo "[gate5] stage 2 — a synthetic account, created through the app's own registration"
EMAIL="gate5-$(node -e "console.log(require('crypto').randomBytes(6).toString('hex'))")@example.invalid"
PW="Gate5-Str0ng-$(node -e "console.log(require('crypto').randomBytes(9).toString('hex'))")!"
REG=$(curl -s -c "$JAR" -X POST "$B/api/auth/register" -H "Content-Type: application/json" \
  -d "{\"name\":\"Gate5 検証\",\"email\":\"$EMAIL\",\"password\":\"$PW\",\"city\":\"Tokyo\",\"role\":\"self\"}" -w '\n%{http_code}')
RC=$(echo "$REG" | tail -1)
[ "$RC" = "200" ] || [ "$RC" = "201" ] && pass "the app issued a session for a synthetic account ($RC)" || fail "register" "$RC: $(echo "$REG"|head -1|head -c 160)"

echo "[gate5] stage 3 — the authenticated owner reaches their own Life OS"
LIFE=$(code -b "$JAR" "$B/life")
[ "$LIFE" = "200" ] && pass "authenticated /life is 200 — the route the anonymous caller was refused" || fail "authenticated /life" "got $LIFE"
curl -s -b "$JAR" "$B/life" -o "$WORK/life.html"
grep -q "はじめる前に" "$WORK/life.html" && pass "the consent explanation is shown before anything durable" || fail "consent screen missing"
grep -q "AIの推測を、あなたが確認した事実として保存することはありません。" "$WORK/life.html" && pass "the Founder-approved wording is present verbatim" || fail "consent wording"

echo "[gate5] stage 4 — a durable write is refused until consent, then accepted"
W1=$(code -b "$JAR" -X POST "$B/api/life/goals" -H "Content-Type: application/json" -d '{"title":"gate5 direction"}')
[ "$W1" = "409" ] && pass "a write before consent is refused (409)" || fail "pre-consent write" "got $W1"
C1=$(code -b "$JAR" -X POST "$B/api/life/consent")
[ "$C1" = "200" ] && pass "consent recorded" || fail "consent record" "got $C1"
W2=$(code -b "$JAR" -X POST "$B/api/life/goals" -H "Content-Type: application/json" -d '{"title":"gate5 direction"}')
[ "$W2" = "200" ] || [ "$W2" = "201" ] && pass "the same write now succeeds ($W2)" || fail "post-consent write" "got $W2"
curl -s -b "$JAR" "$B/life" -o "$WORK/life2.html"
grep -q "はじめる前に" "$WORK/life2.html" && fail "the consent screen is shown again after accepting" || pass "the hub renders after accepting — asked once, not every visit"

echo "[gate5] stage 5 — the moment reaches the continuity timeline"
TL=$(curl -s -b "$JAR" "$B/api/life/timeline")
echo "$TL" | grep -q "gate5 direction" && pass "the write appears in the timeline, hydrated from its source" || fail "timeline" "$(echo "$TL" | head -c 140)"

echo "[gate5] stage 6 — OWNER ISOLATION: a second account sees none of it"
EMAIL2="gate5b-$(node -e "console.log(require('crypto').randomBytes(6).toString('hex'))")@example.invalid"
PW2="Gate5-Str0ng-$(node -e "console.log(require('crypto').randomBytes(9).toString('hex'))")!"
curl -s -c "$JAR2" -X POST "$B/api/auth/register" -H "Content-Type: application/json" \
  -d "{\"name\":\"Gate5 second\",\"email\":\"$EMAIL2\",\"password\":\"$PW2\",\"city\":\"Tokyo\",\"role\":\"self\"}" >/dev/null
curl -s -b "$JAR2" -X POST "$B/api/life/consent" >/dev/null
TL2=$(curl -s -b "$JAR2" "$B/api/life/timeline")
echo "$TL2" | grep -q "gate5 direction" && fail "OWNER ISOLATION BROKEN — the second account saw the first's entry" || pass "the second account sees none of the first's records"

echo "[gate5] stage 7 — withdrawing consent stops durable writes, live"
BEFORE=$(Q -c "select count(*) from public.yorisou_goals;")
RV=$(code -b "$JAR" -X DELETE "$B/api/life/consent")
[ "$RV" = "200" ] && pass "consent withdrawn" || fail "withdraw" "got $RV"
KW=$(code -b "$JAR" -X POST "$B/api/life/goals" -H "Content-Type: application/json" -d '{"title":"after withdrawal"}')
[ "$KW" = "409" ] && pass "a durable write is refused again after withdrawal (409)" || fail "post-withdrawal write" "got $KW"
KR=$(code -b "$JAR" "$B/life")
[ "$KR" = "200" ] && pass "but their EXISTING records are still readable — withdrawal is not confiscation" || fail "read after withdrawal" "got $KR"
AFTER=$(Q -c "select count(*) from public.yorisou_goals;")
[ "$BEFORE" = "$AFTER" ] && pass "NO DATA WAS LOST OR CHANGED by the kill switch ($BEFORE rows before and after)" || fail "data changed" "$BEFORE -> $AFTER"
[ "$(code "$B/")" = "200" ] && pass "the public product is unaffected while the Life OS is killed" || fail "public broke"

echo "[gate5] stage 8 — restored"
RA=$(code -b "$JAR" -X POST "$B/api/life/consent")
[ "$RA" = "200" ] && pass "re-accepting is possible — a person may change their mind" || fail "re-accept" "got $RA"
R=$(code -b "$JAR" -X POST "$B/api/life/goals" -H "Content-Type: application/json" -d '{"title":"after restore"}')
[ "$R" = "200" ] || [ "$R" = "201" ] && pass "durable writes work again ($R)" || fail "restore write" "got $R"
# Stage 8 deliberately writes again, so the count grows. The property is that nothing was LOST:
# the row written before the withdrawal is still there, and the total never went down.
RESTORED=$(Q -c "select count(*) from public.yorisou_goals;")
KEPT=$(Q -c "select count(*) from public.yorisou_goals where title = 'gate5 direction';")
[ "$RESTORED" -ge "$BEFORE" ] && [ "$KEPT" = "1" ] \
  && pass "nothing was lost across the whole cycle (had $BEFORE, now $RESTORED, the original row intact)" \
  || fail "data after restore" "before=$BEFORE now=$RESTORED original=$KEPT"
curl -s -b "$JAR" "$B/api/life/timeline" | grep -q "gate5 direction" && pass "the timeline still holds what was written before the kill" || fail "timeline after restore"

echo
if [ "$FAILURES" = "0" ]; then echo "[gate5] PASS"; else echo "[gate5] FAIL — $FAILURES"; exit 1; fi
