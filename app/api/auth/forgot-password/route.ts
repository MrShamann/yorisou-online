import { NextResponse } from "next/server";

import { createPasswordResetToken, findAccountByEmail } from "@/lib/server/yorisouData";
import { sendPasswordResetEmail } from "@/lib/server/yorisouMail";

type ForgotPasswordPayload = {
  email?: string;
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

async function parsePayload(request: Request): Promise<{ payload: ForgotPasswordPayload; isDocumentRequest: boolean }> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return {
      payload: (await request.json()) as ForgotPasswordPayload,
      isDocumentRequest: false,
    };
  }

  const formData = await request.formData();
  return {
    isDocumentRequest: true,
    payload: {
      email: String(formData.get("email") || ""),
      locale: (String(formData.get("locale") || "ja") === "en" ? "en" : "ja") as "ja" | "en",
      returnTo: String(formData.get("returnTo") || ""),
    },
  };
}

export async function POST(request: Request) {
  let returnPath = "/forgot-password";

  try {
    const { payload, isDocumentRequest } = await parsePayload(request);
    const locale = payload.locale === "en" ? "en" : "ja";
    returnPath = safeRedirectPath(payload.returnTo, locale === "en" ? "/en/forgot-password" : "/forgot-password");

    if (!payload.email?.trim()) {
      if (isDocumentRequest) {
        return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?error=invalid_payload`), { status: 303 });
      }
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    const account = await findAccountByEmail(normalizedEmail);

    if (account) {
      const { token } = await createPasswordResetToken({
        accountId: account.id,
        email: account.email,
      });
      const resetPath = locale === "en" ? `/en/reset-password?token=${encodeURIComponent(token)}` : `/reset-password?token=${encodeURIComponent(token)}`;
      const resetUrl = buildRedirectUrl(request, resetPath).toString();
      const delivery = await sendPasswordResetEmail({
        toEmail: account.email,
        resetUrl,
        locale,
      });

      if (!delivery.ok) {
        console.error("password reset email not sent:", delivery.reason);
      }
    }

    if (isDocumentRequest) {
      return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?status=sent`), { status: 303 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("forgot password route error:", error);
    if ((request.headers.get("content-type") || "").includes("application/x-www-form-urlencoded")) {
      return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?status=sent`), { status: 303 });
    }
    return NextResponse.json({ success: true });
  }
}
