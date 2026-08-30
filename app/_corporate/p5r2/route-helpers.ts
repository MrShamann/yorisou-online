import type { Metadata } from "next";

import { getCopy } from "../i18n";
import { localeEntry, ogLocale, resolveLocale } from "../i18n/locales";

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Resolve the active locale from the request. Never inferred from browser, IP, device or geography. */
export async function localeFrom(searchParams: SearchParams): Promise<string> {
  return resolveLocale((await searchParams).lang);
}

type MetaKey = "home" | "miraiMove" | "kakari" | "about" | "company" | "contact";

/**
 * Locale-aware metadata for a corporate route.
 *
 * `/?lang=xx` is NOT presented as a canonical or indexable Production URL: no canonical tag and no
 * hreflang set is emitted, because the Production doctrine is `/` for Japanese and `/{locale}/...`
 * for everything else, and that routing is deferred. robots.ts and the sitemap are untouched.
 */
export async function localeMetadata(searchParams: SearchParams, key: MetaKey): Promise<Metadata> {
  const locale = await localeFrom(searchParams);
  const copy = await getCopy(locale);
  const m = copy.meta[key];
  const entry = localeEntry(locale);
  return {
    title: m.title,
    description: m.description,
    openGraph: {
      title: m.title,
      description: m.description,
      type: "website",
      locale: ogLocale(entry.code),
      siteName: "Yorisou",
    },
  };
}
