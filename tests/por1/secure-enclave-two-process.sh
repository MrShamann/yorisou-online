#!/usr/bin/env bash
# POR-1 — the Founder signing primitive, proven across TWO REAL PROCESSES.
#
# WHY THIS IS NOT THE IN-PROCESS PROBE.
#
# `por1-founder-signer capability-probe` creates a key and rehydrates it inside one process. That
# proves the API works; it does NOT prove the property the authority model depends on — that the
# opaque representation survives the death of the process that made it, on this machine, and rebuilds
# the SAME key. An in-process check could pass on a cached handle and tell us nothing.
#
# So: process A creates and exits. Process B starts fresh and must reconstruct a byte-identical public
# key from bytes on disk alone.
#
# NOBODY IS PROMPTED. Signing is attempted with `LAContext.interactionNotAllowed = true`, which must
# FAIL — that refusal is the safety property, not an inconvenience. No Touch ID dialog appears and no
# Founder authorization is requested or consumed.
#
#   bash tests/por1/secure-enclave-two-process.sh

set -euo pipefail
cd "$(dirname "$0")/../.."

WORK="${POR1_SE_WORK:-/tmp/por1-se-two-process}"
FAILURES=0
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

ok()  { echo "[ok]   $1"; }
bad() { echo "[FAIL] $1"; FAILURES=$((FAILURES + 1)); }
want() { if [ "$1" = "$2" ]; then ok "$3"; else bad "$3 (expected '$1', got '$2')"; fi; }

if [ "$(uname -s)" != "Darwin" ]; then
  echo "[se] not macOS — the Secure Enclave primitive cannot be exercised here"
  exit 0
fi
command -v swiftc >/dev/null 2>&1 || { echo "[se] swiftc unavailable" >&2; exit 1; }

rm -rf "$WORK"; mkdir -p "$WORK/store"; chmod 700 "$WORK/store"

# ── process A: create, persist the opaque representation, exit ──────────────
cat > "$WORK/create.swift" <<'SWIFT'
import CryptoKit
import Foundation
import Security
let dir = URL(fileURLWithPath: CommandLine.arguments[1])
guard SecureEnclave.isAvailable else { print("secureEnclaveAvailable=false"); exit(2) }
print("secureEnclaveAvailable=true")
var err: Unmanaged<CFError>?
guard let ac = SecAccessControlCreateWithFlags(
    nil, kSecAttrAccessibleWhenUnlockedThisDeviceOnly, [.privateKeyUsage, .biometryCurrentSet], &err
) else { print("accessControlCreated=false"); exit(1) }
print("accessControlCreated=true")
do {
    let key = try SecureEnclave.P256.Signing.PrivateKey(accessControl: ac)
    try key.dataRepresentation.write(to: dir.appendingPathComponent("rep.bin"))
    try FileManager.default.setAttributes([.posixPermissions: 0o600],
        ofItemAtPath: dir.appendingPathComponent("rep.bin").path)
    try Data(key.publicKey.rawRepresentation).write(to: dir.appendingPathComponent("pub.bin"))
    print("created=true")
    print("representationBytes=\(key.dataRepresentation.count)")
    print("pid=\(ProcessInfo.processInfo.processIdentifier)")
} catch { print("created=false error=\(error)"); exit(1) }
SWIFT

# ── process B: fresh process, rehydrate from disk, prove the refusals ───────
cat > "$WORK/rehydrate.swift" <<'SWIFT'
import CryptoKit
import Foundation
import LocalAuthentication
let dir = URL(fileURLWithPath: CommandLine.arguments[1])
guard
    let rep = try? Data(contentsOf: dir.appendingPathComponent("rep.bin")),
    let expected = try? Data(contentsOf: dir.appendingPathComponent("pub.bin"))
else { print("rehydrated=false"); exit(1) }
print("pid=\(ProcessInfo.processInfo.processIdentifier)")
let ctx = LAContext()
ctx.interactionNotAllowed = true          // nobody is prompted, ever
do {
    let key = try SecureEnclave.P256.Signing.PrivateKey(dataRepresentation: rep, authenticationContext: ctx)
    print("rehydrated=true")
    print("publicKeyMatches=\(Data(key.publicKey.rawRepresentation) == expected)")
    var signed = false
    do { _ = try key.signature(for: Data("por1-two-process".utf8)); signed = true } catch {}
    print("signedWithoutUserPresence=\(signed)")
} catch { print("rehydrated=false error=\(error)") }
print("usableAsSoftwareKey=\((try? P256.Signing.PrivateKey(rawRepresentation: rep)) != nil)")
SWIFT

