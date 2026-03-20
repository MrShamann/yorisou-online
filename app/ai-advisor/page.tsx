import type { Metadata } from "next";

import AdvisorFlow from "@/app/components/AdvisorFlow";

export const metadata: Metadata = {
  title: "Yorisou | モビリティ相談",
  description:
    "ご本人でもご家族でも始められる、Yorisouのモビリティ相談です。いまの移動のことを短く整理し、必要に応じて個別相談へつなげます。",
};

export default function AiAdvisorPage() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] text-[#3B2F2F]">
      <AdvisorFlow locale="ja" />
    </main>
  );
}
