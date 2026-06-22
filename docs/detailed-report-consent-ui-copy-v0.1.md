# Yorisou — 詳細レポート Consent UI / Copy Spec v0.1

**Status:** Copy and specification only. Not implementation approval.
**Version:** v0.1
**Controller:** Edward (final approver on all copy before any user-facing use)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document is a copy/specification document only. It does not implement UI, consent storage, report generation, report delivery, volunteer pilot, payment, automation, LINE history use, memory use, OpenClaw runtime access, model training, or public sample reuse.**

---

## 1. Why Consent UI / Copy Is Needed Now

The Template v0.2 methodology, input packet schema v0.2, dashboard governance, and prior consent-governance documents collectively specify *what* may be done with user data and *when* a report may be generated. They do not yet specify *how a user is asked* and *what they see* when consent is requested for a detailed report.

Before any trusted volunteer pilot can be considered, the consent surface — what the user reads, in what order, with what choices — must be defined in writing and approved. This document defines that surface as text only. It does not build the surface.

Defining the surface in advance:

- Forces the operational ambiguities (storage, deletion, feedback use, report boundary) to be resolved as text the user can read
- Lets Edward approve copy block by block before any UI work is started
- Prevents the UI implementer from inventing copy under deadline pressure
- Provides a stable reference for relationship-distance extra safety wording (`docs/relationship-distance-extra-safety-copy-v0.1.md`)
- Establishes the consent readiness gate (`docs/volunteer-pilot-consent-readiness-gate-v0.1.md`)

---

## 2. Consent Principles

- **Plain language.** Copy is simple, calm, and readable by a general adult audience. No legal jargon.
- **Specific.** Copy says exactly what is used, exactly what is not used, and what happens next.
- **Optional.** Declining must always be presented as a normal, acceptable choice. No degradation of the free experience.
- **Reversible.** Users can stop future use; deletion is requestable within technical and policy limits.
- **Honest.** Copy reflects what is technically and operationally done. No promises beyond capability.
- **Unhurried.** No urgency, scarcity, or fear framing anywhere in the consent flow.
- **Per-action consent.** Consent for data use is separate from consent for feedback collection, which is separate from any future consent for storage beyond review.
- **Approval required.** Every copy block in this document requires Edward's approval before it appears on any user-facing screen.

---

## 3. Level 1 Data Use Explanation

This is the core consent block — what the user is asked to agree to before any detailed report draft begins. It corresponds to Level 1 from `docs/consent-and-report-data-governance-v0.1.md` Section 2.

### User-facing Japanese — short version

**Display:** above the checkbox.

```
今回のチェックの回答と結果を、詳細レポート作成に使います。
これは、詳細レポートを作るためだけの利用です。
```

### User-facing Japanese — full version

**Display:** expandable section below the short version, opened by "詳しく見る".

```
このパイロットでは、次のものを使います。

- 今回のYorisouチェックの回答
- 今回のチェックの結果タイプと傾向
- 回答パターンから見える、いまの状態の特徴

次のものは使いません。

- 過去のYorisouチェック結果
- LINEでのやりとりや、メッセージの内容
- 他のサービスから集めた情報
- お名前、ご連絡先、その他の個人情報
- このレポートの内容を、AIモデルの学習に使うこと

詳細レポートは、担当者の確認を経てお届けします。
お届けまでに少しお時間をいただく場合があります。

同意は、いつでも取り下げることができます。
取り下げた場合、その時点以降の利用を止めます。
```

### Checkbox label

```
今回のチェック結果を、詳細レポート作成に使うことに同意します。
```

### Helper text

**Display:** below the checkbox, smaller font.

```
これは購入や申し込みではありません。
このパイロットでは、支払いは発生しません。
```

### Error text if unchecked

**Display:** below the request button when the user attempts to proceed without checking.

```
レポート作成の前に、利用範囲のご確認とご同意をお願いします。
ご同意いただかない選択もできます。その場合は、レポート作成には進みません。
```

---

## 4. 詳細レポート Boundary Copy

This block frames what the report is and is not. It appears before the user requests a draft and is referenced again in-report.

### Short display copy

**Display:** below the data-use consent, before the request button.

```
詳細レポートは、いまの状態を整理するための自己理解レポートです。
医療・心理診断、治療、カウンセリング、未来予測ではありません。
```

### Expanded copy

**Display:** expandable under "詳しく見る".

```
詳細レポートは、Yorisouのチェック結果をもとに、
いまのあなたの状態を、感情・関係・行動・回復の視点から整理します。

このレポートが行うこと:
- いまの状態の傾向を、いくつかの視点から整理する
- 小さな次の行動を考えるための入口を示す
- 自分の状態を見返すための要約を残す

このレポートが行わないこと:
- 医療や心理の診断
- 治療やカウンセリング
- 将来の予測や運命的な判断
- ご本人やまわりの方への、具体的な決定の指示
- 関係を続ける・終わらせる・連絡する・しないなどの判断
```

