#!/bin/bash
# YORISOU local launcher — shared library (LOCAL-LAUNCHER-REFRESH-1; dev-only, NOT production).
# Sourced by start/stop/verify/install. macOS bash 3.2 compatible.
#
# Contract (docs/local-app/LOCAL_LAUNCHER_REFRESH_1.md):
#   - owns 127.0.0.1:3210 and nothing else (never 3220/3230, never unrelated node/docker)
#   - fail-closed: the browser window opens only after HTTP readiness
#   - schema validation is fatal; branch mismatch is a warning
#   - no secrets are ever logged

YR_LAUNCHER_VERSION="2.1.0-llr1"

# A .app launched from Finder/Dock gets a minimal PATH — set an explicit one so
# colima/docker/supabase (/opt/homebrew) and node (/usr/local) are always found.
export PATH="/usr/local/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/bin:/bin:/usr/sbin:/sbin"

YR_NODE="/usr/local/bin/node"
YR_NPM="/usr/local/bin/npm"
[ -x "$YR_NODE" ] || YR_NODE="$(command -v node 2>/dev/null)"
[ -x "$YR_NPM" ]  || YR_NPM="$(command -v npm 2>/dev/null)"

# Native-architecture enforcement. A Finder/Dock launch can run this script under
# Rosetta translation, and a translated node builds against the WRONG native
# binaries (x64 swc/lightningcss against an arm64-installed node_modules — the
# exact failure that broke the first refreshed launch). hw.optional.arm64 is 1
# on Apple Silicon even inside Rosetta, unlike uname -m.
YR_ARCH_PREFIX=""
if [ "$(sysctl -n hw.optional.arm64 2>/dev/null)" = "1" ] && [ -x /usr/bin/arch ]; then
  YR_ARCH_PREFIX="/usr/bin/arch -arm64"
fi
yr_arch_facts() {
  printf 'machine=%s translated=%s node=%s node_arch=%s' \
    "$(uname -m)" "$(sysctl -n sysctl.proc_translated 2>/dev/null || echo 0)" \
    "$($YR_ARCH_PREFIX "$YR_NODE" --version 2>/dev/null)" \
    "$($YR_ARCH_PREFIX "$YR_NODE" -p process.arch 2>/dev/null)"
}

YR_APPSUP="$HOME/Library/Application Support/YORISOU"
YR_LOGS="$HOME/Library/Logs/YORISOU"
YR_RUN="$YR_APPSUP/run"
YR_ENV="$YR_APPSUP/yorisou.env.local"
YR_CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
YR_CHROME_PROFILE="$YR_APPSUP/chrome-profile"
YR_DB_CONTAINER="supabase_db_yorisou-online"

# Required log files (§9): launcher.log, server.log, migration.log, stop.log.
YR_LAUNCHER_LOG="$YR_LOGS/launcher.log"
YR_SERVER_LOG="$YR_LOGS/server.log"
YR_MIGRATION_LOG="$YR_LOGS/migration.log"
YR_STOP_LOG="$YR_LOGS/stop.log"

mkdir -p "$YR_RUN" "$YR_LOGS" >/dev/null 2>&1

# Load local config (never committed; may hold local-only secrets — values are
# consumed by the server process and MUST NOT be echoed into any log).
if [ -f "$YR_ENV" ]; then
  # shellcheck disable=SC1090
  . "$YR_ENV"
fi
: "${YORISOU_LOCAL_PORT:=3210}"
: "${YORISOU_LOCAL_HOST:=127.0.0.1}"
: "${YORISOU_REPO:=/Users/yangjin/Projects/yorisou-online}"
YR_URL="http://${YORISOU_LOCAL_HOST}:${YORISOU_LOCAL_PORT}"
YR_PID_FILE="$YR_RUN/next.pid"
YR_BUILD_IDENTITY="$YR_RUN/build-identity.json"

yr_ts() { date '+%Y-%m-%d %H:%M:%S'; }

# Bounded rotation: keep the live file under ~2MB, one rotated generation.
yr_rotate() {
  f="$1"
  if [ -f "$f" ]; then
    sz=$(stat -f%z "$f" 2>/dev/null || echo 0)
    if [ "$sz" -gt 2000000 ]; then mv -f "$f" "$f.1" 2>/dev/null || true; fi
  fi
}

# yr_log <logfile> <message...>
yr_log() {
  f="$1"; shift
  yr_rotate "$f"
  printf '%s  %s\n' "$(yr_ts)" "$*" >> "$f"
  printf '%s  %s\n' "$(yr_ts)" "$*"
}

yr_dialog() {
  /usr/bin/osascript >/dev/null 2>&1 <<OSA || true
tell application "System Events"
  activate
  display dialog "$1" with title "YORISOU" buttons {"OK"} default button 1 with icon caution
end tell
OSA
}

