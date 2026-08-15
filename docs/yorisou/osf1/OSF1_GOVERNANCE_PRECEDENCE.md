# OSF-1 — Governance precedence actually used

**Resolved:** 2026-08-15, from repository truth, before any code change in the Phase 1 Finalization
package. Written because the package asked for the precedence to be *documented rather than assumed*,
and because the v0.7.0 / v0.4.1 discrepancy has now surfaced four times.

---

## 1. The precedence chain is declared in-repo, and it is not mine to invent

`AGENT_PROJECT_RULES.md` §2, "SOURCE-OF-TRUTH HIERARCHY", states it verbatim:

> On any conflict, higher wins (per `agent-os/governance/GOVERNANCE_INDEX.md`):
> founder decision → project non-negotiables (§10) → global governance → `PROJECT_MANIFEST.yaml` →
> protocols → tool adapters → **the task prompt**.

Two things follow directly, and neither is a judgement call:

- **The task prompt ranks last.** A package's own statement about which governance applies does not
  outrank the repository. That is why this document exists rather than a reconciliation.
- **"Founder decision" ranks first** — and it is a distinct tier from "the task prompt". A recorded,
  governed Founder decision outranks everything; a prompt asserting a governance version does not
  become one by being written by the Founder. The distinction is the whole point of the two tiers.

## 2. What governs repository execution

| Tier | Artifact | Status |
|---|---|---|
| Founder decision | `docs/yorisou/osf1/OSF1_FOUNDER_DECISIONS.md` and equivalents | binding where a decision is actually recorded |
| Project non-negotiables | `AGENT_PROJECT_RULES.md` §10–§13 | binding |
| Project governance corpus | **`resources/governance/current/` — YORISOU Governance Pack v0.4.1** | **binding, and it is the effective in-repo corpus** |
| | ├ `Yorisou_Project_Constitution_v0.4.0.md` | binding |
| | ├ `Yorisou_Technical_Architecture_v0.4.0.md` | binding |
| | ├ `Yorisou_Data_and_Privacy_Governance_v1.0.md` | binding |
| | ├ `Yorisou_Personal_Archive_and_Memory_Governance_v1.0.md` | binding |
| | ├ `Yorisou_Agent_Roles_and_Execution_Authority_v1.0.md` | binding |
| | └ `Yorisou_Release_and_Acceptance_Gates_v1.0.md` | binding |
| Legacy project governance | `docs/consent-and-report-data-governance-v0.1.md`, `docs/report-data-dashboard-governance-v0.1.md` | binding, preserved per §10 |
| Machine identity | `PROJECT_MANIFEST.yaml` | binding |
| Global governance | `agent-os/governance/` in AI-Workspace | binding; **pins no YORISOU governance version** |
| Task prompt | this package | lowest tier |

`resources/governance/current/RESOURCE_MANIFEST.md` self-describes as **"YORISOU Governance Pack
v0.4.1"**, approved 2026-07-14, amended 2026-07-26, 34 files. It was activated on `main` by PR #106
(`7c37ca1`). That is an activation event in the repository's own history — the strongest available
evidence of what is effective.

## 3. What the v0.7.0 material is, and is not

**A search of the entire repository finds no v0.7.0 governance artifact.** Every `v0.7.0` string in
the tree appears in OSF-1 *product* documents, where it names the **product package** ("YORISOU OS
Foundation v0.7.0 Phase 1"), never a governance pack.

So the ChatGPT Project Resources describing a "v0.7.0 OS Foundation governance direction" are:

- **strategic product requirements** — the Life OS direction, the six-stage loop, the Phase 1 entity
  set, the prohibitions on Life Graph / autonomous agents / Legacy / marketplace. These have been
  followed throughout, and they are the reason this work exists;
- **not in-repo execution authorities** — they are not in `resources/governance/`, carry no
  activation commit, no approval record, and no SHA256SUMS entry. They therefore sit at the task-
  prompt tier of the chain above, not the governance tier.

That is a statement about *where authority lives*, not a judgement about the material's quality. A
strategic direction becomes an execution authority by being amended into the pack through change
management — which is a Founder act, and has not happened.

## 4. Is there a true blocking contradiction?

**No. Nothing in this package was stopped.**

Two tensions exist and both are handled without contradiction:

**Retention.** Privacy v1.0 §3.2 requires retention schedules that are "explicit per entity … expiry
is enforced, not aspirational". The audit table carries `RETENTION_POLICY_TBD` with no expiry, which
does not satisfy it. The package's instruction — keep TBD, produce a decision brief, invent nothing —
is the correct handling of an unmet requirement whose resolution is reserved to Edward (§3.5:
"Retention and category changes: Edward with privacy review"). Recorded as a live divergence, not
resolved unilaterally.

**Memory lifecycle.** Memory Governance v1.0 §3.1 names `memoryLifecycleService` and
`permissionCheckService` as the sole write path and read gate; neither exists by those names. §3.2
requires users to be able to "view, correct, suppress, revoke, delete — each with visible
confirmation and (for deletion) a receipt". This package **implements** the missing capabilities,
which is convergence toward the corpus rather than conflict with it. The service *names* remain
divergent; that is a naming gap in an implementation that achieves the substance, and it is recorded
rather than hidden.

## 5. Precedence used in this package, stated plainly

Where the package and the v0.4.1 corpus agree, both were followed. Where the package asked for
something the corpus does not address (pagination shape, E2E coverage, runbook structure), the
package governs as ordinary task direction. Where the corpus imposes something the package did not
mention — the test-product-into-memory hard rule (§3.4), live kill-switch testing (§3.4 of Release
Gates) — **the corpus governs and the requirement was added**. Where a corpus requirement is unmet
and its resolution is reserved to Edward, it is recorded as a Founder decision and nothing was
invented.

No action in this package was blocked by a governance conflict.
