# Yorisou — main_state_mode Rules v0.2

**Status:** Specification only. Not implementation approval.
**Version:** v0.2
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

## 1. Purpose

`main_state_mode` is a required field on every report input packet (see `docs/pilot-input-packet-schema-v0.2.md` Section 2). It tells the report drafter which interpretive lens to apply, and which sections to emphasize in density.

This document defines the five allowed modes, when to use each, the primary angle each mode produces, recommended section emphasis, what to avoid, sample framing, and mode-specific forbidden drift.

---

## 2. Global Rules (Apply to All Modes)

- All 14 sections from `docs/paid-report-template-specification-v0.1.md` remain required regardless of mode.
- Section 13 (safety note) is always required and verbatim. Density labels do not apply.
- `save_revisit_summary` (section 14) must never drop to 0%. Even in the lightest mode it must remain at least 1% or a concise required section.
- Percentages and density labels (`heavy` / `standard` / `light` / `minimal`) are **density guidance only** — not strict word-count rules. They tell the drafter where to lean, not how to count characters.
- Section 7 has a flexible title depending on mode:
  - `Recovery and Stabilization Pattern` (default)
  - `Stabilization / Momentum Pattern` (for `direction_focus`)
- Mode selection happens at packet preparation time, not during drafting.
- A packet may not have two modes; if the state is ambiguous, the preparer revises the packet (likely sharpening signals) rather than declaring two modes.

---

## 3. Mode Reference

---

### Mode 1 — `fatigue_recovery`

**When to use:**
- `dimension_summary` shows `emotional_load: high` and/or `recovery_rhythm: low`
- `answer_pattern_summary` includes patterns suggesting accumulated fatigue (delayed responses, avoided rest, low energy markers)
- `social_pressure_profile.shape` may be `internal_pull` (caring overload) or `mixed`
- The dominant tension is about resource depletion, not about direction or decision

**Primary report angle:**
The user is depleted before they are stuck. Restoring energy and small recovery rhythms is the leading frame; decisions, relationships, and direction are read through the recovery lens.

**Sections to emphasize:**
| Section | Density |
|---|---|
| Emotion and load lens (Section 3) | `heavy` |
| Recovery pattern (Section 7) | `heavy` |
| 7-day plan (Section 8) | `standard` (favor rest-window actions over decision actions) |
| 30-day direction (Section 9) | `light` |
| Relationship distance lens (Section 4) | `standard` |
| Behavior pattern lens (Section 5) | `light` |
| Conflict map (Section 6) | `standard` |
| Save/Revisit (Section 14) | `standard` |

