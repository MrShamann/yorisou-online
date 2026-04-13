# Yorisou LIFF / Result Rendering Contract v1

Date: 2026-04-13
Scope: canonical rendering contract for all result-facing surfaces

## Purpose
This document defines how the canonical result payload is rendered on LIFF/mobile and on the secondary website result surface. It is a rendering contract only; it may not mutate persona structure, naming lock, or dimension meaning.

## Result Rendering Surfaces

### LIFF/mobile primary result screen
- Purpose: Show the main result state immediately after completion.
- Required payload inputs: `persona_identity`, `teaser_payload`, `share_card_payload`, `rendering_guardrails`, `analytics_metadata`
- Optional payload inputs: `deep_report_payload`, `paywall_payload`, `progression_payload`
- Read-only fields: `persona_id`, `working_name`, `final_locked_label_jp`, `final_locked_subtitle_jp`, `core_dimension_signature`, `supporting_dimensions`
- Forbidden overrides: `persona labels`, `subtitle text`, `dimension meaning`, `teaser source text`, `share-card source text`
- UI state dependencies: `result_ready`, `deep_report_locked or deep_report_unlocked`, `share_card_ready`
- Fallback behavior: If teaser/share data is missing, show locked label + subtitle and a minimal recovery prompt; do not invent text.

### LIFF/mobile teaser result view
- Purpose: Show a compact teaser for quick recognition and lightweight sharing.
- Required payload inputs: `persona_identity`, `teaser_payload`, `rendering_guardrails`
- Optional payload inputs: `share_card_payload`
- Read-only fields: `final_locked_label_jp`, `final_locked_subtitle_jp`, `teaser_result`
- Forbidden overrides: `teaser line text`, `persona structure`, `alternate labels`
- UI state dependencies: `teaser_only or result_ready`
- Fallback behavior: If teaser payload is absent, show the locked label and subtitle only, with no substitute copy generation.

### LIFF/mobile share-card entry state
- Purpose: Prepare share-card entry and handoff to the share-card logic layer.
- Required payload inputs: `persona_identity`, `share_card_payload`, `teaser_payload`, `rendering_guardrails`
- Optional payload inputs: `analytics_metadata`
- Read-only fields: `share_card_result`, `share_card_state`, `final_locked_label_jp`, `final_locked_subtitle_jp`
- Forbidden overrides: `share-card line text`, `locked naming`, `hotspot subtitle rules`
- UI state dependencies: `share_card_ready`, `result_ready`
- Fallback behavior: If share-card payload is absent, disable sharing and keep teaser visible; do not synthesize share text.

### LIFF/mobile deep-report locked state
- Purpose: Show that premium deep-report content exists but is not yet unlocked.
- Required payload inputs: `persona_identity`, `deep_report_payload`, `paywall_payload`, `rendering_guardrails`
- Optional payload inputs: `progression_payload`, `analytics_metadata`
- Read-only fields: `deep_report_stub`, `deep_report_unlock_state`, `final_locked_label_jp`
- Forbidden overrides: `deep-report body text`, `paywall state`, `persona labels`
- UI state dependencies: `deep_report_locked`
- Fallback behavior: If unlock metadata is missing, render the locked state with a neutral paywall prompt and no deep-report content.

### LIFF/mobile deep-report unlocked state
- Purpose: Render premium deep-report content after valid unlock.
- Required payload inputs: `persona_identity`, `deep_report_payload`, `paywall_payload`, `rendering_guardrails`
- Optional payload inputs: `progression_payload`, `analytics_metadata`
- Read-only fields: `deep_report_sections`, `deep_report_stub`, `final_locked_label_jp`, `final_locked_subtitle_jp`
- Forbidden overrides: `persona boundaries`, `locked naming`, `dimension meaning`
- UI state dependencies: `deep_report_unlocked`
- Fallback behavior: If unlocked content is missing, fall back to locked state rather than inventing report prose.

### website secondary result explanation page
- Purpose: Provide trust, explanation, SEO, and secondary result framing only.
- Required payload inputs: `persona_identity`, `share_card_payload`, `deep_report_payload`, `paywall_payload`, `rendering_guardrails`
- Optional payload inputs: `teaser_payload`, `analytics_metadata`, `progression_payload`
- Read-only fields: `final_locked_label_jp`, `final_locked_subtitle_jp`, `working_name`, `teaser_result`, `share_card_result`
- Forbidden overrides: `primary product role`, `alternate labels`, `dimension semantics`, `result lock`
- UI state dependencies: `result_ready`, `deep_report_locked or deep_report_unlocked`
- Fallback behavior: If rich payload fields are absent, show a minimal explanation page with locked label, subtitle, and static trust copy only.

## Rendering State Model

### loading
- Trigger condition: payload fetch in progress or initial render pending.
- Required visible elements: `skeleton UI`, `brand anchor`, `loading indicator`
- Forbidden elements: `persona label guesses`, `result text guesses`, `share CTA`
- Action buttons allowed: `cancel`, `retry`
- Action buttons forbidden: `share`, `purchase`, `unlock`

### result_ready
- Trigger condition: persona_identity and at least teaser_payload are available.
- Required visible elements: `locked label`, `subtitle or teaser`, `share CTA`, `deep-report CTA placeholder`
- Forbidden elements: `alternate persona names`, `mutated subtitle`
- Action buttons allowed: `share`, `open deep-report`, `continue`
- Action buttons forbidden: `edit persona`, `swap label`

