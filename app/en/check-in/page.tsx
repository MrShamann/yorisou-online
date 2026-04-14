import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find your support pattern | Yorisou",
  description: "A mobile-first LINE MINI App flow that helps you find the kind of support that fits you right now.",
};

export default async function EnglishCheckInPage({
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { default: DynamicTestEngineFlow } = await import("@/app/check-in/DynamicTestEngineFlow");
  return <DynamicTestEngineFlow locale="en" />;
}
