import { defineConfig, devices } from "@playwright/test";

// CPC-1 acceptance — runs against the REAL hosted Preview deployment, per the frozen contract's
// "not mocks, not local-only".
//
// The bypass header must live in the ONE `use` block. A previous version added it via a
// conditional object spread placed after `projects`, which never took effect — so `request.*`
// calls hit the Deployment Protection wall and reported product failures for API routes that were
// in fact answering correctly (401/404). A harness defect that manufactures product failures is
// worse than no test at all.
const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testDir: "./tests/cpc1-acceptance",
  timeout: 60_000,
  retries: 0,
  workers: 2,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    trace: "retain-on-failure",
    ...(bypass
      ? {
          // ONLY the bypass header. `x-vercel-set-bypass-cookie` makes Vercel answer 307 with a
          // Set-Cookie instead of serving the route, which surfaced as "the API returned 307" and
          // read like a product defect — the routes were answering 401 correctly all along.
          extraHTTPHeaders: { "x-vercel-protection-bypass": bypass },
        }
      : {}),
  },
  projects: [
    // Identity runs FIRST and gates everything else: this suite is mostly negative assertions,
    // which pass trivially against an auth wall, and a stale deployment makes every product
    // failure unattributable.
    { name: "identity", testMatch: /previewReachable\.setup\.ts/ },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["identity"],
      testIgnore: /previewReachable\.setup\.ts/,
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 5"] },
      dependencies: ["identity"],
      testIgnore: /previewReachable\.setup\.ts/,
    },
  ],
});
