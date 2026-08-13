#!/bin/bash
# YORISOU LOCAL APP — shared runtime library.
#
# Every local-app script sources this. It owns three things and nothing else: where the runtime
# lives, whether a running process is OURS, and bounded logging.
#
# THE OWNERSHIP CONTRACT IS THE POINT OF THIS FILE. "Something is listening on 3210" is not
# "Yorisou is running" — a different Next app, a second checkout, or a script that returns a
# plausible JSON body all satisfy it. Treating the port as identity is how a launcher ends up
# killing someone else's process, so nothing here may stop, adopt, or trust a process on transport
# evidence alone.
#
# Adapted from the ownership model in PR #127, with the anchor changed: that version bound a process
# to the DEVELOPMENT REPOSITORY, which makes the Founder's app depend on whatever branch happens to
# be checked out. This binds to the immutable release the app actually serves.

set -u

# ── Paths ───────────────────────────────────────────────────────────────────────
# The SSD is a hard dependency, not a preference. YORISOU_RUNTIME_ROOT exists ONLY so the contract
# tests can exercise these paths without a mounted volume; it is never a fallback the app takes on
# its own, and `yr_require_ssd` refuses anything outside the volume unless a test opts in explicitly.
YR_VOLUME="${YORISOU_VOLUME:-/Volumes/AI-Work}"
YR_ROOT="${YORISOU_RUNTIME_ROOT:-$YR_VOLUME/Yorisou/runtime}"

YR_RELEASES="$YR_ROOT/releases"
YR_CURRENT="$YR_ROOT/current"
YR_CONFIG="$YR_ROOT/config"
YR_DATA="$YR_ROOT/data"
YR_LOGS="$YR_ROOT/logs"
YR_CACHE="$YR_ROOT/cache"
YR_STATE="$YR_ROOT/state"
YR_SNAPSHOTS="$YR_ROOT/snapshots"

YR_ENV_FILE="$YR_CONFIG/local.env"
YR_PID_FILE="$YR_STATE/server.pid"
YR_RELEASE_FILE="$YR_STATE/active-release.sha"
YR_APP_LOG="$YR_LOGS/app.log"
YR_SERVER_LOG="$YR_LOGS/server.log"

YR_HOST="127.0.0.1"
YR_PORT="${YORISOU_LOCAL_PORT:-3210}"
YR_URL="http://$YR_HOST:$YR_PORT"

YR_APP_BUNDLE="${YORISOU_APP_BUNDLE:-$HOME/Applications/YORISOU.app}"
YR_BUNDLE_ID="jp.yorisou.local.app"

YR_LOG_MAX_BYTES=$(( 2 * 1024 * 1024 ))
YR_KEEP_RELEASES=3
YR_KEEP_SNAPSHOTS=5

# ── Logging ─────────────────────────────────────────────────────────────────────
yr_ts() { date '+%Y-%m-%dT%H:%M:%S%z'; }

# Rotate by size, keeping exactly one previous generation. Local logs are for diagnosing this
# machine, not an archive, and an unbounded log on a laptop eventually becomes the incident.
yr_rotate() {
  f="$1"
  [ -f "$f" ] || return 0
  sz=$(wc -c < "$f" 2>/dev/null | tr -d ' ')
  [ -n "$sz" ] && [ "$sz" -ge "$YR_LOG_MAX_BYTES" ] && mv -f "$f" "$f.1"
  return 0
}

# LOGGING NEVER CREATES THE RUNTIME TREE.
#
# It used to `mkdir -p "$YR_LOGS"`, which meant the SSD-missing failure path built the very fallback
# it was refusing: `yr_die` logs, logging created `<unmounted>/Yorisou/runtime/logs`, and a directory
# tree appeared on the internal disk at exactly the moment the guard was supposed to stop that. The
# contract test caught it. Only `yr_make_runtime_tree` — called by the installer — may create.
yr_log() {
  [ -d "$YR_LOGS" ] && yr_rotate "$YR_APP_LOG"
  [ -d "$YR_LOGS" ] && printf '%s %s\n' "$(yr_ts)" "$*" >> "$YR_APP_LOG" 2>/dev/null
  printf '%s\n' "$*"
  return 0
}

