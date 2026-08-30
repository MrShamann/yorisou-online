import { DEFAULT_LOCALE, isPublished } from "./locales";
import type { SiteCopy } from "./types";

/**
 * CORP-P5R2 — locale content resolution.
 *
 * Each locale is a DYNAMIC import, so a visitor's bundle carries one language rather than 21. That
 * is what keeps global localisation from becoming a performance problem.
 *
 * There is deliberately NO silent fallback for a published locale: if a published locale's content
 * file is missing, this throws rather than quietly rendering Japanese inside another language. The
 * completeness test catches that before Founder review, which is exactly the failure the acceptance
 * gate names.
 */
const LOADERS: Record<string, () => Promise<{ default?: SiteCopy } & Record<string, unknown>>> = {
  ja: () => import("./content/ja"),
  en: () => import("./content/en"),
  "zh-CN": () => import("./content/zh-CN"),
  "zh-TW": () => import("./content/zh-TW"),
  ko: () => import("./content/ko"),
  es: () => import("./content/es"),
  fr: () => import("./content/fr"),
  de: () => import("./content/de"),
  pt: () => import("./content/pt"),
  it: () => import("./content/it"),
  nl: () => import("./content/nl"),
  ar: () => import("./content/ar"),
  hi: () => import("./content/hi"),
  th: () => import("./content/th"),
  vi: () => import("./content/vi"),
  id: () => import("./content/id"),
  ms: () => import("./content/ms"),
  tr: () => import("./content/tr"),
  pl: () => import("./content/pl"),
  ru: () => import("./content/ru"),
  uk: () => import("./content/uk"),
};

export async function getCopy(locale: string): Promise<SiteCopy> {
  const code = isPublished(locale) ? locale : DEFAULT_LOCALE;
  const load = LOADERS[code];
  if (!load) throw new Error(`No content loader registered for published locale "${code}"`);
  const mod = await load();
  // Each file exports a single const named after its locale (hyphens become underscores).
  const key = code.replace("-", "_");
  const copy = (mod as Record<string, unknown>)[key] ?? mod.default;
  if (!copy) throw new Error(`Content file for "${code}" does not export "${key}"`);
  return copy as SiteCopy;
}

export const CONTENT_LOCALES = Object.keys(LOADERS);
