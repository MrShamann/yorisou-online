# CORP-v1.3 — Production Launch Gate

> **The launch happened.** `yorisou.online` has served the corporate site since 2026-09-01
> (`main 279cacd`, deployment `dpl_AMJE3PzsU8haAiU7NrQzydRt76E4`). This document is the record of
> the gate that was met, not a gate still ahead.
>
> **CORP-v1.4 is post-launch remediation, in Preview only.** It corrects the business-model
> narrative and makes all 21 locales reachable. Its own record is
> `CORP_V14_BUSINESS_MODEL_AND_GLOBAL_LOCALE.md`, and the items it closes are:
>
> - **B5 translation review** — reframed rather than closed. Access and review are now separate
>   axes: all 21 locales are reachable, and 19 remain honestly marked as awaiting native review.
>   `CORP_V14_LOCALE_REVIEW_REGISTER.md` carries the state.
> - The `?lang=` → `/{locale}/` migration in **B2** remains deferred, with a concrete plan recorded
>   rather than an intention.
> - **B3 contact** and **B4 licence** are unchanged and still open. Neither blocks the live site.

> **CORP-v1.3.1 — the Founder has decided the open questions this gate was holding.** `yorisou.online`
> becomes the corporate apex; the consumer product keeps its own explicit routes with Today restored
> at `/today`; ja and en launch public and the other 19 locales stay `preview_only`; contact stays
> truthful and may remain delivery-blocked; repository licence and branch protection are recorded as
> later governance and do not hold the website. Nine more items close below.

**Status: the technical gate is met and the Founder release decisions are given.** Nineteen items are
closed. What remains is either a post-launch capability or a governance item that explicitly does not
block the website.

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

### Closed by CORP-v1.3.1

| # | Item | Was | Now | Verify |
|---|---|---|---|---|
| A10 | **Venture-count model** | v1.3's computed composition was right about the three shown and still read as the whole company | The set is named — 現在公開している事業 — and a sentence states the relationship before any count: YORISOU builds several ventures; these are the public ones | `brandSystem.test.ts` |
| A11 | **Mirai Move logo** | A colour square, while the real logo sat unused on the Founder's machine and in Mirai Move's own repo | The official mark, taken from that venture's own committed brand kit | `tests/corporate-qa/brandpaint.mjs` |
| A12 | **Kakari co-mark** | ASCII wordmark only, no mark | Founder-approved 「係 / Kakari」, scoped to the corporate surface; カカリ still banned everywhere by a byte-identical guard | `brandSystem.test.ts` |
| A13 | **Chigamo mark** | Deliberately unmarked | Founder-approved new mark; three concepts built and judged at 24px, two rejected by looking | `brandSystem.test.ts` |
| A14 | **YORISOU favicon** | The full stacked lockup, illegible at 32px | Founder-authorised symbol crop; multi-resolution ICO, legible at 16px | verified at 16/32/48/64 |
| A15 | **Consumer Today** | Existed in no file since `9f0e8ff`; ARCH-P3 L/M red for four packages | Restored verbatim at `/today` from `8fd5bd5`; the assertion follows the surface | `archP3DailyDiscovery.test.ts` 21/21 |
| A16 | **Consumer shell ownership** | `shellOwner("/today")` returned CORPORATE; the restored page would have shipped with no header, footer or tab bar, and no test could see it | `/today` is a listed consumer route, and a new guard asserts every consumer page resolves to the consumer shell | `consumerShellIntegrity.test.ts` |
| A17 | **Consumer home links** | Eleven consumer links pointed at `/`, which is now the company | All read `CONSUMER_HOME`; a guard fails on any literal `href="/"` in a consumer component | same |
| A18 | **Stale consumer contract** | `pxr1RouteContract` test 8 had been red since `9f0e8ff`, asking consumer questions of a corporate page | Retired with the Founder's apex decision as the rationale; the invariant it protected is bound to the surface that now carries it | `pxr1RouteContract.test.ts` 11/11 |

Two governance records were also corrected rather than left to drift:

