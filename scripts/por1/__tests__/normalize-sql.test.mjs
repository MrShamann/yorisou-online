// POR-1 M1-A — the boolean normalizer is the riskiest pure logic in the promotion compiler.
//
// It exists to stop one specific false failure: PostgreSQL flattens a nested AND when it re-parses
// an expression, so a CHECK constraint round-trips to a different rendering of the same predicate.
// A normalizer that is too aggressive would hide a REAL change to a constraint — which is exactly
// the thing the contract test is supposed to catch. So the decisive cases here are the negative
// ones: the tests that prove it leaves precedence alone.

import assert from "node:assert/strict";
import test from "node:test";

import { normalizeBooleanExpression, normalizeDefinition } from "../normalize-sql.mjs";

// ── THE CASE THAT MOTIVATED IT ───────────────────────────────────────────────

test("the observed round-trip: a nested AND flattens into its parent chain", () => {
  const fromPreview =
    "(d IS NULL) OR (k = ANY (ARRAY['email'::text])) OR (((char_length(d) >= 1) AND (char_length(d) <= 200)) AND (d !~ '@'::text))";
  const afterRoundTrip =
    "(d IS NULL) OR (k = ANY (ARRAY['email'::text])) OR ((char_length(d) >= 1) AND (char_length(d) <= 200) AND (d !~ '@'::text))";
  assert.equal(normalizeBooleanExpression(fromPreview), normalizeBooleanExpression(afterRoundTrip));
});

test("a whole constraint definition normalizes to the same string either way", () => {
  const a = "CHECK ((((a > 0) AND (b > 0)) AND (c > 0)))";
  const b = "CHECK (((a > 0) AND (b > 0) AND (c > 0)))";
  assert.equal(normalizeDefinition(a), normalizeDefinition(b));
});

// ── THE NEGATIVE CONTROLS — what it must NEVER collapse ──────────────────────

test("a differently-grouped MIXED expression stays different", () => {
  // `(A OR B) AND C` and `A OR (B AND C)` are not the same predicate, and a normalizer that made
  // them compare equal would let a genuine constraint change through the gate.
  const grouped = "(a OR b) AND c";
  const other = "a OR (b AND c)";
  assert.notEqual(normalizeBooleanExpression(grouped), normalizeBooleanExpression(other));
});

test("an OR nested inside an AND keeps its parentheses", () => {
  assert.equal(normalizeBooleanExpression("(a OR b) AND c"), "(a OR b) AND c");
  assert.equal(normalizeBooleanExpression("(a AND b) OR c"), "(a AND b) OR c");
});

test("a changed bound, operator or column still differs", () => {
  const base = "((char_length(d) >= 1) AND (char_length(d) <= 200))";
  for (const changed of [
    "((char_length(d) >= 1) AND (char_length(d) <= 201))",
    "((char_length(d) > 1) AND (char_length(d) <= 200))",
    "((char_length(e) >= 1) AND (char_length(d) <= 200))",
    "((char_length(d) >= 1) OR (char_length(d) <= 200))",
  ]) {
    assert.notEqual(
      normalizeBooleanExpression(base),
      normalizeBooleanExpression(changed),
      `must not treat "${changed}" as equal to the original`,
    );
  }
});

test("a dropped conjunct is not hidden", () => {
  const three = "(a AND b AND c)";
  const two = "(a AND b)";
  assert.notEqual(normalizeBooleanExpression(three), normalizeBooleanExpression(two));
});

// ── STRING LITERALS ARE NOT STRUCTURE ────────────────────────────────────────

test("AND / OR inside a string literal is not an operator", () => {
  // A predicate comparing against the literal 'a AND b' must not be split there.
  const expr = "(x = 'a AND b') AND (y = 1)";
  assert.equal(normalizeBooleanExpression(expr), "(x = 'a AND b') AND (y = 1)");
});

test("parentheses inside a string literal do not unbalance the scan", () => {
  const expr = "(x !~ '\\s(') AND (y = 2)";
  assert.equal(normalizeBooleanExpression(expr), "(x !~ '\\s(') AND (y = 2)");
});

test("an escaped quote inside a literal is handled", () => {
  const expr = "(x = 'it''s') AND (y = 3)";
  assert.equal(normalizeBooleanExpression(expr), "(x = 'it''s') AND (y = 3)");
});

// ── IDENTIFIERS THAT CONTAIN THE OPERATOR NAMES ──────────────────────────────

test("a column named like an operator is not treated as one", () => {
  assert.equal(normalizeBooleanExpression("(brand = 1)"), "(brand = 1)");
  assert.equal(normalizeBooleanExpression("(orders > 0)"), "(orders > 0)");
});

// ── DEGENERATE INPUT ─────────────────────────────────────────────────────────

test("expressions with no boolean operator are returned unchanged", () => {
  assert.equal(normalizeBooleanExpression("(a > 0)"), "(a > 0)");
  assert.equal(normalizeBooleanExpression("a > 0"), "a > 0");
  assert.equal(normalizeBooleanExpression(""), "");
});

test("normalizeDefinition leaves the statement scaffolding alone", () => {
  assert.equal(
    normalizeDefinition("FOREIGN KEY (job_id) REFERENCES yorisou_account_deletion_jobs(id) ON DELETE CASCADE"),
    "FOREIGN KEY (job_id) REFERENCES yorisou_account_deletion_jobs(id) ON DELETE CASCADE",
  );
  assert.equal(normalizeDefinition("PRIMARY KEY (id)"), "PRIMARY KEY (id)");
});

test("normalizeDefinition is idempotent", () => {
  const once = normalizeDefinition("CHECK ((((a > 0) AND (b > 0)) AND (c > 0)))");
  assert.equal(normalizeDefinition(once), once);
});
