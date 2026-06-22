# Yorisou — First Pilot Report Operations v0.1

**Status:** Specification only. Not implementation approval.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document does not authorize payment, automation, OpenClaw memory access, or real-user delivery without approved consent handling.**

---

## 1. Pilot Objective

Produce 3–5 first-batch 詳細レポート samples to confirm that the methodology specified in `docs/paid-report-generation-workflow-v0.1.md` and `docs/paid-report-template-specification-v0.1.md` produces reports that meet the quality rubric in `docs/first-pilot-report-quality-rubric-v0.1.md`.

The pilot exists to learn:
- Whether the 14-section template produces depth and personalization at the target length
- Whether the safety review workflow catches issues reliably
- Whether reports feel paid-worthy without commercial pressure or dark patterns
- Whether the semi-manual operational pace is sustainable
- What the actual time-to-draft is per report

The pilot does not authorize paid delivery, automatic generation, or scaled operation.

---

## 2. Pilot Scope

### Inclusions

- **3 to 5 reports** total in the first batch
- **Level 1 consent only** (current check-in result and saved-result reference)
- **Simulated / internal reports first**: the first round should use simulated or internal-tester inputs (controller's own check-in result, internal team member with explicit verbal consent, or constructed example based on archived persona pattern) before any trusted volunteer is invited
- **Trusted volunteers (optional, second round)**: only after Edward explicitly approves volunteer use and the consent handling for that group is confirmed
- **Manual generation only**: Yorisou Agent drafts every section
- **Edward review on every report**: each of the 3–5 reports reviewed individually
- **Internal archive or delivery**: at controller discretion per report

### Exclusions

The following are explicitly excluded from the first pilot:

| Exclusion | Reason |
|---|---|
| Payment of any kind | Pilot is unpaid. Pricing is unresolved. |
| LINE history use | Raw LINE message use is not approved at any level |
| Long-term memory / Level 3 | Deferred; not active at first launch |
| Level 2 personalization | Optional only after separate Edward approval |
| Raw private text from external sources | Not collected; not used |
| Model training use of report content or user signals | Not approved by default |
| Automatic generation pipeline | Not authorized |
| OpenClaw runtime memory access | Not authorized at v0.1 |
| External recruitment / public pilot signup | Not authorized for first round |

---

## 3. Required Input Packet

Each report begins from a sanitized input packet. Yorisou Agent assembles this before drafting. If OpenClaw is involved as optional draft support, it receives only this packet — no additional context.

### Packet Fields

| Field | Source | Required |
|---|---|---|
| `pilotReportId` | Assigned at packet creation | Yes |
| `pilotRound` | "simulated" / "internal" / "volunteer" | Yes |
| `resultId` | Source check-in result | Yes |
| `overlayId` | Source overlay | Yes |
| `confidenceBand` | Computed from check-in | Yes |
| `personaClusterId` | DTE scoring output | Yes |
| `topDimensions` | Top 3 dimension labels | Yes |
| `dimensionScoreShape` | Relative shape (high / medium / low per top dim) | Yes |
| `locale` | "ja" only at v0.1 | Yes |
| `consentLevel` | "L1" only | Yes |
| `consentTimestamp` | When L1 consent was confirmed | Yes |
| `inputProvenance` | "controller-self" / "internal-tester" / "constructed-archive" / "consenting-volunteer" | Yes |

### Excluded Data (Must Not Be in Packet)

| Excluded field | Reason |
|---|---|
| Raw answer payload (per-question text or values) | Not needed for Level 1; not approved for inclusion |
| User name, email, LINE UID, or any identifier | Not needed; out of pilot scope |
| Prior session results | Level 2+ only |
| LINE message content or summaries | Not approved |
| Free-text user input | Not collected |
| Device fingerprint or persistent tracking ID | Not collected |
| Payment information | Not applicable; no payment |

---

## 4. Pilot Workflow

### Step 1 — Candidate Selection

- For Round 1 (simulated/internal): select from controller's own check-in result, an internal team member's check-in with verbal consent, or a constructed archive-based example
- For Round 2 (volunteers, if authorized): selected by Edward from prior intent-saved cohort or hand-picked trusted contacts; no public recruitment
- Confirm the candidate fits Level 1 scope and does not require Level 2+ data

### Step 2 — Input Packet Preparation

- Assemble the sanitized input packet (Section 3) as a small working document
- Verify no excluded data is present
- Verify consent (verbal or written) is recorded
- Assign `pilotReportId` and `pilotRound` label

### Step 3 — Yorisou Agent Draft Generation

- Yorisou Agent drafts all 14 sections in order from the packet
- Follows phrase rules, length bounds, and tone standards from the template spec
- Section 13 (safety note) is verbatim
- Self-checks against template spec Section 7 quality standard before handoff

### Step 4 — Optional OpenClaw Draft Support

OpenClaw may assist with structured section generation **only** under the following conditions:

- Receives only the sanitized Level 1 input packet (Section 3)
- Must not retain the packet beyond the generation task
- Must not access prior reports, other users' data, or LINE content
- Output is treated as a candidate draft only; Yorisou Agent reviews and rewrites every section
- Edward must authorize the first use of OpenClaw for this purpose before it occurs
- Not active by default at v0.1

### Step 5 — Section Completeness Check

Before passing to safety review:

- [ ] All 14 sections present
- [ ] Each section non-empty
- [ ] Section 13 text verbatim
- [ ] Total character count ≥ 8,000 and ≤ 15,000
- [ ] 7-day plan (section 8) present with day-by-day structure
- [ ] 30-day direction (section 9) present

### Step 6 — Safety Review

Run the safety checklist from `docs/paid-report-template-specification-v0.1.md` Section 8:

- Phrase rule scan (forbidden phrases)
- Medical/clinical language scan
- High-certainty claim scan
- Future-prediction-as-claim scan
- Hidden-truth framing scan
- Hedged-language presence check (sections 2–6)
- Safety boundary note presence (section 11)

Any flag returns the report to Yorisou Agent for correction before proceeding.

### Step 7 — Consistency Review

- Section 1 summary aligns with section 2 interpretation
- Action plans (sections 8–9) are consistent with state summary
- No contradictions across sections
- Tone is consistent throughout (no alternation between certain and uncertain)
- Personalization references are coherent end-to-end

### Step 8 — Edward Quality Review

Edward reviews each of the 3–5 pilot reports individually:

- Reads the full report
- Scores against the rubric in `docs/first-pilot-report-quality-rubric-v0.1.md`
- Provides correction notes if applicable
- Decides: Approve / Revise / Hold

### Step 9 — Final Revision

If Edward requests revisions:
- Yorisou Agent applies corrections
- Re-runs safety review on revised sections
- Returns to Edward for final approval

If Hold:
- Do not deliver
- Document reason in decision log
- May restart from Step 2 with adjusted scope, or defer

### Step 10 — Delivery or Internal Archive

For each approved report, controller decides per-report:

- **Internal archive only**: report is kept as a methodology reference; not delivered to any user. Default for simulated reports.
- **Internal-tester delivery**: report shown to the internal team member who provided the input. Verbal feedback collected.
- **Trusted volunteer delivery**: only if Round 2 is authorized and the volunteer's consent for delivery is confirmed.

No public delivery. No payment in any path.

### Step 11 — Feedback Collection

For reports delivered to a person (not archive-only):
- Ask the 5 feedback questions from `docs/paid-report-semi-manual-ops-v0.1.md` Section 11
- Collect feedback verbally or in writing
- Do not share feedback content with parties outside Edward + Yorisou Agent

### Step 12 — Decision Log

For every report (delivered or archived), record in a pilot decision log:

| Field | Notes |
|---|---|
| `pilotReportId` | From input packet |
| `pilotRound` | simulated / internal / volunteer |
| `resultId` / `overlayId` / `personaClusterId` | From packet |
| `confidenceBand` | From packet |
| `generationMethod` | manual / openclaw-assisted (if authorized) |
| `safetyReviewStatus` | passed / flagged-corrected |
| `consistencyReviewStatus` | passed / corrected |
| `edwardReviewScore` | Per-category rubric scores |
| `edwardDecision` | approve / revise / hold |
| `deliveryOutcome` | archived / delivered-internal / delivered-volunteer / not-delivered |
| `feedbackReceived` | yes / no / not-applicable |
| `lessonsForNextRound` | Free-form notes (in decision log only, not in dashboard) |

The decision log is held by Edward and Yorisou Agent only. Not exported to the public dashboard. Aggregate counts may be logged to the DTE event store under safe logging rules.

---

## 5. Failure / Fallback Handling

### Draft Cannot Reach Quality Standard

If Yorisou Agent cannot produce a draft that meets the quality rubric after one revision pass:
- Pause the report
- Document the gap in the decision log
- Surface a methodology question to Edward (is the template insufficient? is the input thin? is the persona poorly mapped?)
- Do not deliver a sub-rubric report

### Safety Flag Cannot Be Resolved

If a safety flag persists after correction:
- Do not deliver
- Re-draft the flagged sections from scratch
- If still unresolvable, hold the report and document why

### Consent Issue Discovered Mid-Process

If at any point the consent record is found to be unclear or insufficient:
- Pause immediately
- Do not proceed to delivery
- Re-confirm consent or downgrade to internal-archive-only

### Input Packet Incomplete

If the input packet is missing a required field (Section 3):
- Do not generate
- Return to packet preparation
- Do not substitute missing fields with assumed values

### Volunteer Unreachable for Delivery / Feedback

- Hold the report internally
- Do not retain indefinitely; close the loop within a reasonable window
- Document outcome in the decision log

---

## 6. Pilot Success Criteria

The first pilot is considered successful when:

- [ ] 3 to 5 reports produced
- [ ] Every report passes the quality rubric pass requirements (rubric document Section 1)
- [ ] Every report passes safety review without unresolved flags
- [ ] Edward approves every delivered report
- [ ] At least 1 round of internal feedback collected on at least 1 delivered report
- [ ] Decision log is complete for every report
- [ ] No payment, automation, OpenClaw memory access, or LINE history use occurred
- [ ] No raw answer text or user identifier appeared in any report
- [ ] Methodology gaps (if any) are documented for the next iteration

---

## 7. Decision After Pilot

After the 3–5 reports are complete and reviewed, Edward decides the next step:

| Possible decision | Description |
|---|---|
| **Continue to Phase 2 semi-manual pilot** | Per `docs/paid-report-semi-manual-ops-v0.1.md`. Reports 6–20. Still no payment unless separately authorized. |
| **Revise template before continuing** | Apply learnings to template spec v0.2 before producing more reports |
| **Pause pilot** | Hold further reports while methodology, consent wording, or pricing is reworked |
| **Revise quality rubric** | If rubric was too strict or too lenient, update before next round |
| **Authorize OpenClaw draft support for Phase 2** | Only if a separate OpenClaw safety review is completed |

No decision after the pilot may by itself authorize payment, automatic generation, OpenClaw memory, Level 2/3 use, or public launch. Each of those requires a separate explicit authorization from Edward.

---

> **This document does not authorize payment, automation, OpenClaw memory access, or real-user delivery without approved consent handling.**
