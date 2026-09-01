import type { Metadata } from "next";

import { getCopy } from "../i18n";
import { localeEntry, ogLocale, resolveLocale } from "../i18n/locales";

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Resolve the active locale from the request. Never inferred from browser, IP, device or geography. */
export async function localeFrom(searchParams: SearchParams): Promise<string> {
  return resolveLocale((await searchParams).lang);
}

type MetaKey =
  | "home"
  | "ventures"
  | "miraiMove"
  | "kakari"
  | "chigamo"
  | "about"
  | "buildWithUs"
  | "company"
  | "contact";

/**
 * The canonical path for each corporate route. Written out rather than derived from the request,
 * because the request carries `?lang=` and the canonical must not.
 */
const CANONICAL_PATH: Record<MetaKey, string> = {
  home: "/",
  ventures: "/ventures",
  miraiMove: "/mirai-move",
  kakari: "/kakari",
  chigamo: "/chigamo",
  about: "/about",
  buildWithUs: "/build-with-us",
  company: "/company",
  contact: "/contact",
};


/**
 * Locale-aware metadata for a corporate route.
 *
 * CORP-v1.4 — a CANONICAL is now emitted, and hreflang deliberately is not.
 *
 * All twenty-one locales are reachable, and every one of them is reached through `?lang=` on the
 * same path. That produces twenty-one URLs per route with substantially the same subject, which is
 * exactly the shape a crawler resolves badly. The canonical points every locale variant at the
 * clean path, so the parameterised URLs consolidate rather than compete.
 *
 * hreflang is NOT emitted, and the reason is worth stating so nobody adds it as an obvious
 * improvement. `robots.txt` renders each Allow rule `$`-anchored, and Google matches the anchor
 * against the path AND query string — so `/about?lang=en` does not match `Allow: /about$`, and the
 * default `Disallow: /` applies. Every `?lang=` URL is crawl-blocked today. An hreflang set is a
 * set of pointers TO those URLs: emitting one would advertise twenty-one addresses a crawler is
 * forbidden to fetch, which is worse than emitting none.
 *
 * hreflang becomes correct at the same moment path routing does, and not before. The migration is
 * specified in CORP_V14_BUSINESS_MODEL_AND_GLOBAL_LOCALE.md; it is not attempted here, because a
 * root-level locale segment would shadow 117 consumer routes and the legacy `/en` tree.
 */
export async function localeMetadata(searchParams: SearchParams, key: MetaKey): Promise<Metadata> {
  const locale = await localeFrom(searchParams);
  const copy = await getCopy(locale);
  const m = copy.meta[key];
  const entry = localeEntry(locale);
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: CANONICAL_PATH[key] },
    openGraph: {
      title: m.title,
      description: m.description,
      type: "website",
      locale: ogLocale(entry.code),
      siteName: "Yorisou",
      url: CANONICAL_PATH[key],
    },
  };
}
