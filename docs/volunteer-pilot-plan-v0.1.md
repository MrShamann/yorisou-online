# Yorisou — Volunteer Pilot Plan v0.1

**Status:** Plan / specification only. Not approval to start.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document does not approve the pilot start, recruitment, user delivery, implementation, automation, payment, OpenClaw runtime access, LINE history use, memory use, model training, entitlement, dashboard implementation, or public sample reuse. It defines the plan that would govern a pilot if Edward separately authorizes one.**

---

## 1. Why Volunteer Pilot Plan Is Needed

The methodology stack — Template v0.2, packet schema v0.2, mode rules, quality gate, failure fallbacks, consent governance, consent copy v0.1, storage policy v0.1, feedback consent v0.1, relationship-distance copy v0.1, the volunteer-pilot readiness gate, and the admin generation tool spec — collectively define everything except *what happens when a real user outside the internal team reads a Yorisou 詳細レポート*.

### Internal pilots are not enough

Internal real-input pilots validate the methodology, packet sufficiency, mode rules, and review workflow. They cannot validate:
- How a non-internal reader experiences the consent flow
- Whether a non-internal reader correctly understands the report boundary (not diagnosis, not advice, not future prediction)
- Whether the report's tone reads as supportive vs. clinical / generic / manipulative to someone outside the methodology team
- Whether the safety note is noticed and absorbed
- Whether the user feels respected during the manual review wait
- Whether feedback collection works as designed without over-collecting sensitive content

### Real-user reading feedback is needed

To know whether the 詳細レポート is paid-worthy in the real world without being harmful or misleading, the report must be read by people who have not built the methodology. The volunteer pilot is the planned mechanism for that — when it is approved.

### Volunteer pilot remains blocked until Edward explicitly approves

