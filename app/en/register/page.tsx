import type { Metadata } from "next";
import { redirect } from "next/navigation";

import AccountEntryForm from "@/app/components/AccountEntryForm";
import { buildSafeInternalHref, normalizeSafeInternalPath } from "@/lib/server/foundation/safeRedirect";
import { getViewerContext } from "@/lib/server/yorisouAuth";

export const metadata: Metadata = {
  title: "Create account | Yorisou",
  description: "Create an account to review your Yorisou check-in results and saved records.",
};

function getErrorMessage(code: string | undefined) {
  switch (code) {
    case "email_exists":
      return "That email address is already registered.";
    case "weak_password":
      return "Use 12+ characters including uppercase, lowercase, number, and symbol.";
    case "invalid_payload":
      return "Please review your input.";
    case "not_configured":
      return "LINE sign-up is not configured yet.";
    case "missing_auth":
      return "LINE authorization details were not found. Please try again.";
    case "session_mismatch":
      return "The current session could not be confirmed. Please try again.";
    case "cancelled":
      return "LINE sign-up was cancelled.";
    case "invalid_state":
      return "LINE verification failed. Please try again.";
    case "token_exchange":
      return "LINE authorization could not be verified.";
    case "profile_mismatch":
      return "The LINE account identity could not be confirmed.";
    case "bind_failed":
      return "The LINE sign-up result could not be saved.";
    case "unexpected_error":
      return "An unexpected error occurred during LINE sign-up.";
    default:
      return code ? "The request could not be completed. Please try again later." : null;
  }
}

function getNoticeMessage(code: string | undefined) {
  switch (code) {
    case "line_connected":
      return "LINE sign-up completed. You can continue to support.";
    default:
      return null;
  }
}

export default async function RegisterPageEn({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; line_error?: string; line_status?: string; next?: string }>;
}) {
  const viewer = await getViewerContext();
  const params = (await searchParams) || {};
  const nextPath = normalizeSafeInternalPath(params.next, "/en/support");

  if (nextPath === "/dashboard/open-testing") {
    redirect(buildSafeInternalHref("/en/login", nextPath));
  }

  if (viewer.session && viewer.account) {
    redirect(nextPath);
  }

  return (
    <AccountEntryForm
      mode="register"
      locale="en"
      initialAccount={viewer.session ? viewer.account : null}
      initialError={getErrorMessage(params.line_error || params.error)}
      initialNotice={getNoticeMessage(params.line_status === "connected" ? "line_connected" : undefined)}
      nextPath={nextPath}
    />
  );
}
