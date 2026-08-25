# CORP-P4AR2 — Dynamic 404 isolation, exact robots matching, indexability truth

**Status:** LOCAL CANDIDATE ONLY — never pushed, never deployed, Production untouched.
**Branch:** `product/corporate-homepage-preview`
**Preflight HEAD:** `29fce73eba2e5b82c13856150a44a3356fb8a48d`
**Evidence:** `test-results/corp-p4ar2-baseline/`, `test-results/corp-p4ar2-fixed/`,
`test-results/corp-p4ar2-compare/`, `test-results/corp-p4ar2-census/`,
`test-results/corp-p4ar2-browser/`
**Method:** every claim below is measured against a **production build** (`next build` +
`next start`), on both `29fce73` and this HEAD, running side by side on ports 4313 and 4312.
Nothing here is measured in `next dev`, whose streaming behaviour differs and which initially gave
me a misleading reading.

---

## 1. Four CORP-P4AR1 claims that were false, and are superseded

### 1.1 "Every unknown path is clean" — FALSE

It held only for paths matching no dynamic route pattern. Measured on the production build at
`29fce73`, `/insights/does-not-exist` served **two headers, two footers and four navs**: the
consumer chrome from the root layout wrapping the corporate 404 inside it. The server-rendered text
began `YORISOU 気づく 探す わたし L LINEで続ける ログイン` and only then `本文へスキップ Yorisou 私たち
について…`. `/en/insights/nope` behaved identically.

The cause was the inference itself, not a missing entry in a list. `shellOwner()` asked
`isKnownPageRoute()` whether the path *looked* like a route, and treated "matches a dynamic pattern"
as "resolved successfully". Whether a route resolves is decided by the route handler at request
time. `/insights/[slug]` matches, then calls `notFound()`.

**Superseded by:** the claim is now bounded and structural — *no* 404 can carry consumer chrome,
because the 404 renders outside the root layout entirely. See §2.

### 1.2 "All four Allow rules are anchored" — FALSE

Only `/$` was. The rendered robots.txt at `29fce73` was:

```
Allow: /$
Allow: /mirai-move
Allow: /kakari
Allow: /about
Disallow: /
```

Under the matching rules Google implements, a rule without a trailing `$` is a **path prefix**, and
where an Allow and a Disallow both match, the **longer rule wins**. `Allow: /mirai-move` is eleven
characters and `Disallow: /` is one, so every path beginning with those characters was allowed:
`/mirai-move-old`, `/mirai-move-2`, `/mirai-movement`, `/mirai-move/anything`, and likewise
`/kakari-preview`, `/kakari/*`, `/about-old`, `/about/*`. The default-deny was real; three of its
four exceptions were open-ended subtrees rather than single pages.

**Superseded by:** all four Allow rules are now anchored. See §3.

### 1.3 "131 routes are noindex" — FALSE

131 routes are **crawl-blocked**. **Eight** emit a verified `noindex` directive. The claim was wrong
by a factor of roughly sixteen, and the error was in the vocabulary rather than in any single line of
logic: six route groups were named `*_NOINDEX` and the module exported `isIndexable()`, but nothing
in the module has ever emitted an index directive. robots.txt controls crawling and **cannot** make
a page noindex — worse, the two mechanisms conflict, because a URL blocked from crawling is a URL
whose `noindex` a crawler is forbidden to fetch and will therefore never act on.

**Superseded by:** the rendered census in
`docs/yorisou/corporate/CORP_P4AR2_RENDERED_INDEXABILITY_CENSUS.md`, and the rename in §4.

### 1.4 "One module means shell, robots, sitemap and tests cannot disagree" — FALSE

A single module guarantees the four *agree with the module*. It cannot detect a defect in what the
module produces. CORP-P4AR1's tests asserted against `isIndexable()`, a policy predicate — so they
passed while the serialised rules leaked, because the predicate and the tests shared the same wrong
premise. The unanchored `Allow` was invisible to every test in the suite.

**Superseded by:** the tests now **parse and evaluate the serialised robots.txt text**
(`lib/corporate/robotsTxt.ts`), not the policy. Test 9 reconstructs the exact `29fce73` rule block
and asserts that it *did* leak, so the suite carries its own regression witness.

---

## 2. Dynamic 404 isolation — chosen architecture

**Chosen: `app/global-not-found.tsx`, the App Router convention for a 404 that renders as its own
document.** Next.js renders it *instead of* the root layout; it owns `<html>` and `<body>` itself.
Because no layout wraps it, `AppShell` cannot wrap it. Shell isolation stops being a policy decision
that pathname logic could get wrong and becomes a property of where the file sits.

Enabled by `experimental: { globalNotFound: true }` in `next.config.ts`. Verified present in the
installed Next.js **16.2.10** (`FILE_TYPES` in the app loader lists `global-not-found`; the flag is
declared in `config-shared.d.ts` and `config-schema.js`, defaulting to `false`).

### 2.1 Rejected alternatives

