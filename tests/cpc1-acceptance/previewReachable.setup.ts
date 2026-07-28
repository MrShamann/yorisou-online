import { expect, test as setup } from "@playwright/test";

// CPC-1 acceptance — GUARD AGAINST VACUOUS PASSES.
//
// The Preview deployment sits behind Vercel Deployment Protection (SSO). Without a bypass, every
// request redirects to `vercel.com/sso-api` and the page body is a Vercel login screen.
//
// That is dangerous for this suite specifically: most acceptance assertions are NEGATIVE — "the
// archetype name must not appear", "no private request is issued", "the CTA must not render". All
// of those hold trivially on a login page. A run against a gated deployment would report a wall of
// green while proving nothing at all.
//
// So reachability is asserted first, and it fails loudly rather than letting the suite pass for
// the wrong reason.
setup("hosted Preview is reachable and is the application, not an auth wall", async ({ page }) => {
  const base = process.env.PLAYWRIGHT_BASE_URL;
  expect(base, "PLAYWRIGHT_BASE_URL must be the hosted Preview URL").toBeTruthy();

  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  const finalUrl = page.url();

  expect(
    finalUrl.includes("vercel.com/sso") || finalUrl.includes("/sso-api"),
    `Preview is behind Deployment Protection (redirected to ${finalUrl}). Supply a bypass ` +
      `(x-vercel-protection-bypass / VERCEL_AUTOMATION_BYPASS_SECRET) or disable protection for ` +
      `this Preview. Running the suite without it produces vacuous passes.`,
  ).toBe(false);

  expect(response?.status(), "Preview must serve the application").toBeLessThan(400);

  const body = await page.locator("body").innerText();
  expect(body, "Preview served a Vercel auth page, not the product").not.toContain("Log in to Vercel");
});
