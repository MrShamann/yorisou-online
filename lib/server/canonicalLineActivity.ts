import "server-only";

// POR-1 — canonical LINE activity, application side.
//
// This module replaces `phase1/line-events/admin-recent-subjects.json`: one JSON array covering
// every LINE subject, updated by read-modify-write, on a transport with no read-after-write
// consistency. Two writers could each read a stale copy and each write back a document missing the
// other's entry, and both would be told they succeeded. It was also unusable as deletion evidence,
// because absence in a stale read is indistinguishable from erasure.
//
// The replacement is one row per event, addressed by the event's own identity, with the recent-
// subject list DERIVED rather than stored. There is no shared document, so there is nothing to lose.
//
// Only types are imported from `yorisouData` — a value import would close a require cycle, since
// that module is this one's caller.

import { createHash } from "node:crypto";

import { rpc } from "./assessmentAttemptStore";
import type { LineWebhookEventRecord, RecentLineWebhookSubjectRecord } from "./yorisouData";

/** The addressable identity of a LINE subject. Never the raw id. */
export function lineSubjectHash(lineUserId: string): string {
  return createHash("sha256").update(lineUserId).digest("hex");
}

/** Content-free owner identity, matching the fingerprint the deletion job keeps. */
export function lineOwnerFingerprint(accountId: string): string {
  return createHash("sha256").update(accountId).digest("hex");
}

type CanonicalLineEventRow = {
  line_event_id: string;
  webhook_event_id: string | null;
  line_subject_hash: string;
  line_subject_id: string | null;
  owner_account_id: string | null;
  owner_fingerprint: string | null;
  source_type: string | null;
  event_type: string;
  message_type: string | null;
  message_text: string | null;
  postback_data: string | null;
  delivery_mode: string | null;
  is_redelivery: boolean;
  reply_token_present: boolean;
  reply_status: LineWebhookEventRecord["replyStatus"];
  reply_error: string | null;
  event_timestamp: string | null;
  received_at: string;
  retention_state: "active" | "erased";
  erased_at: string | null;
};

function toEventRecord(row: CanonicalLineEventRow): LineWebhookEventRecord {
  return {
    id: row.line_event_id,
    accountId: row.owner_account_id,
    lineUserId: row.line_subject_id,
    sourceType: row.source_type,
    eventType: row.event_type,
    messageType: row.message_type,
    messageText: row.message_text,
    postbackData: row.postback_data,
    replyTokenPresent: row.reply_token_present,
    replyStatus: row.reply_status,
    replyError: row.reply_error,
    webhookEventId: row.webhook_event_id,
    deliveryMode: row.delivery_mode,
    isRedelivery: row.is_redelivery,
    eventTimestamp: row.event_timestamp,
    receivedAt: row.received_at,
  };
}

/**
 * A tombstoned row has no subject id left, which is the point. Such a row can never appear here:
 * every read RPC filters to `retention_state = 'active'`. The `?? ""` is therefore unreachable
 * rather than a fallback, and exists so the mapping is total.
 */
function toRecentSubjectRecord(row: CanonicalLineEventRow): RecentLineWebhookSubjectRecord {
  return {
    eventId: row.line_event_id,
    webhookEventId: row.webhook_event_id,
    lineUserId: row.line_subject_id ?? "",
    accountId: row.owner_account_id,
    sourceType: row.source_type,
    eventType: row.event_type,
    messageType: row.message_type,
    messageText: row.message_text,
    postbackData: row.postback_data,
    eventTimestamp: row.event_timestamp,
    receivedAt: row.received_at,
  };
}

export type CanonicalLineRecordOutcome = "recorded" | "repeated" | "erased";

export class CanonicalLineActivityConflict extends Error {
  constructor() {
    super("line_event_identity_conflict");
    this.name = "CanonicalLineActivityConflict";
  }
}

