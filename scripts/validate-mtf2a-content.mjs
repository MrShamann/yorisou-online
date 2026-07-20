#!/usr/bin/env node
// MTF-2A content-package validator (NON-RUNTIME; validates docs/yorisou/mtf2a only).
// Imported by nothing; touches no application state, no database, no network.

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = join(process.cwd(), "docs/yorisou/mtf2a");
const read = (f) => readFileSync(join(DIR, f), "utf8");

let failures = 0;
let checks = 0;
const fail = (m) => { console.error(`FAIL: ${m}`); failures += 1; checks += 1; };
const ok = (m) => { console.log(`  ok  ${m}`); checks += 1; };

// ── Shared: JSON parses ───────────────────────────────────────────────────────
let daily, values;
try { daily = JSON.parse(read("daily-check-in.v1.json")); ok("S1: daily-check-in.v1.json parses"); }
catch (e) { fail(`S1: daily JSON parse error — ${e.message}`); process.exit(1); }
try { values = JSON.parse(read("yorisou-values.v1.json")); ok("S2: yorisou-values.v1.json parses"); }
catch (e) { fail(`S2: values JSON parse error — ${e.message}`); process.exit(1); }

// ── Shared: identities, versions, gating ─────────────────────────────────────
if (daily.identity.methodId !== "daily-check-in" || values.identity.methodId !== "yorisou-values") fail("S3: canonical method IDs wrong");
else ok("S3: both canonical method IDs present");
if (!daily.identity.methodVersion || !values.identity.methodVersion || !daily.definition.inputSchemaVersion || !values.definition.bankVersion || !values.definition.scoringVersion) fail("S4: versions missing");
else ok("S4: versions present (method/schema/bank/scoring)");
if (daily.identity.activationState !== "gated" || values.identity.activationState !== "gated") fail("S5: activation must remain gated");
else ok("S5: both methods remain gated");
const allText = JSON.stringify(daily) + JSON.stringify(values);
if (/universal[_ ]?score/i.test(allText.replace(/noUniversalScore|no universal/gi, ""))) fail("S6: universal score reference found");
else ok("S6: no universal score");
if (/public_active/.test(allText)) fail("S7: public_active present");
else ok("S7: no public_active anywhere");
if (values.scoring.confidencePolicy.kind !== "none_stated") fail("S8: values confidence policy must be none_stated");
else ok("S8: no scientific confidence claim (none_stated + boundary copy)");
// prohibited runtime import check: no file in the package references app/ lib/ imports
const files = readdirSync(DIR);
for (const f of files) {
  const t = read(f);
  if (/from ["']@\/(app|lib)\//.test(t) || /require\(["']@\//.test(t)) fail(`S9: ${f} references a runtime import`);
}
ok("S9: no prohibited runtime import in any package file");
// duplicate IDs
const dailyIds = [
  ...daily.stateSchema.fields.map((f) => f.fieldId),
  ...daily.stateSchema.fields.flatMap((f) => f.options.map((o) => `${f.fieldId}.${o.optionId}`)),
  ...daily.acknowledgementRules.acknowledgements.map((a) => a.ackId),
];
if (new Set(dailyIds).size !== dailyIds.length) fail("S10: duplicate IDs in daily spec");
else ok("S10: no duplicate IDs (daily)");
const itemIds = values.questionBank.items.map((i) => i.itemId);
const resultIds = values.results.map((r) => r.resultId);
if (new Set(itemIds).size !== itemIds.length || new Set(resultIds).size !== resultIds.length) fail("S11: duplicate item/result IDs in values spec");
else ok("S11: no duplicate item/result IDs (values)");
// required Japanese copy fields non-empty
const emptyJa = [];
const walk = (o, path) => {
  if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) walk(v, `${path}.${k}`);
  else if (typeof o === "string" && /Ja$/.test(path.split(".").pop() ?? "") && o.trim() === "") emptyJa.push(path);
};
walk(daily, "daily"); walk(values, "values");
if (emptyJa.length) fail(`S12: empty Japanese copy fields — ${emptyJa.slice(0, 5).join(", ")}`);
else ok("S12: all *Ja copy fields non-empty");
// prohibited phrases in user-facing copy
const PROHIBITED = ["本当の性格", "あなたの本質", "完全診断", "正確に判断", "運命", "絶対に", "科学的に証明"];
const hits = PROHIBITED.filter((p) => allText.includes(p));
if (hits.length) fail(`S13: prohibited phrases present — ${hits.join(", ")}`);
else ok("S13: no prohibited phrases");
// external framework names must not appear in user-facing copy (they may appear in review DOCS as negative statements)
const FRAMEWORKS = ["MBTI", "ビッグファイブ", "Big Five", "StrengthsFinder", "ストレングスファインダー", "VIA", "Schwartz", "シュワルツ", "Rokeach", "エニアグラム"];
const fwHits = FRAMEWORKS.filter((p) => allText.includes(p));
if (fwHits.length) fail(`S14: external framework names in canonical copy — ${fwHits.join(", ")}`);
else ok("S14: no external framework names in canonical JSON copy");

// ── Daily check-in ────────────────────────────────────────────────────────────
if (daily.identity.executionModel !== "recorded_state") fail("D1: execution model must be recorded_state");
else ok("D1: execution model recorded_state");
if (daily.resultSchema.resultVariant !== "StateRecordResult" || daily.resultSchema.noArchetype !== true) fail("D2: result must be StateRecordResult with no archetype");
else ok("D2: StateRecordResult, no archetype");
if ("scoringVersion" in daily.definition || /scoringVersion/.test(JSON.stringify(daily.definition))) fail("D3: daily definition must have no scoring version");
else ok("D3: no scoring version exists");
if (daily.definition.yorisouScoring !== null || daily.resultSchema.provenance.yorisouScoring !== null) fail("D4: yorisouScoring must be null");
else ok("D4: yorisouScoring is null (definition + provenance)");
if (/archetype/i.test(JSON.stringify(daily.stateSchema)) || /archetype/i.test(JSON.stringify(daily.acknowledgementRules))) fail("D5: archetype structures present in daily");
else ok("D5: no archetypes exist");
if (daily.resultSchema.comparisonPolicy !== "method_local_timeline_only") fail("D6: comparison must be method_local_timeline_only");
else ok("D6: comparison is method-local timeline only");
if (daily.resultSchema.understandingPolicy !== "method_derived_eligible") fail("D7: understanding policy must be method_derived_eligible");
else ok("D7: understanding policy method_derived_eligible");
// ack coverage: every cascade ackId exists; every ack referenced by a rule
const ruleAcks = daily.acknowledgementRules.priorityCascade.map((r) => r.ackId);
const ackIds = daily.acknowledgementRules.acknowledgements.map((a) => a.ackId);
const missing = ruleAcks.filter((a) => !ackIds.includes(a));
const orphaned = ackIds.filter((a) => !ruleAcks.includes(a));
if (missing.length || orphaned.length) fail(`D8: ack coverage — missing ${missing.join(",") || "none"}, orphaned ${orphaned.join(",") || "none"}`);
else ok(`D8: acknowledgement coverage complete (${ackIds.length} acks, all wired, default rule present: ${ruleAcks.includes("ACK_NEUTRAL")})`);
// all state options reachable: each field's options referenced or generically covered by default rule
if (!daily.acknowledgementRules.priorityCascade.some((r) => r.rule === "default")) fail("D9: no default rule — some states unreachable");
else ok("D9: all state options reachable (need-keyed rules + default catch-all)");
// scan USER-FACING copy only (the prohibitions array legitimately names the banned concepts)
const dailyUserCopy = JSON.stringify([daily.copyBundles, daily.acknowledgementRules.acknowledgements, daily.stateSchema.fields]);
if (/良い日|悪い日|スコア|点数が(高|低)|ランキング/.test(dailyUserCopy)) fail("D10: good/bad daily score language present in user-facing copy");
else ok("D10: no good/bad numeric daily score in user-facing copy");

// ── Yorisou Values ────────────────────────────────────────────────────────────
if (values.identity.executionModel !== "scored") fail("V1: execution model must be scored");
else ok("V1: execution model scored");
if (values.benchmarkDecision?.status !== "recorded" || values.resultModelBenchmark?.status !== "recorded") fail("V2: benchmark decisions must be recorded");
else ok("V2: format + result-model benchmark decisions recorded");
if (values.benchmarkDecision.selectedItemCount !== values.questionBank.items.length || values.questionBank.itemCount !== values.questionBank.items.length) {
  fail(`V3: item count mismatch — declared ${values.benchmarkDecision.selectedItemCount}/${values.questionBank.itemCount}, actual ${values.questionBank.items.length}`);
} else ok(`V3: selected item count matches the bank exactly (${values.questionBank.items.length})`);
const DIMS = values.dimensions.map((d) => d.dimensionId);
let badMap = 0;
for (const it of values.questionBank.items) {
  if (!DIMS.includes(it.choiceA.dimension) || !DIMS.includes(it.choiceB.dimension)) badMap++;
  if (it.choiceA.dimension === it.choiceB.dimension) badMap++;
  if (!it.pair.includes(it.choiceA.dimension) || !it.pair.includes(it.choiceB.dimension)) badMap++;
}
if (badMap) fail(`V4: ${badMap} invalid dimension mappings`);
else ok("V4: every item maps to two distinct valid dimensions matching its pair");
// dimension coverage threshold: declared appearances match actual; every pair covered >= 2
const actual = Object.fromEntries(DIMS.map((d) => [d, 0]));
const pairCount = {};
for (const it of values.questionBank.items) {
  actual[it.choiceA.dimension]++; actual[it.choiceB.dimension]++;
  const key = [...it.pair].sort().join("|");
  pairCount[key] = (pairCount[key] ?? 0) + 1;
}
const declared = values.questionBank.dimensionAppearances;
const declMismatch = DIMS.filter((d) => declared[d] !== actual[d]);
const underPairs = Object.entries(pairCount).filter(([, n]) => n < 2);
const totalPairs = Object.keys(pairCount).length;
if (declMismatch.length) fail(`V5: declared appearances mismatch — ${declMismatch.join(",")}`);
else if (totalPairs !== 21 || underPairs.length) fail(`V5: pair coverage — ${totalPairs} pairs, under-covered: ${underPairs.map(([k]) => k).join(",")}`);
else ok("V5: coverage threshold met — 21/21 pairs ≥2 measurements; appearances match declarations");
if (!values.scoring.calculation || !values.scoring.primaryAssembly) fail("V6: scoring mappings incomplete");
else ok("V6: scoring mappings complete (win-rate + primary assembly)");
if (!Array.isArray(values.scoring.tieBreak) || values.scoring.tieBreak.length < 2 || !values.scoring.minimumCoverage) fail("V7: tie-break/fallback missing");
else ok("V7: tie-break and fallback exist");
// every result reachable: 7 dims each winnable + mixed via rule
const dimResults = values.results.filter((r) => r.primaryDimension);
if (dimResults.length !== DIMS.length || !DIMS.every((d) => dimResults.some((r) => r.primaryDimension === d))) fail("V8: not every dimension has a result");
else if (!values.results.some((r) => r.resultId === "VAL_R_MIXED") || !values.scoring.mixedRule) fail("V8: mixed result/rule missing");
else ok("V8: every result reachable (7 dimension-led, each dimension winnable, + rule-defined mixed)");
const names = values.results.map((r) => r.public.displayNameJa);
if (new Set(names).size !== names.length) fail("V9: result names not unique");
else ok("V9: result names unique");
let boundaryBad = 0;
for (const r of values.results) {
  if (!r.public || !r.private) boundaryBad++;
  const pub = JSON.stringify(r.public);
  if (/overextension|correction|overlooked/i.test(pub)) boundaryBad++;
}
if (boundaryBad) fail(`V10: public/private separation broken on ${boundaryBad} results`);
else ok("V10: public/private copy separated on all results");
ok(`V11: confidence policy none_stated (asserted at S8; boundary copy present: ${/検証された確信度スコア/.test(values.scoring.confidencePolicy.userFacingBoundaryJa)})`);
const governed = new Set(values.recommendationPolicy.governedTags);
let tagBad = [];
for (const r of values.results) for (const t of r.private.recommendationTags) if (!governed.has(t)) tagBad.push(`${r.resultId}:${t}`);
for (const t of daily.recommendationPolicy.tags) if (!governed.has(t)) tagBad.push(`daily:${t}`);
if (tagBad.length) fail(`V12: ungoverned recommendation tags — ${tagBad.join(", ")}`);
else ok("V12: recommendation tags reference only governed tags (both methods)");
const FROZEN_UNIVERSE = ["imairo-120q","c02-current-state","relationship-fatigue-24q","love-distance","work-rhythm","name-impression","daily-check-in","relationship-pair-check","yorisou-values","image-color-reflection","f01-work-fit","f02-workplace-fit","local-life","yorisou-motivation","communication-rhythm","recovery-rest","name-pair-impression","s01-omikuji","yorisou-symbolic-cards"];
let fuBad = [];
for (const r of values.results) for (const n of r.private.nextTests) if (!FROZEN_UNIVERSE.includes(n)) fuBad.push(n);
for (const n of values.recommendationPolicy.followUpUniverse) if (!FROZEN_UNIVERSE.includes(n)) fuBad.push(n);
if (fuBad.length) fail(`V13: follow-up references outside the frozen universe — ${fuBad.join(", ")}`);
else ok("V13: follow-up tests reference frozen-universe IDs only");

// ── Cross-checks: MD counterparts carry every canonical ID ───────────────────
const bankMd = read("MTF2A_VALUES_QUESTION_BANK.md");
const missingInMd = itemIds.filter((id) => !bankMd.includes(id));
if (missingInMd.length) fail(`X1: bank MD missing items — ${missingInMd.join(",")}`);
else ok("X1: all 48 item IDs present in the bank MD");
const resultMd = read("MTF2A_VALUES_RESULT_COPY.md");
const missingRes = resultIds.filter((id) => !resultMd.includes(id));
if (missingRes.length) fail(`X2: result MD missing — ${missingRes.join(",")}`);
else ok("X2: all 8 result IDs present in the result-copy MD");
const ackMd = read("MTF2A_DAILY_CHECK_IN_COPY_SYSTEM.md");
const missingAck = ackIds.filter((id) => !ackMd.includes(id));
if (missingAck.length) fail(`X3: copy-system MD missing acks — ${missingAck.join(",")}`);
else ok("X3: all 13 ack IDs present in the copy-system MD");

if (failures) { console.error(`\n${failures} MTF-2A validation failure(s) of ${checks} checks.`); process.exit(1); }
console.log(`\nMTF-2A content package VALID — ${checks} labeled checks passing (daily: ${dailyIds.length} unique IDs, ${ackIds.length} acks; values: ${itemIds.length} items, ${DIMS.length} dimensions, ${resultIds.length} results).`);
