import "server-only";

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import checksums from "./governance-checksums.json";

export const YORISOU_PROJECT_ID = "yorisou" as const;
const ROOT = path.resolve(process.cwd(), "resources/governance/current");
const README = "README.md";
const EXPECTED_FILES = 28;

export type GovernanceResource = {
  filename: string; version: string; status: "Approved"; sha256: string;
  resourceClass: "governance" | "manifest"; project_id: typeof YORISOU_PROJECT_ID;
  loaded_at: string; sourcePath: string; parseStatus: "valid"; documentType: string;
  domain: string; authorityPriority: number; content: string;
};

export type GovernanceLookup = Partial<Pick<GovernanceResource, "filename" | "documentType" | "domain" | "authorityPriority">> & { keyword?: string };

function fail(message: string): never { throw new Error(`governance_resource_invalid:${message}`); }
function hash(value: string) { return createHash("sha256").update(value).digest("hex"); }
function domainOf(filename: string) { return filename.replace(/^Yorisou_/, "").replace(/_v\d.*$/, "").split("_").slice(0, 2).join("_").toLowerCase(); }
function priorityOf(filename: string) { return filename.includes("Project_Constitution") ? 100 : filename.includes("Technical_Architecture") ? 90 : filename.includes("Agent_Skill") ? 80 : 50; }

function parseHeader(content: string, filename: string) {
  const title = /^#\s+(.+)$/m.exec(content)?.[1];
  const status = /^\*\*Status:\*\*\s*(.+)$/m.exec(content)?.[1]?.trim();
  if (!title || !status || status !== "Approved") fail(`malformed_or_unapproved:${filename}`);
  const version = /v\d+(?:\.\d+){0,2}/i.exec(title)?.[0] || /v\d+(?:\.\d+){0,2}/i.exec(filename)?.[0];
  if (!version) fail(`missing_version:${filename}`);
  return { version, documentType: title.replace(/^Yorisou\s+/i, "") };
}

async function manifestFiles(root = ROOT) {
  const source = await fs.readFile(path.join(root, README), "utf8");
  if (!/^\*\*Status:\*\*\s*Approved\s*$/m.test(source)) fail("manifest_not_approved");
  const entries = [...source.matchAll(/^- `([^`]+\.md)`\s*$/gm)].map((match) => match[1]);
  if (entries.length !== 27 || new Set(entries).size !== entries.length) fail("manifest_entries");
  return [README, ...entries].sort();
}

async function validate(root: string, checksumFiles: Record<string, string>): Promise<GovernanceResource[]> {
  const realRoot = await fs.realpath(root).catch(() => fail("root_missing"));
  const listed = await manifestFiles(root);
  const entries = await fs.readdir(realRoot, { withFileTypes: true });
  const actual = entries.map((entry) => entry.name).sort();
  if (listed.length !== EXPECTED_FILES || actual.length !== EXPECTED_FILES || actual.join("\n") !== listed.join("\n")) fail("allowlist_mismatch");
  if (Object.keys(checksumFiles).sort().join("\n") !== listed.join("\n")) fail("checksum_manifest_parity");
  const resources = await Promise.all(listed.map(async (filename) => {
    if (filename.startsWith(".") || filename.includes("..") || path.basename(filename) !== filename) fail(`unsafe_filename:${filename}`);
    const candidate = path.join(realRoot, filename); const stat = await fs.lstat(candidate);
    if (!stat.isFile() || stat.isSymbolicLink()) fail(`unsafe_file:${filename}`);
    const resolved = await fs.realpath(candidate); if (!resolved.startsWith(`${realRoot}${path.sep}`)) fail(`path_escape:${filename}`);
    const content = await fs.readFile(resolved, "utf8");
    if (!/^[a-f0-9]{64}$/.test(checksumFiles[filename] || "")) fail(`checksum_manifest_invalid:${filename}`);
    if (checksumFiles[filename] !== hash(content)) fail(`checksum_mismatch:${filename}`);
    const metadata = filename === README ? { version: "v0.3.1", documentType: "Governance Pack" } : parseHeader(content, filename);
    if (/\b(Draft|Rev|Superseded|Intermediate)\b/i.test(filename) || /\*\*Status:\*\*\s*(Draft|Rev|Superseded|Intermediate)/i.test(content)) fail(`inactive_resource:${filename}`);
    return { filename, ...metadata, status: "Approved" as const, sha256: hash(content), resourceClass: filename === README ? "manifest" as const : "governance" as const, project_id: YORISOU_PROJECT_ID, loaded_at: new Date().toISOString(), sourcePath: `resources/governance/current/${filename}`, parseStatus: "valid" as const, domain: domainOf(filename), authorityPriority: priorityOf(filename), content };
  }));
  const names = resources.map((resource) => resource.filename);
  for (const required of ["Yorisou_Project_Constitution_v0.3.1.md", "Yorisou_Technical_Architecture_and_Execution_Protocol_v0.3.1.md", "Yorisou_Agent_Skill_OpenClaw_and_Hermes_Governance_v0.3.md"]) if (!names.includes(required)) fail(`required_missing:${required}`);
  const byName = new Map(resources.map((resource) => [resource.filename, resource.content]));
  const readme = byName.get(README) || "";
  const constitution = byName.get("Yorisou_Project_Constitution_v0.3.1.md") || "";
  const legacy = byName.get("Yorisou_Digital_Legacy_and_Synthetic_Identity_Governance_v0.1.md") || "";
  if (!/Current Surfaces:\*\* Responsive Web and LINE\/LIFF/i.test(readme) || !/iOS and Android.*Planned/i.test(constitution) || !/Shigeru.*must not be used by YORISOU/i.test(constitution) || !/Implementation Status:\*\* Not active/i.test(legacy)) fail("required_governance_assertion");
  return resources.sort((a, b) => b.authorityPriority - a.authorityPriority || a.filename.localeCompare(b.filename));
}
export async function validateGovernanceResources(): Promise<GovernanceResource[]> { return validate(ROOT, checksums.files); }
/** Test-only: not used by product code or exposed through a route. */
export const __testValidateGovernanceResources = (root: string, checksumFiles: Record<string, string>) => validate(root, checksumFiles);

export async function lookupGovernanceResources(query: GovernanceLookup) {
  const resources = await validateGovernanceResources();
  const keyword = query.keyword?.trim().toLocaleLowerCase();
  return resources.filter((resource) => (!query.filename || resource.filename === query.filename) && (!query.documentType || resource.documentType === query.documentType) && (!query.domain || resource.domain === query.domain) && (!query.authorityPriority || resource.authorityPriority === query.authorityPriority) && (!keyword || resource.content.toLocaleLowerCase().includes(keyword)));
}
