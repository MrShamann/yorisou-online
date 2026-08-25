# CORP-P4AR2 — Rendered indexability census

> ## ⚠ SUPERSEDED IN PART — CORP-P4AR2R1, 2026-08-25
>
> The verdict `YORISOU_CORP_P4AR2_READY_FOR_CORP_P4B_DECISION` recorded in this document is
> **WITHDRAWN**. The truthful result was `CORP_P4AR2_DYNAMIC_404_NOT_ISOLATED`: seven invalid
> dynamic routes across four families — `/share/[publicId]`, `/connect/invite/[publicId]`,
> `/connect/pair/[pairId]` (never tested by CORP-P4AR2) and
> `/reports/self-understanding/[publicCode]` — serve an empty `<html id="__next_error__">` document,
> and after hydration `/share/**` and `/connect/pair/**` carry TWO headers and TWO footers.
>
> Everything else in this document stands: anchored robots rules, the four-entry sitemap, the
> corrected crawl/noindex vocabulary, the rendered census, and the router-level 404 fix.
>
> See `CORP_P4AR2R1_DYNAMIC_404_FRAMEWORK_BLOCK.md`.


**Status:** LOCAL CANDIDATE ONLY. Measured against a **production build** (`next build` +
`next start`) on `http://localhost:4312`, on this branch HEAD. No Production system was contacted and
no user data was accessed.

**Why this document exists.** CORP-P4AR1 reported that "131 routes are noindex". That was false.
131 routes are **crawl-blocked**; **8** emit a
verified `noindex` directive. A robots.txt `Disallow` rule controls **crawling**. It does not
implement `noindex`, and a crawler blocked from fetching a URL never sees a `noindex` on it — so the
two are not merely different mechanisms, they interfere. A URL that is `Disallow`ed can still be
indexed from external links alone, with no snippet.

Every row below is **measured**, not derived from a pathname.

## Method

For each of the 135 page routes derived from the App Router filesystem, one unauthenticated GET with
redirects **not** followed, recording: HTTP status, `Location`, the `X-Robots-Tag` response header,
and whether the HTML contains `<meta name="robots" content="…noindex…">`. Crawl disposition is
computed by evaluating the **rendered robots.txt** with the Google-spec matcher in
`lib/corporate/robotsTxt.ts`.

Labels are assigned in this precedence order: `NOT_FOUND` → `AUTH_PROTECTED` →
`X_ROBOTS_NOINDEX_VERIFIED` → `METADATA_NOINDEX_VERIFIED` → `ROBOTS_CRAWL_BLOCKED_ONLY` →
`INDEXABLE_CORPORATE_CANDIDATE` → `UNVERIFIED`.

Raw data: `test-results/corp-p4ar2-census/rendered-census.json`.

## Totals — 135 page routes

| Label | Count | Meaning |
|---|---|---|
| `INDEXABLE_CORPORATE_CANDIDATE` | 4 | Crawl-allowed, in the sitemap, emits no noindex. Intended to be indexed. |
| `METADATA_NOINDEX_VERIFIED` | 8 | A `noindex` directive was **observed** in the rendered HTML. |
| `X_ROBOTS_NOINDEX_VERIFIED` | 0 | A `noindex` was observed in the response header. |
| `ROBOTS_CRAWL_BLOCKED_ONLY` | 93 | **Crawl-blocked and nothing more.** No noindex directive of any kind. |
| `AUTH_PROTECTED` | 7 | Redirects to a sign-in surface before rendering content. |
| `NOT_FOUND` | 12 | Returns 404 in this build. |
| `UNVERIFIED` | 11 | Dynamic segment; **not probed** — a valid render needs data this package may not access. |

**Crawl-blocked total: 131.**
**Verified `noindex` directive total: 8.**
Those two numbers are the correction. They are not the same number and were never the same number.

### The gap, stated plainly

