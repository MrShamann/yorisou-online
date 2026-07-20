# WS-K — Life Archive & Legacy

**Program:** YORISOU Complete Platform V1 (CPV1) · **Branch:** `feat/cpv1-integrated-platform` (stacked; **not** targeting `main`)
**Workstream:** K — Life Archive · Designated Legacy Access · Source-grounded Memory Q&A · Legacy Companion
**Primary maturity:** `ARCHITECTURE_CPV1` · **Blocking gate:** `LEGAL_BLOCKED` (no production activation of any post-death access in this program)
**Contracts referenced (real):** `lib/cpv1/consent.ts`, `lib/cpv1/understanding.ts`, `lib/cpv1/history.ts`, `lib/cpv1/methods.ts`, `lib/cpv1/rights.ts`, `lib/cpv1/flags.ts`

Brand vision: **人を、ひとつの答えに閉じ込めない。**
Brand line: **ひとつの見方で、あなたを決めない。**

---

## 1. Purpose

WS-K is the end of the YORISOU loop: **a person's own archive of their life, under their own control, and a strictly-governed design for what — if anything — may outlive them.** It is not a memorial product, not a "digital resurrection", and not a public feature in this program. Its four sub-scopes are:

- **K1 Life Archive** — a private container a living person curates: memories, writing, images, voice/recordings, personal values, life-events, messages, and the record of their **selected methods + Companion history**. Everything is user-added, user-editable, user-deletable.
- **K2 Designated Legacy Access** — a *governed record model* describing how a person could designate recipients, an administrator, approved materials, permissions, activation conditions, revocation, duration, deletion, disputes, and audit. Designed and specified only; **no real post-death access is activated in production** (`LEGAL_BLOCKED`).
- **K3 Source-grounded Memory Q&A** — a contract + permission + **source-citation** model for answering questions *only* from archived materials the owner permitted, every answer citing its archive sources. Any runnable form is a **PRIVATE local development harness** only.
- **K4 Legacy Companion** — **architecture only.** No public, user-facing surface. Hard behavioural prohibitions (below) are load-bearing; synthetic deceased voice/video is **not authorized**.

WS-K sits downstream of WS-D (understanding), WS-E (consent), WS-F (history) and reuses their real contracts; it never invents a parallel data model. The archive is the person's, never the platform's verdict — it does not collapse a life into one score, label, or persona (`NO_UNIVERSAL_SCORE`; no 31 Personas, no Persona rooms, no fixed taxonomy).

---

## 2. Maturity

Per-scope maturity (each capability carries exactly one **primary** maturity; the blocking gate is recorded separately, following the Program Architecture §3 convention `ARCHITECTURE_CPV1 + LEGAL_BLOCKED`):

| Sub-scope | Primary maturity | Blocking gate | What is real today |
|---|---|---|---|
| K1 Life Archive (curation container) | `ARCHITECTURE_CPV1` | `FOUNDER_GATED` for any public surface | Design spec only; reuses real `consent.ts` / `history.ts` / `understanding.ts` contracts as substrate. No public archive UI; preview gated by `cpv1_archive_legacy_preview` (`flags.ts`). |
| K2 Designated Legacy Access (governed records) | `LEGAL_BLOCKED` | legal / jurisdiction / privacy review | Record *model* designed; **no activation of real post-death access**, no execution of any recipient grant. |
| K3 Source-grounded Memory Q&A | `ARCHITECTURE_CPV1` | `LEGAL_BLOCKED` beyond a private local harness | Contract + citation model designed; any harness runs **local/dev only**, never public, never over another person's data. |
| K4 Legacy Companion | `ARCHITECTURE_CPV1` | `LEGAL_BLOCKED` | Architecture + prohibition set only. No surface, no voice/video synthesis, no deployment. |

Explicitly **not** claimed: no production persistence/migration/secrets, no real payment, no public Digital Legacy activation, no fabricated archive content or example deceased persons, nothing "live" or "implemented" that is not. Test fixtures (if any) are synthetic and never presented as a real person's archive.

