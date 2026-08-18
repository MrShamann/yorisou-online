import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { listMemoryPage } from "@/lib/server/lifeOs/store";
import MemoryList from "./MemoryList";
import SignInRequired from "../SignInRequired";
import { resolveLifeOsRouteAccess } from "@/lib/server/lifeOs/routeAccess";

export const metadata: Metadata = {
  title: "覚えていること | Yorisou",
  description: "あなたが確認したものだけが残ります。いつでも消せます。",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function MemoriesPage() {
  // OSF-1 FEATURE GATE. Default CLOSED: production and unknown contexts 404 before any
  // session lookup or database read. Route-concealing, following pilotRouteAccess.
  // ONE authority for the gate AND the viewer: resolving them separately is how a page ends
  // up scoping data to a different identity than the one that passed the gate.
  const access = await resolveLifeOsRouteAccess();
  if (!access.allowed) notFound();
  const accountId = access.accountId;
  if (!accountId) {
    return (
      <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
        <SignInRequired next="/life/memories" purpose="覚えておくことを、自分で決める。" />
      </main>
    );
  }
  // The first page only. Everything after it is reachable through the cursor rather than through a
  // larger number — see listMemoryPage for why a bigger cap is the wrong fix.
  const page = await listMemoryPage(accountId).catch(() => ({ memories: [], nextCursor: null }));
  return (
    <main className="mx-auto w-full max-w-[var(--pxr-content-width)] px-5 pb-28 pt-10">
      <p className="text-[13px] font-medium tracking-[0.04em] text-[var(--pxr-text-muted)]">わたしの記録</p>
      <h1 className="mt-3 text-[24px] font-semibold leading-[1.55] tracking-[-0.01em] text-[var(--pxr-text-primary)]">
        覚えていること。
      </h1>
      <p className="mt-3 text-[15px] leading-[var(--pxr-leading-body)] text-[var(--pxr-text-secondary)]">
        あなたが「覚えておく」と決めたものだけが、ここにあります。忘れると、消えます。
      </p>
      <MemoryList initialMemories={page.memories} initialCursor={page.nextCursor} />

      <Link
        href="/life"
        className="mt-9 inline-flex min-h-[var(--pxr-touch-target)] items-center text-[15px] font-medium text-[var(--pxr-accent)]"
      >
        わたしの記録へ
      </Link>
    </main>
  );
}
