/**
 * CORP-P5R2 — the canonical locale registry.
 *
 * This is the ONLY place a locale is declared. Adding a language is a registry entry plus a content
 * file; it requires no new route, no new component and no design work. There is deliberately no
 * `["ja","en"]` constant anywhere in the codebase — the site is global by architecture, not
 * bilingual with extras bolted on.
 *
 * Japanese is both the DEFAULT locale and the CANONICAL SOURCE language. Every other locale is
 * derived from the Japanese, never from another translation.
 *
 * `reviewState` is INTERNAL ONLY. It is never rendered, never serialised into the page, and never
 * exposed in metadata — a visitor must never see a token like AI_TRANSLATED. It exists so the
 * Founder report can state honestly which locales are editorially reviewed and which are machine
 * translated.
 */

export type Direction = "ltr" | "rtl";

/** Internal translation provenance. NEVER rendered. */
export type ReviewState =
  | "SOURCE_CANONICAL"
  | "AI_TRANSLATED"
  | "HUMAN_REVIEWED"
  | "FOUNDER_APPROVED";

export type LocaleEntry = {
  /** BCP 47 code. */
  code: string;
  /** English exonym, for internal listings. */
  englishName: string;
  /** Endonym — what a speaker calls their own language. This is what the selector shows. */
  nativeName: string;
  direction: Direction;
  /** Published locales appear in the selector. */
  status: "published" | "registered";
  /**
   * Whether a search engine should index this locale in Production. Preview URLs are never
   * indexable regardless; this describes the intended Production doctrine only.
   */
  seoIndexable: boolean;
  /** Which locale the copy was derived from. Always the canonical source, never another translation. */
  translationSource: string | null;
  reviewState: ReviewState;
  /** Script family — drives font stack selection and QA representative choice. */
  script: "Jpan" | "Hans" | "Hant" | "Kore" | "Latn" | "Arab" | "Deva" | "Thai" | "Cyrl";
};

export const LOCALES: readonly LocaleEntry[] = [
  { code: "ja",    englishName: "Japanese",             nativeName: "日本語",        direction: "ltr", status: "published", seoIndexable: true, translationSource: null, reviewState: "SOURCE_CANONICAL", script: "Jpan" },
  { code: "en",    englishName: "English",              nativeName: "English",       direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "HUMAN_REVIEWED", script: "Latn" },
  { code: "zh-CN", englishName: "Chinese (Simplified)", nativeName: "简体中文",      direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Hans" },
  { code: "zh-TW", englishName: "Chinese (Traditional)",nativeName: "繁體中文",      direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Hant" },
  { code: "ko",    englishName: "Korean",               nativeName: "한국어",        direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Kore" },
  { code: "es",    englishName: "Spanish",              nativeName: "Español",       direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Latn" },
  { code: "fr",    englishName: "French",               nativeName: "Français",      direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Latn" },
  { code: "de",    englishName: "German",               nativeName: "Deutsch",       direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Latn" },
  { code: "pt",    englishName: "Portuguese",           nativeName: "Português",     direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Latn" },
  { code: "it",    englishName: "Italian",              nativeName: "Italiano",      direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Latn" },
  { code: "nl",    englishName: "Dutch",                nativeName: "Nederlands",    direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Latn" },
  { code: "ar",    englishName: "Arabic",               nativeName: "العربية",        direction: "rtl", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Arab" },
  { code: "hi",    englishName: "Hindi",                nativeName: "हिन्दी",          direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Deva" },
  { code: "th",    englishName: "Thai",                 nativeName: "ไทย",           direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Thai" },
  { code: "vi",    englishName: "Vietnamese",           nativeName: "Tiếng Việt",    direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Latn" },
  { code: "id",    englishName: "Indonesian",           nativeName: "Bahasa Indonesia", direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Latn" },
  { code: "ms",    englishName: "Malay",                nativeName: "Bahasa Melayu", direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Latn" },
  { code: "tr",    englishName: "Turkish",              nativeName: "Türkçe",        direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Latn" },
  { code: "pl",    englishName: "Polish",               nativeName: "Polski",        direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Latn" },
  { code: "ru",    englishName: "Russian",              nativeName: "Русский",       direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Cyrl" },
  { code: "uk",    englishName: "Ukrainian",            nativeName: "Українська",    direction: "ltr", status: "published", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED", script: "Cyrl" },
];

export const DEFAULT_LOCALE = "ja";
export type LocaleCode = string;

export const PUBLISHED = LOCALES.filter((l) => l.status === "published");
const BY_CODE = new Map(LOCALES.map((l) => [l.code, l]));

export function localeEntry(code: string): LocaleEntry {
  return BY_CODE.get(code) ?? BY_CODE.get(DEFAULT_LOCALE)!;
}

export function isPublished(code: string): boolean {
  return BY_CODE.get(code)?.status === "published";
}

/** Resolve a requested locale. Never infers from browser, IP, device or geography. */
export function resolveLocale(raw: string | string[] | undefined): string {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v && isPublished(v) ? v : DEFAULT_LOCALE;
}

export function directionOf(code: string): Direction {
  return localeEntry(code).direction;
}

/**
 * Preview locale URL.
 *
 * Production doctrine is `/` for Japanese and `/{locale}/...` for everything else. That cannot be
 * implemented here: `/en` is an existing LEGACY CONSUMER route, and a root-level `[locale]` catch-all
 * would shadow every unknown path and re-break the corporate 404 established in CORP-P4AR1/R2. So the
 * Preview carries locale in a query parameter — collision-free, zero risk to consumer routes — and
 * the migration to path routing is specified in CORP_P5R2_ROUTING_MIGRATION.md.
 */
export function localeHref(path: string, locale: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}lang=${encodeURIComponent(locale)}`;
}

/** OG locale tag, e.g. ja_JP. */
export function ogLocale(code: string): string {
  const map: Record<string, string> = {
    ja: "ja_JP", en: "en_US", "zh-CN": "zh_CN", "zh-TW": "zh_TW", ko: "ko_KR", es: "es_ES",
    fr: "fr_FR", de: "de_DE", pt: "pt_PT", it: "it_IT", nl: "nl_NL", ar: "ar_AR", hi: "hi_IN",
    th: "th_TH", vi: "vi_VN", id: "id_ID", ms: "ms_MY", tr: "tr_TR", pl: "pl_PL", ru: "ru_RU", uk: "uk_UA",
  };
  return map[code] ?? code.replace("-", "_");
}