yr_die() { yr_log "FAIL: $*"; exit 1; }

# ── SSD guard ───────────────────────────────────────────────────────────────────
# Fail closed. The failure mode this prevents is silent and expensive: with the volume unplugged, a
# launcher that "helpfully" falls back to the internal disk builds a SECOND runtime the Founder does
# not know about, and their data then lives in two places that never reconcile.
yr_require_ssd() {
  if [ -n "${YORISOU_RUNTIME_ROOT:-}" ]; then
    # Explicit override: only ever set by the contract tests.
    [ -d "$(dirname "$YR_ROOT")" ] || mkdir -p "$(dirname "$YR_ROOT")" 2>/dev/null || true
    return 0
  fi
  [ -d "$YR_VOLUME" ] || yr_die "AI-Work volume is not mounted at $YR_VOLUME. Yorisou keeps its local runtime on that SSD and will not build a second copy on the internal disk. Connect the drive and start Yorisou again."
  touch "$YR_VOLUME/.yorisou-write-probe" 2>/dev/null || yr_die "AI-Work is mounted at $YR_VOLUME but not writable."
  rm -f "$YR_VOLUME/.yorisou-write-probe" 2>/dev/null || true
  return 0
}

yr_require_runtime_tree() {
  for d in "$YR_RELEASES" "$YR_CONFIG" "$YR_DATA" "$YR_LOGS" "$YR_CACHE" "$YR_STATE" "$YR_SNAPSHOTS"; do
    [ -d "$d" ] || yr_die "runtime tree incomplete: $d is missing. Run: npm run local-app:install"
  done
}

yr_make_runtime_tree() {
  mkdir -p "$YR_RELEASES" "$YR_DATA" "$YR_LOGS" "$YR_CACHE" "$YR_STATE" "$YR_SNAPSHOTS"
  mkdir -p "$YR_CONFIG"; chmod 700 "$YR_CONFIG" 2>/dev/null || true
}

# ── Active release ──────────────────────────────────────────────────────────────
yr_active_release_path() {
  [ -L "$YR_CURRENT" ] || return 1
  p=$(cd "$YR_CURRENT" 2>/dev/null && pwd -P) || return 1
  [ -n "$p" ] && [ -d "$p" ] || return 1
  printf '%s\n' "$p"
}

yr_active_release_sha() { cat "$YR_RELEASE_FILE" 2>/dev/null; }

# A release is usable only with a build present. `current` pointing at a half-installed or deleted
# release is a recoverable state, not a reason to serve something else.
yr_release_is_valid() {
  p="$1"
  [ -n "$p" ] && [ -d "$p" ] && [ -d "$p/.next" ] && [ -f "$p/package.json" ]
}

# ── Process facts ───────────────────────────────────────────────────────────────
yr_port_owners() { /usr/sbin/lsof -nP -iTCP:"$YR_PORT" -sTCP:LISTEN -t 2>/dev/null | sort -u; }
yr_proc_cmd()    { ps -p "$1" -o command= 2>/dev/null; }
yr_proc_ppid()   { ps -p "$1" -o ppid= 2>/dev/null | tr -d ' '; }
yr_proc_cwd()    { /usr/sbin/lsof -a -p "$1" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1; }
yr_alive()       { [ -n "${1:-}" ] && kill -0 "$1" 2>/dev/null; }

yr_identity_body() { /usr/bin/curl -s --max-time 8 "$YR_URL/api/build-identity" 2>/dev/null; }

# The LOCAL release sha the running server reports. Empty when the endpoint is unreachable or the
# body carries no local release identity — which is how a foreign HTTP 200, including one that fakes
# a hosted-looking payload, fails this fact.
yr_runtime_release_sha() {
  body=$(yr_identity_body); [ -n "$body" ] || return 1
  sha=$(printf '%s' "$body" \
    | tr -d '\n ' \
    | sed -n 's/.*"localRelease":{"sha":"\([0-9a-f]\{7,40\}\)".*/\1/p' | head -1)
  [ -n "$sha" ] || return 1
  printf '%s\n' "$sha"
}

