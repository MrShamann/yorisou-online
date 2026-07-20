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
  if (!m.method_evidence_class) fail(`${m.method_id}: missing method_evidence_class (MTF-1.1 canonical name)`);
  if (!/^P[1-5]_/.test(m.privacy_class ?? "")) fail(`${m.method_id}: missing/invalid privacy_class`);
}
ok("every method has rights_route + method_evidence_class + privacy_class");

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
  if (s01.method_evidence_class !== "traditional_symbolic_entertainment") fail("s01-omikuji method_evidence_class must be traditional_symbolic_entertainment");
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

// ═══ MTF-1.1 EXPANSION (§9 checks 1–15) ══════════════════════════════════════
const standardDoc = read("MTF1_TEST_ORIGINALIZATION_STANDARD.md");

// 1–2. method_evidence_class present on every entry; old field name absent
if (methods.some((m) => !m.method_evidence_class)) fail("1.1-1: an entry lacks method_evidence_class");
else ok("1.1-1: method_evidence_class on every universe entry");
if (/^\s{2}evidence_class:/m.test(block[1])) fail("1.1-2: old method-level `evidence_class` field still present in the universe block");
else ok("1.1-2: old method-level evidence_class field absent from the universe block");

// 3. contract uses methodEvidenceClass (and not a bare evidenceClass identity field)
if (!contractDoc.includes("methodEvidenceClass: MethodEvidenceClass")) fail("1.1-3: contract identity must use methodEvidenceClass");
else if (/^\s*evidenceClass:/m.test(contractDoc)) fail("1.1-3: contract still declares a bare evidenceClass field");
else ok("1.1-3: contract uses methodEvidenceClass");

// 4. CPV1 observation-level EvidenceClass remains explicitly separate (two-axis rule stated)
if (!/observation-level `?EvidenceClass`?/.test(contractDoc) || !/never (be )?collapsed/i.test(contractDoc) || !/user_declared \| method_derived \| behavioral \| inferred \| imported/.test(contractDoc)) {
  fail("1.1-4: contract must state the CPV1 observation-level EvidenceClass two-axis separation");
} else ok("1.1-4: CPV1 observation-level EvidenceClass explicitly separate (two-axis rule)");

// 5. traditional_symbolic maps ONLY to the source-separated symbolic reflection layer
const ts = methods.filter((m) => m.method_evidence_class === "traditional_symbolic");
for (const m of ts) {
  if (m.cross_method_role !== "symbolic_reflection_layer_only") fail(`1.1-5: ${m.method_id} (traditional_symbolic) must have cross_method_role symbolic_reflection_layer_only`);
}
if (!/symbolic_reflection` or `chinese_cultural_interpretation/.test(contractDoc)) fail("1.1-5: contract must restrict symbolic contribution to symbolic_reflection/chinese_cultural_interpretation source classes");
else ok(`1.1-5: ${ts.length} traditional_symbolic methods restricted to the symbolic-reflection layer`);

// 6. traditional_symbolic_entertainment fully understanding-isolated + classes never equivalent
if (!/fully excluded/i.test(contractDoc) || !/never treated as equivalent/i.test(contractDoc)) fail("1.1-6: contract must fully isolate entertainment class and forbid class equivalence");
else ok("1.1-6: entertainment class fully isolated; classes never equivalent");
// …and the contract must NOT still blanket-prohibit ALL traditional_symbolic contribution
if (/No evidence contribution from `traditional_symbolic\*` methods/.test(contractDoc)) fail("1.1-6b: blanket traditional_symbolic exclusion still present");
else ok("1.1-6b: blanket exclusion removed (two-class boundary in force)");

// 7. EngineResult is a tagged union
if (!/type EngineResult =\s*\n?\s*\| ArchetypeResult\s*\n?\s*\| StateRecordResult\s*\n?\s*\| DimensionProfileResult\s*\n?\s*\| SymbolicReflectionResult\s*\n?\s*\| ImportedExternalResult/.test(contractDoc)) {
  fail("1.1-7: EngineResult must be the 5-variant tagged union");
} else ok("1.1-7: EngineResult is a 5-variant tagged union");

// 8. no-archetype StateRecordResult exists (and daily-check-in maps to it)
if (!/interface StateRecordResult/.test(contractDoc) || !/no forced personality interpretation|NOT an interpretation/i.test(contractDoc)) fail("1.1-8: StateRecordResult (no archetype) missing");
else if (!/`daily-check-in`[^|\n]*\| `StateRecordResult` \(no archetype\)/.test(contractDoc)) fail("1.1-8: daily-check-in must map to StateRecordResult");
else ok("1.1-8: StateRecordResult exists; daily-check-in maps to it (no archetype)");
// image-color-reflection reflective mapping without mandatory archetype
if (!/`image-color-reflection`[^|\n]*\| `StateRecordResult` or `SymbolicReflectionResult`/.test(contractDoc)) fail("1.1-8b: image-color-reflection must map to a reflective (non-mandatory-archetype) variant");
else ok("1.1-8b: image-color-reflection uses a reflective variant (no mandatory archetype)");

