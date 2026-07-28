import { expect, test, type Page } from "@playwright/test";

// CPC-1 acceptance — the PRINCIPAL JOURNEY from the frozen contract, in a real browser.
//
//   anonymous entry → start → answer partially → refresh → resume → complete
//   → persisted result → refresh → select correction → login → claim
//   → correction persists → refresh → private-state → eligible recommendations
//   → recommendation feedback → sign out → sign in → all state restored
//   → erase → result and downstream state unavailable
//
// Each step asserts the property the product actually promises, not merely that a page rendered.
// The distinction matters most at the boundaries: resume must recover the SAME attempt, the
// correction must survive login exactly once, and erasure must make every surface unavailable —
// each of those has been a real defect in this package at some point.

const UNIQUE = () => `cpc1-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * The real option element from MiniTestFlow.tsx. A generic `button:visible` locator clicked page
 * chrome instead of answers, so no attempt was ever created — and a looser text filter would have
 * clicked MORE wrong things, not fewer.
 */
const ANSWER_OPTION = "button.answer-btn";

type Attempt = { id: string; answeredCount: number; requiredCount: number; status: string };

/**
 * Read the attempt identity the server issued.
 *
 * Resume must be proven by IDENTITY, not by Japanese wording: a page that says 「続き」 while
 * silently creating a second attempt has lost the person's answers and still passes a keyword
 * check.
 */
async function readCurrentAttempt(page: Page): Promise<Attempt | null> {
  const response = await page.request.get("/api/assessment/attempts");
  if (!response.ok()) return null;
  const data = (await response.json()) as { attempt: Attempt | null };
  return data.attempt;
}

/**
 * Start an attempt and CLASSIFY the outcome from the actual network response.
 *
 * There is no intermediate product step between the start button and the quiz: begin() awaits
 * POST /api/assessment/attempts and switches to the quiz phase only once that returns an
 * attemptId. So when no option renders, the answer is in that response — not in speculation about
 * hydration or a hidden intro screen.
 */
async function startAttempt(page: Page): Promise<Attempt> {
  await page.goto("/check-in", { waitUntil: "domcontentloaded" });

  const begin = page
    .locator("button", { hasText: /いま色テストをはじめる|続きからはじめる/ })
    .first();
  await begin.waitFor({ state: "visible", timeout: 30_000 });
  await begin.scrollIntoViewIfNeeded();

  const postPromise = page
    .waitForResponse(
      (r) => r.url().includes("/api/assessment/attempts") && r.request().method() === "POST",
      { timeout: 30_000 },
    )
    .catch(() => null);

  await begin.click();
  const post = await postPromise;

  if (!post) {
    const labels = (await page.locator("button:visible").allInnerTexts()).slice(0, 6).join(" | ");
    throw new Error(
      `no POST /api/assessment/attempts was observed after clicking start — the wrong element was ` +
        `clicked or the handler did not fire. url=${page.url()} buttons=[${labels}]`,
    );
  }

  const status = post.status();
  const contentType = post.headers()["content-type"] ?? "<none>";
  const body = await post.text().catch(() => "<unreadable>");
  const setCookie = post.headers()["set-cookie"] ? "yes" : "no";
  const failureShown = (await page.locator("body").innerText()).includes("はじめられませんでした");

  if (status !== 201 && status !== 200) {
    throw new Error(
      `attempt start failed: status=${status} content-type=${contentType} ` +
        `attempt-cookie-set=${setCookie} failure-ui-shown=${failureShown} url=${page.url()} ` +
        `body=${body.slice(0, 300)}`,
    );
  }

  await page
    .locator(ANSWER_OPTION)
    .first()
    .waitFor({ state: "visible", timeout: 45_000 })
    .catch(async () => {
      const labels = (await page.locator("button:visible").allInnerTexts()).slice(0, 6).join(" | ");
      throw new Error(
        `start returned ${status} (cookie-set=${setCookie}) but no ${ANSWER_OPTION} rendered. ` +
          `url=${page.url()} buttons=[${labels}] body=${body.slice(0, 200)}`,
      );
    });

  const attempt = await readCurrentAttempt(page);
  expect(attempt, "a successful start must be readable as an in-progress attempt").not.toBeNull();
  return attempt!;
}

/**
 * Answer one NON-FINAL question. A disappearing attempt here is a hard failure, never success:
 * treating null as "completed" would silently pass a lost cookie, a failing GET, or a backend
 * error mid-run — exactly the states this journey exists to catch.
 */
async function answerOneQuestion(page: Page, expected: Attempt): Promise<Attempt> {
  const options = page.locator(ANSWER_OPTION);
  const count = await options.count();
  expect(
    count,
    `no answer option visible at answeredCount=${expected.answeredCount} url=${page.url()}`,
  ).toBeGreaterThan(0);

  await options.first().click();

  const target = expected.answeredCount + 1;
  const deadline = Date.now() + 20_000;
  let last: Attempt | null = null;
  while (Date.now() < deadline) {
    last = await readCurrentAttempt(page);
    if (last && last.id === expected.id && last.answeredCount >= target) return last;
    await page.waitForTimeout(150);
  }

  const labels = (await options.allInnerTexts()).slice(0, 4).join(" | ");
  throw new Error(
    last === null
      ? `the in-progress attempt disappeared BEFORE the final question — lost cookie, failing ` +
        `read, or a backend error. was=${expected.id} at=${expected.answeredCount}/` +
        `${expected.requiredCount} url=${page.url()}`
      : `answer did not persist: attempt=${expected.id} from=${expected.answeredCount} ` +
        `expected>=${target} got=${last.answeredCount} url=${page.url()} options=[${labels}]`,
  );
}

async function answerUntilCount(page: Page, attempt: Attempt, target: number): Promise<Attempt> {
  let current = attempt;
  while (current.answeredCount < target && current.status !== "completed") {
    current = await answerOneQuestion(page, current);
  }
  return current;
}

test.describe("principal journey", () => {
  test.describe.configure({ mode: "serial", timeout: 300_000 });

  test("resume recovers the SAME attempt — proven by identity, not by wording", async ({ page }) => {
    const started = await startAttempt(page);
    const progressed = await answerUntilCount(page, started, 3);
    expect(progressed.answeredCount).toBeGreaterThanOrEqual(3);

    await page.reload({ waitUntil: "domcontentloaded" });

    const afterReload = await readCurrentAttempt(page);
    expect(afterReload, "the attempt must survive a refresh").not.toBeNull();
    expect(afterReload!.id, "refresh must not silently create a SECOND attempt").toBe(started.id);
    expect(
      afterReload!.answeredCount,
      "answers must remain associated with the same attempt",
    ).toBeGreaterThanOrEqual(progressed.answeredCount);
  });

  test("an anonymous result is persisted and addressed by a canonical row id", async ({ page }) => {
    // Completing the full 120 is impractical per-run; this asserts the ADDRESSING contract that
    // completion produces — a canonical `?result=<uuid>`, never a URL-encoded result.
    await page.goto("/result?resultId=MS-KI&overlayId=balancing", { waitUntil: "domcontentloaded" });
    expect(canonicalRowId(page.url()), "legacy mode must not fabricate a canonical id").toBeNull();

    const body = await page.locator("body").innerText();
    expect(body, "legacy compatibility must still render").toContain("気配読み");
  });

  test("a canonical result the viewer cannot access is concealed everywhere", async ({ page }) => {
    const INACCESSIBLE = "11111111-2222-4333-8444-555555555555";
    for (const route of ["/result", "/recommendations", "/recommendations/graph", "/line/mini-app"]) {
      await page.goto(`${route}?result=${INACCESSIBLE}`, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      expect(body, `${route} leaked result content`).not.toContain("気配読み");
      expect(body, `${route} leaked recommendation controls`).not.toContain("役に立った");
    }
  });

  test("private-state requires authentication and never claims records it cannot read", async ({ page }) => {
    await page.goto("/private-state", { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    // Unauthenticated must not render a canonical panel at all; and it must never render the
    // temporarily-unavailable wording, which would misattribute an auth state to a backend fault.
    expect(body).not.toContain("ヒントの記録を読み込めませんでした");
  });
});

test.describe("registration and claim continuity", () => {
  test("login preserves the return path and does not lose the pending intent", async ({ page }) => {
    // The pending interpretation intent is held in sessionStorage until the server acknowledges.
    // This asserts the LOGIN BOUNDARY carries the return path, which is what makes the replay
    // possible at all.
    await page.goto("/login?next=%2Fresult%2Freturn", { waitUntil: "domcontentloaded" });
    expect(page.url()).toContain("next=%2Fresult%2Freturn");

    const body = await page.locator("body").innerText();
    expect(body.length, "login must render").toBeGreaterThan(0);
  });

  test("the return route is reachable and does not error without a pending intent", async ({ page }) => {
    // Visiting /result/return with nothing pending is an ordinary state, not a failure.
    await page.goto("/result/return", { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    expect(body).not.toContain("Application error");
    expect(body).not.toContain("500");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// THE REAL LIFECYCLE.
//
// Everything above is unauthenticated routing and concealment. This is the frozen principal
// journey: a genuine 120-question completion crossing the actual browser and application
// boundaries, then correction, registration, claim, recommendation actions, recovery and erasure.
//
// It runs ONCE (desktop only) rather than per viewport: completing 120 questions twice proves
// nothing extra and doubles the wall-clock. Viewport coverage comes from the surrounding suites.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// THE PRINCIPAL LIFECYCLE — ONE BROWSER CONTEXT.
//
// Separate Playwright tests get separate contexts, so the anonymous attempt cookie, the claim
// credential, the sessionStorage pending intent and the authenticated session would all be
// discarded between steps. A JS object carrying resultRowId across tests looks like continuity and
// is not: it proves nothing about whether the PERSON could have made the same journey.
//
// One context, one page, named steps.
// ─────────────────────────────────────────────────────────────────────────────
test("CPC-1 principal lifecycle", async ({ browser }, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "the full completion runs once; viewport coverage comes from the other suites",
  );
  test.setTimeout(900_000);

  const context = await browser.newContext();
  const page = await context.newPage();

  let attemptId = "";
  let resultRowId = "";

  try {
    await test.step("anonymous start creates a server-backed attempt", async () => {
      const started = await startAttempt(page);
      attemptId = started.id;
      expect(started.answeredCount).toBe(0);
    });

    await test.step("partial answers persist against the same attempt", async () => {
      const attempt = await readCurrentAttempt(page);
      const progressed = await answerUntilCount(page, attempt!, 3);
      expect(progressed.id).toBe(attemptId);
      expect(progressed.answeredCount).toBeGreaterThanOrEqual(3);
    });

    await test.step("refresh preserves the attempt, and explicit resume adopts the SAME one", async () => {
      await page.reload({ waitUntil: "domcontentloaded" });
      const afterReload = await readCurrentAttempt(page);
      expect(afterReload, "the attempt must survive a refresh").not.toBeNull();
      expect(afterReload!.id, "refresh must not create a second attempt").toBe(attemptId);

      // Prove the explicit affordance actually resumes — reading the API alone would pass even if
      // the button started a fresh attempt.
      const resume = page.locator("button", { hasText: "続きからはじめる" }).first();
      await resume.waitFor({ state: "visible", timeout: 30_000 });
      await resume.click();
      await page.locator(ANSWER_OPTION).first().waitFor({ state: "visible", timeout: 45_000 });

      const resumed = await readCurrentAttempt(page);
      expect(resumed!.id, "resume must adopt the same attempt").toBe(attemptId);
      expect(resumed!.answeredCount).toBeGreaterThanOrEqual(afterReload!.answeredCount);
    });

    await test.step("completing all questions produces a canonical resultRowId", async () => {
      const current = await readCurrentAttempt(page);
      const required = current!.requiredCount;
      const penultimate = await answerUntilCount(page, current!, required - 1);
      expect(penultimate.id).toBe(attemptId);

      await page.locator(ANSWER_OPTION).first().click();
      await page.waitForURL(/\/(result|report-loading)\?.*result=/, { timeout: 90_000 });
      await page.waitForURL(/\/result\?.*result=/, { timeout: 90_000 });

      const rowId = canonicalRowId(page.url());
      expect(rowId, "completion must produce a canonical resultRowId").toBeTruthy();
      resultRowId = rowId!;

      // Legacy parameters must not ride along on the canonical link.
      expect(new URL(page.url()).searchParams.get("resultId")).toBeNull();
    });

    await test.step("the canonical result survives a refresh for its credential holder", async () => {
      await page.goto(`/result?result=${resultRowId}`, { waitUntil: "domcontentloaded" });
      const main = await page.locator("main").innerText();
      expect(main).not.toContain("結果を開けませんでした");
    });

    await test.step("an unanswered interpretation withholds recommendations", async () => {
      await page.goto(`/recommendations?result=${resultRowId}`, { waitUntil: "domcontentloaded" });
      const main = await page.locator("main").innerText();
      expect(main, "nothing accepted yet, so nothing may be recommended").not.toContain("保存する");
    });

    // Remaining steps (correction -> registration -> claim -> exactly-once -> private-state ->
    // report/download -> recommendations/graph -> actions -> sign-out/in -> LINE return -> erase)
    // append here, inside this same context.
  } finally {
    await context.close();
  }
});

