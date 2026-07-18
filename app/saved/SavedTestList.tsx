"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Row = { id: string; test_id: string; test_version: string; result_title: string; public_summary: string; created_at: string };

// AIX-3C — account-backed saved results (distinct from the device-local save).
export default function SavedTestList() {
  const [rows, setRows] = useState<Row[] | null>(null);
  useEffect(() => {
    fetch("/api/tests/results")
      .then(async (response) => {
        if (response.status === 401) return setRows([]);
        if (!response.ok) throw new Error("failed");
        setRows((await response.json() as { results: Row[] }).results);
      })
      .catch(() => setRows([]));
  }, []);

  return (
    <section className="aix2-band !pt-0">
      <div className="container">
        <div className="mx-auto max-w-[46rem]">
          <div className="aix2-panel p-6">
            <p className="aix2-eyebrow">アカウントに保存した結果</p>
            {rows === null ? (
              <p className="mt-3 text-[13px] aix2-mut">読み込んでいます。</p>
            ) : rows.length === 0 ? (
              <p className="mt-3 text-[13px] leading-7 aix2-faint">アカウントに保存した結果はまだありません。ログイン後にテスト結果を保存すると、ここから見返せます（この端末だけの簡易保存とは別です）。</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {rows.map((row) => (
                  <Link key={row.id} href={`/saved/tests/${row.id}`} className="rounded-[12px] border border-[var(--hair)] px-4 py-3 no-underline transition hover:border-[var(--hair-jade)]">
                    <p className="text-[14px] font-semibold text-[color:var(--tx)]">{row.result_title}</p>
                    <p className="mt-1 text-[11.5px] aix2-faint">{row.test_id} v{row.test_version}・{new Date(row.created_at).toLocaleDateString("ja-JP")}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
