import { NextResponse } from "next/server";

import { OPEN_TESTING_SESSION_COOKIE, activateRelationship } from "@/lib/server/relationship-intelligence/service";
import { isRelationshipActivationSource } from "@/lib/server/relationship-intelligence/types";

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const source = asString(body.source);

    if (!source) {
      return NextResponse.json({ ok: false, error: "missing_activation_source" }, { status: 400 });
    }
    if (!isRelationshipActivationSource(source)) {
      return NextResponse.json({ ok: false, error: "invalid_activation_source" }, { status: 400 });
    }

    const result = await activateRelationship({
      source,
      lineUserId: asString(body.lineUserId),
      lineDisplayName: asString(body.lineDisplayName),
      lineAuthIdentityId: asString(body.lineAuthIdentityId),
      userProfileId: asString(body.userProfileId),
      route: asString(body.route),
      entrySource: asString(body.entrySource),
      sourceLabel: asString(body.sourceLabel),
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.reason }, { status: 400 });
    }

    const response = NextResponse.json({
      ok: true,
      userProfileId: result.relationshipStatus.userProfileId,
      relationshipStatusId: result.relationshipStatus.id,
    });
    response.cookies.set(OPEN_TESTING_SESSION_COOKIE, result.session.record.anonymousSessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "unexpected_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
