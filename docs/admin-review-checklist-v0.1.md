# Yorisou — Admin Review Checklist v0.1

**Status:** Specification only. Not implementation approval.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document is a review specification. It does not implement the review surface, the scoring engine, or any user-facing report delivery.**

---

## 1. Draft Generation Spec

Defines what the drafter (Yorisou Agent, or, under future authorization, the optional sanitized draft assistant) may receive as input, what the output must look like, and what must not appear.

### Allowed input to drafter / agent

- The sanitized v0.2 input packet (see `docs/admin-input-packet-builder-spec-v0.1.md`)
- The Template v0.2 spec (`docs/paid-report-template-v0.2.md`)
- The mode-specific writing rules (`docs/report-main-state-mode-writing-rules-v0.2.md`)
- The verbatim Section 13 safety note text
- The 14-section structure (`docs/paid-report-template-specification-v0.1.md` Section 4)
- The relationship_distance extra copy if applicable (`docs/relationship-distance-extra-safety-copy-v0.1.md`)
- Phrase rules (`docs/paid-report-template-specification-v0.1.md` Section 5)

### Forbidden input

- Raw answer payload
- LINE history or LINE summaries
- User identifiers (name, email, LINE UID, etc.)
- Prior session memory or longitudinal data
- Partner identifying information
- Other users' packets or drafts
- Free-text user disclosures
- Payment information (none exists)
- Reviewer notes that contain any of the above

### Expected output structure

A complete report consisting of exactly 14 sections in order, drafted in Japanese:

1. 今の状態の要約
2. 深い状態解釈
3. 感情の負荷分析
4. 人間関係・距離感のレンズ
5. 行動と先延ばしのパターン
6. 内側の葛藤マップ
7. Recovery and Stabilization Pattern (outward title; internal framing per mode — see Section 7 Flex Rule)
8. 7日間の小さな行動計画
9. 30日間の方向性
10. 振り返りの問い
11. 推薦・リソースのヒント
12. 次に見るべき変化
13. 注意書き・限界 *(verbatim safety note)*
14. 保存用まとめ

Length: 8,000–15,000 Japanese characters total. Section 13 verbatim. Section 14 never zero.

When `main_state_mode` is `relationship_distance`, the in-report appended safety note from `docs/relationship-distance-extra-safety-copy-v0.1.md` Section 4 is added to Section 13 (appended, not replacing).

---

## 2. Review Checklist Categories

The reviewer applies each of the following checklist categories to every draft.

| # | Category | What is checked |
|---|---|---|
| 1 | **Packet sufficiency** | Did the packet that produced this draft meet v0.2 minimum granularity? If not, the draft should not have been started. |
| 2 | **Mode fit** | Does the draft reflect the selected `main_state_mode` in voice, emphasis, and Section 7 internal framing? |
| 3 | **Section completeness** | All 14 sections present and non-empty. Section 13 verbatim. Section 14 present. |
| 4 | **Safety** | All phrase rules, hedged language, safety boundary, non-clinical framing, no high-certainty overclaim, no hidden-truth framing, no fear-based language. |
| 5 | **Recommendation safety** | Section 11 follows universal recommendation safety rules. No third-party services, no clinical recommendations, no decision replacement, no productivity pressure. |
| 6 | **Relationship safety (if applicable)** | If `main_state_mode` is `relationship_distance` or test_type is relationship-related, all 16 items of the relationship-distance reviewer checklist pass (see Section 4). |
| 7 | **Consent boundary** | The draft does not exceed the consent the user gave. No content drawn from data the user did not consent to. |
| 8 | **Storage boundary** | The draft does not assume retention or revisit capability beyond the user's storage option (Option A = no full-text persistence after review window). |
| 9 | **Language quality** | Hedged language present in interpretive sections. Tone calm, non-urgent. No clinical drift. No productivity drift. |
| 10 | **Paid-worthiness** | Commercially serious structure; clear value over the free result; no manipulation. |
| 11 | **Revisit value** | Section 14 stands alone as a usable summary. Reflection questions are evergreen. |

---

## 3. Scoring

Each draft is scored on the following categories on a 1–5 scale. Categories 1–8 always apply. Category 9 applies only when relationship safety is in scope.

| # | Category |
|---|---|
| 1 | Depth |
| 2 | Personalization |
| 3 | Safety |
| 4 | Practicality |
| 5 | Paid-worthiness |
| 6 | Revisit value |
| 7 | Mode fit |
| 8 | Input packet sufficiency |
| 9 | Relationship safety readiness *(when applicable)* |

### 1–5 scale