# yr_fail <logfile> <message> — log, surface a dialog, exit non-zero. Fail-closed:
# callers must invoke this BEFORE any browser window is opened.
yr_fail() {
  f="$1"; shift
  yr_log "$f" "ERROR: $*"
  yr_dialog "YORISOU could not start:

$*

Log: $f"
  exit 1
}

# TRANSPORT check only. yr_http_ok proves that SOMETHING answered on the port.
# It must never, by itself, prove application identity, process ownership, build
# identity, safe browser opening, or safe termination — that is what the
# ownership contract below is for.
yr_http_ok() {
  code=$(/usr/bin/curl -s -o /dev/null -w '%{http_code}' --max-time 12 "$YR_URL/" 2>/dev/null || echo 000)
  case "$code" in 2*|3*) return 0 ;; *) return 1 ;; esac
}

# PIDs listening on the launcher port (empty if free).
yr_port_owner() {
  /usr/sbin/lsof -nP -iTCP:"$YORISOU_LOCAL_PORT" -sTCP:LISTEN -t 2>/dev/null | sort -u
}

# ── Ownership contract (LOCAL-LAUNCHER-REFRESH-1 remediation) ────────────────
# A running service is accepted as the launcher's own CURRENT service only when
# ALL of these facts hold:
#   1. exactly one process owns 127.0.0.1:$YORISOU_LOCAL_PORT
#   2. that process is a Node/Next production server
#   3. its working directory resolves to $YORISOU_REPO
#   4. it is consistent with the recorded launcher PID (same PID or its child)
#   5. GET /api/build-identity succeeds
#   6. runtime commitSha equals the RECORDED built SHA (written at build time —
#      a caller-supplied label is never identity proof)
#   7. (current-grade only) the recorded built SHA equals the repository HEAD
#   8. (current-grade only) runtime commitRef is consistent with the branch
# The low-level probes are separate functions so the contract test can exercise
# each fact in isolation.

yr_proc_cmd()  { ps -p "$1" -o command= 2>/dev/null; }
yr_proc_ppid() { ps -p "$1" -o ppid= 2>/dev/null | tr -d ' '; }
yr_proc_cwd()  { /usr/sbin/lsof -a -p "$1" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1; }
yr_fetch_identity() { /usr/bin/curl -s --max-time 8 "$YR_URL/api/build-identity" 2>/dev/null; }

yr_pid_listens_on_launcher_port() {
  [ -n "$1" ] && yr_port_owner | grep -qx "$1"
}

yr_pid_cwd_matches_repo() {
  cwd=$(yr_proc_cwd "$1"); [ -n "$cwd" ] || return 1
  want=$(cd "$YORISOU_REPO" 2>/dev/null && pwd -P); got=$(cd "$cwd" 2>/dev/null && pwd -P)
  [ -n "$want" ] && [ "$got" = "$want" ]
}

# Process shape: a Node/Next production server. Name is ONE conjunct of the
# contract, never sufficient alone — a next-server from another repository must
# still fail the cwd, lineage, and identity facts.
yr_pid_is_next_shape() {
  cmd=$(yr_proc_cmd "$1")
  case "$cmd" in *next-server*|*node*next*start*) return 0 ;; esac
  return 1
}

yr_pid_lineage_matches_recorded() {
  rec=$(cat "$YR_PID_FILE" 2>/dev/null); [ -n "$rec" ] || return 1
  [ "$1" = "$rec" ] && return 0
  [ "$(yr_proc_ppid "$1")" = "$rec" ] && return 0
  return 1
}

