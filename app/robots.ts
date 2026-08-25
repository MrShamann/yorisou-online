import type { MetadataRoute } from "next";

import { CORPORATE_BLOCKED, CORPORATE_INDEXABLE } from "@/lib/corporate/routePolicy";

/**
 * CORP-P4AR1 — LOCAL CANDIDATE ONLY. Not published; this branch is never pushed or deployed.
 *
 * CORP-P4A used `Allow: /` plus a hand-written Disallow list, and claimed everything personal,
 * authenticated, internal and legacy was covered. That claim was FALSE: the repository has 135 page
 * routes and the list named roughly twenty, so ~28 legacy public routes (/ai-advisor, /business,
 * /concept, /en, /explore, /insights, /methodology, /notice, /partners, /pilot, /privacy, /services,
 * /support, /terms, /vision and more) were crawlable. The rule was also written as `/tests/` — a
 * prefix form that does not necessarily cover the exact path `/tests`.
 *
 * This candidate inverts the default. `Disallow: /` blocks everything, and only the four corporate
 * routes are re-allowed. A route omitted from any list is therefore BLOCKED, not exposed — the
 * failure mode is safe. `Allow: /$` is anchored so it matches the root exactly and does not reopen
 * the whole tree.
 *
 * The sensitive groups are still listed explicitly below. They are redundant under `Disallow: /`,
 * and that is the point: the policy stays legible, and a future edit that loosens the default
 * cannot silently expose them.
 */
export default function robots(): MetadataRoute.Robots {
  const allow = [
    "/$", // anchored: the root only, never a prefix for everything beneath it
    ...CORPORATE_INDEXABLE.filter((r) => r !== "/"),
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow,
        disallow: [
          "/", // default-deny; anything not explicitly allowed above is blocked
          // Explicit and redundant, in both exact and descendant form.
          ...CORPORATE_BLOCKED,
          "/prototype",
          "/prototype/",
          "/me",
          "/life",
          "/life/",
          "/saved",
          "/private-state",
          "/dashboard",
          "/dashboard/",
          "/reports",
          "/reports/",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/admin",
          "/admin/",
          "/admin-entry",
          "/dev",
          "/dev/",
          "/api",
          "/api/",
          "/tests",
          "/tests/",
          "/result",
          "/check-in",
          "/today",
          "/today/",
          "/line",
          "/line/",
          "/share",
          "/share/",
          "/connect",
          "/connect/",
          "/progress",
        ],
      },
    ],
    sitemap: "https://yorisou.online/sitemap.xml",
  };
}
