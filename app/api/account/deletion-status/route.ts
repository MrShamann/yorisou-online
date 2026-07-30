import { NextResponse } from "next/server";

// POR-1 — bounded deletion status.
//
// Returns a state and whether cancellation is still possible. It deliberately carries no table
// names, object keys, email, session ids or raw account id: a status endpoint that explains
// exactly what remains is an inventory of the person's data, and after finalization the account id
// itself no longer exists in the record — only a one-way fingerprint.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { readDeletionStatus } from "@/lib/server/accountDeletionOrchestrator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  const status = await readDeletionStatus(accountId);
  if (!status) return NextResponse.json({ state: null, cancellable: false }, { status: 200 });

  return NextResponse.json(
    {
      state: status.state,
      cancellable: !status.irreversible,
      // A bounded failure CLASS only. The underlying code can name internal tables.
      failed: status.state === "failed_retryable" || status.state === "failed_terminal",
      retryable: status.state === "failed_retryable",
    },
    { status: 200 },
  );
}
