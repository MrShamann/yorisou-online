import { randomUUID } from "node:crypto";

import { expect, test, type BrowserContext, type Page } from "@playwright/test";

import {
  claimResult,
  cleanupThroughApp,
  completeAttemptViaApi,
  createExpiredAttemptInPreviewDb,
  eraseResultThroughApp,
  loginSyntheticUser,
  materializeRecommendationSet,
  previewDbConfigured,
  readRecommendationActionsFromPreviewDb,
  recordRecommendationAction,
  registerSyntheticUser,
  respondToInterpretation,
  signOut,
  startAttemptViaApi,
  syntheticUser,
} from "./fixtures";

// CPC-1 acceptance — the AUTHENTICATED security matrix: User A / User B.
//
// The unauthenticated matrix (securityMatrix.spec.ts) proves that an outsider learns nothing.
// This suite proves the harder property: that a fully authenticated, legitimately registered user
// learns and changes NOTHING about another user's record — and that the concealment shape is the
// same one an outsider sees, so a denial never confirms existence.
//
// Everything runs through the real application routes with real sessions. State builds
// progressively (A's claimed result feeds every cross-owner denial), so this is ONE serial test
// with named steps, in two persistent browser contexts.
//
// Expected statuses are the routes' actual contract, verified in source:
//   claim:    401 unauthenticated · 404 owned-by-another (concealed) · 403 claim_credential_missing
//   response: 401 · 404 result_not_found/result_not_owned (concealed) · 409 intent conflict
//   recommendations: 401 · 403 withheld (own consent only) · 404 everything else (concealed)
//   erase:    401 · 404 (concealed)

