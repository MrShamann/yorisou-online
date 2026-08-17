import { expect, test, type Page } from "@playwright/test";

import {
  LIGHT_REFLECTION_QUESTIONS,
  POSTMORTEM_REFLECTION_QUESTIONS,
} from "@/lib/life-os/contract";

// OSF-1 §7/§8 — the reflection flows driven through a real browser, against a real database.
//
// WHY THIS EXISTS WHEN THE CONTRACT, STORE, DATABASE AND AUDIT ARE ALREADY TESTED.
//
// Every one of those layers has been correct while the product was still broken. The mode bug that
// this package fixed is the proof: the contract had both question sets, the column existed, the RPC
// stored what it was given, and the audit wrote what it was told — and every postmortem was still
// recorded as `light`, because the ONE thing nobody tested was a person filling in the form and the
// value surviving the trip. That gap is exactly the width of this file.
//
// So this drives the browser and then looks in PostgreSQL. Not at the screen it just drove — at the
// row. A UI test that asserts its own optimistic state proves the renderer agrees with itself.
//
// Run through the stack harness, which supplies PostgreSQL, PostgREST, a production build and the
// database credentials this file reads:
//
//   OSF1_STACK_SPEC=tests/smoke/osf1-life-reflection-e2e.spec.ts bash tests/life-os/fullstack-a11y.sh

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3211";
const REST = process.env.OSF1_REST_URL || "";
const SERVICE_KEY = process.env.OSF1_SERVICE_KEY || "";

test.skip(
  !process.env.OSF1_FULLSTACK_A11Y,
  "runs only inside the disposable stack — the harness supplies the database and the app",
);

