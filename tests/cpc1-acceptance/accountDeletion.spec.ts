// POR-1 WS8 — the account-deletion lifecycle, against the hosted Preview at an exact commit.
//
// The unit tests prove the DECISIONS. This proves the SYSTEM: that a person can ask to be deleted
// through the product's own surfaces, that the data actually goes, that the account cannot come
// back, and — the part it is easiest to get wrong — that nobody ELSE loses anything.
//
// Every step crosses the real routes. Nothing is set up by writing to the database directly; the
// database is read afterwards only to COUNT, never to read back what was erased.

import { expect, test } from "@playwright/test";

import {
  claimResult,
  completeAttemptViaApi,
  countRowsForOwnerInPreviewDb,
  loginSyntheticUser,
  previewDbConfigured,
  readAttemptRowFromPreviewDb,
  readDeletionJobFromPreviewDb,
  readResultRowFromPreviewDb,
  registerSyntheticUser,
  respondToInterpretation,
  syntheticUser,
} from "./fixtures";

// ─────────────────────────────────────────────────────────────────────────────
// ONE BROWSER CONTEXT PER PERSON.
//
// A deletion is a lifecycle: register, accumulate real records, ask, reauthenticate, be erased,
// then fail to get back in. Split across Playwright tests those steps get separate cookie jars,
// and "the session is dead" would pass trivially because there never was one. Two contexts, two
// people, named steps.
// ─────────────────────────────────────────────────────────────────────────────

