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
    case "not_configured":
      return "LINE login is not configured yet.";
    case "missing_auth":
      return "LINE authorization details were not found. Please try again.";
    case "session_mismatch":
      return "The current session could not be confirmed. Please try again.";
    case "cancelled":
      return "LINE login was cancelled.";
    case "invalid_state":
      return "LINE verification failed. Please try again.";
    case "token_exchange":
      return "LINE authorization could not be verified.";
    case "profile_mismatch":
      return "The LINE account identity could not be confirmed.";
    case "bind_failed":
      return "The LINE login result could not be saved.";
    case "unexpected_error":
      return "An unexpected error occurred during LINE login.";
    default:
      return code ? "The request could not be completed. Please try again later." : null;
  }
}

function getNoticeMessage(code: string | undefined) {
  switch (code) {
    case "password_reset":
      return "Your new password has been saved. Please log in.";
    case "line_connected":
      return "LINE login completed. You can continue to support.";
    default:
      return null;
  }
}

export default async function LoginPageEn({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; notice?: string; line_error?: string; line_status?: string }>;
}) {
  const viewer = await getViewerContext();
  const params = (await searchParams) || {};
  return (
    <AccountEntryForm
      mode="login"
      locale="en"
      initialAccount={viewer.account}
      initialError={getErrorMessage(params.line_error || params.error)}
      initialNotice={getNoticeMessage(params.notice || (params.line_status === "connected" ? "line_connected" : undefined))}
    />
  );
}
