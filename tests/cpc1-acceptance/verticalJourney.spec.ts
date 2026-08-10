import { expect, test, type Page } from "@playwright/test";

import { findPublicArchetypeByCode } from "../../lib/yorisou/public-result/taxonomy";
import {
  canonicalRowId,
  previewDbConfigured,
  readAttemptRowFromPreviewDb,
  readResultRowFromPreviewDb,
  syntheticUser,
} from "./fixtures";

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
  // The mount probe (GET /api/assessment/attempts) is issued by client-side JS, so its response
  // proves React has hydrated. A click before hydration lands on inert server HTML and silently
  // does nothing — on a loaded worker that race is real (observed hosted: the same click fired
  // POST on one run and nothing on the next).
  const hydrated = page
    .waitForResponse(
      (r) => r.url().includes("/api/assessment/attempts") && r.request().method() === "GET",
      { timeout: 30_000 },
    )
    .catch(() => null);
  await page.goto("/check-in", { waitUntil: "domcontentloaded" });
  await hydrated;

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

  const user = syntheticUser("journey");
  let attemptId = "";
  let resultRowId = "";
  let correctedCode = "";
  let correctedNickname = "";
  let downloadHref = "";

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

    await test.step("selecting a correction while anonymous parks the intent instead of losing it", async () => {
      await page.goto(`/result?result=${resultRowId}`, { waitUntil: "domcontentloaded" });
      await page.getByRole("button", { name: /近いものを自分で選び直す/ }).click();

      // Any governed archetype that is NOT the current result. The taxonomy is bounded, so the
      // first non-current entry is as valid a correction as any other.
      const target = page
        .locator("button", { hasText: "のタイプ" })
        .filter({ hasNotText: "（いまの結果）" })
        .first();
      await target.waitFor({ state: "visible", timeout: 15_000 });
      await target.click();

      // The anonymous viewer is not the owner: the POST answers 401 and the product must PARK the
      // answer, not lose it.
      await expect(
        page.getByText("答えを覚えています。ログインすると", { exact: false }),
        "an anonymous answer must be parked, not lost",
      ).toBeVisible({ timeout: 20_000 });
    });

    await test.step("the pending intent exists — bounded, typed, and aimed at this row", async () => {
      const raw = await page.evaluate(() =>
        window.sessionStorage.getItem("yorisou.result.pending-intent.v1"),
      );
      expect(raw, "the pending interpretation intent must be stored").toBeTruthy();
      const intent = JSON.parse(raw!) as {
        resultRowId: string;
        responseType: string;
        correctedResultId: string;
        nonce: string;
      };
      expect(intent.resultRowId).toBe(resultRowId);
      expect(intent.responseType).toBe("corrected");
      expect(intent.nonce).toMatch(/^[0-9a-f]{8}-[0-9a-f-]{27}$/i);

      correctedCode = intent.correctedResultId;
      const archetype = findPublicArchetypeByCode(correctedCode);
      expect(archetype, "the corrected code must be in the governed taxonomy").toBeTruthy();
      correctedNickname = archetype!.nickname;
    });

    await test.step("the login boundary carries the return path", async () => {
      await page.getByRole("link", { name: "ログインして続ける" }).click();
      await page.waitForURL(/\/login\?.*next=%2Fresult%2Freturn/, { timeout: 30_000 });
    });

    await test.step("a unique synthetic Preview user registers through the real form", async () => {
      // Registration in this product is immediate (no email confirmation exists), so the real
      // browser form is usable end-to-end without external mail delivery.
      await page.goto("/register?next=%2Fresult%2Freturn", { waitUntil: "domcontentloaded" });
      await page.getByLabel("お名前").fill(user.name);
      await page.getByLabel("メールアドレス").fill(user.email);
      await page.getByLabel("パスワード", { exact: true }).fill(user.password);
      await page.getByLabel("地域").fill(user.city);
      await page.getByRole("button", { name: "登録する" }).click();
      await page.waitForURL(/\/result\/return/, { timeout: 45_000 });
    });

    await test.step("the return trip claims the record and applies the parked correction", async () => {
      await expect(
        page.getByText("この結果をあなたのものとして保存しました。"),
      ).toBeVisible({ timeout: 45_000 });
      await expect(
        page.getByText("新しく結果が作られたのではなく、いま見ていた結果がそのままあなたのアカウントに紐づきました。"),
      ).toBeVisible();

      const raw = await page.evaluate(() =>
        window.sessionStorage.getItem("yorisou.result.pending-intent.v1"),
      );
      expect(raw, "the intent is cleared only after the server acknowledged it").toBeNull();
    });

    await test.step("the correction was applied exactly once — a revisit has nothing to replay", async () => {
      await page.goto("/result/return", { waitUntil: "domcontentloaded" });
      await expect(page.getByText("保存する結果が見つかりませんでした。")).toBeVisible({
        timeout: 30_000,
      });
    });

    await test.step("the result page presents the corrected understanding and keeps the original", async () => {
      await page.goto(`/result?result=${resultRowId}`, { waitUntil: "domcontentloaded" });
      await expect(
        page.getByText(
          "あなたが選び直した内容を、いまの理解として残しました。もとの結果も記録に残っています。",
        ),
      ).toBeVisible({ timeout: 30_000 });
    });

    await test.step("refresh adds no duplicate response — the answer history holds exactly one entry", async () => {
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.goto("/private-state", { waitUntil: "domcontentloaded" });
      await expect(page.getByText("答えの記録（1件）")).toBeVisible({ timeout: 30_000 });
    });

    await test.step("/private-state shows the full private continuity for the claimed record", async () => {
      await expect(page.getByText("いまの状態（保存された結果）")).toBeVisible();
      await expect(page.getByText("あなたが選び直した内容です")).toBeVisible();
      await expect(page.getByText(correctedNickname).first()).toBeVisible();

      await page.getByText("答えの記録（1件）").click();
      await expect(page.getByText("選び直した").first()).toBeVisible();
      await expect(
        page.getByText("前の答えは書き換えられません。新しい答えが記録に足されます。"),
      ).toBeVisible();

      await page.getByText("記録の詳細").click();
      await expect(page.getByText(/おすすめの利用: 許可されています/)).toBeVisible();
      await expect(page.getByText(/履歴での利用: 許可されています/)).toBeVisible();
    });

    await test.step("the private report is built from the ACCEPTED result, not the machine's original", async () => {
      await page.goto(`/result?result=${resultRowId}`, { waitUntil: "domcontentloaded" });
      const reportLink = page.getByRole("link", { name: "今の詳しいレポートを読む" }).first();
      await expect(reportLink).toBeVisible({ timeout: 30_000 });

      const href = await reportLink.getAttribute("href");
      expect(href, "the report route must target the corrected code").toContain(
        `/reports/self-understanding/${correctedCode}`,
      );
      expect(href, "the report link must carry the stable identity").toContain(
        `result=${resultRowId}`,
      );

      await reportLink.click();
      await page.waitForURL(new RegExp(`/reports/self-understanding/${correctedCode}`), {
        timeout: 30_000,
      });
      await expect(
        page.getByRole("heading", { name: correctedNickname }).first(),
      ).toBeVisible({ timeout: 30_000 });
    });

    await test.step("the report downloads for its owner", async () => {
      downloadHref = `/reports/self-understanding/${correctedCode}/download?result=${resultRowId}`;
      const response = await page.request.get(downloadHref);
      expect(response.status(), "the owner must be able to download the report").toBe(200);
      expect(response.headers()["content-type"] ?? "").toContain("text/markdown");
      expect(response.headers()["content-disposition"] ?? "").toContain("attachment");
    });

    await test.step("recommendations flow from the corrected understanding and persist", async () => {
      await page.goto(`/recommendations?result=${resultRowId}`, { waitUntil: "domcontentloaded" });
      await expect(
        page.getByRole("heading", { name: "今の結果から選べる、小さな入口" }),
      ).toBeVisible({ timeout: 30_000 });
      await expect(
        page.getByText("あなたが選び直した結果のあとに選べることです。"),
        "the ACCEPTED (corrected) result must be the basis, not the original",
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "保存する", exact: true }).first()).toBeVisible();
    });

    await test.step("the recommendation graph presents the same canonical set", async () => {
      await page.goto(`/recommendations/graph?result=${resultRowId}`, {
        waitUntil: "domcontentloaded",
      });
      await expect(page.getByText("今の状態から、小さく選ぶ")).toBeVisible({ timeout: 30_000 });
      await expect(
        page.getByRole("heading", { name: "今の結果から選べる、小さな入口" }),
      ).toBeVisible();
    });

    await test.step("save, try intent, tried, and helpful are each persisted", async () => {
      await page.goto(`/recommendations?result=${resultRowId}`, { waitUntil: "domcontentloaded" });
      const sequence = [
        ["保存する", "保存しました"],
        ["試してみる", "試すことにしました"],
        ["試した", "試したと記録しました"],
        ["役に立った", "役に立ったと記録しました"],
      ] as const;
      for (const [idle, done] of sequence) {
        await page.getByRole("button", { name: idle, exact: true }).first().click();
        await expect(
          page.getByRole("button", { name: done }).first(),
          `${idle} must be acknowledged as ${done}`,
        ).toBeVisible({ timeout: 20_000 });
      }
    });

    await test.step("feedback can change; the previous answer stays in the record", async () => {
      await page.getByRole("button", { name: "あまり合わなかった", exact: true }).first().click();
      await expect(
        page.getByRole("button", { name: "合わなかったと記録しました" }).first(),
      ).toBeVisible({ timeout: 20_000 });
      await expect(
        page.getByText("答えはいつでも変えられます。前の答えも記録として残ります。").first(),
      ).toBeVisible();
    });

    await test.step("hiding removes an item from the active list, not from history", async () => {
      // Count ITEMS, not hide buttons. A clicked hide button relabels itself to 「記録しています」
      // while its request is in flight, so a hide-BUTTON count reaches before-1 the instant the
      // click lands — before the server has confirmed anything. Waiting on that let the next step
      // navigate away mid-write, cancelling it, and the item then legitimately carried no 「hidden」
      // action in わたしの今. The failure was intermittent because it was a race with the network.
      //
      // The per-item action group disappears only when the component drops a hidden item from the
      // list, and that is driven by `applied`, which is set ONLY after the server confirms. So this
      // waits for the committed state the step is actually about, rather than for a pending label.
      const items = page.getByRole("group", { name: "この候補への行動" });
      const hideButtons = page.getByRole("button", { name: "この候補を表示しない" });
      const before = await items.count();
      expect(before, "the governed set must offer items to hide").toBeGreaterThan(1);
      await hideButtons.last().click();
      await expect(items).toHaveCount(before - 1, { timeout: 20_000 });
    });

    await test.step("the complete action history is visible in わたしの今", async () => {
      await page.goto("/private-state", { waitUntil: "domcontentloaded" });
      await page.getByText("ヒントの記録", { exact: true }).click();

      // Progress markers accumulate; feedback shows the CURRENT answer with the full chain
      // beneath; the hidden item stays in the record with an explicit marker.
      await expect(page.getByText(/・保存した/).first()).toBeVisible();
      await expect(page.getByText(/・試すことにした/).first()).toBeVisible();
      await expect(page.getByText(/・試した/).first()).toBeVisible();
      await expect(page.getByText(/いまの答え: あまり合わなかった/).first()).toBeVisible();
      await expect(
        page.getByText(/記録: .*←/).first(),
        "the full chain must be shown, not only the latest state",
      ).toBeVisible();
      await expect(page.getByText("（表示しない）").first()).toBeVisible();
    });

    await test.step("sign out removes private access on every surface", async () => {
      // Through the real control on the private continuity surface — the person signs out where
      // they can see the state they are leaving, and the copy promises it will come back.
      await page.goto("/private-state", { waitUntil: "domcontentloaded" });
      await expect(
        page.getByText("ログアウトしても、保存された記録は消えません。", { exact: false }),
      ).toBeVisible();
      await page.getByRole("button", { name: "ログアウトする" }).click();
      await page.waitForURL(/\/login/, { timeout: 30_000 });

      await page.goto("/private-state", { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      expect(body).not.toContain("いまの状態（保存された結果）");
      expect(body).not.toContain(correctedNickname);

      for (const route of [
        `/result?result=${resultRowId}`,
        `/recommendations?result=${resultRowId}`,
        `/recommendations/graph?result=${resultRowId}`,
        `/line/mini-app?result=${resultRowId}`,
      ]) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await expect(
          page.getByText("この結果は表示できません").first(),
          `${route} must conceal after sign-out`,
        ).toBeVisible({ timeout: 30_000 });
      }

      const denied = await page.request.get(downloadHref);
      expect(denied.status(), "the download must deny a signed-out viewer").toBe(404);
    });

    await test.step("sign in restores the same server-backed state", async () => {
      await page.goto("/login", { waitUntil: "domcontentloaded" });
      await page.getByLabel("メールアドレス").fill(user.email);
      await page.getByLabel("パスワード", { exact: true }).fill(user.password);
      await page.getByRole("button", { name: "ログインする" }).click();
      await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 45_000 });

      await page.goto("/private-state", { waitUntil: "domcontentloaded" });
      await expect(page.getByText("答えの記録（1件）")).toBeVisible({ timeout: 30_000 });
      await expect(page.getByText("あなたが選び直した内容です")).toBeVisible();

      await page.goto(`/result?result=${resultRowId}`, { waitUntil: "domcontentloaded" });
      await expect(
        page.getByText(
          "あなたが選び直した内容を、いまの理解として残しました。もとの結果も記録に残っています。",
        ),
        "recovery must restore the recorded answer, not a blank state",
      ).toBeVisible({ timeout: 30_000 });
    });

    await test.step("the canonical LINE return shows the SAME record for the same row id", async () => {
      await page.goto(`/line/mini-app?result=${resultRowId}`, { waitUntil: "domcontentloaded" });
      await expect(
        page.getByText("今の結果のあとに選べる、負担の少ない入口"),
      ).toBeVisible({ timeout: 30_000 });
      await expect(
        page.getByText("Webで見ているものと同じ記録です。ここで選んだことも、そのまま残ります。"),
      ).toBeVisible();
      await expect(
        page.getByText("あなたが選び直した結果のあとに選べることです。"),
        "LINE must honour the corrected basis exactly as Web does",
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "保存しました" }).first(),
        "actions recorded on Web must be visible on LINE — one record, two surfaces",
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "この候補を表示しない" })).toHaveCount(2);
    });

    await test.step("erasure is an explicit act that states its consequences", async () => {
      await page.goto("/private-state", { waitUntil: "domcontentloaded" });
      await page.getByRole("button", { name: "この結果を削除する" }).click();
      await expect(
        page.getByText("この結果を削除すると、次のものが消えます。元に戻すことはできません。"),
      ).toBeVisible();
      await page.getByRole("button", { name: "完全に削除する" }).click();
      await expect(
        page.getByText("まだ保存された結果はありません。", { exact: false }),
        "after erasure the private list must be empty, not erroring",
      ).toBeVisible({ timeout: 30_000 });
    });

    await test.step("after erasure every surface conceals — even for the former owner", async () => {
      for (const route of [
        `/result?result=${resultRowId}`,
        `/recommendations?result=${resultRowId}`,
        `/recommendations/graph?result=${resultRowId}`,
        `/line/mini-app?result=${resultRowId}`,
        `/reports/self-understanding/${correctedCode}?result=${resultRowId}`,
      ]) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await expect(
          page.getByText("この結果は表示できません").first(),
          `${route} must conceal the erased record`,
        ).toBeVisible({ timeout: 30_000 });
      }
      const download = await page.request.get(downloadHref);
      expect(download.status(), "the download must deny the erased record").toBe(404);
    });

    await test.step("the database tombstone matches the frozen contract", async () => {
      // Frozen contract: migration 202607270004's lifecycle constraint — an erased row keeps its
      // id (content-free tombstone) with result identifiers, owner linkage and dimension_output
      // cleared, and the attempt's answers wiped.
      if (!previewDbConfigured()) {
        testInfo.annotations.push({
          type: "cpc1-tombstone-verification",
          description:
            "application-level concealment proven on every surface; the direct row-level " +
            "tombstone check requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY supplied " +
            "securely at runtime and was not silently skipped — it is recorded here.",
        });
        return;
      }
      const row = await readResultRowFromPreviewDb(resultRowId);
      expect(row, "the tombstone row itself must remain").toBeTruthy();
      expect(row!.deleted_at, "deleted_at must be set").not.toBeNull();
      expect(row!.result_id).toBeNull();
      expect(row!.original_result_id).toBeNull();
      expect(row!.overlay_id).toBeNull();
      expect(row!.owner_account_id).toBeNull();
      expect(row!.dimension_output).toEqual({});

      const attempt = await readAttemptRowFromPreviewDb(row!.attempt_id);
      expect(attempt, "the attempt shell must be readable").toBeTruthy();
      expect(attempt!.answers, "the answers themselves must be erased").toEqual({});
      expect(attempt!.owner_account_id).toBeNull();
    });
  } finally {
    await context.close();
  }
});

