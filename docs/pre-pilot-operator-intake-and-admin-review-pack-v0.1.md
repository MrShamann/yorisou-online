# Yorisou — Pre-Pilot Operator Intake and Admin Review Pack v0.1

**Status:** Operating artifact, docs only. Not approval to start.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document does not authorize a pilot, recruitment, or user delivery. It collects the operator intake checklist, admin review pack, scoring table, and pass thresholds in one place for the controller and reviewer to use if a pilot is separately authorized.**

---

## 1. Operator Intake Checklist

Applied by the operator/reviewer before a participant's packet may move to draft generation. Every item must be confirmed in writing. A negative result on any item blocks progression.

### Participant and consent

- [ ] **Participant is adult** (18+)
- [ ] **Trusted volunteer** — personally known to Edward or vouched for by a trusted referrer
- [ ] **Consent accepted** — both consent blocks confirmed (Level 1 data use; report boundary)
- [ ] **Level 1 only** — no higher consent level claimed or used
- [ ] **No sensitive free text submitted** — invitation conversation, eligibility note, or any pre-consent message does not contain names, partner identity, health/crisis detail, payment info, or chat history excerpts

### Source test and mode

- [ ] **Allowed test completed** — the participant has completed an approved Level 1 test
- [ ] **First cohort prioritizes `quick_check`** — the test used is `quick_check`
- [ ] **Other Level 1 tests require Edward approval** — if the test is not `quick_check`, separate Edward approval is recorded before drafting
- [ ] **Mode allowed for first cohort** — `main_state_mode` is one of: `decision_clarity`, `rhythm_stabilization`, `fatigue_recovery`, `direction_focus`
- [ ] **Not `relationship_distance`** — the packet's `main_state_mode` is not `relationship_distance`; relationship_distance is excluded from the first cohort

### Packet and storage

- [ ] **Packet sufficiency ready** — packet meets all v0.2 minimum granularity requirements per `docs/pilot-input-packet-schema-v0.2.md` Section 3
- [ ] **Storage Option A recorded** — packet `storage_option` is `A`; B and C are not used

### Boundaries

- [ ] **No payment** — no payment is requested, mentioned as required, or implied; helper text reflects this
- [ ] **Manual review delay accepted** — participant acknowledged the delivery delay (Step 6 of consent flow)
- [ ] **No LINE history** — no LINE content is in the packet, the conversation, or the reviewer notes
- [ ] **No memory** — no prior session data is in the packet
- [ ] **No raw private text** — no raw answer text or free-text disclosure is in the packet
- [ ] **No model training** — no claim or implication that the packet/draft will be used for training
- [ ] **No public sample reuse** — the request is not framed as producing a shareable sample; no public-use claim is made to the participant

Any unchecked item halts progression to draft generation. The reviewer escalates the gap to Edward.

---

## 2. Admin Review Pack

Applied by the reviewer (and Edward) to every draft. Pass thresholds must be met before `approved_internal`.

### 2.1 Packet sufficiency checklist (re-verify before scoring)

- [ ] All 16 required packet fields present (per `docs/admin-input-packet-builder-spec-v0.1.md` Section 2)
- [ ] `main_state_mode` is one of the allowed first-cohort modes
- [ ] `consent_version` matches an approved version
- [ ] `storage_option` is `A`
- [ ] `answer_pattern_summary` ≥ 10 bullets
- [ ] `dimension_summary` ≥ 5 dimensions
- [ ] `top_3_signals` exactly 3
- [ ] `bottom_3_signals` exactly 3
- [ ] `contradiction_or_tension_map` ≥ 2 tensions
- [ ] `recommendation_seed` ≥ 1
- [ ] `excluded_data` present and explicit
- [ ] `safety_flags` present; no `severity: blocking`
- [ ] `section_emphasis_plan` present and covers all section groups
- [ ] No forbidden content in packet (raw text, LINE, memory, partner identity, payment, account identity for interpretation, unsupported inference)

### 2.2 Mode fit checklist

- [ ] Draft voice and emphasis reflect the selected `main_state_mode`
- [ ] Section 7 internal framing matches mode (Recovery and Stabilization Pattern with mode-specific internal framing; "Stabilization / Momentum Pattern" for `direction_focus`)
- [ ] Sections to emphasize per mode are visibly emphasized
- [ ] No mode collapse — a reader could identify the mode within first 3 sections
- [ ] `Save/Revisit` (Section 14) present, non-empty (never 0%)

### 2.3 Safety checklist

- [ ] Section 13 verbatim per template spec
- [ ] No forbidden phrases (template spec Section 5)
- [ ] No clinical / medical / treatment framing outside Section 13
- [ ] No high-certainty overclaim ("必ず", "確実に", "間違いなく")
- [ ] No future-prediction-as-claim
- [ ] No hidden-truth framing ("本当の核心", "隠された核心", "核心を見抜く", "本当の答え", "真実")
- [ ] No fear-based language / urgency
- [ ] Hedged language present in interpretive sections 2–6
- [ ] No identifiable-person inference
- [ ] No partner identity / partner mind-reading in any section
- [ ] No model-training claim or implication

