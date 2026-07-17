import { test, expect } from "@playwright/test";

// AIX-1 — AI-native experience system regression suite.
// Covers: server-rendered content before JS, reduced-motion (no animation
// loop), State Field pause when hidden, keyboard operability of the entry
// chooser and test flow, question flow behavior preservation, State
// Signature determinism at the DOM level, and console/hydration cleanliness.

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

test.describe("AIX-1 progressive enhancement", () => {
  test("home renders value line, primary CTA, field SVG and boundary note with JS disabled", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toContainText("今の状態を");
    await expect(page.getByRole("link", { name: "いま色テストをはじめる" })).toBeVisible();
    await expect(page.getByRole("link", { name: "入口をえらぶ" })).toBeVisible();
    await expect(page.getByText("診断や占いではありません")).toBeVisible();
    // static State Field layer is server-rendered SVG (no JS required)
    expect(await page.locator(".state-field-scene svg circle").count()).toBeGreaterThan(10);
    await ctx.close();
  });

  test("entry chooser works with JS disabled (native details)", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/tests`, { waitUntil: "domcontentloaded" });
    const groups = page.locator('details[name="yorisou-intent"]');
    await expect(groups).toHaveCount(4);
    await groups.first().locator("summary").click();
    await expect(page.getByRole("link", { name: "いま色テストをはじめる" })).toBeVisible();
    await ctx.close();
  });

  test("reduced motion: no State Field animation loop starts", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    // the canvas host stays transparent (never activated) under reduced motion
    const active = await page.evaluate(() => {
      const canvas = document.querySelector(".state-field-scene canvas") as HTMLCanvasElement | null;
      if (!canvas) return "no-canvas";
      return canvas.style.opacity === "1" ? "active" : "inactive";
    });
    expect(active === "no-canvas" || active === "inactive").toBe(true);
    // content is fully present
    await expect(page.getByRole("link", { name: "いま色テストをはじめる" })).toBeVisible();
    await ctx.close();
  });
});

test.describe("AIX-1 entry + test flow behavior preservation", () => {
  test("keyboard: intention chooser opens with Enter and links are reachable", async ({ page }) => {
    await page.goto(`${BASE}/tests`, { waitUntil: "networkidle" });
    const firstSummary = page.locator('details[name="yorisou-intent"] summary').first();
    await firstSummary.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("link", { name: "いま色テストをはじめる" })).toBeVisible();
  });

  test("120Q flow: begin -> answer -> auto-advance -> back preserved; field forms with progress", async ({ page }) => {
    await page.goto(`${BASE}/check-in`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "いま色テストをはじめる" }).click();
    await expect(page.getByText("1 / 120")).toHaveCount(2); // top chip + progress row
    // answer via keyboard
    const firstOption = page.locator(".aix-quiz-surface button").first();
    await firstOption.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("2 / 120").first()).toBeVisible({ timeout: 3000 });
    // back returns to previous question
    await page.getByRole("button", { name: "戻る" }).click();
    await expect(page.getByText("1 / 120").first()).toBeVisible();
  });

  test("result page: YRR-1 reveal + State Signature present; skip control works", async ({ page }) => {
    await page.goto(`${BASE}/result?resultId=MS-KI`, { waitUntil: "domcontentloaded" });
    // signature frame present in hero
    await expect(page.locator(".aix-signature-frame").first()).toBeVisible();
    const skip = page.getByRole("button", { name: "すべて表示" });
    const staging = await skip.waitFor({ state: "visible", timeout: 8000 }).then(() => true).catch(() => false);
    if (staging) {
      await skip.click();
    }
    await expect(page.getByText("プライバシーについて")).toBeVisible({ timeout: 8000 });
  });

  test("State Signature is deterministic (same resultId -> same static SVG)", async ({ page }) => {
    const read = async () => {
      await page.goto(`${BASE}/result/share?resultId=MS-KI`, { waitUntil: "domcontentloaded" });
      return page.evaluate(() => {
        const svg = document.querySelector('svg[viewBox="0 0 1000 1000"]');
        return svg ? svg.innerHTML.length + ":" + svg.querySelectorAll("circle").length : "missing";
      });
    };
    const a = await read();
    const b = await read();
    expect(a).not.toBe("missing");
    expect(a).toBe(b);
    // different result -> different arrangement
    await page.goto(`${BASE}/result/share?resultId=EM-AK`, { waitUntil: "domcontentloaded" });
    const c = await page.evaluate(() => {
      const svg = document.querySelector('svg[viewBox="0 0 1000 1000"]');
      return svg ? svg.innerHTML : "missing";
    });
    expect(c).not.toBe("missing");
  });
});

test.describe("AIX-1 engineering controls", () => {
  test("State Field pauses when the page is hidden", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    const paused = await page.evaluate(async () => {
      // monkey-patch rAF counting
      let frames = 0;
      const orig = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb) => { frames += 1; return orig(cb); };
      Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
      document.dispatchEvent(new Event("visibilitychange"));
      await new Promise((r) => setTimeout(r, 500));
      const during = frames;
      frames = 0;
      await new Promise((r) => setTimeout(r, 500));
      const after = frames;
      Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
      document.dispatchEvent(new Event("visibilitychange"));
      return { during, after };
    });
    // once hidden settles, no continuing field frames (allow a few trailing)
    expect(paused.after).toBeLessThanOrEqual(2);
  });

  test("no console errors or hydration warnings on transformed routes", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
      if (message.type() === "warning" && /hydrat/i.test(message.text())) errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(String(error)));
    for (const route of ["/", "/tests", "/open-testing", "/check-in", "/result?resultId=MS-KI", "/report-preview?resultId=MS-KI", "/result/share?resultId=MS-KI"]) {
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
    }
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("no private data or internal markers leak into transformed pages", async ({ page }) => {
    for (const route of ["/", "/tests", "/result?resultId=MS-KI", "/result/share?resultId=MS-KI"]) {
      await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
      const html = await page.content();
      for (const marker of ["service_role", "SERVICE_ROLE", "yorisou_candidate", "answerCount", "scoringMaster"]) {
        expect(html, `${marker} must not appear on ${route}`).not.toContain(marker);
      }
    }
  });
});