# Prints "sha<TAB>ref" from the RUNNING service's /api/build-identity; fails when
# the endpoint is unreachable or the body carries no parseable commitSha (a
# foreign HTTP 200 fails here even if it fakes the transport check).
yr_runtime_identity() {
  body=$(yr_fetch_identity); [ -n "$body" ] || return 1
  sha=$(printf '%s' "$body" | sed -n 's/.*"commitSha"[[:space:]]*:[[:space:]]*"\([0-9a-f]\{7,40\}\)".*/\1/p' | head -1)
  ref=$(printf '%s' "$body" | sed -n 's/.*"commitRef"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)
  [ -n "$sha" ] || return 1
  printf '%s\t%s\n' "$sha" "$ref"
}

yr_runtime_identity_matches_build() {
  rec=$(yr_recorded_build_sha); [ -n "$rec" ] || return 1
  idr=$(yr_runtime_identity) || return 1
  [ "${idr%%	*}" = "$rec" ]
}

# Ownership (stop-grade) proof for one PID. On failure, YR_OWNERSHIP_FAIL names
# every fact that failed — stop and start log it verbatim.
YR_OWNERSHIP_FAIL=""
yr_runtime_is_ours() {
  pid="$1"; YR_OWNERSHIP_FAIL=""
  owners=$(yr_port_owner); n=$(printf '%s\n' "$owners" | grep -c .)
  [ "$n" = "1" ] || YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL port_owner_count=$n"
  yr_pid_listens_on_launcher_port "$pid" || YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL pid_not_port_owner"
  yr_pid_is_next_shape "$pid"            || YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL not_next_server_shape"
  yr_pid_cwd_matches_repo "$pid"         || YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL cwd_not_repo"
  yr_pid_lineage_matches_recorded "$pid" || YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL lineage_not_recorded_pid"
  yr_runtime_identity_matches_build      || YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL runtime_identity_ne_recorded_build"
  [ -z "$YR_OWNERSHIP_FAIL" ]
}

# Current-grade proof: ours AND built from the current repository HEAD, with a
# consistent branch ref. Only this grade may open the browser window or take the
# "already healthy" fast path.
yr_runtime_is_current() {
  pid="$1"; cur_sha="$2"; cur_branch="$3"
  yr_runtime_is_ours "$pid" || return 1
  rec=$(yr_recorded_build_sha)
  if [ "$rec" != "$cur_sha" ]; then
    YR_OWNERSHIP_FAIL="recorded_build_sha_ne_repo_head(recorded=${rec:-none})"
    return 1
  fi
  idr=$(yr_runtime_identity) || { YR_OWNERSHIP_FAIL="runtime_identity_unavailable"; return 1; }
  ref="${idr#*	}"
  if [ -n "$ref" ] && [ "$ref" != "null" ] && [ -n "$cur_branch" ] && [ "$ref" != "$cur_branch" ]; then
    YR_OWNERSHIP_FAIL="runtime_ref_mismatch($ref != $cur_branch)"
    return 1
  fi
  return 0
}

yr_colima_up()  { colima status >/dev/null 2>&1; }
yr_supabase_up() { docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^${YR_DB_CONTAINER}\$"; }

yr_psql() {
  docker exec -i "$YR_DB_CONTAINER" psql -U postgres -d postgres -v ON_ERROR_STOP=1 -tAc "$1" 2>/dev/null
}

yr_pg_version() { yr_psql "show server_version;" | head -1; }

# Migration readiness (§7): every migration FILE version in the repo must be
# recorded as applied in supabase_migrations.schema_migrations. Prints missing
# versions (one per line); empty output + rc 0 means ready.
yr_missing_migrations() {
  files=$(ls "$YORISOU_REPO/supabase/migrations/" 2>/dev/null | grep -E '\.sql$' | sed -E 's/_.*//' | sort -u)
  [ -n "$files" ] || { echo "NO_MIGRATION_FILES"; return 1; }
  applied=$(yr_psql "select version from supabase_migrations.schema_migrations order by version;")
  missing=""
  for v in $files; do
    if ! printf '%s\n' "$applied" | grep -qx "$v"; then missing="$missing $v"; fi
  done
  if [ -n "$missing" ]; then printf '%s\n' $missing; return 1; fi
  return 0
}

# Database catalogue readiness (§7): the canonical tables the current branch
# requires. A missing required schema is FATAL (never a warning).
YR_REQUIRED_TABLES="yorisou_assessment_attempts yorisou_assessment_results yorisou_interpretation_responses yorisou_canonical_line_subjects yorisou_canonical_identity_links yorisou_identity_provisioning_sagas yorisou_account_deletion_jobs yorisou_account_mutation_gates"
yr_missing_tables() {
  missing=""
  for t in $YR_REQUIRED_TABLES; do
    got=$(yr_psql "select to_regclass('public.${t}');")
    [ "$got" = "public.$t" ] || [ "$got" = "$t" ] || missing="$missing $t"
  done
  if [ -n "$missing" ]; then printf '%s\n' $missing; return 1; fi
  return 0
}

# Build identity — the SHA the .next build was actually produced from. Recorded
# by the launcher at build time; a caller-supplied label is never proof.
yr_recorded_build_sha() {
  [ -f "$YR_BUILD_IDENTITY" ] || return 1
  sed -n 's/.*"commitSha"[[:space:]]*:[[:space:]]*"\([0-9a-f]*\)".*/\1/p' "$YR_BUILD_IDENTITY" | head -1
}

yr_write_build_identity() {
  sha="$1"; build_id="$2"
  printf '{\n  "commitSha": "%s",\n  "buildId": "%s",\n  "builtAt": "%s",\n  "launcherVersion": "%s"\n}\n' \
    "$sha" "$build_id" "$(yr_ts)" "$YR_LAUNCHER_VERSION" > "$YR_BUILD_IDENTITY"
}
