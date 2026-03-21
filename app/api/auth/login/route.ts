import { NextResponse } from "next/server";

import { findAccountByEmail, verifyPassword } from "@/lib/server/yorisouData";
import { bindSessionToUser, ensureViewerSession, SESSION_COOKIE } from "@/lib/server/yorisouAuth";

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LoginPayload;

    if (!payload.email?.trim() || !payload.password) {
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    const account = await findAccountByEmail(payload.email.trim());

    if (!account || !verifyPassword(payload.password, account.passwordHash)) {
      return NextResponse.json({ success: false, error: "invalid_credentials" }, { status: 401 });
    }

    const session = await ensureViewerSession();
    await bindSessionToUser(session.id, account.id);

    const response = NextResponse.json({
      success: true,
      account: {
        id: account.id,
        name: account.name,
        email: account.email,
      },
    });
    response.cookies.set(SESSION_COOKIE, session.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error) {
    console.error("login route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
