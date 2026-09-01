# CORP-P3 — Founder Visual Review

**Package:** CORP-P3 · **Date:** 2026-08-24 · **Prior verdict:** `REVISE` (CORP-P2 Founder review)

> ## Verdict: `READY_FOR_FOUNDER_ACCEPTANCE`

All six findings F-01 … F-06 are resolved with evidence. No finding remains open. Section 8 lists
what I would still call weak, so the verdict is legible rather than assumed.

---

## F-01 — Japanese hero line-breaking · **RESOLVED**

**Was:** at 1440px the H1 stranded 「る。」 on its own line; at 768px 「よりそい」 split as 「よりそ」/「い」.

**Correction.** The wording is untouched. What changed is where a break is *allowed*: the thesis is
authored as phrase units — 「人と社会のあいだに、」「次のよりそいを」「つくる。」 — each rendered as an
inline-block, so the browser may only break **between** units and can no longer invent a break inside
a word. The same treatment is applied to the lead paragraph, both product one-liners, and every
section heading (`HEADING_UNITS`).

Shrinking the type until it fitted was considered and rejected: it would trade a typographic defect
for the loss of the hierarchy the first screen depends on.

**Evidence.** Measured by grouping rendered unit line-boxes by top offset, at all five widths, on all
six routes: **single-character orphan lines = 0 · punctuation-only lines = 0 · splits inside
「よりそい」 = 0 · clipped text = 0.**

## F-02 — Mobile navigation · **RESOLVED**

**Was:** five links wrapped into two exposed rows at 390px; heavy header, weak brand/nav hierarchy,
visibly a wrapped desktop nav.

**Correction.** Closed state is now **one row, 64px**: wordmark left, a single labelled control
(「メニュー」) right. Navigation opens through a native `<details>/<summary>` disclosure — chosen as the
smallest platform solution: keyboard operation, `aria-expanded`, and an accessible name come for
free, with **no JavaScript, no client component, no dependency, and no focus trap to manage**. The
page remains a fully static server component. At ≥768px the disclosure is hidden and links render
directly, so desktop navigation stays immediate. Active route is marked with `aria-current="page"`
on both lists.

**Evidence.** Header height closed **64px** · panel exposes **5 links** · all six routes reachable ·
`<summary>` opens and closes on **Enter** · **13/13 focusable stops have visible focus** · 0 tap
targets under 44px · no trap. Screenshots `mobile-menu-closed-390.png`, `mobile-menu-open-390.png`;
trace `mobile-nav.zip`.

**A real defect surfaced here.** The first implementation *looked* right and was **not clickable** —
`.header` was `position: static`, so its `z-index` created no stacking context and `<main>` painted
over the open panel; the hero H1 intercepted taps on menu links. Caught by the interaction flow, not
by axe. Fixed by making the header `position: relative`.

## F-03 — Desktop vertical density · **RESOLVED**

**Correction.** Two changes, in this order of importance: (1) the homepage product blocks became a
**two-column composition** at ≥1024px — description left, diagram right — instead of stacking a
full-width diagram under the text, which was the single largest contributor to height; (2) the
section rhythm dropped from `clamp(72px, 11vw, 128px)` to `clamp(48px, 5.2vw, 72px)`, with tighter
step/beat/detail padding at desktop. **Japanese body leading is untouched at 2.00**, and no truthful
content was removed to shorten the page.

| Capture | CORP-P2 | CORP-P3 | Target | Verdict |
|---|---:|---:|---:|---|
| home 1440 | 5440px | **4372px** (−19.6%) | ≤ 4500 | **MET** |
| mirai-move 1440 | 3057px | **2720px** (−11.0%) | ≤ 2800 | **MET** |
| kakari 1440 | 2979px | **2778px** (−6.7%) | ≤ 2800 | **MET** |
| home 768 | 5006px | 5764px (+15.1%) | — | see note |
| mirai-move 768 | 2725px | 2615px (−4.0%) | — | improved |
| kakari 768 | 2655px | 2704px (+1.8%) | — | flat |

**Recorded justification for the mobile/tablet increases.** The targets are desktop (1440). At 390px
and 768px the pages grew because CORP-P3 **added content**: the Mirai Move party list with standpoint
notes, and the Kakari four-step procedure with per-step notes and the boundary gate. That is
information carrying its own height, not reserved empty space — the F-03 finding was about empty
ground, and empty ground is what was removed. At 768px the two-column product layout has not yet
engaged (it starts at 1024px), so the added content shows at full height there.

