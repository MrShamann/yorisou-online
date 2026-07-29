"use client";

// CPC-1 — the product previously had NO sign-out control anywhere: the frozen journey's
// "sign out -> sign in -> same state recovered" step existed only as an API route. The control
// lives on the private continuity surface because that is where the person is looking at the
// state they are about to leave — and the copy says exactly what leaving does and does not do.

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutControl() {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "working" | "failed">("idle");

  const signOut = async () => {
    setState("working");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("logout_failed");
      router.push("/login");
      router.refresh();
    } catch {
      setState("failed");
    }
  };

  return (
    <div className="mt-4 rounded-[1.25rem] border border-[rgba(23,59,53,0.12)] bg-white/90 px-5 py-4">
      <p className="text-[13px] font-semibold text-[#315F50]">アカウント</p>
      <p className="mt-1 text-[12px] leading-6 text-[#5F5750]">
        ログアウトしても、保存された記録は消えません。同じアカウントでログインし直すと、同じ状態に戻ります。
      </p>
      <button
        type="button"
        onClick={signOut}
        disabled={state === "working"}
        className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-5 text-[13px] font-semibold text-[#315F50] transition hover:border-[#173B35] disabled:opacity-60"
      >
        {state === "working" ? "ログアウトしています" : "ログアウトする"}
      </button>
      {state === "failed" ? (
        <p role="alert" className="mt-2 text-[12px] leading-6 text-[#9b3a34]">
          ログアウトできませんでした。時間をおいてもう一度お試しください。
        </p>
      ) : null}
    </div>
  );
}
