# Yorisou — Admin Generation Workflow States v0.1

**Status:** Specification only. Not implementation approval.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **`delivery_ready` and `delivered` are conceptual future states only. Their existence in this spec does not approve user delivery. No automatic delivery exists. Manual approval is required before any future delivery action.**

---

## 1. State Diagram

```
request_received
      ↓
consent_verified
      ↓
packet_pending ──→ packet_failed (→ revision back to packet_pending or rejected)
      ↓
packet_ready
      ↓
draft_generation_pending
      ↓
draft_generated
      ↓
safety_review_pending
      ↓
[review result?]
      ├── revision_required → loops back to draft_generation_pending
      ├── held → (resumable to safety_review_pending after resolution)
      ├── rejected → (terminal)
      └── approved_internal
                ↓
            delivery_ready  (conceptual; requires separately authorized pilot)
                ↓
            delivered       (conceptual; requires manual approval + separately authorized pilot)

deletion_or_non_use_requested may apply at any state ≥ request_received and is recorded separately.
```

---

## 2. State Definitions

---

### `request_received`

- **Purpose:** A new detailed report request has entered the workflow.
- **Entry condition:** A reviewer or Edward initiates a request, or (under a future authorized pilot) a consented volunteer's request is queued.
- **Exit condition:** Consent record is confirmed → transitions to `consent_verified`.
- **Allowed actions:**
  - View request metadata (report_id, requested_at, requested_by)
  - Verify the associated consent record
  - Cancel the request (moves to `rejected`)
- **Blocked actions:**
  - Drafting
  - Packet building
  - Delivery
- **Required logs:** Request opened event with report_id, actor, timestamp.

---

### `consent_verified`

- **Purpose:** Confirms that the user (or internal source) has consented to Level 1 data use for this request.
- **Entry condition:** Consent record is present, current version, and matches the report request.
- **Exit condition:** Reviewer opens packet preparation → transitions to `packet_pending`.
- **Allowed actions:**
  - View consent version and consent timestamp
  - Confirm storage option selected by the user
  - Begin packet preparation
- **Blocked actions:**
  - Drafting before packet is ready
  - Delivery
- **Required logs:** Consent verified event with consent_version, storage_option, timestamp.

---

### `packet_pending`

- **Purpose:** A reviewer is preparing the v0.2 input packet for the report.
- **Entry condition:** Consent verified.
- **Exit condition:**
  - Packet meets minimum granularity → transitions to `packet_ready`
  - Packet fails sufficiency check → transitions to `packet_failed`
- **Allowed actions:**
  - Edit packet fields
  - Run the packet sufficiency checker
  - Attach reviewer notes (operational only, no user identifiers)
- **Blocked actions:**
  - Submitting for draft generation before sufficiency check passes
  - Delivery
- **Required logs:** Packet preparation started/saved events with timestamps.

---

### `packet_failed`

- **Purpose:** The packet did not meet minimum granularity (per `docs/pilot-input-packet-schema-v0.2.md` Section 3).
- **Entry condition:** Sufficiency checker returned a failure.
- **Exit condition:**
  - Reviewer revises packet → returns to `packet_pending`
  - Reviewer chooses not to revise → transitions to `rejected`
- **Allowed actions:**
  - View the sufficiency failure reasons
  - Revise the packet
  - Reject the request
- **Blocked actions:**
  - Drafting
  - Delivery
- **Required logs:** Packet failure reasons (categorical, not free text), timestamp.

---

### `packet_ready`

- **Purpose:** Packet has passed sufficiency check and is ready for draft generation.
- **Entry condition:** Sufficiency checker returned pass.
- **Exit condition:** Drafter accepts the packet → transitions to `draft_generation_pending`.
- **Allowed actions:**
  - Reviewer assigns the packet to a drafter
  - Drafter accepts the assignment
  - Edit packet (returns to `packet_pending` if edited)
- **Blocked actions:**
  - Delivery
  - Skipping draft generation
- **Required logs:** Packet ready event with packet snapshot reference (no content stored in log).

---

### `draft_generation_pending`