### 2.4 Recommendation safety checklist

- [ ] No decision replacement (does not decide for the user)
- [ ] No relationship directive (does not tell user to keep/end/deepen/distance)
- [ ] No productivity pressure (no efficiency or output framing)
- [ ] No strict habit prescription (actions remain small, reversible, optional)
- [ ] No clinical / self-treatment framing
- [ ] No hidden-truth framing
- [ ] No payment pressure
- [ ] Section 11 recommends frames, questions, next-step structures — not conclusions, not named third-party services, not URLs, not clinical resources
- [ ] Safety boundary reference present in Section 11

### 2.5 Consent / storage checklist

- [ ] Draft does not exceed the consent the participant gave (Level 1 only)
- [ ] No content drawn from data the participant did not consent to
- [ ] Draft does not assume revisit/save capability beyond Option A
- [ ] Storage option is recorded with the report's operational metadata

### 2.6 Delivery readiness checklist

- [ ] Safety review passed (Safety = 5)
- [ ] All scored thresholds met
- [ ] Mode fit confirmed
- [ ] No `held` or `rejected` decision pending
- [ ] Participant's storage option and consent are still current
- [ ] Manual review owner is named and has signed off
- [ ] Edward final approval recorded with timestamp
- [ ] Per-report manual delivery action is queued (not auto-triggered)

**Important:** Delivery readiness here is workflow readiness. **The delivery copy in `docs/pre-pilot-user-facing-message-pack-v0.1.md` is future approved-pilot copy only. User delivery is not approved by this document. Edward approval is still required.**

---

## 3. Scoring Table

Each draft is scored on the eight base categories plus the relationship-safety-readiness category when applicable. The relationship-safety-readiness category does not apply at first cohort (since `relationship_distance` is excluded), but is retained in the scoring table for forward consistency.

| # | Category | Score (1–5) | Notes |
|---|---|---|---|
| 1 | Depth | ___ | |
| 2 | Personalization | ___ | |
| 3 | Safety | ___ | |
| 4 | Practicality | ___ | |
| 5 | Paid-worthiness | ___ | |
| 6 | Revisit value | ___ | |
| 7 | Mode fit | ___ | |
| 8 | Input packet sufficiency | ___ | |
| 9 | Relationship safety readiness *(N/A at first cohort)* | ___ | Only scored when applicable; first cohort excludes `relationship_distance` |

### Scale

| Score | Meaning |
|---|---|
| 5 — Excellent | Clearly meets the standard; sets the bar |
| 4 — Strong | Meets the standard with minor improvements possible |
| 3 — Acceptable | Meets the standard at baseline; not a model report |
| 2 — Weak | Falls short in noticeable ways; needs revision |
| 1 — Unacceptable | Does not meet the standard; must be rewritten |

---

## 4. Pass Thresholds

A draft passes review when **all** of the following hold:

- [ ] **Safety = 5** (no exception)
- [ ] **Average score ≥ 4.2** across applicable categories
- [ ] **No category below 3**
- [ ] **Mode fit ≥ 4**
- [ ] **Input packet sufficiency ≥ 4**
- [ ] **Paid-worthiness ≥ 4**

If any threshold is not met, the draft is routed to `revision_required`, `held`, or `rejected` per the workflow states in `docs/admin-generation-workflow-states-v0.1.md`.

---

## 5. Edward Final Approval Field

The single explicit field that records Edward's per-report approval. Required for every delivered first-cohort report.

| Field | Value |
|---|---|
| `report_id` | _________________________ |
| `participant_code` | _________________________ |
| `main_state_mode` | _________________________ |
| `category_scores` | Depth __ / Personalization __ / Safety __ / Practicality __ / Paid-worthiness __ / Revisit value __ / Mode fit __ / Input packet sufficiency __ |
| `safety_review_status` | passed / flagged |
| `relationship_distance_extra_checklist` | N/A (first cohort) / pass / fail |
| `edward_decision` | approve / revise / hold / reject |
| `edward_approval_timestamp` | _________________________ |
| `delivery_authorization` | not authorized / authorized per-report |
| `delivery_note` | (optional, structured) |

A blank or `not authorized` `delivery_authorization` field means no delivery action may be taken. Even when authorized per-report, delivery is a manual action under Edward's eye.

---

## 6. Operational Logging

Per `docs/admin-storage-retention-delivery-boundary-v0.1.md` Section 8, every review-related state transition is logged with:

- `report_id`
- `from_state` / `to_state`
- `actor` (role identifier)
- `timestamp`
- `structured_reason` (categorical, not free text)
- Per-category scores (numeric only)
- Relationship-safety-readiness pass/fail per item *(when applicable; N/A at first cohort)*

Logs exclude: report text, draft content, user identifiers, free-text reviewer disclosures.

---

> **This document does not authorize a pilot, recruitment, or user delivery. The delivery copy is future approved-pilot copy only. Edward approval per report is required for every delivered first-cohort report.**
