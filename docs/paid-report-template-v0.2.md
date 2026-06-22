# Yorisou — Paid Report Template v0.2

**Status:** Specification only. Not implementation approval.
**Version:** v0.2 (supersedes `docs/paid-report-template-specification-v0.1.md` as the governing generation methodology)
**Controller:** Edward (final approver)
**Methodology owner:** Yorisou Agent
**Last updated:** 2026-06-22

---

> **Template v0.2 is a generation methodology specification only. It does not approve user delivery, payment, automation, volunteer pilots, LINE history use, memory use, raw private free text use, OpenClaw runtime access, model training, dashboard implementation, account/report storage, entitlement, or paid launch.**

---

## 1. Why Template v0.2 Is Needed

Template v0.1 (`docs/paid-report-template-specification-v0.1.md`) defined the 14-section structure, length bounds, phrase rules, and quality checklist. The simulated and internal pilot batches surfaced that v0.1 alone is insufficient to consistently produce reports that meet the rubric at the Personalization ≥ 4 and Paid-worthiness ≥ 4 thresholds. v0.2 formalizes the missing mode logic, input-packet contract, and mode-fit quality gates.

### What the simulated pilots proved

- The 14-section structure produces reports in the 8,000–15,000 character target range when drafted manually
- The safety review workflow catches forbidden phrases and clinical drift consistently
- Section 13 (safety note) can be enforced verbatim without operational pain
- Paid-worthy structure is achievable without manipulation when the template is followed
- Edward-level review is sustainable at ≤5 reports per batch
- The rubric is workable as a scoring instrument

### What the internal pilots proved

- Granular input packets produce visibly more personalized reports than thin packets
- `main_state_mode` selection produces meaningfully different reports across modes
- Mode-specific section emphasis prevents reports from collapsing into a single recovery/rest shape
- `Save/Revisit` (section 14) must never drop to 0% — even in modes where 30-day direction is heavy, the summary must remain present
- Recommendation seeds are needed to prevent section 11 from drifting toward third-party services or clinical advice
- Tension and contradiction maps drive section 6 quality
- Low-confidence packets produce low-personalization reports; the packet must be revised, not drafted-around

### Why Template v0.1 is insufficient

- v0.1 has no concept of `main_state_mode`. Without it, every report defaults to the persona-typical framing, which produces mode collapse and over-emphasis of recovery for users whose primary state is not depletion.
- v0.1 does not require granular input packet fields beyond top dimensions and confidence band. The drafter has too little to work with to produce specific personalization.
- v0.1 does not formalize Section 7 flexibility, which causes direction-focus and decision-clarity states to read as fatigue-recovery states.
- v0.1 does not include mode-fit or input-packet-sufficiency as scored categories, so the rubric cannot detect mode-collapse or thin-packet failures.
- v0.1 does not define a low-confidence fallback response, leading to over-confident copy in low-confidence cases.
- v0.1 does not block generation when the packet is too thin, leading to generic-sounding reports being drafted only to be rejected at review.

### Why mode-specific generation rules are required

State variability is the dominant driver of report quality. A user in `direction_focus` needs section 9 heavier and section 7 retitled toward momentum; a user in `fatigue_recovery` needs section 7 heavy and section 9 light; a user in `relationship_distance` needs section 4 heavy and section 6 framed around care/distance tension. Without per-mode rules, the drafter averages, which produces reports that fit no one well.

### Why v0.2 must be finalized before admin tooling

Admin tooling (a packet-builder UI, a drafting workspace, a review queue) hardcodes the contract between the input packet, the drafter, and the reviewer. If admin tooling is built before the v0.2 contract is finalized, the tooling either constrains future versions or carries v0.1 assumptions forward. Methodology must lead. Tooling follows once the methodology is stable.

This document does not authorize admin tooling implementation. It defines the methodology that any future tooling would have to support.

---

## 2. Template v0.2 Core Changes

The following changes are formalized in v0.2.

### Required `main_state_mode`

Every input packet must carry `main_state_mode`, one of exactly five values:

- `fatigue_recovery`
- `direction_focus`
- `relationship_distance`
- `decision_clarity`
- `rhythm_stabilization`

Report drafting must not begin without this field. Selection rules and per-mode writing rules are in `docs/report-main-state-mode-writing-rules-v0.2.md` (this package) and `docs/main-state-mode-rules-v0.2.md` (prior package).

### Required v0.2 Input Packet

Every report begins from a v0.2 input packet per `docs/pilot-input-packet-schema-v0.2.md`. The packet's minimum granularity requirements are load-bearing for personalization quality.

### 10+ Answer-Pattern Bullets

