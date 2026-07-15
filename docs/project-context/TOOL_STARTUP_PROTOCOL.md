# YORISOU — Tool Startup Protocol (Claude Code · Codex · any agent)

*(Package 20, 2026-07-15 · tool-neutral; one product truth for every tool)*

## Standard preamble

Before planning or editing, read:

- PROJECT_START_HERE.md
- docs/project-context/PRODUCT_VISION.md
- docs/project-context/USER_AND_PROBLEM.md
- docs/project-context/PRODUCT_POSITIONING.md
- docs/project-context/AI_NATIVE_UX_PRINCIPLES.md
- docs/project-context/UI_UX_CREATIVE_DIRECTION.md
- docs/project-context/CURRENT_PRODUCT_STATE.md
- docs/project-context/CURRENT_PRIORITY.md
- docs/project-context/CURRENT_HANDOFF.md

Treat these as the canonical product context.
Do not infer product direction from the existing UI alone.
Verify Git branch, HEAD, status, writer lock and package authorization before writing.

## YORISOU-specific startup requirements

1. **Governance first:** `AGENT_PROJECT_RULES.md` + `PROJECT_MANIFEST.yaml`; workspace lock at `agent-os/locks/yorisou-online.lock.yaml`. If `active_writer` is not NONE and not you — do not write.
2. **`main` auto-deploys production** (https://yorisou.online). Never push to `main` outside an authorized package; merge gates are release gates.
3. **The question bank, scoring master, and result taxonomy are contract-tested product identity** (`data/yorisou/120q-*.generated.json`) — no changes without an explicit founder package. The 990-question bank (founder-reported, content-complete) is NOT active; do not activate, reference as live, or migrate it.
4. **LINE boundary:** no automatic sending, no new LINE integration behavior, without explicit product authorization.
5. **Language and tone:** public product copy is Japanese, in YORISOU's gentle voice; brand tokens, persona assets, and typography choices are preserved (vault non-negotiable).
6. Claude Code is the primary tool; Codex is fallback.

## Prohibited assumptions

- That YORISOU is a medical, diagnostic, or wellness-clinical product (never frame it so).
- That engagement mechanics (streaks, pressure, scarcity) are acceptable growth levers (they are rejected by direction).
- That the 990-question bank is active, or that question/scoring changes are routine content edits (they are identity changes).
- That YRR-1 is fixed (it is founder-deferred and open).
- That a plan, prompt, or vault note counts as implementation evidence (it does not).