---

## 3. Data / contract model (references real `lib/cpv1`)

### 3.1 K1 — Life Archive item (WS-K design contract; references real field types)

The archive is a set of owner-controlled items. The proposed `ArchiveItem` shape is **design-only** (not yet implemented code) and deliberately built from the same primitives as WS-D/E/F so the archive inherits their guarantees:

```
ArchiveItem = {              // WS-K ARCHITECTURE_CPV1 — proposed, not implemented
  id: string
  kind: "memory" | "writing" | "image" | "recording" | "value"
       | "life_event" | "message" | "method_selection" | "companion_history"
  contentRef: string         // safe ref into a consent-scoped store; raw media never inlined
  observationRefs: string[]  // links to WS-D Observation ids (source-labelled)
  historyRefs: string[]      // links to WS-F HistoryEvent ids (append-only)
  consent: MethodConsent     // lib/cpv1/consent.ts — per-item retention + downstream flags
  privacy: PrivacyScope      // lib/cpv1/understanding.ts — device_local by default
  ownerControlled: true      // every item is the owner's to edit/hide/forget/delete/export
  createdAt: string
}
```

Design rules bound to the real contracts:

- **Raw media stays in consent-scoped stores.** Images/recordings/messages are referenced by `contentRef`, never inlined into history or observation records (mirrors WS-F: `objectRef`/`safeDetail` only). Birth data and raw answers remain in WS-E stores and are **not** promoted into the archive unless the owner explicitly adds them.
- **Selected-method + Companion history** are read from real records: `MethodRegistryEntry` / `MethodActivationState` (`methods.ts`) for which methods the person chose, and `HistoryEvent`s of type `companion_interaction` / `method_completed` / `result_created` (`history.ts`) for the Companion + method record. WS-K adds no new event types.
- **Every archive item is an owner-controlled object** carrying a `MethodConsent`; `canPersist(c)` decides whether it survives beyond session, and `PrivacyScope` (default `device_local`) decides any downstream eligibility via `canUseDownstream`.

### 3.2 K2 — Designated Legacy Access (governed record model, LEGAL_BLOCKED)

A design-level record describing a *would-be* legacy arrangement. **No field in this model executes; nothing here grants real access.** It is specified so the governance is honest, not so it runs:

```
LegacyGrant = {                     // WS-K design record — LEGAL_BLOCKED, never activated
  administrator: PartyRef           // a designated human administrator
  recipients: PartyRef[]            // named recipients
  approvedMaterials: ArchiveItem["id"][]  // ONLY items the owner explicitly approved
  permissions: ("view" | "memory_qa")[]   // scope per recipient; never edit/act
  activationConditions: string      // described only; NOT auto-evaluated in this program
  revocation: "owner_any_time"      // revocable by the living owner at will
  duration: string | null           // bounded lifetime if set
  deletionPolicy: string            // how materials are erased
  disputeProcess: string            // human, out-of-band; not automated
  auditLog: HistoryEvent[]          // append-only (history.ts); every touch recorded
}
```

- **Activation is out of scope.** No `activationConditions` are evaluated, no post-death trigger exists, no recipient is ever granted access inside this program. The presence of the model is governance, not capability.
- **Approved-materials allowlist only.** A recipient can ever see only `approvedMaterials` the owner individually approved — never the whole archive, never anything the owner did not name.
- **Audit is append-only** (`appendEvent`, `history.ts`): every access/change/dispute is recorded and never rewritten.

### 3.3 K3 — Source-grounded Memory Q&A (contract + citation model)

A designed contract for answering questions **only** from permitted archived materials, with mandatory source citation. Any implementation is a **private local development harness** gated by `isDevPreviewContext()` (`flags.ts`) — never a public surface, never run over a real deceased person's data:

```
MemoryAnswer = {                    // WS-K design contract — private dev harness only
  question: string
  answer: string                    // grounded strictly in cited sources
  citations: ArchiveItem["id"][]    // ≥1 required; an uncited answer is invalid
  sourceClass: "ai_synthesis"       // ALWAYS ai_synthesis (understanding.ts)
  confidence: "grounded" | "insufficient_sources"
}
```