/**
 * Record one event. Idempotent by the event's own identity, so a webhook redelivery and a retry of
 * our own write land on the same row rather than creating a second one.
 *
 * Reuse of one event identity for a DIFFERENT subject raises rather than rebinding — that would let
 * one delivery overwrite another person's activity, which is the class of bug this table exists to
 * make structurally impossible.
 *
 * An event for an already-erased subject returns `erased`: the tombstone absorbs the delivery
 * instead of resurrecting a deleted person's activity.
 */
export async function recordCanonicalLineEvent(
  record: LineWebhookEventRecord,
): Promise<CanonicalLineRecordOutcome> {
  if (!record.lineUserId) {
    // No subject means nothing to index. The per-event object still holds the raw event.
    return "repeated";
  }

  try {
    const result = await rpc<{ outcome: CanonicalLineRecordOutcome }>("yorisou_line_event_record", {
      p_line_event_id: record.id,
      p_line_subject_hash: lineSubjectHash(record.lineUserId),
      p_event_type: record.eventType,
      p_line_subject_id: record.lineUserId,
      p_webhook_event_id: record.webhookEventId,
      p_owner_account_id: record.accountId,
      p_owner_fingerprint: record.accountId ? lineOwnerFingerprint(record.accountId) : null,
      p_source_type: record.sourceType,
      p_message_type: record.messageType,
      p_message_text: record.messageText,
      p_postback_data: record.postbackData,
      p_delivery_mode: record.deliveryMode,
      p_is_redelivery: record.isRedelivery,
      p_reply_token_present: record.replyTokenPresent,
      p_reply_status: record.replyStatus,
      p_reply_error: record.replyError,
      p_event_timestamp: record.eventTimestamp,
      p_received_at: record.receivedAt,
    });
    return result.outcome;
  } catch (error) {
    if (error instanceof Error && error.message.includes("line_event_identity_conflict")) {
      throw new CanonicalLineActivityConflict();
    }
    throw error;
  }
}

export async function listCanonicalRecentLineSubjects(
  limit = 10,
): Promise<RecentLineWebhookSubjectRecord[]> {
  const rows = await rpc<CanonicalLineEventRow[]>("yorisou_line_recent_subjects", {
    p_limit: Math.max(1, limit),
  });
  return rows.map(toRecentSubjectRecord);
}

export async function listCanonicalLineEvents(limit = 500): Promise<LineWebhookEventRecord[]> {
  const rows = await rpc<CanonicalLineEventRow[]>("yorisou_line_events_recent", {
    p_limit: Math.max(1, limit),
  });
  return rows.map(toEventRecord);
}

export async function findCanonicalLineEventById(id: string): Promise<LineWebhookEventRecord | null> {
  // There is no by-id read RPC by design: the recent read already covers every product surface, and
  // a second entry point is a second thing to keep consistent. A bounded scan of the active window
  // is honest about what it is.
  const rows = await rpc<CanonicalLineEventRow[]>("yorisou_line_events_recent", { p_limit: 500 });
  const match = rows.find((row) => row.line_event_id === id);
  return match ? toEventRecord(match) : null;
}

export async function listCanonicalLineEventsForOwner(
  accountId: string,
  limit = 500,
): Promise<LineWebhookEventRecord[]> {
  const rows = await rpc<CanonicalLineEventRow[]>("yorisou_line_events_for_owner", {
    p_owner_fingerprint: lineOwnerFingerprint(accountId),
    p_limit: Math.max(1, limit),
  });
  return rows.map(toEventRecord);
}

export async function listCanonicalLineEventsForSubject(
  lineUserId: string,
  limit = 500,
): Promise<LineWebhookEventRecord[]> {
  const rows = await rpc<CanonicalLineEventRow[]>("yorisou_line_events_for_subject", {
    p_line_subject_hash: lineSubjectHash(lineUserId),
    p_limit: Math.max(1, limit),
  });
  return rows.map(toEventRecord);
}

