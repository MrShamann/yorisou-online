// CIF-1 — Candidate Intake Foundation contract tests.
// Guards: TS/SQL state-machine parity, enum parity with the migration,
// governance invariants (accepted_for_evaluation != approval), privacy
// invariants, and protected-boundary isolation.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  CANDIDATE_ALLOWED_TRANSITIONS,
  CANDIDATE_REASON_REQUIRED_TARGETS,
  CANDIDATE_STATUS_LABEL,
  CANDIDATE_SUBMISSION_STATUSES,
  checkCandidateTransition,
  isCandidateTransitionAllowed,
} from "../../candidate-intake/stateMachine";
import {
  CANDIDATE_COMMERCIAL_RELATIONSHIPS,
  CANDIDATE_OFFERING_TYPES,
  CANDIDATE_ORG_SOURCE_TYPES,
  CANDIDATE_SUBMISSION_CHANNELS,
} from "../../candidate-intake/types";

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), "utf8");
const migration = read("supabase/migrations/202607160002_candidate_intake_foundation.sql");

// 1. Four distinct entities exist (no single generic supplier_candidates table).
for (const table of [
  "yorisou_candidate_organizations",
  "yorisou_candidate_offerings",
  "yorisou_candidate_submissions",
  "yorisou_candidate_events",
]) {
  assert.ok(migration.includes(`create table if not exists public.${table}`), `table ${table} present`);
}
assert.ok(!/create table[^;]*supplier_candidates/.test(migration), "no generic supplier_candidates table");

// 2. Enum parity: every TS enum value appears in the migration CHECK constraints.
for (const v of CANDIDATE_ORG_SOURCE_TYPES) assert.ok(migration.includes(`'${v}'`), `org source_type ${v} in migration`);
for (const v of CANDIDATE_OFFERING_TYPES) assert.ok(migration.includes(`'${v}'`), `offering_type ${v} in migration`);
for (const v of CANDIDATE_SUBMISSION_CHANNELS) assert.ok(migration.includes(`'${v}'`), `submission_channel ${v} in migration`);
for (const v of CANDIDATE_COMMERCIAL_RELATIONSHIPS) assert.ok(migration.includes(`'${v}'`), `commercial_relationship ${v} in migration`);
for (const v of CANDIDATE_SUBMISSION_STATUSES) assert.ok(migration.includes(`'${v}'`), `status ${v} in migration`);

// 3. State-machine parity: each allowed TS transition is expressed in the SQL
//    transition map; disallowed transitions are not asserted as allowed.
const sqlTransitionBlock = migration.slice(migration.indexOf("v_allowed := case"), migration.indexOf("else false"));
for (const [from, tos] of Object.entries(CANDIDATE_ALLOWED_TRANSITIONS)) {
  for (const to of tos) {
    const line = `when v_from = '${from}' and p_to_status in (`;
    const idx = sqlTransitionBlock.indexOf(line);
    assert.ok(idx >= 0, `SQL has a rule for ${from}`);
    const clause = sqlTransitionBlock.slice(idx, sqlTransitionBlock.indexOf("then true", idx));
    assert.ok(clause.includes(`'${to}'`), `SQL allows ${from} -> ${to}`);
  }
}
// terminal states never transition back into active states
for (const terminalish of ["rejected", "withdrawn"] as const) {
  for (const active of ["submitted", "under_review", "needs_information", "accepted_for_evaluation"] as const) {
    assert.equal(isCandidateTransitionAllowed(terminalish, active), false, `${terminalish} must not reopen to ${active}`);
  }
}
assert.deepEqual(CANDIDATE_ALLOWED_TRANSITIONS.archived, [], "archived is terminal");

// 4. Mandatory-reason parity for material decisions.
for (const t of ["needs_information", "accepted_for_evaluation", "rejected", "withdrawn", "archived"] as const) {
  assert.ok(CANDIDATE_REASON_REQUIRED_TARGETS.has(t), `${t} requires reason (TS)`);
}
assert.deepEqual(checkCandidateTransition("under_review", "rejected", null), { ok: false, code: "reason_required" });
assert.deepEqual(checkCandidateTransition("under_review", "rejected", "not a fit"), { ok: true });
assert.deepEqual(checkCandidateTransition("accepted_for_evaluation", "submitted", "x"), { ok: false, code: "invalid_transition" });
assert.ok(migration.includes("cif1_reason_required_for"), "SQL enforces mandatory reason");
assert.ok(migration.includes("cif1_invalid_transition"), "SQL enforces transition validity");

// 5. Governance invariant: accepted_for_evaluation is NOT approval/endorsement.
const acceptedLabel = CANDIDATE_STATUS_LABEL.accepted_for_evaluation;
assert.ok(/承認|推奨|検証/.test(acceptedLabel) && acceptedLabel.includes("ではありません"), "accepted label explicitly denies approval/endorsement/verification");
assert.ok(/accepted_for_evaluation is NOT approval/i.test(migration) || migration.includes("NOT approval/verification"), "migration documents the non-approval invariant");

// 6. Privacy invariants present in the migration.
assert.ok(migration.includes("enable row level security"), "RLS enabled");
assert.ok(/revoke all on table[\s\S]*from public/.test(migration), "grants revoked from public");
assert.ok(migration.includes("from anon") && migration.includes("from authenticated"), "grants revoked from anon + authenticated");
assert.ok(migration.includes("yorisou_candidate_submissions_contact_consent_chk"), "contact-requires-consent CHECK present");
assert.ok(migration.includes("security definer"), "controlled transition is security-definer");
assert.ok(migration.includes("grant execute on function") && migration.includes("to service_role"), "transition fn granted to service_role only");

// 7. Additive + non-destructive migration; documented rollback.
assert.ok(!/\b(drop table|delete from|truncate)\b/i.test(migration.split("\n").filter((l) => !l.trimStart().startsWith("--")).join("\n")), "no destructive ops in executable SQL");
assert.ok(migration.includes("Rollback (non-destructive)"), "rollback documented");

// 8. Protected-boundary isolation: CIF-1 code does not import or touch
//    scoring/taxonomy/persona/recommendation/result/LINE modules.
const cif1Sources = [
  "lib/candidate-intake/stateMachine.ts",
  "lib/candidate-intake/types.ts",
  "lib/server/candidateIntake.ts",
  "app/api/admin/candidates/route.ts",
  "app/api/admin/candidates/[submissionId]/route.ts",
  "app/admin/candidates/page.tsx",
  "app/admin/candidates/CandidateReviewView.tsx",
];
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/[^\n]*/g, "$1");
for (const f of cif1Sources) {
  const code = stripComments(read(f));
  assert.ok(!/recommendationGraph|public-result|scoring|taxonomy|persona|revealContent|yorisouLine|line\.me|liff/i.test(code), `${f} does not touch protected modules (code)`);
  assert.ok(!/create table|alter table public\.yorisou_test_results|scoring_version =/i.test(code), `${f} defines no product schema/scoring (code)`);
}
// admin API routes must be admin-gated
for (const f of ["app/api/admin/candidates/route.ts", "app/api/admin/candidates/[submissionId]/route.ts"]) {
  assert.ok(read(f).includes("requireAdminRequestViewer"), `${f} is admin-gated`);
}
assert.ok(read("app/admin/candidates/page.tsx").includes("requireAdminViewer"), "admin page is server-gated");

console.log("Candidate-intake (CIF-1) contract checks passed: 8 groups");
