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

/**
 * CORP-v1.4 — TWO INDEPENDENT AXES, because conflating them cost nineteen languages their audience.
 *
 * `access` answers: may a visitor select and open this locale?
 * `reviewState` answers: has a native speaker actually read the copy?
 *
 * v1.2R1 introduced a single `status` field that tried to answer both, and the answer it gave to
 * the first question was driven by the second: nineteen complete, rendering, claim-guarded locales
 * were marked `preview_only` because nobody had reviewed them, and the language selector — which
 * filtered on that same field — silently narrowed from twenty-one languages to two. A reader in
 * Seoul or Riyadh could not reach the Korean or Arabic site at all, even though both existed and
 * rendered correctly.
 *
 * Not reviewed is a reason to be honest about the review, not a reason to be unreachable. The two
 * axes are now separate types so they cannot be collapsed again by accident.
 */

/** Can a visitor select and open this locale? */
export type AccessState =
  /** Selectable in the language selector and served on request. */
  | "public"
  /** Known to the registry, not built, not shown anywhere. */
  | "registered";

/**
 * Has this copy been read by a person, and by whom? INTERNAL ONLY — never rendered, never
 * serialised into the page, never exposed in metadata. A visitor must never see a token like
 * AI_TRANSLATED. It exists so a report can state honestly which locales are editorially reviewed.
 */
export type ReviewState =
  /** The source language everything else is derived from. */
  | "SOURCE_CANONICAL"
  /** Read and edited by the Founder or under Founder direction. Not a native-speaker review. */
  | "FOUNDER_REVIEWED"
  /** Read by a native speaker of that language. */
  | "NATIVE_REVIEWED"
  /** Machine-translated from the canonical source; no native speaker has read it yet. */
  | "AI_TRANSLATED_NATIVE_REVIEW_PENDING";

export type LocaleEntry = {
  /** BCP 47 code. */
  code: string;
  /** English exonym, for internal listings. */
  englishName: string;
  /** Endonym — what a speaker calls their own language. This is what the selector shows. */
  nativeName: string;
  direction: Direction;
  /**
   * Whether a visitor can reach this locale. Independent of whether it has been reviewed — see
   * `reviewState`. Anything that gates on review must read `reviewState`, never this.
   */
  access: AccessState;
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
  { code: "ja",    englishName: "Japanese",             nativeName: "日本語",        direction: "ltr", access: "public", seoIndexable: true, translationSource: null, reviewState: "SOURCE_CANONICAL", script: "Jpan" },
  { code: "en",    englishName: "English",              nativeName: "English",       direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "FOUNDER_REVIEWED", script: "Latn" },
  { code: "zh-CN", englishName: "Chinese (Simplified)", nativeName: "简体中文",      direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Hans" },
  { code: "zh-TW", englishName: "Chinese (Traditional)",nativeName: "繁體中文",      direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Hant" },
  { code: "ko",    englishName: "Korean",               nativeName: "한국어",        direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Kore" },
  { code: "es",    englishName: "Spanish",              nativeName: "Español",       direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Latn" },
  { code: "fr",    englishName: "French",               nativeName: "Français",      direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Latn" },
  { code: "de",    englishName: "German",               nativeName: "Deutsch",       direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Latn" },
  { code: "pt",    englishName: "Portuguese",           nativeName: "Português",     direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Latn" },
  { code: "it",    englishName: "Italian",              nativeName: "Italiano",      direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Latn" },
  { code: "nl",    englishName: "Dutch",                nativeName: "Nederlands",    direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Latn" },
  { code: "ar",    englishName: "Arabic",               nativeName: "العربية",        direction: "rtl", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Arab" },
  { code: "hi",    englishName: "Hindi",                nativeName: "हिन्दी",          direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Deva" },
  { code: "th",    englishName: "Thai",                 nativeName: "ไทย",           direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Thai" },
  { code: "vi",    englishName: "Vietnamese",           nativeName: "Tiếng Việt",    direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Latn" },
  { code: "id",    englishName: "Indonesian",           nativeName: "Bahasa Indonesia", direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Latn" },
  { code: "ms",    englishName: "Malay",                nativeName: "Bahasa Melayu", direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Latn" },
  { code: "tr",    englishName: "Turkish",              nativeName: "Türkçe",        direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Latn" },
  { code: "pl",    englishName: "Polish",               nativeName: "Polski",        direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Latn" },
  { code: "ru",    englishName: "Russian",              nativeName: "Русский",       direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Cyrl" },
  { code: "uk",    englishName: "Ukrainian",            nativeName: "Українська",    direction: "ltr", access: "public", seoIndexable: true, translationSource: "ja", reviewState: "AI_TRANSLATED_NATIVE_REVIEW_PENDING", script: "Cyrl" },
];

export const DEFAULT_LOCALE = "ja";
export type LocaleCode = string;

/**
 * Every locale a visitor can reach. This is what the language selector renders, and it is now all
 * twenty-one — the site is global by architecture, and hiding nineteen finished languages behind a
 * review gate served nobody: it did not make the copy better, and it made it unreachable.
 */
export const PUBLIC_LOCALES = LOCALES.filter((l) => l.access === "public");

/**
 * Locales a native speaker has actually read. Currently ja (the source) and en (Founder-reviewed).
 *
 * This drives HONESTY, not access. It is what a report cites when it says how much of the site has
 * been read by a person, and it is what a future native-review programme works through. It must
 * never be used to decide whether a visitor may open a page.
 */
export const REVIEWED = LOCALES.filter(
  (l) => l.reviewState === "SOURCE_CANONICAL" || l.reviewState === "NATIVE_REVIEWED" || l.reviewState === "FOUNDER_REVIEWED",
);

/** Awaiting a native-speaker read. Complete and serving; not yet editorially confirmed. */
export const NATIVE_REVIEW_PENDING = LOCALES.filter(
  (l) => l.reviewState === "AI_TRANSLATED_NATIVE_REVIEW_PENDING",
);

/**
 * Retained as an alias so existing callers keep working. Both now mean the same thing, and that is
 * the point: availability is one question, and it has one answer.
 */
export const PUBLISHED = PUBLIC_LOCALES;

const BY_CODE = new Map(LOCALES.map((l) => [l.code, l]));

export function localeEntry(code: string): LocaleEntry {
  return BY_CODE.get(code) ?? BY_CODE.get(DEFAULT_LOCALE)!;
}

/** Selectable and renderable by a visitor. */
export function isPublished(code: string): boolean {
  return BY_CODE.get(code)?.access === "public";
}

/** Has a person read this locale's copy? Never gate access on this. */
export function isReviewed(code: string): boolean {
  const r = BY_CODE.get(code)?.reviewState;
  return r === "SOURCE_CANONICAL" || r === "NATIVE_REVIEWED" || r === "FOUNDER_REVIEWED";
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
