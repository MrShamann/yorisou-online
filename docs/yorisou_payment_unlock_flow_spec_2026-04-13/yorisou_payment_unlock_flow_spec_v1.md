# Yorisou Payment / Deep-Report Unlock Flow Spec v1

Date: 2026-04-13
Scope: canonical unlock-flow specification for result monetization

## Purpose
This document defines the provider-agnostic unlock flow for premium deep-report access. It is a state and payload contract only; it may not mutate persona structure, naming lock, or dimension meaning.

## Canonical Unlock States

### not_eligible
- Trigger condition: session or persona is not eligible for deep-report monetization.
- Required upstream payload fields: `persona_identity`, `deep_report_payload`, `paywall_payload`
- Required rendering behavior: Hide checkout entry; show free result only and a neutral explanation.
- CTA allowed: `back`, `continue`
- CTA forbidden: `checkout`, `unlock purchase`
- Analytics event points: `paywall_not_eligible`, `result_view`
- Failure / retry behavior: No retry required; user may continue in free mode.

### teaser_only
- Trigger condition: teaser is available but the payload is not yet at paywall entry or entitlement boundary.
- Required upstream payload fields: `persona_identity`, `teaser_payload`, `rendering_guardrails`
- Required rendering behavior: Show teaser and locked naming; no purchase prompt beyond a soft preview.
- CTA allowed: `continue`, `view result`
- CTA forbidden: `checkout`, `unlock now`
- Analytics event points: `teaser_view`
- Failure / retry behavior: Proceed to result_ready or wait for paywall_visible depending on product path.

### paywall_visible
- Trigger condition: deep report exists and the user is eligible to see a monetized unlock prompt.
- Required upstream payload fields: `persona_identity`, `deep_report_payload`, `paywall_payload`, `rendering_guardrails`
- Required rendering behavior: Show paywall prompt, price/entitlement area, and locked deep-report teaser only.
- CTA allowed: `checkout`, `back`, `later`
- CTA forbidden: `show premium content`, `mutate label`
- Analytics event points: `paywall_impression`
- Failure / retry behavior: Allow retry to checkout or return to result without changing persona state.

### checkout_initiated
- Trigger condition: user taps checkout from paywall_visible.
- Required upstream payload fields: `paywall_payload`, `persona_identity`, `analytics_metadata`
- Required rendering behavior: Show checkout handoff / pending state; keep result text read-only.
- CTA allowed: `cancel`, `retry checkout`
- CTA forbidden: `unlock grant`, `edit persona`
- Analytics event points: `checkout_start`
- Failure / retry behavior: Return to paywall_visible or checkout_pending after handoff outcome.

### checkout_pending
- Trigger condition: provider callback or client confirmation is pending.
- Required upstream payload fields: `paywall_payload`, `analytics_metadata`
- Required rendering behavior: Show pending status and preserve all locked text fields.
- CTA allowed: `wait`, `retry status`
- CTA forbidden: `claim success`, `open premium report`
- Analytics event points: `checkout_pending`
- Failure / retry behavior: Poll or re-check confirmation; no state mutation until confirmed.

### payment_succeeded
- Trigger condition: provider confirmation indicates a successful payment.
- Required upstream payload fields: `paywall_payload`, `analytics_metadata`, `deep_report_payload`
- Required rendering behavior: Show success confirmation and transition to unlock_granted only after server-side validation.
- CTA allowed: `continue`, `view unlocked report`
- CTA forbidden: `edit receipt`, `reselect persona`
- Analytics event points: `payment_success_callback`
- Failure / retry behavior: If validation fails, fall back to unlock_failed; do not show premium body yet.

### unlock_granted
- Trigger condition: server-side validation confirms entitlement and unlock permission.
- Required upstream payload fields: `deep_report_unlock_state`, `deep_report_payload`, `paywall_payload`, `persona_identity`
- Required rendering behavior: Render unlocked deep-report content and preserve locked naming and dimension semantics.
- CTA allowed: `open report`, `save`, `return`
- CTA forbidden: `mutate label`, `re-score persona`
- Analytics event points: `deep_report_unlock_granted`, `deep_report_open`
- Failure / retry behavior: If report fields are missing, show fallback locked state and retry validation.

