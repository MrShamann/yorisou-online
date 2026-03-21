import { NextResponse } from "next/server";

import { findAccountByEmail, verifyPassword } from "@/lib/server/yorisouData";
import { bindSessionToUser, ensureViewerSession, SESSION_COOKIE } from "@/lib/server/yorisouAuth";

type LoginPayload = {
  email?: string;
  password?: string;
  next?: string;
  returnTo?: string;
};

function safeRedirectPath(value: string | undefined, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}

async function parsePayload(request: Request): Promise<{ payload: LoginPayload; isDocumentRequest: boolean }> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return {
      payload: (await request.json()) as LoginPayload,
      isDocumentRequest: false,
    };
  }

  const formData = await request.formData();
  return {
    isDocumentRequest: true,
    payload: {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      next: String(formData.get("next") || ""),
      returnTo: String(formData.get("returnTo") || ""),
    },
  };
}

export async function POST(request: Request) {
  let returnPath = "/login";
  try {
    const { payload, isDocumentRequest } = await parsePayload(request);
    const successPath = safeRedirectPath(payload.next, "/support");
    returnPath = safeRedirectPath(payload.returnTo, "/login");

    if (!payload.email?.trim() || !payload.password) {
      if (isDocumentRequest) {
        return NextResponse.redirect(new URL(`${returnPath}?error=invalid_payload`, request.url), { status: 303 });
      }
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    const account = await findAccountByEmail(payload.email.trim());

    if (!account || !verifyPassword(payload.password, account.passwordHash)) {
      if (isDocumentRequest) {
        return NextResponse.redirect(new URL(`${returnPath}?error=invalid_credentials`, request.url), { status: 303 });
      }
      return NextResponse.json({ success: false, error: "invalid_credentials" }, { status: 401 });
    }

    const session = await ensureViewerSession();
    await bindSessionToUser(session.id, account.id);

    const response = isDocumentRequest
      ? NextResponse.redirect(new URL(successPath, request.url), { status: 303 })
      : NextResponse.json({
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
    if ((request.headers.get("content-type") || "").includes("application/x-www-form-urlencoded")) {
      return NextResponse.redirect(new URL(`${returnPath}?error=unexpected_error`, request.url), { status: 303 });
    }
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
