# Yorisou — Pilot Input Packet Schema v0.2

**Status:** Specification only. Not implementation approval.
**Version:** v0.2 (supersedes the implicit packet shape in `docs/first-pilot-report-operations-v0.1.md` Section 3)
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document does not authorize automation, payment, external users, volunteer pilots, memory use, LINE history use, or report delivery.**

---

## 1. Why v0.2 Is Needed

The simulated pilot batch (`sim_pilot_001` / `002` / `003`) confirmed that the 14-section template and the safety review workflow are operationally workable. It also surfaced gaps that v0.1 of the input packet did not constrain tightly enough.

### What the simulated pilot proved

- The 14-section structure produces reports at the target 8,000–15,000 character range when drafted manually
- The safety review workflow catches forbidden phrases and clinical drift consistently
- Section 13 (safety note) can be enforced as verbatim without operational pain
- Reports can be paid-worthy without commercial pressure when the template is followed
- Edward-level review is sustainable for ≤5 reports per batch
- The rubric in `docs/first-pilot-report-quality-rubric-v0.1.md` is workable as a scoring instrument

### What the simulated pilot did not prove

- Whether a real (non-constructed) input produces enough granularity for sections 3–6 to feel specific
- Whether different user states need meaningfully different section emphasis (e.g., a fatigue-recovery state may need section 7 expanded; a direction-focus state may need section 9 expanded)
- Whether a single template variant can serve all state types without producing mode collapse (every report sounding the same)
- Whether the input packet, as previously sketched, has enough discriminative signal to drive personalization at the rubric's Personalization ≥ 4 threshold
- Whether tensions, contradictions, and recommendation seeds can be reliably extracted from real input
- Whether `Save/Revisit` value holds when section emphasis shifts

### Why granular input controls report quality

Report personalization quality is bounded by input packet granularity. A packet that lists only top dimensions and a confidence band can yield only persona-typical copy. A packet that lists answer-pattern bullets, tensions, recovery profile, and a `main_state_mode` enables sections 3–6 to be written about *this* pattern rather than the persona average.

The v0.2 schema adds the granularity fields needed to lift Personalization scoring out of the 3-range into the 4–5 range, and adds `main_state_mode` to prevent every report from collapsing into the same recovery-and-rest shape.

### Why `main_state_mode` is required

Without `main_state_mode`, the report drafter defaults to the persona's most common framing. This produces:
- Reports that conflate fatigue with indecision (mode collapse)
- Reports that over-emphasize recovery for users in a direction-focus state
- Reports that under-emphasize action for users in a decision-clarity state
- Save/Revisit sections that read the same across all reports

`main_state_mode` is the single field that tells the drafter which interpretive lens to apply to a given user. It is required before report drafting may begin.

---

## 2. Schema Fields

Each field below specifies: purpose, allowed values or structure, required/optional, example, and what must not be inferred.

---

### `report_id`

- **Purpose:** Unique identifier for the pilot report
- **Structure:** `internal_pilot_<NNN>` (e.g., `internal_pilot_001`) for internal real-input pilot; `sim_pilot_<NNN>` for simulated; `pilot_<NNN>` for later phases
- **Required:** Yes
- **Example:** `internal_pilot_001`
- **Must not be inferred:** Identifier must be assigned at packet creation; not derived from user identity

---

### `report_type`

- **Purpose:** Identifies the product variant
- **Allowed values:** `"detailed-self-understanding"`
- **Required:** Yes
- **Example:** `"detailed-self-understanding"`
- **Must not be inferred:** Fixed at v0.2; no other report types are authorized

---

### `generation_level`

- **Purpose:** Records how the report is being produced (informs review intensity)
- **Allowed values:** `"manual"` | `"assisted"` | `"automated"`
- **Required:** Yes
- **Example:** `"manual"`
- **Must not be inferred:** `"automated"` is not authorized at v0.2; `"assisted"` requires separate Edward approval

---

### `test_type`

