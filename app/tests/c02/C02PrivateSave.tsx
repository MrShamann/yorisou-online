"use client";

import Link from "next/link";
import { useState } from "react";

import type { C02AnswerMap } from "@/lib/yorisou-tests/c02";
import { storePendingC02Save } from "./pendingSave";

export function PrivateTestSave({ testSlug, answers }: { testSlug: "c02" | "f01" | "f02"; answers: C02AnswerMap }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "login" | "error">("idle");
  const [savedId, setSavedId] = useState<string | null>(null);

  async function save() {
    setState("saving");
    try {
      const response = await fetch(`/api/tests/${testSlug}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (response.status === 401) {
        storePendingC02Save(answers);
        setState("login");
        return;
      }
      if (!response.ok) throw new Error("save_failed");
      const payload = (await response.json()) as { saved: { id: string } };
      setSavedId(payload.saved.id);
      setState("saved");
    } catch {
      setState("error");
    }
  }

  const returnTo = `/tests/${testSlug}/return`;
  const loginHref = `/login?next=${encodeURIComponent(returnTo)}`;
  const lineHref = `/api/line/auth/start?locale=ja&intent=login&returnTo=${encodeURIComponent(returnTo)}`;

  // AIX-3D-2 — calm branded-light Understand grammar; save/login/error logic preserved verbatim.
  return (
    <section className="rounded-[1.2rem] border border-[rgba(23,59,53,0.12)] bg-white/90 px-5 py-5">
      <p className="text-[13px] font-semibold text-[#315F50]">結果を非公開で残す</p>
      <p className="mt-1 text-[13px] leading-7 text-[#5F5750]">
        回答は公開されません。ログイン後、Yorisouアカウントに紐づけて結果を見返せます。
      </p>
      {state === "saved" && savedId ? (
        <Link href={`/saved/tests/${savedId}`} className="btn mt-4 inline-flex min-h-[46px] items-center justify-center rounded-full px-5 text-sm">
          保存した結果を見る
        </Link>
      ) : state === "login" ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={loginHref} className="btn inline-flex min-h-[46px] items-center justify-center rounded-full px-5 text-sm">ログインして保存する</Link>
          <Link href={lineHref} className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-sm font-semibold text-[#315F50]">LINEでログイン</Link>
        </div>
      ) : (
        <button type="button" onClick={save} disabled={state === "saving"} className="btn mt-4 inline-flex min-h-[46px] items-center justify-center rounded-full px-5 text-sm disabled:opacity-60">
          {state === "saving" ? "保存しています" : "この結果を保存する"}
        </button>
      )}
      {state === "error" ? <p role="alert" className="mt-3 text-sm text-[#9b3a34]">保存できませんでした。時間をおいてもう一度お試しください。</p> : null}
    </section>
  );
}
