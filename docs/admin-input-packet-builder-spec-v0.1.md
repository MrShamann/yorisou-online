# Yorisou — Admin Input Packet Builder Spec v0.1

**Status:** Specification only. Not implementation approval.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document is a specification only. It does not implement the packet builder, the sufficiency checker, the storage of packets, or any UI surface.**

---

## 1. Purpose

Defines the structure of the input packet the admin tool would construct before draft generation may begin. The packet implements the v0.2 schema (`docs/pilot-input-packet-schema-v0.2.md`) and adds operational fields specific to admin handling (consent version, storage option).

The packet sufficiency checker runs before any draft generation and is a **fail-fast** boundary: insufficient packets do not produce drafts.

---

## 2. Required Fields

Every packet built in the admin tool must carry exactly the following fields. Missing or empty fields cause sufficiency failure.

| # | Field | Source | Purpose |
|---|---|---|---|
| 1 | `report_id` | Assigned by admin tool | Opaque identifier for this report request |
| 2 | `consent_version` | From consent record | Tracks which consent copy version the user agreed to |
| 3 | `storage_option` | From consent record | "A" / "B" / "C" — must match user selection at consent time |
| 4 | `test_type` | From source check-in | `quick_check` / `relationship_fatigue` / `love_distance` |
| 5 | `result_archetype` | From DTE scoring | Cluster ID + public name |
| 6 | `main_state_mode` | Selected by reviewer | One of five allowed values; required for drafting |
| 7 | `confidence_level` | From DTE scoring | `low` / `medium` / `high` |
| 8 | `dimension_summary` | From DTE scoring | ≥ 5 dimensions with shape labels |
| 9 | `answer_pattern_summary` | Derived by reviewer | ≥ 10 short observational bullets |
| 10 | `top_3_signals` | Derived | Exactly 3 |
| 11 | `bottom_3_signals` | Derived | Exactly 3 |
| 12 | `contradiction_or_tension_map` | Derived | ≥ 2 tension pairs |
| 13 | `recommendation_seed` | Derived | ≥ 1 topic-area seed |
| 14 | `excluded_data` | Asserted by reviewer | Explicit list of categories not included |
| 15 | `safety_flags` | Asserted by reviewer | Array (may be empty); `severity: blocking` halts drafting |
| 16 | `section_emphasis_plan` | Derived from `main_state_mode` | Density labels per section group |

Fields 1–16 are all required. Schema definitions per `docs/pilot-input-packet-schema-v0.2.md` Section 2 govern. Operational additions (consent version, storage option) are added here for admin handling.

---

## 3. Packet Sufficiency Checker

The sufficiency checker runs at packet save and before any state transition from `packet_pending` to `packet_ready`. It is a deterministic check — pass or fail.

### Pass conditions (all required)

- [ ] `main_state_mode` is present and one of the five allowed values
- [ ] `consent_version` is present and matches an approved version
- [ ] `storage_option` is present and is one of `A`, `B`, `C` (in this pilot, only `A` is offered to users)
- [ ] `answer_pattern_summary` has ≥ 10 bullets
- [ ] `dimension_summary` has ≥ 5 dimensions
- [ ] `top_3_signals` has exactly 3 entries
- [ ] `bottom_3_signals` has exactly 3 entries
- [ ] `contradiction_or_tension_map` has ≥ 2 tension pairs
- [ ] `recommendation_seed` has ≥ 1 seed
- [ ] `excluded_data` is present and explicit (not empty, not generic)
- [ ] `safety_flags` is present (may be empty array); no entry has `severity: blocking`
- [ ] `section_emphasis_plan` is present, covers all section groups, totals 100% across the four density tiers (this is a presence check on coverage, not a strict word-count rule — density labels remain guidance per `docs/main-state-mode-rules-v0.2.md` Section 4)
- [ ] If `main_state_mode` is `relationship_distance`, the relationship_distance extra checks pass (Section 6 below)

### Failure response

If any condition fails:

- The packet transitions to `packet_failed`
- The structured failure category (e.g., `below_min_bullets`, `missing_main_state_mode`, `blocking_safety_flag`) is recorded
- The reviewer is shown the categories that failed
- Drafting does not begin

This implements the fail-fast rule: **no draft generation if packet fails**.

---

## 4. Fail-Fast Rule

The fail-fast rule is absolute:

