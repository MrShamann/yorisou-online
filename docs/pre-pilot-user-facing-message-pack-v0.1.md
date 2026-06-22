# Yorisou — Pre-Pilot User-Facing Message Pack v0.1

**Status:** Draft copy for review. Not yet approved for production use. Delivery copy is future-use only.
**Version:** v0.1
**Controller:** Edward (final approver on every block before use)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document does not approve user-facing display of any copy below. The delivery message and surrounding flow are future-use copy only and do not approve delivery. Every block requires Edward's approval before any user-facing use.**

---

## 1. Request Received

**Context:** Shown to the participant immediately after they submit their detailed report request through the consent flow.

```
レポート作成のご依頼を受け付けました。
担当者がひとつずつ確認のうえお届けします。
お渡しまでに、確認のお時間をいただきます。
ご準備ができ次第、ご連絡します。
```

---

## 2. Manual Review Pending

**Context:** Standalone update shown after the request, or sent in conversation while drafting is in progress.

```
ただいま、レポート内容の確認と安全性のチェックを進めています。
お渡しできる準備が整い次第、ご連絡します。
お時間がかかる場合は、その旨もあわせてお知らせします。
```

---

## 3. Clarification Needed

**Context:** Sent only when the reviewer needs a small operational confirmation from the participant — e.g., to re-confirm storage option or a consent block. Not used to extract sensitive information.

```
お手間をおかけしますが、確認のためにひとつだけお伺いさせてください。

(確認の内容)

お答えしにくい場合は、その旨をお伝えいただいてかまいません。
無理にお答えいただく必要はありません。
```

The bracketed content is the specific operational question, drafted per situation and Edward-approved before sending. The bracket itself is not user-facing.

---

## 4. Hold for Safety / Content Review

**Context:** Shown when a draft is held pending additional review. Neutral; never blames the participant.

```
安全確認と内容確認のため、このレポートは現在お渡しを保留しています。
必要な確認が終わり次第、ご案内します。
お時間をいただき、申し訳ありません。
```

---

## 5. Report Cannot Be Delivered

**Context:** Used when the hold cannot be resolved within a reasonable window, or the draft cannot reach the quality / safety threshold.

```
今回はお約束したレポートをお届けすることが難しくなりました。
ご協力いただいたお時間に、あらためてお礼申し上げます。

このテストは、品質と安全性を確認するためのものです。
基準を満たさない場合や、安全面の確認に時間が必要な場合は、お渡しを見合わせることがあります。

ご提供いただいた情報の今後の利用を希望されない場合は、止めることができます。
削除のご依頼も承ります。ご希望があればお知らせください。
```

---

## 6. Non-Use / Deletion Request Acknowledged

**Context:** Reply sent when a participant requests non-use or deletion.

```
ご依頼を受け付けました。

「今後の利用を止める」をご希望の場合は、
これ以降、レポート作成や見直しの目的で使うことを止めます。

「削除を依頼する」をご希望の場合は、
対応できる範囲を確認のうえご連絡します。
すべての情報がただちに、または完全に削除されるわけではない場合があります。
管理上必要な記録(操作ログなど)は、対応の範囲外で残ることがあります。

確認が必要な場合は、こちらからご連絡します。
```

---

## 7. Delivery Message *(future-use copy only — does not approve delivery)*

**Context:** Sent with the delivered report, **only when a pilot has been separately authorized by Edward and per-report delivery has been manually approved**. This block is future-use copy only. Merging this document does not authorize delivery.

```
詳細レポートをお届けします。
お時間のあるときに、ゆっくり読んでみてください。

このレポートは、いまの状態を整理するためのものです。
医療・心理診断、治療、カウンセリング、未来予測ではありません。
読んでいて気になる点や、合わないと感じる部分は、無理に当てはめなくて大丈夫です。

お渡しのあと、本文は保存されません。
ご自身の手元で控えを残されたい場合は、保存方法をご相談ください。

読み終えたあとに、いくつかご感想をうかがいます。
お答えにくいものはとばしてかまいません。
ご感想をお寄せいただかない選択もできます。
```

---

## 8. Opening Boundary Note *(delivered above the report's Section 1)*

