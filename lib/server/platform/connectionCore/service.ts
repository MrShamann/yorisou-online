import "server-only";

// ARCH-P5 — the generic connection.core runtime. Consent lifecycle mechanics ONLY:
//
//   invite    : one person offers ONE comparison, from a record they own
//   accept    : a different authenticated person consents and contributes their OWN record
//   cancel    : the inviter withdraws an invitation that has not been accepted
//   dissolve  : EITHER participant ends the pair, permanently
//   read      : a pair, viewer-relative, for participants only
//
// WHAT THIS SERVICE DELIBERATELY DOES NOT DO.
//
// It does not enforce authorization by itself. Every operation below delegates to a repository
// method that is backed by a single database mutation which re-checks ownership, participation and
// lifecycle state while holding the relevant locks. ARCH-P4 established why: application-level
// ordering is not a concurrency guarantee, and an authorization check that lives only in the
// process can be raced or bypassed by a second caller. The checks that appear here are
// fail-fast input validation, not the security boundary.
//
// It also owns no content, no persistence, no product names and no language.

import {
  connectionViewFor,
  type ConnectionView,
  type Invitation,
  type InvitationReference,
  type InvitationRequest,
  type PairContext,
  type PublicInvitationView,
} from "@/lib/platform/connectionCore";

/** Outcome of an accept attempt. `reused` is the idempotent retry of the same acceptor. */
export interface AcceptOutcome {
  pair: PairContext;
  reused: boolean;
}

export interface ConnectionRepository {
  /**
   * Create one pending invitation. The database verifies the inviter owns a LIVE record of the
   * declared family; an inviter who supplies a reference they do not own creates nothing.
   *
   * Idempotent by intent: when the same inviter already has an open invitation for the same
   * reference, the existing one is returned rather than minting a second link. Retrying a create
   * must not scatter live invitations the person then has to remember to cancel.
   */
  createInvitation(request: InvitationRequest): Promise<InvitationReference>;

  /** The privacy-minimal public projection, or null when absent/expired/cancelled/accepted. */
  publicInvitation(publicInviteId: string): Promise<PublicInvitationView | null>;

  /** The inviter's own view of their invitation, or null when it is not theirs. */
  ownInvitation(inviterRef: string, publicInviteId: string): Promise<Invitation | null>;

  /**
   * Accept in ONE transaction: re-check the invitation is open, that the acceptor is not the
   * inviter, that BOTH participants still own live records of the expected family, then create
   * exactly one pair and one comparison. Concurrent acceptors are serialized; the loser is
   * refused rather than producing a second pair.
   */
  acceptInvitation(input: {
    publicInviteId: string;
    acceptorRef: string;
    acceptorReferenceRef: string;
  }): Promise<AcceptOutcome>;

  /** Inviter-only cancel. True when it was open before, false when already closed/absent. */
  cancelInvitation(inviterRef: string, publicInviteId: string): Promise<boolean>;

  /** The pair, for a participant only. Null for everyone else — including "does not exist". */
  pairForParticipant(viewerRef: string, pairPublicId: string): Promise<PairContext | null>;

  /** Either participant dissolves. Idempotent: false when already dissolved or not a participant. */
  dissolvePair(viewerRef: string, pairPublicId: string): Promise<boolean>;

  /** The viewer's own active pairs. Bounded by the repository; never a feed. */
  listPairsForParticipant(viewerRef: string, limit: number): Promise<readonly PairContext[]>;
}

/** Hard ceiling on what any connection surface may return. The hub is finite by contract. */
export const CONNECTION_LIST_LIMIT = 20;

export function createInvitation(
  request: InvitationRequest,
  repository: ConnectionRepository,
): Promise<InvitationReference> {
  if (!request.inviter_ref) throw new Error("connection_invalid_inviter");
  if (!request.reference_family || !request.reference_ref) throw new Error("connection_invalid_reference");
  return repository.createInvitation(request);
}

/** The unauthenticated invite read. Returns only what {@link PublicInvitationView} allows. */
export function readPublicInvitation(
  publicInviteId: string,
  repository: ConnectionRepository,
): Promise<PublicInvitationView | null> {
  return repository.publicInvitation(publicInviteId);
}

/**
 * Accept an invitation. The acceptor names their OWN record; the database proves they own it.
 *
 * A caller supplying someone else's reference gets nothing — that is the whole point of passing
 * `acceptorRef` and `acceptorReferenceRef` separately into a mutation that verifies the pair of
 * them, rather than trusting a client-side claim that the reference belongs to the caller.
 */
export function acceptInvitation(
  input: { publicInviteId: string; acceptorRef: string; acceptorReferenceRef: string },
  repository: ConnectionRepository,
): Promise<AcceptOutcome> {
  if (!input.acceptorRef) throw new Error("connection_invalid_acceptor");
  if (!input.acceptorReferenceRef) throw new Error("connection_invalid_reference");
  return repository.acceptInvitation(input);
}

export function cancelInvitation(
  inviterRef: string,
  publicInviteId: string,
  repository: ConnectionRepository,
): Promise<boolean> {
  return repository.cancelInvitation(inviterRef, publicInviteId);
}

/**
 * Read one pair as a participant. Non-participants receive null — the same value as "no such
 * pair", so a probe cannot distinguish a pair that exists from one that does not.
 */
export async function readConnection(
  viewerRef: string,
  pairPublicId: string,
  repository: ConnectionRepository,
): Promise<ConnectionView | null> {
  const pair = await repository.pairForParticipant(viewerRef, pairPublicId);
  if (!pair) return null;
  return connectionViewFor(pair, viewerRef);
}

export function dissolvePair(
  viewerRef: string,
  pairPublicId: string,
  repository: ConnectionRepository,
): Promise<boolean> {
  return repository.dissolvePair(viewerRef, pairPublicId);
}

export async function listConnections(
  viewerRef: string,
  repository: ConnectionRepository,
  limit: number = CONNECTION_LIST_LIMIT,
): Promise<readonly ConnectionView[]> {
  const bounded = Math.max(1, Math.min(limit, CONNECTION_LIST_LIMIT));
  const pairs = await repository.listPairsForParticipant(viewerRef, bounded);
  return pairs.map((pair) => connectionViewFor(pair, viewerRef));
}
