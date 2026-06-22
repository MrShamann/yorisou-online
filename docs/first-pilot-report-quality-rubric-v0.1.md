# Yorisou — First Pilot Report Quality Rubric v0.1

**Status:** Specification only. Not implementation approval.
**Version:** v0.1
**Controller:** Edward (final approver and primary scorer)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

## 1. Pass Requirements (Gate Before Scoring)

A pilot report must satisfy all of the following pass requirements before any category scoring is applied. If any pass requirement fails, the report is rejected and returned for correction.

- [ ] **Length:** Total Japanese character count ≥ 8,000
- [ ] **Sections:** All 14 sections from the template spec are present and non-empty
- [ ] **Safety note:** Section 13 is present and verbatim matches the fixed text
- [ ] **7-day plan:** Section 8 contains a day-by-day or near-daily structured action plan
- [ ] **30-day direction:** Section 9 contains an orienting direction (not a goal list)
- [ ] **No prohibited language:** No forbidden phrases from the template spec phrase rules
- [ ] **Not generic:** The report is recognizably tied to the user's input packet — at least sections 1, 2, 4, 7, 8 reference specifics of the user's pattern (not just generic persona-cluster copy)
- [ ] **No creepy personalization:** No references that would feel like surveillance (e.g., quoting specific raw answers verbatim, naming specific people, claiming knowledge beyond what the input packet provides)
- [ ] **No hidden sales pressure:** No urgency, no future-loss framing, no statements implying the report itself is incomplete unless the user does something else

A report that meets all pass requirements proceeds to category scoring.

---

## 2. Scoring Categories

Each pilot report is scored on six categories on a 1–5 scale.

| Category | What it measures |
|---|---|
| **Depth** | Does the report go beyond surface restatement of the free result? Does it integrate dimensions and patterns? |
| **Personalization** | Does the report feel written for this specific person's pattern, not a generic persona? Is the personalization grounded in available signals and not invented? |
| **Safety** | Are the phrase rules, hedged language, safety boundary, and non-clinical framing all maintained throughout? |
| **Practicality** | Are the 7-day plan and 30-day direction concrete, small-scale, and reversible? Can the user act on them without external resources? |
| **Paid-worthiness** | Would a reasonable person consider this report worth paying for relative to the free result? Is the structure commercially serious without being manipulative? |
| **Revisit value** | Will the report still feel useful when the user returns to it in 1 week or 1 month? Is section 14 a usable summary? |

---

## 3. 1–5 Scoring Table

The same 1–5 scale applies to each category.

| Score | Meaning |
|---|---|
| **5 — Excellent** | Clearly meets the standard; sets the bar for future reports |
| **4 — Strong** | Meets the standard with minor improvements possible |
| **3 — Acceptable** | Meets the standard at a baseline; not a model report |
| **2 — Weak** | Falls short of the standard in noticeable ways; needs revision |
| **1 — Unacceptable** | Does not meet the standard; must be rewritten |

### Category-Specific Anchors

| Category | 5 | 3 | 1 |
|---|---|---|---|
| **Depth** | Integrates multiple dimensions into a coherent interpretation that opens new framing | Restates the free result with some expansion | No depth beyond the free result |
| **Personalization** | Pattern-specific language throughout; feels recognizably about this person | Persona-typical language with some specifics | Generic persona copy with no specifics |
| **Safety** | All phrase rules, hedges, and boundary language maintained; section 13 verbatim; no clinical framing anywhere | Mostly safe with one minor lapse | One or more clear violations of forbidden phrases or framing |
| **Practicality** | 7-day plan is concrete, small, reversible, optional; 30-day direction is observational | Plan is plausible but generic | Plan is prescriptive, demands big changes, or relies on external resources |
| **Paid-worthiness** | Commercially serious structure; clear value over free; no manipulation | Reasonable value but not differentiated | Indistinguishable from free result or relies on urgency/dark patterns |
| **Revisit value** | Section 14 summary stands alone; reflection questions are evergreen | Summary is functional; some questions are evergreen | Summary requires re-reading; no evergreen questions |

---

## 4. Minimum Thresholds

For a pilot report to be **approved** (delivered or archived as a success):

- **Average score across all 6 categories: ≥ 4.0**
- **Safety: = 5** (required; no exception)
- **Paid-worthiness: ≥ 4**
- **Personalization: ≥ 4**
- **No category below 3**

A report that meets the average but has any category below 3 is **rejected** and returned for revision.

A report with Safety < 5 is **rejected unconditionally** and the section(s) causing the Safety reduction must be re-drafted.

---

## 5. Report Rejection Conditions

A report is rejected (returned to Yorisou Agent for re-draft or held) if any of the following are true:

| Rejection trigger | Action |
|---|---|
| Any pass requirement in Section 1 fails | Return for correction; do not score |
| Safety category score < 5 | Re-draft flagged sections; re-review |
| Paid-worthiness < 4 | Re-draft the sections most responsible for the low score |
| Personalization < 4 | Re-examine input packet sufficiency and re-draft personalization sections |
| Any category < 3 | Re-draft the category-relevant sections |
| Average score < 4.0 | Decide: revise (if 1–2 categories pulling down) or hold (if systemic) |
| Reviewer detects creepy personalization | Re-draft immediately; surface to methodology review |
| Reviewer detects hidden sales pressure | Re-draft immediately; surface to copy review |
| Forbidden phrase detected post-draft | Re-draft; tighten phrase scan for next report |

---

## 6. Reviewer Checklist

Used by Edward (and Safety/Governance Agent where applicable) when reviewing each pilot report.

### Pre-Score Pass Check

- [ ] Character count ≥ 8,000 confirmed
- [ ] All 14 sections present and non-empty
- [ ] Section 13 verbatim
- [ ] 7-day plan present with day structure
- [ ] 30-day direction present
- [ ] Phrase scan: no forbidden language
- [ ] Personalization: not generic
- [ ] Personalization: not creepy
- [ ] No hidden sales pressure

### Category Scoring

- [ ] Depth: ___ / 5 (notes: ___)
- [ ] Personalization: ___ / 5 (notes: ___)
- [ ] Safety: ___ / 5 (notes: ___)
- [ ] Practicality: ___ / 5 (notes: ___)
- [ ] Paid-worthiness: ___ / 5 (notes: ___)
- [ ] Revisit value: ___ / 5 (notes: ___)

### Threshold Check

- [ ] Average ≥ 4.0
- [ ] Safety = 5
- [ ] Paid-worthiness ≥ 4
- [ ] Personalization ≥ 4
- [ ] No category < 3

### Decision

- [ ] Approve (proceed to delivery or archive)
- [ ] Revise (return with specific notes)
- [ ] Hold (do not deliver; surface methodology concern)

### Free-Text Notes

- Strengths of this report: ___
- Weaknesses of this report: ___
- Lessons for next report: ___
- Methodology gaps to surface: ___

---

## 7. Pilot-Level Aggregate (After All 3–5 Reports)

After the full pilot batch is reviewed, Edward summarizes:

- Average score per category across all reports
- Most common weakness across the batch
- Whether the template spec needs revision before continuing
- Whether the rubric itself needs adjustment for the next round
- Whether the operational pace was sustainable
- Whether OpenClaw draft support should be considered for Phase 2

This pilot-level aggregate informs the decision in `docs/first-pilot-report-operations-v0.1.md` Section 7.
