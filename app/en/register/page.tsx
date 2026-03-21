import type { Metadata } from "next";

import AccountEntryForm from "@/app/components/AccountEntryForm";

export const metadata: Metadata = {
  title: "Yorisou | Register",
  description: "Create a Yorisou account to review consultation history and recommendations in one place.",
};

export default function RegisterPageEn() {
  return <AccountEntryForm mode="register" locale="en" />;
}
