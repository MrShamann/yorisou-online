import { NextResponse } from "next/server";
// DCI-1.1 — per-date record operations (owner-scoped; server-side gated).
// PATCH: versioned same-day correction. The record's initial producedAt and
//        local-date identity are never overwritten; the new version carries the
//        SERVER correction instant; corrections are accepted only while the
//        server's now in the record's STORED timezone is still the record's
//        entryLocalDate (enforced here AND in the database RPC — never only by
//        the UI hiding the edit button).
// DELETE: governed PRIVATE-CONTENT ERASURE — version content and the current
//        row are removed; only a content-free tombstone event remains.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { dailyCheckInAccess } from "@/lib/yorisou/methods/daily-check-in/access";
import { DAILY_CHECK_IN_RUNTIME_DEFINITION } from "@/lib/yorisou/methods/daily-check-in/runtimeDefinition";
import { executeRecordedState } from "@/lib/yorisou/method-runtime/recordedState";
import { correctionWindowOpen } from "@/lib/yorisou/methods/daily-check-in/timeContract";
import { selectAcknowledgement } from "@/lib/yorisou/methods/daily-check-in/acknowledgement";
import { mapDailyStoreError, readBoundedJson } from "@/lib/server/dailyCheckInApi";
import { correctDailyRecord, deleteDailyRecord, getDailyRecordForOwner } from "@/lib/server/dailyCheckInStore";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type Context = { params: Promise<{ date: string }> };

export async function PATCH(request: Request, context: Context) {
  const access = dailyCheckInAccess();
  if (!access.allowed) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const { date } = await context.params;
  if (!DATE_RE.test(date)) return NextResponse.json({ error: "invalid_date" }, { status: 400 });
  try {
    const existing = await getDailyRecordForOwner(ownerAccountId, date);
    if (!existing) return NextResponse.json({ error: "record_not_found" }, { status: 404 });
    // §7 — correction only while the server's now in the STORED timezone is
    // still the record's local date (also enforced inside the DB RPC).
    if (!correctionWindowOpen(existing.entry_local_date, existing.timezone)) {
      return NextResponse.json({ error: "correction_window_closed" }, { status: 409 });
    }
    const read = await readBoundedJson(request);
    if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status });
    const body = read.body as { values?: unknown; memoOptIn?: unknown; memo?: unknown } | null;
    if (!body || typeof body !== "object" || typeof body.values !== "object" || body.values === null) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }
    const values: Record<string, string | null> = {};
    for (const [k, v] of Object.entries(body.values as Record<string, unknown>)) {
      values[k] = typeof v === "string" && v ? v : null;
    }
    // Coherent timestamp semantics: content is validated against the record's
    // STORED identity (initial producedAt + local date + timezone); the version
    // row then carries the server correction instant via the RPC. No field is
    // validated under one timestamp and stored under another.
    const execution = executeRecordedState(DAILY_CHECK_IN_RUNTIME_DEFINITION, {
      values,
      memoOptIn: body.memoOptIn === true,
      memo: typeof body.memo === "string" && body.memo ? body.memo : null,
      producedAt: existing.produced_at,
      entryLocalDate: existing.entry_local_date,
      timezone: existing.timezone,
      utcOffsetMinutes: existing.utc_offset_minutes,
    });
    if (!execution.ok) {
      return NextResponse.json({ error: "validation_failed", codes: execution.errors.map((e) => e.code) }, { status: 422 });
    }
    const ack = selectAcknowledgement(execution.envelope.stateValues, false);
    const memo = execution.envelope.memoIncluded ? ((body.memo as string) ?? null) : null;
    const version = await correctDailyRecord({
      ownerAccountId,
      entryLocalDate: date,
      producedAt: new Date().toISOString(), // server instant of THIS version
      state: execution.envelope.stateValues,
      memo,
      ackId: ack.ackId,
    });
    return NextResponse.json({ entryLocalDate: date, currentVersion: version, ackId: ack.ackId, acknowledgementJa: ack.copyJa });
  } catch (error) {
    const mapped = mapDailyStoreError(error, "daily_correction_failed");
    if (mapped.status === 500) console.error("daily-check-in correction failed", { code: mapped.internalCode });
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const access = dailyCheckInAccess();
  if (!access.allowed) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const { date } = await context.params;
  if (!DATE_RE.test(date)) return NextResponse.json({ error: "invalid_date" }, { status: 400 });
  try {
    const deleted = await deleteDailyRecord(ownerAccountId, date);
    if (!deleted) return NextResponse.json({ error: "record_not_found" }, { status: 404 });
    return NextResponse.json({ deleted: true, erased: true, entryLocalDate: date });
  } catch (error) {
    const mapped = mapDailyStoreError(error, "daily_delete_failed");
    if (mapped.status === 500) console.error("daily-check-in delete failed", { code: mapped.internalCode });
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