yr_pid_is_port_owner()  { [ -n "${1:-}" ] && yr_port_owners | grep -qx "$1"; }
yr_pid_is_node_server() {
  case "$(yr_proc_cmd "$1")" in *next-server*|*node*next*start*|*node*server.js*) return 0 ;; esac
  return 1
}
yr_pid_cwd_is_release() {
  cwd=$(yr_proc_cwd "$1"); [ -n "$cwd" ] || return 1
  want=$(yr_active_release_path) || return 1
  got=$(cd "$cwd" 2>/dev/null && pwd -P) || return 1
  [ "$got" = "$want" ]
}
yr_pid_matches_recorded() {
  rec=$(cat "$YR_PID_FILE" 2>/dev/null); [ -n "$rec" ] || return 1
  [ "$1" = "$rec" ] && return 0
  [ "$(yr_proc_ppid "$1")" = "$rec" ] && return 0
  return 1
}

# ── Ownership contract ──────────────────────────────────────────────────────────
# ALL SIX facts must hold. Each is separately probeable so the contract test can exercise them one
# at a time, and every failure is named — a stop that cannot say WHY it refused is a stop nobody
# trusts, and the next person just runs `kill -9` instead.
YR_OWNERSHIP_FAIL=""
yr_runtime_is_ours() {
  pid="${1:-}"; YR_OWNERSHIP_FAIL=""
  n=$(yr_port_owners | grep -c . || true)
  [ "$n" = "1" ]                  || YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL port_owner_count=$n"
  yr_alive "$pid"                 || YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL pid_not_alive"
  yr_pid_is_port_owner "$pid"     || YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL pid_not_port_owner"
  yr_pid_is_node_server "$pid"    || YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL not_node_server_shape"
  yr_pid_cwd_is_release "$pid"    || YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL cwd_not_active_release"
  yr_pid_matches_recorded "$pid"  || YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL pid_not_recorded_lineage"
  rec=$(yr_active_release_sha)
  run=$(yr_runtime_release_sha 2>/dev/null || true)
  if [ -z "$run" ]; then
    YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL no_local_release_identity"
  elif [ "$run" != "$rec" ]; then
    YR_OWNERSHIP_FAIL="$YR_OWNERSHIP_FAIL release_identity_mismatch(runtime=$run recorded=$rec)"
  fi
  [ -z "$YR_OWNERSHIP_FAIL" ]
}

# The recorded PID, when it is alive AND ours. Empty otherwise — including when a foreign process
# holds the port, which is a refusal, never an adoption.
yr_owned_pid() {
  rec=$(cat "$YR_PID_FILE" 2>/dev/null)
  [ -n "$rec" ] || return 1
  yr_alive "$rec" || return 1
  yr_runtime_is_ours "$rec" || return 1
  printf '%s\n' "$rec"
}

yr_clear_stale_pid() {
  rec=$(cat "$YR_PID_FILE" 2>/dev/null) || return 0
  [ -n "$rec" ] || { rm -f "$YR_PID_FILE"; return 0; }
  if ! yr_alive "$rec"; then
    yr_log "clearing stale pid file (pid $rec is gone)"
    rm -f "$YR_PID_FILE"
  fi
  return 0
}

# ── Readiness ───────────────────────────────────────────────────────────────────
# Poll for the identity the launcher expects, never a fixed sleep. A sleep proves elapsed time; it
# is the reason a launcher opens a window onto a server that is not up yet.
yr_wait_ready() {
  want="$1"; deadline=$(( $(date +%s) + ${2:-90} ))
  while [ "$(date +%s)" -lt "$deadline" ]; do
    got=$(yr_runtime_release_sha 2>/dev/null || true)
    [ -n "$got" ] && [ "$got" = "$want" ] && return 0
    sleep 0.4
  done
  return 1
}
