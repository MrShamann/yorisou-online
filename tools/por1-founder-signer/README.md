# POR-1 Founder signing helper

Signs ONE POR-1 Production deletion-incident recovery authorization with a Secure Enclave key that
requires a fingerprint. It is the signing half of the destructive-authority boundary; verification
lives in `lib/server/por1FounderIncidentAuthority.ts` and never sees a private key.

## Why this is native code

The previous authority model was a JSON file containing `reviewedBy: "founder"`. An execution agent
with filesystem access can write that file, so it was an assertion, not authority.

Real authority needs a secret the agent cannot read and an action the agent cannot perform. A Secure
Enclave P-256 key is generated inside the SEP, is never exportable, exists in no file and no
environment variable, and — enrolled with `.biometryCurrentSet` — cannot sign without a fingerprint
that is present at that moment. `.biometryCurrentSet` rather than `.userPresence` is deliberate:
enrolling a new fingerprint later invalidates the key instead of silently widening who may authorise
a Production deletion.

## Status on this host: BLOCKED

`BLOCKED_FOUNDER_USER_PRESENCE_SIGNING_PRIMITIVE` — measured 2026-08-12 on Apple M2 / macOS 26.4.1.

| Probe | Result |
|---|---|
| Secure Enclave present (`AppleSEPManager`) | yes |
| Touch ID enrolled and effective (`bioutil -r`) | yes |
| LocalAuthentication biometrics available | yes |
| **Transient** SEP key: create, sign, verify | **OK** (72-byte DER ECDSA) |
| **Persistent** SEP key, `.privateKeyUsage` | `-34018` errSecMissingEntitlement |
| **Persistent** SEP key, data-protection keychain | `-34018` |
| **Persistent** SEP key, no access control | `-34018` |
| Ad-hoc codesign + `keychain-access-groups` | process `SIGKILL`ed at launch |
| `security find-identity -v -p codesigning` | **0 valid identities** |

The hardware primitive works. What is missing is provisioning: persisting a Secure Enclave key in the
keychain requires the binary to carry a `keychain-access-groups` entitlement, and an entitlement is
only honoured when the signature chains to a real Team ID. Ad-hoc signatures cannot carry it — the
kernel kills the process instead.

A transient key is not a substitute. It dies with the process, so its public key can never be pinned,
and generating one per invocation would mean the agent creates the "Founder key" — the same
assertion-not-authority failure in a new costume.

**Unblocking is a Founder action**, not an engineering one:

1. Obtain an Apple code-signing identity (Developer ID Application, or a free personal team in Xcode).
2. Build and sign this helper with the entitlement:
   ```
   swiftc -O -o por1-founder-signer tools/por1-founder-signer/main.swift \
     -framework Security -framework LocalAuthentication -framework CryptoKit
   codesign -s "<identity>" --force --options runtime \
     --entitlements tools/por1-founder-signer/entitlements.plist por1-founder-signer
   ```
3. Enroll, on the Founder's own machine, and keep the printed public key:
   ```
   ./por1-founder-signer enroll --label=por1-founder-production
   ```
4. Pin that public key in `POR1_FOUNDER_AUTHORITY_KEY_ROSTER`, reviewed like any other change.

Until step 4 lands the roster is empty, no signature can verify, and destructive authority is NONE.

## Commands

| Command | Presence required | Notes |
|---|---|---|
| `enroll --label=<l>` | no | Founder runs this. Prints the PUBLIC key only. |
| `public-key --label=<l>` | no | Re-read the public key. |
| `sign --label=<l>` | **yes** | Reads the canonical payload on stdin, writes base64 DER. |
| `capability-probe` | no | Throwaway non-presence key; proves the SEP primitive. |
| `delete --label=<l>` | no | Remove an enrolled key. |

`sign` refuses an empty payload, and the private key is never printed, exported or written to disk.
