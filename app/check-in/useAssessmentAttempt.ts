"use client";
// UX-2 / ICP-1 — server-authoritative attempt persistence for the public 120Q.
//
// Corrected after the continuation quality gate. The earlier version made three claims it did not
// deliver, and this file now either delivers them or does not claim them:
//   • pending answers were cleared BEFORE the request, so a failed save lost the retry state;
//   • saves could overlap, letting a slow older response overwrite newer answers;
//   • "Never lose" rested on an ordinary visibilitychange fetch, which is not guaranteed to run.
// The queue below is serialized and last-write-wins, pending state survives failure, and page-hide
// uses keepalive. The authoritative safeguard is that completion sends the full answer set itself.

import { useCallback, useEffect, useRef, useState } from "react";

export type AttemptSnapshot = {
  id: string;
  status: "in_progress" | "completed" | "abandoned";
  answers: Record<string, string>;
  answeredCount: number;
  requiredCount: number;
  claimed: boolean;
};

export type SaveState = "idle" | "saving" | "saved" | "error";
export type StartState = "idle" | "starting" | "ready" | "error";

export function useAssessmentAttempt() {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [restored, setRestored] = useState<AttemptSnapshot | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [startState, setStartState] = useState<StartState>("idle");
  const [expired, setExpired] = useState(false);

  const attemptIdRef = useRef<string | null>(null);
  const pendingRef = useRef<Record<string, string> | null>(null);
  const inFlightRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const retryRef = useRef(0);

  const setAttempt = useCallback((id: string | null) => {
    attemptIdRef.current = id;
    setAttemptId(id);
  }, []);

  // Resume: ask the server whether this visitor already has an in-progress attempt.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/assessment/attempts", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { attempt: AttemptSnapshot | null };
        if (!cancelled && data.attempt?.status === "in_progress") setRestored(data.attempt);
      } catch {
        // best-effort; never blocks a fresh start
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── serialized save queue ──────────────────────────────────────────────────
  // Only one request in flight. Answers arriving mid-save stay queued. Pending state is cleared
  // ONLY after the server acknowledges, so a failure always retains the newest snapshot.
  const drain = useCallback(async () => {
    if (inFlightRef.current) return;
    const id = attemptIdRef.current;
    if (!id || !pendingRef.current) return;

    inFlightRef.current = true;
    setSaveState("saving");
    try {
      while (pendingRef.current) {
        const snapshot: Record<string, string> = pendingRef.current; // newest wins
        const res = await fetch(`/api/assessment/attempts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: snapshot }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          if (body.error === "attempt_expired") {
            setExpired(true);
            pendingRef.current = null; // an expired attempt can never accept this write
            setSaveState("error");
            return;
          }
          throw new Error(body.error || "save_failed");
        }
        // Clear ONLY the exact snapshot we just persisted; anything newer stays queued.
        if (pendingRef.current === snapshot) pendingRef.current = null;
        retryRef.current = 0;
        setSaveState("saved");
      }
    } catch {
      setSaveState("error");
      // Bounded backoff retry; the pending snapshot is deliberately still held.
      retryRef.current = Math.min(retryRef.current + 1, 5);
      const delay = Math.min(1000 * 2 ** (retryRef.current - 1), 15000);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => void drain(), delay);
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  const saveProgress = useCallback(
    (answers: Record<string, string>) => {
      pendingRef.current = answers;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => void drain(), 500);
    },
    [drain],
  );

  const retrySave = useCallback(() => {
    retryRef.current = 0;
    void drain();
  }, [drain]);

  // Page hide: keepalive gives the request a real chance to finish after the page goes away.
  // This is a best-effort improvement, NOT a guarantee — the guarantee is that completion
  // itself carries the full answer set.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState !== "hidden") return;
      const id = attemptIdRef.current;
      const snapshot = pendingRef.current;
      if (!id || !snapshot) return;
      try {
        void fetch(`/api/assessment/attempts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: snapshot }),
          keepalive: true,
        });
      } catch {
        // ignored: the awaited completion request remains the authoritative safeguard
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  // ── start: awaited, so question 1 can never be answered before the attempt exists ──
  const startAttempt = useCallback(
    async (entrySource?: string) => {
      if (startState === "starting") return null;
      setStartState("starting");
      try {
        const res = await fetch("/api/assessment/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entrySource }),
        });
        if (!res.ok) {
          setStartState("error");
          return null;
        }
        const data = (await res.json()) as { attemptId: string };
        setAttempt(data.attemptId);
        setExpired(false);
        setStartState("ready");
        return data.attemptId;
      } catch {
        setStartState("error");
        return null;
      }
    },
    [setAttempt, startState],
  );

  const adoptRestoredAttempt = useCallback(
    (snapshot: AttemptSnapshot) => {
      setAttempt(snapshot.id);
      setStartState("ready");
      setExpired(false);
    },
    [setAttempt],
  );

  // ── completion: awaited and authoritative ─────────────────────────────────
  // Sends the full answer set, so it also persists any answer a progress save missed.
  const completeAttempt = useCallback(
    async (answers: Record<string, string>) => {
      const id = attemptIdRef.current;
      if (!id) return { ok: false as const, error: "attempt_missing" };
      if (timerRef.current) window.clearTimeout(timerRef.current);
      try {
        const res = await fetch(`/api/assessment/attempts/${id}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });
        const body = (await res.json().catch(() => ({}))) as {
          resultRowId?: string;
          resultId?: string;
          error?: string;
        };
        if (!res.ok || !body.resultRowId) {
          if (body.error === "attempt_expired") setExpired(true);
          return { ok: false as const, error: body.error || "complete_failed" };
        }
        pendingRef.current = null; // the full set is now persisted by completion itself
        return { ok: true as const, resultRowId: body.resultRowId, resultId: body.resultId };
      } catch {
        return { ok: false as const, error: "network" };
      }
    },
    [],
  );

  return {
    attemptId,
    restored,
    saveState,
    startState,
    expired,
    hasPendingSave: pendingRef.current !== null,
    startAttempt,
    adoptRestoredAttempt,
    saveProgress,
    retrySave,
    completeAttempt,
  };
}
