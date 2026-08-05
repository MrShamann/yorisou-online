#!/bin/bash
# YORISOU local launcher — stop (LOCAL-LAUNCHER-REFRESH-1; dev-only).
#
# Contract (§10): read the recorded PID, PROVE it belongs to the YORISOU server
# on 127.0.0.1:3210, terminate gracefully, bounded force only if necessary,
# clean stale PID/lock files. Never stops 3220/3230, unrelated node processes,
# Colima, or the shared local Supabase stack.

DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1090
. "$DIR/yorisou-launcher-lib.sh"

LOG="$YR_STOP_LOG"
yr_log "$LOG" "──────── YORISOU stop (launcher $YR_LAUNCHER_VERSION) ────────"

STOPPED=0
REFUSED=0
RECORDED="$(cat "$YR_PID_FILE" 2>/dev/null)"

stop_pid() {
  pid="$1"
  yr_log "$LOG" "stopping pid $pid (SIGTERM, bounded 20s)…"
  kill -TERM "$pid" 2>/dev/null
  i=0
  while [ $i -lt 20 ]; do
    kill -0 "$pid" 2>/dev/null || { yr_log "$LOG" "pid $pid exited gracefully after ${i}s"; return 0; }
    sleep 1; i=$((i+1))
  done
  yr_log "$LOG" "pid $pid did not exit in 20s — SIGKILL (bounded 10s)…"
  kill -KILL "$pid" 2>/dev/null
  i=0
  while [ $i -lt 10 ]; do
    kill -0 "$pid" 2>/dev/null || { yr_log "$LOG" "pid $pid terminated"; return 0; }
    sleep 1; i=$((i+1))
  done
  yr_log "$LOG" "ERROR: pid $pid survived SIGKILL window"
  return 1
}

# A stale DEAD pid file may be removed. A LIVE pid record is preserved when
# ownership validation fails — it is diagnostic evidence, not garbage.
if [ -n "$RECORDED" ] && ! kill -0 "$RECORDED" 2>/dev/null; then
  yr_log "$LOG" "recorded pid $RECORDED is already dead (stale PID file — removing)"
  rm -f "$YR_PID_FILE"
  RECORDED=""
fi

# Signal a port owner ONLY under the FULL ownership contract: alive, sole port
# owner, Next shape, cwd == configured repo, lineage consistent with the
# recorded launcher PID, and runtime build identity == recorded build identity.
# HTTP reachability and process name prove nothing by themselves.
for p in $(yr_port_owner); do
  if yr_runtime_is_ours "$p"; then
    stop_pid "$p" && STOPPED=1
  else
    REFUSED=1
    yr_log "$LOG" "REFUSING to signal port $YORISOU_LOCAL_PORT owner pid $p ($(yr_proc_cmd "$p" | cut -c1-120)) — failed ownership checks:$YR_OWNERSHIP_FAIL"
  fi
done

# Clean launcher-owned state files only after a proven stop; when ownership was
# refused, leave the PID record and lock evidence in place for diagnosis.
if [ "$REFUSED" = "0" ]; then
  rm -f "$YR_PID_FILE" 2>/dev/null
  rmdir "$YR_RUN/start.lock.d" 2>/dev/null
else
  yr_log "$LOG" "state files preserved for diagnosis (ownership was refused for at least one process)"
fi

REMAINING="$(yr_port_owner)"
if [ -z "$REMAINING" ]; then
  yr_log "$LOG" "port $YORISOU_LOCAL_PORT is closed"
else
  yr_log "$LOG" "port $YORISOU_LOCAL_PORT still owned by: $REMAINING (not ours — untouched)"
fi
yr_log "$LOG" "──────── stop complete (stopped_something=$STOPPED refused=$REFUSED) ────────"
[ "$REFUSED" = "0" ] || exit 1
exit 0
