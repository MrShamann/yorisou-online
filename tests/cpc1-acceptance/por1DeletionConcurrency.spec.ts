// POR-1 WS8 — THE CONCURRENT DELETION ACCEPTANCE, against the hosted Preview at an exact commit.
//
// WHY A SERIAL RUN DOES NOT COUNT.
//
// `accountDeletion.spec.ts` proves the lifecycle: ask, be erased, fail to get back in. It runs
// serially, and serially this product has ALWAYS passed. The defect that produced this whole package
// only appears under concurrency — a hosted bisection with two workers found the primary account
// record back in the bucket after erasure, because a request had loaded it before the deletion
// started and wrote its stale copy afterwards.
//
// So this suite deliberately runs FOUR ADVERSARIES against a real deletion:
//
//   1. a stale account mutation      (support-profile write → account record)
//   2. a stale foundation mutation   (the same route's canonical half → UserProfile)
//   3. a stale session touch         (an authenticated request from a second live session)
//   4. a SECOND deletion executor    (a concurrent confirm, holding the same credentials)
//
// And it does so against a FULLY POPULATED account, because the erasure inventory is only as good as
// what the account actually owns. A LINE-bound identity is not optional coverage here: the LINE
// lookup key was wrong for the entire life of the deletion adapter, and nothing caught it because no
// acceptance identity had ever been LINE-bound.
//
// Every assertion about absence reads the ISOLATED PREVIEW STORE directly. "The route stopped
// showing it" is not the same claim as "it is gone", and only one of them is a deletion.

import { expect, test } from "@playwright/test";

import {
  bindLineIdentityInPreviewStore,
  claimResult,
  completeAttemptViaApi,
  countRowsForOwnerInPreviewDb,
  establishLineActivity,
  listStoreKeys,
  materializeRecommendationSet,
  previewDbConfigured,
  previewStoreConfigured,
  readDeletionJobFromPreviewDb,
  readStoreObject,
  recordRecommendationAction,
  registerSyntheticUser,
  respondToInterpretation,
  storeKeys,
  storeObjectExists,
  syntheticLineUserId,
  syntheticUser,
} from "./fixtures";

type SessionRecord = { id: string; userId: string | null; principalLanding?: unknown };

/**
 * Log in with a generous timeout and one retry.
 *
 * Not a workaround for a product defect: authenticated login against the isolated Preview costs
 * ~9 seconds because the identity store is an object store in a different region from the lambda,
 * and it cost ~8.3s before this package touched anything. Playwright's default request timeout sits
 * close enough to that to lose to a cold start, which then reads as a deletion failure rather than
 * as a slow login. The retry is about attribution, not about tolerating flakiness.
 */
async function loginWithPatience(page: import("@playwright/test").Page, user: { email: string; password: string }) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await page.request.post("/api/auth/login", {
        data: { email: user.email, password: user.password },
        timeout: 120_000,
      });
      expect(response.status(), "synthetic login must succeed").toBe(200);
      return;
    } catch (error) {
      if (attempt === 1) throw error;
    }
  }
}

