import type { MetadataRoute } from "next";

/**
 * CORP-P4A — LOCAL CANDIDATE ONLY. Not published.
 *
 * Four routes. `/company` and `/contact` are deliberately EXCLUDED while
 * COMPANY_REGISTRATION_SOURCE_REQUIRED and VERIFIED_CORPORATE_CONTACT_REQUIRED remain open — a
 * sitemap entry is a request to index, and neither page should be indexed yet.
 *
 * No personal, authenticated, admin, LINE, sharing, prototype or legacy consumer route appears.
 * `lastModified` is intentionally omitted: a fabricated date is a fabricated claim.
 */
const BASE = "https://yorisou.online";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/mirai-move`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/kakari`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.6 },
  ];
}
