# Yorisou — First Pilot Report User Communication v0.1

**Status:** Draft copy for review. Not yet approved for production use.
**Version:** v0.1
**Controller:** Edward (final approver on every block before use)
**Last updated:** 2026-06-22

---

## Purpose

This document collects the Japanese user-facing communication copy needed for the first pilot 詳細レポート batch. It covers invitation, consent explanation, expectations, feedback, safety, and fallback. Copy is intended for use with trusted internal testers and (only if Edward separately authorizes) trusted volunteers.

Per the controller correction in `docs/first-pilot-report-operations-v0.1.md`, the first round should begin with simulated or internal reports before any volunteer is contacted. Volunteer-facing copy below should not be used until Edward approves volunteer use and the specific consent handling for that round.

Tone rules: simple, calm, not legalistic, not pressuring, no urgency, no implication that declining means missing out.

---

## 1. Pilot Invitation

**Context:** Initial message to a candidate invited to participate in the first pilot.

```
Yorisouの詳細レポート品質確認に協力していただける方を少人数で募集しています。
今回は、支払いは発生しません。
レポートは、Yorisouのチェック結果をもとに、今の状態を整理する内容です。
参加するかどうかは自由にお決めください。お断りいただいてもかまいません。
```

---

## 2. Consent Explanation

**Context:** After invitation, before the report is drafted. Shown together with "what data is used" and "what data is not used" blocks.

```
このパイロットでは、次のことに同意していただきます。

- 今回のYorisouチェックの回答と結果を、レポート作成に使うこと。
- できあがったレポートをお渡しすること。
- レポートを読んだ感想をうかがうこと。

同意は、いつでも取り下げることができます。
取り下げた場合、その時点以降の利用を止めます。
```

---

## 3. What Data Is Used

**Context:** Shown next to the consent explanation. Plain, specific, no jargon.

```
このパイロットでは、次のものだけを使います。

- 今回のチェックの回答
- 今回のチェックの結果タイプ
- 回答から見える、今のあなたの傾向

これ以外は使いません。
```

---

## 4. What Data Is Not Used

**Context:** Shown together with "what data is used" so both are read in pair.

```
このパイロットでは、次のものは使いません。

- 過去のYorisouチェックの結果
- LINEでのやりとりや、メッセージの内容
- 長期メモリーや、他のサービスから集めた情報
- ご本人のお名前や、ご連絡先などの個人情報
- レポートの内容を、AIモデルの学習に使うこと

今回限りの、今のチェック結果だけで作るレポートです。
```

---

## 5. No Payment Explanation

**Context:** Shown at invitation and again at delivery if asked.

```
今回のパイロットでは、支払いは発生しません。
このレポートは、品質を確認するためにお渡しするもので、商品としての販売ではありません。
将来、有料でご提供する場合の価格や条件は、現時点では決まっていません。
今後ご案内する義務もありませんし、ご購入を前提とした参加でもありません。
```

---

## 6. Delivery Expectation

**Context:** Shown after consent, before drafting starts.

```
レポートのお渡しまでには、少しお時間をいただきます。
担当者が内容を確認したうえでお届けするため、当日中のお渡しは難しい場合があります。
お届けの方法と時期は、個別にご相談しながら決めます。
途中でお渡しが難しくなった場合は、その旨をご連絡します。
```

---

## 7. Feedback Request

**Context:** Sent or shown after the report has been delivered. Used to collect pilot feedback.

```
お読みいただいた感想を、いくつかお聞かせいただけたらうれしいです。
答えにくいものはとばしていただいて大丈夫です。

1. このレポートを読んで、今の状態が少し整理できましたか？
   （はい / まあまあ / いいえ）

2. どのセクションが一番役に立ちましたか？

3. 読んでいて不快に感じた部分はありましたか？
   （はい → どの部分か / いいえ）

4. またこのようなレポートを読みたいと思いますか？
   （はい / まあまあ / いいえ）

5. その他、自由にコメントがあればお聞かせください。
```

---

## 8. Safety Note

**Context:** Always visible to the user before, with, and after the report.

```
このレポートは、医療・心理診断、治療、カウンセリング、未来予測ではありません。
今の状態を整理し、小さな次の行動を考えるための自己理解レポートです。
つらさが強い、長く続く、生活に影響している場合は、
信頼できる人や、公的・専門的な相談先を確認することも選択肢です。
```

---

## 9. Deletion / Non-Use Request

**Context:** Shown at consent time and available at any later point on request.

```
ご提供いただいた回答や、お渡ししたレポートについて、
今後の利用を止めることや、削除を依頼することができます。

「今後の利用を止める」を選んだ場合：
これ以降、レポート作成や見直しの目的で使うことを止めます。

「削除を依頼する」を選んだ場合：
削除できる範囲や、保持が必要な情報がある場合は、画面または個別のご案内で確認します。
すべての情報がただちに削除されるわけではない場合があります。

いずれの場合も、お申し出いただければ、対応の流れをお伝えします。
```

---

## 10. Fallback If Report Cannot Be Delivered

**Context:** If, during or after drafting, the report cannot be delivered (quality not reached, safety review hold, consent unclear, or candidate unreachable).

```
今回は、お約束したレポートをお届けすることが難しくなりました。
ご協力いただいたお時間に、あらためてお礼申し上げます。

このパイロットは、レポートの品質を確認するためのものです。
品質が一定の基準に満たない場合や、安全面の確認に時間が必要な場合は、
お渡しを見合わせることがあります。

ご提供いただいた情報は、今後の利用を希望されない場合、止めることができます。
削除のご依頼も可能です。ご希望があればお知らせください。
```

---

## Copy Rules Summary

| Rule | Requirement |
|---|---|
| Tone | Calm, simple, no pressure, no urgency |
| Legalism | No contract-style language |
| Honesty | Copy reflects what is technically and operationally done |
| Decline | Declining must always be presented as a normal, acceptable choice |
| Payment | Always explicit: no payment is involved in this pilot |
| Data scope | Always explicit: what is used and what is not used, side by side |
| Safety | Safety note always available; never replaced by marketing copy |
| Volunteer use | Volunteer-facing copy must not be used until Edward approves the round |
| Approval | Every copy block requires Edward approval before being shown to a user |
