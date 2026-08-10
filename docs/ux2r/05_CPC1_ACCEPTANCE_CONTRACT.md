# CPC-1 · 05 — Acceptance Contract

> **FROZEN.** The package is a Founder Acceptance Candidate only when every line below passes
> against the **real isolated Preview** environment — not mocks, not local-only.

## Principal journey

```
anonymous entry → start → answer partially → refresh → resume → complete
→ persisted result → refresh → select correction → login → claim
→ correction persists → refresh → private-state → eligible recommendations
→ recommendation feedback → sign out → sign in → all state restored
→ erase → result and downstream state unavailable
```

Repeat critical paths for: **registration** instead of login; **confirm**; **reject**; **defer**;
**LINE** entry and result.

## Security denial matrix

wrong token · expired token · stolen result UUID · cross-owner read · cross-owner claim ·
cross-owner response · replay · open redirect · conflicting legacy parameters · erased result —
**all denied, and unauthorized is indistinguishable from non-existent.**

## Authority matrix

invalid / unauthorized / expired / erased stable UUID **never** falls back to legacy ·
legacy `resultId` cannot override · legacy overlay cannot fill a persisted null ·
legacy confidence cannot change persisted limits · legacy payload cannot change persisted content.

## Quality gates

typecheck · lint · production build · unit + integration · **real Preview E2E** ·
Preview-only migrations with rollback/cleanup evidence · no secrets · **no Production table or
migration change** · mobile + desktop smoke · LINE-oriented flow · keyboard · reduced motion ·
**zero serious/critical axe** · Japanese copy review · PR body matching repository truth.

Accessibility results are reported as measurements, never as certification.

## Explicit non-scope

new methods · 990-bank activation · methodology/scoring/taxonomy/governed-copy change · Companion ·
community · Life Archive · Digital Legacy · supplier portal · payment/preorder · new identity
providers · autonomous runtime · Production deployment/migration · merge.
