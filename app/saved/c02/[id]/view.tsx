"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PrivateStatePanel from "@/app/components/PrivateStatePanel";

type Saved = { result_title: string; public_summary: string; score_summary: { topDimensions: { label: string }[] }; created_at: string };

export default function C02SavedResultView({ id }: { id: string }) {
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [saved, setSaved] = useState<Saved | null>(null);
  useEffect(() => {
    fetch(`/api/tests/c02/results/${id}`).then(async (response) => {
      if (response.status === 401 || response.status === 404) return setState("missing");
      if (!response.ok) return setState("error");
      const payload = (await response.json()) as { saved: Saved };
      setSaved(payload.saved); setState("ready");
    }).catch(() => setState("error"));
  }, [id]);
  return <main className="min-h-screen bg-[linear-gradient(180deg,_#FFF9F2_0%,_#fffdf8_48%,_#F3FAF6_100%)] text-[#2F2A28]"><div className="container py-10"><div className="mx-auto max-w-[44rem] rounded-[1.35rem] bg-white/90 p-6 shadow-[0_18px_40px_rgba(23,59,53,0.08)]">{state === "loading" ? <p>保存した結果を開いています。</p> : state === "ready" && saved ? <><p className="service-kicker">保存した今のわたしチェック</p><h1 className="display-serif mt-2 text-3xl">{saved.result_title}</h1><p className="mt-4 leading-8 text-[#5F5750]">{saved.public_summary}</p><p className="mt-5 text-sm text-[#49615B]">見えた傾向: {saved.score_summary.topDimensions.map((item) => item.label).join("、")}</p><PrivateStatePanel resultId={id} /></> : <><h1 className="display-serif text-2xl">この結果は開けません</h1><p className="mt-3 leading-7 text-[#5F5750]">ログイン状態か、保存したアカウントをご確認ください。</p><Link className="btn mt-5 inline-flex rounded-full px-5 py-3" href="/tests/c02">C02に戻る</Link></>}</div></div></main>;
}
