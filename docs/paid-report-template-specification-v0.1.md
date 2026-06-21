# Yorisou 詳細レポート — Template Specification v0.1

**Status:** Specification only. Approved for documentation. Not approved for implementation.  
**Version:** v0.1  
**Controller:** Edward (final approver)  
**Methodology owner:** Yorisou Agent  
**Last updated:** 2026-06-21

---

> **This document is a methodology specification, not implementation approval.**

---

## 1. Template Overview

The Yorisou 詳細レポート is a 14-section self-understanding report. It is generated from the output of the クイックチェック (24-question check-in) and associated DTE scoring. It helps users organize their current emotional, relational, behavioral, and recovery patterns in calm, non-prescriptive language.

This template defines the structure, content rules, phrase standards, and quality criteria for all report variants.

---

## 2. Expected Length

| Parameter | Value |
|---|---|
| Minimum | 8,000 Japanese characters |
| Target | 10,000–12,000 Japanese characters |
| Maximum | 15,000 Japanese characters |
| Section minimum | ~400 characters per section (except fixed sections 13, 14) |
| Section maximum | ~1,500 characters per section |

Length is measured in Japanese characters (excluding spaces, punctuation, and HTML/markdown markup).

Reports below 8,000 characters must be flagged for review before delivery. Reports above 15,000 characters must be edited before delivery.

---

## 3. Report Metadata Fields

Each generated report must carry the following metadata:

| Field | Type | Notes |
|---|---|---|
| `reportId` | string | Unique report identifier |
| `reportType` | "detailed-self-understanding" | Fixed at v0.1 |
| `templateVersion` | "v0.1" | Must match this spec |
| `generatedAt` | ISO 8601 datetime | Generation timestamp |
| `resultId` | string | Source check-in result ID |
| `overlayId` | string | Source overlay |
| `personaClusterId` | string | Top persona cluster |
| `confidenceBand` | "low" \| "medium" \| "high" | Source check-in confidence |
| `locale` | "ja" \| "en" | Report language |
| `generationMethod` | "manual" \| "assisted" \| "automated" | How it was produced |
| `safetyReviewStatus` | "pending" \| "passed" \| "flagged" | Safety review outcome |
| `deliveredAt` | ISO 8601 datetime \| null | Delivery timestamp |
| `reviewedBy` | string \| null | Reviewer ID if human-reviewed |

---

## 4. 14-Section Template Specification

---

### Section 1 — 今の状態の要約

**Purpose:** Visible in the free result preview. Anchor for the report.  
**Length:** 400–700 characters  
**Personalization:** Level 1+ (result-referenced)

**Required elements:**
- Acknowledge the user's current state without labeling or diagnosing
- Reference the primary result cluster by name or trait characteristic
- Avoid certainty language ("あなたは〜です" without qualification)
- End with an orienting phrase that opens into the deeper sections

**Example pattern:**
```
今の[primary_trait_phrase]の状態から、このレポートを読み始めます。
[1–2 sentences of state recognition]
[1 sentence opening toward the deeper sections]
```

---

### Section 2 — 深い状態解釈

**Purpose:** Expands the free result summary. Partially visible on /report-preview.  
**Length:** 600–1,000 characters  
**Personalization:** Level 2+ (overlay + dimension)

**Required elements:**
- Use the overlay public line as the opening reference
- Identify the key tension or pattern visible in the dimension scores
- Frame ambivalence or contradiction as informative, not problematic
- Do not resolve the tension — describe it

**Example opening pattern:**
```
あなたの回答では、「[pattern_a]」と「[pattern_b]」が同時に見えています。
これは矛盾ではなく、今の状態を理解するうえで大切な手がかりです。
```

---

### Section 3 — 感情の負荷分析

**Purpose:** Maps emotional weight patterns from the dimension scores.  
**Length:** 600–900 characters  
**Personalization:** Level 2+

**Required elements:**
- Identify the primary emotional load source from top dimensions
- Name the situations or relationship patterns that create load
- Use hedged language: "〜かもしれません", "〜可能性があります"
- Do not pathologize the emotional pattern

---

### Section 4 — 人間関係・距離感のレンズ

**Purpose:** Interprets how the user relates to people from the distance/social dimension.  
**Length:** 600–900 characters  
**Personalization:** Level 2+

**Required elements:**
- Describe the current relational pattern without judgment
- Distinguish between wanting distance and wanting to end relationships
- Include at least one affirming recognition of the user's care for others

---

### Section 5 — 行動と先延ばしのパターン

**Purpose:** Maps behavioral patterns around action, avoidance, and pacing.  
**Length:** 600–900 characters  
**Personalization:** Level 2+

**Required elements:**
- Identify specific behavioral patterns from dimension scores
- Name the cost of current patterns without blaming the user
- Frame avoidance as a signal, not a character flaw

---

### Section 6 — 内側の葛藤マップ

**Purpose:** Identifies the key internal tension pair specific to this persona pattern.  
**Length:** 600–1,000 characters  
**Personalization:** Level 3 only (high confidence required)

