# Yorisou — Admin Storage, Retention, and Delivery Boundary v0.1

**Status:** Specification only. Not implementation approval.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document is a boundary specification. It does not implement storage, retention, delivery, deletion, or any user-facing surface. It does not approve a volunteer pilot or any user delivery.**

---

## 1. Storage / Retention Handling

The admin tool, when implemented under separate authorization, must honor the storage option each user selected at consent time. The three options correspond to `docs/detailed-report-storage-and-non-use-policy-v0.1.md`.

| Option | Status at first volunteer pilot |
|---|---|
| **Option A** — generate/review report without ongoing full-text persistence after review | Default. Only option offered to users in the first volunteer pilot. |
| **Option B** — limited internal review retention | Allowed only after Edward approves an explicit retention period and access policy. |
| **Option C** — save for user revisit later | Not recommended until revisit/save architecture exists. |

---

## 2. Option A — Default

### What the admin can view

The admin (Edward / reviewer in their assigned scope) can view, while a report is active in the workflow:

- Request status (state)
- Consent version recorded for the request
- Storage option selected by the user
- Input packet (operational fields per `docs/admin-input-packet-builder-spec-v0.1.md`)
- Draft text during the review window
- Review score and categorical findings
- Delivery status (under separately authorized pilot only)
- Deletion/non-use request marker

### What the admin should not retain

Under Option A:

- Admin **must not retain** the full report text in any persistent admin store after the review/delivery cycle closes, unless separately approved (which would constitute Option B)
- The review window is bounded by the workflow lifecycle. Once the report reaches a terminal state (`delivered` under authorized pilot, `rejected`, `held` cleared without proceeding, or `approved_internal` archived), the full text is not retained in the admin tool's persistent store
- Operational metadata (report_id, state log, category scores, structured findings, consent version, storage option, timestamps) is retained under safe-logging rules

### What must never be in the admin store under Option A

- Raw private text (raw answer payload, free-text user disclosures)
- LINE history (raw or summarized)
- Account identity (email, LINE UID, name) used for interpretation
- Partner identifying information
- Free-text reviewer disclosures
- Payment information (none exists; never appropriate)

---

## 3. Option B — Conditional

### Activation requirements

Option B may only be activated when **all** of the following are met:

- [ ] Edward / controller has approved an explicit retention period (proposed 30 days; not yet decided)
- [ ] Retention duration is documented in writing
- [ ] Who can view the full report during retention is documented (Edward and named reviewers only)
- [ ] Deletion / non-use marking process is defined for retained reports
- [ ] Public sample reuse remains prohibited
- [ ] Model training use remains prohibited

### What Option B allows when activated

- The full report text is retained in an internal-only store for the approved retention period
- Access is limited to Edward and named reviewers
- Deletion at end of retention period is automatic and logged
- The user is informed of the retention period in the consent copy before agreeing to Option B

### What Option B does not allow

- Public, sample, or marketing reuse
- Model training input
- Access by anyone outside the named scope
- Retention beyond the approved period

Until Option B's retention period and policy are explicitly approved, **Option B is not active and may not be offered to any user**.

---

## 4. Option C — Deferred

Option C requires:

- A user-accessible save/revisit surface (not yet specified)
- A user identity model (not yet decided)
- A user-facing deletion mechanism (not yet built)
- Consent copy that accurately reflects the storage and access (not yet drafted)

**Option C is not recommended until revisit/save architecture exists.** It is not active and may not be offered to any user at v0.1. No copy for Option C has been drafted to avoid creating the wrong promise before the implementation is decided.

---

## 5. Non-Use Marking

When a user requests non-use, the admin tool marks the report or request as non-use. Marking includes:

- **Mark report/request as non-use** — applied to the report_id; persists across state transitions
- **Exclude from sample creation** — the report cannot be used as a methodology sample, training example, or anonymized illustration
- **Exclude from future improvement review** — the report is not pulled into retrospective batches for methodology review
- **Do not promise impossible deletion** — the marking is honest about what it does (stops future use) versus what it does not do (does not delete operational metadata or backups beyond technical capability)

The user-facing copy describing non-use follows `docs/detailed-report-storage-and-non-use-policy-v0.1.md` Section 4 — cautious wording, no instant or permanent deletion promises.

---

## 6. Public Sample Reuse

| Default | Use a delivered report or feedback as a public sample, testimonial, or marketing material |
|---|---|
| **Prohibited** | Yes, by default |
| **How permitted** | Separate explicit permission from the user AND a separate anonymization review |
| **Anonymization scope** | All identifying details removed, any pattern that could identify the user removed, the user re-confirms before publication |

The default applies regardless of storage option. Option A, B, or C do not change the default prohibition on public sample reuse.

---

## 7. Delivery Boundary

The admin tool's delivery boundary at v0.1:

