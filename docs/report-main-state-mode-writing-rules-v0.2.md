# Yorisou — Report Main State Mode Writing Rules v0.2

**Status:** Specification only. Not implementation approval.
**Version:** v0.2
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document is a writing methodology specification. It does not approve user delivery, volunteer testing, payment, automation, or any external use.**

---

## 1. Purpose

This document defines the writing rules the drafter applies once `main_state_mode` has been selected for a report. It complements `docs/main-state-mode-rules-v0.2.md` (mode selection and section emphasis) with per-mode language, metaphor, sectioning, drift, safety, recommendation style, and sample openings.

---

## 2. Global Rules

- All 14 sections remain required regardless of mode.
- Section 13 (safety note) is always verbatim per `docs/paid-report-template-specification-v0.1.md`.
- Section 14 (Save/Revisit Summary) is never reduced to 0%, regardless of mode emphasis.
- Phrase rules from `docs/paid-report-template-specification-v0.1.md` Section 5 apply to all modes.
- Mode language must be present in the report's voice; the reader should be able to identify the mode from reading the report blind.

---

## 3. Mode Writing Rules

---

### Mode 1 — `fatigue_recovery`

**Primary language:**
- 「重なる」「少し残っている」「戻ってこられる」「整える」「窓を取り戻す」
- Verbs of slowing, restoring, observing rather than deciding
- Hedged interpretive language ("〜かもしれません")

**Preferred metaphors:**
- Small windows of rest / breath / pause
- Accumulated weight that is unloaded one item at a time
- Returning to a baseline that the user already knows

**Sections to emphasize:**
- Section 3 (Emotion/Load Lens) — heavy
- Section 7 (Recovery and Stabilization Pattern) — heavy
- Section 8 (7-Day Plan) — standard, rest-window oriented

**Sections to keep secondary:**
- Section 5 (Behavior Pattern Lens) — light
- Section 9 (30-Day Direction) — light
- Section 12 (Next Visible Changes) — light

**Forbidden drift:**
- Treating depletion as procrastination
- Pushing direction or decision framing as the leading lens
- Heavy 30-day milestone planning
- Productivity language ("効率")

**Safety risks:**
- Implying the user is broken or needs treatment
- Recommending intense rest as a fix (medicalization)
- Suggesting the user "just rest more" without acknowledging operational constraints

**Recommendation style:**
- Topic seeds about small recovery windows, rhythm-of-rest, recognizing depletion early
- Never recommends specific products, services, or clinical resources
- Frames as: "選択肢として〜について調べてみることが、助けになるかもしれません"

**Sample Japanese opening sentence:**
> 今のあなたは、判断や方向を決められないというより、続けてきた気づかいの負荷が少し重なっている状態かもしれません。

---

### Mode 2 — `direction_focus`

**Primary language:**
- 「方向」「重心」「動ける足場」「置き直す」「整える」「確かめる」
- Verbs of orienting, repositioning, observing what holds
- Less hedging on agency; more hedging on outcome

**Preferred metaphors:**
- Standing at a vantage point and looking across several paths
- Setting down weight that is no longer needed
- A compass that needs calibration, not a battery that needs charging

**Sections to emphasize:**
- Section 2 (Deep State Interpretation) — heavy
- Section 7 (retitled internally as Stabilization / Momentum Pattern) — heavy
- Section 9 (30-Day Direction) — heavy

**Sections to keep secondary:**
- Section 3 (Emotion/Load Lens) — light
- Section 4 (Relationship Distance Lens) — light
- Section 7 recovery sub-framing — light (mentioned as enabling, not the goal)

**Forbidden drift:**
- Fatigue-recovery framing as the dominant lens
- Treating direction search as avoidance
- Recovery-only Section 7
- Reducing Save/Revisit toward 0% to free space for Section 9

**Safety risks:**
- Pushing the user toward a specific direction
- Implying the user is "stuck" in a problematic way
- Goal-setting language that pressures commitment

**Recommendation style:**
- Topic seeds about orientation, small probes, observing what holds when tested
- Frames as: "次の一歩を決める前に、いくつかの方向に少し触れて、自分の反応を見ることが助けになるかもしれません"

**Sample Japanese opening sentence:**
> 今のあなたは、消耗しているというより、複数の方向の間で、自分の重心をどう置き直すかを見つけたい段階にいるかもしれません。

---

### Mode 3 — `relationship_distance`

**Primary language:**
- 「距離」「余白」「気づかい」「関わり方」「整える」
- Verbs of adjusting, observing, holding space rather than deciding about people
- Care-and-distance language as complementary, not opposite

**Preferred metaphors:**
- The space between two presences as a third thing that can be tended
- Adjusting the rhythm of contact, not the depth of care
- Setting a tempo for response rather than a rule

**Sections to emphasize:**
- Section 2 (Deep State Interpretation) — standard, frame the care/distance tension early
- Section 4 (Relationship Distance Lens) — heavy
- Section 6 (Conflict Map) — heavy

**Sections to keep secondary:**
- Section 9 (30-Day Direction) — standard
- Section 12 (Next Visible Changes) — standard

**Forbidden drift:**
- Generic "balance your relationships" copy
- Naming or implying specific people
- Treating distance as avoidance or as the goal
- Recommending relationship "decisions" the user has not asked for

**Safety risks:**
- Identifiable-person inference (creepy personalization)
- Implying the user should end or merge a relationship
- Framing care as pathological

