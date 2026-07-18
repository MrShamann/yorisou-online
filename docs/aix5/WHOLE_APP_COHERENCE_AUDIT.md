# AIX-5 — Whole-App Coherence Audit

Rendered-output audit of every launch-relevant public route against the AIX-5
value proposition and design system. Builds on the AIX-3D-2 launch manifest
(94 routes) and the AIX-4 visual unification (dark Product-Focus + tokens +
theme-aware components). Findings + corrections below; ✓ = already coherent
after AIX-4, ⟳ = corrected in AIX-5.

## Route → mode → loop-position → finding → correction

| Route | Mode | Loop position | Finding | Correction |
|---|---|---|---|---|
| `/` | Immersive | entry / whole loop | AIX-4 proposition ("今の状態から、次の選択まで") + no understanding→support model; SEO noun still "状態理解プラットフォーム" | ⟳ reframe to 「今のあなたを知り、これからを一緒に選ぶ」 + understanding→support model + SEO/OG |
| `/tests` | Immersive | Understand (entry) | catalogue; frames the check as one intent-entry | ✓ (copy reinforced) |
| `/check-in` | Focus | Understand (flow) | imairo 120Q dark flow | ✓ |
| `/tests/*` | Focus | Understand (flows) | dark Product-Focus, theme-aware, share wired | ✓ (AIX-4) |
| `/result` | Focus | Understand→Remember→Recommend | dark reveal + unified share | ✓ (AIX-4) |
| `/saved`, `/private-state` | Immersive | Remember/Return | dark continuity | ✓ |
| `/recommendations`, `/recommendations/graph` | Immersive | Recommend | dark, why-shown | ✓ |
| `/reports`, `/reports/*` | Immersive/Focus | Deepen | dark landing + reading | ✓ |
| `/experiences` | Immersive | Connect (prototype) | dark, private-by-default | ✓ |
| `/co-design` | Immersive | Improve (prototype) | dark | ✓ |
| `/partners` | Immersive | partner pathway (separate) | dark, no pay-to-rank | ✓ |
| `/line/mini-app` | LINE | continuity channel | light LINE context; theme-aware components render light | ✓ (AIX-4) |
| `/about` | Editorial | positioning | defensive "テストで終わるサービスではありません" + SEO "状態理解プラットフォーム" | ⟳ reframe to the accompaniment proposition |
| `/methodology` | Editorial | trust | editorial | ✓ |
| `/contact`,`/privacy`,`/terms`,`/legal`,`/company`,`/support` | Editorial | trust | AIX-3D-1 EditorialShell | ✓ |
| `/en`, `/en/*` | Editorial | English info | AIX-3D-1 Option B | ✓ |
| Share cards (`/api/share/card`) | Product | share destination | tagline used AIX-4 line; generic fallback said "YORISOU" | ⟳ tagline → frozen proposition; polished generic fallback; placeholder-prohibition test |
| `/admin/*`, `/dev/*`, `/api/*` | internal | — | not launch-public | ✓ (excluded) |

## Residual-legacy check (rendered output)

- **0 crane / raster logo** on launch-public routes (AIX-3D-2 + AIX-4).
- **0 launch-public page renders** `MvpSurface` / `MvpCard` / `OpenTestingNotice`
  / `frontstage-page` (grep of `page.tsx` consumers is empty; those components are
  dead or only on redirected routes).
- `AccountEntryForm` / `PasswordResetForm` (auth focus routes) retain some base
  utility classes but render inside the branded shell; auth is protected — not a
  positioning surface; left as-is (documented).
- The only `shell-card` hit on `/en/about` is inside a code comment, not markup.

## AIX-5 corrections applied

1. `/` homepage — frozen proposition + understanding→support model + SEO/OG.
2. `/about` — accompaniment proposition (positive, not defensive).
3. Share cards — proposition-aligned tagline + polished generic fallback + a
   production-placeholder prohibition (`test`/`demo`/empty chips return the
   generic YORISOU card).
4. `test:aix5` contract enforces value-proposition, route-positioning, share-content
   and journey-continuity.

No route remains visually or conceptually unclassified.
