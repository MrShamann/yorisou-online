# CORP-P3R1 — Founder Acceptance Remediation

**Package:** CORP-P3R1 · **Date:** 2026-08-24 · **From:** `681c12a` · **Prior verdict:** CORP-P3
Founder visual acceptance returned **REVISE**. The screenshots were the authoritative evidence.

> ## Verdict: `READY_FOR_FOUNDER_REVIEW`
>
> Only the Founder can accept. This verdict claims readiness for review, not acceptance.

---

## R1-1 — Desktop navigation claim was false · **FIXED**

**The finding was correct, and my CORP-P3 report was wrong.** It stated "desktop keeps direct links
at ≥768px". The screenshots showed the `メニュー` disclosure at 768 and 1440.

**Root cause.** The CORP-P3 rule that switches the nav at 768px **was written but never landed**. The
edit used a `str.replace` with no assertion; the anchor had shifted by one blank line, so the call
silently no-op'd. `.navDesktop` stayed `display: none` at **every** width and `.navDisclosure` was
never hidden. The file contained exactly one `.navDesktop` rule — the `display: none` one.

**Why no gate caught it.** Every CORP-P3 check tested **DOM presence**. The desktop links were in the
markup at all widths, so the markup looked correct. Nothing asserted that they were *rendered*.

**Correction.**
- Added the missing `@media (min-width: 768px)` rule — `.navDesktop { display: flex }`,
  `.navDisclosure { display: none }`.
- **Every edit in this package asserts its own effect.** A silent no-op cannot recur.
- The gate now measures **computed visibility**: an element counts as visible only if it is not
  `display:none` / `visibility:hidden` / `opacity:0` **and** has a non-zero bounding box.

**Evidence** — 30 route × viewport combinations, `navViolations = 0`:

| Width | Desktop nav visible | Visible desktop links | Disclosure visible | Required | Result |
|---|---|---:|---|---|---|
| 320 / 390 | `false` | **0** | `true` | disclosure 1, direct 0 | **PASS** |
| 768 / 1280 / 1440 | `true` | **5** | `false` | disclosure 0, direct 5 | **PASS** |

Screenshots: `desktop-nav-768.png`, `desktop-nav-1440.png`.

## R1-2 — Mirai Move brand name split · **FIXED**

At 1440 the two-column product grid wrapped the H2 to `Mirai` / `Move`.

**Correction.** A product name is one semantic unit: `.productName` now carries
`white-space: nowrap`, and the clamp lower bound drops from `1.6rem` to `1.45rem` so a narrow column
**shrinks** the name rather than splitting it. Heading hierarchy is unchanged — it remains the
largest element in the product block.

**Evidence.** `getClientRects().length` for the "Mirai Move" heading = **1** at both 768 and 1440;
`white-space: nowrap` confirmed computed. Aggregate `brandWrapped = 0` across all 30 combinations.
Screenshots: `brand-check-768.png`, `brand-check-1440.png`.

## R1-3 — Duplicated Kakari boundary · **FIXED**

Kakari presented two consecutive boundary treatments — 「専門家が担う範囲」 (the flow's terminal gate)
followed by 「専門家との境界について」 (a separate block). Two statements of the same limit read as
hedging and weaken the one that matters.

**Correction — consolidated, not reduced.** The gate now carries the required wording **verbatim and
in full**:

> 士業の代理は行いません。法務・税務・公的判断が必要な領域は、専門家が担う範囲として明示します。
> 弁護士・税理士・行政書士などの資格を要する判断や代理は、Kakariの機能に含まれません。

The separate block is removed from Kakari surfaces only. **Mirai Move keeps its block** — its limit
is a development status, not a step in a flow, so it has nowhere else to live.

**Evidence.** On both the Kakari page and the homepage: 「士業の代理は行いません」 = 1 ·
「法務・税務・公的判断が必要な領域は、専門家が担う範囲として明示します」 = 1 · 「専門家が担う範囲」 = 1 ·
「専門家との境界について」 = **0**. Aggregate `duplicateBoundary = 0`. **The boundary is stated once,
completely, at the point the procedure stops.**

## R1-4 — Mobile homepage density · **FIXED**

**Correction.** Compact homepage variants of both product visuals: same structure, same stage truth,
with the per-item explanatory notes suppressed. This is density, not deletion — every hidden note is
rendered in full on the product page one click away. Plus a mobile rhythm trim (48→40px lower bound)
and a smaller hero figure below 768px.

| Capture | CORP-P2 | CORP-P3 | **CORP-P3R1** | Target | Result |
|---|---:|---:|---:|---:|---|
| home 390 | 6152 | 7127 | **6425** | ≤ 6500 | **MET** |
| home 768 | 5006 | 5764 | **5184** | ≤ 5300 | **MET** |
| home 1440 | 5440 | 4372 | **4130** | ≤ 4500 | **MET** |
| mirai 1440 | 3057 | 2720 | **2720** | — | held |
| kakari 1440 | 2979 | 2778 | **2636** | — | improved |

Readability preserved: Japanese body leading **2.00** untouched; 0 clipped text; 0 horizontal
overflow. Stage truth intact on every surface — 「公開サイト稼働中／プラットフォーム機能は開発中」,
「開発中（一般公開前）」 and 「自律エージェントによる自動実行は有効化していません」 all still render.

## Re-run gates

30 route × viewport combinations (320/390/768/1280/1440 × 6 routes) on a local **production build**:

```
R1 GATES  navViolations=0  brandWrapped=0  duplicateBoundary=0
TOTALS    axe=0  serious=0  ext+api=0  consoleErr=0  overflow=0  tap<44=0
          clipped=0  heroOrphan=0  punctOnlyLine=0  よりそいSplit=0  prohibited=0
```

Keyboard **13/13** focusable stops with visible focus, sane order, no trap, menu Enter-operable.
Reduced motion: **0 animated elements, 0 layout jump** across all six routes.
Interaction flows 1–5 all complete. `tsc` 0 · `eslint` 0 · `build` 0.

**Lighthouse** (mobile emulation): home **100/100/100**, LCP 1.4 s · mirai-move **100/100/100**,
LCP 1.0 s · kakari **100/100/100**, LCP 0.8 s. CLS **0**, TBT **0 ms** on all three. SEO 60 is the
deliberate `noindex` (`is-crawlable`), advisory and not weakened.

## Artefacts

`test-results/corp-p3r1-screens/` — 13 files: the 9 required route captures, `mobile-menu-closed-390`,
`mobile-menu-open-390`, `desktop-nav-768`, `desktop-nav-1440`, plus `brand-check-768/1440`.
Trace `test-results/corp-p3r1-traces/mobile-nav.zip`. Lighthouse `test-results/corp-p3r1-lighthouse/`.
**CORP-P2 (9) and CORP-P3 (11) screenshots preserved untouched.**

## What this package changes about how I validate

The nav defect existed because a report asserted a visual outcome that no gate measured. Two things
changed permanently: every source edit asserts its own effect, and visual claims are now verified by
**computed style and layout geometry**, never by the presence of markup.

## Still open — unchanged by CORP-P3R1

`COMPANY_REGISTRATION_SOURCE_REQUIRED` · `VERIFIED_CORPORATE_CONTACT_REQUIRED` · consumer-route
disposition · **the live `/company` still publishes 代表取締役 and unverified values** · production has
no `robots.txt` and no `sitemap.xml` · site-wide metadata still names 診断. None blocks CORP-P3R1;
all block final publication.
