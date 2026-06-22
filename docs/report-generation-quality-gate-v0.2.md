# Yorisou — Report Generation Quality Gate v0.2

**Status:** Specification only. Not implementation approval.
**Version:** v0.2 (supersedes rubric v0.1 for v0.2-generated reports)
**Controller:** Edward (final approver and primary scorer)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document is a quality methodology specification. It does not approve user delivery, payment, automation, volunteer pilots, or any external use.**

---

## 1. Universal Recommendation Safety Rules

These rules apply to every report regardless of mode. They govern Section 11 (recommendation/resource hints) and any recommendation-shaped language elsewhere in the report.

| Rule | Meaning |
|---|---|
| **No decision replacement** | The report does not decide for the user. It surfaces frames, questions, and small probes. |
| **No relationship directive** | The report does not tell the user to keep, end, deepen, distance, or change a specific relationship. |
| **No productivity pressure** | The report does not frame action plans as efficiency improvements or output increases. |
| **No strict habit prescription** | The report does not prescribe daily routines, habit stacks, or rigid schedules. Actions are optional and small. |
| **No clinical / self-treatment framing** | The report does not diagnose, prescribe treatment, or imply the user should self-treat. Section 13 boundary applies throughout. |
| **No hidden-truth framing** | No "本当の答え" / "隠された核心" / "真実" / "秘密" framing. The report shows what is visible, not what is hidden. |
| **No payment pressure** | The report does not reference purchase, urgency, scarcity, or future loss. It does not push the user toward any next purchase. |
| **Recommend frames, not conclusions** | Section 11 recommends questions to sit with, structures to try, next-step *frames* — never conclusions, named services, or prescribed actions. |

Any recommendation that violates these rules is a Safety blocker. See Section 5.

---

## 2. Mode-Specific Recommendation Styles

The universal rules constrain *what may be recommended*. Mode rules shape *how the recommendation reads* in voice.

| Mode | Recommendation voice |
|---|---|
| `fatigue_recovery` | Small recovery windows; rhythm-of-rest; recognizing depletion early. "選択肢として〜について少しずつ確かめてみる方法があります" |
| `direction_focus` | Small probes; observing what holds; orientation rather than commitment. "次の一歩を決める前に、小さく触れて反応を見る方法があります" |
| `relationship_distance` | Response tempo; care without immediate reply; distance as care. "返す前・決める前・会った後に、少し余白を置くことを試す方法があります" |
| `decision_clarity` | Probe-and-observe; suspending decision until felt difference emerges. "決めきる前に、選択肢のひとつに小さく触れる方法があります" |
| `rhythm_stabilization` | Small repeatable inputs; rhythm signals; gentle anchors. "小さく続けられる一つの動きを、7日間だけ観てみる方法があります" |

In all modes, the recommendation voice remains observational, hedged, and optional. Never imperative. Never specific to a third party.

---

## 3. Quality Pass Criteria

A v0.2 report must satisfy **all** of the following to pass quality review:

### Hard requirements (any failure = report rejected)

- [ ] **Safety = 5** (no exception)
- [ ] **All 14 sections present and non-empty**
- [ ] **Safety Note (Section 13) visible and verbatim**
- [ ] **Save/Revisit Summary (Section 14) present** — never 0%
- [ ] **Section 7 matches mode framing** — internal framing reflects the selected `main_state_mode`
- [ ] **7-Day Plan (Section 8) concrete** — day-by-day or near-daily structure, small reversible actions
- [ ] **30-Day Direction (Section 9) concrete** — orienting direction, not a goal list
- [ ] **No prohibited language** from `docs/paid-report-template-specification-v0.1.md` Section 5
- [ ] **No prohibited inference** — no claims beyond what the input packet supports
- [ ] **No recommendation overreach** — Section 11 satisfies the universal recommendation safety rules
- [ ] **No generation from weak packet** — the packet that produced the report met v0.2 minimum granularity
- [ ] **No mode collapse** — the report is recognizably in its selected mode, not a generic fatigue/recovery shape

### Scored thresholds

- [ ] **Average score ≥ 4.2** across the eight scored categories
- [ ] **Personalization ≥ 4**
- [ ] **Paid-worthiness ≥ 4**
- [ ] **Mode fit ≥ 4**
- [ ] **Input packet sufficiency ≥ 4**
- [ ] **No category below 3**

---

## 4. Scoring Categories

Each report is scored on the following eight categories on a 1–5 scale.

