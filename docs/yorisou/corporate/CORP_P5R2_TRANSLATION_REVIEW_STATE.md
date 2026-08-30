# CORP-P5R2 — translation provenance and review state

Status: **Preview only.** 21 published locales. Japanese is the canonical source.

## 1. Why this document exists

Review state is real engineering metadata and it is tracked in the locale registry. It is also
**never shown to a visitor**: a reader of the Arabic Company page must not see `AI_TRANSLATED`.
That separation is enforced by a test, not by convention — see §4.

## 2. Matrix

| Code | Language | Endonym | Dir | Script | Source | Review state |
|---|---|---|---|---|---|---|
| ja | Japanese | 日本語 | ltr | Jpan | — | SOURCE_CANONICAL |
| en | English | English | ltr | Latn | ja | HUMAN_REVIEWED |
| zh-CN | Chinese (Simplified) | 简体中文 | ltr | Hans | ja | AI_TRANSLATED |
| zh-TW | Chinese (Traditional) | 繁體中文 | ltr | Hant | ja | AI_TRANSLATED |
| ko | Korean | 한국어 | ltr | Kore | ja | AI_TRANSLATED |
| es | Spanish | Español | ltr | Latn | ja | AI_TRANSLATED |
| fr | French | Français | ltr | Latn | ja | AI_TRANSLATED |
| de | German | Deutsch | ltr | Latn | ja | AI_TRANSLATED |
| pt | Portuguese | Português | ltr | Latn | ja | AI_TRANSLATED |
| it | Italian | Italiano | ltr | Latn | ja | AI_TRANSLATED |
| nl | Dutch | Nederlands | ltr | Latn | ja | AI_TRANSLATED |
| ar | Arabic | العربية | **rtl** | Arab | ja | AI_TRANSLATED |
| hi | Hindi | हिन्दी | ltr | Deva | ja | AI_TRANSLATED |
| th | Thai | ไทย | ltr | Thai | ja | AI_TRANSLATED |
| vi | Vietnamese | Tiếng Việt | ltr | Latn | ja | AI_TRANSLATED |
| id | Indonesian | Bahasa Indonesia | ltr | Latn | ja | AI_TRANSLATED |
| ms | Malay | Bahasa Melayu | ltr | Latn | ja | AI_TRANSLATED |
| tr | Turkish | Türkçe | ltr | Latn | ja | AI_TRANSLATED |
| pl | Polish | Polski | ltr | Latn | ja | AI_TRANSLATED |
| ru | Russian | Русский | ltr | Cyrl | ja | AI_TRANSLATED |
| uk | Ukrainian | Українська | ltr | Cyrl | ja | AI_TRANSLATED |

**Every locale is translated from the Japanese canonical source — never from another translation.**
English was used only as a structural reference. This matters: pivoting through English would let
English's interpretation of a Japanese phrase harden into nineteen languages.

## 3. What "AI_TRANSLATED" means honestly

19 of 21 locales have **not** been reviewed by a human speaker of that language. They are complete,
structurally verified, type-checked, and constrained by the rules in §5 — but fluency, register and
idiom are unverified. The honest reading is: *the meaning has been carried over faithfully and the
claims are bounded, but no native speaker has signed off on the prose.*

Nothing in the site claims otherwise, and no locale is presented as human-reviewed when it is not.
Promoting a locale to `HUMAN_REVIEWED` is a data change in the registry.

## 4. Guards

- `tests/corporate-p5r2/internalTokens.test.ts` fails the build if any review-state token, internal
  marker (`SOURCE_REQUIRED`, `VERIFY_`, `BLOCKER`, `TODO`, `INTERNAL_ONLY`,
  `COMPANY_REGISTRATION_`, `VERIFIED_CORPORATE_`, `NOT_CONFIRMED`, `UNRESOLVED`, `PENDING_SOURCE`)
  or the Founder's private mailbox appears in shipped copy or the view layer.
- `tests/corporate-p5r2/localeCompleteness.test.ts` fails if any published locale is missing a
  string the Japanese source defines, ships an empty string, or wholesale echoes the Japanese —
  which is how a silent fallback would look.
- Phrase-unit arrays are compared by joined content, not index, because the number of units is a
  property of the language: Japanese breaks a heading into three clause-sized units where German
  needs two.

## 5. Claim constraints applied to every locale

No locale may be stronger than the Japanese. Specifically, in all 21:

- The company form is a Japanese GK (合同会社) — a member-managed LLC. The representative is
  **代表社員 / representative member**, never a joint-stock-company CEO title.
- Education is two separate credentials: **MBA, IESE Business School** and **General Management
  Program, Harvard Business School Executive Education**. No locale attaches a degree word to
  Harvard, and none says "Harvard University".
- No endorsement is implied by IESE, Harvard, Ficosa, or any government body.
- No customer, revenue, funding, market-position, team-size or traction claim appears.
- Unverified company facts are **omitted**, not shown as empty rows. The published facts are limited
  to trade name, representative, city-level location, and business activity.
