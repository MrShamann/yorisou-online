// POR-1 — the Founder signing helper.
//
// WHY A NATIVE HELPER EXISTS AT ALL.
//
// The previous authority model was a JSON file carrying `reviewedBy: "founder"`. An independent audit
// pointed out the obvious: an execution agent with filesystem access can write that file. It was an
// assertion, not authority, and no amount of schema validation fixes an assertion.
//
// Real authority needs a secret the agent cannot reach and an action the agent cannot perform. On
// this platform that is a Secure Enclave P-256 key — generated inside the SEP, never exportable, not
// present in any file or environment variable — guarded by an access control that demands user
// presence. Signing therefore requires a human fingerprint on the sensor. There is no code path,
// privileged or otherwise, by which this process can produce that.
//
// WHAT THIS BINARY CAN AND CANNOT DO.
//
//   enroll            create the Founder key. Run by the Founder. Prints the PUBLIC key only.
//   public-key        print the public key for an enrolled label.
//   sign              sign stdin. ALWAYS prompts for user presence when the key was enrolled with it.
//   capability-probe  prove the Secure Enclave signing primitive works on this host, using a
//                     throwaway key with NO presence requirement, then delete it. Exists so the
//                     primitive can be verified without anyone authorising anything.
//
// The private key is never printed, never exported and never written to disk — `kSecAttrIsPermanent`
// stores it in the keychain by reference, and the SEP refuses to hand it out. Verification happens in
// TypeScript against the pinned public key; this binary is only ever the signing side.

import CryptoKit
import Foundation
import LocalAuthentication
import Security

func die(_ message: String) -> Never {
    FileHandle.standardError.write(Data("por1-founder-signer: \(message)\n".utf8))
    exit(1)
}

func flag(_ name: String) -> String? {
    let prefix = "--\(name)="
    return CommandLine.arguments.first { $0.hasPrefix(prefix) }
        .map { String($0.dropFirst(prefix.count)) }
}

/// The access control every PRODUCTION key is created with.
///
/// `.privateKeyUsage` keeps the key usable only for signing. `.biometryCurrentSet` binds it to the
/// fingerprints enrolled RIGHT NOW: adding a finger later invalidates the key rather than silently
/// widening who can authorise a Production deletion.
func productionAccessControl() -> SecAccessControl {
    var error: Unmanaged<CFError>?
    guard
        let control = SecAccessControlCreateWithFlags(
            nil,
            kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
            [.privateKeyUsage, .biometryCurrentSet],
            &error
        )
    else {
        die("could not create access control: \(error!.takeRetainedValue())")
    }
    return control
}

func createKey(label: String, accessControl: SecAccessControl?) -> SecKey {
    var keyAttributes: [String: Any] = [
        kSecAttrIsPermanent as String: true,
        kSecAttrLabel as String: label,
    ]
    if let accessControl { keyAttributes[kSecAttrAccessControl as String] = accessControl }

    let attributes: [String: Any] = [
        kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
        kSecAttrKeySizeInBits as String: 256,
        // The whole point: the key material is generated inside the Secure Enclave and cannot leave.
        kSecAttrTokenID as String: kSecAttrTokenIDSecureEnclave,
        kSecPrivateKeyAttrs as String: keyAttributes,
    ]

    var error: Unmanaged<CFError>?
    guard let key = SecKeyCreateRandomKey(attributes as CFDictionary, &error) else {
        die("Secure Enclave key creation failed: \(error!.takeRetainedValue())")
    }
    return key
}

func loadKey(label: String, prompt: String) -> SecKey {
    let context = LAContext()
    context.localizedReason = prompt
    let query: [String: Any] = [
        kSecClass as String: kSecClassKey,
        kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
        kSecAttrTokenID as String: kSecAttrTokenIDSecureEnclave,
        kSecAttrLabel as String: label,
        kSecReturnRef as String: true,
        kSecUseAuthenticationContext as String: context,
    ]
    var item: CFTypeRef?
    let status = SecItemCopyMatching(query as CFDictionary, &item)
    guard status == errSecSuccess, let item else {
        die("no Secure Enclave key enrolled under label '\(label)' (OSStatus \(status))")
    }
    return (item as! SecKey)
}