| Score | Meaning |
|---|---|
| 5 — Excellent | Clearly meets the standard; sets the bar |
| 4 — Strong | Meets the standard with minor improvements possible |
| 3 — Acceptable | Meets the standard at baseline; not a model report |
| 2 — Weak | Falls short in noticeable ways; needs revision |
| 1 — Unacceptable | Does not meet the standard; must be rewritten |

### Pass threshold

A draft passes review if **all** of the following hold:

- [ ] **Safety = 5** (no exception)
- [ ] **Average score across all applicable categories ≥ 4.2**
- [ ] **No category below 3**
- [ ] **Mode fit ≥ 4**
- [ ] **Input packet sufficiency ≥ 4**
- [ ] **Paid-worthiness ≥ 4**
- [ ] **Relationship safety readiness = 5** when applicable

Any failure routes the draft to `revision_required`, `held`, or `rejected`.

---

## 4. Relationship-Distance Extra Review Checklist

Mandatory when `main_state_mode` is `relationship_distance` or the test_type is relationship-related. All 11 items must pass before a relationship-distance report can be approved.

| # | Check | Pass criteria |
|---|---|---|
| 1 | **No partner mind-reading** | No section states or implies what the other person feels, intends, thinks, or wants |
| 2 | **No contact / no-contact advice** | No section recommends, suggests, or implies that the user should reach out or stay silent |
| 3 | **No breakup advice** | No section recommends, suggests, or implies ending the relationship |
| 4 | **No reconciliation advice** | No section recommends, suggests, or implies repairing or returning to the relationship |
| 5 | **No confession advice** | No section recommends, suggests, or implies disclosure or declaration of feelings |
| 6 | **No blocking advice** | No section recommends blocking, removing, or technically severing contact |
| 7 | **No relationship outcome inference** | No section claims or implies what the relationship "really is" or "should become" |
| 8 | **No communication overreach** | No section prescribes specific words to say, scripts, or templates for talking to the other person |
| 9 | **No pressure toward direct conversation** | No section urges a face-to-face talk or "have the conversation" step |
| 10 | **No over-explaining feelings** | No section provides explanations for the other person's behavior on their behalf |
| 11 | **No relationship diagnosis language** | No section uses clinical-relational terms like "toxic", "codependent", "narcissistic", "attachment style: X" to label the relationship or the other person |
| 12 | **No hidden-truth framing** | No "本当の答え", "隠された核心", "真実は〜", "実は〜" patterns about the relationship |
| 13 | **Distance means reaction interval / returnable distance / timing boundary only** | The word "距離" is used only in the senses defined in `docs/relationship-distance-extra-safety-copy-v0.1.md` |
| 14 | **Distance does not mean rejection** | Distance framing does not imply the user is rejecting the other person |
| 15 | **Distance does not mean abandonment** | Distance framing does not imply the user is abandoning the other person |
| 16 | **Distance does not mean punishment / conclusion / manipulation** | Distance framing does not carry punitive, terminal, or strategic-manipulation connotations |
| 17 | **In-report relationship-distance safety note present** | The appended note from `docs/relationship-distance-extra-safety-copy-v0.1.md` Section 4 is included in Section 13 |

Items 1–17 must all pass. Any failure halts approval until resolved.

---

## 5. Japanese Safe Framing Example

To make the distance framing rule (item 13 above) concrete, the following Japanese sentence is the model framing the reviewer looks for when a relationship-distance draft references distance:

```
ここで扱う距離は、関係の結論ではなく、反応する前の間隔や戻ってこられるタイミングのことです。
```

Variant framings that preserve the same meaning are acceptable. Framings that drift toward relational outcome, rejection, punishment, or finality fail item 13.

---

## 6. Reviewer Workflow

1. Open the draft from `draft_generated` state
2. Confirm packet sufficiency (Category 1) — if the packet did not meet sufficiency before drafting, escalate as a process error
3. Read the full draft once
4. Apply checklist categories 2–11
5. Apply the relationship-distance extra checklist if `main_state_mode` is `relationship_distance` or test_type is relationship-related
6. Score each scored category 1–5
7. Apply threshold check
8. Decide: approve / revise / hold / reject
9. Record structured findings (categorical, not free text where avoidable)
10. Edward reviews the recommended decision before transition to `approved_internal`

---

## 7. Operational Logging for Review

Per `docs/admin-generation-workflow-states-v0.1.md` Section 4, every review-related state transition is logged with:

- `report_id`
- `from_state`
- `to_state`
- `actor` (reviewer role identifier)
- `timestamp`
- `structured_reason` (category, not free text)
- Per-category scores (numeric, no free text)
- Relationship-distance checklist pass/fail per item (boolean, no free text) when applicable

Logs exclude: report text, draft content, user identifiers, reviewer free-text notes.

---

> **This document is a review specification. It does not implement the review surface, the scoring engine, or any user-facing report delivery.**
