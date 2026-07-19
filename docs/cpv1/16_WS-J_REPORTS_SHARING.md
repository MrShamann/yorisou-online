# WS-J — Reports & Sharing

**Program:** YORISOU Complete Platform V1 (CPV1) · **Branch:** `feat/cpv1-integrated-platform`
**Maturity (this workstream):** `CONTRACT_CPV1` — real typed contract + model + tests, extending the
already-shipped APP-2 report surfaces (`LIVE_APP2`). Not a new public share surface until Founder
activation.
**Brand vision:** 人を、ひとつの答えに閉じ込めない。 · **Brand line:** ひとつの見方で、あなたを決めない。

Reports are where the whole loop becomes legible to the person: multi-method understanding →
private continuity → change over time → action/outcome. Sharing is where a *fragment* of that,
and only a fragment the user explicitly approves, may leave the private boundary. This spec governs
both, and the line between them.

---

## 1. Purpose

Give each person a truthful, source-separated view of what YORISOU currently understands about
them — never one universal score, never a fixed label — and a strictly-bounded way to share a
public-safe fragment if (and only if) they choose to.

Four report types + one share artifact:

1. **Method-specific private report** — extends the APP-2 nine-family reports
   (`app/data/app2/familyReports.ts`, rendered by `app/reports/family/[family]`). Per-method, calm
   Japanese, device-local by default, non-diagnostic.
2. **Cross-method synthesis report** — source-labelled themes across methods, built only from
   `synthesizeThemes` in `lib/cpv1/understanding.ts`. Surfaces recurring / mixed / contradictory /
   temporary patterns. **No averaged number. No overall verdict.**
3. **Change-over-time report** — version-preserving longitudinal view from `lib/cpv1/history.ts`
   (`buildChangeView`). Shows what changed, when, by which method version, and whether the user
   confirmed it.
4. **Action / outcome history report** — the action loop (saved → tried → completed → helpful /
   not-helpful) derived from `HistoryEvent`s, with recommendation outcomes.
5. **Public-safe share card** — the *only* artifact that may cross the private boundary, and only
   with per-item approval.

---

## 2. Maturity

`CONTRACT_CPV1`. The typed contracts and synthesis/history logic are real
(`lib/cpv1/understanding.ts`, `lib/cpv1/history.ts`, `lib/cpv1/consent.ts`) and are covered by the
CPV1 contract suite (`lib/yorisou-tests/__tests__/cpv1Completion.test.ts`). The private method report
already ships on APP-2 (`LIVE_APP2`). The cross-method synthesis report, change-over-time report,
and public-safe share card are **contracted, not publicly activated** — they render only behind the
`cpv1_understanding_model_ui` dev flag (`lib/cpv1/flags.ts`, off by default, LOCAL/Preview only).
No new public share surface is claimed live.

---

## 3. Data / contract model (references real `lib/cpv1`)

**Source labelling — every reported line is an `Observation` (`understanding.ts`).** A report never
renders a bare sentence; it renders a labelled observation carrying `sourceClass`, `methodId`,
`methodVersion`, `evidenceClass`, `confirmation`, and `freshnessAt`. `ai_synthesis` is a distinct
`SourceClass` and `isAiSynthesis(o)` must gate its rendering as "YORISOUのまとめ（推測）", never as a
method result or verified fact.

**Report inclusion is `canUseDownstream(o, "report")` — nothing else decides it.** Per the real
`PRIVACY_ALLOWS.report` set, an observation is report-eligible only when it is not `deleted`, not
`rejected`, and its `privacy` is `account_private` or broader. Deletion and rejection therefore
propagate into every report for free — there is no second inclusion path to keep in sync.

**Cross-method synthesis is `synthesizeThemes(observations, themeKeyOf)` — verbatim.** The function
is pure and deterministic, groups non-deleted/non-rejected observations by theme key, and reports
`agreement: "recurring" | "mixed" | "contradictory" | "temporary"` with `supportingMethodIds`. WS-J
supplies only the `themeKeyOf` projection (a safe derived-theme key, never raw answer text). The
constant `NO_UNIVERSAL_SCORE = true` is the invariant this workstream must never violate: no code
path may collapse `SynthesisTheme[]` into a single number, rank, or percentage.