**Recommendation style:**
- Topic seeds about response tempo, care without immediate reply, recognizing when distance is care
- Never recommends specific relationship structures or actions toward identifiable people
- Frames as: "返す前・決める前・会った後に、少し余白を置くことを試してみる選択肢があります"

**Sample Japanese opening sentence:**
> 今のあなたは、人との関係を雑にしたいわけではなく、関わり続けるための距離の置き方を探している状態かもしれません。

**Controller correction (load-bearing):**
`relationship_distance` remains safety-sensitive and is **not approved for volunteer or external-user testing by this document**. It may only be tested next as an internal packet with an internal draft, unless Edward separately approves volunteer/external use and the consent handling for that round.

---

### Mode 4 — `decision_clarity`

**Primary language:**
- 「選択」「重心」「手触り」「試す」「確かめる」「観る」
- Verbs of probing, comparing, suspending, observing
- No prescriptive verbs ("〜すべき", "〜したほうがいい")

**Preferred metaphors:**
- Touching each option with the back of the hand before committing
- Holding two paths in view until the difference becomes felt, not theoretical
- A small probe that returns information, not a commitment

**Sections to emphasize:**
- Section 2 (Deep State Interpretation) — heavy, name the decision frame
- Section 5 (Behavior Pattern Lens) — standard
- Section 6 (Conflict Map) — heavy
- Section 10 (Reflection Questions) — standard, decision-shaped

**Sections to keep secondary:**
- Section 7 (Recovery and Stabilization Pattern) — light
- Section 9 (30-Day Direction) — standard

**Forbidden drift:**
- Pushing toward a specific choice
- Treating decision difficulty as procrastination
- Heavy recovery emphasis
- Reflection questions that ask the user to "just pick"

**Safety risks:**
- Implying one choice is correct
- Implying the user is failing by not having chosen
- Suggesting decision aids that constitute professional advice

**Recommendation style:**
- Topic seeds about small probe-and-observe approaches, suspending decision until felt difference emerges
- Frames as: "決めきる前に、選択肢のひとつに小さく触れて、自分の反応の手触りを確かめてみる方法があります"

**Sample Japanese opening sentence:**
> 今のあなたは、動けないというより、複数の選択肢のうちどれが自分にとって意味があるか、まだ手触りで確かめている途中かもしれません。

---

### Mode 5 — `rhythm_stabilization`

**Primary language:**
- 「リズム」「続けられる」「小さく」「揃える」「整える」「ばらつき」
- Verbs of pacing, stabilizing, recognizing patterns
- Inconsistency-as-information language, not inconsistency-as-failure

**Preferred metaphors:**
- A wave that finds its own period when small inputs are consistent
- A tuning rather than a fixing
- Small repeatable actions that compound

**Sections to emphasize:**
- Section 5 (Behavior Pattern Lens) — heavy (when does it hold, when does it slip)
- Section 7 (retitled internally as Rhythm / Transition Stabilization) — heavy
- Section 8 (7-Day Plan) — heavy, small repeatable observable
- Section 12 (Next Visible Changes) — standard

**Sections to keep secondary:**
- Section 9 (30-Day Direction) — standard
- Section 3 (Emotion/Load Lens) — standard

**Forbidden drift:**
- Treating rhythm slips as failures
- Big-block recovery framing
- Decision-clarity framing
- All-or-nothing structures

**Safety risks:**
- Implying the user lacks discipline
- Habit-stacking prescriptions that resemble productivity advice
- Self-improvement framing

**Recommendation style:**
- Topic seeds about small repeatable inputs, recognizing rhythm signals, gentle anchors
- Frames as: "小さく続けられる一つの動きを、まず7日間だけ観てみる方法があります"

**Sample Japanese opening sentence:**
> 今のあなたは、力が足りないというより、調子の良い日と難しい日のあいだで、リズムを取り戻したい段階にいるかもしれません。

---

## 4. Section 7 Flex Rule

Section 7's **outward title remains stable** for structural consistency across reports:

> **Recovery and Stabilization Pattern**

The drafter's **internal framing of what stabilization means in this report** changes by mode:

| Mode | Internal framing |
|---|---|
| `fatigue_recovery` | recovery / stabilization (literal restoration of depleted resources) |
| `direction_focus` | momentum stabilization (stabilizing the ground from which to move) |
| `relationship_distance` | relational distance stabilization (stabilizing the rhythm of contact and care) |
| `decision_clarity` | decision-flow stabilization (stabilizing the conditions under which choice becomes felt) |
| `rhythm_stabilization` | rhythm / transition stabilization (stabilizing pacing and consistency) |

**Rules:**

- The outward title may remain `Recovery and Stabilization Pattern` for cross-report consistency
- The **internal framing** must change by mode — the section's content must reflect the mode's specific stabilization meaning
- Do not force all modes into fatigue/recovery language inside Section 7
- The drafter should ask, before writing Section 7: **"What needs to become stable for this user's current mode?"**
- A section that reads like fatigue/recovery copy when the mode is `direction_focus` is a mode collapse and must be revised

---

## 5. Cross-Mode Voice Consistency

Regardless of mode:

- Hedged language is required in interpretive sections (sections 2–6)
- The user is the agent; the report observes
- Tone is calm, non-urgent, non-prescriptive
- No certainty overclaims, no clinical framing, no future-as-prediction language
- Safety boundary note is present in Section 11
- Section 13 is verbatim
- Section 14 stands alone as a usable summary

Mode language is a *coloring*, not a replacement, of the v0.1 phrase rules. The base safety and tone standards always govern.

---

> **This document is a writing methodology specification. It does not approve user delivery, volunteer testing, payment, automation, or any external use.**
