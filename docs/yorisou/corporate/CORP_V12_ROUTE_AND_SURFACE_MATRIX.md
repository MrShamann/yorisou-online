# CORP-v1.2 — route and surface matrix

Which surface owns which route, how locale behaves, and what indexing policy applies.
Preview only. `robots.ts` is **unchanged** by this package.

## Corporate surface

Locale is carried by `?lang=` (see *Locale strategy* below). Japanese is the default and takes no
parameter.

| Route | Page | Locale | Indexable in Production today | Preview | Production decision still required |
|---|---|---|---|---|---|
| `/` | Home | `?lang=` | Yes — `Allow: /$` | Live | Confirm corporate `/` permanently replaces the consumer root |
| `/ventures` | Ventures index | `?lang=` | **No** — `Disallow: /` default | Live | Add to `CORPORATE_INDEXABLE` when content is accepted |
| `/mirai-move` | Venture detail | `?lang=` | Yes — `Allow: /mirai-move$` | Live | — |
| `/kakari` | Venture detail | `?lang=` | Yes — `Allow: /kakari$` | Live | — |
| `/chigamo` | Venture detail | `?lang=` | **No** | Live | Keep blocked while Chigamo is at concept stage |
| `/about` | **How we build** | `?lang=` | Yes — `Allow: /about$` | Live | Rename to `/how-we-build`? See below |
| `/build-with-us` | Build with us | `?lang=` | **No** | Live | Add to `CORPORATE_INDEXABLE` when intake is real |
| `/company` | Company | `?lang=` | **No** — in `CORPORATE_BLOCKED` | Live | Unblock when release blockers close |
| `/contact` | Contact | `?lang=` | **No** — in `CORPORATE_BLOCKED` | Live | Unblock when delivery is verified |
| `/api/corporate-contact` | Contact intake | n/a | n/a | Present, transport unconfigured | Needs a valid credential before it can deliver |

### Why `/about` still serves "How we build"

`/about` is one of only four paths anchored as crawlable in `robots.ts` (`Allow: /about$`), a policy
established and accepted in CORP-P4AR2. Renaming it to `/how-we-build` would either drop an accepted
indexable URL or create a new one that the anchored rules do not cover. The **label** in navigation
changes to "how we build"; the **URL** does not. The rename is a Production routing decision, listed
above and in the release blockers.

## Consumer surface — protected, unchanged

| Route | Owner | Locale | Status |
|---|---|---|---|
| `/en`, `/en/**` | Consumer | Pathname (`startsWith("/en")` → `en`) | **Unchanged.** Regression-tested. |
| `/connect`, `/me`, `/life`, `/check-in`, `/login`, `/register`, `/insights`, `/explore`, … | Consumer | Pathname → `ja` | **Unchanged.** Regression-tested. |
| 120Q いま色テスト runtime, scoring, taxonomy | Consumer | — | **Not touched by this package.** |

## Shared files — the only overlap

| File | Why shared | Change in this package |
|---|---|---|
| `proxy.ts` | Derives locale for every request | Corporate paths resolve `?lang` against the registry; consumer paths keep pathname semantics **exactly** as before |
| `app/layout.tsx` | Owns `<html>` | Sets `lang`/`dir`/`data-script` from the registry; header is authoritative over cookie |
| `app/robots.ts` | Crawl policy for both | **Unchanged** |

Both consumer behaviours are covered by explicit regression checks, because these three files are the
only place a corporate change could reach the consumer product.

## Locale strategy — and why it is a query parameter

Production doctrine is `/` for Japanese and `/{locale}/...` for everything else. That cannot be built
on this branch for two evidenced reasons:

1. **`/en` is an existing legacy consumer route.** A corporate `/en` collides with it directly.
2. **A root-level `[locale]` catch-all would shadow every unmatched top-level path**, so unknown URLs
   would stop returning 404 and start rendering a corporate page — re-breaking the dynamic-404 fix
   accepted in CORP-P4AR1/P4AR2.

The query parameter has neither problem. Locale is **non-sticky**: header and cookie are rewritten on
every matched request, so a later plain `/` returns to Japanese and choosing a language never becomes
a silent persistent preference. Selection propagates through every corporate link via `localeHref`.

`?lang=` URLs carry no canonical tag and no `hreflang`, because the canonical Production form is the
path-based one that does not exist yet. Full migration steps are in
`CORP_P5R2_ROUTING_MIGRATION.md`.

## 404 and crawl safety

Unknown paths still 404 through the corporate shell; no locale segment swallows them. Preview
deployments sit behind Vercel SSO deployment protection and are not publicly indexable regardless of
`robots.txt`.
