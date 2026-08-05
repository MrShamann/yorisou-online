import { expect, test as setup } from "@playwright/test";

// CPC-1 acceptance — DEPLOYMENT IDENTITY, not merely reachability.
//
// Two distinct failure modes this gate exists to prevent:
//
// 1. VACUOUS PASSES. Most assertions in this suite are NEGATIVE — "the archetype name must not
//    appear", "no private request is issued", "the CTA must not render". Every one holds trivially
//    against a Vercel Deployment Protection login page, so a gated run reports green while proving
//    nothing.
//
// 2. UNATTRIBUTABLE FAILURES. The first run produced three failures that could equally have been
//    real regressions or a stale deployment, and there was no way to tell them apart. Proving the
//    browser reached "a YORISOU application" is not the same as proving it reached THIS commit.
//
// So the run is bound to an exact commit before any product assertion executes.

setup("hosted Preview is the application, and is the expected commit", async ({ page }) => {
  const base = process.env.PLAYWRIGHT_BASE_URL;
  const expectedSha = process.env.EXPECTED_GIT_SHA;
  expect(base, "PLAYWRIGHT_BASE_URL must be the hosted Preview URL").toBeTruthy();
  expect(expectedSha, "EXPECTED_GIT_SHA must be the commit under test").toBeTruthy();

  // The bypass has silently arrived EMPTY twice — once because the local Python lacks CA certs,
  // once because the Vercel project API returned 403. Both times the suite then ran against the
  // SSO wall, where negative assertions pass vacuously and positive ones fail for the wrong
  // reason. An empty value is worse than a missing one, so refuse it explicitly.
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  expect(
    bypass && bypass.length > 0,
    "VERCEL_AUTOMATION_BYPASS_SECRET is empty or unset. Retrieval can fail silently (CA certs, " +
      "or a 403 from the Vercel project API). Verify it is non-empty BEFORE running: a run against " +
      "Deployment Protection produces vacuous passes and false failures in equal measure.",
  ).toBe(true);

  // ── 1. It must be the application, not an auth wall ──────────────────────
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  const finalUrl = page.url();

  expect(
    finalUrl.includes("vercel.com/sso") || finalUrl.includes("/sso-api"),
    `Preview is behind Deployment Protection (redirected to ${finalUrl}). Supply ` +
      `VERCEL_AUTOMATION_BYPASS_SECRET or disable protection for this Preview. Running without ` +
      `it produces vacuous passes.`,
  ).toBe(false);
  expect(response?.status(), "Preview must serve the application").toBeLessThan(400);

  const body = await page.locator("body").innerText();
  expect(body, "Preview served a Vercel auth page, not the product").not.toContain("Log in to Vercel");

  // ── 2. It must be the expected COMMIT ────────────────────────────────────
  //
  // Fetched through the PAGE, not a separate APIRequestContext. Deployment Protection admits the
  // browser (which carries the SSO cookie) but refuses a bare API context — using the latter would
  // make an environment refusal look like a missing endpoint.
  const identityResponse = await page.goto("/api/build-identity", { waitUntil: "domcontentloaded" });
  expect(
    identityResponse?.status(),
    "build-identity must resolve; without it the tested commit is unknown",
  ).toBe(200);

  const raw = await page.locator("body").innerText();
  let identity: {
    commitSha: string | null;
    commitRef: string | null;
    environment: string;
    sharedStoreMode?: string;
    sharedStoreBoundary?: string;
    sharedStoreProjectMatch?: boolean;
    por1SchemaReadiness?: Record<string, boolean>;
    por1Capabilities?: Record<string, boolean>;
  };
  try {
    identity = JSON.parse(raw);
  } catch {
    // HTML here means the route does not exist on this deployment, which is itself the answer:
    // the deployment predates the commit that added /api/build-identity, so it cannot be the one
    // under test. Say that, rather than surfacing a JSON SyntaxError that hides the real finding.
    throw new Error(
      `/api/build-identity did not return JSON on ${base}. The endpoint is absent, so this ` +
        `deployment predates the commit under test (${expectedSha}). Deploy the current HEAD and ` +
        `point PLAYWRIGHT_BASE_URL at that deployment.\nFirst 200 chars: ${raw.slice(0, 200)}`,
    );
  }

  // Printed on every run so a later reader can attribute results to a commit without guessing.
  console.log(
    `[cpc1] tested_base_url=${base}\n` +
      `[cpc1] final_root_url=${finalUrl}\n` +
      `[cpc1] expected_sha=${expectedSha}\n` +
      `[cpc1] deployed_sha=${identity.commitSha ?? "<absent>"}\n` +
      `[cpc1] deployed_ref=${identity.commitRef ?? "<absent>"}\n` +
      `[cpc1] environment=${identity.environment}\n` +
      `[cpc1] shared_store_mode=${identity.sharedStoreMode ?? "<absent>"}\n` +
      `[cpc1] shared_store_boundary=${identity.sharedStoreBoundary ?? "<absent>"}\n` +
      `[cpc1] shared_store_project_match=${identity.sharedStoreProjectMatch ?? "<absent>"}\n` +
      `[cpc1] por1_schema_readiness=${JSON.stringify(identity.por1SchemaReadiness ?? "<absent>")}\n` +
      `[cpc1] por1_capabilities=${JSON.stringify(identity.por1Capabilities ?? "<absent>")}`,
  );

  // ── 3. It must be bound to an ISOLATED identity store ────────────────────
  //
  // This gate exists because a Preview deployment once wrote real account identities into the
  // production-named bucket while its assessment records went to the isolated Preview database.
  // Every individual check passed. So before this suite registers ANYONE, the deployment has to say
  // which store it is bound to — a run that creates a synthetic identity in the wrong place is
  // worse than a run that does not happen.
  expect(
    identity.sharedStoreBoundary,
    "deployment does not report a shared-store boundary; it predates the isolation guard and " +
      "must not be used for acceptance",
  ).toBeTruthy();
  expect(
    identity.sharedStoreBoundary,
    `deployment is bound to '${identity.sharedStoreBoundary}' storage, not an isolated Preview ` +
      "store. Refusing to register synthetic identities.",
  ).toBe("isolated-preview");
  expect(
    identity.sharedStoreProjectMatch,
    "the identity store and the database are different projects — records and identities would split",
  ).toBe(true);
  expect(
    identity.sharedStoreMode,
    "Preview must not use the AWS default transport",
  ).not.toBe("aws");

  // ── 4. It must be serving the MODEL under test, not the one it replaced ──
  //
  // Proving the commit is not enough after 202607310001..3. Those migrations are behind READINESS
  // variables, and a deployment with readiness off runs the legacy shared LINE array and the inline
  // provisioning path — the exact code the migrations exist to replace. Every assertion below would
  // then pass against the old model and be reported as proof of the new one, which is a worse
  // outcome than the run not happening.
  //
  // Readiness and capabilities are checked SEPARATELY because they mean different things: readiness
  // says a schema exists, a capability says a feature is on. Requiring one to stand in for the other
  // is how "we kill-switched a feature" becomes "we silently disabled a safety property".
  const readiness = identity.por1SchemaReadiness;
  expect(
    readiness,
    "deployment does not report por1SchemaReadiness; it predates the attestation and cannot be " +
      "shown to be serving the canonical model rather than the legacy one",
  ).toBeTruthy();
  for (const fact of ["ACCOUNT_MUTATION_FENCE", "CANONICAL_LINE_ACTIVITY", "IDENTITY_PROVISIONING"]) {
    expect(
      readiness?.[fact],
      `POR-1 schema readiness ${fact} is not true on this deployment. Apply the migration and set ` +
        `the readiness variable BEFORE acceptance — otherwise this run proves the superseded model.`,
    ).toBe(true);
  }

  const capabilities = identity.por1Capabilities;
  expect(capabilities, "deployment does not report por1Capabilities").toBeTruthy();
  for (const capability of [
    "CANONICAL_CORE",
    "CANONICAL_RECOMMENDATIONS",
    "LINE_CANONICAL_RETURN",
    "ACCOUNT_DELETION_EXECUTOR",
  ]) {
    expect(
      capabilities?.[capability],
      `POR-1 capability ${capability} is off on this deployment. The acceptance train asserts ` +
        `canonical behaviour; with the control off it would assert the flag-off baseline instead.`,
    ).toBe(true);
  }

  expect(identity.commitSha, "deployment reported no commit SHA").toBeTruthy();
  expect(
    identity.commitSha,
    `Deployment is at ${identity.commitSha}, expected ${expectedSha}. A stale deployment makes ` +
      `every product assertion unattributable — deploy the current HEAD, or point ` +
      `PLAYWRIGHT_BASE_URL at the immutable deployment for this commit.`,
  ).toBe(expectedSha);

  // Acceptance must never run against Production.
  expect(identity.environment, "acceptance is Preview-only").not.toBe("production");

  // ── 3. The base URL must not have redirected to a different deployment ───
  expect(new URL(finalUrl).origin, "root navigation left the tested origin").toBe(new URL(base!).origin);
});
