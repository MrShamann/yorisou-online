# CORP-v1.2R1 — pre-merge readiness remediation

Continues CORP-v1.2. Branch `product/corporate-p5r2-global-site`, starting HEAD `02e8f76`.
Preview only. Not merged. Production, DNS, secrets and consumer data all untouched.

## Starting evidence

Branch, HEAD `02e8f766c3218968da94e65b23d6a0f722593008`, `origin/main` `b5521141`, PR #156
OPEN/DRAFT — all verified and matching. Working tree clean apart from the two protected untracked
files. Writer lock was `NONE`; acquired for this package.

---

## Blocker A — ARCH-P3 · **BLOCKED, guard unchanged**

`ARCH_P3_SCOPE_DECISION = BLOCKED`

### What the invariant is

`lib/server/__tests__/archP3DailyDiscovery.test.ts` assertion **L/M** requires the consumer **Today**
surface to compose in a fixed order: utility hero (`今の気配を見る`) → continuity
(`<TodaySavedState />`) → curiosity (`<TodayDiscoveryEntry />`) → 5-minute actions
(`5分でできること`). It reads that composition out of `app/page.tsx`.

### What the evidence shows

| Question | Answer |
|---|---|
| What represented Today when the test was written? | `app/page.tsx` — literally `export default function TodayPage()`, with all four markers in order (`git show 9f0e8ff^:app/page.tsx`) |
| Where does Today live now? | **Nowhere.** `5分でできること` appears in exactly one file in the repository — the test itself. `app/TodaySavedState.tsx` and `app/TodayDiscoveryEntry.tsx` still exist but are rendered by no page. `app/today/` contains only `check-in/` and `discovery/`; there is no `app/today/page.tsx`. |
| Did root ownership change legitimately? | Root changed at `9f0e8ff` ("feat(corporate): stage final-route transition candidate"), which replaced `app/page.tsx` (−174 lines) with the corporate homepage. That was a corporate package, before this one. |
| Was Today relocated? | **No.** The commit replaced the root; it did not move the composition anywhere. |
| Does the invariant still matter? | Yes. The other 20 assertions in the file still pass and still protect discovery core, the pack, fail-closed behaviour and the refused shapes. |

### Why the guard was NOT rebound

The package anticipated a *stale route binding* — an invariant pointing at the wrong file. That is
not what happened. **The surface the invariant protects was deleted, not moved.**

There is no current file containing the Today composition, so any rebinding would point the
assertion at something that does not contain what it checks. That is precisely the vacuous gate
§13 forbids: a test that stops reading `app/page.tsx` but no longer protects Today. The guard was
therefore left exactly as it is, and the CI failure is preserved.

**The failing test is correct.** It is reporting a real, current gap in the consumer product: the
Today landing surface is gone. Fixing it is a consumer product decision — restore Today at some
route, or consciously retire it and retire the assertion with a recorded rationale. Neither is a
corporate-website decision, and neither is authorized here.

---

## Blocker B — repository authority · **DONE**

`PROJECT_START_HERE.md` opened with "Single authoritative entrypoint" and defined YORISOU solely as
the consumer companionship product. With a corporate surface in the same repository that is
inaccurate at the repository level.

It is now a repository entrypoint that routes into **Surface A (Corporate / Yorisou Foundry —
Preview only)** and **Surface B (Legacy consumer YORISOU — live, protected)**, stating explicitly
that neither surface may mutate the other's protected domain, that corporate work must pass consumer
non-regression, and that runtime/repo evidence controls implementation truth. All existing consumer
documentation links and prohibitions are preserved verbatim; the consumer governance corpus was not
rewritten. The open Today gap is recorded there too, so the next reader meets it immediately.

**`PROJECT_MANIFEST.yaml` was deliberately NOT changed.** Its schema
(`agent-os/schemas/PROJECT_MANIFEST_SCHEMA.md`) has a fixed key set — `project_id`, `display_name`,
`lifecycle_state`, `deployment_targets` and so on — with **no field for multiple surfaces**.
Inventing one would make the machine record schema-invalid in order to make prose look tidier, which
§3.2 forbids. The dual-surface model lives in the entrypoint and the ADR.

---

## Blocker C — performance · **TARGET MET**

### Profile first (production build, mobile viewport)

| | Japanese Home | Arabic Home |
|---|---|---|
| Font files | **35–36** | 4 |
| Font bytes | **~729 KB** | ~115 KB |
| TTFB | 16–24 ms | 22 ms |
| External hosts | none | none |

The Arabic page scored 87 while Japanese scored 61 **on the same server**, which localised the
problem precisely: not the server, not JS, not third parties — the Japanese font payload.

### First hypothesis, tested and rejected

`preload: false` on Noto Sans JP. Result: **36 files / 729 KB, performance 60** — no change. The
subsets are fetched because the page's characters span dozens of kanji unicode ranges, not because
of preload hints. The change was **reverted** rather than kept as a plausible-looking no-op.

### The fix

