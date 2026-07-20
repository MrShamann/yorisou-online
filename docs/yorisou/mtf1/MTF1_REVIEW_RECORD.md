# MTF-1 — Structured Review Record (§7)

Review executed against the completed package on branch `feat/mtf-1-test-universe-contract`. CPV1 on `main` was NOT modified.

| Dimension | Finding |
|---|---|
| Product coherence | PASS — Core 10 spans deep/fast/relationship/pair/name/daily/preference/visual; universe, queue, and adapter map reference the same canonical IDs; the longitudinal gap (daily-check-in) is rank-1 in the production queue. |
| Originality | PASS — Forge 19 steps + absolute prohibitions cover every rebuild candidate; R01/R04 successors constrained to first-party structural patterns (D-3.2/3.3); naming-collision rule covers all five existing name layers. |
| Copyright/trademark | PASS — MBTI pinned to import/handoff (validated); IPIP requires source verification before use; no deck/dictionary/corpus copying anywhere; tarot/astrology gated on licences. |
| Traditional-source risk | PASS — every F-family method carries the full unresolved-fields chain (source text, school, calc engine, translation, commentary, permission, attribution, claim boundary, sensitivity, retention); none may pass Forge step 3 unresolved. |
| Clinical/diagnostic risk | PASS — non-clinical identity restated in the standard (prohibitions) + localization (current-state language) + engine (limits line mandatory); recovery-rest explicitly flagged for health-adjacent trust review before content. |
| Privacy & two-person consent | PASS with open items — P1–P5 classes assigned to all 31; engine requires both-party explicit consent + data minimization + withdrawal for P3; **ND-2 (birth-data retention) and ND-3 (name retention) are required Founder policies before any P4/P2-retention method advances**. |
| Japanese localization | PASS — dedicated standard; count-honesty rule encodes T4; screenshot-safety and share/private split encoded in the engine result object. |
| Dynamic-engine feasibility | PASS — every format/scoring class maps to an existing pattern or a named new capability; adapter map gives a concrete build order; contract embeds fixes for known defects (T5→confidencePolicy, T9→per-method progress keys, T12→bankContentHash). |
| Web/LINE/iOS/Android compatibility | PASS — channel-neutral core; channels never own logic; offline-deterministic scoring; secure identity handoff; version pinning per session. |
| **CPV1 contract compatibility** | PASS with two DOCUMENTED vocabulary findings (below). No CPV1 semantics overwritten; activation remains CPV1-evidence-gated everywhere. |
| Scope control | PASS — zero runtime/app/migration files touched; deliverables are 10 docs + 1 non-runtime validator; prohibited-work list (§8) fully honored. |

## CPV1 comparison findings (documented, NOT patched — per §7)

**F-1 · MethodFamily extension needed at registration time.** CPV1 `MethodFamily` (`lib/cpv1/methods.ts:16-21`) has exactly five values (`yorisou_state`, `yorisou_original_assessment`, `chinese_traditional`, `western_symbolic`, `psychology_preference`). The frozen universe uses two additional families: `relationship_compatibility` (relationship-pair-check, name-pair-impression) and `japanese_cultural_symbolic` (s01-omikuji). Registering these methods will require an **additive** extension of the CPV1 `MethodFamily` union (and the DB registry `family` column is free-text, so schema is unaffected). This is an extension, not a conflict; it is left to the registration package and explicitly NOT patched in MTF-1.

**F-2 · `evidence_class` name collision across layers.** CPV1 `EvidenceClass` (`lib/cpv1/understanding.ts:36`) is an **observation-level** vocabulary (`user_declared | method_derived | behavioral | inferred | imported`). MTF-1's universe `evidence_class` is a **method-level** classification (`yorisou_original_reflection`, `traditional_symbolic_entertainment`, …). These are different axes that must not be merged: at implementation time the method-level field should carry a distinct name (recommended: `methodEvidenceClass`) so the observation-level CPV1 type remains untouched. The engine contract already composes correctly (its `imported_result` mode maps to CPV1 observation class `imported`/`user_declared`); this finding pins the naming so no future package conflates them.

Alignment confirmed elsewhere: activation vocabulary reuses `METHOD_ACTIVATION_STATES` verbatim (with `planned_unbuilt` documented as a pre-registration state mapping to `gated`); consent-by-purpose matches CPV1's independent-boolean purposes (`lib/cpv1/consent.ts` §9); audit events reuse the reason-coded no-free-text rule; `sensitiveInputs` remains the canonical registry-level sensitivity source, with P1–P5 as a summarizing product vocabulary.
