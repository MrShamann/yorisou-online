import type { Metadata } from "next";

import SupportWorkspace from "@/app/components/SupportWorkspace";

export const metadata: Metadata = {
  title: "Yorisou | Support",
  description: "Yorisou's support workspace for consultation history, recommendation review, family sharing, ongoing consultation, and follow-up.",
};

export default function SupportPageEn() {
  return <SupportWorkspace locale="en" />;
}