**Required elements:**
- Name the two dimensions in tension explicitly
- Explain why both exist simultaneously
- Do not suggest the user must choose one side
- Use the framing: "これは[dimension_a]と[dimension_b]のあいだにある、今のあなたの状態です。"

---

### Section 7 — 回復しやすい整え方

**Purpose:** Offers recovery-oriented adjustment suggestions.  
**Length:** 700–1,000 characters  
**Personalization:** Level 2+

**Required elements:**
- Recommend small, reversible adjustments (not life changes)
- Use the pattern: "〜することで、少し負荷が軽くなることがあります"
- At minimum: one adjustment for relationships, one for behavior, one for rest/recovery
- Do not claim the suggestions are guaranteed to work

---

### Section 8 — 7日間の小さな行動計画

**Purpose:** A day-by-day micro-action plan for the first week.  
**Length:** 700–1,100 characters  
**Personalization:** Level 2+

**Required elements:**
- One concrete focus area per day or every 2 days
- Actions must be small and optional ("もし余裕があれば〜")
- Day 1 always: observe, not act
- Day 7 always: reflect, not evaluate
- No prescriptions, no "must do" language

---

### Section 9 — 30日間の方向性

**Purpose:** A 30-day orienting direction — not a plan.  
**Length:** 500–800 characters  
**Personalization:** Level 2+

**Required elements:**
- Frame as a direction to notice, not a goal to achieve
- Identify one or two slow-moving changes to watch for
- End with an open question for the user to hold

---

### Section 10 — 振り返りの問い

**Purpose:** Reflection questions the user can return to over time.  
**Length:** 300–600 characters  
**Personalization:** Level 1+

**Required elements:**
- 3–5 open-ended questions
- Questions should require no external resources to engage with
- Avoid yes/no questions
- Example pattern: "〜のとき、どんな気持ちが先に来ていましたか？"

---

### Section 11 — 推薦・リソースのヒント

**Purpose:** Points toward relevant self-understanding angles and resources.  
**Length:** 400–700 characters  
**Personalization:** Level 2+

**Required elements:**
- Name 2–3 topic areas relevant to the user's pattern (not specific books or URLs)
- Use neutral framing: "〜について調べてみることが、助けになるかもしれません"
- Do not claim these resources are verified or guaranteed
- Include the safety boundary note for crisis context

**Safety boundary note (always include):**
```
このレポートで扱っている内容が、つらさの深刻な部分に触れる場合は、
信頼できる人や、公的・専門的な相談先を確認することも選択肢です。
```

---

### Section 12 — 次に見るべき変化

**Purpose:** Helps user notice meaningful shifts over coming weeks.  
**Length:** 400–700 characters  
**Personalization:** Level 2+

**Required elements:**
- 3–4 observable changes to watch for (not to achieve)
- Changes should be small and behavioral, not internal/psychological
- Frame as: "〜が少し変わっていたら、それは整いはじめているサインかもしれません"

---

### Section 13 — 注意書き・限界 *(Fixed — Do Not Modify)*

**Purpose:** Safety and limitation disclosure. Always present. Always identical.  
**Length:** Fixed (~200 characters)  
**Personalization:** None — fixed text only

**Fixed content (do not alter):**
```
このレポートは、医療・心理診断、治療、カウンセリング、未来予測ではありません。
今の状態を整理し、小さな次の行動を考えるための自己理解レポートです。
つらさが強い、長く続く、生活に影響している場合は、
信頼できる人や、公的・専門的な相談先を確認することも選択肢です。
```

---

### Section 14 — 保存用まとめ

**Purpose:** Compact summary for revisiting later (LINE, browser save).  
**Length:** 400–700 characters  
**Personalization:** Level 1+

**Required elements:**
- 3–5 bullet points summarizing the user's key pattern
- 1–2 sentences on their primary recovery direction
- Do not include action items (those are in sections 8–9)
- Written in second person, past tense of observation: "あなたの回答では〜が見えていました"

---

## 5. Phrase Rules

### Forbidden Phrases (Never Use)

| Category | Forbidden | Reason |
|---|---|---|
| Purchase | 購入する, 今すぐ買う, 決済 | Not a product page |
| Product maturity | 正式版, 完全版 | Implies incomplete current state |
| Availability | 準備中, coming soon | Creates misleading expectation |
| Hidden truth framing | 本当の核心, 隠された核心, 核心を見抜く | Manipulative framing |
| Absolute certainty | 必ず〜です, 確実に〜なります, 間違いなく | Overclaims |
| Future prediction | 〜になるでしょう (as certainty), 未来が〜 | Out of scope |
| Clinical | 診断されています, 治療が必要です, 病気 | Clinical/medical scope |
| Destiny | 運命, 天命, 宿命 | Fortune-telling register |
| Secret/hidden | 秘密, 隠された答え, 本当の答え | Manipulative |
| Fear-based | 〜しないと危険です, 早く行動しないと | Dark pattern |

### Controller Clarification on 核心

Do not treat all uses of `核心` as forbidden. The word `核心` is acceptable in neutral usage such as:

- "今の状態の核心にあるのは〜" (describing the center of a pattern)
- "この核心部分を整理すると〜"

Only the following hidden-truth framing patterns are forbidden:
- `本当の核心` (implies users don't know their "real" truth)
- `隠された核心` (implies hidden/secret nature)
- `核心を見抜く` (implies analyst superiority)

### Required Phrases / Patterns

| Context | Required language |
|---|---|
| Hedge on interpretation | 〜かもしれません / 〜可能性があります |
| Action suggestion | もし余裕があれば〜 / 〜してみることも一つです |
| Safety reference | 信頼できる人や、公的・専門的な相談先を確認することも選択肢です |
| Section 13 | Fixed text, verbatim (see above) |
| Result reference | 今の[result_public_name]の状態から〜 |

### Tone Standards

- Calm, non-urgent throughout
- Self-directed (the user is the agent, not the report)
- Non-prescriptive (suggestions, not instructions)
- Acknowledges ambiguity and uncertainty
- Does not dramatize or escalate
- Does not minimize either ("大したことはありません" is also forbidden)

---

## 6. Personalization Rules

### What May Be Personalized

- Section 1: result public name, primary trait phrase
- Section 2: overlay public line, top dimension pattern
- Sections 3–5: dimension-weighted interpretation phrases
- Section 6: tension pair names (L3 only)
- Section 7–9: action catalog selection from dimension
- Section 10: reflection question set (persona-matched)
- Section 11: topic area selection from dimension matching
- Section 12: observable change list from dimension monitoring set
- Section 14: key pattern summary from sections 1–2

### What Must NOT Be Personalized

- Section 13: always identical, never personalized
- Safety boundary note in section 11: always identical
- Tone and hedge language: same standards for all users
- Phrase rules: same standards for all users

---

## 7. Length and Quality Control

### Pre-Delivery Checklist

- [ ] Total character count ≥ 8,000
- [ ] Total character count ≤ 15,000
- [ ] All 14 sections present and non-empty
- [ ] Section 13 text matches fixed template verbatim
- [ ] No forbidden phrases present
- [ ] No high-certainty claims present
- [ ] No clinical/medical language present
- [ ] No destiny/hidden-truth framing present
- [ ] Safety boundary note present in section 11
- [ ] Tone is consistent across all sections
- [ ] Action plans are small and optional
- [ ] Report metadata fields complete

---

## 8. Safety / Governance Checklist

Completed by Safety/Governance Agent or Edward before each report delivery:

| Check | Pass criteria |
|---|---|
| Section 13 present | Verbatim match to fixed text |
| No medical/clinical scope | "診断", "治療", "病気", "症状" absent from all sections except section 13 boundary reference |
| No certainty overclaim | "必ず", "確実に", "間違いなく" absent |
| No fear-based language | No urgency pressure, no negative consequences framing |
| No hidden-truth framing | 本当の核心, 隠された核心, 核心を見抜く absent |
| Hedged language present | "かもしれません" or "可能性があります" present in sections 2–6 |
| Safety reference present | Section 11 safety boundary note present verbatim |
| Action plans are optional | "もし余裕があれば" or similar present in sections 8–9 |
| Low-confidence sections flagged | Any L3 section generated under L2 confidence is flagged |

---

## 9. Example Mini Template — Relationship / Social Distance Lens

This example illustrates the writing style and structure for a user whose top dimension is relationship/social distance.

---

**Section 1 example (状態要約):**

> 今のあなたは、人との距離感を整えようとしているところにいます。関係を大切にしたい気持ちと、少し距離を置いて自分を戻したい感覚が、同時にある状態かもしれません。このレポートでは、その両方の感覚を手がかりに、今の状態を整理していきます。

---

**Section 4 example (人間関係・距離感のレンズ):**

> 今あなたが取りたい距離は、相手と関係を終わらせたいというより、関わり続けるために必要な余白かもしれません。返信・予定・気づかいの積み重ねが少し重くなっているとき、距離を置きたくなるのは、関係への気持ちがなくなったからではなく、むしろ大切にしているからこそ出てくるサインであることがあります。

---

**Section 8 example (7日間の行動計画):**

> 1日目：今いちばん負担になっている連絡や予定を、ひとつ思い浮かべます。  
> 2日目：それに対して「すぐ返す以外の選択肢」を、ひとつ書き出します。  
> 3日目：「短く返す」「一度持ち帰る」「今日は休む」のどれかを選びます。  
> 4〜5日目：選んだあとに、自分の疲れがどう変わったかを見ます。  
> 6日目：うまくできたかより「少し軽くなった場所があったか」を確認します。  
> 7日目：この7日間に気づいたことを、一行だけ書き留めます。

---

**Section 13 (fixed text — verbatim):**

> このレポートは、医療・心理診断、治療、カウンセリング、未来予測ではありません。今の状態を整理し、小さな次の行動を考えるための自己理解レポートです。つらさが強い、長く続く、生活に影響している場合は、信頼できる人や、公的・専門的な相談先を確認することも選択肢です。

---

> **This document is a methodology specification, not implementation approval.**
