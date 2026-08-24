# CORP-P2 — Claim Ledger

**Package:** CORP-P2 · **Date:** 2026-08-24 · **Scope:** every material claim rendered on the six
corporate Preview routes.

Classification: **VERIFIED** (canonical source cited) · **PENDING** (true but unpublishable until a
source exists) · **PROHIBITED** (must never be rendered).

**Rendered PROHIBITED claims: 0.** Machine-verified across 6 routes × 5 widths — see
`CORP_P2_UI_UX_REVIEW.md` §validation.

---

## 1. VERIFIED — rendered, with source

| # | Claim as rendered | Route | Canonical source | Exact supporting location |
|---|---|---|---|---|
| V-01 | 人と社会のあいだに、次のよりそいをつくる。 | all (footer), home (H1) | Approved Founder design brief | CORP-P2 mandate, "Use this approved thesis" |
| V-02 | Yorisouは、暮らし・仕事・地域にある複雑さを見つめ、人が理解し、選び、前に進めるプロダクトをつくる会社です。 | home | Approved Founder design brief | CORP-P2 mandate, "Hero supporting copy" |
| V-03 | 複雑さは、個人の努力だけでは解けない。 | home | Approved Founder design brief | CORP-P2 mandate, "The problem" |
| V-04 | 現場の言葉から始める / わかるところまでをプロダクトの責任にする / 境界を明示する / 検証できることだけを言う | home, about | Approved Founder design brief | CORP-P2 mandate, "How we build" |
| V-05 | 日本のモビリティ領域における、情報・マッチング・事業開発のためのプラットフォーム。 | home, mirai-move | Approved Founder design brief (required wording) | CORP-P2 mandate, "Mirai Move must be described as" |
| V-06 | 公開サイト稼働中／プラットフォーム機能は開発中 | home, mirai-move | `mirai-move/PROJECT_START_HERE.md` | "**Live in production** on Vercel at **https://www.miraimove.com**" AND "production is **NOT** yet the V2 full system" |
| V-07 | miraimove.com | mirai-move | `mirai-move/AGENT_PROJECT_RULES.md` §1 | "Display name: Mirai Move (`miraimove.com`)" |
| V-08 | 行政・自治体、企業、介護／福祉／地域の現場、海外サプライヤー、国内パートナーをつなぎ… | home, mirai-move | `mirai-move/PROJECT_START_HERE.md` | "connecting government, institutions, enterprises, care/welfare/community use cases, overseas suppliers, Japanese partners…" |
| V-09 | 自律エージェントによる自動実行は有効化していません。 | home, mirai-move | `mirai-move/PROJECT_START_HERE.md` | "**no Agent is activated**" |
| V-10 | 外部への働きかけを伴う操作は、人の確認を前提とした設計としています。 | home, mirai-move | `mirai-move/PROJECT_START_HERE.md` | "bounded autonomous Agents with **human-gated external action**" |
| V-11 | 現在は基盤とアーキテクチャの整備段階にあります。 | mirai-move | `mirai-move/PROJECT_START_HERE.md` | "Phase A constitution/architecture complete (Package 20A)" |
| V-12 | 日本で暮らす人・事業を始める人のための、多言語の行政手続き・書類サポート。 | home, kakari | Approved Founder design brief (required wording) | CORP-P2 mandate, "Kakari must be described as" |
| V-13 | 開発中（一般公開前） | home, kakari | `kakari/PROJECT_START_HERE.md` | hosted Preview foundation only; "External providers remain disabled"; "Draft PR #2 remains open, draft, unmerged" |
| V-14 | 必要な情報の提示、書類の準備、フォームの作成、提出・郵送の手順案内 | home, kakari | `kakari/PROJECT_START_HERE.md` | "information, document preparation, form generation, printing/posting guidance, and step-by-step procedures" |
| V-15 | 士業の代理は行いません。法務・税務・公的判断が必要な領域は、専門家が担う範囲として明示します。 | home, kakari | `kakari/PROJECT_START_HERE.md` + `kakari/AGENT_PROJECT_RULES.md` §1 | "never impersonates a licensed professional; high-risk legal, tax, and official matters escalate to professionals" |
| V-16 | 認証基盤を独立した検証環境に構築し、権限とストレージの検証を行っている段階です。外部連携は無効のまま | kakari | `kakari/PROJECT_START_HERE.md` | "authenticated foundation is applied to an independent Tokyo Supabase Preview project… External providers remain disabled" |
| V-17 | 日本語や専門知識の壁があると、本来使えるはずの制度にたどり着けません。 | home, kakari | `kakari/PROJECT_START_HERE.md` | "who lack the language skills or specialist knowledge to handle Japanese procedures alone" |
| V-18 | Mirai Move と Kakari は別々の事業である | all | `mirai-move/AGENT_PROJECT_RULES.md` §1 + `kakari/AGENT_PROJECT_RULES.md` §1 | "not the Yorisou personality-test…"; "it is not YORISOU and not Mirai Move; no cross-product writes" |
| V-19 | このサイトには、数値や企業名を用いた実績の紹介を掲載していません。 | about | Self-describing; verified by the content scan returning 0 metric patterns | `CORP_P2_UI_UX_REVIEW.md` §validation |