- **Claim ledger C-05** said the registration number was omitted for want of evidence. It has in fact
  been published in every locale since `8be233c`, verified against the National Tax Agency
  publication site. Split into C-05 (capital, founding date, street address — still omitted) and
  **C-05a (法人番号 2290003018125 — VERIFIED, published)**.
- Eleven new ledger rows, C-39 to C-49, cover everything this package publishes.

---

## B. Open — Founder decision or credential required

Nothing below can be closed from inside the repository.

### B1. Founder acceptance — **GIVEN for the R3 direction** · remaining: the v1.3.1 surface

Closes when the Founder accepts, on the Preview: the reconciled palette, the venture count framing,
the venture accent marks, the footer strapline, the browser identity and the 404.

The palette change is the one to look at first and is **one commit to revert** if rejected: five
token values in `app/_corporate/p5r2/site.module.css` and their propagation. No layout, type or
composition changed.

### B2. Domain and routing — **DECIDED** · Founder

**`yorisou.online` is the official YORISOU / Yorisou Foundry apex website.** The legacy consumer
product is preserved and keeps its own explicit routes; it no longer owns `/`.

1. Apex — **the corporate site takes it.**
2. Consumer product — stays in this repository on its own routes. Today is restored at `/today`,
   next to `/today/check-in` and `/today/discovery`, which never moved.
3. Locale routing — `?lang=` **stays for this release**. Migrating to `/{locale}/…` is a real SEO
   improvement and a large routing change; doing it in the same release as an apex cutover risks the
   cutover for a gain that can be had later. Recorded as later work, not as a blocker.
4. `/about` keeps its URL and stays corporate.

**The consequence that had to be handled, and was:** eleven consumer links pointed at `/` meaning
*the product home*, including the mobile tab bar's 今日 tab and the app header's logo. Nothing would
have 404ed — a person mid-flow would simply have landed on the company's front page. They now read
one constant, and a guard fails on any literal `href="/"` returning to a consumer component.

### B3. Contact delivery — BLOCKED, and **does not block the launch** · credential + DNS

Two independent blockers, both outside the repository:

- `BLOCKED_BY_RESEND_ACCESS` — no valid credential, so `RESEND_API_KEY`, `CORPORATE_CONTACT_TO` and
  `CORPORATE_CONTACT_FROM` are unset and the form is correctly not shown.
- `BLOCKED_BY_DNS_ACCESS` — no authoritative DNS access for apex MX / SPF / DKIM / DMARC.

Closes in two steps, in this order:

1. Set the three environment variables. The form and its promise return with no code change.
2. **Verify one end-to-end send and record it.** Configuration is not delivery. Only after a
   verified send may `/contact` move from `CORPORATE_BLOCKED` to `CORPORATE_INDEXABLE`.

### B4. Repository governance — OPEN, and **does not block the website** · Founder

Machine-verified 2026-08-31: `main` is **not branch protected**, the repository is **public**, and it
has **no licence** (`license: null`, no `LICENSE` file). Public with no licence means all rights
reserved by default — an inherited posture, not a chosen one. Two decisions: whether `main` requires
review, and what the licence should be.

### B5. Translation review — OPEN, and **does not block a ja + en launch** · native speakers

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

### B7. Consumer Today surface — **CLOSED**

Restored at `/today`, recovered **verbatim** from `8fd5bd5:app/page.tsx` — the commit immediately
before `9f0e8ff` dropped it. Not a new product: nothing redesigned, no copy rewritten, the protected
order exactly as it was. Only three import paths changed, because the file sits one directory deeper.

The three components it renders were byte-identical to that commit and every symbol they call still
exists, so nothing had drifted in the four packages the surface was missing.

`archP3DailyDiscovery.test.ts` assertion **L/M is rebound to the restored surface and passes — 21/21.**
This is the first time rebinding it was legitimate: for four packages the composition existed in no
file, so pointing the assertion anywhere would have turned CI green by deleting the protection. The
surface genuinely exists again, so the binding follows it.

