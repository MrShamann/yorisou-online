# YORISOU Corporate Homepage — Phase 1 Preview

**Package:** `YORISOU CORPORATE HOMEPAGE — PHASE 1 PREVIEW` · **Base:** `main @ b5521141b6b0863ce2e3451278cc8756f1e6c27d` ·
**Branch:** `product/corporate-homepage-preview` · **Date:** 2026-08-24 ·
**Status:** Preview only. Not deployed. Not linked from any navigation or sitemap.

> This document records what was built and what every factual claim is sourced from. It authorizes
> nothing. Production release, DNS, and the disposition of the existing consumer routes are all
> separate Founder decisions.

## 1. Route strategy and why

**`app/prototype/corporate/page.tsx` → `/prototype/corporate`**

Chosen because it is the smallest safe option that satisfies the isolation requirement:

- `app/prototype/` already exists as this repository's preview sandbox (precedent: the UX1
  four-surface prototype and the UX4 hook-first loop).
- `"/prototype"` is already present in `SHELL_SUPPRESSED_PREFIXES` in `app/components/AppShell.tsx`,
  so the corporate surface renders with **no consumer chrome** — no `AppHeader`, no `SiteFooter`,
  no `MobileBottomNav`.
- Consequence: **zero existing files were modified.** The package is purely additive.
- No middleware, no redirect, no route deletion, no change to `/` or `/company`.

Rejected alternatives: a new root-level route (would inherit the consumer `AppShell` chrome); a
second root layout via route groups (would require moving the existing homepage, which is a
forbidden route change).

The root layout still supplies `<html>`, `<body>` and the Noto Sans JP font. It performs environment
reads only (`connectionOperational()`, `getReleaseMarker()`) and makes no Supabase or network call.

## 2. Files added

| File | Purpose |
|---|---|
| `app/prototype/corporate/page.tsx` | Static server component. No `"use client"`, no state, no effects, no fetch. |
| `app/prototype/corporate/corporate.module.css` | CSS Module. All tokens scoped to `:where(.page)` so nothing leaks into or out of the consumer global cascade. |
| `docs/yorisou/corporate/PHASE1_PREVIEW.md` | This record. |

No existing file was modified.

## 3. Content source for every factual claim

