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
PROVIDER_PORT="${OSF1_A11Y_PROVIDER_PORT:-55595}"
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
  # BY PID AND BY COMMAND LINE. `npx next start` forks, so killing the recorded PID kills the wrapper
  # and can leave the server holding the port — which is precisely what stranded a listener between two
  # CI steps. The pkill is the backstop the harness's own error message has always told operators to
  # run by hand; there is no reason it should be manual.
  [ -n "${APP_PID:-}" ] && kill "$APP_PID" 2>/dev/null
  pkill -f "next start -p $APP_PORT" 2>/dev/null
  [ -n "${PROVIDER_PID:-}" ] && kill "$PROVIDER_PID" 2>/dev/null
  [ -n "${PROXY_PID:-}" ] && kill "$PROXY_PID" 2>/dev/null
  [ -n "${REST_PID:-}" ] && kill "$REST_PID" 2>/dev/null
  # Only a cluster this script BUILT is stopped. In attach mode the database belongs to whoever
  # started it, and stopping it would be this harness reaching outside its own scope.
  [ -z "${ATTACHED:-}" ] && pg_ctl -D "$WORK/pg" stop -m immediate >/dev/null 2>&1
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
# PORTABLE, AND IT FAILS LOUD RATHER THAN OPEN.
#
# This was `lsof -nP -iTCP:"$1" -sTCP:LISTEN`, and `lsof` is not installed on a GitHub runner. A missing
# command exits non-zero, which this function reads as "the port is free" — so the pre-flight silently
# passed, the app hit EADDRINUSE, and the spec talked to the PREVIOUS step's server, which was pointed
# at a schema this run had just dropped and recreated. It surfaced as `500 life_os_failed` on a session
# check, which looks like an application defect and is not one.
#
# A check whose failure mode is "assume everything is fine" is worse than no check. `node` is already a
# hard dependency of this harness — it mints the JWT and runs the proxy — so a connect attempt is both
# portable and unambiguous.
busy() {
  node -e "
    const net = require('net');
    const s = net.connect($1, '127.0.0.1');
    s.on('connect', () => { s.destroy(); process.exit(0); });
    s.on('error', () => process.exit(1));
    setTimeout(() => { s.destroy(); process.exit(1); }, 1500);
  " 2>/dev/null
}
# In attach mode the database port is SUPPOSED to be busy — a service container is already listening
# on it — so it is not one of the ports this run claims.
PORTS_TO_CLAIM=("$REST_PORT" "$PROXY_PORT" "$PROVIDER_PORT" "$APP_PORT")
[ -z "${OSF1_A11Y_ATTACH_DSN:-}" ] && PORTS_TO_CLAIM=("$PG_PORT" "${PORTS_TO_CLAIM[@]}")
for port in "${PORTS_TO_CLAIM[@]}"; do
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
# ── ATTACH MODE, for CI ──────────────────────────────────────────────────────
#
# `OSF1_A11Y_ATTACH_DSN` points this harness at a PostgreSQL somebody else started — a service
# container on a CI runner — instead of building a cluster with initdb.
#
# WHY IT IS THE SAME HARNESS AND NOT A SECOND ONE. The obvious alternative is for the CI workflow to
# orchestrate its own stack, which is what the two older full-stack jobs in this repository do. That
# works and it drifts: the local gate and the CI gate then have to be kept in step by hand, and the
# day they disagree the green one is the one nobody re-reads. One harness, two ways in, is the only
# shape where "it passes locally" and "it passes in CI" mean the same thing.
#
# In attach mode the database is NOT torn down here — whoever started it owns it.
if [ -n "${OSF1_A11Y_ATTACH_DSN:-}" ]; then
  echo "[osf1-a11y] 1/7 attaching to a PostgreSQL started elsewhere"
  DSN="$OSF1_A11Y_ATTACH_DSN"
  rm -rf "$WORK"; mkdir -p "$WORK/auth-store"
  ATTACHED=1
  # ── THE REFUSALS, AND WHY THEY ASK THE SERVER INSTEAD OF READING THE STRING ──
  #
  # Attach mode runs `drop schema public cascade`. That makes this the most destructive line in the
  # repository, and the first version of it was guarded by `case "$DSN" in *supabase*|*amazonaws*)` —
  # a two-token denylist over a string. An adversarial review took it apart, and it was right to:
  #
  #   - every hosted Postgres that is not Supabase or AWS walked straight through;
  #   - so did a developer's own `postgres://postgres@127.0.0.1:5432/yorisou_dev`;
  #   - so did any loopback tunnel (cloud-sql-proxy, kubectl port-forward, ssh -L) to anywhere;
  #   - and libpq defeats string matching outright: `OSF1_A11Y_ATTACH_DSN="postgres://"` with PGHOST
  #     set, or `"service=prod"`, or the `host=… dbname=…` keyword form, all mean something the
  #     pattern never sees.
  #
  # tests/life-os/postgres-acceptance.sh already had the right shape — an ALLOWLIST — and states the
  # threat model in its own words: "A harness that can be pointed at a real database by setting one
  # variable is a harness that will eventually be pointed at one." The destructive script had the
  # weaker guard. So this now resolves the EFFECTIVE target from the server and refuses on that:
  #
  #   1. the database must be named exactly the disposable one this harness owns
  #   2. it must be EMPTY or hold only this harness's own tables — never a database with foreign data
  #   3. the server must not be at a PUBLICLY ROUTABLE address
  #   4. and the version must be 16 or 17
  #
  # Asking `select current_database(), inet_server_addr()` is what makes PGHOST, service= and keyword
  # DSNs harmless: whatever libpq resolved, the answer comes back from the server that was reached.
  #
  # ON (3), AND WHY IT IS NOT "MUST BE LOOPBACK". The first version required loopback and it refused the
  # CI service container — correctly, by its own rule, and uselessly: a Docker service is reached at
  # 127.0.0.1 through a published port and answers from its bridge address, 172.18.0.2. Rejecting
  # publicly routable addresses keeps the property that actually matters (this cannot be a hosted
  # database reached over the internet — Supabase, Neon, RDS and Cloud SQL all resolve to public IPs)
  # while allowing a container on this host.
  #
  # (1) and (2) are the load-bearing ones regardless. `osf1_life_a11y` is not a name anybody gives a
  # real database, and Supabase's is `postgres`; a tunnel to production on loopback fails both.
  TARGET=$(psql "$DSN" -t -A -X -F'|' -c \
    "select current_database(),
            coalesce(host(inet_server_addr()), 'local'),
            coalesce(inet_server_addr() <<= inet '127.0.0.0/8'
                  or inet_server_addr() <<= inet '10.0.0.0/8'
                  or inet_server_addr() <<= inet '172.16.0.0/12'
                  or inet_server_addr() <<= inet '192.168.0.0/16'
                  or inet_server_addr() = inet '::1', true),
            split_part(current_setting('server_version'), '.', 1);" 2>/dev/null)
  [ -n "$TARGET" ] || { echo "[osf1-a11y] refusing: cannot reach the attach target to identify it" >&2; exit 1; }
  IFS='|' read -r TARGET_DB TARGET_HOST TARGET_PRIVATE MAJOR <<EOF
$TARGET
EOF
  # (1) FIRST, because it is the strongest and the clearest to read in a failure.
  [ "$TARGET_DB" = "$DB" ] || {
    echo "[osf1-a11y] refusing: the attach target is database '$TARGET_DB', not the disposable '$DB'" >&2; exit 1; }
  [ "$TARGET_PRIVATE" = "t" ] || {
    echo "[osf1-a11y] refusing: the attach target answers from $TARGET_HOST, a publicly routable address" >&2; exit 1; }
  case "$MAJOR" in
    16|17) : ;;
    *) echo "[osf1-a11y] refusing: need PostgreSQL 16 or 17 (Production runs 17); server says '$MAJOR'" >&2; exit 1 ;;
  esac
  # 3. Foreign data. Even a correctly-named private database must not be holding somebody's rows: a
  # developer who happened to create `osf1_life_a11y` and put something in it should get a refusal, not
  # a cascade.
  #
  # THE ALLOWLIST IS DERIVED FROM THE MIGRATIONS, not from a prefix guess. Two prefixes (`yorisou_` and
  # `_osf1_`) looked sufficient and were not: the lineage also creates five `agent_runtime_*` tables, so
  # a prefix check refused this harness's OWN database on the second CI step — the workflow runs four
  # steps against one service container, and each one sees the previous one's schema. Reading the
  # `create table` statements means the set cannot drift from what actually gets created.
  OURS=$(grep -ohiE "create table (if not exists )?(public\\.)?[a-z0-9_]+" supabase/migrations/*.sql \
    | sed -E 's/.*[ .]([a-z0-9_]+)$/\1/' | sort -u | tr '\n' ',' | sed "s/,$//; s/[^,]*/'&'/g")
  FOREIGN=$(psql "$DSN" -t -A -X -c \
    "select count(*) from information_schema.tables
      where table_schema = 'public'
        and table_name not in ($OURS)
        and table_name not like '\\_osf1\\_%';" 2>/dev/null)
  [ "${FOREIGN:-0}" = "0" ] || {
    echo "[osf1-a11y] refusing: '$TARGET_DB' holds $FOREIGN table(s) this harness does not own" >&2
    psql "$DSN" -t -A -X -c "select table_name from information_schema.tables
       where table_schema='public' and table_name not in ($OURS) and table_name not like '\\_osf1\\_%' limit 5;" >&2
    exit 1; }
  echo "[osf1-a11y]     target verified: $TARGET_DB at $TARGET_HOST (private), PostgreSQL $MAJOR, no foreign tables"
  # Extensions live in `public` and go with it; the roles and default privileges below are applied
  # immediately afterwards, in both modes, so the schema comes back set up the same way either way.
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 \
    -c "set client_min_messages = warning; drop schema if exists public cascade; create schema public;" >/dev/null
else
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
fi

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

# ── 2b. OPTIONAL fault injection, for the §10 audit-failure end-to-end test ───
#
# The transactional audit class means a save can fail with nothing written. Proving the UI handles
# that needs the audit insert to fail while the real app is running, which needs something the SPEC
# can switch — and a spec talks to PostgREST, which cannot run DDL.
#
# So the switch is a flag row plus a trigger, installed HERE by psql and toggled by a function the
# spec calls over PostgREST. Three properties make this safe to have at all:
#
#   - It is created by the harness, never by a migration. No production database can contain it.
#   - It is created only when asked for (OSF1_STACK_FAULT_INJECTION=1), so the other specs run
#     against a cluster that does not have it.
#   - It is installed BEFORE PostgREST starts, because PostgREST builds its schema cache at boot and
#     would not expose a function created afterwards.
#
# It grants nothing to anon: the app authenticates as service_role and so does the spec.
if [ "${OSF1_STACK_FAULT_INJECTION:-}" = "1" ]; then
  echo "[osf1-a11y]     fault injection ARMED-CAPABLE (harness-only; never in a migration)"
  psql "$DSN" -q -X -v ON_ERROR_STOP=1 -c "
    create table public._osf1_fault (enabled boolean not null);
    insert into public._osf1_fault values (false);
    create function public._osf1_audit_fault() returns trigger language plpgsql as \$\$
    begin
      if (select enabled from public._osf1_fault limit 1) then
        raise exception 'osf1_forced_audit_failure';
      end if;
      return new;
    end \$\$;
    create trigger _osf1_audit_fault before insert on public.yorisou_life_os_audit_events
      for each row execute function public._osf1_audit_fault();
    create function public.osf1_test_audit_fault(p_enabled boolean) returns boolean
      language sql security definer set search_path = public as \$\$
        update public._osf1_fault set enabled = p_enabled returning enabled;
      \$\$;
    revoke all on function public.osf1_test_audit_fault(boolean) from public;
    grant execute on function public.osf1_test_audit_fault(boolean) to service_role;" >/dev/null
fi

# ── 3. PostgREST ─────────────────────────────────────────────────────────────
# The service-role key the app carries is an HS256 JWT with `role: service_role`, signed with the
# secret PostgREST validates against — the same shape as a hosted Supabase key, minted here in node
# so the harness adds no dependency. PostgREST refuses a secret under 32 characters.
echo "[osf1-a11y] 3/7 PostgREST with a generated service-role JWT"
# GENERATED, not a literal with a timestamp in it. Two reasons, and the second is the real one:
# gitleaks flags a hardcoded 32-hex tail as a secret (correctly — it cannot tell a fixture from a key),
# and the epoch second was the ONLY entropy, so anyone who could reach the port could brute-force a few
# thousand candidates from the public job-start time and mint a service_role token. On an ephemeral
# runner that is a small risk; on a self-hosted one, or on an operator's laptop reproducing CI, it is
# not. tests/life-os/internal-access.sh already did this correctly, so this is a copy from a sibling.
COOKIE_SECRET="osf1-a11y-cookie-$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
JWT_SECRET="osf1-a11y-$(node -e "console.log(require('crypto').randomBytes(24).toString('hex'))")"
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
# BINDING IS A DIFFERENT QUESTION FROM LISTENING, AND ONLY ONE OF THEM IS THE ONE THAT MATTERS.
#
# The pre-flight above asks "is anything listening on this port?" by connecting to it. PostgREST
# needs "can I BIND this port?", and between the two sits the case that actually broke CI: the
# previous step's PostgREST container, killed but not yet gone, refuses connections while still
# holding the port. The pre-flight sees a free port, PostgREST dies with
#
#     postgrest: Network.Socket.bind: resource busy (Address in use)
#
# and the step fails with `not healthy (got 000)` — intermittently, because it depends on how fast
# the previous container releases. Same tree, same commit: one run passed and one failed.
#
# So the start is retried, but ONLY on that exact signature. Anything else fails immediately and
# loudly, because a retry loop that swallows real startup errors is worse than no retry at all.
start_postgrest() {
  "$POSTGREST" "$WORK/postgrest.conf" > "$WORK/postgrest.log" 2>&1 &
  REST_PID=$!
  disown "$REST_PID" 2>/dev/null || true
  for _ in $(seq 1 60); do
    REST_CHECK=$(curl -s -o /dev/null -w '%{http_code}' -H "Authorization: Bearer $SERVICE_KEY" \
      "http://127.0.0.1:$REST_PORT/yorisou_life_reflections?select=id&limit=1" || true)
    [ "$REST_CHECK" = "200" ] && return 0
    # If it died of a port still being released, stop waiting on a process that is already gone.
    grep -qi "resource busy\|address in use" "$WORK/postgrest.log" 2>/dev/null && return 1
    sleep 1
  done
  return 1
}

REST_CHECK=""
for attempt in 1 2 3 4 5; do
  start_postgrest && break
  if grep -qi "resource busy\|address in use" "$WORK/postgrest.log" 2>/dev/null; then
    echo "[osf1-a11y] port $REST_PORT still held by a departing listener; retry $attempt" >&2
    kill "$REST_PID" 2>/dev/null
    sleep 3
    continue
  fi
  break
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
#
# ── OPTIONAL: a disposable provider, reached the way every provider is reached ──
#
# The assistant's draft state and its provider-failure state are two of the screens §15 scans and §16
# drives by keyboard, and neither exists with providers off — which is their production default. The
# resolver already accepts a base URL, because a self-hosted or proxied provider is a real deployment
# shape, so pointing `openrouter_shared` at loopback needs NO code path that would not otherwise
# exist. There is deliberately no way to inject a fake through the app's own HTTP surface.
#
# The key is generated here and is not a credential to anything: the disposable server never checks it.
PROVIDER_ENV=()
if [ "${OSF1_STACK_FAKE_PROVIDER:-}" = "1" ]; then
  echo "[osf1-a11y]     disposable provider on 127.0.0.1:$PROVIDER_PORT (loopback only)"
  node tests/life-os/disposable-provider.mjs "$PROVIDER_PORT" > "$WORK/provider.log" 2>&1 &
  PROVIDER_PID=$!
  disown "$PROVIDER_PID" 2>/dev/null || true
  PROVIDER_CHECK=""
  for _ in $(seq 1 20); do
    PROVIDER_CHECK=$(curl -s -o /dev/null -w '%{http_code}' -X POST -d '{"messages":[]}' \
      "http://127.0.0.1:$PROVIDER_PORT/chat/completions" || true)
    [ "$PROVIDER_CHECK" = "200" ] && break
    sleep 1
  done
  [ "$PROVIDER_CHECK" = "200" ] || {
    echo "[osf1-a11y] disposable provider not healthy (got $PROVIDER_CHECK)" >&2
    cat "$WORK/provider.log" >&2; exit 1; }
  # Through a variable, never a literal beside the name — see the note in performance-smoke.sh.
  PROVIDER_KEY="osf1-a11y-$(node -e "console.log(require('crypto').randomBytes(12).toString('hex'))")"
  PROVIDER_ENV=(
    "YORISOU_PRIVATE_AI_PROVIDER_PRIMARY=openrouter_shared"
    "OPENROUTER_BASE_URL=http://127.0.0.1:$PROVIDER_PORT"
    "OPENROUTER_API_KEY=$PROVIDER_KEY"
    "YORISOU_PRIVATE_AI_OPENROUTER_MODEL=osf1-disposable-1"
  )
fi

echo "[osf1-a11y] 6/7 app server with the Life OS open for a trusted test context"
env \
YORISOU_CI_TEST=1 \
YORISOU_OSF1_LIFE_OS_SCHEMA_READY=true \
SUPABASE_URL="http://127.0.0.1:$PROXY_PORT" \
SUPABASE_SERVICE_ROLE_KEY="$SERVICE_KEY" \
YORISOU_DATA_DIR="$WORK/auth-store" \
YORISOU_AUTH_COOKIE_SECRET="$COOKIE_SECRET" \
${PROVIDER_ENV[@]+"${PROVIDER_ENV[@]}"} \
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
OSF1_FAKE_PROVIDER="${OSF1_STACK_FAKE_PROVIDER:-}" \
OSF1_FAULT_INJECTION="${OSF1_STACK_FAULT_INJECTION:-}" \
npx playwright test "$SPEC" --project=desktop || {
  # THE SERVER'S OWN ACCOUNT OF THE FAILURE, printed before teardown destroys it.
  #
  # A spec failing on `500 life_os_failed` says the store refused and nothing about why — and the
  # reason is in the app log and the PostgREST log, both of which live inside $WORK and are deleted
  # two lines from now. On a CI runner that log is the only witness there will ever be, and without
  # this the operator gets an assertion message and a torn-down stack.
  echo "[osf1-a11y] ── the spec failed; the stack's own logs follow ──" >&2
  echo "[osf1-a11y] ── app (last 40 lines) ──" >&2
  tail -40 "$WORK/app.log" >&2 2>/dev/null || echo "  (no app log)" >&2
  echo "[osf1-a11y] ── postgrest (last 20 lines) ──" >&2
  tail -20 "$WORK/postgrest.log" >&2 2>/dev/null || echo "  (no postgrest log)" >&2
  if [ -f "$WORK/provider.log" ]; then
    echo "[osf1-a11y] ── disposable provider (last 10 lines) ──" >&2
    tail -10 "$WORK/provider.log" >&2
  fi
  exit 1
}

echo "[osf1-a11y] PASS — $SPEC; teardown follows"
