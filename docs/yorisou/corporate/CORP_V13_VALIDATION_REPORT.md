# CORP-v1.3 — validation report

Everything below was measured against a **production build served locally**, not inferred from
source. Where a number is worse than the target it is written as a miss.

## What was verified

| Gate | Result | How |
|---|---|---|
| Typecheck | clean | `npx tsc --noEmit` |
| Lint | 0 problems | `npx eslint` |
| Build | passes | `npm run build` |
| Corporate guards | **37 / 37** | `node --import tsx --test tests/corporate-p5r2/*.test.ts` |
| Route policy guards | **35 / 35** | `corpP4ar1RoutePolicy` + `corpP4ar2CrawlAndShell` |
| Route sweep | **189 / 189** — status, `html lang`, `dir`, title, 0 internal-token leaks | `tests/corporate-qa/sweep.mjs` |
| Accessibility | **0 violations / 45 pages** (WCAG 2.2 AA, 9 routes × ja en ar ko th) | `tests/corporate-qa/axe.mjs` |
| Responsive | **1134 / 1134 clean** — 9 routes × 21 locales × 6 viewports; overflow, clipped text, target size | `tests/corporate-qa/visual.mjs` |
| Reduced motion | **9 / 9 routes**, nothing still animating | `tests/corporate-qa/reducedmotion.mjs` |
| Keyboard | **154 real tab stops**, every one with a visible indicator | same |
| Brand paint | **84 accent marks** correct, **0** pre-logo colours painted anywhere | `tests/corporate-qa/brandpaint.mjs` |
| Consumer regression | **7 / 7** | `tests/corporate-qa/consumer.mjs` |
| Production dependencies | **0 vulnerabilities** | `npm audit --omit=dev` |

## Defects found by measuring, not by reading

Five. Three were in the site, two were in the harness itself.

### 1. Three corporate routes never resolved their locale — 60 pages

`/ventures`, `/chigamo` and `/build-with-us` served correctly translated bodies inside
`<html lang="ja" dir="ltr" data-script="Jpan">` for all twenty non-Japanese locales. An Arabic reader
got Arabic text in a document announced to assistive technology as Japanese, laid out left-to-right,
with Japanese script tuning. Nothing failed; the page looked translated.

Cause: `proxy.ts` held a **hand-written list** of the six corporate paths that existed when it was
written. CORP-v1.2 added three routes and did not add them to it. The list is now derived from the
route policy, so a corporate route is locale-resolved by construction, and
`tests/corporate-p5r2/localeResolution.test.ts` asserts both directions against the App Router
filesystem.

Caught by: the 189-route sweep, first run. 129/189 → 189/189.

### 2. The venture composition failed contrast — introduced by this package

The new composition line inherited a dark-surface rule scoped to `.signature`. `.signature` is a
**light** section; only `.signatureField`, the Foundry panel inside it, is dark. So the rail rendered
`#8d938e` on `#fffdf8` (**3.08:1**) with digits at `#3c9cf0` (**2.87:1**), both below AA at 13.5px and
15.5px.

Fixed by removing the wrong scope, not by changing the colours: **5.00:1** and **9.64:1** on the paper
ground. axe 5 → 0.

### 3. The 404 showed a company from two refoundations ago

It rendered the frozen `prototype/corporate` shell: the old text wordmark instead of the logo, a
five-item nav with no Ventures / How we build / Build with us, the retired consumer tagline
「人と社会のあいだに、次のよりそいをつくる。」, and a footer note promising that the trade name,
address, representative and corporate number *"will be published once the registration is
confirmed"* — which had stopped being true.

Now renders the live Shell, copy and brand system. The existing guard that the 404 must not import
consumer chrome is unchanged and still passes; only the name of the corporate shell it pins moved.

### 4. The keyboard check was wrong, not the site

The first focus harness called `el.focus()` from script and read the computed style, and reported
five CTAs on `/build-with-us` with no focus ring. `:focus-visible` does not reliably match a
programmatic focus in Chromium. Tabbing to them shows a 2px `rgb(12, 60, 156)` outline. The harness
now presses Tab: **154 stops, 0 missing**.

### 5. The consumer check was wrong, not the site

It searched the whole response for the corporate shell's class name and failed **all seven** consumer
routes. It was matching the serialised not-found subtree inside the RSC flight payload — data the
client may never render. Measured directly, `/en` renders the consumer header and footer and contains
**zero** corporate shell classes outside the payload. The check now strips the payload first, and
`/tests/ima-iro` is recorded as deliberately headerless rather than treated as a failure.

Both harness defects are written into `tests/corporate-qa/README.md`. A harness that cries wolf is
worse than none: the next real failure gets waved through.

## Two more target-size findings, both marginal, both fixed

Neither was an axe violation, because both already conformed by SC 2.5.8's **spacing exception**.
Conforming by exception is a weaker position than conforming outright, and both fixes are free:

- Korean 「문의」 and 「소개」 measured **23.84 × 44** — 0.16px under the 24px minimum. Adjacent nav
  targets sit 24.5px apart, so the exception applied. `min-inline-size: 24px` on `.navLink` and
  `.footerLink` affects only labels narrower than 24px, so nothing else moves.
- The guided explainer's beat pips measured **22 × 22**, 29px apart centre to centre. Raised to
  24 × 24 with the pitch unchanged.

## Performance — Lighthouse, mobile, 3-run medians

| Route | perf | a11y | best-practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | **89** | 100 | 100 | **100** | 3.52s | 0.000 | 63ms |
| `/ventures` | **89** | 100 | 100 | **100** | 3.51s | 0.000 | 63ms |
| `/about` | **90** | 100 | 100 | **100** | 3.44s | 0.000 | 61ms |

**The ≥90 performance target is met on `/about` and missed by one point on the other two. That is
recorded as a miss**, not rounded up and not represented by the single 90 in each run set.

SEO is **100 on all three**, including `/ventures`, which scored 63 while it was crawl-blocked. That
is the indexability change showing up in the measurement rather than in a claim.

### A Lighthouse result that was too good to be true

The first run of this harness reported **100 / 100 / 100 / 100**. It was wrong: the script passed
`--preset=desktop` and then re-specified the mobile *screen* flags, which changed the viewport but
left **desktop throttling** in place. Lighthouse's default preset already is mobile — screen and CPU
and network. Removing `--preset` produced the numbers above. A perfect score that contradicts every
previous measurement is a reason to check the instrument, not to report it.

Measured on a laptop simultaneously running the build, a headless browser and this session. The CDN
is the only measurement that decides anything.

## What was deliberately NOT done

- The ARCH-P3 assertion L/M was **not** rebound. No file contains the consumer Today composition, so
  pointing it elsewhere would turn CI green by deleting the protection.
- `npm audit fix --force` was **not** run. Production is at 0 vulnerabilities; the one remaining low
  advisory is dev-only, Windows-only, and reached through `tsx`.
- No exact-list guard was loosened. `CORPORATE_INDEXABLE` is still pinned as an exact list in one
  place; the two duplicate hardcoded counts elsewhere now derive from it, which is what let them go
  stale together in the first place.
- The Founder's artwork was not cropped, recoloured, redrawn or replaced.
