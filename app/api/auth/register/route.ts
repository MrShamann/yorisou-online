import { NextResponse } from "next/server";

import { createAccount } from "@/lib/server/yorisouData";
import { bindSessionToUser, ensureViewerSession, SESSION_COOKIE } from "@/lib/server/yorisouAuth";

type RegisterPayload = {
  name?: string;
  email?: string;
  password?: string;
  city?: string;
  role?: "self" | "family" | "facility";
  next?: string;
  returnTo?: string;
};

function safeRedirectPath(value: string | undefined, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}

async function parsePayload(request: Request): Promise<{ payload: RegisterPayload; isDocumentRequest: boolean }> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return {
      payload: (await request.json()) as RegisterPayload,
      isDocumentRequest: false,
    };
  }

  const formData = await request.formData();
  return {
    isDocumentRequest: true,
    payload: {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      city: String(formData.get("city") || ""),
      role: (formData.get("role") as RegisterPayload["role"]) || "family",
      next: String(formData.get("next") || ""),
      returnTo: String(formData.get("returnTo") || ""),
    },
  };
}

export async function POST(request: Request) {
  let returnPath = "/register";
  try {
    const { payload, isDocumentRequest } = await parsePayload(request);
    const successPath = safeRedirectPath(payload.next, "/support");
    returnPath = safeRedirectPath(payload.returnTo, "/register");

    if (!payload.name?.trim() || !payload.email?.trim() || !payload.password?.trim() || !payload.city?.trim()) {
      if (isDocumentRequest) {
        return NextResponse.redirect(new URL(`${returnPath}?error=invalid_payload`, request.url), { status: 303 });
      }
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
      if (isDocumentRequest) {
        return NextResponse.redirect(new URL(`${returnPath}?error=${result.reason}`, request.url), { status: 303 });
      }
      return NextResponse.json({ success: false, error: result.reason }, { status: 409 });
    }

    const session = await ensureViewerSession();
    await bindSessionToUser(session.id, result.account.id);

    const response = isDocumentRequest
      ? NextResponse.redirect(new URL(successPath, request.url), { status: 303 })
      : NextResponse.json({
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
    if ((request.headers.get("content-type") || "").includes("application/x-www-form-urlencoded")) {
      return NextResponse.redirect(new URL(`${returnPath}?error=unexpected_error`, request.url), { status: 303 });
    }
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