Two further things the restoration needed, neither of which any existing test could see:

- `shellOwner("/today")` returned **CORPORATE**, because `isKnownPageRoute()` matches
  `CONSUMER_ROUTES` exactly while `classify()` uses the prefix-tolerant namespace table. The restored
  page would have rendered with no header, no footer and no tab bar. Fixed, and
  `consumerShellIntegrity.test.ts` now asserts the property directly for every consumer page.
- `pxr1RouteContract` test 8 had been failing since the same commit `9f0e8ff`, asking consumer
  questions of what is now the corporate `/about`. Since the Founder's apex decision assigns `/about`
  to the corporate site, the subject is retired **with that rationale recorded** and the invariant it
  protected — a short-look promise must sit above the short surface, never above the 120Q — is bound
  to the page that now carries it. 11/11.

### B8. Production approval — **GIVEN** · Founder

CORP-v1.3.1 carries Founder authorisation to merge PR #156 once the technical gates pass, to let the
normal `main` Production deployment publish the corporate site, and to verify the live result.

**DNS is not touched.** `yorisou.online` already resolves to the Vercel apex (`76.76.21.21`) and is an
alias of this project's Production deployment, so replacing the Production build requires no DNS
change. That was proved before anything was deployed, not assumed.

No database migration, no consumer data mutation, no external message and no second parallel site.

---

## C. Recorded limitations — accepted, not fixed

| Item | State | Why it is not closed |
|---|---|---|
| **Favicon legibility** | At 32px only the blue symbol reads; the wordmark does not | The artwork is a stacked square lockup. A compact mark needs a **logomark-only or vector variant, which does not exist**, and cropping the Founder's artwork is forbidden. Shipping the real mark small still beats shipping the consumer product's heart. **Founder asset request.** |
| **One low dev-only advisory** | `esbuild` < 0.28, dev-server arbitrary file read **on Windows**, reached only through `tsx` | Not in the production bundle, not on this platform. Closing it needs a major bump via `npm audit fix --force`, which is forbidden. Production audit is 0. |
| **Norynto** | Not a portfolio venture, and not an open question | **GOVERNANCE CORRECTION.** v1.3 recorded this as an unresolved Founder website decision. That was wrong: active YORISOU v1.2 governance already decides `NORYNTO PORTFOLIO_VENTURE = NO`, with no YORISOU website portfolio treatment unless a later Founder decision changes it. No later decision has. It is therefore excluded by a standing decision, is not counted in website inventory, is not described as part of Mirai Move, and its repository is untouched. Nothing is pending. |
| **Performance** | Mobile medians: `/` **89**, `/ventures` **89**, `/about` **90**. a11y, best-practices and SEO **100** on all three; CLS **0.000** | The ≥90 target is met on one of three and missed by a point on the other two. Measured on a laptop also running the build and a headless browser; the CDN is the only measurement that decides anything. |

---

## D. The gate itself

Every line must be true before a Production release decision is put to the Founder.

```
A1..A18        CLOSED      verified by the commands in §A
B1  ACCEPTANCE  GIVEN      R3 direction accepted; v1.3.1 surface for review after launch
B2  DOMAIN      DECIDED    corporate apex; consumer keeps its own routes; ?lang= retained
B3  CONTACT     BLOCKED    truthful, form not shown — explicitly NOT a launch blocker
B4  GOVERNANCE  DEFERRED   licence + branch protection recorded as later governance
B5  TRANSLATION SCOPED     ja + en public; 19 locales stay preview_only, enforced in the registry
B6  CLAIMS      BOUNDED    no action needed to launch; the site is already bounded
B7  TODAY       CLOSED     restored at /today; ARCH-P3 21/21
B8  APPROVAL    GIVEN      merge, normal main Production deployment, live verification
```

**A launch decision that leaves B3 open must also decide what `/contact` says**, and a launch that
leaves B5 open must decide whether the 19 preview-only locales ship. Both are already safe by
default: the form does not appear, and the locale gate is enforced in the registry.
