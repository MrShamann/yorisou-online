# WS-F — Longitudinal History

**Program:** YORISOU Complete Platform V1 (integrated Preview build)
**Branch:** `feat/cpv1-integrated-platform` (stacked; **not** targeting `main`)
**Workstream:** F — append-only / version-preserving history events
**Contract:** `lib/cpv1/history.ts`
**Maturity:** `CONTRACT_CPV1` — real typed contract + model + tests; not yet a full public surface.

Brand vision: **人を、ひとつの答えに閉じ込めない。**
Brand line: **ひとつの見方で、あなたを決めない。**

---

## 1. Purpose

WS-F is the program's **memory of what happened, not a rewrite of what is true**. It records the
longitudinal sequence of everything a person does across the YORISOU loop — method completion, result
creation, confirm / correct / reject, reflections, action lifecycle, feedback signals, and Companion /
community / recommendation outcomes — as an **append-only, version-preserving** event log.

Two invariants make this workstream load-bearing:

1. **No silent rewrite of historical results.** When a method's logic or version changes, the prior
   result is preserved and a *new* event records the change: what changed, when, which method + version,
   and whether the user confirmed it. History never overwrites the past.
2. **The record is the person's, not the platform's verdict.** History complements WS-D's
   source-separated understanding (`lib/cpv1/understanding.ts`) — it never collapses a life into one
   score, one label, or one answer. It shows a plurality of views over time and the user's own stance
   toward each (ひとつの見方で、あなたを決めない).

WS-F is the substrate that later powers honest "what changed since last time" views, longitudinal
learning (WS-I), and the Life Archive (WS-K) — without any of those surfaces being able to fabricate or
retroactively edit the past.

---

## 2. Maturity

`CONTRACT_CPV1`. Present and real in this program:

- Typed event contract and helpers in `lib/cpv1/history.ts` (append-only guard, result-change recorder,
  user-facing change-view builder).
- Contract-level tests exercised in the CPV1 suite (`lib/yorisou-tests/__tests__/cpv1Completion.test.ts`).

Explicitly **not** claimed by this spec:

- No production persistence, migration, or schema is activated by this document (local Supabase / Preview
  only per Program Architecture §5).
- No public timeline surface is shipped; UI is `ARCHITECTURE_CPV1` and gated behind dev flags.
- No fabricated history, synthetic timelines, or example users are presented as real activity.

---

## 3. Data / contract model

All types below are **real** and defined in `lib/cpv1/history.ts`. This spec does not invent code.

### 3.1 Event types — `HistoryEventType`

The append-only log records exactly these event kinds (one enum, no free-form silent mutation):

| Group | `HistoryEventType` members |
|---|---|
| Method + result | `method_completed`, `result_created` |
| User stance | `user_confirmed`, `user_corrected`, `user_rejected` |
| Reflection | `reflection_recorded` |
| Action lifecycle | `action_saved`, `action_tried`, `action_completed` |
| Feedback signals | `marked_helpful`, `marked_not_helpful`, `hidden`, `not_for_me` |
| Loop outcomes | `companion_interaction`, `community_participation`, `recommendation_outcome` |

### 3.2 Event shape — `HistoryEvent`

```
HistoryEvent {
  id: string;
  type: HistoryEventType;
  methodId: string | null;
  methodVersion: string | null;      // which method version produced/changed this
  objectRef: string | null;          // safe ref (result/action/item id) — never raw content
  at: string;                        // ISO timestamp; append-only
  safeDetail: string | null;         // non-sensitive detail only
  supersedesVersion: string | null;  // version-preserving: prior version, not an overwrite
}
```

Design notes tied to the real fields:

- **`objectRef` is a safe reference, never raw sensitive content.** Birth data, raw answers, and free
  text stay in their own consent-scoped stores (WS-E); history holds only pointers + non-sensitive
  `safeDetail`. This keeps the log exportable and deletable without leaking sensitive inputs.