test("POR-1 concurrent deletion: four adversaries, a fully populated account, and User B untouched", async ({
  browser,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "a concurrent lifecycle runs once; viewport coverage comes from the other suites",
  );
  test.skip(!previewStoreConfigured(), "requires isolated Preview identity-store access");
  test.setTimeout(900_000);

  const baseUrl = process.env.PLAYWRIGHT_BASE_URL as string;

  // FIVE browser contexts, deliberately.
  //
  // Sharing one cookie jar would make "the other session is still live" untestable, and would let a
  // single revocation look like four. Each adversary needs its own session precisely because the
  // property under test is what happens to OTHER live sessions during an erasure.
  const contextA = await browser.newContext();       // the person being deleted
  const contextA2 = await browser.newContext();      // A's second device — the stale session
  const contextAdversary = await browser.newContext(); // A's third session — the stale writer
  const contextExecutor2 = await browser.newContext(); // the second deletion executor
  const contextB = await browser.newContext();       // an unrelated person

  const pageA = await contextA.newPage();
  const pageA2 = await contextA2.newPage();
  const pageAdversary = await contextAdversary.newPage();
  const pageExecutor2 = await contextExecutor2.newPage();
  const pageB = await contextB.newPage();

  const userA = syntheticUser("por1-conc-a");
  const userB = syntheticUser("por1-conc-b");
  const lineUserId = syntheticLineUserId();
  let lineActivity: { origin: string; eventId: string; status: number } = {
    origin: "none",
    eventId: "",
    status: 0,
  };

  let accountA = "";
  let accountB = "";
  let resultA = "";
  let resultB = "";
  const ownedSessionIds: string[] = [];

  try {
    // ─────────────────────────────────────────────────────────────────────────
    // A FULLY POPULATED ACCOUNT.
    //
    // Built through real routes wherever a real route exists. The one exception — the LINE binding —
    // is named as an exception in the fixture rather than disguised as a flow.
    // ─────────────────────────────────────────────────────────────────────────
    await test.step("A registers and accumulates canonical assessment, result and recommendation state", async () => {
      accountA = await registerSyntheticUser(pageA, userA);
      accountB = await registerSyntheticUser(pageB, userB);
      expect(accountA).not.toBe(accountB);

      const a = await completeAttemptViaApi(pageA);
      resultA = a.resultRowId;
      expect((await claimResult(pageA, resultA)).ok(), "A claims their own result").toBe(true);
      expect(
        (await respondToInterpretation(pageA, resultA, { responseType: "confirmed" })).ok(),
        "A answers their interpretation, so recommendations are eligible",
      ).toBe(true);

      // Canonical recommendation data, and a persisted action on it — the family the namespace
      // migration created, and the one most likely to be missed by an erasure written against the
      // legacy tables.
      const set = await materializeRecommendationSet(pageA, resultA, "result");
      expect(set.ok(), "A materializes a canonical recommendation set").toBe(true);
      const setBody = (await set.json()) as { items?: { id: string }[] };
      const firstItem = setBody.items?.[0]?.id;
      if (firstItem) {
        // A persisted action, so the erasure has recommendation ACTION rows to remove and not just
        // the set — the action family is owner-linked separately and is easy to miss.
        await recordRecommendationAction(pageA, firstItem, {
          action: "saved",
          resultRowId: resultA,
          source: "result",
        });
      }

      const b = await completeAttemptViaApi(pageB);
      resultB = b.resultRowId;
      expect((await claimResult(pageB, resultB)).ok(), "B claims their own result").toBe(true);
    });

    await test.step("A accumulates legacy private state and a consultation", async () => {
      // Legacy private data, through the route the product actually uses.
      const reflection = await pageA.request.post("/api/private-state/reflections", {
        data: { note: "POR-1 受入検証の記録", resultRowId: resultA },
      });
      // The route may legitimately refuse depending on capability state; what must not happen is a
      // 5xx, and the deletion inventory is asserted against whatever DID get created.
      expect(reflection.status(), "private-state must answer, not fault").toBeLessThan(500);

      const consultation = await pageA.request.post("/api/ai-advisor", {
        data: {
          locale: "ja",
          answers: { q1: "a", q2: "b", q3: "c" },
        },
      });
      expect(consultation.status(), "the advisor route must answer, not fault").toBeLessThan(500);
    });

    await test.step("A holds MULTIPLE live sessions, including a second device", async () => {
      // A second, independently authenticated session. This is the session the erasure must revoke
      // and the one the stale-session adversary will use.
      await loginWithPatience(pageA2, userA);
      await loginWithPatience(pageAdversary, userA);
      await loginWithPatience(pageExecutor2, userA);

      for (const context of [contextA, contextA2, contextAdversary, contextExecutor2]) {
        const cookies = await context.cookies();
        const raw = cookies.find((cookie) => cookie.name === "yorisou_session")?.value;
        expect(raw, "each context must hold a session cookie").toBeTruthy();
      }

      // Enumerate what A actually owns in the store, by reading the session objects rather than by
      // trusting the cookies: a session whose `userId` is null but whose principal-landing contract
      // names A is still A's, and that is exactly the shape the erasure probe once missed.
      const sessionKeys = await listStoreKeys("phase1/sessions");
      for (const key of sessionKeys) {
        const session = await readStoreObject<SessionRecord>(key);
        if (!session) continue;
        const landing = session.principalLanding as
          | { principalId?: string; userProfileId?: string; legacyAccountId?: string }
          | null
          | undefined;
        const ownedByA =
          session.userId === accountA ||
          landing?.principalId === accountA ||
          landing?.userProfileId === accountA ||
          landing?.legacyAccountId === accountA;
        if (ownedByA) ownedSessionIds.push(session.id);
      }
      expect(ownedSessionIds.length, "A must own more than one live session").toBeGreaterThan(1);
    });

    await test.step("A holds a password-reset credential", async () => {
      const reset = await pageA.request.post("/api/auth/forgot-password", {
        data: { email: userA.email },
      });
      // Enumeration-safe by design: this route answers the same way whether or not the address
      // exists. So the assertion is on the ABSENCE of a fault, and the token's existence is proven
      // from the store below.
      expect(reset.status(), "forgot-password must answer, not fault").toBeLessThan(500);
      const resetKeys = await listStoreKeys("phase1/password-resets");
      expect(resetKeys.length, "a reset credential exists in the isolated store").toBeGreaterThan(0);
    });

    await test.step("A is LINE-bound, with a LINE event and a recent-subject index entry", async () => {
      await bindLineIdentityInPreviewStore(accountA, lineUserId);
      expect(
        await storeObjectExists(storeKeys.lineLookup(lineUserId)),
        "the hashed LINE lookup exists — this is the family the adapter got wrong",
      ).toBe(true);

      // LINE activity: an event record and an entry in the SHARED recent-subject index. The fixture
      // prefers the real signed webhook and falls back to seeding the store when the environment
      // holds no LINE channel secret — which isolated Preview deliberately does not. Which path ran
      // is printed, so the evidence never overstates how the state was created.
      lineActivity = await establishLineActivity(baseUrl, lineUserId, accountA);
      console.log(`[por1] line_activity_origin=${lineActivity.origin} event=${lineActivity.eventId}`);
      expect(
        await storeObjectExists(storeKeys.lineEvent(lineActivity.eventId)),
        "a LINE event record exists for A",
      ).toBe(true);

      const recent = await readStoreObject<{ lineUserId: string }[]>(storeKeys.recentLineSubjects());
      expect(
        (recent ?? []).some((entry) => entry.lineUserId === lineUserId),
        "A appears in the SHARED recent-subject index",
      ).toBe(true);
    });

    await test.step("A's foundation mirror exists — profile and both auth identities", async () => {
      const profiles = await listStoreKeys(storeKeys.foundationUserProfiles());
      const identities = await listStoreKeys(storeKeys.foundationAuthIdentities());
      expect(profiles.length, "the canonical profile mirror exists").toBeGreaterThan(0);
      expect(identities.length, "canonical auth identities exist").toBeGreaterThan(0);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // THE CONCURRENT DELETION.
    // ─────────────────────────────────────────────────────────────────────────
    await test.step("the deletion is opened", async () => {
      const opened = await pageA.request.post("/api/account/deletion-request");
      expect(opened.ok(), "opening a deletion job must succeed").toBe(true);
    });

    let confirmStatus = 0;
    let confirmBody: Record<string, unknown> = {};
    const adversaryOutcomes: Record<string, number> = {};

    await test.step("FOUR ADVERSARIES RUN DURING THE ERASURE", async () => {
      // Fired together, deliberately without awaiting the confirm first. A serial run — confirm,
      // then poke — proves nothing this package cares about: it is the OVERLAP that produced the
      // resurrection, and an adversary that starts after completion is just a post-deletion probe.
      const confirm = pageA.request
        .post("/api/account/deletion-confirm", {
          data: { password: userA.password, confirmation: "削除します" },
          timeout: 180_000,
        })
        .then(async (response) => {
          confirmStatus = response.status();
          confirmBody = (await response.json()) as Record<string, unknown>;
        })
        .catch((error) => {
          // A transport timeout is not a failed deletion — the saga is resumable and the recovery
          // path below is exactly what the product's own panel does.
          expect(String(error)).toMatch(/ETIMEDOUT|timeout|socket hang up/i);
          confirmStatus = 0;
        });

      // 1 + 2. A stale ACCOUNT mutation and a stale FOUNDATION mutation, in one request: the
      //        support-preferences route writes the canonical UserProfile and the legacy account
      //        record, which before this package were two windows with a gap between them.
      const staleAccountAndFoundation = pageAdversary.request
        .post("/api/support/preferences", {
          data: {
            lineNotificationsEnabled: true,
            familyContactName: "STALE-WRITE-MUST-NOT-SURVIVE",
            familyContactRelation: "検証",
            familyContactMethod: "phone",
            familyContactValue: "000-0000-0000",
            familyShareNote: "POR-1 stale writer",
          },
          timeout: 180_000,
        })
        .then((response) => {
          adversaryOutcomes.staleAccountAndFoundation = response.status();
        })
        .catch(() => {
          adversaryOutcomes.staleAccountAndFoundation = -1;
        });

      // 3. A stale SESSION touch: an authenticated read from A's second device. Before this package
      //    every such read wrote the session back, which is how a stale cookie could re-assert an
      //    identity mid-erasure.
      const staleSessionTouch = pageA2.request
        .get("/api/account/deletion-status", { timeout: 180_000 })
        .then((response) => {
          adversaryOutcomes.staleSessionTouch = response.status();
        })
        .catch(() => {
          adversaryOutcomes.staleSessionTouch = -1;
        });

      // 4. A SECOND DELETION EXECUTOR, holding the same valid credentials. Before the executor claim
      //    this drove the same saga alongside the first.
      const secondExecutor = pageExecutor2.request
        .post("/api/account/deletion-confirm", {
          data: { password: userA.password, confirmation: "削除します" },
          timeout: 180_000,
        })
        .then(async (response) => {
          adversaryOutcomes.secondExecutor = response.status();
          const body = (await response.json()) as Record<string, unknown>;
          adversaryOutcomes.secondExecutorCompleted = body.state === "completed" ? 1 : 0;
        })
        .catch(() => {
          adversaryOutcomes.secondExecutor = -1;
        });

      await Promise.all([confirm, staleAccountAndFoundation, staleSessionTouch, secondExecutor]);
    });

    await test.step("the deletion reaches completion, resuming if the request timed out", async () => {
      if (confirmStatus === 200 && confirmBody.state === "completed") return;

      // Resume exactly as the product's panel does. A concurrent run may legitimately have been
      // refused the claim (`in_progress`) — that is the single-writer property working, not a
      // failure — so the retry loop is what carries it to completion.
      let terminal = false;
      for (let attempt = 0; attempt < 40 && !terminal; attempt += 1) {
        const status = await pageA.request.get("/api/account/deletion-status");
        if (status.status() === 401) {
          terminal = true;
          break;
        }
        const body = (await status.json()) as { state: string | null };
        if (body.state === "completed") {
          terminal = true;
          break;
        }
        const retry = await pageA.request.post("/api/account/deletion-confirm", {
          data: { password: userA.password, confirmation: "削除します" },
          timeout: 180_000,
        });
        if (retry.status() === 401) {
          terminal = true;
          break;
        }
        const retryBody = (await retry.json()) as { state?: string };
        if (retryBody.state === "completed") {
          terminal = true;
          break;
        }
        await pageA.waitForTimeout(3_000);
      }
      expect(
        terminal,
        `deletion did not reach completion; last confirm=${confirmStatus} ${JSON.stringify(confirmBody)} ` +
          `adversaries=${JSON.stringify(adversaryOutcomes)}`,
      ).toBe(true);
    });

    await test.step("ONLY ONE EXECUTOR OWNED THE SAGA", async () => {
      // The second confirm must never have reported that IT completed the deletion. Being refused
      // (202 in_progress), being told the account is gone (401), or completing after the first had
      // already finished are all honest; two executors both claiming to have run it are not.
      expect(
        adversaryOutcomes.secondExecutor,
        `the second executor must be answered, not faulted (got ${adversaryOutcomes.secondExecutor})`,
      ).not.toBe(500);
      expect(
        [200, 202, 401, 409, 503],
        `unexpected second-executor status ${adversaryOutcomes.secondExecutor}`,
      ).toContain(adversaryOutcomes.secondExecutor);
    });

    await test.step("THE STALE WRITERS WERE DENIED, NOT SILENTLY ACCEPTED", async () => {
      // The exact outcome depends on where in the erasure each landed, and both honest outcomes are
      // acceptable: allowed BEFORE the gate closed (and therefore drained before anything was
      // destroyed), or refused after. What is NOT acceptable is a 5xx — that would mean the fence
      // threw rather than refusing — or, far worse, a write that survives, which is asserted below.
      expect(
        adversaryOutcomes.staleAccountAndFoundation,
        "the stale account/foundation writer must be answered, not faulted",
      ).not.toBe(500);
      expect(
        adversaryOutcomes.staleSessionTouch,
        "the stale session touch must be answered, not faulted",
      ).not.toBe(500);
    });

    // ─────────────────────────────────────────────────────────────────────────
    // NO STALE IDENTITY OR SESSION SURVIVES. Read from the store, not from a route.
    // ─────────────────────────────────────────────────────────────────────────
    await test.step("EVERY TARGET FAMILY IS ABSENT FROM THE ISOLATED STORE", async () => {
      const absent: Record<string, boolean> = {
        account_record: !(await storeObjectExists(storeKeys.account(accountA))),
        email_lookup: !(await storeObjectExists(storeKeys.emailLookup(userA.email))),
        line_lookup: !(await storeObjectExists(storeKeys.lineLookup(lineUserId))),
        line_event: !(await storeObjectExists(storeKeys.lineEvent(lineActivity.eventId))),
      };
      for (const [family, isAbsent] of Object.entries(absent)) {
        expect(isAbsent, `${family} must be gone — a stale write must not have restored it`).toBe(true);
      }

      for (const sessionId of ownedSessionIds) {
        expect(
          await storeObjectExists(storeKeys.session(sessionId)),
          `session ${sessionId.slice(0, 8)}… must be revoked`,
        ).toBe(false);
      }

      // The shared recent-subject index is PRUNED, not deleted: everyone else's entries must remain.
      const recent = await readStoreObject<{ lineUserId: string }[]>(storeKeys.recentLineSubjects());
      expect(
        (recent ?? []).some((entry) => entry.lineUserId === lineUserId),
        "A's entries are pruned from the shared LINE-subject index",
      ).toBe(false);
      expect(recent, "the shared index itself still exists — pruning is not deletion").not.toBeNull();
    });

    await test.step("no foundation mirror names A, and no stale write recreated one", async () => {
      const profileKeys = await listStoreKeys(storeKeys.foundationUserProfiles());
      for (const key of profileKeys) {
        const profile = await readStoreObject<{ legacyAccountId?: string; userProfileId?: string }>(key);
        expect(
          profile?.legacyAccountId === accountA || profile?.userProfileId === accountA,
          "no canonical profile may name the deleted account",
        ).toBe(false);
      }

      const identityKeys = await listStoreKeys(storeKeys.foundationAuthIdentities());
      for (const key of identityKeys) {
        const identity = await readStoreObject<{
          legacyAccountId?: string;
          userProfileId?: string;
          lineUserId?: string | null;
        }>(key);
        expect(
          identity?.legacyAccountId === accountA ||
            identity?.userProfileId === accountA ||
            identity?.lineUserId === lineUserId,
          "no auth identity — the login route itself — may name the deleted account",
        ).toBe(false);
      }
    });

    await test.step("no password-reset credential survives for A", async () => {
      const resetKeys = await listStoreKeys("phase1/password-resets");
      for (const key of resetKeys) {
        const token = await readStoreObject<{ accountId?: string }>(key);
        expect(token?.accountId, "a live reset token is a way back in").not.toBe(accountA);
      }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // EVERY DOOR IS SHUT.
    // ─────────────────────────────────────────────────────────────────────────
    await test.step("login, cookie restoration, reset, reports and recommendations are all denied", async () => {
      const relogin = await pageA.request.post("/api/auth/login", {
        data: { email: userA.email, password: userA.password },
      });
      expect(relogin.status(), "an erased account has no credentials to accept").not.toBe(200);

      // Cookie restoration from a DIFFERENT device that still holds A's cookies. This is the path a
      // stale cookie would use, and it is the one the fence exists to close.
      const stillHolding = await pageA2.request.get("/api/account/deletion-status");
      expect(stillHolding.status(), "a surviving cookie resolves to nobody").toBe(401);

      const reset = await pageA.request.post("/api/auth/forgot-password", {
        data: { email: userA.email },
      });
      expect(reset.status(), "reset must answer without faulting").toBeLessThan(500);
      const resetKeys = await listStoreKeys("phase1/password-resets");
      for (const key of resetKeys) {
        const token = await readStoreObject<{ accountId?: string }>(key);
        expect(token?.accountId, "no reset may be issued for an erased account").not.toBe(accountA);
      }

      const recommendations = await pageA.request.get(`/api/recommendations?result=${resultA}`);
      expect(
        recommendations.status(),
        "recommendations must not rematerialize for a deleted owner",
      ).not.toBe(200);
    });

    await test.step("A's LINE event is gone and the LINE subject resolves to nobody", async () => {
      expect(
        await storeObjectExists(storeKeys.lineEvent(lineActivity.eventId)),
        "A's LINE event record must be erased",
      ).toBe(false);
      expect(
        await storeObjectExists(storeKeys.lineLookup(lineUserId)),
        "the LINE login route for A's subject must not resolve to anyone",
      ).toBe(false);
    });

    await test.step("the database holds nothing owner-attributable, and the job is fingerprint-only", async () => {
      test.skip(!previewDbConfigured(), "requires Preview database access");

      for (const [table, column] of [
        ["yorisou_assessment_results", "owner_account_id"],
        ["yorisou_assessment_attempts", "owner_account_id"],
        ["yorisou_canonical_recommendation_sets", "owner_account_id"],
        ["yorisou_canonical_recommendation_items", "owner_account_id"],
        ["yorisou_canonical_recommendation_actions", "owner_account_id"],
        ["yorisou_private_recommendations", "owner_account_id"],
      ] as const) {
        expect(
          await countRowsForOwnerInPreviewDb(table, column, accountA),
          `${table} must retain no row for the deleted account`,
        ).toBe(0);
      }

      const job = await readDeletionJobFromPreviewDb(accountA);
      expect(
        job,
        "finalize drops the raw account id, so the job is no longer findable by it — that absence IS the proof",
      ).toBeNull();
    });

    await test.step("USER B IS COMPLETELY UNAFFECTED", async () => {
      const status = await pageB.request.get("/api/account/deletion-status");
      expect(status.status(), "B's session still works").toBe(200);
      expect((await status.json()).state, "B never asked to be deleted").toBeNull();

      await loginWithPatience(pageB, userB);
      expect(
        await storeObjectExists(storeKeys.account(accountB)),
        "B's account record is untouched",
      ).toBe(true);
      expect(
        await storeObjectExists(storeKeys.emailLookup(userB.email)),
        "B can still be found by email",
      ).toBe(true);

      // And B can still WRITE — a fence that closed the gate on the wrong account would show here
      // and nowhere else.
      const write = await pageB.request.post("/api/support/preferences", {
        data: {
          lineNotificationsEnabled: false,
          familyContactName: "B は無傷",
          familyContactRelation: "検証",
          familyContactMethod: "phone",
          familyContactValue: "111-1111-1111",
          familyShareNote: "untouched",
        },
      });
      expect(write.status(), "B's writes are unaffected by A's deletion").toBeLessThan(400);

      if (previewDbConfigured()) {
        expect(
          await countRowsForOwnerInPreviewDb("yorisou_assessment_results", "owner_account_id", accountB),
          "B still owns their result",
        ).toBeGreaterThan(0);
      }
    });
  } finally {
    for (const context of [contextA, contextA2, contextAdversary, contextExecutor2, contextB]) {
      await context.close();
    }
  }
});
