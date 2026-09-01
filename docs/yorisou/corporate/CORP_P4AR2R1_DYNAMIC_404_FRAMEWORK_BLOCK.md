# CORP-P4AR2R1 — Dynamic 404 remediation: FRAMEWORK BLOCKED, and a completion-truth correction

**Result:** `CORP_P4AR2R1_FRAMEWORK_BLOCKED`
**Status:** LOCAL ONLY — never pushed, never deployed. Production untouched.
**Branch:** `product/corporate-homepage-preview`, preflight HEAD `ed03bdc`
**Evidence:** `test-results/corp-p4ar2r1-evidence/`, `test-results/corp-p4ar2r1-browser/`

---

## 1. The completion claim that was false

CORP-P4AR2 reported `YORISOU_CORP_P4AR2_READY_FOR_CORP_P4B_DECISION`. **That verdict was wrong and
is withdrawn.** The mandate required rendered corporate 404s for invalid dynamic routes. At least
three families did not render one. The truthful marker was:

```
CORP_P4AR2_DYNAMIC_404_NOT_ISOLATED
```

The defect was described in the CORP-P4AR2 report and then contradicted by the verdict on the same
branch. A known blank 404 is incompatible with a READY verdict. `/connect/pair/[pairId]` was
required by that mandate and was **omitted from the comparison evidence entirely**; it is tested
here and it fails the same way.

---

## 2. Measured current state at `ed03bdc` (production build, raw HTTP)

`test-results/corp-p4ar2r1-evidence/raw-response-contract.json`

| Case | Status | `__next_error__` | SSR body chars | corporate 404 in HTML | hdr/ftr/h1 |
|---|---|---|---|---|---|
| `/share/not-a-uuid` | 404 | **yes** | **0** | **no** | 0/0/0 |
| `/share/00000000-…-000000000000` | 404 | **yes** | **0** | **no** | 0/0/0 |
| `/connect/invite/not-a-uuid` | 404 | **yes** | **0** | **no** | 0/0/0 |
| `/connect/invite/00000000-…` | 404 | **yes** | **0** | **no** | 0/0/0 |
| `/connect/pair/not-a-uuid` | 404 | **yes** | **0** | **no** | 0/0/0 |
| `/connect/pair/00000000-…` | 404 | **yes** | **0** | **no** | 0/0/0 |
| `/reports/self-understanding/bogus` | 404 | **yes** | **0** | **no** | 0/0/0 |
| `/an-entirely-unknown-path` | 404 | no | 274 | yes | 1/1/1 |
| `/insights/does-not-exist` | 404 | no | 274 | yes | 1/1/1 |
| `/mirai-move-old` | 404 | no | 274 | yes | 1/1/1 |

Status, `<title>` and `<meta robots noindex>` are correct on all ten. **The body is empty on seven.**

### 2.1 A second defect, not previously reported: the hydrated 404 is DOUBLE-SHELLED

`test-results/corp-p4ar2r1-browser/matrix.json`, and visible in
`test-results/corp-p4ar2r1-browser/contact-sheet.png`. After JavaScript runs, the client renders the
404 **inside the root layout**, so `AppShell` mounts around it:

| Route | 390 | 768 | 1280 | 1440 |
|---|---|---|---|---|
| `/share/not-a-uuid` | 2 hdr / 2 ftr, consumer nav | same | same | same |
| `/connect/pair/not-a-uuid` | 2 hdr / 2 ftr, consumer nav | same | same | same |
| `/reports/self-understanding/bogus` | 1/1 | 1/1 | 1/1 | 1/1 |
| `/an-entirely-unknown-path` | 1/1 | 1/1 | 1/1 | 1/1 |

The consumer header (気づく・探す・わたし, LINEで続ける, ログイン) sits directly above the corporate
header. This is the **same double-shell defect CORP-P4AR2 claimed to have eliminated**, still present
on these routes — the server never renders it, so the CORP-P4AR2 scriptless HTML checks could not
see it. `/reports/self-understanding` escapes only because it is already in
`SHELL_SUPPRESSED_PREFIXES`.

`shellOwner("/share/<anything>")` returns `CONSUMER` because the pathname matches the dynamic
pattern — the identical invalid inference CORP-P4AR2 removed from the server, still operating on the
client.

---

## 3. Root cause, traced through Next.js 16.2.10

