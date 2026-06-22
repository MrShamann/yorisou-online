# Yorisou — Internal Real-Input Pilot Plan v0.1

**Status:** Specification only. Not implementation approval.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

## 1. Purpose

The simulated pilot batch (`sim_pilot_001` / `002` / `003`) confirmed the template and review workflow are operationally workable. The next phase is the **internal real-input pilot**: 2–3 reports drafted from real (not constructed) input packets, using only internal sources, under Level 1 consent only.

The internal real-input pilot exists to confirm:
- The v0.2 input packet schema produces enough granularity for personalization to clear the rubric threshold (Personalization ≥ 4)
- `main_state_mode` selection works in practice and produces visibly different reports
- The mode-specific section emphasis does not cause mode collapse
- Safety, paid-worthiness, and revisit value hold under real input variability
- Edward's review workload remains sustainable at the 2–3 report cadence

---

## 2. Constraints

The following constraints apply throughout the internal real-input pilot:

- **No external users.** No public recruitment. No volunteer pilot at this phase.
- **Edward may use his own check-in answers** or **manually-created non-sensitive answer packets** as the real input source. No third-party input is collected.
- **No payment.** This is unpaid quality validation.
- **No LINE history use.** Raw LINE message content is not collected, summarized, or used.
- **No memory use.** Level 2 and Level 3 are not active.
- **No raw private free text.** Real-but-non-sensitive answer values are acceptable; personal disclosures, names, and identifiable references are not.
- **No dashboard implementation is required.** The dashboard remains at the operational-fields state from prior packages. No new dashboard surface is created for this pilot.
- **Internal only unless separately approved.** Volunteer outreach requires separate Edward authorization and consent-handling sign-off.
- **No model training use** of inputs, outputs, or feedback.
- **No automation approval** for any drafting step.
- **No OpenClaw runtime memory access.** OpenClaw is not active for this pilot.

---

## 3. Number of Reports

- **2 to 3 reports total** in this phase.
- 2 is acceptable if the third would stretch review capacity.
- 3 is the upper bound; do not exceed without separate authorization.

### Recommended Mode Distribution

To stress-test mode differentiation, the 2–3 reports should cover distinct `main_state_mode` values:

| Slot | Mode |
|---|---|
| 1 | `direction_focus` OR `decision_clarity` |
| 2 | `fatigue_recovery` OR `rhythm_stabilization` |
| 3 (optional) | `relationship_distance` — only if safety review capacity allows |

`relationship_distance` is listed as optional because the relational lens carries higher creepy-personalization risk and requires the most careful safety review. Skip slot 3 if review capacity is tight; the two-mode pilot still tests differentiation.

If only 2 reports, do not pick two from the same mode — the point is to confirm modes produce visibly different reports.

---

## 4. Input Preparation Process

For each internal report:

1. **Source the check-in input.** Edward completes the relevant Yorisou check-in (`quick_check`, `relationship_fatigue`, or `love_distance`) himself, or constructs a non-sensitive answer set that reflects a real pattern shape.
2. **Run check-in scoring** to produce `result_archetype`, `dimension_summary` shapes, and `confidence_level`.
3. **Derive packet fields** per `docs/pilot-input-packet-schema-v0.2.md` Section 2 — all required fields, all minimum granularity met.
4. **Select `main_state_mode`** using `docs/main-state-mode-rules-v0.2.md`. If ambiguous, sharpen the packet rather than guess.
5. **Set `consent_level: "L1"`.** No other level.
6. **Set `excluded_data` explicitly.** List every category not used.
7. **Run the fail-condition check** from packet schema Section 4. If anything fails, respond `input_packet_revision_required` and revise; do not begin drafting.

---

## 5. Review Process

For each report:

1. **Yorisou Agent drafts** all 14 sections per the section emphasis matrix for the selected mode (`docs/main-state-mode-rules-v0.2.md` Section 4).
2. **Section completeness check** (per `docs/first-pilot-report-operations-v0.1.md` Section 4, Step 5).
3. **Safety review** (per template spec Section 8).
4. **Consistency review** including:
   - Mode fit: does the report match the selected `main_state_mode`?
   - Mode confusion check: would a reader correctly guess the mode from reading the report?
5. **Edward quality review** using the rubric from `docs/first-pilot-report-quality-rubric-v0.1.md` plus the additional internal-pilot gate (Section 7 below).
6. **Revise or approve.** If approved, the report is archived internally as a methodology reference. No delivery to any user.

---

## 6. Quality Scoring

The full rubric from `docs/first-pilot-report-quality-rubric-v0.1.md` applies (Depth / Personalization / Safety / Practicality / Paid-worthiness / Revisit value, 1–5 scale, minimum thresholds).

Two additional scores are recorded for the internal pilot:

| Category | Definition |
|---|---|
| **Mode fit** | Does the report reflect the selected `main_state_mode` in tone, emphasis, and framing? 1–5. |
| **Input packet sufficiency** | Did the packet provide enough granularity for the drafter to produce personalized content? 1–5. |

