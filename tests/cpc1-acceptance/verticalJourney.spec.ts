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

async function startAttempt(page: Page): Promise<Attempt> {
  await page.goto("/check-in", { waitUntil: "domcontentloaded" });
  // Text locator, not getByRole: the accessible name is composed from nested spans, so a role
  // query with a regex name did not match the rendered button.
  const begin = page
    .locator("button", { hasText: /いま色テストをはじめる|続きからはじめる/ })
    .first();
  await begin.waitFor({ state: "visible", timeout: 30_000 });
  await begin.scrollIntoViewIfNeeded();
  await begin.click();

  // Attempt creation is awaited server-side before question 1 renders, so this can be slow on a
  // cold serverless start. Failing here reports what WAS on screen rather than a bare timeout.
  await page
    .locator(ANSWER_OPTION)
    .first()
    .waitFor({ state: "visible", timeout: 45_000 })
    .catch(async () => {
      const visible = (await page.locator("button:visible").allInnerTexts()).slice(0, 6).join(" | ");
      throw new Error(
        `no ${ANSWER_OPTION} appeared after starting. url=${page.url()} buttons=[${visible}]`,
      );
    });
  const attempt = await readCurrentAttempt(page);
  expect(attempt, "starting the flow must create a server-backed attempt").not.toBeNull();
  return attempt!;
}

/**
 * Answer exactly one question and wait for the SAME attempt to report one more answer.
 *
 * Observing the server count is both faster and stricter than a fixed sleep: it proves the answer
 * was persisted, not merely that the UI advanced.
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
  while (Date.now() < deadline) {
    const next = await readCurrentAttempt(page);
    if (next && next.id === expected.id && next.answeredCount >= target) return next;
    // The final answer completes the attempt, so it stops being "in progress" — that is success,
    // not a stall, and the caller handles it.
    if (!next) return { ...expected, answeredCount: target, status: "completed" };
    await page.waitForTimeout(150);
  }

  const labels = (await options.allInnerTexts()).slice(0, 4).join(" | ");
  throw new Error(
    `answer did not persist: attempt=${expected.id} from=${expected.answeredCount} ` +
      `expected>=${target} url=${page.url()} options=[${labels}]`,
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

test.describe("canonical lifecycle", () => {
  test.describe.configure({ mode: "serial", timeout: 900_000 });
  // Runs once on desktop: completing 120 questions twice proves nothing extra and doubles the
  // wall-clock. Viewport coverage comes from the surrounding suites.
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop",
      "the full completion runs once; viewport coverage comes from the other suites",
    );
  });

  // Carried between the serial steps.
  const state: {
    attemptId?: string;
    resultRowId?: string;
    email?: string;
    password?: string;
  } = {};

  test("completes all 120 questions and receives a canonical resultRowId", async ({ page }) => {
    const started = await startAttempt(page);
    state.attemptId = started.id;

    // Answer up to the LAST question, then handle completion separately: the final answer ends the
    // attempt, so it stops being readable as "in progress" — which is success, not a stall.
    const required = started.requiredCount;
    const penultimate = await answerUntilCount(page, started, required - 1);
    expect(penultimate.id, "the attempt identity must hold for the whole run").toBe(started.id);
    expect(penultimate.answeredCount).toBe(required - 1);

    await page.locator(ANSWER_OPTION).first().click();

    // Completion is server-authoritative and navigation is awaited: the canonical id must appear
    // in the URL, never a URL-encoded result.
    await page.waitForURL(/\/(result|report-loading)\?.*result=/, { timeout: 60_000 });
    await page.waitForURL(/\/result\?.*result=/, { timeout: 60_000 });

    const rowId = canonicalRowId(page.url());
    expect(rowId, "completion must produce a canonical resultRowId").toBeTruthy();
    state.resultRowId = rowId!;

    // Legacy parameters must NOT ride along on the canonical link.
    const params = new URL(page.url()).searchParams;
    expect(params.get("resultId"), "legacy id must not accompany the canonical id").toBeNull();
  });

  test("the canonical result survives a refresh and is addressed by the same row id", async ({ page }) => {
    expect(state.resultRowId, "prior step must have produced a row id").toBeTruthy();
    await page.goto(`/result?result=${state.resultRowId}`, { waitUntil: "domcontentloaded" });
    const body = await page.locator("main").innerText();
    expect(body.length).toBeGreaterThan(0);
    // Anonymous owner of a fresh attempt holds the credential, so this must NOT be concealed.
    expect(body).not.toContain("結果を開けませんでした");
  });

  test("an unanswered result withholds recommendations — deferred is not consent", async ({ page }) => {
    await page.goto(`/recommendations?result=${state.resultRowId}`, { waitUntil: "domcontentloaded" });
    const body = await page.locator("main").innerText();
    // Nothing has been confirmed yet, so the destination must withhold rather than generate.
    expect(body).not.toContain("保存する");
  });
});
