#!/bin/bash
# YORISOU local launcher — ownership contract test (LOCAL-LAUNCHER-REFRESH-1
# remediation). Bounded, hermetic: the low-level probes are stubbed, no real
# process is started or signalled, no port is touched.
#
# Regressions this test exists to prevent:
#   R1  plain HTTP 200 accepted as ownership
#   R2  a generic next-server accepted solely because it owns the port
#   R3  the verifier passing without build identity
#   R4  stop signalling a foreign port owner
#   R5  the browser opening before identity verification

set -u
SRC="$(cd "$(dirname "$0")" && pwd)"
FAIL=0
ok()  { printf 'PASS  %s\n' "$*"; }
bad() { printf 'FAIL  %s\n' "$*"; FAIL=1; }

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/repo" "$TMP/other-repo" "$TMP/run"

# ── Functional: source the lib, then replace its probes with fixtures ─────────
# shellcheck disable=SC1091
. "$SRC/yorisou-launcher-lib.sh"

YORISOU_REPO="$TMP/repo"
YR_PID_FILE="$TMP/run/next.pid"
YR_BUILD_IDENTITY="$TMP/run/build-identity.json"

SHA_GOOD="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
SHA_OTHER="bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"

# Fixture state consumed by the stubbed probes.
FX_OWNERS="1234"
FX_CMD="next-server (v16.2.10)"
FX_CWD="$TMP/repo"
FX_PPID="1"
FX_IDENTITY="{\"commitSha\":\"$SHA_GOOD\",\"commitRef\":\"feat/x\"}"

yr_port_owner()  { printf '%s\n' $FX_OWNERS; }
yr_proc_cmd()    { printf '%s' "$FX_CMD"; }
yr_proc_cwd()    { printf '%s' "$FX_CWD"; }
yr_proc_ppid()   { printf '%s' "$FX_PPID"; }
yr_fetch_identity() { printf '%s' "$FX_IDENTITY"; }
yr_http_ok()     { return 0; }   # HTTP always "succeeds" — it must prove nothing

echo "1234" > "$YR_PID_FILE"
yr_write_build_identity "$SHA_GOOD" "TESTBUILD"

# Genuine service: every fact true.
if yr_runtime_is_ours 1234; then ok "genuine service accepted (all facts true)"; else bad "genuine service REJECTED ($YR_OWNERSHIP_FAIL)"; fi
if yr_runtime_is_current 1234 "$SHA_GOOD" "feat/x"; then ok "genuine service is current-grade"; else bad "genuine current-grade REJECTED ($YR_OWNERSHIP_FAIL)"; fi

# R1 — foreign plain-HTTP server: HTTP 200 (stubbed true) but wrong shape.
FX_CMD="/usr/bin/python3 -m http.server 3210"; FX_IDENTITY="<html>hello</html>"
if yr_runtime_is_ours 1234; then bad "R1: foreign HTTP server accepted as ours"; else
  case "$YR_OWNERSHIP_FAIL" in *not_next_server_shape*) ok "R1: foreign HTTP server rejected (shape) despite HTTP 200" ;; *) ok "R1: foreign HTTP server rejected ($YR_OWNERSHIP_FAIL)" ;; esac
fi
if yr_runtime_is_current 1234 "$SHA_GOOD" "feat/x"; then bad "R1: foreign HTTP server accepted as current"; else ok "R1: foreign HTTP server not current-grade"; fi

# R2 — genuine-looking next-server from ANOTHER repository (worst case: it even
# fakes a matching identity body and squats our recorded PID number).
FX_CMD="next-server (v16.2.10)"; FX_CWD="$TMP/other-repo"; FX_IDENTITY="{\"commitSha\":\"$SHA_GOOD\",\"commitRef\":\"feat/x\"}"
if yr_runtime_is_ours 1234; then bad "R2: foreign next-server accepted by port+name"; else
  case "$YR_OWNERSHIP_FAIL" in *cwd_not_repo*) ok "R2: foreign next-server rejected (cwd)" ;; *) bad "R2: rejected but not for cwd ($YR_OWNERSHIP_FAIL)" ;; esac
fi

