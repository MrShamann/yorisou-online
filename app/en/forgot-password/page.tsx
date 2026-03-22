import type { Metadata } from "next";

import PasswordResetRequestForm from "@/app/components/PasswordResetRequestForm";

export const metadata: Metadata = {
  title: "Yorisou | Forgot Password",
  description: "Send a password reset link for your Yorisou account.",
};

function getErrorMessage(code: string | undefined) {
  switch (code) {
    case "invalid_payload":
      return "Please check your email address.";
    default:
      return code ? "The request could not be completed. Please try again later." : null;
  }
}

function getNoticeMessage(code: string | undefined) {
  switch (code) {
    case "sent":
      return "If that email is registered, a reset link has been sent.";
    default:
      return null;
  }
}

export default async function ForgotPasswordPageEn({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; status?: string }>;
}) {
  const params = (await searchParams) || {};
  return (
    <PasswordResetRequestForm
      locale="en"
      initialError={getErrorMessage(params.error)}
      initialNotice={getNoticeMessage(params.status)}
    />
  );
}