- **`supersedesVersion` encodes version preservation.** A change points *back* at the version it
  supersedes rather than mutating it — the prior state remains reconstructible.
- **`methodVersion`** is always carried so any surface can honestly answer "which method version said
  this, and when".

### 3.3 Append-only guard — `appendEvent(history, event)`

Returns a **new** array with the event appended. The contract is that callers **never** rewrite an
existing element. Persistence layers (local Supabase, Preview) MUST enforce this at the storage boundary
too (insert-only; no `UPDATE`/`DELETE` on committed history rows except a user's own erasure right, §5).

### 3.4 Result-change recorder — `recordResultChange({ id, methodId, fromVersion, toVersion, userConfirmed, at })`

When a method's logic changes, this produces a `result_created` event whose `supersedesVersion =
fromVersion`, `methodVersion = toVersion`, and `safeDetail` states
`"method logic updated <from> → <to>; prior result preserved"`. This is the canonical, honest way a
version change enters the record — no in-place edit of the earlier result.

### 3.5 Change view — `buildChangeView(history)` → `ChangeView[]`

A deterministic, user-facing "what changed" projection derived purely from the append-only log:

```
ChangeView { at; methodId; methodVersion; what; userConfirmed }
```

It surfaces `result_created` / `user_corrected` / `user_rejected` events and marks whether the user
confirmed the referenced object (matched via `user_confirmed` events by `objectRef ?? methodId`). This is
the read-model for "show what changed, when, which method + version, and whether you confirmed it."

### 3.6 Relationship to sibling contracts

- **WS-D understanding** (`lib/cpv1/understanding.ts`): `result_created` / `user_confirmed` /
  `user_corrected` / `user_rejected` events mirror the `ConfirmationState` of an `Observation`. History
  is the temporal log; understanding is the current source-separated view. Neither averages incompatible
  methods (`NO_UNIVERSAL_SCORE`).
- **WS-E consent** (`lib/cpv1/consent.ts`): the user-data rights (`ALL_USER_DATA_RIGHTS`:
  confirm / correct / reject / hide / forget / delete / export / revoke_downstream) act on history too;
  `canPersist` / `canShareToCommunity` gate whether an event may be stored beyond session or leave the
  device.
- **WS-B methods** (`lib/cpv1/methods.ts`): `methodId` / `methodVersion` reference registered methods;
  rights-blocked methods produce no public history route.
- **Dev flags** (`lib/cpv1/flags.ts`): any history *preview UI* is gated (`isDevPreviewContext`), never
  public.

---

## 4. Governance & prohibitions

- **No silent rewrite.** Historical results are immutable; a change is a new, version-linked event. Any
  code path that mutates a committed `HistoryEvent` in place violates the contract.
- **No fabricated history.** No seeded timelines, fake users, invented outcomes, or synthetic
  "community activity" may be presented as real. Test fixtures are synthetic-only and never shown as
  customer evidence (Program Architecture §5).
- **No universal score / no verdict.** History must not be reduced to a single number, rank, or
  fixed-identity label. No 31 Personas, no Persona rooms, no fixed user taxonomy.
- **No public method activation via history.** A rights-blocked method (`RIGHTS_BLOCKED`) surfaces no
  public timeline entry; history for such methods stays behind private dev flags only.
- **No raw sensitive content in the log.** `objectRef` + `safeDetail` only; raw inputs live in
  consent-scoped stores under WS-E.
- **Preview / local only.** No production deploy, migration, secrets, or real payment. No public Digital
  Legacy activation (that path is `LEGAL_BLOCKED` in WS-K).
- **AI is a labelled source, never a fact.** Any `companion_interaction` or AI-synthesis-linked event is
  attributed as AI-derived, never presented as method output or verified truth.

---

## 5. Privacy / consent touchpoints

- **User data rights apply to the log itself.** Per `lib/cpv1/consent.ts`, a person may **confirm,
  correct, reject, hide, forget, delete, export, revoke_downstream** on their history. `forget` / `delete`
  are the sanctioned exceptions to append-only: they are the *user's own* erasure, audited and honored —
  distinct from platform-side rewriting, which is forbidden.
- **Retention follows the method's consent.** History events for session-only (sensitive/birth-data)
  methods are not persisted beyond the session unless `saveAcknowledged` (see `canPersist`).
- **Downstream use is opt-in and scoped.** A history event does not implicitly authorize Companion,
  recommendation, or community use; those follow the observation's `PrivacyScope` /
  `permittedDownstream` and `canUseDownstream`. `community_participation` requires `public_safe`.
- **Export is honest and complete.** Export includes the append-only sequence with versions and
  confirmations so a person can see the full, unedited record of what changed and when.
- **Revocation is forward-visible.** `revoke_downstream` is itself recorded as an event; revocation does
  not erase that it once applied, it records the boundary going forward.

---

## 6. Acceptance criteria

1. **Append-only holds.** `appendEvent` never mutates prior elements; the storage layer rejects
   `UPDATE`/`DELETE` on committed history rows except a user-invoked `forget`/`delete`.
2. **Version preservation holds.** A method version change produces a `recordResultChange`
   `result_created` event with `supersedesVersion = fromVersion` and the prior result reconstructible.
3. **Change view is honest.** `buildChangeView` reports every `result_created` / `user_corrected` /
   `user_rejected` with `at`, `methodId`, `methodVersion`, `what`, and correct `userConfirmed`.
4. **Confirmation matching is correct.** `userConfirmed` is true iff a `user_confirmed` event exists for
   the same `objectRef ?? methodId`.
5. **No sensitive leakage.** No raw answers / birth data appear in any `HistoryEvent`; only `objectRef`
   and non-sensitive `safeDetail`.
6. **No universal score.** No surface derived from history emits a single collapsed score or fixed label.
7. **Rights gate respected.** Rights-blocked methods yield no public history entry; preview surfaces are
   flag-gated (`isDevPreviewContext`).
8. **User rights honored.** confirm / correct / reject / hide / forget / delete / export / revoke_downstream
   all operate on history and are themselves audited.
9. **Determinism.** `buildChangeView` is pure and order-stable for a given input log (test-verified).
10. **Truthful maturity.** This surface is presented as `CONTRACT_CPV1`; no "live" or "implemented public
    timeline" claim is made.

---

## 7. Open blockers

- **`UI-ARCH` (`ARCHITECTURE_CPV1`).** The user-facing longitudinal timeline / "what changed" surface is
  design-only; it stays behind `cpv1_*_preview` dev flags until designed, built, and privacy-reviewed.
- **`PERSIST` (Preview-gated).** Durable append-only + insert-only RLS storage exists only against local
  Supabase / Preview; production persistence is out of scope for this program (§5).
- **`ERASURE-SEMANTICS` (`CONTRACT_CPV1`).** The exact reconciliation of user `forget`/`delete` with the
  append-only invariant (tombstone vs. hard erase, and its audit form) needs a dedicated data-rights
  decision before any persistence is activated.
- **`WS-D/E COUPLING`.** Precise event emission from understanding (WS-D) and consent (WS-E) state
  transitions is contract-level; end-to-end wiring is tracked in those workstreams.
- **`RIGHTS_BLOCKED` methods.** History for external / rights-blocked methods cannot appear on any public
  route until rights clearance + original content + Founder activation (Program Architecture §2).
- **`LEGAL_BLOCKED` legacy.** History feeding a public Digital Legacy / Life Archive is blocked pending
  legal/jurisdiction review (WS-K); no such activation occurs in this program.

---

*This is a governed design specification, not product code. It references real contracts in `lib/cpv1/`
and must not be read as a claim that any public surface is live.*