93 routes rest on robots.txt alone. If any of them is linked from
an external page, a search engine may list the URL without ever fetching it, and **adding a
`noindex` to those pages would not help while they remain `Disallow`ed** — the crawler is forbidden
to fetch the very directive that would exclude them. Choosing between "crawl-blocked" and
"crawlable + noindex" for these routes is a CORP-P4B decision, recorded in
`CORP_P4B_SEO_AND_ROUTE_DISPOSITION_DECISION_INPUT.md`. **No such change is made in this package.**

`AUTH_PROTECTED` is 7, which is lower than the number of routes a reader
might expect to be private. That is because most personal surfaces gate on the **client** or on data
rather than with a server redirect, so an unauthenticated GET returns 200 with an empty or neutral
shell. Those routes appear under `ROBOTS_CRAWL_BLOCKED_ONLY`. This is a measurement of what a
crawler receives, not an assertion that private data is exposed — no user data was requested or
returned in this census.

## INDEXABLE_CORPORATE_CANDIDATE (4)

| Route | Status | Crawl | meta noindex | X-Robots-Tag |
|---|---|---|---|---|
| `/` | 200 | CRAWL_ALLOWED | no | — |
| `/about` | 200 | CRAWL_ALLOWED | no | — |
| `/kakari` | 200 | CRAWL_ALLOWED | no | — |
| `/mirai-move` | 200 | CRAWL_ALLOWED | no | — |

## METADATA_NOINDEX_VERIFIED (8)

| Route | Status | Crawl | meta noindex | X-Robots-Tag |
|---|---|---|---|---|
| `/company` | 200 | CRAWL_BLOCKED | yes | — |
| `/contact` | 200 | CRAWL_BLOCKED | yes | — |
| `/prototype/corporate` | 200 | CRAWL_BLOCKED | yes | — |
| `/prototype/corporate/about` | 200 | CRAWL_BLOCKED | yes | — |
| `/prototype/corporate/company` | 200 | CRAWL_BLOCKED | yes | — |
| `/prototype/corporate/contact` | 200 | CRAWL_BLOCKED | yes | — |
| `/prototype/corporate/kakari` | 200 | CRAWL_BLOCKED | yes | — |
| `/prototype/corporate/mirai-move` | 200 | CRAWL_BLOCKED | yes | — |

## X_ROBOTS_NOINDEX_VERIFIED (0)

None. No route in this build sets `X-Robots-Tag: noindex` on the response.

## AUTH_PROTECTED (7)

| Route | Status | Crawl | meta noindex | X-Robots-Tag |
|---|---|---|---|---|
| `/admin` | 307 | CRAWL_BLOCKED | no | — |
| `/admin/audit` | 307 | CRAWL_BLOCKED | no | — |
| `/admin/candidates` | 307 | CRAWL_BLOCKED | no | — |
| `/admin/dte-launch-dashboard` | 307 | CRAWL_BLOCKED | no | — |
| `/admin/timeline` | 307 | CRAWL_BLOCKED | no | — |
| `/admin/users` | 307 | CRAWL_BLOCKED | no | — |
| `/dashboard/open-testing` | 307 | CRAWL_BLOCKED | yes | — |

## NOT_FOUND (12)

These page files exist in the App Router but return 404 in this build — feature-flagged or
gated surfaces. Recorded as observed; **not** changed by this package.

| Route | Status | Crawl | meta noindex | X-Robots-Tag |
|---|---|---|---|---|
| `/connect` | 404 | CRAWL_BLOCKED | yes | — |
| `/dev/ai-advisor` | 404 | CRAWL_BLOCKED | yes | — |
| `/dev/insights` | 404 | CRAWL_BLOCKED | yes | — |
| `/life` | 404 | CRAWL_BLOCKED | yes | — |
| `/life/experience` | 404 | CRAWL_BLOCKED | yes | — |
| `/life/goals` | 404 | CRAWL_BLOCKED | yes | — |
| `/life/memories` | 404 | CRAWL_BLOCKED | yes | — |
| `/life/reflect` | 404 | CRAWL_BLOCKED | yes | — |
| `/life/timeline` | 404 | CRAWL_BLOCKED | yes | — |
| `/tests/daily-check-in` | 404 | CRAWL_BLOCKED | yes | — |
| `/tests/yorisou-values` | 404 | CRAWL_BLOCKED | yes | — |
| `/today/discovery` | 404 | CRAWL_BLOCKED | yes | — |