swiftc -O -o "$WORK/create" "$WORK/create.swift" -framework CryptoKit -framework Security >/dev/null 2>&1
swiftc -O -o "$WORK/rehydrate" "$WORK/rehydrate.swift" -framework CryptoKit -framework LocalAuthentication >/dev/null 2>&1
codesign -s - --force "$WORK/create" "$WORK/rehydrate" >/dev/null 2>&1

A_OUT=$("$WORK/create" "$WORK/store" 2>&1) || {
  # Distinguish an ENVIRONMENT PRECONDITION from a lost capability. Both are non-zero — a silent skip
  # would hide the loss of the only thing making Founder authority unforgeable — but they are
  # different findings and must not be reported as one.
  #
  # -25308 errSecInteractionNotAllowed: the key is `...WhenUnlockedThisDeviceOnly`, so the Secure
  # Enclave refuses to mint it while the device is locked or the process has no unlocked GUI session.
  # That is the accessibility class doing its job, not a defect.
  if grep -q 'secureEnclaveAvailable=false' <<<"$A_OUT"; then
    bad "Secure Enclave reported unavailable on a Darwin host"
  elif grep -q '\-25308\|interactionNotAllowed' <<<"$A_OUT"; then
    echo "[se] PRECONDITION: device is locked (errSecInteractionNotAllowed -25308)."
    echo "[se] The key is kSecAttrAccessibleWhenUnlockedThisDeviceOnly; unlock the Mac and re-run."
    echo "[se] NOT a capability loss and NOT a pass."
    exit 2
  else
    bad "process A failed: $(head -1 <<<"$A_OUT")"
  fi
  echo "[se] $FAILURES FAILURE(S)"; exit 1
}
field() { grep -m1 "^$1=" <<<"$2" | cut -d= -f2-; }

want "true" "$(field secureEnclaveAvailable "$A_OUT")" "Secure Enclave is available"
want "true" "$(field accessControlCreated "$A_OUT")"   "access control: privateKeyUsage + biometryCurrentSet + whenUnlockedThisDeviceOnly"
want "true" "$(field created "$A_OUT")"                "process A created a Secure Enclave key with NO entitlement"
REP_BYTES=$(field representationBytes "$A_OUT")
if [ "${REP_BYTES:-0}" -gt 64 ]; then
  ok "opaque representation is $REP_BYTES bytes — not a 32-byte private scalar"
else
  bad "representation is only ${REP_BYTES:-0} bytes; too small to be opaque"
fi
PERMS=$(stat -f '%Lp' "$WORK/store/rep.bin")
want "600" "$PERMS" "representation is owner-only on disk"

# Process A is gone by now: its exit is what makes process B a genuine fresh-process test.
B_OUT=$("$WORK/rehydrate" "$WORK/store" 2>&1)
A_PID=$(field pid "$A_OUT"); B_PID=$(field pid "$B_OUT")
if [ -n "$A_PID" ] && [ -n "$B_PID" ] && [ "$A_PID" != "$B_PID" ]; then
  ok "rehydration happened in a DIFFERENT process (pid $A_PID -> $B_PID)"
else
  bad "could not prove the two phases ran in different processes"
fi

want "true"  "$(field rehydrated "$B_OUT")"                "fresh process rehydrated the key from bytes alone"
want "true"  "$(field publicKeyMatches "$B_OUT")"          "reconstructed public key EXACTLY matches enrollment"
want "false" "$(field signedWithoutUserPresence "$B_OUT")" "signing REFUSED without user presence"
want "false" "$(field usableAsSoftwareKey "$B_OUT")"       "representation cannot be used as a software P-256 key"

# Negative control: corrupt the representation and require rehydration to fail.
cp "$WORK/store/rep.bin" "$WORK/store/rep.orig"
dd if=/dev/urandom of="$WORK/store/rep.bin" bs=1 count=32 conv=notrunc >/dev/null 2>&1
C_OUT=$("$WORK/rehydrate" "$WORK/store" 2>&1) || true
if [ "$(field rehydrated "$C_OUT")" = "false" ] || [ "$(field publicKeyMatches "$C_OUT")" = "false" ]; then
  ok "negative control: a corrupted representation does NOT yield the enrolled key"
else
  bad "negative control: a corrupted representation still produced the enrolled key"
fi

rm -f "$WORK/store/rep.bin" "$WORK/store/rep.orig" "$WORK/store/pub.bin"
ok "throwaway representation deleted"

echo
if [ "$FAILURES" -eq 0 ]; then echo "[se] PASS"; else echo "[se] $FAILURES FAILURE(S)"; exit 1; fi
