# CORP-P4AR1 — 404 Shell Isolation & Crawl Policy Remediation

**Package:** CORP-P4AR1 · **Date:** 2026-08-25 · **From:** `9f0e8ff`
**Prior verdict:** CORP-P4A **REVISE** · CORP-P4B **NOT AUTHORIZED**

> ## Verdict: `READY_FOR_CORP_P4B_DECISION`

---

## 0. The superseded claim, stated plainly

CORP-P4A reported that the corporate 404 **replaced** the consumer 404. **That claim was false and is
hereby superseded.** The page rendered *both* shells. The evidence was in the artefact I produced and
did not inspect: `test-results/corp-p4a-screens/corporate-404-390.png` visibly contains the consumer
heart-logo header, the corporate header, corporate 404 content, the consumer mobile bottom navigation
(今日 / 気づく / 探す / わたし), the corporate footer **and** the consumer footer.

I wrote a screenshot to disk, listed it as evidence, and never looked at it. The Founder did.

## 1. Defect 1 — double shell

### Root cause

`app/layout.tsx` wraps every render in `AppShell`. `AppShell` decided whether to render consumer
chrome from a **pathname allowlist** (`SHELL_SUPPRESSED_EXACT` / `_PREFIXES`). An allowlist can only
recognise paths that exist. For an unknown path — precisely what a 404 is — nothing matched, so the
consumer chrome mounted and wrapped `app/not-found.tsx`, which renders its own `CorporateShell`.

Adding `/an-entirely-unknown-path` to a list is impossible; the set of unknown paths is infinite.
The model, not the list, was wrong.

### Corrected architecture

Shell ownership is now decided by one pure module, `lib/corporate/routePolicy.ts`, and the default is
inverted:

```ts
shellOwner(pathname) !== "CONSUMER"  →  render children bare (corporate owns the page)
```

Consumer chrome renders **only** for a path that resolves to a real consumer page. Corporate routes,
API paths and every unknown path fall through to the corporate shell **by default rather than by
enumeration**. No CSS was used to hide anything.

### A second, deeper form of the same defect

Shell ownership initially followed the crawl **namespace**, which meant `/tests/nonexistent` — an
unknown child of a known namespace — would still be treated as consumer and double-shell one level
down. Crawl policy and shell ownership answer different questions, so they now use different rules:

| Question | Rule |
|---|---|
| May a crawler index this? | **Namespace-wide** — `/tests` and `/tests/anything` share one policy, because a crawler will try both |
| Which shell owns this render? | **Resolved route** — `/tests` is a real page and keeps consumer chrome; `/tests/nonexistent` is a 404 and does not |

### Evidence — DOM structure counts, not pixels

| Viewport | HTTP | consumer hdr | consumer bottom nav | consumer ftr | corporate hdr | corporate ftr | `main` | `h1` | Verdict |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 390 | 404 | **0** | **0** | **0** | **1** | **1** | 1 | 1 | **PASS** |
| 768 | 404 | **0** | **0** | **0** | **1** | **1** | 1 | 1 | **PASS** |
| 1440 | 404 | **0** | **0** | **0** | **1** | **1** | 1 | 1 | **PASS** |

Total `<header>` = 1 and total `<footer>` = 1 at every width. Deeper unknowns also clean:
`/tests/nonexistent`, `/line/nope`, `/reports/not-real`, `/me/xyz` — all 404, consumer chrome **0**,
corporate header **1**.

**Shell contamination failures: 0.**

### Consumer regression — shells unchanged

| Route | HTTP | consumer hdr | bottom nav | consumer ftr | corporate hdr |
|---|---:|---:|---:|---:|---:|
| `/me` · `/tests` · `/result` · `/saved` · `/login` · `/recommendations` · `/reports/sample` | 200 | 1 | 1 | 1 | 0 |
| `/line/mini-app` · `/check-in` | 200 | 0 | 0 | 0 | 0 |

`/line/mini-app` and `/check-in` were **already** chrome-free before this package (pre-existing
suppression entries) and remain so. No route was deleted, redirected, or had its authentication or
data behaviour changed.

## 2. Defect 2 — incomplete crawl policy

### The false claim

CORP-P4A's robots candidate asserted that everything personal, authenticated, internal and legacy was
disallowed. The repository has **135 page routes**; the list named roughly twenty. About **28 legacy
public routes were crawlable**, including `/ai-advisor`, `/business`, `/concept`, `/connect`, `/en`,
`/experiences`, `/explore`, `/formal-check`, `/insights`, `/legal`, `/methodology`, `/notice`,
`/online-check-in`, `/open-testing`, `/partners`, `/pilot`, `/privacy`, `/product`, `/products`,
`/progress`, `/recommendations`, `/report-loading`, `/report-preview`,
`/reservation-mobility-support`, `/services`, `/support`, `/terms`, `/vision`.

