# Yorisou 詳細レポート — Semi-Manual First Batch Operations v0.1

**Status:** Specification only. Approved for documentation. Not approved for implementation.  
**Version:** v0.1  
**Controller:** Edward (final approver)  
**Methodology owner:** Yorisou Agent  
**Last updated:** 2026-06-21

---

> **Payment, Stripe, checkout, entitlement, and automatic report generation are out of scope.**

---

## 1. Overview

This document describes the operations procedure for producing the first real Yorisou 詳細レポート reports in two phases:

- **Phase 1 — Internal / Free Pilot (Reports 1–5):** No charge. Internal testers or consenting opt-in users. Edward reviews each report before delivery.
- **Phase 2 — Semi-Manual Pilot (Reports 6–20):** No automatic generation. Yorisou Agent drafts with optional backend assist. Edward spot-checks. Delivery to a small consenting cohort. Pricing and payment still not active.

Automatic generation and paid delivery are out of scope until quality is confirmed and all unresolved decisions are made (see Section 9).

---

## 2. Phase 1 — Internal / Free Pilot (Reports 1–5)

### Eligibility

- Internal team members or explicitly consenting volunteer testers
- Must have completed a クイックチェック session with a stored result
- No payment or charge under any circumstances in Phase 1

### Procedure

1. Obtain explicit verbal or written consent from tester to receive a draft report
2. Collect input signals (see Section 4)
3. Yorisou Agent drafts all 14 sections manually
4. Edward reviews draft against the quality and safety checklists in the template spec
5. Edward approves or requests revision
6. Deliver to tester via agreed channel (in-person review, LINE, or document share)
7. Collect tester feedback (see Section 8)
8. Log event to DTE event store: `report_delivered`, `generationMethod: "manual"`, `safetyReviewStatus: "passed"`

### Pass Criteria for Phase 1

- All 5 reports reviewed and approved by Edward
- No safety flags on any delivered report
- At least 3 tester feedbacks collected
- Template spec validated as workable from production experience
- No forbidden phrases found in delivered reports

---

## 3. Phase 2 — Semi-Manual Pilot (Reports 6–20)

### Eligibility

- Consenting users who have completed クイックチェック
- Users may be recruited from the intent-save cohort on /report-preview (localStorage signal)
- No automatic recruitment — each user must be individually consented before receiving a report
- No payment in Phase 2 unless Edward explicitly authorizes a paid micro-cohort

### Procedure

1. Confirm user consent (see consent wording — unresolved at v0.1, see Section 9)
2. Collect input signals (see Section 4)
3. Yorisou Agent drafts sections using methodology from template spec
4. Optional: OpenClaw / backend agent system assists with structured section generation (requires separate authorization)
5. Yorisou Agent reviews and corrects draft
6. Safety/Governance Agent runs checklist review
7. Edward spot-checks minimum 1 in 5 reports
8. Deliver to user
9. Collect feedback (see Section 8)
10. Log to dashboard

### Scale-Up Condition

Phase 2 may scale beyond 20 reports only after:
- Edward confirms quality standard is consistently met
- All unresolved decisions in Section 9 are made
- Consent wording is finalized
- Delivery mode is confirmed

---

## 4. Input Collection Procedure

### Step 1 — Retrieve Check-in Result

From the user's session or stored result:
- `resultId`
- `overlayId`
- `confidenceBand`
- Full answer payload (if accessible)

If full answer payload is not available, use result public name and overlay public line as minimum inputs.

### Step 2 — Retrieve Persona Cluster

From the DTE scoring output:
- `personaClusterId`
- Top 3 dimension scores
- Low-confidence dimension flags

### Step 3 — Confirm Locale

Confirm report language with user. Default: `ja`. EN report template is not yet specified at v0.1.

### Step 4 — Create Report Input Record

Assemble the input record into a working document:

```
Report input — [user_id or tester_label]
Date: [YYYY-MM-DD]
resultId: [value]
overlayId: [value]
confidenceBand: [low|medium|high]
personaClusterId: [value]
topDimensions: [d1, d2, d3]
locale: ja
consentConfirmed: yes
generationMethod: manual | assisted
```

---

## 5. Yorisou Agent Draft Procedure

### Preparation

- Read the input record fully
- Review template spec sections 4 and 9 (section definitions and example)
- Identify the personalization level (L1, L2, or L3) based on confidence band
- Select the appropriate template variant

### Drafting

- Draft sections in order (1 → 14)
- Apply phrase rules from Section 5 of the template spec
- Hedge all interpretation sections
- Write section 13 verbatim from the fixed text
- Track running character count

### Self-Review Before Handoff

- [ ] All 14 sections present
- [ ] Character count within 8,000–15,000
- [ ] Section 13 verbatim match
- [ ] No forbidden phrases
- [ ] No clinical language
- [ ] No certainty overclaims
- [ ] Safety reference in section 11

---

## 6. Optional Backend Draft Support

If OpenClaw / backend agent system is used for structured section generation:

- Yorisou Agent provides input record and section-specific prompts
- Backend system generates candidate text per section
- Yorisou Agent reviews every section and corrects before Safety review
- Yorisou Agent is accountable for the content quality, not the backend system
- Requires separate authorization from Edward before first use
- Not active at v0.1

