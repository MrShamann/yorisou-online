import type { Metadata } from "next";

import AccountEntryForm from "@/app/components/AccountEntryForm";
import { getViewerContext } from "@/lib/server/yorisouAuth";

export const metadata: Metadata = {
  title: "Yorisou | Login",
  description: "Log in to the Yorisou support workspace to review consultations and recommendations.",
};

export default async function LoginPageEn() {
  const viewer = await getViewerContext();
  return <AccountEntryForm mode="login" locale="en" initialAccount={viewer.account} />;
}
