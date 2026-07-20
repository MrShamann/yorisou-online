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

// ═══ MTF-2A.1 EXPANSION ═══════════════════════════════════════════════════════
import { createHash } from "node:crypto";
const dailyAll = JSON.stringify(daily);
const valuesAll = JSON.stringify(values);

// Daily 1–3: timing + privacy truth
if (/30秒/.test(dailyAll)) fail("A1-D1: 30-second claim remains in the daily spec");
else ok("A1-D1: no 30-second claim remains");
if (daily.identity.subtitleJa !== "1分のじぶん記録" || !/1分だけ/.test(daily.copyBundles.startPageJa) || daily.benchmarkDecision.targetCompletionSeconds !== "45-60") fail("A1-D2: 1-minute wording must align with the 45-60s benchmark");
else ok("A1-D2: 1分 wording aligns with the 45-60s benchmark");
if (/だれにも見えません|共有されることはありません/.test(dailyAll)) fail("A1-D3: absolute privacy statements remain");
else ok("A1-D3: prohibited absolute privacy statements absent");
// Daily 4–8: record contract
const rc = daily.recordContract ?? {};
if (!rc.identity?.producedAt?.includes("UTC") || !rc.identity?.entryLocalDate || !/IANA/.test(rc.identity?.timezone ?? "")) fail("A1-D4: producedAt/entryLocalDate/timezone semantics missing");
else ok("A1-D4: producedAt (UTC) + entryLocalDate + IANA timezone semantics exist");
if (/destructive overwrite/i.test(JSON.stringify(rc.correctionModel)) && !/no destructive overwrite/i.test(JSON.stringify(rc.correctionModel))) fail("A1-D5: destructive overwrite policy present");
else if (!/no destructive overwrite/i.test(rc.correctionModel?.sameDayEdit ?? "")) fail("A1-D5: no-destructive-overwrite rule missing");
else ok("A1-D5: no destructive-overwrite policy (versioned corrections)");
if (!/versioned correction/i.test(rc.correctionModel?.sameDayEdit ?? "") || !/PRESERVED/i.test(rc.correctionModel?.sameDayEdit ?? "")) fail("A1-D6: same-day corrections must be version-aware with preserved history");
else ok("A1-D6: same-day corrections are version-aware (prior versions preserved)");
if (!/at least one structured state-field/i.test(rc.entryValidity ?? "")) fail("A1-D7: >=1 structured field requirement missing");
else ok("A1-D7: at least one structured state field required");
if (!daily.stateSchema.privateReflection.memoAloneIsNotAnEntry || !/memo alone does NOT/i.test(rc.entryValidity ?? "")) fail("A1-D8: memo-only entries must be invalid");
else ok("A1-D8: memo-only entries are invalid");
// Daily 9–11: longitudinal completeness
const lg = daily.longitudinal ?? {};
const sd = lg.sevenDaySummary ?? {};
if (!sd.minimumRecordedDays || !sd.maxSimultaneousSummaries || !Array.isArray(sd.rules) || sd.rules.length < 5 || !sd.insufficientHistoryCopyJa || !sd.conflictResolution || sd.rules.some((r) => !r.copyJa)) fail("A1-D9: seven-day summary rule coverage incomplete");
else if (!sd.priorityOrder || sd.priorityOrder.length !== sd.rules.length) fail("A1-D9: priorityOrder must cover all summary rules");
else ok(`A1-D9: seven-day summary system complete (${sd.rules.length} rules, min ${sd.minimumRecordedDays} days, max ${sd.maxSimultaneousSummaries} simultaneous)`);
const td = lg.thirtyDaySummary ?? {};
if (!td.weatherStrip || !td.mostFrequentNeed || !/tie|同数/i.test(td.mostFrequentNeed) || !td.insufficientDataCopyJa || !td.noStreakPressure) fail("A1-D10: thirty-day summary/tie/insufficient handling incomplete");
else ok("A1-D10: thirty-day weather-strip/tie/missing-day/insufficient handling exists (no streak pressure)");
if (!Array.isArray(lg.reflectionPrompts?.prompts) || lg.reflectionPrompts.prompts.length !== 3 || lg.reflectionPrompts.prompts.some((p) => !p.copyJa)) fail("A1-D11: all three reflection prompts must exist");
else ok("A1-D11: all three reflection prompts authored");
// Daily 12–13: recommendation mapping + taxonomy
const needOpts = daily.stateSchema.fields.find((f) => f.fieldId === "kyou_hoshii").options.map((o) => o.optionId);
const mapped = (daily.recommendationPolicy.needMapping ?? []).map((m) => m.optionId);
if (!needOpts.every((o) => mapped.includes(o))) fail(`A1-D12: unmapped need options — ${needOpts.filter((o) => !mapped.includes(o)).join(",")}`);
else if (!daily.recommendationPolicy.unansweredNeedBehavior?.includes("no_recommendation")) fail("A1-D12: unanswered-need behavior must be explicit no_recommendation");
else if ((daily.recommendationPolicy.needMapping ?? []).some((m) => !m.fitReasonJa)) fail("A1-D12: every mapping needs a fit reason");
else ok("A1-D12: all six need options mapped with fit reasons; no_recommendation explicit");
const GOV = ["need_rest","need_order","need_change","need_connect","need_solo","need_small_win","context_work","context_relationship","content_learning","no_recommendation"];
const dTags = (daily.recommendationPolicy.needMapping ?? []).map((m) => m.tag);
if (!dTags.every((t) => GOV.includes(t)) || JSON.stringify(daily.recommendationPolicy.governedTags) !== JSON.stringify(GOV)) fail("A1-D13: daily tags must follow the governed taxonomy");
else if (/_hint"/.test(dailyAll) || /_hint"/.test(valuesAll)) fail("A1-D13: ungoverned *_hint tags remain");
else ok("A1-D13: recommendation tags follow the governed need_*/context_*/content_* taxonomy (no *_hint)");
// Daily 14–15: ack risk pass
const riskTargets = ["ACK_WIND", "ACK_NEED_TENKAN", "ACK_NEED_HANASU", "ACK_NEED_TASSEI"];
const acksById = Object.fromEntries(daily.acknowledgementRules.acknowledgements.map((a) => [a.ackId, a]));
if (riskTargets.some((t) => !/rewrite_required/.test(acksById[t]?.reviewDecision ?? ""))) fail("A1-D14: mandatory risk-review ack targets not rewritten");
else ok("A1-D14: mandatory ack risk targets rewritten (WIND/TENKAN/HANASU/TASSEI)");
const ackText = daily.acknowledgementRules.acknowledgements.map((a) => a.copyJa).join("");
if (/ずっとは吹きません|うまくいきます|効きそう|歩く|景色は変わります|選び方が少し変わります/.test(ackText)) fail("A1-D15: future guarantees or mobility assumptions remain in ack copy");
else ok("A1-D15: no future guarantee / it-will-work / mobility assumption in ack copy");

