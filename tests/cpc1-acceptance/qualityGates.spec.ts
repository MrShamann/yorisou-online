import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// CPC-1 acceptance — quality gates from the frozen contract.
//
// "mobile + desktop smoke · keyboard · reduced motion · zero serious/critical axe · Japanese copy
//  review". Both viewport projects run this file, so desktop and mobile are covered by the matrix
// rather than by duplicated tests.
//
// Accessibility results are reported as MEASUREMENTS. Passing here means "no serious or critical
// violations were detected by axe on these routes", which is not the same as "accessible", and the
// contract is explicit that it must never be described as certification.

const PUBLIC_ROUTES = ["/", "/check-in", "/tests", "/line/mini-app"];
const RESULT_ROUTES = ["/result?resultId=MS-KI&overlayId=balancing"];

test.describe("accessibility measurements", () => {
  for (const route of [...PUBLIC_ROUTES, ...RESULT_ROUTES]) {
    test(`no serious or critical axe violations on ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      const summary = blocking
        .map((v) => `${v.impact}:${v.id} (${v.nodes.length} nodes) — ${v.help}`)
        .join("\n");
      expect(blocking, `axe violations on ${route}:\n${summary}`).toHaveLength(0);
    });
  }
});

test.describe("keyboard operability", () => {
  test("the check-in entry is reachable and operable by keyboard alone", async ({ page }) => {
    await page.goto("/check-in", { waitUntil: "domcontentloaded" });

    // Walk the tab order until an interactive control takes focus; a surface where nothing is
    // reachable by keyboard is unusable regardless of how it looks.
    let focusedTag = "";
    for (let i = 0; i < 25; i += 1) {
      await page.keyboard.press("Tab");
      focusedTag = await page.evaluate(() => document.activeElement?.tagName ?? "");
      if (["BUTTON", "A", "INPUT"].includes(focusedTag)) break;
    }
    expect(["BUTTON", "A", "INPUT"]).toContain(focusedTag);
  });

  test("focus is visible on the focused control", async ({ page }) => {
    await page.goto("/check-in", { waitUntil: "domcontentloaded" });
    for (let i = 0; i < 25; i += 1) {
      await page.keyboard.press("Tab");
      const tag = await page.evaluate(() => document.activeElement?.tagName ?? "");
      if (["BUTTON", "A", "INPUT"].includes(tag)) break;
    }
    const hasVisibleFocus = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const s = getComputedStyle(el);
      // Any of these is an acceptable focus signal; none of them is a failure to look for.
      return (
        s.outlineStyle !== "none" ||
        s.boxShadow !== "none" ||
        Number.parseFloat(s.outlineWidth || "0") > 0
      );
    });
    expect(hasVisibleFocus, "focused control must be visually identifiable").toBe(true);
  });
});

test.describe("reduced motion", () => {
  test("the result surface renders fully with prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/result?resultId=MS-KI&overlayId=balancing", { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    // Content must not depend on an animation having played — the reveal is progressive
    // enhancement, not a gate on reading your own result.
    expect(body).toContain("気配読み");
  });
});

test.describe("Japanese copy", () => {
  test("no placeholder, engineering or pilot wording reaches a public surface", async ({ page }) => {
    const forbidden = ["TODO", "FIXME", "lorem", "Lorem", "準備中です", "undefined", "NaN", "[object Object]"];
    for (const route of PUBLIC_ROUTES) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      for (const token of forbidden) {
        expect(body, `${route} contains ${token}`).not.toContain(token);
      }
    }
  });

  test("no surface claims a diagnosis", async ({ page }) => {
    for (const route of [...PUBLIC_ROUTES, ...RESULT_ROUTES]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      // 診断 is permitted only where it appears inside an explicit denial.
      const claims = body.includes("診断") && !body.includes("診断ではなく") && !body.includes("診断ではありません");
      expect(claims, `${route} claims a diagnosis`).toBe(false);
    }
  });
});
