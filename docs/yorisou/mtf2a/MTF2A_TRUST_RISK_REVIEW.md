# MTF-2A — Trust-Risk Review (Forge step 18 / MTF-2A §11)

## Shared review (both methods)

| Risk | Finding |
|---|---|
| Clinical adjacency | PASS — no diagnosis/screening/severity structures; daily uses weather/battery metaphors; values uses decision situations; both carry 「診断ではありません」-class limits |
| False authority / fake validation | PASS — `confidence_policy: none_stated` with the natural-language boundary; no accuracy, validation, or 科学的 claims anywhere; no invented user counts/testimonials |
| Public/private leakage | PASS — structural: daily share = continuation-only (no content); values share = displayName + shareLine only; private layers and memos never in URLs/share cards |
| Moral judgment | PASS — values choices are desirable-vs-desirable; result names are non-hierarchical 時期 language; no ranking of any kind |
| Pressure/urgency | PASS — no streaks, no penalties, no countdowns, no 今すぐ; gap copy explicitly forgiving |
| Name/result collision | PASS — full collision sweep recorded in the originality register |
| Recommendation overreach | PASS — governed tags, hints-only, no commercial/affiliate content; follow-ups restricted to frozen-universe IDs |
| Privacy | PASS — daily = P5 (opt-in memo, default off, private-only); values = P1; both private-by-default |
| Accessibility | PASS — labels defined; house WCAG 2.2 AA gate applies at implementation |
| Minors/sensitive users | PASS with note — language is all-ages-safe and non-directive; no age gate exists platform-wide (existing platform posture, unchanged by this package) |
| Japan embarrassment risk | PASS — shoulder-surf-safe entry screens (weather words, neutral situations); nothing on-screen names emotions clinically |

## daily-check-in — specific attention (§11)

| Risk | Finding |
|---|---|
| Distress language | PASS — the lowest states are あめ/ほぼ空/ぐるぐる; acks acknowledge the DAY, never evaluate the person; no 大丈夫ですか?-style probing |
| Body/health implication | PASS — からだの充電 is an energy metaphor; no symptom, sleep-quality, or health-metric framing |
| Free-text privacy | PASS — opt-in, default OFF, 140-char cap, private-only, never in share/URL/understanding without explicit confirmation |
| Repeated low-state records | **ESCALATION E-1 (recorded, NOT implemented)** — consecutive-rain patterns render as neutral observations only (「あめが続いた週」). Whether the product should EVER show a gentle resources pointer after sustained low states is a Founder policy decision requiring care (crisis-adjacency). This package implements nothing and the timeline copy never says worsening. |
| Crisis/medical triage | NOT IMPLEMENTED by design — no triage, no hotline logic, no medical advice; explicitly out of scope per §11 |

## yorisou-values — specific attention (§11)

| Risk | Finding |
|---|---|
| Moral ranking | PASS — all seven dimensions written as equally legitimate; notMeaning lines defuse the negative reading of each |
| Political/religious inference | PASS — no item touches politics, religion, or ideology; contribution items are everyday-scale (手伝い/当番/応援) |
| Employer screening misuse | **ESCALATION E-2 (recorded)** — any values instrument can be misused for screening. Mitigations in-package (MTF-2A.1): the anti-screening usage boundary now SHIPS in canonical copy (usageBoundaryJa + interpretation limits); results are current-state (unstable by design); ACCURATE numerics statement: method-local numeric calculations exist internally but are never user-facing ranking scores, never exposed, and never usable to compare people; a Terms-of-Use clause against employment/placement/evaluation/selection screening is REQUIRED at implementation (FD-3). |
| Compatibility certainty | PASS — no compatibility output exists; cross-method numeric comparison structurally prohibited |
| Permanent identity labeling | PASS — 「〜たい時期」 naming + current-state recognition lines + retest framing (変化は自然) |

## Escalation register (historical — step-18 state, SUPERSEDED by the current state below)

- **E-1** — sustained-low-state gentle-resources policy (daily-check-in): Founder decision; crisis-adjacent design requires its own reviewed package. *(SUPERSEDED: resolved for V1 by Founder decision 3.2 — see current state.)*
- **E-2** — anti-screening terms-of-use clause (values): Founder/legal follow-up. *(Still open as a legal implementation item — see current state.)*

## Outcome (historical — step-18 pass, before MTF-2A.1 Founder decisions)

**PASS with two recorded escalations (E-1, E-2)** — recorded at step 18 as future policy decisions, not defects in the authored content. *(This count is historical; see the current escalation state below.)*

## MTF-2A.1 additions

- **Founder decision 3.2 recorded (V1 sustained-low-state policy):** no automatic crisis classification, no medical inference, no automatic hotline/consultation pointer triggered by daily selections alone, no worsening language, no severity calculation. Timeline stays neutral/descriptive (canonical `prohibitions` updated). A global, user-initiated safety/resource surface may be designed later under a separate Founder-authorized policy package. Escalation E-1 is thereby RESOLVED for V1 (superseded by this policy).
- **Anti-screening boundary (3.3) shipped** in `yorisou-values.v1.json` (`usageBoundaryJa`) + product spec §9 + interpretation limits; ToU implementation requirement registered (FD-3 remains a legal follow-up).
- **Acknowledgement risk pass:** 13/13 reviewed — future predictions, outcome guarantees, it-will-work claims, mobility assumptions and unrequested advice removed (keep 4 / polish 2 / rewrite 7; per-ack decisions in the JSON).
- **Privacy language:** absolute claims removed; accurate boundary copy shipped (daily privacyJa/shareBoundaryJa + privacy.processingNote).

## Current escalation state (MTF-2A.2 — canonical)

- **E-1 — RESOLVED for V1** by the frozen no-automatic-crisis-classification / no-automatic-resource-trigger policy (Founder decision 3.2, carried in the canonical `prohibitions`). Historical E-1 entries above are superseded.
- **E-2 — OPEN as a future ToU/legal implementation item (FD-3)**: the anti-screening boundary already SHIPS in canonical copy (`usageBoundaryJa` + interpretation limits); the Terms-of-Use clause is required at implementation.
- **Net current state:** this package carries **one unresolved legal follow-up (E-2/FD-3)** — not two unresolved product-policy decisions.

**Current outcome: PASS** — acks non-directive (v1.2), anti-screening shipped, V1 low-state policy in force.
