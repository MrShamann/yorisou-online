import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  IDENTITY_LINK_KINDS,
  identityLookupKeysFromManifest,
  isCanonicalIdentityLinksSchemaReady,
  isWellFormedIdentityLink,
  resolveIdentityLinkMode,
} from "../canonicalIdentityLinksRollout";

const ENV = "YORISOU_POR1_CANONICAL_IDENTITY_LINKS_SCHEMA_READY";
const DIGEST_A = "a".repeat(64);
const DIGEST_B = "b".repeat(64);
const EMAIL_KEY = `phase1/accounts/by-email/${DIGEST_A}.json`;
const LINE_KEY = `phase1/accounts/by-line-user/${DIGEST_B}.json`;

afterEach(() => {
  delete process.env[ENV];
});

describe("POR-1 canonical identity-link readiness", () => {
  it("is off unless the variable is exactly `on`", () => {
    assert.equal(isCanonicalIdentityLinksSchemaReady(), false);
    for (const raw of ["", "off", "true", "1", "ON ", "yes", "onn"]) {
      process.env[ENV] = raw;
      assert.equal(
        isCanonicalIdentityLinksSchemaReady(),
        raw.trim().toLowerCase() === "on",
        `readiness misread ${JSON.stringify(raw)}`,
      );
    }
  });

  it("treats an unset variable as not ready, so a deployment may precede its migration", () => {
    delete process.env[ENV];
    assert.equal(resolveIdentityLinkMode({ schemaReady: isCanonicalIdentityLinksSchemaReady() }),
      "record_derived");
    process.env[ENV] = "on";
    assert.equal(resolveIdentityLinkMode({ schemaReady: isCanonicalIdentityLinksSchemaReady() }),
      "canonical_registry");
  });
});

describe("POR-1 identity-link shape", () => {
  it("requires a sha256 digest for the two hashed families", () => {
    assert.equal(isWellFormedIdentityLink({ kind: "email", digest: DIGEST_A }), true);
    assert.equal(isWellFormedIdentityLink({ kind: "line_subject", digest: DIGEST_B }), true);
    // The shapes a careless caller reaches for when the digest is not to hand. Each of these
    // reaching the registry would be a raw identifier in a table that must never hold one.
    assert.equal(isWellFormedIdentityLink({ kind: "email", digest: "a@b.invalid" }), false);
    assert.equal(isWellFormedIdentityLink({ kind: "line_subject", digest: "Uraw" }), false);
    assert.equal(isWellFormedIdentityLink({ kind: "email", digest: DIGEST_A.toUpperCase() }), false);
    assert.equal(isWellFormedIdentityLink({ kind: "email", digest: "" }), false);
  });

  it("refuses an address or whitespace in an opaque canonical id", () => {
    assert.equal(isWellFormedIdentityLink({ kind: "user_profile", digest: "up_123" }), true);
    assert.equal(isWellFormedIdentityLink({ kind: "user_profile", digest: "a@b.invalid" }), false);
    assert.equal(isWellFormedIdentityLink({ kind: "auth_identity", digest: "has space" }), false);
    assert.equal(isWellFormedIdentityLink({ kind: "provisioning", digest: "x".repeat(201) }), false);
  });

  it("has a closed kind vocabulary", () => {
    assert.deepEqual([...IDENTITY_LINK_KINDS],
      ["email", "line_subject", "user_profile", "auth_identity", "provisioning"]);
    // @ts-expect-error — the point of the check is that an unknown kind is refused at runtime too.
    assert.equal(isWellFormedIdentityLink({ kind: "session", digest: DIGEST_A }), false);
  });
});

describe("POR-1 manifest lookup-key union", () => {
  it("NEGATIVE CONTROL: the pre-repair manifest shape names no LINE key at all", () => {
    // This is the manifest that was actually frozen on 2026-07-31 for a LINE-bound account: the
    // account read was stale, so `lineLookupKey` came back null. Erasure and verification both
    // iterated it, so the surviving lookup was not merely unerased — it was never looked at.
    const narrowed = { emailLookupKey: EMAIL_KEY, lineLookupKey: null };
    const keys = identityLookupKeysFromManifest(narrowed);
    assert.deepEqual(keys, [EMAIL_KEY]);
    assert.equal(keys.includes(LINE_KEY), false,
      "the control must reproduce the omission, or it is not a control");
  });

  it("names the LINE key once the registry supplies it, even with a stale record", () => {
    // Same stale record — `lineLookupKey` still null — but the registry knew. The union is what
    // turns a stale read from a narrowing into a widening.
    const repaired = {
      emailLookupKey: EMAIL_KEY,
      lineLookupKey: null,
      identityLookupKeys: [EMAIL_KEY, LINE_KEY],
    };
    assert.deepEqual(identityLookupKeysFromManifest(repaired).sort(), [EMAIL_KEY, LINE_KEY].sort());
  });

  it("keeps a pre-union manifest readable, so a resumed deletion does not change meaning", () => {
    const legacy = { emailLookupKey: EMAIL_KEY, lineLookupKey: LINE_KEY };
    assert.deepEqual(identityLookupKeysFromManifest(legacy).sort(), [EMAIL_KEY, LINE_KEY].sort());
  });

  it("deduplicates, because the same key arrives from both sources on the happy path", () => {
    const both = {
      emailLookupKey: EMAIL_KEY,
      lineLookupKey: LINE_KEY,
      identityLookupKeys: [EMAIL_KEY, LINE_KEY],
    };
    assert.equal(identityLookupKeysFromManifest(both).length, 2);
  });

  it("never emits a null, so a caller cannot delete `undefined`", () => {
    const empty = { emailLookupKey: null, lineLookupKey: null };
    assert.deepEqual(identityLookupKeysFromManifest(empty), []);
    assert.deepEqual(identityLookupKeysFromManifest({}), []);
  });
});
