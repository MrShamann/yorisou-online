# CORP-P5R1-AMD — Multilingual homepage report

**Scope:** the P5R1 homepage only. Japanese is default and canonical; English is an adapted sibling.
Not a full-site localization, not a locale-routing migration.

---

## 1. Two corrections to previous CORP-P5R1 statements

### 1.1 The diff-stat evidence was wrong

I previously wrote: *"git diff --stat against c0b2965 is exactly one tracked file."* **That was false
evidence.** It was measured against the working tree *before* committing, when the P5R1 files were
still untracked, so they did not appear in the diff.

The real commit-to-commit delta `c0b2965..d8b6bcf` is **9 files, +1361 / −7**:

| Class | Files |
|---|---|
| **(a) modified baseline** | `app/page.tsx` (+4 / −7) |
| **(b) new P5R1 implementation** | `p5r1.module.css`, `HomeP5R1.tsx`, `SystemField.tsx`, `ProjectSystems.tsx`, `Reveal.tsx` |
| **(c) new P5R1 evidence/governance** | `CORP_P5R1_BENCHMARK_TEARDOWN.md`, `CORP_P5R1_VISUAL_LANGUAGE.md`, `CORP_P5R1_IMPLEMENTATION_REPORT.md` |

**The actual claim, correctly evidenced.** Only `/` consumes the P5R1 implementation:

- `app/page.tsx` contains **1** import of `_corporate/p5r1`; the five other corporate route files
  contain **0** each.
- A reverse search for `_corporate/p5r1` across `app/` returns **exactly one file outside the
  `p5r1/` directory itself: `app/page.tsx`**.
- Rendered at 1440, `/mirai-move`, `/kakari`, `/about`, `/company`, `/contact` each report
  `usesP5R1 = false`.

### 1.2 The copy-lock claim was too broad

I previously wrote that *"every word is carried verbatim."* **Not true.** The locked editorial copy
is verbatim, but the visual system introduced interface labels that are not in the approved content
source. Audited and corrected:

| Label that existed | Verdict | Now |
|---|---|---|
| `context` | engineering annotation | 「関係」 / "Relationships" |
| `shared opportunity` | engineering annotation | approved `MIRAI_NETWORK.centre` — 「移動の機会」 / "Mobility opportunity" |
| `network — 4 parties` | engineering annotation | **removed** |
| `professional boundary — procedure stops` | engineering annotation | approved boundary label — 「専門家が担う範囲」 / "Where a professional takes over" |
| `つくり方 — operating constraints` | half-annotation | 「つくり方」 / "How we build" |
| `仕組み — Systems` | bilingual stub | single locale-appropriate label |
| 「人の状況を読み取り、関係として整理し、制度側へつなぐ。」 | **a capability claim I invented** | replaced with a purely structural caption naming the two sides using approved labels |

**The honest statement now:**

- **LOCKED CONTENT COPY** — thesis, lead, problem beats, method principles, product lines, stages,
  boundary wording, company body: carried verbatim from the approved CORP-P5 content source in
  Japanese, and adapted (not literally translated) in English.
- **NEW VISUAL/SYSTEM LABELS** — section eyebrows, navigation, the skip link, the menu control, the
  preview badge, the disclosure summary, "Yorisou — Corporate", and the structural field caption.
  All of these except the field caption already existed in the approved CORP-P5 implementation
  (verified against `c0b2965`). The field caption is new and makes no claim.

---

## 2. Language model

**Japanese is default and is never overridden.** No redirect on browser locale, IP, device language
or inferred geography. The visitor changes language only by choosing it.

Locale travels as `?lang=en` on the single homepage URL. **The Production doctrine `/` = ja and
`/en` = en is recorded and deferred** — `/en` is currently the legacy *consumer* route, and locale
routing belongs to the corporate topology package. Nothing here begins that migration.

**Persistence is deliberately not implemented.** Remembering the choice would mean writing a cookie
or storage entry, which is new client-side state created solely to track a language preference. The
selector is two plain links instead.

**Only ja and en are exposed.** No disabled option and no placeholder for 中文 or Español appears.
The copy layer is a `Record<Locale, Copy>`, so adding a locale is a content change.

---

## 3. Language selector

Two real links, rendered **once**, visible at every width without opening anything.

- Labels 日本語 / English — no flags, no globe-only communication.
- 44px minimum height, verified at every viewport.
- `aria-current` on the active language; `hreflang` and `lang` on each option; the group carries an
  accessible name (「表示言語」 / "Display language").
- Keyboard operable and focus-visible; not hover-dependent; not a precision dropdown.
- At <430px the row tightens rather than abbreviating the labels — "JA/EN" would be less clear.

**A defect found and fixed:** the selector was initially rendered twice (once per breakpoint),
putting four language links and duplicated `aria-current` in the DOM. Now rendered once.

---

## 4. English thesis

Japanese (canonical, unchanged): 「人と社会のあいだに、次のよりそいをつくる。」

**Chosen English rendering:**

> **Between people and society, we build the next way to stand alongside.**