A low **Input packet sufficiency** score is a packet-schema failure, not a drafting failure — surface it as a methodology gap for v0.3.

---

## 7. Internal Pilot Quality Gate

For the internal real-input pilot to be considered successful, all of the following must hold across all 2–3 reports:

- [ ] **Safety = 5 on every report** (no exception)
- [ ] **Average quality score ≥ 4.2** across the 6 base rubric categories
- [ ] **Personalization ≥ 4** on every report
- [ ] **Paid-worthiness ≥ 4** on every report
- [ ] **Mode fit ≥ 4** on every report
- [ ] **Input packet sufficiency ≥ 4** on every report
- [ ] **No mode collapse** — the 2–3 reports must be visibly different in framing, not interchangeable
- [ ] **No prohibited language** in any report (template spec Section 5)
- [ ] **Edward workload acceptable** — the per-report time-to-review must be sustainable

If any of the above fails, the pilot is held and the relevant document (schema, mode rules, template spec, or rubric) is revised before another batch is produced.

---

## 8. Storage / Non-Storage Assumption

- Approved reports are archived **internally only** — controller's local file or Yorisou Agent working store. Not stored in any server-side user-facing system.
- The input packets are archived alongside the reports.
- Decision logs and review notes are archived alongside.
- No report content is logged to the DTE event store. Aggregate counts (e.g., `internal_pilot_report_completed`) may be logged under safe logging rules from `docs/report-data-dashboard-governance-v0.1.md`.

---

## 9. Deletion / Non-Use Handling

Even though the internal pilot uses Edward's own or constructed inputs:

- Edward may request internal deletion or non-use of any individual report at any time.
- Constructed input packets that turn out to resemble identifiable real people should be discarded.
- If at any point a report is found to inadvertently reference an identifiable person, the report and its packet are removed from the internal archive.

The deletion path is internal-only and does not require user-facing deletion UI at this phase.

---

## 10. When to Stop

Stop the internal pilot immediately if any of the following occur:

- A safety flag cannot be resolved through revision
- Two consecutive reports score below the quality gate
- An input packet repeatedly fails granularity requirements despite revision (indicates schema gap)
- A report inadvertently includes identifiable personal references
- The per-report review workload is unsustainable
- A new methodology question arises that needs documentation before proceeding

When stopped, document the reason and route to the relevant spec for revision.

---

## 11. When to Proceed

After the 2–3 reports clear the internal pilot quality gate:

- Surface aggregate findings to Edward
- Document any schema, mode-rule, or template gaps discovered
- Decide jointly with Edward whether to:
  - Proceed to a semi-manual pilot with trusted volunteers (requires separate consent-handling approval)
  - Revise the input packet schema to v0.3 before any next phase
  - Revise the mode rules
  - Pause to address an unresolved decision (e.g., delivery mode, consent wording)

No decision after the internal pilot may by itself authorize payment, automatic generation, external user delivery, OpenClaw memory access, Level 2/3 consent use, or public launch. Each of those requires a separate explicit authorization from Edward.

---

## 12. Decision After Internal Real-Input Pilot

Possible next-step decisions:

| Decision | Notes |
|---|---|
| **Proceed to trusted volunteer pilot** | Requires separate Edward approval and consent-handling sign-off. Still Level 1 only. Still no payment. |
| **Revise schema to v0.3** | If input packet sufficiency was uneven, before any next phase |
| **Revise mode rules to v0.3** | If mode fit or mode confusion was uneven |
| **Revise template spec to v0.2** | If the template structure needs adjustment based on real-input findings |
| **Pause for an unresolved decision** | E.g., delivery mode, pricing, consent wording, EN template |
| **Run a second internal batch** | If learnings warrant it before any external phase |

---

## 13. Open Decisions for Edward

The following decisions remain open and influence what happens after the internal pilot. None are decided by this document.

| Decision | Notes |
|---|---|
| Whether to authorize a trusted volunteer pilot, and at what consent handling | Required before any non-internal report |
| Whether to authorize OpenClaw draft support for any next phase | Requires separate OpenClaw safety review |
| Delivery mode (in-app / LINE / downloadable / archive-only) for any external reports | Unresolved |
| Pricing for any future paid phase | Unresolved; no price hardcoded anywhere |
| Consent copy finalization for L1 (and conditional L2/L3 drafts) | All draft blocks in `docs/report-consent-copy-v0.1.md` need approval |
| Whether full report text is viewable by Edward in a restricted dashboard view | Unresolved |
| EN report template specification | Unresolved |
| Dashboard log retention policy | Unresolved |
| Aggregate threshold for suppressing small-cohort breakdowns in any dashboard | Unresolved |
| Whether audit logging is implemented before scaled operation | Recommended but deferred |
| Refund / failure policy for any future paid phase | Deferred |
| Repeat check-in handling for users who do multiple sessions | Unresolved |

---

> **No external users. No volunteer pilot. No payment. No memory. No LINE history. No automation. No OpenClaw memory access. No model training. Internal real-input pilot is methodology validation, not product launch.**
