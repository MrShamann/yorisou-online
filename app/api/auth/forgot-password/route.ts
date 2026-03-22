import { NextResponse } from "next/server";

import { createPasswordResetToken, findAccountByEmail } from "@/lib/server/yorisouData";
import { sendPasswordResetEmail } from "@/lib/server/yorisouMail";

type ForgotPasswordPayload = {
  email?: string;
  locale?: "ja" | "en";
  returnTo?: string;
};

const TRACE_PREFIX = "[YORI_RESET_TRACE]";

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) {
    return "***";
  }

  if (localPart.length <= 1) {
    return `*@${domain}`;
  }

  return `${localPart[0]}***${localPart[localPart.length - 1]}@${domain}`;
}

function trace(message: string) {
  console.info(`${TRACE_PREFIX} ${message}`);
}

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
    trace(`entered method=${request.method}`);
    const { payload, isDocumentRequest } = await parsePayload(request);
    const locale = payload.locale === "en" ? "en" : "ja";
    returnPath = safeRedirectPath(payload.returnTo, locale === "en" ? "/en/forgot-password" : "/forgot-password");

    if (!payload.email?.trim()) {
      trace(`normalized email=missing`);
      if (isDocumentRequest) {
        trace(`redirect status=error_invalid_payload documentRequest=true`);
        return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?error=invalid_payload`), { status: 303 });
      }
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    const maskedEmail = maskEmail(normalizedEmail);
    trace(`normalized email=${maskedEmail}`);
    const account = await findAccountByEmail(normalizedEmail);
    trace(`account_lookup found=${Boolean(account)} email=${maskedEmail}`);

    if (account) {
      trace(`token_create_start accountId=${account.id}`);
      let token: string;

      try {
        const tokenResult = await createPasswordResetToken({
          accountId: account.id,
          email: account.email,
        });
        token = tokenResult.token;
        trace(`token_create ok=true`);
      } catch (error) {
        const details = error instanceof Error ? `name=${error.name} message=${error.message}` : "name=Unknown message=unknown";
        trace(`token_create ok=false ${details}`);
        throw error;
      }

      const resetPath = locale === "en" ? `/en/reset-password?token=${encodeURIComponent(token)}` : `/reset-password?token=${encodeURIComponent(token)}`;
      const resetUrl = buildRedirectUrl(request, resetPath).toString();
      trace(`send_start email=${maskedEmail}`);
      const delivery = await sendPasswordResetEmail({
        toEmail: account.email,
        resetUrl,
        locale,
      });
      trace(
        `send_result ok=${delivery.ok} reason=${"reason" in delivery ? delivery.reason : "none"} providerStatus=${"providerStatus" in delivery ? delivery.providerStatus : "na"}`
      );

      if (!delivery.ok) {
        console.error("password reset email not sent:", delivery.reason);
      }
    }

    if (isDocumentRequest) {
      trace(`redirect status=sent documentRequest=true`);
      return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?status=sent`), { status: 303 });
    }

    trace(`redirect status=json_success documentRequest=false`);
    return NextResponse.json({ success: true });
  } catch (error) {
    const details = error instanceof Error ? `name=${error.name} message=${error.message}` : "name=Unknown message=unknown";
    trace(`route_error ${details}`);
    console.error("forgot password route error:", error);
    if ((request.headers.get("content-type") || "").includes("application/x-www-form-urlencoded")) {
      trace(`redirect status=sent documentRequest=true`);
      return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?status=sent`), { status: 303 });
    }
    trace(`redirect status=json_success documentRequest=false`);
    return NextResponse.json({ success: true });
  }
}
