import type { Metadata } from "next";

import AdvisorFlow from "@/app/components/AdvisorFlow";

export const metadata: Metadata = {
  title: "Yorisou AI Mobility Advisor",
  description:
    "A calm mobility advisor from Yorisou that helps users and families organize mobility needs, receive a recommendation, and request a consultation or test ride.",
};

export default function AiAdvisorPageEn() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <AdvisorFlow locale="en" />
    </main>
  );
}
