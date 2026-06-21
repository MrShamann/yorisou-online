# Yorisou 詳細レポート — Report Generation Workflow v0.1

**Status:** Specification only. Approved for documentation. Not approved for implementation.  
**Version:** v0.1  
**Controller:** Edward (final approver)  
**Methodology owner:** Yorisou Agent  
**Last updated:** 2026-06-21

---

> **This document does not authorize automatic report generation or payment implementation.**

---

## 1. Overview

This document describes the intended workflow for generating a Yorisou 詳細レポート (Detailed Report). The workflow proceeds from user trigger through input collection, signal normalization, state extraction, section generation, safety review, and delivery.

The first operational reports will be produced as a **semi-manual internal/free pilot** before any paid automation is considered. See `docs/paid-report-semi-manual-ops-v0.1.md` for the first-batch procedure.

---

## 2. Workflow Steps

### Step 1 — Trigger

A report generation request is initiated when:
- A user expresses intent via `/report-preview` (intent saved to localStorage)
- An operator initiates a pilot report on behalf of a consenting user
- Edward authorizes a batch run for the internal pilot cohort

### Step 2 — Input Collection

Collect the following from the available data sources:

| Input | Source | Required |
|---|---|---|
| Check-in answer payload | Session / stored result | Yes |
| Result ID | URL param / result store | Yes |
| Overlay ID | URL param / result store | Yes |
| Confidence band | Computed from check-in | Yes |
| Persona cluster | DTE scoring output | Yes |
| Locale | Session / user preference | Yes (ja / en) |
| User consent record | Consent store | Yes before generation |
| Prior check-in sessions (if available) | Result store | Optional |

### Step 3 — Signal Normalization

Transform raw answer payload into normalized signals:
- Map answers to trait dimension scores
- Apply overlay adjustments
- Derive top-3 active dimensions
- Flag low-confidence dimensions (score < threshold)
- Identify secondary pattern signals

### Step 4 — State Extraction

From normalized signals, extract:
- Primary state summary (1–2 sentences, visible in free result)
- Secondary state interpretation (expanded, for report section 2)
- Emotional load pattern (dimension: emotional weight)
- Relationship/distance pattern (dimension: social engagement)
- Behavioral pattern (dimension: action/avoidance)
- Recovery pattern (dimension: resilience/rhythm)
- Conflict map (internal tension between dimensions)

### Step 5 — Pattern Interpretation

Apply Yorisou Agent methodology to:
- Select the appropriate report template variant
- Identify key tension pairs (e.g., care vs. distance, action vs. rest)
- Determine personalization level (see Section 5)
- Select which optional sections to include
- Set 7-day and 30-day action plan parameters

### Step 6 — Outline Selection

Choose report structure from approved template variants:
- Standard template (14 sections)
- Relationship-focus variant (sections 4 and 5 expanded)
- Recovery-focus variant (sections 7 and 8 expanded)
- Low-confidence variant (sections 3–6 replaced with general-range copy)

See `docs/paid-report-template-specification-v0.1.md` for full section definitions.

### Step 7 — Section Generation

Generate each of the 14 report sections in order. For each section:
1. Apply section-specific prompt with state extraction context
2. Apply phrase rules (see template spec)
3. Validate character count (see length standards)
4. Flag any forbidden phrases for review
5. Apply safety boundary language where required

Generation may be performed by:
- Yorisou Agent (methodology/content drafting)
- OpenClaw / backend agent system (structured generation pipeline)
- Edward / human operator (manual drafting for pilot)

### Step 8 — Recommendation Matching

For section 11 (推薦・リソースのヒント):
- Match top-3 active dimensions to approved resource categories
- Select from pre-approved resource hints (not URLs or specific third-party services)
- Apply neutral framing: "選択肢として" / "参考にできるかもしれません"
- Do not claim these are verified, medically approved, or guaranteed

### Step 9 — Safety Review

All generated report text must pass safety review before delivery:

**Automated checks:**
- Forbidden phrase scan (see phrase rules in template spec)
- Medical/clinical language detection
- High-confidence claim detection ("必ず", "確実に", "診断されます")
- Future prediction language detection

**Human review trigger conditions:**
- Any section flagged by automated check
- Confidence band = "low" on primary dimension
- Crisis signal detected in input (see Section 7)
- Report is for the first 5 internal pilot cohort

**Safety review owner:** Safety/Governance Agent and/or Edward

