<!-- BEGIN AI-ENGINEERING-WORKSPACE GOVERNANCE V1 -->
# AGENTS.md — YORISOU / yorisou-online (Codex adapter)

**Project:** `yorisou-online` — verify against `PROJECT_MANIFEST.yaml` before any work; mismatch = stop.

This file is a **thin adapter**. The project's rules live in ONE place:

1. **Read `AGENT_PROJECT_RULES.md`** (this repo) — canonical execution rules; its project-specific rules take precedence over any generic task prompt.
2. **Read `PROJECT_MANIFEST.yaml`** (this repo) — machine identity; registry wins on conflict.
3. **Resolve AI-Workspace** per `agent-os/protocols/AI_WORKSPACE_ROOT_RESOLUTION.md`: `$AI_WORKSPACE_ROOT` (validated) → `/Users/yangjin/AI-Workspace` → manifest metadata → stop and ask. Never fall back to Documents paths or duplicates.
4. **Before any write**, from the resolved workspace: check `agent-os/registries/PROJECT_REGISTRY.yaml`, the lock `agent-os/locks/yorisou-online.lock.yaml`, and `vaults/projects/yorisou-online/00_Control/CURRENT_HANDOFF.md`. **If `active_writer` is not `NONE` and not this session — do not write.** Concurrent writers are forbidden.
5. **Verify repository truth** first: `git rev-parse --show-toplevel && git branch --show-current && git rev-parse HEAD && git status --short` — reconcile against registry + handoff; mismatch = stop and report.
6. **Planning is not completion.** Plans, prompts, and vault notes are never implementation evidence (`agent-os/schemas/COMPLETION_TRUTH_MODEL.md`).
7. **Close out truthfully** before ending or switching tools: handoff record, registry snapshot, lock release (`agent-os/protocols/CROSS_TOOL_HANDOFF_PROTOCOL.md`).

Codex-specific notes: Codex worktrees are extensions of the canonical repository and inherit its lock — a worktree write is a project write; never operate from stale duplicate paths or dead worktree registrations; work only under the exact trusted canonical path `/Users/yangjin/Projects/yorisou-online`. Adapter spec: `agent-os/adapters/codex/CODEX_ADAPTER_SPEC.md`.
<!-- END AI-ENGINEERING-WORKSPACE GOVERNANCE V1 -->