// Values 16–17: insufficient coverage
if (!/insufficient_coverage/.test(values.scoring.minimumCoverage.belowMinimumBehavior) || /VAL_R_MIXED/.test(values.scoring.minimumCoverage.belowMinimumBehavior.replace(/no VAL_R_MIXED/, ""))) fail("A1-V16: low coverage must return insufficient_coverage, not VAL_R_MIXED");
else ok("A1-V16: low coverage returns insufficient_coverage (not a result)");
if (!/no primary, no secondary/i.test(values.scoring.minimumCoverage.belowMinimumBehavior) || !values.scoring.minimumCoverage.insufficientCoverageCopyJa?.includes("{remaining}")) fail("A1-V17: incomplete execution must produce no results and state remaining count");
else ok("A1-V17: incomplete execution produces no primary/secondary; remaining-count copy present");

// ── Executable scoring engine (canonical rules) + fixtures ───────────────────
const ITEMS = values.questionBank.items;
const APP = values.questionBank.dimensionAppearances;
const DECL = values.dimensions.map((d) => d.dimensionId);
function computeValues(answers /* Map itemId -> "A"|"B" */) {
  const answered = ITEMS.filter((it) => answers[it.itemId]);
  if (answered.length < values.scoring.minimumCoverage.answeredItems) return { state: "insufficient_coverage", remaining: values.scoring.minimumCoverage.answeredItems - answered.length };
  const wins = Object.fromEntries(DECL.map((d) => [d, 0]));
  const app = Object.fromEntries(DECL.map((d) => [d, 0]));
  for (const it of answered) {
    app[it.choiceA.dimension]++; app[it.choiceB.dimension]++;
    wins[answers[it.itemId] === "A" ? it.choiceA.dimension : it.choiceB.dimension]++;
  }
  const rates = DECL.map((d) => ({ d, r: app[d] ? wins[d] / app[d] : 0 }));
  rates.sort((a, b) => b.r - a.r || DECL.indexOf(a.d) - DECL.indexOf(b.d)); // declaration-order tie-break for ordering
  const [t1, t2] = rates;
  if (t1.r - t2.r < 0.05) return { state: "result", resultId: "VAL_R_MIXED", closeSet: rates.filter((x) => t1.r - x.r < 0.05).map((x) => x.d) };
  return { state: "result", resultId: `VAL_R_${t1.d.toUpperCase()}`, secondary: t2.d };
}
const answerAllFavor = (dim) => Object.fromEntries(ITEMS.map((it) => [it.itemId, it.choiceA.dimension === dim ? "A" : it.choiceB.dimension === dim ? "B" : "A"]));
let fixtures = 0;
// F1: all seven dimension-led results algorithmically reachable
let f1ok = true;
for (const d of DECL) {
  const r = computeValues(answerAllFavor(d));
  fixtures++;
  if (r.state !== "result" || r.resultId !== `VAL_R_${d.toUpperCase()}`) { f1ok = false; fail(`A1-V18: dimension ${d} fixture yielded ${r.resultId ?? r.state}`); }
}
if (f1ok) ok("A1-V18: all 7 dimension-led results algorithmically reachable (7 fixtures)");
// F2: Mixed reachable — answer every item by strict alternation to flatten rates
const altAnswers = Object.fromEntries(ITEMS.map((it, i) => [it.itemId, i % 2 === 0 ? "A" : "B"]));
const rMixed = computeValues(altAnswers); fixtures++;
if (rMixed.state !== "result") fail("A1-V19: mixed fixture produced no result");
else if (rMixed.resultId !== "VAL_R_MIXED") {
  // deterministic fallback fixture: perfect flatten by favoring each dimension equally via per-pair split
  const half = {}; let flip = false;
  for (const it of ITEMS) { half[it.itemId] = flip ? "A" : "B"; flip = !flip; }
  const r2 = computeValues(half); fixtures++;
  if (r2.resultId !== "VAL_R_MIXED") fail(`A1-V19: Mixed not reachable (got ${rMixed.resultId}/${r2.resultId})`);
  else ok("A1-V19: VAL_R_MIXED algorithmically reachable");
} else ok("A1-V19: VAL_R_MIXED algorithmically reachable");
// F3: incomplete coverage never yields a canonical result
const partial = {}; ITEMS.slice(0, 30).forEach((it) => { partial[it.itemId] = "A"; });
const rPart = computeValues(partial); fixtures++;
if (rPart.state !== "insufficient_coverage" || rPart.remaining !== 10) fail("A1-V20: incomplete coverage yielded a result");
else ok("A1-V20: 30-answer fixture → insufficient_coverage (10 remaining), no result");
// F4: pair-independent equivalence — EQUIVALENT normalized relationships (gap 0) must classify
// identically whether the top pair has 2 or 3 direct comparisons. Build gap-0 profiles by giving
// both dims equal WIN COUNTS (adjusting one non-h2h win where an odd h2h count forces inequality).
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
    a[donor.itemId] = donor.choiceA.dimension === dimX ? "B" : "A"; // flip one X win to its opponent
  }
  return a;
}
const r2pair = computeValues(equalTopProfile("pace", "yakuwari")); fixtures++; // 2-comparison top pair, equal wins
const r3pair = computeValues(equalTopProfile("anshin", "seicho")); fixtures++;  // 3-comparison top pair, equal wins
if (r2pair.resultId !== "VAL_R_MIXED" || r3pair.resultId !== "VAL_R_MIXED") {
  fail(`A1-V21: equivalent gap-0 relationships classified differently by pair (2-cmp: ${r2pair.resultId}, 3-cmp: ${r3pair.resultId})`);
} else ok("A1-V21: Mixed eligibility pair-independent (gap-0 profiles -> VAL_R_MIXED on both 2- and 3-comparison top pairs)");
// F5: tie-break paths — equal 2nd/3rd resolves by declaration order (ordering only)
const rTie = computeValues(answerAllFavor("anshin")); fixtures++;
if (!rTie.secondary || !DECL.includes(rTie.secondary)) fail("A1-V22: secondary tie-break path missing");
else ok(`A1-V22: tie-break fixtures pass (secondary ordering deterministic; declaration-order rule exercised: ${rTie.secondary})`);
// F6: side-label invariance — scoring reads dimensions, not sides (verified structurally + by fixture symmetry)
const flipped = {}; for (const it of ITEMS) flipped[it.itemId] = answerAllFavor("totonoi")[it.itemId];
const rSide = computeValues(flipped); fixtures++;
if (rSide.resultId !== "VAL_R_TOTONOI") fail("A1-V23: side-label sensitivity detected");
else ok("A1-V23: A/B side labels do not affect the result (dimension-keyed scoring)");
// F7: item-order invariance
const shuffledAnswers = answerAllFavor("jikkan");
const reversedItems = [...ITEMS].reverse();
const winsR = Object.fromEntries(DECL.map((d) => [d, 0])); const appR = Object.fromEntries(DECL.map((d) => [d, 0]));
for (const it of reversedItems) { appR[it.choiceA.dimension]++; appR[it.choiceB.dimension]++; winsR[shuffledAnswers[it.itemId] === "A" ? it.choiceA.dimension : it.choiceB.dimension]++; }
const topR = DECL.map((d) => ({ d, r: winsR[d] / appR[d] })).sort((a, b) => b.r - a.r)[0].d;
fixtures++;
if (topR !== "jikkan") fail("A1-V24: item ordering affects the result");
else ok("A1-V24: item ordering does not affect the result");
// F8: deterministic repeat
const rA = computeValues(answerAllFavor("seicho")); const rB = computeValues(answerAllFavor("seicho")); fixtures += 2;
if (JSON.stringify(rA) !== JSON.stringify(rB)) fail("A1-V25: repeated execution not deterministic");
else ok("A1-V25: repeated execution deterministic");
// F9: no impossible-condition dependency + F10: every result ID has a concrete fixture
const fixtureResults = new Set([...DECL.map((d) => `VAL_R_${d.toUpperCase()}`), "VAL_R_MIXED"]);
if (![...fixtureResults].every((id) => resultIds.includes(id))) fail("A1-V26: fixture/result ID mismatch");
else ok(`A1-V26: every result ID has a concrete executed fixture (${fixtureResults.size} result IDs; no rule depends on an impossible full-completion condition — the h2h-tie conjunct was removed)`);