test("CPC-1 authenticated security matrix", async ({ browser }, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "the matrix is API-level and runs once; viewport coverage comes from the other suites",
  );
  test.setTimeout(600_000);

  const contextA: BrowserContext = await browser.newContext();
  const contextB: BrowserContext = await browser.newContext();
  const contextC: BrowserContext = await browser.newContext();
  const pageA: Page = await contextA.newPage();
  const pageB: Page = await contextB.newPage();
  const pageC: Page = await contextC.newPage();

  const userA = syntheticUser("matrix-a");
  const userB = syntheticUser("matrix-b");

  // A's claimed record and its lineage.
  let resultA = "";
  let acceptedCodeA = "";
  let firstResponseIdA = "";
  const interpretationNonceA = randomUUID();
  let itemIdA = "";
  const actionKeyA = randomUUID();
  let firstActionIdA = "";

  // B's own claimed record, and an unclaimed anonymous record from a third context.
  let resultB = "";
  let attemptB2 = "";
  let resultC = "";

  try {
    await test.step("setup: A registers, completes, claims, confirms, and acts on a recommendation", async () => {
      await registerSyntheticUser(pageA, userA);
      const completed = await completeAttemptViaApi(pageA);
      resultA = completed.resultRowId;
      acceptedCodeA = completed.resultId;

      const claimed = await claimResult(pageA, resultA);
      expect(claimed.status(), "A's claim must succeed").toBe(200);

      const responded = await respondToInterpretation(pageA, resultA, {
        responseType: "confirmed",
        intentNonce: interpretationNonceA,
      });
      expect(responded.status(), "A's confirmation must be recorded").toBe(201);
      firstResponseIdA = ((await responded.json()) as { responseId: string }).responseId;
      expect(firstResponseIdA).toBeTruthy();

      const setResponse = await materializeRecommendationSet(pageA, resultA, "recommendations");
      expect(setResponse.status(), "A's recommendation set must materialize").toBe(200);
      const set = ((await setResponse.json()) as {
        set: { items: Array<{ itemId: string }> };
      }).set;
      expect(set.items.length, "the governed set must contain items").toBeGreaterThan(0);
      itemIdA = set.items[0].itemId;

      const acted = await recordRecommendationAction(pageA, itemIdA, {
        action: "saved",
        resultRowId: resultA,
        source: "recommendations",
        idempotencyKey: actionKeyA,
      });
      expect(acted.status(), "A's first action must be recorded").toBe(201);
      firstActionIdA = ((await acted.json()) as { actionId: string }).actionId;
    });

    await test.step("setup: B registers and claims a record of their own", async () => {
      await registerSyntheticUser(pageB, userB);
      const completed = await completeAttemptViaApi(pageB);
      resultB = completed.resultRowId;
      const claimed = await claimResult(pageB, resultB);
      expect(claimed.status(), "B's claim must succeed").toBe(200);
      // B now holds a fresh, unrelated attempt credential — the "wrong credential" for later.
      attemptB2 = await startAttemptViaApi(pageB);
    });

    await test.step("setup: an anonymous third context leaves an UNCLAIMED completed result", async () => {
      const completed = await completeAttemptViaApi(pageC);
      resultC = completed.resultRowId;
    });

    await test.step("cross-owner result read is denied and concealed", async () => {
      await pageB.goto(`/result?result=${resultA}`, { waitUntil: "domcontentloaded" });
      await expect(pageB.getByText("この結果は表示できません").first()).toBeVisible({
        timeout: 30_000,
      });
      const body = await pageB.locator("main").innerText();
      expect(body, "concealment must not explain WHY").not.toContain("他のアカウント");
      expect(body).not.toContain("権限");
    });

    await test.step("cross-owner claim is denied as concealment, not as 403", async () => {
      const response = await claimResult(pageB, resultA);
      expect(response.status(), "a claimed record must conceal, never confirm ownership").toBe(404);
      expect(((await response.json()) as { error: string }).error).toBe("result_not_found");
    });

    await test.step("cross-owner interpretation is denied and concealed", async () => {
      const response = await respondToInterpretation(pageB, resultA, {
        responseType: "confirmed",
      });
      expect(response.status()).toBe(404);
      expect(((await response.json()) as { error: string }).error).toBe("result_not_found");
    });

    await test.step("cross-owner report and download are denied", async () => {
      await pageB.goto(`/reports/self-understanding/${acceptedCodeA}?result=${resultA}`, {
        waitUntil: "domcontentloaded",
      });
      await expect(pageB.getByText("この結果は表示できません").first()).toBeVisible({
        timeout: 30_000,
      });
      const download = await pageB.request.get(
        `/reports/self-understanding/${acceptedCodeA}/download?result=${resultA}`,
      );
      expect(download.status(), "the download must deny with a bare 404").toBe(404);
    });

    await test.step("cross-owner recommendation materialization is denied", async () => {
      const response = await materializeRecommendationSet(pageB, resultA, "recommendations");
      expect(response.status()).toBe(404);
    });

    await test.step("cross-owner action mutation is denied — including pairing attacks", async () => {
      // B names A's item with A's result: concealed.
      const direct = await recordRecommendationAction(pageB, itemIdA, {
        action: "saved",
        resultRowId: resultA,
        source: "recommendations",
      });
      expect(direct.status()).toBe(404);

      // B names A's item with B's OWN (legitimately owned) result: the item→set→result lineage
      // check must reject the pairing, not honour the owned result id.
      const paired = await recordRecommendationAction(pageB, itemIdA, {
        action: "saved",
        resultRowId: resultB,
        source: "recommendations",
      });
      expect(paired.status(), "an owned result must not authorize someone else's item").toBe(404);
    });

    await test.step("cross-owner erase is denied and has no side effects", async () => {
      const response = await eraseResultThroughApp(pageB, resultA);
      expect(response.status()).toBe(404);

      // The denial must not have touched A's record.
      await pageA.goto(`/result?result=${resultA}`, { waitUntil: "domcontentloaded" });
      const body = await pageA.locator("main").innerText();
      expect(body, "A's record must be untouched by B's denied erase").not.toContain(
        "この結果は表示できません",
      );
    });

    await test.step("cross-owner LINE recovery is denied and concealed", async () => {
      await pageB.goto(`/line/mini-app?result=${resultA}`, { waitUntil: "domcontentloaded" });
      await expect(pageB.getByText("この結果は表示できません").first()).toBeVisible({
        timeout: 30_000,
      });
    });

    await test.step("a wrong claim credential is denied on an UNCLAIMED record", async () => {
      // B is authenticated and holds a real, valid attempt credential — for a DIFFERENT attempt.
      // The unclaimed record must refuse it: authentication is not authorization.
      const response = await claimResult(pageB, resultC);
      expect(response.status()).toBe(403);
      expect(((await response.json()) as { error: string }).error).toBe(
        "claim_credential_missing",
      );
    });

    await test.step("an expired credential is denied", async () => {
      if (!previewDbConfigured()) {
        testInfo.annotations.push({
          type: "cpc1-expired-credential",
          description:
            "an already-expired attempt cannot be minted through the app (ttl is fixed at 72h); " +
            "this denial runs when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are supplied at " +
            "runtime. Expiry denial at save/complete/read is separately proven in the DB-level " +
            "suites. Recorded here, not silently skipped.",
        });
        return;
      }
      const { attemptId, cookieValue } = await createExpiredAttemptInPreviewDb();
      const expiredContext = await browser.newContext();
      try {
        const base = new URL(testInfo.project.use.baseURL ?? "http://localhost:3000");
        await expiredContext.addCookies([
          {
            name: "yorisou_attempt",
            value: cookieValue,
            domain: base.hostname,
            path: "/",
            httpOnly: true,
            sameSite: "Lax",
          },
        ]);
        const expiredPage = await expiredContext.newPage();
        await expiredPage.goto("/check-in", { waitUntil: "domcontentloaded" });

        // The expired attempt must not resume…
        const read = await expiredPage.request.get("/api/assessment/attempts");
        expect(read.status()).toBe(200);
        expect(((await read.json()) as { attempt: unknown }).attempt).toBeNull();

        // …and must not accept writes.
        const write = await expiredPage.request.patch(`/api/assessment/attempts/${attemptId}`, {
          data: { answers: { Q001: "A" } },
        });
        expect(write.status(), "an expired credential must be denied on write").toBe(404);
      } finally {
        await expiredContext.close();
      }
    });

    await test.step("claim replay is idempotent for the owner", async () => {
      const replay = await claimResult(pageA, resultA);
      expect(replay.status()).toBe(200);
      const body = (await replay.json()) as { claimed: boolean; resultRowId: string };
      expect(body.claimed).toBe(true);
      expect(body.resultRowId).toBe(resultA);
    });

    await test.step("interpretation replay with the same nonce returns the ORIGINAL response", async () => {
      const replay = await respondToInterpretation(pageA, resultA, {
        responseType: "confirmed",
        intentNonce: interpretationNonceA,
      });
      expect(replay.status()).toBe(201);
      const body = (await replay.json()) as { responseId: string };
      expect(body.responseId, "a replay must resolve to the same row, not append a second").toBe(
        firstResponseIdA,
      );
    });

    await test.step("a conflicting payload under the same nonce is rejected", async () => {
      const conflict = await respondToInterpretation(pageA, resultA, {
        responseType: "rejected",
        intentNonce: interpretationNonceA,
      });
      expect(conflict.status()).toBe(409);
      expect(((await conflict.json()) as { error: string }).error).toBe(
        "interpretation_intent_conflict",
      );
    });

    await test.step("recommendation action replay is idempotent; a conflicting reuse is rejected", async () => {
      const replay = await recordRecommendationAction(pageA, itemIdA, {
        action: "saved",
        resultRowId: resultA,
        source: "recommendations",
        idempotencyKey: actionKeyA,
      });
      expect(replay.status()).toBe(201);
      expect(((await replay.json()) as { actionId: string }).actionId).toBe(firstActionIdA);

      // Same key, different action. The RPC raises recommendation_action_intent_conflict, which
      // the route deliberately maps into the concealed 404 shape rather than explaining itself.
      const conflict = await recordRecommendationAction(pageA, itemIdA, {
        action: "tried",
        resultRowId: resultA,
        source: "recommendations",
        idempotencyKey: actionKeyA,
      });
      expect(conflict.status(), "a conflicting idempotency reuse must be rejected").toBe(404);
    });

    await test.step("the action sequence is monotonic and ordering is authoritative", async () => {
      const second = await recordRecommendationAction(pageA, itemIdA, {
        action: "helpful",
        resultRowId: resultA,
        source: "recommendations",
        idempotencyKey: randomUUID(),
      });
      expect(second.status()).toBe(201);
      const third = await recordRecommendationAction(pageA, itemIdA, {
        action: "not_helpful",
        resultRowId: resultA,
        source: "recommendations",
        idempotencyKey: randomUUID(),
      });
      expect(third.status()).toBe(201);

      // The set view orders by the monotonic sequence, newest first — created_at ties cannot
      // reorder it. The recorded order was saved → helpful → not_helpful.
      const setResponse = await materializeRecommendationSet(pageA, resultA, "recommendations");
      expect(setResponse.status()).toBe(200);
      const set = ((await setResponse.json()) as {
        set: { items: Array<{ itemId: string; actions: Array<{ action: string }> }> };
      }).set;
      const item = set.items.find((i) => i.itemId === itemIdA);
      expect(item, "the acted-on item must be present").toBeTruthy();
      expect(item!.actions.map((a) => a.action)).toEqual(["not_helpful", "helpful", "saved"]);

      if (previewDbConfigured()) {
        const rows = await readRecommendationActionsFromPreviewDb(itemIdA);
        const sequences = rows.map((r) => r.sequence_no);
        expect(sequences.length).toBe(3);
        for (let i = 1; i < sequences.length; i += 1) {
          expect(
            sequences[i],
            "sequence numbers must be strictly increasing",
          ).toBeGreaterThan(sequences[i - 1]);
        }
      } else {
        testInfo.annotations.push({
          type: "cpc1-sequence-verification",
          description:
            "API-level ordering proven; the raw sequence_no monotonicity check runs when " +
            "Preview DB access is supplied at runtime. Recorded, not silently skipped.",
        });
      }
    });

    await test.step("sign-out removes A's access to every owner-scoped boundary", async () => {
      await signOut(pageA);

      await pageA.goto(`/result?result=${resultA}`, { waitUntil: "domcontentloaded" });
      await expect(pageA.getByText("この結果は表示できません").first()).toBeVisible({
        timeout: 30_000,
      });

      const respond = await respondToInterpretation(pageA, resultA, {
        responseType: "confirmed",
      });
      expect(respond.status()).toBe(401);

      const recommend = await materializeRecommendationSet(pageA, resultA, "recommendations");
      expect(recommend.status()).toBe(401);

      const erase = await eraseResultThroughApp(pageA, resultA);
      expect(erase.status()).toBe(401);
    });

    await test.step("sign-in restores only the owner's data", async () => {
      await loginSyntheticUser(pageA, userA);

      // A's own record is back…
      await pageA.goto(`/result?result=${resultA}`, { waitUntil: "domcontentloaded" });
      const own = await pageA.locator("main").innerText();
      expect(own).not.toContain("この結果は表示できません");

      // …and B's remains exactly as concealed as before.
      await pageA.goto(`/result?result=${resultB}`, { waitUntil: "domcontentloaded" });
      await expect(pageA.getByText("この結果は表示できません").first()).toBeVisible({
        timeout: 30_000,
      });
    });

    await test.step("erased state is unrecoverable through every boundary", async () => {
      const erased = await eraseResultThroughApp(pageA, resultA);
      expect(erased.status(), "the owner's erase must succeed").toBe(200);

      // A fresh authentication changes nothing: the record is gone, not hidden behind a session.
      await signOut(pageA);
      await loginSyntheticUser(pageA, userA);

      await pageA.goto(`/result?result=${resultA}`, { waitUntil: "domcontentloaded" });
      await expect(pageA.getByText("この結果は表示できません").first()).toBeVisible({
        timeout: 30_000,
      });

      const claim = await claimResult(pageA, resultA);
      expect(claim.status(), "an erased record must not be claimable").toBe(404);

      const respond = await respondToInterpretation(pageA, resultA, {
        responseType: "confirmed",
        intentNonce: interpretationNonceA,
      });
      expect(respond.status(), "an erased record must not accept responses").toBe(404);

      const recommend = await materializeRecommendationSet(pageA, resultA, "recommendations");
      expect(recommend.status()).toBe(404);

      const download = await pageA.request.get(
        `/reports/self-understanding/${acceptedCodeA}/download?result=${resultA}`,
      );
      expect(download.status()).toBe(404);

      const eraseAgain = await eraseResultThroughApp(pageA, resultA);
      expect(eraseAgain.status(), "erasure of the erased must conceal").toBe(404);
    });

    await test.step("cleanup: synthetic records are erased through governed boundaries", async () => {
      const failures = [
        // B erases their own record and abandons the spare attempt.
        ...(await cleanupThroughApp(pageB, { resultRowIds: [resultB], attemptIds: [attemptB2] })),
      ];
      // resultC is anonymous and unclaimed by design: it cannot be erased by anyone (that is the
      // security property), carries entry_source=ux2-acceptance, and expires with its attempt TTL;
      // scripts/ux2/preview-cleanup.sql reclaims it.
      expect(failures, `cleanup failures: ${failures.join(" | ")}`).toEqual([]);
    });
  } finally {
    await contextA.close();
    await contextB.close();
    await contextC.close();
  }
});
