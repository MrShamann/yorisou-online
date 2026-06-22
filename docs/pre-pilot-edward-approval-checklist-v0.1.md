# Yorisou — Pre-Pilot Edward Approval Checklist v0.1

**Status:** Operating artifact, docs only. Not approval to start.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **Merging this document does not authorize pilot start. Pilot start remains separately gated and requires explicit Edward authorization recorded against the items below.**

---

## 1. Purpose

This checklist is the single observable surface against which Edward decides whether the volunteer pilot is authorized to begin. It collects every item that must be approved, completed, or confirmed before any invitation may be sent.

Each item must be marked **approved** by Edward (or **confirmed** for fixed posture items) before the pilot is considered authorized. A single unapproved item is sufficient to keep the pilot blocked.

The checklist may be filled in a separate operational tracker. The text of the items below is canonical; the tracker references this version of the document.

---

## 2. Checklist

### Cohort scope

- [ ] **Cohort size: 3** — approved as operational default for first cohort
- [ ] **Participant source** — named pool of trusted volunteers documented in writing; Edward has applied the eligibility/exclusion judgment
- [ ] **Japanese first** — confirmed; no EN pilot at this phase
- [ ] **Cohort recruitment timing window** — start and end dates documented

### Copy approval

- [ ] **Invitation copy** — every block in `docs/pre-pilot-volunteer-invitation-and-consent-copy-v0.1.md` Sections 1–8 approved by Edward
- [ ] **Consent copy** — every block in `docs/pre-pilot-volunteer-invitation-and-consent-copy-v0.1.md` Sections 9–13 approved by Edward
- [ ] **Delivery copy (future-use)** — every block in `docs/pre-pilot-user-facing-message-pack-v0.1.md` Sections 1–17 approved by Edward; delivery copy approval does not by itself authorize delivery
- [ ] **Feedback form** — feedback consent text, sensitive-details warning, 11 question blocks, optional payment-interest question, thank-you message in `docs/pre-pilot-user-facing-message-pack-v0.1.md` Sections 13–17 approved
- [ ] **Non-use / deletion path** — copy in `docs/pre-pilot-volunteer-invitation-and-consent-copy-v0.1.md` Section 8 and `docs/pre-pilot-user-facing-message-pack-v0.1.md` Section 6 approved; the operational process to handle each request is defined (who responds, in what window, with what wording)

### Storage and consent posture

- [ ] **Option A mandatory** — confirmed for every first-cohort participant
- [ ] **No Option B** — confirmed not offered, not displayed, not selectable
- [ ] **No Option C** — confirmed not offered, not displayed, not selectable

### Mode scope

- [ ] **Allowed modes** — `decision_clarity` / `rhythm_stabilization` / `fatigue_recovery` / `direction_focus` confirmed as the only modes allowed in first cohort
- [ ] **`relationship_distance` excluded** — confirmed not included in first cohort; future inclusion requires separate Edward approval after first cohort completes with no consent/safety/delivery issues

### Source test

- [ ] **First cohort prioritizes `quick_check`** — confirmed
- [ ] **Any non-`quick_check` Level 1 test explicitly approved** — if a non-`quick_check` test is to be used for any first-cohort participant, Edward has approved that test in writing before invitation

### Operational artifacts

- [ ] **Admin review checklist** — `docs/pre-pilot-operator-intake-and-admin-review-pack-v0.1.md` Section 2 reviewed and approved
- [ ] **Pass thresholds** — `docs/pre-pilot-operator-intake-and-admin-review-pack-v0.1.md` Section 4 confirmed (Safety = 5, average ≥ 4.2, no category below 3, mode fit ≥ 4, input packet sufficiency ≥ 4, paid-worthiness ≥ 4)
- [ ] **Stop / hold card** — `docs/pre-pilot-outcome-log-and-stop-hold-card-v0.1.md` Section 2 reviewed; default action ("Hold. Do not deliver. Review with Edward/controller.") accepted

### Stop conditions

- [ ] **Stop conditions** — the full list in `docs/pre-pilot-outcome-log-and-stop-hold-card-v0.1.md` Sections 2 and 4 reviewed and approved as the operating posture for first cohort

### Manual review owner

- [ ] **Manual review owner named** — primary reviewer (Edward at v0.1) named in writing
- [ ] **Backup reviewer named** — backup reviewer named in writing; escalation path defined
- [ ] **Reviewer's per-report time expectation documented** — sustainable capacity confirmed at cohort cadence

### Per-report approval posture

- [ ] **Edward final approval for every report** — confirmed as non-negotiable for first cohort; no batch auto-approval

### Boundaries (confirmation, not negotiation)

