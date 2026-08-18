import { expect, test, type Page } from "@playwright/test";

import { LIGHT_REFLECTION_QUESTIONS } from "@/lib/life-os/contract";

// OSF-1 §10 — a REAL forced audit failure, in a real browser, and then the recovery.
//
// WHY A DATABASE TEST IS NOT ENOUGH HERE.
//
// tests/life-os/audit-failure.sh proves the seven transactional RPCs roll back and retry cleanly. It
// proves nothing about what a person sees. The shipped trade-off is that a save can genuinely fail
// with nothing written — that is the price of the transactional class, accepted deliberately — so the
// failure screen is a state production will reach, and the failure modes that matter are all
// interface ones:
//
//   a "saved" screen over a save that did not happen        (the worst: silent data loss)
//   a redirect away from the text that was never stored     (the same loss, one click later)
//   an empty form after the error                           (the person retypes everything, or leaves)
//   a stack trace, an SQL error, a status code              (frightening, and useless)
//   an automatic retry loop                                 (a broken audit table under load)
//
// None of those can be caught by asserting on a row. This drives the browser, and then reads
// PostgreSQL to check the row is genuinely absent — because "the screen said it failed" and "nothing
// was written" are two different claims and the second is the one the copy makes.
//
//   OSF1_STACK_SPEC=tests/smoke/osf1-audit-failure-e2e.spec.ts \
//   OSF1_STACK_FAULT_INJECTION=1 bash tests/life-os/fullstack-a11y.sh

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3211";
const REST = process.env.OSF1_REST_URL || "";
const SERVICE_KEY = process.env.OSF1_SERVICE_KEY || "";

test.skip(
  !process.env.OSF1_FULLSTACK_A11Y,
  "runs only inside the disposable stack — the harness supplies the database, the app and the fault switch",
);

