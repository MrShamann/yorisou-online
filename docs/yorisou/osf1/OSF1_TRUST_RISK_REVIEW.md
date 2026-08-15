# OSF-1 — Trust-Risk Review and Non-Blocking Risk Register

**Package:** OSF-1 YORISOU OS Foundation v0.7.0 Phase 1 Life OS Foundation MVP · **PR:** [#132](https://github.com/MrShamann/yorisou-online/pull/132) @ `9705179` · **Status:** `OPEN_UNMERGED`. No migration applied in any environment.

> Every item below is **non-blocking for merge** and was found by the pre-merge governance audit or
> the hardening pass. None is a data-loss, authorization or privacy defect in the merged diff; the
> two that were (a crash regression in `/api/experiences?mode=discover`, and a PATCH that nulled
> unmentioned fields) were fixed and are not listed here. This document exists so that "known and
> accepted" is written down rather than remembered.

Severity scale: **low / medium / high** — the impact if the risk is realised, not the likelihood.

---

## 1. Risk table

| # | Risk | Severity | Present state | Mitigation / decision | Stop condition |
|---|---|---|---|---|---|
| 1 | **`yorisou_identity_provisioning_sagas` is in no erasure path.** It carries `account_id` and is named in neither POR-1's `v_plan` nor any erasure stage this repository defines. A deleted account may leave provisioning-saga rows behind. | Medium | **Pre-existing** (POR-1 `202608010103`), untouched by OSF-1. Previously invisible to tooling: the erasure-coverage guard's `OWNER_COLUMNS` omitted `account_id`. | `account_id` and `user_id` added to `OWNER_COLUMNS`, so the guard now sees the table and forces a decision. Recorded as an explicit `UNRESOLVED` exemption in `lib/server/__tests__/osf1ErasureCoverage.test.ts` rather than silently omitted. Content is transient identity-provisioning state, not user-authored content. | A saga row is found to contain user-authored content, an email, or a LINE subject id → treat as a POR-1 privacy defect and open an incident. |
| 2 | **Memory list is capped at 50 with no pagination.** `listMemories(owner, 50)` is the only read path; `/life/memories` renders what it returns. A person with more than 50 confirmed memories cannot see or delete the older ones through any surface. | Medium | Introduced by OSF-1. Unreachable today (zero rows in every environment). | Deliberately not fixed in a documentation-only pass. The 51st memory requires ~51 separate confirmations, so the cap is not reachable by accident. Deletion remains possible via `POST /api/life-os {action:"delete_memory", id}` for any id the owner knows. Account erasure removes **all** rows regardless of the cap — `yorisou_explicit_memories` is in `v_plan`, proven by executed erasure in CI. | Any account reaches 45 confirmed memories → pagination becomes required before further exposure. Also blocking for any public activation of `/life/memories`. |
| 3 | **A non-UUID row id returns HTTP 500.** `/api/life-os` validates client-supplied ids with `typeof === "string"` only; the RPC parameters are `uuid`, so a malformed id produces a Postgres `22P02` cast error that carries no `osf1_` token and falls through to 500 instead of 404/422. | Low | Introduced by OSF-1. | Not reachable from any product path: every id originates server-side (create responses, list views) and is passed through `encodeURIComponent`. Reaching it requires a hand-edited URL or a hostile client. No information is disclosed — the response body is `life_os_persistence_failed:<status>` with no content echo (verified: `rpc()` discards the PostgREST body and extracts at most an `osf1_[a-z_]+` token). | A 500 rate above baseline on `/api/life-os`, or any report of a user hitting it → add UUID-shape validation before the store call. |
| 4 | **No accessibility audit on `/life/*`.** Five new surfaces (`/life`, `/life/reflect`, `/life/goals`, `/life/experience`, `/life/memories`) have no axe run. `tests/smoke/pxr1-a11y.spec.ts` enumerates its surfaces explicitly and does not crawl, so they are simply absent from it. | Medium | Introduced by OSF-1. | The surfaces reuse the PXR-1 token set and component patterns that passed 14/14 axe checks at 390/1440 after the `--pxr-text-muted` contrast correction, so the most likely class of failure (contrast) is already addressed at the token level. All interactive controls use `min-h-[var(--pxr-touch-target)]` (48px) and every input carries a label. This is unverified, not unconsidered. | **Blocking for any exposure beyond the Founder.** Adding the five routes to the axe spec requires a running server and is the first task of the activation package. |

---

## 2. Risks explicitly accepted, with the reason

### 2.1 Operator visibility of flagged private cards

See `OSF1_FOUNDER_DECISIONS.md` §1. The clinical-flag promotion of a PRIVATE card to
`moderation_status='limited'` — which puts it in the Founder moderation queue at full content — is
**disclosed rather than narrowed**. Severity would be **high** if undisclosed; the UI now names the
trigger before the person types, which is what moves it to accepted.

**The stronger fix remains open:** skip the promotion when `visibility === 'PRIVATE'`, so a private
note never reaches a human. That is a change to Experience behaviour and belongs to its own package.

### 2.2 Two current-state stores coexist

The device-local PXR-1 record and `yorisou_current_state_records` both exist. The device record is
still the only one an anonymous visitor gets, and existing device records are **not** uploaded when
someone signs in — backfilling them would be converting existing user data, which
`Yorisou_Consent_Based_Personal_Context_Governance_v1.0.md` §3.4 prohibits without explicit user
action. Unifying them is a product decision, not a defect.

### 2.3 No `use_permission` / `provenance` / `deletion_receipt`

`annex/PRODUCTION_DATA_MODEL_AUTHORITY.md` specifies a seven-entity memory subsystem for Core System
3 (Package B, the strictest gate). OSF-1 is an explicit-memory MVP: rows are `owner_only`, no
inference path reads them, and deletion is a hard delete. Building half of Package B under a Phase 1
authorization would have been a scope change.

### 2.4 `/life/*` has no feature flag

`robots: { index: false }` only. Any signed-in person reaching the URL can use the surfaces. A staged
rollout is a Gate 5 decision (`annex/RELEASE_GATE_DEFINITIONS.md`).

---

## 3. What was verified rather than assumed

Recorded so a future reader does not re-litigate the settled parts.

| Property | Evidence |
|---|---|
| RLS enabled on all five Life OS tables; `anon`/`authenticated` hold nothing; `service_role` SELECT only | executed in CI, `OSF-1 Life OS PostgreSQL Acceptance` |
| Every mutation goes through a `SECURITY DEFINER` RPC; all eight signature strings match their functions exactly | audit focus area 3 + the privilege assertions in the harness |
| No client `user_id` trust anywhere on `/api/life-os`; owner scope in the database `WHERE` clause on every id-taking operation; no existence oracle | audit focus area 6 |
| An unconfirmed memory row cannot exist, including by direct INSERT | executed in CI |
| A deleted account loses every Life OS row; another account's rows are untouched | executed in CI (owner A 6 rows → 0, owner B 5 → 5) |
| Migration `202608140002` is byte-identical to the erasure body it replaces apart from five `v_plan` entries | mechanical line-by-line diff, audit focus area 4 |
| Every owner-linked table in `supabase/migrations` (42) is registered for erasure or carries a written exemption | `test:osf1-erasure-coverage`, including a formatting-shape meta-test |
| CurrentStateRecord and Imairo Result share no import in either direction; the current-state table declares no methodology identity | `test:osf1-boundaries` |
| No surface claims absolute user-only visibility | `test:osf1-boundaries` |

---

## Version history

- **v1.0 (2026-08-14)** — initial register, written at Founder request during PR #132 final closeout.

---

## Risks added or reclassified by the Internal Beta Readiness package (2026-08-15)

**RESOLVED — the reflection flow disclosed after the fact.** The privacy sentence appeared only on the
finished screen, telling people where their words had gone after they had written them. Now on the
first question, before any input. Pinned by `osf1PrivacyCopy.test.ts`.

**RESOLVED — `/experiences` disclosed nothing.** The older hub wrote to the same table through the same
`trustFlags` path with no disclosure at all. It now carries the same promise, above the input fields.

**RESOLVED — memories past the fiftieth were unreachable.** A fixed cap with no cursor meant the
product had quietly stopped showing people their own records. Keyset pagination, verified against a
real PostgREST by walking every page of a 30-row set with deliberate timestamp ties.

**RESOLVED — a caller typo returned 500.** No id was validated; a non-UUID reached PostgREST and came
back as an unclassifiable error. Validated at the edge, 422.

**NEW, ACCEPTED — a person can lose a reflection if the audit table is unavailable.** This is the
direct consequence of the transactional audit the package required, and it is the reversal that
`OSF1_AUDIT_DELIVERY_CLASSES.md` flagged as needing a Founder decision. The decision was made; the
consequence is now live and is stated here so it is not rediscovered during an incident.

**NEW, OPEN — `yorisou_identity_provisioning_sagas` survives account deletion with `account_id`
readable.** Proven against a disposable cluster. Personal data outliving erasure is a real privacy
defect. POR-1 owns the table, so the fix needs POR-1's own gate. Evidence and options in
`OSF1_FOUNDER_DECISIONS.md` §3.

**NEW, OPEN — Memory governance §3.2 is not fully met.** Users can view, correct and delete. They
cannot *suppress* or *revoke*, and deletion produces no *receipt*, all three of which the governance
requires. Pre-existing and larger than this package's brief.

**CARRIED — the Life OS has never run against hosted Supabase.** Every rehearsal is a disposable
cluster. Role sets and extension schemas differ; that is why the audit RPC uses built-in `sha256`
rather than pgcrypto's `digest`. The first hosted apply remains a first.

**CARRIED — `GET /api/life/assistant` returns 405 where every sibling returns 404**, disclosing that
the path exists. No data or capability is exposed. Not fixed here: it predates this package and was
outside its brief.
