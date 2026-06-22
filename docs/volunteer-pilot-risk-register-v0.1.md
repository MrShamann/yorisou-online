# Yorisou — Volunteer Pilot Risk Register v0.1

**Status:** Plan / specification only. Not approval to start.
**Version:** v0.1
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **This document does not approve the pilot start. It identifies the risks that would govern a pilot if Edward separately authorizes one, and records the current decision posture on adjacent capability questions.**

---

## 1. Risk Table

Severity scale: **low / medium / high**.

| # | Risk | Severity | Mitigation | Stop condition |
|---|---|---|---|---|
| 1 | **Consent misunderstanding** — user agrees without understanding scope of data use or report boundary | High | Two-step consent (data use + boundary), both with short and full versions; explicit decline path; Edward confirms candidate comprehension before consent recording | Any user reports they did not understand what they agreed to → hold cohort; revise consent copy |
| 2 | **User thinks report is diagnosis / advice** | High | Boundary copy at consent, in-report safety note (Section 13 verbatim), feedback Q10 explicitly checks for this reading | Q10 "強くそう感じた" from any user → hold cohort; revise boundary copy and template tone |
| 3 | **Relationship-distance misinterpretation** | High | Mode excluded from first cohort; if added in any future cohort, 17-item extra reviewer checklist plus extra in-report safety note; relationship-distance distance framing restricted to reaction interval / returnable distance / timing boundary | Any future inclusion of this mode without the full checklist and copy → block delivery |
| 4 | **Generic report disappointment** | Medium | v0.2 packet schema requires 10+ answer-pattern bullets, top/bottom signals, tensions, recommendation seed; Personalization ≥ 4 threshold; sufficiency checker blocks drafting from thin packets | Personalization < 4 across multiple reports → hold; revise packet schema or mode rules |
| 5 | **Over-personalization discomfort** — report reads as creepy or surveilling | High | No raw answer text in packet; no partner identity; no identifiable references; feedback Q4 explicitly asks; reviewer checklist scans for creepy inference | Q4 "あった" with a flagged section → hold the specific case; revise drafter prompts |
| 6 | **Manual workload** — Edward's per-report review time becomes unsustainable | Medium | Cohort size 3 recommended; maximum 10; review checklist is structured to reduce free-text overhead; per-report time logged | Per-report time exceeds sustainable capacity → stop cohort expansion; reduce batch size |
| 7 | **Storage / non-use failure** — a deletion or non-use request cannot be honored cleanly | High | Option A is mandatory (no full-text persistence after review window); cautious deletion copy; structured non-use marking; honest communication if full deletion is not technically possible | Any request cannot be honored within stated capability → hold; fix the storage/non-use process |
| 8 | **Volunteer expects immediate delivery** | Medium | Manual review wait communicated honestly in pilot explanation and Step 6 of consent flow; "お届けまでに少しお時間をいただく場合があります" copy; no automation language | User expresses strong dissatisfaction with wait → hold; revise expectation copy |
| 9 | **Payment expectation confusion** — user thinks they will be charged or expects to pay | High | Explicit "支払いは発生しません" copy at multiple steps; no purchase, save-to-account, or share buttons; pilot is framed as quality validation, not product launch | Any user thinks they were or will be charged → hold; revise payment-explanation copy |
| 10 | **Feedback includes sensitive details** — free-comment field receives names, partner identity, health details | High | Warning displayed below the field naming the categories to omit; redaction before storage; forbidden-categories collection rule | Multiple users include sensitive details despite warning → hold feedback collection; revise warning |

---

## 2. Decision Matrix

Records the current decision posture on each adjacent capability question. Each row shows the current recommendation, whether allowed in the first pilot, the condition under which it could be allowed in any future phase, and whether Edward approval is needed to change posture.