**What to avoid:**
- Treating fatigue as indecision
- Pushing direction/clarity work in section 9 (the user can't act from depletion)
- Long social-pressure analysis when the dominant pattern is internal load
- Heavy 30-day planning (user needs to recover first)

**Sample Japanese framing sentence:**
> 今のあなたは、判断や方向を決められないというより、続けてきた気づかいの負荷が少し重なっている状態かもしれません。まずは、小さな回復の窓を取り戻すところから整理していきます。

**Mode-specific forbidden drift:**
- Drifting into decision-clarity framing ("どちらを選ぶか")
- Treating the user as procrastinating when the pattern is depletion
- Section 8 prescribing busy-day structure
- Section 9 emphasizing milestones or goals

---

### Mode 2 — `direction_focus`

**When to use:**
- `dimension_summary` shows clarity-oriented signals (e.g., decision dimensions present but uncertain)
- `answer_pattern_summary` includes patterns suggesting search for direction (multiple options under consideration, comparison patterns, low resolution between paths)
- `recovery_rhythm` is at least `medium` (user is not in active depletion)
- The dominant tension is about which path/direction, not about resource depletion

**Primary report angle:**
The user has energy and structure but is searching for direction. Stabilization and momentum framing leads; recovery and rest are read as enabling, not as the goal.

**Sections to emphasize:**
| Section | Density |
|---|---|
| Deep state interpretation (Section 2) | `heavy` |
| Behavior pattern lens (Section 5) | `standard` |
| Stabilization / Momentum pattern (Section 7, retitled) | `heavy` |
| 7-day plan (Section 8) | `standard` (favor observation/probe actions over rest) |
| 30-day direction (Section 9) | `heavy` |
| Next visible changes (Section 12) | `standard` |
| Recovery elements (in Section 7) | `light` (mentioned as enabling, not as the goal) |
| Save/Revisit (Section 14) | at least `light` — never 0% |

**What to avoid:**
- Heavy recovery emphasis (the user is not depleted)
- Treating the search for direction as fatigue
- Heavy emotional-load analysis when the dominant pattern is directional
- 30-day plans phrased as recovery milestones
- **Reducing Save/Revisit to 0% even though section 9 is heavy — Save/Revisit remains required.**

**Sample Japanese framing sentence:**
> 今のあなたは、消耗しているというより、複数の方向の間で、自分の重心をどう置き直すかを見つけたい段階にいるかもしれません。動ける足場の置き直し方を、まず整理していきます。

**Mode-specific forbidden drift:**
- Drifting into fatigue-recovery framing as the dominant lens
- Treating direction-search as avoidance
- Section 7 emphasizing rest as the leading recovery action
- **Drifting Save/Revisit toward 0% to free space for 30-day section** — this is forbidden by the global rule

---

### Mode 3 — `relationship_distance`

**When to use:**
- `dimension_summary` shows `social_distance` or `relational_pressure` as a top dimension
- `social_pressure_profile.shape` is `internal_pull`, `external_pull`, or `mixed` with relationship as the source
- `answer_pattern_summary` includes patterns suggesting tension between care and distance (response patterns, presence/absence patterns)
- `contradiction_or_tension_map` includes at least one care/distance tension

**Primary report angle:**
The user is navigating distance and presence with others. Relationships and the felt rhythm of care/distance are the leading frame; recovery and direction are read through the relational lens.

**Sections to emphasize:**
| Section | Density |
|---|---|
| Deep state interpretation (Section 2) | `standard` (frame the care/distance tension early) |
| Relationship distance lens (Section 4) | `heavy` |
| Conflict map (Section 6) | `heavy` |
| Recovery pattern (Section 7) | `standard` (recovery framed in relational terms) |
| 7-day plan (Section 8) | `standard` (favor relational-rhythm actions) |
| 30-day direction (Section 9) | `standard` |
| Save/Revisit (Section 14) | `standard` |

**What to avoid:**
- Generic "balance your relationships" copy without naming the specific tension
- Naming or implying specific people (creepy personalization risk)
- Treating distance as avoidance or distance as the goal
- Recommending relationship "decisions" the user hasn't asked for

**Sample Japanese framing sentence:**
> 今のあなたは、人との関係を雑にしたいわけではなく、関わり続けるための距離の置き方を探している状態かもしれません。距離を取ることと、関係を終わらせることは、別のことです。

**Mode-specific forbidden drift:**
- Drifting into general fatigue framing without naming the relational source
- Section 4 collapsing into generic personality copy
- Section 6 inventing tensions not in the input packet
- Recommending relationship cutoff or merger as outcomes
- Referencing identifiable people, places, or events

---

### Mode 4 — `decision_clarity`

**When to use:**
- `dimension_summary` shows `decision_clarity: low` as the dominant signal
- `answer_pattern_summary` includes patterns suggesting weighing options, avoidance of choice, oscillation
- `action_readiness_profile.readiness` is `medium` to `high` (the user has bandwidth to act, just not direction)
- `recovery_rhythm` is at least `medium`

**Primary report angle:**
The user is at a choice point and the difficulty is the choice itself, not the energy to make it. Naming the decision frame, the tradeoffs visible in the data, and a small probe-and-observe approach leads.

**Sections to emphasize:**
| Section | Density |
|---|---|
| Deep state interpretation (Section 2) | `heavy` (name the decision frame) |
| Behavior pattern lens (Section 5) | `standard` (avoidance patterns are informative here) |
| Conflict map (Section 6) | `heavy` (decision tensions are the core) |
| Recovery pattern (Section 7) | `light` |
| 7-day plan (Section 8) | `standard` (favor probe/test actions, not commitment) |
| 30-day direction (Section 9) | `standard` |
| Reflection questions (Section 10) | `standard` (decision-shaped questions) |
| Save/Revisit (Section 14) | `standard` |

**What to avoid:**
- Pushing a decision direction (the report observes, does not advise)
- Treating the user as procrastinating when the pattern is genuine choice difficulty
- Heavy recovery emphasis (the user is not depleted)
- Reflection questions that ask the user to "just pick" — keep them open

**Sample Japanese framing sentence:**
> 今のあなたは、動けないというより、複数の選択肢のうちどれが自分にとって意味があるか、まだ手触りで確かめている途中かもしれません。決めきる前に、小さく試す方向から整理していきます。

**Mode-specific forbidden drift:**
- Drifting into recommendation of a specific choice
- Section 8 prescribing commitment-level actions
- Treating decision difficulty as character flaw
- Section 9 imposing milestones tied to a specific path

---

### Mode 5 — `rhythm_stabilization`

**When to use:**
- `dimension_summary` shows mixed-shape patterns where no single dimension dominates
- `recovery_rhythm` is `low` to `medium` but the dominant issue is irregularity, not depletion
- `answer_pattern_summary` includes patterns suggesting inconsistency across contexts (good days/bad days, different responses in similar situations)
- `action_readiness_profile.openings` exist but are unpredictable
- The dominant tension is about predictability and pacing rather than direction, depletion, or relationship

**Primary report angle:**
The user has the resources but the rhythm is inconsistent. Recognizing patterns of when things work and when they don't, and small rhythm-stabilization actions, lead.

**Sections to emphasize:**
| Section | Density |
|---|---|
| Deep state interpretation (Section 2) | `standard` (frame as rhythm, not depletion) |
| Behavior pattern lens (Section 5) | `heavy` (when does the pattern hold; when does it slip) |
| Recovery pattern (Section 7) | `heavy` (rhythm-stabilizing recovery, not big rest blocks) |
| 7-day plan (Section 8) | `heavy` (small, repeatable, observable) |
| 30-day direction (Section 9) | `standard` |
| Next visible changes (Section 12) | `standard` (changes that signal rhythm is stabilizing) |
| Save/Revisit (Section 14) | `standard` |

**What to avoid:**
- Treating rhythm inconsistency as character flaw
- Big-block recovery framing (the issue is consistency, not magnitude)
- Decision-clarity framing (the user is not at a choice point)
- Direction-focus framing (the user has direction, the pacing is the issue)

**Sample Japanese framing sentence:**
> 今のあなたは、力が足りないというより、調子の良い日と難しい日のあいだで、リズムを取り戻したい段階にいるかもしれません。小さく続けられる仕組みのほうから整理していきます。

**Mode-specific forbidden drift:**
- Drifting into fatigue-recovery framing as the dominant lens
- Section 7 prescribing extended rest blocks
- Section 8 prescribing all-or-nothing structures
- Treating rhythm slips as failures

---

## 4. Section Emphasis Guidance — Summary Matrix

The following matrix is **density guidance only**, not strict percentages. The drafter uses it to decide where to lean.

| Section | fatigue_recovery | direction_focus | relationship_distance | decision_clarity | rhythm_stabilization |
|---|---|---|---|---|---|
| 1 Summary | standard | standard | standard | standard | standard |
| 2 Deep interpretation | standard | **heavy** | standard | **heavy** | standard |
| 3 Emotion/load | **heavy** | light | standard | standard | standard |
| 4 Relationship lens | standard | light | **heavy** | light | standard |
| 5 Behavior lens | light | standard | standard | standard | **heavy** |
| 6 Conflict map | standard | standard | **heavy** | **heavy** | standard |
| 7 Recovery / Stabilization | **heavy** | **heavy** (retitled Stabilization/Momentum) | standard | light | **heavy** |
| 8 7-day plan | standard | standard | standard | standard | **heavy** |
| 9 30-day direction | light | **heavy** | standard | standard | standard |
| 10 Reflection questions | standard | standard | standard | standard | standard |
| 11 Recommendation hints | standard | standard | standard | standard | standard |
| 12 Next visible changes | light | standard | standard | standard | standard |
| 13 Safety note | required | required | required | required | required |
| 14 Save/Revisit | standard | **at least light — never 0%** | standard | standard | standard |

---

## 5. Mode Confusion Guard

If the packet preparer is uncertain between two modes:

- **fatigue_recovery vs. direction_focus** — check `recovery_rhythm`. If `low`, default to `fatigue_recovery`. The user cannot act on direction from depletion.
- **direction_focus vs. decision_clarity** — check whether the user is searching across paths (direction) or at a defined choice point between specific options (decision).
- **relationship_distance vs. fatigue_recovery** — check whether the load source is relational (use `relationship_distance`) or general (use `fatigue_recovery`).
- **rhythm_stabilization vs. fatigue_recovery** — check whether the issue is magnitude of depletion (fatigue_recovery) or inconsistency of pacing (rhythm_stabilization).
- **decision_clarity vs. relationship_distance** — if the decision is about a specific relationship, use `relationship_distance`; if about a non-relational choice, use `decision_clarity`.

If still uncertain, revise the packet (sharpen the signals) rather than picking arbitrarily. Mode is a load-bearing field — a wrong mode produces a wrong report.
