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
  console.log("[ok]   offline: contract parsed; upstream comparison skipped by request");
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
//
// TWO PATHS, AND THE DIFFERENCE BETWEEN THEM MATTERS.
//
// The REST API can confirm everything, including which commit each deployment served. The CLI can
// confirm the deployment exists, targets production and was created when the contract says — but not
// the commit. So a CLI-only run reports UNVERIFIED for that one clause rather than passing it.
//
// UNVERIFIED IS NOT MISMATCH. A rotated local token is an environment condition; reporting it as
// "the pinned contract is wrong" would be the same mistake this project has made before — an
// environment failure wearing the costume of a product finding. They exit with different codes.

let unverified = 0;
const unknown = (label) => {
  console.warn(`[??]   ${label}`);
  unverified += 1;
};

function vercelToken() {
  if (process.env.VERCEL_TOKEN) return process.env.VERCEL_TOKEN;
  const authPath = join(homedir(), "Library", "Application Support", "com.vercel.cli", "auth.json");
  try {
    return JSON.parse(readFileSync(authPath, "utf8")).token ?? null;
  } catch {
    return null;
  }
}

/** Full check, when a REST token is actually authorised. */
function inspectViaApi(token, teamId, id) {
  const result = spawnSync(
    "curl",
    ["-sS", `https://api.vercel.com/v13/deployments/${id}?teamId=${teamId}`, "-H", `Authorization: Bearer ${token}`],
    { encoding: "utf8" },
  );
  try {
    const body = JSON.parse(result.stdout);
    if (body.error) return null;
    return {
      createdAt: new Date(body.createdAt ?? body.created).toISOString(),
      target: body.target,
      commitSha: body.meta?.githubCommitSha ?? null,
    };
  } catch {
    return null;
  }
}

/** Fallback. Confirms existence, target and creation instant; cannot see the commit. */
function inspectViaCli(id) {
  const result = spawnSync("vercel", ["inspect", id], { encoding: "utf8" });
  const text = `${result.stdout}\n${result.stderr}`;
  if (result.status !== 0) return null;
  const field = (name) => {
    const match = text.match(new RegExp(`^\\s*${name}\\s+(.+)$`, "m"));
    return match ? match[1].trim() : null;
  };
  const created = field("created");
  if (!created) return null;
  // "Mon Aug 10 2026 11:32:53 GMT+0800 (中国标准时间) [2d ago]" -> a parseable instant.
  const cleaned = created.replace(/\s*\(.*?\)/g, "").replace(/\s*\[.*?\]/g, "").trim();
  const parsed = Date.parse(cleaned);
  if (!Number.isFinite(parsed)) return null;
  return {
    createdAt: new Date(parsed).toISOString(),
    target: field("target"),
    commitSha: undefined, // not exposed by the CLI
  };
}

const token = vercelToken();
const { orgId } = JSON.parse(readFileSync(".vercel/project.json", "utf8"));

for (const [label, id, at] of [
  ["activation", pinned.activationDeploymentId, pinned.activationDeploymentAt],
  ["next", pinned.nextDeploymentId, pinned.nextDeploymentAt],
]) {
  const viaApi = token ? inspectViaApi(token, orgId, id) : null;
  const deployment = viaApi ?? inspectViaCli(id);

  if (!deployment) {
    unknown(`${label} deployment ${id}: neither the REST API nor the CLI could read it`);
    continue;
  }
  if (!viaApi) {
    unknown(`${label} deployment ${id}: REST token unusable, falling back to the CLI`);
  }

  if (sameInstant(deployment.createdAt, at)) ok(`${label} deployment ${id} created_at matches`);
  else bad(`${label} deployment ${id} created_at differs: upstream ${deployment.createdAt}, pinned ${at}`);

  if (deployment.target !== "production") bad(`${label} deployment is target=${deployment.target}`);
  else ok(`${label} deployment targets production`);

  if (deployment.commitSha === undefined) {
    unknown(`${label} deployment commit binding: not exposed by the CLI — needs a REST token`);
  } else if (deployment.commitSha === pinned.deployedCommitSha) {
    ok(`${label} deployment served the promotion commit`);
  } else {
    bad(`${label} deployment served ${deployment.commitSha}, not the pinned ${pinned.deployedCommitSha}`);
  }
}

// ── ordering, restated against what upstream actually says ──────────────────
if (Date.parse(pinned.nextDeploymentAt) > Date.parse(pinned.activationDeploymentAt)) {
  ok("the window is ordered: activation precedes the next deployment");
} else {
  bad("the pinned window is inverted or empty");
}

if (failures > 0) {
  console.error(`[ie] ${failures} MISMATCH(ES) — the pinned contract disagrees with upstream`);
  process.exit(1);
}
if (unverified > 0) {
  // Deliberately not exit 0: a clause nobody could check has not passed. Deliberately not exit 1
  // either: nothing said the contract was wrong.
  console.warn(`[ie] PASS with ${unverified} UNVERIFIED clause(s) — no mismatch found`);
  process.exit(2);
}
console.log("[ie] PASS");
