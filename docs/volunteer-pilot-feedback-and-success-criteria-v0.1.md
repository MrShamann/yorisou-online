# Yorisou — Volunteer Pilot Feedback and Success Criteria v0.1

**Status:** Plan / specification only. Not approval to start.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document does not approve feedback collection from any user. It defines the feedback question set, use rules, and success criteria that would apply if Edward separately authorizes a pilot.**

---

## 1. Feedback Question Set

All questions are optional. Each presents a "答えない" / "スキップ" option. Question 12 is explicitly optional and not required to complete the form. The free-comment field carries a warning against including sensitive details.

This question set supersedes the v0.1 feedback set in `docs/detailed-report-feedback-consent-v0.1.md` for the volunteer pilot context, with the same use rules and forbidden categories.

---

### 1. Report felt based on current answers?

```
このレポートは、今回のチェック回答にもとづいて書かれていると感じましたか?
```
Options: はい / まあまあ / いいえ / スキップ

---

### 2. Felt accurate?

```
書かれていた内容は、いまの自分の感覚と合っていると感じましたか?
```
Options: 合っていた / 部分的に合っていた / 合わなかった / スキップ

---

### 3. Too generic?

```
内容が、誰にでも当てはまりそうな一般的な内容に感じた部分はありましたか?
```
Options: いいえ、具体的だった / 一部、一般的に感じた / 全体的に一般的だった / スキップ

---

### 4. Too personal?

```
逆に、内容が「自分のことを知りすぎている」ように感じて不安になった部分はありましたか?
```
Options: いいえ / 少しあった / あった(差し支えなければどの部分か教えてください) / スキップ

---

### 5. Easy to understand?

```
レポートの言葉づかいや構成は、読みやすかったですか?
```
Options: 読みやすかった / 一部読みにくかった / 読みにくかった / スキップ

---

### 6. Too long / too short?

```
全体の長さは、どう感じましたか?
```
Options: ちょうどよかった / 少し長かった / かなり長かった / 短かった / スキップ

---

### 7. Useful 7-day action?

```
7日間の小さな行動の部分は、実際にやってみられそうだと感じましたか?
```
Options: やってみられそう / 一部はやってみられそう / 難しそう / スキップ

---

### 8. Useful 30-day direction?

```
30日間の方向性の部分は、いまの自分にとって役に立つと感じましたか?
```
Options: 役に立つ / 一部役に立つ / 役に立たない / スキップ

---

### 9. Worth revisiting?

```
このレポートを、後日もう一度読み返したいと感じましたか?
```
Options: 読み返したい / たぶん読み返さない / スキップ

---

### 10. Felt like advice / diagnosis?

```
読んでいて、診断やアドバイスを受けているように感じた部分はありましたか?
```
Options: いいえ、整理として読めた / 少しそう感じた / 強くそう感じた / スキップ

---

### 11. Uncomfortable wording?

```
読んでいて、不快に感じた言葉や表現はありましたか?
```
Options: いいえ / あった(差し支えなければどの部分か教えてください) / スキップ

---

### 12. Future payment possibility (optional)

```
将来、このような詳細レポートが提供される場合、有料でも検討できる内容だと感じましたか?
このご質問は完全に任意で、ご回答内容にかかわらず、今後のご案内や対応に影響しません。
```
Options: 検討できる / わからない / 検討しない / 答えない

---

### Open comment

```
そのほか、お気づきの点があれば自由にお聞かせください。
```

Required warning displayed below the field:

```
このコメント欄には、お名前、相手の方の特定につながる情報、健康・危機状況の詳細、
支払いに関する情報、LINE やメッセージのやり取り内容は、書かないでください。
具体的な人や状況の情報は、内部の改善でも扱いきれないため、削除させていただくことがあります。
```

---

## 2. Feedback Use Rules

| Rule | Meaning |
|---|---|
| **Internal review only** | Feedback is used by Edward and the methodology reviewer to improve report quality. No other use. |
| **No public testimonial** | Feedback is not used as a testimonial, marketing copy, social proof, or any public material. |
| **No model training** | Feedback content is not used to train or fine-tune any AI model. |
| **No sample reuse without separate consent** | The feedback content (and the report it refers to) is not reused as a methodology sample without the user's separate explicit consent and an anonymization review. |
| **Can be skipped** | Every question is optional. The entire feedback step is optional. Skipping is normal and has no consequence. |
| **Forbidden collection categories** | Names, partner identity, detailed private circumstances, health/crisis details, payment details, raw chat history. The free-comment warning is explicit; submissions containing these are redacted before storage. |

