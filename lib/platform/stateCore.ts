// Platform tier — the state.core capability contract.
//
// ONE CAPABILITY ≠ ONE TABLE. This product's state capability is realized by TWO legacy
// persistence families with genuinely different lifecycles, and this contract's job is to make
// that truth explicit rather than flatten it:
//
//   current_moment   — a lightweight "how things are right now" record: created, optionally
//                      annotated once with a short reflection, read as latest/recent. No versioning,
//                      no local-date identity.
//   versioned_daily  — a per-local-day record with server-authoritative time identity: created
//                      once per local date, corrected only within that same local day as a NEW
//                      version, erased by governed erasure. Its lifecycle is calendar-shaped.
//
// A "universal state row" would have to lie about one family to fit the other, so the contract is
// a discriminated model: each family keeps its own operations interface, and the shared vocabulary
// is limited to what is honestly shared — the family discriminant and a normalized, privacy-safe
// provenance reference.
//
// Brand-free by the platform tier's rules (guarded by test:platform-contracts): no product names,
// no database table names, no product copy, no imports outside this directory. The server
// compatibility layer (lib/server/platform/stateCore/) binds these interfaces to the real
// persistence repositories; this file never learns what they are.

/** Which persistence family produced a state object. The discriminant of the whole contract. */
export type StateSourceFamily = "current_moment" | "versioned_daily";

/**
 * Normalized, privacy-safe reference to one state record. Enough to know WHICH family produced it,
 * WHICH record it is, and WHEN it was captured — and nothing more. Deliberately excludes the
 * owner: a provenance reference may travel further than a repository read, so it carries no
 * account identity of any kind.
 */
export interface StateProvenance {
  family: StateSourceFamily;
  /** Opaque reference to the source record (its id in the owning repository). */
  record_ref: string;
  /** ISO-8601 instant the state was captured/produced, as the owning family defines it. */
  captured_at: string;
}

/**
 * Operations of the current-moment family. TRecord/TInput are the product's own shapes — the
 * platform tier constrains the LIFECYCLE, not the record vocabulary.
 *
 * The lifecycle is deliberately narrow: create, annotate exactly one reflection onto an existing
 * record, bounded recent reads. There is no generic update and no generic delete here, because
 * this family has neither — inventing them at the boundary would be a dishonest contract.
 */
export interface CurrentMomentStateOperations<TRecord, TInput> {
  readonly family: "current_moment";
  create(ownerRef: string, input: TInput): Promise<string>;
  annotate(ownerRef: string, recordRef: string, reflection: string): Promise<boolean>;
  list(ownerRef: string, limit?: number): Promise<TRecord[]>;
  latest(ownerRef: string): Promise<TRecord | null>;
  provenanceOf(record: TRecord): StateProvenance;
}

/**
 * Operations of the versioned-daily family. Identity is the owner + a local calendar date, time
 * identity is server-authoritative, correction is same-local-day and produces a new version, and
 * deletion is governed erasure — none of which may be weakened or generalized by the boundary.
 * Method/schema/acknowledgement semantics stay entirely with the owning product method; the
 * contract only names the lifecycle.
 */
export interface VersionedDailyStateOperations<TRecord, TCreateInput, TCorrectInput> {
  readonly family: "versioned_daily";
  create(input: TCreateInput): Promise<string>;
  /** Same-local-day versioned correction; resolves to the new version number. */
  correct(input: TCorrectInput): Promise<number>;
  /** Governed erasure by local-date identity — not a generic delete. */
  erase(ownerRef: string, entryLocalDate: string): Promise<boolean>;
  listSince(ownerRef: string, sinceLocalDate: string, limit?: number): Promise<TRecord[]>;
  getForDate(ownerRef: string, entryLocalDate: string): Promise<TRecord | null>;
  hasAny(ownerRef: string): Promise<boolean>;
  provenanceOf(record: TRecord): StateProvenance;
}
