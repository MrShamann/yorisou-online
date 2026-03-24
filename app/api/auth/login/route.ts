import { NextResponse } from "next/server";

import { findAccountByEmail, verifyPassword } from "@/lib/server/yorisouData";
import { identityFoundationService } from "@/lib/server/foundation/identityService";
import {
  bindSessionToUser,
  ensureViewerSession,
  readAccountCookieFromRequest,
  restoreAccountFromCookie,
  setViewerAccountCookie,
  setViewerSessionCookie,
  switchSessionToPrincipalLandingTruth,
  withSessionPrincipalLandingShadow,
} from "@/lib/server/yorisouAuth";
import { inferLocaleFromPaths } from "@/app/api/auth/redirectLocale";

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
    const locale = inferLocaleFromPaths(payload.returnTo, payload.next);
    const defaultSuccessPath = locale === "en" ? "/en/support" : "/support";
    const defaultReturnPath = locale === "en" ? "/en/login" : "/login";
    const successPath = safeRedirectPath(payload.next, defaultSuccessPath);
    returnPath = safeRedirectPath(payload.returnTo, defaultReturnPath);

    if (!payload.email?.trim() || !payload.password) {
      if (isDocumentRequest) {
        return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?error=invalid_payload`), { status: 303 });
      }
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    const normalizedEmail = payload.email.trim().toLowerCase();
    const accountFromStore = await findAccountByEmail(normalizedEmail);
    const accountFromCookie = readAccountCookieFromRequest(request);
    const account =
      accountFromStore ||
      (accountFromCookie && accountFromCookie.email.toLowerCase() === normalizedEmail ? accountFromCookie : null);

    if (!account || !verifyPassword(payload.password, account.passwordHash)) {
      if (isDocumentRequest) {
        return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?error=invalid_credentials`), { status: 303 });
      }
      return NextResponse.json({ success: false, error: "invalid_credentials" }, { status: 401 });
    }

    await restoreAccountFromCookie(account);
    try {
      await identityFoundationService.ensureEmailIdentityForLogin(account);
    } catch (foundationError) {
      console.error("login foundation sync error:", foundationError);
    }

    const session = await ensureViewerSession();
    const boundSession =
      (await bindSessionToUser(session.id, account.id, {
        legacyAccount: account,
        source: "email_login",
      })) || { ...session, userId: account.id };
    const shadowSession = await withSessionPrincipalLandingShadow(boundSession, {
      legacyAccount: account,
      source: "email_login",
    });
    const sessionForCookie = await switchSessionToPrincipalLandingTruth(shadowSession, {
      legacyAccount: account,
      source: "email_login",
    });

    const response = isDocumentRequest
      ? NextResponse.redirect(buildRedirectUrl(request, successPath), { status: 303 })
      : NextResponse.json({
          success: true,
          account: {
            id: account.id,
            name: account.name,
            email: account.email,
          },
        });
    setViewerSessionCookie(response, sessionForCookie);
    setViewerAccountCookie(response, account);
    return response;
  } catch (error) {
    console.error("login route error:", error);
    if ((request.headers.get("content-type") || "").includes("application/x-www-form-urlencoded")) {
      return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?error=unexpected_error`), { status: 303 });
    }
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
