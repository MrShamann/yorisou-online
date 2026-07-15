# YORISOU — Current Handoff

*(Package 20, 2026-07-15 · snapshot; the live handoff authority is `vaults/projects/yorisou-online/00_Control/CURRENT_HANDOFF.md` in AI-Workspace — check it first, it may be newer than this file)*

| Field | Value |
|---|---|
| Branch | `main` |
| HEAD | `334a80570b488ae6f749e1c2cdd65ce52aad89fc` (+ the Package 20 docs commit on top — verify live with `git rev-parse HEAD`) |
| Working tree | clean expected |
| Remote | `origin = https://github.com/MrShamann/yorisou-online.git`; local `main` = `origin/main` expected |
| Production | https://yorisou.online — **auto-deploys every push to `main`** (treat any push as a release act) |
| Safe-to-switch | **PAUSED_SAFE** — no active writer, no open package, no pending migration/deployment |
| Current execution tool | NONE |
| Next action | founder decision (see CURRENT_PRIORITY.md) |

Session rule: verify live Git state against this snapshot **and** the vault handoff; on mismatch, stop and report. Because `main` auto-deploys, **no push happens outside an authorized package.**
