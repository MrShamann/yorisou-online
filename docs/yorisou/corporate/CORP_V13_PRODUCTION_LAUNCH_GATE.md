# CORP-v1.3 — Production Launch Gate

**Status at the time of writing: NOT LAUNCHABLE.** Nine items are closed by this package. Eight
remain, and each one below states exactly what would close it, who can close it, and how to check.

This document replaces prose with a gate. An item is `CLOSED` only when there is a command or an
artefact that shows it; anything else is `OPEN` or `BLOCKED` and says why. Nothing here records an
intention as a result.

**Scope note.** "Launchable" means: the corporate site may be promoted to Production behind a
Founder release decision. It does not mean any of that has been authorised. No Production
deployment, DNS change, domain change, database mutation or Vercel promotion was performed by this
package, and none is authorised by it.

---

## A. Closed by CORP-v1.3

| # | Item | Was | Now | Verify |
|---|---|---|---|---|
| A1 | **Venture count framing** | "Three areas, underway now" in 21 locales — counting a concept-stage hypothesis as a venture under construction | The headline states no count. The composition is computed from evidence: **2 in build · 1 at concept** | `node --import tsx --test tests/corporate-p5r2/brandSystem.test.ts` |
| A2 | **Share-card framing** | "Mirai Move, Kakari and Chigamo are underway" — the site's most-copied sentence | Names the two being built and says the third is a concept, in all 21 locales | same suite, "the share card never presents the concept-stage venture as one that is underway" |
| A3 | **Brand system** | A logo added in R3 with no relationship to anything else on the page | One registry with provenance for all four brands; palette **sampled from the artwork** and asserted by decoding the PNG | `node tests/corporate-qa/brandpaint.mjs` — 84 accent marks measured, 0 pre-logo colours painted |
| A4 | **Browser identity** | Tab, home screen and share card showed the **purple consumer-product heart**, and the fallback title introduced the company as a self-reflection service | Icon, apple-touch icon, OG and Twitter cards generated from the artwork; corporate title; `theme-color` in both schemes | `curl -s localhost:3111/ \| grep -E 'icon\|theme-color\|og:image'` |
| A5 | **Locale resolution on three routes** | `/ventures`, `/chigamo` and `/build-with-us` never read `?lang=`. **60 pages** served translated bodies inside `<html lang="ja" dir="ltr">` — Arabic announced to assistive technology as Japanese | The proxy derives its path set from the route policy; a new corporate route is locale-resolved by construction | `node tests/corporate-qa/sweep.mjs` — 189/189 |
| A6 | **Indexability** | 4 of 9 corporate routes crawlable; the Ventures index was not | 7 crawlable, each `$`-anchored. `/company` and `/contact` stay blocked with conditions in §B | `node --import tsx --test lib/server/__tests__/corpP4ar*.test.ts` |
| A7 | **Contact page honesty** | The page said "we read every enquiry and reply in turn" and, on submit, "we have received your enquiry" — while the transport had no credential and the endpoint returned 503 to every message | The form renders only when the transport is configured; otherwise the page says so. Page and endpoint read one predicate | `lib/corporate/contactDelivery.ts`; see B3 |
| A8 | **404 identity** | Rendered the frozen pre-v1.2 prototype shell: old wordmark, five-item nav with no Ventures, the retired consumer tagline, and a footer note claiming the corporate number was not yet published | Renders the current Shell, copy and brand system | `curl -s localhost:3111/no-such-page \| grep -c 'yorisou-logo'` |
| A9 | **Production dependency vulnerabilities** | 1 high (`js-yaml`, quadratic CPU in `!!omap`) | **0** | `npm audit --omit=dev` |

Two governance records were also corrected rather than left to drift:

- **Claim ledger C-05** said the registration number was omitted for want of evidence. It has in fact
  been published in every locale since `8be233c`, verified against the National Tax Agency
  publication site. Split into C-05 (capital, founding date, street address — still omitted) and
  **C-05a (法人番号 2290003018125 — VERIFIED, published)**.
- Eleven new ledger rows, C-39 to C-49, cover everything this package publishes.

---

## B. Open — Founder decision or credential required

Nothing below can be closed from inside the repository.

### B1. Founder acceptance of the v1.3 surface — OPEN · Founder

Closes when the Founder accepts, on the Preview: the reconciled palette, the venture count framing,
the venture accent marks, the footer strapline, the browser identity and the 404.

The palette change is the one to look at first and is **one commit to revert** if rejected: five
token values in `app/_corporate/p5r2/site.module.css` and their propagation. No layout, type or
composition changed.

### B2. Domain and routing — OPEN · Founder

`yorisou.online` currently serves the legacy consumer product. Four unmade decisions:

1. Does the corporate site take the apex, a subdomain, or a separate domain?
2. Where does the consumer product live afterwards?
3. Locale routing must migrate from `?lang=` to `/{locale}/…`. Gated on (2), because the legacy
   consumer `/en` route is what makes the pathname regime ambiguous. Steps: `CORP_P5R2_ROUTING_MIGRATION.md`.
4. `/about` still carries the "How we build" page. Renaming it to `/how-we-build` is a routing
   decision because `/about` is an anchored crawlable path.

**Consequence to state plainly:** the site-level icon and title are now the corporate ones, so the
legacy consumer routes in this repository inherit the corporate favicon and fallback title. That is
correct while the root is corporate, and it is a reason (2) should not stay unanswered.

### B3. Contact delivery — BLOCKED · credential + DNS