| Decision | Current recommendation | Allowed in first pilot? | Condition to allow | Edward approval needed? |
|---|---|---|---|---|
| **Start pilot** | Prepare only; not allowed now | No | Readiness gate fully met (PR #41), cohort source/recruitment/timing explicit, Edward authorizes start | Yes — explicit authorization |
| **Include `relationship_distance` mode** | Defer | No | First cohort completes with 0 consent/safety/delivery issues; relationship-distance extra checklist and appended safety note approved for use; Edward authorizes inclusion | Yes |
| **Allow Storage Option B (limited internal retention)** | Defer | No | Explicit retention period approved; access policy documented; deletion procedure defined | Yes |
| **Allow Storage Option C (user revisit/save)** | Defer | No | Revisit/save architecture exists; identity model decided; deletion mechanism built; consent wording drafted and approved | Yes |
| **Allow OpenClaw draft support / sanitized assistant role** | Defer | No | OpenClaw safety review completed; per-draft authorization process defined; not used for `relationship_distance` without separate authorization | Yes |
| **Allow payment** | Block | No | Pricing decided; refund/failure policy decided; payment provider integration reviewed; consent and delivery copy updated to reflect commercial nature | Yes |
| **Allow automation** | Block | No | Manual workflow proven sustainable at small scale; per-step automation case reviewed; reviewer-in-the-loop maintained; per-feature Edward authorization | Yes — per step |
| **Use LINE history** | Block | No | LINE summarization method reviewed; deletion path confirmed; separate consent block drafted; not approved at first pilot | Yes |
| **Use memory (Level 2 / Level 3)** | Defer | No | Memory specification drafted; consent copy for each level approved; deletion mechanism built; storage policy updated | Yes — per level |
| **Use reports as public samples** | Block | No | User's separate explicit named permission obtained; anonymization review completed; user re-confirms before publication | Yes — per use |

---

## 3. Summary Posture

- **Start pilot:** prepare only, not allowed now, Edward explicit authorization required
- **`relationship_distance`:** not in first cohort, future conditional only
- **Option B:** not allowed in first cohort
- **Option C:** not allowed
- **OpenClaw draft support:** not allowed
- **Payment:** blocked
- **Automation:** blocked
- **LINE history:** blocked
- **Memory:** deferred / not allowed
- **Public samples:** blocked

Each posture above remains current until Edward separately authorizes a change. None of these is changed by merging this document.

---

## 4. Risk-to-Mitigation Coverage

For traceability, each risk in Section 1 is covered by at least one document already merged:

| Risk | Primary covering doc |
|---|---|
| 1 — Consent misunderstanding | `docs/detailed-report-consent-ui-copy-v0.1.md` (consent copy); `docs/volunteer-pilot-user-facing-copy-v0.1.md` (pilot copy) |
| 2 — Diagnosis / advice misreading | `docs/paid-report-template-specification-v0.1.md` Section 13 (safety note); `docs/detailed-report-consent-ui-copy-v0.1.md` Section 4 (boundary copy) |
| 3 — Relationship-distance misinterpretation | `docs/relationship-distance-extra-safety-copy-v0.1.md`; `docs/admin-review-checklist-v0.1.md` Section 4 |
| 4 — Generic report disappointment | `docs/pilot-input-packet-schema-v0.2.md`; `docs/report-generation-quality-gate-v0.2.md` |
| 5 — Over-personalization discomfort | `docs/admin-input-packet-builder-spec-v0.1.md` Section 5 (forbidden contents); reviewer checklist creepy-inference checks |
| 6 — Manual workload | `docs/report-generation-failure-fallbacks-v0.2.md` failure mode 10; cohort size 3 default in pilot plan |
| 7 — Storage / non-use failure | `docs/detailed-report-storage-and-non-use-policy-v0.1.md`; `docs/admin-storage-retention-delivery-boundary-v0.1.md` |
| 8 — Wait expectation | `docs/volunteer-pilot-user-facing-copy-v0.1.md` Step 6 copy; pilot plan delivery expectation |
| 9 — Payment confusion | Pilot copy explicit no-payment statements; consent helper text |
| 10 — Sensitive feedback | `docs/detailed-report-feedback-consent-v0.1.md` Section 5; this package's feedback doc Section 1 free-comment warning |

---

> **This document does not approve the pilot start. It identifies the risks that would govern a pilot if Edward separately authorizes one, and records the current decision posture on adjacent capability questions.**