「よりそい」 is the company's own name and means to draw close and remain beside someone. "Stand
alongside" keeps that act. Alternatives considered and rejected:

| Alternative | Rejected because |
|---|---|
| "Building the next form of support between people and systems." | "support" flattens よりそい into a service category |
| "We work in the space between people and the systems around them." | loses both 次の (the next) and つくる (we build) |
| "Between people and society: the next way to stand alongside." | a fragment; drops the company as the actor |
| Anything of the "AI for everyone" family | explicitly excluded, and untrue |

**Material reinterpretations, reported rather than made silently:** none. Every English string keeps
the factual content, maturity claim, boundary and stage of its Japanese source. No English string
introduces a customer, partner, metric, traction, ownership or market claim.

---

## 5. JA/EN visual adaptation

The switch is not a string swap. `data-lang` drives language-aware composition:

| | Japanese | English |
|---|---|---|
| Hero scale | `clamp(27px, 3.5vw, 44px)`, leading 1.46 | `clamp(30px, 4vw, 50px)`, leading 1.24, tighter tracking |
| Body leading | 1.9–2.0 | 1.7 |
| Word breaking | `keep-all` + phrase units | `normal` |
| System labels | 11px | 9.5px — English labels are wider at the same optical size |
| Measure | ≤38em | ≤40em |

**The Japanese composition was not reduced to accommodate English.** Both are set deliberately;
neither is the fallback.

**A defect found by looking, not by tests:** phrase units are inline-blocks, so adjacent units butt
together — correct for Japanese, wrong for English, which rendered "help peopleunderstand it". The
space was present in the DOM but sat *inside* the inline-block, where a trailing space collapses at
the box edge. The separator now sits **between** the units. Verified against rendered text.

---

## 6. QA

**12/12 combinations clean** — ja and en at 1440 / 1280 / 768 / 430 / 390 / 375:
0 horizontal overflow · 0 gutter breaks · 0 narrow-text columns · 0 clipped text · 0 overlapping SVG
labels · 0 fragmented Japanese · 0 glued English words · 0 tap targets under 44px · exactly 2 language
options · language switch works by real pointer click in both directions · axe WCAG 2.2 AA **0
violations** · 0 console errors · 0 failed requests · exactly 1 `h1` · **0 animations running** once
settled. Reduced motion in both locales: 0 running, relations drawn, elements resolved.

**Lighthouse**

| | JA | EN |
|---|---|---|
| Performance | 90 | 88 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | **100** | **63** |
| LCP / CLS / TBT | 3.5s / 0 / 20ms | 3.6s / 0 / 10ms |

---

## 7. Known limitations

1. **English SEO is 63 because `/?lang=en` is blocked from indexing.** The single failing audit is
   `is-crawlable`. Cause: `Allow: /$` is anchored, and under the Google matching rules the matched
   value includes the query string, so `/?lang=en` falls through to `Disallow: /`. This is the
   deliberate trade-off recorded in CORP-P4AR2 §3, not a new defect. **It demonstrates concretely
   that real multilingual SEO requires the deferred `/en` path routing** — a query parameter cannot
   carry an indexable locale under this robots policy. `app/robots.ts` is a CORP-P5 baseline file and
   was not modified.
2. **LCP still misses 2.5s** in both locales — unchanged structural cause (`unused-css-rules` from
   the legacy consumer global CSS bundle); fix is CORP-P4B D-2.
3. **English homepage links lead to Japanese-only subpages.** `/mirai-move`, `/kakari`, `/about`,
   `/company` and `/contact` remain the CORP-P5 Japanese baseline by design. No unfinished
   translated subpages were invented.
4. **Language choice is not remembered** between visits (§2).
5. Preview is behind Vercel team authentication; project protection was not changed.
6. No Founder acceptance. Direction not selected.


---

# CORP-P5R1-AMD2 — Multilingual semantic completion

Three verified defects corrected on the same branch and PR #155.

## Defect 1 — English body inside a Japanese document

`proxy.ts` derived locale from the pathname only (`pathname.startsWith("/en")`), and `RootLayout`
reads that via the `x-yorisou-locale` header / `yorisou_locale` cookie. So `/?lang=en` served English
content inside `<html lang="ja">`.

**Fix, narrowly scoped to the exact path `/`.** The homepage now resolves its locale from `?lang=en`;
every other path keeps the existing pathname rule unchanged.

**The hazard, and why both header and cookie are written.** `RootLayout` evaluates
`header === "en" || cookie === "en"`. Writing only the header would leave a stale `en` cookie — from
any earlier `/en` consumer visit — forcing `<html lang="en">` onto the Japanese homepage. Writing
both on every `/` request makes the homepage deterministic and **non-sticky**.

Verified in one persistent browser session:

| Sequence | `html lang` | cookie |
|---|---|---|
| `/` | ja | ja |
| `/?lang=en` | **en** | en |
| `/` | **ja** | ja |
| `/?lang=en` | **en** | en |
| `/` | **ja** | ja |

Choosing English never becomes a persistent preference; Japanese remains the default. Nothing is
inferred from browser language, IP, device or geography. No client-side post-hydration mutation.

