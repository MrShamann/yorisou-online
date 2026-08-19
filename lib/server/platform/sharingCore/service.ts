import "server-only";

// ARCH-P4 — the generic sharing.core runtime. Lifecycle mechanics ONLY:
//
//   preview  : validate the pack-built candidate, compute the digest, return both
//   publish  : REBUILD server-side is the caller's duty — this service verifies the presented
//              preview digest against the rebuilt candidate and refuses on mismatch, then hands
//              the repository ONE idempotent publish
//   revoke   : owner-scoped lifecycle transition, idempotent, never reversible
//   read     : public payload by public id — published, unrevoked, schema-valid, or nothing
//
// The service owns no content (packs do), no persistence (the repository does), and no product
// names. Every repository operation it calls is defined here as an interface, so tests prove the
// lifecycle with fakes and the DB harness proves the real store separately.

import {
  computeShareDigest,
  type ShareCandidate,
  type ShareObjectReference,
  type ShareObjectView,
  type SharePreview,
} from "@/lib/platform/sharingCore";

export interface SharePublishResult {
  reference: ShareObjectReference;
  /** True when an identical active object already existed and its reference was returned. */
  reused: boolean;
}

export interface SharingRepository {
  /**
   * Idempotent publish: if an ACTIVE object with the same owner + source + template + digest
   * exists, return it (reused). Otherwise insert the immutable snapshot and its transactional
   * publish-audit row together. Never updates an existing payload.
   */
  publish(input: {
    ownerAccountId: string;
    candidate: ShareCandidate;
    digest: string;
  }): Promise<SharePublishResult>;
  /** Owner-scoped revoke; true when active-before, false when already revoked/absent. Audited. */
  revoke(ownerAccountId: string, publicId: string): Promise<boolean>;
  /**
   * Revoke that OWNER's active objects derived from one private source (erasure propagation).
   *
   * The owner is REQUIRED and is enforced in the database mutation itself, not merely here: the
   * first version of this contract took only (family, ref), which meant knowing another person's
   * private source id was enough to darken their public link. A source reference is not an
   * authorization.
   */
  revokeBySource(ownerAccountId: string, sourceFamily: string, sourceRef: string): Promise<number>;
  /** The owner's active object for one exact source+template, or null. Private management state. */
  activeForSource(
    ownerAccountId: string,
    sourceFamily: string,
    sourceRef: string,
    templateRef: string,
  ): Promise<(ShareObjectReference & { digest: string }) | null>;
  /** Public read: published, unrevoked payload by public id, or null. Nothing else. */
  publicView(publicId: string): Promise<ShareObjectView | null>;
}

/** Build the preview: validate via the pack's validator, then lock the exact payload. */
export function buildSharePreview<TPayload>(
  candidate: ShareCandidate<TPayload>,
  validate: (payload: TPayload) => void,
): SharePreview<TPayload> {
  validate(candidate.payload);
  return { candidate, digest: computeShareDigest(candidate) };
}

/**
 * Publish the previewed snapshot. The caller REBUILDS the candidate from the private source (never
 * trusts client copy); this verifies the rebuilt candidate still digests to what the person
 * previewed, refuses staleness, and delegates one idempotent write.
 */
export async function publishShare<TPayload>(input: {
  ownerAccountId: string;
  candidate: ShareCandidate<TPayload>;
  previewDigest: string;
  validate: (payload: TPayload) => void;
  repository: SharingRepository;
}): Promise<SharePublishResult> {
  input.validate(input.candidate.payload);
  const digest = computeShareDigest(input.candidate);
  if (digest !== input.previewDigest) {
    throw new Error("share_preview_stale");
  }
  return input.repository.publish({
    ownerAccountId: input.ownerAccountId,
    candidate: input.candidate,
    digest,
  });
}

/** Owner revoke, idempotent by contract. */
export function revokeShare(
  ownerAccountId: string,
  publicId: string,
  repository: SharingRepository,
): Promise<boolean> {
  return repository.revoke(ownerAccountId, publicId);
}

/**
 * Erasure propagation: that owner's active derivatives of one private source become unavailable.
 *
 * NOTE ON USE. For assessment-result erasure the authoritative path is the atomic source-erasure
 * seam, which performs owner verification, revocation and canonical erasure inside ONE database
 * transaction holding the source lock. This function remains the contract's generic operation and
 * is owner-scoped for the same reason; it is not sufficient on its own to guarantee "erased source
 * implies no active derivative" under concurrency, because it commits separately.
 */
export function revokeSharesBySource(
  ownerAccountId: string,
  sourceFamily: string,
  sourceRef: string,
  repository: SharingRepository,
): Promise<number> {
  return repository.revokeBySource(ownerAccountId, sourceFamily, sourceRef);
}

/**
 * Public read with fail-closed validation: a stored payload that no longer passes its family
 * validator renders NOTHING — a malformed public object is concealed, never "sanitized and shown".
 */
export async function readPublicShare<TPayload>(input: {
  publicId: string;
  expectedFamily: string;
  expectedPayloadVersion: string;
  validate: (payload: TPayload) => void;
  repository: SharingRepository;
}): Promise<ShareObjectView<TPayload> | null> {
  const view = await input.repository.publicView(input.publicId);
  if (!view) return null;
  if (view.card_family !== input.expectedFamily) return null;
  if (view.payload_version !== input.expectedPayloadVersion) return null;
  try {
    input.validate(view.payload as TPayload);
  } catch {
    return null;
  }
  return view as ShareObjectView<TPayload>;
}