async function db<T>(page: Page, path: string): Promise<T[]> {
  expect(REST, "the harness must export OSF1_REST_URL").not.toBe("");
  const response = await page.request.get(`${REST}/rest/v1/${path}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  expect(response.status(), `database read failed: ${path}`).toBe(200);
  return (await response.json()) as T[];
}

/**
 * Arm or disarm the forced audit failure.
 *
 * The function is created by the harness, exists only in the disposable cluster, and is in no
 * migration — see the OSF1_STACK_FAULT_INJECTION block in tests/life-os/fullstack-a11y.sh. The
 * response is CHECKED: a 404 here means the harness was run without fault injection, and every
 * assertion below would then pass against a working save, which is exactly the vacuous green this
 * file exists to produce evidence against.
 */
async function fault(page: Page, enabled: boolean): Promise<void> {
  const response = await page.request.post(`${REST}/rest/v1/rpc/osf1_test_audit_fault`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" },
    data: { p_enabled: enabled },
  });
  expect(
    response.status(),
    "osf1_test_audit_fault is not callable — rerun with OSF1_STACK_FAULT_INJECTION=1",
  ).toBe(200);
  expect(await response.json(), "the fault switch did not report the state it was set to").toBe(enabled);
}

/**
 * The failure message's live region — scoped INSIDE `main`, and that scoping is load-bearing.
 *
 * Next's App Router appends its own route announcer to the body as `<next-route-announcer>` with
 * `role="alert"`, and it is present on every page and empty almost all of the time. A bare
 * `getByRole("alert")` therefore matches immediately, passes `toBeVisible()`, and yields "" — which
 * is exactly how the first run of this file failed: it asserted against Next's announcer while the
 * save was still in flight, and reported that the product had shown an empty error.
 */
function alertIn(page: Page) {
  return page.locator("main [role=alert]");
}

async function api(page: Page, path: string): Promise<{ status: number; body: string }> {
  return page.evaluate(async (target) => {
    const response = await fetch(target, { headers: { "Content-Type": "application/json" } });
    return { status: response.status, body: await response.text() };
  }, path);
}

async function registerAndSignIn(page: Page, email: string): Promise<void> {
  const res = await page.request.post(`${BASE}/api/auth/register`, {
    data: { name: "OSF1監査失敗検証", email, password: "Osf1-Str0ng-Pass!", city: "Tokyo", role: "self" },
  });
  expect([200, 201]).toContain(res.status());
  await page.goto(`${BASE}/life`, { waitUntil: "domcontentloaded" });
  const check = await api(page, "/api/life/state");
  expect(check.status, `session not usable in the browser: ${check.body}`).toBe(200);
}

test.describe("OSF-1 transactional audit failure, end to end", () => {
  test("a forced audit failure loses nothing, says so calmly, and the retry saves exactly once", async ({ page }) => {
    test.setTimeout(180_000);
    await registerAndSignIn(page, `osf1-auditfail-${Date.now()}@example.test`);

    const stamp = Date.now();
    const values = LIGHT_REFLECTION_QUESTIONS.map((_, i) => `auditfail-${stamp}-q${i + 1}`);

    // Counted as a DELTA rather than an absolute, so this holds whatever else the run has already
    // done. An absolute of zero is only true while this happens to be the first test in the file.
    const eventsBefore = (
      await db<Record<string, unknown>>(page, "yorisou_life_os_audit_events?select=id&action=eq.yorisou.life.reflection.created")
    ).length;

    // ── The fault, armed before a single character is typed ────────────────────
    await fault(page, true);

    await page.goto(`${BASE}/life/reflect`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: LIGHT_REFLECTION_QUESTIONS[0].prompt })).toBeVisible();

    // Walk all five screens, then finish. Typed one field at a time so each answer is distinct and a
    // value landing in the wrong place would be visible as the wrong string.
    for (let i = 0; i < values.length; i += 1) {
      await page.locator("textarea").first().fill(values[i]);
      if (i < values.length - 1) {
        await page.getByRole("button", { name: "次へ" }).click();
      }
    }
    await page.getByRole("button", { name: "書き終える" }).click();

    // ── 1. NO FALSE SUCCESS ───────────────────────────────────────────────────
    const failure = alertIn(page);
    await expect(failure).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText("書き終わりました。")).toHaveCount(0);
    await expect(page.getByText("覚えておきますか")).toHaveCount(0);

    // ── 2. NO REDIRECT ────────────────────────────────────────────────────────
    expect(new URL(page.url()).pathname, "the flow navigated away from an unsaved reflection").toBe("/life/reflect");

    // ── 3. CALM JAPANESE, AND NOTHING TECHNICAL ───────────────────────────────
    const message = (await failure.textContent()) ?? "";
    expect(message).toContain("保存できませんでした");
    expect(message).toContain("入力した内容はこの画面に残っています");
    expect(message).toContain("もう一度お試しください");
    // Whatever the internals were, none of them may be on screen. `osf1_forced_audit_failure` is the
    // literal text the trigger raised, so its absence is a real check rather than a formality.
    const body = (await page.locator("body").textContent()) ?? "";
    for (const leak of [
      "osf1_forced_audit_failure",
      "yorisou_life_os_audit_events",
      "yorisou_osf1_reflection_create",
      "PostgREST",
      "postgres",
      "http_",
      "Error:",
      "Traceback",
      "at async",
    ]) {
      expect(body.includes(leak), `the failure screen leaked "${leak}"`).toBe(false);
    }
    // A STATUS CODE IS A LEAK TOO, and a substring search for "500" is not how to find one: the
    // seeded markers carry a millisecond timestamp, so any three digits appear somewhere on the page
    // by chance — which is exactly what the first version of this check reported. The place a status
    // code would actually surface is the message, and a calm Japanese failure sentence contains no
    // digits at all, so the assertion belongs there and can be exact.
    expect(message, "the failure message contains a number — a status code or a count leaked").not.toMatch(/\d/);

    // ── 4. THE TEXT IS STILL THERE ────────────────────────────────────────────
    // The visible field first, then an earlier one — reached the way a person would reach it.
    await expect(page.locator("textarea").first()).toHaveValue(values[values.length - 1]);
    await page.getByRole("button", { name: "ひとつ戻る" }).click();
    await expect(page.locator("textarea").first()).toHaveValue(values[values.length - 2]);

    // ── 5. NOTHING WAS WRITTEN. Read from PostgreSQL, not from the screen. ─────
    const orphans = await db<Record<string, unknown>>(
      page,
      `yorisou_life_reflections?select=id&what_happened=eq.${encodeURIComponent(values[0])}`,
    );
    expect(orphans.length, "a reflection was persisted even though its audit row could not be written").toBe(0);
    const eventsMid = (
      await db<Record<string, unknown>>(page, "yorisou_life_os_audit_events?select=id&action=eq.yorisou.life.reflection.created")
    ).length;
    expect(eventsMid, "an audit event exists for a reflection that was never created").toBe(eventsBefore);

    // ── 6. NO AUTOMATIC RETRY STORM ───────────────────────────────────────────
    // Nothing in the flow retries on its own. Waiting proves it: if a retry loop existed, the failed
    // attempt would keep hitting the RPC, and with the fault still armed each attempt would leave a
    // trace in the app log — but more simply, the screen would change state on its own. It must not.
    await page.waitForTimeout(3_000);
    await expect(alertIn(page)).toBeVisible();
    await expect(page.getByText("書き終わりました。")).toHaveCount(0);

    // ── 7. RECOVERY. The fault is removed and the person presses retry. ───────
    await fault(page, false);
    const retry = page.getByRole("button", { name: "もう一度保存する" });
    await expect(retry, "there is no explicit retry action on the failure screen").toBeVisible();

    // §16 — AND IT IS REACHABLE WITHOUT A POINTER. This is the one screen where that matters most: a
    // keyboard user who cannot reach the retry has lost everything they wrote. Pressed with Enter on
    // the focused element, not clicked.
    let reached = false;
    for (let i = 0; i < 40 && !reached; i += 1) {
      await page.keyboard.press("Tab");
      reached = await page.evaluate(
        () => (document.activeElement?.textContent || "").trim() === "もう一度保存する",
      );
    }
    expect(reached, "「もう一度保存する」 was not reachable by keyboard from the failure screen").toBe(true);
    await page.keyboard.press("Enter");

    await expect(page.getByText("書き終わりました。")).toBeVisible({ timeout: 30_000 });

    // ── 8. EXACTLY ONE OF EVERYTHING ──────────────────────────────────────────
    const rows = await db<Record<string, string | null>>(
      page,
      `yorisou_life_reflections?select=*&what_happened=eq.${encodeURIComponent(values[0])}`,
    );
    expect(rows.length, "the retry did not produce exactly one reflection").toBe(1);
    const row = rows[0];
    // Every answer survived the failed attempt and reached the row on the retry — which is the whole
    // claim of "入力した内容はこの画面に残っています".
    expect(row.felt).toBe(values[1]);
    expect(row.tried).toBe(values[2]);
    expect(row.what_followed).toBe(values[3]);
    expect(row.next_time).toBe(values[4]);

    const events = await db<Record<string, unknown>>(
      page,
      `yorisou_life_os_audit_events?select=*&entity_ref=eq.${row.id}&action=eq.yorisou.life.reflection.created`,
    );
    expect(events.length, "the failed attempt left a duplicate audit event behind").toBe(1);
    const eventsAfter = (
      await db<Record<string, unknown>>(page, "yorisou_life_os_audit_events?select=id&action=eq.yorisou.life.reflection.created")
    ).length;
    expect(eventsAfter - eventsBefore, "the failure + retry produced more than one audit event").toBe(1);
  });

  test("a forced audit failure on memory confirmation stores nothing and the retry stores one", async ({ page }) => {
    test.setTimeout(180_000);
    await registerAndSignIn(page, `osf1-memfail-${Date.now()}@example.test`);

    // A reflection first, saved with the audit healthy, so there is a candidate to confirm.
    await fault(page, false);
    const stamp = Date.now();
    const values = LIGHT_REFLECTION_QUESTIONS.map((_, i) => `memfail-${stamp}-q${i + 1}`);
    await page.goto(`${BASE}/life/reflect`, { waitUntil: "domcontentloaded" });
    for (let i = 0; i < values.length; i += 1) {
      await page.locator("textarea").first().fill(values[i]);
      if (i < values.length - 1) await page.getByRole("button", { name: "次へ" }).click();
    }
    await page.getByRole("button", { name: "書き終える" }).click();
    await expect(page.getByText("書き終わりました。")).toBeVisible({ timeout: 30_000 });

    const confirm = page.getByRole("button", { name: "覚えておく" }).first();
    await expect(confirm, "no memory candidate was offered — this test would prove nothing").toBeVisible();
    const candidate = (await page.getByRole("listitem").first().textContent()) ?? "";
    expect(candidate.length, "the candidate card is empty").toBeGreaterThan(0);

    // Now break the audit and confirm.
    await fault(page, true);
    await confirm.click();

    const alert = alertIn(page);
    await expect(alert).toBeVisible({ timeout: 30_000 });
    const text = (await alert.textContent()) ?? "";
    expect(text).toContain("保存できませんでした");
    // The claim the copy makes, checked against the database rather than asserted by the screen.
    expect(text).toContain("何も残っていません");
    await expect(page.getByText("覚えておきます。")).toHaveCount(0);

    // Scoped to THIS test's marker, so the count means what it says regardless of what else ran.
    const mine = `yorisou_explicit_memories?select=id&content=like.*${stamp}*`;
    expect(
      (await db<Record<string, unknown>>(page, mine)).length,
      "a memory was stored even though its audit row could not be written",
    ).toBe(0);

    // Recovery: the same button, still there, is the retry.
    await fault(page, false);
    await confirm.click();
    await expect(page.getByText("覚えておきます。")).toBeVisible({ timeout: 30_000 });
    const after = await db<{ id: string }>(page, mine);
    expect(after.length, "the retry did not store exactly one memory").toBe(1);
    const confirmed = await db<Record<string, unknown>>(
      page,
      `yorisou_life_os_audit_events?select=id&entity_ref=eq.${after[0].id}&action=eq.yorisou.life.memory.confirmed`,
    );
    expect(confirmed.length, "the failed confirmation left a duplicate audit event").toBe(1);
  });
});
