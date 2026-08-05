#!/bin/bash
# YORISOU local launcher — start (LOCAL-LAUNCHER-REFRESH-1; dev-only, NOT production).
#
# Fail-closed sequence (§8): lock → repository → runtime deps → Colima → local
# Supabase → schema validation → build if stale → next start on 127.0.0.1:3210 →
# health → Chrome app window ONLY after readiness → persist PID + identity →
# release lock. Every wait is bounded. A missing required schema is fatal; a
# branch mismatch is a warning. Never connects to Production or Preview.

DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1090
. "$DIR/yorisou-launcher-lib.sh"

LOG="$YR_LAUNCHER_LOG"

open_window() {
  mkdir -p "$YR_CHROME_PROFILE" >/dev/null 2>&1
  if [ -x "$YR_CHROME" ]; then
    "$YR_CHROME" \
      --app="$YR_URL/" \
      --user-data-dir="$YR_CHROME_PROFILE" \
      --no-first-run --no-default-browser-check \
      --class=YORISOU --window-size=1180,860 >/dev/null 2>&1 &
    yr_log "$LOG" "browser-open: standalone Chrome app window at $YR_URL"
  else
    /usr/bin/open "$YR_URL/" >/dev/null 2>&1 || true
    yr_log "$LOG" "browser-open: Chrome not found; opened default browser at $YR_URL"
  fi
}

# Quick current-grade identity probe usable before full repository validation.
# HTTP alone NEVER takes a fast path — the port owner must pass the full
# ownership contract against the repository's current HEAD.
yr_quick_current() {
  q_sha=$(git -C "$YORISOU_REPO" rev-parse HEAD 2>/dev/null); [ -n "$q_sha" ] || return 1
  q_br=$(git -C "$YORISOU_REPO" rev-parse --abbrev-ref HEAD 2>/dev/null)
  q_owner=$(yr_port_owner | head -1); [ -n "$q_owner" ] || return 1
  yr_runtime_is_current "$q_owner" "$q_sha" "$q_br"
}

# ── 1. Launcher lock (atomic mkdir; self-repairs a stale lock) ───────────────
LOCKD="$YR_RUN/start.lock.d"
if ! mkdir "$LOCKD" 2>/dev/null; then
  # Either a launch is in flight or a previous launch died mid-way. The fast
  # path requires PROVEN current identity, never mere HTTP reachability.
  if yr_quick_current; then yr_log "$LOG" "start: already healthy (ownership + current identity proven) — opening window"; open_window; exit 0; fi
  lock_age=$(( $(date +%s) - $(stat -f%m "$LOCKD" 2>/dev/null || date +%s) ))
  if [ "$lock_age" -gt 1800 ]; then
    yr_log "$LOG" "start: removing stale launch lock (age ${lock_age}s)"
    rmdir "$LOCKD" 2>/dev/null || true
    mkdir "$LOCKD" 2>/dev/null || { yr_log "$LOG" "start: lock re-acquire failed"; exit 1; }
  else
    yr_log "$LOG" "start: another launch appears in progress — waiting (bounded 60s)"
    i=0; while [ $i -lt 60 ]; do sleep 1; yr_quick_current && { open_window; exit 0; }; i=$((i+1)); done
    yr_fail "$LOG" "Another launch is in progress but no owned, current YORISOU service appeared (last ownership failure:${YR_OWNERSHIP_FAIL:- none}). See $LOG"
  fi
fi
trap 'rmdir "$LOCKD" 2>/dev/null' EXIT

yr_log "$LOG" "──────── YORISOU start (launcher $YR_LAUNCHER_VERSION) ────────"

# ── 2. Validate repository (never switch or modify branches) ─────────────────
[ -d "$YORISOU_REPO/.git" ] || yr_fail "$LOG" "Repository not found at: $YORISOU_REPO"
[ -f "$YORISOU_REPO/package.json" ] || yr_fail "$LOG" "package.json missing in: $YORISOU_REPO"
cd "$YORISOU_REPO" || yr_fail "$LOG" "Cannot enter repository: $YORISOU_REPO"
CUR_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null)"
CUR_SHA="$(git rev-parse HEAD 2>/dev/null)"
[ -n "$CUR_SHA" ] || yr_fail "$LOG" "Cannot resolve repository HEAD in $YORISOU_REPO"
yr_log "$LOG" "repo: $YORISOU_REPO branch=$CUR_BRANCH sha=$CUR_SHA"
if [ -n "$YORISOU_EXPECTED_BRANCH" ] && [ "$CUR_BRANCH" != "$YORISOU_EXPECTED_BRANCH" ]; then
  yr_log "$LOG" "WARNING: branch '$CUR_BRANCH' != expected '$YORISOU_EXPECTED_BRANCH' (not switching; continuing)"
