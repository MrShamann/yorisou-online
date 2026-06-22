# Yorisou — Pre-Pilot Artifact Pack v0.1

**Status:** Operating artifact pack, docs only. Not approval to start.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This pack does not approve pilot start, recruitment, user delivery, implementation, automation, payment, OpenClaw runtime access, LINE history use, memory use, model training, entitlement, dashboard implementation, or public sample reuse. It is a human-readable operating artifact intended to make the next decision visible.**

---

## 1. Pre-Pilot Executive Summary

### What this pack is

A self-contained operating artifact for the Yorisou 詳細レポート volunteer pilot. It collects, in one navigable place, the artifacts a controller and reviewer would actually use the day a pilot becomes possible:

- The pack itself (this document)
- Volunteer invitation and consent copy
- Operator intake and admin review pack
- User-facing message pack
- Outcome log template and stop/hold card
- Edward approval checklist

The pack consolidates content already specified across earlier PRs (Template v0.2, packet schema v0.2, consent governance and copy, storage policy, feedback consent, relationship-distance safety copy, admin generation tool spec, volunteer pilot plan) into the concrete forms a real first-cohort run would need.

### What it enables

- Edward can read the pack end-to-end before authorizing any pilot start and judge whether the boundary holds in practice.
- A reviewer can use the operator intake checklist to handle a single first-cohort participant from invitation through outcome log.
- A drafter (Yorisou Agent) can apply the admin review pack against a real draft.
- A participant would see only the user-facing copy from the user-facing message pack — not the operator artifacts.
- The stop/hold card is usable in real time when a concerning signal appears.
- The Edward approval checklist makes the authorization decision a single observable surface.

### What it does not approve

- The pilot is not authorized to start by the existence of this pack.
- No recruitment is approved.
- No user delivery is approved. The delivery copy in the user-facing pack is future-use copy only.
- No implementation is approved. Admin tooling, consent UI, report delivery surfaces, and feedback forms are not built by this PR.
- Payment, automation, OpenClaw runtime access, LINE history use, memory use, model training, entitlement, dashboard implementation, and public sample reuse all remain explicitly out of scope.

### Why it comes before implementation or recruitment

Building the consent UI, admin tool, or invitation flow before the operating artifacts are finalized produces tooling that hardcodes early assumptions. Recruiting volunteers before the artifacts are signed off produces consent that can't be honored under the stated boundaries. The pack lets every load-bearing artifact be reviewed once in concrete form, so that any later implementation work or recruitment can map cleanly to an approved baseline.

### What Edward must approve later before pilot start

- Every copy block in the user-facing pack and invitation/consent copy
- The cohort source (named pool of trusted volunteers) and recruitment timing window
- The manual review owner (and a named backup) per the volunteer-pilot readiness gate
- The Edward approval checklist completion in full
- Explicit pilot-start authorization, recruitment authorization, and per-report delivery authorization

These are listed in concrete form in `docs/pre-pilot-edward-approval-checklist-v0.1.md`.

---

## 2. First Cohort Operating Boundary

| Item | Boundary |
|---|---|
| **Cohort size** | 3 (operational default; max 10 only after the first 3 pass safely) |
| **Participants** | Trusted volunteers only, hand-selected by Edward; no public recruitment |
| **Language** | Japanese first; no EN pilot unless separately approved (EN template not specified) |
| **Source test** | First cohort prioritizes `quick_check`. Other approved Level 1 tests require separate Edward approval before being used. |
| **Allowed `main_state_mode` values** | `decision_clarity` / `rhythm_stabilization` / `fatigue_recovery` / `direction_focus` |
| **Excluded mode** | `relationship_distance` — not in first cohort. Future inclusion is conditional on the first cohort completing with no consent/safety/delivery issues plus a separate Edward approval. |
| **Consent level** | Level 1 only |
| **Storage option** | Option A is **mandatory** for every first-cohort participant. Options B and C are not displayed, not offered, not selectable. |
| **Manual review owner** | **Must be assigned and named in writing before pilot start.** (Edward at v0.1; named backup also required.) |
| **Approval per report** | Edward final approval is **required for every delivered report** — no exception. |
| **Delivery** | Manual only. No automatic delivery. No batch auto-delivery. Per-report manual delivery action under Edward authorization. |
| **Feedback** | Optional. Internal-only. Skipping is normal. The optional future payment-interest question is explicitly not a core success metric. |
| **Stop condition triggers** | Any consent confusion, safety issue, storage/non-use uncertainty, sensitive/crisis content, diagnosis/advice misreading, relationship-decision request, packet insufficiency, workload exceeding capacity, or boundary-violating user expectation triggers an immediate hold. |