## F-04 — Product over-isomorphism · **RESOLVED**

**Was:** both products used the same three-column block, the same four-dot horizontal line, the same
rhythm, the same boundary callout, and near-identical page composition.

**Correction.** The shared four-dot `RouteDiagram` is gone from both products. Each now has a visual
whose *structure* encodes what that business is:

| Axis | Mirai Move | Kakari |
|---|---|---|
| Geometry | **Radial** — parties around a shared centre | **Vertical linear** — 01→04 |
| Implementation | inline SVG + `<ol>` caption | **pure semantic `<ol>` + CSS, no SVG** |
| Reading order | simultaneous, no first or last | strictly sequential |
| Terminal element | accented centre (convergence) | **boundary gate** — the rail visibly stops |
| Assertion | many standpoints, one opportunity | one procedure, with a limit |

The Kakari boundary is no longer a callout appended after a generic diagram: the accent rail breaks
into a dashed segment and terminates in a labelled band, so the limit is *in* the procedure. Full
rationale and rejected alternatives in `CORP_P3_VISUALIZATION_DECISION_RECORD.md`.

**Accessible alternatives.** Mirai Move's SVG is `role="presentation"` + `aria-hidden`; the `<ol>`
carries the content, so it is announced once. Kakari's flow *is* semantic list markup — the rail and
gate are CSS on real elements, nothing meaningful is decoration-only.

## F-05 — First screen memorability · **RESOLVED**

**Correction.** The desktop first screen is now deliberately asymmetric: statement left (thesis, lead,
two product chips), conceptual figure right. The figure states the company's position — three 人 marks
on the left, three 仕組み squares on the right, a solid rail to the people side, a **dashed** rail to
the systems side (the gap that is not yet closed), and Yorisou as the bridge between them with the
two fields named in the key. It is a **conceptual company diagram, not a claim of operating
infrastructure**: no nodes are counted, no flow is asserted, nothing implies live systems.

One screen now carries all three required messages: company thesis; company type and responsibility
(the bridge, plus 「プロダクトをつくる会社です」); and Mirai Move and Kakari as two separate fields
(named chips, linked, each with its own domain label).

On mobile the grid collapses to a single column and the figure sits below the statement at
`max-width: 380px` — present, not an oversized decorative block.

No stock photography, generated imagery, AI spheres, gradients, dashboards, logos, metrics or
testimonials were added.

## F-06 — Product first-screen identity · **RESOLVED**

**Mirai Move** opens as a relationship instrument: name, field line, stage label, the one-liner as a
phrase-composed H2, then the **network schematic immediately in the first screen** — a reader sees
the shape of the problem before scrolling.

**Kakari** opens as an evidentiary procedure: same skeleton, but the first screen is text-precise and
the **numbered flow with its boundary gate** follows, so the page reads as a governed procedure with
a stated limit rather than a pitch.

Both remain one Yorisou system — same tokens, same type scale, same shell, same stage-label device,
same boundary block. **No sub-brand design system was created.** Stage truth still appears **before**
any capability description on both pages, and neither boundary was weakened:

- Mirai Move retains 「公開サイト稼働中／プラットフォーム機能は開発中」 and 「自律エージェントによる
  自動実行は有効化していません」.
- Kakari retains 「開発中（一般公開前）」 and 「士業の代理は行いません。法務・税務・公的判断が必要な
  領域は、専門家が担う範囲として明示します。」

## 7. Claim ledger

Still enforced, now across all 30 route × viewport combinations: **0 prohibited claims rendered**. No
company fact, contact detail, customer, partner, metric, award, team detail, founder biography or
availability claim was invented. `COMPANY_REGISTRATION_SOURCE_REQUIRED` and
`VERIFIED_CORPORATE_CONTACT_REQUIRED` remain as designed pending states.

## 8. What I would still call weak

- **768px is the least resolved width.** The two-column product layout starts at 1024px, so tablet
  carries the new content at full stacked height. Defensible, not optimal.
- **The hero figure is conceptual, and conceptual figures are easy to over-read.** It is deliberately
  quiet; a reader in a hurry may treat it as ornament.
- **The site is still honest but thin** — both products pre-launch, no company facts, no contact.
  That is correct for today and remains the main limit on what the design can do.
- **Screenshots are full-page captures**, useful for review rather than presentation.

None of these is an F-01…F-06 finding, and none blocks acceptance.
