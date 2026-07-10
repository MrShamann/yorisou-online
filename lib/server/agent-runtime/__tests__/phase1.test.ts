import assert from "node:assert/strict";
import { lookupGovernanceResources, validateGovernanceResources } from "../governanceResources";
import { assertRuntimeTaskInput, assertTransition } from "../taskQueue";

export async function runAgentRuntimePhase1Tests() {
  const resources = await validateGovernanceResources();
  assert.equal(resources.length, 28);
  assert.ok(resources.some((resource) => resource.filename === "Yorisou_Project_Constitution_v0.3.1.md"));
  assert.ok(resources.some((resource) => resource.filename === "Yorisou_Technical_Architecture_and_Execution_Protocol_v0.3.1.md"));
  assert.ok((await lookupGovernanceResources({ filename: "Yorisou_Agent_Skill_OpenClaw_and_Hermes_Governance_v0.3.md" })).length === 1);
  assert.throws(() => assertTransition("ready", "completed"));
  assert.doesNotThrow(() => assertTransition("ready", "claimed"));
  const base = { project_id: "yorisou" as const, agent_id: "test", workflow_type: "validation", skill_id: null, priority: 1, input_payload: {}, data_classification: "internal" as const, approval_required: false, scheduled_at: null, available_at: new Date().toISOString(), maximum_attempts: 3, timeout_seconds: 60, retry_policy: {}, idempotency_key: "test-1", cost_budget_cents: 0, parent_task_id: null, correlation_id: "test" };
  assert.doesNotThrow(() => assertRuntimeTaskInput(base));
  assert.throws(() => assertRuntimeTaskInput({ ...base, project_id: "mirai-move" as "yorisou" }));
  assert.throws(() => assertRuntimeTaskInput({ ...base, input_payload: { blob: "x".repeat(70000) } }));
  return { status: "ok", governanceFiles: resources.length };
}

if (process.argv[1]?.includes("phase1.test")) void runAgentRuntimePhase1Tests().then((result) => console.log(JSON.stringify(result))).catch((error) => { console.error(error); process.exitCode = 1; });
