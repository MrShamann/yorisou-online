import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  bindSessionToUser,
  ensureViewerSession,
  getViewerContext,
  setViewerAccountCookie,
  setViewerSessionCookie,
  type ViewerContext,
} from "@/lib/server/yorisouAuth";
import { bindLineIdentity, findAccountById, findAccountByLineUserId } from "@/lib/server/yorisouData";
import {
  LINE_AUTH_COOKIE,
  decodeLineAuthCookie,
  exchangeLineAuthorizationCode,
  fetchLineProfile,
  inferLineLocaleFromState,
  verifyLineIdToken,
} from "@/lib/server/yorisouLine";

function buildReturnUrl(request: Request, path: string) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const proto = forwardedProto || (host?.includes("localhost") ? "http" : "https");

  if (host) {
    return new URL(path, `${proto}://${host}`);
  }

  return new URL(path, request.url);
}

function failResponse(request: Request, path: string) {
  const response = NextResponse.redirect(buildReturnUrl(request, path), { status: 303 });
  response.cookies.set(LINE_AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return response;
}

function getViewerLegacyAccount(viewer: ViewerContext) {
  return viewer.account;
}

export function resolveLineCallbackBindAuthorization(viewer: ViewerContext, expectedLegacyAccountId: string) {
  const legacyAccount = getViewerLegacyAccount(viewer);
  const legacyCandidate = legacyAccount?.id || null;
  const principalMatched = false;
  const legacyMatched = legacyCandidate === expectedLegacyAccountId;

  return {
    authorized: legacyMatched,
    principalMatched,
    legacyMatched,
    matchedBy: legacyMatched ? "legacy" : "none",
    expectedLegacyAccountId,
  } as const;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cookieStore = await cookies();
  const lineCookie = decodeLineAuthCookie(cookieStore.get(LINE_AUTH_COOKIE)?.value);

  if (!lineCookie) {
    const locale = inferLineLocaleFromState(url.searchParams.get("state")) === "en" ? "en" : "ja";
    const fallbackPath =
      locale === "en" ? "/en/support?line_error=missing_auth#line-connect" : "/support?line_error=missing_auth#line-connect";
    return NextResponse.redirect(buildReturnUrl(request, fallbackPath), { status: 303 });
  }

  const viewer = await getViewerContext();
  const fallbackPath = `${lineCookie.returnTo.split("#")[0]}#line-connect`;
  const bindAuthorization = lineCookie.accountId
    ? resolveLineCallbackBindAuthorization(viewer, lineCookie.accountId)
    : null;

  if (lineCookie.accountId && !bindAuthorization?.authorized) {
    return failResponse(request, `${fallbackPath.split("#")[0]}?line_error=session_mismatch#line-connect`);
  }

  const error = url.searchParams.get("error");
  if (error) {
    return failResponse(request, `${fallbackPath.split("#")[0]}?line_error=cancelled#line-connect`);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state || state !== lineCookie.state) {
    return failResponse(request, `${fallbackPath.split("#")[0]}?line_error=invalid_state#line-connect`);
  }

  try {
    const tokenResponse = await exchangeLineAuthorizationCode({ code });

    if (!tokenResponse.access_token || !tokenResponse.id_token) {
      return failResponse(request, `${fallbackPath.split("#")[0]}?line_error=token_exchange#line-connect`);
    }

    const idToken = verifyLineIdToken({
      idToken: tokenResponse.id_token,
      nonce: lineCookie.nonce,
    });
    const profile = await fetchLineProfile(tokenResponse.access_token);

    if (!profile.userId || profile.userId !== idToken.sub) {
      return failResponse(request, `${fallbackPath.split("#")[0]}?line_error=profile_mismatch#line-connect`);
    }

    let account = null;

    if (lineCookie.accountId) {
      const legacyViewerAccount = getViewerLegacyAccount(viewer);
      const bindTargetAccount =
        legacyViewerAccount?.id === lineCookie.accountId
          ? legacyViewerAccount
          : await findAccountById(lineCookie.accountId);

      if (!bindTargetAccount) {
        return failResponse(request, `${fallbackPath.split("#")[0]}?line_error=session_mismatch#line-connect`);
      }

      account = await bindLineIdentity({
        userId: bindTargetAccount.id,
        lineUserId: profile.userId,
        lineDisplayName: profile.displayName || idToken.name || bindTargetAccount.supportProfile.lineDisplayName || "LINE user",
        linePictureUrl: profile.pictureUrl || idToken.picture,
        lineIdTokenSubject: idToken.sub,
      });
    } else {
      account = await findAccountByLineUserId(profile.userId);
    }

    if (!account) {
      return failResponse(request, `${fallbackPath.split("#")[0]}?line_error=bind_failed#line-connect`);
    }

    const session = viewer.session || (await ensureViewerSession());
    await bindSessionToUser(session.id, account.id);
    const boundSession = { ...session, userId: account.id };

    const response = NextResponse.redirect(
      buildReturnUrl(request, `${fallbackPath.split("#")[0]}?line_status=connected#line-connect`),
      { status: 303 },
    );
    response.cookies.set(LINE_AUTH_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });
    setViewerAccountCookie(response, account);
    setViewerSessionCookie(response, boundSession);
    return response;
  } catch (routeError) {
    console.error("line callback route error:", routeError);
    return failResponse(request, `${fallbackPath.split("#")[0]}?line_error=unexpected_error#line-connect`);
  }
}
