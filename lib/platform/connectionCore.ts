// Platform tier — the connection.core capability contract and its pure helpers.
//
// THE ONE CONNECTION MEANING:
//
//   A CONNECTION IS MUTUAL CONSENT TO ONE COMPARISON — NEVER ACCESS TO THE OTHER PERSON'S DATA.
//
// That sentence is the whole capability. Everything here exists to make it structurally true
// rather than merely intended:
//
//   * A `PairContext` carries two GRANTS, each a reference its own participant chose. There is no
//     field on any type in this file through which one participant could receive the other's
//     account id, source record, answers, state, reflection or memory.
//   * A `ConnectionView` is deliberately viewer-relative: the reader is `self`, the other person
//     is `other`, and `other` has no identity attached. Rendering a pair does not require knowing
//     who the other person is, so the contract does not offer it.
//   * An `Invitation` before acceptance exposes NOTHING about its creator. The public projection
//     is a separate, smaller type for exactly that reason — a route cannot accidentally serialize
//     the private record when the public one is what the page needs.
//
// This module knows no instrument, no product, no language, no table and no route.

/** Lifecycle of one invitation. `accepted` is terminal, as are `cancelled` and `expired`. */
export type InvitationStatus = "pending" | "accepted" | "cancelled" | "expired";

/** Lifecycle of one pair. `dissolved` is terminal and irreversible. */
export type PairStatus = "active" | "dissolved";

/**
 * What a participant contributes to a pair: an opaque reference to a record THEY own, granted for
 * this pair only. The grant is the unit of consent — not the account, not the record.
 */
export interface ParticipantGrant {
  /** Opaque reference to the granting participant. */
  participant_ref: string;
  /** Family of the granted reference (e.g. one assessment family). */
  reference_family: string;
  /** Opaque reference to the granted record. Never rendered to the other participant. */
  reference_ref: string;
}

/** A request to create one invitation from one record the caller owns. */
export interface InvitationRequest {
  inviter_ref: string;
  reference_family: string;
  reference_ref: string;
}

/** The private invitation record, visible only to its creator. */
export interface Invitation {
  public_invite_id: string;
  inviter_ref: string;
  reference_family: string;
  reference_ref: string;
  status: InvitationStatus;
  created_at: string;
  expires_at: string;
}

/** The owner-facing handle for an invitation just created. Carries no source reference. */
export interface InvitationReference {
  public_invite_id: string;
  status: InvitationStatus;
  created_at: string;
  expires_at: string;
}

/**
 * What an UNAUTHENTICATED or not-yet-accepted reader may see at an invitation link.
 *
 * This type is the privacy boundary of the invite page, expressed as a type so a route physically
 * cannot leak more by forgetting to strip a field: there is no inviter reference, no source
 * reference, no result identity and no timestamp of anything but expiry. It says only that a real,
 * still-open invitation exists.
 */
export interface PublicInvitationView {
  public_invite_id: string;
  /** The kind of comparison being proposed, so the page can name it. Not the content. */
  reference_family: string;
  expires_at: string;
}

/** The consent context created when an invitation is accepted. */
export interface PairContext {
  pair_public_id: string;
  status: PairStatus;
  /** Exactly two grants. Order is storage order, never a ranking. */
  grants: readonly [ParticipantGrant, ParticipantGrant];
  created_at: string;
}

/**
 * The viewer-relative projection of a pair. `other_reference_family` exists so the UI can say what
 * kind of thing is being compared; there is deliberately no `other_participant_ref`, no display
 * name and no source reference for either side.
 */
export interface ConnectionView {
  pair_public_id: string;
  status: PairStatus;
  self_reference_family: string;
  other_reference_family: string;
  created_at: string;
}

/** Repository-independent expiry check, so every caller reads expiry the same way. */
export function isInvitationOpen(invitation: Pick<Invitation, "status" | "expires_at">, now: Date): boolean {
  if (invitation.status !== "pending") return false;
  return Date.parse(invitation.expires_at) > now.getTime();
}

/**
 * Project a pair for ONE viewer. Throws when the viewer is not a participant rather than returning
 * a degraded view: a non-participant must not receive a partially-filled object they could read
 * structure from.
 */
export function connectionViewFor(pair: PairContext, viewerRef: string): ConnectionView {
  const self = pair.grants.find((grant) => grant.participant_ref === viewerRef);
  const other = pair.grants.find((grant) => grant.participant_ref !== viewerRef);
  if (!self || !other) throw new Error("connection_viewer_not_participant");
  return {
    pair_public_id: pair.pair_public_id,
    status: pair.status,
    self_reference_family: self.reference_family,
    other_reference_family: other.reference_family,
    created_at: pair.created_at,
  };
}

/**
 * Membership test used by every read path. Kept here rather than inline at call sites so
 * "is this person allowed to see this pair" has exactly one definition in the platform tier —
 * the database boundary enforces the same fact independently.
 */
export function isPairParticipant(pair: PairContext, viewerRef: string): boolean {
  return pair.grants.some((grant) => grant.participant_ref === viewerRef);
}
