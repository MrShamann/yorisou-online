# CORP-P4B — SEO and route-disposition decision input

**Status:** DECISION INPUT ONLY. Nothing here is authorized, and nothing here is implemented.
CORP-P4B is **not** started. Produced by CORP-P4AR2 from measured evidence.

This document exists so the CORP-P4B decisions are made by the Founder on numbers, rather than
inherited from a previous package's assumptions. Each item states what is known, what is unknown,
and what the options cost. No option is enacted.

---

## D-1 — 93 routes rest on robots.txt alone

**Measured:** 131 of 135 page routes are crawl-blocked. Only **8** emit a verified `noindex`
directive. **93** are `ROBOTS_CRAWL_BLOCKED_ONLY` — blocked from crawling, with no index directive
of any kind.

**Why it matters:** `Disallow` and `noindex` are not interchangeable, and cannot be combined on the
same URL. A `Disallow`ed URL can still be indexed from external links, listed without a snippet, and
a `noindex` added to such a page is unreachable — the crawler is forbidden to fetch the directive
that would exclude it.

**Options:**

| | Approach | Cost |
|---|---|---|
| A | Keep `Disallow` only | Cheapest, status quo. A legacy URL already linked externally can remain listed indefinitely, and nothing can be done about it short of removal requests. |
| B | Allow crawling + serve `X-Robots-Tag: noindex` on the legacy namespaces | Actually removes them from the index over time. Costs crawl budget and means deliberately letting a crawler fetch archived consumer pages. |
| C | B for externally-linked routes only, A for the rest | Needs external link data the repository does not contain — see D-5. |

**Recommended for decision, not enacted:** C, contingent on D-5. B is the only option that truly
de-indexes; applying it blindly to all 93 exposes archived surfaces to crawling for no benefit.

---

## D-2 — The `globalNotFound` experimental flag

**Measured:** `app/global-not-found.tsx` is what structurally prevents consumer chrome on a 404. It
requires `experimental: { globalNotFound: true }` in Next.js 16.2.10 — supported and opt-in, and it
may change before it stabilises.

**Options:**

| | Approach | Cost |
|---|---|---|
| A | Keep the flag | Zero further work. Carries an experimental-API dependency into whatever gets published. |
| B | Move consumer routes into an `app/(consumer)/` route group so the shell lives in a group layout and the root layout stays bare | Removes the flag dependency entirely and is the architecturally correct end state. Relocates ~117 route directories. URLs are unchanged by a route group, but the diff is large and touches every consumer route. |

**Note:** CORP-P4B is *already* a route transition, so B is dramatically cheaper there than it was in
CORP-P4AR2, where it was rejected purely as out of scope. **Re-confirm the flag's status in the
Next.js version being published before choosing A.**

---

## D-3 — Three dynamic routes serve a blank 404 (pre-existing)

**Measured:** `/share/[publicId]`, `/connect/invite/[publicId]` and
`/reports/self-understanding/[publicCode]` raise `Error: Internal: NoFallbackError` and serve
Next.js's internal error document — `<html id="__next_error__">` with an empty `<body>` — instead of
the corporate 404. A crawler or a no-JS client receives a blank page under a 404 status.

Present at `29fce73`, **unchanged** by CORP-P4AR2, and verified by running both production builds
side by side. Two remedies were tried and failed (a `force-dynamic` 404 document; the shared-body
split). The correlation is with dynamic rendering: routes with `generateStaticParams` +
`dynamicParams = false` render the 404 correctly; `force-dynamic` routes that call `notFound()` from
inside a dynamic render do not.

**Why it was not fixed here:** the fix means changing `dynamic` / `dynamicParams` configuration on
consumer **share, invite and report** routes. CORP-P4AR2 is forbidden to modify consumer route
behaviour, and these are exactly the routes whose valid behaviour is protected.

**Options:** (A) accept — these URLs are unguessable and crawl-blocked, so real-world exposure is
low; (B) change the dynamic configuration, with a full re-test of share/invite/pair behaviour;
(C) raise upstream with Next.js. **Requires explicit Founder authorization to touch these routes.**

---

## D-4 — Query-string and trailing-slash variants of corporate URLs are blocked

**Measured:** anchoring with `$` means the matched value — which includes the query string — must
end there. `/about?utm_source=x` and `/about/` do not match `Allow: /about$` and are not crawlable.
`/about/` 308-redirects to the canonical form, which is allowed.

**Consequence to confirm:** if the corporate site is ever promoted with campaign-tagged URLs, those
tagged URLs will not be crawlable. The canonical page still is. Deliberate, and cheap to revisit —
but it should be a decision, not a surprise.

---

## D-5 — What this repository cannot tell you

Recorded so CORP-P4B does not mistake absence of data for absence of risk:

- **Which legacy URLs are already indexed, and which have external inbound links.** Not derivable
  from the repository. Requires a Search Console or third-party check. **No Search Console action
  was taken** — it is outside every authorization granted so far. D-1 option C depends on this.
- **What `noindex` the 11 dynamic routes emit when they render successfully.** Unmeasured, because
  probing them needs share ids, invite tokens, report codes or user ids. Reported as `UNVERIFIED`
  rather than assumed.
- **Whether the 12 routes returning 404 in this build are permanently retired or feature-flagged
  off.** Observed as 404; their intent is not in the repository.

---

## D-6 — Company registration source is still the blocking release blocker

Unchanged and restated: `/company` and `/contact` remain crawl-blocked and out of the sitemap because
商号・所在地・設立・代表者・法人番号 have no verified source. This is `COMPANY_REGISTRATION_SOURCE_REQUIRED`,
carried forward from CORP-P1. **No corporate route may be published while it stands.**

---

## Carried-forward constraints (still in force)

- Preview only. Never pushed, never deployed. Production untouched.
- No consumer route retired, deleted or redirected.
- No Search Console action.
- PR #127 untouched.
- Lifecycle PAUSED; merge, deploy and push permissions NONE.
