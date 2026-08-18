// Platform tier — the canonical typed domain-event names, in ONE place.
//
// The grammar is `family.event.vN`. An event names one thing that happened in one module; there is
// deliberately no universal event (nothing like a global "intelligence updated" signal), because an
// event that means everything carries no contract at all.
//
// This is names + types only. There is no bus here: the modular monolith adopts these in-process,
// one seam at a time, in later implementation packages. Renames are one-file diffs against this
// list, guarded by test:platform-contracts — never ad-hoc local strings in a module.

/** Event-name grammar: `family.event.vN`. */
export type DomainEventName = `${string}.${string}.v${number}`;

/**
 * The canonical V1 event families (reference architecture §11) plus the intra-module lifecycle
 * events the contracts document declares. Order groups by family for the reader; the array is the
 * single source of truth for "does this event exist".
 */
export const DOMAIN_EVENTS_V1 = [
  // state.core
  "state.checkin_started.v1",
  "state.checkin_completed.v1",
  "state.snapshot_created.v1",
  "state.corrected.v1",
  "state.deleted.v1",

  // assessment.core
  "assessment.started.v1",
  "assessment.progressed.v1",
  "assessment.completed.v1",
  "assessment.abandoned.v1",
  "assessment.retaken.v1",

  // discovery.core
  "discovery.presented.v1",
  "discovery.started.v1",
  "discovery.completed.v1",
  "discovery.saved.v1",
  "discovery.dismissed.v1",

  // experience.core
  "experience.created.v1",
  "experience.action_recorded.v1",
  "experience.outcome_recorded.v1",
  "experience.updated.v1",
  "experience.deleted.v1",

  // reflection.core
  "reflection.started.v1",
  "reflection.created.v1",
  "reflection.corrected.v1",
  "reflection.dismissed.v1",
  "weekly_reflection.created.v1",

  // governed memory (Kernel)
  "memory.confirmed.v1",
  "memory.corrected.v1",
  "memory.deleted.v1",

  // public results and sharing
  "public_result.created.v1",
  "share.preview_created.v1",
  "share.created.v1",
  "share.opened.v1",

  // connection.core
  "connection.invited.v1",
  "connection.accepted.v1",

  // comparison.core
  "comparison.created.v1",

  // continuity.core
  "continuity.moment_created.v1",
  "pattern.candidate_created.v1",
  "pattern.feedback_received.v1",
  "return.reference_created.v1",

  // community.core
  "community.response_created.v1",
  "community.reaction_added.v1",

  // recommendation.core
  "recommendation.generated.v1",
  "recommendation.shown.v1",
  "recommendation.feedback.v1",
] as const;

/** A name from the canonical list — the only names modules may emit or consume. */
export type DomainEventNameV1 = (typeof DOMAIN_EVENTS_V1)[number];

/**
 * The minimal event envelope. Payloads are module-declared; the envelope stays small so an event
 * can cross a module boundary without carrying a module's private vocabulary with it. `subject`
 * holds owner scoping by OPAQUE id only — an envelope never carries emails, names, free text, or
 * any other personal value.
 */
export interface DomainEventEnvelope<
  TName extends DomainEventName = DomainEventNameV1,
  TPayload = unknown,
> {
  /** Canonical event name (`family.event.vN`). */
  name: TName;
  /** ISO-8601 occurrence time, assigned by the emitting module. */
  occurred_at: string;
  /** The emitting module (`<family>.core`) or `"kernel"`. */
  source_module: string;
  /** Owner scoping by opaque account id; null for events with no personal subject. */
  subject: { owner_id: string | null };
  /** Module-declared payload. Display-safe references only — never full source records. */
  payload: TPayload;
}
