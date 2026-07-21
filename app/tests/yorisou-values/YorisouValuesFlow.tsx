"use client";
// YV-1 — yorisou-values「いま大事にしたいことチェック」Japanese one-pair-per-screen flow.
// All canonical copy comes from the generated artifact (never authored here).
// Low-pressure: no timer, no countdown, no streak, no gamified ranking, no
// "correct" answer, no scientific confidence score. Internal win rates are NEVER
// requested or displayed — the server returns only canonical result content.

import { useCallback, useEffect, useState } from "react";
import {
  YORISOU_VALUES_DEFINITION,
  YORISOU_VALUES_BANK_HASH,
} from "@/lib/yorisou/methods/yorisou-values/definition.generated";
import {
  checkPendingValuesCompatibility,
  discardPendingValuesProgress,
  storePendingValuesProgress,
  readPendingValuesProgress,
} from "./pendingProgress";

const DEF = YORISOU_VALUES_DEFINITION;
const TOTAL = DEF.items.length;

type Answers = Record<string, "A" | "B">;

type ResultPayload = {
  resultId: string;
  isMixed: boolean;
  public: (typeof DEF.results)[number]["public"];
  private: (typeof DEF.results)[number]["private"];
  secondarySignal: { labelJa: string; dimensionId: string; nameJa: string } | null;
  closeSet: { labelJa: string; dimensions: { dimensionId: string; nameJa: string }[] } | null;
  confirmation: string;
  currentVersion: number;
  hints: { tag: string; fitReasonJa: string | null }[];
};

type Phase = "intro" | "questions" | "review" | "result";

function provenanceBody(answers: Answers, confirmation?: string) {
  return {
    answers,
    ...(confirmation ? { confirmation } : {}),
    methodVersion: DEF.methodVersion,
    bankVersion: DEF.bankVersion,
    scoringVersion: DEF.scoringVersion,
    resultSchemaVersion: DEF.resultSchemaVersion,
    bankContentHash: YORISOU_VALUES_BANK_HASH,
  };
}