/** Read straight from PostgREST. The point of this file is to not take the UI's word for anything. */
async function db<T>(page: Page, path: string): Promise<T[]> {
  expect(REST, "the harness must export OSF1_REST_URL").not.toBe("");
  const response = await page.request.get(`${REST}/rest/v1/${path}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  expect(response.status(), `database read failed: ${path}`).toBe(200);
  return (await response.json()) as T[];
}

/**
 * Call the app's own API from INSIDE the browser.
 *
 * `page.request` is a separate cookie jar from the page, so a session established by the register
 * call is not necessarily the session `page.request` sends — which shows up as a 401 that looks like
 * a broken gate. The in-page fetch carries the browser's cookies, which are the ones a person has.
 */
async function api(page: Page, path: string): Promise<{ status: number; body: string }> {
  return page.evaluate(async (target) => {
    const response = await fetch(target, { headers: { "Content-Type": "application/json" } });
    return { status: response.status, body: await response.text() };
  }, path);
}

async function registerAndSignIn(page: Page, email: string): Promise<string> {
  const res = await page.request.post(`${BASE}/api/auth/register`, {
    data: { name: "OSF1振り返り検証", email, password: "Osf1-Str0ng-Pass!", city: "Tokyo", role: "self" },
  });
  expect([200, 201]).toContain(res.status());
  await page.goto(`${BASE}/life`, { waitUntil: "domcontentloaded" });
  // Verified rather than assumed: a 404 here would be the feature gate, and every assertion below
  // would then pass against a sign-in wall.
  const check = await api(page, "/api/life/state");
  expect(check.status, `session not usable in the browser: ${check.body}`).toBe(200);
  return email;
}

/** Walk the one-question-per-screen flow, typing a distinct value into every textarea it shows. */
async function walkFlow(page: Page, values: string[]): Promise<number> {
  let screens = 0;
  for (let i = 0; i < values.length + 4; i += 1) {
    const boxes = page.locator("textarea");
    const count = await boxes.count();
    if (count === 0) break;
    for (let b = 0; b < count; b += 1) {
      // One distinct value per input, so a field written into the wrong column is visible as the
      // wrong sentence rather than as a plausible one.
      await boxes.nth(b).fill(values[Math.min(screens, values.length - 1)]);
    }
    screens += 1;
    const next = page.getByRole("button", { name: "次へ" });
    if (await next.isVisible().catch(() => false)) {
      await next.click();
      continue;
    }
    const finish = page.getByRole("button", { name: "書き終える" });
    expect(await finish.isVisible(), "neither 次へ nor 書き終える was available").toBe(true);
    await finish.click();
    break;
  }
  return screens;
}

test.describe("OSF-1 reflection flows, end to end", () => {
  test("light reflection: five questions, stored as light, deep-only columns untouched", async ({ page }) => {
    test.setTimeout(120_000);
    const email = `osf1-light-${Date.now()}@example.test`;
    await registerAndSignIn(page, email);

    await page.goto(`${BASE}/life/reflect`, { waitUntil: "domcontentloaded" });
    // NOT a sign-in wall, and not a 404 dressed as an empty page.
    await expect(page.getByText("サインイン")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: LIGHT_REFLECTION_QUESTIONS[0].prompt })).toBeVisible();
    // The counter is the flow telling us how many questions it believes it has. Read it from the
    // page rather than from the contract, so a UI that disagrees with the contract fails here.
    await expect(page.getByText(`1 / ${LIGHT_REFLECTION_QUESTIONS.length}`)).toBeVisible();

    const stamp = Date.now();
    const values = LIGHT_REFLECTION_QUESTIONS.map((_, i) => `light-${stamp}-q${i + 1}`);
    const screens = await walkFlow(page, values);
    expect(screens, "the light flow must present exactly five screens").toBe(5);

    await expect(page.getByText("書き終わりました。")).toBeVisible({ timeout: 30_000 });

    // THE ROW, not the screen.
    const rows = await db<Record<string, string | null>>(
      page,
      `yorisou_life_reflections?select=*&what_happened=eq.${encodeURIComponent(values[0])}`,
    );
    expect(rows.length, "the reflection did not reach the database").toBe(1);
    const row = rows[0];
    expect(row.mode, "a light reflection must be stored as light").toBe("light");
    expect(row.felt).toBe(values[1]);
    expect(row.tried).toBe(values[2]);
    expect(row.what_followed).toBe(values[3]);
    expect(row.next_time).toBe(values[4]);
    // The deep-only columns must be untouched by this flow. If the mode plumbing ever regressed so
    // that the postmortem question set were served here, these would hold text.
    for (const deepOnly of ["goal_at_the_time", "information_at_hand", "options_considered", "decision_made"]) {
      expect(row[deepOnly], `${deepOnly} must stay null for a light reflection`).toBeNull();
    }

    // THE AUDIT: written inside the mutation's transaction, with the mode as its reason.
    const events = await db<Record<string, unknown>>(
      page,
      `yorisou_life_os_audit_events?select=*&entity_ref=eq.${row.id}&action=eq.yorisou.life.reflection.created`,
    );
    expect(events.length, "the transactional audit row is missing").toBe(1);
    expect(events[0].reason, "the audit reason carries the mode").toBe("light");
    expect(String(events[0].actor_fingerprint)).toMatch(/^[0-9a-f]{64}$/);
    // No sentence the person wrote may appear anywhere in the audit payload.
    const payload = JSON.stringify(events[0]);
    for (const value of values) {
      expect(payload.includes(value), "the audit leaked reflection content").toBe(false);
    }

    // Persisted and visible after a reload, through the timeline rather than optimistic state.
    await page.goto(`${BASE}/life/timeline?filter=REFLECTION`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText(values[0]).first()).toBeVisible();
  });

  test("deep reflection: seven questions, stored as postmortem, decision context persisted", async ({ page }) => {
    test.setTimeout(120_000);
    await registerAndSignIn(page, `osf1-deep-${Date.now()}@example.test`);

    await page.goto(`${BASE}/life/reflect?mode=postmortem`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("サインイン")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: POSTMORTEM_REFLECTION_QUESTIONS[0].prompt })).toBeVisible();
    await expect(page.getByText(`1 / ${POSTMORTEM_REFLECTION_QUESTIONS.length}`)).toBeVisible();
    // The user-facing label is natural Japanese. "Postmortem" is an internal identifier and must not
    // be on screen.
    await expect(page.getByText("Postmortem")).toHaveCount(0);

    const stamp = Date.now();
    const values = POSTMORTEM_REFLECTION_QUESTIONS.map((_, i) => `deep-${stamp}-q${i + 1}`);
    const screens = await walkFlow(page, values);
    expect(screens, "the deep flow must present exactly seven screens").toBe(7);

    await expect(page.getByText("書き終わりました。")).toBeVisible({ timeout: 30_000 });

    const rows = await db<Record<string, string | null>>(
      page,
      `yorisou_life_reflections?select=*&what_happened=eq.${encodeURIComponent(values[0])}`,
    );
    expect(rows.length, "the deep reflection did not reach the database").toBe(1);
    const row = rows[0];
    // THE ASSERTION THIS WHOLE FILE EXISTS FOR. If the mode is dropped anywhere between the browser
    // and the row, it defaults to light and this fails.
    expect(row.mode, "a deep reflection must NOT be stored as light").toBe("postmortem");
    expect(row.goal_at_the_time).toBe(values[1]);
    expect(row.information_at_hand).toBe(values[2]);
    expect(row.options_considered).toBe(values[3]);
    expect(row.decision_made).toBe(values[4]);
    expect(row.what_followed).toBe(values[5]);
    expect(row.next_time).toBe(values[6]);
    // The light-only columns are not asked by this flow.
    expect(row.felt).toBeNull();
    expect(row.tried).toBeNull();

    const events = await db<Record<string, unknown>>(
      page,
      `yorisou_life_os_audit_events?select=*&entity_ref=eq.${row.id}&action=eq.yorisou.life.reflection.created`,
    );
    expect(events.length).toBe(1);
    expect(events[0].reason, "the audit must record postmortem, not light").toBe("postmortem");

    // The timeline distinguishes it: it appears under じっくり振り返る and NOT under 振り返り.
    await page.goto(`${BASE}/life/timeline?filter=POSTMORTEM`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText(values[0]).first()).toBeVisible();
    await page.goto(`${BASE}/life/timeline?filter=REFLECTION`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText(values[0])).toHaveCount(0);
  });

  test("a reflection is not readable by anyone else", async ({ page, browser }) => {
    test.setTimeout(120_000);
    await registerAndSignIn(page, `osf1-owner-${Date.now()}@example.test`);
    await page.goto(`${BASE}/life/reflect`, { waitUntil: "domcontentloaded" });
    const secret = `private-${Date.now()}`;
    await walkFlow(page, [secret, secret, secret, secret, secret]);
    await expect(page.getByText("書き終わりました。")).toBeVisible({ timeout: 30_000 });

    // A different person, a different browser context, a real second session.
    const other = await browser.newContext();
    const otherPage = await other.newPage();
    await registerAndSignIn(otherPage, `osf1-other-${Date.now()}@example.test`);
    for (const path of ["/life", "/life/timeline", "/life/timeline?filter=REFLECTION"]) {
      await otherPage.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      await expect(otherPage.getByText(secret)).toHaveCount(0);
    }
    const theirs = await api(otherPage, "/api/life/timeline?filter=REFLECTION");
    expect(theirs.status).toBe(200);
    expect(theirs.body.includes(secret), "another person's reflection reached the API").toBe(false);
    await other.close();
  });
});