### Step 10 — Consistency Review

Verify across all 14 sections:
- Section 1 summary matches section 2 interpretation
- Action plan (sections 8, 9) is consistent with state summary
- No contradictory statements between sections
- Tone is consistent (not alternating between certain and uncertain)
- Character count within bounds

### Step 11 — Low-Confidence Handling

If confidence band is "low" or top dimension score is below threshold:
- Replace interpretation sections with general-range copy
- Add explicit low-confidence note in section 1
- Shorten action plan sections
- Do not generate sections 6 (conflict map) or 11 (recommendations) from persona-specific content
- Route for human review before delivery

### Step 12 — Final Rendering

Assemble sections into final report format:
- Apply report metadata (type, version, generated date, result ID reference)
- Format for delivery mode (in-app display, LINE, downloadable — TBD)
- Add header and footer elements
- Apply safety note (always present, always visible)

### Step 13 — Storage / Revisit

Delivery and storage decisions are unresolved at v0.1. Options under consideration:
- In-app display only (no persistent storage)
- User-initiated save to LINE / browser local storage
- Encrypted server-side storage with user consent
- Downloadable PDF

See unresolved decisions list in `docs/paid-report-semi-manual-ops-v0.1.md`.

### Step 14 — Dashboard Update

After delivery, log to the DTE launch event store:
- Event: `report_delivered`
- Report type, version, result ID, persona cluster, delivery mode
- Safety review status
- Generation method (manual / assisted / automated)
- Do not log full report text to dashboard (privacy)

---

## 3. Agent Role Division

### Frontend / Web App

- Collects user intent signal via `/report-preview`
- Displays report preview UI (locked section structure)
- Delivers final report to user (display mode TBD)
- Fires client-side tracking events (`report_preview_viewed`, `paywall_visible`, etc.)
- Does not generate report content

### Yorisou Agent

- Owns report methodology, section rules, phrase rules, tone standards
- Drafts section content for pilot reports
- Reviews and corrects generated drafts
- Defines template variants and personalization rules
- Approves phrase rule updates
- Does not implement code or backend systems

### OpenClaw / Backend Agent System

- Structured generation pipeline (future, not yet active)
- Applies section prompts with normalized signal context
- Runs automated phrase/safety checks
- Formats output for delivery
- Not yet authorized for report generation

### Safety / Governance Agent

- Reviews all draft reports against safety checklist
- Flags forbidden phrases, clinical language, high-confidence claims
- Confirms safety note presence and visibility
- Provides go/no-go decision per report before delivery
- Reports to Edward

### Edward / Human Controller

- Final approver on all methodology decisions
- Final approver on first pilot cohort reports
- Authorizes transition from pilot to semi-automated production
- Approves pricing and delivery SLA (unresolved at v0.1)
- Receives dashboard summary of all delivered reports

---

## 4. Input Signal Model

### Primary Signals

| Field | Type | Notes |
|---|---|---|
| `resultId` | string | DTE result cluster ID |
| `overlayId` | string | State overlay modifier |
| `confidenceBand` | "low" \| "medium" \| "high" | Computed from answer spread |
| `personaClusterId` | string | Top-matching persona |
| `dimensionScores` | Record<string, number> | All dimension scores |
| `topDimensions` | string[] | Top 3 active dimensions |
| `answerPayload` | object | Full question-answer record |
| `locale` | "ja" \| "en" | Report language |

### Secondary Signals (optional, enrich personalization)

| Field | Notes |
|---|---|
| `priorResultIds` | Earlier check-in results if user has history |
| `overlayModifiers` | Secondary overlay adjustments |
| `lowConfidenceFlags` | Dimensions below threshold |

---

## 5. Personalization Levels

### Level 1 — Result-Referenced (Minimum)

- Refers to result cluster by name and primary trait
- Uses overlay public line in section 2
- Action plans are general-range for the persona cluster
- Suitable for: low-confidence results, first pilot tests

### Level 2 — Dimension-Weighted (Standard)

- Weights top-3 dimensions in interpretation sections
- Selects template variant based on dimension pattern
- Generates 7-day plan from dimension-specific action catalog
- Suitable for: medium/high confidence results, standard production

### Level 3 — Pattern-Specific (Extended)

- Interprets tension pairs between dimensions
- Generates conflict map (section 6) from specific score combination
- 30-day direction is tailored to pattern arc
- Requires high confidence band and human review
- Not yet active at v0.1

