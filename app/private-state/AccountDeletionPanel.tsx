"use client";

// POR-1 — account deletion, in the person's own account area.
//
// Two rules shape this surface:
//
// 1. NO DARK PATTERNS. No waiting period, no "are you really sure" chain, no instruction to
//    contact support, no guilt copy. Someone who wants to leave is entitled to leave. The one
//    piece of friction — typing 削除します — exists because the action is irreversible, not to
//    change their mind.
//
// 2. NEVER CLAIM MORE THAN THE SERVER DID. A failure must not render as success, and a completed
//    deletion must not overstate what was removed. The list below matches what the saga and the
//    identity adapter actually erase.

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DeletionState =
  | "requested" | "identity_verified" | "locked" | "database_erasure" | "storage_erasure"
  | "identity_erasure" | "verifying" | "completed"
  | "failed_retryable" | "failed_terminal" | "cancelled" | "legal_hold";

type Status = { state: DeletionState | null; cancellable: boolean; retryable?: boolean };

const CONFIRMATION = "削除します";

const REMOVED = [
  "アカウントとログイン情報",
  "保存された結果と、その内容",
  "「合っている / 選び直した / しっくりこない / 保留」の答えの記録",
  "ヒントと、それに対する反応の記録",
  "チェックの回答そのもの",
  "LINEとのつながり",
  "ログイン中のすべての端末のセッション",
];

const IN_PROGRESS: DeletionState[] = [
  "identity_verified", "locked", "database_erasure", "storage_erasure", "identity_erasure", "verifying",
];

