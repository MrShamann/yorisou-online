// RTR-1 — contract tests for the private IMAIRO-120Q result snapshot.
// Guards: deterministic approved-content-only snapshot, provenance grammar,
// no answers stored, migration/code constant parity, protected boundaries.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  buildImairoResultSnapshot,
  IMAIRO_SNAPSHOT_TEST_ID,
  IMAIRO_SNAPSHOT_TEST_VERSION,
  IMAIRO_SNAPSHOT_SCORING_VERSION,
} from "../../yorisou/public-result/snapshot";
import { PUBLIC_ARCHETYPE_TAXONOMY, findPublicArchetypeContentByCode } from "../../yorisou/public-result";
import { SOURCE_LABEL } from "../../../app/result/reveal/revealContent";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");

// 1. Snapshot is deterministic, taxonomy-sourced, and never invents copy.
for (const archetype of PUBLIC_ARCHETYPE_TAXONOMY) {
  const snapshot = buildImairoResultSnapshot({ resultId: archetype.publicCode, overlayId: null, confidenceBand: "low", payloadKey: null });
  assert.ok(snapshot, `snapshot built for ${archetype.publicCode}`);
  assert.equal(snapshot.resultId, archetype.publicCode);
  assert.ok(snapshot.resultTitle.includes(archetype.nickname), "title uses approved nickname");
  assert.ok(snapshot.resultTitle.includes(`${archetype.clanJapanese}のタイプ`), "title uses the approved public type label");
  const content = findPublicArchetypeContentByCode(archetype.publicCode);
  if (content) {
    assert.ok(snapshot.publicSummary.startsWith(content.recognitionLine), "summary starts with approved recognition line");
    assert.deepEqual(
      snapshot.topDimensions.map((d) => d.label),
      content.highlights.map((h) => h.label),
      "dimensions are the approved highlight labels",
    );
  }
  assert.ok(snapshot.publicSummary.includes("診断ではなく"), "summary carries the merged non-diagnostic note");
  assert.equal(snapshot.stateTag, `${archetype.clanJapanese}のタイプ`, "state tag is the approved public type label");
  // Identical inputs → identical snapshot (determinism).
  assert.deepEqual(snapshot, buildImairoResultSnapshot({ resultId: archetype.publicCode, overlayId: null, confidenceBand: "low", payloadKey: null }));
}

// 2. Unknown or absent result codes produce no snapshot (no invented results).
assert.equal(buildImairoResultSnapshot({ resultId: null, overlayId: null, confidenceBand: "low", payloadKey: null }), null);
assert.equal(buildImairoResultSnapshot({ resultId: "NOT-A-CODE", overlayId: null, confidenceBand: "low", payloadKey: null }), null);

// 3. Provenance uses the Package 9 source-type grammar; nothing is stored as
// user-confirmed fact; AI inference is not present at all.
const sample = buildImairoResultSnapshot({ resultId: PUBLIC_ARCHETYPE_TAXONOMY[0].publicCode, overlayId: null, confidenceBand: "medium", payloadKey: "k" })!;
for (const sourceType of Object.values(sample.snapshotContext.sourceTypes)) {
  assert.ok(sourceType in SOURCE_LABEL, `source type ${sourceType} is part of the approved grammar`);
}
assert.ok(!Object.values(sample.snapshotContext.sourceTypes).includes("USER_CONFIRMED" as never), "nothing stored as user-confirmed fact");
assert.ok(!Object.values(sample.snapshotContext.sourceTypes).includes("AI_GENERATED_INTERPRETATION" as never), "no AI inference in the snapshot");
assert.equal(sample.snapshotContext.capturedAs, "current_state");
assert.equal(sample.snapshotContext.route.confidenceBand, "medium");

// 4. No answers are persisted for snapshots; provenance goes to snapshot_context.
const store = read("lib/server/testResults.ts");
assert.ok(store.includes("createSavedImairoSnapshotForOwner"), "snapshot creator present");
assert.ok(/answers:\s*\{\}/.test(store), "snapshot rows persist an empty answers object (no answers exist at this layer)");
assert.ok(store.includes("snapshot_context: snapshot.snapshotContext"), "provenance persisted to snapshot_context");
assert.ok(store.includes("reused: true"), "duplicate save is idempotent (returns existing active row)");

// 5. Migration and code constants stay in lockstep.
const migration = read("supabase/migrations/202607160001_imairo_public_result_snapshot.sql");
assert.ok(migration.includes(`'${IMAIRO_SNAPSHOT_TEST_ID}'`), "migration admits the snapshot test_id");
assert.ok(migration.includes(`'${IMAIRO_SNAPSHOT_TEST_VERSION}'`), "migration admits the snapshot test_version");
assert.ok(migration.includes(`'${IMAIRO_SNAPSHOT_SCORING_VERSION}'`), "migration admits the snapshot scoring_version");
assert.ok(migration.includes("'RELATIONSHIP-FATIGUE'") && migration.includes("'relationship_fatigue_mvp_v0_1'") && migration.includes("'v0.1'"), "migration closes the RF constraint drift");
assert.ok(migration.includes("snapshot_context") && migration.includes("add column if not exists"), "snapshot_context added idempotently");
const migrationSql = migration.split("\n").filter((line) => !line.trimStart().startsWith("--")).join("\n");
assert.ok(!/\b(drop table|delete from|truncate|drop column)\b/i.test(migrationSql), "migration is non-destructive");

// 6. Return path is allowlisted for LINE login and uses the safe next param.
const lineStart = read("app/api/line/auth/start/route.ts");
assert.ok(lineStart.includes("\\/result\\/return"), "LINE returnTo allowlist admits /result/return");
const saveComponent = read("app/result/PrivateResultSave.tsx");
assert.ok(saveComponent.includes("/login?next="), "web login preserves the return path");
assert.ok(saveComponent.includes("returnTo=") && saveComponent.includes("/result/return"), "LINE login preserves the return path");

// 7. Protected boundaries: the save surface adds no network sends beyond the
// owned APIs, no LINE messaging, and the reveal (YRR-1) contract is untouched.
for (const file of ["app/result/PrivateResultSave.tsx", "app/result/pendingSave.ts", "app/result/return/page.tsx", "lib/yorisou/public-result/snapshot.ts"]) {
  const src = read(file);
  assert.ok(!/line\.me|liff|message|push|broadcast/i.test(src.replace(/LINEでログイン|LINE login preserves/g, "")), `no LINE messaging in ${file}`);
}
const page = read("app/result/page.tsx");
assert.ok(page.includes("compatibility.assignment ? (") && page.includes("<PrivateResultSave"), "save renders only for a real assignment");
assert.ok(page.indexOf("<PrivateResultSave") > page.indexOf("]} />"), "save section stays outside the staged reveal (YRR-1 intact)");

// 8. The 120Q bank, scoring and taxonomy files are only read, never redefined here.
const snapshotSource = read("lib/yorisou/public-result/snapshot.ts");
assert.ok(!snapshotSource.includes("defineArchetype") && !snapshotSource.includes("defineContent"), "snapshot module defines no taxonomy content");

console.log("Imairo snapshot contract checks passed: 8 groups");