---

## 3. What Must Still Not Happen

The following remain prohibited regardless of any artifact merged in this pack. None of them is authorized by merging this PR.

- **No pilot start** — separate Edward authorization required after the readiness gate is met
- **No recruitment** — no invitation may be sent based on this merge
- **No user delivery** — the delivery copy in the user-facing pack is future-use copy only
- **No implementation** — admin tooling, consent UI, report delivery surface, and feedback form are not authorized
- **No payment** — no price, no purchase flow, no entitlement, no Stripe surface
- **No automation** — manual / semi-manual workflow only; no automatic state transitions on the critical path
- **No OpenClaw runtime access** — OpenClaw not active for generation; sanitized draft assistant remains future spec only
- **No LINE history** — raw or summarized LINE message use is not approved
- **No memory** — Level 2 and Level 3 memory remain deferred
- **No public sample reuse** — separate explicit named permission and anonymization review required
- **No `relationship_distance` mode in first cohort** — excluded; future inclusion conditional
- **No Option B / Option C** in first cohort — not displayed, not offered
- **No immediate automated delivery** — every delivery is a manual, per-report action under Edward authorization
- **No Codex implementation prompt** — this pack is not a build instruction for Codex; it is operating methodology only

---

## 4. Pack Contents

This pack consists of six documents, this one plus five companions:

| # | Document | Purpose |
|---|---|---|
| 1 | `docs/pre-pilot-artifact-pack-v0.1.md` *(this document)* | Executive summary, operating boundary, what-must-not-happen, navigation |
| 2 | `docs/pre-pilot-volunteer-invitation-and-consent-copy-v0.1.md` | Japanese invitation, eligibility, consent copy, checkbox/helper/error texts, final confirmation copy |
| 3 | `docs/pre-pilot-operator-intake-and-admin-review-pack-v0.1.md` | Operator intake checklist, admin review pack (sufficiency/mode-fit/safety/recommendation-safety/consent-storage/delivery-readiness/scoring), pass thresholds, Edward final approval field |
| 4 | `docs/pre-pilot-user-facing-message-pack-v0.1.md` | Japanese copy for request received through thank-you, feedback questions, optional payment-interest question (clearly optional) |
| 5 | `docs/pre-pilot-outcome-log-and-stop-hold-card-v0.1.md` | Outcome log template (no identifiable data), stop/hold card with default action |
| 6 | `docs/pre-pilot-edward-approval-checklist-v0.1.md` | The single checklist Edward must complete and approve before pilot start |

---

## 5. How to Read This Pack

Suggested reading order for the controller:

1. This document (executive summary, boundary, what-must-not-happen)
2. The Edward approval checklist (`pre-pilot-edward-approval-checklist-v0.1.md`) — to see what authorization will look like
3. The volunteer invitation and consent copy (`pre-pilot-volunteer-invitation-and-consent-copy-v0.1.md`) — to confirm what the candidate would read
4. The user-facing message pack (`pre-pilot-user-facing-message-pack-v0.1.md`) — to confirm what the participant would see post-consent
5. The operator intake and admin review pack (`pre-pilot-operator-intake-and-admin-review-pack-v0.1.md`) — to confirm internal handling
6. The outcome log and stop/hold card (`pre-pilot-outcome-log-and-stop-hold-card-v0.1.md`) — to confirm the operational record and stop posture

If the controller finds any block unacceptable, that block is revised before any pilot is considered. Approval is per-block.

---

## 6. Recommended Next Step

- **Docs-only Pre-Pilot Artifact Pack PR is allowed.** This document and its companions may be merged as docs to `main`.
- **Not minimal implementation.** No admin tool, consent surface, or delivery surface is built by this PR.
- **Not recruitment.** No invitation may be sent based on this merge.
- **Not payment.** No payment-related implementation is appropriate at this stage.
- **Not OpenClaw assistant spec.** OpenClaw runtime assistant remains future spec only and is not authorized.

The next big-package decision after this pack merges is the **minimal implementation decision** (what is the smallest implementation step that could support a pilot, if Edward later authorizes one) **or** a **pilot-start authorization review** (does the readiness gate now allow Edward to authorize a pilot start without any implementation work, e.g., via operator-mediated manual delivery). Either is a separate package; neither is begun by this PR.

---

> **This pack does not approve pilot start, recruitment, user delivery, implementation, automation, payment, OpenClaw runtime access, LINE history use, memory use, model training, entitlement, dashboard implementation, or public sample reuse.**
