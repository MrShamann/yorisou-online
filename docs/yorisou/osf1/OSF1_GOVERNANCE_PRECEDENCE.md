# OSF-1 — Governance precedence

**v2.0, corrected 2026-08-17 by Founder decision.** v1.0 (2026-08-15) recorded a conclusion that was
wrong, and the correction is the more important half of this document — so the error is stated first
and kept, rather than quietly overwritten.

---

## 1. ACTIVE GOVERNANCE

**The YORISOU v0.7.0 complete replacement baseline is the active governance of this project.**

Confirmed by Edward, 2026-08-17. Exactly 40 Markdown resources are active. Older packs must not be
mixed with it.

Authoritative anchors named by the Founder include `Yorisou_Project_Constitution_v0.7.0.md`,
`00_YORISOU_CANONICAL_CURRENT_STATE_2026-08-14.md`, `RESOURCE_MANIFEST_v0.7.0.md`,
`COMPLETE_REPLACEMENT_NOTICE_v0.7.0.md`,
`Yorisou_Life_Graph_Memory_and_Continuity_Governance_v0.7.0.md`,
`Yorisou_Technical_Architecture_and_Execution_Protocol_v0.7.0.md`,
`Yorisou_Product_Doctrine_and_UX_Boundary_v0.7.0.md`, and
`Yorisou_Data_Privacy_Consent_and_Social_Visibility_Governance_v0.7.0.md`.

### The authority order

1. **Edward's latest explicit Founder decision**
2. **YORISOU Project Constitution v0.7.0**
3. **Canonical Current State**
4. **Other approved active v0.7.0 Project Resources**
5. **Verified repository / runtime / database / deployment evidence**
6. **Approved implementation and release evidence**
7. **Historical resources**

**Repository-local instructions do not supersede the active Founder-installed Project Resources merely
by existing in Git.** `AGENT_PROJECT_RULES.md`, `PROJECT_MANIFEST.yaml`, `resources/governance/current/`
and this document are **implementation constraints** — binding on *how* work is executed in this
repository, wherever they are compatible with the active baseline. They cannot override Edward, the
Constitution v0.7.0, the Canonical Current State, or the active v0.7.0 governance.

**What verified repository truth still controls:** *implementation claims*. Whether a migration applied,
whether a test ran, whether a route answers 404, whether a row exists. Tier 5 exists because a document
asserting that something is built is not evidence that it is. Repository evidence settles **what is
true of the code**; it does not settle **what the project is for**.

## 2. THE ERROR THIS DOCUMENT CORRECTS

v1.0 of this file recorded, and five other OSF-1 documents repeated, statements equivalent to:

- "the effective governance corpus is Governance Pack v0.4.1"
- "a search of the entire repository finds no v0.7.0 governance artifact"
- "the ChatGPT Project Resources … sit at the task-prompt tier of the chain, not the governance tier"
- "the task prompt ranks last", applied to the Project Resources

**All of those are now false as statements about YORISOU governance.**

### How the error was made, precisely