export type CanonicalLineSubjectErasure = {
  subject_state: "erased";
  events_erased: number;
  active_residue: number;
  already_erased: boolean;
};

/**
 * Erase one LINE SUBJECT. Scoped by digest, so the caller never needs the raw id it is erasing and
 * the deletion manifest never has to keep one.
 *
 * This is a stronger operation than the event-scoped erasure it replaces, and the difference is the
 * whole point. Tombstoning the rows that exist at deletion time protects redelivery of THOSE events.
 * It does nothing about a brand-new event id for the same subject, which LINE may send at any time
 * and which the record RPC would have inserted as live activity for a person who no longer exists.
 * The subject state is what makes erasure a property of the SUBJECT rather than of whichever rows
 * happened to exist when the deletion ran.
 *
 * Idempotent: a second call finds the subject already erased, sweeps nothing, and does not move
 * `erased_at`. Subjects belonging to anyone else are out of scope by construction — the lock, the
 * state and the sweep are all keyed by this one digest.
 */
export async function eraseCanonicalLineSubjects(input: {
  lineSubjectHashes: string[];
  ownerFingerprint?: string | null;
}): Promise<number> {
  let erased = 0;
  for (const hash of new Set(input.lineSubjectHashes)) {
    const result = await rpc<CanonicalLineSubjectErasure>("yorisou_line_subject_erase", {
      p_line_subject_hash: hash,
      p_owner_fingerprint: input.ownerFingerprint ?? null,
    });
    erased += result.events_erased;
  }
  return erased;
}

/**
 * Residue probe used ONLY to verify erasure before finalization.
 *
 * Unlike the object-store probe it replaces, this one cannot answer "absent" from a stale read: it
 * is a count from the same row-locked table the erasure wrote. It does not swallow errors — an
 * undetermined result must never read as "gone".
 *
 * It counts the BARRIER as well as the rows. A subject whose events are all tombstoned but whose
 * state is still `active` is residue: the next webhook makes it live again. So is a subject with no
 * registry row at all — "we never recorded a state" is not evidence of erasure, and unknown must
 * never mean absent.
 */
export async function canonicalLineActivityResidue(lineSubjectHashes: string[]): Promise<number> {
  let residue = 0;
  for (const hash of new Set(lineSubjectHashes)) {
    residue += await rpc<number>("yorisou_line_subject_erasure_residue", { p_line_subject_hash: hash });
  }
  return residue;
}

export type CanonicalLineSubjectState = {
  subject_hash: string;
  state: "active" | "erased" | "unknown";
  owner_fingerprint: string | null;
  erased_at: string | null;
};

/** The authoritative subject state. Bounded and content-free; no raw identifier is returned. */
export async function canonicalLineSubjectStates(
  lineSubjectHashes: string[],
): Promise<CanonicalLineSubjectState[]> {
  const out: CanonicalLineSubjectState[] = [];
  for (const hash of new Set(lineSubjectHashes)) {
    out.push(
      await rpc<CanonicalLineSubjectState>("yorisou_line_subject_state", { p_line_subject_hash: hash }),
    );
  }
  return out;
}

export type CanonicalLineActivityInventory = {
  subject_hash: string;
  subject_state: "active" | "erased" | "unknown";
  owner_fingerprint: string | null;
  active_events: number;
  erased_events: number;
  latest_received_at: string | null;
};

/** Inventory for the durable deletion manifest, frozen before the irreversible crossing. */
export async function canonicalLineActivityInventory(
  lineSubjectHashes: string[],
): Promise<CanonicalLineActivityInventory[]> {
  const out: CanonicalLineActivityInventory[] = [];
  for (const hash of new Set(lineSubjectHashes)) {
    out.push(
      await rpc<CanonicalLineActivityInventory>("yorisou_line_activity_inventory", {
        p_line_subject_hash: hash,
      }),
    );
  }
  return out;
}