- **Purpose:** Drafter has accepted the packet and is drafting the report.
- **Entry condition:** Packet accepted by drafter.
- **Exit condition:** Drafter submits the completed draft → transitions to `draft_generated`.
- **Allowed actions:**
  - Drafter drafts the 14 sections per Template v0.2 and the selected mode
  - Drafter self-checks against the quality gate
  - Drafter saves work-in-progress
- **Blocked actions:**
  - Reviewer cannot score before submission
  - Delivery
- **Required logs:** Drafting started event, drafting saved events (no content in log).

---

### `draft_generated`

- **Purpose:** Drafter has completed the draft and submitted for review.
- **Entry condition:** Drafter submits.
- **Exit condition:** Reviewer opens safety review → transitions to `safety_review_pending`.
- **Allowed actions:**
  - Reviewer opens the draft
  - Drafter may withdraw before review begins (returns to `draft_generation_pending`)
- **Blocked actions:**
  - Delivery
  - Drafter cannot edit after review has begun
- **Required logs:** Draft submitted event with drafter identity, timestamp.

---

### `safety_review_pending`

- **Purpose:** Reviewer is conducting safety and quality review.
- **Entry condition:** Reviewer opens the draft.
- **Exit condition:**
  - Review identifies issues → transitions to `revision_required` (or `held` / `rejected`)
  - Review passes → transitions to `approved_internal`
- **Allowed actions:**
  - Reviewer scores each category per the quality gate
  - Reviewer runs the relationship-distance extra checklist if applicable
  - Reviewer attaches structured (categorical) findings
- **Blocked actions:**
  - Delivery
  - Drafter cannot edit during review
- **Required logs:** Review started event, review decision event (approve / revise / hold / reject), category scores.

---

### `revision_required`

- **Purpose:** Review identified specific issues. Drafter must revise.
- **Entry condition:** Reviewer decision = revise.
- **Exit condition:** Drafter applies revisions and resubmits → transitions to `draft_generation_pending`.
- **Allowed actions:**
  - Drafter views the structured review findings
  - Drafter revises affected sections
  - Drafter resubmits
- **Blocked actions:**
  - Delivery
  - Reviewer scoring during revision
- **Required logs:** Revision requested event with structured finding categories.

---

### `approved_internal`

- **Purpose:** Review passed. Report is approved for internal archive.
- **Entry condition:** Reviewer + Edward approve.
- **Exit condition:**
  - In internal-only state (no pilot authorized) → terminal at this state; report goes to internal archive
  - In a separately authorized pilot → transitions to `delivery_ready`
- **Allowed actions:**
  - Archive the report internally
  - (Under separately authorized pilot only) prepare for delivery
- **Blocked actions:**
  - Automatic delivery
  - Editing the approved draft
- **Required logs:** Internal approval event with Edward's approval timestamp and category scores.

---

### `delivery_ready` *(conceptual future state)*

- **Purpose:** Report is staged for manual delivery under a separately authorized pilot. **This state does not approve delivery by itself.**
- **Entry condition:**
  - Report is `approved_internal`
  - A pilot has been separately authorized by Edward
  - The user's storage option and consent are still current
