# WS-E — Method-level Consent & Sensitive Inputs

**Program:** YORISOU Complete Platform V1 (CPV1)
**Branch:** `feat/cpv1-integrated-platform` (Preview/local only — NOT `main`)
**Workstream:** E — Method-level consent + sensitive-input handling
**Maturity:** `CONTRACT_CPV1` — real typed contract + model + tests in `lib/cpv1/consent.ts`; not yet a full public surface.
**Canonical code:** `lib/cpv1/consent.ts`. Cross-references: `lib/cpv1/flags.ts`, `lib/cpv1/history.ts`, `lib/cpv1/rights.ts`.

Brand vision: **人を、ひとつの答えに閉じ込めない。**  Brand line: **ひとつの見方で、あなたを決めない。**

---

## 1. Purpose

Consent in YORISOU is **per method, not global**. A person may run one
understanding method (e.g. a YORISOU-original reflective method) with one
retention posture and never grant another method (e.g. a birth-data method)
anything beyond a single in-session calculation. There is no single "I agree"
switch that unlocks every method, every downstream use, and every surface.

WS-E exists to make three things true and enforceable at the contract layer:

1. **Sensitive/birth-data inputs default to session-only calculation.** Nothing
   about a birth date, birth time, or place of birth is persisted unless the
   person takes an explicit, separate save action.
2. **Raw location is minimized.** When a person does save, YORISOU keeps only
   derived provenance (timezone + rounded coordinates), never the raw address /
   precise place they typed.
3. **The person keeps every right over their own data, always** — confirm,
   correct, reject, hide, forget, delete, export, revoke downstream — regardless
   of which method produced the data or how old it is.

WS-E is a governance spine: any workstream that reads or reuses method output
(WS-D understanding, WS-F history, WS-G Companion, WS-H community, WS-I
recommendations) must first pass the consent contract defined here.

---

## 2. Data / contract model (real code in `lib/cpv1/consent.ts`)

### 2.1 `RetentionMode`

```
type RetentionMode = "session_only" | "device_local" | "account_saved";
```

- `session_only` — computed for this session; never written to device or account.
  **Default for sensitive/birth-data method families.**
- `device_local` — retained on the person's device only (default for
  non-sensitive families).
- `account_saved` — retained to the account; requires an explicit save action.

### 2.2 `MethodConsent`

The per-method consent record (fields verbatim from `consent.ts`):

| Field | Meaning / default |
|---|---|
| `methodId` | The specific method this consent governs. |
| `retention` | `session_only` for sensitive families, else `device_local`. |
| `saveAcknowledged` | `false` until the person explicitly acts to save. |
| `rawLocationMinimized` | `true` — only derived tz/coords are ever kept. |
| `derivedProvenance` | `null` until saved; e.g. `"tz=Asia/Tokyo (derived); coords rounded"`. |
| `companionUse` | `false` — opt-in; Companion may not read the result otherwise. |
| `recommendationUse` | `false` — opt-in; recommendations may not use the result otherwise. |
| `communityUse` | `false` — community is **prohibited by default**. |
| `updatedAt` | ISO timestamp of the last consent change. |

### 2.3 Sensitive-family gate

```
SENSITIVE_METHOD_FAMILIES = { "chinese_traditional", "western_symbolic" }
```

`defaultConsent(methodId, family)` returns `retention: "session_only"` for these
families and `"device_local"` otherwise. All downstream-use flags start `false`
and `rawLocationMinimized` starts `true` for every method regardless of family.

> Note: most method families in the sensitive set are **`RIGHTS_BLOCKED`** at the
> method layer (see `lib/cpv1/rights.ts`, WS-B) and therefore never reach a public
> route in CPV1. WS-E's sensitive-input handling is nonetheless authored and
> contract-tested now so that consent is correct *before* any such method could be
> rights-cleared and activated by a Founder.

### 2.4 Persistence gate — `canPersist(consent)`

```
if (retention === "session_only") return false;   // sensitive default: never persisted
return saveAcknowledged;                            // otherwise requires explicit save
```

A sensitive method's result cannot be written anywhere until the person both
changes retention away from `session_only` **and** sets `saveAcknowledged`. Two
distinct, intentional acts.

### 2.5 Community gate — `canShareToCommunity(consent)`

```
return communityUse === true && saveAcknowledged === true;
```

Community use requires an explicit `communityUse` opt-in **and** a prior explicit
save. Default `false` means silence is never consent. (WS-H community itself is
`ARCHITECTURE_CPV1` and lives only behind the `cpv1_community_preview` dev flag —
there is no public community surface in CPV1.)

### 2.6 User rights — `ALL_USER_DATA_RIGHTS`

