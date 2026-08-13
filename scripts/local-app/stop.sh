#!/bin/bash
# YORISOU LOCAL APP — stop the owned runtime, and only ever that.
#
# There is no `pkill node` here, and there never may be. The Founder's machine runs other Node
# processes; a launcher that stops "whatever holds the port" or "whatever looks like next-server"
# will eventually take down something that was not Yorisou, and the person will not connect that
# loss to having quit an app.
#
# So: re-prove ownership at stop time. A PID recorded five minutes ago may since have died and been
# reissued to something else, which is precisely when a blind `kill` does its damage.
set -u
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$DIR/runtime-lib.sh"

yr_require_ssd

REC=$(cat "$YR_PID_FILE" 2>/dev/null || true)
if [ -z "$REC" ]; then
  yr_log "stop: no recorded pid; nothing owned to stop"
  exit 0
fi

if ! yr_alive "$REC"; then
  yr_log "stop: recorded pid $REC is gone; clearing stale state"
  rm -f "$YR_PID_FILE"
  exit 0
fi

if ! yr_runtime_is_ours "$REC"; then
  # The recorded PID is alive but is no longer the process we started. Leave it strictly alone.
  yr_log "stop: REFUSING to stop pid $REC — ownership contract failed [$YR_OWNERSHIP_FAIL]"
  yr_log "stop: the recorded pid state is being cleared; the foreign process is untouched"
  rm -f "$YR_PID_FILE"
  yr_die "Yorisou will not stop pid $REC because it could not prove it owns it."
fi

yr_log "stop: terminating owned pid $REC"
kill -TERM "$REC" 2>/dev/null || true

deadline=$(( $(date +%s) + 15 ))
while [ "$(date +%s)" -lt "$deadline" ]; do
  yr_alive "$REC" || break
  sleep 0.3
done

# Escalate only if it is STILL the same owned process. Re-checking identity before SIGKILL is the
# whole reason this is safe: between TERM and KILL the PID can be recycled.
if yr_alive "$REC"; then
  if yr_runtime_is_ours "$REC"; then
    yr_log "stop: pid $REC ignored SIGTERM; escalating to SIGKILL (still verified as ours)"
    kill -KILL "$REC" 2>/dev/null || true
    sleep 0.5
  else
    yr_log "stop: pid $REC changed identity while stopping [$YR_OWNERSHIP_FAIL]; NOT escalating"
  fi
fi

rm -f "$YR_PID_FILE"

REMAIN=$(yr_port_owners)
if [ -z "$REMAIN" ]; then
  yr_log "stop: port $YR_PORT closed"
else
  # Something else is on the port now. Report it; never touch it.
  for p in $REMAIN; do yr_log "stop: port $YR_PORT now held by foreign pid $p (left running)"; done
fi
exit 0