`node_modules/next/dist/server/app-render/app-render.js`. On the **dynamic render** path, a
`notFound()` is handled by `getErrorRSCPayload`, whose seed document is literally:

```js
createElement('html', { id: '__next_error__' },
  createElement('head', null),
  createElement('body', null, /* dev-only error template */ null))
```

with the source comment: *"For metadata notFound error there's no global not found boundary on top
so we create a not found page with AppRouter."* The 404 UI is shipped in the RSC flight payload and
rendered **by the client**. The server body is empty by construction.

The branch that server-renders a real not-found boundary exists only on the **prerender** path:

```js
if (cacheComponents && isHTTPAccessFallbackError(err)) {
  const boundaryTree = findPrerenderHTTPErrorBoundaryTree(tree, triggeredStatus, …)
  if (boundaryTree) prerenderHTTPError = { boundaryTree, triggeredStatus }
}
const errorRSCPayload = prerenderHTTPError
  ? await …getRSCPayload(tree, ctx, { is404: errorType === 'not-found', prerenderHTTPError })  // full SSR
  : await …getErrorRSCPayload(…)                                                               // empty seed
```

There is **no equivalent branch on the dynamic path**. `NoFallbackError` in the server log is a
separate, correctly-handled control-flow signal (it is how `dynamicParams: false` produces a
router-level 404); it is not the cause.

### 3.1 Minimal reproduction — this is not a Yorisou defect

A stock Next.js 16.2.10 app: plain static root layout, standard root `not-found.tsx`, no
`global-not-found`, no experimental flags, no middleware, **none of this repository's code**
(`test-results/corp-p4ar2r1-evidence/min-build.log`):

| Route | Status | `__next_error__` | SSR body |
|---|---|---|---|
| `/d/bad` (`force-dynamic` page calling `notFound()`) | 404 | **yes** | **empty** |
| `/d/ok` (same route, valid) | 200 | no | `valid` |
| `/totally-unknown-path` (router-level) | 404 | no | `MINAPP CORPORATE 404` |

**Conclusion: in Next.js 16.2.10, `notFound()` raised during a dynamic render cannot produce a
server-rendered 404 body.** Only router-level 404s can.

---

## 4. Solutions attempted, and what each did

| # | Attempt | Result |
|---|---|---|
| 1 | `app/global-not-found.tsx` (CORP-P4AR2) | Fixed router-level 404s. **No effect** on dynamic-render 404s. |
| 2 | `export const dynamic = "force-dynamic"` on the 404 document | `/_not-found` became `ƒ`; all seven routes still returned the empty document. |
| 3 | Segment-level `not-found.tsx` inside the dynamic segment | **No effect** — still `__next_error__`, still empty. Verified on a probe route. |
| 4 | Restore `app/not-found.tsx` alongside the global document | Fixed only the `<title>`, which had regressed to the consumer marketing title. Body still empty. |
| 5 | Isolate the variable: probe routes with plain-dynamic / `force-dynamic` / `generateStaticParams` / `dynamicParams:false` | **All four failed identically.** The variable is dynamic rendering itself, not any route option. |
| 6 | Make the root layout static (drop `headers()`/`cookies()`) so routes can prerender — diagnostic only, reverted | **Build fails**: Next then prerenders the whole app and `/tests/ima-iro` errors during export. Not viable, and out of authorized scope. |
| 7 | `experimental.cacheComponents` — the one flag that enables the SSR branch | Build **rejects** `export const dynamic = "force-dynamic"`. Without it, the build fails with *"Uncached data was accessed outside of `<Suspense>`"*. Satisfying it means wrapping each route's data access in Suspense — which commits the shell and the HTTP status **before** validity is known. That is a material change to share/invite/pair/report rendering. |

Per the mandate's stop condition, I stopped here rather than forcing a workaround.

**No file under `app/share/**`, `app/connect/**` or `app/reports/self-understanding/**` was
modified.** There is therefore no valid-path regression risk from this package.

---

## 5. Why the obvious workarounds are wrong, not merely unavailable

- **Rewrite malformed ids to a 404 route in middleware.** A regex can identify a malformed id but
  not an unknown-but-well-formed one. Malformed would then render a full corporate 404 while unknown
  stayed blank — making the two **distinguishable**, which breaks the concealment requirement that
  invalid, revoked, unauthorized and unavailable states are indistinguishable. Actively harmful.
