#!/bin/bash
# YORISOU LOCAL APP — one bounded operational snapshot.
#
# Captures what is useful when something goes wrong on this machine and nothing else. No plaintext
# secrets: local.env is fingerprinted, never copied. Bounded retention, because a snapshot directory
# that grows forever is an unpaid storage bill, not a safety net.
set -u
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$DIR/runtime-lib.sh"

yr_require_ssd
yr_make_runtime_tree

STAMP=$(date '+%Y%m%d-%H%M%S')
OUT="$YR_SNAPSHOTS/$STAMP"
mkdir -p "$OUT"

REL=$(yr_active_release_path 2>/dev/null || echo "(none)")
{
  echo "taken            $(yr_ts)"
  echo "runtime_root     $YR_ROOT"
  echo "active_release   $(yr_active_release_sha)"
  echo "current_target   $REL"
  echo "release_valid    $(yr_release_is_valid "$REL" && echo yes || echo no)"
  echo "recorded_pid     $(cat "$YR_PID_FILE" 2>/dev/null || echo none)"
  echo "port             $YR_PORT ($YR_HOST)"
  echo "port_owners      $(yr_port_owners | tr '\n' ' ')"
  echo "runtime_identity $(yr_runtime_release_sha 2>/dev/null || echo unreachable)"
  echo "app_bundle       $YR_APP_BUNDLE ($([ -d "$YR_APP_BUNDLE" ] && echo installed || echo absent))"
  # Fingerprint only. Knowing WHETHER the local env changed is the useful fact; its contents are not.
  if [ -f "$YR_ENV_FILE" ]; then
    echo "local_env        present sha256=$(shasum -a 256 "$YR_ENV_FILE" | cut -c1-16) keys=$(grep -c '^[A-Za-z_]*=' "$YR_ENV_FILE" 2>/dev/null || echo 0)"
  else
    echo "local_env        absent"
  fi
  echo "disk_free        $(df -h "$YR_VOLUME" 2>/dev/null | tail -1 | awk '{print $4}')"
} > "$OUT/runtime.txt"

# Device-local runtime data owned by this runtime, when there is any.
[ -d "$YR_DATA" ] && cp -R "$YR_DATA" "$OUT/data" 2>/dev/null || true

# Recent log tails, bounded. Full logs stay where they are.
mkdir -p "$OUT/logs"
for f in "$YR_APP_LOG" "$YR_SERVER_LOG"; do
  [ -f "$f" ] && tail -c 200000 "$f" > "$OUT/logs/$(basename "$f")" 2>/dev/null || true
done

# A verified local database would be dumped here through the repo's guarded tooling. It is not
# running, so this records that truth instead of producing an empty file that looks like a backup.
if command -v pg_isready >/dev/null 2>&1 && pg_isready -h 127.0.0.1 -p 55342 >/dev/null 2>&1; then
  echo "local supabase db reachable on 55342; use the repo's guarded tooling to dump it" > "$OUT/database.txt"
else
  echo "local supabase db not running — nothing to dump (LOCAL_DB_UNAVAILABLE)" > "$OUT/database.txt"
fi

ls -1dt "$YR_SNAPSHOTS"/* 2>/dev/null | tail -n +$((YR_KEEP_SNAPSHOTS + 1)) | while read -r old; do
  yr_log "snapshot: pruning $(basename "$old")"
  rm -rf "$old"
done

yr_log "snapshot: $OUT"
echo "$OUT"
