# START HERE — YORISOU（ヨリソウ）

**Single authoritative entrypoint** (Package 20, 2026-07-15 · verified at `main` @ `334a80570b48`). Read this before planning or editing anything.

**YORISOU is a Japanese-language, mobile-first emotional-companionship product.** A personality test is the entrypoint where people first feel understood; **LINE** is where the relationship continues. YORISOU is gentle interpretation and ongoing companionship — it is **never** medical, diagnostic, or treatment-oriented, and its public product language is **Japanese**.

## Current state in one line

**Live in production**: verified production commit `334a8057` (= `main`) on Vercel at **https://yorisou.online**, auto-deploying `main` (merge gates = release gates) · active runtime = the verified **120-question** set · project PAUSED, no active writer · YRR-1 accessibility item founder-deferred, non-blocking, **not fixed**.

## Read next (canonical order)

| File | Answers |
|---|---|
| [docs/project-context/PRODUCT_VISION.md](docs/project-context/PRODUCT_VISION.md) | what & why |
| [docs/project-context/USER_AND_PROBLEM.md](docs/project-context/USER_AND_PROBLEM.md) | who & what problem |
| [docs/project-context/PRODUCT_POSITIONING.md](docs/project-context/PRODUCT_POSITIONING.md) | vs. alternatives; boundaries |
| [docs/project-context/AI_NATIVE_UX_PRINCIPLES.md](docs/project-context/AI_NATIVE_UX_PRINCIPLES.md) | permanent AI-native rules |
| [docs/project-context/UI_UX_CREATIVE_DIRECTION.md](docs/project-context/UI_UX_CREATIVE_DIRECTION.md) | permanent UX direction |
| [docs/project-context/CURRENT_PRODUCT_STATE.md](docs/project-context/CURRENT_PRODUCT_STATE.md) | what exists & production truth |
| [docs/project-context/CURRENT_PRIORITY.md](docs/project-context/CURRENT_PRIORITY.md) | what's being worked on |
| [docs/project-context/CURRENT_HANDOFF.md](docs/project-context/CURRENT_HANDOFF.md) | exact repo state; safe-to-switch |
| [docs/project-context/TOOL_STARTUP_PROTOCOL.md](docs/project-context/TOOL_STARTUP_PROTOCOL.md) | mandatory session preamble |

## Authoritative sources (context summarizes, never replaces)

- **Implementation truth:** this repository + live Git state. The question bank/scoring runtime is `data/yorisou/120q-*.generated.json` (contract-tested — never casually changed).
- **Operations corpus:** `docs/` — versioned pilot/consent/report-operations documents (deep but historical-leaning; check version headers).
- **Lifecycle truth:** AI-Workspace registries, RELEASE_REGISTRY, locks, and Vault (`vaults/projects/yorisou-online/`).
- **Execution rules:** [AGENT_PROJECT_RULES.md](AGENT_PROJECT_RULES.md) + [PROJECT_MANIFEST.yaml](PROJECT_MANIFEST.yaml).

**Never** change the result taxonomy, scoring, or question set casually. **Never** send LINE messages automatically without explicit product authorization. **Never** use medical or diagnostic framing. Plans are not implementation evidence.