export function YorisouValuesFlow({ authenticated }: { authenticated: boolean }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [staleResume, setStaleResume] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "login_needed" | "backend_unavailable" | "error">("idle");
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState(false);
  const [confirmState, setConfirmState] = useState<"idle" | "saving" | "error">("idle");
  const [history, setHistory] = useState<{ id: string; producedAt: string; displayNameJa: string | null; isMixed: boolean; currentVersion: number }[] | null>(null);
  const [historyState, setHistoryState] = useState<"loading" | "ready" | "unavailable" | "anonymous">("loading");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const answeredCount = Object.keys(answers).length;
  const remaining = TOTAL - answeredCount;
  const current = DEF.items[index];

  useEffect(() => {
    queueMicrotask(() => setHydrated(true));
  }, []);

  const loadHistory = useCallback(async () => {
    if (!authenticated) {
      queueMicrotask(() => setHistoryState("anonymous"));
      return;
    }
    try {
      const res = await fetch("/api/tests/yorisou-values/assessments", { cache: "no-store" });
      if (!res.ok) {
        setHistoryState("unavailable");
        return;
      }
      const data = (await res.json()) as { assessments: typeof history };
      setHistory(data.assessments);
      setHistoryState("ready");
    } catch {
      setHistoryState("unavailable");
    }
  }, [authenticated]);

  useEffect(() => {
    queueMicrotask(() => void loadHistory());
  }, [loadHistory]);

  // Resume (YV-C7): PEEK the pending progress — do NOT consume it merely by
  // reading. Verify provenance BEFORE applying. A stale/incompatible entry is
  // discarded and the truthful incompatibility state is shown; a compatible
  // entry is applied and LEFT in place (recoverable) until the user explicitly
  // discards it or an authenticated save succeeds.
  useEffect(() => {
    const pending = readPendingValuesProgress();
    if (!pending) return;
    const compat = checkPendingValuesCompatibility(pending, {
      methodVersion: DEF.methodVersion,
      bankVersion: DEF.bankVersion,
      scoringVersion: DEF.scoringVersion,
      resultSchemaVersion: DEF.resultSchemaVersion,
      bankContentHash: YORISOU_VALUES_BANK_HASH,
    });
    if (!compat.compatible) {
      discardPendingValuesProgress(); // stale/expired → cleared, truthful notice shown
      queueMicrotask(() => setStaleResume(true));
      return;
    }
    const count = Object.keys(pending.answers).length;
    queueMicrotask(() => {
      setAnswers(pending.answers);
      if (count >= TOTAL) {
        // All 48 answered — open DIRECTLY on the completed review/save state.
        // The user is NOT sent back to answer question 48 again, and nothing is
        // persisted automatically; saving is an explicit action in review.
        setIndex(TOTAL - 1);
        setPhase("review");
      } else {
        // Partial — resume at the first unanswered question.
        setIndex(Math.min(count, TOTAL - 1));
        setPhase("questions");
      }
    });
  }, []);

  const answer = (side: "A" | "B") => {
    const next = { ...answers, [current.itemId]: side };
    setAnswers(next);
    if (index < TOTAL - 1) setIndex(index + 1);
    else setPhase("review");
  };

  const saveLater = () => {
    storePendingValuesProgress({
      answers,
      methodVersion: DEF.methodVersion,
      bankVersion: DEF.bankVersion,
      scoringVersion: DEF.scoringVersion,
      resultSchemaVersion: DEF.resultSchemaVersion,
      bankContentHash: YORISOU_VALUES_BANK_HASH,
    });
    setPhase("intro");
  };

  const rememberProgress = () =>
    storePendingValuesProgress({
      answers,
      methodVersion: DEF.methodVersion,
      bankVersion: DEF.bankVersion,
      scoringVersion: DEF.scoringVersion,
      resultSchemaVersion: DEF.resultSchemaVersion,
      bankContentHash: YORISOU_VALUES_BANK_HASH,
    });

  // Anonymous, non-persistent scoring (YV-C3): a signed-out visitor sees their
  // result WITHOUT anything being stored. No assessmentId comes back — the
  // result is ephemeral. Saving requires an explicit sign-in step afterward.
  const scoreAnonymously = async () => {
    if (answeredCount < TOTAL) return;
    setSaveState("saving");
    try {
      const res = await fetch("/api/tests/yorisou-values/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(provenanceBody(answers)),
      });
      if (!res.ok) {
        setSaveState("error");
        return;
      }
      const data = (await res.json()) as Omit<ResultPayload, "confirmation" | "currentVersion">;
      setResult({ ...data, confirmation: "skipped", currentVersion: 0 });
      setAssessmentId(null); // ephemeral: nothing persisted
      setPhase("result");
      setSaveState("idle");
    } catch {
      setSaveState("error");
    }
  };

  // Authenticated persistence: POST creates the record; the recomputed result is
  // then read back from the owned record.
  const submit = async () => {
    if (answeredCount < TOTAL) return; // insufficient coverage — handled in review UI
    if (saveState === "saving") return; // YV-C7: guard against duplicate saves (double-click / refresh)
    if (!authenticated) return scoreAnonymously();
    setSaveState("saving");
    try {
      const res = await fetch("/api/tests/yorisou-values/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(provenanceBody(answers)),
      });
      if (res.status === 401) {
        rememberProgress();
        setSaveState("login_needed");
        return;
      }
      if (res.status === 503) {
        setSaveState("backend_unavailable");
        return;
      }
      if (!res.ok) {
        setSaveState("error");
        return;
      }
      const created = (await res.json()) as { assessmentId: string };
      // YV-C7: exactly one owned assessment was created — the pending on-device
      // progress is now cleared (cleared ONLY on a successful save), so a refresh
      // cannot resume into review and create a duplicate.
      discardPendingValuesProgress();
      const detail = await fetch(`/api/tests/yorisou-values/assessments/${created.assessmentId}`, { cache: "no-store" });
      if (detail.ok) {
        setResult((await detail.json()) as ResultPayload);
        setAssessmentId(created.assessmentId);
        setPhase("result");
        setSaveState("idle");
        void loadHistory();
      } else {
        // The record exists; only the follow-up read failed. Do NOT re-save.
        setAssessmentId(created.assessmentId);
        setSaveState("error");
      }
    } catch {
      setSaveState("error");
    }
  };

  // From an anonymous ephemeral result: keep the answers on this device and send
  // the visitor to sign in; after sign-in the pending answers resume and can be
  // saved as an owned record.
  const saveAnonymousResult = () => {
    rememberProgress();
    window.location.assign("/login?next=/tests/yorisou-values");
  };

  // YV-C8: truthful confirmation — the displayed confirmation updates ONLY when
  // the PATCH actually succeeds. On failure the UI is not changed and a truthful
  // error is shown. Concurrent clicks are ignored while a request is pending.
  const confirm = async (value: "confirmed" | "not_quite") => {
    if (!assessmentId) return;
    if (confirmState === "saving") return; // prevent uncontrolled duplicate clicks
    setConfirmState("saving");
    try {
      const res = await fetch(`/api/tests/yorisou-values/assessments/${assessmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: value }),
      });
      if (!res.ok) {
        setConfirmState("error"); // do NOT claim it was recorded
        return;
      }
      const data = (await res.json().catch(() => null)) as { confirmation?: string } | null;
      const recorded = (data?.confirmation as "confirmed" | "not_quite" | "skipped" | undefined) ?? value;
      setResult((r) => (r ? { ...r, confirmation: recorded } : r));
      setConfirmState("idle");
    } catch {
      setConfirmState("error");
    }
  };

  const revealHints = async () => {
    // Owned record → read hints from it; anonymous ephemeral result → re-score
    // with hints (still non-persistent, answers never stored server-side).
    const res = assessmentId
      ? await fetch(`/api/tests/yorisou-values/assessments/${assessmentId}?hints=1`, { cache: "no-store" })
      : await fetch(`/api/tests/yorisou-values/score?hints=1`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(provenanceBody(answers)),
        });
    if (res.ok) {
      const data = (await res.json()) as ResultPayload;
      setResult((r) => (r ? { ...r, hints: data.hints } : r));
      setHintsRevealed(true);
    }
  };

  const deleteAssessment = async (id: string) => {
    await fetch(`/api/tests/yorisou-values/assessments/${id}`, { method: "DELETE" }).catch(() => null);
    setDeleteConfirmId(null);
    void loadHistory();
  };

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setAssessmentId(null);
    setHintsRevealed(false);
    setStaleResume(false);
    discardPendingValuesProgress();
    setPhase("intro");
  };

  const cta = { background: "var(--cta-main)", color: "#fff" };
  const panel = { borderColor: "var(--border-soft)", background: "var(--surface)", color: "var(--text-main)" };

  return (
    <main className="mx-auto w-full max-w-[640px] px-4 py-8" data-testid="yorisou-values" data-hydrated={hydrated ? "true" : undefined}>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-main)" }}>{DEF.nameJa}</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-soft)" }}>{DEF.subtitleJa}</p>
      </header>

      {staleResume && phase === "intro" ? (
        <p className="surface-panel-soft mb-4 rounded-lg p-3 text-sm" data-testid="yv-stale-resume-note">
          チェックの内容が新しくなったため、とちゅうの回答は引き継げませんでした。お手数ですが、はじめから回答してください。
        </p>
      ) : null}

      {phase === "intro" ? (
        <section data-testid="yv-intro" className="surface-panel rounded-xl p-5">
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-main)" }}>
            48問のA/Bで、いまの選び方の傾向を見てみます。点数は出ません。回答は非公開です。
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-soft)" }} data-testid="yv-interpretation-limits">
            {DEF.interpretationLimitsJa}
          </p>
          <p className="mt-2 text-xs" style={{ color: "var(--text-soft)" }}>{DEF.scoring.confidenceBoundaryJa}</p>
          <button type="button" onClick={() => setPhase("questions")} className="mt-4 rounded-full px-6 py-3 text-base font-medium" style={cta} data-testid="yv-start">
            {answeredCount > 0 ? "つづきから始める" : "はじめる"}
          </button>
          {answeredCount > 0 ? (
            <p className="mt-2 text-xs" style={{ color: "var(--text-soft)" }}>とちゅうの回答が {answeredCount}/{TOTAL} 問あります。</p>
          ) : null}
        </section>
      ) : null}

      {phase === "questions" && current ? (
        <section data-testid="yv-question" aria-live="polite">
          <div className="mb-3 flex items-center justify-between text-xs" style={{ color: "var(--text-soft)" }}>
            <span data-testid="yv-progress" role="status">{index + 1} / {TOTAL}</span>
            <span>{DEF.items[index].itemId}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--border-soft)" }} aria-hidden="true">
            <div style={{ width: `${((index + 1) / TOTAL) * 100}%`, height: "100%", background: "var(--cta-main)" }} />
          </div>
          <h2 className="mt-5 text-lg font-medium" style={{ color: "var(--text-main)" }}>{current.promptJa}</h2>
          <div className="mt-4 flex flex-col gap-3">
            <button type="button" onClick={() => answer("A")} className="rounded-xl border p-4 text-left text-base" style={panel} data-testid="yv-choice-a">
              {current.choiceA.textJa}
            </button>
            <button type="button" onClick={() => answer("B")} className="rounded-xl border p-4 text-left text-base" style={panel} data-testid="yv-choice-b">
              {current.choiceB.textJa}
            </button>
          </div>
          <div className="mt-5 flex items-center justify-between text-sm">
            <button type="button" disabled={index === 0} onClick={() => setIndex(Math.max(0, index - 1))} className="soft-link disabled:opacity-40" data-testid="yv-back">
              もどる
            </button>
            <button type="button" onClick={saveLater} className="soft-link" data-testid="yv-save-later">
              とちゅうでやめる（この端末に保存）
            </button>
          </div>
        </section>
      ) : null}

      {phase === "review" ? (
        <section data-testid="yv-review" className="surface-panel rounded-xl p-5">
          {answeredCount < TOTAL ? (
            <div data-testid="yv-insufficient">
              <p className="text-sm" style={{ color: "var(--text-main)" }}>
                {DEF.scoring.insufficientCoverageCopyJa.replace("{remaining}", String(remaining))}
              </p>
              <button type="button" onClick={() => { setIndex(answeredCount); setPhase("questions"); }} className="mt-3 rounded-full px-5 py-2.5 text-sm font-medium" style={cta}>
                のこりを回答する
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm" style={{ color: "var(--text-main)" }}>48問すべて回答しました。結果を出しますか。</p>
              {saveState === "login_needed" ? (
                <div className="surface-panel-soft mt-3 rounded-xl p-4" data-testid="yv-login-needed">
                  <p className="text-sm" style={{ color: "var(--text-main)" }}>結果の保存にはサインインが必要です。回答はこの端末に残っています。</p>
                  <a href="/login?next=/tests/yorisou-values" className="mt-3 inline-block rounded-full px-5 py-2.5 text-sm font-medium" style={cta}>サインインへ進む</a>
                </div>
              ) : (
                <button type="button" onClick={() => void submit()} disabled={saveState === "saving"} className="mt-3 rounded-full px-6 py-3 text-base font-medium disabled:opacity-60" style={cta} data-testid="yv-submit">
                  {authenticated ? (saveState === "saving" ? "保存しています…" : "この結果を非公開で保存する") : "結果を見る（保存しない）"}
                </button>
              )}
              {!authenticated && saveState !== "login_needed" ? (
                <p className="mt-2 text-xs" style={{ color: "var(--text-soft)" }} data-testid="yv-anonymous-note">
                  サインインしなくても結果は見られます。保存はサインイン後に選べます。
                </p>
              ) : null}
              {saveState === "backend_unavailable" ? <p role="alert" className="mt-2 text-sm" style={{ color: "var(--text-main)" }} data-testid="yv-backend-unavailable">いまは保存先に接続できません。回答はこの画面に残っています。</p> : null}
              {saveState === "error" ? <p role="alert" className="mt-2 text-sm" style={{ color: "var(--text-main)" }}>結果を出せませんでした。時間をおいてお試しください。</p> : null}
            </div>
          )}
          <p className="mt-4 text-xs" style={{ color: "var(--text-soft)" }}>{DEF.usageBoundaryJa}</p>
        </section>
      ) : null}

      {phase === "result" && result ? (
        <section data-testid="yv-result" aria-live="polite">
          <div className="surface-panel rounded-xl p-5">
            <h2 className="text-xl font-semibold" style={{ color: "var(--text-main)" }} data-testid="yv-result-name">{result.public.displayNameJa}</h2>
            <p className="mt-2 text-base" style={{ color: "var(--text-main)" }}>{result.public.hookJa}</p>
            <p className="mt-2 text-sm" style={{ color: "var(--text-soft)" }}>{result.public.recognitionJa}</p>
            <ul className="mt-3 flex flex-col gap-1">
              {result.public.bulletsJa.map((b, i) => (
                <li key={i} className="text-sm" style={{ color: "var(--text-main)" }}>・{b}</li>
              ))}
            </ul>
            {result.secondarySignal ? (
              <p className="mt-3 text-sm" style={{ color: "var(--text-soft)" }} data-testid="yv-secondary">
                {result.secondarySignal.labelJa}：{result.secondarySignal.nameJa}
              </p>
            ) : null}
            {result.closeSet ? (
              <p className="mt-3 text-sm" style={{ color: "var(--text-soft)" }} data-testid="yv-close-set">
                {result.closeSet.labelJa}：{result.closeSet.dimensions.map((d) => d.nameJa).join("・")}
              </p>
            ) : null}
          </div>

          <div className="surface-panel mt-4 rounded-xl p-5" data-testid="yv-private">
            <h3 className="text-sm font-medium" style={{ color: "var(--text-soft)" }}>くわしく（自分だけに表示）</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-main)" }}>{result.private.detailJa}</p>
            <p className="mt-2 text-sm" style={{ color: "var(--text-soft)" }}>{result.private.currentPriorityPatternJa}</p>
            <p className="mt-3 text-xs" style={{ color: "var(--text-soft)" }}>{result.private.correctionPromptJa}</p>
          </div>

          {assessmentId ? (
            // Confirmation is a property of a STORED record — only offered when a
            // record exists. It never rewrites the computed result (YV-C1).
            <div className="mt-4 flex flex-wrap items-center gap-3" data-testid="yv-confirm">
              <button type="button" onClick={() => void confirm("confirmed")} disabled={confirmState === "saving"} className="rounded-full border px-4 py-2 text-sm disabled:opacity-50" style={{ borderColor: "var(--cta-main)", color: "var(--cta-main)" }} data-testid="yv-confirm-yes">近いと思う</button>
              <button type="button" onClick={() => void confirm("not_quite")} disabled={confirmState === "saving"} className="soft-link text-sm disabled:opacity-50" data-testid="yv-confirm-no">少し違う</button>
              {confirmState === "saving" ? <span className="text-sm" style={{ color: "var(--text-soft)" }} data-testid="yv-confirm-saving">記録しています…</span> : null}
              {confirmState === "error" ? <span role="alert" className="text-sm" style={{ color: "var(--text-main)" }} data-testid="yv-confirm-error">記録できませんでした。時間をおいてお試しください。</span> : null}
              {confirmState !== "saving" && confirmState !== "error" && result.confirmation !== "skipped" ? <span className="text-sm" style={{ color: "var(--text-soft)" }} data-testid="yv-confirm-recorded">（{result.confirmation === "confirmed" ? "近い" : "少し違う"}と記録しました）</span> : null}
            </div>
          ) : (
            // Anonymous ephemeral result — nothing was stored. Offer explicit save.
            <div className="surface-panel mt-4 rounded-xl p-4" data-testid="yv-anonymous-save">
              <p className="text-sm" style={{ color: "var(--text-main)" }}>この結果はまだ保存されていません。サインインすると、非公開の履歴として残せます。</p>
              <button type="button" onClick={saveAnonymousResult} className="mt-3 rounded-full px-5 py-2.5 text-sm font-medium" style={cta} data-testid="yv-anonymous-save-cta">サインインして保存</button>
            </div>
          )}

          <div className="surface-panel mt-4 rounded-xl p-4" data-testid="yv-hints">
            {!hintsRevealed ? (
              <button type="button" onClick={() => void revealHints()} className="soft-link text-sm" data-testid="yv-hints-reveal">
                いまの結果にそった小さなヒントを見る（任意・非公開）
              </button>
            ) : (
              <div>
                {result.hints.filter((h) => h.tag !== "no_recommendation").length === 0 ? (
                  <p className="text-sm" style={{ color: "var(--text-soft)" }}>いまはとくにヒントはありません。</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {result.hints.filter((h) => h.tag !== "no_recommendation").map((h) => (
                      <li key={h.tag} className="text-sm" style={{ color: "var(--text-main)" }}>{h.fitReasonJa}</li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-xs" style={{ color: "var(--text-soft)" }}>これはヒントであって、判定ではありません。ここだけに表示され、共有されません。</p>
              </div>
            )}
          </div>

          <div className="mt-5 flex gap-4">
            <button type="button" onClick={restart} className="soft-link text-sm" data-testid="yv-retake">もう一度やる（履歴は残ります）</button>
          </div>
        </section>
      ) : null}

      <section className="mt-10" data-testid="yv-history-section">
        <h2 className="text-lg font-medium" style={{ color: "var(--text-main)" }}>これまでの記録</h2>
        {historyState === "anonymous" ? (
          <p className="mt-2 text-sm" style={{ color: "var(--text-soft)" }} data-testid="yv-history-anonymous">サインインすると、結果が非公開の履歴として残ります。</p>
        ) : null}
        {historyState === "unavailable" ? (
          <p className="mt-2 text-sm" style={{ color: "var(--text-soft)" }} data-testid="yv-history-unavailable">いまは履歴に接続できません。</p>
        ) : null}
        {historyState === "ready" && history ? (
          history.length === 0 ? (
            <p className="mt-2 text-sm" style={{ color: "var(--text-soft)" }}>まだ記録はありません。</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-2" data-testid="yv-history">
              {history.map((h) => (
                <li key={h.id} className="surface-panel flex flex-wrap items-center justify-between gap-2 rounded-lg p-3" data-testid={`yv-record-${h.id}`}>
                  <div className="min-w-0">
                    <span className="text-sm font-medium" style={{ color: "var(--text-main)" }}>{h.displayNameJa ?? "結果"}</span>
                    <span className="ml-2 text-xs" style={{ color: "var(--text-soft)" }}>{h.producedAt.slice(0, 10)}{h.currentVersion > 1 ? `・v${h.currentVersion}` : ""}</span>
                  </div>
                  <button type="button" onClick={() => setDeleteConfirmId(h.id)} className="soft-link text-sm" data-testid={`yv-delete-${h.id}`}>消す</button>
                  {deleteConfirmId === h.id ? (
                    <div className="w-full rounded-lg border p-3" style={{ borderColor: "var(--border-soft)" }} role="alertdialog" aria-label="記録の削除の確認" data-testid="yv-delete-confirm">
                      <p className="text-sm" style={{ color: "var(--text-main)" }}>この記録を消しますか。回答と結果の内容は消去され、復元できません。</p>
                      <div className="mt-2 flex gap-3">
                        <button type="button" onClick={() => void deleteAssessment(h.id)} className="rounded-full border px-4 py-1.5 text-sm" style={{ borderColor: "var(--cta-main)", color: "var(--cta-main)" }} data-testid="yv-delete-confirm-yes">消す</button>
                        <button type="button" onClick={() => setDeleteConfirmId(null)} className="soft-link text-sm">やめる</button>
                      </div>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )
        ) : null}
      </section>
    </main>
  );
}
