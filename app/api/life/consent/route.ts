import { NextResponse } from "next/server";

import { requireLifeViewer } from "@/lib/server/lifeOs/guard";
import { recordLifeOsConsent, revokeLifeOsConsent } from "@/lib/server/lifeOs/consentStore";

// LCO-1 — recording, and withdrawing, agreement to the Life OS explanation.
//
// IT USES THE SHARED GUARD, with `consent: "granting"`. The guard refuses a durable write until
// consent exists, so the ordinary rule would require consent in order to give consent. Naming the
// exception in the guard keeps ONE gate — route access, schema readiness and authentication all
// still apply here — rather than letting this route answer the question its own way, which is how
// a second, weaker policy gets built.
//
// The version is NOT taken from the request. A client that could name the version could record
// agreement to wording it never showed; the server uses the version that ships with the copy.

export async function POST() {
  const gate = await requireLifeViewer({ mutation: true, consent: "granting" });
  if ("refusal" in gate) return gate.refusal;
  try {
    await recordLifeOsConsent(gate.viewer.accountId);
    return NextResponse.json({ accepted: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "life_os_consent_failed" }, { status: 500 });
  }
}

export async function DELETE() {
  // Withdrawing is also "granting": someone who has already withdrawn must be able to withdraw
  // again, and someone mid-decision must not be locked out of changing it.
  const gate = await requireLifeViewer({ mutation: true, consent: "granting" });
  if ("refusal" in gate) return gate.refusal;
  try {
    const transitioned = await revokeLifeOsConsent(gate.viewer.accountId);
    return NextResponse.json({ revoked: transitioned > 0 }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "life_os_consent_failed" }, { status: 500 });
  }
}
