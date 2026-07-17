import { test, expect, type Page } from "@playwright/test";

// AIX-1B Finding A regression — deterministic WCAG contrast checks for the
// quiet AIX text tones.
//
// WHY THIS EXISTS (and why a generic axe pass is not enough): the AIX scenes
// paint their surfaces with CSS background-image gradients and layered field
// scenes. axe-core cannot resolve an element's effective background in that
// situation, so it files the nodes under `incomplete` ("background color
// could not be determined due to a background gradient") instead of
// `violations` — machine-verified on the pre-fix build: 0 violations with
// 55/29/19 incomplete nodes on /, /open-testing, /tests while the whisper
// row rendered at 2.86:1 and the boundary line at 3.52:1. No gate asserted
// on the incomplete bucket, so the defect passed. This test therefore
// computes the ratio directly from computed styles against the resolved
// opaque ancestor background (worst-case: the body base #F8F4EC), which is
// deterministic and independent of axe's background resolution.

const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const AA_NORMAL = 4.5;

// Tones removed by AIX-1B; reintroducing them on AIX surfaces is a regression.
const BANNED_TONE_SELECTOR = '[class*="text-[#8A8078]"], [class*="text-[#8A7E78]"]';

async function measureContrast(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return null;
    const parse = (c: string) => {
      const m = c.match(/rgba?\(([\d.]+), ([\d.]+), ([\d.]+)/);
      return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
    };
    const lum = (rgb: number[]) => {
      const f = (v: number) => {
        const c = v / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
    };
    // resolved opaque ancestor background = the worst-case (darkest) surface
    // the text can sit on; gradient overlays in the AIX scenes are all
    // lighter than the body base, so this bound is conservative.
    let node: HTMLElement | null = el;
    let bg: number[] | null = null;
    while (node) {
      const parsedBg = parse(getComputedStyle(node).backgroundColor);
      const alphaMatch = getComputedStyle(node).backgroundColor.match(/rgba\([^)]*, ([\d.]+)\)/);
      const alpha = alphaMatch ? Number(alphaMatch[1]) : 1;
      if (parsedBg && alpha === 1) { bg = parsedBg; break; }
      node = node.parentElement;
    }
    if (!bg) bg = [255, 255, 255];
    const fg = parse(getComputedStyle(el).color);
    if (!fg) return null;
    const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a);
    return {
      ratio: Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100,
      color: getComputedStyle(el).color,
      fontSize: getComputedStyle(el).fontSize,
      text: (el.textContent || "").trim().slice(0, 30),
    };
  }, selector);
}

// reduced-motion → the field canvas never activates → deterministic layers
test.use({ reducedMotion: "reduce" });

test.describe("AIX-1B contrast regression (deterministic, axe-independent)", () => {
  test("home quiet tones meet 4.5:1 against the resolved background", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    const targets: [string, string][] = [
      ["whisper row", ".aix-whisper"],
      ["boundary line", 'p[class*="text-[12px]"][class*="text-[#756B63]"]'],
      ["layer stage label", 'p[class*="text-[11px]"][class*="text-[#756B63]"]'],
      ["layer note", 'p[class*="mt-6"][class*="text-[#756B63]"]'],
    ];
    for (const [name, selector] of targets) {
      const m = await measureContrast(page, selector);
      expect(m, `${name} (${selector}) must exist`).not.toBeNull();
      expect(m!.ratio, `${name} ratio ${JSON.stringify(m)}`).toBeGreaterThanOrEqual(AA_NORMAL);
    }
    // banned legacy tones must not reappear on this surface
    expect(await page.locator(BANNED_TONE_SELECTOR).count()).toBe(0);
    // token contract: --whisper must not regress to the failing value
    const whisper = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--whisper").trim(),
    );
    expect(whisper.toLowerCase()).not.toBe("#8d938c");
  });

  test("open-testing hero note meets 4.5:1", async ({ page }) => {
    await page.goto(`${BASE}/open-testing`, { waitUntil: "networkidle" });
    const m = await measureContrast(page, 'p[class*="text-[#756B63]"]');
    expect(m).not.toBeNull();
    expect(m!.ratio, JSON.stringify(m)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(await page.locator(BANNED_TONE_SELECTOR).count()).toBe(0);
  });

  test("intention chooser quiet tones meet 4.5:1 INSIDE opened panels", async ({ page }) => {
    // AIX-1A lesson: collapsed <details> content is invisible to
    // innerText/axe-style scans — so this test opens every panel first.
    await page.goto(`${BASE}/tests`, { waitUntil: "networkidle" });
    const panels = page.locator('details[name="yorisou-intent"]');
    const count = await panels.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i += 1) {
      await panels.nth(i).evaluate((d) => ((d as HTMLDetailsElement).open = true));
    }
    const meta = await measureContrast(page, 'p[class*="text-[11px]"][class*="text-[#756B63]"]');
    expect(meta, "item meta").not.toBeNull();
    expect(meta!.ratio, JSON.stringify(meta)).toBeGreaterThanOrEqual(AA_NORMAL);
    const boundary = await measureContrast(page, 'p[class*="text-[12px]"][class*="text-[#756B63]"]');
    expect(boundary, "boundary note").not.toBeNull();
    expect(boundary!.ratio, JSON.stringify(boundary)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(await page.locator(BANNED_TONE_SELECTOR).count()).toBe(0);
  });
});
