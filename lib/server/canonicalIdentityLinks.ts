import "server-only";

// POR-1 — canonical identity links, application side.
//
// The strongly consistent answer to "which account owns this identity", written inside the same
// governed mutation that binds or creates the identity, and read by the deletion manifest instead of
// a mirror.
//
// WHY IT IS NOT ANOTHER READ OF THE ACCOUNT OBJECT.
//
// `buildDeletionManifest` derived the whole destructive identity scope from one
// `findAccountById(...)`. On the isolated Preview transport that read is served through a Cloudflare
// cache which, measured over 20 controlled overwrite rounds, kept returning the OLD version of an
// object for more than 25 seconds — `cf-cache-status: HIT` — while the store itself already held the
// new one. A LINE binding that completed two seconds BEFORE a deletion was requested was therefore
// invisible when the manifest froze fourteen seconds later, and the LINE lookup object survived an
// erasure that had no idea it existed.
//
// A retry would not have fixed it: there is no bound on how long that cache entry lives, and
// "read it again until it looks right" cannot distinguish a stale read from an absent record.
//
// Only types are imported from `yorisouData` — a value import would close a require cycle, since
// that module is this one's caller.

import { createHash } from "node:crypto";

import { rpc } from "./assessmentAttemptStore";
import {
  isCanonicalIdentityLinksSchemaReady,
  isWellFormedIdentityLink,
  resolveIdentityLinkMode,
  type IdentityLink,
  type IdentityLinkKind,
} from "./canonicalIdentityLinksRollout";

/** The addressable identity of an owner. Content-free, and the same fingerprint the deletion job keeps. */
export function identityOwnerFingerprint(accountId: string): string {
  return createHash("sha256").update(accountId).digest("hex");
}

/** The digest an `accounts/by-email/<digest>` key is built from. */
export function emailIdentityDigest(normalizedEmail: string): string {
  return createHash("sha256").update(normalizedEmail).digest("hex");
}

/** The digest an `accounts/by-line-user/<digest>` key is built from. */
export function lineIdentityDigest(lineUserId: string): string {
  return createHash("sha256").update(lineUserId).digest("hex");
}

export function canonicalIdentityLinksEnabled(): boolean {
  return resolveIdentityLinkMode({ schemaReady: isCanonicalIdentityLinksSchemaReady() })
    === "canonical_registry";
}

/**
 * Raised when a digest is already actively owned by a DIFFERENT account.
 *
 * Distinct from a transport failure on purpose: a caller may legitimately answer "that LINE account
 * is already connected to someone else" to a person, and must never answer it to a transport error.
 */
export class CanonicalIdentityLinkConflict extends Error {
  readonly kind: string;
  constructor(kind: string) {
    super(`identity_link_conflict:${kind}`);
    this.name = "CanonicalIdentityLinkConflict";
    this.kind = kind;
  }
}

type SyncResult = { added: number; retired: number; unchanged: number; active: number };

/**
 * Commit the COMPLETE set of identity links this account should hold.
 *
 * Complete, not a delta — the caller writing the account record already knows its email and its LINE
 * subject, so it can state the whole truth in one statement. A delta API would make "unbind LINE" a
 * second call that somebody eventually forgets, and a forgotten retirement is a live login route.
 *
 * Returns null when the registry is not ready, so callers can distinguish "not deployed yet" from
 * "committed nothing".
 */
export async function syncCanonicalIdentityLinks(input: {
  accountId: string;
  links: IdentityLink[];
}): Promise<SyncResult | null> {
  if (!canonicalIdentityLinksEnabled()) return null;

  const malformed = input.links.find((link) => !isWellFormedIdentityLink(link));
  if (malformed) {
    // Bounded, and deliberately naming only the KIND. The digest of an email is not a secret, but a
    // malformed one might be the address itself, and this message can be logged.
    throw new Error(`identity_link_malformed:${malformed.kind}`);
  }

  try {
    return await rpc<SyncResult>("yorisou_identity_links_sync", {
      p_owner_account_id: input.accountId,
      p_owner_fingerprint: identityOwnerFingerprint(input.accountId),
      p_links: input.links,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const match = /identity_link_conflict:([a-z_]+)/.exec(message);
    if (match) throw new CanonicalIdentityLinkConflict(match[1]);
    throw error;
  }
}

/**
 * The active links for an account, from the database.
 *
 * This is what the deletion manifest asks. It returns an empty array for an account with no links
 * and null when the registry is not ready — two different facts that a single empty array would
 * conflate, and conflating them is how a manifest silently narrows.
 */
export async function readCanonicalIdentityLinks(accountId: string): Promise<IdentityLink[] | null> {
  if (!canonicalIdentityLinksEnabled()) return null;
  const rows = await rpc<{ link_kind: IdentityLinkKind; link_digest: string }[]>(
    "yorisou_identity_links_for_owner",
    { p_owner_account_id: accountId },
  );
  return rows.map((row) => ({ kind: row.link_kind, digest: row.link_digest }));
}

/**
 * Who actively owns this identity? The question a login asks.
 *
 * Verification asks it too, to prove a deleted person's LINE subject resolves to nobody — and it
 * asks it WITHOUT consulting the manifest, which is the whole point.
 */
export async function resolveCanonicalIdentityOwner(
  kind: IdentityLinkKind,
  digest: string,
): Promise<string | null> {
  if (!canonicalIdentityLinksEnabled()) return null;
  const owner = await rpc<string | null>("yorisou_identity_link_owner", {
    p_link_kind: kind,
    p_link_digest: digest,
  });
  return owner ?? null;
}

/** Content-free tombstones for every active link this account holds. Returns the count erased. */
export async function eraseCanonicalIdentityLinks(accountId: string): Promise<number | null> {
  if (!canonicalIdentityLinksEnabled()) return null;
  return rpc<number>("yorisou_identity_links_erase", { p_owner_account_id: accountId });
}

/**
 * Active links remaining for an owner, counted from the same rows the erase wrote.
 *
 * Addressed by FINGERPRINT, which outlives the account id on purpose: after erasure there is no
 * identifier left to ask with, and a residue check that cannot run after the deletion is a residue
 * check that never runs when it matters.
 */
export async function canonicalIdentityLinkResidue(accountId: string): Promise<number | null> {
  if (!canonicalIdentityLinksEnabled()) return null;
  return rpc<number>("yorisou_identity_links_residue", {
    p_owner_fingerprint: identityOwnerFingerprint(accountId),
  });
}

/**
 * The identity links an account record implies.
 *
 * One derivation, used by the writer that commits them and by the manifest that reads them back, so
 * there is no second place for the two to drift apart.
 */
export function identityLinksForAccount(account: {
  email?: string | null;
  lineUserId?: string | null;
}): IdentityLink[] {
  const links: IdentityLink[] = [];
  if (account.email) links.push({ kind: "email", digest: emailIdentityDigest(account.email) });
  if (account.lineUserId) {
    links.push({ kind: "line_subject", digest: lineIdentityDigest(account.lineUserId) });
  }
  return links;
}
