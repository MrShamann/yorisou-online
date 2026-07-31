import { NextResponse } from "next/server";

import { inferLocaleFromPaths } from "@/app/api/auth/redirectLocale";
import { normalizeSafeInternalPath } from "@/lib/server/foundation/safeRedirect";
import { isStrongPassword } from "@/lib/passwordPolicy";
import { provisionRegistration } from "@/lib/server/identityProvisioning";
import { provisioningHttpStatus } from "@/lib/server/identityProvisioningRollout";
import { setViewerAccountCookie, setViewerSessionCookie } from "@/lib/server/yorisouAuth";

type RegisterPayload = {
  name?: string;
  email?: string;
  password?: string;
  city?: string;
  role?: "self" | "family" | "facility";
  next?: string;
  returnTo?: string;
};

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
      role: (formData.get("role") as RegisterPayload["role"]) || "self",
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
    const successPath = normalizeSafeInternalPath(payload.next, defaultSuccessPath);
    returnPath = normalizeSafeInternalPath(payload.returnTo, defaultReturnPath);

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

    // POR-1 — one provisioning operation, and its result is the response.
    //
    // What used to be here: create the account, TRY the canonical identity and swallow both its
    // `ok === false` and its throw, then bind a session (falling back to an in-memory object when
    // the bind did not land) and return 200. Three ways to answer "your account exists" over an
    // account that only half did.
    //
    // `provisionRegistration` returns `completed` only when every required piece of canonical
    // identity has been READ BACK after being written. Everything else is a bounded, honest outcome.
    const result = await provisionRegistration({
      name: payload.name.trim(),
      email: payload.email.trim(),
      password: payload.password,
      city: payload.city.trim(),
      role: payload.role || "self",
    });

    // Bounded, non-PII observability. Never the email, the account id, the session id or the body.
    console.info("por1.registration", {
      outcome: result.outcome,
      failureClass: result.outcome === "completed" ? null : result.failureClass,
      detail: result.outcome === "completed" ? null : (result.detail ?? null),
      durationMs: result.durationMs,
      resumed: result.outcome === "completed" ? result.resumed : null,
      attemptCount: result.outcome === "completed" ? result.attemptCount : null,
    });

    if (result.outcome !== "completed") {
      const status = provisioningHttpStatus(result.outcome);
      // The redirect vocabulary is the same set, so a document request is told the same truth as an
      // API one. `email_exists` keeps its existing wording: the account-existence oracle is
      // unchanged by this work, neither widened nor narrowed.
      const errorCode = result.outcome === "email_exists" ? "email_exists" : `provisioning_${result.outcome}`;
      if (isDocumentRequest) {
        return NextResponse.redirect(buildRedirectUrl(request, `${returnPath}?error=${errorCode}`), { status: 303 });
      }
      return NextResponse.json({ success: false, error: errorCode }, { status });
    }

    // Only here — past a proven canonical identity — may an authenticated cookie be issued. A
    // browser must never leave this route authenticated as a partial principal.
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
    setViewerSessionCookie(response, result.session);
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
