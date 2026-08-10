// §14 D — the authority diagnostic. It exists so an operator can learn WHICH invariant failed
// without the SQL ever telling an attacker. Its whole contract is: booleans, and nothing else.
import assert from "node:assert/strict";
import test from "node:test";

import {
  ERASURE_AUTHORITY_FACT_KEYS,
  deriveErasureAuthorityFacts,
  firstFailingErasureInvariant,
  toBoundedLogRecord,
  type ErasureAuthorityJobRow,
} from "../por1ErasureAuthorityDiagnostic";

const NOW = new Date("2026-08-10T04:00:00.000Z");
const OWNER = "acct_1786333733479_85aae66c3275";
const TOKEN = "a".repeat(64);

const healthyRow = (over: Partial<ErasureAuthorityJobRow> = {}): ErasureAuthorityJobRow => ({
  ownerAccountId: OWNER,
  state: "failed_retryable",
  executionCursor: "database_erasure",
  irreversibleStartedAt: "2026-08-10T03:49:28.000Z",
  executorTokenHash: TOKEN,
  executorGeneration: 1,
  executorExpiresAt: "2026-08-10T04:01:00.000Z",
  manifestPresent: true,
  ...over,
});

const expected = { ownerAccountId: OWNER, executorTokenHash: TOKEN, executorGeneration: 1 };

test("all invariants hold → every fact true and nothing is reported as failing", () => {
  const facts = deriveErasureAuthorityFacts(healthyRow(), expected, NOW);
  for (const key of ERASURE_AUTHORITY_FACT_KEYS) assert.equal(facts[key], true, key);
  assert.equal(firstFailingErasureInvariant(facts), null);
});

test("every reported field is a boolean, for every input shape", () => {
  const rows: Array<ErasureAuthorityJobRow | null> = [
    null,
    healthyRow(),
    healthyRow({ executorTokenHash: null, executorGeneration: null, executorExpiresAt: null }),
    healthyRow({ state: null, executionCursor: null, irreversibleStartedAt: null, ownerAccountId: null }),
  ];
  for (const row of rows) {
    const facts = deriveErasureAuthorityFacts(row, expected, NOW);
    for (const key of ERASURE_AUTHORITY_FACT_KEYS) {
      assert.equal(typeof facts[key], "boolean", `${key} must be boolean`);
    }
  }
});

test("each predicate failure produces the correct boolean shape", () => {
  const cases: Array<[Partial<ErasureAuthorityJobRow>, keyof typeof expected | string]> = [
    [{ ownerAccountId: "acct_someone_else" }, "ownerMatches"],
    [{ state: "completed" }, "stateAllowed"],
    [{ manifestPresent: false }, "manifestExists"],
    [{ irreversibleStartedAt: null }, "irreversibleStarted"],
    [{ executionCursor: "storage_erasure" }, "cursorMatches"],
    [{ executorTokenHash: null }, "tokenPresent"],
    [{ executorTokenHash: "b".repeat(64) }, "tokenMatches"],
    [{ executorGeneration: 2 }, "generationMatches"],
    [{ executorExpiresAt: "2026-08-10T03:00:00.000Z" }, "leaseLive"],
  ];
  for (const [over, expectFalse] of cases) {
    const facts = deriveErasureAuthorityFacts(healthyRow(over), expected, NOW);
    assert.equal(
      (facts as unknown as Record<string, boolean>)[expectFalse as string],
      false,
      `${expectFalse} must be false`,
    );
  }
});

test("a missing job makes every fact false rather than unknown", () => {
  const facts = deriveErasureAuthorityFacts(null, expected, NOW);
  for (const key of ERASURE_AUTHORITY_FACT_KEYS) assert.equal(facts[key], false, key);
  assert.equal(firstFailingErasureInvariant(facts), "jobExists");
});

// ── THE LEAK GUARD ──────────────────────────────────────────────────────────

test("no raw id, token, generation, email or timestamp can enter the log record", () => {
  const row = healthyRow({
    ownerAccountId: "acct_secret_owner_id",
    executorTokenHash: "deadbeef".repeat(8),
    executorGeneration: 42,
    executorExpiresAt: "2026-08-10T04:01:00.000Z",
  });
  const facts = deriveErasureAuthorityFacts(row, expected, NOW);
  const record = toBoundedLogRecord(facts);
  const serialized = JSON.stringify(record);

  for (const forbidden of [
    "acct_secret_owner_id",
    "deadbeef",
    "42",
    "2026-08-10",
    OWNER,
    TOKEN,
  ]) {
    assert.ok(!serialized.includes(forbidden), `must not contain ${forbidden}`);
  }

  // Everything except the single invariant NAME must be a boolean.
  for (const [key, value] of Object.entries(record)) {
    if (key === "firstFailingInvariant") {
      assert.ok(ERASURE_AUTHORITY_FACT_KEYS.includes(value as never), "only an invariant name");
      continue;
    }
    assert.equal(typeof value, "boolean", `${key} must be boolean`);
  }
});

test("the log record's keys are a fixed allowlist, so a new field cannot leak by being forgotten", () => {
  const record = toBoundedLogRecord(deriveErasureAuthorityFacts(healthyRow(), expected, NOW));
  assert.deepEqual(Object.keys(record).sort(), [...ERASURE_AUTHORITY_FACT_KEYS].sort());
});

test("token comparison does not accept a prefix or a different length", () => {
  const facts = deriveErasureAuthorityFacts(healthyRow({ executorTokenHash: "a".repeat(63) }), expected, NOW);
  assert.equal(facts.tokenMatches, false);
});