**Change-over-time is `buildChangeView(history)` (`history.ts`).** History is append-only
(`appendEvent`); superseded results are preserved via `recordResultChange` /
`supersedesVersion`, never overwritten. The report shows method-version transitions
("method logic updated vX → vY; prior result preserved") and `userConfirmed` state.

**Action / outcome history** reads the action `HistoryEventType`s directly: `action_saved`,
`action_tried`, `action_completed`, `marked_helpful`, `marked_not_helpful`, `hidden`, `not_for_me`,
`recommendation_outcome`. `objectRef`/`safeDetail` are safe refs only — never raw content.

**Public-safe share card (WS-J contract, references real fields):**

```
ShareCard = {
  methodNameJa: string          // from MethodRegistryEntry.nameJa — activated methods only
  approvedTheme: string         // a SynthesisTheme.theme the user explicitly approved
  nonSensitiveSummary: string   // ≤1 short line, non-diagnostic, no raw derived text
  companionExpression: string   // Companion's calm phrasing (WS-G), not a claim about the user
  lowRiskPrompt: string | null  // an open reflection prompt, never advice/vulnerability
  privacy: "public_safe"        // MUST be public_safe; asserted, never inferred
}
```

Every field is user-approved individually. A share card is constructible only from observations
where `privacy === "public_safe"` **and** `permittedDownstream` includes the relevant use — the same
gate `canUseDownstream` enforces for `community`.

---

## 4. Governance & prohibitions

**The private→public boundary is one-directional and never automatic.** Private reports NEVER
auto-become, and no code path may convert them into:

- public cards or a public feed,
- a community identity, persona, or room membership (there are **no 31 Personas, no Persona rooms,
  no fixed user taxonomy**),
- a profile label / badge asserting who the person "is",
- supplier / recommendation-partner data,
- social proof, testimonials, ratings, or aggregate marketing metrics.

**Never expose in any shared artifact** (hard denylist, enforced at the ShareCard boundary):

- raw answers / raw 120Q responses,
- birth data (date/time/location) or any derived birth-chart material,
- private-report text (the full method or synthesis report body),
- inferred vulnerability (financial stress, health, mental-state inference, isolation),
- relationship details / third-party data,
- Life Archive & Legacy materials (WS-K; `LEGAL_BLOCKED`, no public activation).

**Public-safe sharing may include ONLY:** activated method **name** + user-approved **theme** +
non-sensitive **summary** + Companion **expression** + a low-risk **prompt**. Nothing else.

**Method name in a share card requires an activated method.** A method that is `rights_blocked` /
`contract_only` (`lib/cpv1/methods.ts` `MethodActivationState`) is off all public routes, so its name
cannot appear in any shared artifact. `rightsClears` (`lib/cpv1/rights.ts`) is the upstream gate;
WS-J trusts it and does not re-derive rights.

**No universal score, ever.** Reports present agreement/disagreement across labelled sources, not a
ranking. Contradictions between methods are shown as contradictions — 「ひとつの答えに決めるものでは
ありません」 — not resolved into a winner.

**No fabricated content.** Reports render only real observations and real history events. No invented
metrics, percentages, benchmarks, clinical/diagnostic language, or synthetic community activity.
Synthetic fixtures may appear only in tests and are never presented as real user data.

---

## 5. Privacy / consent touchpoints

- **Inclusion consent is per method, not global** (`lib/cpv1/consent.ts`). A method's report content
  is retained per `RetentionMode`; `session_only` (default for `chinese_traditional` /
  `western_symbolic` birth-data families) means the report exists only for the session unless the
  user takes an explicit save (`saveAcknowledged` → `canPersist`).
- **Sharing consent is separate and stricter.** `canShareToCommunity(c)` requires `communityUse`
  explicitly true **and** `saveAcknowledged` — both default false. Building a share card never flips
  either; the user approves each field in the share flow.
- **Every user right always available** (`ALL_USER_DATA_RIGHTS`): confirm, correct, reject, hide,
  forget, delete, export, revoke_downstream. Reports expose all eight in-context per line.
- **Correction path.** A user correction records a `user_corrected` history event and an observation
  with `confirmation: "corrected"` + `userCorrection`; the corrected reading is what future reports
  render. The prior version is preserved in history (not silently rewritten) and visible in the
  change-over-time report.
- **Deletion / revocation path.** `delete` sets `deleted` and `revoke_downstream` narrows
  `privacy` / `permittedDownstream`; because inclusion is `canUseDownstream(o, "report")`, deleted or
  revoked observations disappear from every report and can never seed a share card. Export produces a
  user-held copy of their own labelled observations and history.
