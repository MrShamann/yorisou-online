import type { Metadata } from "next";

import AdvisorFlow from "@/app/components/AdvisorFlow";

export const metadata: Metadata = {
  title: "Yorisou AI Mobility Advisor | 移動相談ガイド",
  description:
    "Yorisouのモビリティ相談ガイドです。ご本人やご家族の状況に合わせて、やさしく移動手段の候補を整理し、試乗や相談につなげます。",
};

export default function AiAdvisorPage() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <AdvisorFlow locale="ja" />
    </main>
  );
}