```
type UserDataRight =
  "confirm" | "correct" | "reject" | "hide" | "forget" | "delete" | "export" | "revoke_downstream";
```

`ALL_USER_DATA_RIGHTS` is the readonly, always-available set. Every right applies
to every method's data at every retention mode. Rights are never gated behind a
subscription, an account tier, or the method's rights posture.

### 2.7 Rights → history mapping (WS-F)

Exercising a right must append an immutable event to the WS-F log
(`lib/cpv1/history.ts`, append-only). Direct mappings exist today:

| Right | `HistoryEventType` |
|---|---|
| `confirm` | `user_confirmed` |
| `correct` | `user_corrected` |
| `reject` | `user_rejected` |
| `hide` | `hidden` |

`forget`, `delete`, `export`, and `revoke_downstream` are **operations on stored
data** (erasure / portability / downstream revocation) rather than result-state
transitions. Their exact append-only event vocabulary is not yet in
`history.ts` — see Open Blockers §7. Until then they are performed but their audit
event type is a contract gap, not a silent no-op.

---

## 3. Governance & prohibitions

- **No global consent.** No surface may present one toggle that grants multiple
  methods or multiple downstream uses at once. Consent is minted per `methodId`.
- **Session-only default must not be pre-escalated.** UI must not preselect
  `device_local`/`account_saved`, pre-check `saveAcknowledged`, or bundle "save"
  into the "run" action for sensitive families.
- **Raw location is never stored.** Inputs are reduced to derived tz + rounded
  coords at capture; `rawLocationMinimized` stays `true` (no code path sets it
  `false`). Raw address / precise place strings are discarded after derivation and
  never logged, never in `objectRef`/`safeDetail`, never in a URL.
- **Community prohibited by default.** `communityUse` may only become `true`
  through an explicit person-initiated action on their own data.
- **Downstream use is opt-in, per channel.** `companionUse` and `recommendationUse`
  are independent; enabling one never implies the other or `communityUse`.
- **No fabricated content or data.** WS-E ships governance and typed contracts
  only — no synthetic birth data, fake saved results, or example community
  activity. Test fixtures are synthetic and labelled as such.
- **No production writes.** Preview/local only: local Supabase (Colima), RLS,
  reversible schema. No production migration, secrets, or real user data.
- **Dev-flag containment.** Preview surfaces rendering consent for
  rights-blocked/architecture methods are gated by `lib/cpv1/flags.ts`
  (`isDevFlagOn` / `isDevPreviewContext`) — off in production, no public "coming
  soon" exposure.

---

## 4. Privacy / consent touchpoints

1. **Method entry (sensitive family).** Before any input, the person sees that the
   method runs session-only by default and that saving is a separate choice.
   `defaultConsent` is minted; nothing is written.
2. **Input capture.** Location is derived to tz + rounded coords at capture;
   `derivedProvenance` is prepared for display; raw strings are discarded.
3. **Result display → explicit save.** Result is shown from the session-only
   computation (`canPersist` is `false`). A distinct save action then sets
   `retention` and `saveAcknowledged`; only then does `canPersist` return `true`,
   and the person is shown exactly what is retained (derived provenance, not raw
   input).
4. **Downstream opt-in.** Separate, per-channel toggles for `companionUse` /
   `recommendationUse`; each writes an `updatedAt` change. Community opt-in is
   distinct again; `canShareToCommunity` stays `false` unless both `communityUse`
   and `saveAcknowledged` are true.
5. **Rights exercise & revocation.** All eight rights are available on every saved
   item; each appends a WS-F event (per §2.7), and `delete`/`forget` tombstone the
   record. `revoke_downstream` immediately makes `companionUse` /
   `recommendationUse` / `communityUse` read as `false` for future reads; WS-G and
   WS-I must re-check consent on every read and never cache a stale grant.

---

## 5. Acceptance criteria

- [ ] `defaultConsent(id, "chinese_traditional")` and `defaultConsent(id, "western_symbolic")`
      return `retention === "session_only"`; a non-sensitive family returns `"device_local"`.
- [ ] For every family, `defaultConsent` returns `saveAcknowledged === false`,
      `rawLocationMinimized === true`, `companionUse/recommendationUse/communityUse === false`,
      and `derivedProvenance === null`.
- [ ] `canPersist` returns `false` for any `session_only` record even when
      `saveAcknowledged === true`.
- [ ] `canPersist` returns `false` for `device_local`/`account_saved` when
      `saveAcknowledged === false`, and `true` only when acknowledged.