- **No answer without a citation.** If no permitted source supports the question, the harness returns `insufficient_sources` and refuses to answer — it never fabricates.
- **AI is a labelled source, never fact.** Every answer is `sourceClass: "ai_synthesis"` (`isAiSynthesis` true) and rendered as YORISOUのまとめ（推測）, never as the person's own words or verified truth.
- **Permission-scoped retrieval.** Only items where `canUseDownstream(o, "report")`-equivalent permission holds and the owner marked the item shareable-to-recipient are retrievable; nothing else enters the context.

### 3.4 K4 — Legacy Companion (architecture only)

A distinct, **more-restricted** architecture than the WS-G Living Companion (itself `ARCHITECTURE_CPV1`). It has **no surface** in this program. Its contract is a set of hard behavioural invariants (§4), not a runtime.

---

## 4. Governance & prohibitions

- **No public Digital Legacy activation.** K2 post-death access is `LEGAL_BLOCKED`; no recipient grant, activation-condition evaluation, or post-death trigger runs in production or Preview.
- **The Legacy Companion (K4) MUST NEVER:** claim or imply the deceased is alive or present; invent memories, facts, or statements the person never made; form new real-world intentions or plans on the person's behalf; exercise financial, legal, inheritance, medical, contractual, or family authority; or autonomously contact people who are unaware of it. Any of these is a contract violation, not a tuning issue.
- **Synthetic deceased voice/video is NOT authorized.** No voice cloning, no face/video synthesis, no "speaking as" the deceased. K4 may only surface the person's *own* archived materials with clear attribution.
- **Grounded-only, cited-only (K3).** Memory Q&A answers strictly from cited archive sources; no answer without a citation; `insufficient_sources` on gaps. No fabrication, no diagnosis, no advice presented as the deceased's wishes.
- **No fabricated archive content.** No seeded memories, fake recipients, invented life-events, or example deceased persons presented as real. Synthetic fixtures live only in tests and are never shown as a real archive.
- **No universal score / no persona.** The archive presents a plurality of source-labelled views over a life; it never collapses to one label, rank, or fixed identity. No 31 Personas, no Persona rooms, no fixed taxonomy.
- **One-directional privacy boundary.** Archive/Legacy materials are on the WS-J share denylist: they can **never** be serialized into a public-safe share card or any public surface.
- **Preview / local only.** No production deploy, migration, secrets, or real payment. New WS-K surfaces render only behind `cpv1_archive_legacy_preview` (`flags.ts`), off by default, LOCAL/Preview only.
- **Rights gate still applies.** Any archived method result references a registered `MethodRegistryEntry`; methods that are not publicly activatable (`gated`) carry no public route into or out of the archive.

---

## 5. Privacy / consent touchpoints

- **Every archive item is owner-controlled and carries the full data-rights set.** Per `ALL_USER_DATA_RIGHTS` (`consent.ts`), the living owner may **confirm, correct, reject, hide, forget, delete, export, revoke_downstream** on any item at any time. `delete`/`forget` are honored end-to-end, including removal from any pending `LegacyGrant.approvedMaterials`.
- **Default retention is private and minimal.** `PrivacyScope` defaults to `device_local`; `MethodConsent.retention` defaults to `session_only` for sensitive/birth-data families (`consent.ts`) — archive persistence requires an explicit `saveAcknowledged` (`canPersist`).
- **Legacy designation is a separate, stricter opt-in.** Creating or amending a `LegacyGrant`, and adding any item to `approvedMaterials`, is per-item and never implied by saving to the archive. Revocation is available to the living owner at any time and is itself recorded as an append-only audit event.
- **Downstream use never implied.** Adding to the archive does not authorize Companion, recommendation, community, or Memory-Q&A use; each follows the item's `PrivacyScope` / `permittedDownstream` via `canUseDownstream`. Community use of archive material is prohibited.
- **Memory Q&A retrieves only permitted, cited sources.** The K3 harness never reads items outside the owner-granted scope, and every answer is attributable to specific `ArchiveItem` ids.
- **Export is honest and complete.** A person can export their own archive — items, source-labelled observations, and the append-only history/audit — as a user-held copy.

