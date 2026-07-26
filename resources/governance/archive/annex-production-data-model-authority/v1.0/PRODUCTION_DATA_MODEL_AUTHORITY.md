# YORISOU Production Data Model Authority (Binding Annex) v1.0

**Status:** Approved
**Pack:** YORISOU Governance Pack v0.4.0 · **Annex of:** `Yorisou_Personal_Archive_and_Memory_Governance_v1.0.md` · **Approver:** Edward

This annex is binding effective governance. If it conflicts with a v0.4.0 primary governance
document, the primary document outranks this annex. This annex is a design authority only: it
authorizes no migrations and no implementation beyond what a Founder-authorized package permits;
Packages B–G are not authorized by this annex.

## Conventions

Common column conventions: `id`, `user_id`, `created_at`, `updated_at`; ALL mutations emit an
`audit_event`; ALL user-facing rows carry user-visible state. Retention values are proposals
pending Edward's retention approval.

## The 18-entity production data model

| Entity | Purpose | Minimum fields (beyond common) | Retention | Access | Mutation authority | User controls | Deletion behavior |
|---|---|---|---|---|---|---|---|
| user | identity root | email (verified), status, locale | account life + 30d | self, system | self/system | account deletion | full cascade per entity rules |
| consent | explicit consent records | kind, version, granted_at, revoked_at, surface | account life (legal trace) | self, system | self only | view/revoke | tombstoned (legal trace, content-free) |
| memory_candidate | pre-acceptance capture | text, meaning, source=user_entered, expires_at | 30d unconfirmed → auto-delete | self | self only | confirm/edit/discard | hard delete |
| confirmed_memory | accepted memory | text, meaning, state(enum: confirmed/suppressed/conflict), confirmed_at | until user deletes | self; system via permission check ONLY | self only | correct/suppress/delete | hard delete + deletion_receipt |
| use_permission | purpose-scoped overlay | memory_id, purpose(enum: reflection…), state(granted/revoked), decided_at | with memory | self, permission-checker | self only | grant/revoke | dies with memory |
| provenance | origin trace | memory_id, source, captured_surface, capture_tick | with memory | self, incident review (logged) | system (append-only) | visible "why appeared" | dies with memory |
| suppression | display stop record | memory_id, active, reason=user | with memory | self | self | activate/lift | dies with memory |
| revocation | permission stop record | permission_id, revoked_at | with memory | self | self | (is the control) | dies with memory |
| deletion_receipt | proof of deletion | memory_ref_hash (content-free), deleted_at, scope | 12mo | self, audit | system | view receipt | content-free by design |
| trust_incident | trust failure record | type(enum incl. deleted_memory_resurfacing), critical, resolved, user_visible | 12mo after resolution | self (own), Founder queue (pseudonymized) | system + user report | view/respond | pseudonymized after account deletion |
| repair_action | repair trace | incident_id, action, outcome | with incident | self, queue | system+user | participate | with incident |
| limited_memory_mode | protective state | active, entered_at, cause_incident_id | state life + 12mo trace | self, system gate | system (auto per rules) + user exit-eligible per governance | visible banner + status | trace pseudonymized |
| permanent_restriction | terminal protective state | entered_at, cause | account life | self, system gate | system per rules; reversal = Founder review only | visible status | with account |
| reflection | reflection session record | referenced_memory_id (nullable), choice(enum 4), at | 12mo | self | system+user | visible history | hard delete w/ memory cascade |
| recommendation | governed recommendation instance | source_graph_ref, shown_at, permission_check_ref | 6mo | self | system | hide/feedback | hard delete |
| companion_state | relationship condition | operating_condition(enum 5), interaction_mode, familiarity_fields | account life | self, system | system per state machine | visible condition | with account |
| audit_event | immutable ops trace | actor, action, entity_ref, reason, at | 24mo | Founder (logged), incident review | system (append-only) | — (system record) | pseudonymized at account deletion |
| founder_review_queue_item | evidence-derived queue | category, severity, source_ref (pseudonymized), status, decision | 12mo after closure | Founder | system-derived; Founder resolves | — | pseudonymized |

## Cross-cutting rules

Permission checks are a single shared service (one code path — mirrors the validated
`memoryEligibleForReflection` discipline); the resurfacing check runs at EVERY memory read.
Hard rule: no existing user data is ever reinterpreted as memory or consent.
