import type { Metadata } from "next";

import AccountEntryForm from "@/app/components/AccountEntryForm";

export const metadata: Metadata = {
  title: "Yorisou | Login",
  description: "Log in to the Yorisou support workspace to review consultations and recommendations.",
};

export default function LoginPageEn() {
  return <AccountEntryForm mode="login" locale="en" />;
}
