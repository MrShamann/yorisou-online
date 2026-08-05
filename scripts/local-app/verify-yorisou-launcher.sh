#!/bin/bash
# YORISOU local launcher — read-only installation verifier (LOCAL-LAUNCHER-REFRESH-1).
# Checks structure and configuration only. With --health it also probes the
# configured origin over HTTP. Never mutates anything; exit 0 = all checks pass.

APPSUP="$HOME/Library/Application Support/YORISOU"
LOGS="$HOME/Library/Logs/YORISOU"
APPS="$HOME/Applications"
FAIL=0

ok()   { printf 'PASS  %s\n' "$*"; }
bad()  { printf 'FAIL  %s\n' "$*"; FAIL=1; }

# Bundles
for pair in "YORISOU:jp.yorisou.local.app:YORISOU" "Stop YORISOU:jp.yorisou.local.stop:StopYORISOU"; do
  name="${pair%%:*}"; rest="${pair#*:}"; bid="${rest%%:*}"; exe="${rest#*:}"
  b="$APPS/$name.app"
  if [ -d "$b" ]; then ok "bundle exists: $b"; else bad "bundle missing: $b"; continue; fi
  got_bid=$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$b/Contents/Info.plist" 2>/dev/null)
  [ "$got_bid" = "$bid" ] && ok "bundle id: $got_bid" || bad "bundle id: expected $bid got ${got_bid:-none}"
  [ -x "$b/Contents/MacOS/$exe" ] && ok "executable stub: $exe" || bad "executable stub missing/not executable: $exe"
  [ -f "$b/Contents/Resources/yorisou.icns" ] && ok "icon present: $name" || bad "icon missing: $name"
done

# Scripts
for f in yorisou-launcher-lib.sh start-yorisou.sh stop-yorisou.sh verify-yorisou-launcher.sh; do
  [ -x "$APPSUP/bin/$f" ] && ok "script installed: bin/$f" || bad "script missing/not executable: bin/$f"
done
for f in yorisou-common.sh seed-accounts.sh; do
  [ -e "$APPSUP/bin/$f" ] && bad "obsolete script still present: bin/$f" || ok "obsolete script absent: bin/$f"
done

# Environment
ENVF="$APPSUP/yorisou.env.local"
if [ -f "$ENVF" ]; then
  ok "env file exists"
  perms=$(stat -f%Lp "$ENVF" 2>/dev/null)
  [ "$perms" = "600" ] && ok "env file permissions 600" || bad "env file permissions are $perms (want 600)"
  grep -qE '^YORISOU_EXPECTED_BRANCH="feat/aix-1-ai-native-experience"' "$ENVF" \
    && bad "env still pins the retired branch feat/aix-1-ai-native-experience" \
    || ok "no retired branch pin"
else
  bad "env file missing: $ENVF"
fi

# Logs
for f in launcher.log server.log migration.log stop.log; do
  [ -f "$LOGS/$f" ] && ok "log present: $f" || bad "log missing: $LOGS/$f"
done

# Optional live probe. --health reports each identity fact separately and fails
# when HTTP answers but the service is not the launcher's own current YORISOU —
# "some HTTP server answered" is a transport fact, never an identity result.
if [ "${1:-}" = "--health" ]; then
  # shellcheck disable=SC1091
  . "$APPSUP/bin/yorisou-launcher-lib.sh"
  code=$(/usr/bin/curl -s -o /dev/null -w '%{http_code}' --max-time 12 "$YR_URL/" 2>/dev/null || echo 000)
  case "$code" in
    2*|3*) ok "http reachability: $YR_URL/ answered $code" ;;
    *)     bad "http reachability: $YR_URL/ answered $code" ;;
  esac
  OWNER=$(yr_port_owner | head -1)
  if [ -n "$OWNER" ]; then
    ok "port owner pid: $OWNER ($(yr_proc_cmd "$OWNER" | cut -c1-80))"
    yr_pid_is_next_shape "$OWNER"        && ok "process shape: Node/Next server"        || bad "process shape: not a Node/Next server"
    yr_pid_cwd_matches_repo "$OWNER"     && ok "repository cwd: matches $YORISOU_REPO"  || bad "repository cwd: does NOT match $YORISOU_REPO (got: $(yr_proc_cwd "$OWNER"))"
    yr_pid_lineage_matches_recorded "$OWNER" && ok "pid lineage: consistent with recorded launcher PID" || bad "pid lineage: NOT consistent with recorded launcher PID ($(cat "$YR_PID_FILE" 2>/dev/null || echo none))"
  else
    bad "port owner pid: none (nothing listening on $YORISOU_LOCAL_PORT)"
  fi
  RECORDED_SHA=$(yr_recorded_build_sha)
  [ -n "$RECORDED_SHA" ] && ok "recorded build identity: $RECORDED_SHA" || bad "recorded build identity: absent"
  RUNTIME_ID=$(yr_runtime_identity | tr '\t' ' ')
  [ -n "$RUNTIME_ID" ] && ok "runtime build identity: $RUNTIME_ID" || bad "runtime build identity: unavailable/unparseable"
  HEAD_SHA=$(git -C "$YORISOU_REPO" rev-parse HEAD 2>/dev/null)
  HEAD_BR=$(git -C "$YORISOU_REPO" rev-parse --abbrev-ref HEAD 2>/dev/null)
  [ -n "$HEAD_SHA" ] && ok "repository HEAD: $HEAD_SHA ($HEAD_BR)" || bad "repository HEAD: unresolvable"
  if [ -n "$OWNER" ] && yr_runtime_is_current "$OWNER" "$HEAD_SHA" "$HEAD_BR"; then
    ok "overall YORISOU identity: PROVEN (owned + current)"
  else
    bad "overall YORISOU identity: NOT PROVEN (failed:${YR_OWNERSHIP_FAIL:- no-owner})"
  fi
fi

exit $FAIL