| # | Alternative | Why rejected |
|---|---|---|
| 1 | A finer pathname exception list (e.g. validate the id shape before claiming CONSUMER) | The same invalid inference, one level more detailed. The shell would still be guessing what the route handler will decide, and every new dynamic route needs a new guess. |
| 2 | Route groups — move all 117 consumer routes into `app/(consumer)/` so the shell lives in a group layout | Architecturally the cleanest and fully stable, with no experimental flag. Rejected **for this package only**: it relocates every consumer route directory in the repository for a 404 fix, and CORP-P4AR2 is forbidden from restructuring consumer routes. **Reconsider under CORP-P4B**, where the route transition is the actual subject. |
| 3 | Hide the consumer chrome with CSS on 404, or remove it from the DOM after hydration | Both leave the consumer chrome in the server-rendered HTML. That is concealment, not isolation. |
| 4 | Read the response status in the root layout and branch | Not available: a layout renders above the boundary that sets the 404 status and cannot observe it. |

### 2.2 Cost, recorded honestly

`globalNotFound` is **opt-in and experimental** in 16.2.10 and may change before it stabilises. It is
accepted here because this branch is a local Preview that is never pushed or deployed, and because
the non-experimental alternative (2) is out of scope for this package. **CORP-P4B must re-confirm
the flag before any publication decision**, and should weigh alternative (2) as the permanent form.

### 2.3 Why there are two 404 files, not one

`app/global-not-found.tsx` handles the normal path. `app/not-found.tsx` was **removed and then
restored**, because removing it caused a measured regression: on the three routes described in §2.4,
the 404 response fell back to the **root layout's metadata** and served the archived consumer
product's marketing title (`YORISOU | AIと整える、わたしの毎日。`) on a 404. Restoring it returned the
correct title.

Both files render `app/_notFound/NotFoundBody.tsx` and nothing else, and both take their title from
one exported constant, so the two entry points **cannot** state different things. Test 12b enforces
this: neither file may contain 404 markup or a heading of its own.

### 2.4 A pre-existing defect this package did NOT fix

Three dynamically rendered routes never reach either 404 file. Next.js raises
`Error: Internal: NoFallbackError` and serves its **internal error document** —
`<html id="__next_error__">` with an empty `<body>`:

- `/share/[publicId]`
- `/connect/invite/[publicId]`
- `/reports/self-understanding/[publicCode]`

Consequence: a crawler, or any client without JavaScript, receives a blank page under a 404 status.
The corporate 404 body is not server-rendered at all.

**This is present at `29fce73` and unchanged by CORP-P4AR2** — verified by running both production
builds side by side (`test-results/corp-p4ar2-compare/404-baseline-vs-fixed.json`). The correlation
is with dynamic rendering: the two routes that render correctly (`/insights/[slug]`,
`/en/insights/[slug]`) declare `generateStaticParams` with `dynamicParams = false`, so an unmatched
param is a *router-level* 404. The three failing ones are `force-dynamic` or allow dynamic params, so
the page executes and calls `notFound()` from inside a dynamic render.

Two remedies were tried and **did not work**: `export const dynamic = "force-dynamic"` on the 404
document (rebuilt and re-measured; `/_not-found` became `ƒ` but all three still returned the internal
error document), and the shared-body split (fixes the title, not the empty body).

Fixing it properly means changing `dynamic`/`dynamicParams` configuration on **consumer share,
invite and report routes** — which this package is explicitly forbidden to touch, and which would
alter valid share/invite behaviour. **Escalated to CORP-P4B** as a decision input, not silently
absorbed. The title regression that removing `not-found.tsx` introduced *was* fixed (§2.3).

### 2.5 Measured result

Production build, `next start`, scriptless HTML (comparison table:
`test-results/corp-p4ar2-compare/404-baseline-vs-fixed.json`):

| Path | `29fce73` hdr/ftr/nav | consumer chrome | CORP-P4AR2 hdr/ftr/nav | consumer chrome |
|---|---|---|---|---|
| `/insights/does-not-exist` | 2/2/4 | **yes** | 1/1/2 | no |
| `/en/insights/nope` | 2/2/4 | **yes** | 1/1/2 | no |
| `/an-entirely-unknown-path` | 1/1/2 | no | 1/1/2 | no |
| `/tests/nonexistent` | 1/1/2 | no | 1/1/2 | no |
| `/mirai-move-old` | 1/1/2 | no | 1/1/2 | no |
| `/share/not-a-uuid` | 0/0/0 (internal error doc) | no | 0/0/0 (internal error doc) | no |

Every 404 that renders at all now returns status 404, exactly one header, one footer, one `<h1>`,
the title `ページが見つかりません — Yorisou`, and no consumer chrome.

---

## 3. Exact robots matching

Rendered robots.txt at this HEAD (`test-results/corp-p4ar2-fixed/robots.txt`):

```
User-Agent: *
Allow: /$
Allow: /mirai-move$
Allow: /kakari$
Allow: /about$
Disallow: /
…explicit sensitive groups, redundant under Disallow: /
Sitemap: https://yorisou.online/sitemap.xml
```