- **No automatic delivery.** No state transition triggers delivery without a manual reviewer action.
- **Delivery only after manual approval in a separately authorized pilot.** The `delivery_ready` and `delivered` states are conceptual; they do not approve delivery by their existence.
- **Safety note must remain visible.** Section 13 (verbatim) and, when applicable, the relationship-distance appended safety note remain in the delivered text.
- **Consent version recorded.** The version of consent the user agreed to is recorded with the delivery event.
- **Storage choice recorded.** The user's storage option is recorded with the delivery event.
- **No delivery if review fails.** A draft in `revision_required`, `held`, or `rejected` cannot transition to delivery without passing review.
- **`held` status must use neutral copy** when the user is informed of the hold (see Section 6).

### Held user-facing copy (neutral)

```
安全確認と内容確認のため、このレポートは現在お渡しを保留しています。必要な確認が終わり次第、案内します。
```

### Prohibited held copy

The following copy patterns must **never** appear in any user-facing hold message:

- `あなたの内容に問題があります`
- `危険な状態です`
- `購入できません`
- `自動判定で失敗しました`

These are blame-shifting, alarming, payment-implying, or automation-implying. None is acceptable.

---

## 8. Conceptual Admin Events

The following events are conceptual specifications. None are implemented by this document. If implemented later, every event must follow safe-logging rules — no report text, no user identifiers, no free-text user disclosures, no raw answer text in event payloads.

| # | Event | Purpose | Allowed data | Forbidden data |
|---|---|---|---|---|
| 1 | `admin_request_opened` | Records that a new report request entered the workflow | report_id, requested_at, actor_role, source_test_type | requester identity, request body free text |
| 2 | `consent_verified` | Records consent confirmation | report_id, consent_version, storage_option, timestamp | user identifiers, raw consent text |
| 3 | `input_packet_created` | Records packet creation (operational metadata only) | report_id, packet_field_completeness_snapshot, timestamp | packet contents, reviewer free-text notes |
| 4 | `packet_sufficiency_failed` | Records sufficiency check failure | report_id, structured_failure_categories, timestamp | packet content, free-text reasons |
| 5 | `draft_generation_started` | Records that drafting began | report_id, drafter_role_id, main_state_mode, timestamp | drafter free-text notes |
| 6 | `draft_generated` | Records that draft was completed | report_id, drafter_role_id, section_count, total_char_count, timestamp | draft text, draft excerpts |
| 7 | `safety_review_started` | Records review start | report_id, reviewer_role_id, timestamp | reviewer free-text notes |
| 8 | `safety_review_failed` | Records review failure | report_id, structured_failure_categories, reviewer_role_id, timestamp | review free-text content |
| 9 | `revision_requested` | Records that revision was sent back to drafter | report_id, structured_finding_categories, timestamp | reviewer free-text notes |
| 10 | `internal_approved` | Records internal approval | report_id, edward_approval_timestamp, category_scores | review free-text content |
| 11 | `delivery_ready` | Records that report is staged for manual delivery (under separately authorized pilot) | report_id, pilot_reference, timestamp | report text, user identifiers |
| 12 | `delivered` | Records that report was manually delivered (under separately authorized pilot) | report_id, delivery_timestamp, delivery_channel | report text, user identifiers |
| 13 | `held` | Records hold transition | report_id, structured_hold_reason, actor_role, timestamp | reviewer free-text |
| 14 | `rejected` | Records rejection | report_id, structured_rejection_reason, actor_role, timestamp | reviewer free-text |
| 15 | `deletion_or_non_use_marked` | Records user deletion or non-use request | report_id, marker_type ("deletion" / "non_use"), timestamp | user free-text request body, user identifiers |

Events 11 and 12 are conceptual future events. Their definition here does not approve delivery.

---

## 9. What Must Still Not Happen

The following remain prohibited regardless of any spec defined in this document. None of them are authorized by the existence of this spec or by any completed gate item.

- **No implementation approval** — the admin tool itself is not authorized by this document
- **No user delivery approval** — `delivery_ready` and `delivered` states are conceptual; they do not approve delivery
- **No volunteer pilot approval** — no volunteer pilot may run without separate Edward authorization after the readiness gate is met
- **No payment** — no payment, no Stripe, no checkout, no entitlement
- **No automation** — no automatic state transitions, no automatic delivery, no automatic generation
- **No OpenClaw runtime access with user data** — OpenClaw is not active for generation in this pilot
- **No LINE history** — raw or summarized LINE message use is not approved
- **No memory** — Level 2 and Level 3 memory remain deferred
- **No raw private free text** — raw answer payloads, free-text user disclosures, and identifiable references are not stored or processed
- **No model training** — reports, packets, drafts, and feedback are not used for training or fine-tuning
- **No public sample reuse** — separate explicit permission and anonymization review required
- **No dashboard implementation approval** — the existing `/admin/dte-launch-dashboard` operational surface remains; no new dashboard surface is authorized
- **No entitlement implementation** — no entitlement records, no purchase gating
- **No Codex implementation prompt** — this spec is not a build instruction for Codex; it is methodology only
- **No production claims** — no marketing copy, no public claims of capability, no testimonials based on internal pilot or future volunteer pilot outcomes

---

> **This document is a boundary specification. It does not implement storage, retention, delivery, deletion, or any user-facing surface. It does not approve a volunteer pilot or any user delivery.**
