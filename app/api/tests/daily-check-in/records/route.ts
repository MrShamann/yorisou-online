import { NextResponse } from "next/server";
// DCI-1.1 — daily-check-in records API (owner-scoped; server-side gated).
// GET: own visible history + field-valid 7/30-day summaries.
// POST: create the day's record with SERVER-AUTHORITATIVE time identity —
//       the client submits values/memo/timezone only; producedAt and
//       entryLocalDate are generated/derived on the server. A resumed pending
//       entry may preserve its original completedAt + timezone within the
//       bounded window (10 min + 120s skew). Client date overrides are rejected.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { dailyCheckInAccess } from "@/lib/yorisou/methods/daily-check-in/access";
import { DAILY_CHECK_IN_RUNTIME_DEFINITION } from "@/lib/yorisou/methods/daily-check-in/runtimeDefinition";
import { DAILY_CHECK_IN_DEFINITION } from "@/lib/yorisou/methods/daily-check-in/definition.generated";
import { executeRecordedState, localDateForInstant } from "@/lib/yorisou/method-runtime/recordedState";
import { serverTimeIdentity, resumedTimeIdentity } from "@/lib/yorisou/methods/daily-check-in/timeContract";
import { selectAcknowledgement } from "@/lib/yorisou/methods/daily-check-in/acknowledgement";
import { sevenDaySummaries, thirtyDayView, type TimelineEntry } from "@/lib/yorisou/methods/daily-check-in/longitudinal";
import { mapDailyStoreError, readBoundedJson } from "@/lib/server/dailyCheckInApi";
import {
  createDailyRecord,
  listDailyRecordsForOwner,
  ownerHasAnyDailyRecord,
} from "@/lib/server/dailyCheckInStore";

function isoDateDaysAgo(fromLocalDate: string, days: number): string {
  const base = new Date(`${fromLocalDate}T00:00:00Z`);
  base.setUTCDate(base.getUTCDate() - days);
  return base.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const access = dailyCheckInAccess();
  if (!access.allowed) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  try {
    const url = new URL(request.url);
    const timezone = url.searchParams.get("timezone") || "Asia/Tokyo";
    const today = localDateForInstant(new Date().toISOString(), timezone) || new Date().toISOString().slice(0, 10);
    const records = await listDailyRecordsForOwner(ownerAccountId, isoDateDaysAgo(today, 30));
    const last7: TimelineEntry[] = records
      .filter((r) => r.entry_local_date >= isoDateDaysAgo(today, 6))
      .map((r) => ({ entryLocalDate: r.entry_local_date, stateValues: r.state }));
    const last30: TimelineEntry[] = records.map((r) => ({ entryLocalDate: r.entry_local_date, stateValues: r.state }));
    return NextResponse.json({
      today,
      records: records.map((r) => ({
        entryLocalDate: r.entry_local_date,
        producedAt: r.produced_at,
        timezone: r.timezone,
        stateValues: r.state,
        memo: r.memo,
        ackId: r.ack_id,
        currentVersion: r.current_version,
      })),
      sevenDay: sevenDaySummaries(last7),
      thirtyDay: thirtyDayView(last30),
    });
  } catch (error) {
    const mapped = mapDailyStoreError(error, "daily_read_failed");
    if (mapped.status === 500) console.error("daily-check-in history read failed", { code: mapped.internalCode });
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}

type CreateBody = {
  values?: unknown;
  memoOptIn?: unknown;
  memo?: unknown;
  timezone?: unknown;
  resumed?: unknown;
  completedAt?: unknown;
  // Rejected if present — canonical time identity is server-authoritative:
  producedAt?: unknown;
  entryLocalDate?: unknown;
};

export async function POST(request: Request) {
  const access = dailyCheckInAccess();
  if (!access.allowed) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const viewer = await getViewerContext();
  const ownerAccountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!ownerAccountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const read = await readBoundedJson(request);
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status });
  const body = read.body as CreateBody | null;
  if (!body || typeof body !== "object" || typeof body.values !== "object" || body.values === null) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  // §5 — an unsupported date override is REJECTED, never honored.
  if (body.producedAt !== undefined || body.entryLocalDate !== undefined) {
    return NextResponse.json({ error: "time_identity_is_server_authoritative" }, { status: 422 });
  }
  const timezone = typeof body.timezone === "string" ? body.timezone : "";
  const time =
    body.resumed === true
      ? resumedTimeIdentity(body.completedAt, timezone)
      : serverTimeIdentity(timezone);
  if (!time.ok) {
    return NextResponse.json({ error: "validation_failed", codes: [time.code] }, { status: 422 });
  }
  try {
    const values: Record<string, string | null> = {};
    for (const [k, v] of Object.entries(body.values as Record<string, unknown>)) {
      values[k] = typeof v === "string" && v ? v : null;
    }
    const execution = executeRecordedState(DAILY_CHECK_IN_RUNTIME_DEFINITION, {
      values,
      memoOptIn: body.memoOptIn === true,
      memo: typeof body.memo === "string" && body.memo ? body.memo : null,
      producedAt: time.identity.producedAt,
      entryLocalDate: time.identity.entryLocalDate,
      timezone: time.identity.timezone,
      utcOffsetMinutes: time.identity.utcOffsetMinutes,
    });
    if (!execution.ok) {
      return NextResponse.json({ error: "validation_failed", codes: execution.errors.map((e) => e.code) }, { status: 422 });
    }
    const envelope = execution.envelope;
    const firstEntryEver = !(await ownerHasAnyDailyRecord(ownerAccountId));
    const ack = selectAcknowledgement(envelope.stateValues, firstEntryEver);
    const memo = envelope.memoIncluded ? ((body.memo as string) ?? null) : null;
    const recordId = await createDailyRecord({
      ownerAccountId,
      methodVersion: envelope.provenance.methodVersion,
      schemaVersion: envelope.provenance.schemaVersion,
      ackVersion: DAILY_CHECK_IN_DEFINITION.acknowledgementVersion,
      producedAt: envelope.producedAt,
      entryLocalDate: envelope.entryLocalDate,
      timezone: envelope.timezone,
      utcOffsetMinutes: envelope.utcOffsetMinutes,
      state: envelope.stateValues,
      memo,
      ackId: ack.ackId,
    });
    return NextResponse.json(
      { recordId, entryLocalDate: envelope.entryLocalDate, ackId: ack.ackId, acknowledgementJa: ack.copyJa, currentVersion: 1 },
      { status: 201 },
    );
  } catch (error) {
    const mapped = mapDailyStoreError(error, "daily_save_failed");
    if (mapped.status === 500) console.error("daily-check-in create failed", { code: mapped.internalCode });
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
