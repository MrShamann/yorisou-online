import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "今の寄り添い方を見つける | Yorisou",
  description: "YorisouのLINE MINI Appで、今の気持ちに合う寄り添い方をやさしく見つけるモバイルファーストのチェックです。",
};

export default async function CheckInPage({
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { default: DynamicTestEngineFlow } = await import("./DynamicTestEngineFlow");
  return <DynamicTestEngineFlow locale="ja" />;
}