---

## 7. Edward Review Procedure

### Required For

- All Phase 1 reports (reports 1–5)
- Minimum 1 in 5 Phase 2 reports (spot-check)
- Any report with a safety flag
- Any report where confidenceBand is "low"
- Any report generated using backend system (first use)

### Review Checklist

- [ ] Report reads as self-understanding content, not diagnosis or prescription
- [ ] Tone is calm and non-urgent throughout
- [ ] Section 13 is present and verbatim
- [ ] Action plans are small and optional
- [ ] No hidden-truth or fear-based framing
- [ ] Personalization feels natural, not mechanical
- [ ] Length and section structure confirmed
- [ ] Safety reference in section 11 present

### Review Outcome

- **Approve:** Proceed to delivery
- **Revise:** Return to Yorisou Agent with specific correction notes
- **Hold:** Do not deliver; escalate if systemic issue found

---

## 8. Safety / Governance Review Procedure

Completed before every report in Phase 1 and for all Phase 2 reports until spot-check cadence is confirmed.

Run the Safety/Governance checklist from Section 8 of the template spec.

If any item fails:
- Flag the specific section and phrase
- Route to Yorisou Agent for correction
- Re-run checklist after correction
- If issue recurs, route to Edward before further drafting

---

## 9. Final Delivery Boundary

A report may be delivered only when all of the following are true:

- [ ] All 14 sections present and non-empty
- [ ] Character count within bounds
- [ ] Section 13 verbatim
- [ ] No forbidden phrases
- [ ] Safety/Governance checklist passed
- [ ] Edward approved (Phase 1) or spot-check passed (Phase 2)
- [ ] User consent confirmed
- [ ] Delivery mode decided for this report

---

## 10. Dashboard Logging Fields

Log the following to the DTE event store after each delivered report:

| Field | Value |
|---|---|
| `event` | "report_delivered" |
| `reportId` | Unique report ID |
| `resultId` | Source check-in result ID |
| `personaClusterId` | Top persona cluster |
| `confidenceBand` | low / medium / high |
| `generationMethod` | manual / assisted / automated |
| `safetyReviewStatus` | passed / flagged |
| `reviewedBy` | Reviewer ID (Edward / Safety Agent) |
| `deliveredAt` | ISO 8601 timestamp |
| `locale` | ja / en |
| `phaseLabel` | "pilot_phase_1" / "pilot_phase_2" |

Do NOT log:
- Full report text
- User personal information beyond session/result ID
- Answer payload
- Payment or pricing information (not applicable at this phase)

---

## 11. User Feedback Questions

After delivery, ask the user the following questions (verbally or via simple form):

1. このレポートを読んで、今の状態が少し整理できましたか？（はい / まあまあ / いいえ）
2. どのセクションが一番役に立ちましたか？（自由記述）
3. 読んでいて不快に感じた部分はありましたか？（はい → どの部分か / いいえ）
4. またこのようなレポートを読みたいと思いますか？（はい / まあまあ / いいえ）
5. 自由なコメントがあればお聞かせください。

Feedback is collected by Yorisou Agent or Edward directly. No automated feedback collection at Phase 1–2.

---

## 12. Failure / Fallback Handling

### Generation Failure

If Yorisou Agent cannot draft a section that meets quality standards:
- Leave section placeholder
- Flag for Edward
- Do not deliver partial report
- Reschedule or defer to next batch

### Safety Flag Not Resolved

If Safety/Governance checklist cannot be cleared:
- Do not deliver report
- Return to Yorisou Agent for full re-draft of flagged sections
- If unresolvable, inform user that report is delayed
- Log `report_generation_failed` to dashboard

### User Cannot Be Reached for Delivery

If delivery channel is unavailable:
- Hold report in secure local storage (not on server) until contact confirmed
- Do not send to unconfirmed contact methods
- If undeliverable after reasonable period, log and discard (do not retain)

### Low Confidence Result

If `confidenceBand` is "low":
- Route to Edward before drafting
- Use Level 1 personalization only
- Shorten sections 6 and 11
- Add low-confidence note in section 1

---

## 13. Unresolved Decisions (v0.1)

The following decisions are required before any paid delivery or scaled operation. All require Edward approval.

| Decision | Status | Notes |
|---|---|---|
| **First tier / product name** | Unresolved | What do users see this product called? |
| **Price** | Unresolved | Edward sets. No price hardcoded anywhere. |
| **Delivery SLA** | Unresolved | How long from intent to delivery? Same day? 3–5 days? |
| **Report storage** | Unresolved | In-app only? Server-side? LINE? Downloadable? |
| **Consent wording** | Unresolved | What exactly does user consent to, in plain Japanese? |
| **Downloadable or not** | Unresolved | Can user download report as PDF or text? |
| **Full text in dashboard** | Unresolved | Does Edward see the full report text in the admin dashboard? |
| **Refund / failure policy** | Unresolved | What happens if a paid report is not delivered? |
| **EN report template** | Unresolved | English template not yet specified. |
| **Repeat check-in handling** | Unresolved | If user does check-in again, does prior report remain valid? |

---

> **Payment, Stripe, checkout, entitlement, and automatic report generation are out of scope.**
