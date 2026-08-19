// Platform tier — the sharing.core capability contract and its pure helpers.
//
// THE ONE SHARE FLOW, as mechanics:
//
//   PRIVATE SOURCE → SAFE DERIVATIVE → PREVIEW → EXPLICIT PUBLISH → REVOCABLE DEEP LINK
//
// The capability owns lifecycle shape: a candidate is allowlist-BUILT (never a redacted private
// object), a preview is the candidate plus a digest, publish must present the digest of the exact
// payload previewed, a published object is an immutable snapshot addressed by a high-entropy
// public id, and revocation is a lifecycle state — never a payload mutation, never reversible.
//
// The capability owns NO content: templates, copy, allowlists and payload schemas belong to
// Product Packs; persistence belongs to the server repository. This file knows no product, no
// storage, no route — and the guard suite keeps it that way mechanically.

import { createHash } from "node:crypto";

/** What a pack supplies for one publishable derivative. Payload is PUBLIC-SAFE by construction. */
export interface ShareCandidate<TPayload = unknown> {
  /** The share-object family this candidate belongs to (e.g. one card family). */
  card_family: string;
  /** Which private source domain produced it — a family name, never a private identifier. */
  source_family: string;
  /** Opaque private reference to the source record. NEVER rendered, NEVER public. */
  source_ref: string;
  template_ref: string;
  template_version: string;
  payload_version: string;
  /** The allowlist-built public derivative — the ONLY content that ever becomes public. */
  payload: TPayload;
}

/** A candidate plus the digest that locks preview to publish. */
export interface SharePreview<TPayload = unknown> {
  candidate: ShareCandidate<TPayload>;
  digest: string;
}

/** The owner-facing view of one published object. Carries no owner and no source reference. */
export interface ShareObjectReference {
  public_id: string;
  card_family: string;
  template_version: string;
  published_at: string;
}

/** The public view: exactly what an anonymous reader may see. */
export interface ShareObjectView<TPayload = unknown> {
  public_id: string;
  card_family: string;
  template_version: string;
  payload_version: string;
  payload: TPayload;
  published_at: string;
}

/**
 * Canonical JSON: keys sorted at every depth, no whitespace. The digest is only meaningful if two
 * structurally-equal payloads always serialize identically — object key order must never matter.
 */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`);
  return `{${entries.join(",")}}`;
}

/**
 * The preview/publish lock: sha256 over the canonical serialization of everything that defines the
 * published snapshot. Publish MUST recompute this from a server-rebuilt candidate and refuse on
 * mismatch — the client can never smuggle content past the preview.
 */
export function computeShareDigest(candidate: ShareCandidate): string {
  return createHash("sha256")
    .update(
      canonicalJson({
        card_family: candidate.card_family,
        source_family: candidate.source_family,
        source_ref: candidate.source_ref,
        template_ref: candidate.template_ref,
        template_version: candidate.template_version,
        payload_version: candidate.payload_version,
        payload: candidate.payload,
      }),
    )
    .digest("hex");
}
