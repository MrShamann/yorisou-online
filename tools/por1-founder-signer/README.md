# POR-1 Founder signing helper

Signs ONE POR-1 Production deletion-incident recovery authorization with a Secure Enclave key that
requires a fingerprint. This is the signing half of the destructive-authority boundary; verification
lives in `lib/server/por1FounderIncidentAuthority.ts` and never sees a private key.

## Why this is native code

The first authority model was a JSON file containing `reviewedBy: "founder"`. An execution agent with
filesystem access can write that file, so it was an assertion, not authority.

Real authority needs a secret the agent cannot read and an action the agent cannot perform. A Secure
Enclave P-256 key is generated inside the SEP and never leaves it; enrolled with
`.biometryCurrentSet`, it cannot sign without a fingerprint present at that moment. That flag rather
than `.userPresence` is deliberate — enrolling a new fingerprint later invalidates the key instead of
silently widening who may authorise a Production deletion.

## Why CryptoKit and not Security.framework

The obvious implementation is `SecKeyCreateRandomKey` with `kSecAttrTokenIDSecureEnclave` and
`kSecAttrIsPermanent`, which stores the key as a keychain item. On macOS that needs a
`keychain-access-groups` entitlement honoured under a real Team ID — and an earlier revision of this
work wrongly concluded the whole capability was unavailable because of it.

`SecureEnclave.P256.Signing.PrivateKey` never creates a keychain item. The key is generated in the SEP
and the caller keeps an opaque representation that only this machine's Secure Enclave can turn back
into a usable key. **No entitlement, no provisioning profile, no Apple Developer signing identity.**

Measured on this host (Apple M2 / macOS 26.4.1), across two separate processes:

| Property | Result |
|---|---|
| `SecureEnclave.isAvailable` | true |
| Create with `.privateKeyUsage` + `.biometryCurrentSet` | OK, **no entitlement** |
| Opaque representation size | 569 bytes (not a 32-byte scalar) |
| Rehydrate in a **fresh process** | OK |
| Public key after rehydration | **byte-identical** to enrollment |
| Sign with `interactionNotAllowed` | **refused** — `LAError -1004` "User interaction is required." |
| Usable as a software P-256 key | **no** |

For contrast, the keychain route on the same host: `-34018` errSecMissingEntitlement for every
persistent variant, and ad-hoc signing the entitlement gets the process `SIGKILL`ed.

## Enrollment (a Founder action)

```
swiftc -O -o por1-founder-signer tools/por1-founder-signer/main.swift \
  -framework CryptoKit -framework LocalAuthentication -framework Security
codesign -s - --force por1-founder-signer          # ad-hoc is sufficient; no entitlement needed
./por1-founder-signer enroll --label=por1-founder-production
```

`enroll` prints the PUBLIC key (base64 X9.63) and stores the opaque representation at
`~/.por1-founder-authority/<label>.sekey`, mode `0600` inside a `0700` directory — **never in the
repository**. Pin the printed public key in `POR1_FOUNDER_AUTHORITY_KEY_ROSTER` as a reviewed change.

Until a key is pinned there the roster is empty, no signature can verify, and destructive authority is
NONE. That is the shipped state, and it is a decision waiting on a human rather than a defect.

## Commands

| Command | Prompts? | Notes |
|---|---|---|
| `enroll --label=<l>` | no | Founder runs this. Prints the PUBLIC key only. Refuses to overwrite. |
| `public-key --label=<l>` | no | Re-read the public key; `interactionNotAllowed`. |
| `sign --label=<l>` | **yes** | Reads the canonical payload on stdin, writes base64 DER. |
| `capability-probe` | no | Throwaway key, nothing persisted; proves the primitive and its refusals. |
| `delete --label=<l>` | no | Remove an enrolled representation. |

`sign` refuses an empty payload. The private half is never printed, exported or written anywhere.
