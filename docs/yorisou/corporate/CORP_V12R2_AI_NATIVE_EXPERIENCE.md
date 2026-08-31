# CORP-v1.2R2 — AI-native experience and venture participation

Continues CORP-v1.2R1. Branch `product/corporate-p5r2-global-site`, starting HEAD `6248091`.
Preview only. Not merged. Production, DNS, consumer data and the 120Q runtime untouched.

## Founder feedback, and what was done

| Feedback | Response |
|---|---|
| Doesn't feel AI-native or distinctively designed | A semantic Foundry Motion Field replaces the static hero diagram; the same system grammar now runs through Ventures, How We Build and the participation matrix |
| Ventures need Japanese-readable treatment | **Solved differently — see below.** Each wordmark now carries that venture's own canonical Japanese line |
| Ventures not present enough beyond Home | Added to How We Build; each has NOW/NEXT/WHO on the Ventures index and its detail page |
| Not obvious how people can participate | Six-lane participation matrix, a homepage participation grid, per-venture "work on this venture", and a distinguished nav CTA |
| A video-like introduction may help | A web-native motion explainer (option A), not a fabricated film |
| No generic AI gradients, fake dashboards, chatbots, stock video | None used. Pure SVG + CSS, no new dependency, jade remains the single accent |

## Visual diagnosis — why it did not feel AI-native

The old hero was a `HeroField` SVG with **zero animation**, and the stylesheet contained **no
`@keyframes` at all** — only a `prefers-reduced-motion` block. The page had system *imagery* and no
system *behaviour*, so the structure read `Hero → Band → Cards → Band → Cards`: competent editorial
layout in which the diagrams were illustrations.

Nothing in it said the thing the company actually does — continuously convert real-world signals into
evidence, ventures, founding teams and independent companies.

## The AI-native system

**Foundry Motion Field** (`FoundryField.tsx` + `foundry-field.module.css`) — an ~11s silent loop:

`signals arrive → evidence connects and verifies → a venture becomes defined → a founding team
attaches → the company separates and stands on its own → generalised capability returns to the
shared layer`

Constraints held throughout:

- **No fake data.** Nothing is labelled live, real-time, or an activity count. The only text is
  Foundry stage names — real process vocabulary.
- **Asterion is the floor, never the origin.** It is drawn *under* the flow and *receives* capability
  back. It never drives the ventures and is never their owner.
- **Zero JavaScript, zero dependencies.** Pure SVG + CSS keyframes — which is why performance did not
  regress. No Lottie, no WebGL, no video, no animation framework.
- **Zero new translatable strings.** Labels come from `foundry.stages`, already present in all 21
  locales.
- **Reduced motion resolves, it does not stop.** Every element pins to its final value, so the whole
  composed diagram is visible and the meaning survives intact. Enforced by a test.

Hover and focus only slow the loop for dwell. The narrative requires no interaction.

## Japanese brand treatment — the brief could not be followed literally

The package asked for `Mirai Move（ミライムーブ）`, `Kakari（カカリ）`, `Chigamo（チガモ）`.
Investigation of the ventures' own canonical sources made that impossible to do honestly:

- **Kakari affirmatively forbids transliteration.** `docs/execution/KAKARI_L10N_GLOSSARY.md` §1
  "Never translated" lists `Kakari` with: *"ASCII wordmark only. Never transliterated (カカリ,
  卡卡里)."* It is enforced in CI by `packages/i18n/src/no-english-leak.test.ts`, whose regex
  includes `カカリ`. Its shipped Japanese UI already renders the Latin wordmark inside Japanese
  sentences.
- **Mirai Move has no Japanese reading.** `lib/brand.ts` — stated in-file as the single source of
  truth for public identity — carries `name: "Mirai Move"` plus a Japanese *slogan*. A search for
  ミライムーブ across its sources returns nothing.
- **Chigamo has no canonical source at all**, so there is nothing to read a name from.

Writing those katakana would have been creating names against two projects' governance, and §5 of the
brief defers to a project's own source. The Founder's actual concern — that the Japanese site not
read as English-only — is met instead by pairing each Latin wordmark with **that venture's own
canonical Japanese line**:

| Venture | Japanese line shown | Source |
|---|---|---|
| Mirai Move | 地域の移動を、解決まで動かす。 | its own `lib/brand.ts` slogan |
| Kakari | 日本の手続きを、自分で進められるように。 | its own positioning |
| Chigamo | その場所のことが、その場所でわかる。 | the governance-approved thesis |

A guard (`brand-transliteration`) now fails the build on カカリ / 卡卡里 / ミライムーブ / チガモ and
their Cyrillic and Arabic equivalents, so Kakari's rule is enforced from this side too.

## Venture depth — NOW / NEXT / WHO

Written from each venture's own repository evidence, not from the corporate site's imagination.

