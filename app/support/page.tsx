import type { Metadata } from "next";

import SupportWorkspace from "@/app/components/SupportWorkspace";

export const metadata: Metadata = {
  title: "ひなたに相談する | Yorisou",
  description: "Hinataと一緒に、今の気持ちや生活リズムを静かに整理し、Yorisouのチェック結果や次の一歩をふり返るためのサポートページです。医療・心理診断・専門助言ではありません。",
};

export default async function SupportPage({
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <SupportWorkspace locale="ja" />;
}
