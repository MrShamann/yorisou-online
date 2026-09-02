# CORP-v1.4 — venture foundry business model + global multilingual corporate site

**Preview only.** Not merged, not deployed. The v1.3.1 Production baseline (`main` at `279cacd`) is
untouched by this package.

---

## 1. The Founder's business-model decision

YORISOU LLC / Yorisou Foundry is a **venture foundry** — a Japanese company and financing entity
that finds structural problems, builds them into ventures, and co-creates with founders, operating
teams, universities, companies and public institutions.

It is **not** an incubator, an accelerator, a consultancy, a company that builds ventures only to
hand them away, or a holding company with established subsidiaries.

## 2. What the old website implied, and why it was wrong

The site described a sequence that ended at independence and then said nothing more. Read
commercially — by an investor, a founder, or anyone assessing whether YORISOU is a business — that
says: **YORISOU builds companies and gives them away.**

Five sentences carried it. The most damaging was the Foundry's own statement of purpose:

> 「ファウンドリーの目的は、YORISOU の傘下を増やすことではありません。独立した会社として自分で立てる状態にすることです。」
> *"The point of the foundry is not to accumulate things under Yorisou. It is to get each venture to
> where it can stand as an independent company."*

That is a direct denial of the portfolio model. It was published in twenty-one languages.

The others: the hero's supporting line (*"From structural problems, to companies that stand on their
own"*), the Foundry lead (*"…carry it to an independent company"*), Foundry stage 07 (*"shaped so
that it does not stay dependent on Yorisou"*), and the Ventures note (*"The aim is for each to stand
as an independent company"*).

None of them was false. Together they were one-sided, and the side they left out was the one that
explains why YORISOU is a company rather than a service.

## 3. The corrected model

```
structural problem  →  validation  →  product + business model  →  co-creation
                    →  operation and growth  →  one of several shapes
```

The shapes, none of which is presented as the default:

- keep operating inside YORISOU;
- co-operate with an external team;
- form a separate company;
- retain equity;
- retain licence rights;
- another agreed economic-right structure;
- spin out, transfer, or sell.

**Independence remains a desirable outcome. It is no longer presented as the terminus of the
relationship.** The new section heading says so directly: 「事業の形は、一つではありません。」

### Long-term participation

A new section on the Home page — placed after "how we build", never in the first viewport — states
that YORISOU **may** continue to participate in the value of a venture through equity, a licence,
joint operation or another agreed structure.

Every sentence is conditional. The note beneath it says outright that nothing is fixed in advance,
because nothing is:

> *"Which shape it takes depends on the venture's maturity, who is involved, the market, the
> capital, and the agreement reached for that venture. Nothing is fixed in advance."*

**Structure follows contribution, risk, responsibility, maturity and specific agreement.** No
percentage, no band, no guarantee, and no internal equity range is published.

## 4. Current state vs possible future structure

The Ventures index now separates the two explicitly. Everything above the break is a current fact;
everything below is a possibility, and the last line says it is "neither a plan nor a promise".

Mirai Move, Kakari and Chigamo keep their exact current-state wording. **Chigamo remains concept
stage** — a logo in v1.3.1 did not upgrade it, and neither does this.

## 5. Asterion — the withdrawn conclusion

**Old:** 「Asterion OS は…YORISOU が所有しているものではありません。」 / *"It is not owned by Yorisou."*

**New:** Asterion OS is an independent technology-platform project; it is not one of the ventures
presented here; YORISOU ventures **may** use its capabilities where appropriate; and **ownership,
licensing, data rights and operating responsibility depend on the agreements that apply in each
case.**

**Why the old wording had to go.** No executed rights record supports it. An unsupported denial is
an unsupported claim — the site was drawing a legal conclusion it could not evidence, in the
direction that happened to sound modest. The opposite claim was already forbidden; now both are.

**A correction to this package's own first attempt.** There are *two* Asterion blocks per locale —
`home.*` and `foundry.*`. The first pass fixed only `foundry.*`, which left the homepage still
saying "Asterion is not owned by Yorisou" while `/about` said rights depend on the agreements. The
site contradicted itself for the length of that gap. Both are now corrected in all 21 locales, and a
new guard checks the **values**, not just the key names.

**Guard changes, none of which weakens anything.** The existing `powered-by-asterion` and
`yorisou-owns-asterion` rules are unchanged. Added: a file-scoped check for ownership *denials* in
twelve languages, and an `executed-economic-right` rule that fires on "holds equity" / "a licence
has been executed" but not on "may hold equity" — the distinction the whole section rests on.

Asterion source code and agreements are untouched.

## 6. Company scope

The Company page defined YORISOU as *"planning, development and operation of Mirai Move and
Kakari"*. That is two product names standing in for a company.

Corrected in three places: the hero intro, the `事業内容` row, and the business description. The new
business-activity line is *discovery, planning, development and operation of new ventures;
founding-team formation; and venture formation through joint operation, licensing and related
arrangements* — **descriptive of what YORISOU does, not quoted from a registry.** No 定款 wording is
invented; the claim ledger records this row as Founder-supplied and BOUNDED, and it stays that way.

A fourth defect was found in the view rather than the copy: the Company page's project band listed
**two hardcoded cards** and omitted Chigamo, so the Company page said two while every other surface
said three. It now reads the same venture list as everything else.

## 7. Multilingual — access and review are different questions

### The defect

Nineteen complete, rendering, claim-guarded locales were **unreachable**.

