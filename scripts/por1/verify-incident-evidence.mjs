#!/usr/bin/env node
// POR-1 — re-derive the pinned incident evidence from its upstream records.
//
// The recovery classifier's provenance clause rests on values transcribed into
// `lib/server/por1HistoricalIncidentEvidence.ts`. Transcription is exactly the step where a pinned
// contract can quietly stop describing reality — so this reads the sources back and compares.
//
//   GitHub  — pull request 126: its merge commit and the instant it merged.
//   Vercel  — the two Production deployments, by immutable id: their creation instants and the
//             commit sha each served.
//
// Read-only. Prints no token and no identity: the contract contains only release metadata.
//
//   node scripts/por1/verify-incident-evidence.mjs            # requires gh auth + a Vercel token
//   node scripts/por1/verify-incident-evidence.mjs --offline  # contract self-consistency only
//
// Exits non-zero on any mismatch, so an auditor can run it as a gate rather than read it as prose.

import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const OFFLINE = process.argv.includes("--offline");
const REPO = "MrShamann/yorisou-online";

/**
 * Read the pinned values out of the TypeScript source.
 *
 * Deliberately textual rather than an import: this tool must observe what the repository SHIPS, and
 * a transpile step is one more place a value could change on the way through.
 */
function pinnedContract() {
  const source = readFileSync("lib/server/por1HistoricalIncidentEvidence.ts", "utf8");
  const block = source.slice(source.indexOf("POR1_PRODUCTION_DELETION_INCIDENT"));
  const field = (name) => {
    const match = block.match(new RegExp(`${name}:\\s*"([^"]+)"`));
    return match ? match[1] : null;
  };
  const numeric = (name) => {
    const match = block.match(new RegExp(`${name}:\\s*(\\d+)`));
    return match ? Number(match[1]) : null;
  };
  // `version` is written as an identifier reference, so resolve it from its own declaration rather
  // than expecting a literal at the use site.
  const versionDecl = source.match(/POR1_INCIDENT_EVIDENCE_VERSION\s*=\s*"([^"]+)"/);

  return {
    version: versionDecl ? versionDecl[1] : null,
    promotionPullRequest: numeric("promotionPullRequest"),
    promotionMergeCommitSha: field("promotionMergeCommitSha"),
    promotionMergedAt: field("promotionMergedAt"),
    deployedCommitSha: field("deployedCommitSha"),
    activationDeploymentId: field("activationDeploymentId"),
    activationDeploymentAt: field("activationDeploymentAt"),
    nextDeploymentId: field("nextDeploymentId"),
    nextDeploymentAt: field("nextDeploymentAt"),
    productionProjectRef: field("productionProjectRef"),
  };
}

let failures = 0;
const ok = (label) => console.log(`[ok]   ${label}`);
const bad = (label) => {
  console.error(`[FAIL] ${label}`);
  failures += 1;
};
/** Compare instants by VALUE, so a differing but equivalent notation is not a false alarm. */
const sameInstant = (a, b) => Number.isFinite(Date.parse(a)) && Date.parse(a) === Date.parse(b);

const pinned = pinnedContract();
console.log(`[ie] pinned contract ${pinned.version}`);

for (const [key, value] of Object.entries(pinned)) {
  if (value === null) bad(`could not read ${key} from the contract source`);
}
if (failures > 0) process.exit(1);

if (OFFLINE) {
  ok("offline: contract parsed; upstream comparison skipped by request");
  process.exit(0);
}

// ── GitHub ──────────────────────────────────────────────────────────────────
try {
  const raw = execFileSync(
    "gh",
    ["pr", "view", String(pinned.promotionPullRequest), "--repo", REPO, "--json", "mergedAt,mergeCommit,state"],
    { encoding: "utf8" },
  );
  const pr = JSON.parse(raw);
  if (pr.state !== "MERGED") bad(`PR #${pinned.promotionPullRequest} is ${pr.state}, not MERGED`);
  else ok(`PR #${pinned.promotionPullRequest} is MERGED`);

  if (pr.mergeCommit?.oid === pinned.promotionMergeCommitSha) ok("promotion merge commit matches");
  else bad(`promotion merge commit differs: upstream ${pr.mergeCommit?.oid}`);

  if (sameInstant(pr.mergedAt, pinned.promotionMergedAt)) ok("promotion merged_at matches");
  else bad(`promotion merged_at differs: upstream ${pr.mergedAt}, pinned ${pinned.promotionMergedAt}`);
} catch (error) {
  bad(`GitHub read failed: ${error instanceof Error ? error.message.split("\n")[0] : "unknown"}`);
}

// ── Vercel ──────────────────────────────────────────────────────────────────
function vercelToken() {
  if (process.env.VERCEL_TOKEN) return process.env.VERCEL_TOKEN;
  const authPath = join(homedir(), "Library", "Application Support", "com.vercel.cli", "auth.json");
  try {
    return JSON.parse(readFileSync(authPath, "utf8")).token ?? null;
  } catch {
    return null;
  }
}

const token = vercelToken();
if (!token) {
  bad("no Vercel token (set VERCEL_TOKEN or run `vercel login`); deployment pins unverified");
} else {
  const { orgId } = JSON.parse(readFileSync(".vercel/project.json", "utf8"));
  for (const [label, id, at] of [
    ["activation", pinned.activationDeploymentId, pinned.activationDeploymentAt],
    ["next", pinned.nextDeploymentId, pinned.nextDeploymentAt],
  ]) {
    const result = spawnSync(
      "curl",
      ["-sS", `https://api.vercel.com/v13/deployments/${id}?teamId=${orgId}`, "-H", `Authorization: Bearer ${token}`],
      { encoding: "utf8" },
    );
    let deployment;
    try {
      deployment = JSON.parse(result.stdout);
    } catch {
      bad(`${label} deployment ${id}: response was not JSON`);
      continue;
    }
    if (deployment.error) {
      bad(`${label} deployment ${id}: ${deployment.error.code}`);
      continue;
    }
    const createdAt = new Date(deployment.createdAt ?? deployment.created).toISOString();
    if (sameInstant(createdAt, at)) ok(`${label} deployment ${id} created_at matches`);
    else bad(`${label} deployment ${id} created_at differs: upstream ${createdAt}, pinned ${at}`);

    if (deployment.target !== "production") bad(`${label} deployment is target=${deployment.target}`);
    else ok(`${label} deployment targets production`);

    const sha = deployment.meta?.githubCommitSha;
    if (sha === pinned.deployedCommitSha) ok(`${label} deployment served the promotion commit`);
    else bad(`${label} deployment served ${sha}, not the pinned ${pinned.deployedCommitSha}`);
  }
}

// ── ordering, restated against what upstream actually says ──────────────────
if (Date.parse(pinned.nextDeploymentAt) > Date.parse(pinned.activationDeploymentAt)) {
  ok("the window is ordered: activation precedes the next deployment");
} else {
  bad("the pinned window is inverted or empty");
}

console.log(failures === 0 ? "[ie] PASS" : `[ie] ${failures} MISMATCH(ES)`);
process.exit(failures === 0 ? 0 : 1);