test("POR-1 account deletion lifecycle, and User B is untouched", async ({ browser }, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "a full two-person lifecycle runs once; viewport coverage comes from the other suites",
  );
  test.setTimeout(900_000);

  const contextA = await browser.newContext();
  const contextB = await browser.newContext();
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  const userA = syntheticUser("del-a");
  const userB = syntheticUser("del-b");

  let accountA = "";
  let accountB = "";
  let resultA = "";
  let attemptA = "";
  let resultB = "";
  let attemptB = "";

  try {
    await test.step("two people register and each accumulates a real, claimed record", async () => {
      accountA = await registerSyntheticUser(pageA, userA);
      accountB = await registerSyntheticUser(pageB, userB);
      expect(accountA).not.toBe(accountB);

      const a = await completeAttemptViaApi(pageA);
      resultA = a.resultRowId;
      attemptA = a.attemptId;
      expect((await claimResult(pageA, resultA)).ok(), "A claims their own result").toBe(true);

      const b = await completeAttemptViaApi(pageB);
      resultB = b.resultRowId;
      attemptB = b.attemptId;
      expect((await claimResult(pageB, resultB)).ok(), "B claims their own result").toBe(true);

      // An answered interpretation, so the deletion has recommendation-eligible state to erase
      // rather than a bare result row.
      const answered = await respondToInterpretation(pageA, resultA, { responseType: "confirmed" });
      expect(answered.ok(), "A answers their interpretation").toBe(true);
    });

    await test.step("the status endpoint reports no deletion before one is asked for", async () => {
      const status = await pageA.request.get("/api/account/deletion-status");
      expect(status.status()).toBe(200);
      const body = (await status.json()) as { state: string | null };
      // Null, not the RPC's `"none"` sentinel: the orchestrator normalises that at the boundary, and
      // this asserts the normalisation actually happens rather than leaking into the API contract.
      expect(body.state, "no job exists yet").toBeNull();
    });

    await test.step("a deletion can be opened and then cancelled — asking is not committing", async () => {
      const opened = await pageA.request.post("/api/account/deletion-request");
      expect(opened.ok(), "opening a deletion job is non-destructive and must succeed").toBe(true);

      const status = await pageA.request.get("/api/account/deletion-status");
      const body = (await status.json()) as { state: string; cancellable: boolean };
      expect(body.state, "a fresh job starts at requested").toBe("requested");
      expect(body.cancellable, "nothing irreversible has run, so it is cancellable").toBe(true);

      const cancelled = await pageA.request.post("/api/account/deletion-cancel");
      expect(cancelled.ok(), "cancellation before erasure must succeed").toBe(true);

      // And the account still works afterwards. A cancelled deletion that leaves someone locked
      // out has not been cancelled.
      const stillMine = await pageA.request.get("/api/account/deletion-status");
      expect(stillMine.status(), "the session survives a cancellation").toBe(200);
      const after = (await stillMine.json()) as { state: string };
      expect(after.state).toBe("cancelled");
    });

    await test.step("confirmation refuses without the exact typed phrase", async () => {
      const wrong = await pageA.request.post("/api/account/deletion-confirm", {
        data: { password: userA.password, confirmation: "削除" },
      });
      expect(wrong.status(), "a near-miss confirmation is not a confirmation").toBe(400);
      expect((await wrong.json()).error).toBe("confirmation_required");
    });

    await test.step("confirmation refuses with a wrong password, even holding a valid session", async () => {
      const wrong = await pageA.request.post("/api/account/deletion-confirm", {
        data: { password: `${userA.password}-wrong`, confirmation: "削除します" },
      });
      expect(wrong.status(), "possession of a session is not proof of identity").toBe(401);
      expect((await wrong.json()).error).toBe("reauthentication_failed");
    });

    await test.step("the endpoint is not an oracle — it deletes the SESSION's account, never a named one", async () => {
      const injected = await pageA.request.post("/api/account/deletion-confirm", {
        data: { password: userA.password, confirmation: "削除します", accountId: accountB },
      });
      expect(injected.status(), "an unexpected field is refused outright").toBe(400);
      const body = (await injected.json()) as { error: string; field: string };
      expect(body.error).toBe("unexpected_field");
      expect(body.field).toBe("accountId");

      // And B is entirely unharmed — proven by B still being able to read their own record.
      const bStillHere = await pageB.request.get("/api/account/deletion-status");
      expect(bStillHere.status()).toBe(200);
    });

    await test.step("a correct confirmation deletes the account", async () => {
      // The saga runs inline and can outlast the request under load. A timed-out REQUEST is not a
      // failed DELETION — the saga is resumable and the product tells the person to re-open the
      // screen. So a transport failure falls through to the same terminal check the UI performs,
      // rather than being reported as a product defect.
      let completed = false;
      try {
        const confirmed = await pageA.request.post("/api/account/deletion-confirm", {
          data: { password: userA.password, confirmation: "削除します" },
          timeout: 120_000,
        });
        const body = await confirmed.json();
        expect(
          confirmed.status(),
          // A 202 means the saga ran and did not finish; surfacing the state it stopped at is the
          // difference between a diagnosable failure and "the deletion did not work".
          `deletion must complete; stopped at ${JSON.stringify(body)}`,
        ).toBe(200);
        expect(body.state).toBe("completed");
        completed = true;
      } catch (error) {
        expect(
          String(error),
          "only a transport timeout may fall through to status recovery",
        ).toMatch(/ETIMEDOUT|timeout|socket hang up/i);
      }

      if (!completed) {
        // Recovery path, exactly as the panel does it: poll until the account stops resolving
        // (401 — the erased account has no session) or the state reports completion.
        let terminal = false;
        for (let attempt = 0; attempt < 20 && !terminal; attempt += 1) {
          const status = await pageA.request.get("/api/account/deletion-status");
          if (status.status() === 401) terminal = true;
          else if (((await status.json()) as { state: string }).state === "completed") terminal = true;
          else await pageA.waitForTimeout(3_000);
        }
        expect(terminal, "a timed-out confirmation must still reach a completed deletion").toBe(true);
      }
    });

    await test.step("the session is dead — a revoked cookie no longer acts as the account", async () => {
      // This is the property the synthetic-session fallback used to defeat: the cookie is
      // self-contained, so deleting session objects alone did not end the session.
      const afterDeletion = await pageA.request.get("/api/account/deletion-status");
      expect(afterDeletion.status(), "the erased account resolves to nobody").toBe(401);
    });

    await test.step("the account cannot log back in", async () => {
      const relogin = await pageA.request.post("/api/auth/login", {
        data: { email: userA.email, password: userA.password },
      });
      expect(relogin.status(), "an erased account has no credentials to accept").not.toBe(200);
    });

    await test.step("a browser still holding the account cookie cannot resurrect the account", async () => {
      // contextA's `yorisou_account` cookie was cleared by the completion response. A DIFFERENT
      // device would still hold one, so this asserts the server-side rule rather than the cookie
      // clear: the login store lookup misses, and the durable job refuses the fallback.
      const freshContext = await browser.newContext();
      const freshPage = await freshContext.newPage();
      const relogin = await freshPage.request.post("/api/auth/login", {
        data: { email: userA.email, password: userA.password },
      });
      expect(relogin.status()).not.toBe(200);
      await freshContext.close();
    });

    await test.step("a repeated confirmation is idempotent, not an error", async () => {
      // A person who reloads the tab, or a retry after a network blip, must not see a failure for
      // work that already succeeded.
      const again = await pageA.request.post("/api/account/deletion-confirm", {
        data: { password: userA.password, confirmation: "削除します" },
      });
      // The session is gone, so this is refused at the door rather than re-running the saga. Either
      // outcome is honest; what must NOT happen is a 500.
      expect([401, 200]).toContain(again.status());
    });

    await test.step("USER B IS COMPLETELY UNAFFECTED", async () => {
      const status = await pageB.request.get("/api/account/deletion-status");
      expect(status.status(), "B's session still works").toBe(200);
      expect((await status.json()).state, "B never asked to be deleted").toBeNull();

      await loginSyntheticUser(pageB, userB);

      if (previewDbConfigured()) {
        const bResult = await readResultRowFromPreviewDb(resultB);
        expect(bResult, "B's result row still exists").not.toBeNull();
        expect(bResult?.deleted_at, "B's result is not tombstoned").toBeNull();
        expect(bResult?.owner_account_id, "B still owns it").toBe(accountB);

        const bAttempt = await readAttemptRowFromPreviewDb(attemptB);
        expect(bAttempt, "B's attempt still exists").not.toBeNull();
      }
    });

    await test.step("A's data is actually gone from the database, not merely hidden", async () => {
      test.skip(!previewDbConfigured(), "requires Preview database access");

      const aResult = await readResultRowFromPreviewDb(resultA);
      if (aResult !== null) {
        // The frozen contract keeps a content-free tombstone; what it must NOT keep is content or
        // an owner to attribute it to.
        expect(aResult.owner_account_id, "no owner may remain on a deleted person's row").toBeNull();
        expect(aResult.deleted_at, "a surviving row must be tombstoned").not.toBeNull();
        expect(
          Object.keys(aResult.dimension_output ?? {}).length,
          "no derived content may survive",
        ).toBe(0);
      }

      // ORDER OF OPERATIONS, stated as it actually is rather than as the plan describes it.
      //
      // The saga erases results first, through the owner-scoped result contract — and that contract
      // anonymises the parent attempt (owner nulled, answers emptied, status `abandoned`). The
      // plan's later `delete from yorisou_assessment_attempts where owner_account_id = ...` then
      // matches nothing, because the owner is already gone. The migration's comment says attempts
      // are "removed outright"; for an attempt that produced a result, they are emptied instead.
      //
      // The privacy outcome is the same and is what this asserts: whatever survives carries no
      // answers and cannot be attributed to anyone. (An attempt abandoned before producing a result
      // keeps its owner and IS deleted by that statement, so the statement is not dead code.)
      const aAttempt = await readAttemptRowFromPreviewDb(attemptA);
      if (aAttempt !== null) {
        expect(aAttempt.owner_account_id, "no surviving attempt may name the deleted person").toBeNull();
        expect(
          Object.keys(aAttempt.answers ?? {}).length,
          "no raw answers may survive a deletion",
        ).toBe(0);
        expect(aAttempt.claim_token_hash, "no claim credential may survive").toBeNull();
      }

      for (const [table, column] of [
        ["yorisou_assessment_results", "owner_account_id"],
        ["yorisou_assessment_attempts", "owner_account_id"],
        ["yorisou_canonical_recommendation_sets", "owner_account_id"],
      ] as const) {
        expect(
          await countRowsForOwnerInPreviewDb(table, column, accountA),
          `${table} must retain no row for the deleted account`,
        ).toBe(0);
      }
    });

    await test.step("completion is earned — the raw account id is replaced by a fingerprint", async () => {
      test.skip(!previewDbConfigured(), "requires Preview database access");

      const job = await readDeletionJobFromPreviewDb(accountA);
      expect(
        job,
        "finalize() drops the raw account id, so the job is no longer findable by it — " +
          "that absence IS the proof, not a missing record",
      ).toBeNull();
    });
  } finally {
    await contextA.close();
    await contextB.close();
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// The deletion API refuses everyone who is not signed in. Cheap, and it runs on both viewports.
// ─────────────────────────────────────────────────────────────────────────────
test.describe("deletion endpoints deny without disclosing", () => {
  for (const route of [
    "/api/account/deletion-request",
    "/api/account/deletion-confirm",
    "/api/account/deletion-cancel",
  ]) {
    test(`${route} refuses an unauthenticated caller`, async ({ page }) => {
      const response = await page.request.post(route, {
        data: { password: "irrelevant", confirmation: "削除します" },
      });
      expect(response.status(), "no anonymous caller may touch a deletion").toBe(401);
      const body = await response.text();
      expect(body, "the refusal must not name a table, key or account").not.toMatch(
        /phase1\/|yorisou_[a-z_]+|@/,
      );
    });
  }

  test("/api/account/deletion-status refuses an unauthenticated caller", async ({ page }) => {
    const response = await page.request.get("/api/account/deletion-status");
    expect(response.status()).toBe(401);
  });
});
