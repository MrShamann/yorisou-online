import { NextResponse } from "next/server";

// POR-1 — open (or resume) a deletion job. NOTHING destructive happens here.
//
// Opening a job on the settings page must not begin erasure: a person who navigates to the page to
// read what deletion means has not asked for it. Destruction begins only at explicit confirmation.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { openDeletionJob, readDeletionStatus } from "@/lib/server/accountDeletionOrchestrator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

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
