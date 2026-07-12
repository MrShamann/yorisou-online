# YORISOU Single-Mainline Baseline — 2026-07-12 (Phase 3A)

`YORISOU_SINGLE_SOURCE_OF_TRUTH_RECONCILIATION` completion record.

## Canonical truth

| Item | Value |
|---|---|
| Canonical repository | `MrShamann/yorisou-online` (only YORISOU repo under the account) |
| Default branch | `main` (no branch protection configured as of this date) |
| Canonical local clone | `/Users/yangjin/dev/yorisou-online-claude` |
| HEAD at reconciliation | `6136922` — governance: v0.3.3 Evidence Amendment (#102), == `origin/main` |
| Governance version | YORISOU v0.3.3 Final Complete Replacement (39 files; priority: Implementation Baseline → Evidence Amendments → v0.3.x body) |
| Runtime attribution | YORISOU Agent Runtime + YORISOU Provider Harness (CURRENT_REQUIRED); Vercel Web runtime; Supabase/PostgreSQL; AWS S3 artifact/shared storage |
| Superseded runtimes | OpenClaw task runtime (SUPERSEDED_BY_YORISOU_RUNTIME); OpenClaw Voice bridge (CURRENT_OPTIONAL / HEALTH_UNVERIFIED); Hermes separate runtime (UNCONFIRMED / NOT_REQUIRED) |

## Retained current product assets (verified on main @ 6136922)

- **Tests/questions**: shared deterministic test engine (`lib/yorisou-tests`, PR #91; `test:c02` 24 assertions pass); public test routes `/tests/{love-distance,name-impression,r01,r04,relationship-fatigue,s01,work-rhythm}`.
- **Scoring/results**: private deterministic result flow (PR #90); result routes `/result`, `/result/share`, `/line/result`, `/line/mini-app/result` (+ `/en` variants); persona/result identifiers remain as implementation compatibility assets (not governance doctrine; fixed-31-persona assumption is not a governance fact — future methodology migration target).
- **LINE/auth**: LINE OAuth (`/api/line/auth/{start,callback}`, one-time state fix PR #92, account binding fix PR #93), LINE webhook, mini-app; email auth (`/api/auth/*` register/login/reset).
- **Agent Runtime**: governance checksum loader + durable task queue (PR #89, `lib/server/agent-runtime/`; `test:agent-runtime` passes — 31 governance files validated), attempts/leases/retry per phase1 migration `202607100001_agent_runtime_phase1.sql`.
- **Provider Harness**: private AI reflection foundation (PRs #94–#98), provider resolver/fallback (`test:private-ai-providers` passes), scoped shared provider routes (#98).
- **Experience/Recommendation Graph**: controlled sharing & discovery (#99), governed recommendation graph (#100, #101); `test:experience-cards`, `test:recommendation-graph` pass.
- **Routes**: 100 app pages, 49 API routes at baseline (`next build` succeeds).
- **CI**: `Yorisou Check` workflow (active).

## Reconciliation actions performed

1. Local clone `~/dev/yorisou-online-open-testing` (25 local branches; 22 = local leftovers of squash-merged PRs #68–#87) — full-history bundle verified, then archived to `~/dev/_preservation-20260712-phase3a/archived-clones/`.
2. Documents worktree family (`New project/yorisou-online-sequencing-clean` + 2 linked worktrees + 1 clean clone) — dirty patch + untracked tar preserved with checksums; marked `_ARCHIVED_YORISOU_ASSET.md` in place. Physical relocation out of iCloud deferred (7,282 dataless files; move unsafe until iCloud sync healthy).
3. All legacy branch tips verified recoverable from merged GitHub PRs (#53/#54/#55/#61/#88) — no irreplaceable git content outside the mainline.
4. Stale canonical local branch `claude/governance-v0.3.3` deleted (patch-equivalent to main via PR #102).
5. Stale worktree metadata pruned (3 defunct `/private/tmp` worktrees).
6. `~/Documents/YORISOU_CANONICAL_PATH.txt` corrected to point to the canonical clone.
7. No unique valuable code assets required migration into main — no code-migration PR created.

## Legacy disposition summary

- Archived (not deleted): open-testing clone; Documents worktree family; existing 20260701/20260702 archives & quarantine; `Yorisou_Project_Hub`, `Yorisou_Product_Working_Files` (content asset library, not product truth).
- Deleted (verified duplicates only): local branch `claude/governance-v0.3.3`; stale worktree metadata.
- Dirty-change classification: pr87-era frontstage polish, concept-c SVGs, Blueprint v1 doc, dte-launch dev telemetry → `ARCHIVE_FOR_HISTORY` (superseded by merged #88–#102 mainline work; recoverable from preservation).
- GitHub: 21 branches remain (main + 4 merged-superseded codex/* + 16 old-generation forks Apr–Jun) — classified `STALE_SUPERSEDED`, deletion deferred pending founder approval. 0 open PRs, 0 tags, 0 releases, no duplicate repositories.

## Remaining unknowns (non-blocking)

- Loose Next.js build artifacts at iCloud CloudDocs root — generated files, ownership unconfirmed, untouched.
- OpenClaw local repository — `MIXED_ASSET_REQUIRES_SPLIT`, untouched (separate future effort).
- Deferred: physical relocation of Documents archives out of iCloud; GitHub stale-branch deletion (needs approval).

## Next product execution starting point

All future YORISOU build work starts from `main` of `MrShamann/yorisou-online` in `/Users/yangjin/dev/yorisou-online-claude`. Evidence root: `~/dev/_preservation-20260712-phase3a/` (MANIFEST.md, SHA256SUMS.txt).
