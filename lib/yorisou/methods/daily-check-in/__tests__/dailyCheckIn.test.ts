// DCI-1 — canonical contract + recorded-state runtime + acknowledgement +
// longitudinal + hint tests (node:assert under tsx, repo convention).
// Run: npm run test:daily-check-in

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

import { DAILY_CHECK_IN_DEFINITION, DAILY_CHECK_IN_SOURCE_HASH } from "../definition.generated";
import { DAILY_CHECK_IN_RUNTIME_DEFINITION } from "../runtimeDefinition";
import { executeRecordedState, localDateForInstant } from "../../../method-runtime/recordedState";
import { selectAcknowledgement } from "../acknowledgement";
import { sevenDaySummaries, thirtyDayView, type TimelineEntry } from "../longitudinal";
import { hintForEntry } from "../hints";
import { DAILY_CHECK_IN_EVENTS } from "../events";
import {
  serverTimeIdentity,
  resumedTimeIdentity,
  correctionWindowOpen,
  RESUMED_MAX_AGE_MS,
  RESUMED_FUTURE_SKEW_MS,
} from "../timeContract";
import { CPV1_METHOD_UNIVERSE, DAILY_CHECK_IN_RECONCILIATION, getMethod, methodActivationState } from "../../../../cpv1/methods";
import { dailyCheckInAccess } from "../access";

let passed = 0;
function check(label: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`  ✓ ${label}`);
}

const canonical = JSON.parse(readFileSync(join(process.cwd(), "docs/yorisou/mtf2a/daily-check-in.v1.json"), "utf8"));

console.log("DCI-1 — canonical contract");
check("canonical content hash reproduces and matches the pinned artifact hash", () => {
  const h = createHash("sha256")
    .update(JSON.stringify([canonical.stateSchema.fields, canonical.stateSchema.privateReflection, canonical.acknowledgementRules]), "utf8")
    .digest("hex");
  assert.equal(h, "4107f004e0099bfd4ef82936f9801c421d256eb6d7ccacda8e762a7a132a8bd3");
  assert.equal(DAILY_CHECK_IN_SOURCE_HASH, h);
  assert.equal(DAILY_CHECK_IN_DEFINITION.contentHash, h);
});
check("generated artifact has NOT drifted from the canonical JSON (generator --check)", () => {
  execFileSync("node", ["scripts/generate-daily-check-in-runtime.mjs", "--check"], { stdio: "pipe" });
});
check("method identity + versions match canonical", () => {
  assert.equal(DAILY_CHECK_IN_DEFINITION.methodId, "daily-check-in");
  assert.equal(DAILY_CHECK_IN_DEFINITION.methodVersion, "daily-check-in-v1.0");
  assert.equal(DAILY_CHECK_IN_DEFINITION.schemaVersion, "daily-state-schema-v1.1");
  assert.equal(DAILY_CHECK_IN_DEFINITION.acknowledgementVersion, "daily-ack-v1.2");
  assert.equal(DAILY_CHECK_IN_DEFINITION.longitudinalVersion, "daily-longitudinal-v1");
  assert.equal(DAILY_CHECK_IN_DEFINITION.recordContractVersion, "daily-record-contract-v1");
  assert.equal(DAILY_CHECK_IN_DEFINITION.executionModel, "recorded_state");
  assert.equal(DAILY_CHECK_IN_DEFINITION.activationState, "gated");
  assert.equal(DAILY_CHECK_IN_DEFINITION.yorisouScoring, null);
});
check("exact canonical fields and options (5 fields; 5/4/4/4/6 options)", () => {
  assert.deepEqual(
    DAILY_CHECK_IN_DEFINITION.fields.map((f) => f.fieldId),
    ["kokoro_tenki", "karada_juden", "atama_yohaku", "hito_kyori", "kyou_hoshii"],
  );
  assert.deepEqual(DAILY_CHECK_IN_DEFINITION.fields.map((f) => f.options.length), [5, 4, 4, 4, 6]);
  for (const [i, f] of DAILY_CHECK_IN_DEFINITION.fields.entries()) {
    assert.deepEqual(f.options, canonical.stateSchema.fields[i].options);
  }
});
check("all 13 acknowledgements present with exact canonical copy; cascade ends with default", () => {
  assert.equal(DAILY_CHECK_IN_DEFINITION.acknowledgements.length, 13);
  for (const [i, a] of DAILY_CHECK_IN_DEFINITION.acknowledgements.entries()) {
    assert.equal(a.copyJa, canonical.acknowledgementRules.acknowledgements[i].copyJa);
  }
  const cascade = DAILY_CHECK_IN_DEFINITION.acknowledgementCascade;
  assert.equal(cascade.length, 13);
  assert.equal(cascade[cascade.length - 1].rule, "default");
});
check("recommendation mapping covers all 6 kyou_hoshii options with governed tags + fit reasons", () => {
  assert.equal(DAILY_CHECK_IN_DEFINITION.needMapping.length, 6);
  const governed = new Set(["need_rest", "need_order", "need_change", "need_connect", "need_solo", "need_small_win"]);
  for (const m of DAILY_CHECK_IN_DEFINITION.needMapping) {
    assert.ok(governed.has(m.tag), m.tag);
    assert.ok(m.fitReasonJa.length > 0);
  }
});
check("privacy copy boundaries: no absolute invisibility claim; consent clause present", () => {
  assert.ok(!DAILY_CHECK_IN_DEFINITION.copy.privacyJa.includes("だれにも見えません"));
  assert.ok(DAILY_CHECK_IN_DEFINITION.copy.privacyJa.includes("同意"));
  assert.ok(DAILY_CHECK_IN_DEFINITION.copy.shareBoundaryJa.includes("共有カードやURLに載りません"));
});
check("no score/archetype anywhere in the artifact", () => {
  const text = JSON.stringify(DAILY_CHECK_IN_DEFINITION);
  assert.ok(!/archetype/i.test(text));
  assert.equal(DAILY_CHECK_IN_DEFINITION.yorisouScoring, null);
});

