# Yorisou — 詳細レポート Storage and Non-Use Policy v0.1

**Status:** Copy and policy specification only. Not implementation approval.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document is a policy and copy specification. It does not implement storage, deletion, retention, or any data persistence. It does not authorize volunteer pilots, user delivery, payment, or automation.**

---

## 1. Purpose

Defines the storage and non-use options that may be offered to users in a future trusted volunteer pilot, the copy that describes each option, the deletion / non-use copy, and the controller's recommendation about which options are appropriate at the first volunteer pilot.

---

## 2. Storage / Non-Storage Options

Three options are defined. Only Option A is recommended for the first volunteer pilot.

---

### Option A — Generate / Review Report Without Ongoing Full-Text Persistence After Review

**Description:**
The report is generated, manually reviewed, and delivered. After delivery and the user's review window closes, the full report text is not retained in any user-facing system. Operational metadata (report ID, type, mode, safety review status, delivery timestamp) may be retained under safe logging rules.

**What is stored:**
- Operational metadata only (no user identifiers, no report text)
- The input packet's *operational fields* (report_id, main_state_mode, confidence_level, consent_level, generation_method, safety_review_status, locale, phase label, timestamp) per `docs/report-data-dashboard-governance-v0.1.md`

**What is not stored:**
- Full report text after review window
- Raw answer payload
- User name, email, LINE UID, or any personal identifier
- Free-text feedback content
- Section content of the report

**Risk level:** Low.

**Controller recommendation:** **Recommended default for the first volunteer pilot.**

**User-facing Japanese copy (when option is presented):**
```
レポートを作成し、お渡ししたあとは、本文を保存しません。
お渡しの際にお読みいただけますが、その後ご自身で控えを残されない場合、
あとから同じレポートを再表示することはできません。
管理上必要な記録(レポートのIDや種類、安全確認の状況など)は残ります。
ご本人のお名前や、レポート本文の内容は残しません。
```

---

### Option B — Limited Internal Review Retention

**Description:**
The report text is retained for a *defined* period after delivery, accessible only to Edward and the methodology reviewer, for review and methodology improvement. Not exposed to the user as a revisit feature. Deleted at the end of the defined retention period.

**What is stored:**
- Full report text in an internal-only store, accessible to Edward and Yorisou Agent only
- Operational metadata as in Option A
- Retention period must be explicit (proposed: 30 days; **not yet decided**)

**What is not stored:**
- User identifiers in the same record as report text (separation required)
- Raw answer payload
- Free-text feedback alongside report text
- Anything beyond the defined retention period

**Risk level:** Medium. Internal retention of report content increases sensitivity exposure if accessed inappropriately.

**Controller correction:** **Option B requires an explicit retention period and an explicit policy (who can access, under what conditions, audit trail, deletion procedure) before it may be offered.** No volunteer pilot may select Option B before these are specified and Edward-approved.

**User-facing Japanese copy (not for use in first pilot; reference only):**
```
本文を、品質確認のために短期間だけ内部で保管します。
保管期間は[N]日です。期間終了時に削除します。
保管した本文は、担当者(Edward と Yorisou Agent)以外は確認できません。
あなたが「保管しないでほしい」と希望される場合は、保管せずに削除します。
```

The bracketed `[N]` is intentional — there is no approved number until the retention policy is set.

---

### Option C — Save for User Revisit Later

**Description:**
The report text is retained in a user-accessible store so the user can return and re-read the report. Requires a save/revisit implementation, a user account or persistent identifier, and a user-facing deletion mechanism.

**What is stored:**
- Full report text linked to a persistent user identifier
- Operational metadata
- A user-controlled save state

**What is not stored:**
- Raw answer payload
- LINE content
- Free-text feedback in the same store

**Risk level:** High at v0.1. Requires user account / identity decisions, server-side store, deletion mechanism, and consent-to-store wording — none of which are decided or built.

**Controller correction:** **Option C is not recommended until revisit/save implementation is clear** — meaning, until the storage mechanism, identity model, deletion path, and consent wording are all approved.

**User-facing Japanese copy:** None at v0.1. Drafting copy before the implementation is decided would create the wrong promise.

---

## 3. Summary Recommendation

| Option | First volunteer pilot |
|---|---|
| Option A | ✅ Recommended default |
| Option B | ❌ Not until retention period and access policy are explicit and approved |
| Option C | ❌ Not until revisit/save implementation is clear |

The first volunteer pilot, if separately authorized, presents only Option A to users. Options B and C are not displayed.

---

## 4. Deletion / Non-Use Copy

Users may request deletion or non-use at any point. Copy must accurately reflect what is technically and operationally achievable. **Do not promise instant deletion. Do not promise permanent deletion unless implementation and legal review confirm it.** Use cautious wording.

---

### Request deletion

**User-facing Japanese:**
```
レポートと、ご提供いただいた情報の削除を依頼できます。
お申し出いただいたあと、対応できる範囲を確認してご連絡します。
すべての情報がただちに、または完全に削除されるわけではない場合があります。
管理上必要な記録(操作ログなど)は、対応の範囲外で残ることがあります。
```

### Request non-use

**User-facing Japanese:**
```
今後の利用を止めることを依頼できます。
お申し出をいただいた時点以降、レポート作成や見直しの目的で使うことを止めます。
すでにお渡ししたレポートと、過去の操作の記録は、対応できる範囲を確認のうえご案内します。
```

### Stop future use

**User-facing Japanese:**
```
これ以降、Yorisouがあなたのレポート情報を、新しいレポート作成や改善のために使うことを止めます。
止めても、お渡し済みのレポートを取り戻したり、見直したりすることはできない場合があります。
```

### Report not used as sample

**User-facing Japanese:**
```
あなたのレポート本文や回答は、ほかのユーザーへの紹介、サンプル、広告、宣伝には使いません。
内部の品質確認以外の目的では使いません。
```

### Feedback not used publicly

**User-facing Japanese:**
```
いただいたご感想は、内部の品質改善のためにのみ使います。
お名前を出した形での公開や、宣伝・お客様の声としての利用は行いません。
ほかの目的で使う場合は、事前に改めてご相談します。
```

### Timeline expectation

**User-facing Japanese:**
```
ご依頼への対応には、内容を確認するためのお時間をいただきます。
すぐに自動で完了する仕組みではありません。
対応の状況は、ご依頼後にご連絡します。
```

---

## 5. Wording Rules

| Rule | Required wording |
|---|---|
| Scope of deletion | "対応できる範囲" |
| Timing of deletion | "確認後にご連絡" / "ただちに、または完全に削除されるわけではない場合があります" |
| Operational record retention | "管理上必要な記録は、対応の範囲外で残ることがあります" |
| No instant deletion claim | Never use "すぐに削除" or "完全に削除" |
| No permanent claim | Never use "永久に" / "完全に消去" |
| Non-use clarity | "新しいレポート作成や改善のために使うことを止めます" |
| Sample / public-use prohibition | "サンプル、広告、宣伝には使いません" |
| Feedback privacy | "お客様の声としての利用は行いません" |

---

> **This document is a policy and copy specification. It does not implement storage, deletion, retention, or any data persistence. It does not authorize volunteer pilots, user delivery, payment, or automation.**