**Context:** A short boundary statement shown directly above the report when delivered. Reinforces the boundary at the moment the participant reads.

```
このレポートは、いまの状態を整理するための自己理解レポートです。
診断・治療・未来予測ではありません。
気になる箇所や合わないと感じる箇所は、無理に当てはめなくて大丈夫です。
```

---

## 9. How to Read the Report

**Context:** Optional brief reading guidance, shown below the opening boundary note or in the delivery message.

```
このレポートには、いまの状態を異なる視点から整理した14の項目があります。
順に読んでも、目に入った項目から読んでも、どちらでも大丈夫です。

巻末に「保存用まとめ」があります。
あとで思い出したいときの手がかりとして、お使いいただけます。
```

---

## 10. Reminder That It Is Not Diagnosis / Advice

**Context:** Re-stated near the end of the delivery surface and within Section 13 of the report itself (verbatim per template spec).

```
このレポートは、医療・心理診断、治療、カウンセリング、未来予測ではありません。
今の状態を整理し、小さな次の行動を考えるための自己理解レポートです。
つらさが強い、長く続く、生活に影響している場合は、
信頼できる人や、公的・専門的な相談先を確認することも選択肢です。
```

---

## 11. Feedback Invitation

**Context:** Shown after delivery. Explicit that feedback is optional and internal-only.

```
お読みいただきありがとうございました。
いくつかご感想をお聞かせいただけたらうれしいです。

ご回答は任意です。お答えにくいものはとばしてかまいません。
ご感想は、内部のレポート品質改善のためにのみ使います。
お名前を出した形での公開や、宣伝・お客様の声としての利用は行いません。
```

---

## 12. Non-Use / Deletion Path Reminder

**Context:** Available at any point post-delivery.

```
ご提供いただいた情報や、お渡しした内容について、
今後の利用を止めることや、削除のご依頼ができます。

ご希望があればお知らせください。
対応できる範囲と必要なお時間をご案内します。
```

---

## 13. Feedback Consent Text

**Context:** Shown above the feedback form. Required to be confirmed before the form is submittable.

```
このフィードバックを、内部のレポート品質改善のためにのみ使うことに同意します。
ほかの目的(宣伝、サンプル、AIモデル学習など)には使いません。
お名前や、相手の方の特定につながる詳細を、自由記述欄に書かないようお願いします。
```

### Checkbox label

```
内部の品質改善にのみ使うことに同意します。
```

---

## 14. Warning Not to Include Sensitive Details

**Context:** Always displayed below any free-text feedback field.

```
このコメント欄には、お名前、相手の方の特定につながる情報、健康・危機状況の詳細、
支払いに関する情報、LINE やメッセージのやり取り内容は、書かないでください。
具体的な人や状況の情報は、内部の改善でも扱いきれないため、削除させていただくことがあります。
```

---

## 15. Feedback Questions

All optional. Each question presents a "答えない" / "スキップ" option.

### 1. Report felt based on current answers?

```
このレポートは、今回のチェック回答にもとづいて書かれていると感じましたか?
```
Options: はい / まあまあ / いいえ / スキップ

### 2. Felt accurate?

```
書かれていた内容は、いまの自分の感覚と合っていると感じましたか?
```
Options: 合っていた / 部分的に合っていた / 合わなかった / スキップ

### 3. Too generic?

```
内容が、誰にでも当てはまりそうな一般的な内容に感じた部分はありましたか?
```
Options: いいえ、具体的だった / 一部、一般的に感じた / 全体的に一般的だった / スキップ

### 4. Too personal?

```
内容が「自分のことを知りすぎている」ように感じて不安になった部分はありましたか?
```
Options: いいえ / 少しあった / あった(差し支えなければどの部分か教えてください) / スキップ

### 5. Easy to understand?

```
レポートの言葉づかいや構成は、読みやすかったですか?
```
Options: 読みやすかった / 一部読みにくかった / 読みにくかった / スキップ

### 6. Too long / too short?

```
全体の長さは、どう感じましたか?
```
Options: ちょうどよかった / 少し長かった / かなり長かった / 短かった / スキップ

### 7. Useful 7-day action?

