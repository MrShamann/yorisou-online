import type { Metadata } from "next";

import { getViewerContext } from "@/lib/server/yorisouAuth";
import { listMemories } from "@/lib/server/lifeOs/store";
import MemoryList from "./MemoryList";
import SignInRequired from "../SignInRequired";

export const metadata: Metadata = {
  title: "覚えていること | Yorisou",
  description: "あなたが確認したものだけが残ります。いつでも消せます。",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function MemoriesPage() {
  const viewer = await getViewerContext();
  const accountId = viewer.account?.id || viewer.legacyAccount?.id || null;
  if (!accountId) {
    return (
      <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
        <SignInRequired next="/life/memories" purpose="覚えておくことを、自分で決める。" />
      </main>
    );
  }
  const memories = await listMemories(accountId).catch(() => []);
  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">わたしの記録</p>
      <h1 className="mt-3 text-[24px] font-semibold leading-[1.55] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        覚えていること。
      </h1>
      <p className="mt-3 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
        あなたが「覚えておく」と決めたものだけが、ここにあります。忘れると、消えます。
      </p>
      <MemoryList initialMemories={memories} />
    </main>
  );
}