The observation was correct and the inference was not. It remains true that **this repository contains
no v0.7.0 file**: `resources/governance/current/RESOURCE_MANIFEST.md` self-describes as *"YORISOU
Governance Pack v0.4.1"*, 29 Markdown documents plus annexes, activated on `main` by PR #106
(`7c37ca1`). Every `v0.7.0` string in the tree named the **product package** ("YORISOU OS Foundation
v0.7.0 Phase 1"), never a governance pack.

From that I concluded that no v0.7.0 governance *existed*, and therefore that the Project Resources
describing it could only be task direction. Three distinct mistakes:

1. **Absence from Git was read as absence from existence.** The Founder-installed Resource layer is a
   real governance surface that this repository cannot see. "I could not find it" is a fact about my
   search, not about the project.
2. **A repository directory was ranked above the Founder's own installed baseline.** The precedence
   chain in `AGENT_PROJECT_RULES.md` §2 puts "founder decision" first and "the task prompt" last, and
   I placed the Project Resources in the wrong one of those two tiers. They are not a task prompt.
   They are the governance layer the Founder maintains.
3. **The strongest available evidence was mistaken for the strongest evidence.** An activation commit
   is excellent evidence of what the *repository* activated. I treated it as decisive about what
   *governs*, because it was the best thing I could reach — which is exactly how a diligent search
   produces a confident wrong answer.

The v1.0 text even argued the point against itself: it said "a prompt asserting a governance version
does not become a Founder decision by being written by the Founder." That is a sound principle about
*prompts*. Applying it to an installed Resource baseline was the error, and citing a principle
correctly is not the same as applying it to the right object.

### Why this was a merge blocker and not a code defect

Nothing in the implementation changed. No test result changed. What was wrong was a **governance
record** — six documents asserting that a superseded pack outranks current governance. Merging that to
`main` would have made the false record the repository's own account of its authority, which is worse
than a bug: a bug gets found by a test, and a governance claim gets cited.

## 3. Historical execution assumption, kept for the record

| | |
|---|---|
| **Historical assumption (2026-08-15 → 2026-08-17)** | Pack v0.4.1 was inferred from repository-local governance to be the effective corpus, because it is what the repository contains and activated. |
| **Current Founder-installed authority (2026-08-17 →)** | The v0.7.0 complete replacement baseline, 40 active Markdown resources. |

**What that means for the Phase 1 work already done.** The v0.4.1 pack was not a bad thing to have
followed — it is the repository's own record of Edward's earlier approved governance, and its
requirements are the reason several things in this package exist at all: the test-product-into-memory
prohibition, live kill-switch testing before internal exposure, the three Memory rights, retention
left as `RETENTION_POLICY_TBD` rather than invented. Those obligations are stricter-or-equal
implementation constraints, and §4 audits them against the active baseline rather than assuming they
carry over.

The v0.4.1 pack is now **historical** in the authority order (tier 7). It remains useful as the
in-repo record of implementation constraints, and `resources/governance/current/` is not deleted or
rewritten by this document — retiring or replacing it is a Founder act under change management, and
this correction does not perform one.

## 4. Divergences from the active baseline, unchanged in substance

Both tensions recorded in v1.0 are still live and neither is resolved unilaterally. They are restated
here against the correct authority.

**Retention.** The audit table carries `RETENTION_POLICY_TBD` with no expiry. Privacy governance
requires retention to be explicit per entity and enforced. This remains **`FOUNDER_DECISION_REQUIRED`**
with a decision brief containing measured estimates and a tiered recommendation
([OSF1_AUDIT_RETENTION_DECISION.md](OSF1_AUDIT_RETENTION_DECISION.md)). Nothing was invented; no purge
job exists, which is the correct state because a purge is precisely the irreversible act that must not
precede the decision.

**Memory service naming.** `memoryLifecycleService` and `permissionCheckService` are named in
governance and do not exist by those names. The **substance** is implemented — one `SECURITY DEFINER`
RPC write path, owner-scoped reads, and the view / correct / suppress / revoke / delete rights with a
deletion receipt. A naming divergence in an implementation that achieves the requirement, recorded
rather than hidden.

## 5. How precedence was actually applied to PR #135

Stated plainly, and re-derived under the corrected order rather than asserted:

- Where the task package and the active baseline agree, both were followed.
- Where the baseline imposes something the package did not mention, **the baseline governed and the
  requirement was added** — the test-product-into-memory hard rule and live kill-switch testing both
  entered this work that way, from governance rather than from the prompt.
- Where the package asked for something governance does not address (pagination shape, E2E coverage,
  runbook structure, harness design), the package governs as ordinary task direction.
- Where a governance requirement is unmet and its resolution is reserved to Edward, it is recorded as
  `FOUNDER_DECISION_REQUIRED` and nothing was invented.

**No action in this package was blocked by a governance conflict**, under either the old reading or the
corrected one. The delta audit in
[OSF1_V070_GOVERNANCE_DELTA_AUDIT.md](OSF1_V070_GOVERNANCE_DELTA_AUDIT.md) is what establishes that
under the correct authority, rather than leaving it as an inherited conclusion.

## 6. The rule this leaves behind

A governance question has two parts, and the second is the one that was skipped: *what does the
repository contain*, and *what has the Founder installed as current*. The first is answerable by
grep. The second is not, and a confident answer built only from the first is the failure mode this
document now exists to prevent.

`tests/governance/osf1-governance-truth.mjs` enforces the narrow, checkable half: no current OSF-1
truth document may claim an older pack is the **active** governance. Historical references are
explicitly allowed — this document is full of them, and it has to be.

---

## Version history

- **v1.0 (2026-08-15)** — precedence resolved from repository truth. Concluded Pack v0.4.1 effective
  and the Project Resources task-prompt tier. **Both conclusions were wrong**; §2 explains how.
- **v2.0 (2026-08-17)** — corrected by Founder decision. v0.7.0 complete replacement baseline recorded
  as active governance; the authority order restated; repository-local rules restated as
  implementation constraints; the error and its mechanism preserved rather than deleted.
