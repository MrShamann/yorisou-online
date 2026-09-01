# CORP-P4A — Route Transition Candidate

**Package:** CORP-P4A · **Date:** 2026-08-24 · **From:** `8fd5bd5` (CORP-P3R1, visually accepted)
**Scope:** a reversible **local** candidate for `yorisou.online` becoming the Yorisou corporate front
door. Nothing is deployed, pushed, deleted or redirected.

## 1. How the promotion was done — one implementation, two URL sets

The accepted CORP-P3R1 system was **not copied**. Each page body was extracted into a shared view
(`app/prototype/corporate/_views/*`), and the URLs became a parameter:

```ts
export type RouteSet = { home; miraiMove; kakari; about; company; contact }
export const PROTOTYPE_ROUTES: RouteSet = { home: "/prototype/corporate", ... }
export const FINAL_ROUTES:     RouteSet = { home: "/", miraiMove: "/mirai-move", ... }
```

`CorporateShell`, `ProductComposition` and every view take a `RouteSet`. Both surfaces render the
same components from the same content module, so they cannot drift. Each final route is a ~19-line
wrapper. `Product.href` was removed in favour of `productHref(product, routes)` — a product's URL is
a property of the route set, never of the product record.

**Consequence:** `/prototype/corporate/**` remains byte-identical in behaviour and fully available
for evidence comparison, and stays `noindex`.

## 2. Route transition matrix

| Old route | Local candidate behaviour | Production behaviour (unchanged) | Auth / data dependency | Indexability candidate | Functionality changed? | CORP-P4B decision required | Rollback |
|---|---|---|---|---|---|---|---|
| `/` | Corporate homepage (`HomeView` @ FINAL_ROUTES) | Consumer homepage — 気づく/探す/わたし nav, LINE CTA | **none** — static, no fetch | `Allow`, in sitemap | **Yes** — replaced locally | No (this *is* the front door) | `git revert` the P4A commit |
| `/mirai-move` | New corporate product page | **404** | none | `Allow`, in sitemap | New route | No | same |
| `/kakari` | New corporate product page | **404** | none | `Allow`, in sitemap | New route | No | same |
| `/about` | Corporate method page | Consumer 「Yorisouとは」 | none | `Allow`, in sitemap | **Yes** — replaced locally | No | same |
| `/company` | **Pending state**, `COMPANY_REGISTRATION_SOURCE_REQUIRED`, zero legal values | **Publishes unverified values incl. 代表取締役** | none | `Disallow` + `noindex` | **Yes** — replaced locally | No | same |
| `/contact` | **Pending state**, `VERIFIED_CORPORATE_CONTACT_REQUIRED`, no form | Consumer contact page | none | `Disallow` + `noindex` | **Yes** — replaced locally | same | same |
| `/prototype/corporate/**` | Retained, unchanged, `noindex` | 404 (never deployed) | none | `Disallow` + `noindex` | No | No | n/a |
| `/me` | **Unchanged** — 200, consumer chrome | 200 | session cookie; Supabase when signed in | `Disallow` | **No** | **Yes** | n/a |
| `/life`, `/life/*` | **Unchanged** — 404 anon; live for signed-in users | same | Supabase, consent, Life OS | `Disallow` | **No** | **Yes** | n/a |
| `/tests/*` | **Unchanged** — 200, consumer chrome | 200 | device-local + server scoring | `Disallow` | **No** | **Yes** | n/a |
| `/result` | **Unchanged** — 200 | 200 | device-local | `Disallow` | **No** | **Yes** | n/a |
| `/saved` | **Unchanged** — 200 | 200 | localStorage | `Disallow` | **No** | **Yes** | n/a |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | **Unchanged** — 200 | 200 | Supabase auth, cookies | `Disallow` | **No** | **Yes** | n/a |
| `/line/*` | **Unchanged** — 200 | 200 | LINE identity linkage | `Disallow` | **No** | **Yes** | n/a |
| `/share/*` | **Unchanged** — 404 for unknown id; flags still UNSET | same | share objects (not activated) | `Disallow` | **No** | **Yes** | n/a |
| `/reports/*`, `/dashboard/*`, `/admin/*` | **Unchanged** | unchanged | Supabase / admin records | `Disallow` | **No** | **Yes** | n/a |
| `robots.txt` | **New candidate** | **404 — none exists** | none | n/a | New | Confirm at release | delete the file |
| `sitemap.xml` | **New candidate**, 4 corporate routes only | **404 — none exists** | none | n/a | New | Confirm at release | delete the file |
| 404 page | **Corporate 404** — links only to corporate routes | Full consumer chrome + LINE CTA | none | `noindex` | **Yes** — replaced locally | Confirm at release | `git revert` |

