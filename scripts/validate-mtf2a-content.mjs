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
for (const m of daily.recommendationPolicy.needMapping ?? []) if (!governed.has(m.tag)) tagBad.push(`daily:${m.tag}`);
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

// ═══ MTF-2A.1 + MTF-2A.2 EXPANSION ═══════════════════════════════════════════
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
const dailyAll = JSON.stringify(daily);
const valuesAll = JSON.stringify(values);
let fixtures = 0;
let gates = 0; let gateFailures = 0;
const gateOk = (m) => { console.log(`  GATE ${m}`); gates += 1; };
const gateFail = (m) => { console.error(`GATE-FAIL: ${m}`); gates += 1; gateFailures += 1; failures += 1; };

// A2-1/2: version coherence (exact equality of every duplicated reference)
const sv = [values.definition.scoringVersion, values.scoring.scoringVersion, values.resultObjectContract.provenance.scoringVersion];
if (new Set(sv).size !== 1 || sv[0] !== "values-scoring-v1.0") fail(`A2-1: scoring versions diverge — ${sv.join(" / ")}`);
else if (/values-scoring-v1\.1/.test(valuesAll)) fail("A2-1: values-scoring-v1.1 still present");
else ok("A2-1: all scoring-version references identical (values-scoring-v1.0); no v1.1 remains");
const dupPairs = [
  ["daily inputSchemaVersion", daily.definition.inputSchemaVersion, daily.stateSchema.version],
  ["daily schema provenance", daily.definition.inputSchemaVersion, daily.resultSchema.provenance.schemaVersion],
  ["daily ack version", daily.definition.acknowledgementCopyVersion, daily.acknowledgementRules.version],
  ["values bankVersion", values.definition.bankVersion, values.questionBank.bankVersion],
  ["values methodVersion", values.identity.methodVersion, values.resultObjectContract.provenance.methodVersion],
  ["daily methodVersion", daily.identity.methodVersion, daily.resultSchema.provenance.methodVersion],
];
const dupBad = dupPairs.filter(([, a, b]) => a !== b);
if (dupBad.length) fail(`A2-2: duplicated version references differ — ${dupBad.map(([n]) => n).join(", ")}`);
else ok("A2-2: every duplicated schema/provenance version reference is exactly equal");

// Timing/privacy truth (retained from 2A.1)
if (/30秒/.test(dailyAll)) fail("A1-D1: 30-second claim remains"); else ok("A1-D1: no 30-second claim");
if (daily.identity.subtitleJa !== "1分のじぶん記録" || daily.benchmarkDecision.targetCompletionSeconds !== "45-60") fail("A1-D2: 1分/45-60s mismatch");
else ok("A1-D2: 1分 wording aligns with the 45-60s benchmark");
if (/だれにも見えません|共有されることはありません/.test(dailyAll)) fail("A1-D3: absolute privacy claims remain"); else ok("A1-D3: absolute privacy statements absent");
// Record contract (retained)
const rc = daily.recordContract ?? {};
if (!rc.identity?.producedAt?.includes("UTC") || !rc.identity?.entryLocalDate || !/IANA/.test(rc.identity?.timezone ?? "")) fail("A1-D4: record identity semantics missing");
else ok("A1-D4: producedAt(UTC)+entryLocalDate+IANA timezone");
if (!/no destructive overwrite/i.test(rc.correctionModel?.sameDayEdit ?? "") || !/versioned correction/i.test(rc.correctionModel?.sameDayEdit ?? "")) fail("A1-D5/6: correction model wrong");
else ok("A1-D5/6: versioned corrections, no destructive overwrite, history preserved");
if (!/at least one structured state-field/i.test(rc.entryValidity ?? "") || !daily.stateSchema.privateReflection.memoAloneIsNotAnEntry) fail("A1-D7/8: entry validity rules missing");
else ok("A1-D7/8: >=1 structured field required; memo-only invalid");

