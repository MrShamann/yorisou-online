import "server-only";

// ARCH-P1 — the first real typed-event seam: a successfully persisted, authenticated Today
// check-in becomes the canonical `state.checkin_completed.v1` governed event, and that event is
// what produces the existing asynchronous audit side effect.
//
// WHY AN ADAPTER, AND WHY HERE. The dependency direction is a security property of the
// architecture: server/application code imports the platform contract, never the reverse. So the
// envelope is built by the brand-free platform factory, and the translation to the Life OS audit
// vocabulary (`yorisou.life.state.created`) lives HERE, on the server side, where product names are
// allowed. `lib/platform/` never learns what a Life OS is.
//
// SEMANTIC ELIGIBILITY IS THE BUILDER'S JOB. `/api/life/state` persists records from every allowed
// `CurrentStateSource`, but `state.checkin_completed.v1` means one thing: the Today check-in
// completed and its record is durably persisted. The builder returns null for every other source,
// so a caller cannot mislabel arbitrary state creation as a check-in — the route does not decide
// this, the contract does.
//
// FAILURE SEMANTICS ARE INHERITED, NOT REDEFINED. Delivery awaits the EXISTING auditLifeOs(),
// whose asynchronous class swallows sink failures (and counts them in ops). A persisted check-in
// therefore never becomes a failed request because the audit store was unavailable — exactly the
// behavior the direct call had. This adapter changes the STRUCTURE that produces the audit input,
// not the outcome the person sees.

import { createHash } from "crypto";

import { createDomainEvent } from "@/lib/platform/domainEvent";
import type { DomainEventEnvelope } from "@/lib/platform/events";
import { auditLifeOs } from "@/lib/server/lifeOs/audit";
import type { CurrentStateSource } from "@/lib/life-os/contract";

/**
 * Privacy-minimal by construction: a reference, the bounded source enum, and one count. Never the
 * tags themselves, never mood/energy/situation values, never free text, never the record.
 */
export interface StateCheckinCompletedPayload {
  /** Opaque reference to the persisted current-state record. */
  state_record_ref: string;
  /** The bounded source that makes this a check-in completion — fixed by the builder's gate. */
  source: "today_check_in";
  /** Count metadata only. */
  tag_count: number;
}

export type StateCheckinCompletedEvent = DomainEventEnvelope<
  "state.checkin_completed.v1",
  StateCheckinCompletedPayload
>;

/**
 * Build the completion event for a state record that has ALREADY been persisted successfully —
 * callers invoke this only after `createCurrentStateRecord` returns, so the event can never claim
 * something the database has not done. Returns null when the source is not the Today check-in:
 * `manual` (and any future source) is not a check-in completion and keeps its existing audit path.
 *
 * `subject_ref` is the sha256 fingerprint of the owner account id — the same opaque representation
 * the audit table itself stores — never the raw id, an email, or any human-readable identity.
 */
export function stateCheckinCompletedEvent(input: {
  ownerAccountId: string;
  stateRecordId: string;
  source: CurrentStateSource;
  tagCount: number;
}): StateCheckinCompletedEvent | null {
  if (input.source !== "today_check_in") return null;
  return createDomainEvent({
    name: "state.checkin_completed.v1",
    source_module: "state.core",
    permission_context: "write:own_state",
    provenance: "user_action",
    data_class: "life_history",
    subject_ref: createHash("sha256").update(input.ownerAccountId).digest("hex"),
    payload: {
      state_record_ref: input.stateRecordId,
      source: "today_check_in",
      tag_count: input.tagCount,
    },
  });
}

type AuditSink = typeof auditLifeOs;

/**
 * Deliver the completion event into the existing governed audit sink — the ONE audit write for the
 * adopted check-in path. The audit row keeps its established shape (`yorisou.life.state.created`,
 * `current_state`, the record ref, the source as reason, the tag count) and gains safe trace
 * metadata: the canonical event name, version, and event_id. Flat scalars only; no schema change;
 * no raw user content.
 *
 * The raw owner account id is passed alongside the event because the audit RPC fingerprints it
 * server-side — the envelope itself carries only the fingerprint.
 */
export async function deliverStateCheckinCompleted(
  event: StateCheckinCompletedEvent,
  ownerAccountId: string,
  sink: AuditSink = auditLifeOs,
): Promise<void> {
  await sink({
    ownerAccountId,
    action: "yorisou.life.state.created",
    entityKind: "current_state",
    entityRef: event.payload.state_record_ref,
    reason: event.payload.source,
    detail: {
      tags: event.payload.tag_count,
      event: event.name,
      event_version: event.event_version,
      event_id: event.event_id,
    },
  });
}
