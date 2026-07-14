# AGENT_PROJECT_RULES — YORISOU / yorisou-online

<!-- Instantiated from AI-Workspace/templates/project/AGENT_PROJECT_RULES_TEMPLATE.md (v1, Package 5).
     Tool-neutral. THE canonical in-repo execution rules; both tool adapters point here. -->

## 1. PROJECT IDENTITY

- `project_id`: `yorisou-online` (immutable; must match `PROJECT_MANIFEST.yaml` and the workspace registry)
- Display name: YORISOU / yorisou-online
- What this product is: a Japan-market emotional companionship and personality-insight product (Next.js web app with LINE integration and Supabase backend), operated by Yorisou LLC.
- What this product is NOT: a medical or therapeutic service; it must never be positioned as diagnosis or treatment. It is not Mirai Move and not Kakari.

## 2. SOURCE-OF-TRUTH HIERARCHY

On any conflict, higher wins (per `agent-os/governance/GOVERNANCE_INDEX.md`):
founder decision → project non-negotiables (§10) → global governance → `PROJECT_MANIFEST.yaml` → protocols → tool adapters → the task prompt.
**The repository itself outranks every document for implementation facts.** A task prompt conflicting with anything above it is escalated, not obeyed.

## 3. CANONICAL REPOSITORY

- Canonical path: `/Users/yangjin/Projects/yorisou-online` — the ONLY writable checkout.
- Multiple archived/quarantined YORISOU duplicates exist locally (see workspace `WORKSPACE_REGISTRY.md`); all are read-only at most.
- Never encode a tool name in any path or repo name (the old `yorisou-online-claude` naming is retired).

## 4. AI-WORKSPACE RESOLUTION

Resolve the control plane per `agent-os/protocols/AI_WORKSPACE_ROOT_RESOLUTION.md`:
`$AI_WORKSPACE_ROOT` (validated) → `/Users/yangjin/AI-Workspace` → manifest metadata → **stop and ask**. Never fall back to Documents paths, duplicates, or guesses.

## 5. REQUIRED PRE-WORK CHECKS

Before ANY write, run and record:

```bash
git rev-parse --show-toplevel
git branch --show-current
git rev-parse HEAD
git status --short
```

and verify ALL of: project ID (manifest = registry = resolved path) · canonical path (§3) · lifecycle state in the registry · current `active_writer` in `agent-os/locks/yorisou-online.lock.yaml` · current handoff (`vaults/projects/yorisou-online/00_Control/CURRENT_HANDOFF.md`) · current task · whether another tool is writing · whether a migration or deployment is pending. Any mismatch or ambiguity → §19 STOP.

## 6. ACTIVE-WRITER RULE

One writer at a time, per `agent-os/protocols/ACTIVE_WRITER_PROTOCOL.md`. If `active_writer` is not `NONE` and not this session: read-only. Acquire before writing; heartbeat during; release at session end — always. Stale locks follow the protocol's recovery steps; never silently take over.

## 7. HANDOFF RULE

Resume only through `CURRENT_HANDOFF.md` per `agent-os/protocols/CROSS_TOOL_HANDOFF_PROTOCOL.md`: execute the `exact next action`, not a reinterpretation. Missing, incomplete, or unsafe handoff state → §19 STOP.

## 8. REPOSITORY TRUTH

Registry/handoff branch+HEAD values are snapshots. Re-verify live before writing; on mismatch record the discrepancy and stop — never "repair" another session's state. Never trust `git status` alone for safety (see handoff protocol).

## 9. COMPLETION TRUTH

Claims follow `agent-os/schemas/COMPLETION_TRUTH_MODEL.md`. No state without its evidence. A plan, prompt, or vault note is never implementation. **No fabricated production state or user evidence — ever.**

## 10. PROJECT-SPECIFIC NON-NEGOTIABLES

