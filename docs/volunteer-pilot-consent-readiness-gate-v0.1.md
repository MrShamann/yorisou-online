# Yorisou — Volunteer Pilot Consent Readiness Gate v0.1

**Status:** Specification only. Not approval. Not implementation.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document does not approve a volunteer pilot. It defines the readiness gate that must be satisfied before any volunteer pilot may be considered for separate authorization.**

---

## 1. Purpose

A trusted-volunteer 詳細レポート pilot is a meaningful step beyond the internal real-input pilot. Before any volunteer can be invited, contacted, or shown a consent flow, a list of readiness items must be completed and approved. This document defines that gate.

Meeting every gate item does not by itself authorize the volunteer pilot. Separate Edward authorization is required after the gate is met.

---

## 2. Readiness Gate

Each item must be **completed and Edward-approved** before the volunteer pilot may be considered for authorization.

| # | Gate item | What it means | Where defined |
|---|---|---|---|
| 1 | **Consent copy approved** | All Level 1 data-use consent copy is finalized and Edward-approved | `docs/detailed-report-consent-ui-copy-v0.1.md` Section 3 |
| 2 | **Report boundary copy approved** | The 詳細レポート boundary copy (short, expanded, in-report safety note, preview/paywall, relationship-distance extra) is finalized and Edward-approved | `docs/detailed-report-consent-ui-copy-v0.1.md` Section 4 |
| 3 | **Storage option selected** | The storage/non-storage option for the pilot is chosen (Option A recommended) and the corresponding user-facing copy is approved | `docs/detailed-report-storage-and-non-use-policy-v0.1.md` |
| 4 | **Deletion / non-use process defined** | The deletion request, non-use request, stop-future-use, sample/public-use prohibition, and timeline expectation copy are all approved; the operational process to handle each is defined (who responds, in what window, with what wording) | `docs/detailed-report-storage-and-non-use-policy-v0.1.md` Section 4 |
| 5 | **Feedback form approved** | The feedback consent copy, checkbox label, question set, free-comment warning, decline path, and submit confirmation are all approved | `docs/detailed-report-feedback-consent-v0.1.md` |
| 6 | **Relationship-distance extra copy approved** | The short UI copy, full pre-report copy, in-report appended safety note, and the 16-item reviewer checklist are all approved | `docs/relationship-distance-extra-safety-copy-v0.1.md` |
| 7 | **Manual review owner assigned** | A named human reviewer (Edward at v0.1) is responsible for safety review and quality gate on every report before delivery. Backup reviewer and escalation path defined. | This document |
| 8 | **No payment** | The pilot has no payment, no Stripe, no checkout, no entitlement, no pricing displayed | This document |
| 9 | **No automation** | All drafting is manual or human-reviewed. No automatic generation pipeline active. | This document |
| 10 | **No LINE history** | No raw LINE messages used. No LINE summaries used at the volunteer pilot stage. | This document |
| 11 | **No memory** | Level 2 and Level 3 memory not active. Level 1 only. | This document |
| 12 | **No raw private text** | No raw answer text in the packet. No personal disclosures collected. | This document |
| 13 | **No model training** | Reports, inputs, and feedback are not used to train or fine-tune AI models. | This document |
| 14 | **No public sample reuse** | No volunteer's report or feedback is used as a public sample, testimonial, or marketing content. | This document |
| 15 | **No delivery without manual review** | Every report is reviewed by the named owner before delivery. No exception. | This document |
| 16 | **Small cohort boundaries defined** | The maximum cohort size, recruitment source, and time window for the pilot are explicit and Edward-approved before any invitation is sent | This document |

A volunteer pilot may not be considered for authorization until **all 16 items** are completed and approved. The state of each item should be tracked in writing.

---

## 3. What Must Still Not Happen

The following remain prohibited regardless of how much of the gate is completed. None of them are authorized by completion of the gate or by this document.

- **No payment.** No price displayed, no payment collected, no payment provider integrated.
- **No paid pilot.** The volunteer pilot, if eventually authorized, is unpaid quality validation.
- **No automation.** No automatic drafting, no automatic delivery, no automatic feedback routing.
- **No user delivery without manual review.** Manual review of every report is non-negotiable at this phase.
- **No LINE history.** Raw LINE message content is not collected, summarized, or used.
- **No memory.** Level 2 and Level 3 memory remain deferred / out of scope.
- **No OpenClaw runtime access with user data.** OpenClaw is not active for generation in this pilot.
- **No model training.** Reports, packets, drafts, feedback, and reviewer notes are not used for training or fine-tuning.
- **No public sample reuse.** No volunteer report is shown to anyone outside Edward and the methodology reviewer.
- **No external marketing claims.** No "Yorisou helped users with X" type claims based on this pilot.
- **No medical / therapy / legal / financial framing.** The report does not present itself as any of these, in any copy.
- **No relationship outcome advice.** No directives on contact, no contact, breakup, reconciliation, confession, blocking, or continuation.
- **No partner mind-reading.** No section may state or imply what the other person feels, intends, or wants.
- **No fake urgency or sales pressure.** No countdown, scarcity, "limited spots", or future-loss framing in any consent or invitation copy.

Every one of these requires separate explicit authorization to change, not derivable from completion of any gate item or pilot outcome.

---

## 4. Recommended Next Step

- **Docs-only Consent UI / Copy PR is allowed.** This document and its sibling documents in this package may be merged as docs to `main`.
- **UI implementation is not allowed by this document.** The consent screens, report request flow, delivery surface, and feedback form must not be built based solely on the merge of these docs.
- **Volunteer pilot is not approved by this document.** Separate Edward authorization is required after the readiness gate is met.
- **Admin generation tool spec should wait until consent/data-use/storage docs are merged.** Building admin tooling against unmerged consent copy creates the wrong dependency direction. Consent copy stabilizes the contract; tooling follows.

---

## 5. Gate Tracking Template

For operational use when the gate is being filled. Not implementation.

| Gate item | State | Approver | Approval date |
|---|---|---|---|
| 1 — Consent copy | pending / approved | Edward | YYYY-MM-DD |
| 2 — Report boundary copy | pending / approved | Edward | YYYY-MM-DD |
| 3 — Storage option | pending / approved | Edward | YYYY-MM-DD |
| 4 — Deletion process | pending / approved | Edward | YYYY-MM-DD |
| 5 — Feedback form | pending / approved | Edward | YYYY-MM-DD |
| 6 — Relationship-distance copy | pending / approved | Edward | YYYY-MM-DD |
| 7 — Manual review owner | pending / approved | Edward | YYYY-MM-DD |
| 8 — No payment | confirmed | Edward | YYYY-MM-DD |
| 9 — No automation | confirmed | Edward | YYYY-MM-DD |
| 10 — No LINE history | confirmed | Edward | YYYY-MM-DD |
| 11 — No memory | confirmed | Edward | YYYY-MM-DD |
| 12 — No raw private text | confirmed | Edward | YYYY-MM-DD |
| 13 — No model training | confirmed | Edward | YYYY-MM-DD |
| 14 — No public sample reuse | confirmed | Edward | YYYY-MM-DD |
| 15 — No delivery without manual review | confirmed | Edward | YYYY-MM-DD |
| 16 — Small cohort boundaries | pending / approved | Edward | YYYY-MM-DD |

When all 16 are in `approved` or `confirmed` state, the gate is met. A volunteer pilot may then be considered for separate Edward authorization. The gate being met does not by itself authorize the pilot.

---

> **This document does not approve a volunteer pilot. It defines the readiness gate that must be satisfied before any volunteer pilot may be considered for separate authorization.**
