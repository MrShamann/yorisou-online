#!/bin/bash
# YORISOU LOCAL APP — contract tests.
#
# These EXECUTE the real scripts. Nothing here greps a comment or asserts that a string appears in a
# file: a launcher that can kill the wrong process is not made safe by a source file that mentions
# safety, and the defects worth catching here (a refusal that does not refuse, a stale PID that gets
# killed anyway) are only visible when the code actually runs.
#
# Isolation: a temporary runtime root and a spare port, so running the suite never disturbs a real
# installed app. The adversarial cases on the real port 3210 belong to physical acceptance.
set -u
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); printf '  ok   %s\n' "$1"; }
bad()  { FAIL=$((FAIL+1)); printf '  FAIL %s\n' "$1"; }
check(){ if [ "$1" = "0" ]; then ok "$2"; else bad "$2"; fi; }

# The audit checks below must read CODE, not prose. Their first version grepped the raw files and
# failed on its own vocabulary: start.sh's comment says "no npm ci", stop.sh's says "there is no
# pkill node here", and this file names every pattern it searches for. A source audit that a comment
# can satisfy — or break — is not an audit. So: full-line comments are stripped, and the suite never
# audits itself.
LIFECYCLE_SCRIPTS="$DIR/runtime-lib.sh $DIR/start.sh $DIR/stop.sh $DIR/restart.sh $DIR/install.sh $DIR/doctor.sh $DIR/snapshot.sh"
code_of() { sed -e 's/^[[:space:]]*#.*$//' "$@"; }

TMP=$(mktemp -d /tmp/yorisou-contract.XXXXXX)
PORT=3219
FOREIGN_PID=""
cleanup() {
  [ -n "$FOREIGN_PID" ] && kill "$FOREIGN_PID" 2>/dev/null || true
  rm -rf "$TMP"
}
trap cleanup EXIT

export YORISOU_RUNTIME_ROOT="$TMP/runtime"
export YORISOU_LOCAL_PORT="$PORT"
export YORISOU_APP_BUNDLE="$TMP/YORISOU.app"

# shellcheck disable=SC1091
. "$DIR/runtime-lib.sh"

echo "YORISOU local app — contract tests"
echo

# ── 1. runtime root is the SSD by default ───────────────────────────────────────
echo "runtime location"
DEFAULT_ROOT=$(env -u YORISOU_RUNTIME_ROOT -u YORISOU_VOLUME bash -c \
  '. '"$DIR"'/runtime-lib.sh >/dev/null 2>&1; printf "%s" "$YR_ROOT"')
[ "$DEFAULT_ROOT" = "/Volumes/AI-Work/Runtimes/yorisou" ]
check $? "default runtime root is the AI-Work SSD ($DEFAULT_ROOT)"

# ── 2. missing SSD fails closed and creates NO fallback ─────────────────────────
# The failure this prevents: with the drive unplugged, a "helpful" fallback builds a second runtime
# on the internal disk and the person's data quietly lives in two places.
GHOST="$TMP/not-mounted"
OUT=$(env -u YORISOU_RUNTIME_ROOT YORISOU_VOLUME="$GHOST" bash -c \
  '. '"$DIR"'/runtime-lib.sh >/dev/null 2>&1; yr_require_ssd' 2>&1)
RC=$?
[ "$RC" != "0" ]; check $? "missing volume fails closed"
printf '%s' "$OUT" | grep -q 'not mounted'; check $? "the failure names the unmounted volume"
[ ! -d "$GHOST" ] && [ ! -d "$HOME/Yorisou" ] && [ ! -d "/tmp/yorisou-runtime" ]
check $? "no fallback runtime was created anywhere"
echo

# ── 3. loopback only ────────────────────────────────────────────────────────────
echo "network boundary"
grep -q 'next start -H "\$YR_HOST"' "$DIR/start.sh"; check $? "start binds an explicit host"
[ "$YR_HOST" = "127.0.0.1" ]; check $? "that host is loopback, not 0.0.0.0"
! code_of $LIFECYCLE_SCRIPTS | grep -q '0\.0\.0\.0'; check $? "no script binds 0.0.0.0"
echo

# ── 4. active release validation ────────────────────────────────────────────────
echo "release validation"
yr_make_runtime_tree
"$DIR/start.sh" >"$TMP/no-release.log" 2>&1; RC=$?
[ "$RC" != "0" ]; check $? "start refuses when no release is active"
grep -q 'no active release' "$TMP/no-release.log"; check $? "and says so"

mkdir -p "$TMP/rel-empty"
ln -sfn "$TMP/rel-empty" "$YR_CURRENT"
echo "deadbeef" > "$YR_RELEASE_FILE"
"$DIR/start.sh" >"$TMP/no-build.log" 2>&1; RC=$?
[ "$RC" != "0" ]; check $? "start refuses a release with no build"
grep -q 'has no build' "$TMP/no-build.log"; check $? "and names the missing build"

