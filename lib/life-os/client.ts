// OSF-1 — the browser-side client for /api/life-os.
//
// Thin on purpose: it posts, it reads the error code, and it never interprets. Every surface below
// needs to tell someone the truth about whether something was saved to their account, and the only
// way to do that honestly is to distinguish "not signed in" (401 — expected, not an error) from "the
// save failed" (everything else). A client that collapsed those into a boolean would leave the UI
// saying 保存しました when nothing was.

export type LifeOsResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "unauthenticated" }
  | { ok: false; reason: "failed"; code: string };

export async function lifeOsPost<T>(body: Record<string, unknown>): Promise<LifeOsResult<T>> {
  let response: Response;
  try {
    response = await fetch("/api/life-os", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, reason: "failed", code: "network_unavailable" };
  }
  if (response.status === 401) return { ok: false, reason: "unauthenticated" };
  const payload = (await response.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!response.ok) {
    return { ok: false, reason: "failed", code: payload?.error ?? `http_${response.status}` };
  }
  return { ok: true, data: payload as T };
}

export async function lifeOsGet<T>(view: string): Promise<LifeOsResult<T>> {
  let response: Response;
  try {
    response = await fetch(`/api/life-os?view=${encodeURIComponent(view)}`, { cache: "no-store" });
  } catch {
    return { ok: false, reason: "failed", code: "network_unavailable" };
  }
  if (response.status === 401) return { ok: false, reason: "unauthenticated" };
  const payload = (await response.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!response.ok) return { ok: false, reason: "failed", code: payload?.error ?? `http_${response.status}` };
  return { ok: true, data: payload as T };
}