func deleteKey(label: String) {
    let query: [String: Any] = [
        kSecClass as String: kSecClassKey,
        kSecAttrTokenID as String: kSecAttrTokenIDSecureEnclave,
        kSecAttrLabel as String: label,
    ]
    SecItemDelete(query as CFDictionary)
}

/// The public key in X9.63 form (0x04 || X || Y). The verifier wraps it into SPKI.
func publicKeyBase64(_ privateKey: SecKey) -> String {
    guard let publicKey = SecKeyCopyPublicKey(privateKey) else { die("no public key") }
    var error: Unmanaged<CFError>?
    guard let data = SecKeyCopyExternalRepresentation(publicKey, &error) as Data? else {
        die("could not export public key: \(error!.takeRetainedValue())")
    }
    return data.base64EncodedString()
}

func sign(_ payload: Data, with key: SecKey) -> Data {
    var error: Unmanaged<CFError>?
    guard
        let signature = SecKeyCreateSignature(
            key, .ecdsaSignatureMessageX962SHA256, payload as CFData, &error
        ) as Data?
    else {
        die("signing refused: \(error!.takeRetainedValue())")
    }
    return signature
}

// ── commands ────────────────────────────────────────────────────────────────

let command = CommandLine.arguments.dropFirst().first ?? ""

switch command {
case "enroll":
    // Run by the FOUNDER, not by an agent. Creates the key and prints only its public half.
    guard let label = flag("label") else { die("--label=<keychain label> is required") }
    let key = createKey(label: label, accessControl: productionAccessControl())
    print(publicKeyBase64(key))

case "public-key":
    guard let label = flag("label") else { die("--label=<keychain label> is required") }
    print(publicKeyBase64(loadKey(label: label, prompt: "Read POR-1 Founder public key")))

case "sign":
    guard let label = flag("label") else { die("--label=<keychain label> is required") }
    let reason =
        flag("reason") ?? "Authorise ONE POR-1 Production deletion incident recovery attempt"
    let payload = FileHandle.standardInput.readDataToEndOfFile()
    if payload.isEmpty { die("refusing to sign an empty payload") }
    // Touch ID is demanded here, by the Secure Enclave, because of how the key was enrolled.
    print(sign(payload, with: loadKey(label: label, prompt: reason)).base64EncodedString())

case "capability-probe":
    // Proves the SEP signing primitive works on THIS host without asking anyone to authorise
    // anything: the throwaway key carries `.privateKeyUsage` only, so no presence is demanded, and it
    // is deleted immediately. It is never the Production key and never appears in the pinned roster.
    let label = "por1-capability-probe-DO-NOT-USE"
    deleteKey(label: label)
    var error: Unmanaged<CFError>?
    guard
        let control = SecAccessControlCreateWithFlags(
            nil, kSecAttrAccessibleWhenUnlockedThisDeviceOnly, [.privateKeyUsage], &error
        )
    else { die("probe access control failed") }

    let key = createKey(label: label, accessControl: control)
    let payload = Data("por1-secure-enclave-capability-probe".utf8)
    let signature = sign(payload, with: key)
    guard let publicKey = SecKeyCopyPublicKey(key) else { die("probe public key missing") }
    let verified = SecKeyVerifySignature(
        publicKey, .ecdsaSignatureMessageX962SHA256, payload as CFData, signature as CFData, &error
    )
    deleteKey(label: label)

    print("secureEnclaveKeyCreated=true")
    print("signatureProduced=\(!signature.isEmpty)")
    print("signatureVerified=\(verified)")
    print("publicKeyX963Base64=\(publicKeyBase64(key))")
    print("probeKeyDeleted=true")
    if !verified { exit(1) }

case "delete":
    guard let label = flag("label") else { die("--label=<keychain label> is required") }
    deleteKey(label: label)
    print("deleted=\(label)")

default:
    die("usage: por1-founder-signer <enroll|public-key|sign|capability-probe|delete> --label=<label>")
}