### unlock_failed
- Trigger condition: payment or entitlement validation fails.
- Required upstream payload fields: `paywall_payload`, `deep_report_unlock_state`, `analytics_metadata`
- Required rendering behavior: Show failure state with retry or support path; keep deep report locked.
- CTA allowed: `retry`, `restore later`, `back`
- CTA forbidden: `show premium content`, `claim unlock`
- Analytics event points: `deep_report_unlock_failed`
- Failure / retry behavior: Allow retry or restore path without mutating persona identity.

### deep_report_available
- Trigger condition: unlock_granted is confirmed and report content is present.
- Required upstream payload fields: `deep_report_payload`, `deep_report_unlock_state`, `persona_identity`
- Required rendering behavior: Render premium deep report sections in read-only form.
- CTA allowed: `scroll`, `save`, `return`
- CTA forbidden: `alter report text`, `choose another persona`
- Analytics event points: `deep_report_available`, `deep_report_view`
- Failure / retry behavior: If content is absent, fall back to unlock_granted/locked state with retry.

### restore_purchase_available if applicable later
- Trigger condition: future restore flow is supported by the product and entitlement record exists.
- Required upstream payload fields: `paywall_payload`, `analytics_metadata`
- Required rendering behavior: Show restore option only when later implementation supports it.
- CTA allowed: `restore`, `back`
- CTA forbidden: `purchase new entitlement if restore is enough`
- Analytics event points: `restore_available`
- Failure / retry behavior: If unsupported, hide restore and fall back to paywall_visible.

### version_guard_blocked
- Trigger condition: payload or unlock metadata version does not match the current contract.
- Required upstream payload fields: `result_version`, `scoring_version`, `paywall_payload`
- Required rendering behavior: Block unlock and ask for reload or refresh.
- CTA allowed: `reload`, `back`
- CTA forbidden: `checkout`, `unlock`
- Analytics event points: `unlock_version_guard_blocked`
- Failure / retry behavior: Reload the current contract before retrying.

### invalid_session_blocked
- Trigger condition: session or payload integrity is invalid or missing.
- Required upstream payload fields: `session_id`, `user_id_or_anonymous_session_key`
- Required rendering behavior: Block unlock flow and show safe recovery only.
- CTA allowed: `retry session`, `restart`
- CTA forbidden: `checkout`, `unlock`
- Analytics event points: `unlock_invalid_session_blocked`
- Failure / retry behavior: Restart session flow; do not attempt payment without a valid session.

## Free vs Paid Content Boundary
- Free teaser result mode: `locked label`, `locked subtitle`, `teaser result`, `minimal share hint`
- Paid deep report only: `deep report sections`, `expanded interpretation`, `paid value explanation`, `premium progression hooks`
- Must never leak before unlock: `deep report body`, `premium expansion text`, `restore logic internals`, `alternate persona labels`
- Paywall may preview: `locked label`, `subtitle`, `brief report hook`, `unlock value statement`
- Must remain concealed until unlock granted: `deep report sections`, `premium interpretive paragraphs`, `progression premium hooks`

## Canonical Unlock Flow

### result_ready
- Source state: LIFF/result rendering contract result_ready
- Action: user lands on result screen
- Destination state: teaser_visible / paywall_visible depending on entitlement
- Required payload mutations allowed: `none except state pointers`
- Forbidden mutations: `persona_id`, `final_locked_label_jp`, `final_locked_subtitle_jp`, `dimension meaning`
- Read-only dependencies: `canonical final naming lock`, `result payload contract`, `LIFF/result rendering contract`

### teaser_visible
- Source state: teaser_only or result_ready
- Action: show teaser and short result summary
- Destination state: paywall_visible or share_card_ready
- Required payload mutations allowed: `teaser_view state flag only`
- Forbidden mutations: `locked naming`, `teaser source text`
- Read-only dependencies: `teaser result layer`, `share-card logic layer`

