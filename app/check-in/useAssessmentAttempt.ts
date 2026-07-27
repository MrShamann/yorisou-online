"use client";
// UX-2 / ICP-1 Priority 2 — server-authoritative attempt persistence for the public 120Q.
//
// The server is authoritative for the accepted journey. Local component state remains for
// responsiveness, but progress is persisted to the real database so a refresh, a browser
// back/forward, or a device sleep no longer destroys the journey. The attempt credential lives in
// an httpOnly cookie the page script cannot read — nothing sensitive is placed in the URL.

import { useCallback, useEffect, useRef, useState } from "react";

export type AttemptSnapshot = {
  id: string;
  status: "in_progress" | "completed" | "abandoned";
  answers: Record<string, string>;
  answeredCount: number;
  requiredCount: number;
  claimed: boolean;
};

export type AttemptSaveState = "idle" | "saving" | "saved" | "error";

export function useAssessmentAttempt() {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [restored, setRestored] = useState<AttemptSnapshot | null>(null);
  const [restoreChecked, setRestoreChecked] = useState(false);
  const [saveState, setSaveState] = useState<AttemptSaveState>("idle");
  const pendingRef = useRef<Record<string, string> | null>(null);
  const flushTimerRef = useRef<number | null>(null);
  const startingRef = useRef(false);

  // Resume: ask the server whether this visitor already has an in-progress attempt.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/assessment/attempts", { method: "GET", cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { attempt: AttemptSnapshot | null };
        if (cancelled || !data.attempt) return;
        if (data.attempt.status === "in_progress") {
          setAttemptId(data.attempt.id);
          setRestored(data.attempt);
        }
      } catch {
        // Resume is best-effort: a failure must never block starting fresh.
      } finally {
        if (!cancelled) setRestoreChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const startAttempt = useCallback(async (entrySource?: string) => {
    if (attemptId || startingRef.current) return attemptId;
    startingRef.current = true;
    try {
      const res = await fetch("/api/assessment/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entrySource }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { attemptId: string };
      setAttemptId(data.attemptId);
      return data.attemptId;
    } catch {
      return null;
    } finally {
      startingRef.current = false;
    }
  }, [attemptId]);

  const flush = useCallback(async () => {
    const id = attemptId;
    const answers = pendingRef.current;
    if (!id || !answers) return;
    pendingRef.current = null;
    setSaveState("saving");
    try {
      const res = await fetch(`/api/assessment/attempts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      setSaveState(res.ok ? "saved" : "error");
    } catch {
      setSaveState("error");
    }
  }, [attemptId]);

  // Debounced progress save — coalesces rapid answering into few writes.
  const saveProgress = useCallback(
    (answers: Record<string, string>) => {
      pendingRef.current = answers;
      if (flushTimerRef.current) window.clearTimeout(flushTimerRef.current);
      flushTimerRef.current = window.setTimeout(() => {
        void flush();
      }, 600);
    },
    [flush],
  );

  // Never lose the last answer when the tab is hidden or closed.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      if (flushTimerRef.current) window.clearTimeout(flushTimerRef.current);
    };
  }, [flush]);

  // Server-authoritative completion: the server scores and returns the persisted result id.
  const completeAttempt = useCallback(
    async (answers: Record<string, string>) => {
      const id = attemptId;
      if (!id) return null;
      if (flushTimerRef.current) window.clearTimeout(flushTimerRef.current);
      try {
        const res = await fetch(`/api/assessment/attempts/${id}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });
        if (!res.ok) return null;
        return (await res.json()) as { resultRowId: string; resultId: string };
      } catch {
        return null;
      }
    },
    [attemptId],
  );

  return { attemptId, restored, restoreChecked, saveState, startAttempt, saveProgress, completeAttempt };
}
