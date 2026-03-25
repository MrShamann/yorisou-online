import { NextResponse } from "next/server";

import { ACCOUNT_COOKIE, clearViewerSession, SESSION_COOKIE } from "@/lib/server/yorisouAuth";
import { LINE_AUTH_COOKIE } from "@/lib/server/yorisouLine";

export async function POST() {
  await clearViewerSession();
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
  response.cookies.set(ACCOUNT_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
  response.cookies.set(LINE_AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
  });
  return response;
}