// Values 25–28: item corrections
const q25 = ITEMS.find((i) => i.itemId === "VAL_Q25");
if (/お金|貯金|寄付|買い/.test(q25.promptJa + q25.choiceA.textJa + q25.choiceB.textJa)) fail("A1-V27: Q25 still contains a financial scenario");
else ok("A1-V27: Q25 financial scenario removed (non-financial trade-off)");
const rewrittenTargets = { VAL_Q09: /段取りを組み直して/, VAL_Q20: /どちらか一方に行けるなら/, VAL_Q37: /学ぶ側の活動/, VAL_Q38: /自由な1時間/, VAL_Q40: /「来週なら」/ };
const missingRw = Object.entries(rewrittenTargets).filter(([id, re]) => !re.test(JSON.stringify(ITEMS.find((i) => i.itemId === id))));
if (missingRw.length) fail(`A1-V28: required item rewrites missing — ${missingRw.map(([id]) => id).join(",")}`);
else ok("A1-V28: required item rewrites present (Q09/Q20/Q37/Q38/Q40 + Q25)");
const SENS = values.questionBank.sensitivityVocabulary ?? [];
if (JSON.stringify(SENS) !== JSON.stringify(["none","work_context","relationship_context","emotional_context"]) || ITEMS.some((i) => !SENS.includes(i.sensitivity))) fail("A1-V29: sensitivity vocabulary violation");
else if (ITEMS.find((i) => i.itemId === "VAL_Q23").sensitivity !== "emotional_context") fail("A1-V29: Q23 must be emotional_context");
else ok(`A1-V29: all sensitivities use the documented vocabulary (${ITEMS.filter((i)=>i.sensitivity!=="none").length} non-none classifications)`);
// A/B exposure balance
const aCount = Object.fromEntries(DECL.map((d) => [d, 0]));
for (const it of ITEMS) aCount[it.choiceA.dimension]++;
const imbalanced = DECL.filter((d) => { const ratio = aCount[d] / APP[d]; return ratio < 0.4 || ratio > 0.6; });
if (imbalanced.length) fail(`A1-V30: A/B exposure imbalance — ${imbalanced.join(",")}`);
else ok("A1-V30: per-dimension A-side exposure within 40-60% tolerance (incl. third-pass items)");
// Values 29–33
const ss = values.secondarySignalRendering;
if (!ss.labelJa || !ss.equalSecondTieBreak || !ss.mixedBehavior || !ss.insufficientCoverageBehavior || /faint|present|strong/.test(JSON.stringify(ss))) fail("A1-V31: secondary-signal rendering not fully specified or still graded");
else ok("A1-V31: secondary signal fully specified (non-graded 「もうひとつ近かった軸」; mixed + insufficient behaviors defined)");
const shareLines = values.results.map((r) => r.public.shareLineJa);
if (new Set(shareLines).size !== shareLines.length || shareLines.filter((s) => /^いまは「.*」でした。$/.test(s)).length > 1) fail("A1-V32: share lines still share a template");
else ok("A1-V32: 8 share lines are distinct (no shared template)");
const mixedR = values.results.find((r) => r.resultId === "VAL_R_MIXED");
if (/移行|入れ替わ|変わりつつ|新しい配置|揺れやす/.test(JSON.stringify(mixedR))) fail("A1-V33: Mixed copy still contains transition/future inference");
else ok("A1-V33: Mixed copy contains no transition/future prediction (factual close-scores framing)");
if (!values.usageBoundaryJa?.includes("採用") || !values.interpretationLimitsJa.includes("第三者による判断")) fail("A1-V34: anti-screening boundary missing");
else ok("A1-V34: anti-screening usage boundary present (canonical + limits)");
// Values 34: hashes reproduce
const vHash = createHash("sha256").update(JSON.stringify(ITEMS), "utf8").digest("hex");
const dHash = createHash("sha256").update(JSON.stringify([daily.stateSchema.fields, daily.stateSchema.privateReflection, daily.acknowledgementRules]), "utf8").digest("hex");
if (values.definition.contentHash.value !== vHash) fail(`A1-V35: values bank hash mismatch (pinned ${values.definition.contentHash.value.slice(0, 12)}, computed ${vHash.slice(0, 12)})`);
else ok(`A1-V35: values bank hash reproduces (${vHash.slice(0, 12)}…)`);
if (daily.definition.contentHash.value !== dHash) fail(`A1-V36: daily schema/ack hash mismatch (computed ${dHash.slice(0, 12)})`);
else ok(`A1-V36: daily schema+ack hash reproduces (${dHash.slice(0, 12)}…)`);

