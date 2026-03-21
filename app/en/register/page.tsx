import type { Metadata } from "next";

import AccountEntryForm from "@/app/components/AccountEntryForm";
import { getViewerContext } from "@/lib/server/yorisouAuth";

export const metadata: Metadata = {
  title: "Yorisou | Register",
  description: "Create a Yorisou account to review consultation history and recommendations in one place.",
};

export default async function RegisterPageEn() {
  const viewer = await getViewerContext();
  return <AccountEntryForm mode="register" locale="en" initialAccount={viewer.account} />;
}