## UNVERIFIED (11)

Dynamic segments. Probing a valid render requires share ids, invite tokens, report codes or user
ids — data this package is forbidden to access. Their crawl disposition is known and blocked; their
rendered index directive is **unmeasured, and is reported as unmeasured rather than assumed**.

| Route | Status | Crawl | meta noindex | X-Robots-Tag |
|---|---|---|---|---|
| `/admin/users/[userProfileId]` | — | CRAWL_BLOCKED | no | — |
| `/connect/invite/[publicId]` | — | CRAWL_BLOCKED | no | — |
| `/connect/pair/[pairId]` | — | CRAWL_BLOCKED | no | — |
| `/en/insights/[slug]` | — | CRAWL_BLOCKED | no | — |
| `/experiences/invite/[token]` | — | CRAWL_BLOCKED | no | — |
| `/insights/[slug]` | — | CRAWL_BLOCKED | no | — |
| `/reports/self-understanding/[publicCode]` | — | CRAWL_BLOCKED | no | — |
| `/saved/c02/[id]` | — | CRAWL_BLOCKED | no | — |
| `/saved/tests/[id]` | — | CRAWL_BLOCKED | no | — |
| `/share/[publicId]` | — | CRAWL_BLOCKED | no | — |
| `/tests/[testId]/return` | — | CRAWL_BLOCKED | no | — |

## ROBOTS_CRAWL_BLOCKED_ONLY (93)

Crawl-blocked by `Disallow: /` and emitting **no** index directive of any kind.