export default function AccountDeletionPanel() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ state: null, cancellable: false });
  // A 401 IS NOT A DELETION RECEIPT. Once the account is erased the status endpoint stops
  // answering — correctly, because there is no longer an identity to answer. That refusal proves
  // only that this browser can no longer authenticate. Tracked separately from `status` so it can
  // never be mistaken for a state the server reported.
  const [statusVisible, setStatusVisible] = useState(true);
  // Set ONLY from a confirm response, which is the one place the browser observes the completion
  // transition while still authenticated. Nothing inferred from a failed request may set it.
  const [completedByConfirm, setCompletedByConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/account/deletion-status", { cache: "no-store" });
      if (res.ok) {
        setStatus((await res.json()) as Status);
        setStatusVisible(true);
        return;
      }
      if (res.status === 401) {
        // Terminal for this view: the credential no longer resolves, so polling can only repeat the
        // same refusal. What it must NOT do is keep rendering the last in-flight state as if the
        // deletion were still observably running, or upgrade it to success.
        setStatusVisible(false);
      }
    } catch {
      // A status read failure must not be rendered as "nothing is happening".
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // While erasure runs the person may close the tab; the job continues server-side. Polling only
  // keeps THIS view honest — and stops at the terminal transition rather than spinning against an
  // endpoint that has already said no.
  useEffect(() => {
    if (!statusVisible || completedByConfirm) return;
    if (!status.state || !IN_PROGRESS.includes(status.state)) return;
    const timer = setInterval(() => void refresh(), 3000);
    return () => clearInterval(timer);
  }, [status.state, statusVisible, completedByConfirm, refresh]);

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account/deletion-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmation: typed }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string; state?: DeletionState };

      if (res.status === 401) {
        setError("パスワードが確認できませんでした。もう一度入力してください。");
        return;
      }
      if (res.status === 503) {
        setError("いまは削除の処理を開始できません。時間をおいてもう一度お試しください。");
        return;
      }
      if (!res.ok && res.status !== 202) {
        setError("削除を開始できませんでした。時間をおいてもう一度お試しください。");
        return;
      }

      setPassword("");
      if (body.state === "completed") {
        setCompletedByConfirm(true);
        setStatus({ state: "completed", cancellable: false });
        // The account no longer exists; stay on a truthful terminal screen rather than bouncing
        // them into a logged-out app that looks like an error. No further status read is made —
        // there is nothing left to authenticate, and this response is the completion evidence.
        return;
      }
      await refresh();
    } catch {
      // Deliberately does NOT say "not deleted": an ambiguous network failure may have started it.
      setError("処理の状況を確認できませんでした。この画面を開き直すと、いまの状態が表示されます。");
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    setBusy(true);
    try {
      await fetch("/api/account/deletion-cancel", { method: "POST" });
      await refresh();
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  // Rendered on the confirm response alone. `status.state` is never trusted for this: the status
  // endpoint refuses an erased identity, so a "completed" arriving from anywhere else would mean
  // something other than what this screen claims.
  if (completedByConfirm) {
    return (
      <section className="rounded-[1.25rem] border border-[rgba(23,59,53,0.12)] bg-white/90 px-5 py-5">
        <h2 className="text-[14px] font-semibold text-[#315F50]">アカウントを削除しました</h2>
        <p className="mt-2 text-[13px] leading-7 text-[#5F5750]">
          ログイン情報と、保存されていた記録を削除しました。同じアカウントでログインすることはできません。
          ご利用ありがとうございました。
        </p>
      </section>
    );
  }

  // THE HONEST ANSWER TO A REFUSAL. It says what is true — this browser can no longer be
  // authenticated — and deliberately claims neither success nor failure of the deletion itself,
  // because a 401 is evidence of neither.
  if (!statusVisible) {
    return (
      <section className="rounded-[1.25rem] border border-[rgba(23,59,53,0.12)] bg-white/90 px-5 py-5">
        <h2 className="text-[14px] font-semibold text-[#315F50]">いまの状態を表示できません</h2>
        <p className="mt-2 text-[13px] leading-7 text-[#5F5750]" role="status">
          ログイン情報が確認できないため、この画面では削除の状態をお伝えできません。
          もう一度ログインすると、いまの状態を確認できます。
          ログインできない場合は、お問い合わせからご連絡ください。
        </p>
      </section>
    );
  }

  if (status.state && IN_PROGRESS.includes(status.state)) {
    return (
      <section className="rounded-[1.25rem] border border-[rgba(23,59,53,0.12)] bg-white/90 px-5 py-5">
        <h2 className="text-[14px] font-semibold text-[#315F50]">削除の処理中です</h2>
        <p className="mt-2 text-[13px] leading-7 text-[#5F5750]" aria-live="polite">
          この画面を閉じても処理は続きます。あとから開き直すと、いまの状態を確認できます。
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[1.25rem] border border-[rgba(23,59,53,0.12)] bg-white/90 px-5 py-5">
      <h2 className="text-[14px] font-semibold text-[#315F50]">アカウントを削除する</h2>
      <p className="mt-2 text-[13px] leading-7 text-[#5F5750]">
        アカウントごと削除します。結果だけを消したい場合は、上の各結果から個別に削除できます。
      </p>

      {status.state === "failed_retryable" || status.state === "failed_terminal" ? (
        <p role="alert" className="mt-3 text-[13px] leading-6 text-[#9b3a34]">
          {status.state === "failed_retryable"
            ? "削除の途中で問題が起きました。もう一度実行できます。"
            : "削除を続けられませんでした。お問い合わせからご連絡ください。"}
        </p>
      ) : null}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 text-[13px] font-semibold text-[#9b3a34] underline"
        >
          アカウント削除に進む
        </button>
      ) : (
        <div className="mt-4">
          <p className="text-[13px] font-semibold text-[#2F2A28]">削除されるもの</p>
          <ul className="mt-1 list-disc pl-5 text-[12px] leading-6 text-[#5F5750]">
            {REMOVED.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] leading-6 text-[#7A7068]">
            削除したことの記録だけが、内容を含まない形で残ります。元に戻すことはできません。
          </p>

          <label className="mt-4 block text-[13px] font-semibold text-[#2F2A28]">
            パスワード
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-1 w-full rounded-[0.75rem] border border-[rgba(23,59,53,0.16)] px-3 py-2 text-[14px]"
            />
          </label>

          <label className="mt-3 block text-[13px] font-semibold text-[#2F2A28]">
            確認のため「{CONFIRMATION}」と入力してください
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="mt-1 w-full rounded-[0.75rem] border border-[rgba(23,59,53,0.16)] px-3 py-2 text-[14px]"
            />
          </label>

          {error ? (
            <p role="alert" className="mt-3 text-[13px] leading-6 text-[#9b3a34]">
              {error}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={confirm}
              disabled={busy || typed !== CONFIRMATION || password.length === 0}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#9b3a34] bg-[#9b3a34] px-4 text-[13px] font-semibold text-white disabled:opacity-50"
            >
              {busy ? "処理しています" : "アカウントを削除する"}
            </button>
            <button
              type="button"
              onClick={status.state && status.cancellable ? cancel : () => setOpen(false)}
              disabled={busy}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(23,59,53,0.14)] bg-white px-4 text-[13px] font-semibold text-[#315F50]"
            >
              やめる
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
