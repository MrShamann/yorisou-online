"use client";
// DCI-1 — daily-check-in「きょうの空模様」one-screen Japanese mobile-first flow.
// All copy comes from the canonical generated artifact (never authored here).
// Low-pressure by design: no countdown, no completion pressure, no streaks,
// no gamification. Acknowledgement is deterministic canonical copy — no score.

import { useCallback, useEffect, useMemo, useState } from "react";
import { DAILY_CHECK_IN_DEFINITION } from "@/lib/yorisou/methods/daily-check-in/definition.generated";
import { selectAcknowledgement } from "@/lib/yorisou/methods/daily-check-in/acknowledgement";
import { hintForEntry } from "@/lib/yorisou/methods/daily-check-in/hints";
import { localDateForInstant } from "@/lib/yorisou/method-runtime/recordedState";
import { optionLabelJa } from "@/lib/yorisou/methods/daily-check-in/longitudinal";
import { storePendingDailyEntry, takePendingDailyEntry, type PendingDailyEntry } from "./pendingEntry";

const DEF = DAILY_CHECK_IN_DEFINITION;
const COPY = DEF.copy;

type HistoryPayload = {
  today: string;
  records: {
    entryLocalDate: string;
    stateValues: Record<string, string | null>;
    memo: string | null;
    ackId: string;
    currentVersion: number;
  }[];
  sevenDay: { summaries: { summaryId: string; copyJa: string }[]; insufficientCopyJa: string | null };
  thirtyDay: { sufficient: boolean; insufficientCopyJa: string | null; mostFrequentNeedJa: string | null };
};

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; version: number }
  | { kind: "login_needed" }
  | { kind: "exists" }
  | { kind: "backend_unavailable" }
  | { kind: "error" };

function browserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Tokyo";
  } catch {
    return "Asia/Tokyo";
  }
}

