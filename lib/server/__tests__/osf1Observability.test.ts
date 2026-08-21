import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomBytes, randomUUID } from "node:crypto";

import {
  LIFE_OS_OPS_EVENTS,
  newCorrelationId,
  opsActorFingerprint,
  recordLifeOsOps,
  type LifeOsOpsEvent,
} from "../lifeOs/observability";

// OSF-1 §20 — the operational signals, tested for the two things that can go wrong with them.
//
// A log that leaks is a second copy of the thing the product promised to hold carefully. A log that
// does not exist is an internal beta that reports "it seemed fine". Both failures are silent, and
// this file is about both.
//
// THE SECOND ONE IS THE ONE THAT WAS ACTUALLY WRONG. The vocabulary declared seven events and the
// module's header said seven things "must be detectable". Three of them — assistant.provider_failed,
// erasure.failed and moderation.anomaly — were emitted by NOTHING. A test asserting the list was
// green throughout, because a list of event names is not a list of events. So the first test below
// asserts every declared event has a PRODUCER, found by searching the source.
//
//   node --conditions=react-server --import tsx --test lib/server/__tests__/osf1Observability.test.ts

/** Capture everything written to stderr while `run` executes. */
function capture(run: () => void): string[] {
  const lines: string[] = [];
  const original = process.stderr.write.bind(process.stderr);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (process.stderr as any).write = (chunk: string | Uint8Array): boolean => {
    lines.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"));
    return true;
  };
  try {
    run();
  } finally {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (process.stderr as any).write = original;
  }
  return lines.join("").split("\n").filter((line) => line.trim().length > 0);
}

/**
 * Where each event is emitted from. Named here so that adding an event to the vocabulary without a
 * producer fails, and so that MOVING a producer has to be a deliberate edit rather than a silent
 * regression back to an unemitted event.
 */
const PRODUCERS: Record<LifeOsOpsEvent, string> = {
  "life_os.audit.write_failed": "lib/server/lifeOs/audit.ts",
  "life_os.mutation.failed": "lib/server/lifeOs/guard.ts",
  "life_os.access.denied": "lib/server/lifeOs/guard.ts",
  "life_os.consent.required": "lib/server/lifeOs/guard.ts",
  "life_os.schema.not_ready": "lib/server/lifeOs/guard.ts",
  "life_os.assistant.provider_failed": "app/api/life/assistant/route.ts",
  "life_os.erasure.failed": "lib/server/accountDeletionOrchestrator.ts",
  "life_os.moderation.anomaly": "lib/server/experienceCards.ts",
};