### paywall_visible
- Source state: paywall_visible
- Action: show unlock prompt
- Destination state: checkout_initiated
- Required payload mutations allowed: `paywall_state pointer`
- Forbidden mutations: `persona structure`, `subtitle`
- Read-only dependencies: `result payload contract`, `rendering contract`

### checkout_initiated
- Source state: paywall_visible
- Action: start checkout handoff
- Destination state: checkout_pending
- Required payload mutations allowed: `checkout trace id`, `pending flag`
- Forbidden mutations: `result object rewrite`
- Read-only dependencies: `paywall_payload`, `analytics_metadata`

### payment_result_received
- Source state: checkout_pending
- Action: receive provider callback / confirmation
- Destination state: payment_succeeded or unlock_failed
- Required payload mutations allowed: `payment status fields only`
- Forbidden mutations: `persona_id`, `label`, `subtitle`
- Read-only dependencies: `paywall_payload`, `analytics_metadata`

### unlock_state_updated
- Source state: payment_succeeded
- Action: server validation updates unlock state
- Destination state: unlock_granted or unlock_failed
- Required payload mutations allowed: `deep_report_unlock_state`, `paywall_state`
- Forbidden mutations: `deep report text`, `dimension meaning`
- Read-only dependencies: `deep-report scaffold`, `result payload contract`

### deep_report_unlocked_rendering
- Source state: unlock_granted
- Action: render premium content
- Destination state: deep_report_available
- Required payload mutations allowed: `view state flags only`
- Forbidden mutations: `premium copy rewrite`, `alternate persona labels`
- Read-only dependencies: `deep-report scaffold`, `final naming lock`

### later_revisit_restore_path
- Source state: future restore flow
- Action: restore purchase or verify prior unlock
- Destination state: restore_purchase_available or unlock_granted
- Required payload mutations allowed: `restore state only`
- Forbidden mutations: `new alternate result object`
- Read-only dependencies: `paywall_payload`, `analytics_metadata`

## Non-Override Rules
- No payment flow may mutate persona_id, label, subtitle, teaser text, or dimension meaning.
- Payment flow may only change unlock-related state fields.
- No website surface may become the primary unlock path unless explicitly approved later.
- No downstream consumer may fork the result payload contract.
- No payment state may create parallel alternate result objects.

## Future Payment-Integration Boundary
- Provider-agnostic checkout interface assumptions: the contract assumes a checkout start, an in-flight pending state, and a confirm/callback state without naming the provider.
- Callback / confirmation expectations: confirmation must be verifiable server-side before unlock_granted is set.
- Idempotency expectations: repeated callbacks or retries must not double-unlock or duplicate entitlements.
- Restore / retry expectations: the system must support retrying checkout or restoring a prior entitlement when later implementation adds it.
- Future binding to LIFF/mobile flow: LIFF/mobile remains the primary unlock entry; the website may only support secondary trust and explanation unless later approved.
- What must be decided later in implementation, not in this contract: payment provider, pricing, tax handling, receipt format, and actual wallet or card integrations.

## Output Contract
1. Canonical source references: canonical final naming lock, result payload contract, LIFF/result rendering contract, canonical persona master, locked 21-dimension backbone, teaser result layer, share-card logic layer, and deep-report scaffold.
2. Unlock-state transition summary: not_eligible -> teaser_only -> paywall_visible -> checkout_initiated -> checkout_pending -> payment_succeeded -> unlock_granted -> deep_report_available, with unlock_failed, version_guard_blocked, invalid_session_blocked, and later restore path as guards or branches.
3. Free/paid boundary summary: teaser and locked summary remain free; deep-report body and premium expansion remain paid until unlock_granted.
4. Read-only protection rules: no payment state may alter persona identity, locked naming, or dimension semantics.
5. Future implementation handoff note: provider selection and checkout mechanics are intentionally deferred to implementation; this spec only defines the state and payload boundary.

## Final Readout
This is the canonical unlock-flow source for premium deep-report monetization logic.