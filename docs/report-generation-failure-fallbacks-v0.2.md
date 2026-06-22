# Yorisou — Report Generation Failure Modes and Fallbacks v0.2

**Status:** Specification only. Not implementation approval.
**Version:** v0.2
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document is a failure-handling methodology specification. It does not approve user delivery, payment, automation, volunteer pilots, or any external use.**

---

## 1. Purpose

This document specifies the failure modes a v0.2 report generation attempt may encounter, how each is detected, what action is required, and whether to stop, revise, or continue. It also defines the low-confidence fallback response and the standing list of things that must still not happen as a result of any failure-handling decision.

---

## 2. Failure Modes Table

| # | Failure mode | Detection sign | Required action | Stop / Revise / Continue |
|---|---|---|---|---|
| 1 | **Input packet too thin** | Packet fails minimum granularity per `docs/pilot-input-packet-schema-v0.2.md` Section 3 (< 10 answer-pattern bullets, < 5 dimensions, missing top/bottom signals, < 2 tensions, missing recommendation_seed, missing excluded_data, missing safety_flags, missing section_emphasis_plan) | Respond with low-confidence fallback copy (Section 3 of this doc); revise the packet | **Stop generation** |
| 2 | **Wrong `main_state_mode`** | The mode does not match the dimension signals, the answer-pattern summary, or the tension map. Detected at packet review or during drafting when the mode's writing rules produce dissonance with the data. | Re-examine packet signals; if a different mode fits, update packet and re-run mode-confusion guard from `docs/main-state-mode-rules-v0.2.md` Section 5 | **Stop generation; revise packet** |
| 3 | **Fatigue drift** | A report in `direction_focus`, `decision_clarity`, or `rhythm_stabilization` mode reads as fatigue/recovery copy in Sections 2, 3, or 7. Mode fit < 4. | Re-draft drift-affected sections in the correct mode voice; verify Section 7 internal framing matches mode | **Revise** |
| 4 | **Productivity drift** | Action plans (Sections 8, 9) read as efficiency improvements, output increases, habit stacks, or rigid schedules. Sections frame action as performance. | Re-draft action plans as small, reversible, optional; remove all productivity / output / efficiency language; restate as observation-first | **Revise** |
| 5 | **Relationship overreach** | Section 4 or Section 11 recommends a specific relationship action, implies a specific person, or directs the user to keep/end/deepen/distance a named relationship. Violates universal recommendation safety rule "no relationship directive". | Re-draft to remove identifiable references and directive language; convert to response-tempo / care-without-immediate-reply framing | **Revise — Safety blocker if not resolved** |
| 6 | **Recommendation overreach** | Section 11 names specific products, services, URLs, or clinical resources; or recommends a conclusion rather than a frame/question/probe. Violates universal recommendation safety rules. | Re-draft Section 11 to topic-area framing with neutral hedged language; remove all specific third-party references | **Revise — Safety blocker if not resolved** |
| 7 | **Generic template language** | Personalization < 4. Sections read as persona-typical copy with little reference to the specific packet (top signals, tensions, recovery profile, social pressure profile). | Examine input packet sufficiency first. If packet is thin, treat as failure mode 1. If packet is sufficient, re-draft personalization sections (1, 2, 4, 7, 8) with explicit reference to packet specifics. | **Revise** (or escalate to failure mode 1 if packet is the cause) |
| 8 | **Unsafe inference** | A section claims something beyond what the packet supports — invented motivations, invented relationships, invented history, future predictions framed as certainty, identifiable-person inference, or clinical inference. | Remove the unsupported claim; re-draft with hedged language tied to actual packet signals; if the inference came from a packet field that should not have been used (e.g., implied from `reviewer_notes`), surface as schema gap | **Revise — Safety blocker if not resolved** |
| 9 | **Low confidence** | `confidence_level` is `"low"` and the report attempts L2 or L3 personalization, or sections 3–6 read with high certainty despite low confidence. | Apply Level 1 personalization only; shorten sections 6 and 11 to general-range copy; add explicit low-confidence note in section 1; if the report cannot meet rubric at L1 with the available signal, return low-confidence fallback copy | **Revise — may escalate to Stop** |
| 10 | **Reviewer workload too high** | Per-report review time exceeds sustainable capacity for Edward; batch cadence cannot be maintained without compromising review depth | Reduce batch size; pause the batch; surface as operational gap; do not lower review depth to maintain cadence | **Stop the batch; do not continue** |

