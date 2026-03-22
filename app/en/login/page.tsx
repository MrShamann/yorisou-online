import type { Metadata } from "next";

import AccountEntryForm from "@/app/components/AccountEntryForm";
import { getViewerContext } from "@/lib/server/yorisouAuth";

export const metadata: Metadata = {
  title: "Yorisou | Login",
  description: "Log in to the Yorisou support workspace to review consultations and recommendations.",
};

function getErrorMessage(code: string | undefined) {
  switch (code) {
    case "invalid_credentials":
      return "The email address or password does not match.";
    case "invalid_payload":
      return "Please review your input.";
    default:
      return code ? "The request could not be completed. Please try again later." : null;
  }
}

function getNoticeMessage(code: string | undefined) {
  switch (code) {
    case "password_reset":
      return "Your new password has been saved. Please log in.";
    default:
      return null;
  }
}

export default async function LoginPageEn({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; notice?: string }>;
}) {
  const viewer = await getViewerContext();
  const params = (await searchParams) || {};
  return (
    <AccountEntryForm
      mode="login"
      locale="en"
      initialAccount={viewer.account}
      initialError={getErrorMessage(params.error)}
      initialNotice={getNoticeMessage(params.notice)}
    />
  );
}
