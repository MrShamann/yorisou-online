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
| Employer screening misuse | **ESCALATION E-2 (recorded)** — any values instrument can be misused for screening. Mitigations in-package: results are current-state (unstable by design), no numeric scores exist to rank candidates, limits copy states unsuitability for judgment. A future terms-of-use clause against employment screening is recommended (Founder/legal item). |
| Compatibility certainty | PASS — no compatibility output exists; cross-method numeric comparison structurally prohibited |
| Permanent identity labeling | PASS — 「〜たい時期」 naming + current-state recognition lines + retest framing (変化は自然) |

## Escalation register (separate, not implemented here)

- **E-1** — sustained-low-state gentle-resources policy (daily-check-in): Founder decision; crisis-adjacent design requires its own reviewed package.
- **E-2** — anti-screening terms-of-use clause (values): Founder/legal follow-up.

## Outcome

**PASS with two recorded escalations (E-1, E-2)** — both are future policy decisions, not defects in the authored content.
