import { NextResponse } from "next/server";

import { getPasswordPolicyMessage, isStrongPassword } from "@/lib/passwordPolicy";
import { getViewerContext, setViewerAccountCookie, setViewerSessionCookie } from "@/lib/server/yorisouAuth";
import { findAccountById, updateAccountPassword, verifyPassword } from "@/lib/server/yorisouData";

type ChangePasswordPayload = {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  locale?: "ja" | "en";
};

export async function POST(request: Request) {
  try {
    const viewer = await getViewerContext();

    if (!viewer.account) {
      return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }

    const payload = (await request.json()) as ChangePasswordPayload;
    const locale = payload.locale === "en" ? "en" : "ja";
    const currentPassword = payload.currentPassword || "";
    const newPassword = payload.newPassword || "";
    const confirmNewPassword = payload.confirmNewPassword || "";

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ success: false, error: "password_mismatch" }, { status: 400 });
    }

    if (!isStrongPassword(newPassword)) {
      return NextResponse.json(
        { success: false, error: "weak_password", message: getPasswordPolicyMessage(locale) },
        { status: 400 },
      );
    }

    const account = await findAccountById(viewer.account.id);

    if (!account || !verifyPassword(currentPassword, account.passwordHash)) {
      return NextResponse.json({ success: false, error: "invalid_current_password" }, { status: 400 });
    }

    const updatedAccount = await updateAccountPassword(account.id, newPassword);

    if (!updatedAccount) {
      return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
    }

    const response = NextResponse.json({ success: true });
    setViewerAccountCookie(response, updatedAccount);
    if (viewer.session) {
      setViewerSessionCookie(response, { ...viewer.session, userId: updatedAccount.id });
    }
    return response;
  } catch (error) {
    console.error("change password route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
