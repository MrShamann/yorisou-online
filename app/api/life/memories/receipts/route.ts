import { NextResponse } from "next/server";
import { memoryDeletionReceipts } from "@/lib/server/lifeOs/store";
import { lifeApiError, requireLifeViewer } from "@/lib/server/lifeOs/guard";

export const dynamic = "force-dynamic";

// WHAT A DELETED MEMORY LEAVES BEHIND.
//
// Memory Governance v1.0 §3.2 requires a receipt for deletion, and §6 requires deletion-receipt
// reconciliation. Deletion here is a hard delete, so a receipt stored on the row would die with the
// row — which is the whole problem it exists to solve. It is read instead from the append-only
// audit trail, which recorded the deletion inside the deletion's own transaction.
//
// It returns the fact and never the content, because the audit row never held any. That is not a
// limitation of this endpoint; it is what makes the trace safe to keep after an erasure.
//
// NESTED under /memories on purpose: a new top-level directory under app/api/life changes the route
// set that lib/server/__tests__/osf1Activation.test.ts pins.

export async function GET() {
  const gate = await requireLifeViewer({ mutation: false });
  if ("refusal" in gate) return gate.refusal;
  try {
    return NextResponse.json({ receipts: await memoryDeletionReceipts(gate.viewer.accountId) });
  } catch (error) {
    return lifeApiError(error);
  }
}