---

## 6. Report Section Mapping

| Section | Title | Personalization Level | Generation Method |
|---|---|---|---|
| 1 | 今の状態の要約 | L1+ | Template + result ref |
| 2 | 深い状態解釈 | L2+ | Overlay + dimension |
| 3 | 感情の負荷分析 | L2+ | Dimension-weighted |
| 4 | 人間関係・距離感のレンズ | L2+ | Dimension-weighted |
| 5 | 行動と先延ばしのパターン | L2+ | Dimension-weighted |
| 6 | 内側の葛藤マップ | L3 | Pattern-specific |
| 7 | 回復しやすい整え方 | L2+ | Persona catalog |
| 8 | 7日間の小さな行動計画 | L2+ | Dimension + action catalog |
| 9 | 30日間の方向性 | L2+ | Pattern arc |
| 10 | 振り返りの問い | L1+ | Persona catalog |
| 11 | 推薦・リソースのヒント | L2+ | Dimension matching |
| 12 | 次に見るべき変化 | L2+ | Pattern monitoring |
| 13 | 注意書き・限界 | Fixed | Always identical |
| 14 | 保存用まとめ | L1+ | Summary assembly |

---

## 7. Generation Quality Standard

A delivered report must meet all of the following:

- **Length:** 8,000–15,000 Japanese characters (target 10,000–12,000)
- **Sections:** All 14 sections present and non-empty
- **Safety note:** Section 13 always present, unmodified
- **Phrase rules:** No forbidden phrases (see template spec)
- **Consistency:** No factual contradictions between sections
- **Tone:** Calm, self-directed, non-prescriptive throughout
- **Confidence honesty:** Low-confidence sections use hedged language
- **Not a diagnosis:** No clinical framing in any section
- **Action plans:** Concrete and small-scale, not prescriptive life changes

---

## 8. Safety Review Workflow

```
Draft report generated
      ↓
Automated phrase scan
      ↓
[Any flag?] → YES → Human review required
      ↓ NO
Low confidence band? → YES → Human review required
      ↓ NO
First pilot cohort? → YES → Edward review required
      ↓ NO
Safety/Governance Agent go/no-go
      ↓ PASS
Deliver to user
      ↓
Log to dashboard
```

---

## 9. Delivery Modes (TBD)

The following delivery modes are under consideration. None are finalized at v0.1:

| Mode | Description | Status |
|---|---|---|
| In-app display | Report rendered in browser session | Preferred for pilot |
| LINE message | Report summary sent to LINE | Under consideration |
| Downloadable PDF | User downloads report file | Not recommended for pilot |
| Server-stored with login | Report saved to user account | Requires consent/storage decision |

---

## 10. Dashboard / Ops Statuses

Events to be logged to the DTE event store for each report:

| Event | When |
|---|---|
| `report_intent_saved` | User clicks intent CTA on /report-preview |
| `report_generation_started` | Generation pipeline begins |
| `report_safety_flagged` | Automated safety check finds issue |
| `report_human_reviewed` | Human reviewer completes check |
| `report_delivered` | Report displayed to user |
| `report_feedback_received` | User submits feedback |
| `report_generation_failed` | Pipeline error, report not delivered |

---

## 11. First MVP Recommendation

For the first real reports:

1. **Internal/free pilot (reports 1–5):** Generate manually using Yorisou Agent. Edward reviews each. Deliver to internal testers or consenting opt-in users at no charge. No payment system required.
2. **Semi-manual pilot (reports 6–20):** Use Yorisou Agent draft with optional OpenClaw assist. Edward spot-checks. Deliver to small opt-in cohort. Payment still not required.
3. **Controlled paid batch (reports 21+):** Only after pilot quality is confirmed, pricing is set, consent wording is approved, and delivery mode is decided.

---

## 12. Implementation Phases

| Phase | Condition | Authorized |
|---|---|---|
| Phase 0 — Preview UX | PR #35 merged | ✅ Done |
| Phase 1 — Internal pilot | Edward approves pilot cohort | Pending |
| Phase 2 — Semi-manual pilot | Pilot quality confirmed | Pending |
| Phase 3 — Backend generation assist | OpenClaw generation pipeline reviewed | Not yet |
| Phase 4 — Paid production | Pricing, consent, delivery all decided | Not yet |

---

> **This document does not authorize automatic report generation or payment implementation.**