These use rules carry forward from `docs/detailed-report-feedback-consent-v0.1.md` Section 5.

---

## 3. Quantitative Success Criteria

The pilot, when authorized, is considered quantitatively successful when **all** of the following hold across the cohort:

- [ ] **≥ 80% of users understand the data-use boundary** (Q1 "はい" + Q4 "いいえ" patterns, plus Q10 "いいえ、整理として読めた")
- [ ] **≥ 80% of users say the report reflects their current answers** (Q1 "はい" or "まあまあ")
- [ ] **≥ 70% of users say it is useful to revisit** (Q9 "読み返したい")
- [ ] **0 safety incidents** (no crisis-handling escalation, no harmful misreading)
- [ ] **0 diagnosis/advice misunderstandings requiring correction** (Q10 "強くそう感じた" requires direct correction; if any occurs, hold)
- [ ] **Manual review workload acceptable** (Edward's per-report review time sustainable at cohort size)
- [ ] **No deletion/non-use process failure** (all requests honored within stated capability; no broken promises)
- [ ] **No relationship-distance safety failure** (not applicable in first cohort since the mode is excluded; remains a criterion for any future cohort that includes it)
- [ ] **Average quality score ≥ 4.2** across the eight base scored categories
- [ ] **Safety = 5 for all delivered reports**

A pilot that fails any of these is **not considered successful**. Continuation requires methodology revision or pilot suspension per the stop/hold conditions in Section 5.

---

## 4. Qualitative Success Criteria

The pilot is considered qualitatively successful when:

- The report reads as **reflective, not deterministic** — users describe it as integrating, not deciding for them
- Users report **no pressure** — neither commercial pressure to buy nor pressure to act on the report's contents
- Users **understand that no LINE history and no memory** was used — Q1 / Q4 / consent comprehension checks support this
- Users can **identify at least one useful section** — the report is not uniformly forgettable; specific value is recognizable

These criteria are met in conversation and qualitative review of feedback responses, not by hard thresholds.

---

## 5. Stop / Hold Conditions

If any of the following occurs during the pilot, the pilot **stops or holds** immediately:

| # | Condition | Action |
|---|---|---|
| 1 | **Crisis or sensitive content surfaces in any submission** | Hold cohort; address the specific case; do not proceed without Edward review of safety surface |
| 2 | **Consent confusion** — a user appears not to have understood what they agreed to | Hold cohort; revise consent copy; do not continue with the unclear consent |
| 3 | **Diagnostic / advice-like reading** — a user reads the report as a diagnosis or directive | Hold cohort; revise template language and the boundary copy; surface as methodology gap |
| 4 | **Reviewer workload too high** — Edward's per-report time is unsustainable | Stop cohort expansion; reduce batch size; do not lower review depth to maintain cadence |
| 5 | **Storage / deletion uncertainty** — a user requests deletion and the process cannot honor the request cleanly | Hold cohort; fix the storage/non-use process before continuing |
| 6 | **Medical / legal / financial / relationship-decision request** from a user — the user asks the report to make such a decision | Hold the specific case; clarify the boundary; surface as methodology copy gap |
| 7 | **Any safety issue** in any delivered report (Safety < 5 post-hoc) | Hold cohort; full safety review of the affected report; root-cause the gap |
| 8 | **Any report cannot reach Safety = 5** despite revision | Reject the report; do not deliver; document as methodology gap |
| 9 | **Expectation of instant automation** — users expect automatic, fast delivery in a way the manual pilot cannot meet | Revise pilot copy and timing communication; hold if expectation cannot be reset |
| 10 | **Repeated sensitive feedback submissions** — users repeatedly include names, partner identity, health details, etc. in feedback | Hold feedback collection; revise the warning copy; review whether the form invites over-disclosure |

A stop/hold is recorded with structured reason. Resuming after a stop/hold requires Edward to confirm the underlying issue is resolved.

---

## 6. Recording Outcomes

For each pilot report, the outcome record captures:

- `report_id`
- Cohort identifier
- Final state (delivered / held / rejected)
- Per-question feedback responses (categorical; free-comment redacted if present)
- Quantitative success criteria contribution (e.g., Q1 answer flagged)
- Stop/hold marker if applicable
- Edward's qualitative note (short, structured, no user-identifying content)

The outcome record follows safe-logging rules. No report text, no user identifiers, no free-text user disclosures.

---

> **This document does not approve feedback collection from any user. It defines the feedback question set, use rules, and success criteria that would apply if Edward separately authorizes a pilot.**
