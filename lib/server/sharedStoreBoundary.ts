// POR-1 — the Preview/Production identity-store boundary, enforced in code.
//
// WHY THIS EXISTS. The isolated Preview identity store was configured as a BRANCH-SCOPED Vercel
// variable set. Every Preview branch except that one therefore inherited the Preview-wide default,
// which named the Production bucket and no endpoint — and "bucket without endpoint" resolves to
// plain AWS S3. So a Preview deployment wrote account identities into the production-named store,
// while its assessment records went to the isolated Preview database. Nothing failed. Nothing
// warned. The split was invisible until someone went looking for an object that was not there.
//
// A configuration mistake that produces no symptom will be made again. So the rule is no longer a
// convention about how to set variables; it is a check the application performs on itself, and it
// FAILS CLOSED — before the first identity write, not after.
//
// No `server-only`: the rule is pure, and the permanent tests exercise this module rather than a
// paraphrase of it.

export type DeploymentEnvironmentName = "production" | "preview" | "development";

export type SharedStoreBoundaryInput = {
  deploymentEnvironment: DeploymentEnvironmentName | string | undefined;
  /** As resolved by `resolveSharedStoreMode`. */
  sharedStoreMode: "disabled" | "aws" | "s3-compatible" | "supabase-rest" | string;
  bucket: string | undefined;
  endpoint: string | undefined;
  /** The effective database URL, used to prove the object store and the database are one project. */
  supabaseUrl: string | undefined;
};

export type SharedStoreBoundaryClassification =
  | "isolated-preview"
  | "production"
  | "local-development";

export type SharedStoreBoundaryResult =
  | { ok: true; boundary: SharedStoreBoundaryClassification; projectMatch: boolean }
  | { ok: false; error: SharedStoreBoundaryError; detail: string };

export type SharedStoreBoundaryError =
  | "preview_shared_store_not_isolated"
  | "production_shared_store_not_production"
  | "development_shared_store_ambiguous";

/**
 * Buckets that belong to Production. A Preview deployment naming one of these is the exact defect
 * this module exists to stop, so the name is written down rather than inferred from a substring:
 * a heuristic like "contains prod" would both miss renames and reject innocent names.
 */
const PRODUCTION_BUCKETS = new Set(["yorisou-phase1-shared-prod-20260321"]);

/** The isolated Preview bucket. A replacement must be added here deliberately, never by accident. */
const ISOLATED_PREVIEW_BUCKETS = new Set(["yorisou-preview-auth"]);

/** Supabase Storage REST base, the only transport currently classified as isolated. */
const SUPABASE_REST_ENDPOINT = /^https:\/\/([a-z0-9-]+)\.supabase\.co\/storage\/v1\/?$/;

function projectRefOf(url: string | undefined): string | null {
  if (!url) return null;
  const match = /^https:\/\/([a-z0-9-]+)\.supabase\.co/.exec(url.trim());
  return match ? match[1] : null;
}

function fail(error: SharedStoreBoundaryError, detail: string): SharedStoreBoundaryResult {
  return { ok: false, error, detail };
}

/**
 * Classify the shared-store configuration against the deployment it is running in.
 *
 * `detail` is a bounded, secret-free reason. It may name a BUCKET (an infrastructure identifier the
 * operator already knows) but never a token, a signed URL, an object key or an account.
 */
export function classifySharedStoreBoundary(
  input: SharedStoreBoundaryInput,
): SharedStoreBoundaryResult {
  const environment = (input.deploymentEnvironment || "").trim().toLowerCase();
  const bucket = (input.bucket || "").trim();
  const endpoint = (input.endpoint || "").trim();
  const mode = input.sharedStoreMode;

  if (environment === "preview") {
    // A Preview deployment must never reach real AWS. `aws` is precisely the mode a bucket with no
    // endpoint resolves to, which is how this defect was configured in the first place.
    if (mode === "aws") {
      return fail(
        "preview_shared_store_not_isolated",
        "resolved to the AWS default transport; Preview requires an explicitly isolated store",
      );
    }
    if (mode === "disabled") {
      return fail(
        "preview_shared_store_not_isolated",
        "no shared store configured; a hosted Preview must not fall back to ephemeral local storage",
      );
    }
    if (PRODUCTION_BUCKETS.has(bucket)) {
      return fail("preview_shared_store_not_isolated", `bucket ${bucket} belongs to Production`);
    }
    if (!endpoint) {
      return fail("preview_shared_store_not_isolated", "no endpoint; the transport is unclassified");
    }

    const endpointMatch = SUPABASE_REST_ENDPOINT.exec(endpoint);
    if (!endpointMatch || mode !== "supabase-rest") {
      return fail(
        "preview_shared_store_not_isolated",
        "endpoint is not a supported isolated transport (expected Supabase Storage REST)",
      );
    }
    if (!ISOLATED_PREVIEW_BUCKETS.has(bucket)) {
      return fail(
        "preview_shared_store_not_isolated",
        `bucket ${bucket || "(absent)"} is not an approved isolated Preview bucket`,
      );
    }

    // The object store and the database must be the SAME isolated project. Splitting them is the
    // failure mode that hid here: records in one project, identities in another, and every
    // individual check passing.
    const storeProject = endpointMatch[1];
    const databaseProject = projectRefOf(input.supabaseUrl);
    if (!databaseProject) {
      return fail("preview_shared_store_not_isolated", "database project could not be identified");
    }
    if (storeProject !== databaseProject) {
      return fail(
        "preview_shared_store_not_isolated",
        "the identity store and the database are different projects",
      );
    }

    return { ok: true, boundary: "isolated-preview", projectMatch: true };
  }

  if (environment === "production") {
    if (ISOLATED_PREVIEW_BUCKETS.has(bucket)) {
      return fail("production_shared_store_not_production", `bucket ${bucket} is a Preview bucket`);
    }
    if (SUPABASE_REST_ENDPOINT.test(endpoint)) {
      return fail(
        "production_shared_store_not_production",
        "Production must not use the isolated Preview Supabase Storage transport",
      );
    }
    if (mode === "disabled") {
      return fail("production_shared_store_not_production", "Production has no shared store configured");
    }
    return { ok: true, boundary: "production", projectMatch: true };
  }

  // Development. Fully absent configuration is the approved local mode; anything partial is a
  // half-configured remote store and must not be guessed at.
  if (mode === "disabled") {
    if (bucket || endpoint) {
      return fail("development_shared_store_ambiguous", "partial shared-store configuration");
    }
    return { ok: true, boundary: "local-development", projectMatch: false };
  }
  if (PRODUCTION_BUCKETS.has(bucket)) {
    return fail("development_shared_store_ambiguous", `bucket ${bucket} belongs to Production`);
  }
  return { ok: true, boundary: mode === "production" ? "production" : "local-development", projectMatch: false };
}

/** Throws the bounded error code. Callers must not continue past a boundary failure. */
export function assertSharedStoreEnvironmentBoundary(
  input: SharedStoreBoundaryInput,
): SharedStoreBoundaryResult & { ok: true } {
  const result = classifySharedStoreBoundary(input);
  if (!result.ok) {
    // The detail goes to the server log; the thrown code is what any surface may show.
    console.error(`shared-store boundary refused: ${result.error} — ${result.detail}`);
    throw new Error(result.error);
  }
  return result;
}