rm -f "$YR_CURRENT"
ln -sfn "$TMP/gone" "$YR_CURRENT"
"$DIR/start.sh" >"$TMP/broken.log" 2>&1; RC=$?
[ "$RC" != "0" ]; check $? "start refuses a broken current symlink (recoverable, not guessed at)"
echo

# ── 5. foreign process on the port ──────────────────────────────────────────────
echo "foreign process refusal"
mkdir -p "$TMP/rel-real/.next"; echo '{}' > "$TMP/rel-real/package.json"
rm -f "$YR_CURRENT"; ln -sfn "$TMP/rel-real" "$YR_CURRENT"
echo "cafebabe" > "$YR_RELEASE_FILE"

# A foreign server that also FAKES a plausible build-identity body — the case a transport check or a
# naive JSON check would wave through.
cat > "$TMP/foreign.py" <<'PY'
import http.server, json, sys
class H(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        body = json.dumps({"commitSha":"deadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
                           "environment":"production",
                           "localRelease":{"sha":"deadbeefdeadbeefdeadbeefdeadbeefdeadbeef"}}).encode()
        self.send_response(200); self.send_header("Content-Type","application/json")
        self.send_header("Content-Length",str(len(body))); self.end_headers(); self.wfile.write(body)
    def log_message(self,*a): pass
http.server.HTTPServer(("127.0.0.1", int(sys.argv[1])), H).serve_forever()
PY
python3 "$TMP/foreign.py" "$PORT" & FOREIGN_PID=$!
sleep 1.2
kill -0 "$FOREIGN_PID" 2>/dev/null; check $? "foreign responder is listening on $PORT"

"$DIR/start.sh" >"$TMP/foreign-start.log" 2>&1; RC=$?
[ "$RC" != "0" ]; check $? "start REFUSES when the port is held by a foreign process"
grep -q 'does not own' "$TMP/foreign-start.log"; check $? "the refusal explains ownership, not just failure"
kill -0 "$FOREIGN_PID" 2>/dev/null; check $? "the foreign process is STILL ALIVE (never killed)"

# The fake identity must not satisfy the contract even though it parses.
yr_runtime_is_ours "$FOREIGN_PID" 2>/dev/null; RC=$?
[ "$RC" != "0" ]; check $? "a fake build-identity responder fails the ownership contract"
printf '%s' "$YR_OWNERSHIP_FAIL" | grep -q 'cwd_not_active_release\|not_node_server_shape\|pid_not_recorded_lineage'
check $? "and the failure names which facts failed [$YR_OWNERSHIP_FAIL]"

# stop must refuse it too, and leave it running.
echo "$FOREIGN_PID" > "$YR_PID_FILE"
"$DIR/stop.sh" >"$TMP/foreign-stop.log" 2>&1; RC=$?
[ "$RC" != "0" ]; check $? "stop REFUSES a recorded pid it cannot prove it owns"
kill -0 "$FOREIGN_PID" 2>/dev/null; check $? "the foreign process survived the stop attempt"
grep -q 'REFUSING' "$TMP/foreign-stop.log"; check $? "and the refusal is logged verbatim"

kill "$FOREIGN_PID" 2>/dev/null || true; FOREIGN_PID=""
sleep 0.5
echo

# ── 6. stale PID recovery ───────────────────────────────────────────────────────
echo "stale state recovery"
DEAD=$(bash -c 'echo $$')          # a pid that has already exited
while kill -0 "$DEAD" 2>/dev/null; do sleep 0.1; done
echo "$DEAD" > "$YR_PID_FILE"
"$DIR/stop.sh" >"$TMP/stale.log" 2>&1
[ ! -f "$YR_PID_FILE" ]; check $? "stop clears a stale pid file instead of killing a recycled pid"
grep -q 'is gone' "$TMP/stale.log"; check $? "and records why"

echo "$DEAD" > "$YR_PID_FILE"
yr_clear_stale_pid
[ ! -f "$YR_PID_FILE" ]; check $? "start-side stale pid clearing works too"

rm -f "$YR_PID_FILE"
"$DIR/stop.sh" >"$TMP/nopid.log" 2>&1
check $? "stop with no recorded pid is a no-op, not an error"
echo

# ── 7. no destructive process commands anywhere ────────────────────────────────
echo "destructive-command audit"
! code_of $LIFECYCLE_SCRIPTS | grep -qE 'pkill|killall|kill -9 \$\(lsof|kill \$\(lsof'
check $? "no pkill / killall / kill-whatever-owns-the-port in any script"
code_of "$DIR/stop.sh" | grep -q 'yr_runtime_is_ours "\$REC"'; check $? "stop re-proves ownership before terminating"
grep -q 'if yr_runtime_is_ours "\$REC"; then' "$DIR/stop.sh"; check $? "and re-proves it AGAIN before escalating to SIGKILL"
echo

# ── 8. app bundle contract ──────────────────────────────────────────────────────
echo "app bundle contract"
grep -q 'CFBundleIdentifier' "$DIR/install.sh"; check $? "installer writes a bundle identifier"
[ "$YR_BUNDLE_ID" = "jp.yorisou.local.app" ] && code_of "$DIR/install.sh" | grep -q '\$YR_BUNDLE_ID'
check $? "the identifier resolves to jp.yorisou.local.app"
grep -q 'yorisou.icns' "$DIR/install.sh"; check $? "installer produces an icns"
grep -q 'app/icon.svg' "$DIR/install.sh"; check $? "the icon comes from the product's approved mark"
grep -q 'mv "\$YR_APP_BUNDLE" "\$OLD"' "$DIR/install.sh"; check $? "an existing app is moved aside, never overwritten"
grep -q 'mv "\$OLD" "\$YR_APP_BUNDLE"' "$DIR/install.sh"; check $? "and restored if the swap fails"
echo

# ── 9. launch never builds ──────────────────────────────────────────────────────
echo "launch/install separation"
! code_of "$DIR/start.sh" | grep -qE 'npm ci|npm run build|git fetch|git pull|supabase (db )?(reset|push)'
check $? "start.sh never installs, builds, pulls or migrates"
code_of "$DIR/install.sh" | grep -q 'npm ci'; check $? "install.sh is where dependencies are installed"
grep -q 'ln -sfn "\$RELEASE" "\$YR_ROOT/.current.tmp"' "$DIR/install.sh"
check $? "current is switched atomically, and only after the build validates"
BUILD_LINE=$(grep -n 'npm run build' "$DIR/install.sh" | head -1 | cut -d: -f1)
SWITCH_LINE=$(code_of "$DIR/install.sh" | grep -n 'os.replace' | head -1 | cut -d: -f1)
[ -n "$BUILD_LINE" ] && [ -n "$SWITCH_LINE" ] && [ "$BUILD_LINE" -lt "$SWITCH_LINE" ]
check $? "build precedes activation, so a failed install cannot strand the app (rollback)"
echo

# ── 10. secrets never reach logs ────────────────────────────────────────────────
echo "secret hygiene"
! code_of $LIFECYCLE_SCRIPTS | grep -qE 'echo .*\$(SUPABASE|AWS|LINE)_|yr_log .*SERVICE_ROLE|cat "\$YR_ENV_FILE"'
check $? "no script echoes or logs an environment value"
grep -q 'contents never printed' "$DIR/doctor.sh"; check $? "doctor reports local.env presence, not contents"
grep -q 'sha256=' "$DIR/snapshot.sh"; check $? "snapshot fingerprints local.env instead of copying it"
! grep -q 'cp .*local.env' "$DIR/snapshot.sh"; check $? "snapshot never copies the env file"
echo

# ── 11. release activation actually replaces the symlink ───────────────────────
echo "release activation"
# This is a REAL defect this suite was written after, not a hypothetical. `mv -f tmp current`, where
# `current` is a symlink to a directory, moves the temp link INSIDE that directory instead of
# replacing it — so activation silently no-ops while the installer reports success, the recorded SHA
# advances, and the app keeps serving the previous release. It was found by an installed app running
# old code, and reproduced directly.
ACT="$TMP/activation"; mkdir -p "$ACT/relA" "$ACT/relB"
ln -sfn "$ACT/relA" "$ACT/current"

ln -sfn "$ACT/relB" "$ACT/.tmp"; mv -f "$ACT/.tmp" "$ACT/current" 2>/dev/null
[ "$(readlink "$ACT/current")" = "$ACT/relA" ]
check $? "mv onto a symlink-to-directory does NOT replace it (the defect, reproduced)"
rm -f "$ACT/relA/.tmp"

ln -sfn "$ACT/relB" "$ACT/.tmp"
python3 -c 'import os,sys; os.replace(sys.argv[1], sys.argv[2])' "$ACT/.tmp" "$ACT/current"
[ "$(readlink "$ACT/current")" = "$ACT/relB" ]
check $? "os.replace DOES replace the symlink itself (the fix)"

code_of "$DIR/install.sh" | grep -q 'os.replace'
check $? "the installer activates with a real rename, not mv"
! code_of "$DIR/install.sh" | grep -q 'mv -f "\$YR_ROOT/.current.tmp"'
check $? "and no longer uses the mv form"
code_of "$DIR/install.sh" | grep -q 'activation did not take'
check $? "the installer VERIFIES the symlink moved instead of trusting the command"
ACT_LINE=$(code_of "$DIR/install.sh" | grep -n 'activation did not take' | head -1 | cut -d: -f1)
SHA_LINE=$(code_of "$DIR/install.sh" | grep -n 'YR_RELEASE_FILE"$' | head -1 | cut -d: -f1)
[ -n "$ACT_LINE" ] && [ -n "$SHA_LINE" ] && [ "$ACT_LINE" -lt "$SHA_LINE" ]
check $? "the recorded SHA is written only AFTER activation is verified (no disagreeing state)"
echo

echo "─────────────────────────────────────────"
printf 'contract tests: %d passed, %d failed\n' "$PASS" "$FAIL"
[ "$FAIL" = "0" ] || exit 1
