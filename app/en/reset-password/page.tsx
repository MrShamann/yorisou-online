import type { Metadata } from "next";

import PasswordResetForm from "@/app/components/PasswordResetForm";
import { validatePasswordResetToken } from "@/lib/server/yorisouData";

export const metadata: Metadata = {
  title: "Yorisou | Set New Password",
  description: "Set a new password for your Yorisou account.",
};

function getErrorMessage(code: string | undefined) {
  switch (code) {
    case "expired_token":
      return "This reset link has expired.";
    case "used_token":
      return "This reset link has already been used.";
    case "weak_password":
      return "Use 12+ characters including uppercase, lowercase, number, and symbol.";
    default:
      return code ? "This reset link is invalid." : null;
  }
}

export default async function ResetPasswordPageEn({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string; error?: string }>;
}) {
  const params = (await searchParams) || {};
  const token = params.token || "";
  const validation = token ? await validatePasswordResetToken(token) : { ok: false as const };
  const derivedError = params.error || (token && "reason" in validation ? validation.reason : undefined);

  return (
    <PasswordResetForm
      locale="en"
      token={token}
      tokenValid={Boolean(token && validation.ok)}
      initialError={getErrorMessage(derivedError)}
    />
  );
}
