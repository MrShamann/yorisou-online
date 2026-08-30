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
| C-02 | Representative | 代表社員 Jin Yang / ジン・ヤン | Founder-supplied (Answer 2) | VERIFIED | **High** — must never become CEO/取締役 | Yes |
| C-03 | Location | 福岡県福岡市 — city level only | Founder-supplied | VERIFIED | Low | Yes |
| C-04 | Company facts | Trade name, representative, city, business activity — four rows | Founder-supplied | BOUNDED | Low | Yes |
| C-05 | Registration no., capital, founding date, street address | — | No evidence supplied | **OMITTED** | — | No |
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
