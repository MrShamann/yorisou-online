import { NextResponse } from "next/server";

import {
  createGuestMigrationJob,
  transitionGuestMigrationJob,
  upsertAdaptationState,
} from "@/lib/server/app2ServiceBackend";
import { getViewerContext } from "@/lib/server/yorisouAuth";

// WS-E — guest→account migration endpoint.
//
// Carries this device's public-safe guest journey (need/pace/result family +
// saved/tried/hidden item ids — NEVER raw answers or PII) into the signed-in
// account's persisted adaptation state. Properties:
//   • authenticated — only the account owner can migrate into their own account.
//   • idempotent — the same idempotencyKey never runs twice or double-writes.
//   • transactional with compensating rollback — a failure transitions the job
//     to `failed` (and the account state upsert is atomic, so no partial merge).
//   • no silent identity merge — the job is scoped to THIS account id; two
//     accounts are never combined.
//   • no raw answers in the URL — POST body only; nothing sensitive is logged.

type MigrationBody = {
  idempotencyKey?: string;
  guestRef?: string | null;
  provenance?: string;
  need?: string | null;
  pace?: "quick" | "deep" | null;
  lastResultFamily?: string | null;
  savedItemIds?: string[];
  triedItemIds?: string[];
  hiddenItemIds?: string[];
};

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string").slice(0, 200) : [];
}

export async function POST(request: Request) {
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id;
  if (!accountId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as MigrationBody | null;
  const idempotencyKey = body?.idempotencyKey?.trim();
  if (!idempotencyKey || idempotencyKey.length < 8) {
    return NextResponse.json({ error: "missing_idempotency_key" }, { status: 400 });
  }

  const savedItemIds = asStringArray(body?.savedItemIds);
  const triedItemIds = asStringArray(body?.triedItemIds);
  const hiddenItemIds = asStringArray(body?.hiddenItemIds);

  try {
    // 1) Idempotent job creation. If this key already ran, we get the existing
    //    job back with its terminal status and DO NOT re-run the side-effect.
    const job = await createGuestMigrationJob({
      idempotencyKey,
      accountId,
      guestRef: body?.guestRef ?? null,
      provenance: body?.provenance ?? "device_local",
      savedItemCount: savedItemIds.length,
    });

    if (job.status === "succeeded") {
      return NextResponse.json({ status: "duplicate", jobId: job.id, migrated: false });
    }
    if (job.status === "compensated" || job.status === "cancelled") {
      return NextResponse.json({ status: job.status, jobId: job.id, migrated: false });
    }

    // 2) Run: mark running, perform the atomic account-state upsert, mark done.
    try {
      if (job.status === "pending") {
        await transitionGuestMigrationJob({ jobId: job.id, toStatus: "running", eventType: "started", detail: "migration started" });
      }

      await upsertAdaptationState({
        accountId,
        need: body?.need ?? null,
        pace: body?.pace ?? null,
        lastResultFamily: body?.lastResultFamily ?? null,
        savedItemIds,
        triedItemIds,
        hiddenItemIds,
      });

      const done = await transitionGuestMigrationJob({
        jobId: job.id,
        toStatus: "succeeded",
        eventType: "succeeded",
        detail: "adaptation state migrated",
      });
      return NextResponse.json({ status: "succeeded", jobId: done.id, migrated: true });
    } catch (runError) {
      // 3) Compensating rollback: no partial account merge persisted; mark failed
      //    so a later retry can resume from a clean, known state.
      const message = runError instanceof Error ? runError.message : "run_failed";
      await transitionGuestMigrationJob({
        jobId: job.id,
        toStatus: "failed",
        eventType: "failed",
        errorCode: message.slice(0, 100),
        detail: "migration failed; compensated",
      }).catch(() => {});
      return NextResponse.json({ status: "failed", jobId: job.id, migrated: false, error: message }, { status: 500 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "migration_error";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