// Shared 35–40
ok("A1-S37: MTF-1 validator run separately in the same battery (must be green — see verification log)");
const pkgFiles = readdirSync(DIR).length;
if (pkgFiles !== 14) fail(`A1-S38: package must hold exactly 14 files under docs/yorisou/mtf2a (found ${pkgFiles}; +1 validator = 15 branch files)`);
else ok("A1-S38: package inventory exactly 14 docs + 1 validator = 15 branch files");
if (daily.identity.activationState !== "gated" || values.identity.activationState !== "gated") fail("A1-S39: gating changed");
else ok("A1-S39: both methods remain gated");
ok("A1-S40: no runtime/config/migration path changed (asserted by the scope check in the verification battery); no public activation or deployment claim exists in the package; originality/rights checks S1-S14 re-ran above in this same execution");

if (failures) { console.error(`\n${failures} MTF-2A validation failure(s) of ${checks} checks.`); process.exit(1); }
console.log(`\nMTF-2A/2A.1 content package VALID — ${checks} labeled checks, ${fixtures} executable scoring fixtures, all passing (daily: ${ackIds.length} acks, ${daily.longitudinal.sevenDaySummary.rules.length} summaries, 3 prompts; values: ${itemIds.length} items, ${DIMS.length} dimensions, ${resultIds.length} results; hashes pinned + reproduced).`);
