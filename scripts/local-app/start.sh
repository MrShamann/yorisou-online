#!/bin/bash
# YORISOU LOCAL APP — start the owned runtime.
#
# NORMAL LAUNCH NEVER BUILDS. No npm ci, no next build, no git fetch, no migrations. Those belong to
# install/update. A launcher that builds on every double-click turns a two-second app into a
# two-minute one and, worse, can change what the Founder is looking at without them asking.
#
# This serves the already-accepted release at `runtime/current` and nothing else.
set -u
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$DIR/runtime-lib.sh"

yr_require_ssd
yr_require_runtime_tree

RELEASE=$(yr_active_release_path) || yr_die "no active release. Run: npm run local-app:install"
yr_release_is_valid "$RELEASE"    || yr_die "active release at $RELEASE has no build. Run: npm run local-app:install"
SHA=$(yr_active_release_sha)
[ -n "$SHA" ] || yr_die "active release sha is unknown ($YR_RELEASE_FILE missing)."

yr_clear_stale_pid

# Already running and provably ours: reuse it. Double-clicking the app twice must not bind a second
# server — see §35. Reuse requires the full contract, not a health check.
if EXISTING=$(yr_owned_pid 2>/dev/null); then
  yr_log "reusing owned runtime pid=$EXISTING release=$SHA"
  printf '%s\n' "$EXISTING"
  exit 0
fi

# The port is busy but the process is not ours. Refuse. Do not kill it, do not adopt it, do not pick
# another port — a second Yorisou on 3211 is exactly the "two runtimes, one dataset" outcome the SSD
# guard also exists to prevent.
OWNERS=$(yr_port_owners)
if [ -n "$OWNERS" ]; then
  for p in $OWNERS; do
    yr_log "port $YR_PORT held by pid $p: $(yr_proc_cmd "$p" | head -c 200)"
  done
  yr_runtime_is_ours "$(printf '%s' "$OWNERS" | head -1)" 2>/dev/null || true
  yr_die "port $YR_PORT is held by a process Yorisou does not own [$YR_OWNERSHIP_FAIL]. Yorisou will not stop another program. Free the port and try again."
fi

yr_rotate "$YR_SERVER_LOG"

# Local runtime environment. The core product needs no credentials at all — with no shared-store
# bucket the store boundary resolves to local-development — so an absent local.env is normal, not a
# degraded mode. It is sourced when present so a Founder can add local-only settings later.
set -a
# shellcheck disable=SC1090
[ -f "$YR_ENV_FILE" ] && . "$YR_ENV_FILE"
set +a

export NODE_ENV=production
export HOSTNAME="$YR_HOST"
export PORT="$YR_PORT"
export npm_config_cache="$YR_CACHE/npm"
# Local release identity, read back through /api/build-identity to prove which code is serving.
export YORISOU_LOCAL_RELEASE_SHA="$SHA"
export YORISOU_LOCAL_RELEASE_PATH="$RELEASE"

yr_log "starting release $SHA at $RELEASE on $YR_URL"
cd "$RELEASE" || yr_die "cannot enter release $RELEASE"

# Loopback only. `next start -H 127.0.0.1` binds the loopback interface, so the local app is not
# reachable from the LAN.
nohup node node_modules/next/dist/bin/next start -H "$YR_HOST" -p "$YR_PORT" \
  >> "$YR_SERVER_LOG" 2>&1 &
PID=$!
printf '%s\n' "$PID" > "$YR_PID_FILE"

if ! yr_wait_ready "$SHA" 90; then
  yr_log "runtime did not report release $SHA within 90s; see $YR_SERVER_LOG"
  if yr_alive "$PID" && yr_pid_is_port_owner "$PID"; then kill "$PID" 2>/dev/null || true; fi
  rm -f "$YR_PID_FILE"
  yr_die "Yorisou did not become ready. Log: $YR_SERVER_LOG"
fi

if ! yr_runtime_is_ours "$PID"; then
  yr_log "started process failed the ownership contract [$YR_OWNERSHIP_FAIL]"
  kill "$PID" 2>/dev/null || true
  rm -f "$YR_PID_FILE"
  yr_die "Yorisou started something it could not verify as its own. Nothing was left running."
fi

yr_log "ready pid=$PID release=$SHA url=$YR_URL"
printf '%s\n' "$PID"
