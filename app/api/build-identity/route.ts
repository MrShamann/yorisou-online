import { NextResponse } from "next/server";

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
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