`lib/corporate/robotsTxt.ts` implements the Google specification — prefix matching, `*` wildcard,
`$` end-anchor, matched value includes the query string, most-specific-rule-wins by rule-path length,
Allow wins an exact-length tie, unmatched paths allowed — and the tests evaluate the **serialised
text**.

Two consequences accepted deliberately:

- `$` anchors the end of the matched value, and that value includes the query string, so
  `/about?utm_source=x` is **not** crawlable. Intended: canonical corporate URLs carry no query, and
  a blocked tracking variant costs nothing, whereas an unanchored rule reopens the subtree.
- `/about/` does not match either. Next.js serves a 308 to the canonical form, which *is* allowed.

---

## 4. Vocabulary: four separate dispositions

`lib/corporate/routePolicy.ts` no longer names anything `*_NOINDEX`, and no longer exports
`isIndexable()`.

| Question | Function | Values |
|---|---|---|
| May a crawler fetch it? | `crawlDisposition()` | `CRAWL_ALLOWED` / `CRAWL_BLOCKED` |
| Do we submit it? | `sitemapDisposition()` | `IN_SITEMAP` / `EXCLUDED_FROM_SITEMAP` |
| Which chrome does a **resolved** route render in? | `shellOwner()` | `CORPORATE` / `CONSUMER` / `NONE` |
| What is the route *for*? | `routeLifecycle()` | `CORPORATE_CANDIDATE`, `CORPORATE_BLOCKED_PENDING_SOURCE`, `CONSUMER_RETAINED`, `PROTOTYPE_EVIDENCE`, `INTERNAL_ONLY`, `NON_PAGE`, `UNRESOLVED` |

The fifth question — what index directive a page actually emits — **is deliberately not answered by
this module**. It cannot be derived from a pathname; it is a property of what the route renders at
request time, so it is measured (see the census). Test 18 fails the build if any future export
claims to return it.

---

## 5. Verification

**Tests.** `lib/server/__tests__/corpP4ar2CrawlAndShell.test.ts` — 20 tests, all passing at this
HEAD; combined with the retained CORP-P4AR1 suite, **35/35 pass**.

Run against `29fce73` in a detached worktree (`test-results/corp-p4ar2-compare/tests-against-29fce73.txt`):
**13 of 20 fail**, each on a real defect —

| Fails at `29fce73` | Defect |
|---|---|
| 1, 3, 4, 9 | unanchored Allow rules leaking siblings and subtrees |
| 11, 17 | crawl/sitemap/lifecycle disagreement, absent vocabulary |
| 12, 12b, 13, 14 | no `global-not-found.tsx`, no shared body, flag not set |
| 15, 16, 18 | `*_NOINDEX` naming and `isIndexable()` overclaim |

The 7 that pass at `29fce73` are invariants CORP-P4AR1 genuinely established (matcher self-tests,
default-deny, sitemap agreement, classification totality) and are retained as non-regression cover.

**Browser matrix.** 4 routes × 4 widths (390 / 768 / 1280 / 1440) = 16 screenshots,
`test-results/corp-p4ar2-browser/`. Every cell: status 404, exactly 1 header / 1 footer / 1 `<h1>`,
no consumer nav labels, no consumer bottom-nav padding, no horizontal overflow. Desktop links
visible with non-zero bounding box at ≥768; the `<details>` disclosure at 390.

**All 16 screenshots were opened and visually inspected**, individually and as
`test-results/corp-p4ar2-browser/contact-sheet.png`. This is stated explicitly because CORP-P4A
cited a screenshot that was written to disk and never opened, and the claim it supported was false.

**Accessibility.** axe-core, WCAG 2.0/2.1/2.2 A+AA, on the 404 at 390 and 1280 for two routes:
**0 violations**; `<html lang="ja">` confirmed on the document the 404 now owns.

**Build.** `next build` succeeds; `tsc --noEmit` clean.

---

## 6. Files changed

| File | Change |
|---|---|
| `app/global-not-found.tsx` | **new** — the 404 as its own document |
| `app/_notFound/NotFoundBody.tsx` | **new** — the one shared 404 body |
| `app/not-found.tsx` | rewritten to delegate to the shared body |
| `next.config.ts` | `experimental.globalNotFound: true` |
| `app/robots.ts` | all four Allow rules anchored |
| `lib/corporate/robotsTxt.ts` | **new** — robots.txt serialiser, parser, Google-spec matcher |
| `lib/corporate/routePolicy.ts` | `*_NOINDEX` renamed; four dispositions separated |
| `lib/server/__tests__/corpP4ar2CrawlAndShell.test.ts` | **new** — 20 tests |
| `lib/server/__tests__/corpP4ar1RoutePolicy.test.ts` | renamed identifiers only |
| `tsconfig.json` | excluded `test-results` — prior evidence is a record, never rewritten to satisfy a later refactor |

**Not changed:** Production, Vercel, DNS, Supabase, AWS, environment variables, migrations,
authentication, feature flags, consumer route behaviour, consumer copy, scoring, PR #127.
