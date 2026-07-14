import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { validateGovernanceResources } from "../governanceResources";
import checksums from "../governance-checksums.json";

const ROOT = path.join(process.cwd(), "resources/governance/current");
const ANNEXES = ["AGENT_EXECUTION_AUTHORITY_MATRIX.md", "ARCHITECTURE_TO_CODE_MAPPING_AUTHORITY.md", "PRODUCTION_DATA_MODEL_AUTHORITY.md", "RELEASE_GATE_DEFINITIONS.md"];

async function currentFiles(): Promise<string[]> {
  const names: string[] = [];
  for (const entry of await readdir(ROOT, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name === "annex") { for (const sub of await readdir(path.join(ROOT, "annex"))) names.push(`annex/${sub}`); continue; }
    names.push(entry.name);
  }
  return names.sort();
}

/** PR-1 governance activation validation: loader, manifest/checksum, binding links, agent authority, package scope. */
export async function runGovernanceActivationTests() {
  // 1. Governance loader test — the runtime loads the v0.4.0 pack successfully.
  const resources = await validateGovernanceResources();
  assert.equal(resources.length, 34, "loader must return all 34 v0.4.0 pack files");
  assert.equal(checksums.packageVersion, "v0.4.0");

  // 2. Manifest/checksum test — entries match files, hashes match bytes, no orphans, none missing.
  const files = await currentFiles();
  assert.deepEqual(files, Object.keys(checksums.files as Record<string, string>).sort(), "runtime checksum manifest must list exactly the current-governance files (no orphans, none missing)");
  for (const [name, expected] of Object.entries(checksums.files as Record<string, string>)) {
    const actual = createHash("sha256").update(await readFile(path.join(ROOT, name), "utf8")).digest("hex");
    assert.equal(actual, expected, `checksum mismatch for ${name}`);
  }
  const sums = await readFile(path.join(ROOT, "SHA256SUMS.txt"), "utf8");
  const sumLines = sums.trim().split("\n").map((line) => { const match = /^([a-f0-9]{64})\s+(.+)$/.exec(line); assert.ok(match, `malformed SHA256SUMS line: ${line}`); return [match![2], match![1]] as const; });
  assert.equal(sumLines.length, 33, "SHA256SUMS.txt must cover the 33 markdown documents");
  for (const [name, expected] of sumLines) assert.equal(createHash("sha256").update(await readFile(path.join(ROOT, name), "utf8")).digest("hex"), expected, `SHA256SUMS mismatch for ${name}`);

  // 3. Binding-link test — no unresolved reference, no Downloads/temp/readiness-package reference, all annexes present.
  const markdown = files.filter((name) => name.endsWith(".md"));
  for (const annex of ANNEXES) assert.ok(files.includes(`annex/${annex}`), `binding annex missing: annex/${annex}`);
  for (const name of markdown) {
    const content = await readFile(path.join(ROOT, name), "utf8");
    assert.ok(!/Downloads/i.test(content), `${name}: references a Downloads path`);
    assert.ok(!/(\/private\/tmp|\/tmp\/|scratchpad|temporary workspace)/i.test(content), `${name}: references a temporary workspace path`);
    assert.ok(!/readiness[ -]package|\b\d{2}_[a-z_]+\//i.test(content), `${name}: references a readiness-package directory`);
    for (const match of content.matchAll(/`([A-Za-z0-9_./-]+\.md)`/g)) {
      const ref = match[1];
      const resolved = ref.startsWith("resources/governance/") ? path.join(process.cwd(), ref) : path.join(ROOT, ref);
      assert.ok(await stat(resolved).then((s) => s.isFile()).catch(() => false), `${name}: unresolved governance reference \`${ref}\``);
      if (!ref.startsWith("resources/governance/archive/")) assert.ok(!ref.includes(".."), `${name}: reference escapes the governance tree`);
    }
  }

  // 4. Agent-authority consistency test — effective tree only (archive excluded by construction).
  const forbidden = [/sole (formal )?production(-code)? execut/i, /Codex is the sole/i, /AUTHORIZE_CODEX_PACKAGE_A/, /Codex Package A/i];
  for (const name of markdown) {
    const content = await readFile(path.join(ROOT, name), "utf8");
    for (const pattern of forbidden) assert.ok(!pattern.test(content), `${name}: contains forbidden effective-authority statement ${pattern}`);
  }
  const agentRoles = await readFile(path.join(ROOT, "Yorisou_Agent_Roles_and_Execution_Authority_v1.0.md"), "utf8");
  const matrix = await readFile(path.join(ROOT, "annex/AGENT_EXECUTION_AUTHORITY_MATRIX.md"), "utf8");
  for (const content of [agentRoles, matrix]) {
    assert.ok(/Claude Code: authorized to implement approved repository changes|Claude Code is the current authorized implementation agent/.test(content), "Claude Code implementation authority must be stated");
    assert.ok(/Codex: has no authorization in the current Package A execution|Codex has no authorization in the current Package A execution/.test(content), "Codex non-authorization must be stated");
  }
  assert.ok(/Edward: authorizes governance activation; authorizes implementation packages; approves merges; authorizes production releases; authorizes rollback and scope changes/.test(agentRoles), "Founder authority must be stated in Agent Roles");
  assert.ok(/Edward \(Founder\) authorizes governance activation; authorizes implementation packages;\s+approves merges; authorizes production releases; authorizes rollback and scope changes/.test(matrix), "Founder authority must be stated in the authority matrix annex");

  // 5. Package-scope test — Package A authorized; Packages B–G not authorized; production release not authorized.
  assert.ok(/Package A is authorized\./.test(matrix), "Package A authorization must be stated");
  assert.ok(/Packages B–G are not authorized\./.test(matrix), "Packages B–G non-authorization must be stated");
  assert.ok(/Production release is not\s+authorized/.test(matrix), "production-release non-authorization must be stated");

  return { status: "ok", loader: resources.length, checksumEntries: Object.keys(checksums.files).length, sha256sumsEntries: sumLines.length, markdownScanned: markdown.length, annexes: ANNEXES.length };
}

if (process.argv[1]?.includes("governanceActivation.test")) void runGovernanceActivationTests().then((result) => console.log(JSON.stringify(result))).catch((error) => { console.error(error); process.exitCode = 1; });