`LanguageSelector.tsx` filtered on `status === "published"`. When that field was written in
CORP-P5R2 it meant "built", and the filter was right. CORP-v1.2R1 reused the same field to mean
"cleared for Production" and marked nineteen unreviewed locales `preview_only` — a defensible
publication call that, through one shared field, silently narrowed the language selector from
twenty-one languages to two.

Nothing failed. The site rendered all twenty-one perfectly, `resolveLocale` accepted every code, and
the 189-route sweep passed because it requests locales by URL rather than through the selector. **A
reader in Seoul simply had no way to find the Korean site.** The selector had no test at all.

### The correction

Two independent axes, as separate types so they cannot be collapsed again:

| | |
|---|---|
| `access: "public" \| "registered"` | may a visitor select and open this locale? |
| `reviewState` | has a person actually read the copy? Internal only, never rendered. |

**All 21 locales are `public`.** Not reviewed is a reason to be honest about the review, not a reason
to be unreachable.

| Review state | Locales |
|---|---|
| `SOURCE_CANONICAL` | ja |
| `FOUNDER_REVIEWED` | en |
| `AI_TRANSLATED_NATIVE_REVIEW_PENDING` | the other 19 |

`en` moves from `HUMAN_REVIEWED` to `FOUNDER_REVIEWED`. That is a **downgrade in claim**, and it is
the accurate one: the English was edited under Founder direction, not read by a native speaker.

The review state is never rendered. A guard asserts no review token can reach the page — captioning
nineteen languages with "we did not check this", in the language of the person reading it, would be
worse than telling the Founder.

## 8. Routing — and why the migration is not in this package

**`?lang=` is retained.** The path-routing migration is specified below and deliberately deferred.

`app/[locale]/…` would be a root-level catch-all shadowing **117 consumer routes**, and it would
collide head-on with the existing `/en` tree — 24 live consumer pages including auth, results and
support. Doing that in the same release as a business-model rewrite risks the consumer product for
an SEO gain that can be had separately.

### Recommended migration, for a later package

1. Decide the disposition of the legacy `/en` consumer tree first — it owns the `/en` prefix.
2. Add a middleware **rewrite** (not a route) mapping `/{locale}/{path}` to the existing page with
   the locale header set, for known locale codes only. A rewrite creates no catch-all, so unknown
   prefixes fall through and the corporate 404 is unaffected.
3. Only then emit hreflang, and widen `robots.txt` in the same change.

### `/en` and the other historical surfaces

- **`/en` + 23 children** are the archived English **consumer product**, not a corporate locale. They
  are not redirected: the auth and result routes are load-bearing, and people hold links. They were
  crawl-blocked but **not noindexed**, so an inbound link could index *"About Yorisou | Life-State
  Understanding"* as the company's English about page. `app/en/layout.tsx` now emits
  `noindex, nofollow`. robots.txt controls crawling; only a rendered directive answers indexing.
- **`/prototype/corporate/*`** — 7 frozen prototype routes. Already `noindex`, crawl-blocked and
  linked from nowhere. One entry, `/prototype/corporate/aida`, was missing from the policy list that
  claims to be derived from the filesystem; added.
- **No corporate language URL serves historical content.** Every locale renders the same current
  components from the same copy object.

## 9. SEO — what was added, and what was deliberately not

**Added: a canonical** on every corporate route, pointing at the clean path. Twenty-one locales are
reached through `?lang=` on the same path, which is exactly the shape a crawler resolves badly; the
canonical consolidates them.

**Not added: hreflang.** `robots.txt` anchors every `Allow` with `$`, and Google matches the anchor
against the path **and query string** — so `/about?lang=en` does not match `Allow: /about$` and the
blanket `Disallow: /` applies. **Every `?lang=` URL is crawl-blocked today.** An hreflang set points
*at* those URLs; emitting one would advertise twenty-one addresses a crawler is forbidden to fetch,
which is worse than emitting none. hreflang becomes correct when path routing does, and not before.

No SEO success is claimed. The sitemap is unchanged at 7 Japanese-canonical URLs.

## 10. Translation claim safety

Each locale was translated from the **Japanese canonical**, never from another translation, and the
seven highest-risk locales — ar, ko, zh-CN, zh-TW, hi, th, ru — were then read back by an
independent checker against the Japanese, with a literal back-translation for every conditional.

The failure being guarded against is specific: a conditional becoming a fact.

| Must stay | Must never become |
|---|---|
| may / 〜こともあります | does, will |
| invitation | partnership |
| concept stage | launched, available |
| may retain equity | retains equity, equity is offered |
| may use Asterion | powered by Asterion |
| depends on the agreement | is governed by our agreement |

Guard changes:

- **Every match is now checked, not just the first.** Both scans used a non-global `exec`, so only
  the first occurrence per file was tested for negation. Because this site denies its forbidden
  claims constantly and on purpose, a first-position denial silenced every later real violation in
  the same file. A guard that stops at the first honest sentence gets quieter the more honest the
  copy becomes.
- **`portfolio-companies` extended** to 子公司 and 자회사 — the subsidiary vocabulary Chinese and
  Korean actually use, which it did not previously catch.
- **`executed-economic-right`** added, covering the claim class this narrative introduces.

## 11. What is unchanged

The v1.3.1 visual system, the YORISOU logo and favicon, all three venture marks, the consumer
`/today` surface and the consumer route boundary, 120Q, scoring, taxonomy, LINE, Norynto's
exclusion, and PR #127.

**Norynto** remains outside the portfolio by standing v1.2 governance. It is not added, not
mentioned, not reinterpreted, and its repository is untouched.