The corporate root font stack now uses the **system Japanese stack** — Hiragino Sans, Yu Gothic,
Noto Sans CJK — with Inter retained for Latin display text. **Scoped to
`app/_corporate/p5r2/site.module.css` only**; `globals.css` still resolves `--font-noto-jp`, so the
live consumer product's typography is byte-for-byte unchanged.

### Result

| Target | Before | After |
|---|---|---|
| Japanese Home | 61 | **91** |
| Arabic Home | 87 | **91** |
| Japanese Company | 62 | **93** |
| LCP (ja Home) | 7.7 s | **3.3 s** |
| Font files / bytes | 36 / 729 KB | **2 / 73 KB** |
| Accessibility | 100 | **100** |
| Best practices | 100 | **100** |
| CLS | 0 | **0** |

Verified after the change: axe 0 violations across 56 page/locale combinations, 0 responsive issues
across 210 combinations, and the rendered Japanese typography inspected by screenshot — the
editorial hierarchy is intact.

---

## Blocker D — dependency security · **MOSTLY RESOLVED**

| | Before | After |
|---|---|---|
| All findings | 11 (9 high, 2 low) | **7 (5 high, 2 low)** |
| **Production-only** | **5 high** | **1 high** |

Fix applied: `next` **16.2.10 → 16.3.3**, `isSemVerMajor: false` — a bounded minor upgrade. It
resolves `next`, and transitively `postcss` and `sharp`.

It belongs in this package specifically: the Next advisory is **"Middleware / Proxy bypass in App
Router applications using Turbopack and single locale"**, and this PR's entire locale mechanism runs
in `proxy.ts` middleware under Turbopack. Leaving it would have shipped a corporate surface whose
locale resolution had a known bypass.

No `npm audit fix --force`, no major upgrades. Verified after: tsc clean, 12/12 corporate guards,
ARCH-P3 unchanged at 20/1, build passes, 189/189 routes 200, 21/21 lang/dir (the middleware path
itself), consumer regression 9/9, 404 intact.

**Unresolved: 1 production high — `js-yaml`** (quadratic CPU consumption in `!!omap` resolution).
It is transitive and its fix requires a dependency-tree change outside this package's bounds. **This
package is not "security clean".**

---

## Blocker E — lint truth · **CLASSIFIED, nothing to fix**

`npx eslint app lib tests scripts` → **13 problems: 0 errors, 13 warnings** across 11 files.

**0 of them are corporate-owned.** PR #156 introduces zero errors and zero warnings. The 11 files are
pre-existing consumer/product/scripts code (`app/components/*`, `app/prototype/home`, `lib/result`,
`lib/server/accountIdentityDeletion`, `lib/yorisou/recommendations`, `scripts/por1/*`) — the same
debt `yorisou-check.yml` already documents in the comment above its report-only lint step.

Per §6, unrelated consumer refactoring was not undertaken to reach zero. Correct wording is
**"0 lint errors; 13 pre-existing warnings, none introduced by this PR"** — not "eslint clean".

A local full-repo run reports ~201k problems; that is an artifact of a stray untracked
`tmp/yorisou-amd2/.next/` build directory being linted. `tmp/` is gitignored, so CI never sees it.

---

## Blocker F — locale publication posture · **DONE**

The registry's existing `status` field gained one member rather than a parallel vocabulary:

- `published` — available in Preview **and** cleared for Production. **ja, en.**
- `preview_only` — available in Preview, **not** cleared for Production. **The other 19.**
- `registered` — known, not built.

`PUBLISHED` (Preview availability) is now `status !== "registered"`, so **all 21 remain available in
Preview** and no translation was deleted. New `PRODUCTION_READY` / `isProductionReady()` express the
Production gate, and Production routing must consult those rather than "did it render".

A new guard (`localeCompleteness.test.ts`) asserts the Production-ready set is exactly `["en","ja"]`,
that every Production-ready locale is `SOURCE_CANONICAL` or `HUMAN_REVIEWED`, that all 21 stay
available in Preview, and that every `AI_TRANSLATED` locale is marked `preview_only`. A future change
cannot quietly promote an unreviewed locale by flipping one word.

---

## Unchanged by this package

Contact remains blocked (`BLOCKED_BY_RESEND_ACCESS`, `BLOCKED_BY_DNS_ACCESS`) — no Resend, DNS, SMTP,
secrets or Production env touched. Chigamo copy unchanged and still concept-stage. Asterion ownership
model unchanged: independent, not owned, no "powered by", no executed-licence claim. The v1.2 IA,
visual language, venture inventory and multilingual architecture were not reopened.

## Remaining blockers

1. **ARCH-P3 / Today** — consumer product decision. CI stays red until it is made.
2. **`js-yaml`** production high — needs a dependency-tree change.
3. Founder acceptance · `main` protection and public-repo/licence posture · Production routing and
   domain · which corporate routes become indexable · contact delivery · native review of the 19
   `preview_only` locales · Chigamo and Asterion-licence evidence.