- **Return 200 with 404 content, or redirect to `/`.** Both forbidden by the mandate, and both wrong.
- **Hide the extra shell with CSS, or unmount it after hydration.** Forbidden, and it would not add
  the missing server-rendered body.
- **`generateStaticParams` + `dynamicParams: false`.** Would 404 every valid share, invite, pair and
  report, because valid ids are user data unknowable at build time.

---

## 6. Concealment and regressions — verified intact

`test-results/corp-p4ar2r1-evidence/contract-tests.txt` — 11 tests, **7 fail (the open defect),
4 pass**:

- **CONCEALMENT passes.** Malformed and well-formed-unknown ids are byte-for-byte indistinguishable
  in status and body for share, invite and pair. No failure reason is disclosed. Both local gates
  (`sharingOperational`, `connectionOperational`) are **false**, so gate-off, malformed, unknown and
  revoked all conceal identically as 404.
- **Router-level 404s** still render the corporate 404 server-side with exactly 1 header / 1 footer.
- **robots.txt** still has exactly four anchored `Allow` rules plus `Disallow: /`.
- **sitemap.xml** still has exactly the four corporate URLs.
- **axe** WCAG 2.0/2.1/2.2 A+AA at 390 and 1280 across all four cases: **0 violations**.
- **Console errors:** one distinct message, the 404 resource fetch itself. No overflow at any width.

### 6.1 Valid-path coverage — stated honestly

The valid path **could not be exercised in a browser**. `sharingOperational()` and
`connectionOperational()` are both `false` in this local environment, so every share, invite and
pair request conceals as 404 regardless of id. Enabling those flags is forbidden by this mandate,
and Production user data may not be used. **I did not verify valid share/invite/pair rendering in a
browser, and I do not claim to have.** What is established instead: this package changed **no file**
in those route families, so their valid behaviour is byte-identical to `ed03bdc`.

---

## 7. Narrowest safe alternatives, for Founder decision

None of these are implemented.

1. **Accept and document.** These URLs are unguessable, crawl-blocked, and correctly return 404 with
   the right title and `noindex`. The cost is a blank page for no-JS clients and crawlers, plus the
   double shell for JS clients. Cheapest; the defect stays open.
2. **Suppress consumer chrome on `/share`, `/connect/invite`, `/connect/pair`** by adding them to
   `SHELL_SUPPRESSED_PREFIXES`. This removes the **double shell** (not the blank body) and would
   need only a small change. **It also changes how the VALID pages render** — a public share card
   would lose the consumer header and bottom nav. Arguably correct for a public deep link, but it is
   a change to valid presentation and therefore **requires explicit Founder authorization**.
3. **Adopt Cache Components** (`experimental.cacheComponents` + `<Suspense>` per route). Enables the
   framework's SSR not-found branch, but is an app-wide rendering-model migration and changes when
   the HTTP status is committed. Large, and not a CORP-P4 decision.
4. **Upgrade or patch Next.js**, or raise it upstream. The mechanism is isolated to one branch in
   `app-render.js`; a future version may add the dynamic-path equivalent. **Re-test on any upgrade.**
5. **Reconsider under CORP-P4B**, alongside the route-group question already recorded as D-2, since
   that package restructures routing anyway.

---

## 8. What this package changed

| File | Change |
|---|---|
| `lib/server/__tests__/corpP4ar2r1DynamicNotFoundContract.test.ts` | **new** — the contract as an executable requirement. 7 tests fail by design, recording the open defect. Skips (never passes) without a server. |
| `docs/yorisou/corporate/CORP_P4AR2R1_DYNAMIC_404_FRAMEWORK_BLOCK.md` | **new** — this document |
| `docs/yorisou/corporate/CORP_P4AR2_*.md` | supersession notices added; history preserved |
| `app/global-not-found.tsx` | corrected the comment that described the blank 404 as an accepted, understood cost |
| `lib/corporate/routePolicy.ts` | corrected the "cannot disagree" claim |

**Nothing in `app/share/**`, `app/connect/**`, `app/reports/**`, `next.config.ts`, `app/robots.ts`,
`app/sitemap.ts`, `app/not-found.tsx` or `app/_notFound/**` was modified.**
