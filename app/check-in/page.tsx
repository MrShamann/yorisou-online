import type { Metadata } from "next";

import MiniTestFlow from "./MiniTestFlow";

const checkInMetadata: Metadata = {
  title: "チェックインをはじめる | Yorisou",
  description:
    "24問の今の状態チェックから、今のあなたに近い無料結果を受け取る Yorisou のチェックインページです。",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function isLegacyMode(params: Record<string, string | string[] | undefined>) {
  return params.legacy === "1" || params.mode === "legacy";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const params = (await searchParams) || {};
  const legacy = isLegacyMode(params);
  return {
    title: legacy ? "チェックイン | Yorisou" : checkInMetadata.title,
    description: legacy
      ? "以前の質問フローです。通常は現在のチェックインから始められます。"
      : checkInMetadata.description,
    robots: legacy ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function CheckInPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const params = (await searchParams) || {};
  const entrySource =
    typeof params.entry_source === "string"
      ? params.entry_source
      : typeof params.source === "string"
        ? params.source
        : null;

  if (isLegacyMode(params)) {
    const { default: DynamicTestEngineFlow } = await import("./DynamicTestEngineFlow");
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.97),_rgba(247,244,238,0.98)_38%,_rgba(240,244,236,0.98)_100%)] text-[var(--text)]">
        <section className="border-b border-[color:var(--line-soft)]">
          <div className="container py-10 md:py-12">
            <div className="max-w-[40rem] rounded-[1.4rem] border border-[color:var(--line-sage)] bg-[rgba(225,232,219,0.68)] p-4">
              <div className="service-kicker text-[var(--accent-sage-text)]">以前の質問フローです</div>
              <p className="mt-2 text-[14px] leading-7 text-[var(--accent-sage-text)]">
                通常は現在のチェックインから始められます。この画面は以前の流れを残したものです。
              </p>
            </div>
          </div>
        </section>
        <DynamicTestEngineFlow locale="ja" entrySource={entrySource} />
      </main>
    );
  }

  return (
    <MiniTestFlow />
  );
}