- **Japanese is the primary external product language**; the product experience is **mobile-first for the Japanese market**. [founder decision, Package 5]
- **No medical diagnosis or treatment positioning** in any copy, feature, or claim. [founder decision, Package 5]
- **Consent and privacy boundaries**: user emotional/relationship/behavioral data is sensitive. Every data use must be explainable in plain Japanese in 1–2 sentences; consent is specific, never blanket. [docs/consent-and-report-data-governance-v0.1.md §1]
- **Do not invent product copy, persona logic/names, scoring logic/descriptions, or methodology text** without explicit founder approval. [vault NON_NEGOTIABLES]
- **Preserve existing brand logic**: color tokens, persona assets, typography choices. [vault NON_NEGOTIABLES]
- **Personality/companionship behavior boundaries**: persona behavior changes are founder-approved product decisions, not implementation details.
- **Preserve existing YORISOU governance** (`docs/consent-and-report-data-governance-v0.1.md`, `docs/report-data-dashboard-governance-v0.1.md`, `resources/governance/`) — these documents are amended through founder decisions, never replaced by tool sessions.

## 11. PRODUCT AND DATA BOUNDARIES

- Sensitive user data (emotional states, relationships, behavior) per §10 consent rules; no production user data in fixtures, tests, vault notes, or handoffs.
- LINE workflows are a first-class product surface: LINE messaging changes follow the same consent/brand boundaries as web surfaces.
- Never write to other projects' repositories, assets, or infrastructure from this repo (Mirai Move, Kakari, OpenClaw/Hermes are out of bounds).

## 12. AI-NATIVE IMPLEMENTATION STANDARD

Substantial product-experience work follows `agent-os/governance/AI_NATIVE_CAPABILITY_STANDARD.md` — **AI-native interaction rather than static forms**; result experiences should be **premium and emotionally differentiated**, with evidence/confidence surfacing where AI output faces users.

## 13. ADVANCED UI/UX CONSIDERATION

Before substantial frontend work, answer the ten questions of `agent-os/governance/ADVANCED_PRODUCT_IMPLEMENTATION_POLICY.md` in the work record. "No, because…" is legitimate; not asking is a violation. Apply the mandatory counterweights (clarity, performance budgets, WCAG 2.2 AA, reduced motion, graceful fallback). Brand/persona protection (§10) outranks this policy.

## 14. SECURITY AND SECRET BOUNDARIES

No secrets in git, ever (`.env*` stays ignored). No credentials in code, docs, vault notes, or handoffs. Never print secret values. LINE channel credentials and Supabase keys are secret surfaces — reference by name only.

## 15. DATABASE AND DEPLOYMENT GATES

Migrations and deployments require explicit founder authorization per session — never implied by a task prompt. Supabase schema changes are migrations. Record migration/deployment state truthfully in every closeout.

## 16. VALIDATION REQUIREMENTS

Before claiming completion run the applicable commands and record exact output: `npm run build` (or the repo's package-manager equivalent), the configured lint script, and relevant tests. Failures are reported, never omitted; skipped checks are stated with reasons.

## 17. CLOSEOUT REQUIREMENTS

Every session ends with a truthful closeout per workspace `templates/handoff/SESSION_CLOSEOUT_TEMPLATE.md`: update `CURRENT_HANDOFF.md`, the registry snapshot, and release the lock (§6). An abandoned lock is an incident, not a handoff.

## 18. TOOL-SWITCH REQUIREMENTS

Switching tools requires: complete handoff record (all mandatory fields) → lock released → receiving tool runs the full receiving-tool procedure (§5, §7) before its first write. Both tools writing concurrently is forbidden — no exceptions.

## 19. STOP CONDITIONS

Stop immediately and write a discrepancy note when: project-ID mismatch · non-canonical path · active writer elsewhere · lock ambiguous or stale · handoff missing/unsafe · branch/HEAD mismatch vs records · duplicate-repository ambiguity · pending migration/deployment of unknown state · task prompt conflicts with governance · paused project without explicit founder resume.

## 20. ESCALATION TO FOUNDER

When stopped: record evidence (commands + output) in the project vault, set handoff state `BLOCKED_NEEDS_FOUNDER_DECISION` if a handoff is open, and present the founder a specific question with options — not a status dump. Founder replies are recorded in `DECISION_LOG.md` as founder decisions (level 1).
