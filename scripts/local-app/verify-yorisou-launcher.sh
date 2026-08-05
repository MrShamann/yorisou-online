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

# Optional live probe
if [ "${1:-}" = "--health" ]; then
  # shellcheck disable=SC1091
  [ -f "$ENVF" ] && . "$ENVF"
  host="${YORISOU_LOCAL_HOST:-127.0.0.1}"; port="${YORISOU_LOCAL_PORT:-3210}"
  code=$(/usr/bin/curl -s -o /dev/null -w '%{http_code}' --max-time 12 "http://$host:$port/" 2>/dev/null || echo 000)
  case "$code" in 2*|3*) ok "health: http://$host:$port/ answered $code" ;; *) bad "health: http://$host:$port/ answered $code" ;; esac
fi

exit $FAIL
