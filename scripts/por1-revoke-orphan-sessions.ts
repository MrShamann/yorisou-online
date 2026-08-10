// POR-1 — remove sessions orphaned by the pre-fix revocation, through the governed adapter.
//
// These are sessions whose account is already erased but whose principal-landing contract still
// names it — the residue the isolated-store probe found. They are removed by ACCOUNT ID through
// `revokeAccountSessions`, not by object path: the adapter decides which objects an account owns,
// and that is the only interface this script is allowed to use.
//
// Idempotent. Verifies afterwards. Refuses any database that is not the isolated Preview project.

import { revokeAccountSessions } from "../lib/server/accountIdentityDeletion";

const PREVIEW_PROJECT_REF = "nbltsbonsnbpfptihomc";

async function main() {
  const accountId = process.env.POR1_ORPHAN_ACCOUNT_ID?.trim();
  if (!accountId) throw new Error("POR1_ORPHAN_ACCOUNT_ID is required");
  if (!(process.env.SUPABASE_URL ?? "").includes(PREVIEW_PROJECT_REF)) {
    throw new Error("refusing to run outside the isolated Preview project");
  }

  const revoked = await revokeAccountSessions(accountId);
  // Never log the account id or any session id.
  console.log(JSON.stringify({ revoked }));

  const again = await revokeAccountSessions(accountId);
  console.log(JSON.stringify({ secondPassRevoked: again, idempotent: again === 0 }));
  if (again !== 0) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "unknown");
  process.exit(1);
});