- [ ] **No payment** — confirmed: no payment, no Stripe, no checkout, no entitlement, no pricing displayed
- [ ] **No automation** — confirmed: no automatic state transitions on critical path; no automatic delivery
- [ ] **No LINE history use** — confirmed
- [ ] **No memory use** — confirmed: Level 2 and Level 3 remain deferred
- [ ] **No raw private free text use** — confirmed
- [ ] **No model training** — confirmed: no use of inputs, drafts, or feedback for training/fine-tuning
- [ ] **No public sample reuse** — confirmed: prohibited by default; separate explicit named permission + anonymization review required if ever changed
- [ ] **No OpenClaw runtime access** — confirmed: OpenClaw not active for generation in this pilot
- [ ] **No implementation gaps** — confirmed: the operational handling of every step is achievable without requiring unbuilt admin tooling, dashboard, or other surface; if a step requires a surface that does not exist, an operator-mediated workaround is documented before pilot start

### Explicit authorizations

- [ ] **Explicit pilot-start authorization** — Edward records explicit, dated, signed authorization to begin the pilot
- [ ] **Explicit recruitment authorization** — Edward records explicit, dated authorization for the named recruitment pool and timing window
- [ ] **Explicit delivery authorization for first cohort reports** — Edward records explicit, per-report authorization to deliver, recorded at the per-report Edward approval field in `docs/pre-pilot-operator-intake-and-admin-review-pack-v0.1.md` Section 5

---

## 3. Approval Decision Surface

Until every item above is in the **approved** or **confirmed** state, the pilot is **blocked**.

When every item is in the approved/confirmed state, Edward records the explicit pilot-start authorization, which authorizes recruitment to begin per the documented timing window. Per-report delivery authorizations are recorded individually as each report passes review.

Withdrawing any approved item (e.g., a copy block is later found inadequate, the reviewer-of-record becomes unavailable, or a boundary item is found to have slipped) returns the corresponding item to **pending** and blocks further pilot operation until the item is re-approved.

---

## 4. Approval Tracking Template

For operational use when the checklist is being filled. This template is human-readable; no implementation is implied.

| Item | State | Approver | Approval date | Notes |
|---|---|---|---|---|
| Cohort size 3 | pending / approved | Edward | YYYY-MM-DD | |
| Participant source | pending / approved | Edward | YYYY-MM-DD | |
| Japanese first | pending / approved | Edward | YYYY-MM-DD | |
| Recruitment timing window | pending / approved | Edward | YYYY-MM-DD | |
| Invitation copy | pending / approved | Edward | YYYY-MM-DD | |
| Consent copy | pending / approved | Edward | YYYY-MM-DD | |
| Delivery copy (future-use) | pending / approved | Edward | YYYY-MM-DD | |
| Feedback form | pending / approved | Edward | YYYY-MM-DD | |
| Non-use / deletion path | pending / approved | Edward | YYYY-MM-DD | |
| Option A mandatory | pending / confirmed | Edward | YYYY-MM-DD | |
| No Option B | pending / confirmed | Edward | YYYY-MM-DD | |
| No Option C | pending / confirmed | Edward | YYYY-MM-DD | |
| Allowed modes | pending / approved | Edward | YYYY-MM-DD | |
| `relationship_distance` excluded | pending / confirmed | Edward | YYYY-MM-DD | |
| First cohort prioritizes `quick_check` | pending / approved | Edward | YYYY-MM-DD | |
| Non-`quick_check` test approval | n/a / approved | Edward | YYYY-MM-DD | If applicable |
| Admin review checklist | pending / approved | Edward | YYYY-MM-DD | |
| Pass thresholds | pending / confirmed | Edward | YYYY-MM-DD | |
| Stop / hold card | pending / approved | Edward | YYYY-MM-DD | |
| Stop conditions | pending / approved | Edward | YYYY-MM-DD | |
| Manual review owner named | pending / approved | Edward | YYYY-MM-DD | |
| Backup reviewer named | pending / approved | Edward | YYYY-MM-DD | |
| Per-report time expectation | pending / confirmed | Edward | YYYY-MM-DD | |
| Edward final approval for every report | pending / confirmed | Edward | YYYY-MM-DD | |
| No payment | pending / confirmed | Edward | YYYY-MM-DD | |
| No automation | pending / confirmed | Edward | YYYY-MM-DD | |
| No LINE history use | pending / confirmed | Edward | YYYY-MM-DD | |
| No memory use | pending / confirmed | Edward | YYYY-MM-DD | |
| No raw private free text use | pending / confirmed | Edward | YYYY-MM-DD | |
| No model training | pending / confirmed | Edward | YYYY-MM-DD | |
| No public sample reuse | pending / confirmed | Edward | YYYY-MM-DD | |
| No OpenClaw runtime access | pending / confirmed | Edward | YYYY-MM-DD | |
| No implementation gaps | pending / confirmed | Edward | YYYY-MM-DD | |
| Explicit pilot-start authorization | pending / approved | Edward | YYYY-MM-DD | |
| Explicit recruitment authorization | pending / approved | Edward | YYYY-MM-DD | |
| Explicit delivery authorization (per report) | per report | Edward | per report | recorded per report at admin review pack Section 5 |

---

> **Merging this document does not authorize pilot start. Pilot start remains separately gated and requires explicit Edward authorization recorded against the items above.**