**Mirai Move** — public site live; the research system genuinely runs unattended; **nothing has ever
been sent externally** (verified zeros for outreach, replies, deliveries, payments). One substantive
case; its open questions are classified as requiring external contact — which is the honest NEXT and
gives a real WHO.

**Kakari** — its own positioning states *"a private-testing MVP, not a public product: no deployment,
no provider/domain, no customers, no revenue"*; Production holds 0 users. NEXT is distribution
prerequisites and settling company registration details. The professional boundary is preserved: it
is never presented as replacing a 弁護士 / 税理士 / 行政書士 / 司法書士.

**Chigamo** — concept stage, unchanged and not broadened. It renders a deliberately simpler
`ContextField` rather than a mature platform topology, because drawing one would misrepresent its
maturity. **Its visual simplicity is the honest signal, not a gap.**

Each venture also appears inside How We Build, at its real stage — not a dashboard, and not labelled
as one.

## Participation architecture

Six lanes, each stating what Yorisou **offers** *and* what it **cannot promise**:

| Lane | Cannot promise |
|---|---|
| 創業者・共同創業者 | salary, funding, ownership terms |
| 創業メンバー・専門人材 | no standing hiring pipeline |
| 初期利用者・実証に関わる方 | no release date, no guarantee a request lands, no payment |
| 大学・研究 | no research agreement, no funding, no formal collaboration |
| 行政・公共 | no municipal track record, no procedural guarantee |
| 企業 | no commercial track record, no case studies |

A lane that lists only upside is a recruitment pitch. A test enforces that all six carry both halves.
Intake reality is stated **before** the CTAs, not in a footnote. Every `state` uses the weakest
truthful wording — 「話を聞かせてほしい段階です。募集の枠はありません。」 — never 募集中 or 応募.

Participation is also exposed on Home as a six-cell grid rendered **from the same `lanes` array**, so
the two can never drift. `一緒につくる` is set apart in the nav as a bordered link, deliberately not a
filled conversion button.

**Founding team** is stated without inventing a team: Yorisou builds evidence, product and design
*before* the operating team exists, so whoever takes it on starts from something with a shape.

## "DP" — deliberately not published

No canonical definition of `DP` exists anywhere in the workspace. Established three independent ways:
a word-boundary search returning zero in `yorisou-online`; an exhaustive enumeration accounting for
every DP-containing substring as `ENDPOINT`/`GDPR`/base64 noise; and a full git-history search across
all branches confirming the token was never present. The only `\bDP\b` in the workspace is `MM-DP`, a
Mirai Move **product**-source code prefix — a database namespace, not a person.

Publishing the acronym would have been *creating* the term, not documenting it. Public copy uses
plain Japanese instead: 初期利用者 / 実証に関わる方.

## Performance — R1 gain preserved

| Target | R1 | R2 |
|---|---|---|
| ja Home | 91 | **91** |
| ar Home | 91 | **91** |
| ja Company | 93 | **92** |
| Accessibility | 100 | **100** |
| Best practices | 100 | **100** |
| CLS | 0 | **0** |

The motion field adds no JavaScript, no dependency and no media, so the only cost is its own markup.
The 1-point Company movement is run-to-run noise, and the target (≥90) holds on all three.

## Validation

`tsc` clean · eslint 0 errors on corporate code · build passes · **15/15 corporate guards** ·
**189/189** route × locale · **axe 0 violations / 56 combinations** · **210 responsive combinations
clean** · reduced motion clean · keyboard path complete · **0 internal tokens** and **0 brand
transliterations** across rendered output · consumer regression **9/9** · 404 intact.

New guards: fake-recruitment language, fake "live"/real-time language, brand transliteration, venture
state triad and join block present in every locale, all six lanes carrying `offers` **and** `cannot`,
and the motion field's reduced-motion resolution.

One guard was corrected rather than weakened: the echo detector began failing because R2 added lane
`ventures` arrays and `siteUrl` — values that **must** be identical in every locale. It now excludes
identifier paths *by path*. Raising its tolerance threshold would have blunted the signal it exists
to catch.

## Screenshots reviewed

25 captures at 1440 and 390, plus four sampled frames of the motion loop and its reduced-motion
resolution. Locales: ja, en, zh-CN, es, ar, ko. Pages: Home, Ventures, How We Build, Build With Us,
Chigamo, Company, Mirai Move, Kakari, Contact, language selector.

## Residual issues

- Consumer Today / ARCH-P3 L/M remains red. **Untouched by this package**, as required.
- `js-yaml` production-high dependency finding unchanged — no dependency was added or upgraded here.
- Contact delivery still `BLOCKED_BY_RESEND_ACCESS` / `BLOCKED_BY_DNS_ACCESS`.
- 19 locales remain `preview_only`; the R2 copy in them is AI-translated and not natively reviewed.
- The "30 seconds" experience is a web-native motion explainer. No recorded film exists, and no
  placeholder media was shipped in its place. A real narrated asset would be a media-production
  package.
