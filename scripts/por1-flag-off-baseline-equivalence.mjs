#!/usr/bin/env node
// POR-1 WS6 — FLAG_OFF_BASELINE_EQUIVALENCE.
//
// The claim this gate defends: with all four POR-1 controls unset, the application serves exactly
// what Production serves today. Nothing new is reachable, and no new refusal screen appears in
// place of an old behaviour.
//
// It is a SOURCE gate, and it says so. It proves that every canonical entry point routes its row id
// through `canonicalRowIdWhenEnabled` (so an unset control drops the parameter and the pre-existing
// else-branch runs) and that the deletion executor is refused at its route. It does NOT prove
// rendered-output equivalence — that is what the hosted acceptance run at a fixed SHA is for. A
// green result here is a necessary condition, not the whole claim.

import { readFileSync } from "node:fs";

const CAPABILITIES = [
  "CANONICAL_CORE",
  "CANONICAL_RECOMMENDATIONS",
  "LINE_CANONICAL_RETURN",
  "ACCOUNT_DELETION_EXECUTOR",
];

/** Every place a canonical row id enters the application, and the control that must gate it. */
const CANONICAL_ENTRY_POINTS = [
  ["app/result/resultMode.ts", "CANONICAL_CORE"],
  ["app/reports/self-understanding/[publicCode]/page.tsx", "CANONICAL_CORE"],
  ["app/reports/self-understanding/[publicCode]/download/route.ts", "CANONICAL_CORE"],
  ["app/recommendations/page.tsx", "CANONICAL_RECOMMENDATIONS"],
  ["app/recommendations/graph/page.tsx", "CANONICAL_RECOMMENDATIONS"],
  ["app/line/mini-app/page.tsx", "LINE_CANONICAL_RETURN"],
];

/** Surfaces that must refuse outright rather than fall through — they have no legacy counterpart. */
const GUARDED_ROUTES = [["app/api/account/deletion-confirm/route.ts", "ACCOUNT_DELETION_EXECUTOR"]];

const failures = [];
const checks = [];

function read(path) {
  try {
    return readFileSync(path, "utf8");
  } catch {
    failures.push(`${path}: missing — a gated entry point was deleted or moved`);
    return null;
  }
}

// 1. Every control is refused when its environment variable is unset.
for (const capability of CAPABILITIES) {
  const name = `YORISOU_POR1_${capability}`;
  if (process.env[name] !== undefined) {
    failures.push(`${name} is set in this environment; the gate must run against an unset baseline`);
  } else {
    checks.push(`${name} unset → fails closed`);
  }
}

// 2. Canonical entry points drop the row id when their control is off.
for (const [path, capability] of CANONICAL_ENTRY_POINTS) {
  const source = read(path);
  if (source === null) continue;
  // Match the CALL, not the import. An earlier version of this gate tested for the identifier
  // anywhere in the file and therefore passed a surface that imported the helper and then never
  // used it — the exact regression it exists to catch.
  const body = source
    .split("\n")
    .filter((line) => !/^\s*import\s/.test(line))
    .join("\n");
  const callAt = body.indexOf("canonicalRowIdWhenEnabled(");
  if (callAt === -1) {
    failures.push(`${path}: canonical row id is read without a canonicalRowIdWhenEnabled(...) call`);
    continue;
  }
  // A fixed window rather than paren balancing: the argument list contains nested calls of its own,
  // so "up to the first close paren" reads only the inner one.
  const argumentWindow = body.slice(callAt, callAt + 300);
  if (!argumentWindow.includes(`"${capability}"`)) {
    failures.push(`${path}: gated, but not by ${capability}`);
    continue;
  }
  checks.push(`${path} → ${capability}`);
}

// 3. The deletion executor is refused at its route, before any job is opened.
for (const [path, capability] of GUARDED_ROUTES) {
  const source = read(path);
  if (source === null) continue;
  const guardAt = source.indexOf(`requirePor1Capability("${capability}")`);
  const firstJobAt = source.indexOf("openDeletionJob(");
  if (guardAt === -1) {
    failures.push(`${path}: no requirePor1Capability("${capability}") guard`);
  } else if (firstJobAt !== -1 && firstJobAt < guardAt) {
    failures.push(`${path}: a deletion job is opened before the capability guard`);
  } else {
    checks.push(`${path} → ${capability} refused before any state change`);
  }
}

// 4. The controls module itself must not treat any value but an exact "on" as enabled.
const controls = read("lib/server/por1RuntimeControls.ts");
if (controls && !controls.includes('=== "on"')) {
  failures.push("lib/server/por1RuntimeControls.ts: enablement is not an exact \"on\" comparison");
} else if (controls) {
  checks.push("enablement requires an exact \"on\"");
}

for (const line of checks) console.log(`  ok   ${line}`);
for (const line of failures) console.error(`  FAIL ${line}`);

if (failures.length > 0) {
  console.error(`\nFLAG_OFF_BASELINE_EQUIVALENCE: FAILED (${failures.length})`);
  process.exit(1);
}
console.log(`\nFLAG_OFF_BASELINE_EQUIVALENCE: PASSED (${checks.length} checks, source-level)`);
