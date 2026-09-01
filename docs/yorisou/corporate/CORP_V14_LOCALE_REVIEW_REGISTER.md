# Locale review register

**Access and review are different questions, and this file only answers the second one.**

Every locale below is reachable — `access: "public"` in `app/_corporate/i18n/locales.ts`, offered in
the language selector, served on request. What varies is whether a person has read the copy.

That separation is the point. A locale that no native speaker has read is a locale to be honest
about, not a locale to hide: hiding it does not improve the translation and it does remove the site
from everyone who reads that language. CORP-v1.2R1 conflated the two through one shared field and
nineteen languages became unreachable without anyone noticing.

## The register

| Locale | Endonym | Dir | Access | Review state | Read by |
|---|---|---|---|---|---|
| `ja` | 日本語 | ltr | public | `SOURCE_CANONICAL` | the source everything else derives from |
| `en` | English | ltr | public | `FOUNDER_REVIEWED` | edited under Founder direction — **not** a native-speaker review |
| `zh-CN` | 简体中文 | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `zh-TW` | 繁體中文 | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `ko` | 한국어 | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `es` | Español | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `fr` | Français | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `de` | Deutsch | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `pt` | Português | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `it` | Italiano | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `nl` | Nederlands | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `ar` | العربية | **rtl** | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `hi` | हिन्दी | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `th` | ไทย | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `vi` | Tiếng Việt | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `id` | Bahasa Indonesia | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `ms` | Bahasa Melayu | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `tr` | Türkçe | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `pl` | Polski | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `ru` | Русский | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |
| `uk` | Українська | ltr | public | `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | — |

**2 reviewed · 19 awaiting native review · 21 reachable.**

## Why `en` was downgraded

It was recorded as `HUMAN_REVIEWED`. The English copy was edited carefully — CORP-P5R1 scored five
thesis candidates and made six recorded line edits — but that work was done under Founder direction,
not by a native speaker performing a review. `FOUNDER_REVIEWED` is the accurate label. It is a
**downgrade in claim**, made deliberately.

## The review state is never rendered

A guard asserts that no review token can reach the page. Captioning nineteen languages with a
disclaimer that says "we did not check this" — in the language of the person reading it — would be
worse for that reader than telling the Founder. The honest audience for a review state is the person
who can commission the review.

## What a native review should cover, in priority order

The seven highest-risk locales, and what makes each risky:

1. **`ar`** — the only RTL surface. Layout and copy both.
2. **`ko`**, **`zh-CN`**, **`zh-TW`** — the subsidiary vocabulary (자회사 / 子公司) sits one word away
   from a claim the site must never make; a translator reaching for the natural word for "separate
   company" can produce it.
3. **`hi`**, **`th`** — script and line-breaking, and the conditional constructions this release
   depends on.
4. **`ru`** — long compounds against a tight measure.

For every locale, the check that matters most is **claim strength**: a conditional that has become a
statement of fact. The specific pairs are listed in `CORP_V14_BUSINESS_MODEL_AND_GLOBAL_LOCALE.md`
§10. A translation that reads beautifully and says "YORISOU retains equity" instead of "may retain
equity" is a false public claim in a language the Founder cannot check.

## How to promote a locale

1. A native speaker reads it against the Japanese canonical.
2. Their corrections land in that locale's content file.
3. `reviewState` changes to `NATIVE_REVIEWED` in `app/_corporate/i18n/locales.ts`.
4. `localeCompleteness.test.ts` asserts the reviewed set — update it in the same commit.

Access does not change, because access was never the question.
