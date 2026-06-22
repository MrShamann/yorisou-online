# Yorisou — Admin Generation Tool Spec v0.1

**Status:** Specification only. Not implementation approval.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document is a specification only. It does not approve implementation, user delivery, volunteer pilot, automation, OpenClaw runtime access, payment, LINE history, memory, raw private text, model training, dashboard implementation, entitlement, or public sample reuse.**

---

## 1. Why Admin Generation Tool Spec Is Needed

The Yorisou paid report methodology, input packet schema v0.2, mode rules, quality gate, failure fallbacks, consent governance, consent copy, storage policy, feedback consent, relationship-distance safety copy, and volunteer-pilot readiness gate are now defined as documentation. They describe *what* a report is, *how* it is drafted, *what* the user reads, and *what* must not happen.

What they do not yet describe is the **internal admin workflow surface** — the operational shape of how a request becomes a draft, how a draft is reviewed, how revisions are handled, how holds work, what an approval looks like, how a non-use request is recorded, and where the boundaries of admin access sit.

This document defines that admin workflow surface as text only. It does not build the tool. It does not authorize a volunteer pilot. It does not authorize automatic delivery. It establishes the contract so that any future implementation has a stable target.

### Why now

- **Methodology and consent docs are ready for specification.** Template v0.2, packet schema v0.2, mode rules, quality gate, failure fallbacks, consent governance, consent copy v0.1, storage policy v0.1, feedback consent v0.1, relationship-distance copy v0.1, and the volunteer-pilot readiness gate are all merged. The admin workflow contract can be specified against them.
- **Volunteer pilot remains blocked.** No pilot may run until the readiness gate is met and Edward separately authorizes. Defining the admin workflow now does not move the pilot forward; it lets the workflow contract stabilize independently of pilot timing.
- **Admin workflow must exist before handling real volunteer reports.** If a volunteer pilot is later authorized, every report must flow through a defined sequence of states with defined reviewer actions and defined logs. Inventing this under operational pressure produces gaps.
- **Fully automated generation is not approved.** This spec defines a manual/semi-manual workflow with explicit human review at every gate. No step in the workflow is auto-approved or auto-delivered.
- **OpenClaw / runtime access remains separate.** Any future sanitized draft assistance is a separate approval that does not flow from this document.

---

## 2. Tool Purpose

The admin generation tool, when and if implemented under separate authorization, is:

- **Internal-only.** Accessible only to Edward and the methodology reviewer. Not a user-facing surface.
- **Manual / semi-manual.** Each report passes through human-authored or human-reviewed steps. No step is auto-approved.
- **Reviewer-controlled.** State transitions require a reviewer action. No automatic forward progression on the critical path.
- **Level 1 only at first.** Consent level is fixed at L1 in any pilot use of the tool.
- **No automatic user delivery.** Even at `delivery_ready`, delivery requires a separate manual action under a separately approved pilot.
- **No payment.** No price, no purchase flow, no entitlement, no Stripe surface.
- **No LINE history.** Raw LINE messages and LINE summaries are out of scope.
- **No memory.** Level 2 and Level 3 memory remain deferred.
- **No raw private text.** Raw answer payload, free-text personal disclosures, and identifiable references are not stored or processed.
- **No model training.** Reports, packets, drafts, and reviewer notes are not used for training or fine-tuning.
- **No public sample reuse by default.** Public/sample/marketing reuse requires separate explicit permission and anonymization review.

---

## 3. What This Tool Is Not

| Not | Why |
|---|---|
| **Production report automation** | The tool defines a manual review surface. Automatic generation is a separate authorization. |
| **Payment entitlement system** | No payment, no purchase, no entitlement is in scope. |
| **LINE personalization system** | LINE history is out of scope at v0.1. |
| **Memory system** | Level 2 and Level 3 memory are deferred. |
| **User-facing report builder** | This is an internal admin surface. The user does not interact with it. |
| **OpenClaw runtime interface** | OpenClaw runtime access is a separate, future-only specification. |

---

## 4. Roles and Permissions

The tool defines four primary roles plus one optional future role. Each role has explicit allowed actions, explicit forbidden actions, and explicit approval requirements.

---

### Role 1 — Edward / Final Approver

**Allowed actions:**
- View any state, any packet, any draft, any review note in the tool
- Approve `approved_internal` transitions
- Approve `delivery_ready` transitions (does not by itself execute delivery)
- Approve `delivered` transitions (only under a separately authorized pilot)
- Move a report to `held` with neutral hold copy applied
- Move a report to `rejected` with documented reason
- Mark a report or request as `deletion_or_non_use_requested`
- Authorize a sanitized draft assistant for a specific draft (separately, per draft, under future authorization)
- Approve consent copy versions, packet schema versions, and review checklist versions
- Approve or revoke role assignments