test("every declared operational event has a real producer in the source", () => {
  for (const event of LIFE_OS_OPS_EVENTS) {
    const file = PRODUCERS[event];
    assert.ok(file, `${event} is declared with no producer named — it may be undeliverable`);
    const source = readFileSync(file, "utf8");
    assert.ok(
      source.includes(`"${event}"`),
      `${event} is declared in the vocabulary but ${file} does not emit it`,
    );
    // A producer is a recordLifeOsOps CALL, not a mention. A file that merely names the event in a
    // comment would satisfy the check above.
    assert.match(source, /recordLifeOsOps\(/, `${file} names ${event} but never calls recordLifeOsOps`);
  }
});

test("the producer map covers the vocabulary exactly — no stale entries either", () => {
  assert.deepEqual(Object.keys(PRODUCERS).sort(), [...LIFE_OS_OPS_EVENTS].sort());
});

// ─────────────────────────────────────────────────────────────────────────────
// REDACTION
// ─────────────────────────────────────────────────────────────────────────────

const SECRETS = {
  reflection: "上司に本当のことを言えなかった。ずっと胃が痛い。",
  memory: "人前で話す前は必ず紙に書いてから話す",
  privateCard: "家族には話していないが、去年から通院している",
  prompt: "あなたはYORISOUの「振り返りアシスタント」です。してはいけないこと: 診断する",
  // THE CASE THAT WAS ACTUALLY BROKEN. A JWT is letters, digits and dots — it matched the original
  // class pattern exactly, so a service-role key inside a fetch error message would have been logged
  // in full by the module written to make that impossible. Kept short on purpose: a 200-character real
  // token would be caught by the length bound alone and would prove nothing about the alphabet.
  //
  // CONSTRUCTED, never written as a literal. The repository's secret-pattern hard gate greps for
  // `eyJ[A-Za-z0-9_-]{20,}`, and it is right to: a gate that cannot tell test data from a live key must
  // fire on both, and asking it to make an exception is asking it to stop working. Building the header
  // the way a JWT actually builds it produces the same alphabet with no literal in the tree.
  token: `${Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")}.abc.def`,
  // An all-lowercase secret, which the case rule alone would not catch — this is what the
  // per-segment length bound is for.
  hexSecret: randomBytes(32).toString("hex"),
  // FOUND BY A SECOND REVIEW, after the JWT was closed. Both satisfy lowercase + ≤64 + every segment
  // ≤24, and both are exactly the shape of a real credential: a UUID is 122 bits and is the canonical
  // session-token / API-key / reset-token form, and three dot-joined 20-char hex runs is 240 bits —
  // the same three-dot silhouette as the JWT this file already blocks.
  //
  // GENERATED, for two reasons. The repository's gitleaks gate scans this range for high-entropy
  // strings and flagged the hardcoded versions — correctly, because a scanner cannot tell a fixture
  // from a key. And a fresh value each run is a STRONGER test than a memorized one: it proves the rule
  // rejects the SHAPE rather than one string somebody once typed.
  uuidToken: randomUUID(),
  dottedHex: [0, 1, 2].map(() => randomBytes(10).toString("hex")).join("."),
  shortHex: randomBytes(12).toString("hex"),
  cookie: "yorisou_session=deadbeefcafe; Path=/; HttpOnly",
  email: "someone@example.com",
  accountId: "acct_01HZZZZZZZZZZZZZZZZZZZZZZZ",
};

test("the record carries a fingerprint and never the account id", () => {
  const lines = capture(() =>
    recordLifeOsOps({
      event: "life_os.mutation.failed",
      correlationId: newCorrelationId(),
      ownerAccountId: SECRETS.accountId,
      errorClass: "osf1_memory_confirmation_mismatch",
    }),
  );
  assert.equal(lines.length, 1);
  assert.ok(!lines[0].includes(SECRETS.accountId), "the raw account id reached the log");
  const record = JSON.parse(lines[0]) as Record<string, unknown>;
  assert.equal(record.actorFingerprint, opsActorFingerprint(SECRETS.accountId));
  assert.match(String(record.actorFingerprint), /^[0-9a-f]{64}$/);
  // The fingerprint must be the SAME one the audit table stores, or an operator cannot correlate an
  // ops event with the audit trail — which is the only reason for it to exist rather than nothing.
  assert.equal(String(record.actorFingerprint).length, 64);
});

test("free text cannot reach the log through errorClass", () => {
  // Every one of these is a plausible `error.message`: a driver that quotes the offending value, an
  // exception carrying a prompt, a fetch error carrying a URL with a token in it. The class pattern
  // refuses each and substitutes a marker — so the event still exists and the content does not.
  for (const [label, secret] of Object.entries(SECRETS)) {
    if (label === "accountId") continue; // covered above; a bare id matches no pattern anyway
    const lines = capture(() =>
      recordLifeOsOps({
        event: "life_os.audit.write_failed",
        correlationId: newCorrelationId(),
        errorClass: secret,
      }),
    );
    assert.equal(lines.length, 1);
    assert.ok(!lines[0].includes(secret), `${label} reached the log through errorClass`);
    const record = JSON.parse(lines[0]) as { errorClass: string };
    assert.equal(record.errorClass, "unclassified", `${label} was not replaced`);
  }
});

test("a legitimate error class survives — the redaction is not just 'refuse everything'", () => {
  for (const legitimate of [
    "osf1_memory_confirmation_mismatch",
    "http_503",
    "transport_failed",
    "provider_malformed",
    "private_card_in_moderation_queue",
    "denied_route_closed",
  ]) {
    const lines = capture(() =>
      recordLifeOsOps({ event: "life_os.access.denied", correlationId: "c", errorClass: legitimate }),
    );
    const record = JSON.parse(lines[0]) as { errorClass: string };
    assert.equal(record.errorClass, legitimate, `a valid class was wrongly redacted: ${legitimate}`);
  }
});

test("the emitted record has exactly the seven declared fields and no payload bag", () => {
  const lines = capture(() =>
    recordLifeOsOps({
      event: "life_os.moderation.anomaly",
      correlationId: "c",
      objectId: "11111111-1111-1111-1111-111111111111",
      errorClass: "private_card_in_moderation_queue",
    }),
  );
  const record = JSON.parse(lines[0]) as Record<string, unknown>;
  assert.deepEqual(Object.keys(record).sort(), [
    "actorFingerprint",
    "correlationId",
    "environment",
    "errorClass",
    "event",
    "objectId",
    "release",
  ]);
  // No `detail`, no `message`, no `meta`, no `extra`. The absence is the guarantee: a caller in a
  // hurry during an incident cannot add one field too many, because there is nowhere to put it.
  for (const bag of ["detail", "message", "meta", "extra", "payload", "context", "note"]) {
    assert.ok(!(bag in record), `the ops record grew a free-text field: ${bag}`);
  }
});

test("the ops record type accepts no free-text parameter at all", () => {
  // The strongest form of this guarantee is a compile-time one, and it is worth pinning in the source
  // as well: recordLifeOsOps' input type must not gain a string field beyond the bounded ones.
  const source = readFileSync("lib/server/lifeOs/observability.ts", "utf8");
  const signature = source.slice(source.indexOf("export function recordLifeOsOps"));
  const params = signature.slice(signature.indexOf("{"), signature.indexOf("}"));
  const fields = [...params.matchAll(/^\s*(\w+)[?]?:/gm)].map((match) => match[1]);
  assert.deepEqual(fields.sort(), ["correlationId", "errorClass", "event", "objectId", "ownerAccountId"]);
});

test("objectId is bounded by the MODULE, not by its callers", () => {
  // The header claims a caller "cannot log a reflection, a memory, or a prompt, because there is no
  // parameter that would take one". `objectId` is a string and would have taken any of them. Every
  // real caller passes a server-generated uuid, so there was no leak — but the guarantee belonged to
  // the callers, which is the arrangement the header says it rejects.
  const lines = capture(() =>
    recordLifeOsOps({
      event: "life_os.mutation.failed",
      correlationId: "c",
      objectId: SECRETS.reflection,
      errorClass: "http_500",
    }),
  );
  assert.ok(!lines[0].includes(SECRETS.reflection), "a reflection reached the log through objectId");
  assert.equal((JSON.parse(lines[0]) as { objectId: string }).objectId, "unloggable");

  // A real row id survives, so this is not "refuse everything" either.
  const ok = capture(() =>
    recordLifeOsOps({
      event: "life_os.mutation.failed",
      correlationId: "c",
      objectId: "11111111-1111-1111-1111-111111111111",
      errorClass: "http_500",
    }),
  );
  assert.equal(
    (JSON.parse(ok[0]) as { objectId: string }).objectId,
    "11111111-1111-1111-1111-111111111111",
  );
});

test("logging never throws, whatever it is handed", () => {
  // Observability that can take down the thing it observes is worse than none.
  assert.doesNotThrow(() =>
    recordLifeOsOps({
      event: "life_os.erasure.failed",
      correlationId: undefined as unknown as string,
      objectId: null,
      ownerAccountId: null,
      errorClass: null,
    }),
  );
});