**Interpretation claims** (V-03's supporting paragraphs, the three problem beats, the four method
long-form bodies, and the "扱っている問題／向き合っている相手" framings) are Yorisou's own stated
position, not assertions about the world. They are rendered as position, contain no numbers, no third
parties, and no capability claims.

## 2. PENDING — true or possible, deliberately unpublished

| # | Item | Route | Blocker | Why it is not rendered |
|---|---|---|---|---|
| P-01 | 商号 | company | `COMPANY_REGISTRATION_SOURCE_REQUIRED` | No 履歴事項全部証明書 / 定款 in the workspace |
| P-02 | 本店所在地 | company | same | Only a city-level value exists on the live page; unverified |
| P-03 | 郵便番号 | company | same | No source |
| P-04 | 設立年月日 | company | same | Live page shows a year only |
| P-05 | 代表者（氏名・肩書） | company | same | See PR-01 |
| P-06 | 法人番号 | company | same | Never obtained |
| P-07 | 資本金 | company | same | No source |
| P-08 | 事業目的（登記されたもの） | company | same | Registered purposes differ from marketing description |
| P-09 | 公式連絡先 | contact | `VERIFIED_CORPORATE_CONTACT_REQUIRED` | No verified channel; a form would collect data with nowhere to send it |
| P-10 | 英語版 | — | Founder decision | Not authorized |

P-01…P-08 are rendered as **field names only**, inside a labelled pending block. No value, and no
digit, appears beside any of them.

## 3. PROHIBITED — must never be rendered

| # | Prohibited claim | Reason | Status |
|---|---|---|---|
| PR-01 | **代表取締役** | A 株式会社 title. A 合同会社 has 代表社員. The live `/company` renders this today — see the route matrix, R-02 | **0 occurrences** |
| PR-02 | 株式会社 / any corporate form for Yorisou | Unverified | 0 |
| PR-03 | 福岡県福岡市 or any address | Unverified | 0 |
| PR-04 | Any 資本金 / 設立年月日 / 法人番号 **with a value** | Unverified | 0 |
| PR-05 | 診断・セラピー・治療・カウンセリング・メンタルヘルス | `AGENT_PROJECT_RULES.md` §10 — no medical, diagnostic or therapeutic positioning, absolute | 0 |
| PR-06 | 導入企業・お客様の声・受賞・提携先 | No evidence exists | 0 |
| PR-07 | Any user count, revenue, customer, or metric | No evidence exists | 0 |
| PR-08 | An operating multi-agent / completed Mirai Move platform | Contradicted by V-09/V-11 | 0 |
| PR-09 | Kakari as available, launched, or in service | Contradicted by V-13 | 0 |
| PR-10 | Licensed legal / tax / immigration representation | Contradicted by V-15; `kakari/AGENT_PROJECT_RULES.md` §1 | 0 |
| PR-11 | Old consumer CTAs (今の自分から始める, 120問, チェックイン, 無料で) | Archived product | 0 |
| PR-12 | Merging Mirai Move and Kakari into one product | CORP-P2 mandate | 0 — separate routes, separate compositions, alternating grounds |

### How PROHIBITED is enforced

`test-results/corp-p2-validate.mjs` runs two distinct checks:

- **ABSOLUTE list** — terms that may never appear in any form (`代表取締役`, `代表社員`, `株式会社`,
  `福岡県福岡市`, the medical set, `導入企業`, `お客様の声`, `受賞`, `提携先`, the consumer CTAs).
- **VALUE-GATED list** — `資本金`, `設立年月日`, `法人番号`, `本店所在地`. These legitimately appear as
  pending field *labels*, so they count as a violation only when a value follows within 24 characters
  (digits, 円, 〒, or 年+digit).

The split was introduced because a bare substring test could not tell a label from a claim — and,
when first written, the value-gated form **missed `代表取締役 Jin Yang`**, the exact defect live on
`/company`. Proof cases now run against the checker: label-only text returns clean, while
`資本金 1,000,000円`, `設立年月日 2026年4月1日`, `代表取締役 Jin Yang`, `法人番号 1234567890123`, and the
live `/company` text all trigger. The check is stricter than a substring match, not weaker.

One page change resulted: `/about` originally read
「導入数、利用者数、取引先、提携先、受賞歴を掲載していません」 — a negation, but it enumerated
prohibited nouns. It was rewritten to 「数値や企業名を用いた実績の紹介を掲載していません」, keeping the
meaning without the enumeration. The page was fixed rather than the test loosened.
