# Yorisou — 詳細レポート Feedback Consent v0.1

**Status:** Copy and policy specification only. Not implementation approval.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document is a feedback consent specification. It does not implement feedback collection, storage, analysis, or any user-facing feedback surface.**

---

## 1. Feedback Consent Principles

| Principle | Meaning |
|---|---|
| **Optional** | Feedback is fully optional. The user can decline at delivery or any time after. |
| **No disadvantage** | Declining does not reduce the report, restrict future participation, or affect any consideration. |
| **Internal improvement only** | Feedback is used to improve the methodology and report quality. No other purpose. |
| **No public / testimonial use** | Feedback is not used as a testimonial, marketing copy, sample, social proof, or in any public-facing material — without separate, explicit, named permission. |
| **No model training** | Feedback content is not used to train or fine-tune any AI model. |
| **Avoid sensitive details** | The feedback prompt actively asks the user not to include sensitive personal details, names, partner identities, or specific private circumstances. |

---

## 2. Japanese Short Copy

**Display:** at the top of the feedback screen.

```
お読みいただいた感想を、いくつかお聞かせいただけたらうれしいです。
ご回答は任意です。お答えにくいものはとばしてかまいません。
いただいた内容は、内部のレポート品質改善のためにのみ使います。
お名前を出した形での公開や、宣伝のための利用は行いません。
```

---

## 3. Checkbox Label

**Display:** above the feedback form. Required to be checked before any feedback field is submittable.

```
このフィードバックを、内部の品質改善のためにのみ使うことに同意します。
```

### Helper text (below checkbox)

```
このフィードバックは、ほかの目的(宣伝、サンプル、AIモデル学習など)には使いません。
お名前や、相手の方の特定につながる詳細を、自由記述欄に書かないようお願いします。
```

### Error text if unchecked (only required if any feedback field has content)

```
フィードバックを送る前に、ご利用範囲のご確認とご同意をお願いします。
このまま送らずに画面を閉じることもできます。
```

---

## 4. Feedback Question Set

All questions are optional. Each question presents a "答えない" or "スキップ" option.

### 1. Felt based on current answers?

**Question:**
```
このレポートは、今回のチェック回答にもとづいて書かれていると感じましたか？
```

**Options:**
- はい
- まあまあ
- いいえ
- スキップ

---

### 2. Felt accurate?

**Question:**
```
書かれていた内容は、いまの自分の感覚と合っていると感じましたか？
```

**Options:**
- 合っていた
- 部分的に合っていた
- 合わなかった
- スキップ

---

### 3. Too generic?

**Question:**
```
内容が、誰にでも当てはまりそうな一般的な内容に感じた部分はありましたか？
```

**Options:**
- いいえ、具体的だった
- 一部、一般的に感じた
- 全体的に一般的だった
- スキップ

---

### 4. Too personal?

**Question:**
```
逆に、内容が「自分のことを知りすぎている」ように感じて不安になった部分はありましたか？
```

**Options:**
- いいえ
- 少しあった
- あった(どの部分か差し支えなければお聞かせください)
- スキップ

---

### 5. Uncomfortable wording?

**Question:**
```
読んでいて、不快に感じた言葉や表現はありましたか？
```

**Options:**
- いいえ
- あった(差し支えなければどの部分か教えてください)
- スキップ

---

### 6. Felt like advice / diagnosis?

**Question:**
```
読んでいて、診断やアドバイスを受けているように感じた部分はありましたか？
```

**Options:**
- いいえ、整理として読めた
- 少しそう感じた
- 強くそう感じた
- スキップ

---

### 7. 7-day action practical?

**Question:**
```
7日間の小さな行動の部分は、実際にやってみられそうだと感じましたか？
```

**Options:**
- やってみられそう
- 一部はやってみられそう
- 難しそう
- スキップ

---

### 8. Worth revisiting?

**Question:**
```
このレポートを、後日もう一度読み返したいと感じましたか？
```

**Options:**
- 読み返したい
- たぶん読み返さない
- スキップ

---

### 9. Future payment possibility (optional)

**Question:**
```
将来、このような詳細レポートが提供される場合、有料でも検討できる内容だと感じましたか？
このご質問は完全に任意で、ご回答内容にかかわらず、今後のご案内や対応に影響しません。
```

**Options:**
- 検討できる
- わからない
- 検討しない
- 答えない

### 10. Useful section (optional)

**Question:**
```
特に役に立った、または印象に残ったセクションがあれば、簡単に教えてください。
```

**Field:** short text input, ~120 character limit, with the sensitive-details warning shown below the field.

---

### 11. Optional free comment

**Question:**
```
そのほか、お気づきの点があれば自由にお聞かせください。
```

**Field:** longer text input, ~400 character limit.

**Warning displayed below the field (required):**
```
このコメント欄には、お名前、相手の方の特定につながる情報、健康・危機状況の詳細、
支払いに関する情報、LINE やメッセージのやり取り内容は、書かないでください。
具体的な人や状況の情報は、内部の改善でも扱いきれないため、削除させていただくことがあります。
```

---

## 5. Forbidden Feedback Collection

The feedback flow must **never** collect or solicit the following:

| Category | Reason |
|---|---|
| **Names** | The user's name, the names of others, any identifiable label |
| **Partner identity** | Any identifying details of a partner, family member, friend, or third party |
| **Detailed private circumstances** | Specific situations that identify the user or a third party (workplace, location, event) |
| **Health / crisis details** | Diagnosis details, medication, crisis events, self-harm references — these belong to professional support, not a product feedback form |
| **Payment details** | Credit card, bank, payment account — not applicable in this pilot and never appropriate in feedback |
| **Raw chat history** | LINE conversations, messages with others, transcripts |

If any of the above appears in a submitted free-text field, it must be redacted or deleted from the internal record before storage. The user may be notified that part of their submission was removed.

The form itself must not include fields that invite or normalize the above categories. No "describe your situation in detail" prompts. No "tell us about the other person" prompts. The warning under the free-comment field is explicit about this scope.

---

## 6. Decline Path

If the user declines to give feedback:

**Display:**
```
ご協力ありがとうございました。
レポートは引き続きお手元でお読みいただけます。
```

No follow-up reminders. No "are you sure?" prompts. No second-screen feedback request.

---

## 7. Submit Confirmation

After feedback submission:

**Display:**
```
ご感想をお寄せいただきありがとうございました。
いただいた内容は、内部の品質改善のためにのみ使います。
あとから「フィードバックの利用を止めてほしい」とご希望される場合は、
ご連絡いただければ対応できる範囲を確認します。
```

---

## 8. Edward Approval Required

Every copy block in this document — including every question, every option label, every warning, every confirmation — requires Edward's approval before appearing on any user-facing screen. Implementation of the feedback surface is not authorized by this document.

---

> **This document is a feedback consent specification. It does not implement feedback collection, storage, analysis, or any user-facing feedback surface.**
