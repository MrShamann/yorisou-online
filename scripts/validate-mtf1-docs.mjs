#!/usr/bin/env node
// MTF-1 documentation-package validator (NON-RUNTIME; validates docs only).
// Scope: structural consistency of docs/yorisou/mtf1/. It reads Markdown, parses the
// frozen universe block, and asserts the §6 MTF-1 rules. It modifies NO application
// state, imports NO runtime module, and touches NO database.

import { readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "docs/yorisou/mtf1");
const read = (f) => readFileSync(join(DIR, f), "utf8");

const universeDoc = read("MTF1_LAUNCH_TEST_UNIVERSE.md");
const matrixDoc = read("MTF1_METHOD_SOURCE_RIGHTS_MATRIX.md");
const contractDoc = read("MTF1_DYNAMIC_TEST_ENGINE_CONTRACT.md");
const adapterDoc = read("MTF1_EXISTING_ENGINE_ADAPTER_MAP.md");

let failures = 0;
const fail = (msg) => { console.error(`FAIL: ${msg}`); failures += 1; };
const ok = (msg) => console.log(`  ok  ${msg}`);

// ── Parse the frozen universe block (constrained flat YAML) ──────────────────
const block = universeDoc.match(/```yaml\n([\s\S]*?)```/);
if (!block) { fail("no fenced yaml universe block found"); process.exit(1); }
const methods = [];
let cur = null;
for (const raw of block[1].split("\n")) {
  const m = raw.match(/^- method_id:\s*(.+)$/);
  if (m) { cur = { method_id: m[1].trim() }; methods.push(cur); continue; }
  const kv = raw.match(/^ {2}([a-z_]+):\s*(.+)$/);
  if (kv && cur) cur[kv[1]] = kv[2].trim();
}
ok(`parsed ${methods.length} universe entries`);

// ── §6.1 the 10 Launch Core IDs, each exactly once ───────────────────────────
const CORE = [
  "imairo-120q", "c02-current-state", "relationship-fatigue-24q", "love-distance",
  "work-rhythm", "name-impression", "daily-check-in", "relationship-pair-check",
  "yorisou-values", "image-color-reflection",
];
const coreRows = methods.filter((m) => m.launch_group === "launch_core");
for (const id of CORE) {
  const hits = methods.filter((m) => m.method_id === id);
  if (hits.length !== 1) fail(`core method ${id} appears ${hits.length}× (must be exactly 1)`);
  else if (hits[0].launch_group !== "launch_core") fail(`${id} is not in launch_core`);
}
if (coreRows.length !== 10) fail(`launch_core has ${coreRows.length} members (must be 10)`);
else ok("Launch Core = exactly the 10 frozen methods");

// ── §6.2 groups disjoint (each method in exactly one group) ──────────────────
const GROUPS = ["launch_core", "launch_supporting", "rights_review_queue", "later_cultural_systems"];
const seen = new Map();
for (const m of methods) {
  if (!GROUPS.includes(m.launch_group)) fail(`${m.method_id}: unknown launch_group "${m.launch_group}"`);
  if (seen.has(m.method_id)) fail(`duplicate method_id ${m.method_id}`);
  seen.set(m.method_id, m.launch_group);
}
ok("groups are disjoint (no method in two groups; no duplicates)");

// ── §6.3–6.5 required fields on every method ─────────────────────────────────
const RIGHTS = [
  "YORISOU_ORIGINAL_EXISTING", "YORISOU_ORIGINAL_REBUILD_CANDIDATE",
  "PUBLIC_DOMAIN_REIMPLEMENTATION_REVIEW", "OPEN_LICENSE_REVIEW",
  "LICENSED_INTEGRATION_REQUIRED", "OFFICIAL_HANDOFF_OR_USER_IMPORT_ONLY",
  "TRADITIONAL_SOURCE_AND_SCHOOL_REVIEW", "BLOCKED_OR_NOT_RECOMMENDED",
];
for (const m of methods) {
  if (!RIGHTS.includes(m.rights_route)) fail(`${m.method_id}: missing/invalid rights_route`);
  if (!m.evidence_class) fail(`${m.method_id}: missing evidence_class`);
  if (!/^P[1-5]_/.test(m.privacy_class ?? "")) fail(`${m.method_id}: missing/invalid privacy_class`);
}
ok("every method has rights_route + evidence_class + privacy_class");

