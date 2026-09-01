# CORP-v1.2 — public claim ledger

Every material public statement on the corporate site, with its evidence and its state.
Review date for all rows: **2026-08-30**. Preview only.

**Claim states:** `VERIFIED` — supported by repository or Founder-supplied evidence ·
`BOUNDED` — true only as written, and the wording is doing the limiting work ·
`THESIS` — stated as intention or hypothesis, never as achievement ·
`OMITTED` — deliberately not published because evidence is absent.

**Translation risk** is the risk that a translation makes the claim *stronger* than the Japanese.

| ID | Object | Japanese canonical meaning | Evidence | State | Translation risk | Public |
|---|---|---|---|---|---|---|
| C-01 | Legal entity | Yorisou 合同会社 — a Japanese GK, member-managed LLC | Founder-supplied; consistent across prior packages | VERIFIED | **High** — many languages have no GK; must not render as a joint-stock company | Yes |
| C-02 | Representative | **業務執行社員** Jin Yang / ジン・ヤン (corrected by RELEASE_GATES_3 Track F: 代表社員 is designated *from among* the 業務執行社員 under 会社法 §599(3), so 業務執行社員 is true under either answer) | Founder-supplied + 会社法 §599(3) | VERIFIED | **High** — must never become CEO/取締役 | Yes |
| C-03 | Location | 福岡県福岡市 — city level only | Founder-supplied | VERIFIED | Low | Yes |
| C-04 | Company facts | Trade name, representative, city, business activity — four rows | Founder-supplied | BOUNDED | Low | Yes |
| C-05 | Capital, founding date, street address | — | No evidence supplied | **OMITTED** | — | No |
| C-05a | **法人番号 2290003018125** | The 13-digit corporate number the National Tax Agency publishes for ＹＯＲＩＳＯＵ合同会社 | NTA Corporate Number Publication Site, queried 2026-08-31; published in every locale since `8be233c` | VERIFIED | Low — a number, not a phrase | Yes |
| C-06 | Education — MBA | IESE Business School 経営学修士（MBA） | Founder-supplied (Answer 2) | VERIFIED | **High** — must attach to IESE only | Yes |
| C-07 | Education — Harvard | Harvard Business School Executive Education, General Management Program 修了 | Founder-supplied (Answer 2) | BOUNDED | **Critical** — must never imply an HBS MBA, a Harvard University degree, or endorsement | Yes |
| C-08 | Career background | 20+ years automotive/mobility/manufacturing; senior commercial and industrial responsibility at Ficosa; founded and operated technology-manufacturing businesses in China | Founder-supplied (Answer 2) | BOUNDED | Medium — no employment dates or exact titles | Yes |
| C-09 | Endorsements by IESE / Harvard / Ficosa / government | — | None | **OMITTED** | — | No |
| C-10 | Mirai Move | モビリティ領域の情報・マッチング・事業開発。開発・運営中、公開サイトあり | Public site exists; prior package verification | BOUNDED | Medium | Yes |
| C-11 | Kakari | 多言語の手続きサポート。開発中、公開準備段階 | Repository evidence; not publicly released | BOUNDED | Medium | Yes |
| C-12 | Chigamo | 場所と文脈からの生活圏の発見。**構想段階** | **No canonical source found** — no repository, not in the project registry, not in this repo. Public-safe thesis supplied in the execution package | **THESIS** | **Critical** — must never imply a product, users, or a municipal programme | Yes, as concept |
| C-13 | Ventures are subsidiaries / investments / clients | — | None | **OMITTED**; the Ventures page states outright that they are none of these | — | Denied explicitly |
| C-14 | Asterion OS | 独立した共通技術・実行基盤。YORISOU の所有物ではない | Constitutional model is Asterion-independent, YORISOU-licensed | BOUNDED | **Critical** — no "powered by", no ownership, no data inflow | Yes, as independent |
| C-15 | Executed Asterion Foundry licence | — | **Not evidenced as executed** | **OMITTED** — the site never says Yorisou is licensed to use Asterion | — | No |
| C-16 | Foundry method | 課題→証拠→設計→構築→事業として立つ→創業チーム→独立→学習 | Describes how work actually proceeds | BOUNDED | **High** — must never become "proven" or "repeatable" | Yes, as method |
| C-17 | Spin-out track record | — | None; nothing has been spun out | **OMITTED**; the maturity note says so plainly | — | Denied explicitly |
| C-18 | Founding economics | 貢献・リスク・継続する責任に従う。具体条件は事業ごと | Internal governance | BOUNDED — principle only | **High** — no percentages, no bands, no terms | Principle only |
| C-19 | Internal equity bands (30–37% / 15–25% / 5–15%) | — | Internal planning only | **OMITTED** — not a public offer | — | No |
| C-20 | University / government / corporate collaboration | 招待。応募や選考の仕組みは現在ない | No agreements evidenced | **THESIS / invitation** | **High** — must not become "partner"; no "Apply now" | Yes, as invitation |
| C-21 | Fukuoka City support or programme membership | — | None | **OMITTED** | — | No |
| C-22 | Hong Kong / Spain / US entities | — | Planned only | **OMITTED** — no office, entity or subsidiary is presented as existing | — | No |
| C-23 | Customers, revenue, funding, users, traction | — | None | **OMITTED** | — | No |
| C-24 | Contact delivery | contact@yorisou.online is the public identity | Outbound transport unverified; no valid credential, no authoritative DNS | **BOUNDED** — the form must not claim delivery it cannot perform | Low | Address yes; delivery no |
| C-25 | Translation review state | ja canonical, en human-reviewed, 19 AI-translated | Registry | BOUNDED — internal metadata, never shown to visitors | — | No |

