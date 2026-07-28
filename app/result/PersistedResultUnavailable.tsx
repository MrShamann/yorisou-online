import Link from "next/link";
// UX-2 / ICP-1 — the safe state for a persisted result the caller may not read.
//
// Deliberately identical for missing, invalid, unauthorized, expired and erased results, so the
// page never reveals whether a given result id exists.

export default function PersistedResultUnavailable() {
  return (
    <main className="container py-16">
      <div className="mx-auto max-w-[34rem] space-y-4">
        <h1 className="display-serif text-[1.75rem] leading-[1.3] text-[#22201D]">
          この結果は表示できません
        </h1>
        <p className="text-[14px] leading-7 text-[#6F6760]">
          結果が見つからないか、保存できる期間が過ぎたか、削除された可能性があります。
          結果はご本人だけが見られるようになっています。
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/check-in"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full px-5 text-[15px] no-underline"
            style={{ background: "#173B35", color: "#fff", fontWeight: 700 }}
          >
            もう一度はじめる
          </Link>
          <Link
            href="/login"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border px-5 text-[15px] no-underline"
            style={{ borderColor: "rgba(23,59,53,0.2)", color: "#315F50", fontWeight: 700 }}
          >
            ログインして確認する
          </Link>
        </div>
      </div>
    </main>
  );
}