```
7日間の小さな行動の部分は、実際にやってみられそうだと感じましたか?
```
Options: やってみられそう / 一部はやってみられそう / 難しそう / スキップ

### 8. Useful 30-day direction?

```
30日間の方向性の部分は、いまの自分にとって役に立つと感じましたか?
```
Options: 役に立つ / 一部役に立つ / 役に立たない / スキップ

### 9. Worth revisiting?

```
このレポートを、後日もう一度読み返したいと感じましたか?
```
Options: 読み返したい / たぶん読み返さない / スキップ

### 10. Felt like advice / diagnosis?

```
読んでいて、診断やアドバイスを受けているように感じた部分はありましたか?
```
Options: いいえ、整理として読めた / 少しそう感じた / 強くそう感じた / スキップ

### 11. Uncomfortable wording?

```
読んでいて、不快に感じた言葉や表現はありましたか?
```
Options: いいえ / あった(差し支えなければどの部分か教えてください) / スキップ

---

## 16. Optional Future Payment-Interest Question

**Context:** Clearly optional. Not used as a core success metric. Not a sales test.

```
将来、このような詳細レポートが提供される場合、有料でも検討できる内容だと感じましたか?

このご質問は完全に任意です。
ご回答内容にかかわらず、今後のご案内や対応に影響しません。
このご質問への回答は、テストの成功・不成功の評価にも使いません。
```

Options: 検討できる / わからない / 検討しない / 答えない

---

## 17. Thank-You Message

**Context:** Shown after feedback submission, or after declining feedback.

```
ご協力いただきありがとうございました。
いただいた内容は、内部のレポート品質改善のためにのみ使います。

あとから「フィードバックの利用を止めてほしい」とご希望される場合は、
ご連絡いただければ対応できる範囲を確認します。
```

---

## 18. Load-Bearing Wording Rules

| Rule | Required posture |
|---|---|
| **No punitive wording** | Hold and cannot-deliver messages never blame the participant; they describe the workflow's confirmation needs |
| **No diagnosis wording** | Every delivery surface restates that the report is not diagnosis / treatment / counseling / future prediction |
| **No legal / technical deletion overpromise** | Deletion copy uses "対応できる範囲" / "確認のうえご連絡します"; never "すぐに削除" or "完全に削除" |
| **No fixed delivery SLA** | No specific hour-count or day-count guarantee is given unless later separately approved; only "お時間をいただきます" |
| **Optional payment-interest question** | Marked explicitly as optional; explicitly stated not to affect anything; explicitly stated not used as success metric |
| **Delivery copy is future-use only** | The delivery message (Section 7) does not approve delivery by its presence in this document |

---

## 19. Approval Status

Every block above is **draft** and requires Edward's approval before any user-facing use.

| Block | State |
|---|---|
| 1 — Request received | Draft, awaiting Edward approval |
| 2 — Manual review pending | Draft, awaiting Edward approval |
| 3 — Clarification needed | Draft, awaiting Edward approval per instance |
| 4 — Hold for safety / content review | Draft, awaiting Edward approval |
| 5 — Report cannot be delivered | Draft, awaiting Edward approval |
| 6 — Non-use / deletion request acknowledged | Draft, awaiting Edward approval |
| 7 — Delivery message *(future-use)* | Draft, awaiting Edward approval; does not approve delivery |
| 8 — Opening boundary note | Draft, awaiting Edward approval |
| 9 — How to read the report | Draft, awaiting Edward approval |
| 10 — Reminder of non-diagnosis | Section 13 verbatim per template spec; no change |
| 11 — Feedback invitation | Draft, awaiting Edward approval |
| 12 — Non-use / deletion path reminder | Draft, awaiting Edward approval |
| 13 — Feedback consent text | Draft, awaiting Edward approval |
| 14 — Sensitive details warning | Draft, awaiting Edward approval |
| 15 — Feedback questions (11 items) | Draft, awaiting Edward approval |
| 16 — Optional payment-interest question | Draft, awaiting Edward approval; explicitly optional and non-metric |
| 17 — Thank-you message | Draft, awaiting Edward approval |

---

> **This document does not approve user-facing display of any copy below. The delivery message and surrounding flow are future-use copy only and do not approve delivery. Every block requires Edward's approval before any user-facing use.**
