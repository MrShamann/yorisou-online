# CORP-v1.3.1 — Production release record

**`yorisou.online` is the YORISOU / Yorisou Foundry corporate website.** Released 2026-09-01.

## What was deployed

| | |
|---|---|
| PR | #156, merged (not squashed — the repo's convention is merge commits) |
| Merge commit | `279cacdb366a1bf0199ba6aebca09a9fb8d5cdaf` |
| Branch head merged | `cf83448392bf6ac5b418730977df14ad036778d0` |
| `main` after merge | `279cacdb366a1bf0199ba6aebca09a9fb8d5cdaf` |
| Production deployment | `dpl_AMJE3PzsU8haAiU7NrQzydRt76E4` |
| Deployment source SHA | `279cacdb366a1bf0199ba6aebca09a9fb8d5cdaf` — **equals `main`** |
| Aliases | `https://yorisou.online`, `https://www.yorisou.online` |
| Path | merge → `main` → the project's own automatic Production deployment |

**No manual promotion.** The deployment Vercel built from `main` is the one serving the apex; no
second deployment was created, and no artifact was promoted whose source did not match `main`.

## DNS — not touched

`DNS_TOUCHED = NO`, and this was **proved before deploying, not assumed**:

- `yorisou.online` already resolved to `76.76.21.21`, Vercel's apex address.
- `www.yorisou.online` already resolved through `cname.vercel-dns.com`.
- The apex was already an alias of this project's Production deployment.

Replacing the Production build was therefore sufficient. No record was created, changed or deleted.

## Rollback target — recorded before release

| | |
|---|---|
| Previous Production deployment | `dpl_J7U54Pg9rgSqC8FNmi2T6ajVp2PH` |
| Its source | `main @ b5521141b6b0863ce2e3451278cc8756f1e6c27d` |
| Created | 2026-08-22 |

If a P0/P1 regression appears, promote that deployment back through Vercel's existing rollback
mechanism. **Do not revert database state** — this release performed no migration and no consumer
data mutation, so there is nothing in the database to undo.

## Post-deployment acceptance — measured against the live apex

Run with `node tests/corporate-qa/production-smoke.mjs`. Every request is a GET: no form is
submitted, no mutation endpoint is called, no external message is sent.

**ALL LIVE CHECKS PASS.**

| Group | Result |
|---|---|
| Corporate routes | **9 / 9** — 200, `lang="ja"`, corporate shell, correct title |
| Consumer routes | **13 / 13** — 200, and the corporate shell leaks into none of them |
| Today invariant | hero before 5-minute actions, consumer tab bar present |
| Brand assets | **6 / 6** served — favicon.ico, icon, apple-icon, OG, logo, Mirai Move mark |
| Branding in the page | favicon link · apple-touch · og:image · theme-color · header logo · **no purple heart** · 係 co-mark · Mirai Move logo · 現在公開している事業 · strapline |
| Locale | `/` → ja · `/?lang=en` → en |
| Contact safety | the form is **not** rendered; no delivery is claimed |
| 404 | 404, exactly one header, current identity |

### Performance — Production CDN

3-run medians against `https://yorisou.online`:

**perf 88 · a11y 100 · best-practices 100 · SEO 100 · LCP 2.78s · CLS 0.000 · TBT 267ms**

LCP is **0.7s better than local** (2.78s vs 3.49s), which is the CDN doing its job. Performance sits
where it did in v1.3 — no regression from this release.

> **A measurement that was wrong, recorded rather than dropped.** The first two local runs reported
> 69 and then 56. Both were taken while several of this session's own `eslint` processes were
> saturating the machine — load average above 15. Re-measured on a quiet machine, the local median is
> **89**, identical to v1.3. A number that contradicts every previous measurement is a reason to check
> the instrument, not to report a regression.

## Untouched

`PR #127` · consumer data · 120Q, scoring, taxonomy and packs (no file under them is in this diff) ·
LINE contracts · Asterion licensing · DNS · any database.