- **Purpose:** Identifies which Yorisou test produced the source result
- **Allowed values:** `"quick_check"` | `"relationship_fatigue"` | `"love_distance"`
- **Required:** Yes
- **Example:** `"quick_check"`
- **Must not be inferred:** Must reflect the actual test taken

---

### `result_archetype`

- **Purpose:** The result cluster label produced by DTE scoring
- **Structure:** Opaque cluster ID + public name
- **Required:** Yes
- **Example:** `{ id: "balancing-distance", publicName: "距離を整えたいタイプ" }`
- **Must not be inferred:** Must come from DTE scoring; not assigned by drafter

---

### `main_state_mode`

- **Purpose:** Required interpretive lens for the report. Single source of truth for emphasis selection.
- **Allowed values:** exactly one of:
  - `fatigue_recovery`
  - `direction_focus`
  - `relationship_distance`
  - `decision_clarity`
  - `rhythm_stabilization`
- **Required:** Yes — report drafting must not begin without this field
- **Example:** `"fatigue_recovery"`
- **Must not be inferred from the result cluster alone.** Must reflect the current state pattern visible in the answer-pattern summary and dimension scores. See `docs/main-state-mode-rules-v0.2.md` for selection rules.

---

### `confidence_level`

- **Purpose:** Computed confidence in the result interpretation
- **Allowed values:** `"low"` | `"medium"` | `"high"`
- **Required:** Yes
- **Example:** `"medium"`
- **Must not be inferred:** Must come from check-in scoring; not adjusted by drafter

---

### `consent_level`

- **Purpose:** Records which consent level the user/tester confirmed
- **Allowed values:** `"L1"` at v0.2 (only)
- **Required:** Yes
- **Example:** `"L1"`
- **Must not be inferred:** `"L2"` or `"L3"` are not authorized at v0.2

---

### `dimension_summary`

- **Purpose:** Compact summary of the top dimensions and their relative shape
- **Structure:** Object with at least 5 dimensions, each: `{ dimensionId, label, shape: "high"|"medium"|"low" }`
- **Required:** Yes — minimum 5 dimensions
- **Example:**
  ```
  [
    { dimensionId: "emotional_load",   label: "感情の負荷",       shape: "high" },
    { dimensionId: "social_distance",  label: "社会的距離感",     shape: "medium" },
    { dimensionId: "behavioral_inertia", label: "行動の停滞感",   shape: "medium" },
    { dimensionId: "recovery_rhythm",  label: "回復のリズム",     shape: "low" },
    { dimensionId: "decision_clarity", label: "判断の明晰さ",     shape: "low" }
  ]
  ```
- **Must not be inferred:** Shape must be derived from check-in scoring, not from drafter's intuition

---

### `answer_pattern_summary`

- **Purpose:** Short bullets describing patterns observed in answers, not raw answer text
- **Structure:** Array of 10+ short string bullets, each one observation
- **Required:** Yes — minimum 10 bullets
- **Example:**
  - `"Frequently selects mid-range options on emotion-load items"`
  - `"Consistently selects 'I'd rather not respond right now' on social-prompt items"`
  - `"Selects high-engagement on care/help items"`
  - (and so on)
- **Must not be inferred:** Bullets must describe observed answer patterns, not psychological diagnoses. No raw answer text. No personal disclosures.

---

### `top_3_signals`

- **Purpose:** Three strongest signals visible in the pattern
- **Structure:** Array of exactly 3, each: `{ signalId, label, strength }`
- **Required:** Yes — exactly 3
- **Example:**
  ```
  [
    { signalId: "care_overload", label: "気づかいの負荷", strength: "strong" },
    { signalId: "response_delay", label: "返信の遅れ",   strength: "strong" },
    { signalId: "rest_avoidance", label: "休む決断の遅れ", strength: "medium" }
  ]
  ```
- **Must not be inferred:** Must derive from `dimension_summary` and `answer_pattern_summary`

---

### `bottom_3_signals`

