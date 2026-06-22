# Yorisou — Volunteer Pilot Flow v0.1

**Status:** Plan / specification only. Not approval to start.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document does not approve recruitment, pilot start, or implementation. It defines the 15-step flow that would govern a pilot if Edward separately authorizes one.**

---

## 1. Flow Overview

The volunteer pilot, when authorized, follows a 15-step flow from invitation through completion. Each step has an owner, required artifacts, pass/fail conditions, and explicit blocked actions.

The flow runs against the admin generation tool spec (PR #42) and the consent / copy specs (PR #41). It does not override either; it sequences them.

---

## 2. Steps

---

### Step 1 — Candidate invited

- **Owner:** Edward
- **Required artifact:** Eligibility judgment recorded (per `docs/volunteer-pilot-plan-v0.1.md` Section 5); invitation copy from `docs/volunteer-pilot-user-facing-copy-v0.1.md`
- **Pass:** Candidate replies; expresses interest in continuing
- **Fail:** Candidate declines, does not reply within a reasonable window, or Edward decides not to proceed
- **Blocked actions:** Any data collection; any check-in step; any consent recording

---

### Step 2 — Pilot explanation shown

- **Owner:** Edward (in conversation) or the pilot explanation surface (under future authorized implementation)
- **Required artifact:** Pilot explanation copy and boundary copy (`docs/volunteer-pilot-user-facing-copy-v0.1.md`)
- **Pass:** Candidate has read or heard the pilot explanation and confirms they understand: it is unpaid, it is for quality validation, it is not a diagnosis, delivery requires manual review, declining is normal
- **Fail:** Candidate misunderstands a load-bearing point; Edward clarifies and re-confirms, or candidate withdraws
- **Blocked actions:** Consent collection before explanation is confirmed understood; any data use

---

### Step 3 — Consent accepted

- **Owner:** Edward (records); candidate (decides)
- **Required artifact:** Level 1 consent copy from `docs/detailed-report-consent-ui-copy-v0.1.md` Section 3; report boundary copy Section 4; storage option confirmation (Option A only at first cohort); relationship-distance extra warning (not applicable in first cohort)
- **Pass:** Candidate confirms data-use consent, confirms report boundary, and selects Option A as storage option
- **Fail:** Candidate declines any consent block; flow ends without data collection
- **Blocked actions:** Any check-in or packet preparation before consent is recorded
- **Critical rule:** Storage Option A is mandatory at first cohort. Options B and C are not displayed.

---

### Step 4 — Quick check (or allowed test) completed

- **Owner:** Candidate
- **Required artifact:** Completed クイックチェック result (other tests not approved at first cohort)
- **Pass:** Check is completed and a result is produced; `result_archetype`, `confidence_level`, and dimension shape are available
- **Fail:** Check is abandoned mid-flow; no usable input is produced
- **Blocked actions:** Drafting before a valid result exists; using any check result that is not the one the candidate just completed

---

### Step 5 — Input packet created

- **Owner:** Reviewer (Yorisou Agent acting as packet preparer)
- **Required artifact:** v0.2 input packet per `docs/admin-input-packet-builder-spec-v0.1.md` — including `consent_version`, `storage_option`, `main_state_mode` (one of: `decision_clarity`, `rhythm_stabilization`, `fatigue_recovery`, `direction_focus`; **not** `relationship_distance` at first cohort), and all minimum-granularity fields
- **Pass:** All required fields populated; no forbidden content; no `relationship_distance` mode
- **Fail:** Missing fields, forbidden content present, or `relationship_distance` mode selected (rejection: not allowed at first cohort)
- **Blocked actions:** Drafting before packet is submitted to sufficiency check

---

### Step 6 — Packet sufficiency checked

- **Owner:** Admin tool (deterministic checker per `docs/admin-input-packet-builder-spec-v0.1.md` Section 3)
- **Required artifact:** Sufficiency check result (pass / fail with structured failure categories)
- **Pass:** All sufficiency conditions met
- **Fail:** Any sufficiency condition fails → packet returns to Step 5 for revision; if irrecoverable, the request is rejected and the candidate is informed via the neutral hold/decline copy
- **Blocked actions:** Drafting before sufficiency pass

---

### Step 7 — Draft generated internally

- **Owner:** Drafter (Yorisou Agent)
- **Required artifact:** Draft of all 14 sections per Template v0.2; mode-specific writing rules applied; Section 13 verbatim; Section 14 present and non-empty
- **Pass:** All 14 sections complete; character count 8,000–15,000; mode-specific framing applied to Section 7; no forbidden phrases on drafter's self-check
- **Fail:** Section completeness or length fails → return to drafter; structural problem → escalate to reviewer
- **Blocked actions:** Delivery; review scoring before submission

---

### Step 8 — Safety review

- **Owner:** Reviewer (and Edward as primary at first cohort)
- **Required artifact:** Completed review checklist per `docs/admin-review-checklist-v0.1.md` — all 11 categories evaluated; 9 scored categories scored 1–5; structured findings recorded
- **Pass:** Safety = 5, average ≥ 4.2, no category < 3, mode fit ≥ 4, input packet sufficiency ≥ 4, paid-worthiness ≥ 4
- **Fail:** Any threshold not met → route to Step 9 (revision) or `held` / `rejected` per workflow states
- **Blocked actions:** Delivery if Safety ≠ 5; delivery before all thresholds pass; delivery before relationship-distance checklist applied (not applicable at first cohort since `relationship_distance` is excluded)

**Critical rule:** No delivery if Safety ≠ 5.

---

### Step 9 — Revision if needed

- **Owner:** Drafter
- **Required artifact:** Revised draft addressing the structured findings from Step 8
- **Pass:** Revised draft submitted; returns to Step 8
- **Fail:** Revision cannot resolve findings → escalate to Edward for `held` or `rejected` decision
- **Blocked actions:** Delivery during revision

---

### Step 10 — Edward final approval

- **Owner:** Edward (mandatory at first cohort — every report)
- **Required artifact:** Edward's review note recorded; explicit approval recorded with timestamp
- **Pass:** Edward approves the draft as `approved_internal` and authorizes the per-report manual delivery action
- **Fail:** Edward holds or rejects → workflow goes to `held` or `rejected`
- **Blocked actions:** Delivery without Edward's per-report approval

**Critical rule:** Edward must review every delivered first-cohort report. This is non-negotiable for the first cohort.

---

### Step 11 — Manual delivery if approved

- **Owner:** Edward (manual delivery action)
- **Required artifact:** Delivery record (consent_version, storage_option, delivery_timestamp, delivery_channel); the final report text shown to the candidate via the agreed channel
- **Pass:** Candidate receives the report; delivery event logged
- **Fail:** Candidate cannot be reached; report is held internally; non-use marker may be applied if delivery cannot be completed within a reasonable window
- **Blocked actions:** Automatic delivery; delivery if Step 10 did not approve; delivery if consent has lapsed or storage option is unclear

**Critical rules:**
- No automatic delivery
- No delivery if Safety ≠ 5
- No delivery if consent/storage boundary is unclear
- No delivery if packet failed sufficiency

---

### Step 12 — Feedback request

- **Owner:** Edward (in conversation) or feedback surface (under future authorized implementation)
- **Required artifact:** Feedback consent copy and 11-question set per `docs/detailed-report-feedback-consent-v0.1.md`
- **Pass:** Candidate consents to feedback and submits answers (any number including zero — skipping is normal)
- **Fail:** Candidate declines feedback → flow proceeds to Step 14 (outcome log); declining is not a failure of the candidate, only an absence of feedback
- **Blocked actions:** Pressuring the candidate to give feedback; follow-up reminders beyond the initial request

---

### Step 13 — Feedback reviewed

- **Owner:** Edward and Yorisou Agent
- **Required artifact:** Structured feedback record (question-level responses + redacted free comment if any); methodology gap notes if surfaced
- **Pass:** Feedback is read; any methodology gaps are documented; any forbidden categories in free-text are redacted before storage
- **Fail:** Feedback cannot be processed → escalate
- **Blocked actions:** Public use of feedback; testimonial use; sample reuse; model training input

---

### Step 14 — Pilot outcome logged

- **Owner:** Yorisou Agent (operational log)
- **Required artifact:** Structured pilot outcome record per `docs/admin-storage-retention-delivery-boundary-v0.1.md` Section 8 — report_id, state log, category scores, structured findings, delivery outcome, feedback received marker, deletion/non-use markers. No report text, no user identifiers, no free-text content.
- **Pass:** Log written and verifiable
- **Fail:** Log write failure → operational incident; report itself is not affected
- **Blocked actions:** Logging report text or user identifiers; exporting logs outside the admin scope

---

### Step 15 — Deletion / non-use request handled if any

- **Owner:** Edward
- **Required artifact:** Non-use marker recorded; deletion request processed per `docs/detailed-report-storage-and-non-use-policy-v0.1.md` Section 4
- **Pass:** Request is acknowledged with neutral copy; non-use marker applied; deletion completed within technical and policy capability
- **Fail:** Cannot honor full deletion (e.g., operational logs cannot be removed) → use cautious wording from the storage policy; communicate honestly to the candidate
- **Blocked actions:** Promising instant or permanent deletion beyond capability; reusing the report or feedback after non-use is marked

This step may run at any time after Step 1 (a candidate may request non-use during or after delivery).

---

## 3. Flow Diagram

```
1. Candidate invited
        ↓
2. Pilot explanation shown
        ↓
3. Consent accepted (L1 only; Option A only; not relationship_distance)
        ↓
4. Quick check completed
        ↓
5. Input packet created
        ↓
6. Packet sufficiency checked
        ↓
7. Draft generated internally
        ↓
8. Safety review  ── fail ──→ 9. Revision ── back to 8
        ↓ pass (Safety=5, all thresholds met)
10. Edward final approval (mandatory)
        ↓
11. Manual delivery if approved
        ↓
12. Feedback request
        ↓
13. Feedback reviewed
        ↓
14. Pilot outcome logged
        ↓
15. Deletion / non-use handling (any time)
```

---

## 4. Critical Flow Rules (Summary)

- **Edward final approval is required for every delivered first-cohort report.** No exception.
- **No automatic delivery.** Step 11 is a manual action.
- **No delivery if Safety ≠ 5.** Hard block.
- **No delivery if consent or storage boundary is unclear.** Hard block.
- **No delivery if packet fails sufficiency.** Hard block — sufficiency must pass before drafting begins.
- **No recruitment or start approval by this document.** This document defines what the flow looks like; it does not authorize the flow to run.

---

> **This document does not approve recruitment, pilot start, or implementation. It defines the 15-step flow that would govern a pilot if Edward separately authorizes one.**