- [ ] `canShareToCommunity` returns `false` unless `communityUse && saveAcknowledged`.
- [ ] `ALL_USER_DATA_RIGHTS` contains exactly the eight rights and is treated as
      readonly (no code path removes a right for any method or user).
- [ ] No code path sets `rawLocationMinimized = false` or writes a raw location /
      precise place string to storage, logs, `objectRef`, `safeDetail`, or a URL.
- [ ] Exercising confirm/correct/reject/hide appends the mapped WS-F event; the
      log remains append-only (no in-place mutation).
- [ ] Consent-preview surfaces for rights-blocked/architecture methods are
      unreachable unless the matching dev flag is on and the deployment context is
      non-production. Per R1 §10 the deny signal is `VERCEL_ENV === "production"`
      (`isTrueProduction()` / `deploymentContext()`), **not** `NODE_ENV` — a Vercel
      Preview runs a production-mode build but is not true production. Sensitive
      surfaces are additionally gated by `cpv1PreviewAccess` (server-side auth +
      Founder/Admin + route authorization).
- [ ] Contract suite `lib/yorisou-tests/__tests__/cpv1Completion.test.ts` covers the
      above and passes locally.

---

## 6. Cross-workstream contracts

- **WS-B (rights, `rights.ts`):** consent governs *how* data is retained/used;
  rights govern *whether* a method may run publicly at all. Both gates must pass;
  neither substitutes for the other.
- **WS-D (understanding):** source-separated results carry their `MethodConsent`;
  no universal score is derived across methods without each method's consent.
- **WS-F (history, `history.ts`):** append-only audit for every consent change and
  rights exercise; version-preserving, never rewritten.
- **WS-G/WS-H/WS-I:** must call `canShareToCommunity` / check `companionUse` /
  `recommendationUse` on every read; revocation is immediate.

---

## 7. Open blockers

- **B-E1 (contract gap) — RESOLVED in R1 §8.** `history.ts` now defines explicit
  event types `user_forgot`, `user_deleted`, `user_exported`, `downstream_revoked`
  plus the five permission-change events, appended via `recordDataRightsEvent(...)`
  and enforced by the DB check constraint `yorisou_cpv1_hist_event_type_r1`. Every
  right now leaves a truthful append-only trace. See WS-F §8.
- **B-E2 (deletion semantics) — audit form RESOLVED in R1 §8; cascade still open.**
  The tombstone contract is defined and tested (`makeTombstone` /
  `tombstoneCarriesNoPersonalContent`, `user_deleted` with a content-free
  `safeDetail`). The cross-surface cascade (WS-D results, WS-F objectRefs, WS-G
  Companion memory, WS-I recommendation state) remains a wiring item to be
  RLS-enforced in local Supabase before any persistence is activated.
- **B-E3 (`RIGHTS_BLOCKED` upstream):** sensitive families are rights-gated at
  WS-B; WS-E consent for them cannot be exercised on a public route until a Founder
  clears rights AND activates. WS-E stays contract-only for those methods.
- **B-E4 (location derivation):** the tz/coord-rounding utility that guarantees raw
  location never reaches storage is a separate implementation item; until it lands,
  sensitive birth-place capture stays behind dev flags only.
- **B-E5 (persistence surface):** `account_saved` retention implies a saved-data
  store — Preview/local only, never pointed at production.

---

## 8. CPV1-R1 §9 corrections (independent permissions, not ordered levels)

The R1 pass rebuilt consent in `lib/cpv1/consent.ts` (migration `202607190003`) so
permissions are **independent booleans**, never an ordered privacy ladder where a
higher level implies the lower ones:

- **Independent purposes.** `MethodConsent.purposes` is a
  `Record<DownstreamPurpose, boolean>` over `report | companion | recommendation |
  community | public | archive | legacy`, all **false by default**. Granting one
  never implies another (`grantPurpose` / `revokePurpose` toggle exactly one).
- **Separate visibility axis.** `visibility` (`private | shared | public_safe`) is
  orthogonal to purpose grants — a `public_safe` visibility does not by itself grant
  any downstream use, and no purpose grant raises visibility.
- **Compound guards in `consentAllows(c, purpose)`.** community/public additionally
  require `visibility === "public_safe"`; community additionally requires
  `saveAcknowledged`; legacy additionally requires at least one `legacyRecipients`
  entry. `canShareToCommunity(c) === consentAllows(c, "community")`.
- **Restrictive defaults.** `defaultConsent()` yields `session_only` retention for
  sensitive input, `private` visibility, and no purposes — the safe floor.

Covered by `lib/yorisou-tests/__tests__/cpv1Completion.test.ts` (§9). WS-E remains
`CONTRACT_CPV1`; no sensitive method is activated on a public route by this program.
