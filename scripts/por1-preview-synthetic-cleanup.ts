// POR-1 WS8 — retire the accumulated Preview synthetic identities THROUGH THE GOVERNED PATH.
//
// Every acceptance run before this package left a `@synthetic-preview.invalid` account behind.
// Removing them with hand-written deletes would prove nothing and would quietly establish a second
// erasure path — the exact thing the deletion adapter exists to prevent. So this drives the same
// saga and the same narrow identity adapter the product drives, and it is bounded three ways:
//
//   • it refuses to run against anything but the Preview database;
//   • it will only touch accounts whose email ends in the synthetic suffix;
//   • it takes no account id, key or table name from anywhere — the list is derived, not supplied.
//
// It is idempotent: an account already erased is simply absent on the next pass.

import {
  executeDeletion,
  openDeletionJob,
  advanceToIdentityVerified,
  readDeletionStatus,
} from "../lib/server/accountDeletionOrchestrator";
import { listAccounts } from "../lib/server/yorisouData";

const SYNTHETIC_SUFFIX = "@synthetic-preview.invalid";
const PREVIEW_PROJECT_REF = "nbltsbonsnbpfptihomc";

function assertPreviewOnly() {
  const url = process.env.SUPABASE_URL ?? "";
  if (!url.includes(PREVIEW_PROJECT_REF)) {
    throw new Error(
      `refusing to run: SUPABASE_URL is not the Preview project (${PREVIEW_PROJECT_REF}). ` +
        "This script erases accounts and must never be pointed at Production.",
    );
  }
}

async function main() {
  assertPreviewOnly();

  const accounts = await listAccounts();
  const synthetic = accounts.filter((account) => account.email.endsWith(SYNTHETIC_SUFFIX));

  console.log(
    JSON.stringify({ scanned: accounts.length, synthetic: synthetic.length, suffix: SYNTHETIC_SUFFIX }),
  );

  let completed = 0;
  const unresolved: Array<{ account: string; outcome: string; code?: string }> = [];

  for (const account of synthetic) {
    // Never log the email — it is the only personal field these records carry, synthetic or not.
    const label = `${account.id.slice(0, 8)}…`;

    try {
      const existing = await readDeletionStatus(account.id);
      if (existing?.state === "completed") {
        completed += 1;
        continue;
      }

      const needsOpening = !existing || existing.state === "cancelled";
      if (needsOpening) await openDeletionJob(account.id);
      if (needsOpening || existing?.state === "requested") {
        await advanceToIdentityVerified(account.id);
      }

      const result = await executeDeletion(account.id);
      if (result.outcome === "completed") {
        completed += 1;
        console.log(`  deleted ${label}`);
      } else {
        unresolved.push({ account: label, outcome: result.outcome, code: result.errorCode });
        console.error(`  UNRESOLVED ${label} — ${result.outcome} (${result.errorCode})`);
      }
    } catch (error) {
      const code = error instanceof Error ? error.message : "unknown";
      unresolved.push({ account: label, outcome: "threw", code });
      console.error(`  THREW ${label} — ${code}`);
    }
  }

  console.log(JSON.stringify({ completed, unresolved: unresolved.length }));
  // A partial run is reported as a failure. "Mostly cleaned up" is not a state anyone should
  // discover later from a stale record.
  if (unresolved.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "unknown");
  process.exit(1);
});
