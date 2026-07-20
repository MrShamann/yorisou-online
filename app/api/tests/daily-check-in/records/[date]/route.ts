import { NextResponse } from "next/server";
// DCI-1 — per-date record operations (owner-scoped; server-side gated).
// PATCH: versioned same-day correction (prior versions preserved; atomic RPC).
// DELETE: governed deletion (soft-hide + content-free tombstone event).

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { dailyCheckInAccess } from "@/lib/yorisou/methods/daily-check-in/access";
import { DAILY_CHECK_IN_RUNTIME_DEFINITION } from "@/lib/yorisou/methods/daily-check-in/runtimeDefinition";
import { executeRecordedState } from "@/lib/yorisou/method-runtime/recordedState";
import { selectAcknowledgement } from "@/lib/yorisou/methods/daily-check-in/acknowledgement";
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
    const body = (await request.json().catch(() => null)) as { values?: unknown; memoOptIn?: unknown; memo?: unknown } | null;
    if (!body || typeof body.values !== "object" || body.values === null) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }
    const values: Record<string, string | null> = {};
    for (const [k, v] of Object.entries(body.values as Record<string, unknown>)) {
      values[k] = typeof v === "string" && v ? v : null;
    }
    const producedAt = new Date().toISOString();
    // Correction identity keeps the ORIGINAL entryLocalDate + timezone (past
    // entries never re-bucket); the runtime date/timezone consistency check is
    // therefore run against the stored timezone with the stored local date.
    const execution = executeRecordedState(
      DAILY_CHECK_IN_RUNTIME_DEFINITION,
      {
        values,
        memoOptIn: body.memoOptIn === true,
        memo: typeof body.memo === "string" && body.memo ? body.memo : null,
        producedAt: existing.produced_at, // identity fields validated as stored
        entryLocalDate: existing.entry_local_date,
        timezone: existing.timezone,
        utcOffsetMinutes: existing.utc_offset_minutes,
      },
    );
    if (!execution.ok) {
      return NextResponse.json({ error: "validation_failed", codes: execution.errors.map((e) => e.code) }, { status: 422 });
    }
    const ack = selectAcknowledgement(execution.envelope.stateValues, false);
    const memo = execution.envelope.memoIncluded ? ((body.memo as string) ?? null) : null;
    const version = await correctDailyRecord({
      ownerAccountId,
      entryLocalDate: date,
      producedAt,
      state: execution.envelope.stateValues,
      memo,
      ackId: ack.ackId,
    });
    return NextResponse.json({ entryLocalDate: date, currentVersion: version, ackId: ack.ackId, acknowledgementJa: ack.copyJa });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    if (message === "daily_record_not_found") return NextResponse.json({ error: "record_not_found" }, { status: 404 });
    if (message === "daily_persistence_not_configured") return NextResponse.json({ error: "backend_unavailable" }, { status: 503 });
    console.error("daily-check-in correction failed", { code: message });
    return NextResponse.json({ error: "daily_correction_failed" }, { status: 500 });
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
    return NextResponse.json({ deleted: true, entryLocalDate: date });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown";
    if (message === "daily_persistence_not_configured") return NextResponse.json({ error: "backend_unavailable" }, { status: 503 });
    console.error("daily-check-in delete failed", { code: message });
    return NextResponse.json({ error: "daily_delete_failed" }, { status: 500 });
  }
}
