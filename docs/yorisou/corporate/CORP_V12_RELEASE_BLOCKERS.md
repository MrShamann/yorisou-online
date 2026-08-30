# CORP-v1.2 — release blockers before Production

Everything below must close before this corporate site can go to Production.
None of these is resolved by this package. An unresolved blocker is never recorded as a pass.

## 1. Founder acceptance — OPEN

Final visual and content acceptance of the v1.2 refoundation has not been given. The Preview exists
for exactly that purpose.

## 2. Repository and branch protection — OPEN

`main` is **not branch protected** and the repository is **public with no explicit licence metadata**.
Neither was changed by this package (out of scope). Both are Production governance decisions:

- Should `main` require review before merge?
- Public repository with no licence means "all rights reserved" by default, not open source. If the
  corporate site is to stay here, that posture should be deliberate rather than inherited.

## 3. Production routing and domain — OPEN

`yorisou.online` currently serves the **legacy consumer product**. Every corporate decision below is
unmade:

- Does the corporate site take the apex domain, a subdomain, or a separate domain?
- Where does the consumer product live afterwards?
- Locale routing must migrate from `?lang=` to `/{locale}/...`, which is gated on the disposition of
  the legacy consumer `/en` route. Steps are in `CORP_P5R2_ROUTING_MIGRATION.md`.
- `/about` still carries the "how we build" page. Renaming it to `/how-we-build` is a Production
  routing decision because `/about` is one of only four anchored crawlable paths.

## 4. Indexability — OPEN

`robots.ts` is unchanged. Today `/ventures`, `/chigamo`, `/build-with-us`, `/company` and `/contact`
are **not crawlable**. Before Production someone must decide which corporate routes become
indexable and add them to `CORPORATE_INDEXABLE` with anchored rules. Lighthouse reporting SEO 63 on
blocked routes is that policy working, not a defect.

## 5. Contact delivery — BLOCKED

- `BLOCKED_BY_RESEND_ACCESS` — no valid credential; outbound delivery is unverified.
- `BLOCKED_BY_DNS_ACCESS` — no authoritative DNS access for apex MX / SPF / DKIM / DMARC.

The Contact page and `/api/corporate-contact` are structurally complete, hold no secret and expose no
private address. **The form must not claim a delivery it cannot perform** until an end-to-end send is
verified.

## 6. Translation review — OPEN

19 of 21 locales are AI-translated from the Japanese canonical source and have **not** been reviewed
by a native speaker. They are complete, type-checked and claim-bounded, but fluency and register are
unverified. Highest-risk locales for a first human pass: **ar** (RTL and the only right-to-left
surface), **ko**, **zh-CN**, **zh-TW**, **hi**, **th**, **ru**.

## 7. Claim evidence still outstanding — OPEN

| Claim | What is missing |
|---|---|
| **Chigamo** | No canonical source exists — no repository, not in the project registry, not in this repo. It is published as concept-stage thesis only. Any stronger statement needs a real source. |
| **Asterion Foundry licence** | Not evidenced as executed. The site therefore never says Yorisou is licensed to use Asterion, only that Asterion is independent and positioned within the architecture. |
| **Asterion rights holder** | Not evidenced. No ownership statement of any kind is published. |
| **University / government / corporate collaboration** | No agreements exist. Published strictly as invitations. Any named institution needs written permission. |
| **Venture legal status** | Mirai Move, Kakari and Chigamo are not incorporated as separate companies. The Ventures page says so explicitly. |

## 8. Known CI failure — PRE-EXISTING, needs a scope decision

`Lint, Build & Env Check` fails on `lib/server/__tests__/archP3DailyDiscovery.test.ts`, assertion
`L/M`, which requires `app/page.tsx` to be the consumer "Today" surface. The root route stopped being
Today at commit `9f0e8ff`, and **PR #154 (CORP-P5) and PR #155 (CORP-P5R1) fail the identical
check**. It is inherited by the corporate track, not introduced by this package.

The guard was **not** weakened, skipped or rewritten to obtain green CI. Closing it requires a Founder
decision about that test's scope now that the root route belongs to the corporate surface.

## 9. Production approval — REQUIRED

No Production deployment, DNS change, domain change, database mutation or Vercel Production promotion
is authorized by this package, and none was performed.

## Explicitly NOT blockers

- Vercel Preview returning 302 to SSO — that is deployment protection working as intended.
- SEO scores on `/company` and `/contact` — those routes are intentionally crawl-blocked.