| Claim | Source |
|---|---|
| Thesis 「人と社会のあいだに、次のよりそいをつくる。」 | Approved Founder design brief |
| Hero supporting copy | Approved Founder design brief, verbatim |
| Problem heading 「複雑さは、個人の努力だけでは解けない。」 | Approved Founder design brief |
| Four method principles | Approved Founder design brief |
| Mirai Move one-liner | Approved Founder design brief, verbatim |
| Mirai Move — domain `miraimove.com`, live public site | `mirai-move/PROJECT_START_HERE.md` ("Live in production on Vercel at https://www.miraimove.com") |
| Mirai Move — connects government / enterprises / care-welfare-community / overseas suppliers / domestic partners | `mirai-move/PROJECT_START_HERE.md` |
| Mirai Move — platform still in development, **no Agent activated** | `mirai-move/PROJECT_START_HERE.md` ("Phase A constitution/architecture complete… production is NOT yet the V2 full system; no Agent is activated") |
| Mirai Move — human-gated external action | `mirai-move/PROJECT_START_HERE.md` ("bounded autonomous Agents with human-gated external action") |
| Kakari one-liner | Approved Founder design brief, verbatim |
| Kakari — information, document preparation, form generation, submission/posting guidance | `kakari/PROJECT_START_HERE.md` |
| Kakari — pre-launch, not publicly available | `kakari/PROJECT_START_HERE.md` (hosted Preview foundation; external providers disabled; Draft PR #2 open and unmerged) |
| Kakari — does not act for licensed professionals; escalates legal/tax/official matters | `kakari/PROJECT_START_HERE.md` + `kakari/AGENT_PROJECT_RULES.md` §1 |
| Palette, typography, mobile-first, no medical framing | `AGENT_PROJECT_RULES.md` §10, §13 |

Nothing on the page asserts a user count, revenue figure, customer, partner, testimonial, award, or
press mention. Content scan confirms zero such strings.

## 4. Legal fields deliberately NOT rendered

The company registration source is **missing**. A workspace-wide search for
`登記 / 履歴事項全部証明書 / 定款 / 法人番号 / registration / incorporation` returned no authoritative
document (1 filename hit was an unrelated SQL migration; 0 content hits).

The section renders only:

> 正式な会社情報は、確認済みの登録情報に基づき公開します。

followed by a list of the field **names** awaiting verification. No value is shown for any of:

商号 · 本店所在地 · 郵便番号 · 設立年月日 · 代表者の氏名と肩書 · 法人番号 · 資本金 · 登記された事業目的 · 公式連絡先

**The existing `app/company/page.tsx` values were deliberately not reused.** They are internally
inconsistent and cannot be treated as a source: 会社名 reads 「寄り添う（Yorisou）」 (not a corporate
form), 所在地 is city-level only, 設立 is a year only, and the representative is labelled
**代表取締役** — a 株式会社 title that a 合同会社 cannot hold (a 合同会社 has 代表社員). That page
publishes those values on production today and is worth correcting independently of this package.

## 5. Validation results

Run against the **production build** (`next build` → `next start`) on `http://localhost:3311`.

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **exit 0**, 0 output lines |
| `npx eslint app/prototype/corporate --max-warnings=0` | **exit 0**, 0 output |
| `npm run lint` (whole repo) | **exit 0** — 13 pre-existing warnings, 0 errors, none in new files |
| `npm run build` | **exit 0** — "Compiled successfully"; route present in `app-path-routes-manifest.json` as `/prototype/corporate/page` |
| axe WCAG 2.0/2.1/2.2 A + AA at 320 / 375 / 768 / 1280 | **0 violations, 0 serious/critical, 23 passes — stable across 4 consecutive runs** |
| Horizontal overflow at 320 / 375 / 768 / 1280 | **none** at any width |
| Japanese body leading | **2.00** (requirement ≥ 1.8) |
| Touch targets < 44px | **0** |
| `prefers-reduced-motion: reduce` | **0 animated elements** |
| Console errors | **0** at every width |
| External network requests | **0** — all 45 resources are localhost static assets |
| Supabase / auth / database / API requests | **0** |
| Consumer chrome present | **none** — no `AppHeader`, `SiteFooter`, or `MobileBottomNav` |
| Heading order | H1 ×1, then H2/H3 with no skipped level |

### Two real defects were found and fixed, not suppressed

1. **Colour contrast — 14 nodes, serious, at every width.** `--c-mineral: #8b918c` measured
   **3.08:1** on the ground and **2.87:1** on the alternate ground, failing 4.5:1. It coloured the
   section eyebrows, product domains, diagram captions and footer column titles. Darkened to
   **`#686e69`** = 5.00:1 / 4.66:1, still lighter than `--c-muted` so the type hierarchy holds.
2. **Infinite pulse animation.** The terminal diagram node used `animation: cSignal 4.5s infinite`.
   That is a WCAG **2.2.2 Pause, Stop, Hide** concern (moving content beyond 5s with no control) and
   it also made the audit non-deterministic, because axe sampled the node mid-fade. Replaced with a
   single finite settle (`900ms … 1 both`).

A third, non-defect finding: the 320ms entry reveal fades opacity on a text container, so an audit
that samples mid-fade sees a transient contrast dip. Entry fades are not a WCAG failure and the
animation is fully removed under `prefers-reduced-motion`. The harness now awaits
`document.getAnimations()` before analysing, which measures the settled state a person actually
reads. This made the result reproducible (4/4 clean runs).

### Content scan

Absent, as required: 診断 · セラピー · 治療 · カウンセリング · メンタルヘルス · 代表取締役 ·
福岡県福岡市 · 資本金 · 導入企業 · お客様の声 · 株式会社 · any `digits + 社/人/件/%` metric pattern ·
every old consumer CTA (`今の自分から始める`, `120問`, `チェックイン`, `LINEで`, `ログイン`, `無料で`,
`/tests`, `/life`, `/check-in`, `/result`).

Two scanner hits were adjudicated as correct-by-design:

- **`実績` / `提携`** — one occurrence each, both inside the single method-04 sentence
  「実績・数値・提携は、証拠のあるものだけを記載します。確認できないことは、書きません。」 That is a
  statement of policy, not a claim of results or partnerships.
- **`法人番号`** — appears only as a field **label** in the pending list and in the footer sentence
  「…法人番号は、登録情報の確認後に掲載します。」 No value is rendered.

## 6. What was not touched

Production was not deployed to and not modified. DNS, Namecheap, Vercel settings, Supabase, AWS,
GitHub settings, and environment variables were not changed. No old consumer route was altered,
redirected, or deleted. The live homepage was not replaced. Kakari, Mirai Move and Asterion were
**read only** — no write to any of those repositories. No secret was read, decrypted, printed, or
copied.

## 7. Not authorized by this package

Production deployment · replacing the live homepage · DNS or domain change · disposition of the
existing consumer routes · publishing any legal or company fact · an English version · contact form
or any server action · reuse of the existing 175 production environment variables or the live
Supabase database.