- **Purpose:** Three weakest signals (also informative — they shape the negative space)
- **Structure:** Array of exactly 3, each: `{ signalId, label, weakness }`
- **Required:** Yes — exactly 3
- **Example:**
  ```
  [
    { signalId: "external_pressure", label: "外的プレッシャー", weakness: "absent" },
    { signalId: "isolation_drift",   label: "孤立傾向",         weakness: "low" },
    { signalId: "outward_anger",     label: "外向きの怒り",     weakness: "absent" }
  ]
  ```
- **Must not be inferred:** Must come from the same source as `top_3_signals`

---

### `contradiction_or_tension_map`

- **Purpose:** Identifies internal tensions or contradictions in the pattern — informs section 6
- **Structure:** Array of 2+ tension pairs, each: `{ a, b, note }`
- **Required:** Yes — minimum 2 tensions
- **Example:**
  ```
  [
    {
      a: "care_overload",
      b: "rest_avoidance",
      note: "Wants to take care of others but avoids the rest that would allow it"
    },
    {
      a: "response_delay",
      b: "high_engagement_on_care",
      note: "Slows responses but stays high on caring actions when responding"
    }
  ]
  ```
- **Must not be inferred:** Tensions must be observable in the data, not invented for narrative

---

### `action_readiness_profile`

- **Purpose:** Describes how ready the user is to take small actions; informs section 8 (7-day plan)
- **Structure:** `{ readiness: "low"|"medium"|"high", barriers: [...], openings: [...] }`
- **Required:** Yes
- **Example:**
  ```
  {
    readiness: "medium",
    barriers: ["仕事中の余白の少なさ", "返信の優先度判断の負荷"],
    openings: ["週末の短時間", "夜の20分の余白"]
  }
  ```
- **Must not be inferred:** Barriers/openings must come from observed pattern, not assumed lifestyle

---

### `recovery_profile`

- **Purpose:** Describes the user's available recovery pathways; informs section 7
- **Structure:** `{ profile: "rest_heavy"|"activity_heavy"|"mixed"|"unclear", notes: [...] }`
- **Required:** Yes
- **Example:**
  ```
  {
    profile: "rest_heavy",
    notes: ["Recovery comes from quiet alone-time, not stimulation", "Short rest windows likely more sustainable than long blocks"]
  }
  ```
- **Must not be inferred:** Must derive from dimension scores; do not assume

---

### `social_pressure_profile`

- **Purpose:** Describes the user's current social-pressure shape; informs section 4
- **Structure:** `{ shape: "internal_pull"|"external_pull"|"mixed"|"low", notes: [...] }`
- **Required:** Yes
- **Example:**
  ```
  {
    shape: "internal_pull",
    notes: ["Pressure source is internal expectation of care, not external demand", "External demand levels read as moderate"]
  }
  ```
- **Must not be inferred:** Must derive from check-in data

---

### `recommendation_seed`

- **Purpose:** Seed topics for section 11 (recommendations/resource hints), matched to dimension profile
- **Structure:** Array of 1+ seeds, each: `{ topicArea, framing, why }`
- **Required:** Yes — minimum 1 seed
- **Example:**
  ```
  [
    {
      topicArea: "small-window recovery",
      framing: "短い回復の窓を見つけ直す",
      why: "Recovery profile is rest-heavy and openings are short"
    }
  ]
  ```
- **Must not be inferred:** No third-party URLs, no specific products or services, no clinical recommendations

---

### `excluded_data`

- **Purpose:** Explicit list of what was *not* used in this packet (negative confirmation)
- **Structure:** Array of strings
- **Required:** Yes — must explicitly list excluded categories
- **Example:**
  ```
  [
    "raw_answer_text",
    "user_identifiers",
    "prior_session_results",
    "LINE_message_content",
    "free_text_disclosures",
    "device_fingerprint"
  ]
  ```
- **Must not be inferred:** Drafter must read this and confirm none of the listed categories appear elsewhere in the packet

---

### `reviewer_notes`