### Safety note inside report

**Display:** Section 13 of the report itself. Verbatim, per `docs/paid-report-template-specification-v0.1.md`.

```
このレポートは、医療・心理診断、治療、カウンセリング、未来予測ではありません。
今の状態を整理し、小さな次の行動を考えるための自己理解レポートです。
つらさが強い、長く続く、生活に影響している場合は、
信頼できる人や、公的・専門的な相談先を確認することも選択肢です。
```

### Preview / paywall boundary copy

**Display:** on `/report-preview` near the locked-content cards (current production surface; copy reference for consistency).

```
この章は詳細レポートで読めます。
詳細レポートは、いまの状態を整理する自己理解レポートです。
購入や申し込みは、このページからは行いません。
```

### Relationship-distance extra warning

**Display:** if `main_state_mode` is `relationship_distance`, shown in the consent flow before request.

```
このレポートは、相手の気持ちや意図を判断するものではありません。
連絡を取る・取らない、関係を続ける・終わらせる、といった判断を行うものでもありません。
読めるのは、いまのあなた自身の反応の間合いと、戻ってこられる距離の整理です。
```

Full text in `docs/relationship-distance-extra-safety-copy-v0.1.md`.

---

## 5. Consent UI Flow Spec

The flow below is a *specification of order and content*, not a UI implementation plan. Implementation is not authorized by this document.

### Step 1 — Detailed report pilot explanation

**Screen content:**
- What this pilot is (品質確認のための少人数パイロット)
- That it is not a purchase
- That payment is not involved
- That the report is delivered after manual review
- Link to the report boundary copy (Section 4)

### Step 2 — Data-use consent

**Screen content:**
- Short version of Level 1 data use explanation (Section 3)
- "詳しく見る" expansion for full version
- Checkbox + helper text + error text (Section 3)

### Step 3 — Report boundary confirmation

**Screen content:**
- Short display copy of report boundary (Section 4)
- "詳しく見る" expansion for expanded copy
- Acknowledgment confirmation (separate from data-use checkbox)

If `main_state_mode` is `relationship_distance`, the extra warning from Section 4 is required at this step.

### Step 4 — Storage / non-use choice

**Screen content:**
- Storage options from `docs/detailed-report-storage-and-non-use-policy-v0.1.md`
- For the first volunteer pilot, only Option A is presented as the recommended default; B and C are not shown
- User selects one option

### Step 5 — Generate / request report button

**Screen content:**
- Single primary button: `レポートを依頼する`
- Secondary link: `今は依頼しない`
- Button disabled until both consents (data use, boundary) are confirmed and a storage option is selected

### Step 6 — Manual review pending message

**Screen content:**
- Confirmation that the request was received
- Reminder that the report goes through manual review
- Expected timing communicated honestly
- No automation language

```
レポート作成のご依頼を受け付けました。
担当者の確認を経てお届けします。
お届けまでに少しお時間をいただく場合があります。
ご準備ができ次第、ご連絡します。
```

### Step 7 — Report delivery screen

**Screen content:**
- The 14-section report (per Template v0.2)
- Section 13 safety note always visible
- Section 14 Save/Revisit summary present
- No purchase, save-to-account, or share buttons unless separately authorized

### Step 8 — Feedback consent screen

**Screen content:**
- Optional feedback request per `docs/detailed-report-feedback-consent-v0.1.md`
- Decline must be a normal, equal-weight choice
- No follow-up pressure if declined

---

## 6. Conceptual Event Model

This is a conceptual list of events for future operational tracking. No event is implemented by this document. If implemented later, events must follow `docs/report-data-dashboard-governance-v0.1.md` safe logging rules (no user identifiers, no report text, no free-text content).

| Event | Trigger |
|---|---|
| `consent_screen_viewed` | User reaches Step 1 |
| `level_1_data_use_accepted` | User confirms data-use checkbox at Step 2 |
| `report_boundary_accepted` | User confirms boundary at Step 3 |
| `storage_option_selected` | User selects an option at Step 4 |
| `report_request_submitted` | User clicks the request button at Step 5 |
| `manual_review_pending_shown` | Step 6 displayed |
| `report_delivered` | Report displayed at Step 7 |
| `feedback_consent_accepted` | Feedback consent confirmed at Step 8 |
| `feedback_submitted` | Feedback form submitted |
| `deletion_or_non_use_requested` | User requests deletion or non-use (any time) |

Events log operational status only. No content. No identifiers.

---

> **This document is a copy/specification document only. It does not implement UI, consent storage, report generation, report delivery, volunteer pilot, payment, automation, LINE history use, memory use, OpenClaw runtime access, model training, or public sample reuse.**