# Stale identity — ours by process facts, but runtime SHA differs from the
# recorded build.
FX_CWD="$TMP/repo"; FX_IDENTITY="{\"commitSha\":\"$SHA_OTHER\",\"commitRef\":\"feat/x\"}"
if yr_runtime_is_ours 1234; then bad "stale runtime identity accepted as ours"; else
  case "$YR_OWNERSHIP_FAIL" in *runtime_identity_ne_recorded_build*) ok "stale runtime identity rejected" ;; *) bad "stale rejected for wrong reason ($YR_OWNERSHIP_FAIL)" ;; esac
fi

# Stale build — ours and runtime==recorded, but recorded != repository HEAD.
FX_IDENTITY="{\"commitSha\":\"$SHA_GOOD\",\"commitRef\":\"feat/x\"}"
if yr_runtime_is_current 1234 "$SHA_OTHER" "feat/x"; then bad "recorded!=HEAD accepted as current"; else
  case "$YR_OWNERSHIP_FAIL" in *recorded_build_sha_ne_repo_head*) ok "recorded!=HEAD rejected at current grade" ;; *) bad "rejected for wrong reason ($YR_OWNERSHIP_FAIL)" ;; esac
fi

# Lineage — right shape/cwd/identity but no relationship to the recorded PID.
echo "9999" > "$YR_PID_FILE"; FX_PPID="1"
if yr_runtime_is_ours 1234; then bad "unrecorded lineage accepted"; else
  case "$YR_OWNERSHIP_FAIL" in *lineage_not_recorded_pid*) ok "unrecorded lineage rejected" ;; *) bad "lineage rejected for wrong reason ($YR_OWNERSHIP_FAIL)" ;; esac
fi
FX_PPID="9999"
if yr_runtime_is_ours 1234; then ok "child-of-recorded lineage accepted"; else bad "child-of-recorded lineage rejected ($YR_OWNERSHIP_FAIL)"; fi

# Multiple port owners — never a singleton claim.
echo "1234" > "$YR_PID_FILE"; FX_OWNERS="1234 5678"; FX_PPID="1"
if yr_runtime_is_ours 1234; then bad "multiple port owners accepted"; else ok "multiple port owners rejected"; fi
FX_OWNERS="1234"

# ── Static: the scripts must keep the gates wired ────────────────────────────
S="$SRC/start-yorisou.sh"; T="$SRC/stop-yorisou.sh"; V="$SRC/verify-yorisou-launcher.sh"; L="$SRC/yorisou-launcher-lib.sh"

grep -q 'yr_quick_current && { open_window' "$S" \
  && ok "R5: lock-path fast path requires current-grade identity" || bad "R5: lock-path fast path lost its identity gate"
if grep -q 'yr_http_ok && { open_window' "$S"; then bad "R1/R5: start opens window on bare HTTP"; else ok "R1/R5: no window on bare HTTP in start"; fi
grep -q 'yr_runtime_is_current "\$FINAL_OWNER"' "$S" \
  && ok "R5: final window gate requires yr_runtime_is_current" || bad "R5: final window gate missing"
grep -q 'yr_runtime_is_ours "\$p"' "$T" \
  && ok "R4: stop signals only under yr_runtime_is_ours" || bad "R4: stop lost its ownership gate"
if grep -q 'yr_pid_is_ours' "$L" "$S" "$T" "$V"; then bad "R2: legacy yr_pid_is_ours (port+name rule) still referenced"; else ok "R2: legacy port+name ownership rule removed"; fi
grep -q 'yr_runtime_is_current' "$V" \
  && ok "R3: verifier checks full identity" || bad "R3: verifier missing identity check"
grep -q 'overall YORISOU identity' "$V" \
  && ok "R3: verifier reports an overall identity result" || bad "R3: verifier overall identity report missing"
for fn in yr_pid_listens_on_launcher_port yr_pid_cwd_matches_repo yr_runtime_identity yr_runtime_identity_matches_build yr_runtime_is_ours; do
  grep -q "^${fn}()" "$L" && ok "helper present: $fn" || bad "helper missing: $fn"
done

echo
if [ "$FAIL" = "0" ]; then echo "LAUNCHER CONTRACT: ALL CHECKS PASSED"; else echo "LAUNCHER CONTRACT: FAILURES PRESENT"; fi
exit $FAIL
