import "server-only";

// ARCH-P6 — the generic continuity.core runtime. Projection mechanics ONLY:
//
//   project    : record a display-safe reference to something that happened
//   invalidate : propagate a source deletion, permanently
//   read       : the caller's own ACTIVE moments, newest first
//
// WHY INVALIDATION IS THE CENTRE OF THIS FILE.
//
// The timeline reads its sources directly today, which makes deletion correctness a read-time
// concern: every reader must remember to filter. A projection table only improves on that if the
// projection is guaranteed not to outlive its source — otherwise it becomes a second, staler copy
// of deleted data, which is strictly worse than the direct read it replaced.
//
// So `invalidateForSource` is owner-scoped and keyed exactly the way a delete-propagation addresses
// it, and invalidation is terminal. That mirrors the ShareObject revocation (ARCH-P4) and the pair
// comparison invalidation (ARCH-P5): a lifecycle transition, never a payload mutation, never
// reversible.
//
// The service owns no content, no persistence and no product names.

import {
  assertProjectableSource,
  cursorOf,
  isReadableMoment,
  projectionKeyOf,
  type ContinuityPage,
  type ContinuityPageRequest,
  type ProjectionKey,
  type ProjectionSource,
  type TimelineMoment,
} from "@/lib/platform/continuityCore";

/** Hard ceiling on any continuity read. The timeline is finite by contract. */
export const CONTINUITY_PAGE_LIMIT = 50;

export interface ContinuityRepository {
  /**
   * Record one projection, idempotently by (owner, family, ref). A source that projects twice must
   * not produce two moments — re-projection after an edit updates the existing row rather than
   * appending, so the timeline cannot drift into duplicates.
   */
  upsertMoment(source: ProjectionSource): Promise<TimelineMoment>;
  /**
   * Invalidate every moment for one source, owner-scoped. Returns how many transitioned.
   *
   * The owner is REQUIRED and must be enforced in the mutation itself, not merely here: knowing
   * another person's source reference must never be enough to blank their timeline. This is the
   * same lesson ARCH-P4 learned when revoke-by-source shipped without an owner predicate.
   */
  invalidateForSource(key: ProjectionKey): Promise<number>;
  /** The caller's own ACTIVE moments, newest first, bounded. */
  listActive(ownerRef: string, limit: number): Promise<readonly TimelineMoment[]>;
  /**
   * One keyset page of the caller's own ACTIVE moments, newest first.
   *
   * The repository is asked for `limit + 1` and returns whatever it finds; deciding whether that
   * extra row means "there is more" belongs to the service, not to storage.
   */
  pageActive(request: ContinuityPageRequest): Promise<readonly TimelineMoment[]>;
}

/** Project one source. Validation refuses anything that would make the projection a copy. */
export function projectMoment(
  source: ProjectionSource,
  repository: ContinuityRepository,
): Promise<TimelineMoment> {
  assertProjectableSource(source);
  return repository.upsertMoment(source);
}

/**
 * Delete-propagation. Call this from the SAME transaction that erases the source wherever the
 * storage allows it; a projection that survives its source is the failure this module exists to
 * prevent.
 */
export function invalidateProjectionsForSource(
  key: ProjectionKey,
  repository: ContinuityRepository,
): Promise<number> {
  if (!key.owner_ref) throw new Error("continuity_owner_required");
  if (!key.source_ref) throw new Error("continuity_source_ref_required");
  return repository.invalidateForSource(key);
}

/** Read the caller's timeline. Defence in depth: invalidated moments are filtered here too. */
export async function readTimeline(
  ownerRef: string,
  repository: ContinuityRepository,
  limit: number = CONTINUITY_PAGE_LIMIT,
): Promise<readonly TimelineMoment[]> {
  if (!ownerRef) return [];
  const bounded = Math.max(1, Math.min(limit, CONTINUITY_PAGE_LIMIT));
  const moments = await repository.listActive(ownerRef, bounded);
  return moments.filter(isReadableMoment);
}

/**
 * One page of the caller's timeline index.
 *
 * This returns REFERENCES, never content — the caller hydrates records from their own stores. That
 * is the whole reason a projection can be an index rather than a copy: the index answers identity,
 * order, filtering and pagination, and nothing else needs to live in it.
 *
 * Invalidated moments are filtered here as well as in storage. Defence in depth is cheap, and the
 * one thing this module must never do is hand back a moment whose source is gone.
 */
export async function readTimelinePage(
  request: ContinuityPageRequest,
  repository: ContinuityRepository,
): Promise<ContinuityPage> {
  if (!request.owner_ref) return { moments: [], has_more: false };
  if (request.families.length === 0) return { moments: [], has_more: false };
  const limit = Math.max(1, Math.min(request.limit, CONTINUITY_PAGE_LIMIT));
  const found = await repository.pageActive({ ...request, limit });
  const readable = found.filter(isReadableMoment);
  return { moments: readable.slice(0, limit), has_more: readable.length > limit };
}

export { cursorOf, projectionKeyOf };
