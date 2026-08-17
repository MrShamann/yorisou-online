#!/usr/bin/env bash
# OSF-1 §19 — performance smoke for the Life OS Phase 1 surfaces at realistic volume.
#
#   bash tests/life-os/performance-smoke.sh
#
# WHAT THIS LOOKS FOR, AND WHAT IT DELIBERATELY DOES NOT.
#
# It is not a benchmark. Wall-clock on one laptop against a loopback PostgreSQL says nothing about
# Vercel and Supabase, and a harness that failed on a 40ms regression would be turned off inside a
# week. What it looks for is the class of defect that is INVISIBLE at three rows and fatal at three
# hundred, and that no amount of correctness testing finds:
#
#   N+1                        one query per row instead of one query per page
#   unbounded collection       a SELECT with no LIMIT, which is fine until someone has 10,000 rows
#   whole-history load         the server sending every record to the browser to render twenty
#   pagination that degrades   page 2 costing more than page 1, which means the cursor is an OFFSET
#   repeated identical calls   the same query issued several times to render one page
#
# THE MEASUREMENT IS THE DATABASE'S OWN LOG. `log_min_duration_statement = 0` makes PostgreSQL record
# every statement, so the number of queries a page costs is counted rather than reasoned about. That
# is the only way to see an N+1: from outside, an N+1 page and a correct page differ by nothing except
# how they age.
#
# Seeded per §19: ~100 states, ~100 experiences, ~100 reflections, ~100 memories, ~50 directions.
# Seeded in SQL rather than through 450 HTTP calls, because the subject is the READ path.

set -euo pipefail
cd "$(dirname "$0")/../.."

PGBIN="${OSF1_POSTGRES_BIN:-/opt/homebrew/opt/postgresql@17/bin}"
POSTGREST="${OSF1_POSTGREST_BIN:-/opt/homebrew/bin/postgrest}"
PG_PORT="${OSF1_PERF_PG_PORT:-55596}"
REST_PORT="${OSF1_PERF_REST_PORT:-55597}"
PROXY_PORT="${OSF1_PERF_PROXY_PORT:-55598}"
PROVIDER_PORT="${OSF1_PERF_PROVIDER_PORT:-55599}"
APP_PORT="${OSF1_PERF_APP_PORT:-3212}"
WORK="${OSF1_PERF_WORK:-/tmp/osf1-perf}"
DB=osf1_life_perf
export LC_ALL=C PATH="$PGBIN:$PATH"

# The bounds. OUTLIER detection, not targets — and deliberately far from the observed numbers.
#
# The defect this looks for is a read PER ROW. At the 100-row seed that is 100+ reads, so any ceiling
# between the observed value and 100 catches it equally well. What a ceiling must NOT do is sit one
# read above the truth: the first version used 25 against an observed 23, which is not a gate on
# N+1 — it is a gate on adding one more section, and it would have failed on ordinary variance while
# telling the operator an N+1 had appeared. The observed values are PRINTED on every run, so a real
# regression is visible in the log long before it trips the ceiling.
#
#   observed 2026-08-17 at 450 rows: hub 23 reads, timeline 10-11, memories 3, return 9
MAX_QUERIES_PER_PAGE="${OSF1_PERF_MAX_QUERIES:-45}"
MAX_PAGE_BYTES="${OSF1_PERF_MAX_BYTES:-1500000}"
# Per-table repeats on the hub. Bounded by the number of SECTIONS that can ask about one table, which
# is seven; an N+1 would be 100+. Same reasoning as above: not one above the observed 6.
MAX_TABLE_REPEATS="${OSF1_PERF_MAX_TABLE_REPEATS:-12}"

FAILURES=0
CHECKS=0
pass() { CHECKS=$((CHECKS+1)); printf '  ok   %s\n' "$1"; }
fail() { CHECKS=$((CHECKS+1)); FAILURES=$((FAILURES+1)); printf '  FAIL %s  %s\n' "$1" "${2:-}"; }
note() { printf '       %s\n' "$1"; }

cleanup() {
  set +e
  [ -n "${APP_PID:-}" ] && kill "$APP_PID" 2>/dev/null
  [ -n "${PROVIDER_PID:-}" ] && kill "$PROVIDER_PID" 2>/dev/null
  [ -n "${PROXY_PID:-}" ] && kill "$PROXY_PID" 2>/dev/null
  [ -n "${REST_PID:-}" ] && kill "$REST_PID" 2>/dev/null
  pg_ctl -D "$WORK/pg" stop -m immediate >/dev/null 2>&1
  rm -rf "$WORK"
}