Two independent blockers, both outside the repository:

- `BLOCKED_BY_RESEND_ACCESS` — no valid credential, so `RESEND_API_KEY`, `CORPORATE_CONTACT_TO` and
  `CORPORATE_CONTACT_FROM` are unset and the form is correctly not shown.
- `BLOCKED_BY_DNS_ACCESS` — no authoritative DNS access for apex MX / SPF / DKIM / DMARC.

Closes in two steps, in this order:

1. Set the three environment variables. The form and its promise return with no code change.
2. **Verify one end-to-end send and record it.** Configuration is not delivery. Only after a
   verified send may `/contact` move from `CORPORATE_BLOCKED` to `CORPORATE_INDEXABLE`.

### B4. Repository governance — OPEN · Founder

Machine-verified 2026-08-31: `main` is **not branch protected**, the repository is **public**, and it
has **no licence** (`license: null`, no `LICENSE` file). Public with no licence means all rights
reserved by default — an inherited posture, not a chosen one. Two decisions: whether `main` requires
review, and what the licence should be.

### B5. Translation review — OPEN · native speakers

ja and en are `published`; the other 19 are `preview_only` and a test asserts Production routing
cannot serve them. They are complete, type-checked and claim-bounded; fluency and register are
unverified. Highest risk for a first human pass: **ar** (the only RTL surface), **ko**, **zh-CN**,
**zh-TW**, **hi**, **th**, **ru**.

CORP-v1.3 adds roughly 90 new strings per locale-set: two composition labels, two contact-state
strings, two headings and one footer line per locale. They are in the same review scope.

### B6. Claim evidence still outstanding — OPEN

| Claim | What is missing | How the site behaves meanwhile |
|---|---|---|
| **Chigamo** | No canonical source of any kind | Published as concept only, and now **visually** as concept: no colour, an open outline, and it is counted separately |
| **Asterion Foundry licence** | Not evidenced as executed | The site never says Yorisou is licensed to use Asterion |
| **Asterion rights holder** | Not evidenced | No ownership statement is published |
| **University / government / corporate collaboration** | No agreements exist | Published strictly as invitations |
| **Venture legal status** | None is incorporated separately | The Ventures page says so outright |

### B7. Consumer Today surface — OPEN · consumer decision, **not** corporate

`archP3DailyDiscovery.test.ts` assertion L/M requires the consumer Today composition, which exists in
no file since commit `9f0e8ff` promoted the corporate site to the root URLs without relocating it.
CI is correctly red: the assertion reports a real gap in the consumer product.

The guard was deliberately **not** rebound. Pointing it at another file would turn CI green by
deleting the protection. Decision required: restore Today at some route, or retire it and retire
assertion L/M with a recorded rationale.

**This does not block the corporate site on its merits, but it does block a green CI run**, so a
release decision has to name which of the two it is waiting on.

### B8. Production approval — REQUIRED · Founder

No Production deployment, DNS change, domain change, database mutation or Vercel Production
promotion is authorised by this package, and none was performed.

---

## C. Recorded limitations — accepted, not fixed

| Item | State | Why it is not closed |
|---|---|---|
| **Favicon legibility** | At 32px only the blue symbol reads; the wordmark does not | The artwork is a stacked square lockup. A compact mark needs a **logomark-only or vector variant, which does not exist**, and cropping the Founder's artwork is forbidden. Shipping the real mark small still beats shipping the consumer product's heart. **Founder asset request.** |
| **One low dev-only advisory** | `esbuild` < 0.28, dev-server arbitrary file read **on Windows**, reached only through `tsx` | Not in the production bundle, not on this platform. Closing it needs a major bump via `npm audit fix --force`, which is forbidden. Production audit is 0. |
| **Norynto is not on the site** | A fourth registered, `ACTIVE`, venture-stage repository ("a global vehicle intelligence, trust and commerce network") exists and appears nowhere publicly | Publishing it was **not** in this package's scope, it has no public-safe copy, no remote and `sensitivity_class: internal`, and inventing a description is forbidden. **Founder decision:** is Norynto a fourth venture to publish, internal-only, or part of Mirai Move's domain? Until answered, the site's corrected count describes only what is published. |
| **Performance** | Mobile medians: `/` **89**, `/ventures` **89**, `/about` **90**. a11y, best-practices and SEO **100** on all three; CLS **0.000** | The ≥90 target is met on one of three and missed by a point on the other two. Measured on a laptop also running the build and a headless browser; the CDN is the only measurement that decides anything. |

---

## D. The gate itself

Every line must be true before a Production release decision is put to the Founder.

```
A1..A9         CLOSED      verified by the commands in §A
B1  ACCEPTANCE  ........   Founder, on the Preview
B2  DOMAIN      ........   Founder — apex disposition + consumer destination + locale routing
B3  CONTACT     ........   credential + DNS, then ONE verified end-to-end send
B4  GOVERNANCE  ........   Founder — branch protection + licence
B5  TRANSLATION ........   native review, or launch ja+en only (the gate is already typed)
B6  CLAIMS      ........   no action needed to launch; the site is already bounded
B7  CI          ........   consumer Today decision, or an explicit "launch with CI red and why"
B8  APPROVAL    ........   Founder
```

**A launch decision that leaves B3 open must also decide what `/contact` says**, and a launch that
leaves B5 open must decide whether the 19 preview-only locales ship. Both are already safe by
default: the form does not appear, and the locale gate is enforced in the registry.
