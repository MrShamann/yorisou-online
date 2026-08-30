# ADR — branch-scoped dual-surface repository model (CORP-v1.2)

**Status:** Accepted for this website Preview package only. Not a Production authorization.
**Date:** 2026-08-30 · **Branch:** `product/corporate-p5r2-global-site` · **PR:** #156

## Context

`yorisou-online` was built as a single-product repository. `PROJECT_START_HERE.md` still opens by
declaring itself the *single authoritative entrypoint* and describes YORISOU as "a Japanese-language,
mobile-first emotional-companionship product" whose entry point is a personality test and whose home
is LINE. `PROJECT_MANIFEST.yaml` records one `project_id`, one primary tool, lifecycle `PAUSED`.

That description is accurate about the live consumer product at `https://yorisou.online`, including
the 120-question いま色テスト. It is no longer a complete description of what this repository holds.

Since CORP-P5 the same repository has also carried a **corporate** surface for YORISOU LLC, and
CORP-v1.2 extends that surface into a Foundry model with ventures, an engagement layer, and a
shared-infrastructure narrative. Building corporate copy on top of a stated assumption that this
repository is a single consumer product means writing the site on a premise the repository itself
contradicts.

## The conflict, stated plainly

1. The entrypoint doc says one authoritative product. The repository contains two surfaces.
2. The corporate surface has different owners, a different audience, a different release cadence and
   a different risk profile from the consumer runtime.
3. The consumer product is live and protected; the corporate surface is Preview-only.
4. Route space is shared. `/en` is a legacy consumer route, and `/`, `/about`, `/mirai-move`,
   `/kakari` are corporate. A change on one side can silently break the other.

## Options considered

**A. Leave the contradiction unstated.** Cheapest. Rejected: it invites the next agent or engineer to
treat corporate routes as consumer routes, or to "clean up" one surface while editing the other. The
120Q runtime is too important to leave that trap in place.

**B. Split the corporate site into its own repository now.** Cleanest end state, and probably right
eventually. Rejected *for this package*: it is a large migration that would need its own deployment,
domain and CI decisions, none of which are authorized here, and it would strand PR #156.

**C. Rewrite `PROJECT_START_HERE.md` and the manifest to describe a multi-surface repository.**
Rejected: those are governance records for the whole project, changing them is a Production-scope
governance act, and this package is Preview-scoped. Editing them from a website branch would be the
tail wagging the dog.

**D. Branch-scoped dual-surface model, documented here.** Chosen.

## Decision

For the corporate website surface only, this repository is treated as carrying **two distinct
surfaces** that coexist temporarily:

- **Consumer YORISOU** — a protected product and runtime domain. Live. Unchanged by this package.
- **Corporate YORISOU / Yorisou Foundry** — a distinct public surface. Preview only.

This decision is recorded rather than enacted through governance-record edits: no change is made to
`PROJECT_START_HERE.md` or `PROJECT_MANIFEST.yaml` in this package.

## Boundaries

**Consumer boundaries — untouched by this package.** The 120Q question runtime, scoring, taxonomy and
result methodology; consumer auth, accounts and history; LINE behaviour; the consumer data model;
consent and privacy history. If a corporate change ever requires a consumer behaviour change, that is
a stop-and-report condition, not a judgement call.

**Corporate boundaries.** The corporate surface owns `/`, `/ventures`, `/mirai-move`, `/kakari`,
`/chigamo`, `/about`, `/build-with-us`, `/company`, `/contact`, plus `/api/corporate-contact`, the
`app/_corporate/**` tree and its tests. It may not read or write consumer data, and it introduces no
consumer-visible behaviour.

**Shared and therefore delicate.** `app/layout.tsx`, `proxy.ts`, `app/robots.ts`. These are the only
files both surfaces depend on. Changes here must be regression-tested on both sides in the same
change — which is why this package tests legacy `/en` and the Japanese consumer routes explicitly.

## Route, data and release ownership

- **Routes:** listed per surface in `CORP_V12_ROUTE_AND_SURFACE_MATRIX.md`.
- **Data:** the corporate surface holds no user data. The contact route holds no destination address
  in client code and no secret in the repository.
- **Release:** the consumer surface releases through `main` to Production. The corporate surface
  releases to Vercel Preview only, from a branch, behind deployment protection. There is no path in
  this package by which corporate work reaches Production.

## What this ADR does NOT settle

- It does not authorize a general Foundry control plane in this repository.
- It does not settle long-term repository architecture for future Foundry software.
- It does not authorize Production deployment, DNS change, or merge of PR #156.
- It does not change the repository's public/licence posture, which remains an open Production
  governance item: the repository is public and carries no explicit licence metadata.

## Trigger for reconsidering a separate repository

Revisit — and expect to split — when any of these becomes true:

1. A venture spins out and needs its own deployment and access control.
2. Corporate and consumer release cadences begin blocking one another.
3. The corporate surface needs a Production domain distinct from `yorisou.online`.
4. Non-public venture material would otherwise have to live in a public repository.
5. Contributors need corporate access without consumer-runtime access.

## Rollback

The corporate surface is additive and confined to `app/_corporate/**` plus its own routes, with three
shared files touched. Reverting the branch removes it entirely; the consumer product is unaffected
because no consumer file's behaviour was changed. There is no data migration to unwind.