Rules were also written only in prefix form (`/tests/`, `/line/`, `/share/`, `/reports/`,
`/dashboard/`), which does not necessarily cover the exact path.

### The fix — default deny

```
Allow: /$            ← anchored: the root only, not a prefix for the whole tree
Allow: /mirai-move   /kakari   /about
Disallow: /          ← everything else, including anything nobody remembered
```

Omission now **blocks** rather than exposes. Sensitive groups are still listed explicitly and
redundantly, in both exact and descendant form, so the policy stays legible and a future loosening of
the default cannot silently expose them.

### Census totals — from the filesystem

| Classification | Count |
|---|---:|
| `CORPORATE_INDEXABLE` | **4** |
| `CORPORATE_BLOCKED_NOINDEX` | 2 |
| `PROTOTYPE_NOINDEX` | 12 |
| `LEGACY_PUBLIC_NOINDEX` | 76 |
| `PERSONAL_OR_AUTH_NOINDEX` | 30 |
| `ADMIN_INTERNAL_NOINDEX` | 9 |
| `DEV_INTERNAL_NOINDEX` | 2 |
| `API_NON_PAGE` | 90 handlers |
| **Unclassified** | **0** |

Full table in `CORP_P4AR1_ROUTE_CRAWL_CENSUS.md`.

### Crawl matrix — 24 routes, 0 mismatches

Every required route resolves to its intended classification, sitemap inclusion, indexability and
shell owner. Notable rows: `/tests` and `/tests/c02` share `LEGACY_PUBLIC_NOINDEX`; `/line` and
`/line/mini-app` share it too, while their shells differ correctly because `/line` has no page;
`/api/build-identity` is `API_NON_PAGE` / shell `NONE`; `/an-entirely-unknown-path` is `UNKNOWN` /
shell `CORPORATE` / excluded / noindex.

**Sitemap: exactly 4 URLs, 0 unexpected.**

## 3. One policy, four consumers

`lib/corporate/routePolicy.ts` is pure — no imports, no I/O, no framework types — and is used by the
shell, `robots.ts`, `sitemap.ts` and the tests, so those four cannot disagree. A consistency test
re-walks the App Router filesystem and fails if the module drifts from it.

## 4. Tests that fail against `9f0e8ff`

15 deterministic tests, all passing. The load-bearing ones: unknown paths belong to the corporate
shell; unknown paths fail safe; unknown children of consumer namespaces still get the corporate
shell; exact and descendant forms share crawl policy; allowing root does not expose unmatched
routes; the 28 omitted legacy routes are classified and blocked; API routes own no shell; the census
matches the filesystem.

## 5. Corporate quality unchanged

axe WCAG 2.2 AA **0 violations / 0 serious** across 30 route × viewport combinations · 0 overflow ·
0 clipped · 0 tap <44px · **0 external and 0 Supabase/auth/API requests** · 0 console errors ·
**0 prohibited claims** · `navViolations 0` · reduced motion 0/0 · 13/13 focus stops. Heights
identical to accepted P3R1 (home 1440 4130, 390 6425, 768 5184). `tsc` 0 · `npm run lint` 0 ·
`build` 0. **Lighthouse 100/100/100/100** on all four indexable routes.

## 6. Before / after

| | CORP-P4A (`9f0e8ff`) | CORP-P4AR1 |
|---|---|---|
| 404 shells | **2** (consumer + corporate) | **1** (corporate) |
| Consumer bottom nav on 404 | **present** | **absent** |
| Robots default | `Allow: /` + partial list | `Disallow: /` + 4 anchored allows |
| Legacy routes crawlable | ~28 | **0** |
| Routes classified | ad-hoc | **135 / 135** |
| Policy sources | 3 files, no consistency check | **1 module + a drift test** |

Before: `test-results/corp-p4a-screens/corporate-404-390.png`
After: `test-results/corp-p4ar1-screens/corporate-404-{390,768,1440}.png`
Consumer: `consumer-tests-390.png`, `consumer-me-390.png`, `consumer-login-390.png`
Rendered policy: `robots-rendered.txt`, `sitemap-rendered.xml`

## 7. Remaining CORP-P4B decisions

Per-route disposition for all 117 consumer routes — `RETAIN_GATED` / `REDIRECT` / `RETIRE` /
`REPLACE`. Nothing in CORP-P4AR1 decided any of them; every consumer route still behaves exactly as
before. The four release blockers remain open, and **production `/company` still publishes
代表取締役** — untouched, and still not fixed.

## 8. What I am changing about how I report

I listed a screenshot as evidence without opening it. Artefacts I generate are now inspected before
being cited, and structural claims about rendered output are asserted by counting DOM nodes rather
than by describing intent.