fi

# ── 3. Validate runtime dependencies ─────────────────────────────────────────
[ -x "$YR_NODE" ] || yr_fail "$LOG" "Node is not available (looked for /usr/local/bin/node and PATH)."
[ -x "$YR_NPM" ]  || yr_fail "$LOG" "npm is not available."
yr_log "$LOG" "runtime: $(yr_arch_facts)  npm: $($YR_ARCH_PREFIX "$YR_NPM" --version 2>/dev/null)"
if [ -n "$YR_ARCH_PREFIX" ] && [ "$($YR_ARCH_PREFIX "$YR_NODE" -p process.arch 2>/dev/null)" != "arm64" ]; then
  yr_fail "$LOG" "Cannot run node natively on this Apple Silicon machine ($(yr_arch_facts)). A translated build would target the wrong native binaries."
fi
[ -d "$YORISOU_REPO/node_modules/next" ] || yr_fail "$LOG" "node_modules is unusable (next missing). Run: cd $YORISOU_REPO && npm ci"

# ── 4. Colima + Docker ───────────────────────────────────────────────────────
if yr_colima_up; then
  yr_log "$LOG" "colima: already running"
else
  yr_log "$LOG" "colima: starting (bounded)…"
  colima start --cpu 2 --memory 4 --disk 18 >>"$LOG" 2>&1 || yr_fail "$LOG" "Colima failed to start. Try manually: colima start"
fi
docker info >/dev/null 2>&1 || yr_fail "$LOG" "Docker is not available via Colima."
yr_log "$LOG" "docker: OK"

# ── 5. Local Supabase ────────────────────────────────────────────────────────
if yr_supabase_up; then
  yr_log "$LOG" "supabase: local stack already running"
else
  yr_log "$LOG" "supabase: starting local stack (bounded)…"
  ( cd "$YORISOU_REPO" && supabase start >>"$LOG" 2>&1 ) || yr_fail "$LOG" "Local Supabase failed to start."
  yr_supabase_up || yr_fail "$LOG" "Local Supabase container ${YR_DB_CONTAINER} did not come up."
fi
PG_VERSION="$(yr_pg_version)"
[ -n "$PG_VERSION" ] || yr_fail "$LOG" "Local PostgreSQL is not answering queries."
yr_log "$LOG" "postgres: $PG_VERSION"

# ── 6. Validate current database schema (FATAL when missing) ─────────────────
MISSING_MIG="$(yr_missing_migrations)"
if [ -n "$MISSING_MIG" ]; then
  yr_log "$YR_MIGRATION_LOG" "migration readiness FAILED — unapplied versions: $(printf '%s ' $MISSING_MIG)"
  if [ "$YORISOU_AUTO_MIGRATE" = "1" ]; then
    yr_log "$YR_MIGRATION_LOG" "YORISOU_AUTO_MIGRATE=1 — applying pending migrations via supabase CLI (fail-closed)…"
    ( cd "$YORISOU_REPO" && supabase migration up --local >>"$YR_MIGRATION_LOG" 2>&1 ) \
      || yr_fail "$LOG" "Migration apply failed. See $YR_MIGRATION_LOG. The app was NOT started."
    MISSING_MIG="$(yr_missing_migrations)"
    [ -z "$MISSING_MIG" ] || yr_fail "$LOG" "Migrations still missing after apply: $MISSING_MIG"
    yr_log "$YR_MIGRATION_LOG" "migration readiness: OK after apply"
  else
    yr_fail "$LOG" "Local database is missing repository migrations: $(printf '%s ' $MISSING_MIG). Run: cd $YORISOU_REPO && supabase migration up --local  (or set YORISOU_AUTO_MIGRATE=1 in $YR_ENV)"
  fi
else
  yr_log "$YR_MIGRATION_LOG" "migration readiness: OK (all repository migration versions applied)"
fi
MISSING_TABLES="$(yr_missing_tables)"
[ -z "$MISSING_TABLES" ] || yr_fail "$LOG" "Required canonical tables are absent: $MISSING_TABLES. Schema validation is fatal."
yr_log "$LOG" "schema: migration readiness OK; catalogue readiness OK"

# ── 7. Refresh local Supabase connection env (robust; values never logged) ───
SB_ENV="$(cd "$YORISOU_REPO" && supabase status -o env 2>/dev/null)"
if [ -n "$SB_ENV" ]; then
  API="$(printf '%s\n' "$SB_ENV" | sed -n 's/^API_URL="\(.*\)"$/\1/p')"
  SRK="$(printf '%s\n' "$SB_ENV" | sed -n 's/^SERVICE_ROLE_KEY="\(.*\)"$/\1/p')"
  [ -n "$API" ] && export SUPABASE_URL="$API"
  [ -n "$SRK" ] && export SUPABASE_SERVICE_ROLE_KEY="$SRK"
