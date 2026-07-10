import assert from "node:assert/strict";
import { lookupGovernanceResources, validateGovernanceResources, __testValidateGovernanceResources } from "../governanceResources";
import { cp, mkdtemp, readFile, rm, writeFile, mkdir, unlink, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import checksums from "../governance-checksums.json";
import { createHash } from "node:crypto";
import { assertRuntimeTaskInput, assertTransition } from "../taskQueue";

export async function runAgentRuntimePhase1Tests() {
  const resources = await validateGovernanceResources();
  assert.equal(resources.length, 28);
  assert.ok(resources.some((resource) => resource.filename === "Yorisou_Project_Constitution_v0.3.1.md"));
  assert.ok(resources.some((resource) => resource.filename === "Yorisou_Technical_Architecture_and_Execution_Protocol_v0.3.1.md"));
  assert.ok((await lookupGovernanceResources({ filename: "Yorisou_Agent_Skill_OpenClaw_and_Hermes_Governance_v0.3.md" })).length === 1);
  const source = path.join(process.cwd(), "resources/governance/current"); let negative = 0;
  const digest = (value: string) => createHash("sha256").update(value).digest("hex");
  async function fixture(mutate: (root: string, manifest: Record<string, string>) => Promise<void>, expected: RegExp) { const root = await mkdtemp(path.join(tmpdir(), "yorisou-governance-")); try { await cp(source, root, { recursive: true }); const manifest = { ...checksums.files }; await mutate(root, manifest); await assert.rejects(() => __testValidateGovernanceResources(root, manifest), expected); negative++; } finally { await rm(root, { recursive: true, force: true }); } }
  const good = await mkdtemp(path.join(tmpdir(), "yorisou-governance-")); try { await cp(source, good, { recursive: true }); assert.equal((await __testValidateGovernanceResources(good, checksums.files)).length, 28); } finally { await rm(good, { recursive: true, force: true }); }
  await fixture(async (r) => writeFile(path.join(r, "README.md"), `${await readFile(path.join(r, "README.md"), "utf8")}tamper`), /checksum_mismatch/);
  await fixture(async (r) => writeFile(path.join(r, "Yorisou_Project_Constitution_v0.3.1.md"), "tamper"), /checksum_mismatch/);
  await fixture(async (_r,m) => { delete m["README.md"]; }, /checksum_manifest_parity/);
  await fixture(async (_r,m) => { m.extra = "a".repeat(64); }, /checksum_manifest_parity/);
  await fixture(async (_r,m) => { m["README.md"] = "BAD"; }, /checksum_manifest_invalid/);
  await fixture(async (r) => writeFile(path.join(r, ".hidden"), "x"), /allowlist_mismatch/);
  await fixture(async (r) => mkdir(path.join(r, "extra")), /allowlist_mismatch/);
  await fixture(async (r) => unlink(path.join(r, "README.md")).then(() => symlink("/tmp", path.join(r, "README.md"))), /unsafe_file/);
  await fixture(async (r) => writeFile(path.join(r, "Yorisou_Project_Constitution_v0.3.1.md"), "# X\n**Status:** Draft\n"), /checksum_mismatch/);
  await fixture(async (r) => unlink(path.join(r, "Yorisou_Project_Constitution_v0.3.1.md")), /allowlist_mismatch/);
  await fixture(async (r) => unlink(path.join(r, "Yorisou_Project_Constitution_v0.3.1.md")).then(() => symlink("/tmp/nope", path.join(r, "Yorisou_Project_Constitution_v0.3.1.md"))), /unsafe_file/);
  await fixture(async (r,m) => { const f="Yorisou_Project_Constitution_v0.3.1.md"; const v="# Yorisou Project Constitution v0.3.1\n**Status:** Rev\n"; await writeFile(path.join(r,f),v); m[f]=digest(v); }, /malformed_or_unapproved/);
  await fixture(async (r,m) => { const f="Yorisou_Project_Constitution_v0.3.1.md"; const v="**Status:** Approved\n"; await writeFile(path.join(r,f),v); m[f]=digest(v); }, /malformed_or_unapproved/);
  await fixture(async (r,m) => { const f="Yorisou_Project_Constitution_v0.3.1.md"; const v="# Yorisou Project Constitution\n**Status:** Approved\n"; await writeFile(path.join(r,f),v); m[f]=digest(v); }, /required_governance_assertion/);
  await fixture(async (r,m) => { const f="README.md"; const v=(await readFile(path.join(r,f),"utf8")).replace("Responsive Web and LINE/LIFF","Web only"); await writeFile(path.join(r,f),v); m[f]=digest(v); }, /required_governance_assertion/);
  await fixture(async (r,m) => { const f="Yorisou_Project_Constitution_v0.3.1.md"; const v=(await readFile(path.join(r,f),"utf8")).replace(/Shigeru remains exclusively assigned to Mirai Move and must not be used by YORISOU\./,"Shigeru is permitted."); await writeFile(path.join(r,f),v); m[f]=digest(v); }, /required_governance_assertion/);
  assert.throws(() => assertTransition("ready", "completed"));
  assert.doesNotThrow(() => assertTransition("ready", "claimed"));
  const base = { project_id: "yorisou" as const, agent_id: "test", workflow_type: "validation", skill_id: null, priority: 1, input_payload: {}, data_classification: "internal" as const, approval_required: false, scheduled_at: null, available_at: new Date().toISOString(), maximum_attempts: 3, timeout_seconds: 60, retry_policy: {}, idempotency_key: "test-1", cost_budget_cents: 0, parent_task_id: null, correlation_id: "test" };
  assert.doesNotThrow(() => assertRuntimeTaskInput(base));
  assert.throws(() => assertRuntimeTaskInput({ ...base, project_id: "mirai-move" as "yorisou" }));
  assert.throws(() => assertRuntimeTaskInput({ ...base, input_payload: { blob: "x".repeat(70000) } }));
  return { status: "ok", governanceFiles: resources.length, governance_positive: 1, governance_negative: negative, not_applicable: ["identity silent-merge", "Hinata/Akari authority"] };
}

if (process.argv[1]?.includes("phase1.test")) void runAgentRuntimePhase1Tests().then((result) => console.log(JSON.stringify(result))).catch((error) => { console.error(error); process.exitCode = 1; });