export function DailyCheckInFlow({ authenticated }: { authenticated: boolean }) {
  const timezone = useMemo(() => browserTimezone(), []);
  const [values, setValues] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(DEF.fields.map((f) => [f.fieldId, null])),
  );
  const [memoOptIn, setMemoOptIn] = useState(false);
  const [memo, setMemo] = useState("");
  const [phase, setPhase] = useState<"entry" | "ack">("entry");
  const [validationJa, setValidationJa] = useState<string | null>(null);
  const [ack, setAck] = useState<{ ackId: string; copyJa: string } | null>(null);
  const [saveState, setSaveState] = useState<SaveState>({ kind: "idle" });
  const [hintRevealed, setHintRevealed] = useState(false);
  const [history, setHistory] = useState<HistoryPayload | null>(null);
  const [historyState, setHistoryState] = useState<"loading" | "ready" | "unavailable" | "anonymous">("loading");
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [deleteConfirmDate, setDeleteConfirmDate] = useState<string | null>(null);
  const [resumed, setResumed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setHydrated(true));
  }, []);

  const answeredCount = DEF.fields.filter((f) => values[f.fieldId]).length;

  const loadHistory = useCallback(async () => {
    if (!authenticated) {
      queueMicrotask(() => setHistoryState("anonymous"));
      return;
    }
    try {
      const res = await fetch(`/api/tests/daily-check-in/records?timezone=${encodeURIComponent(timezone)}`, { cache: "no-store" });
      if (!res.ok) {
        setHistoryState("unavailable");
        return;
      }
      setHistory((await res.json()) as HistoryPayload);
      setHistoryState("ready");
    } catch {
      setHistoryState("unavailable");
    }
  }, [authenticated, timezone]);

  useEffect(() => {
    queueMicrotask(() => void loadHistory());
  }, [loadHistory]);

  // Authentication continuation: resume a pending anonymous entry exactly once.
  useEffect(() => {
    if (!authenticated) return;
    const pending: PendingDailyEntry | null = takePendingDailyEntry();
    if (!pending) return;
    queueMicrotask(() => {
      setValues((prev) => ({ ...prev, ...pending.values }));
      setMemoOptIn(pending.memoOptIn);
      setMemo(pending.memo ?? "");
      setResumed(true);
    });
  }, [authenticated]);

  const submitEntry = () => {
    if (answeredCount === 0) {
      setValidationJa("どれかひとつ選ぶと、きょうの記録になります。メモだけでは記録になりません。");
      return;
    }
    setValidationJa(null);
    const isFirst = authenticated ? (history?.records.length ?? 0) === 0 : true;
    setAck(selectAcknowledgement(values, isFirst));
    setPhase("ack");
  };

  const save = async (asCorrection: string | null) => {
    setSaveState({ kind: "saving" });
    const producedAt = new Date().toISOString();
    const entryLocalDate = localDateForInstant(producedAt, timezone) ?? producedAt.slice(0, 10);
    try {
      const res = asCorrection
        ? await fetch(`/api/tests/daily-check-in/records/${asCorrection}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ values, memoOptIn, memo: memoOptIn && memo ? memo : null }),
          })
        : await fetch("/api/tests/daily-check-in/records", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ values, memoOptIn, memo: memoOptIn && memo ? memo : null, producedAt, entryLocalDate, timezone }),
          });
      if (res.status === 401) {
        storePendingDailyEntry({ values, memoOptIn, memo: memoOptIn && memo ? memo : null, entryLocalDate, timezone });
        setSaveState({ kind: "login_needed" });
        return;
      }
      if (res.status === 409) {
        setSaveState({ kind: "exists" });
        return;
      }
      if (res.status === 503) {
        setSaveState({ kind: "backend_unavailable" });
        return;
      }
      if (!res.ok) {
        setSaveState({ kind: "error" });
        return;
      }
      const data = (await res.json()) as { currentVersion: number; ackId: string; acknowledgementJa: string };
      setAck({ ackId: data.ackId, copyJa: data.acknowledgementJa });
      setSaveState({ kind: "saved", version: data.currentVersion });
      setEditingDate(null);
      void loadHistory();
    } catch {
      setSaveState({ kind: "error" });
    }
  };

  const deleteEntry = async (date: string) => {
    try {
      const res = await fetch(`/api/tests/daily-check-in/records/${date}`, { method: "DELETE" });
      setDeleteConfirmDate(null);
      if (res.ok) void loadHistory();
    } catch {
      setDeleteConfirmDate(null);
    }
  };

  const hint = ack ? hintForEntry(values) : null;

  return (
    <main className="mx-auto w-full max-w-[640px] px-4 py-8" data-testid="daily-check-in" data-hydrated={hydrated ? "true" : undefined}>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-main)" }}>
          {DEF.nameJa}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-soft)" }}>
          {DEF.subtitleJa}
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-soft)" }}>
          {COPY.startPageJa}
        </p>
      </header>

      {resumed && phase === "entry" ? (
        <p className="surface-panel-soft mb-4 rounded-lg p-3 text-sm" data-testid="daily-resumed-note">
          とちゅうの記録を引き継ぎました。内容を確かめてから保存できます。
        </p>
      ) : null}

      {phase === "entry" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitEntry();
          }}
          noValidate
        >
          <div className="flex flex-col gap-5">
            {DEF.fields.map((field) => (
              <fieldset key={field.fieldId} className="surface-panel rounded-xl p-4" data-testid={`daily-field-${field.fieldId}`}>
                <legend className="text-base font-medium" style={{ color: "var(--text-main)" }}>
                  {field.labelJa}
                </legend>
                <p className="mt-0.5 text-xs" style={{ color: "var(--text-soft)" }}>
                  {field.helperJa}
                </p>
                <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={`${field.labelJa}（${COPY.accessibilityLabels.fieldGroupJa}）`}>
                  {field.options.map((option) => {
                    const selected = values[field.fieldId] === option.optionId;
                    return (
                      <label
                        key={option.optionId}
                        className="cursor-pointer rounded-full border px-3 py-2 text-sm transition-colors"
                        style={{
                          borderColor: selected ? "var(--cta-main)" : "var(--border-soft)",
                          background: selected ? "var(--cta-main)" : "var(--surface)",
                          color: selected ? "#fff" : "var(--text-main)",
                        }}
                      >
                        <input
                          type="radio"
                          name={field.fieldId}
                          value={option.optionId}
                          checked={selected}
                          onChange={() =>
                            setValues((prev) => ({ ...prev, [field.fieldId]: selected ? null : option.optionId }))
                          }
                          className="sr-only"
                        />
                        {option.labelJa}
                        {selected ? <span className="sr-only">（{COPY.accessibilityLabels.optionSelectedJa}）</span> : null}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <div className="surface-panel rounded-xl p-4">
              <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-main)" }}>
                <input
                  type="checkbox"
                  checked={memoOptIn}
                  onChange={(e) => {
                    setMemoOptIn(e.target.checked);
                    if (!e.target.checked) setMemo("");
                  }}
                  data-testid="daily-memo-opt-in"
                />
                {DEF.privateReflection.labelJa}
              </label>
              {memoOptIn ? (
                <div className="mt-3">
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value.slice(0, DEF.privateReflection.maxLength))}
                    maxLength={DEF.privateReflection.maxLength}
                    rows={3}
                    className="w-full rounded-lg border p-2 text-sm"
                    style={{ borderColor: "var(--border-soft)", background: "var(--surface)", color: "var(--text-main)" }}
                    aria-label={COPY.accessibilityLabels.memoJa}
                    data-testid="daily-memo-input"
                  />
                  <p className="mt-1 text-xs" style={{ color: "var(--text-soft)" }}>
                    {memo.length}/{DEF.privateReflection.maxLength}・自分だけに残ります
                  </p>
                </div>
              ) : null}
            </div>

            {validationJa ? (
              <p role="alert" className="rounded-lg border p-3 text-sm" style={{ borderColor: "var(--border-soft)", color: "var(--text-main)" }} data-testid="daily-validation">
                {validationJa}
              </p>
            ) : null}

            <button
              type="submit"
              className="rounded-full px-6 py-3 text-base font-medium text-white"
              style={{ background: "var(--cta-main)" }}
              data-testid="daily-submit"
            >
              きょうの記録を残す
            </button>
            <p className="text-center text-xs" style={{ color: "var(--text-soft)" }}>
              {COPY.privacyJa}
            </p>
          </div>
        </form>
      ) : null}

      {phase === "ack" && ack ? (
        <section aria-live="polite" data-testid="daily-ack">
          <div className="surface-panel rounded-xl p-5">
            <h2 className="text-sm font-medium" style={{ color: "var(--text-soft)" }}>
              きょうのひとこと
            </h2>
            <p className="mt-2 text-base leading-relaxed" style={{ color: "var(--text-main)" }} data-testid="daily-ack-copy">
              {ack.copyJa}
            </p>
            <p className="mt-3 text-sm" style={{ color: "var(--text-soft)" }}>
              {COPY.completionJa}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {saveState.kind === "idle" || saveState.kind === "error" || saveState.kind === "backend_unavailable" ? (
              <>
                <button
                  type="button"
                  onClick={() => void save(editingDate)}
                  className="rounded-full px-6 py-3 text-base font-medium text-white"
                  style={{ background: "var(--cta-main)" }}
                  data-testid="daily-save"
                >
                  {authenticated ? "この記録を保存する" : "サインインして保存する"}
                </button>
                {saveState.kind === "error" ? (
                  <p role="alert" className="text-sm" style={{ color: "var(--text-main)" }}>
                    保存できませんでした。時間をおいて、もういちどお試しください。
                  </p>
                ) : null}
                {saveState.kind === "backend_unavailable" ? (
                  <p role="alert" className="text-sm" style={{ color: "var(--text-main)" }} data-testid="daily-backend-unavailable">
                    いまは保存先に接続できません。記録の内容はこの画面に残っています。
                  </p>
                ) : null}
              </>
            ) : null}

            {saveState.kind === "saving" ? (
              <p className="text-sm" style={{ color: "var(--text-soft)" }}>
                保存しています…
              </p>
            ) : null}

            {saveState.kind === "login_needed" ? (
              <div className="surface-panel-soft rounded-xl p-4" data-testid="daily-login-needed">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-main)" }}>
                  保存にはサインインが必要です。とちゅうの記録は、この端末に10分だけ残ります。
                </p>
                <a
                  href="/login?next=/tests/daily-check-in"
                  className="mt-3 inline-block rounded-full px-5 py-2.5 text-sm font-medium text-white"
                  style={{ background: "var(--cta-main)" }}
                >
                  サインインへ進む
                </a>
              </div>
            ) : null}

            {saveState.kind === "exists" ? (
              <p role="alert" className="surface-panel-soft rounded-xl p-4 text-sm" data-testid="daily-exists">
                きょうの記録はすでにあります。履歴の「なおす」から、内容をなおせます（前の内容は履歴として残ります）。
              </p>
            ) : null}

            {saveState.kind === "saved" ? (
              <p className="surface-panel-soft rounded-xl p-4 text-sm" data-testid="daily-saved">
                {COPY.completionJa}（v{saveState.version}）・{COPY.retestJa}
              </p>
            ) : null}

            {hint && hint.tag !== "no_recommendation" && saveState.kind === "saved" ? (
              <div className="surface-panel rounded-xl p-4" data-testid="daily-hint">
                {!hintRevealed ? (
                  <button
                    type="button"
                    onClick={() => setHintRevealed(true)}
                    className="soft-link text-sm"
                    data-testid="daily-hint-reveal"
                  >
                    きょうの「ほしいもの」にそった小さなヒントを見る（任意）
                  </button>
                ) : (
                  <div>
                    <p className="text-sm" style={{ color: "var(--text-main)" }}>
                      {hint.fitReasonJa}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: "var(--text-soft)" }}>
                      これはヒントであって、判定ではありません。ここだけに表示され、共有されません。
                    </p>
                  </div>
                )}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setPhase("entry");
                setSaveState({ kind: "idle" });
                setHintRevealed(false);
              }}
              className="soft-link text-sm"
              data-testid="daily-back-to-entry"
            >
              入力にもどる
            </button>
          </div>
        </section>
      ) : null}

      <section className="mt-10" aria-label={COPY.accessibilityLabels.timelineJa}>
        <h2 className="text-lg font-medium" style={{ color: "var(--text-main)" }}>
          {COPY.timeline7Ja}
        </h2>
        {historyState === "anonymous" ? (
          <p className="mt-2 text-sm" style={{ color: "var(--text-soft)" }} data-testid="daily-history-anonymous">
            サインインすると、記録が非公開の履歴として残り、7日・30日の眺めが見られます。
          </p>
        ) : null}
        {historyState === "loading" ? (
          <p className="mt-2 text-sm" style={{ color: "var(--text-soft)" }}>
            読み込んでいます…
          </p>
        ) : null}
        {historyState === "unavailable" ? (
          <p className="mt-2 text-sm" style={{ color: "var(--text-soft)" }} data-testid="daily-history-unavailable">
            いまは履歴に接続できません。きょうの記録はこの画面から行えます。
          </p>
        ) : null}
        {historyState === "ready" && history ? (
          <div data-testid="daily-history">
            {history.records.length === 0 ? (
              <p className="mt-2 text-sm" style={{ color: "var(--text-soft)" }}>
                {COPY.emptyHistoryJa}
              </p>
            ) : (
              <>
                {history.sevenDay.insufficientCopyJa ? (
                  <p className="mt-2 text-sm" style={{ color: "var(--text-soft)" }} data-testid="daily-7day-insufficient">
                    {history.sevenDay.insufficientCopyJa}
                  </p>
                ) : (
                  <ul className="mt-2 flex flex-col gap-1">
                    {history.sevenDay.summaries.map((s) => (
                      <li key={s.summaryId} className="text-sm" style={{ color: "var(--text-main)" }} data-testid={`daily-summary-${s.summaryId}`}>
                        {s.copyJa}
                      </li>
                    ))}
                  </ul>
                )}
                <ul className="mt-4 flex flex-col gap-2" aria-label="日ごとの記録の一覧">
                  {history.records.map((r) => (
                    <li key={r.entryLocalDate} className="surface-panel flex flex-wrap items-center justify-between gap-2 rounded-lg p-3" data-testid={`daily-record-${r.entryLocalDate}`}>
                      <div className="min-w-0">
                        <span className="text-sm font-medium" style={{ color: "var(--text-main)" }}>
                          {r.entryLocalDate}
                        </span>
                        <span className="ml-2 text-sm" style={{ color: "var(--text-soft)" }}>
                          {optionLabelJa("kokoro_tenki", r.stateValues.kokoro_tenki) ?? "記録あり"}
                          {r.currentVersion > 1 ? `・なおした記録（v${r.currentVersion}）` : ""}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        {r.entryLocalDate === history.today ? (
                          <button
                            type="button"
                            className="soft-link text-sm"
                            onClick={() => {
                              setValues((prev) => ({ ...prev, ...r.stateValues }));
                              setMemoOptIn(Boolean(r.memo));
                              setMemo(r.memo ?? "");
                              setEditingDate(r.entryLocalDate);
                              setPhase("entry");
                              setSaveState({ kind: "idle" });
                            }}
                            data-testid={`daily-edit-${r.entryLocalDate}`}
                          >
                            なおす
                          </button>
                        ) : null}
                        <button type="button" className="soft-link text-sm" onClick={() => setDeleteConfirmDate(r.entryLocalDate)} data-testid={`daily-delete-${r.entryLocalDate}`}>
                          消す
                        </button>
                      </div>
                      {deleteConfirmDate === r.entryLocalDate ? (
                        <div className="w-full rounded-lg border p-3" style={{ borderColor: "var(--border-soft)" }} role="alertdialog" aria-label="記録の削除の確認" data-testid="daily-delete-confirm">
                          <p className="text-sm" style={{ color: "var(--text-main)" }}>
                            {r.entryLocalDate} の記録を消しますか。表示からは消え、内容は見えなくなります。
                          </p>
                          <div className="mt-2 flex gap-3">
                            <button type="button" className="rounded-full border px-4 py-1.5 text-sm" style={{ borderColor: "var(--cta-main)", color: "var(--cta-main)" }} onClick={() => void deleteEntry(r.entryLocalDate)} data-testid="daily-delete-confirm-yes">
                              消す
                            </button>
                            <button type="button" className="soft-link text-sm" onClick={() => setDeleteConfirmDate(null)}>
                              やめる
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <h3 className="text-base font-medium" style={{ color: "var(--text-main)" }}>
                    {COPY.timeline30Ja}
                  </h3>
                  {history.thirtyDay.sufficient ? (
                    <p className="mt-1 text-sm" style={{ color: "var(--text-main)" }} data-testid="daily-30day">
                      {history.thirtyDay.mostFrequentNeedJa
                        ? `記録した日の中でいちばん多かった「ほしいもの」は「${history.thirtyDay.mostFrequentNeedJa}」でした。`
                        : "記録した日の「ほしいもの」は、まだかたよりが見えていません。"}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm" style={{ color: "var(--text-soft)" }} data-testid="daily-30day-insufficient">
                      {history.thirtyDay.insufficientCopyJa}
                    </p>
                  )}
                </div>
              </>
            )}
            <p className="mt-4 text-xs" style={{ color: "var(--text-soft)" }}>
              {COPY.retestJa}・{DEF.cadence.gapCopyJa}
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