The packet must include at least 10 short observational bullets describing answer patterns. Bullets are not raw answer text. They describe what the answer profile looks like (e.g., "Frequently selects mid-range options on emotion-load items"). Below 10, sections 3–6 cannot be specific.

### Top / Bottom Signals

Exactly 3 top signals and exactly 3 bottom signals. Bottom signals shape the negative space and prevent the drafter from over-claiming.

### Contradiction / Tension Map

At least 2 tension pairs. Tensions feed section 6 (Conflict Map). A report drafted without tensions produces a flat section 6 or invented tensions, both of which fail the rubric.

### `recommendation_seed`

At least 1 seed for section 11. Seeds are topic areas + framing + why, not URLs or specific products. Seeds prevent drift toward third-party services and clinical advice.

### `section_emphasis_plan` as Density Guidance Only

`section_emphasis_plan` tells the drafter where to lean. It uses density labels (`heavy` / `standard` / `light` / `minimal`) and may include rough percentage hints. It is **not** a strict word-count rule. All 14 sections remain required regardless of emphasis. Safety Note (section 13) is always verbatim. Save/Revisit (section 14) is never 0%.

### Mode Fit Scoring

Mode fit is a new scored category. It asks: does the report reflect the selected `main_state_mode` in tone, emphasis, and framing? A reader who reads the report blind should be able to identify the mode. Mode fit ≥ 4 is required.

### Input Packet Sufficiency Scoring

Input packet sufficiency is a new scored category. It asks: did the packet provide enough granularity for the drafter to produce personalized content? Input packet sufficiency ≥ 4 is required. A low score is a packet-schema failure, not a drafting failure, and must be surfaced as a methodology gap.

### Low-Confidence Fallback

When `confidence_level` is `low` or any packet field is too thin to support personalization at the rubric threshold, the response is the standard fallback (see `docs/report-generation-failure-fallbacks-v0.2.md` Section 3) — not a generic-sounding draft.

### No Generation If Packet Fails Minimum Granularity

If the packet fails any minimum granularity requirement (see schema spec Section 3), drafting must not begin. The response is `input_packet_revision_required`. This rule is absolute and supersedes any operational pressure to deliver.

---

## 3. Paid-Worthiness Requirements

For a v0.2 report to clear the Paid-worthiness ≥ 4 threshold:

- Commercial structure must be serious — clear sections, clear value over the free result, clear save/revisit summary
- No commercial pressure — no urgency, no future-loss framing, no implication that the report is incomplete unless the user does something else
- No dark patterns — no hidden-truth framing, no fear-based language, no scarcity
- Differentiation from the free result must be substantive, not cosmetic — depth, personalization, action plans, and revisit value must clearly exceed what the free result delivers
- Mode fit must be visible — a paid report that reads like a different user's report is not paid-worthy
- Section 14 (Save/Revisit Summary) must stand alone as a usable summary the user can return to

Paid-worthiness is scored after the report is drafted and reviewed. It is not assumed because the structure is correct.

---

## 4. Reference Document Map

| Topic | Document |
|---|---|
| Input packet schema | `docs/pilot-input-packet-schema-v0.2.md` |
| Mode selection rules | `docs/main-state-mode-rules-v0.2.md` |
| Mode-specific writing rules | `docs/report-main-state-mode-writing-rules-v0.2.md` (this package) |
| Quality gate and scoring | `docs/report-generation-quality-gate-v0.2.md` (this package) |
| Failure modes and fallbacks | `docs/report-generation-failure-fallbacks-v0.2.md` (this package) |
| 14-section structure baseline | `docs/paid-report-template-specification-v0.1.md` Section 4 |
| Phrase rules | `docs/paid-report-template-specification-v0.1.md` Section 5 |
| Safety note (verbatim) | `docs/paid-report-template-specification-v0.1.md` Section 4, Section 13 |
| Workflow and roles | `docs/paid-report-generation-workflow-v0.1.md` |
| Ops procedure | `docs/paid-report-semi-manual-ops-v0.1.md` |
| Consent governance | `docs/consent-and-report-data-governance-v0.1.md` |
| Consent copy | `docs/report-consent-copy-v0.1.md` |
| Dashboard governance | `docs/report-data-dashboard-governance-v0.1.md` |
| Internal real-input pilot | `docs/internal-real-input-pilot-plan-v0.1.md` |

Where v0.2 conflicts with v0.1, v0.2 governs.

---

> **Template v0.2 is a generation methodology specification only. It does not approve user delivery, payment, automation, volunteer pilots, LINE history use, memory use, raw private free text use, OpenClaw runtime access, model training, dashboard implementation, account/report storage, entitlement, or paid launch.**
