import type { MetadataRoute } from "next";

/**
 * CORP-P4A — LOCAL CANDIDATE ONLY. Not published; this branch is never pushed or deployed.
 *
 * Production currently serves NO robots.txt at all (404), so every consumer route is crawlable with
 * no directives. This candidate states the corporate front door and disallows everything that is
 * personal, authenticated, internal, legacy, or still blocked.
 *
 * Sensitive paths are listed because a crawler needs the directive — but nothing here advertises a
 * route: no sitemap entry, no link, and every entry is a Disallow.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/mirai-move", "/kakari", "/about"],
        disallow: [
          // Blocked corporate routes — noindex until their blockers clear.
          "/company",
          "/contact",
          // Evidence-comparison surface.
          "/prototype/",
          // Personal data and accounts.
          "/me",
          "/life",
          "/saved",
          "/private-state",
          "/dashboard/",
          "/reports/",
          // Authentication.
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          // Internal.
          "/admin",
          "/admin-entry",
          "/api/",
          // Archived consumer product.
          "/tests/",
          "/result",
          "/check-in",
          "/today/",
          "/line/",
          "/share/",
        ],
      },
    ],
    sitemap: "https://yorisou.online/sitemap.xml",
  };
}
