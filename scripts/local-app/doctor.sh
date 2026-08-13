#!/bin/bash
# YORISOU LOCAL APP — one diagnostic command.
#
# Safe metadata only: paths, SHAs, PIDs, booleans, sizes. Never a secret value, never the contents
# of local.env, never a token. This is the command a person runs when something is wrong, which is
# exactly when they are most likely to paste its output somewhere public.
set -u
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$DIR/runtime-lib.sh"

row() { printf '  %-26s %s\n' "$1" "$2"; }

echo "YORISOU local app — doctor"
echo

echo "SSD"
if [ -d "$YR_VOLUME" ]; then
  row "volume" "$YR_VOLUME (mounted)"
  row "free" "$(df -h "$YR_VOLUME" 2>/dev/null | tail -1 | awk '{print $4}')"
else
  row "volume" "$YR_VOLUME (NOT MOUNTED — the app will refuse to start)"
fi
row "runtime root" "$YR_ROOT"
echo

echo "Release"
if REL=$(yr_active_release_path 2>/dev/null); then
  row "current ->" "$REL"
  row "active sha" "$(yr_active_release_sha)"
  row "build present" "$(yr_release_is_valid "$REL" && echo yes || echo NO)"
else
  row "current ->" "(missing or broken symlink)"
fi
row "releases kept" "$(ls -1 "$YR_RELEASES" 2>/dev/null | wc -l | tr -d ' ')"
echo

echo "Runtime"
REC=$(cat "$YR_PID_FILE" 2>/dev/null || true)
row "recorded pid" "${REC:-none}"
if [ -n "$REC" ] && yr_alive "$REC"; then
  row "process" "alive"
  row "cwd" "$(yr_proc_cwd "$REC")"
  if yr_runtime_is_ours "$REC"; then
    row "ownership" "OURS (all six facts)"
  else
    row "ownership" "NOT OURS [$YR_OWNERSHIP_FAIL]"
  fi
else
  row "process" "not running"
fi
OWNERS=$(yr_port_owners)
row "port $YR_PORT" "${OWNERS:-free}"
row "bind" "$YR_HOST (loopback only)"
RUNSHA=$(yr_runtime_release_sha 2>/dev/null || true)
row "build identity" "${RUNSHA:-unreachable}"
echo

echo "Local data"
# Reported, never assumed. The local Supabase project pins its own ports precisely so a tool never
# talks to "whatever owned 54322"; if it is not up, the honest answer is that it is not up.
DBPORT=$(grep -A2 '^\[db\]' "$DIR/../../supabase/config.toml" 2>/dev/null | sed -n 's/^port *= *\([0-9]*\).*/\1/p' | head -1)
if [ -n "$DBPORT" ] && /usr/sbin/lsof -nP -iTCP:"$DBPORT" -sTCP:LISTEN -t >/dev/null 2>&1; then
  row "local supabase db" "listening on $DBPORT"
else
  row "local supabase db" "not running (port ${DBPORT:-unknown}) — LOCAL_DB_UNAVAILABLE"
fi
row "local.env" "$([ -f "$YR_ENV_FILE" ] && echo "present (contents never printed)" || echo "absent — core product does not need it")"
echo

echo "Storage"
row "logs" "$YR_LOGS"
row "log size" "$(du -sh "$YR_LOGS" 2>/dev/null | awk '{print $1}')"
row "cache" "$(du -sh "$YR_CACHE" 2>/dev/null | awk '{print $1}')"
row "releases" "$(du -sh "$YR_RELEASES" 2>/dev/null | awk '{print $1}')"
row "snapshots" "$(ls -1 "$YR_SNAPSHOTS" 2>/dev/null | wc -l | tr -d ' ') kept"
echo

echo "App bundle"
row "path" "$YR_APP_BUNDLE"
row "installed" "$([ -d "$YR_APP_BUNDLE" ] && echo yes || echo NO)"
if [ -f "$YR_APP_BUNDLE/Contents/Info.plist" ]; then
  row "bundle id" "$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$YR_APP_BUNDLE/Contents/Info.plist" 2>/dev/null)"
  row "icon" "$([ -f "$YR_APP_BUNDLE/Contents/Resources/yorisou.icns" ] && echo present || echo MISSING)"
fi
