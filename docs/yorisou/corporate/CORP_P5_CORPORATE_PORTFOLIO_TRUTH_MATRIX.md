# CORP-P5 — Corporate portfolio truth matrix

**Purpose:** decide which projects may appear on YORISOU LLC's public corporate site, on evidence.
**Sources read:** AI-Workspace `PROJECT_REGISTRY.yaml`; each project's `PROJECT_MANIFEST.yaml`,
`PROJECT_START_HERE.md` / `AGENT_PROJECT_RULES.md`; and the existing corporate content source
`app/prototype/corporate/_content/site.ts`, which already carries a `source` note per claim.

## The finding that governs everything below

**No project manifest in this workspace names YORISOU LLC as owner or operator.** Every one records
`github_owner: MrShamann` (a personal account) and `sensitivity_class: internal`. There is no
machine-readable corporate ownership record anywhere I can read.

The site therefore **does not assert corporate ownership of anything**. It presents the two projects
whose public positioning and stage are already evidenced, in the same voice the accepted content
source uses ("Yorisouは…プロダクトをつくる会社です"). Turning that into an explicit legal
"YORISOU LLC operates X" statement requires the same authoritative source that
`COMPANY_REGISTRATION_SOURCE_REQUIRED` is already blocking on.

## Matrix

| Project | 1. YORISOU LLC owner/operator? | 2. Public naming OK? | 3. Truthful positioning | 4. Truthful stage | 5. Public destination? | 6. Externally supportable claims | Verdict |
|---|---|---|---|---|---|---|---|
| **Mirai Move** | **Not evidenced** — manifest says `github_owner: MrShamann` | Yes — already public | 日本のモビリティ領域における、情報・マッチング・事業開発のためのプラットフォーム | `公開サイト稼働中／プラットフォーム機能は開発中` (manifest `lifecycle_state: PAUSED`; registry ACTIVE — **the two disagree**) | **Yes** — live at `https://www.miraimove.com` | Site is live; platform features are in development; no autonomous agent is activated | **INCLUDE** |
| **Kakari** | **Not evidenced** — same | Yes, with stage stated | 日本で暮らす人・事業を始める人のための、多言語の行政手続き・書類サポート | `開発中（一般公開前）` | **No** — private remote, external providers disabled, not generally available | Development stage; the 士業 boundary (verbatim, required wording) | **INCLUDE** |
| **Norynto** | **Not evidenced** | **No** | — | `FOUNDATION_ACTIVE_LOCAL_ONLY` | **No** — `github_owner: null`, no remote, local development only | None | **EXCLUDE** |
| **Asterion OS** | **Not evidenced** | **No** | — | `implementation_status: PARTIALLY_IMPLEMENTED_UNVERIFIED`, `production_status: NOT_DEPLOYED`, `commercial_status: NOT_VALIDATED` | **No** | None | **EXCLUDE** |
| **Yorisou consumer product** | n/a — this repository | Historical context only | Not the corporate identity | Live on Production today | `https://yorisou.online` (current Production) | — | **NOT a portfolio entry** |

## Exclusions, stated plainly

- **Norynto** — its own manifest says `workspace_symlink: null # not yet registered — founder-gated
  onboarding step`, `github_owner: null # no remote created; local development only`. Publishing it
  would announce something that has no public existence.
- **Asterion OS** — not deployed, not commercially validated, implementation unverified. It also
  appears to be internal operating infrastructure rather than a customer-facing product; that
  reading is **inference, not evidence**, and is flagged as such.

Both are **architecturally easy to add later**: the portfolio is data-driven from one content source
plus a per-project visual grammar. Adding a project is a content change, not a rebuild.

## Ambiguities reported, not resolved

1. **No corporate ownership record exists** for any project. Needed before the site can say YORISOU
   LLC operates them.
2. **Mirai Move status conflict** — manifest `lifecycle_state: PAUSED` vs registry `ACTIVE`. The site
   uses the sourced *product* stage string, which is unaffected, but the governance records disagree.
3. **Norynto and Asterion** — whether they are YORISOU LLC projects at all is unknown to me.

## Forbidden and not present

No customers, partner logos, metrics, revenue, endorsements, deployments, offices, team members,
awards, or fabricated project maturity appear anywhere on the corporate Preview.
