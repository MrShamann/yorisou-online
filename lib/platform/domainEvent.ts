// Platform tier — the ONE canonical way to construct a governed event envelope.
//
// A module that hand-assembles an envelope object reproduces the invariants by copy: the version
// must be parsed from the name, both timestamps must exist, every governed field must be present,
// and the name must actually be canonical. Each copy is a place for one of those to silently drift.
// This factory is where they live once.
//
// WHAT THIS IS NOT. Not a bus, not a dispatcher, not a subscriber registry, not persistence, not
// retry infrastructure. It builds a value and returns it — the caller decides, explicitly, what the
// event feeds. Adoption of an event seam stays a visible act at the mutation boundary, never a side
// effect of importing this file.
//
// Brand-free and dependency-free by the platform tier's own rules (guarded by
// test:platform-contracts): imports only siblings, touches no application code, names no product.
// Randomness (event_id) and time default to the runtime but are injectable, so tests can pin them
// without stubbing globals.

import { DOMAIN_EVENTS_V1, parseEventVersion } from "./events";
import type {
  DomainEventEnvelope,
  DomainEventNameV1,
  EventDataClass,
  EventProvenance,
} from "./events";

/** What a caller supplies. Everything the runtime can derive is optional and test-injectable. */
export interface DomainEventDraft<TName extends DomainEventNameV1, TPayload> {
  name: TName;
  /** The emitting module (`<family>.core`) or `"kernel"`. */
  source_module: string;
  /** The permission grant under which the emitting module was acting. */
  permission_context: string;
  provenance: EventProvenance;
  data_class: EventDataClass;
  /** Opaque owner/subject reference; null for events with no personal subject. NEVER raw identity. */
  subject_ref: string | null;
  /** Opaque actor reference where distinct from the subject; defaults to null. */
  actor_ref?: string | null;
  /** Workflow grouping; defaults to null — a parent workflow is declared, never invented. */
  correlation_id?: string | null;
  /** Parent event id; defaults to null — a causal parent is declared, never invented. */
  causation_id?: string | null;
  payload: TPayload;
  /** Test seams. Production callers omit these and get runtime uuid/now values. */
  event_id?: string;
  occurred_at?: string;
  recorded_at?: string;
}

/**
 * Build a complete governed envelope from a draft, enforcing the invariants that must not be
 * reproduced per call site: the name is canonical, `event_version` is parsed from the name (the
 * single semantic source of truth), both timestamps exist, and `recorded_at` never precedes
 * `occurred_at` when both are runtime-assigned.
 */
export function createDomainEvent<TName extends DomainEventNameV1, TPayload>(
  draft: DomainEventDraft<TName, TPayload>,
): DomainEventEnvelope<TName, TPayload> {
  if (!(DOMAIN_EVENTS_V1 as readonly string[]).includes(draft.name)) {
    throw new Error(`not a canonical domain event: ${draft.name}`);
  }
  const occurred_at = draft.occurred_at ?? new Date().toISOString();
  const recorded_at = draft.recorded_at ?? new Date().toISOString();
  return {
    event_id: draft.event_id ?? globalThis.crypto.randomUUID(),
    name: draft.name,
    event_version: parseEventVersion(draft.name),
    occurred_at,
    recorded_at: recorded_at >= occurred_at ? recorded_at : occurred_at,
    subject_ref: draft.subject_ref,
    actor_ref: draft.actor_ref ?? null,
    source_module: draft.source_module,
    correlation_id: draft.correlation_id ?? null,
    causation_id: draft.causation_id ?? null,
    data_class: draft.data_class,
    permission_context: draft.permission_context,
    payload: draft.payload,
    provenance: draft.provenance,
  };
}