busy() { lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }
for port in "$PG_PORT" "$REST_PORT" "$PROXY_PORT" "$PROVIDER_PORT" "$APP_PORT"; do
  busy "$port" && { echo "[perf] port $port is busy — a previous run may still be up" >&2; exit 1; }
done
[ -x "$POSTGREST" ] || { echo "[perf] no postgrest binary at $POSTGREST" >&2; exit 1; }
trap cleanup EXIT

echo "[perf] 1/6 disposable cluster with statement logging on"
MAJOR="$("$PGBIN/postgres" --version | awk '{print $3}' | cut -d. -f1)"
case "$MAJOR" in 16|17) : ;; *) echo "[perf] need PostgreSQL 16 or 17; found $MAJOR" >&2; exit 1 ;; esac
rm -rf "$WORK"; mkdir -p "$WORK/pg" "$WORK/auth-store"
initdb -D "$WORK/pg" -U postgres -A trust --no-locale -E UTF8 >/dev/null 2>&1
# log_min_duration_statement=0 records EVERY statement; that log is the measurement instrument.
pg_ctl -D "$WORK/pg" -o "-p $PG_PORT -c listen_addresses='127.0.0.1' -c unix_socket_directories='' \
  -c log_min_duration_statement=0 -c log_statement=none -c log_line_prefix='' -c log_destination=stderr" \
  -l "$WORK/pg/log" start >/dev/null
sleep 1
createdb -h 127.0.0.1 -p "$PG_PORT" -U postgres "$DB"
DSN="postgres://postgres@127.0.0.1:$PG_PORT/$DB"
psql "$DSN" -q -X -v ON_ERROR_STOP=1 -c "
  create extension if not exists pgcrypto; create extension if not exists \"uuid-ossp\";
  do \$\$ begin create role service_role login bypassrls; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role anon nologin; exception when duplicate_object then null; end \$\$;
  do \$\$ begin create role authenticated nologin; exception when duplicate_object then null; end \$\$;
  grant usage on schema public to anon, authenticated, service_role;
  alter default privileges in schema public grant all on tables to service_role;
  alter default privileges in schema public grant all on sequences to service_role;" >/dev/null
