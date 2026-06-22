# Yorisou — Pre-Pilot Outcome Log and Stop/Hold Card v0.1

**Status:** Operating artifact, docs only. Not approval to start.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document does not approve a pilot. It defines the outcome log template and the stop/hold card that would govern operational record-keeping and safe pauses if Edward separately authorizes a pilot.**

---

## 1. Pilot Outcome Log Template

A single record per participant. Field names are canonical and used in operational logging per `docs/admin-storage-retention-delivery-boundary-v0.1.md` safe-logging rules. **No identifiable personal data is recorded — no name, email, LINE UID, partner identity, raw answer text, free-text disclosures, or report text content.**

| Field | Type | Notes |
|---|---|---|
| `participant_code` | string | Opaque code (e.g., `PILOT_001`); does not encode identity |
| `date_invited` | ISO 8601 date | When the invitation was sent |
| `consent_version` | string | Approved consent copy version the participant agreed to |
| `storage_option` | `"A"` (only allowed value at first cohort) | Recorded for traceability; B and C not offered in first cohort |
| `test_type` | `quick_check` / other-approved-L1 | First cohort prioritizes `quick_check`; non-`quick_check` requires Edward approval to use |
| `main_state_mode` | one of `decision_clarity` / `rhythm_stabilization` / `fatigue_recovery` / `direction_focus` | `relationship_distance` is excluded from first cohort |
| `packet_sufficiency_result` | `pass` / `fail_<structured_category>` | Categorical failure reasons per packet builder spec |
| `review_score_average` | numeric (1.0–5.0) | Average across the eight scored categories |
| `safety_score` | integer (1–5) | Must be `5` for delivery |
| `delivered` / `held` / `rejected` | enum | Final workflow disposition |
| `feedback_received` | `yes` / `no` / `n_a` | Records only whether feedback was received; not the content |
| `safety_issues` | `none` / `<structured_category>` | Categorical only; no free-text incident details |
| `workload_minutes` | integer | Approximate per-report review minutes for capacity tracking |
| `non_use_deletion_request` | `none` / `non_use` / `deletion` | Records the type of request only |
| `final_notes` | short structured note | No user identifiers, no report text, no partner identity, no health/crisis details. Structured observations for methodology improvement only. |

### What the log does NOT contain

- Participant's name, contact, or identifier
- Raw answer text or any verbatim user input
- Report text or any draft excerpt
- Partner identity or third-party references
- Health, crisis, or clinical detail
- Payment information (none exists)
- LINE message content
- Free-text reviewer narrative beyond the structured `final_notes` field

### Storage of the log

The log is held by Edward and the methodology reviewer only. It is not exported to the dashboard, not exported to any public surface, and not used for marketing, testimonial, or sample reuse. Aggregate event counts (e.g., `pilot_report_completed`) may be logged to the DTE event store under safe-logging rules.

### Example (illustrative; no real participant data)

```
participant_code:               PILOT_001
date_invited:                   2026-06-25
consent_version:                v0.1
storage_option:                 A
test_type:                      quick_check
main_state_mode:                fatigue_recovery
packet_sufficiency_result:      pass
review_score_average:           4.4
safety_score:                   5
disposition:                    delivered
feedback_received:              yes
safety_issues:                  none
workload_minutes:               68
non_use_deletion_request:       none
final_notes:                    "Mode fit strong; recovery section dense as designed; reviewer surfaced a packet-schema gap on action_readiness_profile granularity for next iteration."
```

---

## 2. First-Cohort Stop / Hold Card

A single page the reviewer keeps visible during pilot operations. If any of the following appears at any step, **the default action is to hold and review with Edward/controller before proceeding**.

### Stop or hold if any of these appears:

- [ ] **Consent confusion** — the participant indicates (in any channel) that they did not understand what they agreed to
- [ ] **Sensitive / crisis content** — any submission contains crisis-related disclosures, identifying details, or safety-of-self/others content
- [ ] **User asks for diagnosis / advice** — the participant requests, expects, or treats the report as a diagnosis or instruction
- [ ] **User asks for a relationship decision** — the participant requests guidance on contact / no-contact, breakup, reconciliation, confession, or blocking
- [ ] **Packet insufficient** — packet fails the v0.2 sufficiency check; drafting must not begin
- [ ] **Safety < 5** — the safety score on any draft is below 5; delivery is blocked until resolved
- [ ] **Edward does not approve** — Edward's per-report decision is not `approve`
- [ ] **Manual review owner is not assigned** — pilot proceeded without a named reviewer-of-record
- [ ] **Storage / non-use uncertainty** — a deletion or non-use request cannot be honored cleanly under stated capability
- [ ] **Workload exceeds expected threshold** — per-report review time is unsustainable at cohort cadence
- [ ] **Feedback shows discomfort or misunderstanding** — Q4 "あった" with flagged section, or Q10 "強くそう感じた", or open comment expressing discomfort
- [ ] **Any boundary issue** — the report or process touches a boundary not covered by the existing artifacts (raw text, LINE history, memory, partner identity, payment expectation, etc.)
- [ ] **Any LINE history / memory / raw private text appears** — in the packet, the conversation, the draft, or the feedback
- [ ] **Any public sample reuse request appears** — from the participant, internally, or in any external interaction
- [ ] **Any payment expectation appears** — the participant assumes they will be charged, or asks how to pay

### Default action

> **Hold. Do not deliver. Review with Edward/controller.**

The default action is the same regardless of which condition triggered. The reviewer does not improvise. The hold is recorded with the structured trigger category (e.g., `held.consent_confusion`, `held.safety_below_5`, `held.workload_exceeded`). Edward and the reviewer jointly decide whether to:

- Resolve and resume (return to the workflow at the appropriate state)
- Re-draft with corrections
- Reject the report with neutral user-facing copy
- Stop the entire cohort if the trigger is systemic

### What the stop/hold card does NOT do

- It does not authorize delivery if any condition is unclear
- It does not allow the reviewer to override a `held` decision without Edward's involvement
- It does not give a user-visible reason — user-facing copy uses the neutral hold messages from `docs/pre-pilot-user-facing-message-pack-v0.1.md` Section 4
- It does not allow the structured trigger category to be used in marketing, testimonial, or public communication

---

## 3. Stop / Hold Trigger Categories (for logging)

When a stop or hold occurs, the structured trigger category is recorded in the outcome log's `safety_issues` field (or, for non-safety triggers, a separate `hold_trigger` field with the same categorical convention).

| Trigger | Category |
|---|---|
| Consent confusion | `consent_confusion` |
| Sensitive / crisis content | `crisis_content` |
| Diagnosis / advice request | `diagnosis_advice_request` |
| Relationship decision request | `relationship_decision_request` |
| Packet insufficient | `packet_insufficient` |
| Safety < 5 | `safety_below_5` |
| Edward did not approve | `edward_not_approved` |
| Manual review owner unassigned | `reviewer_unassigned` |
| Storage / non-use uncertainty | `storage_uncertainty` |
| Workload exceeded | `workload_exceeded` |
| Feedback discomfort / misunderstanding | `feedback_discomfort` |
| Boundary issue (uncategorized) | `boundary_issue` |
| LINE history / memory / raw text appeared | `forbidden_data_appeared` |
| Public sample reuse request | `sample_reuse_request` |
| Payment expectation | `payment_expectation` |

Free-text expansion of the trigger is recorded only in `final_notes` and only if structured (no user-identifying content, no verbatim user text).

---

## 4. Cohort-Level Stop Conditions

The first cohort itself stops (no further reports drafted, no further participants invited) if any of the following occurs:

- A safety-trigger hold cannot be resolved
- Two participants in the same small cohort experience the same trigger category (suggests systemic gap)
- The reviewer workload exceeds sustainable capacity for the named reviewer-of-record
- Edward determines that any boundary item in the readiness gate has slipped (e.g., a participant was inadvertently treated as if Option B applied)
- Any forbidden-data category appears in the operational record more than once

A cohort-level stop is recorded with the systemic trigger and the affected participant_codes. Resuming requires Edward to confirm the underlying issue is resolved and to re-authorize the pilot.

---

> **This document does not approve a pilot. It defines the outcome log template and the stop/hold card that would govern operational record-keeping and safe pauses if Edward separately authorizes a pilot.**