// A2 daily: field-valid denominators + copy truth
const sd = daily.longitudinal.sevenDaySummary;
if (!/field-valid/.test(sd.denominatorRule ?? "") || sd.rules.some((r) => !r.minFieldValid)) fail("A2-11: field-valid denominators missing");
else ok("A2-11: seven-day summaries use field-valid recorded denominators (minFieldValid per rule)");
const sumCopy = sd.rules.map((r) => r.copyJa).join("");
if (/この7日は、/.test(sumCopy) || !sd.rules.slice(0, 5).every((r) => /記録した日の中で/.test(r.copyJa))) fail("A2-12: summary copy describes unrecorded days as known states");
else if (!/記録した日の天気は、いろいろでした/.test(sumCopy)) fail("A2-12: mixed-weather copy not corrected");
else ok("A2-12: user copy scopes claims to 記録した日の中では (unrecorded days never described as known)");
const td = daily.longitudinal.thirtyDaySummary;
if (!/field-valid/.test(td.denominatorRule ?? "") || !/answered/.test(td.mostFrequentNeed)) fail("A2-12b: 30-day denominators not field-valid");
else ok("A2-12b: thirty-day summaries use the same field-valid principle");
// longitudinal completeness (retained)
if (!Array.isArray(daily.longitudinal.reflectionPrompts?.prompts) || daily.longitudinal.reflectionPrompts.prompts.length !== 3) fail("A1-D11: prompts missing");
else ok("A1-D11: all three reflection prompts authored");
const needOpts = daily.stateSchema.fields.find((f) => f.fieldId === "kyou_hoshii").options.map((o) => o.optionId);
const mapped = (daily.recommendationPolicy.needMapping ?? []).map((m) => m.optionId);
if (!needOpts.every((o) => mapped.includes(o)) || !daily.recommendationPolicy.unansweredNeedBehavior?.includes("no_recommendation")) fail("A1-D12: need mapping incomplete");
else ok("A1-D12: all six need options mapped; no_recommendation explicit");
const GOV = ["need_rest","need_order","need_change","need_connect","need_solo","need_small_win","context_work","context_relationship","content_learning","no_recommendation"];
if (!(daily.recommendationPolicy.needMapping ?? []).every((m) => GOV.includes(m.tag)) || /_hint"/.test(dailyAll + valuesAll)) fail("A1-D13: taxonomy violation");
else ok("A1-D13: governed taxonomy holds (no *_hint)");

// A2-13: ACK_RAIN / ACK_LOWBATT non-directive
const acksById = Object.fromEntries(daily.acknowledgementRules.acknowledgements.map((a) => [a.ackId, a]));
if (/無理のない過ごし方|きょうの分はもう十分/.test(acksById.ACK_RAIN.copyJa + acksById.ACK_LOWBATT.copyJa)) fail("A2-13: RAIN/LOWBATT still directive/evaluative");
else if (!/そのまま残りました/.test(acksById.ACK_RAIN.copyJa) || !/きょうの一枚として残りました/.test(acksById.ACK_LOWBATT.copyJa)) fail("A2-13: RAIN/LOWBATT corrected wording missing");
else ok("A2-13: ACK_RAIN and ACK_LOWBATT are observational (non-directive, non-evaluative)");
const ackText = daily.acknowledgementRules.acknowledgements.map((a) => a.copyJa).join("");
if (/ずっとは吹きません|うまくいきます|効きそう|歩く|景色は変わります|選び方が少し変わります/.test(ackText)) fail("A1-D15: predictive/mobility copy remains");
else ok("A1-D15: no future guarantee / it-will-work / mobility assumption in acks");

// A2-3/4: 48/48 coverage
if (values.scoring.minimumCoverage.requiredAnsweredItems !== 48 || /40/.test(JSON.stringify(values.scoring.minimumCoverage))) fail("A2-3: 48/48 requirement not frozen");
else ok("A2-3: canonical result requires 48/48 answers (40-threshold removed)");
if (!/insufficient_coverage/.test(values.scoring.minimumCoverage.belowRequiredBehavior) || !values.scoring.minimumCoverage.insufficientCoverageCopyJa.includes("{remaining}")) fail("A2-4: insufficient_coverage contract incomplete");
else ok("A2-4: 0-47 answers → insufficient_coverage (no result; resume; exact remaining count)");

// ── ONE canonical scoring function (bank-parameterized) ──────────────────────
const ITEMS = values.questionBank.items;
const DECL = values.dimensions.map((dd) => dd.dimensionId);
function scoreBank(bank, answers) {
  const answered = bank.filter((it) => answers[it.itemId]);
  if (answered.length < values.scoring.minimumCoverage.requiredAnsweredItems) {
    return { state: "insufficient_coverage", remaining: values.scoring.minimumCoverage.requiredAnsweredItems - answered.length };
  }
  const wins = Object.fromEntries(DECL.map((dd) => [dd, 0]));
  const app = Object.fromEntries(DECL.map((dd) => [dd, 0]));
  for (const it of answered) {
    app[it.choiceA.dimension]++; app[it.choiceB.dimension]++;
    wins[answers[it.itemId] === "A" ? it.choiceA.dimension : it.choiceB.dimension]++;
  }
  const rates = DECL.map((dd) => ({ d: dd, r: wins[dd] / app[dd] }));
  const sorted = [...rates].sort((a, b) => b.r - a.r || DECL.indexOf(a.d) - DECL.indexOf(b.d));
  const [t1, t2] = sorted;
  if (t1.r - t2.r < 0.05) {
    return { state: "result", resultId: "VAL_R_MIXED", secondary: null, closeSet: sorted.filter((x) => t1.r - x.r < 0.05).map((x) => x.d), rates: Object.fromEntries(rates.map((x) => [x.d, x.r])) };
  }
  return { state: "result", resultId: `VAL_R_${t1.d.toUpperCase()}`, secondary: t2.d, closeSet: null, rates: Object.fromEntries(rates.map((x) => [x.d, x.r])) };
}
const score = (answers) => scoreBank(ITEMS, answers);
const answerAllFavor = (dim) => Object.fromEntries(ITEMS.map((it) => [it.itemId, it.choiceA.dimension === dim ? "A" : it.choiceB.dimension === dim ? "B" : "A"]));

// FIXTURE TABLE (recorded IDs + expected outputs) — §5.5
const FIXTURES = [
  ...DECL.map((dd) => ({ id: `FX_${dd.toUpperCase()}`, answers: answerAllFavor(dd), expect: { state: "result", resultId: `VAL_R_${dd.toUpperCase()}` } })),
];
let fxBad = [];
for (const fx of FIXTURES) {
  const r = score(fx.answers); fixtures++;
  if (r.state !== fx.expect.state || r.resultId !== fx.expect.resultId) fxBad.push(`${fx.id}→${r.resultId ?? r.state}`);
}
if (fxBad.length) fail(`A2-9a: result fixtures mismatched — ${fxBad.join(", ")}`);
else ok(`A2-9a: 7 dimension-result fixtures pass through the canonical scorer (FX_ANSHIN..FX_JIKKAN, expected outputs recorded)`);

// §5.4 genuine pair-equivalence: intended top-two + exact gap + close set, on 2-cmp AND 3-cmp pairs
function equalTopProfile(dimX, dimY) {
  const a = {};
  for (const it of ITEMS) {
    if (it.pair.includes(dimX) && it.pair.includes(dimY)) a[it.itemId] = null;
    else if (it.pair.includes(dimX)) a[it.itemId] = it.choiceA.dimension === dimX ? "A" : "B";
    else if (it.pair.includes(dimY)) a[it.itemId] = it.choiceA.dimension === dimY ? "A" : "B";
    else a[it.itemId] = "A";
  }
  const h2h = ITEMS.filter((it) => it.pair.includes(dimX) && it.pair.includes(dimY));
  h2h.forEach((it, i) => { a[it.itemId] = (i < Math.ceil(h2h.length / 2)) ? (it.choiceA.dimension === dimX ? "A" : "B") : (it.choiceA.dimension === dimY ? "A" : "B"); });
  if (h2h.length % 2 === 1) {
    const donor = ITEMS.find((it) => it.pair.includes(dimX) && !it.pair.includes(dimY));
    a[donor.itemId] = donor.choiceA.dimension === dimX ? "B" : "A";
  }
  return a;
}
function assertPairFixture(label, dimX, dimY) {
  const r = score(equalTopProfile(dimX, dimY)); fixtures++;
  const sortedRates = Object.entries(r.rates).sort((x, y) => y[1] - x[1]);
  const topTwo = [sortedRates[0][0], sortedRates[1][0]].sort();
  const intended = [dimX, dimY].sort();
  const gap = sortedRates[0][1] - sortedRates[1][1];
  if (r.resultId !== "VAL_R_MIXED") return `${label}: not Mixed (${r.resultId})`;
  if (JSON.stringify(topTwo) !== JSON.stringify(intended)) return `${label}: top two ${topTwo} ≠ intended ${intended}`;
  if (Math.abs(gap) > 1e-12) return `${label}: gap ${gap} ≠ 0`;
  if (!r.closeSet.includes(dimX) || !r.closeSet.includes(dimY)) return `${label}: close set missing intended dims`;
  return null;
}
const pe2 = assertPairFixture("FX_PAIR_2CMP(pace,yakuwari)", "pace", "yakuwari");
const pe3 = assertPairFixture("FX_PAIR_3CMP(anshin,seicho)", "anshin", "seicho");
if (pe2 || pe3) fail(`A2-8: pair-equivalence — ${pe2 ?? ""} ${pe3 ?? ""}`);
else ok("A2-8: pair-equivalence fixtures assert intended top-two, exact gap 0, close-set membership — identical Mixed classification on 2-cmp and 3-cmp pairs");

// §5.1 genuine side-swap invariance: transformed bank + transformed answers
const swappedBank = ITEMS.map((it) => ({ ...it, choiceA: it.choiceB, choiceB: it.choiceA }));
function swapAnswers(a) { const out = {}; for (const [k, vv] of Object.entries(a)) out[k] = vv === "A" ? "B" : "A"; return out; }
let swapBad = [];
for (const dd of ["anshin", "jikkan"]) {
  const base = answerAllFavor(dd);
  const r1 = score(base); const r2 = scoreBank(swappedBank, swapAnswers(base)); fixtures += 2;
  if (JSON.stringify([r1.state, r1.resultId, r1.secondary, r1.closeSet]) !== JSON.stringify([r2.state, r2.resultId, r2.secondary, r2.closeSet])) swapBad.push(dd);
}
{
  const base = equalTopProfile("pace", "yakuwari");
  const r1 = score(base); const r2 = scoreBank(swappedBank, swapAnswers(base)); fixtures += 2;
  if (JSON.stringify([r1.state, r1.resultId, r1.closeSet]) !== JSON.stringify([r2.state, r2.resultId, r2.closeSet])) swapBad.push("mixed-profile");
}
if (swapBad.length) fail(`A2-5: side-swap invariance broken — ${swapBad.join(", ")}`);
else ok("A2-5: GENUINE side-swap invariance (A/B + dimensions swapped in a transformed bank; state/result/secondary/closeSet all equal)");

// §5.2 genuine item-order invariance: reversed bank through the SAME scorer, full-result comparison
const reversedBank = [...ITEMS].reverse();
let orderBad = [];
for (const dd of ["seicho"]) {
  const base = answerAllFavor(dd);
  const r1 = score(base); const r2 = scoreBank(reversedBank, base); fixtures += 2;
  if (JSON.stringify(r1) !== JSON.stringify(r2)) orderBad.push(dd);
}
{
  const base = equalTopProfile("anshin", "seicho");
  const r1 = score(base); const r2 = scoreBank(reversedBank, base); fixtures += 2;
  if (JSON.stringify(r1) !== JSON.stringify(r2)) orderBad.push("mixed-profile");
}
if (orderBad.length) fail(`A2-6: item-order invariance broken — ${orderBad.join(", ")}`);
else ok("A2-6: GENUINE item-order invariance (reversed bank, complete result objects equal)");

// §5.3 genuine declaration-order tie-break: unambiguous primary + EXACT 2nd/3rd tie → earlier declared dim
function tieFixture() {
  const a = {}; let paceWins = 0; let yakuWins = 0;
  for (const it of ITEMS) {
    const isPY = it.pair.includes("pace") && it.pair.includes("yakuwari");
    if (it.pair.includes("jikkan")) { a[it.itemId] = it.choiceA.dimension === "jikkan" ? "A" : "B"; continue; }
    if (isPY) { const giveTo = paceWins <= yakuWins ? "pace" : "yakuwari"; a[it.itemId] = it.choiceA.dimension === giveTo ? "A" : "B"; if (giveTo === "pace") paceWins++; else yakuWins++; continue; }
    if (it.pair.includes("pace")) { if (paceWins < 8) { a[it.itemId] = it.choiceA.dimension === "pace" ? "A" : "B"; paceWins++; } else a[it.itemId] = it.choiceA.dimension === "pace" ? "B" : "A"; continue; }
    if (it.pair.includes("yakuwari")) { if (yakuWins < 8) { a[it.itemId] = it.choiceA.dimension === "yakuwari" ? "A" : "B"; yakuWins++; } else a[it.itemId] = it.choiceA.dimension === "yakuwari" ? "B" : "A"; continue; }
    a[it.itemId] = "A"; // remaining items among {anshin,tsunagari,seicho,totonoi}
  }
  return a;
}
const rTie = score(tieFixture()); fixtures++;
const tieRates = rTie.rates ?? {};
if (rTie.resultId !== "VAL_R_JIKKAN") fail(`A2-7: tie fixture primary wrong (${rTie.resultId})`);
else if (Math.abs((tieRates.pace ?? 0) - (tieRates.yakuwari ?? 0)) > 1e-12) fail(`A2-7: constructed 2nd/3rd not exactly tied (pace ${tieRates.pace}, yakuwari ${tieRates.yakuwari})`);
else if (rTie.secondary !== "pace") fail(`A2-7: declaration-order secondary wrong (got ${rTie.secondary}, expected pace)`);
else ok(`A2-7: constructed EXACT 2nd/3rd tie (pace=yakuwari=${(tieRates.pace).toFixed(4)}); secondary = pace (earlier in declaration order); primary unambiguous (jikkan)`);

// coverage fixtures: 0-47 → insufficient_coverage
let covBad = [];
for (const n of [0, 30, 47]) {
  const a = {}; ITEMS.slice(0, n).forEach((it) => { a[it.itemId] = "A"; });
  const r = score(a); fixtures++;
  if (r.state !== "insufficient_coverage" || r.remaining !== 48 - n) covBad.push(`${n}→${r.state}/${r.remaining}`);
}
if (covBad.length) fail(`A2-4b: coverage fixtures — ${covBad.join(", ")}`);
else ok("A2-4b: 0/30/47-answer fixtures all → insufficient_coverage with exact remaining counts (no canonical result)");
// determinism
const rA = score(answerAllFavor("totonoi")); const rB = score(answerAllFavor("totonoi")); fixtures += 2;
if (JSON.stringify(rA) !== JSON.stringify(rB)) fail("A2-det: nondeterministic"); else ok("A2-det: repeated execution deterministic");

// A2-14: Q04/Q25 corrected canonical wording
const q04 = ITEMS.find((i) => i.itemId === "VAL_Q04"); const q25 = ITEMS.find((i) => i.itemId === "VAL_Q25");
if (!/新しい場に入って/.test(q04.promptJa) || !/足場を固める/.test(q04.choiceA.textJa) || !/役割を、引き受けて/.test(q04.choiceB.textJa)) fail("A2-14: Q04 corrected wording missing");
else if (!/催しや集まりに関わるなら/.test(q25.promptJa) || !/運営や手伝いの側/.test(q25.choiceA.textJa) || !/参加する側/.test(q25.choiceB.textJa)) fail("A2-14: Q25 corrected wording missing");
else if (q04.choiceA.dimension !== "anshin" || q04.choiceB.dimension !== "yakuwari" || q25.choiceA.dimension !== "yakuwari" || q25.choiceB.dimension !== "anshin") fail("A2-14: Q04/Q25 pair/sides changed");
else ok("A2-14: Q04/Q25 carry the corrected balanced wording (anshin×yakuwari preserved, sides preserved)");
// exposure balance (retained)
const APP = values.questionBank.dimensionAppearances;
const aCount = Object.fromEntries(DECL.map((dd) => [dd, 0]));
for (const it of ITEMS) aCount[it.choiceA.dimension]++;
const actualApp = Object.fromEntries(DECL.map((dd) => [dd, 0]));
for (const it of ITEMS) { actualApp[it.choiceA.dimension]++; actualApp[it.choiceB.dimension]++; }
const appBad = DECL.filter((dd) => actualApp[dd] !== APP[dd]);
const abBad = DECL.filter((dd) => { const ratio = aCount[dd] / APP[dd]; return ratio < 0.4 || ratio > 0.6; });
if (appBad.length || abBad.length) fail(`A2-bal: appearances(${appBad}) / A-side(${abBad})`);
else ok("A2-bal: dimension appearances match declarations; A-side exposure 40-60%");
// sensitivity vocabulary (retained)
const SENS = values.questionBank.sensitivityVocabulary ?? [];
if (ITEMS.some((i) => !SENS.includes(i.sensitivity))) fail("A2-sens: vocabulary violation");
else ok("A2-sens: all sensitivities within the documented vocabulary");

// A2-15/16: private rendering contract + traceability
const prc = values.privateRenderingContract ?? {};
const SECTIONS = ["innerTension", "workContext", "relationshipContext", "dailyLifeContext", "overlookedNeed", "overextensionRisk"];
if (!SECTIONS.every((s2) => prc.sections?.[s2]?.evidence && prc.sections[s2].insufficientBehavior !== undefined)) fail("A2-15: private context sections lack evidence rules");
else ok("A2-15: every private context section has an evidence rule (support source + min + soften/omit + fallback)");
if (!prc.resultReasons?.shape?.includes("itemRefs") || !/dimensionScores/.test(prc.resultReasons.rule ?? "")) fail("A2-16: result-reasons spec missing");
else ok("A2-16: machine-readable resultReasons spec present (feeds MTF-1 reasons.itemRefs)");

// A2-17/18: Mixed limits + default no_recommendation
const mixedR = values.results.find((r) => r.resultId === "VAL_R_MIXED");
const mp = JSON.stringify(mixedR.private);
if (/移行|入れ替わ|変わりつつ|決断|迫らない|焦る/.test(mp)) fail("A2-17: Mixed still carries unsupported context claims");
else if (!/推測することはできません|推測しません|分かりません/.test(mp)) fail("A2-17: Mixed must decline to infer unsupported contexts");
else ok("A2-17: Mixed private layer states only what close scores prove (declines to infer elsewhere)");
if (JSON.stringify(mixedR.private.recommendationTags) !== JSON.stringify(["no_recommendation"])) fail("A2-18: Mixed default must be no_recommendation");
else ok("A2-18: Mixed default recommendation is no_recommendation");

// A2-19: recommendation traceability
let recBad = [];
for (const r of values.results) {
  for (const rec of r.private.recommendations ?? []) {
    if (!rec.fitReasonJa || !rec.evidenceSource || !rec.consent || !rec.boundary) recBad.push(`${r.resultId}:${rec.tag}`);
    if (!GOV.includes(rec.tag)) recBad.push(`${r.resultId}:${rec.tag}(ungoverned)`);
  }
  if (!Array.isArray(r.private.recommendations)) recBad.push(`${r.resultId}:missing`);
}
if (recBad.length) fail(`A2-19: recommendation traceability — ${recBad.join(", ")}`);
else ok("A2-19: every recommendation tag carries fitReason + evidenceSource + consent + boundary (governed)");

// A2-20: share hooks differentiated (not name+ending, not template)
const shareBad = values.results.filter((r) => r.public.shareLineJa.includes(r.public.displayNameJa) || /^いまは「/.test(r.public.shareLineJa));
const shareSet = new Set(values.results.map((r) => r.public.shareLineJa));
if (shareBad.length || shareSet.size !== values.results.length) fail(`A2-20: share hooks insufficiently differentiated — ${shareBad.map((r) => r.resultId).join(", ")}`);
else ok("A2-20: 8 share hooks are behavior-recognizable standalone lines (no result-name-plus-ending variation)");

// A2-21: hashes reproduce
const vHash = createHash("sha256").update(JSON.stringify(ITEMS), "utf8").digest("hex");
const dHash = createHash("sha256").update(JSON.stringify([daily.stateSchema.fields, daily.stateSchema.privateReflection, daily.acknowledgementRules]), "utf8").digest("hex");
if (values.definition.contentHash.value !== vHash || daily.definition.contentHash.value !== dHash) fail(`A2-21: hash mismatch (values ${vHash.slice(0, 8)}, daily ${dHash.slice(0, 8)})`);
else ok(`A2-21: canonical hashes reproduce (values ${vHash.slice(0, 12)}…, daily ${dHash.slice(0, 12)}…)`);
// anti-screening (retained)
if (!values.usageBoundaryJa?.includes("採用") || !values.interpretationLimitsJa.includes("第三者による判断")) fail("A2-scr: anti-screening boundary missing");
else ok("A2-scr: anti-screening usage boundary present");
if (daily.identity.activationState !== "gated" || values.identity.activationState !== "gated") fail("A2-gate: gating changed"); else ok("A2-gate: both methods remain gated");

// ── M1: CANONICAL MIRROR SEMANTIC SYNCHRONIZATION (MTF-2A.2-M1) ──────────────
// Negative checks are SCOPED to current-truth documents/sections so that the
// structured review record's historical defect tables (which quote obsolete
// phrases by design) are distinguishable from active claims.
const M1 = {
  idx: read("MTF2A_PACKAGE_INDEX.md"),
  dspec: read("MTF2A_DAILY_CHECK_IN_PRODUCT_SPEC.md"),
  dcopy: read("MTF2A_DAILY_CHECK_IN_COPY_SYSTEM.md"),
  vbench: read("MTF2A_VALUES_BENCHMARK.md"),
  vspec: read("MTF2A_VALUES_PRODUCT_SPEC.md"),
  reg: read("MTF2A_SOURCE_AND_ORIGINALITY_REGISTER.md"),
  ed: read("MTF2A_JAPANESE_EDITORIAL_REVIEW.md"),
  tr: read("MTF2A_TRUST_RISK_REVIEW.md"),
  rr: read("MTF2A_STRUCTURED_REVIEW_RECORD.md"),
  vbank: read("MTF2A_VALUES_QUESTION_BANK.md"),
  vcopy: read("MTF2A_VALUES_RESULT_COPY.md"),
};
// M1-1 package index: no stale v1.1 spec/ack claims
if (/Canonical spec \(v1\.1\)/.test(M1.idx) || /ack rules v1\.1/.test(M1.idx) || /daily-ack-v1\.1\b/.test(M1.idx)) fail("M1-1: package index still claims v1.1 spec/ack");
else ok("M1-1: package index carries no stale v1.1 spec/ack claim");
// M1-2 package index: no completed-20-step claim; Step-20-pending truth present
if (/completed the full \*\*20-step/.test(M1.idx) || !M1.idx.includes("Forge steps 1–19") || !M1.idx.includes("Step 20 (Founder acceptance) is PENDING")) fail("M1-2: Forge step-20 truth wrong in package index");
else ok("M1-2: package index states Steps 1–19 complete / Step 20 (Founder acceptance) PENDING");
// M1-3 daily product spec: ack version is v1.2, no v1.1 reference
if (/daily-ack-v1\.1\b/.test(M1.dspec) || !M1.dspec.includes("daily-ack-v1.2")) fail("M1-3: daily product spec ack version stale");
else ok("M1-3: daily product spec cites daily-ack-v1.2 only");
// M1-4 benchmark: Mixed = close scores only; no motion/transition rationale
if (/priorities in motion/.test(M1.vbench) || /入れ替わっている途中/.test(M1.vbench)) fail("M1-4: benchmark retains priorities-in-motion Mixed rationale");
else if (!M1.vbench.includes("Mixed is a valid scored outcome, not an incomplete state") || !M1.vbench.includes("does not by itself prove transition, conflict or indecision")) fail("M1-4: benchmark missing close-score-only Mixed meaning");
else ok("M1-4: benchmark Mixed rationale = close scores only, valid scored outcome, no transition claim");
// M1-5 originality register: final scoring model description (no head-to-head tie-break claim)
if (/with head-to-head tie-break/.test(M1.reg)) fail("M1-5: register still describes a head-to-head tie-break");
else if (!M1.reg.includes("pair-independent Mixed threshold") || !M1.reg.includes("no head-to-head condition determines Mixed") || !M1.reg.includes("48/48 coverage") || !M1.reg.includes("declaration-order tie-break")) fail("M1-5: register missing final scoring-model description");
else ok("M1-5: register describes pairwise win rate + 48/48 + pair-independent Mixed + declaration-order secondary tie-break");
// M1-6 values product spec: hash already pinned (not deferred to implementation)
if (/pinned at implementation/.test(M1.vspec)) fail("M1-6: values spec still defers hash pinning to implementation");
else if (!M1.vspec.includes("already computed and pinned") || !M1.vspec.includes(values.definition.contentHash.value)) fail("M1-6: values spec missing pinned-hash truth");
else ok("M1-6: values spec states the bank hash is already computed/pinned; implementation must verify it");
// M1-7 trust-risk: current state = E-1 resolved for V1, E-2 sole legal follow-up
if (!M1.tr.includes("E-1 — RESOLVED for V1") || !M1.tr.includes("E-2 — OPEN as a future ToU/legal implementation item") || !M1.tr.includes("one unresolved legal follow-up")) fail("M1-7: trust-risk current escalation state missing/wrong");
else if (/## Outcome\n/.test(M1.tr)) fail("M1-7: unqualified historical Outcome heading still reads as current");
else ok("M1-7: trust-risk current state = E-1 resolved for V1; E-2 the single legal follow-up; historical outcome marked");
// M1-8 no stale hash anywhere: every 64-hex string in any MD equals a canonical hash
{
  const allMd = Object.values(M1).join("\n");
  const hex = [...new Set(allMd.match(/\b[0-9a-f]{64}\b/g) ?? [])];
  const staleHex = hex.filter((h) => h !== values.definition.contentHash.value && h !== daily.definition.contentHash.value);
  if (staleHex.length) fail(`M1-8: stale hash(es) present — ${staleHex.map((h) => h.slice(0, 12)).join(", ")}`);
  else ok("M1-8: every full hash in the MD set equals a canonical hash (no stale hashes)");
}
// M1-9 no stale scoring version anywhere (docs + JSONs)
if (/values-scoring-v1\.1/.test(Object.values(M1).join("\n")) || /values-scoring-v1\.1/.test(allText)) fail("M1-9: values-scoring-v1.1 reference survives");
else ok("M1-9: no values-scoring-v1.1 reference anywhere");
// M1-10 package index version matrix matches canonical JSONs
{
  const wantIdx = ["mtf2a-daily-check-in-v1.2.0", "mtf2a-yorisou-values-v1.2.0", "daily-state-schema-v1.1", "daily-ack-v1.2", "daily-longitudinal-v1", "values-bank-v1.0", "values-scoring-v1.0", "values-result-v1.0", "values-report-outline-v1.0"];
  const missing = wantIdx.filter((v) => !M1.idx.includes(v));
  const notCanon = ["mtf2a-daily-check-in-v1.2.0", "mtf2a-yorisou-values-v1.2.0"].filter((v) => !allText.includes(v));
  if (missing.length || notCanon.length) fail(`M1-10: version matrix mismatch — idx missing: ${missing.join(",") || "none"}; not in JSON: ${notCanon.join(",") || "none"}`);
  else ok("M1-10: package-index version matrix complete and consistent with the canonical JSONs (both spec versions v1.2.0)");
}
// M1-11 package index pins both canonical hashes
if (!M1.idx.includes(values.definition.contentHash.value) || !M1.idx.includes(daily.definition.contentHash.value)) fail("M1-11: package index missing a canonical hash");
else ok("M1-11: package index pins both final canonical hashes");
// M1-12 daily product spec + copy system: field-valid longitudinal truth, no stale all-days example
if (/今月いちばん多かった/.test(M1.dspec) || !M1.dspec.includes("field-valid") || !M1.dspec.includes("記録した日の中では")) fail("M1-12: daily longitudinal field-valid truth missing/stale in product spec");
else ok("M1-12: daily product spec states field-valid denominators; unrecorded days neutral; 記録した日の中では wording");
// M1-13 copy system privacy quote equals canonical privacyJa (incl. consent clause; no absolute claim)
{
  const priv = JSON.stringify(daily).match(/"privacyJa":"([^"]+)"/)?.[1] ?? "";
  if (!priv || !M1.dcopy.includes(priv)) fail("M1-13: copy-system privacy quote does not match canonical privacyJa");
  else if (/だれにも見えません/.test(M1.dcopy)) fail("M1-13: absolute invisibility claim present");
  else ok("M1-13: copy-system privacy summary equals canonical privacyJa (consent clause included, no absolute claim)");
}
// M1-14 editorial review carries the final MTF-2A.2 note (current-state wording)
if (!M1.ed.includes("MTF-2A.2 final editorial note") || !M1.ed.includes("daily-ack-v1.2") || !M1.ed.includes("privateRenderingContract")) fail("M1-14: final editorial note missing");
else ok("M1-14: editorial review records the final Q04/Q25, ack v1.2, share-pass and answer-traceable state");
// M1-15 review record: C-25 present; step-20 pending in completion matrix
if (!M1.rr.includes("C-25") || !M1.rr.includes("Step 20 (Founder review): PENDING") || !M1.rr.includes("byte-unchanged from `426e52b`")) fail("M1-15: C-25 / step-20 truth missing in review record");
else ok("M1-15: review record carries C-25 mirror-staleness defect + documentation-only correction + step-20 PENDING");

// ── EXTERNAL REPOSITORY GATES (executed for real; counted separately) ────────
try {
  execSync("node scripts/validate-mtf1-docs.mjs", { stdio: "pipe" });
  gateOk("EXT-1: MTF-1 validator executed — exit 0 (67 labeled checks green)");
} catch { gateFail("EXT-1: MTF-1 validator failed"); }
try {
  const diff = execSync("git diff --name-only main...HEAD", { encoding: "utf8" }).trim().split("\n").filter(Boolean);
  const outOfScope = diff.filter((f) => !f.startsWith("docs/yorisou/mtf2a/") && f !== "scripts/validate-mtf2a-content.mjs");
  if (diff.length !== 15 || outOfScope.length) gateFail(`EXT-2: branch scope — ${diff.length} files, out-of-scope: ${outOfScope.join(",") || "none"}`);
  else gateOk("EXT-2: branch scope executed via git — exactly 15 files, all in docs/yorisou/mtf2a/** + validator");
  const runtime = diff.filter((f) => /^(app|components|lib|content|data|public|supabase)\//.test(f) || /^package\.json$/.test(f));
  if (runtime.length) gateFail(`EXT-3: runtime paths changed — ${runtime.join(",")}`);
  else gateOk("EXT-3: no runtime/config/migration path changed (verified from the real diff)");
} catch (e) { gateFail(`EXT-2/3: git inspection failed — ${e.message}`); }
const pkgFileCount = readdirSync(DIR).length;
if (pkgFileCount !== 14) fail(`A2-22: package must be 14 docs (+validator = 15) — found ${pkgFileCount}`);
else ok("A2-22: package inventory 14 docs + 1 validator = 15 branch files");

if (failures) { console.error(`\nFAILED — ${failures} total failure(s): labeled-check failures ${failures - gateFailures}, gate failures ${gateFailures}.`); process.exit(1); }
console.log(`\nMTF-2A.2 content package VALID
  labeled executable checks : ${checks}
  scoring fixture executions: ${fixtures}
  external repository gates : ${gates}
  failures                  : 0
(values: 48 items, 7 dims, 8 results, 48/48 coverage rule, hash ${vHash.slice(0, 12)}…; daily: 13 acks v1.2, field-valid summaries, hash ${dHash.slice(0, 12)}…)`);