fi
yr_log "$LOG" "supabase URL: ${SUPABASE_URL:-unset}"

# ── 8a. Evaluate any existing port owner BEFORE the build step ───────────────
# Ordering matters: rebuilding first would overwrite the recorded build identity
# and make a stale-but-ours server indistinguishable from a foreign one.
EXISTING_CURRENT=0
OWNERS="$(yr_port_owner)"
if [ -n "$OWNERS" ]; then
  OWNER_ONE="$(printf '%s\n' "$OWNERS" | head -1)"
  if yr_runtime_is_current "$OWNER_ONE" "$CUR_SHA" "$CUR_BRANCH"; then
    yr_log "$LOG" "server: already running with proven ownership + current identity (pid $OWNER_ONE)"
    EXISTING_CURRENT=1
  elif yr_runtime_is_ours "$OWNER_ONE"; then
    # Ours, but stale (built from a different commit than HEAD). Ownership is
    # independently proven, so a graceful replace is safe.
    yr_log "$LOG" "server: OURS but stale (pid $OWNER_ONE; $YR_OWNERSHIP_FAIL) — stopping it before rebuild"
    kill -TERM "$OWNER_ONE" 2>/dev/null
    i=0; while [ $i -lt 20 ] && kill -0 "$OWNER_ONE" 2>/dev/null; do sleep 1; i=$((i+1)); done
    kill -0 "$OWNER_ONE" 2>/dev/null && yr_fail "$LOG" "Stale owned server (pid $OWNER_ONE) did not exit within 20s. Not proceeding."
    rm -f "$YR_PID_FILE"
  else
    yr_fail "$LOG" "Port $YORISOU_LOCAL_PORT is served by a process this launcher cannot prove it owns (pid $OWNER_ONE: $(yr_proc_cmd "$OWNER_ONE" | cut -c1-120); failed:$YR_OWNERSHIP_FAIL). Refusing to open a window, overwrite PID state, or signal it."
  fi
fi

# ── 8. Build when build identity is stale ────────────────────────────────────
BUILT_SHA="$(yr_recorded_build_sha)"
NEED_BUILD=0
[ -f "$YORISOU_REPO/.next/BUILD_ID" ] || NEED_BUILD=1
[ -n "$BUILT_SHA" ] || NEED_BUILD=1
[ "$BUILT_SHA" = "$CUR_SHA" ] || NEED_BUILD=1
[ "$EXISTING_CURRENT" = "1" ] && NEED_BUILD=0
if [ "$NEED_BUILD" = "1" ]; then
  # next/font/google fetches fonts at build time. Record whether this launch
  # context can reach it — an unsigned .app's network can be filtered (Avast /
  # AnyConnect socket filters) even when a terminal shell's is not.
  FONT_NET=$(/usr/bin/curl -s -o /dev/null -w '%{http_code}' --max-time 8 "https://fonts.googleapis.com/css2?family=Noto+Sans+JP" 2>/dev/null || echo 000)
  yr_log "$LOG" "build: network preflight fonts.googleapis.com=$FONT_NET"
  if [ "$FONT_NET" = "000" ]; then
    yr_fail "$LOG" "This launch context cannot reach fonts.googleapis.com, which the production build requires (next/font). Build once from a terminal:  \"$HOME/Library/Application Support/YORISOU/bin/start-yorisou.sh\"  — or allow YORISOU.app network access in your security software. The app was NOT started."
  fi
  yr_log "$LOG" "build: stale identity (recorded=${BUILT_SHA:-none} current=$CUR_SHA) — building (may take minutes)…"
  ( cd "$YORISOU_REPO" && $YR_ARCH_PREFIX "$YR_NPM" run build >>"$LOG" 2>&1 ) || yr_fail "$LOG" "Production build failed. See $LOG. The app was NOT started."
  BUILD_ID="$(cat "$YORISOU_REPO/.next/BUILD_ID" 2>/dev/null)"
  [ -n "$BUILD_ID" ] || yr_fail "$LOG" "Build reported success but .next/BUILD_ID is missing."
  yr_write_build_identity "$CUR_SHA" "$BUILD_ID"
  yr_log "$LOG" "build: OK build_id=$BUILD_ID sha=$CUR_SHA"
