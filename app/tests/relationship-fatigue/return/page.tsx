"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { takePendingRFSave } from "../pendingSave";

export default function RelationshipFatigueSaveReturnPage() {
  const [state, setState] = useState<"saving" | "missing" | "error">("saving");
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    const answers = takePendingRFSave();
    if (!answers) {
      queueMicrotask(() => setState("missing"));
      return;
    }
    fetch("/api/tests/relationship-fatigue/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("save_failed");
        const payload = (await response.json()) as { saved: { id: string } };
        setSavedId(payload.saved.id);
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <main className="min-h-screen bg-[var(--yorisou-color-surface-bg)] text-[var(--yorisou-color-neutral-800)]">
      <div className="container py-12">
        <div className="mx-auto max-w-lg rounded-[1.25rem] border border-[var(--yorisou-color-neutral-100)] bg-white/95 p-6">
          {savedId ? (
            <>
              <p className="text-[15px] leading-8">結果を非公開で保存しました。</p>
              <p className="mt-1 text-[13px] leading-7 text-[var(--yorisou-color-neutral-500)]">
                保存した結果はあなたにだけ表示されます。ここから次の入口を選べます。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/saved/tests/${savedId}`}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[var(--yorisou-color-primary-500)] bg-[var(--yorisou-color-primary-500)] px-5 text-[14px] font-semibold text-white"
                >
                  保存した結果を開く
                </Link>
                <Link
                  href="/recommendations/graph"
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[var(--yorisou-color-neutral-200)] bg-white px-5 text-[14px] font-semibold text-[var(--yorisou-color-neutral-800)]"
                >
                  今の状態から選択肢を見る
                </Link>
              </div>
            </>
          ) : state === "saving" ? (
            <p className="text-[15px] leading-8">結果を非公開で保存しています。</p>
          ) : (
            <>
              <p className="text-[15px] leading-8">
                {state === "missing" ? "保存する結果が見つかりませんでした。" : "結果を保存できませんでした。"}
              </p>
              <p className="mt-1 text-[13px] leading-7 text-[var(--yorisou-color-neutral-500)]">
                もう一度チェックすると、結果を保存し直せます。
              </p>
              <Link
                href="/tests/relationship-fatigue"
                className="mt-5 inline-flex min-h-[46px] items-center justify-center rounded-full border border-[var(--yorisou-color-primary-500)] bg-[var(--yorisou-color-primary-500)] px-5 text-[14px] font-semibold text-white"
              >
                チェックに戻る
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