## CORP-v1.2R2 additions

| ID | Object | Meaning | Evidence | State | Public |
|---|---|---|---|---|---|
| C-26 | Mirai Move NOW | Public site live; the research system runs unattended; **nothing has ever been sent externally** | Its own repo: verified zeros for outreach sends, replies, deliveries, payments | BOUNDED | Yes |
| C-27 | Mirai Move NEXT | Open questions on the one substantive case need external contact | Its own case records classify them EXTERNAL_CONTACT_REQUIRED | VERIFIED | Yes |
| C-28 | Kakari NOW | Private testing; not publicly available; no users | Its own positioning: "a private-testing MVP, not a public product: no deployment, no provider/domain, no customers, no revenue"; Production 0 users | VERIFIED | Yes |
| C-29 | Kakari professional boundary | Never replaces 弁護士 / 税理士 / 行政書士 / 司法書士 | Its own shipped product string in three languages | BOUNDED | Yes |
| C-30 | Venture Japanese lines | Each wordmark paired with that venture's own Japanese line | Mirai Move `lib/brand.ts` slogan; Kakari positioning; Chigamo approved thesis | BOUNDED | Yes |
| C-31 | Brand transliteration | カカリ / ミライムーブ / チガモ are **never** published | Kakari's own glossary forbids it and enforces it in CI; Mirai Move has no reading in its brand source | **OMITTED** | No |
| C-32 | "DP" acronym | — | No canonical definition anywhere; established three independent ways including full git history | **OMITTED** — plain Japanese used instead | No |
| C-33 | Participation lanes | Six lanes, each stating what cannot be promised | No salary, funding, ownership terms, hiring pipeline, municipal record, research agreement or case studies | BOUNDED | Yes |
| C-34 | Recruitment state | No application process, no selection programme | None exists | **Denied explicitly** | Yes, as denial |
| C-35 | Motion field | Not live, not real-time, no activity counts | It is an explanatory loop; the only text is Foundry stage names | BOUNDED | Yes |

## CORP-v1.2R2.1 additions

| ID | Object | Meaning | Evidence | State | Public |
|---|---|---|---|---|---|
| C-36 | Venture formation stage | Mirai Move 4, Kakari 4, Chigamo 1 on the Foundry sequence | Each venture's own repository evidence, recorded per-venture in `ventureState.ts` | BOUNDED — named stage only, never a percentage | Yes |
| C-37 | Guided explainer | A ~32s animated explanation, never a video | No video asset exists; no MP4/Lottie/WebGL is referenced | BOUNDED | Yes |
| C-38 | Home role→venture links | Which ventures each participation role connects to | That lane's own `ventures` field | BOUNDED — information architecture, never matching or personalisation | Yes |

## Enforcement

Rows C-13, C-14, C-15, C-17, C-19, C-22, C-23 and C-20 are enforced by
`tests/corporate-p5r2/corporateClaims.test.ts`, which fails the build on the dangerous
constructions rather than on ordinary vocabulary. The guard is negation-aware: the site frequently
*names* a forbidden claim in order to deny it, and a guard that could not tell an assertion from a
denial would push the copy into vagueness — the opposite of its purpose.

Rows C-01, C-02, C-06 and C-07 are additionally verified against **rendered** output in every locale,
because a source-level check cannot see what a reader actually sees.

## Standing rule

A polished site does not upgrade evidence. When a claim cannot be made truthful, the copy is
weakened or the claim is omitted — never invented, and never quietly strengthened in translation.

## CORP-v1.3 additions

Review date for these rows: **2026-08-31**. Preview only.