---

## 3. Low-Confidence Fallback Copy

When a packet fails minimum granularity (failure mode 1) or when confidence is too low to produce a personalized report at v0.2 quality (failure mode 9 escalated), the response is the following copy, exactly:

```
この入力情報だけでは、安全で十分に具体的な詳細レポートを作成できません。回答パターン、主な信号、除外データ、推薦の種を追加してください。
```

This response is internal — it is returned to the packet preparer, not delivered to any user. No partial draft accompanies this response. No generic-sounding draft is produced as a stand-in.

When the packet is revised and resubmitted, the generation attempt restarts from the beginning. The fallback response does not move the report into a "draft pending" state — it returns the report to packet preparation.

---

## 4. Detection and Escalation Flow

```
Input packet submitted
      ↓
Minimum granularity check → FAIL → Failure mode 1 → return fallback copy (STOP)
      ↓ PASS
Mode-confusion guard → FAIL → Failure mode 2 → revise packet (STOP)
      ↓ PASS
Drafting begins
      ↓
Per-section drift checks during drafting → drift detected → Failure modes 3/4/5/6/8 → revise (REVISE)
      ↓
Section completeness check → FAIL → return to drafter (REVISE)
      ↓
Safety review → flag → Failure modes 5/6/8 (Safety blocker if unresolvable) (REVISE / STOP)
      ↓
Consistency review → mode collapse / generic / unsafe inference → Failure modes 3/7/8 (REVISE)
      ↓
Quality scoring → threshold not met → revise affected category (REVISE)
      ↓
Edward review → approve / revise / hold
      ↓
Approved → internal archive (or, only if separately authorized, internal-tester delivery)
```

Reviewer workload (failure mode 10) is a meta-failure that can pause the entire flow regardless of where any individual report is.

---

## 5. What Must Still Not Happen

No failure-handling decision, no fallback path, and no revision of a failed report may authorize any of the following. These remain prohibited regardless of operational pressure:

- **No user delivery approval** — failure-handling does not create a delivery path
- **No payment approval** — no payment is implemented or authorized
- **No automation approval** — no automatic generation pipeline is authorized
- **No volunteer pilot approval** — failure-handling does not justify recruiting volunteers to "test the fallback"
- **No LINE history use** — raw LINE message content is not collected, summarized, or used
- **No memory use** — Level 2 and Level 3 memory are not active
- **No raw private free text use** — no raw answer text, no personal disclosures, no free-text user inputs
- **No OpenClaw runtime access approval** — OpenClaw is not active for generation
- **No model training approval** — failed drafts, fallback responses, and reviewer notes are not used to train or fine-tune models
- **No external sharing** — failure outputs and reviewer notes are not shared outside Edward + Yorisou Agent
- **No dashboard implementation** — failure events may produce aggregate operational counts under safe logging rules, but no dashboard surface is built
- **No account/report storage** — failed drafts are not stored in any user-facing system; internal archive is internal only
- **No report entitlement** — no entitlement records are created when a report fails or succeeds
- **No paid launch** — completion of failure handling does not move the product toward paid launch

Every one of these requires a separate, explicit authorization from Edward, not derivable from any outcome described in this document.

---

> **This document is a failure-handling methodology specification. It does not approve user delivery, payment, automation, volunteer pilots, or any external use.**