| Route | Status | Crawl | meta noindex | X-Robots-Tag |
|---|---|---|---|---|
| `/admin-entry` | 200 | CRAWL_BLOCKED | no | — |
| `/admin/experiences` | 200 | CRAWL_BLOCKED | no | — |
| `/ai-advisor` | 307 | CRAWL_BLOCKED | no | — |
| `/business` | 307 | CRAWL_BLOCKED | no | — |
| `/check-in` | 307 | CRAWL_BLOCKED | no | — |
| `/concept` | 307 | CRAWL_BLOCKED | no | — |
| `/en` | 200 | CRAWL_BLOCKED | no | — |
| `/en/about` | 200 | CRAWL_BLOCKED | no | — |
| `/en/ai-advisor` | 307 | CRAWL_BLOCKED | no | — |
| `/en/check-in` | 307 | CRAWL_BLOCKED | no | — |
| `/en/contact` | 200 | CRAWL_BLOCKED | no | — |
| `/en/forgot-password` | 200 | CRAWL_BLOCKED | no | — |
| `/en/insights` | 200 | CRAWL_BLOCKED | no | — |
| `/en/legal` | 307 | CRAWL_BLOCKED | no | — |
| `/en/line/mini-app/result` | 307 | CRAWL_BLOCKED | no | — |
| `/en/line/result` | 307 | CRAWL_BLOCKED | no | — |
| `/en/login` | 200 | CRAWL_BLOCKED | no | — |
| `/en/partners` | 307 | CRAWL_BLOCKED | no | — |
| `/en/pilot` | 307 | CRAWL_BLOCKED | no | — |
| `/en/product` | 307 | CRAWL_BLOCKED | no | — |
| `/en/products` | 307 | CRAWL_BLOCKED | no | — |
| `/en/progress` | 307 | CRAWL_BLOCKED | no | — |
| `/en/register` | 200 | CRAWL_BLOCKED | no | — |
| `/en/reservation-mobility-support` | 307 | CRAWL_BLOCKED | no | — |
| `/en/reset-password` | 200 | CRAWL_BLOCKED | no | — |
| `/en/result` | 200 | CRAWL_BLOCKED | no | — |
| `/en/result/continue` | 200 | CRAWL_BLOCKED | no | — |
| `/en/services` | 307 | CRAWL_BLOCKED | no | — |
| `/en/support` | 200 | CRAWL_BLOCKED | no | — |
| `/experiences` | 200 | CRAWL_BLOCKED | no | — |
| `/explore` | 200 | CRAWL_BLOCKED | no | — |
| `/forgot-password` | 200 | CRAWL_BLOCKED | no | — |
| `/formal-check` | 307 | CRAWL_BLOCKED | no | — |
| `/insights` | 200 | CRAWL_BLOCKED | no | — |
| `/legal` | 307 | CRAWL_BLOCKED | no | — |
| `/line/mini-app` | 200 | CRAWL_BLOCKED | no | — |
| `/line/mini-app/result` | 307 | CRAWL_BLOCKED | no | — |
| `/line/result` | 307 | CRAWL_BLOCKED | no | — |
| `/login` | 200 | CRAWL_BLOCKED | no | — |
| `/me` | 200 | CRAWL_BLOCKED | no | — |
| `/methodology` | 200 | CRAWL_BLOCKED | no | — |
| `/notice` | 200 | CRAWL_BLOCKED | no | — |
| `/online-check-in` | 307 | CRAWL_BLOCKED | no | — |
| `/open-testing` | 200 | CRAWL_BLOCKED | no | — |
| `/partners` | 307 | CRAWL_BLOCKED | no | — |
| `/pilot` | 307 | CRAWL_BLOCKED | no | — |
| `/privacy` | 200 | CRAWL_BLOCKED | no | — |
| `/private-state` | 200 | CRAWL_BLOCKED | no | — |
| `/product` | 307 | CRAWL_BLOCKED | no | — |
| `/products` | 307 | CRAWL_BLOCKED | no | — |
| `/progress` | 307 | CRAWL_BLOCKED | no | — |
| `/prototype/capture` | 200 | CRAWL_BLOCKED | no | — |
| `/prototype/discover` | 200 | CRAWL_BLOCKED | no | — |
| `/prototype/home` | 200 | CRAWL_BLOCKED | no | — |
| `/prototype/hook` | 200 | CRAWL_BLOCKED | no | — |
| `/prototype/login` | 200 | CRAWL_BLOCKED | no | — |
| `/prototype/signature` | 200 | CRAWL_BLOCKED | no | — |
| `/recommendations` | 200 | CRAWL_BLOCKED | no | — |
| `/recommendations/graph` | 200 | CRAWL_BLOCKED | no | — |
| `/register` | 200 | CRAWL_BLOCKED | no | — |
| `/report-loading` | 200 | CRAWL_BLOCKED | no | — |
| `/report-preview` | 200 | CRAWL_BLOCKED | no | — |
| `/reports/love-distance` | 200 | CRAWL_BLOCKED | no | — |
| `/reports/relationship-fatigue` | 200 | CRAWL_BLOCKED | no | — |
| `/reports/sample` | 200 | CRAWL_BLOCKED | no | — |
| `/reports/self` | 200 | CRAWL_BLOCKED | no | — |
| `/reservation-mobility-support` | 307 | CRAWL_BLOCKED | no | — |
| `/reset-password` | 200 | CRAWL_BLOCKED | no | — |
| `/result` | 200 | CRAWL_BLOCKED | no | — |
| `/result/continue` | 307 | CRAWL_BLOCKED | no | — |
| `/result/return` | 200 | CRAWL_BLOCKED | no | — |
| `/result/share` | 200 | CRAWL_BLOCKED | no | — |
| `/saved` | 200 | CRAWL_BLOCKED | no | — |
| `/services` | 307 | CRAWL_BLOCKED | no | — |
| `/support` | 200 | CRAWL_BLOCKED | no | — |
| `/terms` | 200 | CRAWL_BLOCKED | no | — |
| `/tests` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/c02` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/c02/return` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/f01` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/f02` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/ima-iro` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/local-life` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/love-distance` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/name-impression` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/r01` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/r04` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/relationship-fatigue` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/relationship-fatigue/return` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/s01` | 200 | CRAWL_BLOCKED | no | — |
| `/tests/work-rhythm` | 200 | CRAWL_BLOCKED | no | — |
| `/today/check-in` | 200 | CRAWL_BLOCKED | no | — |
| `/vision` | 307 | CRAWL_BLOCKED | no | — |
