// POR-1 — the pinned incident evidence contract.
//
// This file guards the one thing an operator must not be able to move. The execution window used to
// arrive from the command line; an independent audit refused that, because a window somebody types
// narrows nothing that the same person cannot widen. The window is now derived from GitHub and Vercel
// records that predate the question and that this repository cannot edit.
//
// So these tests are mostly about what the contract may NOT be: not self-inconsistent, not detached
// from the promotion it claims to describe, not wide enough to become a general amnesty, and not
// quietly redefinable by a flag.
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  declaredWindowMatchesContract,
  incidentExecutionWindow,
  INCIDENT_WINDOW_MAX_SPAN_MS,
  POR1_INCIDENT_EVIDENCE_VERSION,
  POR1_PRODUCTION_DELETION_INCIDENT,
  validateIncidentEvidence,
  type HistoricalIncidentEvidence,
} from "../por1HistoricalIncidentEvidence";

const pinned = POR1_PRODUCTION_DELETION_INCIDENT;
const withField = (over: Partial<HistoricalIncidentEvidence>): HistoricalIncidentEvidence => ({
  ...pinned,
  ...over,
});

test("the shipped contract is internally valid", () => {
  assert.deepEqual(validateIncidentEvidence(pinned), []);
});

test("the shipped contract names the promotion and the deployments that served it", () => {
  assert.equal(pinned.version, POR1_INCIDENT_EVIDENCE_VERSION);
  assert.equal(pinned.promotionPullRequest, 126);
  assert.equal(pinned.promotionMergeCommitSha, "ece887a448e56b5b9b145a179de8eb5b5260cfef");
  // The deployments are tied to the promotion by the commit they served, not by adjacency.
  assert.equal(pinned.deployedCommitSha, pinned.promotionMergeCommitSha);
  assert.match(pinned.activationDeploymentId, /^dpl_/);
  assert.match(pinned.nextDeploymentId, /^dpl_/);
  assert.notEqual(pinned.activationDeploymentId, pinned.nextDeploymentId);
});

test("the window is the interval between the two pinned deployments, and nothing else", () => {
  const window = incidentExecutionWindow();
  assert.equal(window.startedAt, pinned.activationDeploymentAt);
  assert.equal(window.endedAt, pinned.nextDeploymentAt);
  assert.ok(Date.parse(window.endedAt) > Date.parse(window.startedAt));
});

test("the window opens at ACTIVATION, not at the merge — the capability was off before that", () => {
  const window = incidentExecutionWindow();
  assert.ok(
    Date.parse(window.startedAt) > Date.parse(pinned.promotionMergedAt),
    "the same merge shipped once with the capability off; that deployment must not open the window",
  );
});

// ── every way a contract can be wrong ───────────────────────────────────────

test("a contract whose deployments did not serve the promotion is invalid", () => {
  const defects = validateIncidentEvidence(
    withField({ deployedCommitSha: "0".repeat(40) }),
  );
  assert.ok(defects.includes("deployed_commit_not_promotion_merge"));
});

test("malformed shas, deployment ids and project refs are invalid", () => {
  assert.ok(validateIncidentEvidence(withField({ promotionMergeCommitSha: "ece887a" }))
    .includes("promotion_merge_sha_malformed"));
  assert.ok(validateIncidentEvidence(withField({ activationDeploymentId: "X6cEvoWZ" }))
    .includes("activation_deployment_id_malformed"));
  assert.ok(validateIncidentEvidence(withField({ nextDeploymentId: "" }))
    .includes("next_deployment_id_malformed"));
  assert.ok(validateIncidentEvidence(withField({ productionProjectRef: "nope" }))
    .includes("production_project_ref_malformed"));
});

test("one deployment cannot both open and close the window", () => {
  const defects = validateIncidentEvidence(
    withField({ nextDeploymentId: pinned.activationDeploymentId }),
  );
  assert.ok(defects.includes("deployment_ids_identical"));
});

test("an inverted or zero-length window is invalid", () => {
  assert.ok(validateIncidentEvidence(withField({ nextDeploymentAt: pinned.activationDeploymentAt }))
    .includes("next_deployment_not_after_activation"));
  assert.ok(validateIncidentEvidence(withField({ nextDeploymentAt: "2026-08-10T03:00:00Z" }))
    .includes("next_deployment_not_after_activation"));
});

test("activation cannot precede the merge it claims to deploy", () => {
  const defects = validateIncidentEvidence(
    withField({ activationDeploymentAt: "2026-08-10T03:00:00Z" }),
  );
  assert.ok(defects.includes("activation_precedes_promotion_merge"));
});

test("a contract cannot be widened into a general amnesty", () => {
  const tooWide = new Date(
    Date.parse(pinned.activationDeploymentAt) + INCIDENT_WINDOW_MAX_SPAN_MS + 1,
  ).toISOString();
  assert.ok(validateIncidentEvidence(withField({ nextDeploymentAt: tooWide }))
    .includes("window_span_above_bound"));
});

