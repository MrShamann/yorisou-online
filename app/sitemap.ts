import type { MetadataRoute } from "next";

import { CORPORATE_INDEXABLE, isSitemapEligible } from "@/lib/corporate/routePolicy";

/**
 * CORP-P4AR1 — LOCAL CANDIDATE ONLY. Not published.
 *
 * Derived from the route policy rather than hand-listed, so the sitemap cannot disagree with robots
 * or the shell. `/company` and `/contact` are excluded by classification while
 * COMPANY_REGISTRATION_SOURCE_REQUIRED and VERIFIED_CORPORATE_CONTACT_REQUIRED remain open — a
 * sitemap entry is a request to index.
 *
 * `lastModified` is deliberately omitted: a fabricated date is a fabricated claim.
 */
const BASE = "https://yorisou.online";

export default function sitemap(): MetadataRoute.Sitemap {
  return CORPORATE_INDEXABLE.filter(isSitemapEligible).map((route) => ({
    url: `${BASE}${route === "/" ? "/" : route}`,
    changeFrequency: route === "/" ? ("monthly" as const) : ("monthly" as const),
    priority: route === "/" ? 1 : route === "/about" ? 0.6 : 0.8,
  }));
}
