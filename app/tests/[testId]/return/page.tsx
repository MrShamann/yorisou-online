"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { takePendingC02Save } from "../../c02/pendingSave";

export default function TestSaveReturnPage({ params }: { params: Promise<{ testId: string }> }) {
  const [testId, setTestId] = useState<string | null>(null); const [state, setState] = useState<"saving" | "missing" | "error">("saving"); const [savedId, setSavedId] = useState<string | null>(null);
  useEffect(() => { params.then(({ testId: value }) => setTestId(value)); }, [params]);
  useEffect(() => { if (!testId) return; const answers = takePendingC02Save(); if (!answers) { queueMicrotask(() => setState("missing")); return; } fetch(`/api/tests/${testId}/results`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) }).then(async (response) => { if (!response.ok) throw new Error("save_failed"); const payload = (await response.json()) as { saved: { id: string } }; setSavedId(payload.saved.id); }).catch(() => setState("error")); }, [testId]);
  return <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]"><div className="container py-12"><div className="mx-auto max-w-lg rounded-[1.25rem] bg-white p-6">{savedId ? <><p>結果を非公開で保存しました。</p><Link href={`/saved/tests/${savedId}`} className="btn mt-5 inline-flex rounded-full px-5 py-3">保存した結果を開く</Link></> : state === "saving" ? <p>結果を非公開で保存しています。</p> : <><p>{state === "missing" ? "保存する結果が見つかりませんでした。" : "結果を保存できませんでした。"}</p><Link href={`/tests/${testId || "c02"}`} className="btn mt-5 inline-flex rounded-full px-5 py-3">テストに戻る</Link></>}</div></div></main>;
}
