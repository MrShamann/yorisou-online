# CORP-v1.2 — release blockers before Production

> **Updated after CORP-v1.2R1.** Closed since v1.2: mobile performance (now 91/91/93), the repository
> authority conflict (root entrypoint now routes two surfaces), most dependency exposure (production
> highs 5 → 1), and locale Production posture (now a typed gate). Still open: everything below.
> Full detail in `CORP_V12R1_PREMERGE_REMEDIATION.md`.

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

## 6. Translation review — OPEN (now typed, not prose)

Since v1.2R1 this is enforced in the registry rather than described in prose: ja and en are
`status: "published"` (Production-cleared); the other 19 are `status: "preview_only"` and a test
asserts Production routing cannot serve them. They remain fully available in Preview.

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

## 8. Consumer Today surface is missing — CI is correctly red

Investigated in CORP-v1.2R1. This is **not** a stale test binding, which is what it looked like:

`archP3DailyDiscovery.test.ts` assertion **L/M** requires the consumer Today composition — utility
hero → continuity → 今日のひとつ → 5-minute actions. Until commit `9f0e8ff`, `app/page.tsx` was
literally `export default function TodayPage()` and contained all four in order. That commit
promoted the corporate site to the root URLs and **did not relocate Today anywhere**.

The composition now exists in **no file**: `5分でできること` appears only inside the test itself, and
`app/TodaySavedState.tsx` / `app/TodayDiscoveryEntry.tsx` are rendered by nothing. `app/today/`
retains only `check-in/` and `discovery/`.

So the failing assertion is reporting a **real, current gap in the consumer product**, not noise.
The guard was deliberately **not** rebound: no current file contains the composition, so pointing
the assertion elsewhere would silently delete the protection while turning CI green.

The other 20 assertions in that file still pass, so discovery core, the pack, fail-closed behaviour
and the refused shapes remain protected.

**Decision required (consumer product, not corporate):** restore the Today landing at some route, or
consciously retire it and retire assertion L/M with a recorded rationale. Until then CI stays red,
and that is the honest state.

## 9. Production approval — REQUIRED

No Production deployment, DNS change, domain change, database mutation or Vercel Production promotion
is authorized by this package, and none was performed.

## Explicitly NOT blockers

- Vercel Preview returning 302 to SSO — that is deployment protection working as intended.
- SEO scores on `/company` and `/contact` — those routes are intentionally crawl-blocked.