**Verified anonymous probes on the local build** (status and shell only, no authentication, no
Production user data): `/me` 200 with chrome · `/life` **404** · `/tests` 200 with chrome ·
`/result` 200 with chrome · `/saved` 200 with chrome · `/login` 200 with chrome ·
`/line/mini-app` 200 · `/share/nonexistent` **404**. Identical to the behaviour recorded against
Production. **No consumer route lost or gained functionality, chrome, auth or data access.**

## 3. One shared file was modified, and only additively

`app/components/AppShell.tsx` — the six corporate front-door paths were added to
`SHELL_SUPPRESSED_EXACT` so they render `CorporateShell` instead of the consumer chrome. This adds
entries to a list; **no existing entry changed and no consumer route's chrome behaviour changed.**
Verified above: `/me`, `/tests`, `/result`, `/saved`, `/login` all still render consumer chrome.

## 4. Information architecture

The corporate homepage emits **0** hrefs to any consumer route. Its only internal links are `/`,
`/mirai-move`, `/kakari`, `/about`, `/company`, `/contact`. Navigation and footer use **final URLs**.
No legacy route receives a new promotional link.

## 5. Metadata / robots / sitemap candidate

Corporate metadata carries no 診断, no self-reflection positioning, no medical or therapeutic
language, no metrics, no unverified company facts, no generic AI/DX language. `robots.txt` allows the
four public corporate routes and disallows everything personal, authenticated, internal, legacy,
prototype, or still blocked. `sitemap.xml` contains **exactly four** entries — `/`, `/mirai-move`,
`/kakari`, `/about` — and **zero** personal, legacy, prototype, `/company` or `/contact` entries.
`lastModified` is deliberately omitted: a fabricated date is a fabricated claim. No external image
was fetched or generated.

## 6. Rollback

The entire package is one local commit on an unpushed branch. `git revert <commit>` restores the
consumer `/`, `/about`, `/company`, `/contact`, removes the four new files
(`robots.ts`, `sitemap.ts`, `not-found.tsx`, and the two new route directories) and restores
`AppShell.tsx`. No database, migration, environment variable, DNS or Vercel state is involved, so
there is nothing else to undo. Production was never a participant.

## 7. Validation

30 route × viewport combinations (320/390/768/1280/1440 × 6 final routes) on a local production
build: axe WCAG 2.2 AA **0 violations / 0 serious** · 0 overflow · 0 clipped · 0 tap under 44px ·
**0 external and 0 Supabase/auth/analytics/API requests** · 0 console errors · **0 prohibited
claims** · `navViolations 0` · `brandWrapped 0` · `duplicateBoundary 0` · reduced motion 0/0 ·
13/13 focus stops visible · flows 1–5 complete. Heights identical to accepted P3R1
(home 1440 **4130**, 390 **6425**, 768 **5184**). `tsc` 0 · `eslint` 0 · `build` 0.

Lighthouse on the final routes: **100 / 100 / 100 / 100** with LCP ≤1.3 s, CLS 0, TBT 0 ms. SEO rose
from 60 to 100 because the final routes are *intended* to be indexable and robots/sitemap now exist —
**prototype, `/company` and `/contact` remain `noindex`**, so isolation was not weakened to gain it.
