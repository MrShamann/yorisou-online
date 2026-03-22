import { NextResponse } from "next/server";

import { getPasswordPolicyMessage, isStrongPassword } from "@/lib/passwordPolicy";
import { consumePasswordResetToken } from "@/lib/server/yorisouData";

type ResetPasswordPayload = {
  token?: string;
  password?: string;
  locale?: "ja" | "en";
  returnTo?: string;
};

function safeRedirectPath(value: string | undefined, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}

function buildRedirectUrl(request: Request, path: string) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const proto = forwardedProto || (host?.includes("localhost") ? "http" : "https");

  if (host) {
    return new URL(path, `${proto}://${host}`);
  }

  return new URL(path, request.url);
}

async function parsePayload(request: Request): Promise<{ payload: ResetPasswordPayload; isDocumentRequest: boolean }> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return {
      payload: (await request.json()) as ResetPasswordPayload,
      isDocumentRequest: false,
    };
  }

  const formData = await request.formData();
  return {
    isDocumentRequest: true,
    payload: {
      token: String(formData.get("token") || ""),
      password: String(formData.get("password") || ""),
      locale: (String(formData.get("locale") || "ja") === "en" ? "en" : "ja") as "ja" | "en",
      returnTo: String(formData.get("returnTo") || ""),
    },
  };
}

export async function POST(request: Request) {
  let returnPath = "/reset-password";

  try {
    const { payload, isDocumentRequest } = await parsePayload(request);
    const locale = payload.locale === "en" ? "en" : "ja";
    returnPath = safeRedirectPath(payload.returnTo, locale === "en" ? "/en/reset-password" : "/reset-password");
    const token = payload.token?.trim() || "";

    if (!token || !payload.password?.trim()) {
      if (isDocumentRequest) {
        return NextResponse.redirect(
          buildRedirectUrl(request, `${returnPath}?token=${encodeURIComponent(token)}&error=invalid_token`),
          { status: 303 },
        );
      }
      return NextResponse.json({ success: false, error: "invalid_token" }, { status: 400 });
    }

    if (!isStrongPassword(payload.password)) {
      if (isDocumentRequest) {
        return NextResponse.redirect(
          buildRedirectUrl(request, `${returnPath}?token=${encodeURIComponent(token)}&error=weak_password`),
          { status: 303 },
        );
      }
      return NextResponse.json({ success: false, error: "weak_password", message: getPasswordPolicyMessage(locale) }, { status: 400 });
    }

    const result = await consumePasswordResetToken(token, payload.password);

    if (!result.ok) {
      if (isDocumentRequest) {
        return NextResponse.redirect(
          buildRedirectUrl(request, `${returnPath}?error=${result.reason}`),
          { status: 303 },
        );
      }
      return NextResponse.json({ success: false, error: result.reason }, { status: 400 });
    }

    const loginPath = locale === "en" ? "/en/login?notice=password_reset" : "/login?notice=password_reset";
    if (isDocumentRequest) {
      return NextResponse.redirect(buildRedirectUrl(request, loginPath), { status: 303 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("reset password route error:", error);
    if ((request.headers.get("content-type") || "").includes("application/x-www-form-urlencoded")) {
      return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?error=unexpected_error`), { status: 303 });
    }
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