**Forbidden actions:**
- Cannot bypass the quality gate
- Cannot deliver a report without the volunteer pilot being separately authorized
- Cannot enable automatic transitions across the critical path
- Cannot approve payment, entitlement, OpenClaw runtime, memory, LINE history, or model training use in the tool

**Required approval:** No additional approval needed for Edward; Edward is the final approver. Edward's actions are logged with timestamp, state transition, and reason where applicable.

---

### Role 2 — Report Reviewer

**Allowed actions:**
- View packets and drafts assigned to them for review
- Score drafts against the quality gate (`docs/report-generation-quality-gate-v0.2.md`)
- Submit revision requests with specific notes
- Run the relationship-distance extra review checklist when applicable
- Recommend `approve` / `revise` / `hold` / `reject` decisions to Edward
- View their own past review history

**Forbidden actions:**
- Cannot finalize `approved_internal`, `delivery_ready`, `delivered`, or `rejected` without Edward's approval
- Cannot view packets or drafts not assigned to them
- Cannot export any draft, packet, or review note
- Cannot view user identifiers, payment information (none exists), or any data beyond the operational record needed for review

**Required approval:** Reviewer role assigned by Edward. Each reviewer's role is logged.

---

### Role 3 — Report Drafter / Yorisou Agent

**Allowed actions:**
- Receive a packet that has passed `packet_ready` state
- Draft the 14-section report per Template v0.2 and the selected `main_state_mode` writing rules
- Self-check against the quality gate before submitting
- Submit the draft to `draft_generated` state
- Apply revision notes and resubmit
- View past drafts they authored for methodology reference

**Forbidden actions:**
- Cannot begin drafting from a packet that has not reached `packet_ready` state
- Cannot draft from a packet with `safety_flags.severity = blocking`
- Cannot approve their own draft
- Cannot deliver any draft
- Cannot bypass the section completeness, safety, or consistency reviews
- Cannot include raw answer text, LINE content, or user identifiers in the draft

**Required approval:** Drafter role assigned by Edward. Drafts are attributed in the operational log.

---

### Role 4 — Optional Sanitized Draft Assistant

**Status:** Future spec only. Not active at v0.1. Activation requires separate Edward authorization and a separate OpenClaw safety review.

**Allowed actions (when activated under future approval):**
- Receive a sanitized Level 1 packet (operational fields only, per `docs/pilot-input-packet-schema-v0.2.md`)
- Produce a candidate draft for the drafter to review and rewrite
- Return only the draft text — no metadata claims, no confidence scores presented to the user

**Forbidden actions:**
- Cannot retain the packet beyond the current draft task
- Cannot access prior reports, other users' data, raw answer text, LINE content, or user identifiers
- Cannot be the final author of any delivered report
- Cannot be used for any report where `main_state_mode` is `relationship_distance` unless separately authorized for that specific draft

**Required approval:** Separate Edward authorization per activation, and a one-time OpenClaw safety review before first use.

---

### Role 5 — System / Admin Operator

**Allowed actions:**
- Maintain the tool's operational integrity (uptime, logging, access controls)
- Apply consent copy version updates after Edward approval
- Apply packet schema and checklist version updates after Edward approval
- View role assignments and audit logs for security purposes only

**Forbidden actions:**
- Cannot read packets, drafts, review notes, or report text
- Cannot transition any report through workflow states
- Cannot bypass access controls to view restricted fields
- Cannot export operational logs except for security incident response under documented procedure

**Required approval:** Operator role assigned by Edward. Operator's actions on the tool itself are logged separately from report state actions.

---

## 5. Cross-Role Rules

- **Two-party rule for `delivered`:** A report cannot move to `delivered` based on a single role's action. Edward's approval plus a separate manual delivery action are both required. (Even when a pilot is separately authorized — delivery itself is not automatic.)
- **No retroactive permission changes.** A role's permissions cannot be retroactively expanded to authorize an action that occurred when the role lacked that permission.
- **All transitions logged.** Every workflow state transition is logged with actor, timestamp, prior state, new state, and reason where applicable. Logs follow safe-logging rules — no report text, no user identifiers, no free-text content in the log itself.
- **Reviewer ≠ drafter for the same report.** The reviewer of a given draft must not be the drafter of the same draft.

---

> **This document is a specification only. It does not approve implementation, user delivery, volunteer pilot, automation, OpenClaw runtime access, payment, LINE history, memory, raw private text, model training, dashboard implementation, entitlement, or public sample reuse.**
