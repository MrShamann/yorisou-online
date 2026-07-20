# MTF-2A — Daily Check-in「きょうの空模様」Product Specification

Canonical machine spec: [`daily-check-in.v1.json`](./daily-check-in.v1.json). This document explains and justifies it.

## 1. Identity (fixed per MTF-2A §6.1)

`daily-check-in` · family `yorisou_state` · `method_evidence_class: yorisou_original_reflection` · **`execution_model: recorded_state`** · result `StateRecordResult` · `understanding_policy: method_derived_eligible` · `comparison_policy: method_local_timeline_only` · rights `YORISOU_ORIGINAL_REBUILD_CANDIDATE` → originality `YORISOU_ORIGINAL_AUTHORED_PENDING_FOUNDER_REVIEW` · **`activation_state: gated`**.

**Name:** 「きょうの空模様」／subtitle 「1分のじぶん記録」. Collision-checked: distinct from 今のわたしチェック (C02), 今日のおみくじ (S01), and every existing result/persona/companion name.

It is NOT: a personality test, a mood diagnosis, a mental-health screening, a wellness score, a productivity score, or a universal daily score. **No score of any kind is calculated.**

## 2. State schema (`daily-state-schema-v1.1`)

Five fields, all individually optional (an entry saves with ≥1 value; nulls are stored as 「未記入」, never defaulted, never treated as a worst value):

| Field | JA | Options | Design note |
|---|---|---|---|
| `kokoro_tenki` | こころの天気 | はれ／うすぐもり／くもり／あめ／かぜが強い | weather metaphor: shoulder-surf-safe, non-clinical; かぜ＝落ち着かない (restless), NOT anxiety vocabulary |
| `karada_juden` | からだの充電 | たっぷり／まあまあ／少なめ／ほぼ空 | battery metaphor; no health/symptom language |
| `atama_yohaku` | あたまの余白 | すっきり／ふつう／ぎっしり／ぐるぐるしている | cognitive load in everyday words |
| `hito_kyori` | ひととの距離 | 近くにいたい／いつも通り／少しそっとしていたい／ひとりの時間がほしい | social battery without judgment; matches the house 距離感 vocabulary |
| `kyou_hoshii` | きょうほしいもの | やすみ／整理する時間／気分転換／だれかと話す／ひとりの時間／小さな達成感 | the actionable field; drives gentle hints |
| `hitokoto_memo` | ひとことメモ | free text ≤140 chars | **opt-in, default OFF**, P5, private-only, never in share/URL |

Construct rationale (per §6.3 the suggested list was not adopted mechanically): "sense of pace" was folded into `atama_yohaku`+`kyou_hoshii` after review — a sixth daily field measurably increased completion time past the 60s ceiling in the format benchmark, and pace is better read from the weekly pattern than asked daily.

## 3. Recording model (execution-model artifact, Forge step 10 — `recorded_state`)

- **No score is calculated. `yorisouScoring: null` (structural).**
- Record identity (MTF-2A.1): `producedAt` (UTC ISO) + `entryLocalDate` + IANA `timezone` (+ optional UTC offset); one VISIBLE entry per entryLocalDate; same-day edits are VERSIONED corrections (prior versions preserved per CPV1 history/audit policy — no destructive overwrite, no silent replacement); travel never re-buckets past entries; an entry requires >=1 structured field (memo alone is not an entry).
- Validation: one optionId per field or null; memo only when opted in.
- Missing inputs: rendered 未記入; acknowledgement cascade skips null fields; no imputation.
- Cadence: `daily`, **streak-free** — gaps carry no penalty and no guilt copy (「あいだが空いても、なにも失われません。」).

## 4. Acknowledgement model (`daily-ack-v1.1`)

A **finite set of 13 authored acknowledgements** selected by a deterministic priority cascade (first match wins): first-entry → rain → wind → low battery → swirl → need-keyed (6) → sunny → neutral. Canonical rules + full copy in the JSON.

- Deterministic ≠ scoring: the cascade picks COPY, it computes nothing about the person; represented to users as 「きょうのひとこと」, never as an assessment.
- Explicitly avoided: good/bad-day ranking, severity language, worsening claims, diagnosis, permanent identity statements.
- Maintainable: 13 entries, versioned; not a combinatorial sentence generator.
- Coverage: every cascade branch has an existing ack; every ack is reachable (validator-checked).

## 5. Result object

`StateRecordResult` (MTF-1.3 contract): stateValues (words, not numbers) · optional private reflection · cadence · acknowledgementJa · `comparisonPolicy: "method_local_timeline_only"` · `understandingPolicy: "method_derived_eligible"` · `RecordedStateProvenance` (schema version, method version, `yorisouScoring: null`) · confirmation `required: true` (confirm/correct/delete any entry) · **no archetype, no scoring version**.

**Understanding boundary (explicit):** entries may contribute **source-separated current-state context** to private understanding under consent (timing/context relations) — they are **never numerically averaged or compared with any other method**, and never produce a universal score.

## 6. Timeline semantics (the deep output)

There is deliberately **no conventional deep report**. The longitudinal experience IS the deep output:

- **7-day view** 「この7日の空模様」 — five mini-rows (one per field), icons/words only.
- **30-day view** 「この30日の空模様」 — weather strip + need-frequency words (e.g. 「今月いちばん多かった『ほしいもの』：やすみ」). Words, never counts presented as scores.
- **Recent-pattern summary** — authored sentence patterns over the last 7 days (e.g. 雨が続いた週, 充電少なめの週), selected deterministically, phrased as observations, never as deterioration claims.
- **Recurring context (opt-in)** — the user may confirm a recurring pattern into their private understanding (CPV1 confirmation flow).
- **Gentle reflection prompts** — 3 authored prompts shown at most weekly.

## 7. Recommendations

Governed-taxonomy tags (need_rest/need_order/need_change/need_connect/need_solo/need_small_win) map 1:1 from ALL SIX `kyou_hoshii` options (unanswered => explicit no_recommendation); each mapping carries a fit reason and consent applicability — optional hints only, no verdicts, **no commercial products in public copy, no payment/pricing/urgency anywhere** (none is implemented).

## 8. Channels & accessibility

One-screen radio groups; full a11y labels in the copy bundle; WCAG 2.2 AA per house gate; LIFF-compatible single view; future native rendering uses the same schema (channels never own logic).
