// POR-1 — the facts a destructive run must be bound to, read from their authoritative sources.
//
// A Founder signs a payload describing a specific world: this build of this tool, this Production
// deployment, this capability state. Two things follow. Those facts must come from somewhere that
// cannot be edited by whoever is running the tool, and they must be re-read after signing, because a
// signature over a world that has since changed authorises nothing.
//
// WHAT THIS DELIBERATELY DOES NOT TRUST.
//
//   • `VERCEL_GIT_COMMIT_SHA` — a build-time environment variable. For the LOCAL operator tool it
//     says nothing about which source is actually executing; it is inherited, stale, or absent.
//     Source identity comes from git.
//   • `YORISOU_POR1_ACCOUNT_DELETION_EXECUTOR` read locally — that is a copy of a flag, not the
//     capability state of the deployment that would do the erasing. Production state comes from
//     Production.
//
// Everything here fails closed. An unreadable fact is never an absent constraint.

import { createHash } from "node:crypto";

/** The governed Production database. Callers pass the pinned value rather than a literal. */
export type LocalSourceIdentity = {
  repositoryRoot: string;
  headCommitSha: string;
  trackedWorkingTreeClean: boolean;
  indexClean: boolean;
};

export type LocalSourceDefect =
  | "git_unavailable"
  | "repository_root_mismatch"
  | "head_sha_malformed"
  | "tracked_working_tree_dirty"
  | "index_dirty";

const FULL_SHA = /^[0-9a-f]{40}$/;

/** A minimal command runner, injected so tests never shell out. */
export type CommandRunner = (command: string, args: readonly string[]) => {
  status: number;
  stdout: string;
};

/**
 * Read the source identity of the tool that is actually running.
 *
 * `git status --porcelain` covers both halves of "clean": a modified tracked file and a staged change
 * are different problems and both disqualify a run, because the reviewed commit is then not the code
 * about to execute.
 */
export function readLocalSourceIdentity(run: CommandRunner): LocalSourceIdentity | null {
  const toplevel = run("git", ["rev-parse", "--show-toplevel"]);
  const head = run("git", ["rev-parse", "HEAD"]);
  // Tracked files only: untracked governance notes are not the tool's source.
  const tracked = run("git", ["status", "--porcelain", "--untracked-files=no"]);
  const staged = run("git", ["diff", "--cached", "--name-only"]);
  if (toplevel.status !== 0 || head.status !== 0 || tracked.status !== 0 || staged.status !== 0) {
    return null;
  }
  return {
    repositoryRoot: toplevel.stdout.trim(),
    headCommitSha: head.stdout.trim(),
    trackedWorkingTreeClean: tracked.stdout.trim() === "",
    indexClean: staged.stdout.trim() === "",
  };
}

/** Validate the source identity against the repository the tool is governed to run in. */
export function validateLocalSourceIdentity(
  identity: LocalSourceIdentity | null,
  expectedRepositoryName: string,
): LocalSourceDefect[] {
  if (!identity) return ["git_unavailable"];
  const defects: LocalSourceDefect[] = [];
  if (!identity.repositoryRoot.endsWith(`/${expectedRepositoryName}`)) {
    defects.push("repository_root_mismatch");
  }
  if (!FULL_SHA.test(identity.headCommitSha)) defects.push("head_sha_malformed");
  if (!identity.trackedWorkingTreeClean) defects.push("tracked_working_tree_dirty");
  if (!identity.indexClean) defects.push("index_dirty");
  return defects;
}

// ── Production, asked of Production ─────────────────────────────────────────

export type ProductionBuildIdentity = {
  environment: string;
  commitSha: string;
  accountDeletionExecutor: boolean;
  erasureAuthoritySchemaReady: boolean;
};

export type ProductionIdentityDefect =
  | "production_identity_unreachable"
  | "production_identity_malformed"
  | "production_environment_not_production"
  | "production_commit_sha_malformed"
  | "production_executor_state_unknown"
  | "production_executor_enabled"
  | "production_erasure_readiness_unknown"
  | "production_erasure_readiness_false";

/**
 * Parse the deployment's own account of itself.
 *
 * Booleans are required to BE booleans. A missing or non-boolean capability flag is
 * `..._unknown`, never a falsy default — "we could not tell" and "it is off" are different facts and
 * only one of them is safe to proceed on.
 */
export function parseProductionBuildIdentity(body: unknown): ProductionBuildIdentity | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const record = body as Record<string, unknown>;
  const capabilities = record.por1Capabilities;
  const readiness = record.por1SchemaReadiness;
  if (!capabilities || typeof capabilities !== "object") return null;
  if (!readiness || typeof readiness !== "object") return null;

  const executor = (capabilities as Record<string, unknown>).ACCOUNT_DELETION_EXECUTOR;
  const erasureReady = (readiness as Record<string, unknown>).ACCOUNT_ERASURE_AUTHORITY;
  if (typeof record.environment !== "string" || typeof record.commitSha !== "string") return null;
  if (typeof executor !== "boolean" || typeof erasureReady !== "boolean") return null;

  return {
    environment: record.environment,
    commitSha: record.commitSha,
    accountDeletionExecutor: executor,
    erasureAuthoritySchemaReady: erasureReady,
  };
}

/** Every condition Production must satisfy before a Founder is even asked to review. */
export function validateProductionBuildIdentity(
  identity: ProductionBuildIdentity | null,
  reachable: boolean,
): ProductionIdentityDefect[] {
  if (!reachable) return ["production_identity_unreachable"];
  if (!identity) return ["production_identity_malformed"];
  const defects: ProductionIdentityDefect[] = [];
  if (identity.environment !== "production") defects.push("production_environment_not_production");
  if (!FULL_SHA.test(identity.commitSha)) defects.push("production_commit_sha_malformed");
  // The capability that would perform the erasure must be OFF while a recovery is authorised: the
  // operator tool resumes stranded jobs, and a live executor means something else is also driving.
  if (identity.accountDeletionExecutor) defects.push("production_executor_enabled");
  if (!identity.erasureAuthoritySchemaReady) defects.push("production_erasure_readiness_false");
  return defects;
}

/**
 * A stable digest of everything a signature is bound to about the world.
 *
 * Used for the post-signature comparison: recomputing this after signing and finding a different
 * value means something moved underneath the authority, whatever it was.
 */
export function executionContextDigest(input: {
  recoveryToolSourceCommitSha: string;
  productionDeploymentCommitSha: string;
  productionEnvironment: string;
  productionAccountDeletionExecutor: boolean;
  productionErasureAuthoritySchemaReady: boolean;
  qualifiedCandidateAuthorityFingerprints: readonly string[];
}): string {
  const canonical = JSON.stringify([
    input.recoveryToolSourceCommitSha,
    input.productionDeploymentCommitSha,
    input.productionEnvironment,
    input.productionAccountDeletionExecutor,
    input.productionErasureAuthoritySchemaReady,
    [...new Set(input.qualifiedCandidateAuthorityFingerprints)].sort(),
  ]);
  return createHash("sha256").update(canonical).digest("hex");
}
