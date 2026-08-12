// POR-1 — the Founder signing helper.
//
// WHY A NATIVE HELPER EXISTS.
//
// The first authority model was a JSON file carrying `reviewedBy: "founder"`. An execution agent with
// filesystem access can write that file, so it was an assertion, not authority. Real authority needs a
// secret the agent cannot read and an action the agent cannot perform.
//
// WHY CryptoKit AND NOT Security.framework.
//
// The obvious implementation — `SecKeyCreateRandomKey` with `kSecAttrTokenIDSecureEnclave` and
// `kSecAttrIsPermanent` — stores the key as a keychain item, and on macOS that needs a
// `keychain-access-groups` entitlement honoured under a real Team ID. Measured on this host: every
// persistent variant fails `-34018`, and ad-hoc signing that entitlement gets the process killed.
//
// `SecureEnclave.P256.Signing.PrivateKey` avoids the problem entirely by never creating a keychain
// item. The key is generated inside the SEP and the caller holds an OPAQUE representation which only
// that machine's Secure Enclave can turn back into a usable key. Measured on this host: creation
// succeeds with no entitlement, the representation rehydrates in a FRESH process to a byte-identical
// public key, signing without user interaction fails closed with `LAError -1004`, and the
// representation is rejected as a software P-256 key.
//
// So the private half is hardware-bound and unreadable, and a fingerprint is required to use it.
// Neither this process nor any agent driving it can produce a signature alone.

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

/// Where the opaque representation lives: the Founder's own home, never the repository.
func representationURL(_ label: String) -> URL {
    let safe = label.filter { $0.isLetter || $0.isNumber || $0 == "-" || $0 == "_" }
    return FileManager.default.homeDirectoryForCurrentUser
        .appendingPathComponent(".por1-founder-authority", isDirectory: true)
        .appendingPathComponent("\(safe).sekey")
}

/// `.biometryCurrentSet` rather than `.userPresence`: enrolling a new fingerprint later INVALIDATES
/// the key instead of silently widening who may authorise a Production deletion.
func productionAccessControl() -> SecAccessControl {
    var error: Unmanaged<CFError>?
    guard
        let control = SecAccessControlCreateWithFlags(
            nil,
            kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
            [.privateKeyUsage, .biometryCurrentSet],
            &error
        )
    else { die("could not create access control: \(error!.takeRetainedValue())") }
    return control
}

func writeRepresentation(_ data: Data, to url: URL) throws {
    let directory = url.deletingLastPathComponent()
    try FileManager.default.createDirectory(
        at: directory, withIntermediateDirectories: true,
        attributes: [.posixPermissions: 0o700]
    )
    try data.write(to: url, options: [.completeFileProtection, .atomic])
    try FileManager.default.setAttributes([.posixPermissions: 0o600], ofItemAtPath: url.path)
}

/// Load the enrolled key. `interactionNotAllowed` is honoured so callers can inspect without prompting.
func loadKey(label: String, reason: String, allowInteraction: Bool) -> SecureEnclave.P256.Signing.PrivateKey {
    let url = representationURL(label)
    guard let representation = try? Data(contentsOf: url) else {
        die("no enrolled Secure Enclave representation at \(url.path)")
    }
    let context = LAContext()
    context.localizedReason = reason
    context.interactionNotAllowed = !allowInteraction
    do {
        return try SecureEnclave.P256.Signing.PrivateKey(
            dataRepresentation: representation, authenticationContext: context
        )
    } catch {
        die("could not rehydrate the Secure Enclave key: \(error)")
    }
}

let command = CommandLine.arguments.dropFirst().first ?? ""

switch command {
case "enroll":
    // Run by the FOUNDER. Prints only the public half; the private half never leaves the SEP.
    guard SecureEnclave.isAvailable else { die("no Secure Enclave on this machine") }
    guard let label = flag("label") else { die("--label=<name> is required") }
    let url = representationURL(label)
    if FileManager.default.fileExists(atPath: url.path) {
        die("a key is already enrolled at \(url.path); delete it deliberately before re-enrolling")
    }
    do {
        let key = try SecureEnclave.P256.Signing.PrivateKey(accessControl: productionAccessControl())
        try writeRepresentation(key.dataRepresentation, to: url)
        // X9.63 uncompressed point, the form the verifier pins.
        print(key.publicKey.x963Representation.base64EncodedString())
        FileHandle.standardError.write(Data("enrolled: \(url.path)\n".utf8))
    } catch {
        die("enrollment failed: \(error)")
    }

case "public-key":
    guard let label = flag("label") else { die("--label=<name> is required") }
    // No prompt: reading the public half never needs presence.
    let key = loadKey(label: label, reason: "Read the POR-1 Founder public key", allowInteraction: false)
    print(key.publicKey.x963Representation.base64EncodedString())

case "sign":
    guard let label = flag("label") else { die("--label=<name> is required") }
    let reason =
        flag("reason") ?? "Authorise ONE POR-1 Production deletion incident recovery attempt"
    let payload = FileHandle.standardInput.readDataToEndOfFile()
    if payload.isEmpty { die("refusing to sign an empty payload") }
    // The Secure Enclave demands the fingerprint here. Nothing in this process can supply it.
    let key = loadKey(label: label, reason: reason, allowInteraction: true)
    do {
        print(try key.signature(for: payload).derRepresentation.base64EncodedString())
    } catch {
        die("signing refused: \(error)")
    }

case "capability-probe":
    // Proves the primitive on this host WITHOUT asking anyone to authorise anything: a throwaway key
    // is created, its representation rehydrated in-process, and signing is attempted with interaction
    // forbidden — which must FAIL. Nothing is persisted and nothing is prompted.
    guard SecureEnclave.isAvailable else { die("no Secure Enclave on this machine") }
    print("secureEnclaveAvailable=true")
    do {
        let key = try SecureEnclave.P256.Signing.PrivateKey(accessControl: productionAccessControl())
        let representation = key.dataRepresentation
        print("representationBytes=\(representation.count)")
        print("representationIsRawScalarSize=\(representation.count == 32)")

        let context = LAContext()
        context.interactionNotAllowed = true
        let rehydrated = try SecureEnclave.P256.Signing.PrivateKey(
            dataRepresentation: representation, authenticationContext: context
        )
        print("publicKeyStable=\(rehydrated.publicKey.rawRepresentation == key.publicKey.rawRepresentation)")

        var signedWithoutPresence = false
        do {
            _ = try rehydrated.signature(for: Data("por1-capability-probe".utf8))
            signedWithoutPresence = true
        } catch { /* expected: user interaction is required */ }
        print("signedWithoutUserPresence=\(signedWithoutPresence)")

        var usableAsSoftwareKey = false
        if (try? P256.Signing.PrivateKey(rawRepresentation: representation)) != nil {
            usableAsSoftwareKey = true
        }
        print("usableAsSoftwareKey=\(usableAsSoftwareKey)")
        if signedWithoutPresence || usableAsSoftwareKey { exit(1) }
    } catch {
        die("probe failed: \(error)")
    }

case "delete":
    guard let label = flag("label") else { die("--label=<name> is required") }
    try? FileManager.default.removeItem(at: representationURL(label))
    print("deleted")

default:
    die("usage: por1-founder-signer <enroll|public-key|sign|capability-probe|delete> --label=<name>")
}
