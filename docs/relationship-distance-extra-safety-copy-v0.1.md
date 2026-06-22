# Yorisou — relationship_distance Extra Safety Copy v0.1

**Status:** Copy and policy specification only. Not implementation approval.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **`relationship_distance` remains high-sensitivity and is not approved for user-facing delivery by this document.**

---

## 1. Why relationship_distance Needs Extra Safety Copy

The `relationship_distance` mode (see `docs/main-state-mode-rules-v0.2.md` and `docs/report-main-state-mode-writing-rules-v0.2.md`) interprets a user's pattern in terms of relational care, distance, and contact rhythm. This mode carries a different risk profile from the other four modes:

- The user is reading about a state that involves at least one other person
- Identifiable-person inference is a creepy-personalization risk if the report drifts toward specifics
- Misreading the report as advice to contact, not contact, end, deepen, or change a relationship can produce real harm in the user's life
- The presence of coercive or dangerous relationship dynamics is not detectable from a check-in, and any report that recommends action could be read as guidance in a situation where Yorisou is not the right tool

For these reasons, every relationship-related report — regardless of the source test or persona — carries a mandatory extra safety surface above and beyond the standard report safety note (Section 13). This document defines that surface as text only.

`relationship_distance` reports are also subject to a reviewer checklist that goes beyond the standard quality gate.

---

## 2. Short UI Copy

**Display:** in the consent flow at Step 3 (report boundary confirmation), shown only when `main_state_mode` is `relationship_distance`. Required acknowledgment before proceeding.

```
このレポートは、相手の気持ちや意図を判断するものではありません。
連絡を取る・取らない、関係を続ける・終わらせる、といった判断を行うものでもありません。
読めるのは、いまのあなた自身の反応の間合いと、戻ってこられる距離の整理です。
```

### Checkbox label

```
このレポートが、相手についての判断や、関係の方向を決めるものではないことを理解しました。
```

---

## 3. Full Pre-Report Copy

**Display:** on the report delivery screen (Step 7), before Section 1 content, only for `relationship_distance` reports.

```
このレポートを読み始める前に、もう一度ご確認ください。

このレポートは、Yorisouがあなたの回答パターンから読み取ったいまの状態を、
人との関わりにおける「間合い」と「戻ってこられる距離」という視点から整理したものです。

このレポートは、次のことは行いません。

- 相手の方の気持ちや意図を推測すること
- 連絡を取るかどうかの判断
- 関係を続ける、終わらせる、復縁する、告白する、ブロックするなどの判断
- 直接話し合うことや、いま行動を起こすことへの後押し

このレポートが見ているのは、相手ではなく、あなた自身の側の負荷と、休まり方です。

もし、いまの状況がご自身にとって、安全でない、または相手のふるまいが
怖い・コントロールされていると感じる場面が含まれる場合、
Yorisouは、その状況に対応する適切な道具ではありません。
そのときは、信頼できる人や、公的・専門的な相談先を確認することが、より大きな助けになります。
```

---

## 4. In-Report Safety Note (relationship_distance specific)

**Display:** appended to Section 13 of the report (after the standard safety note text), only for `relationship_distance` reports.

```
このレポートは、相手の方の気持ちや意図を判断するものではありません。
連絡や関係の方向に関する具体的な判断は行いません。
読めるのは、あなた自身の反応の間合いと、戻ってこられる距離の整理です。

危険を感じる状況、コントロールされていると感じる関係、
ご自身やまわりの方の安全が心配な状況にある場合、Yorisouは適切な道具ではありません。
信頼できる人や、公的・専門的な相談先を確認することを優先してください。
```

Section 13's primary text remains verbatim per `docs/paid-report-template-specification-v0.1.md`. The relationship-distance text is appended; it does not replace.

---

## 5. Reviewer Checklist (Mandatory for All Relationship-Related Reports)

This checklist is mandatory for any report where the source test is relationship-related (e.g., `relationship_fatigue`, `love_distance`) and for any report where `main_state_mode` is `relationship_distance`. It supplements the standard reviewer checklist from `docs/report-generation-quality-gate-v0.2.md` Section 6.

| # | Check | Pass criteria |
|---|---|---|
| 1 | **No partner feelings inference** | Report does not state, imply, or speculate about what the other person feels, intends, thinks, or wants |
| 2 | **No partner intention / psychology inference** | Report does not analyze the other person's character, motives, attachment style, history, or mental state |
| 3 | **No contact / no-contact advice** | Report does not recommend, suggest, or imply that the user should reach out, stay silent, increase, or decrease contact |
| 4 | **No breakup advice** | Report does not recommend, suggest, or imply ending the relationship |
| 5 | **No reconciliation advice** | Report does not recommend, suggest, or imply repairing, reuniting with, or returning to the relationship |
| 6 | **No confession advice** | Report does not recommend disclosure, declaration, or revelation of feelings |
| 7 | **No blocking advice** | Report does not recommend blocking, removing, or technically severing contact |
| 8 | **No relationship continuation directive** | Report does not direct the user to maintain the relationship in any form |
| 9 | **No pressure toward direct conversation** | Report does not urge a face-to-face talk, a "have the conversation," or a "be honest with them" step |
| 10 | **No over-explaining the other's feelings** | The report does not provide explanations for the other person's behavior on their behalf |
| 11 | **Distance does not read as rejection** | The report's distance framing does not imply the user is rejecting the other person |
| 12 | **Distance does not read as punishment** | The report's distance framing does not imply punishment of the other person |
| 13 | **Distance does not read as abandonment** | The report's distance framing does not imply abandoning the other person |
| 14 | **Distance does not read as manipulation** | The report's distance framing does not imply strategic emotional manipulation |
| 15 | **Danger / coercion boundary note visible** | The in-report safety note from Section 4 of this document is present and unmodified |
| 16 | **Focus stays on user's own side** | The report's content concerns the user's reaction interval, communication load, and returnable distance — not the relationship dynamics |

Any item that fails returns the report to drafting. The report may not be delivered (or, for internal pilot, archived as approved) until all 16 items pass.

---

## 6. What This Document Asserts (Load-Bearing Statements)

The following statements are load-bearing and must be reflected in any UI, report, or downstream surface that handles `relationship_distance` content:

- **Yorisou does not infer the other person's feelings.** No section may speculate about what someone else feels.
- **Yorisou does not decide contact or no-contact.** No section may recommend reaching out or staying silent.
- **Yorisou does not advise breakup, reconciliation, confession, blocking, or relationship continuation.** No directive on the relational outcome.
- **The report focuses only on the user's own reaction interval, communication load, and returnable distance.** Anything outside this scope is out of bounds for this mode.
- **If the user is in danger or in a coercive situation, Yorisou is not the right tool.** The safety note and pre-report copy both make this explicit. Appropriate support should be prioritized.

---

## 7. Scope Restriction — Repeated Load-Bearing Statement

> **`relationship_distance` remains high-sensitivity and is not approved for user-facing delivery by this document.** It may be tested next only as an internal packet with an internal draft under `docs/internal-real-input-pilot-plan-v0.1.md` constraints, unless Edward separately approves volunteer or external use and the consent handling for that round.

---

## 8. Edward Approval Required

Every copy block, every checklist item, and every load-bearing statement in this document requires Edward's approval before being used in any user-facing surface or applied as a reviewer-binding standard.

---

> **`relationship_distance` remains high-sensitivity and is not approved for user-facing delivery by this document.**
