import { test, expect, type Page } from "@playwright/test";

// AIX-2 — Visual Reset regression suite (replaces the AIX-1 smoke specs, whose
// light-theme structure no longer exists). Covers: progressive enhancement
// (server content before JS, static depth SVG, reduced-motion / no-JS / no-
// WebGL fallback), the depth-field pause controls, keyboard operability,
// 120Q flow behavior preservation, deterministic Depth Signature, dark
// contrast (axe-independent), the 診断 policy, and no-leak / console cleanliness.

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const AA_NORMAL = 4.5;

async function contrast(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return null;
    const parse = (c: string) => {
      const m = c.match(/rgba?\(([\d.]+), ([\d.]+), ([\d.]+)/);
      return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
    };
    const lum = (rgb: number[]) => {
      const f = (v: number) => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
      return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
    };
    let node: HTMLElement | null = el, bg: number[] | null = null;
    while (node) {
      const cs = getComputedStyle(node);
      const p = parse(cs.backgroundColor);
      const a = cs.backgroundColor.match(/rgba\([^)]*, ([\d.]+)\)/);
      if (p && (!a || Number(a[1]) === 1)) { bg = p; break; }
      node = node.parentElement;
    }
    if (!bg) bg = [10, 19, 16]; // aix2 ink
    const fg = parse(getComputedStyle(el).color);
    if (!fg) return null;
    const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a);
    return { ratio: Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100, color: getComputedStyle(el).color, text: (el.textContent || "").trim().slice(0, 24) };
  }, selector);
}

test.describe("AIX-2 progressive enhancement", () => {
  test("home renders value line, primary CTA, boundary note + static depth SVG with JS disabled", async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toContainText("今を");
    await expect(page.getByRole("link", { name: "いま色テストをはじめる" })).toBeVisible();
    await expect(page.getByRole("link", { name: "入口をえらぶ" })).toBeVisible();
    // non-diagnosis clarity present (embedded in the hero lead)
    await expect(page.getByText("固定タイプの診断ではなく")).toBeVisible();
    // static depth field is server-rendered SVG (no JS / no WebGL)
    expect(await page.locator(".depth-scene svg circle").count()).toBeGreaterThan(20);
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

  test("reduced motion: WebGL depth field never activates; static stays", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    const state = await page.evaluate(() => ({
      canvasActive: document.querySelector(".depth-scene")?.getAttribute("data-canvas-active") ?? null,
      svgCircles: document.querySelectorAll(".depth-scene svg circle").length,
    }));
    expect(state.canvasActive).toBeNull();
    expect(state.svgCircles).toBeGreaterThan(20);
    await expect(page.getByRole("link", { name: "いま色テストをはじめる" })).toBeVisible();
    await ctx.close();
  });
});

test.describe("AIX-2 flow behavior preservation", () => {
  test("keyboard: intention chooser opens with Enter", async ({ page }) => {
    await page.goto(`${BASE}/tests`, { waitUntil: "networkidle" });
    await page.locator('details[name="yorisou-intent"] summary').first().focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("link", { name: "いま色テストをはじめる" })).toBeVisible();
  });

  test("120Q flow: begin -> answer -> auto-advance -> back preserved", async ({ page }) => {
    await page.goto(`${BASE}/check-in`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "いま色テストをはじめる" }).first().click();
    await expect(page.getByText("1 / 120").first()).toBeVisible();
    const firstOption = page.locator(".aix2-quiz .aix2-answer").first();
    await firstOption.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("2 / 120").first()).toBeVisible({ timeout: 3000 });
    await page.getByRole("button", { name: "戻る" }).click();
    await expect(page.getByText("1 / 120").first()).toBeVisible();
  });

  test("result: Depth Signature + YRR-1 reveal; skip control works", async ({ page }) => {
    await page.goto(`${BASE}/result?resultId=MS-KI`, { waitUntil: "domcontentloaded" });
    await expect(page.locator(".aix2-sig-frame svg circle").first()).toBeVisible();
    const skip = page.getByRole("button", { name: "すべて表示" });
    const staging = await skip.waitFor({ state: "visible", timeout: 8000 }).then(() => true).catch(() => false);
    if (staging) await skip.click();
    await expect(page.getByText("プライバシーについて")).toBeVisible({ timeout: 8000 });
  });

  test("Depth Signature is deterministic (same resultId -> same static SVG)", async ({ page }) => {
    const read = async () => {
      await page.goto(`${BASE}/result/share?resultId=MS-KI`, { waitUntil: "domcontentloaded" });
      return page.evaluate(() => {
        const svg = document.querySelector('svg[viewBox="0 0 1000 1000"]');
        return svg ? svg.querySelectorAll("circle").length + ":" + svg.innerHTML.length : "missing";
      });
    };
    const a = await read();
    const b = await read();
    expect(a).not.toBe("missing");
    expect(a).toBe(b);
    await page.goto(`${BASE}/result/share?resultId=EM-AK`, { waitUntil: "domcontentloaded" });
    const c = await page.evaluate(() => document.querySelector('svg[viewBox="0 0 1000 1000"]')?.innerHTML ?? "missing");
    expect(c).not.toBe("missing");
  });
});

test.describe("AIX-2 dark contrast (axe-independent, WCAG AA)", () => {
  test.use({ reducedMotion: "reduce" });
  test("home quiet tones meet 4.5:1 against the dark ground", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    for (const [name, sel] of [
      ["lead", ".aix2-lead"],
      ["journey body", ".aix2-journey-body"],
      ["muted", ".aix2-mut"],
    ] as const) {
      const m = await contrast(page, sel);
      expect(m, `${name} exists`).not.toBeNull();
      expect(m!.ratio, `${name} ${JSON.stringify(m)}`).toBeGreaterThanOrEqual(AA_NORMAL);
    }
  });

  test("marketing surfaces do not self-describe as 診断 (disclaimers excepted)", async ({ page }) => {
    for (const route of ["/", "/tests", "/open-testing"]) {
      await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
      const text = await page.evaluate(() => document.body.innerText);
      const occurrences = text.split("診断").length - 1;
      const disclaimers = (text.match(/診断[^。]{0,10}(?:ではありません|ではなく)|・診断・|医療・診断/g) ?? []).length;
      expect(occurrences, `${route}: 診断 outside disclaimers`).toBe(disclaimers);
    }
  });
});

test.describe("AIX-2 engineering controls", () => {
  test("depth field pauses when the page is hidden", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    const paused = await page.evaluate(async () => {
      let frames = 0;
      const orig = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb) => { frames += 1; return orig(cb); };
      Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
      document.dispatchEvent(new Event("visibilitychange"));
      await new Promise((r) => setTimeout(r, 500));
      frames = 0;
      await new Promise((r) => setTimeout(r, 500));
      const after = frames;
      Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
      document.dispatchEvent(new Event("visibilitychange"));
      return after;
    });
    expect(paused).toBeLessThanOrEqual(2);
  });

  test("no console errors or hydration warnings on transformed routes", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); if (m.type() === "warning" && /hydrat/i.test(m.text())) errors.push(m.text()); });
    page.on("pageerror", (e) => errors.push(String(e)));
    for (const route of ["/", "/tests", "/open-testing", "/check-in", "/result?resultId=MS-KI", "/report-preview?resultId=MS-KI", "/result/share?resultId=MS-KI"]) {
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
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