console.log("DCI-1 — recorded-state runtime boundary");
const NOW = "2026-07-20T03:00:00.000Z";
const TOKYO_DATE = localDateForInstant(NOW, "Asia/Tokyo")!;
const baseInput = {
  values: { kokoro_tenki: "hare", karada_juden: null, atama_yohaku: null, hito_kyori: null, kyou_hoshii: null },
  memoOptIn: false,
  memo: null,
  producedAt: NOW,
  entryLocalDate: TOKYO_DATE,
  timezone: "Asia/Tokyo",
  utcOffsetMinutes: 540,
};
check("valid partial structured submission produces a StateRecordResult envelope", () => {
  const r = executeRecordedState(DAILY_CHECK_IN_RUNTIME_DEFINITION, baseInput);
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.envelope.resultVariant, "StateRecordResult");
    assert.equal(r.envelope.stateValues.kokoro_tenki, "hare");
    assert.equal(r.envelope.stateValues.karada_juden, null);
    assert.equal(r.envelope.provenance.kind, "recorded_state");
    assert.equal(r.envelope.provenance.yorisouScoring, null);
    assert.equal(r.envelope.confirmation.required, true);
    assert.ok(!("computedAt" in r.envelope), "producedAt, not computedAt");
    assert.ok(!("score" in r.envelope) && !("archetype" in r.envelope));
  }
});
check("memo-only submission is rejected (memo alone is not an entry)", () => {
  const r = executeRecordedState(DAILY_CHECK_IN_RUNTIME_DEFINITION, {
    ...baseInput,
    values: { kokoro_tenki: null, karada_juden: null, atama_yohaku: null, hito_kyori: null, kyou_hoshii: null },
    memoOptIn: true,
    memo: "きょうのメモ",
  });
  assert.ok(!r.ok);
  if (!r.ok) assert.ok(r.errors.some((e) => e.code === "no_structured_field"));
});
check("memo without opt-in and over-length memo are rejected", () => {
  const noOptIn = executeRecordedState(DAILY_CHECK_IN_RUNTIME_DEFINITION, { ...baseInput, memo: "x", memoOptIn: false });
  assert.ok(!noOptIn.ok && noOptIn.errors.some((e) => e.code === "memo_without_opt_in"));
  const tooLong = executeRecordedState(DAILY_CHECK_IN_RUNTIME_DEFINITION, { ...baseInput, memoOptIn: true, memo: "あ".repeat(141) });
  assert.ok(!tooLong.ok && tooLong.errors.some((e) => e.code === "memo_too_long"));
});
check("unknown field/option, invalid timezone, and date/timezone mismatch are rejected", () => {
  const badOpt = executeRecordedState(DAILY_CHECK_IN_RUNTIME_DEFINITION, { ...baseInput, values: { ...baseInput.values, kokoro_tenki: "sunny" } });
  assert.ok(!badOpt.ok && badOpt.errors.some((e) => e.code === "unknown_option"));
  const badField = executeRecordedState(DAILY_CHECK_IN_RUNTIME_DEFINITION, { ...baseInput, values: { ...baseInput.values, mood: "hare" } });
  assert.ok(!badField.ok && badField.errors.some((e) => e.code === "unknown_field"));
  const badTz = executeRecordedState(DAILY_CHECK_IN_RUNTIME_DEFINITION, { ...baseInput, timezone: "Tokyo/Nowhere" });
  assert.ok(!badTz.ok && badTz.errors.some((e) => e.code === "invalid_timezone"));
  const mismatch = executeRecordedState(DAILY_CHECK_IN_RUNTIME_DEFINITION, { ...baseInput, timezone: "America/New_York" });
  assert.ok(!mismatch.ok && mismatch.errors.some((e) => e.code === "entry_date_timezone_mismatch"));
});
check("unsupported execution model is rejected explicitly", () => {
  const r = executeRecordedState({ ...DAILY_CHECK_IN_RUNTIME_DEFINITION, executionModel: "scored" }, baseInput);
  assert.ok(!r.ok);
  if (!r.ok) assert.equal(r.errors[0].code, "unsupported_execution_model");
});
check("execution is deterministic (same input ⇒ identical envelope)", () => {
  const a = executeRecordedState(DAILY_CHECK_IN_RUNTIME_DEFINITION, baseInput);
  const b = executeRecordedState(DAILY_CHECK_IN_RUNTIME_DEFINITION, baseInput);
  assert.deepEqual(a, b);
});