- **Companion expression** in a share card is the Companion's phrasing (WS-G,
  `ARCHITECTURE_CPV1`), explicitly not a claim, diagnosis, or label about the person.

---

## 6. Acceptance criteria

1. Every reported line renders its `sourceClass`, `methodId`, `methodVersion`, and `confirmation`;
   no unlabelled assertions; `ai_synthesis` is visibly distinct and never shown as method output.
2. Cross-method synthesis is produced only by `synthesizeThemes`; a test asserts no report path emits
   an overall score/percentage/rank (`NO_UNIVERSAL_SCORE` upheld).
3. Deleting or rejecting an observation removes it from all four reports and blocks it from any share
   card, with no separate inclusion list — verified via `canUseDownstream(o, "report")`.
4. Change-over-time shows version transitions from append-only history; superseded results remain
   visible; nothing is overwritten (`recordResultChange` / `supersedesVersion`).
5. A share card is constructible **only** from `public_safe` observations, contains **only** the five
   allowed fields, and a boundary test proves the denylist (raw answers, birth data, private-report
   text, inferred vulnerability, relationship details, Legacy materials) can never be serialized into
   it.
6. No private report auto-converts to a public card, community identity, profile label, supplier
   data, or social proof — asserted by a test that no report→public transition exists without an
   explicit per-item approval.
7. A `rights_blocked` / `contract_only` method's name cannot appear in any share card.
8. New CPV1 report/share surfaces render only behind `cpv1_understanding_model_ui`; off in
   production; APP-2 nine-family private reports remain unchanged and passing.

---

## 7. Open blockers

- `RIGHTS_BLOCKED` (upstream, WS-B/C): external-method report bodies (Zi Wei Dou Shu, Ba Zi, I Ching,
  astrology, Tarot, Big Five, MBTI, …) cannot carry original/licensed interpretation content in this
  program, so their method reports stay off public routes. Their *governed presence* (registry name +
  rights record) may be referenced but not rendered as content.
- `FOUNDER_GATED`: public activation of the cross-method synthesis report, change-over-time report,
  and public-safe share card requires an explicit Founder review (privacy review + tests + activation)
  before leaving the dev flag.
- `LEGAL_BLOCKED` (WS-K): Life Archive & Legacy materials are excluded from all reports/sharing while
  Legacy activation remains legally blocked; no share path may reference them.
- Open design item: the `themeKeyOf` projection must be authored so theme keys are safe derived
  summaries only — a review checkpoint is required to guarantee no raw answer text or sensitive
  input leaks through the key.

---

## 8. CPV1-R1 §7/§9 corrections (genuine synthesis + independent downstream)

R1 rebuilt the understanding contract in `lib/cpv1/understanding.ts` (migration
`202607190003`) that this workstream renders from:

- **Relation-based contradiction (§7).** `synthesizeThemes(...)` groups
  `Observation`s by `themeKey` and reads each observation's `relation`
  (`supports | opposes | unrelated | uncertain`, with an optional
  `correctedRelation` the user can set — `effectiveRelation(o)` resolves it). A
  theme is reported **`contradictory` only when ≥1 observation supports AND ≥1
  opposes** the same theme — never merely because two different methods produced
  entries. `recurring` needs ≥2 supports; a purely `uncertain` set stays
  `uncertain`; `unrelated`/deleted/rejected are excluded. `SynthesisTheme` exposes
  `supportingMethodIds` + `opposingMethodIds`, and output is deterministically
  sorted (contradictory first). `NO_UNIVERSAL_SCORE` still holds — no overall
  score/rank is derived.
- **Independent downstream gating (§9).** `canUseDownstream(o, use)` is an
  **independent** check, not an ordered privacy ladder:
  `!deleted && !rejected && permittedDownstream.includes(use)` and, for
  `community`/`public`, additionally `visibility === "public_safe"`. Acceptance
  criteria #3 (delete/reject removes an observation from all reports and share
  cards) and #5 (share card only from `public_safe` observations) are enforced by
  this single predicate — there is no separate inclusion list.

Covered by `lib/yorisou-tests/__tests__/cpv1Completion.test.ts` (§7). These
surfaces remain behind `cpv1_understanding_model_ui`; APP-2 nine-family private
reports are unchanged.
