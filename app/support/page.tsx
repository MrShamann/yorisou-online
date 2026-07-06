import type { Metadata } from "next";

import SupportWorkspace from "@/app/components/SupportWorkspace";

export const metadata: Metadata = {
  title: "Yorisou サポート | Yorisou",
  description:
    "Yorisouのログイン状態やアクセス権限を確認するためのサポートページです。Founder dashboard には、管理者として許可されたメールアドレスでログインする必要があります。",
};

export default async function SupportPage({
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <SupportWorkspace locale="ja" />;
}
