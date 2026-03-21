import { NextResponse } from "next/server";

import { clearViewerSession, SESSION_COOKIE } from "@/lib/server/yorisouAuth";

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
  return response;
}