console.log("DCI-1 — acknowledgement cascade (daily-ack-v1.2)");
const values = (v: Partial<Record<string, string>>) => ({
  kokoro_tenki: null,
  karada_juden: null,
  atama_yohaku: null,
  hito_kyori: null,
  kyou_hoshii: null,
  ...v,
});
check("first entry wins over everything (ACK_FIRST)", () => {
  assert.equal(selectAcknowledgement(values({ kokoro_tenki: "ame" }), true).ackId, "ACK_FIRST");
});
check("priority order: rain > wind > low battery > swirl > needs > sunny > default", () => {
  assert.equal(selectAcknowledgement(values({ kokoro_tenki: "ame", karada_juden: "hobo_kara" }), false).ackId, "ACK_RAIN");
  assert.equal(selectAcknowledgement(values({ kokoro_tenki: "kaze", kyou_hoshii: "yasumi" }), false).ackId, "ACK_WIND");
  assert.equal(selectAcknowledgement(values({ karada_juden: "hobo_kara", atama_yohaku: "guruguru" }), false).ackId, "ACK_LOWBATT");
  assert.equal(selectAcknowledgement(values({ atama_yohaku: "guruguru", kyou_hoshii: "tassei" }), false).ackId, "ACK_SWIRL");
  assert.equal(selectAcknowledgement(values({ kyou_hoshii: "seiri", kokoro_tenki: "hare" }), false).ackId, "ACK_NEED_SEIRI");
  assert.equal(selectAcknowledgement(values({ kokoro_tenki: "hare" }), false).ackId, "ACK_SUNNY");
  assert.equal(selectAcknowledgement(values({ hito_kyori: "itsumo_doori" }), false).ackId, "ACK_NEUTRAL");
});
check("every one of the 13 acknowledgements is reachable", () => {
  const reachable = new Set<string>();
  reachable.add(selectAcknowledgement(values({ kokoro_tenki: "hare" }), true).ackId);
  reachable.add(selectAcknowledgement(values({ kokoro_tenki: "ame" }), false).ackId);
  reachable.add(selectAcknowledgement(values({ kokoro_tenki: "kaze" }), false).ackId);
  reachable.add(selectAcknowledgement(values({ karada_juden: "hobo_kara" }), false).ackId);
  reachable.add(selectAcknowledgement(values({ atama_yohaku: "guruguru" }), false).ackId);
  for (const opt of ["yasumi", "seiri", "kibun_tenkan", "hanasu", "hitori_jikan", "tassei"]) {
    reachable.add(selectAcknowledgement(values({ kyou_hoshii: opt }), false).ackId);
  }
  reachable.add(selectAcknowledgement(values({ kokoro_tenki: "hare" }), false).ackId);
  reachable.add(selectAcknowledgement(values({ hito_kyori: "chikaku" }), false).ackId);
  assert.equal(reachable.size, 13);
});
check("default acknowledgement always available (any input combination resolves)", () => {
  for (const f of DAILY_CHECK_IN_DEFINITION.fields) {
    for (const o of f.options) {
      const r = selectAcknowledgement(values({ [f.fieldId]: o.optionId }), false);
      assert.ok(r.ackId && r.copyJa.length > 0);
    }
  }
});