**Consumer semantics unchanged:** `/en` → en, `/en/about` → en, `/notice` → ja, `/tests` → ja.
**No arbitrary query parameter is interpreted:** `/?lang=zh` → ja, `/?foo=en` → ja, `/?lang=EN` → ja
(case-sensitive), `/about?lang=en` → ja (the rule applies to `/` only).

## Defect 2 — English body with Japanese metadata

`app/page.tsx` exported static Japanese metadata. Replaced with `generateMetadata` reading the same
`?lang` parameter.

| | Japanese `/` | English `/?lang=en` |
|---|---|---|
| `<html lang>` | `ja` | `en` |
| title | Yorisou — 人と社会のあいだに、次のよりそいをつくる。 | Yorisou — Between people and society, we build the next way to stand alongside. |
| description | Japanese | English |
| `og:locale` | `ja_JP` | `en_US` |

No canonical tag and no hreflang architecture is emitted: `/?lang=en` is **not** presented as a
canonical or indexable production English URL. `robots.ts` and the sitemap are untouched.

## Defect 3 — English editorial pass

### The thesis — candidates and selection

Japanese, unchanged: 「人と社会のあいだに、次のよりそいをつくる。」

| # | Candidate | Verdict |
|---|---|---|
| 1 | **Between people and society, we build the next way to stand alongside.** | **SELECTED** |
| 2 | We build what stands between people and the systems they must navigate. | Rejected — "must navigate" adds a framing the Japanese does not make, and 次の is lost |
| 3 | Between people and institutions, we build the next form of alongside. | Rejected — "form of alongside" is not natural English |
| 4 | Yorisou builds the connective work between people and the systems around them. | Rejected — "connective work" is vague; drops 次の |
| 5 | Between people and society, we build what comes alongside next. | Rejected — awkward word order; "comes alongside next" reads as an afterthought |

Selected on the five stated criteria: it is natural English, distinctive (it does not read like any
benchmark's line), faithful to all four Japanese elements — あいだに / 次の / よりそい / つくる —
corporate rather than consumer in tone, and appropriate for an international company. 「よりそい」 is
the company's own name; "stand alongside" keeps the act rather than flattening it into "support".
**The thesis survived review unchanged; it was re-examined, not merely retained by default.**

### Line-level edits

| Japanese source | Before | After | Why |
|---|---|---|---|
| 専門家に渡すまでが遠い。 | "The distance to a professional is long." | **"The path to a professional is long."** | "the distance … is long" is a literal rendering; "path" is idiomatic and equally factual |
| 現場と仕組みが噛み合わない。 | "Practice and process do not meet." | **"The frontline and the system do not mesh."** | "process" lost 仕組み = system; 噛み合わない is "do not mesh", not "do not meet" |
| 制度と予算の側 | "The side that holds the rules and the budget" | **"Holds the rules and the budget"** | 〜の側 rendered as "The side that …" reads as translated Japanese in a list |
| 供給と実装の側 | "The side that supplies and implements" | **"Supplies and implements"** | same |
| 選択肢を持ち込む側 | "The side that brings options" | **"Brings the options"** | same |
| 現場の言葉から始める | "Start from the language of practice" | **"Start from the language of the frontline"** | aligns 現場 with "frontline" used elsewhere; "practice" was ambiguous |

Not rewritten because they were already natural: the lead, 「わからない」が入口で止める。, the three
remaining method principles, both product lines, both boundary statements, and the company body.

**No English string gained a stronger AI, ownership, capability, customer, scale, traction,
leadership or market claim.** Factual strength and boundaries match the Japanese exactly.

## QA

**12/12 clean** — ja and en at 1440/1280/768/430/390/375. Every row asserts `html lang`, `og:locale`
and a locale-correct title, plus: 0 overflow, gutter breaks, narrow columns, clipped text, glued
English, fragmented Japanese, sub-44px targets; axe WCAG 2.2 AA **0 violations**; 0 console errors;
0 failed requests; exactly 1 `h1`; 0 animations running once settled. Keyboard: 14/14 focus-visible
in both locales. Reduced motion: 0 running, field fully resolved, both locales. 35/35 route-policy
tests pass.

**Lighthouse** (three consecutive runs each; one initial JA run reported 78 / LCP 4.7s and was a
single-run outlier — the stable figure is below):

| | JA | EN |
|---|---|---|
| Performance | 90 | 90 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | **100** | **63** |
| LCP / CLS / TBT | 3.5s / 0 / 10–40ms | 3.5s / 0 / 10ms |

**Non-regression:** `/mirai-move`, `/kakari`, `/about`, `/company`, `/contact` all return 200,
`html lang="ja"`, and **0 references to p5r1**.

## Known limitation — P6 work, not a P5R1 failure

English SEO is 63 on a single audit, `is-crawlable`. `/?lang=en` is intentionally non-crawlable under
the existing robots policy: `Allow: /$` is anchored and the matched value includes the query string.
**This is recorded as P6 work and was not fixed here** — `robots.ts` is untouched, and the resolution
is the deferred `/` = ja, `/en` = en path routing.
