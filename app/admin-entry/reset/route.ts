import { NextResponse } from "next/server";

import { ACCOUNT_COOKIE, clearViewerSession, SESSION_COOKIE } from "@/lib/server/yorisouAuth";
import { LINE_AUTH_COOKIE } from "@/lib/server/yorisouLine";

function clearCookie(response: NextResponse, name: string) {
  response.cookies.set(name, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
}

export async function POST(request: Request) {
  await clearViewerSession();

  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale");
  const loginHref = locale === "en" ? "/en/login" : "/login";
  const response = NextResponse.redirect(new URL(loginHref, request.url), { status: 303 });

  clearCookie(response, SESSION_COOKIE);
  clearCookie(response, ACCOUNT_COOKIE);
  clearCookie(response, LINE_AUTH_COOKIE);

  return response;
}
