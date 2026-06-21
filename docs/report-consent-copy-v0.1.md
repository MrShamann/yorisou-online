# Yorisou — Report Consent Copy v0.1

**Status:** Draft copy for review. Not yet approved for production use.  
**Version:** v0.1  
**Controller:** Edward (final approver on all copy before it appears to users)  
**Last updated:** 2026-06-21

---

## Purpose

This document collects the approved draft Japanese consent copy for each data use context in the Yorisou report flow. Copy must be:

- Simple and readable by a general adult audience
- Calm and unhurried — no pressure to enable memory or personalization
- Not legalistic — no contract-style phrasing
- Not alarming — should not suggest the user is at risk if they decline
- Honest about what is and is not stored, used, or shareable

All copy in this document is draft. Each block requires Edward's approval before it appears on any user-facing screen.

---

## 1. Single-Session Report (Level 0 — No Saved Data)

**Context:** User receives a report or views results without saving anything. Default state.

**Display location:** Below result display, or at top of report if displayed without account.

```
今回は、このチェックの回答だけを使います。
結果はこのページを閉じると保存されません。
```

**Variant (shorter):**
```
今回の回答だけを使います。保存はしません。
```

**Note to designer:** This copy should be visible but not prominent — it is informational, not a CTA. Small text below result. No button required.

---

## 2. Save Interest / Report Intent (Pre-consent, Intent Only)

**Context:** User clicks "詳細レポートに興味を保存する" on /report-preview. This is localStorage-only, no server-side data.

**Display location:** Below intent button, after click.

```
詳細レポートへの関心を、この端末に保存しました。
購入や申し込みではありません。サーバーには送られません。
```

**Shown before click:**
```
この端末だけに保存されます。購入や申し込みではありません。
```

---

## 3. Save Current Result (Level 1 Consent)

**Context:** User chooses to save their check-in result for later revisit. May be offered at result screen or before report delivery.

**Display location:** Result screen, before saving. Confirm button labeled "保存する".

```
今回の結果をあとで見返せるように保存します。
保存されるのは、今回のチェック結果と日時だけです。
回答内容はそのまま保存しません。
いつでも保存を止めることができます。
```

**Confirm button:** `保存する`  
**Decline link:** `今回は保存しない`

**After save confirmation:**
```
保存しました。このページからいつでも見返せます。
```

---

## 4. Use Past Check-ins for Report Personalization (Level 2 Consent)

**Context:** User is offered the option to allow past check-in results to be used when generating their detailed report.

**Display location:** Report request flow, before generation begins.

```
過去のYorisouチェック結果を使うと、
今回のレポートで状態の変化や繰り返し出ているテーマを整理しやすくなります。

使うのは、過去の結果のタイプと傾向だけです。
回答そのものは使いません。

同意しなくても、今回の結果だけでレポートを作れます。
```

**Consent button:** `過去の結果も使う`  
**Decline link:** `今回の結果だけ使う`

**After consent:**
```
過去の結果も参照して、レポートを整理します。
```

---

## 5. Use LINE Interaction Summaries (Level 3 Sub-consent — Deferred)

**Context:** User would be asked if summarized LINE interaction history can be used in report personalization. This consent level is deferred and not active at first launch.

**Status:** Draft only. Not to be shown to users until Edward explicitly authorizes.

```
LINEの内容をレポートに使う場合は、事前に確認します。
同意なしに、生のメッセージを使うことはありません。
使うのは、やりとりの要約だけです。内容そのものは保存しません。
```

**Consent button:** `要約を使うことに同意する`  
**Decline link:** `LINEの内容は使わない`

**Important:** This copy may only appear to users after:
- Level 3 is authorized by Edward
- Technical summarization method is reviewed and confirmed
- Deletion path for LINE summaries is confirmed

---

## 6. Longitudinal Yorisou Memory (Level 3 — Deferred)

**Context:** User is offered the option to enable ongoing memory across sessions. Deferred — not active at first launch.

**Status:** Draft only. Not to be shown to users until Edward explicitly authorizes.

```
Yorisouメモリーをオンにすると、
これまでのチェックや保存されたレポートの要約を使って、
状態の変化を見やすくできます。

いつでも停止できます。
```

**Consent button:** `メモリーをオンにする`  
**Decline link:** `今は使わない`

**After enabling:**
```
Yorisouメモリーがオンになりました。
チェックのたびに、状態の変化を整理しやすくなります。
設定からいつでも停止できます。
```

---

## 7. Stop Memory / Stop Future Use

**Context:** User wants to stop Yorisou from using their history going forward.

**Display location:** Settings or account page.

```
保存された情報の今後の利用を止めることができます。
停止すると、次回以降のチェックやレポートには、
これまでの記録を使いません。

停止しても、今回の結果は引き続き見られます。
```

**Action button:** `今後の利用を止める`  
**Cancel link:** `戻る`

**After stopping:**
```
今後の利用を止めました。
これまでの保存データは、引き続きご確認いただけます。
削除を希望する場合は、削除のご依頼をご利用ください。
```

---

## 8. Deletion Request

**Context:** User wants to request deletion of stored data.

**Display location:** Settings or account page, below "stop memory" option.

```
削除を依頼できます。
削除できる範囲や、保持が必要な情報がある場合は、
画面または案内で確認します。

すべての情報がただちに削除されるわけではない場合があります。
```

**Action button:** `削除を依頼する`  
**Cancel link:** `戻る`

**After request:**
```
削除のご依頼を受け付けました。
対応できる範囲と、対応できない場合の理由を確認します。
```

**Note:** Deletion copy must not claim complete immediate deletion if the technical capability is not confirmed. "削除できる範囲や保持が必要な情報がある場合は確認します" is the approved safer framing.

---

## 9. Decline Memory / Use Current Answer Only

**Context:** User is offered memory or personalization and declines.

**Display location:** Confirmation shown after declining.

```
今回は、このチェックの回答だけを使います。
過去の記録は参照しません。
```

**Variant (decline personalization):**
```
今回の結果だけを使ってレポートを作ります。
過去のチェック結果は参照しません。
```

**Note to product:** Declining memory or personalization must not reduce the quality or completeness of the user's free result or basic report. The copy must not suggest the user is missing out by declining.

---

## 10. Admin / Manual Review Notice

**Context:** If a human (Edward or Safety/Governance Agent) manually reviews a user's report draft before delivery, the user should be informed.

**Status:** Draft — display timing and format TBD.

```
このレポートは、品質とご利用者の安全のために、
担当者による確認を経て、お届けしています。
担当者はレポートの内容を確認しますが、
個人情報として別途保存・利用することはありません。
```

**Note:** This copy is only relevant during the manual pilot phase (reports 1–20). The display timing and format have not been decided at v0.1.

---

## Copy Rules Summary

| Rule | Requirement |
|---|---|
| Tone | Calm, informational, unhurried |
| Pressure | No pressure to enable memory, personalization, or consent |
| Legalism | No contract-style language, no "by using this service you agree" |
| Accuracy | Copy must accurately reflect what is technically done |
| Deletion | Must distinguish "stop future use" from "request deletion" |
| Degradation | Must not imply free experience is worse without memory |
| Level gating | Higher consent levels always presented as optional, not required |
| Edward approval | All copy requires Edward approval before production display |