console.log("DCI-1 — longitudinal (daily-longitudinal-v1, field-valid denominators)");
const day = (date: string, v: Partial<Record<string, string>>): TimelineEntry => ({ entryLocalDate: date, stateValues: values(v) });
check("rain summary fires at >=3 field-valid ame days", () => {
  const r = sevenDaySummaries([
    day("2026-07-14", { kokoro_tenki: "ame" }),
    day("2026-07-15", { kokoro_tenki: "ame" }),
    day("2026-07-16", { kokoro_tenki: "ame" }),
  ]);
  assert.equal(r.summaries[0]?.summaryId, "SUM_RAIN_RUN");
  assert.ok(r.summaries[0].copyJa.includes("記録した日の中では"));
});
check("low-battery and swirl summaries fire independently; max 2 simultaneous in priority order", () => {
  const entries = [
    day("2026-07-13", { kokoro_tenki: "ame", karada_juden: "hobo_kara", atama_yohaku: "guruguru" }),
    day("2026-07-14", { kokoro_tenki: "ame", karada_juden: "hobo_kara", atama_yohaku: "guruguru" }),
    day("2026-07-15", { kokoro_tenki: "ame", karada_juden: "hobo_kara", atama_yohaku: "guruguru" }),
  ];
  const r = sevenDaySummaries(entries);
  assert.equal(r.summaries.length, 2); // maxSimultaneousSummaries
  assert.deepEqual(r.summaries.map((s) => s.summaryId), ["SUM_RAIN_RUN", "SUM_LOWBATT_RUN"]); // priority order
});
check("repeated-need summary fills {need} with the option label", () => {
  const r = sevenDaySummaries([
    day("2026-07-14", { kyou_hoshii: "yasumi" }),
    day("2026-07-15", { kyou_hoshii: "yasumi" }),
    day("2026-07-16", { kyou_hoshii: "yasumi" }),
  ]);
  assert.equal(r.summaries[0]?.summaryId, "SUM_NEED_REPEAT");
  assert.ok(r.summaries[0].copyJa.includes("「やすみ」"));
});
check("need ties join labels with 「と」 (deterministic canonical order)", () => {
  const r = sevenDaySummaries([
    day("2026-07-11", { kyou_hoshii: "yasumi" }),
    day("2026-07-12", { kyou_hoshii: "yasumi" }),
    day("2026-07-13", { kyou_hoshii: "yasumi" }),
    day("2026-07-14", { kyou_hoshii: "seiri" }),
    day("2026-07-15", { kyou_hoshii: "seiri" }),
    day("2026-07-16", { kyou_hoshii: "seiri" }),
  ]);
  const needSummary = r.summaries.find((s) => s.summaryId === "SUM_NEED_REPEAT");
  assert.ok(needSummary?.copyJa.includes("「やすみと整理する時間」"));
});
check("sunny summary needs >=4; mixed-weather needs >=4 distinct among field-valid", () => {
  const sunny3 = sevenDaySummaries([
    day("2026-07-14", { kokoro_tenki: "hare" }),
    day("2026-07-15", { kokoro_tenki: "hare" }),
    day("2026-07-16", { kokoro_tenki: "hare" }),
  ]);
  assert.ok(!sunny3.summaries.some((s) => s.summaryId === "SUM_SUNNY_RUN"));
  const sunny4 = sevenDaySummaries([
    day("2026-07-13", { kokoro_tenki: "hare" }),
    day("2026-07-14", { kokoro_tenki: "hare" }),
    day("2026-07-15", { kokoro_tenki: "hare" }),
    day("2026-07-16", { kokoro_tenki: "hare" }),
  ]);
  assert.equal(sunny4.summaries[0]?.summaryId, "SUM_SUNNY_RUN");
  const mixed = sevenDaySummaries([
    day("2026-07-13", { kokoro_tenki: "hare" }),
    day("2026-07-14", { kokoro_tenki: "ame" }),
    day("2026-07-15", { kokoro_tenki: "kumori" }),
    day("2026-07-16", { kokoro_tenki: "kaze" }),
  ]);
  assert.equal(mixed.summaries[0]?.summaryId, "SUM_MIXED_WEATHER");
  assert.equal(mixed.summaries[0].copyJa, "記録した日の天気は、いろいろでした。");
});
check("missing days + unanswered fields are excluded (field-valid denominators)", () => {
  // 4 recorded days, but kokoro_tenki answered on only 2 → rain cannot fire even
  // though the recorded-day count is above the minimum.
  const r = sevenDaySummaries([
    day("2026-07-13", { kokoro_tenki: "ame" }),
    day("2026-07-14", { kokoro_tenki: "ame" }),
    day("2026-07-15", { kyou_hoshii: "yasumi" }),
    day("2026-07-16", { karada_juden: "maamaa" }),
  ]);
  assert.ok(!r.summaries.some((s) => s.summaryId === "SUM_RAIN_RUN"));
});
check("insufficient history (<3 recorded days) shows the canonical insufficiency copy", () => {
  const r = sevenDaySummaries([day("2026-07-16", { kokoro_tenki: "hare" })]);
  assert.equal(r.summaries.length, 0);
  assert.equal(r.insufficientCopyJa, "まだ7日分の景色にはなっていません。記録が3日分たまると、ここに様子が出ます。");
});
check("30-day view: <7 recorded days insufficient; need modal only over answered days (min 3)", () => {
  const few = thirtyDayView([day("2026-07-16", { kokoro_tenki: "hare" })]);
  assert.equal(few.sufficient, false);
  assert.ok(few.insufficientCopyJa);
  const many = thirtyDayView([
    day("2026-06-25", { kyou_hoshii: "yasumi" }),
    day("2026-06-27", { kyou_hoshii: "yasumi" }),
    day("2026-06-29", { kyou_hoshii: "yasumi" }),
    day("2026-07-01", { kokoro_tenki: "hare" }),
    day("2026-07-03", { kokoro_tenki: "hare" }),
    day("2026-07-05", { kokoro_tenki: "hare" }),
    day("2026-07-07", { kokoro_tenki: "hare" }),
  ]);
  assert.equal(many.sufficient, true);
  assert.equal(many.mostFrequentNeedJa, "やすみ");
  const fewNeeds = thirtyDayView([
    day("2026-06-25", { kyou_hoshii: "yasumi" }),
    day("2026-06-27", { kyou_hoshii: "yasumi" }),
    day("2026-06-29", { kokoro_tenki: "hare" }),
    day("2026-07-01", { kokoro_tenki: "hare" }),
    day("2026-07-03", { kokoro_tenki: "hare" }),
    day("2026-07-05", { kokoro_tenki: "hare" }),
    day("2026-07-07", { kokoro_tenki: "hare" }),
  ]);
  assert.equal(fewNeeds.mostFrequentNeedJa, null); // only 2 field-valid need answers
});
check("no streak/worsening/score concepts exist in longitudinal output", () => {
  const r = sevenDaySummaries([
    day("2026-07-14", { kokoro_tenki: "ame" }),
    day("2026-07-15", { kokoro_tenki: "ame" }),
    day("2026-07-16", { kokoro_tenki: "ame" }),
  ]);
  for (const s of r.summaries) {
    assert.ok(!/悪化|連続記録|スコア|点数/.test(s.copyJa));
  }
});