else
  yr_log "$LOG" "build: identity current (sha=$CUR_SHA build_id=$(cat "$YORISOU_REPO/.next/BUILD_ID" 2>/dev/null))"
fi

# ── 9. Port safety, then start the server ────────────────────────────────────
export NODE_ENV=production
export YORISOU_DATA_DIR YORISOU_ADMIN_EMAILS YORISOU_AUTH_COOKIE_SECRET SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY
# Truthful runtime identity: the SHA recorded at build time, never a label.
VERCEL_GIT_COMMIT_SHA="$(yr_recorded_build_sha)"
VERCEL_GIT_COMMIT_REF="$CUR_BRANCH"
export VERCEL_GIT_COMMIT_SHA VERCEL_GIT_COMMIT_REF
[ -n "$YORISOU_DATA_DIR" ] && mkdir -p "$YORISOU_DATA_DIR" >/dev/null 2>&1

if [ "$EXISTING_CURRENT" = "1" ]; then
  yr_log "$LOG" "server: reusing owned current server (pid $(yr_port_owner | head -1))"
else
  # Step 8a either found the port free or freed our own stale server; anything
  # appearing since is a race with an unrelated process — fail closed.
  OWNERS="$(yr_port_owner)"
  if [ -n "$OWNERS" ]; then
    yr_fail "$LOG" "Port $YORISOU_LOCAL_PORT became occupied during startup by a process this launcher does not own (pid $(printf '%s' "$OWNERS" | head -1)). Refusing to touch it."
  fi
  # Self-repair: a recorded PID whose process is dead is stale — remove it.
  RECORDED="$(cat "$YR_PID_FILE" 2>/dev/null)"
  if [ -n "$RECORDED" ] && ! kill -0 "$RECORDED" 2>/dev/null; then
    yr_log "$LOG" "self-repair: removing stale PID file (dead pid $RECORDED)"
    rm -f "$YR_PID_FILE"
  fi
  yr_rotate "$YR_SERVER_LOG"
  yr_log "$LOG" "server: starting next on $YR_URL via $YR_NODE…"
  cd "$YORISOU_REPO" || yr_fail "$LOG" "Cannot enter repository: $YORISOU_REPO"
  HOSTNAME="$YORISOU_LOCAL_HOST" nohup $YR_ARCH_PREFIX "$YR_NODE" \
    "$YORISOU_REPO/node_modules/next/dist/bin/next" start -H "$YORISOU_LOCAL_HOST" -p "$YORISOU_LOCAL_PORT" \
    >>"$YR_SERVER_LOG" 2>&1 &
  echo $! > "$YR_PID_FILE"
  yr_log "$LOG" "server: pid $(cat "$YR_PID_FILE")"
fi

# ── 10. Health wait (bounded) ────────────────────────────────────────────────
i=0; OK=0
while [ $i -lt 90 ]; do
  if yr_http_ok; then OK=1; break; fi
  # Fail fast if the server process died during startup.
  SPID="$(cat "$YR_PID_FILE" 2>/dev/null)"
  if [ -n "$SPID" ] && ! kill -0 "$SPID" 2>/dev/null; then
    yr_fail "$LOG" "The server process (pid $SPID) exited during startup. See $YR_SERVER_LOG"
  fi
  sleep 1; i=$((i+1))
done
[ "$OK" = "1" ] || yr_fail "$LOG" "The app did not become healthy on $YR_URL within 90s. See $YR_SERVER_LOG"

# ── 10b. Final identity gate — HTTP readiness is transport, not identity ─────
# The window opens ONLY for a service that passes the full ownership contract
# at current grade (singleton port owner, next shape, repo cwd, recorded-PID
# lineage, runtime commitSha == recorded built SHA == repository HEAD).
FINAL_OWNER="$(yr_port_owner | head -1)"
if ! yr_runtime_is_current "$FINAL_OWNER" "$CUR_SHA" "$CUR_BRANCH"; then
  yr_fail "$LOG" "Service on $YR_URL answered HTTP but FAILED the identity contract (pid ${FINAL_OWNER:-none}; failed:$YR_OWNERSHIP_FAIL). The window was NOT opened."
fi
IDENTITY="$(yr_runtime_identity | tr '\t' ' ')"
yr_log "$LOG" "health: OK after ${i}s; identity PROVEN (pid $FINAL_OWNER sha/ref: $IDENTITY)"

# ── 11. Open the standalone app window (ONLY after readiness + identity) ─────
open_window
yr_log "$LOG" "──────── YORISOU ready ($YR_URL) branch=$CUR_BRANCH sha=$CUR_SHA pid=$(cat "$YR_PID_FILE" 2>/dev/null || yr_port_owner | head -1) ────────"
exit 0
