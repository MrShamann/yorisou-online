import { NextResponse } from "next/server";

// POR-1 — open (or resume) a deletion job. NOTHING destructive happens here.
//
// Opening a job on the settings page must not begin erasure: a person who navigates to the page to
// read what deletion means has not asked for it. Destruction begins only at explicit confirmation.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { deletionHasCompleted } from "@/lib/server/accountDeletionAuthority";
import { openDeletionJob, readDeletionStatus } from "@/lib/server/accountDeletionOrchestrator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  // ── AN ERASED ACCOUNT MAY NOT OPEN A NEW DELETION JOB ──────────────────────
  //
  // Resolving an account is not the same as that account still existing. `getViewerContext` looks the
  // record up in the shared store and, on a miss, falls back to the encrypted `yorisou_account`
  // cookie — a fallback that exists because the isolated Preview transport genuinely serves stale
  // reads and logging people out on a blip is its own defect. But a STALE HIT is not a miss: when the
  // store hands back a cached copy of an account that has since been erased, the record path
  // "succeeds" and the durable, fail-closed consult that `decideCookieRestoredAccount` performs on
  // the miss path never runs at all.
  //
  // The hosted concurrency acceptance caught exactly that: replaying an erased account's surviving
  // cookie, `deletion-status` and `deletion-cancel` correctly answered 401 — they consult the durable
  // job — while this route answered 200 and opened a fresh deletion job for a person who no longer
  // exists.
  //
  // The fix is deliberately NOT to move this route onto `getDeletionSurfaceViewerContext`. That
  // surface intentionally admits held and in-flight identities so a deletion can be observed while it
  // runs, and adopting it here would BROADEN the authority of an intake endpoint. Ordinary viewer
  // resolution is kept, and the same durable completed-deletion fact the other two surfaces already
  // consult is applied before anything is opened.
  //
  // `deletionHasCompleted` fails CLOSED: an unreadable durable state returns true, so a lookup
  // failure refuses rather than admits. Every cause — no such account, erased account, stale cookie,
  // durable lookup failure — produces the SAME bounded refusal, so this adds no oracle.
  if (await deletionHasCompleted(accountId)) {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }

  try {
    await openDeletionJob(accountId);
    const status = await readDeletionStatus(accountId);
    // Scope disclosure is governed COPY rendered by the UI, not data echoed from here — this
    // response carries no account content at all.
    return NextResponse.json(
      { state: status?.state ?? "requested", cancellable: !status?.irreversible },
      { status: 200 },
    );
  } catch (error) {
    console.error("account deletion open failed", {
      code: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ error: "deletion_request_failed" }, { status: 500 });
  }
}