- A packet that fails sufficiency **must not** be passed to a drafter
- A packet that fails sufficiency **must not** be passed to the optional sanitized draft assistant (future role)
- The reviewer cannot override sufficiency failure to "see what the draft would look like"
- No partial or placeholder draft is produced from a failed packet
- The standard low-confidence fallback response from `docs/report-generation-failure-fallbacks-v0.2.md` Section 3 applies:

```
この入力情報だけでは、安全で十分に具体的な詳細レポートを作成できません。回答パターン、主な信号、除外データ、推薦の種を追加してください。
```

The response is internal — returned to the reviewer/packet preparer, not to the user.

---

## 5. Forbidden Packet Contents

The following must never appear in any packet, regardless of how it might appear "useful" for drafting:

| Category | Reason |
|---|---|
| **Raw private text** | Raw answer payload, free-text user disclosures, anything that quotes the user verbatim |
| **LINE history** | Raw LINE messages or summaries — not approved at any level in this phase |
| **Memory** | Prior session data, long-term memory state — Level 2 and Level 3 are deferred |
| **Partner identity** | Name, role, identifying detail of any other person referenced by the user |
| **Payment data** | Card numbers, payment account info — not applicable; never appropriate |
| **Account identity used for interpretation** | Email, LINE UID, or any identifier whose semantics are used to color the report (e.g., inferring profession from email domain) |
| **Unsupported inference** | Any field whose value is not derivable from the user's check-in answers, but is invented or assumed by the reviewer to fill a slot |

Detection of any forbidden content in a packet:
- Halts the transition immediately
- Surfaces the category to the reviewer
- Routes to packet revision; does not proceed to draft

---

## 6. relationship_distance Extra Checks

When `main_state_mode` is `relationship_distance`, the sufficiency checker applies the following additional checks. All must pass before the packet may transition to `packet_ready`.

- [ ] **No partner identity** anywhere in the packet — `answer_pattern_summary`, `reviewer_notes`, `contradiction_or_tension_map`, or any other field must not name, describe identifiably, or reference a specific other person
- [ ] **No relationship outcome claim** — packet does not state or imply that the user should stay in, leave, return to, or change a relationship
- [ ] **No partner psychology inference** — packet does not include speculation about the other person's feelings, intentions, attachment style, or motives
- [ ] **No contact/no-contact instruction** — packet does not include an instruction or recommendation about reaching out or staying silent
- [ ] **No breakup/reconciliation/confession/blocking suggestion** — packet does not include any directive on these outcomes
- [ ] **Distance is framed only as** one of:
  - reaction interval (反応する前の間隔)
  - returnable distance (戻ってこられる距離)
  - timing boundary (タイミングの境界)
  - communication load adjustment (やりとりの負荷の調整)

If any of these checks fail, the packet transitions to `packet_failed` with the structured failure category recorded. The reviewer revises the packet to remove the violating content and resubmits.

The relationship_distance extra checks supplement, not replace, the standard sufficiency checks. Both must pass.

---

## 7. Packet Lifecycle in the Admin Tool

```
packet_pending  ─[reviewer edits]──→  packet sufficiency checker
                                              │
                       PASS ←──────────────────┴──────────────────→ FAIL
                        │                                            │
                        ↓                                            ↓
                 packet_ready                                packet_failed
                        │                                            │
            [drafter accepts]                            [reviewer revises]
                        ↓                                            │
            draft_generation_pending                                 ↓
                                                          packet_pending (loop)
                                                                     │
                                                          [or reviewer rejects]
                                                                     ↓
                                                                rejected
```

---

## 8. Operational Notes

- The packet sufficiency checker is deterministic. Same input → same result. No LLM in the checker path.
- The checker's failure category is structured and bounded (e.g., one of: `below_min_bullets`, `below_min_dimensions`, `wrong_signal_count_top` / `_bottom`, `below_min_tensions`, `missing_seed`, `missing_excluded_data`, `blocking_safety_flag`, `missing_main_state_mode`, `missing_consent_version`, `missing_storage_option`, `relationship_distance_partner_identity_detected`, `relationship_distance_outcome_claim_detected`, `relationship_distance_psychology_inference_detected`, `relationship_distance_contact_instruction_detected`, `relationship_distance_outcome_suggestion_detected`, `relationship_distance_distance_framing_invalid`). New categories require a versioned schema bump.
- Reviewer notes are stored as operational metadata only — no free-text disclosures, no user identifiers, no partner identifiers.
- The packet itself is stored under whichever storage option the user selected (Option A by default — no full-text persistence after the report's review window).

---

> **This document is a specification only. It does not implement the packet builder, the sufficiency checker, the storage of packets, or any UI surface.**