// ── §6.6 no Launch Core method is BLOCKED_OR_NOT_RECOMMENDED ─────────────────
for (const m of coreRows) {
  if (m.rights_route === "BLOCKED_OR_NOT_RECOMMENDED") fail(`core method ${m.method_id} is BLOCKED`);
}
ok("no Launch Core method is BLOCKED_OR_NOT_RECOMMENDED");

// ── §6.7 no external/traditional method publicly active without rights evidence
for (const m of methods) {
  if (m.activation_state === "public_active") fail(`${m.method_id} claims public_active (nothing may, in this frozen universe)`);
  const external = !m.rights_route.startsWith("YORISOU_ORIGINAL");
  if (external && m.activation_state !== "planned_unbuilt" && m.activation_state !== "gated") {
    fail(`external/traditional ${m.method_id} has activation_state ${m.activation_state} without rights evidence`);
  }
}
ok("no method public_active; external/traditional methods all unbuilt/gated");

// ── §6.8 s01-omikuji cannot contribute psychology evidence ───────────────────
const s01 = methods.find((m) => m.method_id === "s01-omikuji");
if (!s01) fail("s01-omikuji missing from universe");
else {
  if (s01.evidence_class !== "traditional_symbolic_entertainment") fail("s01-omikuji evidence_class must be traditional_symbolic_entertainment");
  if (s01.cross_method_role !== "none_entertainment_only") fail("s01-omikuji cross_method_role must be none_entertainment_only");
  if (s01.recommendation_role !== "none_entertainment_only") fail("s01-omikuji recommendation_role must be none_entertainment_only");
  if (s01.launch_group !== "launch_supporting") fail("s01-omikuji must be launch_supporting (never core)");
  ok("s01-omikuji is entertainment-classified and evidence-isolated");
}

// ── §6.9 MBTI remains import/handoff/licensed only ───────────────────────────
if (methods.some((m) => m.method_id === "mbti-import-handoff")) {
  fail("mbti-import-handoff must NOT be a launch-group member");
}
if (!/mbti-import-handoff[\s\S]{0,600}?(import|handoff)/i.test(matrixDoc) || !matrixDoc.includes("OFFICIAL_HANDOFF_OR_USER_IMPORT_ONLY")) {
  fail("rights matrix must pin MBTI to OFFICIAL_HANDOFF_OR_USER_IMPORT_ONLY");
} else ok("MBTI pinned to import/official-handoff only (outside launch groups)");

// ── §6.10 no universal score ─────────────────────────────────────────────────
if (!/No universal cross-method score exists/i.test(contractDoc) || !/No universal cross-method score/i.test(universeDoc)) {
  fail("the no-universal-score rule must be stated in both the contract and the universe");
} else ok("no-universal-score rule present in contract + universe");
if (methods.some((m) => "universal_score" in m)) fail("a method declares a universal_score field");

// ── §6.11 120Q is not the engine architecture ────────────────────────────────
if (!/120Q is an adapter, not the engine/i.test(contractDoc) || !/must not be a thin alias|must NOT be designed as a thin alias/i.test(contractDoc + adapterDoc)) {
  fail("contract/adapter map must state 120Q is an adapter, never the engine");
} else ok("120Q positioned as adapter, not engine");

// ── §6.12 iOS/Android are channels, not logic holders ────────────────────────
if (!/channels, not separate holders of core logic/i.test(contractDoc)) {
  fail("contract must state iOS/Android are channels, not holders of core logic");
} else ok("iOS/Android positioned as channels only");

// ── cross-doc: every universe method appears in the rights matrix ────────────
for (const m of methods) {
  if (!matrixDoc.includes(m.method_id)) fail(`${m.method_id} missing from rights matrix`);
}
ok("every universe method has a rights-matrix row");

if (failures) { console.error(`\n${failures} MTF-1 validation failure(s).`); process.exit(1); }
console.log(`\nMTF-1 docs package VALID — ${methods.length} methods (10 core / ${methods.filter((m)=>m.launch_group==="launch_supporting").length} supporting / ${methods.filter((m)=>m.launch_group==="rights_review_queue").length} rights-review / ${methods.filter((m)=>m.launch_group==="later_cultural_systems").length} later-cultural).`);