| # | Category | What it measures |
|---|---|---|
| 1 | **Depth** | Does the report go beyond surface restatement of the free result? Does it integrate dimensions, tensions, and patterns? |
| 2 | **Personalization** | Does the report feel written for this specific pattern, not a generic persona? Is personalization grounded in the packet, not invented? |
| 3 | **Safety** | Are all phrase rules, hedged language, safety boundary, non-clinical framing, and universal recommendation safety rules maintained throughout? |
| 4 | **Practicality** | Are the 7-day plan and 30-day direction concrete, small-scale, reversible, optional, actionable without external resources? |
| 5 | **Paid-worthiness** | Would a reasonable person consider this report worth paying for relative to the free result? Is structure commercially serious without manipulation? |
| 6 | **Revisit value** | Will the report still feel useful in 1 week or 1 month? Is Section 14 a usable standalone summary? |
| 7 | **Mode fit** | Does the report reflect the selected `main_state_mode` in tone, emphasis, and framing? Could a blind reader identify the mode? |
| 8 | **Input packet sufficiency** | Did the packet provide enough granularity for the drafter to produce personalized content? (Low score = methodology gap, not drafting failure) |

### 1–5 scale

| Score | Meaning |
|---|---|
| 5 — Excellent | Clearly meets the standard; sets the bar |
| 4 — Strong | Meets the standard with minor improvements possible |
| 3 — Acceptable | Meets the standard at baseline; not a model report |
| 2 — Weak | Falls short in noticeable ways; needs revision |
| 1 — Unacceptable | Does not meet the standard; must be rewritten |

### Anchors for the two new categories

| Category | 5 | 3 | 1 |
|---|---|---|---|
| **Mode fit** | A blind reader would identify the mode within the first 3 sections; section emphasis, voice, and Section 7 internal framing all align | Mode is identifiable on close reading; some sections drift toward another mode | The report reads as a different mode than the one selected; mode collapse |
| **Input packet sufficiency** | Every required section had specific signal to draw on; personalization felt natural | Most sections had enough signal; some had to lean on persona-typical copy | Drafter had to invent details or write generic copy because packet was thin |

---

## 5. Delivery Blocker Rules

The following conditions block delivery (or, for internal pilot, block archive-as-approved):

### Safety blocker — `block delivery`

If any of the following appear in the draft:

- A Safety category score < 5
- Any forbidden phrase from `docs/paid-report-template-specification-v0.1.md` Section 5
- Any clinical / treatment framing outside Section 13
- Any identifiable-person inference
- Any hidden-truth framing
- Any payment pressure language
- Any recommendation that violates the universal recommendation safety rules
- Any decision replacement, relationship directive, or productivity pressure

**Action:** Do not deliver. Return the draft for re-drafting of the flagged sections. Re-score after revision.

### Packet blocker — `stop generation`

If, before or during drafting, any of the following are found:

- The packet fails any minimum granularity requirement from `docs/pilot-input-packet-schema-v0.2.md` Section 3
- `main_state_mode` is absent, ambiguous, or not one of the five allowed values
- `consent_level` is not `"L1"`
- `excluded_data` is missing or contradicts other packet fields
- A `safety_flags` entry is marked `blocking`

**Action:** Stop generation immediately. Respond with `input_packet_revision_required` (see `docs/pilot-input-packet-schema-v0.2.md` Section 4). Do not draft a partial report. Do not draft a generic report to be revised later.

---

## 6. Reviewer Checklist (v0.2)

Used by Edward (and Safety/Governance Agent where applicable) when reviewing each v0.2-generated report.

### Hard requirement pass check

- [ ] All 14 sections present and non-empty
- [ ] Section 13 verbatim
- [ ] Section 14 present, usable standalone
- [ ] Section 7 internal framing matches mode
- [ ] 7-day plan day-structured
- [ ] 30-day direction orienting (not goal list)
- [ ] No prohibited language
- [ ] No prohibited inference
- [ ] Section 11 satisfies universal recommendation safety rules
- [ ] Packet met v0.2 minimum granularity before drafting began
- [ ] No mode collapse

### Category scoring

- [ ] Depth: ___ / 5
- [ ] Personalization: ___ / 5
- [ ] Safety: ___ / 5
- [ ] Practicality: ___ / 5
- [ ] Paid-worthiness: ___ / 5
- [ ] Revisit value: ___ / 5
- [ ] Mode fit: ___ / 5
- [ ] Input packet sufficiency: ___ / 5

### Threshold check

- [ ] Safety = 5
- [ ] Average ≥ 4.2
- [ ] Personalization ≥ 4
- [ ] Paid-worthiness ≥ 4
- [ ] Mode fit ≥ 4
- [ ] Input packet sufficiency ≥ 4
- [ ] No category < 3

### Decision

- [ ] Approve (proceed to internal archive; no user delivery without separate authorization)
- [ ] Revise (return with specific notes)
- [ ] Hold (do not deliver; surface methodology concern)

### Free-text notes

- Strengths: ___
- Weaknesses: ___
- Mode-fit observations: ___
- Packet sufficiency observations (for schema v0.3 consideration): ___

---

> **This document is a quality methodology specification. It does not approve user delivery, payment, automation, volunteer pilots, or any external use.**
