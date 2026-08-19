import "server-only";

// CPR-1 — server-only connection.core + comparison.core persistence (service-role PostgREST,
// mirroring the SHR-1, DD-1 and DCI stores). Every mutation goes through an atomic SECURITY
// DEFINER RPC that performs its own authorization; nothing here is trusted to have checked first.
//
// THE READS ARE NARROW ON PURPOSE. The public invitation read selects only what a not-yet-accepted
// stranger may know, and the pair reads are filtered by participant IN THE QUERY, so a
// non-participant receives an empty result rather than a row this module then has to remember to
// hide. Column lists in this file are a privacy surface: adding an owner or source column to one
// of them is a reviewable event.

import type {
  Invitation,
  InvitationReference,
  InvitationRequest,
  PairContext,
  PublicInvitationView,
} from "@/lib/platform/connectionCore";
import type { AcceptOutcome, ConnectionRepository } from "@/lib/server/platform/connectionCore/service";
import type { ComparisonRecord, ComparisonRepository } from "@/lib/server/platform/comparisonCore/service";

const INVITATIONS = "yorisou_connection_invitations";
const PAIRS = "yorisou_connection_pairs";
const COMPARISONS = "yorisou_pair_comparisons";

/** What an unaccepted reader may learn. No inviter, no source, no result, no created_at. */
const PUBLIC_INVITE_COLUMNS = "public_invite_id,reference_family,expires_at";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function config() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("connection_persistence_not_configured");
  return { url: url.replace(/\/$/, ""), key };
}

async function request(path: string, init: RequestInit) {
  const { url, key } = config();
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const response = await request(`rpc/${fn}`, { method: "POST", body: JSON.stringify(args) });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const known = /connection_[a-z_]+/.exec(text)?.[0];
    throw new Error(known || `connection_persistence_failed:${response.status}`);
  }
  return (await response.json()) as T;
}

type InviteRow = { public_invite_id: string; expires_at: string; created_at: string; reused: boolean };

export async function createConnectionInvitation(input: InvitationRequest): Promise<InvitationReference> {
  const rows = await rpc<InviteRow[]>("yorisou_connection_invite_create", {
    p_inviter_account_id: input.inviter_ref,
    p_reference_family: input.reference_family,
    p_reference_ref: input.reference_ref,
  });
  const row = Array.isArray(rows) ? rows[0] : (rows as unknown as InviteRow);
  if (!row) throw new Error("connection_invite_create_failed");
  return {
    public_invite_id: row.public_invite_id,
    status: "pending",
    created_at: row.created_at,
    expires_at: row.expires_at,
  };
}

/**
 * The unauthenticated invite read. Filters on status AND expiry in the query, so an expired or
 * cancelled or already-accepted invitation is indistinguishable from one that never existed.
 */
