import { NextResponse } from "next/server";

import { accountMutationFenceSchemaReady } from "@/lib/server/accountMutationLease";
import { isCanonicalLineActivitySchemaReady } from "@/lib/server/canonicalLineActivityRollout";
import { isIdentityProvisioningSchemaReady } from "@/lib/server/identityProvisioningRollout";
import { por1CapabilitySnapshot } from "@/lib/server/por1RuntimeControls";
import { currentSharedStoreMode, sharedStoreBoundary } from "@/lib/server/yorisouData";

// CPC-1 acceptance — build identity, so a hosted test run can prove WHICH commit it tested.
//
// The reachability gate proved the browser reached "a YORISOU application". It did not prove the
// deployment corresponded to the commit under test, and three acceptance failures turned out to be
// unattributable for exactly that reason: a stale deployment and a real regression are
// indistinguishable without this.
//
// The commit SHA is non-sensitive — it is public on the branch. Everything here comes from
// deployment-controlled build metadata; nothing is read from request headers or query parameters,
// which an attacker controls and which would make the identity claim worthless.
//
// No secrets, no environment variable values, no configuration — only identity.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      // Vercel injects these at build time from the deployment's own git metadata.
      commitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
      commitRef: process.env.VERCEL_GIT_COMMIT_REF ?? null,
      // "production" | "preview" | "development". Acceptance must never run against production.
      environment: process.env.VERCEL_ENV ?? "development",
      // POR-1 — which identity store this deployment is bound to. Bounded and non-secret: a mode
      // name, a boundary classification, and whether the object store and the database are the same
      // project. No bucket credentials, no token, no endpoint, no object key, no account.
      //
      // The acceptance gate reads this BEFORE it registers anyone. A run that creates a synthetic
      // identity in the wrong store is worse than a run that does not happen.
      sharedStoreMode: currentSharedStoreMode(),
      sharedStoreBoundary: sharedStoreBoundary.boundary,
      sharedStoreProjectMatch: sharedStoreBoundary.projectMatch,

      // POR-1 — INFRASTRUCTURE READINESS, reported separately from the product controls below and
      // deliberately not merged with them. Readiness says a schema EXISTS; a control says a
      // capability is ON. Presenting them as one list is how an operator ends up kill-switching a
      // feature and silently disabling a safety property, or reading "ready" as "active".
      //
      // Booleans only. The values are `on`/absent and non-secret, but a boolean is the whole fact
      // and cannot carry anything else.
      //
      // WS-F reads these BEFORE it registers anyone. Without them a deployment that predates a
      // migration serves the legacy model and the acceptance passes against the code it replaced —
      // which is a worse outcome than the run not happening, because it looks like proof.
      por1SchemaReadiness: {
        ACCOUNT_MUTATION_FENCE: accountMutationFenceSchemaReady(),
        CANONICAL_LINE_ACTIVITY: isCanonicalLineActivitySchemaReady(),
        IDENTITY_PROVISIONING: isIdentityProvisioningSchemaReady(),
      },

      // The four product controls. Exactly four, always all four, so "absent from the response" can
      // never be mistaken for "off".
      por1Capabilities: por1CapabilitySnapshot(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
