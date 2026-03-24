import { NextResponse } from "next/server";

import { privacyAuditService } from "@/lib/server/foundation/privacyService";
import { getPasswordPolicyMessage, isStrongPassword } from "@/lib/passwordPolicy";
import {
  getViewerContext,
  setViewerAccountCookie,
  setViewerSessionCookie,
  withSessionPrincipalLandingShadow,
  type ViewerContext,
} from "@/lib/server/yorisouAuth";
import { findAccountById, updateAccountPassword, verifyPassword } from "@/lib/server/yorisouData";

type ChangePasswordPayload = {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  locale?: "ja" | "en";
};

function getLegacyViewerAccount(viewer: ViewerContext) {
  return viewer.legacyAccount || viewer.account;
}

export function resolveChangePasswordViewerAuthority(viewer: ViewerContext) {
  const legacyAccount = getLegacyViewerAccount(viewer);

  if (!legacyAccount) {
    return {
      authorized: false,
      effectiveLegacyAccountId: null,
      principalMatched: false,
      legacyMatched: false,
      matchedBy: "none" as const,
    };
  }

  const principalCandidates = [
    viewer.principal?.legacyAccountId || null,
    viewer.principal?.userProfileId || null,
  ].filter((entry): entry is string => Boolean(entry));
  const principalMatched = principalCandidates.includes(legacyAccount.id);

  if (viewer.principal && !principalMatched) {
    console.warn("change password viewer authority falling back to legacy account despite principal mismatch", {
      legacyAccountId: legacyAccount.id,
      principalCandidates,
      principalId: viewer.principal.userProfileId,
    });
  }

  return {
    authorized: true,
    effectiveLegacyAccountId: legacyAccount.id,
    principalMatched,
    legacyMatched: true,
    matchedBy: principalMatched ? "principal" : "legacy",
  } as const;
}

export async function POST(request: Request) {
  try {
    const viewer = await getViewerContext();
    const viewerAuthority = resolveChangePasswordViewerAuthority(viewer);

    if (!viewerAuthority.authorized) {
      return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
    }

    const effectiveLegacyAccountId = viewerAuthority.effectiveLegacyAccountId;

    if (!effectiveLegacyAccountId) {
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

    const account = await findAccountById(effectiveLegacyAccountId);

    if (!account || !verifyPassword(currentPassword, account.passwordHash)) {
      return NextResponse.json({ success: false, error: "invalid_current_password" }, { status: 400 });
    }

    const updatedAccount = await updateAccountPassword(account.id, newPassword);

    if (!updatedAccount) {
      return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
    }

    const response = NextResponse.json({ success: true });
    try {
      await privacyAuditService.recordAudit({
        actorType: "user",
        actorUserProfileId: updatedAccount.id,
        actorAuthIdentityId: null,
        action: "password.change",
        resourceType: "user_profile",
        resourceId: updatedAccount.id,
        channel: "email",
        source: "email_password",
        bindingState: "bound",
        summary: "Password changed",
      });
    } catch (foundationError) {
      console.error("change password audit error:", foundationError);
    }
    setViewerAccountCookie(response, updatedAccount);
    if (viewer.session) {
      const sessionForCookie = await withSessionPrincipalLandingShadow(
        { ...viewer.session, userId: updatedAccount.id },
        {
          legacyAccount: updatedAccount,
          source: "session_upgrade",
        },
      );
      setViewerSessionCookie(response, sessionForCookie);
    }
    return response;
  } catch (error) {
    console.error("change password route error:", error);
    return NextResponse.json({ success: false, error: "unexpected_error" }, { status: 500 });
  }
}
