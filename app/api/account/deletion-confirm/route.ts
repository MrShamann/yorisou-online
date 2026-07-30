import { NextResponse } from "next/server";

// POR-1 — the irreversible boundary.
//
// Everything this route trusts comes from the server: the account is resolved from the session
// cookie, and the password is checked against the stored hash for THAT account. Nothing is taken
// from the request body except the two things only the person can supply — their password and an
// explicit typed confirmation.
//
// In particular it never trusts accountId, email, actor strings or an isOwner boolean from the
// client. An endpoint that deletes whatever account the body names is an account-deletion oracle
// pointed at everyone else.

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { findAccountById, verifyPassword } from "@/lib/server/yorisouData";
import {
  advanceToIdentityVerified,
  executeDeletion,
  openDeletionJob,
  readDeletionStatus,
} from "@/lib/server/accountDeletionOrchestrator";
import { requirePor1Capability } from "@/lib/server/por1RuntimeControls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The person must type this exactly. A single button is too easy to reach by accident. */
const REQUIRED_CONFIRMATION = "削除します";
const ALLOWED_KEYS = ["password", "confirmation"];

export async function POST(request: Request) {
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id;
  if (!accountId) return NextResponse.json({ error: "authentication_required" }, { status: 401 });

  // The executor is independently stoppable. When it is off the UI must not claim deletion is
  // running, so refuse here rather than opening a job that nothing will advance.
  const capability = requirePor1Capability("ACCOUNT_DELETION_EXECUTOR");
  if (!capability.allowed) {
    return NextResponse.json({ error: "deletion_temporarily_unavailable" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  // Reject unexpected fields outright: an ignored `accountId` today is a trusted one after a
  // careless refactor.
  const unexpected = Object.keys(body).find((k) => !ALLOWED_KEYS.includes(k));
  if (unexpected) {
    return NextResponse.json({ error: "unexpected_field", field: unexpected }, { status: 400 });
  }

  if (body.confirmation !== REQUIRED_CONFIRMATION) {
    return NextResponse.json({ error: "confirmation_required" }, { status: 400 });
  }

  // Reauthentication: possession of a session is not proof the person at the keyboard is the owner.
  const account = await findAccountById(accountId);
  if (!account) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  if (typeof body.password !== "string" || !verifyPassword(body.password, account.passwordHash)) {
    return NextResponse.json({ error: "reauthentication_failed" }, { status: 401 });
  }

  try {
    await openDeletionJob(accountId);
    // The saga owns the transition; an illegal one is rejected there rather than here.
    await advanceToIdentityVerified(accountId);

    const result = await executeDeletion(accountId);
    const status = await readDeletionStatus(accountId);

    if (result.outcome === "completed") {
      // The session is already revoked by the orchestrator; clear the cookie so the browser
      // stops presenting a credential that no longer resolves to anything.
      const response = NextResponse.json({ state: "completed" }, { status: 200 });
      response.cookies.delete("yorisou_session");
      response.cookies.delete("yorisou_account");
      return response;
    }

    // Bounded failure class only — the internal code can name tables.
    return NextResponse.json(
      {
        state: status?.state ?? "failed_retryable",
        retryable: result.outcome === "retryable",
      },
      { status: 202 },
    );
  } catch (error) {
    console.error("account deletion confirm failed", {
      code: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ error: "deletion_failed" }, { status: 500 });
  }
}