- **Purpose:** Optional free-text notes from the packet preparer for the drafter
- **Structure:** Array of short strings
- **Required:** No
- **Example:** `["Low-confidence on emotional_load — interpret hedged"]`
- **Must not contain:** User identifiers, raw answers, personal disclosures, or any data not derivable from dimension scoring

---

### `safety_flags`

- **Purpose:** Pre-draft safety signal — alerts the drafter and reviewer to areas needing extra care
- **Structure:** Array of `{ flag, severity, note }` (may be empty)
- **Required:** Yes — must be present, may be empty array
- **Example:**
  ```
  [
    {
      flag: "low_confidence_primary_dimension",
      severity: "advisory",
      note: "Recovery_rhythm shape is low-confidence; section 7 must hedge accordingly"
    }
  ]
  ```
- **Must not be inferred:** Flags must reflect actual concerns; do not invent severity

---

### `section_emphasis_plan`

- **Purpose:** Density guidance per section, derived from `main_state_mode`. Tells the drafter where to lean in.
- **Structure:** Object mapping section group to density label (`heavy` | `standard` | `light` | `minimal`) with optional rough percentage hint
- **Required:** Yes
- **Example (for `fatigue_recovery`):**
  ```
  {
    "summary_and_interpretation":      "standard",
    "emotion_and_load_lens":           "heavy",
    "relationship_distance_lens":      "standard",
    "behavior_pattern_lens":           "light",
    "conflict_map":                    "standard",
    "recovery_pattern":                "heavy",
    "seven_day_plan":                  "standard",
    "thirty_day_direction":            "light",
    "reflection_questions":            "standard",
    "recommendation_hints":            "standard",
    "next_visible_changes":            "light",
    "safety_note":                     "required",
    "save_revisit_summary":            "standard"
  }
  ```
- **Important (controller correction):** `section_emphasis_plan` is **density guidance, not a strict word-count rule.** All 14 sections remain required. Safety Note is always required and verbatim. `Save/Revisit` (section 14) must never drop to 0% — even when minimally emphasized, keep it at least 1% or a concise required section.

See `docs/main-state-mode-rules-v0.2.md` for per-mode emphasis recommendations.

---

## 3. Minimum Granularity Requirements

Report drafting may not begin if any of the following minimums are not met:

| Requirement | Minimum |
|---|---|
| Answer-pattern bullets | ≥ 10 |
| Dimensions in `dimension_summary` | ≥ 5 |
| `top_3_signals` | exactly 3 |
| `bottom_3_signals` | exactly 3 |
| Tensions in `contradiction_or_tension_map` | ≥ 2 |
| Recommendation seeds | ≥ 1 |
| `confidence_level` present | required |
| `consent_level` present and = `"L1"` | required |
| `main_state_mode` present and one of 5 allowed values | required |
| `excluded_data` present and explicit | required |
| `safety_flags` present (may be empty array) | required |
| `section_emphasis_plan` present | required |

---

## 4. Fail Conditions

A packet fails and report drafting must not begin if any of the following are true:

- Any minimum granularity requirement is not met
- `main_state_mode` is absent, ambiguous, or outside the five allowed values
- `consent_level` is not `"L1"`
- `excluded_data` is missing or lists a category that also appears elsewhere in the packet (contradiction)
- Raw answer text, user identifiers, or LINE content appear anywhere in the packet
- `section_emphasis_plan` sets `save_revisit_summary` to 0% or omits it
- `section_emphasis_plan` would zero out any required section
- A `safety_flags` entry is marked `blocking` (any blocking flag halts drafting until resolved)
- The packet was produced for an external user without separate Edward authorization
- The packet references model training, memory, OpenClaw runtime access, or payment as an authorized use

### Exact failure response

When any fail condition is detected, the response is:

```
input_packet_revision_required
```

No drafting occurs. The packet preparer revises the packet and resubmits.

---

> **This document does not authorize automation, payment, external users, volunteer pilots, memory use, LINE history use, or report delivery.**