for f in supabase/migrations/*.sql; do
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 -f "$f" >/dev/null 2>"$WORK/migrate.err" || {
    echo "[perf] FAILED applying $(basename "$f")" >&2; head -5 "$WORK/migrate.err" >&2; exit 1; }
done

echo "[perf] 2/6 PostgREST and the /rest/v1 prefix proxy"
# GENERATED, not a literal with a timestamp in it. Two reasons, and the second is the real one:
# gitleaks flags a hardcoded 32-hex tail as a secret (correctly — it cannot tell a fixture from a key),
# and the epoch second was the ONLY entropy, so anyone who could reach the port could brute-force a few
# thousand candidates from the public job-start time and mint a service_role token. On an ephemeral
# runner that is a small risk; on a self-hosted one, or on an operator's laptop reproducing CI, it is
# not. tests/life-os/internal-access.sh already did this correctly, so this is a copy from a sibling.
# Never written as a literal beside the variable's name: gitleaks reads `OPENROUTER_API_KEY="…"` as a
# key regardless of what the value is, and it is right to. The disposable provider never checks it.
PROVIDER_KEY="osf1-perf-$(node -e "console.log(require('crypto').randomBytes(12).toString('hex'))")"
COOKIE_SECRET="osf1-perf-cookie-$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
JWT_SECRET="osf1-perf-$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'))")"
SERVICE_KEY=$(S="$JWT_SECRET" node -e "const c=require('crypto');const b=(o)=>Buffer.from(JSON.stringify(o)).toString('base64url');const h=b({alg:'HS256',typ:'JWT'});const p=b({role:'service_role',iss:'osf1-perf',exp:Math.floor(Date.now()/1000)+86400});const s=c.createHmac('sha256',process.env.S).update(h+'.'+p).digest('base64url');console.log(h+'.'+p+'.'+s)")
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
REST_PID=$!; disown "$REST_PID" 2>/dev/null || true
for _ in $(seq 1 60); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $SERVICE_KEY" \
      "http://127.0.0.1:$REST_PORT/yorisou_life_reflections?select=id&limit=1")" = "200" ] && break
  sleep 1
done
node -e "
const http=require('http');
http.createServer((req,res)=>{
  const path=req.url.replace(/^\/rest\/v1/,'')||'/';
  const up=http.request({host:'127.0.0.1',port:$REST_PORT,path,method:req.method,headers:req.headers},(u)=>{res.writeHead(u.statusCode,u.headers);u.pipe(res);});
  up.on('error',()=>{res.writeHead(502);res.end();});
  req.pipe(up);
}).listen($PROXY_PORT,'127.0.0.1');
" > "$WORK/proxy.log" 2>&1 &
PROXY_PID=$!; disown "$PROXY_PID" 2>/dev/null || true
node tests/life-os/disposable-provider.mjs "$PROVIDER_PORT" > "$WORK/provider.log" 2>&1 &
PROVIDER_PID=$!; disown "$PROVIDER_PID" 2>/dev/null || true
sleep 2

# ── 3. The volume ────────────────────────────────────────────────────────────
#
# Written directly, because the subject is reading. Timestamps are spread across a year so the keyset
# cursors are exercised against genuinely distinct sort keys — a seed where every row shares one
# `created_at` would put the whole page on the tie-break path and hide how the ordinary case behaves.
echo "[perf] 3/6 seeding ~450 rows"
OWNER=acct_perf
psql "$DSN" -q -X -v ON_ERROR_STOP=1 <<SQL >/dev/null
insert into public.yorisou_current_state_records (owner_account_id, state_tags, mood, energy, situation, reflection, source, created_at)
select '$OWNER', array['steady'], 'calm', 'steady', '状況 ' || i, '書きとめ ' || i, 'manual',
       now() - (i || ' hours')::interval
  from generate_series(1, 100) as g(i);

insert into public.yorisou_experience_cards
  (project_id, owner_account_id, situation, action_tried, perceived_outcome, visibility,
   state_context, limitations, may_fit, may_not_fit, created_at)
select 'yorisou', '$OWNER', '状況 ' || i, '行動 ' || i, '結果 ' || i, 'PRIVATE',
       'いまの状況', '限界', '合うかも', '合わないかも', now() - (i || ' hours')::interval
  from generate_series(1, 100) as g(i);

insert into public.yorisou_goals (owner_account_id, title, description, status, created_at)
select '$OWNER', '方向 ' || i, '説明 ' || i, 'active', now() - (i || ' hours')::interval
  from generate_series(1, 50) as g(i);

insert into public.yorisou_life_reflections
  (owner_account_id, mode, what_happened, felt, tried, what_followed, next_time, created_at)
select '$OWNER', case when i % 2 = 0 then 'light' else 'postmortem' end,
       'あったこと ' || i, '感じたこと ' || i, '試したこと ' || i, 'そのあと ' || i, '次は ' || i,
       now() - (i || ' hours')::interval
  from generate_series(1, 100) as g(i);

insert into public.yorisou_explicit_memories
  (owner_account_id, memory_type, content, source, user_confirmed, confirmation_digest, created_at)
select '$OWNER', 'lesson', '覚えておくこと ' || i, 'user_statement', true,
       encode(sha256(convert_to('覚えておくこと ' || i, 'utf8')), 'hex'),
       now() - (i || ' hours')::interval
  from generate_series(1, 100) as g(i);
SQL
TOTAL=$(psql "$DSN" -t -A -X -c "
  select (select count(*) from public.yorisou_current_state_records)
       + (select count(*) from public.yorisou_experience_cards)
       + (select count(*) from public.yorisou_goals)
       + (select count(*) from public.yorisou_life_reflections)
       + (select count(*) from public.yorisou_explicit_memories);")
note "seeded $TOTAL rows for $OWNER"

echo "[perf] 4/6 production build and app"
if [ "${OSF1_PERF_REUSE_BUILD:-}" = "1" ]; then
  [ -f .next/BUILD_ID ] || { echo "[perf] REUSE_BUILD=1 but no .next/BUILD_ID" >&2; exit 1; }
  note "REUSE_BUILD=1 — reusing the existing .next"
else
  npm run build > "$WORK/build.log" 2>&1 || { echo "[perf] build failed" >&2; tail -30 "$WORK/build.log" >&2; exit 1; }
fi
YORISOU_CI_TEST=1 \
YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true \
SUPABASE_URL="http://127.0.0.1:$PROXY_PORT" \
SUPABASE_SERVICE_ROLE_KEY="$SERVICE_KEY" \
YORISOU_DATA_DIR="$WORK/auth-store" \
YORISOU_AUTH_COOKIE_SECRET="$COOKIE_SECRET" \
YORISOU_PRIVATE_AI_PROVIDER_PRIMARY=openrouter_shared \
OPENROUTER_BASE_URL="http://127.0.0.1:$PROVIDER_PORT" \
OPENROUTER_API_KEY="$PROVIDER_KEY" \
YORISOU_PRIVATE_AI_OPENROUTER_MODEL=osf1-disposable-1 \
npx next start -p "$APP_PORT" > "$WORK/app.log" 2>&1 &
APP_PID=$!; disown "$APP_PID" 2>/dev/null || true
for _ in $(seq 1 90); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$APP_PORT/life")" = "200" ] && break
  sleep 1
done
[ "$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$APP_PORT/life")" = "200" ] || {
  echo "[perf] /life did not answer 200 — the gate is closed or the app failed" >&2
  tail -30 "$WORK/app.log" >&2; exit 1; }

# Register, then REBIND the seeded rows to the account the cookie resolves to. Seeding under the real
# account id is not possible before it exists, and re-seeding 450 rows through HTTP would spend the
# run measuring writes.
echo "[perf] 5/6 an account that owns the volume"
JAR="$WORK/jar"
curl -s -c "$JAR" -X POST -H 'Content-Type: application/json' \
  -d "{\"name\":\"OSF1性能検証\",\"email\":\"osf1-perf-$(date +%s)@example.test\",\"password\":\"Osf1-Str0ng-Pass!\",\"city\":\"Tokyo\",\"role\":\"self\"}" \
  "http://127.0.0.1:$APP_PORT/api/auth/register" >/dev/null
# The account id the seeded rows must move to: whichever owner the session writes as.
curl -s -b "$JAR" -c "$JAR" -X POST -H 'Content-Type: application/json' \
  -d '{"stateTags":["steady"],"mood":"calm","source":"manual"}' \
  "http://127.0.0.1:$APP_PORT/api/life/state" > "$WORK/probe.json"
ACCOUNT=$(psql "$DSN" -t -A -X -c "
  select owner_account_id from public.yorisou_current_state_records
   where owner_account_id <> '$OWNER' order by created_at desc limit 1;")
[ -n "$ACCOUNT" ] || { echo "[perf] could not determine the session's account id" >&2; cat "$WORK/probe.json" >&2; exit 1; }
note "session account: ${ACCOUNT:0:12}…"
psql "$DSN" -q -X -v ON_ERROR_STOP=1 -c "
  update public.yorisou_current_state_records set owner_account_id = '$ACCOUNT' where owner_account_id = '$OWNER';
  update public.yorisou_experience_cards       set owner_account_id = '$ACCOUNT' where owner_account_id = '$OWNER';
  update public.yorisou_goals                  set owner_account_id = '$ACCOUNT' where owner_account_id = '$OWNER';
  update public.yorisou_life_reflections       set owner_account_id = '$ACCOUNT' where owner_account_id = '$OWNER';
  update public.yorisou_explicit_memories      set owner_account_id = '$ACCOUNT' where owner_account_id = '$OWNER';" >/dev/null

# ── 6. Measure ───────────────────────────────────────────────────────────────
PGLOG="$WORK/pg/log"

# One surface: fetch it, count the statements it cost, and record its size and duration.
#
# Two fetches, and only the SECOND is measured. The first warms Next's route cache and any lazily
# built module, and counting that one would attribute compilation to the query path.
measure() {
  local label="$1" url="$2"
  curl -s -b "$JAR" -o /dev/null "$url" || true
  local before after queries bytes ms
  before=$(wc -c < "$PGLOG")
  ms=$( { /usr/bin/time -p curl -s -b "$JAR" -o "$WORK/body.txt" -w '%{http_code}' "$url" > "$WORK/code.txt"; } 2>&1 \
        | awk '/^real/{printf "%d", $2*1000}')
  after=$(wc -c < "$PGLOG")
  # Every logged statement line, for the window this fetch opened.
  tail -c "+$((before+1))" "$PGLOG" | head -c "$((after-before))" > "$WORK/window.log"
  # COUNT THE DATA QUERIES, NOT THE STATEMENTS.
  #
  # PostgREST wraps every request in its own transaction: BEGIN ISOLATION LEVEL …, SET LOCAL role,
  # SET LOCAL search_path, the query, COMMIT. `log_min_duration_statement = 0` records all five, so a
  # raw statement count multiplies every request by about five and reported 34 for a timeline page
  # that issues six requests — an inflation that reads exactly like the N+1 this harness is looking
  # for. Counting only statements that touch a `public.yorisou_*` relation counts the reads the
  # application actually asked for.
  local statements
  statements=$(grep -c "duration:" "$WORK/window.log" || true)
  queries=$(grep -c 'public"\?\."\?yorisou_\|public\.yorisou_' "$WORK/window.log" || true)
  bytes=$(wc -c < "$WORK/body.txt" | tr -d ' ')
  local code
  code=$(cat "$WORK/code.txt")
  printf '  %-32s http=%s  reads=%-4s stmts=%-4s bytes=%-8s %sms\n' \
    "$label" "$code" "$queries" "$statements" "$bytes" "$ms"
  LAST_QUERIES="$queries"; LAST_BYTES="$bytes"; LAST_CODE="$code"
  cp "$WORK/window.log" "$WORK/last-$label.log" 2>/dev/null || true
}

check() {
  local label="$1"
  if [ "$LAST_CODE" != "200" ]; then fail "$label" "http $LAST_CODE"; return; fi
  if [ "$LAST_QUERIES" -gt "$MAX_QUERIES_PER_PAGE" ]; then
    fail "$label queries" "$LAST_QUERIES statements — an N+1 over 100 rows looks exactly like this"
  elif [ "$LAST_BYTES" -gt "$MAX_PAGE_BYTES" ]; then
    fail "$label size" "$LAST_BYTES bytes — the whole history may be reaching the browser"
  else
    pass "$label: $LAST_QUERIES queries, $LAST_BYTES bytes"
  fi
}

echo "[perf] 6/6 measuring at volume"
BASE="http://127.0.0.1:$APP_PORT"

measure "life-hub"            "$BASE/life";                            check "Life hub"
HUB_QUERIES="$LAST_QUERIES"
measure "timeline-page-1"     "$BASE/life/timeline";                   check "Timeline page 1"
TL1="$LAST_QUERIES"
CURSOR=$(curl -s -b "$JAR" "$BASE/api/life/timeline" | node -e "
  let raw=''; process.stdin.on('data',(c)=>raw+=c).on('end',()=>{
    try { console.log(JSON.parse(raw).nextCursor ?? ''); } catch { console.log(''); }
  });")
if [ -n "$CURSOR" ]; then
  measure "timeline-page-2"   "$BASE/api/life/timeline?cursor=$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$CURSOR")"
  check "Timeline page 2"
  TL2="$LAST_QUERIES"
  # PAGE 2 MUST NOT COST MORE THAN PAGE 1. If it does, the cursor is an OFFSET in disguise and the
  # last page of a long history costs the most — the classic pagination defect, invisible at 20 rows.
  if [ "$TL2" -le $((TL1 + 2)) ]; then
    pass "Timeline page 2 costs no more than page 1 ($TL1 -> $TL2 queries) — the cursor is a keyset"
  else
    fail "Timeline pagination degrades" "page 1 = $TL1 queries, page 2 = $TL2"
  fi
else
  fail "Timeline pagination" "no next cursor at 100+ entries — pagination is not engaging"
fi
measure "timeline-filtered"   "$BASE/life/timeline?filter=REFLECTION"; check "Timeline filtered"
measure "memories-page-1"     "$BASE/life/memories";                   check "Memory page 1"
M1="$LAST_QUERIES"
MCURSOR=$(curl -s -b "$JAR" "$BASE/api/life/memories" | node -e "
  let raw=''; process.stdin.on('data',(c)=>raw+=c).on('end',()=>{
    try { console.log(JSON.parse(raw).nextCursor ?? ''); } catch { console.log(''); }
  });")
if [ -n "$MCURSOR" ]; then
  measure "memories-page-2"   "$BASE/api/life/memories?cursor=$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$MCURSOR")"
  check "Memory page 2"
  [ "$LAST_QUERIES" -le $((M1 + 2)) ] \
    && pass "Memory page 2 costs no more than page 1 ($M1 -> $LAST_QUERIES queries)" \
    || fail "Memory pagination degrades" "page 1 = $M1, page 2 = $LAST_QUERIES"
else
  fail "Memory pagination" "no next cursor at 100 memories"
fi

# The Return selection is on the hub, and its whole design is a hard cap of three. At 450 rows it must
# still read a bounded amount — this is the surface where "just read everything and pick" would work
# in development and never be noticed.
measure "return-selection"    "$BASE/api/life/timeline?filter=ALL&limit=3"; check "Return selection"

# The assistant, against the disposable provider. Its cost must not scale with the person's history,
# because it reads none of it — one provider call and no record reads at all.
ASSIST=$(curl -s -b "$JAR" -o "$WORK/assist.json" -w '%{http_code}' -X POST \
  -H 'Content-Type: application/json' \
  -d '{"answers":{"what_happened":"会議で言いたいことが言えなかった"},"mode":"light"}' \
  "$BASE/api/life/assistant")
if [ "$ASSIST" = "200" ] && grep -q '"ok":true' "$WORK/assist.json"; then
  pass "Reflection Assistant returns a draft through the disposable provider"
else
  fail "Reflection Assistant" "http $ASSIST: $(head -c 200 "$WORK/assist.json")"
fi

# ── The two static findings the statement log makes available ─────────────────
#
# UNBOUNDED COLLECTION. Every Life OS read must carry a LIMIT. One that does not is correct today and
# unbounded the moment somebody has a long history — the defect that cannot be found by looking at a
# page, only by looking at what the page asked for.
UNBOUNDED=$(cat "$WORK"/last-*.log 2>/dev/null \
  | grep -oE "SELECT[^;]*FROM \"?public\"?\.\"?yorisou_(life_reflections|explicit_memories|current_state_records|goals|experience_cards)\"?[^;]*" \
  | grep -vc "LIMIT" || true)
[ "${UNBOUNDED:-0}" = "0" ] \
  && pass "every Life OS read carries a LIMIT — no unbounded collection" \
  || fail "unbounded collection" "$UNBOUNDED SELECT(s) with no LIMIT"

# REPEATED READS OF ONE TABLE. Several reads of the same table to render one page is not automatically
# a defect — the Life hub genuinely shows seven different things, and the latest state, the state
# history and the Return selection are three different questions about the same rows. It becomes a
# defect when it grows with the DATA rather than with the number of sections, so the whole per-table
# profile is REPORTED and only a count that could not be explained by the sections is failed.
echo
note "Life hub read profile at $TOTAL rows ($HUB_QUERIES reads total):"
cat "$WORK/last-life-hub.log" 2>/dev/null \
  | grep -oE 'from "?public"?\."?yorisou_[a-z_]+"?|FROM "?public"?\."?yorisou_[a-z_]+"?' \
  | sed 's/.*yorisou_/yorisou_/; s/"$//' | sort | uniq -c | sort -rn \
  | while read -r n table; do note "  $n × $table"; done
WORST_N=$(cat "$WORK/last-life-hub.log" 2>/dev/null \
  | grep -oiE 'from "?public"?\."?yorisou_[a-z_]+"?' | sed 's/.*yorisou_/yorisou_/; s/"$//' \
  | sort | uniq -c | sort -rn | head -1 | awk '{print $1}')
if [ -z "${WORST_N:-}" ]; then
  note "no reads captured for the hub — skipping the repeat check"
elif [ "$WORST_N" -le "$MAX_TABLE_REPEATS" ]; then
  pass "the Life hub reads no single table more than $WORST_N time(s) — bounded by sections, not by rows"
else
  fail "repeated reads" "the hub reads one table $WORST_N times — an N+1 looks exactly like this"
fi

echo
if [ "$FAILURES" -eq 0 ]; then
  echo "[perf] PASS — $CHECKS checks at $TOTAL rows; no N+1, no unbounded read, pagination does not degrade"
else
  echo "[perf] FAIL — $FAILURES of $CHECKS checks failed"
  exit 1
fi
