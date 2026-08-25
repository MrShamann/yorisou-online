import type { MetadataRoute } from "next";

import { CORPORATE_BLOCKED, CORPORATE_INDEXABLE } from "@/lib/corporate/routePolicy";

/**
 * CORP-P4AR2 — LOCAL CANDIDATE ONLY. Not published; this branch is never pushed or deployed.
 *
 * WHAT WAS WRONG AT 29fce73. The rules rendered as:
 *
 *     Allow: /$   Allow: /mirai-move   Allow: /kakari   Allow: /about   Disallow: /
 *
 * and CORP-P4AR1 claimed all four Allow rules were anchored. Only the first one was. Under the
 * matching rules Google implements, a rule without a trailing `$` is a PATH PREFIX, and where an
 * Allow and a Disallow both match, the LONGER rule wins. So `/mirai-move` matched — and therefore
 * allowed — `/mirai-move-old`, `/mirai-move/anything` and every other path beginning with those
 * characters, beating the one-character `Disallow: /`. The same held for `/kakari` (so
 * `/kakari-preview`) and `/about` (so `/about-old`). The default-deny was real, but three of the
 * four exceptions to it were open-ended subtrees rather than single pages.
 *
 * Every Allow is now anchored with `$`, so each one matches exactly one path and nothing beneath or
 * beyond it. `Disallow: /` remains the default, so a path that is not one of these four exact
 * strings is blocked.
 *
 * TWO CONSEQUENCES, ACCEPTED DELIBERATELY:
 *
 *  - `$` anchors the end of the matched value, and the matched value includes the query string.
 *    `/about?utm_source=x` therefore does NOT match `Allow: /about$` and is not crawlable. This is
 *    the intended direction: the canonical corporate URLs carry no query, and a blocked tracking
 *    variant costs nothing, whereas an unanchored rule reopens the subtree.
 *  - `/about/` likewise does not match. Next.js serves a 308 from the trailing-slash form to the
 *    canonical form, which IS allowed, so the canonical page stays reachable.
 *
 * The sensitive groups below are redundant under `Disallow: /` and are kept on purpose: the policy
 * stays legible, and a future edit that loosens the default cannot silently expose them.
 *
 * NOTE ON WHAT THIS FILE DOES AND DOES NOT DO. Every rule here controls CRAWLING only. robots.txt
 * cannot make a page noindex; a blocked URL can still be indexed from external links, and a blocked
 * crawler never sees a `noindex` directive on the page it was forbidden to fetch. Rendered index
 * directives are a separate mechanism, measured separately in
 * docs/yorisou/corporate/CORP_P4AR2_RENDERED_INDEXABILITY_CENSUS.md.
 */
export default function robots(): MetadataRoute.Robots {
  // Anchored with `$`: each rule matches that exact path and nothing else. Derived from the policy
  // module so robots.txt and the sitemap cannot name different routes.
  const allow = CORPORATE_INDEXABLE.map((r) => `${r}$`);

  return {
    rules: [
      {
        userAgent: "*",
        allow,
        disallow: [
          "/", // default-deny; anything not exactly allowed above is blocked
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
