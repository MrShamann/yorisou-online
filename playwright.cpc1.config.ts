import { defineConfig, devices } from "@playwright/test";

// CPC-1 acceptance — runs against the REAL hosted Preview deployment, per the frozen contract's
// "not mocks, not local-only". PLAYWRIGHT_BASE_URL must be the Vercel Preview URL for this branch.
export default defineConfig({
  testDir: "./tests/cpc1-acceptance",
  timeout: 60_000,
  retries: 0,
  workers: 2,
  reporter: [["list"]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    trace: "retain-on-failure",
  },
  projects: [
    // Reachability runs FIRST and gates everything else: this suite is mostly negative
    // assertions, which pass trivially against an auth wall.
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
  // A bypass header, when supplied, is applied to every request.
  ...(process.env.VERCEL_AUTOMATION_BYPASS_SECRET
    ? {
        use: {
          baseURL: process.env.PLAYWRIGHT_BASE_URL,
          trace: "retain-on-failure" as const,
          extraHTTPHeaders: {
            "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
            "x-vercel-set-bypass-cookie": "true",
          },
        },
      }
    : {}),
});
