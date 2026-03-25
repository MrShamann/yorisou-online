import { NextResponse } from "next/server";

import { inferLocaleFromPaths } from "@/app/api/auth/redirectLocale";
import { identityFoundationService } from "@/lib/server/foundation/identityService";
import { isStrongPassword } from "@/lib/passwordPolicy";
import { createAccount } from "@/lib/server/yorisouData";
import {
  bindSessionToUser,
  ensureViewerSession,
  setViewerAccountCookie,
  setViewerSessionCookie,
  switchSessionToPrincipalLandingTruth,
} from "@/lib/server/yorisouAuth";

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
    const locale = inferLocaleFromPaths(payload.returnTo, payload.next);
    const defaultSuccessPath = locale === "en" ? "/en/support" : "/support";
    const defaultReturnPath = locale === "en" ? "/en/register" : "/register";
    const successPath = safeRedirectPath(payload.next, defaultSuccessPath);
    returnPath = safeRedirectPath(payload.returnTo, defaultReturnPath);

    if (!payload.name?.trim() || !payload.email?.trim() || !payload.password?.trim() || !payload.city?.trim()) {
      if (isDocumentRequest) {
        return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?error=invalid_payload`), { status: 303 });
      }
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    if (!isStrongPassword(payload.password)) {
      if (isDocumentRequest) {
        return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?error=weak_password`), { status: 303 });
      }
      return NextResponse.json({ success: false, error: "weak_password" }, { status: 400 });
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
        return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?error=${result.reason}`), { status: 303 });
      }
      return NextResponse.json({ success: false, error: result.reason }, { status: 409 });
    }

    try {
      const deterministicPrincipal = await identityFoundationService.ensureDeterministicEmailPrincipalForAccount(result.account);
      if (!deterministicPrincipal.ok) {
        console.error("register canonical sync did not reach deterministic principal state:", {
          accountId: result.account.id,
          reason: deterministicPrincipal.reason,
        });
      }
    } catch (foundationError) {
      console.error("register foundation sync error:", foundationError);
    }

    const session = await ensureViewerSession();
    const boundSession =
      (await bindSessionToUser(session.id, result.account.id, {
        legacyAccount: result.account,
        source: "register",
      })) || { ...session, userId: result.account.id };
    const sessionForCookie = await switchSessionToPrincipalLandingTruth(boundSession, {
      legacyAccount: result.account,
      source: "register",
    });

    const response = isDocumentRequest
      ? NextResponse.redirect(buildRedirectUrl(request, successPath), { status: 303 })
      : NextResponse.json({
          success: true,
          account: {
            id: result.account.id,
            name: result.account.name,
            email: result.account.email,
          },
        });
    setViewerSessionCookie(response, sessionForCookie);
    setViewerAccountCookie(response, result.account);
    return response;
  } catch (error) {
    console.error("register route error:", error);
    if ((request.headers.get("content-type") || "").includes("application/x-www-form-urlencoded")) {
      return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?error=unexpected_error`), { status: 303 });
    }
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