| ID | Object | Meaning | Evidence | State | Public |
|---|---|---|---|---|---|
| C-39 | Venture **composition** | 2 being built, 1 at concept — never "three ventures underway" | `VENTURE_CLASS` in `app/_corporate/brand.ts`, cross-checked against `ventureState.ts` and rows C-10/C-11/C-12 | VERIFIED — the number is computed, not written | Yes |
| C-40 | YORISOU palette | Navy `#061133`, blues `#0c3c9c` / `#1854b4` / `#3c9cf0`, wash `#cce4fc` | **Sampled from the Founder's artwork**; the guard decodes the PNG and fails if a colour is not in it | VERIFIED | Yes, as the site's accent |
| C-41 | YORISOU strapline 「人と技術が、未来をつくる。」 | The company's own line | Set by the Founder **inside the logo artwork itself**; translated into 21 locales for the footer | VERIFIED — Founder-authored | Yes |
| C-42 | Descriptor "AI-Native Venture Foundry" | How the company describes itself | Set by the Founder inside the same artwork, in Latin capitals | BOUNDED — a self-description, never an achievement or a category claim | Yes, in the title and the artwork |
| C-43 | Mirai Move accent `#0e9f9a` | That venture's own mobility teal | Mirai Move's own brand module and its own OG card device | BOUNDED — decorative; the name and stage are always text | Yes |
| C-44 | Kakari accent `#a63e2d` | That venture's own product accent | Kakari's own product shell tokens | BOUNDED — decorative | Yes |
| C-45 | Chigamo has **no** colour and no device | It has no canonical brand source of any kind | Same absence recorded in C-12 | **OMITTED, and drawn as omitted** — an open outline, never a filled mark | Yes, as absence |
| C-46 | Browser identity | Tab icon, home-screen icon and share card are the company's artwork | Generated by proportional scale from the recorded artwork onto the site's paper ground. No crop, no recolour, no redraw | VERIFIED | Yes |
| C-47 | Favicon legibility | At 32px only the symbol reads; the wordmark does not | The artwork is a stacked square lockup and no logomark-only or vector variant exists | **Stated as a limitation**, not hidden | Recorded in the launch gate |
| C-48 | Crawlable corporate routes | `/`, `/ventures`, `/mirai-move`, `/kakari`, `/chigamo`, `/about`, `/build-with-us` | Every one is claim-guarded copy; each `Allow` is `$`-anchored | BOUNDED | Yes |
| C-49 | `/company` and `/contact` remain crawl-blocked | Contact delivery is unverified; the company record is a Founder decision | `CORPORATE_BLOCKED` + the launch gate | BOUNDED | No |

## CORP-v1.3.1 additions

Review date: **2026-09-01**. This is the release that goes to Production.

| ID | Object | Meaning | Evidence | State | Public |
|---|---|---|---|---|---|
| C-50 | **Venture total** | YORISOU builds several ventures; the site shows the ones ready to be shown | Founder statement. The three published are named and counted as a labelled subset — 現在公開している事業 — never as the company's total | **BOUNDED — the count describes the public set only** | Yes |
| C-51 | Norynto | Not a portfolio venture and not on the site | Standing v1.2 governance: `NORYNTO PORTFOLIO_VENTURE = NO`. Corroborated by `CORP_P5_CORPORATE_PORTFOLIO_TRUTH_MATRIX.md`, which already ruled EXCLUDE | **OMITTED by standing decision** — not an open question | No |
| C-52 | YORISOU symbol favicon | The tab icon is the logo's symbol, cropped from the approved artwork | Founder authorisation, narrowly scoped to favicon/app-icon. Crop box measured from the artwork's own alpha profile; geometry, colour and proportion untouched | VERIFIED | Yes |
| C-53 | Mirai Move logo | The venture's official mark | Founder original `sha256 c7d62d96…`; the file shipped is Mirai Move's own committed derivative `sha256 108e085b…`, whose repo README records the same source hash | VERIFIED — `PROJECT_CANONICAL_BRAND` | Yes |
| C-54 | Mirai Move accent `#8e5330` | Corrects the stale `#0e9f9a` citation | That repo's effective `--accent` on origin/main; the teal token is never overridden but is referenced nowhere, so it was never the effective accent | **CORRECTED** — supporting data, not painted | No |
| C-55 | Kakari 「係 / Kakari」 | A corporate co-mark, not a translation and not a transliteration | Founder decision for this surface only | BOUNDED — corporate surface only; the application keeps `Kakari` | Yes |
| C-56 | カカリ / 卡卡里 | Still forbidden everywhere | The claim guard's transliteration rule is **byte-identical** to v1.3; 係 never matched it, so no exception was granted | **OMITTED, unchanged** | No |
| C-57 | Chigamo mark | A Founder-approved new mark for a venture that had none | Founder authorisation. Three concepts built and judged at 24px; two rejected by looking | VERIFIED — `FOUNDER_APPROVED_NEW_VENTURE_MARK` | Yes |
| C-58 | Chigamo maturity | Unchanged by the new mark | Still concept stage, still Foundry stage 1, still counted apart, still **no brand colour** | **BOUNDED — a logo is not a product**; C-12 unaffected | Yes |
| C-59 | Corporate apex | `yorisou.online` is the YORISOU / Yorisou Foundry website | Founder decision | VERIFIED | Yes |
| C-60 | Consumer Today | Restored at `/today`, verbatim from `8fd5bd5` | Recovered from repository history; components byte-identical; ARCH-P3 L/M rebound to the real surface and green | VERIFIED — not a new product | Yes |
| C-61 | Production locales | ja and en public; 19 others `preview_only` | The typed registry gate, unchanged | BOUNDED | ja/en yes |
| C-62 | Contact at launch | Truthful, and the form is not shown | Transport still unconfigured; page and endpoint share one predicate | **BOUNDED — no delivery is claimed** | Yes, as state |
