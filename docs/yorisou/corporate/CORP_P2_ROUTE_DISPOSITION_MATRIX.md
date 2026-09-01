# CORP-P2 — Consumer Route Disposition Matrix

**Package:** CORP-P2 · **Date:** 2026-08-24 · **Status: RECOMMENDATION ONLY.**

**Nothing in this document was executed.** No route was changed, redirected, gated, or deleted in
CORP-P2. Every row is a proposal requiring a separate Founder decision.

Behaviour below was observed by anonymous `GET` against `https://yorisou.online` on 2026-08-24 while
Production served `b5521141`.

Recommendation vocabulary: `RETAIN_GATED` · `REDIRECT` · `RETIRE` · `REPLACE` ·
`NEEDS_FOUNDER_DECISION`.

---

## 0. Highest-priority release risk — read this first

> ### 🔴 R-02 `/company` publishes unverified legal information on production **right now**
>
> The live page renders 会社名「寄り添う（Yorisou）」, 所在地「福岡県福岡市」, 設立「2026年」, and
> **代表取締役「Jin Yang」**.
>
> - 「寄り添う（Yorisou）」 is not a corporate form.
> - **代表取締役 is a 株式会社 title. A 合同会社 has 代表社員.** The page is internally inconsistent
>   with its own prose, which says「Yorisou合同会社」.
> - 所在地 is city-level only; 設立 is a year only.
>
> This is **live, public, and wrong today** — independent of whether the corporate site ever ships.
> It is the single highest-priority item in this matrix and the only one I would treat as urgent.
> Correcting or unpublishing it does not depend on CORP-P3.
>
> **Recommended: `REPLACE`** with the CORP-P2 pending state, or `RETIRE` until registration is
> verified. **Evidence required:** 履歴事項全部証明書 or 定款.

---

## 1. Matrix

| # | Route | Current behaviour (anon) | Authenticated | Data / auth dependency | Indexable | Privacy relevance | Inbound-link risk | Recommendation | Evidence required before execution |
|---|---|---|---|---|---|---|---|---|---|
| R-01 | `/` | **200** — consumer homepage, YORISOU branding, nav 気づく/探す/わたし, LINE CTA | same | None directly; links into gated areas | Yes (no robots directives — see R-13) | Low | **High** — the canonical entry; any external link, LINE profile, or business card points here | `REPLACE` with the corporate homepage | Founder sign-off on corporate copy; R-13 first |
| R-02 | `/company` | **200** — renders unverified legal values | same | None | Yes | Low | Medium — likely cited as company info | **`REPLACE`** (see §0) | 履歴事項全部証明書 / 定款 |
| R-03 | `/me` | **200** — renders anonymously | Personalised account surface | Session cookie; Supabase reads when signed in | Yes | **High** — account surface | Medium | `RETAIN_GATED` — keep for existing users, remove from public nav | Decision on whether existing accounts remain supported |
| R-04 | `/life`, `/life/*` | **404** anonymously | Live for signed-in users — `YORISOU_OSF1_LIFE_OS_AUTHENTICATED` is SET | Supabase, consent records, Life OS store | No (404 anon) | **Highest** — personal continuity data | Low | `RETAIN_GATED` or `NEEDS_FOUNDER_DECISION` | Decision on whether the Life OS stays live behind a corporate front door |
| R-05 | `/tests`, `/tests/*` | **200** — assessment catalogue and flows incl. the 120Q | same | Device-local; some server scoring | Yes | Medium — answers are sensitive if persisted | **High** — the most-shared consumer surface | `NEEDS_FOUNDER_DECISION` — retire, or retain as an archived product area | Whether the assessment product is discontinued |
| R-06 | `/result` | **200** | same | Device-local result state | Yes | Medium | High — results were shareable | `NEEDS_FOUNDER_DECISION` — follows R-05 | Same as R-05 |
| R-07 | `/saved` | **200** | Device-local saved items | localStorage | Yes | Medium | Low | `NEEDS_FOUNDER_DECISION` — follows R-05 | Same as R-05 |
| R-08 | `/login`, `/register`, `/forgot-password`, `/reset-password` | **200** | Auth flows | Supabase auth, cookies | Yes | **High** — credential surfaces | Low | `RETAIN_GATED` if accounts persist, else `RETIRE` | Decision on account continuation; deletion path for existing users first |
| R-09 | `/admin`, `/admin-entry` | Not probed (internal) | Admin-gated | Admin records | Should be **No** | **High** | None | `RETAIN_GATED` | Confirm `noindex` and admin gating |
| R-10 | `/line`, `/line/mini-app` | **200** | LINE-context surface | LINE identity linkage | Yes | **High** — identity linkage | Medium — reachable from the LINE channel | `NEEDS_FOUNDER_DECISION` | Whether the LINE channel remains operated |
| R-11 | `/share/*` | **404** for an unknown id | Share objects | `yorisou_share_objects` — schema applied, **both sharing flags UNSET**, so not activated | No | **High** if activated | Low today | `RETAIN_GATED` — leave closed | Do not activate; revisit only with a product decision |
| R-12 | `/reports/*`, `/private-state`, `/dashboard`, `/recommendations` | Not individually probed | Account/report surfaces | Supabase | Mixed | **High** | Low | `NEEDS_FOUNDER_DECISION` | Full route census before execution |
| R-13 | `robots.txt` | **404 — no robots.txt exists** | — | — | Everything is crawlable with no directives | — | — | **`REPLACE`** — add explicit rules before any corporate launch | Decide which areas are indexable |
| R-14 | `sitemap.xml` | **404 — no sitemap exists** | — | — | No sitemap published | — | — | `REPLACE` — publish a corporate-only sitemap at launch | Final route set |
| R-15 | Site metadata (`app/layout.tsx`) | Title 「YORISOU｜AIと整える、わたしの毎日。」, description names セルフリフレクションサービス and 診断 | same | — | Yes | Low | **High** — this is the site-wide default inherited by every page without its own metadata | `REPLACE` at launch | Corporate metadata approved |
| R-16 | 404 page | Renders **full consumer chrome** — header, LINE CTA, footer, mobile bottom nav | same | — | — | Low | Medium — every dead link advertises the consumer product | `REPLACE` when the shell changes | Follows R-01 |

## 2. Cross-cutting observations

1. **There are no crawl directives at all.** `robots.txt` and `sitemap.xml` both 404, so every 200
   route above is fully crawlable. Any corporate launch that leaves consumer routes live also leaves
   them indexable. R-13 should be settled before, not after, R-01.
2. **The site-wide metadata is consumer-product metadata.** Because `app/layout.tsx` supplies the
   default title and description, a corporate page without its own metadata would inherit
   「AIと整える、わたしの毎日。」 and the word 診断. The CORP-P2 routes each set their own metadata and
   `robots: { index: false, follow: false }`, so the Preview is unaffected — but R-15 must be handled
   at launch.
3. **The Life OS is live for authenticated users** (`YORISOU_OSF1_LIFE_OS_AUTHENTICATED` SET). A
   corporate front door over a live personal-data product is a coherent choice only if made
   deliberately. It should not be settled implicitly by shipping a homepage.
4. **Account data has a retention question.** If R-08 becomes `RETIRE`, existing users need a
   deletion and export path first. That is a legal and ethical prerequisite, not a follow-up.
5. **Sharing is closed and should stay closed.** Schema applied, flags unset. Nothing to do.

## 3. Execution boundary

CORP-P2 changed **zero** consumer routes. `git diff main` touches only
`app/prototype/corporate/**` and `docs/yorisou/corporate/**`. Executing any row above is CORP-P3 or
later and requires its own Founder authorization.