- **Exit condition:** Manual delivery action by Edward (or by a delegated reviewer with Edward's per-report approval) → transitions to `delivered`
- **Allowed actions:**
  - View the staged report
  - Initiate manual delivery (under separately authorized pilot)
- **Blocked actions:**
  - Automatic delivery
  - Delivery without per-report manual action
- **Required logs:** Delivery readiness event with pilot reference, timestamp.

**Important:** The existence of this state in the specification does not mean any delivery is currently approved. Delivery requires a separately authorized pilot AND a per-report manual action.

---

### `delivered` *(conceptual future state)*

- **Purpose:** Report has been delivered to the user under a separately authorized pilot.
- **Entry condition:** Manual delivery action completed under separately authorized pilot.
- **Exit condition:** Terminal state (with possible non-use / deletion marking later).
- **Allowed actions:**
  - View delivery confirmation
  - Mark for non-use or deletion if user requests
- **Blocked actions:**
  - Resending without separate authorization
  - Editing a delivered report
- **Required logs:** Delivery event with timestamp and delivery channel (no content in log).

**Important:** This state does not approve user delivery at v0.1. It defines what a delivery record looks like if and when delivery is separately authorized.

---

### `held`

- **Purpose:** Review identified a concern that requires pause before further action.
- **Entry condition:** Reviewer or Edward decides to hold (e.g., safety concern, ambiguous mode, unclear consent).
- **Exit condition:** Concern resolved → returns to `safety_review_pending`; or escalation results in `rejected`.
- **Allowed actions:**
  - Reviewer attaches the structured hold reason
  - Edward escalates or releases the hold
- **Blocked actions:**
  - Delivery
  - Further drafting without resolution
- **Required logs:** Hold event with structured reason category.

**Held user-facing copy (if held during a separately authorized pilot):** neutral copy from `docs/admin-storage-retention-delivery-boundary-v0.1.md` Section 6. Never blame the user.

---

### `rejected`

- **Purpose:** Report cannot proceed.
- **Entry condition:** Reviewer or Edward rejects; or repeated packet failures with no further revision.
- **Exit condition:** Terminal state.
- **Allowed actions:**
  - Record structured rejection reason
  - Notify the user that the report cannot be delivered (neutral copy only)
- **Blocked actions:**
  - Re-entering the workflow with the same packet
  - Delivery
- **Required logs:** Rejection event with structured reason, timestamp.

---

### `deletion_or_non_use_requested`

- **Purpose:** User has requested deletion or non-use of their request, draft, or report.
- **Entry condition:** User request received via the consent surface or contact channel.
- **Exit condition:** Request handled per the storage/non-use policy.
- **Allowed actions:**
  - Mark the request as non-use (exclude from internal improvement review, sample creation)
  - Confirm with the user that the request was received (neutral copy)
  - Apply deletion within technical and policy capability per `docs/detailed-report-storage-and-non-use-policy-v0.1.md`
- **Blocked actions:**
  - Promising instant or permanent deletion beyond capability
  - Using the request as input for any future generation
- **Required logs:** Deletion/non-use request event with structured marker, timestamp. No user free-text in the log.

This state may apply alongside any other state from `request_received` onward.

---

## 3. State Transition Matrix

| From | Allowed transitions to |
|---|---|
| `request_received` | `consent_verified`, `rejected` |
| `consent_verified` | `packet_pending`, `rejected` |
| `packet_pending` | `packet_ready`, `packet_failed`, `rejected` |
| `packet_failed` | `packet_pending`, `rejected` |
| `packet_ready` | `draft_generation_pending`, `packet_pending` (if packet revised) |
| `draft_generation_pending` | `draft_generated`, `rejected` |
| `draft_generated` | `safety_review_pending`, `draft_generation_pending` (drafter withdraw) |
| `safety_review_pending` | `revision_required`, `held`, `rejected`, `approved_internal` |
| `revision_required` | `draft_generation_pending` |
| `held` | `safety_review_pending`, `rejected` |
| `approved_internal` | terminal (internal archive) OR `delivery_ready` (only under separately authorized pilot) |
| `delivery_ready` | `delivered`, `held`, `rejected` |
| `delivered` | terminal |
| `rejected` | terminal |
| `deletion_or_non_use_requested` | does not transition workflow position; applies as a marker on the current state |

---

## 4. Required Log Fields (Universal)

For every state transition:

| Field | Notes |
|---|---|
| `report_id` | Opaque identifier |
| `from_state` | Prior state |
| `to_state` | New state |
| `actor` | Role identifier (Edward / reviewer ID / drafter ID / system) |
| `timestamp` | ISO 8601 |
| `structured_reason` | Categorical, not free text (e.g., `packet_failed.below_min_bullets`) |

Log fields exclude: report content, user identifiers, raw answer text, LINE content, free-text user disclosures, payment info (none exists).

---

## 5. What This Workflow Does Not Authorize

- No automatic transition across the critical path. Every transition requires a role action.
- No delivery without a separately authorized pilot AND a per-report manual delivery action.
- No bypass of `safety_review_pending` for any reason.
- No bypass of the relationship-distance extra checklist when applicable.
- No use of held or rejected reasons for marketing, social proof, or any external communication.

---

> **`delivery_ready` and `delivered` are conceptual future states only. Their existence in this spec does not approve user delivery. No automatic delivery exists. Manual approval is required before any future delivery action.**