This document defines the plan. Reading or merging it does not start the pilot. The pilot does not start until:
- The volunteer-pilot readiness gate (PR #41 / `docs/volunteer-pilot-consent-readiness-gate-v0.1.md`) is fully met
- Edward separately authorizes the start
- The cohort source, recruitment wording, and timing window are explicit
- The manual review owner and backup are named in writing

### Payment remains blocked

The volunteer pilot, when authorized, is unpaid. No price, no purchase flow, no payment of any kind.

### Automation remains blocked

The volunteer pilot uses the manual / semi-manual workflow from the admin generation tool spec. No automatic generation, no automatic delivery, no automatic state transitions on the critical path.

---

## 2. Pilot Objective

The pilot, if authorized, exists to learn:

| # | Objective | Question |
|---|---|---|
| 1 | **Comprehension** | Does the volunteer understand what the report is and is not before agreeing? |
| 2 | **Perceived accuracy** | Does the report read as reflective of the volunteer's own current state? |
| 3 | **Comfort / safety** | Does the volunteer feel respected, not surveilled, diagnosed, or pressured? |
| 4 | **Revisit value** | Would the volunteer return to the report in a week or a month? |
| 5 | **Length and density** | Is the 14-section, 8,000–15,000-character form sustainable to read? |
| 6 | **Manual review workload** | Is Edward's per-report review time sustainable at small cohort scale? |
| 7 | **Consent flow clarity** | Did the volunteer understand each consent block before they accepted? |
| 8 | **Feedback usefulness** | Does the feedback form produce actionable methodology improvements without over-collecting sensitive content? |

---

## 3. What This Pilot Is Not

| Not | Why |
|---|---|
| **Sales test** | No price, no purchase, no conversion goal. The pilot is unpaid. |
| **Paid product launch** | Paid launch requires separate pricing, refund, and delivery decisions still unresolved. |
| **Medical / therapy / diagnostic test** | Reports are not diagnoses. The pilot does not collect or evaluate clinical outcomes. |
| **Model training** | Reports, packets, drafts, and feedback are not used to train or fine-tune AI models. |
| **LINE / memory personalization test** | LINE content is not used; memory is not active. |
| **Automation test** | The pilot uses the manual / semi-manual workflow. No automatic generation or delivery is exercised. |

---

## 4. Pilot Scope

### Participants

- **Trusted volunteers only.** Recruited by Edward from a known, hand-selected source. No public sign-up. No external advertisement.
- **Japanese first.** No EN pilot unless separately approved (the EN template is not yet specified).

### Cohort size

- **Recommended first cohort: 3 people.** This is the operational default. Three is enough to surface comprehension and consent issues without overloading manual review.
- **Possible expansion to 3–5** only after the first 3 reports pass safely (no safety incidents, no consent confusion, no delivery issues).
- **Maximum first cohort: 10 people.** Hard ceiling. Reaching 10 is not a goal; it is a cap.

### Consent and data scope

- **Level 1 only.** Higher consent levels remain out of scope at first cohort.
- **No LINE history.** Raw LINE messages and LINE summaries are not used.
- **No memory.** Level 2 and Level 3 memory remain deferred.
- **No payment.** The pilot is unpaid.
- **No automation.** Manual / semi-manual workflow only.

### Source test

- **quick_check-based detailed reports first.** The first cohort uses the standard クイックチェック as the source test.
- Other tests (e.g., relationship_fatigue, love_distance) can be considered after the first cohort completes safely.

### Allowed first-cohort modes

The first cohort is restricted to safer modes:

- `decision_clarity`
- `rhythm_stabilization`
- `fatigue_recovery` or `direction_focus`

These four modes have lower interpretive risk than `relationship_distance` and are appropriate for early external testing.

### relationship_distance

- **Not included in first cohort.**
- Can be considered only after the first cohort has had no consent, safety, or delivery issues.
- Requires the relationship-distance extra checklist (`docs/relationship-distance-extra-safety-copy-v0.1.md` Section 5; `docs/admin-review-checklist-v0.1.md` Section 4) and a separate Edward approval before being added to any future cohort.
- The question of whether a two-person review is required for `relationship_distance` remains an open decision — it is not yet a hard requirement and is not decided in this document.

### Storage

- **Option A is mandatory** for all first-cohort participants. No exceptions.
- **Option B and Option C are not allowed** in the first cohort. They are not offered, displayed, or selectable.

### Review

- **Edward must review every delivered first-cohort report** before delivery and after delivery feedback is collected.
- The standard review checklist (`docs/admin-review-checklist-v0.1.md`) applies.
- Per-report manual delivery action is required; no batch auto-delivery.

---

## 5. Participant Eligibility and Exclusion

### Eligibility

A candidate is eligible for first-cohort consideration when all of the following hold:

- Personally known to Edward or to a trusted referrer Edward has vouched for
- Able to read Japanese at adult-general level
- Capable of giving informed consent (no surrogate consent at first cohort)
- Willing to participate without payment and without expectation of payment
- Willing to complete the クイックチェック honestly and to read the resulting report
- Willing to give feedback (or to skip feedback without disadvantage)
- Able to complete the flow on a device with a typical browser

### Exclusion

A candidate is excluded from the first cohort if any of the following apply:

- Currently in acute crisis (mental health, safety, or otherwise) — Yorisou is not the right tool in crisis
- Currently in or recently exiting a coercive or dangerous relationship — `relationship_distance` mode is excluded from this cohort and the broader sensitivity is not appropriate
- Currently receiving therapy or treatment where they have indicated the introduction of a self-understanding report could complicate care without first consulting their provider
- Under 18
- Has a financial, professional, or evaluative power relationship with Edward that would compromise their ability to decline freely

Eligibility and exclusion are assessed by Edward before invitation. The candidate is not asked invasive eligibility questions; Edward makes the judgment from existing knowledge of the candidate. Where unsure, Edward defers and does not invite.

---

## 6. Final Recommendation

- **Docs-only PR allowed.** This document and its sibling pilot-plan documents may be merged as docs to `main`.
- **Pilot start is not approved.** Reading or merging these docs does not authorize the pilot to begin.
- **Recruitment is not approved.** No invitation may be sent based solely on the merge of these docs.
- **Implementation is still blocked.** The admin tooling, consent UI, report delivery surface, and feedback form are not authorized by this document.

A separate Edward authorization is required to begin recruitment. That authorization requires the readiness gate (PR #41) to be fully met and the cohort, recruitment source, and timing window to be explicit.

---

> **This document does not approve the pilot start, recruitment, user delivery, implementation, automation, payment, OpenClaw runtime access, LINE history use, memory use, model training, entitlement, dashboard implementation, or public sample reuse.**
