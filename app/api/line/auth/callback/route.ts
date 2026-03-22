import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getViewerContext, setViewerAccountCookie, setViewerSessionCookie } from "@/lib/server/yorisouAuth";
import { bindLineIdentity } from "@/lib/server/yorisouData";
import {
  LINE_AUTH_COOKIE,
  decodeLineAuthCookie,
  exchangeLineAuthorizationCode,
  fetchLineProfile,
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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cookieStore = await cookies();
  const lineCookie = decodeLineAuthCookie(cookieStore.get(LINE_AUTH_COOKIE)?.value);

  if (!lineCookie) {
    return NextResponse.redirect(buildReturnUrl(request, "/support?line_error=missing_auth#line-connect"), { status: 303 });
  }

  const viewer = await getViewerContext();
  const fallbackPath = `${lineCookie.returnTo.split("#")[0]}#line-connect`;

  if (!viewer.account || viewer.account.id !== lineCookie.accountId) {
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

    const account = await bindLineIdentity({
      userId: viewer.account.id,
      lineUserId: profile.userId,
      lineDisplayName: profile.displayName || idToken.name || viewer.account.supportProfile.lineDisplayName || "LINE user",
      linePictureUrl: profile.pictureUrl || idToken.picture,
      lineIdTokenSubject: idToken.sub,
    });

    if (!account) {
      return failResponse(request, `${fallbackPath.split("#")[0]}?line_error=bind_failed#line-connect`);
    }

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
    if (viewer.session) {
      setViewerSessionCookie(response, { ...viewer.session, userId: viewer.account.id });
    }
    return response;
  } catch (routeError) {
    console.error("line callback route error:", routeError);
    return failResponse(request, `${fallbackPath.split("#")[0]}?line_error=unexpected_error#line-connect`);
  }
}
