# Yorisou Result Payload Contract v1

Date: 2026-04-13
Scope: canonical output contract for the result system

## Purpose
This document defines the canonical result payload that all downstream systems must consume. It is read-only with respect to persona structure, naming lock, and dimension meaning.

## Canonical Result Object

The canonical result payload must include at minimum the following fields:
- `session_id`: string
- `user_id_or_anonymous_session_key`: string
- `result_version`: v1
- `scoring_version`: v1
- `persona_id`: P01-P31 enum
- `final_locked_label_jp`: string
- `final_locked_subtitle_jp`: string
- `working_name`: string
- `teaser_result`: object
- `share_card_result`: object
- `deep_report_stub`: object
- `core_dimension_signature`: list of `Dxx`
- `supporting_dimensions`: list of `Dxx`
- `neighboring_persona_risk_flags`: list of `Pxx`
- `hotspot_cluster_flag`: boolean or cluster id
- `confidence_or_distinction_signal`: number or enum
- `paywall_state`: object
- `deep_report_unlock_state`: object
- `share_card_state`: object
- `progression_state`: object
- `created_at`: ISO-8601 timestamp
- `updated_at`: ISO-8601 timestamp

## Subobjects

### persona_identity
- Purpose: Lock the persona identity and its structural meaning.
- Required fields: `persona_id`, `working_name`, `final_locked_label_jp`, `final_locked_subtitle_jp`, `core_dimension_signature`, `supporting_dimensions`, `neighboring_persona_risk_flags`, `hotspot_cluster_flag`
- Optional fields: `structural_summary`, `lock_reference`
- Downstream layers may read: `teaser_payload`, `share_card_payload`, `deep_report_payload`, `analytics_metadata`, `rendering_guardrails`
- Downstream layers may not override: `persona structure`, `dimension meaning`, `locked naming`

### teaser_payload
- Purpose: Provide the short result teaser for LIFF/mobile and lightweight sharing.
- Required fields: `teaser_result`, `teaser_state`
- Optional fields: `teaser_line_jp`, `teaser_line_en_logic_gloss`, `teaser_score`
- Downstream layers may read: `persona_identity`, `share_card_payload`, `rendering_guardrails`
- Downstream layers may not override: `persona structure`, `final_locked_label_jp`, `final_locked_subtitle_jp`

### share_card_payload
- Purpose: Provide the compressed shareable result output.
- Required fields: `share_card_result`, `share_card_state`
- Optional fields: `share_card_line_jp`, `share_card_line_en_logic_gloss`, `share_card_score`
- Downstream layers may read: `persona_identity`, `teaser_payload`, `rendering_guardrails`
- Downstream layers may not override: `locked naming`, `persona boundaries`, `dimension meaning`

### deep_report_payload
- Purpose: Provide unlockable premium report scaffold and state.
- Required fields: `deep_report_stub`, `deep_report_unlock_state`
- Optional fields: `deep_report_sections`, `unlock_reason`, `premium_state`
- Downstream layers may read: `persona_identity`, `teaser_payload`, `share_card_payload`, `progression_payload`, `rendering_guardrails`
- Downstream layers may not override: `persona structure`, `locked naming`, `dimension meanings`

### paywall_payload
- Purpose: Represent access gating for premium report content.
- Required fields: `paywall_state`
- Optional fields: `entitlement_state`, `price_state`, `unlock_offer_state`
- Downstream layers may read: `deep_report_payload`, `persona_identity`, `analytics_metadata`
- Downstream layers may not override: `result meaning`, `persona identity`, `locked naming`

### progression_payload
- Purpose: Track recurring companion / progression loop state.
- Required fields: `progression_state`
- Optional fields: `next_session_recommendation`, `repeat_sequence_state`, `retention_state`
- Downstream layers may read: `persona_identity`, `analytics_metadata`, `rendering_guardrails`
- Downstream layers may not override: `persona structure`, `scoring logic`, `locked naming`

### analytics_metadata
- Purpose: Capture non-user-facing analytics and audit data.
- Required fields: `session_id`, `result_version`, `scoring_version`, `created_at`, `updated_at`
- Optional fields: `variant_id`, `experiment_id`, `trace_id`, `device_class`
- Downstream layers may read: `all subobjects`
- Downstream layers may not override: `rendered payload meaning`, `persona structure`, `locked naming`

### rendering_guardrails
- Purpose: Prevent downstream consumers from mutating structure or labels.
- Required fields: `locked_source_reference`, `non_override_rules`
- Optional fields: `hotspot_warning_flags`, `subtitle_mandatory_flags`
- Downstream layers may read: `persona_identity`, `teaser_payload`, `share_card_payload`, `deep_report_payload`
- Downstream layers may not override: `persona structure`, `dimension meaning`, `locked naming`, `payload version`

## Downstream Consumer Rules

### LIFF/mobile result rendering
- Use: Render teaser/share outputs from the contract and respect hotspot subtitles.
- Read scope: `persona_identity`, `teaser_payload`, `share_card_payload`, `rendering_guardrails`
- Must not mutate persona structure, naming lock, or dimension meaning.

### website secondary result pages
- Use: Render secondary result explanations and paid prompts without changing labels.
- Read scope: `persona_identity`, `share_card_payload`, `deep_report_payload`, `paywall_payload`
- Must not mutate persona structure, naming lock, or dimension meaning.

### share-card generation
- Use: Create compressed share output from locked naming only.
- Read scope: `persona_identity`, `teaser_payload`, `share_card_payload`, `rendering_guardrails`
- Must not mutate persona structure, naming lock, or dimension meaning.

### deep-report unlock flow
- Use: Unlock and expand the premium scaffold without mutating structural meaning.
- Read scope: `persona_identity`, `deep_report_payload`, `paywall_payload`, `analytics_metadata`
- Must not mutate persona structure, naming lock, or dimension meaning.

### future payment logic
- Use: Manage entitlement and unlock state only.
- Read scope: `paywall_payload`, `deep_report_payload`, `analytics_metadata`
- Must not mutate persona structure, naming lock, or dimension meaning.

### future progression / companion loop
- Use: Use result state for recurring companion guidance and next-session suggestions.
- Read scope: `persona_identity`, `progression_payload`, `analytics_metadata`, `rendering_guardrails`
- Must not mutate persona structure, naming lock, or dimension meaning.

## Guardrails
- No old naming files may be used as live source.
- No candidate, review, or revision naming docs may be treated as live source.
- No frontend layer may invent alternate persona labels.
- No payment layer may create parallel result states.
- No share-card layer may diverge from locked naming.
- No deep-report layer may redefine persona boundaries.

## Output Contract
1. Canonical source-of-truth references: the canonical final naming lock, the canonical persona master, the locked 21-dimension backbone, and this payload contract.
2. Payload versioning rule: bump `result_version` and `scoring_version` only through a new explicit review batch.
3. Downstream usage rule: consumers may render and route the payload, but may not change the locked structural meaning.
4. Non-override rule: no downstream consumer may override persona structure, naming lock, or dimension semantics.
5. Migration rule: future payload versions must be introduced alongside a new contract file and a documented compatibility decision.

## Final Readout
This is the canonical result output source for downstream result rendering, sharing, deep-report unlock, payment gating, and progression logic.