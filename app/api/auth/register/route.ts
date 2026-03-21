import { NextResponse } from "next/server";

import { createAccount } from "@/lib/server/yorisouData";
import { bindSessionToUser, ensureViewerSession, SESSION_COOKIE } from "@/lib/server/yorisouAuth";

type RegisterPayload = {
  name?: string;
  email?: string;
  password?: string;
  city?: string;
  role?: "self" | "family" | "facility";
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as RegisterPayload;

    if (!payload.name?.trim() || !payload.email?.trim() || !payload.password?.trim() || !payload.city?.trim()) {
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    const result = await createAccount({
      name: payload.name.trim(),
      email: payload.email.trim(),
      password: payload.password,
      city: payload.city.trim(),
      role: payload.role || "family",
    });

    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.reason }, { status: 409 });
    }

    const session = await ensureViewerSession();
    await bindSessionToUser(session.id, result.account.id);

    const response = NextResponse.json({
      success: true,
      account: {
        id: result.account.id,
        name: result.account.name,
        email: result.account.email,
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
    console.error("register route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