console.log("DCI-1 — private hints");
check("hint maps kyou_hoshii to the governed tag with canonical fit reason", () => {
  const h = hintForEntry(values({ kyou_hoshii: "yasumi" }));
  assert.equal(h.tag, "need_rest");
  assert.ok(h.fitReasonJa?.includes("休息"));
  assert.equal(h.sourceOptionId, "yasumi");
  assert.equal(h.consent, "user_initiated_reveal_only");
});
check("unanswered need produces explicit no_recommendation", () => {
  assert.equal(hintForEntry(values({})).tag, "no_recommendation");
});

console.log("DCI-1 — registry reconciliation + gating");
check("daily-check-in registered; reflection-cadence retained; identities distinct; no duplicates", () => {
  const daily = getMethod("daily-check-in");
  const umbrella = getMethod("reflection-cadence");
  assert.ok(daily && umbrella);
  assert.notEqual(daily!.methodId, umbrella!.methodId);
  const ids = CPV1_METHOD_UNIVERSE.map((m) => m.methodId);
  assert.equal(new Set(ids).size, ids.length, "no duplicate method identity");
  assert.equal(DAILY_CHECK_IN_RECONCILIATION.umbrellaMethodId, "reflection-cadence");
  assert.equal(DAILY_CHECK_IN_RECONCILIATION.concreteMethodId, "daily-check-in");
});
check("daily-check-in activation state is exactly `gated` (never public/route-verified)", () => {
  const daily = getMethod("daily-check-in")!;
  assert.equal(methodActivationState(daily), "gated");
  assert.equal(daily.founderActivation, "closed");
  assert.equal(daily.routeEvidence, "none");
  assert.equal(daily.deploymentStatus, "unverified");
  assert.equal(daily.devFlagged, true);
});
check("reflection-cadence also remains gated", () => {
  assert.equal(methodActivationState(getMethod("reflection-cadence")!), "gated");
});
check("route gate: production + unknown closed; local/test open; preview needs the exact flag", () => {
  assert.deepEqual(dailyCheckInAccess({ VERCEL_ENV: "production" }), { allowed: false, reason: "denied_production" });
  assert.deepEqual(dailyCheckInAccess({}), { allowed: false, reason: "denied_unknown_context" });
  assert.deepEqual(dailyCheckInAccess({ NODE_ENV: "development" }), { allowed: true, reason: "trusted_local" });
  assert.deepEqual(dailyCheckInAccess({ YORISOU_CI_TEST: "1" }), { allowed: true, reason: "trusted_test" });
  assert.deepEqual(dailyCheckInAccess({ VERCEL_ENV: "preview" }), { allowed: false, reason: "denied_flag_off" });
  assert.deepEqual(dailyCheckInAccess({ VERCEL_ENV: "preview", YORISOU_CPV1_DEV_FLAGS: "dci_daily_check_in_preview" }), { allowed: true, reason: "preview_flag_on" });
  assert.deepEqual(dailyCheckInAccess({ VERCEL_ENV: "production", YORISOU_CPV1_DEV_FLAGS: "dci_daily_check_in_preview" }), { allowed: false, reason: "denied_production" });
});
check("event contract is bounded and content-free (emission deferred)", () => {
  assert.equal(DAILY_CHECK_IN_EVENTS.length, 6);
  assert.deepEqual([...DAILY_CHECK_IN_EVENTS], [
    "state_check_started",
    "state_check_completed",
    "private_state_saved",
    "state_record_corrected",
    "state_record_deleted",
    "return_visit",
  ]);
});