// 9. DimensionProfileResult exists with real structure (and the boolean flag is gone)
if (!/interface DimensionProfileResult/.test(contractDoc) || !/dimensions: Array<\{/.test(contractDoc)) fail("1.1-9: DimensionProfileResult with real dimension structure missing");
else if (/^\s*multiResult: boolean;/m.test(contractDoc)) fail("1.1-9: insufficient multiResult boolean flag still DECLARED as a field");
else ok("1.1-9: DimensionProfileResult exists; multiResult field removed (historical note about its removal is permitted)");

// 10. ImportedExternalResult exists and forbids YORISOU re-scoring
if (!/interface ImportedExternalResult/.test(contractDoc) || !/yorisouRescoring: null/.test(contractDoc) || !/frameworkOwnership: "external"/.test(contractDoc)) {
  fail("1.1-10: ImportedExternalResult must structurally forbid YORISOU re-scoring and framework-ownership claims");
} else ok("1.1-10: ImportedExternalResult forbids re-scoring + ownership claims");

// 11. benchmark-before-format is mandatory in the Forge
if (!/Benchmark and format decision/.test(standardDoc) || !/24-item multi-choice · 48-item A\/B · 60-item A\/B · 72-item A\/B · 84-item A\/B/.test(standardDoc) || !/20 mandatory steps/.test(standardDoc)) {
  fail("1.1-11: the Forge must contain the mandatory Benchmark-and-format-decision stage (20 steps)");
} else ok("1.1-11: Benchmark-and-format-decision stage mandatory (Forge = 20 steps)");

// 12. unbuilt Launch Core methods carry benchmark status and no fixed item-count claims
for (const m of methods) {
  if (!m.benchmark_status) fail(`1.1-12: ${m.method_id} lacks benchmark_status`);
}
const unbuiltCore = coreRows.filter((m) => m.activation_state === "planned_unbuilt");
for (const m of unbuiltCore) {
  if (m.benchmark_status !== "benchmark_pending") fail(`1.1-12: unbuilt core ${m.method_id} must be benchmark_pending`);
  const claimFields = `${m.format_category} ${m.result_type} ${m.required_completion_work}`;
  if (/~\d+\s*Q|archetype_\d+to\d+|\d+×~?\d+/.test(claimFields)) fail(`1.1-12: unbuilt core ${m.method_id} claims a fixed count without benchmark evidence`);
}
for (const m of methods.filter((x) => x.activation_state === "implemented_route_verified")) {
  if (m.benchmark_status !== "verified_actual_count") fail(`1.1-12: shipped ${m.method_id} must be verified_actual_count`);
}
ok(`1.1-12: benchmark_status on all ${methods.length}; ${unbuiltCore.length} unbuilt core methods benchmark_pending with no fixed-count claims`);

// 13. EngineMethodFamily is a strict union (7 values) and family is not a bare string
if (!/type EngineMethodFamily =/.test(contractDoc) || !/family: EngineMethodFamily/.test(contractDoc)) fail("1.1-13: EngineMethodFamily strict union missing or family not typed by it");
else if (/family: string/.test(contractDoc)) fail("1.1-13: contract still contains family: string");
else ok("1.1-13: EngineMethodFamily is a strict union; no family: string");
const FAMILIES = ["yorisou_state", "yorisou_original_assessment", "chinese_traditional", "western_symbolic", "psychology_preference", "relationship_compatibility", "japanese_cultural_symbolic"];
for (const m of methods) {
  if (!FAMILIES.includes(m.family)) fail(`1.1-13: ${m.method_id} uses non-union family "${m.family}"`);
}

// 14. the two future family values are explicitly registration-gated
if (!/ADDITIVE CPV1 extension package/i.test(contractDoc) || !/do not modify CPV1/i.test(contractDoc)) {
  fail("1.1-14: relationship_compatibility/japanese_cultural_symbolic must be documented as CPV1-extension-gated");
} else ok("1.1-14: the two new family values are registration-gated (additive CPV1 extension; CPV1 unmodified)");

// 15. launch composition unchanged: 10/9/7/5
const counts = {
  launch_core: coreRows.length,
  launch_supporting: methods.filter((m) => m.launch_group === "launch_supporting").length,
  rights_review_queue: methods.filter((m) => m.launch_group === "rights_review_queue").length,
  later_cultural_systems: methods.filter((m) => m.launch_group === "later_cultural_systems").length,
};
if (counts.launch_core !== 10 || counts.launch_supporting !== 9 || counts.rights_review_queue !== 7 || counts.later_cultural_systems !== 5) {
  fail(`1.1-15: composition changed — ${JSON.stringify(counts)} (must be 10/9/7/5)`);
} else ok("1.1-15: launch composition unchanged (10/9/7/5)");

// ═══ MTF-1.2 EXPANSION (§7 checks 1–20) ══════════════════════════════════════

// 1–2. Forge contains "Original result model" and no longer mandates archetypes for all
if (!/Original result model/.test(standardDoc)) fail("1.2-1: Forge must contain the 'Original result model' step");
else ok("1.2-1: Forge contains 'Original result model'");
if (/\| 11 \| \*\*Original result archetypes\*\*/.test(standardDoc) || /per archetype, current-state framed \|/.test(standardDoc)) {
  fail("1.2-2: Forge still mandates archetypes for all methods");
} else if (!/no archetype, no deep report, a timeline instead of a report/.test(standardDoc)) {
  fail("1.2-2: Forge must state that non-archetype/no-report outcomes are legitimate");
} else ok("1.2-2: Forge no longer mandates archetypes; template-forcing prohibited");

// 3–7. variant-specific production requirements exist
const prodReq = standardDoc;
if (!/\*\*State record result\*\*[\s\S]*?No mandatory archetype\. No forced personality interpretation\./.test(prodReq)) fail("1.2-3: StateRecord production requirements missing");
else ok("1.2-3: StateRecord production requirements present");
if (!/\*\*Dimension profile result\*\*[\s\S]*?No mandatory single primary type\./.test(prodReq)) fail("1.2-4: DimensionProfile production requirements missing");
else ok("1.2-4: DimensionProfile production requirements present");
if (!/\*\*Symbolic reflection result\*\*[\s\S]*?No scientific weighting\. No deterministic life prediction\./.test(prodReq)) fail("1.2-5: SymbolicReflection production requirements missing");
else ok("1.2-5: SymbolicReflection production requirements present");
if (!/\*\*Imported external result\*\*[\s\S]*?No YORISOU re-scoring\. No copied report content\./.test(prodReq)) fail("1.2-6: ImportedExternal production rules must prohibit YORISOU re-scoring");
else ok("1.2-6: ImportedExternal production rules prohibit re-scoring/copying");
if (!/\*\*Entertainment-only output\*\*[\s\S]*?excluded_entertainment/.test(prodReq)) fail("1.2-7: entertainment-only output production model missing");
else ok("1.2-7: entertainment-only output explicitly supported");

// 8–10. EngineResultBase no longer universally requires bank/scoring/deterministic
const baseBlock = contractDoc.match(/interface EngineResultBase \{[\s\S]*?\n\}/)?.[0] ?? "";
if (!baseBlock) fail("1.2-8: EngineResultBase not found");
if (/^\s*bankVersion: string;/m.test(baseBlock)) fail("1.2-8: EngineResultBase still universally requires bankVersion");
else ok("1.2-8: bankVersion removed from the universal base");
if (/^\s*scoringVersion: string;/m.test(baseBlock)) fail("1.2-9: EngineResultBase still universally requires scoringVersion");
else ok("1.2-9: scoringVersion removed from the universal base");
if (/reproducibility: \{ deterministic: true/.test(baseBlock)) fail("1.2-10: universal deterministic:true still present in the base");
else ok("1.2-10: universal deterministic:true removed from the base");

// 11. EngineComputationProvenance is a tagged union
if (!/type EngineComputationProvenance =\s*\n?\s*\| ScoredComputationProvenance\s*\n?\s*\| RecordedStateProvenance\s*\n?\s*\| SymbolicComputationProvenance\s*\n?\s*\| ImportedExternalProvenance/.test(contractDoc)) {
  fail("1.2-11: EngineComputationProvenance must be the 4-variant tagged union");
} else ok("1.2-11: EngineComputationProvenance is a 4-variant tagged union");
if (!/provenance: EngineComputationProvenance/.test(baseBlock)) fail("1.2-11b: base must carry the variant-appropriate provenance");
else ok("1.2-11b: base carries EngineComputationProvenance");

// 12. recorded-state provenance has no scoring
const recBlock = contractDoc.match(/interface RecordedStateProvenance \{[\s\S]*?\n\}/)?.[0] ?? "";
if (!recBlock || !/yorisouScoring: null/.test(recBlock) || /scoringVersion: string/.test(recBlock)) fail("1.2-12: RecordedStateProvenance must have yorisouScoring: null and no scoring version");
else ok("1.2-12: recorded-state provenance carries no scoring");

// 13. imported provenance has no YORISOU bank/scoring
const impBlock = contractDoc.match(/interface ImportedExternalProvenance \{[\s\S]*?\n\}/)?.[0] ?? "";
if (!impBlock || !/yorisouBankVersion: null/.test(impBlock) || !/yorisouScoringVersion: null/.test(impBlock) || !/yorisouRescoring: null/.test(impBlock)) {
  fail("1.2-13: ImportedExternalProvenance must null out YORISOU bank/scoring/rescoring");
} else ok("1.2-13: imported provenance has no YORISOU bank/scoring (structural nulls)");
// fake-value prohibition stated
if (!/Fake values[\s\S]{0,200}PROHIBITED|fake values[\s\S]{0,200}prohibited/i.test(contractDoc)) fail("1.2-13b: fake-provenance-value prohibition must be stated");
else ok("1.2-13b: fake provenance values explicitly prohibited");

// 14. every result has an UnderstandingPolicy (union values may carry trailing comments)
if (!/type UnderstandingPolicy =[^\n]*\n\s*\| "method_derived_eligible"[^\n]*\n\s*\| "symbolic_private_only"[^\n]*\n\s*\| "imported_user_confirmed_only"[^\n]*\n\s*\| "excluded_entertainment"/.test(contractDoc)) {
  fail("1.2-14: UnderstandingPolicy 4-value union missing");
} else if (!/understandingPolicy: UnderstandingPolicy/.test(baseBlock)) {
  fail("1.2-14: EngineResultBase must carry exactly one understandingPolicy");
} else ok("1.2-14: every result carries exactly one UnderstandingPolicy");

// 15–17. binding policy mappings
if (!/`s01-omikuji`[\s\S]{0,400}`excluded_entertainment`/.test(contractDoc)) fail("1.2-15: s01-omikuji must map to excluded_entertainment");
else ok("1.2-15: s01-omikuji maps to excluded_entertainment (structural, not convention)");
if (!/`traditional_symbolic` methods \| `SymbolicReflectionResult` \| `symbolic` \| `symbolic_private_only`/.test(contractDoc)) fail("1.2-16: symbolic results must map to symbolic_private_only");
else ok("1.2-16: symbolic results map to symbolic_private_only");
if (!/`mbti-import-handoff` \| `ImportedExternalResult` \| `imported_external` \| `imported_user_confirmed_only`/.test(contractDoc)) fail("1.2-17: imported results must map to imported_user_confirmed_only");
else ok("1.2-17: imported external results map to imported_user_confirmed_only");

// 18. daily check-in: method-local comparison + understanding-eligible context
if (!/comparisonPolicy: "method_local_timeline_only"/.test(contractDoc)) fail("1.2-18: StateRecordResult must declare comparisonPolicy method_local_timeline_only");
else if (!/did NOT mean "invisible to the Understanding Graph"|NOT.*invisible to the Understanding Graph/i.test(contractDoc)) fail("1.2-18: the crossMethod ambiguity must be explicitly resolved");
else if (!/`daily-check-in`[\s\S]{0,400}`method_derived_eligible`/.test(contractDoc)) fail("1.2-18: daily-check-in must be understanding-eligible as source-separated context");
else ok("1.2-18: daily state = method-local comparison BUT understanding-eligible source-separated context");

// 19. launch composition unchanged (re-asserted for 1.2)
if (counts.launch_core !== 10 || counts.launch_supporting !== 9 || counts.rights_review_queue !== 7 || counts.later_cultural_systems !== 5) {
  fail("1.2-19: launch composition changed");
} else ok("1.2-19: launch composition remains 10/9/7/5");

// 20. all original MTF-1 + MTF-1.1 checks still pass — structurally guaranteed: this
// script only reaches the summary when `failures === 0` across ALL sections above.
ok("1.2-20: all original MTF-1 (12) and MTF-1.1 (15) checks executed above in this same run");

if (failures) { console.error(`\n${failures} MTF-1 validation failure(s).`); process.exit(1); }
console.log(`\nMTF-1/1.1/1.2 docs package VALID — ${methods.length} methods (10 core / ${counts.launch_supporting} supporting / ${counts.rights_review_queue} rights-review / ${counts.later_cultural_systems} later-cultural); 12 original + 15 MTF-1.1 + 20 MTF-1.2 checks = 47 labeled checks (plus sub-assertions) all passing.`);