---

## 6. Acceptance criteria

1. **No production Legacy activation.** No code path in this program grants post-death access, evaluates `activationConditions`, or contacts a recipient; a test asserts K2 activation is unreachable outside a `LEGAL_BLOCKED` stub.
2. **Owner control is total (K1).** confirm / correct / reject / hide / forget / delete / export / revoke_downstream all operate on every `ArchiveItem`; `delete` removes an item from any `LegacyGrant.approvedMaterials`.
3. **Approved-materials allowlist only (K2).** A recipient model can reference only owner-approved item ids; a test proves no path exposes the whole archive or unapproved items.
4. **Cited-only Q&A (K3).** The harness returns `insufficient_sources` when no permitted source supports the question and never emits an uncited `answer`; every answer is `sourceClass: "ai_synthesis"`.
5. **Private harness only (K3).** Any Memory-Q&A runtime is gated by `isDevPreviewContext()`; it is off in production and never runs over a real deceased person's data.
6. **Legacy Companion prohibitions hold (K4).** Contract-level assertions prove K4 cannot claim the deceased is alive, invent content, form intentions, exercise financial/legal/medical/family authority, autonomously contact anyone, or synthesize voice/video.
7. **No universal score / no persona.** No WS-K surface emits a single collapsed score, rank, or fixed-identity label (`NO_UNIVERSAL_SCORE` upheld).
8. **Share denylist respected.** No archive/Legacy material can be serialized into a WS-J public-safe share card or any public surface (boundary test).
9. **Raw media isolation.** Images/recordings/messages/birth data live in consent-scoped stores referenced by `contentRef`; no raw sensitive content is inlined into history or observation records.
10. **Truthful maturity.** WS-K is presented as `ARCHITECTURE_CPV1` (K2/K4 `LEGAL_BLOCKED`); no "live", "implemented public archive", or "digital resurrection" claim is made.

---

## 7. Open blockers

- **`LEGAL_BLOCKED` — post-death access (K2).** Real Designated Legacy Access requires legal, jurisdictional, privacy, and security review (consent authority after death, jurisdiction-specific inheritance/data law, recipient identity verification, dispute adjudication). None is cleared in this program; no activation occurs.
- **`LEGAL_BLOCKED` / gated — Memory Q&A beyond harness (K3).** Any non-private, user-facing Memory Q&A requires separate legal / privacy / security / jurisdiction approval before it may leave the local dev harness.
- **`ARCHITECTURE_CPV1` — Legacy Companion (K4).** No surface, voice/video synthesis, or deployment is in scope; the sub-scope remains design + prohibition set only until (and unless) a future governed program clears it.
- **`FOUNDER_GATED` — public Life Archive UI (K1).** Any public archive surface requires an explicit Founder activation after design, build, and privacy review; until then it stays behind `cpv1_archive_legacy_preview`.
- **`PERSIST` (Preview-gated).** Durable, RLS-protected, deletion-aware archive storage exists only against local Supabase / Preview; production persistence is out of scope (Program Architecture §5).
- **`ERASURE-SEMANTICS` coupling (WS-F).** Reconciling owner `forget`/`delete` with the append-only audit log (tombstone vs. hard erase) inherits the WS-F data-rights decision and must be settled before any persistence is activated.
- **Not-publicly-activatable (`gated`) methods.** Archived references to external unbuilt methods carry no public route into or out of the archive until they are built (implementation + original content + privacy + tests) AND rights-cleared AND Founder-activated.

---

*This is a governed design specification, not product code. It references real contracts in `lib/cpv1/` and must not be read as a claim that any Life Archive, Legacy access, Memory Q&A, or Legacy Companion surface is live or activated.*
