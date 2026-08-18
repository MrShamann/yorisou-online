// Platform tier — the canonical typed domain-event names and the governed event envelope, in ONE
// place.
//
// NAMING. The grammar is `family.event.vN` — the latest architecture decision, which supersedes
// the older `domain.object.action` naming examples in earlier governance text for this
// architecture. An event names one thing that happened in one module; there is deliberately no
// universal event (nothing like a global "intelligence updated" signal), because an event that
// means everything carries no contract at all.
//
// ENVELOPE. The envelope carries every field the active v0.7.0 API/Event Architecture requires a
// governed event to support: identity, both timestamps, opaque subject/actor references,
// correlation and causation, data classification, permission context, and provenance. It is
// deliberately complete NOW, before the first seam is adopted — retrofitting `event_id` or
// `provenance` after events exist is a real contract migration; declaring them first is free.
//
// STILL NAMES + TYPES ONLY. There is no bus, no queue, no table, no retry infrastructure here:
// the modular monolith adopts these in-process, one seam at a time, in later implementation
// packages. `event_id` existing in the contract is what makes later idempotency and duplicate
// protection possible without reshaping anything. Renames are one-file diffs against this list,
// guarded by test:platform-contracts — never ad-hoc local strings in a module.

/** Event-name grammar: `family.event.vN`. */
export type DomainEventName = `${string}.${string}.v${number}`;

/**
 * The single semantic source of truth for an event's version is its NAME. The envelope's
 * `event_version` field MUST equal the number parsed from the trailing `.vN`; this parser is the
 * one canonical reading of it (a pure function — not runtime infrastructure), so no consumer ever
 * re-derives the relationship differently.
 */
export function parseEventVersion(name: DomainEventName): number {
  const match = /\.v(\d+)$/.exec(name);
  if (!match) throw new Error(`event name does not end in .vN: ${name}`);
  return Number(match[1]);
}

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
 * Retention/meaning class of an event, per the governed event architecture: operational events
 * and durable life-history events are different classes, and a technical event must never
 * silently become part of a person's life timeline because the class was ambiguous.
 */
export type EventDataClass = "operational" | "life_history";

/** How the event came to exist. Extending this vocabulary is a contract change, not a local act. */
export type EventProvenance = "user_action" | "module_process" | "agent_action" | "kernel_process";

/**
 * The governed event envelope. PRIVACY-MINIMAL BY CONSTRUCTION: `subject_ref` and `actor_ref` are
 * OPAQUE references only — never an email, a human name, raw free text, assessment raw answers, a
 * private reflection body, or a durable-memory payload dump. Payloads carry display-safe
 * references, never full source records (the projection rule applies to events too).
 */
export interface DomainEventEnvelope<
  TName extends DomainEventName = DomainEventNameV1,
  TPayload = unknown,
> {
  /** Unique id of this event occurrence, assigned once at emission — the idempotency anchor. */
  event_id: string;
  /** Canonical event name (`family.event.vN`) — the event_type, and the semantic source of truth. */
  name: TName;
  /** MUST equal `parseEventVersion(name)`. Present so consumers never parse ad hoc. */
  event_version: number;
  /** ISO-8601 time the fact occurred, assigned by the emitting module. */
  occurred_at: string;
  /** ISO-8601 time the envelope was recorded by the runtime (≥ occurred_at under retries). */
  recorded_at: string;
  /** Opaque owner/subject reference; null for events with no personal subject. */
  subject_ref: string | null;
  /** Opaque reference to who/what caused the event, where distinct from the subject; else null. */
  actor_ref: string | null;
  /** The emitting module (`<family>.core`) or `"kernel"`. */
  source_module: string;
  /** Groups envelopes belonging to one workflow; null when no parent workflow exists. */
  correlation_id: string | null;
  /** The event_id this event was a direct consequence of; null at a workflow's origin. */
  causation_id: string | null;
  /** Retention/meaning class — declared, never inferred (see EventDataClass). */
  data_class: EventDataClass;
  /** The permission grant under which the emitting module was acting (e.g. "write:own_state"). */
  permission_context: string;
  /** Module-declared payload. Display-safe references only — never full source records. */
  payload: TPayload;
  /** How the event came to exist (see EventProvenance). */
  provenance: EventProvenance;
}

/**
 * Every envelope key, as data, for the guard test — the two compile-time checks keep it exact in
 * both directions, so the governed-envelope guarantee cannot silently narrow.
 */
export const DOMAIN_EVENT_ENVELOPE_FIELDS = [
  "event_id",
  "name",
  "event_version",
  "occurred_at",
  "recorded_at",
  "subject_ref",
  "actor_ref",
  "source_module",
  "correlation_id",
  "causation_id",
  "data_class",
  "permission_context",
  "payload",
  "provenance",
] as const satisfies readonly (keyof DomainEventEnvelope)[];

type MissingFromEnvelopeList = Exclude<keyof DomainEventEnvelope, (typeof DOMAIN_EVENT_ENVELOPE_FIELDS)[number]>;
export const DOMAIN_EVENT_ENVELOPE_FIELDS_EXHAUSTIVE: MissingFromEnvelopeList extends never ? true : never = true;