test("unparseable instants are invalid and stop further time reasoning", () => {
  const defects = validateIncidentEvidence(withField({ activationDeploymentAt: "whenever" }));
  assert.ok(defects.includes("instants_unparseable"));
});

test("a pinned instant with NO zone is invalid — the window must not depend on a machine", () => {
  for (const naive of ["2026-08-10T03:32:53.983", "2026-08-10 03:32:53"]) {
    assert.ok(
      validateIncidentEvidence(withField({ activationDeploymentAt: naive })).includes("instants_unparseable"),
      naive,
    );
  }
});

test("the pinned incident size is validated, not merely stored", () => {
  for (const count of [0, -1, 1.5, 11, Number.NaN]) {
    assert.ok(
      validateIncidentEvidence(withField({ expectedStrandedJobCount: count })).includes(
        "expected_stranded_job_count_implausible",
      ),
      String(count),
    );
  }
  assert.deepEqual(validateIncidentEvidence(withField({ expectedStrandedJobCount: 2 })), []);
});

test("a declared window in another zone still confirms the same instant", () => {
  const activationInJst = new Date(Date.parse(pinned.activationDeploymentAt))
    .toISOString()
    .replace("Z", "+00:00");
  assert.equal(
    declaredWindowMatchesContract({ startedAt: activationInJst, endedAt: pinned.nextDeploymentAt }),
    true,
  );
  // ...but a naive one cannot, because it has no single meaning.
  assert.equal(
    declaredWindowMatchesContract({
      startedAt: pinned.activationDeploymentAt.replace("Z", ""),
      endedAt: pinned.nextDeploymentAt,
    }),
    false,
  );
});

test("every defect is reported, not just the first — a reviewer reads the whole list", () => {
  const defects = validateIncidentEvidence(
    withField({ promotionMergeCommitSha: "bad", activationDeploymentId: "bad" }),
  );
  assert.ok(defects.length >= 2, JSON.stringify(defects));
});

// ── the flags may confirm, never redefine ───────────────────────────────────

test("a declared window matching the contract exactly is accepted", () => {
  assert.equal(
    declaredWindowMatchesContract({
      startedAt: pinned.activationDeploymentAt,
      endedAt: pinned.nextDeploymentAt,
    }),
    true,
  );
});

test("an equivalent instant in another notation is still the same instant", () => {
  assert.equal(
    declaredWindowMatchesContract({
      startedAt: new Date(Date.parse(pinned.activationDeploymentAt)).toISOString(),
      endedAt: new Date(Date.parse(pinned.nextDeploymentAt)).toISOString(),
    }),
    true,
  );
});

test("a declared window that widens the contract by ONE MILLISECOND is refused", () => {
  const wider = new Date(Date.parse(pinned.nextDeploymentAt) + 1).toISOString();
  assert.equal(
    declaredWindowMatchesContract({ startedAt: pinned.activationDeploymentAt, endedAt: wider }),
    false,
  );
  const earlier = new Date(Date.parse(pinned.activationDeploymentAt) - 1).toISOString();
  assert.equal(
    declaredWindowMatchesContract({ startedAt: earlier, endedAt: pinned.nextDeploymentAt }),
    false,
  );
});

test("a partial, empty or unparseable declaration is refused", () => {
  assert.equal(declaredWindowMatchesContract(null), false);
  assert.equal(declaredWindowMatchesContract({ startedAt: pinned.activationDeploymentAt }), false);
  assert.equal(declaredWindowMatchesContract({ endedAt: pinned.nextDeploymentAt }), false);
  assert.equal(declaredWindowMatchesContract({ startedAt: "", endedAt: "" }), false);
  assert.equal(
    declaredWindowMatchesContract({ startedAt: "nope", endedAt: pinned.nextDeploymentAt }),
    false,
  );
});

// ── the contract carries release metadata, never identity ───────────────────

const HERE = dirname(fileURLToPath(import.meta.url));
const CONTRACT_SOURCE = readFileSync(join(HERE, "..", "por1HistoricalIncidentEvidence.ts"), "utf8");

test("no account id, job id, address or digest is pinned in the contract", () => {
  for (const value of Object.values(pinned)) {
    const text = String(value);
    assert.ok(!text.startsWith("acct_"), `pinned value looks like an account id: ${text}`);
    assert.ok(!text.includes("@"), `pinned value looks like an address: ${text}`);
    assert.ok(
      !/^[0-9a-f]{64}$/.test(text),
      `pinned value looks like a sha256 identity digest: ${text}`,
    );
    assert.ok(
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(text),
      `pinned value looks like a job uuid: ${text}`,
    );
  }
});

test("the contract source names no owner and no job", () => {
  const code = CONTRACT_SOURCE.replace(/\/\/[^\n]*/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ");
  assert.ok(!/acct_\d/.test(code), "no account id may appear in the contract");
  assert.ok(!/@[a-z0-9.-]+\.(invalid|com|example)/.test(code), "no address may appear");
  assert.ok(!/\b[0-9a-f]{64}\b/.test(code), "no sha256 identity digest may appear");
});