### teaser_only
- Trigger condition: teaser_payload is available but share/deep-report payload is incomplete.
- Required visible elements: `locked label`, `teaser text`, `minimal share hint`
- Forbidden elements: `deep-report prose`, `full share-card copy`
- Action buttons allowed: `back`, `request full result`
- Action buttons forbidden: `unlock deep report`, `show premium body`

### share_card_ready
- Trigger condition: share_card_payload is available and rendering_guardrails allow share export.
- Required visible elements: `share preview`, `copy/share CTA`, `locked label`
- Forbidden elements: `editable share text`, `alternate labels`
- Action buttons allowed: `copy`, `share`, `close`
- Action buttons forbidden: `revise label`, `mutate subtitle`

### deep_report_locked
- Trigger condition: deep_report_payload exists but unlock state is locked.
- Required visible elements: `locked report header`, `unlock teaser`, `paywall CTA`
- Forbidden elements: `premium sections`, `fake report preview`
- Action buttons allowed: `unlock prompt`, `return`, `share`
- Action buttons forbidden: `show premium body without entitlement`

### deep_report_unlocked
- Trigger condition: deep_report_unlock_state permits full report render.
- Required visible elements: `premium sections`, `locked label`, `subtitle`, `progression CTA placeholder`
- Forbidden elements: `paywall gate over premium content`, `alternate persona names`
- Action buttons allowed: `scroll`, `save`, `return`
- Action buttons forbidden: `relabel persona`, `re-score persona`

### invalid_or_missing_payload
- Trigger condition: required payload fields are missing or malformed.
- Required visible elements: `error state`, `safe retry prompt`, `brand anchor`
- Forbidden elements: `invented result text`, `unlock CTA`
- Action buttons allowed: `retry`, `back to start`
- Action buttons forbidden: `share`, `purchase`

### version_mismatch_guard
- Trigger condition: result_version or scoring_version does not match the expected contract.
- Required visible elements: `version mismatch warning`, `reload prompt`
- Forbidden elements: `stale payload render`, `premium unlock`
- Action buttons allowed: `reload`, `return to start`
- Action buttons forbidden: `continue with stale state`

### anonymous_session_mode
- Trigger condition: no bound user account is present.
- Required visible elements: `session continuity note`, `result screen`
- Forbidden elements: `account management UI`
- Action buttons allowed: `share`, `continue`, `upgrade later`
- Action buttons forbidden: `require login to see result`

### logged_in_bound_user_mode if applicable later
- Trigger condition: future account binding is available and verified.
- Required visible elements: `bound user indicator`, `result screen`
- Forbidden elements: `mutated persona text`, `alternate naming`
- Action buttons allowed: `share`, `unlock`, `progress`
- Action buttons forbidden: `override canonical result`

## LIFF / Mobile Primary Result Screen Field Contract
- Result label display rule: Display final_locked_label_jp exactly as locked; do not paraphrase.
- Subtitle display rule: Display final_locked_subtitle_jp exactly as locked; hotspot subtitles are mandatory when present.
- Teaser text display rule: Use teaser_payload text only if available; otherwise omit teaser copy rather than inventing it.
- Dimension signature display rule or concealment rule: Show dimension signatures only when designed for an internal or explanatory surface; conceal by default on consumer result screens.
- Share-card CTA rule: Show share CTA only when share_card_state is ready and share_card_payload is present.
- Deep-report unlock CTA rule: Show unlock CTA only when paywall_state and deep_report_unlock_state permit it.
- Next-action / progression CTA placeholder rule: Show a progression CTA placeholder if progression_state exists; do not simulate progression logic in the UI layer.
- Analytics emission points: `screen_view`, `teaser_view`, `share_cta_click`, `deep_report_open`, `deep_report_unlock_attempt`, `fallback_error`
- Guardrails: Prevent alternate persona labels, subtitle mutation, and any text derived from non-locked naming sources.

## Website Secondary Result Page Rules
- May show: `locked label`, `locked subtitle`, `share-card summary`, `deep-report unlock prompt`, `trust copy`, `SEO-friendly explanation copy`
- Must not pretend to be: `primary product surface`, `result authoring tool`, `score editor`
- Must stay consistent with liff mobile: `persona labels`, `subtitle text`, `share-card and deep-report meanings`
- Can be expanded for trust explanation: `how results are structured`, `why the product is line-first`, `what deep report means`
- Must remain read only against locked sources: `persona structure`, `naming lock`, `dimension semantics`

## Non-Override Rules
- No rendering surface may invent alternate labels.
- No rendering surface may override locked subtitle text.
- No rendering surface may alter teaser, share-card, or deep-report source text without a new approved upstream document.
- No website page may become the primary product surface.
- No frontend contract may fork the result payload contract.

## Output Contract
1. Canonical source references: canonical final naming lock, result payload contract, canonical persona master, locked 21-dimension backbone, teaser result layer, share-card logic layer, and deep-report scaffold.
2. Rendering precedence rules: canonical locked label and subtitle first; teaser/share/deep-report content only when payload and state allow it; fallback to safe minimal readout rather than invented copy.
3. State-transition summary: loading -> result_ready -> teaser_only/share_card_ready/deep_report_locked/deep_report_unlocked, with invalid/mismatch guards available at any point.
4. Read-only field protection rules: label, subtitle, persona ID, and dimension meaning are read-only across all surfaces.
5. Future handoff note for payment / unlock implementation: payment may only toggle unlock state and entitlement, never persona structure or naming.

## Final Readout
This is the canonical rendering source for LIFF/mobile result screens and the secondary website result surface.