export async function publicConnectionInvitation(publicInviteId: string): Promise<PublicInvitationView | null> {
  if (!UUID_RE.test(publicInviteId)) return null;
  const params = new URLSearchParams({
    select: PUBLIC_INVITE_COLUMNS,
    public_invite_id: `eq.${publicInviteId}`,
    status: "eq.pending",
    expires_at: `gt.${new Date().toISOString()}`,
    limit: "1",
  });
  const response = await request(`${INVITATIONS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`connection_persistence_failed:${response.status}`);
  const row = ((await response.json()) as Array<{
    public_invite_id: string;
    reference_family: string;
    expires_at: string;
  }>)[0];
  if (!row) return null;
  return {
    public_invite_id: row.public_invite_id,
    reference_family: row.reference_family,
    expires_at: row.expires_at,
  };
}

export async function ownConnectionInvitation(
  inviterRef: string,
  publicInviteId: string,
): Promise<Invitation | null> {
  if (!UUID_RE.test(publicInviteId)) return null;
  const params = new URLSearchParams({
    select: "public_invite_id,inviter_account_id,reference_family,reference_ref,status,created_at,expires_at",
    public_invite_id: `eq.${publicInviteId}`,
    inviter_account_id: `eq.${inviterRef}`,
    limit: "1",
  });
  const response = await request(`${INVITATIONS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`connection_persistence_failed:${response.status}`);
  const row = ((await response.json()) as Array<Record<string, string>>)[0];
  if (!row) return null;
  return {
    public_invite_id: row.public_invite_id,
    inviter_ref: row.inviter_account_id,
    reference_family: row.reference_family,
    reference_ref: row.reference_ref,
    status: row.status as Invitation["status"],
    created_at: row.created_at,
    expires_at: row.expires_at,
  };
}

export async function acceptConnectionInvitation(input: {
  publicInviteId: string;
  acceptorRef: string;
  acceptorReferenceRef: string;
}): Promise<AcceptOutcome> {
  const rows = await rpc<Array<{ pair_public_id: string; reused: boolean }>>(
    "yorisou_connection_invite_accept",
    {
      p_public_invite_id: input.publicInviteId,
      p_acceptor_account_id: input.acceptorRef,
      p_acceptor_reference_ref: input.acceptorReferenceRef,
    },
  );
  const row = Array.isArray(rows) ? rows[0] : rows;
  if (!row) throw new Error("connection_invitation_unavailable");
  const pair = await pairForParticipant(input.acceptorRef, row.pair_public_id);
  if (!pair) throw new Error("connection_invitation_unavailable");
  return { pair, reused: row.reused };
}

export function cancelConnectionInvitation(inviterRef: string, publicInviteId: string): Promise<boolean> {
  return rpc<boolean>("yorisou_connection_invite_cancel", {
    p_inviter_account_id: inviterRef,
    p_public_invite_id: publicInviteId,
  });
}

type PairRow = {
  pair_public_id: string;
  reference_family: string;
  participant_a_account_id: string;
  participant_a_reference_ref: string;
  participant_b_account_id: string;
  participant_b_reference_ref: string;
  status: string;
  created_at: string;
};

const PAIR_COLUMNS =
  "pair_public_id,reference_family,participant_a_account_id,participant_a_reference_ref," +
  "participant_b_account_id,participant_b_reference_ref,status,created_at";

function toPairContext(row: PairRow): PairContext {
  return {
    pair_public_id: row.pair_public_id,
    status: row.status as PairContext["status"],
    grants: [
      {
        participant_ref: row.participant_a_account_id,
        reference_family: row.reference_family,
        reference_ref: row.participant_a_reference_ref,
      },
      {
        participant_ref: row.participant_b_account_id,
        reference_family: row.reference_family,
        reference_ref: row.participant_b_reference_ref,
      },
    ],
    created_at: row.created_at,
  };
}

/** Participation is enforced IN THE QUERY: a non-participant gets no row, not a filtered one. */
export async function pairForParticipant(viewerRef: string, pairPublicId: string): Promise<PairContext | null> {
  if (!UUID_RE.test(pairPublicId)) return null;
  const params = new URLSearchParams({
    select: PAIR_COLUMNS,
    pair_public_id: `eq.${pairPublicId}`,
    status: "eq.active",
    or: `(participant_a_account_id.eq.${viewerRef},participant_b_account_id.eq.${viewerRef})`,
    limit: "1",
  });
  const response = await request(`${PAIRS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`connection_persistence_failed:${response.status}`);
  const row = ((await response.json()) as PairRow[])[0];
  return row ? toPairContext(row) : null;
}

export async function listPairsForParticipant(viewerRef: string, limit: number): Promise<readonly PairContext[]> {
  const params = new URLSearchParams({
    select: PAIR_COLUMNS,
    status: "eq.active",
    or: `(participant_a_account_id.eq.${viewerRef},participant_b_account_id.eq.${viewerRef})`,
    order: "created_at.desc",
    limit: String(limit),
  });
  const response = await request(`${PAIRS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`connection_persistence_failed:${response.status}`);
  return ((await response.json()) as PairRow[]).map(toPairContext);
}

export function dissolveConnectionPair(viewerRef: string, pairPublicId: string): Promise<boolean> {
  return rpc<boolean>("yorisou_connection_pair_dissolve", {
    p_viewer_account_id: viewerRef,
    p_pair_public_id: pairPublicId,
  });
}

/**
 * THE authoritative source-erasure seam once the P5 derivative schema exists. One RPC = one
 * transaction: it takes the assessment source lock, verifies the result is live AND owned before
 * touching anything, cancels invitations, dissolves pairs, empties the derived comparison codes,
 * and then delegates to the merged ARCH-P4 share seam and the canonical erasure — rolling
 * everything back if that erasure does not succeed.
 */
export function eraseAssessmentResultWithDerivatives(
  resultRowId: string,
  ownerAccountId: string,
): Promise<boolean> {
  return rpc<boolean>("yorisou_assessment_result_erase_with_derivatives", {
    p_result_row_id: resultRowId,
    p_owner_account_id: ownerAccountId,
  });
}

/** The concrete repository the routes hand to the generic connection.core runtime. */
export const connectionRepository: ConnectionRepository = {
  createInvitation: createConnectionInvitation,
  publicInvitation: publicConnectionInvitation,
  ownInvitation: ownConnectionInvitation,
  acceptInvitation: acceptConnectionInvitation,
  cancelInvitation: cancelConnectionInvitation,
  pairForParticipant,
  dissolvePair: dissolveConnectionPair,
  listPairsForParticipant,
};

/**
 * comparison.core persistence, PARTICIPANT-SCOPED.
 *
 * The comparison is addressed by the pair's internal id in SQL while every caller works in public
 * ids, so the read joins through the pair — and the join carries the participant predicate. That
 * is the whole point: the previous signature took only the pair id and depended on the caller
 * having checked participation, which made the privacy boundary a convention between files.
 */
export async function comparisonForPair(
  viewerRef: string,
  pairPublicId: string,
): Promise<ComparisonRecord | null> {
  if (!viewerRef || !UUID_RE.test(pairPublicId)) return null;
  const params = new URLSearchParams({
    select:
      "adapter_ref,adapter_version,reference_family,side_a_public_reference,side_b_public_reference,created_at," +
      `${PAIRS}!inner(pair_public_id,participant_a_account_id,participant_a_reference_ref,` +
      "participant_b_account_id,participant_b_reference_ref,status)",
    invalidated_at: "is.null",
    [`${PAIRS}.pair_public_id`]: `eq.${pairPublicId}`,
    [`${PAIRS}.status`]: "eq.active",
    // THE PRIVACY BOUNDARY, IN THE QUERY. A non-participant gets no row back at all — the server
    // never holds the two account ids or the two private source references in the first place, so
    // there is nothing for a later caller to forget to strip.
    [`${PAIRS}.or`]:
      `(participant_a_account_id.eq.${viewerRef},participant_b_account_id.eq.${viewerRef})`,
    limit: "1",
  });
  const response = await request(`${COMPARISONS}?${params}`, { method: "GET" });
  if (!response.ok) throw new Error(`connection_persistence_failed:${response.status}`);
  const row = ((await response.json()) as Array<{
    adapter_ref: string;
    adapter_version: string;
    reference_family: string;
    side_a_public_reference: string | null;
    side_b_public_reference: string | null;
    created_at: string;
    [key: string]: unknown;
  }>)[0];
  if (!row) return null;
  const pair = row[PAIRS] as PairRow | undefined;
  // An invalidated comparison has its codes cleared; treat a missing code as "no longer readable"
  // rather than rendering a half-empty pair view.
  if (!pair || !row.side_a_public_reference || !row.side_b_public_reference) return null;
  // Belt and braces: the query already scoped this, and the result is re-checked because a
  // silently-changed embed filter would otherwise widen the read without failing anything.
  if (pair.participant_a_account_id !== viewerRef && pair.participant_b_account_id !== viewerRef) {
    return null;
  }
  return {
    pair_ref: pairPublicId,
    adapter_ref: row.adapter_ref,
    adapter_version: row.adapter_version,
    reference_family: row.reference_family,
    side_a: {
      participant_ref: pair.participant_a_account_id,
      reference_family: row.reference_family,
      reference_ref: pair.participant_a_reference_ref,
      public_reference: row.side_a_public_reference,
    },
    side_b: {
      participant_ref: pair.participant_b_account_id,
      reference_family: row.reference_family,
      reference_ref: pair.participant_b_reference_ref,
      public_reference: row.side_b_public_reference,
    },
    created_at: row.created_at,
  };
}

export const comparisonRepository: ComparisonRepository = {
  forPair: comparisonForPair,
};