console.log("DCI-1.1 — server-authoritative time contract");
{
  const NOW_FIXED = new Date("2026-07-20T15:30:00.000Z"); // 2026-07-21 00:30 JST — crosses midnight

  check("standard create: server generates producedAt and derives entryLocalDate in the submitted timezone", () => {
    const r = serverTimeIdentity("Asia/Tokyo", NOW_FIXED);
    assert.ok(r.ok);
    if (r.ok) {
      assert.equal(r.identity.producedAt, NOW_FIXED.toISOString());
      assert.equal(r.identity.entryLocalDate, "2026-07-21"); // JST local date, not UTC date
      assert.equal(r.identity.utcOffsetMinutes, 540);
    }
    const ny = serverTimeIdentity("America/New_York", NOW_FIXED);
    assert.ok(ny.ok && ny.ok === true && ny.identity.entryLocalDate === "2026-07-20");
  });
  check("standard create: unknown timezone rejected", () => {
    const r = serverTimeIdentity("Tokyo/Nowhere", NOW_FIXED);
    assert.ok(!r.ok && r.code === "invalid_timezone");
  });
  check("resumed create: valid recent completedAt preserved; local date derived in the ORIGINAL timezone", () => {
    const completed = new Date(NOW_FIXED.getTime() - 5 * 60 * 1000).toISOString();
    const r = resumedTimeIdentity(completed, "Asia/Tokyo", NOW_FIXED);
    assert.ok(r.ok);
    if (r.ok) {
      assert.equal(r.identity.producedAt, completed);
      assert.equal(r.identity.entryLocalDate, "2026-07-21");
    }
  });
  check("resumed create: completion before midnight + login after midnight keeps the ORIGINAL local date", () => {
    // Completed 23:58 JST (14:58Z); resumed 00:05 JST next local day (15:05Z).
    const completed = "2026-07-20T14:58:00.000Z";
    const resumedAt = new Date("2026-07-20T15:05:00.000Z");
    const r = resumedTimeIdentity(completed, "Asia/Tokyo", resumedAt);
    assert.ok(r.ok);
    if (r.ok) assert.equal(r.identity.entryLocalDate, "2026-07-20"); // the completion's local date
  });
  check("resumed create: browser timezone change between completion and login does not re-bucket (original tz used)", () => {
    const completed = new Date(NOW_FIXED.getTime() - 3 * 60 * 1000).toISOString();
    const r = resumedTimeIdentity(completed, "Asia/Tokyo", NOW_FIXED); // caller passes the ORIGINAL tz from the pending entry
    assert.ok(r.ok);
    if (r.ok) assert.equal(r.identity.timezone, "Asia/Tokyo");
  });
  check("resumed create: expired (>10min), future (>skew), malformed all rejected with bounded codes", () => {
    const expired = resumedTimeIdentity(new Date(NOW_FIXED.getTime() - RESUMED_MAX_AGE_MS - 1000).toISOString(), "Asia/Tokyo", NOW_FIXED);
    assert.ok(!expired.ok && expired.code === "resumed_time_expired");
    const future = resumedTimeIdentity(new Date(NOW_FIXED.getTime() + RESUMED_FUTURE_SKEW_MS + 1000).toISOString(), "Asia/Tokyo", NOW_FIXED);
    assert.ok(!future.ok && future.code === "resumed_time_future");
    const malformed = resumedTimeIdentity("not-a-time", "Asia/Tokyo", NOW_FIXED);
    assert.ok(!malformed.ok && malformed.code === "resumed_time_invalid");
    const missing = resumedTimeIdentity(undefined, "Asia/Tokyo", NOW_FIXED);
    assert.ok(!missing.ok && missing.code === "resumed_time_invalid");
  });
  check("correction window: open on the record's local day in its STORED timezone; closed after local midnight", () => {
    assert.equal(correctionWindowOpen("2026-07-21", "Asia/Tokyo", NOW_FIXED), true); // 00:30 JST on the 21st
    assert.equal(correctionWindowOpen("2026-07-20", "Asia/Tokyo", NOW_FIXED), false); // yesterday in JST
    assert.equal(correctionWindowOpen("2026-07-20", "America/New_York", NOW_FIXED), true); // still the 20th in NY
  });
}

console.log(`\nDCI-1 daily-check-in contract: ${passed} checks passed.`);
