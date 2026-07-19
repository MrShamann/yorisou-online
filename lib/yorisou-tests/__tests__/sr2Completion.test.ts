// SR-2 — Full Service Completion contracts (source + runtime) for the workstreams
// completed this package: WS-A result-parity (SupportPlanView + anonymous save
// wired to every retained family via one shared surface) and WS-B 120Q progress
// resume (device-local, separately versioned, stale/corrupt-safe).
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// ── minimal localStorage/window shim for the device-local store tests. The store
// functions guard `typeof window` at CALL time, so a static import is safe as
// long as the shim is installed before any call (it is). ──
const store = new Map<string, string>();
(globalThis as unknown as { window: unknown }).window = {
  localStorage: {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  },
};

import {
  readCheckProgress,
  writeCheckProgress,
  clearCheckProgress,
  answeredCount,
  relativeUpdatedLabel,
  SR2_CHECK_PROGRESS_KEY,
} from "@/lib/sr2/checkProgress";
import { buildSupportPlan, SUPPORT_PLAN_FAMILIES } from "@/lib/sr1/supportPlan";
import { SR1_GUEST_JOURNEY_KEY } from "@/lib/sr1/guestJourney";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");
const has = (p: string) => existsSync(join(root, p));

// ── WS-A: one shared result→service surface wired to every retained family ──
assert.ok(has("app/components/sr2/ResultSupportPlan.tsx"), "shared ResultSupportPlan surface exists");
const wrapper = read("app/components/sr2/ResultSupportPlan.tsx");
assert.ok(wrapper.includes("buildSupportPlan") && wrapper.includes("SupportPlanView"), "wrapper reuses the deterministic plan + shared view (not 9 impls)");

const FLOW_FILES: Record<string, string[]> = {
  // SpecAssessmentFlow covers C02 / F01 / F02
  "app/tests/_components/SpecAssessmentFlow.tsx": ["c02", "f01", "f02"],
  "app/tests/relationship-fatigue/RelationshipFatigueFlow.tsx": ["relationship-fatigue"],
  "app/tests/love-distance/LoveDistanceFlow.tsx": ["love-distance"],
  "app/tests/local-life/LocalLifeFlow.tsx": ["local-life"],
  "app/tests/work-rhythm/WorkRhythmFlow.tsx": ["work-rhythm"],
  "app/tests/name-impression/NameImpressionFlow.tsx": ["name-impression"],
};
for (const [file] of Object.entries(FLOW_FILES)) {
  const src = read(file);
  assert.ok(src.includes("ResultSupportPlan"), `${file}: renders the shared result→service surface`);
}
// imairo /result already renders SupportPlanView (SR-1) — parity confirmed there.
assert.ok(read("app/result/page.tsx").includes("SupportPlanView"), "imairo /result renders the support plan");

// Every retained family yields a complete, non-empty plan with save/return (parity).
assert.equal(SUPPORT_PLAN_FAMILIES.length, 9, "nine retained result families");
for (const family of SUPPORT_PLAN_FAMILIES) {
  const plan = buildSupportPlan({ family, resultLabel: "テスト" });
  const items = [plan.whatMayHelpNow, ...plan.whatMayHelpNext];
  assert.ok(plan.whatMayHelpNow.href.startsWith("/"), `${family}: has a primary next step`);
  assert.ok(items.some((i) => i.itemId === "save-and-return"), `${family}: has a save/return route (no dead-end)`);
  assert.ok(plan.controls.length >= 5, `${family}: has feedback controls`);
}

// Theme bridge so the shared (aix2-token) surface renders on the .yr-focus flows.
assert.ok(/\.yr-focus\s*\{[^}]*--jade-bright/.test(read("app/globals.css").replace(/\n/g, " ")), "yr-focus token bridge present for the shared surface");

// ── WS-B: 120Q device-local progress resume — separate, versioned, safe ──
assert.notEqual(SR2_CHECK_PROGRESS_KEY, SR1_GUEST_JOURNEY_KEY, "progress record is SEPARATE from the public-safe guest journey (raw answers never co-mingle)");

const BANK = "120q:v1:120";
clearCheckProgress();
assert.equal(readCheckProgress(BANK), null, "no progress → null");

// write → read roundtrip
writeCheckProgress({ bankSignature: BANK, currentIndex: 5, answers: { Q1: "A", Q2: "C", Q3: "B" } });
const back = readCheckProgress(BANK);
assert.ok(back, "saved progress reads back");
assert.equal(back!.currentIndex, 5, "resume index preserved");
assert.equal(answeredCount(back), 3, "answered count preserved");
assert.equal(back!.answers.Q2, "C", "answers preserved");

// stale question-bank signature → discarded (never resume against a changed bank)
assert.equal(readCheckProgress("120q:v1:118"), null, "stale bank signature → discarded");
assert.equal(readCheckProgress(BANK), null, "…and the stale record is cleared, not left dangling");

// corrupt data → discarded safely
store.set(SR2_CHECK_PROGRESS_KEY, "{not json");
assert.equal(readCheckProgress(BANK), null, "corrupt JSON → discarded");
// wrong shape → discarded
store.set(SR2_CHECK_PROGRESS_KEY, JSON.stringify({ version: "sr2.checkprogress.v1", bankSignature: BANK, currentIndex: -3, answers: "nope" }));
assert.equal(readCheckProgress(BANK), null, "invalid shape → discarded");

// completion / restart clears it
writeCheckProgress({ bankSignature: BANK, currentIndex: 10, answers: { Q1: "A" } });
clearCheckProgress();
assert.equal(readCheckProgress(BANK), null, "clear removes the record (completion / restart)");

// relative label is sane
assert.equal(relativeUpdatedLabel(new Date().toISOString(), Date.now()), "たった今", "relative label: just now");

// ── WS-B wiring: the 120Q flow persists per-answer, offers resume, clears on completion ──
const flow = read("app/check-in/MiniTestFlow.tsx");
assert.ok(flow.includes("readCheckProgress") && flow.includes("writeCheckProgress") && flow.includes("clearCheckProgress"), "120Q flow uses the progress store");
assert.ok(flow.includes("persistProgress") && flow.includes("resumeFromCandidate"), "120Q flow persists progress + offers resume");
assert.ok(flow.includes("前回の続き"), "120Q flow shows a resume prompt");
// raw answers must not leak into analytics: the question_answered event sends only ids/index
assert.ok(!/question_answered[\s\S]{0,400}answers:/.test(flow), "no raw answers in the analytics event");

// ── Docs (§10) ──
assert.ok(has("docs/sr2/PREVIEW_ENVIRONMENT_AND_SERVICE_DEPENDENCIES.md"), "SR-2 preview-environment doc present");

console.log("SR-2 completion contract checks passed");
