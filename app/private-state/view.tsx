"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// AIX-3C — わたしの今 (private reflection space, Keep domain). Fetch logic
// preserved; reframed dark. Private-by-default; AI reflection is not diagnosis.
type State = {
  reflections: Array<{ id: string; saved_result_id: string; content: { headline: string; current_state_summary: string } }>;
  memories: Array<{ id: string; content: string }>;
  recommendations: Array<{ id: string; title: string; status: string }>;
  checkIns: Array<{ id: string; suggested_for: string | null; return_path: string }>;
};

export default function PrivateStateHome() {
  const [state, setState] = useState<State | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch("/api/private-state")
      .then(async (r) => { if (!r.ok) throw new Error(); setState((await r.json() as { state: State }).state); })
      .catch(() => setError(true));
  }, []);

  return (
    <main className="aix2">
      <section className="aix2-band aix2-band--tight">
        <div className="container">
          <div className="mx-auto max-w-[46rem]">
            <p className="aix2-eyebrow">残す・戻る · わたしの今</p>
            <h1 className="aix2-band-title mt-3">いま残している、私的な手がかり。</h1>
            <p className="aix2-lead mt-4">
              ここにある内容は、あなただけに見えるものです。AIの内容は事実や診断ではなく、振り返りとして表示します。公開されることはありません。
            </p>
            <div className="mt-6">
              <Link href="/experiences" className="aix2-btn aix2-btn-ghost !min-h-[46px] !text-[14px]">体験カードを作る</Link>
            </div>

            {error ? (
              <p className="aix2-panel mt-7 p-5 text-[14px] aix2-mut">今は読み込めませんでした。時間をおいて、もう一度お試しください。</p>
            ) : !state ? (
              <p className="aix2-panel mt-7 p-5 text-[14px] aix2-mut">読み込んでいます。</p>
            ) : (
              <div className="mt-7 grid gap-5">
                <div className="aix2-panel p-5">
                  <h2 className="text-[15px] font-bold text-[color:var(--tx)]">振り返り</h2>
                  {state.reflections.length ? state.reflections.map((item) => (
                    <Link key={item.id} href={`/saved/tests/${item.saved_result_id}`} className="mt-3 block rounded-[12px] border border-[var(--hair)] p-4 no-underline transition hover:border-[var(--hair-jade)]">
                      <p className="font-semibold text-[color:var(--tx)]">{item.content.headline}</p>
                      <p className="mt-1 text-[13px] aix2-mut">{item.content.current_state_summary}</p>
                    </Link>
                  )) : <p className="mt-2 text-[13px] aix2-faint">保存した結果から、必要なときに作成できます。</p>}
                </div>
                <div className="aix2-panel p-5">
                  <h2 className="text-[15px] font-bold text-[color:var(--tx)]">メモ</h2>
                  {state.memories.length ? state.memories.map((item) => (
                    <p key={item.id} className="mt-2 rounded-[12px] bg-[rgba(126,224,182,0.06)] p-3 text-[13.5px] aix2-mut">{item.content}</p>
                  )) : <p className="mt-2 text-[13px] aix2-faint">まだメモはありません。</p>}
                </div>
                <div className="aix2-panel p-5">
                  <h2 className="text-[15px] font-bold text-[color:var(--tx)]">次の一歩</h2>
                  {state.recommendations.length ? state.recommendations.map((item) => (
                    <p key={item.id} className="mt-2 text-[13.5px] text-[color:var(--tx)]">{item.title} <span className="aix2-faint">・{item.status}</span></p>
                  )) : <p className="mt-2 text-[13px] aix2-faint">今の状態に合う一歩は、<Link href="/recommendations" className="aix2-link">見つける</Link>から探せます。</p>}
                </div>
                <div className="aix2-panel p-5">
                  <h2 className="text-[15px] font-bold text-[color:var(--tx)]">振り返る目安</h2>
                  {state.checkIns.length ? state.checkIns.map((item) => (
                    <Link key={item.id} href={item.return_path} className="mt-2 block text-[13.5px] aix2-link">{item.suggested_for ? new Date(item.suggested_for).toLocaleDateString("ja-JP") : "次回"}に見返す</Link>
                  )) : <p className="mt-2 text-[13px] aix2-faint">目安はまだありません。</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
